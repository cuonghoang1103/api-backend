/**
 * PRJ301 · Chương 4 — bốn scope, session & cookie (prj5).
 * Bài 📑 học theo từng slide: prj5 (undefined, slide 1–20).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: prj301-on-ch4.
 * Quiz viết lại (10 câu, giữ slug prj301-quiz-1).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRJ301/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRJ301/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 4.A — 📑 Slide by slide · Session management (1/1): context, params, sessions, cookies, URL rewriting (slides 1–20) ───────── */
const L_prj5_1 = {
  title: '4.A — 📑 Slide by slide · Session management (1/1): context, params, sessions, cookies, URL rewriting (slides 1–20)|||4.A — 📑 Học theo từng slide · Quản lý phiên (1/1): context, tham số, session, cookie, viết lại URL (slide 1–20)',
  slug: 'prj301-slide-prj5-1',
  type: 'VIDEO',
  description: 'Giảng trọn 20 slide bộ "Servlet Session Management" (Slot 17–18): mô hình web container và đa luồng (lỗi để dữ liệu người dùng trong trường của servlet, chạy thật hai người), ServletContext và context, context-param với init-param (slide 10 thiếu dấu > và slide 13 dùng ngoặc cong — kiểm bằng parser XML và javac thật), vòng đời session có log listener thật, invalidate, ba mức time-out (mặc định 1800 giây của Tomcat, web.xml, setMaxInactiveInterval) kèm hết hạn thật sau 3 giây và "0 là không bao giờ hết hạn", cookie JSESSIONID với cookie bền, URL rewriting chạy thật với một trình duyệt tắt cookie — mọi ví dụ là ứng dụng chạy trên Tomcat 10.1, sơ đồ vẽ lại bằng PlantUML.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.A · school deck "Servlet Session Management" (Slot 17–18), slides 1–20</span>
<h2>Sessions — how a server that forgets everything still knows it is you</h2>
<p class="lead">HTTP is stateless: every request arrives as if it were the first. Yet your cart keeps its items, and FAP knows you are logged in. This deck explains how: the web container (Tomcat) gives each web application one shared <strong>ServletContext</strong>, gives each browser one <strong>HttpSession</strong>, and connects them with a small <strong>session ID</strong> that travels back and forth in a cookie or in the URL. Syllabus sessions 33–34 (LO2): <em>explain why a session is necessary, how session and cookie work, store and retrieve data in them.</em></p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>Why it matters for you</th></tr></thead>
<tbody>
<tr><td>3–5</td><td>the web container model, many threads</td><td>the bug "user B sees user A's name" comes from here</td></tr>
<tr><td>6–8</td><td>ServletContext, one context per web app</td><td>application scope; what a context path is</td></tr>
<tr><td>9–13</td><td>context-param vs init-param</td><td>configuration in web.xml — a favourite FE question</td></tr>
<tr><td>14–15</td><td>session life cycle, invalidate, time-out</td><td>login and logout in the Assignment and every PE</td></tr>
<tr><td>16–19</td><td>cookies vs URL rewriting</td><td>how the session ID travels; security of the session</td></tr>
<tr><td>20</td><td>summary</td><td>what to revise</td></tr>
</tbody>
</table>
<div class="callout"><strong>How to read this lesson.</strong> The deck is short and mostly text, so this lesson goes <em>wider</em> than the slides (marked ➕): the cookie API, what really ends a session, what the slides got wrong. Every example is a small web application that ran on a real <strong>Tomcat 10.1</strong>; under the code you see the requests sent <em>by one browser, in order</em> (cookies included) and the real responses — session IDs are masked as <code>…</code>, <code>…(2)</code> because they are random. The older lessons 4.1–4.3 below stay as a short summary of the four scopes; 4.4 is the practice.</div>`,
    `<span class="eyebrow">Chương 4 · Bài 4.A · bộ slide "Servlet Session Management" của trường (Slot 17–18), slide 1–20</span>
<h2>Session — vì sao một server quên sạch mọi thứ vẫn biết đó là bạn</h2>
<p class="lead">HTTP không trạng thái (stateless): request nào tới cũng như request đầu tiên. Vậy mà giỏ hàng vẫn giữ món đồ, FAP vẫn biết bạn đã đăng nhập. Bộ slide này giải thích bằng cách nào: web container (Tomcat) cho mỗi ứng dụng web một <strong>ServletContext</strong> dùng chung, cho mỗi trình duyệt một <strong>HttpSession</strong>, và nối chúng bằng một <strong>mã session (session ID)</strong> nhỏ đi qua lại trong cookie hoặc trong URL. Buổi 33–34 của đề cương (LO2): <em>giải thích vì sao cần session, session và cookie hoạt động ra sao, lưu và đọc dữ liệu trong chúng.</em></p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Vì sao quan trọng với bạn</th></tr></thead>
<tbody>
<tr><td>3–5</td><td>mô hình web container, nhiều luồng</td><td>lỗi "người B thấy tên người A" bắt nguồn từ đây</td></tr>
<tr><td>6–8</td><td>ServletContext, mỗi ứng dụng web một context</td><td>phạm vi application; context path là gì</td></tr>
<tr><td>9–13</td><td>context-param và init-param</td><td>cấu hình trong web.xml — câu FE rất hay gặp</td></tr>
<tr><td>14–15</td><td>vòng đời session, invalidate, hết hạn</td><td>đăng nhập, đăng xuất trong Assignment và mọi đề PE</td></tr>
<tr><td>16–19</td><td>cookie và viết lại URL</td><td>mã session đi lại thế nào; an toàn của session</td></tr>
<tr><td>20</td><td>tóm tắt</td><td>cần ôn gì</td></tr>
</tbody>
</table>
<div class="callout"><strong>Cách đọc bài này.</strong> Deck ngắn và chủ yếu là chữ, nên bài giảng <em>rộng hơn</em> slide (đánh dấu ➕): API cookie, điều gì thật sự kết thúc một session, slide sai ở đâu. Mỗi ví dụ là một ứng dụng web nhỏ đã chạy trên <strong>Tomcat 10.1</strong> thật; dưới code là các request do <em>một trình duyệt gửi theo thứ tự</em> (kèm cookie) và response thật — mã session được che thành <code>…</code>, <code>…(2)</code> vì chúng ngẫu nhiên. Các bài cũ 4.1–4.3 bên dưới giữ làm bản tóm tắt ngắn về bốn scope; 4.4 là bài thực hành.</div>`),
    walkHead('prj5', 1, 20),
    walk('prj5', [
      [1, 'Servlet Session Management',
        `<p class="y-chinh">🎯 Deck 5 of PRJ301: how a Java web application keeps <strong>state</strong> — data that must survive from one request to the next — using the container's ServletContext and HttpSession.</p>
<p>The footer says "n/23" but only 20 slides are visible: three slides are hidden in the file. One trace remains: the last slide lists "Sessions and Listeners", yet no visible slide is about listeners — those are taught in deck 11 (Chapter 8, lesson 8.B). This lesson shows a session listener at work on slide 14 so you see what it prints.</p>
<p class="meo">🧠 One sentence for the deck: <em>the server keeps your data, the browser keeps only a ticket number (the session ID) and shows it at every request.</em></p>`,
        `<p class="y-chinh">🎯 Deck 5 của PRJ301: một ứng dụng Java web giữ <strong>trạng thái (state)</strong> — dữ liệu phải sống từ request này sang request sau — bằng ServletContext và HttpSession của container ra sao.</p>
<p>Chân slide ghi "n/23" nhưng chỉ có 20 slide hiện ra: ba slide bị ẩn trong file. Còn sót một dấu vết: slide cuối kể "Sessions and Listeners", mà không slide nào đang hiện nói về listener — phần đó học ở deck 11 (Chương 8, bài 8.B). Bài này cho bạn xem một session listener làm việc ở slide 14 để thấy nó in ra gì.</p>
<p class="meo">🧠 Một câu cho cả deck: <em>server giữ dữ liệu của bạn, trình duyệt chỉ giữ một tấm vé số thứ tự (session ID) và trình nó ở mọi request.</em></p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 One goal, two parts: <strong>maintain state using a session</strong> — understand the web container model and the session, then store data in a session and read it back.</p>
<p>The syllabus words it the same way (sessions 33–34): <em>explain why a session is necessary, how session and cookie work, store and retrieve data to session and cookie</em>. The slides never show the code for "store and retrieve" — no <code>getSession</code>, no <code>setAttribute</code>, no <code>Cookie</code> — so this lesson adds it on slides 14, 15 and 18, and the practice 4.4 builds a cart and a login with it.</p>
<table>
<thead><tr><th>You will be able to…</th><th>Where</th></tr></thead>
<tbody>
<tr><td>explain why one servlet object must not hold per-user data</td><td>slides 3–5</td></tr>
<tr><td>put configuration in web.xml and read it from the right object</td><td>slides 9–13</td></tr>
<tr><td>create, use, time out and invalidate a session</td><td>slides 14–15</td></tr>
<tr><td>explain and choose between cookie and URL rewriting; use the Cookie API</td><td>slides 16–19 (+ 4.4)</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Một mục tiêu, hai phần: <strong>giữ trạng thái bằng session</strong> — hiểu mô hình web container và session, rồi lưu dữ liệu vào session và đọc lại.</p>
<p>Đề cương viết y như vậy (buổi 33–34): <em>giải thích vì sao cần session, session và cookie hoạt động ra sao, lưu và lấy dữ liệu với session và cookie</em>. Slide không hề cho code của phần "lưu và lấy" — không <code>getSession</code>, không <code>setAttribute</code>, không <code>Cookie</code> — nên bài này bổ sung ở slide 14, 15 và 18, và bài thực hành 4.4 dùng chúng dựng giỏ hàng và đăng nhập.</p>
<table>
<thead><tr><th>Học xong bạn làm được…</th><th>Ở đâu</th></tr></thead>
<tbody>
<tr><td>giải thích vì sao một đối tượng servlet không được giữ dữ liệu riêng từng người</td><td>slide 3–5</td></tr>
<tr><td>đặt cấu hình trong web.xml và đọc nó từ đúng đối tượng</td><td>slide 9–13</td></tr>
<tr><td>tạo, dùng, cho hết hạn và huỷ một session</td><td>slide 14–15</td></tr>
<tr><td>giải thích và chọn giữa cookie và viết lại URL; dùng API Cookie</td><td>slide 16–19 (+ 4.4)</td></tr>
</tbody>
</table>`],
      [3, 'Web Container Model',
        `<p class="y-chinh">🎯 The servlet container is a program that sits <strong>between the web server and your servlets</strong>: it loads, initialises and runs them; for each request it maps the URL to a servlet, translates the request into Java objects, calls the servlet, then translates the response back into network format.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/63f4e3f43cf9a26eceec5ac99c98ac88c1581759.svg" alt="One request through the container: map, translate, call, translate back" loading="lazy" /><p class="chu-thich">🧩 One request through the container: map, translate, call, translate back</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Web container model (slide 3): the container sits between the web server and your servlets
participant "Browser" as B
participant "Web server part\\n(Tomcat Connector, port 8080)" as W
participant "Servlet container\\n(Catalina)" as C
participant "Your servlet\\n(one object)" as S
B -&gt; W : bytes: "GET /shop/cart HTTP/1.1 ..."
W -&gt; C : parsed request
C -&gt; C : 1. map the URL to a servlet\\n(context /shop, pattern /cart)
C -&gt; C : 2. translate: build HttpServletRequest\\n+ HttpServletResponse objects
C -&gt; S : 3. service(req, resp) on a pool thread
S -&gt; S : read parameters, session...\\nwrite the body
S --&gt; C : return
C -&gt; C : 4. translate the response object\\ninto HTTP text (status, headers, body)
C --&gt; W : response
W --&gt; B : bytes: "HTTP/1.1 200 ..."
note over C : loads, initialises, runs and destroys servlets;\\nyou never call "new MyServlet()" yourself
@enduml</code></pre></details>
<p>"Translate" is the key word. The bytes <code>GET /shop/cart HTTP/1.1 …</code> become an <code>HttpServletRequest</code> object with methods such as <code>getParameter</code>; what you print into the <code>HttpServletResponse</code> becomes <code>HTTP/1.1 200 …</code> text again (lesson 1.A showed that text). In Tomcat the "web server" part is the <strong>Connector</strong> (port 8080) and the container part is called <strong>Catalina</strong>; both live in the same Java process.</p>
<p>"A compiled, executable program": Tomcat is itself a Java program (<code>bin/startup.bat</code> starts a JVM). Your servlets are not programs — they have no <code>main</code>; the container calls them.</p>`,
        `<p class="y-chinh">🎯 Servlet container là một chương trình đứng <strong>giữa web server và các servlet của bạn</strong>: nó nạp, khởi tạo và chạy chúng; với mỗi request nó ánh xạ URL tới một servlet, dịch request thành đối tượng Java, gọi servlet, rồi dịch response ngược lại thành định dạng truyền trên mạng.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/63f4e3f43cf9a26eceec5ac99c98ac88c1581759.svg" alt="Một request đi qua container: ánh xạ, dịch, gọi, dịch ngược lại" loading="lazy" /><p class="chu-thich">🧩 Một request đi qua container: ánh xạ, dịch, gọi, dịch ngược lại</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Web container model (slide 3): the container sits between the web server and your servlets
participant "Browser" as B
participant "Web server part\\n(Tomcat Connector, port 8080)" as W
participant "Servlet container\\n(Catalina)" as C
participant "Your servlet\\n(one object)" as S
B -&gt; W : bytes: "GET /shop/cart HTTP/1.1 ..."
W -&gt; C : parsed request
C -&gt; C : 1. map the URL to a servlet\\n(context /shop, pattern /cart)
C -&gt; C : 2. translate: build HttpServletRequest\\n+ HttpServletResponse objects
C -&gt; S : 3. service(req, resp) on a pool thread
S -&gt; S : read parameters, session...\\nwrite the body
S --&gt; C : return
C -&gt; C : 4. translate the response object\\ninto HTTP text (status, headers, body)
C --&gt; W : response
W --&gt; B : bytes: "HTTP/1.1 200 ..."
note over C : loads, initialises, runs and destroys servlets;\\nyou never call "new MyServlet()" yourself
@enduml</code></pre></details>
<p>"Dịch (translate)" là chữ then chốt. Chuỗi byte <code>GET /shop/cart HTTP/1.1 …</code> trở thành một đối tượng <code>HttpServletRequest</code> có các phương thức như <code>getParameter</code>; thứ bạn in vào <code>HttpServletResponse</code> lại trở thành chữ <code>HTTP/1.1 200 …</code> (bài 1.A đã cho xem đoạn chữ đó). Trong Tomcat, phần "web server" là <strong>Connector</strong> (cổng 8080) và phần container tên là <strong>Catalina</strong>; cả hai sống trong cùng một tiến trình Java.</p>
<p>"Một chương trình đã biên dịch, chạy được": bản thân Tomcat là một chương trình Java (<code>bin/startup.bat</code> khởi động một JVM). Servlet của bạn không phải chương trình — không có <code>main</code>; container gọi chúng.</p>`],
      [4, 'Web Container Model…',
        `<p class="y-chinh">🎯 The container serves many requests at once: it holds any number of servlets, filters and listeners, runs each request on its own <strong>thread</strong>, and more than one thread may be inside the same object at the same time — so every object in the container must be <strong>thread-safe</strong>.</p>
<p>The spec (Jakarta Servlet 6.0, §2.2) says the container uses <strong>one instance per servlet declaration</strong>. One object, many threads, many users. A <em>field</em> of that object is therefore shared by everybody. Here is the bug, for real: Alice opens <code>/chao-sai?name=Alice</code>, then Bob opens the same page from another browser, without a name:</p>
<p class="ghi-chu">📄 <code>phien-mot-doi-tuong/src/main/java/demo/GreetFieldServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.atomic.AtomicInteger;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// ❌ The classic bug: per-user data in a FIELD of the servlet
@WebServlet("/chao-sai")
public class GreetFieldServlet extends HttpServlet {
    private static final AtomicInteger CREATED = new AtomicInteger();   // how many objects of this class exist
    private final int objectNo = CREATED.incrementAndGet();

    private String name;   // ONE field, shared by every user and every thread

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (req.getParameter("name") != null) name = req.getParameter("name");
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("Hello, " + (name == null ? "stranger" : name));
        out.println("served by servlet object #" + objectNo + " (objects created: " + CREATED.get() + ")");
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-mot-doi-tuong/chao-sai?name=Alice HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 62

Hello, Alice
served by servlet object #1 (objects created: 1)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-mot-doi-tuong/chao-sai HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 62

Hello, Alice
served by servlet object #1 (objects created: 1)</code></pre>
<p>Bob is greeted as Alice, by servlet object #1 — the only one ever created. The fix keeps per-user data in the user's own session (slide 14) and per-request data in local variables (each thread has its own stack):</p>
<p class="ghi-chu">📄 <code>phien-mot-doi-tuong/src/main/java/demo/GreetSessionServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// ✅ The fix: per-user data in the user's SESSION, per-request data in LOCAL variables
@WebServlet("/chao-dung")
public class GreetSessionServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();
        String name = req.getParameter("name");                 // local variable: each thread has its own
        if (name != null) session.setAttribute("name", name);
        Object saved = session.getAttribute("name");
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("Hello, " + (saved == null ? "stranger" : saved));
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-mot-doi-tuong/chao-dung?name=Alice HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/phien-mot-doi-tuong; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 13

Hello, Alice</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-mot-doi-tuong/chao-dung HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/phien-mot-doi-tuong; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 16

Hello, stranger</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/007aac35b3b832e0ce7edee223e9d63e002d9abe.svg" alt="One servlet object, two users: the shared field leaks, the sessions do not" loading="lazy" /><p class="chu-thich">🧩 One servlet object, two users: the shared field leaks, the sessions do not</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 4: one servlet object, many threads (real run of /phien-mot-doi-tuong)
participant "Alice's request\\n(thread A)" as A
participant "GreetFieldServlet\\nobject #1\\nfield: name" as S
participant "Bob's request\\n(thread B, other browser)" as Bo
participant "Session of Alice" as SA
participant "Session of Bob" as SB
== the bug: per-user data in a field ==
A -&gt; S : GET /chao-sai?name=Alice
S -&gt; S : name = "Alice" (shared field)
S --&gt; A : Hello, Alice
Bo -&gt; S : GET /chao-sai (no name)
S --&gt; Bo : Hello, Alice (Bob sees Alice's data)
== the fix: per-user data in the session ==
A -&gt; SA : setAttribute("name", "Alice")
Bo -&gt; SB : getAttribute("name") is null
SB --&gt; Bo : Hello, stranger
note over S : the container may run A and B at the SAME time:\\nfields = shared + unsafe, local variables = per thread
@enduml</code></pre></details>
<div class="pitfall">Do not "fix" it with <code>synchronized</code> on <code>doGet</code>: the spec (§2.3.3.1) warns against it — every user would wait in one queue, and Bob would <em>still</em> see Alice's name. The data is in the wrong place; locking does not move it.</div>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): <code>@Controller</code> and <code>@Service</code> beans are singletons too — one object for all requests. The same rule applies: no per-user fields; use method parameters, the session, or the database.</div>`,
        `<p class="y-chinh">🎯 Container phục vụ nhiều request cùng lúc: nó chứa bao nhiêu servlet, filter, listener cũng được, chạy mỗi request trên một <strong>luồng (thread)</strong> riêng, và nhiều luồng có thể cùng ở trong một đối tượng một lúc — nên mọi đối tượng trong container phải <strong>an toàn luồng (thread-safe)</strong>.</p>
<p>Đặc tả (Jakarta Servlet 6.0, §2.2) nói container dùng <strong>một đối tượng cho mỗi khai báo servlet</strong>. Một đối tượng, nhiều luồng, nhiều người dùng. Vì thế một <em>trường (field)</em> của đối tượng đó là của chung mọi người. Lỗi đây, chạy thật: Alice mở <code>/chao-sai?name=Alice</code>, rồi Bob mở cùng trang từ một trình duyệt khác, không kèm tên:</p>
<p class="ghi-chu">📄 <code>phien-mot-doi-tuong/src/main/java/demo/GreetFieldServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.atomic.AtomicInteger;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// ❌ Lỗi kinh điển: dữ liệu riêng từng người để trong một TRƯỜNG của servlet
@WebServlet("/chao-sai")
public class GreetFieldServlet extends HttpServlet {
    private static final AtomicInteger CREATED = new AtomicInteger();   // có bao nhiêu đối tượng của lớp này
    private final int objectNo = CREATED.incrementAndGet();

    private String name;   // MỘT trường, mọi người dùng và mọi luồng dùng chung

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (req.getParameter("name") != null) name = req.getParameter("name");
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("Hello, " + (name == null ? "stranger" : name));
        out.println("served by servlet object #" + objectNo + " (objects created: " + CREATED.get() + ")");
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-mot-doi-tuong/chao-sai?name=Alice HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 62

Hello, Alice
served by servlet object #1 (objects created: 1)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-mot-doi-tuong/chao-sai HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 62

Hello, Alice
served by servlet object #1 (objects created: 1)</code></pre>
<p>Bob được chào là Alice, bởi đối tượng servlet #1 — cái duy nhất từng được tạo. Cách sửa: dữ liệu riêng từng người để trong session của chính người đó (slide 14), dữ liệu của một request để trong biến cục bộ (mỗi luồng có ngăn xếp riêng):</p>
<p class="ghi-chu">📄 <code>phien-mot-doi-tuong/src/main/java/demo/GreetSessionServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// ✅ Cách sửa: dữ liệu riêng từng người vào SESSION của người đó, dữ liệu một request vào biến CỤC BỘ
@WebServlet("/chao-dung")
public class GreetSessionServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();
        String name = req.getParameter("name");                 // biến cục bộ: mỗi luồng có bản riêng
        if (name != null) session.setAttribute("name", name);
        Object saved = session.getAttribute("name");
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("Hello, " + (saved == null ? "stranger" : saved));
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-mot-doi-tuong/chao-dung?name=Alice HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/phien-mot-doi-tuong; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 13

Hello, Alice</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-mot-doi-tuong/chao-dung HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/phien-mot-doi-tuong; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 16

Hello, stranger</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/007aac35b3b832e0ce7edee223e9d63e002d9abe.svg" alt="Một đối tượng servlet, hai người dùng: trường dùng chung thì lộ, session thì không" loading="lazy" /><p class="chu-thich">🧩 Một đối tượng servlet, hai người dùng: trường dùng chung thì lộ, session thì không</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 4: one servlet object, many threads (real run of /phien-mot-doi-tuong)
participant "Alice's request\\n(thread A)" as A
participant "GreetFieldServlet\\nobject #1\\nfield: name" as S
participant "Bob's request\\n(thread B, other browser)" as Bo
participant "Session of Alice" as SA
participant "Session of Bob" as SB
== the bug: per-user data in a field ==
A -&gt; S : GET /chao-sai?name=Alice
S -&gt; S : name = "Alice" (shared field)
S --&gt; A : Hello, Alice
Bo -&gt; S : GET /chao-sai (no name)
S --&gt; Bo : Hello, Alice (Bob sees Alice's data)
== the fix: per-user data in the session ==
A -&gt; SA : setAttribute("name", "Alice")
Bo -&gt; SB : getAttribute("name") is null
SB --&gt; Bo : Hello, stranger
note over S : the container may run A and B at the SAME time:\\nfields = shared + unsafe, local variables = per thread
@enduml</code></pre></details>
<div class="pitfall">Đừng "sửa" bằng cách thêm <code>synchronized</code> vào <code>doGet</code>: đặc tả (§2.3.3.1) khuyên không làm vậy — mọi người dùng phải xếp một hàng, mà Bob <em>vẫn</em> thấy tên Alice. Dữ liệu nằm sai chỗ; khoá lại không dời được nó.</div>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): bean <code>@Controller</code> và <code>@Service</code> cũng là singleton — một đối tượng cho mọi request. Luật y hệt: không trường nào chứa dữ liệu riêng từng người; dùng tham số phương thức, session hoặc CSDL.</div>`],
      [5, 'Web Container Model…',
        `<p class="y-chinh">🎯 You are a web <em>component</em> developer, not a web <em>container</em> developer: you consume what the container provides and need to understand its infrastructure only as far as it affects your own application.</p>
<p>What "consume" means in practice: you write against <strong>interfaces</strong> — <code>HttpServletRequest</code>, <code>ServletContext</code>, <code>HttpSession</code> — and the container supplies classes that implement them. This servlet asks Tomcat which classes it really received:</p>
<p class="ghi-chu">📄 <code>phien-mot-doi-tuong/src/main/java/demo/InsideServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletContext;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Slide 5: you code against INTERFACES; the container supplies the real classes
@WebServlet("/ben-trong")
public class InsideServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ServletContext ctx = getServletContext();
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("HttpServletRequest  is really " + req.getClass().getName());
        out.println("HttpServletResponse is really " + resp.getClass().getName());
        out.println("ServletContext      is really " + ctx.getClass().getName());
        out.println("ServletConfig       is really " + getServletConfig().getClass().getName());
        out.println("Servlet API version: " + ctx.getMajorVersion() + "." + ctx.getMinorVersion());
        out.println("Already parsed for you: method=" + req.getMethod() + ", URI=" + req.getRequestURI()
                + ", Host header=" + req.getHeader("Host"));
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-mot-doi-tuong/ben-trong HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 430

HttpServletRequest  is really org.apache.catalina.connector.RequestFacade
HttpServletResponse is really org.apache.catalina.connector.ResponseFacade
ServletContext      is really org.apache.catalina.core.ApplicationContextFacade
ServletConfig       is really org.apache.catalina.core.StandardWrapperFacade
Servlet API version: 6.0
Already parsed for you: method=GET, URI=/phien-mot-doi-tuong/ben-trong, Host header=localhost:8080</code></pre>
<p>Every object is a Tomcat class (<code>org.apache.catalina…Facade</code>) hidden behind the standard interface. That is why the same WAR runs on Tomcat, Jetty or GlassFish, and why you never write <code>new HttpSession()</code>. "Insofar as it affects your application" means: threads (slide 4), one context per app (slide 6), how the session ID travels (slides 16–19). You do not need to know how the Connector parses bytes.</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): Spring Boot hides the container even more — Tomcat is <em>embedded</em> inside your JAR and started by <code>SpringApplication.run</code>. You are still a consumer: <code>server.port</code>, <code>server.servlet.session.timeout</code> in <code>application.properties</code> configure the same Tomcat you meet here.</div>`,
        `<p class="y-chinh">🎯 Bạn là người phát triển <em>thành phần</em> web (web component), không phải người viết <em>container</em>: bạn dùng những gì container cung cấp và chỉ cần hiểu hạ tầng của nó tới mức nó ảnh hưởng tới ứng dụng của chính bạn.</p>
<p>"Dùng (consumer)" trong thực tế nghĩa là: bạn lập trình theo <strong>interface</strong> — <code>HttpServletRequest</code>, <code>ServletContext</code>, <code>HttpSession</code> — còn container đưa các lớp cài đặt chúng. Servlet này hỏi Tomcat xem thực ra nó nhận được lớp nào:</p>
<p class="ghi-chu">📄 <code>phien-mot-doi-tuong/src/main/java/demo/InsideServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletContext;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Slide 5: bạn lập trình theo INTERFACE; container cung cấp lớp thật
@WebServlet("/ben-trong")
public class InsideServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ServletContext ctx = getServletContext();
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("HttpServletRequest  is really " + req.getClass().getName());
        out.println("HttpServletResponse is really " + resp.getClass().getName());
        out.println("ServletContext      is really " + ctx.getClass().getName());
        out.println("ServletConfig       is really " + getServletConfig().getClass().getName());
        out.println("Servlet API version: " + ctx.getMajorVersion() + "." + ctx.getMinorVersion());
        out.println("Already parsed for you: method=" + req.getMethod() + ", URI=" + req.getRequestURI()
                + ", Host header=" + req.getHeader("Host"));
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-mot-doi-tuong/ben-trong HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 430

HttpServletRequest  is really org.apache.catalina.connector.RequestFacade
HttpServletResponse is really org.apache.catalina.connector.ResponseFacade
ServletContext      is really org.apache.catalina.core.ApplicationContextFacade
ServletConfig       is really org.apache.catalina.core.StandardWrapperFacade
Servlet API version: 6.0
Already parsed for you: method=GET, URI=/phien-mot-doi-tuong/ben-trong, Host header=localhost:8080</code></pre>
<p>Đối tượng nào cũng là lớp của Tomcat (<code>org.apache.catalina…Facade</code>) núp sau interface chuẩn. Đó là lý do cùng một file WAR chạy được trên Tomcat, Jetty hay GlassFish, và lý do bạn không bao giờ viết <code>new HttpSession()</code>. "Tới mức ảnh hưởng tới ứng dụng" nghĩa là: luồng (slide 4), mỗi ứng dụng một context (slide 6), mã session đi lại ra sao (slide 16–19). Bạn không cần biết Connector phân tích byte thế nào.</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): Spring Boot giấu container kỹ hơn nữa — Tomcat được <em>nhúng</em> trong file JAR và khởi động bởi <code>SpringApplication.run</code>. Bạn vẫn là người dùng: <code>server.port</code>, <code>server.servlet.session.timeout</code> trong <code>application.properties</code> cấu hình đúng con Tomcat bạn gặp ở đây.</div>`],
      [6, 'ServletContext',
        `<p class="y-chinh">🎯 The picture: one container, one <strong>Connector</strong> receiving requests, and inside it several <strong>contexts</strong>, each holding its own servlets, filters and listeners. One context = one web application = one <code>ServletContext</code> object.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/b6aff0e78b5243d91bb4547e54a263c20263c05f.svg" alt="Slide 6 redrawn with names: the Connector routes by context path; each context has its own ServletContext" loading="lazy" /><p class="chu-thich">🧩 Slide 6 redrawn with names: the Connector routes by context path; each context has its own ServletContext</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 6 redrawn: one Tomcat, one Connector, one ServletContext per web application
left to right direction
node "Tomcat (one JVM)" {
  component "Connector\\n:8080" as CON
  package "context /orders\\n(webapps/orders)" as O {
    component "Servlet" as O1
    component "Servlet" as O2
    component "Servlet" as O3
    component "Filter" as OF
    rectangle "ServletContext\\n(application scope)" as OC
  }
  package "context /catalog\\n(webapps/catalog)" as K {
    component "Servlet" as K1
    component "Filter" as KF
    component "Listener" as KL
    rectangle "ServletContext\\n(application scope)" as KC
  }
}
CON --&gt; O : /orders/...
CON --&gt; K : /catalog/...
O1 ..&gt; OC : share data
O2 ..&gt; OC
K1 ..&gt; KC : share data
KL ..&gt; KC
@enduml</code></pre></details>
<p>How does Tomcat pick the context? By the first part of the path: <code>/orders/…</code> goes to the <em>orders</em> application, <code>/catalog/…</code> to <em>catalog</em>. That first part is the <strong>context path</strong> — the name of the WAR file you deployed (lesson 2.B). Inside a context, the rest of the path is matched against the url-patterns of its servlets.</p>
<table>
<thead><tr><th>Shape on the slide</th><th>What it is</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>Servlet (square)</td><td>answers requests</td><td>2</td></tr>
<tr><td>Filter (circle)</td><td>runs before/after servlets (login check, encoding)</td><td>8.A</td></tr>
<tr><td>Listener (octagon)</td><td>reacts to events: app started, session created…</td><td>8.B</td></tr>
<tr><td>context (rounded box)</td><td>one web application with its ServletContext</td><td>here</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Bức tranh: một container, một <strong>Connector</strong> nhận request, và bên trong có vài <strong>context</strong>, mỗi context chứa servlet, filter, listener của riêng nó. Một context = một ứng dụng web = một đối tượng <code>ServletContext</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/b6aff0e78b5243d91bb4547e54a263c20263c05f.svg" alt="Slide 6 vẽ lại có tên: Connector chia request theo context path; mỗi context có ServletContext riêng" loading="lazy" /><p class="chu-thich">🧩 Slide 6 vẽ lại có tên: Connector chia request theo context path; mỗi context có ServletContext riêng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 6 redrawn: one Tomcat, one Connector, one ServletContext per web application
left to right direction
node "Tomcat (one JVM)" {
  component "Connector\\n:8080" as CON
  package "context /orders\\n(webapps/orders)" as O {
    component "Servlet" as O1
    component "Servlet" as O2
    component "Servlet" as O3
    component "Filter" as OF
    rectangle "ServletContext\\n(application scope)" as OC
  }
  package "context /catalog\\n(webapps/catalog)" as K {
    component "Servlet" as K1
    component "Filter" as KF
    component "Listener" as KL
    rectangle "ServletContext\\n(application scope)" as KC
  }
}
CON --&gt; O : /orders/...
CON --&gt; K : /catalog/...
O1 ..&gt; OC : share data
O2 ..&gt; OC
K1 ..&gt; KC : share data
KL ..&gt; KC
@enduml</code></pre></details>
<p>Tomcat chọn context bằng cách nào? Bằng phần đầu của đường dẫn: <code>/orders/…</code> đi tới ứng dụng <em>orders</em>, <code>/catalog/…</code> tới <em>catalog</em>. Phần đầu đó là <strong>context path</strong> — tên file WAR bạn đã deploy (bài 2.B). Bên trong một context, phần còn lại của đường dẫn được so với url-pattern của các servlet.</p>
<table>
<thead><tr><th>Hình trên slide</th><th>Là gì</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>Servlet (hình vuông)</td><td>trả lời request</td><td>2</td></tr>
<tr><td>Filter (hình tròn)</td><td>chạy trước/sau servlet (kiểm đăng nhập, mã hoá ký tự)</td><td>8.A</td></tr>
<tr><td>Listener (hình bát giác)</td><td>phản ứng với sự kiện: app khởi động, session được tạo…</td><td>8.B</td></tr>
<tr><td>context (khung bo góc)</td><td>một ứng dụng web cùng ServletContext của nó</td><td>ở đây</td></tr>
</tbody>
</table>`],
      [7, 'ServletContext…',
        `<p class="y-chinh">🎯 A container manages many applications; an application is the set of servlets, filters, listeners and static pages that work together. The container loads a context as a group, objects in the same context can easily <strong>share data</strong>, and each context usually is one web application.</p>
<p>"Share data" = the context's attributes, also called <strong>application scope</strong>: <code>getServletContext().setAttribute(name, value)</code> in one component, <code>getAttribute(name)</code> in any other. Below, servlet <code>/ghi</code> stores a value; then a <em>different</em> servlet <code>/doc</code>, called by a <em>different</em> user (a fresh browser, no cookie), reads it:</p>
<p class="ghi-chu">📄 <code>phien-ngu-canh/src/main/java/demo/WriteServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import jakarta.servlet.ServletContext;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Puts a value into the CONTEXT (application scope): every component of this web app can read it
@WebServlet("/ghi")
public class WriteServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ServletContext ctx = getServletContext();
        ctx.setAttribute("featured", req.getParameter("product"));
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().println("Saved in the context: featured = " + ctx.getAttribute("featured"));
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phien-ngu-canh/src/main/java/demo/ReadServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.TreeSet;
import jakarta.servlet.ServletContext;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// ANOTHER servlet, ANOTHER user (no cookie) — same context, so the same data
@WebServlet("/doc")
public class ReadServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ServletContext ctx = getServletContext();
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("context path   : " + ctx.getContextPath());
        out.println("context name   : " + ctx.getServletContextName());
        out.println("featured       : " + ctx.getAttribute("featured"));
        out.println("files at root  : " + new TreeSet&lt;&gt;(ctx.getResourcePaths("/")));
        out.println("other context /orders : " + ctx.getContext("/orders"));   // contexts are isolated
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-ngu-canh/ghi?product=Laptop HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 40

Saved in the context: featured = Laptop</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-ngu-canh/doc HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 165

context path   : /phien-ngu-canh
context name   : catalog
featured       : Laptop
files at root  : [/META-INF/, /WEB-INF/, /intro.html]
other context /orders : null</code></pre>
<p>Three things to notice: (1) Bob sees <code>featured = Laptop</code> although he never sent it — application scope is shared by <strong>all users</strong>; (2) the context name comes from <code>&lt;display-name&gt;</code> in web.xml; (3) <code>getContext("/orders")</code> returns <code>null</code> — contexts are isolated (Tomcat's <code>crossContext</code> is off by default), so two web apps cannot read each other's data this way.</p>
<div class="pitfall">Application scope is for data that is the same for everyone (a category list, settings, a site-wide counter). A cart or the logged-in user there is visible to every visitor — lesson 4.3 tells that story; practice 4.4 exercise 1 shows it running.</div>`,
        `<p class="y-chinh">🎯 Một container quản lý nhiều ứng dụng; một ứng dụng là tập servlet, filter, listener và trang tĩnh cùng làm việc với nhau. Container nạp một context theo cả nhóm, các đối tượng cùng context dễ dàng <strong>dùng chung dữ liệu</strong>, và mỗi context thường là một ứng dụng web.</p>
<p>"Dùng chung dữ liệu" = các attribute của context, còn gọi là <strong>phạm vi application (application scope)</strong>: <code>getServletContext().setAttribute(tên, giá trị)</code> ở một thành phần, <code>getAttribute(tên)</code> ở bất kỳ thành phần nào khác. Dưới đây, servlet <code>/ghi</code> cất một giá trị; rồi một servlet <em>khác</em> là <code>/doc</code>, do một người dùng <em>khác</em> gọi (trình duyệt mới, không cookie), đọc nó:</p>
<p class="ghi-chu">📄 <code>phien-ngu-canh/src/main/java/demo/WriteServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import jakarta.servlet.ServletContext;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Đặt một giá trị vào CONTEXT (phạm vi application): mọi thành phần của ứng dụng web này đọc được
@WebServlet("/ghi")
public class WriteServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ServletContext ctx = getServletContext();
        ctx.setAttribute("featured", req.getParameter("product"));
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().println("Saved in the context: featured = " + ctx.getAttribute("featured"));
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phien-ngu-canh/src/main/java/demo/ReadServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.TreeSet;
import jakarta.servlet.ServletContext;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Servlet KHÁC, người dùng KHÁC (không cookie) — cùng context nên cùng dữ liệu
@WebServlet("/doc")
public class ReadServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ServletContext ctx = getServletContext();
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("context path   : " + ctx.getContextPath());
        out.println("context name   : " + ctx.getServletContextName());
        out.println("featured       : " + ctx.getAttribute("featured"));
        out.println("files at root  : " + new TreeSet&lt;&gt;(ctx.getResourcePaths("/")));
        out.println("other context /orders : " + ctx.getContext("/orders"));   // các context tách biệt nhau
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-ngu-canh/ghi?product=Laptop HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 40

Saved in the context: featured = Laptop</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-ngu-canh/doc HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 165

context path   : /phien-ngu-canh
context name   : catalog
featured       : Laptop
files at root  : [/META-INF/, /WEB-INF/, /intro.html]
other context /orders : null</code></pre>
<p>Ba điều cần thấy: (1) Bob thấy <code>featured = Laptop</code> dù chưa từng gửi nó — phạm vi application là của chung <strong>mọi người dùng</strong>; (2) tên context lấy từ <code>&lt;display-name&gt;</code> trong web.xml; (3) <code>getContext("/orders")</code> trả <code>null</code> — các context tách biệt nhau (thuộc tính <code>crossContext</code> của Tomcat mặc định tắt), nên hai ứng dụng web không đọc dữ liệu của nhau theo cách này.</p>
<div class="pitfall">Phạm vi application dành cho dữ liệu ai cũng như ai (danh sách danh mục, cấu hình, bộ đếm toàn site). Để giỏ hàng hay người đang đăng nhập ở đó là mọi khách đều thấy — bài 4.3 kể chuyện này; bài thực hành 4.4 bài 1 cho xem nó chạy thật.</div>`],
      [8, 'ServletContext…',
        `<p class="y-chinh">🎯 The folder layout under <code>webapps</code> describes two contexts, <em>orders</em> and <em>catalog</em>; each has its own <code>WEB-INF/web.xml</code>, and <em>catalog</em> also contains a static page <code>intro.html</code>.</p>
<p>The slide draws the tree with Windows backslashes (<code>\\orders</code>) and pushes catalog's <code>web.xml</code> far to the right — read it simply as <code>webapps/catalog/WEB-INF/web.xml</code>. Our app <code>phien-ngu-canh</code> plays the role of <em>catalog</em> (its display-name is "catalog"); here is what Tomcat deployed and how its static page is served:</p>
<p class="ghi-chu">📦 Inside the <code>phien-ngu-canh.war</code> the generator built and deployed (<code>jar tf</code>, sorted)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/demo/<br>
WEB-INF/classes/demo/ReadServlet.class<br>
WEB-INF/classes/demo/WriteServlet.class<br>
WEB-INF/web.xml<br>
intro.html</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-ngu-canh/intro.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"206-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 206

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;Catalog&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Catalog&lt;/h1&gt;
    &lt;p&gt;A static page inside the context — slide 8's intro.html.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Compare with the <code>files at root</code> line printed by <code>/doc</code> on slide 7: <code>[/META-INF/, /WEB-INF/, /intro.html]</code> — <code>getResourcePaths("/")</code> lists exactly this tree. <code>intro.html</code> is public (200 above); everything under <code>WEB-INF</code> is private (slide 10 shows the 404).</p>
<table>
<thead><tr><th>Folder</th><th>Context path</th><th>Example URL</th></tr></thead>
<tbody>
<tr><td><code>webapps/orders/</code></td><td><code>/orders</code></td><td><code>http://localhost:8080/orders/…</code></td></tr>
<tr><td><code>webapps/catalog/</code></td><td><code>/catalog</code></td><td><code>http://localhost:8080/catalog/intro.html</code></td></tr>
<tr><td><code>webapps/ROOT/</code></td><td>empty</td><td><code>http://localhost:8080/</code></td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Bố cục thư mục dưới <code>webapps</code> mô tả hai context, <em>orders</em> và <em>catalog</em>; mỗi cái có <code>WEB-INF/web.xml</code> riêng, và <em>catalog</em> còn chứa một trang tĩnh <code>intro.html</code>.</p>
<p>Slide vẽ cây thư mục bằng gạch ngược kiểu Windows (<code>\\orders</code>) và đẩy <code>web.xml</code> của catalog sang tận bên phải — cứ đọc đơn giản là <code>webapps/catalog/WEB-INF/web.xml</code>. Ứng dụng <code>phien-ngu-canh</code> của ta đóng vai <em>catalog</em> (display-name là "catalog"); đây là những gì Tomcat đã deploy và cách trang tĩnh của nó được phục vụ:</p>
<p class="ghi-chu">📦 Bên trong <code>phien-ngu-canh.war</code> mà generator đã đóng và deploy (<code>jar tf</code>, sắp xếp)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/demo/<br>
WEB-INF/classes/demo/ReadServlet.class<br>
WEB-INF/classes/demo/WriteServlet.class<br>
WEB-INF/web.xml<br>
intro.html</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-ngu-canh/intro.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"206-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 206

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;Catalog&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Catalog&lt;/h1&gt;
    &lt;p&gt;A static page inside the context — slide 8's intro.html.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>So với dòng <code>files at root</code> mà <code>/doc</code> in ra ở slide 7: <code>[/META-INF/, /WEB-INF/, /intro.html]</code> — <code>getResourcePaths("/")</code> liệt kê đúng cây này. <code>intro.html</code> là công khai (200 ở trên); mọi thứ trong <code>WEB-INF</code> là riêng tư (slide 10 cho xem 404).</p>
<table>
<thead><tr><th>Thư mục</th><th>Context path</th><th>URL ví dụ</th></tr></thead>
<tbody>
<tr><td><code>webapps/orders/</code></td><td><code>/orders</code></td><td><code>http://localhost:8080/orders/…</code></td></tr>
<tr><td><code>webapps/catalog/</code></td><td><code>/catalog</code></td><td><code>http://localhost:8080/catalog/intro.html</code></td></tr>
<tr><td><code>webapps/ROOT/</code></td><td>rỗng</td><td><code>http://localhost:8080/</code></td></tr>
</tbody>
</table>`],
      [9, 'ServletContext Initialization Parameters',
        `<p class="y-chinh">🎯 The question this part answers: how do you make some basic information (a machine name, a file path, an e-mail address) available to <strong>all</strong> the servlets and JSPs of your web application without writing it into each one?</p>
<p>Answer (slides 10–11): a <strong>context initialization parameter</strong> — a name/value pair declared once in web.xml with <code>&lt;context-param&gt;</code> and read by any component through the ServletContext. Compare with what you already know:</p>
<table>
<thead><tr><th></th><th>context-param</th><th>init-param (slides 12–13)</th><th>request parameter</th></tr></thead>
<tbody>
<tr><td>Written by</td><td>the developer, in web.xml</td><td>the developer, in web.xml or @WebInitParam</td><td>the user, in a form or URL</td></tr>
<tr><td>Belongs to</td><td>the whole web app</td><td>ONE servlet (or filter)</td><td>ONE request</td></tr>
<tr><td>Read with</td><td><code>getServletContext().getInitParameter("x")</code></td><td><code>getServletConfig().getInitParameter("x")</code></td><td><code>request.getParameter("x")</code></td></tr>
<tr><td>Can change at run time?</td><td>no (read-only)</td><td>no</td><td>every request</td></tr>
</tbody>
</table>
<p class="meo">🧠 "Init" parameters are read-only configuration; "attributes" (slide 7) are values you set and change while the app runs. Different words, different methods: <code>getInitParameter</code> vs <code>getAttribute</code>.</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): the same need is met by <code>application.properties</code> (<code>app.machine-name=GERALDINE</code>) read with <code>@Value</code> or <code>@ConfigurationProperties</code>; secrets come from environment variables, not from a file in the project.</div>`,
        `<p class="y-chinh">🎯 Câu hỏi phần này trả lời: làm sao để vài thông tin cơ bản (tên máy, một đường dẫn file, một địa chỉ email) có sẵn cho <strong>mọi</strong> servlet và JSP của ứng dụng web mà không phải viết vào từng cái?</p>
<p>Trả lời (slide 10–11): một <strong>tham số khởi tạo của context (context initialization parameter)</strong> — cặp tên/giá trị khai một lần trong web.xml bằng <code>&lt;context-param&gt;</code> và mọi thành phần đọc qua ServletContext. So với những thứ bạn đã biết:</p>
<table>
<thead><tr><th></th><th>context-param</th><th>init-param (slide 12–13)</th><th>tham số request</th></tr></thead>
<tbody>
<tr><td>Ai viết</td><td>lập trình viên, trong web.xml</td><td>lập trình viên, trong web.xml hoặc @WebInitParam</td><td>người dùng, trong form hoặc URL</td></tr>
<tr><td>Thuộc về</td><td>cả ứng dụng web</td><td>MỘT servlet (hoặc filter)</td><td>MỘT request</td></tr>
<tr><td>Đọc bằng</td><td><code>getServletContext().getInitParameter("x")</code></td><td><code>getServletConfig().getInitParameter("x")</code></td><td><code>request.getParameter("x")</code></td></tr>
<tr><td>Đổi được khi đang chạy?</td><td>không (chỉ đọc)</td><td>không</td><td>mỗi request một khác</td></tr>
</tbody>
</table>
<p class="meo">🧠 Tham số "init" là cấu hình chỉ đọc; "attribute" (slide 7) là giá trị bạn đặt và đổi khi app đang chạy. Khác chữ, khác phương thức: <code>getInitParameter</code> khác <code>getAttribute</code>.</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): nhu cầu này được đáp bằng <code>application.properties</code> (<code>app.machine-name=GERALDINE</code>) đọc qua <code>@Value</code> hoặc <code>@ConfigurationProperties</code>; bí mật lấy từ biến môi trường, không để trong file của project.</div>`],
      [10, 'ServletContext Initialization Parameters…',
        `<p class="y-chinh">🎯 Setting up web.xml: each <code>&lt;context-param&gt;</code> directly under <code>&lt;web-app&gt;</code> holds one <code>&lt;param-name&gt;</code> and one <code>&lt;param-value&gt;</code>; the slide declares <code>machineName = GERALDINE</code> and <code>secretParameterFile = /WEB-INF/xml/secretParms.xml</code>, read with <code>ServletContext.getInitParameter()</code>.</p>
<div class="pitfall">⚠️ The slide's XML is broken: line 4 ends with <code>&lt;/param-value</code> — the closing <code>&gt;</code> is missing. Copied as it is, web.xml is not well-formed and Tomcat refuses to start the whole application. A real XML parser, given the slide's lines character for character:</div>
<pre class="trich"><code class="language-java">// Slide 10, line 4: "&lt;/param-value" has no closing "&gt;"
String slide10 = """
    &lt;web-app&gt;
      &lt;context-param&gt;
        &lt;param-name&gt;machineName&lt;/param-name&gt;
        &lt;param-value&gt;GERALDINE&lt;/param-value
      &lt;/context-param&gt;
    &lt;/web-app&gt;
    """;
try {
    DocumentBuilderFactory.newInstance().newDocumentBuilder()
        .parse(new ByteArrayInputStream(slide10.getBytes(StandardCharsets.UTF_8)));
    System.out.println("slide 10: well-formed");
} catch (SAXParseException e) {
    System.out.println("slide 10 web.xml -&gt; line " + e.getLineNumber() + ": " + e.getMessage());
}</code></pre>
<div class="out">slide 10 web.xml -&gt; line 5: The end-tag for element type "param-value" must end with a '&gt;' delimiter.<br>
slide 13 code compiles? false<br>
&nbsp;&nbsp;line 6: illegal character: '\\u201c'<br>
&nbsp;&nbsp;line 6: unclosed string literal<br>
&nbsp;&nbsp;line 6: not a statement</div>
<p>The parser reports line 5 because it only notices the problem when it reaches the next <code>&lt;</code>. The corrected descriptor used by the running app:</p>
<p class="ghi-chu">📄 <code>phien-tham-so/src/main/webapp/WEB-INF/web.xml</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-xml">&lt;!-- Slide 10: for the WHOLE application → ServletContext.getInitParameter() --&gt;
&lt;context-param&gt;
    &lt;param-name&gt;machineName&lt;/param-name&gt;
    &lt;param-value&gt;GERALDINE&lt;/param-value&gt;
&lt;/context-param&gt;
&lt;context-param&gt;
    &lt;param-name&gt;secretParameterFile&lt;/param-name&gt;
    &lt;param-value&gt;/WEB-INF/xml/secretParms.xml&lt;/param-value&gt;
&lt;/context-param&gt;</code></pre>
<p>Why point to <code>/WEB-INF/xml/…</code>? Files under <code>WEB-INF</code> can be read by your code (slide 11 does) but never downloaded by a browser:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-tham-so/WEB-INF/xml/secretParms.xml HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 683

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>`,
        `<p class="y-chinh">🎯 Khai trong web.xml: mỗi <code>&lt;context-param&gt;</code> nằm ngay dưới <code>&lt;web-app&gt;</code>, chứa một <code>&lt;param-name&gt;</code> và một <code>&lt;param-value&gt;</code>; slide khai <code>machineName = GERALDINE</code> và <code>secretParameterFile = /WEB-INF/xml/secretParms.xml</code>, đọc bằng <code>ServletContext.getInitParameter()</code>.</p>
<div class="pitfall">⚠️ XML trên slide bị hỏng: dòng 4 kết thúc bằng <code>&lt;/param-value</code> — thiếu dấu <code>&gt;</code> đóng. Chép y nguyên thì web.xml không hợp lệ (not well-formed) và Tomcat từ chối khởi động cả ứng dụng. Một bộ phân tích XML thật, được đưa đúng từng ký tự các dòng của slide:</div>
<pre class="trich"><code class="language-java">// Slide 10, dòng 4: "&lt;/param-value" thiếu dấu "&gt;" đóng
String slide10 = """
    &lt;web-app&gt;
      &lt;context-param&gt;
        &lt;param-name&gt;machineName&lt;/param-name&gt;
        &lt;param-value&gt;GERALDINE&lt;/param-value
      &lt;/context-param&gt;
    &lt;/web-app&gt;
    """;
try {
    DocumentBuilderFactory.newInstance().newDocumentBuilder()
        .parse(new ByteArrayInputStream(slide10.getBytes(StandardCharsets.UTF_8)));
    System.out.println("slide 10: well-formed");
} catch (SAXParseException e) {
    System.out.println("slide 10 web.xml -&gt; line " + e.getLineNumber() + ": " + e.getMessage());
}</code></pre>
<div class="out">slide 10 web.xml -&gt; line 5: The end-tag for element type "param-value" must end with a '&gt;' delimiter.<br>
slide 13 code compiles? false<br>
&nbsp;&nbsp;line 6: illegal character: '\\u201c'<br>
&nbsp;&nbsp;line 6: unclosed string literal<br>
&nbsp;&nbsp;line 6: not a statement</div>
<p>Bộ phân tích báo dòng 5 vì nó chỉ nhận ra lỗi khi gặp dấu <code>&lt;</code> kế tiếp. Descriptor đã sửa mà ứng dụng chạy thật dùng:</p>
<p class="ghi-chu">📄 <code>phien-tham-so/src/main/webapp/WEB-INF/web.xml</code> (trích)</p>
<pre class="web-src trich"><code class="language-xml">&lt;!-- Slide 10: cho CẢ ứng dụng → ServletContext.getInitParameter() --&gt;
&lt;context-param&gt;
    &lt;param-name&gt;machineName&lt;/param-name&gt;
    &lt;param-value&gt;GERALDINE&lt;/param-value&gt;
&lt;/context-param&gt;
&lt;context-param&gt;
    &lt;param-name&gt;secretParameterFile&lt;/param-name&gt;
    &lt;param-value&gt;/WEB-INF/xml/secretParms.xml&lt;/param-value&gt;
&lt;/context-param&gt;</code></pre>
<p>Vì sao trỏ vào <code>/WEB-INF/xml/…</code>? File trong <code>WEB-INF</code> thì code của bạn đọc được (slide 11 đọc) nhưng trình duyệt không bao giờ tải về được:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-tham-so/WEB-INF/xml/secretParms.xml HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 683

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>`],
      [11, 'ServletContext Initialization Parameters…',
        `<p class="y-chinh">🎯 Reading them: get the ServletContext with <code>getServletContext()</code>, then <code>sc.getInitParameter("machineName")</code> and <code>sc.getInitParameter("secretParameterFile")</code> — always a <code>String</code>, or <code>null</code> if the name is not declared.</p>
<p>The servlet below is the slides' code (slides 11 and 13) in one <code>doGet</code>, plus two deliberate mistakes and a use of the file path:</p>
<p class="ghi-chu">📄 <code>phien-tham-so/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;!-- Slide 10: for the WHOLE application → ServletContext.getInitParameter() --&gt;
    &lt;context-param&gt;
        &lt;param-name&gt;machineName&lt;/param-name&gt;
        &lt;param-value&gt;GERALDINE&lt;/param-value&gt;
    &lt;/context-param&gt;
    &lt;context-param&gt;
        &lt;param-name&gt;secretParameterFile&lt;/param-name&gt;
        &lt;param-value&gt;/WEB-INF/xml/secretParms.xml&lt;/param-value&gt;
    &lt;/context-param&gt;

    &lt;!-- Slide 12: for ONE servlet → ServletConfig.getInitParameter() --&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;InitParamaters&lt;/servlet-name&gt;
        &lt;servlet-class&gt;InitParamaters&lt;/servlet-class&gt;
        &lt;init-param&gt;
            &lt;param-name&gt;name&lt;/param-name&gt;
            &lt;param-value&gt;FPT University&lt;/param-value&gt;
        &lt;/init-param&gt;
    &lt;/servlet&gt;
    &lt;!-- Not on the slide, but without a mapping the servlet has no URL --&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;InitParamaters&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/InitParamaters&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
&lt;/web-app&gt;</code></pre>
<p class="ghi-chu">📄 <code>phien-tham-so/src/main/java/InitParamaters.java</code></p>
<pre class="web-src"><code class="language-java">import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// The slides' class name, typo included ("Paramaters"): it only has to match &lt;servlet-class&gt;
public class InitParamaters extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // Slide 11: ServletContext → context-param
        ServletContext sc = getServletContext();
        String database = sc.getInitParameter("machineName");
        String secret = sc.getInitParameter("secretParameterFile");
        // Slide 13 (straight quotes — the slide has a curly “ that does not compile)
        ServletConfig cfg = getServletConfig();
        String name = cfg.getInitParameter("name");

        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("context-param machineName         = " + database);
        out.println("context-param secretParameterFile = " + secret);
        out.println("init-param    name                = " + name);
        out.println("--- asking the WRONG object returns null ---");
        out.println("ServletContext.getInitParameter(\\"name\\")        = " + sc.getInitParameter("name"));
        out.println("ServletConfig.getInitParameter(\\"machineName\\")  = " + cfg.getInitParameter("machineName"));
        out.println("--- the file named by secretParameterFile, read on the server ---");
        try (InputStream in = sc.getResourceAsStream(secret)) {   // a path INSIDE the app, starting with /
            out.print(new String(in.readAllBytes(), StandardCharsets.UTF_8));
        }
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-tham-so/InitParamaters HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 485

context-param machineName         = GERALDINE
context-param secretParameterFile = /WEB-INF/xml/secretParms.xml
init-param    name                = FPT University
--- asking the WRONG object returns null ---
ServletContext.getInitParameter("name")        = null
ServletConfig.getInitParameter("machineName")  = null
--- the file named by secretParameterFile, read on the server ---
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;secret&gt;
    &lt;apiKey&gt;demo-key-only-for-PRJ301&lt;/apiKey&gt;
&lt;/secret&gt;</code></pre>
<p>Read the response line by line. Lines 1–3 are the three values. Lines 5–6 ask the <strong>wrong object</strong> and get <code>null</code> — no exception, no warning, which is why this mistake survives until the demo. The last lines are the content of <code>secretParms.xml</code>, opened with <code>getResourceAsStream(path)</code>: a path inside the app, starting with <code>/</code>, that works the same in NetBeans, in a WAR and on a server.</p>
<div class="pitfall">FE trap (FE question type): "a parameter declared with &lt;context-param&gt; is accessible to…" → <strong>all servlets of this web application</strong> — not "all applications of the container" and not "only the servlet it is defined for".</div>
<p class="nhan">➕ Beyond the slide</p>
<p>The value is a String — convert it yourself (<code>Integer.parseInt</code>) and read it once, in <code>init()</code> or a <code>ServletContextListener</code> (Chapter 8), not on every request.</p>`,
        `<p class="y-chinh">🎯 Đọc chúng: lấy ServletContext bằng <code>getServletContext()</code>, rồi <code>sc.getInitParameter("machineName")</code> và <code>sc.getInitParameter("secretParameterFile")</code> — luôn là <code>String</code>, hoặc <code>null</code> nếu tên đó chưa được khai.</p>
<p>Servlet dưới đây là code của slide (slide 11 và 13) gộp trong một <code>doGet</code>, thêm hai lỗi cố ý và một lần dùng đường dẫn file:</p>
<p class="ghi-chu">📄 <code>phien-tham-so/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;!-- Slide 10: cho CẢ ứng dụng → ServletContext.getInitParameter() --&gt;
    &lt;context-param&gt;
        &lt;param-name&gt;machineName&lt;/param-name&gt;
        &lt;param-value&gt;GERALDINE&lt;/param-value&gt;
    &lt;/context-param&gt;
    &lt;context-param&gt;
        &lt;param-name&gt;secretParameterFile&lt;/param-name&gt;
        &lt;param-value&gt;/WEB-INF/xml/secretParms.xml&lt;/param-value&gt;
    &lt;/context-param&gt;

    &lt;!-- Slide 12: cho MỘT servlet → ServletConfig.getInitParameter() --&gt;
    &lt;servlet&gt;
        &lt;servlet-name&gt;InitParamaters&lt;/servlet-name&gt;
        &lt;servlet-class&gt;InitParamaters&lt;/servlet-class&gt;
        &lt;init-param&gt;
            &lt;param-name&gt;name&lt;/param-name&gt;
            &lt;param-value&gt;FPT University&lt;/param-value&gt;
        &lt;/init-param&gt;
    &lt;/servlet&gt;
    &lt;!-- Slide không có, nhưng thiếu mapping thì servlet không có URL nào --&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;InitParamaters&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/InitParamaters&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
&lt;/web-app&gt;</code></pre>
<p class="ghi-chu">📄 <code>phien-tham-so/src/main/java/InitParamaters.java</code></p>
<pre class="web-src"><code class="language-java">import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Tên lớp của slide, giữ cả lỗi chính tả ("Paramaters"): chỉ cần khớp &lt;servlet-class&gt;
public class InitParamaters extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // Slide 11: ServletContext → context-param
        ServletContext sc = getServletContext();
        String database = sc.getInitParameter("machineName");
        String secret = sc.getInitParameter("secretParameterFile");
        // Slide 13 (ngoặc thẳng — slide có ngoặc cong “ không biên dịch được)
        ServletConfig cfg = getServletConfig();
        String name = cfg.getInitParameter("name");

        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("context-param machineName         = " + database);
        out.println("context-param secretParameterFile = " + secret);
        out.println("init-param    name                = " + name);
        out.println("--- asking the WRONG object returns null ---");
        out.println("ServletContext.getInitParameter(\\"name\\")        = " + sc.getInitParameter("name"));
        out.println("ServletConfig.getInitParameter(\\"machineName\\")  = " + cfg.getInitParameter("machineName"));
        out.println("--- the file named by secretParameterFile, read on the server ---");
        try (InputStream in = sc.getResourceAsStream(secret)) {   // đường dẫn TRONG ứng dụng, bắt đầu bằng /
            out.print(new String(in.readAllBytes(), StandardCharsets.UTF_8));
        }
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-tham-so/InitParamaters HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 485

context-param machineName         = GERALDINE
context-param secretParameterFile = /WEB-INF/xml/secretParms.xml
init-param    name                = FPT University
--- asking the WRONG object returns null ---
ServletContext.getInitParameter("name")        = null
ServletConfig.getInitParameter("machineName")  = null
--- the file named by secretParameterFile, read on the server ---
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;secret&gt;
    &lt;apiKey&gt;demo-key-only-for-PRJ301&lt;/apiKey&gt;
&lt;/secret&gt;</code></pre>
<p>Đọc response từng dòng. Dòng 1–3 là ba giá trị. Dòng 5–6 hỏi <strong>nhầm đối tượng</strong> và nhận <code>null</code> — không exception, không cảnh báo, nên lỗi này sống sót tới tận buổi demo. Mấy dòng cuối là nội dung <code>secretParms.xml</code>, mở bằng <code>getResourceAsStream(path)</code>: đường dẫn trong ứng dụng, bắt đầu bằng <code>/</code>, chạy như nhau trong NetBeans, trong WAR và trên server.</p>
<div class="pitfall">Bẫy FE (dạng câu FE): "một tham số khai bằng &lt;context-param&gt; thì truy cập được bởi…" → <strong>mọi servlet của ứng dụng web này</strong> — không phải "mọi ứng dụng của container", cũng không phải "chỉ servlet khai nó".</div>
<p class="nhan">➕ Mở rộng ngoài slide</p>
<p>Giá trị là String — tự đổi kiểu (<code>Integer.parseInt</code>) và đọc một lần, trong <code>init()</code> hoặc một <code>ServletContextListener</code> (Chương 8), đừng đọc lại ở mỗi request.</p>`],
      [12, 'ServletConfig Initialization Parameters',
        `<p class="y-chinh">🎯 A parameter for <strong>one</strong> servlet goes inside its <code>&lt;servlet&gt;</code> element as <code>&lt;init-param&gt;</code>; the slide gives servlet <code>InitParamaters</code> the parameter <code>name = FPT University</code>, read with <code>ServletConfig.getInitParameter()</code>.</p>
<p class="ghi-chu">📄 <code>phien-tham-so/src/main/webapp/WEB-INF/web.xml</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-xml">&lt;!-- Slide 12: for ONE servlet → ServletConfig.getInitParameter() --&gt;
&lt;servlet&gt;
    &lt;servlet-name&gt;InitParamaters&lt;/servlet-name&gt;
    &lt;servlet-class&gt;InitParamaters&lt;/servlet-class&gt;
    &lt;init-param&gt;
        &lt;param-name&gt;name&lt;/param-name&gt;
        &lt;param-value&gt;FPT University&lt;/param-value&gt;
    &lt;/init-param&gt;
&lt;/servlet&gt;
&lt;!-- Not on the slide, but without a mapping the servlet has no URL --&gt;
&lt;servlet-mapping&gt;
    &lt;servlet-name&gt;InitParamaters&lt;/servlet-name&gt;
    &lt;url-pattern&gt;/InitParamaters&lt;/url-pattern&gt;
&lt;/servlet-mapping&gt;</code></pre>
<p>Two remarks on the slide's version. "Paramaters" is misspelled, but consistently — servlet-name and servlet-class only have to match each other and the Java class, so it works (the running app keeps the slide's spelling). And the slide has no <code>&lt;servlet-mapping&gt;</code>: without one the servlet is declared but has no URL, so nobody can call it. The app adds <code>/InitParamaters</code>.</p>
<p>Since Servlet 3.0 the same thing can be written with annotations. <code>OtherServlet</code> declares its own <code>name</code>; it still sees the shared context-params, and it does <em>not</em> see InitParamaters' value:</p>
<p class="ghi-chu">📄 <code>phien-tham-so/src/main/java/demo/OtherServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebInitParam;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Another servlet of the same app: it sees the context-params, but NOT InitParamaters' init-param
@WebServlet(urlPatterns = "/other", initParams = @WebInitParam(name = "name", value = "Other servlet's own value"))
public class OtherServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("machineName (context-param, shared) = " + getServletContext().getInitParameter("machineName"));
        out.println("name (my own init-param)            = " + getInitParameter("name"));   // GenericServlet shortcut for getServletConfig().getInitParameter
        out.println("all context-param names             = " + new java.util.TreeSet&lt;&gt;(java.util.Collections.list(getServletContext().getInitParameterNames())));
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-tham-so/other HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 185

machineName (context-param, shared) = GERALDINE
name (my own init-param)            = Other servlet's own value
all context-param names             = [machineName, secretParameterFile]</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/a8d1a3ca23cc4dd8f86942a7fa0c11dff3df0029.svg" alt="One ServletContext for the app, one ServletConfig per servlet" loading="lazy" /><p class="chu-thich">🧩 One ServletContext for the app, one ServletConfig per servlet</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 9-13: where each init parameter lives (real app /phien-tham-so)
left to right direction
rectangle "WEB-INF/web.xml" as X {
  rectangle "&lt;context-param&gt;\\nmachineName = GERALDINE\\nsecretParameterFile = /WEB-INF/xml/secretParms.xml" as CP
  rectangle "&lt;servlet&gt; InitParamaters\\n  &lt;init-param&gt; name = FPT University" as IP
}
rectangle ANN [
@WebServlet("/other")
initParams: name = Other servlet's own value
]
rectangle "ServletContext\\n(ONE per web app)" as SC
rectangle "ServletConfig of InitParamaters" as CFG1
rectangle "ServletConfig of OtherServlet" as CFG2
CP --&gt; SC : getServletContext()\\n.getInitParameter(...)
IP --&gt; CFG1 : getServletConfig()\\n.getInitParameter("name")
ANN --&gt; CFG2 : getInitParameter("name")
CFG1 ..&gt; SC : config.getServletContext()
CFG2 ..&gt; SC : (same object for every servlet)
@enduml</code></pre></details>`,
        `<p class="y-chinh">🎯 Tham số cho <strong>một</strong> servlet đặt trong phần tử <code>&lt;servlet&gt;</code> của nó dưới dạng <code>&lt;init-param&gt;</code>; slide cho servlet <code>InitParamaters</code> tham số <code>name = FPT University</code>, đọc bằng <code>ServletConfig.getInitParameter()</code>.</p>
<p class="ghi-chu">📄 <code>phien-tham-so/src/main/webapp/WEB-INF/web.xml</code> (trích)</p>
<pre class="web-src trich"><code class="language-xml">&lt;!-- Slide 12: cho MỘT servlet → ServletConfig.getInitParameter() --&gt;
&lt;servlet&gt;
    &lt;servlet-name&gt;InitParamaters&lt;/servlet-name&gt;
    &lt;servlet-class&gt;InitParamaters&lt;/servlet-class&gt;
    &lt;init-param&gt;
        &lt;param-name&gt;name&lt;/param-name&gt;
        &lt;param-value&gt;FPT University&lt;/param-value&gt;
    &lt;/init-param&gt;
&lt;/servlet&gt;
&lt;!-- Slide không có, nhưng thiếu mapping thì servlet không có URL nào --&gt;
&lt;servlet-mapping&gt;
    &lt;servlet-name&gt;InitParamaters&lt;/servlet-name&gt;
    &lt;url-pattern&gt;/InitParamaters&lt;/url-pattern&gt;
&lt;/servlet-mapping&gt;</code></pre>
<p>Hai nhận xét về bản trên slide. "Paramaters" sai chính tả, nhưng sai nhất quán — servlet-name và servlet-class chỉ cần khớp nhau và khớp lớp Java, nên vẫn chạy (ứng dụng chạy thật giữ nguyên cách viết của slide). Và slide không có <code>&lt;servlet-mapping&gt;</code>: thiếu nó thì servlet được khai nhưng không có URL nào, chẳng ai gọi được. Ứng dụng thêm <code>/InitParamaters</code>.</p>
<p>Từ Servlet 3.0 có thể viết điều tương tự bằng annotation. <code>OtherServlet</code> khai <code>name</code> của riêng nó; nó vẫn thấy các context-param dùng chung, và <em>không</em> thấy giá trị của InitParamaters:</p>
<p class="ghi-chu">📄 <code>phien-tham-so/src/main/java/demo/OtherServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebInitParam;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Một servlet khác cùng ứng dụng: thấy context-param, KHÔNG thấy init-param của InitParamaters
@WebServlet(urlPatterns = "/other", initParams = @WebInitParam(name = "name", value = "Other servlet's own value"))
public class OtherServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("machineName (context-param, shared) = " + getServletContext().getInitParameter("machineName"));
        out.println("name (my own init-param)            = " + getInitParameter("name"));   // lối tắt của GenericServlet cho getServletConfig().getInitParameter
        out.println("all context-param names             = " + new java.util.TreeSet&lt;&gt;(java.util.Collections.list(getServletContext().getInitParameterNames())));
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-tham-so/other HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 185

machineName (context-param, shared) = GERALDINE
name (my own init-param)            = Other servlet's own value
all context-param names             = [machineName, secretParameterFile]</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/a8d1a3ca23cc4dd8f86942a7fa0c11dff3df0029.svg" alt="Một ServletContext cho cả ứng dụng, mỗi servlet một ServletConfig" loading="lazy" /><p class="chu-thich">🧩 Một ServletContext cho cả ứng dụng, mỗi servlet một ServletConfig</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 9-13: where each init parameter lives (real app /phien-tham-so)
left to right direction
rectangle "WEB-INF/web.xml" as X {
  rectangle "&lt;context-param&gt;\\nmachineName = GERALDINE\\nsecretParameterFile = /WEB-INF/xml/secretParms.xml" as CP
  rectangle "&lt;servlet&gt; InitParamaters\\n  &lt;init-param&gt; name = FPT University" as IP
}
rectangle ANN [
@WebServlet("/other")
initParams: name = Other servlet's own value
]
rectangle "ServletContext\\n(ONE per web app)" as SC
rectangle "ServletConfig of InitParamaters" as CFG1
rectangle "ServletConfig of OtherServlet" as CFG2
CP --&gt; SC : getServletContext()\\n.getInitParameter(...)
IP --&gt; CFG1 : getServletConfig()\\n.getInitParameter("name")
ANN --&gt; CFG2 : getInitParameter("name")
CFG1 ..&gt; SC : config.getServletContext()
CFG2 ..&gt; SC : (same object for every servlet)
@enduml</code></pre></details>`],
      [13, 'ServletConfig Initialization Parameters…',
        `<p class="y-chinh">🎯 Reading it: <code>ServletConfig sc = getServletConfig();</code> then <code>sc.getInitParameter("name")</code> — which returned <code>FPT University</code> in the run on slide 11.</p>
<div class="pitfall">⚠️ The slide's second line does not compile: it opens the string with a curly quote <code>“</code> (U+201C, inserted by PowerPoint's auto-format) and closes it with a straight one. The real Java compiler, given that line:</div>
<pre class="trich"><code class="language-java">// Slide 13, line 2: the first quote is a curly “ (U+201C) pasted from a word processor
String slide13 = """
    interface ServletConfig { String getInitParameter(String name); }
    class Slide13 {
        ServletConfig getServletConfig() { return null; }
        void read() {
            ServletConfig sc = getServletConfig();
            String name = sc.getInitParameter(“name");
        }
    }
    """;
JavaCompiler javac = ToolProvider.getSystemJavaCompiler();
DiagnosticCollector&lt;JavaFileObject&gt; errors = new DiagnosticCollector&lt;&gt;();
JavaFileObject src = new SimpleJavaFileObject(URI.create("string:///Slide13.java"), JavaFileObject.Kind.SOURCE) {
    @Override public CharSequence getCharContent(boolean ignore) { return slide13; }
};
String out = Files.createTempDirectory("slide13").toString();
boolean ok = javac.getTask(null, null, errors, List.of("-d", out), null, List.of(src)).call();
System.out.println("slide 13 code compiles? " + ok);
errors.getDiagnostics().forEach(d -&gt;
    System.out.println("  line " + d.getLineNumber() + ": " + d.getMessage(Locale.ENGLISH)));</code></pre>
<div class="out">slide 10 web.xml -&gt; line 5: The end-tag for element type "param-value" must end with a '&gt;' delimiter.<br>
slide 13 code compiles? false<br>
&nbsp;&nbsp;line 6: illegal character: '\\u201c'<br>
&nbsp;&nbsp;line 6: unclosed string literal<br>
&nbsp;&nbsp;line 6: not a statement</div>
<p>"illegal character: '“'" is the message to recognise: it always means a curly quote or another typographic character pasted from a slide, Word or a chat. Retype the quotes in the IDE.</p>
<p><code>getInitParameter("name")</code> without <code>getServletConfig()</code> also works inside a servlet: <code>GenericServlet</code> (the parent of <code>HttpServlet</code>) forwards it to the config — that is the shortcut <code>OtherServlet</code> used. The config object exists only after <code>init(ServletConfig)</code>, so do not read it in the constructor.</p>
<div class="pitfall">FE trap (FE question type): "which code reads the &lt;init-param&gt; of this servlet?" → <code>getServletConfig().getInitParameter(…)</code>; the option with <code>getServletContext()</code> returns <code>null</code> (shown for real on slide 11), and <code>request.getParameter</code> reads the user's data, not configuration.</div>`,
        `<p class="y-chinh">🎯 Đọc nó: <code>ServletConfig sc = getServletConfig();</code> rồi <code>sc.getInitParameter("name")</code> — lần chạy ở slide 11 trả về <code>FPT University</code>.</p>
<div class="pitfall">⚠️ Dòng thứ hai trên slide không biên dịch được: nó mở chuỗi bằng ngoặc kép cong <code>“</code> (U+201C, do PowerPoint tự định dạng) rồi đóng bằng ngoặc thẳng. Trình biên dịch Java thật, được đưa đúng dòng đó:</div>
<pre class="trich"><code class="language-java">// Slide 13, dòng 2: dấu nháy đầu là nháy cong “ (U+201C) dán từ trình soạn thảo văn bản
String slide13 = """
    interface ServletConfig { String getInitParameter(String name); }
    class Slide13 {
        ServletConfig getServletConfig() { return null; }
        void read() {
            ServletConfig sc = getServletConfig();
            String name = sc.getInitParameter(“name");
        }
    }
    """;
JavaCompiler javac = ToolProvider.getSystemJavaCompiler();
DiagnosticCollector&lt;JavaFileObject&gt; errors = new DiagnosticCollector&lt;&gt;();
JavaFileObject src = new SimpleJavaFileObject(URI.create("string:///Slide13.java"), JavaFileObject.Kind.SOURCE) {
    @Override public CharSequence getCharContent(boolean ignore) { return slide13; }
};
String out = Files.createTempDirectory("slide13").toString();
boolean ok = javac.getTask(null, null, errors, List.of("-d", out), null, List.of(src)).call();
System.out.println("slide 13 code compiles? " + ok);
errors.getDiagnostics().forEach(d -&gt;
    System.out.println("  line " + d.getLineNumber() + ": " + d.getMessage(Locale.ENGLISH)));</code></pre>
<div class="out">slide 10 web.xml -&gt; line 5: The end-tag for element type "param-value" must end with a '&gt;' delimiter.<br>
slide 13 code compiles? false<br>
&nbsp;&nbsp;line 6: illegal character: '\\u201c'<br>
&nbsp;&nbsp;line 6: unclosed string literal<br>
&nbsp;&nbsp;line 6: not a statement</div>
<p>"illegal character: '“'" là thông báo cần nhận ra: nó luôn có nghĩa là một dấu ngoặc cong hay ký tự trình bày khác được dán từ slide, Word hoặc tin nhắn. Gõ lại dấu ngoặc trong IDE.</p>
<p><code>getInitParameter("name")</code> không qua <code>getServletConfig()</code> cũng chạy được trong servlet: <code>GenericServlet</code> (lớp cha của <code>HttpServlet</code>) chuyển tiếp nó sang config — chính là lối tắt <code>OtherServlet</code> đã dùng. Đối tượng config chỉ có sau <code>init(ServletConfig)</code>, nên đừng đọc nó trong constructor.</p>
<div class="pitfall">Bẫy FE (dạng câu FE): "đoạn code nào đọc &lt;init-param&gt; của servlet này?" → <code>getServletConfig().getInitParameter(…)</code>; phương án dùng <code>getServletContext()</code> trả <code>null</code> (đã chạy thật ở slide 11), còn <code>request.getParameter</code> đọc dữ liệu người dùng, không phải cấu hình.</div>`],
      [14, 'Session Life Cycle',
        `<p class="y-chinh">🎯 The diagram: a client sends a first, second, third … n-th request; each becomes a <strong>new request object</strong>, but all of them reach the <strong>same session object</strong>, which holds the user's <strong>attributes</strong>. The session outlives every request.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/e2028fb3e6531dd0379474bfd5960c656493ec00.svg" alt="Slide 14 redrawn, with the attribute values of the real run below" loading="lazy" /><p class="chu-thich">🧩 Slide 14 redrawn, with the attribute values of the real run below</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 14 redrawn: many requests, one session object, its attributes
left to right direction
actor "Client\\n(one browser)" as CL
node "Web container (app server / JVM)" {
  package "Web App 1" {
    rectangle "Request object #1" as R1
    rectangle "Request object #2" as R2
    rectangle "Request object #3" as R3
    rectangle "Request object #n" as RN
    rectangle "Session object\\n(HttpSession)" as S
    rectangle "Attribute\\nrequests = 3" as A1
    rectangle "Attribute\\nitems = [pen, book]" as A2
  }
}
CL --&gt; R1 : first request
CL --&gt; R2 : second request\\n(Cookie: JSESSIONID)
CL --&gt; R3 : third request
CL --&gt; RN : n-th request
R1 --&gt; S : getSession()\\ncreates it
R2 --&gt; S : finds it
R3 --&gt; S : finds it
RN --&gt; S : finds it
S --&gt; A1
S --&gt; A2
@enduml</code></pre></details>
<p>The code the slide does not show: <code>request.getSession()</code> finds the session of this browser (by the JSESSIONID cookie) or creates one; <code>setAttribute</code> / <code>getAttribute</code> store and read any Java object. A listener (Chapter 8) prints every event on the Tomcat console, so you can watch the life cycle:</p>
<p class="ghi-chu">📄 <code>phien-vong-doi/src/main/java/demo/StepServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Slide 14: request #1, #2, #3 … of one client all reach the SAME session object
@WebServlet("/buoc")
public class StepServlet extends HttpServlet {
    @Override
    @SuppressWarnings("unchecked")
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();                 // find by JSESSIONID, or create
        Integer n = (Integer) session.getAttribute("requests");
        session.setAttribute("requests", n == null ? 1 : n + 1);
        List&lt;String&gt; items = (List&lt;String&gt;) session.getAttribute("items");
        if (items == null) {
            items = new ArrayList&lt;&gt;();
            session.setAttribute("items", items);
        }
        String item = req.getParameter("item");
        if (item != null) items.add(item);                    // the list object lives in the session

        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("new session?        " + session.isNew());
        out.println("request # in it:    " + session.getAttribute("requests"));
        out.println("items:              " + items);
        out.println("attribute names:    " + new java.util.TreeSet&lt;&gt;(Collections.list(session.getAttributeNames())));
        out.println("max inactive (s):   " + session.getMaxInactiveInterval());
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phien-vong-doi/src/main/java/demo/EndServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Slide 15: HttpSession.invalidate() — the session dies NOW, its attributes are unbound
@WebServlet("/ket-thuc")
public class EndServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        HttpSession session = req.getSession(false);            // do NOT create one just to destroy it
        if (session == null) {
            out.println("There was no session.");
            return;
        }
        session.invalidate();
        out.println("Session invalidated.");
        try {
            session.getAttribute("requests");                   // using a dead session…
        } catch (IllegalStateException e) {
            out.println("Using it afterwards -&gt; IllegalStateException: " + e.getMessage());
        }
        out.println("request.getSession(false) now returns: " + req.getSession(false));
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-vong-doi/buoc?item=pen HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/phien-vong-doi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 136

new session?        true
request # in it:    1
items:              [pen]
attribute names:    [items, requests]
max inactive (s):   3600</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[session] created<br>
[session] &nbsp;&nbsp;+ requests = 1<br>
[session] &nbsp;&nbsp;+ items = []</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-vong-doi/buoc?item=book HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 143

new session?        false
request # in it:    2
items:              [pen, book]
attribute names:    [items, requests]
max inactive (s):   3600</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[session] &nbsp;&nbsp;~ requests (was 1)</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-vong-doi/buoc HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 143

new session?        false
request # in it:    3
items:              [pen, book]
attribute names:    [items, requests]
max inactive (s):   3600</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[session] &nbsp;&nbsp;~ requests (was 2)</div>
<p>Request 1: <code>isNew() = true</code>, the log says <code>created</code>, the response carries <code>Set-Cookie: JSESSIONID</code>. Requests 2 and 3 carry the cookie, find the same session, and the counter keeps growing. Note the list: <code>items.add("book")</code> changed the list <em>inside</em> the session without a new <code>setAttribute</code> — the session holds a reference to the object, not a copy (the listener therefore reports no "~ items"). <code>max inactive = 3600</code> comes from web.xml (slide 15).</p>
<p class="nhan">➕ Beyond the slide — getSession() vs getSession(false)</p>
<table>
<thead><tr><th>Call</th><th>No session yet</th><th>Session exists</th></tr></thead>
<tbody>
<tr><td><code>getSession()</code> = <code>getSession(true)</code></td><td>creates one (+ Set-Cookie)</td><td>returns it</td></tr>
<tr><td><code>getSession(false)</code></td><td>returns <code>null</code></td><td>returns it</td></tr>
</tbody>
</table>
<p>Use <code>getSession(false)</code> to <em>check</em> ("is someone logged in?") and <code>getSession()</code> when you are about to <em>store</em> something. A JSP calls <code>getSession()</code> for you unless it says <code>&lt;%@ page session="false" %&gt;</code>.</p>
<div class="callout">🐘 <strong>On PostgreSQL / Spring Boot</strong> (illustration): Tomcat keeps sessions in the memory of one server. When LabFlow runs on two servers, or restarts, they are lost; <strong>Spring Session JDBC</strong> stores them in a PostgreSQL table (<code>SPRING_SESSION</code>) instead, with the same <code>HttpSession</code> API.</div>`,
        `<p class="y-chinh">🎯 Sơ đồ: một client gửi request thứ nhất, thứ hai, thứ ba … thứ n; mỗi cái thành một <strong>đối tượng request mới</strong>, nhưng tất cả tới <strong>cùng một đối tượng session</strong>, nơi giữ các <strong>attribute</strong> của người dùng. Session sống lâu hơn mọi request.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/e2028fb3e6531dd0379474bfd5960c656493ec00.svg" alt="Slide 14 vẽ lại, kèm giá trị attribute của lần chạy thật bên dưới" loading="lazy" /><p class="chu-thich">🧩 Slide 14 vẽ lại, kèm giá trị attribute của lần chạy thật bên dưới</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 14 redrawn: many requests, one session object, its attributes
left to right direction
actor "Client\\n(one browser)" as CL
node "Web container (app server / JVM)" {
  package "Web App 1" {
    rectangle "Request object #1" as R1
    rectangle "Request object #2" as R2
    rectangle "Request object #3" as R3
    rectangle "Request object #n" as RN
    rectangle "Session object\\n(HttpSession)" as S
    rectangle "Attribute\\nrequests = 3" as A1
    rectangle "Attribute\\nitems = [pen, book]" as A2
  }
}
CL --&gt; R1 : first request
CL --&gt; R2 : second request\\n(Cookie: JSESSIONID)
CL --&gt; R3 : third request
CL --&gt; RN : n-th request
R1 --&gt; S : getSession()\\ncreates it
R2 --&gt; S : finds it
R3 --&gt; S : finds it
RN --&gt; S : finds it
S --&gt; A1
S --&gt; A2
@enduml</code></pre></details>
<p>Phần code slide không cho xem: <code>request.getSession()</code> tìm session của trình duyệt này (theo cookie JSESSIONID) hoặc tạo mới; <code>setAttribute</code> / <code>getAttribute</code> cất và đọc đối tượng Java bất kỳ. Một listener (Chương 8) in mọi sự kiện ra console Tomcat, để bạn quan sát vòng đời:</p>
<p class="ghi-chu">📄 <code>phien-vong-doi/src/main/java/demo/StepServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Slide 14: request #1, #2, #3 … của một client đều tới CÙNG một đối tượng session
@WebServlet("/buoc")
public class StepServlet extends HttpServlet {
    @Override
    @SuppressWarnings("unchecked")
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();                 // tìm theo JSESSIONID, hoặc tạo mới
        Integer n = (Integer) session.getAttribute("requests");
        session.setAttribute("requests", n == null ? 1 : n + 1);
        List&lt;String&gt; items = (List&lt;String&gt;) session.getAttribute("items");
        if (items == null) {
            items = new ArrayList&lt;&gt;();
            session.setAttribute("items", items);
        }
        String item = req.getParameter("item");
        if (item != null) items.add(item);                    // đối tượng list sống trong session

        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("new session?        " + session.isNew());
        out.println("request # in it:    " + session.getAttribute("requests"));
        out.println("items:              " + items);
        out.println("attribute names:    " + new java.util.TreeSet&lt;&gt;(Collections.list(session.getAttributeNames())));
        out.println("max inactive (s):   " + session.getMaxInactiveInterval());
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phien-vong-doi/src/main/java/demo/EndServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Slide 15: HttpSession.invalidate() — session chết NGAY, các attribute bị gỡ ra
@WebServlet("/ket-thuc")
public class EndServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        HttpSession session = req.getSession(false);            // ĐỪNG tạo mới chỉ để huỷ
        if (session == null) {
            out.println("There was no session.");
            return;
        }
        session.invalidate();
        out.println("Session invalidated.");
        try {
            session.getAttribute("requests");                   // dùng một session đã chết…
        } catch (IllegalStateException e) {
            out.println("Using it afterwards -&gt; IllegalStateException: " + e.getMessage());
        }
        out.println("request.getSession(false) now returns: " + req.getSession(false));
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-vong-doi/buoc?item=pen HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/phien-vong-doi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 136

new session?        true
request # in it:    1
items:              [pen]
attribute names:    [items, requests]
max inactive (s):   3600</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[session] created<br>
[session] &nbsp;&nbsp;+ requests = 1<br>
[session] &nbsp;&nbsp;+ items = []</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-vong-doi/buoc?item=book HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 143

new session?        false
request # in it:    2
items:              [pen, book]
attribute names:    [items, requests]
max inactive (s):   3600</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[session] &nbsp;&nbsp;~ requests (was 1)</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-vong-doi/buoc HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 143

new session?        false
request # in it:    3
items:              [pen, book]
attribute names:    [items, requests]
max inactive (s):   3600</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[session] &nbsp;&nbsp;~ requests (was 2)</div>
<p>Request 1: <code>isNew() = true</code>, log ghi <code>created</code>, response mang <code>Set-Cookie: JSESSIONID</code>. Request 2 và 3 gửi kèm cookie, tìm thấy cùng session, và bộ đếm cứ tăng. Để ý cái list: <code>items.add("book")</code> đã đổi list <em>bên trong</em> session mà không cần <code>setAttribute</code> lại — session giữ tham chiếu tới đối tượng, không phải bản sao (vì thế listener không báo "~ items"). <code>max inactive = 3600</code> lấy từ web.xml (slide 15).</p>
<p class="nhan">➕ Mở rộng ngoài slide — getSession() khác getSession(false)</p>
<table>
<thead><tr><th>Lời gọi</th><th>Chưa có session</th><th>Đã có session</th></tr></thead>
<tbody>
<tr><td><code>getSession()</code> = <code>getSession(true)</code></td><td>tạo mới (+ Set-Cookie)</td><td>trả về nó</td></tr>
<tr><td><code>getSession(false)</code></td><td>trả <code>null</code></td><td>trả về nó</td></tr>
</tbody>
</table>
<p>Dùng <code>getSession(false)</code> để <em>kiểm tra</em> ("có ai đăng nhập chưa?") và <code>getSession()</code> khi sắp <em>cất</em> thứ gì đó. JSP tự gọi <code>getSession()</code> giùm bạn, trừ khi nó ghi <code>&lt;%@ page session="false" %&gt;</code>.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL / Spring Boot</strong> (ví dụ minh hoạ): Tomcat giữ session trong bộ nhớ của một server. Khi LabFlow chạy trên hai server, hoặc khởi động lại, chúng mất; <strong>Spring Session JDBC</strong> cất chúng vào một bảng PostgreSQL (<code>SPRING_SESSION</code>), vẫn dùng đúng API <code>HttpSession</code>.</div>`],
      [15, 'Session Death',
        `<p class="y-chinh">🎯 A session dies in two ways: <strong><code>HttpSession.invalidate()</code></strong> (it ends now and all its attributes are unbound) or a <strong>time-out</strong> — no request for longer than the allowed idle time, set at three levels: the server's global default, the web application default (<code>&lt;session-timeout&gt;</code> in web.xml), or one session (<code>setMaxInactiveInterval(int seconds)</code>). Zero or less = never time out.</p>
<p><strong>1. invalidate()</strong> — what logout calls. Continuing the run of slide 14:</p>
<p class="ghi-chu">📄 <code>phien-vong-doi/src/main/java/demo/StepServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Slide 14: request #1, #2, #3 … of one client all reach the SAME session object
@WebServlet("/buoc")
public class StepServlet extends HttpServlet {
    @Override
    @SuppressWarnings("unchecked")
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();                 // find by JSESSIONID, or create
        Integer n = (Integer) session.getAttribute("requests");
        session.setAttribute("requests", n == null ? 1 : n + 1);
        List&lt;String&gt; items = (List&lt;String&gt;) session.getAttribute("items");
        if (items == null) {
            items = new ArrayList&lt;&gt;();
            session.setAttribute("items", items);
        }
        String item = req.getParameter("item");
        if (item != null) items.add(item);                    // the list object lives in the session

        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("new session?        " + session.isNew());
        out.println("request # in it:    " + session.getAttribute("requests"));
        out.println("items:              " + items);
        out.println("attribute names:    " + new java.util.TreeSet&lt;&gt;(Collections.list(session.getAttributeNames())));
        out.println("max inactive (s):   " + session.getMaxInactiveInterval());
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phien-vong-doi/src/main/java/demo/EndServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Slide 15: HttpSession.invalidate() — the session dies NOW, its attributes are unbound
@WebServlet("/ket-thuc")
public class EndServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        HttpSession session = req.getSession(false);            // do NOT create one just to destroy it
        if (session == null) {
            out.println("There was no session.");
            return;
        }
        session.invalidate();
        out.println("Session invalidated.");
        try {
            session.getAttribute("requests");                   // using a dead session…
        } catch (IllegalStateException e) {
            out.println("Using it afterwards -&gt; IllegalStateException: " + e.getMessage());
        }
        out.println("request.getSession(false) now returns: " + req.getSession(false));
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-vong-doi/ket-thuc HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 153

Session invalidated.
Using it afterwards -&gt; IllegalStateException: getAttribute: Session already invalidated
request.getSession(false) now returns: null</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[session] destroyed<br>
[session] &nbsp;&nbsp;- requests<br>
[session] &nbsp;&nbsp;- items</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-vong-doi/buoc HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/phien-vong-doi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 133

new session?        true
request # in it:    1
items:              []
attribute names:    [items, requests]
max inactive (s):   3600</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[session] created<br>
[session] &nbsp;&nbsp;+ requests = 1<br>
[session] &nbsp;&nbsp;+ items = []</div>
<p>The listener prints <code>destroyed</code>, then removes both attributes. The old object throws <code>IllegalStateException</code> if you touch it. The browser still sends the old cookie, but it leads nowhere: the next request gets a brand-new session <code>…(2)</code> with <code>request # 1</code> and empty items.</p>
<p><strong>2. The three time-out levels</strong>, measured:</p>
<table>
<thead><tr><th>Level</th><th>How</th><th>Unit</th><th>Real value seen</th></tr></thead>
<tbody>
<tr><td>Server global default</td><td>Tomcat's <code>conf/web.xml</code>: <code>&lt;session-timeout&gt;30&lt;/session-timeout&gt;</code></td><td>minutes</td><td>1800 s (app without its own setting, below)</td></tr>
<tr><td>Web application default</td><td>the app's web.xml <code>&lt;session-timeout&gt;60&lt;/session-timeout&gt;</code> (the slide's code)</td><td>minutes</td><td>3600 s (slide 14's output)</td></tr>
<tr><td>Individual session</td><td><code>session.setMaxInactiveInterval(2)</code></td><td><strong>seconds</strong></td><td>2 s (below)</td></tr>
</tbody>
</table>
<p class="ghi-chu">📄 <code>phien-het-han/src/main/java/demo/StartServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Starts a session, optionally with its own time-out (slide 15 "Individual Session Setting")
@WebServlet("/app/bat-dau")
public class StartServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession old = req.getSession(false);
        if (old != null) old.invalidate();                      // a fresh session for each experiment
        HttpSession session = req.getSession(true);
        String s = req.getParameter("seconds");
        if (s != null) session.setMaxInactiveInterval(Integer.parseInt(s));   // SECONDS, this session only
        session.setAttribute("user", "cuong");

        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("session started for cuong");
        out.println("getMaxInactiveInterval() = " + session.getMaxInactiveInterval() + " s");
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phien-het-han/src/main/java/demo/CheckServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// "Am I still logged in?" — getSession(false) never creates a session
@WebServlet("/app/kiem")
public class CheckServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("browser sent a session id?  " + (req.getRequestedSessionId() != null));
        out.println("is that id still valid?     " + req.isRequestedSessionIdValid());
        HttpSession session = req.getSession(false);
        out.println(session == null
                ? "=&gt; no live session: please log in again"
                : "=&gt; still logged in as " + session.getAttribute("user"));
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/bat-dau HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/phien-het-han/app; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 60

session started for cuong
getMaxInactiveInterval() = 1800 s</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/bat-dau?seconds=2 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/phien-het-han/app; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 57

session started for cuong
getMaxInactiveInterval() = 2 s</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/kiem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 94

browser sent a session id?  true
is that id still valid?     true
=&gt; still logged in as cuong</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/cho?ms=3000 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 55

waited 3000 ms - this servlet never calls getSession()</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/kiem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 107

browser sent a session id?  true
is that id still valid?     false
=&gt; no live session: please log in again</code></pre>
<p>Three seconds without any request carrying the cookie (the helper <code>/cho</code> lies outside the cookie's Path, so the browser does not send it — the user is "away"), and the session is gone: the browser still presents its id, but <code>isRequestedSessionIdValid()</code> is <code>false</code>.</p>
<p>The time-out counts from the <strong>last request that carried the session id</strong> — even a request to a servlet that never calls <code>getSession()</code>. Two requests of 1.5 s each with the cookie kept a 2-second session alive:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/cho?ms=1500 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 55

waited 1500 ms - this servlet never calls getSession()</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/kiem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 94

browser sent a session id?  true
is that id still valid?     true
=&gt; still logged in as cuong</code></pre>
<p>And the red words of the slide, "zero or less": the session below survived 3 seconds of absence with interval 0 — it never times out:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/bat-dau?seconds=0 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(4); Path=/phien-het-han/app; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 57

session started for cuong
getMaxInactiveInterval() = 0 s</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/kiem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 94

browser sent a session id?  true
is that id still valid?     true
=&gt; still logged in as cuong</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/a6ef9187ddd83dcc56805a88e2bf5a76637054e1.svg" alt="Every way a session can end (state diagram)" loading="lazy" /><p class="chu-thich">🧩 Every way a session can end (state diagram)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 14-15: life and death of one HttpSession
[*] --&gt; New : first request.getSession()\\n/ id allocated, Set-Cookie JSESSIONID
New --&gt; Active : next request carries the id\\n(isNew() becomes false)
Active --&gt; Active : each request with the id\\n/ last-accessed time updated
New --&gt; Invalid : invalidate()
Active --&gt; Invalid : invalidate() (logout)
Active --&gt; Invalid : idle longer than maxInactiveInterval\\n(time-out; 0 or less = never)
Active --&gt; Invalid : web app stopped or undeployed
Invalid --&gt; [*] : sessionDestroyed() fired,\\nthen attributes unbound
New : isNew() == true
Invalid : getSession(false) returns null;\\nusing the old object throws\\nIllegalStateException
@enduml</code></pre></details>
<div class="pitfall">Unit trap (FE question type): <code>&lt;session-timeout&gt;</code> is in <strong>minutes</strong>, <code>setMaxInactiveInterval</code> in <strong>seconds</strong>, <code>Cookie.setMaxAge</code> in seconds. "30 minutes in code" = <code>setMaxInactiveInterval(30 * 60)</code>. And an old FE answer key counts "setMaxInactiveInterval(0)" as a way to invalidate a session at once — wrong since Servlet 3.0: the run above shows 0 means <em>never</em>. To end a session now, call <code>invalidate()</code>.</div>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): <code>server.servlet.session.timeout=30m</code> in <code>application.properties</code> sets the web-app default; Spring Security's logout calls <code>invalidate()</code> for you. A restart of Tomcat 10.1 loses in-memory sessions (session persistence is off in its default <code>conf/context.xml</code>), so everyone is logged out after a redeploy.</div>`,
        `<p class="y-chinh">🎯 Session chết theo hai cách: <strong><code>HttpSession.invalidate()</code></strong> (kết thúc ngay và gỡ mọi attribute) hoặc <strong>hết hạn (time-out)</strong> — không có request nào lâu hơn thời gian rảnh cho phép, đặt ở ba mức: mặc định chung của server, mặc định của ứng dụng web (<code>&lt;session-timeout&gt;</code> trong web.xml), hoặc riêng một session (<code>setMaxInactiveInterval(int giây)</code>). Bằng 0 hoặc âm = không bao giờ hết hạn.</p>
<p><strong>1. invalidate()</strong> — thứ mà đăng xuất gọi. Chạy tiếp từ slide 14:</p>
<p class="ghi-chu">📄 <code>phien-vong-doi/src/main/java/demo/StepServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Slide 14: request #1, #2, #3 … của một client đều tới CÙNG một đối tượng session
@WebServlet("/buoc")
public class StepServlet extends HttpServlet {
    @Override
    @SuppressWarnings("unchecked")
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();                 // tìm theo JSESSIONID, hoặc tạo mới
        Integer n = (Integer) session.getAttribute("requests");
        session.setAttribute("requests", n == null ? 1 : n + 1);
        List&lt;String&gt; items = (List&lt;String&gt;) session.getAttribute("items");
        if (items == null) {
            items = new ArrayList&lt;&gt;();
            session.setAttribute("items", items);
        }
        String item = req.getParameter("item");
        if (item != null) items.add(item);                    // đối tượng list sống trong session

        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("new session?        " + session.isNew());
        out.println("request # in it:    " + session.getAttribute("requests"));
        out.println("items:              " + items);
        out.println("attribute names:    " + new java.util.TreeSet&lt;&gt;(Collections.list(session.getAttributeNames())));
        out.println("max inactive (s):   " + session.getMaxInactiveInterval());
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phien-vong-doi/src/main/java/demo/EndServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Slide 15: HttpSession.invalidate() — session chết NGAY, các attribute bị gỡ ra
@WebServlet("/ket-thuc")
public class EndServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        HttpSession session = req.getSession(false);            // ĐỪNG tạo mới chỉ để huỷ
        if (session == null) {
            out.println("There was no session.");
            return;
        }
        session.invalidate();
        out.println("Session invalidated.");
        try {
            session.getAttribute("requests");                   // dùng một session đã chết…
        } catch (IllegalStateException e) {
            out.println("Using it afterwards -&gt; IllegalStateException: " + e.getMessage());
        }
        out.println("request.getSession(false) now returns: " + req.getSession(false));
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-vong-doi/ket-thuc HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 153

Session invalidated.
Using it afterwards -&gt; IllegalStateException: getAttribute: Session already invalidated
request.getSession(false) now returns: null</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[session] destroyed<br>
[session] &nbsp;&nbsp;- requests<br>
[session] &nbsp;&nbsp;- items</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-vong-doi/buoc HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/phien-vong-doi; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 133

new session?        true
request # in it:    1
items:              []
attribute names:    [items, requests]
max inactive (s):   3600</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[session] created<br>
[session] &nbsp;&nbsp;+ requests = 1<br>
[session] &nbsp;&nbsp;+ items = []</div>
<p>Listener in <code>destroyed</code>, rồi gỡ cả hai attribute. Đối tượng cũ ném <code>IllegalStateException</code> nếu bạn còn chạm vào. Trình duyệt vẫn gửi cookie cũ, nhưng nó không dẫn tới đâu: request sau nhận một session hoàn toàn mới <code>…(2)</code> với <code>request # 1</code> và items rỗng.</p>
<p><strong>2. Ba mức hết hạn</strong>, đo thật:</p>
<table>
<thead><tr><th>Mức</th><th>Cách đặt</th><th>Đơn vị</th><th>Giá trị thật thấy được</th></tr></thead>
<tbody>
<tr><td>Mặc định chung của server</td><td><code>conf/web.xml</code> của Tomcat: <code>&lt;session-timeout&gt;30&lt;/session-timeout&gt;</code></td><td>phút</td><td>1800 giây (ứng dụng không tự đặt, bên dưới)</td></tr>
<tr><td>Mặc định của ứng dụng web</td><td>web.xml của app <code>&lt;session-timeout&gt;60&lt;/session-timeout&gt;</code> (code của slide)</td><td>phút</td><td>3600 giây (output ở slide 14)</td></tr>
<tr><td>Riêng một session</td><td><code>session.setMaxInactiveInterval(2)</code></td><td><strong>giây</strong></td><td>2 giây (bên dưới)</td></tr>
</tbody>
</table>
<p class="ghi-chu">📄 <code>phien-het-han/src/main/java/demo/StartServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Mở một session, có thể kèm thời hạn riêng (slide 15 "Individual Session Setting")
@WebServlet("/app/bat-dau")
public class StartServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession old = req.getSession(false);
        if (old != null) old.invalidate();                      // mỗi thí nghiệm một session mới
        HttpSession session = req.getSession(true);
        String s = req.getParameter("seconds");
        if (s != null) session.setMaxInactiveInterval(Integer.parseInt(s));   // GIÂY, chỉ session này
        session.setAttribute("user", "cuong");

        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("session started for cuong");
        out.println("getMaxInactiveInterval() = " + session.getMaxInactiveInterval() + " s");
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phien-het-han/src/main/java/demo/CheckServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// "Mình còn đăng nhập không?" — getSession(false) không bao giờ tạo session
@WebServlet("/app/kiem")
public class CheckServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("browser sent a session id?  " + (req.getRequestedSessionId() != null));
        out.println("is that id still valid?     " + req.isRequestedSessionIdValid());
        HttpSession session = req.getSession(false);
        out.println(session == null
                ? "=&gt; no live session: please log in again"
                : "=&gt; still logged in as " + session.getAttribute("user"));
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/bat-dau HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/phien-het-han/app; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 60

session started for cuong
getMaxInactiveInterval() = 1800 s</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/bat-dau?seconds=2 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/phien-het-han/app; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 57

session started for cuong
getMaxInactiveInterval() = 2 s</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/kiem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 94

browser sent a session id?  true
is that id still valid?     true
=&gt; still logged in as cuong</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/cho?ms=3000 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 55

waited 3000 ms - this servlet never calls getSession()</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/kiem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 107

browser sent a session id?  true
is that id still valid?     false
=&gt; no live session: please log in again</code></pre>
<p>Ba giây không có request nào mang cookie (trợ thủ <code>/cho</code> nằm ngoài Path của cookie nên trình duyệt không gửi kèm — người dùng "đi vắng"), và session mất: trình duyệt vẫn trình id của nó, nhưng <code>isRequestedSessionIdValid()</code> là <code>false</code>.</p>
<p>Thời hạn tính từ <strong>request cuối cùng có mang mã session</strong> — kể cả request tới một servlet không hề gọi <code>getSession()</code>. Hai request mỗi cái 1,5 giây có kèm cookie đã giữ sống một session hạn 2 giây:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/cho?ms=1500 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 55

waited 1500 ms - this servlet never calls getSession()</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/kiem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 94

browser sent a session id?  true
is that id still valid?     true
=&gt; still logged in as cuong</code></pre>
<p>Còn mấy chữ tô đỏ trên slide, "zero or less": session dưới đây sống qua 3 giây vắng mặt với hạn 0 — nó không bao giờ hết hạn:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/bat-dau?seconds=0 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(4); Path=/phien-het-han/app; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 57

session started for cuong
getMaxInactiveInterval() = 0 s</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-het-han/app/kiem HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 94

browser sent a session id?  true
is that id still valid?     true
=&gt; still logged in as cuong</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/a6ef9187ddd83dcc56805a88e2bf5a76637054e1.svg" alt="Mọi cách một session có thể kết thúc (sơ đồ trạng thái)" loading="lazy" /><p class="chu-thich">🧩 Mọi cách một session có thể kết thúc (sơ đồ trạng thái)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 14-15: life and death of one HttpSession
[*] --&gt; New : first request.getSession()\\n/ id allocated, Set-Cookie JSESSIONID
New --&gt; Active : next request carries the id\\n(isNew() becomes false)
Active --&gt; Active : each request with the id\\n/ last-accessed time updated
New --&gt; Invalid : invalidate()
Active --&gt; Invalid : invalidate() (logout)
Active --&gt; Invalid : idle longer than maxInactiveInterval\\n(time-out; 0 or less = never)
Active --&gt; Invalid : web app stopped or undeployed
Invalid --&gt; [*] : sessionDestroyed() fired,\\nthen attributes unbound
New : isNew() == true
Invalid : getSession(false) returns null;\\nusing the old object throws\\nIllegalStateException
@enduml</code></pre></details>
<div class="pitfall">Bẫy đơn vị (dạng câu FE): <code>&lt;session-timeout&gt;</code> tính bằng <strong>phút</strong>, <code>setMaxInactiveInterval</code> bằng <strong>giây</strong>, <code>Cookie.setMaxAge</code> bằng giây. "30 phút trong code" = <code>setMaxInactiveInterval(30 * 60)</code>. Và một đáp án FE cũ coi "setMaxInactiveInterval(0)" là cách huỷ session ngay — sai từ Servlet 3.0: lần chạy trên cho thấy 0 nghĩa là <em>không bao giờ</em>. Muốn kết thúc session ngay, gọi <code>invalidate()</code>.</div>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): <code>server.servlet.session.timeout=30m</code> trong <code>application.properties</code> đặt mặc định của ứng dụng; logout của Spring Security gọi <code>invalidate()</code> giùm bạn. Khởi động lại Tomcat 10.1 là mất các session trong bộ nhớ (lưu session qua lần khởi động bị tắt trong <code>conf/context.xml</code> mặc định), nên mọi người bị đăng xuất sau mỗi lần deploy lại.</div>`],
      [16, 'Session Management: two principal methods',
        `<p class="y-chinh">🎯 There are two principal methods for session management "officially" recognised by the servlet API: management by <strong>cookie exchange</strong> and management by <strong>rewriting URLs</strong>.</p>
<p>Both solve the same problem — carrying the session ID on every request — in different places of the HTTP message. The spec (§7.1) also lists SSL sessions, and developers have long used a fourth, manual technique, hidden form fields:</p>
<table>
<thead><tr><th>Technique</th><th>Where the ID / data travels</th><th>Who does it</th><th>Covered</th></tr></thead>
<tbody>
<tr><td>Cookie</td><td>header <code>Cookie: JSESSIONID=…</code></td><td>the container, automatically</td><td>slides 17–18</td></tr>
<tr><td>URL rewriting</td><td>in the URL: <code>…/shop;jsessionid=…</code></td><td>the container — but only on URLs you pass to <code>encodeURL</code></td><td>slide 19</td></tr>
<tr><td>SSL/TLS session</td><td>the HTTPS connection's own session</td><td>the container (rarely used)</td><td>—</td></tr>
<tr><td>Hidden form field</td><td><code>&lt;input type="hidden"&gt;</code> in every form</td><td>you, by hand; no HttpSession at all</td><td>4.4 exercise 5</td></tr>
</tbody>
</table>
<p>The word "officially" matters: cookie and URL rewriting are built into <code>HttpSession</code>, so your code is the same whichever is used — you only call <code>getSession()</code>. Hidden fields are not a session mechanism; they carry data inside the page, and the user can change them.</p>
<p class="meo">🧠 Cookie = the ticket is in your pocket (the browser adds it by itself). URL rewriting = the ticket number is written on every door you open.</p>`,
        `<p class="y-chinh">🎯 Có hai cách quản lý session chính được servlet API "chính thức" công nhận: quản lý bằng <strong>trao đổi cookie</strong> và quản lý bằng <strong>viết lại URL (URL rewriting)</strong>.</p>
<p>Cả hai giải cùng một bài toán — mang mã session theo mọi request — ở những chỗ khác nhau của thông điệp HTTP. Đặc tả (§7.1) còn kể phiên SSL, và lập trình viên từ lâu dùng thêm kỹ thuật thứ tư làm bằng tay, ô ẩn trong form (hidden field):</p>
<table>
<thead><tr><th>Kỹ thuật</th><th>Mã / dữ liệu đi ở đâu</th><th>Ai làm</th><th>Học ở</th></tr></thead>
<tbody>
<tr><td>Cookie</td><td>header <code>Cookie: JSESSIONID=…</code></td><td>container, tự động</td><td>slide 17–18</td></tr>
<tr><td>Viết lại URL</td><td>trong URL: <code>…/shop;jsessionid=…</code></td><td>container — nhưng chỉ trên URL bạn đưa qua <code>encodeURL</code></td><td>slide 19</td></tr>
<tr><td>Phiên SSL/TLS</td><td>phiên riêng của kết nối HTTPS</td><td>container (hiếm dùng)</td><td>—</td></tr>
<tr><td>Ô ẩn trong form</td><td><code>&lt;input type="hidden"&gt;</code> ở mọi form</td><td>bạn, làm tay; không hề có HttpSession</td><td>4.4 bài 5</td></tr>
</tbody>
</table>
<p>Chữ "chính thức" quan trọng: cookie và viết lại URL được dựng sẵn trong <code>HttpSession</code>, nên code của bạn như nhau dù dùng cách nào — bạn chỉ gọi <code>getSession()</code>. Ô ẩn không phải cơ chế session; nó mang dữ liệu bên trong trang, và người dùng sửa được.</p>
<p class="meo">🧠 Cookie = tấm vé nằm trong túi bạn (trình duyệt tự đưa ra). Viết lại URL = số vé được viết lên mọi cánh cửa bạn mở.</p>`],
      [17, 'Session Management: General Principles',
        `<p class="y-chinh">🎯 Every request must carry a <strong>unique ID</strong> that names its session; the web application allocates the ID on the client's first request and must pass it back, so the client stores it and returns it with the next request — storing it is what the session management mechanisms are for.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/7d7e199faf0d952fc1669a56cb44f3db81622595.svg" alt="Allocate on the first request, send back, store, return: the cycle the slide describes (real run on slide 18)" loading="lazy" /><p class="chu-thich">🧩 Allocate on the first request, send back, store, return: the cycle the slide describes (real run on slide 18)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 17-18: session tracking by cookie exchange (real run of /phien-cookie)
participant "Browser\\n(cookie jar)" as B
participant "Tomcat" as T
participant "Session store\\n(server memory)" as M
B -&gt; T : request 1: GET /phien-cookie/cookies\\n(no Cookie header)
T -&gt; M : getSession(): allocate a new unique id
T --&gt; B : Set-Cookie: JSESSIONID=id; Path=/phien-cookie; HttpOnly\\n(no Max-Age = kept in memory only)
B -&gt; T : request 2: Cookie: JSESSIONID=id
T -&gt; M : find session by id
M --&gt; T : same session (isNew = false)
T --&gt; B : response (no new Set-Cookie)
note over B : browser closed: in-memory cookies are dropped,\\ncookies with Max-Age stay on disk
B -&gt; T : request 3: only Cookie: lastUser=cuong
T -&gt; M : no id ⇒ new session
T --&gt; B : Set-Cookie: JSESSIONID=id2 ...
@enduml</code></pre></details>
<p>What makes a good ID: Tomcat generates it with <code>SecureRandom</code> — 16 random bytes shown as 32 hexadecimal characters (you can see the length in slide 19's URL). It must be <strong>unguessable</strong>, because whoever presents the ID <em>is</em> that user for the server. Stealing it is called <em>session hijacking</em>; making a victim use an ID you already know is <em>session fixation</em> — the reason a login should give the user a new ID (<code>request.changeSessionId()</code>, practice 4.4 exercise 3).</p>
<div class="pitfall">FE trap (FE question type): "how is a session identified on the server?" → by the <strong>session ID</strong>, not by the IP address (many users share one IP behind a router; one phone changes IP between Wi-Fi and 4G) and not by the User-Agent.</div>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): a React front end calling a Spring Boot API can keep this exact model (a session cookie, sent with <code>credentials: 'include'</code>) or switch to a <strong>JWT</strong>: a signed token holding the user's identity, sent in <code>Authorization: Bearer …</code>, with no session on the server. Session = easy logout, server memory; JWT = stateless, but a stolen token is valid until it expires.</div>`,
        `<p class="y-chinh">🎯 Mỗi request phải mang một <strong>mã duy nhất (unique ID)</strong> cho biết nó thuộc session nào; ứng dụng web cấp mã ở request đầu tiên của client và phải gửi trả lại, để client cất nó và gửi kèm ở request sau — việc cất giữ đó chính là chỗ các cơ chế quản lý session ra tay.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/7d7e199faf0d952fc1669a56cb44f3db81622595.svg" alt="Cấp ở request đầu, gửi về, cất, gửi lại: vòng mà slide mô tả (chạy thật ở slide 18)" loading="lazy" /><p class="chu-thich">🧩 Cấp ở request đầu, gửi về, cất, gửi lại: vòng mà slide mô tả (chạy thật ở slide 18)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 17-18: session tracking by cookie exchange (real run of /phien-cookie)
participant "Browser\\n(cookie jar)" as B
participant "Tomcat" as T
participant "Session store\\n(server memory)" as M
B -&gt; T : request 1: GET /phien-cookie/cookies\\n(no Cookie header)
T -&gt; M : getSession(): allocate a new unique id
T --&gt; B : Set-Cookie: JSESSIONID=id; Path=/phien-cookie; HttpOnly\\n(no Max-Age = kept in memory only)
B -&gt; T : request 2: Cookie: JSESSIONID=id
T -&gt; M : find session by id
M --&gt; T : same session (isNew = false)
T --&gt; B : response (no new Set-Cookie)
note over B : browser closed: in-memory cookies are dropped,\\ncookies with Max-Age stay on disk
B -&gt; T : request 3: only Cookie: lastUser=cuong
T -&gt; M : no id ⇒ new session
T --&gt; B : Set-Cookie: JSESSIONID=id2 ...
@enduml</code></pre></details>
<p>Thế nào là một mã tốt: Tomcat sinh nó bằng <code>SecureRandom</code> — 16 byte ngẫu nhiên viết thành 32 ký tự thập lục phân (độ dài thấy được trong URL ở slide 19). Nó phải <strong>không đoán được</strong>, vì ai trình mã đó thì server coi người đó <em>là</em> chủ session. Đánh cắp nó gọi là <em>chiếm phiên (session hijacking)</em>; lừa nạn nhân dùng một mã mình đã biết trước gọi là <em>cố định phiên (session fixation)</em> — lý do đăng nhập nên cấp cho người dùng mã mới (<code>request.changeSessionId()</code>, bài thực hành 4.4 bài 3).</p>
<div class="pitfall">Bẫy FE (dạng câu FE): "server nhận ra một session bằng gì?" → bằng <strong>session ID</strong>, không phải địa chỉ IP (nhiều người dùng chung một IP sau router; một điện thoại đổi IP khi chuyển Wi-Fi sang 4G) và không phải User-Agent.</div>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): front end React gọi API Spring Boot có thể giữ nguyên mô hình này (cookie session, gửi kèm bằng <code>credentials: 'include'</code>) hoặc chuyển sang <strong>JWT</strong>: một token có chữ ký chứa danh tính người dùng, gửi trong <code>Authorization: Bearer …</code>, server không giữ session nào. Session = đăng xuất dễ, tốn bộ nhớ server; JWT = không trạng thái, nhưng token bị lộ thì còn dùng được tới khi hết hạn.</div>`],
      [18, 'Cookies',
        `<p class="y-chinh">🎯 The preferred way to pass the session ID back is a <strong>cookie in the response</strong>; the client stores it (on disk or in memory). In J2EE web applications the cookie has the standard name <strong>JSESSIONID</strong> and is stored in memory.</p>
<p>The slide stays abstract; here is the conversation for real, with an ordinary cookie <code>lastUser</code> next to the session cookie:</p>
<p class="ghi-chu">📄 <code>phien-cookie/src/main/java/demo/CookieServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Slides 17–18: the session ID travels in a cookie; other small facts can travel in cookies too
@WebServlet("/cookies")
public class CookieServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();                  // Tomcat adds Set-Cookie: JSESSIONID=… if the session is new
        String remember = req.getParameter("remember");
        if (remember != null) {
            Cookie c = new Cookie("lastUser", remember);          // an ordinary cookie: harmless data only
            c.setMaxAge(7 * 24 * 60 * 60);                       // SECONDS → persistent, survives closing the browser
            c.setHttpOnly(true);
            resp.addCookie(c);
        }
        if (req.getParameter("forget") != null) {
            Cookie kill = new Cookie("lastUser", "");
            kill.setMaxAge(0);                                   // 0 = delete now
            resp.addCookie(kill);
        }

        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("new session? " + session.isNew());
        out.println("cookies the browser sent:");
        Cookie[] cookies = req.getCookies();                      // null when the request has no Cookie header
        if (cookies == null) {
            out.println("  (none)");
        } else {
            for (Cookie c : cookies) out.println("  " + c.getName() + " = " + c.getValue());
        }
        out.println("session id came from a cookie? " + req.isRequestedSessionIdFromCookie());
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-cookie/cookies?remember=cuong HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/phien-cookie; HttpOnly
Set-Cookie: lastUser=cuong; Max-Age=604800; Expires=…; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 90

new session? true
cookies the browser sent:
  (none)
session id came from a cookie? false</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-cookie/cookies HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…; lastUser=cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 148

new session? false
cookies the browser sent:
  JSESSIONID = …
  lastUser = cuong
session id came from a cookie? true</code></pre>
<p>Compare the two <code>Set-Cookie</code> headers of the first response. <code>JSESSIONID</code> has <strong>no Max-Age</strong>: a <em>session cookie</em>, kept in the browser's memory and dropped when the browser closes — that is what "stored in memory" means. <code>lastUser</code> has <code>Max-Age=604800</code> (7 days in seconds): a <em>persistent cookie</em>, written to disk. Deleting a cookie means sending it again with <code>Max-Age=0</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-cookie/cookies?forget=1 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…; lastUser=cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: lastUser=; Max-Age=0; Expires=…
Content-Type: text/plain;charset=UTF-8
Content-Length: 148

new session? false
cookies the browser sent:
  JSESSIONID = …
  lastUser = cuong
session id came from a cookie? true</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-cookie/cookies HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 129

new session? false
cookies the browser sent:
  JSESSIONID = …
session id came from a cookie? true</code></pre>
<p>And a browser that was closed and reopened (had you not deleted lastUser) comes back with only the persistent cookie — a new session, but the name is still known:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-cookie/cookies HTTP/1.1
Host: localhost:8080
Cookie: lastUser=cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/phien-cookie; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 100

new session? true
cookies the browser sent:
  lastUser = cuong
session id came from a cookie? false</code></pre>
<p class="nhan">➕ Beyond the slide — corrections and the API</p>
<ul>
<li>"A small text file" was true of old browsers; today cookies live in a small database inside the browser profile. Still small: about 4 KB per cookie.</li>
<li>"J2EE" is the 1999–2006 name; today it is Jakarta EE. JSESSIONID is only the default name — <code>&lt;cookie-config&gt;&lt;name&gt;</code> in web.xml can change it.</li>
<li>API: <code>new Cookie(name, value)</code>, <code>setMaxAge(seconds)</code>, <code>setHttpOnly(true)</code>, <code>response.addCookie(c)</code>; read with <code>request.getCookies()</code> — an array that is <code>null</code> when no cookie came, and there is no <code>getCookie(name)</code>, you loop.</li>
</ul>
<div class="pitfall">Never put the password, the role or a price in a cookie: the user can read and edit it. Identity goes in the session (on the server); the cookie carries only the ID or harmless preferences. A cookie value cannot even hold a space or Vietnamese letters as-is — practice 4.4 exercise 4 shows Tomcat's 500 and the fix.</div>`,
        `<p class="y-chinh">🎯 Cách được ưa chuộng để gửi mã session về client là một <strong>cookie trong response</strong>; client cất nó (trên đĩa hoặc trong bộ nhớ). Với ứng dụng web J2EE, cookie có tên chuẩn là <strong>JSESSIONID</strong> và được cất trong bộ nhớ.</p>
<p>Slide chỉ nói chung chung; đây là cuộc trao đổi thật, có thêm một cookie thường <code>lastUser</code> đặt cạnh cookie session:</p>
<p class="ghi-chu">📄 <code>phien-cookie/src/main/java/demo/CookieServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Slide 17–18: mã session đi trong một cookie; các thông tin nhỏ khác cũng đi bằng cookie được
@WebServlet("/cookies")
public class CookieServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();                  // Tomcat tự thêm Set-Cookie: JSESSIONID=… nếu session mới
        String remember = req.getParameter("remember");
        if (remember != null) {
            Cookie c = new Cookie("lastUser", remember);          // cookie thường: chỉ dữ liệu vô hại
            c.setMaxAge(7 * 24 * 60 * 60);                       // GIÂY → cookie bền, sống qua lần đóng trình duyệt
            c.setHttpOnly(true);
            resp.addCookie(c);
        }
        if (req.getParameter("forget") != null) {
            Cookie kill = new Cookie("lastUser", "");
            kill.setMaxAge(0);                                   // 0 = xoá ngay
            resp.addCookie(kill);
        }

        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("new session? " + session.isNew());
        out.println("cookies the browser sent:");
        Cookie[] cookies = req.getCookies();                      // null khi request không có header Cookie
        if (cookies == null) {
            out.println("  (none)");
        } else {
            for (Cookie c : cookies) out.println("  " + c.getName() + " = " + c.getValue());
        }
        out.println("session id came from a cookie? " + req.isRequestedSessionIdFromCookie());
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-cookie/cookies?remember=cuong HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/phien-cookie; HttpOnly
Set-Cookie: lastUser=cuong; Max-Age=604800; Expires=…; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 90

new session? true
cookies the browser sent:
  (none)
session id came from a cookie? false</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-cookie/cookies HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…; lastUser=cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 148

new session? false
cookies the browser sent:
  JSESSIONID = …
  lastUser = cuong
session id came from a cookie? true</code></pre>
<p>So hai header <code>Set-Cookie</code> của response đầu. <code>JSESSIONID</code> <strong>không có Max-Age</strong>: một <em>cookie phiên (session cookie)</em>, giữ trong bộ nhớ trình duyệt và bị bỏ khi đóng trình duyệt — đó là nghĩa của "store in memory". <code>lastUser</code> có <code>Max-Age=604800</code> (7 ngày tính bằng giây): một <em>cookie bền (persistent cookie)</em>, ghi xuống đĩa. Xoá cookie nghĩa là gửi lại nó với <code>Max-Age=0</code>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-cookie/cookies?forget=1 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…; lastUser=cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: lastUser=; Max-Age=0; Expires=…
Content-Type: text/plain;charset=UTF-8
Content-Length: 148

new session? false
cookies the browser sent:
  JSESSIONID = …
  lastUser = cuong
session id came from a cookie? true</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-cookie/cookies HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 129

new session? false
cookies the browser sent:
  JSESSIONID = …
session id came from a cookie? true</code></pre>
<p>Còn một trình duyệt đã đóng rồi mở lại (giả sử bạn chưa xoá lastUser) quay lại chỉ với cookie bền — session mới, nhưng tên vẫn được nhớ:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-cookie/cookies HTTP/1.1
Host: localhost:8080
Cookie: lastUser=cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/phien-cookie; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 100

new session? true
cookies the browser sent:
  lastUser = cuong
session id came from a cookie? false</code></pre>
<p class="nhan">➕ Mở rộng ngoài slide — đính chính và API</p>
<ul>
<li>"Một file văn bản nhỏ" đúng với trình duyệt đời cũ; ngày nay cookie nằm trong một CSDL nhỏ trong hồ sơ trình duyệt. Vẫn nhỏ: khoảng 4 KB mỗi cookie.</li>
<li>"J2EE" là tên giai đoạn 1999–2006; ngày nay là Jakarta EE. JSESSIONID chỉ là tên mặc định — <code>&lt;cookie-config&gt;&lt;name&gt;</code> trong web.xml đổi được.</li>
<li>API: <code>new Cookie(tên, giá trị)</code>, <code>setMaxAge(giây)</code>, <code>setHttpOnly(true)</code>, <code>response.addCookie(c)</code>; đọc bằng <code>request.getCookies()</code> — một mảng, là <code>null</code> khi không có cookie nào, và không có <code>getCookie(tên)</code>, phải tự lặp.</li>
</ul>
<div class="pitfall">Đừng bao giờ để mật khẩu, vai trò hay giá tiền trong cookie: người dùng đọc và sửa được. Danh tính để trong session (trên server); cookie chỉ mang mã session hoặc sở thích vô hại. Giá trị cookie thậm chí không chứa nguyên dấu cách hay chữ tiếng Việt có dấu được — bài thực hành 4.4 bài 4 cho xem lỗi 500 của Tomcat và cách sửa.</div>`],
      [19, 'URL Rewriting',
        `<p class="y-chinh">🎯 With URL rewriting, a "pseudo-parameter" <code>jsessionid</code> is placed in the URL between the servlet path (and path info, if any) and the query string: <code>http://localhost:8080/examp0401/SessionExample;jsessionid=58112645388D9380808A726A27F92997?name=value</code>.</p>
<p>The container only rewrites URLs you hand to <code>response.encodeURL(url)</code> (links, form actions) or <code>encodeRedirectURL(url)</code> (redirects). On the first response Tomcat does not yet know whether this browser keeps cookies, so it does <strong>both</strong>: a Set-Cookie and a rewritten link. Once the cookie comes back, it stops rewriting:</p>
<p class="ghi-chu">📄 <code>phien-url/src/main/java/demo/ShopServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Every link and redirect goes through encodeURL / encodeRedirectURL, so the session survives without cookies
@WebServlet("/shop")
public class ShopServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();
        Integer n = (Integer) session.getAttribute("views");
        n = (n == null) ? 1 : n + 1;
        session.setAttribute("views", n);

        if ("cart".equals(req.getParameter("go"))) {
            resp.sendRedirect(resp.encodeRedirectURL("shop?page=cart"));   // the redirect URL is rewritten too
            return;
        }
        resp.setContentType("text/html;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("&lt;p&gt;Views in this session: " + n + "&lt;/p&gt;");
        out.println("&lt;p&gt;requested id: " + req.getRequestedSessionId()
                + " | from cookie: " + req.isRequestedSessionIdFromCookie()
                + " | from URL: " + req.isRequestedSessionIdFromURL()
                + " | valid: " + req.isRequestedSessionIdValid() + "&lt;/p&gt;");
        out.println("&lt;a href=\\"" + resp.encodeURL("shop?name=value") + "\\"&gt;Again&lt;/a&gt;");    // ← URL rewriting
        out.println("&lt;a href=\\"shop?name=value\\"&gt;Plain link (loses the session without cookies)&lt;/a&gt;");
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-url/shop HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/phien-url; HttpOnly
Content-Type: text/html;charset=UTF-8
Content-Length: 269

&lt;p&gt;Views in this session: 1&lt;/p&gt;
&lt;p&gt;requested id: null | from cookie: false | from URL: false | valid: false&lt;/p&gt;
&lt;a href="shop;jsessionid=…?name=value"&gt;Again&lt;/a&gt;
&lt;a href="shop?name=value"&gt;Plain link (loses the session without cookies)&lt;/a&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-url/shop HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 251

&lt;p&gt;Views in this session: 2&lt;/p&gt;
&lt;p&gt;requested id: … | from cookie: true | from URL: false | valid: true&lt;/p&gt;
&lt;a href="shop?name=value"&gt;Again&lt;/a&gt;
&lt;a href="shop?name=value"&gt;Plain link (loses the session without cookies)&lt;/a&gt;</code></pre>
<p>Now a browser that refuses every cookie. Java's <code>HttpClient</code> keeps no cookies unless given a <code>CookieHandler</code>, so a servlet can play that browser: it opens the shop and keeps clicking the rewritten link:</p>
<p class="ghi-chu">📄 <code>phien-url/src/main/java/demo/NoCookieBrowserServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// A tiny "browser with cookies turned off": Java's HttpClient keeps NO cookies unless you give it a CookieHandler
@WebServlet("/no-cookie-browser")
public class NoCookieBrowserServlet extends HttpServlet {
    private static final Pattern LINK = Pattern.compile("href=\\"(shop;jsessionid=[^\\"]+)\\"");

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpClient browser = HttpClient.newHttpClient();         // no CookieHandler ⇒ every Set-Cookie is ignored
        String base = "http://localhost:8080" + req.getContextPath() + "/";
        Map&lt;String, String&gt; ids = new LinkedHashMap&lt;&gt;();         // real ids → "&lt;id-1&gt;", "&lt;id-2&gt;" so the output is repeatable
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        try {
            String url = base + "shop";
            for (int click = 1; click &lt;= 3; click++) {
                HttpResponse&lt;String&gt; r = browser.send(HttpRequest.newBuilder(URI.create(url)).build(),
                        HttpResponse.BodyHandlers.ofString());
                String body = r.body();
                out.println("click " + click + ": GET " + hide(url.substring(base.length() - 1), ids));
                out.println("  " + hide(body.lines().filter(l -&gt; l.startsWith("&lt;p&gt;Views")).findFirst().orElse("").replaceAll("&lt;/?p&gt;", ""), ids));
                Matcher m = LINK.matcher(body);
                if (!m.find()) { out.println("  (no rewritten link)"); break; }
                url = base + m.group(1);                          // the user clicks the rewritten link
                out.println("  next link: " + hide(m.group(1), ids));
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private static String hide(String s, Map&lt;String, String&gt; ids) {
        Matcher m = Pattern.compile("jsessionid=([0-9A-F]+)").matcher(s);
        StringBuilder sb = new StringBuilder();
        while (m.find()) {
            String tag = ids.computeIfAbsent(m.group(1), k -&gt; "&lt;id-" + (ids.size() + 1) + "&gt;");
            m.appendReplacement(sb, Matcher.quoteReplacement("jsessionid=" + tag));
        }
        return m.appendTail(sb).toString();
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-url/no-cookie-browser HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 337

click 1: GET /shop
  Views in this session: 1
  next link: shop;jsessionid=&lt;id-1&gt;?name=value
click 2: GET /shop;jsessionid=&lt;id-1&gt;?name=value
  Views in this session: 2
  next link: shop;jsessionid=&lt;id-1&gt;?name=value
click 3: GET /shop;jsessionid=&lt;id-1&gt;?name=value
  Views in this session: 3
  next link: shop;jsessionid=&lt;id-1&gt;?name=value</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/7624854a02ae1e47d443d0ef51437ccaabb9193b.svg" alt="The cookie-less browser follows rewritten links and keeps one session" loading="lazy" /><p class="chu-thich">🧩 The cookie-less browser follows rewritten links and keeps one session</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 19: URL rewriting keeps the session alive without cookies (real run of /phien-url)
participant "Browser\\nwith cookies OFF" as B
participant "Tomcat" as T
participant "ShopServlet" as S
B -&gt; T : GET /phien-url/shop
T -&gt; S : doGet
S -&gt; S : getSession() creates id A1B2...
S -&gt; S : encodeURL("shop?name=value")\\nreturns "shop;jsessionid=A1B2...?name=value"
S --&gt; B : Set-Cookie: JSESSIONID=A1B2... (ignored)\\n+ link with ;jsessionid=A1B2...
B -&gt; T : click: GET /phien-url/shop;jsessionid=A1B2...?name=value
T -&gt; T : strip ";jsessionid=..." from the path,\\nrequestedSessionId = A1B2... (from URL)
T -&gt; S : doGet: getSession() finds the SAME session
S --&gt; B : Views: 2 + link rewritten again
note right of B : a plain link "shop?name=value"\\n(not encoded) would lose the session
@enduml</code></pre></details>
<p>Views 1, 2, 3 with the same id: the session works without cookies — but only through links that went through <code>encodeURL</code>. Redirects too, and an id that the server does not know is simply replaced by a new session:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-url/shop?go=cart HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(3); Path=/phien-url; HttpOnly
Location: shop;jsessionid=…(3)?page=cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phien-url/shop;jsessionid=ABC123?name=value HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/phien-url; HttpOnly
Content-Type: text/html;charset=UTF-8
Content-Length: 270

&lt;p&gt;Views in this session: 1&lt;/p&gt;
&lt;p&gt;requested id: ABC123 | from cookie: false | from URL: true | valid: false&lt;/p&gt;
&lt;a href="shop;jsessionid=…(2)?name=value"&gt;Again&lt;/a&gt;
&lt;a href="shop?name=value"&gt;Plain link (loses the session without cookies)&lt;/a&gt;</code></pre>
<div class="pitfall">The slide's example has a space after <code>jsessionid=</code> — a typo; a real URL has none. And URL rewriting is risky: the id shows in the address bar, in shared links, in server logs and in the <code>Referer</code> header sent to other sites. Anyone who gets the URL gets the session. Modern apps turn it off with <code>&lt;tracking-mode&gt;COOKIE&lt;/tracking-mode&gt;</code> — practice 4.4 exercise 6.</div>
<div class="pitfall">FE trap (FE question type): "which method puts the session id into the URL?" → <code>encodeURL()</code> of <strong>HttpServletResponse</strong> (not of the request, not "rewriteURL").</div>`,
        `<p class="y-chinh">🎯 Với viết lại URL, một "tham số giả" <code>jsessionid</code> được đặt trong URL, giữa đường dẫn servlet (và path info, nếu có) và chuỗi truy vấn: <code>http://localhost:8080/examp0401/SessionExample;jsessionid=58112645388D9380808A726A27F92997?name=value</code>.</p>
<p>Container chỉ viết lại những URL bạn đưa cho <code>response.encodeURL(url)</code> (liên kết, action của form) hoặc <code>encodeRedirectURL(url)</code> (chuyển hướng). Ở response đầu tiên Tomcat chưa biết trình duyệt này có giữ cookie không, nên nó làm <strong>cả hai</strong>: một Set-Cookie và một liên kết đã viết lại. Khi cookie đã quay về, nó thôi viết lại:</p>
<p class="ghi-chu">📄 <code>phien-url/src/main/java/demo/ShopServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Mọi liên kết và chuyển hướng đều qua encodeURL / encodeRedirectURL, nên session sống được cả khi không có cookie
@WebServlet("/shop")
public class ShopServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession();
        Integer n = (Integer) session.getAttribute("views");
        n = (n == null) ? 1 : n + 1;
        session.setAttribute("views", n);

        if ("cart".equals(req.getParameter("go"))) {
            resp.sendRedirect(resp.encodeRedirectURL("shop?page=cart"));   // URL chuyển hướng cũng được viết lại
            return;
        }
        resp.setContentType("text/html;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("&lt;p&gt;Views in this session: " + n + "&lt;/p&gt;");
        out.println("&lt;p&gt;requested id: " + req.getRequestedSessionId()
                + " | from cookie: " + req.isRequestedSessionIdFromCookie()
                + " | from URL: " + req.isRequestedSessionIdFromURL()
                + " | valid: " + req.isRequestedSessionIdValid() + "&lt;/p&gt;");
        out.println("&lt;a href=\\"" + resp.encodeURL("shop?name=value") + "\\"&gt;Again&lt;/a&gt;");    // ← viết lại URL
        out.println("&lt;a href=\\"shop?name=value\\"&gt;Plain link (loses the session without cookies)&lt;/a&gt;");
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-url/shop HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/phien-url; HttpOnly
Content-Type: text/html;charset=UTF-8
Content-Length: 269

&lt;p&gt;Views in this session: 1&lt;/p&gt;
&lt;p&gt;requested id: null | from cookie: false | from URL: false | valid: false&lt;/p&gt;
&lt;a href="shop;jsessionid=…?name=value"&gt;Again&lt;/a&gt;
&lt;a href="shop?name=value"&gt;Plain link (loses the session without cookies)&lt;/a&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-url/shop HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 251

&lt;p&gt;Views in this session: 2&lt;/p&gt;
&lt;p&gt;requested id: … | from cookie: true | from URL: false | valid: true&lt;/p&gt;
&lt;a href="shop?name=value"&gt;Again&lt;/a&gt;
&lt;a href="shop?name=value"&gt;Plain link (loses the session without cookies)&lt;/a&gt;</code></pre>
<p>Giờ tới một trình duyệt từ chối mọi cookie. <code>HttpClient</code> của Java không giữ cookie nào nếu không được đưa <code>CookieHandler</code>, nên một servlet có thể đóng vai trình duyệt đó: nó mở cửa hàng và cứ bấm vào liên kết đã viết lại:</p>
<p class="ghi-chu">📄 <code>phien-url/src/main/java/demo/NoCookieBrowserServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Một "trình duyệt tắt cookie" tí hon: HttpClient của Java KHÔNG giữ cookie nào trừ khi bạn đưa nó một CookieHandler
@WebServlet("/no-cookie-browser")
public class NoCookieBrowserServlet extends HttpServlet {
    private static final Pattern LINK = Pattern.compile("href=\\"(shop;jsessionid=[^\\"]+)\\"");

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpClient browser = HttpClient.newHttpClient();         // không CookieHandler ⇒ mọi Set-Cookie bị bỏ qua
        String base = "http://localhost:8080" + req.getContextPath() + "/";
        Map&lt;String, String&gt; ids = new LinkedHashMap&lt;&gt;();         // id thật → "&lt;id-1&gt;", "&lt;id-2&gt;" để output lặp lại được
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        try {
            String url = base + "shop";
            for (int click = 1; click &lt;= 3; click++) {
                HttpResponse&lt;String&gt; r = browser.send(HttpRequest.newBuilder(URI.create(url)).build(),
                        HttpResponse.BodyHandlers.ofString());
                String body = r.body();
                out.println("click " + click + ": GET " + hide(url.substring(base.length() - 1), ids));
                out.println("  " + hide(body.lines().filter(l -&gt; l.startsWith("&lt;p&gt;Views")).findFirst().orElse("").replaceAll("&lt;/?p&gt;", ""), ids));
                Matcher m = LINK.matcher(body);
                if (!m.find()) { out.println("  (no rewritten link)"); break; }
                url = base + m.group(1);                          // người dùng bấm liên kết đã viết lại
                out.println("  next link: " + hide(m.group(1), ids));
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private static String hide(String s, Map&lt;String, String&gt; ids) {
        Matcher m = Pattern.compile("jsessionid=([0-9A-F]+)").matcher(s);
        StringBuilder sb = new StringBuilder();
        while (m.find()) {
            String tag = ids.computeIfAbsent(m.group(1), k -&gt; "&lt;id-" + (ids.size() + 1) + "&gt;");
            m.appendReplacement(sb, Matcher.quoteReplacement("jsessionid=" + tag));
        }
        return m.appendTail(sb).toString();
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-url/no-cookie-browser HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 337

click 1: GET /shop
  Views in this session: 1
  next link: shop;jsessionid=&lt;id-1&gt;?name=value
click 2: GET /shop;jsessionid=&lt;id-1&gt;?name=value
  Views in this session: 2
  next link: shop;jsessionid=&lt;id-1&gt;?name=value
click 3: GET /shop;jsessionid=&lt;id-1&gt;?name=value
  Views in this session: 3
  next link: shop;jsessionid=&lt;id-1&gt;?name=value</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/7624854a02ae1e47d443d0ef51437ccaabb9193b.svg" alt="Trình duyệt không cookie đi theo liên kết đã viết lại và giữ được một session" loading="lazy" /><p class="chu-thich">🧩 Trình duyệt không cookie đi theo liên kết đã viết lại và giữ được một session</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 19: URL rewriting keeps the session alive without cookies (real run of /phien-url)
participant "Browser\\nwith cookies OFF" as B
participant "Tomcat" as T
participant "ShopServlet" as S
B -&gt; T : GET /phien-url/shop
T -&gt; S : doGet
S -&gt; S : getSession() creates id A1B2...
S -&gt; S : encodeURL("shop?name=value")\\nreturns "shop;jsessionid=A1B2...?name=value"
S --&gt; B : Set-Cookie: JSESSIONID=A1B2... (ignored)\\n+ link with ;jsessionid=A1B2...
B -&gt; T : click: GET /phien-url/shop;jsessionid=A1B2...?name=value
T -&gt; T : strip ";jsessionid=..." from the path,\\nrequestedSessionId = A1B2... (from URL)
T -&gt; S : doGet: getSession() finds the SAME session
S --&gt; B : Views: 2 + link rewritten again
note right of B : a plain link "shop?name=value"\\n(not encoded) would lose the session
@enduml</code></pre></details>
<p>Views 1, 2, 3 với cùng một id: session chạy được mà không cần cookie — nhưng chỉ qua những liên kết đã đi qua <code>encodeURL</code>. Chuyển hướng cũng vậy, còn một id server không biết thì đơn giản bị thay bằng session mới:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-url/shop?go=cart HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(3); Path=/phien-url; HttpOnly
Location: shop;jsessionid=…(3)?page=cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phien-url/shop;jsessionid=ABC123?name=value HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/phien-url; HttpOnly
Content-Type: text/html;charset=UTF-8
Content-Length: 270

&lt;p&gt;Views in this session: 1&lt;/p&gt;
&lt;p&gt;requested id: ABC123 | from cookie: false | from URL: true | valid: false&lt;/p&gt;
&lt;a href="shop;jsessionid=…(2)?name=value"&gt;Again&lt;/a&gt;
&lt;a href="shop?name=value"&gt;Plain link (loses the session without cookies)&lt;/a&gt;</code></pre>
<div class="pitfall">URL ví dụ trên slide có một dấu cách sau <code>jsessionid=</code> — lỗi gõ; URL thật không có. Và viết lại URL rủi ro: id hiện trên thanh địa chỉ, trong link bạn chia sẻ, trong log server và trong header <code>Referer</code> gửi sang site khác. Ai có URL là có session. Ứng dụng hiện đại tắt nó bằng <code>&lt;tracking-mode&gt;COOKIE&lt;/tracking-mode&gt;</code> — bài thực hành 4.4 bài 6.</div>
<div class="pitfall">Bẫy FE (dạng câu FE): "phương thức nào đưa session id vào URL?" → <code>encodeURL()</code> của <strong>HttpServletResponse</strong> (không phải của request, không phải "rewriteURL").</div>`],
      [20, 'Summary',
        `<p class="y-chinh">🎯 The deck covered the web container model and the ServletContext; sessions and listeners: the session life cycle and session management.</p>
<table>
<thead><tr><th>Summary line</th><th>Slides</th><th>Can you…</th></tr></thead>
<tbody>
<tr><td>Web container model</td><td>3–5</td><td>explain why a servlet field shared by threads leaks data between users?</td></tr>
<tr><td>ServletContext</td><td>6–13</td><td>share data in application scope; read a context-param and an init-param from the right object?</td></tr>
<tr><td>Session life cycle</td><td>14–15</td><td>create, read, invalidate a session; set the time-out at three levels in the right units?</td></tr>
<tr><td>Session management</td><td>16–19</td><td>explain cookie vs URL rewriting, read a Set-Cookie header, use encodeURL?</td></tr>
<tr><td>Listeners</td><td>(hidden slides)</td><td>→ Chapter 8, lesson 8.B (HttpSessionListener)</td></tr>
</tbody>
</table>
<p>Next: the old lessons 4.1–4.3 (the four scopes, cookie vs session, application scope), then <strong>4.4 🧪 practice</strong> — a cart, a login with a new session ID and a remember-me cookie, hidden fields, a hardened session cookie — and the quiz, which now covers Chapters 1–4.</p>`,
        `<p class="y-chinh">🎯 Deck đã học: mô hình web container và ServletContext; session và listener: vòng đời session và quản lý session.</p>
<table>
<thead><tr><th>Dòng tóm tắt</th><th>Slide</th><th>Bạn đã làm được…</th></tr></thead>
<tbody>
<tr><td>Mô hình web container</td><td>3–5</td><td>giải thích vì sao một trường servlet bị nhiều luồng dùng chung làm lộ dữ liệu giữa người dùng?</td></tr>
<tr><td>ServletContext</td><td>6–13</td><td>dùng chung dữ liệu ở phạm vi application; đọc context-param và init-param từ đúng đối tượng?</td></tr>
<tr><td>Vòng đời session</td><td>14–15</td><td>tạo, đọc, huỷ session; đặt thời hạn ở ba mức với đúng đơn vị?</td></tr>
<tr><td>Quản lý session</td><td>16–19</td><td>giải thích cookie khác viết lại URL, đọc header Set-Cookie, dùng encodeURL?</td></tr>
<tr><td>Listener</td><td>(slide bị ẩn)</td><td>→ Chương 8, bài 8.B (HttpSessionListener)</td></tr>
</tbody>
</table>
<p>Tiếp theo: các bài cũ 4.1–4.3 (bốn scope, cookie và session, phạm vi application), rồi <strong>4.4 🧪 thực hành</strong> — giỏ hàng, đăng nhập có đổi mã session và cookie nhớ tên, ô ẩn, cookie session được gia cố — và quiz, giờ phủ Chương 1–4.</p>`],
    ]),
    bi(`<h2>📌 What to take away from deck 5</h2>
<ul>
<li>One servlet object serves every user on many threads: per-user data never in fields — in the session; per-request data in local variables.</li>
<li>One web app = one context = one ServletContext: application scope is shared by all users; contexts are isolated from each other.</li>
<li><code>&lt;context-param&gt;</code> → <code>getServletContext().getInitParameter</code> (whole app); <code>&lt;init-param&gt;</code> → <code>getServletConfig().getInitParameter</code> (one servlet). Wrong object = <code>null</code>.</li>
<li><code>getSession()</code> finds or creates; <code>getSession(false)</code> only finds. Attributes hold references to any Java object.</li>
<li>A session ends by <code>invalidate()</code>, by time-out (minutes in web.xml, seconds in <code>setMaxInactiveInterval</code>; 0 or less = never), or when the app stops.</li>
<li>The session ID travels in the JSESSIONID cookie (no Max-Age = in memory) or in the URL via <code>encodeURL</code>; turn URL rewriting off in production.</li>
<li>The slides' code has two real bugs: a missing <code>&gt;</code> in web.xml (slide 10) and a curly quote in Java (slide 13).</li>
</ul>`,
    `<h2>📌 Cần mang theo gì từ deck 5</h2>
<ul>
<li>Một đối tượng servlet phục vụ mọi người dùng trên nhiều luồng: dữ liệu riêng từng người không bao giờ để trong trường — để trong session; dữ liệu của một request để trong biến cục bộ.</li>
<li>Một ứng dụng web = một context = một ServletContext: phạm vi application là của chung mọi người dùng; các context tách biệt nhau.</li>
<li><code>&lt;context-param&gt;</code> → <code>getServletContext().getInitParameter</code> (cả ứng dụng); <code>&lt;init-param&gt;</code> → <code>getServletConfig().getInitParameter</code> (một servlet). Hỏi nhầm đối tượng = <code>null</code>.</li>
<li><code>getSession()</code> tìm hoặc tạo; <code>getSession(false)</code> chỉ tìm. Attribute giữ tham chiếu tới đối tượng Java bất kỳ.</li>
<li>Session kết thúc bởi <code>invalidate()</code>, bởi hết hạn (phút trong web.xml, giây trong <code>setMaxInactiveInterval</code>; 0 hoặc âm = không bao giờ), hoặc khi ứng dụng dừng.</li>
<li>Mã session đi trong cookie JSESSIONID (không có Max-Age = nằm trong bộ nhớ) hoặc trong URL qua <code>encodeURL</code>; tắt viết lại URL khi chạy thật.</li>
<li>Code trên slide có hai lỗi thật: thiếu <code>&gt;</code> trong web.xml (slide 10) và ngoặc cong trong Java (slide 13).</li>
</ul>`),
    books([
      ['williams', 'Ch.5 "Maintaining State Using Sessions" (cookies, URL rewriting, session time-out, invalidating) and Ch.3 (init parameters)', 'Ch.5 "Maintaining State Using Sessions" (cookie, viết lại URL, thời hạn session, huỷ session) và Ch.3 (tham số khởi tạo)'],
      ['servletSpec', '§2.2 Number of Instances, §2.3.3.1 Multithreading Issues, Ch.4 Servlet Context (4.3 Initialization Parameters, 4.5 Context Attributes), Ch.7 Sessions (7.1 Session Tracking Mechanisms, 7.5 Session Timeouts, 7.6 Last Accessed Times)', '§2.2 Number of Instances, §2.3.3.1 Multithreading Issues, Ch.4 Servlet Context (4.3 Initialization Parameters, 4.5 Context Attributes), Ch.7 Sessions (7.1 Session Tracking Mechanisms, 7.5 Session Timeouts, 7.6 Last Accessed Times)'],
      ['tomcatDocs', '"The Context Container" (crossContext, sessionCookie… attributes) and "The Manager Component" (session persistence)', '"The Context Container" (crossContext, các thuộc tính sessionCookie…) và "The Manager Component" (lưu session)'],
      ['mdnHttp', '"Using HTTP cookies" (session vs persistent cookies, Max-Age, HttpOnly, Secure, SameSite)', '"Using HTTP cookies" (cookie phiên và cookie bền, Max-Age, HttpOnly, Secure, SameSite)'],
    ]),
  ].join('\n'),
};

