/**
 * PRJ301 · Chương 7 — JPA (prj8).
 * Bài 📑 học theo từng slide: prj8 (undefined, slide 1–19).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: prj301-on-ch7.
 * Quiz MỚI (10 câu, slug prj301-quiz-ch7).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRJ301/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRJ301/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 7.A — 📑 Slide by slide · JPA (1/1): entities, EntityManager, JPQL, relationships (Slot 21–22, slides 1–19) ───────── */
const L_prj8_1 = {
  title: '7.A — 📑 Slide by slide · JPA (1/1): entities, EntityManager, JPQL, relationships (Slot 21–22, slides 1–19)|||7.A — 📑 Học theo từng slide · JPA (1/1): entity, EntityManager, JPQL, quan hệ (Slot 21–22, slide 1–19)',
  slug: 'prj301-slide-prj8-1',
  type: 'VIDEO',
  description: 'Giảng đủ 19 slide bộ "JPA (Java Persistence API)" (Slot 21–22): JPA là đặc tả ORM và các provider (Hibernate, EclipseLink), ánh xạ lớp ↔ bảng, vì sao dùng JPA (và khi nào không), luật của lớp entity theo đặc tả Jakarta Persistence 3.1, field access và property access, @Entity/@Id/@GeneratedValue/@Column, bốn quan hệ và fetch mặc định, kiến trúc Persistence → EntityManagerFactory → EntityManager → EntityTransaction/Query, entity NetBeans "Entity Classes from Database" sinh ra, persistence.xml (đổi javax → jakarta), main() của slide 17 chạy thật cùng hai lỗi của nó, và app web demo 12 bước của slide 18 — mọi ví dụ chạy thật trên Tomcat 10.1 + EclipseLink 4 + SQL Server với log SQL thật: phân trang OFFSET/FETCH, UPDATE chỉ cột đổi, cache dùng chung, vấn đề N+1 đo bằng log rồi sửa bằng JOIN FETCH, LAZY bị bỏ qua khi không weaving, owning side và mappedBy; so DAO JPA với DAO JDBC của bài 5.B; ô Spring Data JPA cho LabFlow; 8 sơ đồ PlantUML.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.A · school deck "JPA (Java Persistence API)" (Slot 21–22), slides 1–19</span>
<h2>JPA — let Java objects stand for your tables, and know exactly which SQL that costs</h2>
<p class="lead">In Chapter 5 you wrote every SQL statement yourself and copied each <code>ResultSet</code> column into a Java object by hand (<code>map(rs)</code> in <code>HumanDAO</code>). <strong>JPA</strong> (Java Persistence API, today <em>Jakarta Persistence</em>) does that copying for you: you put annotations on a class, and a library called the <em>persistence provider</em> writes the <code>INSERT</code>, <code>SELECT</code>, <code>UPDATE</code> and <code>DELETE</code>. The school deck is short — 19 slides, many of them a single picture — so this lesson goes much further (every addition is marked ➕) and, above all, it <strong>shows the SQL</strong>: every example ran on a real Tomcat 10.1 with EclipseLink logging each statement it sent to SQL Server.</p>
<p>Why it matters: Assignment requirement <strong>1.6 "SQL Server with JDBC/JPA"</strong> lets you choose JPA; the syllabus has session 41 "Using JPA" and session 45 "a simple Web Application demo using JPA" (CLO8). And for LabFlow, Spring Boot's <code>spring-boot-starter-data-jpa</code> <em>is</em> JPA — Hibernate as the provider, Spring Data writing the DAO. Every bug in this lesson (a forgotten transaction, an N+1 query, a relationship saved with a NULL foreign key) happens there in exactly the same way.</p>
<table>
<thead><tr><th>Part of this lesson</th><th>School slides</th><th>What you will be able to do</th></tr></thead>
<tbody>
<tr><td>What JPA is</td><td>1–5</td><td>say what a specification and a provider are; map a class to a table; say honestly when JPA helps and when it does not</td></tr>
<tr><td>Entities</td><td>6–8</td><td>write an entity that the spec accepts; choose the annotations for a table; map @ManyToOne / @OneToMany and predict the SQL (➕ N+1, LAZY, owning side — measured)</td></tr>
<tr><td>Architecture</td><td>9–14</td><td>name the six pieces (Persistence, EntityManagerFactory, EntityManager, EntityTransaction, Query, entity) and how many of each a web app needs</td></tr>
<tr><td>Configuration</td><td>15–16</td><td>read and fix persistence.xml (javax → jakarta, the URL, the class list, logging)</td></tr>
<tr><td>The code</td><td>17–18</td><td>run slide 17's code and spot its two bugs; build slide 18's demo: Product → ProductDAO → ProductService → ProductServlet → JSP + error page</td></tr>
<tr><td>Summary</td><td>19</td><td>check yourself</td></tr>
</tbody>
</table>
<div class="callout"><strong>How to read the code.</strong> Four small web apps run on <strong>Tomcat 10.1 + JDK 17</strong> with <strong>EclipseLink 4.0.9</strong> (the JPA 3.1 provider — three jars only: <code>jakarta.persistence-api</code>, <code>eclipselink</code>, <code>mssql-jdbc</code>) against a real <strong>SQL Server</strong>. Under each response you see the <strong>console log</strong>: lines starting <code>[EL Fine]: sql:</code> are the exact SQL EclipseLink sent, <code>bind =&gt; […]</code> the values it bound to the <code>?</code>; lines starting <code>»</code> were printed by our servlet <em>between</em> them, so you can see <strong>when</strong> each query fires. The slides write <code>javax.persistence</code>; Tomcat 10+ and Spring Boot 3 need <code>jakarta.persistence</code> — only the package name changes (Section 0 explains why). The older web lessons 7.1 and 7.2 below stay as short summaries.</div>
<table>
<thead><tr><th>App</th><th>Slides</th><th>What it shows</th></tr></thead>
<tbody>
<tr><td><code>jpa-slide17</code></td><td>13, 15, 17</td><td>slide 13's entity, slide 15's persistence.xml and slide 17's main() exactly as on the slides; the transaction rules measured</td></tr>
<tr><td><code>jpa-san-pham</code></td><td>16, 18</td><td>the 12-step demo of slide 18: Product, JpaUtil, ProductDAO, ProductService, ProductServlet, product-list.jsp, error.jsp</td></tr>
<tr><td><code>jpa-quan-he</code></td><td>8</td><td>the Human / HumanType tables of lesson 5.B mapped with @ManyToOne / @OneToMany: EAGER, LAZY, N+1, JOIN FETCH, owning side</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Bài 7.A · bộ slide "JPA (Java Persistence API)" của trường (Slot 21–22), slide 1–19</span>
<h2>JPA — để đối tượng Java đại diện cho bảng, và biết chính xác cái giá SQL phải trả</h2>
<p class="lead">Ở Chương 5 bạn tự viết từng câu SQL và tự chép từng cột của <code>ResultSet</code> vào một đối tượng Java (<code>map(rs)</code> trong <code>HumanDAO</code>). <strong>JPA</strong> (Java Persistence API — API lưu trữ bền vững của Java, ngày nay tên là <em>Jakarta Persistence</em>) làm việc chép đó giúp bạn: bạn gắn annotation lên một lớp, và một thư viện gọi là <em>persistence provider</em> (bộ cài đặt JPA) tự viết <code>INSERT</code>, <code>SELECT</code>, <code>UPDATE</code>, <code>DELETE</code>. Bộ slide của trường ngắn — 19 slide, nhiều slide chỉ có một tấm hình — nên bài này đi xa hơn slide nhiều (mọi phần thêm đánh dấu ➕) và trên hết là <strong>cho bạn xem SQL</strong>: mọi ví dụ chạy trên Tomcat 10.1 thật, EclipseLink ghi log từng câu nó gửi tới SQL Server.</p>
<p>Vì sao quan trọng: yêu cầu <strong>1.6 "Sử dụng CSDL SQL Server kết hợp JDBC/JPA"</strong> của Assignment cho bạn chọn JPA; đề cương có buổi 41 "Using JPA" và buổi 45 "một ứng dụng web demo dùng JPA" (CLO8). Còn với LabFlow, <code>spring-boot-starter-data-jpa</code> của Spring Boot <em>chính là</em> JPA — Hibernate làm provider, Spring Data viết hộ DAO. Mọi lỗi trong bài này (quên giao dịch, truy vấn N+1, lưu quan hệ với khoá ngoại NULL) xảy ra y hệt ở đó.</p>
<table>
<thead><tr><th>Phần của bài</th><th>Slide trường</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>JPA là gì</td><td>1–5</td><td>nói được đặc tả và provider là gì; ánh xạ một lớp vào một bảng; nói thật lòng khi nào JPA giúp và khi nào không</td></tr>
<tr><td>Entity</td><td>6–8</td><td>viết một entity đúng đặc tả; chọn annotation cho một bảng; ánh xạ @ManyToOne / @OneToMany và đoán trước SQL (➕ N+1, LAZY, owning side — đo thật)</td></tr>
<tr><td>Kiến trúc</td><td>9–14</td><td>gọi tên sáu thành phần (Persistence, EntityManagerFactory, EntityManager, EntityTransaction, Query, entity) và một app web cần bao nhiêu cái mỗi loại</td></tr>
<tr><td>Cấu hình</td><td>15–16</td><td>đọc và sửa persistence.xml (javax → jakarta, URL, danh sách lớp, log)</td></tr>
<tr><td>Code</td><td>17–18</td><td>chạy code slide 17 và chỉ ra hai lỗi của nó; dựng demo slide 18: Product → ProductDAO → ProductService → ProductServlet → JSP + trang lỗi</td></tr>
<tr><td>Tóm tắt</td><td>19</td><td>tự kiểm tra</td></tr>
</tbody>
</table>
<div class="callout"><strong>Cách đọc code.</strong> Bốn app web nhỏ chạy trên <strong>Tomcat 10.1 + JDK 17</strong> với <strong>EclipseLink 4.0.9</strong> (provider của JPA 3.1 — chỉ ba jar: <code>jakarta.persistence-api</code>, <code>eclipselink</code>, <code>mssql-jdbc</code>) nối tới một <strong>SQL Server</strong> thật. Dưới mỗi response là <strong>log console</strong>: dòng mở bằng <code>[EL Fine]: sql:</code> là đúng câu SQL EclipseLink đã gửi, <code>bind =&gt; […]</code> là các giá trị nó gắn vào dấu <code>?</code>; dòng mở bằng <code>»</code> do servlet của ta in ra <em>xen giữa</em>, để bạn thấy mỗi câu truy vấn chạy <strong>lúc nào</strong>. Slide viết <code>javax.persistence</code>; Tomcat 10+ và Spring Boot 3 cần <code>jakarta.persistence</code> — chỉ đổi tên gói (Mục 0 giải thích vì sao). Hai bài web cũ 7.1 và 7.2 nằm dưới bài này vẫn giữ làm bản tóm tắt ngắn.</div>
<table>
<thead><tr><th>App</th><th>Slide</th><th>Cho thấy gì</th></tr></thead>
<tbody>
<tr><td><code>jpa-slide17</code></td><td>13, 15, 17</td><td>entity của slide 13, persistence.xml của slide 15 và main() của slide 17 y như trên slide; đo luật giao dịch</td></tr>
<tr><td><code>jpa-san-pham</code></td><td>16, 18</td><td>demo 12 bước của slide 18: Product, JpaUtil, ProductDAO, ProductService, ProductServlet, product-list.jsp, error.jsp</td></tr>
<tr><td><code>jpa-quan-he</code></td><td>8</td><td>bảng Human / HumanType của bài 5.B ánh xạ bằng @ManyToOne / @OneToMany: EAGER, LAZY, N+1, JOIN FETCH, owning side</td></tr>
</tbody>
</table>`),
    walkHead('prj8', 1, 19),
    walk('prj8', [
      [1, 'JPA (Java Persistence API)',
        `<p class="y-chinh">🎯 The title slide: JPA, the Java Persistence API — the standard way for a Java program to save objects into a relational database and load them back.</p>
<p>The name changed in 2019: when Oracle handed Java EE to the Eclipse Foundation, Java EE became <strong>Jakarta EE</strong> and "Java Persistence API" became <strong>Jakarta Persistence</strong>; from version 3.0 the package is <code>jakarta.persistence</code> instead of <code>javax.persistence</code>. Everyone still says "JPA", and so do the slides and this lesson.</p>
<p><strong>Persistence</strong> = keeping data after the program stops. Objects in RAM die with the JVM; rows in SQL Server survive. Chapter 5 did persistence with JDBC; this chapter does it with JPA. In the syllabus this is session 41 ("Using JPA") and session 45 ("a simple Web Application demo using JPA"), outcome CLO8.</p>
<p class="meo">🧠 One sentence for the whole deck: <em>with JDBC you move data between rows and objects yourself; with JPA you describe the mapping once and the provider moves it — but it still sends SQL, and you must learn to read that SQL.</em></p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề: JPA, Java Persistence API — cách chuẩn để một chương trình Java lưu đối tượng vào cơ sở dữ liệu quan hệ và nạp chúng trở lại.</p>
<p>Cái tên đã đổi năm 2019: khi Oracle trao Java EE cho Eclipse Foundation, Java EE thành <strong>Jakarta EE</strong> và "Java Persistence API" thành <strong>Jakarta Persistence</strong>; từ bản 3.0 gói tên là <code>jakarta.persistence</code> thay cho <code>javax.persistence</code>. Mọi người vẫn gọi "JPA", slide và bài này cũng vậy.</p>
<p><strong>Persistence (lưu trữ bền vững)</strong> = giữ dữ liệu sau khi chương trình dừng. Đối tượng trong RAM chết theo JVM; dòng trong SQL Server thì còn. Chương 5 làm việc lưu trữ bằng JDBC; chương này làm bằng JPA. Trong đề cương đây là buổi 41 ("Using JPA") và buổi 45 ("một ứng dụng web demo dùng JPA"), chuẩn đầu ra CLO8.</p>
<p class="meo">🧠 Một câu cho cả deck: <em>với JDBC bạn tự chuyển dữ liệu giữa dòng và đối tượng; với JPA bạn mô tả cách ánh xạ một lần và provider chuyển giúp — nhưng nó vẫn gửi SQL, và bạn phải học cách đọc SQL đó.</em></p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Six objectives: an introduction to JPA, entity class basics, the JPA architecture, obtaining a database connection, configuring JPA "with Hibernate", and a JPA web application demo.</p>
<table>
<thead><tr><th>Objective on the slide</th><th>Slides</th><th>➕ What this lesson adds</th></tr></thead>
<tbody>
<tr><td>Introduction to the Java Persistence API</td><td>3–5</td><td>versions and providers checked against jakarta.ee; when JPA is the wrong tool</td></tr>
<tr><td>JPA entity class basics</td><td>6–8</td><td>the exact rules of the spec (§2.1); relationships run for real: EAGER/LAZY, N+1, owning side</td></tr>
<tr><td>JPA Architecture</td><td>9–13</td><td>which objects are created once per app and which once per request; the NetBeans wizard that wrote slide 13</td></tr>
<tr><td>Obtaining a JPA Database Connection</td><td>14</td><td>a <code>@WebListener</code> that builds the factory once</td></tr>
<tr><td>Configure JPA with Hibernate Example</td><td>15–16</td><td>⚠️ the slides' configuration actually names <strong>EclipseLink</strong> as provider; we run that, and show the Hibernate line</td></tr>
<tr><td>JPA Web Application demo</td><td>17–18</td><td>the 12 steps built and run, with the SQL of every request; DAO JPA vs DAO JDBC (lesson 5.B)</td></tr>
</tbody>
</table>
<div class="pitfall">The objective says "with Hibernate", but slide 15's <code>&lt;provider&gt;</code> is <code>org.eclipse.persistence.jpa.PersistenceProvider</code> — that is EclipseLink. Both are JPA providers, so the Java code is the same; only the jar files and that one line differ. Do not be confused if your lab project uses one and the slide mentions the other.</div>`,
        `<p class="y-chinh">🎯 Sáu mục tiêu: giới thiệu JPA, cơ bản về lớp entity, kiến trúc JPA, lấy kết nối CSDL, cấu hình JPA "với Hibernate", và một demo ứng dụng web dùng JPA.</p>
<table>
<thead><tr><th>Mục tiêu trên slide</th><th>Slide</th><th>➕ Bài này thêm gì</th></tr></thead>
<tbody>
<tr><td>Giới thiệu Java Persistence API</td><td>3–5</td><td>phiên bản và provider kiểm trên jakarta.ee; khi nào JPA là công cụ sai</td></tr>
<tr><td>Cơ bản về lớp entity</td><td>6–8</td><td>luật chính xác của đặc tả (§2.1); quan hệ chạy thật: EAGER/LAZY, N+1, owning side</td></tr>
<tr><td>Kiến trúc JPA</td><td>9–13</td><td>đối tượng nào tạo một lần cho cả app, cái nào mỗi request một lần; trình hướng dẫn NetBeans đã viết ra slide 13</td></tr>
<tr><td>Lấy kết nối CSDL bằng JPA</td><td>14</td><td>một <code>@WebListener</code> dựng factory đúng một lần</td></tr>
<tr><td>Cấu hình JPA với Hibernate</td><td>15–16</td><td>⚠️ cấu hình trên slide thực ra ghi provider là <strong>EclipseLink</strong>; ta chạy đúng cái đó, và chỉ dòng dành cho Hibernate</td></tr>
<tr><td>Demo ứng dụng web JPA</td><td>17–18</td><td>12 bước dựng và chạy thật, kèm SQL của mọi request; DAO JPA so với DAO JDBC (bài 5.B)</td></tr>
</tbody>
</table>
<div class="pitfall">Mục tiêu ghi "with Hibernate", nhưng <code>&lt;provider&gt;</code> ở slide 15 là <code>org.eclipse.persistence.jpa.PersistenceProvider</code> — đó là EclipseLink. Cả hai đều là provider của JPA nên code Java như nhau; chỉ khác các file jar và đúng một dòng đó. Đừng rối nếu project ở phòng lab dùng cái này còn slide nhắc cái kia.</div>`],
      [3, 'JPA - Introduction',
        `<p class="y-chinh">🎯 JPA is a Java EE / Jakarta EE <strong>specification</strong> for managing relational data: a standard for ORM (object-relational mapping) that converts between Java objects (POJOs) and tables; the library that implements it is the <strong>persistence provider</strong> — Hibernate, EclipseLink, Apache OpenJPA.</p>
<p><strong>Specification vs provider</strong> — the same idea as JDBC in Chapter 5: <code>java.sql.Connection</code> is an interface, the mssql-jdbc driver implements it. Here <code>jakarta.persistence.EntityManager</code> is an interface, and EclipseLink (or Hibernate) implements it. You code against the interfaces; swapping the provider means swapping jars and one line of persistence.xml. <strong>POJO</strong> = "plain old Java object": an ordinary class, it does not extend anything from JPA.</p>
<table>
<thead><tr><th>Version</th><th>Year</th><th>Platform</th><th>Note</th></tr></thead>
<tbody>
<tr><td>JPA 1.0</td><td>2006</td><td>Java EE 5 (JSR 220)</td><td>born inside EJB 3.0</td></tr>
<tr><td>JPA 2.0 / 2.1 / 2.2</td><td>2009 / 2013 / 2017</td><td>Java EE 6 / 7 / 8</td><td>Criteria API, converters, java.time (2.2)</td></tr>
<tr><td>Jakarta Persistence 3.0</td><td>2020</td><td>Jakarta EE 9</td><td>only change: <code>javax.persistence</code> → <code>jakarta.persistence</code></td></tr>
<tr><td>Jakarta Persistence 3.1</td><td>2022</td><td>Jakarta EE 10</td><td>the version this lesson runs (EclipseLink 4.0); Spring Boot 3 uses it via Hibernate 6</td></tr>
<tr><td>Jakarta Persistence 3.2</td><td>2024</td><td>Jakarta EE 11</td><td>EclipseLink 5, Hibernate 7</td></tr>
</tbody>
</table>
<p>"EclipseLink (official RI of JPA)": EclipseLink was the reference implementation of JPA 2.x. Jakarta EE no longer crowns one "RI"; the 3.1 page on jakarta.ee lists <em>compatible implementations</em> — EclipseLink 4.0 and Hibernate 6.0. Hibernate is by far the most used (it is what Spring Boot pulls in).</p>
<p class="meo">🧠 JDBC driver : JDBC API = JPA provider : JPA API. Remember the pair and slide 10 will feel familiar.</p>`,
        `<p class="y-chinh">🎯 JPA là một <strong>đặc tả (specification)</strong> của Java EE / Jakarta EE để quản lý dữ liệu quan hệ: chuẩn cho ORM (object-relational mapping — ánh xạ đối tượng-quan hệ), chuyển đổi giữa đối tượng Java (POJO) và bảng; thư viện cài đặt đặc tả đó gọi là <strong>persistence provider</strong> — Hibernate, EclipseLink, Apache OpenJPA.</p>
<p><strong>Đặc tả và provider</strong> — cùng ý với JDBC ở Chương 5: <code>java.sql.Connection</code> là interface, driver mssql-jdbc cài đặt nó. Ở đây <code>jakarta.persistence.EntityManager</code> là interface, còn EclipseLink (hoặc Hibernate) cài đặt nó. Bạn viết code theo interface; đổi provider nghĩa là đổi jar và một dòng trong persistence.xml. <strong>POJO</strong> = "plain old Java object" (đối tượng Java thường): một lớp bình thường, không kế thừa gì của JPA.</p>
<table>
<thead><tr><th>Phiên bản</th><th>Năm</th><th>Nền tảng</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>JPA 1.0</td><td>2006</td><td>Java EE 5 (JSR 220)</td><td>ra đời bên trong EJB 3.0</td></tr>
<tr><td>JPA 2.0 / 2.1 / 2.2</td><td>2009 / 2013 / 2017</td><td>Java EE 6 / 7 / 8</td><td>Criteria API, converter, java.time (2.2)</td></tr>
<tr><td>Jakarta Persistence 3.0</td><td>2020</td><td>Jakarta EE 9</td><td>thay đổi duy nhất: <code>javax.persistence</code> → <code>jakarta.persistence</code></td></tr>
<tr><td>Jakarta Persistence 3.1</td><td>2022</td><td>Jakarta EE 10</td><td>bản bài này chạy (EclipseLink 4.0); Spring Boot 3 dùng nó qua Hibernate 6</td></tr>
<tr><td>Jakarta Persistence 3.2</td><td>2024</td><td>Jakarta EE 11</td><td>EclipseLink 5, Hibernate 7</td></tr>
</tbody>
</table>
<p>"EclipseLink (official RI of JPA)": EclipseLink từng là bản cài đặt tham chiếu (reference implementation) của JPA 2.x. Jakarta EE không còn phong một "RI" duy nhất; trang 3.1 trên jakarta.ee liệt kê các <em>bản cài đặt tương thích</em> — EclipseLink 4.0 và Hibernate 6.0. Hibernate được dùng nhiều nhất, bỏ xa các bản khác (Spring Boot kéo nó vào).</p>
<p class="meo">🧠 JDBC driver : JDBC API = JPA provider : JPA API. Nhớ cặp này thì slide 10 sẽ thấy quen.</p>`],
      [4, 'Hibernate ORM mapping',
        `<p class="y-chinh">🎯 The picture (taken from javaguides.net): a Java class <code>Student</code> (id, firstName, lastName, email, getters/setters) and a table <code>student</code> with the same columns, with the provider in the middle converting both ways.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/c4783406ac9a72ebd62f3c0b92a9b60c56c39033.svg" alt="One class ⇄ one table, one field ⇄ one column, one object ⇄ one row; the provider writes the SQL" loading="lazy" /><p class="chu-thich">🧩 One class ⇄ one table, one field ⇄ one column, one object ⇄ one row; the provider writes the SQL</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
allowmixing
title Slide 4: object-relational mapping — one class ⇄ one table, one object ⇄ one row
left to right direction
rectangle "Java (objects)" as J {
  class Product &lt;&lt;@Entity&gt;&gt; {
    - id : Integer  &lt;&lt;@Id&gt;&gt;
    - name : String
    - price : BigDecimal
    - description : String
    + getters / setters
  }
  object "p : Product" as P {
    id = 2
    name = "Sharp microwave"
    price = 2150000.00
  }
}
component "JPA provider\\n(EclipseLink or Hibernate)\\n\\nwrites the SQL,\\nreads the rows back" as JPA
rectangle "SQL Server (tables)" as D {
  class "Product (table)" as T &lt;&lt;table&gt;&gt; {
    id : int IDENTITY PK
    name : nvarchar(255)
    price : decimal(10,2)
    description : nvarchar(500) NULL
  }
  object "row 2" as R {
    2 | Sharp microwave | 2150000.00 | NULL
  }
}
Product ..&gt; JPA : annotations\\n(the mapping)
JPA ..&gt; T : SQL\\n(INSERT, SELECT…)
P &lt;..&gt; R : em.find(Product.class, 2)\\nem.persist(p)
@enduml</code></pre></details>
<p>➕ What really has to be translated (the "object-relational impedance mismatch"):</p>
<table>
<thead><tr><th>Java side</th><th>Database side</th><th>In JPA</th></tr></thead>
<tbody>
<tr><td>class <code>Product</code></td><td>table <code>Product</code></td><td><code>@Entity</code> (+ <code>@Table</code> if the names differ)</td></tr>
<tr><td>field <code>BigDecimal price</code></td><td>column <code>price decimal(10,2)</code></td><td><code>@Column</code> (name, length, precision, nullable)</td></tr>
<tr><td>object identity (<code>==</code>)</td><td>primary key</td><td><code>@Id</code>, generated by <code>@GeneratedValue</code></td></tr>
<tr><td>a reference <code>human.getType()</code></td><td>a foreign key <code>typeid int</code></td><td><code>@ManyToOne</code> + <code>@JoinColumn</code></td></tr>
<tr><td>a list <code>type.getHumans()</code></td><td>no column at all — a query</td><td><code>@OneToMany(mappedBy = …)</code></td></tr>
</tbody>
</table>
<p>The last two rows are where JPA earns its keep and where it bites — slide 8 measures both. The general theory (class diagram → Java → JPA → table for every UML relationship) is in ⭐ SWD392 CS.2: <a href="/courses/software-architecture-and-design/learn?lessonSlug=swd392-slide-cs2-1">Class diagram → Java → JPA → tables</a>; this lesson does not repeat it, it runs it.</p>`,
        `<p class="y-chinh">🎯 Hình (lấy từ javaguides.net): một lớp Java <code>Student</code> (id, firstName, lastName, email, getter/setter) và một bảng <code>student</code> có cùng các cột, provider ở giữa chuyển đổi hai chiều.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/c4783406ac9a72ebd62f3c0b92a9b60c56c39033.svg" alt="Một lớp ⇄ một bảng, một trường ⇄ một cột, một đối tượng ⇄ một dòng; provider viết SQL" loading="lazy" /><p class="chu-thich">🧩 Một lớp ⇄ một bảng, một trường ⇄ một cột, một đối tượng ⇄ một dòng; provider viết SQL</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
allowmixing
title Slide 4: object-relational mapping — one class ⇄ one table, one object ⇄ one row
left to right direction
rectangle "Java (objects)" as J {
  class Product &lt;&lt;@Entity&gt;&gt; {
    - id : Integer  &lt;&lt;@Id&gt;&gt;
    - name : String
    - price : BigDecimal
    - description : String
    + getters / setters
  }
  object "p : Product" as P {
    id = 2
    name = "Sharp microwave"
    price = 2150000.00
  }
}
component "JPA provider\\n(EclipseLink or Hibernate)\\n\\nwrites the SQL,\\nreads the rows back" as JPA
rectangle "SQL Server (tables)" as D {
  class "Product (table)" as T &lt;&lt;table&gt;&gt; {
    id : int IDENTITY PK
    name : nvarchar(255)
    price : decimal(10,2)
    description : nvarchar(500) NULL
  }
  object "row 2" as R {
    2 | Sharp microwave | 2150000.00 | NULL
  }
}
Product ..&gt; JPA : annotations\\n(the mapping)
JPA ..&gt; T : SQL\\n(INSERT, SELECT…)
P &lt;..&gt; R : em.find(Product.class, 2)\\nem.persist(p)
@enduml</code></pre></details>
<p>➕ Những thứ thật sự phải "phiên dịch" (gọi là "object-relational impedance mismatch" — độ lệch giữa thế giới đối tượng và thế giới bảng):</p>
<table>
<thead><tr><th>Phía Java</th><th>Phía CSDL</th><th>Trong JPA</th></tr></thead>
<tbody>
<tr><td>lớp <code>Product</code></td><td>bảng <code>Product</code></td><td><code>@Entity</code> (+ <code>@Table</code> nếu tên khác nhau)</td></tr>
<tr><td>trường <code>BigDecimal price</code></td><td>cột <code>price decimal(10,2)</code></td><td><code>@Column</code> (tên, độ dài, độ chính xác, có cho NULL không)</td></tr>
<tr><td>danh tính đối tượng (<code>==</code>)</td><td>khoá chính</td><td><code>@Id</code>, sinh bởi <code>@GeneratedValue</code></td></tr>
<tr><td>một tham chiếu <code>human.getType()</code></td><td>một khoá ngoại <code>typeid int</code></td><td><code>@ManyToOne</code> + <code>@JoinColumn</code></td></tr>
<tr><td>một danh sách <code>type.getHumans()</code></td><td>không có cột nào — là một truy vấn</td><td><code>@OneToMany(mappedBy = …)</code></td></tr>
</tbody>
</table>
<p>Hai dòng cuối là chỗ JPA đáng tiền nhất và cũng là chỗ nó cắn đau nhất — slide 8 đo cả hai. Lý thuyết tổng quát (class diagram → Java → JPA → bảng cho mọi quan hệ UML) nằm ở ⭐ SWD392 CS.2: <a href="/courses/software-architecture-and-design/learn?lessonSlug=swd392-slide-cs2-1">Class diagram → Java → JPA → bảng</a>; bài này không giảng lại, mà cho chạy thật.</p>`],
      [5, 'Why use JPA?',
        `<p class="y-chinh">🎯 Four reasons on the slide: less manual JDBC code (no hand-written SQL for CRUD), easier to maintain (relationships declared with annotations), good integration with Java EE and Spring Boot, and a cache that makes queries faster.</p>
<p>Each claim, checked against what our apps really did:</p>
<table>
<thead><tr><th>Claim</th><th>True?</th><th>Measured in this lesson</th></tr></thead>
<tbody>
<tr><td>No SQL for CRUD</td><td>✅ for single rows</td><td><code>persist</code> → <code>INSERT</code>, <code>remove</code> → <code>DELETE</code>, changing one field → <code>UPDATE Product SET price = ?</code> (only the changed column)</td></tr>
<tr><td>Relationships via annotations</td><td>✅, with traps</td><td><code>@ManyToOne</code> made 1 + 3 SELECTs for 8 rows until we wrote <code>JOIN FETCH</code> (slide 8)</td></tr>
<tr><td>Integration with Spring Boot</td><td>✅</td><td>Spring Data JPA writes the DAO for you (🧭 box at slide 18)</td></tr>
<tr><td>Cache, faster</td><td>✅, with a catch</td><td><code>em.find(Product.class, 2)</code> after the list sent <strong>no SQL at all</strong>; but the cached object can differ from the row (see below)</td></tr>
</tbody>
</table>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-san-pham/products?id=2 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Products&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Products&lt;/h1&gt;
&lt;form action="products" method="get"&gt;&lt;input name="q" value=""&gt; &lt;button&gt;Search&lt;/button&gt;&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Id&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Description&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Panasonic rice cooker&lt;/td&gt;&lt;td&gt;1290000.00&lt;/td&gt;&lt;td&gt;1.8 L, 10 menus&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=1"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Sharp microwave&lt;/td&gt;&lt;td&gt;2150000.00&lt;/td&gt;&lt;td&gt;-&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=2"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Philips kettle&lt;/td&gt;&lt;td&gt;459000.00&lt;/td&gt;&lt;td&gt;1.7 L, stainless steel&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=3"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 1/2&lt;/p&gt;&lt;h2&gt;Edit product 2&lt;/h2&gt;
&lt;form action="products" method="post"&gt;
  &lt;input type="hidden" name="action" value="update"&gt;
  &lt;input type="hidden" name="id" value="2"&gt;
  Name &lt;input name="name" value="Sharp microwave"&gt; &lt;br&gt;
  Price &lt;input name="price" value="2150000.00"&gt; &lt;br&gt;
  Description &lt;input name="description" value=""&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT id, description, name, price FROM Product ORDER BY id OFFSET ? ROWS FETCH NEXT ? ROWS ONLY<br>
	bind =&gt; [0, 3]<br>
[EL Fine]: sql: SELECT COUNT(id) FROM Product</div>
<p>The log above holds only the list queries — the product for the edit form came from EclipseLink's <strong>shared cache</strong> (on by default in EclipseLink). The id 99, never seen before, did hit the database:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-san-pham/products?id=99 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 726

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message No product with id 99
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT id, description, name, price FROM Product WHERE (id = ?)<br>
	bind =&gt; [99]</div>
<div class="pitfall">➕ When JPA is the wrong tool: reports with GROUP BY over many tables, bulk updates of thousands of rows, a DBA's tuned stored procedure. Use JPQL aggregates, a native query, or plain JDBC there — Spring Boot projects mix them every day. And "no SQL" never means "no need to know SQL": the N+1 bug of slide 8 is invisible unless you read the log.</div>`,
        `<p class="y-chinh">🎯 Bốn lý do trên slide: bớt code JDBC viết tay (không tự viết SQL cho CRUD), dễ bảo trì (quan hệ khai bằng annotation), tích hợp tốt với Java EE và Spring Boot, và có cache giúp truy vấn nhanh hơn.</p>
<p>Từng lời hứa, đối chiếu với những gì app của ta thật sự làm:</p>
<table>
<thead><tr><th>Lời hứa</th><th>Đúng không?</th><th>Đo trong bài này</th></tr></thead>
<tbody>
<tr><td>Không SQL cho CRUD</td><td>✅ với từng dòng</td><td><code>persist</code> → <code>INSERT</code>, <code>remove</code> → <code>DELETE</code>, đổi một trường → <code>UPDATE Product SET price = ?</code> (chỉ cột đã đổi)</td></tr>
<tr><td>Quan hệ bằng annotation</td><td>✅, có bẫy</td><td><code>@ManyToOne</code> sinh 1 + 3 SELECT cho 8 dòng cho tới khi ta viết <code>JOIN FETCH</code> (slide 8)</td></tr>
<tr><td>Tích hợp Spring Boot</td><td>✅</td><td>Spring Data JPA viết hộ DAO (ô 🧭 ở slide 18)</td></tr>
<tr><td>Cache, nhanh hơn</td><td>✅, có điều kiện</td><td><code>em.find(Product.class, 2)</code> sau khi xem danh sách <strong>không gửi câu SQL nào</strong>; nhưng đối tượng trong cache có thể khác dòng trong bảng (xem dưới)</td></tr>
</tbody>
</table>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-san-pham/products?id=2 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Products&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Products&lt;/h1&gt;
&lt;form action="products" method="get"&gt;&lt;input name="q" value=""&gt; &lt;button&gt;Search&lt;/button&gt;&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Id&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Description&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Panasonic rice cooker&lt;/td&gt;&lt;td&gt;1290000.00&lt;/td&gt;&lt;td&gt;1.8 L, 10 menus&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=1"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Sharp microwave&lt;/td&gt;&lt;td&gt;2150000.00&lt;/td&gt;&lt;td&gt;-&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=2"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Philips kettle&lt;/td&gt;&lt;td&gt;459000.00&lt;/td&gt;&lt;td&gt;1.7 L, stainless steel&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=3"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 1/2&lt;/p&gt;&lt;h2&gt;Edit product 2&lt;/h2&gt;
&lt;form action="products" method="post"&gt;
  &lt;input type="hidden" name="action" value="update"&gt;
  &lt;input type="hidden" name="id" value="2"&gt;
  Name &lt;input name="name" value="Sharp microwave"&gt; &lt;br&gt;
  Price &lt;input name="price" value="2150000.00"&gt; &lt;br&gt;
  Description &lt;input name="description" value=""&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT id, description, name, price FROM Product ORDER BY id OFFSET ? ROWS FETCH NEXT ? ROWS ONLY<br>
	bind =&gt; [0, 3]<br>
[EL Fine]: sql: SELECT COUNT(id) FROM Product</div>
<p>Log ở trên chỉ có các câu của danh sách — sản phẩm cho form sửa lấy từ <strong>cache dùng chung (shared cache)</strong> của EclipseLink (EclipseLink bật sẵn). Id 99, chưa từng gặp, thì phải xuống CSDL:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-san-pham/products?id=99 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 726

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message No product with id 99
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT id, description, name, price FROM Product WHERE (id = ?)<br>
	bind =&gt; [99]</div>
<div class="pitfall">➕ Khi nào JPA là công cụ sai: báo cáo GROUP BY trên nhiều bảng, cập nhật hàng loạt hàng nghìn dòng, stored procedure mà DBA đã tinh chỉnh. Ở đó hãy dùng hàm gộp của JPQL, native query, hoặc JDBC thuần — dự án Spring Boot trộn chúng hằng ngày. Và "không SQL" không bao giờ nghĩa là "khỏi cần biết SQL": lỗi N+1 ở slide 8 vô hình nếu bạn không đọc log.</div>`],
      [6, 'JPA Entity Class Basics — defining an entity, requirements',
        `<p class="y-chinh">🎯 An entity class is a Java class mapped to a table, one object per row. Requirements: the <code>@Entity</code> annotation; a parameterless constructor (JPA creates objects from rows with it); not <code>final</code> (so the provider can extend or proxy it); <code>Serializable</code> if a detached object travels over the network.</p>
<p>The exact rules, from the Jakarta Persistence 3.1 specification §2.1 (➕ more precise than the slide):</p>
<ul>
<li>annotated <code>@Entity</code> (or declared in an XML mapping file);</li>
<li>a no-arg constructor that is <strong>public or protected</strong> — other constructors are allowed too;</li>
<li>a <strong>top-level</strong> class (not nested), not an enum or interface;</li>
<li>not <code>final</code>, and no <code>final</code> methods or persistent fields;</li>
<li><code>Serializable</code> only "if an entity instance is to be passed by value as a detached object (e.g., through a remote interface)" — for an object you put in the <code>HttpSession</code> it is a good habit too, since Tomcat can save sessions to disk.</li>
</ul>
<p>Our corrected <code>Product</code> (the shape NetBeans generates — slide 13 — with <code>jakarta.*</code> and <code>BigDecimal</code>):</p>
<p class="ghi-chu">📄 <code>jpa-san-pham/src/main/java/model/Product.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Product")
@NamedQueries({
    @NamedQuery(name = "Product.findAll", query = "SELECT p FROM Product p ORDER BY p.id"),
    @NamedQuery(name = "Product.findByName", query = "SELECT p FROM Product p WHERE p.name = :name")})
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)      // the database fills id (IDENTITY(1,1))
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @Column(name = "name", length = 255)
    private String name;
    @Basic(optional = false)
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;                                // decimal(10,2) ⇒ BigDecimal, not double
    @Column(name = "description", length = 500)
    private String description;

    public Product() {                                       // required: JPA builds objects from rows with it
    }

    public Product(String name, BigDecimal price, String description) {
        this.name = name;
        this.price = price;
        this.description = description;
    }</code></pre>
<p>Forget the no-arg constructor and nothing compiles wrong — EclipseLink refuses the whole persistence unit when it starts (exercise 2 of the 🧪 practice 7.3):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-loi-entity/check?pu=no-ctor HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 369

persistence unit "no-ctor": SELECT e FROM NoCtor e
→ jakarta.persistence.PersistenceException
  Exception Description: Deployment of PersistenceUnit [no-ctor] failed.
    Close all factories for this PersistenceUnit.
  Exception Description: The instance creation method [model.NoCtor.&lt;Default Constructor&gt;], with no parameters, does not exist, or is not accessible.</code></pre>`,
        `<p class="y-chinh">🎯 Lớp entity là một lớp Java ánh xạ vào một bảng, mỗi đối tượng ứng với một dòng. Yêu cầu: có annotation <code>@Entity</code>; có constructor không tham số (JPA dùng nó để tạo đối tượng từ dòng); không <code>final</code> (để provider kế thừa hoặc làm proxy được); <code>Serializable</code> nếu đối tượng ở trạng thái detached đi qua mạng.</p>
<p>Luật chính xác, theo đặc tả Jakarta Persistence 3.1 §2.1 (➕ chính xác hơn slide):</p>
<ul>
<li>có <code>@Entity</code> (hoặc khai trong file ánh xạ XML);</li>
<li>có constructor không tham số là <strong>public hoặc protected</strong> — vẫn được có thêm constructor khác;</li>
<li>là lớp <strong>cấp cao nhất (top-level)</strong> (không lồng trong lớp khác), không phải enum hay interface;</li>
<li>không <code>final</code>, và không có phương thức hay trường lưu trữ nào <code>final</code>;</li>
<li><code>Serializable</code> chỉ bắt buộc "nếu một entity được truyền theo giá trị dưới dạng đối tượng detached (vd qua một remote interface)" — với đối tượng bạn bỏ vào <code>HttpSession</code> thì cũng nên có, vì Tomcat có thể ghi session ra đĩa.</li>
</ul>
<p><code>Product</code> đã sửa của ta (đúng dáng NetBeans sinh ra — slide 13 — đổi sang <code>jakarta.*</code> và <code>BigDecimal</code>):</p>
<p class="ghi-chu">📄 <code>jpa-san-pham/src/main/java/model/Product.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Product")
@NamedQueries({
    @NamedQuery(name = "Product.findAll", query = "SELECT p FROM Product p ORDER BY p.id"),
    @NamedQuery(name = "Product.findByName", query = "SELECT p FROM Product p WHERE p.name = :name")})
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)      // CSDL tự điền id (IDENTITY(1,1))
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @Column(name = "name", length = 255)
    private String name;
    @Basic(optional = false)
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;                                // decimal(10,2) ⇒ BigDecimal, không phải double
    @Column(name = "description", length = 500)
    private String description;

    public Product() {                                       // bắt buộc: JPA dựng đối tượng từ dòng bằng nó
    }

    public Product(String name, BigDecimal price, String description) {
        this.name = name;
        this.price = price;
        this.description = description;
    }</code></pre>
<p>Quên constructor không tham số thì không có gì biên dịch sai — EclipseLink từ chối cả persistence unit lúc khởi động (bài 2 của 🧪 thực hành 7.3):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-loi-entity/check?pu=no-ctor HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 369

persistence unit "no-ctor": SELECT e FROM NoCtor e
→ jakarta.persistence.PersistenceException
  Exception Description: Deployment of PersistenceUnit [no-ctor] failed.
    Close all factories for this PersistenceUnit.
  Exception Description: The instance creation method [model.NoCtor.&lt;Default Constructor&gt;], with no parameters, does not exist, or is not accessible.</code></pre>`],
      [7, 'JPA Entity Class Basics — persistent fields and properties',
        `<p class="y-chinh">🎯 The persistent state should be <code>private</code>, <code>protected</code> or package-private and accessed through getters/setters; getters and setters can also be used to map the data, following the JavaBeans naming convention.</p>
<p>The slide mixes two words that the spec keeps apart (§2.2–2.3). JPA reads and writes your object in one of two ways, and <strong>where you put <code>@Id</code> decides which</strong>:</p>
<table>
<thead><tr><th></th><th>Field access</th><th>Property access</th></tr></thead>
<tbody>
<tr><td>Annotations go on…</td><td>the fields (<code>@Id private Integer id;</code>)</td><td>the getters (<code>@Id public Integer getId()</code>)</td></tr>
<tr><td>JPA reads/writes…</td><td>the fields directly</td><td>through <code>getX()</code> / <code>setX()</code></td></tr>
<tr><td>Every non-transient field / every getter-setter pair…</td><td>is persistent</td><td>is persistent</td></tr>
<tr><td>Used by</td><td>NetBeans (field access is its default), most code you will meet, all our apps</td><td>rare today</td></tr>
</tbody>
</table>
<p>The slide's line "Persistent Fields — getter/setter methods can be used to map data" actually describes <em>property</em> access. Either way: the fields stay <code>private</code>, and other classes use the getters — exactly the JavaBean rules of Chapter 3, which is why <code>&#36;{p.name}</code> in a JSP works on an entity.</p>
<div class="pitfall">FE-style trap: the JavaBeans getter of a <code>boolean</code> field <code>gender</code> is <code>isGender()</code> (or <code>getGender()</code>); the setter is <code>setGender(boolean)</code>. And do not mix the two placements in one class — EclipseLink's error for a class without a usable <code>@Id</code> literally says "make sure that you do not have mixed access-type (both fields and properties annotated)". A field you do not want stored gets <code>@Transient</code>.</div>`,
        `<p class="y-chinh">🎯 Trạng thái được lưu nên khai <code>private</code>, <code>protected</code> hoặc package-private (mặc định của gói) và truy cập qua getter/setter; getter và setter cũng có thể được dùng để ánh xạ dữ liệu, theo quy ước đặt tên JavaBeans.</p>
<p>Slide trộn hai từ mà đặc tả tách bạch (§2.2–2.3). JPA đọc và ghi đối tượng của bạn theo một trong hai cách, và <strong>chỗ bạn đặt <code>@Id</code> quyết định cách nào</strong>:</p>
<table>
<thead><tr><th></th><th>Field access (truy cập qua trường)</th><th>Property access (truy cập qua thuộc tính)</th></tr></thead>
<tbody>
<tr><td>Annotation đặt trên…</td><td>các trường (<code>@Id private Integer id;</code>)</td><td>các getter (<code>@Id public Integer getId()</code>)</td></tr>
<tr><td>JPA đọc/ghi…</td><td>thẳng vào trường</td><td>qua <code>getX()</code> / <code>setX()</code></td></tr>
<tr><td>Mọi trường không transient / mọi cặp getter-setter…</td><td>đều được lưu</td><td>đều được lưu</td></tr>
<tr><td>Ai dùng</td><td>NetBeans (mặc định của nó), phần lớn code bạn sẽ gặp, mọi app của ta</td><td>ngày nay hiếm</td></tr>
</tbody>
</table>
<p>Dòng trên slide "Persistent Fields — getter/setter methods can be used to map data" thật ra mô tả <em>property</em> access. Cách nào thì trường vẫn <code>private</code>, lớp khác dùng getter — đúng luật JavaBean của Chương 3, nên <code>&#36;{p.name}</code> trong JSP chạy được trên một entity.</p>
<div class="pitfall">Bẫy kiểu FE: getter JavaBeans của trường <code>boolean gender</code> là <code>isGender()</code> (hoặc <code>getGender()</code>); setter là <code>setGender(boolean)</code>. Và đừng trộn hai kiểu đặt annotation trong một lớp — lỗi của EclipseLink cho lớp không có <code>@Id</code> dùng được ghi đúng câu "make sure that you do not have mixed access-type (both fields and properties annotated)". Trường nào không muốn lưu thì gắn <code>@Transient</code>.</div>`],
      [8, 'JPA Entity Class Basics — annotations, primary keys, relationship mapping',
        `<p class="y-chinh">🎯 <code>@Entity</code>, <code>@Id</code>, <code>@GeneratedValue</code> and <code>@Column</code> map an object to a row; <code>@Id</code> marks the primary key, <code>@GeneratedValue</code> lets it be generated; relationships use <code>@OneToOne</code>, <code>@OneToMany</code>, <code>@ManyToOne</code>, <code>@ManyToMany</code>.</p>
<table>
<thead><tr><th>Annotation</th><th>Meaning</th><th>Example from our apps</th></tr></thead>
<tbody>
<tr><td><code>@Entity</code></td><td>this class is stored in a table</td><td><code>Product</code>, <code>Human</code></td></tr>
<tr><td><code>@Table(name = "…")</code></td><td>the table name, when it is not the class name</td><td><code>@Table(name = "Accounts")</code> for class <code>Account</code></td></tr>
<tr><td><code>@Id</code></td><td>the primary key field</td><td><code>private Integer id;</code></td></tr>
<tr><td><code>@GeneratedValue(strategy = IDENTITY)</code></td><td>the database creates the key (SQL Server <code>IDENTITY(1,1)</code>)</td><td><code>Product.id</code>; not on <code>HumanType</code>, whose ids 1, 2, 3 we assign</td></tr>
<tr><td><code>@Column(name, length, nullable, precision, scale)</code></td><td>the column name and its limits</td><td><code>@Column(name = "humanname")</code></td></tr>
<tr><td><code>@Basic(optional = false)</code></td><td>the value may not be null</td><td>what NetBeans writes for NOT NULL columns</td></tr>
<tr><td><code>@Transient</code></td><td>not stored</td><td>a computed total</td></tr>
</tbody>
</table>
<p>Without <code>@Table</code> the table name is the entity name — EclipseLink even upper-cases it: slide 13's class produced <code>INSERT INTO PRODUCT …</code>, which works only because SQL Server compares names case-insensitively by default.</p>
<h3>➕ Relationships, run for real</h3>
<p>The four annotations have different <strong>default fetch types</strong> (spec §11.1.29, .30, .40, .41): <code>@ManyToOne</code> and <code>@OneToOne</code> are <strong>EAGER</strong>, <code>@OneToMany</code> and <code>@ManyToMany</code> are <strong>LAZY</strong>. We map lesson 5.B's tables — the foreign key <code>typeid</code> lives in <code>Human</code>:</p>
<p class="ghi-chu">📄 <code>jpa-quan-he/src/main/java/model/Human.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Human")
public class Human {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "humanid")
    private Integer id;
    @Column(name = "humanname")
    private String name;
    @Column(name = "humandob")
    private LocalDate dob;                                  // DATE ⇒ java.time.LocalDate (JPA 2.2+)
    @Column(name = "humangender")
    private Boolean gender;

    @ManyToOne                                              // default fetch = EAGER
    @JoinColumn(name = "typeid")                            // the FK column in table Human
    private HumanType type;                                 // an OBJECT, not an int typeid</code></pre>
<p class="ghi-chu">📄 <code>jpa-quan-he/src/main/java/model/HumanType.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "HumanType")
public class HumanType {
    @Id
    @Column(name = "typeid")
    private Integer id;                                     // assigned by us (1, 2, 3), not IDENTITY
    @Column(name = "typename")
    private String name;

    @OneToMany(mappedBy = "type")                           // default fetch = LAZY
    private List&lt;Human&gt; humans = new ArrayList&lt;&gt;();</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/ffd172f7e0e4c8a1b45a81803ce9ea5c51de2871.svg" alt="The table with the foreign key is the owning side; mappedBy marks the other side" loading="lazy" /><p class="chu-thich">🧩 The table with the foreign key is the owning side; mappedBy marks the other side</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Owning side vs inverse side (Human ⇄ HumanType)
class Human &lt;&lt;@Entity&gt;&gt; {
  - id : Integer
  - name : String
  - type : HumanType  &lt;&lt;@ManyToOne @JoinColumn("typeid")&gt;&gt;
}
class HumanType &lt;&lt;@Entity&gt;&gt; {
  - id : Integer
  - name : String
  - humans : List&lt;Human&gt;  &lt;&lt;@OneToMany(mappedBy = "type")&gt;&gt;
}
Human "*" -- "1" HumanType
note left of Human
  OWNING side: table Human has the
  FK column typeid. JPA writes typeid
  from lan.getType() — and only from it.
end note
note right of HumanType
  INVERSE side: mappedBy = "type"
  points at the owning field.
  student.getHumans().add(lan) alone
  changes NOTHING in the database.
end note
@enduml</code></pre></details>
<p><strong>1. EAGER and the N+1 problem.</strong> List 8 humans and print each type's name:</p>
<p class="ghi-chu">📄 <code>jpa-quan-he/src/main/java/controller/RelServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "eager" -&gt; {                                 // @ManyToOne EAGER (the default)
    mark("query: SELECT h FROM Human h");
    List&lt;Human&gt; list = em.createQuery("SELECT h FROM Human h ORDER BY h.id", Human.class).getResultList();
    mark("query returned " + list.size() + " humans; now printing h.getType().getName()");
    for (Human h : list) out.println(h.getName() + " - " + h.getType().getName());
}
case "join-fetch" -&gt; {                            // the fix: one query with a JOIN
    mark("query: SELECT h FROM Human h JOIN FETCH h.type");
    List&lt;Human&gt; list = em.createQuery("SELECT h FROM Human h JOIN FETCH h.type ORDER BY h.id", Human.class).getResultList();
    mark("query returned " + list.size() + " humans; now printing h.getType().getName()");
    for (Human h : list) out.println(h.getName() + " - " + h.getType().getName());
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=eager HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 123

Steve - student
Elon - teacher
Musk - worker
Melon - student
Kais - worker
An - student
Bình - teacher
Cường - student</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">» query: SELECT h FROM Human h<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human ORDER BY humanid<br>
[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [2]<br>
[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [3]<br>
» query returned 8 humans; now printing h.getType().getName()</div>
<p>One SELECT for the humans, then <strong>one more SELECT per type</strong> — before the loop even starts (EAGER). That is the famous <strong>N+1</strong>: here N = 3 because the persistence context gives back the same <code>HumanType</code> object for the same id; with 100 different types it would be 101 queries per page view. The fix is a <strong>fetch join</strong> (§4.4.5.3) — one query with a join:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=join-fetch HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 123

Steve - student
Elon - teacher
Musk - worker
Melon - student
Kais - worker
An - student
Bình - teacher
Cường - student</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">» query: SELECT h FROM Human h JOIN FETCH h.type<br>
[EL Fine]: sql: SELECT t1.humanid, t1.humandob, t1.humangender, t1.humanname, t1.typeid, t0.typeid, t0.typename FROM HumanType t0, Human t1 WHERE (t0.typeid = t1.typeid) ORDER BY t1.humanid<br>
» query returned 8 humans; now printing h.getType().getName()</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/c7048e73527e75c9f4c7798131f82ab4e7a30f01.svg" alt="Same page, same output: 4 SELECTs vs 1" loading="lazy" /><p class="chu-thich">🧩 Same page, same output: 4 SELECTs vs 1</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title The N+1 problem, measured on 8 humans of 3 types (log of jpa-quan-he)
participant "RelServlet" as S
participant "EntityManager" as EM
database "SQL Server" as DB
group default @ManyToOne (EAGER): 1 + 3 SELECTs
  S -&gt; EM : SELECT h FROM Human h
  EM -&gt; DB : SELECT … FROM Human
  EM -&gt; DB : SELECT … FROM HumanType WHERE typeid = 1
  EM -&gt; DB : SELECT … FROM HumanType WHERE typeid = 2
  EM -&gt; DB : SELECT … FROM HumanType WHERE typeid = 3
  note right : N = number of DIFFERENT types\\n(the same type object is reused);\\n100 types ⇒ 101 SELECTs
end
group JOIN FETCH: 1 SELECT
  S -&gt; EM : SELECT h FROM Human h JOIN FETCH h.type
  EM -&gt; DB : SELECT … FROM HumanType t0, Human t1\\nWHERE t0.typeid = t1.typeid
end
@enduml</code></pre></details>
<p><strong>2. "LAZY" on a @ManyToOne is only a hint.</strong> The spec says so (§11.1.6), and EclipseLink needs <em>weaving</em> (bytecode changes made by a Java agent) to honour it; plain Tomcat has none. Measured with <code>@ManyToOne(fetch = FetchType.LAZY)</code> — the warning appears as soon as the app touches the database, and the types are loaded eagerly anyway:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=lazy-many-to-one HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 123

Steve - student
Elon - teacher
Musk - worker
Melon - student
Kais - worker
An - student
Bình - teacher
Cường - student</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Warning]: metadata: Reverting the lazy setting on the OneToOne or ManyToOne attribute [type] for the entity class [class model.HumanLazy] since weaving was not enabled or did not occur.<br>
» query: SELECT h FROM HumanLazy h<br>
[EL Fine]: sql: SELECT humanid, humanname, typeid FROM Human ORDER BY humanid<br>
[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [2]<br>
[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [3]<br>
» query returned 8 rows; type NOT touched yet</div>
<p><strong>3. @OneToMany is LAZY.</strong> The list of humans of a type is loaded the moment you touch it — watch the <code>»</code> lines:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=types HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 53

student: 4 people
teacher: 2 people
worker: 2 people</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT typeid, typename FROM HumanType ORDER BY typeid<br>
» type 1: calling t.getHumans().size()<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
» type 2: calling t.getHumans().size()<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [2]<br>
» type 3: calling t.getHumans().size()<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [3]</div>
<p>Again 1 + N. A fetch join on a collection fixes it, but it returns the type once <em>per human</em> (8 results for 3 types) — add <code>DISTINCT</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=types-fetch HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 106

without DISTINCT: 8 results
with DISTINCT: 3 results
student: 4 people
teacher: 2 people
worker: 2 people</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT t1.typeid, t1.typename, t0.humanid, t0.humandob, t0.humangender, t0.humanname, t0.typeid FROM HumanType t1 LEFT OUTER JOIN Human t0 ON (t0.typeid = t1.typeid) ORDER BY t1.typeid<br>
[EL Fine]: sql: SELECT DISTINCT t1.typeid, t1.typename, t0.humanid, t0.humandob, t0.humangender, t0.humanname, t0.typeid FROM HumanType t1 LEFT OUTER JOIN Human t0 ON (t0.typeid = t1.typeid) ORDER BY t1.typeid<br>
» both queries done; now calling t.getHumans().size()</div>
<p><strong>4. After <code>em.close()</code>.</strong> EclipseLink quietly opens a new connection and still loads a LAZY list. <strong>Hibernate — Spring Boot's provider — throws <code>LazyInitializationException</code> here</strong> (Hibernate User Guide, "Fetching"). Never rely on this; load what the JSP needs before closing (JOIN FETCH).</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=after-close HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 39

em.isOpen() = false; teacher: 2 people</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [2]<br>
» em is closed; calling t.getHumans().size()<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [2]</div>
<p><strong>5. The owning side.</strong> Spec §2.10: "the owning side of a relationship determines the updates to the relationship in the database"; the side with <code>mappedBy</code> is the inverse side and is ignored when writing. Adding Lan only to <code>student.getHumans()</code> saves her with <code>typeid = NULL</code>; setting <code>hoa.setType(student)</code> saves <code>typeid = 1</code>:</p>
<p class="ghi-chu">📄 <code>jpa-quan-he/src/main/java/controller/RelServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "owning-wrong" -&gt; {                          // add to the INVERSE side only
    EntityTransaction tx = em.getTransaction();
    tx.begin();
    HumanType student = em.find(HumanType.class, 1);
    Human lan = new Human("Lan", LocalDate.of(2005, 3, 14), false);
    student.getHumans().add(lan);                 // the list knows Lan…
    em.persist(lan);                              // …but lan.type is still null
    tx.commit();
    out.println(row(em, lan.getId()));
}
case "owning-right" -&gt; {                          // set the OWNING side (and keep the list in sync)
    EntityTransaction tx = em.getTransaction();
    tx.begin();
    HumanType student = em.find(HumanType.class, 1);
    Human hoa = new Human("Hoa", LocalDate.of(2005, 6, 1), false);
    hoa.setType(student);                         // this is what JPA writes to typeid
    student.getHumans().add(hoa);                 // only for the objects in memory
    em.persist(hoa);
    tx.commit();
    out.println(row(em, hoa.getId()));
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=owning-wrong HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 58

row in table Human: humanid=9, humanname=Lan, typeid=null</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: INSERT INTO Human (humandob, humangender, humanname, typeid) VALUES (?, ?, ?, ?)<br>
	bind =&gt; [2005-03-14, false, Lan, null]<br>
[EL Fine]: sql: SELECT humanid, humanname, typeid FROM Human WHERE humanid = ?<br>
	bind =&gt; [9]</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=owning-right HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 56

row in table Human: humanid=10, humanname=Hoa, typeid=1</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: INSERT INTO Human (humandob, humangender, humanname, typeid) VALUES (?, ?, ?, ?)<br>
	bind =&gt; [2005-06-01, false, Hoa, 1]<br>
[EL Fine]: sql: SELECT humanid, humanname, typeid FROM Human WHERE humanid = ?<br>
	bind =&gt; [10]</div>
<div class="pitfall">Three rules to keep: (1) a list page that shows a related field ⇒ <code>JOIN FETCH</code> it (and <code>DISTINCT</code> for collections); (2) always set the field of the <strong>owning</strong> side (the one with <code>@JoinColumn</code>), and also update the list if you keep using it in memory; (3) <code>mappedBy</code> names the <em>Java field</em> on the other class (<code>"type"</code>), never a column. OneToOne, ManyToMany, cascade and inheritance: ⭐ SWD392 CS.2.</div>`,
        `<p class="y-chinh">🎯 <code>@Entity</code>, <code>@Id</code>, <code>@GeneratedValue</code> và <code>@Column</code> ánh xạ một đối tượng vào một dòng; <code>@Id</code> đánh dấu khoá chính, <code>@GeneratedValue</code> cho phép sinh khoá tự động; quan hệ dùng <code>@OneToOne</code>, <code>@OneToMany</code>, <code>@ManyToOne</code>, <code>@ManyToMany</code>.</p>
<table>
<thead><tr><th>Annotation</th><th>Nghĩa</th><th>Ví dụ trong app của ta</th></tr></thead>
<tbody>
<tr><td><code>@Entity</code></td><td>lớp này được lưu trong một bảng</td><td><code>Product</code>, <code>Human</code></td></tr>
<tr><td><code>@Table(name = "…")</code></td><td>tên bảng, khi nó khác tên lớp</td><td><code>@Table(name = "Accounts")</code> cho lớp <code>Account</code></td></tr>
<tr><td><code>@Id</code></td><td>trường khoá chính</td><td><code>private Integer id;</code></td></tr>
<tr><td><code>@GeneratedValue(strategy = IDENTITY)</code></td><td>CSDL tự tạo khoá (<code>IDENTITY(1,1)</code> của SQL Server)</td><td><code>Product.id</code>; không đặt cho <code>HumanType</code>, vì id 1, 2, 3 do ta gán</td></tr>
<tr><td><code>@Column(name, length, nullable, precision, scale)</code></td><td>tên cột và các giới hạn của nó</td><td><code>@Column(name = "humanname")</code></td></tr>
<tr><td><code>@Basic(optional = false)</code></td><td>giá trị không được null</td><td>thứ NetBeans viết cho cột NOT NULL</td></tr>
<tr><td><code>@Transient</code></td><td>không lưu</td><td>một tổng tính ra</td></tr>
</tbody>
</table>
<p>Không có <code>@Table</code> thì tên bảng là tên entity — EclipseLink còn viết hoa: lớp của slide 13 sinh ra <code>INSERT INTO PRODUCT …</code>, chạy được chỉ vì SQL Server mặc định so tên không phân biệt hoa thường.</p>
<h3>➕ Quan hệ, chạy thật</h3>
<p>Bốn annotation có <strong>kiểu nạp (fetch) mặc định</strong> khác nhau (đặc tả §11.1.29, .30, .40, .41): <code>@ManyToOne</code> và <code>@OneToOne</code> là <strong>EAGER</strong> (nạp ngay), <code>@OneToMany</code> và <code>@ManyToMany</code> là <strong>LAZY</strong> (nạp khi cần). Ta ánh xạ hai bảng của bài 5.B — khoá ngoại <code>typeid</code> nằm trong <code>Human</code>:</p>
<p class="ghi-chu">📄 <code>jpa-quan-he/src/main/java/model/Human.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Human")
public class Human {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "humanid")
    private Integer id;
    @Column(name = "humanname")
    private String name;
    @Column(name = "humandob")
    private LocalDate dob;                                  // DATE ⇒ java.time.LocalDate (JPA 2.2+)
    @Column(name = "humangender")
    private Boolean gender;

    @ManyToOne                                              // fetch mặc định = EAGER
    @JoinColumn(name = "typeid")                            // cột khoá ngoại trong bảng Human
    private HumanType type;                                 // một ĐỐI TƯỢNG, không phải int typeid</code></pre>
<p class="ghi-chu">📄 <code>jpa-quan-he/src/main/java/model/HumanType.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "HumanType")
public class HumanType {
    @Id
    @Column(name = "typeid")
    private Integer id;                                     // do ta gán (1, 2, 3), không IDENTITY
    @Column(name = "typename")
    private String name;

    @OneToMany(mappedBy = "type")                           // fetch mặc định = LAZY
    private List&lt;Human&gt; humans = new ArrayList&lt;&gt;();</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/ffd172f7e0e4c8a1b45a81803ce9ea5c51de2871.svg" alt="Bảng có khoá ngoại là phía sở hữu; mappedBy đánh dấu phía còn lại" loading="lazy" /><p class="chu-thich">🧩 Bảng có khoá ngoại là phía sở hữu; mappedBy đánh dấu phía còn lại</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Owning side vs inverse side (Human ⇄ HumanType)
class Human &lt;&lt;@Entity&gt;&gt; {
  - id : Integer
  - name : String
  - type : HumanType  &lt;&lt;@ManyToOne @JoinColumn("typeid")&gt;&gt;
}
class HumanType &lt;&lt;@Entity&gt;&gt; {
  - id : Integer
  - name : String
  - humans : List&lt;Human&gt;  &lt;&lt;@OneToMany(mappedBy = "type")&gt;&gt;
}
Human "*" -- "1" HumanType
note left of Human
  OWNING side: table Human has the
  FK column typeid. JPA writes typeid
  from lan.getType() — and only from it.
end note
note right of HumanType
  INVERSE side: mappedBy = "type"
  points at the owning field.
  student.getHumans().add(lan) alone
  changes NOTHING in the database.
end note
@enduml</code></pre></details>
<p><strong>1. EAGER và vấn đề N+1.</strong> Lấy 8 người và in tên loại của từng người:</p>
<p class="ghi-chu">📄 <code>jpa-quan-he/src/main/java/controller/RelServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "eager" -&gt; {                                 // @ManyToOne EAGER (mặc định)
    mark("query: SELECT h FROM Human h");
    List&lt;Human&gt; list = em.createQuery("SELECT h FROM Human h ORDER BY h.id", Human.class).getResultList();
    mark("query returned " + list.size() + " humans; now printing h.getType().getName()");
    for (Human h : list) out.println(h.getName() + " - " + h.getType().getName());
}
case "join-fetch" -&gt; {                            // cách sửa: một câu có JOIN
    mark("query: SELECT h FROM Human h JOIN FETCH h.type");
    List&lt;Human&gt; list = em.createQuery("SELECT h FROM Human h JOIN FETCH h.type ORDER BY h.id", Human.class).getResultList();
    mark("query returned " + list.size() + " humans; now printing h.getType().getName()");
    for (Human h : list) out.println(h.getName() + " - " + h.getType().getName());
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=eager HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 123

Steve - student
Elon - teacher
Musk - worker
Melon - student
Kais - worker
An - student
Bình - teacher
Cường - student</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">» query: SELECT h FROM Human h<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human ORDER BY humanid<br>
[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [2]<br>
[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [3]<br>
» query returned 8 humans; now printing h.getType().getName()</div>
<p>Một SELECT cho người, rồi <strong>thêm một SELECT cho mỗi loại</strong> — ngay cả trước khi vòng lặp chạy (EAGER). Đó là vấn đề <strong>N+1</strong> nổi tiếng: ở đây N = 3 vì persistence context (ngữ cảnh lưu trữ) trả lại cùng một đối tượng <code>HumanType</code> cho cùng một id; nếu có 100 loại khác nhau thì là 101 truy vấn cho mỗi lần mở trang. Cách sửa là <strong>fetch join</strong> (§4.4.5.3) — một câu có join:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=join-fetch HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 123

Steve - student
Elon - teacher
Musk - worker
Melon - student
Kais - worker
An - student
Bình - teacher
Cường - student</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">» query: SELECT h FROM Human h JOIN FETCH h.type<br>
[EL Fine]: sql: SELECT t1.humanid, t1.humandob, t1.humangender, t1.humanname, t1.typeid, t0.typeid, t0.typename FROM HumanType t0, Human t1 WHERE (t0.typeid = t1.typeid) ORDER BY t1.humanid<br>
» query returned 8 humans; now printing h.getType().getName()</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/c7048e73527e75c9f4c7798131f82ab4e7a30f01.svg" alt="Cùng trang, cùng kết quả: 4 SELECT so với 1" loading="lazy" /><p class="chu-thich">🧩 Cùng trang, cùng kết quả: 4 SELECT so với 1</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title The N+1 problem, measured on 8 humans of 3 types (log of jpa-quan-he)
participant "RelServlet" as S
participant "EntityManager" as EM
database "SQL Server" as DB
group default @ManyToOne (EAGER): 1 + 3 SELECTs
  S -&gt; EM : SELECT h FROM Human h
  EM -&gt; DB : SELECT … FROM Human
  EM -&gt; DB : SELECT … FROM HumanType WHERE typeid = 1
  EM -&gt; DB : SELECT … FROM HumanType WHERE typeid = 2
  EM -&gt; DB : SELECT … FROM HumanType WHERE typeid = 3
  note right : N = number of DIFFERENT types\\n(the same type object is reused);\\n100 types ⇒ 101 SELECTs
end
group JOIN FETCH: 1 SELECT
  S -&gt; EM : SELECT h FROM Human h JOIN FETCH h.type
  EM -&gt; DB : SELECT … FROM HumanType t0, Human t1\\nWHERE t0.typeid = t1.typeid
end
@enduml</code></pre></details>
<p><strong>2. "LAZY" trên @ManyToOne chỉ là gợi ý.</strong> Đặc tả nói vậy (§11.1.6), và EclipseLink cần <em>weaving</em> (sửa bytecode bằng một Java agent) mới làm theo được; Tomcat thường không có. Đo với <code>@ManyToOne(fetch = FetchType.LAZY)</code> — cảnh báo hiện ra ngay khi app chạm CSDL lần đầu, và các loại vẫn bị nạp ngay:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=lazy-many-to-one HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 123

Steve - student
Elon - teacher
Musk - worker
Melon - student
Kais - worker
An - student
Bình - teacher
Cường - student</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Warning]: metadata: Reverting the lazy setting on the OneToOne or ManyToOne attribute [type] for the entity class [class model.HumanLazy] since weaving was not enabled or did not occur.<br>
» query: SELECT h FROM HumanLazy h<br>
[EL Fine]: sql: SELECT humanid, humanname, typeid FROM Human ORDER BY humanid<br>
[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [2]<br>
[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [3]<br>
» query returned 8 rows; type NOT touched yet</div>
<p><strong>3. @OneToMany là LAZY.</strong> Danh sách người của một loại được nạp đúng lúc bạn chạm vào nó — xem các dòng <code>»</code>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=types HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 53

student: 4 people
teacher: 2 people
worker: 2 people</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT typeid, typename FROM HumanType ORDER BY typeid<br>
» type 1: calling t.getHumans().size()<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
» type 2: calling t.getHumans().size()<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [2]<br>
» type 3: calling t.getHumans().size()<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [3]</div>
<p>Lại là 1 + N. Fetch join trên collection sửa được, nhưng nó trả loại đó một lần <em>cho mỗi người</em> (8 kết quả cho 3 loại) — thêm <code>DISTINCT</code>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=types-fetch HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 106

without DISTINCT: 8 results
with DISTINCT: 3 results
student: 4 people
teacher: 2 people
worker: 2 people</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT t1.typeid, t1.typename, t0.humanid, t0.humandob, t0.humangender, t0.humanname, t0.typeid FROM HumanType t1 LEFT OUTER JOIN Human t0 ON (t0.typeid = t1.typeid) ORDER BY t1.typeid<br>
[EL Fine]: sql: SELECT DISTINCT t1.typeid, t1.typename, t0.humanid, t0.humandob, t0.humangender, t0.humanname, t0.typeid FROM HumanType t1 LEFT OUTER JOIN Human t0 ON (t0.typeid = t1.typeid) ORDER BY t1.typeid<br>
» both queries done; now calling t.getHumans().size()</div>
<p><strong>4. Sau <code>em.close()</code>.</strong> EclipseLink lặng lẽ mở một kết nối mới và vẫn nạp được danh sách LAZY. <strong>Hibernate — provider của Spring Boot — ném <code>LazyInitializationException</code> ở chỗ này</strong> (Hibernate User Guide, mục "Fetching"). Đừng bao giờ dựa vào nó; nạp sẵn thứ JSP cần trước khi đóng (JOIN FETCH).</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=after-close HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 39

em.isOpen() = false; teacher: 2 people</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [2]<br>
» em is closed; calling t.getHumans().size()<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [2]</div>
<p><strong>5. Owning side (phía sở hữu).</strong> Đặc tả §2.10: "phía sở hữu của quan hệ quyết định việc cập nhật quan hệ trong CSDL"; phía có <code>mappedBy</code> là phía nghịch (inverse side) và bị bỏ qua khi ghi. Chỉ thêm Lan vào <code>student.getHumans()</code> thì Lan được lưu với <code>typeid = NULL</code>; đặt <code>hoa.setType(student)</code> thì lưu <code>typeid = 1</code>:</p>
<p class="ghi-chu">📄 <code>jpa-quan-he/src/main/java/controller/RelServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "owning-wrong" -&gt; {                          // chỉ thêm vào phía NGHỊCH
    EntityTransaction tx = em.getTransaction();
    tx.begin();
    HumanType student = em.find(HumanType.class, 1);
    Human lan = new Human("Lan", LocalDate.of(2005, 3, 14), false);
    student.getHumans().add(lan);                 // danh sách biết Lan…
    em.persist(lan);                              // …nhưng lan.type vẫn null
    tx.commit();
    out.println(row(em, lan.getId()));
}
case "owning-right" -&gt; {                          // đặt phía SỞ HỮU (và giữ danh sách khớp)
    EntityTransaction tx = em.getTransaction();
    tx.begin();
    HumanType student = em.find(HumanType.class, 1);
    Human hoa = new Human("Hoa", LocalDate.of(2005, 6, 1), false);
    hoa.setType(student);                         // đây là thứ JPA ghi vào typeid
    student.getHumans().add(hoa);                 // chỉ cho các đối tượng trong bộ nhớ
    em.persist(hoa);
    tx.commit();
    out.println(row(em, hoa.getId()));
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=owning-wrong HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 58

row in table Human: humanid=9, humanname=Lan, typeid=null</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: INSERT INTO Human (humandob, humangender, humanname, typeid) VALUES (?, ?, ?, ?)<br>
	bind =&gt; [2005-03-14, false, Lan, null]<br>
[EL Fine]: sql: SELECT humanid, humanname, typeid FROM Human WHERE humanid = ?<br>
	bind =&gt; [9]</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=owning-right HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 56

row in table Human: humanid=10, humanname=Hoa, typeid=1</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: INSERT INTO Human (humandob, humangender, humanname, typeid) VALUES (?, ?, ?, ?)<br>
	bind =&gt; [2005-06-01, false, Hoa, 1]<br>
[EL Fine]: sql: SELECT humanid, humanname, typeid FROM Human WHERE humanid = ?<br>
	bind =&gt; [10]</div>
<div class="pitfall">Ba luật cần giữ: (1) trang danh sách có hiện một trường của bảng liên quan ⇒ <code>JOIN FETCH</code> nó (và <code>DISTINCT</code> với collection); (2) luôn đặt trường của phía <strong>sở hữu</strong> (phía có <code>@JoinColumn</code>), và cập nhật luôn danh sách nếu còn dùng nó trong bộ nhớ; (3) <code>mappedBy</code> ghi tên <em>trường Java</em> ở lớp bên kia (<code>"type"</code>), không bao giờ là tên cột. OneToOne, ManyToMany, cascade và kế thừa: ⭐ SWD392 CS.2.</div>`],
      [9, 'JPA - Architecture',
        `<p class="y-chinh">🎯 The architecture part has four topics: the class-level architecture, the relationships between JPA classes, a simple example, and how EntityManager, EntityManagerFactory and EntityTransaction are used together.</p>
<p>Before the details, the one question that matters in a web app — <em>how many of each object, and for how long?</em></p>
<table>
<thead><tr><th>Object</th><th>How many</th><th>Lives</th><th>Our code</th></tr></thead>
<tbody>
<tr><td><code>EntityManagerFactory</code></td><td><strong>one per application</strong> (per database)</td><td>from deploy to undeploy</td><td>built in <code>JpaUtil.contextInitialized()</code></td></tr>
<tr><td><code>EntityManager</code></td><td><strong>one per request</strong> (per DAO call)</td><td>a few milliseconds</td><td><code>JpaUtil.em()</code> … <code>em.close()</code></td></tr>
<tr><td><code>EntityTransaction</code></td><td>one per EntityManager</td><td>begin → commit / rollback</td><td><code>em.getTransaction()</code></td></tr>
<tr><td><code>Query</code></td><td>one per query</td><td>until <code>getResultList()</code></td><td><code>em.createQuery(…)</code></td></tr>
</tbody>
</table>
<p>Slides 10–12 draw the pieces, slide 13 shows an entity, slide 14 explains the factory, slide 17 runs all of them.</p>
<p class="meo">🧠 Factory = the restaurant kitchen (built once, expensive); EntityManager = one waiter's order pad for one table (cheap, thrown away after the meal); transaction = "send the order to the kitchen" — nothing is cooked until you commit.</p>`,
        `<p class="y-chinh">🎯 Phần kiến trúc gồm bốn chủ đề: kiến trúc ở mức lớp, quan hệ giữa các lớp JPA, một ví dụ đơn giản, và cách EntityManager, EntityManagerFactory, EntityTransaction được dùng cùng nhau.</p>
<p>Trước khi vào chi tiết, câu hỏi duy nhất quan trọng trong một app web — <em>mỗi loại đối tượng có bao nhiêu cái, sống bao lâu?</em></p>
<table>
<thead><tr><th>Đối tượng</th><th>Bao nhiêu</th><th>Sống</th><th>Code của ta</th></tr></thead>
<tbody>
<tr><td><code>EntityManagerFactory</code></td><td><strong>một cho cả ứng dụng</strong> (mỗi CSDL một cái)</td><td>từ lúc deploy tới lúc gỡ</td><td>dựng trong <code>JpaUtil.contextInitialized()</code></td></tr>
<tr><td><code>EntityManager</code></td><td><strong>mỗi request một cái</strong> (mỗi lần gọi DAO)</td><td>vài mili giây</td><td><code>JpaUtil.em()</code> … <code>em.close()</code></td></tr>
<tr><td><code>EntityTransaction</code></td><td>mỗi EntityManager một cái</td><td>begin → commit / rollback</td><td><code>em.getTransaction()</code></td></tr>
<tr><td><code>Query</code></td><td>mỗi truy vấn một cái</td><td>tới khi <code>getResultList()</code></td><td><code>em.createQuery(…)</code></td></tr>
</tbody>
</table>
<p>Slide 10–12 vẽ các mảnh, slide 13 cho xem một entity, slide 14 giải thích factory, slide 17 chạy tất cả.</p>
<p class="meo">🧠 Factory = căn bếp nhà hàng (dựng một lần, tốn kém); EntityManager = cuốn sổ ghi món của một bồi bàn cho một bàn (rẻ, ăn xong bỏ đi); giao dịch = "gửi món vào bếp" — chưa commit thì chưa có gì được nấu.</p>`],
      [10, 'JPA - Architecture — class level architecture',
        `<p class="y-chinh">🎯 The picture: inside the package <code>javax.persistence</code> sit EntityManagerFactory, EntityTransaction, EntityManager, Query and Persistence; next to it the "JPA API" talks to the entities, and the entities to the database.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/ec6aadf6b778bf6af2d5c6b37dcd3dd8a7ce4fc9.svg" alt="The JPA API is a set of interfaces (plus the Persistence class); the provider implements them and talks JDBC" loading="lazy" /><p class="chu-thich">🧩 The JPA API is a set of interfaces (plus the Persistence class); the provider implements them and talks JDBC</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
allowmixing
hide empty members
title Slide 10: the pieces of the JPA API (package jakarta.persistence — the slide says javax.persistence)
left to right direction
package "jakarta.persistence (the JPA API — interfaces you code against)" as API {
  class Persistence &lt;&lt;class&gt;&gt;
  interface EntityManagerFactory
  interface EntityManager
  interface EntityTransaction
  interface Query
}
component "persistence provider\\n(EclipseLink 4 here; Hibernate in Spring Boot)\\nimplements every interface" as PROV
class "Product, Human, …" as E &lt;&lt;@Entity&gt;&gt;
database "SQL Server" as DB
API ..&gt; PROV : implemented by
PROV --&gt; DB : JDBC (mssql-jdbc)
EntityManager ..&gt; E : persist / find / merge / remove
E ..&gt; DB : one object = one row
@enduml</code></pre></details>
<p>Three corrections to read the picture right:</p>
<ul>
<li>The package is <code>jakarta.persistence</code> on Tomcat 10+ (the picture is from the <code>javax</code> era). Mixing them fails at compile time: <code>javax.persistence.Entity</code> is simply not in the 3.1 jar.</li>
<li>The boxes are mostly <strong>interfaces</strong>; the objects you hold at run time are EclipseLink classes (e.g. <code>EntityManagerImpl</code>). You never write <code>new EntityManager()</code> — you ask the factory.</li>
<li>The picture hides the most important box: <strong>JDBC</strong>. The provider opens connections with the mssql-jdbc driver of Chapter 5 and sends ordinary SQL — that is why the driver jar is still in <code>WEB-INF/lib</code> and why the errors you see come from <code>SQLServerException</code>.</li>
</ul>`,
        `<p class="y-chinh">🎯 Hình: bên trong gói <code>javax.persistence</code> có EntityManagerFactory, EntityTransaction, EntityManager, Query và Persistence; bên cạnh, "JPA API" làm việc với các entity, và entity với CSDL.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/ec6aadf6b778bf6af2d5c6b37dcd3dd8a7ce4fc9.svg" alt="JPA API là một bộ interface (cộng lớp Persistence); provider cài đặt chúng và nói chuyện bằng JDBC" loading="lazy" /><p class="chu-thich">🧩 JPA API là một bộ interface (cộng lớp Persistence); provider cài đặt chúng và nói chuyện bằng JDBC</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
allowmixing
hide empty members
title Slide 10: the pieces of the JPA API (package jakarta.persistence — the slide says javax.persistence)
left to right direction
package "jakarta.persistence (the JPA API — interfaces you code against)" as API {
  class Persistence &lt;&lt;class&gt;&gt;
  interface EntityManagerFactory
  interface EntityManager
  interface EntityTransaction
  interface Query
}
component "persistence provider\\n(EclipseLink 4 here; Hibernate in Spring Boot)\\nimplements every interface" as PROV
class "Product, Human, …" as E &lt;&lt;@Entity&gt;&gt;
database "SQL Server" as DB
API ..&gt; PROV : implemented by
PROV --&gt; DB : JDBC (mssql-jdbc)
EntityManager ..&gt; E : persist / find / merge / remove
E ..&gt; DB : one object = one row
@enduml</code></pre></details>
<p>Ba chỗ cần đính chính để đọc hình cho đúng:</p>
<ul>
<li>Gói là <code>jakarta.persistence</code> trên Tomcat 10+ (hình từ thời <code>javax</code>). Trộn hai cái thì hỏng ngay lúc biên dịch: <code>javax.persistence.Entity</code> đơn giản là không có trong jar 3.1.</li>
<li>Phần lớn các hộp là <strong>interface</strong>; đối tượng bạn cầm lúc chạy là lớp của EclipseLink (vd <code>EntityManagerImpl</code>). Bạn không bao giờ viết <code>new EntityManager()</code> — bạn xin factory.</li>
<li>Hình giấu mất hộp quan trọng nhất: <strong>JDBC</strong>. Provider mở kết nối bằng chính driver mssql-jdbc của Chương 5 và gửi SQL bình thường — vì thế jar driver vẫn nằm trong <code>WEB-INF/lib</code>, và lỗi bạn thấy vẫn đến từ <code>SQLServerException</code>.</li>
</ul>`],
      [11, 'JPA - Architecture — the six components',
        `<p class="y-chinh">🎯 Six components: EntityManagerFactory (creates and manages EntityManagers), EntityManager (an interface managing persistence operations, a factory for Query), Entity (the persistent objects, stored as records), EntityTransaction (one-to-one with an EntityManager), Persistence (static methods to get an EntityManagerFactory), Query (implemented by each vendor to get the matching objects).</p>
<table>
<thead><tr><th>Component</th><th>Kind</th><th>What you call on it</th><th>Correction / ➕</th></tr></thead>
<tbody>
<tr><td><code>Persistence</code></td><td>class</td><td><code>createEntityManagerFactory("productPU", props)</code></td><td>the only real class; reads META-INF/persistence.xml</td></tr>
<tr><td><code>EntityManagerFactory</code></td><td>interface</td><td><code>createEntityManager()</code>, <code>close()</code></td><td>⚠️ the slide says "factory class": it is an interface; thread-safe (spec §7.3)</td></tr>
<tr><td><code>EntityManager</code></td><td>interface</td><td><code>persist</code>, <code>find</code>, <code>merge</code>, <code>remove</code>, <code>createQuery</code>, <code>getTransaction</code></td><td>NOT thread-safe (spec §7.2): never store one in a servlet field</td></tr>
<tr><td><code>EntityTransaction</code></td><td>interface</td><td><code>begin</code>, <code>commit</code>, <code>rollback</code>, <code>isActive</code></td><td>only for RESOURCE_LOCAL units (Tomcat)</td></tr>
<tr><td><code>Query</code> / <code>TypedQuery&lt;T&gt;</code></td><td>interface</td><td><code>setParameter</code>, <code>setFirstResult</code>, <code>setMaxResults</code>, <code>getResultList</code></td><td>➕ pass the class (<code>Product.class</code>) to get a typed list</td></tr>
<tr><td>entity</td><td>your class</td><td>—</td><td>➕ four states: new, managed, detached, removed</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/cd7f79484fd8706eb64015e565ffc1d1d6a4ecfa.svg" alt="The life of an entity object (spec §3.2): nothing reaches the database before commit" loading="lazy" /><p class="chu-thich">🧩 The life of an entity object (spec §3.2): nothing reaches the database before commit</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title The four states of an entity object (spec §3.2) — and when SQL is sent
[*] --&gt; New : new Product(...)
New --&gt; Managed : em.persist(p)
Managed --&gt; Managed : setName(...)\\n(change is tracked)
Managed --&gt; Removed : em.remove(p)
Managed --&gt; Detached : em.close() / em.clear()
Detached --&gt; Managed : em.merge(p)\\n(returns a managed copy)
Removed --&gt; [*] : tx.commit() ⇒ DELETE
New : not known by JPA\\nno id yet
Managed : known by the EntityManager\\ncommit ⇒ INSERT / UPDATE
Detached : has an id, but no\\nEntityManager watches it
Removed : DELETE waits for commit
note bottom of Managed
  em.find() and query results are Managed too.
  Nothing is written until tx.commit() (or em.flush()).
end note
@enduml</code></pre></details>
<div class="pitfall">"Managed" is the word to remember: an object you got from <code>find</code> or a query, while its EntityManager is open, is watched — change a field and commit, and JPA writes an UPDATE without any <code>update()</code> call (measured at slide 18). Close the EntityManager and the same object is "detached": changing it does nothing until you <code>merge</code> it.</div>`,
        `<p class="y-chinh">🎯 Sáu thành phần: EntityManagerFactory (tạo và quản lý các EntityManager), EntityManager (interface quản lý các thao tác lưu trữ, là "nhà máy" tạo Query), Entity (các đối tượng được lưu, thành bản ghi trong CSDL), EntityTransaction (quan hệ một-một với EntityManager), Persistence (phương thức static để lấy EntityManagerFactory), Query (mỗi nhà cung cấp cài đặt để lấy các đối tượng thoả điều kiện).</p>
<table>
<thead><tr><th>Thành phần</th><th>Loại</th><th>Bạn gọi gì trên nó</th><th>Đính chính / ➕</th></tr></thead>
<tbody>
<tr><td><code>Persistence</code></td><td>lớp</td><td><code>createEntityManagerFactory("productPU", props)</code></td><td>lớp thật duy nhất; đọc META-INF/persistence.xml</td></tr>
<tr><td><code>EntityManagerFactory</code></td><td>interface</td><td><code>createEntityManager()</code>, <code>close()</code></td><td>⚠️ slide ghi "factory class": nó là interface; an toàn đa luồng (đặc tả §7.3)</td></tr>
<tr><td><code>EntityManager</code></td><td>interface</td><td><code>persist</code>, <code>find</code>, <code>merge</code>, <code>remove</code>, <code>createQuery</code>, <code>getTransaction</code></td><td>KHÔNG an toàn đa luồng (đặc tả §7.2): không bao giờ giữ nó trong trường của servlet</td></tr>
<tr><td><code>EntityTransaction</code></td><td>interface</td><td><code>begin</code>, <code>commit</code>, <code>rollback</code>, <code>isActive</code></td><td>chỉ cho unit RESOURCE_LOCAL (Tomcat)</td></tr>
<tr><td><code>Query</code> / <code>TypedQuery&lt;T&gt;</code></td><td>interface</td><td><code>setParameter</code>, <code>setFirstResult</code>, <code>setMaxResults</code>, <code>getResultList</code></td><td>➕ truyền lớp (<code>Product.class</code>) để được danh sách có kiểu</td></tr>
<tr><td>entity</td><td>lớp của bạn</td><td>—</td><td>➕ bốn trạng thái: new, managed, detached, removed</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/cd7f79484fd8706eb64015e565ffc1d1d6a4ecfa.svg" alt="Vòng đời của một đối tượng entity (đặc tả §3.2): chưa commit thì chưa có gì xuống CSDL" loading="lazy" /><p class="chu-thich">🧩 Vòng đời của một đối tượng entity (đặc tả §3.2): chưa commit thì chưa có gì xuống CSDL</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title The four states of an entity object (spec §3.2) — and when SQL is sent
[*] --&gt; New : new Product(...)
New --&gt; Managed : em.persist(p)
Managed --&gt; Managed : setName(...)\\n(change is tracked)
Managed --&gt; Removed : em.remove(p)
Managed --&gt; Detached : em.close() / em.clear()
Detached --&gt; Managed : em.merge(p)\\n(returns a managed copy)
Removed --&gt; [*] : tx.commit() ⇒ DELETE
New : not known by JPA\\nno id yet
Managed : known by the EntityManager\\ncommit ⇒ INSERT / UPDATE
Detached : has an id, but no\\nEntityManager watches it
Removed : DELETE waits for commit
note bottom of Managed
  em.find() and query results are Managed too.
  Nothing is written until tx.commit() (or em.flush()).
end note
@enduml</code></pre></details>
<div class="pitfall">"Managed" (được quản lý) là từ cần nhớ: đối tượng lấy từ <code>find</code> hay từ một truy vấn, trong lúc EntityManager của nó còn mở, đều được theo dõi — đổi một trường rồi commit, JPA tự viết UPDATE mà không cần gọi <code>update()</code> nào (đo ở slide 18). Đóng EntityManager thì cùng đối tượng đó thành "detached" (tách rời): đổi nó chẳng có tác dụng gì cho tới khi bạn <code>merge</code>.</div>`],
      [12, 'JPA - Architecture — JPA class relationships',
        `<p class="y-chinh">🎯 The diagram: EntityManagerFactory 1 — * EntityManager; EntityManager 1 — 1 EntityTransaction; EntityManager 1 — * Query; EntityManager 1 — * Entity; Persistence stands alone (it only creates factories).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/e99c6b8553821bca1012dd0eea00899e15c494bd.svg" alt="The slide's diagram redrawn with the methods you actually call" loading="lazy" /><p class="chu-thich">🧩 The slide's diagram redrawn with the methods you actually call</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 12: how the JPA classes relate (multiplicities as on the slide)
class Persistence {
  + {static} createEntityManagerFactory(unitName) : EntityManagerFactory
}
interface EntityManagerFactory {
  + createEntityManager() : EntityManager
  + close()
}
interface EntityManager {
  + persist(entity) / find(cls, id)
  + merge(entity) / remove(entity)
  + createQuery(jpql) : Query
  + getTransaction() : EntityTransaction
  + close()
}
interface EntityTransaction {
  + begin() / commit() / rollback()
  + isActive() : boolean
}
interface Query {
  + setParameter(name, value)
  + getResultList() / getSingleResult()
}
class "Entity (your @Entity class)" as Entity
Persistence ..&gt; EntityManagerFactory : creates
EntityManagerFactory "1" -- "*" EntityManager : creates
EntityManager "1" -- "1" EntityTransaction : getTransaction()
EntityManager "1" -- "*" Query : createQuery()
EntityManager "1" -- "*" Entity : manages
note right of EntityManagerFactory
  ONE per application
  (expensive, thread-safe)
end note
note right of EntityManager
  one per request
  (cheap, NOT thread-safe)
end note
@enduml</code></pre></details>
<p>Read each multiplicity as a rule for your code:</p>
<ul>
<li><strong>1 factory — * managers</strong>: build the factory once, ask it for a new EntityManager in every request. Building a factory per request (as slide 17's <code>main()</code> does) re-reads the XML, re-validates every entity and opens a new connection pool each time.</li>
<li><strong>1 manager — 1 transaction</strong>: <code>em.getTransaction()</code> always returns the same object; one transaction at a time per EntityManager.</li>
<li><strong>1 manager — * entities</strong>: the EntityManager keeps a <em>persistence context</em> — a map from id to object. Asking twice for id 2 gives the <strong>same</strong> object (that is why the N+1 of slide 8 was 1 + 3, not 1 + 8).</li>
</ul>
<p class="meo">🧠 The diagram has no line from EntityManagerFactory to Entity: entities belong to a manager, not to the factory. The shared cache we measured at slide 5 is EclipseLink's extra layer on top.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ: EntityManagerFactory 1 — * EntityManager; EntityManager 1 — 1 EntityTransaction; EntityManager 1 — * Query; EntityManager 1 — * Entity; Persistence đứng riêng (nó chỉ tạo factory).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/e99c6b8553821bca1012dd0eea00899e15c494bd.svg" alt="Sơ đồ của slide vẽ lại kèm các phương thức bạn thật sự gọi" loading="lazy" /><p class="chu-thich">🧩 Sơ đồ của slide vẽ lại kèm các phương thức bạn thật sự gọi</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 12: how the JPA classes relate (multiplicities as on the slide)
class Persistence {
  + {static} createEntityManagerFactory(unitName) : EntityManagerFactory
}
interface EntityManagerFactory {
  + createEntityManager() : EntityManager
  + close()
}
interface EntityManager {
  + persist(entity) / find(cls, id)
  + merge(entity) / remove(entity)
  + createQuery(jpql) : Query
  + getTransaction() : EntityTransaction
  + close()
}
interface EntityTransaction {
  + begin() / commit() / rollback()
  + isActive() : boolean
}
interface Query {
  + setParameter(name, value)
  + getResultList() / getSingleResult()
}
class "Entity (your @Entity class)" as Entity
Persistence ..&gt; EntityManagerFactory : creates
EntityManagerFactory "1" -- "*" EntityManager : creates
EntityManager "1" -- "1" EntityTransaction : getTransaction()
EntityManager "1" -- "*" Query : createQuery()
EntityManager "1" -- "*" Entity : manages
note right of EntityManagerFactory
  ONE per application
  (expensive, thread-safe)
end note
note right of EntityManager
  one per request
  (cheap, NOT thread-safe)
end note
@enduml</code></pre></details>
<p>Đọc mỗi bội số như một luật cho code của bạn:</p>
<ul>
<li><strong>1 factory — * manager</strong>: dựng factory một lần, mỗi request xin nó một EntityManager mới. Dựng factory mỗi request (như <code>main()</code> của slide 17 làm) là đọc lại XML, kiểm lại mọi entity và mở một pool kết nối mới mỗi lần.</li>
<li><strong>1 manager — 1 transaction</strong>: <code>em.getTransaction()</code> luôn trả cùng một đối tượng; mỗi EntityManager một lúc chỉ có một giao dịch.</li>
<li><strong>1 manager — * entity</strong>: EntityManager giữ một <em>persistence context</em> — một bảng tra từ id sang đối tượng. Hỏi hai lần id 2 thì nhận <strong>cùng một</strong> đối tượng (vì thế N+1 ở slide 8 là 1 + 3, không phải 1 + 8).</li>
</ul>
<p class="meo">🧠 Sơ đồ không có đường nào từ EntityManagerFactory tới Entity: entity thuộc về một manager, không thuộc factory. Cache dùng chung đo ở slide 5 là lớp thêm của riêng EclipseLink ở bên trên.</p>`],
      [13, 'JPA Simple Example',
        `<p class="y-chinh">🎯 A screenshot from NetBeans: <code>public class Product implements Serializable</code> with <code>serialVersionUID = 1L</code>, <code>@Id</code> + <code>@GeneratedValue(strategy = GenerationType.IDENTITY)</code> + <code>@Basic(optional = false)</code> + <code>@Column(name = "id")</code> on <code>Integer id</code>, the same for <code>name</code> and <code>double price</code>, <code>description</code>, and three constructors.</p>
<p>Typed line by line, only <code>javax</code> → <code>jakarta</code> changed (this is the class slide 17 runs):</p>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/java/model/Product.java</code></p>
<pre class="web-src"><code class="language-java">package model;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.io.Serializable;

// Slide 13 typed line by line (lines 35–68 + the rest the slide hides); only javax.persistence → jakarta.persistence
@Entity
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @Column(name = "name")
    private String name;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Basic(optional = false)
    @Column(name = "price")
    private double price;
    @Column(name = "description")
    private String description;

    public Product() {
    }

    public Product(Integer id) {
        this.id = id;
    }

    public Product(Integer id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public String toString() {
        return "Product{" + "id=" + id + ", name=" + name + ", price=" + price + ", description=" + description + '}';
    }
}</code></pre>
<p>➕ <strong>This code was not typed by a human</strong> — it is the output of NetBeans' wizard <strong>New File → Persistence → Entity Classes from Database</strong>. The signs: <code>implements Serializable</code> with <code>serialVersionUID = 1L</code>, <code>@Basic(optional = false)</code> on every NOT NULL column, <code>@Column(name = …)</code> on every field, the constructor taking the id plus the NOT NULL columns, and the comment <code>// @Max(value=?) @Min(value=?)//if you know range of your decimal fields…</code> — that sentence is in NetBeans' own source code.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/2c9f5048ddd0b93aac7584601ce7f9d9d7e34892.svg" alt="The wizard step by step (labels from NetBeans 17) and the two kinds of file it writes" loading="lazy" /><p class="chu-thich">🧩 The wizard step by step (labels from NetBeans 17) and the two kinds of file it writes</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title NetBeans "Entity Classes from Database": what you click, what it writes
start
:File → New File → category **Persistence**
→ **Entity Classes from Database**;
:Database Connection: pick the SQL Server
connection (Services → Databases);
:Available Tables → Add the tables
(**Include Related Tables** adds the FK targets);
:Package (e.g. model); tick
Generate Named Query Annotations;
:Mapping Options: Association Fetch
(default / eager / lazy), Collection Type;
if (project already has persistence.xml?) then (no)
  :tick **Create Persistence Unit**;
else (yes)
endif
:Finish;
:**one @Entity class per table**
(@Table, @NamedQueries, @Id, @Basic, @Column,
@ManyToOne / @OneToMany(mappedBy), constructors,
getters/setters, equals, hashCode, toString);
:**META-INF/persistence.xml**
(new or updated: one &lt;class&gt; line per entity);
stop
@enduml</code></pre></details>
<table>
<thead><tr><th>What NetBeans 17 writes</th><th>Example</th><th>What to do with it</th></tr></thead>
<tbody>
<tr><td><code>import javax.persistence.*</code></td><td>the generator hard-codes <code>javax</code></td><td>Tomcat 10+: replace with <code>jakarta.persistence</code> (Find/Replace in the package)</td></tr>
<tr><td><code>@Table</code>, <code>@NamedQueries</code></td><td><code>"Product.findAll"</code>, <code>"Product.findByName"</code> = <code>SELECT p FROM Product p WHERE p.name = :name</code></td><td>keep; call with <code>em.createNamedQuery("Product.findAll", Product.class)</code></td></tr>
<tr><td><code>@Basic(optional = false)</code>, <code>@Column</code></td><td>one per column</td><td>keep</td></tr>
<tr><td>the type of a <code>decimal</code> column</td><td>the slide shows <code>double</code></td><td>⚠️ use <code>BigDecimal</code> for money (see below)</td></tr>
<tr><td>relationships</td><td><code>@ManyToOne</code> + <code>@JoinColumn(referencedColumnName = …)</code>, <code>@OneToMany(mappedBy = …)</code></td><td>check the fetch type (wizard option "Association Fetch")</td></tr>
<tr><td><code>equals</code>, <code>hashCode</code>, <code>toString</code></td><td><code>toString()</code> returns <code>"model.Product[ id=5 ]"</code>; <code>equals</code> starts with "TODO: Warning - this method won't work in the case the id fields are not set"</td><td>fine for reading; replace toString if you print objects</td></tr>
<tr><td><code>META-INF/persistence.xml</code></td><td>created if you tick <strong>Create Persistence Unit</strong>, otherwise one <code>&lt;class&gt;</code> line added</td><td>check provider, URL, password (slide 15)</td></tr>
</tbody>
</table>
<div class="pitfall">Slide 13's <code>private double price</code> maps a <code>decimal(10,2)</code> column (slide 16). <code>double</code> is binary floating point: 0.1 + 0.2 is 0.30000000000000004, and big prices lose cents. JDBC returns <code>DECIMAL</code> as <code>java.math.BigDecimal</code> (<code>getBigDecimal</code>, Chapter 5) — map it to <code>BigDecimal</code>, as our <code>jpa-san-pham</code> does.</div>`,
        `<p class="y-chinh">🎯 Một ảnh chụp từ NetBeans: <code>public class Product implements Serializable</code> có <code>serialVersionUID = 1L</code>, <code>@Id</code> + <code>@GeneratedValue(strategy = GenerationType.IDENTITY)</code> + <code>@Basic(optional = false)</code> + <code>@Column(name = "id")</code> trên <code>Integer id</code>, tương tự cho <code>name</code> và <code>double price</code>, <code>description</code>, và ba constructor.</p>
<p>Gõ lại từng dòng, chỉ đổi <code>javax</code> → <code>jakarta</code> (đây là lớp mà slide 17 chạy):</p>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/java/model/Product.java</code></p>
<pre class="web-src"><code class="language-java">package model;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.io.Serializable;

// Slide 13 gõ lại từng dòng (dòng 35–68 + phần slide che); chỉ đổi javax.persistence → jakarta.persistence
@Entity
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @Column(name = "name")
    private String name;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Basic(optional = false)
    @Column(name = "price")
    private double price;
    @Column(name = "description")
    private String description;

    public Product() {
    }

    public Product(Integer id) {
        this.id = id;
    }

    public Product(Integer id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public String toString() {
        return "Product{" + "id=" + id + ", name=" + name + ", price=" + price + ", description=" + description + '}';
    }
}</code></pre>
<p>➕ <strong>Đoạn code này không do người gõ</strong> — nó là kết quả của trình hướng dẫn NetBeans <strong>New File → Persistence → Entity Classes from Database</strong> (sinh lớp entity từ CSDL). Dấu hiệu: <code>implements Serializable</code> kèm <code>serialVersionUID = 1L</code>, <code>@Basic(optional = false)</code> trên mọi cột NOT NULL, <code>@Column(name = …)</code> trên mọi trường, constructor nhận id cộng các cột NOT NULL, và chú thích <code>// @Max(value=?) @Min(value=?)//if you know range of your decimal fields…</code> — câu đó nằm ngay trong mã nguồn của NetBeans.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/2c9f5048ddd0b93aac7584601ce7f9d9d7e34892.svg" alt="Trình hướng dẫn từng bước (nhãn theo NetBeans 17) và hai loại file nó viết ra" loading="lazy" /><p class="chu-thich">🧩 Trình hướng dẫn từng bước (nhãn theo NetBeans 17) và hai loại file nó viết ra</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title NetBeans "Entity Classes from Database": what you click, what it writes
start
:File → New File → category **Persistence**
→ **Entity Classes from Database**;
:Database Connection: pick the SQL Server
connection (Services → Databases);
:Available Tables → Add the tables
(**Include Related Tables** adds the FK targets);
:Package (e.g. model); tick
Generate Named Query Annotations;
:Mapping Options: Association Fetch
(default / eager / lazy), Collection Type;
if (project already has persistence.xml?) then (no)
  :tick **Create Persistence Unit**;
else (yes)
endif
:Finish;
:**one @Entity class per table**
(@Table, @NamedQueries, @Id, @Basic, @Column,
@ManyToOne / @OneToMany(mappedBy), constructors,
getters/setters, equals, hashCode, toString);
:**META-INF/persistence.xml**
(new or updated: one &lt;class&gt; line per entity);
stop
@enduml</code></pre></details>
<table>
<thead><tr><th>NetBeans 17 viết gì</th><th>Ví dụ</th><th>Làm gì với nó</th></tr></thead>
<tbody>
<tr><td><code>import javax.persistence.*</code></td><td>bộ sinh viết cứng <code>javax</code></td><td>Tomcat 10+: thay bằng <code>jakarta.persistence</code> (Find/Replace cả gói)</td></tr>
<tr><td><code>@Table</code>, <code>@NamedQueries</code></td><td><code>"Product.findAll"</code>, <code>"Product.findByName"</code> = <code>SELECT p FROM Product p WHERE p.name = :name</code></td><td>giữ; gọi bằng <code>em.createNamedQuery("Product.findAll", Product.class)</code></td></tr>
<tr><td><code>@Basic(optional = false)</code>, <code>@Column</code></td><td>mỗi cột một cái</td><td>giữ</td></tr>
<tr><td>kiểu của cột <code>decimal</code></td><td>slide là <code>double</code></td><td>⚠️ dùng <code>BigDecimal</code> cho tiền (xem dưới)</td></tr>
<tr><td>quan hệ</td><td><code>@ManyToOne</code> + <code>@JoinColumn(referencedColumnName = …)</code>, <code>@OneToMany(mappedBy = …)</code></td><td>kiểm kiểu fetch (tuỳ chọn "Association Fetch" của trình hướng dẫn)</td></tr>
<tr><td><code>equals</code>, <code>hashCode</code>, <code>toString</code></td><td><code>toString()</code> trả <code>"model.Product[ id=5 ]"</code>; <code>equals</code> mở đầu bằng "TODO: Warning - this method won't work in the case the id fields are not set"</td><td>đọc thì được; thay toString nếu bạn in đối tượng</td></tr>
<tr><td><code>META-INF/persistence.xml</code></td><td>tạo mới nếu tích <strong>Create Persistence Unit</strong>, không thì thêm một dòng <code>&lt;class&gt;</code></td><td>kiểm provider, URL, mật khẩu (slide 15)</td></tr>
</tbody>
</table>
<div class="pitfall"><code>private double price</code> của slide 13 ánh xạ cột <code>decimal(10,2)</code> (slide 16). <code>double</code> là số thực nhị phân: 0.1 + 0.2 ra 0.30000000000000004, và giá lớn sẽ mất số lẻ. JDBC trả <code>DECIMAL</code> dưới dạng <code>java.math.BigDecimal</code> (<code>getBigDecimal</code>, Chương 5) — hãy ánh xạ thành <code>BigDecimal</code>, như <code>jpa-san-pham</code> của ta.</div>`],
      [14, 'JPA - Obtaining a JPA Database Connection',
        `<p class="y-chinh">🎯 An EntityManager represents a database connection and enables database operations — in a web app each HTTP request typically uses its own; the EntityManagerFactory efficiently creates many EntityManagers for one database; modifications need an active EntityTransaction; and the EntityManager is also the factory of Query objects.</p>
<p>"Represents a connection" is a simplification: an EntityManager borrows a JDBC connection from the factory's pool <em>when it needs one</em> and holds your persistence context. The useful part is the rule <strong>one factory per app, one EntityManager per request</strong>. In Tomcat the natural place to build the factory is a <code>ServletContextListener</code> (Chapter 8), the JPA twin of <code>DBContext</code> from lesson 5.B:</p>
<p class="ghi-chu">📄 <code>jpa-san-pham/src/main/java/dal/JpaUtil.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void contextInitialized(ServletContextEvent sce) {          // app deployed ⇒ build the factory once
    emf = Persistence.createEntityManagerFactory("productPU", dbFromEnv());
    System.out.println("JpaUtil: EntityManagerFactory created (once per application)");
}

public static EntityManager em() {                                  // cheap; call it per request, close it after
    return emf.createEntityManager();
}

@Override
public void contextDestroyed(ServletContextEvent sce) {            // app undeployed ⇒ close the pool
    if (emf != null) emf.close();
    System.out.println("JpaUtil: EntityManagerFactory closed");
}</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/4180751e4ce5dc7b42455d841f1cba5d0475cf5f.svg" alt="Deploy: one factory. Every request: a new EntityManager, a transaction, close." loading="lazy" /><p class="chu-thich">🧩 Deploy: one factory. Every request: a new EntityManager, a transaction, close.</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 14 + 18: one factory for the app, one EntityManager per request (POST "add a product")
participant "Tomcat" as T
participant "JpaUtil\\n(@WebListener)" as L
participant "ProductServlet" as S
participant "ProductDAO" as D
participant "EntityManager" as EM
database "SQL Server" as DB
== deploy (once) ==
T -&gt; L : contextInitialized()
L -&gt; L : Persistence.createEntityManagerFactory("productPU")
== every request ==
T -&gt; S : doPost(action=add)
S -&gt; D : insert(p)
D -&gt; L : em()
L --&gt; D : new EntityManager
D -&gt; EM : getTransaction().begin()
D -&gt; EM : persist(p)
D -&gt; EM : commit()
EM -&gt; DB : INSERT INTO Product …
DB --&gt; EM : new IDENTITY id = 6
D -&gt; EM : close()
S --&gt; T : 302 Location: products?done=added&amp;newId=6
== undeploy ==
T -&gt; L : contextDestroyed() ⇒ emf.close()
@enduml</code></pre></details>
<p>The log of the very first request shows the factory line once; no later request prints it again — and the undeploy at the end closes it:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-san-pham/products HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Products&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Products&lt;/h1&gt;
&lt;form action="products" method="get"&gt;&lt;input name="q" value=""&gt; &lt;button&gt;Search&lt;/button&gt;&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Id&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Description&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Panasonic rice cooker&lt;/td&gt;&lt;td&gt;1290000.00&lt;/td&gt;&lt;td&gt;1.8 L, 10 menus&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=1"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Sharp microwave&lt;/td&gt;&lt;td&gt;2150000.00&lt;/td&gt;&lt;td&gt;-&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=2"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Philips kettle&lt;/td&gt;&lt;td&gt;459000.00&lt;/td&gt;&lt;td&gt;1.7 L, stainless steel&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=3"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 1/2&lt;/p&gt;&lt;h2&gt;Add a product&lt;/h2&gt;
&lt;form action="products" method="post"&gt;
  &lt;input type="hidden" name="action" value="add"&gt;
  
  Name &lt;input name="name" value=""&gt; &lt;br&gt;
  Price &lt;input name="price" value=""&gt; &lt;br&gt;
  Description &lt;input name="description" value=""&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">JpaUtil: EntityManagerFactory created (once per application)<br>
[EL Fine]: sql: SELECT id, description, name, price FROM Product ORDER BY id OFFSET ? ROWS FETCH NEXT ? ROWS ONLY<br>
	bind =&gt; [0, 3]<br>
[EL Fine]: sql: SELECT COUNT(id) FROM Product</div>
<p class="ghi-chu">🛑 Undeploy the application (delete the WAR) — the Tomcat console prints:</p>
<div class="out log">JpaUtil: EntityManagerFactory closed</div>
<div class="pitfall">Two classic bugs: an <code>EntityManager</code> stored in a servlet <strong>field</strong> (one servlet object serves all users at once — spec §7.2: "an entity manager must not be shared among multiple concurrently executing threads"), and an EntityManager never closed (its connection never goes back to the pool — the same leak as an unclosed <code>Connection</code> in Chapter 5).</div>`,
        `<p class="y-chinh">🎯 Một EntityManager đại diện cho một kết nối CSDL và cho phép thao tác với CSDL — trong app web mỗi HTTP request thường dùng một cái riêng; EntityManagerFactory tạo hiệu quả nhiều EntityManager cho một CSDL; thay đổi dữ liệu cần một EntityTransaction đang hoạt động; và EntityManager còn là "nhà máy" tạo đối tượng Query.</p>
<p>"Đại diện cho một kết nối" là cách nói đơn giản hoá: EntityManager mượn một kết nối JDBC từ pool của factory <em>khi nó cần</em>, và giữ persistence context của bạn. Phần hữu ích là luật <strong>một factory cho cả app, mỗi request một EntityManager</strong>. Trong Tomcat chỗ tự nhiên để dựng factory là một <code>ServletContextListener</code> (Chương 8) — "anh em" JPA của <code>DBContext</code> bài 5.B:</p>
<p class="ghi-chu">📄 <code>jpa-san-pham/src/main/java/dal/JpaUtil.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void contextInitialized(ServletContextEvent sce) {          // app vừa deploy ⇒ dựng factory một lần
    emf = Persistence.createEntityManagerFactory("productPU", dbFromEnv());
    System.out.println("JpaUtil: EntityManagerFactory created (once per application)");
}

public static EntityManager em() {                                  // rẻ; gọi mỗi request, dùng xong đóng
    return emf.createEntityManager();
}

@Override
public void contextDestroyed(ServletContextEvent sce) {            // gỡ app ⇒ đóng pool kết nối
    if (emf != null) emf.close();
    System.out.println("JpaUtil: EntityManagerFactory closed");
}</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/4180751e4ce5dc7b42455d841f1cba5d0475cf5f.svg" alt="Deploy: một factory. Mỗi request: một EntityManager mới, một giao dịch, đóng." loading="lazy" /><p class="chu-thich">🧩 Deploy: một factory. Mỗi request: một EntityManager mới, một giao dịch, đóng.</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 14 + 18: one factory for the app, one EntityManager per request (POST "add a product")
participant "Tomcat" as T
participant "JpaUtil\\n(@WebListener)" as L
participant "ProductServlet" as S
participant "ProductDAO" as D
participant "EntityManager" as EM
database "SQL Server" as DB
== deploy (once) ==
T -&gt; L : contextInitialized()
L -&gt; L : Persistence.createEntityManagerFactory("productPU")
== every request ==
T -&gt; S : doPost(action=add)
S -&gt; D : insert(p)
D -&gt; L : em()
L --&gt; D : new EntityManager
D -&gt; EM : getTransaction().begin()
D -&gt; EM : persist(p)
D -&gt; EM : commit()
EM -&gt; DB : INSERT INTO Product …
DB --&gt; EM : new IDENTITY id = 6
D -&gt; EM : close()
S --&gt; T : 302 Location: products?done=added&amp;newId=6
== undeploy ==
T -&gt; L : contextDestroyed() ⇒ emf.close()
@enduml</code></pre></details>
<p>Log của request đầu tiên in dòng về factory đúng một lần; không request nào sau đó in lại — và lúc gỡ app thì nó được đóng:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-san-pham/products HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Products&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Products&lt;/h1&gt;
&lt;form action="products" method="get"&gt;&lt;input name="q" value=""&gt; &lt;button&gt;Search&lt;/button&gt;&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Id&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Description&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Panasonic rice cooker&lt;/td&gt;&lt;td&gt;1290000.00&lt;/td&gt;&lt;td&gt;1.8 L, 10 menus&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=1"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Sharp microwave&lt;/td&gt;&lt;td&gt;2150000.00&lt;/td&gt;&lt;td&gt;-&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=2"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Philips kettle&lt;/td&gt;&lt;td&gt;459000.00&lt;/td&gt;&lt;td&gt;1.7 L, stainless steel&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=3"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 1/2&lt;/p&gt;&lt;h2&gt;Add a product&lt;/h2&gt;
&lt;form action="products" method="post"&gt;
  &lt;input type="hidden" name="action" value="add"&gt;
  
  Name &lt;input name="name" value=""&gt; &lt;br&gt;
  Price &lt;input name="price" value=""&gt; &lt;br&gt;
  Description &lt;input name="description" value=""&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">JpaUtil: EntityManagerFactory created (once per application)<br>
[EL Fine]: sql: SELECT id, description, name, price FROM Product ORDER BY id OFFSET ? ROWS FETCH NEXT ? ROWS ONLY<br>
	bind =&gt; [0, 3]<br>
[EL Fine]: sql: SELECT COUNT(id) FROM Product</div>
<p class="ghi-chu">🛑 Gỡ ứng dụng khỏi Tomcat (xoá file WAR) — console của Tomcat in ra:</p>
<div class="out log">JpaUtil: EntityManagerFactory closed</div>
<div class="pitfall">Hai lỗi kinh điển: giữ <code>EntityManager</code> trong một <strong>trường</strong> của servlet (một đối tượng servlet phục vụ mọi người dùng cùng lúc — đặc tả §7.2: "một entity manager không được dùng chung giữa nhiều luồng chạy đồng thời"), và EntityManager không bao giờ được đóng (kết nối của nó không trả về pool — đúng kiểu rò rỉ như <code>Connection</code> không đóng ở Chương 5).</div>`],
      [15, 'Definition of a persistence unit in an XML file',
        `<p class="y-chinh">🎯 The file <code>persistence.xml</code> (version 2.2, namespace <code>http://xmlns.jcp.org/xml/ns/persistence</code>) declares a persistence unit <code>sp25_test4JPAPU</code> with <code>transaction-type="RESOURCE_LOCAL"</code>, provider EclipseLink, classes <code>CustomerType</code> and <code>Product</code>, and the <code>javax.persistence.jdbc.*</code> url, user, driver, password, plus <code>eclipselink.logging.level = OFF</code>.</p>
<p>The same file for Tomcat 10.1 + JPA 3.1 (the one <code>jpa-slide17</code> runs):</p>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/resources/META-INF/persistence.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;!-- Slide 15 converted line by line: version 2.2 → 3.0 schema, javax.persistence.* → jakarta.persistence.* --&gt;
&lt;persistence version="3.0" xmlns="https://jakarta.ee/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence https://jakarta.ee/xml/ns/persistence/persistence_3_0.xsd"&gt;
  &lt;persistence-unit name="sp25_test4JPAPU" transaction-type="RESOURCE_LOCAL"&gt;
    &lt;provider&gt;org.eclipse.persistence.jpa.PersistenceProvider&lt;/provider&gt;
    &lt;class&gt;model.Product&lt;/class&gt;
    &lt;exclude-unlisted-classes&gt;true&lt;/exclude-unlisted-classes&gt;
    &lt;properties&gt;
      &lt;property name="jakarta.persistence.jdbc.url"
                value="jdbc:sqlserver://localhost:1433;databaseName=PRJ301_JpaSlide17;encrypt=true;trustServerCertificate=true;"/&gt;
      &lt;property name="jakarta.persistence.jdbc.user" value="sa"/&gt;
      &lt;property name="jakarta.persistence.jdbc.driver" value="com.microsoft.sqlserver.jdbc.SQLServerDriver"/&gt;
      &lt;property name="jakarta.persistence.jdbc.password" value="123456"/&gt;
      &lt;!-- the slide has OFF: then nothing is logged, not even SQL or errors; WARNING + sql FINE shows them --&gt;
      &lt;property name="eclipselink.logging.level" value="WARNING"/&gt;
      &lt;property name="eclipselink.logging.level.sql" value="FINE"/&gt;
      &lt;property name="eclipselink.logging.parameters" value="true"/&gt;
      &lt;property name="eclipselink.logging.timestamp" value="false"/&gt;
      &lt;property name="eclipselink.logging.thread" value="false"/&gt;
      &lt;property name="eclipselink.logging.session" value="false"/&gt;
      &lt;property name="eclipselink.logging.connection" value="false"/&gt;
    &lt;/properties&gt;
  &lt;/persistence-unit&gt;
&lt;/persistence&gt;</code></pre>
<table>
<thead><tr><th>Slide line</th><th>Problem</th><th>Fix</th></tr></thead>
<tbody>
<tr><td><code>version="2.2"</code>, <code>xmlns.jcp.org</code></td><td>the Java EE 8 schema</td><td><code>version="3.0"</code>, <code>https://jakarta.ee/xml/ns/persistence</code> (JPA 3.1 still uses the 3.0 schema)</td></tr>
<tr><td><code>javax.persistence.jdbc.url</code> …</td><td>old property names</td><td><code>jakarta.persistence.jdbc.url</code>, <code>.user</code>, <code>.password</code>, <code>.driver</code></td></tr>
<tr><td><code>localhost\\TRANNGPTM:1433</code></td><td>an instance name AND a port</td><td>Microsoft's driver docs: when both are given "the portNumber takes precedence and the instanceName is ignored" — write one</td></tr>
<tr><td><code>exclude-unlisted-classes false</code></td><td>"scan for entities"</td><td>the spec (§8.2.1.6) asks Java SE / Tomcat apps to <strong>list every class</strong>; we write <code>true</code> + the list</td></tr>
<tr><td><code>password = 123456</code></td><td>a secret in a file you commit</td><td>read it from an environment variable (our <code>JpaUtil</code>, Spring Boot's <code>application.properties</code> + env)</td></tr>
<tr><td><code>eclipselink.logging.level = OFF</code></td><td>you see nothing — not even errors</td><td>measured below: during development use <code>WARNING</code> + <code>eclipselink.logging.level.sql = FINE</code></td></tr>
</tbody>
</table>
<p><strong>RESOURCE_LOCAL</strong> = you control transactions yourself with <code>EntityTransaction</code>; the other type, <code>JTA</code>, is for full Jakarta EE servers (GlassFish, WildFly) where the server manages them — Tomcat is not one. <strong>Where does the file go?</strong> It must end up at <code>WEB-INF/classes/META-INF/persistence.xml</code> inside the WAR. In a Maven project that is <code>src/main/resources/META-INF/</code>; NetBeans shows it under "Configuration Files". The real WAR:</p>
<p class="ghi-chu">📦 Inside the <code>jpa-san-pham.war</code> the generator built and deployed (<code>jar tf</code>, sorted)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/META-INF/<br>
WEB-INF/classes/META-INF/persistence.xml<br>
WEB-INF/classes/controller/<br>
WEB-INF/classes/controller/ProductServlet.class<br>
WEB-INF/classes/dal/<br>
WEB-INF/classes/dal/JpaUtil.class<br>
WEB-INF/classes/dal/ProductDAO.class<br>
WEB-INF/classes/model/<br>
WEB-INF/classes/model/Product.class<br>
WEB-INF/classes/service/<br>
WEB-INF/classes/service/ProductService.class<br>
WEB-INF/lib/<br>
WEB-INF/lib/eclipselink-4.0.9.jar<br>
WEB-INF/lib/jakarta.persistence-api-3.1.0.jar<br>
WEB-INF/lib/jakarta.servlet.jsp.jstl-3.0.1.jar<br>
WEB-INF/lib/jakarta.servlet.jsp.jstl-api-3.0.0.jar<br>
WEB-INF/lib/mssql-jdbc-12.8.1.jre11.jar<br>
WEB-INF/views/<br>
WEB-INF/views/error.jsp<br>
WEB-INF/views/product-list.jsp<br>
WEB-INF/web.xml</div>`,
        `<p class="y-chinh">🎯 File <code>persistence.xml</code> (version 2.2, namespace <code>http://xmlns.jcp.org/xml/ns/persistence</code>) khai một persistence unit <code>sp25_test4JPAPU</code> với <code>transaction-type="RESOURCE_LOCAL"</code>, provider EclipseLink, các lớp <code>CustomerType</code> và <code>Product</code>, và url, user, driver, password dạng <code>javax.persistence.jdbc.*</code>, cộng <code>eclipselink.logging.level = OFF</code>.</p>
<p>Cùng file đó viết cho Tomcat 10.1 + JPA 3.1 (file mà <code>jpa-slide17</code> chạy):</p>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/resources/META-INF/persistence.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;!-- Slide 15 đổi từng dòng: version 2.2 → lược đồ 3.0, javax.persistence.* → jakarta.persistence.* --&gt;
&lt;persistence version="3.0" xmlns="https://jakarta.ee/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence https://jakarta.ee/xml/ns/persistence/persistence_3_0.xsd"&gt;
  &lt;persistence-unit name="sp25_test4JPAPU" transaction-type="RESOURCE_LOCAL"&gt;
    &lt;provider&gt;org.eclipse.persistence.jpa.PersistenceProvider&lt;/provider&gt;
    &lt;class&gt;model.Product&lt;/class&gt;
    &lt;exclude-unlisted-classes&gt;true&lt;/exclude-unlisted-classes&gt;
    &lt;properties&gt;
      &lt;property name="jakarta.persistence.jdbc.url"
                value="jdbc:sqlserver://localhost:1433;databaseName=PRJ301_JpaSlide17;encrypt=true;trustServerCertificate=true;"/&gt;
      &lt;property name="jakarta.persistence.jdbc.user" value="sa"/&gt;
      &lt;property name="jakarta.persistence.jdbc.driver" value="com.microsoft.sqlserver.jdbc.SQLServerDriver"/&gt;
      &lt;property name="jakarta.persistence.jdbc.password" value="123456"/&gt;
      &lt;!-- slide để OFF: khi đó không log gì, kể cả SQL hay lỗi; WARNING + sql FINE thì hiện --&gt;
      &lt;property name="eclipselink.logging.level" value="WARNING"/&gt;
      &lt;property name="eclipselink.logging.level.sql" value="FINE"/&gt;
      &lt;property name="eclipselink.logging.parameters" value="true"/&gt;
      &lt;property name="eclipselink.logging.timestamp" value="false"/&gt;
      &lt;property name="eclipselink.logging.thread" value="false"/&gt;
      &lt;property name="eclipselink.logging.session" value="false"/&gt;
      &lt;property name="eclipselink.logging.connection" value="false"/&gt;
    &lt;/properties&gt;
  &lt;/persistence-unit&gt;
&lt;/persistence&gt;</code></pre>
<table>
<thead><tr><th>Dòng trên slide</th><th>Vấn đề</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td><code>version="2.2"</code>, <code>xmlns.jcp.org</code></td><td>lược đồ của Java EE 8</td><td><code>version="3.0"</code>, <code>https://jakarta.ee/xml/ns/persistence</code> (JPA 3.1 vẫn dùng lược đồ 3.0)</td></tr>
<tr><td><code>javax.persistence.jdbc.url</code> …</td><td>tên thuộc tính cũ</td><td><code>jakarta.persistence.jdbc.url</code>, <code>.user</code>, <code>.password</code>, <code>.driver</code></td></tr>
<tr><td><code>localhost\\TRANNGPTM:1433</code></td><td>vừa tên instance VỪA cổng</td><td>tài liệu driver của Microsoft: có cả hai thì "portNumber được ưu tiên và instanceName bị bỏ qua" — chỉ ghi một thứ</td></tr>
<tr><td><code>exclude-unlisted-classes false</code></td><td>"tự quét tìm entity"</td><td>đặc tả (§8.2.1.6) yêu cầu app Java SE / Tomcat <strong>liệt kê mọi lớp</strong>; ta ghi <code>true</code> + danh sách</td></tr>
<tr><td><code>password = 123456</code></td><td>bí mật nằm trong file bạn commit</td><td>đọc từ biến môi trường (như <code>JpaUtil</code> của ta, như <code>application.properties</code> + env của Spring Boot)</td></tr>
<tr><td><code>eclipselink.logging.level = OFF</code></td><td>bạn không thấy gì — kể cả lỗi</td><td>đo ở dưới: khi phát triển dùng <code>WARNING</code> + <code>eclipselink.logging.level.sql = FINE</code></td></tr>
</tbody>
</table>
<p><strong>RESOURCE_LOCAL</strong> = bạn tự điều khiển giao dịch bằng <code>EntityTransaction</code>; kiểu còn lại, <code>JTA</code>, dành cho server Jakarta EE đầy đủ (GlassFish, WildFly) nơi server quản lý giao dịch — Tomcat không phải loại đó. <strong>File đặt ở đâu?</strong> Trong WAR nó phải nằm ở <code>WEB-INF/classes/META-INF/persistence.xml</code>. Với project Maven đó là <code>src/main/resources/META-INF/</code>; NetBeans hiện nó trong mục "Configuration Files". WAR thật:</p>
<p class="ghi-chu">📦 Bên trong <code>jpa-san-pham.war</code> mà generator đã đóng và deploy (<code>jar tf</code>, sắp xếp)</p>
<div class="out log">META-INF/<br>
META-INF/MANIFEST.MF<br>
WEB-INF/<br>
WEB-INF/classes/<br>
WEB-INF/classes/META-INF/<br>
WEB-INF/classes/META-INF/persistence.xml<br>
WEB-INF/classes/controller/<br>
WEB-INF/classes/controller/ProductServlet.class<br>
WEB-INF/classes/dal/<br>
WEB-INF/classes/dal/JpaUtil.class<br>
WEB-INF/classes/dal/ProductDAO.class<br>
WEB-INF/classes/model/<br>
WEB-INF/classes/model/Product.class<br>
WEB-INF/classes/service/<br>
WEB-INF/classes/service/ProductService.class<br>
WEB-INF/lib/<br>
WEB-INF/lib/eclipselink-4.0.9.jar<br>
WEB-INF/lib/jakarta.persistence-api-3.1.0.jar<br>
WEB-INF/lib/jakarta.servlet.jsp.jstl-3.0.1.jar<br>
WEB-INF/lib/jakarta.servlet.jsp.jstl-api-3.0.0.jar<br>
WEB-INF/lib/mssql-jdbc-12.8.1.jre11.jar<br>
WEB-INF/views/<br>
WEB-INF/views/error.jsp<br>
WEB-INF/views/product-list.jsp<br>
WEB-INF/web.xml</div>`],
      [16, 'Definition of a persistence unit in an XML file — the Product table',
        `<p class="y-chinh">🎯 "Suppose TestDB_JPA has Product table as follows": <code>CREATE TABLE [dbo].[Product]</code> with <code>id int IDENTITY(1,1) PRIMARY KEY NOT NULL</code>, <code>name nvarchar(255) NOT NULL</code>, <code>price decimal(10,2) NOT NULL</code>, <code>description nvarchar(500) NULL</code>.</p>
<p class="ghi-chu">📄 <code>jpa-san-pham/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE [dbo].[Product](
    [id]          [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
    [name]        [nvarchar](255) NOT NULL,
    [price]       [decimal](10, 2) NOT NULL,
    [description] [nvarchar](500) NULL
);</code></pre>
<p>Read the table and the entity side by side — every column decides one annotation:</p>
<table>
<thead><tr><th>Column</th><th>Means</th><th>Annotation on the field</th></tr></thead>
<tbody>
<tr><td><code>id int IDENTITY(1,1) PRIMARY KEY</code></td><td>key made by the database</td><td><code>@Id @GeneratedValue(strategy = GenerationType.IDENTITY) Integer id</code></td></tr>
<tr><td><code>name nvarchar(255) NOT NULL</code></td><td>Unicode text, required</td><td><code>@Basic(optional = false) @Column(length = 255) String name</code></td></tr>
<tr><td><code>price decimal(10,2) NOT NULL</code></td><td>exact number, 8 digits + 2 decimals</td><td><code>@Column(precision = 10, scale = 2) BigDecimal price</code></td></tr>
<tr><td><code>description nvarchar(500) NULL</code></td><td>optional text</td><td><code>@Column(length = 500) String description</code> — may be null</td></tr>
</tbody>
</table>
<p>The <code>Integer</code> (not <code>int</code>) for the id matters: before <code>persist</code> the id is "not there yet". Slide 17 still passes <code>0</code>, and EclipseLink treats 0 as "unassigned" and lets the database generate it (measured: the product got id 2). <strong>The table comes first</strong>: JPA can generate tables (<code>jakarta.persistence.schema-generation.database.action = create</code> or <code>drop-and-create</code>), but on a database with real data <code>drop-and-create</code> deletes everything at every start — in PRJ301 create tables with your SQL script, as here.</p>
<div class="pitfall">Our <code>ProductService</code> checks "price &gt; 0" but not the upper limit, so the database is the last line of defence: a price of 123456789 does not fit <code>decimal(10,2)</code> and the commit fails with SQL Server error 8115 "Arithmetic overflow" — the error page of slide 18 shows it.</div>`,
        `<p class="y-chinh">🎯 "Giả sử TestDB_JPA có bảng Product như sau": <code>CREATE TABLE [dbo].[Product]</code> với <code>id int IDENTITY(1,1) PRIMARY KEY NOT NULL</code>, <code>name nvarchar(255) NOT NULL</code>, <code>price decimal(10,2) NOT NULL</code>, <code>description nvarchar(500) NULL</code>.</p>
<p class="ghi-chu">📄 <code>jpa-san-pham/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE [dbo].[Product](
    [id]          [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
    [name]        [nvarchar](255) NOT NULL,
    [price]       [decimal](10, 2) NOT NULL,
    [description] [nvarchar](500) NULL
);</code></pre>
<p>Đọc bảng và entity cạnh nhau — mỗi cột quyết định một annotation:</p>
<table>
<thead><tr><th>Cột</th><th>Nghĩa</th><th>Annotation trên trường</th></tr></thead>
<tbody>
<tr><td><code>id int IDENTITY(1,1) PRIMARY KEY</code></td><td>khoá do CSDL tạo</td><td><code>@Id @GeneratedValue(strategy = GenerationType.IDENTITY) Integer id</code></td></tr>
<tr><td><code>name nvarchar(255) NOT NULL</code></td><td>chữ Unicode, bắt buộc</td><td><code>@Basic(optional = false) @Column(length = 255) String name</code></td></tr>
<tr><td><code>price decimal(10,2) NOT NULL</code></td><td>số chính xác, 8 chữ số + 2 số lẻ</td><td><code>@Column(precision = 10, scale = 2) BigDecimal price</code></td></tr>
<tr><td><code>description nvarchar(500) NULL</code></td><td>chữ không bắt buộc</td><td><code>@Column(length = 500) String description</code> — có thể null</td></tr>
</tbody>
</table>
<p>Dùng <code>Integer</code> (không phải <code>int</code>) cho id là có lý do: trước <code>persist</code> id "chưa có". Slide 17 vẫn truyền <code>0</code>, và EclipseLink coi 0 là "chưa gán" rồi để CSDL sinh id (đo thật: sản phẩm nhận id 2). <strong>Bảng có trước</strong>: JPA sinh được bảng (<code>jakarta.persistence.schema-generation.database.action = create</code> hoặc <code>drop-and-create</code>), nhưng trên CSDL có dữ liệu thật thì <code>drop-and-create</code> xoá sạch mỗi lần khởi động — ở PRJ301 hãy tạo bảng bằng script SQL của bạn, như ở đây.</p>
<div class="pitfall"><code>ProductService</code> của ta kiểm "price &gt; 0" nhưng không kiểm giới hạn trên, nên CSDL là tuyến chặn cuối: giá 123456789 không vừa <code>decimal(10,2)</code> và commit hỏng với lỗi SQL Server 8115 "Arithmetic overflow" — trang lỗi ở slide 18 cho thấy điều đó.</div>`],
      [17, 'Usage of EntityManager, EntityManagerFactory and EntityTransaction',
        `<p class="y-chinh">🎯 A <code>main()</code> that creates the factory and an EntityManager, gets the transaction, <code>begin()</code>s, <code>persist</code>s <code>new Product(0, "Panasonic", 211111)</code>, commits, prints the product; on an exception it rolls back and prints "Error add new product"; finally it closes the manager and the factory. The NetBeans output shows <code>Product{id=1024, name=Panasonic, price=211111.0, description=null}</code>.</p>
<p>Moved into a servlet's <code>doGet</code> so it runs inside Tomcat — the code between the markers is the slide's, character for character:</p>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/java/demo/Slide17Servlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.Persistence;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import model.Product;

// Slide 17's main(), moved into doGet so it runs inside Tomcat. ?name=… replaces "Panasonic" (empty ⇒ null)
@WebServlet("/slide17")
public class Slide17Servlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String name = req.getParameter("name") == null ? "Panasonic" : (req.getParameter("name").isEmpty() ? null : req.getParameter("name"));
        EntityManagerFactory entityManagerFactory = null;
        EntityManager entityManager = null;
        EntityTransaction entityTransaction = null;
        try {
            entityManagerFactory = Persistence.createEntityManagerFactory("sp25_test4JPAPU", Db.env());
            entityManager = entityManagerFactory.createEntityManager();
            entityTransaction = entityManager.getTransaction();
            entityTransaction.begin();
            Product p = new Product(0, name, 211111);
            entityManager.persist(p);
            entityManager.getTransaction().commit();
            System.out.println(p);
        } catch (Exception e) {
            if (entityTransaction != null) {
                entityTransaction.rollback();
            }
            System.out.print("Error add new product" + e);
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
            if (entityManagerFactory != null) {
                entityManagerFactory.close();
            }
        }
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().println("slide 17 code finished — see the console (log) below");
    }
}</code></pre>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/java/model/Product.java</code></p>
<pre class="web-src"><code class="language-java">package model;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.io.Serializable;

// Slide 13 typed line by line (lines 35–68 + the rest the slide hides); only javax.persistence → jakarta.persistence
@Entity
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @Column(name = "name")
    private String name;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Basic(optional = false)
    @Column(name = "price")
    private double price;
    @Column(name = "description")
    private String description;

    public Product() {
    }

    public Product(Integer id) {
        this.id = id;
    }

    public Product(Integer id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public String toString() {
        return "Product{" + "id=" + id + ", name=" + name + ", price=" + price + ", description=" + description + '}';
    }
}</code></pre>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/resources/META-INF/persistence.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;!-- Slide 15 converted line by line: version 2.2 → 3.0 schema, javax.persistence.* → jakarta.persistence.* --&gt;
&lt;persistence version="3.0" xmlns="https://jakarta.ee/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence https://jakarta.ee/xml/ns/persistence/persistence_3_0.xsd"&gt;
  &lt;persistence-unit name="sp25_test4JPAPU" transaction-type="RESOURCE_LOCAL"&gt;
    &lt;provider&gt;org.eclipse.persistence.jpa.PersistenceProvider&lt;/provider&gt;
    &lt;class&gt;model.Product&lt;/class&gt;
    &lt;exclude-unlisted-classes&gt;true&lt;/exclude-unlisted-classes&gt;
    &lt;properties&gt;
      &lt;property name="jakarta.persistence.jdbc.url"
                value="jdbc:sqlserver://localhost:1433;databaseName=PRJ301_JpaSlide17;encrypt=true;trustServerCertificate=true;"/&gt;
      &lt;property name="jakarta.persistence.jdbc.user" value="sa"/&gt;
      &lt;property name="jakarta.persistence.jdbc.driver" value="com.microsoft.sqlserver.jdbc.SQLServerDriver"/&gt;
      &lt;property name="jakarta.persistence.jdbc.password" value="123456"/&gt;
      &lt;!-- the slide has OFF: then nothing is logged, not even SQL or errors; WARNING + sql FINE shows them --&gt;
      &lt;property name="eclipselink.logging.level" value="WARNING"/&gt;
      &lt;property name="eclipselink.logging.level.sql" value="FINE"/&gt;
      &lt;property name="eclipselink.logging.parameters" value="true"/&gt;
      &lt;property name="eclipselink.logging.timestamp" value="false"/&gt;
      &lt;property name="eclipselink.logging.thread" value="false"/&gt;
      &lt;property name="eclipselink.logging.session" value="false"/&gt;
      &lt;property name="eclipselink.logging.connection" value="false"/&gt;
    &lt;/properties&gt;
  &lt;/persistence-unit&gt;
&lt;/persistence&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/slide17 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 55

slide 17 code finished — see the console (log) below</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, Panasonic, 211111.0]<br>
Product{id=2, name=Panasonic, price=211111.0, description=null}</div>
<p>It works: one <code>INSERT</code> without an id column, and the database-generated id is in the object after commit (2 here, 1024 on the teacher's machine). Now give it a product without a name (<code>?name=</code> ⇒ <code>null</code>; the column is NOT NULL):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/slide17?name= HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1257

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.IllegalStateException:
Exception Description: No transaction is currently active
org.eclipse.persistence.internal.jpa.transaction.EntityTransactionImpl.rollback(EntityTransactionImpl.java:182)
demo.Slide17Servlet.doGet(Slide17Servlet.java:37)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Note The full stack trace of the root cause is available in the server logs.
Apache Tomcat/10.1.61</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
[EL Fine]: sql: SELECT 1<br>
[EL Warning]: Exception [EclipseLink-4002] (Eclipse Persistence Services - 4.0.9.v202601021151-061974965b9a70b72fdcb96dae36a4d6ef5df9ce): org.eclipse.persistence.exceptions.DatabaseException<br>
Internal Exception: com.microsoft.sqlserver.jdbc.SQLServerException: Cannot insert the value NULL into column 'name', table 'PRJ301_JpaSlide17.dbo.Product'; column does not allow nulls. INSERT fails.<br>
Error Code: 515<br>
Call: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
Query: InsertObjectQuery(Product{id=0, name=null, price=211111.0, description=null})</div>
<p><strong>Bug 1 — the catch block hides the real error.</strong> <code>commit()</code> failed (log: SQL Server error 515, "Cannot insert the value NULL into column 'name'"), and a failed commit has <em>already rolled back</em>. The slide then calls <code>rollback()</code> on a transaction that is no longer active ⇒ <code>IllegalStateException: No transaction is currently active</code>, which escapes the catch and replaces the real error. With the slide's <code>logging.level = OFF</code> not even EclipseLink's warning would show: the cause would be lost. <strong>Bug 2</strong>: <code>System.out.print("Error add new product" + e)</code> swallows the exception — the caller (a servlet) believes it worked. The corrected pattern, and the same bad input:</p>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/java/demo/TxServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "fixed" -&gt; {                                    // slide 17 corrected: isActive() before rollback, error not swallowed
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        em.persist(new Product(0, null, 211111));    // name NULL ⇒ NOT NULL violation at commit
        tx.commit();
    } catch (RuntimeException e) {
        if (tx.isActive()) tx.rollback();
        out.println("caught " + e.getClass().getSimpleName() + "; tx.isActive() = " + tx.isActive());
        throw e;                                     // let the caller / error page see it
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/tx?case=fixed HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 255

caught RollbackException; tx.isActive() = false
→ jakarta.persistence.RollbackException
  root cause: SQLServerException: Cannot insert the value NULL into column 'name', table 'PRJ301_JpaSlide17.dbo.Product'; column does not allow nulls. INSERT fails.</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
[EL Fine]: sql: SELECT 1<br>
[EL Warning]: Exception [EclipseLink-4002] (Eclipse Persistence Services - 4.0.9.v202601021151-061974965b9a70b72fdcb96dae36a4d6ef5df9ce): org.eclipse.persistence.exceptions.DatabaseException<br>
Internal Exception: com.microsoft.sqlserver.jdbc.SQLServerException: Cannot insert the value NULL into column 'name', table 'PRJ301_JpaSlide17.dbo.Product'; column does not allow nulls. INSERT fails.<br>
Error Code: 515<br>
Call: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
Query: InsertObjectQuery(Product{id=0, name=null, price=211111.0, description=null})</div>
<p>The slide's note ("Always use Transaction when performing CRUD … if the query is read-only (SELECT)") is garbled. What the spec and EclipseLink really do:</p>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/java/demo/TxServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "no-tx" -&gt; {                                    // a write WITHOUT begin/commit
    Product p = new Product(null, "Philips kettle", 459000);
    em.persist(p);
    out.println("persist() returned, no exception; em.contains(p) = " + em.contains(p) + ", p.getId() = " + p.getId());
    em.close();
    out.println("em closed without commit");
    em = emf.createEntityManager();
    out.println("rows now: " + em.createQuery("SELECT COUNT(p) FROM Product p", Long.class).getSingleResult());
}
case "flush" -&gt; {                                    // forcing the write without a transaction
    em.persist(new Product(null, "Philips kettle", 459000));
    em.flush();
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/tx?case=no-tx HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 111

persist() returned, no exception; em.contains(p) = true, p.getId() = null
em closed without commit
rows now: 2</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT COUNT(id) FROM PRODUCT</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/tx?case=flush HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 113

→ jakarta.persistence.TransactionRequiredException
  Exception Description: No transaction is currently active</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/tx?case=read HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 102

find(1) without a transaction: Product{id=1, name=Sharp microwave, price=2150000.0, description=null}</code></pre>
<div class="pitfall">Measured rules: <strong>writes need a transaction</strong> — without one, <code>persist()</code> returns normally, the object even looks managed, and <em>nothing</em> is inserted (rows stayed 2); forcing it with <code>flush()</code> throws <code>TransactionRequiredException</code>. <strong>Reads do not</strong> — <code>find()</code> and queries work without one (spec §3.3). Always <code>if (tx.isActive()) tx.rollback()</code>, never swallow the exception, and in a web app never create the factory in the method (slide 12).</div>`,
        `<p class="y-chinh">🎯 Một <code>main()</code> tạo factory và một EntityManager, lấy giao dịch, <code>begin()</code>, <code>persist</code> <code>new Product(0, "Panasonic", 211111)</code>, commit, in sản phẩm; gặp exception thì rollback và in "Error add new product"; cuối cùng đóng manager và factory. Output của NetBeans là <code>Product{id=1024, name=Panasonic, price=211111.0, description=null}</code>.</p>
<p>Chuyển vào <code>doGet</code> của một servlet để chạy trong Tomcat — phần code giữa hai dấu mốc là của slide, đúng từng ký tự:</p>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/java/demo/Slide17Servlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.Persistence;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import model.Product;

// main() của slide 17, chuyển vào doGet để chạy trong Tomcat. ?name=… thay "Panasonic" (rỗng ⇒ null)
@WebServlet("/slide17")
public class Slide17Servlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String name = req.getParameter("name") == null ? "Panasonic" : (req.getParameter("name").isEmpty() ? null : req.getParameter("name"));
        EntityManagerFactory entityManagerFactory = null;
        EntityManager entityManager = null;
        EntityTransaction entityTransaction = null;
        try {
            entityManagerFactory = Persistence.createEntityManagerFactory("sp25_test4JPAPU", Db.env());
            entityManager = entityManagerFactory.createEntityManager();
            entityTransaction = entityManager.getTransaction();
            entityTransaction.begin();
            Product p = new Product(0, name, 211111);
            entityManager.persist(p);
            entityManager.getTransaction().commit();
            System.out.println(p);
        } catch (Exception e) {
            if (entityTransaction != null) {
                entityTransaction.rollback();
            }
            System.out.print("Error add new product" + e);
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
            if (entityManagerFactory != null) {
                entityManagerFactory.close();
            }
        }
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().println("slide 17 code finished — see the console (log) below");
    }
}</code></pre>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/java/model/Product.java</code></p>
<pre class="web-src"><code class="language-java">package model;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.io.Serializable;

// Slide 13 gõ lại từng dòng (dòng 35–68 + phần slide che); chỉ đổi javax.persistence → jakarta.persistence
@Entity
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @Column(name = "name")
    private String name;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Basic(optional = false)
    @Column(name = "price")
    private double price;
    @Column(name = "description")
    private String description;

    public Product() {
    }

    public Product(Integer id) {
        this.id = id;
    }

    public Product(Integer id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public String toString() {
        return "Product{" + "id=" + id + ", name=" + name + ", price=" + price + ", description=" + description + '}';
    }
}</code></pre>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/resources/META-INF/persistence.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;!-- Slide 15 đổi từng dòng: version 2.2 → lược đồ 3.0, javax.persistence.* → jakarta.persistence.* --&gt;
&lt;persistence version="3.0" xmlns="https://jakarta.ee/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence https://jakarta.ee/xml/ns/persistence/persistence_3_0.xsd"&gt;
  &lt;persistence-unit name="sp25_test4JPAPU" transaction-type="RESOURCE_LOCAL"&gt;
    &lt;provider&gt;org.eclipse.persistence.jpa.PersistenceProvider&lt;/provider&gt;
    &lt;class&gt;model.Product&lt;/class&gt;
    &lt;exclude-unlisted-classes&gt;true&lt;/exclude-unlisted-classes&gt;
    &lt;properties&gt;
      &lt;property name="jakarta.persistence.jdbc.url"
                value="jdbc:sqlserver://localhost:1433;databaseName=PRJ301_JpaSlide17;encrypt=true;trustServerCertificate=true;"/&gt;
      &lt;property name="jakarta.persistence.jdbc.user" value="sa"/&gt;
      &lt;property name="jakarta.persistence.jdbc.driver" value="com.microsoft.sqlserver.jdbc.SQLServerDriver"/&gt;
      &lt;property name="jakarta.persistence.jdbc.password" value="123456"/&gt;
      &lt;!-- slide để OFF: khi đó không log gì, kể cả SQL hay lỗi; WARNING + sql FINE thì hiện --&gt;
      &lt;property name="eclipselink.logging.level" value="WARNING"/&gt;
      &lt;property name="eclipselink.logging.level.sql" value="FINE"/&gt;
      &lt;property name="eclipselink.logging.parameters" value="true"/&gt;
      &lt;property name="eclipselink.logging.timestamp" value="false"/&gt;
      &lt;property name="eclipselink.logging.thread" value="false"/&gt;
      &lt;property name="eclipselink.logging.session" value="false"/&gt;
      &lt;property name="eclipselink.logging.connection" value="false"/&gt;
    &lt;/properties&gt;
  &lt;/persistence-unit&gt;
&lt;/persistence&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/slide17 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 55

slide 17 code finished — see the console (log) below</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, Panasonic, 211111.0]<br>
Product{id=2, name=Panasonic, price=211111.0, description=null}</div>
<p>Chạy được: một <code>INSERT</code> không có cột id, và id do CSDL sinh nằm sẵn trong đối tượng sau commit (ở đây là 2, trên máy thầy là 1024). Giờ đưa nó một sản phẩm không có tên (<code>?name=</code> ⇒ <code>null</code>; cột này NOT NULL):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/slide17?name= HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1257

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.IllegalStateException:
Exception Description: No transaction is currently active
org.eclipse.persistence.internal.jpa.transaction.EntityTransactionImpl.rollback(EntityTransactionImpl.java:182)
demo.Slide17Servlet.doGet(Slide17Servlet.java:37)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Note The full stack trace of the root cause is available in the server logs.
Apache Tomcat/10.1.61</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
[EL Fine]: sql: SELECT 1<br>
[EL Warning]: Exception [EclipseLink-4002] (Eclipse Persistence Services - 4.0.9.v202601021151-061974965b9a70b72fdcb96dae36a4d6ef5df9ce): org.eclipse.persistence.exceptions.DatabaseException<br>
Internal Exception: com.microsoft.sqlserver.jdbc.SQLServerException: Cannot insert the value NULL into column 'name', table 'PRJ301_JpaSlide17.dbo.Product'; column does not allow nulls. INSERT fails.<br>
Error Code: 515<br>
Call: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
Query: InsertObjectQuery(Product{id=0, name=null, price=211111.0, description=null})</div>
<p><strong>Lỗi 1 — khối catch che mất lỗi thật.</strong> <code>commit()</code> hỏng (log: lỗi SQL Server 515, "Cannot insert the value NULL into column 'name'"), và một commit hỏng thì <em>đã tự rollback</em>. Slide sau đó gọi <code>rollback()</code> trên một giao dịch không còn hoạt động ⇒ <code>IllegalStateException: No transaction is currently active</code>, exception này thoát khỏi catch và thế chỗ lỗi thật. Với <code>logging.level = OFF</code> như slide thì đến cảnh báo của EclipseLink cũng không hiện: nguyên nhân mất hẳn. <strong>Lỗi 2</strong>: <code>System.out.print("Error add new product" + e)</code> nuốt exception — nơi gọi (một servlet) tưởng là đã thành công. Mẫu đã sửa, với cùng dữ liệu sai:</p>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/java/demo/TxServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "fixed" -&gt; {                                    // slide 17 đã sửa: isActive() trước rollback, không nuốt lỗi
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        em.persist(new Product(0, null, 211111));    // name NULL ⇒ vi phạm NOT NULL lúc commit
        tx.commit();
    } catch (RuntimeException e) {
        if (tx.isActive()) tx.rollback();
        out.println("caught " + e.getClass().getSimpleName() + "; tx.isActive() = " + tx.isActive());
        throw e;                                     // để nơi gọi / trang lỗi thấy nó
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/tx?case=fixed HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 255

caught RollbackException; tx.isActive() = false
→ jakarta.persistence.RollbackException
  root cause: SQLServerException: Cannot insert the value NULL into column 'name', table 'PRJ301_JpaSlide17.dbo.Product'; column does not allow nulls. INSERT fails.</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
[EL Fine]: sql: SELECT 1<br>
[EL Warning]: Exception [EclipseLink-4002] (Eclipse Persistence Services - 4.0.9.v202601021151-061974965b9a70b72fdcb96dae36a4d6ef5df9ce): org.eclipse.persistence.exceptions.DatabaseException<br>
Internal Exception: com.microsoft.sqlserver.jdbc.SQLServerException: Cannot insert the value NULL into column 'name', table 'PRJ301_JpaSlide17.dbo.Product'; column does not allow nulls. INSERT fails.<br>
Error Code: 515<br>
Call: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
Query: InsertObjectQuery(Product{id=0, name=null, price=211111.0, description=null})</div>
<p>Ghi chú của slide ("Always use Transaction when performing CRUD … if the query is read-only (SELECT)") bị viết lộn xộn. Điều đặc tả và EclipseLink thật sự làm:</p>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/java/demo/TxServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "no-tx" -&gt; {                                    // ghi mà KHÔNG begin/commit
    Product p = new Product(null, "Philips kettle", 459000);
    em.persist(p);
    out.println("persist() returned, no exception; em.contains(p) = " + em.contains(p) + ", p.getId() = " + p.getId());
    em.close();
    out.println("em closed without commit");
    em = emf.createEntityManager();
    out.println("rows now: " + em.createQuery("SELECT COUNT(p) FROM Product p", Long.class).getSingleResult());
}
case "flush" -&gt; {                                    // ép ghi khi không có giao dịch
    em.persist(new Product(null, "Philips kettle", 459000));
    em.flush();
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/tx?case=no-tx HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 111

persist() returned, no exception; em.contains(p) = true, p.getId() = null
em closed without commit
rows now: 2</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT COUNT(id) FROM PRODUCT</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/tx?case=flush HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 113

→ jakarta.persistence.TransactionRequiredException
  Exception Description: No transaction is currently active</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/tx?case=read HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 102

find(1) without a transaction: Product{id=1, name=Sharp microwave, price=2150000.0, description=null}</code></pre>
<div class="pitfall">Luật đo được: <strong>ghi thì cần giao dịch</strong> — không có thì <code>persist()</code> vẫn trả về bình thường, đối tượng còn trông như đang được quản lý, mà <em>không có gì</em> được thêm (số dòng vẫn là 2); ép bằng <code>flush()</code> thì ném <code>TransactionRequiredException</code>. <strong>Đọc thì không cần</strong> — <code>find()</code> và truy vấn chạy được khi không có giao dịch (đặc tả §3.3). Luôn <code>if (tx.isActive()) tx.rollback()</code>, đừng bao giờ nuốt exception, và trong app web đừng tạo factory trong phương thức (slide 12).</div>`],
      [18, 'JPA Web Application demo',
        `<p class="y-chinh">🎯 Twelve steps: create a Java with Ant web project, add the libraries, look at the project structure, set up the SQL Server database, create the entity <code>Product.java</code>, "Hibernate Java-based configuration", <code>ProductDAO</code>, <code>ProductService</code>, <code>ProductServlet</code>, <code>product-list.jsp</code>, an error JSP, deploy and test.</p>
<p>The slide lists the steps without code; here they are built and run (<code>jpa-san-pham</code>):</p>
<table>
<thead><tr><th>Step</th><th>In our app</th></tr></thead>
<tbody>
<tr><td>1–3 project, libraries, structure</td><td>Maven layout; <code>WEB-INF/lib</code> = jakarta.persistence-api 3.1, eclipselink 4.0.9, mssql-jdbc, JSTL (the WAR listing at slide 15). In an Ant project you add the same jars as Libraries.</td></tr>
<tr><td>4 database</td><td><code>setup.sql</code> = slide 16's table + 5 products</td></tr>
<tr><td>5 entity</td><td><code>model.Product</code> (slide 6)</td></tr>
<tr><td>6 configuration</td><td><code>persistence.xml</code> + <code>JpaUtil</code> (slides 14–15). ➕ "Hibernate Java-based configuration" means building the configuration in Java code instead of XML (Hibernate's own API) — not needed here</td></tr>
<tr><td>7–8 DAO, service</td><td><code>dal.ProductDAO</code> (JPA only), <code>service.ProductService</code> (rules)</td></tr>
<tr><td>9–11 servlet, JSPs</td><td><code>controller.ProductServlet</code> (MVC, lesson 6.A), <code>WEB-INF/views/product-list.jsp</code>, <code>error.jsp</code> via <code>&lt;error-page&gt;</code></td></tr>
<tr><td>12 deploy and test</td><td>the requests on this page (and in slides 5, 14, 15), each with its SQL</td></tr>
</tbody>
</table>
<p><strong>The DAO.</strong> Reads: no SQL strings, no <code>ResultSet</code>, no <code>map(rs)</code>; JPQL speaks about the <em>class</em> <code>Product</code> and its <em>fields</em>, and <code>:kw</code> is a bound value like <code>?</code> in a <code>PreparedStatement</code>:</p>
<p class="ghi-chu">📄 <code>jpa-san-pham/src/main/java/dal/ProductDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public List&lt;Product&gt; findAll() {
    EntityManager em = JpaUtil.em();
    try {
        return em.createNamedQuery("Product.findAll", Product.class).getResultList();
    } finally {
        em.close();
    }
}

public Product findById(int id) {
    EntityManager em = JpaUtil.em();
    try {
        return em.find(Product.class, id);                       // null = no such row ⇒ the servlet answers 404
    } finally {
        em.close();
    }
}

public List&lt;Product&gt; search(String keyword) {
    EntityManager em = JpaUtil.em();
    try {
        return em.createQuery("SELECT p FROM Product p WHERE p.name LIKE :kw ORDER BY p.name", Product.class)
                 .setParameter("kw", "%" + keyword + "%")          // a VALUE, like ? in a PreparedStatement
                 .getResultList();
    } finally {
        em.close();
    }
}</code></pre>
<p class="ghi-chu">📄 <code>jpa-san-pham/src/main/java/dal/ProductDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public List&lt;Product&gt; page(int page, int size) {
    EntityManager em = JpaUtil.em();
    try {
        return em.createQuery("SELECT p FROM Product p ORDER BY p.id", Product.class)
                 .setFirstResult((page - 1) * size)               // skip
                 .setMaxResults(size)                             // take
                 .getResultList();
    } finally {
        em.close();
    }
}

public long count() {
    EntityManager em = JpaUtil.em();
    try {
        return em.createQuery("SELECT COUNT(p) FROM Product p", Long.class).getSingleResult();
    } finally {
        em.close();
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-san-pham/products?page=2 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Products&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Products&lt;/h1&gt;
&lt;form action="products" method="get"&gt;&lt;input name="q" value=""&gt; &lt;button&gt;Search&lt;/button&gt;&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Id&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Description&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;Sunhouse blender&lt;/td&gt;&lt;td&gt;890000.00&lt;/td&gt;&lt;td&gt;-&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=4"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Panasonic hair dryer&lt;/td&gt;&lt;td&gt;399000.00&lt;/td&gt;&lt;td&gt;1800 W&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=5"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 2/2&lt;/p&gt;&lt;h2&gt;Add a product&lt;/h2&gt;
&lt;form action="products" method="post"&gt;
  &lt;input type="hidden" name="action" value="add"&gt;
  
  Name &lt;input name="name" value=""&gt; &lt;br&gt;
  Price &lt;input name="price" value=""&gt; &lt;br&gt;
  Description &lt;input name="description" value=""&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT id, description, name, price FROM Product ORDER BY id OFFSET ? ROWS FETCH NEXT ? ROWS ONLY<br>
	bind =&gt; [3, 3]<br>
[EL Fine]: sql: SELECT COUNT(id) FROM Product</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-san-pham/products?q=Panasonic HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Products&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Products&lt;/h1&gt;
&lt;form action="products" method="get"&gt;&lt;input name="q" value="Panasonic"&gt; &lt;button&gt;Search&lt;/button&gt;&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Id&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Description&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Panasonic hair dryer&lt;/td&gt;&lt;td&gt;399000.00&lt;/td&gt;&lt;td&gt;1800 W&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=5"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Panasonic rice cooker&lt;/td&gt;&lt;td&gt;1290000.00&lt;/td&gt;&lt;td&gt;1.8 L, 10 menus&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=1"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;h2&gt;Add a product&lt;/h2&gt;
&lt;form action="products" method="post"&gt;
  &lt;input type="hidden" name="action" value="add"&gt;
  
  Name &lt;input name="name" value=""&gt; &lt;br&gt;
  Price &lt;input name="price" value=""&gt; &lt;br&gt;
  Description &lt;input name="description" value=""&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT id, description, name, price FROM Product WHERE name LIKE ? ORDER BY name<br>
	bind =&gt; [%Panasonic%]</div>
<p>Pagination became SQL Server's <code>OFFSET ? ROWS FETCH NEXT ? ROWS ONLY</code>; the search keyword went as a bind value. Writes: every change inside begin/commit, <code>isActive()</code> before rollback, and <strong>no <code>em.update()</code></strong> — <code>update</code> changes a managed object and commit does the rest:</p>
<p class="ghi-chu">📄 <code>jpa-san-pham/src/main/java/dal/ProductDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public void insert(Product p) {
    EntityManager em = JpaUtil.em();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        em.persist(p);                                           // INSERT happens at commit; p.getId() is filled
        tx.commit();
    } finally {
        if (tx.isActive()) tx.rollback();                        // only if commit was never reached
        em.close();
    }
}

public boolean update(Product changed) {
    EntityManager em = JpaUtil.em();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        Product p = em.find(Product.class, changed.getId());     // managed: JPA watches its fields
        if (p == null) return false;
        p.setName(changed.getName());                            // no em.update(): commit writes what changed
        p.setPrice(changed.getPrice());
        p.setDescription(changed.getDescription());
        tx.commit();
        return true;
    } finally {
        if (tx.isActive()) tx.rollback();
        em.close();
    }
}

public boolean delete(int id) {
    EntityManager em = JpaUtil.em();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        Product p = em.find(Product.class, id);
        if (p == null) return false;
        em.remove(p);                                            // remove needs a MANAGED object, not just an id
        tx.commit();
        return true;
    } finally {
        if (tx.isActive()) tx.rollback();
        em.close();
    }
}</code></pre>
<p class="ghi-chu">📄 <code>jpa-san-pham/src/main/java/controller/ProductServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String action = String.valueOf(req.getParameter("action"));
    if (action.equals("delete")) {
        if (!service.delete(toInt(req.getParameter("id")))) { resp.sendError(404); return; }
        resp.sendRedirect("products?done=deleted");              // Post/Redirect/Get
        return;
    }
    Product p = new Product();
    if (action.equals("update")) p.setId(toInt(req.getParameter("id")));
    Map&lt;String, String&gt; errors = service.validate(req.getParameter("name"), req.getParameter("price"),
            req.getParameter("description"), p);
    if (!errors.isEmpty()) {                                     // same request back to the form, with the errors
        req.setAttribute("errors", errors);
        show(req, resp);
        return;
    }
    if (action.equals("update")) {
        if (!service.update(p)) { resp.sendError(404); return; }
        resp.sendRedirect("products?done=updated");
    } else {
        service.add(p);
        resp.sendRedirect("products?done=added&amp;newId=" + p.getId());   // persist filled the IDENTITY id
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /jpa-san-pham/products HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 39

action=add&amp;name=&amp;price=abc&amp;description=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Products&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Products&lt;/h1&gt;
&lt;form action="products" method="get"&gt;&lt;input name="q" value=""&gt; &lt;button&gt;Search&lt;/button&gt;&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Id&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Description&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Panasonic rice cooker&lt;/td&gt;&lt;td&gt;1290000.00&lt;/td&gt;&lt;td&gt;1.8 L, 10 menus&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=1"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Sharp microwave&lt;/td&gt;&lt;td&gt;2150000.00&lt;/td&gt;&lt;td&gt;-&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=2"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Philips kettle&lt;/td&gt;&lt;td&gt;459000.00&lt;/td&gt;&lt;td&gt;1.7 L, stainless steel&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=3"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 1/2&lt;/p&gt;&lt;h2&gt;Add a product&lt;/h2&gt;
&lt;form action="products" method="post"&gt;
  &lt;input type="hidden" name="action" value="add"&gt;
  
  Name &lt;input name="name" value=""&gt; Name is required&lt;br&gt;
  Price &lt;input name="price" value="abc"&gt; Price must be a number, e.g. 459000&lt;br&gt;
  Description &lt;input name="description" value=""&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT id, description, name, price FROM Product ORDER BY id OFFSET ? ROWS FETCH NEXT ? ROWS ONLY<br>
	bind =&gt; [0, 3]<br>
[EL Fine]: sql: SELECT COUNT(id) FROM Product</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /jpa-san-pham/products HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 62

action=add&amp;name=Toshiba+fridge+180L&amp;price=4990000&amp;description=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: products?done=added&amp;newId=6
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO Product (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, Toshiba fridge 180L, 4990000]</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-san-pham/products?page=2&amp;done=added&amp;newId=6 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Products&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Products&lt;/h1&gt;
&lt;p class="flash"&gt;Product added (id 6).&lt;/p&gt;&lt;form action="products" method="get"&gt;&lt;input name="q" value=""&gt; &lt;button&gt;Search&lt;/button&gt;&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Id&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Description&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;Sunhouse blender&lt;/td&gt;&lt;td&gt;890000.00&lt;/td&gt;&lt;td&gt;-&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=4"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Panasonic hair dryer&lt;/td&gt;&lt;td&gt;399000.00&lt;/td&gt;&lt;td&gt;1800 W&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=5"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;Toshiba fridge 180L&lt;/td&gt;&lt;td&gt;4990000&lt;/td&gt;&lt;td&gt;-&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=6"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 2/2&lt;/p&gt;&lt;h2&gt;Add a product&lt;/h2&gt;
&lt;form action="products" method="post"&gt;
  &lt;input type="hidden" name="action" value="add"&gt;
  
  Name &lt;input name="name" value=""&gt; &lt;br&gt;
  Price &lt;input name="price" value=""&gt; &lt;br&gt;
  Description &lt;input name="description" value=""&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT id, description, name, price FROM Product ORDER BY id OFFSET ? ROWS FETCH NEXT ? ROWS ONLY<br>
	bind =&gt; [3, 3]<br>
[EL Fine]: sql: SELECT COUNT(id) FROM Product</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /jpa-san-pham/products HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 88

action=update&amp;id=3&amp;name=Philips+kettle&amp;price=429000&amp;description=1.7+L%2C+stainless+steel</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: products?done=updated
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: UPDATE Product SET price = ? WHERE (id = ?)<br>
	bind =&gt; [429000, 3]</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /jpa-san-pham/products HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 18

action=delete&amp;id=4</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: products?done=deleted
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: DELETE FROM Product WHERE (id = ?)<br>
	bind =&gt; [4]</div>
<p>The update changed only the price, so the SQL is <code>UPDATE Product SET price = ? WHERE (id = ?)</code>. After the insert, page 2 shows the new fridge at <code>4990000</code> while the other rows show <code>890000.00</code>: the query went to SQL Server, but EclipseLink handed back the object <em>we</em> persisted from its shared cache — a cache is a copy, and a copy can differ from the row. Last, the error page (step 11): a price too big for <code>decimal(10,2)</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /jpa-san-pham/products HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 56

action=add&amp;name=Server+rack&amp;price=123456789&amp;description=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Error&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Sorry, the product could not be saved&lt;/h1&gt;
&lt;p&gt;Error type: RollbackException&lt;/p&gt;
&lt;p&gt;&lt;a href="products"&gt;Back to the list&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO Product (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, Server rack, 123456789]<br>
[EL Fine]: sql: SELECT 1<br>
[EL Warning]: Exception [EclipseLink-4002] (Eclipse Persistence Services - 4.0.9.v202601021151-061974965b9a70b72fdcb96dae36a4d6ef5df9ce): org.eclipse.persistence.exceptions.DatabaseException<br>
Internal Exception: com.microsoft.sqlserver.jdbc.SQLServerException: Arithmetic overflow error converting numeric to data type numeric.<br>
Error Code: 8115<br>
Call: INSERT INTO Product (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, Server rack, 123456789]<br>
Query: InsertObjectQuery(Product{id=null, name=Server rack, price=123456789, description=null})</div>
<p>➕ <strong>DAO JPA vs DAO JDBC (lesson 5.B).</strong> The same "insert" in both styles:</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/dal/HumanDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public int insert(Human h) throws SQLException {
    String sql = "INSERT INTO Human (humanname, humandob, humangender, typeid) VALUES (?, ?, ?, ?)";
    try (Connection con = DBContext.getConnection();
         PreparedStatement ps = con.prepareStatement(sql)) {
        ps.setString(1, h.getName());
        ps.setDate(2, h.getDob());
        ps.setBoolean(3, h.isGender());
        ps.setInt(4, h.getType().getTypeid());
        return ps.executeUpdate();                              // 1 = one row inserted
    }
}

public int update(Human h) throws SQLException {
    String sql = "UPDATE Human SET humanname = ?, humandob = ?, humangender = ?, typeid = ? WHERE humanid = ?";
    try (Connection con = DBContext.getConnection();
         PreparedStatement ps = con.prepareStatement(sql)) {
        ps.setString(1, h.getName());
        ps.setDate(2, h.getDob());
        ps.setBoolean(3, h.isGender());
        ps.setInt(4, h.getType().getTypeid());
        ps.setInt(5, h.getId());
        return ps.executeUpdate();                              // 0 = the id did not exist
    }
}

public int delete(int id) throws SQLException {
    try (Connection con = DBContext.getConnection();
         PreparedStatement ps = con.prepareStatement("DELETE FROM Human WHERE humanid = ?")) {
        ps.setInt(1, id);
        return ps.executeUpdate();
    }
}</code></pre>
<table>
<thead><tr><th></th><th>JDBC (<code>HumanDAO</code>, 5.B)</th><th>JPA (<code>ProductDAO</code>)</th></tr></thead>
<tbody>
<tr><td>SQL</td><td>written by you, one string per method</td><td>generated; JPQL only for queries</td></tr>
<tr><td>row → object</td><td><code>map(rs)</code> by hand</td><td>automatic (annotations)</td></tr>
<tr><td>UPDATE</td><td>lists every column</td><td>only the changed ones</td></tr>
<tr><td>relationship</td><td><code>INNER JOIN</code> + build <code>new HumanType(…)</code></td><td><code>h.getType()</code> — but watch N+1, use <code>JOIN FETCH</code></td></tr>
<tr><td>transaction</td><td>auto-commit by default</td><td>required for every write, by hand</td></tr>
<tr><td>length</td><td>99 lines</td><td>100 lines for the same Human DAO in JPA (exercise 7 of 7.3): the SQL disappeared, the transaction code appeared</td></tr>
</tbody>
</table>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): the transaction code is exactly what Spring removes. <code>spring-boot-starter-data-jpa</code> brings Hibernate (the provider) and Spring Data; you write an <strong>interface</strong> and Spring generates the DAO, including queries derived from method names; <code>@Transactional</code> on a service method begins before it and commits after it (rolls back on a <code>RuntimeException</code>):
<pre><code class="language-java">public interface ProductRepository extends JpaRepository&lt;Product, Integer&gt; {   // save, findById, findAll, deleteById… for free
    List&lt;Product&gt; findByNameContaining(String keyword);                        // derived: WHERE name LIKE %keyword%
    @Query("SELECT p FROM Product p WHERE p.price &lt;= :max ORDER BY p.price")    // your own JPQL when needed
    List&lt;Product&gt; findCheaperThan(@Param("max") BigDecimal max);
}

@Service
public class ProductService {
    private final ProductRepository repo;
    public ProductService(ProductRepository repo) { this.repo = repo; }
    @Transactional                                       // = tx.begin() … tx.commit() / rollback()
    public void reprice(int id, BigDecimal price) {
        repo.findById(id).orElseThrow().setPrice(price); // managed ⇒ UPDATE at commit, no save() needed
    }
}</code></pre>
Show the SQL with <code>spring.jpa.show-sql=true</code>. Spring Boot also registers "Open EntityManager in View" by default (<code>spring.jpa.open-in-view</code>), which keeps the EntityManager open while the view renders — convenient, but it hides N+1 queries; many teams set it to <code>false</code> and use <code>JOIN FETCH</code> as in this lesson.</div>`,
        `<p class="y-chinh">🎯 Mười hai bước: tạo một Java web project kiểu Ant, thêm thư viện, xem cấu trúc project, dựng CSDL SQL Server, tạo entity <code>Product.java</code>, "cấu hình Hibernate bằng Java", <code>ProductDAO</code>, <code>ProductService</code>, <code>ProductServlet</code>, <code>product-list.jsp</code>, một JSP báo lỗi, deploy và chạy thử.</p>
<p>Slide chỉ liệt kê các bước, không có code; ở đây chúng được dựng và chạy thật (<code>jpa-san-pham</code>):</p>
<table>
<thead><tr><th>Bước</th><th>Trong app của ta</th></tr></thead>
<tbody>
<tr><td>1–3 project, thư viện, cấu trúc</td><td>bố cục Maven; <code>WEB-INF/lib</code> = jakarta.persistence-api 3.1, eclipselink 4.0.9, mssql-jdbc, JSTL (danh sách WAR ở slide 15). Với project Ant thì thêm đúng các jar đó vào Libraries.</td></tr>
<tr><td>4 CSDL</td><td><code>setup.sql</code> = bảng của slide 16 + 5 sản phẩm</td></tr>
<tr><td>5 entity</td><td><code>model.Product</code> (slide 6)</td></tr>
<tr><td>6 cấu hình</td><td><code>persistence.xml</code> + <code>JpaUtil</code> (slide 14–15). ➕ "Hibernate Java-based configuration" là dựng cấu hình bằng code Java thay cho XML (API riêng của Hibernate) — ở đây không cần</td></tr>
<tr><td>7–8 DAO, service</td><td><code>dal.ProductDAO</code> (chỉ JPA), <code>service.ProductService</code> (luật)</td></tr>
<tr><td>9–11 servlet, JSP</td><td><code>controller.ProductServlet</code> (MVC, bài 6.A), <code>WEB-INF/views/product-list.jsp</code>, <code>error.jsp</code> qua <code>&lt;error-page&gt;</code></td></tr>
<tr><td>12 deploy và chạy thử</td><td>các request trên trang này (và ở slide 5, 14, 15), kèm SQL của từng cái</td></tr>
</tbody>
</table>
<p><strong>DAO.</strong> Phần đọc: không chuỗi SQL, không <code>ResultSet</code>, không <code>map(rs)</code>; JPQL nói về <em>lớp</em> <code>Product</code> và các <em>trường</em> của nó, còn <code>:kw</code> là một giá trị được gắn (bind) như dấu <code>?</code> của <code>PreparedStatement</code>:</p>
<p class="ghi-chu">📄 <code>jpa-san-pham/src/main/java/dal/ProductDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public List&lt;Product&gt; findAll() {
    EntityManager em = JpaUtil.em();
    try {
        return em.createNamedQuery("Product.findAll", Product.class).getResultList();
    } finally {
        em.close();
    }
}

public Product findById(int id) {
    EntityManager em = JpaUtil.em();
    try {
        return em.find(Product.class, id);                       // null = không có dòng ⇒ servlet trả 404
    } finally {
        em.close();
    }
}

public List&lt;Product&gt; search(String keyword) {
    EntityManager em = JpaUtil.em();
    try {
        return em.createQuery("SELECT p FROM Product p WHERE p.name LIKE :kw ORDER BY p.name", Product.class)
                 .setParameter("kw", "%" + keyword + "%")          // một GIÁ TRỊ, như dấu ? của PreparedStatement
                 .getResultList();
    } finally {
        em.close();
    }
}</code></pre>
<p class="ghi-chu">📄 <code>jpa-san-pham/src/main/java/dal/ProductDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public List&lt;Product&gt; page(int page, int size) {
    EntityManager em = JpaUtil.em();
    try {
        return em.createQuery("SELECT p FROM Product p ORDER BY p.id", Product.class)
                 .setFirstResult((page - 1) * size)               // bỏ qua
                 .setMaxResults(size)                             // lấy
                 .getResultList();
    } finally {
        em.close();
    }
}

public long count() {
    EntityManager em = JpaUtil.em();
    try {
        return em.createQuery("SELECT COUNT(p) FROM Product p", Long.class).getSingleResult();
    } finally {
        em.close();
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-san-pham/products?page=2 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Products&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Products&lt;/h1&gt;
&lt;form action="products" method="get"&gt;&lt;input name="q" value=""&gt; &lt;button&gt;Search&lt;/button&gt;&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Id&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Description&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;Sunhouse blender&lt;/td&gt;&lt;td&gt;890000.00&lt;/td&gt;&lt;td&gt;-&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=4"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Panasonic hair dryer&lt;/td&gt;&lt;td&gt;399000.00&lt;/td&gt;&lt;td&gt;1800 W&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=5"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 2/2&lt;/p&gt;&lt;h2&gt;Add a product&lt;/h2&gt;
&lt;form action="products" method="post"&gt;
  &lt;input type="hidden" name="action" value="add"&gt;
  
  Name &lt;input name="name" value=""&gt; &lt;br&gt;
  Price &lt;input name="price" value=""&gt; &lt;br&gt;
  Description &lt;input name="description" value=""&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT id, description, name, price FROM Product ORDER BY id OFFSET ? ROWS FETCH NEXT ? ROWS ONLY<br>
	bind =&gt; [3, 3]<br>
[EL Fine]: sql: SELECT COUNT(id) FROM Product</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-san-pham/products?q=Panasonic HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Products&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Products&lt;/h1&gt;
&lt;form action="products" method="get"&gt;&lt;input name="q" value="Panasonic"&gt; &lt;button&gt;Search&lt;/button&gt;&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Id&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Description&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Panasonic hair dryer&lt;/td&gt;&lt;td&gt;399000.00&lt;/td&gt;&lt;td&gt;1800 W&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=5"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Panasonic rice cooker&lt;/td&gt;&lt;td&gt;1290000.00&lt;/td&gt;&lt;td&gt;1.8 L, 10 menus&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=1"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;h2&gt;Add a product&lt;/h2&gt;
&lt;form action="products" method="post"&gt;
  &lt;input type="hidden" name="action" value="add"&gt;
  
  Name &lt;input name="name" value=""&gt; &lt;br&gt;
  Price &lt;input name="price" value=""&gt; &lt;br&gt;
  Description &lt;input name="description" value=""&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT id, description, name, price FROM Product WHERE name LIKE ? ORDER BY name<br>
	bind =&gt; [%Panasonic%]</div>
<p>Phân trang thành <code>OFFSET ? ROWS FETCH NEXT ? ROWS ONLY</code> của SQL Server; từ khoá tìm kiếm đi dưới dạng giá trị bind. Phần ghi: mọi thay đổi nằm trong begin/commit, <code>isActive()</code> trước khi rollback, và <strong>không có <code>em.update()</code></strong> — <code>update</code> chỉ đổi một đối tượng đang được quản lý, commit lo phần còn lại:</p>
<p class="ghi-chu">📄 <code>jpa-san-pham/src/main/java/dal/ProductDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public void insert(Product p) {
    EntityManager em = JpaUtil.em();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        em.persist(p);                                           // INSERT chạy lúc commit; p.getId() được điền
        tx.commit();
    } finally {
        if (tx.isActive()) tx.rollback();                        // chỉ khi chưa tới được commit
        em.close();
    }
}

public boolean update(Product changed) {
    EntityManager em = JpaUtil.em();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        Product p = em.find(Product.class, changed.getId());     // được quản lý: JPA theo dõi các trường của nó
        if (p == null) return false;
        p.setName(changed.getName());                            // không có em.update(): commit tự ghi phần đã đổi
        p.setPrice(changed.getPrice());
        p.setDescription(changed.getDescription());
        tx.commit();
        return true;
    } finally {
        if (tx.isActive()) tx.rollback();
        em.close();
    }
}

public boolean delete(int id) {
    EntityManager em = JpaUtil.em();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        Product p = em.find(Product.class, id);
        if (p == null) return false;
        em.remove(p);                                            // remove cần đối tượng ĐƯỢC QUẢN LÝ, không chỉ một id
        tx.commit();
        return true;
    } finally {
        if (tx.isActive()) tx.rollback();
        em.close();
    }
}</code></pre>
<p class="ghi-chu">📄 <code>jpa-san-pham/src/main/java/controller/ProductServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String action = String.valueOf(req.getParameter("action"));
    if (action.equals("delete")) {
        if (!service.delete(toInt(req.getParameter("id")))) { resp.sendError(404); return; }
        resp.sendRedirect("products?done=deleted");              // Post/Redirect/Get
        return;
    }
    Product p = new Product();
    if (action.equals("update")) p.setId(toInt(req.getParameter("id")));
    Map&lt;String, String&gt; errors = service.validate(req.getParameter("name"), req.getParameter("price"),
            req.getParameter("description"), p);
    if (!errors.isEmpty()) {                                     // trả lại form trong cùng request, kèm lỗi
        req.setAttribute("errors", errors);
        show(req, resp);
        return;
    }
    if (action.equals("update")) {
        if (!service.update(p)) { resp.sendError(404); return; }
        resp.sendRedirect("products?done=updated");
    } else {
        service.add(p);
        resp.sendRedirect("products?done=added&amp;newId=" + p.getId());   // persist đã điền id IDENTITY
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /jpa-san-pham/products HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 39

action=add&amp;name=&amp;price=abc&amp;description=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Products&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Products&lt;/h1&gt;
&lt;form action="products" method="get"&gt;&lt;input name="q" value=""&gt; &lt;button&gt;Search&lt;/button&gt;&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Id&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Description&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;1&lt;/td&gt;&lt;td&gt;Panasonic rice cooker&lt;/td&gt;&lt;td&gt;1290000.00&lt;/td&gt;&lt;td&gt;1.8 L, 10 menus&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=1"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Sharp microwave&lt;/td&gt;&lt;td&gt;2150000.00&lt;/td&gt;&lt;td&gt;-&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=2"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Philips kettle&lt;/td&gt;&lt;td&gt;459000.00&lt;/td&gt;&lt;td&gt;1.7 L, stainless steel&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=3"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 1/2&lt;/p&gt;&lt;h2&gt;Add a product&lt;/h2&gt;
&lt;form action="products" method="post"&gt;
  &lt;input type="hidden" name="action" value="add"&gt;
  
  Name &lt;input name="name" value=""&gt; Name is required&lt;br&gt;
  Price &lt;input name="price" value="abc"&gt; Price must be a number, e.g. 459000&lt;br&gt;
  Description &lt;input name="description" value=""&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT id, description, name, price FROM Product ORDER BY id OFFSET ? ROWS FETCH NEXT ? ROWS ONLY<br>
	bind =&gt; [0, 3]<br>
[EL Fine]: sql: SELECT COUNT(id) FROM Product</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /jpa-san-pham/products HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 62

action=add&amp;name=Toshiba+fridge+180L&amp;price=4990000&amp;description=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: products?done=added&amp;newId=6
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO Product (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, Toshiba fridge 180L, 4990000]</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-san-pham/products?page=2&amp;done=added&amp;newId=6 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Products&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Products&lt;/h1&gt;
&lt;p class="flash"&gt;Product added (id 6).&lt;/p&gt;&lt;form action="products" method="get"&gt;&lt;input name="q" value=""&gt; &lt;button&gt;Search&lt;/button&gt;&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Id&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Price&lt;/th&gt;&lt;th&gt;Description&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;Sunhouse blender&lt;/td&gt;&lt;td&gt;890000.00&lt;/td&gt;&lt;td&gt;-&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=4"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Panasonic hair dryer&lt;/td&gt;&lt;td&gt;399000.00&lt;/td&gt;&lt;td&gt;1800 W&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=5"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;Toshiba fridge 180L&lt;/td&gt;&lt;td&gt;4990000&lt;/td&gt;&lt;td&gt;-&lt;/td&gt;
      &lt;td&gt;&lt;a href="products?id=6"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 2/2&lt;/p&gt;&lt;h2&gt;Add a product&lt;/h2&gt;
&lt;form action="products" method="post"&gt;
  &lt;input type="hidden" name="action" value="add"&gt;
  
  Name &lt;input name="name" value=""&gt; &lt;br&gt;
  Price &lt;input name="price" value=""&gt; &lt;br&gt;
  Description &lt;input name="description" value=""&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT id, description, name, price FROM Product ORDER BY id OFFSET ? ROWS FETCH NEXT ? ROWS ONLY<br>
	bind =&gt; [3, 3]<br>
[EL Fine]: sql: SELECT COUNT(id) FROM Product</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /jpa-san-pham/products HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 88

action=update&amp;id=3&amp;name=Philips+kettle&amp;price=429000&amp;description=1.7+L%2C+stainless+steel</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: products?done=updated
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: UPDATE Product SET price = ? WHERE (id = ?)<br>
	bind =&gt; [429000, 3]</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /jpa-san-pham/products HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 18

action=delete&amp;id=4</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: products?done=deleted
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: DELETE FROM Product WHERE (id = ?)<br>
	bind =&gt; [4]</div>
<p>Lần sửa chỉ đổi giá, nên SQL là <code>UPDATE Product SET price = ? WHERE (id = ?)</code>. Sau khi thêm, trang 2 hiện tủ lạnh mới với giá <code>4990000</code> trong khi các dòng khác hiện <code>890000.00</code>: truy vấn có xuống SQL Server, nhưng EclipseLink trả lại chính đối tượng <em>ta</em> đã persist, lấy từ cache dùng chung — cache là một bản sao, và bản sao có thể khác dòng trong bảng. Cuối cùng, trang lỗi (bước 11): một giá quá lớn so với <code>decimal(10,2)</code>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /jpa-san-pham/products HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 56

action=add&amp;name=Server+rack&amp;price=123456789&amp;description=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Error&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Sorry, the product could not be saved&lt;/h1&gt;
&lt;p&gt;Error type: RollbackException&lt;/p&gt;
&lt;p&gt;&lt;a href="products"&gt;Back to the list&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO Product (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, Server rack, 123456789]<br>
[EL Fine]: sql: SELECT 1<br>
[EL Warning]: Exception [EclipseLink-4002] (Eclipse Persistence Services - 4.0.9.v202601021151-061974965b9a70b72fdcb96dae36a4d6ef5df9ce): org.eclipse.persistence.exceptions.DatabaseException<br>
Internal Exception: com.microsoft.sqlserver.jdbc.SQLServerException: Arithmetic overflow error converting numeric to data type numeric.<br>
Error Code: 8115<br>
Call: INSERT INTO Product (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, Server rack, 123456789]<br>
Query: InsertObjectQuery(Product{id=null, name=Server rack, price=123456789, description=null})</div>
<p>➕ <strong>DAO JPA so với DAO JDBC (bài 5.B).</strong> Cùng việc "thêm" theo hai kiểu:</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/dal/HumanDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public int insert(Human h) throws SQLException {
    String sql = "INSERT INTO Human (humanname, humandob, humangender, typeid) VALUES (?, ?, ?, ?)";
    try (Connection con = DBContext.getConnection();
         PreparedStatement ps = con.prepareStatement(sql)) {
        ps.setString(1, h.getName());
        ps.setDate(2, h.getDob());
        ps.setBoolean(3, h.isGender());
        ps.setInt(4, h.getType().getTypeid());
        return ps.executeUpdate();                              // 1 = đã thêm một dòng
    }
}

public int update(Human h) throws SQLException {
    String sql = "UPDATE Human SET humanname = ?, humandob = ?, humangender = ?, typeid = ? WHERE humanid = ?";
    try (Connection con = DBContext.getConnection();
         PreparedStatement ps = con.prepareStatement(sql)) {
        ps.setString(1, h.getName());
        ps.setDate(2, h.getDob());
        ps.setBoolean(3, h.isGender());
        ps.setInt(4, h.getType().getTypeid());
        ps.setInt(5, h.getId());
        return ps.executeUpdate();                              // 0 = id không tồn tại
    }
}

public int delete(int id) throws SQLException {
    try (Connection con = DBContext.getConnection();
         PreparedStatement ps = con.prepareStatement("DELETE FROM Human WHERE humanid = ?")) {
        ps.setInt(1, id);
        return ps.executeUpdate();
    }
}</code></pre>
<table>
<thead><tr><th></th><th>JDBC (<code>HumanDAO</code>, 5.B)</th><th>JPA (<code>ProductDAO</code>)</th></tr></thead>
<tbody>
<tr><td>SQL</td><td>bạn tự viết, mỗi phương thức một chuỗi</td><td>tự sinh; JPQL chỉ cho truy vấn</td></tr>
<tr><td>dòng → đối tượng</td><td>tự viết <code>map(rs)</code></td><td>tự động (annotation)</td></tr>
<tr><td>UPDATE</td><td>liệt kê mọi cột</td><td>chỉ các cột đã đổi</td></tr>
<tr><td>quan hệ</td><td><code>INNER JOIN</code> + tự dựng <code>new HumanType(…)</code></td><td><code>h.getType()</code> — nhưng coi chừng N+1, dùng <code>JOIN FETCH</code></td></tr>
<tr><td>giao dịch</td><td>mặc định auto-commit</td><td>bắt buộc với mọi lần ghi, tự viết tay</td></tr>
<tr><td>độ dài</td><td>99 dòng</td><td>100 dòng cho cùng DAO Human viết bằng JPA (bài 7 của 7.3): SQL biến mất, code giao dịch xuất hiện</td></tr>
</tbody>
</table>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): phần code giao dịch chính là thứ Spring xoá đi. <code>spring-boot-starter-data-jpa</code> mang theo Hibernate (provider) và Spring Data; bạn viết một <strong>interface</strong> và Spring sinh ra DAO, kể cả truy vấn suy ra từ tên phương thức; <code>@Transactional</code> trên một phương thức service tự begin trước và commit sau nó (rollback khi gặp <code>RuntimeException</code>):
<pre><code class="language-java">public interface ProductRepository extends JpaRepository&lt;Product, Integer&gt; {   // save, findById, findAll, deleteById… có sẵn
    List&lt;Product&gt; findByNameContaining(String keyword);                        // suy từ tên: WHERE name LIKE %keyword%
    @Query("SELECT p FROM Product p WHERE p.price &lt;= :max ORDER BY p.price")    // JPQL của riêng bạn khi cần
    List&lt;Product&gt; findCheaperThan(@Param("max") BigDecimal max);
}

@Service
public class ProductService {
    private final ProductRepository repo;
    public ProductService(ProductRepository repo) { this.repo = repo; }
    @Transactional                                       // = tx.begin() … tx.commit() / rollback()
    public void reprice(int id, BigDecimal price) {
        repo.findById(id).orElseThrow().setPrice(price); // được quản lý ⇒ UPDATE lúc commit, không cần save()
    }
}</code></pre>
Xem SQL bằng <code>spring.jpa.show-sql=true</code>. Spring Boot còn mặc định bật "Open EntityManager in View" (<code>spring.jpa.open-in-view</code>), giữ EntityManager mở trong lúc vẽ view — tiện, nhưng giấu mất các truy vấn N+1; nhiều nhóm đặt nó thành <code>false</code> và dùng <code>JOIN FETCH</code> như trong bài này.</div>`],
      [19, 'Summary',
        `<p class="y-chinh">🎯 The deck covered: the Java Persistence API, entity class basics, the JPA architecture, obtaining a database connection, configuring JPA "with Hibernate", and a JPA web application demo.</p>
<table>
<thead><tr><th>Summary line</th><th>Slides</th><th>Can you…</th></tr></thead>
<tbody>
<tr><td>Java Persistence API</td><td>1–5</td><td>say what a provider is, name two, and say when not to use JPA?</td></tr>
<tr><td>Entity class basics</td><td>6–8</td><td>write an entity the spec accepts; map @ManyToOne / @OneToMany with the right owning side; explain and fix an N+1?</td></tr>
<tr><td>JPA Architecture</td><td>9–13</td><td>say which object exists once per app and which once per request; recognise NetBeans-generated code?</td></tr>
<tr><td>Obtaining a connection</td><td>14</td><td>build the factory in a listener and close every EntityManager?</td></tr>
<tr><td>Configure JPA</td><td>15–16</td><td>convert a javax persistence.xml to jakarta and spot the URL / password / logging problems?</td></tr>
<tr><td>Web application demo</td><td>17–18</td><td>write a DAO whose writes use begin / commit / isActive-rollback, and read its SQL in the log?</td></tr>
</tbody>
</table>
<p>➕ Beyond the deck, this lesson measured: SQL generated for CRUD and paging, the shared cache, N+1 and JOIN FETCH, LAZY ignored without weaving, DISTINCT with collection fetch joins, loading after close, the owning side, and two bugs in slide 17's code. Next: the 🧪 practice 7.3 (map Lab/Device, read entity errors, JPQL mistakes and JPQL injection, a forgotten transaction, an N+1 page, the owning side, and lesson 5.B's DAO rewritten in JPA), then the Chapter 7 quiz.</p>`,
        `<p class="y-chinh">🎯 Deck đã học: Java Persistence API, cơ bản về lớp entity, kiến trúc JPA, lấy kết nối CSDL, cấu hình JPA "với Hibernate", và một demo ứng dụng web JPA.</p>
<table>
<thead><tr><th>Dòng tóm tắt</th><th>Slide</th><th>Bạn đã làm được…</th></tr></thead>
<tbody>
<tr><td>Java Persistence API</td><td>1–5</td><td>nói được provider là gì, kể tên hai cái, và khi nào không nên dùng JPA?</td></tr>
<tr><td>Cơ bản về entity</td><td>6–8</td><td>viết entity đúng đặc tả; ánh xạ @ManyToOne / @OneToMany đúng phía sở hữu; giải thích và sửa một lỗi N+1?</td></tr>
<tr><td>Kiến trúc JPA</td><td>9–13</td><td>nói đối tượng nào có một cái cho cả app, cái nào mỗi request một cái; nhận ra code do NetBeans sinh?</td></tr>
<tr><td>Lấy kết nối</td><td>14</td><td>dựng factory trong một listener và đóng mọi EntityManager?</td></tr>
<tr><td>Cấu hình JPA</td><td>15–16</td><td>đổi persistence.xml kiểu javax sang jakarta và chỉ ra vấn đề URL / mật khẩu / log?</td></tr>
<tr><td>Demo app web</td><td>17–18</td><td>viết DAO mà mọi lần ghi có begin / commit / isActive-rollback, và đọc được SQL của nó trong log?</td></tr>
</tbody>
</table>
<p>➕ Ngoài deck, bài này đã đo: SQL sinh ra cho CRUD và phân trang, cache dùng chung, N+1 và JOIN FETCH, LAZY bị bỏ qua khi không weaving, DISTINCT với fetch join trên collection, nạp sau khi đóng, owning side, và hai lỗi trong code slide 17. Tiếp theo: bài 🧪 thực hành 7.3 (ánh xạ Lab/Device, đọc lỗi entity, lỗi JPQL và JPQL injection, quên giao dịch, một trang N+1, owning side, và DAO của bài 5.B viết lại bằng JPA), rồi tới quiz Chương 7.</p>`],
    ]),
    bi(`<h2>📌 What to take away from slides 1–19</h2>
<ul>
<li>JPA = a specification (<code>jakarta.persistence</code>); EclipseLink and Hibernate = providers. Underneath it is still JDBC and SQL.</li>
<li>Entity: <code>@Entity</code>, <code>@Id</code>, a public/protected no-arg constructor, not final; <code>@Table</code>/<code>@Column</code> when names differ; <code>BigDecimal</code> for <code>decimal</code>.</li>
<li>One <code>EntityManagerFactory</code> per app (listener), one <code>EntityManager</code> per request, always closed.</li>
<li>Writes need <code>begin()</code> … <code>commit()</code>; reads do not. Roll back only <code>if (tx.isActive())</code>; never swallow the exception.</li>
<li>Managed objects are tracked: change a field + commit = UPDATE of the changed columns only.</li>
<li>Defaults: <code>@ManyToOne</code>/<code>@OneToOne</code> EAGER, <code>@OneToMany</code>/<code>@ManyToMany</code> LAZY; LAZY is only a hint. A list with a related field ⇒ <code>JOIN FETCH</code> (+ <code>DISTINCT</code> for collections) or you get N+1.</li>
<li>The owning side (with <code>@JoinColumn</code>) is what JPA writes; <code>mappedBy</code> names the field on the other class.</li>
<li>persistence.xml (in <code>WEB-INF/classes/META-INF</code>): jakarta names, list your classes, no password in the file, log SQL while developing.</li>
</ul>`,
    `<h2>📌 Cần mang theo gì từ slide 1–19</h2>
<ul>
<li>JPA = một đặc tả (<code>jakarta.persistence</code>); EclipseLink và Hibernate = provider. Bên dưới vẫn là JDBC và SQL.</li>
<li>Entity: <code>@Entity</code>, <code>@Id</code>, constructor không tham số public/protected, không final; <code>@Table</code>/<code>@Column</code> khi tên khác nhau; <code>BigDecimal</code> cho <code>decimal</code>.</li>
<li>Một <code>EntityManagerFactory</code> cho cả app (trong listener), mỗi request một <code>EntityManager</code>, luôn đóng.</li>
<li>Ghi cần <code>begin()</code> … <code>commit()</code>; đọc thì không. Chỉ rollback <code>if (tx.isActive())</code>; không bao giờ nuốt exception.</li>
<li>Đối tượng managed được theo dõi: đổi một trường + commit = UPDATE chỉ các cột đã đổi.</li>
<li>Mặc định: <code>@ManyToOne</code>/<code>@OneToOne</code> EAGER, <code>@OneToMany</code>/<code>@ManyToMany</code> LAZY; LAZY chỉ là gợi ý. Danh sách có hiện trường của bảng liên quan ⇒ <code>JOIN FETCH</code> (+ <code>DISTINCT</code> với collection), nếu không sẽ dính N+1.</li>
<li>Phía sở hữu (có <code>@JoinColumn</code>) là thứ JPA ghi xuống; <code>mappedBy</code> ghi tên trường ở lớp bên kia.</li>
<li>persistence.xml (nằm ở <code>WEB-INF/classes/META-INF</code>): tên jakarta, liệt kê các lớp, không để mật khẩu trong file, bật log SQL khi phát triển.</li>
</ul>`),
    books([
      ['williams', 'Ch.19 "Introducing Java Persistence API and Hibernate ORM", Ch.20 "Mapping Entities to Tables with JPA Annotations" (entities, persistence unit), Ch.21 "Using JPA in Spring Framework Repositories" (transactions in Spring)', 'Ch.19 "Introducing Java Persistence API and Hibernate ORM", Ch.20 "Mapping Entities to Tables with JPA Annotations" (entity, persistence unit), Ch.21 "Using JPA in Spring Framework Repositories" (giao dịch trong Spring)'],
    ]),
  ].join('\n'),
};

