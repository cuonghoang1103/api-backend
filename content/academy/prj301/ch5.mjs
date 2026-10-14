/**
 * PRJ301 · Chương 5 — JDBC & mẫu DAO (prj2).
 * Bài 📑 học theo từng slide: prj2 (undefined, slide 1–40).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: prj301-on-ch5.
 * Quiz MỚI (10 câu, slug prj301-quiz-ch5).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRJ301/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRJ301/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 5.A — 📑 Slide by slide · JDBC (1/2): databases, SQL, the JDBC API & driver types (Slot 6–10, slides 1–17) ───────── */
const L_prj2_1 = {
  title: '5.A — 📑 Slide by slide · JDBC (1/2): databases, SQL, the JDBC API & driver types (Slot 6–10, slides 1–17)|||5.A — 📑 Học theo từng slide · JDBC (1/2): cơ sở dữ liệu, SQL, JDBC API & các loại driver (Slot 6–10, slide 1–17)',
  slug: 'prj301-slide-prj2-1',
  type: 'VIDEO',
  description: 'Giảng slide 1–17 bộ "Lecture 05, JDBC Database Access" (Slot 6–10): vì sao học JDBC, cơ sở dữ liệu và DBMS, cơ sở dữ liệu quan hệ, ba nhóm câu lệnh SQL (DDL/DML/DCL — chạy thật GRANT/DENY trên SQL Server), JDBC API gồm DriverManager và các interface Connection/Statement/ResultSet, mô hình một ứng dụng JDBC, và bốn loại JDBC driver (Type 1 ODBC bridge đã chết, Type 2 native, Type 3 network, Type 4 thin của mssql-jdbc) — mọi ví dụ chạy thật trên Tomcat 10.1 kết nối SQL Server thật, câu lệnh và kết quả ghi lại từ server, sơ đồ dựng bằng PlantUML.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.A · school deck "Lecture 05, JDBC Database Access" (Slot 6–10), slides 1–17</span>
<h2>JDBC — how Java code reads and writes a real database</h2>
<p class="lead">Until now a servlet produced its answer from Java alone. From here the answer comes from a <strong>database</strong>: the product list, the account you log in with, the booking you just made. <strong>JDBC</strong> (Java Database Connectivity) is the standard way Java talks to any relational database — here Microsoft SQL Server, the one the Assignment and the PE use. This first half builds the picture (databases, SQL, the API, the driver); Lesson 5.B writes the five steps as real, running code.</p>
<p>Why it matters most: JDBC is the single biggest part of the <strong>PE</strong> (login + role filter + CRUD/search on SQL Server) and of the <strong>Assignment</strong>. Every example on these pages is a mini web app the site deployed on a real Tomcat 10.1 that connected to a real SQL Server — the SQL you see was sent, the rows you see came back.</p>
<table>
<thead><tr><th>Lesson</th><th>School slides</th><th>What you will be able to do</th></tr></thead>
<tbody>
<tr><td>5.A (this one)</td><td>1–17</td><td>explain databases, the three SQL languages, the JDBC API (DriverManager + interfaces), and the four driver types</td></tr>
<tr><td>5.B</td><td>18–40</td><td>write the five JDBC steps; use PreparedStatement to stop SQL injection; read a ResultSet; build a full CRUD DAO with MVC</td></tr>
</tbody>
</table>
<div class="callout"><strong>The driver here is Type 4 <code>mssql-jdbc</code> 12.8.</strong> The slides show the Microsoft JDBC Driver 12.4; this course uses 12.8.1, a pure-Java Type 4 driver that talks SQL Server's own protocol (TDS) over a socket. One thing changed since the slides were written: from driver <strong>10.2 (2022)</strong> encryption is <strong>on by default</strong>, so every connection string here ends with <code>;encrypt=true;trustServerCertificate=true</code> — Lesson 5.B shows the exact error you get without it.</div>`,
    `<span class="eyebrow">Chương 5 · Bài 5.A · bộ slide "Lecture 05, JDBC Database Access" của trường (Slot 6–10), slide 1–17</span>
<h2>JDBC — code Java đọc và ghi một cơ sở dữ liệu thật ra sao</h2>
<p class="lead">Tới giờ servlet tạo câu trả lời chỉ bằng Java. Từ đây câu trả lời đến từ <strong>cơ sở dữ liệu</strong>: danh sách sản phẩm, tài khoản bạn đăng nhập, đơn đặt phòng bạn vừa tạo. <strong>JDBC</strong> (Java Database Connectivity — kết nối cơ sở dữ liệu của Java) là cách chuẩn để Java nói chuyện với bất kỳ CSDL quan hệ nào — ở đây là Microsoft SQL Server, đúng loại Assignment và PE dùng. Nửa đầu này dựng bức tranh (CSDL, SQL, API, driver); bài 5.B viết năm bước thành code chạy thật.</p>
<p>Vì sao quan trọng nhất: JDBC là phần lớn nhất của bài <strong>PE</strong> (đăng nhập + filter phân quyền + CRUD/tìm kiếm trên SQL Server) và của <strong>Assignment</strong>. Mọi ví dụ trên các trang này là một ứng dụng web nhỏ mà web đã deploy lên một Tomcat 10.1 thật, kết nối tới một SQL Server thật — câu SQL bạn thấy đã được gửi đi, các dòng bạn thấy đã trả về.</p>
<table>
<thead><tr><th>Bài</th><th>Slide trường</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>5.A (bài này)</td><td>1–17</td><td>giải thích CSDL, ba nhóm câu lệnh SQL, JDBC API (DriverManager + các interface), và bốn loại driver</td></tr>
<tr><td>5.B</td><td>18–40</td><td>viết năm bước JDBC; dùng PreparedStatement chặn SQL injection; đọc ResultSet; dựng DAO CRUD đầy đủ theo MVC</td></tr>
</tbody>
</table>
<div class="callout"><strong>Driver ở đây là Type 4 <code>mssql-jdbc</code> 12.8.</strong> Slide ghi Microsoft JDBC Driver 12.4; môn này dùng 12.8.1 — một driver Type 4 thuần Java, nói trực tiếp giao thức riêng của SQL Server (TDS) qua một socket. Có một điểm đổi so với lúc viết slide: từ driver <strong>10.2 (2022)</strong> mã hoá <strong>bật mặc định</strong>, nên mọi chuỗi kết nối ở đây đều kết thúc bằng <code>;encrypt=true;trustServerCertificate=true</code> — bài 5.B cho xem đúng lỗi bạn gặp nếu thiếu.</div>`),
    walkHead('prj2', 1, 17),
    walk('prj2', [
      [1, 'Lecture 05 JDBC Database Access',
        `<p class="y-chinh">🎯 The fifth deck of PRJ301 (Slot 6–10, five slots): JDBC — Java Database Connectivity — the API that lets a Java program store and fetch data in a database management system.</p>
<p>The reference on the slide is Oracle's own guide, <em>The Java Tutorials — JDBC Database Access</em> (<code>docs.oracle.com/javase/tutorial/jdbc</code>), listed as reading article 1 of the syllabus. JDBC has been part of standard Java (J2SE/Java SE) since 1997; the API lives in the package <code>java.sql</code>.</p>
<p>This deck is almost entirely about <strong>SQL Server</strong>, because that is the DBMS of the course, the Assignment and the PE. In the graduation project LabFlow you will use PostgreSQL instead — the JDBC API is identical, only the driver and the connection string change.</p>
<p class="meo">🧠 One sentence for the whole deck: <em>JDBC is five steps — load the driver, open a connection, send SQL, read the result, close everything.</em></p>`,
        `<p class="y-chinh">🎯 Bộ slide thứ năm của PRJ301 (Slot 6–10, năm buổi): JDBC — Java Database Connectivity — API cho phép một chương trình Java lưu và lấy dữ liệu trong một hệ quản trị cơ sở dữ liệu.</p>
<p>Tài liệu tham khảo trên slide là hướng dẫn của chính Oracle, <em>The Java Tutorials — JDBC Database Access</em> (<code>docs.oracle.com/javase/tutorial/jdbc</code>), là bài đọc 1 của syllabus. JDBC là một phần của Java chuẩn (J2SE/Java SE) từ năm 1997; API nằm trong gói <code>java.sql</code>.</p>
<p>Bộ này gần như hoàn toàn nói về <strong>SQL Server</strong>, vì đó là DBMS của môn, của Assignment và của PE. Trong đồ án tốt nghiệp LabFlow bạn dùng PostgreSQL thay thế — API JDBC y hệt, chỉ đổi driver và chuỗi kết nối.</p>
<p class="meo">🧠 Một câu cho cả deck: <em>JDBC là năm bước — nạp driver, mở kết nối, gửi SQL, đọc kết quả, đóng mọi thứ.</em></p>`],
      [2, 'Why should you study this lecture?',
        `<p class="y-chinh">🎯 Almost every large application stores its data in a database managed by a DBMS (MS SQL Server, Oracle, MySQL, PostgreSQL…); being able to connect a program to a DBMS is a skill a programmer cannot skip.</p>
<p>Think of any real app: a shop remembers products and orders, a school remembers students and grades, a chat remembers messages. None of that can live only in Java variables — it must survive restarts, be shared between users, and hold millions of rows. That is what a database is for, and JDBC is the bridge from your Java to it.</p>
<p><strong>"Managed by a DBMS"</strong>: you do not read the raw file on disk yourself. You ask the DBMS (the software — SQL Server) in the SQL language, and it handles storage, searching, concurrent users and permissions for you.</p>
<p class="meo">🧠 The browser never touches the database. Only the server (your servlet, through JDBC) does — slide 9 of the first deck drew exactly this line.</p>`,
        `<p class="y-chinh">🎯 Gần như mọi ứng dụng lớn đều lưu dữ liệu trong một cơ sở dữ liệu do một DBMS quản lý (MS SQL Server, Oracle, MySQL, PostgreSQL…); biết kết nối chương trình tới một DBMS là kỹ năng lập trình viên không thể bỏ qua.</p>
<p>Nghĩ tới bất kỳ app thật nào: một cửa hàng phải nhớ sản phẩm và đơn hàng, một trường nhớ sinh viên và điểm, một ứng dụng chat nhớ tin nhắn. Những thứ đó không thể chỉ nằm trong biến Java — chúng phải sống sót qua lần khởi động lại, dùng chung giữa nhiều người, chứa hàng triệu dòng. Đó là việc của cơ sở dữ liệu, và JDBC là cây cầu từ Java của bạn tới nó.</p>
<p><strong>"Do một DBMS quản lý"</strong>: bạn không tự đọc file thô trên đĩa. Bạn nhờ DBMS (phần mềm — SQL Server) bằng ngôn ngữ SQL, và nó lo việc lưu trữ, tìm kiếm, nhiều người dùng cùng lúc và phân quyền cho bạn.</p>
<p class="meo">🧠 Trình duyệt không bao giờ chạm vào cơ sở dữ liệu. Chỉ server (servlet của bạn, qua JDBC) chạm thôi — slide 9 của bộ đầu tiên đã vẽ đúng ranh giới này.</p>`],
      [3, 'Objectives',
        `<p class="y-chinh">🎯 Four goals: understand databases and the relational model, understand JDBC and its driver types, learn the steps to develop a JDBC application, and see demonstrations.</p>
<p>The deck follows these in order: slides 5–6 the database and the relational model, 7–8 SQL, 9–17 JDBC and the four driver types, 18–26 the five steps in detail, 27–38 three demonstrations that build a working web app. This lesson (5.A) covers goals 1–3's theory; Lesson 5.B covers the steps and the demos as code you can run.</p>
<p class="meo">🧠 A "demonstration" here means a small running program — on this site those are real web apps on Tomcat, not screenshots of NetBeans.</p>`,
        `<p class="y-chinh">🎯 Bốn mục tiêu: hiểu cơ sở dữ liệu và mô hình quan hệ, hiểu JDBC và các loại driver, học các bước phát triển một ứng dụng JDBC, và xem các ví dụ minh hoạ.</p>
<p>Bộ slide đi theo đúng thứ tự này: slide 5–6 cơ sở dữ liệu và mô hình quan hệ, 7–8 SQL, 9–17 JDBC và bốn loại driver, 18–26 năm bước chi tiết, 27–38 ba ví dụ minh hoạ dựng nên một ứng dụng web chạy được. Bài này (5.A) phủ phần lý thuyết của mục tiêu 1–3; bài 5.B phủ các bước và các demo dưới dạng code bạn chạy được.</p>
<p class="meo">🧠 "Demonstration" (ví dụ minh hoạ) ở đây nghĩa là một chương trình nhỏ chạy được — trên web này chúng là các ứng dụng web thật trên Tomcat, không phải ảnh chụp NetBeans.</p>`],
      [4, 'Contents',
        `<p class="y-chinh">🎯 The five parts of the deck: (1) Database and DBMS, (2) Relational Database Overview, (3) JDBC and JDBC Drivers, (4) Steps to develop a JDBC Application, (5) A Demonstration.</p>
<p>Use this as a map. Parts 1–3 are this lesson; parts 4–5 are Lesson 5.B. The two words to keep apart from the start: a <strong>database</strong> is the data (tables, rows); a <strong>DBMS</strong> is the program that manages it (SQL Server). JDBC connects your Java to the DBMS.</p>`,
        `<p class="y-chinh">🎯 Năm phần của bộ slide: (1) Cơ sở dữ liệu và DBMS, (2) Tổng quan CSDL quan hệ, (3) JDBC và các JDBC driver, (4) Các bước phát triển ứng dụng JDBC, (5) Một ví dụ minh hoạ.</p>
<p>Dùng cái này làm bản đồ. Phần 1–3 là bài này; phần 4–5 là bài 5.B. Hai từ cần phân biệt ngay từ đầu: <strong>cơ sở dữ liệu (database)</strong> là dữ liệu (bảng, dòng); <strong>DBMS</strong> là chương trình quản lý nó (SQL Server). JDBC nối Java của bạn tới DBMS.</p>`],
      [5, '1- Database and DBMS',
        `<p class="y-chinh">🎯 A <strong>database</strong> is a collection of related data stored in secondary storage and used by several processes at once; a <strong>DBMS</strong> is the software that manages databases — creating, updating, querying — and provides security.</p>
<p><strong>"Secondary storage"</strong> = disk/SSD, not RAM: the data stays after the power is off. <strong>"Used by several processes concurrently"</strong>: many users hit the same database at the same time, and the DBMS keeps that correct (this is why Chapter 5 later cares about transactions and connection pools).</p>
<p>The slide says databases are "organised to reduce redundancies" — do not store the same fact twice. That is <em>normalisation</em> (you saw it in DBI202): instead of repeating a supplier's name on every item, keep suppliers in their own table and point to them by a code.</p>
<p class="meo">🧠 DBMS libraries are usually written in C/C++ and expose an API; JDBC is the <em>Java</em> API that reaches that software from your code.</p>`,
        `<p class="y-chinh">🎯 <strong>Cơ sở dữ liệu</strong> là một tập hợp dữ liệu có liên quan, lưu ở bộ nhớ ngoài và được nhiều tiến trình dùng cùng lúc; <strong>DBMS</strong> là phần mềm quản lý các CSDL — tạo, cập nhật, truy vấn — và cung cấp cơ chế bảo mật.</p>
<p><strong>"Bộ nhớ ngoài (secondary storage)"</strong> = đĩa/SSD, không phải RAM: dữ liệu còn lại sau khi tắt điện. <strong>"Nhiều tiến trình dùng cùng lúc (concurrently)"</strong>: nhiều người cùng truy cập một CSDL một lúc, và DBMS giữ cho đúng (đây là lý do sau này Chương 5 quan tâm tới transaction và connection pool).</p>
<p>Slide nói CSDL được "tổ chức để giảm trùng lặp (redundancy)" — đừng lưu cùng một thông tin hai lần. Đó là <em>chuẩn hoá (normalisation)</em> (bạn đã gặp ở DBI202): thay vì lặp tên nhà cung cấp trên mỗi mặt hàng, hãy để nhà cung cấp trong bảng riêng và trỏ tới bằng một mã.</p>
<p class="meo">🧠 Thư viện của DBMS thường viết bằng C/C++ và cung cấp một API; JDBC là API <em>Java</em> để chạm tới phần mềm đó từ code của bạn.</p>`],
      [6, '2- Relational Database Overview',
        `<p class="y-chinh">🎯 A <strong>relational database</strong> presents data in tables (rows and columns); a table is a <em>relation</em> — a collection of objects of the same type (rows). An <strong>RDBMS</strong> (SQL Server, Oracle, MySQL) handles how data is stored, maintained and retrieved.</p>
<p>The slide shows a table <code>dbo.Items</code>: columns <code>itemCode, itemName, supCode, unit, price</code>; rows like <code>E0001 | Mouse Proview | MT | block 10 | 30</code>. That exact table is built for real on this site — here it is, read back from SQL Server through JDBC:</p>
<p class="ghi-chu">📄 <code>jdbc-items/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">-- DML: INSERT / UPDATE / DELETE / SELECT work on the ROWS
INSERT INTO Suppliers VALUES ('MT', N'Minh Tâm Computer'), ('HT', N'Hoàng Trung Tech');
INSERT INTO Items VALUES
    ('E0001', N'Mouse Proview',     'MT', N'block 10', 30),
    ('E0002', N'Keyboard Proview',  'MT', N'block 10', 40),
    ('E0003', N'LCD',               'MT', N'1-unit',   90),
    ('E0004', N'Main Asus MK1234',  'HT', N'1-unit',   78),
    ('E0005', N'Main Gigabyte GM34A','HT', N'1-unit',  67);</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/sql?demo=all HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 302

SQL&gt; SELECT itemCode, itemName, supCode, unit, price FROM Items ORDER BY itemCode
E0002 | Keyboard Proview | MT | block 10 | 45
E0003 | LCD | MT | 1-unit | 95
E0004 | Main Asus MK1234 | HT | 1-unit | 78
E0005 | Main Gigabyte GM34A | HT | 1-unit | 67
E0007 | Tai nghe Sony | MT | 1-unit | 60
(5 row(s))</code></pre>
<p>"Based on relational algebra (set theory)" means the result of a query is itself a table, so you can feed one query's result into another (joins, sub-queries). <code>dbo</code> is the default <em>schema</em> — a namespace for tables in SQL Server.</p>`,
        `<p class="y-chinh">🎯 Một <strong>CSDL quan hệ (relational)</strong> trình bày dữ liệu dưới dạng bảng (dòng và cột); một bảng là một <em>quan hệ (relation)</em> — tập hợp các đối tượng cùng loại (các dòng). Một <strong>RDBMS</strong> (SQL Server, Oracle, MySQL) lo cách dữ liệu được lưu, duy trì và lấy ra.</p>
<p>Slide cho xem bảng <code>dbo.Items</code>: các cột <code>itemCode, itemName, supCode, unit, price</code>; các dòng như <code>E0001 | Mouse Proview | MT | block 10 | 30</code>. Đúng bảng đó được dựng thật trên web này — đây, đọc lại từ SQL Server qua JDBC:</p>
<p class="ghi-chu">📄 <code>jdbc-items/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">-- DML: INSERT / UPDATE / DELETE / SELECT làm việc trên các DÒNG
INSERT INTO Suppliers VALUES ('MT', N'Minh Tâm Computer'), ('HT', N'Hoàng Trung Tech');
INSERT INTO Items VALUES
    ('E0001', N'Mouse Proview',     'MT', N'block 10', 30),
    ('E0002', N'Keyboard Proview',  'MT', N'block 10', 40),
    ('E0003', N'LCD',               'MT', N'1-unit',   90),
    ('E0004', N'Main Asus MK1234',  'HT', N'1-unit',   78),
    ('E0005', N'Main Gigabyte GM34A','HT', N'1-unit',  67);</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/sql?demo=all HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 302

SQL&gt; SELECT itemCode, itemName, supCode, unit, price FROM Items ORDER BY itemCode
E0002 | Keyboard Proview | MT | block 10 | 45
E0003 | LCD | MT | 1-unit | 95
E0004 | Main Asus MK1234 | HT | 1-unit | 78
E0005 | Main Gigabyte GM34A | HT | 1-unit | 67
E0007 | Tai nghe Sony | MT | 1-unit | 60
(5 row(s))</code></pre>
<p>"Dựa trên đại số quan hệ (lý thuyết tập hợp)" nghĩa là kết quả một truy vấn tự nó cũng là một bảng, nên bạn đưa kết quả truy vấn này vào một truy vấn khác được (join, truy vấn con). <code>dbo</code> là <em>schema</em> mặc định — một không gian tên cho các bảng trong SQL Server.</p>`],
      [7, 'RDBMS: Structure Query Language (SQL)',
        `<p class="y-chinh">🎯 SQL has three families of statements: <strong>DDL</strong> (define structure: CREATE / ALTER / DROP), <strong>DML</strong> (work on rows: SELECT / INSERT / UPDATE / DELETE), and <strong>DCL</strong> (control access: GRANT / REVOKE / DENY).</p>
<p>The <code>setup.sql</code> of our Items demo uses all three. The DDL that creates the tables:</p>
<p class="ghi-chu">📄 <code>jdbc-items/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">-- DDL: CREATE / ALTER / DROP define the STRUCTURE
CREATE TABLE Suppliers (
    supCode VARCHAR(5)    PRIMARY KEY,
    supName NVARCHAR(100) NOT NULL
);
CREATE TABLE Items (
    itemCode VARCHAR(10)   PRIMARY KEY,
    itemName NVARCHAR(100) NOT NULL,
    supCode  VARCHAR(5)    NOT NULL REFERENCES Suppliers(supCode),
    unit     NVARCHAR(20)  NOT NULL,
    price    INT           NOT NULL CHECK (price &gt;= 0)
);</code></pre>
<p>And the DCL — most courses never show it running, so here it is for real. We give a database user <code>viewer</code> permission to SELECT but DENY it DELETE; then the app, impersonating <code>viewer</code>, tries both:</p>
<p class="ghi-chu">📄 <code>jdbc-items/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">-- DCL: GRANT / REVOKE / DENY decide WHO may do WHAT (a database user without a login, for the demo)
CREATE USER viewer WITHOUT LOGIN;
GRANT SELECT ON Items TO viewer;
DENY DELETE ON Items TO viewer;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/sql?demo=dcl-select HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 87

SQL&gt; EXECUTE AS USER = 'viewer'; SELECT COUNT(*) AS n FROM Items; REVERT;
5
(1 row(s))</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/sql?demo=dcl-delete HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/plain;charset=UTF-8
Content-Length: 179

SQL&gt; EXECUTE AS USER = 'viewer'; DELETE FROM Items; REVERT;
SQLServerException: The DELETE permission was denied on the object 'Items', database 'PRJ301_JdbcItems', schema 'dbo'.</code></pre>
<p>SELECT works, DELETE is refused by SQL Server itself — that is DCL enforcing permissions, below your Java code.</p>`,
        `<p class="y-chinh">🎯 SQL có ba nhóm câu lệnh: <strong>DDL</strong> (định nghĩa cấu trúc: CREATE / ALTER / DROP), <strong>DML</strong> (làm việc trên dòng: SELECT / INSERT / UPDATE / DELETE), và <strong>DCL</strong> (điều khiển quyền: GRANT / REVOKE / DENY).</p>
<p><code>setup.sql</code> của demo Items dùng cả ba. Phần DDL tạo các bảng:</p>
<p class="ghi-chu">📄 <code>jdbc-items/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">-- DDL: CREATE / ALTER / DROP định nghĩa CẤU TRÚC
CREATE TABLE Suppliers (
    supCode VARCHAR(5)    PRIMARY KEY,
    supName NVARCHAR(100) NOT NULL
);
CREATE TABLE Items (
    itemCode VARCHAR(10)   PRIMARY KEY,
    itemName NVARCHAR(100) NOT NULL,
    supCode  VARCHAR(5)    NOT NULL REFERENCES Suppliers(supCode),
    unit     NVARCHAR(20)  NOT NULL,
    price    INT           NOT NULL CHECK (price &gt;= 0)
);</code></pre>
<p>Và phần DCL — phần lớn môn học không bao giờ cho xem nó chạy, nên đây là bản chạy thật. Ta cấp cho một user CSDL tên <code>viewer</code> quyền SELECT nhưng DENY (cấm) DELETE; rồi app, đóng vai <code>viewer</code>, thử cả hai:</p>
<p class="ghi-chu">📄 <code>jdbc-items/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">-- DCL: GRANT / REVOKE / DENY quyết định AI được làm GÌ (một user CSDL không có login, để minh hoạ)
CREATE USER viewer WITHOUT LOGIN;
GRANT SELECT ON Items TO viewer;
DENY DELETE ON Items TO viewer;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/sql?demo=dcl-select HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 87

SQL&gt; EXECUTE AS USER = 'viewer'; SELECT COUNT(*) AS n FROM Items; REVERT;
5
(1 row(s))</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/sql?demo=dcl-delete HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/plain;charset=UTF-8
Content-Length: 179

SQL&gt; EXECUTE AS USER = 'viewer'; DELETE FROM Items; REVERT;
SQLServerException: The DELETE permission was denied on the object 'Items', database 'PRJ301_JdbcItems', schema 'dbo'.</code></pre>
<p>SELECT chạy được, DELETE bị chính SQL Server từ chối — đó là DCL thực thi quyền, nằm dưới cả code Java của bạn.</p>`],
      [8, 'RDBMS: SQL — Common DML queries',
        `<p class="y-chinh">🎯 The four DML statements you use every day: <code>SELECT … FROM … WHERE</code>, <code>UPDATE … SET … WHERE</code>, <code>DELETE FROM … WHERE</code>, and two forms of <code>INSERT INTO …</code> (all columns, or named columns).</p>
<p>Here each one runs for real through JDBC against the Items table. A SELECT comes back as rows:</p>
<p class="ghi-chu">📄 <code>jdbc-items/src/main/java/dal/DBContext.java</code></p>
<pre class="web-src"><code class="language-java">package dal;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

// One place that knows how to open a connection to PRJ301_JdbcItems
public class DBContext {
    private static final String HOST = env("DB_HOST", "localhost");      // school PC: localhost
    private static final String PORT = env("DB_PORT", "1433");           // SQL Server's default TCP port
    private static final String USER = env("DB_USER", "sa");
    private static final String PASS = env("DB_PASSWORD", "123");

    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");   // step 1: load the Type 4 driver
        String url = "jdbc:sqlserver://" + HOST + ":" + PORT
                + ";databaseName=PRJ301_JdbcItems;encrypt=true;trustServerCertificate=true";
        return DriverManager.getConnection(url, USER, PASS);              // step 2: open the connection
    }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }
}</code></pre>
<p class="ghi-chu">📄 <code>jdbc-items/src/main/java/controller/SqlServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.DBContext;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Runs ONE of the slide-8 statements, chosen by ?demo=, and prints what JDBC gives back
// The SQL is FIXED text (no user input), so a plain Statement is acceptable here — Lesson 5.B shows why user input needs PreparedStatement
@WebServlet("/sql")
public class SqlServlet extends HttpServlet {
    private static final Map&lt;String, String&gt; DEMOS = Map.of(
        "select",      "SELECT itemCode, itemName, supCode, unit, price FROM Items WHERE price &gt; 50",
        "insert",      "INSERT INTO Items VALUES ('E0006', N'Webcam Logitech C270', 'HT', N'1-unit', 25)",
        "insert-cols", "INSERT INTO Items (itemCode, itemName, supCode, unit, price) VALUES ('E0007', N'Tai nghe Sony', 'MT', N'1-unit', 55)",
        "update",      "UPDATE Items SET price = price + 5 WHERE supCode = 'MT'",
        "delete",      "DELETE FROM Items WHERE price &lt; 40",
        "all",         "SELECT itemCode, itemName, supCode, unit, price FROM Items ORDER BY itemCode",
        "dcl-select",  "EXECUTE AS USER = 'viewer'; SELECT COUNT(*) AS n FROM Items; REVERT;",
        "dcl-delete",  "EXECUTE AS USER = 'viewer'; DELETE FROM Items; REVERT;");

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        String sql = DEMOS.get(String.valueOf(req.getParameter("demo")));
        if (sql == null) { resp.setStatus(400); out.println("Unknown demo. Use one of: " + new java.util.TreeSet&lt;&gt;(DEMOS.keySet())); return; }
        out.println("SQL&gt; " + sql);
        try (Connection con = DBContext.getConnection();
             Statement stmt = con.createStatement()) {
            if (sql.contains("SELECT")) {                              // a query ⇒ executeQuery ⇒ a ResultSet
                try (ResultSet rs = stmt.executeQuery(sql)) {
                    int cols = rs.getMetaData().getColumnCount(), rows = 0;
                    while (rs.next()) {
                        StringBuilder line = new StringBuilder();
                        for (int i = 1; i &lt;= cols; i++) line.append(i &gt; 1 ? " | " : "").append(rs.getString(i));
                        out.println(line);
                        rows++;
                    }
                    out.println("(" + rows + " row(s))");
                }
            } else {                                                   // INSERT/UPDATE/DELETE ⇒ executeUpdate ⇒ an int
                int affected = stmt.executeUpdate(sql);
                out.println("executeUpdate returned " + affected + " (rows affected)");
            }
        } catch (SQLException | ClassNotFoundException e) {
            resp.setStatus(500);
            out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/sql?demo=select HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 214

SQL&gt; SELECT itemCode, itemName, supCode, unit, price FROM Items WHERE price &gt; 50
E0003 | LCD | MT | 1-unit | 90
E0004 | Main Asus MK1234 | HT | 1-unit | 78
E0005 | Main Gigabyte GM34A | HT | 1-unit | 67
(3 row(s))</code></pre>
<p>INSERT, UPDATE and DELETE do not return rows — they return a <strong>count</strong> of rows changed (that is <code>executeUpdate</code>, Lesson 5.B):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/sql?demo=insert HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 127

SQL&gt; INSERT INTO Items VALUES ('E0006', N'Webcam Logitech C270', 'HT', N'1-unit', 25)
executeUpdate returned 1 (rows affected)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/sql?demo=update HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 102

SQL&gt; UPDATE Items SET price = price + 5 WHERE supCode = 'MT'
executeUpdate returned 4 (rows affected)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/sql?demo=delete HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 81

SQL&gt; DELETE FROM Items WHERE price &lt; 40
executeUpdate returned 2 (rows affected)</code></pre>
<div class="pitfall">Exam trap: a WHERE on UPDATE/DELETE is not optional in practice — <code>DELETE FROM Items</code> with no WHERE empties the whole table. Always write the WHERE first.</div>`,
        `<p class="y-chinh">🎯 Bốn câu lệnh DML bạn dùng mỗi ngày: <code>SELECT … FROM … WHERE</code>, <code>UPDATE … SET … WHERE</code>, <code>DELETE FROM … WHERE</code>, và hai dạng <code>INSERT INTO …</code> (đủ cột, hoặc cột có tên).</p>
<p>Ở đây mỗi câu chạy thật qua JDBC trên bảng Items. SELECT trả về các dòng:</p>
<p class="ghi-chu">📄 <code>jdbc-items/src/main/java/dal/DBContext.java</code></p>
<pre class="web-src"><code class="language-java">package dal;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

// Một chỗ duy nhất biết cách mở kết nối tới PRJ301_JdbcItems
public class DBContext {
    private static final String HOST = env("DB_HOST", "localhost");      // máy trường: localhost
    private static final String PORT = env("DB_PORT", "1433");           // cổng TCP mặc định của SQL Server
    private static final String USER = env("DB_USER", "sa");
    private static final String PASS = env("DB_PASSWORD", "123");

    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");   // bước 1: nạp driver Type 4
        String url = "jdbc:sqlserver://" + HOST + ":" + PORT
                + ";databaseName=PRJ301_JdbcItems;encrypt=true;trustServerCertificate=true";
        return DriverManager.getConnection(url, USER, PASS);              // bước 2: mở kết nối
    }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }
}</code></pre>
<p class="ghi-chu">📄 <code>jdbc-items/src/main/java/controller/SqlServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.DBContext;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Chạy MỘT câu lệnh của slide 8, chọn bằng ?demo=, rồi in ra thứ JDBC trả về
// SQL là chuỗi CỐ ĐỊNH (không có dữ liệu người dùng) nên dùng Statement thường ở đây được — bài 5.B cho thấy vì sao dữ liệu người dùng cần PreparedStatement
@WebServlet("/sql")
public class SqlServlet extends HttpServlet {
    private static final Map&lt;String, String&gt; DEMOS = Map.of(
        "select",      "SELECT itemCode, itemName, supCode, unit, price FROM Items WHERE price &gt; 50",
        "insert",      "INSERT INTO Items VALUES ('E0006', N'Webcam Logitech C270', 'HT', N'1-unit', 25)",
        "insert-cols", "INSERT INTO Items (itemCode, itemName, supCode, unit, price) VALUES ('E0007', N'Tai nghe Sony', 'MT', N'1-unit', 55)",
        "update",      "UPDATE Items SET price = price + 5 WHERE supCode = 'MT'",
        "delete",      "DELETE FROM Items WHERE price &lt; 40",
        "all",         "SELECT itemCode, itemName, supCode, unit, price FROM Items ORDER BY itemCode",
        "dcl-select",  "EXECUTE AS USER = 'viewer'; SELECT COUNT(*) AS n FROM Items; REVERT;",
        "dcl-delete",  "EXECUTE AS USER = 'viewer'; DELETE FROM Items; REVERT;");

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        String sql = DEMOS.get(String.valueOf(req.getParameter("demo")));
        if (sql == null) { resp.setStatus(400); out.println("Unknown demo. Use one of: " + new java.util.TreeSet&lt;&gt;(DEMOS.keySet())); return; }
        out.println("SQL&gt; " + sql);
        try (Connection con = DBContext.getConnection();
             Statement stmt = con.createStatement()) {
            if (sql.contains("SELECT")) {                              // câu truy vấn ⇒ executeQuery ⇒ một ResultSet
                try (ResultSet rs = stmt.executeQuery(sql)) {
                    int cols = rs.getMetaData().getColumnCount(), rows = 0;
                    while (rs.next()) {
                        StringBuilder line = new StringBuilder();
                        for (int i = 1; i &lt;= cols; i++) line.append(i &gt; 1 ? " | " : "").append(rs.getString(i));
                        out.println(line);
                        rows++;
                    }
                    out.println("(" + rows + " row(s))");
                }
            } else {                                                   // INSERT/UPDATE/DELETE ⇒ executeUpdate ⇒ một số int
                int affected = stmt.executeUpdate(sql);
                out.println("executeUpdate returned " + affected + " (rows affected)");
            }
        } catch (SQLException | ClassNotFoundException e) {
            resp.setStatus(500);
            out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/sql?demo=select HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 214

SQL&gt; SELECT itemCode, itemName, supCode, unit, price FROM Items WHERE price &gt; 50
E0003 | LCD | MT | 1-unit | 90
E0004 | Main Asus MK1234 | HT | 1-unit | 78
E0005 | Main Gigabyte GM34A | HT | 1-unit | 67
(3 row(s))</code></pre>
<p>INSERT, UPDATE và DELETE không trả về dòng nào — chúng trả về <strong>số dòng</strong> đã thay đổi (đó là <code>executeUpdate</code>, bài 5.B):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/sql?demo=insert HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 127

SQL&gt; INSERT INTO Items VALUES ('E0006', N'Webcam Logitech C270', 'HT', N'1-unit', 25)
executeUpdate returned 1 (rows affected)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/sql?demo=update HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 102

SQL&gt; UPDATE Items SET price = price + 5 WHERE supCode = 'MT'
executeUpdate returned 4 (rows affected)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/sql?demo=delete HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 81

SQL&gt; DELETE FROM Items WHERE price &lt; 40
executeUpdate returned 2 (rows affected)</code></pre>
<div class="pitfall">Bẫy thi: trên thực tế WHERE của UPDATE/DELETE không phải tuỳ chọn — <code>DELETE FROM Items</code> không có WHERE sẽ xoá sạch cả bảng. Luôn viết WHERE trước.</div>`],
      [9, '3- JDBC and JDBC Driver',
        `<p class="y-chinh">🎯 The JDBC API is a Java API that can access any kind of tabular data, especially data stored in a relational database; it was designed to "keep simple things simple" — the everyday tasks are easy.</p>
<p>Concretely, JDBC is a set of <strong>interfaces</strong> in the package <code>java.sql</code>: <code>Connection</code>, <code>Statement</code>, <code>PreparedStatement</code>, <code>ResultSet</code> and the class <code>DriverManager</code>. Your code only ever touches these standard types — it never names a SQL-Server-specific class.</p>
<p>That is the whole point: write against the interface, and the same code runs against SQL Server, PostgreSQL or MySQL just by swapping the <em>driver</em> (the jar that implements the interfaces for one database). The next slides show how the driver fits in.</p>
<p class="meo">🧠 "Tabular data" = anything in rows and columns. In practice, for this course, it means a SQL Server table.</p>`,
        `<p class="y-chinh">🎯 JDBC API là một API Java truy cập được mọi loại dữ liệu dạng bảng, đặc biệt là dữ liệu lưu trong CSDL quan hệ; nó được thiết kế để "giữ cho việc đơn giản luôn đơn giản" — các việc thường ngày đều dễ.</p>
<p>Cụ thể, JDBC là một bộ <strong>interface</strong> trong gói <code>java.sql</code>: <code>Connection</code>, <code>Statement</code>, <code>PreparedStatement</code>, <code>ResultSet</code> và lớp <code>DriverManager</code>. Code của bạn chỉ chạm tới các kiểu chuẩn này — không bao giờ gọi tên một lớp riêng của SQL Server.</p>
<p>Đó chính là ý nghĩa: viết theo interface, thì cùng một đoạn code chạy được với SQL Server, PostgreSQL hay MySQL chỉ bằng cách đổi <em>driver</em> (jar cài đặt các interface cho một CSDL). Các slide sau cho thấy driver nằm ở đâu.</p>
<p class="meo">🧠 "Tabular data" (dữ liệu dạng bảng) = bất cứ thứ gì có dòng và cột. Thực tế trong môn này, nó nghĩa là một bảng SQL Server.</p>`],
      [10, 'JDBC and JDBC Driver — two parts',
        `<p class="y-chinh">🎯 The JDBC API has two parts in <code>java.sql</code>: the <strong>driver layer</strong> (<code>DriverManager</code>, which loads a concrete driver and hands you a connection) and the <strong>API you program against</strong> (interfaces <code>Connection</code>, <code>Statement</code>, <code>ResultSet</code>, <code>DatabaseMetaData</code>, <code>ResultSetMetaData</code>, plus the class <code>SQLException</code>).</p>
<table>
<thead><tr><th>Type</th><th>What it is for</th></tr></thead>
<tbody>
<tr><td><code>DriverManager</code></td><td>class — <code>Class.forName(DriverClass)</code> loads the vendor's driver; <code>getConnection(…)</code> then returns a Connection</td></tr>
<tr><td><code>Connection</code></td><td>create a connection to a DBMS; create statements; control transactions</td></tr>
<tr><td><code>Statement</code> / <code>PreparedStatement</code></td><td>execute SQL statements</td></tr>
<tr><td><code>ResultSet</code></td><td>hold the rows a SELECT returned and read their columns</td></tr>
<tr><td><code>DatabaseMetaData</code> / <code>ResultSetMetaData</code></td><td>facts about the database, and about one result set</td></tr>
<tr><td><code>SQLException</code></td><td>the checked exception every JDBC call can throw</td></tr>
</tbody>
</table>
<p>You can actually ask the driver who it is. This runs <code>DatabaseMetaData</code> and <code>ResultSetMetaData</code> for real on our SQL Server:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/meta HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 467

DBMS        : Microsoft SQL Server 15.00.2000
Driver      : Microsoft JDBC Driver 12.8 for SQL Server 12.8.1.0
JDBC version: 4.3
Connection  : com.microsoft.sqlserver.jdbc.SQLServerConnection43
ResultSet   : com.microsoft.sqlserver.jdbc.SQLServerResultSet, 5 columns
  column 1: itemCode varchar(10) NOT NULL
  column 2: itemName nvarchar(100) NOT NULL
  column 3: supCode varchar(5) NOT NULL
  column 4: unit nvarchar(20) NOT NULL
  column 5: price int(10) NOT NULL</code></pre>`,
        `<p class="y-chinh">🎯 JDBC API có hai phần trong <code>java.sql</code>: <strong>tầng driver</strong> (<code>DriverManager</code> — nạp một driver cụ thể và đưa bạn một kết nối) và <strong>API bạn lập trình với nó</strong> (các interface <code>Connection</code>, <code>Statement</code>, <code>ResultSet</code>, <code>DatabaseMetaData</code>, <code>ResultSetMetaData</code>, cùng lớp <code>SQLException</code>).</p>
<table>
<thead><tr><th>Kiểu</th><th>Dùng để</th></tr></thead>
<tbody>
<tr><td><code>DriverManager</code></td><td>lớp — <code>Class.forName(DriverClass)</code> nạp driver của hãng; <code>getConnection(…)</code> rồi trả về một Connection</td></tr>
<tr><td><code>Connection</code></td><td>tạo kết nối tới DBMS; tạo statement; điều khiển transaction</td></tr>
<tr><td><code>Statement</code> / <code>PreparedStatement</code></td><td>thực thi câu lệnh SQL</td></tr>
<tr><td><code>ResultSet</code></td><td>giữ các dòng mà SELECT trả về và đọc các cột của chúng</td></tr>
<tr><td><code>DatabaseMetaData</code> / <code>ResultSetMetaData</code></td><td>thông tin về CSDL, và về một result set</td></tr>
<tr><td><code>SQLException</code></td><td>exception kiểm tra (checked) mà mọi lời gọi JDBC có thể ném</td></tr>
</tbody>
</table>
<p>Bạn thật sự hỏi được driver nó là ai. Đoạn này chạy <code>DatabaseMetaData</code> và <code>ResultSetMetaData</code> thật trên SQL Server của ta:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-items/meta HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 467

DBMS        : Microsoft SQL Server 15.00.2000
Driver      : Microsoft JDBC Driver 12.8 for SQL Server 12.8.1.0
JDBC version: 4.3
Connection  : com.microsoft.sqlserver.jdbc.SQLServerConnection43
ResultSet   : com.microsoft.sqlserver.jdbc.SQLServerResultSet, 5 columns
  column 1: itemCode varchar(10) NOT NULL
  column 2: itemName nvarchar(100) NOT NULL
  column 3: supCode varchar(5) NOT NULL
  column 4: unit nvarchar(20) NOT NULL
  column 5: price int(10) NOT NULL</code></pre>`],
      [11, 'JDBC and JDBC Driver — Model of a JDBC App',
        `<p class="y-chinh">🎯 The model of a JDBC application: your Java app asks <code>DriverManager.getConnection()</code> for a <code>Connection</code>, the connection <code>createStatement()</code> gives a <code>Statement</code>, <code>executeQuery()</code> gives a <code>ResultSet</code>, and you process the rows — the real work going through a specific driver loaded by <code>java.lang.Class</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/07735fba0928537ccee6f57112bb814b17ddd9db.svg" alt="Slide 11 redrawn: the java.sql interfaces, the mssql-jdbc classes behind them, and where each call goes" loading="lazy" /><p class="chu-thich">🧩 Slide 11 redrawn: the java.sql interfaces, the mssql-jdbc classes behind them, and where each call goes</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Model of a JDBC application (slide 11): the objects your code touches, and the driver behind them
allowmixing
set separator none
package "java.sql (JDK) — interfaces you program against" {
  class DriverManager &lt;&lt;class&gt;&gt; {
    +getConnection(url, user, pass) : Connection
  }
  interface Connection {
    +createStatement() : Statement
    +prepareStatement(sql) : PreparedStatement
    +setAutoCommit(b) / commit() / rollback()
    +close()
  }
  interface Statement {
    +executeQuery(sql) : ResultSet
    +executeUpdate(sql) : int
  }
  interface PreparedStatement {
    +setXxx(index, value)
    +executeQuery() : ResultSet
    +executeUpdate() : int
  }
  interface ResultSet {
    +next() : boolean
    +getXxx(index or label)
  }
}
package "mssql-jdbc.jar (Microsoft) — loaded by Class.forName" {
  class SQLServerDriver
  class SQLServerConnection
  class SQLServerStatement
  class SQLServerResultSet
}
database "SQL Server" as DB
DriverManager ..&gt; SQLServerDriver : asks the registered driver
DriverManager --&gt; Connection : returns
Connection --&gt; Statement : creates
Statement &lt;|-- PreparedStatement
Statement --&gt; ResultSet : executeQuery()
SQLServerConnection ..|&gt; Connection
SQLServerStatement ..|&gt; Statement
SQLServerResultSet ..|&gt; ResultSet
SQLServerDriver --&gt; DB : TDS protocol over TCP 1433
@enduml</code></pre></details>
<p>Read it top to bottom: <code>DriverManager</code> → <code>Connection</code> → <code>Statement</code> → <code>ResultSet</code>. Each is an <em>interface</em>; the object you actually hold is a <code>SQLServer…</code> class from the driver jar, which you never name. The arrows <code>getConnection()</code>, <code>createStatement()</code>, <code>executeQuery()</code> are the exact method calls of the five steps.</p>
<p class="meo">🧠 Memorise this chain — the five steps on slide 21 are just this picture written as code, in this order.</p>`,
        `<p class="y-chinh">🎯 Mô hình một ứng dụng JDBC: app Java của bạn hỏi <code>DriverManager.getConnection()</code> để lấy một <code>Connection</code>, kết nối <code>createStatement()</code> cho một <code>Statement</code>, <code>executeQuery()</code> cho một <code>ResultSet</code>, và bạn xử lý các dòng — phần việc thật đi qua một driver cụ thể được <code>java.lang.Class</code> nạp vào.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/07735fba0928537ccee6f57112bb814b17ddd9db.svg" alt="Slide 11 vẽ lại: các interface java.sql, các lớp mssql-jdbc nằm sau chúng, và mỗi lời gọi đi đâu" loading="lazy" /><p class="chu-thich">🧩 Slide 11 vẽ lại: các interface java.sql, các lớp mssql-jdbc nằm sau chúng, và mỗi lời gọi đi đâu</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Model of a JDBC application (slide 11): the objects your code touches, and the driver behind them
allowmixing
set separator none
package "java.sql (JDK) — interfaces you program against" {
  class DriverManager &lt;&lt;class&gt;&gt; {
    +getConnection(url, user, pass) : Connection
  }
  interface Connection {
    +createStatement() : Statement
    +prepareStatement(sql) : PreparedStatement
    +setAutoCommit(b) / commit() / rollback()
    +close()
  }
  interface Statement {
    +executeQuery(sql) : ResultSet
    +executeUpdate(sql) : int
  }
  interface PreparedStatement {
    +setXxx(index, value)
    +executeQuery() : ResultSet
    +executeUpdate() : int
  }
  interface ResultSet {
    +next() : boolean
    +getXxx(index or label)
  }
}
package "mssql-jdbc.jar (Microsoft) — loaded by Class.forName" {
  class SQLServerDriver
  class SQLServerConnection
  class SQLServerStatement
  class SQLServerResultSet
}
database "SQL Server" as DB
DriverManager ..&gt; SQLServerDriver : asks the registered driver
DriverManager --&gt; Connection : returns
Connection --&gt; Statement : creates
Statement &lt;|-- PreparedStatement
Statement --&gt; ResultSet : executeQuery()
SQLServerConnection ..|&gt; Connection
SQLServerStatement ..|&gt; Statement
SQLServerResultSet ..|&gt; ResultSet
SQLServerDriver --&gt; DB : TDS protocol over TCP 1433
@enduml</code></pre></details>
<p>Đọc từ trên xuống: <code>DriverManager</code> → <code>Connection</code> → <code>Statement</code> → <code>ResultSet</code>. Mỗi cái là một <em>interface</em>; đối tượng bạn thật sự cầm là một lớp <code>SQLServer…</code> từ jar driver, mà bạn không bao giờ gọi tên. Các mũi tên <code>getConnection()</code>, <code>createStatement()</code>, <code>executeQuery()</code> chính là các lời gọi phương thức của năm bước.</p>
<p class="meo">🧠 Nhớ chuỗi này — năm bước ở slide 21 chỉ là bức tranh này viết thành code, theo đúng thứ tự này.</p>`],
      [12, 'JDBC and JDBC Driver — four driver types',
        `<p class="y-chinh">🎯 A DBMS vendor supplies a package with classes that implement the standard JDBC driver (free). By how they reach the database, there are four driver types — <strong>Type 1</strong> JDBC-ODBC, <strong>Type 2</strong> Native API, <strong>Type 3</strong> Network Protocol, <strong>Type 4</strong> Native Protocol. Type 1 and Type 4 are the well-known ones.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/64777b20d7f8f5b1fbfbd4225067bb302f87813c.svg" alt="The four driver types: how many layers sit between your Java code and the database" loading="lazy" /><p class="chu-thich">🧩 The four driver types: how many layers sit between your Java code and the database</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title The four JDBC driver types (slides 12–17): how many layers between your Java code and the database
left to right direction
rectangle "Type 4 — native protocol (thin)" as T4 {
  component "Java app" as A4
  component "Type 4 driver\\n(pure Java: mssql-jdbc)" as B4
  A4 --&gt; B4
}
rectangle "Type 3 — network protocol" as T3 {
  component "Java app" as A3
  component "Type 3 driver\\n(pure Java)" as B3
  node "middleware server" as O3
  A3 --&gt; B3
  B3 --&gt; O3 : generic protocol
}
rectangle "Type 2 — native API" as T2 {
  component "Java app" as A2
  component "Type 2 driver\\n(Java + JNI)" as B2
  component "vendor's native\\nC/C++ library" as O2
  A2 --&gt; B2
  B2 --&gt; O2
}
rectangle "Type 1 — JDBC-ODBC bridge\\n(removed from the JDK in Java 8)" as T1 {
  component "Java app" as A1
  component "JDBC-ODBC bridge" as B1
  component "ODBC driver\\n(Windows, native)" as O1
  A1 --&gt; B1
  B1 --&gt; O1
}
database "Database" as D1
database "Database" as D2
database "Database" as D3
database "SQL Server" as D4
O1 --&gt; D1
O2 --&gt; D2 : proprietary protocol
O3 --&gt; D3
B4 --&gt; D4 : the database's own protocol\\n(TDS) over a Java socket
@enduml</code></pre></details>
<p>Read the diagram by counting layers between "Java app" and the database. Fewer layers = less to install and usually faster. Type 4 (bottom) has none between the pure-Java driver and the database — that is what you use today.</p>
<p class="meo">🧠 For PRJ301 you only ever use <strong>Type 4</strong> (<code>mssql-jdbc</code>). The other three are history you should recognise on the FE, not code you write.</p>`,
        `<p class="y-chinh">🎯 Hãng DBMS cung cấp một gói với các lớp cài đặt driver JDBC chuẩn (miễn phí). Theo cách chúng tới được CSDL, có bốn loại driver — <strong>Type 1</strong> JDBC-ODBC, <strong>Type 2</strong> Native API, <strong>Type 3</strong> Network Protocol, <strong>Type 4</strong> Native Protocol. Type 1 và Type 4 là hai loại phổ biến.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/64777b20d7f8f5b1fbfbd4225067bb302f87813c.svg" alt="Bốn loại driver: có bao nhiêu tầng nằm giữa code Java và cơ sở dữ liệu" loading="lazy" /><p class="chu-thich">🧩 Bốn loại driver: có bao nhiêu tầng nằm giữa code Java và cơ sở dữ liệu</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title The four JDBC driver types (slides 12–17): how many layers between your Java code and the database
left to right direction
rectangle "Type 4 — native protocol (thin)" as T4 {
  component "Java app" as A4
  component "Type 4 driver\\n(pure Java: mssql-jdbc)" as B4
  A4 --&gt; B4
}
rectangle "Type 3 — network protocol" as T3 {
  component "Java app" as A3
  component "Type 3 driver\\n(pure Java)" as B3
  node "middleware server" as O3
  A3 --&gt; B3
  B3 --&gt; O3 : generic protocol
}
rectangle "Type 2 — native API" as T2 {
  component "Java app" as A2
  component "Type 2 driver\\n(Java + JNI)" as B2
  component "vendor's native\\nC/C++ library" as O2
  A2 --&gt; B2
  B2 --&gt; O2
}
rectangle "Type 1 — JDBC-ODBC bridge\\n(removed from the JDK in Java 8)" as T1 {
  component "Java app" as A1
  component "JDBC-ODBC bridge" as B1
  component "ODBC driver\\n(Windows, native)" as O1
  A1 --&gt; B1
  B1 --&gt; O1
}
database "Database" as D1
database "Database" as D2
database "Database" as D3
database "SQL Server" as D4
O1 --&gt; D1
O2 --&gt; D2 : proprietary protocol
O3 --&gt; D3
B4 --&gt; D4 : the database's own protocol\\n(TDS) over a Java socket
@enduml</code></pre></details>
<p>Đọc sơ đồ bằng cách đếm số tầng giữa "Java app" và cơ sở dữ liệu. Càng ít tầng = càng ít thứ phải cài và thường càng nhanh. Type 4 (dưới cùng) không có tầng nào giữa driver thuần Java và CSDL — đó là loại bạn dùng ngày nay.</p>
<p class="meo">🧠 Với PRJ301 bạn chỉ dùng <strong>Type 4</strong> (<code>mssql-jdbc</code>). Ba loại kia là lịch sử bạn nên nhận ra trong đề FE, không phải code bạn viết.</p>`],
      [13, 'Type 1-Driver: JDBC-ODBC Bridge',
        `<p class="y-chinh">🎯 <strong>Type 1</strong> translates JDBC calls into <strong>ODBC</strong> calls (Microsoft's older database interface); the Java app → JDBC-ODBC bridge → MS ODBC driver → a vendor ODBC driver (Access, Excel, SQL Server, Oracle) → the database.</p>
<p>Count the boxes on the slide: that is a lot of layers. ODBC is native Windows software, so a Type 1 driver only runs where ODBC is installed — it is <strong>platform-dependent</strong>. A "data source name" (DSN) is registered in the Windows Control Panel and the Java URL points at that name.</p>
<div class="pitfall">Important history: the JDBC-ODBC bridge was <strong>removed from the JDK in Java 8</strong>. The class <code>sun.jdbc.odbc.JdbcOdbcDriver</code> no longer exists — Lesson 5.B shows the real <code>ClassNotFoundException</code> you get if you try it today.</div>`,
        `<p class="y-chinh">🎯 <strong>Type 1</strong> dịch các lời gọi JDBC thành lời gọi <strong>ODBC</strong> (giao diện CSDL cũ của Microsoft); Java app → cầu JDBC-ODBC → MS ODBC driver → một ODBC driver của hãng (Access, Excel, SQL Server, Oracle) → cơ sở dữ liệu.</p>
<p>Đếm số hộp trên slide: rất nhiều tầng. ODBC là phần mềm native của Windows, nên driver Type 1 chỉ chạy ở nơi đã cài ODBC — nó <strong>phụ thuộc nền tảng (platform-dependent)</strong>. Một "data source name" (DSN) được đăng ký trong Control Panel của Windows và URL Java trỏ tới cái tên đó.</p>
<div class="pitfall">Lịch sử quan trọng: cầu JDBC-ODBC đã bị <strong>gỡ khỏi JDK từ Java 8</strong>. Lớp <code>sun.jdbc.odbc.JdbcOdbcDriver</code> không còn tồn tại — bài 5.B cho xem <code>ClassNotFoundException</code> thật bạn nhận nếu thử dùng nó ngày nay.</div>`],
      [14, 'Type 1-Driver: JDBC-ODBC… (details)',
        `<p class="y-chinh">🎯 Type 1 details: it was bundled in the JDK by default, translates JDBC APIs to ODBC APIs, and lets Java talk to any Microsoft-supported database — but it is platform-dependent, comparatively slow, and needs the ODBC driver installed on the machine.</p>
<p>The slide lists it as "useful when a Java driver is not available but the database is supported by Microsoft". In 2003 that mattered; today every serious database ships a Type 4 driver, so Type 1 is obsolete.</p>
<p><strong>Usage on the slide</strong>: a DSN is declared in Control Panel → ODBC Data Sources, and the Java URL is <code>jdbc:odbc:&lt;DSN&gt;</code>. You will never write this in PRJ301 — it is here only so you recognise the picture on the FE.</p>
<p class="meo">🧠 Three disadvantages to remember: platform-dependent (Windows/ODBC), slower, and requires ODBC installed.</p>`,
        `<p class="y-chinh">🎯 Chi tiết Type 1: nó từng đi kèm JDK mặc định, dịch JDBC API sang ODBC API, và cho Java nói chuyện với bất kỳ CSDL nào Microsoft hỗ trợ — nhưng phụ thuộc nền tảng, chậm hơn tương đối, và cần cài ODBC driver trên máy.</p>
<p>Slide liệt kê nó "hữu ích khi chưa có driver Java nhưng CSDL được Microsoft hỗ trợ". Năm 2003 điều đó còn quan trọng; ngày nay mọi CSDL nghiêm túc đều có driver Type 4, nên Type 1 đã lỗi thời.</p>
<p><strong>Cách dùng trên slide</strong>: khai một DSN trong Control Panel → ODBC Data Sources, và URL Java là <code>jdbc:odbc:&lt;DSN&gt;</code>. Bạn sẽ không bao giờ viết cái này trong PRJ301 — nó ở đây chỉ để bạn nhận ra bức tranh trong đề FE.</p>
<p class="meo">🧠 Ba nhược điểm cần nhớ: phụ thuộc nền tảng (Windows/ODBC), chậm hơn, và cần cài ODBC.</p>`],
      [15, 'Type 2-Driver: Native API',
        `<p class="y-chinh">🎯 <strong>Type 2</strong> reaches the database through the vendor's <strong>native C/C++ library</strong>: the Java app → Type 2 driver (Java + JNI) → native database library → the database. The native code can be faster, but it must be installed on every client.</p>
<p>"Native code libraries provide access to the database and improve performance." The driver takes your JDBC call, translates it to the database's own protocol through the native library, and forwards it. <strong>JNI</strong> (Java Native Interface) is how Java calls C/C++ code.</p>
<p>Downside: like Type 1, it is platform-dependent (the native library is compiled per OS) and needs installation on the client. Also obsolete for new projects.</p>`,
        `<p class="y-chinh">🎯 <strong>Type 2</strong> tới cơ sở dữ liệu qua <strong>thư viện native C/C++</strong> của hãng: Java app → Type 2 driver (Java + JNI) → thư viện native của CSDL → cơ sở dữ liệu. Code native có thể nhanh hơn, nhưng phải cài trên mọi máy client.</p>
<p>"Thư viện native cung cấp truy cập CSDL và cải thiện hiệu năng." Driver nhận lời gọi JDBC của bạn, dịch sang giao thức riêng của CSDL qua thư viện native, rồi chuyển tiếp. <strong>JNI</strong> (Java Native Interface) là cách Java gọi code C/C++.</p>
<p>Nhược điểm: như Type 1, nó phụ thuộc nền tảng (thư viện native biên dịch riêng cho mỗi hệ điều hành) và cần cài trên client. Cũng lỗi thời với dự án mới.</p>`],
      [16, 'Type 3-Driver: Network Protocol',
        `<p class="y-chinh">🎯 <strong>Type 3</strong> is a <strong>pure-Java</strong> driver that speaks a database-independent protocol to a <strong>middleware server</strong>; the middleware then forwards requests to the actual database — it can manage many apps talking to different databases through one gateway.</p>
<p>Because the driver is pure Java, it is platform-independent (runs anywhere Java runs) — a step up from Type 2. The cost is an extra server (the middleware) to install and run between client and database.</p>
<p class="meo">🧠 Type 3 trades a native library for a network hop: platform-independent, but there is a middleware box in the middle. Rare in practice today.</p>`,
        `<p class="y-chinh">🎯 <strong>Type 3</strong> là driver <strong>thuần Java</strong>, nói một giao thức độc lập với CSDL tới một <strong>middleware server</strong> (máy chủ trung gian); middleware rồi chuyển tiếp yêu cầu tới CSDL thật — nó quản lý được nhiều app nói chuyện với nhiều CSDL khác nhau qua một cổng.</p>
<p>Vì driver là thuần Java, nó độc lập nền tảng (chạy ở bất cứ đâu có Java) — một bước tiến so với Type 2. Cái giá là phải cài và chạy thêm một máy chủ (middleware) giữa client và CSDL.</p>
<p class="meo">🧠 Type 3 đổi thư viện native lấy một chặng mạng: độc lập nền tảng, nhưng có một hộp middleware ở giữa. Hiếm gặp trong thực tế ngày nay.</p>`],
      [17, 'Type 4-Driver: Native Protocol',
        `<p class="y-chinh">🎯 <strong>Type 4</strong> ("thin" driver) is <strong>pure Java</strong> and talks directly to the database over a Java socket, in the database's own protocol (SQL Server's is called TDS) — no ODBC, no native library, no middleware. It is platform-independent and the fastest, and it is the one you use.</p>
<p>"The driver library is attached with the deployed application": you drop the jar (<code>mssql-jdbc-…jar</code>) into your project's <code>WEB-INF/lib</code> and that is all — no installation on the server OS. The slide notes versions: SQL Server 2019 needs <code>mssql-jdbc-9.4</code> or higher, SQL Server 2022 <code>mssql-jdbc-12.x</code>.</p>
<p>"Thin" refers to the thin layer that speaks straight to the database, not to the jar's size. Every example in Lesson 5.B uses the Type 4 driver <code>mssql-jdbc</code> 12.8 — confirmed by the metadata on slide 10: <em>Microsoft JDBC Driver 12.8 for SQL Server, Type 4, JDBC 4.3</em>.</p>
<div class="callout">🐘 <strong>On PostgreSQL / Spring Boot</strong> (illustration): LabFlow uses the Type 4 PostgreSQL driver <code>org.postgresql.Driver</code> with a URL <code>jdbc:postgresql://host:5432/db</code>. Same driver type, same JDBC API — only the jar and the URL prefix change.</div>`,
        `<p class="y-chinh">🎯 <strong>Type 4</strong> (driver "thin" — mỏng) là <strong>thuần Java</strong> và nói trực tiếp với CSDL qua một socket Java, bằng giao thức riêng của CSDL (của SQL Server tên là TDS) — không ODBC, không thư viện native, không middleware. Nó độc lập nền tảng và nhanh nhất, và là loại bạn dùng.</p>
<p>"Thư viện driver được đính kèm với ứng dụng đã deploy": bạn thả jar (<code>mssql-jdbc-…jar</code>) vào <code>WEB-INF/lib</code> của dự án, thế là xong — không cần cài gì lên hệ điều hành của server. Slide ghi chú phiên bản: SQL Server 2019 cần <code>mssql-jdbc-9.4</code> trở lên, SQL Server 2022 cần <code>mssql-jdbc-12.x</code>.</p>
<p>"Thin" (mỏng) chỉ tầng mỏng nói thẳng với CSDL, không phải kích thước của jar. Mọi ví dụ trong bài 5.B dùng driver Type 4 <code>mssql-jdbc</code> 12.8 — đã xác nhận bằng metadata ở slide 10: <em>Microsoft JDBC Driver 12.8 for SQL Server, Type 4, JDBC 4.3</em>.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL / Spring Boot</strong> (ví dụ minh hoạ): LabFlow dùng driver Type 4 của PostgreSQL <code>org.postgresql.Driver</code> với URL <code>jdbc:postgresql://host:5432/db</code>. Cùng loại driver, cùng API JDBC — chỉ đổi jar và tiền tố URL.</div>`],
    ]),
    bi(`<h2>📌 What to take away from slides 1–17</h2>
<ul>
<li>A <strong>database</strong> is related data on disk, used by many at once; a <strong>DBMS</strong> (SQL Server) manages it; the browser never touches it — only the server, through JDBC.</li>
<li>Relational = tables (rows and columns); a table is a <em>relation</em>; a query's result is itself a table.</li>
<li>SQL has three families: <strong>DDL</strong> (CREATE/ALTER/DROP), <strong>DML</strong> (SELECT/INSERT/UPDATE/DELETE), <strong>DCL</strong> (GRANT/REVOKE/DENY).</li>
<li>JDBC = interfaces in <code>java.sql</code> (<code>Connection</code>, <code>Statement</code>, <code>ResultSet</code>) + the class <code>DriverManager</code> + <code>SQLException</code>. You code against the interface; the driver implements it.</li>
<li>Four driver types; only <strong>Type 4</strong> (pure Java, direct protocol — <code>mssql-jdbc</code>) is used today. Type 1 (JDBC-ODBC) was removed from the JDK in Java 8.</li>
<li>Since driver 10.2, <code>encrypt</code> is on by default — connection strings need <code>trustServerCertificate=true</code> (or a trusted certificate).</li>
</ul>`,
    `<h2>📌 Cần mang theo gì từ slide 1–17</h2>
<ul>
<li>Một <strong>cơ sở dữ liệu</strong> là dữ liệu liên quan trên đĩa, nhiều người dùng cùng lúc; một <strong>DBMS</strong> (SQL Server) quản lý nó; trình duyệt không bao giờ chạm vào — chỉ server, qua JDBC.</li>
<li>Quan hệ = bảng (dòng và cột); một bảng là một <em>quan hệ</em>; kết quả một truy vấn tự nó là một bảng.</li>
<li>SQL có ba nhóm: <strong>DDL</strong> (CREATE/ALTER/DROP), <strong>DML</strong> (SELECT/INSERT/UPDATE/DELETE), <strong>DCL</strong> (GRANT/REVOKE/DENY).</li>
<li>JDBC = các interface trong <code>java.sql</code> (<code>Connection</code>, <code>Statement</code>, <code>ResultSet</code>) + lớp <code>DriverManager</code> + <code>SQLException</code>. Bạn viết theo interface; driver cài đặt nó.</li>
<li>Bốn loại driver; ngày nay chỉ dùng <strong>Type 4</strong> (thuần Java, giao thức trực tiếp — <code>mssql-jdbc</code>). Type 1 (JDBC-ODBC) đã bị gỡ khỏi JDK từ Java 8.</li>
<li>Từ driver 10.2, <code>encrypt</code> bật mặc định — chuỗi kết nối cần <code>trustServerCertificate=true</code> (hoặc một chứng chỉ tin cậy).</li>
</ul>`),
    books([
      ['jdbcTutorial', '"JDBC Introduction", "JDBC Basics: Getting Started", "Processing SQL Statements with JDBC"', '"JDBC Introduction", "JDBC Basics: Getting Started", "Processing SQL Statements with JDBC"'],
      ['williams', 'no dedicated JDBC chapter — JPA (built on JDBC) is Ch.19–24; for raw JDBC use the syllabus article (JDBC tutorial)', 'không có chương JDBC riêng — JPA (dựng trên JDBC) ở Ch.19–24; JDBC thuần đọc bài đọc của syllabus (JDBC tutorial)'],
    ]),
  ].join('\n'),
};

