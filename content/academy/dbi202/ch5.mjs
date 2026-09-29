/**
 * DBI202 · Chương 5 — ràng buộc toàn vẹn & SQL DDL (slide Chapter 6, 1–21).
 * Bài 📑 học theo từng slide: dbi7 (Chapter 6.pptx, slide 1–21).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: dbi202-on-ch5.
 * Quiz MỚI (10 câu, slug dbi202-quiz-ch5).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/DBI202/gen/gen.mjs từ gen/src/** và gen/sql/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node DBI202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 5.A — 📑 Slide by slide · Integrity constraints, strings, LIKE, dates & NULL (Chapter 6, slides 1–14) ───────── */
const L_dbi7_1 = {
  title: '5.A — 📑 Slide by slide · Integrity constraints, strings, LIKE, dates & NULL (Chapter 6, slides 1–14)|||5.A — 📑 Học theo từng slide · Ràng buộc toàn vẹn, chuỗi, LIKE, ngày giờ & NULL (Chapter 6, slide 1–14)',
  slug: 'dbi202-slide-dbi7-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–14 của bộ slide Chapter 6 của trường (The Database Language SQL): mục tiêu, ERD COMPANY, bốn loại ràng buộc toàn vẹn thử vi phạm từng cái, so sánh chuỗi, LIKE/NOT LIKE với % và _, ESCAPE, hằng ngày giờ và phép tính ngày, NULL và logic ba trị TRUE/FALSE/UNKNOWN — mọi câu SQL chạy thật trên CSDL FUHCompany (SQL Server) kèm ô 🐘 PostgreSQL ở mọi chỗ cú pháp khác.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.A · school slides "Chapter 6", slides 1–14</span>
<h2>The database language SQL (part 1) — the deck, slide by slide</h2>
<p class="lead">⚠️ <strong>This is the school's "Chapter 6" deck</strong> (The Database Language SQL, 82 slides). The website splits it in two: slides 1–21 are here in Chapter 5 (defining data: constraints, data types, CREATE / ALTER / DROP), slides 22–82 are in Chapter 6 (queries). So when your lecturer says "Chapter 6, slide 12", open this lesson.</p>
<div class="callout"><strong>Starting from zero.</strong> A <strong>database</strong> is an organised store of data kept by a program called a <strong>DBMS</strong> (database management system) — here Microsoft <strong>SQL Server</strong>, the tool of the course and of the PE (practical exam). <strong>SQL</strong> (Structured Query Language) is the language you type to talk to it. Data lives in <strong>tables</strong>: a table has named <strong>columns</strong> (each with a data type) and <strong>rows</strong> (one row = one thing, e.g. one employee). Every example below really ran on SQL Server; the result tables are the real output.</div>
<h3>The example database of the whole course: FUHCompany</h3>
<p>Every example of this chapter runs on one company database (its diagram is slide 21). It is loaded fresh before each example, so you always see real data. The two tables you meet first:</p>
<table>
<thead><tr><th>Table</th><th>What one row is</th><th>Key column(s)</th><th>A few other columns</th></tr></thead>
<tbody>
<tr><td>tblDepartment</td><td>one department</td><td>depNum</td><td>depName, mgrSSN (the manager)</td></tr>
<tr><td>tblEmployee</td><td>one employee</td><td>empSSN</td><td>empName, empSalary, empSex ('F'/'M'), empBirthdate, depNum (his department), supervisorSSN</td></tr>
</tbody>
</table>
<p>The full diagram (7 tables) is explained on slide 21, in lesson 5.B.</p>
<h3>This part in one table</h3>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>You must be able to</th></tr></thead>
<tbody>
<tr><td>1–5</td><td>goals of the chapter; from the ERD (entity–relationship diagram) to tables</td><td>say which table each box of the ERD becomes</td></tr>
<tr><td>6</td><td>four kinds of integrity constraints</td><td>name the kind of each constraint and the SQL keyword that enforces it</td></tr>
<tr><td>7–10</td><td>comparing strings; LIKE with <code>%</code> and <code>_</code>; ESCAPE</td><td>write a pattern; predict which rows match</td></tr>
<tr><td>11</td><td>dates and times</td><td>write a date constant; add days; compare dates</td></tr>
<tr><td>12–14</td><td>NULL and the value UNKNOWN</td><td>use <code>IS NULL</code>; fill the truth table; explain why a row disappears</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.A · slide "Chapter 6" của trường, slide 1–14</span>
<h2>Ngôn ngữ CSDL SQL (phần 1) — học bộ slide từng trang</h2>
<p class="lead">⚠️ <strong>Đây là bộ slide "Chapter 6" của trường</strong> (The Database Language SQL, 82 slide). Trang web chia nó làm hai: slide 1–21 nằm ở Chương 5 này (định nghĩa dữ liệu: ràng buộc, kiểu dữ liệu, CREATE / ALTER / DROP), slide 22–82 nằm ở Chương 6 (truy vấn). Nên khi thầy cô nói "Chapter 6, slide 12" thì mở bài này.</p>
<div class="callout"><strong>Bắt đầu từ số 0.</strong> <strong>Cơ sở dữ liệu</strong> (database — CSDL) là một kho dữ liệu được sắp xếp, do một phần mềm gọi là <strong>hệ quản trị CSDL</strong> (DBMS — database management system) giữ — ở đây là Microsoft <strong>SQL Server</strong>, công cụ của môn và của bài thi thực hành PE. <strong>SQL</strong> (Structured Query Language — ngôn ngữ truy vấn có cấu trúc) là thứ ngôn ngữ bạn gõ để nói chuyện với nó. Dữ liệu nằm trong các <strong>bảng</strong> (table): bảng có các <strong>cột</strong> (column) có tên, mỗi cột một kiểu dữ liệu, và các <strong>dòng</strong> (row) — một dòng là một "thứ", ví dụ một nhân viên. Mọi ví dụ bên dưới đã chạy thật trên SQL Server; bảng kết quả là output thật.</div>
<h3>CSDL ví dụ của cả môn: FUHCompany</h3>
<p>Mọi ví dụ của chương chạy trên một CSDL công ty (sơ đồ của nó là slide 21). CSDL được nạp mới trước mỗi ví dụ, nên bạn luôn thấy dữ liệu thật. Hai bảng bạn gặp đầu tiên:</p>
<table>
<thead><tr><th>Bảng</th><th>Một dòng là gì</th><th>Cột khoá</th><th>Vài cột khác</th></tr></thead>
<tbody>
<tr><td>tblDepartment</td><td>một phòng ban</td><td>depNum</td><td>depName, mgrSSN (trưởng phòng)</td></tr>
<tr><td>tblEmployee</td><td>một nhân viên</td><td>empSSN</td><td>empName, empSalary (lương), empSex ('F' nữ / 'M' nam), empBirthdate (ngày sinh), depNum (phòng của người đó), supervisorSSN (người giám sát)</td></tr>
</tbody>
</table>
<p>Sơ đồ đầy đủ (7 bảng) được giảng ở slide 21, trong bài 5.B.</p>
<h3>Cả phần này trong một bảng</h3>
<table>
<thead><tr><th>Slide</th><th>Ý chính</th><th>Bạn phải làm được</th></tr></thead>
<tbody>
<tr><td>1–5</td><td>mục tiêu chương; từ ERD (sơ đồ thực thể – liên kết) sang bảng</td><td>nói được mỗi hình trên ERD thành bảng nào</td></tr>
<tr><td>6</td><td>bốn loại ràng buộc toàn vẹn</td><td>gọi tên loại của mỗi ràng buộc và từ khoá SQL thực thi nó</td></tr>
<tr><td>7–10</td><td>so sánh chuỗi; LIKE với <code>%</code> và <code>_</code>; ESCAPE</td><td>viết được mẫu; đoán đúng dòng nào khớp</td></tr>
<tr><td>11</td><td>ngày và giờ</td><td>viết hằng ngày; cộng ngày; so sánh ngày</td></tr>
<tr><td>12–14</td><td>NULL và giá trị UNKNOWN</td><td>dùng <code>IS NULL</code>; điền bảng chân trị; giải thích vì sao một dòng biến mất</td></tr>
</tbody>
</table>`),
    walkHead('dbi7', 1, 14),
    walk('dbi7', [
      [1, 'Chapter 6 - The Database Language SQL',
        `<p class="y-chinh">🎯 Title slide: school Chapter 6, "The Database Language SQL" — on this website, Chapters 5 and 6.</p>
<p>Until now the course designed databases on paper (ERD, relational model, normalization). This deck is where the design is typed into a real DBMS and queried.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề: Chapter 6 của trường, "Ngôn ngữ CSDL SQL" — trên web là Chương 5 và 6.</p>
<p>Tới giờ môn học chỉ thiết kế CSDL trên giấy (ERD, mô hình quan hệ, chuẩn hoá). Bộ slide này là lúc gõ thiết kế đó vào một DBMS thật và truy vấn nó.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Three goals: write a SQL script, write queries with set/bag operators, correlated subqueries and aggregation, and handle complex queries.</p>
<ul>
<li><strong>Write a SQL script</strong> — a file of SQL statements run top to bottom (slides 15–21 here: CREATE, ALTER, DROP).</li>
<li><strong>Set and bag operators, correlated subqueries, aggregation</strong> — slides 22–82 (web Chapter 6).</li>
<li><strong>Complex queries</strong> — the part of the PE (practical exam, 85 minutes) that carries most marks.</li>
</ul>
<p class="meo">🧠 PE question 1 is almost always "create these tables with these constraints" — exactly this lesson and the next.</p>`,
        `<p class="y-chinh">🎯 Ba mục tiêu: viết được script SQL, viết truy vấn dùng phép toán tập hợp/túi, truy vấn con tương quan, gom nhóm, và xử lý được truy vấn phức tạp.</p>
<ul>
<li><strong>Viết script SQL</strong> (SQL script) — một file gồm nhiều câu lệnh SQL chạy từ trên xuống (ở đây là slide 15–21: CREATE, ALTER, DROP).</li>
<li><strong>Phép toán tập hợp và túi (set / bag), truy vấn con tương quan (correlated subquery), gom nhóm (aggregation)</strong> — slide 22–82 (Chương 6 trên web).</li>
<li><strong>Truy vấn phức tạp</strong> — phần nhiều điểm nhất của PE (thi thực hành 85 phút).</li>
</ul>
<p class="meo">🧠 Câu 1 đề PE gần như luôn là "tạo các bảng này với các ràng buộc này" — đúng nội dung bài này và bài sau.</p>`],
      [3, 'Contents',
        `<p class="y-chinh">🎯 Contents: integrity constraints, then SQL with its sub-languages DDL, DML, DCL (self-study) and subqueries.</p>
<table>
<thead><tr><th>Sub-language</th><th>Stands for</th><th>Statements</th><th>Where</th></tr></thead>
<tbody>
<tr><td>DDL</td><td>Data Definition Language — defines the structure</td><td>CREATE, ALTER, DROP</td><td>slides 16–21 (this chapter)</td></tr>
<tr><td>DML</td><td>Data Manipulation Language — reads and changes rows</td><td>SELECT, INSERT, UPDATE, DELETE</td><td>slides 22–82 (Chapter 6)</td></tr>
<tr><td>DCL</td><td>Data Control Language — permissions</td><td>GRANT, REVOKE</td><td>self-study</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Nội dung: ràng buộc toàn vẹn, rồi SQL với các ngôn ngữ con DDL, DML, DCL (tự học) và truy vấn con.</p>
<table>
<thead><tr><th>Ngôn ngữ con</th><th>Viết tắt của</th><th>Câu lệnh</th><th>Ở đâu</th></tr></thead>
<tbody>
<tr><td>DDL</td><td>Data Definition Language — ngôn ngữ định nghĩa dữ liệu (tạo cấu trúc)</td><td>CREATE, ALTER, DROP</td><td>slide 16–21 (chương này)</td></tr>
<tr><td>DML</td><td>Data Manipulation Language — ngôn ngữ thao tác dữ liệu (đọc/sửa dòng)</td><td>SELECT, INSERT, UPDATE, DELETE</td><td>slide 22–82 (Chương 6)</td></tr>
<tr><td>DCL</td><td>Data Control Language — ngôn ngữ phân quyền</td><td>GRANT, REVOKE</td><td>tự học</td></tr>
</tbody>
</table>`],
      [4, 'REVIEW - the database modeling and implementation process',
        `<p class="y-chinh">🎯 The road so far: requirements → high-level design (ER diagram) → relational schema → a relational DBMS; now we do the last step.</p>
<pre><code class="language-plaintext">User requirements ──► High-level design ──► Relational schema design ──► Relational DBMS
                        (ER diagram)          (tables, keys)               (SQL Server: CREATE TABLE …)
        Chapters 3 (web)                  Chapters 3–4 (web)            ◄── we are here</code></pre>
<p>You already know how to draw an ERD and convert it to relations such as <code>Employee(SSN, Name, Salary, DeptNo)</code>. This chapter turns such a line into a <code>CREATE TABLE</code> statement that the DBMS understands and enforces.</p>`,
        `<p class="y-chinh">🎯 Đường đã đi: yêu cầu người dùng → thiết kế mức cao (ERD) → thiết kế lược đồ quan hệ → hệ quản trị CSDL quan hệ; giờ làm bước cuối.</p>
<pre><code class="language-plaintext">Yêu cầu người dùng ──► Thiết kế mức cao ──► Thiết kế lược đồ quan hệ ──► DBMS quan hệ
                         (ERD)                 (bảng, khoá)                (SQL Server: CREATE TABLE …)
        Chương 3 (web)                    Chương 3–4 (web)              ◄── ta đang ở đây</code></pre>
<p>Bạn đã biết vẽ ERD và chuyển nó sang các quan hệ (relation) kiểu <code>Employee(SSN, Name, Salary, DeptNo)</code>. Chương này biến một dòng như thế thành câu <code>CREATE TABLE</code> mà DBMS hiểu và tự canh giữ.</p>`],
      [5, 'REVIEW - Entity Relationship Diagram - COMPANY Database',
        `<p class="y-chinh">🎯 The ERD of the COMPANY database (the textbook example) — the design that FUHCompany implements.</p>
<p>The diagram has 4 entity sets (EMPLOYEE, DEPARTMENT, PROJECT, and the weak entity DEPENDENT, drawn with a double box) and 6 relationships. Converted with the rules of Chapter 3 it gives exactly the tables of FUHCompany (slide 21):</p>
<table>
<thead><tr><th>On the ERD</th><th>Kind</th><th>Becomes in FUHCompany</th></tr></thead>
<tbody>
<tr><td>EMPLOYEE (Ssn, Name, Address, Sex, Salary, Bdate)</td><td>entity set</td><td>tblEmployee(empSSN, empName, empAddress, empSex, empSalary, empBirthdate, …)</td></tr>
<tr><td>DEPARTMENT (Number, Name, multivalued Locations)</td><td>entity set + multivalued attribute</td><td>tblDepartment(depNum, depName, …) + tblDepLocation(depNum, locNum)</td></tr>
<tr><td>PROJECT (Number, Name, Location)</td><td>entity set</td><td>tblProject(proNum, proName, locNum, …)</td></tr>
<tr><td>DEPENDENT (Name, Sex, BirthDate, Relationship)</td><td>weak entity, owner EMPLOYEE</td><td>tblDependent(depName, empSSN, …) — key = its partial key + the owner's key</td></tr>
<tr><td>WORKS_FOR (N:1)</td><td>relationship</td><td>column depNum in tblEmployee</td></tr>
<tr><td>MANAGES (1:1, StartDate)</td><td>relationship</td><td>columns mgrSSN, mgrAssDate in tblDepartment</td></tr>
<tr><td>CONTROLS (1:N)</td><td>relationship</td><td>column depNum in tblProject</td></tr>
<tr><td>WORKS_ON (M:N, Hours)</td><td>relationship</td><td>table tblWorksOn(empSSN, proNum, workHours)</td></tr>
<tr><td>SUPERVISION (1:N, recursive)</td><td>relationship</td><td>column supervisorSSN in tblEmployee</td></tr>
</tbody>
</table>
<p>FUHCompany also stores locations in their own table tblLocation(locNum, locName) instead of repeating city names.</p>
<p class="meo">🧠 Rule of thumb from Chapter 3: <strong>M:N → a new table; 1:N → a foreign key on the N side; multivalued attribute → a new table; weak entity → key includes the owner's key.</strong> Lecturers ask this on every ERD.</p>`,
        `<p class="y-chinh">🎯 ERD của CSDL COMPANY (ví dụ trong giáo trình) — bản thiết kế mà FUHCompany cài đặt.</p>
<p>Sơ đồ có 4 tập thực thể (entity set): EMPLOYEE, DEPARTMENT, PROJECT và thực thể yếu (weak entity) DEPENDENT vẽ bằng hình chữ nhật kép, cùng 6 liên kết (relationship). Chuyển theo các luật của Chương 3 sẽ ra đúng các bảng của FUHCompany (slide 21):</p>
<table>
<thead><tr><th>Trên ERD</th><th>Loại</th><th>Thành gì trong FUHCompany</th></tr></thead>
<tbody>
<tr><td>EMPLOYEE (Ssn, Name, Address, Sex, Salary, Bdate)</td><td>tập thực thể</td><td>tblEmployee(empSSN, empName, empAddress, empSex, empSalary, empBirthdate, …)</td></tr>
<tr><td>DEPARTMENT (Number, Name, Locations đa trị)</td><td>tập thực thể + thuộc tính đa trị (multivalued)</td><td>tblDepartment(depNum, depName, …) + tblDepLocation(depNum, locNum)</td></tr>
<tr><td>PROJECT (Number, Name, Location)</td><td>tập thực thể</td><td>tblProject(proNum, proName, locNum, …)</td></tr>
<tr><td>DEPENDENT (Name, Sex, BirthDate, Relationship)</td><td>thực thể yếu, chủ là EMPLOYEE</td><td>tblDependent(depName, empSSN, …) — khoá = khoá bộ phận + khoá của chủ</td></tr>
<tr><td>WORKS_FOR (N:1)</td><td>liên kết</td><td>cột depNum trong tblEmployee</td></tr>
<tr><td>MANAGES (1:1, StartDate)</td><td>liên kết</td><td>cột mgrSSN, mgrAssDate trong tblDepartment</td></tr>
<tr><td>CONTROLS (1:N)</td><td>liên kết</td><td>cột depNum trong tblProject</td></tr>
<tr><td>WORKS_ON (M:N, Hours)</td><td>liên kết</td><td>bảng tblWorksOn(empSSN, proNum, workHours)</td></tr>
<tr><td>SUPERVISION (1:N, đệ quy)</td><td>liên kết</td><td>cột supervisorSSN trong tblEmployee</td></tr>
</tbody>
</table>
<p>FUHCompany còn tách địa điểm ra bảng riêng tblLocation(locNum, locName) thay vì lặp lại tên thành phố.</p>
<p class="meo">🧠 Luật nhớ từ Chương 3: <strong>M:N → thêm một bảng; 1:N → khoá ngoại đặt ở phía N; thuộc tính đa trị → thêm một bảng; thực thể yếu → khoá gồm cả khoá của chủ.</strong> ERD nào thầy cô cũng hỏi đúng mấy câu này.</p>`],
      [6, 'Integrity constraints',
        `<p class="y-chinh">🎯 Integrity constraints are rules the DBMS checks on every change, so that impossible data (two departments numbered 1, an employee of a department that does not exist) can never be stored.</p>
<table>
<thead><tr><th>Kind (slide)</th><th>Scope</th><th>SQL keyword</th><th>FUHCompany example</th></tr></thead>
<tbody>
<tr><td>1. Key constraints</td><td>1 table</td><td>PRIMARY KEY; UNIQUE (candidate key)</td><td>pk_department on depNum; uq_department_name on depName</td></tr>
<tr><td>2. Attribute constraints</td><td>1 table</td><td>NULL / NOT NULL; CHECK</td><td>empName NOT NULL; ck_employee_sex: empSex IN ('F','M')</td></tr>
<tr><td>3. Referential integrity</td><td>2 tables</td><td>FOREIGN KEY … REFERENCES</td><td>fk_employee_department: tblEmployee.depNum → tblDepartment</td></tr>
<tr><td>4. Global constraints</td><td>n tables</td><td>CHECK / CREATE ASSERTION (self-study)</td><td>"a manager must work in the department he manages" — in SQL Server done with a trigger (Chapter 7)</td></tr>
</tbody>
</table>
<p>Watch the DBMS refuse each kind of bad row (the constraints have names, so the messages are easy to read):</p>
<pre><code class="language-sql">-- 1a. Key constraint: a second department number 1
INSERT INTO tblDepartment (depNum, depName) VALUES (1, N'Phòng Pháp chế');
GO
-- 1b. Candidate key (UNIQUE): a new number but an existing name
INSERT INTO tblDepartment (depNum, depName) VALUES (8, N'Phòng Kinh doanh');
GO
-- 2a. Attribute constraint NOT NULL: an employee without a name
INSERT INTO tblEmployee (empSSN, empName) VALUES (30121050099, NULL);
GO
-- 2b. Attribute constraint CHECK: sex must be 'F' or 'M'
INSERT INTO tblEmployee (empSSN, empName, empSex) VALUES (30121050099, N'Ngô Văn Khải', 'X');
GO
-- 3. Referential integrity (FOREIGN KEY): department 9 does not exist
INSERT INTO tblEmployee (empSSN, empName, depNum) VALUES (30121050099, N'Ngô Văn Khải', 9);
GO
-- A row that respects every constraint is accepted
INSERT INTO tblEmployee (empSSN, empName, empSex, depNum) VALUES (30121050099, N'Ngô Văn Khải', 'M', 1);
SELECT empSSN, empName, empSex, depNum FROM tblEmployee WHERE empSSN = 30121050099;</code></pre>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'pk_department'. Cannot insert duplicate key in object 'dbo.tblDepartment'. The duplicate key value is (1).</b><br>
The statement has been terminated.<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of UNIQUE KEY constraint 'uq_department_name'. Cannot insert duplicate key in object 'dbo.tblDepartment'. The duplicate key value is (Phòng Kinh doanh).</b><br>
The statement has been terminated.<br>
<b>Msg 515, Level 16, State 2<br>
Cannot insert the value NULL into column 'empName', table 'DBI202.dbo.tblEmployee'; column does not allow nulls. INSERT fails.</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "ck_employee_sex". The conflict occurred in database "DBI202", table "dbo.tblEmployee", column 'empSex'.</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the FOREIGN KEY constraint "fk_employee_department". The conflict occurred in database "DBI202", table "dbo.tblDepartment", column 'depNum'.</b><br>
The statement has been terminated.<br>
(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSex</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>30121050099</td><td>Ngô Văn Khải</td><td>M</td><td>1</td></tr>
</tbody>
</table>
<ul>
<li><code>Msg 2627</code> = a key (PRIMARY KEY or UNIQUE) would be duplicated. <code>Msg 515</code> = NULL in a NOT NULL column. <code>Msg 547</code> = a CHECK or a FOREIGN KEY is broken — the message names which one.</li>
<li>"The statement has been terminated." means the whole INSERT was cancelled: no half row is stored.</li>
</ul>
<div class="pitfall">A constraint written without a name gets a random one such as <code>CK__tblEmploy__empSe__4AB81AF0</code>. In the PE, name them yourself (<code>CONSTRAINT ck_employee_sex CHECK (…)</code>): the error tells you immediately which rule was hit, and you can drop it later by name.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> (what you will type at work) the constraints are written the same way; the message wording differs, and Vietnamese strings need no N prefix:
<pre><code class="language-sql">-- The same FK mistake on PostgreSQL (no N prefix needed)
INSERT INTO tblEmployee (empSSN, empName, depNum) VALUES (30121050099, 'Ngô Văn Khải', 9);</code></pre>
<div class="out"><b>ERROR:  insert or update on table "tblemployee" violates foreign key constraint "fk_employee_department"</b></div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-3-rang-buoc-cot">PostgreSQL 3.3 — column constraints</a>.</div>`,
        `<p class="y-chinh">🎯 Ràng buộc toàn vẹn (integrity constraint) là các luật DBMS kiểm tra ở mỗi lần thay đổi dữ liệu, để dữ liệu vô lý (hai phòng cùng số 1, nhân viên thuộc một phòng không tồn tại) không bao giờ lưu được.</p>
<table>
<thead><tr><th>Loại (theo slide)</th><th>Phạm vi</th><th>Từ khoá SQL</th><th>Ví dụ trong FUHCompany</th></tr></thead>
<tbody>
<tr><td>1. Ràng buộc khoá (key)</td><td>1 bảng</td><td>PRIMARY KEY (khoá chính); UNIQUE (khoá ứng viên — candidate key)</td><td>pk_department trên depNum; uq_department_name trên depName</td></tr>
<tr><td>2. Ràng buộc thuộc tính (attribute)</td><td>1 bảng</td><td>NULL / NOT NULL; CHECK (điều kiện)</td><td>empName NOT NULL; ck_employee_sex: empSex IN ('F','M')</td></tr>
<tr><td>3. Toàn vẹn tham chiếu (referential integrity)</td><td>2 bảng</td><td>FOREIGN KEY … REFERENCES (khoá ngoại)</td><td>fk_employee_department: tblEmployee.depNum → tblDepartment</td></tr>
<tr><td>4. Ràng buộc tổng quát (global)</td><td>n bảng</td><td>CHECK / CREATE ASSERTION (tự học)</td><td>"trưởng phòng phải làm trong chính phòng mình quản lý" — SQL Server làm bằng trigger (Chương 7)</td></tr>
</tbody>
</table>
<p>Xem DBMS từ chối từng loại dòng sai (các ràng buộc có tên nên thông báo dễ đọc):</p>
<pre><code class="language-sql">-- 1a. Ràng buộc khoá: thêm phòng số 1 lần nữa
INSERT INTO tblDepartment (depNum, depName) VALUES (1, N'Phòng Pháp chế');
GO
-- 1b. Khoá ứng viên (UNIQUE): số mới nhưng tên đã có
INSERT INTO tblDepartment (depNum, depName) VALUES (8, N'Phòng Kinh doanh');
GO
-- 2a. Ràng buộc thuộc tính NOT NULL: nhân viên không có tên
INSERT INTO tblEmployee (empSSN, empName) VALUES (30121050099, NULL);
GO
-- 2b. Ràng buộc thuộc tính CHECK: giới tính chỉ 'F' hoặc 'M'
INSERT INTO tblEmployee (empSSN, empName, empSex) VALUES (30121050099, N'Ngô Văn Khải', 'X');
GO
-- 3. Toàn vẹn tham chiếu (FOREIGN KEY): phòng 9 không tồn tại
INSERT INTO tblEmployee (empSSN, empName, depNum) VALUES (30121050099, N'Ngô Văn Khải', 9);
GO
-- Một dòng tôn trọng mọi ràng buộc thì được nhận
INSERT INTO tblEmployee (empSSN, empName, empSex, depNum) VALUES (30121050099, N'Ngô Văn Khải', 'M', 1);
SELECT empSSN, empName, empSex, depNum FROM tblEmployee WHERE empSSN = 30121050099;</code></pre>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'pk_department'. Cannot insert duplicate key in object 'dbo.tblDepartment'. The duplicate key value is (1).</b><br>
The statement has been terminated.<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of UNIQUE KEY constraint 'uq_department_name'. Cannot insert duplicate key in object 'dbo.tblDepartment'. The duplicate key value is (Phòng Kinh doanh).</b><br>
The statement has been terminated.<br>
<b>Msg 515, Level 16, State 2<br>
Cannot insert the value NULL into column 'empName', table 'DBI202.dbo.tblEmployee'; column does not allow nulls. INSERT fails.</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "ck_employee_sex". The conflict occurred in database "DBI202", table "dbo.tblEmployee", column 'empSex'.</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the FOREIGN KEY constraint "fk_employee_department". The conflict occurred in database "DBI202", table "dbo.tblDepartment", column 'depNum'.</b><br>
The statement has been terminated.<br>
(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSex</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>30121050099</td><td>Ngô Văn Khải</td><td>M</td><td>1</td></tr>
</tbody>
</table>
<ul>
<li><code>Msg 2627</code> = sắp trùng khoá (PRIMARY KEY hoặc UNIQUE). <code>Msg 515</code> = đưa NULL vào cột NOT NULL. <code>Msg 547</code> = vi phạm CHECK hoặc FOREIGN KEY — thông báo nói rõ ràng buộc nào.</li>
<li>"The statement has been terminated." (câu lệnh đã bị huỷ) nghĩa là cả câu INSERT bị huỷ: không có nửa dòng nào được lưu.</li>
</ul>
<div class="pitfall">Ràng buộc viết không đặt tên sẽ bị gán tên ngẫu nhiên kiểu <code>CK__tblEmploy__empSe__4AB81AF0</code>. Trong bài PE hãy tự đặt tên (<code>CONSTRAINT ck_employee_sex CHECK (…)</code>): lỗi báo ngay luật nào bị vi phạm, và sau này xoá được theo tên.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> (thứ bạn sẽ gõ khi đi làm) ràng buộc viết y như vậy; câu thông báo lỗi khác chữ, và chuỗi tiếng Việt không cần tiền tố N:
<pre><code class="language-sql">-- Cùng lỗi khoá ngoại trên PostgreSQL (không cần tiền tố N)
INSERT INTO tblEmployee (empSSN, empName, depNum) VALUES (30121050099, 'Ngô Văn Khải', 9);</code></pre>
<div class="out"><b>ERROR:  insert or update on table "tblemployee" violates foreign key constraint "fk_employee_department"</b></div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-3-rang-buoc-cot">PostgreSQL 3.3 — ràng buộc cột</a>.</div>`],
      [7, 'Comparison of Strings',
        `<p class="y-chinh">🎯 Strings are compared character by character, like words in a dictionary: the first position where they differ decides, and a prefix is smaller than the longer string.</p>
<p>The slide's rule: a = a₁…aₙ is less than b = b₁…bₘ if they agree on the first k characters and then aₖ₊₁ &lt; bₖ₊₁ (or a runs out first). Its two examples:</p>
<table>
<thead><tr><th>Comparison</th><th>Why</th></tr></thead>
<tbody>
<tr><td>fodder &lt; foo</td><td>f=f, o=o, then d &lt; o at position 3</td></tr>
<tr><td>bar &lt; bargain</td><td>"bar" is a prefix of "bargain" — the shorter one is smaller</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- The two examples of the slide
SELECT CASE WHEN 'fodder' &lt; 'foo'    THEN 'TRUE' ELSE 'FALSE' END AS [fodder &lt; foo],
       CASE WHEN 'bar'    &lt; 'bargain' THEN 'TRUE' ELSE 'FALSE' END AS [bar &lt; bargain];
-- SQL Server specifics (default collation ..._CI_AS)
SELECT CASE WHEN 'abc' = 'ABC'    THEN 'TRUE' ELSE 'FALSE' END AS [abc = ABC],
       CASE WHEN 'abc' = 'abc   ' THEN 'TRUE' ELSE 'FALSE' END AS [abc = 'abc   '],
       CASE WHEN '10'  &lt; '9'      THEN 'TRUE' ELSE 'FALSE' END AS [text '10' &lt; '9'];</code></pre>
<table>
<thead><tr><th>fodder &lt; foo</th><th>bar &lt; bargain</th></tr></thead>
<tbody>
<tr><td>TRUE</td><td>TRUE</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>abc = ABC</th><th>abc = 'abc   '</th><th>text '10' &lt; '9'</th></tr></thead>
<tbody>
<tr><td>TRUE</td><td>TRUE</td><td>TRUE</td></tr>
</tbody>
</table>
<ul>
<li>SQL Server has no boolean column type, so a comparison is turned into text with <code>CASE WHEN … THEN 'TRUE' ELSE 'FALSE' END</code>.</li>
<li><code>[fodder &lt; foo]</code> — square brackets let a column alias contain spaces and symbols (T-SQL only).</li>
<li>The second row shows SQL Server habits: with the default collation (the rule set for comparing text, here <code>SQL_Latin1_General_CP1_CI_AS</code>, CI = case-insensitive) <code>'abc' = 'ABC'</code> is TRUE, and trailing spaces are ignored.</li>
</ul>
<div class="pitfall">Text is compared as text: <code>'10' &lt; '9'</code> is TRUE because '1' &lt; '9'. Store numbers in number columns (INT, DECIMAL), never in VARCHAR, or ORDER BY and &gt; will surprise you.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a comparison is a real boolean value (<code>t</code>/<code>f</code>), and text comparison is <strong>case-sensitive</strong> and does not ignore trailing spaces — use <code>lower()</code> (or ILIKE) when case must not matter:
<pre><code class="language-sql">-- PostgreSQL has a real boolean type: no CASE needed
SELECT 'fodder' &lt; 'foo'   AS "fodder &lt; foo",
       'bar' &lt; 'bargain'  AS "bar &lt; bargain",
       'abc' = 'ABC'      AS "abc = ABC",
       'abc' = 'abc   '   AS "abc = 'abc   '",
       lower('abc') = lower('ABC') AS "lower(...) = lower(...)";</code></pre>
<table>
<thead><tr><th>fodder &lt; foo</th><th>bar &lt; bargain</th><th>abc = ABC</th><th>abc = 'abc   '</th><th>lower(...) = lower(...)</th></tr></thead>
<tbody>
<tr><td>t</td><td>t</td><td>f</td><td>f</td><td>t</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-2-text">PostgreSQL 2.2 — text types</a>.</div>`,
        `<p class="y-chinh">🎯 Chuỗi được so sánh từng ký tự một, như thứ tự từ trong từ điển: vị trí khác nhau đầu tiên quyết định, và chuỗi là phần đầu (prefix) của chuỗi kia thì nhỏ hơn.</p>
<p>Luật trên slide: a = a₁…aₙ nhỏ hơn b = b₁…bₘ nếu k ký tự đầu giống nhau rồi aₖ₊₁ &lt; bₖ₊₁ (hoặc a hết trước). Hai ví dụ của slide:</p>
<table>
<thead><tr><th>Phép so sánh</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>fodder &lt; foo</td><td>f=f, o=o, rồi d &lt; o ở vị trí 3</td></tr>
<tr><td>bar &lt; bargain</td><td>"bar" là phần đầu của "bargain" — chuỗi ngắn hơn thì nhỏ hơn</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- Hai ví dụ của slide
SELECT CASE WHEN 'fodder' &lt; 'foo'    THEN 'TRUE' ELSE 'FALSE' END AS [fodder &lt; foo],
       CASE WHEN 'bar'    &lt; 'bargain' THEN 'TRUE' ELSE 'FALSE' END AS [bar &lt; bargain];
-- Đặc thù SQL Server (collation mặc định ..._CI_AS)
SELECT CASE WHEN 'abc' = 'ABC'    THEN 'TRUE' ELSE 'FALSE' END AS [abc = ABC],
       CASE WHEN 'abc' = 'abc   ' THEN 'TRUE' ELSE 'FALSE' END AS [abc = 'abc   '],
       CASE WHEN '10'  &lt; '9'      THEN 'TRUE' ELSE 'FALSE' END AS [text '10' &lt; '9'];</code></pre>
<table>
<thead><tr><th>fodder &lt; foo</th><th>bar &lt; bargain</th></tr></thead>
<tbody>
<tr><td>TRUE</td><td>TRUE</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>abc = ABC</th><th>abc = 'abc   '</th><th>text '10' &lt; '9'</th></tr></thead>
<tbody>
<tr><td>TRUE</td><td>TRUE</td><td>TRUE</td></tr>
</tbody>
</table>
<ul>
<li>SQL Server không có kiểu cột đúng/sai (boolean), nên kết quả so sánh được đổi thành chữ bằng <code>CASE WHEN … THEN 'TRUE' ELSE 'FALSE' END</code> (nếu … thì 'TRUE' ngược lại 'FALSE').</li>
<li><code>[fodder &lt; foo]</code> — ngoặc vuông cho phép bí danh cột (alias) chứa dấu cách và ký hiệu (chỉ có ở T-SQL).</li>
<li>Dòng thứ hai là "thói quen" của SQL Server: với collation mặc định (bộ luật so sánh chữ, ở đây <code>SQL_Latin1_General_CP1_CI_AS</code>, CI = case-insensitive — không phân biệt hoa thường) thì <code>'abc' = 'ABC'</code> là TRUE, và dấu cách ở cuối bị bỏ qua.</li>
</ul>
<div class="pitfall">Chữ thì so theo chữ: <code>'10' &lt; '9'</code> là TRUE vì '1' &lt; '9'. Số phải lưu trong cột kiểu số (INT, DECIMAL), đừng lưu trong VARCHAR, nếu không ORDER BY và phép &gt; sẽ cho kết quả "lạ".</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> phép so sánh là một giá trị boolean thật (<code>t</code>/<code>f</code>), và so sánh chữ <strong>phân biệt hoa thường</strong>, không bỏ qua dấu cách cuối — dùng <code>lower()</code> (hoặc ILIKE) khi không muốn phân biệt hoa thường:
<pre><code class="language-sql">-- PostgreSQL có kiểu boolean thật: không cần CASE
SELECT 'fodder' &lt; 'foo'   AS "fodder &lt; foo",
       'bar' &lt; 'bargain'  AS "bar &lt; bargain",
       'abc' = 'ABC'      AS "abc = ABC",
       'abc' = 'abc   '   AS "abc = 'abc   '",
       lower('abc') = lower('ABC') AS "lower(...) = lower(...)";</code></pre>
<table>
<thead><tr><th>fodder &lt; foo</th><th>bar &lt; bargain</th><th>abc = ABC</th><th>abc = 'abc   '</th><th>lower(...) = lower(...)</th></tr></thead>
<tbody>
<tr><td>t</td><td>t</td><td>f</td><td>f</td><td>t</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-2-text">PostgreSQL 2.2 — kiểu chữ</a>.</div>`],
      [8, 'Pattern Matching in SQL - Like or Not Like',
        `<p class="y-chinh">🎯 <code>s LIKE p</code> is TRUE when string s matches pattern p, where <code>%</code> means any sequence of 0 or more characters and <code>_</code> means exactly one character; <code>NOT LIKE</code> is the opposite.</p>
<table>
<thead><tr><th>Pattern</th><th>Matches</th><th>Does not match</th></tr></thead>
<tbody>
<tr><td><code>N'%Anh'</code></td><td>Võ Việt Anh, Lê Thị Lan Anh</td><td>Anh Tuấn (does not END with Anh)</td></tr>
<tr><td><code>N'H%'</code></td><td>Hoàng Thị Hà, Hồ Ngọc Hân</td><td>Trần Minh Quang</td></tr>
<tr><td><code>N'% H_n'</code></td><td>Hồ Ngọc Hân (last word: H + 1 char + n)</td><td>Hoàng Thị Hà</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- % = any sequence of 0 or more characters: names ending with 'Anh'
SELECT empName FROM tblEmployee WHERE empName LIKE N'%Anh';
-- _ = exactly one character: 'H', any one character, then 'n' at the end of a 3-letter word
SELECT empName FROM tblEmployee WHERE empName LIKE N'% H_n';
-- NOT LIKE: addresses that do not end with 'Hà Nội'
SELECT empName, empAddress FROM tblEmployee WHERE empAddress NOT LIKE N'%Hà Nội' ORDER BY empName;</code></pre>
<table>
<thead><tr><th>empName</th></tr></thead>
<tbody>
<tr><td>Võ Việt Anh</td></tr>
<tr><td>Lê Thị Lan Anh</td></tr>
<tr><td>Đặng Tuấn Anh</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th></tr></thead>
<tbody>
<tr><td>Hồ Ngọc Hân</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empAddress</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>9 Võ Văn Tần, Q.3, TP Hồ Chí Minh</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td></tr>
<tr><td>Lý Thanh Tâm</td><td>77 Hùng Vương, Hải Châu, TP Đà Nẵng</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td></tr>
<tr><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Trương Thị Thu</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td></tr>
<tr><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td></tr>
</tbody>
</table>
<p>Line by line: <code>SELECT empName FROM tblEmployee</code> = "show the column empName of table tblEmployee"; <code>WHERE empName LIKE N'%Anh'</code> = "keep only rows whose name ends with Anh"; <code>ORDER BY empName</code> = sort the result by name. The third query returns 8 rows although 14 employees exist — slide 14 explains the missing one.</p>
<div class="pitfall"><code>LIKE 'Anh'</code> without any <code>%</code> is just <code>= 'Anh'</code>. And <code>%</code> is not <code>*</code>: the Windows/Excel wildcard <code>*</code> means nothing to SQL.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> LIKE is <strong>case-sensitive</strong>: <code>'%anh'</code> finds nobody; <code>ILIKE</code> ignores case (PostgreSQL only):
<pre><code class="language-sql">-- LIKE is case-sensitive in PostgreSQL; ILIKE ignores case
SELECT count(*) AS like_anh_thuong FROM tblEmployee WHERE empName LIKE '%anh';
SELECT count(*) AS ilike_anh_thuong FROM tblEmployee WHERE empName ILIKE '%anh';</code></pre>
<table>
<thead><tr><th>like_anh_thuong</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>ilike_anh_thuong</th></tr></thead>
<tbody>
<tr><td>3</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-2-select-where">PostgreSQL 4.2 — SELECT … WHERE</a>.</div>`,
        `<p class="y-chinh">🎯 <code>s LIKE p</code> là TRUE khi chuỗi s khớp mẫu p, trong đó <code>%</code> nghĩa là một dãy 0 hay nhiều ký tự bất kỳ và <code>_</code> nghĩa là đúng một ký tự; <code>NOT LIKE</code> là ngược lại.</p>
<table>
<thead><tr><th>Mẫu</th><th>Khớp</th><th>Không khớp</th></tr></thead>
<tbody>
<tr><td><code>N'%Anh'</code></td><td>Võ Việt Anh, Lê Thị Lan Anh</td><td>Anh Tuấn (không KẾT THÚC bằng Anh)</td></tr>
<tr><td><code>N'H%'</code></td><td>Hoàng Thị Hà, Hồ Ngọc Hân</td><td>Trần Minh Quang</td></tr>
<tr><td><code>N'% H_n'</code></td><td>Hồ Ngọc Hân (từ cuối: H + 1 ký tự + n)</td><td>Hoàng Thị Hà</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- % = dãy 0 hay nhiều ký tự bất kỳ: tên kết thúc bằng 'Anh'
SELECT empName FROM tblEmployee WHERE empName LIKE N'%Anh';
-- _ = đúng một ký tự: từ cuối có 3 chữ, bắt đầu 'H', kết thúc 'n'
SELECT empName FROM tblEmployee WHERE empName LIKE N'% H_n';
-- NOT LIKE: địa chỉ không kết thúc bằng 'Hà Nội'
SELECT empName, empAddress FROM tblEmployee WHERE empAddress NOT LIKE N'%Hà Nội' ORDER BY empName;</code></pre>
<table>
<thead><tr><th>empName</th></tr></thead>
<tbody>
<tr><td>Võ Việt Anh</td></tr>
<tr><td>Lê Thị Lan Anh</td></tr>
<tr><td>Đặng Tuấn Anh</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th></tr></thead>
<tbody>
<tr><td>Hồ Ngọc Hân</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empAddress</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>9 Võ Văn Tần, Q.3, TP Hồ Chí Minh</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td></tr>
<tr><td>Lý Thanh Tâm</td><td>77 Hùng Vương, Hải Châu, TP Đà Nẵng</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td></tr>
<tr><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Trương Thị Thu</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td></tr>
<tr><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td></tr>
</tbody>
</table>
<p>Đọc từng dòng: <code>SELECT empName FROM tblEmployee</code> = "hiện cột empName của bảng tblEmployee"; <code>WHERE empName LIKE N'%Anh'</code> = "chỉ giữ các dòng có tên kết thúc bằng Anh"; <code>ORDER BY empName</code> = sắp kết quả theo tên. Câu thứ ba ra 8 dòng dù công ty có 14 nhân viên — slide 14 giải thích người bị thiếu.</p>
<div class="pitfall"><code>LIKE 'Anh'</code> không có <code>%</code> nào thì chỉ là <code>= 'Anh'</code>. Và <code>%</code> không phải <code>*</code>: ký tự đại diện <code>*</code> của Windows/Excel chẳng có nghĩa gì với SQL.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> LIKE <strong>phân biệt hoa thường</strong>: <code>'%anh'</code> không tìm được ai; <code>ILIKE</code> thì bỏ qua hoa thường (chỉ PostgreSQL có):
<pre><code class="language-sql">-- LIKE phân biệt hoa thường ở PostgreSQL; ILIKE thì không
SELECT count(*) AS like_anh_thuong FROM tblEmployee WHERE empName LIKE '%anh';
SELECT count(*) AS ilike_anh_thuong FROM tblEmployee WHERE empName ILIKE '%anh';</code></pre>
<table>
<thead><tr><th>like_anh_thuong</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>ilike_anh_thuong</th></tr></thead>
<tbody>
<tr><td>3</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-2-select-where">PostgreSQL 4.2 — SELECT … WHERE</a>.</div>`],
      [9, 'Pattern Matching in SQL - Example 5.1 and 5.2',
        `<p class="y-chinh">🎯 Example 5.1 finds the employee named exactly 'Võ Việt Anh' with <code>=</code>; Example 5.2 finds every name ending in 'Anh' with LIKE — both with the N prefix.</p>
<p>The code on the slide (its comment "/*5/2*/" is a typo for 5.2 — copied as is):</p>
<pre><code class="language-sql">/*5.1*/
SELECT * FROM tblEmployee WHERE empName = N'Võ Việt Anh';
GO
/*5/2*/
SELECT * FROM tblEmployee WHERE empName LIKE N'%Anh';
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>5 Láng Hạ, Đống Đa, TP Hà Nội</td><td>105000</td><td>M</td><td>1970-04-18</td><td>2</td><td>30121050010</td></tr>
</tbody>
</table>
<ul>
<li><code>SELECT *</code> — every column. <code>GO</code> — not SQL: it tells SSMS "send what is above as one batch".</li>
<li><code>N'Võ Việt Anh'</code> — the <strong>N</strong> makes the constant Unicode (NVARCHAR), so the Vietnamese letters survive.</li>
</ul>
<p>Now the same query without N:</p>
<pre><code class="language-sql">-- The same query WITHOUT the N prefix
SELECT * FROM tblEmployee WHERE empName = 'Võ Việt Anh';
-- What the literal became before the comparison
SELECT 'Võ Việt Anh' AS [không có N], N'Võ Việt Anh' AS [có N];</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>không có N</th><th>có N</th></tr></thead>
<tbody>
<tr><td>Võ Vi?t Anh</td><td>Võ Việt Anh</td></tr>
</tbody>
</table>
<div class="pitfall">Forgetting N is the classic PE bug with Vietnamese data: SQL Server first converts <code>'Võ Việt Anh'</code> to the code page of the database, where "ệ" does not exist, so it becomes "?" — the query silently returns 0 rows (and an INSERT would silently store "Vi?t"). Rule: NVARCHAR column + N'…' constant, always.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> every text is UTF-8: no N, no NVARCHAR. Selecting only the needed columns is also the habit at work:
<pre><code class="language-sql">-- 5.1 and 5.2 on PostgreSQL: no N, and only the columns we need
SELECT empSSN, empName FROM tblEmployee WHERE empName = 'Võ Việt Anh';
SELECT empSSN, empName FROM tblEmployee WHERE empName LIKE '%Anh';</code></pre>
<table>
<thead><tr><th>empssn</th><th>empname</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empssn</th><th>empname</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-2-text">PostgreSQL 2.2 — text types</a>.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 5.1 tìm nhân viên tên đúng 'Võ Việt Anh' bằng <code>=</code>; Ví dụ 5.2 tìm mọi tên kết thúc bằng 'Anh' bằng LIKE — cả hai đều có tiền tố N.</p>
<p>Code trên slide (chú thích "/*5/2*/" là gõ nhầm của 5.2 — chép nguyên):</p>
<pre><code class="language-sql">/*5.1*/
SELECT * FROM tblEmployee WHERE empName = N'Võ Việt Anh';
GO
/*5/2*/
SELECT * FROM tblEmployee WHERE empName LIKE N'%Anh';
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>5 Láng Hạ, Đống Đa, TP Hà Nội</td><td>105000</td><td>M</td><td>1970-04-18</td><td>2</td><td>30121050010</td></tr>
</tbody>
</table>
<ul>
<li><code>SELECT *</code> — lấy mọi cột. <code>GO</code> — không phải SQL: nó bảo SSMS "gửi phần phía trên đi thành một lô (batch)".</li>
<li><code>N'Võ Việt Anh'</code> — chữ <strong>N</strong> làm hằng chuỗi thành Unicode (NVARCHAR), nhờ vậy chữ tiếng Việt còn nguyên dấu.</li>
</ul>
<p>Giờ chạy lại cùng câu đó nhưng bỏ N:</p>
<pre><code class="language-sql">-- Cùng câu đó nhưng QUÊN tiền tố N
SELECT * FROM tblEmployee WHERE empName = 'Võ Việt Anh';
-- Chuỗi hằng đã bị đổi thành gì trước khi so sánh
SELECT 'Võ Việt Anh' AS [không có N], N'Võ Việt Anh' AS [có N];</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>không có N</th><th>có N</th></tr></thead>
<tbody>
<tr><td>Võ Vi?t Anh</td><td>Võ Việt Anh</td></tr>
</tbody>
</table>
<div class="pitfall">Quên N là lỗi kinh điển ở bài PE có dữ liệu tiếng Việt: SQL Server đổi <code>'Võ Việt Anh'</code> sang bảng mã (code page) của database trước, trong đó không có chữ "ệ", nên nó thành "?" — câu truy vấn lặng lẽ trả về 0 dòng (còn câu INSERT thì lặng lẽ lưu "Vi?t"). Luật: cột NVARCHAR + hằng N'…', luôn luôn.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> mọi chuỗi đều là UTF-8: không cần N, không cần NVARCHAR. Chỉ lấy đúng các cột cần dùng cũng là thói quen khi đi làm:
<pre><code class="language-sql">-- 5.1 và 5.2 trên PostgreSQL: không có N, chỉ lấy cột cần
SELECT empSSN, empName FROM tblEmployee WHERE empName = 'Võ Việt Anh';
SELECT empSSN, empName FROM tblEmployee WHERE empName LIKE '%Anh';</code></pre>
<table>
<thead><tr><th>empssn</th><th>empname</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empssn</th><th>empname</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-2-text">PostgreSQL 2.2 — kiểu chữ</a>.</div>`],
      [10, 'Pattern Matching in SQL - USING ESCAPE keyword',
        `<p class="y-chinh">🎯 To search for a real <code>%</code> or <code>_</code>, choose an escape character with ESCAPE: in the pattern, "escape char + %" means a literal %.</p>
<p>The slide writes <code>ESCAPE !</code>; the real syntax needs quotes: <code>ESCAPE '!'</code>. Reading the three patterns:</p>
<table>
<thead><tr><th>Pattern</th><th>Read it as</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>'%20!%%' ESCAPE '!'</code></td><td>% · 2 · 0 · literal % · %</td><td>contains "20%"</td></tr>
<tr><td><code>'%20@%%' ESCAPE '@'</code></td><td>the same with @</td><td>contains "20%"</td></tr>
<tr><td><code>'x%%x%' ESCAPE 'x'</code></td><td>literal % · % · literal %</td><td>begins AND ends with %</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- A small table of strings to test the patterns
CREATE TABLE tblNote (s NVARCHAR(50));
INSERT INTO tblNote (s) VALUES (N'Giảm 20% hôm nay'), (N'Mua 200 tặng 1'), (N'20%'), (N'%VIP%'), (N'%lỗi'), (N'Lãi 5%');
-- Strings that contain '20%' (! is the escape character)
SELECT s FROM tblNote WHERE s LIKE '%20!%%' ESCAPE '!';
-- Same meaning with @ as the escape character
SELECT s FROM tblNote WHERE s LIKE '%20@%%' ESCAPE '@';
-- Strings that begin AND end with '%' (x is the escape character)
SELECT s FROM tblNote WHERE s LIKE 'x%%x%' ESCAPE 'x';
-- Without ESCAPE, % is a wildcard again
SELECT s FROM tblNote WHERE s LIKE '%20%';
-- T-SQL only: put the wildcard in [ ] to take it literally
SELECT s FROM tblNote WHERE s LIKE '%20[%]%';</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>s</th></tr></thead>
<tbody>
<tr><td>Giảm 20% hôm nay</td></tr>
<tr><td>20%</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>s</th></tr></thead>
<tbody>
<tr><td>Giảm 20% hôm nay</td></tr>
<tr><td>20%</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>s</th></tr></thead>
<tbody>
<tr><td>%VIP%</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>s</th></tr></thead>
<tbody>
<tr><td>Giảm 20% hôm nay</td></tr>
<tr><td>Mua 200 tặng 1</td></tr>
<tr><td>20%</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>s</th></tr></thead>
<tbody>
<tr><td>Giảm 20% hôm nay</td></tr>
<tr><td>20%</td></tr>
</tbody>
</table>
<p>"Mua 200 tặng 1" matches only the fourth query: without ESCAPE, <code>%20%</code> just means "contains 20". Note that the string "20%" matches <code>'%20!%%'</code> too: <code>%</code> may stand for zero characters.</p>
<p>The last query shows a T-SQL-only alternative: a wildcard inside square brackets, <code>[%]</code>, means "this character literally" — same result as the first two.</p>
<p class="meo">🧠 Pick an escape character that cannot appear in the data (!, @, \\). In the pattern, <strong>escape char + wildcard = the wildcard itself</strong>.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> ESCAPE works the same, and in addition the backslash is already the default escape character, so <code>'%20\\%%'</code> works without ESCAPE (SQL Server has no default escape; <code>[ ]</code> classes are T-SQL only):
<pre><code class="language-sql">CREATE TABLE tblNote (s VARCHAR(50));
INSERT INTO tblNote (s) VALUES ('Giảm 20% hôm nay'), ('Mua 200 tặng 1'), ('20%'), ('%VIP%'), ('%lỗi'), ('Lãi 5%');
-- Standard ESCAPE works the same
SELECT s FROM tblNote WHERE s LIKE '%20!%%' ESCAPE '!';
-- PostgreSQL already treats backslash as the escape character
SELECT s FROM tblNote WHERE s LIKE '%20\\%%';</code></pre>
<div class="out">INSERT 0 6</div>
<table>
<thead><tr><th>s</th></tr></thead>
<tbody>
<tr><td>Giảm 20% hôm nay</td></tr>
<tr><td>20%</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>s</th></tr></thead>
<tbody>
<tr><td>Giảm 20% hôm nay</td></tr>
<tr><td>20%</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-2-select-where">PostgreSQL 4.2 — SELECT … WHERE</a>.</div>`,
        `<p class="y-chinh">🎯 Muốn tìm đúng ký tự <code>%</code> hay <code>_</code> thật thì chọn một ký tự thoát (escape character) bằng ESCAPE: trong mẫu, "ký tự thoát + %" nghĩa là dấu % thật.</p>
<p>Slide viết <code>ESCAPE !</code>; cú pháp thật cần dấu nháy: <code>ESCAPE '!'</code>. Đọc ba mẫu:</p>
<table>
<thead><tr><th>Mẫu</th><th>Đọc là</th><th>Nghĩa</th></tr></thead>
<tbody>
<tr><td><code>'%20!%%' ESCAPE '!'</code></td><td>% · 2 · 0 · dấu % thật · %</td><td>có chứa "20%"</td></tr>
<tr><td><code>'%20@%%' ESCAPE '@'</code></td><td>như trên, dùng @</td><td>có chứa "20%"</td></tr>
<tr><td><code>'x%%x%' ESCAPE 'x'</code></td><td>dấu % thật · % · dấu % thật</td><td>bắt đầu VÀ kết thúc bằng %</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- Một bảng nhỏ các chuỗi để thử mẫu
CREATE TABLE tblNote (s NVARCHAR(50));
INSERT INTO tblNote (s) VALUES (N'Giảm 20% hôm nay'), (N'Mua 200 tặng 1'), (N'20%'), (N'%VIP%'), (N'%lỗi'), (N'Lãi 5%');
-- Chuỗi có chứa '20%' (! là ký tự thoát)
SELECT s FROM tblNote WHERE s LIKE '%20!%%' ESCAPE '!';
-- Cùng nghĩa, dùng @ làm ký tự thoát
SELECT s FROM tblNote WHERE s LIKE '%20@%%' ESCAPE '@';
-- Chuỗi bắt đầu VÀ kết thúc bằng '%' (x là ký tự thoát)
SELECT s FROM tblNote WHERE s LIKE 'x%%x%' ESCAPE 'x';
-- Không có ESCAPE thì % lại là ký tự đại diện
SELECT s FROM tblNote WHERE s LIKE '%20%';
-- Chỉ T-SQL: đặt ký tự đại diện trong [ ] để hiểu theo nghĩa đen
SELECT s FROM tblNote WHERE s LIKE '%20[%]%';</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>s</th></tr></thead>
<tbody>
<tr><td>Giảm 20% hôm nay</td></tr>
<tr><td>20%</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>s</th></tr></thead>
<tbody>
<tr><td>Giảm 20% hôm nay</td></tr>
<tr><td>20%</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>s</th></tr></thead>
<tbody>
<tr><td>%VIP%</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>s</th></tr></thead>
<tbody>
<tr><td>Giảm 20% hôm nay</td></tr>
<tr><td>Mua 200 tặng 1</td></tr>
<tr><td>20%</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>s</th></tr></thead>
<tbody>
<tr><td>Giảm 20% hôm nay</td></tr>
<tr><td>20%</td></tr>
</tbody>
</table>
<p>"Mua 200 tặng 1" chỉ khớp câu thứ tư: không có ESCAPE thì <code>%20%</code> chỉ còn nghĩa "có chứa 20". Chuỗi "20%" cũng khớp <code>'%20!%%'</code>: dấu <code>%</code> được phép ứng với 0 ký tự.</p>
<p>Câu cuối là cách chỉ T-SQL có: ký tự đại diện đặt trong ngoặc vuông, <code>[%]</code>, nghĩa là "đúng ký tự này" — ra cùng kết quả với hai câu đầu.</p>
<p class="meo">🧠 Chọn ký tự thoát không thể có trong dữ liệu (!, @, \\). Trong mẫu, <strong>ký tự thoát + ký tự đại diện = chính ký tự đó</strong>.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> ESCAPE chạy y hệt, và thêm nữa dấu gạch ngược đã là ký tự thoát mặc định, nên <code>'%20\\%%'</code> chạy được không cần ESCAPE (SQL Server không có ký tự thoát mặc định; lớp <code>[ ]</code> chỉ T-SQL có):
<pre><code class="language-sql">CREATE TABLE tblNote (s VARCHAR(50));
INSERT INTO tblNote (s) VALUES ('Giảm 20% hôm nay'), ('Mua 200 tặng 1'), ('20%'), ('%VIP%'), ('%lỗi'), ('Lãi 5%');
-- ESCAPE chuẩn chạy y hệt
SELECT s FROM tblNote WHERE s LIKE '%20!%%' ESCAPE '!';
-- PostgreSQL mặc định coi dấu gạch ngược là ký tự thoát
SELECT s FROM tblNote WHERE s LIKE '%20\\%%';</code></pre>
<div class="out">INSERT 0 6</div>
<table>
<thead><tr><th>s</th></tr></thead>
<tbody>
<tr><td>Giảm 20% hôm nay</td></tr>
<tr><td>20%</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>s</th></tr></thead>
<tbody>
<tr><td>Giảm 20% hôm nay</td></tr>
<tr><td>20%</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-2-select-where">PostgreSQL 4.2 — SELECT … WHERE</a>.</div>`],
      [11, 'Dates and Times',
        `<p class="y-chinh">🎯 Dates and times are special types (DATE, TIME, TIMESTAMP) with their own constants, arithmetic and comparisons.</p>
<p>The slide shows the <strong>standard SQL</strong> constants <code>DATE '1948-05-14'</code>, <code>TIME '15:00:02.5'</code>, <code>TIMESTAMP '1948-05-14 12:00:00'</code>. Typed as-is into SQL Server:</p>
<pre><code class="language-sql">-- The standard literal of the slide, typed as-is in SQL Server
SELECT DATE '1948-05-14';</code></pre>
<div class="out"><b>Msg 207, Level 16, State 1<br>
Invalid column name 'DATE'.</b></div>
<p>SQL Server does not know this form. It writes the date as a string in the safe format 'YYYY-MM-DD' and converts it (TIMESTAMP is called DATETIME2 there):</p>
<pre><code class="language-sql">-- SQL Server writes a date/time constant as a string, then CAST
SELECT CAST('1948-05-14' AS DATE)                  AS [date],
       CONVERT(VARCHAR(12), CAST('15:00:02.5' AS TIME(1))) AS [time],
       CAST('1948-05-14 12:00:00' AS DATETIME2(0)) AS [timestamp];</code></pre>
<table>
<thead><tr><th>date</th><th>time</th><th>timestamp</th></tr></thead>
<tbody>
<tr><td>1948-05-14</td><td>15:00:02.5</td><td>1948-05-14 12:00:00</td></tr>
</tbody>
</table>
<p>Arithmetic and comparison (on the FUHCompany data):</p>
<pre><code class="language-sql">-- Arithmetic: add days / months, count the difference
SELECT DATEADD(DAY, 30, CAST('2026-09-15' AS DATE))  AS [+30 ngày],
       DATEADD(MONTH, 1, CAST('2026-01-31' AS DATE))  AS [+1 tháng],
       DATEDIFF(DAY, '2026-09-01', '2026-12-25')      AS [số ngày tới Noel];
-- Comparison: employees born before 1980
SELECT empName, empBirthdate
FROM tblEmployee
WHERE empBirthdate &lt; '1980-01-01'
ORDER BY empBirthdate;</code></pre>
<table>
<thead><tr><th>+30 ngày</th><th>+1 tháng</th><th>số ngày tới Noel</th></tr></thead>
<tbody>
<tr><td>2026-10-15</td><td>2026-02-28</td><td>115</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empBirthdate</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>1968-03-12</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>1970-04-18</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>1975-10-10</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>1978-09-09</td></tr>
</tbody>
</table>
<ul>
<li><code>DATEADD(DAY, 30, d)</code> adds 30 days; <code>DATEADD(MONTH, 1, '2026-01-31')</code> gives 2026-02-28 (no 31 February).</li>
<li><code>DATEDIFF(DAY, a, b)</code> = number of day boundaries from a to b.</li>
<li><code>empBirthdate &lt; '1980-01-01'</code> — dates compare in time order.</li>
</ul>
<p>Slide 17 and the queries of Chapter 6 compute an age as <code>YEAR(GETDATE()) - YEAR(DOB)</code> (GETDATE() = now). Compare it with the real age on a fixed day:</p>
<pre><code class="language-sql">-- Age "by year" vs real age on a fixed day (2026-02-01)
DECLARE @today DATE = '2026-02-01';
SELECT empName, empBirthdate,
       YEAR(@today) - YEAR(empBirthdate) AS [tuổi theo năm],
       DATEDIFF(YEAR, empBirthdate, @today)
         - CASE WHEN DATEADD(YEAR, DATEDIFF(YEAR, empBirthdate, @today), empBirthdate) &gt; @today THEN 1 ELSE 0 END AS [tuổi thật]
FROM tblEmployee
WHERE depNum = 1
ORDER BY empSSN;</code></pre>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empName</th><th>empBirthdate</th><th>tuổi theo năm</th><th>tuổi thật</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>1968-03-12</td><td>58</td><td>57</td></tr>
<tr><td>Hoàng Thị Hà</td><td>1985-07-20</td><td>41</td><td>40</td></tr>
<tr><td>Võ Việt Anh</td><td>1990-11-02</td><td>36</td><td>35</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>1995-01-15</td><td>31</td><td>31</td></tr>
</tbody>
</table>
<div class="pitfall"><code>YEAR(today) - YEAR(birth)</code> is not the age: on 2026-02-01 Trần Minh Quang (born 12 March) is still 57, not 58. Good enough for the lab's "under 18" CHECK, but know why the number can be one too high.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the standard constants of the slide work, arithmetic uses <code>+ 30</code> and <code>INTERVAL '1 month'</code>, <code>date - date</code> gives days, and <code>age()</code> gives the exact age (instead of GETDATE() write <code>now()</code> or <code>CURRENT_DATE</code>):
<pre><code class="language-sql">-- PostgreSQL accepts the standard literals of the slide
SELECT DATE '1948-05-14' AS d, TIME '15:00:02.5' AS t, TIMESTAMP '1948-05-14 12:00:00' AS ts;
-- Arithmetic with + and INTERVAL; date - date = number of days
SELECT DATE '2026-09-15' + 30                   AS "+30 ngày",
       DATE '2026-01-31' + INTERVAL '1 month'   AS "+1 tháng",
       DATE '2026-12-25' - DATE '2026-09-01'    AS "số ngày tới Noel";
-- Real age in one function
SELECT empName, empBirthdate,
       EXTRACT(YEAR FROM age(DATE '2026-02-01', empBirthdate)) AS "tuổi thật"
FROM tblEmployee
WHERE depNum = 1
ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>d</th><th>t</th><th>ts</th></tr></thead>
<tbody>
<tr><td>1948-05-14</td><td>15:00:02.5</td><td>1948-05-14 12:00:00</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>+30 ngày</th><th>+1 tháng</th><th>số ngày tới Noel</th></tr></thead>
<tbody>
<tr><td>2026-10-15</td><td>2026-02-28 00:00:00</td><td>115</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empname</th><th>empbirthdate</th><th>tuổi thật</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>1968-03-12</td><td>57</td></tr>
<tr><td>Hoàng Thị Hà</td><td>1985-07-20</td><td>40</td></tr>
<tr><td>Võ Việt Anh</td><td>1990-11-02</td><td>35</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>1995-01-15</td><td>31</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-3-ngay-gio">PostgreSQL 2.3 — dates and times</a>.</div>`,
        `<p class="y-chinh">🎯 Ngày và giờ là các kiểu đặc biệt (DATE, TIME, TIMESTAMP) có hằng, phép tính và phép so sánh riêng.</p>
<p>Slide dùng hằng theo <strong>SQL chuẩn</strong>: <code>DATE '1948-05-14'</code>, <code>TIME '15:00:02.5'</code>, <code>TIMESTAMP '1948-05-14 12:00:00'</code>. Gõ nguyên văn vào SQL Server:</p>
<pre><code class="language-sql">-- Hằng chuẩn trên slide, gõ nguyên văn vào SQL Server
SELECT DATE '1948-05-14';</code></pre>
<div class="out"><b>Msg 207, Level 16, State 1<br>
Invalid column name 'DATE'.</b></div>
<p>SQL Server không hiểu dạng này. Nó viết ngày bằng chuỗi theo định dạng an toàn 'YYYY-MM-DD' rồi đổi kiểu (TIMESTAMP ở đó tên là DATETIME2):</p>
<pre><code class="language-sql">-- SQL Server viết hằng ngày giờ bằng chuỗi rồi CAST
SELECT CAST('1948-05-14' AS DATE)                  AS [date],
       CONVERT(VARCHAR(12), CAST('15:00:02.5' AS TIME(1))) AS [time],
       CAST('1948-05-14 12:00:00' AS DATETIME2(0)) AS [timestamp];</code></pre>
<table>
<thead><tr><th>date</th><th>time</th><th>timestamp</th></tr></thead>
<tbody>
<tr><td>1948-05-14</td><td>15:00:02.5</td><td>1948-05-14 12:00:00</td></tr>
</tbody>
</table>
<p>Phép tính và so sánh (trên dữ liệu FUHCompany):</p>
<pre><code class="language-sql">-- Phép tính: cộng ngày / tháng, đếm khoảng cách
SELECT DATEADD(DAY, 30, CAST('2026-09-15' AS DATE))  AS [+30 ngày],
       DATEADD(MONTH, 1, CAST('2026-01-31' AS DATE))  AS [+1 tháng],
       DATEDIFF(DAY, '2026-09-01', '2026-12-25')      AS [số ngày tới Noel];
-- So sánh: nhân viên sinh trước năm 1980
SELECT empName, empBirthdate
FROM tblEmployee
WHERE empBirthdate &lt; '1980-01-01'
ORDER BY empBirthdate;</code></pre>
<table>
<thead><tr><th>+30 ngày</th><th>+1 tháng</th><th>số ngày tới Noel</th></tr></thead>
<tbody>
<tr><td>2026-10-15</td><td>2026-02-28</td><td>115</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empBirthdate</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>1968-03-12</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>1970-04-18</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>1975-10-10</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>1978-09-09</td></tr>
</tbody>
</table>
<ul>
<li><code>DATEADD(DAY, 30, d)</code> cộng 30 ngày; <code>DATEADD(MONTH, 1, '2026-01-31')</code> ra 2026-02-28 (không có ngày 31/2).</li>
<li><code>DATEDIFF(DAY, a, b)</code> = số lần qua mốc ngày từ a tới b.</li>
<li><code>empBirthdate &lt; '1980-01-01'</code> — ngày so sánh theo thứ tự thời gian.</li>
</ul>
<p>Slide 17 và các truy vấn Chương 6 tính tuổi bằng <code>YEAR(GETDATE()) - YEAR(DOB)</code> (GETDATE() = thời điểm hiện tại). So với tuổi thật vào một ngày cố định:</p>
<pre><code class="language-sql">-- Tuổi "theo năm" so với tuổi thật vào một ngày cố định (2026-02-01)
DECLARE @today DATE = '2026-02-01';
SELECT empName, empBirthdate,
       YEAR(@today) - YEAR(empBirthdate) AS [tuổi theo năm],
       DATEDIFF(YEAR, empBirthdate, @today)
         - CASE WHEN DATEADD(YEAR, DATEDIFF(YEAR, empBirthdate, @today), empBirthdate) &gt; @today THEN 1 ELSE 0 END AS [tuổi thật]
FROM tblEmployee
WHERE depNum = 1
ORDER BY empSSN;</code></pre>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empName</th><th>empBirthdate</th><th>tuổi theo năm</th><th>tuổi thật</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>1968-03-12</td><td>58</td><td>57</td></tr>
<tr><td>Hoàng Thị Hà</td><td>1985-07-20</td><td>41</td><td>40</td></tr>
<tr><td>Võ Việt Anh</td><td>1990-11-02</td><td>36</td><td>35</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>1995-01-15</td><td>31</td><td>31</td></tr>
</tbody>
</table>
<div class="pitfall"><code>YEAR(hôm nay) - YEAR(ngày sinh)</code> chưa phải là tuổi: ngày 2026-02-01 anh Trần Minh Quang (sinh 12/3) vẫn 57 tuổi chứ chưa 58. Dùng cho CHECK "dưới 18 tuổi" của bài lab thì tạm được, nhưng phải biết vì sao con số có thể dư 1.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> các hằng chuẩn trên slide chạy được, phép tính dùng <code>+ 30</code> và <code>INTERVAL '1 month'</code>, <code>ngày - ngày</code> ra số ngày, và <code>age()</code> cho tuổi chính xác (thay GETDATE() bằng <code>now()</code> hoặc <code>CURRENT_DATE</code>):
<pre><code class="language-sql">-- PostgreSQL nhận đúng các hằng chuẩn trên slide
SELECT DATE '1948-05-14' AS d, TIME '15:00:02.5' AS t, TIMESTAMP '1948-05-14 12:00:00' AS ts;
-- Phép tính bằng + và INTERVAL; ngày - ngày = số ngày
SELECT DATE '2026-09-15' + 30                   AS "+30 ngày",
       DATE '2026-01-31' + INTERVAL '1 month'   AS "+1 tháng",
       DATE '2026-12-25' - DATE '2026-09-01'    AS "số ngày tới Noel";
-- Tuổi thật bằng một hàm
SELECT empName, empBirthdate,
       EXTRACT(YEAR FROM age(DATE '2026-02-01', empBirthdate)) AS "tuổi thật"
FROM tblEmployee
WHERE depNum = 1
ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>d</th><th>t</th><th>ts</th></tr></thead>
<tbody>
<tr><td>1948-05-14</td><td>15:00:02.5</td><td>1948-05-14 12:00:00</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>+30 ngày</th><th>+1 tháng</th><th>số ngày tới Noel</th></tr></thead>
<tbody>
<tr><td>2026-10-15</td><td>2026-02-28 00:00:00</td><td>115</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empname</th><th>empbirthdate</th><th>tuổi thật</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>1968-03-12</td><td>57</td></tr>
<tr><td>Hoàng Thị Hà</td><td>1985-07-20</td><td>40</td></tr>
<tr><td>Võ Việt Anh</td><td>1990-11-02</td><td>35</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>1995-01-15</td><td>31</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-3-ngay-gio">PostgreSQL 2.3 — ngày giờ</a>.</div>`],
      [12, 'Null Values',
        `<p class="y-chinh">🎯 NULL is a special marker meaning "no value here"; any arithmetic with NULL gives NULL and any comparison with NULL gives UNKNOWN.</p>
<p>The slide's three meanings, on FUHCompany:</p>
<table>
<thead><tr><th>Meaning</th><th>Example</th></tr></thead>
<tbody>
<tr><td>value unknown — it exists but we do not know it</td><td>Bùi Văn Nam's empAddress is NULL</td></tr>
<tr><td>value inapplicable — nothing makes sense here</td><td>the director's supervisorSSN is NULL: nobody supervises him</td></tr>
<tr><td>value withheld — we may not see it</td><td>a salary hidden from a user without permission</td></tr>
</tbody>
</table>
<p>"NULL is not a constant": you cannot compare with it using <code>=</code>.</p>
<pre><code class="language-sql">-- = NULL is never TRUE: 0 rows
SELECT empName, empAddress FROM tblEmployee WHERE empAddress = NULL;
-- IS NULL is the right test
SELECT empName, empAddress FROM tblEmployee WHERE empAddress IS NULL;</code></pre>
<table>
<thead><tr><th>empName</th><th>empAddress</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empAddress</th></tr></thead>
<tbody>
<tr><td>Bùi Văn Nam</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p><code>= NULL</code> never finds anything; <code>IS NULL</code> / <code>IS NOT NULL</code> are the tests. Arithmetic:</p>
<pre><code class="language-sql">-- Arithmetic with NULL gives NULL
SELECT empName, empSalary, empSalary + NULL AS [lương + NULL], empBirthdate, YEAR(empBirthdate) + 1 AS [năm sinh + 1]
FROM tblEmployee
WHERE empSSN IN (30121050021, 30121050038);</code></pre>
<table>
<thead><tr><th>empName</th><th>empSalary</th><th>lương + NULL</th><th>empBirthdate</th><th>năm sinh + 1</th></tr></thead>
<tbody>
<tr><td>Bùi Văn Nam</td><td>40000</td><td><em>NULL</em></td><td>1998-02-14</td><td>1999</td></tr>
<tr><td>Phan Hữu Nghĩa</td><td>38000</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p>To display something readable instead of NULL:</p>
<pre><code class="language-sql">-- Replace NULL by a value when displaying
SELECT empName,
       ISNULL(empAddress, N'(chưa rõ)')   AS [ISNULL],
       COALESCE(empAddress, N'(chưa rõ)') AS [COALESCE]
FROM tblEmployee
WHERE depNum = 3
ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empName</th><th>ISNULL</th><th>COALESCE</th></tr></thead>
<tbody>
<tr><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td></tr>
<tr><td>Bùi Văn Nam</td><td>(chưa rõ)</td><td>(chưa rõ)</td></tr>
<tr><td>Trương Thị Thu</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td></tr>
</tbody>
</table>
<div class="pitfall"><code>WHERE col = NULL</code> is accepted by SQL Server without any error — and always returns 0 rows. In the PE this costs the whole question. Write <code>IS NULL</code>.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> there is no <code>ISNULL()</code> function (T-SQL only): use <code>COALESCE</code>, which is standard SQL and works on both — learn that one:
<pre><code class="language-sql">-- PostgreSQL has no ISNULL(): use COALESCE (also standard SQL)
SELECT empName, COALESCE(empAddress, '(chưa rõ)') AS dia_chi
FROM tblEmployee
WHERE depNum = 3
ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empname</th><th>dia_chi</th></tr></thead>
<tbody>
<tr><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td></tr>
<tr><td>Bùi Văn Nam</td><td>(chưa rõ)</td></tr>
<tr><td>Trương Thị Thu</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-3-rang-buoc-cot">PostgreSQL 3.3 — column constraints (NOT NULL)</a>.</div>`,
        `<p class="y-chinh">🎯 NULL là dấu đặc biệt nghĩa là "ở đây không có giá trị"; mọi phép tính với NULL ra NULL, mọi phép so sánh với NULL ra UNKNOWN (không biết).</p>
<p>Ba cách hiểu trên slide, với FUHCompany:</p>
<table>
<thead><tr><th>Cách hiểu</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>không biết giá trị (unknown) — có nhưng ta không biết</td><td>empAddress của Bùi Văn Nam là NULL</td></tr>
<tr><td>không áp dụng (inapplicable) — không giá trị nào có nghĩa</td><td>supervisorSSN của giám đốc là NULL: không ai giám sát ông ấy</td></tr>
<tr><td>bị giữ kín (withheld) — ta không được phép biết</td><td>lương bị ẩn với người dùng không có quyền</td></tr>
</tbody>
</table>
<p>"NULL không phải hằng số": không so sánh với nó bằng <code>=</code> được.</p>
<pre><code class="language-sql">-- = NULL không bao giờ TRUE: 0 dòng
SELECT empName, empAddress FROM tblEmployee WHERE empAddress = NULL;
-- IS NULL mới là phép kiểm đúng
SELECT empName, empAddress FROM tblEmployee WHERE empAddress IS NULL;</code></pre>
<table>
<thead><tr><th>empName</th><th>empAddress</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empAddress</th></tr></thead>
<tbody>
<tr><td>Bùi Văn Nam</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p><code>= NULL</code> không bao giờ tìm được gì; phép kiểm đúng là <code>IS NULL</code> / <code>IS NOT NULL</code>. Phép tính:</p>
<pre><code class="language-sql">-- Phép tính với NULL cho ra NULL
SELECT empName, empSalary, empSalary + NULL AS [lương + NULL], empBirthdate, YEAR(empBirthdate) + 1 AS [năm sinh + 1]
FROM tblEmployee
WHERE empSSN IN (30121050021, 30121050038);</code></pre>
<table>
<thead><tr><th>empName</th><th>empSalary</th><th>lương + NULL</th><th>empBirthdate</th><th>năm sinh + 1</th></tr></thead>
<tbody>
<tr><td>Bùi Văn Nam</td><td>40000</td><td><em>NULL</em></td><td>1998-02-14</td><td>1999</td></tr>
<tr><td>Phan Hữu Nghĩa</td><td>38000</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p>Để hiện chữ dễ đọc thay cho NULL:</p>
<pre><code class="language-sql">-- Thay NULL bằng một giá trị khi hiển thị
SELECT empName,
       ISNULL(empAddress, N'(chưa rõ)')   AS [ISNULL],
       COALESCE(empAddress, N'(chưa rõ)') AS [COALESCE]
FROM tblEmployee
WHERE depNum = 3
ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empName</th><th>ISNULL</th><th>COALESCE</th></tr></thead>
<tbody>
<tr><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td></tr>
<tr><td>Bùi Văn Nam</td><td>(chưa rõ)</td><td>(chưa rõ)</td></tr>
<tr><td>Trương Thị Thu</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td></tr>
</tbody>
</table>
<div class="pitfall"><code>WHERE cot = NULL</code> được SQL Server nhận không báo lỗi gì — và luôn trả 0 dòng. Ở bài PE lỗi này mất trọn câu. Viết <code>IS NULL</code>.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> không có hàm <code>ISNULL()</code> (chỉ T-SQL có): dùng <code>COALESCE</code>, là SQL chuẩn và chạy được ở cả hai — nên học hàm này:
<pre><code class="language-sql">-- PostgreSQL không có ISNULL(): dùng COALESCE (cũng là SQL chuẩn)
SELECT empName, COALESCE(empAddress, '(chưa rõ)') AS dia_chi
FROM tblEmployee
WHERE depNum = 3
ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empname</th><th>dia_chi</th></tr></thead>
<tbody>
<tr><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td></tr>
<tr><td>Bùi Văn Nam</td><td>(chưa rõ)</td></tr>
<tr><td>Trương Thị Thu</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-3-rang-buoc-cot">PostgreSQL 3.3 — ràng buộc cột (NOT NULL)</a>.</div>`],
      [13, 'The Truth-Value UNKNOWN',
        `<p class="y-chinh">🎯 SQL logic has three values: TRUE = 1, FALSE = 0, UNKNOWN = ½, with x AND y = MIN(x, y), x OR y = MAX(x, y), NOT x = 1 − x.</p>
<p>The slide's truth table, produced by SQL Server itself: x and y are the conditions <code>v = 1</code> where v is 1 (TRUE), 0 (FALSE) or NULL (UNKNOWN):</p>
<pre><code class="language-sql">-- x and y are conditions "v = 1": 1 → TRUE, 0 → FALSE, NULL → UNKNOWN
WITH v(n) AS (SELECT 1 UNION ALL SELECT 0 UNION ALL SELECT NULL)
SELECT CASE WHEN x.n = 1 THEN 'TRUE' WHEN NOT (x.n = 1) THEN 'FALSE' ELSE 'UNKNOWN' END AS x,
       CASE WHEN y.n = 1 THEN 'TRUE' WHEN NOT (y.n = 1) THEN 'FALSE' ELSE 'UNKNOWN' END AS y,
       CASE WHEN x.n = 1 AND y.n = 1 THEN 'TRUE' WHEN NOT (x.n = 1 AND y.n = 1) THEN 'FALSE' ELSE 'UNKNOWN' END AS [x AND y],
       CASE WHEN x.n = 1 OR y.n = 1  THEN 'TRUE' WHEN NOT (x.n = 1 OR y.n = 1)  THEN 'FALSE' ELSE 'UNKNOWN' END AS [x OR y],
       CASE WHEN NOT (x.n = 1) THEN 'TRUE' WHEN x.n = 1 THEN 'FALSE' ELSE 'UNKNOWN' END AS [NOT x]
FROM v AS x CROSS JOIN v AS y
ORDER BY COALESCE(x.n, 0.5) DESC, COALESCE(y.n, 0.5) DESC;</code></pre>
<table>
<thead><tr><th>x</th><th>y</th><th>x AND y</th><th>x OR y</th><th>NOT x</th></tr></thead>
<tbody>
<tr><td>TRUE</td><td>TRUE</td><td>TRUE</td><td>TRUE</td><td>FALSE</td></tr>
<tr><td>TRUE</td><td>UNKNOWN</td><td>UNKNOWN</td><td>TRUE</td><td>FALSE</td></tr>
<tr><td>TRUE</td><td>FALSE</td><td>FALSE</td><td>TRUE</td><td>FALSE</td></tr>
<tr><td>UNKNOWN</td><td>TRUE</td><td>UNKNOWN</td><td>TRUE</td><td>UNKNOWN</td></tr>
<tr><td>UNKNOWN</td><td>UNKNOWN</td><td>UNKNOWN</td><td>UNKNOWN</td><td>UNKNOWN</td></tr>
<tr><td>UNKNOWN</td><td>FALSE</td><td>FALSE</td><td>UNKNOWN</td><td>UNKNOWN</td></tr>
<tr><td>FALSE</td><td>TRUE</td><td>FALSE</td><td>TRUE</td><td>TRUE</td></tr>
<tr><td>FALSE</td><td>UNKNOWN</td><td>FALSE</td><td>UNKNOWN</td><td>TRUE</td></tr>
<tr><td>FALSE</td><td>FALSE</td><td>FALSE</td><td>FALSE</td><td>TRUE</td></tr>
</tbody>
</table>
<p>Check two rows with the numbers: TRUE AND UNKNOWN = MIN(1, ½) = ½ = UNKNOWN; FALSE OR UNKNOWN = MAX(0, ½) = UNKNOWN; NOT UNKNOWN = 1 − ½ = UNKNOWN.</p>
<p class="meo">🧠 FALSE wins an AND, TRUE wins an OR, whatever the other side is. Only when the "winner" is absent does UNKNOWN stay.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the BOOLEAN type exists, and a NULL boolean is exactly UNKNOWN, so the table is written directly (NULL shows where the slide says UNKNOWN):
<pre><code class="language-sql">-- PostgreSQL has BOOLEAN, and NULL::boolean is UNKNOWN
WITH v(b) AS (VALUES (TRUE), (NULL::boolean), (FALSE))
SELECT x.b AS x, y.b AS y, x.b AND y.b AS "x AND y", x.b OR y.b AS "x OR y", NOT x.b AS "NOT x"
FROM v AS x CROSS JOIN v AS y
ORDER BY COALESCE(x.b::int, 0.5) DESC, COALESCE(y.b::int, 0.5) DESC;</code></pre>
<table>
<thead><tr><th>x</th><th>y</th><th>x AND y</th><th>x OR y</th><th>NOT x</th></tr></thead>
<tbody>
<tr><td>t</td><td>t</td><td>t</td><td>t</td><td>f</td></tr>
<tr><td>t</td><td><em>NULL</em></td><td><em>NULL</em></td><td>t</td><td>f</td></tr>
<tr><td>t</td><td>f</td><td>f</td><td>t</td><td>f</td></tr>
<tr><td><em>NULL</em></td><td>t</td><td><em>NULL</em></td><td>t</td><td><em>NULL</em></td></tr>
<tr><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
<tr><td><em>NULL</em></td><td>f</td><td>f</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
<tr><td>f</td><td>t</td><td>f</td><td>t</td><td>t</td></tr>
<tr><td>f</td><td><em>NULL</em></td><td>f</td><td><em>NULL</em></td><td>t</td></tr>
<tr><td>f</td><td>f</td><td>f</td><td>f</td><td>t</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-2-select-where">PostgreSQL 4.2 — SELECT … WHERE</a>.</div>`,
        `<p class="y-chinh">🎯 Lô-gic của SQL có ba giá trị: TRUE = 1, FALSE = 0, UNKNOWN = ½, với x AND y = MIN(x, y), x OR y = MAX(x, y), NOT x = 1 − x.</p>
<p>Bảng chân trị (truth table) trên slide, do chính SQL Server tính ra: x và y là điều kiện <code>v = 1</code>, trong đó v là 1 (TRUE), 0 (FALSE) hoặc NULL (UNKNOWN):</p>
<pre><code class="language-sql">-- x và y là điều kiện "v = 1": 1 → TRUE, 0 → FALSE, NULL → UNKNOWN
WITH v(n) AS (SELECT 1 UNION ALL SELECT 0 UNION ALL SELECT NULL)
SELECT CASE WHEN x.n = 1 THEN 'TRUE' WHEN NOT (x.n = 1) THEN 'FALSE' ELSE 'UNKNOWN' END AS x,
       CASE WHEN y.n = 1 THEN 'TRUE' WHEN NOT (y.n = 1) THEN 'FALSE' ELSE 'UNKNOWN' END AS y,
       CASE WHEN x.n = 1 AND y.n = 1 THEN 'TRUE' WHEN NOT (x.n = 1 AND y.n = 1) THEN 'FALSE' ELSE 'UNKNOWN' END AS [x AND y],
       CASE WHEN x.n = 1 OR y.n = 1  THEN 'TRUE' WHEN NOT (x.n = 1 OR y.n = 1)  THEN 'FALSE' ELSE 'UNKNOWN' END AS [x OR y],
       CASE WHEN NOT (x.n = 1) THEN 'TRUE' WHEN x.n = 1 THEN 'FALSE' ELSE 'UNKNOWN' END AS [NOT x]
FROM v AS x CROSS JOIN v AS y
ORDER BY COALESCE(x.n, 0.5) DESC, COALESCE(y.n, 0.5) DESC;</code></pre>
<table>
<thead><tr><th>x</th><th>y</th><th>x AND y</th><th>x OR y</th><th>NOT x</th></tr></thead>
<tbody>
<tr><td>TRUE</td><td>TRUE</td><td>TRUE</td><td>TRUE</td><td>FALSE</td></tr>
<tr><td>TRUE</td><td>UNKNOWN</td><td>UNKNOWN</td><td>TRUE</td><td>FALSE</td></tr>
<tr><td>TRUE</td><td>FALSE</td><td>FALSE</td><td>TRUE</td><td>FALSE</td></tr>
<tr><td>UNKNOWN</td><td>TRUE</td><td>UNKNOWN</td><td>TRUE</td><td>UNKNOWN</td></tr>
<tr><td>UNKNOWN</td><td>UNKNOWN</td><td>UNKNOWN</td><td>UNKNOWN</td><td>UNKNOWN</td></tr>
<tr><td>UNKNOWN</td><td>FALSE</td><td>FALSE</td><td>UNKNOWN</td><td>UNKNOWN</td></tr>
<tr><td>FALSE</td><td>TRUE</td><td>FALSE</td><td>TRUE</td><td>TRUE</td></tr>
<tr><td>FALSE</td><td>UNKNOWN</td><td>FALSE</td><td>UNKNOWN</td><td>TRUE</td></tr>
<tr><td>FALSE</td><td>FALSE</td><td>FALSE</td><td>FALSE</td><td>TRUE</td></tr>
</tbody>
</table>
<p>Kiểm hai dòng bằng số: TRUE AND UNKNOWN = MIN(1, ½) = ½ = UNKNOWN; FALSE OR UNKNOWN = MAX(0, ½) = UNKNOWN; NOT UNKNOWN = 1 − ½ = UNKNOWN.</p>
<p class="meo">🧠 FALSE thắng trong AND, TRUE thắng trong OR, bất kể vế kia là gì. Chỉ khi vắng "kẻ thắng" thì mới còn UNKNOWN.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> có kiểu BOOLEAN, và một boolean NULL chính là UNKNOWN, nên bảng viết thẳng ra được (chỗ slide ghi UNKNOWN thì ở đây hiện NULL):
<pre><code class="language-sql">-- PostgreSQL có BOOLEAN, và NULL::boolean chính là UNKNOWN
WITH v(b) AS (VALUES (TRUE), (NULL::boolean), (FALSE))
SELECT x.b AS x, y.b AS y, x.b AND y.b AS "x AND y", x.b OR y.b AS "x OR y", NOT x.b AS "NOT x"
FROM v AS x CROSS JOIN v AS y
ORDER BY COALESCE(x.b::int, 0.5) DESC, COALESCE(y.b::int, 0.5) DESC;</code></pre>
<table>
<thead><tr><th>x</th><th>y</th><th>x AND y</th><th>x OR y</th><th>NOT x</th></tr></thead>
<tbody>
<tr><td>t</td><td>t</td><td>t</td><td>t</td><td>f</td></tr>
<tr><td>t</td><td><em>NULL</em></td><td><em>NULL</em></td><td>t</td><td>f</td></tr>
<tr><td>t</td><td>f</td><td>f</td><td>t</td><td>f</td></tr>
<tr><td><em>NULL</em></td><td>t</td><td><em>NULL</em></td><td>t</td><td><em>NULL</em></td></tr>
<tr><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
<tr><td><em>NULL</em></td><td>f</td><td>f</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
<tr><td>f</td><td>t</td><td>f</td><td>t</td><td>t</td></tr>
<tr><td>f</td><td><em>NULL</em></td><td>f</td><td><em>NULL</em></td><td>t</td></tr>
<tr><td>f</td><td>f</td><td>f</td><td>f</td><td>t</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-2-select-where">PostgreSQL 4.2 — SELECT … WHERE</a>.</div>`],
      [14, 'The Truth-Value Unknown - in the WHERE clause',
        `<p class="y-chinh">🎯 WHERE keeps a row only when its condition is TRUE; rows whose condition is FALSE <strong>or UNKNOWN</strong> are dropped.</p>
<p>This is why slide 8's NOT LIKE query showed 8 employees out of 14:</p>
<pre><code class="language-sql">-- LIKE + NOT LIKE do not cover every row: the UNKNOWN rows fall out of both
SELECT (SELECT COUNT(*) FROM tblEmployee)                                    AS [tổng],
       (SELECT COUNT(*) FROM tblEmployee WHERE empAddress LIKE N'%Hà Nội')     AS [LIKE],
       (SELECT COUNT(*) FROM tblEmployee WHERE empAddress NOT LIKE N'%Hà Nội') AS [NOT LIKE],
       (SELECT COUNT(*) FROM tblEmployee WHERE empAddress IS NULL)            AS [IS NULL];</code></pre>
<table>
<thead><tr><th>tổng</th><th>LIKE</th><th>NOT LIKE</th><th>IS NULL</th></tr></thead>
<tbody>
<tr><td>14</td><td>5</td><td>8</td><td>1</td></tr>
</tbody>
</table>
<p>5 + 8 = 13, not 14: for Bùi Văn Nam (address NULL) both <code>LIKE</code> and <code>NOT LIKE</code> are UNKNOWN, so he is in neither list.</p>
<p>The famous trap with NOT IN:</p>
<pre><code class="language-sql">-- Trap: NOT IN against a list that contains NULL returns nothing
SELECT empSSN, empName
FROM tblEmployee
WHERE empSSN NOT IN (SELECT supervisorSSN FROM tblEmployee);
-- Fix: remove the NULLs from the list
SELECT empSSN, empName
FROM tblEmployee
WHERE empSSN NOT IN (SELECT supervisorSSN FROM tblEmployee WHERE supervisorSSN IS NOT NULL)
ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td></tr>
<tr><td>30121050021</td><td>Bùi Văn Nam</td></tr>
<tr><td>30121050027</td><td>Trương Thị Thu</td></tr>
<tr><td>30121050030</td><td>Huỳnh Văn Tài</td></tr>
<tr><td>30121050038</td><td>Phan Hữu Nghĩa</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Why 0 rows? The list of supervisorSSN contains a NULL (the director has no supervisor). For employee 003, <code>003 NOT IN (001, 002, 010, …, NULL)</code> means <code>003 &lt;&gt; 001 AND … AND 003 &lt;&gt; NULL</code>; the last part is UNKNOWN, and TRUE AND UNKNOWN = UNKNOWN — so no row is ever TRUE. Removing the NULLs (<code>WHERE supervisorSSN IS NOT NULL</code>) gives the 9 employees who supervise nobody.</p>
<div class="pitfall">Whenever a subquery after <code>NOT IN</code> can return NULL, the whole query can silently return nothing. Use <code>NOT EXISTS</code> or add <code>IS NOT NULL</code> (Chapter 6 lesson 6.4). PostgreSQL behaves exactly the same way.</div>`,
        `<p class="y-chinh">🎯 WHERE chỉ giữ một dòng khi điều kiện của nó là TRUE; dòng có điều kiện FALSE <strong>hoặc UNKNOWN</strong> đều bị loại.</p>
<p>Đây là lý do câu NOT LIKE ở slide 8 chỉ ra 8 trên 14 nhân viên:</p>
<pre><code class="language-sql">-- LIKE + NOT LIKE không phủ hết: dòng UNKNOWN rơi khỏi cả hai
SELECT (SELECT COUNT(*) FROM tblEmployee)                                    AS [tổng],
       (SELECT COUNT(*) FROM tblEmployee WHERE empAddress LIKE N'%Hà Nội')     AS [LIKE],
       (SELECT COUNT(*) FROM tblEmployee WHERE empAddress NOT LIKE N'%Hà Nội') AS [NOT LIKE],
       (SELECT COUNT(*) FROM tblEmployee WHERE empAddress IS NULL)            AS [IS NULL];</code></pre>
<table>
<thead><tr><th>tổng</th><th>LIKE</th><th>NOT LIKE</th><th>IS NULL</th></tr></thead>
<tbody>
<tr><td>14</td><td>5</td><td>8</td><td>1</td></tr>
</tbody>
</table>
<p>5 + 8 = 13, không phải 14: với Bùi Văn Nam (địa chỉ NULL) cả <code>LIKE</code> lẫn <code>NOT LIKE</code> đều là UNKNOWN, nên anh không có mặt ở danh sách nào.</p>
<p>Cái bẫy nổi tiếng với NOT IN:</p>
<pre><code class="language-sql">-- Bẫy: NOT IN với danh sách có NULL không trả về gì
SELECT empSSN, empName
FROM tblEmployee
WHERE empSSN NOT IN (SELECT supervisorSSN FROM tblEmployee);
-- Sửa: bỏ NULL ra khỏi danh sách
SELECT empSSN, empName
FROM tblEmployee
WHERE empSSN NOT IN (SELECT supervisorSSN FROM tblEmployee WHERE supervisorSSN IS NOT NULL)
ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td></tr>
<tr><td>30121050021</td><td>Bùi Văn Nam</td></tr>
<tr><td>30121050027</td><td>Trương Thị Thu</td></tr>
<tr><td>30121050030</td><td>Huỳnh Văn Tài</td></tr>
<tr><td>30121050038</td><td>Phan Hữu Nghĩa</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Vì sao 0 dòng? Danh sách supervisorSSN có một NULL (giám đốc không có người giám sát). Với nhân viên 003, <code>003 NOT IN (001, 002, 010, …, NULL)</code> nghĩa là <code>003 &lt;&gt; 001 AND … AND 003 &lt;&gt; NULL</code>; vế cuối là UNKNOWN, mà TRUE AND UNKNOWN = UNKNOWN — nên không dòng nào TRUE cả. Bỏ NULL đi (<code>WHERE supervisorSSN IS NOT NULL</code>) thì ra đúng 9 nhân viên không giám sát ai.</p>
<div class="pitfall">Hễ truy vấn con sau <code>NOT IN</code> có thể trả NULL là cả câu có thể lặng lẽ không ra gì. Dùng <code>NOT EXISTS</code> hoặc thêm <code>IS NOT NULL</code> (Chương 6, bài 6.4). PostgreSQL cư xử y hệt.</div>`],
    ]),
    books([
      ['ullman', 'Ullman &amp; Widom, A First Course in Database Systems — 6.1.3–6.1.7 (strings, LIKE, dates, NULL, UNKNOWN), 7.1–7.2 (keys, attribute constraints)', 'Ullman &amp; Widom, A First Course in Database Systems — 6.1.3–6.1.7 (chuỗi, LIKE, ngày giờ, NULL, UNKNOWN), 7.1–7.2 (khoá, ràng buộc thuộc tính)'],
      ['ramakrishnan', 'Ramakrishnan, Database Management Systems — 3.2 (integrity constraints), 5.2.4 and 5.6 (LIKE, NULL values)', 'Ramakrishnan, Database Management Systems — 3.2 (ràng buộc toàn vẹn), 5.2.4 và 5.6 (LIKE, giá trị NULL)'],
    ]),
  ].join('\n'),
};

