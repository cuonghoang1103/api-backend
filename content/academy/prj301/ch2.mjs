/**
 * PRJ301 · Chương 2 — servlet chuyên sâu (prj1 slide 17–43: servlet, vòng đời, header, form, web.xml, WAR).
 * Bài 📑 học theo từng slide: prj1 (undefined, slide 17–43).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: prj301-on-ch2.
 * Quiz MỚI (10 câu, slug prj301-quiz-ch2).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRJ301/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRJ301/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 2.A — 📑 Slide by slide · Basic Java web (2/3): first servlet, life cycle, HttpServlet, forms (Slot 1–5, slides 17–31) ───────── */
const L_prj1_2 = {
  title: '2.A — 📑 Slide by slide · Basic Java web (2/3): first servlet, life cycle, HttpServlet, forms (Slot 1–5, slides 17–31)|||2.A — 📑 Học theo từng slide · Java web cơ bản (2/3): servlet đầu tiên, vòng đời, HttpServlet, header, form (Slot 1–5, slide 17–31)',
  slug: 'prj301-slide-prj1-2',
  type: 'VIDEO',
  description: 'Giảng slide 17–31 của bộ "Introduction to Basic Java Web Application": servlet đầu tiên (slide viết javax, chạy lại bằng jakarta trên Tomcat 10.1), vòng đời init/service/destroy có log console thật, HttpServlet và các doXxx (405/501 thật), header của request (If-Modified-Since → 304 thật), ShowRequestHeaders, cấu trúc HTTP response và lỗi "header sau body", form HTML (ô chữ, radio, action, submit), đọc dữ liệu form bằng getParameter — kèm lỗi action="/LoginServlet" ra 404, GET vào servlet chỉ có doPost ra 405, tiếng Việt và XSS, sơ đồ vòng đời và luồng gửi form.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.A · school deck "Session 1, Introduction to Basic Java Web Application" (Slot 1–5), slides 17–31</span>
<h2>Servlets in depth (part 1) — writing one, its life, its methods, headers and forms</h2>
<p class="lead">Lesson 1.A showed the HTTP conversation from outside. Now you write the Java side: the first servlet, how Tomcat creates and destroys it, how <code>HttpServlet</code> routes each method to <code>doGet</code>/<code>doPost</code>, how to read request headers, how to shape the response, and how a form sends data that <code>getParameter</code> reads. Syllabus sessions 5–7 (CLO2): <em>create a servlet, configure it for deployment, work with request and response, doGet and doPost, parameters from forms and query strings.</em></p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>Exam weight</th></tr></thead>
<tbody>
<tr><td>17–18</td><td>the first servlet, running it</td><td>PE: every question starts here</td></tr>
<tr><td>19–20</td><td>life cycle, HttpServlet methods</td><td>FE favourite: init/service/destroy, which method handles which request</td></tr>
<tr><td>21–24</td><td>request headers, response structure</td><td>FE: header names, status line, Content-Type</td></tr>
<tr><td>25–31</td><td>forms, action, getParameter</td><td>PE + Assignment: every login/search/insert form</td></tr>
</tbody>
</table>
<div class="callout">Every servlet below is rewritten from the slide with <code>jakarta.servlet</code> (the slides show <code>javax.servlet</code>) and ran on a real Tomcat 10.1. Under the code: the request sent, the response received, and — for the life cycle — what Tomcat printed on its console. The older web lessons 2.1–2.3 (forward vs redirect, request/response API, init parameters) follow this one.</div>`,
    `<span class="eyebrow">Chương 2 · Bài 2.A · bộ slide "Session 1, Introduction to Basic Java Web Application" (Slot 1–5), slide 17–31</span>
<h2>Servlet chuyên sâu (phần 1) — viết một servlet, vòng đời, các method, header và form</h2>
<p class="lead">Bài 1.A cho xem cuộc nói chuyện HTTP từ bên ngoài. Giờ bạn viết phía Java: servlet đầu tiên, Tomcat tạo và huỷ nó thế nào, <code>HttpServlet</code> chuyển mỗi method sang <code>doGet</code>/<code>doPost</code> ra sao, đọc header của request, định hình response, và form gửi dữ liệu để <code>getParameter</code> đọc như thế nào. Buổi 5–7 của đề cương (CLO2): <em>tạo servlet, cấu hình để deploy, làm việc với request và response, doGet và doPost, tham số từ form và chuỗi truy vấn (query string).</em></p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Mức độ ra đề</th></tr></thead>
<tbody>
<tr><td>17–18</td><td>servlet đầu tiên, chạy nó</td><td>PE: câu nào cũng bắt đầu từ đây</td></tr>
<tr><td>19–20</td><td>vòng đời, các method của HttpServlet</td><td>FE rất hay hỏi: init/service/destroy, method nào xử lý request nào</td></tr>
<tr><td>21–24</td><td>header của request, cấu trúc response</td><td>FE: tên header, dòng trạng thái, Content-Type</td></tr>
<tr><td>25–31</td><td>form, action, getParameter</td><td>PE + Assignment: mọi form đăng nhập/tìm kiếm/thêm mới</td></tr>
</tbody>
</table>
<div class="callout">Mọi servlet dưới đây được viết lại từ slide bằng <code>jakarta.servlet</code> (slide ghi <code>javax.servlet</code>) và đã chạy trên Tomcat 10.1 thật. Dưới code là request đã gửi, response nhận được, và — với vòng đời — những gì Tomcat in ra console. Các bài web cũ 2.1–2.3 (forward và redirect, API request/response, tham số khởi tạo) nằm ngay sau bài này.</div>`),
    walkHead('prj1', 17, 31),
    walk('prj1', [
      [17, 'A Simple Servlet',
        `<p class="y-chinh">🎯 The smallest useful servlet: a class that <strong>extends HttpServlet</strong> and overrides <code>doGet(request, response)</code>; it gets a <code>PrintWriter</code> from the response and prints HTML into it.</p>
<p class="ghi-chu">📄 <code>FirstServlet/src/main/java/FirstServlet.java</code></p>
<pre class="web-src"><code class="language-java">// Slide 17, rewritten for Tomcat 10+: only the package names change (javax → jakarta)
import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class FirstServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter out = response.getWriter();   // the response body, as text
        out.println("&lt;h1&gt;First Servlet&lt;/h1&gt;");
    }
}</code></pre>
<p class="ghi-chu">📄 <code>FirstServlet/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;display-name&gt;Servlet 6.0 Examples&lt;/display-name&gt;
    &lt;description&gt;
        Servlet 6.0 Examples.
    &lt;/description&gt;
    &lt;!-- Define servlets that are included in the example application --&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;FirstServlet&lt;/servlet-name&gt;
        &lt;servlet-class&gt;FirstServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;FirstServlet&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/FirstServlet&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;ShowRequestHeaders&lt;/servlet-name&gt;
        &lt;servlet-class&gt;ShowRequestHeaders&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;ShowRequestHeaders&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/ShowRequestHeaders&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
    &lt;welcome-file-list&gt;
        &lt;welcome-file&gt;index.html&lt;/welcome-file&gt;
        &lt;welcome-file&gt;index.jsp&lt;/welcome-file&gt;
    &lt;/welcome-file-list&gt;
&lt;/web-app&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/FirstServlet HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Length: 23

&lt;h1&gt;First Servlet&lt;/h1&gt;</code></pre>
<p>Line by line: <code>extends HttpServlet</code> — we inherit all the HTTP plumbing; <code>doGet</code> — called by Tomcat for every GET to the mapped URL (there is no <code>main</code>); <code>throws ServletException, IOException</code> — the signature fixed by the API; <code>response.getWriter()</code> — whatever you print goes into the response <strong>body</strong>.</p>
<p>The mapping URL ⇄ class lives in <code>web.xml</code> (slides 35–38). Since Servlet 3.0 (2009) you can instead write <code>@WebServlet("/FirstServlet")</code> above the class — NetBeans' "New Servlet" wizard does that.</p>
<div class="pitfall">Look at the real response: <strong>there is no Content-Type header</strong>, because the slide's code never calls <code>setContentType</code>. Chrome guesses ("sniffs") HTML here, but you should not rely on guessing: always call <code>response.setContentType("text/html;charset=UTF-8")</code> <em>before</em> <code>getWriter()</code>.</div>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): in LabFlow you never write <code>extends HttpServlet</code>. Spring Boot registers ONE servlet — <code>DispatcherServlet</code>, mapped to <code>/</code> — and it calls your <code>@GetMapping</code> methods. It is the "Front Controller" pattern you meet in Chapter 6 (MVC).</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/d5fbe0206201f31142cab8011e827e56a7062952.svg" alt="DispatcherServlet: the single servlet in front of every LabFlow controller" loading="lazy" /><p class="chu-thich">🧩 DispatcherServlet: the single servlet in front of every LabFlow controller</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title In Spring Boot: ONE servlet (DispatcherServlet) in front of all your controllers
participant "Browser" as B
participant "Embedded Tomcat" as T
participant "DispatcherServlet\\n(a real HttpServlet,\\nmapped to /)" as D
participant "ReservationController\\n(@RestController)" as RC
participant "ReservationService" as RS
B -&gt; T : GET /api/reservations/7
T -&gt; D : service() → doGet()
D -&gt; D : find the handler for\\nGET /api/reservations/{id}
D -&gt; RC : get(7)
RC -&gt; RS : findById(7)
RS --&gt; RC : Reservation
RC --&gt; D : object
D -&gt; D : convert to JSON\\n(HttpMessageConverter)
D --&gt; T : 200 + application/json
T --&gt; B : response
@enduml</code></pre></details>`,
        `<p class="y-chinh">🎯 Servlet nhỏ nhất có ích: một lớp <strong>kế thừa HttpServlet</strong> và ghi đè <code>doGet(request, response)</code>; nó lấy một <code>PrintWriter</code> từ response và in HTML vào đó.</p>
<p class="ghi-chu">📄 <code>FirstServlet/src/main/java/FirstServlet.java</code></p>
<pre class="web-src"><code class="language-java">// Slide 17, viết lại cho Tomcat 10+: chỉ đổi tên gói (javax → jakarta)
import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class FirstServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter out = response.getWriter();   // thân response, dạng chữ
        out.println("&lt;h1&gt;First Servlet&lt;/h1&gt;");
    }
}</code></pre>
<p class="ghi-chu">📄 <code>FirstServlet/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;display-name&gt;Servlet 6.0 Examples&lt;/display-name&gt;
    &lt;description&gt;
        Servlet 6.0 Examples.
    &lt;/description&gt;
    &lt;!-- Define servlets that are included in the example application --&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;FirstServlet&lt;/servlet-name&gt;
        &lt;servlet-class&gt;FirstServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;FirstServlet&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/FirstServlet&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;ShowRequestHeaders&lt;/servlet-name&gt;
        &lt;servlet-class&gt;ShowRequestHeaders&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;ShowRequestHeaders&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/ShowRequestHeaders&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
    &lt;welcome-file-list&gt;
        &lt;welcome-file&gt;index.html&lt;/welcome-file&gt;
        &lt;welcome-file&gt;index.jsp&lt;/welcome-file&gt;
    &lt;/welcome-file-list&gt;
&lt;/web-app&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/FirstServlet HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Length: 23

&lt;h1&gt;First Servlet&lt;/h1&gt;</code></pre>
<p>Từng dòng: <code>extends HttpServlet</code> — ta thừa hưởng toàn bộ phần "ống nước" HTTP; <code>doGet</code> — Tomcat gọi cho mỗi GET tới URL được ánh xạ (không có <code>main</code>); <code>throws ServletException, IOException</code> — chữ ký do API quy định; <code>response.getWriter()</code> — in gì ra đây cũng đi vào <strong>body</strong> của response.</p>
<p>Việc ánh xạ URL ⇄ lớp nằm trong <code>web.xml</code> (slide 35–38). Từ Servlet 3.0 (2009) bạn có thể thay bằng <code>@WebServlet("/FirstServlet")</code> đặt trên lớp — trình hướng dẫn "New Servlet" của NetBeans làm đúng như vậy.</p>
<div class="pitfall">Nhìn response thật: <strong>không có header Content-Type</strong>, vì code trên slide không hề gọi <code>setContentType</code>. Chrome tự đoán ("sniff") là HTML, nhưng đừng trông vào việc đoán: luôn gọi <code>response.setContentType("text/html;charset=UTF-8")</code> <em>trước</em> <code>getWriter()</code>.</div>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): ở LabFlow bạn không bao giờ viết <code>extends HttpServlet</code>. Spring Boot đăng ký MỘT servlet — <code>DispatcherServlet</code>, ánh xạ tới <code>/</code> — và nó gọi các phương thức <code>@GetMapping</code> của bạn. Đó là mẫu "Front Controller" (bộ điều khiển đứng trước) bạn gặp ở Chương 6 (MVC).</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/d5fbe0206201f31142cab8011e827e56a7062952.svg" alt="DispatcherServlet: servlet duy nhất đứng trước mọi controller của LabFlow" loading="lazy" /><p class="chu-thich">🧩 DispatcherServlet: servlet duy nhất đứng trước mọi controller của LabFlow</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title In Spring Boot: ONE servlet (DispatcherServlet) in front of all your controllers
participant "Browser" as B
participant "Embedded Tomcat" as T
participant "DispatcherServlet\\n(a real HttpServlet,\\nmapped to /)" as D
participant "ReservationController\\n(@RestController)" as RC
participant "ReservationService" as RS
B -&gt; T : GET /api/reservations/7
T -&gt; D : service() → doGet()
D -&gt; D : find the handler for\\nGET /api/reservations/{id}
D -&gt; RC : get(7)
RC -&gt; RS : findById(7)
RS --&gt; RC : Reservation
RC --&gt; D : object
D -&gt; D : convert to JSON\\n(HttpMessageConverter)
D --&gt; T : 200 + application/json
T --&gt; B : response
@enduml</code></pre></details>`],
      [18, 'First Servlet Demo',
        `<p class="y-chinh">🎯 The demo file is <code>Demo\\FirstServlet\\WEB-INF\\classes\\FirstServlet.java</code>: an application folder named FirstServlet, whose compiled classes live in <code>WEB-INF/classes</code>.</p>