/* ───────── 4.4 — 🧪 Practice + 🗂 Glossary + 📌 Summary · State for real: scopes, cart, login, cookies, hidden fields ───────── */
const L_on_ch4 = {
  title: '4.4 — 🧪 Practice + 🗂 Glossary + 📌 Summary · State for real: scopes, cart, login, cookies, hidden fields|||4.4 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Giữ trạng thái thật sự: scope, giỏ hàng, đăng nhập, cookie, ô ẩn',
  slug: 'prj301-on-ch4',
  type: 'VIDEO',
  description: '6 bài tập Chương 4 có lời giải chạy thật trên Tomcat 10.1: bốn scope (page, request, session, application) với hai người dùng và một lần redirect, giỏ hàng trong session theo Post/Redirect/Get với JSTL, đăng nhập giữ phiên có đổi mã session chống session fixation và cookie nhớ tên đăng nhập, lỗi 500 khi để tiếng Việt trong cookie và cách mã hoá, ô ẩn trong form bị sửa giá và cách chặn, gia cố cookie session trong web.xml (HttpOnly, Secure, SameSite, chỉ dùng cookie); 14 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.4 · Practice &amp; review</span>
<h2>State for real — six exercises on scopes, sessions and cookies</h2>
<p class="lead">Lesson 4.A explained how the server remembers a browser. These exercises use it the way the Assignment and the PE do: a cart that survives page loads, a login that keeps the user and protects pages, a cookie that remembers a name, and the mistakes that show up during demos — data in the wrong scope, Vietnamese in a cookie, prices in hidden fields, a session ID that travels too freely. Every solution ran on Tomcat 10.1; each run is <em>one browser</em> sending requests in order, cookies included.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>From</th></tr></thead>
<tbody>
<tr><td>1</td><td>the four scopes side by side; what a redirect loses</td><td>4.1, 4.3, slide 7</td></tr>
<tr><td>2</td><td>a shopping cart object in the session, Post/Redirect/Get, JSTL view</td><td>slides 14–15</td></tr>
<tr><td>3</td><td>login that keeps the user: new session ID, remember-me cookie, logout</td><td>slides 15, 17–18</td></tr>
<tr><td>4</td><td>cookie values: why "Nguyễn Văn Cường" crashes, and the fix</td><td>slide 18</td></tr>
<tr><td>5</td><td>hidden form fields: state without a session, and why not to trust them</td><td>slide 16</td></tr>
<tr><td>6</td><td>harden the session cookie in web.xml</td><td>slides 18–19</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 4 · Bài 4.4 · Thực hành &amp; ôn tập</span>
<h2>Giữ trạng thái thật sự — sáu bài tập về scope, session và cookie</h2>
<p class="lead">Bài 4.A đã giải thích server nhớ một trình duyệt ra sao. Các bài tập này dùng nó đúng như Assignment và PE dùng: giỏ hàng sống qua nhiều lần tải trang, đăng nhập giữ người dùng và bảo vệ trang, cookie nhớ một cái tên, và những lỗi hay lộ ra lúc demo — dữ liệu để sai scope, tiếng Việt trong cookie, giá tiền trong ô ẩn, mã session đi lại quá thoải mái. Lời giải nào cũng đã chạy trên Tomcat 10.1; mỗi lần chạy là <em>một trình duyệt</em> gửi các request theo thứ tự, kèm cookie.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Dựa trên</th></tr></thead>
<tbody>
<tr><td>1</td><td>bốn scope đặt cạnh nhau; redirect làm mất gì</td><td>4.1, 4.3, slide 7</td></tr>
<tr><td>2</td><td>đối tượng giỏ hàng trong session, Post/Redirect/Get, view bằng JSTL</td><td>slide 14–15</td></tr>
<tr><td>3</td><td>đăng nhập giữ người dùng: mã session mới, cookie nhớ tên, đăng xuất</td><td>slide 15, 17–18</td></tr>
<tr><td>4</td><td>giá trị cookie: vì sao "Nguyễn Văn Cường" làm sập, và cách sửa</td><td>slide 18</td></tr>
<tr><td>5</td><td>ô ẩn trong form: giữ trạng thái không cần session, và vì sao đừng tin nó</td><td>slide 16</td></tr>
<tr><td>6</td><td>gia cố cookie session trong web.xml</td><td>slide 18–19</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — Four scopes, two users, one redirect (~15 min)</h3>
<p>A servlet puts one value in each scope — a counter for <em>everybody</em> (application), a counter for <em>this user</em> (session), a message for <em>this request</em> — and forwards to a JSP that also sets a page-scope variable and prints all four. Alice loads it twice, then Bob loads it, then Bob follows a redirect. Before looking: predict the four lines of every response.</p>
<p class="ghi-chu">📄 <code>ch4-bon-scope/src/main/java/demo/ScopeServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.util.concurrent.atomic.AtomicInteger;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// One value in each scope, then forward to the JSP that prints all four
@WebServlet("/scope")
public class ScopeServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getParameter("view") == null) {
            // application: ONE counter for every user (thread-safe type)
            ServletContext app = getServletContext();
            AtomicInteger all;
            synchronized (app) {
                all = (AtomicInteger) app.getAttribute("allVisits");
                if (all == null) { all = new AtomicInteger(); app.setAttribute("allVisits", all); }
            }
            all.incrementAndGet();
            // session: one counter PER USER
            HttpSession session = req.getSession();
            Integer mine = (Integer) session.getAttribute("myVisits");
            session.setAttribute("myVisits", mine == null ? 1 : mine + 1);
            // request: lives only until this response is sent
            req.setAttribute("message", "computed for THIS request");
        }
        if ("redirect".equals(req.getParameter("go"))) {
            resp.sendRedirect("scope?view=only");               // a NEW request: the request attribute is gone
            return;
        }
        req.getRequestDispatcher("/WEB-INF/views/scope.jsp").forward(req, resp);   // SAME request: the JSP sees it
    }
}</code></pre>
<p class="ghi-chu">📄 <code>ch4-bon-scope/src/main/webapp/WEB-INF/views/scope.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@page contentType="text/plain" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%&gt;
&lt;%@taglib prefix="c" uri="jakarta.tags.core"%&gt;
&lt;%-- page scope: only inside THIS JSP, gone when the page finishes --%&gt;
&lt;c:set var="note" value="set inside scope.jsp" scope="page"/&gt;
page        : &#36;{pageScope.note}
request     : &#36;{empty requestScope.message ? '(nothing)' : requestScope.message}
session     : my visits = &#36;{sessionScope.myVisits}
application : all visits = &#36;{applicationScope.allVisits}</code></pre>
<p class="dap-an">✅ Real answers:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-bon-scope/scope HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 132


