/**
 * PRJ301 · Mục 0 — bốn bài ⭐ nền: bắt đầu, cách học, cài môi trường, buổi đầu tiên.
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRJ301/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRJ301/gen/gen.mjs`.
 */

import { bi } from './_slides.mjs';

/* ───────── ⭐ Start here (1/2) — What PRJ301 is, a short dated history (CGI → Servlet → Jakarta EE), and why it matters ───────── */
const L_x_bat_dau_tai_day = {
  title: '⭐ Start here (1/2) — What PRJ301 is, a short dated history (CGI → Servlet → Jakarta EE), and why it matters|||⭐ Bắt đầu tại đây (1/2) — PRJ301 là gì, lịch sử ngắn có mốc năm (CGI → Servlet → Jakarta EE), và vì sao quan trọng',
  slug: 'prj301-bat-dau-tai-day',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài định hướng tự thêm ngoài giáo trình: PRJ301 là môn gì và nằm ở đâu trong lộ trình (sau PRO192, DBI202; trước SWP391 và đồ án), lịch sử ngắn có mốc năm đã tra (web 1989–91, CGI 1993, Servlet 1997, Tomcat 1998, JSP 1999, J2EE 1999, Java EE 2006, Jakarta EE 2019, đổi javax → jakarta 2020, Spring Boot 3 năm 2022), vì sao slide viết javax mà code phải viết jakarta, bốn lý do môn này quan trọng (Assignment 10 yêu cầu ↔ chương, PE 30% + FE 20%, nền của Spring Boot cho đồ án LabFlow, câu phỏng vấn fresher), nói thật phần nào nhẹ và nên dồn sức vào đâu — kèm sơ đồ Spring Boot dựng trên servlet.',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ Start here 1/2 · added by this site, not part of the school slides</span>
<h2>Before the slides: what "Java web application development" means, and why it is worth your effort</h2>
<p class="lead">PRO192 taught you Java; DBI202 taught you SQL. PRJ301 is where they meet for the first time in something people actually use: a <strong>website</strong> whose pages are produced by Java code reading and writing a database. By the end you build a full application — login, roles, search, CRUD, payment — which is exactly what the Assignment asks for and what every web project after this (SWP391, your capstone) is made of.</p>
<div class="callout"><p><strong>How Section 0 is arranged.</strong> The four ⭐ lessons at the top (this one, "How to study", "Installing the environment", "First hands-on session") are written for this site. Below them are the older lessons 0.1–0.3 (course map, passing rules, a short setup note). PRJ301 has no school "Chapter 0" deck: the first school deck (Slot 1–5) starts in Chapter 1.</p></div>`,
    `<span class="eyebrow">Mục 0 · ⭐ Bắt đầu tại đây 1/2 · phần web tự thêm, không có trong slide trường</span>
<h2>Trước khi vào slide: "phát triển ứng dụng Java web" nghĩa là gì, và vì sao đáng bỏ công</h2>
<p class="lead">PRO192 dạy bạn Java; DBI202 dạy bạn SQL. PRJ301 là nơi hai thứ đó lần đầu gặp nhau trong một sản phẩm người ta dùng thật: một <strong>website</strong> mà các trang do code Java tạo ra, đọc và ghi vào cơ sở dữ liệu. Cuối môn bạn dựng trọn một ứng dụng — đăng nhập, phân quyền, tìm kiếm, CRUD (thêm/đọc/sửa/xoá), thanh toán — đúng thứ Assignment đòi, và cũng là thứ mọi dự án web sau này (SWP391, đồ án tốt nghiệp) được làm nên.</p>
<div class="callout"><p><strong>Mục 0 được sắp thế nào.</strong> Bốn bài ⭐ ở đầu (bài này, "Học thế nào", "Cài môi trường", "Buổi thực hành đầu tiên") là phần web tự viết. Bên dưới là các bài cũ 0.1–0.3 (bản đồ môn, điều kiện qua môn, ghi chú cài đặt ngắn). PRJ301 không có deck "Chapter 0" của trường: bộ slide đầu tiên của trường (Slot 1–5) bắt đầu ở Chương 1.</p></div>`),
    bi(`<h2>1. PRJ301 in one picture</h2>
<p>A web application has two halves. The <strong>front end</strong> is what runs in the browser (HTML, CSS, JavaScript). The <strong>back end</strong> runs on a server: it receives each request, checks who is asking, talks to the database and decides what to send back. PRJ301 is about the back end written in Java — with exactly enough HTML to build forms and pages.</p>
<table>
<thead><tr><th>Piece</th><th>What it is</th><th>PRJ301 chapter</th></tr></thead>
<tbody>
<tr><td>HTTP</td><td>the text protocol between browser and server: request → response</td><td>1</td></tr>
<tr><td>Servlet</td><td>a Java class that answers HTTP requests (<code>doGet</code>, <code>doPost</code>)</td><td>1–2</td></tr>
<tr><td>Tomcat</td><td>the program that runs servlets (a "servlet container")</td><td>1–2</td></tr>
<tr><td>JSP + EL + JSTL</td><td>HTML pages with small Java/expression parts, to produce the HTML</td><td>3</td></tr>
<tr><td>Session &amp; cookie</td><td>how a server remembers a user between requests (login, cart)</td><td>4</td></tr>
<tr><td>JDBC + DAO</td><td>Java code that runs SQL on SQL Server</td><td>5</td></tr>
<tr><td>MVC</td><td>how to split the code: Model (data) · View (JSP) · Controller (servlet)</td><td>6</td></tr>
<tr><td>JPA</td><td>mapping Java objects to tables without writing most SQL</td><td>7</td></tr>
<tr><td>Filter &amp; Listener</td><td>code that runs before every request (login check, roles) or on app events</td><td>8</td></tr>
</tbody>
</table>
<p>The syllabus (FLM sylID 13165) calls it <em>Java Web Application Development</em>: 3 credits, 60 sessions, prerequisites PRO192 and DBI202, nine learning outcomes CLO1–CLO9 — from "deploy a web application" to "use AI in a Java web application".</p>`,
    `<h2>1. PRJ301 trong một bức tranh</h2>
<p>Một ứng dụng web có hai nửa. <strong>Front end</strong> là phần chạy trong trình duyệt (HTML, CSS, JavaScript). <strong>Back end</strong> chạy trên server: nhận từng request, kiểm tra ai đang hỏi, làm việc với cơ sở dữ liệu và quyết định gửi gì về. PRJ301 dạy back end viết bằng Java — kèm vừa đủ HTML để làm form và trang.</p>
<table>
<thead><tr><th>Mảnh ghép</th><th>Là gì</th><th>Chương PRJ301</th></tr></thead>
<tbody>
<tr><td>HTTP</td><td>giao thức dạng chữ giữa trình duyệt và server: request → response</td><td>1</td></tr>
<tr><td>Servlet</td><td>một lớp Java trả lời HTTP request (<code>doGet</code>, <code>doPost</code>)</td><td>1–2</td></tr>
<tr><td>Tomcat</td><td>chương trình chạy servlet (một "servlet container" — bộ chứa servlet)</td><td>1–2</td></tr>
<tr><td>JSP + EL + JSTL</td><td>trang HTML có xen những mẩu Java/biểu thức nhỏ, để tạo HTML</td><td>3</td></tr>
<tr><td>Session &amp; cookie</td><td>cách server nhớ người dùng giữa các request (đăng nhập, giỏ hàng)</td><td>4</td></tr>
<tr><td>JDBC + DAO</td><td>code Java chạy câu SQL trên SQL Server</td><td>5</td></tr>
<tr><td>MVC</td><td>cách chia code: Model (dữ liệu) · View (JSP) · Controller (servlet)</td><td>6</td></tr>
<tr><td>JPA</td><td>ánh xạ đối tượng Java sang bảng mà không phải viết phần lớn SQL</td><td>7</td></tr>
<tr><td>Filter &amp; Listener</td><td>code chạy trước mọi request (kiểm tra đăng nhập, phân quyền) hoặc khi có sự kiện của ứng dụng</td><td>8</td></tr>
</tbody>
</table>
<p>Đề cương (FLM sylID 13165) gọi môn là <em>Java Web Application Development</em> (Phát triển ứng dụng Java web): 3 tín chỉ, 60 buổi, tiên quyết PRO192 và DBI202, chín chuẩn đầu ra CLO1–CLO9 — từ "deploy một ứng dụng web" tới "dùng AI trong ứng dụng Java web".</p>`),
    bi(`<h2>2. A short, dated history — so the names in the slides make sense</h2>
<table>
<thead><tr><th>When</th><th>What happened</th><th>Why you care</th></tr></thead>
<tbody>
<tr><td>1989–1991</td><td>Tim Berners-Lee at CERN invents the World Wide Web: HTML, HTTP and the first browser/server</td><td>Chapter 1 is literally these two inventions</td></tr>
<tr><td>Dec 1993</td><td>NCSA httpd 1.0 ships with <strong>CGI</strong> (Common Gateway Interface, drafted by Rob McCool): a web server can run a program to build a page</td><td>the first "dynamic" web — but one new OS process per request, slow</td></tr>
<tr><td>1996–1997</td><td>Sun Microsystems creates <strong>Java Servlets</strong> (spec written by Pavni Diwanji; Servlet 1.0 finalised June 1997)</td><td>Java's faster answer to CGI: the servlet stays loaded, one thread per request</td></tr>
<tr><td>Nov 1998</td><td>James Duncan Davidson at Sun starts <strong>Tomcat</strong> as the servlet reference implementation; Sun later donates it to the Apache Software Foundation</td><td>the container you use today</td></tr>
<tr><td>1999</td><td><strong>JSP</strong> (JavaServer Pages) — HTML with Java inside; Servlet 2.2 introduces the <strong>WAR</strong> file; <strong>J2EE 1.2</strong> (Dec 1999) bundles servlets, JSP, JDBC, EJB… into one platform</td><td>Chapter 3; slides 40–42</td></tr>
<tr><td>2001–2003</td><td>Servlet 2.3 adds <strong>Filters</strong> (2001); Servlet 2.4 moves web.xml to XML Schema (2003)</td><td>Chapter 8; the slide's web.xml is version 2.4</td></tr>
<tr><td>May 2006</td><td>J2EE renamed <strong>Java EE</strong> (Java EE 5): annotations arrive</td><td>—</td></tr>
<tr><td>Dec 2009</td><td>Servlet 3.0 (Java EE 6): <code>@WebServlet</code>, web.xml becomes optional, async, file upload</td><td>the annotation NetBeans generates for you</td></tr>
<tr><td>2004 / 2014</td><td>Spring Framework 1.0 (2004) and Spring Boot 1.0 (2014) build on top of servlets</td><td>what LabFlow uses</td></tr>
<tr><td>Sep 2017</td><td>Oracle hands Java EE to the Eclipse Foundation</td><td>start of the rename</td></tr>
<tr><td>Sep 2019</td><td><strong>Jakarta EE 8</strong>: same APIs, new name — Oracle keeps the "Java" trademark</td><td>—</td></tr>
<tr><td>Oct–Dec 2020</td><td>Servlet 5.0 / <strong>Jakarta EE 9</strong>: every package renamed <code>javax.*</code> → <code>jakarta.*</code></td><td>the reason your slides and your code differ</td></tr>
<tr><td>2022</td><td><strong>Jakarta EE 10</strong> + Servlet 6.0 (Tomcat 10.1); <strong>Spring Boot 3.0</strong> (24 Nov 2022) requires Java 17 and Jakarta EE 9+</td><td>the stack of this course and of LabFlow</td></tr>
<tr><td>Jun 2025</td><td>Jakarta EE 11 (Servlet 6.1, Tomcat 11)</td><td>the next step; nothing in PRJ301 changes</td></tr>
</tbody>
</table>
<p class="meo">🧠 The story in one line: <strong>CGI (one process per request) → Servlet (one object, many threads) → JSP for the HTML → J2EE/Java EE platform → Jakarta EE (same thing, new name, new package) → Spring Boot on top</strong>. Every step kept the servlet underneath.</p>`,
    `<h2>2. Lịch sử ngắn có mốc năm — để mấy cái tên trên slide có nghĩa</h2>
<table>
<thead><tr><th>Khi nào</th><th>Chuyện gì xảy ra</th><th>Vì sao bạn cần biết</th></tr></thead>
<tbody>
<tr><td>1989–1991</td><td>Tim Berners-Lee ở CERN phát minh World Wide Web: HTML, HTTP cùng trình duyệt/server đầu tiên</td><td>Chương 1 đúng là hai phát minh đó</td></tr>
<tr><td>12/1993</td><td>NCSA httpd 1.0 ra mắt kèm <strong>CGI</strong> (Common Gateway Interface — giao diện cổng chung, do Rob McCool soạn): web server chạy được một chương trình để dựng trang</td><td>web "động" đầu tiên — nhưng mỗi request một tiến trình hệ điều hành mới, chậm</td></tr>
<tr><td>1996–1997</td><td>Sun Microsystems tạo ra <strong>Java Servlet</strong> (đặc tả do Pavni Diwanji viết; Servlet 1.0 chốt tháng 6/1997)</td><td>câu trả lời nhanh hơn CGI của Java: servlet nạp một lần, mỗi request một luồng</td></tr>
<tr><td>11/1998</td><td>James Duncan Davidson ở Sun khởi đầu <strong>Tomcat</strong> làm bản cài đặt tham chiếu cho servlet; sau đó Sun tặng nó cho Apache Software Foundation</td><td>chính container bạn dùng hôm nay</td></tr>
<tr><td>1999</td><td><strong>JSP</strong> (JavaServer Pages) — HTML có xen Java; Servlet 2.2 đưa ra file <strong>WAR</strong>; <strong>J2EE 1.2</strong> (12/1999) gom servlet, JSP, JDBC, EJB… thành một nền tảng</td><td>Chương 3; slide 40–42</td></tr>
<tr><td>2001–2003</td><td>Servlet 2.3 thêm <strong>Filter</strong> (2001); Servlet 2.4 chuyển web.xml sang XML Schema (2003)</td><td>Chương 8; web.xml trên slide là bản 2.4</td></tr>
<tr><td>5/2006</td><td>J2EE đổi tên thành <strong>Java EE</strong> (Java EE 5): có annotation</td><td>—</td></tr>
<tr><td>12/2009</td><td>Servlet 3.0 (Java EE 6): <code>@WebServlet</code>, web.xml thành tuỳ chọn, xử lý bất đồng bộ, tải file lên</td><td>annotation NetBeans tự sinh cho bạn</td></tr>
<tr><td>2004 / 2014</td><td>Spring Framework 1.0 (2004) và Spring Boot 1.0 (2014) dựng bên trên servlet</td><td>thứ LabFlow dùng</td></tr>
<tr><td>9/2017</td><td>Oracle giao Java EE cho Eclipse Foundation</td><td>bắt đầu chuyện đổi tên</td></tr>
<tr><td>9/2019</td><td><strong>Jakarta EE 8</strong>: API như cũ, tên mới — Oracle giữ thương hiệu "Java"</td><td>—</td></tr>
<tr><td>10–12/2020</td><td>Servlet 5.0 / <strong>Jakarta EE 9</strong>: mọi gói đổi tên <code>javax.*</code> → <code>jakarta.*</code></td><td>lý do slide của bạn và code của bạn khác nhau</td></tr>
<tr><td>2022</td><td><strong>Jakarta EE 10</strong> + Servlet 6.0 (Tomcat 10.1); <strong>Spring Boot 3.0</strong> (24/11/2022) đòi Java 17 và Jakarta EE 9+</td><td>bộ công nghệ của môn này và của LabFlow</td></tr>
<tr><td>6/2025</td><td>Jakarta EE 11 (Servlet 6.1, Tomcat 11)</td><td>bước tiếp theo; PRJ301 không đổi gì</td></tr>
</tbody>
</table>
<p class="meo">🧠 Cả câu chuyện trong một dòng: <strong>CGI (mỗi request một tiến trình) → Servlet (một đối tượng, nhiều luồng) → JSP để viết HTML → nền tảng J2EE/Java EE → Jakarta EE (vẫn thế, tên mới, gói mới) → Spring Boot bên trên</strong>. Bước nào cũng giữ servlet ở bên dưới.</p>`),
    bi(`<h2>3. javax or jakarta? — the one difference between the slides and the code</h2>
<p>The school slides were written for Tomcat 9 and older, so they import <code>javax.servlet.*</code>. Tomcat 10 and later — and Spring Boot 3 — implement <strong>Jakarta EE</strong>, where the same classes live in <code>jakarta.servlet.*</code>. The syllabus asks for "Tomcat 10 or higher", so on this site <strong>every</strong> example uses <code>jakarta</code>.</p>
<table>
<thead><tr><th>Item</th><th>Tomcat 9 / slides (Java EE)</th><th>Tomcat 10.1, Spring Boot 3 (Jakarta EE)</th></tr></thead>
<tbody>
<tr><td>Servlet import</td><td><code>javax.servlet.http.HttpServlet</code></td><td><code>jakarta.servlet.http.HttpServlet</code></td></tr>
<tr><td>JSTL taglib URI</td><td><code>http://java.sun.com/jsp/jstl/core</code></td><td><code>jakarta.tags.core</code></td></tr>
<tr><td>JPA import</td><td><code>javax.persistence.Entity</code></td><td><code>jakarta.persistence.Entity</code></td></tr>
<tr><td>web.xml namespace</td><td><code>http://xmlns.jcp.org/xml/ns/javaee</code> (or older j2ee)</td><td><code>https://jakarta.ee/xml/ns/jakartaee</code></td></tr>
<tr><td>Classes and methods</td><td><code>HttpServlet</code>, <code>doGet</code>, <code>getParameter</code>…</td><td>identical</td></tr>
</tbody>
</table>
<p>Rule: <strong>read the slide, type <code>jakarta</code></strong>. Mixing them is the most confusing bug of the first weeks: a <code>javax</code> servlet compiles (if an old jar is around) and then Tomcat 10 silently ignores it — every URL answers 404. The lesson "Installing the environment" shows that real 404 and how to recognise it in ten seconds.</p>
<div class="pitfall">Copying code from an old blog post, Stack Overflow answer or AI chat? Search it for <code>javax.servlet</code>, <code>javax.persistence</code>, <code>java.sun.com/jsp/jstl</code> before pasting. Note <code>javax.sql.DataSource</code> and <code>java.sql.*</code> (JDBC) are part of the JDK and did <em>not</em> change.</div>`,
    `<h2>3. javax hay jakarta? — chỗ khác nhau duy nhất giữa slide và code</h2>
<p>Slide của trường được viết cho Tomcat 9 trở về trước, nên chúng import <code>javax.servlet.*</code>. Tomcat 10 trở lên — và Spring Boot 3 — cài đặt <strong>Jakarta EE</strong>, ở đó cùng các lớp ấy nằm trong <code>jakarta.servlet.*</code>. Đề cương đòi "Tomcat 10 or higher", nên trên web này <strong>mọi</strong> ví dụ đều dùng <code>jakarta</code>.</p>
<table>
<thead><tr><th>Mục</th><th>Tomcat 9 / slide (Java EE)</th><th>Tomcat 10.1, Spring Boot 3 (Jakarta EE)</th></tr></thead>
<tbody>
<tr><td>Import servlet</td><td><code>javax.servlet.http.HttpServlet</code></td><td><code>jakarta.servlet.http.HttpServlet</code></td></tr>
<tr><td>URI taglib JSTL</td><td><code>http://java.sun.com/jsp/jstl/core</code></td><td><code>jakarta.tags.core</code></td></tr>
<tr><td>Import JPA</td><td><code>javax.persistence.Entity</code></td><td><code>jakarta.persistence.Entity</code></td></tr>
<tr><td>Namespace web.xml</td><td><code>http://xmlns.jcp.org/xml/ns/javaee</code> (hoặc j2ee cũ hơn)</td><td><code>https://jakarta.ee/xml/ns/jakartaee</code></td></tr>
<tr><td>Lớp và phương thức</td><td><code>HttpServlet</code>, <code>doGet</code>, <code>getParameter</code>…</td><td>y hệt</td></tr>
</tbody>
</table>
<p>Luật: <strong>đọc slide, gõ <code>jakarta</code></strong>. Trộn hai thứ là lỗi rối nhất của mấy tuần đầu: một servlet <code>javax</code> vẫn biên dịch được (nếu còn jar cũ đâu đó) rồi Tomcat 10 lặng lẽ bỏ qua nó — URL nào cũng trả 404. Bài "Cài môi trường" cho xem cái 404 thật đó và cách nhận ra nó trong mười giây.</p>
<div class="pitfall">Chép code từ blog cũ, câu trả lời Stack Overflow hay chat AI? Tìm trong đó <code>javax.servlet</code>, <code>javax.persistence</code>, <code>java.sun.com/jsp/jstl</code> trước khi dán. Lưu ý <code>javax.sql.DataSource</code> và <code>java.sql.*</code> (JDBC) thuộc về JDK và <em>không</em> đổi tên.</div>`),
    bi(`<h2>4. Why PRJ301 matters — four concrete reasons</h2>
<h3>(a) The Assignment (30%) is a complete web application</h3>
<p>Your class Assignment asks for a final web application on one of ten topics (car rental, student boarding house, gym, garage, repair shop, event tickets, tours, clinic, pharmacy, sports ground). Each of its ten requirements maps to a chapter:</p>
<table>
<thead><tr><th>#</th><th>Requirement (from the Assignment brief)</th><th>Learned in</th></tr></thead>
<tbody>
<tr><td>1.1–1.2</td><td>describe all actors and business functions</td><td>Section 0 + your SWD knowledge</td></tr>
<tr><td>1.3</td><td>use the MVC model</td><td>Chapter 6</td></tr>
<tr><td>1.4, 1.7</td><td>HTML5, CSS3, Bootstrap 5, responsive front end</td><td>Chapters 1, 3 + Assignment A–Z lesson</td></tr>
<tr><td>1.5</td><td>Servlet and JSP for the back end</td><td>Chapters 1–3</td></tr>
<tr><td>1.6</td><td>SQL Server with JDBC/JPA</td><td>Chapters 5, 7</td></tr>
<tr><td>1.8</td><td>JSTL and a custom tag</td><td>Chapter 3</td></tr>
<tr><td>1.9</td><td>Filter for role-based permissions</td><td>Chapter 8</td></tr>
<tr><td>1.10</td><td>payment through a <strong>sandbox</strong></td><td>Assignment A–Z lesson (later)</td></tr>
</tbody>
</table>
<h3>(b) The exams: PE 30% + FE 20%</h3>
<p>The practical exam (85 minutes) is where the course is really decided: you get an empty or half-made project and must deliver a working feature — typically login + a Filter + list/search/insert with JDBC in MVC style on SQL Server. The FE (60 minutes, multiple choice) checks the theory: status codes, servlet life cycle, scopes, JSP elements, JDBC interfaces, filter mapping. Both are practised on this site with real runs.</p>
<h3>(c) It is the foundation of Spring Boot — and of LabFlow</h3>
<p>Your capstone LabFlow AI runs on Spring Boot 3. Spring Boot is not "instead of" servlets — it is <em>made of</em> them:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/273ba6235c3244f7fc9a02a90c45997008a0c829.svg" alt="What runs inside a Spring Boot application, and which PRJ301 chapter explains each layer" loading="lazy" /><p class="chu-thich">🧩 What runs inside a Spring Boot application, and which PRJ301 chapter explains each layer</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Spring Boot 3 is built ON the things PRJ301 teaches
skinparam componentStyle rectangle
node "java -jar labflow.jar (Spring Boot 3, JDK 17)" {
  component "Embedded Tomcat 10.1\\n(Servlet 6.0 container) — PRJ301 Ch.1–2" as T
  component "Filter chain\\n(Spring Security = a chain of servlet Filters) — PRJ301 Ch.8" as F
  component "DispatcherServlet\\n(one HttpServlet = Front Controller) — PRJ301 Ch.2, Ch.6" as D
  component "@RestController / @Controller\\n(controllers of MVC) — PRJ301 Ch.6" as C
  component "@Service\\n(business logic)" as S
  component "Spring Data JPA repositories\\n→ JPA (Hibernate) → JDBC — PRJ301 Ch.5, Ch.7" as R
}
database "PostgreSQL / SQL Server" as DB
T --&gt; F : every HTTP request
F --&gt; D : if allowed
D --&gt; C : @GetMapping / @PostMapping
C --&gt; S
S --&gt; R
R --&gt; DB : SQL over a JDBC connection
note right of T
  HttpSession, cookies, request/response
  objects — PRJ301 Ch.4
end note
@enduml</code></pre></details>
<p>When LabFlow returns a 403 you did not expect, the answer is in the Filter chain (Chapter 8); when a login is "forgotten", it is the session cookie (Chapter 4); when a query is slow, it is JDBC and the SQL underneath JPA (Chapters 5, 7). Spring hides these layers; it does not remove them.</p>
<h3>(d) Interviews for Java web jobs ask exactly this</h3>
<table>
<thead><tr><th>Typical interview question</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>"What is the servlet life cycle? Is a servlet thread-safe?"</td><td>2</td></tr>
<tr><td>"Forward vs redirect — what is the difference?"</td><td>2, 6</td></tr>
<tr><td>"Session vs cookie? How does Tomcat know which session is yours?"</td><td>4</td></tr>
<tr><td>"Statement vs PreparedStatement? What is SQL injection?"</td><td>5</td></tr>
<tr><td>"Explain MVC. Where does DispatcherServlet fit?"</td><td>6</td></tr>
<tr><td>"What is a Filter? How does Spring Security work?"</td><td>8</td></tr>
<tr><td>"GET vs POST? Which methods are idempotent? 401 vs 403?"</td><td>1</td></tr>
</tbody>
</table>`,
    `<h2>4. Vì sao PRJ301 quan trọng — bốn lý do cụ thể</h2>
<h3>(a) Assignment (30%) là một ứng dụng web hoàn chỉnh</h3>
<p>Assignment của lớp đòi một ứng dụng web cuối môn theo một trong mười đề tài (cho thuê xe, nhà trọ sinh viên, phòng gym, gara ô tô, cửa hàng sửa xe, bán vé sự kiện, tour du lịch, phòng khám, quầy thuốc, sân tập thể thao). Mỗi yêu cầu trong mười yêu cầu của đề ứng với một chương:</p>
<table>
<thead><tr><th>#</th><th>Yêu cầu (theo đề Assignment)</th><th>Học ở</th></tr></thead>
<tbody>
<tr><td>1.1–1.2</td><td>mô tả đầy đủ tác nhân và chức năng nghiệp vụ</td><td>Mục 0 + kiến thức SWD</td></tr>
<tr><td>1.3</td><td>dùng mô hình MVC</td><td>Chương 6</td></tr>
<tr><td>1.4, 1.7</td><td>HTML5, CSS3, Bootstrap 5, front end responsive</td><td>Chương 1, 3 + bài Assignment A–Z</td></tr>
<tr><td>1.5</td><td>Servlet và JSP cho back end</td><td>Chương 1–3</td></tr>
<tr><td>1.6</td><td>SQL Server kết hợp JDBC/JPA</td><td>Chương 5, 7</td></tr>
<tr><td>1.8</td><td>JSTL và một custom tag</td><td>Chương 3</td></tr>
<tr><td>1.9</td><td>Filter phân quyền theo nghiệp vụ</td><td>Chương 8</td></tr>
<tr><td>1.10</td><td>thanh toán dùng <strong>sandbox</strong> (môi trường thử)</td><td>bài Assignment A–Z (sau này)</td></tr>
</tbody>
</table>
<h3>(b) Thi cử: PE 30% + FE 20%</h3>
<p>Bài thi thực hành (85 phút) là nơi môn học thật sự được định đoạt: bạn nhận một project trống hoặc làm dở và phải giao một chức năng chạy được — thường là đăng nhập + một Filter + liệt kê/tìm kiếm/thêm mới bằng JDBC theo kiểu MVC trên SQL Server. FE (60 phút, trắc nghiệm) kiểm lý thuyết: mã trạng thái, vòng đời servlet, scope, các thành phần JSP, interface JDBC, ánh xạ filter. Cả hai đều được luyện trên web này bằng code chạy thật.</p>
<h3>(c) Nó là nền của Spring Boot — và của LabFlow</h3>
<p>Đồ án LabFlow AI của bạn chạy trên Spring Boot 3. Spring Boot không "thay thế" servlet — nó được <em>làm từ</em> servlet:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/273ba6235c3244f7fc9a02a90c45997008a0c829.svg" alt="Bên trong một ứng dụng Spring Boot có gì, và chương nào của PRJ301 giải thích từng tầng" loading="lazy" /><p class="chu-thich">🧩 Bên trong một ứng dụng Spring Boot có gì, và chương nào của PRJ301 giải thích từng tầng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Spring Boot 3 is built ON the things PRJ301 teaches
skinparam componentStyle rectangle
node "java -jar labflow.jar (Spring Boot 3, JDK 17)" {
  component "Embedded Tomcat 10.1\\n(Servlet 6.0 container) — PRJ301 Ch.1–2" as T
  component "Filter chain\\n(Spring Security = a chain of servlet Filters) — PRJ301 Ch.8" as F
  component "DispatcherServlet\\n(one HttpServlet = Front Controller) — PRJ301 Ch.2, Ch.6" as D
  component "@RestController / @Controller\\n(controllers of MVC) — PRJ301 Ch.6" as C
  component "@Service\\n(business logic)" as S
  component "Spring Data JPA repositories\\n→ JPA (Hibernate) → JDBC — PRJ301 Ch.5, Ch.7" as R
}
database "PostgreSQL / SQL Server" as DB
T --&gt; F : every HTTP request
F --&gt; D : if allowed
D --&gt; C : @GetMapping / @PostMapping
C --&gt; S
S --&gt; R
R --&gt; DB : SQL over a JDBC connection
note right of T
  HttpSession, cookies, request/response
  objects — PRJ301 Ch.4
end note
@enduml</code></pre></details>
<p>Khi LabFlow trả 403 ngoài ý muốn, câu trả lời nằm ở chuỗi Filter (Chương 8); khi đăng nhập bị "quên", đó là cookie của session (Chương 4); khi một truy vấn chạy chậm, đó là JDBC và câu SQL nằm dưới JPA (Chương 5, 7). Spring che các tầng này đi; nó không xoá chúng.</p>
<h3>(d) Phỏng vấn việc Java web hỏi đúng những thứ này</h3>
<table>
<thead><tr><th>Câu phỏng vấn hay gặp</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>"Vòng đời servlet là gì? Servlet có thread-safe không?"</td><td>2</td></tr>
<tr><td>"Forward khác redirect thế nào?"</td><td>2, 6</td></tr>
<tr><td>"Session khác cookie ra sao? Tomcat biết session nào là của bạn bằng cách nào?"</td><td>4</td></tr>
<tr><td>"Statement khác PreparedStatement? SQL injection là gì?"</td><td>5</td></tr>
<tr><td>"Giải thích MVC. DispatcherServlet nằm ở đâu?"</td><td>6</td></tr>
<tr><td>"Filter là gì? Spring Security hoạt động thế nào?"</td><td>8</td></tr>
<tr><td>"GET khác POST? Method nào lũy đẳng? 401 khác 403?"</td><td>1</td></tr>
</tbody>
</table>`),
    bi(`<h2>5. Honest weights — where to put your effort</h2>
<table>
<thead><tr><th>Part</th><th>Weight for you</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Ch.5 JDBC &amp; DAO</td><td>⭐⭐⭐</td><td>every PE question and every Assignment screen reads or writes SQL Server</td></tr>
<tr><td>Ch.6 MVC</td><td>⭐⭐⭐</td><td>the required structure of the Assignment; the shape of every Spring Boot app</td></tr>
<tr><td>Ch.4 Session &amp; cookie</td><td>⭐⭐⭐</td><td>login, cart, "remember me" — and FE questions on the four scopes</td></tr>
<tr><td>Ch.8 Filter</td><td>⭐⭐⭐</td><td>role-based permissions (Assignment 1.9, PE); the basis of Spring Security</td></tr>
<tr><td>Ch.1–2 HTTP &amp; Servlet</td><td>⭐⭐</td><td>small but everything stands on it; many FE questions</td></tr>
<tr><td>Ch.3 JSP/EL/JSTL</td><td>⭐⭐</td><td>you will write a lot of it; know <code>c:forEach</code>, <code>c:if</code>, EL scopes</td></tr>
<tr><td>Custom tags, JPA</td><td>⭐</td><td>required once in the Assignment / one lab; rarely asked in PE. Learn enough to use them; JPA really pays off later in Spring Data JPA</td></tr>
<tr><td>Ch.10 AI</td><td>⭐</td><td>useful habits (prompting, AI in the IDE); one CLO</td></tr>
</tbody>
</table>
<p class="meo">🧠 If you only had one week: master <strong>login (session) + Filter + DAO with PreparedStatement + one MVC CRUD page</strong>. That single feature is half of every PE paper.</p>`,
    `<h2>5. Nói thật về trọng số — nên dồn sức vào đâu</h2>
<table>
<thead><tr><th>Phần</th><th>Mức quan trọng với bạn</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Ch.5 JDBC &amp; DAO</td><td>⭐⭐⭐</td><td>câu PE nào, màn hình Assignment nào cũng đọc hoặc ghi SQL Server</td></tr>
<tr><td>Ch.6 MVC</td><td>⭐⭐⭐</td><td>cấu trúc bắt buộc của Assignment; hình dạng của mọi ứng dụng Spring Boot</td></tr>
<tr><td>Ch.4 Session &amp; cookie</td><td>⭐⭐⭐</td><td>đăng nhập, giỏ hàng, "ghi nhớ tôi" — và câu FE về bốn scope</td></tr>
<tr><td>Ch.8 Filter</td><td>⭐⭐⭐</td><td>phân quyền theo vai trò (Assignment 1.9, PE); nền của Spring Security</td></tr>
<tr><td>Ch.1–2 HTTP &amp; Servlet</td><td>⭐⭐</td><td>ít nhưng mọi thứ đứng trên nó; nhiều câu FE</td></tr>
<tr><td>Ch.3 JSP/EL/JSTL</td><td>⭐⭐</td><td>bạn sẽ viết rất nhiều; nắm <code>c:forEach</code>, <code>c:if</code>, scope của EL</td></tr>
<tr><td>Custom tag, JPA</td><td>⭐</td><td>Assignment đòi một lần / một bài lab; PE hiếm hỏi. Học đủ để dùng được; JPA thật sự sinh lời về sau ở Spring Data JPA</td></tr>
<tr><td>Ch.10 AI</td><td>⭐</td><td>thói quen có ích (viết prompt, AI trong IDE); một CLO</td></tr>
</tbody>
</table>
<p class="meo">🧠 Nếu chỉ có một tuần: thành thạo <strong>đăng nhập (session) + Filter + DAO dùng PreparedStatement + một trang CRUD theo MVC</strong>. Riêng chức năng đó đã là nửa đề PE.</p>`),
    bi(`<h2>6. How the lessons on this site work</h2>
<ul>
<li><strong>📑 Slide by slide</strong>: every school slide, shown as in class, with its key idea, a plain explanation, the exam trap, and — whenever there is code — a small web application deployed on a real Tomcat 10.1 with the <em>real</em> request and response.</li>
<li><strong>🧪 Practice</strong> at the end of each chapter: exercises with solutions that were run for real, a glossary and a summary.</li>
<li><strong>Quiz</strong> per chapter: 10 questions with explanations, inspired by real FE question types (rewritten, not copied).</li>
<li><strong>🧭 In Spring Boot / LabFlow</strong> boxes: how the same idea looks in your capstone's stack.</li>
</ul>
<p>Next: <strong>⭐ Start here (2/2) — How to study PRJ301</strong>, then install everything and run your first servlet.</p>`,
    `<h2>6. Các bài trên web này vận hành thế nào</h2>
<ul>
<li><strong>📑 Học theo từng slide</strong>: mọi slide của trường, giữ nguyên như trên lớp, kèm ý chính, giải thích dễ hiểu, bẫy thi, và — hễ có code — một ứng dụng web nhỏ deploy trên Tomcat 10.1 thật cùng request và response <em>thật</em>.</li>
<li><strong>🧪 Thực hành</strong> cuối mỗi chương: bài tập có lời giải đã chạy thật, bảng thuật ngữ và tóm tắt.</li>
<li><strong>Quiz</strong> mỗi chương: 10 câu có giải thích, lấy cảm hứng từ dạng câu FE thật (viết lại, không chép).</li>
<li>Ô <strong>🧭 Trong Spring Boot / LabFlow</strong>: cùng ý đó trông thế nào trong bộ công nghệ của đồ án bạn.</li>
</ul>
<p>Tiếp theo: <strong>⭐ Bắt đầu tại đây (2/2) — Học PRJ301 thế nào</strong>, rồi cài đủ mọi thứ và chạy servlet đầu tiên.</p>`),
  ].join('\n'),
};

/* ───────── ⭐ Start here (2/2) — How to study PRJ301: the 60-session map, where the marks are, a weekly rhythm, PE and FE preparation ───────── */
const L_x_hoc_the_nao = {
  title: '⭐ Start here (2/2) — How to study PRJ301: the 60-session map, where the marks are, a weekly rhythm, PE and FE preparation|||⭐ Bắt đầu tại đây (2/2) — Học PRJ301 thế nào: bản đồ 60 buổi, điểm nằm ở đâu, nhịp mỗi tuần, chuẩn bị PE và FE',
  slug: 'prj301-hoc-the-nao',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài định hướng tự thêm: bản đồ 60 buổi của đề cương FLM ↔ chương trên web ↔ cột điểm (Assignment 30%, PE 30%, hai Progress Test, hai Workshop, FE 20%), sơ đồ môn một trang, cách học code web không nản (gõ tay, chạy, đọc request/response trong DevTools, sổ lỗi), nhịp mỗi tuần, cách chuẩn bị PE 85 phút và FE 60 phút, dùng AI sao cho có ích mà không hại.',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ Start here 2/2 · added by this site</span>
<h2>How to study PRJ301 so that the Assignment, the PE and the FE all go well</h2>
<p class="lead">PRJ301 is a <strong>doing</strong> course: you pass it with your hands on the keyboard, not by re-reading slides. This page gives you the map of the 60 sessions, shows where the marks really are, and proposes a weekly rhythm that keeps the Assignment moving while you learn.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/3cd9c2da701f6dd6bd8b4e83871d8f56fad6df3e.svg" alt="The whole course on one page: chapters, school decks, CLOs and grading" loading="lazy" /><p class="chu-thich">🧩 The whole course on one page: chapters, school decks, CLOs and grading</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startmindmap
title PRJ301 on one page — chapters, school decks and what is graded
* PRJ301\\nJava Web
** Ch.1–2 Web, HTTP, Servlet\\n(prj1 · Slot 1–5)
*** CLO1–2 · PT1
** Ch.3 JSP, EL, JSTL, Custom tags\\n(prj3, prj6, prj7, prj9)
*** CLO4 · Assignment 1.8
** Ch.4 Session &amp; cookie, 4 scopes\\n(prj5)
*** CLO2 · login of every PE
** Ch.5 JDBC &amp; DAO\\n(prj2 · SQL Server)
*** CLO3 · PE CRUD/search
** Ch.6 MVC\\n(prj4)
*** CLO6 · Assignment 1.3
** Ch.7 JPA\\n(prj8)
*** CLO8
** Ch.8 Filter &amp; Listener\\n(prj10, prj11)
*** CLO5 · Assignment 1.9 (roles)
** Ch.10 AI in Java web\\n(4 school AI documents)
*** CLO9
left side
** Grading
*** Assignment 30%
*** Practical Exam (PE) 30% · 85'
*** Progress tests 5% + 5%
*** Workshops 5% + 5%
*** Final Exam (FE) 20% · 60' · min 4
@endmindmap</code></pre></details>`,
    `<span class="eyebrow">Mục 0 · ⭐ Bắt đầu tại đây 2/2 · phần web tự thêm</span>
<h2>Học PRJ301 thế nào để Assignment, PE và FE đều ổn</h2>
<p class="lead">PRJ301 là môn <strong>làm</strong>: bạn qua môn bằng đôi tay đặt trên bàn phím, không phải bằng việc đọc lại slide. Trang này cho bạn bản đồ 60 buổi, chỉ ra điểm thật sự nằm ở đâu, và đề xuất một nhịp mỗi tuần giúp Assignment luôn tiến lên trong lúc bạn học.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/3cd9c2da701f6dd6bd8b4e83871d8f56fad6df3e.svg" alt="Cả môn trên một trang: chương, bộ slide trường, CLO và cột điểm" loading="lazy" /><p class="chu-thich">🧩 Cả môn trên một trang: chương, bộ slide trường, CLO và cột điểm</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startmindmap
title PRJ301 on one page — chapters, school decks and what is graded
* PRJ301\\nJava Web
** Ch.1–2 Web, HTTP, Servlet\\n(prj1 · Slot 1–5)
*** CLO1–2 · PT1
** Ch.3 JSP, EL, JSTL, Custom tags\\n(prj3, prj6, prj7, prj9)
*** CLO4 · Assignment 1.8
** Ch.4 Session &amp; cookie, 4 scopes\\n(prj5)
*** CLO2 · login of every PE
** Ch.5 JDBC &amp; DAO\\n(prj2 · SQL Server)
*** CLO3 · PE CRUD/search
** Ch.6 MVC\\n(prj4)
*** CLO6 · Assignment 1.3
** Ch.7 JPA\\n(prj8)
*** CLO8
** Ch.8 Filter &amp; Listener\\n(prj10, prj11)
*** CLO5 · Assignment 1.9 (roles)
** Ch.10 AI in Java web\\n(4 school AI documents)
*** CLO9
left side
** Grading
*** Assignment 30%
*** Practical Exam (PE) 30% · 85'
*** Progress tests 5% + 5%
*** Workshops 5% + 5%
*** Final Exam (FE) 20% · 60' · min 4
@endmindmap</code></pre></details>`),
    bi(`<h2>1. Where the marks are (syllabus 13165)</h2>
<table>
<thead><tr><th>Component</th><th>Weight</th><th>Form</th><th>What it really tests</th></tr></thead>
<tbody>
<tr><td>Assignment</td><td>30%</td><td>group project, ~5 weeks, defended at sessions 55–60</td><td>a complete MVC web app on SQL Server (see "Start here 1/2", section 4a)</td></tr>
<tr><td>Practical Exam (PE)</td><td>30%</td><td>85 minutes, on a lab machine</td><td>one working feature: login + Filter + JDBC list/search/insert, MVC, SQL Server</td></tr>
<tr><td>Progress Test 1, 2</td><td>5% + 5%</td><td>30 minutes each</td><td>theory of the chapters so far (multiple choice)</td></tr>
<tr><td>Workshop 1, 2</td><td>5% + 5%</td><td>one week each</td><td>a small application at home</td></tr>
<tr><td>Final Exam (FE)</td><td>20%</td><td>60 minutes, multiple choice</td><td>all chapters; completion criterion 4 (per the syllabus)</td></tr>
</tbody>
</table>
<p>The syllabus requires an average of at least <strong>5/10</strong> to pass, attendance of 80% of contact hours, and every on-going component &gt; 0 (lesson 0.2 explains the passing rules in detail). Notice the shape: <strong>70% of the grade is practical</strong> (Assignment, PE, Workshops). A student who can build and debug a feature passes comfortably; a student who can only recite definitions does not.</p>
<div class="pitfall">The PE is 30% <em>and</em> taken alone, in 85 minutes, with no group to lean on. Students who let one teammate write the Assignment's DAO layer meet it for the first time in the PE. Make sure <strong>you</strong> write at least one complete feature of your Assignment end to end.</div>`,
    `<h2>1. Điểm nằm ở đâu (đề cương 13165)</h2>
<table>
<thead><tr><th>Cột điểm</th><th>Trọng số</th><th>Hình thức</th><th>Thật ra kiểm tra gì</th></tr></thead>
<tbody>
<tr><td>Assignment</td><td>30%</td><td>dự án nhóm, ~5 tuần, bảo vệ ở buổi 55–60</td><td>một ứng dụng web MVC hoàn chỉnh trên SQL Server (xem "Bắt đầu tại đây 1/2", mục 4a)</td></tr>
<tr><td>Practical Exam (PE)</td><td>30%</td><td>85 phút, trên máy phòng lab</td><td>một chức năng chạy được: đăng nhập + Filter + liệt kê/tìm kiếm/thêm bằng JDBC, MVC, SQL Server</td></tr>
<tr><td>Progress Test 1, 2</td><td>5% + 5%</td><td>mỗi bài 30 phút</td><td>lý thuyết các chương đã học (trắc nghiệm)</td></tr>
<tr><td>Workshop 1, 2</td><td>5% + 5%</td><td>mỗi cái một tuần</td><td>một ứng dụng nhỏ làm ở nhà</td></tr>
<tr><td>Final Exam (FE)</td><td>20%</td><td>60 phút, trắc nghiệm</td><td>mọi chương; tiêu chí hoàn thành 4 (theo đề cương)</td></tr>
</tbody>
</table>
<p>Đề cương yêu cầu điểm trung bình ít nhất <strong>5/10</strong> để qua môn, đi học đủ 80% số giờ lên lớp, và mọi cột điểm quá trình &gt; 0 (bài 0.2 giải thích chi tiết điều kiện qua môn). Để ý hình dạng: <strong>70% điểm là thực hành</strong> (Assignment, PE, Workshop). Sinh viên dựng được và gỡ lỗi được một chức năng sẽ qua thoải mái; sinh viên chỉ thuộc định nghĩa thì không.</p>
<div class="pitfall">PE chiếm 30% <em>và</em> làm một mình, trong 85 phút, không có nhóm để dựa. Ai để một bạn cùng nhóm viết hết tầng DAO của Assignment sẽ gặp nó lần đầu ngay trong giờ PE. Hãy chắc rằng <strong>chính bạn</strong> viết trọn ít nhất một chức năng của Assignment từ đầu tới cuối.</div>`),
    bi(`<h2>2. The 60 sessions ↔ chapters on this site</h2>
<p>The syllabus orders topics differently from the slide decks (JDBC comes <em>before</em> JSP and MVC; sessions/cookies come late). Follow your class's order; use this table to find the matching lesson. The syllabus numbering skips 42–43 and 46–47 — that is how FLM lists it.</p>
<table>
<thead><tr><th>Sessions</th><th>Syllabus topic</th><th>Chapter on this site</th><th>Graded by</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>intro to Java web, setup (JDK, Tomcat 10+, NetBeans 13+), first servlet and JSP, deploy; prompt engineering</td><td>1, Section 0 ⭐, 10</td><td>PT1, FE</td></tr>
<tr><td>5–7</td><td>first servlet: class, deployment config; request/response, doGet/doPost; parameters from forms and query strings</td><td>2</td><td>PT1, FE, every PE</td></tr>
<tr><td>8</td><td>using AI in NetBeans 24</td><td>10</td><td>—</td></tr>
<tr><td>9–10</td><td>Practice Classwork 1</td><td>🧪 practice Ch.1–2</td><td>Workshop 1</td></tr>
<tr><td>11–15</td><td>JDBC intro, driver types, processing SQL statements; database query agent</td><td>5, 10</td><td>PE, FE</td></tr>
<tr><td>16–20</td><td>CRUD with SQL Server 2019+; Practice Classwork 2</td><td>5</td><td>PE, Assignment</td></tr>
<tr><td>21–26</td><td>JSP: why, three ways, implicit objects, JSP config in web.xml, JSP + Servlet; Classwork 3</td><td>3</td><td>Assignment, FE</td></tr>
<tr><td>27–32</td><td>MVC: general design, the pattern, applying it</td><td>6</td><td>Assignment, PE</td></tr>
<tr><td>33–36</td><td>session and cookie; Classwork 4</td><td>4</td><td>PE (login), FE</td></tr>
<tr><td>37–40</td><td>Expression Language, scoped variables, implicit objects; Classwork 5</td><td>3</td><td>FE</td></tr>
<tr><td>41–48</td><td>JPA; custom tags; Classwork 6–7</td><td>7, 3</td><td>Assignment 1.6/1.8</td></tr>
<tr><td>49–52</td><td>Filter: purpose, declare and map; forward/redirect, init parameters; coding AI agent; Classwork 8</td><td>8, 2, 10</td><td>PE, Assignment 1.9</td></tr>
<tr><td>53–54</td><td>event listeners</td><td>8</td><td>FE</td></tr>
<tr><td>55–60</td><td>Assignment evaluation, course summary</td><td>—</td><td>Assignment</td></tr>
</tbody>
</table>`,
    `<h2>2. 60 buổi ↔ các chương trên web</h2>
<p>Đề cương xếp chủ đề khác thứ tự các bộ slide (JDBC đến <em>trước</em> JSP và MVC; session/cookie đến muộn). Cứ theo đúng thứ tự lớp bạn học; dùng bảng này để tìm bài tương ứng. Đề cương đánh số buổi nhảy qua 42–43 và 46–47 — FLM liệt kê đúng như vậy.</p>
<table>
<thead><tr><th>Buổi</th><th>Chủ đề trong đề cương</th><th>Chương trên web</th><th>Chấm ở</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>nhập môn Java web, cài môi trường (JDK, Tomcat 10+, NetBeans 13+), servlet và JSP đầu tiên, deploy; prompt engineering</td><td>1, Mục 0 ⭐, 10</td><td>PT1, FE</td></tr>
<tr><td>5–7</td><td>servlet đầu tiên: lớp, cấu hình deploy; request/response, doGet/doPost; tham số từ form và query string</td><td>2</td><td>PT1, FE, mọi đề PE</td></tr>
<tr><td>8</td><td>dùng AI trong NetBeans 24</td><td>10</td><td>—</td></tr>
<tr><td>9–10</td><td>Practice Classwork 1</td><td>🧪 thực hành Ch.1–2</td><td>Workshop 1</td></tr>
<tr><td>11–15</td><td>nhập môn JDBC, các loại driver, xử lý câu SQL; database query agent</td><td>5, 10</td><td>PE, FE</td></tr>
<tr><td>16–20</td><td>CRUD với SQL Server 2019+; Practice Classwork 2</td><td>5</td><td>PE, Assignment</td></tr>
<tr><td>21–26</td><td>JSP: vì sao, ba cách viết, đối tượng ngầm định, cấu hình JSP trong web.xml, JSP + Servlet; Classwork 3</td><td>3</td><td>Assignment, FE</td></tr>
<tr><td>27–32</td><td>MVC: thiết kế chung, mẫu MVC, áp dụng</td><td>6</td><td>Assignment, PE</td></tr>
<tr><td>33–36</td><td>session và cookie; Classwork 4</td><td>4</td><td>PE (đăng nhập), FE</td></tr>
<tr><td>37–40</td><td>Expression Language, biến theo scope, đối tượng ngầm định; Classwork 5</td><td>3</td><td>FE</td></tr>
<tr><td>41–48</td><td>JPA; custom tag; Classwork 6–7</td><td>7, 3</td><td>Assignment 1.6/1.8</td></tr>
<tr><td>49–52</td><td>Filter: mục đích, khai báo và ánh xạ; forward/redirect, init parameter; coding AI agent; Classwork 8</td><td>8, 2, 10</td><td>PE, Assignment 1.9</td></tr>
<tr><td>53–54</td><td>event listener</td><td>8</td><td>FE</td></tr>
<tr><td>55–60</td><td>chấm Assignment, tổng kết môn</td><td>—</td><td>Assignment</td></tr>
</tbody>
</table>`),
    bi(`<h2>3. How to learn web code without giving up</h2>
<h3>Rule 1 — type it, run it, break it</h3>
<p>Do not copy-paste the examples. Type them (it is slower and that is the point: your fingers learn <code>request.getParameter</code>, <code>response.setContentType</code>, <code>@WebServlet</code>). Run each one. Then <strong>break it on purpose</strong>: remove the <code>name</code> of an input, put a slash in front of the form action, write <code>javax</code> instead of <code>jakarta</code> — and read the error. Every error you have caused deliberately is one you will recognise in the PE.</p>
<h3>Rule 2 — look at the HTTP, not at the guess</h3>
<p>The browser's DevTools (F12 → <strong>Network</strong>) show the exact request and response, the same text this site shows under every example. When something "does not work", answer three questions there before touching the code: <em>Which URL was requested? Which status came back? What did the body contain?</em> 404 → the URL/mapping; 405 → wrong method; 500 → read the exception on the page and in the Tomcat log.</p>
<h3>Rule 3 — keep an error notebook</h3>
<table>
<thead><tr><th>Date</th><th>Symptom</th><th>Real cause</th><th>Fix</th><th>How to see it faster next time</th></tr></thead>
<tbody>
<tr><td>14/10</td><td>every page 404 after adding a servlet</td><td><code>javax.servlet</code> imports</td><td>change to <code>jakarta.servlet</code></td><td>search the project for "javax.servlet"</td></tr>
<tr><td>…</td><td>…</td><td>…</td><td>…</td><td>…</td></tr>
</tbody>
</table>
<p>Ten lines of this notebook are worth more than ten pages of notes before the PE.</p>
<h3>Rule 4 — one feature end to end beats five half-features</h3>
<p>Each week, finish one vertical slice: a JSP form → a servlet → a DAO method → a table in SQL Server → back to a JSP. It is exactly the shape of a PE question and of every Assignment screen.</p>`,
    `<h2>3. Học code web thế nào cho không nản</h2>
<h3>Luật 1 — gõ, chạy, làm hỏng</h3>
<p>Đừng chép-dán ví dụ. Hãy gõ lại (chậm hơn, và đó chính là mục đích: ngón tay bạn học thuộc <code>request.getParameter</code>, <code>response.setContentType</code>, <code>@WebServlet</code>). Chạy từng cái. Rồi <strong>cố tình làm hỏng</strong>: bỏ <code>name</code> của một ô nhập, thêm dấu gạch chéo trước action của form, viết <code>javax</code> thay cho <code>jakarta</code> — và đọc lỗi. Mỗi lỗi bạn cố tình gây ra là một lỗi bạn sẽ nhận ra ngay trong giờ PE.</p>
<h3>Luật 2 — nhìn HTTP, đừng đoán</h3>
<p>DevTools của trình duyệt (F12 → <strong>Network</strong>) cho thấy đúng request và response, cùng đoạn chữ mà web này hiện dưới mỗi ví dụ. Khi có gì đó "không chạy", hãy trả lời ba câu ở đó trước khi đụng vào code: <em>URL nào được gọi? Mã trạng thái nào trả về? Body chứa gì?</em> 404 → URL/ánh xạ; 405 → sai method; 500 → đọc exception trên trang và trong log Tomcat.</p>
<h3>Luật 3 — giữ một sổ lỗi</h3>
<table>
<thead><tr><th>Ngày</th><th>Triệu chứng</th><th>Nguyên nhân thật</th><th>Cách sửa</th><th>Lần sau thấy nhanh hơn bằng cách nào</th></tr></thead>
<tbody>
<tr><td>14/10</td><td>thêm một servlet xong mọi trang đều 404</td><td>import <code>javax.servlet</code></td><td>đổi thành <code>jakarta.servlet</code></td><td>tìm trong project chữ "javax.servlet"</td></tr>
<tr><td>…</td><td>…</td><td>…</td><td>…</td><td>…</td></tr>
</tbody>
</table>
<p>Mười dòng trong cuốn sổ này đáng giá hơn mười trang ghi chép trước giờ PE.</p>
<h3>Luật 4 — một chức năng trọn vẹn hơn năm chức năng dở dang</h3>
<p>Mỗi tuần, hoàn thành một "lát cắt dọc": một form JSP → một servlet → một phương thức DAO → một bảng trong SQL Server → quay lại một JSP. Đó đúng là hình dạng của một câu PE và của mọi màn hình trong Assignment.</p>`),
    bi(`<h2>4. A weekly rhythm (about 7–8 hours outside class)</h2>
<table>
<thead><tr><th>When</th><th>What</th><th>Time</th></tr></thead>
<tbody>
<tr><td>Before the slot</td><td>read the 📑 lesson of the deck your class will cover (key ideas + traps); run one example</td><td>1 h</td></tr>
<tr><td>After the slot</td><td>redo the class demo from memory, then the 🧪 practice exercises of that chapter</td><td>2–3 h</td></tr>
<tr><td>Mid-week</td><td>add one feature of that chapter to your Assignment (in your own branch)</td><td>2 h</td></tr>
<tr><td>End of week</td><td>the chapter quiz on this site; write 3 lines in the error notebook; 20 minutes of FE-type questions</td><td>1 h</td></tr>
<tr><td>Before each Progress Test / the FE</td><td>quizzes of all chapters so far + the glossary tables</td><td>2 h</td></tr>
</tbody>
</table>
<p>Group work for the Assignment: split by <strong>feature</strong> (each member owns login, or products, or orders — from JSP to SQL), not by layer (one person "does the database"). Feature ownership is how real teams work and it is what makes each of you able to pass the PE.</p>`,
    `<h2>4. Nhịp mỗi tuần (khoảng 7–8 giờ ngoài giờ học)</h2>
<table>
<thead><tr><th>Khi nào</th><th>Làm gì</th><th>Thời gian</th></tr></thead>
<tbody>
<tr><td>Trước buổi học</td><td>đọc bài 📑 của bộ slide lớp sắp học (ý chính + bẫy); chạy thử một ví dụ</td><td>1 giờ</td></tr>
<tr><td>Sau buổi học</td><td>làm lại demo trên lớp mà không nhìn, rồi làm phần 🧪 thực hành của chương đó</td><td>2–3 giờ</td></tr>
<tr><td>Giữa tuần</td><td>thêm một chức năng của chương đó vào Assignment (trên nhánh của riêng bạn)</td><td>2 giờ</td></tr>
<tr><td>Cuối tuần</td><td>làm quiz chương trên web; ghi 3 dòng vào sổ lỗi; 20 phút câu hỏi dạng FE</td><td>1 giờ</td></tr>
<tr><td>Trước mỗi Progress Test / FE</td><td>quiz của mọi chương đã học + các bảng thuật ngữ</td><td>2 giờ</td></tr>
</tbody>
</table>
<p>Chia việc nhóm cho Assignment: chia theo <strong>chức năng</strong> (mỗi người giữ một mảng: đăng nhập, hoặc sản phẩm, hoặc đơn hàng — từ JSP tới SQL), không chia theo tầng (một người "lo CSDL"). Giữ trọn chức năng là cách đội thật làm việc, và là thứ giúp mỗi người trong nhóm đều qua được PE.</p>`),
    bi(`<h2>5. Preparing the PE (85 minutes) and the FE (60 minutes)</h2>
<h3>PE</h3>
<ul>
<li><strong>Have a skeleton in your head</strong>: <code>DBContext</code> → <code>model</code> class → <code>DAO</code> with <code>PreparedStatement</code> → servlet (controller) → JSP with JSTL. Practise writing it from an empty project in under 30 minutes.</li>
<li><strong>Time plan</strong>: 10 min read + check the database script runs; 30 min the first required function working end to end; the rest for the remaining functions and the Filter; last 10 min: clean, build, test every URL once more.</li>
<li><strong>Typical killers</strong>: wrong JDBC URL/password, driver jar not in the project, <code>javax</code> imports, form action with a leading slash, <code>getParameter</code> name mismatch, forgetting to close the connection, Filter mapped to <code>/*</code> blocking the login page itself.</li>
</ul>
<h3>FE</h3>
<ul>
<li>Questions are short and precise: "which method…", "which status code…", "what is the scope of…", "which element of web.xml…". The chapter quizzes on this site are written in that style.</li>
<li>Learn the <strong>exact names</strong>: <code>doPost</code> not <code>doPOST</code>; <code>getRequestDispatcher</code>; <code>&lt;url-pattern&gt;</code>; <code>ResultSet.next()</code>.</li>
<li>Many FE options are "both A and B" or "all of the above": read every option before choosing.</li>
</ul>`,
    `<h2>5. Chuẩn bị PE (85 phút) và FE (60 phút)</h2>
<h3>PE</h3>
<ul>
<li><strong>Có sẵn một bộ khung trong đầu</strong>: <code>DBContext</code> → lớp <code>model</code> → <code>DAO</code> dùng <code>PreparedStatement</code> → servlet (controller) → JSP dùng JSTL. Luyện viết nó từ project trống trong dưới 30 phút.</li>
<li><strong>Chia giờ</strong>: 10 phút đọc đề + kiểm tra script CSDL chạy được; 30 phút cho chức năng bắt buộc đầu tiên chạy trọn vẹn; phần còn lại cho các chức năng khác và Filter; 10 phút cuối: dọn dẹp, build, thử lại mọi URL một lượt.</li>
<li><strong>Những thứ "giết" bài PE</strong>: sai URL/mật khẩu JDBC, thiếu jar driver trong project, import <code>javax</code>, action của form có gạch chéo đầu, tên trong <code>getParameter</code> không khớp, quên đóng connection, Filter ánh xạ <code>/*</code> chặn luôn cả trang đăng nhập.</li>
</ul>
<h3>FE</h3>
<ul>
<li>Câu hỏi ngắn và chính xác: "phương thức nào…", "mã trạng thái nào…", "scope của … là gì", "phần tử nào của web.xml…". Quiz từng chương trên web này viết đúng kiểu đó.</li>
<li>Thuộc <strong>đúng tên</strong>: <code>doPost</code> chứ không phải <code>doPOST</code>; <code>getRequestDispatcher</code>; <code>&lt;url-pattern&gt;</code>; <code>ResultSet.next()</code>.</li>
<li>Nhiều phương án FE là "cả A và B" hoặc "tất cả các ý trên": đọc hết các phương án rồi mới chọn.</li>
</ul>`),
    bi(`<h2>6. Using AI the right way in this course</h2>
<p>The syllabus itself includes AI (CLO9; sessions 3, 8, 15, 51 — Chapter 10). Use it like a senior classmate, not like a copy machine:</p>
<table>
<thead><tr><th>Good use</th><th>Bad use</th></tr></thead>
<tbody>
<tr><td>"Explain this stack trace line by line"</td><td>"Write my whole Assignment"</td></tr>
<tr><td>"Why does this servlet return 405?" (paste code + the response)</td><td>pasting AI code without reading it — it often uses <code>javax</code> and old JSTL URIs</td></tr>
<tr><td>"Review my DAO for SQL injection"</td><td>asking for PE answers during the exam (forbidden, and the lab is offline)</td></tr>
<tr><td>"Give me 5 FE-style questions on filters, with explanations"</td><td>trusting an explanation you have not checked by running code</td></tr>
</tbody>
</table>
<p class="meo">🧠 The test of understanding: close the AI window and rebuild the same feature alone. If you cannot, you have not learned it yet — and the PE will not have the window open.</p>
<p>Next: <strong>⭐ Installing the environment</strong> — JDK 17, Tomcat 10.1, NetBeans, SQL Server on Windows and on macOS.</p>`,
    `<h2>6. Dùng AI cho đúng trong môn này</h2>
<p>Chính đề cương đã có AI (CLO9; buổi 3, 8, 15, 51 — Chương 10). Dùng nó như một anh chị khoá trên, đừng dùng như máy photo:</p>
<table>
<thead><tr><th>Dùng đúng</th><th>Dùng sai</th></tr></thead>
<tbody>
<tr><td>"Giải thích từng dòng stack trace này"</td><td>"Viết giùm em cả Assignment"</td></tr>
<tr><td>"Vì sao servlet này trả 405?" (dán code + response)</td><td>dán code AI mà không đọc — nó hay dùng <code>javax</code> và URI JSTL cũ</td></tr>
<tr><td>"Soát DAO của em xem có dính SQL injection không"</td><td>hỏi đáp án PE trong giờ thi (bị cấm, và phòng lab không có mạng)</td></tr>
<tr><td>"Cho em 5 câu kiểu FE về filter, kèm giải thích"</td><td>tin một lời giải thích mà bạn chưa kiểm lại bằng cách chạy code</td></tr>
</tbody>
</table>
<p class="meo">🧠 Phép thử của sự hiểu: đóng cửa sổ AI lại và tự dựng lại đúng chức năng đó. Nếu chưa làm được, nghĩa là bạn chưa học xong — và giờ PE sẽ không có cửa sổ đó.</p>
<p>Tiếp theo: <strong>⭐ Cài môi trường</strong> — JDK 17, Tomcat 10.1, NetBeans, SQL Server trên Windows và trên macOS.</p>`),
  ].join('\n'),
};