<p>The path tells the old-school way: put the <code>.java</code> next to the <code>.class</code>, compile by hand with <code>javac</code>, copy the folder into Tomcat's <code>webapps</code>. Today the IDE keeps sources and output apart, but the <strong>result</strong> Tomcat sees is identical — this is the real content of the application the generator built from this lesson's code:</p>
<p class="ghi-chu">📦 Inside the <code>FirstServlet.war</code> the generator built and deployed (<code>jar tf</code>, sorted)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/FirstServlet.class<br>
WEB-INF/classes/ShowRequestHeaders.class<br>
WEB-INF/web.xml<br>
index.html</div>
<table>
<thead><tr><th>In your NetBeans/Maven project</th><th>Ends up in the deployed app as</th></tr></thead>
<tbody>
<tr><td><code>src/main/java/FirstServlet.java</code></td><td><code>WEB-INF/classes/FirstServlet.class</code> (compiled)</td></tr>
<tr><td><code>src/main/webapp/WEB-INF/web.xml</code></td><td><code>WEB-INF/web.xml</code></td></tr>
<tr><td><code>src/main/webapp/index.html</code></td><td><code>index.html</code> (at the root, reachable by URL)</td></tr>
<tr><td>a dependency jar (e.g. the SQL Server driver)</td><td><code>WEB-INF/lib/*.jar</code></td></tr>
</tbody>
</table>
<p><strong>To run it in NetBeans</strong>: right-click the project → Run (Tomcat starts, the app is deployed, the browser opens <code>http://localhost:8080/FirstServlet/</code>); then visit <code>/FirstServlet/FirstServlet</code> — first part = the application, second part = the servlet's URL pattern.</p>
<div class="pitfall">Two different "FirstServlet"s in the URL confuse everyone: <code>/FirstServlet</code> (context root = app name) + <code>/FirstServlet</code> (url-pattern). Renaming the project changes the first one only.</div>`,
        `<p class="y-chinh">🎯 File demo là <code>Demo\\FirstServlet\\WEB-INF\\classes\\FirstServlet.java</code>: một thư mục ứng dụng tên FirstServlet, trong đó các lớp đã biên dịch nằm ở <code>WEB-INF/classes</code>.</p>
<p>Đường dẫn đó cho thấy cách làm kiểu cũ: để file <code>.java</code> cạnh file <code>.class</code>, tự biên dịch bằng <code>javac</code>, chép cả thư mục vào <code>webapps</code> của Tomcat. Ngày nay IDE tách nguồn và đầu ra, nhưng <strong>kết quả</strong> Tomcat nhìn thấy y hệt — đây là nội dung thật của ứng dụng mà bộ sinh bài đã đóng từ code của bài này:</p>
<p class="ghi-chu">📦 Bên trong <code>FirstServlet.war</code> mà generator đã đóng và deploy (<code>jar tf</code>, sắp xếp)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/FirstServlet.class<br>
WEB-INF/classes/ShowRequestHeaders.class<br>
WEB-INF/web.xml<br>
index.html</div>
<table>
<thead><tr><th>Trong project NetBeans/Maven</th><th>Thành ra trong ứng dụng đã deploy</th></tr></thead>
<tbody>
<tr><td><code>src/main/java/FirstServlet.java</code></td><td><code>WEB-INF/classes/FirstServlet.class</code> (đã biên dịch)</td></tr>
<tr><td><code>src/main/webapp/WEB-INF/web.xml</code></td><td><code>WEB-INF/web.xml</code></td></tr>
<tr><td><code>src/main/webapp/index.html</code></td><td><code>index.html</code> (ở gốc, truy cập được bằng URL)</td></tr>
<tr><td>một jar phụ thuộc (vd driver SQL Server)</td><td><code>WEB-INF/lib/*.jar</code></td></tr>
</tbody>
</table>
<p><strong>Chạy trong NetBeans</strong>: chuột phải project → Run (Tomcat khởi động, ứng dụng được deploy, trình duyệt mở <code>http://localhost:8080/FirstServlet/</code>); rồi vào <code>/FirstServlet/FirstServlet</code> — phần đầu = ứng dụng, phần sau = url-pattern của servlet.</p>
<div class="pitfall">Hai chữ "FirstServlet" trong URL làm ai cũng rối: <code>/FirstServlet</code> (context root = tên ứng dụng) + <code>/FirstServlet</code> (url-pattern). Đổi tên project chỉ đổi phần đầu.</div>`],
      [19, 'The Servlet Life Cycle',
        `<p class="y-chinh">🎯 Three phases, all called <strong>by the container</strong>: <code>init</code> (load the servlet code — once), <code>service</code> (handle client requests — once per request, possibly many at the same time), <code>destroy</code> (unload — once).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/d82e956ba4f90830068617d049926e2881f50965.svg" alt="The life cycle of slide 19 as a state machine" loading="lazy" /><p class="chu-thich">🧩 The life cycle of slide 19 as a state machine</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Servlet life cycle (slide 19) as a state machine
[*] --&gt; NotLoaded
NotLoaded --&gt; Ready : first request\\n(or deployment, if load-on-startup)\\n/ new object + init(config)
Ready --&gt; Ready : each request\\n/ service(req, resp) → doGet / doPost ...
Ready --&gt; Destroyed : undeploy, reload or Tomcat shutdown\\n/ destroy()
Destroyed --&gt; [*] : object garbage-collected
NotLoaded : class known from web.xml\\nor @WebServlet, no object yet
Ready : ONE object, many threads\\ncall service() at the same time
@enduml</code></pre></details>
<p>Here is a servlet that prints every life-cycle call, then three GETs and an undeploy, with the <strong>real Tomcat console</strong> under each response:</p>
<p class="ghi-chu">📄 <code>vong-doi/src/main/java/demo/LifeServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void init(ServletConfig config) throws ServletException {
    super.init(config);                     // keep the config (getServletConfig() needs it)
    System.out.println("LifeServlet.init()  — object created, ready to serve");
}

@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    int n;
    synchronized (this) { n = ++requests; }   // many threads may run doGet at once
    System.out.println("LifeServlet.doGet() — request #" + n);
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("This servlet object has served " + n + " request(s)");
}

@Override
public void destroy() {
    System.out.println("LifeServlet.destroy() — served " + requests + " request(s), goodbye");
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /vong-doi/life HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 44

This servlet object has served 1 request(s)</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">EagerServlet.init() — at deployment, greeting = Xin chào PRJ301<br>
LifeServlet.init() &nbsp;— object created, ready to serve<br>
LifeServlet.doGet() — request #1</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /vong-doi/life HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 44

This servlet object has served 2 request(s)</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">LifeServlet.doGet() — request #2</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /vong-doi/life HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 44

This servlet object has served 3 request(s)</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">LifeServlet.doGet() — request #3</div>
<p class="ghi-chu">🛑 Undeploy the application (delete the WAR) — the Tomcat console prints:</p>
<div class="out log">EagerServlet.destroy()<br>
LifeServlet.destroy() — served 3 request(s), goodbye</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/51c5113f6ffd1cd62ffc0130bd4649366d0cc717.svg" alt="The same run on a time line" loading="lazy" /><p class="chu-thich">🧩 The same run on a time line</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title The life cycle on a time line — exactly what the Tomcat console printed
participant "Tomcat" as T
participant "EagerServlet\\n(load-on-startup 1)" as E
participant "LifeServlet\\n(@WebServlet)" as L
== deploy vong-doi.war ==
T -&gt; E : new + init()
note right of E : "EagerServlet.init() — at deployment"
== GET /vong-doi/life (3 times) ==
T -&gt; L : new + init(config) (first request only)
T -&gt; L : doGet #1
T -&gt; L : doGet #2
T -&gt; L : doGet #3
== undeploy (WAR deleted) ==
T -&gt; E : destroy()
T -&gt; L : destroy()
note right of L : "served 3 request(s), goodbye"
@enduml</code></pre></details>
<ul>
<li><code>init()</code> ran <strong>once</strong>, at the first request (no <code>&lt;load-on-startup&gt;</code>); the counter shows the same object served all three requests.</li>
<li><code>EagerServlet</code> was initialised at <em>deployment</em>, before any request, because web.xml gives it <code>&lt;load-on-startup&gt;1&lt;/load-on-startup&gt;</code> (slide 37).</li>
<li><code>destroy()</code> ran when the app was removed — use it to close resources opened in <code>init()</code>.</li>
</ul>
<div class="pitfall">One object, <strong>many threads</strong>: two users clicking at the same time run <code>doGet</code> concurrently on the same object. An instance field like <code>requests</code> is shared — that is why it is updated inside <code>synchronized</code>. Never store per-user data (username, cart) in a servlet field: use the request or the session (Chapter 4).</div>`,
        `<p class="y-chinh">🎯 Ba giai đoạn, đều do <strong>container gọi</strong>: <code>init</code> (nạp code servlet — một lần), <code>service</code> (xử lý request của client — mỗi request một lần, có thể nhiều cái cùng lúc), <code>destroy</code> (gỡ ra — một lần).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/d82e956ba4f90830068617d049926e2881f50965.svg" alt="Vòng đời ở slide 19 vẽ thành máy trạng thái" loading="lazy" /><p class="chu-thich">🧩 Vòng đời ở slide 19 vẽ thành máy trạng thái</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Servlet life cycle (slide 19) as a state machine
[*] --&gt; NotLoaded
NotLoaded --&gt; Ready : first request\\n(or deployment, if load-on-startup)\\n/ new object + init(config)
Ready --&gt; Ready : each request\\n/ service(req, resp) → doGet / doPost ...
Ready --&gt; Destroyed : undeploy, reload or Tomcat shutdown\\n/ destroy()
Destroyed --&gt; [*] : object garbage-collected
NotLoaded : class known from web.xml\\nor @WebServlet, no object yet
Ready : ONE object, many threads\\ncall service() at the same time
@enduml</code></pre></details>
<p>Đây là một servlet in ra mỗi lần được gọi trong vòng đời, rồi ba lần GET và một lần gỡ app, kèm <strong>console thật của Tomcat</strong> dưới mỗi response:</p>
<p class="ghi-chu">📄 <code>vong-doi/src/main/java/demo/LifeServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void init(ServletConfig config) throws ServletException {
    super.init(config);                     // giữ config lại (getServletConfig() cần nó)
    System.out.println("LifeServlet.init()  — object created, ready to serve");
}

@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    int n;
    synchronized (this) { n = ++requests; }   // nhiều luồng có thể chạy doGet cùng lúc
    System.out.println("LifeServlet.doGet() — request #" + n);
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("This servlet object has served " + n + " request(s)");
}

@Override
public void destroy() {
    System.out.println("LifeServlet.destroy() — served " + requests + " request(s), goodbye");
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /vong-doi/life HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 44

This servlet object has served 1 request(s)</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">EagerServlet.init() — at deployment, greeting = Xin chào PRJ301<br>
LifeServlet.init() &nbsp;— object created, ready to serve<br>
LifeServlet.doGet() — request #1</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /vong-doi/life HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 44

This servlet object has served 2 request(s)</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">LifeServlet.doGet() — request #2</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /vong-doi/life HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 44

This servlet object has served 3 request(s)</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">LifeServlet.doGet() — request #3</div>
<p class="ghi-chu">🛑 Gỡ ứng dụng khỏi Tomcat (xoá file WAR) — console của Tomcat in ra:</p>
<div class="out log">EagerServlet.destroy()<br>
LifeServlet.destroy() — served 3 request(s), goodbye</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/51c5113f6ffd1cd62ffc0130bd4649366d0cc717.svg" alt="Cùng lần chạy đó, đặt trên trục thời gian" loading="lazy" /><p class="chu-thich">🧩 Cùng lần chạy đó, đặt trên trục thời gian</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title The life cycle on a time line — exactly what the Tomcat console printed
participant "Tomcat" as T
participant "EagerServlet\\n(load-on-startup 1)" as E
participant "LifeServlet\\n(@WebServlet)" as L
== deploy vong-doi.war ==
T -&gt; E : new + init()
note right of E : "EagerServlet.init() — at deployment"
== GET /vong-doi/life (3 times) ==
T -&gt; L : new + init(config) (first request only)
T -&gt; L : doGet #1
T -&gt; L : doGet #2
T -&gt; L : doGet #3
== undeploy (WAR deleted) ==
T -&gt; E : destroy()
T -&gt; L : destroy()
note right of L : "served 3 request(s), goodbye"
@enduml</code></pre></details>
<ul>
<li><code>init()</code> chạy <strong>một lần</strong>, ở request đầu tiên (vì không có <code>&lt;load-on-startup&gt;</code>); bộ đếm cho thấy cùng một đối tượng đã phục vụ cả ba request.</li>
<li><code>EagerServlet</code> được khởi tạo ngay lúc <em>deploy</em>, trước mọi request, vì web.xml cho nó <code>&lt;load-on-startup&gt;1&lt;/load-on-startup&gt;</code> (slide 37).</li>
<li><code>destroy()</code> chạy khi ứng dụng bị gỡ — dùng nó để đóng tài nguyên đã mở trong <code>init()</code>.</li>
</ul>
<div class="pitfall">Một đối tượng, <strong>nhiều luồng</strong>: hai người bấm cùng lúc sẽ chạy <code>doGet</code> song song trên cùng một đối tượng. Trường đối tượng như <code>requests</code> là dùng chung — vì vậy nó được cập nhật trong <code>synchronized</code>. Đừng bao giờ cất dữ liệu riêng của từng người (username, giỏ hàng) vào trường của servlet: dùng request hoặc session (Chương 4).</div>`],
      [20, 'HttpServlet Class',
        `<p class="y-chinh">🎯 HttpServlet implements the HTTP "methods": its <code>service</code> method calls <code>doGet</code>, <code>doHead</code>, <code>doPost</code>, <code>doPut</code>, <code>doDelete</code>, <code>doTrace</code> or <code>doOptions</code> according to the request's method — you override only the ones you need.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/56ecb8b11a080c6339729d58bdc0a6fb59d3ca95.svg" alt="What HttpServlet.service() does with each method" loading="lazy" /><p class="chu-thich">🧩 What HttpServlet.service() does with each method</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title HttpServlet.service() picks the doXxx method (slide 20)
start
:request arrives\\nservice(req, resp);
switch (req.getMethod())
case (GET)
  :doGet;
case (POST)
  :doPost;
case (PUT / DELETE)
  :doPut / doDelete;
case (HEAD)
  :doHead\\n(doGet without the body);
case (OPTIONS)
  :doOptions\\n→ Allow: methods you overrode;
case (TRACE)
  :doTrace\\n(Tomcat refuses: 405);
case (other, e.g. PATCH)
  :501 Not Implemented;
endswitch
if (you did NOT override that doXxx?) then (yes)
  :inherited doXxx\\n→ 405 Method Not Allowed;
else (no)
  :your code runs;
endif
stop
@enduml</code></pre></details>
<p>The <code>/notes</code> servlet of lesson 1.A overrides four of them:</p>
<p class="ghi-chu">📄 <code>phuong-thuc/src/main/java/demo/NotesServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override   // POST = create; NOT idempotent: two POSTs = two notes
protected synchronized void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    int id = nextId++;
    notes.put(id, req.getParameter("text"));
    resp.setStatus(HttpServletResponse.SC_CREATED);              // 201
    resp.setHeader("Location", "notes?id=" + id);                // where the new note lives
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("created #" + id);
}</code></pre>
<p class="ghi-chu">📄 <code>phuong-thuc/src/main/java/demo/NotesServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override   // PUT = replace; idempotent: repeating it leaves the same state
protected synchronized void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    int id = Integer.parseInt(req.getParameter("id"));            // id from the URL
    BufferedReader body = req.getReader();                         // PUT body is NOT parsed by getParameter
    notes.put(id, body.readLine());
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("note #" + id + " = " + notes.get(id));
}</code></pre>
<p>What you get <strong>for free</strong> from HttpServlet, proven by real responses: <code>doHead</code> runs your <code>doGet</code> and throws the body away (lesson 1.A, slide 11); <code>doOptions</code> lists exactly the methods you overrode (<code>Allow: GET, HEAD, POST, PUT, DELETE, OPTIONS</code>); a method you did <em>not</em> override answers 405; a method HttpServlet does not know (PATCH) answers 501:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">TRACE /phuong-thuc/notes HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 405
Allow: HEAD, DELETE, POST, GET, OPTIONS, PUT
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 735

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 405 – Method Not Allowed
Type Status Report
Message TRACE method is not allowed
Description The method received in the request-line is known by the origin server but not supported by the target resource.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">PATCH /phuong-thuc/notes?id=1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 501
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 731

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 501 – Not Implemented
Type Status Report
Message Method [PATCH] is not implemented by this Servlet for this URI
Description The server does not support the functionality required to fulfill the request.
Apache Tomcat/10.1.61</code></pre>
<div class="pitfall">FE trap: "Which method of HttpServlet handles the request when the form says <code>method="POST"</code>?" → <code>doPost(HttpServletRequest, HttpServletResponse)</code> — exact spelling, lower-case "ost". <code>doPOST</code>, <code>servicePost</code>, <code>post</code> do not exist. And if you override <code>service()</code> itself, none of the doXxx is called any more.</div>`,
        `<p class="y-chinh">🎯 HttpServlet cài đặt các "method" HTTP: phương thức <code>service</code> của nó gọi <code>doGet</code>, <code>doHead</code>, <code>doPost</code>, <code>doPut</code>, <code>doDelete</code>, <code>doTrace</code> hoặc <code>doOptions</code> tuỳ theo method của request — bạn chỉ ghi đè những cái cần dùng.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/56ecb8b11a080c6339729d58bdc0a6fb59d3ca95.svg" alt="HttpServlet.service() làm gì với từng method" loading="lazy" /><p class="chu-thich">🧩 HttpServlet.service() làm gì với từng method</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title HttpServlet.service() picks the doXxx method (slide 20)
start
:request arrives\\nservice(req, resp);
switch (req.getMethod())
case (GET)
  :doGet;
case (POST)
  :doPost;
case (PUT / DELETE)
  :doPut / doDelete;
case (HEAD)
  :doHead\\n(doGet without the body);
case (OPTIONS)
  :doOptions\\n→ Allow: methods you overrode;
case (TRACE)
  :doTrace\\n(Tomcat refuses: 405);
case (other, e.g. PATCH)
  :501 Not Implemented;
endswitch
if (you did NOT override that doXxx?) then (yes)
  :inherited doXxx\\n→ 405 Method Not Allowed;
else (no)
  :your code runs;
endif
stop
@enduml</code></pre></details>
<p>Servlet <code>/notes</code> ở bài 1.A ghi đè bốn cái:</p>
<p class="ghi-chu">📄 <code>phuong-thuc/src/main/java/demo/NotesServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override   // POST = tạo mới; KHÔNG idempotent: hai lần POST = hai ghi chú
protected synchronized void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    int id = nextId++;
    notes.put(id, req.getParameter("text"));
    resp.setStatus(HttpServletResponse.SC_CREATED);              // 201
    resp.setHeader("Location", "notes?id=" + id);                // ghi chú mới nằm ở đâu
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("created #" + id);
}</code></pre>
<p class="ghi-chu">📄 <code>phuong-thuc/src/main/java/demo/NotesServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override   // PUT = thay thế; idempotent: lặp lại vẫn ra cùng trạng thái
protected synchronized void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    int id = Integer.parseInt(req.getParameter("id"));            // id lấy trên URL
    BufferedReader body = req.getReader();                         // thân PUT KHÔNG được getParameter đọc
    notes.put(id, body.readLine());
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("note #" + id + " = " + notes.get(id));
}</code></pre>
<p>Những gì bạn được HttpServlet <strong>cho không</strong>, có response thật làm chứng: <code>doHead</code> chạy <code>doGet</code> của bạn rồi bỏ body đi (bài 1.A, slide 11); <code>doOptions</code> liệt kê đúng các method bạn đã ghi đè (<code>Allow: GET, HEAD, POST, PUT, DELETE, OPTIONS</code>); method bạn <em>không</em> ghi đè thì trả 405; method mà HttpServlet không biết (PATCH) thì trả 501:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">TRACE /phuong-thuc/notes HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 405
Allow: HEAD, DELETE, POST, GET, OPTIONS, PUT
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 735

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 405 – Method Not Allowed
Type Status Report
Message TRACE method is not allowed
Description The method received in the request-line is known by the origin server but not supported by the target resource.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">PATCH /phuong-thuc/notes?id=1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 501
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 731

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 501 – Not Implemented
Type Status Report
Message Method [PATCH] is not implemented by this Servlet for this URI
Description The server does not support the functionality required to fulfill the request.
Apache Tomcat/10.1.61</code></pre>
<div class="pitfall">Bẫy FE: "Phương thức nào của HttpServlet xử lý request khi form ghi <code>method="POST"</code>?" → <code>doPost(HttpServletRequest, HttpServletResponse)</code> — đúng chính tả, "ost" viết thường. <code>doPOST</code>, <code>servicePost</code>, <code>post</code> không tồn tại. Và nếu bạn ghi đè chính <code>service()</code>, sẽ không còn doXxx nào được gọi nữa.</div>`],
      [21, 'Request Headers',
        `<p class="y-chinh">🎯 Besides the request line, a browser sends headers: Accept (MIME types it prefers), Accept-Charset, Content-Length (size of a POST body), Connection (keep-alive?), <strong>Cookie</strong> (one of the most important), Host, If-Modified-Since, Referer.</p>
<table>
<thead><tr><th>Header</th><th>What the servlet learns</th><th>Read it with</th></tr></thead>
<tbody>
<tr><td>Accept</td><td>what formats the client wants</td><td><code>request.getHeader("Accept")</code></td></tr>
<tr><td>Accept-Charset</td><td>preferred character set (obsolete — browsers stopped sending it; UTF-8 is assumed)</td><td>—</td></tr>
<tr><td>Accept-Language</td><td><code>vi-VN,vi;q=0.9,en;q=0.8</code> → show Vietnamese</td><td><code>request.getLocale()</code></td></tr>
<tr><td>Content-Length</td><td>bytes in the body (POST/PUT)</td><td><code>request.getContentLength()</code></td></tr>
<tr><td>Connection</td><td>keep the TCP connection open?</td><td>(handled by Tomcat)</td></tr>
<tr><td>Cookie</td><td>values the server stored earlier</td><td><code>request.getCookies()</code></td></tr>
<tr><td>Host</td><td>host and port from the URL</td><td><code>request.getServerName()</code>, <code>getServerPort()</code></td></tr>
<tr><td>If-Modified-Since</td><td>"I have a copy from this date"</td><td>static files: Tomcat answers 304 itself</td></tr>
<tr><td>Referer</td><td>the page whose link led here (misspelt in the standard, kept forever)</td><td><code>request.getHeader("Referer")</code></td></tr>
</tbody>
</table>
<p><code>If-Modified-Since</code> in action — the browser already holds <code>index.html</code>, so Tomcat answers <strong>304 Not Modified</strong> with no body, saving the download:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/index.html HTTP/1.1
Host: localhost:8080
If-Modified-Since: Thu, 01 Jan 2026 00:00:00 GMT</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 304
ETag: W/"256-1767225600000"</code></pre>
<div class="pitfall">Headers come from the client and can be faked: anyone can send <code>Referer: https://fap.fpt.edu.vn</code>. Never use a header to decide security (who is logged in, what role) — use the session (Chapter 4) and Filters (Chapter 8).</div>`,
        `<p class="y-chinh">🎯 Ngoài dòng request, trình duyệt còn gửi các header: Accept (kiểu MIME nó thích), Accept-Charset, Content-Length (cỡ body của POST), Connection (giữ kết nối?), <strong>Cookie</strong> (một trong những header quan trọng nhất), Host, If-Modified-Since, Referer.</p>
<table>
<thead><tr><th>Header</th><th>Servlet biết được gì</th><th>Đọc bằng</th></tr></thead>
<tbody>
<tr><td>Accept</td><td>client muốn định dạng nào</td><td><code>request.getHeader("Accept")</code></td></tr>
<tr><td>Accept-Charset</td><td>bảng mã ưa thích (đã lỗi thời — trình duyệt thôi gửi; mặc định coi là UTF-8)</td><td>—</td></tr>
<tr><td>Accept-Language</td><td><code>vi-VN,vi;q=0.9,en;q=0.8</code> → hiện tiếng Việt</td><td><code>request.getLocale()</code></td></tr>
<tr><td>Content-Length</td><td>số byte trong body (POST/PUT)</td><td><code>request.getContentLength()</code></td></tr>
<tr><td>Connection</td><td>có giữ kết nối TCP không?</td><td>(Tomcat tự lo)</td></tr>
<tr><td>Cookie</td><td>các giá trị server đã cất từ trước</td><td><code>request.getCookies()</code></td></tr>
<tr><td>Host</td><td>host và cổng lấy từ URL</td><td><code>request.getServerName()</code>, <code>getServerPort()</code></td></tr>
<tr><td>If-Modified-Since</td><td>"tôi đã có bản sao từ ngày này"</td><td>file tĩnh: Tomcat tự trả 304</td></tr>
<tr><td>Referer</td><td>trang có liên kết dẫn tới đây (viết sai chính tả từ trong chuẩn, giữ luôn tới nay)</td><td><code>request.getHeader("Referer")</code></td></tr>
</tbody>
</table>
<p><code>If-Modified-Since</code> trong thực tế — trình duyệt đã có sẵn <code>index.html</code>, nên Tomcat trả <strong>304 Not Modified</strong> (không đổi), không có body, đỡ phải tải lại:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/index.html HTTP/1.1
Host: localhost:8080
If-Modified-Since: Thu, 01 Jan 2026 00:00:00 GMT</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 304
ETag: W/"256-1767225600000"</code></pre>
<div class="pitfall">Header do client gửi nên làm giả được: ai cũng gửi được <code>Referer: https://fap.fpt.edu.vn</code>. Đừng bao giờ dựa vào header để quyết chuyện bảo mật (ai đang đăng nhập, vai trò gì) — dùng session (Chương 4) và Filter (Chương 8).</div>`],
      [22, 'Request Headers…',
        `<p class="y-chinh">🎯 <code>ShowRequestHeaders</code>: <code>request.getHeaderNames()</code> returns an <code>Enumeration</code> of every header name; for each name, <code>request.getHeader(name)</code> gives its value; the servlet prints them as an HTML table.</p>
<p class="ghi-chu">📄 <code>FirstServlet/src/main/java/ShowRequestHeaders.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    response.setContentType("text/html");
    PrintWriter out = response.getWriter();
    Enumeration&lt;String&gt; headerNames = request.getHeaderNames();   // every header name the browser sent
    out.println("&lt;TABLE&gt;");
    while (headerNames.hasMoreElements()) {
        String headerName = headerNames.nextElement();
        out.println("&lt;TR&gt;&lt;TD&gt;" + headerName + "&lt;/TD&gt;");
        out.println("&lt;TD&gt;" + request.getHeader(headerName) + "&lt;/TD&gt;&lt;/TR&gt;");
    }
    out.println("&lt;/TABLE&gt;");
}</code></pre>
<p>Two modernisations compared with the slide, nothing else: <code>jakarta</code> instead of <code>javax</code>, and <code>Enumeration&lt;String&gt;</code> (generic, Java 5+) instead of the raw <code>Enumeration</code> + cast <code>(String)</code>. The loop <code>while (hasMoreElements()) … nextElement()</code> is the pre-Java-5 way of iterating; today you could write <code>for (String h : Collections.list(request.getHeaderNames()))</code>.</p>
<p class="nhan">Related request methods worth knowing</p>
<table>
<thead><tr><th>Method</th><th>Returns</th></tr></thead>
<tbody>
<tr><td><code>getHeader(name)</code></td><td>first value of that header, or <code>null</code></td></tr>
<tr><td><code>getHeaders(name)</code></td><td>all values (a header may repeat)</td></tr>
<tr><td><code>getIntHeader(name)</code> / <code>getDateHeader(name)</code></td><td>parsed as int / as milliseconds</td></tr>
<tr><td><code>getMethod()</code>, <code>getRequestURI()</code>, <code>getQueryString()</code></td><td>the request line, in pieces</td></tr>
<tr><td><code>getContextPath()</code>, <code>getServletPath()</code></td><td><code>/FirstServlet</code>, <code>/ShowRequestHeaders</code></td></tr>
</tbody>
</table>
<div class="pitfall">The slide prints header <em>values</em> straight into HTML. A value containing <code>&lt;script&gt;</code> would run in the page (XSS — slide 31 shows it for real). For a debugging page on your own machine that is acceptable; for anything users see, escape it.</div>`,
        `<p class="y-chinh">🎯 <code>ShowRequestHeaders</code>: <code>request.getHeaderNames()</code> trả về một <code>Enumeration</code> chứa mọi tên header; với mỗi tên, <code>request.getHeader(name)</code> cho giá trị của nó; servlet in chúng thành một bảng HTML.</p>
<p class="ghi-chu">📄 <code>FirstServlet/src/main/java/ShowRequestHeaders.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    response.setContentType("text/html");
    PrintWriter out = response.getWriter();
    Enumeration&lt;String&gt; headerNames = request.getHeaderNames();   // mọi tên header trình duyệt đã gửi
    out.println("&lt;TABLE&gt;");
    while (headerNames.hasMoreElements()) {
        String headerName = headerNames.nextElement();
        out.println("&lt;TR&gt;&lt;TD&gt;" + headerName + "&lt;/TD&gt;");
        out.println("&lt;TD&gt;" + request.getHeader(headerName) + "&lt;/TD&gt;&lt;/TR&gt;");
    }
    out.println("&lt;/TABLE&gt;");
}</code></pre>
<p>Hai chỗ hiện đại hoá so với slide, ngoài ra giữ nguyên: <code>jakarta</code> thay cho <code>javax</code>, và <code>Enumeration&lt;String&gt;</code> (generic, Java 5+) thay cho <code>Enumeration</code> thô + ép kiểu <code>(String)</code>. Vòng <code>while (hasMoreElements()) … nextElement()</code> là cách duyệt thời trước Java 5; ngày nay có thể viết <code>for (String h : Collections.list(request.getHeaderNames()))</code>.</p>
<p class="nhan">Các phương thức request liên quan nên biết</p>
<table>
<thead><tr><th>Phương thức</th><th>Trả về</th></tr></thead>
<tbody>
<tr><td><code>getHeader(name)</code></td><td>giá trị đầu tiên của header đó, hoặc <code>null</code></td></tr>
<tr><td><code>getHeaders(name)</code></td><td>mọi giá trị (một header có thể lặp lại)</td></tr>
<tr><td><code>getIntHeader(name)</code> / <code>getDateHeader(name)</code></td><td>đọc thành int / thành mili giây</td></tr>
<tr><td><code>getMethod()</code>, <code>getRequestURI()</code>, <code>getQueryString()</code></td><td>dòng request, tách từng phần</td></tr>
<tr><td><code>getContextPath()</code>, <code>getServletPath()</code></td><td><code>/FirstServlet</code>, <code>/ShowRequestHeaders</code></td></tr>
</tbody>
</table>
<div class="pitfall">Slide in thẳng <em>giá trị</em> header vào HTML. Một giá trị chứa <code>&lt;script&gt;</code> sẽ chạy trong trang (XSS — slide 31 cho xem thật). Với trang gỡ lỗi trên máy mình thì chấp nhận được; với thứ người dùng nhìn thấy, phải thoát ký tự (escape).</div>`],
      [23, 'Show Request Header Demo',
        `<p class="y-chinh">🎯 The demo runs <code>ShowRequestHeaders</code> from the same FirstServlet application: open <code>/FirstServlet/ShowRequestHeaders</code> and the browser shows the headers it just sent.</p>
<p>This is the real result for a request shaped like a current Chrome on Windows that arrived from the app's home page:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/ShowRequestHeaders HTTP/1.1
Host: localhost:8080
Accept: text/html,application/xhtml+xml
Accept-Language: vi-VN,vi;q=0.9,en;q=0.8
Accept-Encoding: gzip, deflate
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0
Referer: http://localhost:8080/FirstServlet/
Cookie: theme=dark</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 463

&lt;TABLE&gt;
&lt;TR&gt;&lt;TD&gt;host&lt;/TD&gt;
&lt;TD&gt;localhost:8080&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;accept&lt;/TD&gt;
&lt;TD&gt;text/html,application/xhtml+xml&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;accept-language&lt;/TD&gt;
&lt;TD&gt;vi-VN,vi;q=0.9,en;q=0.8&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;accept-encoding&lt;/TD&gt;
&lt;TD&gt;gzip, deflate&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;user-agent&lt;/TD&gt;
&lt;TD&gt;Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;referer&lt;/TD&gt;
&lt;TD&gt;http://localhost:8080/FirstServlet/&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;cookie&lt;/TD&gt;
&lt;TD&gt;theme=dark&lt;/TD&gt;&lt;/TR&gt;
&lt;/TABLE&gt;</code></pre>
<p>Read it as a detective: <em>accept-language</em> says the user prefers Vietnamese; <em>referer</em> says they clicked a link on <code>/FirstServlet/</code>; <em>cookie</em> carries a value the site set earlier; <em>accept-encoding</em> allows compression. Your own browser sends many more (<code>sec-ch-ua</code>, <code>sec-fetch-*</code>…) — run the app and compare with DevTools → Network → the request → "Request Headers".</p>
<p class="meo">🧠 The servlet is useful far beyond the demo: when a login or a file upload "does not work", printing the headers and parameters it really received is the fastest way to see whether the browser sent what you think.</p>`,
        `<p class="y-chinh">🎯 Demo chạy <code>ShowRequestHeaders</code> trong cùng ứng dụng FirstServlet: mở <code>/FirstServlet/ShowRequestHeaders</code> là trình duyệt hiện ra đúng các header nó vừa gửi.</p>
<p>Đây là kết quả thật cho một request có dạng như Chrome đời mới trên Windows, đi tới từ trang chủ của ứng dụng:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/ShowRequestHeaders HTTP/1.1
Host: localhost:8080
Accept: text/html,application/xhtml+xml
Accept-Language: vi-VN,vi;q=0.9,en;q=0.8
Accept-Encoding: gzip, deflate
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0
Referer: http://localhost:8080/FirstServlet/
Cookie: theme=dark</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 463

&lt;TABLE&gt;
&lt;TR&gt;&lt;TD&gt;host&lt;/TD&gt;
&lt;TD&gt;localhost:8080&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;accept&lt;/TD&gt;
&lt;TD&gt;text/html,application/xhtml+xml&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;accept-language&lt;/TD&gt;
&lt;TD&gt;vi-VN,vi;q=0.9,en;q=0.8&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;accept-encoding&lt;/TD&gt;
&lt;TD&gt;gzip, deflate&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;user-agent&lt;/TD&gt;
&lt;TD&gt;Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;referer&lt;/TD&gt;
&lt;TD&gt;http://localhost:8080/FirstServlet/&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;cookie&lt;/TD&gt;
&lt;TD&gt;theme=dark&lt;/TD&gt;&lt;/TR&gt;
&lt;/TABLE&gt;</code></pre>
<p>Đọc như thám tử: <em>accept-language</em> cho biết người dùng thích tiếng Việt; <em>referer</em> cho biết họ bấm một liên kết trên <code>/FirstServlet/</code>; <em>cookie</em> mang một giá trị site đã đặt từ trước; <em>accept-encoding</em> cho phép nén. Trình duyệt của bạn gửi nhiều hơn nữa (<code>sec-ch-ua</code>, <code>sec-fetch-*</code>…) — chạy ứng dụng rồi so với DevTools → Network → chọn request → "Request Headers".</p>
<p class="meo">🧠 Servlet này có ích vượt xa bài demo: khi đăng nhập hay tải file "không chạy", in ra header và tham số servlet thật sự nhận được là cách nhanh nhất để biết trình duyệt có gửi đúng thứ bạn nghĩ không.</p>`],
      [24, 'HTTP Response',
        `<p class="y-chinh">🎯 A response = status line + response headers + a blank line + the document. The status line holds the HTTP version, a numeric status code and a short message; in most cases every header is optional except <strong>Content-Type</strong>, which gives the MIME type of the document.</p>
<p>The slide's exact example, produced by a servlet:</p>
<p class="ghi-chu">📄 <code>phan-hoi/src/main/java/demo/ResponseServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "/welcome" -&gt; {                                   // exactly the slide's example
    resp.setContentType("text/plain");
    resp.getWriter().println("Welcome to Servlets World");
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phan-hoi/r/welcome HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 26

Welcome to Servlets World</code></pre>
<p>Compare with the slide line by line: the status line is <code>HTTP/1.1 200</code> — Tomcat sends no "OK" (slide 15); and <code>Content-Type</code> became <code>text/plain;charset=UTF-8</code> although the code only said <code>text/plain</code>. Why? Tomcat 10's global <code>conf/web.xml</code> sets <code>&lt;response-character-encoding&gt;UTF-8&lt;/response-character-encoding&gt;</code>. The Servlet specification's own default is ISO-8859-1, which cannot encode most Vietnamese letters — this is what a server <em>without</em> that setting sends:</p>
<p class="ghi-chu">📄 <code>phan-hoi/src/main/java/demo/ResponseServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "/mac-dinh" -&gt; {                                  // no charset: Tomcat 10+ falls back to conf/web.xml (UTF-8)
    resp.setContentType("text/html");
    resp.getWriter().println("&lt;p&gt;Xin chào các bạn&lt;/p&gt;");
}
case "/vi-sai" -&gt; {                                    // what a server WITHOUT that default does (Servlet spec: ISO-8859-1)
    resp.setContentType("text/html;charset=ISO-8859-1");
    resp.getWriter().println("&lt;p&gt;Xin chào các bạn&lt;/p&gt;");
}
case "/vi-dung" -&gt; {                                   // charset declared BEFORE getWriter()
    resp.setContentType("text/html;charset=UTF-8");
    resp.getWriter().println("&lt;p&gt;Xin chào các bạn&lt;/p&gt;");
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phan-hoi/r/vi-sai HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=ISO-8859-1
Content-Length: 24

&lt;p&gt;Xin chào các b?n&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phan-hoi/r/vi-dung HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 28

&lt;p&gt;Xin chào các bạn&lt;/p&gt;</code></pre>
<p>You also choose the status and add headers; <code>sendRedirect</code> answers 302 with a <code>Location</code> header and the browser makes a second request:</p>
<p class="ghi-chu">📄 <code>phan-hoi/src/main/java/demo/ResponseServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "/header" -&gt; {
    resp.setStatus(HttpServletResponse.SC_ACCEPTED);   // 202 instead of the default 200
    resp.setHeader("X-Course", "PRJ301");              // any header you like
    resp.setHeader("Cache-Control", "no-store");       // a real, useful one
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("look at the headers above");
}
case "/redirect" -&gt; resp.sendRedirect("welcome");     // 302 + Location, no body to read</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phan-hoi/r/header HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 202
X-Course: PRJ301
Cache-Control: no-store
Content-Type: text/plain;charset=UTF-8
Content-Length: 26

look at the headers above</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phan-hoi/r/redirect HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: welcome
Content-Length: 0</code></pre>
<p class="nhan">"Headers before the document" — the real proof</p>
<p class="ghi-chu">📄 <code>phan-hoi/src/main/java/demo/ResponseServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "/qua-muon" -&gt; {
    resp.setContentType("text/plain;charset=UTF-8");
    PrintWriter out = resp.getWriter();
    out.println("body first...");
    out.flush();                                        // the response is now COMMITTED: headers already sent
    resp.setHeader("X-Too-Late", "yes");               // silently ignored
    resp.setStatus(500);                                // ignored too
    out.println("isCommitted() = " + resp.isCommitted());
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phan-hoi/r/qua-muon HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Transfer-Encoding: chunked

body first...
isCommitted() = true</code></pre>
<div class="pitfall">After <code>flush()</code> the headers were already on the wire: <code>setStatus(500)</code> and <code>X-Too-Late</code> were <strong>silently ignored</strong> — the status stayed 200. Note also <code>Transfer-Encoding: chunked</code> instead of <code>Content-Length</code>: Tomcat could no longer know the final length. Lesson: decide status, headers, cookies, redirects <em>first</em>, write the body <em>last</em>.</div>`,
        `<p class="y-chinh">🎯 Một response = dòng trạng thái + các header của response + một dòng trống + tài liệu. Dòng trạng thái gồm phiên bản HTTP, một mã trạng thái dạng số và một thông điệp ngắn; trong đa số trường hợp mọi header đều tuỳ chọn, trừ <strong>Content-Type</strong> — cho biết kiểu MIME của tài liệu.</p>
<p>Đúng ví dụ trên slide, do một servlet tạo ra:</p>
<p class="ghi-chu">📄 <code>phan-hoi/src/main/java/demo/ResponseServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "/welcome" -&gt; {                                   // đúng ví dụ trên slide
    resp.setContentType("text/plain");
    resp.getWriter().println("Welcome to Servlets World");
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phan-hoi/r/welcome HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 26

Welcome to Servlets World</code></pre>
<p>So từng dòng với slide: dòng trạng thái là <code>HTTP/1.1 200</code> — Tomcat không gửi chữ "OK" (slide 15); và <code>Content-Type</code> thành <code>text/plain;charset=UTF-8</code> dù code chỉ ghi <code>text/plain</code>. Vì sao? File <code>conf/web.xml</code> dùng chung của Tomcat 10 đặt <code>&lt;response-character-encoding&gt;UTF-8&lt;/response-character-encoding&gt;</code>. Mặc định của chính đặc tả Servlet là ISO-8859-1, không mã hoá được phần lớn chữ có dấu tiếng Việt — đây là thứ một server <em>không</em> có thiết lập đó gửi đi:</p>
<p class="ghi-chu">📄 <code>phan-hoi/src/main/java/demo/ResponseServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "/mac-dinh" -&gt; {                                  // không khai charset: Tomcat 10+ lấy theo conf/web.xml (UTF-8)
    resp.setContentType("text/html");
    resp.getWriter().println("&lt;p&gt;Xin chào các bạn&lt;/p&gt;");
}
case "/vi-sai" -&gt; {                                    // điều server KHÔNG có mặc định đó làm (đặc tả Servlet: ISO-8859-1)
    resp.setContentType("text/html;charset=ISO-8859-1");
    resp.getWriter().println("&lt;p&gt;Xin chào các bạn&lt;/p&gt;");
}
case "/vi-dung" -&gt; {                                   // khai charset TRƯỚC getWriter()
    resp.setContentType("text/html;charset=UTF-8");
    resp.getWriter().println("&lt;p&gt;Xin chào các bạn&lt;/p&gt;");
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phan-hoi/r/vi-sai HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=ISO-8859-1
Content-Length: 24

&lt;p&gt;Xin chào các b?n&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phan-hoi/r/vi-dung HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 28

&lt;p&gt;Xin chào các bạn&lt;/p&gt;</code></pre>
<p>Bạn cũng tự chọn mã trạng thái và thêm header; <code>sendRedirect</code> trả 302 kèm header <code>Location</code> và trình duyệt gửi request thứ hai:</p>
<p class="ghi-chu">📄 <code>phan-hoi/src/main/java/demo/ResponseServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "/header" -&gt; {
    resp.setStatus(HttpServletResponse.SC_ACCEPTED);   // 202 thay cho 200 mặc định
    resp.setHeader("X-Course", "PRJ301");              // header tuỳ ý
    resp.setHeader("Cache-Control", "no-store");       // một header thật, có ích
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("look at the headers above");
}
case "/redirect" -&gt; resp.sendRedirect("welcome");     // 302 + Location, không có body để đọc</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phan-hoi/r/header HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 202
X-Course: PRJ301
Cache-Control: no-store
Content-Type: text/plain;charset=UTF-8
Content-Length: 26

look at the headers above</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phan-hoi/r/redirect HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: welcome
Content-Length: 0</code></pre>
<p class="nhan">"Header trước tài liệu" — bằng chứng thật</p>
<p class="ghi-chu">📄 <code>phan-hoi/src/main/java/demo/ResponseServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "/qua-muon" -&gt; {
    resp.setContentType("text/plain;charset=UTF-8");
    PrintWriter out = resp.getWriter();
    out.println("body first...");
    out.flush();                                        // response đã COMMIT: header đã gửi đi
    resp.setHeader("X-Too-Late", "yes");               // bị bỏ qua, không báo lỗi
    resp.setStatus(500);                                // cũng bị bỏ qua
    out.println("isCommitted() = " + resp.isCommitted());
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phan-hoi/r/qua-muon HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Transfer-Encoding: chunked

body first...
isCommitted() = true</code></pre>
<div class="pitfall">Sau <code>flush()</code> header đã lên đường: <code>setStatus(500)</code> và <code>X-Too-Late</code> bị <strong>lờ đi trong im lặng</strong> — mã vẫn là 200. Để ý cả <code>Transfer-Encoding: chunked</code> thay cho <code>Content-Length</code>: Tomcat không còn biết trước độ dài cuối cùng. Bài học: quyết định mã trạng thái, header, cookie, chuyển hướng <em>trước</em>, viết body <em>sau cùng</em>.</div>`],
      [25, 'HTML Form',
        `<p class="y-chinh">🎯 A form is an area of a page that contains form elements — text fields, text areas, drop-down menus, radio buttons, checkboxes… — that let the user enter information to send to the server.</p>
<table>
<thead><tr><th>Element</th><th>HTML</th><th>Sends</th></tr></thead>
<tbody>
<tr><td>text field</td><td><code>&lt;input type="text" name="q"&gt;</code></td><td><code>q=what was typed</code></td></tr>
<tr><td>password</td><td><code>&lt;input type="password" name="pass"&gt;</code></td><td>the text — only hidden on screen</td></tr>
<tr><td>text area</td><td><code>&lt;textarea name="note"&gt;&lt;/textarea&gt;</code></td><td>multi-line text</td></tr>
<tr><td>drop-down</td><td><code>&lt;select name="major"&gt;&lt;option value="SE"&gt;…&lt;/option&gt;&lt;/select&gt;</code></td><td>the chosen option's value</td></tr>
<tr><td>radio buttons</td><td><code>&lt;input type="radio" name="sex" value="male"&gt;</code></td><td>one value from the group</td></tr>
<tr><td>checkbox</td><td><code>&lt;input type="checkbox" name="skill" value="java"&gt;</code></td><td>every checked value (same name, many values)</td></tr>
<tr><td>hidden</td><td><code>&lt;input type="hidden" name="id" value="7"&gt;</code></td><td>a value the user does not see (but can change!)</td></tr>
<tr><td>submit button</td><td><code>&lt;input type="submit" value="Login"&gt;</code></td><td>sends the form</td></tr>
</tbody>
</table>
<p>The rule that makes all of it work: <strong>only elements with a <code>name</code> are sent</strong>, as <code>name=value</code> pairs. The <code>name</code> is the exact string your servlet passes to <code>getParameter</code>.</p>
<div class="pitfall">An <code>&lt;input&gt;</code> with <code>id="user"</code> but no <code>name</code> is never sent, and <code>getParameter("user")</code> returns <code>null</code> — the classic PE NullPointerException. <code>id</code> is for CSS/JavaScript, <code>name</code> is for the server.</div>`,
        `<p class="y-chinh">🎯 Form (biểu mẫu) là một vùng của trang chứa các phần tử form — ô nhập chữ, vùng nhập nhiều dòng, danh sách thả xuống, nút radio, ô đánh dấu… — để người dùng nhập thông tin gửi lên server.</p>
<table>
<thead><tr><th>Phần tử</th><th>HTML</th><th>Gửi đi</th></tr></thead>
<tbody>
<tr><td>ô chữ (text field)</td><td><code>&lt;input type="text" name="q"&gt;</code></td><td><code>q=chữ đã gõ</code></td></tr>
<tr><td>mật khẩu</td><td><code>&lt;input type="password" name="pass"&gt;</code></td><td>chính chữ đó — chỉ được che trên màn hình</td></tr>
<tr><td>vùng chữ (text area)</td><td><code>&lt;textarea name="note"&gt;&lt;/textarea&gt;</code></td><td>chữ nhiều dòng</td></tr>
<tr><td>thả xuống (drop-down)</td><td><code>&lt;select name="major"&gt;&lt;option value="SE"&gt;…&lt;/option&gt;&lt;/select&gt;</code></td><td>value của mục được chọn</td></tr>
<tr><td>nút radio</td><td><code>&lt;input type="radio" name="sex" value="male"&gt;</code></td><td>một value trong nhóm</td></tr>
<tr><td>ô đánh dấu (checkbox)</td><td><code>&lt;input type="checkbox" name="skill" value="java"&gt;</code></td><td>mọi value được đánh dấu (cùng name, nhiều value)</td></tr>
<tr><td>ẩn (hidden)</td><td><code>&lt;input type="hidden" name="id" value="7"&gt;</code></td><td>giá trị người dùng không thấy (nhưng sửa được!)</td></tr>
<tr><td>nút gửi (submit)</td><td><code>&lt;input type="submit" value="Login"&gt;</code></td><td>gửi form đi</td></tr>
</tbody>
</table>
<p>Luật làm mọi thứ chạy được: <strong>chỉ phần tử có <code>name</code> mới được gửi</strong>, dưới dạng cặp <code>name=value</code>. <code>name</code> chính là chuỗi servlet của bạn đưa vào <code>getParameter</code>.</p>
<div class="pitfall">Một <code>&lt;input&gt;</code> có <code>id="user"</code> mà không có <code>name</code> thì không bao giờ được gửi, và <code>getParameter("user")</code> trả <code>null</code> — lỗi NullPointerException kinh điển trong bài PE. <code>id</code> dành cho CSS/JavaScript, <code>name</code> dành cho server.</div>`],
      [26, 'HTML Form Inputs',
        `<p class="y-chinh">🎯 Text fields: <code>&lt;input type="text" name="firstname" /&gt;</code> and <code>name="lastname"</code> inside a <code>&lt;form&gt;</code>; the browser draws two boxes labelled First name / Last name.</p>
<p class="ghi-chu">📄 <code>form-dang-nhap/src/main/webapp/text.html</code></p>
<pre class="web-src"><code class="language-html">&lt;html&gt;
&lt;body&gt;
    &lt;form&gt;
        First name: &lt;input type="text" name="firstname" /&gt;
        &lt;br /&gt;
        Last name: &lt;input type="text" name="lastname" /&gt;
    &lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>The slide's form has <strong>no action and no method</strong>, so the defaults apply: <code>method="get"</code> and "send to the same URL". There is no submit button either, but pressing Enter in a text field submits it anyway. This is the real request the browser makes — the data travels <strong>in the URL</strong> as a query string:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /form-dang-nhap/text.html?firstname=An&amp;lastname=Nguyen HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"184-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 184

&lt;html&gt;
&lt;body&gt;
    &lt;form&gt;
        First name: &lt;input type="text" name="firstname" /&gt;
        &lt;br /&gt;
        Last name: &lt;input type="text" name="lastname" /&gt;
    &lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>The response is just <code>text.html</code> again: a static file ignores the query string. To <em>use</em> the data you need a servlet in <code>action</code> (slide 28).</p>
<div class="pitfall">The slide closes the page with <code>&lt;html&gt;</code> instead of <code>&lt;/html&gt;</code> (on slides 26, 27 and 29). Browsers forgive it; a checker or a JSP compiler expecting well-formed XML does not.</div>`,
        `<p class="y-chinh">🎯 Ô chữ: <code>&lt;input type="text" name="firstname" /&gt;</code> và <code>name="lastname"</code> bên trong một <code>&lt;form&gt;</code>; trình duyệt vẽ hai ô có nhãn First name / Last name.</p>
<p class="ghi-chu">📄 <code>form-dang-nhap/src/main/webapp/text.html</code></p>
<pre class="web-src"><code class="language-html">&lt;html&gt;
&lt;body&gt;
    &lt;form&gt;
        First name: &lt;input type="text" name="firstname" /&gt;
        &lt;br /&gt;
        Last name: &lt;input type="text" name="lastname" /&gt;
    &lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Form trên slide <strong>không có action và không có method</strong>, nên giá trị mặc định được dùng: <code>method="get"</code> và "gửi tới chính URL hiện tại". Cũng không có nút submit, nhưng nhấn Enter trong một ô chữ vẫn gửi form. Đây là request thật trình duyệt tạo ra — dữ liệu đi <strong>trên URL</strong> dưới dạng query string (chuỗi truy vấn):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /form-dang-nhap/text.html?firstname=An&amp;lastname=Nguyen HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"184-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 184

&lt;html&gt;
&lt;body&gt;
    &lt;form&gt;
        First name: &lt;input type="text" name="firstname" /&gt;
        &lt;br /&gt;
        Last name: &lt;input type="text" name="lastname" /&gt;
    &lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Response chỉ là lại <code>text.html</code>: file tĩnh không đọc query string. Muốn <em>dùng</em> dữ liệu, cần một servlet trong <code>action</code> (slide 28).</p>
<div class="pitfall">Slide đóng trang bằng <code>&lt;html&gt;</code> thay vì <code>&lt;/html&gt;</code> (ở slide 26, 27 và 29). Trình duyệt tha thứ; một bộ kiểm tra hay trình biên dịch JSP đòi XML chuẩn thì không.</div>`],
      [27, 'HTML Form Inputs..',
        `<p class="y-chinh">🎯 Radio buttons: several <code>&lt;input type="radio"&gt;</code> with the <strong>same name</strong> (<code>sex</code>) form one group — the user can pick only one — and each carries its own <code>value</code> (<code>male</code>, <code>female</code>).</p>
<p class="ghi-chu">📄 <code>form-dang-nhap/src/main/webapp/radio.html</code></p>
<pre class="web-src"><code class="language-html">&lt;html&gt;
&lt;body&gt;
    &lt;form&gt;
        &lt;input type="radio" name="sex" value="male" /&gt; Male
        &lt;br /&gt;
        &lt;input type="radio" name="sex" value="female" /&gt; Female
    &lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /form-dang-nhap/radio.html?sex=female HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"192-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 192

&lt;html&gt;
&lt;body&gt;
    &lt;form&gt;
        &lt;input type="radio" name="sex" value="male" /&gt; Male
        &lt;br /&gt;
        &lt;input type="radio" name="sex" value="female" /&gt; Female
    &lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>What is sent is the <code>value</code>, not the label next to the button: the user sees "Female", the server receives <code>sex=female</code>. If nothing is checked, <code>sex</code> is not sent at all and <code>getParameter("sex")</code> is <code>null</code>; add <code>checked</code> to one button to guarantee a value.</p>
<table>
<thead><tr><th></th><th>radio</th><th>checkbox</th></tr></thead>
<tbody>
<tr><td>Same name means</td><td>one group, choose one</td><td>a list, choose any</td></tr>
<tr><td>Read with</td><td><code>getParameter("sex")</code> → one String</td><td><code>getParameterValues("skill")</code> → String[] (or null)</td></tr>
</tbody>
</table>
<div class="pitfall">Different names (<code>name="male"</code>, <code>name="female"</code>) make two independent buttons that can both be on — and can never be turned off again. Same name = one group.</div>`,
        `<p class="y-chinh">🎯 Nút radio: nhiều <code>&lt;input type="radio"&gt;</code> có <strong>cùng name</strong> (<code>sex</code>) tạo thành một nhóm — người dùng chỉ chọn được một — và mỗi nút mang <code>value</code> riêng (<code>male</code>, <code>female</code>).</p>
<p class="ghi-chu">📄 <code>form-dang-nhap/src/main/webapp/radio.html</code></p>
<pre class="web-src"><code class="language-html">&lt;html&gt;
&lt;body&gt;
    &lt;form&gt;
        &lt;input type="radio" name="sex" value="male" /&gt; Male
        &lt;br /&gt;
        &lt;input type="radio" name="sex" value="female" /&gt; Female
    &lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /form-dang-nhap/radio.html?sex=female HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"192-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 192

&lt;html&gt;
&lt;body&gt;
    &lt;form&gt;
        &lt;input type="radio" name="sex" value="male" /&gt; Male
        &lt;br /&gt;
        &lt;input type="radio" name="sex" value="female" /&gt; Female
    &lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Thứ được gửi là <code>value</code>, không phải nhãn đứng cạnh nút: người dùng thấy "Female", server nhận <code>sex=female</code>. Nếu chưa chọn gì, <code>sex</code> hoàn toàn không được gửi và <code>getParameter("sex")</code> là <code>null</code>; thêm <code>checked</code> vào một nút để chắc chắn luôn có giá trị.</p>
<table>
<thead><tr><th></th><th>radio</th><th>checkbox</th></tr></thead>
<tbody>
<tr><td>Cùng name nghĩa là</td><td>một nhóm, chọn một</td><td>một danh sách, chọn bao nhiêu cũng được</td></tr>
<tr><td>Đọc bằng</td><td><code>getParameter("sex")</code> → một String</td><td><code>getParameterValues("skill")</code> → String[] (hoặc null)</td></tr>
</tbody>
</table>
<div class="pitfall">Khác name (<code>name="male"</code>, <code>name="female"</code>) thì thành hai nút độc lập, bật được cả hai — và không tắt lại được nữa. Cùng name = một nhóm.</div>`],
      [28, "The Form's Action Attribute and the Submit Button",
        `<p class="y-chinh">🎯 Clicking <strong>Submit</strong> sends the form's content to the server; the form's <code>action</code> attribute names where to send it (a servlet or JSP that does something with the input).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/fe3a663c817ab60d0835352e7a9e6fb4559a038b.svg" alt="A form round trip: get the page, fill it, POST it to the action, the servlet reads the parameters" loading="lazy" /><p class="chu-thich">🧩 A form round trip: get the page, fill it, POST it to the action, the servlet reads the parameters</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title A form round trip (slides 28–31)
actor User
participant "Browser" as B
participant "Tomcat" as T
participant "LoginServlet" as S
B -&gt; T : GET /form-dang-nhap/login.html
T --&gt; B : 200 + the form (static HTML)
User -&gt; B : type user / pass, click Login
B -&gt; B : action="LoginServlet" is relative\\n→ /form-dang-nhap/LoginServlet
B -&gt; T : POST /form-dang-nhap/LoginServlet\\nbody: user=user&amp;pass=12345678
T -&gt; S : doPost(request, response)
S -&gt; S : request.getParameter("user")\\nrequest.getParameter("pass")
S --&gt; T : HTML "You sent me: ..."
T --&gt; B : 200 + HTML
@enduml</code></pre></details>
<table>
<thead><tr><th>Attribute</th><th>Values</th><th>Effect</th></tr></thead>
<tbody>
<tr><td><code>action</code></td><td>a URL, usually relative (<code>LoginServlet</code>)</td><td>where the data goes; empty = the current URL</td></tr>
<tr><td><code>method</code></td><td><code>get</code> (default) / <code>post</code></td><td>GET: data in the URL query string · POST: data in the request body</td></tr>
<tr><td><code>enctype</code></td><td>default <code>application/x-www-form-urlencoded</code>; <code>multipart/form-data</code> for file upload</td><td>how the data is encoded</td></tr>
</tbody>
</table>
<p><strong>GET or POST?</strong> GET for searching and filtering (the URL can be bookmarked and shared: <code>?q=java&amp;page=2</code>); POST for anything that changes data or carries a password (not in the URL, history or server logs).</p>
<div class="pitfall">POST is not encryption. The password is plain text inside the body — anyone on the same Wi-Fi can read it unless the site uses <strong>HTTPS</strong>. "POST is secure, GET is not" is only true about <em>visibility in the URL</em>.</div>`,
        `<p class="y-chinh">🎯 Bấm <strong>Submit</strong> sẽ gửi nội dung form lên server; thuộc tính <code>action</code> của form cho biết gửi tới đâu (một servlet hay JSP xử lý dữ liệu nhập).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/fe3a663c817ab60d0835352e7a9e6fb4559a038b.svg" alt="Một vòng gửi form: lấy trang, điền, POST tới action, servlet đọc tham số" loading="lazy" /><p class="chu-thich">🧩 Một vòng gửi form: lấy trang, điền, POST tới action, servlet đọc tham số</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title A form round trip (slides 28–31)
actor User
participant "Browser" as B
participant "Tomcat" as T
participant "LoginServlet" as S
B -&gt; T : GET /form-dang-nhap/login.html
T --&gt; B : 200 + the form (static HTML)
User -&gt; B : type user / pass, click Login
B -&gt; B : action="LoginServlet" is relative\\n→ /form-dang-nhap/LoginServlet
B -&gt; T : POST /form-dang-nhap/LoginServlet\\nbody: user=user&amp;pass=12345678
T -&gt; S : doPost(request, response)
S -&gt; S : request.getParameter("user")\\nrequest.getParameter("pass")
S --&gt; T : HTML "You sent me: ..."
T --&gt; B : 200 + HTML
@enduml</code></pre></details>
<table>
<thead><tr><th>Thuộc tính</th><th>Giá trị</th><th>Tác dụng</th></tr></thead>
<tbody>
<tr><td><code>action</code></td><td>một URL, thường là tương đối (<code>LoginServlet</code>)</td><td>dữ liệu đi tới đâu; để trống = URL hiện tại</td></tr>
<tr><td><code>method</code></td><td><code>get</code> (mặc định) / <code>post</code></td><td>GET: dữ liệu nằm trên query string của URL · POST: dữ liệu nằm trong body của request</td></tr>
<tr><td><code>enctype</code></td><td>mặc định <code>application/x-www-form-urlencoded</code>; <code>multipart/form-data</code> khi tải file lên</td><td>dữ liệu được mã hoá thế nào</td></tr>
</tbody>
</table>
<p><strong>GET hay POST?</strong> GET cho tìm kiếm và lọc (URL lưu bookmark và chia sẻ được: <code>?q=java&amp;page=2</code>); POST cho mọi thứ làm thay đổi dữ liệu hoặc mang mật khẩu (không nằm trên URL, lịch sử duyệt web hay log của server).</p>
<div class="pitfall">POST không phải là mã hoá. Mật khẩu nằm nguyên văn trong body — ai cùng mạng Wi-Fi cũng đọc được, trừ khi site dùng <strong>HTTPS</strong>. "POST an toàn, GET thì không" chỉ đúng về chuyện <em>có hiện trên URL hay không</em>.</div>`],
      [29, "The Form's Action Attribute and the Submit Button…",
        `<p class="y-chinh">🎯 A login form: <code>action="/LoginServlet"</code>, <code>method="post"</code>, a text field <code>user</code>, a password field <code>pass</code> and a submit button <code>Login</code>, laid out with a table.</p>
<pre><code class="language-html">&lt;form name="input" action="/LoginServlet" method="post"&gt;   &lt;!-- the slide's line --&gt;</code></pre>
<p>That leading slash is a bug. In a URL, <code>/LoginServlet</code> means "from the <strong>server root</strong>", which skips the context path of your application. Here is what really happens when the browser submits it:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /LoginServlet HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

user=user&amp;pass=12345678</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 683

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p>Fix: a relative action <code>action="LoginServlet"</code> (resolved against the page's folder, i.e. <code>/form-dang-nhap/LoginServlet</code>), or in JSP <code>action="&#36;{pageContext.request.contextPath}/LoginServlet"</code>. The corrected form running in this lesson:</p>
<p class="ghi-chu">📄 <code>form-dang-nhap/src/main/webapp/login.html</code></p>
<pre class="web-src"><code class="language-html">&lt;html&gt;
&lt;body&gt;
&lt;form name="input" action="LoginServlet" method="post"&gt;
    &lt;table&gt;
        &lt;tr&gt;
            &lt;td&gt;User name:&lt;/td&gt;&lt;td&gt;&lt;input type="text" name="user"/&gt;&lt;/td&gt;
        &lt;/tr&gt;
        &lt;tr&gt;
            &lt;td&gt;Password:&lt;/td&gt;&lt;td&gt;&lt;input type="password" name="pass"/&gt;&lt;/td&gt;
        &lt;/tr&gt;
        &lt;tr&gt;
            &lt;td&gt;&lt;/td&gt;&lt;td&gt;&lt;input type="submit" value="Login"/&gt;&lt;/td&gt;
        &lt;/tr&gt;
    &lt;/table&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /form-dang-nhap/LoginServlet HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

user=user&amp;pass=12345678</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 67

&lt;html&gt;&lt;body&gt;
&lt;h1&gt;You sent me:&lt;/h1&gt;
user&lt;br&gt;12345678
&lt;/body&gt;&lt;/html&gt;</code></pre>
<div class="pitfall">The slide's version only "works" when the app is deployed as the ROOT application (context path empty) — which is exactly what NetBeans does <em>not</em> do. This 404 is one of the most frequent PE emergencies.</div>`,
        `<p class="y-chinh">🎯 Một form đăng nhập: <code>action="/LoginServlet"</code>, <code>method="post"</code>, một ô chữ <code>user</code>, một ô mật khẩu <code>pass</code> và nút gửi <code>Login</code>, dàn bằng một bảng.</p>
<pre><code class="language-html">&lt;form name="input" action="/LoginServlet" method="post"&gt;   &lt;!-- the slide's line --&gt;</code></pre>
<p>Dấu gạch chéo đứng đầu đó là lỗi. Trong URL, <code>/LoginServlet</code> nghĩa là "tính từ <strong>gốc server</strong>", tức là bỏ qua context path của ứng dụng bạn. Đây là điều thật sự xảy ra khi trình duyệt gửi form:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /LoginServlet HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

user=user&amp;pass=12345678</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 683

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p>Cách sửa: action tương đối <code>action="LoginServlet"</code> (tính từ thư mục của trang, tức <code>/form-dang-nhap/LoginServlet</code>), hoặc trong JSP <code>action="&#36;{pageContext.request.contextPath}/LoginServlet"</code>. Form đã sửa đang chạy trong bài này:</p>
<p class="ghi-chu">📄 <code>form-dang-nhap/src/main/webapp/login.html</code></p>
<pre class="web-src"><code class="language-html">&lt;html&gt;
&lt;body&gt;
&lt;form name="input" action="LoginServlet" method="post"&gt;
    &lt;table&gt;
        &lt;tr&gt;
            &lt;td&gt;User name:&lt;/td&gt;&lt;td&gt;&lt;input type="text" name="user"/&gt;&lt;/td&gt;
        &lt;/tr&gt;
        &lt;tr&gt;
            &lt;td&gt;Password:&lt;/td&gt;&lt;td&gt;&lt;input type="password" name="pass"/&gt;&lt;/td&gt;
        &lt;/tr&gt;
        &lt;tr&gt;
            &lt;td&gt;&lt;/td&gt;&lt;td&gt;&lt;input type="submit" value="Login"/&gt;&lt;/td&gt;
        &lt;/tr&gt;
    &lt;/table&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /form-dang-nhap/LoginServlet HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

user=user&amp;pass=12345678</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 67

&lt;html&gt;&lt;body&gt;
&lt;h1&gt;You sent me:&lt;/h1&gt;
user&lt;br&gt;12345678
&lt;/body&gt;&lt;/html&gt;</code></pre>
<div class="pitfall">Phiên bản trên slide chỉ "chạy" khi ứng dụng được deploy làm ứng dụng ROOT (context path rỗng) — đúng thứ NetBeans <em>không</em> làm. Cái 404 này là một trong những tình huống cấp cứu hay gặp nhất trong giờ PE.</div>`],
      [30, "The Form's Action Attribute and the Submit Button…",
        `<p class="y-chinh">🎯 The login form as the browser shows it: "User name: user", "Password: ••••••••" (masked) and a Login button.</p>
<p>The dots are cosmetic: <code>type="password"</code> hides the characters <strong>on screen</strong> only. Here is the request the Login button actually sends — eight characters typed, eight characters on the wire, readable by anyone in between unless the site uses HTTPS:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /form-dang-nhap/LoginServlet HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

user=user&amp;pass=12345678</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 67

&lt;html&gt;&lt;body&gt;
&lt;h1&gt;You sent me:&lt;/h1&gt;
user&lt;br&gt;12345678
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p>Things a password field should have in a real app (Assignment): <code>required</code> so an empty form is not sent; <code>autocomplete="current-password"</code> so password managers work; the form served over HTTPS; on the server, the password checked against a <strong>hash</strong> (Chapter 5 shows SQL; Chapter 8 the login filter) — never stored in plain text.</p>
<p class="meo">🧠 Screen masking protects against the person behind you; HTTPS protects against the network; hashing protects against a stolen database. Three different enemies, three different tools.</p>`,
        `<p class="y-chinh">🎯 Form đăng nhập như trình duyệt hiển thị: "User name: user", "Password: ••••••••" (bị che) và nút Login.</p>
<p>Mấy dấu chấm chỉ để trang trí: <code>type="password"</code> chỉ che ký tự <strong>trên màn hình</strong>. Đây là request nút Login thật sự gửi đi — gõ tám ký tự, trên đường truyền có đúng tám ký tự, ai đứng giữa cũng đọc được nếu site không dùng HTTPS:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /form-dang-nhap/LoginServlet HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

user=user&amp;pass=12345678</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 67

&lt;html&gt;&lt;body&gt;
&lt;h1&gt;You sent me:&lt;/h1&gt;
user&lt;br&gt;12345678
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p>Những thứ một ô mật khẩu nên có trong ứng dụng thật (Assignment): <code>required</code> để form trống không bị gửi; <code>autocomplete="current-password"</code> để trình quản lý mật khẩu hoạt động; form phục vụ qua HTTPS; phía server, mật khẩu được so với bản <strong>băm (hash)</strong> (Chương 5 có SQL; Chương 8 có filter đăng nhập) — không bao giờ lưu dạng chữ thường.</p>
<p class="meo">🧠 Che màn hình chống người đứng sau lưng; HTTPS chống kẻ trên đường mạng; băm mật khẩu chống trường hợp CSDL bị lấy cắp. Ba kẻ thù khác nhau, ba công cụ khác nhau.</p>`],
      [31, 'Form Data',
        `<p class="y-chinh">🎯 Read form data with <code>request.getParameter("name")</code>, passing the input's <code>name</code>; the slide's <code>doPost</code> reads <code>user</code> and <code>pass</code> and prints them back.</p>
<p class="ghi-chu">📄 <code>form-dang-nhap/src/main/webapp/login.html</code></p>
<pre class="web-src"><code class="language-html">&lt;html&gt;
&lt;body&gt;
&lt;form name="input" action="LoginServlet" method="post"&gt;
    &lt;table&gt;
        &lt;tr&gt;
            &lt;td&gt;User name:&lt;/td&gt;&lt;td&gt;&lt;input type="text" name="user"/&gt;&lt;/td&gt;
        &lt;/tr&gt;
        &lt;tr&gt;
            &lt;td&gt;Password:&lt;/td&gt;&lt;td&gt;&lt;input type="password" name="pass"/&gt;&lt;/td&gt;
        &lt;/tr&gt;
        &lt;tr&gt;
            &lt;td&gt;&lt;/td&gt;&lt;td&gt;&lt;input type="submit" value="Login"/&gt;&lt;/td&gt;
        &lt;/tr&gt;
    &lt;/table&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">📄 <code>form-dang-nhap/src/main/java/LoginServlet.java</code></p>
<pre class="web-src"><code class="language-java">// Slide 31, rewritten for Tomcat 10+ (jakarta); the body of doPost is the slide's, line for line
import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //get form data
        String u = request.getParameter("user");
        String p = request.getParameter("pass");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("&lt;html&gt;&lt;body&gt;");
        out.println("&lt;h1&gt;You sent me:&lt;/h1&gt;");
        out.println(u + "&lt;br&gt;" + p);
        out.println("&lt;/body&gt;&lt;/html&gt;");
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /form-dang-nhap/LoginServlet HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

user=user&amp;pass=12345678</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 67

&lt;html&gt;&lt;body&gt;
&lt;h1&gt;You sent me:&lt;/h1&gt;
user&lt;br&gt;12345678
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p>Now the cases the slide does not show — each is a real request against the same servlet:</p>
<p><strong>1. Opening the servlet URL directly (GET)</strong> — the servlet only has <code>doPost</code>, so HttpServlet's inherited <code>doGet</code> answers 405:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /form-dang-nhap/LoginServlet?user=user&amp;pass=12345678 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 405
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 752

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 405 – Method Not Allowed
Type Status Report
Message HTTP method GET is not supported by this URL
Description The method received in the request-line is known by the origin server but not supported by the target resource.
Apache Tomcat/10.1.61</code></pre>
<p><strong>2. Vietnamese input</strong> — the browser percent-encodes UTF-8 bytes (<code>C%C6%B0%E1%BB%9Dng</code>); Tomcat 10 decodes them as UTF-8 because its <code>conf/web.xml</code> sets <code>request-character-encoding</code>. On a server without that setting you must call <code>request.setCharacterEncoding("UTF-8")</code> <em>before</em> the first <code>getParameter</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /form-dang-nhap/LoginServlet HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 53

user=C%C6%B0%E1%BB%9Dng&amp;pass=m%E1%BA%ADt+kh%E1%BA%A9u</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 75

&lt;html&gt;&lt;body&gt;
&lt;h1&gt;You sent me:&lt;/h1&gt;
Cường&lt;br&gt;mật khẩu
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p><strong>3. A malicious "user name"</strong> — the slide prints input straight into HTML, so a script typed into the form becomes part of the page (reflected XSS):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /form-dang-nhap/LoginServlet HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 47

user=%3Cscript%3Ealert(1)%3C%2Fscript%3E&amp;pass=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 81

&lt;html&gt;&lt;body&gt;
&lt;h1&gt;You sent me:&lt;/h1&gt;
&lt;script&gt;alert(1)&lt;/script&gt;&lt;br&gt;x
&lt;/body&gt;&lt;/html&gt;</code></pre>
<div class="pitfall">Three rules from this one slide: (1) <code>getParameter</code> returns <code>null</code> when the field was not sent — check before using it; (2) the value is always a <code>String</code> — convert with <code>Integer.parseInt</code> inside try/catch; (3) never print user input into HTML unescaped — in JSP use <code>&lt;c:out&gt;</code> or <code>fn:escapeXml</code> (Chapter 3).</div>`,
        `<p class="y-chinh">🎯 Đọc dữ liệu form bằng <code>request.getParameter("name")</code>, truyền vào <code>name</code> của ô nhập; <code>doPost</code> trên slide đọc <code>user</code> và <code>pass</code> rồi in chúng ra lại.</p>
<p class="ghi-chu">📄 <code>form-dang-nhap/src/main/webapp/login.html</code></p>
<pre class="web-src"><code class="language-html">&lt;html&gt;
&lt;body&gt;
&lt;form name="input" action="LoginServlet" method="post"&gt;
    &lt;table&gt;
        &lt;tr&gt;
            &lt;td&gt;User name:&lt;/td&gt;&lt;td&gt;&lt;input type="text" name="user"/&gt;&lt;/td&gt;
        &lt;/tr&gt;
        &lt;tr&gt;
            &lt;td&gt;Password:&lt;/td&gt;&lt;td&gt;&lt;input type="password" name="pass"/&gt;&lt;/td&gt;
        &lt;/tr&gt;
        &lt;tr&gt;
            &lt;td&gt;&lt;/td&gt;&lt;td&gt;&lt;input type="submit" value="Login"/&gt;&lt;/td&gt;
        &lt;/tr&gt;
    &lt;/table&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">📄 <code>form-dang-nhap/src/main/java/LoginServlet.java</code></p>
<pre class="web-src"><code class="language-java">// Slide 31, viết lại cho Tomcat 10+ (jakarta); thân doPost giữ nguyên từng dòng của slide
import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //get form data
        String u = request.getParameter("user");
        String p = request.getParameter("pass");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("&lt;html&gt;&lt;body&gt;");
        out.println("&lt;h1&gt;You sent me:&lt;/h1&gt;");
        out.println(u + "&lt;br&gt;" + p);
        out.println("&lt;/body&gt;&lt;/html&gt;");
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /form-dang-nhap/LoginServlet HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

user=user&amp;pass=12345678</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 67

&lt;html&gt;&lt;body&gt;
&lt;h1&gt;You sent me:&lt;/h1&gt;
user&lt;br&gt;12345678
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p>Giờ tới những trường hợp slide không cho thấy — mỗi cái là một request thật tới cùng servlet đó:</p>
<p><strong>1. Mở thẳng URL của servlet (GET)</strong> — servlet chỉ có <code>doPost</code>, nên <code>doGet</code> thừa kế từ HttpServlet trả 405:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /form-dang-nhap/LoginServlet?user=user&amp;pass=12345678 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 405
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 752

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 405 – Method Not Allowed
Type Status Report
Message HTTP method GET is not supported by this URL
Description The method received in the request-line is known by the origin server but not supported by the target resource.
Apache Tomcat/10.1.61</code></pre>
<p><strong>2. Nhập tiếng Việt</strong> — trình duyệt mã hoá phần trăm các byte UTF-8 (<code>C%C6%B0%E1%BB%9Dng</code>); Tomcat 10 giải mã theo UTF-8 vì <code>conf/web.xml</code> của nó đặt <code>request-character-encoding</code>. Trên server không có thiết lập đó, bạn phải gọi <code>request.setCharacterEncoding("UTF-8")</code> <em>trước</em> lần <code>getParameter</code> đầu tiên:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /form-dang-nhap/LoginServlet HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 53

user=C%C6%B0%E1%BB%9Dng&amp;pass=m%E1%BA%ADt+kh%E1%BA%A9u</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 75

&lt;html&gt;&lt;body&gt;
&lt;h1&gt;You sent me:&lt;/h1&gt;
Cường&lt;br&gt;mật khẩu
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p><strong>3. Một "tên người dùng" độc hại</strong> — slide in thẳng dữ liệu nhập vào HTML, nên đoạn script gõ vào form trở thành một phần của trang (reflected XSS — tấn công chèn script phản xạ):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /form-dang-nhap/LoginServlet HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 47

user=%3Cscript%3Ealert(1)%3C%2Fscript%3E&amp;pass=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 81

&lt;html&gt;&lt;body&gt;
&lt;h1&gt;You sent me:&lt;/h1&gt;
&lt;script&gt;alert(1)&lt;/script&gt;&lt;br&gt;x
&lt;/body&gt;&lt;/html&gt;</code></pre>
<div class="pitfall">Ba luật rút ra từ slide này: (1) <code>getParameter</code> trả <code>null</code> khi ô đó không được gửi — kiểm tra trước khi dùng; (2) giá trị luôn là <code>String</code> — đổi kiểu bằng <code>Integer.parseInt</code> trong try/catch; (3) không bao giờ in dữ liệu người dùng vào HTML mà chưa escape — trong JSP dùng <code>&lt;c:out&gt;</code> hoặc <code>fn:escapeXml</code> (Chương 3).</div>`],
    ]),
    bi(`<h2>📌 What to take away from slides 17–31</h2>
<ul>
<li>A servlet = a class extending <code>HttpServlet</code>, overriding <code>doGet</code>/<code>doPost</code>; mapped to a URL by web.xml or <code>@WebServlet</code>; called by Tomcat, never by <code>main</code>.</li>
<li>Life cycle: <code>init</code> once (first request, or deployment with load-on-startup) → <code>service</code> per request, on many threads, one object → <code>destroy</code> once. No per-user data in fields.</li>
<li>HttpServlet routes by method; un-overridden methods give 405, unknown ones 501; HEAD and OPTIONS come free.</li>
<li>Response: status → headers → body. Set Content-Type (with charset) before <code>getWriter()</code>; once committed, headers and status cannot change.</li>
<li>Forms send <code>name=value</code> pairs of named fields; GET puts them in the URL, POST in the body (not encrypted). Relative <code>action</code>, never <code>/Servlet</code>.</li>
<li><code>getParameter</code> → String or null; escape before printing; Vietnamese works on Tomcat 10 thanks to its UTF-8 defaults, but write <code>setCharacterEncoding("UTF-8")</code> anyway for other servers.</li>
</ul>`,
    `<h2>📌 Cần mang theo gì từ slide 17–31</h2>
<ul>
<li>Servlet = một lớp kế thừa <code>HttpServlet</code>, ghi đè <code>doGet</code>/<code>doPost</code>; được ánh xạ tới URL bằng web.xml hoặc <code>@WebServlet</code>; Tomcat gọi nó, không bao giờ qua <code>main</code>.</li>
<li>Vòng đời: <code>init</code> một lần (request đầu tiên, hoặc lúc deploy nếu có load-on-startup) → <code>service</code> mỗi request, trên nhiều luồng, một đối tượng → <code>destroy</code> một lần. Không để dữ liệu riêng từng người trong trường của servlet.</li>
<li>HttpServlet chia việc theo method; method không ghi đè trả 405, method lạ trả 501; HEAD và OPTIONS có sẵn.</li>
<li>Response: mã trạng thái → header → body. Đặt Content-Type (kèm charset) trước <code>getWriter()</code>; đã commit thì không đổi được header và mã trạng thái nữa.</li>
<li>Form gửi các cặp <code>name=value</code> của những ô có name; GET để chúng trên URL, POST để trong body (không được mã hoá). <code>action</code> tương đối, không bao giờ <code>/Servlet</code>.</li>
<li><code>getParameter</code> → String hoặc null; escape trước khi in; tiếng Việt chạy được trên Tomcat 10 nhờ mặc định UTF-8 của nó, nhưng vẫn nên viết <code>setCharacterEncoding("UTF-8")</code> cho các server khác.</li>
</ul>`),
    books([
      ['williams', 'Ch.3 "Writing Your First Servlet" (Creating a Servlet Class, Configuring a Servlet for Deployment) and Ch.4 "Making Your Application Interactive with JSPs" (first section: the form)', 'Ch.3 "Writing Your First Servlet" (Creating a Servlet Class, Configuring a Servlet for Deployment) và Ch.4 "Making Your Application Interactive with JSPs" (phần đầu: form)'],
      ['servletSpec', 'Ch.2 "The Servlet Interface" (2.3 Servlet Life Cycle), Ch.3 "The Request" (3.1 HTTP Protocol Parameters), Ch.5 "The Response" (5.1 Buffering)', 'Ch.2 "The Servlet Interface" (2.3 Servlet Life Cycle), Ch.3 "The Request" (3.1 HTTP Protocol Parameters), Ch.5 "The Response" (5.1 Buffering)'],
      ['mdnHtml', '"Web forms — Your first form", "Sending form data"', '"Web forms — Your first form", "Sending form data"'],
    ]),
  ].join('\n'),
};

/* ───────── 2.B — 📑 Slide by slide · Basic Java web (3/3): web app structure, web.xml, welcome files, WAR (Slot 1–5, slides 32–43) ───────── */
const L_prj1_3 = {
  title: '2.B — 📑 Slide by slide · Basic Java web (3/3): web app structure, web.xml, welcome files, WAR (Slot 1–5, slides 32–43)|||2.B — 📑 Học theo từng slide · Java web cơ bản (3/3): cấu trúc ứng dụng web, web.xml, welcome file, WAR (Slot 1–5, slide 32–43)',
  slug: 'prj301-slide-prj1-3',
  type: 'VIDEO',
  description: 'Giảng slide 32–43 của bộ "Introduction to Basic Java Web Application": ứng dụng web và thin client, cấu trúc thư mục (WEB-INF, classes, lib — WEB-INF được bảo vệ, có 404 thật), deployment descriptor web.xml (cấu trúc tổng thể, phần tử servlet và bội số, init-param, load-on-startup), web.xml mẫu (slide viết namespace J2EE 2.4 và thiếu ngoặc kép — sửa sang Jakarta 6.0), welcome file, WAR khác JAR, Tomcat tự deploy thư mục webapps, demo WAR với danh sách file thật — kèm sơ đồ Tomcat tìm servlet theo URL và luồng đóng gói–deploy.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.B · school deck "Session 1, Introduction to Basic Java Web Application" (Slot 1–5), slides 32–43</span>
<h2>Servlets in depth (part 2) — what a web application looks like on disk, how web.xml configures it, and how a WAR gets deployed</h2>
<p class="lead">You can now write a servlet; this lesson is about <em>where everything goes</em>. Tomcat does not read your IDE project — it reads a strictly defined folder layout (or the same layout zipped as a <strong>WAR</strong>), with one special folder <code>WEB-INF</code> and one configuration file <code>web.xml</code>. Get the layout wrong and you get 404s that no amount of Java debugging will fix. Syllabus CLO1: <em>deploy a web application</em>; session 5: <em>configure servlet for deployment</em>.</p>
<div class="callout">The FirstServlet application of slides 17–23 is reused here: its real <code>web.xml</code>, its welcome page, its protected <code>WEB-INF</code> and the real list of files inside <code>FirstServlet.war</code>. The older web lesson 1.2 "Project structure, web.xml &amp; deployment" is a short summary of the same topic.</div>`,
    `<span class="eyebrow">Chương 2 · Bài 2.B · bộ slide "Session 1, Introduction to Basic Java Web Application" (Slot 1–5), slide 32–43</span>
<h2>Servlet chuyên sâu (phần 2) — ứng dụng web nằm trên đĩa ra sao, web.xml cấu hình nó thế nào, và một file WAR được deploy như thế nào</h2>
<p class="lead">Giờ bạn đã viết được servlet; bài này nói về chuyện <em>cái gì nằm ở đâu</em>. Tomcat không đọc project trong IDE của bạn — nó đọc một bố cục thư mục được quy định chặt chẽ (hoặc chính bố cục đó nén lại thành file <strong>WAR</strong>), có một thư mục đặc biệt <code>WEB-INF</code> và một file cấu hình <code>web.xml</code>. Sai bố cục là ra 404 mà gỡ code Java bao lâu cũng không hết. CLO1 của đề cương: <em>deploy một ứng dụng web</em>; buổi 5: <em>cấu hình servlet để deploy</em>.</p>
<div class="callout">Ứng dụng FirstServlet của slide 17–23 được dùng lại ở đây: <code>web.xml</code> thật của nó, trang chào mừng, thư mục <code>WEB-INF</code> được bảo vệ và danh sách file thật bên trong <code>FirstServlet.war</code>. Bài web cũ 1.2 "Cấu trúc dự án, web.xml &amp; triển khai" là bản tóm tắt ngắn của cùng chủ đề.</div>`),
    walkHead('prj1', 32, 43),
    walk('prj1', [
      [32, 'Web application',
        `<p class="y-chinh">🎯 A web application (webapp) is an application used through a web browser over a network (Internet or intranet); it is written in browser-supported languages (HTML, JavaScript…) plus server languages like Java, and the browser acts as a <strong>thin client</strong>.</p>
<table>
<thead><tr><th></th><th>Desktop app (e.g. your LAB211 console program)</th><th>Web application (PRJ301)</th></tr></thead>
<tbody>
<tr><td>Installed on</td><td>every user's computer</td><td>one server; users only need a browser</td></tr>
<tr><td>Update</td><td>each user reinstalls</td><td>redeploy once, everyone has the new version</td></tr>
<tr><td>Data</td><td>on each machine</td><td>in one database on the server, shared</td></tr>
<tr><td>Client</td><td>"thick": runs all the logic</td><td>"thin": shows pages, sends requests</td></tr>
<tr><td>Many users at once</td><td>separate copies</td><td>one app, many threads, sessions to tell users apart</td></tr>
</tbody>
</table>
<p><strong>Thin client</strong> = the client does little: it displays what the server sends and sends back what the user does. That is why PRJ301 puts the logic (validation, database, permissions) on the server — a user can change anything that runs in their own browser.</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): LabFlow's React front end is a <em>thicker</em> client — it renders pages itself and calls the back end for JSON (REST). The rule above still holds: every permission check and validation also runs in Spring Boot, because a request can be forged without the React app.</div>`,
        `<p class="y-chinh">🎯 Ứng dụng web (webapp) là ứng dụng được dùng qua trình duyệt trên mạng (Internet hoặc intranet — mạng nội bộ); nó được viết bằng các ngôn ngữ trình duyệt hiểu (HTML, JavaScript…) cùng ngôn ngữ phía server như Java, và trình duyệt đóng vai <strong>thin client</strong> (client mỏng).</p>
<table>
<thead><tr><th></th><th>Ứng dụng desktop (vd chương trình console LAB211 của bạn)</th><th>Ứng dụng web (PRJ301)</th></tr></thead>
<tbody>
<tr><td>Cài trên</td><td>máy của từng người dùng</td><td>một server; người dùng chỉ cần trình duyệt</td></tr>
<tr><td>Cập nhật</td><td>từng người cài lại</td><td>deploy lại một lần, ai cũng có bản mới</td></tr>
<tr><td>Dữ liệu</td><td>trên từng máy</td><td>trong một CSDL ở server, dùng chung</td></tr>
<tr><td>Client</td><td>"dày": chạy toàn bộ logic</td><td>"mỏng": hiện trang, gửi request</td></tr>
<tr><td>Nhiều người cùng lúc</td><td>mỗi người một bản</td><td>một ứng dụng, nhiều luồng, dùng session để phân biệt người dùng</td></tr>
</tbody>
</table>
<p><strong>Thin client (client mỏng)</strong> = client làm rất ít: hiển thị thứ server gửi và gửi lại thao tác của người dùng. Vì thế PRJ301 đặt logic (kiểm tra dữ liệu, CSDL, phân quyền) ở server — thứ gì chạy trong trình duyệt của người dùng thì họ sửa được hết.</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): front end React của LabFlow là một client <em>dày hơn</em> — nó tự dựng trang và gọi back end lấy JSON (REST). Luật ở trên vẫn đúng: mọi kiểm tra quyền và kiểm tra dữ liệu cũng chạy ở Spring Boot, vì một request có thể bị giả mà không cần app React.</div>`],
      [33, 'File and Directory Structure',
        `<p class="y-chinh">🎯 "A place for everything and everything in its place": you must know how to lay out a web application containing static content, JSP pages, servlet classes, the deployment descriptor, tag libraries, JAR files and Java class files — and how to protect resource files from HTTP access.</p>
<pre><code class="language-plaintext">FirstServlet/                  ← context root: its name becomes the URL /FirstServlet
├── index.html                 ← static content: reachable as /FirstServlet/index.html
├── css/style.css              ← reachable as /FirstServlet/css/style.css
├── products.jsp               ← JSP pages: reachable by URL (Chapter 3)
└── WEB-INF/                   ← PRIVATE: never served to a browser
    ├── web.xml                ← the deployment descriptor
    ├── classes/               ← your compiled classes (servlets, DAO, model…)
    │   └── FirstServlet.class
    ├── lib/                   ← JAR files: SQL Server driver, JSTL…
    ├── tags/  *.tld           ← tag libraries (Chapter 3)
    └── views/admin.jsp        ← JSPs reachable ONLY through a servlet (MVC, Chapter 6)</code></pre>
<p><strong>How to protect a file from HTTP access: put it under <code>WEB-INF</code>.</strong> Tomcat refuses every direct request into that folder — the real answer:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/WEB-INF/web.xml HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 683

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p>Your servlet can still read those files (a servlet can <code>forward</code> to <code>/WEB-INF/views/admin.jsp</code>), the browser cannot. That is how MVC hides JSP views behind controllers.</p>
<div class="pitfall">FE question type: "Which folder is not accessible directly by a client?" → <code>WEB-INF</code> (and <code>META-INF</code>). Not <code>lib</code>, not <code>classes</code> on their own — they are protected because they are <em>inside</em> WEB-INF.</div>`,
        `<p class="y-chinh">🎯 "Mỗi thứ một chỗ, và mỗi thứ đúng chỗ của nó": bạn phải biết bố trí một ứng dụng web chứa nội dung tĩnh, trang JSP, lớp servlet, deployment descriptor (file mô tả triển khai), thư viện thẻ, file JAR và lớp Java — và biết cách bảo vệ file tài nguyên khỏi bị truy cập qua HTTP.</p>
<pre><code class="language-plaintext">FirstServlet/                  ← context root: tên này thành URL /FirstServlet
├── index.html                 ← nội dung tĩnh: truy cập được ở /FirstServlet/index.html
├── css/style.css              ← truy cập được ở /FirstServlet/css/style.css
├── products.jsp               ← trang JSP: truy cập được bằng URL (Chương 3)
└── WEB-INF/                   ← RIÊNG TƯ: không bao giờ được gửi cho trình duyệt
    ├── web.xml                ← deployment descriptor
    ├── classes/               ← các lớp đã biên dịch (servlet, DAO, model…)
    │   └── FirstServlet.class
    ├── lib/                   ← file JAR: driver SQL Server, JSTL…
    ├── tags/  *.tld           ← thư viện thẻ (Chương 3)
    └── views/admin.jsp        ← JSP CHỈ tới được qua servlet (MVC, Chương 6)</code></pre>
<p><strong>Cách bảo vệ một file khỏi truy cập HTTP: đặt nó trong <code>WEB-INF</code>.</strong> Tomcat từ chối mọi request đi thẳng vào thư mục đó — câu trả lời thật:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/WEB-INF/web.xml HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 683

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p>Servlet của bạn vẫn đọc được các file đó (một servlet có thể <code>forward</code> sang <code>/WEB-INF/views/admin.jsp</code>), trình duyệt thì không. Đó là cách MVC giấu view JSP sau controller.</p>
<div class="pitfall">Dạng câu FE: "Thư mục nào client không truy cập trực tiếp được?" → <code>WEB-INF</code> (và <code>META-INF</code>). Không phải tự thân <code>lib</code> hay <code>classes</code> — chúng được bảo vệ vì nằm <em>bên trong</em> WEB-INF.</div>`],
      [34, 'Special Directories Beneath the Context Root',
        `<p class="y-chinh">🎯 Under the context root: <code>/WEB-INF/classes</code> for loose (unjarred) Java classes — servlets and support classes; <code>/WEB-INF/lib</code> for JAR files — anything from your main servlets to database drivers; <code>/WEB-INF</code> itself holds the crucial <code>web.xml</code>.</p>
<table>
<thead><tr><th>Folder</th><th>Contains</th><th>Class loading</th></tr></thead>
<tbody>
<tr><td><code>WEB-INF/classes</code></td><td><code>.class</code> files in package folders: <code>controller/LoginServlet.class</code></td><td>loaded first</td></tr>
<tr><td><code>WEB-INF/lib</code></td><td><code>.jar</code> files: <code>mssql-jdbc-12.8.1.jre11.jar</code>, JSTL jars</td><td>loaded after classes</td></tr>
<tr><td><code>WEB-INF/web.xml</code></td><td>the deployment descriptor (optional since Servlet 3.0)</td><td>read at deployment</td></tr>
</tbody>
</table>
<p>Your IDE project and the deployed application have <em>different</em> layouts; the build converts one into the other:</p>
<table>
<thead><tr><th>NetBeans "Java with Ant" project</th><th>Maven project (NetBeans / IntelliJ / Spring Boot)</th><th>Deployed application</th></tr></thead>
<tbody>
<tr><td><code>src/java/...</code></td><td><code>src/main/java/...</code></td><td><code>WEB-INF/classes/...</code> (compiled)</td></tr>
<tr><td><code>web/</code></td><td><code>src/main/webapp/</code></td><td>the context root</td></tr>
<tr><td><code>web/WEB-INF/web.xml</code></td><td><code>src/main/webapp/WEB-INF/web.xml</code></td><td><code>WEB-INF/web.xml</code></td></tr>
<tr><td>Libraries node</td><td><code>pom.xml</code> dependencies</td><td><code>WEB-INF/lib/*.jar</code></td></tr>
</tbody>
</table>
<div class="pitfall">"java.lang.ClassNotFoundException: com.microsoft.sqlserver.jdbc.SQLServerDriver" means the driver jar is not in <code>WEB-INF/lib</code> of the <em>deployed</em> app — adding it to your PC's classpath or to a plain Java project does not help. In NetBeans: Libraries → Add JAR; in Maven: a dependency with the default <code>compile</code> scope.</div>`,
        `<p class="y-chinh">🎯 Bên dưới context root: <code>/WEB-INF/classes</code> chứa các lớp Java rời (không đóng jar) — servlet và lớp hỗ trợ; <code>/WEB-INF/lib</code> chứa file JAR — bất cứ thứ gì, từ servlet chính tới driver CSDL; còn <code>/WEB-INF</code> giữ file quan trọng bậc nhất <code>web.xml</code>.</p>
<table>
<thead><tr><th>Thư mục</th><th>Chứa</th><th>Nạp lớp</th></tr></thead>
<tbody>
<tr><td><code>WEB-INF/classes</code></td><td>file <code>.class</code> theo thư mục gói: <code>controller/LoginServlet.class</code></td><td>nạp trước</td></tr>
<tr><td><code>WEB-INF/lib</code></td><td>file <code>.jar</code>: <code>mssql-jdbc-12.8.1.jre11.jar</code>, các jar JSTL</td><td>nạp sau classes</td></tr>
<tr><td><code>WEB-INF/web.xml</code></td><td>deployment descriptor (không bắt buộc từ Servlet 3.0)</td><td>đọc lúc deploy</td></tr>
</tbody>
</table>
<p>Project trong IDE và ứng dụng đã deploy có bố cục <em>khác nhau</em>; bước build chuyển cái này thành cái kia:</p>
<table>
<thead><tr><th>Project NetBeans "Java with Ant"</th><th>Project Maven (NetBeans / IntelliJ / Spring Boot)</th><th>Ứng dụng đã deploy</th></tr></thead>
<tbody>
<tr><td><code>src/java/...</code></td><td><code>src/main/java/...</code></td><td><code>WEB-INF/classes/...</code> (đã biên dịch)</td></tr>
<tr><td><code>web/</code></td><td><code>src/main/webapp/</code></td><td>context root</td></tr>
<tr><td><code>web/WEB-INF/web.xml</code></td><td><code>src/main/webapp/WEB-INF/web.xml</code></td><td><code>WEB-INF/web.xml</code></td></tr>
<tr><td>nút Libraries</td><td>dependency trong <code>pom.xml</code></td><td><code>WEB-INF/lib/*.jar</code></td></tr>
</tbody>
</table>
<div class="pitfall">"java.lang.ClassNotFoundException: com.microsoft.sqlserver.jdbc.SQLServerDriver" nghĩa là jar driver không nằm trong <code>WEB-INF/lib</code> của ứng dụng <em>đã deploy</em> — thêm nó vào classpath máy bạn hay vào một project Java thường không giúp gì. Trong NetBeans: Libraries → Add JAR; trong Maven: một dependency với scope mặc định <code>compile</code>.</div>`],
      [35, 'Deployment Descriptor Elements',
        `<p class="y-chinh">🎯 The deployment descriptor (DD) is an XML file named <code>web.xml</code>: it tells the container how to deploy the application — which servlets exist, which URLs they answer, which page is the welcome page, and more.</p>
<p>"Deployment descriptor" = a file that <em>describes</em> how to <em>deploy</em>: it is read once, when Tomcat installs the app, not on each request. Being XML it must be <strong>well-formed</strong>: one root element <code>&lt;web-app&gt;</code>, every tag closed, attribute values in quotes, case-sensitive names.</p>
<table>
<thead><tr><th>Way to configure</th><th>Since</th><th>Example</th><th>When to use</th></tr></thead>
<tbody>
<tr><td>web.xml</td><td>Servlet 2.2 (1999)</td><td><code>&lt;servlet&gt;</code> + <code>&lt;servlet-mapping&gt;</code></td><td>the slides, PE questions on web.xml, settings that have no annotation (welcome files, error pages, session timeout)</td></tr>
<tr><td>Annotations</td><td>Servlet 3.0 (2009)</td><td><code>@WebServlet("/login")</code></td><td>most servlets today; NetBeans generates them</td></tr>
<tr><td>Both</td><td>—</td><td>web.xml wins on conflicts for the same servlet</td><td>when a lecturer asks for web.xml but you like annotations</td></tr>
</tbody>
</table>
<div class="pitfall">A broken web.xml (one missing <code>&lt;/servlet&gt;</code>) makes the whole application fail to start — <em>every</em> URL of the app answers 404, not just one. Tomcat's log says "Parse error in application web.xml" with a line number: read the log first.</div>`,
        `<p class="y-chinh">🎯 Deployment descriptor (DD — file mô tả triển khai) là một file XML tên <code>web.xml</code>: nó cho container biết cách deploy ứng dụng — có những servlet nào, chúng trả lời URL nào, trang nào là trang chào mừng, và nhiều thứ khác.</p>
<p>"Deployment descriptor" = file <em>mô tả</em> cách <em>triển khai</em>: nó được đọc một lần, khi Tomcat cài ứng dụng, không phải ở mỗi request. Là XML nên nó phải <strong>đúng cú pháp (well-formed)</strong>: một phần tử gốc <code>&lt;web-app&gt;</code>, thẻ nào cũng đóng, giá trị thuộc tính nằm trong ngoặc kép, tên phân biệt hoa thường.</p>
<table>
<thead><tr><th>Cách cấu hình</th><th>Có từ</th><th>Ví dụ</th><th>Dùng khi nào</th></tr></thead>
<tbody>
<tr><td>web.xml</td><td>Servlet 2.2 (1999)</td><td><code>&lt;servlet&gt;</code> + <code>&lt;servlet-mapping&gt;</code></td><td>theo slide, câu PE về web.xml, các thiết lập không có annotation (welcome file, trang lỗi, thời hạn session)</td></tr>
<tr><td>Annotation</td><td>Servlet 3.0 (2009)</td><td><code>@WebServlet("/login")</code></td><td>phần lớn servlet ngày nay; NetBeans tự sinh</td></tr>
<tr><td>Cả hai</td><td>—</td><td>gặp xung đột trên cùng một servlet thì web.xml thắng</td><td>khi giảng viên đòi web.xml mà bạn quen annotation</td></tr>
</tbody>
</table>
<div class="pitfall">Một web.xml hỏng (thiếu một <code>&lt;/servlet&gt;</code>) làm cả ứng dụng không khởi động được — <em>mọi</em> URL của ứng dụng trả 404, không chỉ một. Log của Tomcat ghi "Parse error in application web.xml" kèm số dòng: đọc log trước đã.</div>`],
      [36, 'Overall Structure of the Deployment Descriptor.',
        `<p class="y-chinh">🎯 Inside <code>&lt;web-app&gt;</code>: description, display-name, icon, distributable, context-param, filter, filter-mapping, listener, <strong>servlet, servlet-mapping</strong>, session-config, <strong>mime-mapping, welcome-file-list, error-page</strong>, jsp-config, security-constraint, login-config, security-role.</p>
<table>
<thead><tr><th>Element</th><th>What it configures</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td><code>&lt;context-param&gt;</code></td><td>a name/value for the whole app (<code>getServletContext().getInitParameter</code>)</td><td>2 (old lesson 2.3)</td></tr>
<tr><td><code>&lt;filter&gt;</code>, <code>&lt;filter-mapping&gt;</code></td><td>code run before servlets: login check, encoding</td><td>8</td></tr>
<tr><td><code>&lt;listener&gt;</code></td><td>code run on app/session/request events</td><td>8</td></tr>
<tr><td><code>&lt;servlet&gt;</code>, <code>&lt;servlet-mapping&gt;</code></td><td>servlet class + its URL pattern(s)</td><td>2 (slides 37–38)</td></tr>
<tr><td><code>&lt;session-config&gt;</code></td><td>e.g. <code>&lt;session-timeout&gt;30&lt;/session-timeout&gt;</code> (minutes)</td><td>4</td></tr>
<tr><td><code>&lt;mime-mapping&gt;</code></td><td>file extension → Content-Type</td><td>—</td></tr>
<tr><td><code>&lt;welcome-file-list&gt;</code></td><td>page shown for the bare folder URL</td><td>2 (slide 39)</td></tr>
<tr><td><code>&lt;error-page&gt;</code></td><td>your own page for 404 / 500 / an exception type</td><td>2 (practice)</td></tr>
<tr><td><code>&lt;jsp-config&gt;</code></td><td>JSP settings, taglibs</td><td>3</td></tr>
<tr><td><code>&lt;security-constraint&gt;</code>, <code>&lt;login-config&gt;</code>, <code>&lt;security-role&gt;</code></td><td>container-managed security (rarely used in PRJ301 — Filters are)</td><td>8</td></tr>
</tbody>
</table>
<p>The bold ones on the slide are the ones you will actually write in PRJ301. Since the Servlet 2.4 schema the order of these children is free; still, keeping the order above makes web.xml easy to read.</p>`,
        `<p class="y-chinh">🎯 Bên trong <code>&lt;web-app&gt;</code>: description, display-name, icon, distributable, context-param, filter, filter-mapping, listener, <strong>servlet, servlet-mapping</strong>, session-config, <strong>mime-mapping, welcome-file-list, error-page</strong>, jsp-config, security-constraint, login-config, security-role.</p>
<table>
<thead><tr><th>Phần tử</th><th>Cấu hình gì</th><th>Chương</th></tr></thead>
<tbody>
<tr><td><code>&lt;context-param&gt;</code></td><td>một cặp tên/giá trị cho cả ứng dụng (<code>getServletContext().getInitParameter</code>)</td><td>2 (bài cũ 2.3)</td></tr>
<tr><td><code>&lt;filter&gt;</code>, <code>&lt;filter-mapping&gt;</code></td><td>code chạy trước servlet: kiểm tra đăng nhập, bảng mã</td><td>8</td></tr>
<tr><td><code>&lt;listener&gt;</code></td><td>code chạy khi có sự kiện của ứng dụng/session/request</td><td>8</td></tr>
<tr><td><code>&lt;servlet&gt;</code>, <code>&lt;servlet-mapping&gt;</code></td><td>lớp servlet + (các) url-pattern của nó</td><td>2 (slide 37–38)</td></tr>
<tr><td><code>&lt;session-config&gt;</code></td><td>vd <code>&lt;session-timeout&gt;30&lt;/session-timeout&gt;</code> (phút)</td><td>4</td></tr>
<tr><td><code>&lt;mime-mapping&gt;</code></td><td>đuôi file → Content-Type</td><td>—</td></tr>
<tr><td><code>&lt;welcome-file-list&gt;</code></td><td>trang hiện ra khi gõ URL của thư mục</td><td>2 (slide 39)</td></tr>
<tr><td><code>&lt;error-page&gt;</code></td><td>trang của riêng bạn cho 404 / 500 / một loại exception</td><td>2 (thực hành)</td></tr>
<tr><td><code>&lt;jsp-config&gt;</code></td><td>thiết lập JSP, taglib</td><td>3</td></tr>
<tr><td><code>&lt;security-constraint&gt;</code>, <code>&lt;login-config&gt;</code>, <code>&lt;security-role&gt;</code></td><td>bảo mật do container quản lý (PRJ301 ít dùng — dùng Filter)</td><td>8</td></tr>
</tbody>
</table>
<p>Các phần tử in đậm trên slide là những cái bạn thật sự sẽ viết trong PRJ301. Từ schema Servlet 2.4, thứ tự các phần tử con là tự do; dù vậy, giữ thứ tự như trên giúp web.xml dễ đọc.</p>`],
      [37, 'servlet and Its Important Subelements',
        `<p class="y-chinh">🎯 <code>&lt;servlet&gt;</code> contains: optional descriptive elements (description, display-name, icon), <code>&lt;servlet-name&gt;</code> (always 1), <code>&lt;servlet-class&gt;</code> OR <code>&lt;jsp-file&gt;</code> (always 1), <code>&lt;init-param&gt;</code> (0 or many, each with param-name + param-value), <code>&lt;load-on-startup&gt;</code> (0 or 1), <code>&lt;run-as&gt;</code> (0 or 1), <code>&lt;security-role-ref&gt;</code> (0 or many).</p>
<table>
<thead><tr><th>Sub-element</th><th>How many</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>&lt;servlet-name&gt;</code></td><td>exactly 1</td><td>an internal nickname, used only to link <code>&lt;servlet&gt;</code> with <code>&lt;servlet-mapping&gt;</code></td></tr>
<tr><td><code>&lt;servlet-class&gt;</code> or <code>&lt;jsp-file&gt;</code></td><td>exactly 1</td><td>fully qualified class (<code>demo.EagerServlet</code>) — or a JSP treated as a servlet</td></tr>
<tr><td><code>&lt;init-param&gt;</code></td><td>0..*</td><td>a setting read in <code>init()</code> with <code>getInitParameter("greeting")</code></td></tr>
<tr><td><code>&lt;load-on-startup&gt;</code></td><td>0..1</td><td>create + init at deployment; smaller number = earlier</td></tr>
<tr><td><code>&lt;run-as&gt;</code>, <code>&lt;security-role-ref&gt;</code></td><td>0..1, 0..*</td><td>container security (not used in PRJ301)</td></tr>
</tbody>
</table>
<p>The vong-doi application uses <code>&lt;init-param&gt;</code> and <code>&lt;load-on-startup&gt;</code>:</p>
<p class="ghi-chu">📄 <code>vong-doi/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;EagerServlet&lt;/servlet-name&gt;
        &lt;servlet-class&gt;demo.EagerServlet&lt;/servlet-class&gt;
        &lt;init-param&gt;
            &lt;param-name&gt;greeting&lt;/param-name&gt;
            &lt;param-value&gt;Xin chào PRJ301&lt;/param-value&gt;
        &lt;/init-param&gt;
        &lt;load-on-startup&gt;1&lt;/load-on-startup&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;EagerServlet&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/eager&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
&lt;/web-app&gt;</code></pre>
<p class="ghi-chu">📄 <code>vong-doi/src/main/java/demo/EagerServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void init() throws ServletException {           // the no-arg init(): config is already stored
    greeting = getInitParameter("greeting");            // read &lt;init-param&gt; from web.xml
    System.out.println("EagerServlet.init() — at deployment, greeting = " + greeting);
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /vong-doi/eager HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 59

Xin chào PRJ301 (read once in init, not on every request)</code></pre>
<p>The console of slide 19 showed <code>EagerServlet.init() — at deployment</code> <em>before</em> any request: that is load-on-startup. Use it for servlets whose init is slow (load a config, warm a cache) so the first user does not wait.</p>
<div class="pitfall">FE trap: <code>&lt;init-param&gt;</code> inside <code>&lt;servlet&gt;</code> belongs to ONE servlet (<code>getServletConfig().getInitParameter</code>); <code>&lt;context-param&gt;</code> directly under <code>&lt;web-app&gt;</code> is shared by the whole app (<code>getServletContext().getInitParameter</code>). Asking a servlet for another servlet's init-param returns <code>null</code>.</div>`,
        `<p class="y-chinh">🎯 <code>&lt;servlet&gt;</code> chứa: các phần tử mô tả tuỳ chọn (description, display-name, icon), <code>&lt;servlet-name&gt;</code> (luôn đúng 1), <code>&lt;servlet-class&gt;</code> HOẶC <code>&lt;jsp-file&gt;</code> (luôn đúng 1), <code>&lt;init-param&gt;</code> (0 hoặc nhiều, mỗi cái có param-name + param-value), <code>&lt;load-on-startup&gt;</code> (0 hoặc 1), <code>&lt;run-as&gt;</code> (0 hoặc 1), <code>&lt;security-role-ref&gt;</code> (0 hoặc nhiều).</p>
<table>
<thead><tr><th>Phần tử con</th><th>Bao nhiêu</th><th>Nghĩa</th></tr></thead>
<tbody>
<tr><td><code>&lt;servlet-name&gt;</code></td><td>đúng 1</td><td>biệt danh nội bộ, chỉ dùng để nối <code>&lt;servlet&gt;</code> với <code>&lt;servlet-mapping&gt;</code></td></tr>
<tr><td><code>&lt;servlet-class&gt;</code> hoặc <code>&lt;jsp-file&gt;</code></td><td>đúng 1</td><td>tên lớp đầy đủ kèm gói (<code>demo.EagerServlet</code>) — hoặc một JSP được coi như servlet</td></tr>
<tr><td><code>&lt;init-param&gt;</code></td><td>0..*</td><td>một thiết lập đọc trong <code>init()</code> bằng <code>getInitParameter("greeting")</code></td></tr>
<tr><td><code>&lt;load-on-startup&gt;</code></td><td>0..1</td><td>tạo + init ngay lúc deploy; số càng nhỏ càng sớm</td></tr>
<tr><td><code>&lt;run-as&gt;</code>, <code>&lt;security-role-ref&gt;</code></td><td>0..1, 0..*</td><td>bảo mật của container (PRJ301 không dùng)</td></tr>
</tbody>
</table>
<p>Ứng dụng vong-doi dùng <code>&lt;init-param&gt;</code> và <code>&lt;load-on-startup&gt;</code>:</p>
<p class="ghi-chu">📄 <code>vong-doi/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;EagerServlet&lt;/servlet-name&gt;
        &lt;servlet-class&gt;demo.EagerServlet&lt;/servlet-class&gt;
        &lt;init-param&gt;
            &lt;param-name&gt;greeting&lt;/param-name&gt;
            &lt;param-value&gt;Xin chào PRJ301&lt;/param-value&gt;
        &lt;/init-param&gt;
        &lt;load-on-startup&gt;1&lt;/load-on-startup&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;EagerServlet&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/eager&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
&lt;/web-app&gt;</code></pre>
<p class="ghi-chu">📄 <code>vong-doi/src/main/java/demo/EagerServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void init() throws ServletException {           // init() không tham số: config đã được lưu sẵn
    greeting = getInitParameter("greeting");            // đọc &lt;init-param&gt; trong web.xml
    System.out.println("EagerServlet.init() — at deployment, greeting = " + greeting);
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /vong-doi/eager HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 59

Xin chào PRJ301 (read once in init, not on every request)</code></pre>
<p>Console ở slide 19 đã in <code>EagerServlet.init() — at deployment</code> <em>trước</em> mọi request: đó chính là load-on-startup. Dùng nó cho servlet có init chậm (nạp cấu hình, làm nóng bộ đệm) để người dùng đầu tiên không phải chờ.</p>
<div class="pitfall">Bẫy FE: <code>&lt;init-param&gt;</code> nằm trong <code>&lt;servlet&gt;</code> thuộc về MỘT servlet (<code>getServletConfig().getInitParameter</code>); <code>&lt;context-param&gt;</code> nằm thẳng dưới <code>&lt;web-app&gt;</code> thì cả ứng dụng dùng chung (<code>getServletContext().getInitParameter</code>). Hỏi một servlet init-param của servlet khác sẽ nhận <code>null</code>.</div>`],
      [38, 'Deployment Descriptor simple web.xml',
        `<p class="y-chinh">🎯 A minimal web.xml: the XML declaration, the <code>&lt;web-app&gt;</code> root with its namespace and schema, a display-name, a description, one <code>&lt;servlet&gt;</code> (name FirstServlet, class FirstServlet) and one <code>&lt;servlet-mapping&gt;</code> (name FirstServlet, URL pattern <code>/FirstServlet</code>).</p>
<p>The slide's file is a Servlet <strong>2.4</strong> (J2EE 1.4, 2003) descriptor. Two things must change for Tomcat 10.1, one thing is a typo:</p>
<table>
<thead><tr><th>Slide</th><th>Problem</th><th>This course</th></tr></thead>
<tbody>
<tr><td><code>xmlns="http://java.sun.com/xml/ns/j2ee"</code> … <code>version="2.4"</code></td><td>20-year-old schema (still accepted, but servlet annotations need 3.0+)</td><td><code>xmlns="https://jakarta.ee/xml/ns/jakartaee"</code> … <code>version="6.0"</code></td></tr>
<tr><td><code>xsi:schemaLocation=http://... .xsd</code></td><td>the value has <strong>no quotes</strong> → not well-formed XML, the app does not deploy</td><td><code>xsi:schemaLocation="... ..."</code></td></tr>
<tr><td><code>encoding="ISO-8859-1"</code></td><td>no Vietnamese possible in the file</td><td><code>encoding="UTF-8"</code></td></tr>
</tbody>
</table>
<p>The FirstServlet application's real web.xml — the slide's content with those three fixes, plus the second servlet and the welcome files of slide 39:</p>
<p class="ghi-chu">📄 <code>FirstServlet/src/main/java/FirstServlet.java</code></p>
<pre class="web-src"><code class="language-java">// Slide 17, rewritten for Tomcat 10+: only the package names change (javax → jakarta)
import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class FirstServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter out = response.getWriter();   // the response body, as text
        out.println("&lt;h1&gt;First Servlet&lt;/h1&gt;");
    }
}</code></pre>
<p class="ghi-chu">📄 <code>FirstServlet/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;display-name&gt;Servlet 6.0 Examples&lt;/display-name&gt;
    &lt;description&gt;
        Servlet 6.0 Examples.
    &lt;/description&gt;
    &lt;!-- Define servlets that are included in the example application --&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;FirstServlet&lt;/servlet-name&gt;
        &lt;servlet-class&gt;FirstServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;FirstServlet&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/FirstServlet&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;ShowRequestHeaders&lt;/servlet-name&gt;
        &lt;servlet-class&gt;ShowRequestHeaders&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;ShowRequestHeaders&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/ShowRequestHeaders&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
    &lt;welcome-file-list&gt;
        &lt;welcome-file&gt;index.html&lt;/welcome-file&gt;
        &lt;welcome-file&gt;index.jsp&lt;/welcome-file&gt;
    &lt;/welcome-file-list&gt;
&lt;/web-app&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/FirstServlet HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Length: 23

&lt;h1&gt;First Servlet&lt;/h1&gt;</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/b3ac9a0e444ddb47b86accff6035c792a069e75c.svg" alt="How the URL /FirstServlet/FirstServlet reaches the class FirstServlet" loading="lazy" /><p class="chu-thich">🧩 How the URL /FirstServlet/FirstServlet reaches the class FirstServlet</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title How Tomcat finds the servlet for a URL (slides 37–38)
start
:http://localhost:8080/FirstServlet/FirstServlet;
:host + port → this Tomcat;
:first path segment /FirstServlet\\n→ context root = the app (FirstServlet.war);
:rest of the path /FirstServlet\\n→ look in web.xml &lt;servlet-mapping&gt;\\nand in @WebServlet annotations;
if (a url-pattern matches?) then (yes)
  :&lt;servlet-name&gt; FirstServlet\\n→ &lt;servlet&gt; with the same name\\n→ &lt;servlet-class&gt; FirstServlet;
  :create the object if needed (init),\\nthen service() → doGet();
else (no)
  if (a static file with that path?) then (yes)
    :send the file (default servlet);
  else (no)
    :404 Not Found;
  endif
endif
stop
@enduml</code></pre></details>
<div class="pitfall">The link between <code>&lt;servlet&gt;</code> and <code>&lt;servlet-mapping&gt;</code> is the <strong>servlet-name</strong> text, character for character. "FirstServlet" in one and "firstServlet" in the other ⇒ the app fails to deploy. And <code>&lt;url-pattern&gt;</code> must start with <code>/</code> (or be <code>*.ext</code>).</div>`,
        `<p class="y-chinh">🎯 Một web.xml tối giản: khai báo XML, phần tử gốc <code>&lt;web-app&gt;</code> cùng namespace và schema, một display-name, một description, một <code>&lt;servlet&gt;</code> (tên FirstServlet, lớp FirstServlet) và một <code>&lt;servlet-mapping&gt;</code> (tên FirstServlet, URL pattern <code>/FirstServlet</code>).</p>
<p>File trên slide là descriptor Servlet <strong>2.4</strong> (J2EE 1.4, 2003). Hai chỗ phải đổi cho Tomcat 10.1, một chỗ là lỗi gõ:</p>
<table>
<thead><tr><th>Slide</th><th>Vấn đề</th><th>Trong môn này</th></tr></thead>
<tbody>
<tr><td><code>xmlns="http://java.sun.com/xml/ns/j2ee"</code> … <code>version="2.4"</code></td><td>schema 20 năm tuổi (vẫn được nhận, nhưng annotation servlet cần 3.0+)</td><td><code>xmlns="https://jakarta.ee/xml/ns/jakartaee"</code> … <code>version="6.0"</code></td></tr>
<tr><td><code>xsi:schemaLocation=http://... .xsd</code></td><td>giá trị <strong>không có ngoặc kép</strong> → XML không đúng cú pháp, ứng dụng không deploy được</td><td><code>xsi:schemaLocation="... ..."</code></td></tr>
<tr><td><code>encoding="ISO-8859-1"</code></td><td>không viết được tiếng Việt trong file</td><td><code>encoding="UTF-8"</code></td></tr>
</tbody>
</table>
<p>web.xml thật của ứng dụng FirstServlet — nội dung của slide với ba chỗ sửa đó, thêm servlet thứ hai và welcome file của slide 39:</p>
<p class="ghi-chu">📄 <code>FirstServlet/src/main/java/FirstServlet.java</code></p>
<pre class="web-src"><code class="language-java">// Slide 17, viết lại cho Tomcat 10+: chỉ đổi tên gói (javax → jakarta)
import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class FirstServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter out = response.getWriter();   // thân response, dạng chữ
        out.println("&lt;h1&gt;First Servlet&lt;/h1&gt;");
    }
}</code></pre>
<p class="ghi-chu">📄 <code>FirstServlet/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;display-name&gt;Servlet 6.0 Examples&lt;/display-name&gt;
    &lt;description&gt;
        Servlet 6.0 Examples.
    &lt;/description&gt;
    &lt;!-- Define servlets that are included in the example application --&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;FirstServlet&lt;/servlet-name&gt;
        &lt;servlet-class&gt;FirstServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;FirstServlet&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/FirstServlet&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;ShowRequestHeaders&lt;/servlet-name&gt;
        &lt;servlet-class&gt;ShowRequestHeaders&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;ShowRequestHeaders&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/ShowRequestHeaders&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
    &lt;welcome-file-list&gt;
        &lt;welcome-file&gt;index.html&lt;/welcome-file&gt;
        &lt;welcome-file&gt;index.jsp&lt;/welcome-file&gt;
    &lt;/welcome-file-list&gt;
&lt;/web-app&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/FirstServlet HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Length: 23

&lt;h1&gt;First Servlet&lt;/h1&gt;</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/b3ac9a0e444ddb47b86accff6035c792a069e75c.svg" alt="URL /FirstServlet/FirstServlet đi tới lớp FirstServlet ra sao" loading="lazy" /><p class="chu-thich">🧩 URL /FirstServlet/FirstServlet đi tới lớp FirstServlet ra sao</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title How Tomcat finds the servlet for a URL (slides 37–38)
start
:http://localhost:8080/FirstServlet/FirstServlet;
:host + port → this Tomcat;
:first path segment /FirstServlet\\n→ context root = the app (FirstServlet.war);
:rest of the path /FirstServlet\\n→ look in web.xml &lt;servlet-mapping&gt;\\nand in @WebServlet annotations;
if (a url-pattern matches?) then (yes)
  :&lt;servlet-name&gt; FirstServlet\\n→ &lt;servlet&gt; with the same name\\n→ &lt;servlet-class&gt; FirstServlet;
  :create the object if needed (init),\\nthen service() → doGet();
else (no)
  if (a static file with that path?) then (yes)
    :send the file (default servlet);
  else (no)
    :404 Not Found;
  endif
endif
stop
@enduml</code></pre></details>
<div class="pitfall">Sợi dây nối <code>&lt;servlet&gt;</code> với <code>&lt;servlet-mapping&gt;</code> là chữ trong <strong>servlet-name</strong>, khớp từng ký tự. Một bên "FirstServlet", bên kia "firstServlet" ⇒ ứng dụng không deploy được. Và <code>&lt;url-pattern&gt;</code> phải bắt đầu bằng <code>/</code> (hoặc có dạng <code>*.ext</code>).</div>`],
      [39, 'Welcome Files',
        `<p class="y-chinh">🎯 <code>&lt;welcome-file-list&gt;</code> lists the pages to try, in order, when the URL names a folder instead of a file: <code>index.html</code>, then <code>index.jsp</code>, then <code>mainlibrary/catalog.jsp</code>.</p>
<p class="ghi-chu">📄 <code>FirstServlet/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;display-name&gt;Servlet 6.0 Examples&lt;/display-name&gt;
    &lt;description&gt;
        Servlet 6.0 Examples.
    &lt;/description&gt;
    &lt;!-- Define servlets that are included in the example application --&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;FirstServlet&lt;/servlet-name&gt;
        &lt;servlet-class&gt;FirstServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;FirstServlet&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/FirstServlet&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;ShowRequestHeaders&lt;/servlet-name&gt;
        &lt;servlet-class&gt;ShowRequestHeaders&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;ShowRequestHeaders&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/ShowRequestHeaders&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
    &lt;welcome-file-list&gt;
        &lt;welcome-file&gt;index.html&lt;/welcome-file&gt;
        &lt;welcome-file&gt;index.jsp&lt;/welcome-file&gt;
    &lt;/welcome-file-list&gt;
&lt;/web-app&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"256-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 256

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;FirstServlet demo&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;FirstServlet demo&lt;/h1&gt;
  &lt;p&gt;&lt;a href="FirstServlet"&gt;Run FirstServlet&lt;/a&gt; · &lt;a href="ShowRequestHeaders"&gt;Show my request headers&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>The request was for <code>/FirstServlet/</code> — a folder. Tomcat tried the first welcome file, found <code>index.html</code> and served it (note <code>Last-Modified</code>/<code>ETag</code>, the headers that made slide 21's 304 possible). If <code>index.html</code> did not exist it would try <code>index.jsp</code>, and so on. A path like <code>mainlibrary/catalog.jsp</code> is relative to <em>the requested folder</em>.</p>
<p>Without your own list, Tomcat's global <code>conf/web.xml</code> applies: <code>index.html</code>, <code>index.htm</code>, <code>index.jsp</code>.</p>
<div class="pitfall">A welcome file starts with no slash (<code>index.jsp</code>, not <code>/index.jsp</code>). And the list is about the <em>folder URL</em>: it does not run when the user opens <code>/FirstServlet/FirstServlet</code>.</div>`,
        `<p class="y-chinh">🎯 <code>&lt;welcome-file-list&gt;</code> liệt kê các trang cần thử, theo thứ tự, khi URL chỉ tới một thư mục chứ không phải một file: <code>index.html</code>, rồi <code>index.jsp</code>, rồi <code>mainlibrary/catalog.jsp</code>.</p>
<p class="ghi-chu">📄 <code>FirstServlet/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;display-name&gt;Servlet 6.0 Examples&lt;/display-name&gt;
    &lt;description&gt;
        Servlet 6.0 Examples.
    &lt;/description&gt;
    &lt;!-- Define servlets that are included in the example application --&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;FirstServlet&lt;/servlet-name&gt;
        &lt;servlet-class&gt;FirstServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;FirstServlet&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/FirstServlet&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;ShowRequestHeaders&lt;/servlet-name&gt;
        &lt;servlet-class&gt;ShowRequestHeaders&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;ShowRequestHeaders&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/ShowRequestHeaders&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
    &lt;welcome-file-list&gt;
        &lt;welcome-file&gt;index.html&lt;/welcome-file&gt;
        &lt;welcome-file&gt;index.jsp&lt;/welcome-file&gt;
    &lt;/welcome-file-list&gt;
&lt;/web-app&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"256-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 256

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;FirstServlet demo&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;FirstServlet demo&lt;/h1&gt;
  &lt;p&gt;&lt;a href="FirstServlet"&gt;Run FirstServlet&lt;/a&gt; · &lt;a href="ShowRequestHeaders"&gt;Show my request headers&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Request là tới <code>/FirstServlet/</code> — một thư mục. Tomcat thử welcome file đầu tiên, thấy có <code>index.html</code> và gửi nó (để ý <code>Last-Modified</code>/<code>ETag</code>, chính hai header làm nên cái 304 ở slide 21). Nếu không có <code>index.html</code>, nó sẽ thử <code>index.jsp</code>, cứ thế tiếp. Đường dẫn kiểu <code>mainlibrary/catalog.jsp</code> được tính từ <em>thư mục được yêu cầu</em>.</p>
<p>Nếu bạn không khai danh sách riêng, <code>conf/web.xml</code> dùng chung của Tomcat sẽ áp dụng: <code>index.html</code>, <code>index.htm</code>, <code>index.jsp</code>.</p>
<div class="pitfall">Welcome file không bắt đầu bằng dấu gạch chéo (<code>index.jsp</code>, không phải <code>/index.jsp</code>). Và danh sách này chỉ áp dụng cho <em>URL thư mục</em>: nó không chạy khi người dùng mở <code>/FirstServlet/FirstServlet</code>.</div>`],
      [40, 'Packaging Your Web Application',
        `<p class="y-chinh">🎯 A WAR is not a JAR: both are ZIP files built the same way, but the extension differs (<code>.jar</code> Java ARchive, <code>.war</code> Web Application ARchive) and so does the purpose — a WAR is packaged so a web container can deploy it as easily as possible.</p>
<table>
<thead><tr><th></th><th>JAR</th><th>WAR</th></tr></thead>
<tbody>
<tr><td>Contains</td><td>classes + resources of a library or program</td><td>a whole web application: pages + WEB-INF/classes + WEB-INF/lib + web.xml</td></tr>
<tr><td>Structure</td><td>package folders at the root</td><td>the context-root layout of slide 33</td></tr>
<tr><td>Who uses it</td><td>the JVM (<code>java -jar app.jar</code>), or another project as a library</td><td>a servlet container (Tomcat), which deploys it</td></tr>
<tr><td>Inside the other</td><td>a WAR contains JARs in <code>WEB-INF/lib</code></td><td>a JAR never contains a WAR</td></tr>
</tbody>
</table>
<p>Build one by hand with the JDK's <code>jar</code> tool, from inside the context-root folder:</p>
<pre><code class="language-bash">cd FirstServlet            # the folder that contains index.html and WEB-INF/
jar -cvf ../FirstServlet.war .
jar -tf ../FirstServlet.war   # list what is inside</code></pre>
<p>NetBeans does the same on <strong>Clean and Build</strong> and writes <code>dist/FirstServlet.war</code> (Ant project) or <code>target/FirstServlet-1.0.war</code> (Maven project).</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): Spring Boot turns this around — it builds an executable <strong>JAR</strong> that <em>contains</em> Tomcat, and you run <code>java -jar labflow.jar</code>. Building a WAR for an external Tomcat is still possible (<code>&lt;packaging&gt;war&lt;/packaging&gt;</code>), but rarely used for new projects.</div>`,
        `<p class="y-chinh">🎯 WAR không phải JAR: cả hai đều là file ZIP dựng theo cùng một cách, nhưng khác đuôi (<code>.jar</code> Java ARchive, <code>.war</code> Web Application ARchive — gói ứng dụng web) và khác mục đích — WAR được đóng gói để web container deploy nó dễ nhất có thể.</p>
<table>
<thead><tr><th></th><th>JAR</th><th>WAR</th></tr></thead>
<tbody>
<tr><td>Chứa</td><td>lớp + tài nguyên của một thư viện hay chương trình</td><td>cả một ứng dụng web: trang + WEB-INF/classes + WEB-INF/lib + web.xml</td></tr>
<tr><td>Cấu trúc</td><td>thư mục gói nằm ở gốc</td><td>bố cục context root của slide 33</td></tr>
<tr><td>Ai dùng</td><td>JVM (<code>java -jar app.jar</code>), hoặc project khác dùng làm thư viện</td><td>servlet container (Tomcat), nó deploy file này</td></tr>
<tr><td>Cái nào chứa cái nào</td><td>WAR chứa các JAR trong <code>WEB-INF/lib</code></td><td>JAR không bao giờ chứa WAR</td></tr>
</tbody>
</table>
<p>Tự đóng gói bằng công cụ <code>jar</code> của JDK, chạy từ bên trong thư mục context root:</p>
<pre><code class="language-bash">cd FirstServlet            # the folder that contains index.html and WEB-INF/
jar -cvf ../FirstServlet.war .
jar -tf ../FirstServlet.war   # list what is inside</code></pre>
<p>NetBeans làm y như vậy khi bạn bấm <strong>Clean and Build</strong> và ghi ra <code>dist/FirstServlet.war</code> (project Ant) hoặc <code>target/FirstServlet-1.0.war</code> (project Maven).</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): Spring Boot làm ngược lại — nó dựng một file <strong>JAR</strong> chạy được, <em>bên trong</em> có sẵn Tomcat, và bạn chạy <code>java -jar labflow.jar</code>. Vẫn có thể đóng WAR để chạy trên Tomcat ngoài (<code>&lt;packaging&gt;war&lt;/packaging&gt;</code>), nhưng project mới hiếm khi làm vậy.</div>`],
      [41, 'WAR file',
        `<p class="y-chinh">🎯 Web containers deploy automatically: Tomcat (10 or higher, integrated with NetBeans 13+) has a <strong>webapps</strong> directory; drop a WAR there and Tomcat unpacks it into a folder of the same name, which becomes the <strong>context root</strong>, and the application is available.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/ff038df306e26828791a8eeb3b21e4a2d0f36e31.svg" alt="From Clean and Build to a running context: the deployment flow" loading="lazy" /><p class="chu-thich">🧩 From Clean and Build to a running context: the deployment flow</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title From source to a running app: building and deploying a WAR (slides 40–42)
|You / NetBeans|
start
:Clean and Build;
:javac → WEB-INF/classes/*.class;
:copy web pages + WEB-INF/web.xml + jars;
:zip everything → FirstServlet.war;
|Tomcat|
:FirstServlet.war appears in webapps/\\n(copied by you, NetBeans or a script);
:auto-deploy: unpack to webapps/FirstServlet/;
:read web.xml + scan @WebServlet;
:context /FirstServlet is ready;
|Browser|
:GET http://localhost:8080/FirstServlet/...;
stop
@enduml</code></pre></details>
<table>
<thead><tr><th>You do</th><th>Tomcat does</th><th>URL</th></tr></thead>
<tbody>
<tr><td>copy <code>FirstServlet.war</code> into <code>webapps/</code></td><td>unpacks to <code>webapps/FirstServlet/</code>, starts the context</td><td><code>http://localhost:8080/FirstServlet/</code></td></tr>
<tr><td>copy a newer <code>FirstServlet.war</code></td><td>redeploys (destroy old servlets, init new ones)</td><td>same</td></tr>
<tr><td>delete <code>FirstServlet.war</code></td><td>undeploys and removes the folder (slide 19's destroy)</td><td>404</td></tr>
<tr><td>name the file <code>ROOT.war</code></td><td>deploys at the empty context path</td><td><code>http://localhost:8080/</code></td></tr>
<tr><td>name it <code>shop#v2.war</code></td><td><code>#</code> becomes <code>/</code> in the context path</td><td><code>http://localhost:8080/shop/v2/</code></td></tr>
</tbody>
</table>
<p class="nhan">➕ Beyond the slide — the javax rescue folder</p>
<p>Tomcat 10+ has a second folder, <code>webapps-javaee</code> (the Host's <code>legacyAppBase</code>): a WAR built for Tomcat 9 (javax) dropped there is converted to jakarta by the Apache Tomcat Migration Tool and then deployed into <code>webapps</code>. Handy for an old sample project; for your own code, just fix the imports.</p>
<div class="pitfall">"I changed the code but the browser shows the old version": NetBeans may still be serving the previously deployed WAR, or the browser cached the page. Clean and Build, redeploy, then hard-reload (Ctrl+Shift+R). Check the Tomcat log line "Deployment of web application archive … has finished".</div>`,
        `<p class="y-chinh">🎯 Web container tự động deploy: Tomcat (bản 10 trở lên, tích hợp với NetBeans 13+) có thư mục <strong>webapps</strong>; thả một file WAR vào đó là Tomcat giải nén thành thư mục cùng tên, thư mục này trở thành <strong>context root</strong>, và ứng dụng sẵn sàng.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/ff038df306e26828791a8eeb3b21e4a2d0f36e31.svg" alt="Từ Clean and Build tới một context đang chạy: luồng deploy" loading="lazy" /><p class="chu-thich">🧩 Từ Clean and Build tới một context đang chạy: luồng deploy</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title From source to a running app: building and deploying a WAR (slides 40–42)
|You / NetBeans|
start
:Clean and Build;
:javac → WEB-INF/classes/*.class;
:copy web pages + WEB-INF/web.xml + jars;
:zip everything → FirstServlet.war;
|Tomcat|
:FirstServlet.war appears in webapps/\\n(copied by you, NetBeans or a script);
:auto-deploy: unpack to webapps/FirstServlet/;
:read web.xml + scan @WebServlet;
:context /FirstServlet is ready;
|Browser|
:GET http://localhost:8080/FirstServlet/...;
stop
@enduml</code></pre></details>
<table>
<thead><tr><th>Bạn làm</th><th>Tomcat làm</th><th>URL</th></tr></thead>
<tbody>
<tr><td>chép <code>FirstServlet.war</code> vào <code>webapps/</code></td><td>giải nén thành <code>webapps/FirstServlet/</code>, khởi động context</td><td><code>http://localhost:8080/FirstServlet/</code></td></tr>
<tr><td>chép một <code>FirstServlet.war</code> mới hơn</td><td>deploy lại (destroy servlet cũ, init servlet mới)</td><td>như cũ</td></tr>
<tr><td>xoá <code>FirstServlet.war</code></td><td>gỡ ứng dụng và xoá thư mục (chính là destroy ở slide 19)</td><td>404</td></tr>
<tr><td>đặt tên file <code>ROOT.war</code></td><td>deploy ở context path rỗng</td><td><code>http://localhost:8080/</code></td></tr>
<tr><td>đặt tên <code>shop#v2.war</code></td><td><code>#</code> thành <code>/</code> trong context path</td><td><code>http://localhost:8080/shop/v2/</code></td></tr>
</tbody>
</table>
<p class="nhan">➕ Mở rộng ngoài slide — thư mục cứu hộ cho javax</p>
<p>Tomcat 10+ có thêm thư mục <code>webapps-javaee</code> (thuộc tính <code>legacyAppBase</code> của Host): một file WAR viết cho Tomcat 9 (javax) thả vào đó sẽ được Apache Tomcat Migration Tool chuyển sang jakarta rồi deploy vào <code>webapps</code>. Tiện cho một project mẫu cũ; còn code của chính bạn thì cứ sửa import.</p>
<div class="pitfall">"Em sửa code rồi mà trình duyệt vẫn hiện bản cũ": NetBeans có thể vẫn đang chạy WAR deploy lần trước, hoặc trình duyệt đã cache trang. Clean and Build, deploy lại, rồi tải lại mạnh (Ctrl+Shift+R). Xem dòng log Tomcat "Deployment of web application archive … has finished".</div>`],
      [42, 'War file demo',
        `<p class="y-chinh">🎯 The demo deploys <code>Demo\\WarFile\\FirstServlet.war</code>: the same FirstServlet application, now as one file.</p>
<p>The list below is the real content of the <code>FirstServlet.war</code> that the generator built from this lesson's sources and deployed on Tomcat 10.1 — compare it with slide 33's layout: pages at the root, compiled classes in <code>WEB-INF/classes</code>, the descriptor in <code>WEB-INF</code>, and a <code>META-INF/MANIFEST.MF</code> added by the <code>jar</code> tool:</p>
<p class="ghi-chu">📦 Inside the <code>FirstServlet.war</code> the generator built and deployed (<code>jar tf</code>, sorted)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/FirstServlet.class<br>
WEB-INF/classes/ShowRequestHeaders.class<br>
WEB-INF/web.xml<br>
index.html</div>
<p>After deployment the WAR answers exactly like the exploded folder did:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/FirstServlet HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Length: 23

&lt;h1&gt;First Servlet&lt;/h1&gt;</code></pre>
<p><strong>Do it yourself</strong>: (1) in NetBeans, Clean and Build; (2) stop the NetBeans-managed Tomcat; (3) copy <code>dist/FirstServlet.war</code> into <code>&lt;Tomcat&gt;/webapps</code>; (4) start Tomcat with <code>bin/startup.bat</code> (Windows) or <code>bin/startup.sh</code> (macOS/Linux); (5) open <code>http://localhost:8080/FirstServlet/</code>. This is exactly how a Java web app is deployed on a real server without an IDE.</p>
<div class="pitfall">No <code>.java</code> files in the WAR — only <code>.class</code>. If your instructor asks you to submit "the source", they want the <em>project</em> folder (zipped), not the WAR.</div>`,
        `<p class="y-chinh">🎯 Demo deploy <code>Demo\\WarFile\\FirstServlet.war</code>: vẫn ứng dụng FirstServlet đó, giờ gói trong một file.</p>
<p>Danh sách dưới đây là nội dung thật của <code>FirstServlet.war</code> mà bộ sinh bài đã đóng từ mã nguồn của bài này và deploy lên Tomcat 10.1 — so với bố cục ở slide 33: trang nằm ở gốc, lớp đã biên dịch nằm trong <code>WEB-INF/classes</code>, descriptor nằm trong <code>WEB-INF</code>, và một <code>META-INF/MANIFEST.MF</code> do công cụ <code>jar</code> thêm vào:</p>
<p class="ghi-chu">📦 Bên trong <code>FirstServlet.war</code> mà generator đã đóng và deploy (<code>jar tf</code>, sắp xếp)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/FirstServlet.class<br>
WEB-INF/classes/ShowRequestHeaders.class<br>
WEB-INF/web.xml<br>
index.html</div>
<p>Sau khi deploy, file WAR trả lời y như thư mục giải nén trước đó:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/FirstServlet HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Length: 23

&lt;h1&gt;First Servlet&lt;/h1&gt;</code></pre>
<p><strong>Tự làm</strong>: (1) trong NetBeans, Clean and Build; (2) dừng Tomcat do NetBeans quản lý; (3) chép <code>dist/FirstServlet.war</code> vào <code>&lt;Tomcat&gt;/webapps</code>; (4) khởi động Tomcat bằng <code>bin/startup.bat</code> (Windows) hoặc <code>bin/startup.sh</code> (macOS/Linux); (5) mở <code>http://localhost:8080/FirstServlet/</code>. Đây đúng là cách một ứng dụng Java web được deploy lên server thật mà không cần IDE.</p>
<div class="pitfall">Trong WAR không có file <code>.java</code> — chỉ có <code>.class</code>. Nếu giảng viên bảo nộp "mã nguồn", họ muốn thư mục <em>project</em> (nén lại), không phải file WAR.</div>`],
      [43, 'Summary',
        `<p class="y-chinh">🎯 The deck covered: HTML (what it is, tags, documents = pages, browsers, example); servlets (what they are, how to define and write them, basic structure, request/response headers, handling form data); Tomcat 10+ integrated with NetBeans 13+; web applications (file and directory structure, deployment descriptor elements, WAR files).</p>
<table>
<thead><tr><th>Summary line</th><th>Lesson / slides on this site</th><th>Can you…</th></tr></thead>
<tbody>
<tr><td>HTML, tags, browser</td><td>1.A · 3–7</td><td>write a page with a heading, paragraph, link and a form?</td></tr>
<tr><td>What a servlet is</td><td>1.A · 8–10</td><td>draw browser → container → servlet → DB from memory?</td></tr>
<tr><td>HTTP requests/responses</td><td>1.A · 11–16, 2.A · 21–24</td><td>name the 4 parts of each, the safe/idempotent methods, 401/403/404/405/500/503?</td></tr>
<tr><td>Define and write servlets</td><td>2.A · 17–20</td><td>write a servlet with doGet + doPost and explain init/service/destroy?</td></tr>
<tr><td>Form data</td><td>2.A · 25–31</td><td>read text, radio and checkbox values, handle null, Vietnamese and XSS?</td></tr>
<tr><td>Structure, web.xml, WAR</td><td>2.B · 32–42</td><td>map a servlet in web.xml, set a welcome file, build and deploy a WAR?</td></tr>
</tbody>
</table>
<p>Next: the 🧪 practice of Chapter 2 builds all of this into small exercises with real runs, then the quiz. Chapter 3 replaces <code>out.println("&lt;html&gt;…")</code> with JSP pages.</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): almost every line of this summary has a Spring Boot twin — <code>@GetMapping</code> instead of <code>doGet</code>, <code>@RequestParam</code> instead of <code>getParameter</code>, <code>application.properties</code> instead of most of web.xml, an executable JAR instead of a WAR. Knowing the servlet version is what lets you debug the Spring one.</div>`,
        `<p class="y-chinh">🎯 Deck đã học: HTML (là gì, thẻ, tài liệu = trang, trình duyệt, ví dụ); servlet (là gì, cách định nghĩa và viết, cấu trúc cơ bản, header của request/response, xử lý dữ liệu form); Tomcat 10+ tích hợp với NetBeans 13+; ứng dụng web (cấu trúc file và thư mục, các phần tử của deployment descriptor, file WAR).</p>
<table>
<thead><tr><th>Dòng tóm tắt</th><th>Bài / slide trên web</th><th>Bạn đã làm được…</th></tr></thead>
<tbody>
<tr><td>HTML, thẻ, trình duyệt</td><td>1.A · 3–7</td><td>viết một trang có tiêu đề, đoạn văn, liên kết và form?</td></tr>
<tr><td>Servlet là gì</td><td>1.A · 8–10</td><td>vẽ thuộc lòng trình duyệt → container → servlet → CSDL?</td></tr>
<tr><td>HTTP request/response</td><td>1.A · 11–16, 2.A · 21–24</td><td>kể 4 phần của mỗi cái, các method an toàn/lũy đẳng, 401/403/404/405/500/503?</td></tr>
<tr><td>Định nghĩa và viết servlet</td><td>2.A · 17–20</td><td>viết servlet có doGet + doPost và giải thích init/service/destroy?</td></tr>
<tr><td>Dữ liệu form</td><td>2.A · 25–31</td><td>đọc giá trị ô chữ, radio, checkbox, xử lý null, tiếng Việt và XSS?</td></tr>
<tr><td>Cấu trúc, web.xml, WAR</td><td>2.B · 32–42</td><td>ánh xạ servlet trong web.xml, đặt welcome file, đóng gói và deploy WAR?</td></tr>
</tbody>
</table>
<p>Tiếp theo: phần 🧪 thực hành Chương 2 gom tất cả thành các bài tập nhỏ có chạy thật, rồi tới quiz. Chương 3 thay <code>out.println("&lt;html&gt;…")</code> bằng trang JSP.</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): gần như dòng nào trong bảng tóm tắt cũng có "anh em sinh đôi" bên Spring Boot — <code>@GetMapping</code> thay cho <code>doGet</code>, <code>@RequestParam</code> thay cho <code>getParameter</code>, <code>application.properties</code> thay cho phần lớn web.xml, file JAR chạy được thay cho WAR. Hiểu bản servlet chính là thứ giúp bạn gỡ lỗi bản Spring.</div>`],
    ]),
    books([
      ['williams', 'Ch.3 "Writing Your First Servlet" (Configuring a Servlet for Deployment, the web.xml) and Ch.2 "Using Web Containers" (Tomcat, deploying a WAR)', 'Ch.3 "Writing Your First Servlet" (Configuring a Servlet for Deployment, web.xml) và Ch.2 "Using Web Containers" (Tomcat, deploy một file WAR)'],
      ['servletSpec', 'Ch.10 "Web Applications" (10.5 Directory Structure, 10.6 Web Application Archive File, 10.10 Welcome Files) and Ch.14 "Deployment Descriptor"', 'Ch.10 "Web Applications" (10.5 Directory Structure, 10.6 Web Application Archive File, 10.10 Welcome Files) và Ch.14 "Deployment Descriptor"'],
      ['tomcatDocs', "\"Application Developer's Guide — Deployment\" and \"The Host Container\" (appBase, autoDeploy, legacyAppBase)", "\"Application Developer's Guide — Deployment\" và \"The Host Container\" (appBase, autoDeploy, legacyAppBase)"],
    ]),
  ].join('\n'),
};