page        : set inside scope.jsp
request     : computed for THIS request
session     : my visits = 2
application : all visits = 2</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-bon-scope/scope HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/ch4-bon-scope; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 132


page        : set inside scope.jsp
request     : computed for THIS request
session     : my visits = 1
application : all visits = 3</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-bon-scope/scope?go=redirect HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: scope?view=only
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-bon-scope/scope?view=only HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 116


page        : set inside scope.jsp
request     : (nothing)
session     : my visits = 2
application : all visits = 4</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/c1df811cab75b9cdb126f77f000233d86002a42f.svg" alt="The four scopes as nested boxes, with the values of this run" loading="lazy" /><p class="chu-thich">🧩 The four scopes as nested boxes, with the values of this run</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title The four scopes: who sees the data and for how long (real run of /ch4-bon-scope)
left to right direction
rectangle "application scope (ServletContext)\\nevery user, until the app stops\\nallVisits = 4" as A {
  rectangle "session scope (HttpSession) of Alice\\nall her requests, until time-out/invalidate\\nmyVisits = 2" as SA {
    rectangle "request #1\\nmessage" as RA1 {
      rectangle "page: note\\n(scope.jsp only)" as PA1
    }
    rectangle "request #2\\nmessage" as RA2
  }
  rectangle "session scope of Bob\\nmyVisits = 2" as SB {
    rectangle "request: ?go=redirect\\nmessage (lost at 302)" as RB1
    rectangle "new request after redirect\\nmessage = nothing" as RB2
  }
}
RB1 --&gt; RB2 : 302 Location\\n(browser sends a NEW request)
@enduml</code></pre></details>
<p class="dap-an">✅ Why: application counted Alice's two visits <em>and</em> Bob's (3, then 4) — one ServletContext for all; session restarted at 1 for Bob — his own HttpSession; request survived the <code>forward</code> (same request object goes to the JSP) but not the <code>sendRedirect</code>: the 302 makes the browser send a <em>new</em> request, and the new one has no <code>message</code>. Page scope exists only while <code>scope.jsp</code> runs. The application counter is an <code>AtomicInteger</code> created inside <code>synchronized (app)</code> so that two first visitors cannot each create one.</p>
<div class="pitfall">FE question type: "request.setAttribute(…) then response.sendRedirect(…) — what happens to the attribute?" → it is <strong>lost</strong>. To pass a message across a redirect, put it in the session (and remove it after showing it — a "flash" message) or in the URL.</div>`,
    `<h3>🧪 Bài 1 — Bốn scope, hai người dùng, một lần redirect (~15 phút)</h3>