/* ───────── 5.B — 📑 Slide by slide · SQL DDL: CREATE, ALTER, DROP & the FUHCompany diagram (Chapter 6, slides 15–21) ───────── */
const L_dbi7_2 = {
  title: '5.B — 📑 Slide by slide · SQL DDL: CREATE, ALTER, DROP & the FUHCompany diagram (Chapter 6, slides 15–21)|||5.B — 📑 Học theo từng slide · SQL DDL: CREATE, ALTER, DROP & sơ đồ FUHCompany (Chapter 6, slide 15–21)',
  slug: 'dbi202-slide-dbi7-2',
  type: 'VIDEO',
  description: 'Giảng từng slide 15–21 của bộ slide Chapter 6 của trường: SQL và các phương ngữ (T-SQL, PL/SQL), CREATE DATABASE / CREATE TABLE với ràng buộc mức cột và mức bảng, chạy lại đúng bản demo EmpManagement (IDENTITY, CHECK tuổi, UNIQUE, DEFAULT) và thử vi phạm, ALTER TABLE thêm/sửa/xoá cột và ràng buộc, DROP TABLE/DATABASE, sơ đồ vật lý FUHCompany nối với ERD — mọi câu chạy thật, ô 🐘 PostgreSQL cho IDENTITY, ALTER COLUMN, sp_rename, DROP … CASCADE.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.B · school slides "Chapter 6", slides 15–21</span>
<h2>SQL DDL — creating, changing and dropping tables, slide by slide</h2>
<p class="lead">Slides 15–21 are the DDL (Data Definition Language) part of the school's "Chapter 6" deck: how to create a database and its tables with every constraint of slide 6, how to change a table that already holds data, how to drop it, and the physical diagram of FUHCompany that the rest of the course queries. This is exactly PE question 1.</p>
<div class="callout"><strong>After this lesson you can:</strong> read and write <code>CREATE TABLE</code> with PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, DEFAULT, NOT NULL and IDENTITY; name your constraints; add, change and remove columns and constraints with <code>ALTER TABLE</code>; drop tables in the right order; and translate each of these statements to PostgreSQL.</div>
<table>
<thead><tr><th>Slide</th><th>Statement</th><th>One-line meaning</th></tr></thead>
<tbody>
<tr><td>15</td><td>—</td><td>SQL is a standard with dialects: T-SQL (SQL Server), PL/SQL (Oracle), PL/pgSQL (PostgreSQL)</td></tr>
<tr><td>16</td><td><code>CREATE DATABASE</code>, <code>CREATE TABLE</code></td><td>make an empty database; make a table with columns, types and constraints</td></tr>
<tr><td>17</td><td>demo</td><td>the table EmpManagement.tblEmployee, run and tested</td></tr>
<tr><td>18</td><td><code>ALTER TABLE … ADD / DROP COLUMN / ALTER COLUMN</code></td><td>change the columns of an existing table</td></tr>
<tr><td>19</td><td><code>ALTER TABLE … ADD / DROP CONSTRAINT</code></td><td>add or remove a rule later</td></tr>
<tr><td>20</td><td><code>DROP TABLE</code>, <code>DROP DATABASE</code></td><td>delete the structure and all its data</td></tr>
<tr><td>21</td><td>diagram</td><td>the 7 tables of FUHCompany and their foreign keys</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.B · slide "Chapter 6" của trường, slide 15–21</span>
<h2>SQL DDL — tạo, sửa và xoá bảng, học từng slide</h2>
<p class="lead">Slide 15–21 là phần DDL (Data Definition Language — ngôn ngữ định nghĩa dữ liệu) của bộ "Chapter 6": cách tạo database và các bảng với đủ mọi ràng buộc của slide 6, cách sửa một bảng đang có dữ liệu, cách xoá nó, và sơ đồ vật lý của FUHCompany mà cả phần còn lại của môn sẽ truy vấn. Đây đúng là câu 1 của đề PE.</p>
<div class="callout"><strong>Học xong bài này bạn làm được:</strong> đọc và viết <code>CREATE TABLE</code> với PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, DEFAULT, NOT NULL và IDENTITY; đặt tên cho ràng buộc; thêm, sửa, xoá cột và ràng buộc bằng <code>ALTER TABLE</code>; xoá bảng đúng thứ tự; và dịch từng câu sang PostgreSQL.</div>
<table>
<thead><tr><th>Slide</th><th>Câu lệnh</th><th>Nghĩa một dòng</th></tr></thead>
<tbody>
<tr><td>15</td><td>—</td><td>SQL là chuẩn có nhiều phương ngữ: T-SQL (SQL Server), PL/SQL (Oracle), PL/pgSQL (PostgreSQL)</td></tr>
<tr><td>16</td><td><code>CREATE DATABASE</code>, <code>CREATE TABLE</code></td><td>tạo database rỗng; tạo bảng với cột, kiểu và ràng buộc</td></tr>
<tr><td>17</td><td>demo</td><td>bảng EmpManagement.tblEmployee, chạy và thử</td></tr>
<tr><td>18</td><td><code>ALTER TABLE … ADD / DROP COLUMN / ALTER COLUMN</code></td><td>đổi các cột của bảng đã có</td></tr>
<tr><td>19</td><td><code>ALTER TABLE … ADD / DROP CONSTRAINT</code></td><td>thêm hay bỏ một luật về sau</td></tr>
<tr><td>20</td><td><code>DROP TABLE</code>, <code>DROP DATABASE</code></td><td>xoá cấu trúc cùng toàn bộ dữ liệu</td></tr>
<tr><td>21</td><td>sơ đồ</td><td>7 bảng của FUHCompany và các khoá ngoại</td></tr>
</tbody>
</table>`),
    walkHead('dbi7', 15, 21),
    walk('dbi7', [
      [15, 'SQL Overview',
        `<p class="y-chinh">🎯 SQL is the standard language of relational DBMSs, born from relational algebra; every vendor adds its own dialect on top of the standard.</p>
<table>
<thead><tr><th>Name</th><th>What it is</th></tr></thead>
<tbody>
<tr><td>ANSI SQL-86, SQL-92, SQL-99, SQL:2003 … SQL:2009</td><td>successive versions of the standard</td></tr>
<tr><td>T-SQL (Transact-SQL)</td><td>Microsoft's (and Sybase's) extension — what SQL Server, SSMS and the PE use</td></tr>
<tr><td>PL/SQL</td><td>Oracle's procedural extension</td></tr>
<tr><td>PL/pgSQL</td><td>PostgreSQL's procedural language (not on the slide; what you will meet at work)</td></tr>
</tbody>
</table>
<p>The core (SELECT, INSERT, CREATE TABLE, keys…) is the same everywhere; the dialects differ in details: data types, functions, how to take "the first n rows", how to write loops. One visible example — the 3 best-paid employees in T-SQL:</p>
<pre><code class="language-sql">-- T-SQL dialect: TOP n picks the first n rows
SELECT TOP 3 empName, empSalary
FROM tblEmployee
ORDER BY empSalary DESC;</code></pre>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the same question uses <code>LIMIT</code> at the end instead of <code>TOP</code> after SELECT (also valid in MySQL and SQLite; <code>TOP</code> exists only in SQL Server):
<pre><code class="language-sql">-- PostgreSQL dialect: LIMIT n at the end
SELECT empName, empSalary
FROM tblEmployee
ORDER BY empSalary DESC
LIMIT 3;</code></pre>
<table>
<thead><tr><th>empname</th><th>empsalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT, DISTINCT</a>.</div>
<p class="meo">🧠 Learn the standard first, then the few dialect differences — the 🐘 boxes of this course list exactly those.</p>`,
        `<p class="y-chinh">🎯 SQL là ngôn ngữ chuẩn của các DBMS quan hệ, sinh ra từ đại số quan hệ; hãng nào cũng thêm phương ngữ (dialect) riêng lên trên chuẩn.</p>