/* ───────── 2.4 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Servlets for real: mappings, life cycle, forms, login (PRG), web.xml, WAR ───────── */
const L_on_ch2 = {
  title: '2.4 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Servlets for real: mappings, life cycle, forms, login (PRG), web.xml, WAR|||2.4 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Servlet thật sự: ánh xạ, vòng đời, form, đăng nhập (PRG), web.xml, WAR',
  slug: 'prj301-on-ch2',
  type: 'VIDEO',
  description: '7 bài tập Chương 2 có lời giải chạy thật trên Tomcat 10.1: ba kiểu url-pattern trong web.xml và luật chọn servlet, context-param/init-param/load-on-startup cùng bộ đếm an toàn luồng và log vòng đời thật, đọc header (ngôn ngữ, thiết bị, trang trước), form đăng ký đủ loại ô với kiểm tra ở server, khung đăng nhập của đề PE theo mẫu Post/Redirect/Get dùng session, trang lỗi tự làm bằng error-page, đọc nội dung file WAR; 16 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.4 · Practice &amp; review</span>
<h2>Servlets for real — seven exercises that build the PE skeleton</h2>
<p class="lead">Chapter 2 turned HTTP into Java: <code>doGet</code>/<code>doPost</code>, the life cycle, headers, forms, web.xml and WAR files. These seven exercises use all of it, and the last three together are the skeleton of almost every PE paper: a registration form validated on the server, a login with a session and a redirect, a protected page, and clean error pages. Every solution ran on Tomcat 10.1; the real responses are shown under each.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>1</td><td>url-patterns in web.xml: exact, path prefix, extension</td><td>34–38</td></tr>
<tr><td>2</td><td>init-param, context-param, load-on-startup, thread safety, destroy</td><td>19, 37</td></tr>
<tr><td>3</td><td>reading request headers</td><td>21–23</td></tr>
<tr><td>4</td><td>every kind of form field + server-side validation</td><td>25–31</td></tr>
<tr><td>5</td><td>login with session, Post/Redirect/Get, a protected page</td><td>24, 28–31 (+ Ch.4)</td></tr>
<tr><td>6</td><td>welcome file and custom error pages in web.xml</td><td>36, 39</td></tr>
<tr><td>7</td><td>what is inside the WAR</td><td>40–42</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 2 · Bài 2.4 · Thực hành &amp; ôn tập</span>
<h2>Servlet thật sự — bảy bài tập dựng nên bộ khung của đề PE</h2>
<p class="lead">Chương 2 biến HTTP thành Java: <code>doGet</code>/<code>doPost</code>, vòng đời, header, form, web.xml và file WAR. Bảy bài tập này dùng tất cả, và ba bài cuối gộp lại chính là bộ khung của gần như mọi đề PE: một form đăng ký được kiểm tra ở server, đăng nhập bằng session kèm chuyển hướng, một trang được bảo vệ, và trang lỗi gọn gàng. Lời giải nào cũng đã chạy trên Tomcat 10.1; response thật nằm ngay bên dưới.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>1</td><td>url-pattern trong web.xml: chính xác, tiền tố đường dẫn, đuôi file</td><td>34–38</td></tr>
<tr><td>2</td><td>init-param, context-param, load-on-startup, an toàn luồng, destroy</td><td>19, 37</td></tr>
<tr><td>3</td><td>đọc header của request</td><td>21–23</td></tr>
<tr><td>4</td><td>mọi loại ô form + kiểm tra ở server</td><td>25–31</td></tr>
<tr><td>5</td><td>đăng nhập bằng session, Post/Redirect/Get, trang được bảo vệ</td><td>24, 28–31 (+ Ch.4)</td></tr>
<tr><td>6</td><td>welcome file và trang lỗi tự làm trong web.xml</td><td>36, 39</td></tr>
<tr><td>7</td><td>bên trong file WAR có gì</td><td>40–42</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — Which servlet answers? (~15 min)</h3>
<p>One class <code>WhoServlet</code> is declared three times in web.xml, under three names, with three kinds of <code>&lt;url-pattern&gt;</code>. For each URL, predict which servlet-name answers, and what <code>getServletPath()</code> and <code>getPathInfo()</code> return: <code>/report</code>, <code>/api/rooms/7</code>, <code>/api</code>, <code>/booking/save.do</code>, <code>/api/save.do</code>, <code>/reports</code>.</p>
<p class="ghi-chu">📄 <code>url-pattern/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;Exact&lt;/servlet-name&gt;
        &lt;servlet-class&gt;demo.WhoServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;Exact&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/report&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;

    &lt;servlet&gt;
        &lt;servlet-name&gt;Prefix&lt;/servlet-name&gt;
        &lt;servlet-class&gt;demo.WhoServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;Prefix&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/api/*&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;

    &lt;servlet&gt;
        &lt;servlet-name&gt;Extension&lt;/servlet-name&gt;
        &lt;servlet-class&gt;demo.WhoServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;Extension&lt;/servlet-name&gt;
        &lt;url-pattern&gt;*.do&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
&lt;/web-app&gt;</code></pre>
<p class="ghi-chu">📄 <code>url-pattern/src/main/java/demo/WhoServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// One class, mapped THREE times in web.xml under three servlet-names
public class WhoServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().println("servlet-name = " + getServletName());       // which &lt;servlet&gt; answered
        resp.getWriter().println("servletPath  = " + req.getServletPath());   // the part the pattern matched
        resp.getWriter().println("pathInfo     = " + req.getPathInfo());      // what is left after it
    }
}</code></pre>
<p class="dap-an">✅ Real answers:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /url-pattern/report HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 64

servlet-name = Exact
servletPath  = /report
pathInfo     = null</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /url-pattern/api/rooms/7 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 66

servlet-name = Prefix
servletPath  = /api
pathInfo     = /rooms/7</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /url-pattern/api HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 62

servlet-name = Prefix
servletPath  = /api
pathInfo     = null</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /url-pattern/booking/save.do HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 77

servlet-name = Extension
servletPath  = /booking/save.do
pathInfo     = null</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /url-pattern/api/save.do HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 66

servlet-name = Prefix
servletPath  = /api
pathInfo     = /save.do</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /url-pattern/reports HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 775

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message The requested resource [/url-pattern/reports] is not available
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<table>
<thead><tr><th>Pattern kind</th><th>Example</th><th>Matches</th><th>Priority</th></tr></thead>
<tbody>
<tr><td>exact</td><td><code>/report</code></td><td>only <code>/report</code></td><td>1 (highest)</td></tr>
<tr><td>path prefix</td><td><code>/api/*</code></td><td><code>/api</code>, <code>/api/…</code> anything</td><td>2 (longest prefix wins)</td></tr>
<tr><td>extension</td><td><code>*.do</code></td><td>any path ending in <code>.do</code></td><td>3</td></tr>
<tr><td>default</td><td><code>/</code></td><td>everything else (Tomcat's default servlet serves files)</td><td>4</td></tr>
</tbody>
</table>
<p>Why <code>/api/save.do</code> went to <em>Prefix</em>: the container tries exact, then the longest path prefix, and only then extensions. <code>/reports</code> is not <code>/report</code> — exact means exact → 404. <code>getPathInfo()</code> is what follows the matched prefix (<code>/rooms/7</code>) — the classic way to read an id from the URL before Spring's <code>@PathVariable</code>.</p>
<div class="pitfall">Invalid patterns break deployment: <code>/api/*.do</code> (a prefix and an extension together) and <code>api/*</code> (no leading slash) are both illegal — Tomcat refuses to start the app.</div>`,
    `<h3>🧪 Bài 1 — Servlet nào trả lời? (~15 phút)</h3>
<p>Một lớp <code>WhoServlet</code> được khai ba lần trong web.xml, dưới ba tên, với ba kiểu <code>&lt;url-pattern&gt;</code>. Với từng URL, đoán servlet-name nào trả lời, và <code>getServletPath()</code>, <code>getPathInfo()</code> trả gì: <code>/report</code>, <code>/api/rooms/7</code>, <code>/api</code>, <code>/booking/save.do</code>, <code>/api/save.do</code>, <code>/reports</code>.</p>
<p class="ghi-chu">📄 <code>url-pattern/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;Exact&lt;/servlet-name&gt;
        &lt;servlet-class&gt;demo.WhoServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;Exact&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/report&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;

    &lt;servlet&gt;
        &lt;servlet-name&gt;Prefix&lt;/servlet-name&gt;
        &lt;servlet-class&gt;demo.WhoServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;Prefix&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/api/*&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;

    &lt;servlet&gt;
        &lt;servlet-name&gt;Extension&lt;/servlet-name&gt;
        &lt;servlet-class&gt;demo.WhoServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;Extension&lt;/servlet-name&gt;
        &lt;url-pattern&gt;*.do&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
&lt;/web-app&gt;</code></pre>
<p class="ghi-chu">📄 <code>url-pattern/src/main/java/demo/WhoServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Một lớp, được ánh xạ BA lần trong web.xml với ba servlet-name
public class WhoServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().println("servlet-name = " + getServletName());       // &lt;servlet&gt; nào trả lời
        resp.getWriter().println("servletPath  = " + req.getServletPath());   // phần pattern đã khớp
        resp.getWriter().println("pathInfo     = " + req.getPathInfo());      // phần còn lại sau đó
    }
}</code></pre>
<p class="dap-an">✅ Câu trả lời thật:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /url-pattern/report HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 64

servlet-name = Exact
servletPath  = /report
pathInfo     = null</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /url-pattern/api/rooms/7 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 66

servlet-name = Prefix
servletPath  = /api
pathInfo     = /rooms/7</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /url-pattern/api HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 62

servlet-name = Prefix
servletPath  = /api
pathInfo     = null</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /url-pattern/booking/save.do HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 77

servlet-name = Extension
servletPath  = /booking/save.do
pathInfo     = null</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /url-pattern/api/save.do HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 66

servlet-name = Prefix
servletPath  = /api
pathInfo     = /save.do</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /url-pattern/reports HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 775

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message The requested resource [/url-pattern/reports] is not available
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<table>
<thead><tr><th>Kiểu pattern</th><th>Ví dụ</th><th>Khớp với</th><th>Ưu tiên</th></tr></thead>
<tbody>
<tr><td>chính xác (exact)</td><td><code>/report</code></td><td>chỉ <code>/report</code></td><td>1 (cao nhất)</td></tr>
<tr><td>tiền tố đường dẫn (path prefix)</td><td><code>/api/*</code></td><td><code>/api</code>, <code>/api/…</code> bất kỳ</td><td>2 (tiền tố dài nhất thắng)</td></tr>
<tr><td>đuôi file (extension)</td><td><code>*.do</code></td><td>mọi đường dẫn kết thúc bằng <code>.do</code></td><td>3</td></tr>
<tr><td>mặc định (default)</td><td><code>/</code></td><td>mọi thứ còn lại (default servlet của Tomcat phục vụ file)</td><td>4</td></tr>
</tbody>
</table>
<p>Vì sao <code>/api/save.do</code> rơi vào <em>Prefix</em>: container thử khớp chính xác, rồi tiền tố dài nhất, rồi mới tới đuôi file. <code>/reports</code> không phải <code>/report</code> — chính xác là phải y hệt → 404. <code>getPathInfo()</code> là phần đứng sau tiền tố đã khớp (<code>/rooms/7</code>) — cách kinh điển để đọc id trên URL trước khi có <code>@PathVariable</code> của Spring.</p>
<div class="pitfall">Pattern sai làm hỏng việc deploy: <code>/api/*.do</code> (vừa tiền tố vừa đuôi) và <code>api/*</code> (thiếu gạch chéo đầu) đều không hợp lệ — Tomcat không khởi động ứng dụng.</div>`),
    bi(`<h3>🧪 Exercise 2 — A visit counter with configuration and a clean life cycle (~15 min)</h3>
<p>The site name comes from a <code>&lt;context-param&gt;</code> (shared by the app), the starting value from an <code>&lt;init-param&gt;</code> of this servlet; the servlet is created at deployment; the counter must stay correct when many users click at once; on undeploy, print the final count.</p>
<p class="ghi-chu">📄 <code>dem-truy-cap/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;context-param&gt;
        &lt;param-name&gt;siteName&lt;/param-name&gt;
        &lt;param-value&gt;LabFlow&lt;/param-value&gt;
    &lt;/context-param&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;CounterServlet&lt;/servlet-name&gt;
        &lt;servlet-class&gt;demo.CounterServlet&lt;/servlet-class&gt;
        &lt;init-param&gt;
            &lt;param-name&gt;start&lt;/param-name&gt;
            &lt;param-value&gt;100&lt;/param-value&gt;
        &lt;/init-param&gt;
        &lt;load-on-startup&gt;1&lt;/load-on-startup&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;CounterServlet&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/count&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
&lt;/web-app&gt;</code></pre>
<p class="ghi-chu">📄 <code>dem-truy-cap/src/main/java/demo/CounterServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void init() throws ServletException {
    site = getServletContext().getInitParameter("siteName");        // &lt;context-param&gt;: whole app
    hits.set(Integer.parseInt(getInitParameter("start")));          // &lt;init-param&gt;: this servlet only
    System.out.println("init: site=" + site + ", start=" + hits.get());
}

@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    int n = hits.incrementAndGet();
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println(site + " — visit number " + n);
}

@Override
public void destroy() {
    System.out.println("destroy: final count = " + hits.get() + " (save it somewhere if it matters)");
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /dem-truy-cap/count HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 29

LabFlow — visit number 101</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">init: site=LabFlow, start=100</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /dem-truy-cap/count HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 29

LabFlow — visit number 103</code></pre>
<p class="ghi-chu">🛑 Undeploy the application (delete the WAR) — the Tomcat console prints:</p>
<div class="out log">destroy: final count = 103 (save it somewhere if it matters)</div>
<p class="dap-an">✅ Why: <code>getServletContext().getInitParameter</code> reads <em>context</em> parameters, <code>getInitParameter</code> (from GenericServlet) reads this servlet's <em>init</em> parameters — mixing them returns <code>null</code>. The no-argument <code>init()</code> is the one to override: the container calls <code>init(ServletConfig)</code>, which stores the config and then calls <code>init()</code>. <code>AtomicInteger.incrementAndGet()</code> is one atomic step; a plain <code>hits++</code> on an <code>int</code> field is read–add–write, and two threads can both read 101 and both write 102 (a lost update). The counter lives in memory: <code>destroy()</code> shows the final value, and it is lost on restart — persistent data belongs in the database (Chapter 5).</p>`,
    `<h3>🧪 Bài 2 — Bộ đếm lượt truy cập có cấu hình và vòng đời gọn gàng (~15 phút)</h3>
<p>Tên site lấy từ một <code>&lt;context-param&gt;</code> (cả ứng dụng dùng chung), giá trị khởi đầu lấy từ một <code>&lt;init-param&gt;</code> của servlet này; servlet được tạo ngay lúc deploy; bộ đếm phải đúng khi nhiều người bấm cùng lúc; khi gỡ ứng dụng, in ra số cuối cùng.</p>
<p class="ghi-chu">📄 <code>dem-truy-cap/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;context-param&gt;
        &lt;param-name&gt;siteName&lt;/param-name&gt;
        &lt;param-value&gt;LabFlow&lt;/param-value&gt;
    &lt;/context-param&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;CounterServlet&lt;/servlet-name&gt;
        &lt;servlet-class&gt;demo.CounterServlet&lt;/servlet-class&gt;
        &lt;init-param&gt;
            &lt;param-name&gt;start&lt;/param-name&gt;
            &lt;param-value&gt;100&lt;/param-value&gt;
        &lt;/init-param&gt;
        &lt;load-on-startup&gt;1&lt;/load-on-startup&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;CounterServlet&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/count&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
&lt;/web-app&gt;</code></pre>
<p class="ghi-chu">📄 <code>dem-truy-cap/src/main/java/demo/CounterServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void init() throws ServletException {
    site = getServletContext().getInitParameter("siteName");        // cả ứng dụng
    hits.set(Integer.parseInt(getInitParameter("start")));          // chỉ servlet này
    System.out.println("init: site=" + site + ", start=" + hits.get());
}

@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    int n = hits.incrementAndGet();
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println(site + " — visit number " + n);
}

@Override
public void destroy() {
    System.out.println("destroy: final count = " + hits.get() + " (save it somewhere if it matters)");
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /dem-truy-cap/count HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 29

LabFlow — visit number 101</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">init: site=LabFlow, start=100</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /dem-truy-cap/count HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 29

LabFlow — visit number 103</code></pre>
<p class="ghi-chu">🛑 Gỡ ứng dụng khỏi Tomcat (xoá file WAR) — console của Tomcat in ra:</p>
<div class="out log">destroy: final count = 103 (save it somewhere if it matters)</div>
<p class="dap-an">✅ Vì sao: <code>getServletContext().getInitParameter</code> đọc tham số của <em>context</em>, <code>getInitParameter</code> (của GenericServlet) đọc tham số <em>init</em> của chính servlet này — dùng nhầm là nhận <code>null</code>. Nên ghi đè <code>init()</code> không tham số: container gọi <code>init(ServletConfig)</code>, hàm này cất config rồi gọi <code>init()</code>. <code>AtomicInteger.incrementAndGet()</code> là một bước nguyên tử; còn <code>hits++</code> trên một trường <code>int</code> là đọc–cộng–ghi, hai luồng có thể cùng đọc 101 rồi cùng ghi 102 (mất một lượt cập nhật). Bộ đếm nằm trong bộ nhớ: <code>destroy()</code> cho thấy giá trị cuối, và khởi động lại là mất — dữ liệu cần giữ phải nằm trong CSDL (Chương 5).</p>`),
    bi(`<h3>🧪 Exercise 3 — Adapt the answer to the request headers (~10 min)</h3>
<p>Greet in Vietnamese when the browser prefers Vietnamese, say whether the device is a phone, and say where the user came from. A request with <em>no</em> such headers must not crash.</p>
<p class="ghi-chu">📄 <code>chao-theo-ngon-ngu/src/main/java/demo/HeaderServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Locale;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Exercise 3: adapt the answer to the request headers
@WebServlet("/hello")
public class HeaderServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Locale locale = req.getLocale();                          // from Accept-Language (best match first)
        String ua = req.getHeader("User-Agent");                   // may be null!
        boolean mobile = ua != null &amp;&amp; ua.contains("Mobile");
        String from = req.getHeader("Referer");

        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("vi".equals(locale.getLanguage()) ? "Xin chào!" : "Hello!");
        out.println("locale = " + locale + ", device = " + (mobile ? "mobile" : "desktop"));
        out.println("came from = " + (from == null ? "(typed the address)" : from));
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /chao-theo-ngon-ngu/hello HTTP/1.1
Host: localhost:8080
Accept-Language: vi-VN,vi;q=0.9,en;q=0.8
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile/15E148 Safari/604.1
Referer: https://www.google.com/</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 79

Xin chào!
locale = vi_VN, device = mobile
came from = https://www.google.com/</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /chao-theo-ngon-ngu/hello HTTP/1.1
Host: localhost:8080
Accept-Language: en-GB,en;q=0.9
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 72

Hello!
locale = en_GB, device = desktop
came from = (typed the address)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /chao-theo-ngon-ngu/hello HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 72

Hello!
locale = en_US, device = desktop
came from = (typed the address)</code></pre>
<p class="dap-an">✅ Why: <code>getLocale()</code> parses <code>Accept-Language</code> for you (weights <code>q=</code> included) and falls back to the server's default locale (<code>en_US</code> here) when the header is missing — that is why the third request says "Hello!". <code>getHeader</code> returns <code>null</code> for a missing header, so <code>ua != null &amp;&amp; …</code> must come first, and <code>from == null</code> is handled. Headers are hints written by the client: never use them for security.</p>`,
    `<h3>🧪 Bài 3 — Đổi câu trả lời theo header của request (~10 phút)</h3>
<p>Chào bằng tiếng Việt khi trình duyệt ưu tiên tiếng Việt, cho biết thiết bị có phải điện thoại không, và người dùng đến từ trang nào. Một request <em>không</em> có các header đó không được làm sập servlet.</p>
<p class="ghi-chu">📄 <code>chao-theo-ngon-ngu/src/main/java/demo/HeaderServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Locale;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Bài 3: đổi câu trả lời theo header của request
@WebServlet("/hello")
public class HeaderServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Locale locale = req.getLocale();                          // lấy từ Accept-Language (ưu tiên cao nhất)
        String ua = req.getHeader("User-Agent");                   // có thể null!
        boolean mobile = ua != null &amp;&amp; ua.contains("Mobile");
        String from = req.getHeader("Referer");

        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("vi".equals(locale.getLanguage()) ? "Xin chào!" : "Hello!");
        out.println("locale = " + locale + ", device = " + (mobile ? "mobile" : "desktop"));
        out.println("came from = " + (from == null ? "(typed the address)" : from));
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /chao-theo-ngon-ngu/hello HTTP/1.1
Host: localhost:8080
Accept-Language: vi-VN,vi;q=0.9,en;q=0.8
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile/15E148 Safari/604.1
Referer: https://www.google.com/</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 79

Xin chào!
locale = vi_VN, device = mobile
came from = https://www.google.com/</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /chao-theo-ngon-ngu/hello HTTP/1.1
Host: localhost:8080
Accept-Language: en-GB,en;q=0.9
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 72

Hello!
locale = en_GB, device = desktop
came from = (typed the address)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /chao-theo-ngon-ngu/hello HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 72

Hello!
locale = en_US, device = desktop
came from = (typed the address)</code></pre>
<p class="dap-an">✅ Vì sao: <code>getLocale()</code> tự phân tích <code>Accept-Language</code> giùm bạn (tính cả trọng số <code>q=</code>) và lùi về locale mặc định của server (ở đây là <code>en_US</code>) khi thiếu header — vì thế request thứ ba nói "Hello!". <code>getHeader</code> trả <code>null</code> cho header không có, nên phải kiểm <code>ua != null &amp;&amp; …</code> trước, và xử lý cả trường hợp <code>from == null</code>. Header chỉ là gợi ý do client viết: đừng bao giờ dùng chúng cho bảo mật.</p>`),
    bi(`<h3>🧪 Exercise 4 — A registration form with every kind of field (~20 min)</h3>
<p>Form: full name (text), email, gender (radio), major (select), skills (checkboxes). The servlet must read all of them, validate on the server (name required, email shape, gender chosen, at least one skill) and answer 400 with the list of errors, or a confirmation.</p>
<p class="ghi-chu">📄 <code>dang-ky/src/main/webapp/index.html</code></p>
<pre class="web-src"><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Register&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;form action="register" method="post"&gt;
    Full name: &lt;input type="text" name="fullname"&gt;&lt;br&gt;
    Email: &lt;input type="email" name="email"&gt;&lt;br&gt;
    Gender:
    &lt;input type="radio" name="gender" value="male"&gt; Male
    &lt;input type="radio" name="gender" value="female"&gt; Female&lt;br&gt;
    Major:
    &lt;select name="major"&gt;
        &lt;option value="SE"&gt;Software Engineering&lt;/option&gt;
        &lt;option value="AI"&gt;Artificial Intelligence&lt;/option&gt;
    &lt;/select&gt;&lt;br&gt;
    Skills:
    &lt;input type="checkbox" name="skill" value="Java"&gt; Java
    &lt;input type="checkbox" name="skill" value="SQL"&gt; SQL
    &lt;input type="checkbox" name="skill" value="React"&gt; React&lt;br&gt;
    &lt;button type="submit"&gt;Register&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">📄 <code>dang-ky/src/main/java/demo/RegisterServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    req.setCharacterEncoding("UTF-8");
    String name = trim(req.getParameter("fullname"));           // text
    String email = trim(req.getParameter("email"));
    String gender = req.getParameter("gender");                  // radio: one value or null
    String major = req.getParameter("major");                    // select
    String[] skills = req.getParameterValues("skill");           // checkbox: array or null

    List&lt;String&gt; errors = new ArrayList&lt;&gt;();
    if (name.isEmpty()) errors.add("Full name is required");
    if (!email.matches("[\\\\w.+-]+@[\\\\w-]+(\\\\.[\\\\w-]+)+")) errors.add("Email is not valid");
    if (gender == null) errors.add("Choose a gender");
    if (skills == null) errors.add("Tick at least one skill");

    resp.setContentType("text/plain;charset=UTF-8");
    PrintWriter out = resp.getWriter();
    if (!errors.isEmpty()) {
        resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);         // 400 + the list, so the form can show them
        errors.forEach(e -&gt; out.println("ERROR: " + e));
        return;
    }
    out.println("Registered: " + name + " &lt;" + email + "&gt;, " + gender + ", " + major);
    out.println("Skills (" + skills.length + "): " + String.join(", ", skills));
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /dang-ky/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 105

fullname=Ho%C3%A0ng+C%C6%B0%E1%BB%9Dng&amp;email=cuong%40fpt.edu.vn&amp;gender=male&amp;major=SE&amp;skill=Java&amp;skill=SQL</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 79

Registered: Hoàng Cường &lt;cuong@fpt.edu.vn&gt;, male, SE
Skills (2): Java, SQL</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /dang-ky/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 32

fullname=++&amp;email=cuong&amp;major=AI</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/plain;charset=UTF-8
Content-Length: 109

ERROR: Full name is required
ERROR: Email is not valid
ERROR: Choose a gender
ERROR: Tick at least one skill</code></pre>
<p class="dap-an">✅ Why: checkboxes with the same name send one pair per ticked box (<code>skill=Java&amp;skill=SQL</code>), so <code>getParameterValues</code> returns an array — <code>getParameter</code> would return only the first. Nothing ticked ⇒ the name is not sent at all ⇒ <code>null</code>, not an empty array. A radio group with nothing chosen is also absent ⇒ <code>null</code>. <code>trim()</code> after a null-check turns "&nbsp;&nbsp;" into "" so a name of spaces is rejected. Collect <em>all</em> errors before answering, so the user fixes everything in one go.</p>
<div class="pitfall">HTML5 <code>required</code> and <code>type="email"</code> help the user but protect nothing: the second request above was sent without any browser. Server-side validation is what the PE grades.</div>`,
    `<h3>🧪 Bài 4 — Form đăng ký có đủ loại ô (~20 phút)</h3>
<p>Form: họ tên (ô chữ), email, giới tính (radio), chuyên ngành (select), kỹ năng (checkbox). Servlet phải đọc hết, kiểm tra ở server (bắt buộc có tên, email đúng dạng, đã chọn giới tính, ít nhất một kỹ năng) và trả 400 kèm danh sách lỗi, hoặc trả lời xác nhận.</p>
<p class="ghi-chu">📄 <code>dang-ky/src/main/webapp/index.html</code></p>
<pre class="web-src"><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Register&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;form action="register" method="post"&gt;
    Full name: &lt;input type="text" name="fullname"&gt;&lt;br&gt;
    Email: &lt;input type="email" name="email"&gt;&lt;br&gt;
    Gender:
    &lt;input type="radio" name="gender" value="male"&gt; Male
    &lt;input type="radio" name="gender" value="female"&gt; Female&lt;br&gt;
    Major:
    &lt;select name="major"&gt;
        &lt;option value="SE"&gt;Software Engineering&lt;/option&gt;
        &lt;option value="AI"&gt;Artificial Intelligence&lt;/option&gt;
    &lt;/select&gt;&lt;br&gt;
    Skills:
    &lt;input type="checkbox" name="skill" value="Java"&gt; Java
    &lt;input type="checkbox" name="skill" value="SQL"&gt; SQL
    &lt;input type="checkbox" name="skill" value="React"&gt; React&lt;br&gt;
    &lt;button type="submit"&gt;Register&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">📄 <code>dang-ky/src/main/java/demo/RegisterServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    req.setCharacterEncoding("UTF-8");
    String name = trim(req.getParameter("fullname"));           // ô chữ
    String email = trim(req.getParameter("email"));
    String gender = req.getParameter("gender");                  // radio: một giá trị hoặc null
    String major = req.getParameter("major");                    // danh sách thả xuống
    String[] skills = req.getParameterValues("skill");           // checkbox: mảng hoặc null

    List&lt;String&gt; errors = new ArrayList&lt;&gt;();
    if (name.isEmpty()) errors.add("Full name is required");
    if (!email.matches("[\\\\w.+-]+@[\\\\w-]+(\\\\.[\\\\w-]+)+")) errors.add("Email is not valid");
    if (gender == null) errors.add("Choose a gender");
    if (skills == null) errors.add("Tick at least one skill");

    resp.setContentType("text/plain;charset=UTF-8");
    PrintWriter out = resp.getWriter();
    if (!errors.isEmpty()) {
        resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);         // 400 + danh sách, để form hiện lại
        errors.forEach(e -&gt; out.println("ERROR: " + e));
        return;
    }
    out.println("Registered: " + name + " &lt;" + email + "&gt;, " + gender + ", " + major);
    out.println("Skills (" + skills.length + "): " + String.join(", ", skills));
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /dang-ky/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 105

fullname=Ho%C3%A0ng+C%C6%B0%E1%BB%9Dng&amp;email=cuong%40fpt.edu.vn&amp;gender=male&amp;major=SE&amp;skill=Java&amp;skill=SQL</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 79

Registered: Hoàng Cường &lt;cuong@fpt.edu.vn&gt;, male, SE
Skills (2): Java, SQL</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /dang-ky/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 32

fullname=++&amp;email=cuong&amp;major=AI</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/plain;charset=UTF-8
Content-Length: 109

ERROR: Full name is required
ERROR: Email is not valid
ERROR: Choose a gender
ERROR: Tick at least one skill</code></pre>
<p class="dap-an">✅ Vì sao: các checkbox cùng name gửi một cặp cho mỗi ô được đánh dấu (<code>skill=Java&amp;skill=SQL</code>), nên <code>getParameterValues</code> trả về mảng — <code>getParameter</code> chỉ trả giá trị đầu tiên. Không đánh dấu ô nào ⇒ name đó hoàn toàn không được gửi ⇒ <code>null</code>, không phải mảng rỗng. Nhóm radio chưa chọn cũng vắng mặt ⇒ <code>null</code>. <code>trim()</code> sau khi kiểm null biến "&nbsp;&nbsp;" thành "" nên tên toàn dấu cách bị từ chối. Gom <em>đủ</em> mọi lỗi rồi mới trả lời, để người dùng sửa một lần là xong.</p>
<div class="pitfall"><code>required</code> và <code>type="email"</code> của HTML5 giúp người dùng nhưng không bảo vệ được gì: request thứ hai ở trên được gửi đi mà không cần trình duyệt nào. Kiểm tra ở server mới là thứ PE chấm.</div>`),
    bi(`<h3>🧪 Exercise 5 — The PE login skeleton: session + Post/Redirect/Get (~25 min)</h3>
<p><code>/login</code>: GET shows the form; POST checks user/password; success ⇒ store the user in the session and <strong>redirect</strong> to <code>/home</code>; failure ⇒ 401 and the form again with an error. <code>/home</code> is only for logged-in users (otherwise redirect to <code>/login</code>). <code>/logout</code> forgets the user. Follow one browser through six requests:</p>
<p class="ghi-chu">📄 <code>dang-nhap/src/main/java/controller/LoginServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String user = req.getParameter("user"), pass = req.getParameter("pass");
    if (user != null &amp;&amp; pass != null &amp;&amp; pass.equals(USERS.get(user))) {
        req.getSession().setAttribute("user", user);    // remember who logged in (Chapter 4)
        resp.sendRedirect("home");                       // Post/Redirect/Get: F5 will not re-send the password
    } else {
        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        showForm(resp, "Wrong user name or password");   // same page, with an error
    }
}</code></pre>
<p class="ghi-chu">📄 <code>dang-nhap/src/main/java/controller/HomeServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    HttpSession session = req.getSession(false);          // false: do NOT create one
    String user = (session == null) ? null : (String) session.getAttribute("user");
    if (user == null) {
        resp.sendRedirect("login");
        return;
    }
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("Welcome, " + user + "!");
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /dang-nhap/home HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /dang-nhap/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 19

user=cuong&amp;pass=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 401
Content-Type: text/html;charset=UTF-8
Content-Length: 187

&lt;form action="login" method="post"&gt;
&lt;p class="error"&gt;Wrong user name or password&lt;/p&gt;
User: &lt;input name="user"&gt; Password: &lt;input type="password" name="pass"&gt;
&lt;button&gt;Login&lt;/button&gt;&lt;/form&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /dang-nhap/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

user=cuong&amp;pass=Prj301!</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…; Path=/dang-nhap; HttpOnly
Location: home
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /dang-nhap/home HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 16

Welcome, cuong!</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /dang-nhap/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /dang-nhap/home HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: login
Content-Length: 0</code></pre>
<p class="dap-an">✅ Why each decision: <strong>(1)</strong> success answers <strong>302</strong> instead of HTML — Post/Redirect/Get: the browser then GETs <code>/home</code>, so F5 reloads a harmless GET instead of re-posting the password. <strong>(2)</strong> the session cookie appears exactly when <code>getSession()</code> first creates a session — at the successful login. <strong>(3)</strong> <code>/home</code> uses <code>getSession(false)</code>: "give me the session if there is one, do not create one" — a guest should not get a session just by visiting. <strong>(4)</strong> after <code>invalidate()</code> the same JSESSIONID cookie is still sent, but it points to nothing ⇒ redirect to login. <strong>(5)</strong> failure keeps the user on the page (no redirect) so the error is shown; status 401 tells tools the login failed.</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): Spring Security does exactly this sequence for you — a form login filter, a session, a redirect after login, an access check before <code>/home</code>. Chapter 8 moves the "is there a user?" check out of every servlet into one Filter, which is how Spring Security is built.</div>`,
    `<h3>🧪 Bài 5 — Khung đăng nhập của đề PE: session + Post/Redirect/Get (~25 phút)</h3>
<p><code>/login</code>: GET hiện form; POST kiểm tra user/mật khẩu; đúng ⇒ cất user vào session và <strong>chuyển hướng</strong> sang <code>/home</code>; sai ⇒ 401 và hiện lại form kèm lỗi. <code>/home</code> chỉ dành cho người đã đăng nhập (không thì chuyển về <code>/login</code>). <code>/logout</code> quên người dùng. Theo một trình duyệt qua sáu request:</p>
<p class="ghi-chu">📄 <code>dang-nhap/src/main/java/controller/LoginServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String user = req.getParameter("user"), pass = req.getParameter("pass");
    if (user != null &amp;&amp; pass != null &amp;&amp; pass.equals(USERS.get(user))) {
        req.getSession().setAttribute("user", user);    // nhớ ai đã đăng nhập (Chương 4)
        resp.sendRedirect("home");                       // F5 không gửi lại mật khẩu
    } else {
        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        showForm(resp, "Wrong user name or password");   // cùng trang, kèm thông báo lỗi
    }
}</code></pre>
<p class="ghi-chu">📄 <code>dang-nhap/src/main/java/controller/HomeServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    HttpSession session = req.getSession(false);          // false: KHÔNG tạo mới
    String user = (session == null) ? null : (String) session.getAttribute("user");
    if (user == null) {
        resp.sendRedirect("login");
        return;
    }
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("Welcome, " + user + "!");
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /dang-nhap/home HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /dang-nhap/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 19

user=cuong&amp;pass=123</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 401
Content-Type: text/html;charset=UTF-8
Content-Length: 187

&lt;form action="login" method="post"&gt;
&lt;p class="error"&gt;Wrong user name or password&lt;/p&gt;
User: &lt;input name="user"&gt; Password: &lt;input type="password" name="pass"&gt;
&lt;button&gt;Login&lt;/button&gt;&lt;/form&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /dang-nhap/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

user=cuong&amp;pass=Prj301!</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…; Path=/dang-nhap; HttpOnly
Location: home
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /dang-nhap/home HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 16

Welcome, cuong!</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /dang-nhap/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /dang-nhap/home HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: login
Content-Length: 0</code></pre>
<p class="dap-an">✅ Vì sao từng quyết định: <strong>(1)</strong> đăng nhập đúng trả <strong>302</strong> thay vì HTML — Post/Redirect/Get: trình duyệt sau đó GET <code>/home</code>, nên bấm F5 chỉ tải lại một GET vô hại chứ không gửi lại mật khẩu. <strong>(2)</strong> cookie session xuất hiện đúng lúc <code>getSession()</code> tạo session lần đầu — ở lần đăng nhập thành công. <strong>(3)</strong> <code>/home</code> dùng <code>getSession(false)</code>: "có session thì đưa đây, đừng tạo mới" — khách vãng lai không nên có session chỉ vì ghé qua. <strong>(4)</strong> sau <code>invalidate()</code> trình duyệt vẫn gửi cookie JSESSIONID cũ, nhưng nó không còn trỏ tới đâu ⇒ chuyển về trang đăng nhập. <strong>(5)</strong> đăng nhập sai giữ người dùng ở lại trang (không chuyển hướng) để hiện lỗi; mã 401 cho công cụ biết đăng nhập thất bại.</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): Spring Security làm đúng chuỗi này giùm bạn — một filter đăng nhập bằng form, một session, chuyển hướng sau khi đăng nhập, kiểm tra quyền trước <code>/home</code>. Chương 8 đưa phép kiểm "có người dùng chưa?" ra khỏi từng servlet, gom vào một Filter — đúng cách Spring Security được dựng.</div>`),
    bi(`<h3>🧪 Exercise 6 — Welcome file and your own error pages (~10 min)</h3>
<p>Make <code>home.html</code> the welcome page; show a friendly page for every 404, and a specific page when a <code>NumberFormatException</code> escapes (e.g. <code>/product?id=abc</code>).</p>
<p class="ghi-chu">📄 <code>trang-loi/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;welcome-file-list&gt;
        &lt;welcome-file&gt;home.html&lt;/welcome-file&gt;
    &lt;/welcome-file-list&gt;
    &lt;error-page&gt;
        &lt;error-code&gt;404&lt;/error-code&gt;
        &lt;location&gt;/errors/404.html&lt;/location&gt;
    &lt;/error-page&gt;
    &lt;error-page&gt;
        &lt;exception-type&gt;java.lang.NumberFormatException&lt;/exception-type&gt;
        &lt;location&gt;/errors/bad-number.html&lt;/location&gt;
    &lt;/error-page&gt;
    &lt;session-config&gt;
        &lt;session-timeout&gt;30&lt;/session-timeout&gt;
    &lt;/session-config&gt;
&lt;/web-app&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /trang-loi/ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"116-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 116

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Shop&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;&lt;h1&gt;Shop home&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /trang-loi/khong-co.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html
Content-Length: 192

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Not found&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;&lt;h1&gt;Sorry, this page does not exist&lt;/h1&gt;&lt;p&gt;&lt;a href="/trang-loi/"&gt;Back to the shop&lt;/a&gt;&lt;/p&gt;&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /trang-loi/product?id=abc HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html
Content-Length: 143

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Bad input&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;&lt;h1&gt;The product id must be a number&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /trang-loi/product?id=7 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 11

product #7</code></pre>
<p class="dap-an">✅ Why: <code>&lt;error-page&gt;</code> picks the page by <code>&lt;error-code&gt;</code> or by <code>&lt;exception-type&gt;</code>; the <code>&lt;location&gt;</code> starts with <code>/</code> and is relative to the app. Look at the status codes: <strong>still 404 and 500</strong> — a custom error page changes what the user sees, not the truth told to the browser (search engines, monitoring and JavaScript still see the error). Catching the exception in the servlet and answering 400 (Chapter 1, exercise 2) is even better; the error page is the safety net.</p>`,
    `<h3>🧪 Bài 6 — Welcome file và trang lỗi của riêng bạn (~10 phút)</h3>
<p>Đặt <code>home.html</code> làm trang chào mừng; hiện một trang thân thiện cho mọi lỗi 404, và một trang riêng khi có <code>NumberFormatException</code> lọt ra ngoài (vd <code>/product?id=abc</code>).</p>
<p class="ghi-chu">📄 <code>trang-loi/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;welcome-file-list&gt;
        &lt;welcome-file&gt;home.html&lt;/welcome-file&gt;
    &lt;/welcome-file-list&gt;
    &lt;error-page&gt;
        &lt;error-code&gt;404&lt;/error-code&gt;
        &lt;location&gt;/errors/404.html&lt;/location&gt;
    &lt;/error-page&gt;
    &lt;error-page&gt;
        &lt;exception-type&gt;java.lang.NumberFormatException&lt;/exception-type&gt;
        &lt;location&gt;/errors/bad-number.html&lt;/location&gt;
    &lt;/error-page&gt;
    &lt;session-config&gt;
        &lt;session-timeout&gt;30&lt;/session-timeout&gt;
    &lt;/session-config&gt;
&lt;/web-app&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /trang-loi/ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"116-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 116

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Shop&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;&lt;h1&gt;Shop home&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /trang-loi/khong-co.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html
Content-Length: 192

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Not found&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;&lt;h1&gt;Sorry, this page does not exist&lt;/h1&gt;&lt;p&gt;&lt;a href="/trang-loi/"&gt;Back to the shop&lt;/a&gt;&lt;/p&gt;&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /trang-loi/product?id=abc HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html
Content-Length: 143

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Bad input&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;&lt;h1&gt;The product id must be a number&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /trang-loi/product?id=7 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 11

product #7</code></pre>
<p class="dap-an">✅ Vì sao: <code>&lt;error-page&gt;</code> chọn trang theo <code>&lt;error-code&gt;</code> hoặc theo <code>&lt;exception-type&gt;</code>; <code>&lt;location&gt;</code> bắt đầu bằng <code>/</code> và tính trong ứng dụng. Nhìn mã trạng thái: <strong>vẫn là 404 và 500</strong> — trang lỗi tự làm đổi thứ người dùng nhìn thấy, không đổi sự thật nói với trình duyệt (công cụ tìm kiếm, hệ thống giám sát và JavaScript vẫn thấy lỗi). Bắt exception ngay trong servlet rồi trả 400 (Chương 1, bài 2) còn tốt hơn; trang lỗi là tấm lưới an toàn.</p>`),
    bi(`<h3>🧪 Exercise 7 — What is inside the WAR? (~5 min)</h3>
<p>Before looking: list the entries you expect in <code>dang-nhap.war</code> (three servlets in package <code>controller</code>, no web.xml, no JSP). Then compare.</p>
<p class="ghi-chu">📦 Inside the <code>dang-nhap.war</code> the generator built and deployed (<code>jar tf</code>, sorted)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/controller/<br>
WEB-INF/classes/controller/HomeServlet.class<br>
WEB-INF/classes/controller/LoginServlet.class<br>
WEB-INF/classes/controller/LogoutServlet.class</div>
<p class="dap-an">✅ Only compiled classes under <code>WEB-INF/classes/&lt;package&gt;/</code> plus the manifest the <code>jar</code> tool adds. No <code>web.xml</code> — every servlet uses <code>@WebServlet</code>, which has been enough since Servlet 3.0. No <code>servlet-api.jar</code> — Tomcat provides it (Maven scope <code>provided</code>); shipping your own copy causes class-loading conflicts. To deploy: copy the file into <code>webapps/</code>; its name, <code>dang-nhap</code>, becomes the context path.</p>`,
    `<h3>🧪 Bài 7 — Bên trong file WAR có gì? (~5 phút)</h3>
<p>Trước khi xem: liệt kê các mục bạn nghĩ có trong <code>dang-nhap.war</code> (ba servlet trong gói <code>controller</code>, không web.xml, không JSP). Rồi so sánh.</p>
<p class="ghi-chu">📦 Bên trong <code>dang-nhap.war</code> mà generator đã đóng và deploy (<code>jar tf</code>, sắp xếp)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/controller/<br>
WEB-INF/classes/controller/HomeServlet.class<br>
WEB-INF/classes/controller/LoginServlet.class<br>
WEB-INF/classes/controller/LogoutServlet.class</div>
<p class="dap-an">✅ Chỉ có các lớp đã biên dịch trong <code>WEB-INF/classes/&lt;gói&gt;/</code> cộng file manifest do công cụ <code>jar</code> thêm vào. Không có <code>web.xml</code> — mọi servlet dùng <code>@WebServlet</code>, thế là đủ từ Servlet 3.0. Không có <code>servlet-api.jar</code> — Tomcat cung cấp sẵn (scope <code>provided</code> của Maven); tự mang một bản theo sẽ gây xung đột khi nạp lớp. Để deploy: chép file vào <code>webapps/</code>; tên của nó, <code>dang-nhap</code>, thành context path.</p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>HttpServlet</strong></td><td>lớp servlet cho HTTP</td><td>The abstract class you extend; its service() dispatches to doGet, doPost and the other doXxx methods.</td></tr>
<tr><td><strong>life cycle</strong></td><td>vòng đời</td><td>init once, service once per request (many threads), destroy once — all called by the container.</td></tr>
<tr><td><strong>load-on-startup</strong></td><td>nạp khi khởi động</td><td>A web.xml setting that creates and initialises a servlet at deployment instead of at its first request.</td></tr>
<tr><td><strong>init-param</strong></td><td>tham số khởi tạo</td><td>A name/value given to ONE servlet in web.xml, read with getInitParameter.</td></tr>
<tr><td><strong>context-param</strong></td><td>tham số ngữ cảnh</td><td>A name/value shared by the whole application, read with getServletContext().getInitParameter.</td></tr>
<tr><td><strong>deployment descriptor</strong></td><td>tệp mô tả triển khai</td><td>The WEB-INF/web.xml file that tells the container how to deploy the app.</td></tr>
<tr><td><strong>url-pattern</strong></td><td>mẫu URL</td><td>The path a servlet answers: exact (/report), prefix (/api/*), extension (*.do) or default (/).</td></tr>
<tr><td><strong>servlet path / path info</strong></td><td>đường dẫn servlet / phần đường dẫn còn lại</td><td>The part of the URL the pattern matched, and what follows it.</td></tr>
<tr><td><strong>welcome file</strong></td><td>trang chào mừng</td><td>The page served when the URL names a folder, tried in the listed order.</td></tr>
<tr><td><strong>error page</strong></td><td>trang lỗi</td><td>A page web.xml shows for an error code or exception type; the status code stays the same.</td></tr>
<tr><td><strong>WEB-INF</strong></td><td>thư mục WEB-INF</td><td>The private folder of a web app: web.xml, classes, lib — never served directly.</td></tr>
<tr><td><strong>WAR file</strong></td><td>tệp WAR</td><td>A ZIP of the whole web application in its deployable layout, dropped into Tomcat's webapps.</td></tr>
<tr><td><strong>getParameterValues</strong></td><td>đọc mọi giá trị của một tham số</td><td>Returns a String array for fields sent several times (checkboxes), or null if absent.</td></tr>
<tr><td><strong>committed response</strong></td><td>response đã commit</td><td>A response whose status and headers are already sent; they can no longer change.</td></tr>
<tr><td><strong>Post/Redirect/Get</strong></td><td>mẫu Gửi/Chuyển hướng/Lấy</td><td>After a successful POST, answer 302 so the browser GETs the result page — F5 is then harmless.</td></tr>
<tr><td><strong>thread safety</strong></td><td>an toàn luồng</td><td>Code that stays correct when many threads run it at once; servlet fields need it.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>HttpServlet</strong></td><td>lớp servlet cho HTTP</td><td>Lớp trừu tượng bạn kế thừa; service() của nó chuyển request tới doGet, doPost và các doXxx khác.</td></tr>
<tr><td><strong>life cycle</strong></td><td>vòng đời</td><td>init một lần, service mỗi request một lần (nhiều luồng), destroy một lần — đều do container gọi.</td></tr>
<tr><td><strong>load-on-startup</strong></td><td>nạp khi khởi động</td><td>Thiết lập web.xml tạo và khởi tạo servlet ngay lúc deploy thay vì ở request đầu tiên.</td></tr>
<tr><td><strong>init-param</strong></td><td>tham số khởi tạo</td><td>Cặp tên/giá trị cấp cho MỘT servlet trong web.xml, đọc bằng getInitParameter.</td></tr>
<tr><td><strong>context-param</strong></td><td>tham số ngữ cảnh</td><td>Cặp tên/giá trị cả ứng dụng dùng chung, đọc bằng getServletContext().getInitParameter.</td></tr>
<tr><td><strong>deployment descriptor</strong></td><td>tệp mô tả triển khai</td><td>File WEB-INF/web.xml cho container biết cách deploy ứng dụng.</td></tr>
<tr><td><strong>url-pattern</strong></td><td>mẫu URL</td><td>Đường dẫn servlet trả lời: chính xác (/report), tiền tố (/api/*), đuôi (*.do) hoặc mặc định (/).</td></tr>
<tr><td><strong>servlet path / path info</strong></td><td>đường dẫn servlet / phần đường dẫn còn lại</td><td>Phần URL mà pattern đã khớp, và phần đứng sau nó.</td></tr>
<tr><td><strong>welcome file</strong></td><td>trang chào mừng</td><td>Trang được gửi khi URL chỉ tới một thư mục, thử theo thứ tự đã liệt kê.</td></tr>
<tr><td><strong>error page</strong></td><td>trang lỗi</td><td>Trang web.xml hiện cho một mã lỗi hay một loại exception; mã trạng thái giữ nguyên.</td></tr>
<tr><td><strong>WEB-INF</strong></td><td>thư mục WEB-INF</td><td>Thư mục riêng tư của ứng dụng web: web.xml, classes, lib — không bao giờ được gửi trực tiếp.</td></tr>
<tr><td><strong>WAR file</strong></td><td>tệp WAR</td><td>File ZIP chứa cả ứng dụng web theo bố cục deploy được, thả vào webapps của Tomcat.</td></tr>
<tr><td><strong>getParameterValues</strong></td><td>đọc mọi giá trị của một tham số</td><td>Trả về mảng String cho ô được gửi nhiều lần (checkbox), hoặc null nếu không có.</td></tr>
<tr><td><strong>committed response</strong></td><td>response đã commit</td><td>Response mà mã trạng thái và header đã được gửi đi; không đổi được nữa.</td></tr>
<tr><td><strong>Post/Redirect/Get</strong></td><td>mẫu Gửi/Chuyển hướng/Lấy</td><td>Sau một POST thành công, trả 302 để trình duyệt GET trang kết quả — khi đó bấm F5 vô hại.</td></tr>
<tr><td><strong>thread safety</strong></td><td>an toàn luồng</td><td>Code vẫn đúng khi nhiều luồng chạy nó cùng lúc; các trường của servlet cần điều này.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 2</h2>
<ol>
<li>A servlet extends <code>HttpServlet</code> and overrides <code>doGet</code>/<code>doPost</code>; it is mapped by <code>@WebServlet</code> or web.xml.</li>
<li>Life cycle: init once → service per request on many threads → destroy once. One object: no per-user data in fields; use atomic types or synchronization for shared counters.</li>
<li>Matching order: exact → longest path prefix → extension → default. <code>getServletPath</code> + <code>getPathInfo</code> split the URL.</li>
<li><code>getParameter</code> → String or null; <code>getParameterValues</code> → array or null. Validate on the server, collect all errors.</li>
<li>Set status, headers, cookies and Content-Type before writing the body; a committed response cannot change them.</li>
<li>Login: session attribute + 302 redirect (PRG); protected pages check <code>getSession(false)</code>; logout = <code>invalidate()</code>.</li>
<li>web.xml: context-param, servlet (+ init-param, load-on-startup), servlet-mapping, welcome-file-list, error-page, session-config.</li>
<li>WAR = the deployable layout zipped: pages at the root, <code>WEB-INF/classes</code>, <code>WEB-INF/lib</code>, <code>WEB-INF/web.xml</code>; the file name is the context path.</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 2</h2>
<ol>
<li>Servlet kế thừa <code>HttpServlet</code> và ghi đè <code>doGet</code>/<code>doPost</code>; được ánh xạ bằng <code>@WebServlet</code> hoặc web.xml.</li>
<li>Vòng đời: init một lần → service mỗi request trên nhiều luồng → destroy một lần. Một đối tượng: không để dữ liệu riêng từng người trong trường; dùng kiểu atomic hoặc đồng bộ hoá cho bộ đếm dùng chung.</li>
<li>Thứ tự khớp: chính xác → tiền tố dài nhất → đuôi file → mặc định. <code>getServletPath</code> + <code>getPathInfo</code> tách URL ra.</li>
<li><code>getParameter</code> → String hoặc null; <code>getParameterValues</code> → mảng hoặc null. Kiểm tra ở server, gom đủ mọi lỗi.</li>
<li>Đặt mã trạng thái, header, cookie và Content-Type trước khi viết body; response đã commit thì không đổi được nữa.</li>
<li>Đăng nhập: attribute trong session + chuyển hướng 302 (PRG); trang được bảo vệ kiểm <code>getSession(false)</code>; đăng xuất = <code>invalidate()</code>.</li>
<li>web.xml: context-param, servlet (+ init-param, load-on-startup), servlet-mapping, welcome-file-list, error-page, session-config.</li>
<li>WAR = bố cục deploy được nén lại: trang ở gốc, <code>WEB-INF/classes</code>, <code>WEB-INF/lib</code>, <code>WEB-INF/web.xml</code>; tên file là context path.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (prj301-quiz-ch2) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) Which order do the servlet life-cycle methods follow?|||(Dạng câu FE) Các phương thức vòng đời servlet được gọi theo thứ tự nào?',
      options: ['service() → init() → destroy()|||service() → init() → destroy()', 'init() once → service() for each request → destroy() once|||init() một lần → service() cho mỗi request → destroy() một lần', 'init() → destroy() after every request|||init() → destroy() sau mỗi request', 'constructor → doGet() → finalize()|||constructor → doGet() → finalize()'],
      correctIndex: 1,
      points: 1,
      explanation: 'Slide 19 and the real Tomcat console: init ran once (at the first request), doGet ran for requests #1–#3 on the same object, destroy ran once at undeploy. C is wrong — the object is NOT destroyed after each request; D names Java object mechanics, not the servlet contract.|||Slide 19 và console Tomcat thật: init chạy một lần (ở request đầu), doGet chạy cho request #1–#3 trên cùng một đối tượng, destroy chạy một lần khi gỡ ứng dụng. C sai — đối tượng KHÔNG bị huỷ sau mỗi request; D nói về cơ chế đối tượng Java, không phải hợp đồng của servlet.' },
    { id: 'q2',
      question: '(FE question type) A form has method="POST" and action="LoginServlet". LoginServlet does not override service(). Which method handles the submit?|||(Dạng câu FE) Một form có method="POST" và action="LoginServlet". LoginServlet không ghi đè service(). Phương thức nào xử lý khi bấm gửi?',
      options: ['doPOST(HttpServletRequest, HttpServletResponse)|||doPOST(HttpServletRequest, HttpServletResponse)', 'servicePost(HttpServletRequest, HttpServletResponse)|||servicePost(HttpServletRequest, HttpServletResponse)', 'doPost(HttpServletRequest, HttpServletResponse)|||doPost(HttpServletRequest, HttpServletResponse)', 'doGet(HttpServletRequest, HttpServletResponse), because forms always use GET|||doGet(HttpServletRequest, HttpServletResponse), vì form luôn dùng GET'],
      correctIndex: 2,
      points: 1,
      explanation: 'HttpServlet.service() dispatches by method name; POST goes to doPost — exact spelling, Java is case-sensitive, so doPOST and servicePost simply do not exist (they would never be called). Forms use GET only when no method is given.|||HttpServlet.service() chia việc theo tên method; POST đi tới doPost — đúng chính tả, Java phân biệt hoa thường, nên doPOST và servicePost đơn giản là không tồn tại (sẽ không bao giờ được gọi). Form chỉ dùng GET khi không ghi method.' },
    { id: 'q3',
      question: '(FE question type) Where is the deployment descriptor web.xml located in a standard Java web application?|||(Dạng câu FE) Trong một ứng dụng Java web chuẩn, deployment descriptor web.xml nằm ở đâu?',
      options: ['In the context root, next to index.html|||Ở context root, cạnh index.html', 'In /WEB-INF/classes|||Trong /WEB-INF/classes', "In Tomcat's conf folder only|||Chỉ trong thư mục conf của Tomcat", 'In /WEB-INF|||Trong /WEB-INF'],
      correctIndex: 3,
      points: 1,
      explanation: "Slide 34: /WEB-INF holds web.xml, with classes/ and lib/ under it — a folder clients cannot request directly (the real request for /FirstServlet/WEB-INF/web.xml returned 404). Tomcat's conf/web.xml is a different file: the global defaults shared by every app.|||Slide 34: /WEB-INF chứa web.xml, bên dưới có classes/ và lib/ — thư mục client không request trực tiếp được (request thật tới /FirstServlet/WEB-INF/web.xml trả 404). conf/web.xml của Tomcat là một file khác: các mặc định dùng chung cho mọi ứng dụng." },
    { id: 'q4',
      question: 'A value must be shared by ALL servlets of the application. Where do you declare it and how do you read it?|||Một giá trị phải dùng chung cho MỌI servlet của ứng dụng. Khai nó ở đâu và đọc nó thế nào?',
      options: ['<context-param> under <web-app>; getServletContext().getInitParameter("name")|||<context-param> dưới <web-app>; getServletContext().getInitParameter("name")', '<init-param> inside one <servlet>; getInitParameter("name") from any servlet|||<init-param> trong một <servlet>; getInitParameter("name") từ servlet nào cũng được', '<param> inside <servlet-mapping>; request.getParameter("name")|||<param> trong <servlet-mapping>; request.getParameter("name")', 'Nowhere: servlets cannot share configuration|||Không ở đâu cả: các servlet không dùng chung cấu hình được'],
      correctIndex: 0,
      points: 1,
      explanation: "context-param belongs to the whole web application (ServletContext). An init-param belongs to ONE servlet, so other servlets get null (B). request.getParameter reads the client's form/query data, not configuration, and <servlet-mapping> has no <param>. The dem-truy-cap exercise reads both kinds for real.|||context-param thuộc cả ứng dụng web (ServletContext). init-param thuộc về MỘT servlet, nên servlet khác nhận null (B). request.getParameter đọc dữ liệu form/query của client, không phải cấu hình, và <servlet-mapping> không có <param>. Bài tập dem-truy-cap đọc thật cả hai loại." },
    { id: 'q5',
      question: 'web.xml maps servlet A to /api/* and servlet B to *.do. Which servlet handles /app/api/save.do?|||web.xml ánh xạ servlet A tới /api/* và servlet B tới *.do. Servlet nào xử lý /app/api/save.do?',
      options: ['B, because the extension is the most specific part|||B, vì đuôi file là phần cụ thể nhất', 'A, because path-prefix mappings are tried before extension mappings|||A, vì ánh xạ tiền tố đường dẫn được thử trước ánh xạ đuôi file', 'Both, one after the other|||Cả hai, lần lượt từng cái', 'Neither: Tomcat answers 404 because the patterns conflict|||Không cái nào: Tomcat trả 404 vì các pattern xung đột'],
      correctIndex: 1,
      points: 1,
      explanation: "The container's order is exact match → longest path prefix → extension → default. The real run of the url-pattern exercise shows servlet-name = Prefix with pathInfo = /save.do. Only one servlet handles a request (filters can chain, servlets do not).|||Thứ tự của container là khớp chính xác → tiền tố dài nhất → đuôi file → mặc định. Lần chạy thật của bài tập url-pattern cho servlet-name = Prefix với pathInfo = /save.do. Mỗi request chỉ một servlet xử lý (filter mới nối chuỗi được, servlet thì không)." },
    { id: 'q6',
      question: '(FE question type) How does the servlet container handle many simultaneous requests to the same servlet?|||(Dạng câu FE) Servlet container xử lý nhiều request cùng lúc tới cùng một servlet thế nào?',
      options: ['It creates a new servlet object for every request|||Nó tạo một đối tượng servlet mới cho mỗi request', 'It queues them and runs one request at a time|||Nó xếp hàng và chạy từng request một', 'It uses one servlet object and runs each request in its own thread|||Nó dùng một đối tượng servlet và chạy mỗi request trên một luồng riêng', 'It starts a new JVM process per request, like CGI|||Nó khởi động một tiến trình JVM mới cho mỗi request, như CGI'],
      correctIndex: 2,
      points: 1,
      explanation: 'One instance, many threads — which is why instance fields are shared and must be thread-safe (AtomicInteger, synchronized) and why per-user data never goes into a field. A and D describe the costly CGI model servlets were invented to replace; B would make a busy site unusable.|||Một đối tượng, nhiều luồng — vì thế các trường của đối tượng là dùng chung và phải an toàn luồng (AtomicInteger, synchronized), và dữ liệu riêng từng người không bao giờ đặt trong trường. A và D tả mô hình CGI tốn kém mà servlet ra đời để thay thế; B sẽ làm site đông người dùng không nổi.' },
    { id: 'q7',
      question: 'A form has checkboxes <input type="checkbox" name="skill" value="Java"> and value="SQL"; the user ticks both. What reads both values?|||Một form có các checkbox <input type="checkbox" name="skill" value="Java"> và value="SQL"; người dùng đánh dấu cả hai. Dùng gì để đọc cả hai giá trị?',
      options: ['request.getParameter("skill"), which returns "Java,SQL"|||request.getParameter("skill"), trả về "Java,SQL"', 'request.getAttribute("skill")|||request.getAttribute("skill")', 'request.getHeader("skill")|||request.getHeader("skill")', 'request.getParameterValues("skill"), which returns {"Java", "SQL"}|||request.getParameterValues("skill"), trả về {"Java", "SQL"}'],
      correctIndex: 3,
      points: 1,
      explanation: 'The browser sends skill=Java&skill=SQL — the same name twice — and getParameterValues returns all values as a String array (null if none was ticked). getParameter returns only the first value ("Java"), not a joined string. Attributes are set by server code, headers are HTTP metadata.|||Trình duyệt gửi skill=Java&skill=SQL — cùng một name hai lần — và getParameterValues trả mọi giá trị thành mảng String (null nếu không ô nào được đánh dấu). getParameter chỉ trả giá trị đầu ("Java"), không nối chuỗi. Attribute do code phía server đặt, header là siêu dữ liệu của HTTP.' },
    { id: 'q8',
      question: '(FE question type) Which sub-elements of <servlet> are mandatory?|||(Dạng câu FE) Những phần tử con nào của <servlet> là bắt buộc?',
      options: ['<servlet-name> and <url-pattern>|||<servlet-name> và <url-pattern>', '<servlet-name> and <servlet-class> (or <jsp-file>)|||<servlet-name> và <servlet-class> (hoặc <jsp-file>)', '<init-param> and <load-on-startup>|||<init-param> và <load-on-startup>', '<display-name> and <description>|||<display-name> và <description>'],
      correctIndex: 1,
      points: 1,
      explanation: 'Slide 37: servlet-name "Always 1", servlet-class OR jsp-file "Always 1"; init-param is 0..many, load-on-startup 0..1, the descriptive elements optional. <url-pattern> belongs to <servlet-mapping>, not to <servlet>.|||Slide 37: servlet-name "Always 1", servlet-class HOẶC jsp-file "Always 1"; init-param 0..nhiều, load-on-startup 0..1, các phần tử mô tả là tuỳ chọn. <url-pattern> thuộc <servlet-mapping>, không thuộc <servlet>.' },
    { id: 'q9',
      question: 'A servlet writes part of the body, calls out.flush(), then calls response.setStatus(500). What does the browser receive?|||Một servlet viết một phần body, gọi out.flush(), rồi gọi response.setStatus(500). Trình duyệt nhận được gì?',
      options: ['Status 500, because the last call wins|||Mã 500, vì lệnh gọi cuối cùng thắng', 'An IllegalStateException page|||Một trang IllegalStateException', 'Status 200: the response was already committed, so setStatus is ignored|||Mã 200: response đã commit, nên setStatus bị bỏ qua', 'Two responses, 200 and then 500|||Hai response, 200 rồi 500'],
      correctIndex: 2,
      points: 1,
      explanation: 'flush() sends the status line and headers; after that they cannot change, and setStatus/setHeader are silently ignored — the slide 24 demo shows 200 and no X-Too-Late header. An exception is thrown only by some calls after commit (sendRedirect, forward), not by setStatus. One request always gets exactly one response.|||flush() gửi đi dòng trạng thái và header; sau đó chúng không đổi được nữa, và setStatus/setHeader bị bỏ qua trong im lặng — demo slide 24 cho thấy mã 200 và không có header X-Too-Late. Chỉ vài lệnh gọi sau khi commit mới ném exception (sendRedirect, forward), setStatus thì không. Mỗi request luôn nhận đúng một response.' },
    { id: 'q10',
      question: "You copy shop.war into Tomcat's webapps folder. Which URL opens the application?|||Bạn chép shop.war vào thư mục webapps của Tomcat. URL nào mở ứng dụng?",
      options: ['http://localhost:8080/shop/|||http://localhost:8080/shop/', 'http://localhost:8080/webapps/shop.war|||http://localhost:8080/webapps/shop.war', 'http://localhost:8080/ROOT/shop/|||http://localhost:8080/ROOT/shop/', 'http://localhost:8080/WEB-INF/shop/|||http://localhost:8080/WEB-INF/shop/'],
      correctIndex: 0,
      points: 1,
      explanation: 'Slide 41: Tomcat unpacks the WAR into webapps/shop and the context root is the file name without .war, so the app lives at /shop. webapps is a folder on disk, not part of the URL; only a file named ROOT.war is deployed at "/"; WEB-INF is never reachable by URL.|||Slide 41: Tomcat giải nén WAR thành webapps/shop và context root là tên file bỏ đuôi .war, nên ứng dụng nằm ở /shop. webapps là thư mục trên đĩa, không thuộc URL; chỉ file tên ROOT.war mới được deploy ở "/"; WEB-INF không bao giờ truy cập được bằng URL.' },
  ],
};

const QUIZ_LESSON = {
  title: 'Quiz Ch.2 — Servlets in depth: life cycle, doGet/doPost, web.xml, forms, WAR|||Quiz Ch.2 — Servlet chuyên sâu: vòng đời, doGet/doPost, web.xml, form, WAR',
  slug: 'prj301-quiz-ch2',
  type: 'QUIZ',
  description: '10 câu ôn Chương 2 viết lại theo dạng câu FE PRJ301: thứ tự vòng đời servlet, form POST gọi phương thức nào, web.xml nằm ở đâu, init-param khác context-param, luật chọn url-pattern, một đối tượng servlet phục vụ nhiều luồng, đọc checkbox bằng getParameterValues, phần tử bắt buộc của <servlet>, response đã commit, tên file WAR thành context path — mỗi câu có giải thích song ngữ.',
  quiz: QUIZ,
};

export default {
  slides: [L_prj1_2, L_prj1_3],
  practice: L_on_ch2,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 2 viết lại theo dạng câu FE PRJ301: thứ tự vòng đời servlet, form POST gọi phương thức nào, web.xml nằm ở đâu, init-param khác context-param, luật chọn url-pattern, một đối tượng servlet phục vụ nhiều luồng, đọc checkbox bằng getParameterValues, phần tử bắt buộc của <servlet>, response đã commit, tên file WAR thành context path — mỗi câu có giải thích song ngữ.',
  quizLesson: QUIZ_LESSON,
};