<p>Một servlet đặt vào mỗi scope một giá trị — bộ đếm cho <em>mọi người</em> (application), bộ đếm cho <em>người này</em> (session), một thông điệp cho <em>request này</em> — rồi forward sang một JSP, JSP đặt thêm một biến page scope và in cả bốn. Alice tải trang hai lần, rồi Bob tải, rồi Bob đi theo một redirect. Trước khi xem: đoán bốn dòng của từng response.</p>
<p class="ghi-chu">📄 <code>ch4-bon-scope/src/main/java/demo/ScopeServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.util.concurrent.atomic.AtomicInteger;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Mỗi scope một giá trị, rồi forward sang JSP in cả bốn
@WebServlet("/scope")
public class ScopeServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getParameter("view") == null) {
            // application: MỘT bộ đếm cho mọi người dùng (kiểu an toàn luồng)
            ServletContext app = getServletContext();
            AtomicInteger all;
            synchronized (app) {
                all = (AtomicInteger) app.getAttribute("allVisits");
                if (all == null) { all = new AtomicInteger(); app.setAttribute("allVisits", all); }
            }
            all.incrementAndGet();
            // session: mỗi NGƯỜI DÙNG một bộ đếm
            HttpSession session = req.getSession();
            Integer mine = (Integer) session.getAttribute("myVisits");
            session.setAttribute("myVisits", mine == null ? 1 : mine + 1);
            // request: chỉ sống tới khi response này được gửi
            req.setAttribute("message", "computed for THIS request");
        }
        if ("redirect".equals(req.getParameter("go"))) {
            resp.sendRedirect("scope?view=only");               // một request MỚI: attribute request biến mất
            return;
        }
        req.getRequestDispatcher("/WEB-INF/views/scope.jsp").forward(req, resp);   // CÙNG request: JSP thấy được
    }
}</code></pre>
<p class="ghi-chu">📄 <code>ch4-bon-scope/src/main/webapp/WEB-INF/views/scope.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@page contentType="text/plain" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%&gt;
&lt;%@taglib prefix="c" uri="jakarta.tags.core"%&gt;
&lt;%-- page scope: chỉ trong JSP NÀY, mất khi trang chạy xong --%&gt;
&lt;c:set var="note" value="set inside scope.jsp" scope="page"/&gt;
page        : &#36;{pageScope.note}
request     : &#36;{empty requestScope.message ? '(nothing)' : requestScope.message}
session     : my visits = &#36;{sessionScope.myVisits}
application : all visits = &#36;{applicationScope.allVisits}</code></pre>
<p class="dap-an">✅ Câu trả lời thật:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-bon-scope/scope HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 132