/* ───────── 7.3 — 🧪 Practice + 🗂 Glossary + 📌 Summary · JPA: entities, JPQL, transactions, N+1, owning side, a JPA DAO ───────── */
const L_on_ch7 = {
  title: '7.3 — 🧪 Practice + 🗂 Glossary + 📌 Summary · JPA: entities, JPQL, transactions, N+1, owning side, a JPA DAO|||7.3 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · JPA: entity, JPQL, giao dịch, N+1, owning side, DAO JPA',
  slug: 'prj301-on-ch7',
  type: 'VIDEO',
  description: '7 bài tập Chương 7 có lời giải chạy thật trên Tomcat 10.1 + EclipseLink 4 + SQL Server, đọc kèm log SQL thật: ánh xạ hai bảng Lab/Device thành entity, đọc bốn lỗi entity thường gặp, sửa năm câu JPQL viết như SQL và chặn một JPQL injection thật, giao dịch bị quên và khối catch che lỗi của slide 17, một trang danh sách dính N+1 rồi sửa bằng JOIN FETCH có phân trang, quan hệ lưu với khoá ngoại NULL vì đặt sai phía, và viết lại DAO JDBC của bài 5.B bằng JPA mà không đổi controller hay JSP nào; 18 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.3 · Practice &amp; review</span>
<h2>JPA for real — seven exercises, every answer checked in the SQL log</h2>
<p class="lead">Lesson 7.A showed what JPA writes for you. These seven exercises make you predict it first: what error a broken entity gives, what SQL a JPQL query becomes, what is (not) saved without a transaction, how many SELECTs a list page sends, which side of a relationship JPA writes. Every solution ran on Tomcat 10.1 with EclipseLink 4.0.9 against a real SQL Server; the real responses and the SQL log are under each exercise. Close the answer, write yours, then compare.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Slides of 7.A</th></tr></thead>
<tbody>
<tr><td>1</td><td>map two tables to entities (keys, NOT NULL, foreign key)</td><td>6–8, 16</td></tr>
<tr><td>2</td><td>read the four classic entity errors</td><td>6–8, 15</td></tr>
<tr><td>3</td><td>JPQL is not SQL; JPQL injection</td><td>11, 18</td></tr>
<tr><td>4</td><td>the forgotten transaction, the swallowed error</td><td>14, 17</td></tr>
<tr><td>5</td><td>a list page with N+1, fixed with JOIN FETCH and paging</td><td>8, 18</td></tr>
<tr><td>6</td><td>the owning side: why typeid became NULL</td><td>8</td></tr>
<tr><td>7</td><td>lesson 5.B's JDBC DAO rewritten with JPA (PE shape)</td><td>18</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Bài 7.3 · Thực hành &amp; ôn tập</span>
<h2>JPA thật sự — bảy bài tập, đáp án nào cũng soát bằng log SQL</h2>
<p class="lead">Bài 7.A cho thấy JPA viết gì giúp bạn. Bảy bài tập này bắt bạn đoán trước: một entity hỏng báo lỗi gì, một câu JPQL thành SQL nào, cái gì (không) được lưu khi thiếu giao dịch, một trang danh sách gửi bao nhiêu câu SELECT, JPA ghi phía nào của một quan hệ. Lời giải nào cũng đã chạy trên Tomcat 10.1 với EclipseLink 4.0.9 và một SQL Server thật; response thật và log SQL nằm dưới mỗi bài. Che đáp án, tự viết, rồi so.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Slide của 7.A</th></tr></thead>
<tbody>
<tr><td>1</td><td>ánh xạ hai bảng thành entity (khoá, NOT NULL, khoá ngoại)</td><td>6–8, 16</td></tr>
<tr><td>2</td><td>đọc bốn lỗi entity kinh điển</td><td>6–8, 15</td></tr>
<tr><td>3</td><td>JPQL không phải SQL; JPQL injection</td><td>11, 18</td></tr>
<tr><td>4</td><td>giao dịch bị quên, lỗi bị nuốt</td><td>14, 17</td></tr>
<tr><td>5</td><td>trang danh sách dính N+1, sửa bằng JOIN FETCH và phân trang</td><td>8, 18</td></tr>
<tr><td>6</td><td>owning side: vì sao typeid thành NULL</td><td>8</td></tr>
<tr><td>7</td><td>DAO JDBC của bài 5.B viết lại bằng JPA (dáng đề PE)</td><td>18</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — Map Lab and Device to entities (~15 min)</h3>
<p>Lesson 6.A's lab-equipment app has two tables. Write the entity classes <code>Lab</code> and <code>Device</code> so that a device knows its lab and a lab knows its devices. Decide for each column: <code>@GeneratedValue</code> or not? primitive or wrapper type? which side gets <code>@JoinColumn</code>, which gets <code>mappedBy</code>?</p>
<p class="ghi-chu">📄 <code>ch7-thiet-bi/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE Lab (
    labid   INT PRIMARY KEY,
    labname NVARCHAR(50) NOT NULL
);
CREATE TABLE Device (
    deviceid INT IDENTITY(1,1) PRIMARY KEY,
    code     VARCHAR(10)   NOT NULL UNIQUE,
    name     NVARCHAR(100) NOT NULL,
    quantity INT           NOT NULL CHECK (quantity BETWEEN 0 AND 999),
    labid    INT           NOT NULL REFERENCES Lab(labid)
);</code></pre>
<p class="dap-an">✅ A solution, as the diagram and the code:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/16d865d5a571fcbb89d21b7c2346e30274fedd71.svg" alt="Tables on the left of each pair, entities on the right; the FK labid becomes the field lab" loading="lazy" /><p class="chu-thich">🧩 Tables on the left of each pair, entities on the right; the FK labid becomes the field lab</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 1: tables Lab / Device (lesson 6.A) and the two entities
left to right direction
class "Lab (table)" as LT &lt;&lt;table&gt;&gt; {
  labid : int PK
  labname : nvarchar(50) NOT NULL
}
class "Device (table)" as DT &lt;&lt;table&gt;&gt; {
  deviceid : int IDENTITY PK
  code : varchar(10) NOT NULL UNIQUE
  name : nvarchar(100) NOT NULL
  quantity : int NOT NULL
  labid : int NOT NULL FK
}
class Lab &lt;&lt;@Entity&gt;&gt; {
  - id : Integer  &lt;&lt;@Id&gt;&gt;
  - name : String
  - devices : List&lt;Device&gt;  &lt;&lt;@OneToMany(mappedBy="lab")&gt;&gt;
}
class Device &lt;&lt;@Entity&gt;&gt; {
  - id : Integer  &lt;&lt;@Id @GeneratedValue(IDENTITY)&gt;&gt;
  - code : String
  - name : String
  - quantity : int
  - lab : Lab  &lt;&lt;@ManyToOne(optional=false) @JoinColumn("labid")&gt;&gt;
}
DT "*" -- "1" LT : labid
Device "*" -- "1" Lab
LT .. Lab
DT .. Device
@enduml</code></pre></details>
<p class="ghi-chu">📄 <code>ch7-thiet-bi/src/main/java/model/Lab.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Lab")
public class Lab {
    @Id
    @Column(name = "labid")
    private Integer id;                                  // no IDENTITY in the table ⇒ no @GeneratedValue
    @Column(name = "labname", nullable = false, length = 50)
    private String name;

    @OneToMany(mappedBy = "lab")                         // inverse side: Device.lab owns the FK
    private List&lt;Device&gt; devices = new ArrayList&lt;&gt;();</code></pre>
<p class="ghi-chu">📄 <code>ch7-thiet-bi/src/main/java/model/Device.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Device")
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // deviceid INT IDENTITY(1,1)
    @Column(name = "deviceid")
    private Integer id;
    @Column(name = "code", nullable = false, unique = true, length = 10)
    private String code;
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    @Column(name = "quantity", nullable = false)
    private int quantity;                                // NOT NULL ⇒ a primitive int is safe

    @ManyToOne(optional = false)                         // owning side; labid NOT NULL ⇒ optional = false
    @JoinColumn(name = "labid", nullable = false)
    private Lab lab;</code></pre>
<p>Why: <code>labid</code> has no IDENTITY ⇒ no <code>@GeneratedValue</code> (you assign 1, 2, 3); <code>deviceid</code> is IDENTITY ⇒ <code>GenerationType.IDENTITY</code>. <code>quantity</code> is NOT NULL ⇒ <code>int</code> is safe (a nullable column needs <code>Integer</code>, or NULL would crash). The table with the foreign key (<code>Device.labid</code>) is the owning side ⇒ <code>@ManyToOne @JoinColumn(name = "labid")</code>; <code>labid NOT NULL</code> ⇒ <code>optional = false</code>. <code>Lab</code> only mirrors it: <code>@OneToMany(mappedBy = "lab")</code>, the name of the <em>field</em> in <code>Device</code>. Both classes are listed in persistence.xml. One query to prove it works (exercise 5 explains the SQL):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-thiet-bi/devices?fix=1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 514

ARD-01 | Arduino Uno R3 | 15 | Lab IoT
CAB-01 | Bộ bấm cáp mạng | 12 | Lab Mạng
ESP-01 | Kit ESP32 | 20 | Lab IoT
MUL-01 | Đồng hồ vạn năng | 10 | Lab Điện tử
OSC-01 | Máy hiện sóng Rigol | 3 | Lab Điện tử
PSU-01 | Nguồn DC 0–30V | 6 | Lab Điện tử
RPI-01 | Raspberry Pi 4 | 10 | Lab IoT
RTR-01 | Router Cisco 2901 | 4 | Lab Mạng
SEN-01 | Bộ cảm biến 37 món | 5 | Lab IoT
SOL-01 | Máy hàn thiếc | 8 | Lab Điện tử
SWI-01 | Switch Cisco 2960 | 6 | Lab Mạng</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT t1.deviceid, t1.code, t1.name, t1.quantity, t1.labid, t0.labid, t0.labname FROM Lab t0, Device t1 WHERE (t0.labid = t1.labid) ORDER BY t1.code</div>
<div class="pitfall">Common slips: <code>@JoinColumn(name = "lab")</code> (the field name — it must be the <strong>column</strong> <code>labid</code>), <code>mappedBy = "labid"</code> (the column — it must be the <strong>field</strong> <code>lab</code>), and putting <code>@GeneratedValue</code> on <code>Lab.id</code> although the table has no IDENTITY (the insert then fails).</div>`,
    `<h3>🧪 Bài 1 — Ánh xạ Lab và Device thành entity (~15 phút)</h3>
<p>App thiết bị phòng lab của bài 6.A có hai bảng. Viết các lớp entity <code>Lab</code> và <code>Device</code> sao cho một thiết bị biết lab của nó và một lab biết các thiết bị của nó. Với từng cột hãy quyết định: có <code>@GeneratedValue</code> không? kiểu nguyên thuỷ hay lớp bọc? phía nào có <code>@JoinColumn</code>, phía nào có <code>mappedBy</code>?</p>
<p class="ghi-chu">📄 <code>ch7-thiet-bi/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE Lab (
    labid   INT PRIMARY KEY,
    labname NVARCHAR(50) NOT NULL
);
CREATE TABLE Device (
    deviceid INT IDENTITY(1,1) PRIMARY KEY,
    code     VARCHAR(10)   NOT NULL UNIQUE,
    name     NVARCHAR(100) NOT NULL,
    quantity INT           NOT NULL CHECK (quantity BETWEEN 0 AND 999),
    labid    INT           NOT NULL REFERENCES Lab(labid)
);</code></pre>
<p class="dap-an">✅ Một lời giải, dạng sơ đồ và dạng code:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/16d865d5a571fcbb89d21b7c2346e30274fedd71.svg" alt="Mỗi cặp: bảng bên trái, entity bên phải; khoá ngoại labid trở thành trường lab" loading="lazy" /><p class="chu-thich">🧩 Mỗi cặp: bảng bên trái, entity bên phải; khoá ngoại labid trở thành trường lab</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 1: tables Lab / Device (lesson 6.A) and the two entities
left to right direction
class "Lab (table)" as LT &lt;&lt;table&gt;&gt; {
  labid : int PK
  labname : nvarchar(50) NOT NULL
}
class "Device (table)" as DT &lt;&lt;table&gt;&gt; {
  deviceid : int IDENTITY PK
  code : varchar(10) NOT NULL UNIQUE
  name : nvarchar(100) NOT NULL
  quantity : int NOT NULL
  labid : int NOT NULL FK
}
class Lab &lt;&lt;@Entity&gt;&gt; {
  - id : Integer  &lt;&lt;@Id&gt;&gt;
  - name : String
  - devices : List&lt;Device&gt;  &lt;&lt;@OneToMany(mappedBy="lab")&gt;&gt;
}
class Device &lt;&lt;@Entity&gt;&gt; {
  - id : Integer  &lt;&lt;@Id @GeneratedValue(IDENTITY)&gt;&gt;
  - code : String
  - name : String
  - quantity : int
  - lab : Lab  &lt;&lt;@ManyToOne(optional=false) @JoinColumn("labid")&gt;&gt;
}
DT "*" -- "1" LT : labid
Device "*" -- "1" Lab
LT .. Lab
DT .. Device
@enduml</code></pre></details>
<p class="ghi-chu">📄 <code>ch7-thiet-bi/src/main/java/model/Lab.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Lab")
public class Lab {
    @Id
    @Column(name = "labid")
    private Integer id;                                  // bảng không có IDENTITY ⇒ không @GeneratedValue
    @Column(name = "labname", nullable = false, length = 50)
    private String name;

    @OneToMany(mappedBy = "lab")                         // phía nghịch: Device.lab giữ khoá ngoại
    private List&lt;Device&gt; devices = new ArrayList&lt;&gt;();</code></pre>
<p class="ghi-chu">📄 <code>ch7-thiet-bi/src/main/java/model/Device.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Device")
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // deviceid INT IDENTITY(1,1)
    @Column(name = "deviceid")
    private Integer id;
    @Column(name = "code", nullable = false, unique = true, length = 10)
    private String code;
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    @Column(name = "quantity", nullable = false)
    private int quantity;                                // NOT NULL ⇒ dùng int nguyên thuỷ an toàn

    @ManyToOne(optional = false)                         // phía sở hữu; labid NOT NULL ⇒ optional = false
    @JoinColumn(name = "labid", nullable = false)
    private Lab lab;</code></pre>
<p>Vì sao: <code>labid</code> không có IDENTITY ⇒ không <code>@GeneratedValue</code> (bạn tự gán 1, 2, 3); <code>deviceid</code> là IDENTITY ⇒ <code>GenerationType.IDENTITY</code>. <code>quantity</code> NOT NULL ⇒ dùng <code>int</code> an toàn (cột cho NULL thì cần <code>Integer</code>, không thì NULL làm sập). Bảng có khoá ngoại (<code>Device.labid</code>) là phía sở hữu ⇒ <code>@ManyToOne @JoinColumn(name = "labid")</code>; <code>labid NOT NULL</code> ⇒ <code>optional = false</code>. <code>Lab</code> chỉ phản chiếu lại: <code>@OneToMany(mappedBy = "lab")</code>, tên <em>trường</em> trong <code>Device</code>. Cả hai lớp được khai trong persistence.xml. Một truy vấn để chứng minh nó chạy (bài 5 giải thích SQL):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-thiet-bi/devices?fix=1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 514

ARD-01 | Arduino Uno R3 | 15 | Lab IoT
CAB-01 | Bộ bấm cáp mạng | 12 | Lab Mạng
ESP-01 | Kit ESP32 | 20 | Lab IoT
MUL-01 | Đồng hồ vạn năng | 10 | Lab Điện tử
OSC-01 | Máy hiện sóng Rigol | 3 | Lab Điện tử
PSU-01 | Nguồn DC 0–30V | 6 | Lab Điện tử
RPI-01 | Raspberry Pi 4 | 10 | Lab IoT
RTR-01 | Router Cisco 2901 | 4 | Lab Mạng
SEN-01 | Bộ cảm biến 37 món | 5 | Lab IoT
SOL-01 | Máy hàn thiếc | 8 | Lab Điện tử
SWI-01 | Switch Cisco 2960 | 6 | Lab Mạng</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT t1.deviceid, t1.code, t1.name, t1.quantity, t1.labid, t0.labid, t0.labname FROM Lab t0, Device t1 WHERE (t0.labid = t1.labid) ORDER BY t1.code</div>
<div class="pitfall">Lỗi hay gặp: <code>@JoinColumn(name = "lab")</code> (tên trường — phải là <strong>cột</strong> <code>labid</code>), <code>mappedBy = "labid"</code> (tên cột — phải là <strong>trường</strong> <code>lab</code>), và đặt <code>@GeneratedValue</code> cho <code>Lab.id</code> trong khi bảng không có IDENTITY (khi đó thêm mới sẽ hỏng).</div>`),
    bi(`<h3>🧪 Exercise 2 — Read the error, find the broken entity (~15 min)</h3>
<p>Four entity classes map the same small <code>Product</code> table, each with one mistake; each sits in its own persistence unit so one error cannot hide another. For every error below, name the mistake <em>before</em> opening the class. The working one first:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-loi-entity/check?pu=ok HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 60

persistence unit "ok": SELECT e FROM ProductOk e
OK, 2 rows</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-loi-entity/check?pu=no-ctor HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 369

persistence unit "no-ctor": SELECT e FROM NoCtor e
→ jakarta.persistence.PersistenceException
  Exception Description: Deployment of PersistenceUnit [no-ctor] failed.
    Close all factories for this PersistenceUnit.
  Exception Description: The instance creation method [model.NoCtor.&lt;Default Constructor&gt;], with no parameters, does not exist, or is not accessible.</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-loi-entity/check?pu=no-id HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 660

persistence unit "no-id": SELECT e FROM NoId e
→ org.eclipse.persistence.exceptions.PersistenceUnitLoadingException
  Exception Description: An exception was thrown while searching for persistence archives with ClassLoader: ParallelWebappClassLoader
  Exception Description: Predeployment of PersistenceUnit [no-id] failed.
  Exception Description: Entity class [class model.NoId] has no primary key specified.
    It should define either an @Id, @EmbeddedId or an @IdClass.
    If you have defined PK using any of these annotations then make sure that you do not have mixed access-type (both fields and properties annotated) in your entity class hierarchy.</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-loi-entity/check?pu=wrong-column HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 212

persistence unit "wrong-column": SELECT e FROM WrongColumn e
→ jakarta.persistence.PersistenceException
  Internal Exception: com.microsoft.sqlserver.jdbc.SQLServerException: Invalid column name 'productName'.</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-loi-entity/check?pu=unlisted HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 223

persistence unit "unlisted": SELECT e FROM Unlisted e
→ java.lang.IllegalArgumentException
  Exception Description: Problem compiling [SELECT e FROM Unlisted e].
  [14, 22] The abstract schema type 'Unlisted' is unknown.</code></pre>
<p class="dap-an">✅ (1) "The instance creation method … with no parameters, does not exist" ⇒ no no-arg constructor (the class had only <code>NoCtor(String name)</code>); add <code>public NoCtor() { }</code>. (2) "has no primary key specified" ⇒ <code>@Id</code> forgotten. (3) "Invalid column name 'productName'" comes from <strong>SQL Server</strong>, not JPA: the mapping is accepted, the SELECT fails — <code>@Column(name = "productName")</code> but the column is <code>name</code>. (4) "The abstract schema type 'Unlisted' is unknown" ⇒ the class is fine but not listed in its persistence unit (with <code>exclude-unlisted-classes = true</code>). The classes:</p>
<p class="ghi-chu">📄 <code>ch7-loi-entity/src/main/java/model/NoCtor.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Product")
public class NoCtor {
    @Id
    private Integer id;
    private String name;
    private BigDecimal price;

    public NoCtor(String name) { this.name = name; }      // the only constructor takes a parameter
}</code></pre>
<p class="ghi-chu">📄 <code>ch7-loi-entity/src/main/java/model/NoId.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Product")
public class NoId {
    private Integer id;                                   // forgot @Id
    private String name;
    private BigDecimal price;

    public NoId() { }
}</code></pre>
<p class="ghi-chu">📄 <code>ch7-loi-entity/src/main/java/model/WrongColumn.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Product")
public class WrongColumn {
    @Id
    private Integer id;
    @Column(name = "productName")                         // the table's column is called name
    private String name;
    private BigDecimal price;

    public WrongColumn() { }
}</code></pre>
<div class="pitfall">Where an error appears tells you where to look: (1) and (2) fail when the persistence unit is <strong>deployed</strong> — the first time you create an EntityManager, for every page; (3) fails only when that SQL runs; (4) fails when the JPQL is <strong>compiled</strong>. Read the "Exception Description" line, not the 60 lines of stack trace.</div>`,
    `<h3>🧪 Bài 2 — Đọc lỗi, tìm entity hỏng (~15 phút)</h3>
<p>Bốn lớp entity cùng ánh xạ một bảng <code>Product</code> nhỏ, mỗi lớp sai một chỗ; mỗi lớp nằm trong persistence unit riêng để lỗi này không che lỗi kia. Với mỗi lỗi dưới đây, gọi tên chỗ sai <em>trước khi</em> mở lớp. Lớp chạy đúng trước:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-loi-entity/check?pu=ok HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 60

persistence unit "ok": SELECT e FROM ProductOk e
OK, 2 rows</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-loi-entity/check?pu=no-ctor HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 369

persistence unit "no-ctor": SELECT e FROM NoCtor e
→ jakarta.persistence.PersistenceException
  Exception Description: Deployment of PersistenceUnit [no-ctor] failed.
    Close all factories for this PersistenceUnit.
  Exception Description: The instance creation method [model.NoCtor.&lt;Default Constructor&gt;], with no parameters, does not exist, or is not accessible.</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-loi-entity/check?pu=no-id HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 660

persistence unit "no-id": SELECT e FROM NoId e
→ org.eclipse.persistence.exceptions.PersistenceUnitLoadingException
  Exception Description: An exception was thrown while searching for persistence archives with ClassLoader: ParallelWebappClassLoader
  Exception Description: Predeployment of PersistenceUnit [no-id] failed.
  Exception Description: Entity class [class model.NoId] has no primary key specified.
    It should define either an @Id, @EmbeddedId or an @IdClass.
    If you have defined PK using any of these annotations then make sure that you do not have mixed access-type (both fields and properties annotated) in your entity class hierarchy.</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-loi-entity/check?pu=wrong-column HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 212

persistence unit "wrong-column": SELECT e FROM WrongColumn e
→ jakarta.persistence.PersistenceException
  Internal Exception: com.microsoft.sqlserver.jdbc.SQLServerException: Invalid column name 'productName'.</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-loi-entity/check?pu=unlisted HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 223

persistence unit "unlisted": SELECT e FROM Unlisted e
→ java.lang.IllegalArgumentException
  Exception Description: Problem compiling [SELECT e FROM Unlisted e].
  [14, 22] The abstract schema type 'Unlisted' is unknown.</code></pre>
<p class="dap-an">✅ (1) "The instance creation method … with no parameters, does not exist" ⇒ thiếu constructor không tham số (lớp chỉ có <code>NoCtor(String name)</code>); thêm <code>public NoCtor() { }</code>. (2) "has no primary key specified" ⇒ quên <code>@Id</code>. (3) "Invalid column name 'productName'" đến từ <strong>SQL Server</strong>, không phải JPA: ánh xạ được chấp nhận, câu SELECT thì hỏng — <code>@Column(name = "productName")</code> nhưng cột tên là <code>name</code>. (4) "The abstract schema type 'Unlisted' is unknown" ⇒ lớp không sai nhưng chưa được khai trong persistence unit của nó (khi <code>exclude-unlisted-classes = true</code>). Các lớp:</p>
<p class="ghi-chu">📄 <code>ch7-loi-entity/src/main/java/model/NoCtor.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Product")
public class NoCtor {
    @Id
    private Integer id;
    private String name;
    private BigDecimal price;

    public NoCtor(String name) { this.name = name; }      // constructor duy nhất có tham số
}</code></pre>
<p class="ghi-chu">📄 <code>ch7-loi-entity/src/main/java/model/NoId.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Product")
public class NoId {
    private Integer id;                                   // quên @Id
    private String name;
    private BigDecimal price;

    public NoId() { }
}</code></pre>
<p class="ghi-chu">📄 <code>ch7-loi-entity/src/main/java/model/WrongColumn.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Product")
public class WrongColumn {
    @Id
    private Integer id;
    @Column(name = "productName")                         // cột trong bảng tên là name
    private String name;
    private BigDecimal price;

    public WrongColumn() { }
}</code></pre>
<div class="pitfall">Lỗi hiện ra ở đâu cho biết phải tìm ở đâu: (1) và (2) hỏng lúc persistence unit được <strong>deploy</strong> — lần đầu tạo EntityManager, ở mọi trang; (3) chỉ hỏng khi câu SQL đó chạy; (4) hỏng lúc câu JPQL được <strong>biên dịch</strong>. Đọc dòng "Exception Description", đừng đọc 60 dòng stack trace.</div>`),
    bi(`<h3>🧪 Exercise 3 — JPQL is not SQL; JPQL injection (~20 min)</h3>
<p>Table <code>Accounts(username, password, full_name, role)</code> is mapped to the entity <code>Account</code> (field <code>fullName</code>). A classmate writes queries the SQL way. Predict which ones fail and why, then fix them:</p>
<p class="ghi-chu">📄 <code>ch7-jpql/src/main/java/model/Account.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Entity                                                   // entity name = Account (the CLASS name)
@Table(name = "Accounts")                                 // table name = Accounts
public class Account {
    @Id
    private String username;
    private String password;
    @Column(name = "full_name")                           // column full_name ⇒ field fullName
    private String fullName;
    private String role;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/jpql?q=SELECT+*+FROM+Accounts HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 259

JPQL: SELECT * FROM Accounts
→ java.lang.IllegalArgumentException
  [22, 22] A select statement must have a FROM clause.
  [7, 7] The left expression is missing from the arithmetic expression.
  [9, 22] The right expression is not an arithmetic expression.</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/jpql?q=SELECT+a+FROM+Accounts+a HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 129

JPQL: SELECT a FROM Accounts a
→ java.lang.IllegalArgumentException
  [14, 22] The abstract schema type 'Accounts' is unknown.</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/jpql?q=SELECT+a+FROM+Account+a+WHERE+a.full_name+LIKE+%27%25C%C6%B0%E1%BB%9Dng%25%27 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 187

JPQL: SELECT a FROM Account a WHERE a.full_name LIKE '%Cường%'
→ java.lang.IllegalArgumentException
  [30, 41] The state field path 'a.full_name' cannot be resolved to a valid type.</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/jpql?q=select+a+from+account+a HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 127

JPQL: select a from account a
→ java.lang.IllegalArgumentException
  [14, 21] The abstract schema type 'account' is unknown.</code></pre>
<p class="dap-an">✅ JPQL talks about <strong>classes and fields</strong>, never tables and columns. <code>SELECT *</code> does not exist — select the identification variable <code>a</code>. <code>Accounts</code> is the table — the entity is <code>Account</code>. <code>a.full_name</code> is the column — the field is <code>a.fullName</code>. Keywords are case-insensitive (<code>select</code> works), entity names are not (<code>account</code> fails). Fixed, and a report query whose rows are <code>Object[]</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/jpql?q=select+a+from+Account+a+where+a.fullName+like+%27%25C%C6%B0%E1%BB%9Dng%25%27 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 99

JPQL: select a from Account a where a.fullName like '%Cường%'
  Account cuong / Hoàng Cường</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT USERNAME, full_name, PASSWORD, ROLE FROM Accounts WHERE full_name LIKE ?<br>
	bind =&gt; [%Cường%]</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/jpql?q=SELECT+a.role%2C+COUNT%28a%29+FROM+Account+a+GROUP+BY+a.role+ORDER+BY+a.role HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 120

JPQL: SELECT a.role, COUNT(a) FROM Account a GROUP BY a.role ORDER BY a.role
  [ADMIN, 1]
  [STUDENT, 2]
  [TEACHER, 1]</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT ROLE, COUNT(USERNAME) FROM Accounts GROUP BY ROLE ORDER BY ROLE</div>
<p>Now the login. This version glues the input into the JPQL text. Try username and password <code>x' OR 'a'='a</code>:</p>
<p class="ghi-chu">📄 <code>ch7-jpql/src/main/java/controller/JpqlServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">String jpql = "SELECT a FROM Account a WHERE a.username = '" + u + "' AND a.password = '" + p + "'";
found = em.createQuery(jpql, Account.class).getResultList();     // input glued INTO the query text</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/login?u=cuong&amp;p=c123456 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 38

Logged in as cuong (1 row(s) matched)</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT USERNAME, full_name, PASSWORD, ROLE FROM Accounts WHERE ((USERNAME = ?) AND (PASSWORD = ?))<br>
	bind =&gt; [cuong, c123456]</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/login?u=x%27+OR+%27a%27%3D%27a&amp;p=x%27+OR+%27a%27%3D%27a HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 38

Logged in as admin (4 row(s) matched)</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT USERNAME, full_name, PASSWORD, ROLE FROM Accounts WHERE (((USERNAME = ?) OR ((? = ?) AND (PASSWORD = ?))) OR (? = ?))<br>
	bind =&gt; [x, a, a, x, a, a]</div>
<p class="dap-an">✅ Logged in as admin, no password. JPA did not protect anything: the WHERE became <code>username = 'x' OR 'a'='a' AND …</code> — the log even shows EclipseLink binding the pieces as <code>?</code>, but the <em>structure</em> of the query was already changed by the input. Named parameters fix it, exactly like <code>PreparedStatement</code> in Chapter 5:</p>
<p class="ghi-chu">📄 <code>ch7-jpql/src/main/java/controller/JpqlServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">found = em.createQuery("SELECT a FROM Account a WHERE a.username = :u AND a.password = :p", Account.class)
          .setParameter("u", u)
          .setParameter("p", p)
          .getResultList();</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/login?u=x%27+OR+%27a%27%3D%27a&amp;p=x%27+OR+%27a%27%3D%27a&amp;safe=1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 13

Login failed</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT USERNAME, full_name, PASSWORD, ROLE FROM Accounts WHERE ((USERNAME = ?) AND (PASSWORD = ?))<br>
	bind =&gt; [x' OR 'a'='a, x' OR 'a'='a]</div>
<div class="pitfall">"I use JPA, so I am safe from injection" is false. Every value from a user goes through <code>setParameter</code> (<code>:name</code> or <code>?1</code>); string concatenation into JPQL is as dangerous as into SQL. (And a real app never stores plain passwords — hash them; Chapter 8's filter lesson and the Assignment come back to this.)</div>`,
    `<h3>🧪 Bài 3 — JPQL không phải SQL; JPQL injection (~20 phút)</h3>
<p>Bảng <code>Accounts(username, password, full_name, role)</code> ánh xạ vào entity <code>Account</code> (trường <code>fullName</code>). Một bạn viết truy vấn theo kiểu SQL. Đoán câu nào hỏng và vì sao, rồi sửa:</p>
<p class="ghi-chu">📄 <code>ch7-jpql/src/main/java/model/Account.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Entity                                                   // tên entity = Account (tên LỚP)
@Table(name = "Accounts")                                 // tên bảng = Accounts
public class Account {
    @Id
    private String username;
    private String password;
    @Column(name = "full_name")                           // cột full_name ⇒ trường fullName
    private String fullName;
    private String role;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/jpql?q=SELECT+*+FROM+Accounts HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 259

JPQL: SELECT * FROM Accounts
→ java.lang.IllegalArgumentException
  [22, 22] A select statement must have a FROM clause.
  [7, 7] The left expression is missing from the arithmetic expression.
  [9, 22] The right expression is not an arithmetic expression.</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/jpql?q=SELECT+a+FROM+Accounts+a HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 129

JPQL: SELECT a FROM Accounts a
→ java.lang.IllegalArgumentException
  [14, 22] The abstract schema type 'Accounts' is unknown.</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/jpql?q=SELECT+a+FROM+Account+a+WHERE+a.full_name+LIKE+%27%25C%C6%B0%E1%BB%9Dng%25%27 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 187

JPQL: SELECT a FROM Account a WHERE a.full_name LIKE '%Cường%'
→ java.lang.IllegalArgumentException
  [30, 41] The state field path 'a.full_name' cannot be resolved to a valid type.</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/jpql?q=select+a+from+account+a HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 127

JPQL: select a from account a
→ java.lang.IllegalArgumentException
  [14, 21] The abstract schema type 'account' is unknown.</code></pre>
<p class="dap-an">✅ JPQL nói về <strong>lớp và trường</strong>, không bao giờ về bảng và cột. <code>SELECT *</code> không tồn tại — chọn biến định danh <code>a</code>. <code>Accounts</code> là tên bảng — entity là <code>Account</code>. <code>a.full_name</code> là tên cột — trường là <code>a.fullName</code>. Từ khoá không phân biệt hoa thường (<code>select</code> chạy được), tên entity thì có (<code>account</code> hỏng). Bản đã sửa, và một truy vấn báo cáo có dòng kết quả là <code>Object[]</code>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/jpql?q=select+a+from+Account+a+where+a.fullName+like+%27%25C%C6%B0%E1%BB%9Dng%25%27 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 99

JPQL: select a from Account a where a.fullName like '%Cường%'
  Account cuong / Hoàng Cường</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT USERNAME, full_name, PASSWORD, ROLE FROM Accounts WHERE full_name LIKE ?<br>
	bind =&gt; [%Cường%]</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/jpql?q=SELECT+a.role%2C+COUNT%28a%29+FROM+Account+a+GROUP+BY+a.role+ORDER+BY+a.role HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 120

JPQL: SELECT a.role, COUNT(a) FROM Account a GROUP BY a.role ORDER BY a.role
  [ADMIN, 1]
  [STUDENT, 2]
  [TEACHER, 1]</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT ROLE, COUNT(USERNAME) FROM Accounts GROUP BY ROLE ORDER BY ROLE</div>
<p>Giờ tới đăng nhập. Bản này dán dữ liệu nhập vào chữ của câu JPQL. Thử tên đăng nhập và mật khẩu <code>x' OR 'a'='a</code>:</p>
<p class="ghi-chu">📄 <code>ch7-jpql/src/main/java/controller/JpqlServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">String jpql = "SELECT a FROM Account a WHERE a.username = '" + u + "' AND a.password = '" + p + "'";
found = em.createQuery(jpql, Account.class).getResultList();     // dữ liệu nhập bị dán VÀO chữ của câu truy vấn</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/login?u=cuong&amp;p=c123456 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 38

Logged in as cuong (1 row(s) matched)</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT USERNAME, full_name, PASSWORD, ROLE FROM Accounts WHERE ((USERNAME = ?) AND (PASSWORD = ?))<br>
	bind =&gt; [cuong, c123456]</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/login?u=x%27+OR+%27a%27%3D%27a&amp;p=x%27+OR+%27a%27%3D%27a HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 38

Logged in as admin (4 row(s) matched)</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT USERNAME, full_name, PASSWORD, ROLE FROM Accounts WHERE (((USERNAME = ?) OR ((? = ?) AND (PASSWORD = ?))) OR (? = ?))<br>
	bind =&gt; [x, a, a, x, a, a]</div>
<p class="dap-an">✅ Đăng nhập thành admin, không cần mật khẩu. JPA chẳng bảo vệ gì: mệnh đề WHERE thành <code>username = 'x' OR 'a'='a' AND …</code> — log còn cho thấy EclipseLink gắn từng mảnh thành <code>?</code>, nhưng <em>cấu trúc</em> câu truy vấn đã bị dữ liệu nhập làm thay đổi từ trước. Tham số có tên sửa được, y như <code>PreparedStatement</code> ở Chương 5:</p>
<p class="ghi-chu">📄 <code>ch7-jpql/src/main/java/controller/JpqlServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">found = em.createQuery("SELECT a FROM Account a WHERE a.username = :u AND a.password = :p", Account.class)
          .setParameter("u", u)
          .setParameter("p", p)
          .getResultList();</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-jpql/login?u=x%27+OR+%27a%27%3D%27a&amp;p=x%27+OR+%27a%27%3D%27a&amp;safe=1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 13

Login failed</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT USERNAME, full_name, PASSWORD, ROLE FROM Accounts WHERE ((USERNAME = ?) AND (PASSWORD = ?))<br>
	bind =&gt; [x' OR 'a'='a, x' OR 'a'='a]</div>
<div class="pitfall">"Tôi dùng JPA nên không lo injection" là sai. Mọi giá trị từ người dùng phải đi qua <code>setParameter</code> (<code>:ten</code> hoặc <code>?1</code>); nối chuỗi vào JPQL nguy hiểm y như nối vào SQL. (Và app thật không bao giờ lưu mật khẩu dạng chữ thường — hãy băm (hash) nó; bài Filter ở Chương 8 và Assignment sẽ quay lại chuyện này.)</div>`),
    bi(`<h3>🧪 Exercise 4 — The forgotten transaction and the swallowed error (~15 min)</h3>
<p>Two short questions about slide 17's code. (a) A DAO calls <code>em.persist(p)</code> and <code>em.close()</code> with no <code>begin()</code>/<code>commit()</code>. Does it throw? Is the row saved? (b) The slide's catch block runs <code>if (entityTransaction != null) entityTransaction.rollback();</code>. What happens when <code>commit()</code> itself fails?</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/tx?case=no-tx HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 111

persist() returned, no exception; em.contains(p) = true, p.getId() = null
em closed without commit
rows now: 2</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT COUNT(id) FROM PRODUCT</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/slide17?name= HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1257

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.IllegalStateException:
Exception Description: No transaction is currently active
org.eclipse.persistence.internal.jpa.transaction.EntityTransactionImpl.rollback(EntityTransactionImpl.java:182)
demo.Slide17Servlet.doGet(Slide17Servlet.java:37)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Note The full stack trace of the root cause is available in the server logs.
Apache Tomcat/10.1.61</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
[EL Fine]: sql: SELECT 1<br>
[EL Warning]: Exception [EclipseLink-4002] (Eclipse Persistence Services - 4.0.9.v202601021151-061974965b9a70b72fdcb96dae36a4d6ef5df9ce): org.eclipse.persistence.exceptions.DatabaseException<br>
Internal Exception: com.microsoft.sqlserver.jdbc.SQLServerException: Cannot insert the value NULL into column 'name', table 'PRJ301_JpaSlide17.dbo.Product'; column does not allow nulls. INSERT fails.<br>
Error Code: 515<br>
Call: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
Query: InsertObjectQuery(Product{id=0, name=null, price=211111.0, description=null})</div>
<p class="dap-an">✅ (a) No exception, no row: <code>persist</code> only makes the object managed; nothing is written without a commit (and <code>flush()</code> outside a transaction throws <code>TransactionRequiredException</code>). (b) A failed commit has already rolled back, so the second <code>rollback()</code> throws <code>IllegalStateException: No transaction is currently active</code> — that exception reaches the browser and the real cause (NULL in a NOT NULL column) is visible only in EclipseLink's own log line. The fix: check <code>isActive()</code>, and rethrow instead of printing:</p>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/java/demo/TxServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "fixed" -&gt; {                                    // slide 17 corrected: isActive() before rollback, error not swallowed
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        em.persist(new Product(0, null, 211111));    // name NULL ⇒ NOT NULL violation at commit
        tx.commit();
    } catch (RuntimeException e) {
        if (tx.isActive()) tx.rollback();
        out.println("caught " + e.getClass().getSimpleName() + "; tx.isActive() = " + tx.isActive());
        throw e;                                     // let the caller / error page see it
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/tx?case=fixed HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 255

caught RollbackException; tx.isActive() = false
→ jakarta.persistence.RollbackException
  root cause: SQLServerException: Cannot insert the value NULL into column 'name', table 'PRJ301_JpaSlide17.dbo.Product'; column does not allow nulls. INSERT fails.</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
[EL Fine]: sql: SELECT 1<br>
[EL Warning]: Exception [EclipseLink-4002] (Eclipse Persistence Services - 4.0.9.v202601021151-061974965b9a70b72fdcb96dae36a4d6ef5df9ce): org.eclipse.persistence.exceptions.DatabaseException<br>
Internal Exception: com.microsoft.sqlserver.jdbc.SQLServerException: Cannot insert the value NULL into column 'name', table 'PRJ301_JpaSlide17.dbo.Product'; column does not allow nulls. INSERT fails.<br>
Error Code: 515<br>
Call: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
Query: InsertObjectQuery(Product{id=0, name=null, price=211111.0, description=null})</div>
<div class="pitfall">The template for every JPA write in a Tomcat app: <code>begin</code> → work → <code>commit</code> inside <code>try</code>; in <code>finally</code>: <code>if (tx.isActive()) tx.rollback(); em.close();</code>. Our <code>ProductDAO</code> (lesson 7.A, slide 18) uses exactly this, so the real error of a failed insert reached the error page.</div>`,
    `<h3>🧪 Bài 4 — Giao dịch bị quên và lỗi bị nuốt (~15 phút)</h3>
<p>Hai câu hỏi ngắn về code slide 17. (a) Một DAO gọi <code>em.persist(p)</code> rồi <code>em.close()</code> mà không có <code>begin()</code>/<code>commit()</code>. Có ném lỗi không? Dòng có được lưu không? (b) Khối catch của slide chạy <code>if (entityTransaction != null) entityTransaction.rollback();</code>. Chuyện gì xảy ra khi chính <code>commit()</code> hỏng?</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/tx?case=no-tx HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 111

persist() returned, no exception; em.contains(p) = true, p.getId() = null
em closed without commit
rows now: 2</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT COUNT(id) FROM PRODUCT</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/slide17?name= HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1257

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.IllegalStateException:
Exception Description: No transaction is currently active
org.eclipse.persistence.internal.jpa.transaction.EntityTransactionImpl.rollback(EntityTransactionImpl.java:182)
demo.Slide17Servlet.doGet(Slide17Servlet.java:37)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Note The full stack trace of the root cause is available in the server logs.
Apache Tomcat/10.1.61</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
[EL Fine]: sql: SELECT 1<br>
[EL Warning]: Exception [EclipseLink-4002] (Eclipse Persistence Services - 4.0.9.v202601021151-061974965b9a70b72fdcb96dae36a4d6ef5df9ce): org.eclipse.persistence.exceptions.DatabaseException<br>
Internal Exception: com.microsoft.sqlserver.jdbc.SQLServerException: Cannot insert the value NULL into column 'name', table 'PRJ301_JpaSlide17.dbo.Product'; column does not allow nulls. INSERT fails.<br>
Error Code: 515<br>
Call: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
Query: InsertObjectQuery(Product{id=0, name=null, price=211111.0, description=null})</div>
<p class="dap-an">✅ (a) Không exception, không có dòng nào: <code>persist</code> chỉ làm đối tượng thành managed; không commit thì không có gì được ghi (còn <code>flush()</code> ngoài giao dịch thì ném <code>TransactionRequiredException</code>). (b) Commit hỏng thì đã tự rollback, nên <code>rollback()</code> lần hai ném <code>IllegalStateException: No transaction is currently active</code> — exception đó tới tận trình duyệt, còn nguyên nhân thật (NULL vào cột NOT NULL) chỉ thấy trong dòng log riêng của EclipseLink. Cách sửa: kiểm <code>isActive()</code>, và ném lại thay vì in ra:</p>
<p class="ghi-chu">📄 <code>jpa-slide17/src/main/java/demo/TxServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "fixed" -&gt; {                                    // slide 17 đã sửa: isActive() trước rollback, không nuốt lỗi
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        em.persist(new Product(0, null, 211111));    // name NULL ⇒ vi phạm NOT NULL lúc commit
        tx.commit();
    } catch (RuntimeException e) {
        if (tx.isActive()) tx.rollback();
        out.println("caught " + e.getClass().getSimpleName() + "; tx.isActive() = " + tx.isActive());
        throw e;                                     // để nơi gọi / trang lỗi thấy nó
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-slide17/tx?case=fixed HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 255

caught RollbackException; tx.isActive() = false
→ jakarta.persistence.RollbackException
  root cause: SQLServerException: Cannot insert the value NULL into column 'name', table 'PRJ301_JpaSlide17.dbo.Product'; column does not allow nulls. INSERT fails.</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
[EL Fine]: sql: SELECT 1<br>
[EL Warning]: Exception [EclipseLink-4002] (Eclipse Persistence Services - 4.0.9.v202601021151-061974965b9a70b72fdcb96dae36a4d6ef5df9ce): org.eclipse.persistence.exceptions.DatabaseException<br>
Internal Exception: com.microsoft.sqlserver.jdbc.SQLServerException: Cannot insert the value NULL into column 'name', table 'PRJ301_JpaSlide17.dbo.Product'; column does not allow nulls. INSERT fails.<br>
Error Code: 515<br>
Call: INSERT INTO PRODUCT (description, name, price) VALUES (?, ?, ?)<br>
	bind =&gt; [null, null, 211111.0]<br>
Query: InsertObjectQuery(Product{id=0, name=null, price=211111.0, description=null})</div>
<div class="pitfall">Khuôn cho mọi lần ghi bằng JPA trong app Tomcat: <code>begin</code> → làm việc → <code>commit</code> trong <code>try</code>; trong <code>finally</code>: <code>if (tx.isActive()) tx.rollback(); em.close();</code>. <code>ProductDAO</code> của ta (bài 7.A, slide 18) dùng đúng khuôn này, nên lỗi thật của một lần thêm hỏng đã tới được trang lỗi.</div>`),
    bi(`<h3>🧪 Exercise 5 — A list page with N+1 (~15 min)</h3>
<p>The device list prints code, name, quantity and the <strong>lab name</strong> of 11 devices. Before reading the log: how many SELECTs does <code>SELECT d FROM Device d ORDER BY d.code</code> send? Then write the query that sends one, and page it 4 per page.</p>
<p class="ghi-chu">📄 <code>ch7-thiet-bi/src/main/java/controller/DeviceListServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">String jpql = fix
        ? "SELECT d FROM Device d JOIN FETCH d.lab ORDER BY d.code"   // one SELECT with a join
        : "SELECT d FROM Device d ORDER BY d.code";                   // then one SELECT per lab
var q = em.createQuery(jpql, Device.class);
if (pageParam != null) {
    int page = Integer.parseInt(pageParam);
    q.setFirstResult((page - 1) * 4).setMaxResults(4);
}
List&lt;Device&gt; list = q.getResultList();</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-thiet-bi/devices HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 514

ARD-01 | Arduino Uno R3 | 15 | Lab IoT
CAB-01 | Bộ bấm cáp mạng | 12 | Lab Mạng
ESP-01 | Kit ESP32 | 20 | Lab IoT
MUL-01 | Đồng hồ vạn năng | 10 | Lab Điện tử
OSC-01 | Máy hiện sóng Rigol | 3 | Lab Điện tử
PSU-01 | Nguồn DC 0–30V | 6 | Lab Điện tử
RPI-01 | Raspberry Pi 4 | 10 | Lab IoT
RTR-01 | Router Cisco 2901 | 4 | Lab Mạng
SEN-01 | Bộ cảm biến 37 món | 5 | Lab IoT
SOL-01 | Máy hàn thiếc | 8 | Lab Điện tử
SWI-01 | Switch Cisco 2960 | 6 | Lab Mạng</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT deviceid, code, name, quantity, labid FROM Device ORDER BY code<br>
[EL Fine]: sql: SELECT labid, labname FROM Lab WHERE (labid = ?)<br>
	bind =&gt; [3]<br>
[EL Fine]: sql: SELECT labid, labname FROM Lab WHERE (labid = ?)<br>
	bind =&gt; [2]<br>
[EL Fine]: sql: SELECT labid, labname FROM Lab WHERE (labid = ?)<br>
	bind =&gt; [1]</div>
<p class="dap-an">✅ 1 + 3: the devices, then one SELECT per <em>different</em> lab (3 labs; the second device of the same lab reuses the object already in the persistence context). With 300 labs it would be 301 queries for one page. <code>JOIN FETCH d.lab</code> makes it one query — and it pages correctly, because each device row still has exactly one lab:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-thiet-bi/devices?fix=1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 514

ARD-01 | Arduino Uno R3 | 15 | Lab IoT
CAB-01 | Bộ bấm cáp mạng | 12 | Lab Mạng
ESP-01 | Kit ESP32 | 20 | Lab IoT
MUL-01 | Đồng hồ vạn năng | 10 | Lab Điện tử
OSC-01 | Máy hiện sóng Rigol | 3 | Lab Điện tử
PSU-01 | Nguồn DC 0–30V | 6 | Lab Điện tử
RPI-01 | Raspberry Pi 4 | 10 | Lab IoT
RTR-01 | Router Cisco 2901 | 4 | Lab Mạng
SEN-01 | Bộ cảm biến 37 món | 5 | Lab IoT
SOL-01 | Máy hàn thiếc | 8 | Lab Điện tử
SWI-01 | Switch Cisco 2960 | 6 | Lab Mạng</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT t1.deviceid, t1.code, t1.name, t1.quantity, t1.labid, t0.labid, t0.labname FROM Lab t0, Device t1 WHERE (t0.labid = t1.labid) ORDER BY t1.code</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-thiet-bi/devices?fix=1&amp;page=2 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 190

OSC-01 | Máy hiện sóng Rigol | 3 | Lab Điện tử
PSU-01 | Nguồn DC 0–30V | 6 | Lab Điện tử
RPI-01 | Raspberry Pi 4 | 10 | Lab IoT
RTR-01 | Router Cisco 2901 | 4 | Lab Mạng</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT t1.deviceid, t1.code, t1.name, t1.quantity, t1.labid, t0.labid, t0.labname FROM Lab t0, Device t1 WHERE (t0.labid = t1.labid) ORDER BY t1.code OFFSET ? ROWS FETCH NEXT ? ROWS ONLY<br>
	bind =&gt; [4, 4]</div>
<div class="pitfall">Paging a fetch join over a <strong>collection</strong> (<code>JOIN FETCH lab.devices</code>) is different: the rows are lab × device, so <code>setMaxResults(4)</code> would cut through the middle of a lab's list. Page the "one" side with a plain query, or fetch the collection in a second query. For a <code>@ManyToOne</code> like here it is safe.</div>`,
    `<h3>🧪 Bài 5 — Trang danh sách dính N+1 (~15 phút)</h3>
<p>Trang danh sách thiết bị in mã, tên, số lượng và <strong>tên lab</strong> của 11 thiết bị. Trước khi đọc log: câu <code>SELECT d FROM Device d ORDER BY d.code</code> gửi bao nhiêu câu SELECT? Rồi viết câu truy vấn chỉ gửi một câu, và phân trang 4 dòng mỗi trang.</p>
<p class="ghi-chu">📄 <code>ch7-thiet-bi/src/main/java/controller/DeviceListServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">String jpql = fix
        ? "SELECT d FROM Device d JOIN FETCH d.lab ORDER BY d.code"   // một SELECT có join
        : "SELECT d FROM Device d ORDER BY d.code";                   // rồi mỗi lab một SELECT
var q = em.createQuery(jpql, Device.class);
if (pageParam != null) {
    int page = Integer.parseInt(pageParam);
    q.setFirstResult((page - 1) * 4).setMaxResults(4);
}
List&lt;Device&gt; list = q.getResultList();</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-thiet-bi/devices HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 514

ARD-01 | Arduino Uno R3 | 15 | Lab IoT
CAB-01 | Bộ bấm cáp mạng | 12 | Lab Mạng
ESP-01 | Kit ESP32 | 20 | Lab IoT
MUL-01 | Đồng hồ vạn năng | 10 | Lab Điện tử
OSC-01 | Máy hiện sóng Rigol | 3 | Lab Điện tử
PSU-01 | Nguồn DC 0–30V | 6 | Lab Điện tử
RPI-01 | Raspberry Pi 4 | 10 | Lab IoT
RTR-01 | Router Cisco 2901 | 4 | Lab Mạng
SEN-01 | Bộ cảm biến 37 món | 5 | Lab IoT
SOL-01 | Máy hàn thiếc | 8 | Lab Điện tử
SWI-01 | Switch Cisco 2960 | 6 | Lab Mạng</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT deviceid, code, name, quantity, labid FROM Device ORDER BY code<br>
[EL Fine]: sql: SELECT labid, labname FROM Lab WHERE (labid = ?)<br>
	bind =&gt; [3]<br>
[EL Fine]: sql: SELECT labid, labname FROM Lab WHERE (labid = ?)<br>
	bind =&gt; [2]<br>
[EL Fine]: sql: SELECT labid, labname FROM Lab WHERE (labid = ?)<br>
	bind =&gt; [1]</div>
<p class="dap-an">✅ 1 + 3: các thiết bị, rồi mỗi lab <em>khác nhau</em> một SELECT (3 lab; thiết bị thứ hai cùng lab dùng lại đối tượng đã có trong persistence context). Với 300 lab thì là 301 truy vấn cho một trang. <code>JOIN FETCH d.lab</code> biến nó thành một câu — và phân trang vẫn đúng, vì mỗi dòng thiết bị vẫn có đúng một lab:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-thiet-bi/devices?fix=1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 514

ARD-01 | Arduino Uno R3 | 15 | Lab IoT
CAB-01 | Bộ bấm cáp mạng | 12 | Lab Mạng
ESP-01 | Kit ESP32 | 20 | Lab IoT
MUL-01 | Đồng hồ vạn năng | 10 | Lab Điện tử
OSC-01 | Máy hiện sóng Rigol | 3 | Lab Điện tử
PSU-01 | Nguồn DC 0–30V | 6 | Lab Điện tử
RPI-01 | Raspberry Pi 4 | 10 | Lab IoT
RTR-01 | Router Cisco 2901 | 4 | Lab Mạng
SEN-01 | Bộ cảm biến 37 món | 5 | Lab IoT
SOL-01 | Máy hàn thiếc | 8 | Lab Điện tử
SWI-01 | Switch Cisco 2960 | 6 | Lab Mạng</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT t1.deviceid, t1.code, t1.name, t1.quantity, t1.labid, t0.labid, t0.labname FROM Lab t0, Device t1 WHERE (t0.labid = t1.labid) ORDER BY t1.code</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-thiet-bi/devices?fix=1&amp;page=2 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 190

OSC-01 | Máy hiện sóng Rigol | 3 | Lab Điện tử
PSU-01 | Nguồn DC 0–30V | 6 | Lab Điện tử
RPI-01 | Raspberry Pi 4 | 10 | Lab IoT
RTR-01 | Router Cisco 2901 | 4 | Lab Mạng</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT t1.deviceid, t1.code, t1.name, t1.quantity, t1.labid, t0.labid, t0.labname FROM Lab t0, Device t1 WHERE (t0.labid = t1.labid) ORDER BY t1.code OFFSET ? ROWS FETCH NEXT ? ROWS ONLY<br>
	bind =&gt; [4, 4]</div>
<div class="pitfall">Phân trang một fetch join trên <strong>collection</strong> (<code>JOIN FETCH lab.devices</code>) thì khác: các dòng là lab × thiết bị, nên <code>setMaxResults(4)</code> sẽ cắt ngang giữa danh sách của một lab. Hãy phân trang phía "một" bằng truy vấn thường, hoặc nạp collection bằng một truy vấn thứ hai. Với <code>@ManyToOne</code> như ở đây thì an toàn.</div>`),
    bi(`<h3>🧪 Exercise 6 — Why is typeid NULL? (~10 min)</h3>
<p>A teammate adds a new student "Lan" like this and the row appears with <code>typeid = NULL</code>. Explain, then fix it in one line:</p>
<p class="ghi-chu">📄 <code>jpa-quan-he/src/main/java/controller/RelServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">case "owning-wrong" -&gt; {                          // add to the INVERSE side only
    EntityTransaction tx = em.getTransaction();
    tx.begin();
    HumanType student = em.find(HumanType.class, 1);
    Human lan = new Human("Lan", LocalDate.of(2005, 3, 14), false);
    student.getHumans().add(lan);                 // the list knows Lan…
    em.persist(lan);                              // …but lan.type is still null
    tx.commit();
    out.println(row(em, lan.getId()));
}
case "owning-right" -&gt; {                          // set the OWNING side (and keep the list in sync)
    EntityTransaction tx = em.getTransaction();
    tx.begin();
    HumanType student = em.find(HumanType.class, 1);
    Human hoa = new Human("Hoa", LocalDate.of(2005, 6, 1), false);
    hoa.setType(student);                         // this is what JPA writes to typeid
    student.getHumans().add(hoa);                 // only for the objects in memory
    em.persist(hoa);
    tx.commit();
    out.println(row(em, hoa.getId()));
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=owning-wrong HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 58

row in table Human: humanid=9, humanname=Lan, typeid=null</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: INSERT INTO Human (humandob, humangender, humanname, typeid) VALUES (?, ?, ?, ?)<br>
	bind =&gt; [2005-03-14, false, Lan, null]<br>
[EL Fine]: sql: SELECT humanid, humanname, typeid FROM Human WHERE humanid = ?<br>
	bind =&gt; [9]</div>
<p class="dap-an">✅ <code>HumanType.humans</code> has <code>mappedBy = "type"</code>: it is the <strong>inverse</strong> side, and JPA ignores it when writing (spec §2.10, §3.2.4). The foreign key is written only from the owning side, <code>Human.type</code>, which was still <code>null</code>. The fix is <code>lan.setType(student)</code> — the second case shows <code>typeid=1</code>. Keep the list in sync too if the page goes on using <code>student.getHumans()</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=owning-right HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 56

row in table Human: humanid=10, humanname=Hoa, typeid=1</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: INSERT INTO Human (humandob, humangender, humanname, typeid) VALUES (?, ?, ?, ?)<br>
	bind =&gt; [2005-06-01, false, Hoa, 1]<br>
[EL Fine]: sql: SELECT humanid, humanname, typeid FROM Human WHERE humanid = ?<br>
	bind =&gt; [10]</div>
<div class="pitfall">Make it impossible to forget: put one helper on the "one" side, e.g. <code>public void addHuman(Human h) { humans.add(h); h.setType(this); }</code>, and call only that. Spring Data does not change this rule — LabFlow's <code>Device.lab</code> works the same way.</div>`,
    `<h3>🧪 Bài 6 — Vì sao typeid bị NULL? (~10 phút)</h3>
<p>Một bạn cùng nhóm thêm sinh viên mới "Lan" như dưới đây và dòng hiện ra với <code>typeid = NULL</code>. Giải thích, rồi sửa bằng một dòng:</p>
<p class="ghi-chu">📄 <code>jpa-quan-he/src/main/java/controller/RelServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">case "owning-wrong" -&gt; {                          // chỉ thêm vào phía NGHỊCH
    EntityTransaction tx = em.getTransaction();
    tx.begin();
    HumanType student = em.find(HumanType.class, 1);
    Human lan = new Human("Lan", LocalDate.of(2005, 3, 14), false);
    student.getHumans().add(lan);                 // danh sách biết Lan…
    em.persist(lan);                              // …nhưng lan.type vẫn null
    tx.commit();
    out.println(row(em, lan.getId()));
}
case "owning-right" -&gt; {                          // đặt phía SỞ HỮU (và giữ danh sách khớp)
    EntityTransaction tx = em.getTransaction();
    tx.begin();
    HumanType student = em.find(HumanType.class, 1);
    Human hoa = new Human("Hoa", LocalDate.of(2005, 6, 1), false);
    hoa.setType(student);                         // đây là thứ JPA ghi vào typeid
    student.getHumans().add(hoa);                 // chỉ cho các đối tượng trong bộ nhớ
    em.persist(hoa);
    tx.commit();
    out.println(row(em, hoa.getId()));
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=owning-wrong HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 58

row in table Human: humanid=9, humanname=Lan, typeid=null</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: INSERT INTO Human (humandob, humangender, humanname, typeid) VALUES (?, ?, ?, ?)<br>
	bind =&gt; [2005-03-14, false, Lan, null]<br>
[EL Fine]: sql: SELECT humanid, humanname, typeid FROM Human WHERE humanid = ?<br>
	bind =&gt; [9]</div>
<p class="dap-an">✅ <code>HumanType.humans</code> có <code>mappedBy = "type"</code>: nó là phía <strong>nghịch</strong>, và JPA bỏ qua nó khi ghi (đặc tả §2.10, §3.2.4). Khoá ngoại chỉ được ghi từ phía sở hữu, <code>Human.type</code>, mà trường đó vẫn là <code>null</code>. Cách sửa là <code>lan.setType(student)</code> — trường hợp thứ hai cho <code>typeid=1</code>. Giữ cả danh sách khớp nếu trang còn dùng tiếp <code>student.getHumans()</code>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jpa-quan-he/rel?case=owning-right HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 56

row in table Human: humanid=10, humanname=Hoa, typeid=1</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT typeid, typename FROM HumanType WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (typeid = ?)<br>
	bind =&gt; [1]<br>
[EL Fine]: sql: INSERT INTO Human (humandob, humangender, humanname, typeid) VALUES (?, ?, ?, ?)<br>
	bind =&gt; [2005-06-01, false, Hoa, 1]<br>
[EL Fine]: sql: SELECT humanid, humanname, typeid FROM Human WHERE humanid = ?<br>
	bind =&gt; [10]</div>
<div class="pitfall">Làm cho không thể quên: đặt một hàm trợ giúp ở phía "một", vd <code>public void addHuman(Human h) { humans.add(h); h.setType(this); }</code>, và chỉ gọi hàm đó. Spring Data không đổi luật này — <code>Device.lab</code> của LabFlow cũng y như vậy.</div>`),
    bi(`<h3>🧪 Exercise 7 — Rewrite lesson 5.B's DAO with JPA (~30 min)</h3>
<p>This is the PE in JPA form. Take the complete Human CRUD of lesson 5.B (<code>jdbc-human</code>: list, insert, edit, delete through Controller → DAO → JSP) and replace JDBC with JPA <strong>without touching the five controllers or the two JSPs</strong>. Allowed changes: the model classes (add annotations), the DAO, a <code>JpaUtil</code> instead of <code>DBContext</code>, a <code>persistence.xml</code>.</p>
<p class="ghi-chu">📄 <code>ch7-dao-human/src/main/java/model/Human.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Human")
public class Human {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "humanid")
    private int id;
    @Column(name = "humanname")
    private String name;
    @Column(name = "humandob")
    private Date dob;
    @Column(name = "humangender")
    private boolean gender;          // true = male
    @ManyToOne
    @JoinColumn(name = "typeid")
    private HumanType type;</code></pre>
<p class="ghi-chu">📄 <code>ch7-dao-human/src/main/java/dal/HumanDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public List&lt;Human&gt; getHumans() throws SQLException {
    EntityManager em = JpaUtil.em();
    try {
        return em.createQuery("SELECT h FROM Human h JOIN FETCH h.type ORDER BY h.id", Human.class).getResultList();
    } finally {
        em.close();
    }
}</code></pre>
<p class="ghi-chu">📄 <code>ch7-dao-human/src/main/java/dal/HumanDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public int insert(Human h) throws SQLException {
    EntityManager em = JpaUtil.em();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        h.setType(em.getReference(HumanType.class, h.getType().getTypeid()));   // the managed HumanType with that id
        em.persist(h);
        tx.commit();
        return 1;
    } finally {
        if (tx.isActive()) tx.rollback();
        em.close();
    }
}

public int update(Human h) throws SQLException {
    EntityManager em = JpaUtil.em();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        Human m = em.find(Human.class, h.getId());
        if (m == null) return 0;                                  // 0 = the id did not exist (same contract as JDBC)
        m.setName(h.getName());
        m.setDob(h.getDob());
        m.setGender(h.isGender());
        m.setType(em.getReference(HumanType.class, h.getType().getTypeid()));
        tx.commit();                                              // UPDATE only the columns that changed
        return 1;
    } finally {
        if (tx.isActive()) tx.rollback();
        em.close();
    }
}

public int delete(int id) throws SQLException {
    EntityManager em = JpaUtil.em();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        Human m = em.find(Human.class, id);
        if (m == null) return 0;
        em.remove(m);
        tx.commit();
        return 1;
    } finally {
        if (tx.isActive()) tx.rollback();
        em.close();
    }
}</code></pre>
<p class="dap-an">✅ The same requests as in lesson 5.B, now through JPA — compare the log with the SQL that 5.B wrote by hand:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-dao-human/human/list HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Humans&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;DOB&lt;/th&gt;&lt;th&gt;Gender&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Steve&lt;/td&gt;&lt;td&gt;2020-09-09&lt;/td&gt;&lt;td&gt;♂ male&lt;/td&gt;&lt;td&gt;student&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=1"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="1"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Elon&lt;/td&gt;&lt;td&gt;2019-09-09&lt;/td&gt;&lt;td&gt;♀ female&lt;/td&gt;&lt;td&gt;teacher&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=2"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="2"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Musk&lt;/td&gt;&lt;td&gt;2020-09-09&lt;/td&gt;&lt;td&gt;♂ male&lt;/td&gt;&lt;td&gt;worker&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=3"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="3"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Melon&lt;/td&gt;&lt;td&gt;2019-08-09&lt;/td&gt;&lt;td&gt;♂ male&lt;/td&gt;&lt;td&gt;student&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=4"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="4"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Kais&lt;/td&gt;&lt;td&gt;2020-07-08&lt;/td&gt;&lt;td&gt;♀ female&lt;/td&gt;&lt;td&gt;worker&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=5"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="5"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;a href="insert"&gt;Insert&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT t1.humanid, t1.humandob, t1.humangender, t1.humanname, t1.typeid, t0.TYPEID, t0.typename FROM HumanType t0, Human t1 WHERE (t0.TYPEID = t1.typeid) ORDER BY t1.humanid</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch7-dao-human/human/insert HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 61

name=Nguy%E1%BB%85n+Lan&amp;dob=2005-03-14&amp;gender=female&amp;typeid=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: list
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO Human (humandob, humangender, humanname, typeid) VALUES (?, ?, ?, ?)<br>
	bind =&gt; [2005-03-14, false, Nguyễn Lan, 1]</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch7-dao-human/human/update HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 52

id=2&amp;name=Elon&amp;dob=2019-09-09&amp;gender=female&amp;typeid=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: list
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: UPDATE Human SET typeid = ? WHERE (humanid = ?)<br>
	bind =&gt; [3, 2]</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch7-dao-human/human/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 4

id=5</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: list
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: DELETE FROM Human WHERE (humanid = ?)<br>
	bind =&gt; [5]</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-dao-human/human/list HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Humans&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;DOB&lt;/th&gt;&lt;th&gt;Gender&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Steve&lt;/td&gt;&lt;td&gt;2020-09-09&lt;/td&gt;&lt;td&gt;♂ male&lt;/td&gt;&lt;td&gt;student&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=1"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="1"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Elon&lt;/td&gt;&lt;td&gt;2019-09-09&lt;/td&gt;&lt;td&gt;♀ female&lt;/td&gt;&lt;td&gt;worker&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=2"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="2"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Musk&lt;/td&gt;&lt;td&gt;2020-09-09&lt;/td&gt;&lt;td&gt;♂ male&lt;/td&gt;&lt;td&gt;worker&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=3"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="3"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Melon&lt;/td&gt;&lt;td&gt;2019-08-09&lt;/td&gt;&lt;td&gt;♂ male&lt;/td&gt;&lt;td&gt;student&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=4"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="4"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Nguyễn Lan&lt;/td&gt;&lt;td&gt;2005-03-14&lt;/td&gt;&lt;td&gt;♀ female&lt;/td&gt;&lt;td&gt;student&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=6"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="6"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;a href="insert"&gt;Insert&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT t1.humanid, t1.humandob, t1.humangender, t1.humanname, t1.typeid, t0.TYPEID, t0.typename FROM HumanType t0, Human t1 WHERE (t0.TYPEID = t1.typeid) ORDER BY t1.humanid</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch7-dao-human/human/update?id=99 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 726

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message No human with that id
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (humanid = ?)<br>
	bind =&gt; [99]</div>
<p>The decisions: (1) <strong>same method signatures</strong> (<code>getHumans</code>, <code>getHuman</code> returning <code>null</code> for 404, <code>insert/update/delete</code> returning 1 or 0) — that is the DAO pattern paying off; <code>throws SQLException</code> is kept only so the old controllers compile unchanged (JPA throws unchecked <code>PersistenceException</code>). (2) <code>getHumans</code> uses <code>JOIN FETCH h.type</code> — one SELECT, as the JDBC version's INNER JOIN. (3) The form builds <code>new HumanType(typeid, null)</code>; the DAO swaps it for <code>em.getReference(HumanType.class, id)</code>, the managed type with that id, instead of saving a half-empty object. (4) <code>update</code> finds the managed row and sets fields: the log shows <code>UPDATE Human SET typeid = ?</code> — only the column that changed. (5) Every write: begin / commit / <code>isActive()</code>-rollback / close.</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): this whole DAO becomes <code>interface HumanRepository extends JpaRepository&lt;Human, Integer&gt;</code> plus one <code>@Query("SELECT h FROM Human h JOIN FETCH h.type ORDER BY h.id")</code>, and the begin/commit lines become <code>@Transactional</code> on the service. The two things you still decide yourself are exactly decisions (2) and (3): which relationships to fetch, and how to attach a related entity by id.</div>`,
    `<h3>🧪 Bài 7 — Viết lại DAO của bài 5.B bằng JPA (~30 phút)</h3>
<p>Đây là đề PE ở dạng JPA. Lấy trọn bộ CRUD Human của bài 5.B (<code>jdbc-human</code>: danh sách, thêm, sửa, xoá qua Controller → DAO → JSP) và thay JDBC bằng JPA <strong>mà không đụng tới năm controller hay hai JSP</strong>. Được phép đổi: các lớp model (thêm annotation), DAO, một <code>JpaUtil</code> thay cho <code>DBContext</code>, một <code>persistence.xml</code>.</p>
<p class="ghi-chu">📄 <code>ch7-dao-human/src/main/java/model/Human.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Entity
@Table(name = "Human")
public class Human {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "humanid")
    private int id;
    @Column(name = "humanname")
    private String name;
    @Column(name = "humandob")
    private Date dob;
    @Column(name = "humangender")
    private boolean gender;          // true = nam
    @ManyToOne
    @JoinColumn(name = "typeid")
    private HumanType type;</code></pre>
<p class="ghi-chu">📄 <code>ch7-dao-human/src/main/java/dal/HumanDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public List&lt;Human&gt; getHumans() throws SQLException {
    EntityManager em = JpaUtil.em();
    try {
        return em.createQuery("SELECT h FROM Human h JOIN FETCH h.type ORDER BY h.id", Human.class).getResultList();
    } finally {
        em.close();
    }
}</code></pre>
<p class="ghi-chu">📄 <code>ch7-dao-human/src/main/java/dal/HumanDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public int insert(Human h) throws SQLException {
    EntityManager em = JpaUtil.em();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        h.setType(em.getReference(HumanType.class, h.getType().getTypeid()));   // HumanType được quản lý có id đó
        em.persist(h);
        tx.commit();
        return 1;
    } finally {
        if (tx.isActive()) tx.rollback();
        em.close();
    }
}

public int update(Human h) throws SQLException {
    EntityManager em = JpaUtil.em();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        Human m = em.find(Human.class, h.getId());
        if (m == null) return 0;                                  // 0 = id không tồn tại (cùng hợp đồng với JDBC)
        m.setName(h.getName());
        m.setDob(h.getDob());
        m.setGender(h.isGender());
        m.setType(em.getReference(HumanType.class, h.getType().getTypeid()));
        tx.commit();                                              // UPDATE chỉ các cột đã đổi
        return 1;
    } finally {
        if (tx.isActive()) tx.rollback();
        em.close();
    }
}

public int delete(int id) throws SQLException {
    EntityManager em = JpaUtil.em();
    EntityTransaction tx = em.getTransaction();
    try {
        tx.begin();
        Human m = em.find(Human.class, id);
        if (m == null) return 0;
        em.remove(m);
        tx.commit();
        return 1;
    } finally {
        if (tx.isActive()) tx.rollback();
        em.close();
    }
}</code></pre>
<p class="dap-an">✅ Cùng các request của bài 5.B, giờ đi qua JPA — so log với SQL mà bài 5.B viết tay:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-dao-human/human/list HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Humans&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;DOB&lt;/th&gt;&lt;th&gt;Gender&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Steve&lt;/td&gt;&lt;td&gt;2020-09-09&lt;/td&gt;&lt;td&gt;♂ male&lt;/td&gt;&lt;td&gt;student&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=1"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="1"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Elon&lt;/td&gt;&lt;td&gt;2019-09-09&lt;/td&gt;&lt;td&gt;♀ female&lt;/td&gt;&lt;td&gt;teacher&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=2"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="2"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Musk&lt;/td&gt;&lt;td&gt;2020-09-09&lt;/td&gt;&lt;td&gt;♂ male&lt;/td&gt;&lt;td&gt;worker&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=3"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="3"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Melon&lt;/td&gt;&lt;td&gt;2019-08-09&lt;/td&gt;&lt;td&gt;♂ male&lt;/td&gt;&lt;td&gt;student&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=4"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="4"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Kais&lt;/td&gt;&lt;td&gt;2020-07-08&lt;/td&gt;&lt;td&gt;♀ female&lt;/td&gt;&lt;td&gt;worker&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=5"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="5"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;a href="insert"&gt;Insert&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT t1.humanid, t1.humandob, t1.humangender, t1.humanname, t1.typeid, t0.TYPEID, t0.typename FROM HumanType t0, Human t1 WHERE (t0.TYPEID = t1.typeid) ORDER BY t1.humanid</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch7-dao-human/human/insert HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 61

name=Nguy%E1%BB%85n+Lan&amp;dob=2005-03-14&amp;gender=female&amp;typeid=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: list
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: INSERT INTO Human (humandob, humangender, humanname, typeid) VALUES (?, ?, ?, ?)<br>
	bind =&gt; [2005-03-14, false, Nguyễn Lan, 1]</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch7-dao-human/human/update HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 52

id=2&amp;name=Elon&amp;dob=2019-09-09&amp;gender=female&amp;typeid=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: list
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: UPDATE Human SET typeid = ? WHERE (humanid = ?)<br>
	bind =&gt; [3, 2]</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch7-dao-human/human/delete HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 4

id=5</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: list
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: DELETE FROM Human WHERE (humanid = ?)<br>
	bind =&gt; [5]</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-dao-human/human/list HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Humans&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;DOB&lt;/th&gt;&lt;th&gt;Gender&lt;/th&gt;&lt;th&gt;Type&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Steve&lt;/td&gt;&lt;td&gt;2020-09-09&lt;/td&gt;&lt;td&gt;♂ male&lt;/td&gt;&lt;td&gt;student&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=1"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="1"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Elon&lt;/td&gt;&lt;td&gt;2019-09-09&lt;/td&gt;&lt;td&gt;♀ female&lt;/td&gt;&lt;td&gt;worker&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=2"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="2"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Musk&lt;/td&gt;&lt;td&gt;2020-09-09&lt;/td&gt;&lt;td&gt;♂ male&lt;/td&gt;&lt;td&gt;worker&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=3"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="3"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Melon&lt;/td&gt;&lt;td&gt;2019-08-09&lt;/td&gt;&lt;td&gt;♂ male&lt;/td&gt;&lt;td&gt;student&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=4"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="4"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;Nguyễn Lan&lt;/td&gt;&lt;td&gt;2005-03-14&lt;/td&gt;&lt;td&gt;♀ female&lt;/td&gt;&lt;td&gt;student&lt;/td&gt;
      &lt;td&gt;&lt;a href="update?id=6"&gt;edit&lt;/a&gt; &lt;form action="delete" method="post" class="inline"&gt;&lt;input type="hidden" name="id" value="6"&gt;&lt;button&gt;delete&lt;/button&gt;&lt;/form&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;a href="insert"&gt;Insert&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT t1.humanid, t1.humandob, t1.humangender, t1.humanname, t1.typeid, t0.TYPEID, t0.typename FROM HumanType t0, Human t1 WHERE (t0.TYPEID = t1.typeid) ORDER BY t1.humanid</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch7-dao-human/human/update?id=99 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 726

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message No human with that id
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">[EL Fine]: sql: SELECT humanid, humandob, humangender, humanname, typeid FROM Human WHERE (humanid = ?)<br>
	bind =&gt; [99]</div>
<p>Các quyết định: (1) <strong>giữ nguyên chữ ký phương thức</strong> (<code>getHumans</code>, <code>getHuman</code> trả <code>null</code> để ra 404, <code>insert/update/delete</code> trả 1 hoặc 0) — đó là lúc mẫu DAO trả công; <code>throws SQLException</code> giữ lại chỉ để controller cũ biên dịch nguyên vẹn (JPA ném <code>PersistenceException</code> không bắt buộc bắt). (2) <code>getHumans</code> dùng <code>JOIN FETCH h.type</code> — một SELECT, như INNER JOIN của bản JDBC. (3) Form dựng <code>new HumanType(typeid, null)</code>; DAO thay nó bằng <code>em.getReference(HumanType.class, id)</code>, tức loại được quản lý có id đó, thay vì lưu một đối tượng rỗng một nửa. (4) <code>update</code> tìm dòng được quản lý rồi đặt các trường: log cho thấy <code>UPDATE Human SET typeid = ?</code> — chỉ cột đã đổi. (5) Mọi lần ghi: begin / commit / <code>isActive()</code>-rollback / close.</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): cả DAO này thành <code>interface HumanRepository extends JpaRepository&lt;Human, Integer&gt;</code> cộng một <code>@Query("SELECT h FROM Human h JOIN FETCH h.type ORDER BY h.id")</code>, còn các dòng begin/commit thành <code>@Transactional</code> trên service. Hai thứ bạn vẫn phải tự quyết chính là quyết định (2) và (3): nạp sẵn quan hệ nào, và gắn một entity liên quan theo id ra sao.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>JPA / Jakarta Persistence</strong></td><td>API lưu trữ bền vững của Java</td><td>The standard specification (package jakarta.persistence, formerly javax.persistence) for mapping Java objects to relational tables.</td></tr>
<tr><td><strong>ORM</strong></td><td>ánh xạ đối tượng-quan hệ</td><td>Object-relational mapping: converting between objects and rows automatically from a mapping (annotations).</td></tr>
<tr><td><strong>persistence provider</strong></td><td>bộ cài đặt JPA</td><td>The library that implements JPA and writes the SQL: EclipseLink, Hibernate (Spring Boot's default), OpenJPA.</td></tr>
<tr><td><strong>entity</strong></td><td>thực thể (lớp được lưu)</td><td>A class annotated @Entity with an @Id and a public/protected no-arg constructor; one object = one row.</td></tr>
<tr><td><strong>persistence unit</strong></td><td>đơn vị lưu trữ</td><td>A named configuration in META-INF/persistence.xml: provider, entity classes, database URL and properties.</td></tr>
<tr><td><strong>RESOURCE_LOCAL</strong></td><td>giao dịch cục bộ</td><td>Transaction type where the application controls transactions with EntityTransaction; the one used on Tomcat.</td></tr>
<tr><td><strong>EntityManagerFactory</strong></td><td>nhà máy tạo EntityManager</td><td>Built once per application from a persistence unit; thread-safe and expensive; must be closed at shutdown.</td></tr>
<tr><td><strong>EntityManager</strong></td><td>trình quản lý entity</td><td>One per request: persist, find, merge, remove, createQuery; not thread-safe; always closed.</td></tr>
<tr><td><strong>persistence context</strong></td><td>ngữ cảnh lưu trữ</td><td>The set of managed objects an EntityManager tracks, at most one object per id; changes are written at commit.</td></tr>
<tr><td><strong>managed / detached</strong></td><td>được quản lý / tách rời</td><td>Managed objects are tracked by an open EntityManager; after close they are detached and changes are ignored until merge.</td></tr>
<tr><td><strong>EntityTransaction</strong></td><td>giao dịch của EntityManager</td><td>begin / commit / rollback / isActive; every write needs one; a failed commit has already rolled back.</td></tr>
<tr><td><strong>JPQL</strong></td><td>ngôn ngữ truy vấn của JPA</td><td>SQL-like queries over entities and their fields (SELECT p FROM Product p WHERE p.name LIKE :kw), translated to SQL by the provider.</td></tr>
<tr><td><strong>named parameter</strong></td><td>tham số có tên</td><td>A placeholder like :kw filled by setParameter; the value is bound, never parsed — the defence against JPQL injection.</td></tr>
<tr><td><strong>fetch type (EAGER / LAZY)</strong></td><td>kiểu nạp (ngay / khi cần)</td><td>When related data is loaded; defaults: ManyToOne/OneToOne EAGER, OneToMany/ManyToMany LAZY; LAZY is only a hint.</td></tr>
<tr><td><strong>N+1 problem</strong></td><td>vấn đề N+1 truy vấn</td><td>One query for a list plus one more query per related object; found by reading the SQL log, fixed with JOIN FETCH.</td></tr>
<tr><td><strong>JOIN FETCH</strong></td><td>join nạp kèm</td><td>A JPQL join that loads the related entity or collection in the same SQL; add DISTINCT for collections.</td></tr>
<tr><td><strong>owning side / mappedBy</strong></td><td>phía sở hữu / phía nghịch</td><td>The owning side holds the foreign key (@JoinColumn) and is what JPA writes; the inverse side names it with mappedBy and is ignored when saving.</td></tr>
<tr><td><strong>weaving</strong></td><td>đan mã (sửa bytecode)</td><td>EclipseLink's bytecode enhancement, needed for LAZY on ManyToOne/OneToOne; absent on plain Tomcat, so LAZY there is ignored.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>JPA / Jakarta Persistence</strong></td><td>API lưu trữ bền vững của Java</td><td>Đặc tả chuẩn (gói jakarta.persistence, trước là javax.persistence) để ánh xạ đối tượng Java vào bảng quan hệ.</td></tr>
<tr><td><strong>ORM</strong></td><td>ánh xạ đối tượng-quan hệ</td><td>Object-relational mapping: tự chuyển đổi giữa đối tượng và dòng dựa trên một bản ánh xạ (annotation).</td></tr>
<tr><td><strong>persistence provider</strong></td><td>bộ cài đặt JPA</td><td>Thư viện cài đặt JPA và viết SQL: EclipseLink, Hibernate (mặc định của Spring Boot), OpenJPA.</td></tr>
<tr><td><strong>entity</strong></td><td>thực thể (lớp được lưu)</td><td>Lớp có @Entity, có @Id và constructor không tham số public/protected; một đối tượng = một dòng.</td></tr>
<tr><td><strong>persistence unit</strong></td><td>đơn vị lưu trữ</td><td>Một cấu hình có tên trong META-INF/persistence.xml: provider, các lớp entity, URL CSDL và thuộc tính.</td></tr>
<tr><td><strong>RESOURCE_LOCAL</strong></td><td>giao dịch cục bộ</td><td>Kiểu giao dịch mà ứng dụng tự điều khiển bằng EntityTransaction; kiểu dùng trên Tomcat.</td></tr>
<tr><td><strong>EntityManagerFactory</strong></td><td>nhà máy tạo EntityManager</td><td>Dựng một lần cho cả ứng dụng từ một persistence unit; an toàn đa luồng và tốn kém; phải đóng khi tắt.</td></tr>
<tr><td><strong>EntityManager</strong></td><td>trình quản lý entity</td><td>Mỗi request một cái: persist, find, merge, remove, createQuery; không an toàn đa luồng; luôn phải đóng.</td></tr>
<tr><td><strong>persistence context</strong></td><td>ngữ cảnh lưu trữ</td><td>Tập đối tượng được quản lý mà một EntityManager theo dõi, mỗi id tối đa một đối tượng; thay đổi được ghi lúc commit.</td></tr>
<tr><td><strong>managed / detached</strong></td><td>được quản lý / tách rời</td><td>Đối tượng managed được một EntityManager đang mở theo dõi; sau khi đóng chúng thành detached và thay đổi bị bỏ qua cho tới khi merge.</td></tr>
<tr><td><strong>EntityTransaction</strong></td><td>giao dịch của EntityManager</td><td>begin / commit / rollback / isActive; mọi lần ghi đều cần; commit hỏng thì đã tự rollback.</td></tr>
<tr><td><strong>JPQL</strong></td><td>ngôn ngữ truy vấn của JPA</td><td>Truy vấn giống SQL nhưng trên entity và trường của nó (SELECT p FROM Product p WHERE p.name LIKE :kw), provider dịch sang SQL.</td></tr>
<tr><td><strong>named parameter</strong></td><td>tham số có tên</td><td>Chỗ giữ như :kw được điền bằng setParameter; giá trị được gắn, không bao giờ được phân tích — cách chặn JPQL injection.</td></tr>
<tr><td><strong>fetch type (EAGER / LAZY)</strong></td><td>kiểu nạp (ngay / khi cần)</td><td>Lúc dữ liệu liên quan được nạp; mặc định: ManyToOne/OneToOne EAGER, OneToMany/ManyToMany LAZY; LAZY chỉ là gợi ý.</td></tr>
<tr><td><strong>N+1 problem</strong></td><td>vấn đề N+1 truy vấn</td><td>Một truy vấn cho danh sách cộng thêm một truy vấn cho mỗi đối tượng liên quan; phát hiện bằng log SQL, sửa bằng JOIN FETCH.</td></tr>
<tr><td><strong>JOIN FETCH</strong></td><td>join nạp kèm</td><td>Một phép join của JPQL nạp luôn entity hay collection liên quan trong cùng câu SQL; thêm DISTINCT với collection.</td></tr>
<tr><td><strong>owning side / mappedBy</strong></td><td>phía sở hữu / phía nghịch</td><td>Phía sở hữu giữ khoá ngoại (@JoinColumn) và là thứ JPA ghi; phía nghịch chỉ tới nó bằng mappedBy và bị bỏ qua khi lưu.</td></tr>
<tr><td><strong>weaving</strong></td><td>đan mã (sửa bytecode)</td><td>Việc EclipseLink sửa bytecode của lớp, cần để LAZY trên ManyToOne/OneToOne có tác dụng; Tomcat thường không có, nên ở đó LAZY bị bỏ qua.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 7</h2>
<ol>
<li>JPA is a specification; EclipseLink and Hibernate implement it; underneath it is still JDBC + SQL — keep <code>eclipselink.logging.level.sql=FINE</code> (or <code>spring.jpa.show-sql</code>) on while developing.</li>
<li>Entity = <code>@Entity</code> + <code>@Id</code> + public/protected no-arg constructor, not final; <code>@Table</code>/<code>@Column</code> when names differ; IDENTITY column ⇒ <code>@GeneratedValue(strategy = IDENTITY)</code>; <code>decimal</code> ⇒ <code>BigDecimal</code>.</li>
<li>persistence.xml lives in <code>WEB-INF/classes/META-INF</code>, uses <code>jakarta.persistence.*</code> names, lists every entity class; read errors by their "Exception Description".</li>
<li>One EntityManagerFactory per app (a listener), one EntityManager per request, always closed; never in a servlet field.</li>
<li>Writes need begin/commit; reads do not. In <code>finally</code>: <code>if (tx.isActive()) tx.rollback(); em.close();</code> — never swallow the exception.</li>
<li>JPQL speaks classes and fields, not tables and columns; values only through <code>setParameter</code> — concatenation allows JPQL injection.</li>
<li>Defaults: ManyToOne EAGER, OneToMany LAZY (LAZY is a hint). A page showing a related field ⇒ <code>JOIN FETCH</code> (+ <code>DISTINCT</code> for collections), or N+1.</li>
<li>JPA writes the owning side (<code>@JoinColumn</code>); <code>mappedBy</code> is the field name on the other class; set both sides in memory with one helper.</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 7</h2>
<ol>
<li>JPA là một đặc tả; EclipseLink và Hibernate cài đặt nó; bên dưới vẫn là JDBC + SQL — bật <code>eclipselink.logging.level.sql=FINE</code> (hoặc <code>spring.jpa.show-sql</code>) khi phát triển.</li>
<li>Entity = <code>@Entity</code> + <code>@Id</code> + constructor không tham số public/protected, không final; <code>@Table</code>/<code>@Column</code> khi tên khác; cột IDENTITY ⇒ <code>@GeneratedValue(strategy = IDENTITY)</code>; <code>decimal</code> ⇒ <code>BigDecimal</code>.</li>
<li>persistence.xml nằm ở <code>WEB-INF/classes/META-INF</code>, dùng tên <code>jakarta.persistence.*</code>, liệt kê mọi lớp entity; đọc lỗi qua dòng "Exception Description".</li>
<li>Một EntityManagerFactory cho cả app (trong listener), mỗi request một EntityManager, luôn đóng; không bao giờ để trong trường của servlet.</li>
<li>Ghi cần begin/commit; đọc thì không. Trong <code>finally</code>: <code>if (tx.isActive()) tx.rollback(); em.close();</code> — không bao giờ nuốt exception.</li>
<li>JPQL nói về lớp và trường, không phải bảng và cột; giá trị chỉ đi qua <code>setParameter</code> — nối chuỗi là mở cửa cho JPQL injection.</li>
<li>Mặc định: ManyToOne EAGER, OneToMany LAZY (LAZY chỉ là gợi ý). Trang có hiện trường của bảng liên quan ⇒ <code>JOIN FETCH</code> (+ <code>DISTINCT</code> với collection), không thì dính N+1.</li>
<li>JPA ghi phía sở hữu (<code>@JoinColumn</code>); <code>mappedBy</code> là tên trường ở lớp bên kia; đặt cả hai phía trong bộ nhớ bằng một hàm trợ giúp.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (prj301-quiz-ch7) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) An entity uses property access and has the field private boolean active; Which pair of methods follows the JavaBeans naming standard, so that JPA (and EL ${u.active}) can use it?|||(Dạng câu FE) Một entity dùng property access và có trường private boolean active; Cặp phương thức nào đúng chuẩn đặt tên JavaBeans, để JPA (và EL ${u.active}) dùng được?',
      options: ['public void isActive() and public boolean setActive(boolean a)|||public void isActive() và public boolean setActive(boolean a)', 'public boolean active() and public void active(boolean a)|||public boolean active() và public void active(boolean a)', 'public boolean isActive() and public void setActive(boolean a)|||public boolean isActive() và public void setActive(boolean a)', 'public Boolean getactive() and public void setactive(Boolean a)|||public Boolean getactive() và public void setactive(Boolean a)'],
      correctIndex: 2,
      points: 1,
      explanation: "JavaBeans: the getter of a boolean property may be named isX() (getX() is also accepted) and returns the value; the setter is void setX(type) with a capital letter after is/set. JPA's property access (spec §2.2) and EL both rely on these names. A swaps the return types, B has no is/get/set prefix, D breaks the capitalisation (getactive is not the property \"active\").|||JavaBeans: getter của thuộc tính boolean được đặt tên isX() (getX() cũng được) và trả về giá trị; setter là void setX(kiểu) với chữ hoa sau is/set. Property access của JPA (đặc tả §2.2) và EL đều dựa vào các tên này. A đảo kiểu trả về, B không có tiền tố is/get/set, D sai chữ hoa (getactive không phải thuộc tính \"active\")." },
    { id: 'q2',
      question: 'By default (no fetch attribute), when does JPA load the HumanType referenced by a Human field annotated @ManyToOne?|||Mặc định (không ghi thuộc tính fetch), JPA nạp HumanType được tham chiếu bởi một trường Human có @ManyToOne lúc nào?',
      options: ['Eagerly — together with the Human, because @ManyToOne defaults to FetchType.EAGER|||Ngay lập tức — cùng lúc với Human, vì @ManyToOne mặc định là FetchType.EAGER', 'Lazily — only when getType() is called, because every relationship is LAZY by default|||Khi cần — chỉ lúc gọi getType(), vì mọi quan hệ mặc định đều LAZY', 'Never — you must call em.find(HumanType.class, id) yourself|||Không bao giờ — bạn phải tự gọi em.find(HumanType.class, id)', 'Only if the HumanType class lists the Human in a @OneToMany|||Chỉ khi lớp HumanType liệt kê Human trong một @OneToMany'],
      correctIndex: 0,
      points: 1,
      explanation: "Spec §11.1.30: ManyToOne's fetch() defaults to EAGER (OneToOne too); OneToMany and ManyToMany default to LAZY. Measured in jpa-quan-he#eager: the three HumanType SELECTs ran right after the Human query, before the loop touched getType(). B is the classic mix-up (only collections are LAZY by default); the inverse @OneToMany (D) is optional and changes nothing here.|||Đặc tả §11.1.30: fetch() của ManyToOne mặc định là EAGER (OneToOne cũng vậy); OneToMany và ManyToMany mặc định LAZY. Đo trong jpa-quan-he#eager: ba câu SELECT HumanType chạy ngay sau truy vấn Human, trước khi vòng lặp chạm getType(). B là chỗ hay nhầm (chỉ collection mới mặc định LAZY); @OneToMany phía nghịch (D) là tuỳ chọn và không đổi gì ở đây." },
    { id: 'q3',
      question: '(FE question type) In a Java web application using JPA on Tomcat, which object should be created only ONCE for the whole application and shared by all requests?|||(Dạng câu FE) Trong một ứng dụng web Java dùng JPA trên Tomcat, đối tượng nào chỉ nên tạo MỘT lần cho cả ứng dụng và dùng chung cho mọi request?',
      options: ['EntityManager|||EntityManager', 'EntityManagerFactory|||EntityManagerFactory', 'EntityTransaction|||EntityTransaction', 'TypedQuery|||TypedQuery'],
      correctIndex: 1,
      points: 1,
      explanation: 'The factory is expensive (reads persistence.xml, validates every entity, opens a connection pool) and thread-safe (spec §7.3: "Methods of the EntityManagerFactory interface are threadsafe"), so build it once — in jpa-san-pham a ServletContextListener does it at deploy. An EntityManager is cheap but NOT thread-safe (§7.2), so one per request; a transaction and a query belong to one EntityManager.|||Factory tốn kém (đọc persistence.xml, kiểm mọi entity, mở pool kết nối) và an toàn đa luồng (đặc tả §7.3: "Methods of the EntityManagerFactory interface are threadsafe"), nên dựng một lần — trong jpa-san-pham một ServletContextListener làm việc đó lúc deploy. EntityManager rẻ nhưng KHÔNG an toàn đa luồng (§7.2), nên mỗi request một cái; giao dịch và truy vấn thuộc về một EntityManager.' },
    { id: 'q4',
      question: 'A DAO method on Tomcat (RESOURCE_LOCAL unit) runs the code below. What happens?|||Một phương thức DAO trên Tomcat (unit RESOURCE_LOCAL) chạy đoạn code dưới. Chuyện gì xảy ra?',
      code: `EntityManager em = emf.createEntityManager();
em.persist(new Product(null, "Philips kettle", 459000));   // no begin() / commit()
em.close();`,
      codeLang: 'java',
      options: ['The row is inserted, because persist() writes immediately|||Dòng được thêm, vì persist() ghi ngay lập tức', 'persist() throws TransactionRequiredException|||persist() ném TransactionRequiredException', 'The row is inserted when the EntityManagerFactory is closed|||Dòng được thêm khi EntityManagerFactory được đóng', 'No exception, and nothing is inserted|||Không có exception, và không có gì được thêm'],
      correctIndex: 3,
      points: 1,
      explanation: 'Real run (jpa-slide17#no-tx): persist() returned normally, em.contains(p) was even true, and after close the table still had 2 rows — no INSERT appeared in the SQL log. An application-managed EntityManager may persist outside a transaction, but only a commit (or a flush inside a transaction) writes; flush() without one threw TransactionRequiredException (jpa-slide17#flush). That silence is why "forgot begin/commit" is the most common JPA bug.|||Chạy thật (jpa-slide17#no-tx): persist() trả về bình thường, em.contains(p) còn là true, và sau khi đóng bảng vẫn 2 dòng — không có INSERT nào trong log SQL. EntityManager do ứng dụng quản lý được phép persist ngoài giao dịch, nhưng chỉ commit (hoặc flush trong giao dịch) mới ghi; flush() khi không có giao dịch thì ném TransactionRequiredException (jpa-slide17#flush). Chính sự im lặng đó khiến "quên begin/commit" là lỗi JPA hay gặp nhất.' },
    { id: 'q5',
      question: 'Table Accounts(username, password, full_name, role) is mapped to the entity Account with the field fullName. Which JPQL query is valid?|||Bảng Accounts(username, password, full_name, role) được ánh xạ vào entity Account với trường fullName. Câu JPQL nào hợp lệ?',
      options: ["SELECT * FROM Accounts WHERE full_name LIKE '%Cuong%'|||SELECT * FROM Accounts WHERE full_name LIKE '%Cuong%'", "SELECT a FROM Accounts a WHERE a.fullName LIKE '%Cuong%'|||SELECT a FROM Accounts a WHERE a.fullName LIKE '%Cuong%'", "SELECT a FROM Account a WHERE a.fullName LIKE '%Cuong%'|||SELECT a FROM Account a WHERE a.fullName LIKE '%Cuong%'", "SELECT a FROM Account a WHERE a.full_name LIKE '%Cuong%'|||SELECT a FROM Account a WHERE a.full_name LIKE '%Cuong%'"],
      correctIndex: 2,
      points: 1,
      explanation: "JPQL uses the entity name and field names, never table or column names. Real errors from ch7-jpql: SELECT * ⇒ \"A select statement must have a FROM clause\"; FROM Accounts ⇒ \"The abstract schema type 'Accounts' is unknown\"; a.full_name ⇒ \"The state field path 'a.full_name' cannot be resolved\". The fixed query ran and EclipseLink translated it to ... FROM Accounts WHERE full_name LIKE ?.|||JPQL dùng tên entity và tên trường, không bao giờ dùng tên bảng hay tên cột. Lỗi thật từ ch7-jpql: SELECT * ⇒ \"A select statement must have a FROM clause\"; FROM Accounts ⇒ \"The abstract schema type 'Accounts' is unknown\"; a.full_name ⇒ \"The state field path 'a.full_name' cannot be resolved\". Câu đã sửa chạy được và EclipseLink dịch thành ... FROM Accounts WHERE full_name LIKE ?." },
    { id: 'q6',
      question: 'Human.type is @ManyToOne @JoinColumn(name = "typeid") and HumanType.humans is @OneToMany(mappedBy = "type"). Inside a transaction you run the code below, then commit. What is stored in column typeid for Lan?|||Human.type là @ManyToOne @JoinColumn(name = "typeid") và HumanType.humans là @OneToMany(mappedBy = "type"). Trong một giao dịch bạn chạy đoạn code dưới rồi commit. Cột typeid của Lan được lưu giá trị gì?',
      code: `HumanType student = em.find(HumanType.class, 1);
Human lan = new Human("Lan", LocalDate.of(2005, 3, 14), false);
student.getHumans().add(lan);
em.persist(lan);`,
      codeLang: 'java',
      options: ['NULL — only the owning side (Human.type) is written, and it was never set|||NULL — chỉ phía sở hữu (Human.type) được ghi, mà nó chưa từng được đặt', '1 — JPA reads the list and fills the foreign key|||1 — JPA đọc danh sách và điền khoá ngoại', 'The commit fails because the list was changed|||Commit hỏng vì danh sách bị thay đổi', '1, but only if the list is a Set instead of a List|||1, nhưng chỉ khi danh sách là Set thay vì List'],
      correctIndex: 0,
      points: 1,
      explanation: 'Real run (jpa-quan-he#owning-wrong): INSERT ... bind => [2005-03-14, false, Lan, null] and the row read back with typeid=null. Spec §2.10: the owning side determines the updates to the relationship; the side with mappedBy is the inverse side and is ignored when writing. lan.setType(student) gave typeid=1 (#owning-right). B is what beginners expect.|||Chạy thật (jpa-quan-he#owning-wrong): INSERT ... bind => [2005-03-14, false, Lan, null] và dòng đọc lại có typeid=null. Đặc tả §2.10: phía sở hữu quyết định việc cập nhật quan hệ; phía có mappedBy là phía nghịch và bị bỏ qua khi ghi. lan.setType(student) cho typeid=1 (#owning-right). B là điều người mới hay nghĩ.' },
    { id: 'q7',
      question: 'Table Human has 8 rows that use 3 different types. With the default @ManyToOne mapping, how many SELECT statements does this code send (the persistence context starts empty, no shared cache)?|||Bảng Human có 8 dòng dùng 3 loại khác nhau. Với ánh xạ @ManyToOne mặc định, đoạn code này gửi bao nhiêu câu SELECT (persistence context lúc đầu rỗng, không cache dùng chung)?',
      code: `for (Human h : em.createQuery("SELECT h FROM Human h", Human.class).getResultList())
    out.println(h.getName() + " - " + h.getType().getName());`,
      codeLang: 'java',
      options: ['1|||1', '4|||4', '9|||9', '8|||8'],
      correctIndex: 1,
      points: 1,
      explanation: 'Real run (jpa-quan-he#eager, shared cache off): 1 SELECT for the humans + 1 SELECT per DIFFERENT type = 1 + 3. This is the N+1 problem; N is 3, not 8, because the persistence context returns the same HumanType object for the same id. 9 would be the count with no persistence context at all. JOIN FETCH h.type made it 1 SELECT (#join-fetch).|||Chạy thật (jpa-quan-he#eager, tắt cache dùng chung): 1 SELECT cho người + 1 SELECT cho mỗi loại KHÁC NHAU = 1 + 3. Đây là vấn đề N+1; N là 3, không phải 8, vì persistence context trả cùng một đối tượng HumanType cho cùng một id. 9 là số câu nếu không có persistence context. JOIN FETCH h.type biến nó thành 1 SELECT (#join-fetch).' },
    { id: 'q8',
      question: "Slide 17's catch block is below. The commit() fails because name is NULL in a NOT NULL column. What does the caller see?|||Khối catch của slide 17 ở dưới. commit() hỏng vì name là NULL trong một cột NOT NULL. Nơi gọi thấy gì?",
      code: `} catch (Exception e) {
    if (entityTransaction != null) {
        entityTransaction.rollback();
    }
    System.out.print("Error add new product" + e);
}`,
      codeLang: 'java',
      options: ['Only the text "Error add new product" followed by the SQL error|||Chỉ dòng chữ "Error add new product" kèm lỗi SQL', 'Nothing — the error is swallowed and the method returns normally|||Không gì cả — lỗi bị nuốt và phương thức trả về bình thường', 'A RollbackException that names the NULL column|||Một RollbackException ghi rõ cột bị NULL', 'An IllegalStateException "No transaction is currently active" thrown by rollback(), hiding the real error|||Một IllegalStateException "No transaction is currently active" do rollback() ném ra, che mất lỗi thật'],
      correctIndex: 3,
      points: 1,
      explanation: "Real run (jpa-slide17#slide17-null): Tomcat answered 500 with java.lang.IllegalStateException: No transaction is currently active, from EntityTransactionImpl.rollback. A failed commit has already rolled back, so the transaction is no longer active; the second rollback throws from inside the catch and replaces the real cause (SQL Server error 515), which appeared only in EclipseLink's own log. Fix: if (tx.isActive()) tx.rollback(); and rethrow. B would be true only if the commit succeeded.|||Chạy thật (jpa-slide17#slide17-null): Tomcat trả 500 với java.lang.IllegalStateException: No transaction is currently active, từ EntityTransactionImpl.rollback. Commit hỏng thì đã tự rollback, nên giao dịch không còn hoạt động; lần rollback thứ hai ném ra từ trong catch và thế chỗ nguyên nhân thật (lỗi SQL Server 515), thứ chỉ hiện trong log riêng của EclipseLink. Sửa: if (tx.isActive()) tx.rollback(); và ném lại. B chỉ đúng nếu commit thành công." },
    { id: 'q9',
      question: 'According to the Jakarta Persistence specification, which of these is NOT required for every entity class?|||Theo đặc tả Jakarta Persistence, điều nào dưới đây KHÔNG bắt buộc với mọi lớp entity?',
      options: ['A no-arg constructor that is public or protected|||Một constructor không tham số là public hoặc protected', 'The class is not final and has no final persistent fields|||Lớp không final và không có trường lưu trữ nào final', 'Implementing java.io.Serializable|||Cài đặt java.io.Serializable', 'A primary key (@Id, @EmbeddedId or @IdClass)|||Một khoá chính (@Id, @EmbeddedId hoặc @IdClass)'],
      correctIndex: 2,
      points: 1,
      explanation: 'Spec §2.1: Serializable is required only "if an entity instance is to be passed by value as a detached object (e.g., through a remote interface)" — slide 6 says the same; NetBeans adds it anyway. A no-arg constructor and a primary key are mandatory — ch7-loi-entity shows EclipseLink refusing a class without either ("The instance creation method ... does not exist", "has no primary key specified"); not final is required so the provider can extend or proxy it.|||Đặc tả §2.1: Serializable chỉ bắt buộc "nếu một entity được truyền theo giá trị dưới dạng đối tượng detached (vd qua một remote interface)" — slide 6 cũng nói vậy; NetBeans vẫn tự thêm. Constructor không tham số và khoá chính là bắt buộc — ch7-loi-entity cho thấy EclipseLink từ chối lớp thiếu một trong hai ("The instance creation method ... does not exist", "has no primary key specified"); không final là bắt buộc để provider kế thừa hoặc làm proxy được.' },
    { id: 'q10',
      question: "A login DAO builds JPQL by concatenation, as below. The attacker types x' OR 'a'='a as both username and password. What happens, and what is the fix?|||Một DAO đăng nhập dựng JPQL bằng cách nối chuỗi như dưới. Kẻ tấn công gõ x' OR 'a'='a vào cả ô tên đăng nhập và mật khẩu. Chuyện gì xảy ra, và sửa thế nào?",
      code: `String jpql = "SELECT a FROM Account a WHERE a.username = '" + u + "' AND a.password = '" + p + "'";
List<Account> found = em.createQuery(jpql, Account.class).getResultList();`,
      codeLang: 'java',
      options: ['Nothing — JPA escapes the quotes automatically, so the login fails|||Không gì cả — JPA tự thoát dấu nháy, nên đăng nhập hỏng', 'Every account matches and the attacker logs in; use :u / :p with setParameter|||Mọi tài khoản đều khớp và kẻ tấn công đăng nhập được; dùng :u / :p với setParameter', 'The query throws a syntax error, so the site is safe|||Câu truy vấn ném lỗi cú pháp, nên trang an toàn', 'Every account matches; the fix is to switch the DAO back to JDBC Statement|||Mọi tài khoản đều khớp; cách sửa là chuyển DAO về Statement của JDBC'],
      correctIndex: 1,
      points: 1,
      explanation: "Real run (ch7-jpql#login-inject): \"Logged in as admin (4 row(s) matched)\" — the WHERE became username = 'x' OR 'a'='a' AND password = 'x' OR 'a'='a'. EclipseLink even bound the literals as ?, but the structure had already been changed by the input. With named parameters the same input is just a value: \"Login failed\" (#login-inject-safe). A JDBC Statement (D) concatenates too; the JDBC equivalent of the fix is PreparedStatement.|||Chạy thật (ch7-jpql#login-inject): \"Logged in as admin (4 row(s) matched)\" — WHERE thành username = 'x' OR 'a'='a' AND password = 'x' OR 'a'='a'. EclipseLink còn gắn các hằng thành ?, nhưng cấu trúc câu đã bị dữ liệu nhập làm đổi từ trước. Với tham số có tên, cùng input chỉ là một giá trị: \"Login failed\" (#login-inject-safe). Statement của JDBC (D) cũng nối chuỗi; cách sửa tương đương bên JDBC là PreparedStatement." },
  ],
};

const QUIZ_LESSON = {
  title: 'Quiz Ch.7 — JPA: entities, EntityManager, transactions, JPQL, relationships|||Quiz Ch.7 — JPA: entity, EntityManager, giao dịch, JPQL, quan hệ',
  slug: 'prj301-quiz-ch7',
  type: 'QUIZ',
  description: '10 câu ôn Chương 7: getter JavaBeans của trường boolean (dạng câu FE), kiểu nạp mặc định của @ManyToOne, đối tượng nào tạo một lần cho cả ứng dụng (dạng câu FE), persist mà không có giao dịch, viết lại một câu JPQL kiểu SQL, owning side và mappedBy, đếm số câu SELECT của một trang dính N+1, khối catch của slide 17, yêu cầu nào KHÔNG bắt buộc với entity, và JPQL injection — mỗi câu có giải thích song ngữ, các câu về kết quả đều đối chiếu với app chạy thật trên Tomcat 10.1 + EclipseLink 4 + SQL Server.',
  quiz: QUIZ,
};

export default {
  slides: [L_prj8_1],
  practice: L_on_ch7,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 7: getter JavaBeans của trường boolean (dạng câu FE), kiểu nạp mặc định của @ManyToOne, đối tượng nào tạo một lần cho cả ứng dụng (dạng câu FE), persist mà không có giao dịch, viết lại một câu JPQL kiểu SQL, owning side và mappedBy, đếm số câu SELECT của một trang dính N+1, khối catch của slide 17, yêu cầu nào KHÔNG bắt buộc với entity, và JPQL injection — mỗi câu có giải thích song ngữ, các câu về kết quả đều đối chiếu với app chạy thật trên Tomcat 10.1 + EclipseLink 4 + SQL Server.',
  quizLesson: QUIZ_LESSON,
};