<table>
<thead><tr><th>Tên</th><th>Là gì</th></tr></thead>
<tbody>
<tr><td>ANSI SQL-86, SQL-92, SQL-99, SQL:2003 … SQL:2009</td><td>các phiên bản nối tiếp của chuẩn</td></tr>
<tr><td>T-SQL (Transact-SQL)</td><td>phần mở rộng của Microsoft (và Sybase) — thứ SQL Server, SSMS và bài PE dùng</td></tr>
<tr><td>PL/SQL</td><td>phần mở rộng thủ tục của Oracle</td></tr>
<tr><td>PL/pgSQL</td><td>ngôn ngữ thủ tục của PostgreSQL (không có trên slide; thứ bạn gặp khi đi làm)</td></tr>
</tbody>
</table>
<p>Phần lõi (SELECT, INSERT, CREATE TABLE, khoá…) chỗ nào cũng giống nhau; các phương ngữ khác ở chi tiết: kiểu dữ liệu, hàm, cách lấy "n dòng đầu", cách viết vòng lặp. Một ví dụ dễ thấy — 3 nhân viên lương cao nhất, viết bằng T-SQL:</p>
<pre><code class="language-sql">-- Phương ngữ T-SQL: TOP n lấy n dòng đầu
SELECT TOP 3 empName, empSalary
FROM tblEmployee
ORDER BY empSalary DESC;</code></pre>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> cùng câu hỏi đó dùng <code>LIMIT</code> ở cuối câu thay cho <code>TOP</code> sau SELECT (MySQL, SQLite cũng dùng LIMIT; <code>TOP</code> chỉ SQL Server có):
<pre><code class="language-sql">-- Phương ngữ PostgreSQL: LIMIT n ở cuối câu
SELECT empName, empSalary
FROM tblEmployee
ORDER BY empSalary DESC
LIMIT 3;</code></pre>
<table>
<thead><tr><th>empname</th><th>empsalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT, DISTINCT</a>.</div>
<p class="meo">🧠 Học chuẩn trước, rồi học vài chỗ khác nhau của phương ngữ — các ô 🐘 trong môn này liệt kê đúng những chỗ đó.</p>`],
      [16, 'Data Definition Language - CREATE',
        `<p class="y-chinh">🎯 <code>CREATE DATABASE dbname</code> makes an empty database; <code>CREATE TABLE t (column type [constraints], …)</code> makes a table — one line per column, each with a data type and optional constraints.</p>