page        : set inside scope.jsp
request     : computed for THIS request
session     : my visits = 2
application : all visits = 2</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-bon-scope/scope HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/ch4-bon-scope; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 132


page        : set inside scope.jsp
request     : computed for THIS request
session     : my visits = 1
application : all visits = 3</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-bon-scope/scope?go=redirect HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: scope?view=only
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-bon-scope/scope?view=only HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 116


page        : set inside scope.jsp
request     : (nothing)
session     : my visits = 2
application : all visits = 4</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/c1df811cab75b9cdb126f77f000233d86002a42f.svg" alt="Bốn scope như những chiếc hộp lồng nhau, kèm giá trị của lần chạy này" loading="lazy" /><p class="chu-thich">🧩 Bốn scope như những chiếc hộp lồng nhau, kèm giá trị của lần chạy này</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title The four scopes: who sees the data and for how long (real run of /ch4-bon-scope)
left to right direction
rectangle "application scope (ServletContext)\\nevery user, until the app stops\\nallVisits = 4" as A {
  rectangle "session scope (HttpSession) of Alice\\nall her requests, until time-out/invalidate\\nmyVisits = 2" as SA {
    rectangle "request #1\\nmessage" as RA1 {
      rectangle "page: note\\n(scope.jsp only)" as PA1
    }
    rectangle "request #2\\nmessage" as RA2
  }
  rectangle "session scope of Bob\\nmyVisits = 2" as SB {
    rectangle "request: ?go=redirect\\nmessage (lost at 302)" as RB1
    rectangle "new request after redirect\\nmessage = nothing" as RB2
  }
}
RB1 --&gt; RB2 : 302 Location\\n(browser sends a NEW request)
@enduml</code></pre></details>
<p class="dap-an">✅ Vì sao: application đếm cả hai lượt của Alice <em>và</em> lượt của Bob (3, rồi 4) — một ServletContext cho tất cả; session bắt đầu lại từ 1 với Bob — HttpSession của riêng anh ấy; request sống qua <code>forward</code> (cùng đối tượng request đi sang JSP) nhưng không qua <code>sendRedirect</code>: mã 302 bắt trình duyệt gửi một request <em>mới</em>, và request mới không có <code>message</code>. Page scope chỉ tồn tại khi <code>scope.jsp</code> đang chạy. Bộ đếm application là <code>AtomicInteger</code> được tạo bên trong <code>synchronized (app)</code> để hai người ghé đầu tiên không mỗi người tạo một cái.</p>
<div class="pitfall">Dạng câu FE: "request.setAttribute(…) rồi response.sendRedirect(…) — attribute ra sao?" → bị <strong>mất</strong>. Muốn chuyển thông báo qua một redirect, để nó trong session (và xoá đi sau khi hiện — thông báo "flash") hoặc đưa lên URL.</div>`),
    bi(`<h3>🧪 Exercise 2 — A shopping cart in the session (~30 min)</h3>