/* ───────── ⭐ Installing the environment — JDK 17, Tomcat 10.1, NetBeans, SQL Server on Windows and macOS, common errors ───────── */
const L_x_cai_moi_truong = {
  title: '⭐ Installing the environment — JDK 17, Tomcat 10.1, NetBeans, SQL Server on Windows and macOS, common errors|||⭐ Cài môi trường — JDK 17, Tomcat 10.1, NetBeans, SQL Server trên Windows và macOS, các lỗi hay gặp',
  slug: 'prj301-cai-moi-truong',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài tự thêm ngoài giáo trình, bổ sung bài 0.3: cài JDK 17, Tomcat 10.1, NetBeans (hoặc IntelliJ) và gắn Tomcat vào IDE; SQL Server trên Windows (Developer/Express, chế độ xác thực hỗn hợp, bật TCP/IP cổng 1433, SSMS) và trên macOS bằng Docker (Intel và Apple Silicon, nói rõ phần nào Microsoft không hỗ trợ, Azure SQL Edge và Azure Data Studio đã nghỉ hưu) cùng công cụ xem CSDL; driver mssql-jdbc; kiểm tra bằng một servlet JDBC chạy thật; bảng lỗi hay gặp, có cả 404 thật khi lỡ dùng javax trên Tomcat 10.',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ Setup · added by this site</span>
<h2>Install once, check with one real request, and recognise every classic error in seconds</h2>
<p class="lead">Lesson 0.3 lists the tools; this page installs them on <strong>Windows</strong> (the school lab: NetBeans) and on <strong>macOS</strong> (where SQL Server only runs inside Docker). Budget 60–90 minutes. At the end you run a small servlet that connects to SQL Server — if it prints three student names, your environment is ready for the whole course.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/ae206b299cd1012c4cce4a89852c5b5ef998eeaf.svg" alt="What you are installing and how the pieces talk to each other" loading="lazy" /><p class="chu-thich">🧩 What you are installing and how the pieces talk to each other</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Your PRJ301 development machine — what runs where
left to right direction
node "Your laptop (Windows or macOS)" {
  component "NetBeans / IntelliJ\\n(editor, Run, Clean and Build)" as IDE
  component "JDK 17\\n(javac, java)" as JDK
  node "Apache Tomcat 10.1\\nport 8080" as TC {
    component "your app\\n/FirstServlet" as APP
  }
  component "Browser\\nhttp://localhost:8080/..." as BR
  component "SSMS (Windows) /\\nVS Code mssql, DBeaver (macOS)" as SQLTOOL
}
database "SQL Server\\nport 1433\\n(Windows: installed service ·\\nmacOS: a Docker container)" as SQL
IDE --&gt; JDK : compiles with
IDE --&gt; TC : deploys the WAR to,\\nstarts / stops
BR --&gt; TC : HTTP
APP --&gt; SQL : JDBC (mssql-jdbc driver\\nin WEB-INF/lib)
SQLTOOL --&gt; SQL : you create tables,\\nrun SQL by hand
@enduml</code></pre></details>
<table>
<thead><tr><th>Piece</th><th>Version to install</th><th>Why this version</th></tr></thead>
<tbody>
<tr><td>JDK</td><td><strong>17</strong> (Eclipse Temurin or Oracle) — 21 also works</td><td>Tomcat 10.1 needs Java 11+; Spring Boot 3 (LabFlow) needs 17</td></tr>
<tr><td>Servlet container</td><td><strong>Apache Tomcat 10.1.x</strong></td><td>Servlet 6.0, Jakarta EE 10, <code>jakarta.*</code>; the syllabus says "Tomcat 10 or higher"</td></tr>
<tr><td>IDE</td><td>Apache NetBeans (latest: 31, Aug 2026; the lab may have an older one) — or IntelliJ IDEA</td><td>NetBeans is the course IDE; IntelliJ if you already use it for LabFlow</td></tr>
<tr><td>Database</td><td>SQL Server 2019 or later (2022/2025 Developer or Express are free)</td><td>the syllabus requires SQL Server 2019+</td></tr>
<tr><td>DB tool</td><td>SSMS 22 (Windows) · VS Code + "SQL Server (mssql)" extension or DBeaver (Windows/macOS)</td><td>Azure Data Studio was retired on 28 Feb 2026 — do not install it</td></tr>
<tr><td>JDBC driver</td><td>Microsoft JDBC Driver for SQL Server, <code>mssql-jdbc-12.8.1.jre11.jar</code></td><td>goes into <code>WEB-INF/lib</code> of every app that uses the database</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Mục 0 · ⭐ Cài đặt · phần web tự thêm</span>
<h2>Cài một lần, kiểm tra bằng một request thật, và nhận ra mọi lỗi kinh điển trong vài giây</h2>
<p class="lead">Bài 0.3 liệt kê công cụ; trang này cài chúng trên <strong>Windows</strong> (phòng lab của trường: NetBeans) và trên <strong>macOS</strong> (nơi SQL Server chỉ chạy được trong Docker). Dành 60–90 phút. Cuối bài bạn chạy một servlet nhỏ kết nối SQL Server — nếu nó in ra ba tên sinh viên, môi trường của bạn đã sẵn sàng cho cả môn.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/ae206b299cd1012c4cce4a89852c5b5ef998eeaf.svg" alt="Bạn đang cài những gì và các mảnh nói chuyện với nhau ra sao" loading="lazy" /><p class="chu-thich">🧩 Bạn đang cài những gì và các mảnh nói chuyện với nhau ra sao</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Your PRJ301 development machine — what runs where
left to right direction
node "Your laptop (Windows or macOS)" {
  component "NetBeans / IntelliJ\\n(editor, Run, Clean and Build)" as IDE
  component "JDK 17\\n(javac, java)" as JDK
  node "Apache Tomcat 10.1\\nport 8080" as TC {
    component "your app\\n/FirstServlet" as APP
  }
  component "Browser\\nhttp://localhost:8080/..." as BR
  component "SSMS (Windows) /\\nVS Code mssql, DBeaver (macOS)" as SQLTOOL
}
database "SQL Server\\nport 1433\\n(Windows: installed service ·\\nmacOS: a Docker container)" as SQL
IDE --&gt; JDK : compiles with
IDE --&gt; TC : deploys the WAR to,\\nstarts / stops
BR --&gt; TC : HTTP
APP --&gt; SQL : JDBC (mssql-jdbc driver\\nin WEB-INF/lib)
SQLTOOL --&gt; SQL : you create tables,\\nrun SQL by hand
@enduml</code></pre></details>
<table>
<thead><tr><th>Mảnh</th><th>Bản cần cài</th><th>Vì sao bản này</th></tr></thead>
<tbody>
<tr><td>JDK</td><td><strong>17</strong> (Eclipse Temurin hoặc Oracle) — 21 cũng được</td><td>Tomcat 10.1 cần Java 11+; Spring Boot 3 (LabFlow) cần 17</td></tr>
<tr><td>Servlet container</td><td><strong>Apache Tomcat 10.1.x</strong></td><td>Servlet 6.0, Jakarta EE 10, <code>jakarta.*</code>; đề cương ghi "Tomcat 10 or higher"</td></tr>
<tr><td>IDE</td><td>Apache NetBeans (mới nhất: 31, tháng 8/2026; phòng lab có thể là bản cũ hơn) — hoặc IntelliJ IDEA</td><td>NetBeans là IDE của môn; IntelliJ nếu bạn đã dùng nó cho LabFlow</td></tr>
<tr><td>CSDL</td><td>SQL Server 2019 trở lên (bản 2022/2025 Developer hoặc Express miễn phí)</td><td>đề cương đòi SQL Server 2019+</td></tr>
<tr><td>Công cụ CSDL</td><td>SSMS 22 (Windows) · VS Code + tiện ích "SQL Server (mssql)" hoặc DBeaver (Windows/macOS)</td><td>Azure Data Studio đã nghỉ hưu ngày 28/02/2026 — đừng cài nó</td></tr>
<tr><td>Driver JDBC</td><td>Microsoft JDBC Driver for SQL Server, <code>mssql-jdbc-12.8.1.jre11.jar</code></td><td>nằm trong <code>WEB-INF/lib</code> của mọi ứng dụng dùng CSDL</td></tr>
</tbody>
</table>`),
    bi(`<h2>1. JDK 17</h2>
<ol>
<li><strong>Windows</strong>: in PowerShell run <code>winget install EclipseAdoptium.Temurin.17.JDK</code> (or download the .msi from adoptium.net and tick "Set JAVA_HOME"). <strong>macOS</strong>: <code>brew install --cask temurin@17</code> (or the .pkg from adoptium.net).</li>
<li>Open a <em>new</em> terminal and check: <code>java -version</code> and <code>javac -version</code> must both say 17.</li>
<li>Set <code>JAVA_HOME</code> if the installer did not: Windows → "Edit the system environment variables" → <code>JAVA_HOME = C:\\Program Files\\Eclipse Adoptium\\jdk-17…</code>; macOS → add <code>export JAVA_HOME=$(/usr/libexec/java_home -v 17)</code> to <code>~/.zshrc</code>.</li>
</ol>
<p class="meo">🧠 Several JDKs can live side by side. What matters is which one Tomcat and NetBeans use: NetBeans → Tools → Java Platforms; Tomcat → <code>JAVA_HOME</code> (or <code>JRE_HOME</code>).</p>
<h2>2. Apache Tomcat 10.1</h2>
<ol>
<li>Download the <strong>Core zip</strong> of the latest 10.1.x from <code>tomcat.apache.org</code> (Windows may also use the "32-bit/64-bit Windows Service Installer", but the zip is simpler with NetBeans).</li>
<li>Unzip to a path without spaces: <code>C:\\tomcat\\apache-tomcat-10.1.x</code> or <code>~/tools/apache-tomcat-10.1.x</code>. On macOS make the scripts executable: <code>chmod +x ~/tools/apache-tomcat-10.1.x/bin/*.sh</code>.</li>
<li>Test it alone once: <code>bin\\startup.bat</code> (Windows) / <code>bin/startup.sh</code> (macOS), open <code>http://localhost:8080</code> — you should see the Tomcat page — then <code>shutdown.bat</code> / <code>shutdown.sh</code>.</li>
</ol>
<table>
<thead><tr><th>Folder</th><th>What lives there</th></tr></thead>
<tbody>
<tr><td><code>bin/</code></td><td>startup/shutdown scripts</td></tr>
<tr><td><code>conf/</code></td><td><code>server.xml</code> (ports), <code>web.xml</code> (defaults for every app: UTF-8, welcome files…), <code>tomcat-users.xml</code> (manager users)</td></tr>
<tr><td><code>webapps/</code></td><td>deployed applications — drop a WAR here (slides 40–42)</td></tr>
<tr><td><code>logs/</code></td><td><code>catalina.*.log</code> — read it when an app does not start</td></tr>
<tr><td><code>lib/</code></td><td><code>servlet-api.jar</code>, <code>jsp-api.jar</code>… (provided to every app; never copy them into WEB-INF/lib)</td></tr>
</tbody>
</table>`,
    `<h2>1. JDK 17</h2>
<ol>
<li><strong>Windows</strong>: trong PowerShell chạy <code>winget install EclipseAdoptium.Temurin.17.JDK</code> (hoặc tải file .msi ở adoptium.net và đánh dấu "Set JAVA_HOME"). <strong>macOS</strong>: <code>brew install --cask temurin@17</code> (hoặc file .pkg ở adoptium.net).</li>
<li>Mở một cửa sổ terminal <em>mới</em> và kiểm tra: <code>java -version</code> và <code>javac -version</code> phải cùng báo 17.</li>
<li>Đặt <code>JAVA_HOME</code> nếu bộ cài chưa đặt: Windows → "Edit the system environment variables" → <code>JAVA_HOME = C:\\Program Files\\Eclipse Adoptium\\jdk-17…</code>; macOS → thêm <code>export JAVA_HOME=$(/usr/libexec/java_home -v 17)</code> vào <code>~/.zshrc</code>.</li>
</ol>
<p class="meo">🧠 Nhiều JDK có thể nằm cạnh nhau. Cái quan trọng là Tomcat và NetBeans dùng cái nào: NetBeans → Tools → Java Platforms; Tomcat → <code>JAVA_HOME</code> (hoặc <code>JRE_HOME</code>).</p>
<h2>2. Apache Tomcat 10.1</h2>
<ol>
<li>Tải bản <strong>Core zip</strong> của 10.1.x mới nhất ở <code>tomcat.apache.org</code> (Windows cũng có thể dùng "Windows Service Installer", nhưng bản zip đơn giản hơn khi dùng với NetBeans).</li>
<li>Giải nén vào đường dẫn không có dấu cách: <code>C:\\tomcat\\apache-tomcat-10.1.x</code> hoặc <code>~/tools/apache-tomcat-10.1.x</code>. Trên macOS cấp quyền chạy cho script: <code>chmod +x ~/tools/apache-tomcat-10.1.x/bin/*.sh</code>.</li>
<li>Thử riêng nó một lần: <code>bin\\startup.bat</code> (Windows) / <code>bin/startup.sh</code> (macOS), mở <code>http://localhost:8080</code> — phải thấy trang của Tomcat — rồi <code>shutdown.bat</code> / <code>shutdown.sh</code>.</li>
</ol>
<table>
<thead><tr><th>Thư mục</th><th>Chứa gì</th></tr></thead>
<tbody>
<tr><td><code>bin/</code></td><td>script khởi động/tắt</td></tr>
<tr><td><code>conf/</code></td><td><code>server.xml</code> (cổng), <code>web.xml</code> (mặc định cho mọi ứng dụng: UTF-8, welcome file…), <code>tomcat-users.xml</code> (người dùng trang manager)</td></tr>
<tr><td><code>webapps/</code></td><td>các ứng dụng đã deploy — thả file WAR vào đây (slide 40–42)</td></tr>
<tr><td><code>logs/</code></td><td><code>catalina.*.log</code> — đọc nó khi ứng dụng không khởi động được</td></tr>
<tr><td><code>lib/</code></td><td><code>servlet-api.jar</code>, <code>jsp-api.jar</code>… (cấp sẵn cho mọi ứng dụng; đừng bao giờ chép chúng vào WEB-INF/lib)</td></tr>
</tbody>
</table>`),
    bi(`<h2>3. NetBeans (or IntelliJ) and connecting Tomcat to it</h2>
<ol>
<li>Install Apache NetBeans from <code>netbeans.apache.org</code> (it needs a JDK already installed).</li>
<li><strong>Tools → Servers → Add Server… → "Apache Tomcat or TomEE"</strong> → Server Location = the folder you unzipped → enter a username/password for the manager and tick "Create user if it does not exist" → Finish. NetBeans writes that user into <code>conf/tomcat-users.xml</code> and uses it to deploy.</li>
<li>Create a test project: <strong>File → New Project → Java with Maven → Web Application</strong> → Server = the Tomcat you added, Java EE/Jakarta EE version = <strong>Jakarta EE 10 Web</strong>. (Your lab may use the Ant variant "Java with Ant → Java Web → Web Application"; both produce the same WAR.)</li>
<li>Run the project (F6). The browser opens <code>http://localhost:8080/&lt;project&gt;/</code>. The "Output" window has a tab for Tomcat's log.</li>
</ol>
<p><strong>IntelliJ IDEA</strong>: the Ultimate edition (free for students with a JetBrains student licence) has built-in Tomcat support: Run → Edit Configurations → + → Tomcat Server → Local, add the artifact <code>&lt;project&gt;:war exploded</code>. The free Community edition has no Tomcat integration — use the "Smart Tomcat" plugin or deploy the WAR by hand.</p>
<div class="pitfall">Choose <strong>Jakarta EE 9/10</strong>, never "Java EE 8", when creating the project for Tomcat 10.1: Java EE 8 templates generate <code>javax.*</code> imports, and every servlet will answer 404 (section 7).</div>`,
    `<h2>3. NetBeans (hoặc IntelliJ) và gắn Tomcat vào</h2>
<ol>
<li>Cài Apache NetBeans từ <code>netbeans.apache.org</code> (cần cài JDK trước).</li>
<li><strong>Tools → Servers → Add Server… → "Apache Tomcat or TomEE"</strong> → Server Location = thư mục bạn vừa giải nén → nhập username/password cho trang manager và đánh dấu "Create user if it does not exist" → Finish. NetBeans ghi người dùng đó vào <code>conf/tomcat-users.xml</code> và dùng nó để deploy.</li>
<li>Tạo project thử: <strong>File → New Project → Java with Maven → Web Application</strong> → Server = Tomcat vừa thêm, Java EE/Jakarta EE version = <strong>Jakarta EE 10 Web</strong>. (Phòng lab có thể dùng biến thể Ant "Java with Ant → Java Web → Web Application"; cả hai đều ra cùng một file WAR.)</li>
<li>Chạy project (F6). Trình duyệt mở <code>http://localhost:8080/&lt;project&gt;/</code>. Cửa sổ "Output" có một tab cho log của Tomcat.</li>
</ol>
<p><strong>IntelliJ IDEA</strong>: bản Ultimate (miễn phí cho sinh viên qua giấy phép student của JetBrains) hỗ trợ Tomcat sẵn: Run → Edit Configurations → + → Tomcat Server → Local, thêm artifact <code>&lt;project&gt;:war exploded</code>. Bản Community miễn phí không tích hợp Tomcat — dùng plugin "Smart Tomcat" hoặc tự deploy file WAR.</p>
<div class="pitfall">Chọn <strong>Jakarta EE 9/10</strong>, đừng bao giờ chọn "Java EE 8", khi tạo project cho Tomcat 10.1: mẫu Java EE 8 sinh import <code>javax.*</code>, và servlet nào cũng sẽ trả 404 (mục 7).</div>`),
    bi(`<h2>4. SQL Server on Windows (the lab setup)</h2>
<ol>
<li>Install <strong>SQL Server 2022 (or 2025) Developer</strong> or <strong>Express</strong> from Microsoft's SQL Server downloads page. In the installer choose <strong>Mixed Mode</strong> authentication (SQL Server + Windows) and set a password for <code>sa</code>.</li>
<li>Install <strong>SQL Server Management Studio (SSMS) 22</strong>. Connect with "SQL Server Authentication", login <code>sa</code>.</li>
<li><strong>Enable TCP/IP</strong> — JDBC cannot use the shared-memory connection SSMS uses: open <em>SQL Server Configuration Manager</em> → SQL Server Network Configuration → Protocols for MSSQLSERVER (or SQLEXPRESS) → <strong>TCP/IP → Enabled</strong>; in its IP Addresses tab, section IPAll, set <strong>TCP Port = 1433</strong> (Express uses dynamic ports by default) → restart the SQL Server service.</li>
<li>Check: in SSMS run <code>SELECT @@VERSION;</code>.</li>
</ol>
<p>If you installed SQL Server with Windows-only authentication: in SSMS right-click the server → Properties → Security → "SQL Server and Windows Authentication mode"; then Security → Logins → sa → enable it and set a password; restart the service.</p>`,
    `<h2>4. SQL Server trên Windows (giống phòng lab)</h2>
<ol>
<li>Cài <strong>SQL Server 2022 (hoặc 2025) Developer</strong> hoặc <strong>Express</strong> từ trang tải SQL Server của Microsoft. Trong bộ cài chọn xác thực <strong>Mixed Mode</strong> (SQL Server + Windows) và đặt mật khẩu cho <code>sa</code>.</li>
<li>Cài <strong>SQL Server Management Studio (SSMS) 22</strong>. Kết nối bằng "SQL Server Authentication", login <code>sa</code>.</li>
<li><strong>Bật TCP/IP</strong> — JDBC không dùng được kiểu kết nối bộ nhớ chung mà SSMS dùng: mở <em>SQL Server Configuration Manager</em> → SQL Server Network Configuration → Protocols for MSSQLSERVER (hoặc SQLEXPRESS) → <strong>TCP/IP → Enabled</strong>; trong tab IP Addresses, mục IPAll, đặt <strong>TCP Port = 1433</strong> (Express mặc định dùng cổng động) → khởi động lại dịch vụ SQL Server.</li>
<li>Kiểm tra: trong SSMS chạy <code>SELECT @@VERSION;</code>.</li>
</ol>
<p>Nếu lỡ cài SQL Server chỉ với xác thực Windows: trong SSMS chuột phải server → Properties → Security → "SQL Server and Windows Authentication mode"; rồi Security → Logins → sa → bật lên và đặt mật khẩu; khởi động lại dịch vụ.</p>`),
    bi(`<h2>5. SQL Server on macOS — Docker</h2>
<p>Microsoft ships no SQL Server for macOS; you run the official <strong>Linux container</strong> in Docker Desktop. Install Docker Desktop from docker.com first.</p>
<p><strong>Intel Mac</strong> — the official image runs natively:</p>
<pre><code class="language-bash">docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Prj301!Pass" \\
  -p 1433:1433 --name prj301-sql -d mcr.microsoft.com/mssql/server:2022-latest
docker logs -f prj301-sql      # wait for "SQL Server is now ready for client connections"</code></pre>
<p><strong>Apple Silicon (M1–M4)</strong> — the image exists only for x86-64. In Docker Desktop → Settings → General, turn on <em>"Use Rosetta for x86_64/amd64 emulation on Apple Silicon"</em>, then add <code>--platform linux/amd64</code>:</p>
<pre><code class="language-bash">docker run --platform linux/amd64 -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Prj301!Pass" \\
  -p 1433:1433 --name prj301-sql -d mcr.microsoft.com/mssql/server:2022-latest</code></pre>
<p>Be aware: Microsoft's documentation states that emulation (Rosetta 2, QEMU…) is <strong>not tested or supported</strong>. For coursework it generally works; if the container keeps restarting, read <code>docker logs prj301-sql</code>. The old ARM-native alternative, <strong>Azure SQL Edge</strong>, was retired on 30 Sep 2025 (no more updates) — if you already run it from DBI202 it still answers T-SQL fine for PRJ301, and it is what this site's own examples use (that is why the test below reports version 15.00).</p>
<div class="pitfall">The <code>sa</code> password must follow SQL Server's policy: at least 8 characters from three of the four groups (upper case, lower case, digits, symbols). With a weak password like <code>123</code> the container starts and then <strong>stops by itself</strong> — <code>docker logs</code> shows the reason.</div>
<p><strong>Tools on macOS</strong>: SSMS is Windows-only. Use <strong>VS Code + the "SQL Server (mssql)" extension</strong> (Microsoft's replacement for Azure Data Studio) or <strong>DBeaver Community</strong>. Connect to server <code>localhost</code>, port <code>1433</code>, user <code>sa</code>, "trust server certificate" on.</p>`,
    `<h2>5. SQL Server trên macOS — Docker</h2>
<p>Microsoft không phát hành SQL Server cho macOS; bạn chạy <strong>container Linux</strong> chính thức trong Docker Desktop. Cài Docker Desktop từ docker.com trước.</p>
<p><strong>Mac chip Intel</strong> — image chính thức chạy thẳng:</p>
<pre><code class="language-bash">docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Prj301!Pass" \\
  -p 1433:1433 --name prj301-sql -d mcr.microsoft.com/mssql/server:2022-latest
docker logs -f prj301-sql      # wait for "SQL Server is now ready for client connections"</code></pre>
<p><strong>Mac chip Apple Silicon (M1–M4)</strong> — image chỉ có bản x86-64. Trong Docker Desktop → Settings → General, bật <em>"Use Rosetta for x86_64/amd64 emulation on Apple Silicon"</em>, rồi thêm <code>--platform linux/amd64</code>:</p>
<pre><code class="language-bash">docker run --platform linux/amd64 -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Prj301!Pass" \\
  -p 1433:1433 --name prj301-sql -d mcr.microsoft.com/mssql/server:2022-latest</code></pre>
<p>Cần biết: tài liệu Microsoft ghi rõ chạy giả lập (Rosetta 2, QEMU…) là <strong>không được kiểm thử, không được hỗ trợ</strong>. Để học thì nhìn chung chạy được; nếu container cứ tự khởi động lại, đọc <code>docker logs prj301-sql</code>. Lựa chọn cũ chạy thẳng trên ARM là <strong>Azure SQL Edge</strong> đã nghỉ hưu ngày 30/09/2025 (không còn cập nhật) — nếu bạn đã có nó từ DBI202 thì vẫn chạy T-SQL tốt cho PRJ301, và đó chính là thứ các ví dụ của web này dùng (vì vậy phép thử bên dưới báo phiên bản 15.00).</p>
<div class="pitfall">Mật khẩu <code>sa</code> phải theo chính sách của SQL Server: ít nhất 8 ký tự, thuộc ba trong bốn nhóm (chữ hoa, chữ thường, chữ số, ký hiệu). Đặt mật khẩu yếu như <code>123</code> thì container khởi động rồi <strong>tự tắt</strong> — <code>docker logs</code> cho biết lý do.</div>
<p><strong>Công cụ trên macOS</strong>: SSMS chỉ có cho Windows. Dùng <strong>VS Code + tiện ích "SQL Server (mssql)"</strong> (thứ Microsoft đưa ra thay Azure Data Studio) hoặc <strong>DBeaver Community</strong>. Kết nối server <code>localhost</code>, cổng <code>1433</code>, user <code>sa</code>, bật "trust server certificate".</p>`),
    bi(`<h2>6. The JDBC driver, and the one test that proves everything works</h2>
<p>Download <code>mssql-jdbc-12.8.1.jre11.jar</code> (Maven Central, or "Microsoft JDBC Driver for SQL Server" on learn.microsoft.com). In a NetBeans Ant project: right-click Libraries → Add JAR/Folder. In a Maven project add:</p>
<pre><code class="language-xml">&lt;dependency&gt;
    &lt;groupId&gt;com.microsoft.sqlserver&lt;/groupId&gt;
    &lt;artifactId&gt;mssql-jdbc&lt;/artifactId&gt;
    &lt;version&gt;12.8.1.jre11&lt;/version&gt;
&lt;/dependency&gt;</code></pre>
<p>Now the test application. Run this script in SSMS / VS Code / DBeaver once:</p>
<p class="ghi-chu">📄 <code>kiem-ket-noi/setup.sql</code></p>
<pre class="web-src"><code class="language-sql">-- Run once in SSMS / Azure Data Studio (or let the generator run it): a fresh test database
IF DB_ID('PRJ301_KiemKetNoi') IS NOT NULL
BEGIN
    ALTER DATABASE PRJ301_KiemKetNoi SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE PRJ301_KiemKetNoi;
END
GO
CREATE DATABASE PRJ301_KiemKetNoi;
GO
USE PRJ301_KiemKetNoi;
GO
CREATE TABLE Student (
    id    INT IDENTITY(1,1) PRIMARY KEY,
    code  VARCHAR(10)   NOT NULL UNIQUE,
    name  NVARCHAR(100) NOT NULL
);
INSERT INTO Student (code, name) VALUES
    ('HE180001', N'Nguyễn Văn An'),
    ('HE180002', N'Trần Thị Bình'),
    ('HE180003', N'Lê Minh Cường');
GO</code></pre>
<p>…then a <code>DBContext</code> (the classic FPT class that opens connections) and a servlet that uses it:</p>
<p class="ghi-chu">📄 <code>kiem-ket-noi/src/main/java/dal/DBContext.java</code></p>
<pre class="web-src"><code class="language-java">package dal;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

// The classic FPT "DBContext": one place that knows how to open a connection
public class DBContext {
    // On the school PC: localhost:1433, user sa and YOUR sa password
    // The env variables let the same code run in Docker (the lesson's Tomcat sets them)
    private static final String HOST = env("DB_HOST", "localhost");
    private static final String PORT = env("DB_PORT", "1433");
    private static final String DB   = "PRJ301_KiemKetNoi";
    private static final String USER = env("DB_USER", "sa");
    private static final String PASS = env("DB_PASSWORD", "123");

    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");   // load the driver from WEB-INF/lib
        String url = "jdbc:sqlserver://" + HOST + ":" + PORT
                + ";databaseName=" + DB + ";encrypt=true;trustServerCertificate=true";
        return DriverManager.getConnection(url, USER, PASS);
    }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }
}</code></pre>
<p class="ghi-chu">📄 <code>kiem-ket-noi/src/main/java/controller/CheckServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.DBContext;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Opens a connection, asks SQL Server who it is, then lists the Student table
@WebServlet("/check")
public class CheckServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        try (Connection con = DBContext.getConnection()) {
            out.println("Connected to: " + con.getMetaData().getDatabaseProductName()
                    + " " + con.getMetaData().getDatabaseProductVersion());
            out.println("Database: " + con.getCatalog());
            try (PreparedStatement ps = con.prepareStatement("SELECT code, name FROM Student ORDER BY code");
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) out.println(rs.getString("code") + " | " + rs.getString("name"));
            }
        } catch (Exception e) {
            resp.setStatus(500);
            out.println("Cannot connect: " + e);   // the message tells you WHICH step failed
        }
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /kiem-ket-noi/check HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 161

Connected to: Microsoft SQL Server 15.00.2000
Database: PRJ301_KiemKetNoi
HE180001 | Nguyễn Văn An
HE180002 | Trần Thị Bình
HE180003 | Lê Minh Cường</code></pre>
<p>That response came from a real Tomcat 10.1 talking to a real SQL Server. Your version line will differ (e.g. <code>16.00…</code> for SQL Server 2022); everything else should be identical, Vietnamese names included — they survive because the column is <code>NVARCHAR</code> and the inserts use the <code>N'…'</code> prefix.</p>
<div class="callout">🐘 <strong>On PostgreSQL / in Spring Boot</strong> (LabFlow): the same test needs only a different URL and driver — <code>jdbc:postgresql://localhost:5432/labflow</code> with <code>org.postgresql:postgresql</code> — and in Spring Boot you do not write DBContext at all:
<pre><code class="language-properties">spring.datasource.url=jdbc:postgresql://localhost:5432/labflow
spring.datasource.username=labflow
spring.datasource.password=&#36;{DB_PASSWORD}</code></pre>
Spring Boot creates a connection pool (HikariCP) from these three lines — Chapter 5 explains what a pool is.</div>`,
    `<h2>6. Driver JDBC, và phép thử duy nhất chứng minh mọi thứ đã chạy</h2>
<p>Tải <code>mssql-jdbc-12.8.1.jre11.jar</code> (Maven Central, hoặc mục "Microsoft JDBC Driver for SQL Server" trên learn.microsoft.com). Trong project NetBeans kiểu Ant: chuột phải Libraries → Add JAR/Folder. Trong project Maven thêm:</p>
<pre><code class="language-xml">&lt;dependency&gt;
    &lt;groupId&gt;com.microsoft.sqlserver&lt;/groupId&gt;
    &lt;artifactId&gt;mssql-jdbc&lt;/artifactId&gt;
    &lt;version&gt;12.8.1.jre11&lt;/version&gt;
&lt;/dependency&gt;</code></pre>
<p>Giờ tới ứng dụng thử. Chạy script này một lần trong SSMS / VS Code / DBeaver:</p>
<p class="ghi-chu">📄 <code>kiem-ket-noi/setup.sql</code></p>
<pre class="web-src"><code class="language-sql">-- Chạy một lần trong SSMS / Azure Data Studio (hoặc để generator chạy): một CSDL thử mới tinh
IF DB_ID('PRJ301_KiemKetNoi') IS NOT NULL
BEGIN
    ALTER DATABASE PRJ301_KiemKetNoi SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE PRJ301_KiemKetNoi;
END
GO
CREATE DATABASE PRJ301_KiemKetNoi;
GO
USE PRJ301_KiemKetNoi;
GO
CREATE TABLE Student (
    id    INT IDENTITY(1,1) PRIMARY KEY,
    code  VARCHAR(10)   NOT NULL UNIQUE,
    name  NVARCHAR(100) NOT NULL
);
INSERT INTO Student (code, name) VALUES
    ('HE180001', N'Nguyễn Văn An'),
    ('HE180002', N'Trần Thị Bình'),
    ('HE180003', N'Lê Minh Cường');
GO</code></pre>
<p>…rồi một lớp <code>DBContext</code> (lớp kinh điển của FPT dùng để mở kết nối) và một servlet dùng nó:</p>
<p class="ghi-chu">📄 <code>kiem-ket-noi/src/main/java/dal/DBContext.java</code></p>
<pre class="web-src"><code class="language-java">package dal;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

// "DBContext" kinh điển của FPT: một chỗ duy nhất biết cách mở kết nối
public class DBContext {
    // Trên máy trường: localhost:1433, user sa và mật khẩu sa CỦA BẠN
    // Biến môi trường cho cùng code chạy được trong Docker (Tomcat của bài đặt sẵn)
    private static final String HOST = env("DB_HOST", "localhost");
    private static final String PORT = env("DB_PORT", "1433");
    private static final String DB   = "PRJ301_KiemKetNoi";
    private static final String USER = env("DB_USER", "sa");
    private static final String PASS = env("DB_PASSWORD", "123");

    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");   // nạp driver nằm trong WEB-INF/lib
        String url = "jdbc:sqlserver://" + HOST + ":" + PORT
                + ";databaseName=" + DB + ";encrypt=true;trustServerCertificate=true";
        return DriverManager.getConnection(url, USER, PASS);
    }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }
}</code></pre>
<p class="ghi-chu">📄 <code>kiem-ket-noi/src/main/java/controller/CheckServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.DBContext;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Mở kết nối, hỏi SQL Server là ai, rồi liệt kê bảng Student
@WebServlet("/check")
public class CheckServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        try (Connection con = DBContext.getConnection()) {
            out.println("Connected to: " + con.getMetaData().getDatabaseProductName()
                    + " " + con.getMetaData().getDatabaseProductVersion());
            out.println("Database: " + con.getCatalog());
            try (PreparedStatement ps = con.prepareStatement("SELECT code, name FROM Student ORDER BY code");
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) out.println(rs.getString("code") + " | " + rs.getString("name"));
            }
        } catch (Exception e) {
            resp.setStatus(500);
            out.println("Cannot connect: " + e);   // thông báo cho biết bước NÀO hỏng
        }
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /kiem-ket-noi/check HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 161

Connected to: Microsoft SQL Server 15.00.2000
Database: PRJ301_KiemKetNoi
HE180001 | Nguyễn Văn An
HE180002 | Trần Thị Bình
HE180003 | Lê Minh Cường</code></pre>
<p>Response đó đến từ một Tomcat 10.1 thật nói chuyện với một SQL Server thật. Dòng phiên bản của bạn sẽ khác (vd <code>16.00…</code> với SQL Server 2022); mọi thứ khác phải y hệt, kể cả tên tiếng Việt — chúng còn nguyên vì cột là <code>NVARCHAR</code> và câu insert có tiền tố <code>N'…'</code>.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL / trong Spring Boot</strong> (LabFlow): cùng phép thử chỉ cần đổi URL và driver — <code>jdbc:postgresql://localhost:5432/labflow</code> với <code>org.postgresql:postgresql</code> — và trong Spring Boot bạn không hề viết DBContext:
<pre><code class="language-properties">spring.datasource.url=jdbc:postgresql://localhost:5432/labflow
spring.datasource.username=labflow
spring.datasource.password=&#36;{DB_PASSWORD}</code></pre>
Spring Boot tạo một connection pool (HikariCP — bể kết nối) từ ba dòng này — Chương 5 giải thích pool là gì.</div>`),
    bi(`<h2>7. Common error #1, seen for real: <code>javax</code> on Tomcat 10</h2>
<p>This servlet was copied from a Tomcat 9 tutorial. It compiles (an old <code>javax.servlet-api</code> jar was on the classpath), the WAR deploys without a single error in the log — and then:</p>
<p class="ghi-chu">📄 <code>loi-javax/src/main/java/demo/HelloServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

// An OLD tutorial's servlet (Tomcat 9 era): javax.* everywhere
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().println("Hello from a javax servlet");
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loi-javax/hello HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 771

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message The requested resource [/loi-javax/hello] is not available
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p>Tomcat 10 scans for <code>jakarta.servlet.annotation.WebServlet</code>; a class annotated with the old <code>javax</code> annotation is just an ordinary class to it, so <code>/hello</code> maps to nothing → <strong>404</strong>. Diagnosis in ten seconds: search the project for <code>javax.servlet</code>. Fix: replace <code>javax.</code> by <code>jakarta.</code> in the servlet imports and use the Jakarta EE 10 libraries.</p>`,
    `<h2>7. Lỗi hay gặp số 1, xem tận mắt: <code>javax</code> trên Tomcat 10</h2>
<p>Servlet này được chép từ một hướng dẫn Tomcat 9. Nó biên dịch được (classpath còn một jar <code>javax.servlet-api</code> cũ), file WAR deploy mà log không có một lỗi nào — rồi:</p>
<p class="ghi-chu">📄 <code>loi-javax/src/main/java/demo/HelloServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

// Servlet chép từ một hướng dẫn CŨ (thời Tomcat 9): toàn javax.*
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().println("Hello from a javax servlet");
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loi-javax/hello HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 771

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message The requested resource [/loi-javax/hello] is not available
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p>Tomcat 10 tìm annotation <code>jakarta.servlet.annotation.WebServlet</code>; một lớp gắn annotation <code>javax</code> cũ đối với nó chỉ là một lớp bình thường, nên <code>/hello</code> không ánh xạ tới đâu cả → <strong>404</strong>. Chẩn đoán trong mười giây: tìm trong project chữ <code>javax.servlet</code>. Sửa: đổi <code>javax.</code> thành <code>jakarta.</code> trong các import servlet và dùng thư viện Jakarta EE 10.</p>`),
    bi(`<h2>8. The other common errors</h2>
<table>
<thead><tr><th>Symptom (what you see)</th><th>Real cause</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>NetBeans: "Starting of Tomcat failed, the server port 8080 is already in use" / log: <code>java.net.BindException: Address already in use</code></td><td>another Tomcat (or Oracle XE, another app) holds 8080</td><td>stop the other Tomcat (<code>shutdown</code>), or change the port in <code>conf/server.xml</code> (<code>&lt;Connector port="8081" …&gt;</code>)</td></tr>
<tr><td>Tomcat does not start: <code>UnsupportedClassVersionError … class file version 55.0 … only recognizes class file versions up to 52.0</code></td><td>Tomcat 10.1 started with Java 8</td><td>point <code>JAVA_HOME</code> / NetBeans' Java Platform to JDK 17</td></tr>
<tr><td>Every page of the app 404 right after deploying</td><td>web.xml is not valid XML, or <code>javax</code> imports (section 7)</td><td>read <code>logs/catalina.*.log</code> for "Parse error"; search for javax</td></tr>
<tr><td><code>The TCP/IP connection to the host localhost, port 1433 has failed</code></td><td>SQL Server not running, TCP/IP disabled, wrong port (Express!)</td><td>Windows: Configuration Manager (section 4); macOS: <code>docker ps</code> — is the container up?</td></tr>
<tr><td><code>Login failed for user 'sa'</code></td><td>wrong password, or SQL authentication disabled</td><td>reset the sa password; enable Mixed Mode</td></tr>
<tr><td><code>... could not establish a secure connection ... PKIX path building failed</code></td><td>since driver 10.2, <code>encrypt=true</code> is the default and the server's certificate is self-signed</td><td>add <code>;encrypt=true;trustServerCertificate=true</code> (development) — as in DBContext above</td></tr>
<tr><td><code>ClassNotFoundException: com.microsoft.sqlserver.jdbc.SQLServerDriver</code> / <code>No suitable driver found</code></td><td>the driver jar is not in the deployed app's <code>WEB-INF/lib</code></td><td>add the jar to the project's Libraries / the Maven dependency; Clean and Build</td></tr>
<tr><td>Vietnamese becomes <code>?</code> in the database</td><td>column is <code>VARCHAR</code>, or literal without <code>N'…'</code></td><td>use <code>NVARCHAR</code>; <code>N'Nguyễn'</code>; with PreparedStatement <code>setString</code> is enough</td></tr>
</tbody>
</table>
<p class="meo">🧠 Ninety percent of setup problems are answered by two things: the <strong>Tomcat log</strong> (startup/deploy errors) and the <strong>exception message</strong> of the JDBC call. Read the first line of each — it usually names the cause.</p>
<p>Next: <strong>⭐ First hands-on session</strong> — your first servlet + JSP project, run and deployed.</p>`,
    `<h2>8. Các lỗi hay gặp khác</h2>
<table>
<thead><tr><th>Triệu chứng (thứ bạn thấy)</th><th>Nguyên nhân thật</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>NetBeans: "Starting of Tomcat failed, the server port 8080 is already in use" / log: <code>java.net.BindException: Address already in use</code></td><td>một Tomcat khác (hoặc Oracle XE, ứng dụng khác) đang giữ cổng 8080</td><td>tắt Tomcat kia (<code>shutdown</code>), hoặc đổi cổng trong <code>conf/server.xml</code> (<code>&lt;Connector port="8081" …&gt;</code>)</td></tr>
<tr><td>Tomcat không khởi động: <code>UnsupportedClassVersionError … class file version 55.0 … only recognizes class file versions up to 52.0</code></td><td>Tomcat 10.1 bị chạy bằng Java 8</td><td>trỏ <code>JAVA_HOME</code> / Java Platform của NetBeans về JDK 17</td></tr>
<tr><td>Mọi trang của ứng dụng đều 404 ngay sau khi deploy</td><td>web.xml không phải XML hợp lệ, hoặc import <code>javax</code> (mục 7)</td><td>đọc <code>logs/catalina.*.log</code> tìm "Parse error"; tìm chữ javax</td></tr>
<tr><td><code>The TCP/IP connection to the host localhost, port 1433 has failed</code></td><td>SQL Server chưa chạy, TCP/IP đang tắt, sai cổng (bản Express!)</td><td>Windows: Configuration Manager (mục 4); macOS: <code>docker ps</code> — container có đang chạy không?</td></tr>
<tr><td><code>Login failed for user 'sa'</code></td><td>sai mật khẩu, hoặc chưa bật xác thực SQL</td><td>đặt lại mật khẩu sa; bật Mixed Mode</td></tr>
<tr><td><code>... could not establish a secure connection ... PKIX path building failed</code></td><td>từ driver 10.2, <code>encrypt=true</code> là mặc định mà chứng chỉ của server là tự ký</td><td>thêm <code>;encrypt=true;trustServerCertificate=true</code> (môi trường học/dev) — như DBContext ở trên</td></tr>
<tr><td><code>ClassNotFoundException: com.microsoft.sqlserver.jdbc.SQLServerDriver</code> / <code>No suitable driver found</code></td><td>jar driver không nằm trong <code>WEB-INF/lib</code> của ứng dụng đã deploy</td><td>thêm jar vào Libraries của project / thêm dependency Maven; Clean and Build</td></tr>
<tr><td>Tiếng Việt thành <code>?</code> trong CSDL</td><td>cột kiểu <code>VARCHAR</code>, hoặc chuỗi thiếu <code>N'…'</code></td><td>dùng <code>NVARCHAR</code>; <code>N'Nguyễn'</code>; với PreparedStatement thì <code>setString</code> là đủ</td></tr>
</tbody>
</table>
<p class="meo">🧠 Chín phần mười lỗi cài đặt được trả lời bởi hai thứ: <strong>log của Tomcat</strong> (lỗi khởi động/deploy) và <strong>thông báo exception</strong> của lệnh JDBC. Đọc dòng đầu tiên của mỗi cái — nó thường gọi đúng tên nguyên nhân.</p>
<p>Tiếp theo: <strong>⭐ Buổi thực hành đầu tiên</strong> — project servlet + JSP đầu tiên của bạn, chạy và deploy.</p>`),
  ].join('\n'),
};

/* ───────── ⭐ First hands-on session — first servlet + JSP project in NetBeans: form → servlet → JSP, run, deploy a WAR ───────── */
const L_x_buoi_dau_tien = {
  title: '⭐ First hands-on session — first servlet + JSP project in NetBeans: form → servlet → JSP, run, deploy a WAR|||⭐ Buổi thực hành đầu tiên — project servlet + JSP đầu tiên trong NetBeans: form → servlet → JSP, chạy, deploy WAR',
  slug: 'prj301-buoi-dau-tien',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài tự thêm ngoài giáo trình, làm theo từng bước: tạo project web trong NetBeans (Maven hoặc Ant) cho Tomcat 10.1, viết trang JSP có form, servlet HelloServlet đọc tham số, kiểm tra dữ liệu ở server, đặt attribute rồi forward sang JSP kết quả; chạy và đọc request/response thật (cả session JSP tự tạo, dòng trống đầu trang, lỗ hổng XSS của EL), đóng file WAR và deploy tay vào Tomcat; ba bài tập nhỏ có lời giải và bản tương đương trong Spring Boot.',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ First hands-on session · added by this site</span>
<h2>From an empty folder to a working form → servlet → JSP application, in about 45 minutes</h2>
<p class="lead">This is the "hello world" of PRJ301 — but a useful one: it already has the shape of every PE question (a page with a form, a servlet that reads and checks the input, a JSP that shows the result). Do it with your own hands in NetBeans; this page shows, under each step, what the real Tomcat 10.1 answered when the same code ran.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/f70252fb243a90b740cc894aba21a0e596c06399.svg" alt="The three files of today and the one round trip they make" loading="lazy" /><p class="chu-thich">🧩 The three files of today and the one round trip they make</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title The first app: index.jsp → HelloServlet → result.jsp (one form round trip)
actor You
participant "Browser" as B
participant "index.jsp\\n(view: the form)" as I
participant "HelloServlet\\n(controller)" as S
participant "result.jsp\\n(view: the answer)" as R
You -&gt; B : open /buoi-dau/
B -&gt; I : GET /buoi-dau/ (welcome file)
I --&gt; B : HTML form
You -&gt; B : type a name, click "Say hello"
B -&gt; S : POST /buoi-dau/hello · name=...
S -&gt; S : getParameter("name"), check it,\\nsetAttribute("message", ...)
S -&gt; R : forward(request, response)
R --&gt; B : HTML "Xin chào, ...!"
note over S, R : forward stays on the SERVER:\\nthe browser still shows /buoi-dau/hello
@enduml</code></pre></details>
<table>
<thead><tr><th>Step</th><th>You will</th><th>Time</th></tr></thead>
<tbody>
<tr><td>1</td><td>create a web project for Tomcat 10.1</td><td>5 min</td></tr>
<tr><td>2</td><td>write <code>index.jsp</code> with a form</td><td>5 min</td></tr>
<tr><td>3</td><td>write <code>HelloServlet</code> (doPost)</td><td>10 min</td></tr>
<tr><td>4</td><td>write <code>result.jsp</code></td><td>5 min</td></tr>
<tr><td>5</td><td>run, test, read the HTTP in DevTools</td><td>10 min</td></tr>
<tr><td>6</td><td>build the WAR and deploy it without NetBeans</td><td>10 min</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Mục 0 · ⭐ Buổi thực hành đầu tiên · phần web tự thêm</span>
<h2>Từ một thư mục trống tới ứng dụng form → servlet → JSP chạy được, trong khoảng 45 phút</h2>
<p class="lead">Đây là "hello world" của PRJ301 — nhưng là một bản có ích: nó đã mang hình dạng của mọi câu PE (một trang có form, một servlet đọc và kiểm tra dữ liệu nhập, một JSP hiện kết quả). Tự tay làm trong NetBeans; dưới mỗi bước, trang này cho xem Tomcat 10.1 thật đã trả lời gì khi chạy đúng đoạn code đó.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/f70252fb243a90b740cc894aba21a0e596c06399.svg" alt="Ba file của hôm nay và một vòng đi–về mà chúng tạo ra" loading="lazy" /><p class="chu-thich">🧩 Ba file của hôm nay và một vòng đi–về mà chúng tạo ra</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title The first app: index.jsp → HelloServlet → result.jsp (one form round trip)
actor You
participant "Browser" as B
participant "index.jsp\\n(view: the form)" as I
participant "HelloServlet\\n(controller)" as S
participant "result.jsp\\n(view: the answer)" as R
You -&gt; B : open /buoi-dau/
B -&gt; I : GET /buoi-dau/ (welcome file)
I --&gt; B : HTML form
You -&gt; B : type a name, click "Say hello"
B -&gt; S : POST /buoi-dau/hello · name=...
S -&gt; S : getParameter("name"), check it,\\nsetAttribute("message", ...)
S -&gt; R : forward(request, response)
R --&gt; B : HTML "Xin chào, ...!"
note over S, R : forward stays on the SERVER:\\nthe browser still shows /buoi-dau/hello
@enduml</code></pre></details>
<table>
<thead><tr><th>Bước</th><th>Bạn sẽ</th><th>Thời gian</th></tr></thead>
<tbody>
<tr><td>1</td><td>tạo project web cho Tomcat 10.1</td><td>5 phút</td></tr>
<tr><td>2</td><td>viết <code>index.jsp</code> có form</td><td>5 phút</td></tr>
<tr><td>3</td><td>viết <code>HelloServlet</code> (doPost)</td><td>10 phút</td></tr>
<tr><td>4</td><td>viết <code>result.jsp</code></td><td>5 phút</td></tr>
<tr><td>5</td><td>chạy, thử, đọc HTTP trong DevTools</td><td>10 phút</td></tr>
<tr><td>6</td><td>đóng file WAR và deploy không cần NetBeans</td><td>10 phút</td></tr>
</tbody>
</table>`),
    bi(`<h2>Step 1 — create the project</h2>
<ol>
<li>NetBeans → <strong>File → New Project → Java with Maven → Web Application</strong> → Next.</li>
<li>Project Name <code>buoi-dau</code>, Group Id <code>edu.fpt.prj301</code>, Package <code>controller</code> → Next.</li>
<li>Server: the <strong>Apache Tomcat 10.1</strong> you added in the previous lesson; Java EE / Jakarta EE Version: <strong>Jakarta EE 10 Web</strong> → Finish.</li>
</ol>
<p>NetBeans creates <code>src/main/java</code> (Java code), <code>src/main/webapp</code> (pages; it becomes the root of the app) and <code>pom.xml</code> (it already contains the Jakarta EE API with scope <code>provided</code> — Tomcat provides it at run time). The context path is the project name: <code>/buoi-dau</code>.</p>
<div class="pitfall">If your lab only offers the Ant flavour (<strong>Java with Ant → Java Web → Web Application</strong>), the folders are called <code>src/java</code> and <code>web</code> instead — the code below is identical.</div>
<h2>Step 2 — the form: <code>index.jsp</code></h2>
<p>Right-click <em>Web Pages</em> → New → JSP → name <code>index</code>. Replace its content:</p>
<p class="ghi-chu">📄 <code>buoi-dau/src/main/webapp/index.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@page contentType="text/html" pageEncoding="UTF-8"%&gt;
&lt;%-- The first page: a form that posts to HelloServlet --%&gt;
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;PRJ301 — first app&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Hello PRJ301&lt;/h1&gt;
    &lt;form action="hello" method="post"&gt;
        Your name: &lt;input type="text" name="name" required&gt;
        &lt;button type="submit"&gt;Say hello&lt;/button&gt;
    &lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<ul>
<li>The first line (a <em>page directive</em>) tells Tomcat to send <code>text/html</code> and to read the file as UTF-8 — Chapter 3 explains JSP syntax.</li>
<li><code>action="hello"</code> is relative: it becomes <code>/buoi-dau/hello</code>. No leading slash (lesson 2.A, slide 29).</li>
<li><code>required</code> makes the browser refuse an empty field — a convenience only; the servlet still checks.</li>
</ul>`,
    `<h2>Bước 1 — tạo project</h2>
<ol>
<li>NetBeans → <strong>File → New Project → Java with Maven → Web Application</strong> → Next.</li>
<li>Project Name <code>buoi-dau</code>, Group Id <code>edu.fpt.prj301</code>, Package <code>controller</code> → Next.</li>
<li>Server: chính <strong>Apache Tomcat 10.1</strong> bạn đã thêm ở bài trước; Java EE / Jakarta EE Version: <strong>Jakarta EE 10 Web</strong> → Finish.</li>
</ol>
<p>NetBeans tạo <code>src/main/java</code> (code Java), <code>src/main/webapp</code> (các trang; nó thành gốc của ứng dụng) và <code>pom.xml</code> (đã có sẵn Jakarta EE API với scope <code>provided</code> — lúc chạy Tomcat tự cung cấp). Context path là tên project: <code>/buoi-dau</code>.</p>
<div class="pitfall">Nếu phòng lab chỉ có biến thể Ant (<strong>Java with Ant → Java Web → Web Application</strong>), các thư mục tên là <code>src/java</code> và <code>web</code> — code bên dưới y hệt.</div>
<h2>Bước 2 — form: <code>index.jsp</code></h2>
<p>Chuột phải <em>Web Pages</em> → New → JSP → tên <code>index</code>. Thay nội dung của nó:</p>
<p class="ghi-chu">📄 <code>buoi-dau/src/main/webapp/index.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@page contentType="text/html" pageEncoding="UTF-8"%&gt;
&lt;%-- Trang đầu tiên: một form gửi tới HelloServlet --%&gt;
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;PRJ301 — first app&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Hello PRJ301&lt;/h1&gt;
    &lt;form action="hello" method="post"&gt;
        Your name: &lt;input type="text" name="name" required&gt;
        &lt;button type="submit"&gt;Say hello&lt;/button&gt;
    &lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<ul>
<li>Dòng đầu (một <em>page directive</em> — chỉ thị trang) bảo Tomcat gửi <code>text/html</code> và đọc file theo UTF-8 — Chương 3 giải thích cú pháp JSP.</li>
<li><code>action="hello"</code> là đường dẫn tương đối: nó thành <code>/buoi-dau/hello</code>. Không có gạch chéo đầu (bài 2.A, slide 29).</li>
<li><code>required</code> làm trình duyệt không cho gửi ô trống — chỉ là tiện lợi; servlet vẫn phải kiểm tra.</li>
</ul>`),
    bi(`<h2>Step 3 — the controller: <code>HelloServlet</code></h2>
<p>Right-click the <code>controller</code> package → New → Servlet → Class Name <code>HelloServlet</code> → Next → URL Pattern <code>/hello</code>; leave "Add information to deployment descriptor (web.xml)" unticked (NetBeans then writes <code>@WebServlet</code>). Delete the generated sample code and write:</p>
<p class="ghi-chu">📄 <code>buoi-dau/src/main/java/controller/HelloServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Servlet = the controller: read input, decide, hand the result to a JSP
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");                 // read Vietnamese correctly on any server
        String name = request.getParameter("name");
        if (name == null || name.isBlank()) {                  // never trust the form: check on the server
            response.sendRedirect("index.jsp");
            return;
        }
        name = name.trim();
        request.setAttribute("message", "Xin chào, " + name + "!");   // data for the view
        request.setAttribute("length", name.length());
        request.getRequestDispatcher("result.jsp").forward(request, response);   // same request, JSP writes the HTML
    }
}</code></pre>
<p>Four habits you will keep for the whole course, all in these 15 lines: <strong>(1)</strong> <code>setCharacterEncoding("UTF-8")</code> before reading; <strong>(2)</strong> check the input on the server (never trust the browser); <strong>(3)</strong> put results into the request with <code>setAttribute</code>; <strong>(4)</strong> let a JSP produce the HTML via <code>forward</code> — the servlet does not print HTML. That last habit is MVC in miniature (Chapter 6).</p>
<h2>Step 4 — the view: <code>result.jsp</code></h2>
<p class="ghi-chu">📄 <code>buoi-dau/src/main/webapp/result.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@page contentType="text/html" pageEncoding="UTF-8"%&gt;
&lt;%-- The view: shows what the servlet put into the request --%&gt;
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;Result&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;&#36;{message}&lt;/h1&gt;
    &lt;p&gt;Characters in your name: &#36;{length}&lt;/p&gt;
    &lt;a href="index.jsp"&gt;Back&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p><code>&#36;{message}</code> is <strong>Expression Language</strong> (Chapter 3): it looks for an attribute named <code>message</code> — the one the servlet set — and prints it.</p>`,
    `<h2>Bước 3 — controller: <code>HelloServlet</code></h2>
<p>Chuột phải gói <code>controller</code> → New → Servlet → Class Name <code>HelloServlet</code> → Next → URL Pattern <code>/hello</code>; để trống ô "Add information to deployment descriptor (web.xml)" (khi đó NetBeans viết <code>@WebServlet</code>). Xoá đoạn code mẫu được sinh ra và viết:</p>
<p class="ghi-chu">📄 <code>buoi-dau/src/main/java/controller/HelloServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Servlet = controller: đọc dữ liệu vào, quyết định, giao kết quả cho JSP
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");                 // đọc đúng tiếng Việt trên mọi server
        String name = request.getParameter("name");
        if (name == null || name.isBlank()) {                  // đừng tin form: kiểm tra ở server
            response.sendRedirect("index.jsp");
            return;
        }
        name = name.trim();
        request.setAttribute("message", "Xin chào, " + name + "!");   // dữ liệu cho view
        request.setAttribute("length", name.length());
        request.getRequestDispatcher("result.jsp").forward(request, response);   // cùng request, JSP viết HTML
    }
}</code></pre>
<p>Bốn thói quen bạn giữ suốt cả môn, đều nằm trong 15 dòng này: <strong>(1)</strong> <code>setCharacterEncoding("UTF-8")</code> trước khi đọc; <strong>(2)</strong> kiểm tra dữ liệu nhập ở server (không bao giờ tin trình duyệt); <strong>(3)</strong> đặt kết quả vào request bằng <code>setAttribute</code>; <strong>(4)</strong> để JSP tạo HTML qua <code>forward</code> — servlet không in HTML. Thói quen cuối cùng chính là MVC thu nhỏ (Chương 6).</p>
<h2>Bước 4 — view: <code>result.jsp</code></h2>
<p class="ghi-chu">📄 <code>buoi-dau/src/main/webapp/result.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@page contentType="text/html" pageEncoding="UTF-8"%&gt;
&lt;%-- View: hiện thứ servlet đã đặt vào request --%&gt;
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;Result&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;&#36;{message}&lt;/h1&gt;
    &lt;p&gt;Characters in your name: &#36;{length}&lt;/p&gt;
    &lt;a href="index.jsp"&gt;Back&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p><code>&#36;{message}</code> là <strong>Expression Language</strong> (EL — ngôn ngữ biểu thức, Chương 3): nó tìm attribute tên <code>message</code> — đúng cái servlet đã đặt — và in ra.</p>`),
    bi(`<h2>Step 5 — run it and read the real HTTP</h2>
<p>Press F6. NetBeans builds, deploys and opens <code>http://localhost:8080/buoi-dau/</code>. Open DevTools (F12) → Network before you submit. These are the requests and responses of the same application running on Tomcat 10.1:</p>
<p><strong>5a. The home page</strong> (welcome file <code>index.jsp</code>):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /buoi-dau/ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/buoi-dau; HttpOnly
Content-Type: text/html;charset=UTF-8
Content-Length: 317



&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;PRJ301 — first app&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Hello PRJ301&lt;/h1&gt;
    &lt;form action="hello" method="post"&gt;
        Your name: &lt;input type="text" name="name" required&gt;
        &lt;button type="submit"&gt;Say hello&lt;/button&gt;
    &lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Two surprises worth understanding now: the body starts with <strong>empty lines</strong> — each JSP directive and comment line leaves its line break behind; and there is already a <strong>Set-Cookie: JSESSIONID</strong> although you never asked for a session — a JSP creates one by default (<code>session="true"</code>). Chapter 4 shows how to switch that off.</p>
<p><strong>5b. Submitting a Vietnamese name</strong>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /buoi-dau/hello HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 47

name=Nguy%E1%BB%85n+V%C4%83n+C%C6%B0%E1%BB%9Dng</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 236



&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;Result&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Xin chào, Nguyễn Văn Cường!&lt;/h1&gt;
    &lt;p&gt;Characters in your name: 16&lt;/p&gt;
    &lt;a href="index.jsp"&gt;Back&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>The address bar still shows <code>/buoi-dau/hello</code>: <code>forward</code> happened inside the server, the browser made one request only.</p>
<p><strong>5c. Submitting spaces only</strong> (the browser's <code>required</code> is bypassed easily — here by a direct request):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /buoi-dau/hello HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 8

name=+++</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: index.jsp
Content-Length: 0</code></pre>
<p><strong>5d. Typing HTML into the name</strong>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /buoi-dau/hello HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 24

name=%3Cb%3EAn%3C%2Fb%3E</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 222



&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;Result&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Xin chào, &lt;b&gt;An&lt;/b&gt;!&lt;/h1&gt;
    &lt;p&gt;Characters in your name: 9&lt;/p&gt;
    &lt;a href="index.jsp"&gt;Back&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<div class="pitfall"><code>&#36;{message}</code> printed <code>&lt;b&gt;An&lt;/b&gt;</code> as real HTML — the name appears bold. With <code>&lt;script&gt;</code> it would run JavaScript in the page (XSS). EL does not escape; in Chapter 3 you replace it with <code>&lt;c:out value="&#36;{message}"/&gt;</code>, which does. Remember this example.</div>`,
    `<h2>Bước 5 — chạy và đọc HTTP thật</h2>
<p>Nhấn F6. NetBeans build, deploy và mở <code>http://localhost:8080/buoi-dau/</code>. Mở DevTools (F12) → Network trước khi bấm gửi. Dưới đây là request và response của đúng ứng dụng này chạy trên Tomcat 10.1:</p>
<p><strong>5a. Trang chủ</strong> (welcome file <code>index.jsp</code>):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /buoi-dau/ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/buoi-dau; HttpOnly
Content-Type: text/html;charset=UTF-8
Content-Length: 317



&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;PRJ301 — first app&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Hello PRJ301&lt;/h1&gt;
    &lt;form action="hello" method="post"&gt;
        Your name: &lt;input type="text" name="name" required&gt;
        &lt;button type="submit"&gt;Say hello&lt;/button&gt;
    &lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Hai điều bất ngờ nên hiểu ngay: body bắt đầu bằng <strong>mấy dòng trống</strong> — mỗi dòng directive và chú thích JSP để lại dấu xuống dòng của nó; và đã có <strong>Set-Cookie: JSESSIONID</strong> dù bạn chưa hề xin session — JSP mặc định tự tạo một session (<code>session="true"</code>). Chương 4 chỉ cách tắt nó.</p>
<p><strong>5b. Gửi một cái tên tiếng Việt</strong>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /buoi-dau/hello HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 47

name=Nguy%E1%BB%85n+V%C4%83n+C%C6%B0%E1%BB%9Dng</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 236



&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;Result&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Xin chào, Nguyễn Văn Cường!&lt;/h1&gt;
    &lt;p&gt;Characters in your name: 16&lt;/p&gt;
    &lt;a href="index.jsp"&gt;Back&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Thanh địa chỉ vẫn hiện <code>/buoi-dau/hello</code>: <code>forward</code> diễn ra bên trong server, trình duyệt chỉ gửi đúng một request.</p>
<p><strong>5c. Gửi toàn dấu cách</strong> (<code>required</code> của trình duyệt bị vượt qua rất dễ — ở đây bằng một request gửi thẳng):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /buoi-dau/hello HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 8

name=+++</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: index.jsp
Content-Length: 0</code></pre>
<p><strong>5d. Gõ HTML vào ô tên</strong>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /buoi-dau/hello HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 24

name=%3Cb%3EAn%3C%2Fb%3E</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 222



&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;Result&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Xin chào, &lt;b&gt;An&lt;/b&gt;!&lt;/h1&gt;
    &lt;p&gt;Characters in your name: 9&lt;/p&gt;
    &lt;a href="index.jsp"&gt;Back&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<div class="pitfall"><code>&#36;{message}</code> đã in <code>&lt;b&gt;An&lt;/b&gt;</code> thành HTML thật — cái tên hiện in đậm. Với <code>&lt;script&gt;</code> nó sẽ chạy JavaScript trong trang (XSS). EL không escape; ở Chương 3 bạn thay nó bằng <code>&lt;c:out value="&#36;{message}"/&gt;</code> — thẻ này có escape. Hãy nhớ ví dụ này.</div>`),
    bi(`<h2>Step 6 — build the WAR and deploy it without NetBeans</h2>
<ol>
<li>Right-click the project → <strong>Clean and Build</strong>. Maven writes <code>target/buoi-dau-1.0-SNAPSHOT.war</code> (Ant: <code>dist/buoi-dau.war</code>). Rename it to <code>buoi-dau.war</code> — the file name becomes the context path.</li>
<li>Stop the Tomcat that NetBeans runs (Services → Servers → Tomcat → Stop).</li>
<li>Copy <code>buoi-dau.war</code> into <code>&lt;Tomcat&gt;/webapps/</code> and start Tomcat with <code>bin/startup.bat</code> / <code>bin/startup.sh</code>.</li>
<li>Open <code>http://localhost:8080/buoi-dau/</code>.</li>
</ol>
<p>Inside the WAR — exactly what the generator built and deployed for this lesson:</p>
<p class="ghi-chu">📦 Inside the <code>buoi-dau.war</code> the generator built and deployed (<code>jar tf</code>, sorted)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/controller/<br>
WEB-INF/classes/controller/HelloServlet.class<br>
index.jsp<br>
result.jsp</div>
<p>Compiled class under <code>WEB-INF/classes/controller/</code>, the JSPs at the root (reachable by URL), no <code>.java</code> file, no <code>servlet-api.jar</code> (Tomcat provides it). That is a complete, deployable Java web application.</p>`,
    `<h2>Bước 6 — đóng file WAR và deploy không cần NetBeans</h2>
<ol>
<li>Chuột phải project → <strong>Clean and Build</strong>. Maven ghi ra <code>target/buoi-dau-1.0-SNAPSHOT.war</code> (Ant: <code>dist/buoi-dau.war</code>). Đổi tên thành <code>buoi-dau.war</code> — tên file sẽ thành context path.</li>
<li>Tắt Tomcat do NetBeans chạy (Services → Servers → Tomcat → Stop).</li>
<li>Chép <code>buoi-dau.war</code> vào <code>&lt;Tomcat&gt;/webapps/</code> rồi khởi động Tomcat bằng <code>bin/startup.bat</code> / <code>bin/startup.sh</code>.</li>
<li>Mở <code>http://localhost:8080/buoi-dau/</code>.</li>
</ol>
<p>Bên trong file WAR — đúng thứ bộ sinh bài đã đóng và deploy cho bài này:</p>
<p class="ghi-chu">📦 Bên trong <code>buoi-dau.war</code> mà generator đã đóng và deploy (<code>jar tf</code>, sắp xếp)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/controller/<br>
WEB-INF/classes/controller/HelloServlet.class<br>
index.jsp<br>
result.jsp</div>
<p>Lớp đã biên dịch nằm trong <code>WEB-INF/classes/controller/</code>, các JSP ở gốc (truy cập được bằng URL), không có file <code>.java</code>, không có <code>servlet-api.jar</code> (Tomcat cung cấp). Đó là một ứng dụng Java web hoàn chỉnh, deploy được.</p>`),
    bi(`<h2>Three small exercises (10 minutes each)</h2>
<h3>🧪 Exercise 1 — say hello in the right language</h3>
<p>Add a radio group <code>lang</code> (values <code>vi</code>, <code>en</code>) to the form; the servlet greets "Xin chào, …!" or "Hello, …!".</p>
<p class="dap-an">✅ In <code>index.jsp</code>: <code>&lt;input type="radio" name="lang" value="vi" checked&gt; Tiếng Việt &lt;input type="radio" name="lang" value="en"&gt; English</code>. In the servlet: <code>String greet = "en".equals(request.getParameter("lang")) ? "Hello, " : "Xin chào, ";</code> — note <code>"en".equals(x)</code>, not <code>x.equals("en")</code>: if <code>lang</code> is missing, <code>x</code> is <code>null</code> and the second form throws NullPointerException.</p>
<h3>🧪 Exercise 2 — reject names that are too long</h3>
<p>Names over 50 characters must show "Name too long" on <code>index.jsp</code>, keeping what the user typed.</p>
<p class="dap-an">✅ In the servlet: <code>if (name.length() &gt; 50) { request.setAttribute("error", "Name too long"); request.setAttribute("typed", name); request.getRequestDispatcher("index.jsp").forward(request, response); return; }</code>; in <code>index.jsp</code> show <code>&#36;{error}</code> and set <code>value="&#36;{typed}"</code> on the input. Forward (not redirect) keeps the attributes — they live only in this request.</p>
<h3>🧪 Exercise 3 — what happens on GET?</h3>
<p>Type <code>http://localhost:8080/buoi-dau/hello</code> directly into the address bar. What do you get, and how do you make it show the form instead?</p>
<p class="dap-an">✅ <strong>405 Method Not Allowed</strong> ("HTTP method GET is not supported by this URL") — the servlet only overrides <code>doPost</code> (lesson 2.A, slide 31 shows the real response). Add <code>protected void doGet(...) { response.sendRedirect("index.jsp"); }</code>.</p>`,
    `<h2>Ba bài tập nhỏ (mỗi bài 10 phút)</h2>
<h3>🧪 Bài 1 — chào đúng ngôn ngữ</h3>
<p>Thêm nhóm radio <code>lang</code> (giá trị <code>vi</code>, <code>en</code>) vào form; servlet chào "Xin chào, …!" hoặc "Hello, …!".</p>
<p class="dap-an">✅ Trong <code>index.jsp</code>: <code>&lt;input type="radio" name="lang" value="vi" checked&gt; Tiếng Việt &lt;input type="radio" name="lang" value="en"&gt; English</code>. Trong servlet: <code>String greet = "en".equals(request.getParameter("lang")) ? "Hello, " : "Xin chào, ";</code> — để ý viết <code>"en".equals(x)</code> chứ không phải <code>x.equals("en")</code>: nếu thiếu <code>lang</code>, <code>x</code> là <code>null</code> và cách viết thứ hai ném NullPointerException.</p>
<h3>🧪 Bài 2 — từ chối tên quá dài</h3>
<p>Tên dài quá 50 ký tự thì phải hiện "Name too long" ở <code>index.jsp</code>, giữ lại chữ người dùng đã gõ.</p>
<p class="dap-an">✅ Trong servlet: <code>if (name.length() &gt; 50) { request.setAttribute("error", "Name too long"); request.setAttribute("typed", name); request.getRequestDispatcher("index.jsp").forward(request, response); return; }</code>; trong <code>index.jsp</code> hiện <code>&#36;{error}</code> và đặt <code>value="&#36;{typed}"</code> cho ô nhập. Dùng forward (không phải redirect) để giữ attribute — chúng chỉ sống trong request này.</p>
<h3>🧪 Bài 3 — gõ GET thì sao?</h3>
<p>Gõ thẳng <code>http://localhost:8080/buoi-dau/hello</code> vào thanh địa chỉ. Bạn nhận được gì, và làm sao để nó hiện form thay vào đó?</p>
<p class="dap-an">✅ <strong>405 Method Not Allowed</strong> ("HTTP method GET is not supported by this URL") — servlet chỉ ghi đè <code>doPost</code> (bài 2.A, slide 31 có response thật). Thêm <code>protected void doGet(...) { response.sendRedirect("index.jsp"); }</code>.</p>`),
    bi(`<h2>The same app in Spring Boot (for LabFlow, later)</h2>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): one class replaces the servlet; the JSP becomes a Thymeleaf template (or, in LabFlow, a React page calling a JSON API). Every idea of today survives — reading a parameter, checking it, putting data in a "model", choosing a view:
<pre><code class="language-java">@Controller
public class HelloController {
    @PostMapping("/hello")                                   // = @WebServlet("/hello") + doPost
    public String hello(@RequestParam String name, Model model) {   // = request.getParameter("name")
        if (name.isBlank()) return "redirect:/";             // = response.sendRedirect(...)
        model.addAttribute("message", "Xin chào, " + name.trim() + "!");   // = request.setAttribute(...)
        return "result";                                     // = forward to result.(jsp|html)
    }
}</code></pre>
Under the hood this still runs in Tomcat, inside <code>DispatcherServlet.doPost</code>.</div>
<p>✅ Done: you have written, run, read and deployed a Java web application. Chapter 1 now explains every piece you just used, slide by slide.</p>`,
    `<h2>Cùng ứng dụng này trong Spring Boot (cho LabFlow, về sau)</h2>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): một lớp thay cho servlet; JSP thành template Thymeleaf (hoặc, ở LabFlow, một trang React gọi API JSON). Mọi ý tưởng của hôm nay vẫn còn nguyên — đọc tham số, kiểm tra nó, đặt dữ liệu vào một "model", chọn một view:
<pre><code class="language-java">@Controller
public class HelloController {
    @PostMapping("/hello")                                   // = @WebServlet("/hello") + doPost
    public String hello(@RequestParam String name, Model model) {   // = request.getParameter("name")
        if (name.isBlank()) return "redirect:/";             // = response.sendRedirect(...)
        model.addAttribute("message", "Xin chào, " + name.trim() + "!");   // = request.setAttribute(...)
        return "result";                                     // = forward to result.(jsp|html)
    }
}</code></pre>
Bên dưới, nó vẫn chạy trong Tomcat, bên trong <code>DispatcherServlet.doPost</code>.</div>
<p>✅ Xong: bạn đã viết, chạy, đọc và deploy một ứng dụng Java web. Chương 1 giờ giải thích, theo từng slide, mọi mảnh bạn vừa dùng.</p>`),
  ].join('\n'),
};

export default {
  extrasStart: [L_x_bat_dau_tai_day, L_x_hoc_the_nao, L_x_cai_moi_truong, L_x_buoi_dau_tien],
};