<p>A constraint can be written in two places:</p>
<table>
<thead><tr><th>Place</th><th>Looks like</th><th>Good for</th></tr></thead>
<tbody>
<tr><td>column level — right after the column</td><td><code>locNum INT PRIMARY KEY</code></td><td>a rule on one column; quick to type</td></tr>
<tr><td>table level — after all columns</td><td><code>CONSTRAINT pk_deplocation PRIMARY KEY (depNum, locNum)</code></td><td>a rule on <strong>several</strong> columns (composite key), and giving the rule a name</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- Column-level constraints: written right after the column
CREATE TABLE tblLocation (
    locNum   INT          PRIMARY KEY,
    locName  NVARCHAR(50) NOT NULL UNIQUE
);
-- Table-level constraints: written after all columns, with a name
CREATE TABLE tblDepLocation (
    depNum  INT NOT NULL,
    locNum  INT NOT NULL,
    CONSTRAINT pk_deplocation          PRIMARY KEY (depNum, locNum),
    CONSTRAINT fk_deplocation_location FOREIGN KEY (locNum) REFERENCES tblLocation (locNum)
);
-- Check what was created
SELECT TABLE_NAME, CONSTRAINT_NAME, CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
ORDER BY TABLE_NAME, CONSTRAINT_TYPE;</code></pre>
<table>
<thead><tr><th>TABLE_NAME</th><th>CONSTRAINT_NAME</th><th>CONSTRAINT_TYPE</th></tr></thead>
<tbody>
<tr><td>tblDepLocation</td><td>fk_deplocation_location</td><td>FOREIGN KEY</td></tr>
<tr><td>tblDepLocation</td><td>pk_deplocation</td><td>PRIMARY KEY</td></tr>
<tr><td>tblLocation</td><td>PK__tblLocat__72825CA6EFD868E6</td><td>PRIMARY KEY</td></tr>
<tr><td>tblLocation</td><td>UQ__tblLocat__91A825F299ED22DD</td><td>UNIQUE</td></tr>
</tbody>
</table>
<ul>
<li><code>INT</code> = whole number; <code>NVARCHAR(50)</code> = Unicode text of at most 50 characters.</li>
<li><code>CONSTRAINT pk_deplocation PRIMARY KEY (depNum, locNum)</code> — the pair is the key: the same department may have many locations, but each (department, location) pair once.</li>
<li><code>FOREIGN KEY (locNum) REFERENCES tblLocation (locNum)</code> — every locNum here must exist in tblLocation, so tblLocation must be created <strong>first</strong>.</li>
<li><code>INFORMATION_SCHEMA.TABLE_CONSTRAINTS</code> — a standard system view listing every constraint.</li>
</ul>
<p>Look at the names: the two constraints written at column level without a name got <code>PK__tblLocat__…</code> and <code>UQ__tblLocat__…</code>, the named ones are readable.</p>
<div class="pitfall">A composite key must be declared at table level: writing <code>depNum INT PRIMARY KEY, locNum INT PRIMARY KEY</code> is an error ("cannot add multiple PRIMARY KEY constraints"). And a child table cannot be created before its parent.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the statements are identical except the type (<code>VARCHAR</code> instead of <code>NVARCHAR</code>); the automatic names are readable (<code>tbllocation_pkey</code>, <code>tbllocation_locname_key</code>) and table names are stored in lower case. Creating a database is a separate command (<code>CREATE DATABASE fuhcompany;</code> then <code>\\c fuhcompany</code> in psql):
<pre><code class="language-sql">-- Same CREATE TABLE, only NVARCHAR becomes VARCHAR
CREATE TABLE tblLocation (
    locNum   INT         PRIMARY KEY,
    locName  VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE tblDepLocation (
    depNum  INT NOT NULL,
    locNum  INT NOT NULL,
    CONSTRAINT pk_deplocation          PRIMARY KEY (depNum, locNum),
    CONSTRAINT fk_deplocation_location FOREIGN KEY (locNum) REFERENCES tblLocation (locNum)
);
SELECT table_name, constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND constraint_type &lt;&gt; 'CHECK'
ORDER BY table_name, constraint_type;</code></pre>
<table>
<thead><tr><th>table_name</th><th>constraint_name</th><th>constraint_type</th></tr></thead>
<tbody>
<tr><td>tbldeplocation</td><td>fk_deplocation_location</td><td>FOREIGN KEY</td></tr>
<tr><td>tbldeplocation</td><td>pk_deplocation</td><td>PRIMARY KEY</td></tr>
<tr><td>tbllocation</td><td>tbllocation_pkey</td><td>PRIMARY KEY</td></tr>
<tr><td>tbllocation</td><td>tbllocation_locname_key</td><td>UNIQUE</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-1-khoa-chinh">PostgreSQL 3.1 — primary keys</a>.</div>`,
        `<p class="y-chinh">🎯 <code>CREATE DATABASE tên</code> tạo một database rỗng; <code>CREATE TABLE t (cột kiểu [ràng buộc], …)</code> tạo một bảng — mỗi cột một dòng, có kiểu dữ liệu và có thể kèm ràng buộc.</p>
<p>Ràng buộc viết được ở hai chỗ:</p>
<table>
<thead><tr><th>Chỗ viết</th><th>Trông như</th><th>Hợp với</th></tr></thead>
<tbody>
<tr><td>mức cột (column level) — ngay sau cột</td><td><code>locNum INT PRIMARY KEY</code></td><td>luật trên một cột; gõ nhanh</td></tr>
<tr><td>mức bảng (table level) — sau mọi cột</td><td><code>CONSTRAINT pk_deplocation PRIMARY KEY (depNum, locNum)</code></td><td>luật trên <strong>nhiều</strong> cột (khoá ghép — composite key), và khi muốn đặt tên cho luật</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- Ràng buộc mức cột: viết ngay sau cột
CREATE TABLE tblLocation (
    locNum   INT          PRIMARY KEY,
    locName  NVARCHAR(50) NOT NULL UNIQUE
);
-- Ràng buộc mức bảng: viết sau mọi cột, có đặt tên
CREATE TABLE tblDepLocation (
    depNum  INT NOT NULL,
    locNum  INT NOT NULL,
    CONSTRAINT pk_deplocation          PRIMARY KEY (depNum, locNum),
    CONSTRAINT fk_deplocation_location FOREIGN KEY (locNum) REFERENCES tblLocation (locNum)
);
-- Kiểm tra những gì đã được tạo
SELECT TABLE_NAME, CONSTRAINT_NAME, CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
ORDER BY TABLE_NAME, CONSTRAINT_TYPE;</code></pre>
<table>
<thead><tr><th>TABLE_NAME</th><th>CONSTRAINT_NAME</th><th>CONSTRAINT_TYPE</th></tr></thead>
<tbody>
<tr><td>tblDepLocation</td><td>fk_deplocation_location</td><td>FOREIGN KEY</td></tr>
<tr><td>tblDepLocation</td><td>pk_deplocation</td><td>PRIMARY KEY</td></tr>
<tr><td>tblLocation</td><td>PK__tblLocat__72825CA6EFD868E6</td><td>PRIMARY KEY</td></tr>
<tr><td>tblLocation</td><td>UQ__tblLocat__91A825F299ED22DD</td><td>UNIQUE</td></tr>
</tbody>
</table>
<ul>
<li><code>INT</code> = số nguyên; <code>NVARCHAR(50)</code> = chuỗi Unicode dài tối đa 50 ký tự.</li>
<li><code>CONSTRAINT pk_deplocation PRIMARY KEY (depNum, locNum)</code> — cả cặp là khoá: một phòng có thể có nhiều địa điểm, nhưng mỗi cặp (phòng, địa điểm) chỉ một lần.</li>
<li><code>FOREIGN KEY (locNum) REFERENCES tblLocation (locNum)</code> — mọi locNum ở đây phải có trong tblLocation, nên tblLocation phải được tạo <strong>trước</strong>.</li>
<li><code>INFORMATION_SCHEMA.TABLE_CONSTRAINTS</code> — view hệ thống theo chuẩn, liệt kê mọi ràng buộc.</li>
</ul>
<p>Nhìn các tên: hai ràng buộc viết ở mức cột không đặt tên bị gán <code>PK__tblLocat__…</code> và <code>UQ__tblLocat__…</code>, còn ràng buộc có tên thì đọc được ngay.</p>
<div class="pitfall">Khoá ghép phải khai báo ở mức bảng: viết <code>depNum INT PRIMARY KEY, locNum INT PRIMARY KEY</code> là lỗi ("không thể thêm nhiều ràng buộc PRIMARY KEY"). Và không tạo được bảng con trước bảng cha.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> câu lệnh y hệt, chỉ khác kiểu (<code>VARCHAR</code> thay cho <code>NVARCHAR</code>); tên tự sinh dễ đọc (<code>tbllocation_pkey</code>, <code>tbllocation_locname_key</code>) và tên bảng được lưu chữ thường. Tạo database là một lệnh riêng (<code>CREATE DATABASE fuhcompany;</code> rồi <code>\\c fuhcompany</code> trong psql):
<pre><code class="language-sql">-- Cùng CREATE TABLE, chỉ đổi NVARCHAR thành VARCHAR
CREATE TABLE tblLocation (
    locNum   INT         PRIMARY KEY,
    locName  VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE tblDepLocation (
    depNum  INT NOT NULL,
    locNum  INT NOT NULL,
    CONSTRAINT pk_deplocation          PRIMARY KEY (depNum, locNum),
    CONSTRAINT fk_deplocation_location FOREIGN KEY (locNum) REFERENCES tblLocation (locNum)
);
SELECT table_name, constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND constraint_type &lt;&gt; 'CHECK'
ORDER BY table_name, constraint_type;</code></pre>
<table>
<thead><tr><th>table_name</th><th>constraint_name</th><th>constraint_type</th></tr></thead>
<tbody>
<tr><td>tbldeplocation</td><td>fk_deplocation_location</td><td>FOREIGN KEY</td></tr>
<tr><td>tbldeplocation</td><td>pk_deplocation</td><td>PRIMARY KEY</td></tr>
<tr><td>tbllocation</td><td>tbllocation_pkey</td><td>PRIMARY KEY</td></tr>
<tr><td>tbllocation</td><td>tbllocation_locname_key</td><td>UNIQUE</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-1-khoa-chinh">PostgreSQL 3.1 — khoá chính</a>.</div>`],
      [17, 'Data Definition Language - Demo',
        `<p class="y-chinh">🎯 The demo creates database EmpManagement and a table tblEmployee that uses IDENTITY, NOT NULL, CHECK, UNIQUE and DEFAULT in one statement.</p>
<p>The code of the slide, run as is:</p>
<pre><code class="language-sql">CREATE DATABASE EmpManagement;
GO
USE EmpManagement;
GO
CREATE TABLE tblEmployee
    (IdEmp INT identity(1,1) PRIMARY KEY,
     EmpName nvarchar(50) NOT NULL,
     DOB date CHECK(year(getdate())-year(DOB)&gt;=18),
     PhoneNo char(12) Unique,
     Addr nvarchar(50) DEFAULT N'Hồ Chí Minh'
    );
GO</code></pre>
<table>
<thead><tr><th>Line</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>CREATE DATABASE EmpManagement;</code> then <code>USE EmpManagement;</code></td><td>create the database, then make it the current one (every following statement works inside it)</td></tr>
<tr><td><code>IdEmp INT identity(1,1) PRIMARY KEY</code></td><td>IDENTITY(seed, step): SQL Server fills the number itself — 1, 2, 3…; it is also the primary key</td></tr>
<tr><td><code>EmpName nvarchar(50) NOT NULL</code></td><td>the name is compulsory</td></tr>
<tr><td><code>DOB date CHECK(year(getdate())-year(DOB)&gt;=18)</code></td><td>the employee must be at least 18 "by year" (slide 11)</td></tr>
<tr><td><code>PhoneNo char(12) Unique</code></td><td>no two employees share a phone number; <code>CHAR(12)</code> pads to 12 characters</td></tr>
<tr><td><code>Addr nvarchar(50) DEFAULT N'Hồ Chí Minh'</code></td><td>if the INSERT gives no address, this one is stored</td></tr>
</tbody>
</table>
<p>Now four inserts — one valid, two that break a rule, one valid again:</p>
<pre><code class="language-sql">-- 1. Valid row: IdEmp and Addr are filled automatically
INSERT INTO tblEmployee (EmpName, DOB, PhoneNo) VALUES (N'Nguyễn Văn A', '2000-01-01', '0901000001');
GO
-- 2. Under 18: breaks the CHECK
INSERT INTO tblEmployee (EmpName, DOB, PhoneNo) VALUES (N'Trần Thị B', '2015-06-01', '0901000002');
GO
-- 3. Same phone number: breaks UNIQUE
INSERT INTO tblEmployee (EmpName, DOB, PhoneNo) VALUES (N'Lê Văn C', '1999-03-03', '0901000001');
GO
-- 4. Valid row with its own address
INSERT INTO tblEmployee (EmpName, DOB, PhoneNo, Addr) VALUES (N'Phạm Thị D', '1998-12-12', '0901000004', N'Hà Nội');
GO
SELECT * FROM tblEmployee;
GO</code></pre>
<div class="out">Changed database context to 'EmpManagement'.<br>
(1 row affected)<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "CK__tblEmployee__DOB__69EE134A". The conflict occurred in database "EmpManagement", table "dbo.tblEmployee", column 'DOB'.</b><br>
The statement has been terminated.<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of UNIQUE KEY constraint 'UQ__tblEmplo__1ED98F0D76C71483'. Cannot insert duplicate key in object 'dbo.tblEmployee'. The duplicate key value is (0901000001  ).</b><br>
The statement has been terminated.<br>
(1 row affected)</div>
<table>
<thead><tr><th>IdEmp</th><th>EmpName</th><th>DOB</th><th>PhoneNo</th><th>Addr</th></tr></thead>
<tbody>
<tr><td>1</td><td>Nguyễn Văn A</td><td>2000-01-01</td><td>0901000001  </td><td>Hồ Chí Minh</td></tr>
<tr><td>4</td><td>Phạm Thị D</td><td>1998-12-12</td><td>0901000004  </td><td>Hà Nội</td></tr>
</tbody>
</table>
<div class="out">Changed database context to 'master'.</div>
<ul>
<li>Row 1 got IdEmp = 1 and Addr = 'Hồ Chí Minh' without asking.</li>
<li>Row 2 (born 2015) broke the CHECK; row 3 reused the phone number and broke UNIQUE — both refused.</li>
<li>The last valid row got IdEmp = <strong>4</strong>, not 2: every refused insert still consumed an identity number. Gaps are normal; never use IDENTITY as a "count".</li>
<li><code>PhoneNo</code> shows trailing spaces: CHAR(12) pads the value.</li>
</ul>
<div class="pitfall">The constraint names in the errors (<code>CK__tblEmployee__DOB__…</code>, <code>UQ__tblEmplo__…</code>) are random because the demo does not name them. In an INSERT you never give a value for an IDENTITY column (it causes an error unless <code>SET IDENTITY_INSERT … ON</code>).</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> IDENTITY is written <code>GENERATED ALWAYS AS IDENTITY</code>, <code>getdate()</code> becomes <code>CURRENT_DATE</code>, <code>year(x)</code> becomes <code>EXTRACT(YEAR FROM x)</code>, no N prefix:
<pre><code class="language-sql">-- In psql: CREATE DATABASE empmanagement;  then  \\c empmanagement
CREATE TABLE tblEmployee (
    IdEmp    INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpName  VARCHAR(50) NOT NULL,
    DOB      DATE CHECK (EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM DOB) &gt;= 18),
    PhoneNo  CHAR(12) UNIQUE,
    Addr     VARCHAR(50) DEFAULT 'Hồ Chí Minh'
);
INSERT INTO tblEmployee (EmpName, DOB, PhoneNo) VALUES ('Nguyễn Văn A', '2000-01-01', '0901000001');
INSERT INTO tblEmployee (EmpName, DOB, PhoneNo, Addr) VALUES ('Phạm Thị D', '1998-12-12', '0901000004', 'Hà Nội');
SELECT * FROM tblEmployee;</code></pre>
<div class="out">INSERT 0 1<br>
INSERT 0 1</div>
<table>
<thead><tr><th>idemp</th><th>empname</th><th>dob</th><th>phoneno</th><th>addr</th></tr></thead>
<tbody>
<tr><td>1</td><td>Nguyễn Văn A</td><td>2000-01-01</td><td>0901000001  </td><td>Hồ Chí Minh</td></tr>
<tr><td>2</td><td>Phạm Thị D</td><td>1998-12-12</td><td>0901000004  </td><td>Hà Nội</td></tr>
</tbody>
</table>
The under-18 insert fails there too (<code>violates check constraint "tblemployee_dob_check"</code>). Older code uses <code>SERIAL</code> for the same purpose. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-1-khoa-chinh">PostgreSQL 3.1 — primary keys &amp; identity</a>.</div>`,
        `<p class="y-chinh">🎯 Bản demo tạo database EmpManagement và một bảng tblEmployee dùng cả IDENTITY, NOT NULL, CHECK, UNIQUE và DEFAULT trong một câu lệnh.</p>
<p>Code trên slide, chạy nguyên văn:</p>
<pre><code class="language-sql">CREATE DATABASE EmpManagement;
GO
USE EmpManagement;
GO
CREATE TABLE tblEmployee
    (IdEmp INT identity(1,1) PRIMARY KEY,
     EmpName nvarchar(50) NOT NULL,
     DOB date CHECK(year(getdate())-year(DOB)&gt;=18),
     PhoneNo char(12) Unique,
     Addr nvarchar(50) DEFAULT N'Hồ Chí Minh'
    );
GO</code></pre>
<table>
<thead><tr><th>Dòng</th><th>Nghĩa</th></tr></thead>
<tbody>
<tr><td><code>CREATE DATABASE EmpManagement;</code> rồi <code>USE EmpManagement;</code></td><td>tạo database, rồi chọn nó làm database hiện hành (mọi câu sau chạy bên trong nó)</td></tr>
<tr><td><code>IdEmp INT identity(1,1) PRIMARY KEY</code></td><td>IDENTITY(số bắt đầu, bước nhảy): SQL Server tự điền số — 1, 2, 3…; cột này cũng là khoá chính</td></tr>
<tr><td><code>EmpName nvarchar(50) NOT NULL</code></td><td>bắt buộc có tên</td></tr>
<tr><td><code>DOB date CHECK(year(getdate())-year(DOB)&gt;=18)</code></td><td>nhân viên phải đủ 18 tuổi "theo năm" (slide 11)</td></tr>
<tr><td><code>PhoneNo char(12) Unique</code></td><td>không hai nhân viên nào trùng số điện thoại; <code>CHAR(12)</code> luôn độn cho đủ 12 ký tự</td></tr>
<tr><td><code>Addr nvarchar(50) DEFAULT N'Hồ Chí Minh'</code></td><td>nếu câu INSERT không đưa địa chỉ thì lưu giá trị này</td></tr>
</tbody>
</table>
<p>Giờ bốn câu chèn — một hợp lệ, hai câu vi phạm luật, một hợp lệ nữa:</p>
<pre><code class="language-sql">-- 1. Dòng hợp lệ: IdEmp và Addr được tự điền
INSERT INTO tblEmployee (EmpName, DOB, PhoneNo) VALUES (N'Nguyễn Văn A', '2000-01-01', '0901000001');
GO
-- 2. Dưới 18 tuổi: vi phạm CHECK
INSERT INTO tblEmployee (EmpName, DOB, PhoneNo) VALUES (N'Trần Thị B', '2015-06-01', '0901000002');
GO
-- 3. Trùng số điện thoại: vi phạm UNIQUE
INSERT INTO tblEmployee (EmpName, DOB, PhoneNo) VALUES (N'Lê Văn C', '1999-03-03', '0901000001');
GO
-- 4. Dòng hợp lệ có địa chỉ riêng
INSERT INTO tblEmployee (EmpName, DOB, PhoneNo, Addr) VALUES (N'Phạm Thị D', '1998-12-12', '0901000004', N'Hà Nội');
GO
SELECT * FROM tblEmployee;
GO</code></pre>
<div class="out">Changed database context to 'EmpManagement'.<br>
(1 row affected)<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "CK__tblEmployee__DOB__69EE134A". The conflict occurred in database "EmpManagement", table "dbo.tblEmployee", column 'DOB'.</b><br>
The statement has been terminated.<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of UNIQUE KEY constraint 'UQ__tblEmplo__1ED98F0D76C71483'. Cannot insert duplicate key in object 'dbo.tblEmployee'. The duplicate key value is (0901000001  ).</b><br>
The statement has been terminated.<br>
(1 row affected)</div>
<table>
<thead><tr><th>IdEmp</th><th>EmpName</th><th>DOB</th><th>PhoneNo</th><th>Addr</th></tr></thead>
<tbody>
<tr><td>1</td><td>Nguyễn Văn A</td><td>2000-01-01</td><td>0901000001  </td><td>Hồ Chí Minh</td></tr>
<tr><td>4</td><td>Phạm Thị D</td><td>1998-12-12</td><td>0901000004  </td><td>Hà Nội</td></tr>
</tbody>
</table>
<div class="out">Changed database context to 'master'.</div>
<ul>
<li>Dòng 1 được IdEmp = 1 và Addr = 'Hồ Chí Minh' mà không cần ghi.</li>
<li>Dòng 2 (sinh 2015) vi phạm CHECK; dòng 3 dùng lại số điện thoại nên vi phạm UNIQUE — cả hai bị từ chối.</li>
<li>Dòng hợp lệ cuối nhận IdEmp = <strong>4</strong> chứ không phải 2: mỗi lần chèn bị từ chối vẫn "ăn" mất một số identity. Có lỗ hổng là bình thường; đừng bao giờ dùng IDENTITY để "đếm".</li>
<li><code>PhoneNo</code> có dấu cách ở cuối: CHAR(12) độn thêm cho đủ độ dài.</li>
</ul>
<div class="pitfall">Tên ràng buộc trong thông báo lỗi (<code>CK__tblEmployee__DOB__…</code>, <code>UQ__tblEmplo__…</code>) là ngẫu nhiên vì bản demo không đặt tên. Trong câu INSERT không bao giờ đưa giá trị cho cột IDENTITY (sẽ lỗi, trừ khi bật <code>SET IDENTITY_INSERT … ON</code>).</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> IDENTITY viết là <code>GENERATED ALWAYS AS IDENTITY</code>, <code>getdate()</code> đổi thành <code>CURRENT_DATE</code>, <code>year(x)</code> đổi thành <code>EXTRACT(YEAR FROM x)</code>, không có tiền tố N:
<pre><code class="language-sql">-- Trong psql: CREATE DATABASE empmanagement;  rồi  \\c empmanagement
CREATE TABLE tblEmployee (
    IdEmp    INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpName  VARCHAR(50) NOT NULL,
    DOB      DATE CHECK (EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM DOB) &gt;= 18),
    PhoneNo  CHAR(12) UNIQUE,
    Addr     VARCHAR(50) DEFAULT 'Hồ Chí Minh'
);
INSERT INTO tblEmployee (EmpName, DOB, PhoneNo) VALUES ('Nguyễn Văn A', '2000-01-01', '0901000001');
INSERT INTO tblEmployee (EmpName, DOB, PhoneNo, Addr) VALUES ('Phạm Thị D', '1998-12-12', '0901000004', 'Hà Nội');
SELECT * FROM tblEmployee;</code></pre>
<div class="out">INSERT 0 1<br>
INSERT 0 1</div>
<table>
<thead><tr><th>idemp</th><th>empname</th><th>dob</th><th>phoneno</th><th>addr</th></tr></thead>
<tbody>
<tr><td>1</td><td>Nguyễn Văn A</td><td>2000-01-01</td><td>0901000001  </td><td>Hồ Chí Minh</td></tr>
<tr><td>2</td><td>Phạm Thị D</td><td>1998-12-12</td><td>0901000004  </td><td>Hà Nội</td></tr>
</tbody>
</table>
Câu chèn người dưới 18 tuổi ở đó cũng lỗi (<code>violates check constraint "tblemployee_dob_check"</code>). Code cũ hay dùng <code>SERIAL</code> cho cùng mục đích. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-1-khoa-chinh">PostgreSQL 3.1 — khoá chính &amp; identity</a>.</div>`],
      [18, 'Data Definition Language - ALTER, DROP columns',
        `<p class="y-chinh">🎯 <code>ALTER TABLE</code> changes an existing table without losing its rows: add a column, remove a column, or change a column's data type.</p>
<p>The slide's syntax is a summary; the exact T-SQL forms are:</p>
<table>
<thead><tr><th>Slide</th><th>Exact T-SQL</th><th>Note</th></tr></thead>
<tbody>
<tr><td><code>ADD columnName datatype [constraint]</code></td><td><code>ALTER TABLE t ADD c type [constraint];</code></td><td>no word COLUMN in T-SQL</td></tr>
<tr><td><code>DROP columnName datatype [constraint]</code></td><td><code>ALTER TABLE t DROP COLUMN c;</code></td><td>needs COLUMN, and no type</td></tr>
<tr><td><code>ALTER columnName datatype [constraint]</code></td><td><code>ALTER TABLE t ALTER COLUMN c newtype [NULL | NOT NULL];</code></td><td>needs COLUMN</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- Add a column (existing rows get NULL)
ALTER TABLE tblEmployee ADD empEmail VARCHAR(100) NULL;
GO
-- Change its data type
ALTER TABLE tblEmployee ALTER COLUMN empEmail NVARCHAR(150) NULL;
GO
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'tblEmployee' AND COLUMN_NAME = 'empEmail';
GO
-- Remove it
ALTER TABLE tblEmployee DROP COLUMN empEmail;
GO</code></pre>
<table>
<thead><tr><th>COLUMN_NAME</th><th>DATA_TYPE</th><th>CHARACTER_MAXIMUM_LENGTH</th><th>IS_NULLABLE</th></tr></thead>
<tbody>
<tr><td>empEmail</td><td>nvarchar</td><td>150</td><td>YES</td></tr>
</tbody>
</table>
<p>Two traps on a table that already has rows:</p>
<pre><code class="language-sql">-- Trap: a NOT NULL column without a default on a table that has rows
ALTER TABLE tblEmployee ADD empPhone VARCHAR(15) NOT NULL;
GO
-- Fix: give it a named DEFAULT
ALTER TABLE tblEmployee ADD empPhone VARCHAR(15) NOT NULL
    CONSTRAINT df_employee_phone DEFAULT 'N/A';
GO
SELECT TOP 2 empName, empPhone FROM tblEmployee ORDER BY empSSN;
GO
-- Trap 2: a column that a constraint depends on cannot be dropped first
ALTER TABLE tblEmployee DROP COLUMN empPhone;
GO
ALTER TABLE tblEmployee DROP CONSTRAINT df_employee_phone;
ALTER TABLE tblEmployee DROP COLUMN empPhone;
GO</code></pre>
<div class="out"><b>Msg 4901, Level 16, State 1<br>
ALTER TABLE only allows columns to be added that can contain nulls, or have a DEFAULT definition specified, or the column being added is an identity or timestamp column, or alternatively if none of the previous conditions are satisfied the table must be empty to allow addition of this column. Column 'empPhone' cannot be added to non-empty table 'tblEmployee' because it does not satisfy these conditions.</b></div>
<table>
<thead><tr><th>empName</th><th>empPhone</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>N/A</td></tr>
<tr><td>Hoàng Thị Hà</td><td>N/A</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 5074, Level 16, State 1<br>
The object 'df_employee_phone' is dependent on column 'empPhone'.</b><br>
<b>Msg 4922, Level 16, State 9<br>
ALTER TABLE DROP COLUMN empPhone failed because one or more objects access this column.</b></div>
<ul>
<li><code>Msg 4901</code>: a new NOT NULL column has no value for the 14 existing rows. Give it a DEFAULT (or add it as NULL, fill it with UPDATE, then change it to NOT NULL).</li>
<li><code>Msg 4922</code>: the column cannot be dropped while the DEFAULT constraint depends on it — drop the constraint first, by name. Naming <code>df_employee_phone</code> is what made that easy.</li>
</ul>
<p>Renaming a column is not ALTER TABLE in SQL Server but a system stored procedure:</p>
<pre><code class="language-sql">-- Renaming a column in SQL Server: the system procedure sp_rename
EXEC sp_rename 'tblEmployee.empAddress', 'empAddr', 'COLUMN';
GO
SELECT TOP 1 empName, empAddr FROM tblEmployee ORDER BY empSSN;</code></pre>
<div class="out">Caution: Changing any part of an object name could break scripts and stored procedures.</div>
<table>
<thead><tr><th>empName</th><th>empAddr</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the keywords differ: <code>ADD COLUMN</code>, <code>ALTER COLUMN c TYPE newtype</code>, <code>ALTER COLUMN c SET DEFAULT …</code>, and renaming is plain SQL <code>RENAME COLUMN a TO b</code> (no sp_rename). A default can be dropped with the column, no separate step:
<pre><code class="language-sql">-- PostgreSQL: ADD COLUMN / ALTER COLUMN ... TYPE / RENAME COLUMN / DROP COLUMN
ALTER TABLE tblEmployee ADD COLUMN empEmail VARCHAR(100);
ALTER TABLE tblEmployee ALTER COLUMN empEmail TYPE VARCHAR(150);
ALTER TABLE tblEmployee ALTER COLUMN empEmail SET DEFAULT 'N/A';
ALTER TABLE tblEmployee RENAME COLUMN empAddress TO empAddr;
SELECT column_name, data_type, character_maximum_length, column_default
FROM information_schema.columns
WHERE table_name = 'tblemployee' AND column_name IN ('empemail', 'empaddr');
ALTER TABLE tblEmployee DROP COLUMN empEmail;</code></pre>
<table>
<thead><tr><th>column_name</th><th>data_type</th><th>character_maximum_length</th><th>column_default</th></tr></thead>
<tbody>
<tr><td>empemail</td><td>character varying</td><td>150</td><td>'N/A'::character varying</td></tr>
<tr><td>empaddr</td><td>character varying</td><td>100</td><td><em>NULL</em></td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-4-alter-chuan-hoa">PostgreSQL 3.4 — ALTER TABLE</a>.</div>`,
        `<p class="y-chinh">🎯 <code>ALTER TABLE</code> sửa một bảng đang có mà không mất dòng nào: thêm cột, xoá cột, hoặc đổi kiểu dữ liệu của cột.</p>
<p>Cú pháp trên slide là bản tóm tắt; dạng T-SQL chính xác là:</p>
<table>
<thead><tr><th>Slide</th><th>T-SQL chính xác</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td><code>ADD columnName datatype [constraint]</code></td><td><code>ALTER TABLE t ADD c kiểu [ràng buộc];</code></td><td>T-SQL không có chữ COLUMN</td></tr>
<tr><td><code>DROP columnName datatype [constraint]</code></td><td><code>ALTER TABLE t DROP COLUMN c;</code></td><td>cần chữ COLUMN, và không ghi kiểu</td></tr>
<tr><td><code>ALTER columnName datatype [constraint]</code></td><td><code>ALTER TABLE t ALTER COLUMN c kiểu_mới [NULL | NOT NULL];</code></td><td>cần chữ COLUMN</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- Thêm cột (các dòng cũ nhận NULL)
ALTER TABLE tblEmployee ADD empEmail VARCHAR(100) NULL;
GO
-- Đổi kiểu dữ liệu của nó
ALTER TABLE tblEmployee ALTER COLUMN empEmail NVARCHAR(150) NULL;
GO
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'tblEmployee' AND COLUMN_NAME = 'empEmail';
GO
-- Xoá cột
ALTER TABLE tblEmployee DROP COLUMN empEmail;
GO</code></pre>
<table>
<thead><tr><th>COLUMN_NAME</th><th>DATA_TYPE</th><th>CHARACTER_MAXIMUM_LENGTH</th><th>IS_NULLABLE</th></tr></thead>
<tbody>
<tr><td>empEmail</td><td>nvarchar</td><td>150</td><td>YES</td></tr>
</tbody>
</table>
<p>Hai cái bẫy khi bảng đã có dữ liệu:</p>
<pre><code class="language-sql">-- Bẫy: cột NOT NULL không có mặc định trên bảng đã có dữ liệu
ALTER TABLE tblEmployee ADD empPhone VARCHAR(15) NOT NULL;
GO
-- Sửa: cho nó một DEFAULT có tên
ALTER TABLE tblEmployee ADD empPhone VARCHAR(15) NOT NULL
    CONSTRAINT df_employee_phone DEFAULT 'N/A';
GO
SELECT TOP 2 empName, empPhone FROM tblEmployee ORDER BY empSSN;
GO
-- Bẫy 2: không xoá được cột khi còn ràng buộc bám vào nó
ALTER TABLE tblEmployee DROP COLUMN empPhone;
GO
ALTER TABLE tblEmployee DROP CONSTRAINT df_employee_phone;
ALTER TABLE tblEmployee DROP COLUMN empPhone;
GO</code></pre>
<div class="out"><b>Msg 4901, Level 16, State 1<br>
ALTER TABLE only allows columns to be added that can contain nulls, or have a DEFAULT definition specified, or the column being added is an identity or timestamp column, or alternatively if none of the previous conditions are satisfied the table must be empty to allow addition of this column. Column 'empPhone' cannot be added to non-empty table 'tblEmployee' because it does not satisfy these conditions.</b></div>
<table>
<thead><tr><th>empName</th><th>empPhone</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>N/A</td></tr>
<tr><td>Hoàng Thị Hà</td><td>N/A</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 5074, Level 16, State 1<br>
The object 'df_employee_phone' is dependent on column 'empPhone'.</b><br>
<b>Msg 4922, Level 16, State 9<br>
ALTER TABLE DROP COLUMN empPhone failed because one or more objects access this column.</b></div>
<ul>
<li><code>Msg 4901</code>: cột NOT NULL mới không có giá trị cho 14 dòng đang có. Cho nó một DEFAULT (hoặc thêm dạng NULL, điền bằng UPDATE, rồi mới đổi thành NOT NULL).</li>
<li><code>Msg 4922</code>: không xoá được cột khi ràng buộc DEFAULT còn bám vào nó — xoá ràng buộc trước, theo tên. Nhờ đặt tên <code>df_employee_phone</code> nên việc đó mới dễ.</li>
</ul>
<p>Đổi tên cột trong SQL Server không phải ALTER TABLE mà là một thủ tục hệ thống (system stored procedure):</p>
<pre><code class="language-sql">-- Đổi tên cột trong SQL Server: thủ tục hệ thống sp_rename
EXEC sp_rename 'tblEmployee.empAddress', 'empAddr', 'COLUMN';
GO
SELECT TOP 1 empName, empAddr FROM tblEmployee ORDER BY empSSN;</code></pre>
<div class="out">Caution: Changing any part of an object name could break scripts and stored procedures.</div>
<table>
<thead><tr><th>empName</th><th>empAddr</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> từ khoá khác: <code>ADD COLUMN</code>, <code>ALTER COLUMN c TYPE kiểu_mới</code>, <code>ALTER COLUMN c SET DEFAULT …</code>, và đổi tên là câu SQL thường <code>RENAME COLUMN a TO b</code> (không có sp_rename). Giá trị mặc định bị xoá theo cột, không cần bước riêng:
<pre><code class="language-sql">-- PostgreSQL: ADD COLUMN / ALTER COLUMN ... TYPE / RENAME COLUMN / DROP COLUMN
ALTER TABLE tblEmployee ADD COLUMN empEmail VARCHAR(100);
ALTER TABLE tblEmployee ALTER COLUMN empEmail TYPE VARCHAR(150);
ALTER TABLE tblEmployee ALTER COLUMN empEmail SET DEFAULT 'N/A';
ALTER TABLE tblEmployee RENAME COLUMN empAddress TO empAddr;
SELECT column_name, data_type, character_maximum_length, column_default
FROM information_schema.columns
WHERE table_name = 'tblemployee' AND column_name IN ('empemail', 'empaddr');
ALTER TABLE tblEmployee DROP COLUMN empEmail;</code></pre>
<table>
<thead><tr><th>column_name</th><th>data_type</th><th>character_maximum_length</th><th>column_default</th></tr></thead>
<tbody>
<tr><td>empemail</td><td>character varying</td><td>150</td><td>'N/A'::character varying</td></tr>
<tr><td>empaddr</td><td>character varying</td><td>100</td><td><em>NULL</em></td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-4-alter-chuan-hoa">PostgreSQL 3.4 — ALTER TABLE</a>.</div>`],
      [19, 'Data Definition Language - ALTER, DROP constraints',
        `<p class="y-chinh">🎯 Constraints can be added after the table exists with <code>ALTER TABLE t ADD CONSTRAINT name PRIMARY KEY / FOREIGN KEY / CHECK …</code> and removed with <code>DROP CONSTRAINT name</code>.</p>
<p>FUHCompany itself needs this: tblDepartment.mgrSSN points to tblEmployee and tblEmployee.depNum points to tblDepartment — a circle, so one of the two foreign keys can only be added after both tables exist:</p>
<pre><code class="language-plaintext">CREATE TABLE tblDepartment (…, mgrSSN DECIMAL(18,0) NULL, …);      -- no FK yet
CREATE TABLE tblEmployee  (…, depNum INT … REFERENCES tblDepartment);
ALTER TABLE tblDepartment
    ADD CONSTRAINT fk_department_manager FOREIGN KEY (mgrSSN) REFERENCES tblEmployee (empSSN);</code></pre>
<p>Adding and dropping on the real data:</p>
<pre><code class="language-sql">-- A candidate key on the project name
ALTER TABLE tblProject
    ADD CONSTRAINT uq_project_name UNIQUE (proName);
GO
-- A CHECK that the current data respects
ALTER TABLE tblEmployee
    ADD CONSTRAINT ck_employee_birth CHECK (empBirthdate &gt;= '1900-01-01');
GO
-- A CHECK that some existing rows break: refused
ALTER TABLE tblEmployee
    ADD CONSTRAINT ck_employee_min_salary CHECK (empSalary &gt;= 50000);
GO
-- Drop a constraint by its name
ALTER TABLE tblEmployee DROP CONSTRAINT ck_employee_birth;
GO
SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_NAME IN ('tblEmployee', 'tblProject')
ORDER BY TABLE_NAME, CONSTRAINT_NAME;</code></pre>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The ALTER TABLE statement conflicted with the CHECK constraint "ck_employee_min_salary". The conflict occurred in database "DBI202", table "dbo.tblEmployee", column 'empSalary'.</b></div>
<table>
<thead><tr><th>CONSTRAINT_NAME</th><th>CONSTRAINT_TYPE</th></tr></thead>
<tbody>
<tr><td>ck_employee_salary</td><td>CHECK</td></tr>
<tr><td>ck_employee_sex</td><td>CHECK</td></tr>
<tr><td>fk_employee_department</td><td>FOREIGN KEY</td></tr>
<tr><td>fk_employee_supervisor</td><td>FOREIGN KEY</td></tr>
<tr><td>pk_employee</td><td>PRIMARY KEY</td></tr>
<tr><td>fk_project_department</td><td>FOREIGN KEY</td></tr>
<tr><td>fk_project_location</td><td>FOREIGN KEY</td></tr>
<tr><td>pk_project</td><td>PRIMARY KEY</td></tr>
<tr><td>uq_project_name</td><td>UNIQUE</td></tr>
</tbody>
</table>
<ul>
<li>uq_project_name and ck_employee_birth were accepted: every existing row already respects them.</li>
<li>ck_employee_min_salary was <strong>refused</strong> (Msg 547): SQL Server checks the existing rows, and 3 employees earn less than 50000. Fix the data first, or add <code>WITH NOCHECK</code> (then only new rows are checked — risky).</li>
<li>ck_employee_birth was then dropped by name, and the list shows what is left.</li>
</ul>
<div class="pitfall">You cannot "modify" a constraint: drop it and add it again. Dropping an unnamed one means first looking up its random name in <code>INFORMATION_SCHEMA.TABLE_CONSTRAINTS</code> — another reason to name everything.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> <code>ADD CONSTRAINT</code> / <code>DROP CONSTRAINT</code> are the same; <code>WITH NOCHECK</code> is written <code>NOT VALID</code> at the end, checked later with <code>VALIDATE CONSTRAINT</code>, and NOT NULL is set with <code>ALTER COLUMN c SET NOT NULL</code>. The script stops at the validation, because old rows break the rule:
<pre><code class="language-sql">-- Same ADD CONSTRAINT; NOT VALID = skip checking the old rows (like WITH NOCHECK)
ALTER TABLE tblEmployee ADD CONSTRAINT ck_employee_min_salary CHECK (empSalary &gt;= 50000) NOT VALID;
ALTER TABLE tblEmployee ALTER COLUMN empSex SET NOT NULL;
ALTER TABLE tblEmployee VALIDATE CONSTRAINT ck_employee_min_salary;</code></pre>
<div class="out"><b>ERROR:  check constraint "ck_employee_min_salary" of relation "tblemployee" is violated by some row</b></div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL 3.2 — foreign keys</a>.</div>`,
        `<p class="y-chinh">🎯 Ràng buộc có thể thêm sau khi bảng đã có bằng <code>ALTER TABLE t ADD CONSTRAINT tên PRIMARY KEY / FOREIGN KEY / CHECK …</code> và bỏ bằng <code>DROP CONSTRAINT tên</code>.</p>
<p>Chính FUHCompany cần tới điều này: tblDepartment.mgrSSN trỏ sang tblEmployee còn tblEmployee.depNum trỏ sang tblDepartment — một vòng tròn, nên một trong hai khoá ngoại chỉ thêm được khi cả hai bảng đã có:</p>
<pre><code class="language-plaintext">CREATE TABLE tblDepartment (…, mgrSSN DECIMAL(18,0) NULL, …);      -- chưa có FK
CREATE TABLE tblEmployee  (…, depNum INT … REFERENCES tblDepartment);
ALTER TABLE tblDepartment
    ADD CONSTRAINT fk_department_manager FOREIGN KEY (mgrSSN) REFERENCES tblEmployee (empSSN);</code></pre>
<p>Thêm và bỏ trên dữ liệu thật:</p>
<pre><code class="language-sql">-- Khoá ứng viên trên tên dự án
ALTER TABLE tblProject
    ADD CONSTRAINT uq_project_name UNIQUE (proName);
GO
-- Một CHECK mà dữ liệu hiện có đều thoả
ALTER TABLE tblEmployee
    ADD CONSTRAINT ck_employee_birth CHECK (empBirthdate &gt;= '1900-01-01');
GO
-- Một CHECK mà vài dòng đang có vi phạm: bị từ chối
ALTER TABLE tblEmployee
    ADD CONSTRAINT ck_employee_min_salary CHECK (empSalary &gt;= 50000);
GO
-- Xoá ràng buộc theo tên
ALTER TABLE tblEmployee DROP CONSTRAINT ck_employee_birth;
GO
SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_NAME IN ('tblEmployee', 'tblProject')
ORDER BY TABLE_NAME, CONSTRAINT_NAME;</code></pre>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The ALTER TABLE statement conflicted with the CHECK constraint "ck_employee_min_salary". The conflict occurred in database "DBI202", table "dbo.tblEmployee", column 'empSalary'.</b></div>
<table>
<thead><tr><th>CONSTRAINT_NAME</th><th>CONSTRAINT_TYPE</th></tr></thead>
<tbody>
<tr><td>ck_employee_salary</td><td>CHECK</td></tr>
<tr><td>ck_employee_sex</td><td>CHECK</td></tr>
<tr><td>fk_employee_department</td><td>FOREIGN KEY</td></tr>
<tr><td>fk_employee_supervisor</td><td>FOREIGN KEY</td></tr>
<tr><td>pk_employee</td><td>PRIMARY KEY</td></tr>
<tr><td>fk_project_department</td><td>FOREIGN KEY</td></tr>
<tr><td>fk_project_location</td><td>FOREIGN KEY</td></tr>
<tr><td>pk_project</td><td>PRIMARY KEY</td></tr>
<tr><td>uq_project_name</td><td>UNIQUE</td></tr>
</tbody>
</table>
<ul>
<li>uq_project_name và ck_employee_birth được nhận: mọi dòng đang có đều đã thoả chúng.</li>
<li>ck_employee_min_salary bị <strong>từ chối</strong> (Msg 547): SQL Server kiểm cả các dòng đang có, và 3 nhân viên lương dưới 50000. Sửa dữ liệu trước, hoặc thêm <code>WITH NOCHECK</code> (khi đó chỉ kiểm dòng mới — nguy hiểm).</li>
<li>Sau đó ck_employee_birth bị xoá theo tên, và danh sách cho thấy những gì còn lại.</li>
</ul>
<div class="pitfall">Không có lệnh "sửa" ràng buộc: xoá đi rồi thêm lại. Muốn xoá ràng buộc không tên thì phải tra tên ngẫu nhiên của nó trong <code>INFORMATION_SCHEMA.TABLE_CONSTRAINTS</code> trước — thêm một lý do để đặt tên cho mọi thứ.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> <code>ADD CONSTRAINT</code> / <code>DROP CONSTRAINT</code> giống hệt; <code>WITH NOCHECK</code> viết là <code>NOT VALID</code> ở cuối, kiểm sau bằng <code>VALIDATE CONSTRAINT</code>, và đặt NOT NULL bằng <code>ALTER COLUMN c SET NOT NULL</code>. Script dừng ở bước kiểm, vì các dòng cũ vi phạm luật:
<pre><code class="language-sql">-- Cùng ADD CONSTRAINT; NOT VALID = bỏ qua kiểm dòng cũ (giống WITH NOCHECK)
ALTER TABLE tblEmployee ADD CONSTRAINT ck_employee_min_salary CHECK (empSalary &gt;= 50000) NOT VALID;
ALTER TABLE tblEmployee ALTER COLUMN empSex SET NOT NULL;
ALTER TABLE tblEmployee VALIDATE CONSTRAINT ck_employee_min_salary;</code></pre>
<div class="out"><b>ERROR:  check constraint "ck_employee_min_salary" of relation "tblemployee" is violated by some row</b></div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL 3.2 — khoá ngoại</a>.</div>`],
      [20, 'Data Definition Language - DROP TABLE, DROP DATABASE',
        `<p class="y-chinh">🎯 <code>DROP TABLE t</code> deletes the table with all its rows; <code>DROP DATABASE db</code> deletes the whole database — no undo in either case.</p>
<pre><code class="language-sql">-- A parent table that other tables still reference cannot be dropped
DROP TABLE tblLocation;
GO
-- Drop the children first, then the parent
DROP TABLE tblDepLocation;
ALTER TABLE tblProject DROP CONSTRAINT fk_project_location;
DROP TABLE tblLocation;
GO
-- IF EXISTS: no error when the table is already gone
DROP TABLE IF EXISTS tblLocation;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES ORDER BY TABLE_NAME;</code></pre>
<div class="out"><b>Msg 3726, Level 16, State 1<br>
Could not drop object 'tblLocation' because it is referenced by a FOREIGN KEY constraint.</b></div>
<table>
<thead><tr><th>TABLE_NAME</th></tr></thead>
<tbody>
<tr><td>tblDepartment</td></tr>
<tr><td>tblDependent</td></tr>
<tr><td>tblEmployee</td></tr>
<tr><td>tblProject</td></tr>
<tr><td>tblWorksOn</td></tr>
</tbody>
</table>
<ul>
<li><code>Msg 3726</code>: tblLocation is still referenced by fk_deplocation_location and fk_project_location. SQL Server refuses to leave orphan references.</li>
<li>So drop in the <strong>reverse</strong> order of creation: first the child table tblDepLocation, then remove the FK in tblProject (we keep the table), then the parent.</li>
<li><code>DROP TABLE IF EXISTS</code> (SQL Server 2016+) does nothing, without error, when the table is already gone — handy at the top of a PE script that you run several times.</li>
</ul>
<div class="pitfall"><code>DROP DATABASE</code> fails while someone is connected to it (including your own SSMS tab with <code>USE db</code>). Switch with <code>USE master</code> first. DROP is not DELETE: <code>DELETE FROM t</code> empties rows and keeps the table (Chapter 6).</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> <code>DROP TABLE … CASCADE</code> removes the foreign keys that point to the table automatically (SQL Server has no such option for tables) — powerful, so read the NOTICE:
<pre><code class="language-sql">-- PostgreSQL: CASCADE drops the referencing foreign keys too
DROP TABLE tblLocation CASCADE;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;</code></pre>
<div class="out">NOTICE:  drop cascades to 2 other objects</div>
<table>
<thead><tr><th>table_name</th></tr></thead>
<tbody>
<tr><td>tbldepartment</td></tr>
<tr><td>tbldependent</td></tr>
<tr><td>tbldeplocation</td></tr>
<tr><td>tblemployee</td></tr>
<tr><td>tblproject</td></tr>
<tr><td>tblworkson</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL 3.2 — foreign keys</a>.</div>`,
        `<p class="y-chinh">🎯 <code>DROP TABLE t</code> xoá bảng cùng mọi dòng của nó; <code>DROP DATABASE db</code> xoá cả database — không có "hoàn tác" cho cả hai.</p>
<pre><code class="language-sql">-- Không xoá được bảng cha khi bảng khác còn tham chiếu tới nó
DROP TABLE tblLocation;
GO
-- Xoá bảng con trước, rồi mới tới bảng cha
DROP TABLE tblDepLocation;
ALTER TABLE tblProject DROP CONSTRAINT fk_project_location;
DROP TABLE tblLocation;
GO
-- IF EXISTS: không lỗi nếu bảng đã không còn
DROP TABLE IF EXISTS tblLocation;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES ORDER BY TABLE_NAME;</code></pre>
<div class="out"><b>Msg 3726, Level 16, State 1<br>
Could not drop object 'tblLocation' because it is referenced by a FOREIGN KEY constraint.</b></div>
<table>
<thead><tr><th>TABLE_NAME</th></tr></thead>
<tbody>
<tr><td>tblDepartment</td></tr>
<tr><td>tblDependent</td></tr>
<tr><td>tblEmployee</td></tr>
<tr><td>tblProject</td></tr>
<tr><td>tblWorksOn</td></tr>
</tbody>
</table>
<ul>
<li><code>Msg 3726</code>: tblLocation vẫn đang bị fk_deplocation_location và fk_project_location tham chiếu. SQL Server không chịu để lại tham chiếu "mồ côi".</li>
<li>Nên xoá theo thứ tự <strong>ngược</strong> với lúc tạo: trước là bảng con tblDepLocation, rồi gỡ khoá ngoại trong tblProject (giữ lại bảng), cuối cùng mới tới bảng cha.</li>
<li><code>DROP TABLE IF EXISTS</code> (SQL Server 2016+) không làm gì và không báo lỗi khi bảng đã không còn — tiện đặt ở đầu script PE mà bạn chạy nhiều lần.</li>
</ul>
<div class="pitfall"><code>DROP DATABASE</code> thất bại khi còn ai đang kết nối vào nó (kể cả chính tab SSMS của bạn đang <code>USE db</code>). Chuyển sang <code>USE master</code> trước. DROP khác DELETE: <code>DELETE FROM t</code> xoá các dòng nhưng giữ bảng (Chương 6).</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> <code>DROP TABLE … CASCADE</code> tự gỡ luôn các khoá ngoại đang trỏ vào bảng (SQL Server không có tuỳ chọn này cho bảng) — mạnh, nên hãy đọc dòng NOTICE:
<pre><code class="language-sql">-- PostgreSQL: CASCADE xoá luôn các khoá ngoại đang trỏ vào
DROP TABLE tblLocation CASCADE;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;</code></pre>
<div class="out">NOTICE:  drop cascades to 2 other objects</div>
<table>
<thead><tr><th>table_name</th></tr></thead>
<tbody>
<tr><td>tbldepartment</td></tr>
<tr><td>tbldependent</td></tr>
<tr><td>tbldeplocation</td></tr>
<tr><td>tblemployee</td></tr>
<tr><td>tblproject</td></tr>
<tr><td>tblworkson</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL 3.2 — khoá ngoại</a>.</div>`],
      [21, 'Physical Diagram - FUHCompany',
        `<p class="y-chinh">🎯 The physical diagram of FUHCompany: 7 tables, a key icon on each primary-key column, and one line per foreign key (key end = the parent, ∞ end = the child).</p>
<p>The picture on this slide is partly covered by another shape; the same diagram appears complete in the school's Chapter 8 deck (slide 4). In text:</p>
<table>
<thead><tr><th>Table</th><th>Columns (key underlined in the diagram)</th><th>Foreign keys</th></tr></thead>
<tbody>
<tr><td>tblDepartment</td><td><u>depNum</u>, depName, mgrSSN, mgrAssDate</td><td>mgrSSN → tblEmployee</td></tr>
<tr><td>tblEmployee</td><td><u>empSSN</u>, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN</td><td>depNum → tblDepartment; supervisorSSN → tblEmployee (itself)</td></tr>
<tr><td>tblDependent</td><td><u>depName</u>, <u>empSSN</u>, depSex, depBirthdate, depRelationship</td><td>empSSN → tblEmployee</td></tr>
<tr><td>tblLocation</td><td><u>locNum</u>, locName</td><td>—</td></tr>
<tr><td>tblDepLocation</td><td><u>depNum</u>, <u>locNum</u></td><td>depNum → tblDepartment; locNum → tblLocation</td></tr>
<tr><td>tblProject</td><td><u>proNum</u>, proName, locNum, depNum</td><td>locNum → tblLocation; depNum → tblDepartment</td></tr>
<tr><td>tblWorksOn</td><td><u>empSSN</u>, <u>proNum</u>, workHours</td><td>empSSN → tblEmployee; proNum → tblProject</td></tr>
</tbody>
</table>
<p>The script that builds it (used before every example of the course) creates the tables parents-first, adds the circular manager FK with ALTER (slide 19), then inserts sample data. How many rows each table holds:</p>
<pre><code class="language-sql">-- The 7 tables and their number of rows
SELECT 'tblDepartment' AS bang, COUNT(*) AS so_dong FROM tblDepartment
UNION ALL SELECT 'tblEmployee',    COUNT(*) FROM tblEmployee
UNION ALL SELECT 'tblDependent',   COUNT(*) FROM tblDependent
UNION ALL SELECT 'tblLocation',    COUNT(*) FROM tblLocation
UNION ALL SELECT 'tblDepLocation', COUNT(*) FROM tblDepLocation
UNION ALL SELECT 'tblProject',     COUNT(*) FROM tblProject
UNION ALL SELECT 'tblWorksOn',     COUNT(*) FROM tblWorksOn;</code></pre>
<table>
<thead><tr><th>bang</th><th>so_dong</th></tr></thead>
<tbody>
<tr><td>tblDepartment</td><td>5</td></tr>
<tr><td>tblEmployee</td><td>14</td></tr>
<tr><td>tblDependent</td><td>5</td></tr>
<tr><td>tblLocation</td><td>4</td></tr>
<tr><td>tblDepLocation</td><td>8</td></tr>
<tr><td>tblProject</td><td>6</td></tr>
<tr><td>tblWorksOn</td><td>16</td></tr>
</tbody>
</table>
<p>Every line of the diagram is one foreign key — SQL Server lists them from its catalog:</p>
<pre><code class="language-sql">-- Every line of the diagram = one foreign key
SELECT OBJECT_NAME(fk.parent_object_id)     AS bang_con,
       COL_NAME(fc.parent_object_id, fc.parent_column_id) AS cot,
       OBJECT_NAME(fk.referenced_object_id) AS bang_cha,
       fk.name                              AS rang_buoc
FROM sys.foreign_keys fk
JOIN sys.foreign_key_columns fc ON fc.constraint_object_id = fk.object_id
ORDER BY bang_con, cot;</code></pre>
<table>
<thead><tr><th>bang_con</th><th>cot</th><th>bang_cha</th><th>rang_buoc</th></tr></thead>
<tbody>
<tr><td>tblDepartment</td><td>mgrSSN</td><td>tblEmployee</td><td>fk_department_manager</td></tr>
<tr><td>tblDependent</td><td>empSSN</td><td>tblEmployee</td><td>fk_dependent_employee</td></tr>
<tr><td>tblDepLocation</td><td>depNum</td><td>tblDepartment</td><td>fk_deplocation_department</td></tr>
<tr><td>tblDepLocation</td><td>locNum</td><td>tblLocation</td><td>fk_deplocation_location</td></tr>
<tr><td>tblEmployee</td><td>depNum</td><td>tblDepartment</td><td>fk_employee_department</td></tr>
<tr><td>tblEmployee</td><td>supervisorSSN</td><td>tblEmployee</td><td>fk_employee_supervisor</td></tr>
<tr><td>tblProject</td><td>depNum</td><td>tblDepartment</td><td>fk_project_department</td></tr>
<tr><td>tblProject</td><td>locNum</td><td>tblLocation</td><td>fk_project_location</td></tr>
<tr><td>tblWorksOn</td><td>empSSN</td><td>tblEmployee</td><td>fk_workson_employee</td></tr>
<tr><td>tblWorksOn</td><td>proNum</td><td>tblProject</td><td>fk_workson_project</td></tr>
</tbody>
</table>
<p>And the departments with their managers:</p>
<pre><code class="language-sql">SELECT * FROM tblDepartment ORDER BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>mgrSSN</th><th>mgrAssDate</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>30121050010</td><td>2018-06-15</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>30121050020</td><td>2019-03-01</td></tr>
<tr><td>4</td><td>Phòng Hành chính</td><td>30121050030</td><td>2020-09-01</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td><td>30121050037</td><td>2022-01-10</td></tr>
</tbody>
</table>
<p class="meo">🧠 Read a diagram line from the key icon (parent, "one") to the ∞ (child, "many"): one department — many employees. Link it back to the ERD of slide 5: WORKS_FOR N:1 is exactly the line tblEmployee.depNum → tblDepartment.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the same script (fuhcompany.pg.sql) builds the same 7 tables; the catalog shows the names in lower case, because unquoted names are folded to lower case (<code>tblEmployee</code> is stored as <code>tblemployee</code>; queries without quotes still work):
<pre><code class="language-sql">-- Names are stored in lower case in PostgreSQL's catalog
SELECT table_name, count(*) AS so_cot
FROM information_schema.columns
WHERE table_schema = 'public'
GROUP BY table_name
ORDER BY table_name;</code></pre>
<table>
<thead><tr><th>table_name</th><th>so_cot</th></tr></thead>
<tbody>
<tr><td>tbldepartment</td><td>4</td></tr>
<tr><td>tbldependent</td><td>5</td></tr>
<tr><td>tbldeplocation</td><td>2</td></tr>
<tr><td>tblemployee</td><td>8</td></tr>
<tr><td>tbllocation</td><td>2</td></tr>
<tr><td>tblproject</td><td>4</td></tr>
<tr><td>tblworkson</td><td>3</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-1-1-mo-hinh-quan-he">PostgreSQL 1.1 — the relational model</a>.</div>`,
        `<p class="y-chinh">🎯 Sơ đồ vật lý (physical diagram) của FUHCompany: 7 bảng, biểu tượng chìa khoá ở mỗi cột khoá chính, và mỗi đường nối là một khoá ngoại (đầu chìa khoá = bảng cha, đầu ∞ = bảng con).</p>
<p>Hình trên slide này bị một hình khác che mất một phần; đúng sơ đồ này xuất hiện đầy đủ ở bộ slide Chapter 8 của trường (slide 4). Viết lại bằng chữ:</p>
<table>
<thead><tr><th>Bảng</th><th>Các cột (cột khoá gạch chân trên sơ đồ)</th><th>Khoá ngoại</th></tr></thead>
<tbody>
<tr><td>tblDepartment</td><td><u>depNum</u>, depName, mgrSSN, mgrAssDate</td><td>mgrSSN → tblEmployee</td></tr>
<tr><td>tblEmployee</td><td><u>empSSN</u>, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN</td><td>depNum → tblDepartment; supervisorSSN → tblEmployee (chính nó)</td></tr>
<tr><td>tblDependent</td><td><u>depName</u>, <u>empSSN</u>, depSex, depBirthdate, depRelationship</td><td>empSSN → tblEmployee</td></tr>
<tr><td>tblLocation</td><td><u>locNum</u>, locName</td><td>—</td></tr>
<tr><td>tblDepLocation</td><td><u>depNum</u>, <u>locNum</u></td><td>depNum → tblDepartment; locNum → tblLocation</td></tr>
<tr><td>tblProject</td><td><u>proNum</u>, proName, locNum, depNum</td><td>locNum → tblLocation; depNum → tblDepartment</td></tr>
<tr><td>tblWorksOn</td><td><u>empSSN</u>, <u>proNum</u>, workHours</td><td>empSSN → tblEmployee; proNum → tblProject</td></tr>
</tbody>
</table>
<p>Script dựng nó (chạy trước mọi ví dụ của môn) tạo bảng cha trước, thêm khoá ngoại trưởng phòng bị vòng tròn bằng ALTER (slide 19), rồi chèn dữ liệu mẫu. Số dòng của mỗi bảng:</p>
<pre><code class="language-sql">-- 7 bảng và số dòng của mỗi bảng
SELECT 'tblDepartment' AS bang, COUNT(*) AS so_dong FROM tblDepartment
UNION ALL SELECT 'tblEmployee',    COUNT(*) FROM tblEmployee
UNION ALL SELECT 'tblDependent',   COUNT(*) FROM tblDependent
UNION ALL SELECT 'tblLocation',    COUNT(*) FROM tblLocation
UNION ALL SELECT 'tblDepLocation', COUNT(*) FROM tblDepLocation
UNION ALL SELECT 'tblProject',     COUNT(*) FROM tblProject
UNION ALL SELECT 'tblWorksOn',     COUNT(*) FROM tblWorksOn;</code></pre>
<table>
<thead><tr><th>bang</th><th>so_dong</th></tr></thead>
<tbody>
<tr><td>tblDepartment</td><td>5</td></tr>
<tr><td>tblEmployee</td><td>14</td></tr>
<tr><td>tblDependent</td><td>5</td></tr>
<tr><td>tblLocation</td><td>4</td></tr>
<tr><td>tblDepLocation</td><td>8</td></tr>
<tr><td>tblProject</td><td>6</td></tr>
<tr><td>tblWorksOn</td><td>16</td></tr>
</tbody>
</table>
<p>Mỗi đường nối trên sơ đồ là một khoá ngoại — SQL Server liệt kê chúng từ danh mục hệ thống (catalog):</p>
<pre><code class="language-sql">-- Mỗi đường nối trên sơ đồ = một khoá ngoại
SELECT OBJECT_NAME(fk.parent_object_id)     AS bang_con,
       COL_NAME(fc.parent_object_id, fc.parent_column_id) AS cot,
       OBJECT_NAME(fk.referenced_object_id) AS bang_cha,
       fk.name                              AS rang_buoc
FROM sys.foreign_keys fk
JOIN sys.foreign_key_columns fc ON fc.constraint_object_id = fk.object_id
ORDER BY bang_con, cot;</code></pre>
<table>
<thead><tr><th>bang_con</th><th>cot</th><th>bang_cha</th><th>rang_buoc</th></tr></thead>
<tbody>
<tr><td>tblDepartment</td><td>mgrSSN</td><td>tblEmployee</td><td>fk_department_manager</td></tr>
<tr><td>tblDependent</td><td>empSSN</td><td>tblEmployee</td><td>fk_dependent_employee</td></tr>
<tr><td>tblDepLocation</td><td>depNum</td><td>tblDepartment</td><td>fk_deplocation_department</td></tr>
<tr><td>tblDepLocation</td><td>locNum</td><td>tblLocation</td><td>fk_deplocation_location</td></tr>
<tr><td>tblEmployee</td><td>depNum</td><td>tblDepartment</td><td>fk_employee_department</td></tr>
<tr><td>tblEmployee</td><td>supervisorSSN</td><td>tblEmployee</td><td>fk_employee_supervisor</td></tr>
<tr><td>tblProject</td><td>depNum</td><td>tblDepartment</td><td>fk_project_department</td></tr>
<tr><td>tblProject</td><td>locNum</td><td>tblLocation</td><td>fk_project_location</td></tr>
<tr><td>tblWorksOn</td><td>empSSN</td><td>tblEmployee</td><td>fk_workson_employee</td></tr>
<tr><td>tblWorksOn</td><td>proNum</td><td>tblProject</td><td>fk_workson_project</td></tr>
</tbody>
</table>
<p>Và các phòng ban cùng trưởng phòng:</p>
<pre><code class="language-sql">SELECT * FROM tblDepartment ORDER BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>mgrSSN</th><th>mgrAssDate</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>30121050010</td><td>2018-06-15</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>30121050020</td><td>2019-03-01</td></tr>
<tr><td>4</td><td>Phòng Hành chính</td><td>30121050030</td><td>2020-09-01</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td><td>30121050037</td><td>2022-01-10</td></tr>
</tbody>
</table>
<p class="meo">🧠 Đọc một đường nối từ chìa khoá (bảng cha, phía "một") tới ∞ (bảng con, phía "nhiều"): một phòng — nhiều nhân viên. Nối lại với ERD ở slide 5: WORKS_FOR N:1 chính là đường tblEmployee.depNum → tblDepartment.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> cùng script (fuhcompany.pg.sql) dựng đúng 7 bảng đó; danh mục hiện tên chữ thường, vì tên không đặt trong nháy kép bị gấp về chữ thường (<code>tblEmployee</code> được lưu là <code>tblemployee</code>; truy vấn không nháy vẫn chạy):
<pre><code class="language-sql">-- Tên được lưu chữ thường trong danh mục của PostgreSQL
SELECT table_name, count(*) AS so_cot
FROM information_schema.columns
WHERE table_schema = 'public'
GROUP BY table_name
ORDER BY table_name;</code></pre>
<table>
<thead><tr><th>table_name</th><th>so_cot</th></tr></thead>
<tbody>
<tr><td>tbldepartment</td><td>4</td></tr>
<tr><td>tbldependent</td><td>5</td></tr>
<tr><td>tbldeplocation</td><td>2</td></tr>
<tr><td>tblemployee</td><td>8</td></tr>
<tr><td>tbllocation</td><td>2</td></tr>
<tr><td>tblproject</td><td>4</td></tr>
<tr><td>tblworkson</td><td>3</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-1-1-mo-hinh-quan-he">PostgreSQL 1.1 — mô hình quan hệ</a>.</div>`],
    ]),
    books([
      ['ullman', 'Ullman &amp; Widom, A First Course in Database Systems — 2.3 (defining a relation schema in SQL: CREATE, DROP, ALTER, defaults, keys), 7.1 (keys and foreign keys)', 'Ullman &amp; Widom, A First Course in Database Systems — 2.3 (định nghĩa lược đồ quan hệ trong SQL: CREATE, DROP, ALTER, giá trị mặc định, khoá), 7.1 (khoá và khoá ngoại)'],
      ['chopra', 'Chopra, DBMS: A Practical Approach — chapter on SQL DDL (data types, CREATE/ALTER/DROP TABLE)', 'Chopra, DBMS: A Practical Approach — chương SQL DDL (kiểu dữ liệu, CREATE/ALTER/DROP TABLE)'],
    ]),
  ].join('\n'),
};