<p>Products P1–P3 live in a <code>Catalog</code> (Chapter 5 replaces it with a DAO). <code>POST /cart</code> with <code>action=add&amp;id=…&amp;qty=…</code> adds to the cart (the same product again increases the quantity), <code>action=remove</code> removes a line; every POST ends with a redirect to <code>GET /cart</code>, which forwards to a JSP that prints the cart with JSTL. A second browser must have its own, empty cart; an unknown product or a non-numeric quantity answers 400.</p>
<p class="ghi-chu">📄 <code>ch4-gio-hang/src/main/java/model/Cart.java</code></p>
<pre class="web-src"><code class="language-java">package model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

// The object stored in the session under "cart" — one per browser
public class Cart implements Serializable {
    private final Map&lt;String, CartItem&gt; items = new LinkedHashMap&lt;&gt;();   // keeps the order items were added

    // synchronized: two tabs of the SAME browser share this object and may post at once
    public synchronized void add(Product p, int qty) {
        CartItem it = items.get(p.getId());
        if (it == null) items.put(p.getId(), new CartItem(p, qty));
        else it.add(qty);                                   // same product again ⇒ more quantity, not a new line
    }

    public synchronized void remove(String id) { items.remove(id); }

    public synchronized List&lt;CartItem&gt; getItems() { return new ArrayList&lt;&gt;(items.values()); }

    public synchronized long getTotal() {
        long sum = 0;
        for (CartItem it : items.values()) sum += it.getSubtotal();
        return sum;
    }

    public synchronized int getCount() {
        int n = 0;
        for (CartItem it : items.values()) n += it.getQuantity();
        return n;
    }
}</code></pre>
<p class="ghi-chu">📄 <code>ch4-gio-hang/src/main/java/controller/CartServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    HttpSession session = req.getSession();
    Cart cart = (Cart) session.getAttribute("cart");
    if (cart == null) {                                  // first item ⇒ create the cart once
        cart = new Cart();
        session.setAttribute("cart", cart);
    }
    String action = req.getParameter("action");
    String id = req.getParameter("id");
    if ("add".equals(action)) {
        Product p = Catalog.find(id);                    // never trust the client: look the product up
        int qty;
        try {
            qty = Integer.parseInt(req.getParameter("qty"));
        } catch (NumberFormatException e) {
            qty = 0;
        }
        if (p == null || qty &lt; 1 || qty &gt; 99) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Unknown product or bad quantity");
            return;
        }
        cart.add(p, qty);
    } else if ("remove".equals(action)) {
        cart.remove(id);
    }
    resp.sendRedirect("cart");                           // PRG: F5 on the next page will not add again
}</code></pre>
<p class="ghi-chu">📄 <code>ch4-gio-hang/src/main/webapp/WEB-INF/views/cart.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@page contentType="text/html" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%&gt;
&lt;%@taglib prefix="c" uri="jakarta.tags.core"%&gt;
&lt;%@taglib prefix="fmt" uri="jakarta.tags.fmt"%&gt;
&lt;%-- The view only READS the session: &#36;{sessionScope.cart} --%&gt;
&lt;fmt:setLocale value="vi_VN"/&gt;
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Cart&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;c:set var="cart" value="&#36;{sessionScope.cart}"/&gt;
&lt;c:choose&gt;
    &lt;c:when test="&#36;{empty cart or cart.count == 0}"&gt;
        &lt;p&gt;Your cart is empty.&lt;/p&gt;
    &lt;/c:when&gt;
    &lt;c:otherwise&gt;
        &lt;table&gt;
            &lt;tr&gt;&lt;th&gt;Product&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Subtotal&lt;/th&gt;&lt;/tr&gt;
            &lt;c:forEach var="it" items="&#36;{cart.items}"&gt;
            &lt;tr&gt;&lt;td&gt;&lt;c:out value="&#36;{it.product.name}"/&gt;&lt;/td&gt;&lt;td&gt;&lt;fmt:formatNumber value="&#36;{it.product.price}"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{it.quantity}&lt;/td&gt;&lt;td&gt;&lt;fmt:formatNumber value="&#36;{it.subtotal}"/&gt;&lt;/td&gt;&lt;/tr&gt;
            &lt;/c:forEach&gt;
        &lt;/table&gt;
        &lt;p&gt;&#36;{cart.count} item(s) — total &lt;fmt:formatNumber value="&#36;{cart.total}"/&gt; ₫&lt;/p&gt;
    &lt;/c:otherwise&gt;
&lt;/c:choose&gt;
&lt;form method="post" action="cart"&gt;
    &lt;input type="hidden" name="action" value="add"&gt;
    &lt;select name="id"&gt;&lt;option value="P1"&gt;Bút bi&lt;/option&gt;&lt;option value="P2"&gt;Vở&lt;/option&gt;&lt;option value="P3"&gt;Balo&lt;/option&gt;&lt;/select&gt;
    &lt;input name="qty" value="1" size="2"&gt;&lt;button&gt;Add&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="dap-an">✅ One browser, in order (add 2 pens, add a notebook, add 1 more pen, look, remove the notebook, look):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch4-gio-hang/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 22

action=add&amp;id=P1&amp;qty=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch4-gio-hang/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 22

action=add&amp;id=P1&amp;qty=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-gio-hang/cart HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Language: vi-VN
Content-Length: 723

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Cart&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;table&gt;
            &lt;tr&gt;&lt;th&gt;Product&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Subtotal&lt;/th&gt;&lt;/tr&gt;
            &lt;tr&gt;&lt;td&gt;Bút bi Thiên Long&lt;/td&gt;&lt;td&gt;5.000&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;15.000&lt;/td&gt;&lt;/tr&gt;
            &lt;tr&gt;&lt;td&gt;Vở 200 trang&lt;/td&gt;&lt;td&gt;18.000&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;18.000&lt;/td&gt;&lt;/tr&gt;
            &lt;/table&gt;
        &lt;p&gt;4 item(s) — total 33.000 ₫&lt;/p&gt;
    &lt;form method="post" action="cart"&gt;
    &lt;input type="hidden" name="action" value="add"&gt;
    &lt;select name="id"&gt;&lt;option value="P1"&gt;Bút bi&lt;/option&gt;&lt;option value="P2"&gt;Vở&lt;/option&gt;&lt;option value="P3"&gt;Balo&lt;/option&gt;&lt;/select&gt;
    &lt;input name="qty" value="1" size="2"&gt;&lt;button&gt;Add&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch4-gio-hang/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 19

action=remove&amp;id=P2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-gio-hang/cart HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Language: vi-VN
Content-Length: 638

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Cart&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;table&gt;
            &lt;tr&gt;&lt;th&gt;Product&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Subtotal&lt;/th&gt;&lt;/tr&gt;
            &lt;tr&gt;&lt;td&gt;Bút bi Thiên Long&lt;/td&gt;&lt;td&gt;5.000&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;15.000&lt;/td&gt;&lt;/tr&gt;
            &lt;/table&gt;
        &lt;p&gt;3 item(s) — total 15.000 ₫&lt;/p&gt;
    &lt;form method="post" action="cart"&gt;
    &lt;input type="hidden" name="action" value="add"&gt;
    &lt;select name="id"&gt;&lt;option value="P1"&gt;Bút bi&lt;/option&gt;&lt;option value="P2"&gt;Vở&lt;/option&gt;&lt;option value="P3"&gt;Balo&lt;/option&gt;&lt;/select&gt;
    &lt;input name="qty" value="1" size="2"&gt;&lt;button&gt;Add&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Another browser, then a bad request:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-gio-hang/cart HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/ch4-gio-hang; HttpOnly
Content-Type: text/html;charset=UTF-8
Content-Language: vi-VN
Content-Length: 420

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Cart&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Your cart is empty.&lt;/p&gt;
    &lt;form method="post" action="cart"&gt;
    &lt;input type="hidden" name="action" value="add"&gt;
    &lt;select name="id"&gt;&lt;option value="P1"&gt;Bút bi&lt;/option&gt;&lt;option value="P2"&gt;Vở&lt;/option&gt;&lt;option value="P3"&gt;Balo&lt;/option&gt;&lt;/select&gt;
    &lt;input name="qty" value="1" size="2"&gt;&lt;button&gt;Add&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch4-gio-hang/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 24

action=add&amp;id=P9&amp;qty=abc</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 816

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 400 – Bad Request
Type Status Report
Message Unknown product or bad quantity
Description The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive req … (+14 chars / ký tự)
Apache Tomcat/10.1.61</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/ece19ff3afcfc845b13b4be75b16e5884e7f27b1.svg" alt="The cart flow: POST changes the session, 302, GET shows it" loading="lazy" /><p class="chu-thich">🧩 The cart flow: POST changes the session, 302, GET shows it</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Shopping cart in the session with Post/Redirect/Get (real run of /ch4-gio-hang)
participant "Browser" as B
participant "CartServlet" as C
participant "HttpSession\\n(attribute cart)" as S
participant "cart.jsp" as V
B -&gt; C : POST /cart action=add&amp;id=P1&amp;qty=2
C -&gt; S : getAttribute("cart") is null\\n⇒ setAttribute("cart", new Cart())
C -&gt; S : cart.add(P1, 2)
C --&gt; B : 302 Location: cart
B -&gt; C : GET /cart (F5 repeats only this GET)
C -&gt; V : forward
V -&gt; S : read sessionScope.cart
V --&gt; B : table: Bút bi x2 = 10.000
note over B, S : a second browser has another JSESSIONID,\\nso another session and another, empty, cart
@enduml</code></pre></details>
<p class="dap-an">✅ Why each decision: <strong>(1)</strong> the cart is created once (<code>if (cart == null)</code>) and then only changed — the session keeps a reference, so <code>cart.add</code> needs no new <code>setAttribute</code>. <strong>(2)</strong> POST answers 302, so F5 on the cart page repeats a harmless GET instead of adding the pen again. <strong>(3)</strong> the price comes from the server's <code>Catalog</code>, never from the form. <strong>(4)</strong> <code>Cart</code>'s methods are <code>synchronized</code>: two tabs of one browser share one session and can post at the same moment. <strong>(5)</strong> <code>Cart</code>, <code>CartItem</code> and <code>Product</code> are <code>Serializable</code> so the session can be saved to disk or copied to another server. <strong>(6)</strong> <code>&lt;c:out&gt;</code> escapes the product name (XSS); <code>&lt;fmt:setLocale value="vi_VN"/&gt;</code> prints <code>33.000</code>. Note the very first GET already got a JSESSIONID: the JSP view created the session (JSPs do unless <code>session="false"</code>).</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): a controller can take <code>HttpSession session</code> as a parameter, or use a <code>@SessionScope</code> bean <code>Cart</code> injected into it. With a React front end the cart often lives in the browser (localStorage) until checkout, and the server only sees the final order.</div>`,
    `<h3>🧪 Bài 2 — Giỏ hàng trong session (~30 phút)</h3>
<p>Sản phẩm P1–P3 nằm trong <code>Catalog</code> (Chương 5 thay bằng DAO). <code>POST /cart</code> với <code>action=add&amp;id=…&amp;qty=…</code> thêm vào giỏ (cùng sản phẩm thì tăng số lượng), <code>action=remove</code> bỏ một dòng; POST nào cũng kết thúc bằng chuyển hướng về <code>GET /cart</code>, nơi forward sang một JSP in giỏ bằng JSTL. Trình duyệt thứ hai phải có giỏ riêng, rỗng; mã sản phẩm lạ hoặc số lượng không phải số thì trả 400.</p>
<p class="ghi-chu">📄 <code>ch4-gio-hang/src/main/java/model/Cart.java</code></p>
<pre class="web-src"><code class="language-java">package model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

// Đối tượng cất trong session dưới tên "cart" — mỗi trình duyệt một cái
public class Cart implements Serializable {
    private final Map&lt;String, CartItem&gt; items = new LinkedHashMap&lt;&gt;();   // giữ thứ tự thêm vào

    // synchronized: hai tab của CÙNG trình duyệt dùng chung đối tượng này và có thể gửi cùng lúc
    public synchronized void add(Product p, int qty) {
        CartItem it = items.get(p.getId());
        if (it == null) items.put(p.getId(), new CartItem(p, qty));
        else it.add(qty);                                   // sản phẩm cũ ⇒ tăng số lượng, không thêm dòng
    }

    public synchronized void remove(String id) { items.remove(id); }

    public synchronized List&lt;CartItem&gt; getItems() { return new ArrayList&lt;&gt;(items.values()); }

    public synchronized long getTotal() {
        long sum = 0;
        for (CartItem it : items.values()) sum += it.getSubtotal();
        return sum;
    }

    public synchronized int getCount() {
        int n = 0;
        for (CartItem it : items.values()) n += it.getQuantity();
        return n;
    }
}</code></pre>
<p class="ghi-chu">📄 <code>ch4-gio-hang/src/main/java/controller/CartServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    HttpSession session = req.getSession();
    Cart cart = (Cart) session.getAttribute("cart");
    if (cart == null) {                                  // món đầu tiên ⇒ tạo giỏ một lần
        cart = new Cart();
        session.setAttribute("cart", cart);
    }
    String action = req.getParameter("action");
    String id = req.getParameter("id");
    if ("add".equals(action)) {
        Product p = Catalog.find(id);                    // đừng tin client: tự tra sản phẩm
        int qty;
        try {
            qty = Integer.parseInt(req.getParameter("qty"));
        } catch (NumberFormatException e) {
            qty = 0;
        }
        if (p == null || qty &lt; 1 || qty &gt; 99) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Unknown product or bad quantity");
            return;
        }
        cart.add(p, qty);
    } else if ("remove".equals(action)) {
        cart.remove(id);
    }
    resp.sendRedirect("cart");                           // PRG: F5 ở trang sau không thêm lần nữa
}</code></pre>
<p class="ghi-chu">📄 <code>ch4-gio-hang/src/main/webapp/WEB-INF/views/cart.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@page contentType="text/html" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%&gt;
&lt;%@taglib prefix="c" uri="jakarta.tags.core"%&gt;
&lt;%@taglib prefix="fmt" uri="jakarta.tags.fmt"%&gt;
&lt;%-- View chỉ ĐỌC session: &#36;{sessionScope.cart} --%&gt;
&lt;fmt:setLocale value="vi_VN"/&gt;
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Cart&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;c:set var="cart" value="&#36;{sessionScope.cart}"/&gt;
&lt;c:choose&gt;
    &lt;c:when test="&#36;{empty cart or cart.count == 0}"&gt;
        &lt;p&gt;Your cart is empty.&lt;/p&gt;
    &lt;/c:when&gt;
    &lt;c:otherwise&gt;
        &lt;table&gt;
            &lt;tr&gt;&lt;th&gt;Product&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Subtotal&lt;/th&gt;&lt;/tr&gt;
            &lt;c:forEach var="it" items="&#36;{cart.items}"&gt;
            &lt;tr&gt;&lt;td&gt;&lt;c:out value="&#36;{it.product.name}"/&gt;&lt;/td&gt;&lt;td&gt;&lt;fmt:formatNumber value="&#36;{it.product.price}"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{it.quantity}&lt;/td&gt;&lt;td&gt;&lt;fmt:formatNumber value="&#36;{it.subtotal}"/&gt;&lt;/td&gt;&lt;/tr&gt;
            &lt;/c:forEach&gt;
        &lt;/table&gt;
        &lt;p&gt;&#36;{cart.count} item(s) — total &lt;fmt:formatNumber value="&#36;{cart.total}"/&gt; ₫&lt;/p&gt;
    &lt;/c:otherwise&gt;
&lt;/c:choose&gt;
&lt;form method="post" action="cart"&gt;
    &lt;input type="hidden" name="action" value="add"&gt;
    &lt;select name="id"&gt;&lt;option value="P1"&gt;Bút bi&lt;/option&gt;&lt;option value="P2"&gt;Vở&lt;/option&gt;&lt;option value="P3"&gt;Balo&lt;/option&gt;&lt;/select&gt;
    &lt;input name="qty" value="1" size="2"&gt;&lt;button&gt;Add&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="dap-an">✅ Một trình duyệt, theo thứ tự (thêm 2 bút, thêm 1 vở, thêm 1 bút nữa, xem, bỏ vở, xem):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch4-gio-hang/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 22

action=add&amp;id=P1&amp;qty=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch4-gio-hang/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 22

action=add&amp;id=P1&amp;qty=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-gio-hang/cart HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Language: vi-VN
Content-Length: 723

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Cart&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;table&gt;
            &lt;tr&gt;&lt;th&gt;Product&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Subtotal&lt;/th&gt;&lt;/tr&gt;
            &lt;tr&gt;&lt;td&gt;Bút bi Thiên Long&lt;/td&gt;&lt;td&gt;5.000&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;15.000&lt;/td&gt;&lt;/tr&gt;
            &lt;tr&gt;&lt;td&gt;Vở 200 trang&lt;/td&gt;&lt;td&gt;18.000&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;18.000&lt;/td&gt;&lt;/tr&gt;
            &lt;/table&gt;
        &lt;p&gt;4 item(s) — total 33.000 ₫&lt;/p&gt;
    &lt;form method="post" action="cart"&gt;
    &lt;input type="hidden" name="action" value="add"&gt;
    &lt;select name="id"&gt;&lt;option value="P1"&gt;Bút bi&lt;/option&gt;&lt;option value="P2"&gt;Vở&lt;/option&gt;&lt;option value="P3"&gt;Balo&lt;/option&gt;&lt;/select&gt;
    &lt;input name="qty" value="1" size="2"&gt;&lt;button&gt;Add&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch4-gio-hang/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 19

action=remove&amp;id=P2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: cart
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-gio-hang/cart HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Language: vi-VN
Content-Length: 638

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Cart&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;table&gt;
            &lt;tr&gt;&lt;th&gt;Product&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Subtotal&lt;/th&gt;&lt;/tr&gt;
            &lt;tr&gt;&lt;td&gt;Bút bi Thiên Long&lt;/td&gt;&lt;td&gt;5.000&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;15.000&lt;/td&gt;&lt;/tr&gt;
            &lt;/table&gt;
        &lt;p&gt;3 item(s) — total 15.000 ₫&lt;/p&gt;
    &lt;form method="post" action="cart"&gt;
    &lt;input type="hidden" name="action" value="add"&gt;
    &lt;select name="id"&gt;&lt;option value="P1"&gt;Bút bi&lt;/option&gt;&lt;option value="P2"&gt;Vở&lt;/option&gt;&lt;option value="P3"&gt;Balo&lt;/option&gt;&lt;/select&gt;
    &lt;input name="qty" value="1" size="2"&gt;&lt;button&gt;Add&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Một trình duyệt khác, rồi một request sai:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-gio-hang/cart HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/ch4-gio-hang; HttpOnly
Content-Type: text/html;charset=UTF-8
Content-Language: vi-VN
Content-Length: 420

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Cart&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Your cart is empty.&lt;/p&gt;
    &lt;form method="post" action="cart"&gt;
    &lt;input type="hidden" name="action" value="add"&gt;
    &lt;select name="id"&gt;&lt;option value="P1"&gt;Bút bi&lt;/option&gt;&lt;option value="P2"&gt;Vở&lt;/option&gt;&lt;option value="P3"&gt;Balo&lt;/option&gt;&lt;/select&gt;
    &lt;input name="qty" value="1" size="2"&gt;&lt;button&gt;Add&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch4-gio-hang/cart HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 24

