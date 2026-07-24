/**
 * PRJ301 — Java Web Application Development (Phát triển ứng dụng Java web). Kỳ 4.
 * Bám syllabus FPTU (sylID 13165, 9 CLO). Tiên quyết: DBI202, PRO192.
 * Servlet/JSP, scope, JDBC, MVC, JPA, AI. Tomcat 9 + NetBeans 13 + SQL Server 2019.
 * Song ngữ EN/VN. Code Java/JSP <pre>+.tok-*. Ví dụ giải từng bước + ★ ngoài giáo trình.
 * Deep-link CodeLab java-core + sql + spring-boot; setup → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/PRJ301.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'PRJ301',
    slug: 'java-web-application-development',
    title: 'Java Web Application Development',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Build real Java web applications from the ground up: how HTTP works, Servlets and JSP, the four scopes, JDBC to a database, the MVC pattern, and JPA. The course where PRO192 (Java) and DBI202 (databases) finally combine into a working website.|||Xây ứng dụng Java web thật từ gốc: HTTP hoạt động ra sao, Servlet và JSP, bốn scope, JDBC tới cơ sở dữ liệu, mẫu MVC, và JPA. Môn học nơi PRO192 (Java) và DBI202 (CSDL) cuối cùng kết hợp thành một website chạy được.',
    description: 'Môn phát triển ứng dụng web bằng Java. Học các công nghệ lõi: Servlet & JSP, phạm vi chia sẻ trạng thái (page/request/session/application), kết nối cơ sở dữ liệu bằng JDBC, kiến trúc MVC (Model-View-Controller), JPA (ánh xạ đối tượng-quan hệ), và ứng dụng AI trong web Java. Đây là môn tổng hợp PRO192 (Java) và DBI202 (CSDL) thành một website hoàn chỉnh. Tiên quyết: DBI202 và PRO192.',
    whatYouLearn: 'Cách web hoạt động (HTTP request/response); Servlet (vòng đời, doGet/doPost, tham số); JSP, EL & JSTL; bốn phạm vi page/request/session/application; JDBC & mẫu DAO kết nối SQL Server; kiến trúc MVC với Servlet làm Controller; JPA & EntityManager; bảo mật cơ bản (SQL injection, session); và tích hợp AI trong ứng dụng Java web.',
    requirements: 'Tiên quyết: đạt DBI202 (SQL, thiết kế CSDL) và PRO192 (Java OOP). Cần cài Tomcat 9+, NetBeans 13+ (hoặc IntelliJ), JDK 8+, và SQL Server 2019+.',
    documentsNote: 'Giáo trình: Nicholas S. Williams — Professional Java for Web Applications (Wrox); Oracle JDBC & Servlet Filters docs. Công cụ: Tomcat 9+, NetBeans 13+, JDK 8+, SQL Server 2019+. Luyện: track Code Lab Java Core + SQL + Spring Boot. Kèm file syllabus gốc PRJ301.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, điều kiện qua môn, và cài đặt Tomcat/NetBeans/SQL Server.',
      lessons: [
        {
          title: '0.1 — About PRJ301 & the course map|||0.1 — Giới thiệu PRJ301 & bản đồ môn học',
          slug: 'prj301-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Java web là gì, môn này tổng hợp PRO192 + DBI202 ra sao, và lộ trình từ HTTP tới MVC/JPA.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About PRJ301 — Java Web Application Development</h2>
<p class="lead">This is where it all comes together. You know Java (PRO192) and databases (DBI202); PRJ301 connects them through the <strong>web</strong>. By the end you will build a dynamic website where a browser sends a request, your Java code processes it, talks to a database, and sends back a page — the architecture behind almost every real business application.</p>
<p>The heart of the course is the <strong>MVC pattern</strong> — a clean way to organise web code that you will use for the rest of your career.</p>
<h3>Course map</h3>
<div class="lz-map">
  <div class="lz-stage">The foundation</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">How the web works</div><div class="lz-nsub">HTTP · request/response · your first Servlet</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Servlets in depth</div><div class="lz-nsub">Lifecycle · doGet/doPost · parameters</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">JSP, EL &amp; JSTL</div><div class="lz-nsub">Generating HTML the clean way</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">The four scopes</div><div class="lz-nsub">page · request · session · application</div></div></div>
  <div class="lz-stage">Data &amp; architecture</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">JDBC &amp; the DAO pattern</div><div class="lz-nsub">Talking to SQL Server safely</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">The MVC architecture</div><div class="lz-nsub">Controller · Model · View — the core</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">JPA — object-relational mapping</div><div class="lz-nsub">Entities instead of raw SQL</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Web security · AI in Java web · toward Spring Boot</div><div class="lz-nsub">From coursework to industry</div></div></div>
</div>
<div class="callout ok">Web development is learned by building and refreshing the browser. Every chapter links to hands-on Java and SQL practice — type the code, deploy to Tomcat, and watch it run.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fjava-web-application-development%2Flearn&reflabel=PRJ301%20%E2%80%94%20Java%20Web%20Application%20Development#module-249" target="_blank" rel="noopener">
  <span class="lc-ico">☕</span>
  <span class="lc-body"><span class="lc-title">Refresh Java (OOP) for the web</span><span class="lc-sub">Java Core track — classes &amp; objects power your Model.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu PRJ301 — Phát triển ứng dụng Java web</h2>
<p class="lead">Đây là nơi mọi thứ hội tụ. Bạn biết Java (PRO192) và cơ sở dữ liệu (DBI202); PRJ301 nối chúng qua <strong>web</strong>. Cuối môn bạn sẽ xây một website động: trình duyệt gửi yêu cầu, code Java xử lý, nói chuyện với cơ sở dữ liệu, và gửi lại một trang — kiến trúc đằng sau gần như mọi ứng dụng doanh nghiệp thật.</p>
<p>Trái tim của môn là <strong>mẫu MVC</strong> — cách tổ chức code web sạch sẽ mà bạn sẽ dùng suốt sự nghiệp.</p>
<h3>Bản đồ môn học</h3>
<div class="lz-map">
  <div class="lz-stage">Nền tảng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Web hoạt động ra sao</div><div class="lz-nsub">HTTP · request/response · Servlet đầu tiên</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Servlet chuyên sâu</div><div class="lz-nsub">Vòng đời · doGet/doPost · tham số</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">JSP, EL &amp; JSTL</div><div class="lz-nsub">Sinh HTML một cách sạch sẽ</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Bốn phạm vi</div><div class="lz-nsub">page · request · session · application</div></div></div>
  <div class="lz-stage">Dữ liệu &amp; kiến trúc</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">JDBC &amp; mẫu DAO</div><div class="lz-nsub">Nói chuyện với SQL Server an toàn</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Kiến trúc MVC</div><div class="lz-nsub">Controller · Model · View — cốt lõi</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">JPA — ánh xạ đối tượng-quan hệ</div><div class="lz-nsub">Entity thay cho SQL thô</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Bảo mật web · AI trong Java web · hướng Spring Boot</div><div class="lz-nsub">Từ bài tập tới công nghiệp</div></div></div>
</div>
<div class="callout ok">Phát triển web học bằng cách xây và refresh trình duyệt. Mỗi chương link tới luyện Java và SQL thực hành — gõ code, deploy lên Tomcat, và xem nó chạy.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fjava-web-application-development%2Flearn&reflabel=PRJ301%20%E2%80%94%20Java%20Web%20Application%20Development#module-249" target="_blank" rel="noopener">
  <span class="lc-ico">☕</span>
  <span class="lc-body"><span class="lc-title">Ôn Java (OOP) cho web</span><span class="lc-sub">Track Java Core — lớp &amp; đối tượng là động cơ cho Model.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'prj301-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, tiên quyết, điểm sàn và cột điểm (có thi thực hành 85 phút code web).',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">From the official PRJ301 syllabus. Both a theory exam and a practical exam where you build a working web feature under time — so real coding skill, not memorisation, is what passes you.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class + TE + 85' PE + self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">DBI202 &amp; PRO192</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">Attend ≥ 80% of sessions</span></div>
</div>
<div class="callout warn">The <strong>Practical Exam (85 min)</strong> asks you to build a small MVC web feature — a form, a Servlet, a database query, a JSP page — that actually runs on Tomcat. The only preparation that works is building many small web apps yourself. Do the labs.</div>
<div class="note-ct">Because the prerequisites are DBI202 and PRO192, PRJ301 assumes you can already write Java classes and SQL queries. If either is shaky, revise it first — this course adds the web layer on top.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Từ syllabus chính thức PRJ301. Có cả thi lý thuyết và thi thực hành nơi bạn xây một chức năng web chạy được trong thời gian giới hạn — nên kỹ năng code thật, không phải học thuộc, mới giúp bạn qua.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h lớp + TE + 85' PE + tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">DBI202 &amp; PRO192</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua khi trung bình ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% buổi</span></div>
</div>
<div class="callout warn"><strong>Thi thực hành (85 phút)</strong> yêu cầu bạn xây một chức năng web MVC nhỏ — một form, một Servlet, một truy vấn CSDL, một trang JSP — chạy thật trên Tomcat. Cách chuẩn bị duy nhất hiệu quả là tự xây nhiều app web nhỏ. Hãy làm các lab.</div>
<div class="note-ct">Vì tiên quyết là DBI202 và PRO192, PRJ301 giả định bạn đã viết được lớp Java và truy vấn SQL. Nếu cái nào còn yếu, ôn lại trước — môn này thêm tầng web lên trên.</div>
</div>
`,
        },
        {
          title: '0.3 — Set up Tomcat, NetBeans & SQL Server|||0.3 — Cài Tomcat, NetBeans & SQL Server',
          slug: 'prj301-cai-dat',
          type: 'VIDEO',
          description: 'Bộ công cụ đúng theo môn: JDK + Tomcat 9 (server) + NetBeans 13 (IDE) + SQL Server 2019.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Set up your Java web environment</h2>
<p class="lead">A Java web app needs more pieces than a console app: a <strong>server</strong> (Tomcat) to run your Servlets, an <strong>IDE</strong> (NetBeans) wired to it, a <strong>JDK</strong>, and a <strong>database</strong> (SQL Server, from DBI202).</p>
<div class="lz-flow">
  <div class="lz-step">Install JDK 8+</div>
  <div class="lz-step">Install Tomcat 9+ (the web server)</div>
  <div class="lz-step">Install NetBeans 13+ &amp; connect Tomcat</div>
  <div class="lz-step">Have SQL Server 2019+ ready</div>
</div>
<div class="note-ct">A "server" here just means a program that listens for browser requests and runs your code. Tomcat is a <em>Servlet container</em> — it turns each HTTP request into a call to your Servlet.</div>
<a class="link-card exphub" href="/exp-hub/prj301-cai-dat-tomcat?ref=%2Fcourses%2Fjava-web-application-development%2Flearn&reflabel=PRJ301%20%E2%80%94%20Java%20Web%20Application%20Development" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Install Tomcat, NetBeans &amp; SQL Server</span><span class="lc-sub">Step-by-step with official download links — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Cài môi trường Java web</h2>
<p class="lead">Một app Java web cần nhiều mảnh hơn app console: một <strong>server</strong> (Tomcat) để chạy Servlet, một <strong>IDE</strong> (NetBeans) nối với nó, một <strong>JDK</strong>, và một <strong>cơ sở dữ liệu</strong> (SQL Server, từ DBI202).</p>
<div class="lz-flow">
  <div class="lz-step">Cài JDK 8+</div>
  <div class="lz-step">Cài Tomcat 9+ (web server)</div>
  <div class="lz-step">Cài NetBeans 13+ &amp; nối Tomcat</div>
  <div class="lz-step">Chuẩn bị SQL Server 2019+</div>
</div>
<div class="note-ct">"Server" ở đây chỉ nghĩa là một chương trình lắng nghe yêu cầu từ trình duyệt và chạy code của bạn. Tomcat là một <em>Servlet container</em> — nó biến mỗi HTTP request thành một lời gọi tới Servlet của bạn.</div>
<a class="link-card exphub" href="/exp-hub/prj301-cai-dat-tomcat?ref=%2Fcourses%2Fjava-web-application-development%2Flearn&reflabel=PRJ301%20%E2%80%94%20Java%20Web%20Application%20Development" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài Tomcat, NetBeans &amp; SQL Server</span><span class="lc-sub">Từng bước kèm link tải chính chủ — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — WEB HOẠT ĐỘNG RA SAO ══════════════════ */
    {
      title: 'Chapter 1 — How the web works|||Chương 1 — Web hoạt động ra sao',
      description: 'Mô hình client-server, giao thức HTTP (request/response, method, status), và Servlet đầu tiên.',
      lessons: [
        {
          title: '1.1 — HTTP: request, response & your first Servlet|||1.1 — HTTP: request, response & Servlet đầu tiên',
          slug: 'prj301-http-servlet',
          type: 'VIDEO',
          description: 'Client-server, chu trình request/response, GET vs POST, mã trạng thái; và một Servlet trả "Hello".',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>How a web page actually reaches you</h2>
<p class="lead">Before writing any code, understand the conversation. The web is a <strong>request/response</strong> cycle: your browser (the <em>client</em>) sends an HTTP request to a <em>server</em>; the server runs some code and sends back an HTTP response (usually an HTML page). Every website works this way.</p>
<div class="lz-flow">
  <div class="lz-step">Browser sends HTTP request (GET /login)</div>
  <div class="lz-step">Tomcat routes it to your Servlet</div>
  <div class="lz-step">Servlet runs Java, builds a response</div>
  <div class="lz-step">Browser renders the returned HTML</div>
</div>
<h3>The two methods you use constantly</h3>
<table>
  <thead><tr><th>Method</th><th>Use</th><th>Data goes in</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">GET</span></td><td>request a page, search</td><td>the URL (visible, bookmarkable)</td></tr>
    <tr><td><span class="badge">POST</span></td><td>submit a form, log in</td><td>the request body (hidden, for sensitive data)</td></tr>
  </tbody>
</table>
<p>Responses carry a <strong>status code</strong>: 200 OK, 404 Not Found, 500 Server Error, 302 Redirect — you saw these while debugging in earlier courses.</p>

<h3>Ví dụ có lời giải · Your first Servlet</h3>
<pre><span class="tok-keyword">@WebServlet</span>(<span class="tok-string">"/hello"</span>)
<span class="tok-keyword">public class</span> <span class="tok-type">HelloServlet</span> <span class="tok-keyword">extends</span> <span class="tok-type">HttpServlet</span> {
    <span class="tok-keyword">protected void</span> <span class="tok-function">doGet</span>(<span class="tok-type">HttpServletRequest</span> req, <span class="tok-type">HttpServletResponse</span> resp)
            <span class="tok-keyword">throws</span> IOException {
        resp.<span class="tok-function">setContentType</span>(<span class="tok-string">"text/html"</span>);
        resp.<span class="tok-function">getWriter</span>().<span class="tok-function">println</span>(<span class="tok-string">"&lt;h1&gt;Hello, PRJ301!&lt;/h1&gt;"</span>);
    }
}</pre>
<div class="out">Deploy to Tomcat, visit <span class="badge">localhost:8080/app/hello</span> → the browser shows "Hello, PRJ301!". The <span class="badge">@WebServlet("/hello")</span> maps that URL to this class.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>HTTP is stateless — and why that matters.</b> Each request is independent; the server does not remember the last one. So how does a site "remember" you are logged in? Through <b>cookies</b> and <b>sessions</b> (Chapter 4). Understanding that the web is stateless by default explains every session bug you will ever hit — and is the reason the session scope exists at all.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Một trang web thực sự đến với bạn thế nào</h2>
<p class="lead">Trước khi viết code, hãy hiểu cuộc hội thoại. Web là một chu trình <strong>request/response</strong>: trình duyệt của bạn (<em>client</em>) gửi một HTTP request tới <em>server</em>; server chạy code và gửi lại một HTTP response (thường là một trang HTML). Mọi website đều hoạt động như vậy.</p>
<div class="lz-flow">
  <div class="lz-step">Trình duyệt gửi HTTP request (GET /login)</div>
  <div class="lz-step">Tomcat định tuyến tới Servlet của bạn</div>
  <div class="lz-step">Servlet chạy Java, dựng response</div>
  <div class="lz-step">Trình duyệt render HTML trả về</div>
</div>
<h3>Hai method bạn dùng liên tục</h3>
<table>
  <thead><tr><th>Method</th><th>Dùng</th><th>Dữ liệu nằm ở</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">GET</span></td><td>yêu cầu trang, tìm kiếm</td><td>URL (nhìn thấy, bookmark được)</td></tr>
    <tr><td><span class="badge">POST</span></td><td>gửi form, đăng nhập</td><td>thân request (ẩn, cho dữ liệu nhạy cảm)</td></tr>
  </tbody>
</table>
<p>Response mang một <strong>mã trạng thái</strong>: 200 OK, 404 Not Found, 500 Server Error, 302 Redirect — bạn đã thấy chúng khi debug ở các môn trước.</p>

<h3>Ví dụ có lời giải · Servlet đầu tiên</h3>
<pre><span class="tok-keyword">@WebServlet</span>(<span class="tok-string">"/hello"</span>)
<span class="tok-keyword">public class</span> <span class="tok-type">HelloServlet</span> <span class="tok-keyword">extends</span> <span class="tok-type">HttpServlet</span> {
    <span class="tok-keyword">protected void</span> <span class="tok-function">doGet</span>(<span class="tok-type">HttpServletRequest</span> req, <span class="tok-type">HttpServletResponse</span> resp)
            <span class="tok-keyword">throws</span> IOException {
        resp.<span class="tok-function">setContentType</span>(<span class="tok-string">"text/html"</span>);
        resp.<span class="tok-function">getWriter</span>().<span class="tok-function">println</span>(<span class="tok-string">"&lt;h1&gt;Hello, PRJ301!&lt;/h1&gt;"</span>);
    }
}</pre>
<div class="out">Deploy lên Tomcat, truy cập <span class="badge">localhost:8080/app/hello</span> → trình duyệt hiện "Hello, PRJ301!". <span class="badge">@WebServlet("/hello")</span> ánh xạ URL đó tới lớp này.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>HTTP không trạng thái (stateless) — và vì sao điều đó quan trọng.</b> Mỗi request độc lập; server không nhớ request trước. Vậy làm sao một site "nhớ" bạn đã đăng nhập? Qua <b>cookie</b> và <b>session</b> (Chương 4). Hiểu rằng web mặc định không trạng thái giải thích mọi lỗi session bạn sẽ gặp — và là lý do phạm vi session tồn tại.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 2 — SERVLET CHUYÊN SÂU ══════════════════ */
    {
      title: 'Chapter 2 — Servlets in depth|||Chương 2 — Servlet chuyên sâu',
      description: 'Vòng đời Servlet, đọc tham số request, chuyển tiếp (forward) vs chuyển hướng (redirect).',
      lessons: [
        {
          title: '2.1 — Lifecycle, parameters, forward vs redirect|||2.1 — Vòng đời, tham số, forward vs redirect',
          slug: 'prj301-servlet-sau',
          type: 'VIDEO',
          description: 'init/service/destroy; getParameter đọc form; và khác biệt then chốt giữa forward (server) và redirect (client).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Servlets — the engine of your app</h2>
<p class="lead">A Servlet is a Java class that handles web requests. Tomcat manages it through a fixed <strong>lifecycle</strong>, and you read the user's input through the <em>request</em> object. Master these and everything else is detail.</p>
<h3>The lifecycle (Tomcat calls these for you)</h3>
<div class="lz-flow">
  <div class="lz-step">init() — once, when first loaded</div>
  <div class="lz-step">service() → doGet()/doPost() — every request</div>
  <div class="lz-step">destroy() — once, on shutdown</div>
</div>
<p>Because <span class="badge">init()</span> runs once, a Servlet is created a single time and reused for many requests — so never store per-user data in a Servlet field (that would leak between users).</p>

<h3>Reading form input</h3>
<pre><span class="tok-type">String</span> user = req.<span class="tok-function">getParameter</span>(<span class="tok-string">"username"</span>);
<span class="tok-type">String</span> pass = req.<span class="tok-function">getParameter</span>(<span class="tok-string">"password"</span>);
<span class="tok-comment">// getParameter always returns String — parse if you need a number</span></pre>

<h3>Forward vs redirect — a classic exam question</h3>
<table>
  <thead><tr><th></th><th>Forward</th><th>Redirect</th></tr></thead>
  <tbody>
    <tr><td>Who</td><td>server-side (RequestDispatcher)</td><td>tells the browser to request again</td></tr>
    <tr><td>URL bar</td><td>unchanged</td><td>changes to the new URL</td></tr>
    <tr><td>Request data</td><td>kept (same request)</td><td>lost (a brand-new request)</td></tr>
    <tr><td>Use for</td><td>showing a JSP result</td><td>after a POST, to avoid double-submit</td></tr>
  </tbody>
</table>
<div class="out"><b>Forward:</b> req.getRequestDispatcher("result.jsp").forward(req, resp);<br><b>Redirect:</b> resp.sendRedirect("home");</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The Post-Redirect-Get (PRG) pattern.</b> If you forward after a POST and the user hits refresh, the form submits again — duplicate orders, double registrations. The professional fix: after a successful POST, <em>redirect</em> to a GET page. The browser's refresh then re-runs the harmless GET, not the POST. This single pattern prevents a whole class of real bugs and is exactly what redirect is for.</div>

<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fjava-web-application-development%2Flearn&reflabel=PRJ301%20%E2%80%94%20Java%20Web%20Application%20Development#module-252" target="_blank" rel="noopener">
  <span class="lc-ico">☕</span>
  <span class="lc-body"><span class="lc-title">Practise: exceptions & I/O in Java</span><span class="lc-sub">Servlets throw IOException/ServletException — handle them well.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Servlet — động cơ của ứng dụng</h2>
<p class="lead">Servlet là một lớp Java xử lý request web. Tomcat quản lý nó qua một <strong>vòng đời</strong> cố định, và bạn đọc input người dùng qua đối tượng <em>request</em>. Thành thạo những điều này thì mọi thứ còn lại chỉ là chi tiết.</p>
<h3>Vòng đời (Tomcat gọi giúp bạn)</h3>
<div class="lz-flow">
  <div class="lz-step">init() — một lần, khi nạp lần đầu</div>
  <div class="lz-step">service() → doGet()/doPost() — mỗi request</div>
  <div class="lz-step">destroy() — một lần, khi tắt</div>
</div>
<p>Vì <span class="badge">init()</span> chạy một lần, một Servlet được tạo duy nhất và tái dùng cho nhiều request — nên đừng bao giờ lưu dữ liệu riêng của người dùng vào trường của Servlet (sẽ rò rỉ giữa các người dùng).</p>

<h3>Đọc input từ form</h3>
<pre><span class="tok-type">String</span> user = req.<span class="tok-function">getParameter</span>(<span class="tok-string">"username"</span>);
<span class="tok-type">String</span> pass = req.<span class="tok-function">getParameter</span>(<span class="tok-string">"password"</span>);
<span class="tok-comment">// getParameter luôn trả String — parse nếu cần số</span></pre>

<h3>Forward vs redirect — câu hỏi thi kinh điển</h3>
<table>
  <thead><tr><th></th><th>Forward</th><th>Redirect</th></tr></thead>
  <tbody>
    <tr><td>Ai</td><td>phía server (RequestDispatcher)</td><td>bảo trình duyệt yêu cầu lại</td></tr>
    <tr><td>Thanh URL</td><td>không đổi</td><td>đổi sang URL mới</td></tr>
    <tr><td>Dữ liệu request</td><td>giữ nguyên (cùng request)</td><td>mất (một request hoàn toàn mới)</td></tr>
    <tr><td>Dùng khi</td><td>hiển thị kết quả JSP</td><td>sau một POST, để tránh gửi trùng</td></tr>
  </tbody>
</table>
<div class="out"><b>Forward:</b> req.getRequestDispatcher("result.jsp").forward(req, resp);<br><b>Redirect:</b> resp.sendRedirect("home");</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mẫu Post-Redirect-Get (PRG).</b> Nếu bạn forward sau một POST và người dùng nhấn refresh, form gửi lại — đơn hàng trùng, đăng ký hai lần. Cách chuyên nghiệp: sau một POST thành công, hãy <em>redirect</em> tới một trang GET. Refresh của trình duyệt khi đó chạy lại GET vô hại, không phải POST. Một mẫu này ngăn cả một lớp lỗi thật và đúng là mục đích của redirect.</div>

<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fjava-web-application-development%2Flearn&reflabel=PRJ301%20%E2%80%94%20Java%20Web%20Application%20Development#module-252" target="_blank" rel="noopener">
  <span class="lc-ico">☕</span>
  <span class="lc-body"><span class="lc-title">Luyện: ngoại lệ & I/O trong Java</span><span class="lc-sub">Servlet ném IOException/ServletException — xử lý tốt.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — JSP ══════════════════ */
    {
      title: 'Chapter 3 — JSP, EL & JSTL|||Chương 3 — JSP, EL & JSTL',
      description: 'Sinh HTML sạch bằng JSP; Expression Language (EL) và thư viện thẻ JSTL thay cho scriptlet.',
      lessons: [
        {
          title: '3.1 — JSP as the View: EL & JSTL|||3.1 — JSP làm View: EL & JSTL',
          slug: 'prj301-jsp',
          type: 'VIDEO',
          description: 'Vì sao không nhồi HTML vào Servlet; JSP là "View"; EL \${...} và JSTL <c:forEach>/<c:if> thay scriptlet.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>JSP — writing pages the clean way</h2>
<p class="lead">Printing HTML from a Servlet with <span class="badge">getWriter().println</span> gets ugly fast. <strong>JSP</strong> (JavaServer Pages) flips it around: you write an HTML page and drop in dynamic values. JSP is the <em>View</em> in MVC — its only job is display.</p>
<pre><span class="tok-keyword">&lt;h1&gt;</span>Welcome, \${user.name}<span class="tok-keyword">&lt;/h1&gt;</span>
<span class="tok-keyword">&lt;ul&gt;</span>
  <span class="tok-type">&lt;c:forEach</span> var=<span class="tok-string">"p"</span> items=<span class="tok-string">"\${products}"</span><span class="tok-type">&gt;</span>
    <span class="tok-keyword">&lt;li&gt;</span>\${p.name} — \${p.price}<span class="tok-keyword">&lt;/li&gt;</span>
  <span class="tok-type">&lt;/c:forEach&gt;</span>
<span class="tok-keyword">&lt;/ul&gt;</span></pre>
<div class="lz-stack">
  <div class="lz-layer"><b>EL (Expression Language)</b> — <span class="badge">\${user.name}</span> reads a value the Servlet stored, calling getName() for you. Clean, no Java code.</div>
  <div class="lz-layer"><b>JSTL</b> — tag library for logic in the page: <span class="badge">&lt;c:forEach&gt;</span> (loop), <span class="badge">&lt;c:if&gt;</span> (condition), <span class="badge">&lt;c:choose&gt;</span>.</div>
</div>

<div class="pitfall"><b>Trap:</b> old JSP allowed <em>scriptlets</em> — raw Java in <span class="badge">&lt;% ... %&gt;</span> tags. Avoid them. They mix logic into the view, are hard to read, and are exactly what EL/JSTL were created to replace. Markers will notice.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why the View must be "dumb".</b> A golden rule of MVC: the JSP should contain <em>no business logic</em> — no database calls, no calculations, no decisions beyond simple display loops. All of that belongs in the Servlet (Controller) and Java classes (Model). Keeping the View dumb is what lets a designer edit the HTML without breaking your logic, and what makes the app testable. This discipline is the difference between coursework code and professional code.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>JSP — viết trang một cách sạch sẽ</h2>
<p class="lead">In HTML từ Servlet bằng <span class="badge">getWriter().println</span> nhanh chóng trở nên xấu xí. <strong>JSP</strong> (JavaServer Pages) lật ngược lại: bạn viết một trang HTML và chèn các giá trị động. JSP là <em>View</em> trong MVC — nhiệm vụ duy nhất là hiển thị.</p>
<pre><span class="tok-keyword">&lt;h1&gt;</span>Welcome, \${user.name}<span class="tok-keyword">&lt;/h1&gt;</span>
<span class="tok-keyword">&lt;ul&gt;</span>
  <span class="tok-type">&lt;c:forEach</span> var=<span class="tok-string">"p"</span> items=<span class="tok-string">"\${products}"</span><span class="tok-type">&gt;</span>
    <span class="tok-keyword">&lt;li&gt;</span>\${p.name} — \${p.price}<span class="tok-keyword">&lt;/li&gt;</span>
  <span class="tok-type">&lt;/c:forEach&gt;</span>
<span class="tok-keyword">&lt;/ul&gt;</span></pre>
<div class="lz-stack">
  <div class="lz-layer"><b>EL (Expression Language)</b> — <span class="badge">\${user.name}</span> đọc một giá trị Servlet đã lưu, gọi getName() giúp bạn. Sạch, không code Java.</div>
  <div class="lz-layer"><b>JSTL</b> — thư viện thẻ cho logic trong trang: <span class="badge">&lt;c:forEach&gt;</span> (lặp), <span class="badge">&lt;c:if&gt;</span> (điều kiện), <span class="badge">&lt;c:choose&gt;</span>.</div>
</div>

<div class="pitfall"><b>Bẫy:</b> JSP cũ cho phép <em>scriptlet</em> — Java thô trong thẻ <span class="badge">&lt;% ... %&gt;</span>. Tránh chúng. Chúng trộn logic vào view, khó đọc, và đúng là thứ EL/JSTL sinh ra để thay thế. Người chấm sẽ để ý.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao View phải "ngốc".</b> Một quy tắc vàng của MVC: JSP không được chứa <em>logic nghiệp vụ</em> — không gọi CSDL, không tính toán, không quyết định gì ngoài vòng lặp hiển thị đơn giản. Tất cả những cái đó thuộc về Servlet (Controller) và lớp Java (Model). Giữ View ngốc là điều cho phép một designer sửa HTML mà không phá logic, và làm app kiểm thử được. Kỷ luật này là khác biệt giữa code bài tập và code chuyên nghiệp.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — BỐN PHẠM VI ══════════════════ */
    {
      title: 'Chapter 4 — The four scopes|||Chương 4 — Bốn phạm vi (scope)',
      description: 'Chia sẻ trạng thái: page, request, session, application — sống lâu bao nhiêu và ai thấy được.',
      lessons: [
        {
          title: '4.1 — page, request, session & application|||4.1 — page, request, session & application',
          slug: 'prj301-scope',
          type: 'VIDEO',
          description: 'Bốn phạm vi lưu dữ liệu, thời gian sống và tầm nhìn của mỗi cái; setAttribute/getAttribute; đăng nhập dùng session.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Scopes — where data lives and how long</h2>
<p class="lead">Because HTTP is stateless, you must deliberately choose <em>where</em> to store data so the right pieces see it for the right amount of time. Java web gives four scopes, from shortest-lived to longest.</p>
<table>
  <thead><tr><th>Scope</th><th>Lives for</th><th>Visible to</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">page</span></td><td>one JSP page</td><td>that page only</td><td>a loop variable</td></tr>
    <tr><td><span class="badge">request</span></td><td>one request (until response)</td><td>Servlet + forwarded JSP</td><td>search results to display once</td></tr>
    <tr><td><span class="badge">session</span></td><td>one user's whole visit</td><td>all requests from that user</td><td>the logged-in user, a cart</td></tr>
    <tr><td><span class="badge">application</span></td><td>the whole app's life</td><td>every user</td><td>a site-wide visitor counter</td></tr>
  </tbody>
</table>
<pre><span class="tok-comment">// store the logged-in user for the whole visit</span>
HttpSession session = req.<span class="tok-function">getSession</span>();
session.<span class="tok-function">setAttribute</span>(<span class="tok-string">"user"</span>, user);
<span class="tok-comment">// later, on any request from the same user:</span>
User u = (User) session.<span class="tok-function">getAttribute</span>(<span class="tok-string">"user"</span>);</pre>
<div class="out">Login stores the user in <b>session</b> scope; each later request reads it back — that is how the site "remembers" you are logged in. Logout calls <span class="badge">session.invalidate()</span>.</div>

<div class="pitfall"><b>Trap (very common):</b> putting one user's data in <b>application</b> scope shows it to <em>everyone</em>. Cart in application scope = all users share one cart. Per-user data must go in <b>session</b>; data for one screen goes in <b>request</b>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>How sessions actually work: the JSESSIONID cookie.</b> The server can't tell two requests apart by itself — so on your first visit it creates a session and sends the browser a cookie named <span class="badge">JSESSIONID</span>. The browser returns that cookie on every later request, and the server uses it to find your session. If cookies are blocked, sessions break. Knowing this demystifies "why am I logged out?" bugs and is the foundation for understanding real authentication (which you will meet again in later courses).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Scope — dữ liệu sống ở đâu và bao lâu</h2>
<p class="lead">Vì HTTP không trạng thái, bạn phải chủ động chọn <em>nơi</em> lưu dữ liệu để đúng phần thấy được nó trong đúng khoảng thời gian. Java web cho bốn phạm vi, từ sống ngắn nhất tới dài nhất.</p>
<table>
  <thead><tr><th>Phạm vi</th><th>Sống trong</th><th>Ai thấy</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">page</span></td><td>một trang JSP</td><td>chỉ trang đó</td><td>biến vòng lặp</td></tr>
    <tr><td><span class="badge">request</span></td><td>một request (tới khi response)</td><td>Servlet + JSP được forward</td><td>kết quả tìm kiếm hiển thị một lần</td></tr>
    <tr><td><span class="badge">session</span></td><td>cả phiên thăm của một người</td><td>mọi request của người đó</td><td>người đã đăng nhập, giỏ hàng</td></tr>
    <tr><td><span class="badge">application</span></td><td>cả vòng đời app</td><td>mọi người dùng</td><td>bộ đếm khách toàn site</td></tr>
  </tbody>
</table>
<pre><span class="tok-comment">// lưu người đã đăng nhập cho cả phiên</span>
HttpSession session = req.<span class="tok-function">getSession</span>();
session.<span class="tok-function">setAttribute</span>(<span class="tok-string">"user"</span>, user);
<span class="tok-comment">// sau đó, ở bất kỳ request nào từ cùng người dùng:</span>
User u = (User) session.<span class="tok-function">getAttribute</span>(<span class="tok-string">"user"</span>);</pre>
<div class="out">Đăng nhập lưu người dùng vào phạm vi <b>session</b>; mỗi request sau đọc lại nó — đó là cách site "nhớ" bạn đã đăng nhập. Đăng xuất gọi <span class="badge">session.invalidate()</span>.</div>

<div class="pitfall"><b>Bẫy (rất phổ biến):</b> đặt dữ liệu của một người vào phạm vi <b>application</b> khiến <em>mọi người</em> thấy nó. Giỏ hàng ở application scope = mọi người dùng chung một giỏ. Dữ liệu riêng từng người phải vào <b>session</b>; dữ liệu cho một màn hình vào <b>request</b>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Session thực sự hoạt động thế nào: cookie JSESSIONID.</b> Server tự nó không phân biệt được hai request — nên ở lần thăm đầu nó tạo một session và gửi trình duyệt một cookie tên <span class="badge">JSESSIONID</span>. Trình duyệt trả cookie đó ở mọi request sau, và server dùng nó để tìm session của bạn. Nếu cookie bị chặn, session hỏng. Biết điều này làm sáng tỏ các lỗi "sao tôi bị đăng xuất?" và là nền để hiểu xác thực thật (bạn sẽ gặp lại ở các môn sau).</div>
</div>
`,
        },
        {
          title: 'Quiz 1 — Servlets, JSP & scopes|||Quiz 1 — Servlet, JSP & scope',
          slug: 'prj301-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra HTTP, Servlet, JSP và bốn phạm vi — gồm câu suy luận.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'HTTP is described as "stateless" because…|||HTTP được gọi là "stateless" vì…', options: ['it is slow|||nó chậm', 'each request is independent; the server does not remember the previous one|||mỗi request độc lập; server không nhớ request trước', 'it has no status codes|||không có mã trạng thái', 'it only uses GET|||chỉ dùng GET'], correctIndex: 1, points: 1 },
              { question: 'Sensitive form data (a password) should be sent with…|||Dữ liệu form nhạy cảm (mật khẩu) nên gửi bằng…', options: ['GET (in the URL)|||GET (trong URL)', 'POST (in the request body)|||POST (trong thân request)', 'a redirect|||một redirect', 'the session|||session'], correctIndex: 1, points: 1 },
              { question: 'A forward differs from a redirect in that a forward…|||Forward khác redirect ở chỗ forward…', options: ['changes the URL bar|||đổi thanh URL', 'keeps the same request and its data (server-side)|||giữ cùng request và dữ liệu (phía server)', 'creates a new request|||tạo request mới', 'is done by the browser|||do trình duyệt làm'], correctIndex: 1, points: 1 },
              { question: 'To keep a logged-in user across many requests, store them in…|||Để giữ người dùng đã đăng nhập qua nhiều request, lưu vào…', options: ['page scope|||phạm vi page', 'session scope|||phạm vi session', 'request scope|||phạm vi request', 'a Servlet field|||một trường của Servlet'], correctIndex: 1, points: 1 },
              { question: 'In a clean MVC app, database calls and business logic belong in…|||Trong app MVC sạch, gọi CSDL và logic nghiệp vụ thuộc về…', options: ['the JSP (View)|||JSP (View)', 'the Servlet/Model, not the JSP|||Servlet/Model, không phải JSP', 'the browser|||trình duyệt', 'the URL|||URL'], correctIndex: 1, points: 1 },
              { question: 'The Post-Redirect-Get pattern prevents…|||Mẫu Post-Redirect-Get ngăn…', options: ['SQL injection|||SQL injection', 'duplicate form submissions on refresh|||gửi form trùng khi refresh', 'session loss|||mất session', 'slow pages|||trang chậm'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — JDBC & DAO ══════════════════ */
    {
      title: 'Chapter 5 — JDBC & the DAO pattern|||Chương 5 — JDBC & mẫu DAO',
      description: 'Kết nối SQL Server từ Java, PreparedStatement (chống SQL injection), và tổ chức truy cập dữ liệu bằng DAO.',
      lessons: [
        {
          title: '5.1 — Connecting to the database safely|||5.1 — Kết nối cơ sở dữ liệu an toàn',
          slug: 'prj301-jdbc-dao',
          type: 'VIDEO',
          description: 'JDBC 5 bước; PreparedStatement với tham số ? (bắt buộc); và mẫu DAO tách SQL khỏi phần còn lại.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>JDBC — Java talking to your database</h2>
<p class="lead">This is where DBI202 pays off. <strong>JDBC</strong> is the standard Java API to run SQL against a database. The pattern is always the same five steps: connect, prepare a statement, execute, read the results, close.</p>
<pre><span class="tok-type">String</span> sql = <span class="tok-string">"SELECT * FROM Account WHERE username = ?"</span>;
<span class="tok-keyword">try</span> (<span class="tok-type">Connection</span> con = DriverManager.<span class="tok-function">getConnection</span>(url, u, p);
     <span class="tok-type">PreparedStatement</span> ps = con.<span class="tok-function">prepareStatement</span>(sql)) {
    ps.<span class="tok-function">setString</span>(1, username);           <span class="tok-comment">// fills the ?</span>
    <span class="tok-type">ResultSet</span> rs = ps.<span class="tok-function">executeQuery</span>();
    <span class="tok-keyword">if</span> (rs.<span class="tok-function">next</span>()) { <span class="tok-comment">/* read columns: rs.getString("...") */</span> }
}</pre>

<h3>Always use PreparedStatement, never string concatenation</h3>
<p>Building SQL by gluing strings is the classic security hole:</p>
<div class="pitfall"><b>SQL injection — the #1 web vulnerability.</b> <span class="badge">"... WHERE user='" + input + "'"</span> lets an attacker type <span class="badge">' OR '1'='1</span> and log in as anyone, or <span class="badge">'; DROP TABLE Account;--</span> to destroy data. <strong>PreparedStatement</strong> with <span class="badge">?</span> placeholders sends the value separately from the SQL, so it can never be interpreted as code. This is not optional — it is the rule.</div>

<h3>The DAO pattern — organising data access</h3>
<p>Don't scatter JDBC across your Servlets. Put all database code for one entity in a <strong>DAO</strong> (Data Access Object): <span class="badge">AccountDAO</span> with methods like <span class="badge">findByUsername()</span>, <span class="badge">insert()</span>. The Servlet calls the DAO; the DAO hides the SQL. Clean and reusable — this is the Model's data layer.</p>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Connection pooling — why real apps don't open a new connection per request.</b> Opening a database connection is expensive (network handshake, authentication). A busy site opening one per request would crawl. Production apps use a <b>connection pool</b> (e.g. Tomcat's JNDI DataSource, or HikariCP) that keeps a set of ready connections and hands them out. Your code still "gets a connection", but it is reused. This is the difference between a lab demo and something that survives real traffic.</div>

<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fjava-web-application-development%2Flearn&reflabel=PRJ301%20%E2%80%94%20Java%20Web%20Application%20Development#module-409" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Sharpen the SQL your DAO runs</span><span class="lc-sub">Joins &amp; multi-table queries on the SQL track.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>JDBC — Java nói chuyện với cơ sở dữ liệu</h2>
<p class="lead">Đây là lúc DBI202 sinh lời. <strong>JDBC</strong> là API Java chuẩn để chạy SQL tới một cơ sở dữ liệu. Mẫu luôn giống nhau ở năm bước: kết nối, chuẩn bị câu lệnh, thực thi, đọc kết quả, đóng.</p>
<pre><span class="tok-type">String</span> sql = <span class="tok-string">"SELECT * FROM Account WHERE username = ?"</span>;
<span class="tok-keyword">try</span> (<span class="tok-type">Connection</span> con = DriverManager.<span class="tok-function">getConnection</span>(url, u, p);
     <span class="tok-type">PreparedStatement</span> ps = con.<span class="tok-function">prepareStatement</span>(sql)) {
    ps.<span class="tok-function">setString</span>(1, username);           <span class="tok-comment">// điền vào ?</span>
    <span class="tok-type">ResultSet</span> rs = ps.<span class="tok-function">executeQuery</span>();
    <span class="tok-keyword">if</span> (rs.<span class="tok-function">next</span>()) { <span class="tok-comment">/* đọc cột: rs.getString("...") */</span> }
}</pre>

<h3>Luôn dùng PreparedStatement, không bao giờ nối chuỗi</h3>
<p>Dựng SQL bằng cách dán chuỗi là lỗ hổng bảo mật kinh điển:</p>
<div class="pitfall"><b>SQL injection — lỗ hổng web số 1.</b> <span class="badge">"... WHERE user='" + input + "'"</span> cho kẻ tấn công gõ <span class="badge">' OR '1'='1</span> để đăng nhập thành bất kỳ ai, hoặc <span class="badge">'; DROP TABLE Account;--</span> để phá dữ liệu. <strong>PreparedStatement</strong> với chỗ giữ <span class="badge">?</span> gửi giá trị TÁCH RỜI khỏi SQL, nên nó không bao giờ bị hiểu là code. Đây không phải tùy chọn — là luật.</div>

<h3>Mẫu DAO — tổ chức truy cập dữ liệu</h3>
<p>Đừng rải JDBC khắp các Servlet. Đặt toàn bộ code CSDL cho một thực thể vào một <strong>DAO</strong> (Data Access Object): <span class="badge">AccountDAO</span> với các hàm như <span class="badge">findByUsername()</span>, <span class="badge">insert()</span>. Servlet gọi DAO; DAO giấu SQL. Sạch và tái dùng được — đây là tầng dữ liệu của Model.</p>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Connection pooling — vì sao app thật không mở kết nối mới mỗi request.</b> Mở một kết nối CSDL rất tốn kém (bắt tay mạng, xác thực). Một site bận mở một kết nối mỗi request sẽ bò. App production dùng <b>connection pool</b> (vd JNDI DataSource của Tomcat, hoặc HikariCP) giữ sẵn một tập kết nối và phát ra. Code của bạn vẫn "lấy một kết nối", nhưng nó được tái dùng. Đây là khác biệt giữa demo lab và thứ chịu được traffic thật.</div>

<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fjava-web-application-development%2Flearn&reflabel=PRJ301%20%E2%80%94%20Java%20Web%20Application%20Development#module-409" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Mài SQL mà DAO của bạn chạy</span><span class="lc-sub">Joins &amp; truy vấn nhiều bảng trên track SQL.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — MVC ══════════════════ */
    {
      title: 'Chapter 6 — The MVC architecture|||Chương 6 — Kiến trúc MVC',
      description: 'Trái tim của môn: Controller (Servlet) + Model (DAO/entity) + View (JSP) — luồng đi của một request.',
      lessons: [
        {
          title: '6.1 — Model, View, Controller working together|||6.1 — Model, View, Controller phối hợp',
          slug: 'prj301-mvc',
          type: 'VIDEO',
          description: 'Ba vai trò và luồng request đầy đủ: Servlet nhận → gọi DAO/Model → đặt vào request → forward tới JSP.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>MVC — the pattern the whole course builds toward</h2>
<p class="lead">Everything so far snaps together here. <strong>MVC</strong> splits a web app into three roles, each with one job. Get this right and your code is clean, testable, and exactly what the practical exam rewards.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Model</b> — the data and business rules: entity classes (Account, Product) + DAOs. Knows nothing about the web.</div>
  <div class="lz-layer"><b>View</b> — the JSP pages. Only displays what it is given. No logic.</div>
  <div class="lz-layer"><b>Controller</b> — the Servlet. Receives the request, calls the Model, decides which View to show.</div>
</div>

<h3>Ví dụ có lời giải · The full request flow (a login)</h3>
<div class="lz-flow">
  <div class="lz-step">1 · Browser POSTs username/password to /login</div>
  <div class="lz-step">2 · LoginServlet (Controller) reads params</div>
  <div class="lz-step">3 · Calls AccountDAO.check(user, pass) (Model)</div>
  <div class="lz-step">4 · Stores the user in session; sets a request attribute</div>
  <div class="lz-step">5 · Forwards to home.jsp (View), which shows \${user.name}</div>
</div>
<pre><span class="tok-comment">// Controller (Servlet)</span>
<span class="tok-type">Account</span> acc = dao.<span class="tok-function">check</span>(user, pass);   <span class="tok-comment">// Model</span>
<span class="tok-keyword">if</span> (acc != <span class="tok-keyword">null</span>) {
    req.<span class="tok-function">getSession</span>().<span class="tok-function">setAttribute</span>(<span class="tok-string">"user"</span>, acc);
    req.<span class="tok-function">getRequestDispatcher</span>(<span class="tok-string">"home.jsp"</span>).<span class="tok-function">forward</span>(req, resp);  <span class="tok-comment">// View</span>
} <span class="tok-keyword">else</span> {
    req.<span class="tok-function">setAttribute</span>(<span class="tok-string">"error"</span>, <span class="tok-string">"Invalid login"</span>);
    req.<span class="tok-function">getRequestDispatcher</span>(<span class="tok-string">"login.jsp"</span>).<span class="tok-function">forward</span>(req, resp);
}</pre>
<div class="note-ct">Notice: the Servlet never writes HTML, and the JSP never queries the database. Each layer does its one job — that separation IS the pattern.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The Front Controller — one Servlet to rule them all.</b> Instead of one Servlet per action (LoginServlet, LogoutServlet, ProductServlet…), large apps route <em>every</em> request through a single <b>Front Controller</b> Servlet that reads an "action" parameter and dispatches to the right handler. This is exactly how Spring MVC's DispatcherServlet works under the hood — so understanding it here is your bridge to the framework used across the industry (and hinted at in this course's tools).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>MVC — mẫu mà cả môn hướng tới</h2>
<p class="lead">Mọi thứ tới giờ khớp lại ở đây. <strong>MVC</strong> chia một app web thành ba vai trò, mỗi cái một việc. Làm đúng thì code sạch, kiểm thử được, và đúng thứ thi thực hành thưởng điểm.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Model</b> — dữ liệu và luật nghiệp vụ: lớp entity (Account, Product) + DAO. Không biết gì về web.</div>
  <div class="lz-layer"><b>View</b> — các trang JSP. Chỉ hiển thị thứ được đưa. Không logic.</div>
  <div class="lz-layer"><b>Controller</b> — Servlet. Nhận request, gọi Model, quyết định hiển thị View nào.</div>
</div>

<h3>Ví dụ có lời giải · Luồng request đầy đủ (một lần đăng nhập)</h3>
<div class="lz-flow">
  <div class="lz-step">1 · Trình duyệt POST username/password tới /login</div>
  <div class="lz-step">2 · LoginServlet (Controller) đọc tham số</div>
  <div class="lz-step">3 · Gọi AccountDAO.check(user, pass) (Model)</div>
  <div class="lz-step">4 · Lưu người dùng vào session; đặt một request attribute</div>
  <div class="lz-step">5 · Forward tới home.jsp (View), hiển thị \${user.name}</div>
</div>
<pre><span class="tok-comment">// Controller (Servlet)</span>
<span class="tok-type">Account</span> acc = dao.<span class="tok-function">check</span>(user, pass);   <span class="tok-comment">// Model</span>
<span class="tok-keyword">if</span> (acc != <span class="tok-keyword">null</span>) {
    req.<span class="tok-function">getSession</span>().<span class="tok-function">setAttribute</span>(<span class="tok-string">"user"</span>, acc);
    req.<span class="tok-function">getRequestDispatcher</span>(<span class="tok-string">"home.jsp"</span>).<span class="tok-function">forward</span>(req, resp);  <span class="tok-comment">// View</span>
} <span class="tok-keyword">else</span> {
    req.<span class="tok-function">setAttribute</span>(<span class="tok-string">"error"</span>, <span class="tok-string">"Invalid login"</span>);
    req.<span class="tok-function">getRequestDispatcher</span>(<span class="tok-string">"login.jsp"</span>).<span class="tok-function">forward</span>(req, resp);
}</pre>
<div class="note-ct">Để ý: Servlet không bao giờ viết HTML, và JSP không bao giờ truy vấn CSDL. Mỗi tầng làm đúng một việc — sự tách bạch đó CHÍNH LÀ mẫu MVC.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Front Controller — một Servlet cai quản tất cả.</b> Thay vì một Servlet cho mỗi hành động (LoginServlet, LogoutServlet, ProductServlet…), app lớn định tuyến <em>mọi</em> request qua một Servlet <b>Front Controller</b> duy nhất, đọc tham số "action" và điều phối tới handler đúng. Đây đúng là cách DispatcherServlet của Spring MVC hoạt động bên dưới — nên hiểu nó ở đây là cầu nối của bạn tới framework dùng khắp ngành (và được gợi ý trong công cụ của môn).</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — JPA ══════════════════ */
    {
      title: 'Chapter 7 — JPA: object-relational mapping|||Chương 7 — JPA: ánh xạ đối tượng-quan hệ',
      description: 'Thao tác cơ sở dữ liệu bằng đối tượng Java thay vì SQL thô — entity, @Entity, EntityManager.',
      lessons: [
        {
          title: '7.1 — Entities & the EntityManager|||7.1 — Entity & EntityManager',
          slug: 'prj301-jpa',
          type: 'VIDEO',
          description: 'ORM là gì; ánh xạ lớp ↔ bảng bằng @Entity/@Id; CRUD bằng EntityManager thay cho JDBC thủ công.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>JPA — stop writing SQL by hand</h2>
<p class="lead">Writing JDBC for every query is repetitive. <strong>JPA</strong> (Java Persistence API) is <em>object-relational mapping</em>: you annotate a Java class to map it to a table, then save and load <em>objects</em> — JPA generates the SQL for you.</p>
<pre><span class="tok-keyword">@Entity</span>
<span class="tok-keyword">public class</span> <span class="tok-type">Account</span> {
    <span class="tok-keyword">@Id</span> <span class="tok-type">String</span> username;
    <span class="tok-type">String</span> password;
    <span class="tok-type">String</span> fullName;
    <span class="tok-comment">// getters/setters</span>
}</pre>
<div class="out"><b>@Entity</b> = "this class is a table". <b>@Id</b> = "this field is the primary key". A row becomes an object; a column becomes a field.</div>
<pre><span class="tok-comment">// Save and find — no SQL written</span>
em.<span class="tok-function">persist</span>(newAccount);              <span class="tok-comment">// INSERT</span>
<span class="tok-type">Account</span> a = em.<span class="tok-function">find</span>(<span class="tok-type">Account</span>.<span class="tok-keyword">class</span>, <span class="tok-string">"an01"</span>);  <span class="tok-comment">// SELECT by id</span></pre>
<p>The <strong>EntityManager</strong> is your gateway: <span class="badge">persist</span> (insert), <span class="badge">find</span> (select by id), <span class="badge">merge</span> (update), <span class="badge">remove</span> (delete). For complex queries, JPQL looks like SQL but over entities.</p>

<div class="note-ct">JDBC (Chapter 5) vs JPA (this chapter): JDBC gives you full control and is closer to the metal; JPA removes boilerplate and thinks in objects. Know both — the exam and real projects use each.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The N+1 query problem — ORM's famous trap.</b> ORMs make it easy to write code that is secretly slow. Loading 100 orders and then, in a loop, reading each order's customer can fire 1 + 100 = 101 queries instead of one join. This "N+1 problem" is the most common ORM performance bug in industry. The fix is a <em>fetch join</em>. Knowing this exists — and that convenience can hide cost — is what separates someone who <em>uses</em> JPA from someone who understands it.</div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fjava-web-application-development%2Flearn&reflabel=PRJ301%20%E2%80%94%20Java%20Web%20Application%20Development" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Next step: Spring Boot &amp; JPA</span><span class="lc-sub">Where JPA is used every day in modern Java.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>JPA — thôi viết SQL bằng tay</h2>
<p class="lead">Viết JDBC cho mỗi truy vấn thì lặp đi lặp lại. <strong>JPA</strong> (Java Persistence API) là <em>ánh xạ đối tượng-quan hệ</em>: bạn gắn annotation cho một lớp Java để ánh xạ nó tới một bảng, rồi lưu và nạp <em>đối tượng</em> — JPA sinh SQL giúp bạn.</p>
<pre><span class="tok-keyword">@Entity</span>
<span class="tok-keyword">public class</span> <span class="tok-type">Account</span> {
    <span class="tok-keyword">@Id</span> <span class="tok-type">String</span> username;
    <span class="tok-type">String</span> password;
    <span class="tok-type">String</span> fullName;
    <span class="tok-comment">// getter/setter</span>
}</pre>
<div class="out"><b>@Entity</b> = "lớp này là một bảng". <b>@Id</b> = "trường này là khóa chính". Một hàng thành một đối tượng; một cột thành một trường.</div>
<pre><span class="tok-comment">// Lưu và tìm — không viết SQL</span>
em.<span class="tok-function">persist</span>(newAccount);              <span class="tok-comment">// INSERT</span>
<span class="tok-type">Account</span> a = em.<span class="tok-function">find</span>(<span class="tok-type">Account</span>.<span class="tok-keyword">class</span>, <span class="tok-string">"an01"</span>);  <span class="tok-comment">// SELECT theo id</span></pre>
<p><strong>EntityManager</strong> là cổng của bạn: <span class="badge">persist</span> (thêm), <span class="badge">find</span> (chọn theo id), <span class="badge">merge</span> (cập nhật), <span class="badge">remove</span> (xóa). Với truy vấn phức tạp, JPQL trông như SQL nhưng trên entity.</p>

<div class="note-ct">JDBC (Chương 5) vs JPA (chương này): JDBC cho bạn toàn quyền và sát phần cứng hơn; JPA loại bỏ code lặp và tư duy bằng đối tượng. Biết cả hai — thi và dự án thật dùng mỗi cái.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vấn đề truy vấn N+1 — cái bẫy nổi tiếng của ORM.</b> ORM khiến dễ viết code chậm một cách âm thầm. Nạp 100 đơn hàng rồi trong vòng lặp đọc khách hàng của mỗi đơn có thể bắn 1 + 100 = 101 truy vấn thay vì một join. "Vấn đề N+1" này là bug hiệu năng ORM phổ biến nhất trong ngành. Cách sửa là <em>fetch join</em>. Biết nó tồn tại — và rằng sự tiện lợi có thể giấu chi phí — là điều tách người <em>dùng</em> JPA khỏi người hiểu nó.</div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fjava-web-application-development%2Flearn&reflabel=PRJ301%20%E2%80%94%20Java%20Web%20Application%20Development" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Bước tiếp: Spring Boot &amp; JPA</span><span class="lc-sub">Nơi JPA được dùng hằng ngày trong Java hiện đại.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ NÂNG CAO ══════════════════ */
    {
      title: 'Advanced — Beyond the syllabus|||Nâng cao — Ngoài giáo trình',
      description: 'Toàn bộ chương này là học thêm: bảo mật web, tích hợp AI trong Java web (CLO9), và bước tới Spring Boot.',
      lessons: [
        {
          title: 'A.1 — Web security, AI integration & Spring Boot|||A.1 — Bảo mật web, tích hợp AI & Spring Boot',
          slug: 'prj301-nang-cao',
          type: 'VIDEO',
          description: 'Các lỗ hổng web thường gặp (XSS/CSRF/session), tích hợp AI trong app Java (CLO9), và vì sao ngành dùng Spring Boot.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson A.1</span>
<h2><span class="badge">★ Beyond the syllabus</span> From coursework to industry</h2>
<p class="lead">You can now build a working MVC web app. This section adds the professional layer: keeping it secure, using AI (a CLO in the modern syllabus), and the framework you will actually use at work.</p>

<h3>Web security essentials</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>SQL injection</b> — solved by PreparedStatement (Chapter 5). Never concatenate user input into SQL.</div>
  <div class="lz-layer"><b>XSS (Cross-Site Scripting)</b> — an attacker submits <span class="badge">&lt;script&gt;</span> that runs in other users' browsers. Fix: escape output (JSTL <span class="badge">&lt;c:out&gt;</span> escapes by default).</div>
  <div class="lz-layer"><b>Session hijacking</b> — protect the JSESSIONID cookie (HTTPS, HttpOnly), and regenerate the session id on login.</div>
  <div class="lz-layer"><b>Access control</b> — check the session user's role on every protected page/Servlet, not just by hiding the link.</div>
</div>

<h3>AI in a Java web app (CLO9)</h3>
<p>The modern syllabus adds AI. In practice: your Servlet calls an AI API (an LLM) over HTTP, sends the user's text, and shows the response in a JSP — a summariser, a chatbot, a smart search. The web skills are the same; the AI is just another service your Controller calls. Keep the API key server-side (never in the JSP).</p>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why industry moved to Spring Boot.</b> Everything you learned — Servlets, MVC, scopes, JPA — is the foundation, but raw Servlets are verbose. <b>Spring Boot</b> automates the boilerplate: annotations replace web.xml, dependency injection wires your DAOs, Spring Data JPA writes CRUD for you, and an embedded Tomcat means you just run a main method. It is not magic — it is exactly the patterns from this course, automated. That is why understanding the fundamentals <em>first</em> makes you far better with Spring than someone who skipped straight to it.</div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fjava-web-application-development%2Flearn&reflabel=PRJ301%20%E2%80%94%20Java%20Web%20Application%20Development" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Learn Spring Boot next</span><span class="lc-sub">The industry framework built on everything you just learned.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài A.1</span>
<h2><span class="badge">★ Ngoài giáo trình</span> Từ bài tập tới công nghiệp</h2>
<p class="lead">Giờ bạn xây được một app web MVC chạy được. Phần này thêm tầng chuyên nghiệp: giữ nó an toàn, dùng AI (một CLO trong syllabus hiện đại), và framework bạn thực sự dùng khi đi làm.</p>

<h3>Cốt lõi bảo mật web</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>SQL injection</b> — giải bằng PreparedStatement (Chương 5). Không bao giờ nối input người dùng vào SQL.</div>
  <div class="lz-layer"><b>XSS (Cross-Site Scripting)</b> — kẻ tấn công gửi <span class="badge">&lt;script&gt;</span> chạy trong trình duyệt người khác. Sửa: escape output (JSTL <span class="badge">&lt;c:out&gt;</span> escape mặc định).</div>
  <div class="lz-layer"><b>Chiếm session</b> — bảo vệ cookie JSESSIONID (HTTPS, HttpOnly), và tạo lại session id khi đăng nhập.</div>
  <div class="lz-layer"><b>Kiểm soát truy cập</b> — kiểm vai trò của người dùng trong session ở mọi trang/Servlet được bảo vệ, không chỉ ẩn link.</div>
</div>

<h3>AI trong app Java web (CLO9)</h3>
<p>Syllabus hiện đại thêm AI. Thực tế: Servlet của bạn gọi một API AI (một LLM) qua HTTP, gửi văn bản người dùng, và hiển thị phản hồi trong JSP — một bộ tóm tắt, một chatbot, một tìm kiếm thông minh. Kỹ năng web vẫn thế; AI chỉ là một dịch vụ khác mà Controller gọi. Giữ API key phía server (không bao giờ trong JSP).</p>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao ngành chuyển sang Spring Boot.</b> Mọi thứ bạn học — Servlet, MVC, scope, JPA — là nền tảng, nhưng Servlet thô rất dài dòng. <b>Spring Boot</b> tự động hóa phần lặp: annotation thay web.xml, dependency injection nối các DAO, Spring Data JPA viết CRUD giúp bạn, và Tomcat nhúng nghĩa là bạn chỉ chạy một hàm main. Nó không phải phép màu — nó đúng là các mẫu từ môn này, được tự động hóa. Đó là lý do hiểu nền tảng <em>trước</em> làm bạn giỏi Spring hơn nhiều so với người nhảy thẳng vào nó.</div>

<a class="link-card codelab" href="/code-lab/spring-boot?ref=%2Fcourses%2Fjava-web-application-development%2Flearn&reflabel=PRJ301%20%E2%80%94%20Java%20Web%20Application%20Development" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">Học Spring Boot tiếp theo</span><span class="lc-sub">Framework công nghiệp xây trên mọi thứ bạn vừa học.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 2 — JDBC, MVC, JPA & security|||Quiz 2 — JDBC, MVC, JPA & bảo mật',
          slug: 'prj301-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra JDBC/DAO, MVC, JPA và bảo mật — gồm câu suy luận.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'To prevent SQL injection you must…|||Để chống SQL injection bạn phải…', options: ['concatenate carefully|||nối chuỗi cẩn thận', 'use a PreparedStatement with ? placeholders|||dùng PreparedStatement với chỗ giữ ?', 'validate on the JSP|||validate trên JSP', 'use GET not POST|||dùng GET không POST'], correctIndex: 1, points: 1 },
              { question: 'In MVC, the Servlet plays the role of…|||Trong MVC, Servlet đóng vai…', options: ['the View|||View', 'the Controller|||Controller', 'the Model|||Model', 'the database|||cơ sở dữ liệu'], correctIndex: 1, points: 1 },
              { question: 'The DAO pattern exists to…|||Mẫu DAO tồn tại để…', options: ['generate HTML|||sinh HTML', 'keep all database code for an entity in one reusable place|||giữ toàn bộ code CSDL của một thực thể ở một nơi tái dùng', 'manage sessions|||quản lý session', 'replace Tomcat|||thay Tomcat'], correctIndex: 1, points: 1 },
              { question: '@Entity on a Java class tells JPA that…|||@Entity trên một lớp Java báo JPA rằng…', options: ['it is a Servlet|||nó là một Servlet', 'the class maps to a database table|||lớp ánh xạ tới một bảng CSDL', 'it is the View|||nó là View', 'it needs no primary key|||nó không cần khóa chính'], correctIndex: 1, points: 1 },
              { question: 'The N+1 query problem is a… (beyond-syllabus)|||Vấn đề truy vấn N+1 là một… (ngoài giáo trình)', options: ['security hole|||lỗ hổng bảo mật', 'common ORM performance bug from lazy loading in a loop|||bug hiệu năng ORM phổ biến do lazy-load trong vòng lặp', 'JSP syntax error|||lỗi cú pháp JSP', 'Tomcat setting|||thiết lập Tomcat'], correctIndex: 1, points: 1 },
              { question: 'Spring Boot relates to this course by…|||Spring Boot liên quan môn này ở chỗ…', options: ['replacing Java entirely|||thay hẳn Java', 'automating the same Servlet/MVC/JPA patterns you learned|||tự động hóa chính các mẫu Servlet/MVC/JPA bạn đã học', 'being unrelated|||không liên quan', 'removing the need for a database|||bỏ nhu cầu CSDL'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* END-SECTIONS-MARKER */
  ],
};