/* ───────── 5.B — 📑 Slide by slide · JDBC (2/2): the five steps, PreparedStatement, ResultSet, a CRUD DAO (Slot 6–10, slides 18–40) ───────── */
const L_prj2_2 = {
  title: '5.B — 📑 Slide by slide · JDBC (2/2): the five steps, PreparedStatement, ResultSet, a CRUD DAO (Slot 6–10, slides 18–40)|||5.B — 📑 Học theo từng slide · JDBC (2/2): năm bước, PreparedStatement, ResultSet, DAO CRUD (Slot 6–10, slide 18–40)',
  slug: 'prj301-slide-prj2-2',
  type: 'VIDEO',
  description: "Giảng slide 18–40 của bộ \"Lecture 05, JDBC Database Access\": tải driver Type 4 và bật TCP/IP cho SQL Server, năm bước phát triển ứng dụng JDBC (nạp driver, mở kết nối, tạo & chạy câu lệnh, xử lý kết quả, đóng), Statement so với PreparedStatement kèm một cuộc SQL injection THẬT (đăng nhập bằng ' OR 1=1, lộ cả bảng mật khẩu bằng UNION) rồi cách chặn, con trỏ ResultSet (BOF/EOF, getXXX theo chỉ số và nhãn, cột NULL), thứ tự đóng tài nguyên và rò rỉ kết nối đo bằng sys.dm_exec_sessions, rồi Demo 1 (CSDL Human) và Demo 3 (quản lý Human CRUD trọn theo kiến trúc MVC) — tất cả chạy thật trên Tomcat 10.1 + SQL Server, kèm sơ đồ luồng và vòng đời con trỏ.",
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.B · school deck "Lecture 05, JDBC Database Access" (Slot 6–10), slides 18–40</span>
<h2>JDBC in code — five steps, PreparedStatement, ResultSet, and a full CRUD DAO</h2>
<p class="lead">Lesson 5.A gave the picture. Now you write it. These slides are the five steps as real, running Java — and the three things the exam and the Assignment reward most: use <code>PreparedStatement</code> so a login form cannot be broken by <code>' OR 1=1 --</code>, read a <code>ResultSet</code> without hitting its cursor rules, and close every resource so the connection pool never runs dry. The last demo builds a complete Human list with insert / edit / delete in the MVC shape the PE expects.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>Exam / PE weight</th></tr></thead>
<tbody>
<tr><td>18–20</td><td>download the Type 4 driver, enable TCP/IP</td><td>setup only; PE assumes it works</td></tr>
<tr><td>21–23</td><td>the five steps; open a connection; connection errors</td><td>PE: every program starts here</td></tr>
<tr><td>24</td><td>Statement vs PreparedStatement, SQL injection</td><td>FE + PE: the single most tested point</td></tr>
<tr><td>25–26</td><td>the ResultSet cursor; close order; leaks</td><td>FE favourites (getInt on NULL, close order)</td></tr>
<tr><td>28–38</td><td>Demo: a full CRUD DAO wired to JSP (MVC)</td><td>PE: this IS the paper</td></tr>
</tbody>
</table>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): Spring's <code>JdbcTemplate</code> writes steps 1, 2 and 5 for you (open, and always close) and still uses a <code>PreparedStatement</code> underneath; Spring Data JPA goes further and writes the SQL too. Everything here is what those tools do for you — which is exactly why you must understand it to debug them.</div>`,
    `<span class="eyebrow">Chương 5 · Bài 5.B · bộ slide "Lecture 05, JDBC Database Access" của trường (Slot 6–10), slide 18–40</span>
<h2>JDBC thành code — năm bước, PreparedStatement, ResultSet, và một DAO CRUD đầy đủ</h2>
<p class="lead">Bài 5.A đã cho bức tranh. Giờ bạn viết nó ra. Các slide này là năm bước thành Java chạy thật — và ba thứ đề thi cùng Assignment thưởng điểm nhiều nhất: dùng <code>PreparedStatement</code> để một form đăng nhập không bị bẻ bằng <code>' OR 1=1 --</code>, đọc một <code>ResultSet</code> mà không vấp luật con trỏ, và đóng mọi tài nguyên để connection pool không bao giờ cạn. Demo cuối dựng một danh sách Human đầy đủ có thêm / sửa / xoá theo đúng dáng MVC mà PE đòi.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Trọng số thi / PE</th></tr></thead>
<tbody>
<tr><td>18–20</td><td>tải driver Type 4, bật TCP/IP</td><td>chỉ là cài đặt; PE mặc định đã chạy</td></tr>
<tr><td>21–23</td><td>năm bước; mở kết nối; lỗi kết nối</td><td>PE: mọi chương trình bắt đầu từ đây</td></tr>
<tr><td>24</td><td>Statement so với PreparedStatement, SQL injection</td><td>FE + PE: điểm bị hỏi nhiều nhất</td></tr>
<tr><td>25–26</td><td>con trỏ ResultSet; thứ tự đóng; rò rỉ</td><td>FE hay hỏi (getInt trên NULL, thứ tự đóng)</td></tr>
<tr><td>28–38</td><td>Demo: một DAO CRUD đầy đủ nối với JSP (MVC)</td><td>PE: đây CHÍNH LÀ đề</td></tr>
</tbody>
</table>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): <code>JdbcTemplate</code> của Spring viết hộ bạn bước 1, 2 và 5 (mở, và luôn đóng) và vẫn dùng một <code>PreparedStatement</code> bên dưới; Spring Data JPA đi xa hơn, viết luôn cả câu SQL. Mọi thứ ở đây là thứ các công cụ đó làm hộ bạn — và chính vì thế bạn phải hiểu nó để gỡ lỗi chúng.</div>`),
    walkHead('prj2', 18, 40),
    walk('prj2', [
      [18, 'Download Type 4 SQL Server JDBC',
        `<p class="y-chinh">🎯 Get the Microsoft JDBC Driver (Type 4) for SQL Server 2019/2022; the slide shows version 12.4 (last updated March 2025), supporting Java 8, 11, 17 and 21, JDBC 4.2 / 4.3, about 3 MB.</p>
<p>The jar's name tells you its Java level: <code>mssql-jdbc-12.4.0.<strong>jre8</strong>.jar</code> for Java 8, <code>…<strong>jre11</strong>.jar</code> for Java 11+. On Tomcat 10.1 / JDK 17 you pick the jre11 jar — this course uses <code>mssql-jdbc-12.8.1.jre11.jar</code>, a newer patch of the same driver.</p>
<p><strong>Where it goes</strong>: into your project's <code>WEB-INF/lib</code> (a web app), or onto the classpath (a console program). Download it from Microsoft Learn or let Maven fetch it — the slide 31 screenshot adds it by hand in NetBeans.</p>
<div class="pitfall">Match the jar to your JDK: a <code>jre8</code> jar on JDK 17 still works, but a jar built for a newer Java than you run will fail to load. When unsure, take the <code>jre11</code> jar for any Java 11 or higher.</div>`,
        `<p class="y-chinh">🎯 Lấy Microsoft JDBC Driver (Type 4) cho SQL Server 2019/2022; slide cho thấy bản 12.4 (cập nhật gần nhất tháng 3/2025), hỗ trợ Java 8, 11, 17 và 21, JDBC 4.2 / 4.3, khoảng 3 MB.</p>
<p>Tên jar cho biết mức Java của nó: <code>mssql-jdbc-12.4.0.<strong>jre8</strong>.jar</code> cho Java 8, <code>…<strong>jre11</strong>.jar</code> cho Java 11 trở lên. Trên Tomcat 10.1 / JDK 17 bạn chọn jar jre11 — môn này dùng <code>mssql-jdbc-12.8.1.jre11.jar</code>, một bản vá mới hơn của cùng driver.</p>
<p><strong>Để nó ở đâu</strong>: vào <code>WEB-INF/lib</code> của dự án (ứng dụng web), hoặc vào classpath (chương trình console). Tải từ Microsoft Learn hoặc để Maven lấy — ảnh chụp slide 31 thêm nó bằng tay trong NetBeans.</p>
<div class="pitfall">Khớp jar với JDK của bạn: một jar <code>jre8</code> trên JDK 17 vẫn chạy, nhưng một jar dựng cho Java mới hơn bản bạn chạy sẽ không nạp được. Phân vân thì lấy jar <code>jre11</code> cho mọi Java 11 trở lên.</div>`],
      [19, 'Configure Ports, Protocols for SQL Server',
        `<p class="y-chinh">🎯 Before Java can connect, SQL Server must accept TCP/IP: in SQL Server Configuration Manager, enable the <strong>TCP/IP</strong> protocol and set a port (the IPAll <strong>TCP Port 1433</strong>, the default), and enable the client protocols too.</p>
<p>A fresh SQL Server install often has TCP/IP <em>disabled</em> — only Shared Memory is on, which a network client (your Tomcat) cannot use. You enable TCP/IP under "Protocols for MSSQLSERVER", and under IPAll set TCP Port to 1433 (and clear TCP Dynamic Ports, or the port changes on every restart).</p>
<p class="meo">🧠 1433 is SQL Server's default TCP port, the number in every connection string <code>jdbc:sqlserver://host:1433</code>. Our course container listens on 14330 instead, but the code still defaults to 1433 like the school PC.</p>`,
        `<p class="y-chinh">🎯 Trước khi Java kết nối được, SQL Server phải chấp nhận TCP/IP: trong SQL Server Configuration Manager, bật giao thức <strong>TCP/IP</strong> và đặt cổng (IPAll <strong>TCP Port 1433</strong>, mặc định), và bật cả giao thức phía client.</p>
<p>Một bản SQL Server mới cài thường <em>tắt</em> TCP/IP — chỉ bật Shared Memory, thứ mà một client qua mạng (Tomcat của bạn) không dùng được. Bạn bật TCP/IP trong "Protocols for MSSQLSERVER", và trong IPAll đặt TCP Port = 1433 (và xoá TCP Dynamic Ports, kẻo cổng đổi mỗi lần khởi động lại).</p>
<p class="meo">🧠 1433 là cổng TCP mặc định của SQL Server, con số trong mọi chuỗi kết nối <code>jdbc:sqlserver://host:1433</code>. Container của môn nghe ở 14330, nhưng code vẫn mặc định 1433 như máy trường.</p>`],
      [20, 'Configure Ports: restart SQL Server',
        `<p class="y-chinh">🎯 Settings take effect only after you <strong>stop then restart</strong> the SQL Server service (and SQL Server Agent) in Configuration Manager → SQL Server Services.</p>
<p>This is the same lesson as the ssh/nginx reflex: a config change you have written is not yet a config change in effect. After enabling TCP/IP you right-click the <em>SQL Server (MSSQLSERVER)</em> service and choose Restart, then confirm it is Running. Until then your Java still gets "connection refused".</p>
<p class="meo">🧠 "Connection refused" on the right port almost always means the service is stopped or TCP/IP is not enabled yet — not that your Java is wrong. Lesson shows that exact error on slide 23.</p>`,
        `<p class="y-chinh">🎯 Thiết lập chỉ có hiệu lực sau khi bạn <strong>dừng rồi khởi động lại</strong> dịch vụ SQL Server (và SQL Server Agent) trong Configuration Manager → SQL Server Services.</p>
<p>Đây cùng một bài học với phản xạ ssh/nginx: một thay đổi cấu hình đã ghi chưa phải là một thay đổi cấu hình có hiệu lực. Sau khi bật TCP/IP bạn chuột phải dịch vụ <em>SQL Server (MSSQLSERVER)</em> và chọn Restart, rồi xác nhận nó đang Running. Trước lúc đó Java của bạn vẫn nhận "connection refused" (từ chối kết nối).</p>
<p class="meo">🧠 "Connection refused" ở đúng cổng gần như luôn nghĩa là dịch vụ đang dừng hoặc TCP/IP chưa bật — không phải Java của bạn sai. Slide 23 cho xem đúng lỗi đó.</p>`],
      [21, '4- Steps to Develop a JDBC Application',
        `<p class="y-chinh">🎯 Five steps, every time: (1) load the JDBC driver, (2) establish a connection, (3) create &amp; execute SQL statements, (4) process the results, (5) close everything.</p>
<table>
<thead><tr><th>Step</th><th>Do what</th><th>Class / method</th></tr></thead>
<tbody>
<tr><td>1</td><td>load the driver</td><td><code>Class.forName("…SQLServerDriver")</code></td></tr>
<tr><td>2</td><td>open a connection</td><td><code>DriverManager.getConnection(url, user, pass)</code> → <code>Connection</code></td></tr>
<tr><td>3</td><td>create &amp; run a statement</td><td><code>Statement</code> / <code>PreparedStatement</code>; <code>executeQuery</code> (SELECT) or <code>executeUpdate</code> (INSERT/UPDATE/DELETE)</td></tr>
<tr><td>4</td><td>process results</td><td><code>ResultSet</code>: <code>next()</code>, <code>getXXX(…)</code></td></tr>
<tr><td>5</td><td>close</td><td><code>ResultSet</code>, then <code>Statement</code>, then <code>Connection</code></td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/4a4e50e28472f17385bd9befe2b9e3d53fc30a43.svg" alt="The five steps as they run inside one servlet request" loading="lazy" /><p class="chu-thich">🧩 The five steps as they run inside one servlet request</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title The five JDBC steps of slide 21, as they really run inside one servlet request
participant "Servlet / DAO" as S
participant "DriverManager" as DM
participant "Connection" as C
participant "PreparedStatement" as P
participant "ResultSet" as R
database "SQL Server" as DB
S -&gt; DM : 1. Class.forName(driver)\\n(registers SQLServerDriver)
S -&gt; DM : 2. getConnection(url, user, pass)
DM -&gt; DB : TCP 1433 + TLS + login
DM --&gt; S : Connection
S -&gt; C : 3. prepareStatement("SELECT … WHERE id = ?")
C --&gt; S : PreparedStatement
S -&gt; P : setInt(1, 7)
S -&gt; P : executeQuery()
P -&gt; DB : SQL text + parameter values
DB --&gt; P : rows
P --&gt; S : ResultSet (cursor before row 1)
loop 4. while (rs.next())
  S -&gt; R : getInt("id"), getString("name")…
end
S -&gt; R : 5. close()
S -&gt; P : close()
S -&gt; C : close()
C -&gt; DB : end of session
note over S : try-with-resources writes step 5 for you,\\nin exactly this reverse order
@enduml</code></pre></details>
<p>These are the five steps you must be able to write from memory for the PE. The diagram shows the order and who returns what; the next slides fill each step with real code.</p>`,
        `<p class="y-chinh">🎯 Năm bước, lần nào cũng vậy: (1) nạp JDBC driver, (2) mở kết nối, (3) tạo &amp; chạy câu lệnh SQL, (4) xử lý kết quả, (5) đóng mọi thứ.</p>
<table>
<thead><tr><th>Bước</th><th>Làm gì</th><th>Lớp / phương thức</th></tr></thead>
<tbody>
<tr><td>1</td><td>nạp driver</td><td><code>Class.forName("…SQLServerDriver")</code></td></tr>
<tr><td>2</td><td>mở kết nối</td><td><code>DriverManager.getConnection(url, user, pass)</code> → <code>Connection</code></td></tr>
<tr><td>3</td><td>tạo &amp; chạy câu lệnh</td><td><code>Statement</code> / <code>PreparedStatement</code>; <code>executeQuery</code> (SELECT) hoặc <code>executeUpdate</code> (INSERT/UPDATE/DELETE)</td></tr>
<tr><td>4</td><td>xử lý kết quả</td><td><code>ResultSet</code>: <code>next()</code>, <code>getXXX(…)</code></td></tr>
<tr><td>5</td><td>đóng</td><td><code>ResultSet</code>, rồi <code>Statement</code>, rồi <code>Connection</code></td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/4a4e50e28472f17385bd9befe2b9e3d53fc30a43.svg" alt="Năm bước khi chúng chạy bên trong một request của servlet" loading="lazy" /><p class="chu-thich">🧩 Năm bước khi chúng chạy bên trong một request của servlet</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title The five JDBC steps of slide 21, as they really run inside one servlet request
participant "Servlet / DAO" as S
participant "DriverManager" as DM
participant "Connection" as C
participant "PreparedStatement" as P
participant "ResultSet" as R
database "SQL Server" as DB
S -&gt; DM : 1. Class.forName(driver)\\n(registers SQLServerDriver)
S -&gt; DM : 2. getConnection(url, user, pass)
DM -&gt; DB : TCP 1433 + TLS + login
DM --&gt; S : Connection
S -&gt; C : 3. prepareStatement("SELECT … WHERE id = ?")
C --&gt; S : PreparedStatement
S -&gt; P : setInt(1, 7)
S -&gt; P : executeQuery()
P -&gt; DB : SQL text + parameter values
DB --&gt; P : rows
P --&gt; S : ResultSet (cursor before row 1)
loop 4. while (rs.next())
  S -&gt; R : getInt("id"), getString("name")…
end
S -&gt; R : 5. close()
S -&gt; P : close()
S -&gt; C : close()
C -&gt; DB : end of session
note over S : try-with-resources writes step 5 for you,\\nin exactly this reverse order
@enduml</code></pre></details>
<p>Đây là năm bước bạn phải viết được từ trí nhớ cho bài PE. Sơ đồ cho thấy thứ tự và ai trả về gì; các slide sau điền code thật vào từng bước.</p>`],
      [22, 'Step 1 Register JDBC Driver, Step 2 Establish a connection to DB — Type 1 (ODBC DSN)',
        `<p class="y-chinh">🎯 The slide's first code is the <em>Type 1</em> way: driver class <code>sun.jdbc.odbc.JdbcOdbcDriver</code>, URL <code>jdbc:odbc:KZone</code> (a DSN name). Note the URL syntax — it is the thing that changes per driver.</p>
<p>This is shown for contrast, not for use: as slide 13 said, the JDBC-ODBC bridge was removed from the JDK in Java 8, so this exact code throws today. Here it is, run for real on JDK 17:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=odbc-bridge HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 80

case: odbc-bridge
java.lang.ClassNotFoundException
sun.jdbc.odbc.JdbcOdbcDriver</code></pre>
<p>Step 1 (<code>Class.forName(driver)</code>) fails first with <code>ClassNotFoundException</code> because the class no longer exists. Keep the shape — load the driver, then get a connection — but use the Type 4 class on the next slide.</p>`,
        `<p class="y-chinh">🎯 Code đầu tiên của slide là cách <em>Type 1</em>: lớp driver <code>sun.jdbc.odbc.JdbcOdbcDriver</code>, URL <code>jdbc:odbc:KZone</code> (một tên DSN). Để ý cú pháp URL — đây là thứ đổi theo từng driver.</p>
<p>Cái này đưa ra để so sánh, không phải để dùng: như slide 13 nói, cầu JDBC-ODBC đã bị gỡ khỏi JDK từ Java 8, nên đúng đoạn code này ném lỗi ngày nay. Đây, chạy thật trên JDK 17:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=odbc-bridge HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 80

case: odbc-bridge
java.lang.ClassNotFoundException
sun.jdbc.odbc.JdbcOdbcDriver</code></pre>
<p>Bước 1 (<code>Class.forName(driver)</code>) hỏng trước với <code>ClassNotFoundException</code> vì lớp đó không còn tồn tại. Giữ cái dáng — nạp driver, rồi lấy kết nối — nhưng dùng lớp Type 4 ở slide sau.</p>`],
      [23, 'Step 1 Register JDBC Driver, Step 2 Establish a connection to DB — the real way',
        `<p class="y-chinh">🎯 The real code: driver <code>com.microsoft.sqlserver.jdbc.SQLServerDriver</code>, URL <code>jdbc:sqlserver://localhost:1433;databaseName=…</code>, then <code>Class.forName(driver)</code> and <code>DriverManager.getConnection(url, user, pass)</code>.</p>
<p>Here is the slide's <code>DBConnection</code> class, typed again and run as a plain console program (no Tomcat needed for a connection test):</p>
<pre><code class="language-java">// classpath: mssql-jdbc
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

// Slide 23, typed again: a console program (no Tomcat) that only checks the connection
public class DBConnection {
    public static String driverName = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
    // The slide's database is Sp25_DemoPRJ; here PRJ301_JdbcLoiKetNoi. Host/port/user/password come from env vars when set
    public static String dbURL = "jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
            + ";databaseName=PRJ301_JdbcLoiKetNoi;encrypt=true;trustServerCertificate=true";
    public static String userDB = env("DB_USER", "sa");
    public static String passDB = env("DB_PASSWORD", "123456");

    public static Connection getConnection() {
        Connection con = null;
        try {
            Class.forName(driverName);
            con = DriverManager.getConnection(dbURL, userDB, passDB);
            return con;
        } catch (Exception ex) {
            Logger.getLogger(DBConnection.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;                                   // ⚠ the caller gets null, not the reason
    }

    public static void main(String[] args) {
        try (Connection con = getConnection()) {       // try-with-resources closes con at the end
            if (con != null) {
                System.out.println("Connect to " + con.getCatalog() + " Success");
                System.out.println("Driver: " + con.getMetaData().getDriverName() + " " + con.getMetaData().getDriverVersion());
                System.out.println("Auto-commit: " + con.getAutoCommit());
            }
        } catch (SQLException ex) {
            Logger.getLogger(DBConnection.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }
}</code></pre>
<div class="out">Connect to PRJ301_JdbcLoiKetNoi Success<br>
Driver: Microsoft JDBC Driver 12.8 for SQL Server 12.8.1.0<br>
Auto-commit: true</div>
<p>Notice two things the slide's version misses. First, <code>getConnection</code> returns <code>null</code> on failure and only logs — so the caller never learns <em>why</em>; a better DAO rethrows. Second, since driver 10.2 the URL needs <code>;encrypt=true;trustServerCertificate=true</code>. Leave them out and you get, for real:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=slide33-url HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 387

case: slide33-url
com.microsoft.sqlserver.jdbc.SQLServerException
"encrypt" property is set to "true" and "trustServerCertificate" property is set to "false" but the driver could not establish a secure connection to …
  caused by: (certificate_unknown) PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path t…</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/5b2f3cb8cf94dad2ee0ed15f7e722abd22f825f0.svg" alt="What getConnection checks in order, and the exact error at each step" loading="lazy" /><p class="chu-thich">🧩 What getConnection checks in order, and the exact error at each step</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title What DriverManager.getConnection checks, in order — and the error you get at each step
start
:Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
if (driver jar missing from WEB-INF/lib, or class name misspelled?) then (yes)
  :ClassNotFoundException; &lt;&lt;#FEE2E2&gt;&gt;
  stop
endif
if (no loaded driver accepts the URL prefix "jdbc:sqlserver:"?) then (yes)
  :SQLException: No suitable driver found; &lt;&lt;#FEE2E2&gt;&gt;
  stop
endif
if (TCP to host:port fails? server stopped, TCP/IP disabled, wrong port) then (yes)
  :The TCP/IP connection to the host … port … has failed; &lt;&lt;#FEE2E2&gt;&gt;
  stop
endif
if (TLS fails? encrypt=true without a trusted certificate or trustServerCertificate=true) then (yes)
  :could not establish a secure connection … PKIX path building failed; &lt;&lt;#FEE2E2&gt;&gt;
  stop
endif
if (wrong user or password?) then (yes)
  :Login failed for user 'sa'; &lt;&lt;#FEE2E2&gt;&gt;
  stop
endif
if (databaseName missing, or the login may not open it?) then (yes)
  :Cannot open database "…" requested by the login; &lt;&lt;#FEE2E2&gt;&gt;
  stop
endif
:you get a Connection object; &lt;&lt;#DCFCE7&gt;&gt;
stop
@enduml</code></pre></details>
<div class="pitfall">The six connection errors, each run for real, in order of how often you will hit them:</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=wrong-pass HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 116

case: wrong-pass
com.microsoft.sqlserver.jdbc.SQLServerException
Login failed for user 'sa'. ClientConnectionId:…</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=wrong-db HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 166

case: wrong-db
com.microsoft.sqlserver.jdbc.SQLServerException
Cannot open database "PRJ301_KhongCo" requested by the login. The login failed. ClientConnectionId:…</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=wrong-port HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 311

case: wrong-port
com.microsoft.sqlserver.jdbc.SQLServerException
The TCP/IP connection to the host host.docker.internal, port 14339 has failed.
  caused by: "Connection refused. Verify the connection properties. Make sure that an instance of SQL Server is running on the host and accepting TCP/IP connection…</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=typo-driver HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 96

case: typo-driver
java.lang.ClassNotFoundException
com.microsoft.sqlserver.jdbc.SqlServerDriver</code></pre>`,
        `<p class="y-chinh">🎯 Code thật: driver <code>com.microsoft.sqlserver.jdbc.SQLServerDriver</code>, URL <code>jdbc:sqlserver://localhost:1433;databaseName=…</code>, rồi <code>Class.forName(driver)</code> và <code>DriverManager.getConnection(url, user, pass)</code>.</p>
<p>Đây là lớp <code>DBConnection</code> của slide, gõ lại và chạy như một chương trình console thuần (kiểm tra kết nối thì không cần Tomcat):</p>
<pre><code class="language-java">// classpath: mssql-jdbc
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

// Slide 23 gõ lại: chương trình console (không Tomcat) chỉ kiểm tra kết nối
public class DBConnection {
    public static String driverName = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
    // CSDL của slide là Sp25_DemoPRJ; ở đây là PRJ301_JdbcLoiKetNoi. Host/port/user/mật khẩu lấy từ biến môi trường nếu có
    public static String dbURL = "jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
            + ";databaseName=PRJ301_JdbcLoiKetNoi;encrypt=true;trustServerCertificate=true";
    public static String userDB = env("DB_USER", "sa");
    public static String passDB = env("DB_PASSWORD", "123456");

    public static Connection getConnection() {
        Connection con = null;
        try {
            Class.forName(driverName);
            con = DriverManager.getConnection(dbURL, userDB, passDB);
            return con;
        } catch (Exception ex) {
            Logger.getLogger(DBConnection.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;                                   // ⚠ nơi gọi nhận null, không biết lý do
    }

    public static void main(String[] args) {
        try (Connection con = getConnection()) {       // try-with-resources tự đóng con ở cuối
            if (con != null) {
                System.out.println("Connect to " + con.getCatalog() + " Success");
                System.out.println("Driver: " + con.getMetaData().getDriverName() + " " + con.getMetaData().getDriverVersion());
                System.out.println("Auto-commit: " + con.getAutoCommit());
            }
        } catch (SQLException ex) {
            Logger.getLogger(DBConnection.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }
}</code></pre>
<div class="out">Connect to PRJ301_JdbcLoiKetNoi Success<br>
Driver: Microsoft JDBC Driver 12.8 for SQL Server 12.8.1.0<br>
Auto-commit: true</div>
<p>Để ý hai điều bản của slide bỏ sót. Thứ nhất, <code>getConnection</code> trả <code>null</code> khi hỏng và chỉ ghi log — nên nơi gọi không bao giờ biết <em>vì sao</em>; một DAO tốt hơn sẽ ném lại lỗi. Thứ hai, từ driver 10.2 URL cần <code>;encrypt=true;trustServerCertificate=true</code>. Bỏ chúng ra thì bạn nhận, chạy thật:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=slide33-url HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 387

case: slide33-url
com.microsoft.sqlserver.jdbc.SQLServerException
"encrypt" property is set to "true" and "trustServerCertificate" property is set to "false" but the driver could not establish a secure connection to …
  caused by: (certificate_unknown) PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path t…</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/5b2f3cb8cf94dad2ee0ed15f7e722abd22f825f0.svg" alt="getConnection kiểm những gì theo thứ tự, và lỗi chính xác ở mỗi bước" loading="lazy" /><p class="chu-thich">🧩 getConnection kiểm những gì theo thứ tự, và lỗi chính xác ở mỗi bước</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title What DriverManager.getConnection checks, in order — and the error you get at each step
start
:Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
if (driver jar missing from WEB-INF/lib, or class name misspelled?) then (yes)
  :ClassNotFoundException; &lt;&lt;#FEE2E2&gt;&gt;
  stop
endif
if (no loaded driver accepts the URL prefix "jdbc:sqlserver:"?) then (yes)
  :SQLException: No suitable driver found; &lt;&lt;#FEE2E2&gt;&gt;
  stop
endif
if (TCP to host:port fails? server stopped, TCP/IP disabled, wrong port) then (yes)
  :The TCP/IP connection to the host … port … has failed; &lt;&lt;#FEE2E2&gt;&gt;
  stop
endif
if (TLS fails? encrypt=true without a trusted certificate or trustServerCertificate=true) then (yes)
  :could not establish a secure connection … PKIX path building failed; &lt;&lt;#FEE2E2&gt;&gt;
  stop
endif
if (wrong user or password?) then (yes)
  :Login failed for user 'sa'; &lt;&lt;#FEE2E2&gt;&gt;
  stop
endif
if (databaseName missing, or the login may not open it?) then (yes)
  :Cannot open database "…" requested by the login; &lt;&lt;#FEE2E2&gt;&gt;
  stop
endif
:you get a Connection object; &lt;&lt;#DCFCE7&gt;&gt;
stop
@enduml</code></pre></details>
<div class="pitfall">Sáu lỗi kết nối, mỗi lỗi chạy thật, theo thứ tự bạn hay gặp:</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=wrong-pass HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 116

case: wrong-pass
com.microsoft.sqlserver.jdbc.SQLServerException
Login failed for user 'sa'. ClientConnectionId:…</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=wrong-db HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 166

case: wrong-db
com.microsoft.sqlserver.jdbc.SQLServerException
Cannot open database "PRJ301_KhongCo" requested by the login. The login failed. ClientConnectionId:…</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=wrong-port HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 311

case: wrong-port
com.microsoft.sqlserver.jdbc.SQLServerException
The TCP/IP connection to the host host.docker.internal, port 14339 has failed.
  caused by: "Connection refused. Verify the connection properties. Make sure that an instance of SQL Server is running on the host and accepting TCP/IP connection…</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=typo-driver HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 96

case: typo-driver
java.lang.ClassNotFoundException
com.microsoft.sqlserver.jdbc.SqlServerDriver</code></pre>`],
      [24, 'Step 3: Create and Execute a SQL statement',
        `<p class="y-chinh">🎯 Step 3 has two tools: a <strong>Statement</strong> for fixed SQL (<code>createStatement()</code> then <code>executeQuery(sql)</code> or <code>executeUpdate(sql)</code>), and a <strong>PreparedStatement</strong> for SQL with values — <code>prepareStatement(sql)</code> with <code>?</code> placeholders, then <code>setXXX(index, value)</code> (index from 1), then <code>executeUpdate()</code> with no argument.</p>
<p>The slide writes both but does not say <em>why</em> the <code>?</code> version matters. It matters because gluing user input into SQL text is the number-one web vulnerability: <strong>SQL injection</strong>. Here is a login servlet that concatenates (the wrong way), attacked for real. A correct password:</p>
<p class="ghi-chu">📄 <code>jdbc-sql-injection/src/main/java/controller/LoginStatementServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.DBContext;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// ❌ WRONG on purpose: the user's text is glued INTO the SQL string
@WebServlet("/login-statement")
public class LoginStatementServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        String user = req.getParameter("user"), pass = req.getParameter("pass");
        String sql = "SELECT username, fullName, role FROM Account"
                   + " WHERE username = '" + user + "' AND password = '" + pass + "'";
        out.println("SQL sent: " + sql);                       // exactly what SQL Server parses
        try (Connection con = DBContext.getConnection();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            if (rs.next()) out.println("LOGIN OK -&gt; " + rs.getString("username") + " (" + rs.getString("role") + ")");
            else out.println("Login failed");
        } catch (Exception e) {
            out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}</code></pre>
<p class="ghi-chu">📄 <code>jdbc-sql-injection/src/main/java/controller/LoginPreparedServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.DBContext;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// ✅ RIGHT: the SQL text is fixed, the user's text travels separately as a parameter value
@WebServlet("/login-prepared")
public class LoginPreparedServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        String user = req.getParameter("user"), pass = req.getParameter("pass");
        String sql = "SELECT username, fullName, role FROM Account WHERE username = ? AND password = ?";
        out.println("SQL sent: " + sql);
        out.println("params  : [1]=" + user + "  [2]=" + pass);   // values, never parsed as SQL
        try (Connection con = DBContext.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, user);                                 // index starts at 1
            ps.setString(2, pass);
            try (ResultSet rs = ps.executeQuery()) {               // no argument here
                if (rs.next()) out.println("LOGIN OK -&gt; " + rs.getString("username") + " (" + rs.getString("role") + ")");
                else out.println("Login failed");
            }
        } catch (Exception e) {
            out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /jdbc-sql-injection/login-statement HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 25

user=cuong&amp;pass=Prj301%21</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 130

SQL sent: SELECT username, fullName, role FROM Account WHERE username = 'cuong' AND password = 'Prj301!'
LOGIN OK -&gt; cuong (USER)</code></pre>
<p>Now the attacker never guesses the password — they type <code>' OR 1=1 --</code> and <code>admin' --</code> into the username box:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /jdbc-sql-injection/login-statement HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

user=%27+OR+1%3D1+--+&amp;pass=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 132

SQL sent: SELECT username, fullName, role FROM Account WHERE username = '' OR 1=1 -- ' AND password = 'x'
LOGIN OK -&gt; admin (ADMIN)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /jdbc-sql-injection/login-statement HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 31

user=admin%27+--+&amp;pass=doan-bua</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 137

SQL sent: SELECT username, fullName, role FROM Account WHERE username = 'admin' -- ' AND password = 'doan-bua'
LOGIN OK -&gt; admin (ADMIN)</code></pre>
<p>Both log in. A search box leaks the whole password table with one UNION:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-sql-injection/search-statement?q=%27+UNION+SELECT+username+%2B+%27+%2F+%27+%2B+password%2C+0+FROM+Account+--+ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 288

SQL sent: SELECT name, price FROM Product WHERE name LIKE '%' UNION SELECT username + ' / ' + password, 0 FROM Account -- %'
  admin / Admin@2026 | 0
  cuong / Prj301! | 0
  Keyboard Proview | 40
  lan / Lan#1999 | 0
  Mouse Proview | 30
  Sách O'Reilly Head First Java | 350
(6 row(s))</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/70cc1988706ea7021d77cd9ba509b69f65b9994f.svg" alt="Why concatenation is injectable and a parameter is not" loading="lazy" /><p class="chu-thich">🧩 Why concatenation is injectable and a parameter is not</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Why concatenation is injectable and a parameter is not
participant "Login form" as F
participant "Servlet" as S
database "SQL Server parser" as DB
F -&gt; S : user = admin' --\\npass = anything
group Statement — the input becomes PART OF THE SQL TEXT
  S -&gt; DB : "SELECT … WHERE username = 'admin' -- ' AND password = 'anything'"
  DB -&gt; DB : parse: the quote closes the string,\\n-- turns the password check into a comment
  DB --&gt; S : row "admin" ⇒ LOGIN OK
end
group PreparedStatement — the SQL text is fixed, the input is only a VALUE
  S -&gt; DB : "SELECT … WHERE username = ? AND password = ?"
  S -&gt; DB : parameter 1 = "admin' --", parameter 2 = "anything"
  DB -&gt; DB : parse the text once (no user data in it),\\ncompare username with the whole value
  DB --&gt; S : no row ⇒ Login failed
end
@enduml</code></pre></details>
<p class="dap-an">✅ The fix is one change — a <code>?</code> placeholder, so the user's text is a <em>value</em>, never parsed as SQL. Same attacks, now harmless:</p>
<p class="ghi-chu">📄 <code>jdbc-sql-injection/src/main/java/controller/LoginStatementServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.DBContext;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// ❌ WRONG on purpose: the user's text is glued INTO the SQL string
@WebServlet("/login-statement")
public class LoginStatementServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        String user = req.getParameter("user"), pass = req.getParameter("pass");
        String sql = "SELECT username, fullName, role FROM Account"
                   + " WHERE username = '" + user + "' AND password = '" + pass + "'";
        out.println("SQL sent: " + sql);                       // exactly what SQL Server parses
        try (Connection con = DBContext.getConnection();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            if (rs.next()) out.println("LOGIN OK -&gt; " + rs.getString("username") + " (" + rs.getString("role") + ")");
            else out.println("Login failed");
        } catch (Exception e) {
            out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}</code></pre>
<p class="ghi-chu">📄 <code>jdbc-sql-injection/src/main/java/controller/LoginPreparedServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.DBContext;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// ✅ RIGHT: the SQL text is fixed, the user's text travels separately as a parameter value
@WebServlet("/login-prepared")
public class LoginPreparedServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        String user = req.getParameter("user"), pass = req.getParameter("pass");
        String sql = "SELECT username, fullName, role FROM Account WHERE username = ? AND password = ?";
        out.println("SQL sent: " + sql);
        out.println("params  : [1]=" + user + "  [2]=" + pass);   // values, never parsed as SQL
        try (Connection con = DBContext.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, user);                                 // index starts at 1
            ps.setString(2, pass);
            try (ResultSet rs = ps.executeQuery()) {               // no argument here
                if (rs.next()) out.println("LOGIN OK -&gt; " + rs.getString("username") + " (" + rs.getString("role") + ")");
                else out.println("Login failed");
            }
        } catch (Exception e) {
            out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /jdbc-sql-injection/login-prepared HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

user=%27+OR+1%3D1+--+&amp;pass=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 138

SQL sent: SELECT username, fullName, role FROM Account WHERE username = ? AND password = ?
params  : [1]=' OR 1=1 --   [2]=x
Login failed</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-sql-injection/search-prepared?q=%27+UNION+SELECT+username+%2B+%27+%2F+%27+%2B+password%2C+0+FROM+Account+--+ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 142

SQL sent: SELECT name, price FROM Product WHERE name LIKE ?   [1]=%' UNION SELECT username + ' / ' + password, 0 FROM Account -- %
(0 row(s))</code></pre>
<div class="pitfall">PreparedStatement also fixes the ordinary bug the slide's search would hit: a name with an apostrophe (<code>O'Reilly</code>) breaks concatenated SQL but is just data to a parameter. Use PreparedStatement for <strong>every</strong> query with a value — not only for login.</div>`,
        `<p class="y-chinh">🎯 Bước 3 có hai công cụ: một <strong>Statement</strong> cho SQL cố định (<code>createStatement()</code> rồi <code>executeQuery(sql)</code> hoặc <code>executeUpdate(sql)</code>), và một <strong>PreparedStatement</strong> cho SQL có giá trị — <code>prepareStatement(sql)</code> với các dấu <code>?</code>, rồi <code>setXXX(index, value)</code> (index từ 1), rồi <code>executeUpdate()</code> không tham số.</p>
<p>Slide viết cả hai nhưng không nói <em>vì sao</em> bản <code>?</code> quan trọng. Nó quan trọng vì dán dữ liệu người dùng vào chuỗi SQL là lỗ hổng web số một: <strong>SQL injection</strong>. Đây là một servlet đăng nhập nối chuỗi (cách sai), bị tấn công thật. Mật khẩu đúng:</p>
<p class="ghi-chu">📄 <code>jdbc-sql-injection/src/main/java/controller/LoginStatementServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.DBContext;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// ❌ CỐ TÌNH SAI: chữ người dùng gõ được dán VÀO chuỗi SQL
@WebServlet("/login-statement")
public class LoginStatementServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        String user = req.getParameter("user"), pass = req.getParameter("pass");
        String sql = "SELECT username, fullName, role FROM Account"
                   + " WHERE username = '" + user + "' AND password = '" + pass + "'";
        out.println("SQL sent: " + sql);                       // đúng chuỗi SQL Server sẽ phân tích
        try (Connection con = DBContext.getConnection();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            if (rs.next()) out.println("LOGIN OK -&gt; " + rs.getString("username") + " (" + rs.getString("role") + ")");
            else out.println("Login failed");
        } catch (Exception e) {
            out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}</code></pre>
<p class="ghi-chu">📄 <code>jdbc-sql-injection/src/main/java/controller/LoginPreparedServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.DBContext;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// ✅ ĐÚNG: chuỗi SQL cố định, chữ người dùng đi riêng dưới dạng giá trị tham số
@WebServlet("/login-prepared")
public class LoginPreparedServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        String user = req.getParameter("user"), pass = req.getParameter("pass");
        String sql = "SELECT username, fullName, role FROM Account WHERE username = ? AND password = ?";
        out.println("SQL sent: " + sql);
        out.println("params  : [1]=" + user + "  [2]=" + pass);   // giá trị, không bao giờ bị phân tích như SQL
        try (Connection con = DBContext.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, user);                                 // chỉ số bắt đầu từ 1
            ps.setString(2, pass);
            try (ResultSet rs = ps.executeQuery()) {               // ở đây không truyền tham số
                if (rs.next()) out.println("LOGIN OK -&gt; " + rs.getString("username") + " (" + rs.getString("role") + ")");
                else out.println("Login failed");
            }
        } catch (Exception e) {
            out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /jdbc-sql-injection/login-statement HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 25

user=cuong&amp;pass=Prj301%21</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 130

SQL sent: SELECT username, fullName, role FROM Account WHERE username = 'cuong' AND password = 'Prj301!'
LOGIN OK -&gt; cuong (USER)</code></pre>
<p>Giờ kẻ tấn công không hề đoán mật khẩu — họ gõ <code>' OR 1=1 --</code> và <code>admin' --</code> vào ô tên đăng nhập:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /jdbc-sql-injection/login-statement HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

user=%27+OR+1%3D1+--+&amp;pass=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 132

SQL sent: SELECT username, fullName, role FROM Account WHERE username = '' OR 1=1 -- ' AND password = 'x'
LOGIN OK -&gt; admin (ADMIN)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /jdbc-sql-injection/login-statement HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 31

user=admin%27+--+&amp;pass=doan-bua</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 137

SQL sent: SELECT username, fullName, role FROM Account WHERE username = 'admin' -- ' AND password = 'doan-bua'
LOGIN OK -&gt; admin (ADMIN)</code></pre>
<p>Cả hai đăng nhập được. Một ô tìm kiếm làm lộ cả bảng mật khẩu chỉ bằng một UNION:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-sql-injection/search-statement?q=%27+UNION+SELECT+username+%2B+%27+%2F+%27+%2B+password%2C+0+FROM+Account+--+ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 288

SQL sent: SELECT name, price FROM Product WHERE name LIKE '%' UNION SELECT username + ' / ' + password, 0 FROM Account -- %'
  admin / Admin@2026 | 0
  cuong / Prj301! | 0
  Keyboard Proview | 40
  lan / Lan#1999 | 0
  Mouse Proview | 30
  Sách O'Reilly Head First Java | 350
(6 row(s))</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/70cc1988706ea7021d77cd9ba509b69f65b9994f.svg" alt="Vì sao nối chuỗi thì bị injection còn tham số thì không" loading="lazy" /><p class="chu-thich">🧩 Vì sao nối chuỗi thì bị injection còn tham số thì không</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Why concatenation is injectable and a parameter is not
participant "Login form" as F
participant "Servlet" as S
database "SQL Server parser" as DB
F -&gt; S : user = admin' --\\npass = anything
group Statement — the input becomes PART OF THE SQL TEXT
  S -&gt; DB : "SELECT … WHERE username = 'admin' -- ' AND password = 'anything'"
  DB -&gt; DB : parse: the quote closes the string,\\n-- turns the password check into a comment
  DB --&gt; S : row "admin" ⇒ LOGIN OK
end
group PreparedStatement — the SQL text is fixed, the input is only a VALUE
  S -&gt; DB : "SELECT … WHERE username = ? AND password = ?"
  S -&gt; DB : parameter 1 = "admin' --", parameter 2 = "anything"
  DB -&gt; DB : parse the text once (no user data in it),\\ncompare username with the whole value
  DB --&gt; S : no row ⇒ Login failed
end
@enduml</code></pre></details>
<p class="dap-an">✅ Cách sửa chỉ là một thay đổi — một dấu <code>?</code>, để chữ người dùng gõ là một <em>giá trị</em>, không bao giờ bị phân tích như SQL. Cùng các đòn tấn công, nay vô hại:</p>
<p class="ghi-chu">📄 <code>jdbc-sql-injection/src/main/java/controller/LoginStatementServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.DBContext;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// ❌ CỐ TÌNH SAI: chữ người dùng gõ được dán VÀO chuỗi SQL
@WebServlet("/login-statement")
public class LoginStatementServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        String user = req.getParameter("user"), pass = req.getParameter("pass");
        String sql = "SELECT username, fullName, role FROM Account"
                   + " WHERE username = '" + user + "' AND password = '" + pass + "'";
        out.println("SQL sent: " + sql);                       // đúng chuỗi SQL Server sẽ phân tích
        try (Connection con = DBContext.getConnection();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            if (rs.next()) out.println("LOGIN OK -&gt; " + rs.getString("username") + " (" + rs.getString("role") + ")");
            else out.println("Login failed");
        } catch (Exception e) {
            out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}</code></pre>
<p class="ghi-chu">📄 <code>jdbc-sql-injection/src/main/java/controller/LoginPreparedServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.DBContext;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// ✅ ĐÚNG: chuỗi SQL cố định, chữ người dùng đi riêng dưới dạng giá trị tham số
@WebServlet("/login-prepared")
public class LoginPreparedServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        String user = req.getParameter("user"), pass = req.getParameter("pass");
        String sql = "SELECT username, fullName, role FROM Account WHERE username = ? AND password = ?";
        out.println("SQL sent: " + sql);
        out.println("params  : [1]=" + user + "  [2]=" + pass);   // giá trị, không bao giờ bị phân tích như SQL
        try (Connection con = DBContext.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, user);                                 // chỉ số bắt đầu từ 1
            ps.setString(2, pass);
            try (ResultSet rs = ps.executeQuery()) {               // ở đây không truyền tham số
                if (rs.next()) out.println("LOGIN OK -&gt; " + rs.getString("username") + " (" + rs.getString("role") + ")");
                else out.println("Login failed");
            }
        } catch (Exception e) {
            out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /jdbc-sql-injection/login-prepared HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

user=%27+OR+1%3D1+--+&amp;pass=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 138

SQL sent: SELECT username, fullName, role FROM Account WHERE username = ? AND password = ?
params  : [1]=' OR 1=1 --   [2]=x
Login failed</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-sql-injection/search-prepared?q=%27+UNION+SELECT+username+%2B+%27+%2F+%27+%2B+password%2C+0+FROM+Account+--+ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 142

SQL sent: SELECT name, price FROM Product WHERE name LIKE ?   [1]=%' UNION SELECT username + ' / ' + password, 0 FROM Account -- %
(0 row(s))</code></pre>
<div class="pitfall">PreparedStatement cũng sửa luôn lỗi thường ngày mà ô tìm kiếm của slide sẽ vấp: một cái tên có dấu nháy đơn (<code>O'Reilly</code>) làm vỡ SQL nối chuỗi nhưng chỉ là dữ liệu với một tham số. Dùng PreparedStatement cho <strong>mọi</strong> truy vấn có giá trị — không chỉ cho đăng nhập.</div>`],
      [25, 'Step 4: Process the results',
        `<p class="y-chinh">🎯 A <strong>ResultSet</strong> holds the rows a SELECT returned, with a <em>cursor</em> that starts <strong>before the first row (BOF)</strong>. <code>next()</code> moves it down and returns <code>false</code> past the last row (EOF); by default the cursor moves <strong>forward only</strong>. Read a column with <code>getXXX(index)</code> (from 1) or <code>getXXX("label")</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/20a53f03dcabae93b3c15c17988331a7e98a73ce.svg" alt="The ResultSet cursor: where it stands, and what each move does" loading="lazy" /><p class="chu-thich">🧩 The ResultSet cursor: where it stands, and what each move does</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title The ResultSet cursor (slide 25): where it stands, and what each move does
hide empty description
state "BOF\\n(before the first row)" as BOF
state "row 1" as R1
state "row 2" as R2
state "row 3 (last)" as R3
state "EOF\\n(after the last row)" as EOF
[*] --&gt; BOF : executeQuery()
BOF --&gt; R1 : next() = true
R1 --&gt; R2 : next() = true
R2 --&gt; R3 : next() = true
R3 --&gt; EOF : next() = false
R2 --&gt; R1 : previous()\\n(scrollable only)
BOF : getXxx() ⇒ "no current row"
EOF : getXxx() ⇒ "no current row"
R1 : getXxx(1) / getXxx("label") OK
@enduml</code></pre></details>
<p>The normal loop, run for real:</p>
<p class="ghi-chu">📄 <code>jdbc-resultset/src/main/java/controller/CursorServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Slide 25 for real: the cursor, getXXX by index and by label, and every exception the slide only mentions
@WebServlet("/rs")
public class CursorServlet extends HttpServlet {
    private static final String SQL = "SELECT id, name, [desc] AS description, bonus FROM T_employee ORDER BY id";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        String c = String.valueOf(req.getParameter("case"));
        out.println("case: " + c);
        try (Connection con = open(); Statement st = con.createStatement()) {
            switch (c) {
                case "loop" -&gt; {
                    try (ResultSet rs = st.executeQuery(SQL)) {          // cursor starts BEFORE row 1 (BOF)
                        while (rs.next()) {                               // next(): move down; false after the last row (EOF)
                            out.println("row " + rs.getRow() + ": " + rs.getInt(1) + " | " + rs.getString("name")
                                    + " | " + rs.getString("description"));   // by index (from 1) or by LABEL
                        }
                    }
                }
                case "label-vs-name" -&gt; {
                    try (ResultSet rs = st.executeQuery(SQL)) {
                        rs.next();
                        out.println("getString(\\"description\\") = " + rs.getString("description"));
                        out.println("column name = " + rs.getMetaData().getColumnName(3) + ", label = " + rs.getMetaData().getColumnLabel(3));
                        out.println("getString(\\"desc\\") ...");
                        out.println(rs.getString("desc"));               // the NAME, not the label
                    }
                }
                case "slide-sql" -&gt; st.executeQuery("SELECT desc AS description FROM T_employee");   // as written on the slide
                case "before-next" -&gt; {
                    try (ResultSet rs = st.executeQuery(SQL)) {
                        out.println(rs.getString("name"));               // still at BOF
                    }
                }
                case "after-last" -&gt; {
                    try (ResultSet rs = st.executeQuery(SQL)) {
                        while (rs.next()) { }
                        out.println("next() returned false, now at EOF");
                        out.println(rs.getString("name"));
                    }
                }
                case "index-0" -&gt; {
                    try (ResultSet rs = st.executeQuery(SQL)) {
                        rs.next();
                        out.println(rs.getString(0));                    // columns start at 1
                    }
                }
                case "previous" -&gt; {
                    try (ResultSet rs = st.executeQuery(SQL)) {
                        rs.next(); rs.next();
                        out.println("type = " + (rs.getType() == ResultSet.TYPE_FORWARD_ONLY ? "TYPE_FORWARD_ONLY" : rs.getType()));
                        rs.previous();                                   // the default cursor only moves forward
                    }
                }
                case "scroll" -&gt; {
                    try (Statement sc = con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                         ResultSet rs = sc.executeQuery(SQL)) {
                        rs.last();     out.println("last()       -&gt; row " + rs.getRow() + " " + rs.getString("name"));
                        rs.first();    out.println("first()      -&gt; row " + rs.getRow() + " " + rs.getString("name"));
                        rs.absolute(2); out.println("absolute(2)  -&gt; row " + rs.getRow() + " " + rs.getString("name"));
                        rs.previous(); out.println("previous()   -&gt; row " + rs.getRow() + " " + rs.getString("name"));
                        out.println("previous() again -&gt; " + rs.previous() + " (now before the first row)");
                    }
                }
                case "null" -&gt; {
                    try (ResultSet rs = st.executeQuery(SQL)) {
                        while (rs.next()) {
                            int b = rs.getInt("bonus");                  // SQL NULL ⇒ getInt returns 0!
                            boolean wasNull = rs.wasNull();              // ask right after reading
                            Integer real = rs.getObject("bonus", Integer.class);   // null stays null
                            out.println(rs.getString("name") + ": getInt=" + b + " wasNull=" + wasNull + " getObject=" + real);
                        }
                    }
                }
                default -&gt; out.println("unknown case");
            }
        } catch (SQLException | ClassNotFoundException e) {
            out.println("→ " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    private static Connection open() throws SQLException, ClassNotFoundException {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        return DriverManager.getConnection("jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
                + ";databaseName=PRJ301_JdbcResultSet;encrypt=true;trustServerCertificate=true", env("DB_USER", "sa"), env("DB_PASSWORD", "123"));
    }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=loop HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 100

case: loop
row 1: 1 | An | Backend developer
row 2: 2 | Bình | Tester
row 3: 3 | Chi | Team leader</code></pre>
<p>The slide's own example <code>SELECT desc AS description</code> hides a trap: <code>desc</code> is a SQL keyword, so it must be quoted, and you read the result by its <em>label</em> <code>description</code>, not the name <code>desc</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=label-vs-name HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 193

case: label-vs-name
getString("description") = Backend developer
column name = description, label = description
getString("desc") ...
→ SQLServerException: The column name desc is not valid.</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=slide-sql HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 82

case: slide-sql
→ SQLServerException: Incorrect syntax near the keyword 'desc'.</code></pre>
<div class="pitfall">The exceptions the slide only hints at — all run for real: reading before the first <code>next()</code>, reading after EOF, index 0, and <code>previous()</code> on the default forward-only cursor:</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=before-next HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 77

case: before-next
→ SQLServerException: The result set has no current row.</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=index-0 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 67

case: index-0
→ SQLServerException: The index 0 is out of range.</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=previous HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 134

case: previous
type = TYPE_FORWARD_ONLY
→ SQLServerException: The requested operation is not supported on forward only result sets.</code></pre>
<div class="pitfall">FE favourite: <code>getInt</code> on a SQL <strong>NULL</strong> returns <code>0</code>, not null — you must call <code>wasNull()</code> right after to tell them apart (or use <code>getObject(…, Integer.class)</code>):</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=null HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 142

case: null
An: getInt=500 wasNull=false getObject=500
Bình: getInt=0 wasNull=true getObject=null
Chi: getInt=900 wasNull=false getObject=900</code></pre>`,
        `<p class="y-chinh">🎯 Một <strong>ResultSet</strong> giữ các dòng mà SELECT trả về, với một <em>con trỏ (cursor)</em> bắt đầu <strong>trước dòng đầu (BOF)</strong>. <code>next()</code> đẩy nó xuống và trả <code>false</code> khi qua dòng cuối (EOF); mặc định con trỏ <strong>chỉ đi tới</strong>. Đọc một cột bằng <code>getXXX(index)</code> (từ 1) hoặc <code>getXXX("label")</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/20a53f03dcabae93b3c15c17988331a7e98a73ce.svg" alt="Con trỏ ResultSet: nó đứng ở đâu, và mỗi bước di chuyển làm gì" loading="lazy" /><p class="chu-thich">🧩 Con trỏ ResultSet: nó đứng ở đâu, và mỗi bước di chuyển làm gì</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title The ResultSet cursor (slide 25): where it stands, and what each move does
hide empty description
state "BOF\\n(before the first row)" as BOF
state "row 1" as R1
state "row 2" as R2
state "row 3 (last)" as R3
state "EOF\\n(after the last row)" as EOF
[*] --&gt; BOF : executeQuery()
BOF --&gt; R1 : next() = true
R1 --&gt; R2 : next() = true
R2 --&gt; R3 : next() = true
R3 --&gt; EOF : next() = false
R2 --&gt; R1 : previous()\\n(scrollable only)
BOF : getXxx() ⇒ "no current row"
EOF : getXxx() ⇒ "no current row"
R1 : getXxx(1) / getXxx("label") OK
@enduml</code></pre></details>
<p>Vòng lặp bình thường, chạy thật:</p>
<p class="ghi-chu">📄 <code>jdbc-resultset/src/main/java/controller/CursorServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Slide 25 chạy thật: con trỏ, getXXX theo chỉ số và theo nhãn, và mọi exception slide chỉ nhắc tới
@WebServlet("/rs")
public class CursorServlet extends HttpServlet {
    private static final String SQL = "SELECT id, name, [desc] AS description, bonus FROM T_employee ORDER BY id";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        String c = String.valueOf(req.getParameter("case"));
        out.println("case: " + c);
        try (Connection con = open(); Statement st = con.createStatement()) {
            switch (c) {
                case "loop" -&gt; {
                    try (ResultSet rs = st.executeQuery(SQL)) {          // con trỏ bắt đầu TRƯỚC dòng 1 (BOF)
                        while (rs.next()) {                               // next(): đi xuống; false khi qua dòng cuối (EOF)
                            out.println("row " + rs.getRow() + ": " + rs.getInt(1) + " | " + rs.getString("name")
                                    + " | " + rs.getString("description"));   // theo chỉ số (từ 1) hoặc theo NHÃN
                        }
                    }
                }
                case "label-vs-name" -&gt; {
                    try (ResultSet rs = st.executeQuery(SQL)) {
                        rs.next();
                        out.println("getString(\\"description\\") = " + rs.getString("description"));
                        out.println("column name = " + rs.getMetaData().getColumnName(3) + ", label = " + rs.getMetaData().getColumnLabel(3));
                        out.println("getString(\\"desc\\") ...");
                        out.println(rs.getString("desc"));               // dùng TÊN chứ không phải nhãn
                    }
                }
                case "slide-sql" -&gt; st.executeQuery("SELECT desc AS description FROM T_employee");   // đúng như slide viết
                case "before-next" -&gt; {
                    try (ResultSet rs = st.executeQuery(SQL)) {
                        out.println(rs.getString("name"));               // vẫn đang ở BOF
                    }
                }
                case "after-last" -&gt; {
                    try (ResultSet rs = st.executeQuery(SQL)) {
                        while (rs.next()) { }
                        out.println("next() returned false, now at EOF");
                        out.println(rs.getString("name"));
                    }
                }
                case "index-0" -&gt; {
                    try (ResultSet rs = st.executeQuery(SQL)) {
                        rs.next();
                        out.println(rs.getString(0));                    // cột bắt đầu từ 1
                    }
                }
                case "previous" -&gt; {
                    try (ResultSet rs = st.executeQuery(SQL)) {
                        rs.next(); rs.next();
                        out.println("type = " + (rs.getType() == ResultSet.TYPE_FORWARD_ONLY ? "TYPE_FORWARD_ONLY" : rs.getType()));
                        rs.previous();                                   // con trỏ mặc định chỉ đi tới
                    }
                }
                case "scroll" -&gt; {
                    try (Statement sc = con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                         ResultSet rs = sc.executeQuery(SQL)) {
                        rs.last();     out.println("last()       -&gt; row " + rs.getRow() + " " + rs.getString("name"));
                        rs.first();    out.println("first()      -&gt; row " + rs.getRow() + " " + rs.getString("name"));
                        rs.absolute(2); out.println("absolute(2)  -&gt; row " + rs.getRow() + " " + rs.getString("name"));
                        rs.previous(); out.println("previous()   -&gt; row " + rs.getRow() + " " + rs.getString("name"));
                        out.println("previous() again -&gt; " + rs.previous() + " (now before the first row)");
                    }
                }
                case "null" -&gt; {
                    try (ResultSet rs = st.executeQuery(SQL)) {
                        while (rs.next()) {
                            int b = rs.getInt("bonus");                  // SQL NULL ⇒ getInt trả 0!
                            boolean wasNull = rs.wasNull();              // hỏi ngay sau khi đọc
                            Integer real = rs.getObject("bonus", Integer.class);   // null vẫn là null
                            out.println(rs.getString("name") + ": getInt=" + b + " wasNull=" + wasNull + " getObject=" + real);
                        }
                    }
                }
                default -&gt; out.println("unknown case");
            }
        } catch (SQLException | ClassNotFoundException e) {
            out.println("→ " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    private static Connection open() throws SQLException, ClassNotFoundException {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        return DriverManager.getConnection("jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
                + ";databaseName=PRJ301_JdbcResultSet;encrypt=true;trustServerCertificate=true", env("DB_USER", "sa"), env("DB_PASSWORD", "123"));
    }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=loop HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 100

case: loop
row 1: 1 | An | Backend developer
row 2: 2 | Bình | Tester
row 3: 3 | Chi | Team leader</code></pre>
<p>Chính ví dụ của slide <code>SELECT desc AS description</code> giấu một cái bẫy: <code>desc</code> là một từ khoá SQL, nên phải để trong ngoặc, và bạn đọc kết quả bằng <em>nhãn (label)</em> <code>description</code>, không phải tên <code>desc</code>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=label-vs-name HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 193

case: label-vs-name
getString("description") = Backend developer
column name = description, label = description
getString("desc") ...
→ SQLServerException: The column name desc is not valid.</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=slide-sql HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 82

case: slide-sql
→ SQLServerException: Incorrect syntax near the keyword 'desc'.</code></pre>
<div class="pitfall">Các exception slide chỉ nhắc tới — đều chạy thật: đọc trước <code>next()</code> đầu tiên, đọc sau EOF, index 0, và <code>previous()</code> trên con trỏ mặc định chỉ đi tới:</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=before-next HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 77

case: before-next
→ SQLServerException: The result set has no current row.</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=index-0 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 67

case: index-0
→ SQLServerException: The index 0 is out of range.</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=previous HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 134

case: previous
type = TYPE_FORWARD_ONLY
→ SQLServerException: The requested operation is not supported on forward only result sets.</code></pre>
<div class="pitfall">FE hay hỏi: <code>getInt</code> trên một SQL <strong>NULL</strong> trả <code>0</code>, không phải null — bạn phải gọi <code>wasNull()</code> ngay sau để phân biệt (hoặc dùng <code>getObject(…, Integer.class)</code>):</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=null HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 142

case: null
An: getInt=500 wasNull=false getObject=500
Bình: getInt=0 wasNull=true getObject=null
Chi: getInt=900 wasNull=false getObject=900</code></pre>`],
      [26, 'Step 5: Close the connection',
        `<p class="y-chinh">🎯 Open order is Connection → Statement → ResultSet; <strong>close in the reverse order</strong>: ResultSet → Statement → Connection. The slide warns that one Statement can hold only one open ResultSet at a time — running a second query on it closes the first.</p>
<p>Run for real: a second <code>executeQuery</code> on the same Statement silently closes <code>rs1</code>, so touching it afterwards throws:</p>
<p class="ghi-chu">📄 <code>jdbc-dong-tai-nguyen/src/main/java/controller/CloseServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Slide 26 tested: closing order, "one result set per connection", and what a leak looks like from SQL Server's side
@WebServlet("/close")
public class CloseServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        String c = String.valueOf(req.getParameter("case"));
        out.println("case: " + c);
        try {
            switch (c) {
                case "same-statement" -&gt; {
                    try (Connection con = open("demo"); Statement stmt = con.createStatement()) {
                        ResultSet rs1 = stmt.executeQuery("SELECT name FROM Class ORDER BY code");
                        ResultSet rs2 = stmt.executeQuery("SELECT name FROM Student ORDER BY id");   // no exception here
                        out.println("rs2 opened fine; rs1.isClosed() = " + rs1.isClosed());
                        rs2.next(); out.println("rs2 first row: " + rs2.getString(1));
                        rs1.next();                                                                  // the old one is dead
                    }
                }
                case "two-statements" -&gt; {
                    try (Connection con = open("demo");
                         Statement s1 = con.createStatement(); Statement s2 = con.createStatement();
                         ResultSet rs1 = s1.executeQuery("SELECT code, name FROM Class ORDER BY code");
                         ResultSet rs2 = s2.executeQuery("SELECT name, classCode FROM Student ORDER BY id")) {
                        while (rs1.next() &amp; rs2.next()) {                                            // both open, read in turns
                            out.println(rs1.getString("code") + "  |  " + rs2.getString("name") + " in " + rs2.getString("classCode"));
                        }
                        out.println("two result sets were open on ONE connection at the same time");
                    }
                }
                case "nested" -&gt; {                                                                   // the slide's advice: copy rs1 into a List first
                    try (Connection con = open("demo")) {
                        List&lt;String&gt; codes = new ArrayList&lt;&gt;();
                        try (PreparedStatement ps = con.prepareStatement("SELECT code FROM Class ORDER BY code");
                             ResultSet rs = ps.executeQuery()) {
                            while (rs.next()) codes.add(rs.getString(1));
                        }                                                                            // rs, ps closed here
                        try (PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM Student WHERE classCode = ?")) {
                            for (String code : codes) {
                                ps.setString(1, code);                                               // reuse ONE PreparedStatement
                                try (ResultSet rs = ps.executeQuery()) { rs.next(); out.println(code + ": " + rs.getInt(1) + " student(s)"); }
                            }
                        }
                    }
                }
                case "order" -&gt; {
                    try (Connection con = open("demo");
                         Logged a = new Logged("Connection", con, out);
                         PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM Student");
                         Logged b = new Logged("PreparedStatement", ps, out);
                         ResultSet rs = ps.executeQuery();
                         Logged d = new Logged("ResultSet", rs, out)) {
                        rs.next();
                        out.println("count = " + rs.getInt(1) + " — leaving the try block…");
                    }
                }
                case "leak" -&gt; {
                    List&lt;Connection&gt; forgotten = new ArrayList&lt;&gt;();
                    for (int i = 0; i &lt; 3; i++) {
                        Connection con = open("leak-demo");                                          // opened, used, NEVER closed
                        con.createStatement().executeQuery("SELECT 1").next();
                        forgotten.add(con);
                    }
                    out.println("after 3 requests WITHOUT close: " + sessions() + " open session(s) on SQL Server");
                    for (Connection con : forgotten) con.close();                                    // (clean up the demo)
                    for (int i = 0; i &lt; 3; i++) {
                        try (Connection con = open("leak-demo"); Statement st = con.createStatement(); ResultSet rs = st.executeQuery("SELECT 1")) { rs.next(); }
                    }
                    out.println("after 3 requests WITH try-with-resources: " + sessions() + " open session(s)");
                }
                default -&gt; out.println("unknown case");
            }
        } catch (SQLException | ClassNotFoundException e) {
            out.println("→ " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    // How many sessions does SQL Server see from connections named "leak-demo"?
    private static int sessions() throws SQLException, ClassNotFoundException {
        try (Connection con = open("counter");
             ResultSet rs = con.createStatement().executeQuery("SELECT COUNT(*) FROM sys.dm_exec_sessions WHERE program_name = 'leak-demo'")) {
            rs.next();
            return rs.getInt(1);
        }
    }

    // Wraps a resource and prints when it is closed — only to SEE the order
    record Logged(String name, AutoCloseable res, PrintWriter out) implements AutoCloseable {
        @Override public void close() throws SQLException {
            try { res.close(); } catch (Exception e) { throw new SQLException(e); }
            out.println("closed " + name);
        }
    }

    private static Connection open(String appName) throws SQLException, ClassNotFoundException {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        return DriverManager.getConnection("jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
                + ";databaseName=PRJ301_JdbcClose;encrypt=true;trustServerCertificate=true;applicationName=" + appName,
                env("DB_USER", "sa"), env("DB_PASSWORD", "123"));
    }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-dong-tai-nguyen/close?case=same-statement HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 128

case: same-statement
rs2 opened fine; rs1.isClosed() = true
rs2 first row: An
→ SQLServerException: The result set is closed.</code></pre>
<p>The slide's fix is "copy rs1 into an ArrayList, then run rs2". Better still, use <strong>try-with-resources</strong>: Java closes everything for you, in exactly the reverse order. Watch the order print itself:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-dong-tai-nguyen/close?case=order HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 111

case: order
count = 3 — leaving the try block…
closed ResultSet
closed PreparedStatement
closed Connection</code></pre>
<p>Why closing matters is not cosmetic. Forget to close the Connection and the session stays open on SQL Server; do it per request and the pool runs dry — the FE calls this a <em>connection leak</em>. Measured for real against <code>sys.dm_exec_sessions</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-dong-tai-nguyen/close?case=leak HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 135

case: leak
after 3 requests WITHOUT close: 3 open session(s) on SQL Server
after 3 requests WITH try-with-resources: 0 open session(s)</code></pre>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): <code>JdbcTemplate</code> and Spring Data JPA close the connection for you on every call, so a leak is almost impossible — which is exactly the guarantee try-with-resources gives you here, by hand.</div>`,
        `<p class="y-chinh">🎯 Thứ tự mở là Connection → Statement → ResultSet; <strong>đóng theo thứ tự ngược</strong>: ResultSet → Statement → Connection. Slide cảnh báo một Statement chỉ giữ được một ResultSet mở tại một thời điểm — chạy câu truy vấn thứ hai trên nó sẽ đóng cái thứ nhất.</p>
<p>Chạy thật: một <code>executeQuery</code> thứ hai trên cùng Statement âm thầm đóng <code>rs1</code>, nên chạm vào nó sau đó là ném lỗi:</p>
<p class="ghi-chu">📄 <code>jdbc-dong-tai-nguyen/src/main/java/controller/CloseServlet.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Kiểm slide 26: thứ tự đóng, "mỗi kết nối một result set", và rò rỉ kết nối nhìn từ phía SQL Server
@WebServlet("/close")
public class CloseServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        String c = String.valueOf(req.getParameter("case"));
        out.println("case: " + c);
        try {
            switch (c) {
                case "same-statement" -&gt; {
                    try (Connection con = open("demo"); Statement stmt = con.createStatement()) {
                        ResultSet rs1 = stmt.executeQuery("SELECT name FROM Class ORDER BY code");
                        ResultSet rs2 = stmt.executeQuery("SELECT name FROM Student ORDER BY id");   // ở đây KHÔNG có exception
                        out.println("rs2 opened fine; rs1.isClosed() = " + rs1.isClosed());
                        rs2.next(); out.println("rs2 first row: " + rs2.getString(1));
                        rs1.next();                                                                  // cái cũ đã chết
                    }
                }
                case "two-statements" -&gt; {
                    try (Connection con = open("demo");
                         Statement s1 = con.createStatement(); Statement s2 = con.createStatement();
                         ResultSet rs1 = s1.executeQuery("SELECT code, name FROM Class ORDER BY code");
                         ResultSet rs2 = s2.executeQuery("SELECT name, classCode FROM Student ORDER BY id")) {
                        while (rs1.next() &amp; rs2.next()) {                                            // cả hai cùng mở, đọc xen kẽ
                            out.println(rs1.getString("code") + "  |  " + rs2.getString("name") + " in " + rs2.getString("classCode"));
                        }
                        out.println("two result sets were open on ONE connection at the same time");
                    }
                }
                case "nested" -&gt; {                                                                   // lời khuyên của slide: chép rs1 vào List trước
                    try (Connection con = open("demo")) {
                        List&lt;String&gt; codes = new ArrayList&lt;&gt;();
                        try (PreparedStatement ps = con.prepareStatement("SELECT code FROM Class ORDER BY code");
                             ResultSet rs = ps.executeQuery()) {
                            while (rs.next()) codes.add(rs.getString(1));
                        }                                                                            // rs, ps đóng ở đây
                        try (PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM Student WHERE classCode = ?")) {
                            for (String code : codes) {
                                ps.setString(1, code);                                               // dùng lại MỘT PreparedStatement
                                try (ResultSet rs = ps.executeQuery()) { rs.next(); out.println(code + ": " + rs.getInt(1) + " student(s)"); }
                            }
                        }
                    }
                }
                case "order" -&gt; {
                    try (Connection con = open("demo");
                         Logged a = new Logged("Connection", con, out);
                         PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM Student");
                         Logged b = new Logged("PreparedStatement", ps, out);
                         ResultSet rs = ps.executeQuery();
                         Logged d = new Logged("ResultSet", rs, out)) {
                        rs.next();
                        out.println("count = " + rs.getInt(1) + " — leaving the try block…");
                    }
                }
                case "leak" -&gt; {
                    List&lt;Connection&gt; forgotten = new ArrayList&lt;&gt;();
                    for (int i = 0; i &lt; 3; i++) {
                        Connection con = open("leak-demo");                                          // mở, dùng, KHÔNG BAO GIỜ đóng
                        con.createStatement().executeQuery("SELECT 1").next();
                        forgotten.add(con);
                    }
                    out.println("after 3 requests WITHOUT close: " + sessions() + " open session(s) on SQL Server");
                    for (Connection con : forgotten) con.close();                                    // (dọn sau khi minh hoạ)
                    for (int i = 0; i &lt; 3; i++) {
                        try (Connection con = open("leak-demo"); Statement st = con.createStatement(); ResultSet rs = st.executeQuery("SELECT 1")) { rs.next(); }
                    }
                    out.println("after 3 requests WITH try-with-resources: " + sessions() + " open session(s)");
                }
                default -&gt; out.println("unknown case");
            }
        } catch (SQLException | ClassNotFoundException e) {
            out.println("→ " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    // SQL Server đang thấy bao nhiêu phiên từ các kết nối tên "leak-demo"?
    private static int sessions() throws SQLException, ClassNotFoundException {
        try (Connection con = open("counter");
             ResultSet rs = con.createStatement().executeQuery("SELECT COUNT(*) FROM sys.dm_exec_sessions WHERE program_name = 'leak-demo'")) {
            rs.next();
            return rs.getInt(1);
        }
    }

    // Bọc một tài nguyên và in ra lúc nó bị đóng — chỉ để NHÌN thứ tự
    record Logged(String name, AutoCloseable res, PrintWriter out) implements AutoCloseable {
        @Override public void close() throws SQLException {
            try { res.close(); } catch (Exception e) { throw new SQLException(e); }
            out.println("closed " + name);
        }
    }

    private static Connection open(String appName) throws SQLException, ClassNotFoundException {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        return DriverManager.getConnection("jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
                + ";databaseName=PRJ301_JdbcClose;encrypt=true;trustServerCertificate=true;applicationName=" + appName,
                env("DB_USER", "sa"), env("DB_PASSWORD", "123"));
    }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-dong-tai-nguyen/close?case=same-statement HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 128

case: same-statement
rs2 opened fine; rs1.isClosed() = true
rs2 first row: An
→ SQLServerException: The result set is closed.</code></pre>
<p>Cách sửa của slide là "chép rs1 vào một ArrayList, rồi chạy rs2". Tốt hơn nữa, dùng <strong>try-with-resources</strong>: Java đóng hộ bạn mọi thứ, theo đúng thứ tự ngược. Xem thứ tự tự in ra:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-dong-tai-nguyen/close?case=order HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 111

case: order
count = 3 — leaving the try block…
closed ResultSet
closed PreparedStatement
closed Connection</code></pre>
<p>Vì sao đóng lại quan trọng thì không phải chuyện hình thức. Quên đóng Connection thì phiên vẫn mở trên SQL Server; làm vậy mỗi request thì pool cạn — FE gọi đây là <em>connection leak</em> (rò rỉ kết nối). Đo thật bằng <code>sys.dm_exec_sessions</code>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-dong-tai-nguyen/close?case=leak HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 135

case: leak
after 3 requests WITHOUT close: 3 open session(s) on SQL Server
after 3 requests WITH try-with-resources: 0 open session(s)</code></pre>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): <code>JdbcTemplate</code> và Spring Data JPA đóng kết nối hộ bạn ở mỗi lời gọi, nên rò rỉ gần như không thể xảy ra — chính là điều bảo đảm mà try-with-resources cho bạn ở đây, bằng tay.</div>`],
      [27, 'Demonstrations',
        `<p class="y-chinh">🎯 The rest of the deck is demonstrations: build a database (Demo 1) and then a full web program that lists, inserts, edits and deletes rows through JDBC (Demo 3).</p>
<p>On this site the demo is a real web app, <code>jdbc-human</code>, deployed on Tomcat — the same Human/HumanType database as the slides, with Controllers, a DAO and JSP views. The next slides walk its pieces; the 🧪 practice lesson turns them into exercises you solve.</p>
<p class="meo">🧠 This demo IS the shape of the PE: one entity, a list page, an insert/edit form, a delete, all wired Controller → DAO → JSP. Learn it until you can write it blank.</p>`,
        `<p class="y-chinh">🎯 Phần còn lại của bộ slide là các ví dụ minh hoạ: dựng một cơ sở dữ liệu (Demo 1) rồi một chương trình web đầy đủ liệt kê, thêm, sửa và xoá dòng qua JDBC (Demo 3).</p>
<p>Trên web này demo là một ứng dụng web thật, <code>jdbc-human</code>, deploy trên Tomcat — cùng CSDL Human/HumanType như slide, với các Controller, một DAO và các view JSP. Các slide sau đi qua từng mảnh; bài 🧪 thực hành biến chúng thành bài tập bạn tự giải.</p>
<p class="meo">🧠 Demo này CHÍNH LÀ dáng của PE: một thực thể, một trang danh sách, một form thêm/sửa, một nút xoá, tất cả nối Controller → DAO → JSP. Học tới khi viết được từ trang trắng.</p>`],
      [28, '(Demo 1) Create database',
        `<p class="y-chinh">🎯 Demo 1 builds a database <code>Human</code> with two tables: <strong>HumanType</strong> (typeid, typename) and <strong>Human</strong> (humanid, humanname, humandob, humangender, typeid) — one HumanType has many Human rows (a one-to-many relationship through the foreign key typeid).</p>
<p>Here is that structure as real SQL (our database is named <code>PRJ301_JdbcHuman</code>; <code>humanid</code> is an IDENTITY, which the slide's screenshot does not show):</p>
<p class="ghi-chu">📄 <code>jdbc-human/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE HumanType (
    typeid   INT PRIMARY KEY,
    typename NVARCHAR(100) NULL
);
CREATE TABLE Human (
    humanid     INT IDENTITY(1,1) PRIMARY KEY,
    humanname   NVARCHAR(100) NULL,
    humandob    DATE NULL,
    humangender BIT NULL,                                   -- 1 = male, 0 = female (as the slide's icons)
    typeid      INT NULL REFERENCES HumanType(typeid)       -- the 1–many link of slide 28
);</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/e0c80d34e3f8aa6197482305cec6d5bacdcda7fb.svg" alt="The Human database: one HumanType has many Human rows (foreign key typeid)" loading="lazy" /><p class="chu-thich">🧩 The Human database: one HumanType has many Human rows (foreign key typeid)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Database Human (slide 28): one HumanType has many Human rows
hide circle
hide methods
entity "HumanType" as T {
  * typeid : int &lt;&lt;PK&gt;&gt;
  --
  typename : nvarchar(100)
}
entity "Human" as H {
  * humanid : int &lt;&lt;PK&gt;&gt;
  --
  humanname : nvarchar(100)
  humandob : date
  humangender : bit
  typeid : int &lt;&lt;FK&gt;&gt;
}
T ||--o{ H : typeid
@enduml</code></pre></details>
<p><code>humangender</code> is a <strong>bit</strong> (1 = male, 0 = female, like the slide's icons); <code>humandob</code> is a <strong>date</strong>; the <code>REFERENCES HumanType(typeid)</code> is the foreign key that makes a Human point to its type.</p>`,
        `<p class="y-chinh">🎯 Demo 1 dựng một CSDL <code>Human</code> với hai bảng: <strong>HumanType</strong> (typeid, typename) và <strong>Human</strong> (humanid, humanname, humandob, humangender, typeid) — một HumanType có nhiều dòng Human (quan hệ một-nhiều qua khoá ngoại typeid).</p>
<p>Đây là cấu trúc đó dưới dạng SQL thật (CSDL của ta tên <code>PRJ301_JdbcHuman</code>; <code>humanid</code> là IDENTITY, điều ảnh chụp của slide không cho thấy):</p>
<p class="ghi-chu">📄 <code>jdbc-human/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE HumanType (
    typeid   INT PRIMARY KEY,
    typename NVARCHAR(100) NULL
);
CREATE TABLE Human (
    humanid     INT IDENTITY(1,1) PRIMARY KEY,
    humanname   NVARCHAR(100) NULL,
    humandob    DATE NULL,
    humangender BIT NULL,                                   -- 1 = nam, 0 = nữ (như biểu tượng trên slide)
    typeid      INT NULL REFERENCES HumanType(typeid)       -- quan hệ 1–nhiều của slide 28
);</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/e0c80d34e3f8aa6197482305cec6d5bacdcda7fb.svg" alt="CSDL Human: một HumanType có nhiều dòng Human (khoá ngoại typeid)" loading="lazy" /><p class="chu-thich">🧩 CSDL Human: một HumanType có nhiều dòng Human (khoá ngoại typeid)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Database Human (slide 28): one HumanType has many Human rows
hide circle
hide methods
entity "HumanType" as T {
  * typeid : int &lt;&lt;PK&gt;&gt;
  --
  typename : nvarchar(100)
}
entity "Human" as H {
  * humanid : int &lt;&lt;PK&gt;&gt;
  --
  humanname : nvarchar(100)
  humandob : date
  humangender : bit
  typeid : int &lt;&lt;FK&gt;&gt;
}
T ||--o{ H : typeid
@enduml</code></pre></details>
<p><code>humangender</code> là kiểu <strong>bit</strong> (1 = nam, 0 = nữ, như biểu tượng trên slide); <code>humandob</code> là kiểu <strong>date</strong>; <code>REFERENCES HumanType(typeid)</code> là khoá ngoại khiến một Human trỏ tới loại của nó.</p>`],
      [29, '(Demo 1) Create database — initial data',
        `<p class="y-chinh">🎯 The initial data: three types (1 student, 2 teacher, 3 worker) and five humans (Steve, Elon, Musk, Melon, Kais) with a date of birth, a gender bit, and a typeid pointing at a type.</p>
<p>The exact rows of the slide's screenshots, as our INSERT statements:</p>
<p class="ghi-chu">📄 <code>jdbc-human/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">INSERT INTO HumanType VALUES (1, N'student'), (2, N'teacher'), (3, N'worker');
INSERT INTO Human (humanname, humandob, humangender, typeid) VALUES
    (N'Steve', '2020-09-09', 1, 1),
    (N'Elon',  '2019-09-09', 0, 2),
    (N'Musk',  '2020-09-09', 1, 3),
    (N'Melon', '2019-08-09', 1, 1),
    (N'Kais',  '2020-07-08', 0, 3);</code></pre>
<p>Note: the INSERT into Human lists columns and skips <code>humanid</code> because it is an IDENTITY — SQL Server assigns 1, 2, 3… automatically. The slide "download this database file from CMS"; here the whole thing is rebuilt from this script every time the app runs, so the demo is reproducible.</p>`,
        `<p class="y-chinh">🎯 Dữ liệu ban đầu: ba loại (1 student, 2 teacher, 3 worker) và năm người (Steve, Elon, Musk, Melon, Kais) với ngày sinh, một bit giới tính, và một typeid trỏ tới một loại.</p>
<p>Đúng các dòng trong ảnh chụp của slide, dưới dạng câu INSERT của ta:</p>
<p class="ghi-chu">📄 <code>jdbc-human/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">INSERT INTO HumanType VALUES (1, N'student'), (2, N'teacher'), (3, N'worker');
INSERT INTO Human (humanname, humandob, humangender, typeid) VALUES
    (N'Steve', '2020-09-09', 1, 1),
    (N'Elon',  '2019-09-09', 0, 2),
    (N'Musk',  '2020-09-09', 1, 3),
    (N'Melon', '2019-08-09', 1, 1),
    (N'Kais',  '2020-07-08', 0, 3);</code></pre>
<p>Lưu ý: câu INSERT vào Human liệt kê các cột và bỏ qua <code>humanid</code> vì nó là IDENTITY — SQL Server tự gán 1, 2, 3… Slide "tải file CSDL này từ CMS"; ở đây mọi thứ được dựng lại từ script này mỗi lần app chạy, nên demo lặp lại được.</p>`],
      [30, '(Demo 3) Manage items using MS SQL Server JDBC',
        `<p class="y-chinh">🎯 Demo 3 is a web program that lists the humans in a table (Name, DOB, Gender, Type) with an <em>edit</em> and <em>delete</em> button per row and an <em>Insert</em> link — the page at <code>/human/list</code>, built Controller → DAO → JSP.</p>
<p>Here is that list page, served for real by our <code>jdbc-human</code> app on Tomcat:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-human/human/list HTTP/1.1
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
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/d79c3769e6be2a13601f4683e5569d62685672fe.svg" alt="Demo 3: list, then insert with Post/Redirect/Get" loading="lazy" /><p class="chu-thich">🧩 Demo 3: list, then insert with Post/Redirect/Get</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Demo 3 (slides 30–38): list, then insert with Post/Redirect/Get
actor User
participant "Browser" as B
participant "ListController\\n/human/list" as L
participant "InsertController\\n/human/insert" as I
participant "HumanDAO" as D
database "PRJ301_JdbcHuman" as DB
participant "list.jsp / form.jsp\\n(WEB-INF/view/human)" as V
User -&gt; B : open the list
B -&gt; L : GET /human/list
L -&gt; D : getHumans()
D -&gt; DB : SELECT … INNER JOIN HumanType
DB --&gt; D : rows
D --&gt; L : List&lt;Human&gt;
L -&gt; V : setAttribute("humans") + forward
V --&gt; B : 200 HTML table
User -&gt; B : click Insert
B -&gt; I : GET /human/insert
I -&gt; D : getTypes()
I -&gt; V : forward form.jsp (types for &lt;select&gt;)
V --&gt; B : 200 HTML form
User -&gt; B : fill + Save
B -&gt; I : POST /human/insert (name, dob, gender, typeid)
I -&gt; D : insert(human)
D -&gt; DB : INSERT … VALUES (?, ?, ?, ?)
I --&gt; B : 302 Location: list
B -&gt; L : GET /human/list (F5 here is harmless)
@enduml</code></pre></details>
<p>The flow is the MVC you met in Chapter 6 preview: a <strong>Controller</strong> servlet asks the <strong>DAO</strong> (which does the JDBC), puts the result in the request, and forwards to a <strong>JSP</strong> that only displays. The browser never sees SQL, and the JSP never opens a connection.</p>`,
        `<p class="y-chinh">🎯 Demo 3 là một chương trình web liệt kê các human trong một bảng (Name, DOB, Gender, Type) với một nút <em>edit</em> và <em>delete</em> cho mỗi dòng và một liên kết <em>Insert</em> — trang ở <code>/human/list</code>, dựng theo Controller → DAO → JSP.</p>
<p>Đây là trang danh sách đó, do app <code>jdbc-human</code> của ta phục vụ thật trên Tomcat:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-human/human/list HTTP/1.1
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
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/d79c3769e6be2a13601f4683e5569d62685672fe.svg" alt="Demo 3: danh sách, rồi thêm theo Post/Redirect/Get" loading="lazy" /><p class="chu-thich">🧩 Demo 3: danh sách, rồi thêm theo Post/Redirect/Get</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Demo 3 (slides 30–38): list, then insert with Post/Redirect/Get
actor User
participant "Browser" as B
participant "ListController\\n/human/list" as L
participant "InsertController\\n/human/insert" as I
participant "HumanDAO" as D
database "PRJ301_JdbcHuman" as DB
participant "list.jsp / form.jsp\\n(WEB-INF/view/human)" as V
User -&gt; B : open the list
B -&gt; L : GET /human/list
L -&gt; D : getHumans()
D -&gt; DB : SELECT … INNER JOIN HumanType
DB --&gt; D : rows
D --&gt; L : List&lt;Human&gt;
L -&gt; V : setAttribute("humans") + forward
V --&gt; B : 200 HTML table
User -&gt; B : click Insert
B -&gt; I : GET /human/insert
I -&gt; D : getTypes()
I -&gt; V : forward form.jsp (types for &lt;select&gt;)
V --&gt; B : 200 HTML form
User -&gt; B : fill + Save
B -&gt; I : POST /human/insert (name, dob, gender, typeid)
I -&gt; D : insert(human)
D -&gt; DB : INSERT … VALUES (?, ?, ?, ?)
I --&gt; B : 302 Location: list
B -&gt; L : GET /human/list (F5 here is harmless)
@enduml</code></pre></details>
<p>Luồng là MVC mà bạn gặp ở phần xem trước Chương 6: một servlet <strong>Controller</strong> hỏi <strong>DAO</strong> (nơi làm JDBC), đặt kết quả vào request, rồi forward sang một <strong>JSP</strong> chỉ hiển thị. Trình duyệt không bao giờ thấy SQL, và JSP không bao giờ mở kết nối.</p>`],
      [31, '(Demo 3) Add MS SQL Server JDBC to NetBeans',
        `<p class="y-chinh">🎯 Before the code compiles, the driver jar must be on the project's classpath: in NetBeans, right-click Libraries → Add JAR, pick <code>mssql-jdbc-…jar</code>, and it appears under Libraries.</p>
<p>What the screenshot does by hand, a web app does by putting the jar in <code>WEB-INF/lib</code> (it is then both on the compile classpath and inside the WAR). On this site the generator adds <code>mssql-jdbc</code> for every app that declares <code>@lib mssql-jdbc</code> — the same effect, automated.</p>
<div class="pitfall">If the jar is on the compile classpath but NOT shipped inside <code>WEB-INF/lib</code>, the code compiles and then throws <code>ClassNotFoundException</code> (or "No suitable driver") at runtime — exactly the first two errors on slide 23. Compile-time green does not mean the driver is there at run time.</div>`,
        `<p class="y-chinh">🎯 Trước khi code biên dịch, jar driver phải nằm trên classpath của dự án: trong NetBeans, chuột phải Libraries → Add JAR, chọn <code>mssql-jdbc-…jar</code>, và nó hiện dưới mục Libraries.</p>
<p>Điều ảnh chụp làm bằng tay thì một ứng dụng web làm bằng cách đặt jar vào <code>WEB-INF/lib</code> (khi đó nó vừa trên classpath biên dịch vừa nằm trong WAR). Trên web này generator thêm <code>mssql-jdbc</code> cho mọi app khai <code>@lib mssql-jdbc</code> — cùng hiệu quả, tự động.</p>
<div class="pitfall">Nếu jar nằm trên classpath biên dịch nhưng KHÔNG được đóng vào <code>WEB-INF/lib</code>, code biên dịch rồi ném <code>ClassNotFoundException</code> (hoặc "No suitable driver") lúc chạy — đúng hai lỗi đầu ở slide 23. Biên dịch xanh không có nghĩa là driver có mặt lúc chạy.</div>`],
      [32, '(Demo 3) DBContext',
        `<p class="y-chinh">🎯 <code>DBContext</code> is the one class that knows how to open a connection — driver name, URL, user, password in one place, with a <code>getConnection()</code> method everyone else calls.</p>
<p>The slide's version opens one connection in the constructor and keeps it in a field. That is fragile: one shared connection across requests is not thread-safe, and if it drops no one reopens it. The rewritten version below <em>opens a fresh connection per call</em> and never returns null — it throws, so the caller learns why:</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/dal/DBContext.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private static final String URL = "jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
        + ";databaseName=PRJ301_JdbcHuman;encrypt=true;trustServerCertificate=true";   // driver ≥ 10.2 needs these two

public static Connection getConnection() throws SQLException {
    try {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");                 // needed inside Tomcat (WEB-INF/lib)
    } catch (ClassNotFoundException e) {
        throw new SQLException("mssql-jdbc jar is missing from WEB-INF/lib", e);       // fail loudly, never return null
    }
    return DriverManager.getConnection(URL, env("DB_USER", "sa"), env("DB_PASSWORD", "sa"));
}</code></pre>
<p>The URL carries <code>encrypt=true;trustServerCertificate=true</code> (driver 10.2+), and reads host/port/user/password from environment variables so the same code runs on the school PC (localhost:1433) and in our container — the slide hard-codes them.</p>`,
        `<p class="y-chinh">🎯 <code>DBContext</code> là lớp duy nhất biết cách mở kết nối — tên driver, URL, user, mật khẩu ở một chỗ, với một phương thức <code>getConnection()</code> mà mọi nơi khác gọi.</p>
<p>Bản của slide mở một kết nối trong hàm khởi tạo và giữ nó trong một trường. Cách đó mong manh: một kết nối dùng chung giữa các request không an toàn luồng, và nếu nó rớt thì không ai mở lại. Bản viết lại dưới đây <em>mở một kết nối mới mỗi lần gọi</em> và không bao giờ trả null — nó ném lỗi, để nơi gọi biết lý do:</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/dal/DBContext.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private static final String URL = "jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
        + ";databaseName=PRJ301_JdbcHuman;encrypt=true;trustServerCertificate=true";   // driver ≥ 10.2 cần hai thuộc tính này

public static Connection getConnection() throws SQLException {
    try {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");                 // cần khi chạy trong Tomcat (WEB-INF/lib)
    } catch (ClassNotFoundException e) {
        throw new SQLException("mssql-jdbc jar is missing from WEB-INF/lib", e);       // báo lỗi rõ ràng, không bao giờ trả null
    }
    return DriverManager.getConnection(URL, env("DB_USER", "sa"), env("DB_PASSWORD", "sa"));
}</code></pre>
<p>URL mang <code>encrypt=true;trustServerCertificate=true</code> (driver 10.2+), và đọc host/port/user/mật khẩu từ biến môi trường để cùng code chạy được trên máy trường (localhost:1433) và trong container của ta — slide thì gắn cứng chúng.</p>`],
      [33, '(Demo 3) Human model class',
        `<p class="y-chinh">🎯 The <code>Human</code> model (a "JavaBean") mirrors the table: private fields <code>id, name, dob, gender, type</code> with public getters and setters — and the foreign key <code>typeid</code> becomes a whole <code>HumanType</code> object, not just an int.</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/model/Human.java</code></p>
<pre class="web-src"><code class="language-java">package model;

import java.sql.Date;

// Slide 33: one row of Human — the foreign key typeid becomes a whole HumanType object
public class Human {
    private int id;
    private String name;
    private Date dob;
    private boolean gender;          // true = male
    private HumanType type;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Date getDob() { return dob; }
    public void setDob(Date dob) { this.dob = dob; }
    public boolean isGender() { return gender; }          // boolean getter ⇒ EL reads &#36;{h.gender}
    public void setGender(boolean gender) { this.gender = gender; }
    public HumanType getType() { return type; }
    public void setType(HumanType type) { this.type = type; }
}</code></pre>
<p>Why a <code>HumanType</code> field instead of an <code>int typeid</code>: so the JSP can write <code>h.type.name</code> and show "student", not "1". Note the boolean getter is <code>isGender()</code> — JSP EL reads it as <code>h.gender</code>; a boolean field's getter is <code>isX()</code>, not <code>getX()</code>.</p>`,
        `<p class="y-chinh">🎯 Model <code>Human</code> (một "JavaBean") phản chiếu bảng: các trường private <code>id, name, dob, gender, type</code> với getter và setter public — và khoá ngoại <code>typeid</code> trở thành cả một đối tượng <code>HumanType</code>, không chỉ một int.</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/model/Human.java</code></p>
<pre class="web-src"><code class="language-java">package model;

import java.sql.Date;

// Slide 33: một dòng của Human — khoá ngoại typeid trở thành cả một đối tượng HumanType
public class Human {
    private int id;
    private String name;
    private Date dob;
    private boolean gender;          // true = nam
    private HumanType type;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Date getDob() { return dob; }
    public void setDob(Date dob) { this.dob = dob; }
    public boolean isGender() { return gender; }          // getter boolean ⇒ EL đọc &#36;{h.gender}
    public void setGender(boolean gender) { this.gender = gender; }
    public HumanType getType() { return type; }
    public void setType(HumanType type) { this.type = type; }
}</code></pre>
<p>Vì sao một trường <code>HumanType</code> thay cho <code>int typeid</code>: để JSP viết được <code>h.type.name</code> và hiện "student", không phải "1". Để ý getter boolean là <code>isGender()</code> — EL của JSP đọc nó là <code>h.gender</code>; getter của một trường boolean là <code>isX()</code>, không phải <code>getX()</code>.</p>`],
      [34, '(Demo 3) ListController',
        `<p class="y-chinh">🎯 The <code>ListController</code> servlet does three things: ask the DAO for the list, put it in the request as an attribute, and forward to the JSP — no HTML, no SQL in the controller.</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/controller/human/ListController.java</code></p>
<pre class="web-src"><code class="language-java">package controller.human;

import dal.HumanDAO;
import java.io.IOException;
import java.sql.SQLException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Slide 34: ask the DAO, put the list in the request, forward to the JSP
@WebServlet("/human/list")
public class ListController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            request.setAttribute("humans", new HumanDAO().getHumans());
        } catch (SQLException e) {
            throw new ServletException(e);                         // let Tomcat show 500 instead of an empty table
        }
        request.getRequestDispatcher("/WEB-INF/view/human/list.jsp").forward(request, response);
    }
}</code></pre>
<p>The view lives under <code>WEB-INF/view</code> so the browser cannot request the JSP directly — only the controller can reach it, through <code>forward</code>. If the DAO throws, we wrap it in a <code>ServletException</code> so Tomcat shows a 500 rather than an empty page.</p>
<div class="pitfall">The slide forwards to <code>"../view/human/list.jsp"</code> (a relative path). Prefer a context-relative path starting with <code>/</code> (<code>/WEB-INF/view/human/list.jsp</code>): it does not depend on the servlet's URL, so it still works when the mapping changes.</div>`,
        `<p class="y-chinh">🎯 Servlet <code>ListController</code> làm ba việc: hỏi DAO lấy danh sách, đặt nó vào request dưới dạng attribute, và forward sang JSP — không HTML, không SQL trong controller.</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/controller/human/ListController.java</code></p>
<pre class="web-src"><code class="language-java">package controller.human;

import dal.HumanDAO;
import java.io.IOException;
import java.sql.SQLException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Slide 34: hỏi DAO, đặt danh sách vào request, forward sang JSP
@WebServlet("/human/list")
public class ListController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            request.setAttribute("humans", new HumanDAO().getHumans());
        } catch (SQLException e) {
            throw new ServletException(e);                         // để Tomcat báo 500 thay vì một bảng trống
        }
        request.getRequestDispatcher("/WEB-INF/view/human/list.jsp").forward(request, response);
    }
}</code></pre>
<p>View nằm dưới <code>WEB-INF/view</code> nên trình duyệt không request thẳng JSP được — chỉ controller tới được nó, qua <code>forward</code>. Nếu DAO ném lỗi, ta bọc nó trong một <code>ServletException</code> để Tomcat báo 500 thay vì một trang trống.</p>
<div class="pitfall">Slide forward tới <code>"../view/human/list.jsp"</code> (đường dẫn tương đối). Nên dùng đường dẫn theo context bắt đầu bằng <code>/</code> (<code>/WEB-INF/view/human/list.jsp</code>): nó không phụ thuộc URL của servlet, nên vẫn chạy khi ánh xạ đổi.</div>`],
      [35, '(Demo 3) DBContext.getHumans — the DAO read',
        `<p class="y-chinh">🎯 <code>getHumans()</code> runs one SQL <code>INNER JOIN</code> (Human ⋈ HumanType), loops the ResultSet, and turns each row into a <code>Human</code> object (with its <code>HumanType</code> inside) — the five steps, in one method.</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/dal/HumanDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public List&lt;Human&gt; getHumans() throws SQLException {          // slide 35, with try-with-resources
    List&lt;Human&gt; humans = new ArrayList&lt;&gt;();
    try (Connection con = DBContext.getConnection();
         PreparedStatement ps = con.prepareStatement(SELECT + " ORDER BY h.humanid");
         ResultSet rs = ps.executeQuery()) {
        while (rs.next()) humans.add(map(rs));
    }
    return humans;
}</code></pre>
<p>The row-to-object part (the slide's lines 45–55) is factored into <code>map(rs)</code>, reused by every query that returns a Human:</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/dal/HumanDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private static Human map(ResultSet rs) throws SQLException {    // one row → one object (slide 35, lines 45–55)
    Human h = new Human();
    h.setId(rs.getInt("humanid"));
    h.setName(rs.getString("humanname"));
    h.setDob(rs.getDate("humandob"));
    h.setGender(rs.getBoolean("humangender"));
    h.setType(new HumanType(rs.getInt("typeid"), rs.getString("typename")));
    return h;
}</code></pre>
<p>Two improvements over the slide: the method lives in a dedicated <code>HumanDAO</code> (not in <code>DBContext</code>), and it uses <strong>try-with-resources</strong> so the ResultSet, PreparedStatement and Connection close in the right order even if a row throws.</p>`,
        `<p class="y-chinh">🎯 <code>getHumans()</code> chạy một câu SQL <code>INNER JOIN</code> (Human ⋈ HumanType), lặp qua ResultSet, và biến mỗi dòng thành một đối tượng <code>Human</code> (có <code>HumanType</code> bên trong) — năm bước, trong một phương thức.</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/dal/HumanDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public List&lt;Human&gt; getHumans() throws SQLException {          // slide 35, thêm try-with-resources
    List&lt;Human&gt; humans = new ArrayList&lt;&gt;();
    try (Connection con = DBContext.getConnection();
         PreparedStatement ps = con.prepareStatement(SELECT + " ORDER BY h.humanid");
         ResultSet rs = ps.executeQuery()) {
        while (rs.next()) humans.add(map(rs));
    }
    return humans;
}</code></pre>
<p>Phần biến dòng thành đối tượng (dòng 45–55 của slide) được tách ra <code>map(rs)</code>, dùng lại bởi mọi truy vấn trả về một Human:</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/dal/HumanDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private static Human map(ResultSet rs) throws SQLException {    // một dòng → một đối tượng (slide 35, dòng 45–55)
    Human h = new Human();
    h.setId(rs.getInt("humanid"));
    h.setName(rs.getString("humanname"));
    h.setDob(rs.getDate("humandob"));
    h.setGender(rs.getBoolean("humangender"));
    h.setType(new HumanType(rs.getInt("typeid"), rs.getString("typename")));
    return h;
}</code></pre>
<p>Hai cải tiến so với slide: phương thức nằm trong một <code>HumanDAO</code> riêng (không ở trong <code>DBContext</code>), và nó dùng <strong>try-with-resources</strong> để ResultSet, PreparedStatement và Connection đóng đúng thứ tự dù một dòng có ném lỗi.</p>`],
      [36, '(Demo 3) HumanType model class',
        `<p class="y-chinh">🎯 <code>HumanType</code> is the small model for the type table: fields <code>typeid</code> and <code>name</code>, with getters and setters — the object a Human's <code>type</code> field holds.</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/model/HumanType.java</code></p>
<pre class="web-src"><code class="language-java">package model;

// Slide 36: one row of HumanType
public class HumanType {
    private int typeid;
    private String name;

    public HumanType() { }
    public HumanType(int typeid, String name) { this.typeid = typeid; this.name = name; }

    public int getTypeid() { return typeid; }
    public void setTypeid(int typeid) { this.typeid = typeid; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}</code></pre>
<p>This is the "many side's parent": every Human carries one of these. When the JSP writes <code>h.type.name</code>, this <code>getName()</code> is what EL calls. The DAO's <code>getTypes()</code> (slide 38) returns a list of these to fill the insert form's dropdown.</p>`,
        `<p class="y-chinh">🎯 <code>HumanType</code> là model nhỏ cho bảng loại: các trường <code>typeid</code> và <code>name</code>, với getter và setter — đối tượng mà trường <code>type</code> của một Human giữ.</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/model/HumanType.java</code></p>
<pre class="web-src"><code class="language-java">package model;

// Slide 36: một dòng của HumanType
public class HumanType {
    private int typeid;
    private String name;

    public HumanType() { }
    public HumanType(int typeid, String name) { this.typeid = typeid; this.name = name; }

    public int getTypeid() { return typeid; }
    public void setTypeid(int typeid) { this.typeid = typeid; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}</code></pre>
<p>Đây là "cha của phía nhiều": mỗi Human mang một cái này. Khi JSP viết <code>h.type.name</code>, chính <code>getName()</code> này là thứ EL gọi. Phương thức <code>getTypes()</code> của DAO (slide 38) trả về một danh sách các cái này để điền vào ô chọn của form thêm.</p>`],
      [37, '(Demo 3) InsertController',
        `<p class="y-chinh">🎯 The <code>InsertController</code> handles both HTTP methods: <strong>GET</strong> shows the empty form (with the list of types for the dropdown), <strong>POST</strong> reads the fields, inserts, and <strong>redirects</strong> to the list.</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/controller/human/InsertController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    try {
        request.setAttribute("types", new HumanDAO().getTypes());
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    request.getRequestDispatcher("/WEB-INF/view/human/form.jsp").forward(request, response);
}</code></pre>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/controller/human/InsertController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    HumanForm form = new HumanForm(request);
    if (!form.errors.isEmpty()) {                               // invalid ⇒ show the form again with the messages
        request.setAttribute("errors", form.errors);
        request.setAttribute("human", form.human);
        doGet(request, response);
        return;
    }
    try {
        new HumanDAO().insert(form.human);
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    response.sendRedirect("list");                              // Post/Redirect/Get: F5 will not insert twice
}</code></pre>
<p>Run for real — the empty form, then a valid insert that answers <strong>302 → list</strong> (Post/Redirect/Get, so F5 does not insert twice), then an invalid submit that shows the form again with messages:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-human/human/insert HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Insert human&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;form action="insert" method="post"&gt;
  
  Name &lt;input name="name" value=""&gt;&lt;br&gt;
  DOB &lt;input type="date" name="dob" value=""&gt;&lt;br&gt;
  Gender &lt;input type="radio" name="gender" value="male" checked&gt; male
         &lt;input type="radio" name="gender" value="female" &gt; female&lt;br&gt;
  Type &lt;select name="typeid"&gt;
    &lt;option value="1" &gt;student&lt;/option&gt;
    &lt;option value="2" &gt;teacher&lt;/option&gt;
    &lt;option value="3" &gt;worker&lt;/option&gt;
    &lt;/select&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /jdbc-human/human/insert HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 61

name=Nguy%E1%BB%85n+Lan&amp;dob=2005-03-14&amp;gender=female&amp;typeid=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: list
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /jdbc-human/human/insert HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 45

name=&amp;dob=14%2F03%2F2005&amp;gender=male&amp;typeid=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Insert human&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p class="error"&gt;Name is required&lt;/p&gt;&lt;p class="error"&gt;DOB must be a date yyyy-mm-dd&lt;/p&gt;&lt;form action="insert" method="post"&gt;
  
  Name &lt;input name="name" value=""&gt;&lt;br&gt;
  DOB &lt;input type="date" name="dob" value=""&gt;&lt;br&gt;
  Gender &lt;input type="radio" name="gender" value="male" checked&gt; male
         &lt;input type="radio" name="gender" value="female" &gt; female&lt;br&gt;
  Type &lt;select name="typeid"&gt;
    &lt;option value="1" selected&gt;student&lt;/option&gt;
    &lt;option value="2" &gt;teacher&lt;/option&gt;
    &lt;option value="3" &gt;worker&lt;/option&gt;
    &lt;/select&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<div class="pitfall">Validate on the server (the <code>HumanForm</code> here gathers all errors) — never trust the browser. The delete button in this app is a POST form, not a GET link: a GET that changes data can be triggered by a crawler or a prefetch.</div>`,
        `<p class="y-chinh">🎯 <code>InsertController</code> xử lý cả hai method HTTP: <strong>GET</strong> hiện form trống (kèm danh sách loại cho ô chọn), <strong>POST</strong> đọc các ô, thêm, và <strong>chuyển hướng</strong> về danh sách.</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/controller/human/InsertController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    try {
        request.setAttribute("types", new HumanDAO().getTypes());
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    request.getRequestDispatcher("/WEB-INF/view/human/form.jsp").forward(request, response);
}</code></pre>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/controller/human/InsertController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    HumanForm form = new HumanForm(request);
    if (!form.errors.isEmpty()) {                               // sai ⇒ hiện lại form kèm thông báo
        request.setAttribute("errors", form.errors);
        request.setAttribute("human", form.human);
        doGet(request, response);
        return;
    }
    try {
        new HumanDAO().insert(form.human);
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    response.sendRedirect("list");                              // Post/Redirect/Get: F5 không thêm lần hai
}</code></pre>
<p>Chạy thật — form trống, rồi một lần thêm hợp lệ trả <strong>302 → list</strong> (Post/Redirect/Get, nên F5 không thêm hai lần), rồi một lần gửi sai hiện lại form kèm thông báo:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-human/human/insert HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Insert human&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;form action="insert" method="post"&gt;
  
  Name &lt;input name="name" value=""&gt;&lt;br&gt;
  DOB &lt;input type="date" name="dob" value=""&gt;&lt;br&gt;
  Gender &lt;input type="radio" name="gender" value="male" checked&gt; male
         &lt;input type="radio" name="gender" value="female" &gt; female&lt;br&gt;
  Type &lt;select name="typeid"&gt;
    &lt;option value="1" &gt;student&lt;/option&gt;
    &lt;option value="2" &gt;teacher&lt;/option&gt;
    &lt;option value="3" &gt;worker&lt;/option&gt;
    &lt;/select&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /jdbc-human/human/insert HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 61

name=Nguy%E1%BB%85n+Lan&amp;dob=2005-03-14&amp;gender=female&amp;typeid=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: list
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /jdbc-human/human/insert HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 45

name=&amp;dob=14%2F03%2F2005&amp;gender=male&amp;typeid=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Insert human&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p class="error"&gt;Name is required&lt;/p&gt;&lt;p class="error"&gt;DOB must be a date yyyy-mm-dd&lt;/p&gt;&lt;form action="insert" method="post"&gt;
  
  Name &lt;input name="name" value=""&gt;&lt;br&gt;
  DOB &lt;input type="date" name="dob" value=""&gt;&lt;br&gt;
  Gender &lt;input type="radio" name="gender" value="male" checked&gt; male
         &lt;input type="radio" name="gender" value="female" &gt; female&lt;br&gt;
  Type &lt;select name="typeid"&gt;
    &lt;option value="1" selected&gt;student&lt;/option&gt;
    &lt;option value="2" &gt;teacher&lt;/option&gt;
    &lt;option value="3" &gt;worker&lt;/option&gt;
    &lt;/select&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<div class="pitfall">Kiểm tra ở server (lớp <code>HumanForm</code> ở đây gom đủ mọi lỗi) — đừng bao giờ tin trình duyệt. Nút delete trong app này là một form POST, không phải link GET: một GET làm đổi dữ liệu có thể bị bot hay trình duyệt tải trước kích hoạt.</div>`],
      [38, '(Demo 3) DBContext.getTypes — fill the dropdown',
        `<p class="y-chinh">🎯 <code>getTypes()</code> is a second DAO read: <code>SELECT typeid, typename FROM HumanType</code>, looped into a list of <code>HumanType</code> — the data behind the insert/edit form's <code>&lt;select&gt;</code>.</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/dal/HumanDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public List&lt;HumanType&gt; getTypes() throws SQLException {        // slide 38
    List&lt;HumanType&gt; types = new ArrayList&lt;&gt;();
    try (Connection con = DBContext.getConnection();
         PreparedStatement ps = con.prepareStatement("SELECT typeid, typename FROM HumanType ORDER BY typeid");
         ResultSet rs = ps.executeQuery()) {
        while (rs.next()) types.add(new HumanType(rs.getInt("typeid"), rs.getString("typename")));
    }
    return types;
}</code></pre>
<p>Same five steps, smaller query. The controller calls it, puts the list in the request, and the JSP loops it with JSTL <code>c:forEach</code> to build one <code>&lt;option&gt;</code> per type (and pre-selects the current one when editing). To close the loop, here is the edit form filled from the database for human #2:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-human/human/update?id=2 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Update human&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;form action="update" method="post"&gt;
  &lt;input type="hidden" name="id" value="2"&gt;
  Name &lt;input name="name" value="Elon"&gt;&lt;br&gt;
  DOB &lt;input type="date" name="dob" value="2019-09-09"&gt;&lt;br&gt;
  Gender &lt;input type="radio" name="gender" value="male" &gt; male
         &lt;input type="radio" name="gender" value="female" checked&gt; female&lt;br&gt;
  Type &lt;select name="typeid"&gt;
    &lt;option value="1" &gt;student&lt;/option&gt;
    &lt;option value="2" selected&gt;teacher&lt;/option&gt;
    &lt;option value="3" &gt;worker&lt;/option&gt;
    &lt;/select&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>And editing a human who does not exist answers a clean <strong>404</strong>, not a blank page — the controller checks the DAO's null:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-human/human/update?id=99 HTTP/1.1
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
Apache Tomcat/10.1.61</code></pre>`,
        `<p class="y-chinh">🎯 <code>getTypes()</code> là một lần đọc DAO thứ hai: <code>SELECT typeid, typename FROM HumanType</code>, lặp vào một danh sách <code>HumanType</code> — dữ liệu phía sau ô <code>&lt;select&gt;</code> của form thêm/sửa.</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/dal/HumanDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public List&lt;HumanType&gt; getTypes() throws SQLException {        // slide 38
    List&lt;HumanType&gt; types = new ArrayList&lt;&gt;();
    try (Connection con = DBContext.getConnection();
         PreparedStatement ps = con.prepareStatement("SELECT typeid, typename FROM HumanType ORDER BY typeid");
         ResultSet rs = ps.executeQuery()) {
        while (rs.next()) types.add(new HumanType(rs.getInt("typeid"), rs.getString("typename")));
    }
    return types;
}</code></pre>
<p>Cùng năm bước, truy vấn nhỏ hơn. Controller gọi nó, đặt danh sách vào request, và JSP lặp bằng JSTL <code>c:forEach</code> để dựng một <code>&lt;option&gt;</code> cho mỗi loại (và chọn sẵn loại hiện tại khi sửa). Khép lại vòng, đây là form sửa được điền từ CSDL cho human #2:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-human/human/update?id=2 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Update human&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;form action="update" method="post"&gt;
  &lt;input type="hidden" name="id" value="2"&gt;
  Name &lt;input name="name" value="Elon"&gt;&lt;br&gt;
  DOB &lt;input type="date" name="dob" value="2019-09-09"&gt;&lt;br&gt;
  Gender &lt;input type="radio" name="gender" value="male" &gt; male
         &lt;input type="radio" name="gender" value="female" checked&gt; female&lt;br&gt;
  Type &lt;select name="typeid"&gt;
    &lt;option value="1" &gt;student&lt;/option&gt;
    &lt;option value="2" selected&gt;teacher&lt;/option&gt;
    &lt;option value="3" &gt;worker&lt;/option&gt;
    &lt;/select&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Và sửa một human không tồn tại trả về một <strong>404</strong> gọn gàng, không phải trang trắng — controller kiểm cái null của DAO:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-human/human/update?id=99 HTTP/1.1
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
Apache Tomcat/10.1.61</code></pre>`],
      [39, 'Summary',
        `<p class="y-chinh">🎯 The deck covered: databases and DBMS, the relational model, JDBC and its driver types, the five steps to develop a JDBC application, and demonstrations — a full CRUD web app.</p>
<ul>
<li>Database/DBMS/relational, three SQL languages (DDL/DML/DCL).</li>
<li>JDBC = <code>java.sql</code> interfaces + <code>DriverManager</code>; Type 4 driver <code>mssql-jdbc</code>.</li>
<li>Five steps: load driver → connect → statement → ResultSet → close.</li>
<li>Always <code>PreparedStatement</code> for values (no SQL injection); always close (no leaks); the DAO + MVC shape of the PE.</li>
</ul>
<p class="meo">🧠 The 🧪 practice lesson next turns slides 22–38 into exercises; the quiz checks the exact points the FE loves (NULL, cursor, close order, injection).</p>`,
        `<p class="y-chinh">🎯 Bộ slide đã phủ: cơ sở dữ liệu và DBMS, mô hình quan hệ, JDBC và các loại driver, năm bước phát triển một ứng dụng JDBC, và các ví dụ minh hoạ — một ứng dụng web CRUD đầy đủ.</p>
<ul>
<li>Database/DBMS/quan hệ, ba ngôn ngữ SQL (DDL/DML/DCL).</li>
<li>JDBC = các interface <code>java.sql</code> + <code>DriverManager</code>; driver Type 4 <code>mssql-jdbc</code>.</li>
<li>Năm bước: nạp driver → kết nối → statement → ResultSet → đóng.</li>
<li>Luôn <code>PreparedStatement</code> cho giá trị (không SQL injection); luôn đóng (không rò rỉ); dáng DAO + MVC của PE.</li>
</ul>
<p class="meo">🧠 Bài 🧪 thực hành kế tiếp biến slide 22–38 thành bài tập; quiz kiểm đúng các điểm FE thích (NULL, con trỏ, thứ tự đóng, injection).</p>`],
      [40, 'Thank You',
        `<p class="y-chinh">🎯 End of the JDBC deck. Next you combine JDBC with the MVC architecture (Chapter 6) and then move the object-relational mapping into JPA (Chapter 7) — both build directly on these five steps.</p>
<p>Before moving on, make sure you can write, from a blank file: a <code>DBContext</code> that opens a connection, a DAO with one <code>PreparedStatement</code> SELECT and one <code>executeUpdate</code>, and a controller that forwards a list to a JSP. That is the backbone of the PE.</p>`,
        `<p class="y-chinh">🎯 Hết bộ slide JDBC. Tiếp theo bạn kết hợp JDBC với kiến trúc MVC (Chương 6) rồi chuyển việc ánh xạ đối tượng–quan hệ sang JPA (Chương 7) — cả hai dựng thẳng trên năm bước này.</p>
<p>Trước khi đi tiếp, hãy chắc rằng bạn viết được, từ một file trắng: một <code>DBContext</code> mở kết nối, một DAO với một SELECT <code>PreparedStatement</code> và một <code>executeUpdate</code>, và một controller forward một danh sách sang một JSP. Đó là xương sống của PE.</p>`],
    ]),
    bi(`<h2>📌 What to take away from slides 18–40</h2>
<ul>
<li>Setup: Type 4 jar in <code>WEB-INF/lib</code>; SQL Server needs TCP/IP enabled and the service restarted; port 1433.</li>
<li>Five steps: <code>Class.forName</code> → <code>getConnection</code> → <code>prepareStatement</code> → <code>executeQuery</code>/<code>executeUpdate</code> → close (reverse order).</li>
<li><code>executeQuery</code> → ResultSet (SELECT); <code>executeUpdate</code> → int rows changed (INSERT/UPDATE/DELETE).</li>
<li><strong>Always PreparedStatement for values</strong>: it stops SQL injection (<code>' OR 1=1 --</code>) and the apostrophe bug; the user's input is a value, never SQL.</li>
<li>ResultSet cursor starts at BOF, <code>next()</code> moves forward only by default; <code>getInt</code> on NULL returns 0 — check <code>wasNull()</code>.</li>
<li>Close ResultSet → Statement → Connection (try-with-resources does it); forgetting leaks connections until the pool is dry.</li>
<li>Demo shape = the PE: Controller → DAO (JDBC) → JSP; GET shows the form, POST saves then redirects (PRG).</li>
</ul>`,
    `<h2>📌 Cần mang theo gì từ slide 18–40</h2>
<ul>
<li>Cài đặt: jar Type 4 vào <code>WEB-INF/lib</code>; SQL Server cần bật TCP/IP và khởi động lại dịch vụ; cổng 1433.</li>
<li>Năm bước: <code>Class.forName</code> → <code>getConnection</code> → <code>prepareStatement</code> → <code>executeQuery</code>/<code>executeUpdate</code> → đóng (thứ tự ngược).</li>
<li><code>executeQuery</code> → ResultSet (SELECT); <code>executeUpdate</code> → int số dòng đổi (INSERT/UPDATE/DELETE).</li>
<li><strong>Luôn PreparedStatement cho giá trị</strong>: nó chặn SQL injection (<code>' OR 1=1 --</code>) và lỗi dấu nháy đơn; chữ người dùng là giá trị, không bao giờ là SQL.</li>
<li>Con trỏ ResultSet bắt đầu ở BOF, <code>next()</code> mặc định chỉ đi tới; <code>getInt</code> trên NULL trả 0 — kiểm <code>wasNull()</code>.</li>
<li>Đóng ResultSet → Statement → Connection (try-with-resources làm hộ); quên là rò rỉ kết nối tới khi pool cạn.</li>
<li>Dáng demo = PE: Controller → DAO (JDBC) → JSP; GET hiện form, POST lưu rồi chuyển hướng (PRG).</li>
</ul>`),
    books([
      ['jdbcTutorial', '"Using Prepared Statements" (and SQL injection), "Retrieving and Modifying Values from Result Sets", "Using Transactions"', '"Using Prepared Statements" (và SQL injection), "Retrieving and Modifying Values from Result Sets", "Using Transactions"'],
      ['jdbcTutorial', '"Processing SQL Statements with JDBC", "Using Prepared Statements", "Retrieving and Modifying Values from Result Sets"', '"Processing SQL Statements with JDBC", "Using Prepared Statements", "Retrieving and Modifying Values from Result Sets"'],
    ]),
  ].join('\n'),
};