action=add&amp;id=P9&amp;qty=abc</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 816

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 400 – Bad Request
Type Status Report
Message Unknown product or bad quantity
Description The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive req … (+14 chars / ký tự)
Apache Tomcat/10.1.61</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/ece19ff3afcfc845b13b4be75b16e5884e7f27b1.svg" alt="Luồng giỏ hàng: POST sửa session, 302, GET hiện ra" loading="lazy" /><p class="chu-thich">🧩 Luồng giỏ hàng: POST sửa session, 302, GET hiện ra</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Shopping cart in the session with Post/Redirect/Get (real run of /ch4-gio-hang)
participant "Browser" as B
participant "CartServlet" as C
participant "HttpSession\\n(attribute cart)" as S
participant "cart.jsp" as V
B -&gt; C : POST /cart action=add&amp;id=P1&amp;qty=2
C -&gt; S : getAttribute("cart") is null\\n⇒ setAttribute("cart", new Cart())
C -&gt; S : cart.add(P1, 2)
C --&gt; B : 302 Location: cart
B -&gt; C : GET /cart (F5 repeats only this GET)
C -&gt; V : forward
V -&gt; S : read sessionScope.cart
V --&gt; B : table: Bút bi x2 = 10.000
note over B, S : a second browser has another JSESSIONID,\\nso another session and another, empty, cart
@enduml</code></pre></details>
<p class="dap-an">✅ Vì sao từng quyết định: <strong>(1)</strong> giỏ được tạo một lần (<code>if (cart == null)</code>) rồi chỉ sửa — session giữ tham chiếu, nên <code>cart.add</code> không cần <code>setAttribute</code> lại. <strong>(2)</strong> POST trả 302, nên F5 ở trang giỏ chỉ lặp lại một GET vô hại thay vì thêm bút lần nữa. <strong>(3)</strong> giá lấy từ <code>Catalog</code> của server, không bao giờ từ form. <strong>(4)</strong> các phương thức của <code>Cart</code> là <code>synchronized</code>: hai tab của cùng trình duyệt dùng chung một session và có thể POST cùng lúc. <strong>(5)</strong> <code>Cart</code>, <code>CartItem</code> và <code>Product</code> là <code>Serializable</code> để session có thể được ghi xuống đĩa hoặc chép sang server khác. <strong>(6)</strong> <code>&lt;c:out&gt;</code> thoát ký tự tên sản phẩm (chống XSS); <code>&lt;fmt:setLocale value="vi_VN"/&gt;</code> in ra <code>33.000</code>. Để ý ngay GET đầu tiên đã nhận JSESSIONID: view JSP đã tạo session (JSP luôn làm vậy trừ khi ghi <code>session="false"</code>).</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): controller có thể nhận tham số <code>HttpSession session</code>, hoặc dùng một bean <code>Cart</code> có <code>@SessionScope</code> được tiêm vào. Với front end React, giỏ hàng thường nằm ở trình duyệt (localStorage) tới lúc thanh toán, server chỉ thấy đơn hàng cuối cùng.</div>`),
    bi(`<h3>🧪 Exercise 3 — A login that keeps the user, done properly (~25 min)</h3>
<p>Chapter 2's exercise 5 built the basic login (PRG, <code>getSession(false)</code>, logout). Make it production-like: count failed attempts per browser in the session; on success give the user a <strong>new session ID</strong>, store the user, set a 15-minute time-out, and remember the user name for 30 days if "Remember me" is ticked; the protected page must tell "never logged in" apart from "your session has ended".</p>
<p class="ghi-chu">📄 <code>ch4-dang-nhap/src/main/java/controller/LoginServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    String user = req.getParameter("user"), pass = req.getParameter("pass");
    if (user == null || pass == null || !pass.equals(USERS.get(user))) {
        HttpSession s = req.getSession();                       // count failed tries per browser
        Integer tries = (Integer) s.getAttribute("failedTries");
        s.setAttribute("failedTries", tries == null ? 1 : tries + 1);
        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        showForm(req, resp, "Wrong user name or password (" + s.getAttribute("failedTries") + " failed)");
        return;
    }
    HttpSession session = req.getSession();
    req.changeSessionId();                                    // NEW id after login: an id known before login is now useless
    session.removeAttribute("failedTries");
    session.setAttribute("user", user);                       // identity stays on the SERVER
    session.setMaxInactiveInterval(15 * 60);                  // 15 minutes idle ⇒ logged out

    Cookie c = new Cookie("lastUser", user);                  // only the harmless user name
    c.setHttpOnly(true);
    c.setMaxAge("on".equals(req.getParameter("remember")) ? 30 * 24 * 60 * 60 : 0);   // 30 days, or delete
    resp.addCookie(c);
    resp.sendRedirect("home");                                // PRG
}</code></pre>
<p class="ghi-chu">📄 <code>ch4-dang-nhap/src/main/java/controller/HomeServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    HttpSession session = req.getSession(false);              // never create a session for a guest
    Object user = (session == null) ? null : session.getAttribute("user");
    if (user == null) {
        boolean hadSession = req.getRequestedSessionId() != null &amp;&amp; !req.isRequestedSessionIdValid();
        resp.sendRedirect(hadSession ? "login?msg=ended" : "login");   // old cookie, dead session ⇒ explain
        return;
    }
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("Welcome, " + user + " — this page is only for logged-in users.");
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch4-dang-nhap/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 19

user=cuong&amp;pass=sai</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 401
Set-Cookie: JSESSIONID=…; Path=/ch4-dang-nhap; HttpOnly
Content-Type: text/html;charset=UTF-8
Content-Length: 280

&lt;p class="msg"&gt;Wrong user name or password (1 failed)&lt;/p&gt;
&lt;form method="post" action="login"&gt;
User &lt;input name="user" value=""&gt; Password &lt;input type="password" name="pass"&gt;
&lt;label&gt;&lt;input type="checkbox" name="remember"&gt; Remember my user name&lt;/label&gt; &lt;button&gt;Login&lt;/button&gt;&lt;/form&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch4-dang-nhap/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 35

user=cuong&amp;pass=Prj301!&amp;remember=on</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(2); Path=/ch4-dang-nhap; HttpOnly
Set-Cookie: lastUser=cuong; Max-Age=2592000; Expires=…; HttpOnly
Location: home
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-dang-nhap/home HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2); lastUser=cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 58

Welcome, cuong — this page is only for logged-in users.</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-dang-nhap/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2); lastUser=cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-dang-nhap/home HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2); lastUser=cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: login?msg=ended
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-dang-nhap/login?msg=ended HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2); lastUser=cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 291

&lt;p class="msg"&gt;Your session has ended. Please log in again.&lt;/p&gt;
&lt;form method="post" action="login"&gt;
User &lt;input name="user" value="cuong"&gt; Password &lt;input type="password" name="pass"&gt;
&lt;label&gt;&lt;input type="checkbox" name="remember"&gt; Remember my user name&lt;/label&gt; &lt;button&gt;Login&lt;/button&gt;&lt;/form&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-dang-nhap/home HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: login
Content-Length: 0</code></pre>
<p class="dap-an">✅ Read the cookies: the failed attempt created session <code>…</code>; the successful login answered with a <strong>different</strong> id <code>…(2)</code> — that is <code>changeSessionId()</code>. If an attacker had planted id <code>…</code> in the victim's browser before login (session fixation), it is worthless now. The attributes moved with the session (the failed counter was removed on purpose). After logout the browser still sends <code>…(2)</code>, the server finds no live session ⇒ "Your session has ended", while a stranger without any cookie is just sent to the login page. The form is pre-filled from the <code>lastUser</code> cookie — the user name only, never the password, and the session (not the cookie) decides who is logged in.</p>
<div class="pitfall">Logout here is a GET link to keep the demo short. In a real app make logout a POST (a form with a button): another site could otherwise log your users out with an <code>&lt;img src="…/logout"&gt;</code>.</div>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): Spring Security changes the session ID at login by default (<code>sessionFixation().changeSessionId()</code>) and offers <code>rememberMe()</code> — which stores a signed token, not the user name, in the cookie.</div>`,
    `<h3>🧪 Bài 3 — Đăng nhập giữ người dùng, làm cho đúng (~25 phút)</h3>
<p>Bài 5 của Chương 2 đã dựng khung đăng nhập cơ bản (PRG, <code>getSession(false)</code>, đăng xuất). Làm cho giống sản phẩm thật: đếm số lần sai của từng trình duyệt trong session; đăng nhập đúng thì cấp cho người dùng <strong>mã session mới</strong>, cất người dùng, đặt hạn 15 phút, và nhớ tên đăng nhập 30 ngày nếu tích "Remember me"; trang được bảo vệ phải phân biệt "chưa từng đăng nhập" với "phiên của bạn đã kết thúc".</p>
<p class="ghi-chu">📄 <code>ch4-dang-nhap/src/main/java/controller/LoginServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    String user = req.getParameter("user"), pass = req.getParameter("pass");
    if (user == null || pass == null || !pass.equals(USERS.get(user))) {
        HttpSession s = req.getSession();                       // đếm lần sai theo từng trình duyệt
        Integer tries = (Integer) s.getAttribute("failedTries");
        s.setAttribute("failedTries", tries == null ? 1 : tries + 1);
        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        showForm(req, resp, "Wrong user name or password (" + s.getAttribute("failedTries") + " failed)");
        return;
    }
    HttpSession session = req.getSession();
    req.changeSessionId();                                    // id MỚI sau đăng nhập: id bị lộ trước khi đăng nhập thành vô dụng
    session.removeAttribute("failedTries");
    session.setAttribute("user", user);                       // danh tính ở lại SERVER
    session.setMaxInactiveInterval(15 * 60);                  // rảnh 15 phút ⇒ tự đăng xuất

    Cookie c = new Cookie("lastUser", user);                  // chỉ tên đăng nhập, vô hại
    c.setHttpOnly(true);
    c.setMaxAge("on".equals(req.getParameter("remember")) ? 30 * 24 * 60 * 60 : 0);   // 30 ngày, hoặc xoá
    resp.addCookie(c);
    resp.sendRedirect("home");                                // PRG
}</code></pre>
<p class="ghi-chu">📄 <code>ch4-dang-nhap/src/main/java/controller/HomeServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    HttpSession session = req.getSession(false);              // không tạo session cho khách
    Object user = (session == null) ? null : session.getAttribute("user");
    if (user == null) {
        boolean hadSession = req.getRequestedSessionId() != null &amp;&amp; !req.isRequestedSessionIdValid();
        resp.sendRedirect(hadSession ? "login?msg=ended" : "login");   // cookie cũ, session đã chết ⇒ giải thích
        return;
    }
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("Welcome, " + user + " — this page is only for logged-in users.");
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch4-dang-nhap/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 19

user=cuong&amp;pass=sai</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 401
Set-Cookie: JSESSIONID=…; Path=/ch4-dang-nhap; HttpOnly
Content-Type: text/html;charset=UTF-8
Content-Length: 280

&lt;p class="msg"&gt;Wrong user name or password (1 failed)&lt;/p&gt;
&lt;form method="post" action="login"&gt;
User &lt;input name="user" value=""&gt; Password &lt;input type="password" name="pass"&gt;
&lt;label&gt;&lt;input type="checkbox" name="remember"&gt; Remember my user name&lt;/label&gt; &lt;button&gt;Login&lt;/button&gt;&lt;/form&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch4-dang-nhap/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 35

user=cuong&amp;pass=Prj301!&amp;remember=on</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(2); Path=/ch4-dang-nhap; HttpOnly
Set-Cookie: lastUser=cuong; Max-Age=2592000; Expires=…; HttpOnly
Location: home
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-dang-nhap/home HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2); lastUser=cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 58

Welcome, cuong — this page is only for logged-in users.</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-dang-nhap/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2); lastUser=cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: login
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-dang-nhap/home HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2); lastUser=cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: login?msg=ended
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-dang-nhap/login?msg=ended HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2); lastUser=cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 291

&lt;p class="msg"&gt;Your session has ended. Please log in again.&lt;/p&gt;
&lt;form method="post" action="login"&gt;
User &lt;input name="user" value="cuong"&gt; Password &lt;input type="password" name="pass"&gt;
&lt;label&gt;&lt;input type="checkbox" name="remember"&gt; Remember my user name&lt;/label&gt; &lt;button&gt;Login&lt;/button&gt;&lt;/form&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-dang-nhap/home HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: login
Content-Length: 0</code></pre>
<p class="dap-an">✅ Đọc các cookie: lần sai đã tạo session <code>…</code>; lần đăng nhập đúng trả về một id <strong>khác</strong> <code>…(2)</code> — đó là <code>changeSessionId()</code>. Nếu kẻ tấn công đã cài sẵn id <code>…</code> vào trình duyệt nạn nhân trước khi đăng nhập (session fixation), giờ nó vô dụng. Các attribute đi theo session (bộ đếm lần sai được cố ý gỡ đi). Sau đăng xuất trình duyệt vẫn gửi <code>…(2)</code>, server không tìm thấy session sống ⇒ "Your session has ended", còn người lạ không có cookie nào thì chỉ bị đưa về trang đăng nhập. Form được điền sẵn từ cookie <code>lastUser</code> — chỉ tên đăng nhập, không bao giờ mật khẩu, và chính session (không phải cookie) quyết định ai đang đăng nhập.</p>
<div class="pitfall">Đăng xuất ở đây là một liên kết GET cho demo gọn. Ứng dụng thật nên đăng xuất bằng POST (một form có nút bấm): nếu không, một site khác có thể đăng xuất người dùng của bạn bằng một thẻ <code>&lt;img src="…/logout"&gt;</code>.</div>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): Spring Security mặc định đổi mã session khi đăng nhập (<code>sessionFixation().changeSessionId()</code>) và có sẵn <code>rememberMe()</code> — thứ cất một token có chữ ký trong cookie, không phải tên đăng nhập.</div>`),
    bi(`<h3>🧪 Exercise 4 — A Vietnamese name in a cookie (~10 min)</h3>
<p>Remember the user's full name "Nguyễn Văn Cường" in a cookie for 30 days and show it on the next visit. First try the obvious code (<code>?raw=1</code>), then fix it.</p>
<p class="ghi-chu">📄 <code>ch4-cookie-dau/src/main/java/demo/NameCookieServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">if (v != null) {
    String value = (req.getParameter("raw") != null)
            ? v                                                  // ❌ "Nguyễn Văn Cường" as it is
            : URLEncoder.encode(v, StandardCharsets.UTF_8);      // ✅ "Nguy%E1%BB%85n+V%C4%83n+C%C6%B0%E1%BB%9Dng"
    Cookie c = new Cookie("fullName", value);
    c.setMaxAge(30 * 24 * 60 * 60);
    resp.addCookie(c);                                          // Tomcat validates the value HERE
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-cookie-dau/name?raw=1&amp;v=Nguy%E1%BB%85n+V%C4%83n+C%C6%B0%E1%BB%9Dng HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1666

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message An invalid character [32] was present in the Cookie value
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.IllegalArgumentException: An invalid character [32] was present in the Cookie value
org.apache.tomcat.util.http.Rfc6265CookieProcessor.validateCookieValue(Rfc6265CookieProcessor.java:243)
org.apache.tomcat.util.http.Rfc6265CookieProcessor.generateHeader(Rfc6265CookieProcessor.java:128)
org.apache.catalina.connector.Response.generateCookieString(Response.java:970)
org.apache.catalina.connector.Response.addCookie(Response.java:912)
org.apache.catalina.connector.ResponseFacade.addCookie(ResponseFacade.java:309)
demo.NameCookieServlet.doGet(NameCookieServlet.java:27)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Note The full stack trace of the root cause is available in the server logs.
Apache Tomcat/10.1.61</code></pre>
<p class="dap-an">✅ The 500 comes from <code>addCookie</code>, not from <code>new Cookie</code>: Tomcat's cookie processor (RFC 6265 rules) checks the value when it writes the header, and character 32 — the space — is not allowed; nor are commas, semicolons, quotes, backslashes or any non-ASCII letter. The fix: URL-encode before storing, decode after reading:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-cookie-dau/name?v=Nguy%E1%BB%85n+V%C4%83n+C%C6%B0%E1%BB%9Dng HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: fullName=Nguy%E1%BB%85n+V%C4%83n+C%C6%B0%E1%BB%9Dng; Max-Age=2592000; Expires=…
Content-Type: text/plain;charset=UTF-8
Content-Length: 20

