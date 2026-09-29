/**
 * DBI202 · Chương 7 — lập trình T-SQL: trigger, procedure, cursor, function (slide Chapter 8 của trường).
 * Bài 📑 học theo từng slide: dbi9 (Chapter 8.pptx, slide 1–51).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: dbi202-on-ch7.
 * Quiz MỚI (10 câu, slug dbi202-quiz-ch7).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/DBI202/gen/gen.mjs từ gen/src/** và gen/sql/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node DBI202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 7.A — 📑 Slide by slide · T-SQL basics: variables, IF, CASE, WHILE, errors (Chapter 8, 1–19) ───────── */
const L_dbi9_1 = {
  title: '7.A — 📑 Slide by slide · T-SQL basics: variables, IF, CASE, WHILE, errors (Chapter 8, 1–19)|||7.A — 📑 Học theo từng slide · T-SQL cơ bản: biến, IF, CASE, WHILE, xử lý lỗi (Chapter 8, 1–19)',
  slug: 'dbi202-slide-dbi9-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–19 của bộ slide Chapter 8 của trường (Database programming on SQL Server — trên web là Chương 7): mục tiêu, sơ đồ FUHCompany, biến DECLARE/SET/SELECT, PRINT và CAST/CONVERT, BEGIN…END, IF…ELSE, CASE, WHILE/BREAK/CONTINUE, @@ERROR và TRY…CATCH với giao dịch, rồi IF/LOOP/REPEAT/HANDLER của chuẩn SQL/PSM — mọi đoạn code chạy thật trên SQL Server, kèm ô 🐘 PL/pgSQL (khối DO, RAISE NOTICE, EXCEPTION) chạy thật trên PostgreSQL.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.A · school slides "Chapter 8", slides 1–19</span>
<h2>Programming inside the database (part 1) — the deck, slide by slide</h2>
<p class="lead">⚠️ <strong>This is the school's "Chapter 8" deck</strong> (Database programming on SQL Server, 51 slides). On this website it is <strong>Chapter 7</strong> — the numbers differ because the website teaches the SQL programming part before indexing (the school's Chapter 7). When your lecturer says "Chapter 8, slide 14", open this lesson.</p>
<div class="callout"><strong>Why "programming" in a database?</strong> Until now every SQL statement was one sentence: "give me the employees of department 1". Real work often needs <strong>several steps with decisions</strong>: "count the hours of this employee; if more than 300, the bonus is 1000, otherwise 500; if anything fails, undo everything". <strong>T-SQL</strong> (Transact-SQL, SQL Server's dialect) adds to SQL what every programming language has: <strong>variables</strong> (named boxes that hold a value), <strong>IF</strong> (choose), <strong>WHILE</strong> (repeat) and <strong>error handling</strong>. With them you can store small programs in the database: <strong>stored procedures</strong>, <strong>functions</strong>, <strong>triggers</strong> and <strong>cursors</strong> — the next two lessons.</div>
<h3>Four words of the chapter, in everyday life</h3>
<table>
<thead><tr><th>Word</th><th>Everyday picture</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>stored procedure</td><td>a recipe card kept in the kitchen: anyone says its name ("make phở, 2 bowls") and the cook follows the steps</td><td>7.B</td></tr>
<tr><td>function</td><td>a calculator button: give it a value, it gives back one value (or one table), and it changes nothing</td><td>7.B</td></tr>
<tr><td>trigger</td><td>a door alarm: nobody presses it — it rings by itself when someone opens the door (INSERT / UPDATE / DELETE)</td><td>7.C</td></tr>
<tr><td>cursor</td><td>a finger running down a list, one line at a time</td><td>7.C</td></tr>
</tbody>
</table>
<p>Every example runs on the course database <strong>FUHCompany</strong> (its diagram is slide 4), rebuilt fresh before each example, so the outputs below are real SQL Server output. Where PostgreSQL — the database you will use in your project and at work — is written differently (almost everywhere in this chapter), a 🐘 box shows the PostgreSQL version, which also really ran. (In those outputs the NOTICE lines — PostgreSQL's PRINT — are shown above the result tables, whatever order they were produced in.)</p>
<h3>This part in one table</h3>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>You must be able to</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>goals, contents, the FUHCompany diagram</td><td>name the 7 tables and their keys</td></tr>
<tr><td>5–7</td><td>variables: DECLARE, SET / SELECT, PRINT, CAST / CONVERT</td><td>declare, fill and print a variable; explain why CAST is needed</td></tr>
<tr><td>8–12</td><td>BEGIN…END, IF…ELSE, CASE, WHILE</td><td>write a small branch and a loop; predict what is printed</td></tr>
<tr><td>13–14</td><td>@@ERROR and TRY…CATCH with a transaction</td><td>undo two INSERTs when the second fails</td></tr>
<tr><td>15–19</td><td>the SQL standard (PSM): IF/ELSEIF, LOOP/LEAVE, REPEAT, handlers</td><td>translate each to T-SQL and to PostgreSQL</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Bài 7.A · slide "Chapter 8" của trường, slide 1–19</span>
<h2>Lập trình ngay trong cơ sở dữ liệu (phần 1) — học bộ slide từng trang</h2>
<p class="lead">⚠️ <strong>Đây là bộ slide "Chapter 8" của trường</strong> (Database programming on SQL Server — lập trình CSDL trên SQL Server, 51 slide). Trên web nó là <strong>Chương 7</strong> — số lệch vì web dạy phần lập trình SQL trước phần chỉ mục (Chapter 7 của trường). Khi thầy cô nói "Chapter 8, slide 14" thì mở bài này.</p>
<div class="callout"><strong>Vì sao lại "lập trình" trong CSDL?</strong> Tới giờ mỗi câu SQL chỉ là một câu nói: "cho tôi các nhân viên phòng 1". Việc thật thường cần <strong>nhiều bước có rẽ nhánh</strong>: "đếm giờ làm của nhân viên này; nếu hơn 300 thì thưởng 1000, không thì 500; nếu có gì lỗi thì huỷ hết". <strong>T-SQL</strong> (Transact-SQL, phương ngữ SQL của SQL Server) thêm vào SQL những thứ ngôn ngữ lập trình nào cũng có: <strong>biến</strong> (variable — cái hộp có tên để cất một giá trị), <strong>IF</strong> (chọn nhánh), <strong>WHILE</strong> (lặp) và <strong>xử lý lỗi</strong>. Có chúng, bạn cất được những chương trình nhỏ ngay trong CSDL: <strong>thủ tục lưu trữ</strong> (stored procedure), <strong>hàm</strong> (function), <strong>trigger</strong> và <strong>cursor</strong> — hai bài sau.</div>
<h3>Bốn từ của chương, bằng ví dụ đời thường</h3>
<table>
<thead><tr><th>Từ</th><th>Hình ảnh đời thường</th><th>Bài</th></tr></thead>
<tbody>
<tr><td>stored procedure (thủ tục lưu trữ)</td><td>tờ công thức nấu ăn cất sẵn trong bếp: ai gọi tên nó ("nấu phở, 2 bát") là đầu bếp làm theo từng bước</td><td>7.B</td></tr>
<tr><td>function (hàm)</td><td>một phím trên máy tính bỏ túi: đưa vào một giá trị, nó trả lại một giá trị (hoặc một bảng), và không làm thay đổi gì</td><td>7.B</td></tr>
<tr><td>trigger (bẫy sự kiện)</td><td>chuông báo trộm ở cửa: không ai bấm — nó tự kêu khi có người mở cửa (INSERT / UPDATE / DELETE)</td><td>7.C</td></tr>
<tr><td>cursor (con trỏ)</td><td>ngón tay dò xuống một danh sách, mỗi lần một dòng</td><td>7.C</td></tr>
</tbody>
</table>
<p>Mọi ví dụ chạy trên CSDL của môn là <strong>FUHCompany</strong> (sơ đồ ở slide 4), được dựng mới trước mỗi ví dụ, nên output bên dưới là output thật của SQL Server. Chỗ nào PostgreSQL — CSDL bạn sẽ dùng trong đồ án và khi đi làm — viết khác (gần như khắp chương này), có ô 🐘 cho bản PostgreSQL, cũng đã chạy thật. (Trong các output đó, dòng NOTICE — lệnh PRINT của PostgreSQL — được hiện phía trên các bảng kết quả, bất kể thứ tự chúng được sinh ra.)</p>
<h3>Cả phần này trong một bảng</h3>
<table>
<thead><tr><th>Slide</th><th>Ý chính</th><th>Bạn phải làm được</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>mục tiêu, nội dung, sơ đồ FUHCompany</td><td>kể tên 7 bảng và khoá của chúng</td></tr>
<tr><td>5–7</td><td>biến: DECLARE, SET / SELECT, PRINT, CAST / CONVERT</td><td>khai báo, gán, in một biến; giải thích vì sao cần CAST</td></tr>
<tr><td>8–12</td><td>BEGIN…END, IF…ELSE, CASE, WHILE</td><td>viết một nhánh rẽ và một vòng lặp nhỏ; đoán đúng cái gì được in ra</td></tr>
<tr><td>13–14</td><td>@@ERROR và TRY…CATCH với giao dịch</td><td>huỷ cả hai câu INSERT khi câu thứ hai lỗi</td></tr>
<tr><td>15–19</td><td>chuẩn SQL (PSM): IF/ELSEIF, LOOP/LEAVE, REPEAT, handler</td><td>dịch từng cái sang T-SQL và PostgreSQL</td></tr>
</tbody>
</table>`),
    walkHead('dbi9', 1, 19),
    walk('dbi9', [
      [1, 'Chapter 8 - Database programming on SQL Server',
        `<p class="y-chinh">🎯 Title slide: school Chapter 8, "Database programming on SQL Server" — on this website, Chapter 7.</p>
<p>After learning to <em>ask</em> the database (SELECT, Chapter 6), this deck teaches you to <em>store programs</em> in it: code that runs on the database server itself, next to the data.</p>
<p class="meo">🧠 Remember the swap: school Chapter 8 = web Chapter 7, school Chapter 7 = web Chapter 8.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề: Chapter 8 của trường, "Lập trình CSDL trên SQL Server" — trên web là Chương 7.</p>
<p>Sau khi học cách <em>hỏi</em> CSDL (SELECT, Chương 6), bộ slide này dạy cách <em>cất chương trình</em> vào trong nó: đoạn code chạy ngay trên máy chủ CSDL, sát bên dữ liệu.</p>
<p class="meo">🧠 Nhớ chỗ tráo số: Chapter 8 của trường = Chương 7 trên web, Chapter 7 của trường = Chương 8 trên web.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Six goals: understand what triggers, stored procedures, cursors and functions are for and how to use them; how T-SQL differs from other languages; and why these objects are useful compared with plain SQL statements.</p>
<table>
<thead><tr><th>Goal on the slide</th><th>In plain words</th><th>Where</th></tr></thead>
<tbody>
<tr><td>triggers</td><td>code that runs by itself when rows change</td><td>slides 35–47</td></tr>
<tr><td>stored procedures</td><td>named programs you call with EXEC</td><td>slides 25–30</td></tr>
<tr><td>cursors</td><td>reading a result one row at a time</td><td>slides 48–51</td></tr>
<tr><td>functions</td><td>named calculations you use inside SELECT</td><td>slides 31–34</td></tr>
<tr><td>T-SQL vs other languages</td><td>T-SQL works on whole sets of rows; Java/C work on one value at a time</td><td>slides 5–19</td></tr>
<tr><td>usefulness vs SQL statements</td><td>reuse, speed, security, rules nobody can bypass</td><td>slides 25, 36</td></tr>
</tbody>
</table>
<p class="meo">🧠 In the PE (practical exam, 85 minutes) the last 1–2 questions are almost always "write a stored procedure / function / trigger that …" — this chapter is worth real marks.</p>`,
        `<p class="y-chinh">🎯 Sáu mục tiêu: hiểu trigger, stored procedure, cursor, function dùng để làm gì và dùng thế nào; T-SQL khác các ngôn ngữ lập trình khác ra sao; và vì sao các đối tượng này hữu ích so với câu SQL thường.</p>
<table>
<thead><tr><th>Mục tiêu trên slide</th><th>Nói nôm na</th><th>Ở đâu</th></tr></thead>
<tbody>
<tr><td>trigger</td><td>đoạn code tự chạy khi dòng dữ liệu bị thay đổi</td><td>slide 35–47</td></tr>
<tr><td>stored procedure (thủ tục lưu trữ)</td><td>chương trình có tên, gọi bằng EXEC</td><td>slide 25–30</td></tr>
<tr><td>cursor (con trỏ)</td><td>đọc kết quả từng dòng một</td><td>slide 48–51</td></tr>
<tr><td>function (hàm)</td><td>phép tính có tên, dùng ngay trong SELECT</td><td>slide 31–34</td></tr>
<tr><td>T-SQL so với ngôn ngữ khác</td><td>T-SQL làm việc trên cả tập dòng; Java/C làm từng giá trị một</td><td>slide 5–19</td></tr>
<tr><td>lợi ích so với câu SQL</td><td>dùng lại, nhanh, an toàn, luật không ai lách được</td><td>slide 25, 36</td></tr>
</tbody>
</table>
<p class="meo">🧠 Trong bài PE (thi thực hành 85 phút), 1–2 câu cuối gần như luôn là "viết stored procedure / function / trigger để …" — chương này mang điểm thật.</p>`],
      [3, 'Contents',
        `<p class="y-chinh">🎯 Contents: T-SQL programming, stored procedures, functions, triggers, cursors — in that order.</p>
<p>The first part (T-SQL programming) is the "grammar": variables, IF, WHILE, errors. The four others are the four kinds of <strong>database objects</strong> built with that grammar and saved in the database, like tables are.</p>
<p>A saved object survives: close SSMS, restart the server — <code>psm_List_ALL_Of_Project</code> is still there and anyone with permission can call it.</p>`,
        `<p class="y-chinh">🎯 Nội dung: lập trình T-SQL, stored procedure, function, trigger, cursor — theo đúng thứ tự đó.</p>
<p>Phần đầu (lập trình T-SQL) là "ngữ pháp": biến, IF, WHILE, lỗi. Bốn phần sau là bốn loại <strong>đối tượng CSDL</strong> (database object) được viết bằng ngữ pháp đó và cất trong CSDL, giống như bảng được cất.</p>
<p>Đối tượng đã cất thì còn mãi: tắt SSMS, khởi động lại máy chủ — <code>psm_List_ALL_Of_Project</code> vẫn nằm đó và ai có quyền đều gọi được.</p>`],
      [4, 'Physical Diagram - FUHCompany',
        `<p class="y-chinh">🎯 The physical diagram of FUHCompany — the database every example of this chapter runs on: 7 tables, a key icon on every primary-key column, and one line per foreign key.</p>
<p>This is the same diagram as slide 21 of the "Chapter 6" deck (lesson 5.B), here complete and not covered. The data rebuilt from it:</p>
<pre><code class="language-sql">-- The 7 tables of FUHCompany and how many rows each holds
SELECT 'tblLocation' AS tableName, COUNT(*) AS numRows FROM tblLocation
UNION ALL SELECT 'tblDepartment',  COUNT(*) FROM tblDepartment
UNION ALL SELECT 'tblEmployee',    COUNT(*) FROM tblEmployee
UNION ALL SELECT 'tblDepLocation', COUNT(*) FROM tblDepLocation
UNION ALL SELECT 'tblProject',     COUNT(*) FROM tblProject
UNION ALL SELECT 'tblWorksOn',     COUNT(*) FROM tblWorksOn
UNION ALL SELECT 'tblDependent',   COUNT(*) FROM tblDependent;

-- Every line of the diagram = one foreign key (child column -&gt; parent table)
SELECT OBJECT_NAME(fk.parent_object_id)                           AS childTable,
       COL_NAME(fc.parent_object_id, fc.parent_column_id)         AS childColumn,
       OBJECT_NAME(fk.referenced_object_id)                       AS parentTable,
       fk.name                                                    AS constraintName
FROM sys.foreign_keys fk
JOIN sys.foreign_key_columns fc ON fc.constraint_object_id = fk.object_id
ORDER BY childTable, childColumn;</code></pre>
<table>
<thead><tr><th>tableName</th><th>numRows</th></tr></thead>
<tbody>
<tr><td>tblLocation</td><td>4</td></tr>
<tr><td>tblDepartment</td><td>5</td></tr>
<tr><td>tblEmployee</td><td>14</td></tr>
<tr><td>tblDepLocation</td><td>8</td></tr>
<tr><td>tblProject</td><td>6</td></tr>
<tr><td>tblWorksOn</td><td>16</td></tr>
<tr><td>tblDependent</td><td>5</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>childTable</th><th>childColumn</th><th>parentTable</th><th>constraintName</th></tr></thead>
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
<p>Read the second table as the lines of the diagram: <strong>child column → parent table</strong>. For example <code>tblEmployee.supervisorSSN → tblEmployee</code> is the line that goes out of tblEmployee and comes back into it (an employee is supervised by another employee), and <code>tblDepartment.mgrSSN → tblEmployee</code> is "the manager of a department is an employee".</p>
<p class="meo">🧠 Tie it to the ERD (Chapter 3): the M:N relationship WORKS_ON became the table tblWorksOn with key (empSSN, proNum); the weak entity DEPENDENT became tblDependent whose key contains the owner's key empSSN. Lecturers ask exactly this.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the same foreign keys are read from the catalog <code>pg_constraint</code> (T-SQL uses <code>sys.foreign_keys</code>); note the lower-case names — PostgreSQL folds unquoted names to lower case:
<pre><code class="language-sql">-- PostgreSQL keeps the same information in its catalog pg_constraint
SELECT conrelid::regclass  AS child_table,
       confrelid::regclass AS parent_table,
       conname             AS constraint_name
FROM pg_constraint
WHERE contype = 'f'          -- f = foreign key
ORDER BY 1, 3;</code></pre>
<table>
<thead><tr><th>child_table</th><th>parent_table</th><th>constraint_name</th></tr></thead>
<tbody>
<tr><td>tbldepartment</td><td>tblemployee</td><td>fk_department_manager</td></tr>
<tr><td>tblemployee</td><td>tbldepartment</td><td>fk_employee_department</td></tr>
<tr><td>tblemployee</td><td>tblemployee</td><td>fk_employee_supervisor</td></tr>
<tr><td>tbldeplocation</td><td>tbldepartment</td><td>fk_deplocation_department</td></tr>
<tr><td>tbldeplocation</td><td>tbllocation</td><td>fk_deplocation_location</td></tr>
<tr><td>tblproject</td><td>tbldepartment</td><td>fk_project_department</td></tr>
<tr><td>tblproject</td><td>tbllocation</td><td>fk_project_location</td></tr>
<tr><td>tblworkson</td><td>tblemployee</td><td>fk_workson_employee</td></tr>
<tr><td>tblworkson</td><td>tblproject</td><td>fk_workson_project</td></tr>
<tr><td>tbldependent</td><td>tblemployee</td><td>fk_dependent_employee</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL 3.2 — foreign keys</a>.</div>`,
        `<p class="y-chinh">🎯 Sơ đồ vật lý (physical diagram) của FUHCompany — CSDL mà mọi ví dụ của chương chạy trên đó: 7 bảng, biểu tượng chìa khoá ở mỗi cột khoá chính, mỗi đường nối là một khoá ngoại.</p>
<p>Đây là cùng sơ đồ với slide 21 của bộ "Chapter 6" (bài 5.B), ở đây đầy đủ, không bị che. Dữ liệu dựng lại từ nó:</p>
<pre><code class="language-sql">-- 7 bảng của FUHCompany và số dòng mỗi bảng
SELECT 'tblLocation' AS tableName, COUNT(*) AS numRows FROM tblLocation
UNION ALL SELECT 'tblDepartment',  COUNT(*) FROM tblDepartment
UNION ALL SELECT 'tblEmployee',    COUNT(*) FROM tblEmployee
UNION ALL SELECT 'tblDepLocation', COUNT(*) FROM tblDepLocation
UNION ALL SELECT 'tblProject',     COUNT(*) FROM tblProject
UNION ALL SELECT 'tblWorksOn',     COUNT(*) FROM tblWorksOn
UNION ALL SELECT 'tblDependent',   COUNT(*) FROM tblDependent;

-- Mỗi đường nối trên sơ đồ = một khoá ngoại (cột bảng con -&gt; bảng cha)
SELECT OBJECT_NAME(fk.parent_object_id)                           AS childTable,
       COL_NAME(fc.parent_object_id, fc.parent_column_id)         AS childColumn,
       OBJECT_NAME(fk.referenced_object_id)                       AS parentTable,
       fk.name                                                    AS constraintName
FROM sys.foreign_keys fk
JOIN sys.foreign_key_columns fc ON fc.constraint_object_id = fk.object_id
ORDER BY childTable, childColumn;</code></pre>
<table>
<thead><tr><th>tableName</th><th>numRows</th></tr></thead>
<tbody>
<tr><td>tblLocation</td><td>4</td></tr>
<tr><td>tblDepartment</td><td>5</td></tr>
<tr><td>tblEmployee</td><td>14</td></tr>
<tr><td>tblDepLocation</td><td>8</td></tr>
<tr><td>tblProject</td><td>6</td></tr>
<tr><td>tblWorksOn</td><td>16</td></tr>
<tr><td>tblDependent</td><td>5</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>childTable</th><th>childColumn</th><th>parentTable</th><th>constraintName</th></tr></thead>
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
<p>Đọc bảng thứ hai như các đường nối trên sơ đồ: <strong>cột bảng con → bảng cha</strong>. Ví dụ <code>tblEmployee.supervisorSSN → tblEmployee</code> là đường đi ra khỏi tblEmployee rồi quay về chính nó (nhân viên được một nhân viên khác giám sát), còn <code>tblDepartment.mgrSSN → tblEmployee</code> là "trưởng phòng của một phòng là một nhân viên".</p>
<p class="meo">🧠 Nối lại với ERD (Chương 3): liên kết M:N WORKS_ON thành bảng tblWorksOn có khoá (empSSN, proNum); thực thể yếu DEPENDENT thành tblDependent với khoá chứa khoá của chủ là empSSN. Thầy cô hỏi đúng mấy câu này.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> các khoá ngoại đó được đọc từ danh mục <code>pg_constraint</code> (T-SQL dùng <code>sys.foreign_keys</code>); để ý tên chữ thường — PostgreSQL gấp tên không đặt trong nháy kép về chữ thường:
<pre><code class="language-sql">-- PostgreSQL giữ cùng thông tin trong danh mục pg_constraint
SELECT conrelid::regclass  AS child_table,
       confrelid::regclass AS parent_table,
       conname             AS constraint_name
FROM pg_constraint
WHERE contype = 'f'          -- f = khoá ngoại
ORDER BY 1, 3;</code></pre>
<table>
<thead><tr><th>child_table</th><th>parent_table</th><th>constraint_name</th></tr></thead>
<tbody>
<tr><td>tbldepartment</td><td>tblemployee</td><td>fk_department_manager</td></tr>
<tr><td>tblemployee</td><td>tbldepartment</td><td>fk_employee_department</td></tr>
<tr><td>tblemployee</td><td>tblemployee</td><td>fk_employee_supervisor</td></tr>
<tr><td>tbldeplocation</td><td>tbldepartment</td><td>fk_deplocation_department</td></tr>
<tr><td>tbldeplocation</td><td>tbllocation</td><td>fk_deplocation_location</td></tr>
<tr><td>tblproject</td><td>tbldepartment</td><td>fk_project_department</td></tr>
<tr><td>tblproject</td><td>tbllocation</td><td>fk_project_location</td></tr>
<tr><td>tblworkson</td><td>tblemployee</td><td>fk_workson_employee</td></tr>
<tr><td>tblworkson</td><td>tblproject</td><td>fk_workson_project</td></tr>
<tr><td>tbldependent</td><td>tblemployee</td><td>fk_dependent_employee</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL 3.2 — khoá ngoại</a>.</div>`],
      [5, 'Variables - Declare a variable',
        `<p class="y-chinh">🎯 A variable is a named box that holds one value while the script runs; in T-SQL its name starts with @ and it is created with DECLARE.</p>
<p>Syntax: <code>DECLARE @local_variable [AS] data_type [= initialvalue], …</code> — the word AS is optional, the initial value too. The type can be any system type (INT, DECIMAL, NVARCHAR…) but not the old types text, ntext, image.</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- hide the "(n rows affected)" lines
-- Slide 5: declare three variables (the third one with an initial value)
DECLARE @empName NVARCHAR(20), @empSSN AS DECIMAL,
        @empSalary DECIMAL=1000
-- A variable that was never given a value is NULL
SELECT @empName AS empName, @empSSN AS empSSN, @empSalary AS empSalary</code></pre>
<table>
<thead><tr><th>empName</th><th>empSSN</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td><em>NULL</em></td><td><em>NULL</em></td><td>1000</td></tr>
</tbody>
</table>
<ul>
<li><code>@empName NVARCHAR(20)</code> — a box for 20 Unicode characters (N = Vietnamese accents are kept).</li>
<li><code>@empSSN AS DECIMAL</code> — DECIMAL with no size means DECIMAL(18,0): 18 digits, no decimals — enough for an SSN.</li>
<li><code>@empSalary DECIMAL=1000</code> — declared and filled in one step.</li>
<li>The two boxes nobody filled are <strong>NULL</strong>, not 0 and not ''. The first line of the code (<code>SET NOCOUNT ON</code>, not on the slide) only hides the "(n rows affected)" messages.</li>
</ul>
<div class="pitfall">A variable lives only in its <strong>batch</strong> (the code between two <code>GO</code>). Declare in one batch, use after a <code>GO</code> ⇒ "Must declare the scalar variable". In the PE, keep DECLARE and its use in the same batch.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a script cannot have loose variables: you write an anonymous block <code>DO $$ … $$</code>, declare variables in its DECLARE part (no @, <code>:=</code> for the initial value) and print with <code>RAISE NOTICE</code> (each % is replaced by the next value):
<pre><code class="language-sql">-- PL/pgSQL: variables live in the DECLARE part of a block, no @
DO $$
DECLARE
    v_emp_name   VARCHAR(20);
    v_emp_ssn    NUMERIC(18,0);
    v_emp_salary NUMERIC := 1000;     -- := gives the initial value
BEGIN
    RAISE NOTICE 'name=%, ssn=%, salary=%', v_emp_name, v_emp_ssn, v_emp_salary;
END $$;</code></pre>
<div class="out">NOTICE:  name=&lt;NULL&gt;, ssn=&lt;NULL&gt;, salary=1000</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions and PL/pgSQL</a>.</div>`,
        `<p class="y-chinh">🎯 Biến (variable) là một cái hộp có tên, giữ một giá trị trong lúc script chạy; trong T-SQL tên biến bắt đầu bằng @ và được tạo bằng DECLARE.</p>
<p>Cú pháp: <code>DECLARE @local_variable [AS] data_type [= initialvalue], …</code> — chữ AS có cũng được không có cũng được, giá trị đầu cũng vậy. Kiểu có thể là bất kỳ kiểu hệ thống nào (INT, DECIMAL, NVARCHAR…) trừ các kiểu cũ text, ntext, image.</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- tắt các dòng "(n rows affected)"
-- Slide 5: khai báo ba biến (biến thứ ba có giá trị đầu)
DECLARE @empName NVARCHAR(20), @empSSN AS DECIMAL,
        @empSalary DECIMAL=1000
-- Biến chưa được gán giá trị thì là NULL
SELECT @empName AS empName, @empSSN AS empSSN, @empSalary AS empSalary</code></pre>
<table>
<thead><tr><th>empName</th><th>empSSN</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td><em>NULL</em></td><td><em>NULL</em></td><td>1000</td></tr>
</tbody>
</table>
<ul>
<li><code>@empName NVARCHAR(20)</code> — hộp chứa 20 ký tự Unicode (N = giữ được dấu tiếng Việt).</li>
<li><code>@empSSN AS DECIMAL</code> — DECIMAL không ghi kích thước nghĩa là DECIMAL(18,0): 18 chữ số, không có phần thập phân — đủ cho mã SSN.</li>
<li><code>@empSalary DECIMAL=1000</code> — khai báo và gán luôn trong một bước.</li>
<li>Hai hộp chưa ai gán là <strong>NULL</strong>, không phải 0 cũng không phải ''. Dòng <code>SET NOCOUNT ON</code> (không có trên slide) chỉ để tắt các dòng thông báo "(n rows affected)".</li>
</ul>
<div class="pitfall">Biến chỉ sống trong <strong>lô</strong> (batch — đoạn code giữa hai chữ <code>GO</code>) của nó. Khai báo ở lô này, dùng sau một chữ <code>GO</code> ⇒ lỗi "Must declare the scalar variable" (phải khai báo biến). Trong bài PE, để DECLARE và chỗ dùng biến trong cùng một lô.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> script không có biến "thả rông": bạn viết một khối vô danh <code>DO $$ … $$</code>, khai báo biến trong phần DECLARE của nó (không có @, dùng <code>:=</code> cho giá trị đầu) và in bằng <code>RAISE NOTICE</code> (mỗi dấu % được thay bằng giá trị kế tiếp). Đi làm bạn sẽ gõ bản này:
<pre><code class="language-sql">-- PL/pgSQL: biến nằm trong phần DECLARE của một khối, không có @
DO $$
DECLARE
    v_emp_name   VARCHAR(20);
    v_emp_ssn    NUMERIC(18,0);
    v_emp_salary NUMERIC := 1000;     -- := gán giá trị đầu
BEGIN
    RAISE NOTICE 'name=%, ssn=%, salary=%', v_emp_name, v_emp_ssn, v_emp_salary;
END $$;</code></pre>
<div class="out">NOTICE:  name=&lt;NULL&gt;, ssn=&lt;NULL&gt;, salary=1000</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm và PL/pgSQL</a>.</div>`],
      [6, 'Variables - Assign a value',
        `<p class="y-chinh">🎯 Two ways to put a value in a variable: SET / SELECT with a constant, or SELECT / UPDATE that copies a column of a row into it.</p>
<p>The four statements of the slide, each followed by a PRINT so you can see the box (the slide's curly quotes ’ ‘ are corrected to straight quotes — SQL only accepts ').</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- hide the "(n rows affected)" lines
DECLARE @empName NVARCHAR(20), @empSSN AS DECIMAL, @empSalary DECIMAL=1000
-- 1. SET / SELECT with a constant
SET @empName=N'Mai Duy An'
SELECT @empSalary=2000
PRINT N'1) ' + @empName + N' - ' + CAST(@empSalary AS VARCHAR)

-- 2. SELECT reads the columns of one row into the variables
SELECT @empName=empName, @empSalary=empSalary
FROM   tblEmployee
WHERE  empName=N'Mai Duy An'
PRINT N'2) ' + @empName + N' - ' + CAST(@empSalary AS VARCHAR)

-- 3. UPDATE ... SET @var=column also fills variables
UPDATE tblEmployee
SET    @empName=empName, @empSalary=empSalary
WHERE  empName=N'Mai Duy An'
PRINT N'3) ' + @empName + N' - ' + CAST(@empSalary AS VARCHAR)</code></pre>
<div class="out">1) Mai Duy An - 2000<br>
2) Mai Duy An - 55000<br>
3) Mai Duy An - 55000</div>
<ul>
<li>1) <code>SET @v = value</code> is the normal form; <code>SELECT @v = value</code> also works.</li>
<li>2) <code>SELECT @empName=empName, @empSalary=empSalary FROM … WHERE …</code> fills <strong>several</strong> variables from one row in one statement — SET cannot do that.</li>
<li>3) <code>UPDATE … SET @v = column</code> is rare: it reads the value while updating (here nothing is really changed).</li>
</ul>
<p>What if the WHERE finds <strong>several</strong> rows? SELECT and SET behave differently:</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- hide the "(n rows affected)" lines
DECLARE @empName NVARCHAR(50)
-- Trap 1: SELECT @v = ... over MANY rows: no error, the variable keeps the LAST row read
SELECT @empName = empName FROM tblEmployee WHERE depNum = 1 ORDER BY empSSN
PRINT N'SELECT gave: ' + @empName
-- Trap 2: SET @v = (subquery) with many rows is an ERROR
SET @empName = (SELECT empName FROM tblEmployee WHERE depNum = 1)
PRINT N'this line still runs, @empName is now: ' + ISNULL(@empName, N'NULL')</code></pre>
<div class="out">SELECT gave: Lê Thị Lan Anh<br>
<b>Msg 512, Level 16, State 1<br>
Subquery returned more than 1 value. This is not permitted when the subquery follows =, !=, &lt;, &lt;= , &gt;, &gt;= or when the subquery is used as an expression.</b><br>
this line still runs, @empName is now: Lê Thị Lan Anh</div>
<div class="pitfall"><code>SELECT @v = col</code> over many rows gives <strong>no error</strong> — the box silently keeps the last row read (here Lê Thị Lan Anh, one of 4). <code>SET @v = (subquery)</code> refuses with Msg 512. When the query should return one row, use SET: an error is better than a wrong value you never notice.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong>: <code>:=</code> replaces SET, <code>SELECT … INTO var</code> replaces <code>SELECT @var = col</code>, <code>UPDATE … RETURNING … INTO</code> replaces <code>UPDATE SET @var = col</code>, and <code>INTO STRICT</code> turns "more than one row" into an error, like SET:
<pre><code class="language-sql">DO $$
DECLARE
    v_emp_name   VARCHAR(50);
    v_emp_salary NUMERIC := 1000;
BEGIN
    v_emp_name   := 'Mai Duy An';          -- plays the role of SET
    v_emp_salary := 2000;
    RAISE NOTICE '1) % - %', v_emp_name, v_emp_salary;

    SELECT empName, empSalary              -- SELECT ... INTO replaces SELECT @v = col
    INTO   v_emp_name, v_emp_salary
    FROM   tblEmployee
    WHERE  empName = 'Mai Duy An';
    RAISE NOTICE '2) % - %', v_emp_name, v_emp_salary;

    UPDATE tblEmployee SET empSalary = empSalary   -- UPDATE ... RETURNING ... INTO replaces UPDATE SET @v = col
    WHERE  empName = 'Mai Duy An'
    RETURNING empName, empSalary INTO v_emp_name, v_emp_salary;
    RAISE NOTICE '3) % - %', v_emp_name, v_emp_salary;

    -- STRICT turns "more than one row" into an error, like T-SQL SET @v = (subquery)
    BEGIN
        SELECT empName INTO STRICT v_emp_name FROM tblEmployee WHERE depNum = 1;
    EXCEPTION WHEN too_many_rows THEN
        RAISE NOTICE 'STRICT: %', SQLERRM;
    END;
END $$;</code></pre>
<div class="out">NOTICE:  1) Mai Duy An - 2000<br>
NOTICE:  2) Mai Duy An - 55000<br>
NOTICE:  3) Mai Duy An - 55000<br>
NOTICE:  STRICT: query returned more than one row</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions and PL/pgSQL</a>.</div>`,
        `<p class="y-chinh">🎯 Hai cách đưa giá trị vào biến: SET / SELECT với một hằng, hoặc SELECT / UPDATE chép một cột của một dòng vào biến.</p>
<p>Bốn câu của slide, mỗi câu kèm một PRINT để bạn nhìn thấy cái hộp (nháy cong ’ ‘ trên slide đã sửa thành nháy thẳng — SQL chỉ nhận dấu ').</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- tắt các dòng "(n rows affected)"
DECLARE @empName NVARCHAR(20), @empSSN AS DECIMAL, @empSalary DECIMAL=1000
-- 1. SET / SELECT với một hằng
SET @empName=N'Mai Duy An'
SELECT @empSalary=2000
PRINT N'1) ' + @empName + N' - ' + CAST(@empSalary AS VARCHAR)

-- 2. SELECT đọc các cột của một dòng vào biến
SELECT @empName=empName, @empSalary=empSalary
FROM   tblEmployee
WHERE  empName=N'Mai Duy An'
PRINT N'2) ' + @empName + N' - ' + CAST(@empSalary AS VARCHAR)

-- 3. UPDATE ... SET @biến=cột cũng gán được biến
UPDATE tblEmployee
SET    @empName=empName, @empSalary=empSalary
WHERE  empName=N'Mai Duy An'
PRINT N'3) ' + @empName + N' - ' + CAST(@empSalary AS VARCHAR)</code></pre>
<div class="out">1) Mai Duy An - 2000<br>
2) Mai Duy An - 55000<br>
3) Mai Duy An - 55000</div>
<ul>
<li>1) <code>SET @v = giá_trị</code> là cách bình thường; <code>SELECT @v = giá_trị</code> cũng được.</li>
<li>2) <code>SELECT @empName=empName, @empSalary=empSalary FROM … WHERE …</code> gán <strong>nhiều</strong> biến từ một dòng trong một câu — SET không làm được vậy.</li>
<li>3) <code>UPDATE … SET @v = cột</code> ít gặp: vừa cập nhật vừa đọc giá trị (ở đây không thật sự đổi gì).</li>
</ul>
<p>Nếu WHERE tìm ra <strong>nhiều</strong> dòng thì sao? SELECT và SET cư xử khác nhau:</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- tắt các dòng "(n rows affected)"
DECLARE @empName NVARCHAR(50)
-- Bẫy 1: SELECT @v = ... trên NHIỀU dòng: không lỗi, biến giữ dòng đọc CUỐI CÙNG
SELECT @empName = empName FROM tblEmployee WHERE depNum = 1 ORDER BY empSSN
PRINT N'SELECT gave: ' + @empName
-- Bẫy 2: SET @v = (truy vấn con) nhiều dòng thì LỖI
SET @empName = (SELECT empName FROM tblEmployee WHERE depNum = 1)
PRINT N'this line still runs, @empName is now: ' + ISNULL(@empName, N'NULL')</code></pre>
<div class="out">SELECT gave: Lê Thị Lan Anh<br>
<b>Msg 512, Level 16, State 1<br>
Subquery returned more than 1 value. This is not permitted when the subquery follows =, !=, &lt;, &lt;= , &gt;, &gt;= or when the subquery is used as an expression.</b><br>
this line still runs, @empName is now: Lê Thị Lan Anh</div>
<div class="pitfall"><code>SELECT @v = cột</code> trên nhiều dòng <strong>không báo lỗi</strong> — hộp lặng lẽ giữ dòng đọc cuối cùng (ở đây là Lê Thị Lan Anh, một trong 4 người). <code>SET @v = (truy vấn con)</code> thì từ chối với Msg 512. Khi câu truy vấn đáng lẽ chỉ ra một dòng, hãy dùng SET: một lỗi còn hơn một giá trị sai mà bạn không bao giờ phát hiện.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>: <code>:=</code> thay cho SET, <code>SELECT … INTO biến</code> thay cho <code>SELECT @biến = cột</code>, <code>UPDATE … RETURNING … INTO</code> thay cho <code>UPDATE SET @biến = cột</code>, và <code>INTO STRICT</code> biến "nhiều hơn một dòng" thành lỗi, giống SET:
<pre><code class="language-sql">DO $$
DECLARE
    v_emp_name   VARCHAR(50);
    v_emp_salary NUMERIC := 1000;
BEGIN
    v_emp_name   := 'Mai Duy An';          -- đóng vai SET
    v_emp_salary := 2000;
    RAISE NOTICE '1) % - %', v_emp_name, v_emp_salary;

    SELECT empName, empSalary              -- SELECT ... INTO thay cho SELECT @v = cột
    INTO   v_emp_name, v_emp_salary
    FROM   tblEmployee
    WHERE  empName = 'Mai Duy An';
    RAISE NOTICE '2) % - %', v_emp_name, v_emp_salary;

    UPDATE tblEmployee SET empSalary = empSalary   -- UPDATE ... RETURNING ... INTO thay cho UPDATE SET @v = cột
    WHERE  empName = 'Mai Duy An'
    RETURNING empName, empSalary INTO v_emp_name, v_emp_salary;
    RAISE NOTICE '3) % - %', v_emp_name, v_emp_salary;

    -- STRICT biến "nhiều hơn một dòng" thành lỗi, giống SET @v = (truy vấn con) của T-SQL
    BEGIN
        SELECT empName INTO STRICT v_emp_name FROM tblEmployee WHERE depNum = 1;
    EXCEPTION WHEN too_many_rows THEN
        RAISE NOTICE 'STRICT: %', SQLERRM;
    END;
END $$;</code></pre>
<div class="out">NOTICE:  1) Mai Duy An - 2000<br>
NOTICE:  2) Mai Duy An - 55000<br>
NOTICE:  3) Mai Duy An - 55000<br>
NOTICE:  STRICT: query returned more than one row</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm và PL/pgSQL</a>.</div>`],
      [7, 'Variables - PRINT, CAST and CONVERT',
        `<p class="y-chinh">🎯 Show a variable with PRINT (a text line in the Messages tab) or SELECT (a result grid); join text and numbers only after converting the number with CAST or CONVERT.</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- hide the "(n rows affected)" lines
DECLARE @empName NVARCHAR(20), @empSalary DECIMAL
SET @empName=N'Mai Duy An'
SET @empSalary=1000
PRINT @empName + '''s salary is ' + CAST(@empSalary AS VARCHAR)
PRINT @empName + '''s salary is ' + CONVERT(VARCHAR, @empSalary)
-- SELECT shows the value as a result grid instead of a message
SELECT @empSalary</code></pre>
<div class="out">Mai Duy An's salary is 1000<br>
Mai Duy An's salary is 1000</div>
<table>
<thead><tr><th>(No column name)</th></tr></thead>
<tbody>
<tr><td>1000</td></tr>
</tbody>
</table>
<ul>
<li><code>'''s salary is '</code> — inside a string, two quotes <code>''</code> mean one real quote: the text is <em>'s salary is</em>.</li>
<li><code>CAST(@empSalary AS VARCHAR)</code> and <code>CONVERT(VARCHAR, @empSalary)</code> do the same job: number → text. CAST is standard SQL; CONVERT is T-SQL only (it also takes a style number for dates, e.g. <code>CONVERT(VARCHAR, GETDATE(), 103)</code> = dd/mm/yyyy).</li>
<li>PRINT output goes to the <strong>Messages</strong> tab of SSMS; SELECT output goes to the <strong>Results</strong> grid, with "(No column name)" because no alias was given.</li>
</ul>
<p>Why the CAST is compulsory — the same line without it:</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- hide the "(n rows affected)" lines
DECLARE @empName NVARCHAR(20), @empSalary DECIMAL
SET @empName=N'Mai Duy An'
SET @empSalary=1000
-- Without CAST, SQL Server tries to turn the TEXT into a number
PRINT @empName + '''s salary is ' + @empSalary</code></pre>
<div class="out"><b>Msg 8114, Level 16, State 5<br>
Error converting data type nvarchar to numeric.</b></div>
<div class="pitfall"><code>+</code> between a text and a number is not "join": SQL Server tries to turn the <em>text</em> into a number (numbers win the type contest) and fails with Msg 8114. Always CAST the number first.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> <code>RAISE NOTICE</code> fills each <code>%</code> with a value of any type — no CAST needed; to build a string yourself, join with <code>||</code> and convert with <code>::text</code> (short for CAST):
<pre><code class="language-sql">DO $$
DECLARE
    v_emp_name   VARCHAR(20) := 'Mai Duy An';
    v_emp_salary NUMERIC     := 1000;
BEGIN
    -- each % is replaced by the next argument, no CAST needed
    RAISE NOTICE '%''s salary is %', v_emp_name, v_emp_salary;
    -- string concatenation is || and ::text is the short form of CAST
    RAISE NOTICE '%', v_emp_name || '''s salary is ' || v_emp_salary::text;
END $$;</code></pre>
<div class="out">NOTICE:  Mai Duy An's salary is 1000<br>
NOTICE:  Mai Duy An's salary is 1000</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-2-text">PostgreSQL 2.2 — text</a>.</div>`,
        `<p class="y-chinh">🎯 Hiện một biến bằng PRINT (một dòng chữ trong tab Messages) hoặc SELECT (một bảng kết quả); chỉ nối chữ với số sau khi đã đổi số sang chữ bằng CAST hoặc CONVERT.</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- tắt các dòng "(n rows affected)"
DECLARE @empName NVARCHAR(20), @empSalary DECIMAL
SET @empName=N'Mai Duy An'
SET @empSalary=1000
PRINT @empName + '''s salary is ' + CAST(@empSalary AS VARCHAR)
PRINT @empName + '''s salary is ' + CONVERT(VARCHAR, @empSalary)
-- SELECT hiện giá trị thành một bảng kết quả thay vì một dòng thông báo
SELECT @empSalary</code></pre>
<div class="out">Mai Duy An's salary is 1000<br>
Mai Duy An's salary is 1000</div>
<table>
<thead><tr><th>(No column name)</th></tr></thead>
<tbody>
<tr><td>1000</td></tr>
</tbody>
</table>
<ul>
<li><code>'''s salary is '</code> — trong một chuỗi, hai dấu nháy <code>''</code> nghĩa là một dấu nháy thật: chữ thu được là <em>'s salary is</em>.</li>
<li><code>CAST(@empSalary AS VARCHAR)</code> và <code>CONVERT(VARCHAR, @empSalary)</code> làm cùng một việc: số → chữ. CAST là SQL chuẩn; CONVERT chỉ có ở T-SQL (nó nhận thêm mã kiểu cho ngày, ví dụ <code>CONVERT(VARCHAR, GETDATE(), 103)</code> = dd/mm/yyyy).</li>
<li>Output của PRINT ra tab <strong>Messages</strong> (thông báo) của SSMS; output của SELECT ra lưới <strong>Results</strong> (kết quả), với tên cột "(No column name)" vì không đặt bí danh.</li>
</ul>
<p>Vì sao bắt buộc phải CAST — đúng dòng đó mà bỏ CAST:</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- tắt các dòng "(n rows affected)"
DECLARE @empName NVARCHAR(20), @empSalary DECIMAL
SET @empName=N'Mai Duy An'
SET @empSalary=1000
-- Thiếu CAST, SQL Server cố đổi CHỮ thành số
PRINT @empName + '''s salary is ' + @empSalary</code></pre>
<div class="out"><b>Msg 8114, Level 16, State 5<br>
Error converting data type nvarchar to numeric.</b></div>
<div class="pitfall"><code>+</code> giữa chữ và số không phải là "nối": SQL Server cố đổi <em>chữ</em> thành số (kiểu số "thắng" trong cuộc so kiểu) và hỏng với Msg 8114. Luôn CAST số trước.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> <code>RAISE NOTICE</code> điền mỗi <code>%</code> bằng một giá trị thuộc kiểu nào cũng được — không cần CAST; muốn tự ghép chuỗi thì nối bằng <code>||</code> và đổi kiểu bằng <code>::text</code> (dạng viết tắt của CAST):
<pre><code class="language-sql">DO $$
DECLARE
    v_emp_name   VARCHAR(20) := 'Mai Duy An';
    v_emp_salary NUMERIC     := 1000;
BEGIN
    -- mỗi dấu % được thay bằng đối số kế tiếp, không cần CAST
    RAISE NOTICE '%''s salary is %', v_emp_name, v_emp_salary;
    -- nối chuỗi là || và ::text là dạng viết tắt của CAST
    RAISE NOTICE '%', v_emp_name || '''s salary is ' || v_emp_salary::text;
END $$;</code></pre>
<div class="out">NOTICE:  Mai Duy An's salary is 1000<br>
NOTICE:  Mai Duy An's salary is 1000</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-2-text">PostgreSQL 2.2 — kiểu chữ</a>.</div>`],
      [8, 'Flow-control statement',
        `<p class="y-chinh">🎯 The flow-control toolbox of T-SQL: statement blocks (BEGIN…END), choices (IF…ELSE, CASE…WHEN), a loop (WHILE) and error handling (@@ERROR, TRY…CATCH).</p>
<p>"Flow control" means deciding <em>which</em> statement runs next instead of simply top to bottom — like a recipe that says "if the soup is too salty, add water; stir until it boils".</p>
<table>
<thead><tr><th>Tool</th><th>Question it answers</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>BEGIN…END</td><td>which statements belong together?</td><td>9</td></tr>
<tr><td>IF…ELSE</td><td>which of two ways?</td><td>9</td></tr>
<tr><td>CASE…WHEN</td><td>which value among many?</td><td>10–11</td></tr>
<tr><td>WHILE (+ BREAK, CONTINUE)</td><td>how many times?</td><td>12</td></tr>
<tr><td>@@ERROR, TRY…CATCH</td><td>what if something fails?</td><td>13–14</td></tr>
</tbody>
</table>
<p class="meo">🧠 T-SQL has no FOR loop and no ELSEIF keyword — only WHILE and "ELSE IF". PostgreSQL has both (slides 12 and 15).</p>`,
        `<p class="y-chinh">🎯 Hộp đồ nghề điều khiển luồng (flow control) của T-SQL: khối lệnh (BEGIN…END), rẽ nhánh (IF…ELSE, CASE…WHEN), vòng lặp (WHILE) và xử lý lỗi (@@ERROR, TRY…CATCH).</p>
<p>"Điều khiển luồng" là quyết định câu lệnh <em>nào</em> chạy tiếp theo, thay vì cứ chạy từ trên xuống — như công thức nấu ăn ghi "nếu canh mặn thì thêm nước; khuấy cho tới khi sôi".</p>
<table>
<thead><tr><th>Đồ nghề</th><th>Trả lời câu hỏi</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>BEGIN…END</td><td>những câu nào đi chung một khối?</td><td>9</td></tr>
<tr><td>IF…ELSE</td><td>chọn đường nào trong hai?</td><td>9</td></tr>
<tr><td>CASE…WHEN</td><td>chọn giá trị nào trong nhiều?</td><td>10–11</td></tr>
<tr><td>WHILE (+ BREAK, CONTINUE)</td><td>lặp bao nhiêu lần?</td><td>12</td></tr>
<tr><td>@@ERROR, TRY…CATCH</td><td>nếu có gì hỏng thì sao?</td><td>13–14</td></tr>
</tbody>
</table>
<p class="meo">🧠 T-SQL không có vòng FOR và không có từ khoá ELSEIF — chỉ có WHILE và "ELSE IF". PostgreSQL có cả hai (slide 12 và 15).</p>`],
      [9, 'BEGIN...END and IF...ELSE',
        `<p class="y-chinh">🎯 IF…ELSE evaluates a condition and runs one branch; when a branch has more than one statement, wrap it in BEGIN…END (every BEGIN needs its END in the same batch).</p>
<p>The slide's example: total hours of employee 30121050027; more than 300 ⇒ bonus 1000, otherwise 500.</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @workHours DECIMAL, @bonus DECIMAL
SELECT  @workHours=SUM(workHours)
FROM    tblWorksOn
WHERE   empSSN=30121050027
GROUP BY empSSN
IF (@workHours &gt; 300)
    SET @bonus=1000
ELSE
    SET @bonus=500
PRINT @bonus
-- (added) show the number that was compared
PRINT N'workHours = ' + CAST(@workHours AS VARCHAR)</code></pre>
<div class="out">500<br>
workHours = 30</div>
<ul>
<li><code>SELECT @workHours=SUM(workHours) … GROUP BY empSSN</code> — one row (Trương Thị Thu works 30 hours on project 5), so the box gets 30.</li>
<li><code>IF (@workHours &gt; 300)</code> is FALSE ⇒ the ELSE branch runs ⇒ 500 is printed. The last PRINT (added) shows the number compared.</li>
</ul>
<p>With two statements per branch, BEGIN…END is required — and without it only the first statement belongs to the IF:</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @workHours DECIMAL, @bonus DECIMAL
SELECT @workHours = SUM(workHours) FROM tblWorksOn WHERE empSSN = 30121050027
-- Two statements after IF need BEGIN ... END
IF (@workHours &gt; 20)
BEGIN
    SET @bonus = 1000
    PRINT N'Many hours: bonus 1000'
END
ELSE
BEGIN
    SET @bonus = 500
    PRINT N'Few hours: bonus 500'
END
-- Trap: WITHOUT BEGIN...END only the FIRST statement belongs to the IF
IF (@workHours &gt; 1000)
    PRINT N'(A) printed only when the condition is true'
    PRINT N'(B) printed ALWAYS - it is outside the IF'</code></pre>
<div class="out">Many hours: bonus 1000<br>
(B) printed ALWAYS - it is outside the IF</div>
<div class="pitfall">Line (B) is printed although the condition (> 1000) is false: indentation means nothing in T-SQL. After IF, "one statement" unless BEGIN…END. Classic PE bug: <code>IF … RAISERROR(…) ROLLBACK</code> without BEGIN…END rolls back <em>every</em> time.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the branch is closed by keywords instead of BEGIN…END: <code>IF cond THEN … ELSE … END IF;</code> — no ambiguity is possible:
<pre><code class="language-sql">DO $$
DECLARE
    v_work_hours NUMERIC;
    v_bonus      NUMERIC;
BEGIN
    SELECT SUM(workHours) INTO v_work_hours
    FROM   tblWorksOn
    WHERE  empSSN = 30121050027;

    IF v_work_hours &gt; 300 THEN          -- THEN ... END IF instead of BEGIN ... END
        v_bonus := 1000;
    ELSE
        v_bonus := 500;
    END IF;
    RAISE NOTICE 'workHours = %, bonus = %', v_work_hours, v_bonus;
END $$;</code></pre>
<div class="out">NOTICE:  workHours = 30.0, bonus = 500</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions and PL/pgSQL</a>.</div>`,
        `<p class="y-chinh">🎯 IF…ELSE xét một điều kiện rồi chạy một nhánh; khi một nhánh có hơn một câu lệnh thì bọc nó trong BEGIN…END (mỗi BEGIN phải có END của nó trong cùng một lô).</p>
<p>Ví dụ của slide: tổng giờ làm của nhân viên 30121050027; hơn 300 ⇒ thưởng 1000, không thì 500.</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @workHours DECIMAL, @bonus DECIMAL
SELECT  @workHours=SUM(workHours)
FROM    tblWorksOn
WHERE   empSSN=30121050027
GROUP BY empSSN
IF (@workHours &gt; 300)
    SET @bonus=1000
ELSE
    SET @bonus=500
PRINT @bonus
-- (thêm) in ra con số đã được so sánh
PRINT N'workHours = ' + CAST(@workHours AS VARCHAR)</code></pre>
<div class="out">500<br>
workHours = 30</div>
<ul>
<li><code>SELECT @workHours=SUM(workHours) … GROUP BY empSSN</code> — ra một dòng (Trương Thị Thu làm 30 giờ ở dự án 5), nên hộp nhận 30.</li>
<li><code>IF (@workHours &gt; 300)</code> là FALSE ⇒ nhánh ELSE chạy ⇒ in ra 500. Câu PRINT cuối (thêm vào) in con số đã được so sánh.</li>
</ul>
<p>Nhánh có hai câu lệnh thì bắt buộc BEGIN…END — và nếu thiếu, chỉ câu đầu tiên thuộc về IF:</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @workHours DECIMAL, @bonus DECIMAL
SELECT @workHours = SUM(workHours) FROM tblWorksOn WHERE empSSN = 30121050027
-- Hai câu lệnh sau IF thì phải có BEGIN ... END
IF (@workHours &gt; 20)
BEGIN
    SET @bonus = 1000
    PRINT N'Many hours: bonus 1000'
END
ELSE
BEGIN
    SET @bonus = 500
    PRINT N'Few hours: bonus 500'
END
-- Bẫy: THIẾU BEGIN...END thì chỉ câu ĐẦU TIÊN thuộc về IF
IF (@workHours &gt; 1000)
    PRINT N'(A) printed only when the condition is true'
    PRINT N'(B) printed ALWAYS - it is outside the IF'</code></pre>
<div class="out">Many hours: bonus 1000<br>
(B) printed ALWAYS - it is outside the IF</div>
<div class="pitfall">Dòng (B) vẫn được in dù điều kiện (> 1000) sai: thụt lề không có nghĩa gì trong T-SQL. Sau IF chỉ là "một câu lệnh" nếu không có BEGIN…END. Lỗi kinh điển trong bài PE: <code>IF … RAISERROR(…) ROLLBACK</code> thiếu BEGIN…END thì lần nào cũng ROLLBACK.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> nhánh được đóng bằng từ khoá thay cho BEGIN…END: <code>IF điều_kiện THEN … ELSE … END IF;</code> — không thể hiểu nhầm:
<pre><code class="language-sql">DO $$
DECLARE
    v_work_hours NUMERIC;
    v_bonus      NUMERIC;
BEGIN
    SELECT SUM(workHours) INTO v_work_hours
    FROM   tblWorksOn
    WHERE  empSSN = 30121050027;

    IF v_work_hours &gt; 300 THEN          -- THEN ... END IF thay cho BEGIN ... END
        v_bonus := 1000;
    ELSE
        v_bonus := 500;
    END IF;
    RAISE NOTICE 'workHours = %, bonus = %', v_work_hours, v_bonus;
END $$;</code></pre>
<div class="out">NOTICE:  workHours = 30.0, bonus = 500</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm và PL/pgSQL</a>.</div>`],
      [10, 'CASE ... WHEN Statement',
        `<p class="y-chinh">🎯 CASE compares one input with a list of values and returns the result of the first match (or the ELSE result) — a multi-way IF that produces a value.</p>
<p>Syntax: <code>CASE input WHEN value THEN result [WHEN … THEN …]… [ELSE result] END</code>. The slide's example, copied exactly:</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @depNum DECIMAL, @str NVARCHAR(30)
SET @str=
    CASE @depNum
        WHEN 1 THEN N'Phòng ban số 1'
        WHEN 2 THEN N'Phòng ban số 2'
        ELSE N'Mã phòng ban khác 1, 2'
    END
PRINT @str
-- The slide never gives @depNum a value (it is NULL). Give it one and run the CASE again:
SET @depNum = 2
SET @str = CASE @depNum WHEN 1 THEN N'Phòng ban số 1' WHEN 2 THEN N'Phòng ban số 2' ELSE N'Mã phòng ban khác 1, 2' END
PRINT @str</code></pre>
<div class="out">Mã phòng ban khác 1, 2<br>
Phòng ban số 2</div>
<ul>
<li>The first line printed is the ELSE text — surprise? The slide <strong>never gives @depNum a value</strong>, so it is NULL; <code>CASE NULL WHEN 1</code> is not TRUE (NULL = 1 is UNKNOWN), no WHEN matches, ELSE wins.</li>
<li>After <code>SET @depNum = 2</code> (added below the slide's code) the second WHEN matches: "Phòng ban số 2".</li>
<li>Without ELSE and without a match, CASE returns NULL — and PRINT of NULL prints an empty line.</li>
</ul>
<p class="meo">🧠 Here CASE is an <em>expression</em> (it produces a value that SET stores), not a statement that runs code. To run different statements, use IF.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the CASE expression is identical; PL/pgSQL also has a CASE <em>statement</em> that runs statements and ends with <code>END CASE</code>:
<pre><code class="language-sql">DO $$
DECLARE
    v_dep_num INT;               -- NULL, as on the slide
    v_str     VARCHAR(30);
BEGIN
    -- CASE expression: identical syntax
    v_str := CASE v_dep_num WHEN 1 THEN 'Phòng ban số 1'
                            WHEN 2 THEN 'Phòng ban số 2'
                            ELSE 'Mã phòng ban khác 1, 2' END;
    RAISE NOTICE '%', v_str;
    -- PL/pgSQL also has a CASE STATEMENT (runs statements, ends with END CASE)
    v_dep_num := 2;
    CASE v_dep_num
        WHEN 1 THEN RAISE NOTICE 'Phòng ban số 1';
        WHEN 2 THEN RAISE NOTICE 'Phòng ban số 2';
        ELSE        RAISE NOTICE 'Mã phòng ban khác 1, 2';
    END CASE;
END $$;</code></pre>
<div class="out">NOTICE:  Mã phòng ban khác 1, 2<br>
NOTICE:  Phòng ban số 2</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions and PL/pgSQL</a>.</div>`,
        `<p class="y-chinh">🎯 CASE so một đầu vào với danh sách giá trị và trả về kết quả của giá trị khớp đầu tiên (hoặc kết quả ELSE) — một kiểu IF nhiều nhánh sinh ra giá trị.</p>
<p>Cú pháp: <code>CASE đầu_vào WHEN giá_trị THEN kết_quả [WHEN … THEN …]… [ELSE kết_quả] END</code>. Ví dụ của slide, chép nguyên:</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @depNum DECIMAL, @str NVARCHAR(30)
SET @str=
    CASE @depNum
        WHEN 1 THEN N'Phòng ban số 1'
        WHEN 2 THEN N'Phòng ban số 2'
        ELSE N'Mã phòng ban khác 1, 2'
    END
PRINT @str
-- Slide không hề gán @depNum (nó là NULL). Gán một giá trị rồi chạy lại CASE:
SET @depNum = 2
SET @str = CASE @depNum WHEN 1 THEN N'Phòng ban số 1' WHEN 2 THEN N'Phòng ban số 2' ELSE N'Mã phòng ban khác 1, 2' END
PRINT @str</code></pre>
<div class="out">Mã phòng ban khác 1, 2<br>
Phòng ban số 2</div>
<ul>
<li>Dòng in ra đầu tiên là chữ của ELSE — bất ngờ không? Slide <strong>không hề gán giá trị cho @depNum</strong>, nên nó là NULL; <code>CASE NULL WHEN 1</code> không TRUE (NULL = 1 là UNKNOWN), không WHEN nào khớp, ELSE thắng.</li>
<li>Sau <code>SET @depNum = 2</code> (thêm bên dưới code của slide) thì WHEN thứ hai khớp: "Phòng ban số 2".</li>
<li>Không có ELSE mà không khớp gì thì CASE trả NULL — và PRINT một giá trị NULL thì in ra dòng trống.</li>
</ul>
<p class="meo">🧠 Ở đây CASE là một <em>biểu thức</em> (sinh ra giá trị để SET cất vào biến), không phải câu lệnh chạy code. Muốn chạy các câu lệnh khác nhau thì dùng IF.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> biểu thức CASE y hệt; PL/pgSQL còn có <em>câu lệnh</em> CASE chạy các câu lệnh và kết thúc bằng <code>END CASE</code>:
<pre><code class="language-sql">DO $$
DECLARE
    v_dep_num INT;               -- NULL, giống trên slide
    v_str     VARCHAR(30);
BEGIN
    -- Biểu thức CASE: cú pháp y hệt
    v_str := CASE v_dep_num WHEN 1 THEN 'Phòng ban số 1'
                            WHEN 2 THEN 'Phòng ban số 2'
                            ELSE 'Mã phòng ban khác 1, 2' END;
    RAISE NOTICE '%', v_str;
    -- PL/pgSQL còn có CÂU LỆNH CASE (chạy câu lệnh, kết thúc bằng END CASE)
    v_dep_num := 2;
    CASE v_dep_num
        WHEN 1 THEN RAISE NOTICE 'Phòng ban số 1';
        WHEN 2 THEN RAISE NOTICE 'Phòng ban số 2';
        ELSE        RAISE NOTICE 'Mã phòng ban khác 1, 2';
    END CASE;
END $$;</code></pre>
<div class="out">NOTICE:  Mã phòng ban khác 1, 2<br>
NOTICE:  Phòng ban số 2</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm và PL/pgSQL</a>.</div>`],
      [11, 'CASE inside statements',
        `<p class="y-chinh">🎯 CASE can be used inside SELECT, UPDATE, DELETE and SET, and in the SELECT list, IN, WHERE, ORDER BY and HAVING — anywhere a value is allowed.</p>
<p>The slide's example: a Women's Day bonus, 500 for a woman and 0 for a man, for employee 30121050004 (the slide's curly quote in ‘M' is corrected):</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @womanDayBonus DECIMAL
SELECT @womanDayBonus =
    CASE empSex
        WHEN 'F' THEN 500
        WHEN 'M' THEN 0
    END
FROM tblEmployee
WHERE empSSN=30121050004
PRINT @womanDayBonus
-- (added) the same CASE inside a normal SELECT list, for every employee of department 1
SELECT empSSN, empName, empSex,
       CASE empSex WHEN 'F' THEN 500 WHEN 'M' THEN 0 END AS womanDayBonus
FROM tblEmployee
WHERE depNum = 1
ORDER BY empSSN;</code></pre>
<div class="out">500</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSex</th><th>womanDayBonus</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>M</td><td>0</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>F</td><td>500</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>M</td><td>0</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>F</td><td>500</td></tr>
</tbody>
</table>
<ul>
<li><code>SELECT @womanDayBonus = CASE empSex WHEN 'F' THEN 500 WHEN 'M' THEN 0 END FROM … WHERE empSSN=…</code> — one row, a woman (Lê Thị Lan Anh) ⇒ 500.</li>
<li>The added query uses the same CASE as a <strong>computed column</strong> for every employee of department 1 — the everyday use of CASE in reports.</li>
</ul>
<p class="meo">🧠 Two forms of CASE: <em>simple</em> <code>CASE col WHEN value …</code> (compares with =) and <em>searched</em> <code>CASE WHEN condition …</code> (any condition, e.g. <code>WHEN empSalary &gt;= 100000 THEN 'A'</code>). Only the searched form can test ranges or NULL (<code>WHEN x IS NULL</code>).</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> CASE inside a query is written exactly the same; inside a block the value is stored with <code>SELECT … INTO</code>:
<pre><code class="language-sql">-- In a query, CASE is written exactly the same in PostgreSQL
SELECT empSSN, empName, empSex,
       CASE empSex WHEN 'F' THEN 500 WHEN 'M' THEN 0 END AS womanDayBonus
FROM tblEmployee
WHERE depNum = 1
ORDER BY empSSN;
-- Inside a block, SELECT ... INTO stores it in a variable
DO $$
DECLARE v_bonus NUMERIC;
BEGIN
    SELECT CASE empSex WHEN 'F' THEN 500 WHEN 'M' THEN 0 END
    INTO   v_bonus
    FROM   tblEmployee WHERE empSSN = 30121050004;
    RAISE NOTICE 'womanDayBonus = %', v_bonus;
END $$;</code></pre>
<div class="out">NOTICE:  womanDayBonus = 500</div>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>empsex</th><th>womandaybonus</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>M</td><td>0</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>F</td><td>500</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>M</td><td>0</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>F</td><td>500</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-2-select-where">PostgreSQL 4.2 — SELECT and WHERE</a>.</div>`,
        `<p class="y-chinh">🎯 CASE dùng được trong SELECT, UPDATE, DELETE và SET, và trong danh sách SELECT, IN, WHERE, ORDER BY, HAVING — chỗ nào nhận một giá trị là dùng được.</p>
<p>Ví dụ của slide: thưởng ngày Phụ nữ, nữ 500 và nam 0, cho nhân viên 30121050004 (nháy cong trong ‘M' trên slide đã sửa):</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @womanDayBonus DECIMAL
SELECT @womanDayBonus =
    CASE empSex
        WHEN 'F' THEN 500
        WHEN 'M' THEN 0
    END
FROM tblEmployee
WHERE empSSN=30121050004
PRINT @womanDayBonus
-- (thêm) cùng CASE đó trong danh sách SELECT thường, cho mọi nhân viên phòng 1
SELECT empSSN, empName, empSex,
       CASE empSex WHEN 'F' THEN 500 WHEN 'M' THEN 0 END AS womanDayBonus
FROM tblEmployee
WHERE depNum = 1
ORDER BY empSSN;</code></pre>
<div class="out">500</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSex</th><th>womanDayBonus</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>M</td><td>0</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>F</td><td>500</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>M</td><td>0</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>F</td><td>500</td></tr>
</tbody>
</table>
<ul>
<li><code>SELECT @womanDayBonus = CASE empSex WHEN 'F' THEN 500 WHEN 'M' THEN 0 END FROM … WHERE empSSN=…</code> — một dòng, là nữ (Lê Thị Lan Anh) ⇒ 500.</li>
<li>Câu truy vấn thêm vào dùng đúng CASE đó làm <strong>cột tính toán</strong> cho mọi nhân viên phòng 1 — cách dùng CASE hằng ngày trong báo cáo.</li>
</ul>
<p class="meo">🧠 CASE có hai dạng: <em>đơn giản</em> <code>CASE cột WHEN giá_trị …</code> (so bằng =) và <em>tìm kiếm</em> <code>CASE WHEN điều_kiện …</code> (điều kiện gì cũng được, ví dụ <code>WHEN empSalary &gt;= 100000 THEN 'A'</code>). Chỉ dạng tìm kiếm mới kiểm được khoảng giá trị hoặc NULL (<code>WHEN x IS NULL</code>).</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> CASE trong câu truy vấn viết y hệt; trong một khối thì cất giá trị bằng <code>SELECT … INTO</code>:
<pre><code class="language-sql">-- Trong câu truy vấn, CASE viết y hệt trên PostgreSQL
SELECT empSSN, empName, empSex,
       CASE empSex WHEN 'F' THEN 500 WHEN 'M' THEN 0 END AS womanDayBonus
FROM tblEmployee
WHERE depNum = 1
ORDER BY empSSN;
-- Trong một khối, SELECT ... INTO cất nó vào biến
DO $$
DECLARE v_bonus NUMERIC;
BEGIN
    SELECT CASE empSex WHEN 'F' THEN 500 WHEN 'M' THEN 0 END
    INTO   v_bonus
    FROM   tblEmployee WHERE empSSN = 30121050004;
    RAISE NOTICE 'womanDayBonus = %', v_bonus;
END $$;</code></pre>
<div class="out">NOTICE:  womanDayBonus = 500</div>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>empsex</th><th>womandaybonus</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>M</td><td>0</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>F</td><td>500</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>M</td><td>0</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>F</td><td>500</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-2-select-where">PostgreSQL 4.2 — SELECT và WHERE</a>.</div>`],
      [12, 'WHILE Statement',
        `<p class="y-chinh">🎯 WHILE repeats a statement or a BEGIN…END block as long as its condition stays TRUE; BREAK leaves the loop, CONTINUE jumps back to the test.</p>
<p>The slide computes 5! = 5 × 4 × 3 × 2 × 1:</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @factorial INT, @n INT
SET @n=5
SET @factorial=1
WHILE (@n &gt; 1)
    BEGIN
        SET @factorial = @factorial*@n
        SET @n = @n - 1
    END
PRINT @factorial</code></pre>
<div class="out">120</div>
<table>
<thead><tr><th>Round</th><th>@n before</th><th>test @n > 1</th><th>@factorial after</th><th>@n after</th></tr></thead>
<tbody>
<tr><td>1</td><td>5</td><td>TRUE</td><td>1 × 5 = 5</td><td>4</td></tr>
<tr><td>2</td><td>4</td><td>TRUE</td><td>5 × 4 = 20</td><td>3</td></tr>
<tr><td>3</td><td>3</td><td>TRUE</td><td>20 × 3 = 60</td><td>2</td></tr>
<tr><td>4</td><td>2</td><td>TRUE</td><td>60 × 2 = 120</td><td>1</td></tr>
<tr><td>—</td><td>1</td><td>FALSE → leave</td><td>120</td><td>1</td></tr>
</tbody>
</table>
<p>BREAK and CONTINUE from the syntax box, tried out (added):</p>
<pre><code class="language-sql">SET NOCOUNT ON
-- (added) BREAK leaves the loop, CONTINUE jumps back to the condition
DECLARE @i INT = 0
WHILE (@i &lt; 10)
BEGIN
    SET @i = @i + 1
    IF (@i % 2 = 0) CONTINUE      -- skip even numbers
    IF (@i &gt; 7) BREAK             -- stop after 7
    PRINT @i
END
PRINT N'after the loop, @i = ' + CAST(@i AS VARCHAR)</code></pre>
<div class="out">1<br>
3<br>
5<br>
7<br>
after the loop, @i = 9</div>
<div class="pitfall">Forget <code>SET @n = @n - 1</code> and the condition never becomes FALSE: an endless loop, SSMS spins until you press Stop. Before running a WHILE, point at the line that moves it toward the end.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong>: <code>WHILE cond LOOP … END LOOP;</code>, plus a counting loop <code>FOR i IN 2..5 LOOP</code> that T-SQL does not have; <code>EXIT WHEN</code> and <code>CONTINUE WHEN</code> = BREAK and CONTINUE with the IF built in:
<pre><code class="language-sql">DO $$
DECLARE
    v_factorial INT := 1;
    v_n         INT := 5;
BEGIN
    WHILE v_n &gt; 1 LOOP                     -- WHILE ... LOOP ... END LOOP
        v_factorial := v_factorial * v_n;
        v_n := v_n - 1;
    END LOOP;
    RAISE NOTICE 'WHILE: %', v_factorial;

    v_factorial := 1;
    FOR i IN 2..5 LOOP                     -- counting loop, no T-SQL equivalent
        v_factorial := v_factorial * i;
    END LOOP;
    RAISE NOTICE 'FOR:   %', v_factorial;

    FOR i IN 1..10 LOOP                    -- CONTINUE WHEN / EXIT WHEN = CONTINUE / BREAK
        CONTINUE WHEN i % 2 = 0;
        EXIT WHEN i &gt; 7;
        RAISE NOTICE 'i = %', i;
    END LOOP;
END $$;</code></pre>
<div class="out">NOTICE:  WHILE: 120<br>
NOTICE:  FOR:   120<br>
NOTICE:  i = 1<br>
NOTICE:  i = 3<br>
NOTICE:  i = 5<br>
NOTICE:  i = 7</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions and PL/pgSQL</a>.</div>`,
        `<p class="y-chinh">🎯 WHILE lặp lại một câu lệnh hoặc một khối BEGIN…END chừng nào điều kiện còn TRUE; BREAK thoát khỏi vòng lặp, CONTINUE nhảy về chỗ kiểm điều kiện.</p>
<p>Slide tính 5! = 5 × 4 × 3 × 2 × 1:</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @factorial INT, @n INT
SET @n=5
SET @factorial=1
WHILE (@n &gt; 1)
    BEGIN
        SET @factorial = @factorial*@n
        SET @n = @n - 1
    END
PRINT @factorial</code></pre>
<div class="out">120</div>
<table>
<thead><tr><th>Vòng</th><th>@n trước</th><th>kiểm @n > 1</th><th>@factorial sau</th><th>@n sau</th></tr></thead>
<tbody>
<tr><td>1</td><td>5</td><td>TRUE</td><td>1 × 5 = 5</td><td>4</td></tr>
<tr><td>2</td><td>4</td><td>TRUE</td><td>5 × 4 = 20</td><td>3</td></tr>
<tr><td>3</td><td>3</td><td>TRUE</td><td>20 × 3 = 60</td><td>2</td></tr>
<tr><td>4</td><td>2</td><td>TRUE</td><td>60 × 2 = 120</td><td>1</td></tr>
<tr><td>—</td><td>1</td><td>FALSE → thoát</td><td>120</td><td>1</td></tr>
</tbody>
</table>
<p>BREAK và CONTINUE trong khung cú pháp, chạy thử (thêm vào):</p>
<pre><code class="language-sql">SET NOCOUNT ON
-- (thêm) BREAK thoát vòng lặp, CONTINUE nhảy về kiểm điều kiện
DECLARE @i INT = 0
WHILE (@i &lt; 10)
BEGIN
    SET @i = @i + 1
    IF (@i % 2 = 0) CONTINUE      -- bỏ qua số chẵn
    IF (@i &gt; 7) BREAK             -- dừng sau 7
    PRINT @i
END
PRINT N'after the loop, @i = ' + CAST(@i AS VARCHAR)</code></pre>
<div class="out">1<br>
3<br>
5<br>
7<br>
after the loop, @i = 9</div>
<div class="pitfall">Quên <code>SET @n = @n - 1</code> thì điều kiện không bao giờ thành FALSE: vòng lặp vô tận, SSMS quay mãi tới khi bạn bấm Stop. Trước khi chạy một WHILE, hãy chỉ tay vào dòng làm nó tiến dần về điểm dừng.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>: <code>WHILE điều_kiện LOOP … END LOOP;</code>, thêm vòng đếm <code>FOR i IN 2..5 LOOP</code> mà T-SQL không có; <code>EXIT WHEN</code> và <code>CONTINUE WHEN</code> = BREAK và CONTINUE có sẵn IF bên trong:
<pre><code class="language-sql">DO $$
DECLARE
    v_factorial INT := 1;
    v_n         INT := 5;
BEGIN
    WHILE v_n &gt; 1 LOOP                     -- WHILE ... LOOP ... END LOOP
        v_factorial := v_factorial * v_n;
        v_n := v_n - 1;
    END LOOP;
    RAISE NOTICE 'WHILE: %', v_factorial;

    v_factorial := 1;
    FOR i IN 2..5 LOOP                     -- vòng đếm, T-SQL không có
        v_factorial := v_factorial * i;
    END LOOP;
    RAISE NOTICE 'FOR:   %', v_factorial;

    FOR i IN 1..10 LOOP                    -- CONTINUE WHEN / EXIT WHEN = CONTINUE / BREAK
        CONTINUE WHEN i % 2 = 0;
        EXIT WHEN i &gt; 7;
        RAISE NOTICE 'i = %', i;
    END LOOP;
END $$;</code></pre>
<div class="out">NOTICE:  WHILE: 120<br>
NOTICE:  FOR:   120<br>
NOTICE:  i = 1<br>
NOTICE:  i = 3<br>
NOTICE:  i = 5<br>
NOTICE:  i = 7</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm và PL/pgSQL</a>.</div>`],
      [13, 'Handling error using @@ERROR',
        `<p class="y-chinh">🎯 @@ERROR returns 0 if the last statement succeeded, otherwise the error number — the old way to detect an error and undo a transaction.</p>
<p>A <strong>transaction</strong> is a group of statements that must succeed or fail <em>together</em> (like a bank transfer: take from A and give to B). <code>BEGIN TRANSACTION</code> opens it, <code>COMMIT</code> keeps everything, <code>ROLLBACK</code> undoes everything. The slide's code, run exactly:</p>
<pre><code class="language-sql">BEGIN TRANSACTION
    INSERT INTO tblDepartment(depNum,depName)
    VALUES(6, N'Phòng Kế Toán');

    INSERT INTO tblDepartment(depNum,depName)
    VALUES(6, N'Phòng Kế Toán');

    IF @@ERROR&lt;&gt;0
        BEGIN
            ROLLBACK TRANSACTION
            PRINT @@ERROR
        END
COMMIT TRANSACTION
GO
-- (added) is department 6 there?
SELECT depNum, depName FROM tblDepartment WHERE depNum = 6;</code></pre>
<div class="out">(1 row affected)<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'pk_department'. Cannot insert duplicate key in object 'dbo.tblDepartment'. The duplicate key value is (6).</b><br>
The statement has been terminated.<br>
0<br>
<b>Msg 3902, Level 16, State 1<br>
The COMMIT TRANSACTION request has no corresponding BEGIN TRANSACTION.</b></div>
<table>
<thead><tr><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
<ul>
<li>First INSERT: department 6 is added. Second INSERT: Msg 2627, duplicate key — but the batch <strong>goes on</strong> (a statement error does not stop T-SQL).</li>
<li><code>IF @@ERROR&lt;&gt;0</code> is TRUE (2627) ⇒ ROLLBACK undoes the first INSERT too. The final SELECT confirms: no department 6.</li>
<li>Two surprises: <code>PRINT @@ERROR</code> prints <strong>0</strong>, not 2627 — every statement resets @@ERROR, and ROLLBACK succeeded. Then <code>COMMIT</code> fails with Msg 3902: the transaction was already rolled back.</li>
</ul>
<p>The corrected pattern — copy @@ERROR into a variable immediately and COMMIT only in the ELSE branch:</p>
<pre><code class="language-sql">-- (improved) save @@ERROR IMMEDIATELY, because every statement resets it
SET NOCOUNT ON
DECLARE @err INT
BEGIN TRANSACTION
    INSERT INTO tblDepartment(depNum,depName) VALUES(6, N'Phòng Kế Toán');
    INSERT INTO tblDepartment(depNum,depName) VALUES(6, N'Phòng Kế Toán');
    SET @err = @@ERROR
    IF @err &lt;&gt; 0
    BEGIN
        ROLLBACK TRANSACTION
        PRINT N'Error number: ' + CAST(@err AS VARCHAR)
    END
    ELSE
        COMMIT TRANSACTION
GO
SELECT depNum, depName FROM tblDepartment WHERE depNum = 6;</code></pre>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'pk_department'. Cannot insert duplicate key in object 'dbo.tblDepartment'. The duplicate key value is (6).</b><br>
The statement has been terminated.<br>
Error number: 2627</div>
<table>
<thead><tr><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
<div class="pitfall">@@ERROR only describes the statement <em>just before</em> it; checking it after the second INSERT says nothing about the first. That is why TRY…CATCH (next slide) replaced it.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> there is no @@ERROR: an error raises an <em>exception</em> that you catch in the EXCEPTION part of a block (next slide's 🐘 box). Transactions: <code>BEGIN; … COMMIT;</code> / <code>ROLLBACK;</code>. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-1-giao-dich">PostgreSQL 11.1 — transactions</a>.</div>`,
        `<p class="y-chinh">🎯 @@ERROR trả về 0 nếu câu lệnh vừa chạy thành công, ngược lại trả về mã lỗi — cách cũ để phát hiện lỗi và huỷ một giao dịch.</p>
<p><strong>Giao dịch</strong> (transaction) là một nhóm câu lệnh phải cùng thành công hoặc cùng thất bại (như chuyển khoản: trừ tiền A và cộng tiền B). <code>BEGIN TRANSACTION</code> mở nó, <code>COMMIT</code> giữ lại tất cả, <code>ROLLBACK</code> huỷ tất cả. Code của slide, chạy nguyên văn:</p>
<pre><code class="language-sql">BEGIN TRANSACTION
    INSERT INTO tblDepartment(depNum,depName)
    VALUES(6, N'Phòng Kế Toán');

    INSERT INTO tblDepartment(depNum,depName)
    VALUES(6, N'Phòng Kế Toán');

    IF @@ERROR&lt;&gt;0
        BEGIN
            ROLLBACK TRANSACTION
            PRINT @@ERROR
        END
COMMIT TRANSACTION
GO
-- (thêm) phòng 6 có được lưu không?
SELECT depNum, depName FROM tblDepartment WHERE depNum = 6;</code></pre>
<div class="out">(1 row affected)<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'pk_department'. Cannot insert duplicate key in object 'dbo.tblDepartment'. The duplicate key value is (6).</b><br>
The statement has been terminated.<br>
0<br>
<b>Msg 3902, Level 16, State 1<br>
The COMMIT TRANSACTION request has no corresponding BEGIN TRANSACTION.</b></div>
<table>
<thead><tr><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
<ul>
<li>Câu INSERT đầu: phòng 6 được thêm. Câu INSERT thứ hai: Msg 2627, trùng khoá — nhưng lô <strong>vẫn chạy tiếp</strong> (lỗi của một câu lệnh không làm T-SQL dừng lại).</li>
<li><code>IF @@ERROR&lt;&gt;0</code> là TRUE (2627) ⇒ ROLLBACK huỷ luôn câu INSERT đầu. Câu SELECT cuối xác nhận: không có phòng 6.</li>
<li>Hai điều bất ngờ: <code>PRINT @@ERROR</code> in ra <strong>0</strong>, không phải 2627 — câu lệnh nào cũng đặt lại @@ERROR, và ROLLBACK đã thành công. Rồi <code>COMMIT</code> hỏng với Msg 3902: giao dịch đã bị huỷ từ trước.</li>
</ul>
<p>Mẫu đã sửa — chép @@ERROR vào một biến ngay lập tức và chỉ COMMIT trong nhánh ELSE:</p>
<pre><code class="language-sql">-- (sửa) cất @@ERROR NGAY, vì câu lệnh nào cũng đặt lại nó
SET NOCOUNT ON
DECLARE @err INT
BEGIN TRANSACTION
    INSERT INTO tblDepartment(depNum,depName) VALUES(6, N'Phòng Kế Toán');
    INSERT INTO tblDepartment(depNum,depName) VALUES(6, N'Phòng Kế Toán');
    SET @err = @@ERROR
    IF @err &lt;&gt; 0
    BEGIN
        ROLLBACK TRANSACTION
        PRINT N'Error number: ' + CAST(@err AS VARCHAR)
    END
    ELSE
        COMMIT TRANSACTION
GO
SELECT depNum, depName FROM tblDepartment WHERE depNum = 6;</code></pre>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'pk_department'. Cannot insert duplicate key in object 'dbo.tblDepartment'. The duplicate key value is (6).</b><br>
The statement has been terminated.<br>
Error number: 2627</div>
<table>
<thead><tr><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
<div class="pitfall">@@ERROR chỉ nói về câu lệnh <em>ngay trước</em> nó; kiểm nó sau câu INSERT thứ hai thì chẳng biết gì về câu thứ nhất. Vì thế TRY…CATCH (slide sau) đã thay thế nó.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> không có @@ERROR: lỗi sinh ra một <em>ngoại lệ</em> (exception) và bạn bắt nó trong phần EXCEPTION của một khối (ô 🐘 của slide sau). Giao dịch: <code>BEGIN; … COMMIT;</code> / <code>ROLLBACK;</code>. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-1-giao-dich">PostgreSQL 11.1 — giao dịch</a>.</div>`],
      [14, 'Handling error using TRY...CATCH',
        `<p class="y-chinh">🎯 TRY…CATCH (since SQL Server 2005): put the risky statements in BEGIN TRY…END TRY; if one fails, control jumps straight into BEGIN CATCH…END CATCH, where you roll back and report.</p>
<pre><code class="language-sql">BEGIN TRANSACTION   --begin transaction
BEGIN TRY
    --oparations
    INSERT INTO tblDepartment(depNum,depName)
    VALUES(6, N'Phòng Kế Toán');

    INSERT INTO tblDepartment(depNum,depName)
    VALUES(6, N'Phòng Kế Toán');
    COMMIT TRANSACTION  --commit the transaction
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION    --rollback transaction
    PRINT ERROR_NUMBER()
    PRINT ERROR_MESSAGE()
END CATCH
GO
-- (added) nothing was kept: the first INSERT was undone too
SELECT depNum, depName FROM tblDepartment WHERE depNum = 6;</code></pre>
<div class="out">(1 row affected)<br>
2627<br>
Violation of PRIMARY KEY constraint 'pk_department'. Cannot insert duplicate key in object 'dbo.tblDepartment'. The duplicate key value is (6).</div>
<table>
<thead><tr><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
<ul>
<li>The second INSERT fails ⇒ the rest of the TRY (the COMMIT) is <strong>skipped</strong> ⇒ the CATCH runs: ROLLBACK, then <code>ERROR_NUMBER()</code> = 2627 and <code>ERROR_MESSAGE()</code> = the text of the error.</li>
<li>No red Msg line this time: the error was <em>handled</em>, so the client only sees the PRINT lines. Department 6 is gone — the first INSERT was undone with it.</li>
<li>Other functions usable in CATCH: <code>ERROR_LINE()</code>, <code>ERROR_SEVERITY()</code>, <code>ERROR_PROCEDURE()</code>.</li>
</ul>
<p class="meo">🧠 Pattern to learn by heart for the PE: <code>BEGIN TRAN; BEGIN TRY … COMMIT; END TRY BEGIN CATCH ROLLBACK; … END CATCH</code>. The comment <code>--oparations</code> on the slide is a typo for "operations".</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a block <code>BEGIN … EXCEPTION WHEN … THEN … END</code> is TRY…CATCH; <code>SQLSTATE</code> and <code>SQLERRM</code> replace ERROR_NUMBER() and ERROR_MESSAGE(), and you can catch one kind of error by name (<code>unique_violation</code>). No ROLLBACK is written: what the block did is undone automatically:
<pre><code class="language-sql">DO $$
BEGIN
    INSERT INTO tblDepartment(depNum, depName) VALUES (6, 'Phòng Kế Toán');
    INSERT INTO tblDepartment(depNum, depName) VALUES (6, 'Phòng Kế Toán');
EXCEPTION                                   -- the "CATCH" part of a PL/pgSQL block
    WHEN unique_violation THEN              -- catch one kind of error by name
        RAISE NOTICE 'SQLSTATE %: %', SQLSTATE, SQLERRM;
        -- no ROLLBACK needed: everything done inside the block is undone automatically
END $$;
SELECT depNum, depName FROM tblDepartment WHERE depNum = 6;</code></pre>
<div class="out">NOTICE:  SQLSTATE 23505: duplicate key value violates unique constraint "pk_department"</div>
<table>
<thead><tr><th>depnum</th><th>depname</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-1-giao-dich">PostgreSQL 11.1 — transactions</a>.</div>`,
        `<p class="y-chinh">🎯 TRY…CATCH (có từ SQL Server 2005): đặt các câu lệnh có thể lỗi trong BEGIN TRY…END TRY; câu nào hỏng thì điều khiển nhảy thẳng vào BEGIN CATCH…END CATCH, nơi bạn huỷ giao dịch và báo lỗi.</p>
<pre><code class="language-sql">BEGIN TRANSACTION   --begin transaction
BEGIN TRY
    --oparations
    INSERT INTO tblDepartment(depNum,depName)
    VALUES(6, N'Phòng Kế Toán');

    INSERT INTO tblDepartment(depNum,depName)
    VALUES(6, N'Phòng Kế Toán');
    COMMIT TRANSACTION  --commit the transaction
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION    --rollback transaction
    PRINT ERROR_NUMBER()
    PRINT ERROR_MESSAGE()
END CATCH
GO
-- (thêm) không còn gì: cả câu INSERT đầu cũng bị huỷ
SELECT depNum, depName FROM tblDepartment WHERE depNum = 6;</code></pre>
<div class="out">(1 row affected)<br>
2627<br>
Violation of PRIMARY KEY constraint 'pk_department'. Cannot insert duplicate key in object 'dbo.tblDepartment'. The duplicate key value is (6).</div>
<table>
<thead><tr><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
<ul>
<li>Câu INSERT thứ hai hỏng ⇒ phần còn lại của TRY (câu COMMIT) bị <strong>bỏ qua</strong> ⇒ CATCH chạy: ROLLBACK, rồi <code>ERROR_NUMBER()</code> = 2627 và <code>ERROR_MESSAGE()</code> = nội dung lỗi.</li>
<li>Lần này không có dòng Msg đỏ: lỗi đã được <em>xử lý</em>, nên phía client chỉ thấy các dòng PRINT. Phòng 6 không còn — câu INSERT đầu bị huỷ theo.</li>
<li>Các hàm khác dùng được trong CATCH: <code>ERROR_LINE()</code> (dòng lỗi), <code>ERROR_SEVERITY()</code> (mức nghiêm trọng), <code>ERROR_PROCEDURE()</code> (thủ tục gây lỗi).</li>
</ul>
<p class="meo">🧠 Mẫu phải thuộc lòng cho bài PE: <code>BEGIN TRAN; BEGIN TRY … COMMIT; END TRY BEGIN CATCH ROLLBACK; … END CATCH</code>. Chú thích <code>--oparations</code> trên slide là gõ nhầm của "operations" (các thao tác).</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> khối <code>BEGIN … EXCEPTION WHEN … THEN … END</code> chính là TRY…CATCH; <code>SQLSTATE</code> và <code>SQLERRM</code> thay cho ERROR_NUMBER() và ERROR_MESSAGE(), và bắt được đúng một loại lỗi theo tên (<code>unique_violation</code> — trùng khoá). Không phải viết ROLLBACK: những gì khối đã làm tự bị huỷ:
<pre><code class="language-sql">DO $$
BEGIN
    INSERT INTO tblDepartment(depNum, depName) VALUES (6, 'Phòng Kế Toán');
    INSERT INTO tblDepartment(depNum, depName) VALUES (6, 'Phòng Kế Toán');
EXCEPTION                                   -- phần "CATCH" của một khối PL/pgSQL
    WHEN unique_violation THEN              -- bắt đúng một loại lỗi theo tên
        RAISE NOTICE 'SQLSTATE %: %', SQLSTATE, SQLERRM;
        -- không cần ROLLBACK: mọi thứ làm trong khối tự bị huỷ
END $$;
SELECT depNum, depName FROM tblDepartment WHERE depNum = 6;</code></pre>
<div class="out">NOTICE:  SQLSTATE 23505: duplicate key value violates unique constraint "pk_department"</div>
<table>
<thead><tr><th>depnum</th><th>depname</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-1-giao-dich">PostgreSQL 11.1 — giao dịch</a>.</div>`],
      [15, 'Branching Statements - IF in SQL/PSM',
        `<p class="y-chinh">🎯 From here to slide 19 the deck shows the <strong>SQL standard</strong> (SQL/PSM, the textbook's language): IF … THEN … ELSEIF … THEN … ELSE … END IF; — which SQL Server does NOT accept as written.</p>
<p>PSM (Persistent Stored Modules) is the ISO standard for procedures; each DBMS implements its own dialect. The standard IF ends with END IF and chains with the single word ELSEIF. In T-SQL you write ELSE IF and no END IF:</p>
<pre><code class="language-sql">SET NOCOUNT ON
-- PSM writes IF ... ELSEIF ... END IF; T-SQL chains ELSE IF (and has no END IF)
DECLARE @salary DECIMAL(10,0)
SELECT @salary = empSalary FROM tblEmployee WHERE empSSN = 30121050011
IF (@salary &gt;= 100000)
    PRINT N'Level A'
ELSE IF (@salary &gt;= 60000)
    PRINT N'Level B'
ELSE
    PRINT N'Level C'
PRINT N'salary = ' + CAST(@salary AS VARCHAR)</code></pre>
<div class="out">Level B<br>
salary = 72000</div>
<p>Hồ Ngọc Hân earns 72000: not ≥ 100000, but ≥ 60000 ⇒ "Level B". The tests are made top to bottom and the first TRUE wins.</p>
<table>
<thead><tr><th>SQL/PSM (slide)</th><th>T-SQL</th><th>PL/pgSQL (PostgreSQL)</th></tr></thead>
<tbody>
<tr><td>IF c THEN …</td><td>IF (c) statement or BEGIN…END</td><td>IF c THEN …</td></tr>
<tr><td>ELSEIF c THEN …</td><td>ELSE IF (c) …</td><td>ELSIF c THEN … (ELSEIF also accepted)</td></tr>
<tr><td>END IF;</td><td>— (nothing)</td><td>END IF;</td></tr>
</tbody>
</table>
<div class="pitfall">FE questions show PSM code and ask what it prints; PE questions want T-SQL. Do not type <code>END IF</code> in SSMS — it is a syntax error ("Incorrect syntax near …").</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the standard is followed almost word for word — PL/pgSQL is close to PSM:
<pre><code class="language-sql">-- PL/pgSQL is very close to the PSM standard of the slide
DO $$
DECLARE v_salary NUMERIC(10,0);
BEGIN
    SELECT empSalary INTO v_salary FROM tblEmployee WHERE empSSN = 30121050011;
    IF v_salary &gt;= 100000 THEN
        RAISE NOTICE 'Level A';
    ELSIF v_salary &gt;= 60000 THEN        -- ELSIF (ELSEIF is also accepted)
        RAISE NOTICE 'Level B';
    ELSE
        RAISE NOTICE 'Level C';
    END IF;
    RAISE NOTICE 'salary = %', v_salary;
END $$;</code></pre>
<div class="out">NOTICE:  Level B<br>
NOTICE:  salary = 72000</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions and PL/pgSQL</a>.</div>`,
        `<p class="y-chinh">🎯 Từ đây tới slide 19, bộ slide trình bày <strong>chuẩn SQL</strong> (SQL/PSM, ngôn ngữ trong giáo trình): IF … THEN … ELSEIF … THEN … ELSE … END IF; — thứ mà SQL Server KHÔNG nhận nguyên văn.</p>
<p>PSM (Persistent Stored Modules — mô-đun lưu trữ bền) là chuẩn ISO cho thủ tục; mỗi DBMS cài đặt một phương ngữ riêng. IF của chuẩn kết thúc bằng END IF và nối nhánh bằng một từ ELSEIF. Trong T-SQL bạn viết ELSE IF và không có END IF:</p>
<pre><code class="language-sql">SET NOCOUNT ON
-- PSM viết IF ... ELSEIF ... END IF; T-SQL nối ELSE IF (và không có END IF)
DECLARE @salary DECIMAL(10,0)
SELECT @salary = empSalary FROM tblEmployee WHERE empSSN = 30121050011
IF (@salary &gt;= 100000)
    PRINT N'Level A'
ELSE IF (@salary &gt;= 60000)
    PRINT N'Level B'
ELSE
    PRINT N'Level C'
PRINT N'salary = ' + CAST(@salary AS VARCHAR)</code></pre>
<div class="out">Level B<br>
salary = 72000</div>
<p>Hồ Ngọc Hân lương 72000: không ≥ 100000, nhưng ≥ 60000 ⇒ "Level B". Các điều kiện được xét từ trên xuống và điều kiện TRUE đầu tiên thắng.</p>
<table>
<thead><tr><th>SQL/PSM (slide)</th><th>T-SQL</th><th>PL/pgSQL (PostgreSQL)</th></tr></thead>
<tbody>
<tr><td>IF c THEN …</td><td>IF (c) một câu hoặc BEGIN…END</td><td>IF c THEN …</td></tr>
<tr><td>ELSEIF c THEN …</td><td>ELSE IF (c) …</td><td>ELSIF c THEN … (viết ELSEIF cũng được)</td></tr>
<tr><td>END IF;</td><td>— (không có gì)</td><td>END IF;</td></tr>
</tbody>
</table>
<div class="pitfall">Câu hỏi FE hay đưa code PSM và hỏi nó in gì; câu PE thì đòi T-SQL. Đừng gõ <code>END IF</code> trong SSMS — đó là lỗi cú pháp ("Incorrect syntax near …").</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> chuẩn được theo gần như từng chữ — PL/pgSQL rất gần PSM:
<pre><code class="language-sql">-- PL/pgSQL rất gần chuẩn PSM trên slide
DO $$
DECLARE v_salary NUMERIC(10,0);
BEGIN
    SELECT empSalary INTO v_salary FROM tblEmployee WHERE empSSN = 30121050011;
    IF v_salary &gt;= 100000 THEN
        RAISE NOTICE 'Level A';
    ELSIF v_salary &gt;= 60000 THEN        -- ELSIF (viết ELSEIF cũng được)
        RAISE NOTICE 'Level B';
    ELSE
        RAISE NOTICE 'Level C';
    END IF;
    RAISE NOTICE 'salary = %', v_salary;
END $$;</code></pre>
<div class="out">NOTICE:  Level B<br>
NOTICE:  salary = 72000</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm và PL/pgSQL</a>.</div>`],
      [16, 'Queries in T-SQL programming',
        `<p class="y-chinh">🎯 Four ways a SELECT-FROM-WHERE query is used inside a program: as a subquery in a condition, as the right side of an assignment (one value), as a single-row SELECT that fills variables, and through a cursor.</p>
<p>The first three, on department 5 (the fourth — cursors — is slides 48–51):</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @depNum INT = 5, @cnt INT, @avg DECIMAL(10,0)
-- 1. A subquery inside a condition
IF EXISTS (SELECT * FROM tblProject WHERE depNum = @depNum)
    PRINT N'Department 5 controls at least one project'
ELSE
    PRINT N'Department 5 controls no project'
-- 2. A query that returns ONE value on the right side of an assignment
SET @cnt = (SELECT COUNT(*) FROM tblEmployee WHERE depNum = @depNum)
PRINT N'Employees in department 5: ' + CAST(@cnt AS VARCHAR)
-- 3. A single-row SELECT that fills variables
SELECT @avg = AVG(empSalary) FROM tblEmployee WHERE depNum = @depNum
PRINT N'Average salary: ' + CAST(@avg AS VARCHAR)
-- 4. Cursors: slides 48-51</code></pre>
<div class="out">Department 5 controls no project<br>
Employees in department 5: 2<br>
Average salary: 51500</div>
<ul>
<li>1. <code>IF EXISTS (SELECT …)</code> — the subquery is only asked "is there at least one row?". Department 5 (Research) controls no project.</li>
<li>2. <code>SET @cnt = (SELECT COUNT(*) …)</code> — legal because COUNT(*) returns exactly one value.</li>
<li>3. <code>SELECT @avg = AVG(empSalary) …</code> — a single-row SELECT that fills a variable: (65000 + 38000) / 2 = 51500.</li>
</ul>
<p class="meo">🧠 Rule: a query may stand where a <em>value</em> is expected only if it returns one row and one column (otherwise Msg 512, slide 6). EXISTS accepts any number of rows.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the same four uses exist: <code>IF EXISTS (…) THEN</code>, <code>v := (SELECT …)</code>, <code>SELECT … INTO v</code>, and <code>FOR r IN SELECT …</code> for the cursor:
<pre><code class="language-sql">DO $$
DECLARE v_dep_num INT := 5; v_cnt INT; v_avg NUMERIC(10,0);
BEGIN
    IF EXISTS (SELECT 1 FROM tblProject WHERE depNum = v_dep_num) THEN
        RAISE NOTICE 'Department 5 controls at least one project';
    ELSE
        RAISE NOTICE 'Department 5 controls no project';
    END IF;
    v_cnt := (SELECT COUNT(*) FROM tblEmployee WHERE depNum = v_dep_num);
    SELECT AVG(empSalary) INTO v_avg FROM tblEmployee WHERE depNum = v_dep_num;
    RAISE NOTICE 'Employees: %, average salary: %', v_cnt, v_avg;
END $$;</code></pre>
<div class="out">NOTICE:  Department 5 controls no project<br>
NOTICE:  Employees: 2, average salary: 51500</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-7-1-subquery">PostgreSQL 7.1 — subqueries</a>.</div>`,
        `<p class="y-chinh">🎯 Bốn cách dùng một câu truy vấn SELECT-FROM-WHERE trong chương trình: làm truy vấn con trong điều kiện, làm vế phải của phép gán (một giá trị), làm câu SELECT một dòng gán vào biến, và qua cursor.</p>
<p>Ba cách đầu, trên phòng 5 (cách thứ tư — cursor — là slide 48–51):</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @depNum INT = 5, @cnt INT, @avg DECIMAL(10,0)
-- 1. Truy vấn con nằm trong điều kiện
IF EXISTS (SELECT * FROM tblProject WHERE depNum = @depNum)
    PRINT N'Department 5 controls at least one project'
ELSE
    PRINT N'Department 5 controls no project'
-- 2. Truy vấn trả về MỘT giá trị ở vế phải của phép gán
SET @cnt = (SELECT COUNT(*) FROM tblEmployee WHERE depNum = @depNum)
PRINT N'Employees in department 5: ' + CAST(@cnt AS VARCHAR)
-- 3. SELECT một dòng gán vào biến
SELECT @avg = AVG(empSalary) FROM tblEmployee WHERE depNum = @depNum
PRINT N'Average salary: ' + CAST(@avg AS VARCHAR)
-- 4. Cursor: slide 48-51</code></pre>
<div class="out">Department 5 controls no project<br>
Employees in department 5: 2<br>
Average salary: 51500</div>
<ul>
<li>1. <code>IF EXISTS (SELECT …)</code> — truy vấn con chỉ bị hỏi "có ít nhất một dòng không?". Phòng 5 (Nghiên cứu) không quản lý dự án nào.</li>
<li>2. <code>SET @cnt = (SELECT COUNT(*) …)</code> — hợp lệ vì COUNT(*) luôn trả đúng một giá trị.</li>
<li>3. <code>SELECT @avg = AVG(empSalary) …</code> — câu SELECT một dòng gán vào biến: (65000 + 38000) / 2 = 51500.</li>
</ul>
<p class="meo">🧠 Luật: một truy vấn chỉ được đứng ở chỗ cần một <em>giá trị</em> nếu nó trả đúng một dòng một cột (nếu không: Msg 512, slide 6). EXISTS thì nhận bao nhiêu dòng cũng được.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> có đủ bốn cách: <code>IF EXISTS (…) THEN</code>, <code>v := (SELECT …)</code>, <code>SELECT … INTO v</code>, và <code>FOR r IN SELECT …</code> cho cursor:
<pre><code class="language-sql">DO $$
DECLARE v_dep_num INT := 5; v_cnt INT; v_avg NUMERIC(10,0);
BEGIN
    IF EXISTS (SELECT 1 FROM tblProject WHERE depNum = v_dep_num) THEN
        RAISE NOTICE 'Department 5 controls at least one project';
    ELSE
        RAISE NOTICE 'Department 5 controls no project';
    END IF;
    v_cnt := (SELECT COUNT(*) FROM tblEmployee WHERE depNum = v_dep_num);
    SELECT AVG(empSalary) INTO v_avg FROM tblEmployee WHERE depNum = v_dep_num;
    RAISE NOTICE 'Employees: %, average salary: %', v_cnt, v_avg;
END $$;</code></pre>
<div class="out">NOTICE:  Department 5 controls no project<br>
NOTICE:  Employees: 2, average salary: 51500</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-7-1-subquery">PostgreSQL 7.1 — truy vấn con</a>.</div>`],
      [17, 'Loops in SQL/PSM - LOOP and LEAVE',
        `<p class="y-chinh">🎯 The basic PSM loop is LOOP … END LOOP, which repeats forever until a LEAVE statement names the loop's label and jumps out.</p>
<p><code>loop1: LOOP … LEAVE loop1; … END LOOP;</code> — the label <code>loop1:</code> gives the loop a name so that LEAVE knows which loop to exit (useful with nested loops). T-SQL has no LOOP and no labels for loops; you write an endless <code>WHILE 1 = 1</code> and leave with BREAK:</p>
<pre><code class="language-sql">SET NOCOUNT ON
-- PSM "loop1: LOOP ... LEAVE loop1; ... END LOOP" = T-SQL "WHILE 1=1 ... BREAK"
DECLARE @n INT = 1
WHILE 1 = 1                      -- an endless loop ...
BEGIN
    PRINT N'n = ' + CAST(@n AS VARCHAR)
    SET @n = @n * 2
    IF (@n &gt; 20) BREAK           -- ... left from the inside, like LEAVE
END
PRINT N'left the loop with n = ' + CAST(@n AS VARCHAR)</code></pre>
<div class="out">n = 1<br>
n = 2<br>
n = 4<br>
n = 8<br>
n = 16<br>
left the loop with n = 32</div>
<p>n doubles each round: 1, 2, 4, 8, 16; when it becomes 32 (> 20) BREAK leaves, and the PRINT after the loop runs.</p>
<p class="meo">🧠 "LOOP + LEAVE" = "while(true) + break" in Java. The exit test can be anywhere in the body — at the top, in the middle, at the bottom.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> it is the standard again: a label <code>&lt;&lt;loop1&gt;&gt;</code>, <code>LOOP … END LOOP</code>, and <code>EXIT loop1 WHEN …</code> for LEAVE:
<pre><code class="language-sql">DO $$
DECLARE v_n INT := 1;
BEGIN
    &lt;&lt;loop1&gt;&gt;                    -- a label, like "loop1:" in PSM
    LOOP
        RAISE NOTICE 'n = %', v_n;
        v_n := v_n * 2;
        EXIT loop1 WHEN v_n &gt; 20; -- EXIT = LEAVE
    END LOOP;
    RAISE NOTICE 'left the loop with n = %', v_n;
END $$;</code></pre>
<div class="out">NOTICE:  n = 1<br>
NOTICE:  n = 2<br>
NOTICE:  n = 4<br>
NOTICE:  n = 8<br>
NOTICE:  n = 16<br>
NOTICE:  left the loop with n = 32</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions and PL/pgSQL</a>.</div>`,
        `<p class="y-chinh">🎯 Vòng lặp cơ bản của PSM là LOOP … END LOOP, lặp mãi cho tới khi một câu LEAVE gọi đúng nhãn của vòng và nhảy ra ngoài.</p>
<p><code>loop1: LOOP … LEAVE loop1; … END LOOP;</code> — nhãn (label) <code>loop1:</code> đặt tên cho vòng lặp để LEAVE biết thoát vòng nào (có ích khi lồng nhiều vòng). T-SQL không có LOOP và không có nhãn cho vòng lặp; bạn viết một vòng vô tận <code>WHILE 1 = 1</code> rồi thoát bằng BREAK:</p>
<pre><code class="language-sql">SET NOCOUNT ON
-- PSM "loop1: LOOP ... LEAVE loop1; ... END LOOP" = T-SQL "WHILE 1=1 ... BREAK"
DECLARE @n INT = 1
WHILE 1 = 1                      -- một vòng lặp vô tận ...
BEGIN
    PRINT N'n = ' + CAST(@n AS VARCHAR)
    SET @n = @n * 2
    IF (@n &gt; 20) BREAK           -- ... được thoát từ bên trong, như LEAVE
END
PRINT N'left the loop with n = ' + CAST(@n AS VARCHAR)</code></pre>
<div class="out">n = 1<br>
n = 2<br>
n = 4<br>
n = 8<br>
n = 16<br>
left the loop with n = 32</div>
<p>n nhân đôi mỗi vòng: 1, 2, 4, 8, 16; khi thành 32 (> 20) thì BREAK thoát ra, và câu PRINT sau vòng lặp chạy.</p>
<p class="meo">🧠 "LOOP + LEAVE" = "while(true) + break" trong Java. Chỗ kiểm điều kiện thoát nằm đâu trong thân vòng cũng được — đầu, giữa, cuối.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> lại đúng chuẩn: nhãn <code>&lt;&lt;loop1&gt;&gt;</code>, <code>LOOP … END LOOP</code>, và <code>EXIT loop1 WHEN …</code> thay cho LEAVE:
<pre><code class="language-sql">DO $$
DECLARE v_n INT := 1;
BEGIN
    &lt;&lt;loop1&gt;&gt;                    -- một nhãn, như "loop1:" trong PSM
    LOOP
        RAISE NOTICE 'n = %', v_n;
        v_n := v_n * 2;
        EXIT loop1 WHEN v_n &gt; 20; -- EXIT = LEAVE
    END LOOP;
    RAISE NOTICE 'left the loop with n = %', v_n;
END $$;</code></pre>
<div class="out">NOTICE:  n = 1<br>
NOTICE:  n = 2<br>
NOTICE:  n = 4<br>
NOTICE:  n = 8<br>
NOTICE:  n = 16<br>
NOTICE:  left the loop with n = 32</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm và PL/pgSQL</a>.</div>`],
      [18, 'Other Loop Constructs - WHILE and REPEAT',
        `<p class="y-chinh">🎯 PSM has two more loops: WHILE c DO … END WHILE (test first, may run 0 times) and REPEAT … UNTIL c END REPEAT (body first, runs at least once, stops when c becomes TRUE).</p>
<p>T-SQL only has WHILE; a REPEAT is imitated with an endless WHILE and a BREAK at the end of the body. Starting from n = 100 shows the difference:</p>
<pre><code class="language-sql">SET NOCOUNT ON
-- T-SQL has only WHILE. PSM "REPEAT ... UNTIL c" runs the body at least once:
DECLARE @n INT = 100
WHILE (@n &lt; 5)                   -- WHILE: the test comes first, body runs 0 times
BEGIN
    PRINT N'WHILE body, n = ' + CAST(@n AS VARCHAR)
    SET @n = @n + 1
END
SET @n = 100
WHILE 1 = 1                      -- REPEAT imitated: body first, test at the end
BEGIN
    PRINT N'REPEAT body, n = ' + CAST(@n AS VARCHAR)
    SET @n = @n + 1
    IF (@n &gt;= 5) BREAK           -- UNTIL n &gt;= 5
END</code></pre>
<div class="out">REPEAT body, n = 100</div>
<table>
<thead><tr><th>Loop</th><th>When is the condition tested?</th><th>Minimum rounds</th><th>Stops when</th></tr></thead>
<tbody>
<tr><td>WHILE c DO … END WHILE</td><td>before each round</td><td>0</td><td>c is FALSE</td></tr>
<tr><td>REPEAT … UNTIL c END REPEAT</td><td>after each round</td><td>1</td><td>c is TRUE</td></tr>
</tbody>
</table>
<div class="pitfall">WHILE runs <em>while</em> the condition is TRUE; REPEAT runs <em>until</em> it becomes TRUE — opposite meanings. An FE question with REPEAT … UNTIL n > 5 starting from n = 10 prints once, not zero times.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> <code>WHILE c LOOP … END LOOP</code> is the WHILE; REPEAT is written <code>LOOP … EXIT WHEN c; END LOOP</code> (exit test at the bottom):
<pre><code class="language-sql">DO $$
DECLARE v_n INT := 100;
BEGIN
    WHILE v_n &lt; 5 LOOP           -- PSM "WHILE c DO ... END WHILE"
        RAISE NOTICE 'WHILE body, n = %', v_n;
        v_n := v_n + 1;
    END LOOP;
    v_n := 100;
    LOOP                         -- PSM "REPEAT ... UNTIL c END REPEAT"
        RAISE NOTICE 'REPEAT body, n = %', v_n;
        v_n := v_n + 1;
        EXIT WHEN v_n &gt;= 5;
    END LOOP;
END $$;</code></pre>
<div class="out">NOTICE:  REPEAT body, n = 100</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions and PL/pgSQL</a>.</div>`,
        `<p class="y-chinh">🎯 PSM còn hai vòng lặp: WHILE c DO … END WHILE (kiểm trước, có thể chạy 0 lần) và REPEAT … UNTIL c END REPEAT (chạy thân trước, ít nhất một lần, dừng khi c thành TRUE).</p>
<p>T-SQL chỉ có WHILE; REPEAT được giả lập bằng một WHILE vô tận có BREAK ở cuối thân. Bắt đầu từ n = 100 sẽ thấy khác biệt:</p>
<pre><code class="language-sql">SET NOCOUNT ON
-- T-SQL chỉ có WHILE. PSM "REPEAT ... UNTIL c" chạy thân vòng ít nhất một lần:
DECLARE @n INT = 100
WHILE (@n &lt; 5)                   -- WHILE: kiểm trước, thân chạy 0 lần
BEGIN
    PRINT N'WHILE body, n = ' + CAST(@n AS VARCHAR)
    SET @n = @n + 1
END
SET @n = 100
WHILE 1 = 1                      -- giả lập REPEAT: chạy thân trước, kiểm ở cuối
BEGIN
    PRINT N'REPEAT body, n = ' + CAST(@n AS VARCHAR)
    SET @n = @n + 1
    IF (@n &gt;= 5) BREAK           -- UNTIL n &gt;= 5
END</code></pre>
<div class="out">REPEAT body, n = 100</div>
<table>
<thead><tr><th>Vòng lặp</th><th>Điều kiện được kiểm lúc nào?</th><th>Số vòng tối thiểu</th><th>Dừng khi</th></tr></thead>
<tbody>
<tr><td>WHILE c DO … END WHILE</td><td>trước mỗi vòng</td><td>0</td><td>c là FALSE</td></tr>
<tr><td>REPEAT … UNTIL c END REPEAT</td><td>sau mỗi vòng</td><td>1</td><td>c là TRUE</td></tr>
</tbody>
</table>
<div class="pitfall">WHILE chạy <em>trong khi</em> điều kiện còn TRUE; REPEAT chạy <em>cho tới khi</em> điều kiện thành TRUE — hai nghĩa ngược nhau. Câu FE có REPEAT … UNTIL n > 5 bắt đầu từ n = 10 thì in một lần, không phải không lần nào.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> <code>WHILE c LOOP … END LOOP</code> là vòng WHILE; REPEAT viết thành <code>LOOP … EXIT WHEN c; END LOOP</code> (kiểm thoát ở cuối):
<pre><code class="language-sql">DO $$
DECLARE v_n INT := 100;
BEGIN
    WHILE v_n &lt; 5 LOOP           -- PSM "WHILE c DO ... END WHILE"
        RAISE NOTICE 'WHILE body, n = %', v_n;
        v_n := v_n + 1;
    END LOOP;
    v_n := 100;
    LOOP                         -- PSM "REPEAT ... UNTIL c END REPEAT"
        RAISE NOTICE 'REPEAT body, n = %', v_n;
        v_n := v_n + 1;
        EXIT WHEN v_n &gt;= 5;
    END LOOP;
END $$;</code></pre>
<div class="out">NOTICE:  REPEAT body, n = 100</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm và PL/pgSQL</a>.</div>`],
      [19, 'Exceptions - handler declaration',
        `<p class="y-chinh">🎯 In PSM an error is handled by a handler declared in advance: DECLARE &lt;where to go next&gt; HANDLER FOR &lt;condition list&gt; &lt;statement list&gt;; where to go next is CONTINUE, EXIT or UNDO.</p>
<table>
<thead><tr><th>Choice</th><th>After the handler's statements…</th></tr></thead>
<tbody>
<tr><td>CONTINUE</td><td>go on with the statement after the one that failed</td></tr>
<tr><td>EXIT</td><td>leave the BEGIN…END block that declared the handler</td></tr>
<tr><td>UNDO</td><td>like EXIT, and also undo everything the block changed</td></tr>
</tbody>
</table>
<p>SQL Server has no DECLARE … HANDLER; TRY…CATCH plays both roles — a small TRY around one statement behaves like CONTINUE, a TRY around a transaction with ROLLBACK in the CATCH behaves like UNDO:</p>
<pre><code class="language-sql">SET NOCOUNT ON
-- T-SQL has no DECLARE ... HANDLER: TRY ... CATCH plays that role
BEGIN TRY                                  -- "CONTINUE": handle, then go on
    INSERT INTO tblDepartment(depNum, depName) VALUES (1, N'Trùng số 1');
END TRY
BEGIN CATCH
    PRINT N'handled: ' + ERROR_MESSAGE()
END CATCH
PRINT N'still running after the first TRY'
BEGIN TRANSACTION                          -- "EXIT" + "UNDO": leave the block and roll back
BEGIN TRY
    INSERT INTO tblDepartment(depNum, depName) VALUES (6, N'Phòng Kế Toán');
    INSERT INTO tblDepartment(depNum, depName) VALUES (6, N'Phòng Kế Toán');
    PRINT N'never printed'
    COMMIT TRANSACTION
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION
    PRINT N'outer handler: error ' + CAST(ERROR_NUMBER() AS VARCHAR) + N' (department 6 is undone)'
END CATCH
SELECT depNum, depName FROM tblDepartment WHERE depNum &gt;= 6;</code></pre>
<div class="out">handled: Violation of PRIMARY KEY constraint 'pk_department'. Cannot insert duplicate key in object 'dbo.tblDepartment'. The duplicate key value is (1).<br>
still running after the first TRY<br>
outer handler: error 2627 (department 6 is undone)</div>
<table>
<thead><tr><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
<p>First TRY: the duplicate department 1 is reported and the script goes on ("still running"). Second TRY: the duplicate 6 jumps to the CATCH, "never printed" is skipped, ROLLBACK undoes the first 6 — the final SELECT is empty.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the EXCEPTION part of a block is an UNDO-style handler: when it catches an error, everything the block did is rolled back automatically; a small inner block gives CONTINUE-style behaviour:
<pre><code class="language-sql">-- PSM "DECLARE EXIT HANDLER FOR SQLSTATE '23000' ..." ~ PL/pgSQL EXCEPTION WHEN ...
DO $$
BEGIN
    -- CONTINUE-like: an inner block handles the error, then the outer block goes on
    BEGIN
        INSERT INTO tblDepartment(depNum, depName) VALUES (1, 'Trùng số 1');
    EXCEPTION WHEN unique_violation THEN
        RAISE NOTICE 'handled: %', SQLERRM;
    END;
    RAISE NOTICE 'still running after the inner block';
    -- EXIT/UNDO-like: an error handled at the end of the outer block ends it and undoes its work
    INSERT INTO tblDepartment(depNum, depName) VALUES (6, 'Phòng Kế Toán');
    INSERT INTO tblDepartment(depNum, depName) VALUES (6, 'Phòng Kế Toán');
    RAISE NOTICE 'never printed';
EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'outer handler: % (department 6 is undone)', SQLSTATE;
END $$;
SELECT depNum, depName FROM tblDepartment WHERE depNum &gt;= 6;</code></pre>
<div class="out">NOTICE:  handled: duplicate key value violates unique constraint "pk_department"<br>
NOTICE:  still running after the inner block<br>
NOTICE:  outer handler: 23505 (department 6 is undone)</div>
<table>
<thead><tr><th>depnum</th><th>depname</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-1-giao-dich">PostgreSQL 11.1 — transactions</a>.</div>`,
        `<p class="y-chinh">🎯 Trong PSM, lỗi được xử lý bởi một handler (bộ xử lý) khai báo trước: DECLARE &lt;đi đâu tiếp&gt; HANDLER FOR &lt;danh sách điều kiện&gt; &lt;danh sách câu lệnh&gt;; "đi đâu tiếp" là CONTINUE, EXIT hoặc UNDO.</p>
<table>
<thead><tr><th>Lựa chọn</th><th>Sau khi chạy các câu lệnh của handler…</th></tr></thead>
<tbody>
<tr><td>CONTINUE</td><td>chạy tiếp câu lệnh đứng sau câu bị lỗi</td></tr>
<tr><td>EXIT</td><td>rời khỏi khối BEGIN…END đã khai báo handler</td></tr>
<tr><td>UNDO</td><td>như EXIT, và huỷ luôn mọi thay đổi khối đó đã làm</td></tr>
</tbody>
</table>
<p>SQL Server không có DECLARE … HANDLER; TRY…CATCH đóng cả hai vai — một TRY nhỏ quanh một câu lệnh cư xử như CONTINUE, một TRY quanh cả giao dịch có ROLLBACK trong CATCH cư xử như UNDO:</p>
<pre><code class="language-sql">SET NOCOUNT ON
-- T-SQL không có DECLARE ... HANDLER: TRY ... CATCH đóng vai đó
BEGIN TRY                                  -- "CONTINUE": xử lý rồi chạy tiếp
    INSERT INTO tblDepartment(depNum, depName) VALUES (1, N'Trùng số 1');
END TRY
BEGIN CATCH
    PRINT N'handled: ' + ERROR_MESSAGE()
END CATCH
PRINT N'still running after the first TRY'
BEGIN TRANSACTION                          -- "EXIT" + "UNDO": rời khối và huỷ việc đã làm
BEGIN TRY
    INSERT INTO tblDepartment(depNum, depName) VALUES (6, N'Phòng Kế Toán');
    INSERT INTO tblDepartment(depNum, depName) VALUES (6, N'Phòng Kế Toán');
    PRINT N'never printed'
    COMMIT TRANSACTION
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION
    PRINT N'outer handler: error ' + CAST(ERROR_NUMBER() AS VARCHAR) + N' (department 6 is undone)'
END CATCH
SELECT depNum, depName FROM tblDepartment WHERE depNum &gt;= 6;</code></pre>
<div class="out">handled: Violation of PRIMARY KEY constraint 'pk_department'. Cannot insert duplicate key in object 'dbo.tblDepartment'. The duplicate key value is (1).<br>
still running after the first TRY<br>
outer handler: error 2627 (department 6 is undone)</div>
<table>
<thead><tr><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
<p>TRY thứ nhất: phòng 1 bị trùng được báo và script chạy tiếp ("still running"). TRY thứ hai: phòng 6 trùng nhảy vào CATCH, câu "never printed" bị bỏ qua, ROLLBACK huỷ luôn phòng 6 đầu tiên — câu SELECT cuối rỗng.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> phần EXCEPTION của một khối là handler kiểu UNDO: khi nó bắt được lỗi, mọi thứ khối đã làm tự động bị huỷ; một khối con nhỏ bên trong cho cách cư xử kiểu CONTINUE:
<pre><code class="language-sql">-- PSM "DECLARE EXIT HANDLER FOR SQLSTATE '23000' ..." ~ PL/pgSQL EXCEPTION WHEN ...
DO $$
BEGIN
    -- Kiểu CONTINUE: khối trong xử lý lỗi, rồi khối ngoài chạy tiếp
    BEGIN
        INSERT INTO tblDepartment(depNum, depName) VALUES (1, 'Trùng số 1');
    EXCEPTION WHEN unique_violation THEN
        RAISE NOTICE 'handled: %', SQLERRM;
    END;
    RAISE NOTICE 'still running after the inner block';
    -- Kiểu EXIT/UNDO: lỗi được xử lý ở cuối khối ngoài thì kết thúc khối và huỷ việc đã làm
    INSERT INTO tblDepartment(depNum, depName) VALUES (6, 'Phòng Kế Toán');
    INSERT INTO tblDepartment(depNum, depName) VALUES (6, 'Phòng Kế Toán');
    RAISE NOTICE 'never printed';
EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'outer handler: % (department 6 is undone)', SQLSTATE;
END $$;
SELECT depNum, depName FROM tblDepartment WHERE depNum &gt;= 6;</code></pre>
<div class="out">NOTICE:  handled: duplicate key value violates unique constraint "pk_department"<br>
NOTICE:  still running after the inner block<br>
NOTICE:  outer handler: 23505 (department 6 is undone)</div>
<table>
<thead><tr><th>depnum</th><th>depname</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-1-giao-dich">PostgreSQL 11.1 — giao dịch</a>.</div>`],
    ]),
    bi(`<h3>Check yourself before lesson 7.B</h3>
<ol>
<li>What does <code>DECLARE @x INT; PRINT @x + 1</code> print? <em>(an empty line: @x is NULL, NULL + 1 is NULL)</em></li>
<li>Why is <code>PRINT N'Total: ' + @total</code> an error when @total is a DECIMAL? <em>(text + number ⇒ SQL Server converts the text to a number; CAST @total first)</em></li>
<li>In slide 13, why does <code>PRINT @@ERROR</code> print 0? <em>(ROLLBACK succeeded and reset @@ERROR)</em></li>
<li>Rewrite <code>REPEAT SET n = n + 1; UNTIL n &gt; 3 END REPEAT;</code> in T-SQL. <em>(WHILE 1 = 1 BEGIN SET @n = @n + 1; IF @n > 3 BREAK END)</em></li>
</ol>
<p>Older lesson on the same topic: <strong>7.1 — Views, stored procedures, functions &amp; triggers</strong> (an overview of the whole chapter).</p>`,
    `<h3>Tự kiểm tra trước bài 7.B</h3>
<ol>
<li><code>DECLARE @x INT; PRINT @x + 1</code> in ra gì? <em>(một dòng trống: @x là NULL, NULL + 1 là NULL)</em></li>
<li>Vì sao <code>PRINT N'Total: ' + @total</code> lỗi khi @total là DECIMAL? <em>(chữ + số ⇒ SQL Server đổi chữ thành số; phải CAST @total trước)</em></li>
<li>Ở slide 13, vì sao <code>PRINT @@ERROR</code> in ra 0? <em>(ROLLBACK đã thành công và đặt lại @@ERROR)</em></li>
<li>Viết lại <code>REPEAT SET n = n + 1; UNTIL n &gt; 3 END REPEAT;</code> bằng T-SQL. <em>(WHILE 1 = 1 BEGIN SET @n = @n + 1; IF @n > 3 BREAK END)</em></li>
</ol>
<p>Bài cũ cùng chủ đề: <strong>7.1 — View, stored procedure, function &amp; trigger</strong> (tổng quan cả chương).</p>`),
    books([
      ['ullman', 'Ullman &amp; Widom, A First Course in Database Systems — 9.4 Stored Procedures (SQL/PSM: variables, IF, loops, handlers, queries in PSM)', 'Ullman &amp; Widom, A First Course in Database Systems — 9.4 Stored Procedures (SQL/PSM: biến, IF, vòng lặp, handler, truy vấn trong PSM)'],
      ['chopra', 'Chopra, DBMS: A Practical Approach — chapter on PL/SQL and T-SQL programming', 'Chopra, DBMS: A Practical Approach — chương lập trình PL/SQL và T-SQL'],
    ]),
  ].join('\n'),
};

/* ───────── 7.B — 📑 Slide by slide · Three tiers, stored procedures & functions (Chapter 8, 20–34) ───────── */
const L_dbi9_2 = {
  title: '7.B — 📑 Slide by slide · Three tiers, stored procedures & functions (Chapter 8, 20–34)|||7.B — 📑 Học theo từng slide · Kiến trúc 3 tầng, stored procedure & function (Chapter 8, 20–34)',
  slug: 'dbi202-slide-dbi9-2',
  type: 'VIDEO',
  description: 'Giảng từng slide 20–34 của bộ slide Chapter 8 của trường (trên web là Chương 7): kiến trúc ba tầng web – ứng dụng – CSDL, năm lợi ích của stored procedure (có thử quyền EXECUTE thật), SQL/PSM, cú pháp CREATE PROCEDURE với tham số mặc định và OUTPUT, ví dụ 1 trên FUHCompany (liệt kê dự án, đổi tên dự án, hàm trả tên dự án), hàm hệ thống và ba loại hàm người dùng (scalar, inline table-valued, multi-statement) — chạy thật trên SQL Server, kèm ô 🐘 CREATE PROCEDURE/CALL, INOUT, RETURNS TABLE, LANGUAGE plpgsql chạy thật trên PostgreSQL.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.B · school slides "Chapter 8", slides 20–34</span>
<h2>Stored procedures and functions — the deck, slide by slide</h2>
<p class="lead">⚠️ Still the school's <strong>"Chapter 8"</strong> deck (web Chapter 7). Lesson 7.A gave you the grammar — variables, IF, WHILE, TRY…CATCH. Now that grammar is <strong>packed into named objects saved in the database</strong>.</p>
<div class="callout"><strong>Procedure or function — the everyday picture.</strong> A <strong>stored procedure</strong> is a recipe card kept in the restaurant's kitchen: the waiter only says "psm_Change_Name_Of_Project, 2, 'Dự án Bản đồ số'" and the kitchen does every step — it may change data, return several results, report back through OUTPUT parameters. A <strong>function</strong> is a calculator key: you give it values, it gives back <em>one</em> value (or one table), you can use it inside a SELECT, and it is not allowed to change any table.</div>
<h3>This part in one table</h3>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>You must be able to</th></tr></thead>
<tbody>
<tr><td>20–24</td><td>three-tier architecture: web server, application server, database server</td><td>say which tier runs the business logic and which runs the queries</td></tr>
<tr><td>25–26</td><td>why stored procedures; SQL/PSM</td><td>list the 5 advantages; name the dialect of each DBMS</td></tr>
<tr><td>27–30</td><td>CREATE PROCEDURE, parameters, OUTPUT, EXEC; example 1</td><td>write and call a procedure with an OUTPUT parameter</td></tr>
<tr><td>31–34</td><td>system functions; scalar, inline table-valued, multi-statement table-valued functions</td><td>choose the right kind, write it, call it with dbo.</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Bài 7.B · slide "Chapter 8" của trường, slide 20–34</span>
<h2>Stored procedure và function — học bộ slide từng trang</h2>
<p class="lead">⚠️ Vẫn là bộ slide <strong>"Chapter 8"</strong> của trường (Chương 7 trên web). Bài 7.A cho bạn ngữ pháp — biến, IF, WHILE, TRY…CATCH. Giờ ngữ pháp đó được <strong>đóng gói thành các đối tượng có tên, cất trong CSDL</strong>.</p>
<div class="callout"><strong>Thủ tục hay hàm — hình ảnh đời thường.</strong> <strong>Stored procedure</strong> (thủ tục lưu trữ) là tờ công thức cất trong bếp nhà hàng: người phục vụ chỉ cần nói "psm_Change_Name_Of_Project, 2, 'Dự án Bản đồ số'" là bếp làm đủ các bước — nó được sửa dữ liệu, trả về nhiều kết quả, báo ngược lại qua tham số OUTPUT. <strong>Function</strong> (hàm) là một phím trên máy tính bỏ túi: bạn đưa giá trị vào, nó trả lại <em>một</em> giá trị (hoặc một bảng), bạn dùng được nó ngay trong câu SELECT, và nó không được phép sửa bảng nào.</div>
<h3>Cả phần này trong một bảng</h3>
<table>
<thead><tr><th>Slide</th><th>Ý chính</th><th>Bạn phải làm được</th></tr></thead>
<tbody>
<tr><td>20–24</td><td>kiến trúc ba tầng: máy chủ web, máy chủ ứng dụng, máy chủ CSDL</td><td>nói được tầng nào chạy nghiệp vụ, tầng nào chạy truy vấn</td></tr>
<tr><td>25–26</td><td>vì sao dùng stored procedure; SQL/PSM</td><td>kể 5 lợi ích; gọi tên phương ngữ của từng DBMS</td></tr>
<tr><td>27–30</td><td>CREATE PROCEDURE, tham số, OUTPUT, EXEC; ví dụ 1</td><td>viết và gọi một thủ tục có tham số OUTPUT</td></tr>
<tr><td>31–34</td><td>hàm hệ thống; hàm vô hướng, hàm trả bảng inline, hàm trả bảng nhiều câu lệnh</td><td>chọn đúng loại, viết, gọi kèm dbo.</td></tr>
</tbody>
</table>`),
    walkHead('dbi9', 20, 34),
    walk('dbi9', [
      [20, 'The three-tier Architecture',
        `<p class="y-chinh">🎯 Large database installations are usually split into three interacting functions — web servers, application servers, database servers — which may run on one machine or on many.</p>
<p>Think of a restaurant: the <strong>waiter</strong> talks to the guests (web server), the <strong>kitchen</strong> knows the recipes and the house rules (application server), the <strong>storeroom keeper</strong> fetches exactly the ingredients asked for (database server).</p>
<table>
<thead><tr><th>Tier</th><th>Restaurant</th><th>cuongthai.com (this website)</th><th>FPTU PRJ301 project</th></tr></thead>
<tbody>
<tr><td>Web server</td><td>waiter</td><td>Next.js pages sent to your browser</td><td>JSP pages in Tomcat</td></tr>
<tr><td>Application server</td><td>kitchen</td><td>Node.js + Express API</td><td>Java Servlets + DAO classes</td></tr>
<tr><td>Database server</td><td>storeroom</td><td>PostgreSQL</td><td>SQL Server</td></tr>
</tbody>
</table>
<p class="meo">🧠 "Can run on the same processor or on many": on your laptop all three tiers run on one machine; in production each tier can have many copies behind a load balancer.</p>`,
        `<p class="y-chinh">🎯 Các hệ CSDL lớn thường được tách thành ba chức năng làm việc với nhau — máy chủ web, máy chủ ứng dụng, máy chủ CSDL — chạy chung một máy hoặc trên rất nhiều máy.</p>
<p>Hãy nghĩ tới một nhà hàng: <strong>người phục vụ</strong> nói chuyện với khách (máy chủ web — web server), <strong>nhà bếp</strong> biết công thức và luật của quán (máy chủ ứng dụng — application server), <strong>thủ kho</strong> lấy đúng nguyên liệu được yêu cầu (máy chủ CSDL — database server).</p>
<table>
<thead><tr><th>Tầng</th><th>Nhà hàng</th><th>cuongthai.com (chính trang web này)</th><th>Đồ án PRJ301 ở FPTU</th></tr></thead>
<tbody>
<tr><td>Web server</td><td>người phục vụ</td><td>trang Next.js gửi tới trình duyệt</td><td>trang JSP trong Tomcat</td></tr>
<tr><td>Application server</td><td>nhà bếp</td><td>API Node.js + Express</td><td>Servlet Java + các lớp DAO</td></tr>
<tr><td>Database server</td><td>thủ kho</td><td>PostgreSQL</td><td>SQL Server</td></tr>
</tbody>
</table>
<p class="meo">🧠 "Chạy chung một bộ xử lý hoặc rất nhiều bộ xử lý": trên laptop của bạn cả ba tầng chạy chung một máy; khi chạy thật mỗi tầng có thể có nhiều bản sao đứng sau một bộ cân bằng tải.</p>`],
      [21, 'The three-tier Architecture - diagram',
        `<p class="y-chinh">🎯 The diagram: clients reach web servers over the Internet; each web server calls application servers; application servers call database servers, which all share one database.</p>
<pre><code class="language-plaintext">Client        Client                       ← browsers, mobile apps
   \\            /
 ─────── Internet ───────
  Web    Web    Web    Web                 ← 4 web servers
    \\    /  \\   /  \\   /
   App      App      App                   ← 3 application servers
      \\    /    \\    /
     DB Server   DB Server                 ← 2 database servers
           \\       /
           Database                        ← one shared database</code></pre>
<p>Each line is a request going down and data coming back up. A client never talks to the database directly — it only knows the web server's address. That is a security wall: the database password lives only in the application tier.</p>
<p class="meo">🧠 Where do stored procedures fit? They are code that runs in the <strong>bottom box</strong>, next to the data — the application server calls them instead of sending many separate queries.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ: client tới các web server qua Internet; mỗi web server gọi các application server; application server gọi các database server, và chúng cùng dùng chung một CSDL.</p>
<pre><code class="language-plaintext">Client        Client                       ← trình duyệt, app điện thoại
   \\            /
 ─────── Internet ───────
  Web    Web    Web    Web                 ← 4 máy chủ web
    \\    /  \\   /  \\   /
   App      App      App                   ← 3 máy chủ ứng dụng
      \\    /    \\    /
     DB Server   DB Server                 ← 2 máy chủ CSDL
           \\       /
           Database                        ← một CSDL dùng chung</code></pre>
<p>Mỗi đường nối là một yêu cầu đi xuống và dữ liệu đi lên. Client không bao giờ nói chuyện thẳng với CSDL — nó chỉ biết địa chỉ web server. Đó là một bức tường bảo mật: mật khẩu CSDL chỉ nằm ở tầng ứng dụng.</p>
<p class="meo">🧠 Stored procedure nằm ở đâu? Nó là code chạy trong <strong>ô dưới cùng</strong>, sát bên dữ liệu — application server gọi nó thay vì gửi nhiều câu truy vấn rời rạc.</p>`],
      [22, 'The Webserver Tier',
        `<p class="y-chinh">🎯 The web-server processes manage the interaction with the user: when a user makes contact, a web-server process answers, and the user becomes a client of that process.</p>
<p>When you open a page, your browser sends an HTTP request; a web-server process receives it, keeps track of your session (for example the login cookie) and sends back HTML. It does not compute anything itself — it passes the real work to the application tier.</p>
<p>Example: you open "My projects" on a company website; the web server knows who you are from your cookie and asks the application tier "the projects of employee 30121050003".</p>
<p class="meo">🧠 Web tier = presentation (what the user sees). Keyword in FE questions: "manages the interactions with the user".</p>`,
        `<p class="y-chinh">🎯 Các tiến trình web server lo việc giao tiếp với người dùng: khi người dùng kết nối, một tiến trình web server trả lời, và người dùng trở thành client của tiến trình đó.</p>
<p>Khi bạn mở một trang, trình duyệt gửi một yêu cầu HTTP; một tiến trình web server nhận nó, nhớ phiên làm việc của bạn (ví dụ cookie đăng nhập) và gửi lại HTML. Nó không tự tính toán gì — việc thật được chuyển xuống tầng ứng dụng.</p>
<p>Ví dụ: bạn mở mục "Dự án của tôi" trên trang web công ty; web server biết bạn là ai nhờ cookie và hỏi tầng ứng dụng "các dự án của nhân viên 30121050003".</p>
<p class="meo">🧠 Tầng web = trình bày (thứ người dùng nhìn thấy). Từ khoá trong câu FE: "manages the interactions with the user" (lo việc giao tiếp với người dùng).</p>`],
      [23, 'The Application Tier',
        `<p class="y-chinh">🎯 The application tier turns data from the database into the answer the web server needs; it executes the business logic of the organisation, and one web-server process may call many application processes on many machines.</p>
<p><strong>Business logic</strong> = the rules of the company: "a bonus is 1000 above 300 hours", "an employee under 18 cannot be hired", "a project moves to another department when …". In a PRJ301 project this is the Servlet + DAO code; on this website it is the Express services.</p>
<p>The application tier decides <em>what</em> to ask the database, sends the queries (or calls stored procedures), and formats the result (JSON, HTML fragments).</p>
<p class="meo">🧠 A design question you will meet at work: put a rule in the application tier (easy to test, easy to change) or in the database as a procedure/trigger (nobody can bypass it)? Slides 25 and 36 give the database side of the argument.</p>`,
        `<p class="y-chinh">🎯 Tầng ứng dụng biến dữ liệu từ CSDL thành câu trả lời mà web server cần; nó thực thi nghiệp vụ (business logic) của tổ chức, và một tiến trình web server có thể gọi nhiều tiến trình ứng dụng trên nhiều máy.</p>
<p><strong>Business logic</strong> (logic nghiệp vụ) = các luật của công ty: "trên 300 giờ thì thưởng 1000", "người dưới 18 tuổi không được tuyển", "dự án chuyển sang phòng khác khi …". Trong đồ án PRJ301 đó là code Servlet + DAO; trên trang web này là các service của Express.</p>
<p>Tầng ứng dụng quyết định hỏi CSDL <em>cái gì</em>, gửi các câu truy vấn (hoặc gọi stored procedure), rồi định dạng kết quả (JSON, mẩu HTML).</p>
<p class="meo">🧠 Câu hỏi thiết kế bạn sẽ gặp khi đi làm: đặt một luật ở tầng ứng dụng (dễ kiểm thử, dễ sửa) hay trong CSDL dưới dạng procedure/trigger (không ai lách được)? Slide 25 và 36 nêu lý lẽ của phía CSDL.</p>`],
      [24, 'The Database Tier',
        `<p class="y-chinh">🎯 The database tier executes the queries requested by the application tier; it can have many processes on one or many machines.</p>
<p>Here live the DBMS (SQL Server, PostgreSQL), the tables — and everything this chapter creates: procedures, functions, triggers. A query arrives, the DBMS plans it, reads the data, and returns rows.</p>
<p>Many processes: each connection from the application tier gets its own worker; big systems add read-only copies (replicas) of the database on other machines.</p>
<p class="meo">🧠 The three tiers in one line: web = <em>show</em>, application = <em>decide</em>, database = <em>store and fetch</em>. Stored procedures move a bit of "decide" down into the database tier.</p>`,
        `<p class="y-chinh">🎯 Tầng CSDL thực thi các câu truy vấn mà tầng ứng dụng yêu cầu; nó có thể có nhiều tiến trình trên một hoặc nhiều máy.</p>
<p>Ở đây có DBMS (SQL Server, PostgreSQL), các bảng — và mọi thứ chương này tạo ra: thủ tục, hàm, trigger. Một câu truy vấn tới, DBMS lập kế hoạch, đọc dữ liệu, trả về các dòng.</p>
<p>Nhiều tiến trình: mỗi kết nối từ tầng ứng dụng có một tiến trình làm việc riêng; hệ thống lớn còn thêm các bản sao chỉ-đọc (replica) của CSDL trên máy khác.</p>
<p class="meo">🧠 Ba tầng trong một dòng: web = <em>hiển thị</em>, ứng dụng = <em>quyết định</em>, CSDL = <em>cất và lấy</em>. Stored procedure chuyển một phần "quyết định" xuống tầng CSDL.</p>`],
      [25, 'Advantages of using Stored Procedure',
        `<p class="y-chinh">🎯 Five advantages of stored procedures over loose SQL statements: reuse of code, maintainability, reduced client/server traffic, precompiled execution, improved security.</p>
<table>
<thead><tr><th>Advantage</th><th>What it means</th><th>Everyday picture</th></tr></thead>
<tbody>
<tr><td>Reuse of code</td><td>written once, called by every program (web, mobile, report tool)</td><td>one recipe card for all cooks</td></tr>
<tr><td>Maintainability</td><td>change the rule in one place, every caller gets it</td><td>reprint one card instead of retraining everyone</td></tr>
<tr><td>Reduced traffic</td><td>one call "EXEC p 1, 2" instead of 20 statements over the network</td><td>one order slip instead of 20 trips to the storeroom</td></tr>
<tr><td>Precompiled execution</td><td>the execution plan is prepared once and reused from cache</td><td>the cook already knows the recipe by heart</td></tr>
<tr><td>Improved security</td><td>users get the right to EXECUTE the procedure, not to touch the tables; parameters are values, not code (no SQL injection)</td><td>the waiter may ask for dishes, not enter the storeroom</td></tr>
</tbody>
</table>
<p>The security point, tried for real: user <em>intern</em> only receives <code>GRANT EXECUTE</code> on the procedure.</p>
<pre><code class="language-sql">-- "Improved security": a user may run the procedure without any right on the table
GO
CREATE PROCEDURE psm_List_ALL_Of_Project AS SELECT proNum, proName FROM tblProject;
GO
CREATE USER intern WITHOUT LOGIN;                           -- a test user, no password needed
GRANT EXECUTE ON psm_List_ALL_Of_Project TO intern;         -- the ONLY right he gets
GO
EXECUTE AS USER = 'intern';                                  -- act as intern from here
EXEC psm_List_ALL_Of_Project;                               -- allowed
SELECT proNum, proName FROM tblProject;                     -- refused
REVERT;                                                     -- back to the administrator</code></pre>
<table>
<thead><tr><th>proNum</th><th>proName</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td></tr>
<tr><td>2</td><td>ProjectB</td></tr>
<tr><td>3</td><td>ProjectC</td></tr>
<tr><td>4</td><td>ProjectD</td></tr>
<tr><td>5</td><td>ProjectE</td></tr>
<tr><td>6</td><td>ProjectF</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 229, Level 14, State 5<br>
The SELECT permission was denied on the object 'tblProject', database 'DBI202', schema 'dbo'.</b></div>
<p>EXEC works (6 projects), the direct SELECT is refused with Msg 229: the procedure is a controlled door, the table stays locked.</p>
<div class="pitfall">A procedure that builds SQL by concatenating text (<code>EXEC('SELECT … WHERE name = ''' + @name + '''')</code>) loses the protection against SQL injection. The safety comes from typed parameters, not from the word PROCEDURE.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a function runs with the rights of the <em>caller</em> by default; to get the same "controlled door" you declare it <code>SECURITY DEFINER</code> (runs with the owner's rights):
<pre><code class="language-sql">DROP ROLE IF EXISTS intern_demo;
CREATE ROLE intern_demo;
-- SECURITY DEFINER = run with the rights of the function's OWNER (T-SQL gets this through ownership chaining)
CREATE FUNCTION list_all_of_project() RETURNS TABLE (pro_num INT, pro_name VARCHAR)
LANGUAGE sql SECURITY DEFINER
AS $$ SELECT proNum, proName FROM tblProject ORDER BY proNum $$;
REVOKE ALL ON FUNCTION list_all_of_project() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION list_all_of_project() TO intern_demo;
SET ROLE intern_demo;                                       -- act as intern_demo
SELECT * FROM list_all_of_project();                        -- allowed
DO $$
BEGIN
    PERFORM * FROM tblProject;                              -- refused
EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'direct SELECT refused: %', SQLERRM;
END $$;
RESET ROLE;
DROP FUNCTION list_all_of_project();
DROP ROLE intern_demo;</code></pre>
<div class="out">NOTICE:  role "intern_demo" does not exist, skipping<br>
NOTICE:  direct SELECT refused: permission denied for table tblproject</div>
<table>
<thead><tr><th>pro_num</th><th>pro_name</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td></tr>
<tr><td>2</td><td>ProjectB</td></tr>
<tr><td>3</td><td>ProjectC</td></tr>
<tr><td>4</td><td>ProjectD</td></tr>
<tr><td>5</td><td>ProjectE</td></tr>
<tr><td>6</td><td>ProjectF</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions</a>.</div>`,
        `<p class="y-chinh">🎯 Năm lợi ích của stored procedure so với các câu SQL rời: dùng lại code, dễ bảo trì, giảm lưu lượng client/server, thực thi đã biên dịch sẵn, bảo mật tốt hơn.</p>
<table>
<thead><tr><th>Lợi ích</th><th>Nghĩa là gì</th><th>Hình ảnh đời thường</th></tr></thead>
<tbody>
<tr><td>Reuse of code (dùng lại code)</td><td>viết một lần, mọi chương trình gọi được (web, app điện thoại, công cụ báo cáo)</td><td>một tờ công thức cho mọi đầu bếp</td></tr>
<tr><td>Maintainability (dễ bảo trì)</td><td>đổi luật ở một chỗ, mọi nơi gọi đều nhận</td><td>in lại một tờ thay vì dạy lại cả bếp</td></tr>
<tr><td>Reduced traffic (giảm lưu lượng mạng)</td><td>một lời gọi "EXEC p 1, 2" thay cho 20 câu lệnh qua mạng</td><td>một phiếu gọi món thay vì 20 lần chạy vào kho</td></tr>
<tr><td>Precompiled execution (biên dịch sẵn)</td><td>kế hoạch thực thi được lập một lần rồi dùng lại từ bộ nhớ đệm</td><td>đầu bếp đã thuộc lòng công thức</td></tr>
<tr><td>Improved security (bảo mật tốt hơn)</td><td>người dùng được quyền EXECUTE thủ tục, không được đụng vào bảng; tham số là giá trị, không phải code (không bị SQL injection)</td><td>người phục vụ được gọi món, không được vào kho</td></tr>
</tbody>
</table>
<p>Điểm bảo mật, thử thật: người dùng <em>intern</em> chỉ được cấp <code>GRANT EXECUTE</code> trên thủ tục.</p>
<pre><code class="language-sql">-- "Bảo mật tốt hơn": người dùng chạy được thủ tục mà không có quyền gì trên bảng
GO
CREATE PROCEDURE psm_List_ALL_Of_Project AS SELECT proNum, proName FROM tblProject;
GO
CREATE USER intern WITHOUT LOGIN;                           -- người dùng thử, không cần mật khẩu
GRANT EXECUTE ON psm_List_ALL_Of_Project TO intern;         -- quyền DUY NHẤT được cấp
GO
EXECUTE AS USER = 'intern';                                  -- từ đây đóng vai intern
EXEC psm_List_ALL_Of_Project;                               -- được phép
SELECT proNum, proName FROM tblProject;                     -- bị từ chối
REVERT;                                                     -- trở lại quyền quản trị</code></pre>
<table>
<thead><tr><th>proNum</th><th>proName</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td></tr>
<tr><td>2</td><td>ProjectB</td></tr>
<tr><td>3</td><td>ProjectC</td></tr>
<tr><td>4</td><td>ProjectD</td></tr>
<tr><td>5</td><td>ProjectE</td></tr>
<tr><td>6</td><td>ProjectF</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 229, Level 14, State 5<br>
The SELECT permission was denied on the object 'tblProject', database 'DBI202', schema 'dbo'.</b></div>
<p>EXEC chạy được (6 dự án), câu SELECT trực tiếp bị từ chối với Msg 229: thủ tục là một cánh cửa có kiểm soát, còn bảng vẫn khoá.</p>
<div class="pitfall">Thủ tục mà tự ghép chuỗi thành câu SQL (<code>EXEC('SELECT … WHERE name = ''' + @name + '''')</code>) sẽ mất khả năng chống SQL injection (chèn mã SQL độc). Sự an toàn đến từ tham số có kiểu, không phải từ chữ PROCEDURE.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> hàm mặc định chạy bằng quyền của <em>người gọi</em>; muốn có "cánh cửa có kiểm soát" như trên thì khai báo <code>SECURITY DEFINER</code> (chạy bằng quyền của chủ hàm):
<pre><code class="language-sql">DROP ROLE IF EXISTS intern_demo;
CREATE ROLE intern_demo;
-- SECURITY DEFINER = chạy bằng quyền của CHỦ hàm (T-SQL có được nhờ "chuỗi sở hữu")
CREATE FUNCTION list_all_of_project() RETURNS TABLE (pro_num INT, pro_name VARCHAR)
LANGUAGE sql SECURITY DEFINER
AS $$ SELECT proNum, proName FROM tblProject ORDER BY proNum $$;
REVOKE ALL ON FUNCTION list_all_of_project() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION list_all_of_project() TO intern_demo;
SET ROLE intern_demo;                                       -- đóng vai intern_demo
SELECT * FROM list_all_of_project();                        -- được phép
DO $$
BEGIN
    PERFORM * FROM tblProject;                              -- bị từ chối
EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'direct SELECT refused: %', SQLERRM;
END $$;
RESET ROLE;
DROP FUNCTION list_all_of_project();
DROP ROLE intern_demo;</code></pre>
<div class="out">NOTICE:  role "intern_demo" does not exist, skipping<br>
NOTICE:  direct SELECT refused: permission denied for table tblproject</div>
<table>
<thead><tr><th>pro_num</th><th>pro_name</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td></tr>
<tr><td>2</td><td>ProjectB</td></tr>
<tr><td>3</td><td>ProjectC</td></tr>
<tr><td>4</td><td>ProjectD</td></tr>
<tr><td>5</td><td>ProjectE</td></tr>
<tr><td>6</td><td>ProjectF</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm</a>.</div>`],
      [26, 'Stored procedure - Introduction (SQL/PSM)',
        `<p class="y-chinh">🎯 SQL/PSM (Persistent Stored Modules) lets you write procedures in a simple general-purpose language and store them in the database, to use them in queries and other statements; each commercial DBMS offers its own extension of PSM.</p>
<p>"Persistent" = they stay in the database like tables; "stored modules" = procedures and functions. The standard gives the ideas; each vendor gives its own dialect:</p>
<table>
<thead><tr><th>DBMS</th><th>Procedural language</th><th>Close to the PSM of slides 15–19?</th></tr></thead>
<tbody>
<tr><td>SQL Server</td><td>T-SQL (Transact-SQL)</td><td>no — its own syntax (@variables, BEGIN…END, TRY…CATCH)</td></tr>
<tr><td>Oracle</td><td>PL/SQL</td><td>fairly close</td></tr>
<tr><td>PostgreSQL</td><td>PL/pgSQL (modelled on PL/SQL)</td><td>close (IF…END IF, LOOP, EXCEPTION)</td></tr>
<tr><td>MySQL / MariaDB</td><td>stored programs</td><td>follows PSM almost exactly (LEAVE, REPEAT, DECLARE HANDLER)</td></tr>
</tbody>
</table>
<p class="meo">🧠 The ideas (parameters, variables, IF, loops, error handling) move from one DBMS to another; the keywords do not. Learn the ideas on T-SQL for the PE, and keep the 🐘 boxes for work.</p>`,
        `<p class="y-chinh">🎯 SQL/PSM (Persistent Stored Modules — mô-đun lưu trữ bền) cho phép viết thủ tục bằng một ngôn ngữ đơn giản, đa dụng và cất nó trong CSDL, để dùng trong truy vấn và các câu lệnh khác; mỗi DBMS thương mại có phần mở rộng PSM riêng.</p>
<p>"Persistent" (bền) = chúng nằm lại trong CSDL như bảng; "stored modules" (mô-đun lưu trữ) = thủ tục và hàm. Chuẩn đưa ra ý tưởng; mỗi hãng có phương ngữ riêng:</p>
<table>
<thead><tr><th>DBMS</th><th>Ngôn ngữ thủ tục</th><th>Gần với PSM ở slide 15–19?</th></tr></thead>
<tbody>
<tr><td>SQL Server</td><td>T-SQL (Transact-SQL)</td><td>không — cú pháp riêng (@biến, BEGIN…END, TRY…CATCH)</td></tr>
<tr><td>Oracle</td><td>PL/SQL</td><td>khá gần</td></tr>
<tr><td>PostgreSQL</td><td>PL/pgSQL (mô phỏng PL/SQL)</td><td>gần (IF…END IF, LOOP, EXCEPTION)</td></tr>
<tr><td>MySQL / MariaDB</td><td>stored program</td><td>theo PSM gần như y hệt (LEAVE, REPEAT, DECLARE HANDLER)</td></tr>
</tbody>
</table>
<p class="meo">🧠 Ý tưởng (tham số, biến, IF, vòng lặp, xử lý lỗi) mang được từ DBMS này sang DBMS khác; từ khoá thì không. Học ý tưởng trên T-SQL để thi PE, và giữ các ô 🐘 cho lúc đi làm.</p>`],
      [27, 'Creating Stored Procedure under MS SQL Server',
        `<p class="y-chinh">🎯 CREATE PROCEDURE name [@param type [= default] [OUTPUT]], … AS statements; call it with EXEC name [arguments].</p>
<ul>
<li><code>@parameter data_type</code> — an input the caller must give.</li>
<li><code>= default</code> — the caller may leave it out; the default is used.</li>
<li><code>OUTPUT</code> — the procedure writes a value back into the caller's variable (a procedure's way of "returning" values).</li>
</ul>
<p>All three in one procedure on FUHCompany — how many employees of a department earn at least a given salary:</p>
<pre><code class="language-sql">-- A procedure with an input parameter, a DEFAULT value and an OUTPUT parameter
GO
CREATE PROCEDURE psm_Count_Emp_Of_Dep
    @depNum  INT,                  -- input
    @minSal  DECIMAL(10,0) = 0,    -- input with a default value
    @total   INT OUTPUT            -- output: the procedure writes it back
AS
    SET NOCOUNT ON                 -- no "(1 row affected)" from inside the procedure
    SELECT @total = COUNT(*)
    FROM   tblEmployee
    WHERE  depNum = @depNum AND empSalary &gt;= @minSal;
GO
DECLARE @n INT
EXEC psm_Count_Emp_Of_Dep 1, 0, @n OUTPUT                   -- by position
PRINT N'Department 1, any salary: ' + CAST(@n AS VARCHAR)
EXEC psm_Count_Emp_Of_Dep @depNum = 1, @total = @n OUTPUT   -- by name, @minSal takes its default
PRINT N'Department 1, default @minSal: ' + CAST(@n AS VARCHAR)
EXEC psm_Count_Emp_Of_Dep @depNum = 1, @minSal = 60000, @total = @n OUTPUT
PRINT N'Department 1, salary &gt;= 60000: ' + CAST(@n AS VARCHAR)
EXEC psm_Count_Emp_Of_Dep 1, 60000, @n                      -- trap: OUTPUT forgotten at the call
PRINT N'OUTPUT forgotten -&gt; @n unchanged: ' + CAST(@n AS VARCHAR)</code></pre>
<div class="out">Department 1, any salary: 4<br>
Department 1, default @minSal: 4<br>
Department 1, salary &gt;= 60000: 3<br>
OUTPUT forgotten -&gt; @n unchanged: 3</div>
<ul>
<li>Arguments can be given <strong>by position</strong> (<code>1, 0, @n OUTPUT</code>) or <strong>by name</strong> (<code>@depNum = 1, @total = @n OUTPUT</code>) — by name lets you skip @minSal, which takes its default 0.</li>
<li><code>SET NOCOUNT ON</code> inside the procedure stops the "(1 row affected)" messages — a habit for every procedure.</li>
<li>The last call forgets the word OUTPUT: no error, but @n keeps its old value 3 — the result never came back.</li>
</ul>
<div class="pitfall">OUTPUT must be written <strong>twice</strong>: in the parameter list of CREATE PROCEDURE and again in the EXEC call. Missing it at the call is the most common "my procedure returns NULL" bug in the PE.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> (11+): <code>CREATE PROCEDURE name(p INT, …) LANGUAGE plpgsql AS $$ … $$</code>, called with <code>CALL</code>; an output parameter is <code>INOUT</code> (a plain <code>OUT</code> is also accepted since PostgreSQL 14), and a bare CALL shows it as a one-row result:
<pre><code class="language-sql">-- PostgreSQL 11+: CREATE PROCEDURE + CALL; an output parameter is declared INOUT
CREATE PROCEDURE psm_count_emp_of_dep(
    p_dep_num INT,
    p_min_sal NUMERIC,
    INOUT p_total INT DEFAULT NULL)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT COUNT(*) INTO p_total
    FROM   tblEmployee
    WHERE  depNum = p_dep_num AND empSalary &gt;= p_min_sal;
END $$;

CALL psm_count_emp_of_dep(1, 0);            -- CALL prints the INOUT values as a row
CALL psm_count_emp_of_dep(1, 60000);

DO $$                                        -- inside a block the value lands in a variable
DECLARE v_n INT;
BEGIN
    CALL psm_count_emp_of_dep(1, 60000, v_n);
    RAISE NOTICE 'Department 1, salary &gt;= 60000: %', v_n;
END $$;</code></pre>
<div class="out">NOTICE:  Department 1, salary &gt;= 60000: 3</div>
<table>
<thead><tr><th>p_total</th></tr></thead>
<tbody>
<tr><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>p_total</th></tr></thead>
<tbody>
<tr><td>3</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions and procedures</a>.</div>`,
        `<p class="y-chinh">🎯 CREATE PROCEDURE tên [@tham_số kiểu [= mặc_định] [OUTPUT]], … AS các_câu_lệnh; gọi nó bằng EXEC tên [đối_số].</p>
<ul>
<li><code>@parameter data_type</code> — một đầu vào (tham số) người gọi phải đưa.</li>
<li><code>= default</code> — người gọi có thể bỏ qua; khi đó giá trị mặc định được dùng.</li>
<li><code>OUTPUT</code> — thủ tục ghi ngược một giá trị vào biến của người gọi (cách thủ tục "trả về" giá trị).</li>
</ul>
<p>Cả ba trong một thủ tục trên FUHCompany — một phòng có bao nhiêu nhân viên lương ít nhất bằng mức cho trước:</p>
<pre><code class="language-sql">-- Thủ tục có tham số vào, giá trị MẶC ĐỊNH và tham số OUTPUT
GO
CREATE PROCEDURE psm_Count_Emp_Of_Dep
    @depNum  INT,                  -- tham số vào
    @minSal  DECIMAL(10,0) = 0,    -- tham số vào có giá trị mặc định
    @total   INT OUTPUT            -- tham số ra: thủ tục ghi ngược lại
AS
    SET NOCOUNT ON                 -- không in "(1 row affected)" từ bên trong thủ tục
    SELECT @total = COUNT(*)
    FROM   tblEmployee
    WHERE  depNum = @depNum AND empSalary &gt;= @minSal;
GO
DECLARE @n INT
EXEC psm_Count_Emp_Of_Dep 1, 0, @n OUTPUT                   -- theo vị trí
PRINT N'Department 1, any salary: ' + CAST(@n AS VARCHAR)
EXEC psm_Count_Emp_Of_Dep @depNum = 1, @total = @n OUTPUT   -- theo tên, @minSal lấy mặc định
PRINT N'Department 1, default @minSal: ' + CAST(@n AS VARCHAR)
EXEC psm_Count_Emp_Of_Dep @depNum = 1, @minSal = 60000, @total = @n OUTPUT
PRINT N'Department 1, salary &gt;= 60000: ' + CAST(@n AS VARCHAR)
EXEC psm_Count_Emp_Of_Dep 1, 60000, @n                      -- bẫy: quên chữ OUTPUT khi gọi
PRINT N'OUTPUT forgotten -&gt; @n unchanged: ' + CAST(@n AS VARCHAR)</code></pre>
<div class="out">Department 1, any salary: 4<br>
Department 1, default @minSal: 4<br>
Department 1, salary &gt;= 60000: 3<br>
OUTPUT forgotten -&gt; @n unchanged: 3</div>
<ul>
<li>Đối số đưa được <strong>theo vị trí</strong> (<code>1, 0, @n OUTPUT</code>) hoặc <strong>theo tên</strong> (<code>@depNum = 1, @total = @n OUTPUT</code>) — theo tên thì bỏ qua được @minSal, nó lấy mặc định 0.</li>
<li><code>SET NOCOUNT ON</code> trong thủ tục chặn các dòng "(1 row affected)" — thói quen nên có ở mọi thủ tục.</li>
<li>Lời gọi cuối quên chữ OUTPUT: không lỗi, nhưng @n vẫn giữ giá trị cũ là 3 — kết quả không bao giờ quay về.</li>
</ul>
<div class="pitfall">OUTPUT phải viết <strong>hai lần</strong>: trong danh sách tham số của CREATE PROCEDURE và một lần nữa trong lời gọi EXEC. Thiếu ở lời gọi là lỗi "thủ tục của em trả về NULL" hay gặp nhất trong bài PE.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> (bản 11 trở lên): <code>CREATE PROCEDURE tên(p INT, …) LANGUAGE plpgsql AS $$ … $$</code>, gọi bằng <code>CALL</code>; tham số ra là <code>INOUT</code> (từ bản 14 viết <code>OUT</code> cũng được), và một lệnh CALL đứng riêng hiện nó thành một dòng kết quả. Đi làm bạn sẽ gõ bản này:
<pre><code class="language-sql">-- PostgreSQL 11+: CREATE PROCEDURE + CALL; tham số ra khai báo là INOUT
CREATE PROCEDURE psm_count_emp_of_dep(
    p_dep_num INT,
    p_min_sal NUMERIC,
    INOUT p_total INT DEFAULT NULL)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT COUNT(*) INTO p_total
    FROM   tblEmployee
    WHERE  depNum = p_dep_num AND empSalary &gt;= p_min_sal;
END $$;

CALL psm_count_emp_of_dep(1, 0);            -- CALL in các giá trị INOUT thành một dòng
CALL psm_count_emp_of_dep(1, 60000);

DO $$                                        -- trong một khối, giá trị rơi vào biến
DECLARE v_n INT;
BEGIN
    CALL psm_count_emp_of_dep(1, 60000, v_n);
    RAISE NOTICE 'Department 1, salary &gt;= 60000: %', v_n;
END $$;</code></pre>
<div class="out">NOTICE:  Department 1, salary &gt;= 60000: 3</div>
<table>
<thead><tr><th>p_total</th></tr></thead>
<tbody>
<tr><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>p_total</th></tr></thead>
<tbody>
<tr><td>3</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm và thủ tục</a>.</div>`],
      [28, 'Creating PSM Functions and Procedures - Example 1',
        `<p class="y-chinh">🎯 Example 1 has three tasks on FUHCompany: a procedure that lists all projects (slide 29), a procedure that changes a project's name (slide 30), and a stored function that returns the name of a project.</p>
<p>The slides solve only the first two. The third, written here in the same style (our solution, not from the slides):</p>
<pre><code class="language-sql">-- Task 3 of slide 28 (not solved on the slides): a stored function returning the name of a project
IF OBJECT_ID('fn_Get_Name_Of_Project', 'FN') IS NOT NULL
    DROP FUNCTION fn_Get_Name_Of_Project;
GO
CREATE FUNCTION fn_Get_Name_Of_Project (@PNUMBER INT)
RETURNS NVARCHAR(50)
AS
BEGIN
    DECLARE @PNAME NVARCHAR(50)
    SELECT @PNAME = proName FROM tblProject WHERE proNum = @PNUMBER
    RETURN @PNAME
END
GO
SELECT dbo.fn_Get_Name_Of_Project(3) AS project3,
       dbo.fn_Get_Name_Of_Project(99) AS project99;</code></pre>
<table>
<thead><tr><th>project3</th><th>project99</th></tr></thead>
<tbody>
<tr><td>ProjectC</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<ul>
<li><code>RETURNS NVARCHAR(50)</code> — a function declares the type of the one value it returns; the body is BEGIN … RETURN … END.</li>
<li><code>IF OBJECT_ID('…', 'FN') IS NOT NULL DROP FUNCTION …</code> — the same "drop if it exists" trick as the slides use for procedures ('P'); 'FN' = scalar function.</li>
<li>Project 99 does not exist ⇒ the SELECT inside finds no row, @PNAME stays NULL ⇒ the function returns NULL (no error).</li>
</ul>
<p class="meo">🧠 Why a function here and procedures for the other two? "Return the name" is a <em>value</em> you want inside a SELECT; "list" and "change" are <em>actions</em> — procedures.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong>: <code>CREATE FUNCTION … RETURNS VARCHAR(50) LANGUAGE plpgsql AS $$ … $$</code>, called without the <code>dbo.</code> prefix:
<pre><code class="language-sql">CREATE FUNCTION fn_get_name_of_project(p_number INT)
RETURNS VARCHAR(50)
LANGUAGE plpgsql
AS $$
DECLARE v_name VARCHAR(50);
BEGIN
    SELECT proName INTO v_name FROM tblProject WHERE proNum = p_number;
    RETURN v_name;
END $$;
SELECT fn_get_name_of_project(3) AS project3, fn_get_name_of_project(99) AS project99;</code></pre>
<table>
<thead><tr><th>project3</th><th>project99</th></tr></thead>
<tbody>
<tr><td>ProjectC</td><td><em>NULL</em></td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions</a>.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 1 có ba việc trên FUHCompany: thủ tục liệt kê mọi dự án (slide 29), thủ tục đổi tên một dự án (slide 30), và một hàm lưu trữ trả về tên của một dự án.</p>
<p>Slide chỉ giải hai việc đầu. Việc thứ ba, viết ở đây cùng phong cách (lời giải của chúng tôi, không có trên slide):</p>
<pre><code class="language-sql">-- Việc 3 của slide 28 (slide không giải): hàm lưu trữ trả về tên dự án
IF OBJECT_ID('fn_Get_Name_Of_Project', 'FN') IS NOT NULL
    DROP FUNCTION fn_Get_Name_Of_Project;
GO
CREATE FUNCTION fn_Get_Name_Of_Project (@PNUMBER INT)
RETURNS NVARCHAR(50)
AS
BEGIN
    DECLARE @PNAME NVARCHAR(50)
    SELECT @PNAME = proName FROM tblProject WHERE proNum = @PNUMBER
    RETURN @PNAME
END
GO
SELECT dbo.fn_Get_Name_Of_Project(3) AS project3,
       dbo.fn_Get_Name_Of_Project(99) AS project99;</code></pre>
<table>
<thead><tr><th>project3</th><th>project99</th></tr></thead>
<tbody>
<tr><td>ProjectC</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<ul>
<li><code>RETURNS NVARCHAR(50)</code> — hàm khai báo kiểu của một giá trị nó trả về; thân hàm là BEGIN … RETURN … END.</li>
<li><code>IF OBJECT_ID('…', 'FN') IS NOT NULL DROP FUNCTION …</code> — cùng mẹo "có rồi thì xoá" mà slide dùng cho thủ tục ('P'); 'FN' = hàm vô hướng.</li>
<li>Dự án 99 không tồn tại ⇒ câu SELECT bên trong không thấy dòng nào, @PNAME vẫn là NULL ⇒ hàm trả NULL (không lỗi).</li>
</ul>
<p class="meo">🧠 Vì sao việc này là hàm còn hai việc kia là thủ tục? "Trả về tên" là một <em>giá trị</em> bạn muốn dùng trong SELECT; "liệt kê" và "đổi tên" là <em>hành động</em> — thủ tục.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>: <code>CREATE FUNCTION … RETURNS VARCHAR(50) LANGUAGE plpgsql AS $$ … $$</code>, gọi không cần tiền tố <code>dbo.</code>:
<pre><code class="language-sql">CREATE FUNCTION fn_get_name_of_project(p_number INT)
RETURNS VARCHAR(50)
LANGUAGE plpgsql
AS $$
DECLARE v_name VARCHAR(50);
BEGIN
    SELECT proName INTO v_name FROM tblProject WHERE proNum = p_number;
    RETURN v_name;
END $$;
SELECT fn_get_name_of_project(3) AS project3, fn_get_name_of_project(99) AS project99;</code></pre>
<table>
<thead><tr><th>project3</th><th>project99</th></tr></thead>
<tbody>
<tr><td>ProjectC</td><td><em>NULL</em></td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm</a>.</div>`],
      [29, 'Example - Listing all projects',
        `<p class="y-chinh">🎯 Task 1: a procedure without parameters that lists every project — dropped first if it already exists, created, then called with EXEC.</p>
<pre><code class="language-sql">/*
//////////LISTING ALL PROJECTS//////////////////////////////////
*/
IF OBJECT_ID ( 'psm_List_ALL_Of_Project', 'P' ) IS NOT NULL
    DROP PROCEDURE psm_List_ALL_Of_Project;
GO
CREATE PROCEDURE psm_List_ALL_Of_Project
AS
    SELECT *
    FROM tblProject;
GO
EXEC psm_List_ALL_Of_Project;</code></pre>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>locNum</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>1</td><td>1</td></tr>
<tr><td>2</td><td>ProjectB</td><td>2</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>1</td><td>2</td></tr>
<tr><td>4</td><td>ProjectD</td><td>2</td><td>2</td></tr>
<tr><td>5</td><td>ProjectE</td><td>3</td><td>3</td></tr>
<tr><td>6</td><td>ProjectF</td><td>2</td><td>4</td></tr>
</tbody>
</table>
<ul>
<li><code>/* … */</code> — a comment on several lines (the slide's banner "LISTING ALL PROJECTS").</li>
<li><code>IF OBJECT_ID('psm_List_ALL_Of_Project', 'P') IS NOT NULL DROP PROCEDURE …</code> — OBJECT_ID returns the object's number or NULL; 'P' means "a procedure". Running the script twice then does not fail with "There is already an object named …".</li>
<li><code>GO</code> before CREATE PROCEDURE is compulsory: CREATE PROCEDURE must be the <strong>first statement of its batch</strong>, and everything until the next GO becomes its body.</li>
</ul>
<div class="pitfall">Forget the GO before <code>EXEC psm_List_ALL_Of_Project;</code> and the EXEC becomes part of the procedure's body: the procedure calls itself when run — and the CREATE shows nothing. Since SQL Server 2016 you can also write <code>CREATE OR ALTER PROCEDURE</code> instead of the IF … DROP.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a PROCEDURE cannot just "SELECT rows to the screen"; returning rows is the job of a FUNCTION <code>RETURNS SETOF tblProject</code> (or <code>RETURNS TABLE</code>), called in FROM. <code>DROP … IF EXISTS</code> replaces the OBJECT_ID trick (the NOTICE says there was nothing to drop):
<pre><code class="language-sql">-- A PostgreSQL PROCEDURE cannot simply return rows; a FUNCTION ... RETURNS TABLE can
DROP FUNCTION IF EXISTS psm_list_all_of_project();
CREATE FUNCTION psm_list_all_of_project()
RETURNS SETOF tblProject            -- "a set of rows shaped like tblProject"
LANGUAGE sql
AS $$
    SELECT * FROM tblProject ORDER BY proNum;
$$;
SELECT * FROM psm_list_all_of_project();    -- called in FROM, not with EXEC</code></pre>
<div class="out">NOTICE:  function psm_list_all_of_project() does not exist, skipping</div>
<table>
<thead><tr><th>pronum</th><th>proname</th><th>locnum</th><th>depnum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>1</td><td>1</td></tr>
<tr><td>2</td><td>ProjectB</td><td>2</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>1</td><td>2</td></tr>
<tr><td>4</td><td>ProjectD</td><td>2</td><td>2</td></tr>
<tr><td>5</td><td>ProjectE</td><td>3</td><td>3</td></tr>
<tr><td>6</td><td>ProjectF</td><td>2</td><td>4</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions</a>.</div>`,
        `<p class="y-chinh">🎯 Việc 1: một thủ tục không tham số liệt kê mọi dự án — xoá trước nếu đã có, tạo, rồi gọi bằng EXEC.</p>
<pre><code class="language-sql">/*
//////////LISTING ALL PROJECTS//////////////////////////////////
*/
IF OBJECT_ID ( 'psm_List_ALL_Of_Project', 'P' ) IS NOT NULL
    DROP PROCEDURE psm_List_ALL_Of_Project;
GO
CREATE PROCEDURE psm_List_ALL_Of_Project
AS
    SELECT *
    FROM tblProject;
GO
EXEC psm_List_ALL_Of_Project;</code></pre>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>locNum</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>1</td><td>1</td></tr>
<tr><td>2</td><td>ProjectB</td><td>2</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>1</td><td>2</td></tr>
<tr><td>4</td><td>ProjectD</td><td>2</td><td>2</td></tr>
<tr><td>5</td><td>ProjectE</td><td>3</td><td>3</td></tr>
<tr><td>6</td><td>ProjectF</td><td>2</td><td>4</td></tr>
</tbody>
</table>
<ul>
<li><code>/* … */</code> — chú thích nhiều dòng (dải chữ "LISTING ALL PROJECTS" trên slide).</li>
<li><code>IF OBJECT_ID('psm_List_ALL_Of_Project', 'P') IS NOT NULL DROP PROCEDURE …</code> — OBJECT_ID trả số hiệu của đối tượng hoặc NULL; 'P' nghĩa là "một thủ tục". Nhờ vậy chạy script hai lần không bị lỗi "There is already an object named …" (đã có đối tượng tên …).</li>
<li><code>GO</code> trước CREATE PROCEDURE là bắt buộc: CREATE PROCEDURE phải là <strong>câu đầu tiên của lô</strong>, và mọi thứ tới chữ GO kế tiếp đều thành thân của nó.</li>
</ul>
<div class="pitfall">Quên chữ GO trước <code>EXEC psm_List_ALL_Of_Project;</code> thì câu EXEC thành một phần thân thủ tục: thủ tục tự gọi chính nó khi chạy — còn lệnh CREATE thì không hiện gì. Từ SQL Server 2016 còn viết được <code>CREATE OR ALTER PROCEDURE</code> thay cho IF … DROP.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> PROCEDURE không "SELECT ra màn hình" được như vậy; trả về các dòng là việc của FUNCTION <code>RETURNS SETOF tblProject</code> (hoặc <code>RETURNS TABLE</code>), gọi trong FROM. <code>DROP … IF EXISTS</code> thay cho mẹo OBJECT_ID (dòng NOTICE báo không có gì để xoá):
<pre><code class="language-sql">-- PROCEDURE của PostgreSQL không trả dòng đơn giản được; FUNCTION ... RETURNS TABLE thì được
DROP FUNCTION IF EXISTS psm_list_all_of_project();
CREATE FUNCTION psm_list_all_of_project()
RETURNS SETOF tblProject            -- "một tập dòng có dạng như tblProject"
LANGUAGE sql
AS $$
    SELECT * FROM tblProject ORDER BY proNum;
$$;
SELECT * FROM psm_list_all_of_project();    -- gọi trong FROM, không dùng EXEC</code></pre>
<div class="out">NOTICE:  function psm_list_all_of_project() does not exist, skipping</div>
<table>
<thead><tr><th>pronum</th><th>proname</th><th>locnum</th><th>depnum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>1</td><td>1</td></tr>
<tr><td>2</td><td>ProjectB</td><td>2</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>1</td><td>2</td></tr>
<tr><td>4</td><td>ProjectD</td><td>2</td><td>2</td></tr>
<tr><td>5</td><td>ProjectE</td><td>3</td><td>3</td></tr>
<tr><td>6</td><td>ProjectF</td><td>2</td><td>4</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm</a>.</div>`],
      [30, 'Example - Changing the name of a project',
        `<p class="y-chinh">🎯 Task 2: a procedure with two input parameters, @PNUMBER and @PNAME, that renames one project with an UPDATE.</p>
<pre><code class="language-sql">/*
////////////////////////////////////////////////////////////
*/
IF OBJECT_ID ( 'psm_Change_Name_Of_Project', 'P' ) IS NOT NULL
    DROP PROCEDURE psm_Change_Name_Of_Project;
GO
CREATE PROCEDURE psm_Change_Name_Of_Project
    @PNUMBER INT,
    @PNAME NVARCHAR(50)
AS
    UPDATE tblProject
    SET proNAME=@PNAME
    WHERE proNum=@PNUMBER;
GO

EXEC psm_Change_Name_Of_Project 1,'ProjectA';
GO
-- (added) a call that really changes something, then look at the table
EXEC psm_Change_Name_Of_Project 2, N'Dự án Bản đồ số';
SELECT proNum, proName FROM tblProject WHERE proNum IN (1, 2);</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>proNum</th><th>proName</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td></tr>
<tr><td>2</td><td>Dự án Bản đồ số</td></tr>
</tbody>
</table>
<ul>
<li><code>@PNUMBER INT, @PNAME NVARCHAR(50)</code> — the parameters, separated by commas, before AS.</li>
<li><code>EXEC psm_Change_Name_Of_Project 1,'ProjectA';</code> — the slide's call: project 1 is already called ProjectA, so the UPDATE touches 1 row but changes nothing.</li>
<li>The added call renames project 2 with a Vietnamese name — note the <code>N'…'</code>, and the table confirms the change. T-SQL is case-insensitive for names: <code>proNAME</code> in the slide's SET is the column proName.</li>
</ul>
<p><code>'ProjectA'</code> without N works only because it has no accents. The same call with a Vietnamese name, without and with N:</p>
<pre><code class="language-sql">GO
CREATE PROCEDURE psm_Change_Name_Of_Project @PNUMBER INT, @PNAME NVARCHAR(50)
AS
    UPDATE tblProject SET proNAME=@PNAME WHERE proNum=@PNUMBER;
GO
EXEC psm_Change_Name_Of_Project 2, 'Dự án Bản đồ số';    -- no N
EXEC psm_Change_Name_Of_Project 3, N'Dự án Bản đồ số';   -- with N
SELECT proNum, proName FROM tblProject WHERE proNum IN (2, 3);</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>proNum</th><th>proName</th></tr></thead>
<tbody>
<tr><td>2</td><td>D? án B?n d? s?</td></tr>
<tr><td>3</td><td>Dự án Bản đồ số</td></tr>
</tbody>
</table>
<div class="pitfall">Without N the name is stored as "D? án B?n d? s?": the parameter is NVARCHAR, but the literal <code>'…'</code> was already squeezed into the old one-byte code page before it arrived — letters that do not exist there become ? (or a look-alike: đ → d). Always <code>N'…'</code> for Vietnamese.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong>: <code>CREATE OR REPLACE PROCEDURE</code> (create or overwrite in one step), <code>CALL</code>, and <code>GET DIAGNOSTICS v = ROW_COUNT</code> for the number of rows touched (T-SQL: <code>@@ROWCOUNT</code>):
<pre><code class="language-sql">CREATE OR REPLACE PROCEDURE psm_change_name_of_project(p_number INT, p_name VARCHAR(50))
LANGUAGE plpgsql
AS $$
DECLARE v_rows INT;
BEGIN
    UPDATE tblProject SET proName = p_name WHERE proNum = p_number;
    GET DIAGNOSTICS v_rows = ROW_COUNT;     -- like @@ROWCOUNT in T-SQL
    RAISE NOTICE '% row(s) updated', v_rows;
END $$;
CALL psm_change_name_of_project(2, 'Dự án Bản đồ số');
SELECT proNum, proName FROM tblProject WHERE proNum IN (1, 2) ORDER BY proNum;</code></pre>
<div class="out">NOTICE:  1 row(s) updated</div>
<table>
<thead><tr><th>pronum</th><th>proname</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td></tr>
<tr><td>2</td><td>Dự án Bản đồ số</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-4-update-delete">PostgreSQL 4.4 — UPDATE and DELETE</a>.</div>`,
        `<p class="y-chinh">🎯 Việc 2: một thủ tục có hai tham số vào, @PNUMBER và @PNAME, đổi tên một dự án bằng câu UPDATE.</p>
<pre><code class="language-sql">/*
////////////////////////////////////////////////////////////
*/
IF OBJECT_ID ( 'psm_Change_Name_Of_Project', 'P' ) IS NOT NULL
    DROP PROCEDURE psm_Change_Name_Of_Project;
GO
CREATE PROCEDURE psm_Change_Name_Of_Project
    @PNUMBER INT,
    @PNAME NVARCHAR(50)
AS
    UPDATE tblProject
    SET proNAME=@PNAME
    WHERE proNum=@PNUMBER;
GO

EXEC psm_Change_Name_Of_Project 1,'ProjectA';
GO
-- (thêm) một lần gọi thật sự đổi dữ liệu, rồi xem bảng
EXEC psm_Change_Name_Of_Project 2, N'Dự án Bản đồ số';
SELECT proNum, proName FROM tblProject WHERE proNum IN (1, 2);</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>proNum</th><th>proName</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td></tr>
<tr><td>2</td><td>Dự án Bản đồ số</td></tr>
</tbody>
</table>
<ul>
<li><code>@PNUMBER INT, @PNAME NVARCHAR(50)</code> — các tham số, cách nhau bằng dấu phẩy, đứng trước AS.</li>
<li><code>EXEC psm_Change_Name_Of_Project 1,'ProjectA';</code> — lời gọi của slide: dự án 1 vốn đã tên ProjectA, nên UPDATE chạm 1 dòng nhưng không đổi gì.</li>
<li>Lời gọi thêm vào đổi tên dự án 2 thành một tên tiếng Việt — để ý <code>N'…'</code>, và bảng xác nhận đã đổi. T-SQL không phân biệt hoa thường ở tên: <code>proNAME</code> trong câu SET của slide chính là cột proName.</li>
</ul>
<p><code>'ProjectA'</code> không có N vẫn chạy chỉ vì nó không có dấu. Cùng lời gọi với một tên tiếng Việt, thiếu N và có N:</p>
<pre><code class="language-sql">GO
CREATE PROCEDURE psm_Change_Name_Of_Project @PNUMBER INT, @PNAME NVARCHAR(50)
AS
    UPDATE tblProject SET proNAME=@PNAME WHERE proNum=@PNUMBER;
GO
EXEC psm_Change_Name_Of_Project 2, 'Dự án Bản đồ số';    -- thiếu N
EXEC psm_Change_Name_Of_Project 3, N'Dự án Bản đồ số';   -- có N
SELECT proNum, proName FROM tblProject WHERE proNum IN (2, 3);</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>proNum</th><th>proName</th></tr></thead>
<tbody>
<tr><td>2</td><td>D? án B?n d? s?</td></tr>
<tr><td>3</td><td>Dự án Bản đồ số</td></tr>
</tbody>
</table>
<div class="pitfall">Thiếu N thì tên bị lưu thành "D? án B?n d? s?": tham số là NVARCHAR, nhưng hằng chuỗi <code>'…'</code> đã bị ép vào bảng mã cũ một byte trước khi tới nơi — chữ nào không có trong đó thành ? (hoặc một chữ na ná: đ → d). Tiếng Việt thì luôn <code>N'…'</code>.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>: <code>CREATE OR REPLACE PROCEDURE</code> (tạo hoặc ghi đè trong một bước), <code>CALL</code>, và <code>GET DIAGNOSTICS v = ROW_COUNT</code> để biết số dòng bị chạm (T-SQL: <code>@@ROWCOUNT</code>):
<pre><code class="language-sql">CREATE OR REPLACE PROCEDURE psm_change_name_of_project(p_number INT, p_name VARCHAR(50))
LANGUAGE plpgsql
AS $$
DECLARE v_rows INT;
BEGIN
    UPDATE tblProject SET proName = p_name WHERE proNum = p_number;
    GET DIAGNOSTICS v_rows = ROW_COUNT;     -- giống @@ROWCOUNT của T-SQL
    RAISE NOTICE '% row(s) updated', v_rows;
END $$;
CALL psm_change_name_of_project(2, 'Dự án Bản đồ số');
SELECT proNum, proName FROM tblProject WHERE proNum IN (1, 2) ORDER BY proNum;</code></pre>
<div class="out">NOTICE:  1 row(s) updated</div>
<table>
<thead><tr><th>pronum</th><th>proname</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td></tr>
<tr><td>2</td><td>Dự án Bản đồ số</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-4-update-delete">PostgreSQL 4.4 — UPDATE và DELETE</a>.</div>`],
      [31, 'Function in SQL Server',
        `<p class="y-chinh">🎯 Two families of functions: system-defined functions (built into SQL Server) and user-defined functions, which come in three kinds — scalar, inline table-valued, multi-statement table-valued.</p>
<p>You have used system functions since Chapter 6 (COUNT, AVG, GETDATE). A few more, on FUHCompany:</p>
<pre><code class="language-sql">-- System-defined functions: already built into SQL Server
SELECT TOP 3
       empName,
       UPPER(empName)                 AS upperName,     -- text
       LEN(empName)                   AS nameLength,
       YEAR(empBirthdate)             AS birthYear,     -- date
       ROUND(empSalary / 12, 0)       AS monthly,       -- math
       ISNULL(empAddress, N'(chưa có)') AS address      -- NULL handling
FROM tblEmployee
ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empName</th><th>upperName</th><th>nameLength</th><th>birthYear</th><th>monthly</th><th>address</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>TRẦN MINH QUANG</td><td>15</td><td>1968</td><td>12500.000000</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Hoàng Thị Hà</td><td>HOÀNG THỊ HÀ</td><td>12</td><td>1985</td><td>7500.000000</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Võ Việt Anh</td><td>VÕ VIỆT ANH</td><td>11</td><td>1990</td><td>5000.000000</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>User-defined kind</th><th>Returns</th><th>Body</th><th>Called as</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Scalar</td><td>one value (INT, NVARCHAR…)</td><td>BEGIN … RETURN value END</td><td><code>SELECT dbo.f(x)</code></td><td>32</td></tr>
<tr><td>Inline table-valued</td><td>a table</td><td>a single <code>RETURN (SELECT …)</code></td><td><code>SELECT * FROM f(x)</code></td><td>33</td></tr>
<tr><td>Multi-statement table-valued</td><td>a table variable filled step by step</td><td>BEGIN … INSERT @t … RETURN END</td><td><code>SELECT * FROM f(x)</code></td><td>34</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the system functions have other names in places (<code>LENGTH</code>, <code>EXTRACT(YEAR FROM …)</code>, <code>COALESCE</code>, <code>LIMIT</code> for TOP), and user functions are one kind with different return types (<code>RETURNS numeric</code>, <code>RETURNS TABLE (…)</code>, <code>RETURNS SETOF …</code>):
<pre><code class="language-sql">SELECT empName,
       UPPER(empName)                         AS upper_name,
       LENGTH(empName)                        AS name_length,   -- LEN -&gt; LENGTH
       EXTRACT(YEAR FROM empBirthdate)        AS birth_year,    -- YEAR() -&gt; EXTRACT
       ROUND(empSalary / 12, 0)               AS monthly,
       COALESCE(empAddress, '(chưa có)')      AS address        -- ISNULL -&gt; COALESCE
FROM tblEmployee
ORDER BY empSSN
LIMIT 3;                                                        -- TOP 3 -&gt; LIMIT 3</code></pre>
<table>
<thead><tr><th>empname</th><th>upper_name</th><th>name_length</th><th>birth_year</th><th>monthly</th><th>address</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>TRẦN MINH QUANG</td><td>15</td><td>1968</td><td>12500</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Hoàng Thị Hà</td><td>HOÀNG THỊ HÀ</td><td>12</td><td>1985</td><td>7500</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Võ Việt Anh</td><td>VÕ VIỆT ANH</td><td>11</td><td>1990</td><td>5000</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-1-ham-tong-hop">PostgreSQL 6.1 — aggregate functions</a>.</div>`,
        `<p class="y-chinh">🎯 Hai họ hàm: hàm hệ thống (system-defined — có sẵn trong SQL Server) và hàm người dùng tự định nghĩa (user-defined), gồm ba loại — vô hướng (scalar), trả bảng inline, trả bảng nhiều câu lệnh.</p>
<p>Bạn đã dùng hàm hệ thống từ Chương 6 (COUNT, AVG, GETDATE). Thêm vài hàm nữa, trên FUHCompany:</p>
<pre><code class="language-sql">-- Hàm hệ thống: có sẵn trong SQL Server
SELECT TOP 3
       empName,
       UPPER(empName)                 AS upperName,     -- chữ
       LEN(empName)                   AS nameLength,
       YEAR(empBirthdate)             AS birthYear,     -- ngày
       ROUND(empSalary / 12, 0)       AS monthly,       -- số
       ISNULL(empAddress, N'(chưa có)') AS address      -- xử lý NULL
FROM tblEmployee
ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empName</th><th>upperName</th><th>nameLength</th><th>birthYear</th><th>monthly</th><th>address</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>TRẦN MINH QUANG</td><td>15</td><td>1968</td><td>12500.000000</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Hoàng Thị Hà</td><td>HOÀNG THỊ HÀ</td><td>12</td><td>1985</td><td>7500.000000</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Võ Việt Anh</td><td>VÕ VIỆT ANH</td><td>11</td><td>1990</td><td>5000.000000</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Loại hàm người dùng</th><th>Trả về</th><th>Thân hàm</th><th>Gọi thế nào</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Scalar (vô hướng)</td><td>một giá trị (INT, NVARCHAR…)</td><td>BEGIN … RETURN giá_trị END</td><td><code>SELECT dbo.f(x)</code></td><td>32</td></tr>
<tr><td>Inline table-valued (trả bảng inline)</td><td>một bảng</td><td>đúng một câu <code>RETURN (SELECT …)</code></td><td><code>SELECT * FROM f(x)</code></td><td>33</td></tr>
<tr><td>Multi-statement table-valued (trả bảng nhiều câu lệnh)</td><td>một biến bảng được đổ dần</td><td>BEGIN … INSERT @t … RETURN END</td><td><code>SELECT * FROM f(x)</code></td><td>34</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> hàm hệ thống có chỗ khác tên (<code>LENGTH</code>, <code>EXTRACT(YEAR FROM …)</code>, <code>COALESCE</code>, <code>LIMIT</code> thay cho TOP), còn hàm người dùng chỉ có một loại với các kiểu trả về khác nhau (<code>RETURNS numeric</code>, <code>RETURNS TABLE (…)</code>, <code>RETURNS SETOF …</code>):
<pre><code class="language-sql">SELECT empName,
       UPPER(empName)                         AS upper_name,
       LENGTH(empName)                        AS name_length,   -- LEN -&gt; LENGTH
       EXTRACT(YEAR FROM empBirthdate)        AS birth_year,    -- YEAR() -&gt; EXTRACT
       ROUND(empSalary / 12, 0)               AS monthly,
       COALESCE(empAddress, '(chưa có)')      AS address        -- ISNULL -&gt; COALESCE
FROM tblEmployee
ORDER BY empSSN
LIMIT 3;                                                        -- TOP 3 -&gt; LIMIT 3</code></pre>
<table>
<thead><tr><th>empname</th><th>upper_name</th><th>name_length</th><th>birth_year</th><th>monthly</th><th>address</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>TRẦN MINH QUANG</td><td>15</td><td>1968</td><td>12500</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Hoàng Thị Hà</td><td>HOÀNG THỊ HÀ</td><td>12</td><td>1985</td><td>7500</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Võ Việt Anh</td><td>VÕ VIỆT ANH</td><td>11</td><td>1990</td><td>5000</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-1-ham-tong-hop">PostgreSQL 6.1 — hàm tổng hợp</a>.</div>`],
      [32, 'Scalar functions',
        `<p class="y-chinh">🎯 A scalar function takes parameters and returns ONE value of a declared type: CREATE FUNCTION name (@p type, …) RETURNS type AS BEGIN … RETURN value END; call it as SELECT dbo.name(value).</p>
<p>The slide shows only the syntax and "//demo". Our demo: the total working hours of an employee, 0 if he works on no project.</p>
<pre><code class="language-sql">-- Scalar function: total working hours of one employee (0 if he works on no project)
GO
CREATE FUNCTION fn_TotalHours (@empSSN DECIMAL(18,0))
RETURNS DECIMAL(6,1)
AS
BEGIN
    DECLARE @total DECIMAL(6,1)
    SELECT @total = SUM(workHours) FROM tblWorksOn WHERE empSSN = @empSSN
    RETURN ISNULL(@total, 0)
END
GO
-- Called with the schema name dbo., like a built-in function
SELECT dbo.fn_TotalHours(30121050003) AS hours003;
SELECT empSSN, empName, dbo.fn_TotalHours(empSSN) AS totalHours
FROM tblEmployee
WHERE depNum = 1
ORDER BY totalHours DESC;</code></pre>
<table>
<thead><tr><th>hours003</th></tr></thead>
<tbody>
<tr><td>52.5</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>totalHours</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>52.5</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>35.0</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>20.0</td></tr>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>10.0</td></tr>
</tbody>
</table>
<ul>
<li><code>RETURNS DECIMAL(6,1)</code> then <code>RETURN ISNULL(@total, 0)</code> — the returned value must fit the declared type.</li>
<li>Used in the SELECT list, the function runs <strong>once per row</strong>: 4 employees of department 1 ⇒ 4 calls.</li>
</ul>
<p>The schema prefix is not optional:</p>
<pre><code class="language-sql">GO
CREATE FUNCTION fn_TotalHours (@empSSN DECIMAL(18,0))
RETURNS DECIMAL(6,1)
AS
BEGIN
    RETURN ISNULL((SELECT SUM(workHours) FROM tblWorksOn WHERE empSSN = @empSSN), 0)
END
GO
-- Without dbo. SQL Server looks for a BUILT-IN function of that name
SELECT fn_TotalHours(30121050003);</code></pre>
<div class="out"><b>Msg 195, Level 15, State 10<br>
'fn_TotalHours' is not a recognized function name.</b></div>
<div class="pitfall">A user scalar function must be called with its schema: <code>dbo.fn_TotalHours(…)</code>. Without <code>dbo.</code> SQL Server looks for a built-in function and fails with Msg 195. And a scalar function in a WHERE over a big table runs once per row and blocks index use — prefer a JOIN or an inline function when the table is large.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a function whose body is one query can be written <code>LANGUAGE sql</code> (no BEGIN/RETURN); it is called without a schema prefix:
<pre><code class="language-sql">CREATE FUNCTION fn_total_hours(p_emp_ssn NUMERIC)
RETURNS NUMERIC
LANGUAGE sql                      -- a one-query function can be plain SQL
AS $$
    SELECT COALESCE(SUM(workHours), 0) FROM tblWorksOn WHERE empSSN = p_emp_ssn;
$$;
SELECT fn_total_hours(30121050003) AS hours003;       -- no dbo. prefix
SELECT empSSN, empName, fn_total_hours(empSSN) AS total_hours
FROM tblEmployee WHERE depNum = 1 ORDER BY total_hours DESC;</code></pre>
<table>
<thead><tr><th>hours003</th></tr></thead>
<tbody>
<tr><td>52.5</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>total_hours</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>52.5</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>35.0</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>20.0</td></tr>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>10.0</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions</a>.</div>`,
        `<p class="y-chinh">🎯 Hàm vô hướng (scalar function) nhận tham số và trả về MỘT giá trị có kiểu khai báo trước: CREATE FUNCTION tên (@p kiểu, …) RETURNS kiểu AS BEGIN … RETURN giá_trị END; gọi bằng SELECT dbo.tên(giá_trị).</p>
<p>Slide chỉ có cú pháp và chữ "//demo". Phần demo của chúng tôi: tổng giờ làm của một nhân viên, 0 nếu người đó không làm dự án nào.</p>
<pre><code class="language-sql">-- Hàm vô hướng: tổng giờ làm của một nhân viên (0 nếu không làm dự án nào)
GO
CREATE FUNCTION fn_TotalHours (@empSSN DECIMAL(18,0))
RETURNS DECIMAL(6,1)
AS
BEGIN
    DECLARE @total DECIMAL(6,1)
    SELECT @total = SUM(workHours) FROM tblWorksOn WHERE empSSN = @empSSN
    RETURN ISNULL(@total, 0)
END
GO
-- Gọi kèm tên lược đồ dbo., như một hàm có sẵn
SELECT dbo.fn_TotalHours(30121050003) AS hours003;
SELECT empSSN, empName, dbo.fn_TotalHours(empSSN) AS totalHours
FROM tblEmployee
WHERE depNum = 1
ORDER BY totalHours DESC;</code></pre>
<table>
<thead><tr><th>hours003</th></tr></thead>
<tbody>
<tr><td>52.5</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>totalHours</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>52.5</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>35.0</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>20.0</td></tr>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>10.0</td></tr>
</tbody>
</table>
<ul>
<li><code>RETURNS DECIMAL(6,1)</code> rồi <code>RETURN ISNULL(@total, 0)</code> — giá trị trả về phải vừa với kiểu đã khai báo.</li>
<li>Dùng trong danh sách SELECT thì hàm chạy <strong>mỗi dòng một lần</strong>: 4 nhân viên phòng 1 ⇒ 4 lần gọi.</li>
</ul>
<p>Tiền tố lược đồ không phải tuỳ chọn:</p>
<pre><code class="language-sql">GO
CREATE FUNCTION fn_TotalHours (@empSSN DECIMAL(18,0))
RETURNS DECIMAL(6,1)
AS
BEGIN
    RETURN ISNULL((SELECT SUM(workHours) FROM tblWorksOn WHERE empSSN = @empSSN), 0)
END
GO
-- Thiếu dbo. thì SQL Server đi tìm một hàm CÓ SẴN tên đó
SELECT fn_TotalHours(30121050003);</code></pre>
<div class="out"><b>Msg 195, Level 15, State 10<br>
'fn_TotalHours' is not a recognized function name.</b></div>
<div class="pitfall">Hàm vô hướng người dùng phải gọi kèm lược đồ (schema): <code>dbo.fn_TotalHours(…)</code>. Thiếu <code>dbo.</code> thì SQL Server đi tìm một hàm có sẵn và hỏng với Msg 195. Và hàm vô hướng đặt trong WHERE trên một bảng lớn sẽ chạy mỗi dòng một lần và cản việc dùng chỉ mục — bảng lớn thì nên dùng JOIN hoặc hàm inline.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> hàm có thân chỉ là một câu truy vấn thì viết được bằng <code>LANGUAGE sql</code> (không cần BEGIN/RETURN); gọi không cần tiền tố lược đồ:
<pre><code class="language-sql">CREATE FUNCTION fn_total_hours(p_emp_ssn NUMERIC)
RETURNS NUMERIC
LANGUAGE sql                      -- hàm chỉ có một câu truy vấn thì viết bằng SQL thuần
AS $$
    SELECT COALESCE(SUM(workHours), 0) FROM tblWorksOn WHERE empSSN = p_emp_ssn;
$$;
SELECT fn_total_hours(30121050003) AS hours003;       -- không có tiền tố dbo.
SELECT empSSN, empName, fn_total_hours(empSSN) AS total_hours
FROM tblEmployee WHERE depNum = 1 ORDER BY total_hours DESC;</code></pre>
<table>
<thead><tr><th>hours003</th></tr></thead>
<tbody>
<tr><td>52.5</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>total_hours</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>52.5</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>35.0</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>20.0</td></tr>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>10.0</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm</a>.</div>`],
      [33, 'Inline Table-valued Function',
        `<p class="y-chinh">🎯 An inline table-valued function returns a table produced by ONE SELECT: CREATE FUNCTION name (@p type, …) RETURNS TABLE AS RETURN (SELECT …); call it in FROM: SELECT * FROM name(value).</p>
<p>Demo (the slide says "//demo"): the employees of a given department — a "view with a parameter".</p>
<pre><code class="language-sql">-- Inline table-valued function: a "view with parameters"
GO
CREATE FUNCTION fn_Employees_Of_Dep (@depNum INT)
RETURNS TABLE
AS
RETURN (SELECT empSSN, empName, empSalary
        FROM   tblEmployee
        WHERE  depNum = @depNum)
GO
SELECT * FROM fn_Employees_Of_Dep(2) ORDER BY empSalary DESC;
-- It behaves like a table: join it, filter it, count it
SELECT e.empName, w.proNum, w.workHours
FROM   fn_Employees_Of_Dep(2) AS e
JOIN   tblWorksOn w ON w.empSSN = e.empSSN
WHERE  w.workHours &gt;= 20
ORDER BY e.empName, w.proNum;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>55000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>proNum</th><th>workHours</th></tr></thead>
<tbody>
<tr><td>Đặng Tuấn Anh</td><td>4</td><td>20.0</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>3</td><td>30.0</td></tr>
<tr><td>Mai Duy An</td><td>2</td><td>20.0</td></tr>
<tr><td>Mai Duy An</td><td>3</td><td>25.0</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>4</td><td>30.0</td></tr>
</tbody>
</table>
<ul>
<li>No BEGIN…END and no column list: the columns of the table are those of the SELECT.</li>
<li>The second query shows why it is powerful: the function's result is <strong>joined</strong> with tblWorksOn and filtered like any table.</li>
<li>Called in FROM, the <code>dbo.</code> prefix is optional (it is required only for scalar functions).</li>
</ul>
<p class="meo">🧠 A view cannot take parameters; an inline function can. SQL Server expands it into the outer query like a view, so it is fast — the best kind of function for the PE and for work.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong>: <code>RETURNS TABLE (column type, …)</code> — the columns must be declared — with a <code>LANGUAGE sql</code> body:
<pre><code class="language-sql">CREATE FUNCTION fn_employees_of_dep(p_dep_num INT)
RETURNS TABLE (emp_ssn NUMERIC, emp_name VARCHAR, emp_salary NUMERIC)   -- columns must be listed
LANGUAGE sql
AS $$
    SELECT empSSN, empName, empSalary FROM tblEmployee WHERE depNum = p_dep_num;
$$;
SELECT * FROM fn_employees_of_dep(2) ORDER BY emp_salary DESC;</code></pre>
<table>
<thead><tr><th>emp_ssn</th><th>emp_name</th><th>emp_salary</th></tr></thead>
<tbody>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>55000</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-3-view">PostgreSQL 12.3 — views</a>.</div>`,
        `<p class="y-chinh">🎯 Hàm trả bảng inline (inline table-valued function) trả về một bảng do MỘT câu SELECT tạo ra: CREATE FUNCTION tên (@p kiểu, …) RETURNS TABLE AS RETURN (SELECT …); gọi trong FROM: SELECT * FROM tên(giá_trị).</p>
<p>Demo (slide ghi "//demo"): nhân viên của một phòng cho trước — một "view có tham số".</p>
<pre><code class="language-sql">-- Hàm trả về bảng dạng inline: một "view có tham số"
GO
CREATE FUNCTION fn_Employees_Of_Dep (@depNum INT)
RETURNS TABLE
AS
RETURN (SELECT empSSN, empName, empSalary
        FROM   tblEmployee
        WHERE  depNum = @depNum)
GO
SELECT * FROM fn_Employees_Of_Dep(2) ORDER BY empSalary DESC;
-- Nó cư xử như một bảng: join, lọc, đếm được
SELECT e.empName, w.proNum, w.workHours
FROM   fn_Employees_Of_Dep(2) AS e
JOIN   tblWorksOn w ON w.empSSN = e.empSSN
WHERE  w.workHours &gt;= 20
ORDER BY e.empName, w.proNum;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>55000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>proNum</th><th>workHours</th></tr></thead>
<tbody>
<tr><td>Đặng Tuấn Anh</td><td>4</td><td>20.0</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>3</td><td>30.0</td></tr>
<tr><td>Mai Duy An</td><td>2</td><td>20.0</td></tr>
<tr><td>Mai Duy An</td><td>3</td><td>25.0</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>4</td><td>30.0</td></tr>
</tbody>
</table>
<ul>
<li>Không có BEGIN…END và không khai báo cột: các cột của bảng chính là các cột của câu SELECT.</li>
<li>Câu truy vấn thứ hai cho thấy sức mạnh của nó: kết quả của hàm được <strong>join</strong> với tblWorksOn và lọc như mọi bảng khác.</li>
<li>Gọi trong FROM thì tiền tố <code>dbo.</code> là tuỳ chọn (chỉ bắt buộc với hàm vô hướng).</li>
</ul>
<p class="meo">🧠 View không nhận tham số; hàm inline thì nhận được. SQL Server "trải" nó vào câu truy vấn ngoài giống như view, nên nó nhanh — loại hàm tốt nhất cho bài PE và khi đi làm.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>: <code>RETURNS TABLE (cột kiểu, …)</code> — phải khai báo các cột — với thân viết bằng <code>LANGUAGE sql</code>:
<pre><code class="language-sql">CREATE FUNCTION fn_employees_of_dep(p_dep_num INT)
RETURNS TABLE (emp_ssn NUMERIC, emp_name VARCHAR, emp_salary NUMERIC)   -- phải liệt kê cột
LANGUAGE sql
AS $$
    SELECT empSSN, empName, empSalary FROM tblEmployee WHERE depNum = p_dep_num;
$$;
SELECT * FROM fn_employees_of_dep(2) ORDER BY emp_salary DESC;</code></pre>
<table>
<thead><tr><th>emp_ssn</th><th>emp_name</th><th>emp_salary</th></tr></thead>
<tbody>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>55000</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-3-view">PostgreSQL 12.3 — view</a>.</div>`],
      [34, 'Multi-Statement Table Valued Function',
        `<p class="y-chinh">🎯 A multi-statement table-valued function declares a table variable in RETURNS @t TABLE (columns), fills it with several statements inside BEGIN…END, and ends with a bare RETURN.</p>
<p>Demo (the slide says "//demo"): a department report built in two steps — count the employees, then add a note computed from that count.</p>
<pre><code class="language-sql">-- Multi-statement table-valued function: fill a table variable step by step, then RETURN
GO
CREATE FUNCTION fn_Dep_Report ()
RETURNS @report TABLE (depNum INT, depName NVARCHAR(50), numEmp INT, note NVARCHAR(40))
AS
BEGIN
    -- step 1: one row per department with its head count
    INSERT INTO @report (depNum, depName, numEmp)
    SELECT d.depNum, d.depName, COUNT(e.empSSN)
    FROM tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum
    GROUP BY d.depNum, d.depName
    -- step 2: add a note computed from step 1
    UPDATE @report SET note = CASE WHEN numEmp &gt;= 4 THEN N'phòng lớn' ELSE N'phòng nhỏ' END
    RETURN
END
GO
SELECT * FROM dbo.fn_Dep_Report() ORDER BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>numEmp</th><th>note</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>4</td><td>phòng lớn</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>4</td><td>phòng lớn</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>3</td><td>phòng nhỏ</td></tr>
<tr><td>4</td><td>Phòng Hành chính</td><td>1</td><td>phòng nhỏ</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td><td>2</td><td>phòng nhỏ</td></tr>
</tbody>
</table>
<ul>
<li><code>RETURNS @report TABLE (depNum INT, …)</code> — the shape of the result is declared, like a CREATE TABLE.</li>
<li>Inside, you may INSERT, UPDATE, DELETE <strong>the table variable</strong> (@report) — never a real table: a function must not change the database.</li>
<li><code>RETURN</code> alone at the end sends @report back. <code>WITH FunctionAttribute</code> on the slide is optional (e.g. <code>WITH SCHEMABINDING</code>).</li>
</ul>
<p>Trying to change a real table inside a function is refused as soon as the function is created:</p>
<pre><code class="language-sql">-- A function may not change a real table
GO
CREATE FUNCTION fn_Bad (@depNum INT)
RETURNS @t TABLE (n INT)
AS
BEGIN
    DELETE FROM tblDepLocation WHERE depNum = @depNum
    RETURN
END</code></pre>
<div class="out"><b>Msg 443, Level 16, State 15<br>
Invalid use of a side-effecting operator 'DELETE' within a function.</b></div>
<div class="pitfall">Use a multi-statement function only when one SELECT is not enough: SQL Server cannot look inside it to optimise (it guesses a row count), so the same logic as an inline function is usually faster. Need to change data? That is a procedure's job.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the same job is a <code>RETURNS TABLE</code> function in <code>plpgsql</code> that adds rows one by one with <code>RETURN NEXT</code> (or a whole query with <code>RETURN QUERY</code>):
<pre><code class="language-sql">CREATE FUNCTION fn_dep_report()
RETURNS TABLE (dep_num INT, dep_name VARCHAR, num_emp BIGINT, note TEXT)
LANGUAGE plpgsql
AS $$
DECLARE r RECORD;
BEGIN
    FOR r IN SELECT d.depNum, d.depName, COUNT(e.empSSN) AS n
             FROM tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum
             GROUP BY d.depNum, d.depName LOOP
        dep_num := r.depNum; dep_name := r.depName; num_emp := r.n;
        note := CASE WHEN r.n &gt;= 4 THEN 'phòng lớn' ELSE 'phòng nhỏ' END;
        RETURN NEXT;                       -- add the current values as one output row
    END LOOP;
END $$;
SELECT * FROM fn_dep_report() ORDER BY dep_num;</code></pre>
<table>
<thead><tr><th>dep_num</th><th>dep_name</th><th>num_emp</th><th>note</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>4</td><td>phòng lớn</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>4</td><td>phòng lớn</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>3</td><td>phòng nhỏ</td></tr>
<tr><td>4</td><td>Phòng Hành chính</td><td>1</td><td>phòng nhỏ</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td><td>2</td><td>phòng nhỏ</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions</a>.</div>`,
        `<p class="y-chinh">🎯 Hàm trả bảng nhiều câu lệnh (multi-statement table-valued function) khai báo một biến bảng trong RETURNS @t TABLE (các cột), đổ dữ liệu vào nó bằng nhiều câu lệnh trong BEGIN…END, và kết thúc bằng một chữ RETURN trơn.</p>
<p>Demo (slide ghi "//demo"): báo cáo phòng ban dựng qua hai bước — đếm nhân viên, rồi thêm ghi chú tính từ con số đó.</p>
<pre><code class="language-sql">-- Hàm trả về bảng nhiều câu lệnh: đổ dần vào một biến bảng, rồi RETURN
GO
CREATE FUNCTION fn_Dep_Report ()
RETURNS @report TABLE (depNum INT, depName NVARCHAR(50), numEmp INT, note NVARCHAR(40))
AS
BEGIN
    -- bước 1: mỗi phòng một dòng kèm số nhân viên
    INSERT INTO @report (depNum, depName, numEmp)
    SELECT d.depNum, d.depName, COUNT(e.empSSN)
    FROM tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum
    GROUP BY d.depNum, d.depName
    -- bước 2: thêm ghi chú tính từ kết quả bước 1
    UPDATE @report SET note = CASE WHEN numEmp &gt;= 4 THEN N'phòng lớn' ELSE N'phòng nhỏ' END
    RETURN
END
GO
SELECT * FROM dbo.fn_Dep_Report() ORDER BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>numEmp</th><th>note</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>4</td><td>phòng lớn</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>4</td><td>phòng lớn</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>3</td><td>phòng nhỏ</td></tr>
<tr><td>4</td><td>Phòng Hành chính</td><td>1</td><td>phòng nhỏ</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td><td>2</td><td>phòng nhỏ</td></tr>
</tbody>
</table>
<ul>
<li><code>RETURNS @report TABLE (depNum INT, …)</code> — hình dạng của kết quả được khai báo trước, giống một câu CREATE TABLE.</li>
<li>Bên trong bạn được INSERT, UPDATE, DELETE <strong>biến bảng</strong> (@report) — không bao giờ được sửa bảng thật: hàm không được làm thay đổi CSDL.</li>
<li>Chữ <code>RETURN</code> trơn ở cuối gửi @report trở về. <code>WITH FunctionAttribute</code> trên slide là tuỳ chọn (ví dụ <code>WITH SCHEMABINDING</code>).</li>
</ul>
<p>Thử sửa một bảng thật trong hàm thì bị từ chối ngay lúc tạo hàm (Msg 443 — dùng sai toán tử có tác dụng phụ):</p>
<pre><code class="language-sql">-- Hàm không được sửa bảng thật
GO
CREATE FUNCTION fn_Bad (@depNum INT)
RETURNS @t TABLE (n INT)
AS
BEGIN
    DELETE FROM tblDepLocation WHERE depNum = @depNum
    RETURN
END</code></pre>
<div class="out"><b>Msg 443, Level 16, State 15<br>
Invalid use of a side-effecting operator 'DELETE' within a function.</b></div>
<div class="pitfall">Chỉ dùng hàm nhiều câu lệnh khi một câu SELECT không đủ: SQL Server không nhìn vào bên trong nó để tối ưu (nó đoán số dòng), nên cùng logic viết bằng hàm inline thường nhanh hơn. Cần sửa dữ liệu? Đó là việc của thủ tục.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> cùng việc đó là một hàm <code>RETURNS TABLE</code> viết bằng <code>plpgsql</code>, thêm từng dòng bằng <code>RETURN NEXT</code> (hoặc cả một câu truy vấn bằng <code>RETURN QUERY</code>):
<pre><code class="language-sql">CREATE FUNCTION fn_dep_report()
RETURNS TABLE (dep_num INT, dep_name VARCHAR, num_emp BIGINT, note TEXT)
LANGUAGE plpgsql
AS $$
DECLARE r RECORD;
BEGIN
    FOR r IN SELECT d.depNum, d.depName, COUNT(e.empSSN) AS n
             FROM tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum
             GROUP BY d.depNum, d.depName LOOP
        dep_num := r.depNum; dep_name := r.depName; num_emp := r.n;
        note := CASE WHEN r.n &gt;= 4 THEN 'phòng lớn' ELSE 'phòng nhỏ' END;
        RETURN NEXT;                       -- thêm các giá trị hiện tại thành một dòng kết quả
    END LOOP;
END $$;
SELECT * FROM fn_dep_report() ORDER BY dep_num;</code></pre>
<table>
<thead><tr><th>dep_num</th><th>dep_name</th><th>num_emp</th><th>note</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>4</td><td>phòng lớn</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>4</td><td>phòng lớn</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>3</td><td>phòng nhỏ</td></tr>
<tr><td>4</td><td>Phòng Hành chính</td><td>1</td><td>phòng nhỏ</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td><td>2</td><td>phòng nhỏ</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm</a>.</div>`],
    ]),
    bi(`<h3>Procedure or function? Decide in 10 seconds</h3>
<table>
<thead><tr><th>Question</th><th>Procedure</th><th>Function</th></tr></thead>
<tbody>
<tr><td>Must it change data (INSERT/UPDATE/DELETE)?</td><td>yes, allowed</td><td>no, forbidden</td></tr>
<tr><td>Do you want it inside SELECT / WHERE / FROM?</td><td>no — called with EXEC</td><td>yes</td></tr>
<tr><td>How does it give results back?</td><td>result sets, OUTPUT parameters, RETURN code (INT)</td><td>exactly one value or one table</td></tr>
<tr><td>Transactions, TRY…CATCH inside?</td><td>yes</td><td>no</td></tr>
</tbody>
</table>
<p>Older lesson on the same topic: <strong>7.3 — Stored procedures &amp; functions</strong> (a full procedure with TRY…CATCH, return codes and the performance trap of scalar functions).</p>`,
    `<h3>Thủ tục hay hàm? Quyết trong 10 giây</h3>
<table>
<thead><tr><th>Câu hỏi</th><th>Thủ tục (procedure)</th><th>Hàm (function)</th></tr></thead>
<tbody>
<tr><td>Có phải sửa dữ liệu (INSERT/UPDATE/DELETE)?</td><td>có, được phép</td><td>không, bị cấm</td></tr>
<tr><td>Muốn dùng nó trong SELECT / WHERE / FROM?</td><td>không — gọi bằng EXEC</td><td>có</td></tr>
<tr><td>Trả kết quả bằng cách nào?</td><td>tập kết quả, tham số OUTPUT, mã RETURN (INT)</td><td>đúng một giá trị hoặc một bảng</td></tr>
<tr><td>Giao dịch, TRY…CATCH bên trong?</td><td>có</td><td>không</td></tr>
</tbody>
</table>
<p>Bài cũ cùng chủ đề: <strong>7.3 — Thủ tục &amp; hàm lưu trữ</strong> (một thủ tục đầy đủ có TRY…CATCH, mã trả về và cái bẫy hiệu năng của hàm vô hướng).</p>`),
    books([
      ['ullman', 'Ullman &amp; Widom, A First Course in Database Systems — 9.1 (the three-tier architecture), 9.4 (stored procedures in SQL/PSM: creating, invoking, functions)', 'Ullman &amp; Widom, A First Course in Database Systems — 9.1 (kiến trúc ba tầng), 9.4 (thủ tục lưu trữ trong SQL/PSM: tạo, gọi, hàm)'],
      ['ramakrishnan', 'Ramakrishnan &amp; Gehrke, Database Management Systems — 6.5 Stored procedures, 7 (three-tier application architectures)', 'Ramakrishnan &amp; Gehrke, Database Management Systems — 6.5 Thủ tục lưu trữ, 7 (kiến trúc ứng dụng ba tầng)'],
    ]),
  ].join('\n'),
};

/* ───────── 7.C — 📑 Slide by slide · Triggers, inserted/deleted & cursors (Chapter 8, 35–51) ───────── */
const L_dbi9_3 = {
  title: '7.C — 📑 Slide by slide · Triggers, inserted/deleted & cursors (Chapter 8, 35–51)|||7.C — 📑 Học theo từng slide · Trigger, bảng inserted/deleted & cursor (Chapter 8, 35–51)',
  slug: 'dbi202-slide-dbi9-3',
  type: 'VIDEO',
  description: 'Giảng từng slide 35–51 của bộ slide Chapter 8 của trường (trên web là Chương 7): trigger là gì và dùng khi nào (và khi nào KHÔNG), trigger chuẩn SQL (BEFORE/AFTER, OLD/NEW ROW, FOR EACH ROW/STATEMENT, WHEN), trigger T-SQL với RAISERROR, ROLLBACK, bảng inserted/deleted, trigger chặn nhân viên dưới 18 tuổi (và cái bẫy nhiều dòng), cursor từng bước và ba ví dụ trên FUHCompany — mọi trigger/cursor đều chạy thật rồi gọi thử bằng INSERT/UPDATE/DELETE, kèm ô 🐘 hàm trigger PL/pgSQL + CREATE TRIGGER … EXECUTE FUNCTION, NEW/OLD, bảng chuyển tiếp, vòng FOR … IN SELECT chạy thật trên PostgreSQL.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.C · school slides "Chapter 8", slides 35–51</span>
<h2>Triggers and cursors — the deck, slide by slide</h2>
<p class="lead">⚠️ The last part of the school's <strong>"Chapter 8"</strong> deck (web Chapter 7). Two objects that behave very differently from what you wrote so far: code that <strong>nobody calls</strong> (triggers) and code that walks through a result <strong>one row at a time</strong> (cursors).</p>
<div class="callout"><strong>Trigger = a door alarm.</strong> Nobody presses it. It is attached to a door (a table) and listens for one kind of event (someone opens the door = an INSERT, UPDATE or DELETE on the table). When the event happens it wakes up, checks a condition ("is it after 10 pm?") and, if the condition holds, acts (rings, or — in the database — refuses the change, writes a log, updates a total).<br><strong>Cursor = a finger running down a printed list</strong>, one line at a time, doing something with each line. SQL normally works on the whole list at once; a cursor is the exception.</div>
<h3>This part in one table</h3>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>You must be able to</th></tr></thead>
<tbody>
<tr><td>35–37</td><td>what a trigger is, why use it, its features</td><td>explain event – condition – action; row vs statement level</td></tr>
<tr><td>38–39</td><td>a trigger in standard SQL; the design options</td><td>read NetWorthTrigger line by line</td></tr>
<tr><td>40–43</td><td>T-SQL: CREATE TRIGGER, DISABLE/ENABLE, RAISERROR, ROLLBACK</td><td>predict whether the row is stored or not</td></tr>
<tr><td>44–47</td><td>the inserted and deleted tables; the under-18 trigger</td><td>write a trigger that is correct for multi-row statements</td></tr>
<tr><td>48–51</td><td>cursors: DECLARE, OPEN, FETCH, @@FETCH_STATUS, CLOSE, DEALLOCATE</td><td>write the cursor loop; rewrite it without a cursor</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Bài 7.C · slide "Chapter 8" của trường, slide 35–51</span>
<h2>Trigger và cursor — học bộ slide từng trang</h2>
<p class="lead">⚠️ Phần cuối của bộ slide <strong>"Chapter 8"</strong> của trường (Chương 7 trên web). Hai đối tượng cư xử rất khác những gì bạn đã viết: đoạn code <strong>không ai gọi</strong> (trigger) và đoạn code đi qua kết quả <strong>từng dòng một</strong> (cursor).</p>
<div class="callout"><strong>Trigger = chuông báo ở cửa.</strong> Không ai bấm nó. Nó được gắn vào một cánh cửa (một bảng) và lắng nghe một loại sự kiện (có người mở cửa = một lệnh INSERT, UPDATE hoặc DELETE trên bảng). Khi sự kiện xảy ra, nó thức dậy, kiểm một điều kiện ("có phải sau 10 giờ tối không?") và nếu điều kiện đúng thì hành động (kêu lên — hoặc, trong CSDL: từ chối thay đổi, ghi nhật ký, cập nhật một con số tổng).<br><strong>Cursor (con trỏ) = ngón tay dò xuống một tờ danh sách</strong>, mỗi lần một dòng, làm gì đó với từng dòng. SQL bình thường xử lý cả danh sách một lượt; cursor là ngoại lệ.</div>
<h3>Cả phần này trong một bảng</h3>
<table>
<thead><tr><th>Slide</th><th>Ý chính</th><th>Bạn phải làm được</th></tr></thead>
<tbody>
<tr><td>35–37</td><td>trigger là gì, vì sao dùng, các đặc điểm</td><td>giải thích sự kiện – điều kiện – hành động; mức dòng và mức câu lệnh</td></tr>
<tr><td>38–39</td><td>trigger theo chuẩn SQL; các lựa chọn khi thiết kế</td><td>đọc được NetWorthTrigger từng dòng</td></tr>
<tr><td>40–43</td><td>T-SQL: CREATE TRIGGER, DISABLE/ENABLE, RAISERROR, ROLLBACK</td><td>đoán đúng dòng có được lưu hay không</td></tr>
<tr><td>44–47</td><td>bảng inserted và deleted; trigger chặn người dưới 18 tuổi</td><td>viết trigger đúng cả khi một câu lệnh sửa nhiều dòng</td></tr>
<tr><td>48–51</td><td>cursor: DECLARE, OPEN, FETCH, @@FETCH_STATUS, CLOSE, DEALLOCATE</td><td>viết vòng lặp cursor; viết lại không dùng cursor</td></tr>
</tbody>
</table>`),
    walkHead('dbi9', 35, 51),
    walk('dbi9', [
      [35, 'Triggers - how they differ from other constraints',
        `<p class="y-chinh">🎯 A trigger is awakened only when certain events occur (INSERT, UPDATE, DELETE); once awake it tests a condition — if false it does nothing, if true the DBMS performs the trigger's action.</p>
<p>This is the <strong>event – condition – action</strong> (ECA) rule. A CHECK constraint is always the same test on one row; a trigger can look at other tables, compare old and new values, and do anything (write, refuse, compute).</p>
<pre><code class="language-sql">-- The "doorbell": a trigger that wakes up on INSERT into tblDepartment
GO
CREATE TRIGGER Tr_Department_Insert ON tblDepartment
AFTER INSERT
AS
    -- the condition: is the new department name too short?
    IF EXISTS (SELECT * FROM inserted WHERE LEN(depName) &lt; 5)
        PRINT N'Trigger: condition TRUE -&gt; action (warning printed)'
    ELSE
        PRINT N'Trigger: condition FALSE -&gt; nothing to do'
GO
SELECT COUNT(*) AS numDeps FROM tblDepartment;           -- a SELECT is not an event: no trigger
INSERT INTO tblDepartment(depNum, depName) VALUES (6, N'Phòng Kế Toán');
INSERT INTO tblDepartment(depNum, depName) VALUES (7, N'P7');</code></pre>
<table>
<thead><tr><th>numDeps</th></tr></thead>
<tbody>
<tr><td>5</td></tr>
</tbody>
</table>
<div class="out">Trigger: condition FALSE -&gt; nothing to do<br>
(1 row affected)<br>
Trigger: condition TRUE -&gt; action (warning printed)<br>
(1 row affected)</div>
<ul>
<li><code>CREATE TRIGGER Tr_Department_Insert ON tblDepartment AFTER INSERT AS …</code> — attached to the table tblDepartment, event = INSERT, run AFTER the row is written.</li>
<li>The SELECT is not an event: nothing is printed for it. Each INSERT wakes the trigger: "Phòng Kế Toán" ⇒ condition FALSE; "P7" (shorter than 5 characters) ⇒ condition TRUE ⇒ action.</li>
<li><code>inserted</code> inside the trigger holds the new row(s) — slide 44.</li>
</ul>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a trigger is <strong>two objects</strong>: a <em>trigger function</em> (<code>RETURNS trigger</code>, the code) and the <code>CREATE TRIGGER … EXECUTE FUNCTION …</code> that attaches it to a table and an event. <code>NEW</code> is the row being inserted:
<pre><code class="language-sql">-- PostgreSQL: 1) a trigger FUNCTION that holds the code ...
CREATE FUNCTION trg_department_insert() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF length(NEW.depName) &lt; 5 THEN          -- NEW = the row being inserted
        RAISE NOTICE 'Trigger: condition TRUE for % -&gt; action', NEW.depName;
    ELSE
        RAISE NOTICE 'Trigger: condition FALSE for % -&gt; nothing to do', NEW.depName;
    END IF;
    RETURN NULL;                             -- ignored for AFTER triggers
END $$;
-- 2) ... and a TRIGGER that attaches it to the table and the event
CREATE TRIGGER tr_department_insert
AFTER INSERT ON tblDepartment
FOR EACH ROW
EXECUTE FUNCTION trg_department_insert();

INSERT INTO tblDepartment(depNum, depName) VALUES (6, 'Phòng Kế Toán');
INSERT INTO tblDepartment(depNum, depName) VALUES (7, 'P7');</code></pre>
<div class="out">NOTICE:  Trigger: condition FALSE for Phòng Kế Toán -&gt; nothing to do<br>
NOTICE:  Trigger: condition TRUE for P7 -&gt; action<br>
INSERT 0 1<br>
INSERT 0 1</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — triggers</a>.</div>`,
        `<p class="y-chinh">🎯 Trigger chỉ thức dậy khi một số sự kiện xảy ra (INSERT, UPDATE, DELETE); đã thức thì nó kiểm một điều kiện — sai thì không làm gì, đúng thì DBMS thực hiện hành động của trigger.</p>
<p>Đây là luật <strong>sự kiện – điều kiện – hành động</strong> (event – condition – action, ECA). Ràng buộc CHECK luôn là cùng một phép kiểm trên một dòng; trigger thì nhìn được sang bảng khác, so giá trị cũ với giá trị mới, và làm được mọi việc (ghi, từ chối, tính toán).</p>
<pre><code class="language-sql">-- "Chuông cửa": trigger thức dậy khi có INSERT vào tblDepartment
GO
CREATE TRIGGER Tr_Department_Insert ON tblDepartment
AFTER INSERT
AS
    -- điều kiện: tên phòng mới có quá ngắn không?
    IF EXISTS (SELECT * FROM inserted WHERE LEN(depName) &lt; 5)
        PRINT N'Trigger: condition TRUE -&gt; action (warning printed)'
    ELSE
        PRINT N'Trigger: condition FALSE -&gt; nothing to do'
GO
SELECT COUNT(*) AS numDeps FROM tblDepartment;           -- SELECT không phải sự kiện: trigger không chạy
INSERT INTO tblDepartment(depNum, depName) VALUES (6, N'Phòng Kế Toán');
INSERT INTO tblDepartment(depNum, depName) VALUES (7, N'P7');</code></pre>
<table>
<thead><tr><th>numDeps</th></tr></thead>
<tbody>
<tr><td>5</td></tr>
</tbody>
</table>
<div class="out">Trigger: condition FALSE -&gt; nothing to do<br>
(1 row affected)<br>
Trigger: condition TRUE -&gt; action (warning printed)<br>
(1 row affected)</div>
<ul>
<li><code>CREATE TRIGGER Tr_Department_Insert ON tblDepartment AFTER INSERT AS …</code> — gắn vào bảng tblDepartment, sự kiện = INSERT, chạy SAU (AFTER) khi dòng đã được ghi.</li>
<li>Câu SELECT không phải sự kiện: không in gì cho nó. Mỗi INSERT đánh thức trigger: "Phòng Kế Toán" ⇒ điều kiện FALSE; "P7" (ngắn hơn 5 ký tự) ⇒ điều kiện TRUE ⇒ hành động.</li>
<li><code>inserted</code> bên trong trigger chứa (các) dòng mới — slide 44.</li>
</ul>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> một trigger là <strong>hai đối tượng</strong>: một <em>hàm trigger</em> (<code>RETURNS trigger</code>, chứa code) và câu <code>CREATE TRIGGER … EXECUTE FUNCTION …</code> gắn hàm đó vào một bảng và một sự kiện. <code>NEW</code> là dòng đang được chèn. Đi làm bạn sẽ gõ bản này:
<pre><code class="language-sql">-- PostgreSQL: 1) một HÀM trigger chứa đoạn code ...
CREATE FUNCTION trg_department_insert() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF length(NEW.depName) &lt; 5 THEN          -- NEW = dòng đang được chèn
        RAISE NOTICE 'Trigger: condition TRUE for % -&gt; action', NEW.depName;
    ELSE
        RAISE NOTICE 'Trigger: condition FALSE for % -&gt; nothing to do', NEW.depName;
    END IF;
    RETURN NULL;                             -- bị bỏ qua với trigger AFTER
END $$;
-- 2) ... và một TRIGGER gắn hàm đó vào bảng và sự kiện
CREATE TRIGGER tr_department_insert
AFTER INSERT ON tblDepartment
FOR EACH ROW
EXECUTE FUNCTION trg_department_insert();

INSERT INTO tblDepartment(depNum, depName) VALUES (6, 'Phòng Kế Toán');
INSERT INTO tblDepartment(depNum, depName) VALUES (7, 'P7');</code></pre>
<div class="out">NOTICE:  Trigger: condition FALSE for Phòng Kế Toán -&gt; nothing to do<br>
NOTICE:  Trigger: condition TRUE for P7 -&gt; action<br>
INSERT 0 1<br>
INSERT 0 1</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — trigger</a>.</div>`],
      [36, 'Why uses triggers',
        `<p class="y-chinh">🎯 Two reasons: triggers implement business rules (e.g. create a new Order when a customer checks out a shopping cart) and ensure data integrity (e.g. update derived attributes or summary data when the underlying data changes).</p>
<p>Summary data kept correct by a trigger: a table tblDepStat stores the head count of each department, and a trigger on tblEmployee recounts the departments touched by every INSERT, UPDATE, DELETE:</p>
<pre><code class="language-sql">-- Summary data kept up to date by a trigger: the head count of each department
SELECT d.depNum, COUNT(e.empSSN) AS numEmp
INTO   tblDepStat                                    -- creates and fills a new table
FROM   tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum
GROUP BY d.depNum;
SELECT depNum, numEmp AS numEmpBefore FROM tblDepStat ORDER BY depNum;
GO
CREATE TRIGGER Tr_Employee_DepStat ON tblEmployee
AFTER INSERT, DELETE, UPDATE
AS
BEGIN
    SET NOCOUNT ON
    -- recount only the departments touched by this statement (old or new)
    UPDATE s
    SET    numEmp = (SELECT COUNT(*) FROM tblEmployee e WHERE e.depNum = s.depNum)
    FROM   tblDepStat s
    WHERE  s.depNum IN (SELECT depNum FROM inserted UNION SELECT depNum FROM deleted)
END
GO
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050100, N'Ngô Thị Bích', 40000, 4),
       (30121050101, N'Đỗ Văn Cường', 42000, 4);
UPDATE tblEmployee SET depNum = 5 WHERE empSSN = 30121050101;
SELECT depNum, numEmp FROM tblDepStat ORDER BY depNum;</code></pre>
<div class="out">(5 rows affected)</div>
<table>
<thead><tr><th>depNum</th><th>numEmpBefore</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td></tr>
<tr><td>2</td><td>4</td></tr>
<tr><td>3</td><td>3</td></tr>
<tr><td>4</td><td>1</td></tr>
<tr><td>5</td><td>2</td></tr>
</tbody>
</table>
<div class="out">(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>depNum</th><th>numEmp</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td></tr>
<tr><td>2</td><td>4</td></tr>
<tr><td>3</td><td>3</td></tr>
<tr><td>4</td><td>2</td></tr>
<tr><td>5</td><td>3</td></tr>
</tbody>
</table>
<ul>
<li>Before: department 4 has 1 employee, department 5 has 2. Two employees are inserted in 4 ⇒ 3; one of them moves to 5 ⇒ 4 has 2, 5 has 3. Nobody updated tblDepStat by hand.</li>
<li><code>WHERE s.depNum IN (SELECT depNum FROM inserted UNION SELECT depNum FROM deleted)</code> — the departments of the new rows <em>and</em> of the old rows (a move changes two departments).</li>
</ul>
<div class="pitfall"><strong>When NOT to use a trigger in real life.</strong> Triggers are invisible: a colleague runs an UPDATE and three other tables change without him knowing why. They run inside the user's transaction, so a slow trigger makes every INSERT slow. Use a constraint (PK, FK, CHECK) when it can express the rule; put ordinary business steps in a procedure or the application; keep triggers for rules that must hold <em>whoever</em> changes the data (audit log, totals, cross-table rules). Never put e-mail sending or long loops in a trigger.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong>: <code>CREATE TABLE … AS SELECT</code> replaces <code>SELECT … INTO</code>, and a row-level trigger can simply add 1 to the new department and subtract 1 from the old one with NEW/OLD; <code>TG_OP</code> says which event fired:
<pre><code class="language-sql">CREATE TABLE tblDepStat AS                       -- CREATE TABLE ... AS SELECT replaces SELECT ... INTO
SELECT d.depNum, COUNT(e.empSSN) AS numEmp
FROM   tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum
GROUP BY d.depNum;
-- Row level: +1 for the new department, -1 for the old one
CREATE FUNCTION trg_depstat() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        UPDATE tblDepStat SET numEmp = numEmp + 1 WHERE depNum = NEW.depNum;
    END IF;
    IF TG_OP IN ('UPDATE', 'DELETE') THEN
        UPDATE tblDepStat SET numEmp = numEmp - 1 WHERE depNum = OLD.depNum;
    END IF;
    RETURN NULL;
END $$;
CREATE TRIGGER tr_depstat AFTER INSERT OR DELETE OR UPDATE OF depNum ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_depstat();
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050100, 'Ngô Thị Bích', 40000, 4), (30121050101, 'Đỗ Văn Cường', 42000, 4);
UPDATE tblEmployee SET depNum = 5 WHERE empSSN = 30121050101;
SELECT depNum, numEmp FROM tblDepStat ORDER BY depNum;</code></pre>
<div class="out">INSERT 0 2<br>
UPDATE 1</div>
<table>
<thead><tr><th>depnum</th><th>numemp</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td></tr>
<tr><td>2</td><td>4</td></tr>
<tr><td>3</td><td>3</td></tr>
<tr><td>4</td><td>2</td></tr>
<tr><td>5</td><td>3</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — triggers</a>.</div>`,
        `<p class="y-chinh">🎯 Hai lý do: trigger cài đặt luật nghiệp vụ (ví dụ tạo một Đơn hàng mới khi khách thanh toán giỏ hàng) và đảm bảo toàn vẹn dữ liệu (ví dụ cập nhật thuộc tính dẫn xuất hoặc dữ liệu tổng hợp khi dữ liệu gốc thay đổi).</p>
<p>Dữ liệu tổng hợp được trigger giữ đúng: bảng tblDepStat lưu số nhân viên của mỗi phòng, và một trigger trên tblEmployee đếm lại các phòng bị đụng tới sau mỗi INSERT, UPDATE, DELETE:</p>
<pre><code class="language-sql">-- Dữ liệu tổng hợp được trigger giữ đúng: số nhân viên mỗi phòng
SELECT d.depNum, COUNT(e.empSSN) AS numEmp
INTO   tblDepStat                                    -- tạo và đổ dữ liệu vào một bảng mới
FROM   tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum
GROUP BY d.depNum;
SELECT depNum, numEmp AS numEmpBefore FROM tblDepStat ORDER BY depNum;
GO
CREATE TRIGGER Tr_Employee_DepStat ON tblEmployee
AFTER INSERT, DELETE, UPDATE
AS
BEGIN
    SET NOCOUNT ON
    -- chỉ đếm lại những phòng bị câu lệnh này đụng tới (cũ hoặc mới)
    UPDATE s
    SET    numEmp = (SELECT COUNT(*) FROM tblEmployee e WHERE e.depNum = s.depNum)
    FROM   tblDepStat s
    WHERE  s.depNum IN (SELECT depNum FROM inserted UNION SELECT depNum FROM deleted)
END
GO
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050100, N'Ngô Thị Bích', 40000, 4),
       (30121050101, N'Đỗ Văn Cường', 42000, 4);
UPDATE tblEmployee SET depNum = 5 WHERE empSSN = 30121050101;
SELECT depNum, numEmp FROM tblDepStat ORDER BY depNum;</code></pre>
<div class="out">(5 rows affected)</div>
<table>
<thead><tr><th>depNum</th><th>numEmpBefore</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td></tr>
<tr><td>2</td><td>4</td></tr>
<tr><td>3</td><td>3</td></tr>
<tr><td>4</td><td>1</td></tr>
<tr><td>5</td><td>2</td></tr>
</tbody>
</table>
<div class="out">(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>depNum</th><th>numEmp</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td></tr>
<tr><td>2</td><td>4</td></tr>
<tr><td>3</td><td>3</td></tr>
<tr><td>4</td><td>2</td></tr>
<tr><td>5</td><td>3</td></tr>
</tbody>
</table>
<ul>
<li>Trước: phòng 4 có 1 nhân viên, phòng 5 có 2. Chèn hai người vào phòng 4 ⇒ 3; một người chuyển sang phòng 5 ⇒ phòng 4 còn 2, phòng 5 thành 3. Không ai sửa tblDepStat bằng tay.</li>
<li><code>WHERE s.depNum IN (SELECT depNum FROM inserted UNION SELECT depNum FROM deleted)</code> — các phòng của dòng mới <em>và</em> của dòng cũ (chuyển phòng làm đổi hai phòng).</li>
</ul>
<div class="pitfall"><strong>Khi nào KHÔNG nên dùng trigger ngoài đời.</strong> Trigger vô hình: đồng nghiệp chạy một câu UPDATE và ba bảng khác thay đổi mà anh ta không biết vì sao. Nó chạy bên trong giao dịch của người dùng, nên trigger chậm làm mọi INSERT chậm theo. Luật nào diễn đạt được bằng ràng buộc (PK, FK, CHECK) thì dùng ràng buộc; các bước nghiệp vụ bình thường đặt trong thủ tục hoặc ở tầng ứng dụng; chỉ giữ trigger cho luật phải đúng <em>bất kể ai</em> sửa dữ liệu (nhật ký kiểm toán, con số tổng, luật liên bảng). Đừng bao giờ gửi email hay chạy vòng lặp dài trong trigger.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>: <code>CREATE TABLE … AS SELECT</code> thay cho <code>SELECT … INTO</code>, và trigger mức dòng chỉ cần cộng 1 cho phòng mới, trừ 1 cho phòng cũ bằng NEW/OLD; <code>TG_OP</code> cho biết sự kiện nào kích hoạt:
<pre><code class="language-sql">CREATE TABLE tblDepStat AS                       -- CREATE TABLE ... AS SELECT thay cho SELECT ... INTO
SELECT d.depNum, COUNT(e.empSSN) AS numEmp
FROM   tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum
GROUP BY d.depNum;
-- Mức dòng: +1 cho phòng mới, -1 cho phòng cũ
CREATE FUNCTION trg_depstat() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        UPDATE tblDepStat SET numEmp = numEmp + 1 WHERE depNum = NEW.depNum;
    END IF;
    IF TG_OP IN ('UPDATE', 'DELETE') THEN
        UPDATE tblDepStat SET numEmp = numEmp - 1 WHERE depNum = OLD.depNum;
    END IF;
    RETURN NULL;
END $$;
CREATE TRIGGER tr_depstat AFTER INSERT OR DELETE OR UPDATE OF depNum ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_depstat();
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050100, 'Ngô Thị Bích', 40000, 4), (30121050101, 'Đỗ Văn Cường', 42000, 4);
UPDATE tblEmployee SET depNum = 5 WHERE empSSN = 30121050101;
SELECT depNum, numEmp FROM tblDepStat ORDER BY depNum;</code></pre>
<div class="out">INSERT 0 2<br>
UPDATE 1</div>
<table>
<thead><tr><th>depnum</th><th>numemp</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td></tr>
<tr><td>2</td><td>4</td></tr>
<tr><td>3</td><td>3</td></tr>
<tr><td>4</td><td>2</td></tr>
<tr><td>5</td><td>3</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — trigger</a>.</div>`],
      [37, 'Triggers in SQL - principle features',
        `<p class="y-chinh">🎯 Four features: the condition and action may run on the database state before or after the event; they can refer to old and/or new values of the changed rows; an update event can be limited to some attributes; and a trigger runs either once per modified row or once per statement.</p>
<table>
<thead><tr><th>Feature (standard)</th><th>T-SQL (SQL Server)</th><th>PostgreSQL</th></tr></thead>
<tbody>
<tr><td>before / after the event</td><td>AFTER (also INSTEAD OF); no BEFORE</td><td>BEFORE, AFTER, INSTEAD OF (views)</td></tr>
<tr><td>old / new values</td><td>tables deleted / inserted</td><td>OLD / NEW (row), OLD TABLE / NEW TABLE (statement)</td></tr>
<tr><td>limited to some attributes</td><td><code>IF UPDATE(col)</code> inside the body</td><td><code>UPDATE OF col</code> in the header</td></tr>
<tr><td>once per row / per statement</td><td>always once per <strong>statement</strong></td><td><code>FOR EACH ROW</code> or <code>FOR EACH STATEMENT</code></td></tr>
</tbody>
</table>
<p>T-SQL, one UPDATE of 4 rows:</p>
<pre><code class="language-sql">-- T-SQL triggers are STATEMENT-level: one UPDATE of 4 rows = the trigger runs ONCE
GO
CREATE TRIGGER Tr_Employee_Salary ON tblEmployee
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON
    DECLARE @n INT = (SELECT COUNT(*) FROM inserted)
    IF UPDATE(empSalary)          -- only when the column empSalary is in the SET list
        PRINT N'Trigger ran once; rows in inserted = ' + CAST(@n AS VARCHAR)
    ELSE
        PRINT N'Trigger ran, but empSalary was not updated'
END
GO
UPDATE tblEmployee SET empSalary = empSalary + 1000 WHERE depNum = 1;   -- 4 rows
UPDATE tblEmployee SET empAddress = N'Hà Nội' WHERE empSSN = 30121050021;</code></pre>
<div class="out">Trigger ran once; rows in inserted = 4<br>
(4 rows affected)<br>
Trigger ran, but empSalary was not updated<br>
(1 row affected)</div>
<p>The trigger ran <strong>once</strong>, and <code>inserted</code> held 4 rows. The second UPDATE did not touch empSalary, so <code>IF UPDATE(empSalary)</code> is FALSE.</p>
<p class="meo">🧠 In T-SQL, always imagine <code>inserted</code> as a table with 0, 1 or many rows — never as "the row".</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> you choose: the ROW trigger below runs 4 times (once per employee, with OLD and NEW), the STATEMENT trigger once; <code>UPDATE OF empSalary</code> keeps both silent for the second UPDATE:
<pre><code class="language-sql">CREATE FUNCTION trg_log_row() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE NOTICE 'ROW trigger: % salary % -&gt; %', NEW.empName, OLD.empSalary, NEW.empSalary;
    RETURN NULL;
END $$;
CREATE FUNCTION trg_log_statement() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE NOTICE 'STATEMENT trigger: ran once';
    RETURN NULL;
END $$;
-- UPDATE OF empSalary: only when that column is in the SET list (like IF UPDATE(col))
CREATE TRIGGER tr_row  AFTER UPDATE OF empSalary ON tblEmployee FOR EACH ROW       EXECUTE FUNCTION trg_log_row();
CREATE TRIGGER tr_stmt AFTER UPDATE OF empSalary ON tblEmployee FOR EACH STATEMENT EXECUTE FUNCTION trg_log_statement();
UPDATE tblEmployee SET empSalary = empSalary + 1000 WHERE depNum = 1;   -- 4 rows
UPDATE tblEmployee SET empAddress = 'Hà Nội' WHERE empSSN = 30121050021; -- salary not in SET: no trigger</code></pre>
<div class="out">NOTICE:  ROW trigger: Trần Minh Quang salary 150000 -&gt; 151000<br>
NOTICE:  ROW trigger: Hoàng Thị Hà salary 90000 -&gt; 91000<br>
NOTICE:  ROW trigger: Võ Việt Anh salary 60000 -&gt; 61000<br>
NOTICE:  ROW trigger: Lê Thị Lan Anh salary 45000 -&gt; 46000<br>
NOTICE:  STATEMENT trigger: ran once<br>
UPDATE 4<br>
UPDATE 1</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — triggers</a>.</div>`,
        `<p class="y-chinh">🎯 Bốn đặc điểm: điều kiện và hành động có thể chạy trên trạng thái CSDL trước hoặc sau sự kiện; chúng tham chiếu được giá trị cũ và/hoặc mới của các dòng bị đổi; sự kiện UPDATE có thể giới hạn vào một số thuộc tính; và trigger chạy hoặc mỗi dòng bị sửa một lần, hoặc mỗi câu lệnh một lần.</p>
<table>
<thead><tr><th>Đặc điểm (chuẩn)</th><th>T-SQL (SQL Server)</th><th>PostgreSQL</th></tr></thead>
<tbody>
<tr><td>trước / sau sự kiện</td><td>AFTER (và INSTEAD OF); không có BEFORE</td><td>BEFORE, AFTER, INSTEAD OF (cho view)</td></tr>
<tr><td>giá trị cũ / mới</td><td>bảng deleted / inserted</td><td>OLD / NEW (một dòng), OLD TABLE / NEW TABLE (mức câu lệnh)</td></tr>
<tr><td>giới hạn vào vài thuộc tính</td><td><code>IF UPDATE(cột)</code> trong thân</td><td><code>UPDATE OF cột</code> ở phần đầu</td></tr>
<tr><td>mỗi dòng / mỗi câu lệnh</td><td>luôn mỗi <strong>câu lệnh</strong> một lần</td><td><code>FOR EACH ROW</code> hoặc <code>FOR EACH STATEMENT</code></td></tr>
</tbody>
</table>
<p>T-SQL, một câu UPDATE sửa 4 dòng:</p>
<pre><code class="language-sql">-- Trigger T-SQL chạy MỨC CÂU LỆNH: một UPDATE sửa 4 dòng = trigger chạy MỘT lần
GO
CREATE TRIGGER Tr_Employee_Salary ON tblEmployee
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON
    DECLARE @n INT = (SELECT COUNT(*) FROM inserted)
    IF UPDATE(empSalary)          -- chỉ khi cột empSalary có trong danh sách SET
        PRINT N'Trigger ran once; rows in inserted = ' + CAST(@n AS VARCHAR)
    ELSE
        PRINT N'Trigger ran, but empSalary was not updated'
END
GO
UPDATE tblEmployee SET empSalary = empSalary + 1000 WHERE depNum = 1;   -- 4 dòng
UPDATE tblEmployee SET empAddress = N'Hà Nội' WHERE empSSN = 30121050021;</code></pre>
<div class="out">Trigger ran once; rows in inserted = 4<br>
(4 rows affected)<br>
Trigger ran, but empSalary was not updated<br>
(1 row affected)</div>
<p>Trigger chạy <strong>một lần</strong>, và <code>inserted</code> chứa 4 dòng. Câu UPDATE thứ hai không đụng tới empSalary, nên <code>IF UPDATE(empSalary)</code> là FALSE.</p>
<p class="meo">🧠 Trong T-SQL, luôn hình dung <code>inserted</code> là một bảng có 0, 1 hoặc nhiều dòng — đừng bao giờ coi nó là "cái dòng".</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> bạn được chọn: trigger ROW dưới đây chạy 4 lần (mỗi nhân viên một lần, có OLD và NEW), trigger STATEMENT chạy một lần; <code>UPDATE OF empSalary</code> giữ cả hai im lặng với câu UPDATE thứ hai:
<pre><code class="language-sql">CREATE FUNCTION trg_log_row() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE NOTICE 'ROW trigger: % salary % -&gt; %', NEW.empName, OLD.empSalary, NEW.empSalary;
    RETURN NULL;
END $$;
CREATE FUNCTION trg_log_statement() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE NOTICE 'STATEMENT trigger: ran once';
    RETURN NULL;
END $$;
-- UPDATE OF empSalary: chỉ khi cột đó có trong SET (như IF UPDATE(cột))
CREATE TRIGGER tr_row  AFTER UPDATE OF empSalary ON tblEmployee FOR EACH ROW       EXECUTE FUNCTION trg_log_row();
CREATE TRIGGER tr_stmt AFTER UPDATE OF empSalary ON tblEmployee FOR EACH STATEMENT EXECUTE FUNCTION trg_log_statement();
UPDATE tblEmployee SET empSalary = empSalary + 1000 WHERE depNum = 1;   -- 4 dòng
UPDATE tblEmployee SET empAddress = 'Hà Nội' WHERE empSSN = 30121050021; -- lương không có trong SET: không trigger nào</code></pre>
<div class="out">NOTICE:  ROW trigger: Trần Minh Quang salary 150000 -&gt; 151000<br>
NOTICE:  ROW trigger: Hoàng Thị Hà salary 90000 -&gt; 91000<br>
NOTICE:  ROW trigger: Võ Việt Anh salary 60000 -&gt; 61000<br>
NOTICE:  ROW trigger: Lê Thị Lan Anh salary 45000 -&gt; 46000<br>
NOTICE:  STATEMENT trigger: ran once<br>
UPDATE 4<br>
UPDATE 1</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — trigger</a>.</div>`],
      [38, 'Triggers in SQL (standard) - NetWorthTrigger',
        `<p class="y-chinh">🎯 The textbook's trigger in standard SQL: whenever an update lowers a movie executive's net worth, put the old value back.</p>
<pre><code class="language-plaintext">CREATE TRIGGER NetWorthTrigger
AFTER UPDATE OF netWorth ON MovieExec      -- event: an UPDATE of the column netWorth
REFERENCING
    OLD ROW AS OldTuple,                   -- name for the row before the update
    NEW ROW AS NewTuple                    -- name for the row after the update
FOR EACH ROW                               -- run once for every updated row
WHEN (OldTuple.netWorth &gt; NewTuple.netWorth)   -- condition: the value went down
    UPDATE MovieExec                       -- action: restore the old value
    SET netWorth = OldTuple.netWorth
    WHERE cert# = NewTuple.cert#;</code></pre>
<p>SQL Server accepts none of REFERENCING, FOR EACH ROW or WHEN. The same rule in T-SQL joins <code>deleted</code> (the old rows) with <code>inserted</code> (the new rows) on the key:</p>
<pre><code class="language-sql">-- The textbook table (Ullman &amp; Widom): MovieExec(name, address, cert#, netWorth)
CREATE TABLE MovieExec (
    name     NVARCHAR(30),
    address  NVARCHAR(50),
    [cert#]  INT PRIMARY KEY,
    netWorth DECIMAL(12,0)
);
INSERT INTO MovieExec VALUES (N'George Lucas', N'Marin County', 1, 5000000),
                             (N'Steven Spielberg', N'Los Angeles', 2, 4000000);
GO
-- T-SQL has no REFERENCING / FOR EACH ROW / WHEN: join deleted (old) and inserted (new)
CREATE TRIGGER NetWorthTrigger ON MovieExec
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON
    UPDATE m
    SET    m.netWorth = d.netWorth                         -- put the OLD value back
    FROM   MovieExec m
    JOIN   deleted  d ON d.[cert#] = m.[cert#]
    JOIN   inserted i ON i.[cert#] = m.[cert#]
    WHERE  d.netWorth &gt; i.netWorth                         -- = WHEN (OldTuple.netWorth &gt; NewTuple.netWorth)
END
GO
UPDATE MovieExec SET netWorth = 1000;                      -- tries to LOWER both
UPDATE MovieExec SET netWorth = 4500000 WHERE [cert#] = 2; -- a RAISE is allowed
SELECT name, [cert#], netWorth FROM MovieExec ORDER BY [cert#];</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>name</th><th>cert#</th><th>netWorth</th></tr></thead>
<tbody>
<tr><td>George Lucas</td><td>1</td><td>5000000</td></tr>
<tr><td>Steven Spielberg</td><td>2</td><td>4500000</td></tr>
</tbody>
</table>
<p>The first UPDATE tries to lower both to 1000 — both are put back. The second raises Spielberg to 4 500 000 — allowed, the condition is FALSE.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the standard trigger is written almost word for word (FOR EACH ROW, WHEN (OLD… > NEW…)); <code>#</code> is not allowed in a plain name, so the column is <code>cert</code>:
<pre><code class="language-sql">CREATE TABLE MovieExec (name VARCHAR(30), address VARCHAR(50), cert INT PRIMARY KEY, netWorth NUMERIC(12,0));
INSERT INTO MovieExec VALUES ('George Lucas', 'Marin County', 1, 5000000),
                             ('Steven Spielberg', 'Los Angeles', 2, 4000000);
-- Almost the standard of the slide: FOR EACH ROW, WHEN (OLD... &gt; NEW...)
CREATE FUNCTION networth_fn() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    UPDATE MovieExec SET netWorth = OLD.netWorth WHERE cert = NEW.cert;
    RETURN NULL;
END $$;
CREATE TRIGGER NetWorthTrigger
AFTER UPDATE OF netWorth ON MovieExec
FOR EACH ROW
WHEN (OLD.netWorth &gt; NEW.netWorth)
EXECUTE FUNCTION networth_fn();
UPDATE MovieExec SET netWorth = 1000;
UPDATE MovieExec SET netWorth = 4500000 WHERE cert = 2;
SELECT name, cert, netWorth FROM MovieExec ORDER BY cert;</code></pre>
<div class="out">INSERT 0 2<br>
UPDATE 2<br>
UPDATE 1</div>
<table>
<thead><tr><th>name</th><th>cert</th><th>networth</th></tr></thead>
<tbody>
<tr><td>George Lucas</td><td>1</td><td>5000000</td></tr>
<tr><td>Steven Spielberg</td><td>2</td><td>4500000</td></tr>
</tbody>
</table>
The natural PostgreSQL way is even shorter: a <strong>BEFORE</strong> trigger changes <code>NEW</code> before the row is written, so no second UPDATE is needed:
<pre><code class="language-sql">CREATE TABLE MovieExec (name VARCHAR(30), address VARCHAR(50), cert INT PRIMARY KEY, netWorth NUMERIC(12,0));
INSERT INTO MovieExec VALUES ('George Lucas', 'Marin County', 1, 5000000),
                             ('Steven Spielberg', 'Los Angeles', 2, 4000000);
-- The PostgreSQL way: a BEFORE trigger simply changes NEW before it is written (no second UPDATE)
CREATE FUNCTION networth_keep() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    NEW.netWorth := OLD.netWorth;
    RETURN NEW;                  -- the row that will really be stored
END $$;
CREATE TRIGGER NetWorthKeep
BEFORE UPDATE OF netWorth ON MovieExec
FOR EACH ROW
WHEN (OLD.netWorth &gt; NEW.netWorth)
EXECUTE FUNCTION networth_keep();
UPDATE MovieExec SET netWorth = 1000;
SELECT name, cert, netWorth FROM MovieExec ORDER BY cert;</code></pre>
<div class="out">INSERT 0 2<br>
UPDATE 2</div>
<table>
<thead><tr><th>name</th><th>cert</th><th>networth</th></tr></thead>
<tbody>
<tr><td>George Lucas</td><td>1</td><td>5000000</td></tr>
<tr><td>Steven Spielberg</td><td>2</td><td>4000000</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — triggers</a>.</div>`,
        `<p class="y-chinh">🎯 Trigger trong giáo trình, viết theo chuẩn SQL: mỗi khi một lệnh UPDATE làm giảm tài sản (net worth) của một nhà điều hành phim thì đặt lại giá trị cũ.</p>
<pre><code class="language-plaintext">CREATE TRIGGER NetWorthTrigger
AFTER UPDATE OF netWorth ON MovieExec      -- sự kiện: UPDATE cột netWorth
REFERENCING
    OLD ROW AS OldTuple,                   -- tên cho dòng trước khi sửa
    NEW ROW AS NewTuple                    -- tên cho dòng sau khi sửa
FOR EACH ROW                               -- chạy một lần cho mỗi dòng bị sửa
WHEN (OldTuple.netWorth &gt; NewTuple.netWorth)   -- điều kiện: giá trị bị giảm
    UPDATE MovieExec                       -- hành động: đặt lại giá trị cũ
    SET netWorth = OldTuple.netWorth
    WHERE cert# = NewTuple.cert#;</code></pre>
<p>SQL Server không nhận REFERENCING, FOR EACH ROW hay WHEN. Cùng luật đó trong T-SQL nối <code>deleted</code> (các dòng cũ) với <code>inserted</code> (các dòng mới) theo khoá:</p>
<pre><code class="language-sql">-- Bảng trong giáo trình (Ullman &amp; Widom): MovieExec(name, address, cert#, netWorth)
CREATE TABLE MovieExec (
    name     NVARCHAR(30),
    address  NVARCHAR(50),
    [cert#]  INT PRIMARY KEY,
    netWorth DECIMAL(12,0)
);
INSERT INTO MovieExec VALUES (N'George Lucas', N'Marin County', 1, 5000000),
                             (N'Steven Spielberg', N'Los Angeles', 2, 4000000);
GO
-- T-SQL không có REFERENCING / FOR EACH ROW / WHEN: nối deleted (cũ) với inserted (mới)
CREATE TRIGGER NetWorthTrigger ON MovieExec
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON
    UPDATE m
    SET    m.netWorth = d.netWorth                         -- đặt lại giá trị CŨ
    FROM   MovieExec m
    JOIN   deleted  d ON d.[cert#] = m.[cert#]
    JOIN   inserted i ON i.[cert#] = m.[cert#]
    WHERE  d.netWorth &gt; i.netWorth                         -- = WHEN (OldTuple.netWorth &gt; NewTuple.netWorth)
END
GO
UPDATE MovieExec SET netWorth = 1000;                      -- cố GIẢM cả hai
UPDATE MovieExec SET netWorth = 4500000 WHERE [cert#] = 2; -- TĂNG thì được
SELECT name, [cert#], netWorth FROM MovieExec ORDER BY [cert#];</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>name</th><th>cert#</th><th>netWorth</th></tr></thead>
<tbody>
<tr><td>George Lucas</td><td>1</td><td>5000000</td></tr>
<tr><td>Steven Spielberg</td><td>2</td><td>4500000</td></tr>
</tbody>
</table>
<p>Câu UPDATE đầu cố hạ cả hai xuống 1000 — cả hai được đặt lại. Câu thứ hai nâng Spielberg lên 4 500 000 — được phép, điều kiện là FALSE.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> trigger chuẩn được viết gần như từng chữ (FOR EACH ROW, WHEN (OLD… > NEW…)); tên thường không được chứa <code>#</code>, nên cột là <code>cert</code>:
<pre><code class="language-sql">CREATE TABLE MovieExec (name VARCHAR(30), address VARCHAR(50), cert INT PRIMARY KEY, netWorth NUMERIC(12,0));
INSERT INTO MovieExec VALUES ('George Lucas', 'Marin County', 1, 5000000),
                             ('Steven Spielberg', 'Los Angeles', 2, 4000000);
-- Gần y chuẩn trên slide: FOR EACH ROW, WHEN (OLD... &gt; NEW...)
CREATE FUNCTION networth_fn() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    UPDATE MovieExec SET netWorth = OLD.netWorth WHERE cert = NEW.cert;
    RETURN NULL;
END $$;
CREATE TRIGGER NetWorthTrigger
AFTER UPDATE OF netWorth ON MovieExec
FOR EACH ROW
WHEN (OLD.netWorth &gt; NEW.netWorth)
EXECUTE FUNCTION networth_fn();
UPDATE MovieExec SET netWorth = 1000;
UPDATE MovieExec SET netWorth = 4500000 WHERE cert = 2;
SELECT name, cert, netWorth FROM MovieExec ORDER BY cert;</code></pre>
<div class="out">INSERT 0 2<br>
UPDATE 2<br>
UPDATE 1</div>
<table>
<thead><tr><th>name</th><th>cert</th><th>networth</th></tr></thead>
<tbody>
<tr><td>George Lucas</td><td>1</td><td>5000000</td></tr>
<tr><td>Steven Spielberg</td><td>2</td><td>4500000</td></tr>
</tbody>
</table>
Cách tự nhiên của PostgreSQL còn ngắn hơn: trigger <strong>BEFORE</strong> sửa <code>NEW</code> trước khi dòng được ghi, nên không cần UPDATE lần hai:
<pre><code class="language-sql">CREATE TABLE MovieExec (name VARCHAR(30), address VARCHAR(50), cert INT PRIMARY KEY, netWorth NUMERIC(12,0));
INSERT INTO MovieExec VALUES ('George Lucas', 'Marin County', 1, 5000000),
                             ('Steven Spielberg', 'Los Angeles', 2, 4000000);
-- Cách của PostgreSQL: trigger BEFORE sửa luôn NEW trước khi ghi (không cần UPDATE lần hai)
CREATE FUNCTION networth_keep() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    NEW.netWorth := OLD.netWorth;
    RETURN NEW;                  -- dòng sẽ thật sự được lưu
END $$;
CREATE TRIGGER NetWorthKeep
BEFORE UPDATE OF netWorth ON MovieExec
FOR EACH ROW
WHEN (OLD.netWorth &gt; NEW.netWorth)
EXECUTE FUNCTION networth_keep();
UPDATE MovieExec SET netWorth = 1000;
SELECT name, cert, netWorth FROM MovieExec ORDER BY cert;</code></pre>
<div class="out">INSERT 0 2<br>
UPDATE 2</div>
<table>
<thead><tr><th>name</th><th>cert</th><th>networth</th></tr></thead>
<tbody>
<tr><td>George Lucas</td><td>1</td><td>5000000</td></tr>
<tr><td>Steven Spielberg</td><td>2</td><td>4000000</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — trigger</a>.</div>`],
      [39, 'The Options for Trigger Design',
        `<p class="y-chinh">🎯 The choices when designing a trigger: AFTER or BEFORE; UPDATE, INSERT or DELETE; an optional WHEN condition; OLD ROW / NEW ROW names; a single statement or BEGIN … END; FOR EACH ROW or FOR EACH STATEMENT.</p>
<table>
<thead><tr><th>Choice</th><th>Standard (slide)</th><th>T-SQL</th><th>PostgreSQL</th></tr></thead>
<tbody>
<tr><td>timing</td><td>AFTER / BEFORE</td><td>AFTER, INSTEAD OF</td><td>BEFORE, AFTER, INSTEAD OF</td></tr>
<tr><td>event</td><td>UPDATE [OF cols] / INSERT / DELETE</td><td>INSERT, UPDATE, DELETE (several in one trigger)</td><td>INSERT OR UPDATE [OF cols] OR DELETE (also TRUNCATE)</td></tr>
<tr><td>condition</td><td>WHEN (…)</td><td>IF … inside the body</td><td>WHEN (…) in the header</td></tr>
<tr><td>old/new</td><td>OLD ROW / NEW ROW (/ OLD TABLE / NEW TABLE)</td><td>deleted / inserted</td><td>OLD / NEW, REFERENCING OLD TABLE / NEW TABLE</td></tr>
<tr><td>body</td><td>one statement or BEGIN … END</td><td>T-SQL statements after AS</td><td>a trigger function</td></tr>
<tr><td>granularity</td><td>FOR EACH ROW / FOR EACH STATEMENT</td><td>statement only</td><td>FOR EACH ROW / FOR EACH STATEMENT</td></tr>
</tbody>
</table>
<p class="meo">🧠 Reading an FE question about a standard trigger: find the six parts in this order — timing, event, table, row/statement, WHEN, action. Then play the triggering statement one row at a time.</p>`,
        `<p class="y-chinh">🎯 Các lựa chọn khi thiết kế trigger: AFTER hay BEFORE; UPDATE, INSERT hay DELETE; điều kiện WHEN tuỳ chọn; tên OLD ROW / NEW ROW; một câu lệnh hay BEGIN … END; FOR EACH ROW hay FOR EACH STATEMENT.</p>
<table>
<thead><tr><th>Lựa chọn</th><th>Chuẩn (slide)</th><th>T-SQL</th><th>PostgreSQL</th></tr></thead>
<tbody>
<tr><td>thời điểm</td><td>AFTER / BEFORE</td><td>AFTER, INSTEAD OF</td><td>BEFORE, AFTER, INSTEAD OF</td></tr>
<tr><td>sự kiện</td><td>UPDATE [OF cột] / INSERT / DELETE</td><td>INSERT, UPDATE, DELETE (nhiều cái trong một trigger)</td><td>INSERT OR UPDATE [OF cột] OR DELETE (và TRUNCATE)</td></tr>
<tr><td>điều kiện</td><td>WHEN (…)</td><td>IF … trong thân</td><td>WHEN (…) ở phần đầu</td></tr>
<tr><td>cũ/mới</td><td>OLD ROW / NEW ROW (/ OLD TABLE / NEW TABLE)</td><td>deleted / inserted</td><td>OLD / NEW, REFERENCING OLD TABLE / NEW TABLE</td></tr>
<tr><td>thân</td><td>một câu lệnh hoặc BEGIN … END</td><td>các câu T-SQL sau AS</td><td>một hàm trigger</td></tr>
<tr><td>độ mịn</td><td>FOR EACH ROW / FOR EACH STATEMENT</td><td>chỉ mức câu lệnh</td><td>FOR EACH ROW / FOR EACH STATEMENT</td></tr>
</tbody>
</table>
<p class="meo">🧠 Đọc câu FE về trigger chuẩn: tìm sáu phần theo thứ tự — thời điểm, sự kiện, bảng, dòng/câu lệnh, WHEN, hành động. Rồi chạy tay câu lệnh kích hoạt từng dòng một.</p>`],
      [40, 'Implement Trigger with T-SQL',
        `<p class="y-chinh">🎯 Section slide (the slide is empty apart from its title): from here on, triggers are written in T-SQL for SQL Server.</p>
<p>What changes from the standard: the table comes right after the name (<code>CREATE TRIGGER name ON table</code>), the timing is AFTER (or INSTEAD OF), there is no FOR EACH ROW — the trigger sees all changed rows at once through the tables <code>inserted</code> and <code>deleted</code>.</p>`,
        `<p class="y-chinh">🎯 Slide chuyển phần (slide trống, chỉ có tiêu đề): từ đây trigger được viết bằng T-SQL cho SQL Server.</p>
<p>Khác chuẩn ở chỗ: tên bảng đứng ngay sau tên trigger (<code>CREATE TRIGGER tên ON bảng</code>), thời điểm là AFTER (hoặc INSTEAD OF), không có FOR EACH ROW — trigger nhìn thấy mọi dòng bị đổi một lượt qua hai bảng <code>inserted</code> và <code>deleted</code>.</p>`],
      [41, 'Create Trigger on MS SQL Server - syntax',
        `<p class="y-chinh">🎯 CREATE TRIGGER trigger_name ON TableName AFTER {DELETE, INSERT, UPDATE} AS statements; a trigger can be switched off and on with DISABLE TRIGGER / ENABLE TRIGGER name ON table.</p>
<pre><code class="language-sql">SET NOCOUNT ON
GO
CREATE TRIGGER Tr_Department_Hello ON tblDepartment
AFTER INSERT, UPDATE, DELETE
AS
    PRINT N'Tr_Department_Hello is awake'
GO
INSERT INTO tblDepartment(depNum, depName) VALUES (6, N'Phòng Kế Toán');   -- fires
DISABLE TRIGGER Tr_Department_Hello ON tblDepartment;   -- the statement BEFORE it must end with ;
UPDATE tblDepartment SET depName = N'Phòng Kế Toán - Tài chính' WHERE depNum = 6;  -- silent
PRINT N'(the UPDATE above ran while the trigger was disabled)';
ENABLE TRIGGER Tr_Department_Hello ON tblDepartment;
DELETE FROM tblDepartment WHERE depNum = 6;                                 -- fires again</code></pre>
<div class="out">Tr_Department_Hello is awake<br>
(the UPDATE above ran while the trigger was disabled)<br>
Tr_Department_Hello is awake</div>
<ul>
<li><code>AFTER INSERT, UPDATE, DELETE</code> — one trigger may listen to several events.</li>
<li>The INSERT wakes it; while it is disabled the UPDATE runs silently; after ENABLE the DELETE wakes it again.</li>
<li>Disabling is used for bulk loads (import 1 million rows without firing the trigger 1 million times) — and must always be followed by ENABLE.</li>
</ul>
<div class="pitfall"><code>DISABLE TRIGGER</code> and <code>ENABLE TRIGGER</code> must start a statement cleanly: the statement <strong>before</strong> them needs a semicolon, otherwise SQL Server reads them as part of it ("Incorrect syntax near 'ENABLE'" — that is exactly what happened when this demo was first run without the ;).</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong>: <code>ALTER TABLE tbl DISABLE TRIGGER name</code> / <code>ENABLE TRIGGER name</code>; <code>TG_OP</code> inside the function tells which event fired:
<pre><code class="language-sql">CREATE FUNCTION trg_hello() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE NOTICE 'tr_department_hello is awake (%)', TG_OP;   -- TG_OP = INSERT / UPDATE / DELETE
    RETURN NULL;
END $$;
CREATE TRIGGER tr_department_hello AFTER INSERT OR UPDATE OR DELETE ON tblDepartment
FOR EACH STATEMENT EXECUTE FUNCTION trg_hello();
INSERT INTO tblDepartment(depNum, depName) VALUES (6, 'Phòng Kế Toán');
ALTER TABLE tblDepartment DISABLE TRIGGER tr_department_hello;   -- ALTER TABLE ... DISABLE TRIGGER
UPDATE tblDepartment SET depName = 'Phòng Kế Toán - Tài chính' WHERE depNum = 6;
ALTER TABLE tblDepartment ENABLE TRIGGER tr_department_hello;
DELETE FROM tblDepartment WHERE depNum = 6;</code></pre>
<div class="out">NOTICE:  tr_department_hello is awake (INSERT)<br>
NOTICE:  tr_department_hello is awake (DELETE)<br>
INSERT 0 1<br>
UPDATE 1<br>
DELETE 1</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — triggers</a>.</div>`,
        `<p class="y-chinh">🎯 CREATE TRIGGER tên_trigger ON TênBảng AFTER {DELETE, INSERT, UPDATE} AS các_câu_lệnh; trigger có thể tắt và bật lại bằng DISABLE TRIGGER / ENABLE TRIGGER tên ON bảng.</p>
<pre><code class="language-sql">SET NOCOUNT ON
GO
CREATE TRIGGER Tr_Department_Hello ON tblDepartment
AFTER INSERT, UPDATE, DELETE
AS
    PRINT N'Tr_Department_Hello is awake'
GO
INSERT INTO tblDepartment(depNum, depName) VALUES (6, N'Phòng Kế Toán');   -- có chạy
DISABLE TRIGGER Tr_Department_Hello ON tblDepartment;   -- câu lệnh ĐỨNG TRƯỚC nó phải kết thúc bằng ;
UPDATE tblDepartment SET depName = N'Phòng Kế Toán - Tài chính' WHERE depNum = 6;  -- im lặng
PRINT N'(the UPDATE above ran while the trigger was disabled)';
ENABLE TRIGGER Tr_Department_Hello ON tblDepartment;
DELETE FROM tblDepartment WHERE depNum = 6;                                 -- chạy lại</code></pre>
<div class="out">Tr_Department_Hello is awake<br>
(the UPDATE above ran while the trigger was disabled)<br>
Tr_Department_Hello is awake</div>
<ul>
<li><code>AFTER INSERT, UPDATE, DELETE</code> — một trigger lắng nghe được nhiều sự kiện.</li>
<li>INSERT đánh thức nó; trong lúc bị tắt thì UPDATE chạy im lặng; sau ENABLE thì DELETE lại đánh thức nó.</li>
<li>Tắt trigger được dùng khi nạp dữ liệu hàng loạt (nhập 1 triệu dòng mà không kích hoạt trigger 1 triệu lần) — và lúc nào cũng phải ENABLE lại sau đó.</li>
</ul>
<div class="pitfall"><code>DISABLE TRIGGER</code> và <code>ENABLE TRIGGER</code> phải mở đầu một câu lệnh rõ ràng: câu lệnh <strong>đứng trước</strong> chúng cần dấu chấm phẩy, nếu không SQL Server đọc chúng như một phần của câu trước (lỗi "Incorrect syntax near 'ENABLE'" — đúng lỗi đã gặp khi chạy demo này lần đầu mà thiếu dấu ;).</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>: <code>ALTER TABLE bảng DISABLE TRIGGER tên</code> / <code>ENABLE TRIGGER tên</code>; <code>TG_OP</code> bên trong hàm cho biết sự kiện nào kích hoạt:
<pre><code class="language-sql">CREATE FUNCTION trg_hello() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE NOTICE 'tr_department_hello is awake (%)', TG_OP;   -- TG_OP = INSERT / UPDATE / DELETE
    RETURN NULL;
END $$;
CREATE TRIGGER tr_department_hello AFTER INSERT OR UPDATE OR DELETE ON tblDepartment
FOR EACH STATEMENT EXECUTE FUNCTION trg_hello();
INSERT INTO tblDepartment(depNum, depName) VALUES (6, 'Phòng Kế Toán');
ALTER TABLE tblDepartment DISABLE TRIGGER tr_department_hello;   -- ALTER TABLE ... DISABLE TRIGGER
UPDATE tblDepartment SET depName = 'Phòng Kế Toán - Tài chính' WHERE depNum = 6;
ALTER TABLE tblDepartment ENABLE TRIGGER tr_department_hello;
DELETE FROM tblDepartment WHERE depNum = 6;</code></pre>
<div class="out">NOTICE:  tr_department_hello is awake (INSERT)<br>
NOTICE:  tr_department_hello is awake (DELETE)<br>
INSERT 0 1<br>
UPDATE 1<br>
DELETE 1</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — trigger</a>.</div>`],
      [42, 'Samples - trigger raised after insert',
        `<p class="y-chinh">🎯 A trigger raised after an INSERT on tblEmployee that only reports an error with RAISERROR — the slide's code, then a test the slide does not show.</p>
<pre><code class="language-sql">IF OBJECT_ID('Tr_Employee_Insert', 'TR') is not null
    drop trigger Tr_Employee_Insert
go
CREATE TRIGGER Tr_Employee_Insert ON tblEmployee
AFTER INSERT
AS
    RAISERROR('Insert trigger is awakened',16,1)
go
-- (added) test: the error is shown ... but is the row stored?
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050345, N'Nguyễn Văn Tý', 10000, 1);
go
SELECT empSSN, empName, empSalary, depNum FROM tblEmployee WHERE empSSN=30121050345;</code></pre>
<div class="out"><b>Msg 50000, Level 16, State 1<br>
Insert trigger is awakened</b><br>
(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>30121050345</td><td>Nguyễn Văn Tý</td><td>10000</td><td>1</td></tr>
</tbody>
</table>
<ul>
<li><code>IF OBJECT_ID('Tr_Employee_Insert', 'TR') is not null drop trigger …</code> — 'TR' = a trigger; drop it if it exists so the script can be run again.</li>
<li><code>RAISERROR('message', 16, 1)</code> — sends an error: 16 is the <em>severity</em> (11–16 = an error the user can fix), 1 the <em>state</em> (a free number to locate the call). It shows as Msg 50000 (the number of every user message).</li>
<li>The surprise: after the red error, "(1 row affected)" — and the SELECT <strong>finds the employee</strong>. RAISERROR only <em>reports</em>; it does not undo anything.</li>
</ul>
<div class="pitfall">A PE trigger "that refuses …" with RAISERROR but no ROLLBACK refuses nothing: the row stays. Slide 43 adds the missing line. (<code>AFTER INSERT, UPDATE</code> on the slide's text = one trigger for both events.)</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a message without undo is <code>RAISE NOTICE</code> / <code>RAISE WARNING</code>; the row is stored:
<pre><code class="language-sql">-- RAISE WARNING / NOTICE = only a message, the row stays (like RAISERROR without ROLLBACK)
CREATE FUNCTION trg_employee_insert() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE NOTICE 'Insert trigger is awakened';
    RETURN NULL;
END $$;
CREATE TRIGGER tr_employee_insert AFTER INSERT ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_employee_insert();
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050345, 'Nguyễn Văn Tý', 10000, 1);
SELECT empSSN, empName, empSalary, depNum FROM tblEmployee WHERE empSSN = 30121050345;</code></pre>
<div class="out">NOTICE:  Insert trigger is awakened<br>
INSERT 0 1</div>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>empsalary</th><th>depnum</th></tr></thead>
<tbody>
<tr><td>30121050345</td><td>Nguyễn Văn Tý</td><td>10000</td><td>1</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — triggers</a>.</div>`,
        `<p class="y-chinh">🎯 Một trigger kích hoạt sau INSERT trên tblEmployee chỉ báo lỗi bằng RAISERROR — code của slide, rồi một phép thử slide không cho xem.</p>
<pre><code class="language-sql">IF OBJECT_ID('Tr_Employee_Insert', 'TR') is not null
    drop trigger Tr_Employee_Insert
go
CREATE TRIGGER Tr_Employee_Insert ON tblEmployee
AFTER INSERT
AS
    RAISERROR('Insert trigger is awakened',16,1)
go
-- (thêm) thử: lỗi hiện ra ... nhưng dòng có được lưu không?
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050345, N'Nguyễn Văn Tý', 10000, 1);
go
SELECT empSSN, empName, empSalary, depNum FROM tblEmployee WHERE empSSN=30121050345;</code></pre>
<div class="out"><b>Msg 50000, Level 16, State 1<br>
Insert trigger is awakened</b><br>
(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>30121050345</td><td>Nguyễn Văn Tý</td><td>10000</td><td>1</td></tr>
</tbody>
</table>
<ul>
<li><code>IF OBJECT_ID('Tr_Employee_Insert', 'TR') is not null drop trigger …</code> — 'TR' = một trigger; có rồi thì xoá để chạy lại script được.</li>
<li><code>RAISERROR('thông báo', 16, 1)</code> — phát một lỗi: 16 là <em>mức nghiêm trọng</em> (severity; 11–16 = lỗi người dùng sửa được), 1 là <em>trạng thái</em> (state — một con số tự đặt để định vị chỗ gọi). Nó hiện thành Msg 50000 (mã của mọi thông báo do người dùng tự phát).</li>
<li>Điều bất ngờ: sau dòng lỗi đỏ là "(1 row affected)" — và câu SELECT <strong>vẫn thấy nhân viên đó</strong>. RAISERROR chỉ <em>báo</em>; nó không huỷ gì cả.</li>
</ul>
<div class="pitfall">Một trigger PE "từ chối …" có RAISERROR mà không có ROLLBACK thì chẳng từ chối được gì: dòng vẫn nằm đó. Slide 43 thêm dòng còn thiếu. (<code>AFTER INSERT, UPDATE</code> trong chữ của slide = một trigger cho cả hai sự kiện.)</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> thông báo mà không huỷ là <code>RAISE NOTICE</code> / <code>RAISE WARNING</code>; dòng vẫn được lưu:
<pre><code class="language-sql">-- RAISE WARNING / NOTICE = chỉ là thông báo, dòng vẫn được lưu (như RAISERROR không có ROLLBACK)
CREATE FUNCTION trg_employee_insert() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE NOTICE 'Insert trigger is awakened';
    RETURN NULL;
END $$;
CREATE TRIGGER tr_employee_insert AFTER INSERT ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_employee_insert();
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050345, 'Nguyễn Văn Tý', 10000, 1);
SELECT empSSN, empName, empSalary, depNum FROM tblEmployee WHERE empSSN = 30121050345;</code></pre>
<div class="out">NOTICE:  Insert trigger is awakened<br>
INSERT 0 1</div>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>empsalary</th><th>depnum</th></tr></thead>
<tbody>
<tr><td>30121050345</td><td>Nguyễn Văn Tý</td><td>10000</td><td>1</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — trigger</a>.</div>`],
      [43, 'Transaction Management in Triggers',
        `<p class="y-chinh">🎯 A trigger is always part of the transaction that fired it — an explicit one (BEGIN TRANSACTION) or the implicit one SQL Server opens for every statement; so ROLLBACK TRANSACTION inside the trigger undoes the triggering statement too.</p>
<p>The slide's code (its test line lacks the closing parenthesis — <code>1;</code> corrected to <code>1);</code> — and "Nguyễnn" has one n too many; both fixed):</p>
<pre><code class="language-sql">CREATE TRIGGER Tr_Employee_Insert ON tblEmployee
AFTER INSERT
AS
    RAISERROR('Insert trigger is awakened',16,1)
    ROLLBACK TRANSACTION
go
--test
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050345, N'Nguyễn Văn Tý', 10000, 1);
go
--not found employee whose empSSN is 30121050345
SELECT * FROM tblEmployee WHERE empSSN=30121050345</code></pre>
<div class="out"><b>Msg 50000, Level 16, State 1<br>
Insert trigger is awakened</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b></div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
</tbody>
</table>
<ul>
<li>Order of events: the INSERT writes the row → the trigger wakes → RAISERROR sends Msg 50000 → ROLLBACK undoes the INSERT → SQL Server adds Msg 3609 "The transaction ended in the trigger. The batch has been aborted."</li>
<li>"Batch aborted": the statements after the INSERT in the same batch do not run. That is why the test SELECT sits after a <code>go</code> — and it finds nothing.</li>
</ul>
<p class="meo">🧠 Refuse = RAISERROR (tell why) + ROLLBACK (undo). Learn them as one pair. Newer code uses <code>THROW 50001, 'message', 1;</code> which both reports and stops.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> one statement does both: <code>RAISE EXCEPTION</code> inside the trigger function reports the error and cancels the whole statement (no ROLLBACK line). Here the error is caught in a DO block only so the script can go on to the SELECT:
<pre><code class="language-sql">-- PostgreSQL: RAISE EXCEPTION inside the trigger = error + the whole statement is undone
CREATE FUNCTION trg_employee_insert() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE EXCEPTION 'Insert trigger is awakened';
END $$;
CREATE TRIGGER tr_employee_insert AFTER INSERT ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_employee_insert();
DO $$
BEGIN
    INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
    VALUES (30121050345, 'Nguyễn Văn Tý', 10000, 1);
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'ERROR caught: %', SQLERRM;    -- shown here instead of stopping the script
END $$;
SELECT * FROM tblEmployee WHERE empSSN = 30121050345;</code></pre>
<div class="out">NOTICE:  ERROR caught: Insert trigger is awakened</div>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>empaddress</th><th>empsalary</th><th>empsex</th><th>empbirthdate</th><th>depnum</th><th>supervisorssn</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — triggers</a>.</div>`,
        `<p class="y-chinh">🎯 Trigger luôn là một phần của giao dịch đã kích hoạt nó — giao dịch tường minh (BEGIN TRANSACTION) hoặc giao dịch ngầm mà SQL Server mở cho mỗi câu lệnh; nên ROLLBACK TRANSACTION trong trigger huỷ luôn câu lệnh kích hoạt.</p>
<p>Code của slide (dòng thử thiếu dấu đóng ngoặc — <code>1;</code> sửa thành <code>1);</code> — và "Nguyễnn" thừa một chữ n; đã sửa cả hai):</p>
<pre><code class="language-sql">CREATE TRIGGER Tr_Employee_Insert ON tblEmployee
AFTER INSERT
AS
    RAISERROR('Insert trigger is awakened',16,1)
    ROLLBACK TRANSACTION
go
--test
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050345, N'Nguyễn Văn Tý', 10000, 1);
go
--not found employee whose empSSN is 30121050345
SELECT * FROM tblEmployee WHERE empSSN=30121050345</code></pre>
<div class="out"><b>Msg 50000, Level 16, State 1<br>
Insert trigger is awakened</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b></div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
</tbody>
</table>
<ul>
<li>Thứ tự sự việc: INSERT ghi dòng → trigger thức dậy → RAISERROR gửi Msg 50000 → ROLLBACK huỷ câu INSERT → SQL Server thêm Msg 3609 "The transaction ended in the trigger. The batch has been aborted." (giao dịch đã kết thúc trong trigger, lô bị huỷ).</li>
<li>"Lô bị huỷ": các câu đứng sau INSERT trong cùng lô không chạy. Vì thế câu SELECT thử được đặt sau một chữ <code>go</code> — và nó không tìm thấy gì.</li>
</ul>
<p class="meo">🧠 Từ chối = RAISERROR (nói lý do) + ROLLBACK (huỷ). Học chúng như một cặp. Code mới hơn dùng <code>THROW 50001, 'thông báo', 1;</code> vừa báo vừa dừng.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> một câu làm cả hai việc: <code>RAISE EXCEPTION</code> trong hàm trigger báo lỗi và huỷ cả câu lệnh (không cần dòng ROLLBACK). Ở đây lỗi được bắt trong một khối DO chỉ để script chạy tiếp tới câu SELECT:
<pre><code class="language-sql">-- PostgreSQL: RAISE EXCEPTION trong trigger = báo lỗi + huỷ cả câu lệnh
CREATE FUNCTION trg_employee_insert() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE EXCEPTION 'Insert trigger is awakened';
END $$;
CREATE TRIGGER tr_employee_insert AFTER INSERT ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_employee_insert();
DO $$
BEGIN
    INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
    VALUES (30121050345, 'Nguyễn Văn Tý', 10000, 1);
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'ERROR caught: %', SQLERRM;    -- hiện ở đây thay vì dừng cả script
END $$;
SELECT * FROM tblEmployee WHERE empSSN = 30121050345;</code></pre>
<div class="out">NOTICE:  ERROR caught: Insert trigger is awakened</div>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>empaddress</th><th>empsalary</th><th>empsex</th><th>empbirthdate</th><th>depnum</th><th>supervisorssn</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — trigger</a>.</div>`],
      [44, 'Deleted and Inserted tables',
        `<p class="y-chinh">🎯 While a trigger runs it can read two in-memory tables, inserted and deleted, with the same columns as the trigger's table: INSERT fills inserted, DELETE fills deleted, UPDATE fills both (new data in inserted, old data in deleted). They are read-only and exist only inside the trigger.</p>
<pre><code class="language-plaintext">INSERT action ──inserted data──►  inserted
UPDATE action ──new data───────►  inserted
              ──old data───────►  deleted
DELETE action ──deleted data───►  deleted</code></pre>
<p>To <em>see</em> them, a trigger copies both into a log table after each statement:</p>
<pre><code class="language-sql">SET NOCOUNT ON
-- A log table to SEE what inserted and deleted contain during each statement
CREATE TABLE tblPeek (stmt NVARCHAR(10), fromTable NVARCHAR(10), depNum INT, depName NVARCHAR(50));
GO
CREATE TRIGGER Tr_Department_Peek ON tblDepartment
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    DECLARE @stmt NVARCHAR(10) =
        CASE WHEN EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted) THEN 'UPDATE'
             WHEN EXISTS (SELECT * FROM inserted) THEN 'INSERT'
             ELSE 'DELETE' END
    INSERT INTO tblPeek SELECT @stmt, 'inserted', depNum, depName FROM inserted
    INSERT INTO tblPeek SELECT @stmt, 'deleted',  depNum, depName FROM deleted
END
GO
INSERT INTO tblDepartment(depNum, depName) VALUES (6, N'Phòng Kế Toán');
UPDATE tblDepartment SET depName = N'Phòng Tài chính' WHERE depNum = 6;
DELETE FROM tblDepartment WHERE depNum = 6;
SELECT * FROM tblPeek;
GO
BEGIN TRY
    EXEC ('SELECT * FROM inserted')
END TRY
BEGIN CATCH
    PRINT N'Outside a trigger: ' + ERROR_MESSAGE()
END CATCH</code></pre>
<table>
<thead><tr><th>stmt</th><th>fromTable</th><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>INSERT</td><td>inserted</td><td>6</td><td>Phòng Kế Toán</td></tr>
<tr><td>UPDATE</td><td>inserted</td><td>6</td><td>Phòng Tài chính</td></tr>
<tr><td>UPDATE</td><td>deleted</td><td>6</td><td>Phòng Kế Toán</td></tr>
<tr><td>DELETE</td><td>deleted</td><td>6</td><td>Phòng Tài chính</td></tr>
</tbody>
</table>
<div class="out">Outside a trigger: Invalid object name 'inserted'.</div>
<ul>
<li>INSERT: one row in inserted, nothing in deleted. UPDATE: the new name in inserted, the old name in deleted. DELETE: only deleted.</li>
<li>The trigger tells the three events apart by which tables are non-empty — the CASE at the top.</li>
<li>Outside a trigger, <code>inserted</code> does not exist: "Invalid object name 'inserted'".</li>
</ul>
<p class="meo">🧠 UPDATE = "delete the old version + insert the new one" — that is why it fills both. Join them on the key (<code>inserted i JOIN deleted d ON i.depNum = d.depNum</code>) to compare old and new values.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a FOR EACH ROW function sees <strong>one</strong> row: <code>NEW</code> (INSERT, UPDATE) and <code>OLD</code> (UPDATE, DELETE):
<pre><code class="language-sql">CREATE TABLE tblPeek (stmt TEXT, from_what TEXT, depNum INT, depName VARCHAR(50));
-- Row level: NEW and OLD are ONE row (the old/new version of the row being changed)
CREATE FUNCTION trg_peek_row() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        INSERT INTO tblPeek VALUES (TG_OP, 'NEW', NEW.depNum, NEW.depName);
    END IF;
    IF TG_OP IN ('UPDATE', 'DELETE') THEN
        INSERT INTO tblPeek VALUES (TG_OP, 'OLD', OLD.depNum, OLD.depName);
    END IF;
    RETURN NULL;
END $$;
CREATE TRIGGER tr_peek AFTER INSERT OR UPDATE OR DELETE ON tblDepartment
FOR EACH ROW EXECUTE FUNCTION trg_peek_row();
INSERT INTO tblDepartment(depNum, depName) VALUES (6, 'Phòng Kế Toán');
UPDATE tblDepartment SET depName = 'Phòng Tài chính' WHERE depNum = 6;
DELETE FROM tblDepartment WHERE depNum = 6;
SELECT * FROM tblPeek;</code></pre>
<div class="out">INSERT 0 1<br>
UPDATE 1<br>
DELETE 1</div>
<table>
<thead><tr><th>stmt</th><th>from_what</th><th>depnum</th><th>depname</th></tr></thead>
<tbody>
<tr><td>INSERT</td><td>NEW</td><td>6</td><td>Phòng Kế Toán</td></tr>
<tr><td>UPDATE</td><td>NEW</td><td>6</td><td>Phòng Tài chính</td></tr>
<tr><td>UPDATE</td><td>OLD</td><td>6</td><td>Phòng Kế Toán</td></tr>
<tr><td>DELETE</td><td>OLD</td><td>6</td><td>Phòng Tài chính</td></tr>
</tbody>
</table>
The exact twin of inserted/deleted — whole tables of changed rows — is a statement trigger with <code>REFERENCING OLD TABLE AS … NEW TABLE AS …</code> (PostgreSQL 10+):
<pre><code class="language-sql">-- Statement level + REFERENCING: PostgreSQL's real twin of inserted / deleted (PostgreSQL 10+)
CREATE FUNCTION trg_salary_change() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE r RECORD;
BEGIN
    FOR r IN SELECT o.empName, o.empSalary AS old_sal, n.empSalary AS new_sal
             FROM old_rows o JOIN new_rows n ON n.empSSN = o.empSSN
             ORDER BY o.empSSN LOOP
        RAISE NOTICE '% : % -&gt; %', r.empName, r.old_sal, r.new_sal;
    END LOOP;
    RETURN NULL;
END $$;
CREATE TRIGGER tr_salary_change AFTER UPDATE ON tblEmployee
REFERENCING OLD TABLE AS old_rows NEW TABLE AS new_rows   -- = deleted / inserted
FOR EACH STATEMENT EXECUTE FUNCTION trg_salary_change();
UPDATE tblEmployee SET empSalary = empSalary * 1.1 WHERE depNum = 3;</code></pre>
<div class="out">NOTICE:  Nguyễn Thị Mai : 88000 -&gt; 96800<br>
NOTICE:  Bùi Văn Nam : 40000 -&gt; 44000<br>
NOTICE:  Trương Thị Thu : 52000 -&gt; 57200<br>
UPDATE 3</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — triggers</a>.</div>`,
        `<p class="y-chinh">🎯 Trong lúc chạy, trigger đọc được hai bảng nằm trong bộ nhớ là inserted và deleted, có cùng các cột với bảng gắn trigger: INSERT đổ vào inserted, DELETE đổ vào deleted, UPDATE đổ vào cả hai (dữ liệu mới ở inserted, dữ liệu cũ ở deleted). Chúng chỉ đọc được và chỉ tồn tại bên trong trigger.</p>
<pre><code class="language-plaintext">INSERT ──dữ liệu chèn vào──►  inserted
UPDATE ──dữ liệu mới───────►  inserted
       ──dữ liệu cũ────────►  deleted
DELETE ──dữ liệu bị xoá────►  deleted</code></pre>
<p>Để <em>nhìn thấy</em> chúng, một trigger chép cả hai vào một bảng nhật ký sau mỗi câu lệnh:</p>
<pre><code class="language-sql">SET NOCOUNT ON
-- Bảng nhật ký để NHÌN THẤY inserted và deleted chứa gì trong mỗi câu lệnh
CREATE TABLE tblPeek (stmt NVARCHAR(10), fromTable NVARCHAR(10), depNum INT, depName NVARCHAR(50));
GO
CREATE TRIGGER Tr_Department_Peek ON tblDepartment
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    DECLARE @stmt NVARCHAR(10) =
        CASE WHEN EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted) THEN 'UPDATE'
             WHEN EXISTS (SELECT * FROM inserted) THEN 'INSERT'
             ELSE 'DELETE' END
    INSERT INTO tblPeek SELECT @stmt, 'inserted', depNum, depName FROM inserted
    INSERT INTO tblPeek SELECT @stmt, 'deleted',  depNum, depName FROM deleted
END
GO
INSERT INTO tblDepartment(depNum, depName) VALUES (6, N'Phòng Kế Toán');
UPDATE tblDepartment SET depName = N'Phòng Tài chính' WHERE depNum = 6;
DELETE FROM tblDepartment WHERE depNum = 6;
SELECT * FROM tblPeek;
GO
BEGIN TRY
    EXEC ('SELECT * FROM inserted')
END TRY
BEGIN CATCH
    PRINT N'Outside a trigger: ' + ERROR_MESSAGE()
END CATCH</code></pre>
<table>
<thead><tr><th>stmt</th><th>fromTable</th><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>INSERT</td><td>inserted</td><td>6</td><td>Phòng Kế Toán</td></tr>
<tr><td>UPDATE</td><td>inserted</td><td>6</td><td>Phòng Tài chính</td></tr>
<tr><td>UPDATE</td><td>deleted</td><td>6</td><td>Phòng Kế Toán</td></tr>
<tr><td>DELETE</td><td>deleted</td><td>6</td><td>Phòng Tài chính</td></tr>
</tbody>
</table>
<div class="out">Outside a trigger: Invalid object name 'inserted'.</div>
<ul>
<li>INSERT: một dòng trong inserted, deleted trống. UPDATE: tên mới trong inserted, tên cũ trong deleted. DELETE: chỉ có deleted.</li>
<li>Trigger phân biệt ba sự kiện nhờ xem bảng nào không rỗng — biểu thức CASE ở đầu.</li>
<li>Ra ngoài trigger thì <code>inserted</code> không tồn tại: "Invalid object name 'inserted'" (tên đối tượng không hợp lệ).</li>
</ul>
<p class="meo">🧠 UPDATE = "xoá bản cũ + chèn bản mới" — vì thế nó đổ vào cả hai bảng. Nối chúng theo khoá (<code>inserted i JOIN deleted d ON i.depNum = d.depNum</code>) để so giá trị cũ với mới.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> hàm FOR EACH ROW nhìn thấy <strong>một</strong> dòng: <code>NEW</code> (INSERT, UPDATE) và <code>OLD</code> (UPDATE, DELETE):
<pre><code class="language-sql">CREATE TABLE tblPeek (stmt TEXT, from_what TEXT, depNum INT, depName VARCHAR(50));
-- Mức dòng: NEW và OLD là MỘT dòng (bản mới/cũ của dòng đang bị đổi)
CREATE FUNCTION trg_peek_row() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        INSERT INTO tblPeek VALUES (TG_OP, 'NEW', NEW.depNum, NEW.depName);
    END IF;
    IF TG_OP IN ('UPDATE', 'DELETE') THEN
        INSERT INTO tblPeek VALUES (TG_OP, 'OLD', OLD.depNum, OLD.depName);
    END IF;
    RETURN NULL;
END $$;
CREATE TRIGGER tr_peek AFTER INSERT OR UPDATE OR DELETE ON tblDepartment
FOR EACH ROW EXECUTE FUNCTION trg_peek_row();
INSERT INTO tblDepartment(depNum, depName) VALUES (6, 'Phòng Kế Toán');
UPDATE tblDepartment SET depName = 'Phòng Tài chính' WHERE depNum = 6;
DELETE FROM tblDepartment WHERE depNum = 6;
SELECT * FROM tblPeek;</code></pre>
<div class="out">INSERT 0 1<br>
UPDATE 1<br>
DELETE 1</div>
<table>
<thead><tr><th>stmt</th><th>from_what</th><th>depnum</th><th>depname</th></tr></thead>
<tbody>
<tr><td>INSERT</td><td>NEW</td><td>6</td><td>Phòng Kế Toán</td></tr>
<tr><td>UPDATE</td><td>NEW</td><td>6</td><td>Phòng Tài chính</td></tr>
<tr><td>UPDATE</td><td>OLD</td><td>6</td><td>Phòng Kế Toán</td></tr>
<tr><td>DELETE</td><td>OLD</td><td>6</td><td>Phòng Tài chính</td></tr>
</tbody>
</table>
Bản sinh đôi đúng nghĩa của inserted/deleted — cả bảng các dòng bị đổi — là trigger mức câu lệnh với <code>REFERENCING OLD TABLE AS … NEW TABLE AS …</code> (bảng chuyển tiếp — transition table, từ PostgreSQL 10):
<pre><code class="language-sql">-- Mức câu lệnh + REFERENCING: bản sinh đôi thật của inserted / deleted trên PostgreSQL (từ bản 10)
CREATE FUNCTION trg_salary_change() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE r RECORD;
BEGIN
    FOR r IN SELECT o.empName, o.empSalary AS old_sal, n.empSalary AS new_sal
             FROM old_rows o JOIN new_rows n ON n.empSSN = o.empSSN
             ORDER BY o.empSSN LOOP
        RAISE NOTICE '% : % -&gt; %', r.empName, r.old_sal, r.new_sal;
    END LOOP;
    RETURN NULL;
END $$;
CREATE TRIGGER tr_salary_change AFTER UPDATE ON tblEmployee
REFERENCING OLD TABLE AS old_rows NEW TABLE AS new_rows   -- = deleted / inserted
FOR EACH STATEMENT EXECUTE FUNCTION trg_salary_change();
UPDATE tblEmployee SET empSalary = empSalary * 1.1 WHERE depNum = 3;</code></pre>
<div class="out">NOTICE:  Nguyễn Thị Mai : 88000 -&gt; 96800<br>
NOTICE:  Bùi Văn Nam : 40000 -&gt; 44000<br>
NOTICE:  Trương Thị Thu : 52000 -&gt; 57200<br>
UPDATE 3</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — trigger</a>.</div>`],
      [45, 'Example - using Deleted and Inserted tables',
        `<p class="y-chinh">🎯 The slide's trigger reads the new employee's SSN and name from inserted into two variables and prints them.</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- session setting (not part of the slide): only the PRINT lines remain
GO
IF OBJECT_ID('Tr_Employee_Insert', 'TR') is not null
    drop trigger Tr_Employee_Insert
go
CREATE TRIGGER Tr_Employee_Insert ON tblEmployee
AFTER INSERT
AS
    DECLARE @vEmpSSN DECIMAL, @vEmpName NVARCHAR(50)
    SELECT @vEmpSSN=empSSN FROM inserted
    SELECT @vEmpName=empName FROM inserted
    PRINT 'new tuple:'
    PRINT 'empSSN=' + CAST(@vEmpSSN AS nvarchar(11)) + ' empName=' + @vEmpName
go
--test
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum, supervisorSSN)
VALUES (30121050345, N'Nguyễn Văn Tý', 10000, 1, 30121050037);
go
-- (added) trap: ONE statement inserting TWO rows -&gt; the trigger runs once and prints only ONE
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050346, N'Trần Văn Tèo', 11000, 1),
       (30121050347, N'Lê Thị Tí',    12000, 1);</code></pre>
<div class="out">new tuple:<br>
empSSN=30121050345 empName=Nguyễn Văn Tý<br>
new tuple:<br>
empSSN=30121050346 empName=Trần Văn Tèo</div>
<ul>
<li><code>SELECT @vEmpSSN=empSSN FROM inserted</code> — copies a column of inserted into a variable (slide 6's SELECT assignment).</li>
<li><code>CAST(@vEmpSSN AS nvarchar(11))</code> — the SSN has 11 digits, so 11 characters are enough.</li>
<li>The first test (the slide's) prints Nguyễn Văn Tý. The second (added) inserts <strong>two</strong> employees in <strong>one</strong> statement: the trigger runs once and prints only Trần Văn Tèo — Lê Thị Tí is silently ignored.</li>
</ul>
<p>The set-based fix: treat inserted as a table and return every row:</p>
<pre><code class="language-sql">-- (fixed) set-based: read inserted like a table, one line per new row
GO
CREATE TRIGGER Tr_Employee_Insert ON tblEmployee
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON
    SELECT N'new tuple' AS info, empSSN, empName FROM inserted ORDER BY empSSN
END
GO
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050346, N'Trần Văn Tèo', 11000, 1),
       (30121050347, N'Lê Thị Tí',    12000, 1);</code></pre>
<table>
<thead><tr><th>info</th><th>empSSN</th><th>empName</th></tr></thead>
<tbody>
<tr><td>new tuple</td><td>30121050346</td><td>Trần Văn Tèo</td></tr>
<tr><td>new tuple</td><td>30121050347</td><td>Lê Thị Tí</td></tr>
</tbody>
</table>
<div class="pitfall">The #1 trigger bug: "one variable = one row of inserted". It works in every test you type by hand (one row) and breaks the first time someone runs an INSERT … SELECT or an UPDATE of many rows. Write trigger code with EXISTS, JOIN, INSERT … SELECT on inserted — never assume one row.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a FOR EACH ROW trigger does not have this trap: the function runs once per row and <code>NEW</code> is always exactly one row:
<pre><code class="language-sql">-- FOR EACH ROW: the function runs once PER ROW, so NEW is always exactly one row
CREATE FUNCTION trg_employee_insert() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE NOTICE 'new tuple: empSSN=% empName=%', NEW.empSSN, NEW.empName;
    RETURN NULL;
END $$;
CREATE TRIGGER tr_employee_insert AFTER INSERT ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_employee_insert();
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum, supervisorSSN)
VALUES (30121050345, 'Nguyễn Văn Tý', 10000, 1, 30121050037);
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050346, 'Trần Văn Tèo', 11000, 1),
       (30121050347, 'Lê Thị Tí',    12000, 1);</code></pre>
<div class="out">NOTICE:  new tuple: empSSN=30121050345 empName=Nguyễn Văn Tý<br>
NOTICE:  new tuple: empSSN=30121050346 empName=Trần Văn Tèo<br>
NOTICE:  new tuple: empSSN=30121050347 empName=Lê Thị Tí<br>
INSERT 0 1<br>
INSERT 0 2</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — triggers</a>.</div>`,
        `<p class="y-chinh">🎯 Trigger của slide đọc mã SSN và tên của nhân viên mới từ inserted vào hai biến rồi in ra.</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- thiết lập phiên (không có trên slide): chỉ còn các dòng PRINT
GO
IF OBJECT_ID('Tr_Employee_Insert', 'TR') is not null
    drop trigger Tr_Employee_Insert
go
CREATE TRIGGER Tr_Employee_Insert ON tblEmployee
AFTER INSERT
AS
    DECLARE @vEmpSSN DECIMAL, @vEmpName NVARCHAR(50)
    SELECT @vEmpSSN=empSSN FROM inserted
    SELECT @vEmpName=empName FROM inserted
    PRINT 'new tuple:'
    PRINT 'empSSN=' + CAST(@vEmpSSN AS nvarchar(11)) + ' empName=' + @vEmpName
go
--test
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum, supervisorSSN)
VALUES (30121050345, N'Nguyễn Văn Tý', 10000, 1, 30121050037);
go
-- (thêm) bẫy: MỘT câu lệnh chèn HAI dòng -&gt; trigger chạy một lần và chỉ in MỘT dòng
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050346, N'Trần Văn Tèo', 11000, 1),
       (30121050347, N'Lê Thị Tí',    12000, 1);</code></pre>
<div class="out">new tuple:<br>
empSSN=30121050345 empName=Nguyễn Văn Tý<br>
new tuple:<br>
empSSN=30121050346 empName=Trần Văn Tèo</div>
<ul>
<li><code>SELECT @vEmpSSN=empSSN FROM inserted</code> — chép một cột của inserted vào biến (phép gán bằng SELECT ở slide 6).</li>
<li><code>CAST(@vEmpSSN AS nvarchar(11))</code> — SSN có 11 chữ số, nên 11 ký tự là đủ.</li>
<li>Phép thử đầu (của slide) in ra Nguyễn Văn Tý. Phép thử thứ hai (thêm vào) chèn <strong>hai</strong> nhân viên trong <strong>một</strong> câu lệnh: trigger chạy một lần và chỉ in Trần Văn Tèo — Lê Thị Tí bị bỏ qua trong im lặng.</li>
</ul>
<p>Cách sửa theo tập hợp: coi inserted là một bảng và trả về mọi dòng:</p>
<pre><code class="language-sql">-- (sửa) theo tập hợp: đọc inserted như một bảng, mỗi dòng mới một dòng in
GO
CREATE TRIGGER Tr_Employee_Insert ON tblEmployee
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON
    SELECT N'new tuple' AS info, empSSN, empName FROM inserted ORDER BY empSSN
END
GO
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050346, N'Trần Văn Tèo', 11000, 1),
       (30121050347, N'Lê Thị Tí',    12000, 1);</code></pre>
<table>
<thead><tr><th>info</th><th>empSSN</th><th>empName</th></tr></thead>
<tbody>
<tr><td>new tuple</td><td>30121050346</td><td>Trần Văn Tèo</td></tr>
<tr><td>new tuple</td><td>30121050347</td><td>Lê Thị Tí</td></tr>
</tbody>
</table>
<div class="pitfall">Lỗi trigger số 1: "một biến = một dòng của inserted". Nó đúng với mọi phép thử bạn gõ tay (một dòng) và hỏng ngay lần đầu có người chạy INSERT … SELECT hoặc UPDATE nhiều dòng. Viết code trigger bằng EXISTS, JOIN, INSERT … SELECT trên inserted — đừng bao giờ giả định chỉ có một dòng.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> trigger FOR EACH ROW không có cái bẫy này: hàm chạy mỗi dòng một lần và <code>NEW</code> luôn đúng một dòng:
<pre><code class="language-sql">-- FOR EACH ROW: hàm chạy MỖI DÒNG một lần, nên NEW luôn đúng một dòng
CREATE FUNCTION trg_employee_insert() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE NOTICE 'new tuple: empSSN=% empName=%', NEW.empSSN, NEW.empName;
    RETURN NULL;
END $$;
CREATE TRIGGER tr_employee_insert AFTER INSERT ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_employee_insert();
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum, supervisorSSN)
VALUES (30121050345, 'Nguyễn Văn Tý', 10000, 1, 30121050037);
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
VALUES (30121050346, 'Trần Văn Tèo', 11000, 1),
       (30121050347, 'Lê Thị Tí',    12000, 1);</code></pre>
<div class="out">NOTICE:  new tuple: empSSN=30121050345 empName=Nguyễn Văn Tý<br>
NOTICE:  new tuple: empSSN=30121050346 empName=Trần Văn Tèo<br>
NOTICE:  new tuple: empSSN=30121050347 empName=Lê Thị Tí<br>
INSERT 0 1<br>
INSERT 0 2</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — trigger</a>.</div>`],
      [46, 'Samples - refuse under-18 employees',
        `<p class="y-chinh">🎯 A trigger that refuses inserting or updating an employee under 18: read the birth date from inserted into a variable, compute the age, and if it is below 18 raise an error and roll back.</p>
<p>The slide's code (curly quote ‘Employee corrected; "contact" is the slide's word for "contract", left as is inside the message), then three tests:</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- session setting: hide "(n rows affected)", the final SELECT shows what was stored
GO
CREATE TRIGGER Tr_Employee_Under18 ON tblEmployee
AFTER INSERT, UPDATE
AS
    DECLARE @empBirthdate DATETIME, @age INT
    SELECT @empBirthdate=empBirthdate
    FROM inserted

    SET @age=YEAR(GETDATE()) - YEAR(@empBirthdate)
    IF (@age &lt; 18)
    BEGIN
        RAISERROR('Employee is under 18 years old.
                We can not sign a contact with
                him/her.',16,1)
        ROLLBACK TRANSACTION
    END
go
-- (added) tests
-- 1. born 2012: refused
INSERT INTO tblEmployee(empSSN, empName, empBirthdate, depNum) VALUES (30121050200, N'Bé Na', '2012-05-01', 1);
go
-- 2. born 2000: accepted
INSERT INTO tblEmployee(empSSN, empName, empBirthdate, depNum) VALUES (30121050201, N'Anh Ba', '2000-05-01', 1);
go
-- 3. TRAP: one statement, two rows, the child LAST in the list
INSERT INTO tblEmployee(empSSN, empName, empBirthdate, depNum)
VALUES (30121050202, N'Chị Tư', '1999-01-01', 1),
       (30121050203, N'Bé Bi', '2013-01-01', 1);
go
SELECT empSSN, empName, empBirthdate FROM tblEmployee WHERE empSSN &gt;= 30121050200 ORDER BY empSSN;</code></pre>
<div class="out"><b>Msg 50000, Level 16, State 1<br>
Employee is under 18 years old.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We can not sign a contact with<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;him/her.</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b></div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empBirthdate</th></tr></thead>
<tbody>
<tr><td>30121050201</td><td>Anh Ba</td><td>2000-05-01</td></tr>
<tr><td>30121050202</td><td>Chị Tư</td><td>1999-01-01</td></tr>
<tr><td>30121050203</td><td>Bé Bi</td><td>2013-01-01</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Test</th><th>Rows</th><th>What happened</th><th>Correct?</th></tr></thead>
<tbody>
<tr><td>1</td><td>Bé Na, born 2012</td><td>refused (Msg 50000 + 3609)</td><td>✅</td></tr>
<tr><td>2</td><td>Anh Ba, born 2000</td><td>stored</td><td>✅</td></tr>
<tr><td>3</td><td>Chị Tư 1999 + Bé Bi 2013 in ONE INSERT</td><td>both stored — Bé Bi (13 years old) got in</td><td>❌</td></tr>
</tbody>
</table>
<ul>
<li><code>YEAR(GETDATE()) - YEAR(@empBirthdate)</code> — the difference of the years (2026 when this ran), not the real age: someone born in December 2008 counts as 18 already in January 2026.</li>
<li>Test 3: the variable received one row of inserted — in this run Chị Tư's — so Bé Bi was never checked. Which row a variable gets is not guaranteed; the bug is the variable itself.</li>
</ul>
<div class="pitfall">This is the slide-45 trap with real damage: a child hired. In the PE, a trigger that stores inserted in a variable loses marks even if your one-row test passes. The next slide is the correct version.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the slide's variable idea is safe in a FOR EACH ROW trigger — each row is checked on its own, and <code>RAISE EXCEPTION</code> cancels the whole INSERT (Chị Tư too):
<pre><code class="language-sql">-- The slide-46 idea (one variable) is SAFE in a FOR EACH ROW trigger: NEW is always one row
CREATE FUNCTION trg_employee_under18() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_age INT;
BEGIN
    v_age := EXTRACT(YEAR FROM now()) - EXTRACT(YEAR FROM NEW.empBirthdate);
    IF v_age &lt; 18 THEN
        RAISE EXCEPTION 'Employee % is under 18 years old.', NEW.empName;
    END IF;
    RETURN NULL;
END $$;
CREATE TRIGGER tr_employee_under18 AFTER INSERT OR UPDATE ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_employee_under18();
DO $$
BEGIN
    INSERT INTO tblEmployee(empSSN, empName, empBirthdate, depNum)
    VALUES (30121050202, 'Chị Tư', '1999-01-01', 1), (30121050203, 'Bé Bi', '2013-01-01', 1);
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'refused: %', SQLERRM;      -- the whole INSERT is undone, Chị Tư too
END $$;
SELECT COUNT(*) AS stored FROM tblEmployee WHERE empSSN IN (30121050202, 30121050203);</code></pre>
<div class="out">NOTICE:  refused: Employee Bé Bi is under 18 years old.</div>
<table>
<thead><tr><th>stored</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — triggers</a>.</div>`,
        `<p class="y-chinh">🎯 Trigger từ chối việc chèn hoặc sửa một nhân viên dưới 18 tuổi: đọc ngày sinh từ inserted vào một biến, tính tuổi, dưới 18 thì báo lỗi và huỷ giao dịch.</p>
<p>Code của slide (nháy cong ‘Employee đã sửa; "contact" là chữ của slide cho "contract" — hợp đồng, để nguyên trong thông báo), rồi ba phép thử:</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- thiết lập phiên: tắt "(n rows affected)", câu SELECT cuối cho thấy cái gì được lưu
GO
CREATE TRIGGER Tr_Employee_Under18 ON tblEmployee
AFTER INSERT, UPDATE
AS
    DECLARE @empBirthdate DATETIME, @age INT
    SELECT @empBirthdate=empBirthdate
    FROM inserted

    SET @age=YEAR(GETDATE()) - YEAR(@empBirthdate)
    IF (@age &lt; 18)
    BEGIN
        RAISERROR('Employee is under 18 years old.
                We can not sign a contact with
                him/her.',16,1)
        ROLLBACK TRANSACTION
    END
go
-- (thêm) thử
-- 1. sinh 2012: bị từ chối
INSERT INTO tblEmployee(empSSN, empName, empBirthdate, depNum) VALUES (30121050200, N'Bé Na', '2012-05-01', 1);
go
-- 2. sinh 2000: được nhận
INSERT INTO tblEmployee(empSSN, empName, empBirthdate, depNum) VALUES (30121050201, N'Anh Ba', '2000-05-01', 1);
go
-- 3. BẪY: một câu lệnh, hai dòng, đứa trẻ đứng CUỐI danh sách
INSERT INTO tblEmployee(empSSN, empName, empBirthdate, depNum)
VALUES (30121050202, N'Chị Tư', '1999-01-01', 1),
       (30121050203, N'Bé Bi', '2013-01-01', 1);
go
SELECT empSSN, empName, empBirthdate FROM tblEmployee WHERE empSSN &gt;= 30121050200 ORDER BY empSSN;</code></pre>
<div class="out"><b>Msg 50000, Level 16, State 1<br>
Employee is under 18 years old.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We can not sign a contact with<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;him/her.</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b></div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empBirthdate</th></tr></thead>
<tbody>
<tr><td>30121050201</td><td>Anh Ba</td><td>2000-05-01</td></tr>
<tr><td>30121050202</td><td>Chị Tư</td><td>1999-01-01</td></tr>
<tr><td>30121050203</td><td>Bé Bi</td><td>2013-01-01</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Phép thử</th><th>Dòng</th><th>Chuyện gì xảy ra</th><th>Đúng chưa?</th></tr></thead>
<tbody>
<tr><td>1</td><td>Bé Na, sinh 2012</td><td>bị từ chối (Msg 50000 + 3609)</td><td>✅</td></tr>
<tr><td>2</td><td>Anh Ba, sinh 2000</td><td>được lưu</td><td>✅</td></tr>
<tr><td>3</td><td>Chị Tư 1999 + Bé Bi 2013 trong MỘT câu INSERT</td><td>cả hai được lưu — Bé Bi (13 tuổi) lọt vào</td><td>❌</td></tr>
</tbody>
</table>
<ul>
<li><code>YEAR(GETDATE()) - YEAR(@empBirthdate)</code> — hiệu của hai số năm (2026 lúc chạy), không phải tuổi thật: người sinh tháng 12/2008 đã bị tính là 18 tuổi ngay từ tháng 1/2026.</li>
<li>Phép thử 3: biến nhận một dòng của inserted — lần chạy này là dòng của Chị Tư — nên Bé Bi không bao giờ bị kiểm. Biến nhận dòng nào là không được đảm bảo; lỗi nằm ở chính việc dùng biến.</li>
</ul>
<div class="pitfall">Đây là cái bẫy của slide 45 gây hậu quả thật: tuyển một đứa trẻ. Trong bài PE, trigger cất inserted vào một biến sẽ bị trừ điểm dù phép thử một dòng của bạn chạy đúng. Slide sau là bản đúng.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> ý tưởng dùng biến của slide lại an toàn trong trigger FOR EACH ROW — mỗi dòng được kiểm riêng, và <code>RAISE EXCEPTION</code> huỷ cả câu INSERT (kể cả Chị Tư):
<pre><code class="language-sql">-- Ý tưởng slide 46 (một biến) lại AN TOÀN trong trigger FOR EACH ROW: NEW luôn đúng một dòng
CREATE FUNCTION trg_employee_under18() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_age INT;
BEGIN
    v_age := EXTRACT(YEAR FROM now()) - EXTRACT(YEAR FROM NEW.empBirthdate);
    IF v_age &lt; 18 THEN
        RAISE EXCEPTION 'Employee % is under 18 years old.', NEW.empName;
    END IF;
    RETURN NULL;
END $$;
CREATE TRIGGER tr_employee_under18 AFTER INSERT OR UPDATE ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_employee_under18();
DO $$
BEGIN
    INSERT INTO tblEmployee(empSSN, empName, empBirthdate, depNum)
    VALUES (30121050202, 'Chị Tư', '1999-01-01', 1), (30121050203, 'Bé Bi', '2013-01-01', 1);
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'refused: %', SQLERRM;      -- cả câu INSERT bị huỷ, kể cả Chị Tư
END $$;
SELECT COUNT(*) AS stored FROM tblEmployee WHERE empSSN IN (30121050202, 30121050203);</code></pre>
<div class="out">NOTICE:  refused: Employee Bé Bi is under 18 years old.</div>
<table>
<thead><tr><th>stored</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — trigger</a>.</div>`],
      [47, 'Samples - another method using EXISTS',
        `<p class="y-chinh">🎯 The same rule written with IF EXISTS (SELECT * FROM inserted WHERE age &lt; 18): it looks at every new row, so it is correct for multi-row statements.</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- session setting: hide "(n rows affected)", the final SELECT shows what was stored
GO
CREATE TRIGGER Tr_Employee_Under18 ON tblEmployee
AFTER INSERT, UPDATE
AS
    IF EXISTS(SELECT *
              FROM inserted
              WHERE (YEAR(GETDATE())-YEAR(empBirthdate))&lt;18
             )
    BEGIN
        RAISERROR('Employee is under 18 years old.
                We can not sign a contact with
                him/her.',16,1)
        ROLLBACK TRANSACTION
    END
go
-- (added) the same two-row INSERT that slipped through slide 46
INSERT INTO tblEmployee(empSSN, empName, empBirthdate, depNum)
VALUES (30121050202, N'Chị Tư', '1999-01-01', 1),
       (30121050203, N'Bé Bi', '2013-01-01', 1);
go
-- (added) UPDATE is checked too: make employee 003 born in 2015
UPDATE tblEmployee SET empBirthdate = '2015-01-01' WHERE empSSN = 30121050003;
go
SELECT empSSN, empName, empBirthdate FROM tblEmployee
WHERE empSSN IN (30121050003, 30121050202, 30121050203) ORDER BY empSSN;</code></pre>
<div class="out"><b>Msg 50000, Level 16, State 1<br>
Employee is under 18 years old.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We can not sign a contact with<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;him/her.</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b><br>
<b>Msg 50000, Level 16, State 1<br>
Employee is under 18 years old.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We can not sign a contact with<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;him/her.</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b></div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empBirthdate</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>1990-11-02</td></tr>
</tbody>
</table>
<ul>
<li>The two-row INSERT that slipped through slide 46 is now refused — EXISTS finds Bé Bi among the rows of inserted, and ROLLBACK cancels the whole statement, Chị Tư included.</li>
<li><code>AFTER INSERT, UPDATE</code>: changing employee 003's birth date to 2015 is refused too; the final SELECT shows 003 unchanged (1990) and neither new employee stored.</li>
</ul>
<p class="meo">🧠 Template for every "refuse if …" trigger in the PE: <code>IF EXISTS (SELECT * FROM inserted [JOIN other tables] WHERE &lt;bad condition&gt;) BEGIN RAISERROR(…) ROLLBACK TRANSACTION END</code>.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the usual choice is a <strong>BEFORE … FOR EACH ROW</strong> trigger (the row is rejected before it is even written), <code>age()</code> for the real age, and <code>RETURN NEW</code> to let good rows through. <code>UPDATE OF empBirthdate</code> limits the check to that column:
<pre><code class="language-sql">CREATE FUNCTION trg_employee_under18() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF age(NEW.empBirthdate) &lt; INTERVAL '18 years' THEN     -- age() counts real birthdays
        RAISE EXCEPTION 'Employee % is under 18 years old. We can not sign a contract with him/her.', NEW.empName;
    END IF;
    RETURN NEW;                  -- BEFORE trigger: NULL would silently skip the row
END $$;
CREATE TRIGGER tr_employee_under18
BEFORE INSERT OR UPDATE OF empBirthdate ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_employee_under18();
DO $$
BEGIN
    BEGIN
        INSERT INTO tblEmployee(empSSN, empName, empBirthdate, depNum)
        VALUES (30121050202, 'Chị Tư', '1999-01-01', 1), (30121050203, 'Bé Bi', '2013-01-01', 1);
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'refused: %', SQLERRM;
    END;
    BEGIN
        UPDATE tblEmployee SET empBirthdate = '2015-01-01' WHERE empSSN = 30121050003;
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'refused: %', SQLERRM;
    END;
    INSERT INTO tblEmployee(empSSN, empName, empBirthdate, depNum) VALUES (30121050201, 'Anh Ba', '2000-05-01', 1);
    RAISE NOTICE 'Anh Ba accepted';
END $$;
SELECT empSSN, empName, empBirthdate FROM tblEmployee
WHERE empSSN IN (30121050003, 30121050201, 30121050202, 30121050203) ORDER BY empSSN;</code></pre>
<div class="out">NOTICE:  refused: Employee Bé Bi is under 18 years old. We can not sign a contract with him/her.<br>
NOTICE:  refused: Employee Võ Việt Anh is under 18 years old. We can not sign a contract with him/her.<br>
NOTICE:  Anh Ba accepted</div>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>empbirthdate</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>1990-11-02</td></tr>
<tr><td>30121050201</td><td>Anh Ba</td><td>2000-05-01</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — triggers</a>.</div>`,
        `<p class="y-chinh">🎯 Cùng luật đó viết bằng IF EXISTS (SELECT * FROM inserted WHERE tuổi &lt; 18): nó xét mọi dòng mới, nên đúng cả khi một câu lệnh chèn/sửa nhiều dòng.</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- thiết lập phiên: tắt "(n rows affected)", câu SELECT cuối cho thấy cái gì được lưu
GO
CREATE TRIGGER Tr_Employee_Under18 ON tblEmployee
AFTER INSERT, UPDATE
AS
    IF EXISTS(SELECT *
              FROM inserted
              WHERE (YEAR(GETDATE())-YEAR(empBirthdate))&lt;18
             )
    BEGIN
        RAISERROR('Employee is under 18 years old.
                We can not sign a contact with
                him/her.',16,1)
        ROLLBACK TRANSACTION
    END
go
-- (thêm) đúng câu chèn hai dòng đã lọt qua slide 46
INSERT INTO tblEmployee(empSSN, empName, empBirthdate, depNum)
VALUES (30121050202, N'Chị Tư', '1999-01-01', 1),
       (30121050203, N'Bé Bi', '2013-01-01', 1);
go
-- (thêm) UPDATE cũng bị kiểm: sửa nhân viên 003 thành sinh năm 2015
UPDATE tblEmployee SET empBirthdate = '2015-01-01' WHERE empSSN = 30121050003;
go
SELECT empSSN, empName, empBirthdate FROM tblEmployee
WHERE empSSN IN (30121050003, 30121050202, 30121050203) ORDER BY empSSN;</code></pre>
<div class="out"><b>Msg 50000, Level 16, State 1<br>
Employee is under 18 years old.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We can not sign a contact with<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;him/her.</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b><br>
<b>Msg 50000, Level 16, State 1<br>
Employee is under 18 years old.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We can not sign a contact with<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;him/her.</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b></div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empBirthdate</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>1990-11-02</td></tr>
</tbody>
</table>
<ul>
<li>Câu INSERT hai dòng từng lọt qua slide 46 giờ bị từ chối — EXISTS tìm ra Bé Bi trong các dòng của inserted, và ROLLBACK huỷ cả câu lệnh, kể cả Chị Tư.</li>
<li><code>AFTER INSERT, UPDATE</code>: sửa ngày sinh nhân viên 003 thành năm 2015 cũng bị từ chối; câu SELECT cuối cho thấy 003 không đổi (1990) và không nhân viên mới nào được lưu.</li>
</ul>
<p class="meo">🧠 Khuôn cho mọi trigger "từ chối nếu …" trong bài PE: <code>IF EXISTS (SELECT * FROM inserted [JOIN bảng khác] WHERE &lt;điều kiện sai&gt;) BEGIN RAISERROR(…) ROLLBACK TRANSACTION END</code>.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> lựa chọn thường gặp là trigger <strong>BEFORE … FOR EACH ROW</strong> (dòng bị chặn trước cả khi được ghi), <code>age()</code> để tính tuổi thật, và <code>RETURN NEW</code> để cho dòng hợp lệ đi qua. <code>UPDATE OF empBirthdate</code> giới hạn phép kiểm vào đúng cột đó:
<pre><code class="language-sql">CREATE FUNCTION trg_employee_under18() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF age(NEW.empBirthdate) &lt; INTERVAL '18 years' THEN     -- age() tính theo ngày sinh nhật thật
        RAISE EXCEPTION 'Employee % is under 18 years old. We can not sign a contract with him/her.', NEW.empName;
    END IF;
    RETURN NEW;                  -- trigger BEFORE: trả NULL sẽ lặng lẽ bỏ dòng này
END $$;
CREATE TRIGGER tr_employee_under18
BEFORE INSERT OR UPDATE OF empBirthdate ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_employee_under18();
DO $$
BEGIN
    BEGIN
        INSERT INTO tblEmployee(empSSN, empName, empBirthdate, depNum)
        VALUES (30121050202, 'Chị Tư', '1999-01-01', 1), (30121050203, 'Bé Bi', '2013-01-01', 1);
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'refused: %', SQLERRM;
    END;
    BEGIN
        UPDATE tblEmployee SET empBirthdate = '2015-01-01' WHERE empSSN = 30121050003;
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'refused: %', SQLERRM;
    END;
    INSERT INTO tblEmployee(empSSN, empName, empBirthdate, depNum) VALUES (30121050201, 'Anh Ba', '2000-05-01', 1);
    RAISE NOTICE 'Anh Ba accepted';
END $$;
SELECT empSSN, empName, empBirthdate FROM tblEmployee
WHERE empSSN IN (30121050003, 30121050201, 30121050202, 30121050203) ORDER BY empSSN;</code></pre>
<div class="out">NOTICE:  refused: Employee Bé Bi is under 18 years old. We can not sign a contract with him/her.<br>
NOTICE:  refused: Employee Võ Việt Anh is under 18 years old. We can not sign a contract with him/her.<br>
NOTICE:  Anh Ba accepted</div>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>empbirthdate</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>1990-11-02</td></tr>
<tr><td>30121050201</td><td>Anh Ba</td><td>2000-05-01</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — trigger</a>.</div>`],
      [48, 'Using Cursor in MS SQL Server',
        `<p class="y-chinh">🎯 Six steps of a cursor: DECLARE cursor_name CURSOR FOR SELECT…; OPEN; FETCH NEXT | PRIOR | FIRST | LAST FROM cursor INTO @vars; test @@FETCH_STATUS (0 = success); CLOSE; DEALLOCATE.</p>
<p>A cursor is a finger on a result: DECLARE writes the list, OPEN prints it, each FETCH moves the finger and copies the current line into variables. All the moves of the slide, on the departments (added demo):</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @depNum INT, @depName NVARCHAR(50)
-- 1. Declare. SCROLL is needed for PRIOR / FIRST / LAST (a default cursor only goes NEXT)
DECLARE dep_cursor CURSOR SCROLL FOR
    SELECT depNum, depName FROM tblDepartment ORDER BY depNum
-- 2. Open: the query runs now
OPEN dep_cursor
-- 3. Fetch in different directions
FETCH LAST  FROM dep_cursor INTO @depNum, @depName
PRINT N'LAST  -&gt; ' + CAST(@depNum AS VARCHAR) + N' ' + @depName
FETCH PRIOR FROM dep_cursor INTO @depNum, @depName
PRINT N'PRIOR -&gt; ' + CAST(@depNum AS VARCHAR) + N' ' + @depName
FETCH FIRST FROM dep_cursor INTO @depNum, @depName
PRINT N'FIRST -&gt; ' + CAST(@depNum AS VARCHAR) + N' ' + @depName
FETCH NEXT  FROM dep_cursor INTO @depNum, @depName
PRINT N'NEXT  -&gt; ' + CAST(@depNum AS VARCHAR) + N' ' + @depName
-- 4. @@FETCH_STATUS: 0 = a row was fetched, -1 = we went past the end
PRINT N'@@FETCH_STATUS = ' + CAST(@@FETCH_STATUS AS VARCHAR)
FETCH LAST FROM dep_cursor INTO @depNum, @depName
FETCH NEXT FROM dep_cursor INTO @depNum, @depName
PRINT N'after NEXT past the last row: @@FETCH_STATUS = ' + CAST(@@FETCH_STATUS AS VARCHAR)
-- 5. Close, 6. free the memory
CLOSE dep_cursor
DEALLOCATE dep_cursor</code></pre>
<div class="out">LAST  -&gt; 5 Phòng Nghiên cứu<br>
PRIOR -&gt; 4 Phòng Hành chính<br>
FIRST -&gt; 1 Phòng Phần mềm trong nước<br>
NEXT  -&gt; 2 Phòng Phần mềm nước ngoài<br>
@@FETCH_STATUS = 0<br>
after NEXT past the last row: @@FETCH_STATUS = -1</div>
<ul>
<li>PRIOR, FIRST and LAST need a <strong>SCROLL</strong> cursor; a default cursor can only go NEXT.</li>
<li><code>@@FETCH_STATUS</code> = 0 after a successful fetch, −1 when the finger went past the last row — the signal that ends every cursor loop.</li>
<li>CLOSE releases the result; DEALLOCATE deletes the cursor's definition (without it, declaring the same name again fails).</li>
</ul>
<div class="pitfall"><strong>When NOT to use a cursor.</strong> SQL is built to work on whole sets: one UPDATE of 10 000 rows is one operation; a cursor doing 10 000 single-row UPDATEs is 10 000 operations — often 100× slower. Use a cursor only when each row needs a different <em>action</em> (call a procedure per row, print a report line). The PE may ask for one; at work, look for the set-based statement first (slide 50).</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> cursors live inside a PL/pgSQL block: <code>name SCROLL CURSOR FOR …</code> in DECLARE, the same FETCH directions, <code>FOUND</code> instead of @@FETCH_STATUS, and no DEALLOCATE (freed at the end of the block):
<pre><code class="language-sql">DO $$
DECLARE
    dep_cursor SCROLL CURSOR FOR SELECT depNum, depName FROM tblDepartment ORDER BY depNum;
    r RECORD;
BEGIN
    OPEN dep_cursor;
    FETCH LAST  FROM dep_cursor INTO r;  RAISE NOTICE 'LAST  -&gt; % %', r.depNum, r.depName;
    FETCH PRIOR FROM dep_cursor INTO r;  RAISE NOTICE 'PRIOR -&gt; % %', r.depNum, r.depName;
    FETCH FIRST FROM dep_cursor INTO r;  RAISE NOTICE 'FIRST -&gt; % %', r.depNum, r.depName;
    FETCH NEXT  FROM dep_cursor INTO r;  RAISE NOTICE 'NEXT  -&gt; % %', r.depNum, r.depName;
    FETCH LAST  FROM dep_cursor INTO r;
    FETCH NEXT  FROM dep_cursor INTO r;
    RAISE NOTICE 'past the end: FOUND = %', FOUND;   -- FOUND replaces @@FETCH_STATUS
    CLOSE dep_cursor;                                 -- no DEALLOCATE: freed at the end of the block
END $$;</code></pre>
<div class="out">NOTICE:  LAST  -&gt; 5 Phòng Nghiên cứu<br>
NOTICE:  PRIOR -&gt; 4 Phòng Hành chính<br>
NOTICE:  FIRST -&gt; 1 Phòng Phần mềm trong nước<br>
NOTICE:  NEXT  -&gt; 2 Phòng Phần mềm nước ngoài<br>
NOTICE:  past the end: FOUND = f</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions and PL/pgSQL</a>.</div>`,
        `<p class="y-chinh">🎯 Sáu bước của cursor: DECLARE tên CURSOR FOR SELECT…; OPEN; FETCH NEXT | PRIOR | FIRST | LAST FROM cursor INTO @biến; kiểm @@FETCH_STATUS (0 = thành công); CLOSE; DEALLOCATE.</p>
<p>Cursor là ngón tay đặt trên một kết quả: DECLARE viết ra danh sách, OPEN in nó ra, mỗi FETCH (lấy) dịch ngón tay và chép dòng hiện tại vào các biến. Đủ các hướng di chuyển của slide, trên bảng phòng ban (demo thêm vào):</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @depNum INT, @depName NVARCHAR(50)
-- 1. Khai báo. Cần SCROLL để dùng PRIOR / FIRST / LAST (cursor mặc định chỉ đi NEXT)
DECLARE dep_cursor CURSOR SCROLL FOR
    SELECT depNum, depName FROM tblDepartment ORDER BY depNum
-- 2. Mở: câu truy vấn chạy lúc này
OPEN dep_cursor
-- 3. Lấy dòng theo nhiều hướng
FETCH LAST  FROM dep_cursor INTO @depNum, @depName
PRINT N'LAST  -&gt; ' + CAST(@depNum AS VARCHAR) + N' ' + @depName
FETCH PRIOR FROM dep_cursor INTO @depNum, @depName
PRINT N'PRIOR -&gt; ' + CAST(@depNum AS VARCHAR) + N' ' + @depName
FETCH FIRST FROM dep_cursor INTO @depNum, @depName
PRINT N'FIRST -&gt; ' + CAST(@depNum AS VARCHAR) + N' ' + @depName
FETCH NEXT  FROM dep_cursor INTO @depNum, @depName
PRINT N'NEXT  -&gt; ' + CAST(@depNum AS VARCHAR) + N' ' + @depName
-- 4. @@FETCH_STATUS: 0 = lấy được dòng, -1 = đã đi quá cuối
PRINT N'@@FETCH_STATUS = ' + CAST(@@FETCH_STATUS AS VARCHAR)
FETCH LAST FROM dep_cursor INTO @depNum, @depName
FETCH NEXT FROM dep_cursor INTO @depNum, @depName
PRINT N'after NEXT past the last row: @@FETCH_STATUS = ' + CAST(@@FETCH_STATUS AS VARCHAR)
-- 5. Đóng, 6. giải phóng bộ nhớ
CLOSE dep_cursor
DEALLOCATE dep_cursor</code></pre>
<div class="out">LAST  -&gt; 5 Phòng Nghiên cứu<br>
PRIOR -&gt; 4 Phòng Hành chính<br>
FIRST -&gt; 1 Phòng Phần mềm trong nước<br>
NEXT  -&gt; 2 Phòng Phần mềm nước ngoài<br>
@@FETCH_STATUS = 0<br>
after NEXT past the last row: @@FETCH_STATUS = -1</div>
<ul>
<li>PRIOR (dòng trước), FIRST (đầu), LAST (cuối) cần cursor <strong>SCROLL</strong> (cuộn được); cursor mặc định chỉ đi NEXT (dòng kế).</li>
<li><code>@@FETCH_STATUS</code> = 0 sau một lần lấy thành công, −1 khi ngón tay đã đi quá dòng cuối — tín hiệu kết thúc mọi vòng lặp cursor.</li>
<li>CLOSE (đóng) nhả kết quả; DEALLOCATE (giải phóng) xoá định nghĩa cursor (thiếu nó thì khai báo lại cùng tên sẽ lỗi).</li>
</ul>
<div class="pitfall"><strong>Khi nào KHÔNG nên dùng cursor.</strong> SQL được làm ra để xử lý cả tập: một câu UPDATE 10 000 dòng là một thao tác; cursor chạy 10 000 câu UPDATE từng dòng là 10 000 thao tác — thường chậm hơn cả trăm lần. Chỉ dùng cursor khi mỗi dòng cần một <em>hành động</em> khác nhau (gọi một thủ tục cho từng dòng, in một dòng báo cáo). Đề PE có thể đòi cursor; đi làm thì tìm câu lệnh theo tập hợp trước (slide 50).</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> cursor nằm trong một khối PL/pgSQL: <code>tên SCROLL CURSOR FOR …</code> trong phần DECLARE, cùng các hướng FETCH, <code>FOUND</code> thay cho @@FETCH_STATUS, và không có DEALLOCATE (tự giải phóng khi hết khối):
<pre><code class="language-sql">DO $$
DECLARE
    dep_cursor SCROLL CURSOR FOR SELECT depNum, depName FROM tblDepartment ORDER BY depNum;
    r RECORD;
BEGIN
    OPEN dep_cursor;
    FETCH LAST  FROM dep_cursor INTO r;  RAISE NOTICE 'LAST  -&gt; % %', r.depNum, r.depName;
    FETCH PRIOR FROM dep_cursor INTO r;  RAISE NOTICE 'PRIOR -&gt; % %', r.depNum, r.depName;
    FETCH FIRST FROM dep_cursor INTO r;  RAISE NOTICE 'FIRST -&gt; % %', r.depNum, r.depName;
    FETCH NEXT  FROM dep_cursor INTO r;  RAISE NOTICE 'NEXT  -&gt; % %', r.depNum, r.depName;
    FETCH LAST  FROM dep_cursor INTO r;
    FETCH NEXT  FROM dep_cursor INTO r;
    RAISE NOTICE 'past the end: FOUND = %', FOUND;   -- FOUND thay cho @@FETCH_STATUS
    CLOSE dep_cursor;                                 -- không có DEALLOCATE: tự giải phóng khi hết khối
END $$;</code></pre>
<div class="out">NOTICE:  LAST  -&gt; 5 Phòng Nghiên cứu<br>
NOTICE:  PRIOR -&gt; 4 Phòng Hành chính<br>
NOTICE:  FIRST -&gt; 1 Phòng Phần mềm trong nước<br>
NOTICE:  NEXT  -&gt; 2 Phòng Phần mềm nước ngoài<br>
NOTICE:  past the end: FOUND = f</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm và PL/pgSQL</a>.</div>`],
      [49, 'Example - print every employee with a cursor',
        `<p class="y-chinh">🎯 The standard cursor loop: fetch the first row, print "&lt;&lt;None&gt;&gt;" if there is none, then WHILE @@FETCH_STATUS = 0 — use the row, fetch the next — and finally CLOSE and DEALLOCATE.</p>
<p>The slide's code, copied from the image (plus SET NOCOUNT ON):</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- (not on the slide) hide the "(1 row affected)" lines
DECLARE @SSN DECIMAL, @FULLNAME NVARCHAR(50), @message NVARCHAR(200)
DECLARE employee_cursor CURSOR
FOR SELECT empSSN, empName FROM tblEmployee
OPEN employee_cursor
FETCH NEXT FROM employee_cursor INTO @SSN,@FULLNAME
IF @@FETCH_STATUS &lt;&gt; 0
    PRINT '         &lt;&lt;None&gt;&gt;'
WHILE @@FETCH_STATUS = 0
BEGIN
    SELECT @message = '         '+@FULLNAME
    PRINT @message
    FETCH NEXT FROM employee_cursor INTO @SSN,@FULLNAME
END
CLOSE employee_cursor
DEALLOCATE employee_cursor</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Trần Minh Quang<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hoàng Thị Hà<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Võ Việt Anh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lê Thị Lan Anh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mai Duy An<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Phạm Quốc Bảo<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hồ Ngọc Hân<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Đặng Tuấn Anh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nguyễn Thị Mai<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bùi Văn Nam<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Trương Thị Thu<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Huỳnh Văn Tài<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lý Thanh Tâm<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Phan Hữu Nghĩa</div>
<ol>
<li>DECLARE the variables and the cursor over <code>SELECT empSSN, empName FROM tblEmployee</code>.</li>
<li>OPEN, then one FETCH <em>before</em> the loop — the loop tests @@FETCH_STATUS of the previous fetch.</li>
<li><code>IF @@FETCH_STATUS &lt;&gt; 0 PRINT '&lt;&lt;None&gt;&gt;'</code> — the empty-result case.</li>
<li>In the loop: build the message, PRINT it, FETCH the next row — the FETCH at the end moves the loop forward.</li>
</ol>
<p>14 employees, printed in empSSN order only because the table is stored by its primary key; the query has no ORDER BY, so the order is not promised.</p>
<div class="pitfall">Forget the FETCH inside the loop and @@FETCH_STATUS stays 0 forever: the first name is printed endlessly. Forget the FETCH before the loop and nothing is printed.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the whole ritual (declare, open, fetch, test, close) is one statement: <code>FOR r IN SELECT … LOOP … END LOOP</code> — the form you will use at work:
<pre><code class="language-sql">DO $$
DECLARE r RECORD; v_count INT := 0;
BEGIN
    -- FOR ... IN SELECT: declare + open + fetch + loop + close, all in one
    FOR r IN SELECT empSSN, empName FROM tblEmployee ORDER BY empSSN LOOP
        RAISE NOTICE '         %', r.empName;
        v_count := v_count + 1;
    END LOOP;
    IF v_count = 0 THEN RAISE NOTICE '         &lt;&lt;None&gt;&gt;'; END IF;
END $$;</code></pre>
<div class="out">NOTICE:           Trần Minh Quang<br>
NOTICE:           Hoàng Thị Hà<br>
NOTICE:           Võ Việt Anh<br>
NOTICE:           Lê Thị Lan Anh<br>
NOTICE:           Mai Duy An<br>
NOTICE:           Phạm Quốc Bảo<br>
NOTICE:           Hồ Ngọc Hân<br>
NOTICE:           Đặng Tuấn Anh<br>
NOTICE:           Nguyễn Thị Mai<br>
NOTICE:           Bùi Văn Nam<br>
NOTICE:           Trương Thị Thu<br>
NOTICE:           Huỳnh Văn Tài<br>
NOTICE:           Lý Thanh Tâm<br>
NOTICE:           Phan Hữu Nghĩa</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions and PL/pgSQL</a>.</div>`,
        `<p class="y-chinh">🎯 Vòng lặp cursor chuẩn: lấy dòng đầu, không có thì in "&lt;&lt;None&gt;&gt;", rồi WHILE @@FETCH_STATUS = 0 — dùng dòng hiện tại, lấy dòng kế — cuối cùng CLOSE và DEALLOCATE.</p>
<p>Code của slide, chép từ ảnh (thêm SET NOCOUNT ON):</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- (không có trên slide) tắt các dòng "(1 row affected)"
DECLARE @SSN DECIMAL, @FULLNAME NVARCHAR(50), @message NVARCHAR(200)
DECLARE employee_cursor CURSOR
FOR SELECT empSSN, empName FROM tblEmployee
OPEN employee_cursor
FETCH NEXT FROM employee_cursor INTO @SSN,@FULLNAME
IF @@FETCH_STATUS &lt;&gt; 0
    PRINT '         &lt;&lt;None&gt;&gt;'
WHILE @@FETCH_STATUS = 0
BEGIN
    SELECT @message = '         '+@FULLNAME
    PRINT @message
    FETCH NEXT FROM employee_cursor INTO @SSN,@FULLNAME
END
CLOSE employee_cursor
DEALLOCATE employee_cursor</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Trần Minh Quang<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hoàng Thị Hà<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Võ Việt Anh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lê Thị Lan Anh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mai Duy An<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Phạm Quốc Bảo<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hồ Ngọc Hân<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Đặng Tuấn Anh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nguyễn Thị Mai<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bùi Văn Nam<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Trương Thị Thu<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Huỳnh Văn Tài<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lý Thanh Tâm<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Phan Hữu Nghĩa</div>
<ol>
<li>DECLARE các biến và cursor trên <code>SELECT empSSN, empName FROM tblEmployee</code>.</li>
<li>OPEN, rồi một lần FETCH <em>trước</em> vòng lặp — vòng lặp kiểm @@FETCH_STATUS của lần lấy trước đó.</li>
<li><code>IF @@FETCH_STATUS &lt;&gt; 0 PRINT '&lt;&lt;None&gt;&gt;'</code> — trường hợp kết quả rỗng.</li>
<li>Trong vòng lặp: ghép thông báo, PRINT, FETCH dòng kế — câu FETCH ở cuối là thứ đẩy vòng lặp đi tới.</li>
</ol>
<p>14 nhân viên, in theo thứ tự empSSN chỉ vì bảng được lưu theo khoá chính; câu truy vấn không có ORDER BY, nên thứ tự không được hứa trước.</p>
<div class="pitfall">Quên FETCH trong vòng lặp thì @@FETCH_STATUS mãi là 0: tên đầu tiên được in vô tận. Quên FETCH trước vòng lặp thì không in được gì.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> cả nghi thức đó (khai báo, mở, lấy, kiểm, đóng) gói trong một câu: <code>FOR r IN SELECT … LOOP … END LOOP</code> — dạng bạn sẽ dùng khi đi làm:
<pre><code class="language-sql">DO $$
DECLARE r RECORD; v_count INT := 0;
BEGIN
    -- FOR ... IN SELECT: khai báo + mở + lấy + lặp + đóng, gộp làm một
    FOR r IN SELECT empSSN, empName FROM tblEmployee ORDER BY empSSN LOOP
        RAISE NOTICE '         %', r.empName;
        v_count := v_count + 1;
    END LOOP;
    IF v_count = 0 THEN RAISE NOTICE '         &lt;&lt;None&gt;&gt;'; END IF;
END $$;</code></pre>
<div class="out">NOTICE:           Trần Minh Quang<br>
NOTICE:           Hoàng Thị Hà<br>
NOTICE:           Võ Việt Anh<br>
NOTICE:           Lê Thị Lan Anh<br>
NOTICE:           Mai Duy An<br>
NOTICE:           Phạm Quốc Bảo<br>
NOTICE:           Hồ Ngọc Hân<br>
NOTICE:           Đặng Tuấn Anh<br>
NOTICE:           Nguyễn Thị Mai<br>
NOTICE:           Bùi Văn Nam<br>
NOTICE:           Trương Thị Thu<br>
NOTICE:           Huỳnh Văn Tài<br>
NOTICE:           Lý Thanh Tâm<br>
NOTICE:           Phan Hữu Nghĩa</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm và PL/pgSQL</a>.</div>`],
      [50, 'Example - a procedure with a cursor',
        `<p class="y-chinh">🎯 A procedure that walks through the projects of department @dep1 with a cursor and moves each one: to @dep2 if it is located in @loc2, to @dep3 if it is located in @loc3.</p>
<p>The slide's code, copied from the image, with the table before and after (added):</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- (not on the slide)
-- (added) before: projects of department 2 and where they are
SELECT p.proNum, p.proName, l.locName, p.depNum
FROM tblProject p, tblLocation l WHERE p.locNum = l.locNum ORDER BY p.proNum;
GO
IF OBJECT_ID ( 'psm_Change_Of_Project', 'P' ) IS NOT NULL
    DROP PROCEDURE psm_Change_Of_Project;
GO
CREATE PROCEDURE psm_Change_Of_Project
    @dep1 INT,
    @dep2 INT,
    @loc2 NVARCHAR(50),
    @dep3 INT,
    @loc3 NVARCHAR(50)
AS
    DECLARE @pnum INT, @locname NVARCHAR(50)
    DECLARE pro_cursor CURSOR FOR SELECT p.proNum, l.locName
                                  FROM tblProject p, tblLocation l
                                  WHERE p.locNum=l.locNum AND p.depNum = @dep1;

    OPEN pro_cursor;
    FETCH NEXT FROM pro_cursor INTO @pnum,@locname
    IF @@FETCH_STATUS &lt;&gt; 0
        PRINT '         &lt;&lt;None&gt;&gt;'
    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF @locname = @loc2
            UPDATE tblProject SET depNum=@dep2 WHERE proNum=@pnum;
        ELSE IF @locname = @loc3
            UPDATE tblProject SET depNum=@dep3 WHERE proNum=@pnum;

        FETCH NEXT FROM pro_cursor INTO @pnum,@locname
    END
CLOSE pro_cursor
DEALLOCATE pro_cursor
GO
EXEC psm_Change_Of_Project 2,1,N'TP Hà Nội',3,N'TP Hồ Chí Minh';
GO
-- (added) after
SELECT p.proNum, p.proName, l.locName, p.depNum
FROM tblProject p, tblLocation l WHERE p.locNum = l.locNum ORDER BY p.proNum;
-- (added) call it again: department 2 has no project left
EXEC psm_Change_Of_Project 2,1,N'TP Hà Nội',3,N'TP Hồ Chí Minh';</code></pre>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>locName</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>TP Hà Nội</td><td>1</td></tr>
<tr><td>2</td><td>ProjectB</td><td>TP Hồ Chí Minh</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>TP Hà Nội</td><td>2</td></tr>
<tr><td>4</td><td>ProjectD</td><td>TP Hồ Chí Minh</td><td>2</td></tr>
<tr><td>5</td><td>ProjectE</td><td>TP Đà Nẵng</td><td>3</td></tr>
<tr><td>6</td><td>ProjectF</td><td>TP Hồ Chí Minh</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>locName</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>TP Hà Nội</td><td>1</td></tr>
<tr><td>2</td><td>ProjectB</td><td>TP Hồ Chí Minh</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>TP Hà Nội</td><td>1</td></tr>
<tr><td>4</td><td>ProjectD</td><td>TP Hồ Chí Minh</td><td>3</td></tr>
<tr><td>5</td><td>ProjectE</td><td>TP Đà Nẵng</td><td>3</td></tr>
<tr><td>6</td><td>ProjectF</td><td>TP Hồ Chí Minh</td><td>4</td></tr>
</tbody>
</table>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;&lt;None&gt;&gt;</div>
<ul>
<li>The cursor's SELECT uses the parameter @dep1 — a cursor inside a procedure can depend on its inputs.</li>
<li><code>EXEC psm_Change_Of_Project 2,1,N'TP Hà Nội',3,N'TP Hồ Chí Minh'</code>: department 2 has ProjectC (Hà Nội) ⇒ department 1, and ProjectD (Hồ Chí Minh) ⇒ department 3.</li>
<li>Called a second time, department 2 has no project left ⇒ the first FETCH fails ⇒ "&lt;&lt;None&gt;&gt;".</li>
<li>On the slide, CLOSE and DEALLOCATE are written without indentation but before GO — they are still part of the procedure.</li>
</ul>
<p>The same job without a cursor — one UPDATE with a CASE (compare the final table):</p>
<pre><code class="language-sql">-- (added) the SAME job without a cursor: one UPDATE with CASE
UPDATE p
SET    p.depNum = CASE l.locName WHEN N'TP Hà Nội'      THEN 1
                                 WHEN N'TP Hồ Chí Minh' THEN 3 END
FROM   tblProject p JOIN tblLocation l ON l.locNum = p.locNum
WHERE  p.depNum = 2 AND l.locName IN (N'TP Hà Nội', N'TP Hồ Chí Minh');
SELECT proNum, proName, depNum FROM tblProject ORDER BY proNum;</code></pre>
<div class="out">(2 rows affected)</div>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>1</td></tr>
<tr><td>2</td><td>ProjectB</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>1</td></tr>
<tr><td>4</td><td>ProjectD</td><td>3</td></tr>
<tr><td>5</td><td>ProjectE</td><td>3</td></tr>
<tr><td>6</td><td>ProjectF</td><td>4</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>On PostgreSQL</strong>: a procedure with a <code>FOR r IN SELECT … LOOP</code> and <code>ELSIF</code>, called with CALL:
<pre><code class="language-sql">CREATE PROCEDURE psm_change_of_project(p_dep1 INT, p_dep2 INT, p_loc2 VARCHAR, p_dep3 INT, p_loc3 VARCHAR)
LANGUAGE plpgsql
AS $$
DECLARE r RECORD; v_found BOOLEAN := false;
BEGIN
    FOR r IN SELECT p.proNum, l.locName
             FROM tblProject p JOIN tblLocation l ON p.locNum = l.locNum
             WHERE p.depNum = p_dep1 LOOP
        v_found := true;
        IF r.locName = p_loc2 THEN
            UPDATE tblProject SET depNum = p_dep2 WHERE proNum = r.proNum;
        ELSIF r.locName = p_loc3 THEN
            UPDATE tblProject SET depNum = p_dep3 WHERE proNum = r.proNum;
        END IF;
    END LOOP;
    IF NOT v_found THEN RAISE NOTICE '         &lt;&lt;None&gt;&gt;'; END IF;
END $$;
CALL psm_change_of_project(2, 1, 'TP Hà Nội', 3, 'TP Hồ Chí Minh');
SELECT p.proNum, p.proName, l.locName, p.depNum
FROM tblProject p JOIN tblLocation l ON p.locNum = l.locNum ORDER BY p.proNum;
CALL psm_change_of_project(2, 1, 'TP Hà Nội', 3, 'TP Hồ Chí Minh');</code></pre>
<div class="out">NOTICE:           &lt;&lt;None&gt;&gt;</div>
<table>
<thead><tr><th>pronum</th><th>proname</th><th>locname</th><th>depnum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>TP Hà Nội</td><td>1</td></tr>
<tr><td>2</td><td>ProjectB</td><td>TP Hồ Chí Minh</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>TP Hà Nội</td><td>1</td></tr>
<tr><td>4</td><td>ProjectD</td><td>TP Hồ Chí Minh</td><td>3</td></tr>
<tr><td>5</td><td>ProjectE</td><td>TP Đà Nẵng</td><td>3</td></tr>
<tr><td>6</td><td>ProjectF</td><td>TP Hồ Chí Minh</td><td>4</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions and procedures</a>.</div>`,
        `<p class="y-chinh">🎯 Một thủ tục dùng cursor đi qua các dự án của phòng @dep1 và chuyển từng dự án: sang @dep2 nếu nó đặt ở @loc2, sang @dep3 nếu nó đặt ở @loc3.</p>
<p>Code của slide, chép từ ảnh, kèm bảng trước và sau (thêm vào):</p>
<pre><code class="language-sql">SET NOCOUNT ON   -- (không có trên slide)
-- (thêm) trước: dự án của phòng 2 và nơi đặt
SELECT p.proNum, p.proName, l.locName, p.depNum
FROM tblProject p, tblLocation l WHERE p.locNum = l.locNum ORDER BY p.proNum;
GO
IF OBJECT_ID ( 'psm_Change_Of_Project', 'P' ) IS NOT NULL
    DROP PROCEDURE psm_Change_Of_Project;
GO
CREATE PROCEDURE psm_Change_Of_Project
    @dep1 INT,
    @dep2 INT,
    @loc2 NVARCHAR(50),
    @dep3 INT,
    @loc3 NVARCHAR(50)
AS
    DECLARE @pnum INT, @locname NVARCHAR(50)
    DECLARE pro_cursor CURSOR FOR SELECT p.proNum, l.locName
                                  FROM tblProject p, tblLocation l
                                  WHERE p.locNum=l.locNum AND p.depNum = @dep1;

    OPEN pro_cursor;
    FETCH NEXT FROM pro_cursor INTO @pnum,@locname
    IF @@FETCH_STATUS &lt;&gt; 0
        PRINT '         &lt;&lt;None&gt;&gt;'
    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF @locname = @loc2
            UPDATE tblProject SET depNum=@dep2 WHERE proNum=@pnum;
        ELSE IF @locname = @loc3
            UPDATE tblProject SET depNum=@dep3 WHERE proNum=@pnum;

        FETCH NEXT FROM pro_cursor INTO @pnum,@locname
    END
CLOSE pro_cursor
DEALLOCATE pro_cursor
GO
EXEC psm_Change_Of_Project 2,1,N'TP Hà Nội',3,N'TP Hồ Chí Minh';
GO
-- (thêm) sau
SELECT p.proNum, p.proName, l.locName, p.depNum
FROM tblProject p, tblLocation l WHERE p.locNum = l.locNum ORDER BY p.proNum;
-- (thêm) gọi lần nữa: phòng 2 không còn dự án nào
EXEC psm_Change_Of_Project 2,1,N'TP Hà Nội',3,N'TP Hồ Chí Minh';</code></pre>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>locName</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>TP Hà Nội</td><td>1</td></tr>
<tr><td>2</td><td>ProjectB</td><td>TP Hồ Chí Minh</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>TP Hà Nội</td><td>2</td></tr>
<tr><td>4</td><td>ProjectD</td><td>TP Hồ Chí Minh</td><td>2</td></tr>
<tr><td>5</td><td>ProjectE</td><td>TP Đà Nẵng</td><td>3</td></tr>
<tr><td>6</td><td>ProjectF</td><td>TP Hồ Chí Minh</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>locName</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>TP Hà Nội</td><td>1</td></tr>
<tr><td>2</td><td>ProjectB</td><td>TP Hồ Chí Minh</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>TP Hà Nội</td><td>1</td></tr>
<tr><td>4</td><td>ProjectD</td><td>TP Hồ Chí Minh</td><td>3</td></tr>
<tr><td>5</td><td>ProjectE</td><td>TP Đà Nẵng</td><td>3</td></tr>
<tr><td>6</td><td>ProjectF</td><td>TP Hồ Chí Minh</td><td>4</td></tr>
</tbody>
</table>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;&lt;None&gt;&gt;</div>
<ul>
<li>Câu SELECT của cursor dùng tham số @dep1 — cursor trong thủ tục có thể phụ thuộc đầu vào.</li>
<li><code>EXEC psm_Change_Of_Project 2,1,N'TP Hà Nội',3,N'TP Hồ Chí Minh'</code>: phòng 2 có ProjectC (Hà Nội) ⇒ sang phòng 1, và ProjectD (Hồ Chí Minh) ⇒ sang phòng 3.</li>
<li>Gọi lần thứ hai, phòng 2 không còn dự án nào ⇒ lần FETCH đầu thất bại ⇒ "&lt;&lt;None&gt;&gt;".</li>
<li>Trên slide, CLOSE và DEALLOCATE viết không thụt lề nhưng đứng trước GO — chúng vẫn thuộc thân thủ tục.</li>
</ul>
<p>Cùng việc đó không cần cursor — một câu UPDATE với CASE (so bảng cuối):</p>
<pre><code class="language-sql">-- (thêm) CÙNG việc đó không cần cursor: một câu UPDATE với CASE
UPDATE p
SET    p.depNum = CASE l.locName WHEN N'TP Hà Nội'      THEN 1
                                 WHEN N'TP Hồ Chí Minh' THEN 3 END
FROM   tblProject p JOIN tblLocation l ON l.locNum = p.locNum
WHERE  p.depNum = 2 AND l.locName IN (N'TP Hà Nội', N'TP Hồ Chí Minh');
SELECT proNum, proName, depNum FROM tblProject ORDER BY proNum;</code></pre>
<div class="out">(2 rows affected)</div>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>1</td></tr>
<tr><td>2</td><td>ProjectB</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>1</td></tr>
<tr><td>4</td><td>ProjectD</td><td>3</td></tr>
<tr><td>5</td><td>ProjectE</td><td>3</td></tr>
<tr><td>6</td><td>ProjectF</td><td>4</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>: thủ tục có vòng <code>FOR r IN SELECT … LOOP</code> và <code>ELSIF</code>, gọi bằng CALL:
<pre><code class="language-sql">CREATE PROCEDURE psm_change_of_project(p_dep1 INT, p_dep2 INT, p_loc2 VARCHAR, p_dep3 INT, p_loc3 VARCHAR)
LANGUAGE plpgsql
AS $$
DECLARE r RECORD; v_found BOOLEAN := false;
BEGIN
    FOR r IN SELECT p.proNum, l.locName
             FROM tblProject p JOIN tblLocation l ON p.locNum = l.locNum
             WHERE p.depNum = p_dep1 LOOP
        v_found := true;
        IF r.locName = p_loc2 THEN
            UPDATE tblProject SET depNum = p_dep2 WHERE proNum = r.proNum;
        ELSIF r.locName = p_loc3 THEN
            UPDATE tblProject SET depNum = p_dep3 WHERE proNum = r.proNum;
        END IF;
    END LOOP;
    IF NOT v_found THEN RAISE NOTICE '         &lt;&lt;None&gt;&gt;'; END IF;
END $$;
CALL psm_change_of_project(2, 1, 'TP Hà Nội', 3, 'TP Hồ Chí Minh');
SELECT p.proNum, p.proName, l.locName, p.depNum
FROM tblProject p JOIN tblLocation l ON p.locNum = l.locNum ORDER BY p.proNum;
CALL psm_change_of_project(2, 1, 'TP Hà Nội', 3, 'TP Hồ Chí Minh');</code></pre>
<div class="out">NOTICE:           &lt;&lt;None&gt;&gt;</div>
<table>
<thead><tr><th>pronum</th><th>proname</th><th>locname</th><th>depnum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>TP Hà Nội</td><td>1</td></tr>
<tr><td>2</td><td>ProjectB</td><td>TP Hồ Chí Minh</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>TP Hà Nội</td><td>1</td></tr>
<tr><td>4</td><td>ProjectD</td><td>TP Hồ Chí Minh</td><td>3</td></tr>
<tr><td>5</td><td>ProjectE</td><td>TP Đà Nẵng</td><td>3</td></tr>
<tr><td>6</td><td>ProjectF</td><td>TP Hồ Chí Minh</td><td>4</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm và thủ tục</a>.</div>`],
      [51, 'Example - cursor over department 1',
        `<p class="y-chinh">🎯 A cursor over the SSN, name and salary of the employees of department 1, printing one line per employee with CAST for the numbers.</p>
<p>The slide's code, copied from the image:</p>
<pre><code class="language-sql">DECLARE @EmployeeID DECIMAL(18,0);
DECLARE @EmployeeName NVARCHAR(50), @SALARY DECIMAL(10,0);
DECLARE myCursor CURSOR FOR
            SELECT empSSN, empName, empSalary
            FROM tblEMPLOYEE
            WHERE depNum=1;
OPEN myCursor;
FETCH NEXT FROM myCursor INTO @EmployeeID,@EmployeeName,@Salary;
IF @@FETCH_STATUS &lt;&gt; 0
    PRINT '         &lt;&lt;NONE&gt;&gt;';
WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT cast(@EmployeeID as nvarchar(50))+'          '+
    @EmployeeName+'          '+cast(@Salary as nvarchar(50));
    FETCH NEXT FROM myCursor INTO @EmployeeID,@EmployeeName,@Salary;
END
CLOSE myCursor;
DEALLOCATE myCursor;</code></pre>
<div class="out">30121050001          Trần Minh Quang          150000<br>
30121050002          Hoàng Thị Hà          90000<br>
30121050003          Võ Việt Anh          60000<br>
30121050004          Lê Thị Lan Anh          45000</div>
<ul>
<li><code>DECLARE @EmployeeID DECIMAL(18,0)</code> — the variables have exactly the types of the columns (SSN, NVARCHAR(50), DECIMAL(10,0)); FETCH … INTO fills them in the order of the SELECT list.</li>
<li><code>@SALARY</code> is declared in upper case and used as <code>@Salary</code> — accepted because the server's collation is case-insensitive (on a server installed with a case-sensitive collation it would be an error).</li>
<li><code>cast(@EmployeeID as nvarchar(50))+' … '+@EmployeeName</code> — the numbers are converted before joining (slide 7).</li>
</ul>
<p class="meo">🧠 Everything this cursor prints, one SELECT gives as a grid: <code>SELECT empSSN, empName, empSalary FROM tblEmployee WHERE depNum = 1</code>. A cursor is justified when each line needs an action, not to display rows.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong>, the long form step by step — <code>OPEN</code>, <code>FETCH … INTO</code>, <code>EXIT WHEN NOT FOUND</code>, <code>CLOSE</code>:
<pre><code class="language-sql">DO $$
DECLARE
    my_cursor CURSOR FOR SELECT empSSN, empName, empSalary
                         FROM tblEmployee WHERE depNum = 1 ORDER BY empSSN;
    v_id NUMERIC(18,0); v_name VARCHAR(50); v_salary NUMERIC(10,0);
BEGIN
    OPEN my_cursor;                                   -- the long way, step by step like T-SQL
    LOOP
        FETCH my_cursor INTO v_id, v_name, v_salary;
        EXIT WHEN NOT FOUND;                          -- = WHILE @@FETCH_STATUS = 0
        RAISE NOTICE '%          %          %', v_id, v_name, v_salary;
    END LOOP;
    CLOSE my_cursor;
END $$;</code></pre>
<div class="out">NOTICE:  30121050001          Trần Minh Quang          150000<br>
NOTICE:  30121050002          Hoàng Thị Hà          90000<br>
NOTICE:  30121050003          Võ Việt Anh          60000<br>
NOTICE:  30121050004          Lê Thị Lan Anh          45000</div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions and PL/pgSQL</a>.</div>`,
        `<p class="y-chinh">🎯 Một cursor đi qua mã SSN, tên và lương của nhân viên phòng 1, in mỗi nhân viên một dòng, dùng CAST cho các con số.</p>
<p>Code của slide, chép từ ảnh:</p>
<pre><code class="language-sql">DECLARE @EmployeeID DECIMAL(18,0);
DECLARE @EmployeeName NVARCHAR(50), @SALARY DECIMAL(10,0);
DECLARE myCursor CURSOR FOR
            SELECT empSSN, empName, empSalary
            FROM tblEMPLOYEE
            WHERE depNum=1;
OPEN myCursor;
FETCH NEXT FROM myCursor INTO @EmployeeID,@EmployeeName,@Salary;
IF @@FETCH_STATUS &lt;&gt; 0
    PRINT '         &lt;&lt;NONE&gt;&gt;';
WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT cast(@EmployeeID as nvarchar(50))+'          '+
    @EmployeeName+'          '+cast(@Salary as nvarchar(50));
    FETCH NEXT FROM myCursor INTO @EmployeeID,@EmployeeName,@Salary;
END
CLOSE myCursor;
DEALLOCATE myCursor;</code></pre>
<div class="out">30121050001          Trần Minh Quang          150000<br>
30121050002          Hoàng Thị Hà          90000<br>
30121050003          Võ Việt Anh          60000<br>
30121050004          Lê Thị Lan Anh          45000</div>
<ul>
<li><code>DECLARE @EmployeeID DECIMAL(18,0)</code> — các biến có đúng kiểu của các cột (SSN, NVARCHAR(50), DECIMAL(10,0)); FETCH … INTO điền chúng theo thứ tự danh sách SELECT.</li>
<li><code>@SALARY</code> khai báo chữ hoa mà dùng là <code>@Salary</code> — vẫn chạy vì collation (bộ luật so sánh chữ) của máy chủ không phân biệt hoa thường (máy chủ cài collation có phân biệt hoa thường thì sẽ báo lỗi).</li>
<li><code>cast(@EmployeeID as nvarchar(50))+' … '+@EmployeeName</code> — số được đổi sang chữ trước khi nối (slide 7).</li>
</ul>
<p class="meo">🧠 Mọi thứ cursor này in ra, một câu SELECT cho ra dạng bảng: <code>SELECT empSSN, empName, empSalary FROM tblEmployee WHERE depNum = 1</code>. Cursor chỉ đáng dùng khi mỗi dòng cần một hành động, không phải để hiển thị dòng.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>, dạng dài từng bước — <code>OPEN</code>, <code>FETCH … INTO</code>, <code>EXIT WHEN NOT FOUND</code>, <code>CLOSE</code>:
<pre><code class="language-sql">DO $$
DECLARE
    my_cursor CURSOR FOR SELECT empSSN, empName, empSalary
                         FROM tblEmployee WHERE depNum = 1 ORDER BY empSSN;
    v_id NUMERIC(18,0); v_name VARCHAR(50); v_salary NUMERIC(10,0);
BEGIN
    OPEN my_cursor;                                   -- cách dài, từng bước như T-SQL
    LOOP
        FETCH my_cursor INTO v_id, v_name, v_salary;
        EXIT WHEN NOT FOUND;                          -- = WHILE @@FETCH_STATUS = 0
        RAISE NOTICE '%          %          %', v_id, v_name, v_salary;
    END LOOP;
    CLOSE my_cursor;
END $$;</code></pre>
<div class="out">NOTICE:  30121050001          Trần Minh Quang          150000<br>
NOTICE:  30121050002          Hoàng Thị Hà          90000<br>
NOTICE:  30121050003          Võ Việt Anh          60000<br>
NOTICE:  30121050004          Lê Thị Lan Anh          45000</div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm và PL/pgSQL</a>.</div>`],
    ]),
    bi(`<h3>Trigger or not? Cursor or not? The two checklists</h3>
<table>
<thead><tr><th>Before writing a trigger, ask</th><th>Before writing a cursor, ask</th></tr></thead>
<tbody>
<tr><td>Can a PK / FK / CHECK / DEFAULT express the rule? Then use it.</td><td>Can one UPDATE / INSERT … SELECT / DELETE with a JOIN or CASE do it? Then use it.</td></tr>
<tr><td>Is inserted handled as a TABLE (EXISTS, JOIN), not a variable?</td><td>Does each row need a different action (call a procedure, print a line)?</td></tr>
<tr><td>Refusing? RAISERROR + ROLLBACK, both inside BEGIN…END.</td><td>FETCH before the loop and at the end of the loop?</td></tr>
<tr><td>Is it small and fast? It runs inside every user's transaction.</td><td>CLOSE and DEALLOCATE at the end?</td></tr>
</tbody>
</table>
<p>Older lesson on the same topic: <strong>7.4 — Triggers &amp; cursors (and when not to use them)</strong> (an audit trigger and a timed comparison cursor vs set-based UPDATE). Next: the practice lesson 7.5 — PE-style procedures, functions, triggers and cursors on FUHCompany.</p>`,
    `<h3>Có nên viết trigger? Có nên dùng cursor? Hai bảng tự hỏi</h3>
<table>
<thead><tr><th>Trước khi viết trigger, hỏi</th><th>Trước khi viết cursor, hỏi</th></tr></thead>
<tbody>
<tr><td>PK / FK / CHECK / DEFAULT có diễn đạt được luật không? Được thì dùng nó.</td><td>Một câu UPDATE / INSERT … SELECT / DELETE có JOIN hoặc CASE làm được không? Được thì dùng nó.</td></tr>
<tr><td>inserted có được xử lý như một BẢNG (EXISTS, JOIN) chứ không phải một biến?</td><td>Mỗi dòng có cần một hành động khác nhau (gọi thủ tục, in một dòng)?</td></tr>
<tr><td>Từ chối? RAISERROR + ROLLBACK, cả hai trong BEGIN…END.</td><td>Có FETCH trước vòng lặp và ở cuối vòng lặp chưa?</td></tr>
<tr><td>Nó có nhỏ và nhanh không? Nó chạy bên trong giao dịch của mọi người dùng.</td><td>Có CLOSE và DEALLOCATE ở cuối chưa?</td></tr>
</tbody>
</table>
<p>Bài cũ cùng chủ đề: <strong>7.4 — Trigger &amp; cursor (và khi nào đừng dùng)</strong> (trigger ghi nhật ký kiểm toán và phép so thời gian cursor với UPDATE theo tập hợp). Tiếp theo: bài thực hành 7.5 — thủ tục, hàm, trigger, cursor kiểu đề PE trên FUHCompany.</p>`),
    books([
      ['ullman', 'Ullman &amp; Widom, A First Course in Database Systems — 7.5 Triggers (the NetWorthTrigger example, options of trigger design), 9.3.4–9.3.5 Cursors', 'Ullman &amp; Widom, A First Course in Database Systems — 7.5 Trigger (ví dụ NetWorthTrigger, các lựa chọn thiết kế trigger), 9.3.4–9.3.5 Cursor'],
      ['ramakrishnan', 'Ramakrishnan &amp; Gehrke, Database Management Systems — 5.8 Triggers and active databases, 6.1.2 Cursors', 'Ramakrishnan &amp; Gehrke, Database Management Systems — 5.8 Trigger và CSDL chủ động, 6.1.2 Cursor'],
    ]),
  ].join('\n'),
};

/* ───────── 7.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Procedures, functions, triggers & cursors ───────── */
const L_on_ch7 = {
  title: '7.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Procedures, functions, triggers & cursors|||7.5 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Thủ tục, hàm, trigger & cursor',
  slug: 'dbi202-on-ch7',
  type: 'VIDEO',
  description: '7 bài tập đúng dạng câu lập trình của đề PE trên CSDL FUHCompany: thủ tục có tham số OUTPUT trả tổng lương phòng và mã RETURN, thủ tục thêm nhân viên vào dự án trong một giao dịch có TRY…CATCH, hàm vô hướng đếm dự án, hàm trả bảng theo địa điểm, trigger chặn lương vượt trưởng phòng (và cái bẫy UPDATE(cột)), trigger ghi nhật ký khi xoá / đổi lương, cursor tăng lương theo giờ làm so với một câu UPDATE cho cùng kết quả — mỗi bài: đề, hướng nghĩ, lời giải chạy thật, lệnh gọi thử + kết quả thật, bẫy mất điểm, bản PostgreSQL chạy thật; bảng T-SQL ↔ PostgreSQL cho lập trình; 20 thuật ngữ; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.5 · Practice &amp; review</span>
<h2>Programming the database — practise like the last PE questions</h2>
<p class="lead">Seven exercises in the style of the practical exam (PE, 85 minutes), whose last one or two questions are nearly always "create a stored procedure / function / trigger that …". Every solution below really ran on SQL Server over FUHCompany, and was then <strong>called</strong> to show its effect; the PostgreSQL version of each one ran too.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read the task only. Write your own solution in SSMS — about 10 minutes per exercise.</li>
<li>Run it, then run the test calls of the solution: do you get the same real output (same rows, same errors)?</li>
<li>Read the trap under each solution — they are the mistakes that cost PE marks.</li>
</ol></div>
<p>A reminder of the tables (full diagram: lesson 7.A, slide 4): tblEmployee(empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) · tblDepartment(depNum, depName, mgrSSN, mgrAssDate) · tblProject(proNum, proName, locNum, depNum) · tblWorksOn(empSSN, proNum, workHours) · tblLocation(locNum, locName).</p>
<table>
<thead><tr><th>PE habit</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>GO</code> before and after every CREATE PROCEDURE / FUNCTION / TRIGGER</td><td>CREATE … must be the first statement of its batch, and everything until GO becomes its body</td></tr>
<tr><td><code>IF OBJECT_ID('name', 'P' / 'FN' / 'TR') IS NOT NULL DROP …</code> (or <code>CREATE OR ALTER</code>)</td><td>you will run your script many times</td></tr>
<tr><td>Test every object with a real call right after creating it</td><td>the marker runs EXEC / SELECT / INSERT — an object that was never called is often broken</td></tr>
<tr><td>Trigger: treat <code>inserted</code> / <code>deleted</code> as tables (EXISTS, JOIN)</td><td>one INSERT or UPDATE may touch many rows</td></tr>
<tr><td>Refusing in a trigger = RAISERROR + ROLLBACK inside BEGIN…END</td><td>RAISERROR alone keeps the row</td></tr>
<tr><td>OUTPUT written both in CREATE and in EXEC</td><td>missing at the call ⇒ the variable stays unchanged</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Bài 7.5 · Thực hành &amp; ôn tập</span>
<h2>Lập trình trong CSDL — luyện đúng như các câu cuối của đề PE</h2>
<p class="lead">Bảy bài tập theo kiểu đề thi thực hành (PE, 85 phút), mà một hai câu cuối gần như luôn là "tạo stored procedure / function / trigger để …". Mọi lời giải bên dưới đã chạy thật trên SQL Server với CSDL FUHCompany, rồi được <strong>gọi thử</strong> để thấy tác dụng; bản PostgreSQL của từng bài cũng đã chạy.</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Chỉ đọc đề. Tự viết lời giải trong SSMS — khoảng 10 phút mỗi bài.</li>
<li>Chạy nó, rồi chạy các lệnh gọi thử của lời giải: bạn có ra đúng output thật (cùng dòng, cùng lỗi) không?</li>
<li>Đọc cái bẫy dưới mỗi lời giải — đó là những lỗi làm mất điểm PE.</li>
</ol></div>
<p>Nhắc lại các bảng (sơ đồ đầy đủ: bài 7.A, slide 4): tblEmployee(empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) · tblDepartment(depNum, depName, mgrSSN, mgrAssDate) · tblProject(proNum, proName, locNum, depNum) · tblWorksOn(empSSN, proNum, workHours) · tblLocation(locNum, locName).</p>
<table>
<thead><tr><th>Thói quen khi thi PE</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td><code>GO</code> trước và sau mọi CREATE PROCEDURE / FUNCTION / TRIGGER</td><td>CREATE … phải là câu đầu tiên của lô, và mọi thứ tới chữ GO đều thành thân của nó</td></tr>
<tr><td><code>IF OBJECT_ID('tên', 'P' / 'FN' / 'TR') IS NOT NULL DROP …</code> (hoặc <code>CREATE OR ALTER</code>)</td><td>bạn sẽ chạy script nhiều lần</td></tr>
<tr><td>Thử mỗi đối tượng bằng một lời gọi thật ngay sau khi tạo</td><td>người chấm chạy EXEC / SELECT / INSERT — đối tượng chưa từng được gọi thường là đang hỏng</td></tr>
<tr><td>Trigger: coi <code>inserted</code> / <code>deleted</code> là bảng (EXISTS, JOIN)</td><td>một câu INSERT hay UPDATE có thể chạm nhiều dòng</td></tr>
<tr><td>Từ chối trong trigger = RAISERROR + ROLLBACK trong BEGIN…END</td><td>chỉ RAISERROR thì dòng vẫn được giữ</td></tr>
<tr><td>OUTPUT viết ở cả CREATE lẫn EXEC</td><td>thiếu ở lời gọi ⇒ biến không đổi</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — Procedure with OUTPUT parameters: total salary of a department (~10 min)</h3>
<p class="nhan">Task</p>
<p>Create the stored procedure <strong>proc_SalaryOfDep</strong> that receives a department number and returns, through two OUTPUT parameters, the total salary and the number of employees of that department. If the department does not exist, return the code −1 (otherwise 0). Call it for department 1 and for the non-existent department 9.</p>
<p class="nhan">How to think</p>
<ul>
<li>"Returns … through OUTPUT parameters" ⇒ two parameters marked OUTPUT, filled by one <code>SELECT @a = SUM(…), @b = COUNT(*)</code>.</li>
<li>"Return the code" ⇒ <code>RETURN n</code> (an INT), read with <code>EXEC @rc = proc …</code>. RETURN also ends the procedure at once.</li>
<li>Existence first: <code>IF NOT EXISTS (SELECT * FROM tblDepartment WHERE …) RETURN -1</code>.</li>
</ul>
<p class="nhan">Solution</p>
<pre><code class="language-sql">IF OBJECT_ID('proc_SalaryOfDep', 'P') IS NOT NULL DROP PROCEDURE proc_SalaryOfDep;
GO
CREATE PROCEDURE proc_SalaryOfDep
    @depNum  INT,
    @total   DECIMAL(12,0) OUTPUT,     -- total salary of the department
    @numEmp  INT           OUTPUT      -- number of employees
AS
BEGIN
    SET NOCOUNT ON
    IF NOT EXISTS (SELECT * FROM tblDepartment WHERE depNum = @depNum)
        RETURN -1                      -- return code: department not found
    SELECT @total  = ISNULL(SUM(empSalary), 0),
           @numEmp = COUNT(*)
    FROM   tblEmployee
    WHERE  depNum = @depNum
    RETURN 0                           -- 0 = OK
END
GO</code></pre>
<p class="nhan">Test calls and real output</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @t DECIMAL(12,0), @n INT, @rc INT
EXEC @rc = proc_SalaryOfDep 1, @t OUTPUT, @n OUTPUT
SELECT 1 AS depNum, @rc AS returnCode, @t AS totalSalary, @n AS numEmp
SET @t = NULL; SET @n = NULL
EXEC @rc = proc_SalaryOfDep @depNum = 9, @total = @t OUTPUT, @numEmp = @n OUTPUT
SELECT 9 AS depNum, @rc AS returnCode, @t AS totalSalary, @n AS numEmp</code></pre>
<pre><code class="language-sql">-- self-check with a plain query
SELECT depNum, SUM(empSalary) AS totalSalary, COUNT(*) AS numEmp
FROM tblEmployee WHERE depNum = 1 GROUP BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>returnCode</th><th>totalSalary</th><th>numEmp</th></tr></thead>
<tbody>
<tr><td>1</td><td>0</td><td>345000</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>returnCode</th><th>totalSalary</th><th>numEmp</th></tr></thead>
<tbody>
<tr><td>9</td><td>-1</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>totalSalary</th><th>numEmp</th></tr></thead>
<tbody>
<tr><td>1</td><td>345000</td><td>4</td></tr>
</tbody>
</table>
<p>Department 1: code 0, 345000 over 4 employees — the same numbers as the plain GROUP BY query (the self-check). Department 9: code −1, and the OUTPUT variables stay NULL because the procedure returned before filling them.</p>
<div class="pitfall">Three classic losses: (1) <code>OUTPUT</code> missing in the EXEC ⇒ the variable is not filled, no error; (2) <code>SUM</code> of an empty department is NULL, not 0 — wrap it in <code>ISNULL(…, 0)</code>; (3) <code>RETURN</code> can only carry an INT — to return a name or an amount, use an OUTPUT parameter.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> (at work) this is usually a <strong>function with OUT parameters</strong>, used in FROM like a one-row table; an error replaces the return code. The PE-style twin is a procedure with INOUT parameters, called with CALL:
<pre><code class="language-sql">-- At work: a FUNCTION with OUT parameters, used in FROM like a one-row table
CREATE FUNCTION salary_of_dep(p_dep_num INT, OUT total NUMERIC, OUT num_emp INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM tblDepartment WHERE depNum = p_dep_num) THEN
        RAISE EXCEPTION 'Department % does not exist', p_dep_num;   -- instead of a return code
    END IF;
    SELECT COALESCE(SUM(empSalary), 0), COUNT(*) INTO total, num_emp
    FROM tblEmployee WHERE depNum = p_dep_num;
END $$;
SELECT * FROM salary_of_dep(1);
-- The PE-style twin: a PROCEDURE with INOUT parameters, called with CALL
CREATE PROCEDURE proc_salary_of_dep(p_dep_num INT, INOUT total NUMERIC DEFAULT NULL, INOUT num_emp INT DEFAULT NULL)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT COALESCE(SUM(empSalary), 0), COUNT(*) INTO total, num_emp
    FROM tblEmployee WHERE depNum = p_dep_num;
END $$;
CALL proc_salary_of_dep(2);</code></pre>
<table>
<thead><tr><th>total</th><th>num_emp</th></tr></thead>
<tbody>
<tr><td>345000</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>total</th><th>num_emp</th></tr></thead>
<tbody>
<tr><td>327000</td><td>4</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions</a>.</div>`,
    `<h3>🧪 Bài 1 — Thủ tục có tham số OUTPUT: tổng lương của một phòng (~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Tạo stored procedure <strong>proc_SalaryOfDep</strong> nhận vào mã phòng và trả về, qua hai tham số OUTPUT, tổng lương và số nhân viên của phòng đó. Nếu phòng không tồn tại thì trả mã −1 (ngược lại 0). Gọi thử cho phòng 1 và cho phòng 9 (không tồn tại).</p>
<p class="nhan">Hướng nghĩ</p>
<ul>
<li>"Trả về … qua tham số OUTPUT" ⇒ hai tham số có chữ OUTPUT, được gán bằng một câu <code>SELECT @a = SUM(…), @b = COUNT(*)</code>.</li>
<li>"Trả mã" ⇒ <code>RETURN n</code> (một số INT), đọc bằng <code>EXEC @rc = proc …</code>. RETURN còn kết thúc thủ tục ngay lập tức.</li>
<li>Kiểm tồn tại trước: <code>IF NOT EXISTS (SELECT * FROM tblDepartment WHERE …) RETURN -1</code>.</li>
</ul>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">IF OBJECT_ID('proc_SalaryOfDep', 'P') IS NOT NULL DROP PROCEDURE proc_SalaryOfDep;
GO
CREATE PROCEDURE proc_SalaryOfDep
    @depNum  INT,
    @total   DECIMAL(12,0) OUTPUT,     -- tổng lương của phòng
    @numEmp  INT           OUTPUT      -- số nhân viên
AS
BEGIN
    SET NOCOUNT ON
    IF NOT EXISTS (SELECT * FROM tblDepartment WHERE depNum = @depNum)
        RETURN -1                      -- mã trả về: không có phòng này
    SELECT @total  = ISNULL(SUM(empSalary), 0),
           @numEmp = COUNT(*)
    FROM   tblEmployee
    WHERE  depNum = @depNum
    RETURN 0                           -- 0 = OK
END
GO</code></pre>
<p class="nhan">Lệnh gọi thử và output thật</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @t DECIMAL(12,0), @n INT, @rc INT
EXEC @rc = proc_SalaryOfDep 1, @t OUTPUT, @n OUTPUT
SELECT 1 AS depNum, @rc AS returnCode, @t AS totalSalary, @n AS numEmp
SET @t = NULL; SET @n = NULL
EXEC @rc = proc_SalaryOfDep @depNum = 9, @total = @t OUTPUT, @numEmp = @n OUTPUT
SELECT 9 AS depNum, @rc AS returnCode, @t AS totalSalary, @n AS numEmp</code></pre>
<pre><code class="language-sql">-- tự kiểm bằng một câu truy vấn thường
SELECT depNum, SUM(empSalary) AS totalSalary, COUNT(*) AS numEmp
FROM tblEmployee WHERE depNum = 1 GROUP BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>returnCode</th><th>totalSalary</th><th>numEmp</th></tr></thead>
<tbody>
<tr><td>1</td><td>0</td><td>345000</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>returnCode</th><th>totalSalary</th><th>numEmp</th></tr></thead>
<tbody>
<tr><td>9</td><td>-1</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>totalSalary</th><th>numEmp</th></tr></thead>
<tbody>
<tr><td>1</td><td>345000</td><td>4</td></tr>
</tbody>
</table>
<p>Phòng 1: mã 0, 345000 cho 4 nhân viên — đúng bằng số của câu GROUP BY thường (phần tự kiểm). Phòng 9: mã −1, và các biến OUTPUT vẫn là NULL vì thủ tục đã RETURN trước khi gán chúng.</p>
<div class="pitfall">Ba lỗi mất điểm kinh điển: (1) thiếu <code>OUTPUT</code> trong câu EXEC ⇒ biến không được gán, không báo lỗi; (2) <code>SUM</code> của một phòng không có ai là NULL, không phải 0 — bọc bằng <code>ISNULL(…, 0)</code>; (3) <code>RETURN</code> chỉ mang được một số INT — muốn trả tên hay số tiền thì dùng tham số OUTPUT.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> (khi đi làm) việc này thường là một <strong>hàm có tham số OUT</strong>, dùng trong FROM như một bảng một dòng; báo lỗi thay cho mã trả về. Bản sinh đôi kiểu đề PE là thủ tục có tham số INOUT, gọi bằng CALL:
<pre><code class="language-sql">-- Khi đi làm: một HÀM có tham số OUT, dùng trong FROM như một bảng một dòng
CREATE FUNCTION salary_of_dep(p_dep_num INT, OUT total NUMERIC, OUT num_emp INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM tblDepartment WHERE depNum = p_dep_num) THEN
        RAISE EXCEPTION 'Department % does not exist', p_dep_num;   -- thay cho mã trả về
    END IF;
    SELECT COALESCE(SUM(empSalary), 0), COUNT(*) INTO total, num_emp
    FROM tblEmployee WHERE depNum = p_dep_num;
END $$;
SELECT * FROM salary_of_dep(1);
-- Bản sinh đôi kiểu đề PE: PROCEDURE có tham số INOUT, gọi bằng CALL
CREATE PROCEDURE proc_salary_of_dep(p_dep_num INT, INOUT total NUMERIC DEFAULT NULL, INOUT num_emp INT DEFAULT NULL)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT COALESCE(SUM(empSalary), 0), COUNT(*) INTO total, num_emp
    FROM tblEmployee WHERE depNum = p_dep_num;
END $$;
CALL proc_salary_of_dep(2);</code></pre>
<table>
<thead><tr><th>total</th><th>num_emp</th></tr></thead>
<tbody>
<tr><td>345000</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>total</th><th>num_emp</th></tr></thead>
<tbody>
<tr><td>327000</td><td>4</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm</a>.</div>`),
    bi(`<h3>🧪 Exercise 2 — Procedure with a transaction: add an employee to a project, all or nothing (~12 min)</h3>
<p class="nhan">Task</p>
<p>Create <strong>proc_AddEmployeeToProject</strong>(@empSSN, @empName, @salary, @depNum, @proNum, @hours, @msg OUTPUT) that inserts a new employee <em>and</em> assigns him to a project with a number of hours. Either both rows are stored or neither; @msg returns "OK: …" or the error. Test with project 2 (exists) and project 99 (does not).</p>
<p class="nhan">How to think</p>
<ul>
<li>"Both or neither" = one <strong>transaction</strong>: BEGIN TRANSACTION … COMMIT, with ROLLBACK when anything fails.</li>
<li>"Anything fails" = TRY…CATCH: the second INSERT violates the foreign key to tblProject ⇒ the CATCH runs.</li>
<li>In the CATCH: <code>IF @@TRANCOUNT &gt; 0 ROLLBACK</code> (roll back only if a transaction is still open), then build @msg from ERROR_NUMBER() and ERROR_MESSAGE().</li>
</ul>
<p class="nhan">Solution</p>
<pre><code class="language-sql">GO
CREATE PROCEDURE proc_AddEmployeeToProject
    @empSSN  DECIMAL(18,0),
    @empName NVARCHAR(50),
    @salary  DECIMAL(10,0),
    @depNum  INT,
    @proNum  INT,
    @hours   DECIMAL(5,1),
    @msg     NVARCHAR(300) OUTPUT
AS
BEGIN
    SET NOCOUNT ON
    BEGIN TRANSACTION
    BEGIN TRY
        INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
        VALUES (@empSSN, @empName, @salary, @depNum);
        INSERT INTO tblWorksOn(empSSN, proNum, workHours)
        VALUES (@empSSN, @proNum, @hours);
        COMMIT TRANSACTION
        SET @msg = N'OK: ' + @empName + N' added to project ' + CAST(@proNum AS NVARCHAR(10))
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT &gt; 0 ROLLBACK TRANSACTION     -- undo BOTH inserts
        SET @msg = N'Error ' + CAST(ERROR_NUMBER() AS NVARCHAR(10)) + N': ' + ERROR_MESSAGE()
    END CATCH
END
GO</code></pre>
<p class="nhan">Test calls and real output</p>
<pre><code class="language-sql">DECLARE @m NVARCHAR(300)
EXEC proc_AddEmployeeToProject 30121050300, N'Đinh Thị Hoa', 50000, 1, 2, 15, @m OUTPUT
PRINT @m
EXEC proc_AddEmployeeToProject 30121050301, N'Tạ Văn Long', 48000, 1, 99, 10, @m OUTPUT   -- project 99 does not exist
PRINT @m
SELECT e.empSSN, e.empName, w.proNum, w.workHours
FROM tblEmployee e LEFT JOIN tblWorksOn w ON w.empSSN = e.empSSN
WHERE e.empSSN IN (30121050300, 30121050301);</code></pre>
<div class="out">OK: Đinh Thị Hoa added to project 2<br>
Error 547: The INSERT statement conflicted with the FOREIGN KEY constraint "fk_workson_project". The conflict occurred in database "DBI202", table "dbo.tblProject", column 'proNum'.</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>proNum</th><th>workHours</th></tr></thead>
<tbody>
<tr><td>30121050300</td><td>Đinh Thị Hoa</td><td>2</td><td>15.0</td></tr>
</tbody>
</table>
<p>Đinh Thị Hoa is stored with her project. For Tạ Văn Long the second INSERT failed (Msg 547, foreign key fk_workson_project) — and the final SELECT shows that <strong>he is not in tblEmployee either</strong>: the ROLLBACK undid the first INSERT.</p>
<div class="pitfall">Without the transaction, the first INSERT stays: an employee "half added" with no project — exactly what the task forbids. And a ROLLBACK when no transaction is open is itself an error (Msg 3903) — hence <code>IF @@TRANCOUNT &gt; 0</code>.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a procedure body is already atomic: when the EXCEPTION part catches the error, everything the block did (both INSERTs) is rolled back automatically — no BEGIN/COMMIT/ROLLBACK to write. <code>SQLSTATE</code> 23503 = foreign key violation:
<pre><code class="language-sql">CREATE PROCEDURE proc_add_employee_to_project(
    p_ssn NUMERIC, p_name VARCHAR, p_salary NUMERIC, p_dep INT, p_pro INT, p_hours NUMERIC,
    INOUT p_msg TEXT DEFAULT NULL)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum) VALUES (p_ssn, p_name, p_salary, p_dep);
    INSERT INTO tblWorksOn(empSSN, proNum, workHours) VALUES (p_ssn, p_pro, p_hours);
    p_msg := 'OK: ' || p_name || ' added to project ' || p_pro;
EXCEPTION WHEN OTHERS THEN              -- both inserts are undone automatically
    p_msg := 'Error ' || SQLSTATE || ': ' || SQLERRM;
END $$;
CALL proc_add_employee_to_project(30121050300, 'Đinh Thị Hoa', 50000, 1, 2, 15);
CALL proc_add_employee_to_project(30121050301, 'Tạ Văn Long', 48000, 1, 99, 10);
SELECT e.empSSN, e.empName, w.proNum, w.workHours
FROM tblEmployee e LEFT JOIN tblWorksOn w ON w.empSSN = e.empSSN
WHERE e.empSSN IN (30121050300, 30121050301);</code></pre>
<table>
<thead><tr><th>p_msg</th></tr></thead>
<tbody>
<tr><td>OK: Đinh Thị Hoa added to project 2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>p_msg</th></tr></thead>
<tbody>
<tr><td>Error 23503: insert or update on table "tblworkson" violates foreign key constraint "fk_workson_project"</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>pronum</th><th>workhours</th></tr></thead>
<tbody>
<tr><td>30121050300</td><td>Đinh Thị Hoa</td><td>2</td><td>15.0</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-1-giao-dich">PostgreSQL 11.1 — transactions</a>.</div>`,
    `<h3>🧪 Bài 2 — Thủ tục có giao dịch: thêm nhân viên vào dự án, được cả hoặc không gì cả (~12 phút)</h3>
<p class="nhan">Đề</p>
<p>Tạo <strong>proc_AddEmployeeToProject</strong>(@empSSN, @empName, @salary, @depNum, @proNum, @hours, @msg OUTPUT) chèn một nhân viên mới <em>và</em> phân công người đó vào một dự án với số giờ cho trước. Hoặc cả hai dòng được lưu, hoặc không dòng nào; @msg trả về "OK: …" hoặc nội dung lỗi. Thử với dự án 2 (có) và dự án 99 (không có).</p>
<p class="nhan">Hướng nghĩ</p>
<ul>
<li>"Cả hai hoặc không" = một <strong>giao dịch</strong> (transaction): BEGIN TRANSACTION … COMMIT, ROLLBACK khi có gì hỏng.</li>
<li>"Có gì hỏng" = TRY…CATCH: câu INSERT thứ hai vi phạm khoá ngoại tới tblProject ⇒ CATCH chạy.</li>
<li>Trong CATCH: <code>IF @@TRANCOUNT &gt; 0 ROLLBACK</code> (chỉ huỷ khi giao dịch còn mở), rồi ghép @msg từ ERROR_NUMBER() và ERROR_MESSAGE().</li>
</ul>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">GO
CREATE PROCEDURE proc_AddEmployeeToProject
    @empSSN  DECIMAL(18,0),
    @empName NVARCHAR(50),
    @salary  DECIMAL(10,0),
    @depNum  INT,
    @proNum  INT,
    @hours   DECIMAL(5,1),
    @msg     NVARCHAR(300) OUTPUT
AS
BEGIN
    SET NOCOUNT ON
    BEGIN TRANSACTION
    BEGIN TRY
        INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum)
        VALUES (@empSSN, @empName, @salary, @depNum);
        INSERT INTO tblWorksOn(empSSN, proNum, workHours)
        VALUES (@empSSN, @proNum, @hours);
        COMMIT TRANSACTION
        SET @msg = N'OK: ' + @empName + N' added to project ' + CAST(@proNum AS NVARCHAR(10))
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT &gt; 0 ROLLBACK TRANSACTION     -- huỷ CẢ HAI câu chèn
        SET @msg = N'Error ' + CAST(ERROR_NUMBER() AS NVARCHAR(10)) + N': ' + ERROR_MESSAGE()
    END CATCH
END
GO</code></pre>
<p class="nhan">Lệnh gọi thử và output thật</p>
<pre><code class="language-sql">DECLARE @m NVARCHAR(300)
EXEC proc_AddEmployeeToProject 30121050300, N'Đinh Thị Hoa', 50000, 1, 2, 15, @m OUTPUT
PRINT @m
EXEC proc_AddEmployeeToProject 30121050301, N'Tạ Văn Long', 48000, 1, 99, 10, @m OUTPUT   -- dự án 99 không tồn tại
PRINT @m
SELECT e.empSSN, e.empName, w.proNum, w.workHours
FROM tblEmployee e LEFT JOIN tblWorksOn w ON w.empSSN = e.empSSN
WHERE e.empSSN IN (30121050300, 30121050301);</code></pre>
<div class="out">OK: Đinh Thị Hoa added to project 2<br>
Error 547: The INSERT statement conflicted with the FOREIGN KEY constraint "fk_workson_project". The conflict occurred in database "DBI202", table "dbo.tblProject", column 'proNum'.</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>proNum</th><th>workHours</th></tr></thead>
<tbody>
<tr><td>30121050300</td><td>Đinh Thị Hoa</td><td>2</td><td>15.0</td></tr>
</tbody>
</table>
<p>Đinh Thị Hoa được lưu kèm dự án. Với Tạ Văn Long, câu INSERT thứ hai hỏng (Msg 547, khoá ngoại fk_workson_project) — và câu SELECT cuối cho thấy <strong>anh ấy cũng không có trong tblEmployee</strong>: ROLLBACK đã huỷ luôn câu INSERT đầu.</p>
<div class="pitfall">Không có giao dịch thì câu INSERT đầu ở lại: một nhân viên "thêm được một nửa", không có dự án — đúng điều đề cấm. Và ROLLBACK khi không còn giao dịch nào mở cũng là một lỗi (Msg 3903) — vì thế mới có <code>IF @@TRANCOUNT &gt; 0</code>.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> thân thủ tục vốn đã nguyên tử: khi phần EXCEPTION bắt được lỗi, mọi thứ khối đã làm (cả hai câu INSERT) tự động bị huỷ — không phải viết BEGIN/COMMIT/ROLLBACK. <code>SQLSTATE</code> 23503 = vi phạm khoá ngoại:
<pre><code class="language-sql">CREATE PROCEDURE proc_add_employee_to_project(
    p_ssn NUMERIC, p_name VARCHAR, p_salary NUMERIC, p_dep INT, p_pro INT, p_hours NUMERIC,
    INOUT p_msg TEXT DEFAULT NULL)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum) VALUES (p_ssn, p_name, p_salary, p_dep);
    INSERT INTO tblWorksOn(empSSN, proNum, workHours) VALUES (p_ssn, p_pro, p_hours);
    p_msg := 'OK: ' || p_name || ' added to project ' || p_pro;
EXCEPTION WHEN OTHERS THEN              -- cả hai câu chèn tự bị huỷ
    p_msg := 'Error ' || SQLSTATE || ': ' || SQLERRM;
END $$;
CALL proc_add_employee_to_project(30121050300, 'Đinh Thị Hoa', 50000, 1, 2, 15);
CALL proc_add_employee_to_project(30121050301, 'Tạ Văn Long', 48000, 1, 99, 10);
SELECT e.empSSN, e.empName, w.proNum, w.workHours
FROM tblEmployee e LEFT JOIN tblWorksOn w ON w.empSSN = e.empSSN
WHERE e.empSSN IN (30121050300, 30121050301);</code></pre>
<table>
<thead><tr><th>p_msg</th></tr></thead>
<tbody>
<tr><td>OK: Đinh Thị Hoa added to project 2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>p_msg</th></tr></thead>
<tbody>
<tr><td>Error 23503: insert or update on table "tblworkson" violates foreign key constraint "fk_workson_project"</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>pronum</th><th>workhours</th></tr></thead>
<tbody>
<tr><td>30121050300</td><td>Đinh Thị Hoa</td><td>2</td><td>15.0</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-1-giao-dich">PostgreSQL 11.1 — giao dịch</a>.</div>`),
    bi(`<h3>🧪 Exercise 3 — Scalar function: number of projects of an employee (~8 min)</h3>
<p class="nhan">Task</p>
<p>Create the function <strong>fn_NumProjects</strong>(@empSSN) that returns how many projects an employee works on. Use it to list the employees working on at least 2 projects, most projects first.</p>
<p class="nhan">How to think</p>
<ul>
<li>One value out ⇒ a <strong>scalar</strong> function, <code>RETURNS INT</code>.</li>
<li>COUNT(*) of an employee with no row in tblWorksOn is 0 (not NULL) — no ISNULL needed, unlike SUM in exercise 1.</li>
<li>Call it with <code>dbo.</code> in the SELECT list and in the WHERE.</li>
</ul>
<p class="nhan">Solution</p>
<pre><code class="language-sql">GO
CREATE FUNCTION fn_NumProjects (@empSSN DECIMAL(18,0))
RETURNS INT
AS
BEGIN
    RETURN (SELECT COUNT(*) FROM tblWorksOn WHERE empSSN = @empSSN)
END
GO</code></pre>
<p class="nhan">Test calls, and the same list without a function</p>
<pre><code class="language-sql">SELECT dbo.fn_NumProjects(30121050003) AS projectsOf003,
       dbo.fn_NumProjects(30121050037) AS projectsOf037;
-- employees working on at least 2 projects
SELECT empSSN, empName, dbo.fn_NumProjects(empSSN) AS numProjects
FROM tblEmployee
WHERE dbo.fn_NumProjects(empSSN) &gt;= 2
ORDER BY numProjects DESC, empSSN;</code></pre>
<pre><code class="language-sql">-- the same list without a function: GROUP BY + HAVING (faster on big tables)
SELECT e.empSSN, e.empName, COUNT(*) AS numProjects
FROM tblEmployee e JOIN tblWorksOn w ON w.empSSN = e.empSSN
GROUP BY e.empSSN, e.empName
HAVING COUNT(*) &gt;= 2
ORDER BY numProjects DESC, e.empSSN;</code></pre>
<table>
<thead><tr><th>projectsOf003</th><th>projectsOf037</th></tr></thead>
<tbody>
<tr><td>3</td><td>0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>numProjects</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>3</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>2</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>numProjects</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>3</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>2</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>2</td></tr>
</tbody>
</table>
<p>003 works on 3 projects, 037 on none (0). The function version and the GROUP BY … HAVING version return the same 3 employees — a good way to check a function.</p>
<div class="pitfall"><code>WHERE dbo.fn_NumProjects(empSSN) &gt;= 2</code> calls the function once per employee — fine for 14 rows, slow for a million. When the PE asks "use the function", use it; at work, prefer the GROUP BY … HAVING form. And do not forget <code>dbo.</code>: without it, Msg 195 (7.B, slide 32).</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong>: <code>LANGUAGE sql STABLE</code> (STABLE = "reads the database, changes nothing" — lets the planner optimise), COUNT(*) is BIGINT, and no schema prefix:
<pre><code class="language-sql">CREATE FUNCTION fn_num_projects(p_emp_ssn NUMERIC)
RETURNS BIGINT                           -- COUNT(*) is BIGINT in PostgreSQL
LANGUAGE sql STABLE                      -- STABLE: reads data, changes nothing
AS $$ SELECT COUNT(*) FROM tblWorksOn WHERE empSSN = p_emp_ssn $$;
SELECT empSSN, empName, fn_num_projects(empSSN) AS num_projects
FROM tblEmployee
WHERE fn_num_projects(empSSN) &gt;= 2
ORDER BY num_projects DESC, empSSN;</code></pre>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>num_projects</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>3</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>2</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>2</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — functions</a>.</div>`,
    `<h3>🧪 Bài 3 — Hàm vô hướng: số dự án của một nhân viên (~8 phút)</h3>
<p class="nhan">Đề</p>
<p>Tạo hàm <strong>fn_NumProjects</strong>(@empSSN) trả về số dự án một nhân viên đang làm. Dùng nó để liệt kê các nhân viên làm ít nhất 2 dự án, nhiều dự án nhất lên đầu.</p>
<p class="nhan">Hướng nghĩ</p>
<ul>
<li>Trả ra một giá trị ⇒ hàm <strong>vô hướng</strong> (scalar), <code>RETURNS INT</code>.</li>
<li>COUNT(*) của một nhân viên không có dòng nào trong tblWorksOn là 0 (không phải NULL) — không cần ISNULL, khác với SUM ở bài 1.</li>
<li>Gọi kèm <code>dbo.</code> trong danh sách SELECT và trong WHERE.</li>
</ul>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">GO
CREATE FUNCTION fn_NumProjects (@empSSN DECIMAL(18,0))
RETURNS INT
AS
BEGIN
    RETURN (SELECT COUNT(*) FROM tblWorksOn WHERE empSSN = @empSSN)
END
GO</code></pre>
<p class="nhan">Lệnh gọi thử, và cùng danh sách không cần hàm</p>
<pre><code class="language-sql">SELECT dbo.fn_NumProjects(30121050003) AS projectsOf003,
       dbo.fn_NumProjects(30121050037) AS projectsOf037;
-- nhân viên làm ít nhất 2 dự án
SELECT empSSN, empName, dbo.fn_NumProjects(empSSN) AS numProjects
FROM tblEmployee
WHERE dbo.fn_NumProjects(empSSN) &gt;= 2
ORDER BY numProjects DESC, empSSN;</code></pre>
<pre><code class="language-sql">-- cùng danh sách không cần hàm: GROUP BY + HAVING (nhanh hơn trên bảng lớn)
SELECT e.empSSN, e.empName, COUNT(*) AS numProjects
FROM tblEmployee e JOIN tblWorksOn w ON w.empSSN = e.empSSN
GROUP BY e.empSSN, e.empName
HAVING COUNT(*) &gt;= 2
ORDER BY numProjects DESC, e.empSSN;</code></pre>
<table>
<thead><tr><th>projectsOf003</th><th>projectsOf037</th></tr></thead>
<tbody>
<tr><td>3</td><td>0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>numProjects</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>3</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>2</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>numProjects</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>3</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>2</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>2</td></tr>
</tbody>
</table>
<p>003 làm 3 dự án, 037 không làm dự án nào (0). Bản dùng hàm và bản GROUP BY … HAVING ra cùng 3 nhân viên — một cách hay để tự kiểm một hàm.</p>
<div class="pitfall"><code>WHERE dbo.fn_NumProjects(empSSN) &gt;= 2</code> gọi hàm mỗi nhân viên một lần — ổn với 14 dòng, chậm với một triệu dòng. Đề PE bảo "dùng hàm" thì dùng; khi đi làm, ưu tiên dạng GROUP BY … HAVING. Và đừng quên <code>dbo.</code>: thiếu nó là Msg 195 (7.B, slide 32).</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>: <code>LANGUAGE sql STABLE</code> (STABLE = "đọc CSDL, không sửa gì" — giúp bộ lập kế hoạch tối ưu), COUNT(*) có kiểu BIGINT, và không cần tiền tố lược đồ:
<pre><code class="language-sql">CREATE FUNCTION fn_num_projects(p_emp_ssn NUMERIC)
RETURNS BIGINT                           -- COUNT(*) có kiểu BIGINT trên PostgreSQL
LANGUAGE sql STABLE                      -- STABLE: đọc dữ liệu, không sửa gì
AS $$ SELECT COUNT(*) FROM tblWorksOn WHERE empSSN = p_emp_ssn $$;
SELECT empSSN, empName, fn_num_projects(empSSN) AS num_projects
FROM tblEmployee
WHERE fn_num_projects(empSSN) &gt;= 2
ORDER BY num_projects DESC, empSSN;</code></pre>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>num_projects</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>3</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>2</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>2</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-1-ham">PostgreSQL 12.1 — hàm</a>.</div>`),
    bi(`<h3>🧪 Exercise 4 — Table-valued function: who works at a location (~10 min)</h3>
<p class="nhan">Task</p>
<p>Create <strong>fn_WorkersAtLocation</strong>(@locName) returning a table (empSSN, empName, proName, workHours) of the employees working on projects located at that city. Show the result for "TP Hà Nội", then use the function to compute each employee's total hours in "TP Hồ Chí Minh".</p>
<p class="nhan">How to think</p>
<ul>
<li>A table out, one SELECT enough ⇒ an <strong>inline</strong> table-valued function: <code>RETURNS TABLE AS RETURN (SELECT …)</code>.</li>
<li>The path on the diagram: tblLocation → tblProject (locNum) → tblWorksOn (proNum) → tblEmployee (empSSN) — four tables, three joins.</li>
<li>The result is a table: it can be ordered, grouped, joined outside the function.</li>
</ul>
<p class="nhan">Solution</p>
<pre><code class="language-sql">GO
CREATE FUNCTION fn_WorkersAtLocation (@locName NVARCHAR(50))
RETURNS TABLE
AS
RETURN (
    SELECT e.empSSN, e.empName, p.proName, w.workHours
    FROM   tblLocation l
    JOIN   tblProject  p ON p.locNum = l.locNum
    JOIN   tblWorksOn  w ON w.proNum = p.proNum
    JOIN   tblEmployee e ON e.empSSN = w.empSSN
    WHERE  l.locName = @locName
)
GO</code></pre>
<p class="nhan">Test calls and real output</p>
<pre><code class="language-sql">SELECT * FROM fn_WorkersAtLocation(N'TP Hà Nội') ORDER BY proName, empSSN;
-- a table-valued function can be grouped like any table
SELECT empName, SUM(workHours) AS hoursInHCMC
FROM fn_WorkersAtLocation(N'TP Hồ Chí Minh')
GROUP BY empName
ORDER BY hoursInHCMC DESC, empName;
-- trap: the same call WITHOUT N
SELECT COUNT(*) AS rowsWithoutN FROM fn_WorkersAtLocation('TP Hà Nội');</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>proName</th><th>workHours</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>ProjectA</td><td>10.0</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>ProjectA</td><td>20.0</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>ProjectA</td><td>30.0</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>ProjectC</td><td>10.0</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>ProjectC</td><td>25.0</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>ProjectC</td><td>30.0</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>ProjectC</td><td>15.0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>hoursInHCMC</th></tr></thead>
<tbody>
<tr><td>Huỳnh Văn Tài</td><td>40.0</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>35.0</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>30.0</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>20.0</td></tr>
<tr><td>Mai Duy An</td><td>20.0</td></tr>
<tr><td>Võ Việt Anh</td><td>12.5</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>rowsWithoutN</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<p>Hà Nội has ProjectA and ProjectC: 7 (employee, project) pairs — Võ Việt Anh appears twice. In Hồ Chí Minh the GROUP BY outside the function adds up the hours per employee.</p>
<div class="pitfall">Do not put ORDER BY inside the RETURN (SELECT …) — it is refused unless you add TOP; sort when you call the function. And pass Vietnamese with N: <code>fn_WorkersAtLocation('TP Hà Nội')</code> without N finds nothing — the last line of the output above counts 0 rows: the literal lost its accents before reaching the NVARCHAR parameter.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong>: <code>RETURNS TABLE (emp_ssn NUMERIC, …)</code> with the columns declared (names chosen different from the table columns to avoid ambiguity):
<pre><code class="language-sql">CREATE FUNCTION fn_workers_at_location(p_loc_name VARCHAR)
RETURNS TABLE (emp_ssn NUMERIC, emp_name VARCHAR, pro_name VARCHAR, work_hours NUMERIC)
LANGUAGE sql STABLE
AS $$
    SELECT e.empSSN, e.empName, p.proName, w.workHours
    FROM tblLocation l
    JOIN tblProject  p ON p.locNum = l.locNum
    JOIN tblWorksOn  w ON w.proNum = p.proNum
    JOIN tblEmployee e ON e.empSSN = w.empSSN
    WHERE l.locName = p_loc_name
$$;
SELECT * FROM fn_workers_at_location('TP Hà Nội') ORDER BY pro_name, emp_ssn;</code></pre>
<table>
<thead><tr><th>emp_ssn</th><th>emp_name</th><th>pro_name</th><th>work_hours</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>ProjectA</td><td>10.0</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>ProjectA</td><td>20.0</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>ProjectA</td><td>30.0</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>ProjectC</td><td>10.0</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>ProjectC</td><td>25.0</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>ProjectC</td><td>30.0</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>ProjectC</td><td>15.0</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-3-multi-self-join">PostgreSQL 5.3 — joining many tables</a>.</div>`,
    `<h3>🧪 Bài 4 — Hàm trả bảng: ai làm việc ở một địa điểm (~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Tạo <strong>fn_WorkersAtLocation</strong>(@locName) trả về một bảng (empSSN, empName, proName, workHours) gồm các nhân viên làm các dự án đặt tại thành phố đó. Hiện kết quả cho "TP Hà Nội", rồi dùng hàm để tính tổng giờ của mỗi nhân viên ở "TP Hồ Chí Minh".</p>
<p class="nhan">Hướng nghĩ</p>
<ul>
<li>Trả ra một bảng, một câu SELECT là đủ ⇒ hàm trả bảng <strong>inline</strong>: <code>RETURNS TABLE AS RETURN (SELECT …)</code>.</li>
<li>Đường đi trên sơ đồ: tblLocation → tblProject (locNum) → tblWorksOn (proNum) → tblEmployee (empSSN) — bốn bảng, ba phép nối.</li>
<li>Kết quả là một bảng: sắp xếp, gom nhóm, nối tiếp được ở bên ngoài hàm.</li>
</ul>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">GO
CREATE FUNCTION fn_WorkersAtLocation (@locName NVARCHAR(50))
RETURNS TABLE
AS
RETURN (
    SELECT e.empSSN, e.empName, p.proName, w.workHours
    FROM   tblLocation l
    JOIN   tblProject  p ON p.locNum = l.locNum
    JOIN   tblWorksOn  w ON w.proNum = p.proNum
    JOIN   tblEmployee e ON e.empSSN = w.empSSN
    WHERE  l.locName = @locName
)
GO</code></pre>
<p class="nhan">Lệnh gọi thử và output thật</p>
<pre><code class="language-sql">SELECT * FROM fn_WorkersAtLocation(N'TP Hà Nội') ORDER BY proName, empSSN;
-- hàm trả bảng gom nhóm được như mọi bảng
SELECT empName, SUM(workHours) AS hoursInHCMC
FROM fn_WorkersAtLocation(N'TP Hồ Chí Minh')
GROUP BY empName
ORDER BY hoursInHCMC DESC, empName;
-- bẫy: cùng lời gọi THIẾU N
SELECT COUNT(*) AS rowsWithoutN FROM fn_WorkersAtLocation('TP Hà Nội');</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>proName</th><th>workHours</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>ProjectA</td><td>10.0</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>ProjectA</td><td>20.0</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>ProjectA</td><td>30.0</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>ProjectC</td><td>10.0</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>ProjectC</td><td>25.0</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>ProjectC</td><td>30.0</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>ProjectC</td><td>15.0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>hoursInHCMC</th></tr></thead>
<tbody>
<tr><td>Huỳnh Văn Tài</td><td>40.0</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>35.0</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>30.0</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>20.0</td></tr>
<tr><td>Mai Duy An</td><td>20.0</td></tr>
<tr><td>Võ Việt Anh</td><td>12.5</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>rowsWithoutN</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<p>Hà Nội có ProjectA và ProjectC: 7 cặp (nhân viên, dự án) — Võ Việt Anh xuất hiện hai lần. Ở Hồ Chí Minh, câu GROUP BY bên ngoài hàm cộng giờ theo từng nhân viên.</p>
<div class="pitfall">Đừng đặt ORDER BY bên trong RETURN (SELECT …) — bị từ chối nếu không có TOP; sắp xếp khi gọi hàm. Và truyền tiếng Việt kèm N: <code>fn_WorkersAtLocation('TP Hà Nội')</code> thiếu N thì không tìm thấy gì — dòng cuối của output bên trên đếm được 0 dòng: hằng chuỗi đã mất dấu trước khi tới tham số NVARCHAR.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>: <code>RETURNS TABLE (emp_ssn NUMERIC, …)</code> phải khai báo cột (đặt tên khác tên cột của bảng để tránh nhập nhằng):
<pre><code class="language-sql">CREATE FUNCTION fn_workers_at_location(p_loc_name VARCHAR)
RETURNS TABLE (emp_ssn NUMERIC, emp_name VARCHAR, pro_name VARCHAR, work_hours NUMERIC)
LANGUAGE sql STABLE
AS $$
    SELECT e.empSSN, e.empName, p.proName, w.workHours
    FROM tblLocation l
    JOIN tblProject  p ON p.locNum = l.locNum
    JOIN tblWorksOn  w ON w.proNum = p.proNum
    JOIN tblEmployee e ON e.empSSN = w.empSSN
    WHERE l.locName = p_loc_name
$$;
SELECT * FROM fn_workers_at_location('TP Hà Nội') ORDER BY pro_name, emp_ssn;</code></pre>
<table>
<thead><tr><th>emp_ssn</th><th>emp_name</th><th>pro_name</th><th>work_hours</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>ProjectA</td><td>10.0</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>ProjectA</td><td>20.0</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>ProjectA</td><td>30.0</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>ProjectC</td><td>10.0</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>ProjectC</td><td>25.0</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>ProjectC</td><td>30.0</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>ProjectC</td><td>15.0</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-3-multi-self-join">PostgreSQL 5.3 — nối nhiều bảng</a>.</div>`),
    bi(`<h3>🧪 Exercise 5 — Trigger: no employee may earn more than his manager (~15 min)</h3>
<p class="nhan">Task</p>
<p>Create a trigger on tblEmployee that refuses any INSERT or UPDATE making an employee's salary higher than the salary of the manager of his department (tblDepartment.mgrSSN). The manager himself is not checked. Test: raise Mai Duy An (department 2, manager Phạm Quốc Bảo earns 95000) to 100000, then to 90000; insert a new employee of department 1 at 160000.</p>
<p class="nhan">How to think</p>
<ul>
<li>"Refuses" ⇒ AFTER INSERT, UPDATE + <code>IF EXISTS (…) BEGIN RAISERROR … ROLLBACK END</code>.</li>
<li>The bad rows: new rows (<strong>inserted</strong>) joined with their department and with the manager's row in tblEmployee, where the new salary is higher.</li>
<li>EXISTS over inserted ⇒ correct even when one UPDATE changes many employees.</li>
</ul>
<p class="nhan">Solution</p>
<pre><code class="language-sql">CREATE TRIGGER tr_Salary_Not_Above_Manager ON tblEmployee
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT *
               FROM   inserted i
               JOIN   tblDepartment d ON d.depNum = i.depNum
               JOIN   tblEmployee   m ON m.empSSN = d.mgrSSN     -- the manager's row
               WHERE  i.empSSN &lt;&gt; d.mgrSSN                       -- the manager himself is not checked
                 AND  i.empSalary &gt; m.empSalary)
    BEGIN
        RAISERROR(N'An employee cannot earn more than the manager of his department.', 16, 1)
        ROLLBACK TRANSACTION
    END
END
GO</code></pre>
<p class="nhan">Tests and real output</p>
<pre><code class="language-sql">-- 1. Mai Duy An (dept 2, manager Phạm Quốc Bảo earns 95000) asks for 100000
UPDATE tblEmployee SET empSalary = 100000 WHERE empSSN = 30121050005;
GO
-- 2. 90000 is fine
UPDATE tblEmployee SET empSalary = 90000 WHERE empSSN = 30121050005;
GO
-- 3. a new employee of dept 1 (manager earns 150000) with 160000
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum) VALUES (30121050400, N'Lâm Chí Cao', 160000, 1);
GO
-- 4. TRAP: Đặng Tuấn Anh ALREADY earns 105000 &gt; 95000; changing only his address is refused too
UPDATE tblEmployee SET empAddress = N'Đà Nẵng' WHERE empSSN = 30121050012;
GO
SELECT empSSN, empName, empSalary, empAddress FROM tblEmployee
WHERE empSSN IN (30121050005, 30121050012, 30121050400) ORDER BY empSSN;</code></pre>
<div class="out"><b>Msg 50000, Level 16, State 1<br>
An employee cannot earn more than the manager of his department.</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b><br>
<b>Msg 50000, Level 16, State 1<br>
An employee cannot earn more than the manager of his department.</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b><br>
<b>Msg 50000, Level 16, State 1<br>
An employee cannot earn more than the manager of his department.</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b></div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th><th>empAddress</th></tr></thead>
<tbody>
<tr><td>30121050005</td><td>Mai Duy An</td><td>90000</td><td>7 Hàng Bài, Hoàn Kiếm, TP Hà Nội</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>105000</td><td>5 Láng Hạ, Đống Đa, TP Hà Nội</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Test</th><th>Expected</th><th>Real</th></tr></thead>
<tbody>
<tr><td>1. 005 → 100000 (> 95000)</td><td>refused</td><td>Msg 50000 + 3609 ✅</td></tr>
<tr><td>2. 005 → 90000</td><td>accepted</td><td>salary 90000 in the final SELECT ✅</td></tr>
<tr><td>3. new employee, 160000 > 150000</td><td>refused</td><td>Msg 50000 + 3609, 30121050400 absent ✅</td></tr>
<tr><td>4. only the address of 012</td><td>accepted</td><td><strong>refused</strong> ❌</td></tr>
</tbody>
</table>
<p>Test 4 is the trap: the data <em>already</em> breaks the rule (Đặng Tuấn Anh earns 105000, his manager 95000). The trigger checks every row in inserted — and an UPDATE of the address puts 012's whole row, salary included, into inserted. The fix: check only when the salary or the department is really in the statement, with <code>UPDATE(col)</code>:</p>
<pre><code class="language-sql">CREATE TRIGGER tr_Salary_Not_Above_Manager ON tblEmployee
AFTER INSERT, UPDATE
AS
BEGIN
    IF NOT (UPDATE(empSalary) OR UPDATE(depNum)) RETURN     -- neither salary nor department touched
    IF EXISTS (SELECT *
               FROM   inserted i
               JOIN   tblDepartment d ON d.depNum = i.depNum
               JOIN   tblEmployee   m ON m.empSSN = d.mgrSSN
               WHERE  i.empSSN &lt;&gt; d.mgrSSN
                 AND  i.empSalary &gt; m.empSalary)
    BEGIN
        RAISERROR(N'An employee cannot earn more than the manager of his department.', 16, 1)
        ROLLBACK TRANSACTION
    END
END
GO</code></pre>
<div class="out"><b>Msg 50000, Level 16, State 1<br>
An employee cannot earn more than the manager of his department.</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b></div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th><th>empAddress</th></tr></thead>
<tbody>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>105000</td><td>Đà Nẵng</td></tr>
<tr><td>30121050020</td><td>Nguyễn Thị Mai</td><td>96800</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td></tr>
<tr><td>30121050021</td><td>Bùi Văn Nam</td><td>44000</td><td><em>NULL</em></td></tr>
<tr><td>30121050027</td><td>Trương Thị Thu</td><td>90000</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td></tr>
</tbody>
</table>
<p>Now the address change passes; raising all of department 3 by 10% passes (the manager is raised too); 027 at 99000 &gt; 96800 is refused.</p>
<div class="pitfall">Two more holes to mention in an interview: lowering the <em>manager's</em> salary below his employees is not checked (the rule has two sides), and a department whose mgrSSN is NULL makes the JOIN find nothing, so its employees are never checked. A trigger enforces exactly the cases you thought of.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a BEFORE … FOR EACH ROW trigger with <code>UPDATE OF empSalary, depNum</code> in the header — the address trap cannot happen because the trigger does not even fire:
<pre><code class="language-sql">CREATE FUNCTION trg_salary_not_above_manager() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_mgr_salary NUMERIC; v_mgr_ssn NUMERIC;
BEGIN
    SELECT m.empSalary, d.mgrSSN INTO v_mgr_salary, v_mgr_ssn
    FROM tblDepartment d JOIN tblEmployee m ON m.empSSN = d.mgrSSN
    WHERE d.depNum = NEW.depNum;
    IF NEW.empSSN &lt;&gt; v_mgr_ssn AND NEW.empSalary &gt; v_mgr_salary THEN
        RAISE EXCEPTION '% cannot earn % (manager earns %)', NEW.empName, NEW.empSalary, v_mgr_salary;
    END IF;
    RETURN NEW;
END $$;
-- UPDATE OF: the trap of test 4 cannot happen
CREATE TRIGGER tr_salary_not_above_manager
BEFORE INSERT OR UPDATE OF empSalary, depNum ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_salary_not_above_manager();
DO $$
BEGIN
    BEGIN
        UPDATE tblEmployee SET empSalary = 100000 WHERE empSSN = 30121050005;
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'refused: %', SQLERRM;
    END;
    UPDATE tblEmployee SET empSalary = 90000 WHERE empSSN = 30121050005;
    UPDATE tblEmployee SET empAddress = 'Đà Nẵng' WHERE empSSN = 30121050012;
    RAISE NOTICE 'salary 90000 and the address change were accepted';
END $$;
SELECT empSSN, empName, empSalary, empAddress FROM tblEmployee
WHERE empSSN IN (30121050005, 30121050012) ORDER BY empSSN;</code></pre>
<div class="out">NOTICE:  refused: Mai Duy An cannot earn 100000 (manager earns 95000)<br>
NOTICE:  salary 90000 and the address change were accepted</div>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>empsalary</th><th>empaddress</th></tr></thead>
<tbody>
<tr><td>30121050005</td><td>Mai Duy An</td><td>90000</td><td>7 Hàng Bài, Hoàn Kiếm, TP Hà Nội</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>105000</td><td>Đà Nẵng</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — triggers</a>.</div>`,
    `<h3>🧪 Bài 5 — Trigger: không nhân viên nào được lương cao hơn trưởng phòng của mình (~15 phút)</h3>
<p class="nhan">Đề</p>
<p>Tạo một trigger trên tblEmployee từ chối mọi câu INSERT hay UPDATE làm lương của một nhân viên cao hơn lương của trưởng phòng phòng người đó (tblDepartment.mgrSSN). Không kiểm chính trưởng phòng. Thử: tăng lương Mai Duy An (phòng 2, trưởng phòng Phạm Quốc Bảo lương 95000) lên 100000, rồi lên 90000; chèn một nhân viên mới phòng 1 lương 160000.</p>
<p class="nhan">Hướng nghĩ</p>
<ul>
<li>"Từ chối" ⇒ AFTER INSERT, UPDATE + <code>IF EXISTS (…) BEGIN RAISERROR … ROLLBACK END</code>.</li>
<li>Dòng sai: các dòng mới (<strong>inserted</strong>) nối với phòng của chúng và với dòng của trưởng phòng trong tblEmployee, nơi lương mới cao hơn.</li>
<li>EXISTS trên inserted ⇒ đúng cả khi một câu UPDATE đổi nhiều nhân viên.</li>
</ul>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">CREATE TRIGGER tr_Salary_Not_Above_Manager ON tblEmployee
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT *
               FROM   inserted i
               JOIN   tblDepartment d ON d.depNum = i.depNum
               JOIN   tblEmployee   m ON m.empSSN = d.mgrSSN     -- dòng của trưởng phòng
               WHERE  i.empSSN &lt;&gt; d.mgrSSN                       -- không kiểm chính trưởng phòng
                 AND  i.empSalary &gt; m.empSalary)
    BEGIN
        RAISERROR(N'An employee cannot earn more than the manager of his department.', 16, 1)
        ROLLBACK TRANSACTION
    END
END
GO</code></pre>
<p class="nhan">Phép thử và output thật</p>
<pre><code class="language-sql">-- 1. Mai Duy An (phòng 2, trưởng phòng Phạm Quốc Bảo lương 95000) đòi 100000
UPDATE tblEmployee SET empSalary = 100000 WHERE empSSN = 30121050005;
GO
-- 2. 90000 thì được
UPDATE tblEmployee SET empSalary = 90000 WHERE empSSN = 30121050005;
GO
-- 3. nhân viên mới phòng 1 (trưởng phòng lương 150000) với 160000
INSERT INTO tblEmployee(empSSN, empName, empSalary, depNum) VALUES (30121050400, N'Lâm Chí Cao', 160000, 1);
GO
-- 4. BẪY: Đặng Tuấn Anh VỐN ĐÃ lương 105000 &gt; 95000; chỉ đổi địa chỉ cũng bị từ chối
UPDATE tblEmployee SET empAddress = N'Đà Nẵng' WHERE empSSN = 30121050012;
GO
SELECT empSSN, empName, empSalary, empAddress FROM tblEmployee
WHERE empSSN IN (30121050005, 30121050012, 30121050400) ORDER BY empSSN;</code></pre>
<div class="out"><b>Msg 50000, Level 16, State 1<br>
An employee cannot earn more than the manager of his department.</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b><br>
<b>Msg 50000, Level 16, State 1<br>
An employee cannot earn more than the manager of his department.</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b><br>
<b>Msg 50000, Level 16, State 1<br>
An employee cannot earn more than the manager of his department.</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b></div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th><th>empAddress</th></tr></thead>
<tbody>
<tr><td>30121050005</td><td>Mai Duy An</td><td>90000</td><td>7 Hàng Bài, Hoàn Kiếm, TP Hà Nội</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>105000</td><td>5 Láng Hạ, Đống Đa, TP Hà Nội</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Phép thử</th><th>Mong đợi</th><th>Thực tế</th></tr></thead>
<tbody>
<tr><td>1. 005 → 100000 (> 95000)</td><td>bị từ chối</td><td>Msg 50000 + 3609 ✅</td></tr>
<tr><td>2. 005 → 90000</td><td>được nhận</td><td>lương 90000 trong câu SELECT cuối ✅</td></tr>
<tr><td>3. nhân viên mới, 160000 > 150000</td><td>bị từ chối</td><td>Msg 50000 + 3609, không có 30121050400 ✅</td></tr>
<tr><td>4. chỉ đổi địa chỉ của 012</td><td>được nhận</td><td><strong>bị từ chối</strong> ❌</td></tr>
</tbody>
</table>
<p>Phép thử 4 là cái bẫy: dữ liệu <em>vốn đã</em> sai luật (Đặng Tuấn Anh lương 105000, trưởng phòng 95000). Trigger kiểm mọi dòng trong inserted — mà câu UPDATE địa chỉ đưa cả dòng của 012, kể cả lương, vào inserted. Cách sửa: chỉ kiểm khi lương hoặc phòng thật sự có trong câu lệnh, bằng <code>UPDATE(cột)</code>:</p>
<pre><code class="language-sql">CREATE TRIGGER tr_Salary_Not_Above_Manager ON tblEmployee
AFTER INSERT, UPDATE
AS
BEGIN
    IF NOT (UPDATE(empSalary) OR UPDATE(depNum)) RETURN     -- không đụng lương hay phòng
    IF EXISTS (SELECT *
               FROM   inserted i
               JOIN   tblDepartment d ON d.depNum = i.depNum
               JOIN   tblEmployee   m ON m.empSSN = d.mgrSSN
               WHERE  i.empSSN &lt;&gt; d.mgrSSN
                 AND  i.empSalary &gt; m.empSalary)
    BEGIN
        RAISERROR(N'An employee cannot earn more than the manager of his department.', 16, 1)
        ROLLBACK TRANSACTION
    END
END
GO</code></pre>
<div class="out"><b>Msg 50000, Level 16, State 1<br>
An employee cannot earn more than the manager of his department.</b><br>
<b>Msg 3609, Level 16, State 1<br>
The transaction ended in the trigger. The batch has been aborted.</b></div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th><th>empAddress</th></tr></thead>
<tbody>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>105000</td><td>Đà Nẵng</td></tr>
<tr><td>30121050020</td><td>Nguyễn Thị Mai</td><td>96800</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td></tr>
<tr><td>30121050021</td><td>Bùi Văn Nam</td><td>44000</td><td><em>NULL</em></td></tr>
<tr><td>30121050027</td><td>Trương Thị Thu</td><td>90000</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td></tr>
</tbody>
</table>
<p>Giờ đổi địa chỉ thì qua; tăng 10% cả phòng 3 thì qua (trưởng phòng cũng được tăng); 027 lên 99000 &gt; 96800 thì bị từ chối.</p>
<div class="pitfall">Thêm hai lỗ hổng nên nói ra khi phỏng vấn: hạ lương <em>trưởng phòng</em> xuống dưới nhân viên thì không bị kiểm (luật có hai phía), và phòng có mgrSSN là NULL làm phép JOIN không thấy gì, nên nhân viên phòng đó không bao giờ bị kiểm. Trigger chỉ canh đúng những trường hợp bạn đã nghĩ tới.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> trigger BEFORE … FOR EACH ROW với <code>UPDATE OF empSalary, depNum</code> ở phần đầu — cái bẫy đổi địa chỉ không thể xảy ra vì trigger còn không được kích hoạt:
<pre><code class="language-sql">CREATE FUNCTION trg_salary_not_above_manager() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_mgr_salary NUMERIC; v_mgr_ssn NUMERIC;
BEGIN
    SELECT m.empSalary, d.mgrSSN INTO v_mgr_salary, v_mgr_ssn
    FROM tblDepartment d JOIN tblEmployee m ON m.empSSN = d.mgrSSN
    WHERE d.depNum = NEW.depNum;
    IF NEW.empSSN &lt;&gt; v_mgr_ssn AND NEW.empSalary &gt; v_mgr_salary THEN
        RAISE EXCEPTION '% cannot earn % (manager earns %)', NEW.empName, NEW.empSalary, v_mgr_salary;
    END IF;
    RETURN NEW;
END $$;
-- UPDATE OF: cái bẫy của phép thử 4 không xảy ra
CREATE TRIGGER tr_salary_not_above_manager
BEFORE INSERT OR UPDATE OF empSalary, depNum ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_salary_not_above_manager();
DO $$
BEGIN
    BEGIN
        UPDATE tblEmployee SET empSalary = 100000 WHERE empSSN = 30121050005;
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'refused: %', SQLERRM;
    END;
    UPDATE tblEmployee SET empSalary = 90000 WHERE empSSN = 30121050005;
    UPDATE tblEmployee SET empAddress = 'Đà Nẵng' WHERE empSSN = 30121050012;
    RAISE NOTICE 'salary 90000 and the address change were accepted';
END $$;
SELECT empSSN, empName, empSalary, empAddress FROM tblEmployee
WHERE empSSN IN (30121050005, 30121050012) ORDER BY empSSN;</code></pre>
<div class="out">NOTICE:  refused: Mai Duy An cannot earn 100000 (manager earns 95000)<br>
NOTICE:  salary 90000 and the address change were accepted</div>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>empsalary</th><th>empaddress</th></tr></thead>
<tbody>
<tr><td>30121050005</td><td>Mai Duy An</td><td>90000</td><td>7 Hàng Bài, Hoàn Kiếm, TP Hà Nội</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>105000</td><td>Đà Nẵng</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — trigger</a>.</div>`),
    bi(`<h3>🧪 Exercise 6 — Trigger: keep a log of deletions and salary changes (~12 min)</h3>
<p class="nhan">Task</p>
<p>Create a table tblEmployeeLog and a trigger that writes one log row for every deleted employee (action DELETE, old salary) and for every salary change (action SALARY, old and new salary), with the time and the login. Test: delete 30121050038, try to delete 30121050037 (the manager of department 5), raise department 4 by 2000, change only an address.</p>
<p class="nhan">How to think</p>
<ul>
<li>One trigger <code>AFTER DELETE, UPDATE</code>. In a DELETE only <code>deleted</code> has rows; in an UPDATE both do.</li>
<li>Real deletions = rows of deleted with no partner in inserted (<code>NOT EXISTS</code>). Salary changes = inserted JOIN deleted on the key, where the salary differs.</li>
<li><code>ISNULL(x, -1) &lt;&gt; ISNULL(y, -1)</code> so that NULL → 50000 counts as a change (<code>NULL &lt;&gt; 50000</code> is UNKNOWN).</li>
<li>Time and login come from DEFAULT values: <code>SYSDATETIME()</code>, <code>SUSER_SNAME()</code>.</li>
</ul>
<p class="nhan">Solution</p>
<pre><code class="language-sql">CREATE TABLE tblEmployeeLog (
    logID      INT IDENTITY(1,1) CONSTRAINT pk_employeelog PRIMARY KEY,
    action     NVARCHAR(10)  NOT NULL,
    empSSN     DECIMAL(18,0) NOT NULL,
    empName    NVARCHAR(50),
    oldSalary  DECIMAL(10,0),
    newSalary  DECIMAL(10,0),
    changedAt  DATETIME2     NOT NULL CONSTRAINT df_employeelog_at DEFAULT SYSDATETIME(),
    changedBy  NVARCHAR(128) NOT NULL CONSTRAINT df_employeelog_by DEFAULT SUSER_SNAME()
);
GO
CREATE TRIGGER tr_Employee_Log ON tblEmployee
AFTER DELETE, UPDATE
AS
BEGIN
    -- deleted rows that have no partner in inserted = real deletions
    INSERT INTO tblEmployeeLog(action, empSSN, empName, oldSalary)
    SELECT N'DELETE', d.empSSN, d.empName, d.empSalary
    FROM deleted d
    WHERE NOT EXISTS (SELECT * FROM inserted i WHERE i.empSSN = d.empSSN);
    -- salary changes: join old and new versions
    INSERT INTO tblEmployeeLog(action, empSSN, empName, oldSalary, newSalary)
    SELECT N'SALARY', i.empSSN, i.empName, d.empSalary, i.empSalary
    FROM inserted i JOIN deleted d ON d.empSSN = i.empSSN
    WHERE ISNULL(i.empSalary, -1) &lt;&gt; ISNULL(d.empSalary, -1);
END
GO</code></pre>
<p class="nhan">Tests and real output</p>
<pre><code class="language-sql">DELETE FROM tblEmployee WHERE empSSN = 30121050038;                    -- no child rows: deleted
GO
DELETE FROM tblEmployee WHERE empSSN = 30121050037;                    -- manager of dept 5: FK error
GO
UPDATE tblEmployee SET empSalary = empSalary + 2000 WHERE depNum = 4;   -- 1 salary change
UPDATE tblEmployee SET empAddress = N'Huế' WHERE empSSN = 30121050030;  -- no salary change: nothing logged
SELECT logID, action, empSSN, empName, oldSalary, newSalary, changedBy FROM tblEmployeeLog ORDER BY logID;</code></pre>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The DELETE statement conflicted with the REFERENCE constraint "fk_department_manager". The conflict occurred in database "DBI202", table "dbo.tblDepartment", column 'mgrSSN'.</b><br>
The statement has been terminated.</div>
<table>
<thead><tr><th>logID</th><th>action</th><th>empSSN</th><th>empName</th><th>oldSalary</th><th>newSalary</th><th>changedBy</th></tr></thead>
<tbody>
<tr><td>1</td><td>DELETE</td><td>30121050038</td><td>Phan Hữu Nghĩa</td><td>38000</td><td><em>NULL</em></td><td>sa</td></tr>
<tr><td>2</td><td>SALARY</td><td>30121050030</td><td>Huỳnh Văn Tài</td><td>70000</td><td>72000</td><td>sa</td></tr>
</tbody>
</table>
<ul>
<li>Deleting 038 is logged. Deleting 037 fails on the foreign key fk_department_manager (Msg 547) — the DELETE never happened, so the AFTER trigger never ran: no log row, which is correct.</li>
<li>Department 4 (only Huỳnh Văn Tài) is logged 70000 → 72000; the address change is not logged. (changedAt is left out of the display because it changes at every run.)</li>
</ul>
<div class="pitfall">An AFTER trigger runs only if the statement succeeded — constraints are checked first. If you must log attempts that fail, a trigger is the wrong tool (log in the procedure's CATCH instead).</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong>: one row-level function handles both events with <code>TG_OP</code>, and <code>IS DISTINCT FROM</code> is the NULL-safe "&lt;&gt;" (no ISNULL trick needed):
<pre><code class="language-sql">CREATE TABLE tblEmployeeLog (
    logID      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    action     VARCHAR(10) NOT NULL,
    empSSN     NUMERIC(18,0) NOT NULL,
    empName    VARCHAR(50),
    oldSalary  NUMERIC(10,0),
    newSalary  NUMERIC(10,0),
    changedAt  TIMESTAMPTZ NOT NULL DEFAULT now(),
    changedBy  TEXT NOT NULL DEFAULT current_user
);
CREATE FUNCTION trg_employee_log() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO tblEmployeeLog(action, empSSN, empName, oldSalary)
        VALUES ('DELETE', OLD.empSSN, OLD.empName, OLD.empSalary);
    ELSIF NEW.empSalary IS DISTINCT FROM OLD.empSalary THEN     -- NULL-safe &lt;&gt;
        INSERT INTO tblEmployeeLog(action, empSSN, empName, oldSalary, newSalary)
        VALUES ('SALARY', NEW.empSSN, NEW.empName, OLD.empSalary, NEW.empSalary);
    END IF;
    RETURN NULL;
END $$;
CREATE TRIGGER tr_employee_log AFTER DELETE OR UPDATE ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_employee_log();
DELETE FROM tblEmployee WHERE empSSN = 30121050038;
UPDATE tblEmployee SET empSalary = empSalary + 2000 WHERE depNum = 4;
UPDATE tblEmployee SET empAddress = 'Huế' WHERE empSSN = 30121050030;
SELECT logID, action, empSSN, empName, oldSalary, newSalary FROM tblEmployeeLog ORDER BY logID;</code></pre>
<div class="out">DELETE 1<br>
UPDATE 1<br>
UPDATE 1</div>
<table>
<thead><tr><th>logid</th><th>action</th><th>empssn</th><th>empname</th><th>oldsalary</th><th>newsalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>DELETE</td><td>30121050038</td><td>Phan Hữu Nghĩa</td><td>38000</td><td><em>NULL</em></td></tr>
<tr><td>2</td><td>SALARY</td><td>30121050030</td><td>Huỳnh Văn Tài</td><td>70000</td><td>72000</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — triggers</a>.</div>`,
    `<h3>🧪 Bài 6 — Trigger: ghi nhật ký khi xoá nhân viên và khi đổi lương (~12 phút)</h3>
<p class="nhan">Đề</p>
<p>Tạo bảng tblEmployeeLog và một trigger ghi một dòng nhật ký cho mỗi nhân viên bị xoá (action DELETE, lương cũ) và cho mỗi lần đổi lương (action SALARY, lương cũ và mới), kèm thời điểm và tên đăng nhập. Thử: xoá 30121050038, thử xoá 30121050037 (trưởng phòng 5), tăng phòng 4 thêm 2000, chỉ đổi một địa chỉ.</p>
<p class="nhan">Hướng nghĩ</p>
<ul>
<li>Một trigger <code>AFTER DELETE, UPDATE</code>. Với DELETE chỉ <code>deleted</code> có dòng; với UPDATE thì cả hai có.</li>
<li>Bị xoá thật = dòng của deleted không có cặp trong inserted (<code>NOT EXISTS</code>). Đổi lương = inserted JOIN deleted theo khoá, ở chỗ lương khác nhau.</li>
<li><code>ISNULL(x, -1) &lt;&gt; ISNULL(y, -1)</code> để NULL → 50000 cũng tính là thay đổi (<code>NULL &lt;&gt; 50000</code> là UNKNOWN).</li>
<li>Thời điểm và tên đăng nhập lấy từ giá trị DEFAULT: <code>SYSDATETIME()</code>, <code>SUSER_SNAME()</code>.</li>
</ul>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">CREATE TABLE tblEmployeeLog (
    logID      INT IDENTITY(1,1) CONSTRAINT pk_employeelog PRIMARY KEY,
    action     NVARCHAR(10)  NOT NULL,
    empSSN     DECIMAL(18,0) NOT NULL,
    empName    NVARCHAR(50),
    oldSalary  DECIMAL(10,0),
    newSalary  DECIMAL(10,0),
    changedAt  DATETIME2     NOT NULL CONSTRAINT df_employeelog_at DEFAULT SYSDATETIME(),
    changedBy  NVARCHAR(128) NOT NULL CONSTRAINT df_employeelog_by DEFAULT SUSER_SNAME()
);
GO
CREATE TRIGGER tr_Employee_Log ON tblEmployee
AFTER DELETE, UPDATE
AS
BEGIN
    -- dòng trong deleted không có cặp trong inserted = bị xoá thật
    INSERT INTO tblEmployeeLog(action, empSSN, empName, oldSalary)
    SELECT N'DELETE', d.empSSN, d.empName, d.empSalary
    FROM deleted d
    WHERE NOT EXISTS (SELECT * FROM inserted i WHERE i.empSSN = d.empSSN);
    -- đổi lương: nối bản cũ với bản mới
    INSERT INTO tblEmployeeLog(action, empSSN, empName, oldSalary, newSalary)
    SELECT N'SALARY', i.empSSN, i.empName, d.empSalary, i.empSalary
    FROM inserted i JOIN deleted d ON d.empSSN = i.empSSN
    WHERE ISNULL(i.empSalary, -1) &lt;&gt; ISNULL(d.empSalary, -1);
END
GO</code></pre>
<p class="nhan">Phép thử và output thật</p>
<pre><code class="language-sql">DELETE FROM tblEmployee WHERE empSSN = 30121050038;                    -- không có dòng con: xoá được
GO
DELETE FROM tblEmployee WHERE empSSN = 30121050037;                    -- trưởng phòng 5: lỗi khoá ngoại
GO
UPDATE tblEmployee SET empSalary = empSalary + 2000 WHERE depNum = 4;   -- 1 lần đổi lương
UPDATE tblEmployee SET empAddress = N'Huế' WHERE empSSN = 30121050030;  -- lương không đổi: không ghi
SELECT logID, action, empSSN, empName, oldSalary, newSalary, changedBy FROM tblEmployeeLog ORDER BY logID;</code></pre>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The DELETE statement conflicted with the REFERENCE constraint "fk_department_manager". The conflict occurred in database "DBI202", table "dbo.tblDepartment", column 'mgrSSN'.</b><br>
The statement has been terminated.</div>
<table>
<thead><tr><th>logID</th><th>action</th><th>empSSN</th><th>empName</th><th>oldSalary</th><th>newSalary</th><th>changedBy</th></tr></thead>
<tbody>
<tr><td>1</td><td>DELETE</td><td>30121050038</td><td>Phan Hữu Nghĩa</td><td>38000</td><td><em>NULL</em></td><td>sa</td></tr>
<tr><td>2</td><td>SALARY</td><td>30121050030</td><td>Huỳnh Văn Tài</td><td>70000</td><td>72000</td><td>sa</td></tr>
</tbody>
</table>
<ul>
<li>Xoá 038 được ghi. Xoá 037 hỏng vì khoá ngoại fk_department_manager (Msg 547) — câu DELETE không hề xảy ra, nên trigger AFTER không chạy: không có dòng nhật ký, và thế là đúng.</li>
<li>Phòng 4 (chỉ có Huỳnh Văn Tài) được ghi 70000 → 72000; việc đổi địa chỉ không được ghi. (changedAt không được hiện vì mỗi lần chạy mỗi khác.)</li>
</ul>
<div class="pitfall">Trigger AFTER chỉ chạy nếu câu lệnh thành công — ràng buộc được kiểm trước. Nếu phải ghi cả những lần thử thất bại thì trigger là công cụ sai (hãy ghi trong CATCH của thủ tục).</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>: một hàm mức dòng xử lý cả hai sự kiện nhờ <code>TG_OP</code>, và <code>IS DISTINCT FROM</code> là phép "&lt;&gt;" an toàn với NULL (không cần mẹo ISNULL):
<pre><code class="language-sql">CREATE TABLE tblEmployeeLog (
    logID      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    action     VARCHAR(10) NOT NULL,
    empSSN     NUMERIC(18,0) NOT NULL,
    empName    VARCHAR(50),
    oldSalary  NUMERIC(10,0),
    newSalary  NUMERIC(10,0),
    changedAt  TIMESTAMPTZ NOT NULL DEFAULT now(),
    changedBy  TEXT NOT NULL DEFAULT current_user
);
CREATE FUNCTION trg_employee_log() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO tblEmployeeLog(action, empSSN, empName, oldSalary)
        VALUES ('DELETE', OLD.empSSN, OLD.empName, OLD.empSalary);
    ELSIF NEW.empSalary IS DISTINCT FROM OLD.empSalary THEN     -- phép &lt;&gt; an toàn với NULL
        INSERT INTO tblEmployeeLog(action, empSSN, empName, oldSalary, newSalary)
        VALUES ('SALARY', NEW.empSSN, NEW.empName, OLD.empSalary, NEW.empSalary);
    END IF;
    RETURN NULL;
END $$;
CREATE TRIGGER tr_employee_log AFTER DELETE OR UPDATE ON tblEmployee
FOR EACH ROW EXECUTE FUNCTION trg_employee_log();
DELETE FROM tblEmployee WHERE empSSN = 30121050038;
UPDATE tblEmployee SET empSalary = empSalary + 2000 WHERE depNum = 4;
UPDATE tblEmployee SET empAddress = 'Huế' WHERE empSSN = 30121050030;
SELECT logID, action, empSSN, empName, oldSalary, newSalary FROM tblEmployeeLog ORDER BY logID;</code></pre>
<div class="out">DELETE 1<br>
UPDATE 1<br>
UPDATE 1</div>
<table>
<thead><tr><th>logid</th><th>action</th><th>empssn</th><th>empname</th><th>oldsalary</th><th>newsalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>DELETE</td><td>30121050038</td><td>Phan Hữu Nghĩa</td><td>38000</td><td><em>NULL</em></td></tr>
<tr><td>2</td><td>SALARY</td><td>30121050030</td><td>Huỳnh Văn Tài</td><td>70000</td><td>72000</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL 12.2 — trigger</a>.</div>`),
    bi(`<h3>🧪 Exercise 7 — Cursor: raise salaries by working hours (~12 min)</h3>
<p class="nhan">Task</p>
<p>For every employee of departments 1 and 2, use a cursor to raise the salary by 10% if he works 30 hours or more in total, otherwise by 5% (rounded to units), printing one line per employee "name: hours, old → new". Then write the same raise without a cursor and check that the total payroll after is identical.</p>
<p class="nhan">How to think</p>
<ul>
<li>The cursor's SELECT prepares everything per employee: SSN, name, salary, total hours (<code>LEFT JOIN</code> + <code>ISNULL(SUM, 0)</code> so employees without projects are not lost).</li>
<li>Loop body: compute the new salary with CASE, UPDATE one row, PRINT, FETCH next.</li>
<li><code>CURSOR LOCAL FAST_FORWARD</code> = forward-only, read-only, visible only in this batch — the cheapest cursor.</li>
</ul>
<p class="nhan">Solution with a cursor</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @ssn DECIMAL(18,0), @name NVARCHAR(50), @salary DECIMAL(10,0), @hours DECIMAL(6,1), @newSalary DECIMAL(10,0)
DECLARE raise_cursor CURSOR LOCAL FAST_FORWARD FOR      -- forward-only, read-only: the cheapest kind
    SELECT e.empSSN, e.empName, e.empSalary, ISNULL(SUM(w.workHours), 0)
    FROM tblEmployee e LEFT JOIN tblWorksOn w ON w.empSSN = e.empSSN
    WHERE e.depNum IN (1, 2)
    GROUP BY e.empSSN, e.empName, e.empSalary
    ORDER BY e.empSSN
OPEN raise_cursor
FETCH NEXT FROM raise_cursor INTO @ssn, @name, @salary, @hours
WHILE @@FETCH_STATUS = 0
BEGIN
    -- &gt;= 30 hours: +10%, otherwise +5%
    SET @newSalary = ROUND(@salary * CASE WHEN @hours &gt;= 30 THEN 1.10 ELSE 1.05 END, 0)
    UPDATE tblEmployee SET empSalary = @newSalary WHERE empSSN = @ssn
    PRINT @name + N': ' + CAST(@hours AS NVARCHAR(10)) + N'h, '
        + CAST(@salary AS NVARCHAR(12)) + N' -&gt; ' + CAST(@newSalary AS NVARCHAR(12))
    FETCH NEXT FROM raise_cursor INTO @ssn, @name, @salary, @hours
END
CLOSE raise_cursor
DEALLOCATE raise_cursor
SELECT SUM(empSalary) AS totalAfter FROM tblEmployee WHERE depNum IN (1, 2);</code></pre>
<div class="out">Trần Minh Quang: 10.0h, 150000 -&gt; 157500<br>
Hoàng Thị Hà: 20.0h, 90000 -&gt; 94500<br>
Võ Việt Anh: 52.5h, 60000 -&gt; 66000<br>
Lê Thị Lan Anh: 35.0h, 45000 -&gt; 49500<br>
Mai Duy An: 45.0h, 55000 -&gt; 60500<br>
Phạm Quốc Bảo: 30.0h, 95000 -&gt; 104500<br>
Hồ Ngọc Hân: 30.0h, 72000 -&gt; 79200<br>
Đặng Tuấn Anh: 35.0h, 105000 -&gt; 115500</div>
<table>
<thead><tr><th>totalAfter</th></tr></thead>
<tbody>
<tr><td>727200</td></tr>
</tbody>
</table>
<p class="nhan">The same job in one statement</p>
<pre><code class="language-sql">UPDATE e
SET    e.empSalary = ROUND(e.empSalary * CASE WHEN h.hours &gt;= 30 THEN 1.10 ELSE 1.05 END, 0)
FROM   tblEmployee e
JOIN  (SELECT e2.empSSN, ISNULL(SUM(w.workHours), 0) AS hours
       FROM tblEmployee e2 LEFT JOIN tblWorksOn w ON w.empSSN = e2.empSSN
       WHERE e2.depNum IN (1, 2)
       GROUP BY e2.empSSN) h ON h.empSSN = e.empSSN
WHERE  e.depNum IN (1, 2);
SELECT SUM(empSalary) AS totalAfter FROM tblEmployee WHERE depNum IN (1, 2);</code></pre>
<div class="out">(8 rows affected)</div>
<table>
<thead><tr><th>totalAfter</th></tr></thead>
<tbody>
<tr><td>727200</td></tr>
</tbody>
</table>
<p>Both give a total of 727200. The cursor ran 8 UPDATEs and 8 PRINTs; the set-based version one UPDATE of 8 rows. Only the per-employee message needs the cursor.</p>
<div class="pitfall">If the cursor's SELECT does not contain the hours, you are tempted to run a second SELECT inside the loop for each employee — 2 statements per row instead of 1. Prepare everything in the cursor's query. And never forget the FETCH at the end of the loop (endless loop).</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong>: <code>FOR r IN SELECT … LOOP</code> (the cursor is implicit), and the set-based form is <code>UPDATE … FROM (subquery)</code>:
<pre><code class="language-sql">DO $$
DECLARE r RECORD; v_new NUMERIC;
BEGIN
    FOR r IN SELECT e.empSSN, e.empName, e.empSalary, COALESCE(SUM(w.workHours), 0) AS hours
             FROM tblEmployee e LEFT JOIN tblWorksOn w ON w.empSSN = e.empSSN
             WHERE e.depNum IN (1, 2)
             GROUP BY e.empSSN, e.empName, e.empSalary
             ORDER BY e.empSSN LOOP
        v_new := ROUND(r.empSalary * CASE WHEN r.hours &gt;= 30 THEN 1.10 ELSE 1.05 END, 0);
        UPDATE tblEmployee SET empSalary = v_new WHERE empSSN = r.empSSN;
        RAISE NOTICE '%: %h, % -&gt; %', r.empName, r.hours, r.empSalary, v_new;
    END LOOP;
END $$;
SELECT SUM(empSalary) AS total_after FROM tblEmployee WHERE depNum IN (1, 2);</code></pre>
<div class="out">NOTICE:  Trần Minh Quang: 10.0h, 150000 -&gt; 157500<br>
NOTICE:  Hoàng Thị Hà: 20.0h, 90000 -&gt; 94500<br>
NOTICE:  Võ Việt Anh: 52.5h, 60000 -&gt; 66000<br>
NOTICE:  Lê Thị Lan Anh: 35.0h, 45000 -&gt; 49500<br>
NOTICE:  Mai Duy An: 45.0h, 55000 -&gt; 60500<br>
NOTICE:  Phạm Quốc Bảo: 30.0h, 95000 -&gt; 104500<br>
NOTICE:  Hồ Ngọc Hân: 30.0h, 72000 -&gt; 79200<br>
NOTICE:  Đặng Tuấn Anh: 35.0h, 105000 -&gt; 115500</div>
<table>
<thead><tr><th>total_after</th></tr></thead>
<tbody>
<tr><td>727200</td></tr>
</tbody>
</table>
<pre><code class="language-sql">UPDATE tblEmployee e
SET    empSalary = ROUND(e.empSalary * CASE WHEN h.hours &gt;= 30 THEN 1.10 ELSE 1.05 END, 0)
FROM  (SELECT e2.empSSN, COALESCE(SUM(w.workHours), 0) AS hours
       FROM tblEmployee e2 LEFT JOIN tblWorksOn w ON w.empSSN = e2.empSSN
       WHERE e2.depNum IN (1, 2)
       GROUP BY e2.empSSN) h
WHERE  h.empSSN = e.empSSN AND e.depNum IN (1, 2);
SELECT SUM(empSalary) AS total_after FROM tblEmployee WHERE depNum IN (1, 2);</code></pre>
<div class="out">UPDATE 8</div>
<table>
<thead><tr><th>total_after</th></tr></thead>
<tbody>
<tr><td>727200</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-4-update-delete">PostgreSQL 4.4 — UPDATE and DELETE</a>.</div>`,
    `<h3>🧪 Bài 7 — Cursor: tăng lương theo số giờ làm (~12 phút)</h3>
<p class="nhan">Đề</p>
<p>Với mọi nhân viên phòng 1 và phòng 2, dùng cursor tăng lương 10% nếu tổng giờ làm từ 30 giờ trở lên, ngược lại tăng 5% (làm tròn tới đơn vị), in mỗi nhân viên một dòng "tên: giờ, lương cũ → lương mới". Rồi viết cùng phép tăng lương đó không dùng cursor và kiểm tổng quỹ lương sau khi tăng là như nhau.</p>
<p class="nhan">Hướng nghĩ</p>
<ul>
<li>Câu SELECT của cursor chuẩn bị sẵn mọi thứ cho từng nhân viên: SSN, tên, lương, tổng giờ (<code>LEFT JOIN</code> + <code>ISNULL(SUM, 0)</code> để không mất người không có dự án).</li>
<li>Thân vòng lặp: tính lương mới bằng CASE, UPDATE một dòng, PRINT, FETCH dòng kế.</li>
<li><code>CURSOR LOCAL FAST_FORWARD</code> = chỉ đi tới, chỉ đọc, chỉ thấy trong lô này — loại cursor rẻ nhất.</li>
</ul>
<p class="nhan">Lời giải dùng cursor</p>
<pre><code class="language-sql">SET NOCOUNT ON
DECLARE @ssn DECIMAL(18,0), @name NVARCHAR(50), @salary DECIMAL(10,0), @hours DECIMAL(6,1), @newSalary DECIMAL(10,0)
DECLARE raise_cursor CURSOR LOCAL FAST_FORWARD FOR      -- chỉ đi tới, chỉ đọc: loại rẻ nhất
    SELECT e.empSSN, e.empName, e.empSalary, ISNULL(SUM(w.workHours), 0)
    FROM tblEmployee e LEFT JOIN tblWorksOn w ON w.empSSN = e.empSSN
    WHERE e.depNum IN (1, 2)
    GROUP BY e.empSSN, e.empName, e.empSalary
    ORDER BY e.empSSN
OPEN raise_cursor
FETCH NEXT FROM raise_cursor INTO @ssn, @name, @salary, @hours
WHILE @@FETCH_STATUS = 0
BEGIN
    -- &gt;= 30 giờ: +10%, không thì +5%
    SET @newSalary = ROUND(@salary * CASE WHEN @hours &gt;= 30 THEN 1.10 ELSE 1.05 END, 0)
    UPDATE tblEmployee SET empSalary = @newSalary WHERE empSSN = @ssn
    PRINT @name + N': ' + CAST(@hours AS NVARCHAR(10)) + N'h, '
        + CAST(@salary AS NVARCHAR(12)) + N' -&gt; ' + CAST(@newSalary AS NVARCHAR(12))
    FETCH NEXT FROM raise_cursor INTO @ssn, @name, @salary, @hours
END
CLOSE raise_cursor
DEALLOCATE raise_cursor
SELECT SUM(empSalary) AS totalAfter FROM tblEmployee WHERE depNum IN (1, 2);</code></pre>
<div class="out">Trần Minh Quang: 10.0h, 150000 -&gt; 157500<br>
Hoàng Thị Hà: 20.0h, 90000 -&gt; 94500<br>
Võ Việt Anh: 52.5h, 60000 -&gt; 66000<br>
Lê Thị Lan Anh: 35.0h, 45000 -&gt; 49500<br>
Mai Duy An: 45.0h, 55000 -&gt; 60500<br>
Phạm Quốc Bảo: 30.0h, 95000 -&gt; 104500<br>
Hồ Ngọc Hân: 30.0h, 72000 -&gt; 79200<br>
Đặng Tuấn Anh: 35.0h, 105000 -&gt; 115500</div>
<table>
<thead><tr><th>totalAfter</th></tr></thead>
<tbody>
<tr><td>727200</td></tr>
</tbody>
</table>
<p class="nhan">Cùng việc đó trong một câu lệnh</p>
<pre><code class="language-sql">UPDATE e
SET    e.empSalary = ROUND(e.empSalary * CASE WHEN h.hours &gt;= 30 THEN 1.10 ELSE 1.05 END, 0)
FROM   tblEmployee e
JOIN  (SELECT e2.empSSN, ISNULL(SUM(w.workHours), 0) AS hours
       FROM tblEmployee e2 LEFT JOIN tblWorksOn w ON w.empSSN = e2.empSSN
       WHERE e2.depNum IN (1, 2)
       GROUP BY e2.empSSN) h ON h.empSSN = e.empSSN
WHERE  e.depNum IN (1, 2);
SELECT SUM(empSalary) AS totalAfter FROM tblEmployee WHERE depNum IN (1, 2);</code></pre>
<div class="out">(8 rows affected)</div>
<table>
<thead><tr><th>totalAfter</th></tr></thead>
<tbody>
<tr><td>727200</td></tr>
</tbody>
</table>
<p>Cả hai cho tổng 727200. Cursor chạy 8 câu UPDATE và 8 câu PRINT; bản theo tập hợp chạy một câu UPDATE 8 dòng. Chỉ có dòng thông báo cho từng nhân viên là cần cursor.</p>
<div class="pitfall">Nếu câu SELECT của cursor không lấy sẵn số giờ, bạn sẽ muốn chạy thêm một câu SELECT trong vòng lặp cho mỗi nhân viên — mỗi dòng 2 câu lệnh thay vì 1. Chuẩn bị mọi thứ trong câu truy vấn của cursor. Và đừng bao giờ quên FETCH ở cuối vòng lặp (vòng lặp vô tận).</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>: <code>FOR r IN SELECT … LOOP</code> (cursor ngầm), và dạng theo tập hợp là <code>UPDATE … FROM (truy vấn con)</code>:
<pre><code class="language-sql">DO $$
DECLARE r RECORD; v_new NUMERIC;
BEGIN
    FOR r IN SELECT e.empSSN, e.empName, e.empSalary, COALESCE(SUM(w.workHours), 0) AS hours
             FROM tblEmployee e LEFT JOIN tblWorksOn w ON w.empSSN = e.empSSN
             WHERE e.depNum IN (1, 2)
             GROUP BY e.empSSN, e.empName, e.empSalary
             ORDER BY e.empSSN LOOP
        v_new := ROUND(r.empSalary * CASE WHEN r.hours &gt;= 30 THEN 1.10 ELSE 1.05 END, 0);
        UPDATE tblEmployee SET empSalary = v_new WHERE empSSN = r.empSSN;
        RAISE NOTICE '%: %h, % -&gt; %', r.empName, r.hours, r.empSalary, v_new;
    END LOOP;
END $$;
SELECT SUM(empSalary) AS total_after FROM tblEmployee WHERE depNum IN (1, 2);</code></pre>
<div class="out">NOTICE:  Trần Minh Quang: 10.0h, 150000 -&gt; 157500<br>
NOTICE:  Hoàng Thị Hà: 20.0h, 90000 -&gt; 94500<br>
NOTICE:  Võ Việt Anh: 52.5h, 60000 -&gt; 66000<br>
NOTICE:  Lê Thị Lan Anh: 35.0h, 45000 -&gt; 49500<br>
NOTICE:  Mai Duy An: 45.0h, 55000 -&gt; 60500<br>
NOTICE:  Phạm Quốc Bảo: 30.0h, 95000 -&gt; 104500<br>
NOTICE:  Hồ Ngọc Hân: 30.0h, 72000 -&gt; 79200<br>
NOTICE:  Đặng Tuấn Anh: 35.0h, 105000 -&gt; 115500</div>
<table>
<thead><tr><th>total_after</th></tr></thead>
<tbody>
<tr><td>727200</td></tr>
</tbody>
</table>
<pre><code class="language-sql">UPDATE tblEmployee e
SET    empSalary = ROUND(e.empSalary * CASE WHEN h.hours &gt;= 30 THEN 1.10 ELSE 1.05 END, 0)
FROM  (SELECT e2.empSSN, COALESCE(SUM(w.workHours), 0) AS hours
       FROM tblEmployee e2 LEFT JOIN tblWorksOn w ON w.empSSN = e2.empSSN
       WHERE e2.depNum IN (1, 2)
       GROUP BY e2.empSSN) h
WHERE  h.empSSN = e.empSSN AND e.depNum IN (1, 2);
SELECT SUM(empSalary) AS total_after FROM tblEmployee WHERE depNum IN (1, 2);</code></pre>
<div class="out">UPDATE 8</div>
<table>
<thead><tr><th>total_after</th></tr></thead>
<tbody>
<tr><td>727200</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-4-update-delete">PostgreSQL 4.4 — UPDATE và DELETE</a>.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>T-SQL (Transact-SQL)</strong></td><td>phương ngữ SQL của SQL Server</td><td>SQL plus variables, IF, WHILE and error handling, as used by SQL Server.</td></tr>
<tr><td><strong>PL/pgSQL</strong></td><td>ngôn ngữ thủ tục của PostgreSQL</td><td>PostgreSQL's procedural language, close to the SQL/PSM standard.</td></tr>
<tr><td><strong>SQL/PSM (Persistent Stored Modules)</strong></td><td>chuẩn mô-đun lưu trữ bền</td><td>The ISO standard for procedures and functions stored in the database.</td></tr>
<tr><td><strong>batch</strong></td><td>lô lệnh</td><td>The statements between two GO lines, sent to the server together.</td></tr>
<tr><td><strong>variable (@name)</strong></td><td>biến</td><td>A named box holding one value while a batch runs.</td></tr>
<tr><td><strong>stored procedure</strong></td><td>thủ tục lưu trữ</td><td>A named program saved in the database and run with EXEC.</td></tr>
<tr><td><strong>parameter / OUTPUT parameter</strong></td><td>tham số / tham số ra</td><td>A value passed in; an OUTPUT one is written back to the caller's variable.</td></tr>
<tr><td><strong>return code</strong></td><td>mã trả về</td><td>The INT a procedure gives back with RETURN, read by EXEC @rc = ….</td></tr>
<tr><td><strong>scalar function</strong></td><td>hàm vô hướng</td><td>A function returning one value, called as dbo.f(x).</td></tr>
<tr><td><strong>table-valued function</strong></td><td>hàm trả về bảng</td><td>A function returning a table, used in FROM (inline or multi-statement).</td></tr>
<tr><td><strong>trigger</strong></td><td>bẫy sự kiện</td><td>Code that runs by itself when an INSERT, UPDATE or DELETE hits its table.</td></tr>
<tr><td><strong>inserted / deleted</strong></td><td>bảng dòng mới / bảng dòng cũ</td><td>Read-only tables inside a T-SQL trigger with the new and the old versions of the changed rows.</td></tr>
<tr><td><strong>NEW / OLD</strong></td><td>dòng mới / dòng cũ</td><td>In a PostgreSQL row-level trigger, the new and the old version of the one row being changed.</td></tr>
<tr><td><strong>row-level / statement-level trigger</strong></td><td>trigger mức dòng / mức câu lệnh</td><td>Runs once per changed row / once per statement (T-SQL triggers are statement-level).</td></tr>
<tr><td><strong>AFTER / BEFORE / INSTEAD OF</strong></td><td>sau / trước / thay cho</td><td>When the trigger runs relative to the change, or in place of it.</td></tr>
<tr><td><strong>transaction</strong></td><td>giao dịch</td><td>A group of statements that succeed or fail together (COMMIT / ROLLBACK).</td></tr>
<tr><td><strong>TRY…CATCH / EXCEPTION</strong></td><td>khối bắt lỗi</td><td>Error handling: the CATCH (or EXCEPTION) part runs when a statement fails.</td></tr>
<tr><td><strong>RAISERROR / RAISE EXCEPTION</strong></td><td>phát lỗi</td><td>Sends an error message; in PostgreSQL it also cancels the statement.</td></tr>
<tr><td><strong>cursor</strong></td><td>con trỏ</td><td>A way to read a query result one row at a time (DECLARE, OPEN, FETCH, CLOSE, DEALLOCATE).</td></tr>
<tr><td><strong>set-based</strong></td><td>xử lý theo tập hợp</td><td>Doing a job with one statement over all rows instead of a loop.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>T-SQL (Transact-SQL)</strong></td><td>phương ngữ SQL của SQL Server</td><td>SQL cộng thêm biến, IF, WHILE và xử lý lỗi, dùng trong SQL Server.</td></tr>
<tr><td><strong>PL/pgSQL</strong></td><td>ngôn ngữ thủ tục của PostgreSQL</td><td>Ngôn ngữ thủ tục của PostgreSQL, gần với chuẩn SQL/PSM.</td></tr>
<tr><td><strong>SQL/PSM (Persistent Stored Modules)</strong></td><td>chuẩn mô-đun lưu trữ bền</td><td>Chuẩn ISO cho thủ tục và hàm cất trong CSDL.</td></tr>
<tr><td><strong>batch</strong></td><td>lô lệnh</td><td>Các câu lệnh giữa hai dòng GO, được gửi lên máy chủ cùng một lượt.</td></tr>
<tr><td><strong>variable (@name)</strong></td><td>biến</td><td>Hộp có tên giữ một giá trị trong lúc một lô chạy.</td></tr>
<tr><td><strong>stored procedure</strong></td><td>thủ tục lưu trữ</td><td>Chương trình có tên cất trong CSDL, chạy bằng EXEC.</td></tr>
<tr><td><strong>parameter / OUTPUT parameter</strong></td><td>tham số / tham số ra</td><td>Giá trị truyền vào; tham số OUTPUT được ghi ngược vào biến của người gọi.</td></tr>
<tr><td><strong>return code</strong></td><td>mã trả về</td><td>Số INT thủ tục trả lại bằng RETURN, đọc bằng EXEC @rc = ….</td></tr>
<tr><td><strong>scalar function</strong></td><td>hàm vô hướng</td><td>Hàm trả về một giá trị, gọi dạng dbo.f(x).</td></tr>
<tr><td><strong>table-valued function</strong></td><td>hàm trả về bảng</td><td>Hàm trả về một bảng, dùng trong FROM (dạng inline hoặc nhiều câu lệnh).</td></tr>
<tr><td><strong>trigger</strong></td><td>bẫy sự kiện</td><td>Code tự chạy khi có INSERT, UPDATE hoặc DELETE trên bảng của nó.</td></tr>
<tr><td><strong>inserted / deleted</strong></td><td>bảng dòng mới / bảng dòng cũ</td><td>Bảng chỉ đọc bên trong trigger T-SQL chứa bản mới và bản cũ của các dòng bị đổi.</td></tr>
<tr><td><strong>NEW / OLD</strong></td><td>dòng mới / dòng cũ</td><td>Trong trigger mức dòng của PostgreSQL, bản mới và bản cũ của một dòng đang bị đổi.</td></tr>
<tr><td><strong>row-level / statement-level trigger</strong></td><td>trigger mức dòng / mức câu lệnh</td><td>Chạy mỗi dòng bị đổi một lần / mỗi câu lệnh một lần (trigger T-SQL là mức câu lệnh).</td></tr>
<tr><td><strong>AFTER / BEFORE / INSTEAD OF</strong></td><td>sau / trước / thay cho</td><td>Thời điểm trigger chạy so với thay đổi, hoặc chạy thay cho nó.</td></tr>
<tr><td><strong>transaction</strong></td><td>giao dịch</td><td>Nhóm câu lệnh cùng thành công hoặc cùng thất bại (COMMIT / ROLLBACK).</td></tr>
<tr><td><strong>TRY…CATCH / EXCEPTION</strong></td><td>khối bắt lỗi</td><td>Xử lý lỗi: phần CATCH (hoặc EXCEPTION) chạy khi một câu lệnh hỏng.</td></tr>
<tr><td><strong>RAISERROR / RAISE EXCEPTION</strong></td><td>phát lỗi</td><td>Gửi một thông báo lỗi; trên PostgreSQL nó còn huỷ luôn câu lệnh.</td></tr>
<tr><td><strong>cursor</strong></td><td>con trỏ</td><td>Cách đọc kết quả truy vấn từng dòng một (DECLARE, OPEN, FETCH, CLOSE, DEALLOCATE).</td></tr>
<tr><td><strong>set-based</strong></td><td>xử lý theo tập hợp</td><td>Làm một việc bằng một câu lệnh trên mọi dòng thay vì một vòng lặp.</td></tr>
</tbody>
</table>`),
    bi(`<h2>🔁 T-SQL ↔ PostgreSQL — programming the database</h2>
<p>In the PE you type the left-hand column; in your project and at work (PostgreSQL) the right-hand one.</p>
<table>
<thead><tr><th>Task</th><th>T-SQL (SQL Server)</th><th>PostgreSQL (PL/pgSQL)</th></tr></thead>
<tbody>
<tr><td>Where code runs</td><td>loose in a script, split by <code>GO</code></td><td>inside <code>DO $$ … $$</code>, a function or a procedure</td></tr>
<tr><td>Variable</td><td><code>DECLARE @n INT = 5</code></td><td><code>DECLARE n INT := 5;</code> (in the block's DECLARE part)</td></tr>
<tr><td>Assign</td><td><code>SET @n = …</code> / <code>SELECT @n = col FROM …</code></td><td><code>n := …;</code> / <code>SELECT col INTO n FROM …;</code></td></tr>
<tr><td>Print</td><td><code>PRINT N'…' + CAST(@n AS VARCHAR)</code></td><td><code>RAISE NOTICE '… %', n;</code></td></tr>
<tr><td>IF</td><td><code>IF c … ELSE IF c … ELSE …</code> (+ BEGIN…END)</td><td><code>IF c THEN … ELSIF c THEN … ELSE … END IF;</code></td></tr>
<tr><td>Loops</td><td><code>WHILE c BEGIN … BREAK / CONTINUE END</code></td><td><code>WHILE c LOOP … END LOOP</code>, <code>FOR i IN 1..n LOOP</code>, <code>LOOP … EXIT WHEN c; END LOOP</code></td></tr>
<tr><td>Errors</td><td><code>BEGIN TRY … END TRY BEGIN CATCH … END CATCH</code>, <code>ERROR_NUMBER()</code>, <code>ERROR_MESSAGE()</code></td><td><code>BEGIN … EXCEPTION WHEN … THEN … END</code>, <code>SQLSTATE</code>, <code>SQLERRM</code></td></tr>
<tr><td>Raise an error</td><td><code>RAISERROR('…', 16, 1)</code> (+ ROLLBACK) / <code>THROW 50001, '…', 1</code></td><td><code>RAISE EXCEPTION '…';</code></td></tr>
<tr><td>Procedure</td><td><code>CREATE PROCEDURE p @a INT, @b INT OUTPUT AS …</code></td><td><code>CREATE PROCEDURE p(a INT, INOUT b INT) LANGUAGE plpgsql AS $$ … $$;</code></td></tr>
<tr><td>Call it</td><td><code>EXEC p 1, @x OUTPUT</code></td><td><code>CALL p(1, NULL);</code></td></tr>
<tr><td>Scalar function</td><td><code>CREATE FUNCTION f(@a INT) RETURNS INT AS BEGIN RETURN … END</code>, call <code>dbo.f(1)</code></td><td><code>CREATE FUNCTION f(a INT) RETURNS INT LANGUAGE sql AS $$ SELECT … $$;</code>, call <code>f(1)</code></td></tr>
<tr><td>Table function</td><td><code>RETURNS TABLE AS RETURN (SELECT …)</code></td><td><code>RETURNS TABLE (col type, …)</code> or <code>RETURNS SETOF tbl</code></td></tr>
<tr><td>Drop if exists</td><td><code>IF OBJECT_ID('p','P') IS NOT NULL DROP PROCEDURE p</code> / <code>CREATE OR ALTER</code></td><td><code>DROP … IF EXISTS</code> / <code>CREATE OR REPLACE</code></td></tr>
<tr><td>Trigger</td><td><code>CREATE TRIGGER t ON tbl AFTER INSERT, UPDATE AS …</code></td><td>trigger function <code>RETURNS trigger</code> + <code>CREATE TRIGGER t AFTER INSERT OR UPDATE ON tbl FOR EACH ROW EXECUTE FUNCTION f();</code></td></tr>
<tr><td>Changed rows</td><td>tables <code>inserted</code>, <code>deleted</code> (statement-level)</td><td><code>NEW</code>, <code>OLD</code> (row-level) · <code>REFERENCING NEW TABLE AS …</code> (statement-level)</td></tr>
<tr><td>Only some columns</td><td><code>IF UPDATE(col)</code> in the body</td><td><code>UPDATE OF col</code> in the header, <code>WHEN (…)</code></td></tr>
<tr><td>Change the row before it is stored</td><td>not possible (AFTER only) — use INSTEAD OF</td><td>BEFORE trigger: <code>NEW.col := …; RETURN NEW;</code></td></tr>
<tr><td>Switch a trigger off</td><td><code>DISABLE TRIGGER t ON tbl</code></td><td><code>ALTER TABLE tbl DISABLE TRIGGER t</code></td></tr>
<tr><td>Cursor loop</td><td><code>DECLARE c CURSOR FOR …; OPEN; FETCH NEXT … INTO; WHILE @@FETCH_STATUS = 0 …; CLOSE; DEALLOCATE</code></td><td><code>FOR r IN SELECT … LOOP … END LOOP;</code></td></tr>
<tr><td>Rows touched</td><td><code>@@ROWCOUNT</code></td><td><code>GET DIAGNOSTICS n = ROW_COUNT;</code> / <code>FOUND</code></td></tr>
</tbody>
</table>`,
    `<h2>🔁 T-SQL ↔ PostgreSQL — lập trình trong CSDL</h2>
<p>Ở bài PE bạn gõ cột bên trái; trong đồ án và khi đi làm (PostgreSQL) bạn gõ cột bên phải.</p>
<table>
<thead><tr><th>Việc</th><th>T-SQL (SQL Server)</th><th>PostgreSQL (PL/pgSQL)</th></tr></thead>
<tbody>
<tr><td>Code chạy ở đâu</td><td>thả trong script, tách lô bằng <code>GO</code></td><td>trong <code>DO $$ … $$</code>, một hàm hoặc một thủ tục</td></tr>
<tr><td>Biến</td><td><code>DECLARE @n INT = 5</code></td><td><code>DECLARE n INT := 5;</code> (trong phần DECLARE của khối)</td></tr>
<tr><td>Gán</td><td><code>SET @n = …</code> / <code>SELECT @n = cột FROM …</code></td><td><code>n := …;</code> / <code>SELECT cột INTO n FROM …;</code></td></tr>
<tr><td>In</td><td><code>PRINT N'…' + CAST(@n AS VARCHAR)</code></td><td><code>RAISE NOTICE '… %', n;</code></td></tr>
<tr><td>IF</td><td><code>IF c … ELSE IF c … ELSE …</code> (+ BEGIN…END)</td><td><code>IF c THEN … ELSIF c THEN … ELSE … END IF;</code></td></tr>
<tr><td>Vòng lặp</td><td><code>WHILE c BEGIN … BREAK / CONTINUE END</code></td><td><code>WHILE c LOOP … END LOOP</code>, <code>FOR i IN 1..n LOOP</code>, <code>LOOP … EXIT WHEN c; END LOOP</code></td></tr>
<tr><td>Bắt lỗi</td><td><code>BEGIN TRY … END TRY BEGIN CATCH … END CATCH</code>, <code>ERROR_NUMBER()</code>, <code>ERROR_MESSAGE()</code></td><td><code>BEGIN … EXCEPTION WHEN … THEN … END</code>, <code>SQLSTATE</code>, <code>SQLERRM</code></td></tr>
<tr><td>Phát lỗi</td><td><code>RAISERROR('…', 16, 1)</code> (+ ROLLBACK) / <code>THROW 50001, '…', 1</code></td><td><code>RAISE EXCEPTION '…';</code></td></tr>
<tr><td>Thủ tục</td><td><code>CREATE PROCEDURE p @a INT, @b INT OUTPUT AS …</code></td><td><code>CREATE PROCEDURE p(a INT, INOUT b INT) LANGUAGE plpgsql AS $$ … $$;</code></td></tr>
<tr><td>Gọi thủ tục</td><td><code>EXEC p 1, @x OUTPUT</code></td><td><code>CALL p(1, NULL);</code></td></tr>
<tr><td>Hàm vô hướng</td><td><code>CREATE FUNCTION f(@a INT) RETURNS INT AS BEGIN RETURN … END</code>, gọi <code>dbo.f(1)</code></td><td><code>CREATE FUNCTION f(a INT) RETURNS INT LANGUAGE sql AS $$ SELECT … $$;</code>, gọi <code>f(1)</code></td></tr>
<tr><td>Hàm trả bảng</td><td><code>RETURNS TABLE AS RETURN (SELECT …)</code></td><td><code>RETURNS TABLE (cột kiểu, …)</code> hoặc <code>RETURNS SETOF bảng</code></td></tr>
<tr><td>Có rồi thì xoá</td><td><code>IF OBJECT_ID('p','P') IS NOT NULL DROP PROCEDURE p</code> / <code>CREATE OR ALTER</code></td><td><code>DROP … IF EXISTS</code> / <code>CREATE OR REPLACE</code></td></tr>
<tr><td>Trigger</td><td><code>CREATE TRIGGER t ON bảng AFTER INSERT, UPDATE AS …</code></td><td>hàm trigger <code>RETURNS trigger</code> + <code>CREATE TRIGGER t AFTER INSERT OR UPDATE ON bảng FOR EACH ROW EXECUTE FUNCTION f();</code></td></tr>
<tr><td>Các dòng bị đổi</td><td>bảng <code>inserted</code>, <code>deleted</code> (mức câu lệnh)</td><td><code>NEW</code>, <code>OLD</code> (mức dòng) · <code>REFERENCING NEW TABLE AS …</code> (mức câu lệnh)</td></tr>
<tr><td>Chỉ vài cột</td><td><code>IF UPDATE(cột)</code> trong thân</td><td><code>UPDATE OF cột</code> ở phần đầu, <code>WHEN (…)</code></td></tr>
<tr><td>Sửa dòng trước khi lưu</td><td>không làm được (chỉ có AFTER) — dùng INSTEAD OF</td><td>trigger BEFORE: <code>NEW.cột := …; RETURN NEW;</code></td></tr>
<tr><td>Tắt trigger</td><td><code>DISABLE TRIGGER t ON bảng</code></td><td><code>ALTER TABLE bảng DISABLE TRIGGER t</code></td></tr>
<tr><td>Vòng lặp cursor</td><td><code>DECLARE c CURSOR FOR …; OPEN; FETCH NEXT … INTO; WHILE @@FETCH_STATUS = 0 …; CLOSE; DEALLOCATE</code></td><td><code>FOR r IN SELECT … LOOP … END LOOP;</code></td></tr>
<tr><td>Số dòng bị chạm</td><td><code>@@ROWCOUNT</code></td><td><code>GET DIAGNOSTICS n = ROW_COUNT;</code> / <code>FOUND</code></td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — Chapter 7 in 8 points</h2>
<ol>
<li><strong>T-SQL = SQL + programming</strong>: variables (@name, DECLARE, SET / SELECT), PRINT with CAST, IF…ELSE with BEGIN…END, CASE, WHILE with BREAK / CONTINUE. A variable lives only in its batch (between two GO).</li>
<li><strong>Errors</strong>: @@ERROR describes only the previous statement; use <code>BEGIN TRAN; BEGIN TRY … COMMIT END TRY BEGIN CATCH ROLLBACK … END CATCH</code>.</li>
<li><strong>Stored procedure</strong> = a named program run with EXEC: parameters with defaults, OUTPUT parameters (written in CREATE <em>and</em> in EXEC), RETURN code; advantages: reuse, maintenance, less traffic, cached plan, security (EXECUTE right without table rights).</li>
<li><strong>Function</strong> = returns one value (scalar, called <code>dbo.f()</code>) or one table (inline — one SELECT, fast; multi-statement — a table variable); it may not change the database.</li>
<li><strong>Trigger</strong> = event – condition – action, run by itself on INSERT / UPDATE / DELETE; in T-SQL: AFTER (or INSTEAD OF), once per statement, rows in <code>inserted</code> / <code>deleted</code>.</li>
<li><strong>Refusing in a trigger</strong>: <code>IF EXISTS (SELECT * FROM inserted …) BEGIN RAISERROR(…) ROLLBACK TRANSACTION END</code> — never a variable read from inserted; RAISERROR alone keeps the row.</li>
<li><strong>Cursor</strong>: DECLARE, OPEN, FETCH before the loop, WHILE @@FETCH_STATUS = 0 (… FETCH at the end), CLOSE, DEALLOCATE — and first ask whether one set-based statement does the job.</li>
<li><strong>PostgreSQL</strong>: code in <code>DO $$</code> / functions <code>LANGUAGE plpgsql</code>, <code>CALL</code> for procedures, INOUT, trigger = trigger function + CREATE TRIGGER … EXECUTE FUNCTION, NEW / OLD, FOR EACH ROW or STATEMENT, BEFORE triggers, RAISE NOTICE / EXCEPTION, <code>FOR r IN SELECT</code> instead of cursors.</li>
</ol>`,
    `<h2>📌 Tóm tắt — Chương 7 trong 8 ý</h2>
<ol>
<li><strong>T-SQL = SQL + lập trình</strong>: biến (@tên, DECLARE, SET / SELECT), PRINT kèm CAST, IF…ELSE với BEGIN…END, CASE, WHILE với BREAK / CONTINUE. Biến chỉ sống trong lô của nó (giữa hai chữ GO).</li>
<li><strong>Lỗi</strong>: @@ERROR chỉ nói về câu lệnh ngay trước; hãy dùng <code>BEGIN TRAN; BEGIN TRY … COMMIT END TRY BEGIN CATCH ROLLBACK … END CATCH</code>.</li>
<li><strong>Stored procedure</strong> = chương trình có tên chạy bằng EXEC: tham số có mặc định, tham số OUTPUT (viết ở CREATE <em>và</em> ở EXEC), mã RETURN; lợi ích: dùng lại, dễ bảo trì, ít lưu lượng mạng, kế hoạch được cache, bảo mật (quyền EXECUTE mà không cần quyền trên bảng).</li>
<li><strong>Function</strong> = trả về một giá trị (vô hướng, gọi <code>dbo.f()</code>) hoặc một bảng (inline — một câu SELECT, nhanh; nhiều câu lệnh — một biến bảng); không được sửa CSDL.</li>
<li><strong>Trigger</strong> = sự kiện – điều kiện – hành động, tự chạy khi có INSERT / UPDATE / DELETE; trong T-SQL: AFTER (hoặc INSTEAD OF), mỗi câu lệnh một lần, các dòng nằm trong <code>inserted</code> / <code>deleted</code>.</li>
<li><strong>Từ chối trong trigger</strong>: <code>IF EXISTS (SELECT * FROM inserted …) BEGIN RAISERROR(…) ROLLBACK TRANSACTION END</code> — không bao giờ đọc inserted vào một biến; chỉ RAISERROR thì dòng vẫn được giữ.</li>
<li><strong>Cursor</strong>: DECLARE, OPEN, FETCH trước vòng lặp, WHILE @@FETCH_STATUS = 0 (… FETCH ở cuối), CLOSE, DEALLOCATE — và trước hết hãy hỏi một câu lệnh theo tập hợp có làm được việc đó không.</li>
<li><strong>PostgreSQL</strong>: code trong <code>DO $$</code> / hàm <code>LANGUAGE plpgsql</code>, <code>CALL</code> cho thủ tục, INOUT, trigger = hàm trigger + CREATE TRIGGER … EXECUTE FUNCTION, NEW / OLD, FOR EACH ROW hoặc STATEMENT, trigger BEFORE, RAISE NOTICE / EXCEPTION, <code>FOR r IN SELECT</code> thay cho cursor.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (dbi202-quiz-ch7) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'What does the last SELECT return?|||Câu SELECT cuối trả về gì?',
      code: `DECLARE @i INT = 1, @s INT = 0
WHILE (@i <= 4)
BEGIN
    SET @s = @s + @i
    SET @i = @i + 2
END
SELECT @s AS s`,
      codeLang: 'sql',
      options: ['10 — the sum 1 + 2 + 3 + 4|||10 — tổng 1 + 2 + 3 + 4', '9 — the sum 1 + 3 + 5|||9 — tổng 1 + 3 + 5', '4 — the sum 1 + 3|||4 — tổng 1 + 3', '1 — the loop runs once|||1 — vòng lặp chạy một lần'],
      correctIndex: 2,
      points: 1,
      explanation: '@i takes the values 1 and 3 inside the loop (it grows by 2), so @s = 1 + 3 = 4; when @i becomes 5 the test 5 <= 4 is FALSE and the loop stops. Answer B adds 5 as well, but 5 is never inside the loop because the condition is tested before each round; A forgets that the step is 2, not 1.|||@i nhận các giá trị 1 và 3 bên trong vòng lặp (mỗi lần tăng 2), nên @s = 1 + 3 = 4; khi @i thành 5 thì phép kiểm 5 <= 4 là FALSE và vòng lặp dừng. Đáp án B cộng cả 5, nhưng 5 không bao giờ vào được vòng lặp vì điều kiện được kiểm trước mỗi vòng; A quên rằng bước nhảy là 2 chứ không phải 1.' },
    { id: 'q2',
      question: 'Department 1 already exists in FUHCompany. What does the final SELECT show?|||Phòng 1 đã có trong FUHCompany. Câu SELECT cuối hiện ra gì?',
      code: `INSERT INTO tblDepartment(depNum, depName) VALUES (1, N'Trùng');
PRINT N'checking...'
SELECT @@ERROR AS err`,
      codeLang: 'sql',
      options: ['2627 — the number of the duplicate-key error|||2627 — mã của lỗi trùng khoá', '0|||0', 'NULL — @@ERROR is only set inside TRY…CATCH|||NULL — @@ERROR chỉ được đặt trong TRY…CATCH', 'nothing — the error stops the batch|||không gì cả — lỗi làm dừng lô lệnh'],
      correctIndex: 1,
      points: 1,
      explanation: '@@ERROR describes only the statement executed just before it. The INSERT failed with 2627, but the PRINT that follows succeeded and reset @@ERROR to 0. The tempting 2627 is what SELECT @@ERROR would show directly after the INSERT; D is wrong because a duplicate key is a statement-level error — the batch goes on.|||@@ERROR chỉ nói về câu lệnh chạy ngay trước nó. Câu INSERT hỏng với 2627, nhưng câu PRINT theo sau chạy thành công và đặt lại @@ERROR về 0. Con số hấp dẫn 2627 là thứ SELECT @@ERROR hiện ra nếu đặt ngay sau INSERT; D sai vì trùng khoá là lỗi mức câu lệnh — lô vẫn chạy tiếp.' },
    { id: 'q3',
      question: 'Table T holds one row (x = 1). After the script, what does SELECT COUNT(*) FROM T return?|||Bảng T có một dòng (x = 1). Sau đoạn script, SELECT COUNT(*) FROM T trả về gì?',
      code: `CREATE TRIGGER trT ON T AFTER INSERT
AS
    RAISERROR('Not allowed', 16, 1)
GO
INSERT INTO T VALUES (2);
GO
SELECT COUNT(*) AS n FROM T`,
      codeLang: 'sql',
      options: ['1 — the trigger refused the new row|||1 — trigger đã từ chối dòng mới', '0 — the error rolls back the whole table|||0 — lỗi huỷ cả bảng', 'an error: COUNT cannot run after RAISERROR|||báo lỗi: COUNT không chạy được sau RAISERROR', '2 — the row x = 2 is stored despite the error|||2 — dòng x = 2 vẫn được lưu dù có lỗi'],
      correctIndex: 3,
      points: 1,
      explanation: 'RAISERROR only sends an error message (Msg 50000); it does not undo anything. Without ROLLBACK TRANSACTION in the trigger, the INSERT stays, so T has 2 rows. Answer A is what the author of the trigger wanted — it needs RAISERROR followed by ROLLBACK TRANSACTION (slide 43).|||RAISERROR chỉ gửi một thông báo lỗi (Msg 50000); nó không huỷ gì cả. Không có ROLLBACK TRANSACTION trong trigger thì câu INSERT ở lại, nên T có 2 dòng. Đáp án A là điều người viết trigger mong muốn — muốn vậy phải có RAISERROR kèm ROLLBACK TRANSACTION (slide 43).' },
    { id: 'q4',
      question: 'T and LogT are empty. How many rows does LogT hold at the end?|||T và LogT đang rỗng. Cuối cùng LogT có bao nhiêu dòng?',
      code: `CREATE TRIGGER trT ON T AFTER INSERT
AS
    DECLARE @v INT
    SELECT @v = x FROM inserted
    INSERT INTO LogT VALUES (@v)
GO
INSERT INTO T VALUES (10), (20), (30);
SELECT COUNT(*) AS logRows FROM LogT`,
      codeLang: 'sql',
      options: ['1|||1', '3|||3', '0|||0', '6|||6'],
      correctIndex: 0,
      points: 1,
      explanation: 'A T-SQL trigger runs once per statement, not once per row. The single INSERT of three rows fires it once; inserted holds 3 rows, the variable keeps one of them, and one row is written to LogT. The tempting 3 would be right for a PostgreSQL FOR EACH ROW trigger; in T-SQL the correct trigger is INSERT INTO LogT SELECT x FROM inserted.|||Trigger T-SQL chạy mỗi câu lệnh một lần, không phải mỗi dòng một lần. Một câu INSERT ba dòng kích hoạt nó một lần; inserted chứa 3 dòng, biến giữ một trong số đó, và một dòng được ghi vào LogT. Con số hấp dẫn 3 đúng với trigger FOR EACH ROW của PostgreSQL; trong T-SQL, trigger đúng phải là INSERT INTO LogT SELECT x FROM inserted.' },
    { id: 'q5',
      question: 'What does SELECT @a return?|||SELECT @a trả về gì?',
      code: `CREATE PROCEDURE p @x INT OUTPUT
AS
    SET @x = 10
GO
DECLARE @a INT = 5
EXEC p @a
SELECT @a AS a`,
      codeLang: 'sql',
      options: ['10|||10', '5|||5', 'NULL|||NULL', 'an error: the OUTPUT parameter was not given|||báo lỗi: chưa truyền tham số OUTPUT'],
      correctIndex: 1,
      points: 1,
      explanation: 'The word OUTPUT is missing in the EXEC call, so @a is passed as a plain input: the procedure sets its own copy to 10, nothing is written back, and @a keeps 5 — with no error. The tempting 10 needs EXEC p @a OUTPUT: OUTPUT must be written both in CREATE PROCEDURE and in the call.|||Lời gọi EXEC thiếu chữ OUTPUT, nên @a được truyền như một đầu vào bình thường: thủ tục gán bản sao của nó thành 10, không có gì được ghi ngược lại, và @a vẫn là 5 — không báo lỗi. Con số hấp dẫn 10 cần EXEC p @a OUTPUT: OUTPUT phải viết ở cả CREATE PROCEDURE lẫn lời gọi.' },
    { id: 'q6',
      question: 'An AFTER UPDATE trigger on tblEmployee counts the rows of inserted and of deleted. The statement UPDATE tblEmployee SET empSalary = empSalary + 1 WHERE depNum = 3 changes 3 employees. How many rows do inserted and deleted hold together?|||Một trigger AFTER UPDATE trên tblEmployee đếm số dòng của inserted và của deleted. Câu lệnh UPDATE tblEmployee SET empSalary = empSalary + 1 WHERE depNum = 3 sửa 3 nhân viên. inserted và deleted cộng lại chứa bao nhiêu dòng?',
      options: ['3 — only inserted is filled by an UPDATE|||3 — UPDATE chỉ đổ vào inserted', '0 — both are used only by INSERT and DELETE|||0 — hai bảng chỉ dùng cho INSERT và DELETE', '6 — 3 new versions in inserted and 3 old versions in deleted|||6 — 3 bản mới trong inserted và 3 bản cũ trong deleted', '1 — the trigger sees one row at a time|||1 — trigger mỗi lần chỉ thấy một dòng'],
      correctIndex: 2,
      points: 1,
      explanation: 'An UPDATE is handled as "delete the old version, insert the new one": deleted holds the 3 rows before the change and inserted the same 3 rows after it, so 3 + 3 = 6. Answer A forgets deleted, which is exactly where the old salaries are read when you compare old and new values; D describes a PostgreSQL row-level trigger, not T-SQL.|||UPDATE được xử lý như "xoá bản cũ, chèn bản mới": deleted chứa 3 dòng trước khi sửa và inserted chứa đúng 3 dòng đó sau khi sửa, nên 3 + 3 = 6. Đáp án A quên deleted, mà đó chính là nơi đọc lương cũ khi so giá trị cũ với mới; D mô tả trigger mức dòng của PostgreSQL, không phải T-SQL.' },
    { id: 'q7',
      question: 'Which statement about user-defined functions in SQL Server is TRUE?|||Phát biểu nào về hàm người dùng tự định nghĩa trong SQL Server là ĐÚNG?',
      options: ['A function is called with EXEC, like a procedure|||Hàm được gọi bằng EXEC, giống thủ tục', 'A scalar function may be called without the schema name, e.g. fn_TotalHours(1)|||Hàm vô hướng gọi được mà không cần tên lược đồ, ví dụ fn_TotalHours(1)', 'A multi-statement table-valued function may insert rows into a real table such as tblEmployee|||Hàm trả bảng nhiều câu lệnh được phép chèn dòng vào bảng thật như tblEmployee', 'An inline table-valued function can be used in FROM and joined like a table|||Hàm trả bảng inline dùng được trong FROM và join được như một bảng'],
      correctIndex: 3,
      points: 1,
      explanation: 'An inline table-valued function returns the table of one SELECT and is used exactly like a table (FROM, JOIN, WHERE, GROUP BY). C is the tempting one because it talks about a table, but a function may change only its own table variable — INSERT into tblEmployee gives Msg 443; a scalar function needs dbo. (Msg 195 otherwise), and EXEC is for procedures.|||Hàm trả bảng inline trả về bảng của một câu SELECT và được dùng y như một bảng (FROM, JOIN, WHERE, GROUP BY). C là đáp án hấp dẫn vì nó nói tới bảng, nhưng hàm chỉ được sửa biến bảng của chính nó — chèn vào tblEmployee sẽ ra Msg 443; hàm vô hướng phải có dbo. (không thì Msg 195), và EXEC là để gọi thủ tục.' },
    { id: 'q8',
      question: 'You move a T-SQL trigger to PostgreSQL as a FOR EACH ROW trigger function. What replaces the tables inserted and deleted?|||Bạn chuyển một trigger T-SQL sang PostgreSQL thành hàm trigger FOR EACH ROW. Cái gì thay cho các bảng inserted và deleted?',
      options: ['The records NEW and OLD, each holding the one row being changed|||Các bản ghi NEW và OLD, mỗi cái chứa đúng một dòng đang bị đổi', 'The tables INSERTED and DELETED, written in capitals|||Các bảng INSERTED và DELETED, viết chữ hoa', 'The variables @new and @old declared in the function|||Các biến @new và @old khai báo trong hàm', 'Nothing — PostgreSQL triggers cannot read the changed values|||Không gì cả — trigger PostgreSQL không đọc được giá trị bị đổi'],
      correctIndex: 0,
      points: 1,
      explanation: 'In a PostgreSQL row-level trigger the function runs once per row and receives NEW (the row after INSERT/UPDATE) and OLD (the row before UPDATE/DELETE). Answer B sounds natural but PostgreSQL has no inserted/deleted tables; the closest statement-level equivalent is REFERENCING NEW TABLE AS … OLD TABLE AS …, and @variables do not exist in PL/pgSQL.|||Trong trigger mức dòng của PostgreSQL, hàm chạy mỗi dòng một lần và nhận NEW (dòng sau INSERT/UPDATE) và OLD (dòng trước UPDATE/DELETE). Đáp án B nghe tự nhiên nhưng PostgreSQL không có bảng inserted/deleted; thứ gần nhất ở mức câu lệnh là REFERENCING NEW TABLE AS … OLD TABLE AS …, còn biến @ thì không tồn tại trong PL/pgSQL.' },
    { id: 'q9',
      question: 'Department 2 has four employees with salaries 55000, 95000, 72000, 105000 (in empSSN order), total 327000. What does SELECT @total return?|||Phòng 2 có bốn nhân viên lương 55000, 95000, 72000, 105000 (theo thứ tự empSSN), tổng 327000. SELECT @total trả về gì?',
      code: `DECLARE @sal DECIMAL(10,0), @total DECIMAL(12,0) = 0
DECLARE c CURSOR FOR
    SELECT empSalary FROM tblEmployee WHERE depNum = 2 ORDER BY empSSN
OPEN c
FETCH NEXT FROM c INTO @sal
WHILE @@FETCH_STATUS = 0
BEGIN
    FETCH NEXT FROM c INTO @sal
    SET @total = @total + @sal
END
CLOSE c
DEALLOCATE c
SELECT @total AS total`,
      codeLang: 'sql',
      options: ['327000 — the loop adds every salary once|||327000 — vòng lặp cộng mỗi lương đúng một lần', '272000 — the first salary is skipped|||272000 — bỏ sót lương đầu tiên', '377000|||377000', '0 — the loop never runs|||0 — vòng lặp không chạy lần nào'],
      correctIndex: 2,
      points: 1,
      explanation: 'The FETCH is at the top of the loop body instead of the end. The first fetched salary (55000) is overwritten before being added; then 95000, 72000, 105000 are added; the last FETCH fails but @sal still holds 105000, which is added a second time: 95000 + 72000 + 105000 + 105000 = 377000. B sees the skipped first row but misses the double count; put FETCH at the end of the loop to get 327000.|||Câu FETCH nằm ở đầu thân vòng lặp thay vì ở cuối. Lương lấy được đầu tiên (55000) bị ghi đè trước khi được cộng; rồi 95000, 72000, 105000 được cộng; lần FETCH cuối thất bại nhưng @sal vẫn giữ 105000, và nó được cộng lần thứ hai: 95000 + 72000 + 105000 + 105000 = 377000. B thấy dòng đầu bị bỏ sót nhưng không thấy dòng cuối bị cộng hai lần; đặt FETCH ở cuối vòng lặp thì ra 327000.' },
    { id: 'q10',
      question: 'FUHCompany has 5 departments (1–5). What does the final SELECT return?|||FUHCompany có 5 phòng (1–5). Câu SELECT cuối trả về gì?',
      code: `BEGIN TRANSACTION
BEGIN TRY
    INSERT INTO tblDepartment(depNum, depName) VALUES (6, N'Phòng Kế Toán');
    INSERT INTO tblDepartment(depNum, depName) VALUES (7, N'Phòng Nhân Sự');
    INSERT INTO tblDepartment(depNum, depName) VALUES (6, N'Phòng Pháp chế');
    COMMIT TRANSACTION
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION
END CATCH
SELECT COUNT(*) AS numDeps FROM tblDepartment`,
      codeLang: 'sql',
      options: ['7 — departments 6 and 7 are kept, only the duplicate fails|||7 — phòng 6 và 7 được giữ, chỉ câu trùng bị hỏng', '5|||5', '6 — only department 7 is kept|||6 — chỉ phòng 7 được giữ', 'an error message, no count|||một thông báo lỗi, không có số đếm'],
      correctIndex: 1,
      points: 1,
      explanation: 'The third INSERT repeats department 6, so control jumps to the CATCH, which rolls back the whole transaction — departments 6 and 7 are undone too, and 5 departments remain. Answer A is what happens without BEGIN TRANSACTION (each INSERT would be its own transaction); D is wrong because the error is caught, so the script continues silently.|||Câu INSERT thứ ba lặp lại phòng 6, nên điều khiển nhảy vào CATCH, nơi huỷ toàn bộ giao dịch — phòng 6 và 7 cũng bị huỷ, còn lại 5 phòng. Đáp án A là chuyện xảy ra nếu không có BEGIN TRANSACTION (mỗi câu INSERT là một giao dịch riêng); D sai vì lỗi đã được bắt, nên script chạy tiếp mà không hiện lỗi.' },
  ],
};

const QUIZ_LESSON = {
  title: 'Quiz — Chapter 7 · T-SQL programming: procedures, functions, triggers, cursors|||Quiz — Chương 7 · Lập trình T-SQL: thủ tục, hàm, trigger, cursor',
  slug: 'dbi202-quiz-ch7',
  type: 'QUIZ',
  description: '10 câu về Chương 7 (slide Chapter 8 của trường): vòng WHILE, @@ERROR bị đặt lại, trigger chỉ RAISERROR mà không ROLLBACK, trigger đọc inserted vào biến khi chèn nhiều dòng, quên OUTPUT khi gọi thủ tục, inserted/deleted trong UPDATE, giới hạn của hàm, NEW/OLD trên PostgreSQL, cursor đặt FETCH sai chỗ, TRY…CATCH với giao dịch — 8 câu được chạy thật trên SQL Server để xác nhận đáp án; mỗi câu có giải thích.',
  quiz: QUIZ,
};

export default {
  slides: [L_dbi9_1, L_dbi9_2, L_dbi9_3],
  practice: L_on_ch7,
  quiz: QUIZ,
  quizDescription: '10 câu về Chương 7 (slide Chapter 8 của trường): vòng WHILE, @@ERROR bị đặt lại, trigger chỉ RAISERROR mà không ROLLBACK, trigger đọc inserted vào biến khi chèn nhiều dòng, quên OUTPUT khi gọi thủ tục, inserted/deleted trong UPDATE, giới hạn của hàm, NEW/OLD trên PostgreSQL, cursor đặt FETCH sai chỗ, TRY…CATCH với giao dịch — 8 câu được chạy thật trên SQL Server để xác nhận đáp án; mỗi câu có giải thích.',
  quizLesson: QUIZ_LESSON,
};