/* ───────── 5.4 — 🧪 Practice + 🗂 Glossary + 📌 Summary · SQL DDL: tables, constraints, ALTER & DROP ───────── */
const L_on_ch5 = {
  title: '5.4 — 🧪 Practice + 🗂 Glossary + 📌 Summary · SQL DDL: tables, constraints, ALTER & DROP|||5.4 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · SQL DDL: bảng, ràng buộc, ALTER & DROP',
  slug: 'dbi202-on-ch5',
  type: 'VIDEO',
  description: '7 bài tập đúng dạng câu 1–2 đề PE: tạo 4 bảng bán hàng đủ PK/FK/UNIQUE/CHECK/DEFAULT/IDENTITY từ mô tả, chèn dữ liệu thử vi phạm từng ràng buộc để thấy lỗi thật, ALTER trên bảng đã có dữ liệu, thêm ràng buộc vào FUHCompany, xoá bảng đúng thứ tự, truy vấn NULL/LIKE/ngày, đề mini CLB có thực thể yếu và M:N — chạy thật trên SQL Server, kèm bản PostgreSQL; 20 thuật ngữ Anh–Việt; bảng T-SQL ↔ PostgreSQL cho DDL; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.4 · Practice &amp; review</span>
<h2>SQL DDL — practise like PE questions 1 and 2</h2>
<p class="lead">Seven exercises in the style of the practical exam (PE, 85 minutes): turn a description into CREATE TABLE statements with every constraint, then prove each constraint works by inserting bad rows and reading the real error, then change and drop tables that already hold data. Every script below really ran on SQL Server; where PostgreSQL is written differently, its version ran too.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read the task only. In SSMS (or on paper) write your own script first — about 10–15 minutes per exercise.</li>
<li>Run it. Then compare with the solution <strong>and its real output</strong>: same number of constraints, same errors on the bad rows?</li>
<li>Read the trap under each solution — they are the mistakes that lose PE marks.</li>
</ol></div>
<table>
<thead><tr><th>PE habit</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Create parents before children; drop children before parents</td><td>a FOREIGN KEY needs its target table to exist</td></tr>
<tr><td>Name every constraint: <code>pk_</code>, <code>fk_child_parent</code>, <code>uq_</code>, <code>ck_</code>, <code>df_</code></td><td>readable errors, and you can drop/alter it later by name</td></tr>
<tr><td><code>NVARCHAR</code> + <code>N'…'</code> for any Vietnamese text</td><td>without N the accents become "?"</td></tr>
<tr><td>Test each constraint with one bad INSERT</td><td>the marker checks that the rule really exists</td></tr>
<tr><td>Put <code>GO</code> between batches in SSMS</td><td>one failing statement does not hide the others</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.4 · Thực hành &amp; ôn tập</span>
<h2>SQL DDL — luyện đúng như câu 1 và câu 2 đề PE</h2>
<p class="lead">Bảy bài tập theo kiểu đề thi thực hành (PE, 85 phút): biến một đoạn mô tả thành các câu CREATE TABLE đủ mọi ràng buộc, rồi chứng minh từng ràng buộc hoạt động bằng cách chèn dòng sai và đọc lỗi thật, rồi sửa và xoá các bảng đã có dữ liệu. Mọi script bên dưới đã chạy thật trên SQL Server; chỗ nào PostgreSQL viết khác thì bản PostgreSQL cũng đã chạy.</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Chỉ đọc đề. Tự viết script trong SSMS (hoặc trên giấy) trước — khoảng 10–15 phút mỗi bài.</li>
<li>Chạy thử. Rồi so với lời giải <strong>và output thật</strong> của nó: cùng số ràng buộc chưa, cùng lỗi ở các dòng sai chưa?</li>
<li>Đọc cái bẫy dưới mỗi lời giải — đó là những lỗi làm mất điểm PE.</li>
</ol></div>
<table>
<thead><tr><th>Thói quen khi thi PE</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Tạo bảng cha trước bảng con; xoá bảng con trước bảng cha</td><td>FOREIGN KEY cần bảng đích đã tồn tại</td></tr>
<tr><td>Đặt tên mọi ràng buộc: <code>pk_</code>, <code>fk_con_cha</code>, <code>uq_</code>, <code>ck_</code>, <code>df_</code></td><td>lỗi dễ đọc, và xoá/sửa được theo tên về sau</td></tr>
<tr><td><code>NVARCHAR</code> + <code>N'…'</code> cho mọi chữ tiếng Việt</td><td>thiếu N thì dấu thành "?"</td></tr>
<tr><td>Thử mỗi ràng buộc bằng một câu INSERT sai</td><td>người chấm kiểm xem luật có thật sự tồn tại không</td></tr>
<tr><td>Đặt <code>GO</code> giữa các lô (batch) trong SSMS</td><td>một câu lỗi không làm "chìm" các câu khác</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — A small sales database from a description (PE question 1 · ~15 min)</h3>
<p class="nhan">Task</p>
<p>A shop stores its <strong>customers</strong> (code of exactly 5 characters, full name compulsory, e-mail — optional but never shared by two customers, city — Hà Nội if not given), its <strong>products</strong> (number generated automatically, name compulsory and unique, price greater than 0, stock never negative and 0 by default), its <strong>orders</strong> (number generated automatically, the customer who ordered — compulsory, order date — today by default, status NEW / PAID / CANCELLED, NEW by default) and the <strong>order lines</strong> (which product, in which order, quantity greater than 0, unit price). A product appears at most once in an order.</p>
<p class="nhan">Analysis — the ERD in words</p>
<table>
<thead><tr><th>Relationship</th><th>One side</th><th>Other side</th><th>Stored as</th></tr></thead>
<tbody>
<tr><td>Customer — places — Order</td><td>a customer places many orders</td><td>an order belongs to exactly one customer</td><td>FK customerID NOT NULL in Orders</td></tr>
<tr><td>Order — contains — Product (quantity, unitPrice)</td><td>an order has many products</td><td>a product is in many orders</td><td>M:N → table OrderLine, key (orderID, productID)</td></tr>
</tbody>
</table>
<p class="nhan">Solution</p>
<pre><code class="language-sql">CREATE TABLE Customer (
    customerID  CHAR(5)       NOT NULL,
    fullName    NVARCHAR(50)  NOT NULL,
    email       VARCHAR(100)  NULL,
    city        NVARCHAR(30)  NOT NULL CONSTRAINT df_customer_city DEFAULT N'Hà Nội',
    CONSTRAINT pk_customer       PRIMARY KEY (customerID),
    CONSTRAINT uq_customer_email UNIQUE (email)
);
CREATE TABLE Product (
    productID    INT IDENTITY(1,1) NOT NULL,
    productName  NVARCHAR(100) NOT NULL,
    price        DECIMAL(12,0) NOT NULL,
    stock        INT           NOT NULL CONSTRAINT df_product_stock DEFAULT 0,
    CONSTRAINT pk_product        PRIMARY KEY (productID),
    CONSTRAINT uq_product_name   UNIQUE (productName),
    CONSTRAINT ck_product_price  CHECK (price &gt; 0),
    CONSTRAINT ck_product_stock  CHECK (stock &gt;= 0)
);
CREATE TABLE Orders (
    orderID     INT IDENTITY(1,1) NOT NULL,
    customerID  CHAR(5)     NOT NULL,
    orderDate   DATE        NOT NULL CONSTRAINT df_orders_date DEFAULT CAST(GETDATE() AS DATE),
    status      VARCHAR(10) NOT NULL CONSTRAINT df_orders_status DEFAULT 'NEW',
    CONSTRAINT pk_orders          PRIMARY KEY (orderID),
    CONSTRAINT fk_orders_customer FOREIGN KEY (customerID) REFERENCES Customer (customerID),
    CONSTRAINT ck_orders_status   CHECK (status IN ('NEW', 'PAID', 'CANCELLED'))
);
CREATE TABLE OrderLine (
    orderID    INT           NOT NULL,
    productID  INT           NOT NULL,
    quantity   INT           NOT NULL,
    unitPrice  DECIMAL(12,0) NOT NULL,
    CONSTRAINT pk_orderline          PRIMARY KEY (orderID, productID),
    CONSTRAINT fk_orderline_orders   FOREIGN KEY (orderID)   REFERENCES Orders (orderID),
    CONSTRAINT fk_orderline_product  FOREIGN KEY (productID) REFERENCES Product (productID),
    CONSTRAINT ck_orderline_quantity CHECK (quantity &gt; 0)
);
-- Self-check: constraints per table and kind
SELECT TABLE_NAME,
       SUM(CASE WHEN CONSTRAINT_TYPE = 'PRIMARY KEY' THEN 1 ELSE 0 END) AS so_PK,
       SUM(CASE WHEN CONSTRAINT_TYPE = 'FOREIGN KEY' THEN 1 ELSE 0 END) AS so_FK,
       SUM(CASE WHEN CONSTRAINT_TYPE = 'UNIQUE'      THEN 1 ELSE 0 END) AS so_UQ,
       SUM(CASE WHEN CONSTRAINT_TYPE = 'CHECK'       THEN 1 ELSE 0 END) AS so_CK
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
GROUP BY TABLE_NAME
ORDER BY TABLE_NAME;</code></pre>
<table>
<thead><tr><th>TABLE_NAME</th><th>so_PK</th><th>so_FK</th><th>so_UQ</th><th>so_CK</th></tr></thead>
<tbody>
<tr><td>Customer</td><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>OrderLine</td><td>1</td><td>2</td><td>0</td><td>1</td></tr>
<tr><td>Orders</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>Product</td><td>1</td><td>0</td><td>1</td><td>2</td></tr>
</tbody>
</table>
<ul>
<li>"Exactly 5 characters" → <code>CHAR(5)</code>; "optional but never shared" → <code>NULL</code> + <code>UNIQUE</code>; "Hà Nội if not given" → <code>DEFAULT N'Hà Nội'</code>.</li>
<li>"Generated automatically" → <code>INT IDENTITY(1,1)</code>. "Today by default" → <code>DEFAULT CAST(GETDATE() AS DATE)</code> (GETDATE() also has a time part).</li>
<li>"At most once in an order" is the composite primary key <code>(orderID, productID)</code>.</li>
<li>The last query is the self-check: per table, how many PK / FK / UNIQUE / CHECK — compare with your own script.</li>
</ul>
<div class="pitfall"><code>ORDER</code> is a reserved word (ORDER BY). Name the table <code>Orders</code>, or you must write <code>[Order]</code> everywhere. And never put a CHECK such as <code>price &gt; 0</code> on a nullable column expecting it to force a value: CHECK accepts NULL (UNKNOWN is not FALSE) — use NOT NULL as well.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> (the style you will use at work: snake_case names) the same design uses <code>GENERATED ALWAYS AS IDENTITY</code>, <code>DEFAULT CURRENT_DATE</code>, <code>VARCHAR</code> and plain <code>'…'</code>:
<pre><code class="language-sql">CREATE TABLE customer (
    customer_id  CHAR(5)      PRIMARY KEY,
    full_name    VARCHAR(50)  NOT NULL,
    email        VARCHAR(100) CONSTRAINT uq_customer_email UNIQUE,
    city         VARCHAR(30)  NOT NULL DEFAULT 'Hà Nội'
);
CREATE TABLE product (
    product_id    INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_name  VARCHAR(100) NOT NULL CONSTRAINT uq_product_name UNIQUE,
    price         NUMERIC(12,0) NOT NULL CONSTRAINT ck_product_price CHECK (price &gt; 0),
    stock         INT NOT NULL DEFAULT 0 CONSTRAINT ck_product_stock CHECK (stock &gt;= 0)
);
CREATE TABLE orders (
    order_id     INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id  CHAR(5) NOT NULL REFERENCES customer (customer_id),
    order_date   DATE NOT NULL DEFAULT CURRENT_DATE,
    status       VARCHAR(10) NOT NULL DEFAULT 'NEW'
                 CONSTRAINT ck_orders_status CHECK (status IN ('NEW', 'PAID', 'CANCELLED'))
);
CREATE TABLE order_line (
    order_id    INT NOT NULL REFERENCES orders (order_id),
    product_id  INT NOT NULL REFERENCES product (product_id),
    quantity    INT NOT NULL CHECK (quantity &gt; 0),
    unit_price  NUMERIC(12,0) NOT NULL,
    PRIMARY KEY (order_id, product_id)
);
INSERT INTO customer (customer_id, full_name) VALUES ('KH001', 'Nguyễn Thu Trang');
INSERT INTO orders (customer_id) VALUES ('KH001');
SELECT order_id, customer_id, status, order_date = CURRENT_DATE AS la_hom_nay FROM orders;</code></pre>
<div class="out">INSERT 0 1<br>
INSERT 0 1</div>
<table>
<thead><tr><th>order_id</th><th>customer_id</th><th>status</th><th>la_hom_nay</th></tr></thead>
<tbody>
<tr><td>1</td><td>KH001</td><td>NEW</td><td>t</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL 3.2 — foreign keys</a>.</div>`,
    `<h3>🧪 Bài 1 — CSDL bán hàng nhỏ từ một đoạn mô tả (câu 1 đề PE · ~15 phút)</h3>
<p class="nhan">Đề</p>
<p>Một cửa hàng lưu <strong>khách hàng</strong> (mã đúng 5 ký tự, họ tên bắt buộc, email — không bắt buộc nhưng không bao giờ hai khách trùng nhau, thành phố — mặc định Hà Nội), <strong>sản phẩm</strong> (số tự sinh, tên bắt buộc và không trùng, giá lớn hơn 0, tồn kho không âm và mặc định 0), <strong>đơn hàng</strong> (số tự sinh, khách đặt — bắt buộc, ngày đặt — mặc định hôm nay, trạng thái NEW / PAID / CANCELLED, mặc định NEW) và <strong>dòng đơn hàng</strong> (sản phẩm nào, thuộc đơn nào, số lượng lớn hơn 0, đơn giá). Một sản phẩm xuất hiện tối đa một lần trong một đơn.</p>
<p class="nhan">Phân tích — ERD bằng chữ</p>
<table>
<thead><tr><th>Liên kết</th><th>Một phía</th><th>Phía kia</th><th>Lưu thành</th></tr></thead>
<tbody>
<tr><td>Khách — đặt — Đơn</td><td>một khách đặt nhiều đơn</td><td>một đơn thuộc đúng một khách</td><td>khoá ngoại customerID NOT NULL trong Orders</td></tr>
<tr><td>Đơn — gồm — Sản phẩm (quantity, unitPrice)</td><td>một đơn có nhiều sản phẩm</td><td>một sản phẩm nằm trong nhiều đơn</td><td>M:N → bảng OrderLine, khoá (orderID, productID)</td></tr>
</tbody>
</table>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">CREATE TABLE Customer (
    customerID  CHAR(5)       NOT NULL,
    fullName    NVARCHAR(50)  NOT NULL,
    email       VARCHAR(100)  NULL,
    city        NVARCHAR(30)  NOT NULL CONSTRAINT df_customer_city DEFAULT N'Hà Nội',
    CONSTRAINT pk_customer       PRIMARY KEY (customerID),
    CONSTRAINT uq_customer_email UNIQUE (email)
);
CREATE TABLE Product (
    productID    INT IDENTITY(1,1) NOT NULL,
    productName  NVARCHAR(100) NOT NULL,
    price        DECIMAL(12,0) NOT NULL,
    stock        INT           NOT NULL CONSTRAINT df_product_stock DEFAULT 0,
    CONSTRAINT pk_product        PRIMARY KEY (productID),
    CONSTRAINT uq_product_name   UNIQUE (productName),
    CONSTRAINT ck_product_price  CHECK (price &gt; 0),
    CONSTRAINT ck_product_stock  CHECK (stock &gt;= 0)
);
CREATE TABLE Orders (
    orderID     INT IDENTITY(1,1) NOT NULL,
    customerID  CHAR(5)     NOT NULL,
    orderDate   DATE        NOT NULL CONSTRAINT df_orders_date DEFAULT CAST(GETDATE() AS DATE),
    status      VARCHAR(10) NOT NULL CONSTRAINT df_orders_status DEFAULT 'NEW',
    CONSTRAINT pk_orders          PRIMARY KEY (orderID),
    CONSTRAINT fk_orders_customer FOREIGN KEY (customerID) REFERENCES Customer (customerID),
    CONSTRAINT ck_orders_status   CHECK (status IN ('NEW', 'PAID', 'CANCELLED'))
);
CREATE TABLE OrderLine (
    orderID    INT           NOT NULL,
    productID  INT           NOT NULL,
    quantity   INT           NOT NULL,
    unitPrice  DECIMAL(12,0) NOT NULL,
    CONSTRAINT pk_orderline          PRIMARY KEY (orderID, productID),
    CONSTRAINT fk_orderline_orders   FOREIGN KEY (orderID)   REFERENCES Orders (orderID),
    CONSTRAINT fk_orderline_product  FOREIGN KEY (productID) REFERENCES Product (productID),
    CONSTRAINT ck_orderline_quantity CHECK (quantity &gt; 0)
);
-- Tự kiểm: số ràng buộc theo bảng và theo loại
SELECT TABLE_NAME,
       SUM(CASE WHEN CONSTRAINT_TYPE = 'PRIMARY KEY' THEN 1 ELSE 0 END) AS so_PK,
       SUM(CASE WHEN CONSTRAINT_TYPE = 'FOREIGN KEY' THEN 1 ELSE 0 END) AS so_FK,
       SUM(CASE WHEN CONSTRAINT_TYPE = 'UNIQUE'      THEN 1 ELSE 0 END) AS so_UQ,
       SUM(CASE WHEN CONSTRAINT_TYPE = 'CHECK'       THEN 1 ELSE 0 END) AS so_CK
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
GROUP BY TABLE_NAME
ORDER BY TABLE_NAME;</code></pre>
<table>
<thead><tr><th>TABLE_NAME</th><th>so_PK</th><th>so_FK</th><th>so_UQ</th><th>so_CK</th></tr></thead>
<tbody>
<tr><td>Customer</td><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>OrderLine</td><td>1</td><td>2</td><td>0</td><td>1</td></tr>
<tr><td>Orders</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>Product</td><td>1</td><td>0</td><td>1</td><td>2</td></tr>
</tbody>
</table>
<ul>
<li>"Đúng 5 ký tự" → <code>CHAR(5)</code>; "không bắt buộc nhưng không trùng" → <code>NULL</code> + <code>UNIQUE</code>; "mặc định Hà Nội" → <code>DEFAULT N'Hà Nội'</code>.</li>
<li>"Tự sinh" → <code>INT IDENTITY(1,1)</code>. "Mặc định hôm nay" → <code>DEFAULT CAST(GETDATE() AS DATE)</code> (GETDATE() có cả phần giờ).</li>
<li>"Tối đa một lần trong một đơn" chính là khoá chính ghép <code>(orderID, productID)</code>.</li>
<li>Câu truy vấn cuối là phần tự kiểm: mỗi bảng có bao nhiêu PK / FK / UNIQUE / CHECK — so với script của bạn.</li>
</ul>
<div class="pitfall"><code>ORDER</code> là từ khoá dành riêng (reserved word — ORDER BY). Đặt tên bảng là <code>Orders</code>, nếu không phải viết <code>[Order]</code> ở mọi chỗ. Và đừng tưởng CHECK như <code>price &gt; 0</code> trên cột cho phép NULL sẽ ép phải có giá trị: CHECK chấp nhận NULL (UNKNOWN không phải FALSE) — phải thêm NOT NULL.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> (kiểu bạn sẽ dùng khi đi làm: tên snake_case) cùng thiết kế dùng <code>GENERATED ALWAYS AS IDENTITY</code>, <code>DEFAULT CURRENT_DATE</code>, <code>VARCHAR</code> và <code>'…'</code> thường:
<pre><code class="language-sql">CREATE TABLE customer (
    customer_id  CHAR(5)      PRIMARY KEY,
    full_name    VARCHAR(50)  NOT NULL,
    email        VARCHAR(100) CONSTRAINT uq_customer_email UNIQUE,
    city         VARCHAR(30)  NOT NULL DEFAULT 'Hà Nội'
);
CREATE TABLE product (
    product_id    INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_name  VARCHAR(100) NOT NULL CONSTRAINT uq_product_name UNIQUE,
    price         NUMERIC(12,0) NOT NULL CONSTRAINT ck_product_price CHECK (price &gt; 0),
    stock         INT NOT NULL DEFAULT 0 CONSTRAINT ck_product_stock CHECK (stock &gt;= 0)
);
CREATE TABLE orders (
    order_id     INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id  CHAR(5) NOT NULL REFERENCES customer (customer_id),
    order_date   DATE NOT NULL DEFAULT CURRENT_DATE,
    status       VARCHAR(10) NOT NULL DEFAULT 'NEW'
                 CONSTRAINT ck_orders_status CHECK (status IN ('NEW', 'PAID', 'CANCELLED'))
);
CREATE TABLE order_line (
    order_id    INT NOT NULL REFERENCES orders (order_id),
    product_id  INT NOT NULL REFERENCES product (product_id),
    quantity    INT NOT NULL CHECK (quantity &gt; 0),
    unit_price  NUMERIC(12,0) NOT NULL,
    PRIMARY KEY (order_id, product_id)
);
INSERT INTO customer (customer_id, full_name) VALUES ('KH001', 'Nguyễn Thu Trang');
INSERT INTO orders (customer_id) VALUES ('KH001');
SELECT order_id, customer_id, status, order_date = CURRENT_DATE AS la_hom_nay FROM orders;</code></pre>
<div class="out">INSERT 0 1<br>
INSERT 0 1</div>
<table>
<thead><tr><th>order_id</th><th>customer_id</th><th>status</th><th>la_hom_nay</th></tr></thead>
<tbody>
<tr><td>1</td><td>KH001</td><td>NEW</td><td>t</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL 3.2 — khoá ngoại</a>.</div>`),
    bi(`<h3>🧪 Exercise 2 — Prove every constraint: insert bad rows (PE question 2 · ~10 min)</h3>