cookie fullName set</code></pre>
<p class="ghi-chu">📄 <code>ch4-cookie-dau/src/main/java/demo/NameCookieServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">if (req.getCookies() != null) {
    for (Cookie c : req.getCookies()) {
        if (c.getName().equals("fullName")) {
            out.println("raw cookie value : " + c.getValue());
            out.println("decoded          : " + URLDecoder.decode(c.getValue(), StandardCharsets.UTF_8));
        }
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-cookie-dau/name HTTP/1.1
Host: localhost:8080
Cookie: fullName=Nguy%E1%BB%85n+V%C4%83n+C%C6%B0%E1%BB%9Dng</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 116

raw cookie value : Nguy%E1%BB%85n+V%C4%83n+C%C6%B0%E1%BB%9Dng
decoded          : Nguyễn Văn Cường
(read only)</code></pre>
<div class="pitfall">Learn to recognise the message <em>"An invalid character [32] was present in the Cookie value"</em> — [32] is a space, [44] a comma, [34] a double quote. It appears on Tomcat 8.5 and later (and Spring Boot), even though the same code "worked" on Tomcat 7.</div>`,
    `<h3>🧪 Bài 4 — Tên tiếng Việt trong cookie (~10 phút)</h3>
<p>Nhớ họ tên người dùng "Nguyễn Văn Cường" trong một cookie 30 ngày và hiện ra ở lần ghé sau. Thử code hiển nhiên trước (<code>?raw=1</code>), rồi sửa.</p>
<p class="ghi-chu">📄 <code>ch4-cookie-dau/src/main/java/demo/NameCookieServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">if (v != null) {
    String value = (req.getParameter("raw") != null)
            ? v                                                  // ❌ để nguyên "Nguyễn Văn Cường"
            : URLEncoder.encode(v, StandardCharsets.UTF_8);      // ✅ "Nguy%E1%BB%85n+V%C4%83n+C%C6%B0%E1%BB%9Dng"
    Cookie c = new Cookie("fullName", value);
    c.setMaxAge(30 * 24 * 60 * 60);
    resp.addCookie(c);                                          // Tomcat kiểm tra giá trị NGAY TẠI ĐÂY
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-cookie-dau/name?raw=1&amp;v=Nguy%E1%BB%85n+V%C4%83n+C%C6%B0%E1%BB%9Dng HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1666

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message An invalid character [32] was present in the Cookie value
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.IllegalArgumentException: An invalid character [32] was present in the Cookie value
org.apache.tomcat.util.http.Rfc6265CookieProcessor.validateCookieValue(Rfc6265CookieProcessor.java:243)
org.apache.tomcat.util.http.Rfc6265CookieProcessor.generateHeader(Rfc6265CookieProcessor.java:128)
org.apache.catalina.connector.Response.generateCookieString(Response.java:970)
org.apache.catalina.connector.Response.addCookie(Response.java:912)
org.apache.catalina.connector.ResponseFacade.addCookie(ResponseFacade.java:309)
demo.NameCookieServlet.doGet(NameCookieServlet.java:27)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Note The full stack trace of the root cause is available in the server logs.
Apache Tomcat/10.1.61</code></pre>
<p class="dap-an">✅ Lỗi 500 phát ra từ <code>addCookie</code>, không phải từ <code>new Cookie</code>: bộ xử lý cookie của Tomcat (theo luật RFC 6265) kiểm giá trị lúc viết header, và ký tự 32 — dấu cách — không được phép; dấu phẩy, chấm phẩy, ngoặc kép, gạch ngược hay chữ ngoài ASCII cũng vậy. Cách sửa: mã hoá URL trước khi cất, giải mã sau khi đọc:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-cookie-dau/name?v=Nguy%E1%BB%85n+V%C4%83n+C%C6%B0%E1%BB%9Dng HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: fullName=Nguy%E1%BB%85n+V%C4%83n+C%C6%B0%E1%BB%9Dng; Max-Age=2592000; Expires=…
Content-Type: text/plain;charset=UTF-8
Content-Length: 20

cookie fullName set</code></pre>
<p class="ghi-chu">📄 <code>ch4-cookie-dau/src/main/java/demo/NameCookieServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">if (req.getCookies() != null) {
    for (Cookie c : req.getCookies()) {
        if (c.getName().equals("fullName")) {
            out.println("raw cookie value : " + c.getValue());
            out.println("decoded          : " + URLDecoder.decode(c.getValue(), StandardCharsets.UTF_8));
        }
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-cookie-dau/name HTTP/1.1
Host: localhost:8080
Cookie: fullName=Nguy%E1%BB%85n+V%C4%83n+C%C6%B0%E1%BB%9Dng</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 116

raw cookie value : Nguy%E1%BB%85n+V%C4%83n+C%C6%B0%E1%BB%9Dng
decoded          : Nguyễn Văn Cường
(read only)</code></pre>
<div class="pitfall">Hãy nhận ra thông báo <em>"An invalid character [32] was present in the Cookie value"</em> — [32] là dấu cách, [44] dấu phẩy, [34] ngoặc kép. Nó xuất hiện từ Tomcat 8.5 trở đi (và cả Spring Boot), dù cùng đoạn code từng "chạy được" trên Tomcat 7.</div>`),
    bi(`<h3>🧪 Exercise 5 — Hidden form fields: state inside the page (~15 min)</h3>
<p>A two-step booking without any session: step 1 posts the room type; step 2's page carries the choice in <code>&lt;input type="hidden"&gt;</code> fields and asks for the number of nights; the confirmation computes the total. Then play the attacker: change the hidden price (F12, or send the POST yourself) and see who wins.</p>
<p class="ghi-chu">📄 <code>ch4-truong-an/src/main/java/demo/BookingServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setContentType("text/html;charset=UTF-8");
    PrintWriter out = resp.getWriter();
    String room = req.getParameter("room");
    if ("1".equals(req.getParameter("step"))) {
        // step 1 → page 2 remembers the choice in HIDDEN inputs (no session at all)
        out.println("&lt;form method=\\"post\\" action=\\"book\\"&gt;");
        out.println("&lt;input type=\\"hidden\\" name=\\"step\\" value=\\"2\\"&gt;");
        out.println("&lt;input type=\\"hidden\\" name=\\"room\\" value=\\"" + room + "\\"&gt;");
        out.println("&lt;input type=\\"hidden\\" name=\\"price\\" value=\\"" + PRICES.get(room) + "\\"&gt;");
        out.println("Room " + room + " — nights: &lt;input name=\\"nights\\" value=\\"1\\"&gt; &lt;button&gt;Confirm&lt;/button&gt;&lt;/form&gt;");
        return;
    }
    long price = Long.parseLong(req.getParameter("price"));          // ❌ the client decides the price
    int nights = Integer.parseInt(req.getParameter("nights"));
    out.println("&lt;p&gt;Booked " + room + " for " + nights + " night(s): total " + price * nights + " VND&lt;/p&gt;");
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch4-truong-an/book HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 18

step=1&amp;room=DELUXE</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 267

&lt;form method="post" action="book"&gt;
&lt;input type="hidden" name="step" value="2"&gt;
&lt;input type="hidden" name="room" value="DELUXE"&gt;
&lt;input type="hidden" name="price" value="1200000"&gt;
Room DELUXE — nights: &lt;input name="nights" value="1"&gt; &lt;button&gt;Confirm&lt;/button&gt;&lt;/form&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch4-truong-an/book HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 41

step=2&amp;room=DELUXE&amp;price=1200000&amp;nights=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 55

&lt;p&gt;Booked DELUXE for 2 night(s): total 2400000 VND&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch4-truong-an/book HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 35

step=2&amp;room=DELUXE&amp;price=1&amp;nights=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 49

&lt;p&gt;Booked DELUXE for 2 night(s): total 2 VND&lt;/p&gt;</code></pre>
<p class="dap-an">✅ No <code>Set-Cookie</code> anywhere: hidden fields need no session — the state is written into the HTML and comes back with the next POST. That is also their weakness: they are as editable as a text box, and the edited price produced a 2 VND booking. The safe version lets the hidden field only <em>identify</em> the choice and looks everything that matters up on the server:</p>
<p class="ghi-chu">📄 <code>ch4-truong-an/src/main/java/demo/SafeBookingServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    String room = req.getParameter("room");
    Long price = BookingServlet.PRICES.get(room);                   // price from the SERVER's table; "price" param ignored
    int nights;
    try {
        nights = Integer.parseInt(req.getParameter("nights"));
    } catch (NumberFormatException e) {
        nights = 0;
    }
    if (price == null || nights &lt; 1 || nights &gt; 30) {
        resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Unknown room or bad number of nights");
        return;
    }
    resp.setContentType("text/html;charset=UTF-8");
    resp.getWriter().println("&lt;p&gt;Booked " + room + " for " + nights + " night(s): total " + price * nights + " VND&lt;/p&gt;");
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch4-truong-an/book-safe HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 35

step=2&amp;room=DELUXE&amp;price=1&amp;nights=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 55

&lt;p&gt;Booked DELUXE for 2 night(s): total 2400000 VND&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch4-truong-an/book-safe HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 30

step=2&amp;room=PRESIDENT&amp;nights=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 821

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 400 – Bad Request
Type Status Report
Message Unknown room or bad number of nights
Description The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive req … (+14 chars / ký tự)
Apache Tomcat/10.1.61</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/55ee3b211ed321ed75b4c9ff2b7ec41ade509c13.svg" alt="The same tampered POST against the trusting and the safe servlet" loading="lazy" /><p class="chu-thich">🧩 The same tampered POST against the trusting and the safe servlet</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Hidden fields: state travels inside the page, so the user can change it (real run of /ch4-truong-an)
participant "Browser\\n(user can edit the form)" as B
participant "/book\\n(trusts the hidden price)" as U
participant "/book-safe\\n(looks the price up)" as S
B -&gt; U : POST step=1, room=DELUXE
U --&gt; B : page 2 with hidden room=DELUXE,\\nhidden price=1200000
note over B : F12 → edit price to 1\\n(or send the POST by hand)
B -&gt; U : POST step=2, room=DELUXE, price=1, nights=2
U --&gt; B : total 2 VND (wrong!)
B -&gt; S : POST step=2, room=DELUXE, price=1, nights=2
S -&gt; S : price = PRICES.get("DELUXE")\\n(the price parameter is ignored)
S --&gt; B : total 2400000 VND
@enduml</code></pre></details>
<div class="pitfall">Rule for the PE and the Assignment: the server re-checks everything that comes from the client — hidden fields, select options, prices, ids, roles. "The user cannot see it" is not protection. The unsafe servlet also prints <code>room</code> without escaping: a crafted value would inject HTML (XSS).</div>`,
    `<h3>🧪 Bài 5 — Ô ẩn trong form: trạng thái nằm trong trang (~15 phút)</h3>
<p>Đặt phòng hai bước, không có session nào: bước 1 gửi loại phòng; trang bước 2 mang lựa chọn đó trong các ô <code>&lt;input type="hidden"&gt;</code> và hỏi số đêm; trang xác nhận tính tổng tiền. Rồi đóng vai kẻ tấn công: sửa giá trong ô ẩn (F12, hoặc tự gửi POST) và xem ai thắng.</p>
<p class="ghi-chu">📄 <code>ch4-truong-an/src/main/java/demo/BookingServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setContentType("text/html;charset=UTF-8");
    PrintWriter out = resp.getWriter();
    String room = req.getParameter("room");
    if ("1".equals(req.getParameter("step"))) {
        // bước 1 → trang 2 nhớ lựa chọn bằng ô ẨN (không hề có session)
        out.println("&lt;form method=\\"post\\" action=\\"book\\"&gt;");
        out.println("&lt;input type=\\"hidden\\" name=\\"step\\" value=\\"2\\"&gt;");
        out.println("&lt;input type=\\"hidden\\" name=\\"room\\" value=\\"" + room + "\\"&gt;");
        out.println("&lt;input type=\\"hidden\\" name=\\"price\\" value=\\"" + PRICES.get(room) + "\\"&gt;");
        out.println("Room " + room + " — nights: &lt;input name=\\"nights\\" value=\\"1\\"&gt; &lt;button&gt;Confirm&lt;/button&gt;&lt;/form&gt;");
        return;
    }
    long price = Long.parseLong(req.getParameter("price"));          // ❌ client quyết định giá
    int nights = Integer.parseInt(req.getParameter("nights"));
    out.println("&lt;p&gt;Booked " + room + " for " + nights + " night(s): total " + price * nights + " VND&lt;/p&gt;");
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch4-truong-an/book HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 18

step=1&amp;room=DELUXE</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 267

&lt;form method="post" action="book"&gt;
&lt;input type="hidden" name="step" value="2"&gt;
&lt;input type="hidden" name="room" value="DELUXE"&gt;
&lt;input type="hidden" name="price" value="1200000"&gt;
Room DELUXE — nights: &lt;input name="nights" value="1"&gt; &lt;button&gt;Confirm&lt;/button&gt;&lt;/form&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch4-truong-an/book HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 41

step=2&amp;room=DELUXE&amp;price=1200000&amp;nights=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 55

&lt;p&gt;Booked DELUXE for 2 night(s): total 2400000 VND&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch4-truong-an/book HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 35

step=2&amp;room=DELUXE&amp;price=1&amp;nights=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 49

&lt;p&gt;Booked DELUXE for 2 night(s): total 2 VND&lt;/p&gt;</code></pre>
<p class="dap-an">✅ Không có <code>Set-Cookie</code> nào: ô ẩn không cần session — trạng thái được viết vào HTML và quay về cùng POST kế tiếp. Đó cũng là điểm yếu: chúng sửa được như một ô chữ, và giá bị sửa đã tạo ra một đơn đặt phòng 2 đồng. Bản an toàn chỉ để ô ẩn <em>cho biết</em> lựa chọn, còn mọi thứ quan trọng thì server tự tra:</p>
<p class="ghi-chu">📄 <code>ch4-truong-an/src/main/java/demo/SafeBookingServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    String room = req.getParameter("room");
    Long price = BookingServlet.PRICES.get(room);                   // giá lấy từ bảng của SERVER; bỏ qua tham số "price"
    int nights;
    try {
        nights = Integer.parseInt(req.getParameter("nights"));
    } catch (NumberFormatException e) {
        nights = 0;
    }
    if (price == null || nights &lt; 1 || nights &gt; 30) {
        resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Unknown room or bad number of nights");
        return;
    }
    resp.setContentType("text/html;charset=UTF-8");
    resp.getWriter().println("&lt;p&gt;Booked " + room + " for " + nights + " night(s): total " + price * nights + " VND&lt;/p&gt;");
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch4-truong-an/book-safe HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 35

step=2&amp;room=DELUXE&amp;price=1&amp;nights=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 55

&lt;p&gt;Booked DELUXE for 2 night(s): total 2400000 VND&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch4-truong-an/book-safe HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 30

step=2&amp;room=PRESIDENT&amp;nights=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 821

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 400 – Bad Request
Type Status Report
Message Unknown room or bad number of nights
Description The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive req … (+14 chars / ký tự)
Apache Tomcat/10.1.61</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/55ee3b211ed321ed75b4c9ff2b7ec41ade509c13.svg" alt="Cùng một POST bị sửa, gửi tới servlet cả tin và servlet an toàn" loading="lazy" /><p class="chu-thich">🧩 Cùng một POST bị sửa, gửi tới servlet cả tin và servlet an toàn</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Hidden fields: state travels inside the page, so the user can change it (real run of /ch4-truong-an)
participant "Browser\\n(user can edit the form)" as B
participant "/book\\n(trusts the hidden price)" as U
participant "/book-safe\\n(looks the price up)" as S
B -&gt; U : POST step=1, room=DELUXE
U --&gt; B : page 2 with hidden room=DELUXE,\\nhidden price=1200000
note over B : F12 → edit price to 1\\n(or send the POST by hand)
B -&gt; U : POST step=2, room=DELUXE, price=1, nights=2
U --&gt; B : total 2 VND (wrong!)
B -&gt; S : POST step=2, room=DELUXE, price=1, nights=2
S -&gt; S : price = PRICES.get("DELUXE")\\n(the price parameter is ignored)
S --&gt; B : total 2400000 VND
@enduml</code></pre></details>
<div class="pitfall">Luật cho PE và Assignment: server kiểm lại mọi thứ đến từ client — ô ẩn, lựa chọn trong select, giá, id, vai trò. "Người dùng không nhìn thấy" không phải là bảo vệ. Servlet không an toàn còn in <code>room</code> mà không thoát ký tự: một giá trị cố ý tạo ra sẽ chèn được HTML (XSS).</div>`),
    bi(`<h3>🧪 Exercise 6 — Harden the session cookie in web.xml (~10 min)</h3>
<p>Without touching Java code: sessions expire after 15 idle minutes; the JSESSIONID cookie must be invisible to JavaScript, sent only over HTTPS, not sent with POSTs from other sites; and the session ID must never appear in a URL.</p>
<p class="ghi-chu">📄 <code>ch4-cookie-an-toan/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;session-config&gt;
        &lt;session-timeout&gt;15&lt;/session-timeout&gt;              &lt;!-- MINUTES --&gt;
        &lt;cookie-config&gt;
            &lt;http-only&gt;true&lt;/http-only&gt;                    &lt;!-- JavaScript cannot read it (XSS cannot steal it) --&gt;
            &lt;secure&gt;true&lt;/secure&gt;                          &lt;!-- browser sends it over HTTPS only --&gt;
            &lt;attribute&gt;                                    &lt;!-- Servlet 6.0: any cookie attribute --&gt;
                &lt;attribute-name&gt;SameSite&lt;/attribute-name&gt;
                &lt;attribute-value&gt;Lax&lt;/attribute-value&gt;     &lt;!-- not sent on cross-site POSTs (CSRF) --&gt;
            &lt;/attribute&gt;
        &lt;/cookie-config&gt;
        &lt;tracking-mode&gt;COOKIE&lt;/tracking-mode&gt;              &lt;!-- no URL rewriting: the id never appears in a URL --&gt;
    &lt;/session-config&gt;
&lt;/web-app&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-cookie-an-toan/info HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/ch4-cookie-an-toan; Secure; HttpOnly; SameSite=Lax
Content-Type: text/plain;charset=UTF-8
Content-Length: 111

tracking modes      : [COOKIE]
time-out (seconds)  : 900
encodeURL("cart")   : cart
id asked for in URL : null</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch4-cookie-an-toan/info;jsessionid=ABC123 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/ch4-cookie-an-toan; Secure; HttpOnly; SameSite=Lax
Content-Type: text/plain;charset=UTF-8
Content-Length: 111

tracking modes      : [COOKIE]
time-out (seconds)  : 900
encodeURL("cart")   : cart
id asked for in URL : null</code></pre>
<p class="dap-an">✅ The Set-Cookie line now reads <code>Secure; HttpOnly; SameSite=Lax</code>; the time-out is 900 s (15 minutes × 60); <code>encodeURL("cart")</code> returns plain <code>cart</code> even on the very first response (compare slide 19, where it added <code>;jsessionid=…</code>); and an id pasted into the URL is ignored — <code>getRequestedSessionId()</code> is <code>null</code> and a fresh session is created, so nobody can hand a victim a session through a link. <code>&lt;attribute&gt;</code> inside <code>&lt;cookie-config&gt;</code> is new in Servlet 6.0 (Tomcat 10.1); the order of elements follows the schema: timeout, cookie-config, tracking-mode.</p>
<div class="pitfall"><code>Secure</code> means the browser will not send the cookie over plain <code>http://</code>. Browsers make an exception for <code>localhost</code>, but on a LAN address (<code>http://192.168.1.5:8080</code>) login would silently "not stick". Turn it on where the site really runs on HTTPS.</div>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): the same settings in <code>application.properties</code> — <code>server.servlet.session.timeout=15m</code>, <code>server.servlet.session.cookie.http-only=true</code>, <code>server.servlet.session.cookie.secure=true</code>, <code>server.servlet.session.cookie.same-site=lax</code>, <code>server.servlet.session.tracking-modes=cookie</code>.</div>`,
    `<h3>🧪 Bài 6 — Gia cố cookie session trong web.xml (~10 phút)</h3>
<p>Không đụng vào code Java: session hết hạn sau 15 phút rảnh; cookie JSESSIONID phải vô hình với JavaScript, chỉ gửi qua HTTPS, không gửi kèm POST từ site khác; và mã session không bao giờ xuất hiện trên URL.</p>
<p class="ghi-chu">📄 <code>ch4-cookie-an-toan/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;session-config&gt;
        &lt;session-timeout&gt;15&lt;/session-timeout&gt;              &lt;!-- PHÚT --&gt;
        &lt;cookie-config&gt;
            &lt;http-only&gt;true&lt;/http-only&gt;                    &lt;!-- JavaScript không đọc được (XSS không lấy cắp được) --&gt;
            &lt;secure&gt;true&lt;/secure&gt;                          &lt;!-- trình duyệt chỉ gửi qua HTTPS --&gt;
            &lt;attribute&gt;                                    &lt;!-- Servlet 6.0: thuộc tính cookie bất kỳ --&gt;
                &lt;attribute-name&gt;SameSite&lt;/attribute-name&gt;
                &lt;attribute-value&gt;Lax&lt;/attribute-value&gt;     &lt;!-- không gửi kèm POST từ site khác (CSRF) --&gt;
            &lt;/attribute&gt;
        &lt;/cookie-config&gt;
        &lt;tracking-mode&gt;COOKIE&lt;/tracking-mode&gt;              &lt;!-- không viết lại URL: id không bao giờ hiện trên URL --&gt;
    &lt;/session-config&gt;
&lt;/web-app&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-cookie-an-toan/info HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/ch4-cookie-an-toan; Secure; HttpOnly; SameSite=Lax
Content-Type: text/plain;charset=UTF-8
Content-Length: 111

tracking modes      : [COOKIE]
time-out (seconds)  : 900
encodeURL("cart")   : cart
id asked for in URL : null</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch4-cookie-an-toan/info;jsessionid=ABC123 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/ch4-cookie-an-toan; Secure; HttpOnly; SameSite=Lax
Content-Type: text/plain;charset=UTF-8
Content-Length: 111

tracking modes      : [COOKIE]
time-out (seconds)  : 900
encodeURL("cart")   : cart
id asked for in URL : null</code></pre>
<p class="dap-an">✅ Dòng Set-Cookie giờ ghi <code>Secure; HttpOnly; SameSite=Lax</code>; thời hạn là 900 giây (15 phút × 60); <code>encodeURL("cart")</code> trả về <code>cart</code> trơn ngay cả ở response đầu tiên (so với slide 19, nơi nó thêm <code>;jsessionid=…</code>); và id dán vào URL bị bỏ qua — <code>getRequestedSessionId()</code> là <code>null</code> và một session mới được tạo, nên không ai trao được session cho nạn nhân qua một đường link. <code>&lt;attribute&gt;</code> trong <code>&lt;cookie-config&gt;</code> là thứ mới của Servlet 6.0 (Tomcat 10.1); thứ tự các phần tử theo schema: timeout, cookie-config, tracking-mode.</p>
<div class="pitfall"><code>Secure</code> nghĩa là trình duyệt không gửi cookie qua <code>http://</code> trơn. Trình duyệt chừa ngoại lệ cho <code>localhost</code>, nhưng với địa chỉ mạng LAN (<code>http://192.168.1.5:8080</code>) đăng nhập sẽ âm thầm "không giữ được". Chỉ bật nó ở nơi site thật sự chạy HTTPS.</div>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): cùng các thiết lập đó trong <code>application.properties</code> — <code>server.servlet.session.timeout=15m</code>, <code>server.servlet.session.cookie.http-only=true</code>, <code>server.servlet.session.cookie.secure=true</code>, <code>server.servlet.session.cookie.same-site=lax</code>, <code>server.servlet.session.tracking-modes=cookie</code>.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>state</strong></td><td>trạng thái</td><td>Data that must survive from one request to the next (a cart, the logged-in user).</td></tr>
<tr><td><strong>stateless</strong></td><td>không trạng thái</td><td>HTTP forgets everything between requests; each request stands alone.</td></tr>
<tr><td><strong>scope</strong></td><td>phạm vi</td><td>Where an attribute lives and who sees it: page, request, session, application.</td></tr>
<tr><td><strong>ServletContext</strong></td><td>ngữ cảnh ứng dụng</td><td>The one object per web application; its attributes are the application scope.</td></tr>
<tr><td><strong>HttpSession</strong></td><td>phiên làm việc</td><td>The server-side object that holds one browser's data across many requests.</td></tr>
<tr><td><strong>session ID</strong></td><td>mã phiên</td><td>The random, unguessable id (JSESSIONID) that links a browser to its session.</td></tr>
<tr><td><strong>session cookie</strong></td><td>cookie phiên</td><td>A cookie without Max-Age, kept in browser memory and dropped when the browser closes.</td></tr>
<tr><td><strong>persistent cookie</strong></td><td>cookie bền</td><td>A cookie with Max-Age (seconds), stored on disk until it expires or is deleted with Max-Age=0.</td></tr>
<tr><td><strong>URL rewriting</strong></td><td>viết lại URL</td><td>Putting ;jsessionid=… into URLs with encodeURL so the session works without cookies.</td></tr>
<tr><td><strong>hidden field</strong></td><td>ô ẩn</td><td>An input type="hidden" that carries state inside the page; the user can still edit it.</td></tr>
<tr><td><strong>session time-out</strong></td><td>thời hạn phiên</td><td>Idle time after which a session dies: minutes in web.xml, seconds in setMaxInactiveInterval; 0 or less = never.</td></tr>
<tr><td><strong>invalidate</strong></td><td>huỷ phiên</td><td>End a session now and unbind all its attributes (logout).</td></tr>
<tr><td><strong>session fixation</strong></td><td>cố định phiên</td><td>An attack that makes a victim log in with a session id the attacker knows; defeated by changeSessionId at login.</td></tr>
<tr><td><strong>thread-safe</strong></td><td>an toàn luồng</td><td>Correct even when many threads use it at once; servlets and shared session objects need it.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>state</strong></td><td>trạng thái</td><td>Dữ liệu phải sống từ request này sang request sau (giỏ hàng, người đang đăng nhập).</td></tr>
<tr><td><strong>stateless</strong></td><td>không trạng thái</td><td>HTTP quên sạch giữa các request; mỗi request đứng một mình.</td></tr>
<tr><td><strong>scope</strong></td><td>phạm vi</td><td>Nơi một attribute sống và ai thấy nó: page, request, session, application.</td></tr>
<tr><td><strong>ServletContext</strong></td><td>ngữ cảnh ứng dụng</td><td>Đối tượng duy nhất của mỗi ứng dụng web; các attribute của nó là phạm vi application.</td></tr>
<tr><td><strong>HttpSession</strong></td><td>phiên làm việc</td><td>Đối tượng phía server giữ dữ liệu của một trình duyệt qua nhiều request.</td></tr>
<tr><td><strong>session ID</strong></td><td>mã phiên</td><td>Mã ngẫu nhiên, không đoán được (JSESSIONID) nối một trình duyệt với session của nó.</td></tr>
<tr><td><strong>session cookie</strong></td><td>cookie phiên</td><td>Cookie không có Max-Age, giữ trong bộ nhớ trình duyệt và mất khi đóng trình duyệt.</td></tr>
<tr><td><strong>persistent cookie</strong></td><td>cookie bền</td><td>Cookie có Max-Age (giây), lưu trên đĩa tới khi hết hạn hoặc bị xoá bằng Max-Age=0.</td></tr>
<tr><td><strong>URL rewriting</strong></td><td>viết lại URL</td><td>Đưa ;jsessionid=… vào URL bằng encodeURL để session chạy được khi không có cookie.</td></tr>
<tr><td><strong>hidden field</strong></td><td>ô ẩn</td><td>Một input type="hidden" mang trạng thái bên trong trang; người dùng vẫn sửa được.</td></tr>
<tr><td><strong>session time-out</strong></td><td>thời hạn phiên</td><td>Thời gian rảnh mà quá thì session chết: phút trong web.xml, giây trong setMaxInactiveInterval; 0 hoặc âm = không bao giờ.</td></tr>
<tr><td><strong>invalidate</strong></td><td>huỷ phiên</td><td>Kết thúc session ngay và gỡ mọi attribute của nó (đăng xuất).</td></tr>
<tr><td><strong>session fixation</strong></td><td>cố định phiên</td><td>Tấn công khiến nạn nhân đăng nhập bằng mã session kẻ tấn công đã biết; chặn bằng changeSessionId khi đăng nhập.</td></tr>
<tr><td><strong>thread-safe</strong></td><td>an toàn luồng</td><td>Vẫn đúng khi nhiều luồng dùng cùng lúc; servlet và đối tượng dùng chung trong session cần điều này.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 4</h2>
<ol>
<li>HTTP is stateless; the container keeps state for you in four scopes: page (one JSP) &lt; request (one request, survives forward, not redirect) &lt; session (one browser) &lt; application (everyone).</li>
<li>One servlet object, many threads: per-user data goes in the session, never in fields; shared objects must be thread-safe.</li>
<li><code>&lt;context-param&gt;</code> + <code>getServletContext().getInitParameter</code> for the app; <code>&lt;init-param&gt;</code> + <code>getServletConfig().getInitParameter</code> for one servlet.</li>
<li><code>getSession()</code> to store, <code>getSession(false)</code> to check; attributes hold references; logout = <code>invalidate()</code>.</li>
<li>Time-out: minutes in web.xml, seconds in code, 0 or less = never; it counts from the last request that carried the session id.</li>
<li>The session ID travels in the JSESSIONID cookie or, via <code>encodeURL</code>, in the URL; production uses cookies only, HttpOnly + Secure + SameSite.</li>
<li>Cookies: <code>new Cookie</code>, <code>setMaxAge</code> (seconds; 0 deletes), <code>addCookie</code>, <code>getCookies()</code> may be null; only ASCII without spaces — URL-encode Vietnamese.</li>
<li>Never trust the client: prices, roles and identity stay on the server; give a new session ID at login.</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 4</h2>
<ol>
<li>HTTP không trạng thái; container giữ trạng thái giùm bạn trong bốn scope: page (một JSP) &lt; request (một request, sống qua forward, không qua redirect) &lt; session (một trình duyệt) &lt; application (mọi người).</li>
<li>Một đối tượng servlet, nhiều luồng: dữ liệu riêng từng người để trong session, không bao giờ trong trường; đối tượng dùng chung phải an toàn luồng.</li>
<li><code>&lt;context-param&gt;</code> + <code>getServletContext().getInitParameter</code> cho cả ứng dụng; <code>&lt;init-param&gt;</code> + <code>getServletConfig().getInitParameter</code> cho một servlet.</li>
<li><code>getSession()</code> để cất, <code>getSession(false)</code> để kiểm tra; attribute giữ tham chiếu; đăng xuất = <code>invalidate()</code>.</li>
<li>Thời hạn: phút trong web.xml, giây trong code, 0 hoặc âm = không bao giờ; tính từ request cuối cùng có mang mã session.</li>
<li>Mã session đi trong cookie JSESSIONID hoặc, qua <code>encodeURL</code>, trong URL; chạy thật thì chỉ dùng cookie, kèm HttpOnly + Secure + SameSite.</li>
<li>Cookie: <code>new Cookie</code>, <code>setMaxAge</code> (giây; 0 là xoá), <code>addCookie</code>, <code>getCookies()</code> có thể null; chỉ ASCII không dấu cách — tiếng Việt phải mã hoá URL.</li>
<li>Đừng tin client: giá, vai trò và danh tính ở lại server; cấp mã session mới khi đăng nhập.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (prj301-quiz-1) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) HTTP is stateless. How does Tomcat know that a second request comes from the same browser as the first?|||(Dạng câu FE) HTTP không trạng thái. Làm sao Tomcat biết request thứ hai đến từ cùng trình duyệt với request đầu?',
      options: ['It compares the IP address of the two requests|||Nó so địa chỉ IP của hai request', 'The first response sent Set-Cookie: JSESSIONID=…, and the browser sends it back in a Cookie header|||Response đầu gửi Set-Cookie: JSESSIONID=…, và trình duyệt gửi nó lại trong header Cookie', 'HTTP/1.1 keeps one connection per user, so the server remembers it|||HTTP/1.1 giữ một kết nối cho mỗi người dùng, nên server nhớ được', 'The servlet stores the user in one of its fields|||Servlet cất người dùng vào một trường của nó'],
      correctIndex: 1,
      points: 1,
      explanation: 'The real run of lesson 4.A slide 18: the first response carries Set-Cookie: JSESSIONID=…; Path=/phien-cookie; HttpOnly and the second request carries Cookie: JSESSIONID=…, so getSession() finds the same session (isNew = false). IP addresses are shared by many users behind one router, connections are closed and reopened freely, and a servlet field is shared by everyone (slide 4).|||Lần chạy thật ở bài 4.A slide 18: response đầu mang Set-Cookie: JSESSIONID=…; Path=/phien-cookie; HttpOnly và request thứ hai mang Cookie: JSESSIONID=…, nên getSession() tìm thấy cùng session (isNew = false). Địa chỉ IP bị nhiều người dùng chung sau một router, kết nối đóng mở tuỳ ý, còn trường của servlet là của chung mọi người (slide 4).' },
    { id: 'q2',
      question: '(FE question type) A login form uses method="GET". What is the problem?|||(Dạng câu FE) Một form đăng nhập dùng method="GET". Vấn đề là gì?',
      options: ['GET encrypts the password, so the server cannot read it|||GET mã hoá mật khẩu nên server không đọc được', 'GET cannot carry more than one parameter|||GET không mang được quá một tham số', 'The password appears in the URL: in the address bar, the history and the server logs|||Mật khẩu hiện trên URL: ở thanh địa chỉ, lịch sử duyệt web và log của server', 'There is no problem; GET and POST send data the same way|||Không có vấn đề gì; GET và POST gửi dữ liệu như nhau'],
      correctIndex: 2,
      points: 1,
      explanation: 'Chapter 1: GET puts form data in the query string of the URL (…/login?user=cuong&pass=…), which is shown, saved in history and written to access logs. POST puts it in the request body. Neither encrypts anything — only HTTPS does. GET is also meant to be safe (no changes), and logging in changes state.|||Chương 1: GET đặt dữ liệu form vào chuỗi truy vấn của URL (…/login?user=cuong&pass=…), thứ được hiển thị, lưu vào lịch sử và ghi vào access log. POST đặt nó trong body của request. Không cái nào mã hoá — chỉ HTTPS làm việc đó. GET còn được quy ước là an toàn (không đổi gì), mà đăng nhập thì làm đổi trạng thái.' },
    { id: 'q3',
      question: '(FE question type) A servlet runs request.setAttribute("message", "saved"); then response.sendRedirect("result.jsp");. What does result.jsp find in request scope?|||(Dạng câu FE) Một servlet chạy request.setAttribute("message", "saved"); rồi response.sendRedirect("result.jsp");. result.jsp thấy gì trong request scope?',
      options: ['Nothing: the redirect makes the browser send a new request, and the attribute belonged to the old one|||Không có gì: redirect bắt trình duyệt gửi request mới, còn attribute thuộc về request cũ', '"saved", because attributes follow the user|||"saved", vì attribute đi theo người dùng', '"saved", but only if the JSP is in the same folder|||"saved", nhưng chỉ khi JSP nằm cùng thư mục', 'The container converts it into a session attribute automatically|||Container tự đổi nó thành attribute của session'],
      correctIndex: 0,
      points: 1,
      explanation: 'Practice 4.4, exercise 1, real run: after ?go=redirect the response is 302 Location: scope?view=only, and the next request prints "request : (nothing)" while the session counter is still there. A forward keeps the same request object (the attribute survives); a redirect is a new request. To carry a message across a redirect, use the session or the URL.|||Bài thực hành 4.4, bài 1, chạy thật: sau ?go=redirect response là 302 Location: scope?view=only, và request kế tiếp in "request : (nothing)" trong khi bộ đếm session vẫn còn. Forward giữ cùng đối tượng request (attribute sống sót); redirect là một request mới. Muốn mang thông báo qua redirect, dùng session hoặc URL.' },
    { id: 'q4',
      question: "Alice requests /chao-sai?name=Alice. A moment later Bob, from another computer, requests /chao-sai with no parameter. What does Bob's page say?|||Alice gọi /chao-sai?name=Alice. Lát sau Bob, từ một máy khác, gọi /chao-sai không kèm tham số. Trang của Bob hiện gì?",
      code: `@WebServlet("/chao-sai")
public class GreetFieldServlet extends HttpServlet {
    private String name;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (req.getParameter("name") != null) name = req.getParameter("name");
        resp.getWriter().println("Hello, " + (name == null ? "stranger" : name));
    }
}`,
      codeLang: 'java',
      options: ['Hello, stranger|||Hello, stranger', 'Hello, Bob|||Hello, Bob', 'Nothing: a NullPointerException gives a 500|||Không gì cả: NullPointerException gây lỗi 500', 'Hello, Alice|||Hello, Alice'],
      correctIndex: 3,
      points: 1,
      explanation: "The container creates ONE object per servlet and runs every user's request on it (spec §2.2), so the field name is shared: the real run of lesson 4.A slide 4 printed \"Hello, Alice\" to Bob, then \"served by servlet object #1 (objects created: 1)\" (the code above is that servlet, shortened). Per-user data belongs in the session; per-request data in local variables.|||Container tạo MỘT đối tượng cho mỗi servlet và chạy request của mọi người dùng trên nó (đặc tả §2.2), nên trường name là của chung: lần chạy thật ở bài 4.A slide 4 in cho Bob \"Hello, Alice\", rồi \"served by servlet object #1 (objects created: 1)\" (code ở trên là servlet đó, rút gọn). Dữ liệu riêng từng người thuộc về session; dữ liệu của một request để trong biến cục bộ." },
    { id: 'q5',
      question: "(FE question type) After login a servlet runs session.setAttribute(\"user\", u), where u has a getName() method. Which EL expression prints the user's name in a JSP?|||(Dạng câu FE) Sau đăng nhập, servlet chạy session.setAttribute(\"user\", u), trong đó u có phương thức getName(). Biểu thức EL nào in tên người dùng trong JSP?",
      options: ['${sessionScope.user.name}|||${sessionScope.user.name}', '${session.user.name}|||${session.user.name}', '${requestScope.user.name}|||${requestScope.user.name}', '${user.getName}|||${user.getName}'],
      correctIndex: 0,
      points: 1,
      explanation: 'sessionScope is the EL implicit object for session attributes, and .name calls getName() (Chapter 3). "session" is not an EL implicit object (it is a JSP scripting variable), so B looks for an attribute called "session" and prints nothing; the attribute is not in request scope (C); and .getName would look for a property getGetName. The view of practice 4.4 exercise 2 reads sessionScope.cart the same way.|||sessionScope là đối tượng ngầm định của EL cho attribute của session, và .name gọi getName() (Chương 3). "session" không phải đối tượng ngầm định của EL (nó là biến của scriptlet JSP), nên B đi tìm một attribute tên "session" và không in gì; attribute không nằm trong request scope (C); còn .getName sẽ đi tìm thuộc tính getGetName. View của bài thực hành 4.4 bài 2 đọc sessionScope.cart đúng theo cách này.' },
    { id: 'q6',
      question: '(FE question type) A value is declared in web.xml with <context-param>. Who can read it?|||(Dạng câu FE) Một giá trị được khai trong web.xml bằng <context-param>. Ai đọc được nó?',
      options: ['Only the servlet declared just above it|||Chỉ servlet được khai ngay phía trên nó', 'Every web application running in the same Tomcat|||Mọi ứng dụng web chạy trong cùng Tomcat', 'Every servlet and JSP of this web application, through getServletContext().getInitParameter(…)|||Mọi servlet và JSP của ứng dụng web này, qua getServletContext().getInitParameter(…)', 'The browser, through request.getParameter(…)|||Trình duyệt, qua request.getParameter(…)'],
      correctIndex: 2,
      points: 1,
      explanation: "Lesson 4.A slides 9–13, real run of /phien-tham-so: both InitParamaters and OtherServlet read machineName = GERALDINE, while asking the ServletConfig for it returned null. A per-servlet value is an <init-param> (A). Contexts are isolated from each other (B — getContext(\"/orders\") returned null). request.getParameter reads the user's data, not configuration (D).|||Bài 4.A slide 9–13, chạy thật /phien-tham-so: cả InitParamaters lẫn OtherServlet đều đọc được machineName = GERALDINE, còn hỏi ServletConfig thì nhận null. Giá trị riêng một servlet là <init-param> (A). Các context tách biệt nhau (B — getContext(\"/orders\") trả null). request.getParameter đọc dữ liệu người dùng, không phải cấu hình (D)." },
    { id: 'q7',
      question: '(FE question type) What does request.getSession(false) return when this browser has no session yet?|||(Dạng câu FE) request.getSession(false) trả về gì khi trình duyệt này chưa có session?',
      options: ['A new, empty session|||Một session mới, rỗng', 'null|||null', 'It throws IllegalStateException|||Nó ném IllegalStateException', 'The most recent session of any user|||Session gần nhất của bất kỳ người dùng nào'],
      correctIndex: 1,
      points: 1,
      explanation: 'false means "do not create". It is the call for checking login: the protected page of practice 4.4 exercise 3 redirected a stranger to the login page without creating a session (no Set-Cookie in that response). getSession() / getSession(true) is the one that creates. IllegalStateException is what you get when you use a session after invalidate() (slide 15).|||false nghĩa là "đừng tạo". Đây là lời gọi để kiểm tra đăng nhập: trang được bảo vệ của bài thực hành 4.4 bài 3 đưa người lạ về trang đăng nhập mà không tạo session (response đó không có Set-Cookie). getSession() / getSession(true) mới là cái tạo mới. IllegalStateException là thứ bạn nhận khi dùng session sau invalidate() (slide 15).' },
    { id: 'q8',
      question: 'web.xml contains <session-timeout>30</session-timeout>, and for one user the code calls session.setMaxInactiveInterval(0). Which statement is correct?|||web.xml có <session-timeout>30</session-timeout>, và với một người dùng code gọi session.setMaxInactiveInterval(0). Câu nào đúng?',
      options: ["Sessions of the app expire after 30 seconds; that user's session is destroyed immediately|||Session của ứng dụng hết hạn sau 30 giây; session của người dùng đó bị huỷ ngay", "Sessions of the app expire after 30 hours; that user's session expires after 0 minutes|||Session của ứng dụng hết hạn sau 30 giờ; session của người dùng đó hết hạn sau 0 phút", 'The code is ignored because web.xml always wins|||Lời gọi trong code bị bỏ qua vì web.xml luôn thắng', "Sessions of the app expire after 30 idle minutes; that user's session never times out|||Session của ứng dụng hết hạn sau 30 phút rảnh; session của người dùng đó không bao giờ hết hạn"],
      correctIndex: 3,
      points: 1,
      explanation: '<session-timeout> is in MINUTES, setMaxInactiveInterval in SECONDS, and an individual setting overrides the app default for that one session. "Zero or less" means never (slide 15, Servlet 3.0+): the real run kept a session with interval 0 alive after 3 seconds of absence, while one with interval 2 had expired. An old FE answer key treats 0 as "invalidate now" — that is outdated; call invalidate() for that.|||<session-timeout> tính bằng PHÚT, setMaxInactiveInterval bằng GIÂY, và thiết lập riêng ghi đè mặc định của ứng dụng cho đúng session đó. "Bằng 0 hoặc âm" nghĩa là không bao giờ (slide 15, Servlet 3.0+): lần chạy thật giữ sống session có hạn 0 sau 3 giây vắng mặt, trong khi session hạn 2 giây đã hết hạn. Một đáp án FE cũ coi 0 là "huỷ ngay" — đã lỗi thời; muốn vậy hãy gọi invalidate().' },
    { id: 'q9',
      question: '(FE question type) Which method puts the session ID into a link so that the session also works when the browser refuses cookies?|||(Dạng câu FE) Phương thức nào đưa session ID vào một liên kết để session vẫn chạy khi trình duyệt từ chối cookie?',
      options: ['encodeURL() of HttpServletResponse|||encodeURL() của HttpServletResponse', 'encodeURL() of HttpServletRequest|||encodeURL() của HttpServletRequest', 'rewriteURL() of HttpServletResponse|||rewriteURL() của HttpServletResponse', 'addCookie() of HttpServletResponse|||addCookie() của HttpServletResponse'],
      correctIndex: 0,
      points: 1,
      explanation: 'Slide 19, real run of /phien-url: on the first response Tomcat sent Set-Cookie AND turned encodeURL("shop?name=value") into shop;jsessionid=…?name=value; a client without cookies that followed that link kept one session (Views 1, 2, 3). The request has no encodeURL and rewriteURL does not exist; addCookie is the cookie mechanism, useless when cookies are refused. For redirects use encodeRedirectURL.|||Slide 19, chạy thật /phien-url: ở response đầu Tomcat gửi Set-Cookie VÀ biến encodeURL("shop?name=value") thành shop;jsessionid=…?name=value; một client không cookie đi theo liên kết đó vẫn giữ một session (Views 1, 2, 3). Request không có encodeURL và rewriteURL không tồn tại; addCookie là cơ chế cookie, vô dụng khi cookie bị từ chối. Với chuyển hướng thì dùng encodeRedirectURL.' },
    { id: 'q10',
      question: 'new Cookie("name", "Văn A") makes Tomcat 10.1 answer 500 ("An invalid character [32] was present in the Cookie value"). The fix stores URLEncoder.encode("Văn A", StandardCharsets.UTF_8) instead. What is the cookie value then?|||new Cookie("name", "Văn A") làm Tomcat 10.1 trả 500 ("An invalid character [32] was present in the Cookie value"). Cách sửa là cất URLEncoder.encode("Văn A", StandardCharsets.UTF_8). Khi đó giá trị cookie là gì?',
      options: ['Văn A|||Văn A', 'V%C4%83n+A|||V%C4%83n+A', 'V%C4%83n%20A|||V%C4%83n%20A', 'Van A|||Van A'],
      correctIndex: 1,
      points: 1,
      explanation: 'Output of the real program: URLEncoder writes each byte of the UTF-8 form of "ă" as %C4%83 and the space as + (form encoding, not %20). The cookie value then contains only allowed ASCII characters; URLDecoder.decode gives "Văn A" back (practice 4.4, exercise 4). Character [32] in the error is the space.|||Output của chương trình thật: URLEncoder viết từng byte của dạng UTF-8 của "ă" thành %C4%83 và dấu cách thành + (kiểu mã hoá form, không phải %20). Khi đó giá trị cookie chỉ còn ký tự ASCII được phép; URLDecoder.decode trả lại "Văn A" (bài thực hành 4.4, bài 4). Ký tự [32] trong thông báo lỗi chính là dấu cách.' },
  ],
};

export default {
  slides: [L_prj5_1],
  practice: L_on_ch4,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 1–4 viết lại theo dạng câu FE PRJ301, mỗi câu có giải thích song ngữ và đáp án đã kiểm bằng ứng dụng chạy thật trên Tomcat 10.1: HTTP không trạng thái và cặp header Set-Cookie/Cookie, GET để lộ dữ liệu trên URL, attribute của request mất sau sendRedirect, trường của servlet bị mọi người dùng chung, EL đọc sessionScope, context-param dùng cho cả ứng dụng, getSession(false), đơn vị thời hạn session và setMaxInactiveInterval(0), encodeURL để viết lại URL, mã hoá tên tiếng Việt trước khi cho vào cookie.',
};