/* ───────── 5.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · JDBC for real: connect, PreparedStatement, ResultSet, transactions, a CRUD DAO ───────── */
const L_on_ch5 = {
  title: '5.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · JDBC for real: connect, PreparedStatement, ResultSet, transactions, a CRUD DAO|||5.5 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · JDBC thật sự: kết nối, PreparedStatement, ResultSet, giao dịch, DAO CRUD',
  slug: 'prj301-on-ch5',
  type: 'VIDEO',
  description: '7 bài tập Chương 5 có lời giải chạy thật trên Tomcat 10.1 + SQL Server: sửa một chuỗi kết nối hỏng, chọn Statement hay PreparedStatement và chặn SQL injection thật, đọc ResultSet đúng luật con trỏ và xử lý cột NULL, đóng tài nguyên bằng try-with-resources và nhận ra rò rỉ kết nối, một giao dịch chuyển tiền với commit/rollback, tìm kiếm + sắp xếp (danh sách trắng) + phân trang, và một DAO CRUD đầy đủ theo MVC đúng dáng đề PE; 16 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.5 · Practice &amp; review</span>
<h2>JDBC for real — seven exercises that build the PE skeleton</h2>
<p class="lead">Chapter 5 turned a database into Java objects: open a connection, send SQL with a <code>PreparedStatement</code>, read a <code>ResultSet</code>, close everything, wrap updates in a transaction, and organise it all in a DAO behind MVC. These seven exercises use every piece, and the last one is almost exactly a PE paper. Every solution ran on Tomcat 10.1 against a real SQL Server; the real responses are shown under each.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>1</td><td>fix a broken connection string (read the error)</td><td>22–23</td></tr>
<tr><td>2</td><td>Statement or PreparedStatement? stop SQL injection</td><td>24</td></tr>
<tr><td>3</td><td>read a ResultSet: cursor, labels, NULL</td><td>25</td></tr>
<tr><td>4</td><td>close resources with try-with-resources; a leak</td><td>26</td></tr>
<tr><td>5</td><td>a transaction: commit, rollback, money not lost</td><td>(Ch.5 extension)</td></tr>
<tr><td>6</td><td>search + sort (whitelist) + pagination</td><td>(Ch.5 extension, PE)</td></tr>
<tr><td>7</td><td>a complete CRUD DAO wired to JSP (MVC)</td><td>28–38</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.5 · Thực hành &amp; ôn tập</span>
<h2>JDBC thật sự — bảy bài tập dựng nên bộ khung của đề PE</h2>
<p class="lead">Chương 5 biến một cơ sở dữ liệu thành các đối tượng Java: mở kết nối, gửi SQL bằng <code>PreparedStatement</code>, đọc một <code>ResultSet</code>, đóng mọi thứ, bọc các câu update trong một giao dịch, và tổ chức tất cả trong một DAO phía sau MVC. Bảy bài tập này dùng từng mảnh, và bài cuối gần như đúng là một đề PE. Lời giải nào cũng đã chạy trên Tomcat 10.1 với một SQL Server thật; response thật nằm ngay bên dưới.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>1</td><td>sửa một chuỗi kết nối hỏng (đọc lỗi)</td><td>22–23</td></tr>
<tr><td>2</td><td>Statement hay PreparedStatement? chặn SQL injection</td><td>24</td></tr>
<tr><td>3</td><td>đọc một ResultSet: con trỏ, nhãn, NULL</td><td>25</td></tr>
<tr><td>4</td><td>đóng tài nguyên bằng try-with-resources; một rò rỉ</td><td>26</td></tr>
<tr><td>5</td><td>một giao dịch: commit, rollback, tiền không mất</td><td>(mở rộng Ch.5)</td></tr>
<tr><td>6</td><td>tìm + sắp xếp (danh sách trắng) + phân trang</td><td>(mở rộng Ch.5, PE)</td></tr>
<tr><td>7</td><td>một DAO CRUD đầy đủ nối với JSP (MVC)</td><td>28–38</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — Fix the connection string (~10 min)</h3>
<p>A classmate's SQL Server connection fails. For each symptom below, name the cause and the fix. The errors are real, run against our server with one thing wrong each time:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=typo-driver HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 96

case: typo-driver
java.lang.ClassNotFoundException
com.microsoft.sqlserver.jdbc.SqlServerDriver</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=wrong-port HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 311

case: wrong-port
com.microsoft.sqlserver.jdbc.SQLServerException
The TCP/IP connection to the host host.docker.internal, port 14339 has failed.
  caused by: "Connection refused. Verify the connection properties. Make sure that an instance of SQL Server is running on the host and accepting TCP/IP connection…</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=slide33-url HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 387

case: slide33-url
com.microsoft.sqlserver.jdbc.SQLServerException
"encrypt" property is set to "true" and "trustServerCertificate" property is set to "false" but the driver could not establish a secure connection to …
  caused by: (certificate_unknown) PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path t…</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=wrong-db HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 166

case: wrong-db
com.microsoft.sqlserver.jdbc.SQLServerException
Cannot open database "PRJ301_KhongCo" requested by the login. The login failed. ClientConnectionId:…</code></pre>
<p class="dap-an">✅ Answers: (1) <code>SqlServerDriver</code> → <code>SQLServerDriver</code> (Java is case-sensitive; the class is not found). (2) wrong port → "TCP/IP connection … has failed" (server stopped, TCP/IP off, or wrong port — check the service is Running on 1433). (3) missing <code>trustServerCertificate=true</code> with <code>encrypt=true</code> (the default since driver 10.2) → "could not establish a secure connection … PKIX path building failed"; add it, or install a trusted certificate. (4) wrong database name → "Cannot open database … requested by the login". A working connection:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=ok HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 40

case: ok
OK -&gt; Kết nối thành công</code></pre>
<div class="pitfall">Read the error text, do not guess. Each message names the exact step that failed — "No suitable driver" is step 1 (driver not loaded), "connection … failed" is the TCP step, "Login failed" is the password, "Cannot open database" is the last step.</div>`,
    `<h3>🧪 Bài 1 — Sửa chuỗi kết nối (~10 phút)</h3>
<p>Kết nối SQL Server của một bạn cùng lớp hỏng. Với từng triệu chứng dưới đây, nêu nguyên nhân và cách sửa. Các lỗi là thật, chạy với server của ta, mỗi lần một thứ sai:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=typo-driver HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 96

case: typo-driver
java.lang.ClassNotFoundException
com.microsoft.sqlserver.jdbc.SqlServerDriver</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=wrong-port HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 311

case: wrong-port
com.microsoft.sqlserver.jdbc.SQLServerException
The TCP/IP connection to the host host.docker.internal, port 14339 has failed.
  caused by: "Connection refused. Verify the connection properties. Make sure that an instance of SQL Server is running on the host and accepting TCP/IP connection…</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=slide33-url HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 387

case: slide33-url
com.microsoft.sqlserver.jdbc.SQLServerException
"encrypt" property is set to "true" and "trustServerCertificate" property is set to "false" but the driver could not establish a secure connection to …
  caused by: (certificate_unknown) PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path t…</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=wrong-db HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 166

case: wrong-db
com.microsoft.sqlserver.jdbc.SQLServerException
Cannot open database "PRJ301_KhongCo" requested by the login. The login failed. ClientConnectionId:…</code></pre>
<p class="dap-an">✅ Đáp án: (1) <code>SqlServerDriver</code> → <code>SQLServerDriver</code> (Java phân biệt hoa thường; không tìm thấy lớp). (2) sai cổng → "TCP/IP connection … has failed" (dịch vụ dừng, TCP/IP tắt, hoặc sai cổng — kiểm dịch vụ đang Running ở 1433). (3) thiếu <code>trustServerCertificate=true</code> khi có <code>encrypt=true</code> (mặc định từ driver 10.2) → "could not establish a secure connection … PKIX path building failed"; thêm nó vào, hoặc cài một chứng chỉ tin cậy. (4) sai tên CSDL → "Cannot open database … requested by the login". Một kết nối chạy được:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-loi-ket-noi/try?case=ok HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 40

case: ok
OK -&gt; Kết nối thành công</code></pre>
<div class="pitfall">Đọc chữ lỗi, đừng đoán. Mỗi thông báo nêu đúng bước đã hỏng — "No suitable driver" là bước 1 (chưa nạp driver), "connection … failed" là bước TCP, "Login failed" là mật khẩu, "Cannot open database" là bước cuối.</div>`),
    bi(`<h3>🧪 Exercise 2 — Statement or PreparedStatement? (~15 min)</h3>
<p>Here a login servlet concatenates the user's input into the SQL. Predict what happens when the attacker types <code>' OR 1=1 --</code> and <code>admin' --</code> into the username box, then confirm with the real responses:</p>
<p class="ghi-chu">📄 <code>jdbc-sql-injection/src/main/java/controller/LoginStatementServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">String sql = "SELECT username, fullName, role FROM Account"
           + " WHERE username = '" + user + "' AND password = '" + pass + "'";
out.println("SQL sent: " + sql);                       // exactly what SQL Server parses
try (Connection con = DBContext.getConnection();
     Statement st = con.createStatement();
     ResultSet rs = st.executeQuery(sql)) {
    if (rs.next()) out.println("LOGIN OK -&gt; " + rs.getString("username") + " (" + rs.getString("role") + ")");
    else out.println("Login failed");
} catch (Exception e) {
    out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /jdbc-sql-injection/login-statement HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

user=%27+OR+1%3D1+--+&amp;pass=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 132

SQL sent: SELECT username, fullName, role FROM Account WHERE username = '' OR 1=1 -- ' AND password = 'x'
LOGIN OK -&gt; admin (ADMIN)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /jdbc-sql-injection/login-statement HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 31

user=admin%27+--+&amp;pass=doan-bua</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 137

SQL sent: SELECT username, fullName, role FROM Account WHERE username = 'admin' -- ' AND password = 'doan-bua'
LOGIN OK -&gt; admin (ADMIN)</code></pre>
<p class="dap-an">✅ Both log in as admin, without the password. <code>' OR 1=1 --</code> makes the WHERE always true and comments out the password check; <code>admin' --</code> closes the username string and comments out the rest. A search box leaks every password with a UNION:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-sql-injection/search-statement?q=%27+UNION+SELECT+username+%2B+%27+%2F+%27+%2B+password%2C+0+FROM+Account+--+ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 288

SQL sent: SELECT name, price FROM Product WHERE name LIKE '%' UNION SELECT username + ' / ' + password, 0 FROM Account -- %'
  admin / Admin@2026 | 0
  cuong / Prj301! | 0
  Keyboard Proview | 40
  lan / Lan#1999 | 0
  Mouse Proview | 30
  Sách O'Reilly Head First Java | 350
(6 row(s))</code></pre>
<p>The fix is a one-line change to a <code>?</code> placeholder — now the input is a value, never SQL. Same attacks, harmless:</p>
<p class="ghi-chu">📄 <code>jdbc-sql-injection/src/main/java/controller/LoginPreparedServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">String sql = "SELECT username, fullName, role FROM Account WHERE username = ? AND password = ?";
out.println("SQL sent: " + sql);
out.println("params  : [1]=" + user + "  [2]=" + pass);   // values, never parsed as SQL
try (Connection con = DBContext.getConnection();
     PreparedStatement ps = con.prepareStatement(sql)) {
    ps.setString(1, user);                                 // index starts at 1
    ps.setString(2, pass);
    try (ResultSet rs = ps.executeQuery()) {               // no argument here
        if (rs.next()) out.println("LOGIN OK -&gt; " + rs.getString("username") + " (" + rs.getString("role") + ")");
        else out.println("Login failed");
    }
} catch (Exception e) {
    out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /jdbc-sql-injection/login-prepared HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

user=%27+OR+1%3D1+--+&amp;pass=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 138

SQL sent: SELECT username, fullName, role FROM Account WHERE username = ? AND password = ?
params  : [1]=' OR 1=1 --   [2]=x
Login failed</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-sql-injection/search-prepared?q=%27+UNION+SELECT+username+%2B+%27+%2F+%27+%2B+password%2C+0+FROM+Account+--+ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 142

SQL sent: SELECT name, price FROM Product WHERE name LIKE ?   [1]=%' UNION SELECT username + ' / ' + password, 0 FROM Account -- %
(0 row(s))</code></pre>
<div class="pitfall">Rule: use <code>PreparedStatement</code> for <strong>every</strong> query that carries a value — login, search, insert, update. A <code>Statement</code> is acceptable only for SQL with no user input at all. The same fix stops the ordinary apostrophe bug (<code>O'Reilly</code>) too.</div>`,
    `<h3>🧪 Bài 2 — Statement hay PreparedStatement? (~15 phút)</h3>
<p>Ở đây một servlet đăng nhập nối chữ người dùng vào SQL. Đoán chuyện gì xảy ra khi kẻ tấn công gõ <code>' OR 1=1 --</code> và <code>admin' --</code> vào ô tên đăng nhập, rồi xác nhận bằng response thật:</p>
<p class="ghi-chu">📄 <code>jdbc-sql-injection/src/main/java/controller/LoginStatementServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">String sql = "SELECT username, fullName, role FROM Account"
           + " WHERE username = '" + user + "' AND password = '" + pass + "'";
out.println("SQL sent: " + sql);                       // đúng chuỗi SQL Server sẽ phân tích
try (Connection con = DBContext.getConnection();
     Statement st = con.createStatement();
     ResultSet rs = st.executeQuery(sql)) {
    if (rs.next()) out.println("LOGIN OK -&gt; " + rs.getString("username") + " (" + rs.getString("role") + ")");
    else out.println("Login failed");
} catch (Exception e) {
    out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /jdbc-sql-injection/login-statement HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

user=%27+OR+1%3D1+--+&amp;pass=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 132

SQL sent: SELECT username, fullName, role FROM Account WHERE username = '' OR 1=1 -- ' AND password = 'x'
LOGIN OK -&gt; admin (ADMIN)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /jdbc-sql-injection/login-statement HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 31

user=admin%27+--+&amp;pass=doan-bua</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 137

SQL sent: SELECT username, fullName, role FROM Account WHERE username = 'admin' -- ' AND password = 'doan-bua'
LOGIN OK -&gt; admin (ADMIN)</code></pre>
<p class="dap-an">✅ Cả hai đăng nhập được với quyền admin, không cần mật khẩu. <code>' OR 1=1 --</code> làm WHERE luôn đúng và biến phần kiểm mật khẩu thành chú thích; <code>admin' --</code> đóng chuỗi tên đăng nhập và chú thích phần còn lại. Một ô tìm kiếm làm lộ mọi mật khẩu bằng một UNION:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-sql-injection/search-statement?q=%27+UNION+SELECT+username+%2B+%27+%2F+%27+%2B+password%2C+0+FROM+Account+--+ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 288

SQL sent: SELECT name, price FROM Product WHERE name LIKE '%' UNION SELECT username + ' / ' + password, 0 FROM Account -- %'
  admin / Admin@2026 | 0
  cuong / Prj301! | 0
  Keyboard Proview | 40
  lan / Lan#1999 | 0
  Mouse Proview | 30
  Sách O'Reilly Head First Java | 350
(6 row(s))</code></pre>
<p>Cách sửa là một thay đổi một dòng thành dấu <code>?</code> — giờ input là một giá trị, không bao giờ là SQL. Cùng các đòn tấn công, vô hại:</p>
<p class="ghi-chu">📄 <code>jdbc-sql-injection/src/main/java/controller/LoginPreparedServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">String sql = "SELECT username, fullName, role FROM Account WHERE username = ? AND password = ?";
out.println("SQL sent: " + sql);
out.println("params  : [1]=" + user + "  [2]=" + pass);   // giá trị, không bao giờ bị phân tích như SQL
try (Connection con = DBContext.getConnection();
     PreparedStatement ps = con.prepareStatement(sql)) {
    ps.setString(1, user);                                 // chỉ số bắt đầu từ 1
    ps.setString(2, pass);
    try (ResultSet rs = ps.executeQuery()) {               // ở đây không truyền tham số
        if (rs.next()) out.println("LOGIN OK -&gt; " + rs.getString("username") + " (" + rs.getString("role") + ")");
        else out.println("Login failed");
    }
} catch (Exception e) {
    out.println(e.getClass().getSimpleName() + ": " + e.getMessage());
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /jdbc-sql-injection/login-prepared HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

user=%27+OR+1%3D1+--+&amp;pass=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 138

SQL sent: SELECT username, fullName, role FROM Account WHERE username = ? AND password = ?
params  : [1]=' OR 1=1 --   [2]=x
Login failed</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-sql-injection/search-prepared?q=%27+UNION+SELECT+username+%2B+%27+%2F+%27+%2B+password%2C+0+FROM+Account+--+ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 142

SQL sent: SELECT name, price FROM Product WHERE name LIKE ?   [1]=%' UNION SELECT username + ' / ' + password, 0 FROM Account -- %
(0 row(s))</code></pre>
<div class="pitfall">Luật: dùng <code>PreparedStatement</code> cho <strong>mọi</strong> truy vấn mang một giá trị — đăng nhập, tìm kiếm, thêm, sửa. Một <code>Statement</code> chỉ chấp nhận được cho SQL hoàn toàn không có dữ liệu người dùng. Cùng cách sửa cũng chặn luôn lỗi dấu nháy đơn thường ngày (<code>O'Reilly</code>).</div>`),
    bi(`<h3>🧪 Exercise 3 — Read a ResultSet correctly (~15 min)</h3>
<p>A table <code>T_employee(id, name, desc, bonus)</code> where <code>bonus</code> can be NULL. Answer three questions, then check against the real runs: (a) how do you read the column aliased <code>SELECT [desc] AS description</code> — by name or by label? (b) what does <code>getInt("bonus")</code> return for the row whose bonus is NULL? (c) what happens if you call <code>previous()</code> on the default cursor?</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=label-vs-name HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 193

case: label-vs-name
getString("description") = Backend developer
column name = description, label = description
getString("desc") ...
→ SQLServerException: The column name desc is not valid.</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=null HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 142

case: null
An: getInt=500 wasNull=false getObject=500
Bình: getInt=0 wasNull=true getObject=null
Chi: getInt=900 wasNull=false getObject=900</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=previous HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 134

case: previous
type = TYPE_FORWARD_ONLY
→ SQLServerException: The requested operation is not supported on forward only result sets.</code></pre>
<p class="dap-an">✅ (a) read it by its <strong>label</strong> <code>description</code>; <code>getString("desc")</code> throws "column name desc is not valid". (b) <code>getInt</code> returns <strong>0</strong> for a NULL — you cannot tell 0 from NULL unless you call <code>wasNull()</code> right after (or use <code>getObject("bonus", Integer.class)</code>, which stays <code>null</code>). (c) the default cursor is <code>TYPE_FORWARD_ONLY</code>, so <code>previous()</code> throws "operation is not supported on forward only result sets" — make a scrollable statement if you really need it.</p>
<div class="pitfall">Two more real exceptions to recognise: reading a column before the first <code>next()</code>, or after <code>next()</code> returned false, both throw "the result set has no current row"; column indexes start at <strong>1</strong>, so <code>getString(0)</code> throws "index 0 is out of range".</div>`,
    `<h3>🧪 Bài 3 — Đọc một ResultSet cho đúng (~15 phút)</h3>
<p>Một bảng <code>T_employee(id, name, desc, bonus)</code> mà <code>bonus</code> có thể NULL. Trả lời ba câu, rồi đối chiếu với các lần chạy thật: (a) đọc cột đặt bí danh <code>SELECT [desc] AS description</code> thế nào — theo tên hay theo nhãn? (b) <code>getInt("bonus")</code> trả gì cho dòng có bonus là NULL? (c) chuyện gì xảy ra nếu gọi <code>previous()</code> trên con trỏ mặc định?</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=label-vs-name HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 193

case: label-vs-name
getString("description") = Backend developer
column name = description, label = description
getString("desc") ...
→ SQLServerException: The column name desc is not valid.</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=null HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 142

case: null
An: getInt=500 wasNull=false getObject=500
Bình: getInt=0 wasNull=true getObject=null
Chi: getInt=900 wasNull=false getObject=900</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-resultset/rs?case=previous HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 134

case: previous
type = TYPE_FORWARD_ONLY
→ SQLServerException: The requested operation is not supported on forward only result sets.</code></pre>
<p class="dap-an">✅ (a) đọc theo <strong>nhãn (label)</strong> <code>description</code>; <code>getString("desc")</code> ném "column name desc is not valid". (b) <code>getInt</code> trả <strong>0</strong> cho một NULL — bạn không phân biệt được 0 với NULL trừ khi gọi <code>wasNull()</code> ngay sau (hoặc dùng <code>getObject("bonus", Integer.class)</code>, cái này giữ <code>null</code>). (c) con trỏ mặc định là <code>TYPE_FORWARD_ONLY</code>, nên <code>previous()</code> ném "operation is not supported on forward only result sets" — làm một statement cuộn được (scrollable) nếu bạn thật sự cần.</p>
<div class="pitfall">Hai exception thật nữa cần nhận ra: đọc một cột trước <code>next()</code> đầu tiên, hoặc sau khi <code>next()</code> trả false, đều ném "the result set has no current row"; chỉ số cột bắt đầu từ <strong>1</strong>, nên <code>getString(0)</code> ném "index 0 is out of range".</div>`),
    bi(`<h3>🧪 Exercise 4 — Close resources, avoid a leak (~15 min)</h3>
<p>What is wrong with "run a second <code>executeQuery</code> on the same Statement while the first ResultSet is still open"? And what does forgetting to close a Connection do to a server over many requests? Both run for real.</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-dong-tai-nguyen/close?case=same-statement HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 128

case: same-statement
rs2 opened fine; rs1.isClosed() = true
rs2 first row: An
→ SQLServerException: The result set is closed.</code></pre>
<p class="dap-an">✅ A Statement holds only one open ResultSet; the second query silently closes the first, so touching <code>rs1</code> afterwards throws "the result set is closed". Fix: finish with <code>rs1</code> first (or copy it to a list), or use two Statements. The clean way is <strong>try-with-resources</strong> — it closes ResultSet → Statement → Connection in the right order for you:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-dong-tai-nguyen/close?case=order HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 111

case: order
count = 3 — leaving the try block…
closed ResultSet
closed PreparedStatement
closed Connection</code></pre>
<p>Forgetting <code>close()</code> leaks the connection. Measured against SQL Server's own session view: three un-closed requests leave three open sessions; three try-with-resources requests leave none.</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-dong-tai-nguyen/close?case=leak HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 135

case: leak
after 3 requests WITHOUT close: 3 open session(s) on SQL Server
after 3 requests WITH try-with-resources: 0 open session(s)</code></pre>
<div class="pitfall">A leak does not fail the first request — it fails the hundredth, when the pool is exhausted and every new request hangs waiting for a connection. Always close, and try-with-resources makes it impossible to forget.</div>`,
    `<h3>🧪 Bài 4 — Đóng tài nguyên, tránh rò rỉ (~15 phút)</h3>
<p>"Chạy một <code>executeQuery</code> thứ hai trên cùng một Statement khi ResultSet đầu còn mở" sai ở đâu? Và quên đóng một Connection gây gì cho server qua nhiều request? Cả hai chạy thật.</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-dong-tai-nguyen/close?case=same-statement HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 128

case: same-statement
rs2 opened fine; rs1.isClosed() = true
rs2 first row: An
→ SQLServerException: The result set is closed.</code></pre>
<p class="dap-an">✅ Một Statement chỉ giữ một ResultSet mở; câu truy vấn thứ hai âm thầm đóng cái thứ nhất, nên chạm <code>rs1</code> sau đó là ném "the result set is closed". Sửa: xong với <code>rs1</code> trước (hoặc chép nó vào một list), hoặc dùng hai Statement. Cách sạch là <strong>try-with-resources</strong> — nó đóng ResultSet → Statement → Connection đúng thứ tự hộ bạn:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-dong-tai-nguyen/close?case=order HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 111

case: order
count = 3 — leaving the try block…
closed ResultSet
closed PreparedStatement
closed Connection</code></pre>
<p>Quên <code>close()</code> làm rò rỉ kết nối. Đo bằng chính view phiên của SQL Server: ba request không đóng để lại ba phiên mở; ba request try-with-resources không để lại cái nào.</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-dong-tai-nguyen/close?case=leak HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 135

case: leak
after 3 requests WITHOUT close: 3 open session(s) on SQL Server
after 3 requests WITH try-with-resources: 0 open session(s)</code></pre>
<div class="pitfall">Một rò rỉ không làm hỏng request đầu tiên — nó làm hỏng request thứ một trăm, khi pool cạn và mọi request mới đều treo chờ một kết nối. Luôn đóng, và try-with-resources khiến không thể quên.</div>`),
    bi(`<h3>🧪 Exercise 5 — A transaction that keeps money safe (~15 min)</h3>
<p>Transferring money is two updates: debit An, credit Bình. If the second fails, the first must be undone — otherwise money vanishes. Run the transfer two ways. First <strong>without</strong> a transaction (auto-commit on), with an amount that makes the credit overflow a ceiling:</p>
<p class="ghi-chu">📄 <code>jdbc-transaction/src/main/java/controller/TransferServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">if (useTx) con.setAutoCommit(false);                // start a transaction: nothing is final until commit
try (PreparedStatement debit  = con.prepareStatement("UPDATE Account SET balance = balance - ? WHERE id = 1");
     PreparedStatement credit = con.prepareStatement("UPDATE Account SET balance = balance + ? WHERE id = 2")) {
    debit.setInt(1, amount);
    debit.executeUpdate();                          // step 1: take from An
    out.println("debited An by " + amount);
    credit.setInt(1, amount);
    credit.executeUpdate();                         // step 2: give to Bình — the CHECK may reject step 1
    out.println("credited Bình by " + amount);
    if (useTx) { con.commit(); out.println("COMMIT"); }   // both updates become final together
} catch (SQLException e) {
    if (useTx) { con.rollback(); out.println("ROLLBACK (" + e.getMessage() + ")"); }   // undo step 1 too
    else out.println("FAILED mid-way, NOT undone (" + e.getMessage() + ")");           // step 1 already committed by auto-commit!
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-transaction/transfer?amount=80&amp;mode=no-tx HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 320

mode=no transaction  amount=80
debited An by 80
FAILED mid-way, NOT undone (The UPDATE statement conflicted with the CHECK constraint "CK__Account__balance__37A5467C". The conflict occurred in database "PRJ301_Tx", table "dbo.Account", column 'bala … (+6 chars / ký tự)
  An = 20
  Bình = 100
  total = 120 (!! money created or lost)</code></pre>
<p class="dap-an">✅ Without a transaction, auto-commit made the debit final the moment it ran; the credit then failed the CHECK, so An lost 80 and Bình gained nothing — <strong>total dropped from 200 to 120</strong>. Now the same with a transaction (<code>setAutoCommit(false)</code>, then <code>commit()</code> or <code>rollback()</code>):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-transaction/transfer?amount=80&amp;mode=tx HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 291

mode=transaction  amount=80
debited An by 80
ROLLBACK (The UPDATE statement conflicted with the CHECK constraint "CK__Account__balance__37A5467C". The conflict occurred in database "PRJ301_Tx", table "dbo.Account", column 'balance'.)
  An = 100
  Bình = 100
  total = 200 (money conserved)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-transaction/transfer?amount=30&amp;mode=tx HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 129

mode=transaction  amount=30
debited An by 30
credited Bình by 30
COMMIT
  An = 70
  Bình = 130
  total = 200 (money conserved)</code></pre>
<p>With the transaction, the failed credit triggers <code>rollback()</code>, which undoes the debit too — both accounts return to 100, total stays 200. A successful transfer commits both together.</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): you write <code>@Transactional</code> on a service method and Spring does the <code>setAutoCommit(false)</code> / <code>commit</code> / <code>rollback</code> for you, rolling back automatically on any unchecked exception. This exercise is what that annotation does underneath.</div>`,
    `<h3>🧪 Bài 5 — Một giao dịch giữ tiền an toàn (~15 phút)</h3>
<p>Chuyển tiền là hai câu update: trừ của An, cộng cho Bình. Nếu câu thứ hai hỏng, câu thứ nhất phải được hoàn tác — không thì tiền biến mất. Chạy lần chuyển theo hai cách. Trước hết <strong>không</strong> giao dịch (auto-commit bật), với số tiền làm câu cộng vượt trần:</p>
<p class="ghi-chu">📄 <code>jdbc-transaction/src/main/java/controller/TransferServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">if (useTx) con.setAutoCommit(false);                // mở một giao dịch: chưa gì là chính thức cho tới khi commit
try (PreparedStatement debit  = con.prepareStatement("UPDATE Account SET balance = balance - ? WHERE id = 1");
     PreparedStatement credit = con.prepareStatement("UPDATE Account SET balance = balance + ? WHERE id = 2")) {
    debit.setInt(1, amount);
    debit.executeUpdate();                          // bước 1: trừ của An
    out.println("debited An by " + amount);
    credit.setInt(1, amount);
    credit.executeUpdate();                         // bước 2: cộng cho Bình — CHECK có thể đã chặn bước 1
    out.println("credited Bình by " + amount);
    if (useTx) { con.commit(); out.println("COMMIT"); }   // cả hai update cùng thành chính thức
} catch (SQLException e) {
    if (useTx) { con.rollback(); out.println("ROLLBACK (" + e.getMessage() + ")"); }   // hoàn tác cả bước 1
    else out.println("FAILED mid-way, NOT undone (" + e.getMessage() + ")");           // bước 1 đã bị auto-commit ghi rồi!
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-transaction/transfer?amount=80&amp;mode=no-tx HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 320

mode=no transaction  amount=80
debited An by 80
FAILED mid-way, NOT undone (The UPDATE statement conflicted with the CHECK constraint "CK__Account__balance__37A5467C". The conflict occurred in database "PRJ301_Tx", table "dbo.Account", column 'bala … (+6 chars / ký tự)
  An = 20
  Bình = 100
  total = 120 (!! money created or lost)</code></pre>
<p class="dap-an">✅ Không có giao dịch, auto-commit đã ghi cứng câu trừ ngay khi nó chạy; câu cộng rồi hỏng CHECK, nên An mất 80 còn Bình không được gì — <strong>tổng tụt từ 200 xuống 120</strong>. Giờ cũng việc đó nhưng có giao dịch (<code>setAutoCommit(false)</code>, rồi <code>commit()</code> hoặc <code>rollback()</code>):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-transaction/transfer?amount=80&amp;mode=tx HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 291

mode=transaction  amount=80
debited An by 80
ROLLBACK (The UPDATE statement conflicted with the CHECK constraint "CK__Account__balance__37A5467C". The conflict occurred in database "PRJ301_Tx", table "dbo.Account", column 'balance'.)
  An = 100
  Bình = 100
  total = 200 (money conserved)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-transaction/transfer?amount=30&amp;mode=tx HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 129

mode=transaction  amount=30
debited An by 30
credited Bình by 30
COMMIT
  An = 70
  Bình = 130
  total = 200 (money conserved)</code></pre>
<p>Có giao dịch, câu cộng hỏng kích hoạt <code>rollback()</code>, hoàn tác cả câu trừ — cả hai tài khoản về lại 100, tổng vẫn 200. Một lần chuyển thành công thì commit cả hai cùng lúc.</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): bạn viết <code>@Transactional</code> trên một phương thức service và Spring làm <code>setAutoCommit(false)</code> / <code>commit</code> / <code>rollback</code> hộ bạn, tự rollback khi có bất kỳ unchecked exception nào. Bài này chính là thứ annotation đó làm bên dưới.</div>`),
    bi(`<h3>🧪 Exercise 6 — Search, sort and pagination (~20 min)</h3>
<p>The PE almost always asks for a list you can search and page through. Build it with one <code>PreparedStatement</code>: filter by name with <code>LIKE ?</code>, sort by a column, and page with SQL Server's <code>OFFSET ? ROWS FETCH NEXT ? ROWS ONLY</code>. The catch: a <strong>sort column cannot be a <code>?</code> parameter</strong> — so how do you let the user choose it safely?</p>
<p class="ghi-chu">📄 <code>jdbc-tim-phan-trang/src/main/java/controller/SearchServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// A sort column CANNOT be a ? parameter, so it must be validated against a fixed whitelist
private static String orderColumn(String sort) {
    return switch (sort == null ? "" : sort) {
        case "name"       -&gt; "name ASC";
        case "price"      -&gt; "price ASC";
        case "price-desc" -&gt; "price DESC";
        default           -&gt; "id ASC";                                // the safe default
    };
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-tim-phan-trang/search HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 191

q='' sort=null → ORDER BY id ASC  page=1
  #1  Mouse Proview  20
  #2  Mouse Logitech  35
  #3  Keyboard Proview  40
  #4  Keyboard Dare  45
  #5  LCD Dell 24  190
page 1/5  (23 match(es))</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-tim-phan-trang/search?q=Mouse&amp;sort=price HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 145

q='Mouse' sort=price → ORDER BY price ASC  page=1
  #20  Mouse pad  8
  #1  Mouse Proview  20
  #2  Mouse Logitech  35
page 1/1  (3 match(es))</code></pre>
<p class="dap-an">✅ A value (the search text, the page offset) goes in a <code>?</code> parameter. A <em>column name</em> cannot — so you map the user's choice to a fixed string through a <strong>whitelist</strong> (the <code>switch</code> above), falling back to a safe default. Never concatenate the sort parameter into the SQL: here is the attack <code>?sort=price;DROP TABLE Product</code>, which the whitelist turns into the harmless default:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-tim-phan-trang/search?sort=price;DROP+TABLE+Product HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 211

q='' sort=price;DROP TABLE Product → ORDER BY id ASC  page=1
  #1  Mouse Proview  20
  #2  Mouse Logitech  35
  #3  Keyboard Proview  40
  #4  Keyboard Dare  45
  #5  LCD Dell 24  190
page 1/5  (23 match(es))</code></pre>
<p>Pagination clamps an out-of-range page to the last page, so <code>?page=99</code> shows the last page, not an empty one:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-tim-phan-trang/search?page=99 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 133

q='' sort=null → ORDER BY id ASC  page=99
  #21  USB 64GB  12
  #22  Monitor arm  45
  #23  Cable HDMI  9
page 5/5  (23 match(es))</code></pre>
<div class="pitfall">This is the one place a parameter cannot save you — anything that is part of the SQL <em>structure</em> (a column name, a table name, ASC/DESC) must be chosen from a fixed list in your code, never taken from the request as text.</div>`,
    `<h3>🧪 Bài 6 — Tìm kiếm, sắp xếp và phân trang (~20 phút)</h3>
<p>PE gần như luôn đòi một danh sách tìm được và phân trang được. Dựng nó bằng một <code>PreparedStatement</code>: lọc theo tên bằng <code>LIKE ?</code>, sắp xếp theo một cột, và phân trang bằng <code>OFFSET ? ROWS FETCH NEXT ? ROWS ONLY</code> của SQL Server. Cái bẫy: một <strong>cột sắp xếp không thể là tham số <code>?</code></strong> — vậy làm sao để người dùng chọn nó một cách an toàn?</p>
<p class="ghi-chu">📄 <code>jdbc-tim-phan-trang/src/main/java/controller/SearchServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Cột sắp xếp KHÔNG thể là tham số ?, nên phải kiểm với một danh sách trắng cố định
private static String orderColumn(String sort) {
    return switch (sort == null ? "" : sort) {
        case "name"       -&gt; "name ASC";
        case "price"      -&gt; "price ASC";
        case "price-desc" -&gt; "price DESC";
        default           -&gt; "id ASC";                                // mặc định an toàn
    };
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-tim-phan-trang/search HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 191

q='' sort=null → ORDER BY id ASC  page=1
  #1  Mouse Proview  20
  #2  Mouse Logitech  35
  #3  Keyboard Proview  40
  #4  Keyboard Dare  45
  #5  LCD Dell 24  190
page 1/5  (23 match(es))</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-tim-phan-trang/search?q=Mouse&amp;sort=price HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 145

q='Mouse' sort=price → ORDER BY price ASC  page=1
  #20  Mouse pad  8
  #1  Mouse Proview  20
  #2  Mouse Logitech  35
page 1/1  (3 match(es))</code></pre>
<p class="dap-an">✅ Một giá trị (chữ tìm kiếm, offset trang) đi vào một tham số <code>?</code>. Một <em>tên cột</em> thì không — nên bạn ánh xạ lựa chọn của người dùng sang một chuỗi cố định qua một <strong>danh sách trắng (whitelist)</strong> (cái <code>switch</code> ở trên), rơi về một mặc định an toàn. Đừng bao giờ nối tham số sắp xếp vào SQL: đây là đòn tấn công <code>?sort=price;DROP TABLE Product</code>, mà whitelist biến thành mặc định vô hại:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-tim-phan-trang/search?sort=price;DROP+TABLE+Product HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 211

q='' sort=price;DROP TABLE Product → ORDER BY id ASC  page=1
  #1  Mouse Proview  20
  #2  Mouse Logitech  35
  #3  Keyboard Proview  40
  #4  Keyboard Dare  45
  #5  LCD Dell 24  190
page 1/5  (23 match(es))</code></pre>
<p>Phân trang kẹp một trang ngoài phạm vi về trang cuối, nên <code>?page=99</code> hiện trang cuối, không phải một trang trống:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-tim-phan-trang/search?page=99 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 133

q='' sort=null → ORDER BY id ASC  page=99
  #21  USB 64GB  12
  #22  Monitor arm  45
  #23  Cable HDMI  9
page 5/5  (23 match(es))</code></pre>
<div class="pitfall">Đây là chỗ duy nhất một tham số không cứu được bạn — bất cứ thứ gì là một phần <em>cấu trúc</em> SQL (tên cột, tên bảng, ASC/DESC) phải được chọn từ một danh sách cố định trong code, không bao giờ lấy từ request dưới dạng chữ.</div>`),
    bi(`<h3>🧪 Exercise 7 — A complete CRUD DAO wired to MVC (~25 min)</h3>
<p>This is the PE in miniature: one entity (Human), a list page, an insert/edit form, a delete, all through Controller → DAO → JSP. Study the DAO — one <code>map(rs)</code> turns a row into an object, reused by every read; every write is a <code>PreparedStatement</code> inside try-with-resources:</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/dal/HumanDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public Human getHuman(int id) throws SQLException {
    try (Connection con = DBContext.getConnection();
         PreparedStatement ps = con.prepareStatement(SELECT + " WHERE h.humanid = ?")) {
        ps.setInt(1, id);
        try (ResultSet rs = ps.executeQuery()) {
            return rs.next() ? map(rs) : null;                 // null = no such id ⇒ the controller answers 404
        }
    }
}</code></pre>
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
<p>And the insert controller — GET shows the form, POST validates, saves, and redirects (Post/Redirect/Get):</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/controller/human/InsertController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    HumanForm form = new HumanForm(request);
    if (!form.errors.isEmpty()) {                               // invalid ⇒ show the form again with the messages
        request.setAttribute("errors", form.errors);
        request.setAttribute("human", form.human);
        doGet(request, response);
        return;
    }
    try {
        new HumanDAO().insert(form.human);
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    response.sendRedirect("list");                              // Post/Redirect/Get: F5 will not insert twice
}</code></pre>
<p class="dap-an">✅ Run for real: the list, a valid insert answering 302 → list, and editing a missing id answering a clean 404.</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-human/human/list HTTP/1.1
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
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /jdbc-human/human/insert HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 61

name=Nguy%E1%BB%85n+Lan&amp;dob=2005-03-14&amp;gender=female&amp;typeid=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: list
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /jdbc-human/human/update?id=99 HTTP/1.1
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
<div class="pitfall">The four habits the PE rewards: a DAO is the <strong>only</strong> place with SQL (controllers and JSPs have none); every query with a value uses <code>PreparedStatement</code>; <code>getHuman</code> returns <code>null</code> for "not found" so the controller can answer 404; and a successful POST ends in a <strong>redirect</strong>, never a forward, so F5 does not resubmit.</div>`,
    `<h3>🧪 Bài 7 — Một DAO CRUD đầy đủ nối với MVC (~25 phút)</h3>
<p>Đây là PE thu nhỏ: một thực thể (Human), một trang danh sách, một form thêm/sửa, một nút xoá, tất cả qua Controller → DAO → JSP. Nghiên cứu DAO — một <code>map(rs)</code> biến một dòng thành một đối tượng, dùng lại bởi mọi lần đọc; mọi lần ghi là một <code>PreparedStatement</code> trong try-with-resources:</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/dal/HumanDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public Human getHuman(int id) throws SQLException {
    try (Connection con = DBContext.getConnection();
         PreparedStatement ps = con.prepareStatement(SELECT + " WHERE h.humanid = ?")) {
        ps.setInt(1, id);
        try (ResultSet rs = ps.executeQuery()) {
            return rs.next() ? map(rs) : null;                 // null = không có id này ⇒ controller trả 404
        }
    }
}</code></pre>
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
<p>Và controller thêm — GET hiện form, POST kiểm tra, lưu, và chuyển hướng (Post/Redirect/Get):</p>
<p class="ghi-chu">📄 <code>jdbc-human/src/main/java/controller/human/InsertController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    HumanForm form = new HumanForm(request);
    if (!form.errors.isEmpty()) {                               // sai ⇒ hiện lại form kèm thông báo
        request.setAttribute("errors", form.errors);
        request.setAttribute("human", form.human);
        doGet(request, response);
        return;
    }
    try {
        new HumanDAO().insert(form.human);
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    response.sendRedirect("list");                              // Post/Redirect/Get: F5 không thêm lần hai
}</code></pre>
<p class="dap-an">✅ Chạy thật: danh sách, một lần thêm hợp lệ trả 302 → list, và sửa một id không có trả về một 404 gọn gàng.</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-human/human/list HTTP/1.1
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
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /jdbc-human/human/insert HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 61

name=Nguy%E1%BB%85n+Lan&amp;dob=2005-03-14&amp;gender=female&amp;typeid=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: list
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /jdbc-human/human/update?id=99 HTTP/1.1
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
<div class="pitfall">Bốn thói quen PE thưởng điểm: DAO là chỗ <strong>duy nhất</strong> có SQL (controller và JSP không có); mọi truy vấn có giá trị dùng <code>PreparedStatement</code>; <code>getHuman</code> trả <code>null</code> cho "không thấy" để controller trả 404 được; và một POST thành công kết thúc bằng một <strong>redirect</strong>, không bao giờ forward, để F5 không gửi lại.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>JDBC</strong></td><td>Java Database Connectivity</td><td>Java's standard API (package java.sql) for connecting to and querying a relational database.</td></tr>
<tr><td><strong>DBMS</strong></td><td>hệ quản trị cơ sở dữ liệu</td><td>The software that stores and manages databases (SQL Server, PostgreSQL); your code talks to it, never to the raw files.</td></tr>
<tr><td><strong>Type 4 driver</strong></td><td>driver loại 4 (thin)</td><td>A pure-Java JDBC driver that talks the database's own protocol directly over a socket; the only type used today (mssql-jdbc).</td></tr>
<tr><td><strong>DriverManager</strong></td><td>lớp quản lý driver</td><td>The class whose getConnection(url, user, pass) returns a Connection from the loaded driver.</td></tr>
<tr><td><strong>Connection</strong></td><td>kết nối</td><td>An open session to the database; you create statements and control transactions through it, and must close it.</td></tr>
<tr><td><strong>Statement</strong></td><td>câu lệnh (SQL cố định)</td><td>Runs fixed SQL; executeQuery returns a ResultSet, executeUpdate returns a row count. Do not use it with user input.</td></tr>
<tr><td><strong>PreparedStatement</strong></td><td>câu lệnh tham số hoá</td><td>A pre-compiled SQL with ? placeholders filled by setXXX; the value is never parsed as SQL, so it stops injection.</td></tr>
<tr><td><strong>SQL injection</strong></td><td>tấn công chèn SQL</td><td>Breaking a query by typing SQL into an input (e.g. ' OR 1=1 --); prevented by PreparedStatement.</td></tr>
<tr><td><strong>ResultSet</strong></td><td>tập kết quả</td><td>The rows a SELECT returned, read with a cursor (next, getXXX); the cursor starts before the first row.</td></tr>
<tr><td><strong>executeQuery / executeUpdate</strong></td><td>chạy truy vấn / chạy cập nhật</td><td>executeQuery runs a SELECT and returns a ResultSet; executeUpdate runs INSERT/UPDATE/DELETE and returns the row count.</td></tr>
<tr><td><strong>wasNull</strong></td><td>kiểm giá trị NULL vừa đọc</td><td>Called right after getInt/getXXX to tell a real 0 from a SQL NULL (getInt on NULL returns 0).</td></tr>
<tr><td><strong>try-with-resources</strong></td><td>try kèm tài nguyên tự đóng</td><td>A try(...) that closes every resource it opens, in reverse order, even on an exception — the clean way to close JDBC.</td></tr>
<tr><td><strong>connection leak</strong></td><td>rò rỉ kết nối</td><td>A connection opened and never closed; repeated per request it exhausts the pool and new requests hang.</td></tr>
<tr><td><strong>transaction</strong></td><td>giao dịch</td><td>A group of updates that all commit or all roll back; setAutoCommit(false) then commit() or rollback().</td></tr>
<tr><td><strong>DAO</strong></td><td>đối tượng truy cập dữ liệu</td><td>Data Access Object: the only class that writes SQL for one entity; controllers and JSPs call it, never JDBC directly.</td></tr>
<tr><td><strong>Post/Redirect/Get</strong></td><td>mẫu Gửi/Chuyển hướng/Lấy</td><td>After a successful POST, answer 302 so the browser GETs the result page — F5 then does not resubmit.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>JDBC</strong></td><td>Java Database Connectivity</td><td>API chuẩn của Java (gói java.sql) để kết nối và truy vấn một CSDL quan hệ.</td></tr>
<tr><td><strong>DBMS</strong></td><td>hệ quản trị cơ sở dữ liệu</td><td>Phần mềm lưu và quản lý các CSDL (SQL Server, PostgreSQL); code của bạn nói chuyện với nó, không bao giờ với file thô.</td></tr>
<tr><td><strong>Type 4 driver</strong></td><td>driver loại 4 (thin)</td><td>Driver JDBC thuần Java, nói trực tiếp giao thức riêng của CSDL qua một socket; loại duy nhất dùng ngày nay (mssql-jdbc).</td></tr>
<tr><td><strong>DriverManager</strong></td><td>lớp quản lý driver</td><td>Lớp mà getConnection(url, user, pass) trả về một Connection từ driver đã nạp.</td></tr>
<tr><td><strong>Connection</strong></td><td>kết nối</td><td>Một phiên mở tới CSDL; bạn tạo statement và điều khiển giao dịch qua nó, và phải đóng nó.</td></tr>
<tr><td><strong>Statement</strong></td><td>câu lệnh (SQL cố định)</td><td>Chạy SQL cố định; executeQuery trả ResultSet, executeUpdate trả số dòng. Không dùng với dữ liệu người dùng.</td></tr>
<tr><td><strong>PreparedStatement</strong></td><td>câu lệnh tham số hoá</td><td>SQL biên dịch trước với các dấu ? điền bằng setXXX; giá trị không bao giờ bị phân tích như SQL, nên chặn injection.</td></tr>
<tr><td><strong>SQL injection</strong></td><td>tấn công chèn SQL</td><td>Phá một truy vấn bằng cách gõ SQL vào ô nhập (vd ' OR 1=1 --); chặn bằng PreparedStatement.</td></tr>
<tr><td><strong>ResultSet</strong></td><td>tập kết quả</td><td>Các dòng SELECT trả về, đọc bằng một con trỏ (next, getXXX); con trỏ bắt đầu trước dòng đầu.</td></tr>
<tr><td><strong>executeQuery / executeUpdate</strong></td><td>chạy truy vấn / chạy cập nhật</td><td>executeQuery chạy SELECT trả ResultSet; executeUpdate chạy INSERT/UPDATE/DELETE trả số dòng.</td></tr>
<tr><td><strong>wasNull</strong></td><td>kiểm giá trị NULL vừa đọc</td><td>Gọi ngay sau getInt/getXXX để phân biệt một số 0 thật với một SQL NULL (getInt trên NULL trả 0).</td></tr>
<tr><td><strong>try-with-resources</strong></td><td>try kèm tài nguyên tự đóng</td><td>Một try(...) tự đóng mọi tài nguyên nó mở, theo thứ tự ngược, dù có exception — cách sạch để đóng JDBC.</td></tr>
<tr><td><strong>connection leak</strong></td><td>rò rỉ kết nối</td><td>Một kết nối mở mà không đóng; lặp lại mỗi request sẽ làm cạn pool và các request mới treo.</td></tr>
<tr><td><strong>transaction</strong></td><td>giao dịch</td><td>Một nhóm cập nhật cùng commit hoặc cùng rollback; setAutoCommit(false) rồi commit() hoặc rollback().</td></tr>
<tr><td><strong>DAO</strong></td><td>đối tượng truy cập dữ liệu</td><td>Data Access Object: lớp duy nhất viết SQL cho một thực thể; controller và JSP gọi nó, không bao giờ gọi JDBC trực tiếp.</td></tr>
<tr><td><strong>Post/Redirect/Get</strong></td><td>mẫu Gửi/Chuyển hướng/Lấy</td><td>Sau một POST thành công, trả 302 để trình duyệt GET trang kết quả — khi đó F5 không gửi lại.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 5</h2>
<ol>
<li>Five steps: load driver (<code>Class.forName</code>) → connect (<code>DriverManager.getConnection</code>) → statement → ResultSet → close (reverse order).</li>
<li>Read connection errors, don't guess: "No suitable driver" = step 1, "connection … failed" = TCP, "PKIX path building failed" = missing <code>trustServerCertificate=true</code>, "Login failed" = password, "Cannot open database" = db name.</li>
<li><code>executeQuery</code> → ResultSet (SELECT); <code>executeUpdate</code> → int rows changed (INSERT/UPDATE/DELETE).</li>
<li><strong>Always PreparedStatement for values</strong> — it stops SQL injection and the apostrophe bug. A column/table name is NOT a value: choose it from a whitelist.</li>
<li>ResultSet cursor starts at BOF, <code>next()</code> is forward-only by default; read by index (from 1) or label; <code>getInt</code> on NULL is 0 — check <code>wasNull()</code>.</li>
<li>Close ResultSet → Statement → Connection; try-with-resources does it; forgetting leaks connections until the pool is dry.</li>
<li>Wrap related updates in a transaction (<code>setAutoCommit(false)</code>, <code>commit</code>/<code>rollback</code>) so money/data is never half-changed.</li>
<li>Organise it as a DAO behind MVC: SQL only in the DAO; GET shows a form, POST saves then redirects (PRG); a missing id → 404.</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 5</h2>
<ol>
<li>Năm bước: nạp driver (<code>Class.forName</code>) → kết nối (<code>DriverManager.getConnection</code>) → statement → ResultSet → đóng (thứ tự ngược).</li>
<li>Đọc lỗi kết nối, đừng đoán: "No suitable driver" = bước 1, "connection … failed" = TCP, "PKIX path building failed" = thiếu <code>trustServerCertificate=true</code>, "Login failed" = mật khẩu, "Cannot open database" = tên CSDL.</li>
<li><code>executeQuery</code> → ResultSet (SELECT); <code>executeUpdate</code> → int số dòng đổi (INSERT/UPDATE/DELETE).</li>
<li><strong>Luôn PreparedStatement cho giá trị</strong> — chặn SQL injection và lỗi dấu nháy đơn. Tên cột/bảng KHÔNG phải giá trị: chọn từ một danh sách trắng.</li>
<li>Con trỏ ResultSet bắt đầu ở BOF, <code>next()</code> mặc định chỉ đi tới; đọc theo chỉ số (từ 1) hoặc nhãn; <code>getInt</code> trên NULL là 0 — kiểm <code>wasNull()</code>.</li>
<li>Đóng ResultSet → Statement → Connection; try-with-resources làm hộ; quên là rò rỉ kết nối tới khi pool cạn.</li>
<li>Bọc các câu update liên quan trong một giao dịch (<code>setAutoCommit(false)</code>, <code>commit</code>/<code>rollback</code>) để tiền/dữ liệu không bao giờ bị đổi nửa vời.</li>
<li>Tổ chức thành một DAO phía sau MVC: SQL chỉ ở trong DAO; GET hiện form, POST lưu rồi chuyển hướng (PRG); một id không có → 404.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (prj301-quiz-ch5) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) Which JDBC method is used to execute a SELECT and retrieve its rows?|||(Dạng câu FE) Phương thức JDBC nào dùng để chạy một SELECT và lấy các dòng của nó?',
      options: ['executeQuery()|||executeQuery()', 'executeUpdate()|||executeUpdate()', 'executeSelect()|||executeSelect()', 'execute() always, then read the int|||luôn dùng execute() rồi đọc số int'],
      correctIndex: 0,
      points: 1,
      explanation: 'executeQuery runs a SELECT and returns a ResultSet (confirmed in the jdbc-items demo). executeUpdate runs INSERT/UPDATE/DELETE and returns an int row count; executeSelect does not exist; execute() returns a boolean and is only for when you do not know the statement kind.|||executeQuery chạy một SELECT và trả về một ResultSet (đã xác nhận trong demo jdbc-items). executeUpdate chạy INSERT/UPDATE/DELETE và trả về một số int; executeSelect không tồn tại; execute() trả về boolean và chỉ dùng khi bạn không biết loại câu lệnh.' },
    { id: 'q2',
      question: '(FE question type) What is the main benefit of PreparedStatement over Statement?|||(Dạng câu FE) Lợi ích chính của PreparedStatement so với Statement là gì?',
      options: ['It automatically commits every transaction|||Nó tự động commit mọi giao dịch', 'It lets you skip loading the driver|||Nó cho phép bỏ qua việc nạp driver', 'Better performance on repeated queries AND protection from SQL injection|||Hiệu năng tốt hơn khi lặp truy vấn VÀ chống SQL injection', 'It returns more columns than Statement|||Nó trả về nhiều cột hơn Statement'],
      correctIndex: 2,
      points: 1,
      explanation: "A PreparedStatement is pre-compiled (faster when reused with different values) and sends the user's input as a VALUE, never as SQL text — so ' OR 1=1 -- cannot break it (confirmed in jdbc-sql-injection). It does not touch commit, driver loading, or the number of columns.|||Một PreparedStatement được biên dịch trước (nhanh hơn khi dùng lại với các giá trị khác) và gửi input của người dùng như một GIÁ TRỊ, không bao giờ như chữ SQL — nên ' OR 1=1 -- không bẻ được nó (đã xác nhận trong jdbc-sql-injection). Nó không đụng tới commit, việc nạp driver, hay số cột." },
    { id: 'q3',
      question: 'In the five JDBC steps, which statement performs step 1, "load the JDBC driver"?|||Trong năm bước JDBC, câu lệnh nào thực hiện bước 1, "nạp JDBC driver"?',
      options: ['DriverManager.getConnection(url, user, pass)|||DriverManager.getConnection(url, user, pass)', 'Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver")|||Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver")', 'con.createStatement()|||con.createStatement()', 'new SQLServerDriver()|||new SQLServerDriver()'],
      correctIndex: 1,
      points: 1,
      explanation: 'Class.forName(...) loads and registers the driver class (step 1). getConnection is step 2 (open a connection); createStatement is step 3. Misspelling the class name throws ClassNotFoundException — exactly the jdbc-loi-ket-noi typo-driver case.|||Class.forName(...) nạp và đăng ký lớp driver (bước 1). getConnection là bước 2 (mở kết nối); createStatement là bước 3. Gõ sai tên lớp sẽ ném ClassNotFoundException — đúng trường hợp typo-driver của jdbc-loi-ket-noi.' },
    { id: 'q4',
      question: 'A column bonus is NULL for a row. What does rs.getInt("bonus") return, and how do you detect the NULL?|||Một cột bonus là NULL ở một dòng. rs.getInt("bonus") trả về gì, và làm sao phát hiện NULL?',
      options: ['It throws a NullPointerException|||Nó ném một NullPointerException', 'It returns -1 as a sentinel|||Nó trả về -1 làm giá trị báo hiệu', 'It returns 0; call rs.wasNull() right after to tell 0 from NULL|||Nó trả về 0; gọi rs.wasNull() ngay sau để phân biệt 0 với NULL', 'It returns null (autoboxed to Integer)|||Nó trả về null (tự đóng gói thành Integer)'],
      correctIndex: 2,
      points: 1,
      explanation: 'Measured in jdbc-resultset#null: getInt on a SQL NULL returns 0 (not null, no exception), so a real 0 and a NULL look identical — you must call wasNull() immediately, or use getObject("bonus", Integer.class) which stays null.|||Đo trong jdbc-resultset#null: getInt trên một SQL NULL trả về 0 (không phải null, không exception), nên một số 0 thật và một NULL trông y hệt — bạn phải gọi wasNull() ngay, hoặc dùng getObject("bonus", Integer.class) để giữ null.' },
    { id: 'q5',
      question: '(FE question type) By default, which transaction mode does a JDBC Connection use?|||(Dạng câu FE) Mặc định, một JDBC Connection dùng chế độ giao dịch nào?',
      options: ['auto-commit is ON (each statement commits by itself)|||auto-commit BẬT (mỗi câu lệnh tự commit)', 'auto-commit is OFF (you must commit manually)|||auto-commit TẮT (bạn phải commit bằng tay)', 'no transactions are possible at all|||hoàn toàn không thể có giao dịch', 'it depends on the ResultSet type|||tuỳ vào loại ResultSet'],
      correctIndex: 0,
      points: 1,
      explanation: 'A fresh Connection has auto-commit ON, so every executeUpdate is committed immediately — that is why the no-transaction transfer in jdbc-transaction lost money (the debit was final before the credit failed). To group updates you call setAutoCommit(false), then commit() or rollback().|||Một Connection mới có auto-commit BẬT, nên mỗi executeUpdate được commit ngay — đó là lý do lần chuyển tiền không giao dịch trong jdbc-transaction làm mất tiền (câu trừ đã chính thức trước khi câu cộng hỏng). Để gộp các cập nhật bạn gọi setAutoCommit(false), rồi commit() hoặc rollback().' },
    { id: 'q6',
      question: 'In what order should JDBC resources be closed?|||Nên đóng các tài nguyên JDBC theo thứ tự nào?',
      options: ['Connection, then Statement, then ResultSet|||Connection, rồi Statement, rồi ResultSet', 'the order does not matter|||thứ tự không quan trọng', 'Statement, then Connection, then ResultSet|||Statement, rồi Connection, rồi ResultSet', 'ResultSet, then Statement, then Connection (reverse of opening)|||ResultSet, rồi Statement, rồi Connection (ngược với lúc mở)'],
      correctIndex: 3,
      points: 1,
      explanation: 'Open order is Connection → Statement → ResultSet, so close in reverse: ResultSet → Statement → Connection. The jdbc-dong-tai-nguyen "order" case printed exactly this sequence, which try-with-resources produces automatically.|||Thứ tự mở là Connection → Statement → ResultSet, nên đóng theo thứ tự ngược: ResultSet → Statement → Connection. Trường hợp "order" của jdbc-dong-tai-nguyen in ra đúng chuỗi này, thứ mà try-with-resources tạo ra tự động.' },
    { id: 'q7',
      question: '(FE question type) Which JDBC driver type is pure Java, talks the database protocol directly, and gives the best performance?|||(Dạng câu FE) Loại JDBC driver nào thuần Java, nói trực tiếp giao thức của CSDL, và cho hiệu năng tốt nhất?',
      options: ['Type 1 (JDBC-ODBC bridge)|||Type 1 (cầu JDBC-ODBC)', 'Type 2 (Native API)|||Type 2 (Native API)', 'Type 4 (Native Protocol / thin)|||Type 4 (Native Protocol / thin)', 'Type 3 (Network Protocol)|||Type 3 (Network Protocol)'],
      correctIndex: 2,
      points: 1,
      explanation: "Type 4 is pure Java and speaks the database's own protocol (TDS for SQL Server) straight over a socket, with no ODBC, native library or middleware in between — fastest and platform-independent. mssql-jdbc is Type 4 (confirmed by the metadata on slide 10). Type 1 was even removed from the JDK in Java 8.|||Type 4 thuần Java và nói giao thức riêng của CSDL (TDS với SQL Server) thẳng qua một socket, không ODBC, thư viện native hay middleware ở giữa — nhanh nhất và độc lập nền tảng. mssql-jdbc là Type 4 (đã xác nhận bằng metadata ở slide 10). Type 1 thậm chí đã bị gỡ khỏi JDK từ Java 8." },
    { id: 'q8',
      question: "A login uses Statement with sql = \"… WHERE username = '\" + user + \"' AND password = '\" + pass + \"'\". The attacker types ' OR 1=1 -- as the username. What happens?|||Một trang đăng nhập dùng Statement với sql = \"… WHERE username = '\" + user + \"' AND password = '\" + pass + \"'\". Kẻ tấn công gõ ' OR 1=1 -- làm tên đăng nhập. Chuyện gì xảy ra?",
      options: ['A compile error, because of the quotes|||Lỗi biên dịch, vì các dấu nháy', 'Login succeeds without a valid password (SQL injection)|||Đăng nhập thành công mà không cần mật khẩu đúng (SQL injection)', 'SQL Server rejects it as a syntax error every time|||SQL Server luôn từ chối vì lỗi cú pháp', 'Nothing — the single quote is escaped automatically|||Không gì cả — dấu nháy đơn được tự động thoát'],
      correctIndex: 1,
      points: 1,
      explanation: 'Measured in jdbc-sql-injection#st-or: the input becomes part of the SQL, so WHERE is always true and -- comments out the password check — the attacker logs in as admin. Switching to a PreparedStatement with ? makes the same input a harmless value (jdbc-sql-injection#pr-or: "Login failed").|||Đo trong jdbc-sql-injection#st-or: input trở thành một phần của SQL, nên WHERE luôn đúng và -- biến phần kiểm mật khẩu thành chú thích — kẻ tấn công đăng nhập với quyền admin. Đổi sang PreparedStatement với ? khiến cùng input thành một giá trị vô hại (jdbc-sql-injection#pr-or: "Login failed").' },
    { id: 'q9',
      question: '(FE question type) Which symbol represents a placeholder in a PreparedStatement SQL string?|||(Dạng câu FE) Ký hiệu nào đại diện cho một placeholder trong chuỗi SQL của PreparedStatement?',
      options: ['%|||%', '#|||#', '&|||&', '?|||?'],
      correctIndex: 3,
      points: 1,
      explanation: 'A ? marks each value to be filled later with setXXX(index, value), where index starts at 1: "… WHERE username = ? AND password = ?". % is the LIKE wildcard, not a placeholder; # and & have no such role in SQL.|||Một dấu ? đánh dấu mỗi giá trị sẽ điền sau bằng setXXX(index, value), với index bắt đầu từ 1: "… WHERE username = ? AND password = ?". % là ký tự đại diện của LIKE, không phải placeholder; # và & không có vai trò đó trong SQL.' },
    { id: 'q10',
      question: 'You let the user choose the ORDER BY column from a dropdown. How do you use it in the SQL safely?|||Bạn cho người dùng chọn cột ORDER BY từ một ô chọn. Dùng nó trong SQL một cách an toàn thế nào?',
      options: ['Map the choice to a fixed column name through a whitelist in your code|||Ánh xạ lựa chọn sang một tên cột cố định qua một danh sách trắng trong code', 'Pass it as a ? parameter: "ORDER BY ?"|||Truyền nó như một tham số ?: "ORDER BY ?"', 'Concatenate it into the SQL string directly|||Nối thẳng nó vào chuỗi SQL', 'Trust it because a dropdown cannot be tampered with|||Tin nó vì một ô chọn không thể bị sửa'],
      correctIndex: 0,
      points: 1,
      explanation: 'A column name is part of the SQL STRUCTURE, so it cannot be a ? parameter (that only works for values) — you must validate it against a fixed list (the switch in jdbc-tim-phan-trang), falling back to a safe default. Concatenating or trusting the request is injectable: the sort-bay case (?sort=price;DROP TABLE Product) is neutralised exactly this way.|||Một tên cột là một phần CẤU TRÚC SQL, nên nó không thể là tham số ? (cái đó chỉ dùng cho giá trị) — bạn phải kiểm với một danh sách cố định (cái switch trong jdbc-tim-phan-trang), rơi về một mặc định an toàn. Nối chuỗi hay tin request là bị injection: trường hợp sort-bay (?sort=price;DROP TABLE Product) bị vô hiệu đúng theo cách này.' },
  ],
};

const QUIZ_LESSON = {
  title: 'Quiz Ch.5 — JDBC: steps, PreparedStatement, ResultSet, transactions, drivers|||Quiz Ch.5 — JDBC: năm bước, PreparedStatement, ResultSet, giao dịch, driver',
  slug: 'prj301-quiz-ch5',
  type: 'QUIZ',
  description: '10 câu ôn Chương 5 viết lại theo dạng câu FE PRJ301: phương thức nào trả ResultSet, lợi của PreparedStatement so với Statement, bước nạp driver, getInt trên cột NULL trả gì, chế độ auto-commit mặc định, thứ tự đóng tài nguyên, loại driver nhanh nhất, một đòn SQL injection thật, dấu placeholder của PreparedStatement, và cách cho người dùng chọn cột sắp xếp an toàn — mỗi câu có giải thích song ngữ, nhiều câu kiểm bằng code chạy thật.',
  quiz: QUIZ,
};

export default {
  slides: [L_prj2_1, L_prj2_2],
  practice: L_on_ch5,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 5 viết lại theo dạng câu FE PRJ301: phương thức nào trả ResultSet, lợi của PreparedStatement so với Statement, bước nạp driver, getInt trên cột NULL trả gì, chế độ auto-commit mặc định, thứ tự đóng tài nguyên, loại driver nhanh nhất, một đòn SQL injection thật, dấu placeholder của PreparedStatement, và cách cho người dùng chọn cột sắp xếp an toàn — mỗi câu có giải thích song ngữ, nhiều câu kiểm bằng code chạy thật.',
  quizLesson: QUIZ_LESSON,
};