<p class="nhan">Task</p>
<p>On the tables of exercise 1 (with customer KH001 and one product already inserted), write one INSERT (or DELETE) that breaks each rule: (a) duplicate customer code, (b) duplicate e-mail, (c) price 0, (d) an order of customer KH999, (e) status SHIPPED, then (f) a correct order that gives no date and no status, and (g) delete customer KH001 who now has an order. Predict each error before running.</p>
<p class="nhan">Solution and real output</p>
<pre><code class="language-sql">-- (a) duplicate primary key
INSERT INTO Customer (customerID, fullName) VALUES ('KH001', N'Trần Văn Hải');
GO
-- (b) duplicate e-mail (UNIQUE)
INSERT INTO Customer (customerID, fullName, email) VALUES ('KH002', N'Trần Văn Hải', 'trang@gmail.com');
GO
-- (c) price 0 (CHECK)
INSERT INTO Product (productName, price) VALUES (N'Chuột quà tặng', 0);
GO
-- (d) order of a customer that does not exist (FOREIGN KEY)
INSERT INTO Orders (customerID) VALUES ('KH999');
GO
-- (e) unknown status (CHECK)
INSERT INTO Orders (customerID, status) VALUES ('KH001', 'SHIPPED');
GO
-- (f) a correct order: date and status come from the DEFAULTs
INSERT INTO Orders (customerID) VALUES ('KH001');
SELECT orderID, customerID, status, CASE WHEN orderDate = CAST(GETDATE() AS DATE) THEN 'hôm nay' ELSE 'khác' END AS ngay FROM Orders;
GO
-- (g) delete a customer who has an order
DELETE FROM Customer WHERE customerID = 'KH001';</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'pk_customer'. Cannot insert duplicate key in object 'dbo.Customer'. The duplicate key value is (KH001).</b><br>
The statement has been terminated.<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of UNIQUE KEY constraint 'uq_customer_email'. Cannot insert duplicate key in object 'dbo.Customer'. The duplicate key value is (trang@gmail.com).</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "ck_product_price". The conflict occurred in database "DBI202", table "dbo.Product", column 'price'.</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the FOREIGN KEY constraint "fk_orders_customer". The conflict occurred in database "DBI202", table "dbo.Customer", column 'customerID'.</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "ck_orders_status". The conflict occurred in database "DBI202", table "dbo.Orders", column 'status'.</b><br>
The statement has been terminated.<br>
(1 row affected)</div>
<table>
<thead><tr><th>orderID</th><th>customerID</th><th>status</th><th>ngay</th></tr></thead>
<tbody>
<tr><td>3</td><td>KH001</td><td>NEW</td><td>hôm nay</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The DELETE statement conflicted with the REFERENCE constraint "fk_orders_customer". The conflict occurred in database "DBI202", table "dbo.Orders", column 'customerID'.</b><br>
The statement has been terminated.</div>
<table>
<thead><tr><th>Case</th><th>Error</th><th>Constraint named in the message</th></tr></thead>
<tbody>
<tr><td>(a)</td><td>Msg 2627</td><td>pk_customer</td></tr>
<tr><td>(b)</td><td>Msg 2627</td><td>uq_customer_email</td></tr>
<tr><td>(c), (e)</td><td>Msg 547</td><td>ck_product_price, ck_orders_status</td></tr>
<tr><td>(d)</td><td>Msg 547 (INSERT)</td><td>fk_orders_customer</td></tr>
<tr><td>(g)</td><td>Msg 547 (DELETE)</td><td>fk_orders_customer — the child row protects the parent</td></tr>
</tbody>
</table>
<p>(f) worked: the date is today and the status NEW. Its orderID is <strong>3</strong>, not 1 — the refused inserts (d) and (e) had already consumed identity numbers 1 and 2.</p>
<div class="pitfall">Without <code>GO</code> between the statements, SSMS stops the batch at the first error only for some errors and not others — you may think a later INSERT ran when it did not. One test = one batch.</div>`,
    `<h3>🧪 Bài 2 — Chứng minh từng ràng buộc: chèn dòng sai (câu 2 đề PE · ~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Trên các bảng của bài 1 (đã có khách KH001 và một sản phẩm), viết mỗi luật một câu INSERT (hoặc DELETE) vi phạm nó: (a) trùng mã khách, (b) trùng email, (c) giá 0, (d) đơn của khách KH999, (e) trạng thái SHIPPED, rồi (f) một đơn đúng không ghi ngày và trạng thái, và (g) xoá khách KH001 lúc này đã có đơn. Đoán trước lỗi của từng câu rồi mới chạy.</p>
<p class="nhan">Lời giải và output thật</p>
<pre><code class="language-sql">-- (a) trùng khoá chính
INSERT INTO Customer (customerID, fullName) VALUES ('KH001', N'Trần Văn Hải');
GO
-- (b) trùng email (UNIQUE)
INSERT INTO Customer (customerID, fullName, email) VALUES ('KH002', N'Trần Văn Hải', 'trang@gmail.com');
GO
-- (c) giá bằng 0 (CHECK)
INSERT INTO Product (productName, price) VALUES (N'Chuột quà tặng', 0);
GO
-- (d) đơn của khách không tồn tại (FOREIGN KEY)
INSERT INTO Orders (customerID) VALUES ('KH999');
GO
-- (e) trạng thái lạ (CHECK)
INSERT INTO Orders (customerID, status) VALUES ('KH001', 'SHIPPED');
GO
-- (f) một đơn đúng: ngày và trạng thái lấy từ DEFAULT
INSERT INTO Orders (customerID) VALUES ('KH001');
SELECT orderID, customerID, status, CASE WHEN orderDate = CAST(GETDATE() AS DATE) THEN 'hôm nay' ELSE 'khác' END AS ngay FROM Orders;
GO
-- (g) xoá khách đang có đơn
DELETE FROM Customer WHERE customerID = 'KH001';</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'pk_customer'. Cannot insert duplicate key in object 'dbo.Customer'. The duplicate key value is (KH001).</b><br>
The statement has been terminated.<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of UNIQUE KEY constraint 'uq_customer_email'. Cannot insert duplicate key in object 'dbo.Customer'. The duplicate key value is (trang@gmail.com).</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "ck_product_price". The conflict occurred in database "DBI202", table "dbo.Product", column 'price'.</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the FOREIGN KEY constraint "fk_orders_customer". The conflict occurred in database "DBI202", table "dbo.Customer", column 'customerID'.</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "ck_orders_status". The conflict occurred in database "DBI202", table "dbo.Orders", column 'status'.</b><br>
The statement has been terminated.<br>
(1 row affected)</div>
<table>
<thead><tr><th>orderID</th><th>customerID</th><th>status</th><th>ngay</th></tr></thead>
<tbody>
<tr><td>3</td><td>KH001</td><td>NEW</td><td>hôm nay</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The DELETE statement conflicted with the REFERENCE constraint "fk_orders_customer". The conflict occurred in database "DBI202", table "dbo.Orders", column 'customerID'.</b><br>
The statement has been terminated.</div>
<table>
<thead><tr><th>Trường hợp</th><th>Lỗi</th><th>Ràng buộc được nêu trong thông báo</th></tr></thead>
<tbody>
<tr><td>(a)</td><td>Msg 2627</td><td>pk_customer</td></tr>
<tr><td>(b)</td><td>Msg 2627</td><td>uq_customer_email</td></tr>
<tr><td>(c), (e)</td><td>Msg 547</td><td>ck_product_price, ck_orders_status</td></tr>
<tr><td>(d)</td><td>Msg 547 (INSERT)</td><td>fk_orders_customer</td></tr>
<tr><td>(g)</td><td>Msg 547 (DELETE)</td><td>fk_orders_customer — dòng con bảo vệ dòng cha</td></tr>
</tbody>
</table>
<p>(f) chạy được: ngày là hôm nay, trạng thái NEW. orderID của nó là <strong>3</strong>, không phải 1 — hai câu chèn bị từ chối (d) và (e) đã "ăn" mất số identity 1 và 2.</p>
<div class="pitfall">Không có <code>GO</code> giữa các câu thì SSMS dừng lô ở lỗi đầu tiên với loại lỗi này nhưng lại chạy tiếp với loại lỗi khác — bạn có thể tưởng một câu INSERT phía sau đã chạy trong khi nó không chạy. Mỗi phép thử = một lô.</div>`),
    bi(`<h3>🧪 Exercise 3 — ALTER a table that already has rows (~10 min)</h3>
<p class="nhan">Task</p>
<p>Customer already holds KH001 (trang@gmail.com), KH002 ('hai.tran' — no @) and KH003 (no e-mail). (1) Add a phone column. (2) Add the rule "an e-mail contains @ with something before and after it". (3) If it is refused, find the offending rows, correct them (KH002's real address is hai.tran@fpt.edu.vn) and add the rule again. (4) Widen city to 50 characters. (5) Remove the default of city.</p>
<p class="nhan">Solution and real output</p>
<pre><code class="language-sql">-- 1. Add a phone column
ALTER TABLE Customer ADD phone VARCHAR(15) NULL;
GO
-- 2. Rule "an e-mail must contain @": refused, KH002 breaks it
ALTER TABLE Customer ADD CONSTRAINT ck_customer_email CHECK (email LIKE '%_@_%');
GO
-- 3. Find the offending rows, fix them, add the rule again
SELECT customerID, email FROM Customer WHERE NOT (email LIKE '%_@_%');
UPDATE Customer SET email = 'hai.tran@fpt.edu.vn' WHERE customerID = 'KH002';
ALTER TABLE Customer ADD CONSTRAINT ck_customer_email CHECK (email LIKE '%_@_%');
GO
-- 4. Widen the city column
ALTER TABLE Customer ALTER COLUMN city NVARCHAR(50) NOT NULL;
GO
-- 5. Remove the default of city, by its name
ALTER TABLE Customer DROP CONSTRAINT df_customer_city;
GO
SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_NAME = 'Customer' ORDER BY CONSTRAINT_NAME;
SELECT customerID, email, phone FROM Customer ORDER BY customerID;</code></pre>
<div class="out">(3 rows affected)<br>
<b>Msg 547, Level 16, State 0<br>
The ALTER TABLE statement conflicted with the CHECK constraint "ck_customer_email". The conflict occurred in database "DBI202", table "dbo.Customer", column 'email'.</b></div>
<table>
<thead><tr><th>customerID</th><th>email</th></tr></thead>
<tbody>
<tr><td>KH002</td><td>hai.tran</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>CONSTRAINT_NAME</th><th>CONSTRAINT_TYPE</th></tr></thead>
<tbody>
<tr><td>ck_customer_email</td><td>CHECK</td></tr>
<tr><td>pk_customer</td><td>PRIMARY KEY</td></tr>
<tr><td>uq_customer_email</td><td>UNIQUE</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>customerID</th><th>email</th><th>phone</th></tr></thead>
<tbody>
<tr><td>KH001</td><td>trang@gmail.com</td><td><em>NULL</em></td></tr>
<tr><td>KH002</td><td>hai.tran@fpt.edu.vn</td><td><em>NULL</em></td></tr>
<tr><td>KH003</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<ul>
<li>Step 2 is refused (Msg 547): SQL Server checks existing rows when a CHECK is added.</li>
<li>The search <code>WHERE NOT (email LIKE '%_@_%')</code> shows only KH002. KH003 is not listed and did not block the rule: for NULL the condition is UNKNOWN — WHERE drops it, and CHECK accepts it.</li>
<li><code>ALTER COLUMN</code> must repeat <code>NOT NULL</code>; otherwise the column silently becomes nullable.</li>
<li><code>df_customer_city</code> could be dropped in one line only because it has a name.</li>
</ul>
<div class="callout">🐘 <strong>On PostgreSQL</strong>: <code>ALTER TABLE customer ADD COLUMN phone VARCHAR(15);</code>, <code>ALTER TABLE customer ALTER COLUMN city TYPE VARCHAR(50);</code> (NOT NULL is kept), <code>ALTER TABLE customer ALTER COLUMN city DROP DEFAULT;</code> — see the running versions in lesson 5.B, slide 18. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-4-alter-chuan-hoa">PostgreSQL 3.4 — ALTER TABLE</a>.</div>`,
    `<h3>🧪 Bài 3 — ALTER một bảng đã có dữ liệu (~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Customer đang có KH001 (trang@gmail.com), KH002 ('hai.tran' — thiếu @) và KH003 (không có email). (1) Thêm cột số điện thoại. (2) Thêm luật "email có @, trước và sau @ đều có chữ". (3) Nếu bị từ chối, tìm các dòng vi phạm, sửa (địa chỉ thật của KH002 là hai.tran@fpt.edu.vn) rồi thêm lại luật. (4) Nới cột city lên 50 ký tự. (5) Bỏ giá trị mặc định của city.</p>
<p class="nhan">Lời giải và output thật</p>
<pre><code class="language-sql">-- 1. Thêm cột số điện thoại
ALTER TABLE Customer ADD phone VARCHAR(15) NULL;
GO
-- 2. Luật "email phải có @": bị từ chối vì KH002 vi phạm
ALTER TABLE Customer ADD CONSTRAINT ck_customer_email CHECK (email LIKE '%_@_%');
GO
-- 3. Tìm dòng vi phạm, sửa, rồi thêm lại luật
SELECT customerID, email FROM Customer WHERE NOT (email LIKE '%_@_%');
UPDATE Customer SET email = 'hai.tran@fpt.edu.vn' WHERE customerID = 'KH002';
ALTER TABLE Customer ADD CONSTRAINT ck_customer_email CHECK (email LIKE '%_@_%');
GO
-- 4. Nới rộng cột city
ALTER TABLE Customer ALTER COLUMN city NVARCHAR(50) NOT NULL;
GO
-- 5. Bỏ giá trị mặc định của city, theo tên
ALTER TABLE Customer DROP CONSTRAINT df_customer_city;
GO
SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_NAME = 'Customer' ORDER BY CONSTRAINT_NAME;
SELECT customerID, email, phone FROM Customer ORDER BY customerID;</code></pre>
<div class="out">(3 rows affected)<br>
<b>Msg 547, Level 16, State 0<br>
The ALTER TABLE statement conflicted with the CHECK constraint "ck_customer_email". The conflict occurred in database "DBI202", table "dbo.Customer", column 'email'.</b></div>
<table>
<thead><tr><th>customerID</th><th>email</th></tr></thead>
<tbody>
<tr><td>KH002</td><td>hai.tran</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>CONSTRAINT_NAME</th><th>CONSTRAINT_TYPE</th></tr></thead>
<tbody>
<tr><td>ck_customer_email</td><td>CHECK</td></tr>
<tr><td>pk_customer</td><td>PRIMARY KEY</td></tr>
<tr><td>uq_customer_email</td><td>UNIQUE</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>customerID</th><th>email</th><th>phone</th></tr></thead>
<tbody>
<tr><td>KH001</td><td>trang@gmail.com</td><td><em>NULL</em></td></tr>
<tr><td>KH002</td><td>hai.tran@fpt.edu.vn</td><td><em>NULL</em></td></tr>
<tr><td>KH003</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<ul>
<li>Bước 2 bị từ chối (Msg 547): SQL Server kiểm cả các dòng đang có khi thêm CHECK.</li>
<li>Câu tìm <code>WHERE NOT (email LIKE '%_@_%')</code> chỉ ra KH002. KH003 không có trong danh sách và cũng không chặn luật: với NULL điều kiện là UNKNOWN — WHERE loại nó, còn CHECK thì chấp nhận nó.</li>
<li><code>ALTER COLUMN</code> phải ghi lại <code>NOT NULL</code>; nếu không, cột lặng lẽ thành cho phép NULL.</li>
<li><code>df_customer_city</code> xoá được bằng một dòng chỉ vì nó có tên.</li>
</ul>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>: <code>ALTER TABLE customer ADD COLUMN phone VARCHAR(15);</code>, <code>ALTER TABLE customer ALTER COLUMN city TYPE VARCHAR(50);</code> (NOT NULL vẫn giữ), <code>ALTER TABLE customer ALTER COLUMN city DROP DEFAULT;</code> — bản chạy thật ở bài 5.B, slide 18. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-4-alter-chuan-hoa">PostgreSQL 3.4 — ALTER TABLE</a>.</div>`),
    bi(`<h3>🧪 Exercise 4 — Add business rules to FUHCompany (~10 min)</h3>
<p class="nhan">Task</p>
<p>On FUHCompany (slide 21): (1) nobody works more than 60 hours a week on one project; (2) nobody supervises himself; (3) a dependent's relationship is Vợ, Chồng, Con trai or Con gái; (4) when a department is inserted without an appointment date, today is stored. Then test each rule with one bad statement, and insert department 6 without a date.</p>
<p class="nhan">Solution and real output</p>
<pre><code class="language-sql">-- (1) at most 60 hours a week on one project
ALTER TABLE tblWorksOn ADD CONSTRAINT ck_workson_max CHECK (workHours &lt;= 60);
-- (2) nobody supervises himself
ALTER TABLE tblEmployee ADD CONSTRAINT ck_employee_not_self CHECK (supervisorSSN &lt;&gt; empSSN);
-- (3) only four kinds of relationship
ALTER TABLE tblDependent ADD CONSTRAINT ck_dependent_rel
    CHECK (depRelationship IN (N'Vợ', N'Chồng', N'Con trai', N'Con gái'));
-- (4) the appointment date defaults to today
ALTER TABLE tblDepartment ADD CONSTRAINT df_department_mgrdate DEFAULT CAST(GETDATE() AS DATE) FOR mgrAssDate;
GO
-- Tests
INSERT INTO tblWorksOn (empSSN, proNum, workHours) VALUES (30121050037, 1, 70);
GO
UPDATE tblEmployee SET supervisorSSN = empSSN WHERE empSSN = 30121050038;
GO
INSERT INTO tblDependent (depName, empSSN, depRelationship) VALUES (N'Ngô Bảo Ngọc', 30121050003, N'Bạn');
GO
INSERT INTO tblDepartment (depNum, depName) VALUES (6, N'Phòng Kế Toán');
SELECT depNum, depName, CASE WHEN mgrAssDate = CAST(GETDATE() AS DATE) THEN 'hôm nay' END AS mgrAssDate
FROM tblDepartment WHERE depNum = 6;</code></pre>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "ck_workson_max". The conflict occurred in database "DBI202", table "dbo.tblWorksOn", column 'workHours'.</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The UPDATE statement conflicted with the CHECK constraint "ck_employee_not_self". The conflict occurred in database "DBI202", table "dbo.tblEmployee".</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "ck_dependent_rel". The conflict occurred in database "DBI202", table "dbo.tblDependent", column 'depRelationship'.</b><br>
The statement has been terminated.<br>
(1 row affected)</div>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>mgrAssDate</th></tr></thead>
<tbody>
<tr><td>6</td><td>Phòng Kế Toán</td><td>hôm nay</td></tr>
</tbody>
</table>
<ul>
<li>All four rules were accepted because the existing data already respects them.</li>
<li>Rule (2) compares two columns of the same row — still a one-table attribute constraint (slide 6, kind 2). For the director (supervisorSSN NULL) the check is UNKNOWN, which is accepted.</li>
<li>A default added later is written <code>ADD CONSTRAINT df_… DEFAULT value FOR column</code> in T-SQL.</li>
</ul>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a default is not a constraint: <code>ALTER COLUMN … SET DEFAULT …</code>. CHECK is identical:
<pre><code class="language-sql">-- PostgreSQL: a default is a column property, not a named constraint
ALTER TABLE tblDepartment ALTER COLUMN mgrAssDate SET DEFAULT CURRENT_DATE;
ALTER TABLE tblWorksOn ADD CONSTRAINT ck_workson_max CHECK (workHours &lt;= 60);
INSERT INTO tblDepartment (depNum, depName) VALUES (6, 'Phòng Kế Toán');
SELECT depNum, depName, mgrAssDate = CURRENT_DATE AS la_hom_nay FROM tblDepartment WHERE depNum = 6;</code></pre>
<div class="out">INSERT 0 1</div>
<table>
<thead><tr><th>depnum</th><th>depname</th><th>la_hom_nay</th></tr></thead>
<tbody>
<tr><td>6</td><td>Phòng Kế Toán</td><td>t</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-3-rang-buoc-cot">PostgreSQL 3.3 — column constraints</a>.</div>`,
    `<h3>🧪 Bài 4 — Thêm luật nghiệp vụ vào FUHCompany (~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Trên FUHCompany (slide 21): (1) không ai làm quá 60 giờ một tuần cho một dự án; (2) không ai tự giám sát chính mình; (3) quan hệ của người phụ thuộc chỉ là Vợ, Chồng, Con trai hoặc Con gái; (4) khi thêm phòng mà không ghi ngày bổ nhiệm thì lưu ngày hôm nay. Rồi thử mỗi luật bằng một câu sai, và thêm phòng 6 không ghi ngày.</p>
<p class="nhan">Lời giải và output thật</p>
<pre><code class="language-sql">-- (1) tối đa 60 giờ một tuần cho một dự án
ALTER TABLE tblWorksOn ADD CONSTRAINT ck_workson_max CHECK (workHours &lt;= 60);
-- (2) không ai tự giám sát chính mình
ALTER TABLE tblEmployee ADD CONSTRAINT ck_employee_not_self CHECK (supervisorSSN &lt;&gt; empSSN);
-- (3) chỉ bốn loại quan hệ
ALTER TABLE tblDependent ADD CONSTRAINT ck_dependent_rel
    CHECK (depRelationship IN (N'Vợ', N'Chồng', N'Con trai', N'Con gái'));
-- (4) ngày bổ nhiệm mặc định là hôm nay
ALTER TABLE tblDepartment ADD CONSTRAINT df_department_mgrdate DEFAULT CAST(GETDATE() AS DATE) FOR mgrAssDate;
GO
-- Thử
INSERT INTO tblWorksOn (empSSN, proNum, workHours) VALUES (30121050037, 1, 70);
GO
UPDATE tblEmployee SET supervisorSSN = empSSN WHERE empSSN = 30121050038;
GO
INSERT INTO tblDependent (depName, empSSN, depRelationship) VALUES (N'Ngô Bảo Ngọc', 30121050003, N'Bạn');
GO
INSERT INTO tblDepartment (depNum, depName) VALUES (6, N'Phòng Kế Toán');
SELECT depNum, depName, CASE WHEN mgrAssDate = CAST(GETDATE() AS DATE) THEN 'hôm nay' END AS mgrAssDate
FROM tblDepartment WHERE depNum = 6;</code></pre>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "ck_workson_max". The conflict occurred in database "DBI202", table "dbo.tblWorksOn", column 'workHours'.</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The UPDATE statement conflicted with the CHECK constraint "ck_employee_not_self". The conflict occurred in database "DBI202", table "dbo.tblEmployee".</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "ck_dependent_rel". The conflict occurred in database "DBI202", table "dbo.tblDependent", column 'depRelationship'.</b><br>
The statement has been terminated.<br>
(1 row affected)</div>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>mgrAssDate</th></tr></thead>
<tbody>
<tr><td>6</td><td>Phòng Kế Toán</td><td>hôm nay</td></tr>
</tbody>
</table>
<ul>
<li>Cả bốn luật đều được nhận vì dữ liệu đang có đã thoả chúng.</li>
<li>Luật (2) so hai cột của cùng một dòng — vẫn là ràng buộc thuộc tính trên một bảng (slide 6, loại 2). Với giám đốc (supervisorSSN NULL) phép kiểm là UNKNOWN, và được chấp nhận.</li>
<li>Giá trị mặc định thêm về sau viết là <code>ADD CONSTRAINT df_… DEFAULT giá_trị FOR cột</code> trong T-SQL.</li>
</ul>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> giá trị mặc định không phải một ràng buộc: <code>ALTER COLUMN … SET DEFAULT …</code>. CHECK thì y hệt:
<pre><code class="language-sql">-- PostgreSQL: mặc định là thuộc tính của cột, không phải ràng buộc có tên
ALTER TABLE tblDepartment ALTER COLUMN mgrAssDate SET DEFAULT CURRENT_DATE;
ALTER TABLE tblWorksOn ADD CONSTRAINT ck_workson_max CHECK (workHours &lt;= 60);
INSERT INTO tblDepartment (depNum, depName) VALUES (6, 'Phòng Kế Toán');
SELECT depNum, depName, mgrAssDate = CURRENT_DATE AS la_hom_nay FROM tblDepartment WHERE depNum = 6;</code></pre>
<div class="out">INSERT 0 1</div>
<table>
<thead><tr><th>depnum</th><th>depname</th><th>la_hom_nay</th></tr></thead>
<tbody>
<tr><td>6</td><td>Phòng Kế Toán</td><td>t</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-3-rang-buoc-cot">PostgreSQL 3.3 — ràng buộc cột</a>.</div>`),
    bi(`<h3>🧪 Exercise 5 — Drop the whole FUHCompany in the right order (~5 min)</h3>
<p class="nhan">Task</p>
<p>Write a script that removes all 7 tables of FUHCompany without any error. Hint: look at the foreign keys listed on slide 21 — one of them makes a circle.</p>
<p class="nhan">Solution and real output</p>
<pre><code class="language-sql">-- Wrong order: the parent first
DROP TABLE tblEmployee;
GO
-- Right order: break the circle, then children before parents
ALTER TABLE tblDepartment DROP CONSTRAINT fk_department_manager;
DROP TABLE tblWorksOn;
DROP TABLE tblDependent;
DROP TABLE tblDepLocation;
DROP TABLE tblProject;
DROP TABLE tblEmployee;
DROP TABLE tblDepartment;
DROP TABLE tblLocation;
SELECT COUNT(*) AS so_bang_con_lai FROM INFORMATION_SCHEMA.TABLES;</code></pre>
<div class="out"><b>Msg 3726, Level 16, State 1<br>
Could not drop object 'tblEmployee' because it is referenced by a FOREIGN KEY constraint.</b></div>
<table>
<thead><tr><th>so_bang_con_lai</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">Order of creation (parents first):  Location → Department → Employee → DepLocation → Project → WorksOn → Dependent
Order of dropping (children first): WorksOn, Dependent, DepLocation, Project → Employee → Department → Location
The circle Department.mgrSSN ⇄ Employee.depNum: drop fk_department_manager first.</code></pre>
<div class="callout">🐘 <strong>On PostgreSQL</strong> one <code>DROP TABLE</code> can list several tables and it works out the order itself (the circle included):
<pre><code class="language-sql">-- One statement, several tables; PostgreSQL sorts out the order itself
DROP TABLE tblWorksOn, tblDependent, tblDepLocation, tblProject, tblEmployee, tblDepartment, tblLocation;
SELECT count(*) AS so_bang_con_lai FROM information_schema.tables WHERE table_schema = 'public';</code></pre>
<table>
<thead><tr><th>so_bang_con_lai</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL 3.2 — foreign keys</a>.</div>`,
    `<h3>🧪 Bài 5 — Xoá toàn bộ FUHCompany đúng thứ tự (~5 phút)</h3>
<p class="nhan">Đề</p>
<p>Viết script xoá cả 7 bảng của FUHCompany mà không có lỗi nào. Gợi ý: nhìn danh sách khoá ngoại ở slide 21 — có một cặp tạo thành vòng tròn.</p>
<p class="nhan">Lời giải và output thật</p>
<pre><code class="language-sql">-- Sai thứ tự: xoá bảng cha trước
DROP TABLE tblEmployee;
GO
-- Đúng thứ tự: phá vòng tròn, rồi bảng con trước bảng cha
ALTER TABLE tblDepartment DROP CONSTRAINT fk_department_manager;
DROP TABLE tblWorksOn;
DROP TABLE tblDependent;
DROP TABLE tblDepLocation;
DROP TABLE tblProject;
DROP TABLE tblEmployee;
DROP TABLE tblDepartment;
DROP TABLE tblLocation;
SELECT COUNT(*) AS so_bang_con_lai FROM INFORMATION_SCHEMA.TABLES;</code></pre>
<div class="out"><b>Msg 3726, Level 16, State 1<br>
Could not drop object 'tblEmployee' because it is referenced by a FOREIGN KEY constraint.</b></div>
<table>
<thead><tr><th>so_bang_con_lai</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">Thứ tự tạo (cha trước):   Location → Department → Employee → DepLocation → Project → WorksOn → Dependent
Thứ tự xoá (con trước):   WorksOn, Dependent, DepLocation, Project → Employee → Department → Location
Vòng tròn Department.mgrSSN ⇄ Employee.depNum: bỏ fk_department_manager trước.</code></pre>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> một câu <code>DROP TABLE</code> liệt kê được nhiều bảng và tự tính thứ tự (kể cả vòng tròn):
<pre><code class="language-sql">-- Một câu, nhiều bảng; PostgreSQL tự lo thứ tự
DROP TABLE tblWorksOn, tblDependent, tblDepLocation, tblProject, tblEmployee, tblDepartment, tblLocation;
SELECT count(*) AS so_bang_con_lai FROM information_schema.tables WHERE table_schema = 'public';</code></pre>
<table>
<thead><tr><th>so_bang_con_lai</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL 3.2 — khoá ngoại</a>.</div>`),
    bi(`<h3>🧪 Exercise 6 — NULL, LIKE and dates on FUHCompany (~10 min)</h3>
<p class="nhan">Task</p>
<p>(a) Employees living in TP Hồ Chí Minh. (b) Employees whose address or birth date is missing. (c) Employees born in the 1990s. (d) Women whose middle name is "Thị".</p>
<p class="nhan">Solution and real output</p>
<pre><code class="language-sql">-- (a) employees living in TP Hồ Chí Minh
SELECT empName, empAddress FROM tblEmployee
WHERE empAddress LIKE N'%TP Hồ Chí Minh' ORDER BY empName;
-- (b) employees with a missing address or birth date
SELECT empName, empAddress, empBirthdate FROM tblEmployee
WHERE empAddress IS NULL OR empBirthdate IS NULL;
-- (c) born in the 1990s
SELECT empName, empBirthdate FROM tblEmployee
WHERE empBirthdate &gt;= '1990-01-01' AND empBirthdate &lt; '2000-01-01' ORDER BY empBirthdate;
-- (d) women whose middle name is "Thị"
SELECT empName FROM tblEmployee
WHERE empSex = 'F' AND empName LIKE N'% Thị %' ORDER BY empName;</code></pre>
<table>
<thead><tr><th>empName</th><th>empAddress</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>9 Võ Văn Tần, Q.3, TP Hồ Chí Minh</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td></tr>
<tr><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empAddress</th><th>empBirthdate</th></tr></thead>
<tbody>
<tr><td>Bùi Văn Nam</td><td><em>NULL</em></td><td>1998-02-14</td></tr>
<tr><td>Phan Hữu Nghĩa</td><td>3 Lý Thường Kiệt, TP Hà Nội</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empBirthdate</th></tr></thead>
<tbody>
<tr><td>Võ Việt Anh</td><td>1990-11-02</td></tr>
<tr><td>Mai Duy An</td><td>1992-05-30</td></tr>
<tr><td>Trương Thị Thu</td><td>1993-08-08</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>1995-01-15</td></tr>
<tr><td>Bùi Văn Nam</td><td>1998-02-14</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td></tr>
<tr><td>Lê Thị Lan Anh</td></tr>
<tr><td>Nguyễn Thị Mai</td></tr>
<tr><td>Trương Thị Thu</td></tr>
</tbody>
</table>
<ul>
<li>(b) must use <code>IS NULL</code> — <code>= NULL</code> would return nothing (slide 12).</li>
<li>(c) uses a half-open range <code>&gt;= '1990-01-01' AND &lt; '2000-01-01'</code>: correct even if the column had a time part, unlike <code>BETWEEN '1990-01-01' AND '1999-12-31'</code>.</li>
<li>(d) <code>N'% Thị %'</code> needs the spaces: <code>N'%Thị%'</code> would also catch a name like "Thịnh".</li>
</ul>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the standard date literal and ILIKE (case-insensitive) give the same rows:
<pre><code class="language-sql">-- (c) with standard date literals; (d) with ILIKE
SELECT empName, empBirthdate FROM tblEmployee
WHERE empBirthdate &gt;= DATE '1990-01-01' AND empBirthdate &lt; DATE '2000-01-01' ORDER BY empBirthdate;
SELECT empName FROM tblEmployee WHERE empSex = 'F' AND empName ILIKE '% thị %' ORDER BY empName;</code></pre>
<table>
<thead><tr><th>empname</th><th>empbirthdate</th></tr></thead>
<tbody>
<tr><td>Võ Việt Anh</td><td>1990-11-02</td></tr>
<tr><td>Mai Duy An</td><td>1992-05-30</td></tr>
<tr><td>Trương Thị Thu</td><td>1993-08-08</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>1995-01-15</td></tr>
<tr><td>Bùi Văn Nam</td><td>1998-02-14</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empname</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td></tr>
<tr><td>Lê Thị Lan Anh</td></tr>
<tr><td>Nguyễn Thị Mai</td></tr>
<tr><td>Trương Thị Thu</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-3-ngay-gio">PostgreSQL 2.3 — dates and times</a>.</div>`,
    `<h3>🧪 Bài 6 — NULL, LIKE và ngày trên FUHCompany (~10 phút)</h3>
<p class="nhan">Đề</p>
<p>(a) Nhân viên sống ở TP Hồ Chí Minh. (b) Nhân viên thiếu địa chỉ hoặc ngày sinh. (c) Nhân viên sinh trong thập niên 1990. (d) Nhân viên nữ có tên đệm "Thị".</p>
<p class="nhan">Lời giải và output thật</p>
<pre><code class="language-sql">-- (a) nhân viên sống ở TP Hồ Chí Minh
SELECT empName, empAddress FROM tblEmployee
WHERE empAddress LIKE N'%TP Hồ Chí Minh' ORDER BY empName;
-- (b) nhân viên thiếu địa chỉ hoặc ngày sinh
SELECT empName, empAddress, empBirthdate FROM tblEmployee
WHERE empAddress IS NULL OR empBirthdate IS NULL;
-- (c) sinh trong thập niên 1990
SELECT empName, empBirthdate FROM tblEmployee
WHERE empBirthdate &gt;= '1990-01-01' AND empBirthdate &lt; '2000-01-01' ORDER BY empBirthdate;
-- (d) nữ có tên đệm "Thị"
SELECT empName FROM tblEmployee
WHERE empSex = 'F' AND empName LIKE N'% Thị %' ORDER BY empName;</code></pre>
<table>
<thead><tr><th>empName</th><th>empAddress</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>9 Võ Văn Tần, Q.3, TP Hồ Chí Minh</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td></tr>
<tr><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empAddress</th><th>empBirthdate</th></tr></thead>
<tbody>
<tr><td>Bùi Văn Nam</td><td><em>NULL</em></td><td>1998-02-14</td></tr>
<tr><td>Phan Hữu Nghĩa</td><td>3 Lý Thường Kiệt, TP Hà Nội</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empBirthdate</th></tr></thead>
<tbody>
<tr><td>Võ Việt Anh</td><td>1990-11-02</td></tr>
<tr><td>Mai Duy An</td><td>1992-05-30</td></tr>
<tr><td>Trương Thị Thu</td><td>1993-08-08</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>1995-01-15</td></tr>
<tr><td>Bùi Văn Nam</td><td>1998-02-14</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td></tr>
<tr><td>Lê Thị Lan Anh</td></tr>
<tr><td>Nguyễn Thị Mai</td></tr>
<tr><td>Trương Thị Thu</td></tr>
</tbody>
</table>
<ul>
<li>(b) phải dùng <code>IS NULL</code> — <code>= NULL</code> không ra gì (slide 12).</li>
<li>(c) dùng khoảng nửa mở <code>&gt;= '1990-01-01' AND &lt; '2000-01-01'</code>: vẫn đúng nếu cột có phần giờ, khác với <code>BETWEEN '1990-01-01' AND '1999-12-31'</code>.</li>
<li>(d) <code>N'% Thị %'</code> cần hai dấu cách: <code>N'%Thị%'</code> sẽ bắt nhầm cả tên như "Thịnh".</li>
</ul>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> hằng ngày chuẩn và ILIKE (không phân biệt hoa thường) cho ra đúng các dòng đó:
<pre><code class="language-sql">-- (c) với hằng ngày chuẩn; (d) với ILIKE
SELECT empName, empBirthdate FROM tblEmployee
WHERE empBirthdate &gt;= DATE '1990-01-01' AND empBirthdate &lt; DATE '2000-01-01' ORDER BY empBirthdate;
SELECT empName FROM tblEmployee WHERE empSex = 'F' AND empName ILIKE '% thị %' ORDER BY empName;</code></pre>
<table>
<thead><tr><th>empname</th><th>empbirthdate</th></tr></thead>
<tbody>
<tr><td>Võ Việt Anh</td><td>1990-11-02</td></tr>
<tr><td>Mai Duy An</td><td>1992-05-30</td></tr>
<tr><td>Trương Thị Thu</td><td>1993-08-08</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>1995-01-15</td></tr>
<tr><td>Bùi Văn Nam</td><td>1998-02-14</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empname</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td></tr>
<tr><td>Lê Thị Lan Anh</td></tr>
<tr><td>Nguyễn Thị Mai</td></tr>
<tr><td>Trương Thị Thu</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-3-ngay-gio">PostgreSQL 2.3 — ngày giờ</a>.</div>`),
    bi(`<h3>🧪 Exercise 7 — Mini PE: student clubs, from ERD to tested tables (~20 min)</h3>
<p class="nhan">Task</p>
<p>A <strong>club</strong> has a number, a unique name and a founding date. A <strong>student</strong> has an ID of the form SE + 6 digits and a name. A student <strong>joins</strong> many clubs and a club has many members; for each membership store the join date (today by default) and the role (Chủ nhiệm, Phó chủ nhiệm or Thành viên — Thành viên by default). A club organises <strong>events</strong> numbered 1, 2, 3… inside each club (every club has its own event 1) with a title and a date; when a club is deleted its events disappear with it.</p>
<p class="nhan">ERD → tables</p>
<table>
<thead><tr><th>ERD element</th><th>Kind</th><th>Table</th></tr></thead>
<tbody>
<tr><td>Club, Student</td><td>entity sets</td><td>Club(<u>clubID</u>, clubName, foundedDate), Student(<u>studentID</u>, fullName)</td></tr>
<tr><td>joins (joinDate, role)</td><td>M:N relationship with attributes</td><td>Membership(<u>studentID</u>, <u>clubID</u>, joinDate, role)</td></tr>
<tr><td>Event, numbered inside its club</td><td>weak entity, owner Club</td><td>Event(<u>clubID</u>, <u>eventNo</u>, title, eventDate) + ON DELETE CASCADE</td></tr>
</tbody>
</table>
<p class="nhan">Solution</p>
<pre><code class="language-sql">CREATE TABLE Club (
    clubID       INT           NOT NULL,
    clubName     NVARCHAR(60)  NOT NULL,
    foundedDate  DATE          NULL,
    CONSTRAINT pk_club      PRIMARY KEY (clubID),
    CONSTRAINT uq_club_name UNIQUE (clubName)
);
CREATE TABLE Student (
    studentID  CHAR(8)       NOT NULL,
    fullName   NVARCHAR(50)  NOT NULL,
    CONSTRAINT pk_student    PRIMARY KEY (studentID),
    CONSTRAINT ck_student_id CHECK (studentID LIKE 'SE[0-9][0-9][0-9][0-9][0-9][0-9]')
);
CREATE TABLE Membership (
    studentID  CHAR(8)      NOT NULL,
    clubID     INT          NOT NULL,
    joinDate   DATE         NOT NULL CONSTRAINT df_membership_join DEFAULT CAST(GETDATE() AS DATE),
    role       NVARCHAR(20) NOT NULL CONSTRAINT df_membership_role DEFAULT N'Thành viên',
    CONSTRAINT pk_membership         PRIMARY KEY (studentID, clubID),
    CONSTRAINT fk_membership_student FOREIGN KEY (studentID) REFERENCES Student (studentID),
    CONSTRAINT fk_membership_club    FOREIGN KEY (clubID)    REFERENCES Club (clubID),
    CONSTRAINT ck_membership_role    CHECK (role IN (N'Chủ nhiệm', N'Phó chủ nhiệm', N'Thành viên'))
);
CREATE TABLE Event (
    clubID     INT           NOT NULL,
    eventNo    INT           NOT NULL,
    title      NVARCHAR(100) NOT NULL,
    eventDate  DATE          NOT NULL,
    CONSTRAINT pk_event      PRIMARY KEY (clubID, eventNo),
    CONSTRAINT fk_event_club FOREIGN KEY (clubID) REFERENCES Club (clubID) ON DELETE CASCADE
);
GO</code></pre>
<p class="nhan">Tests and real output</p>
<pre><code class="language-sql">INSERT INTO Club (clubID, clubName, foundedDate) VALUES (1, N'CLB Guitar', '2015-09-01'), (2, N'CLB Lập trình', '2018-03-15');
INSERT INTO Student VALUES ('SE123456', N'Nguyễn Văn Cường');
INSERT INTO Membership (studentID, clubID) VALUES ('SE123456', 2);
INSERT INTO Event VALUES (2, 1, N'Hackathon mùa thu', '2026-10-20'), (1, 1, N'Đêm nhạc', '2026-11-05');
GO
INSERT INTO Student VALUES ('SE12AB56', N'Sai định dạng');
GO
INSERT INTO Membership (studentID, clubID, role) VALUES ('SE123456', 1, N'Thủ quỹ');
GO
DELETE FROM Club WHERE clubID = 1;
SELECT clubID, eventNo, title FROM Event;</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "ck_student_id". The conflict occurred in database "DBI202", table "dbo.Student", column 'studentID'.</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "ck_membership_role". The conflict occurred in database "DBI202", table "dbo.Membership", column 'role'.</b><br>
The statement has been terminated.<br>
(1 row affected)</div>
<table>
<thead><tr><th>clubID</th><th>eventNo</th><th>title</th></tr></thead>
<tbody>
<tr><td>2</td><td>1</td><td>Hackathon mùa thu</td></tr>
</tbody>
</table>
<p>'SE12AB56' breaks ck_student_id, 'Thủ quỹ' breaks ck_membership_role, and deleting club 1 deleted its event "Đêm nhạc" automatically (ON DELETE CASCADE) — only the Hackathon of club 2 remains.</p>
<div class="pitfall"><code>LIKE 'SE[0-9][0-9]…'</code> works only in SQL Server. And CASCADE is right for a weak entity (an event cannot exist without its club) but dangerous elsewhere: CASCADE on Membership → Student would silently erase history when a student is deleted.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> LIKE has no <code>[0-9]</code> classes; the ID rule uses a regular expression with <code>~</code>:
<pre><code class="language-sql">-- PostgreSQL has no [0-9] classes in LIKE: use a regular expression with ~
CREATE TABLE student (
    student_id  CHAR(8)     PRIMARY KEY CONSTRAINT ck_student_id CHECK (student_id ~ '^SE[0-9]{6}$'),
    full_name   VARCHAR(50) NOT NULL
);
INSERT INTO student VALUES ('SE123456', 'Nguyễn Văn Cường');
INSERT INTO student VALUES ('SE12AB56', 'Sai định dạng');</code></pre>
<div class="out"><b>ERROR:  new row for relation "student" violates check constraint "ck_student_id"</b></div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-3-rang-buoc-cot">PostgreSQL 3.3 — column constraints</a>.</div>`,
    `<h3>🧪 Bài 7 — PE thu nhỏ: câu lạc bộ sinh viên, từ ERD tới bảng đã thử (~20 phút)</h3>
<p class="nhan">Đề</p>
<p>Một <strong>câu lạc bộ</strong> có số hiệu, tên không trùng và ngày thành lập. Một <strong>sinh viên</strong> có mã dạng SE + 6 chữ số và họ tên. Sinh viên <strong>tham gia</strong> nhiều CLB và CLB có nhiều thành viên; với mỗi lần tham gia lưu ngày vào (mặc định hôm nay) và vai trò (Chủ nhiệm, Phó chủ nhiệm hoặc Thành viên — mặc định Thành viên). CLB tổ chức các <strong>sự kiện</strong> đánh số 1, 2, 3… trong từng CLB (CLB nào cũng có sự kiện số 1) kèm tiêu đề và ngày; xoá CLB thì các sự kiện của nó mất theo.</p>
<p class="nhan">ERD → bảng</p>
<table>
<thead><tr><th>Phần tử ERD</th><th>Loại</th><th>Bảng</th></tr></thead>
<tbody>
<tr><td>Club, Student</td><td>tập thực thể</td><td>Club(<u>clubID</u>, clubName, foundedDate), Student(<u>studentID</u>, fullName)</td></tr>
<tr><td>tham gia (joinDate, role)</td><td>liên kết M:N có thuộc tính</td><td>Membership(<u>studentID</u>, <u>clubID</u>, joinDate, role)</td></tr>
<tr><td>Event, đánh số trong CLB</td><td>thực thể yếu, chủ là Club</td><td>Event(<u>clubID</u>, <u>eventNo</u>, title, eventDate) + ON DELETE CASCADE</td></tr>
</tbody>
</table>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">CREATE TABLE Club (
    clubID       INT           NOT NULL,
    clubName     NVARCHAR(60)  NOT NULL,
    foundedDate  DATE          NULL,
    CONSTRAINT pk_club      PRIMARY KEY (clubID),
    CONSTRAINT uq_club_name UNIQUE (clubName)
);
CREATE TABLE Student (
    studentID  CHAR(8)       NOT NULL,
    fullName   NVARCHAR(50)  NOT NULL,
    CONSTRAINT pk_student    PRIMARY KEY (studentID),
    CONSTRAINT ck_student_id CHECK (studentID LIKE 'SE[0-9][0-9][0-9][0-9][0-9][0-9]')
);
CREATE TABLE Membership (
    studentID  CHAR(8)      NOT NULL,
    clubID     INT          NOT NULL,
    joinDate   DATE         NOT NULL CONSTRAINT df_membership_join DEFAULT CAST(GETDATE() AS DATE),
    role       NVARCHAR(20) NOT NULL CONSTRAINT df_membership_role DEFAULT N'Thành viên',
    CONSTRAINT pk_membership         PRIMARY KEY (studentID, clubID),
    CONSTRAINT fk_membership_student FOREIGN KEY (studentID) REFERENCES Student (studentID),
    CONSTRAINT fk_membership_club    FOREIGN KEY (clubID)    REFERENCES Club (clubID),
    CONSTRAINT ck_membership_role    CHECK (role IN (N'Chủ nhiệm', N'Phó chủ nhiệm', N'Thành viên'))
);
CREATE TABLE Event (
    clubID     INT           NOT NULL,
    eventNo    INT           NOT NULL,
    title      NVARCHAR(100) NOT NULL,
    eventDate  DATE          NOT NULL,
    CONSTRAINT pk_event      PRIMARY KEY (clubID, eventNo),
    CONSTRAINT fk_event_club FOREIGN KEY (clubID) REFERENCES Club (clubID) ON DELETE CASCADE
);
GO</code></pre>
<p class="nhan">Phép thử và output thật</p>
<pre><code class="language-sql">INSERT INTO Club (clubID, clubName, foundedDate) VALUES (1, N'CLB Guitar', '2015-09-01'), (2, N'CLB Lập trình', '2018-03-15');
INSERT INTO Student VALUES ('SE123456', N'Nguyễn Văn Cường');
INSERT INTO Membership (studentID, clubID) VALUES ('SE123456', 2);
INSERT INTO Event VALUES (2, 1, N'Hackathon mùa thu', '2026-10-20'), (1, 1, N'Đêm nhạc', '2026-11-05');
GO
INSERT INTO Student VALUES ('SE12AB56', N'Sai định dạng');
GO
INSERT INTO Membership (studentID, clubID, role) VALUES ('SE123456', 1, N'Thủ quỹ');
GO
DELETE FROM Club WHERE clubID = 1;
SELECT clubID, eventNo, title FROM Event;</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "ck_student_id". The conflict occurred in database "DBI202", table "dbo.Student", column 'studentID'.</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "ck_membership_role". The conflict occurred in database "DBI202", table "dbo.Membership", column 'role'.</b><br>
The statement has been terminated.<br>
(1 row affected)</div>
<table>
<thead><tr><th>clubID</th><th>eventNo</th><th>title</th></tr></thead>
<tbody>
<tr><td>2</td><td>1</td><td>Hackathon mùa thu</td></tr>
</tbody>
</table>
<p>'SE12AB56' vi phạm ck_student_id, 'Thủ quỹ' vi phạm ck_membership_role, và xoá CLB 1 đã tự xoá luôn sự kiện "Đêm nhạc" của nó (ON DELETE CASCADE — xoá dây chuyền) — chỉ còn Hackathon của CLB 2.</p>
<div class="pitfall"><code>LIKE 'SE[0-9][0-9]…'</code> chỉ chạy trên SQL Server. Và CASCADE đúng cho thực thể yếu (sự kiện không thể tồn tại thiếu CLB) nhưng nguy hiểm ở chỗ khác: CASCADE trên Membership → Student sẽ lặng lẽ xoá lịch sử khi xoá một sinh viên.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> LIKE không có lớp <code>[0-9]</code>; luật mã sinh viên dùng biểu thức chính quy (regular expression) với <code>~</code>:
<pre><code class="language-sql">-- PostgreSQL không có lớp [0-9] trong LIKE: dùng biểu thức chính quy với ~
CREATE TABLE student (
    student_id  CHAR(8)     PRIMARY KEY CONSTRAINT ck_student_id CHECK (student_id ~ '^SE[0-9]{6}$'),
    full_name   VARCHAR(50) NOT NULL
);
INSERT INTO student VALUES ('SE123456', 'Nguyễn Văn Cường');
INSERT INTO student VALUES ('SE12AB56', 'Sai định dạng');</code></pre>
<div class="out"><b>ERROR:  new row for relation "student" violates check constraint "ck_student_id"</b></div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-3-rang-buoc-cot">PostgreSQL 3.3 — ràng buộc cột</a>.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>DDL (Data Definition Language)</strong></td><td>ngôn ngữ định nghĩa dữ liệu</td><td>The part of SQL that creates, changes and drops structures: CREATE, ALTER, DROP.</td></tr>
<tr><td><strong>DML (Data Manipulation Language)</strong></td><td>ngôn ngữ thao tác dữ liệu</td><td>The part of SQL that reads and changes rows: SELECT, INSERT, UPDATE, DELETE.</td></tr>
<tr><td><strong>integrity constraint</strong></td><td>ràng buộc toàn vẹn</td><td>A rule the DBMS checks on every change so that invalid data cannot be stored.</td></tr>
<tr><td><strong>primary key</strong></td><td>khoá chính</td><td>The column(s) that identify each row: unique and never NULL.</td></tr>
<tr><td><strong>candidate key / UNIQUE</strong></td><td>khoá ứng viên / ràng buộc duy nhất</td><td>Another set of columns whose values may not repeat; declared with UNIQUE.</td></tr>
<tr><td><strong>foreign key</strong></td><td>khoá ngoại</td><td>Column(s) whose values must exist as a key in another (parent) table.</td></tr>
<tr><td><strong>referential integrity</strong></td><td>toàn vẹn tham chiếu</td><td>No row may point to a parent row that does not exist.</td></tr>
<tr><td><strong>CHECK constraint</strong></td><td>ràng buộc kiểm tra</td><td>A condition every row must not make FALSE (TRUE and UNKNOWN are accepted).</td></tr>
<tr><td><strong>NOT NULL</strong></td><td>không cho phép rỗng</td><td>The column must always have a value.</td></tr>
<tr><td><strong>DEFAULT</strong></td><td>giá trị mặc định</td><td>The value stored when an INSERT does not give one.</td></tr>
<tr><td><strong>IDENTITY</strong></td><td>cột tự tăng</td><td>A T-SQL column property that numbers new rows automatically (seed, step).</td></tr>
<tr><td><strong>NULL</strong></td><td>giá trị rỗng / không xác định</td><td>A marker for a missing value: unknown, inapplicable or withheld.</td></tr>
<tr><td><strong>UNKNOWN</strong></td><td>không xác định (giá trị chân lý thứ ba)</td><td>The truth value of any comparison with NULL; WHERE drops such rows.</td></tr>
<tr><td><strong>three-valued logic</strong></td><td>lô-gic ba trị</td><td>TRUE=1, FALSE=0, UNKNOWN=½ with AND = MIN, OR = MAX, NOT = 1 − x.</td></tr>
<tr><td><strong>pattern matching (LIKE)</strong></td><td>so khớp mẫu</td><td>Testing a string against a pattern where % is any sequence and _ one character.</td></tr>
<tr><td><strong>escape character</strong></td><td>ký tự thoát</td><td>A chosen character that makes the next % or _ literal in a LIKE pattern.</td></tr>
<tr><td><strong>collation</strong></td><td>bộ luật so sánh chữ</td><td>The rules for comparing and sorting text (case and accent sensitivity).</td></tr>
<tr><td><strong>dialect (T-SQL, PL/pgSQL)</strong></td><td>phương ngữ SQL</td><td>A vendor's version of SQL with its own types, functions and extensions.</td></tr>
<tr><td><strong>cascade (ON DELETE CASCADE)</strong></td><td>xoá dây chuyền</td><td>Deleting a parent row automatically deletes its child rows.</td></tr>
<tr><td><strong>physical diagram</strong></td><td>sơ đồ vật lý</td><td>A picture of the real tables, their columns, keys and foreign-key lines.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>DDL (Data Definition Language)</strong></td><td>ngôn ngữ định nghĩa dữ liệu</td><td>Phần SQL tạo, sửa, xoá cấu trúc: CREATE, ALTER, DROP.</td></tr>
<tr><td><strong>DML (Data Manipulation Language)</strong></td><td>ngôn ngữ thao tác dữ liệu</td><td>Phần SQL đọc và sửa các dòng: SELECT, INSERT, UPDATE, DELETE.</td></tr>
<tr><td><strong>integrity constraint</strong></td><td>ràng buộc toàn vẹn</td><td>Luật DBMS kiểm ở mọi lần thay đổi để dữ liệu sai không lưu được.</td></tr>
<tr><td><strong>primary key</strong></td><td>khoá chính</td><td>Cột (hoặc nhóm cột) xác định mỗi dòng: không trùng và không bao giờ NULL.</td></tr>
<tr><td><strong>candidate key / UNIQUE</strong></td><td>khoá ứng viên / ràng buộc duy nhất</td><td>Một nhóm cột khác có giá trị không được lặp; khai báo bằng UNIQUE.</td></tr>
<tr><td><strong>foreign key</strong></td><td>khoá ngoại</td><td>Cột mà giá trị phải có sẵn làm khoá trong một bảng khác (bảng cha).</td></tr>
<tr><td><strong>referential integrity</strong></td><td>toàn vẹn tham chiếu</td><td>Không dòng nào được trỏ tới một dòng cha không tồn tại.</td></tr>
<tr><td><strong>CHECK constraint</strong></td><td>ràng buộc kiểm tra</td><td>Điều kiện mà không dòng nào được làm cho FALSE (TRUE và UNKNOWN đều được nhận).</td></tr>
<tr><td><strong>NOT NULL</strong></td><td>không cho phép rỗng</td><td>Cột luôn phải có giá trị.</td></tr>
<tr><td><strong>DEFAULT</strong></td><td>giá trị mặc định</td><td>Giá trị được lưu khi câu INSERT không đưa giá trị.</td></tr>
<tr><td><strong>IDENTITY</strong></td><td>cột tự tăng</td><td>Thuộc tính cột của T-SQL tự đánh số dòng mới (số bắt đầu, bước nhảy).</td></tr>
<tr><td><strong>NULL</strong></td><td>giá trị rỗng / không xác định</td><td>Dấu hiệu cho giá trị vắng mặt: không biết, không áp dụng, hoặc bị giữ kín.</td></tr>
<tr><td><strong>UNKNOWN</strong></td><td>không xác định (giá trị chân lý thứ ba)</td><td>Giá trị chân lý của mọi phép so sánh với NULL; WHERE loại các dòng đó.</td></tr>
<tr><td><strong>three-valued logic</strong></td><td>lô-gic ba trị</td><td>TRUE=1, FALSE=0, UNKNOWN=½ với AND = MIN, OR = MAX, NOT = 1 − x.</td></tr>
<tr><td><strong>pattern matching (LIKE)</strong></td><td>so khớp mẫu</td><td>Kiểm một chuỗi theo mẫu, trong đó % là dãy bất kỳ và _ là một ký tự.</td></tr>
<tr><td><strong>escape character</strong></td><td>ký tự thoát</td><td>Ký tự tự chọn làm cho % hay _ đứng sau nó được hiểu theo nghĩa đen trong mẫu LIKE.</td></tr>
<tr><td><strong>collation</strong></td><td>bộ luật so sánh chữ</td><td>Bộ luật so sánh và sắp xếp chữ (có phân biệt hoa thường, dấu hay không).</td></tr>
<tr><td><strong>dialect (T-SQL, PL/pgSQL)</strong></td><td>phương ngữ SQL</td><td>Phiên bản SQL của một hãng, có kiểu, hàm và phần mở rộng riêng.</td></tr>
<tr><td><strong>cascade (ON DELETE CASCADE)</strong></td><td>xoá dây chuyền</td><td>Xoá dòng cha thì các dòng con tự bị xoá theo.</td></tr>
<tr><td><strong>physical diagram</strong></td><td>sơ đồ vật lý</td><td>Hình vẽ các bảng thật, cột, khoá và các đường khoá ngoại.</td></tr>
</tbody>
</table>`),
    bi(`<h2>🔁 T-SQL ↔ PostgreSQL — the DDL of this chapter</h2>
<p>At work (and in the project, with Prisma) you will type the right-hand column; in the PE you type the left one.</p>
<table>
<thead><tr><th>Task</th><th>T-SQL (SQL Server)</th><th>PostgreSQL</th></tr></thead>
<tbody>
<tr><td>Unicode text</td><td><code>NVARCHAR(50)</code> + <code>N'Hà Nội'</code></td><td><code>VARCHAR(50)</code> or <code>TEXT</code> + <code>'Hà Nội'</code></td></tr>
<tr><td>Auto-numbered key</td><td><code>INT IDENTITY(1,1) PRIMARY KEY</code></td><td><code>INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY</code> (old: <code>SERIAL</code>)</td></tr>
<tr><td>Exact decimal</td><td><code>DECIMAL(10,0)</code></td><td><code>NUMERIC(10,0)</code> (DECIMAL also accepted)</td></tr>
<tr><td>Today / now</td><td><code>CAST(GETDATE() AS DATE)</code> / <code>GETDATE()</code></td><td><code>CURRENT_DATE</code> / <code>now()</code></td></tr>
<tr><td>Date constant</td><td><code>'1948-05-14'</code> (or <code>CAST('…' AS DATE)</code>)</td><td><code>DATE '1948-05-14'</code> or <code>'1948-05-14'</code></td></tr>
<tr><td>Add days / difference</td><td><code>DATEADD(DAY, 30, d)</code> / <code>DATEDIFF(DAY, a, b)</code></td><td><code>d + 30</code> / <code>b - a</code></td></tr>
<tr><td>Replace NULL</td><td><code>ISNULL(x, v)</code> or <code>COALESCE(x, v)</code></td><td><code>COALESCE(x, v)</code></td></tr>
<tr><td>Case-insensitive match</td><td><code>LIKE</code> (default collation CI)</td><td><code>ILIKE</code> or <code>lower(x) LIKE …</code></td></tr>
<tr><td>Character class in a pattern</td><td><code>LIKE 'SE[0-9]%'</code></td><td><code>~ '^SE[0-9]'</code> (regular expression)</td></tr>
<tr><td>Name with spaces</td><td><code>[Họ và tên]</code></td><td><code>"Họ và tên"</code></td></tr>
<tr><td>Add column</td><td><code>ALTER TABLE t ADD c type</code></td><td><code>ALTER TABLE t ADD COLUMN c type</code></td></tr>
<tr><td>Change type</td><td><code>ALTER TABLE t ALTER COLUMN c type NOT NULL</code></td><td><code>ALTER TABLE t ALTER COLUMN c TYPE type</code></td></tr>
<tr><td>Rename column</td><td><code>EXEC sp_rename 't.a', 'b', 'COLUMN'</code></td><td><code>ALTER TABLE t RENAME COLUMN a TO b</code></td></tr>
<tr><td>Default added later</td><td><code>ADD CONSTRAINT df_x DEFAULT v FOR c</code></td><td><code>ALTER COLUMN c SET DEFAULT v</code></td></tr>
<tr><td>Constraint without checking old rows</td><td><code>WITH NOCHECK ADD CONSTRAINT …</code></td><td><code>ADD CONSTRAINT … NOT VALID</code></td></tr>
<tr><td>Drop a referenced table</td><td>drop the child / FK first</td><td><code>DROP TABLE t CASCADE</code></td></tr>
<tr><td>First n rows</td><td><code>SELECT TOP 3 …</code></td><td><code>… LIMIT 3</code></td></tr>
<tr><td>Batch separator</td><td><code>GO</code> (SSMS/sqlcmd)</td><td>none — <code>;</code> ends each statement</td></tr>
</tbody>
</table>`,
    `<h2>🔁 T-SQL ↔ PostgreSQL — phần DDL của chương</h2>
<p>Khi đi làm (và trong đồ án, với Prisma) bạn gõ cột bên phải; ở bài PE bạn gõ cột bên trái.</p>
<table>
<thead><tr><th>Việc</th><th>T-SQL (SQL Server)</th><th>PostgreSQL</th></tr></thead>
<tbody>
<tr><td>Chữ Unicode (tiếng Việt)</td><td><code>NVARCHAR(50)</code> + <code>N'Hà Nội'</code></td><td><code>VARCHAR(50)</code> hoặc <code>TEXT</code> + <code>'Hà Nội'</code></td></tr>
<tr><td>Khoá tự đánh số</td><td><code>INT IDENTITY(1,1) PRIMARY KEY</code></td><td><code>INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY</code> (cũ: <code>SERIAL</code>)</td></tr>
<tr><td>Số thập phân chính xác</td><td><code>DECIMAL(10,0)</code></td><td><code>NUMERIC(10,0)</code> (DECIMAL cũng được)</td></tr>
<tr><td>Hôm nay / bây giờ</td><td><code>CAST(GETDATE() AS DATE)</code> / <code>GETDATE()</code></td><td><code>CURRENT_DATE</code> / <code>now()</code></td></tr>
<tr><td>Hằng ngày</td><td><code>'1948-05-14'</code> (hoặc <code>CAST('…' AS DATE)</code>)</td><td><code>DATE '1948-05-14'</code> hoặc <code>'1948-05-14'</code></td></tr>
<tr><td>Cộng ngày / khoảng cách</td><td><code>DATEADD(DAY, 30, d)</code> / <code>DATEDIFF(DAY, a, b)</code></td><td><code>d + 30</code> / <code>b - a</code></td></tr>
<tr><td>Thay NULL</td><td><code>ISNULL(x, v)</code> hoặc <code>COALESCE(x, v)</code></td><td><code>COALESCE(x, v)</code></td></tr>
<tr><td>So khớp không phân biệt hoa thường</td><td><code>LIKE</code> (collation mặc định CI)</td><td><code>ILIKE</code> hoặc <code>lower(x) LIKE …</code></td></tr>
<tr><td>Lớp ký tự trong mẫu</td><td><code>LIKE 'SE[0-9]%'</code></td><td><code>~ '^SE[0-9]'</code> (biểu thức chính quy)</td></tr>
<tr><td>Tên có dấu cách</td><td><code>[Họ và tên]</code></td><td><code>"Họ và tên"</code></td></tr>
<tr><td>Thêm cột</td><td><code>ALTER TABLE t ADD c kiểu</code></td><td><code>ALTER TABLE t ADD COLUMN c kiểu</code></td></tr>
<tr><td>Đổi kiểu</td><td><code>ALTER TABLE t ALTER COLUMN c kiểu NOT NULL</code></td><td><code>ALTER TABLE t ALTER COLUMN c TYPE kiểu</code></td></tr>
<tr><td>Đổi tên cột</td><td><code>EXEC sp_rename 't.a', 'b', 'COLUMN'</code></td><td><code>ALTER TABLE t RENAME COLUMN a TO b</code></td></tr>
<tr><td>Thêm mặc định về sau</td><td><code>ADD CONSTRAINT df_x DEFAULT v FOR c</code></td><td><code>ALTER COLUMN c SET DEFAULT v</code></td></tr>
<tr><td>Thêm ràng buộc không kiểm dòng cũ</td><td><code>WITH NOCHECK ADD CONSTRAINT …</code></td><td><code>ADD CONSTRAINT … NOT VALID</code></td></tr>
<tr><td>Xoá bảng đang bị tham chiếu</td><td>xoá bảng con / khoá ngoại trước</td><td><code>DROP TABLE t CASCADE</code></td></tr>
<tr><td>n dòng đầu</td><td><code>SELECT TOP 3 …</code></td><td><code>… LIMIT 3</code></td></tr>
<tr><td>Dấu tách lô</td><td><code>GO</code> (SSMS/sqlcmd)</td><td>không có — <code>;</code> kết thúc mỗi câu</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — Chapter 5 in 8 points</h2>
<ol>
<li><strong>Four kinds of integrity constraints</strong>: key (PRIMARY KEY, UNIQUE), attribute (NOT NULL, CHECK), referential (FOREIGN KEY), global (assertion — in SQL Server a trigger).</li>
<li><strong>CREATE TABLE</strong>: one line per column (name, type, column constraints); composite keys and named constraints at table level. Parents first.</li>
<li><strong>Name every constraint</strong> (<code>pk_</code>, <code>fk_</code>, <code>uq_</code>, <code>ck_</code>, <code>df_</code>): readable errors, and you can drop it by name.</li>
<li><strong>Vietnamese = NVARCHAR + N'…'</strong>; without N, "ệ" silently becomes "?".</li>
<li><strong>LIKE</strong>: <code>%</code> any sequence, <code>_</code> one character; ESCAPE (or <code>[%]</code> in T-SQL) for a literal wildcard. SQL Server compares text case-insensitively by default, PostgreSQL does not.</li>
<li><strong>NULL</strong> is not a value: test it with IS NULL; arithmetic gives NULL, comparison gives UNKNOWN; WHERE keeps only TRUE, CHECK rejects only FALSE; beware NOT IN with NULLs.</li>
<li><strong>ALTER TABLE</strong> on a table with rows: a new NOT NULL column needs a DEFAULT; a new CHECK is verified on old rows; a column with a constraint on it cannot be dropped before the constraint.</li>
<li><strong>DROP</strong> in reverse order of creation (break FK circles first); IDENTITY numbers have gaps, and dates are not ages (<code>YEAR(now) − YEAR(birth)</code> can be one too high).</li>
</ol>`,
    `<h2>📌 Tóm tắt — Chương 5 trong 8 ý</h2>
<ol>
<li><strong>Bốn loại ràng buộc toàn vẹn</strong>: khoá (PRIMARY KEY, UNIQUE), thuộc tính (NOT NULL, CHECK), tham chiếu (FOREIGN KEY), tổng quát (assertion — SQL Server dùng trigger).</li>
<li><strong>CREATE TABLE</strong>: mỗi cột một dòng (tên, kiểu, ràng buộc mức cột); khoá ghép và ràng buộc có tên viết ở mức bảng. Bảng cha trước.</li>
<li><strong>Đặt tên mọi ràng buộc</strong> (<code>pk_</code>, <code>fk_</code>, <code>uq_</code>, <code>ck_</code>, <code>df_</code>): lỗi dễ đọc, xoá được theo tên.</li>
<li><strong>Tiếng Việt = NVARCHAR + N'…'</strong>; thiếu N thì "ệ" lặng lẽ thành "?".</li>
<li><strong>LIKE</strong>: <code>%</code> là dãy bất kỳ, <code>_</code> là một ký tự; ESCAPE (hoặc <code>[%]</code> trong T-SQL) để tìm đúng ký tự đại diện. SQL Server mặc định so chữ không phân biệt hoa thường, PostgreSQL thì có phân biệt.</li>
<li><strong>NULL</strong> không phải một giá trị: kiểm bằng IS NULL; phép tính ra NULL, phép so sánh ra UNKNOWN; WHERE chỉ giữ TRUE, CHECK chỉ từ chối FALSE; cẩn thận NOT IN khi có NULL.</li>
<li><strong>ALTER TABLE</strong> trên bảng đã có dữ liệu: cột NOT NULL mới cần DEFAULT; CHECK mới được kiểm trên dòng cũ; cột còn ràng buộc bám vào thì phải bỏ ràng buộc trước.</li>
<li><strong>DROP</strong> theo thứ tự ngược với lúc tạo (phá vòng khoá ngoại trước); số IDENTITY có lỗ hổng, và ngày sinh chưa phải tuổi (<code>YEAR(nay) − YEAR(sinh)</code> có thể dư 1).</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (dbi202-quiz-ch5) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'Table T has one column x with CHECK (x > 0). The statements below run, each group as its own batch. What does the last SELECT return?|||Bảng T có một cột x với CHECK (x > 0). Các câu dưới đây được chạy, mỗi nhóm là một lô riêng. Câu SELECT cuối trả về gì?',
      code: `INSERT INTO T VALUES (5);
INSERT INTO T VALUES (NULL);
GO
INSERT INTO T VALUES (-1);
GO
SELECT COUNT(*) FROM T;`,
      codeLang: 'sql',
      options: ['1 — only the row 5 is stored|||1 — chỉ dòng 5 được lưu', '3 — CHECK is only checked by UPDATE|||3 — CHECK chỉ được kiểm khi UPDATE', '2 — the rows 5 and NULL are stored|||2 — dòng 5 và dòng NULL được lưu', '0 — the error cancels every insert|||0 — lỗi huỷ mọi câu chèn'],
      correctIndex: 2,
      points: 1,
      explanation: 'A CHECK rejects a row only when its condition is FALSE. For 5 it is TRUE; for NULL, NULL > 0 is UNKNOWN, which is accepted; for -1 it is FALSE, so only that insert fails (Msg 547). Answer A forgets that UNKNOWN passes a CHECK — add NOT NULL if a value is compulsory; D is wrong because each INSERT is its own statement.|||CHECK chỉ từ chối một dòng khi điều kiện là FALSE. Với 5 là TRUE; với NULL thì NULL > 0 là UNKNOWN, được chấp nhận; với -1 là FALSE nên chỉ câu chèn đó lỗi (Msg 547). Đáp án A quên rằng UNKNOWN lọt qua CHECK — muốn bắt buộc có giá trị thì thêm NOT NULL; D sai vì mỗi câu INSERT là một câu lệnh riêng.' },
    { id: 'q2',
      question: 'A contains the ids 1, 2, 3; B contains the refs 1 and NULL. How many rows does the query count?|||A chứa các id 1, 2, 3; B chứa các ref 1 và NULL. Câu truy vấn đếm được bao nhiêu dòng?',
      code: `SELECT COUNT(*) FROM A WHERE id NOT IN (SELECT ref FROM B);`,
      codeLang: 'sql',
      options: ['0|||0', '2|||2', '3|||3', 'an error: NOT IN does not accept NULL|||báo lỗi: NOT IN không nhận NULL'],
      correctIndex: 0,
      points: 1,
      explanation: 'id NOT IN (1, NULL) means id <> 1 AND id <> NULL. The second part is UNKNOWN for every id, so the condition is never TRUE (FALSE or UNKNOWN) and WHERE keeps nothing. The tempting answer 2 (ids 2 and 3) is what you get after removing the NULL with WHERE ref IS NOT NULL, or with NOT EXISTS.|||id NOT IN (1, NULL) nghĩa là id <> 1 AND id <> NULL. Vế sau là UNKNOWN với mọi id, nên điều kiện không bao giờ TRUE (chỉ FALSE hoặc UNKNOWN) và WHERE không giữ dòng nào. Đáp án hấp dẫn 2 (id 2 và 3) là kết quả sau khi bỏ NULL bằng WHERE ref IS NOT NULL, hoặc dùng NOT EXISTS.' },
    { id: 'q3',
      question: "Which string matches  s LIKE '%20!%%' ESCAPE '!' ?|||Chuỗi nào khớp  s LIKE '%20!%%' ESCAPE '!' ?",
      options: ["'Mua 200 tặng 1'|||'Mua 200 tặng 1'", "'20!%'|||'20!%'", "'2%0'|||'2%0'", "'Giảm 20% hôm nay'|||'Giảm 20% hôm nay'"],
      correctIndex: 3,
      points: 1,
      explanation: "With ! as the escape character the pattern reads: any text, 2, 0, a real percent sign, any text — so the string must contain \"20%\". 'Mua 200 tặng 1' contains 20 but no percent sign after it; it would match only '%20%' without ESCAPE. '20!%' contains the ! itself, which the pattern never asks for.|||Với ! là ký tự thoát, mẫu đọc là: chữ bất kỳ, 2, 0, một dấu phần trăm thật, chữ bất kỳ — nên chuỗi phải chứa \"20%\". 'Mua 200 tặng 1' có 20 nhưng không có dấu % sau nó; nó chỉ khớp '%20%' khi không có ESCAPE. '20!%' chứa chính dấu !, thứ mẫu không hề yêu cầu." },
    { id: 'q4',
      question: 'Table P holds the names Lan, Nam, An, Hoa, Mai. What does the count return?|||Bảng P chứa các tên Lan, Nam, An, Hoa, Mai. Câu đếm trả về bao nhiêu?',
      code: `INSERT INTO P VALUES ('Lan'), ('Nam'), ('An'), ('Hoa'), ('Mai');
SELECT COUNT(*) FROM P WHERE name LIKE '_a%';`,
      codeLang: 'sql',
      options: ['4|||4', '3|||3', '2|||2', '5|||5'],
      correctIndex: 1,
      points: 1,
      explanation: "'_a%' means: exactly one character, then a, then anything — the second letter must be a. Lan, Nam and Mai qualify; An starts with A (a is the first letter, not the second) and Hoa has a in third place. Answer A counts An, confusing _ (exactly one character) with % (zero or more).|||'_a%' nghĩa là: đúng một ký tự, rồi chữ a, rồi gì cũng được — chữ thứ hai phải là a. Lan, Nam và Mai thoả; An có a ở vị trí đầu (không phải thứ hai) còn Hoa có a ở vị trí thứ ba. Đáp án A đếm cả An, tức là nhầm _ (đúng một ký tự) với % (không hoặc nhiều ký tự)." },
    { id: 'q5',
      question: "In SQL's three-valued logic, which expression evaluates to UNKNOWN?|||Trong lô-gic ba trị của SQL, biểu thức nào có giá trị UNKNOWN?",
      options: ['TRUE OR UNKNOWN|||TRUE OR UNKNOWN', 'FALSE AND UNKNOWN|||FALSE AND UNKNOWN', 'TRUE AND UNKNOWN|||TRUE AND UNKNOWN', 'NOT FALSE|||NOT FALSE'],
      correctIndex: 2,
      points: 1,
      explanation: 'With TRUE = 1, FALSE = 0, UNKNOWN = ½: AND is MIN, OR is MAX. TRUE AND UNKNOWN = MIN(1, ½) = UNKNOWN. TRUE OR UNKNOWN = MAX(1, ½) = TRUE and FALSE AND UNKNOWN = MIN(0, ½) = FALSE — TRUE wins an OR and FALSE wins an AND whatever the other side; NOT FALSE is TRUE.|||Với TRUE = 1, FALSE = 0, UNKNOWN = ½: AND là MIN, OR là MAX. TRUE AND UNKNOWN = MIN(1, ½) = UNKNOWN. TRUE OR UNKNOWN = MAX(1, ½) = TRUE và FALSE AND UNKNOWN = MIN(0, ½) = FALSE — TRUE thắng trong OR, FALSE thắng trong AND bất kể vế kia; NOT FALSE là TRUE.' },
    { id: 'q6',
      question: 'tblEmployee has a FOREIGN KEY depNum REFERENCES tblDepartment, and tblWorksOn has foreign keys to tblEmployee and tblProject. In a fresh database, which CREATE TABLE order runs without error?|||tblEmployee có FOREIGN KEY depNum REFERENCES tblDepartment, còn tblWorksOn có khoá ngoại tới tblEmployee và tblProject. Trong một database mới, thứ tự CREATE TABLE nào chạy không lỗi?',
      options: ['tblDepartment, tblProject, tblEmployee, tblWorksOn|||tblDepartment, tblProject, tblEmployee, tblWorksOn', 'tblWorksOn, tblEmployee, tblProject, tblDepartment|||tblWorksOn, tblEmployee, tblProject, tblDepartment', 'tblEmployee, tblDepartment, tblProject, tblWorksOn|||tblEmployee, tblDepartment, tblProject, tblWorksOn', 'any order — foreign keys are checked only when rows are inserted|||thứ tự nào cũng được — khoá ngoại chỉ được kiểm khi chèn dòng'],
      correctIndex: 0,
      points: 1,
      explanation: 'A FOREIGN KEY must reference a table that already exists, so every parent is created before its children: Department before Employee, Employee and Project before WorksOn. C fails at once (Employee references a Department that does not exist yet); D is wrong because the reference is checked when the table is created — dropping goes in the reverse order.|||FOREIGN KEY phải tham chiếu một bảng đã tồn tại, nên mọi bảng cha được tạo trước bảng con: Department trước Employee, Employee và Project trước WorksOn. C lỗi ngay (Employee tham chiếu một Department chưa có); D sai vì tham chiếu được kiểm ngay lúc tạo bảng — còn khi xoá thì đi theo thứ tự ngược lại.' },
    { id: 'q7',
      question: 'Ticket(id INT IDENTITY(1,1) PRIMARY KEY, qty INT CHECK (qty > 0)). After the statements below, what is MAX(id)?|||Ticket(id INT IDENTITY(1,1) PRIMARY KEY, qty INT CHECK (qty > 0)). Sau các câu dưới đây, MAX(id) bằng bao nhiêu?',
      code: `CREATE TABLE Ticket (
    id INT IDENTITY(1,1) PRIMARY KEY,
    qty INT CHECK (qty > 0)
);
GO
INSERT INTO Ticket (qty) VALUES (10);
GO
INSERT INTO Ticket (qty) VALUES (-1);
GO
INSERT INTO Ticket (qty) VALUES (20);
SELECT MAX(id) FROM Ticket;`,
      codeLang: 'sql',
      options: ['2|||2', '3|||3', '1|||1', 'NULL|||NULL'],
      correctIndex: 1,
      points: 1,
      explanation: 'The first insert gets id 1. The second is refused by the CHECK, but SQL Server has already consumed identity value 2 for it; the third insert therefore gets 3. Answer A assumes identity numbers have no gaps — they do, after every failed insert or rolled-back transaction, so never use an IDENTITY as a row count.|||Câu chèn đầu nhận id 1. Câu thứ hai bị CHECK từ chối, nhưng SQL Server đã "tiêu" mất giá trị identity 2 cho nó; nên câu thứ ba nhận 3. Đáp án A cho rằng số identity không có lỗ hổng — thật ra có, sau mỗi lần chèn lỗi hay giao dịch bị huỷ, nên đừng bao giờ dùng IDENTITY để đếm số dòng.' },
    { id: 'q8',
      question: "The column empName is NVARCHAR(50) and holds N'Võ Việt Anh'. On a database with the default Latin collation, the query SELECT * FROM tblEmployee WHERE empName = 'Võ Việt Anh' (without N) returns no row. Why?|||Cột empName là NVARCHAR(50) và đang chứa N'Võ Việt Anh'. Trên database có collation Latin mặc định, câu SELECT * FROM tblEmployee WHERE empName = 'Võ Việt Anh' (không có N) không trả về dòng nào. Vì sao?",
      options: ['NVARCHAR columns can only be compared with LIKE|||Cột NVARCHAR chỉ so sánh được bằng LIKE', 'The comparison is case-sensitive|||Phép so sánh phân biệt hoa thường', 'String constants must be written in double quotes|||Hằng chuỗi phải viết trong nháy kép', "Without N the constant is non-Unicode, so ệ is converted to ? and the text becomes 'Võ Vi?t Anh'|||Không có N thì hằng chuỗi không phải Unicode, nên ệ bị đổi thành ? và chuỗi thành 'Võ Vi?t Anh'"],
      correctIndex: 3,
      points: 1,
      explanation: "A constant without N is VARCHAR in the database's code page (Latin-1 here), which has õ but not ệ; the missing letter becomes ?, so the constant no longer equals the stored name — silently, with no error. B is wrong: the default collation is case-insensitive; A and C describe rules that do not exist in SQL Server.|||Hằng chuỗi không có N là VARCHAR theo bảng mã của database (ở đây Latin-1), bảng mã này có õ nhưng không có ệ; chữ thiếu bị thành ?, nên hằng không còn bằng tên đã lưu — lặng lẽ, không báo lỗi. B sai: collation mặc định không phân biệt hoa thường; A và C là những luật không có trong SQL Server." },
    { id: 'q9',
      question: 'tblEmployee already holds 14 rows. What happens with  ALTER TABLE tblEmployee ADD empPhone VARCHAR(15) NOT NULL; ?|||tblEmployee đang có 14 dòng. Chuyện gì xảy ra với  ALTER TABLE tblEmployee ADD empPhone VARCHAR(15) NOT NULL; ?',
      options: ['The column is added and the 14 rows get an empty string|||Cột được thêm và 14 dòng nhận chuỗi rỗng', 'The column is added and the 14 rows get NULL despite NOT NULL|||Cột được thêm và 14 dòng nhận NULL dù có NOT NULL', 'Error — a NOT NULL column without a DEFAULT cannot be added to a table that has rows|||Lỗi — không thể thêm cột NOT NULL không có DEFAULT vào bảng đã có dòng', 'The 14 rows are deleted so that the column can be added|||14 dòng bị xoá để thêm được cột'],
      correctIndex: 2,
      points: 1,
      explanation: "The existing rows would have no value for a column that forbids NULL, so SQL Server refuses (Msg 4901, run in lesson 5.B slide 18). Fix: add a DEFAULT (… NOT NULL CONSTRAINT df_… DEFAULT 'N/A'), or add the column as NULL, fill it with UPDATE, then ALTER COLUMN … NOT NULL. SQL never invents an empty string (A) or breaks its own rule (B).|||Các dòng đang có sẽ không có giá trị cho một cột cấm NULL, nên SQL Server từ chối (Msg 4901, đã chạy ở bài 5.B slide 18). Cách sửa: thêm DEFAULT (… NOT NULL CONSTRAINT df_… DEFAULT 'N/A'), hoặc thêm cột dạng NULL, điền bằng UPDATE, rồi ALTER COLUMN … NOT NULL. SQL không bao giờ tự bịa chuỗi rỗng (A) hay tự phá luật của nó (B)." },
    { id: 'q10',
      question: 'You move the T-SQL column  IdEmp INT IDENTITY(1,1) PRIMARY KEY  to PostgreSQL. Which definition is the modern equivalent?|||Bạn chuyển cột T-SQL  IdEmp INT IDENTITY(1,1) PRIMARY KEY  sang PostgreSQL. Định nghĩa nào là bản tương đương hiện đại?',
      options: ['IdEmp INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY|||IdEmp INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY', 'IdEmp INT IDENTITY(1,1) PRIMARY KEY — PostgreSQL accepts it as is|||IdEmp INT IDENTITY(1,1) PRIMARY KEY — PostgreSQL nhận nguyên văn', 'IdEmp INT AUTO_INCREMENT PRIMARY KEY|||IdEmp INT AUTO_INCREMENT PRIMARY KEY', 'IdEmp INT DEFAULT GETDATE() PRIMARY KEY|||IdEmp INT DEFAULT GETDATE() PRIMARY KEY'],
      correctIndex: 0,
      points: 1,
      explanation: 'PostgreSQL uses the SQL-standard GENERATED ALWAYS AS IDENTITY (older code uses SERIAL); it ran in lesson 5.B slide 17. The IDENTITY(1,1) form is T-SQL only (B gives a syntax error), AUTO_INCREMENT is MySQL (C), and GETDATE() is a T-SQL date function, not a numbering mechanism (D).|||PostgreSQL dùng GENERATED ALWAYS AS IDENTITY theo chuẩn SQL (code cũ dùng SERIAL); câu này đã chạy ở bài 5.B slide 17. Dạng IDENTITY(1,1) chỉ T-SQL có (B báo lỗi cú pháp), AUTO_INCREMENT là của MySQL (C), còn GETDATE() là hàm ngày giờ của T-SQL chứ không phải cơ chế đánh số (D).' },
  ],
};

const QUIZ_LESSON = {
  title: 'Quiz — Chapter 5 · SQL DDL & integrity constraints|||Quiz — Chương 5 · SQL DDL & ràng buộc toàn vẹn',
  slug: 'dbi202-quiz-ch5',
  type: 'QUIZ',
  description: '10 câu về Chương 5 (slide Chapter 6 của trường, slide 1–21): CHECK gặp NULL, bẫy NOT IN có NULL, LIKE với _ và ESCAPE, lô-gic ba trị, thứ tự tạo bảng có khoá ngoại, IDENTITY bị hụt số, tiền tố N cho tiếng Việt, thêm cột NOT NULL vào bảng có dữ liệu, IDENTITY trên PostgreSQL — 4 câu được chạy thật trên SQL Server để xác nhận đáp án; mỗi câu có giải thích.',
  quiz: QUIZ,
};

export default {
  slides: [L_dbi7_1, L_dbi7_2],
  practice: L_on_ch5,
  quiz: QUIZ,
  quizDescription: '10 câu về Chương 5 (slide Chapter 6 của trường, slide 1–21): CHECK gặp NULL, bẫy NOT IN có NULL, LIKE với _ và ESCAPE, lô-gic ba trị, thứ tự tạo bảng có khoá ngoại, IDENTITY bị hụt số, tiền tố N cho tiếng Việt, thêm cột NOT NULL vào bảng có dữ liệu, IDENTITY trên PostgreSQL — 4 câu được chạy thật trên SQL Server để xác nhận đáp án; mỗi câu có giải thích.',
  quizLesson: QUIZ_LESSON,
};
