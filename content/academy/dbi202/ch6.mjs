/**
 * DBI202 · Chương 6 — truy vấn SQL (slide Chapter 6, 22–82).
 * Bài 📑 học theo từng slide: dbi7 (Chapter 6.pptx, slide 22–82).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: dbi202-on-ch6.
 * Quiz viết lại (10 câu, giữ slug dbi202-quiz-3).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/DBI202/gen/gen.mjs từ gen/src/** và gen/sql/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node DBI202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 6.A — 📑 Slide by slide · DML, SELECT, aliases, ORDER BY and joining two tables (Chapter 6, slides 22–36) ───────── */
const L_dbi7_3 = {
  title: '6.A — 📑 Slide by slide · DML, SELECT, aliases, ORDER BY and joining two tables (Chapter 6, slides 22–36)|||6.A — 📑 Học theo từng slide · DML, SELECT, bí danh, ORDER BY và nối hai bảng (Chapter 6, slide 22–36)',
  slug: 'dbi202-slide-dbi7-3',
  type: 'VIDEO',
  description: 'Giảng từng slide 22–36 của bộ slide Chapter 6 của trường (phần 2, truy vấn): INSERT/UPDATE/DELETE/TRUNCATE, SELECT ↔ π σ, ALL/DISTINCT/TOP, Example 1–4 và 6 (bí danh, điều kiện, sắp xếp), truy vấn trên hai bảng (Example 7) và tên cột trùng — mỗi câu giải theo thứ tự thực thi FROM → WHERE → SELECT → ORDER BY, chạy thật trên CSDL FUHCompany (SQL Server) kèm ô 🐘 PostgreSQL ở mọi chỗ cú pháp khác.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.A · school slides "Chapter 6", part 2 (slides 22–82)</span>
<h2>The database language SQL (part 2) — queries, slide by slide</h2>
<p class="lead">⚠️ <strong>These are the school's "Chapter 6" slides, part 2 (slides 22–82); part 1 (slides 1–21: constraints, data types, CREATE / ALTER / DROP) is in Chapter 5 of this website.</strong> The website splits the 82-slide deck in two, so when your lecturer says "Chapter 6, slide 40", open lesson 6.B. This part is the heart of the PE (practical exam, 85 minutes) and of every database job interview: reading and writing SELECT queries.</p>
<div class="callout"><strong>Starting from zero.</strong> A <strong>query</strong> is a question you ask the database in SQL, for example "which employees earn more than 50000?". The answer is always a <strong>table</strong> (rows and columns), even when it has one row or none. Every example below is run on SQL Server on the company database <strong>FUHCompany</strong> (7 tables, built in lesson 5.B); the result tables are the real output, not typed by hand.</div>
<h3>The one idea that makes every query readable: the execution order</h3>
<p>You <strong>write</strong> a query in the order SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY, but the database <strong>runs</strong> it in another order. Read every query in the running order and it stops being magic:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">FROM</div><div class="lz-d">take the table(s); several tables = every combination of rows</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">WHERE</div><div class="lz-d">keep the rows whose condition is TRUE</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">GROUP BY</div><div class="lz-d">put rows with the same value in one group</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">HAVING</div><div class="lz-d">keep the groups whose condition is TRUE</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">SELECT</div><div class="lz-d">compute the output columns, give aliases, DISTINCT</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">ORDER BY</div><div class="lz-d">sort; then TOP keeps the first n rows</div></div>
</div>
<p>Two consequences you will use all the time: an alias made in SELECT (step 5) <strong>cannot</strong> be used in WHERE (step 2), but <strong>can</strong> be used in ORDER BY (step 6); and a condition on a group (COUNT, AVG…) cannot go in WHERE, because groups do not exist yet at step 2.</p>
<h3>The FUHCompany tables used in this chapter</h3>
<table>
<thead><tr><th>Table</th><th>One row is</th><th>Key</th><th>Columns you will query</th></tr></thead>
<tbody>
<tr><td>tblEmployee</td><td>an employee (14 rows)</td><td>empSSN</td><td>empName, empSalary, empSex, empBirthdate, depNum, supervisorSSN</td></tr>
<tr><td>tblDepartment</td><td>a department (5)</td><td>depNum</td><td>depName, mgrSSN</td></tr>
<tr><td>tblLocation</td><td>a city (4)</td><td>locNum</td><td>locName</td></tr>
<tr><td>tblDepLocation</td><td>"department d is in city l" (8)</td><td>(depNum, locNum)</td><td>—</td></tr>
<tr><td>tblProject</td><td>a project (6)</td><td>proNum</td><td>proName, locNum, depNum</td></tr>
<tr><td>tblWorksOn</td><td>"employee e works h hours on project p" (16)</td><td>(empSSN, proNum)</td><td>workHours</td></tr>
<tr><td>tblDependent</td><td>a relative of an employee (5)</td><td>(empSSN, depName)</td><td>depRelationship</td></tr>
</tbody>
</table>
<p>SSNs look like 30121050001; in the text we often write only the last three digits (001). Things built into the data on purpose: TP Cần Thơ has no project, Phòng Nghiên cứu (5) has no project, one employee has no address and one has no birth date.</p>
<h3>This lesson in one table</h3>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>You must be able to</th></tr></thead>
<tbody>
<tr><td>22–24</td><td>INSERT, UPDATE, DELETE, TRUNCATE</td><td>change data without breaking a foreign key; say DELETE vs TRUNCATE</td></tr>
<tr><td>25–26</td><td>SELECT = π(σ(R)); ALL, DISTINCT, TOP</td><td>translate SELECT–FROM–WHERE into algebra; pick the first n rows</td></tr>
<tr><td>27–29</td><td>Examples 1–4</td><td>choose columns, rename them, write AND/OR conditions</td></tr>
<tr><td>30–31</td><td>ORDER BY (Example 6)</td><td>sort on several columns, ASC/DESC</td></tr>
<tr><td>32–36</td><td>several tables, Example 7</td><td>join two tables in FROM + WHERE; fix "ambiguous column name"</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 6 · Bài 6.A · slide "Chapter 6" của trường, phần 2 (slide 22–82)</span>
<h2>Ngôn ngữ CSDL SQL (phần 2) — truy vấn, học từng slide</h2>
<p class="lead">⚠️ <strong>Đây là slide Chapter 6 của trường, phần 2 (slide 22–82); phần 1 (slide 1–21: ràng buộc, kiểu dữ liệu, CREATE / ALTER / DROP) ở Chương 5 của web.</strong> Web chia bộ slide 82 trang làm hai, nên khi thầy cô nói "Chapter 6, slide 40" thì mở bài 6.B. Phần này là trái tim của bài thi thực hành PE (85 phút) và của mọi buổi phỏng vấn về CSDL: đọc và viết câu SELECT.</p>
<div class="callout"><strong>Bắt đầu từ số 0.</strong> Một <strong>câu truy vấn</strong> (query) là một câu hỏi bạn đặt cho CSDL bằng SQL, ví dụ "nhân viên nào lương trên 50000?". Câu trả lời luôn là một <strong>bảng</strong> (các dòng và cột), kể cả khi nó chỉ có một dòng hoặc không dòng nào. Mọi ví dụ bên dưới chạy thật trên SQL Server với CSDL công ty <strong>FUHCompany</strong> (7 bảng, dựng ở bài 5.B); bảng kết quả là output thật, không gõ tay.</div>
<h3>Một ý làm mọi câu truy vấn dễ đọc: thứ tự thực thi</h3>
<p>Bạn <strong>viết</strong> câu truy vấn theo thứ tự SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY, nhưng CSDL <strong>chạy</strong> nó theo thứ tự khác. Đọc mọi câu theo thứ tự chạy thì nó hết "ảo thuật":</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">FROM</div><div class="lz-d">lấy (các) bảng; nhiều bảng = mọi cách ghép dòng</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">WHERE</div><div class="lz-d">giữ các dòng có điều kiện là TRUE</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">GROUP BY</div><div class="lz-d">gom các dòng cùng giá trị vào một nhóm</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">HAVING</div><div class="lz-d">giữ các nhóm có điều kiện là TRUE</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">SELECT</div><div class="lz-d">tính các cột đầu ra, đặt bí danh, DISTINCT</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">ORDER BY</div><div class="lz-d">sắp xếp; rồi TOP giữ n dòng đầu</div></div>
</div>
<p>Hai hệ quả bạn sẽ dùng suốt: bí danh (alias — tên gọi tạm) đặt ở SELECT (bước 5) <strong>không</strong> dùng được trong WHERE (bước 2), nhưng <strong>dùng được</strong> trong ORDER BY (bước 6); và điều kiện trên một nhóm (COUNT, AVG…) không đặt được ở WHERE, vì ở bước 2 chưa có nhóm nào.</p>
<h3>Các bảng FUHCompany dùng trong chương này</h3>
<table>
<thead><tr><th>Bảng</th><th>Một dòng là</th><th>Khoá</th><th>Các cột hay truy vấn</th></tr></thead>
<tbody>
<tr><td>tblEmployee</td><td>một nhân viên (14 dòng)</td><td>empSSN</td><td>empName (tên), empSalary (lương), empSex (giới tính), empBirthdate (ngày sinh), depNum (phòng), supervisorSSN (người giám sát)</td></tr>
<tr><td>tblDepartment</td><td>một phòng ban (5)</td><td>depNum</td><td>depName (tên phòng), mgrSSN (trưởng phòng)</td></tr>
<tr><td>tblLocation</td><td>một thành phố (4)</td><td>locNum</td><td>locName</td></tr>
<tr><td>tblDepLocation</td><td>"phòng d có mặt ở thành phố l" (8)</td><td>(depNum, locNum)</td><td>—</td></tr>
<tr><td>tblProject</td><td>một dự án (6)</td><td>proNum</td><td>proName, locNum (nơi làm), depNum (phòng quản lý)</td></tr>
<tr><td>tblWorksOn</td><td>"nhân viên e làm h giờ ở dự án p" (16)</td><td>(empSSN, proNum)</td><td>workHours (số giờ)</td></tr>
<tr><td>tblDependent</td><td>một người thân của nhân viên (5)</td><td>(empSSN, depName)</td><td>depRelationship (quan hệ)</td></tr>
</tbody>
</table>
<p>SSN (mã số nhân viên) có dạng 30121050001; trong bài thường chỉ viết ba số cuối (001). Những điều cố ý cài vào dữ liệu: TP Cần Thơ không có dự án nào, Phòng Nghiên cứu (5) không quản lý dự án nào, một nhân viên không có địa chỉ và một người không có ngày sinh.</p>
<h3>Cả bài này trong một bảng</h3>
<table>
<thead><tr><th>Slide</th><th>Ý chính</th><th>Bạn phải làm được</th></tr></thead>
<tbody>
<tr><td>22–24</td><td>INSERT, UPDATE, DELETE, TRUNCATE</td><td>sửa dữ liệu mà không phá khoá ngoại; phân biệt DELETE và TRUNCATE</td></tr>
<tr><td>25–26</td><td>SELECT = π(σ(R)); ALL, DISTINCT, TOP</td><td>dịch SELECT–FROM–WHERE sang đại số; lấy n dòng đầu</td></tr>
<tr><td>27–29</td><td>Ví dụ 1–4</td><td>chọn cột, đổi tên cột, viết điều kiện AND/OR</td></tr>
<tr><td>30–31</td><td>ORDER BY (Ví dụ 6)</td><td>sắp theo nhiều cột, tăng/giảm dần</td></tr>
<tr><td>32–36</td><td>nhiều bảng, Ví dụ 7</td><td>nối hai bảng bằng FROM + WHERE; sửa lỗi "ambiguous column name"</td></tr>
</tbody>
</table>`),
    walkHead('dbi7', 22, 36),
    walk('dbi7', [
      [22, 'Data Manipulation Language - INSERT',
        `<p class="y-chinh">🎯 DML (Data Manipulation Language) has four verbs: INSERT adds rows, UPDATE changes them, DELETE removes them, SELECT reads them; INSERT comes in three forms.</p>
<table>
<thead><tr><th>Form on the slide</th><th>When to use it</th></tr></thead>
<tbody>
<tr><td><code>INSERT INTO t VALUES (v1, …, vn)</code></td><td>you give a value for EVERY column, in the table's column order</td></tr>
<tr><td><code>INSERT INTO t(col1, col2) VALUES (v1, v2)</code></td><td>only some columns; the others get NULL (or their DEFAULT)</td></tr>
<tr><td><code>INSERT INTO t SELECT … FROM other</code></td><td>copy the rows returned by a query</td></tr>
</tbody>
</table>
<p>The slide's two statements add departments 6 and 7. The first names 2 columns, so mgrSSN and mgrAssDate become NULL; the second lists all 4 values in order and writes the NULLs itself:</p>
<pre><code class="language-sql">/*22*/
INSERT INTO tblDepartment(depNum,depName)
VALUES(6, N'Phòng Kế Toán');
GO
INSERT INTO tblDepartment
VALUES(7, N'Phòng Nhân Sự', NULL, NULL);
GO
-- check: the two new rows
SELECT depNum, depName, mgrSSN, mgrAssDate
FROM tblDepartment
WHERE depNum &gt;= 6;</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>mgrSSN</th><th>mgrAssDate</th></tr></thead>
<tbody>
<tr><td>6</td><td>Phòng Kế Toán</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
<tr><td>7</td><td>Phòng Nhân Sự</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p>Form 3, copying the high earners into a new table (the SELECT runs first, then each of its rows is inserted):</p>
<pre><code class="language-sql">-- form 3: copy rows from another table
CREATE TABLE tblHighSalary (
    empSSN    DECIMAL(18,0) NOT NULL,
    empName   NVARCHAR(50)  NOT NULL,
    empSalary DECIMAL(10,0) NULL,
    CONSTRAINT pk_highsalary PRIMARY KEY (empSSN)
);
GO
INSERT INTO tblHighSalary (empSSN, empName, empSalary)
SELECT empSSN, empName, empSalary
FROM tblEmployee
WHERE empSalary &gt;= 90000;
GO
SELECT * FROM tblHighSalary ORDER BY empSalary DESC;</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
</tbody>
</table>
<p>And what the DBMS answers when the values do not fit:</p>
<pre><code class="language-sql">-- 1) no column list, only 2 values for a 4-column table
INSERT INTO tblDepartment VALUES(8, N'Phòng Pháp chế');
GO
-- 2) department 1 already exists
INSERT INTO tblDepartment(depNum, depName) VALUES(1, N'Phòng Mới');
GO</code></pre>
<div class="out"><b>Msg 213, Level 16, State 1<br>
Column name or number of supplied values does not match table definition.</b><br>
<b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'pk_department'. Cannot insert duplicate key in object 'dbo.tblDepartment'. The duplicate key value is (1).</b><br>
The statement has been terminated.</div>
<div class="pitfall">Always write the column list in the PE (<code>INSERT INTO tblDepartment(depNum, depName) …</code>): form 1 breaks as soon as the table gets one more column (Msg 213 above), and a value silently lands in the wrong column if you remember the order wrong. Vietnamese text needs <code>N'…'</code>, otherwise it is stored as "Ph?ng".</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> (what you will type at work) INSERT is the same, without the N prefix; several rows go in one VALUES list, and <code>RETURNING</code> shows the inserted rows at once (SQL Server has a similar <code>OUTPUT</code> clause):
<pre><code class="language-sql">INSERT INTO tblDepartment(depNum, depName)
VALUES (6, 'Phòng Kế Toán'),                  -- no N prefix
       (7, 'Phòng Nhân Sự')
RETURNING depNum, depName;                    -- PostgreSQL only: show the inserted rows</code></pre>
<table>
<thead><tr><th>depnum</th><th>depname</th></tr></thead>
<tbody>
<tr><td>6</td><td>Phòng Kế Toán</td></tr>
<tr><td>7</td><td>Phòng Nhân Sự</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-1-insert">PostgreSQL 4.1 — INSERT</a>.</div>`,
        `<p class="y-chinh">🎯 DML (Data Manipulation Language — ngôn ngữ thao tác dữ liệu) có bốn động từ: INSERT thêm dòng, UPDATE sửa dòng, DELETE xoá dòng, SELECT đọc dòng; INSERT có ba dạng.</p>
<table>
<thead><tr><th>Dạng trên slide</th><th>Khi nào dùng</th></tr></thead>
<tbody>
<tr><td><code>INSERT INTO t VALUES (v1, …, vn)</code></td><td>bạn đưa giá trị cho MỌI cột, đúng thứ tự cột của bảng</td></tr>
<tr><td><code>INSERT INTO t(col1, col2) VALUES (v1, v2)</code></td><td>chỉ vài cột; các cột còn lại nhận NULL (hoặc giá trị DEFAULT)</td></tr>
<tr><td><code>INSERT INTO t SELECT … FROM bảng_khác</code></td><td>chép các dòng mà một câu truy vấn trả về</td></tr>
</tbody>
</table>
<p>Hai câu trên slide thêm phòng 6 và 7. Câu đầu ghi 2 cột nên mgrSSN và mgrAssDate thành NULL; câu thứ hai đưa đủ 4 giá trị theo thứ tự và tự viết NULL:</p>
<pre><code class="language-sql">/*22*/
INSERT INTO tblDepartment(depNum,depName)
VALUES(6, N'Phòng Kế Toán');
GO
INSERT INTO tblDepartment
VALUES(7, N'Phòng Nhân Sự', NULL, NULL);
GO
-- kiểm tra: hai dòng mới
SELECT depNum, depName, mgrSSN, mgrAssDate
FROM tblDepartment
WHERE depNum &gt;= 6;</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>mgrSSN</th><th>mgrAssDate</th></tr></thead>
<tbody>
<tr><td>6</td><td>Phòng Kế Toán</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
<tr><td>7</td><td>Phòng Nhân Sự</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p>Dạng 3, chép những người lương cao sang một bảng mới (câu SELECT chạy trước, rồi từng dòng nó trả về được chèn vào):</p>
<pre><code class="language-sql">-- dạng 3: chép các dòng từ bảng khác
CREATE TABLE tblHighSalary (
    empSSN    DECIMAL(18,0) NOT NULL,
    empName   NVARCHAR(50)  NOT NULL,
    empSalary DECIMAL(10,0) NULL,
    CONSTRAINT pk_highsalary PRIMARY KEY (empSSN)
);
GO
INSERT INTO tblHighSalary (empSSN, empName, empSalary)
SELECT empSSN, empName, empSalary
FROM tblEmployee
WHERE empSalary &gt;= 90000;
GO
SELECT * FROM tblHighSalary ORDER BY empSalary DESC;</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
</tbody>
</table>
<p>Và DBMS trả lời gì khi giá trị không khớp:</p>
<pre><code class="language-sql">-- 1) không ghi danh sách cột mà chỉ có 2 giá trị cho bảng 4 cột
INSERT INTO tblDepartment VALUES(8, N'Phòng Pháp chế');
GO
-- 2) phòng số 1 đã có rồi
INSERT INTO tblDepartment(depNum, depName) VALUES(1, N'Phòng Mới');
GO</code></pre>
<div class="out"><b>Msg 213, Level 16, State 1<br>
Column name or number of supplied values does not match table definition.</b><br>
<b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'pk_department'. Cannot insert duplicate key in object 'dbo.tblDepartment'. The duplicate key value is (1).</b><br>
The statement has been terminated.</div>
<div class="pitfall">Trong bài PE luôn ghi danh sách cột (<code>INSERT INTO tblDepartment(depNum, depName) …</code>): dạng 1 hỏng ngay khi bảng có thêm một cột (Msg 213 ở trên), và nhớ sai thứ tự là giá trị lặng lẽ rơi vào nhầm cột. Chữ tiếng Việt phải có <code>N'…'</code>, nếu không sẽ lưu thành "Ph?ng".</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> (thứ bạn sẽ gõ khi đi làm) INSERT viết y vậy, bỏ tiền tố N; nhiều dòng nằm chung một danh sách VALUES, và <code>RETURNING</code> cho xem ngay các dòng vừa chèn (SQL Server có mệnh đề <code>OUTPUT</code> tương tự):
<pre><code class="language-sql">INSERT INTO tblDepartment(depNum, depName)
VALUES (6, 'Phòng Kế Toán'),                  -- không có tiền tố N
       (7, 'Phòng Nhân Sự')
RETURNING depNum, depName;                    -- chỉ PostgreSQL: trả lại luôn các dòng vừa chèn</code></pre>
<table>
<thead><tr><th>depnum</th><th>depname</th></tr></thead>
<tbody>
<tr><td>6</td><td>Phòng Kế Toán</td></tr>
<tr><td>7</td><td>Phòng Nhân Sự</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-1-insert">PostgreSQL 4.1 — INSERT</a>.</div>`],
      [23, 'Data Manipulation Language - UPDATE',
        `<p class="y-chinh">🎯 <code>UPDATE t SET col = newValue [WHERE condition]</code> changes the rows that satisfy the condition; newValue may be a constant, an expression (<code>empSalary+5000</code>) or a query.</p>
<p>The slide's example gives Mai Duy An a 5000 raise and moves him to department 2. Execution order: <strong>FROM/WHERE first</strong> (find the rows: 1 row, empName = Mai Duy An), <strong>then SET</strong> — and every expression on the right uses the <strong>old</strong> values of that row:</p>
<pre><code class="language-sql">-- before
SELECT empName, empSalary, depNum FROM tblEmployee WHERE empName = N'Mai Duy An';
GO
/*24*/
UPDATE  tblEmployee
SET     empSalary=empSalary+5000, depNum=2
WHERE   empName=N'Mai Duy An'
GO
-- after
SELECT empName, empSalary, depNum FROM tblEmployee WHERE empName = N'Mai Duy An';</code></pre>
<table>
<thead><tr><th>empName</th><th>empSalary</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>Mai Duy An</td><td>55000</td><td>2</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empName</th><th>empSalary</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>Mai Duy An</td><td>60000</td><td>2</td></tr>
</tbody>
</table>
<p>Salary 55000 → 60000; he was already in department 2, so depNum stays 2. "newValue could be a SQL statement": here the new department is read from another table (the query must return exactly one value):</p>
<pre><code class="language-sql">-- newValue can be a SQL statement: move Mai Duy An to the department that controls ProjectE
UPDATE tblEmployee
SET    depNum = (SELECT depNum FROM tblProject WHERE proName = N'ProjectE')
WHERE  empName = N'Mai Duy An';
GO
SELECT empName, depNum FROM tblEmployee WHERE empName = N'Mai Duy An';</code></pre>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empName</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>Mai Duy An</td><td>3</td></tr>
</tbody>
</table>
<div class="pitfall">An UPDATE without WHERE changes <strong>every</strong> row — the classic mistake that gives the whole company a raise. Habit: first run <code>SELECT … WHERE &lt;your condition&gt;</code>, check the rows, then turn it into UPDATE. Lesson 6.5 on this website goes further (transactions to undo a mistake).</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the statement is identical except for N; <code>RETURNING</code> shows the new values without a second SELECT:
<pre><code class="language-sql">UPDATE tblEmployee
SET    empSalary = empSalary + 5000, depNum = 2
WHERE  empName = 'Mai Duy An'                 -- no N
RETURNING empName, empSalary, depNum;         -- see the new values at once</code></pre>
<table>
<thead><tr><th>empname</th><th>empsalary</th><th>depnum</th></tr></thead>
<tbody>
<tr><td>Mai Duy An</td><td>60000</td><td>2</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-4-update-delete">PostgreSQL 4.4 — UPDATE and DELETE</a>.</div>`,
        `<p class="y-chinh">🎯 <code>UPDATE t SET cột = giáTrịMới [WHERE điều kiện]</code> sửa các dòng thoả điều kiện; giá trị mới có thể là hằng, biểu thức (<code>empSalary+5000</code>) hay một câu truy vấn.</p>
<p>Ví dụ trên slide tăng lương Mai Duy An thêm 5000 và chuyển anh sang phòng 2. Thứ tự thực thi: <strong>FROM/WHERE trước</strong> (tìm dòng: 1 dòng, empName = Mai Duy An), <strong>rồi mới SET</strong> — và mọi biểu thức bên phải đều dùng giá trị <strong>cũ</strong> của dòng đó:</p>
<pre><code class="language-sql">-- trước khi sửa
SELECT empName, empSalary, depNum FROM tblEmployee WHERE empName = N'Mai Duy An';
GO
/*24*/
UPDATE  tblEmployee
SET     empSalary=empSalary+5000, depNum=2
WHERE   empName=N'Mai Duy An'
GO
-- sau khi sửa
SELECT empName, empSalary, depNum FROM tblEmployee WHERE empName = N'Mai Duy An';</code></pre>
<table>
<thead><tr><th>empName</th><th>empSalary</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>Mai Duy An</td><td>55000</td><td>2</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empName</th><th>empSalary</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>Mai Duy An</td><td>60000</td><td>2</td></tr>
</tbody>
</table>
<p>Lương 55000 → 60000; anh vốn đã ở phòng 2 nên depNum vẫn là 2. "newValue có thể là một câu SQL": ở đây phòng mới được đọc từ bảng khác (câu truy vấn phải trả về đúng một giá trị):</p>
<pre><code class="language-sql">-- newValue có thể là một câu SQL: chuyển Mai Duy An sang phòng quản lý ProjectE
UPDATE tblEmployee
SET    depNum = (SELECT depNum FROM tblProject WHERE proName = N'ProjectE')
WHERE  empName = N'Mai Duy An';
GO
SELECT empName, depNum FROM tblEmployee WHERE empName = N'Mai Duy An';</code></pre>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empName</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>Mai Duy An</td><td>3</td></tr>
</tbody>
</table>
<div class="pitfall">UPDATE không có WHERE sửa <strong>mọi</strong> dòng — lỗi kinh điển làm cả công ty được tăng lương. Thói quen: chạy <code>SELECT … WHERE &lt;điều kiện của bạn&gt;</code> trước, xem đúng các dòng chưa, rồi mới đổi thành UPDATE. Bài 6.5 trên web nói kỹ hơn (dùng giao dịch — transaction — để hoàn tác khi lỡ tay).</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> câu lệnh y hệt, chỉ bỏ N; <code>RETURNING</code> cho xem giá trị mới mà không cần SELECT lần hai:
<pre><code class="language-sql">UPDATE tblEmployee
SET    empSalary = empSalary + 5000, depNum = 2
WHERE  empName = 'Mai Duy An'                 -- không có N
RETURNING empName, empSalary, depNum;         -- xem ngay giá trị mới</code></pre>
<table>
<thead><tr><th>empname</th><th>empsalary</th><th>depnum</th></tr></thead>
<tbody>
<tr><td>Mai Duy An</td><td>60000</td><td>2</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-4-update-delete">PostgreSQL 4.4 — UPDATE và DELETE</a>.</div>`],
      [24, 'Data Manipulation Language - DELETE and TRUNCATE',
        `<p class="y-chinh">🎯 <code>DELETE FROM t [WHERE c]</code> removes the rows that satisfy c; <code>TRUNCATE TABLE t</code> empties the whole table at once — and before either one you must think about the foreign keys that point to those rows.</p>
<p>The slide's two deletes (the file first adds departments 6 and 7 so that there is something to delete):</p>
<pre><code class="language-sql">-- first add the two departments of slide 22
INSERT INTO tblDepartment(depNum, depName) VALUES (6, N'Phòng Kế Toán'), (7, N'Phòng Nhân Sự');
GO
/*22*/
DELETE
FROM    tblDepartment
WHERE   depName=N'Phòng Kế Toán'
GO
DELETE
FROM    tblDepartment
WHERE   depNum=7
GO
SELECT depNum, depName FROM tblDepartment ORDER BY depNum;</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td></tr>
<tr><td>4</td><td>Phòng Hành chính</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>"What should we do before DELETE or TRUNCATE?"</strong> Check referential integrity: are there child rows (employees, projects…) whose foreign key points to the rows you delete? Departments 6 and 7 had none, so it worked. Department 1 has employees:</p>
<pre><code class="language-sql">-- department 1 still has employees and projects
DELETE FROM tblDepartment WHERE depNum = 1;
GO
-- TRUNCATE is refused on a table that a foreign key points to
TRUNCATE TABLE tblDepartment;
GO</code></pre>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The DELETE statement conflicted with the REFERENCE constraint "fk_employee_department". The conflict occurred in database "DBI202", table "dbo.tblEmployee", column 'depNum'.</b><br>
The statement has been terminated.<br>
<b>Msg 4712, Level 16, State 1<br>
Cannot truncate table 'tblDepartment' because it is being referenced by a FOREIGN KEY constraint.</b></div>
<p>So either delete (or move) the children first, or the foreign key must have been created with <code>ON DELETE CASCADE</code> / <code>SET NULL</code> (Chapter 5). <strong>"What is the difference between DELETE and TRUNCATE?"</strong></p>
<table>
<thead><tr><th></th><th>DELETE</th><th>TRUNCATE TABLE</th></tr></thead>
<tbody>
<tr><td>WHERE allowed?</td><td>yes — some rows or all</td><td>no — always all rows</td></tr>
<tr><td>How</td><td>row by row, each one logged</td><td>frees whole data pages, minimal logging — much faster on big tables</td></tr>
<tr><td>IDENTITY counter</td><td>keeps counting</td><td>restarts from the seed</td></tr>
<tr><td>Table referenced by a foreign key</td><td>allowed if no child row breaks</td><td>refused (Msg 4712 above), even when the child table is empty</td></tr>
<tr><td>Fires DELETE triggers (Ch 7)</td><td>yes</td><td>no</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- a small log table with an IDENTITY counter
CREATE TABLE tblLog (id INT IDENTITY(1,1) PRIMARY KEY, msg NVARCHAR(50));
INSERT INTO tblLog(msg) VALUES (N'a'), (N'b'), (N'c');
GO
DELETE FROM tblLog;                         -- removes rows one by one, counter stays at 3
INSERT INTO tblLog(msg) VALUES (N'after DELETE');
SELECT * FROM tblLog;
GO
TRUNCATE TABLE tblLog;                      -- empties the table at once, counter restarts
INSERT INTO tblLog(msg) VALUES (N'after TRUNCATE');
SELECT * FROM tblLog;</code></pre>
<div class="out">(3 rows affected)<br>
(3 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>id</th><th>msg</th></tr></thead>
<tbody>
<tr><td>4</td><td>after DELETE</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>id</th><th>msg</th></tr></thead>
<tbody>
<tr><td>1</td><td>after TRUNCATE</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>On PostgreSQL</strong> TRUNCATE does <strong>not</strong> restart the identity counter unless you write <code>RESTART IDENTITY</code>, and <code>TRUNCATE … CASCADE</code> also empties the tables that point to it (dangerous, but it exists):
<pre><code class="language-sql">CREATE TABLE tblLog (id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, msg TEXT);
INSERT INTO tblLog(msg) VALUES ('a'), ('b'), ('c');
DELETE FROM tblLog;
INSERT INTO tblLog(msg) VALUES ('after DELETE');
SELECT * FROM tblLog;
TRUNCATE TABLE tblLog RESTART IDENTITY;     -- PostgreSQL keeps the counter unless you say RESTART IDENTITY
INSERT INTO tblLog(msg) VALUES ('after TRUNCATE');
SELECT * FROM tblLog;</code></pre>
<div class="out">INSERT 0 3<br>
DELETE 3<br>
INSERT 0 1</div>
<table>
<thead><tr><th>id</th><th>msg</th></tr></thead>
<tbody>
<tr><td>4</td><td>after DELETE</td></tr>
</tbody>
</table>
<div class="out">INSERT 0 1</div>
<table>
<thead><tr><th>id</th><th>msg</th></tr></thead>
<tbody>
<tr><td>1</td><td>after TRUNCATE</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-4-update-delete">PostgreSQL 4.4 — UPDATE and DELETE</a>.</div>`,
        `<p class="y-chinh">🎯 <code>DELETE FROM t [WHERE c]</code> xoá các dòng thoả c; <code>TRUNCATE TABLE t</code> làm rỗng cả bảng một lần — và trước khi dùng cái nào cũng phải nghĩ tới các khoá ngoại đang trỏ vào những dòng đó.</p>
<p>Hai câu xoá trên slide (file chèn trước phòng 6 và 7 để có cái mà xoá):</p>
<pre><code class="language-sql">-- trước hết thêm hai phòng của slide 22
INSERT INTO tblDepartment(depNum, depName) VALUES (6, N'Phòng Kế Toán'), (7, N'Phòng Nhân Sự');
GO
/*22*/
DELETE
FROM    tblDepartment
WHERE   depName=N'Phòng Kế Toán'
GO
DELETE
FROM    tblDepartment
WHERE   depNum=7
GO
SELECT depNum, depName FROM tblDepartment ORDER BY depNum;</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td></tr>
<tr><td>4</td><td>Phòng Hành chính</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>"Phải làm gì trước khi DELETE hoặc TRUNCATE?"</strong> Kiểm tra toàn vẹn tham chiếu (referential integrity): có dòng con nào (nhân viên, dự án…) mà khoá ngoại trỏ vào các dòng bạn định xoá không? Phòng 6 và 7 không có, nên xoá được. Phòng 1 thì có nhân viên:</p>
<pre><code class="language-sql">-- phòng 1 vẫn còn nhân viên và dự án
DELETE FROM tblDepartment WHERE depNum = 1;
GO
-- TRUNCATE bị từ chối trên bảng có khoá ngoại trỏ vào
TRUNCATE TABLE tblDepartment;
GO</code></pre>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The DELETE statement conflicted with the REFERENCE constraint "fk_employee_department". The conflict occurred in database "DBI202", table "dbo.tblEmployee", column 'depNum'.</b><br>
The statement has been terminated.<br>
<b>Msg 4712, Level 16, State 1<br>
Cannot truncate table 'tblDepartment' because it is being referenced by a FOREIGN KEY constraint.</b></div>
<p>Vậy phải xoá (hoặc chuyển) các dòng con trước, hoặc khoá ngoại phải được tạo với <code>ON DELETE CASCADE</code> / <code>SET NULL</code> (Chương 5). <strong>"DELETE và TRUNCATE khác nhau thế nào?"</strong></p>
<table>
<thead><tr><th></th><th>DELETE</th><th>TRUNCATE TABLE</th></tr></thead>
<tbody>
<tr><td>Có WHERE?</td><td>có — xoá một số dòng hoặc tất cả</td><td>không — luôn xoá hết</td></tr>
<tr><td>Cách làm</td><td>từng dòng, dòng nào cũng ghi nhật ký (log)</td><td>giải phóng cả trang dữ liệu, ghi log tối thiểu — nhanh hơn nhiều với bảng lớn</td></tr>
<tr><td>Bộ đếm IDENTITY (tự tăng)</td><td>đếm tiếp</td><td>quay về giá trị đầu</td></tr>
<tr><td>Bảng bị khoá ngoại trỏ vào</td><td>được, nếu không dòng con nào bị vi phạm</td><td>bị từ chối (Msg 4712 ở trên), kể cả khi bảng con rỗng</td></tr>
<tr><td>Kích hoạt trigger DELETE (Ch 7)</td><td>có</td><td>không</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- một bảng nhật ký nhỏ có bộ đếm IDENTITY
CREATE TABLE tblLog (id INT IDENTITY(1,1) PRIMARY KEY, msg NVARCHAR(50));
INSERT INTO tblLog(msg) VALUES (N'a'), (N'b'), (N'c');
GO
DELETE FROM tblLog;                         -- xoá từng dòng, bộ đếm vẫn ở 3
INSERT INTO tblLog(msg) VALUES (N'after DELETE');
SELECT * FROM tblLog;
GO
TRUNCATE TABLE tblLog;                      -- làm rỗng bảng một lần, bộ đếm quay về đầu
INSERT INTO tblLog(msg) VALUES (N'after TRUNCATE');
SELECT * FROM tblLog;</code></pre>
<div class="out">(3 rows affected)<br>
(3 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>id</th><th>msg</th></tr></thead>
<tbody>
<tr><td>4</td><td>after DELETE</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>id</th><th>msg</th></tr></thead>
<tbody>
<tr><td>1</td><td>after TRUNCATE</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> TRUNCATE <strong>không</strong> đặt lại bộ đếm tự tăng trừ khi ghi <code>RESTART IDENTITY</code>, và <code>TRUNCATE … CASCADE</code> làm rỗng luôn các bảng trỏ vào nó (nguy hiểm, nhưng có tồn tại):
<pre><code class="language-sql">CREATE TABLE tblLog (id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, msg TEXT);
INSERT INTO tblLog(msg) VALUES ('a'), ('b'), ('c');
DELETE FROM tblLog;
INSERT INTO tblLog(msg) VALUES ('after DELETE');
SELECT * FROM tblLog;
TRUNCATE TABLE tblLog RESTART IDENTITY;     -- PostgreSQL giữ bộ đếm trừ khi ghi RESTART IDENTITY
INSERT INTO tblLog(msg) VALUES ('after TRUNCATE');
SELECT * FROM tblLog;</code></pre>
<div class="out">INSERT 0 3<br>
DELETE 3<br>
INSERT 0 1</div>
<table>
<thead><tr><th>id</th><th>msg</th></tr></thead>
<tbody>
<tr><td>4</td><td>after DELETE</td></tr>
</tbody>
</table>
<div class="out">INSERT 0 1</div>
<table>
<thead><tr><th>id</th><th>msg</th></tr></thead>
<tbody>
<tr><td>1</td><td>after TRUNCATE</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-4-update-delete">PostgreSQL 4.4 — UPDATE và DELETE</a>.</div>`],
      [25, 'SQL Queries and Relational Algebra',
        `<p class="y-chinh">🎯 The basic query <code>SELECT L FROM R WHERE C</code> is exactly the relational-algebra expression π<sub>L</sub>(σ<sub>C</sub>(R)): select the rows first, project the columns last.</p>
<p>Chapter 2 gave you σ (selection = keep rows) and π (projection = keep columns). Read the SQL in execution order and the algebra appears by itself:</p>
<table>
<thead><tr><th>Order</th><th>SQL</th><th>Algebra</th><th>Here</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee</td><td>R</td><td>14 rows</td></tr>
<tr><td>2</td><td>WHERE depNum = 1</td><td>σ<sub>depNum=1</sub></td><td>4 rows, all 8 columns</td></tr>
<tr><td>3</td><td>SELECT empName, empSalary</td><td>π<sub>empName, empSalary</sub></td><td>4 rows, 2 columns</td></tr>
</tbody>
</table>
<pre><code class="language-sql">SELECT empName, empSalary          -- L = the columns to keep
FROM   tblEmployee                 -- R = the relation
WHERE  depNum = 1;                 -- C = the condition</code></pre>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>Võ Việt Anh</td><td>60000</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>45000</td></tr>
</tbody>
</table>
<p>The table after step 2 (σ), before the projection:</p>
<pre><code class="language-sql">-- step σ: rows of department 1, all columns
SELECT * FROM tblEmployee WHERE depNum = 1;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<p class="meo">🧠 The names cross over: the SQL word SELECT does the algebra's <strong>projection</strong> π, and the algebra's <strong>selection</strong> σ is the SQL word WHERE.</p>
<div class="pitfall">One difference: π in Chapter 2 works on sets and removes duplicates; SQL SELECT keeps them (a bag) unless you write DISTINCT — slides 26 and 66.</div>`,
        `<p class="y-chinh">🎯 Câu truy vấn cơ bản <code>SELECT L FROM R WHERE C</code> chính là biểu thức đại số quan hệ π<sub>L</sub>(σ<sub>C</sub>(R)): chọn dòng trước, chiếu cột sau cùng.</p>
<p>Chương 2 đã cho bạn σ (phép chọn — selection = giữ dòng) và π (phép chiếu — projection = giữ cột). Đọc câu SQL theo thứ tự thực thi thì biểu thức đại số tự hiện ra:</p>
<table>
<thead><tr><th>Thứ tự</th><th>SQL</th><th>Đại số</th><th>Ở đây</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee</td><td>R</td><td>14 dòng</td></tr>
<tr><td>2</td><td>WHERE depNum = 1</td><td>σ<sub>depNum=1</sub></td><td>4 dòng, đủ 8 cột</td></tr>
<tr><td>3</td><td>SELECT empName, empSalary</td><td>π<sub>empName, empSalary</sub></td><td>4 dòng, 2 cột</td></tr>
</tbody>
</table>
<pre><code class="language-sql">SELECT empName, empSalary          -- L = các cột giữ lại
FROM   tblEmployee                 -- R = quan hệ
WHERE  depNum = 1;                 -- C = điều kiện</code></pre>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>Võ Việt Anh</td><td>60000</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>45000</td></tr>
</tbody>
</table>
<p>Bảng sau bước 2 (σ), trước phép chiếu:</p>
<pre><code class="language-sql">-- bước σ: các dòng của phòng 1, đủ mọi cột
SELECT * FROM tblEmployee WHERE depNum = 1;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<p class="meo">🧠 Tên gọi bắt chéo: chữ SELECT của SQL làm phép <strong>chiếu</strong> π của đại số, còn phép <strong>chọn</strong> σ của đại số lại là chữ WHERE của SQL.</p>
<div class="pitfall">Một chỗ khác: π ở Chương 2 làm trên tập (set) nên bỏ bản trùng; SELECT của SQL giữ bản trùng (túi — bag) trừ khi viết DISTINCT — xem slide 26 và 66.</div>`],
      [26, 'T-SQL Basic Syntax for a simple SELECT query',
        `<p class="y-chinh">🎯 The full shape of a simple T-SQL SELECT: <code>SELECT [ALL | DISTINCT] [TOP n [PERCENT]] * | column/expression [alias], … [FROM table] [WHERE conditions]</code>.</p>
<ul>
<li><strong>ALL</strong> (the default) keeps duplicate rows; <strong>DISTINCT</strong> keeps each different row once — and treats all NULLs as equal, so they collapse into one NULL row.</li>
<li><strong>TOP n</strong> keeps the first n rows; <strong>TOP n PERCENT</strong> keeps n % of the rows, rounded up. Without ORDER BY "first" means "whatever order the engine happens to use", so TOP almost always comes with ORDER BY.</li>
<li><code>*</code> = every column; an <strong>expression</strong> such as <code>empSalary*12</code> makes a new computed column; the optional <strong>alias</strong> names it.</li>
</ul>
<pre><code class="language-sql">-- ALL (the default): one row per employee, departments repeat
SELECT ALL depNum FROM tblEmployee WHERE empSalary &gt; 80000;
-- DISTINCT: each value once
SELECT DISTINCT depNum FROM tblEmployee WHERE empSalary &gt; 80000;
-- DISTINCT treats all NULLs as one value
SELECT DISTINCT supervisorSSN FROM tblEmployee;</code></pre>
<table>
<thead><tr><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>1</td></tr>
<tr><td>2</td></tr>
<tr><td>2</td></tr>
<tr><td>3</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>2</td></tr>
<tr><td>3</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td><em>NULL</em></td></tr>
<tr><td>30121050001</td></tr>
<tr><td>30121050002</td></tr>
<tr><td>30121050010</td></tr>
<tr><td>30121050020</td></tr>
<tr><td>30121050037</td></tr>
</tbody>
</table>
<p>TOP runs <strong>last</strong> (after ORDER BY). 20 PERCENT of 14 rows = 2.8 → 3 rows. <code>WITH TIES</code> also keeps the rows that tie with the last kept row — two projects share the maximum of 40 hours, so "TOP 1" returns 2 rows:</p>
<pre><code class="language-sql">-- the 3 highest salaries
SELECT TOP 3 empName, empSalary
FROM tblEmployee
ORDER BY empSalary DESC;
-- 20 percent of 14 rows = 2.8, rounded UP to 3 rows
SELECT TOP 20 PERCENT empName, empSalary
FROM tblEmployee
ORDER BY empSalary DESC;
-- WITH TIES: also keep rows equal to the last one
SELECT TOP 1 WITH TIES proNum, workHours
FROM tblWorksOn
ORDER BY workHours DESC;</code></pre>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>proNum</th><th>workHours</th></tr></thead>
<tbody>
<tr><td>5</td><td>40.0</td></tr>
<tr><td>6</td><td>40.0</td></tr>
</tbody>
</table>
<div class="pitfall">PE classic: "list the employee(s) with the highest salary". <code>TOP 1</code> without WITH TIES silently drops the second person who earns the same amount. Write <code>TOP 1 WITH TIES … ORDER BY empSalary DESC</code>, or <code>WHERE empSalary = (SELECT MAX(empSalary) …)</code> (slide 46).</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> there is no TOP: write <code>LIMIT n</code> (or the SQL-standard <code>FETCH FIRST n ROWS ONLY</code>) at the very END of the query; <code>WITH TIES</code> exists only in the FETCH form:
<pre><code class="language-sql">SELECT empName, empSalary
FROM tblEmployee
ORDER BY empSalary DESC
LIMIT 3;                                       -- T-SQL: SELECT TOP 3
SELECT proNum, workHours
FROM tblWorksOn
ORDER BY workHours DESC
FETCH FIRST 1 ROWS WITH TIES;                  -- T-SQL: TOP 1 WITH TIES</code></pre>
<table>
<thead><tr><th>empname</th><th>empsalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>pronum</th><th>workhours</th></tr></thead>
<tbody>
<tr><td>5</td><td>40.0</td></tr>
<tr><td>6</td><td>40.0</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT, DISTINCT</a>.</div>`,
        `<p class="y-chinh">🎯 Hình dạng đầy đủ của một câu SELECT đơn giản trong T-SQL: <code>SELECT [ALL | DISTINCT] [TOP n [PERCENT]] * | cột/biểu thức [bí danh], … [FROM bảng] [WHERE điều kiện]</code>.</p>
<ul>
<li><strong>ALL</strong> (mặc định) giữ các dòng trùng nhau; <strong>DISTINCT</strong> giữ mỗi dòng khác nhau một lần — và coi mọi NULL là bằng nhau, nên chúng dồn lại thành một dòng NULL.</li>
<li><strong>TOP n</strong> giữ n dòng đầu; <strong>TOP n PERCENT</strong> giữ n % số dòng, làm tròn lên. Không có ORDER BY thì "đầu" nghĩa là "thứ tự nào máy tình cờ dùng", nên TOP gần như luôn đi với ORDER BY.</li>
<li><code>*</code> = mọi cột; một <strong>biểu thức</strong> (expression) như <code>empSalary*12</code> tạo ra một cột tính mới; <strong>bí danh</strong> (alias) tuỳ chọn đặt tên cho nó.</li>
</ul>
<pre><code class="language-sql">-- ALL (mặc định): mỗi nhân viên một dòng, số phòng lặp lại
SELECT ALL depNum FROM tblEmployee WHERE empSalary &gt; 80000;
-- DISTINCT: mỗi giá trị một lần
SELECT DISTINCT depNum FROM tblEmployee WHERE empSalary &gt; 80000;
-- DISTINCT coi mọi NULL là một giá trị
SELECT DISTINCT supervisorSSN FROM tblEmployee;</code></pre>
<table>
<thead><tr><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>1</td></tr>
<tr><td>2</td></tr>
<tr><td>2</td></tr>
<tr><td>3</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>2</td></tr>
<tr><td>3</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td><em>NULL</em></td></tr>
<tr><td>30121050001</td></tr>
<tr><td>30121050002</td></tr>
<tr><td>30121050010</td></tr>
<tr><td>30121050020</td></tr>
<tr><td>30121050037</td></tr>
</tbody>
</table>
<p>TOP chạy <strong>cuối cùng</strong> (sau ORDER BY). 20 PERCENT của 14 dòng = 2,8 → 3 dòng. <code>WITH TIES</code> (kèm các dòng hoà) giữ thêm các dòng bằng với dòng cuối được giữ — hai dự án cùng có mức cao nhất 40 giờ, nên "TOP 1" trả về 2 dòng:</p>
<pre><code class="language-sql">-- 3 mức lương cao nhất
SELECT TOP 3 empName, empSalary
FROM tblEmployee
ORDER BY empSalary DESC;
-- 20 phần trăm của 14 dòng = 2,8, làm tròn LÊN thành 3 dòng
SELECT TOP 20 PERCENT empName, empSalary
FROM tblEmployee
ORDER BY empSalary DESC;
-- WITH TIES: giữ luôn các dòng bằng dòng cuối
SELECT TOP 1 WITH TIES proNum, workHours
FROM tblWorksOn
ORDER BY workHours DESC;</code></pre>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>proNum</th><th>workHours</th></tr></thead>
<tbody>
<tr><td>5</td><td>40.0</td></tr>
<tr><td>6</td><td>40.0</td></tr>
</tbody>
</table>
<div class="pitfall">Câu kinh điển của PE: "liệt kê (các) nhân viên có lương cao nhất". <code>TOP 1</code> không có WITH TIES sẽ lặng lẽ bỏ mất người thứ hai có cùng mức lương. Viết <code>TOP 1 WITH TIES … ORDER BY empSalary DESC</code>, hoặc <code>WHERE empSalary = (SELECT MAX(empSalary) …)</code> (slide 46).</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> không có TOP: viết <code>LIMIT n</code> (hoặc dạng chuẩn SQL <code>FETCH FIRST n ROWS ONLY</code>) ở CUỐI câu truy vấn; <code>WITH TIES</code> chỉ có ở dạng FETCH:
<pre><code class="language-sql">SELECT empName, empSalary
FROM tblEmployee
ORDER BY empSalary DESC
LIMIT 3;                                       -- T-SQL: SELECT TOP 3
SELECT proNum, workHours
FROM tblWorksOn
ORDER BY workHours DESC
FETCH FIRST 1 ROWS WITH TIES;                  -- T-SQL: TOP 1 WITH TIES</code></pre>
<table>
<thead><tr><th>empname</th><th>empsalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>pronum</th><th>workhours</th></tr></thead>
<tbody>
<tr><td>5</td><td>40.0</td></tr>
<tr><td>6</td><td>40.0</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT, DISTINCT</a>.</div>`],
      [27, 'Common Query in SQL - Example 1 and 2',
        `<p class="y-chinh">🎯 Example 1 lists every column of the employees earning more than 50000 (<code>SELECT *</code>); Example 2 lists only their name and salary.</p>
<pre><code class="language-sql">/*1*/
SELECT *
FROM tblEmployee
WHERE empSalary &gt; 50000
GO
/*2*/
SELECT empName,empSalary
FROM tblEmployee
WHERE empSalary &gt; 50000
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>7 Hàng Bài, Hoàn Kiếm, TP Hà Nội</td><td>55000</td><td>M</td><td>1992-05-30</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>102 Kim Mã, Ba Đình, TP Hà Nội</td><td>95000</td><td>M</td><td>1978-09-09</td><td>2</td><td>30121050001</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>33 Cầu Giấy, TP Hà Nội</td><td>72000</td><td>F</td><td>1988-12-01</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>5 Láng Hạ, Đống Đa, TP Hà Nội</td><td>105000</td><td>M</td><td>1970-04-18</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050020</td><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td><td>88000</td><td>F</td><td>1980-06-25</td><td>3</td><td>30121050001</td></tr>
<tr><td>30121050027</td><td>Trương Thị Thu</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td><td>52000</td><td>F</td><td>1993-08-08</td><td>3</td><td>30121050020</td></tr>
<tr><td>30121050030</td><td>Huỳnh Văn Tài</td><td>9 Võ Văn Tần, Q.3, TP Hồ Chí Minh</td><td>70000</td><td>M</td><td>1975-10-10</td><td>4</td><td>30121050001</td></tr>
<tr><td>30121050037</td><td>Lý Thanh Tâm</td><td>77 Hùng Vương, Hải Châu, TP Đà Nẵng</td><td>65000</td><td>F</td><td>1983-03-03</td><td>5</td><td>30121050001</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>Võ Việt Anh</td><td>60000</td></tr>
<tr><td>Mai Duy An</td><td>55000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>Trương Thị Thu</td><td>52000</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>Lý Thanh Tâm</td><td>65000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>What happens</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee</td><td>take the whole table</td><td>14</td></tr>
<tr><td>2</td><td>WHERE empSalary &gt; 50000</td><td>test every row; 004 (45000), 021 (40000), 038 (38000) are FALSE</td><td>11</td></tr>
<tr><td>5</td><td>SELECT * / SELECT empName, empSalary</td><td>keep all 8 columns / keep 2 columns</td><td>11</td></tr>
</tbody>
</table>
<p>The two queries return the same 11 rows; only the width differs. The rows come out in empSSN order only because that is the order of the primary-key index — without ORDER BY, SQL promises no order at all.</p>
<p class="meo">🧠 "exceed" = strictly greater: <code>&gt;</code>. "at least 50000" would be <code>&gt;=</code>. Read the English carefully — PE marks are lost on one character.</p>
<div class="pitfall"><code>SELECT *</code> is fine for exploring, but in the PE give exactly the columns the question asks for, in that order; extra or missing columns can cost the mark even when the rows are right.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 1 liệt kê mọi cột của các nhân viên có lương trên 50000 (<code>SELECT *</code>); Ví dụ 2 chỉ liệt kê tên và lương của họ.</p>
<pre><code class="language-sql">/*1*/
SELECT *
FROM tblEmployee
WHERE empSalary &gt; 50000
GO
/*2*/
SELECT empName,empSalary
FROM tblEmployee
WHERE empSalary &gt; 50000
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>7 Hàng Bài, Hoàn Kiếm, TP Hà Nội</td><td>55000</td><td>M</td><td>1992-05-30</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>102 Kim Mã, Ba Đình, TP Hà Nội</td><td>95000</td><td>M</td><td>1978-09-09</td><td>2</td><td>30121050001</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>33 Cầu Giấy, TP Hà Nội</td><td>72000</td><td>F</td><td>1988-12-01</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>5 Láng Hạ, Đống Đa, TP Hà Nội</td><td>105000</td><td>M</td><td>1970-04-18</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050020</td><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td><td>88000</td><td>F</td><td>1980-06-25</td><td>3</td><td>30121050001</td></tr>
<tr><td>30121050027</td><td>Trương Thị Thu</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td><td>52000</td><td>F</td><td>1993-08-08</td><td>3</td><td>30121050020</td></tr>
<tr><td>30121050030</td><td>Huỳnh Văn Tài</td><td>9 Võ Văn Tần, Q.3, TP Hồ Chí Minh</td><td>70000</td><td>M</td><td>1975-10-10</td><td>4</td><td>30121050001</td></tr>
<tr><td>30121050037</td><td>Lý Thanh Tâm</td><td>77 Hùng Vương, Hải Châu, TP Đà Nẵng</td><td>65000</td><td>F</td><td>1983-03-03</td><td>5</td><td>30121050001</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>Võ Việt Anh</td><td>60000</td></tr>
<tr><td>Mai Duy An</td><td>55000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>Trương Thị Thu</td><td>52000</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>Lý Thanh Tâm</td><td>65000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Chuyện gì xảy ra</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee</td><td>lấy cả bảng</td><td>14</td></tr>
<tr><td>2</td><td>WHERE empSalary &gt; 50000</td><td>thử từng dòng; 004 (45000), 021 (40000), 038 (38000) là FALSE</td><td>11</td></tr>
<tr><td>5</td><td>SELECT * / SELECT empName, empSalary</td><td>giữ đủ 8 cột / giữ 2 cột</td><td>11</td></tr>
</tbody>
</table>
<p>Hai câu trả về cùng 11 dòng; chỉ khác độ rộng. Các dòng ra theo thứ tự empSSN chỉ vì đó là thứ tự của chỉ mục khoá chính — không có ORDER BY thì SQL không hứa hẹn thứ tự nào cả.</p>
<p class="meo">🧠 "exceed" = lớn hơn hẳn: <code>&gt;</code>. "at least 50000" (ít nhất) mới là <code>&gt;=</code>. Đọc kỹ đề tiếng Anh — điểm PE mất vì đúng một ký tự.</p>
<div class="pitfall"><code>SELECT *</code> tiện khi đang dò dữ liệu, nhưng trong bài PE hãy đưa đúng các cột đề hỏi, đúng thứ tự; thừa hay thiếu cột có thể mất điểm dù các dòng đúng.</div>`],
      [28, 'Projection in SQL - Example 3 alias',
        `<p class="y-chinh">🎯 An alias renames an output column: <code>empName AS 'Họ và tên'</code> — the data is the same, only the column header changes.</p>
<pre><code class="language-sql">/*3*/
SELECT empName AS 'Họ và tên',empSalary AS 'Lương'
FROM tblEmployee
WHERE empSalary &gt; 50000
GO</code></pre>
<table>
<thead><tr><th>Họ và tên</th><th>Lương</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>Võ Việt Anh</td><td>60000</td></tr>
<tr><td>Mai Duy An</td><td>55000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>Trương Thị Thu</td><td>52000</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>Lý Thanh Tâm</td><td>65000</td></tr>
</tbody>
</table>
<ul>
<li>Execution order: FROM (14) → WHERE (11) → <strong>SELECT, where the aliases are created</strong>. The alias exists only in the result, never in the table.</li>
<li>T-SQL accepts three spellings for an alias with spaces: <code>'Họ và tên'</code> (as on the slide), <code>[Họ và tên]</code>, <code>"Họ và tên"</code>. <code>AS</code> itself is optional (<code>empName [Họ và tên]</code>), but writing it is clearer.</li>
<li>No N is needed here: an alias is a name (an identifier), and names are always Unicode in SQL Server.</li>
</ul>
<div class="pitfall">Because SELECT runs after WHERE, <code>WHERE [Lương] &gt; 50000</code> fails with "Invalid column name" — repeat the expression in WHERE (slide 30 shows the error).</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> single quotes always mean a <strong>string</strong>, never a name, so the slide's alias is a syntax error; a name with spaces or accents goes in double quotes:
<pre><code class="language-sql">SELECT empName AS 'Họ và tên'                  -- single quotes = a string, not a name
FROM tblEmployee;</code></pre>
<div class="out"><b>ERROR:  syntax error at or near "'Họ và tên'"</b></div>
<pre><code class="language-sql">SELECT empName   AS "Họ và tên",               -- double quotes = a name
       empSalary AS "Lương"
FROM tblEmployee
WHERE empSalary &gt; 50000;</code></pre>
<table>
<thead><tr><th>Họ và tên</th><th>Lương</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>Lý Thanh Tâm</td><td>65000</td></tr>
<tr><td>Võ Việt Anh</td><td>60000</td></tr>
<tr><td>Mai Duy An</td><td>55000</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Trương Thị Thu</td><td>52000</td></tr>
</tbody>
</table>
Notice also that the rows come back in a different order than on SQL Server: there is no ORDER BY, so each engine uses its own. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-2-select-where">PostgreSQL 4.2 — SELECT … WHERE</a>.</div>`,
        `<p class="y-chinh">🎯 Bí danh (alias) đổi tên một cột đầu ra: <code>empName AS 'Họ và tên'</code> — dữ liệu vẫn vậy, chỉ tiêu đề cột đổi.</p>
<pre><code class="language-sql">/*3*/
SELECT empName AS 'Họ và tên',empSalary AS 'Lương'
FROM tblEmployee
WHERE empSalary &gt; 50000
GO</code></pre>
<table>
<thead><tr><th>Họ và tên</th><th>Lương</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>Võ Việt Anh</td><td>60000</td></tr>
<tr><td>Mai Duy An</td><td>55000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>Trương Thị Thu</td><td>52000</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>Lý Thanh Tâm</td><td>65000</td></tr>
</tbody>
</table>
<ul>
<li>Thứ tự thực thi: FROM (14) → WHERE (11) → <strong>SELECT, nơi bí danh được tạo ra</strong>. Bí danh chỉ tồn tại trong kết quả, không bao giờ có trong bảng.</li>
<li>T-SQL nhận ba cách viết bí danh có dấu cách: <code>'Họ và tên'</code> (như slide), <code>[Họ và tên]</code>, <code>"Họ và tên"</code>. Bản thân chữ <code>AS</code> là tuỳ chọn (<code>empName [Họ và tên]</code>), nhưng có nó thì dễ đọc hơn.</li>
<li>Ở đây không cần N: bí danh là một cái tên (định danh — identifier), mà tên trong SQL Server luôn là Unicode.</li>
</ul>
<div class="pitfall">Vì SELECT chạy sau WHERE, <code>WHERE [Lương] &gt; 50000</code> báo lỗi "Invalid column name" (tên cột không hợp lệ) — phải lặp lại biểu thức trong WHERE (slide 30 cho xem lỗi này).</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> nháy đơn luôn là <strong>chuỗi</strong>, không bao giờ là tên, nên bí danh như trên slide là lỗi cú pháp; tên có dấu cách hay dấu tiếng Việt đặt trong nháy kép:
<pre><code class="language-sql">SELECT empName AS 'Họ và tên'                  -- nháy đơn = một chuỗi, không phải tên
FROM tblEmployee;</code></pre>
<div class="out"><b>ERROR:  syntax error at or near "'Họ và tên'"</b></div>
<pre><code class="language-sql">SELECT empName   AS "Họ và tên",               -- nháy kép = một cái tên
       empSalary AS "Lương"
FROM tblEmployee
WHERE empSalary &gt; 50000;</code></pre>
<table>
<thead><tr><th>Họ và tên</th><th>Lương</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>Lý Thanh Tâm</td><td>65000</td></tr>
<tr><td>Võ Việt Anh</td><td>60000</td></tr>
<tr><td>Mai Duy An</td><td>55000</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Trương Thị Thu</td><td>52000</td></tr>
</tbody>
</table>
Để ý thêm: các dòng ra theo thứ tự khác với SQL Server: không có ORDER BY nên mỗi hệ dùng thứ tự riêng. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-2-select-where">PostgreSQL 4.2 — SELECT … WHERE</a>.</div>`],
      [29, 'Selection in SQL - Example 4',
        `<p class="y-chinh">🎯 Example 4 combines conditions with AND/OR and computes an age in SELECT: women under 40 or men under 50.</p>
<pre><code class="language-sql">/*4*/
SELECT empName AS 'Họ và tên',empSex AS 'Giới tính',
YEAR(GETDATE())-YEAR(empBirthdate) AS 'Tuổi'
FROM tblEmployee
WHERE (empSEX='F' AND YEAR(GETDATE())-YEAR(empBirthdate)&lt;40)
OR (empSEX='M' AND YEAR(GETDATE())-YEAR(empBirthdate)&lt;50)</code></pre>
<table>
<thead><tr><th>Họ và tên</th><th>Giới tính</th><th>Tuổi</th></tr></thead>
<tbody>
<tr><td>Võ Việt Anh</td><td>M</td><td>36</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>F</td><td>31</td></tr>
<tr><td>Mai Duy An</td><td>M</td><td>34</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>M</td><td>48</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>F</td><td>38</td></tr>
<tr><td>Bùi Văn Nam</td><td>M</td><td>28</td></tr>
<tr><td>Trương Thị Thu</td><td>F</td><td>33</td></tr>
</tbody>
</table>
<p>Step by step. The file below adds, for EVERY employee, the age and the result of the WHERE condition (this run was in 2026 — ages change with the year you run it):</p>
<pre><code class="language-sql">-- step 1 (FROM + the expression): the age of EVERY employee, before WHERE
SELECT empName, empSex, empBirthdate,
       YEAR(GETDATE()) - YEAR(empBirthdate) AS Tuoi,
       CASE WHEN (empSex = 'F' AND YEAR(GETDATE()) - YEAR(empBirthdate) &lt; 40)
              OR (empSex = 'M' AND YEAR(GETDATE()) - YEAR(empBirthdate) &lt; 50)
            THEN 'kept' ELSE 'dropped' END AS WhereResult
FROM tblEmployee
ORDER BY empSex, Tuoi;</code></pre>
<table>
<thead><tr><th>empName</th><th>empSex</th><th>empBirthdate</th><th>Tuoi</th><th>WhereResult</th></tr></thead>
<tbody>
<tr><td>Lê Thị Lan Anh</td><td>F</td><td>1995-01-15</td><td>31</td><td>kept</td></tr>
<tr><td>Trương Thị Thu</td><td>F</td><td>1993-08-08</td><td>33</td><td>kept</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>F</td><td>1988-12-01</td><td>38</td><td>kept</td></tr>
<tr><td>Hoàng Thị Hà</td><td>F</td><td>1985-07-20</td><td>41</td><td>dropped</td></tr>
<tr><td>Lý Thanh Tâm</td><td>F</td><td>1983-03-03</td><td>43</td><td>dropped</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>F</td><td>1980-06-25</td><td>46</td><td>dropped</td></tr>
<tr><td>Phan Hữu Nghĩa</td><td>M</td><td><em>NULL</em></td><td><em>NULL</em></td><td>dropped</td></tr>
<tr><td>Bùi Văn Nam</td><td>M</td><td>1998-02-14</td><td>28</td><td>kept</td></tr>
<tr><td>Mai Duy An</td><td>M</td><td>1992-05-30</td><td>34</td><td>kept</td></tr>
<tr><td>Võ Việt Anh</td><td>M</td><td>1990-11-02</td><td>36</td><td>kept</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>M</td><td>1978-09-09</td><td>48</td><td>kept</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>M</td><td>1975-10-10</td><td>51</td><td>dropped</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>M</td><td>1970-04-18</td><td>56</td><td>dropped</td></tr>
<tr><td>Trần Minh Quang</td><td>M</td><td>1968-03-12</td><td>58</td><td>dropped</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>What happens</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee</td><td>whole table</td><td>14</td></tr>
<tr><td>2</td><td>WHERE (F AND age&lt;40) OR (M AND age&lt;50)</td><td>3 women and 4 men are TRUE; Phan Hữu Nghĩa has no birth date → age NULL → UNKNOWN → dropped</td><td>7</td></tr>
<tr><td>5</td><td>SELECT … AS 'Tuổi'</td><td>compute the age again for the output, rename 3 columns</td><td>7</td></tr>
</tbody>
</table>
<ul>
<li>The parentheses matter: AND binds tighter than OR, so here they only make the intent visible, but <code>F AND a OR M AND b</code> without them is easy to misread.</li>
<li><code>empSEX</code> on the slide vs <code>empSex</code> in the table: the default collation is case-insensitive for names too, so both work.</li>
</ul>
<div class="pitfall"><code>YEAR(GETDATE()) - YEAR(empBirthdate)</code> is not the real age: someone born in December is counted one year older until their birthday. For an exact age compare the full dates (<code>DATEADD(YEAR, 40, empBirthdate) &gt; GETDATE()</code>), and remember a NULL birth date makes the row disappear.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> <code>GETDATE()</code> is <code>now()</code>, <code>YEAR(x)</code> is <code>EXTRACT(YEAR FROM x)</code>, and <code>age(d)</code> gives the exact age — compare the two age columns: Hồ Ngọc Hân and Võ Việt Anh are one year younger than the slide's formula says:
<pre><code class="language-sql">SELECT empName AS "Họ và tên", empSex AS "Giới tính",
       EXTRACT(YEAR FROM now()) - EXTRACT(YEAR FROM empBirthdate) AS "Tuổi",   -- T-SQL: YEAR(GETDATE())
       date_part('year', age(empBirthdate)) AS "Tuổi thật"                      -- exact age in years
FROM tblEmployee
WHERE (empSex = 'F' AND date_part('year', age(empBirthdate)) &lt; 40)
   OR (empSex = 'M' AND date_part('year', age(empBirthdate)) &lt; 50)
ORDER BY empName;</code></pre>
<table>
<thead><tr><th>Họ và tên</th><th>Giới tính</th><th>Tuổi</th><th>Tuổi thật</th></tr></thead>
<tbody>
<tr><td>Bùi Văn Nam</td><td>M</td><td>28</td><td>28</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>F</td><td>38</td><td>37</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>F</td><td>31</td><td>31</td></tr>
<tr><td>Mai Duy An</td><td>M</td><td>34</td><td>34</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>M</td><td>48</td><td>48</td></tr>
<tr><td>Trương Thị Thu</td><td>F</td><td>33</td><td>33</td></tr>
<tr><td>Võ Việt Anh</td><td>M</td><td>36</td><td>35</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-3-ngay-gio">PostgreSQL 2.3 — dates and times</a>.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 4 ghép điều kiện bằng AND/OR và tính tuổi ngay trong SELECT: nữ dưới 40 tuổi hoặc nam dưới 50 tuổi.</p>
<pre><code class="language-sql">/*4*/
SELECT empName AS 'Họ và tên',empSex AS 'Giới tính',
YEAR(GETDATE())-YEAR(empBirthdate) AS 'Tuổi'
FROM tblEmployee
WHERE (empSEX='F' AND YEAR(GETDATE())-YEAR(empBirthdate)&lt;40)
OR (empSEX='M' AND YEAR(GETDATE())-YEAR(empBirthdate)&lt;50)</code></pre>
<table>
<thead><tr><th>Họ và tên</th><th>Giới tính</th><th>Tuổi</th></tr></thead>
<tbody>
<tr><td>Võ Việt Anh</td><td>M</td><td>36</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>F</td><td>31</td></tr>
<tr><td>Mai Duy An</td><td>M</td><td>34</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>M</td><td>48</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>F</td><td>38</td></tr>
<tr><td>Bùi Văn Nam</td><td>M</td><td>28</td></tr>
<tr><td>Trương Thị Thu</td><td>F</td><td>33</td></tr>
</tbody>
</table>
<p>Từng bước. File dưới đây thêm, cho MỌI nhân viên, cột tuổi và kết quả của điều kiện WHERE (lần chạy này là năm 2026 — tuổi đổi theo năm bạn chạy):</p>
<pre><code class="language-sql">-- bước 1 (FROM + biểu thức): tuổi của MỌI nhân viên, trước WHERE
SELECT empName, empSex, empBirthdate,
       YEAR(GETDATE()) - YEAR(empBirthdate) AS Tuoi,
       CASE WHEN (empSex = 'F' AND YEAR(GETDATE()) - YEAR(empBirthdate) &lt; 40)
              OR (empSex = 'M' AND YEAR(GETDATE()) - YEAR(empBirthdate) &lt; 50)
            THEN 'kept' ELSE 'dropped' END AS WhereResult
FROM tblEmployee
ORDER BY empSex, Tuoi;</code></pre>
<table>
<thead><tr><th>empName</th><th>empSex</th><th>empBirthdate</th><th>Tuoi</th><th>WhereResult</th></tr></thead>
<tbody>
<tr><td>Lê Thị Lan Anh</td><td>F</td><td>1995-01-15</td><td>31</td><td>kept</td></tr>
<tr><td>Trương Thị Thu</td><td>F</td><td>1993-08-08</td><td>33</td><td>kept</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>F</td><td>1988-12-01</td><td>38</td><td>kept</td></tr>
<tr><td>Hoàng Thị Hà</td><td>F</td><td>1985-07-20</td><td>41</td><td>dropped</td></tr>
<tr><td>Lý Thanh Tâm</td><td>F</td><td>1983-03-03</td><td>43</td><td>dropped</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>F</td><td>1980-06-25</td><td>46</td><td>dropped</td></tr>
<tr><td>Phan Hữu Nghĩa</td><td>M</td><td><em>NULL</em></td><td><em>NULL</em></td><td>dropped</td></tr>
<tr><td>Bùi Văn Nam</td><td>M</td><td>1998-02-14</td><td>28</td><td>kept</td></tr>
<tr><td>Mai Duy An</td><td>M</td><td>1992-05-30</td><td>34</td><td>kept</td></tr>
<tr><td>Võ Việt Anh</td><td>M</td><td>1990-11-02</td><td>36</td><td>kept</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>M</td><td>1978-09-09</td><td>48</td><td>kept</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>M</td><td>1975-10-10</td><td>51</td><td>dropped</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>M</td><td>1970-04-18</td><td>56</td><td>dropped</td></tr>
<tr><td>Trần Minh Quang</td><td>M</td><td>1968-03-12</td><td>58</td><td>dropped</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Chuyện gì xảy ra</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee</td><td>cả bảng</td><td>14</td></tr>
<tr><td>2</td><td>WHERE (F AND tuổi&lt;40) OR (M AND tuổi&lt;50)</td><td>3 nữ và 4 nam cho TRUE; Phan Hữu Nghĩa không có ngày sinh → tuổi NULL → UNKNOWN → bị loại</td><td>7</td></tr>
<tr><td>5</td><td>SELECT … AS 'Tuổi'</td><td>tính lại tuổi cho đầu ra, đổi tên 3 cột</td><td>7</td></tr>
</tbody>
</table>
<ul>
<li>Dấu ngoặc quan trọng: AND ưu tiên hơn OR, nên ở đây ngoặc chỉ làm ý rõ ra, nhưng viết <code>F AND a OR M AND b</code> không ngoặc thì rất dễ đọc nhầm.</li>
<li><code>empSEX</code> trên slide khác <code>empSex</code> trong bảng: collation mặc định không phân biệt hoa thường cả với tên, nên viết kiểu nào cũng chạy.</li>
</ul>
<div class="pitfall"><code>YEAR(GETDATE()) - YEAR(empBirthdate)</code> không phải tuổi thật: người sinh tháng 12 bị tính già hơn một tuổi cho tới ngày sinh nhật. Muốn tuổi chính xác thì so cả ngày (<code>DATEADD(YEAR, 40, empBirthdate) &gt; GETDATE()</code>), và nhớ rằng ngày sinh NULL làm dòng biến mất.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> <code>GETDATE()</code> là <code>now()</code>, <code>YEAR(x)</code> là <code>EXTRACT(YEAR FROM x)</code>, còn <code>age(d)</code> cho tuổi chính xác — so hai cột tuổi: Hồ Ngọc Hân và Võ Việt Anh thật ra trẻ hơn một tuổi so với công thức trên slide:
<pre><code class="language-sql">SELECT empName AS "Họ và tên", empSex AS "Giới tính",
       EXTRACT(YEAR FROM now()) - EXTRACT(YEAR FROM empBirthdate) AS "Tuổi",   -- T-SQL: YEAR(GETDATE())
       date_part('year', age(empBirthdate)) AS "Tuổi thật"                      -- tuổi tròn chính xác
FROM tblEmployee
WHERE (empSex = 'F' AND date_part('year', age(empBirthdate)) &lt; 40)
   OR (empSex = 'M' AND date_part('year', age(empBirthdate)) &lt; 50)
ORDER BY empName;</code></pre>
<table>
<thead><tr><th>Họ và tên</th><th>Giới tính</th><th>Tuổi</th><th>Tuổi thật</th></tr></thead>
<tbody>
<tr><td>Bùi Văn Nam</td><td>M</td><td>28</td><td>28</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>F</td><td>38</td><td>37</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>F</td><td>31</td><td>31</td></tr>
<tr><td>Mai Duy An</td><td>M</td><td>34</td><td>34</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>M</td><td>48</td><td>48</td></tr>
<tr><td>Trương Thị Thu</td><td>F</td><td>33</td><td>33</td></tr>
<tr><td>Võ Việt Anh</td><td>M</td><td>36</td><td>35</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-3-ngay-gio">PostgreSQL 2.3 — ngày giờ</a>.</div>`],
      [30, 'Ordering the Output',
        `<p class="y-chinh">🎯 <code>ORDER BY col1 [ASC|DESC], col2 …</code> sorts the result; ASC (ascending, the default) or DESC (descending) is chosen per column.</p>
<p>The slide (from the textbook) says the sort happens "on the result of FROM, WHERE and other clauses, just before SELECT". That is why you may sort by a column you do not display. SQL Server's documented order puts ORDER BY <strong>after</strong> SELECT — which is why an alias works in ORDER BY. Both facts are true at once, as this run shows:</p>
<pre><code class="language-sql">-- ORDER BY may use the alias made in SELECT
SELECT empName, empSalary * 12 AS yearSalary
FROM tblEmployee
WHERE depNum = 1
ORDER BY yearSalary DESC;
GO
-- ORDER BY may also use a column that is NOT in SELECT
SELECT empName
FROM tblEmployee
WHERE depNum = 1
ORDER BY empBirthdate;
GO
-- but WHERE cannot see the alias: WHERE runs before SELECT
SELECT empName, empSalary * 12 AS yearSalary
FROM tblEmployee
WHERE yearSalary &gt; 1000000;
GO</code></pre>
<table>
<thead><tr><th>empName</th><th>yearSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>1800000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>1080000</td></tr>
<tr><td>Võ Việt Anh</td><td>720000</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>540000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td></tr>
<tr><td>Hoàng Thị Hà</td></tr>
<tr><td>Võ Việt Anh</td></tr>
<tr><td>Lê Thị Lan Anh</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 207, Level 16, State 1<br>
Invalid column name 'yearSalary'.</b></div>
<table>
<thead><tr><th>Where is the alias yearSalary visible?</th><th>Why</th></tr></thead>
<tbody>
<tr><td>ORDER BY yearSalary — yes</td><td>ORDER BY runs after SELECT (step 6)</td></tr>
<tr><td>ORDER BY empBirthdate (not selected) — yes</td><td>the sort can still see every column of FROM</td></tr>
<tr><td>WHERE yearSalary &gt; … — no, Msg 207</td><td>WHERE runs at step 2, the alias is born at step 5</td></tr>
</tbody>
</table>
<p class="meo">🧠 ORDER BY is always the last clause you write, and the last thing that happens (only TOP comes after it).</p>
<div class="pitfall">Sorting is the only way to get a guaranteed order. "It came out sorted when I tested" is luck — the same query can come back in another order on the exam machine or when the table grows.</div>`,
        `<p class="y-chinh">🎯 <code>ORDER BY cột1 [ASC|DESC], cột2 …</code> sắp xếp kết quả; ASC (tăng dần, mặc định) hay DESC (giảm dần) chọn riêng cho từng cột.</p>
<p>Slide (lấy từ giáo trình) nói việc sắp xếp làm "trên kết quả của FROM, WHERE và các mệnh đề khác, ngay trước SELECT". Nhờ vậy bạn sắp được theo một cột mà không hiển thị cột đó. Còn thứ tự chính thức của SQL Server đặt ORDER BY <strong>sau</strong> SELECT — nên bí danh dùng được trong ORDER BY. Cả hai điều cùng đúng, như lần chạy này cho thấy:</p>
<pre><code class="language-sql">-- ORDER BY dùng được bí danh đặt ở SELECT
SELECT empName, empSalary * 12 AS yearSalary
FROM tblEmployee
WHERE depNum = 1
ORDER BY yearSalary DESC;
GO
-- ORDER BY còn dùng được cột KHÔNG có trong SELECT
SELECT empName
FROM tblEmployee
WHERE depNum = 1
ORDER BY empBirthdate;
GO
-- nhưng WHERE không thấy bí danh: WHERE chạy trước SELECT
SELECT empName, empSalary * 12 AS yearSalary
FROM tblEmployee
WHERE yearSalary &gt; 1000000;
GO</code></pre>
<table>
<thead><tr><th>empName</th><th>yearSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>1800000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>1080000</td></tr>
<tr><td>Võ Việt Anh</td><td>720000</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>540000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td></tr>
<tr><td>Hoàng Thị Hà</td></tr>
<tr><td>Võ Việt Anh</td></tr>
<tr><td>Lê Thị Lan Anh</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 207, Level 16, State 1<br>
Invalid column name 'yearSalary'.</b></div>
<table>
<thead><tr><th>Bí danh yearSalary thấy được ở đâu?</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>ORDER BY yearSalary — được</td><td>ORDER BY chạy sau SELECT (bước 6)</td></tr>
<tr><td>ORDER BY empBirthdate (không chọn ra) — được</td><td>phép sắp vẫn thấy mọi cột của FROM</td></tr>
<tr><td>WHERE yearSalary &gt; … — không, Msg 207</td><td>WHERE chạy ở bước 2, bí danh ra đời ở bước 5</td></tr>
</tbody>
</table>
<p class="meo">🧠 ORDER BY luôn là mệnh đề viết cuối cùng, và là việc xảy ra cuối cùng (chỉ TOP đứng sau nó).</p>
<div class="pitfall">Sắp xếp là cách duy nhất để có thứ tự được bảo đảm. "Lúc tôi thử nó ra đúng thứ tự" là may mắn — cùng câu đó có thể ra thứ tự khác trên máy thi hoặc khi bảng lớn lên.</div>`],
      [31, 'Ordering the Output - Example 6',
        `<p class="y-chinh">🎯 Example 6 sorts by department number ascending, and inside each department by salary descending.</p>
<pre><code class="language-sql">/*6*/
SELECT *
FROM tblEmployee
ORDER BY depNum ASC, empSalary DESC
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>5 Láng Hạ, Đống Đa, TP Hà Nội</td><td>105000</td><td>M</td><td>1970-04-18</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>102 Kim Mã, Ba Đình, TP Hà Nội</td><td>95000</td><td>M</td><td>1978-09-09</td><td>2</td><td>30121050001</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>33 Cầu Giấy, TP Hà Nội</td><td>72000</td><td>F</td><td>1988-12-01</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>7 Hàng Bài, Hoàn Kiếm, TP Hà Nội</td><td>55000</td><td>M</td><td>1992-05-30</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050020</td><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td><td>88000</td><td>F</td><td>1980-06-25</td><td>3</td><td>30121050001</td></tr>
<tr><td>30121050027</td><td>Trương Thị Thu</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td><td>52000</td><td>F</td><td>1993-08-08</td><td>3</td><td>30121050020</td></tr>
<tr><td>30121050021</td><td>Bùi Văn Nam</td><td><em>NULL</em></td><td>40000</td><td>M</td><td>1998-02-14</td><td>3</td><td>30121050020</td></tr>
<tr><td>30121050030</td><td>Huỳnh Văn Tài</td><td>9 Võ Văn Tần, Q.3, TP Hồ Chí Minh</td><td>70000</td><td>M</td><td>1975-10-10</td><td>4</td><td>30121050001</td></tr>
<tr><td>30121050037</td><td>Lý Thanh Tâm</td><td>77 Hùng Vương, Hải Châu, TP Đà Nẵng</td><td>65000</td><td>F</td><td>1983-03-03</td><td>5</td><td>30121050001</td></tr>
<tr><td>30121050038</td><td>Phan Hữu Nghĩa</td><td>3 Lý Thường Kiệt, TP Hà Nội</td><td>38000</td><td>M</td><td><em>NULL</em></td><td>5</td><td>30121050037</td></tr>
</tbody>
</table>
<ul>
<li>Execution order: FROM (14) → no WHERE (14) → SELECT * → ORDER BY. The sort compares <code>depNum</code> first; only rows with the <strong>same</strong> depNum are compared on <code>empSalary</code>, highest first.</li>
<li>Look at department 2: 105000, 95000, 72000, 55000 — descending inside the group, while the groups themselves go 1, 2, 3, 4, 5.</li>
<li><code>ASC</code> is the default and could be omitted; <code>DESC</code> applies <strong>only</strong> to the column it follows.</li>
</ul>
<p>Where do NULLs go? SQL Server puts them <strong>first</strong> in ascending order:</p>
<pre><code class="language-sql">-- where does the NULL birth date go?
SELECT TOP 3 empName, empBirthdate
FROM tblEmployee
ORDER BY empBirthdate ASC;</code></pre>
<table>
<thead><tr><th>empName</th><th>empBirthdate</th></tr></thead>
<tbody>
<tr><td>Phan Hữu Nghĩa</td><td><em>NULL</em></td></tr>
<tr><td>Trần Minh Quang</td><td>1968-03-12</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>1970-04-18</td></tr>
</tbody>
</table>
<div class="pitfall"><code>ORDER BY depNum, empSalary DESC</code> does NOT sort depNum descending — each column has its own direction. Writing <code>ORDER BY depNum DESC, empSalary DESC</code> when only salary should be descending is a common slip.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> NULL is treated as larger than every value, so it comes <strong>last</strong> in ASC order; <code>NULLS FIRST</code> / <code>NULLS LAST</code> choose explicitly (SQL Server has no such words):
<pre><code class="language-sql">SELECT empName, empBirthdate FROM tblEmployee
ORDER BY empBirthdate ASC LIMIT 3;               -- PostgreSQL: NULL is LAST when ascending
SELECT empName, empBirthdate FROM tblEmployee
ORDER BY empBirthdate ASC NULLS FIRST LIMIT 3;   -- behave like SQL Server</code></pre>
<table>
<thead><tr><th>empname</th><th>empbirthdate</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>1968-03-12</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>1970-04-18</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>1975-10-10</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empname</th><th>empbirthdate</th></tr></thead>
<tbody>
<tr><td>Phan Hữu Nghĩa</td><td><em>NULL</em></td></tr>
<tr><td>Trần Minh Quang</td><td>1968-03-12</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>1970-04-18</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT, DISTINCT</a>.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 6 sắp theo số phòng tăng dần, và trong mỗi phòng sắp theo lương giảm dần.</p>
<pre><code class="language-sql">/*6*/
SELECT *
FROM tblEmployee
ORDER BY depNum ASC, empSalary DESC
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>5 Láng Hạ, Đống Đa, TP Hà Nội</td><td>105000</td><td>M</td><td>1970-04-18</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>102 Kim Mã, Ba Đình, TP Hà Nội</td><td>95000</td><td>M</td><td>1978-09-09</td><td>2</td><td>30121050001</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>33 Cầu Giấy, TP Hà Nội</td><td>72000</td><td>F</td><td>1988-12-01</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>7 Hàng Bài, Hoàn Kiếm, TP Hà Nội</td><td>55000</td><td>M</td><td>1992-05-30</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050020</td><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td><td>88000</td><td>F</td><td>1980-06-25</td><td>3</td><td>30121050001</td></tr>
<tr><td>30121050027</td><td>Trương Thị Thu</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td><td>52000</td><td>F</td><td>1993-08-08</td><td>3</td><td>30121050020</td></tr>
<tr><td>30121050021</td><td>Bùi Văn Nam</td><td><em>NULL</em></td><td>40000</td><td>M</td><td>1998-02-14</td><td>3</td><td>30121050020</td></tr>
<tr><td>30121050030</td><td>Huỳnh Văn Tài</td><td>9 Võ Văn Tần, Q.3, TP Hồ Chí Minh</td><td>70000</td><td>M</td><td>1975-10-10</td><td>4</td><td>30121050001</td></tr>
<tr><td>30121050037</td><td>Lý Thanh Tâm</td><td>77 Hùng Vương, Hải Châu, TP Đà Nẵng</td><td>65000</td><td>F</td><td>1983-03-03</td><td>5</td><td>30121050001</td></tr>
<tr><td>30121050038</td><td>Phan Hữu Nghĩa</td><td>3 Lý Thường Kiệt, TP Hà Nội</td><td>38000</td><td>M</td><td><em>NULL</em></td><td>5</td><td>30121050037</td></tr>
</tbody>
</table>
<ul>
<li>Thứ tự thực thi: FROM (14) → không có WHERE (14) → SELECT * → ORDER BY. Phép sắp so <code>depNum</code> trước; chỉ những dòng <strong>cùng</strong> depNum mới được so tiếp theo <code>empSalary</code>, cao trước.</li>
<li>Nhìn phòng 2: 105000, 95000, 72000, 55000 — giảm dần trong nhóm, còn các nhóm thì đi 1, 2, 3, 4, 5.</li>
<li><code>ASC</code> là mặc định, có thể bỏ; <code>DESC</code> chỉ áp dụng <strong>cho đúng</strong> cột đứng trước nó.</li>
</ul>
<p>NULL nằm ở đâu? SQL Server đặt NULL <strong>đầu tiên</strong> khi sắp tăng dần:</p>
<pre><code class="language-sql">-- ngày sinh NULL nằm ở đâu?
SELECT TOP 3 empName, empBirthdate
FROM tblEmployee
ORDER BY empBirthdate ASC;</code></pre>
<table>
<thead><tr><th>empName</th><th>empBirthdate</th></tr></thead>
<tbody>
<tr><td>Phan Hữu Nghĩa</td><td><em>NULL</em></td></tr>
<tr><td>Trần Minh Quang</td><td>1968-03-12</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>1970-04-18</td></tr>
</tbody>
</table>
<div class="pitfall"><code>ORDER BY depNum, empSalary DESC</code> KHÔNG sắp depNum giảm dần — mỗi cột có chiều riêng. Viết <code>ORDER BY depNum DESC, empSalary DESC</code> khi chỉ lương cần giảm dần là lỗi hay gặp.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> NULL được coi là lớn hơn mọi giá trị, nên nó đứng <strong>cuối</strong> khi sắp ASC; <code>NULLS FIRST</code> / <code>NULLS LAST</code> cho chọn rõ ràng (SQL Server không có hai từ này):
<pre><code class="language-sql">SELECT empName, empBirthdate FROM tblEmployee
ORDER BY empBirthdate ASC LIMIT 3;               -- PostgreSQL: NULL đứng CUỐI khi tăng dần
SELECT empName, empBirthdate FROM tblEmployee
ORDER BY empBirthdate ASC NULLS FIRST LIMIT 3;   -- làm giống SQL Server</code></pre>
<table>
<thead><tr><th>empname</th><th>empbirthdate</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>1968-03-12</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>1970-04-18</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>1975-10-10</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empname</th><th>empbirthdate</th></tr></thead>
<tbody>
<tr><td>Phan Hữu Nghĩa</td><td><em>NULL</em></td></tr>
<tr><td>Trần Minh Quang</td><td>1968-03-12</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>1970-04-18</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT, DISTINCT</a>.</div>`],
      [32, '6.2 Queries involving more than one relation',
        `<p class="y-chinh">🎯 Section 6.2 of the deck: queries that read two or more tables at once.</p>
<p>Real questions almost never live in one table: "the name of the department of each employee" needs tblEmployee <strong>and</strong> tblDepartment. Slides 33–43 show the tools; this is where the ERD (web Chapter 3) pays off — each foreign key on the ERD is a path you can join along.</p>`,
        `<p class="y-chinh">🎯 Mục 6.2 của bộ slide: các câu truy vấn đọc hai bảng trở lên cùng lúc.</p>
<p>Câu hỏi thật hầu như không nằm gọn trong một bảng: "tên phòng của từng nhân viên" cần tblEmployee <strong>và</strong> tblDepartment. Slide 33–43 cho các công cụ; đây là lúc ERD (Chương 3 trên web) phát huy tác dụng — mỗi khoá ngoại trên ERD là một con đường để nối bảng.</p>`],
      [33, 'Queries Involving More Than One Relation',
        `<p class="y-chinh">🎯 SQL combines relations in five ways: joins, products, unions, intersections and differences — the same operators as relational algebra.</p>
<table>
<thead><tr><th>Operation</th><th>Algebra</th><th>SQL</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>product</td><td>R × S</td><td><code>FROM R, S</code> or <code>R CROSS JOIN S</code></td><td>34, 58–59</td></tr>
<tr><td>join</td><td>R ⋈<sub>θ</sub> S</td><td><code>FROM R, S WHERE θ</code> or <code>R JOIN S ON θ</code></td><td>35, 58–60</td></tr>
<tr><td>natural / outer join</td><td>⋈, ⟕ ⟖ ⟗</td><td>NATURAL JOIN (not in SQL Server), LEFT/RIGHT/FULL JOIN</td><td>61–64</td></tr>
<tr><td>union, intersection, difference</td><td>∪ ∩ −</td><td>UNION, INTERSECT, EXCEPT</td><td>40–43, 68</td></tr>
</tbody>
</table>
<p>Products and joins put tables <strong>side by side</strong> (more columns); union, intersection and difference put results <strong>on top of each other</strong> (same columns, more or fewer rows).</p>`,
        `<p class="y-chinh">🎯 SQL kết hợp các quan hệ theo năm cách: phép nối (join), tích (product), hợp (union), giao (intersection) và hiệu (difference) — đúng các phép của đại số quan hệ.</p>
<table>
<thead><tr><th>Phép</th><th>Đại số</th><th>SQL</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>tích Descartes</td><td>R × S</td><td><code>FROM R, S</code> hoặc <code>R CROSS JOIN S</code></td><td>34, 58–59</td></tr>
<tr><td>phép nối</td><td>R ⋈<sub>θ</sub> S</td><td><code>FROM R, S WHERE θ</code> hoặc <code>R JOIN S ON θ</code></td><td>35, 58–60</td></tr>
<tr><td>nối tự nhiên / nối ngoài</td><td>⋈, ⟕ ⟖ ⟗</td><td>NATURAL JOIN (SQL Server không có), LEFT/RIGHT/FULL JOIN</td><td>61–64</td></tr>
<tr><td>hợp, giao, hiệu</td><td>∪ ∩ −</td><td>UNION, INTERSECT, EXCEPT</td><td>40–43, 68</td></tr>
</tbody>
</table>
<p>Tích và nối đặt các bảng <strong>cạnh nhau</strong> (thêm cột); hợp, giao, hiệu xếp các kết quả <strong>chồng lên nhau</strong> (cùng cột, nhiều hoặc ít dòng hơn).</p>`],
      [34, 'Products and Joins in SQL',
        `<p class="y-chinh">🎯 List several tables in FROM and you get their product (every row with every row); a join condition in WHERE keeps only the pairs that belong together.</p>
<pre><code class="language-sql">-- the FROM list alone = every department paired with every employee
SELECT COUNT(*) AS rows_after_FROM
FROM tblDepartment, tblEmployee;
-- with the join condition: only the pairs that belong together
SELECT COUNT(*) AS rows_after_WHERE
FROM tblDepartment D, tblEmployee E
WHERE D.depNum = E.depNum;</code></pre>
<table>
<thead><tr><th>rows_after_FROM</th></tr></thead>
<tbody>
<tr><td>70</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>rows_after_WHERE</th></tr></thead>
<tbody>
<tr><td>14</td></tr>
</tbody>
</table>
<ul>
<li>Step 1, FROM: 5 departments × 14 employees = <strong>70</strong> pairs — most of them nonsense (Trần Minh Quang paired with Phòng Kinh doanh).</li>
<li>Step 2, WHERE <code>D.depNum = E.depNum</code>: each employee keeps only the pair with his own department → <strong>14</strong> rows. This condition is the <strong>join condition</strong>: foreign key = primary key.</li>
<li>After that, WHERE and SELECT may use the columns of <strong>both</strong> tables.</li>
</ul>
<p class="meo">🧠 n tables need at least n − 1 join conditions (one per foreign-key "line" on the ERD). 2 tables → 1 condition, 3 tables → 2.</p>
<div class="pitfall">Forgetting the join condition gives no error — just a product with far too many rows. If a result has "too many rows, and the same name everywhere", look for a missing join condition first.</div>`,
        `<p class="y-chinh">🎯 Liệt kê nhiều bảng trong FROM thì bạn được tích của chúng (mỗi dòng ghép với mọi dòng); điều kiện nối đặt trong WHERE chỉ giữ những cặp thuộc về nhau.</p>
<pre><code class="language-sql">-- chỉ có danh sách FROM = mỗi phòng ghép với mọi nhân viên
SELECT COUNT(*) AS rows_after_FROM
FROM tblDepartment, tblEmployee;
-- thêm điều kiện nối: chỉ những cặp thuộc về nhau
SELECT COUNT(*) AS rows_after_WHERE
FROM tblDepartment D, tblEmployee E
WHERE D.depNum = E.depNum;</code></pre>
<table>
<thead><tr><th>rows_after_FROM</th></tr></thead>
<tbody>
<tr><td>70</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>rows_after_WHERE</th></tr></thead>
<tbody>
<tr><td>14</td></tr>
</tbody>
</table>
<ul>
<li>Bước 1, FROM: 5 phòng × 14 nhân viên = <strong>70</strong> cặp — phần lớn vô nghĩa (Trần Minh Quang ghép với Phòng Kinh doanh).</li>
<li>Bước 2, WHERE <code>D.depNum = E.depNum</code>: mỗi nhân viên chỉ giữ cặp với phòng của chính mình → <strong>14</strong> dòng. Điều kiện này là <strong>điều kiện nối</strong> (join condition): khoá ngoại = khoá chính.</li>
<li>Từ đó WHERE và SELECT dùng được các cột của <strong>cả hai</strong> bảng.</li>
</ul>
<p class="meo">🧠 n bảng cần ít nhất n − 1 điều kiện nối (mỗi "đường" khoá ngoại trên ERD một điều kiện). 2 bảng → 1 điều kiện, 3 bảng → 2.</p>
<div class="pitfall">Quên điều kiện nối không báo lỗi gì — chỉ ra một tích với quá nhiều dòng. Kết quả mà "nhiều dòng quá, tên nào cũng lặp" thì việc đầu tiên là tìm điều kiện nối bị thiếu.</div>`],
      [35, 'Products and Joins in SQL - Example 7',
        `<p class="y-chinh">🎯 Example 7 lists the employees of "Phòng Phần mềm trong nước" by joining tblEmployee and tblDepartment in FROM and filtering in WHERE.</p>
<pre><code class="language-sql">/*7*/
SELECT *
FROM tblEmployee E, tblDepartment D
WHERE e.depNum=d.depNum AND d.depName LIKE N'Phòng phần mềm trong nước';
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th><th>depNum</th><th>depName</th><th>mgrSSN</th><th>mgrAssDate</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
</tbody>
</table>
<p>In execution order, with the real row counts after each step:</p>
<pre><code class="language-sql">-- step 1  FROM tblEmployee E, tblDepartment D: 14 x 5 pairs
SELECT COUNT(*) AS step1_FROM FROM tblEmployee E, tblDepartment D;
-- step 2a WHERE e.depNum = d.depNum: each employee keeps only his own department
SELECT COUNT(*) AS step2a_join FROM tblEmployee E, tblDepartment D WHERE e.depNum = d.depNum;
-- step 2b AND d.depName LIKE ...: only department 1 is left
SELECT e.empSSN, e.empName, e.depNum AS e_depNum, d.depNum AS d_depNum, d.depName
FROM tblEmployee E, tblDepartment D
WHERE e.depNum = d.depNum AND d.depName LIKE N'Phòng phần mềm trong nước';</code></pre>
<table>
<thead><tr><th>step1_FROM</th></tr></thead>
<tbody>
<tr><td>70</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>step2a_join</th></tr></thead>
<tbody>
<tr><td>14</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>e_depNum</th><th>d_depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>1</td><td>1</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>1</td><td>1</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>1</td><td>1</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>1</td><td>1</td><td>Phòng Phần mềm trong nước</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>What happens</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee E, tblDepartment D</td><td>product, E and D are tuple variables (short names)</td><td>70</td></tr>
<tr><td>2a</td><td>WHERE e.depNum = d.depNum</td><td>join condition: each employee + his department</td><td>14</td></tr>
<tr><td>2b</td><td>AND d.depName LIKE N'…'</td><td>only department 1 is left</td><td>4</td></tr>
<tr><td>5</td><td>SELECT *</td><td>all 8 + 4 columns — depNum appears twice</td><td>4</td></tr>
</tbody>
</table>
<ul>
<li><code>E</code> in FROM and <code>e</code> in WHERE are the same alias: names are case-insensitive in SQL Server.</li>
<li><code>LIKE</code> without <code>%</code> or <code>_</code> behaves like <code>=</code>. The slide writes "phần" with a small p while the data says "Phần": SQL Server's default collation ignores case, so it still matches.</li>
</ul>
<div class="pitfall"><code>SELECT *</code> over a join returns BOTH depNum columns. In the PE list the columns you need (<code>e.empName, d.depName</code>) — duplicate column names also break a view or a sub-query in FROM.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> text comparison is case-sensitive, so the slide's exact string finds <strong>nobody</strong>; <code>ILIKE</code> ignores case. The second query is also written with <code>JOIN … ON</code>, the style used at work:
<pre><code class="language-sql">-- copied as on the slide (small p): PostgreSQL compares case-sensitively
SELECT e.empName, d.depName
FROM tblEmployee e, tblDepartment d
WHERE e.depNum = d.depNum AND d.depName LIKE 'Phòng phần mềm trong nước';
-- ILIKE ignores case; JOIN ... ON is the style you will write at work
SELECT e.empName, d.depName
FROM tblEmployee e
JOIN tblDepartment d ON e.depNum = d.depNum
WHERE d.depName ILIKE 'Phòng phần mềm trong nước'
ORDER BY e.empName;</code></pre>
<table>
<thead><tr><th>empname</th><th>depname</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empname</th><th>depname</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>Trần Minh Quang</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>Võ Việt Anh</td><td>Phòng Phần mềm trong nước</td></tr>
</tbody>
</table>
Lessons: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-1-inner-join">PostgreSQL 5.1 — INNER JOIN</a> · <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-2-select-where">4.2 — LIKE / ILIKE</a>.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 7 liệt kê nhân viên của "Phòng Phần mềm trong nước" bằng cách nối tblEmployee với tblDepartment trong FROM rồi lọc ở WHERE.</p>
<pre><code class="language-sql">/*7*/
SELECT *
FROM tblEmployee E, tblDepartment D
WHERE e.depNum=d.depNum AND d.depName LIKE N'Phòng phần mềm trong nước';
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th><th>depNum</th><th>depName</th><th>mgrSSN</th><th>mgrAssDate</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
</tbody>
</table>
<p>Theo thứ tự thực thi, kèm số dòng thật sau mỗi bước:</p>
<pre><code class="language-sql">-- bước 1  FROM tblEmployee E, tblDepartment D: 14 x 5 cặp
SELECT COUNT(*) AS step1_FROM FROM tblEmployee E, tblDepartment D;
-- bước 2a WHERE e.depNum = d.depNum: mỗi nhân viên chỉ còn phòng của mình
SELECT COUNT(*) AS step2a_join FROM tblEmployee E, tblDepartment D WHERE e.depNum = d.depNum;
-- bước 2b AND d.depName LIKE ...: chỉ còn phòng 1
SELECT e.empSSN, e.empName, e.depNum AS e_depNum, d.depNum AS d_depNum, d.depName
FROM tblEmployee E, tblDepartment D
WHERE e.depNum = d.depNum AND d.depName LIKE N'Phòng phần mềm trong nước';</code></pre>
<table>
<thead><tr><th>step1_FROM</th></tr></thead>
<tbody>
<tr><td>70</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>step2a_join</th></tr></thead>
<tbody>
<tr><td>14</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>e_depNum</th><th>d_depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>1</td><td>1</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>1</td><td>1</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>1</td><td>1</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>1</td><td>1</td><td>Phòng Phần mềm trong nước</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Chuyện gì xảy ra</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee E, tblDepartment D</td><td>tích; E và D là biến bộ (tuple variable — tên ngắn)</td><td>70</td></tr>
<tr><td>2a</td><td>WHERE e.depNum = d.depNum</td><td>điều kiện nối: mỗi nhân viên + phòng của mình</td><td>14</td></tr>
<tr><td>2b</td><td>AND d.depName LIKE N'…'</td><td>chỉ còn phòng 1</td><td>4</td></tr>
<tr><td>5</td><td>SELECT *</td><td>đủ 8 + 4 cột — depNum xuất hiện hai lần</td><td>4</td></tr>
</tbody>
</table>
<ul>
<li><code>E</code> trong FROM và <code>e</code> trong WHERE là cùng một bí danh: tên trong SQL Server không phân biệt hoa thường.</li>
<li><code>LIKE</code> không có <code>%</code> hay <code>_</code> thì giống <code>=</code>. Slide viết "phần" chữ p thường còn dữ liệu là "Phần": collation mặc định của SQL Server bỏ qua hoa thường nên vẫn khớp.</li>
</ul>
<div class="pitfall"><code>SELECT *</code> trên phép nối trả về CẢ HAI cột depNum. Trong bài PE hãy liệt kê cột cần (<code>e.empName, d.depName</code>) — tên cột trùng còn làm hỏng view hoặc câu truy vấn con trong FROM.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> so sánh chữ phân biệt hoa thường, nên chuỗi y như slide tìm được <strong>không ai</strong>; <code>ILIKE</code> thì bỏ qua hoa thường. Câu thứ hai viết luôn bằng <code>JOIN … ON</code>, kiểu viết dùng khi đi làm:
<pre><code class="language-sql">-- chép y slide (chữ p thường): PostgreSQL phân biệt hoa thường
SELECT e.empName, d.depName
FROM tblEmployee e, tblDepartment d
WHERE e.depNum = d.depNum AND d.depName LIKE 'Phòng phần mềm trong nước';
-- ILIKE bỏ qua hoa thường; JOIN ... ON là kiểu viết khi đi làm
SELECT e.empName, d.depName
FROM tblEmployee e
JOIN tblDepartment d ON e.depNum = d.depNum
WHERE d.depName ILIKE 'Phòng phần mềm trong nước'
ORDER BY e.empName;</code></pre>
<table>
<thead><tr><th>empname</th><th>depname</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empname</th><th>depname</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>Trần Minh Quang</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>Võ Việt Anh</td><td>Phòng Phần mềm trong nước</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-1-inner-join">PostgreSQL 5.1 — INNER JOIN</a> · <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-2-select-where">4.2 — LIKE / ILIKE</a>.</div>`],
      [36, 'What we do if two attributes have the same name',
        `<p class="y-chinh">🎯 The question: several tables in FROM and two columns with the same name — how does SQL know which one you mean? Answer: it does not, until you prefix the column with its table (or alias).</p>
<pre><code class="language-sql">-- depNum exists in BOTH tables: which one?
SELECT empName, depNum, depName
FROM tblEmployee, tblDepartment
WHERE tblEmployee.depNum = tblDepartment.depNum;
GO
-- fixed: prefix the column with the table name (or its alias)
SELECT empName, tblEmployee.depNum, depName
FROM tblEmployee, tblDepartment
WHERE tblEmployee.depNum = tblDepartment.depNum
  AND tblEmployee.depNum = 3;
GO</code></pre>
<div class="out"><b>Msg 209, Level 16, State 1<br>
Ambiguous column name 'depNum'.</b></div>
<table>
<thead><tr><th>empName</th><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>Nguyễn Thị Mai</td><td>3</td><td>Phòng Kinh doanh</td></tr>
<tr><td>Bùi Văn Nam</td><td>3</td><td>Phòng Kinh doanh</td></tr>
<tr><td>Trương Thị Thu</td><td>3</td><td>Phòng Kinh doanh</td></tr>
</tbody>
</table>
<ul>
<li>Msg 209 "Ambiguous column name 'depNum'": depNum exists in tblEmployee and in tblDepartment, and SELECT did not say which.</li>
<li>Fix: <code>tblEmployee.depNum</code> (or <code>e.depNum</code> with an alias). Columns that exist in only one table (empName, depName) need no prefix — but prefixing everything is the safer habit.</li>
<li>The same name in two tables is normal: a foreign key usually has the same name as the key it points to. Slide 37 gives the shorter way (tuple variables).</li>
</ul>
<div class="pitfall">Trap: tblDependent.depName is the name of a <strong>relative</strong>, tblDepartment.depName the name of a <strong>department</strong>. Same name, different meaning — never join on a column just because the names match (see NATURAL JOIN, slide 61).</div>`,
        `<p class="y-chinh">🎯 Câu hỏi: nhiều bảng trong FROM mà có hai cột cùng tên — SQL biết bạn muốn cột nào? Trả lời: không biết, cho tới khi bạn ghi tên bảng (hoặc bí danh) trước tên cột.</p>
<pre><code class="language-sql">-- depNum có ở CẢ HAI bảng: lấy cái nào?
SELECT empName, depNum, depName
FROM tblEmployee, tblDepartment
WHERE tblEmployee.depNum = tblDepartment.depNum;
GO
-- sửa: ghi tên bảng (hoặc bí danh) trước tên cột
SELECT empName, tblEmployee.depNum, depName
FROM tblEmployee, tblDepartment
WHERE tblEmployee.depNum = tblDepartment.depNum
  AND tblEmployee.depNum = 3;
GO</code></pre>
<div class="out"><b>Msg 209, Level 16, State 1<br>
Ambiguous column name 'depNum'.</b></div>
<table>
<thead><tr><th>empName</th><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>Nguyễn Thị Mai</td><td>3</td><td>Phòng Kinh doanh</td></tr>
<tr><td>Bùi Văn Nam</td><td>3</td><td>Phòng Kinh doanh</td></tr>
<tr><td>Trương Thị Thu</td><td>3</td><td>Phòng Kinh doanh</td></tr>
</tbody>
</table>
<ul>
<li>Msg 209 "Ambiguous column name 'depNum'" (tên cột mơ hồ): depNum có ở cả tblEmployee lẫn tblDepartment, mà SELECT không nói lấy cột nào.</li>
<li>Sửa: <code>tblEmployee.depNum</code> (hoặc <code>e.depNum</code> nếu có bí danh). Cột chỉ có ở một bảng (empName, depName) thì không cần tiền tố — nhưng ghi tiền tố cho mọi cột là thói quen an toàn hơn.</li>
<li>Hai bảng có cột trùng tên là chuyện bình thường: khoá ngoại thường đặt trùng tên với khoá mà nó trỏ tới. Slide 37 cho cách viết ngắn hơn (biến bộ).</li>
</ul>
<div class="pitfall">Bẫy: tblDependent.depName là tên một <strong>người thân</strong>, tblDepartment.depName là tên một <strong>phòng</strong>. Cùng tên, khác nghĩa — đừng bao giờ nối theo một cột chỉ vì trùng tên (xem NATURAL JOIN, slide 61).</div>`],
    ]),
    books([
      ['ullman', 'Ullman &amp; Widom, A First Course in Database Systems (3e) — §6.1 Simple queries, §6.2 Queries involving more than one relation, §6.5 Database modifications', 'Ullman &amp; Widom, A First Course in Database Systems (3e) — §6.1 Truy vấn đơn giản, §6.2 Truy vấn nhiều quan hệ, §6.5 Sửa đổi CSDL'],
      ['ramakrishnan', 'Ramakrishnan &amp; Gehrke, Database Management Systems — ch. 5.2 The form of a basic SQL query', 'Ramakrishnan &amp; Gehrke, Database Management Systems — mục 5.2 Dạng cơ bản của câu truy vấn SQL'],
    ]),
  ].join('\n'),
};

/* ───────── 6.B — 📑 Slide by slide · Self-join, set operators and subqueries (Chapter 6, slides 37–52) ───────── */
const L_dbi7_4 = {
  title: '6.B — 📑 Slide by slide · Self-join, set operators and subqueries (Chapter 6, slides 37–52)|||6.B — 📑 Học theo từng slide · Tự nối, phép tập hợp và truy vấn con (Chapter 6, slide 37–52)',
  slug: 'dbi202-slide-dbi7-4',
  type: 'VIDEO',
  description: 'Giảng từng slide 37–52 của bộ slide Chapter 6 của trường (phần 2): biến bộ và bí danh bảng, Example 8 (DISTINCT qua bảng nối), tự nối Example 9, UNION/INTERSECT/EXCEPT (Example 10.1–10.3, bẫy NOT IN gặp NULL), truy vấn con trả về một giá trị (Example 7 so với Example 11 viết bằng =, =ANY, IN), EXISTS/IN/ALL/ANY và so sánh bộ — từng câu giải theo thứ tự thực thi, chạy thật trên FUHCompany, ô 🐘 PostgreSQL ở mọi chỗ cú pháp khác.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.B · school slides "Chapter 6", part 2 (slides 22–82)</span>
<h2>Tuple variables, set operators and subqueries</h2>
<p class="lead">School "Chapter 6" slides, part 2 — this lesson covers slides 37–52 (part 1, slides 1–21, is in Chapter 5 of this website). You will join a table with itself, stack query results with UNION / INTERSECT / EXCEPT, and put a query inside another query.</p>
<div class="callout"><strong>Reminder — read in execution order.</strong> FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. A <strong>subquery</strong> is simply a query in brackets used as a value or as a table inside another query; read the inner query first, write its result down, then read the outer one.</div>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>You must be able to</th></tr></thead>
<tbody>
<tr><td>37–39</td><td>tuple variables; Example 8; self-join (Example 9)</td><td>give tables short names; join a table with itself</td></tr>
<tr><td>40–43</td><td>UNION, INTERSECT, EXCEPT (Example 10.1–10.3)</td><td>choose the right set operator; avoid the NOT IN + NULL trap</td></tr>
<tr><td>44–50</td><td>subqueries returning one value (Example 7 vs 11)</td><td>use =, =ANY, IN; know error 512</td></tr>
<tr><td>51–52</td><td>EXISTS, IN, ALL, ANY; tuples</td><td>predict TRUE/FALSE, including on an empty set</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 6 · Bài 6.B · slide "Chapter 6" của trường, phần 2 (slide 22–82)</span>
<h2>Biến bộ, phép toán tập hợp và truy vấn con</h2>
<p class="lead">Slide Chapter 6 của trường, phần 2 — bài này học slide 37–52 (phần 1, slide 1–21, ở Chương 5 của web). Bạn sẽ nối một bảng với chính nó, xếp chồng kết quả truy vấn bằng UNION / INTERSECT / EXCEPT, và đặt một câu truy vấn bên trong câu khác.</p>
<div class="callout"><strong>Nhắc lại — đọc theo thứ tự thực thi.</strong> FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. Một <strong>truy vấn con</strong> (subquery) chỉ đơn giản là một câu truy vấn trong ngoặc, dùng như một giá trị hoặc một bảng bên trong câu khác; đọc câu bên trong trước, ghi kết quả của nó ra, rồi mới đọc câu bên ngoài.</div>
<table>
<thead><tr><th>Slide</th><th>Ý chính</th><th>Bạn phải làm được</th></tr></thead>
<tbody>
<tr><td>37–39</td><td>biến bộ; Ví dụ 8; tự nối (Ví dụ 9)</td><td>đặt tên ngắn cho bảng; nối một bảng với chính nó</td></tr>
<tr><td>40–43</td><td>UNION, INTERSECT, EXCEPT (Ví dụ 10.1–10.3)</td><td>chọn đúng phép tập hợp; tránh bẫy NOT IN gặp NULL</td></tr>
<tr><td>44–50</td><td>truy vấn con trả về một giá trị (Ví dụ 7 và 11)</td><td>dùng =, =ANY, IN; biết lỗi 512</td></tr>
<tr><td>51–52</td><td>EXISTS, IN, ALL, ANY; bộ giá trị</td><td>đoán đúng TRUE/FALSE, kể cả khi tập rỗng</td></tr>
</tbody>
</table>`),
    walkHead('dbi7', 37, 52),
    walk('dbi7', [
      [37, 'Tuple Variables',
        `<p class="y-chinh">🎯 A tuple variable (table alias) is a short name for one occurrence of a table in FROM; with two different aliases the SAME table can appear twice.</p>
<p><code>FROM tblEmployee AS e</code> means "e walks over the rows of tblEmployee"; <code>e.empName</code> is the name in the row e is currently on. Aliases give two things: shorter code, and the ability to use a table <strong>more than once</strong>. Example: each employee of department 1 with the name of his supervisor — the supervisor is also a row of tblEmployee:</p>
<pre><code class="language-sql">-- e and s are two tuple variables over the SAME table: e = the employee, s = his supervisor
SELECT e.empName AS employee, s.empName AS supervisor
FROM tblEmployee AS e, tblEmployee AS s
WHERE e.supervisorSSN = s.empSSN
  AND e.depNum = 1;</code></pre>
<table>
<thead><tr><th>employee</th><th>supervisor</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>Trần Minh Quang</td></tr>
<tr><td>Võ Việt Anh</td><td>Hoàng Thị Hà</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>Hoàng Thị Hà</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>What happens</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee e, tblEmployee s</td><td>two copies of the table: 14 × 14 pairs</td><td>196</td></tr>
<tr><td>2</td><td>WHERE e.supervisorSSN = s.empSSN</td><td>s must be e's supervisor (13 people have one)</td><td>13</td></tr>
<tr><td>2</td><td>AND e.depNum = 1</td><td>Trần Minh Quang has no supervisor (NULL), 3 left</td><td>3</td></tr>
<tr><td>5</td><td>SELECT e.empName, s.empName</td><td>the same column, once from each copy, renamed</td><td>3</td></tr>
</tbody>
</table>
<p class="meo">🧠 Draw the self-reference line on the ERD (SUPERVISION: employee → employee): every such line becomes "the same table twice with two aliases".</p>`,
        `<p class="y-chinh">🎯 Biến bộ (tuple variable — bí danh bảng) là tên ngắn cho một lần xuất hiện của một bảng trong FROM; với hai bí danh khác nhau thì CÙNG một bảng có thể xuất hiện hai lần.</p>
<p><code>FROM tblEmployee AS e</code> nghĩa là "e đi qua từng dòng của tblEmployee"; <code>e.empName</code> là tên ở dòng e đang đứng. Bí danh cho hai thứ: code ngắn hơn, và dùng được một bảng <strong>nhiều hơn một lần</strong>. Ví dụ: mỗi nhân viên phòng 1 kèm tên người giám sát — mà người giám sát cũng là một dòng của tblEmployee:</p>
<pre><code class="language-sql">-- e và s là hai biến bộ trên CÙNG một bảng: e = nhân viên, s = người giám sát của họ
SELECT e.empName AS employee, s.empName AS supervisor
FROM tblEmployee AS e, tblEmployee AS s
WHERE e.supervisorSSN = s.empSSN
  AND e.depNum = 1;</code></pre>
<table>
<thead><tr><th>employee</th><th>supervisor</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>Trần Minh Quang</td></tr>
<tr><td>Võ Việt Anh</td><td>Hoàng Thị Hà</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>Hoàng Thị Hà</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Chuyện gì xảy ra</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee e, tblEmployee s</td><td>hai bản sao của bảng: 14 × 14 cặp</td><td>196</td></tr>
<tr><td>2</td><td>WHERE e.supervisorSSN = s.empSSN</td><td>s phải là người giám sát của e (13 người có)</td><td>13</td></tr>
<tr><td>2</td><td>AND e.depNum = 1</td><td>Trần Minh Quang không có người giám sát (NULL), còn 3</td><td>3</td></tr>
<tr><td>5</td><td>SELECT e.empName, s.empName</td><td>cùng một cột, lấy từ mỗi bản sao một lần, đổi tên</td><td>3</td></tr>
</tbody>
</table>
<p class="meo">🧠 Vẽ đường tự tham chiếu trên ERD (SUPERVISION: nhân viên → nhân viên): đường nào như vậy cũng thành "cùng một bảng hai lần với hai bí danh".</p>`],
      [38, 'Disambiguating Attributes - Example 8',
        `<p class="y-chinh">🎯 Example 8, "find all cities in which our company is": join tblLocation with tblDepLocation, prefix the shared column locNum with its alias, and remove repeats with DISTINCT.</p>
<pre><code class="language-sql">/*8*/
SELECT distinct l.locname
FROM tblLocation l, tblDepLocation d
WHERE l.locNum=d.locNum
GO</code></pre>
<table>
<thead><tr><th>locname</th></tr></thead>
<tbody>
<tr><td>TP Hà Nội</td></tr>
<tr><td>TP Hồ Chí Minh</td></tr>
<tr><td>TP Đà Nẵng</td></tr>
</tbody>
</table>
<p>Before DISTINCT the join has one row per (department, city) pair — a city with three departments appears three times:</p>
<pre><code class="language-sql">-- before DISTINCT: one row per (department, location) pair
SELECT d.depNum, l.locNum, l.locName
FROM tblLocation l, tblDepLocation d
WHERE l.locNum = d.locNum
ORDER BY l.locNum, d.depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>locNum</th><th>locName</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>TP Hà Nội</td></tr>
<tr><td>2</td><td>1</td><td>TP Hà Nội</td></tr>
<tr><td>4</td><td>1</td><td>TP Hà Nội</td></tr>
<tr><td>1</td><td>2</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>2</td><td>2</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>3</td><td>2</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>3</td><td>3</td><td>TP Đà Nẵng</td></tr>
<tr><td>5</td><td>3</td><td>TP Đà Nẵng</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>What happens</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblLocation l, tblDepLocation d</td><td>4 × 8 pairs</td><td>32</td></tr>
<tr><td>2</td><td>WHERE l.locNum = d.locNum</td><td>locNum is in both tables → must be written l.locNum / d.locNum</td><td>8</td></tr>
<tr><td>5</td><td>SELECT distinct l.locname</td><td>keep one column, then remove duplicates</td><td>3</td></tr>
</tbody>
</table>
<p>TP Cần Thơ is missing: no department is located there, so it has no partner in the join. Note <code>l.locname</code> in lower case: column names are case-insensitive in SQL Server.</p>
<div class="pitfall">"Our company is in" means "some department is there", so the answer comes from tblDepLocation. Answering from tblLocation alone lists all 4 cities — including one where the company has nobody.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 8, "tìm mọi thành phố có công ty ta": nối tblLocation với tblDepLocation, ghi bí danh trước cột chung locNum, và bỏ lặp bằng DISTINCT.</p>
<pre><code class="language-sql">/*8*/
SELECT distinct l.locname
FROM tblLocation l, tblDepLocation d
WHERE l.locNum=d.locNum
GO</code></pre>
<table>
<thead><tr><th>locname</th></tr></thead>
<tbody>
<tr><td>TP Hà Nội</td></tr>
<tr><td>TP Hồ Chí Minh</td></tr>
<tr><td>TP Đà Nẵng</td></tr>
</tbody>
</table>
<p>Trước DISTINCT phép nối có mỗi cặp (phòng, thành phố) một dòng — thành phố có ba phòng thì hiện ba lần:</p>
<pre><code class="language-sql">-- trước DISTINCT: mỗi cặp (phòng, địa điểm) một dòng
SELECT d.depNum, l.locNum, l.locName
FROM tblLocation l, tblDepLocation d
WHERE l.locNum = d.locNum
ORDER BY l.locNum, d.depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>locNum</th><th>locName</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>TP Hà Nội</td></tr>
<tr><td>2</td><td>1</td><td>TP Hà Nội</td></tr>
<tr><td>4</td><td>1</td><td>TP Hà Nội</td></tr>
<tr><td>1</td><td>2</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>2</td><td>2</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>3</td><td>2</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>3</td><td>3</td><td>TP Đà Nẵng</td></tr>
<tr><td>5</td><td>3</td><td>TP Đà Nẵng</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Chuyện gì xảy ra</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblLocation l, tblDepLocation d</td><td>4 × 8 cặp</td><td>32</td></tr>
<tr><td>2</td><td>WHERE l.locNum = d.locNum</td><td>locNum có ở cả hai bảng → phải viết l.locNum / d.locNum</td><td>8</td></tr>
<tr><td>5</td><td>SELECT distinct l.locname</td><td>giữ một cột, rồi bỏ bản trùng</td><td>3</td></tr>
</tbody>
</table>
<p>Thiếu TP Cần Thơ: không phòng nào đặt ở đó, nên nó không có bạn ghép trong phép nối. Để ý <code>l.locname</code> viết thường: tên cột không phân biệt hoa thường trong SQL Server.</p>
<div class="pitfall">"Công ty ta có mặt" nghĩa là "có phòng nào đó ở đấy", nên đáp án phải lấy từ tblDepLocation. Trả lời chỉ từ tblLocation sẽ ra đủ 4 thành phố — kể cả nơi công ty không có ai.</div>`],
      [39, 'What we do if a query involves two tuples of the same relation - Example 9',
        `<p class="y-chinh">🎯 When a condition compares two rows of the same table, list the table twice with two aliases (a self-join): Example 9 pairs two work records of the same project with different employees.</p>
<pre><code class="language-sql">/*9*/
SELECT distinct w1.proNum as 'Project Number'
FROM tblWorksOn w1, tblWorksOn w2
WHERE w1.proNum=w2.proNum AND w1.empSSN &lt;&gt; w2.empSSN
GO</code></pre>
<table>
<thead><tr><th>Project Number</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>2</td></tr>
<tr><td>3</td></tr>
<tr><td>4</td></tr>
<tr><td>5</td></tr>
</tbody>
</table>
<p>The pairs that survive WHERE, shown for projects 1 (3 members) and 4 (2 members):</p>
<pre><code class="language-sql">-- the pairs (w1, w2) that survive WHERE, for projects 1 and 4 only
SELECT w1.proNum, w1.empSSN AS w1_emp, w2.empSSN AS w2_emp
FROM tblWorksOn w1, tblWorksOn w2
WHERE w1.proNum = w2.proNum AND w1.empSSN &lt;&gt; w2.empSSN
  AND w1.proNum IN (1, 4)
ORDER BY w1.proNum, w1.empSSN, w2.empSSN;</code></pre>
<table>
<thead><tr><th>proNum</th><th>w1_emp</th><th>w2_emp</th></tr></thead>
<tbody>
<tr><td>1</td><td>30121050001</td><td>30121050002</td></tr>
<tr><td>1</td><td>30121050001</td><td>30121050003</td></tr>
<tr><td>1</td><td>30121050002</td><td>30121050001</td></tr>
<tr><td>1</td><td>30121050002</td><td>30121050003</td></tr>
<tr><td>1</td><td>30121050003</td><td>30121050001</td></tr>
<tr><td>1</td><td>30121050003</td><td>30121050002</td></tr>
<tr><td>4</td><td>30121050010</td><td>30121050012</td></tr>
<tr><td>4</td><td>30121050012</td><td>30121050010</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>What happens</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblWorksOn w1, tblWorksOn w2</td><td>16 × 16 pairs</td><td>256</td></tr>
<tr><td>2</td><td>WHERE w1.proNum = w2.proNum</td><td>both records on the same project</td><td>48</td></tr>
<tr><td>2</td><td>AND w1.empSSN &lt;&gt; w2.empSSN</td><td>two DIFFERENT people (a project with k members gives k·(k−1) pairs)</td><td>32</td></tr>
<tr><td>5</td><td>SELECT distinct w1.proNum</td><td>one row per project</td><td>5</td></tr>
</tbody>
</table>
<p>Project 6 has one member (no pair of different people) — it is the only one missing.</p>
<p class="dap-an">✅ The slide says "more than two members", but the code finds projects with <strong>at least two</strong> members (4 has exactly 2 and is listed). Really "more than two" = at least three different people → three copies; <code>&lt;</code> instead of <code>&lt;&gt;</code> also avoids counting the same trio 6 times:</p>
<pre><code class="language-sql">-- "more than two" = at least 3 different members: three copies of the table
SELECT DISTINCT w1.proNum AS [Project Number]
FROM tblWorksOn w1, tblWorksOn w2, tblWorksOn w3
WHERE w1.proNum = w2.proNum AND w2.proNum = w3.proNum
  AND w1.empSSN &lt; w2.empSSN AND w2.empSSN &lt; w3.empSSN;</code></pre>
<table>
<thead><tr><th>Project Number</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>2</td></tr>
<tr><td>3</td></tr>
<tr><td>5</td></tr>
</tbody>
</table>
<p>Lesson 6.D (GROUP BY … HAVING COUNT(*) &gt; 2) gives the short way.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the alias 'Project Number' in single quotes is a syntax error (slide 28); use double quotes. <code>ORDER BY 1</code> sorts by the first output column:
<pre><code class="language-sql">SELECT DISTINCT w1.proNum AS "Project Number"   -- 'Project Number' in single quotes is an error here
FROM tblWorksOn w1
JOIN tblWorksOn w2 ON w1.proNum = w2.proNum AND w1.empSSN &lt;&gt; w2.empSSN
ORDER BY 1;</code></pre>
<table>
<thead><tr><th>Project Number</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>2</td></tr>
<tr><td>3</td></tr>
<tr><td>4</td></tr>
<tr><td>5</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-3-multi-self-join">PostgreSQL 5.3 — multi-table and self joins</a>.</div>`,
        `<p class="y-chinh">🎯 Khi một điều kiện so sánh hai dòng của cùng một bảng, liệt kê bảng hai lần với hai bí danh (tự nối — self-join): Ví dụ 9 ghép hai bản ghi làm việc của cùng một dự án với hai nhân viên khác nhau.</p>
<pre><code class="language-sql">/*9*/
SELECT distinct w1.proNum as 'Project Number'
FROM tblWorksOn w1, tblWorksOn w2
WHERE w1.proNum=w2.proNum AND w1.empSSN &lt;&gt; w2.empSSN
GO</code></pre>
<table>
<thead><tr><th>Project Number</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>2</td></tr>
<tr><td>3</td></tr>
<tr><td>4</td></tr>
<tr><td>5</td></tr>
</tbody>
</table>
<p>Các cặp sống sót qua WHERE, xem cho dự án 1 (3 thành viên) và 4 (2 thành viên):</p>
<pre><code class="language-sql">-- các cặp (w1, w2) sống sót qua WHERE, chỉ xem dự án 1 và 4
SELECT w1.proNum, w1.empSSN AS w1_emp, w2.empSSN AS w2_emp
FROM tblWorksOn w1, tblWorksOn w2
WHERE w1.proNum = w2.proNum AND w1.empSSN &lt;&gt; w2.empSSN
  AND w1.proNum IN (1, 4)
ORDER BY w1.proNum, w1.empSSN, w2.empSSN;</code></pre>
<table>
<thead><tr><th>proNum</th><th>w1_emp</th><th>w2_emp</th></tr></thead>
<tbody>
<tr><td>1</td><td>30121050001</td><td>30121050002</td></tr>
<tr><td>1</td><td>30121050001</td><td>30121050003</td></tr>
<tr><td>1</td><td>30121050002</td><td>30121050001</td></tr>
<tr><td>1</td><td>30121050002</td><td>30121050003</td></tr>
<tr><td>1</td><td>30121050003</td><td>30121050001</td></tr>
<tr><td>1</td><td>30121050003</td><td>30121050002</td></tr>
<tr><td>4</td><td>30121050010</td><td>30121050012</td></tr>
<tr><td>4</td><td>30121050012</td><td>30121050010</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Chuyện gì xảy ra</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblWorksOn w1, tblWorksOn w2</td><td>16 × 16 cặp</td><td>256</td></tr>
<tr><td>2</td><td>WHERE w1.proNum = w2.proNum</td><td>hai bản ghi cùng một dự án</td><td>48</td></tr>
<tr><td>2</td><td>AND w1.empSSN &lt;&gt; w2.empSSN</td><td>hai người KHÁC nhau (dự án k thành viên cho k·(k−1) cặp)</td><td>32</td></tr>
<tr><td>5</td><td>SELECT distinct w1.proNum</td><td>mỗi dự án một dòng</td><td>5</td></tr>
</tbody>
</table>
<p>Dự án 6 chỉ có một thành viên (không có cặp hai người khác nhau) — nó là dự án duy nhất vắng mặt.</p>
<p class="dap-an">✅ Slide ghi "more than two members" (hơn hai thành viên), nhưng code tìm các dự án có <strong>ít nhất hai</strong> thành viên (dự án 4 có đúng 2 người vẫn được liệt kê). "Hơn hai" thật sự = ít nhất ba người khác nhau → ba bản sao; dùng <code>&lt;</code> thay cho <code>&lt;&gt;</code> còn tránh đếm cùng một bộ ba 6 lần:</p>
<pre><code class="language-sql">-- "hơn hai" = ít nhất 3 người khác nhau: ba bản sao của bảng
SELECT DISTINCT w1.proNum AS [Project Number]
FROM tblWorksOn w1, tblWorksOn w2, tblWorksOn w3
WHERE w1.proNum = w2.proNum AND w2.proNum = w3.proNum
  AND w1.empSSN &lt; w2.empSSN AND w2.empSSN &lt; w3.empSSN;</code></pre>
<table>
<thead><tr><th>Project Number</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>2</td></tr>
<tr><td>3</td></tr>
<tr><td>5</td></tr>
</tbody>
</table>
<p>Bài 6.D (GROUP BY … HAVING COUNT(*) &gt; 2) cho cách viết ngắn.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> bí danh 'Project Number' trong nháy đơn là lỗi cú pháp (slide 28); dùng nháy kép. <code>ORDER BY 1</code> sắp theo cột đầu ra thứ nhất:
<pre><code class="language-sql">SELECT DISTINCT w1.proNum AS "Project Number"   -- viết 'Project Number' nháy đơn là lỗi ở đây
FROM tblWorksOn w1
JOIN tblWorksOn w2 ON w1.proNum = w2.proNum AND w1.empSSN &lt;&gt; w2.empSSN
ORDER BY 1;</code></pre>
<table>
<thead><tr><th>Project Number</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>2</td></tr>
<tr><td>3</td></tr>
<tr><td>4</td></tr>
<tr><td>5</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-3-multi-self-join">PostgreSQL 5.3 — nối nhiều bảng và tự nối</a>.</div>`],
      [40, 'Union, Intersection, Difference of Queries',
        `<p class="y-chinh">🎯 UNION, INTERSECT and EXCEPT are the algebra's ∪, ∩ and −: they combine the results of two queries that have the same number of columns with compatible types.</p>
<table>
<thead><tr><th>SQL</th><th>Algebra</th><th>Keeps the rows that are…</th></tr></thead>
<tbody>
<tr><td>Q1 UNION Q2</td><td>∪</td><td>in Q1 or in Q2 (or both), each once</td></tr>
<tr><td>Q1 INTERSECT Q2</td><td>∩</td><td>in both Q1 and Q2</td></tr>
<tr><td>Q1 EXCEPT Q2</td><td>−</td><td>in Q1 but not in Q2 (order matters!)</td></tr>
</tbody>
</table>
<p>Execution order: each query is run completely on its own (FROM → WHERE → SELECT), then the two results are combined, then a final ORDER BY (if any) sorts the whole. The rules, tested:</p>
<pre><code class="language-sql">-- the two sides must have the same number of columns
SELECT empSSN, empName FROM tblEmployee
UNION
SELECT empSSN FROM tblDependent;
GO
-- the column names come from the FIRST query
SELECT empName AS personName, N'employee' AS kind FROM tblEmployee WHERE depNum = 4
UNION
SELECT depName, N'dependent' FROM tblDependent WHERE empSSN = 30121050001;
GO</code></pre>
<div class="out"><b>Msg 205, Level 16, State 1<br>
All queries combined using a UNION, INTERSECT or EXCEPT operator must have an equal number of expressions in their target lists.</b></div>
<table>
<thead><tr><th>personName</th><th>kind</th></tr></thead>
<tbody>
<tr><td>Huỳnh Văn Tài</td><td>employee</td></tr>
<tr><td>Phạm Thị Hoa</td><td>dependent</td></tr>
<tr><td>Trần Minh Khang</td><td>dependent</td></tr>
</tbody>
</table>
<ul>
<li>Msg 205: 2 columns vs 1 — the queries must have the same number of columns.</li>
<li>Columns are matched <strong>by position</strong>, not by name, and the result takes its column names from the <strong>first</strong> query (personName, kind).</li>
</ul>
<div class="pitfall">ORDER BY may appear only once, after the last query, and applies to the combined result. Writing ORDER BY inside the first query is a syntax error in SQL Server.</div>`,
        `<p class="y-chinh">🎯 UNION, INTERSECT và EXCEPT là ∪, ∩ và − của đại số: chúng kết hợp kết quả của hai câu truy vấn có cùng số cột và kiểu tương thích.</p>
<table>
<thead><tr><th>SQL</th><th>Đại số</th><th>Giữ các dòng…</th></tr></thead>
<tbody>
<tr><td>Q1 UNION Q2</td><td>∪ (hợp)</td><td>có trong Q1 hoặc Q2 (hoặc cả hai), mỗi dòng một lần</td></tr>
<tr><td>Q1 INTERSECT Q2</td><td>∩ (giao)</td><td>có trong cả Q1 và Q2</td></tr>
<tr><td>Q1 EXCEPT Q2</td><td>− (hiệu)</td><td>có trong Q1 mà không có trong Q2 (thứ tự quan trọng!)</td></tr>
</tbody>
</table>
<p>Thứ tự thực thi: mỗi câu chạy trọn vẹn riêng (FROM → WHERE → SELECT), rồi hai kết quả được kết hợp, rồi ORDER BY cuối cùng (nếu có) sắp cả khối. Các luật, chạy thử:</p>
<pre><code class="language-sql">-- hai vế phải có cùng số cột
SELECT empSSN, empName FROM tblEmployee
UNION
SELECT empSSN FROM tblDependent;
GO
-- tên cột lấy theo câu truy vấn THỨ NHẤT
SELECT empName AS personName, N'employee' AS kind FROM tblEmployee WHERE depNum = 4
UNION
SELECT depName, N'dependent' FROM tblDependent WHERE empSSN = 30121050001;
GO</code></pre>
<div class="out"><b>Msg 205, Level 16, State 1<br>
All queries combined using a UNION, INTERSECT or EXCEPT operator must have an equal number of expressions in their target lists.</b></div>
<table>
<thead><tr><th>personName</th><th>kind</th></tr></thead>
<tbody>
<tr><td>Huỳnh Văn Tài</td><td>employee</td></tr>
<tr><td>Phạm Thị Hoa</td><td>dependent</td></tr>
<tr><td>Trần Minh Khang</td><td>dependent</td></tr>
</tbody>
</table>
<ul>
<li>Msg 205: 2 cột với 1 cột — hai câu phải có cùng số cột.</li>
<li>Các cột được ghép <strong>theo vị trí</strong>, không theo tên, và kết quả lấy tên cột của câu <strong>thứ nhất</strong> (personName, kind).</li>
</ul>
<div class="pitfall">ORDER BY chỉ được viết một lần, sau câu cuối cùng, và áp dụng cho cả kết quả đã gộp. Viết ORDER BY bên trong câu thứ nhất là lỗi cú pháp trong SQL Server.</div>`],
      [41, 'Union - Example 10.1',
        `<p class="y-chinh">🎯 Example 10.1 finds the employees whose name begins with H OR whose salary exceeds 80000, as the UNION of two simple queries.</p>
<pre><code class="language-sql">/*10.1*/
SELECT * FROM tblEmployee WHERE empName LIKE 'H%'
UNION
SELECT * FROM tblEmployee WHERE empSalary &gt; 80000
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>102 Kim Mã, Ba Đình, TP Hà Nội</td><td>95000</td><td>M</td><td>1978-09-09</td><td>2</td><td>30121050001</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>33 Cầu Giấy, TP Hà Nội</td><td>72000</td><td>F</td><td>1988-12-01</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>5 Láng Hạ, Đống Đa, TP Hà Nội</td><td>105000</td><td>M</td><td>1970-04-18</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050020</td><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td><td>88000</td><td>F</td><td>1980-06-25</td><td>3</td><td>30121050001</td></tr>
<tr><td>30121050030</td><td>Huỳnh Văn Tài</td><td>9 Võ Văn Tần, Q.3, TP Hồ Chí Minh</td><td>70000</td><td>M</td><td>1975-10-10</td><td>4</td><td>30121050001</td></tr>
</tbody>
</table>
<p>The two sides separately, and the count before duplicates are removed:</p>
<pre><code class="language-sql">-- left side
SELECT empSSN, empName, empSalary FROM tblEmployee WHERE empName LIKE 'H%';
-- right side
SELECT empSSN, empName, empSalary FROM tblEmployee WHERE empSalary &gt; 80000;
-- UNION ALL keeps the duplicate, UNION removes it
SELECT COUNT(*) AS union_all_rows FROM (
  SELECT empSSN FROM tblEmployee WHERE empName LIKE 'H%'
  UNION ALL
  SELECT empSSN FROM tblEmployee WHERE empSalary &gt; 80000) AS t;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>30121050030</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>30121050020</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>union_all_rows</th></tr></thead>
<tbody>
<tr><td>8</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Step</th><th>Query</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>left: <code>empName LIKE 'H%'</code></td><td>3 (Hoàng Thị Hà, Hồ Ngọc Hân, Huỳnh Văn Tài)</td></tr>
<tr><td>2</td><td>right: <code>empSalary &gt; 80000</code></td><td>5</td></tr>
<tr><td>3</td><td>UNION ALL would give</td><td>8</td></tr>
<tr><td>4</td><td>UNION removes the duplicate (Hoàng Thị Hà is on both sides)</td><td>7</td></tr>
</tbody>
</table>
<p>The same rows come from one query with OR: <code>WHERE empName LIKE 'H%' OR empSalary &gt; 80000</code>. UNION becomes necessary when the two parts come from <strong>different tables</strong> (slide 40's employees + dependents).</p>
<p class="meo">🧠 "or" in the question → UNION or OR; "and" → INTERSECT or AND (within one row); "but not" → EXCEPT or NOT EXISTS.</p>`,
        `<p class="y-chinh">🎯 Ví dụ 10.1 tìm các nhân viên có tên bắt đầu bằng H HOẶC lương trên 80000, bằng phép UNION của hai câu đơn giản.</p>
<pre><code class="language-sql">/*10.1*/
SELECT * FROM tblEmployee WHERE empName LIKE 'H%'
UNION
SELECT * FROM tblEmployee WHERE empSalary &gt; 80000
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>102 Kim Mã, Ba Đình, TP Hà Nội</td><td>95000</td><td>M</td><td>1978-09-09</td><td>2</td><td>30121050001</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>33 Cầu Giấy, TP Hà Nội</td><td>72000</td><td>F</td><td>1988-12-01</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>5 Láng Hạ, Đống Đa, TP Hà Nội</td><td>105000</td><td>M</td><td>1970-04-18</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050020</td><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td><td>88000</td><td>F</td><td>1980-06-25</td><td>3</td><td>30121050001</td></tr>
<tr><td>30121050030</td><td>Huỳnh Văn Tài</td><td>9 Võ Văn Tần, Q.3, TP Hồ Chí Minh</td><td>70000</td><td>M</td><td>1975-10-10</td><td>4</td><td>30121050001</td></tr>
</tbody>
</table>
<p>Hai vế tách riêng, và số dòng trước khi bỏ bản trùng:</p>
<pre><code class="language-sql">-- vế trái
SELECT empSSN, empName, empSalary FROM tblEmployee WHERE empName LIKE 'H%';
-- vế phải
SELECT empSSN, empName, empSalary FROM tblEmployee WHERE empSalary &gt; 80000;
-- UNION ALL giữ bản trùng, UNION bỏ nó
SELECT COUNT(*) AS union_all_rows FROM (
  SELECT empSSN FROM tblEmployee WHERE empName LIKE 'H%'
  UNION ALL
  SELECT empSSN FROM tblEmployee WHERE empSalary &gt; 80000) AS t;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>30121050030</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>30121050020</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>union_all_rows</th></tr></thead>
<tbody>
<tr><td>8</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Bước</th><th>Câu truy vấn</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>vế trái: <code>empName LIKE 'H%'</code></td><td>3 (Hoàng Thị Hà, Hồ Ngọc Hân, Huỳnh Văn Tài)</td></tr>
<tr><td>2</td><td>vế phải: <code>empSalary &gt; 80000</code></td><td>5</td></tr>
<tr><td>3</td><td>UNION ALL sẽ cho</td><td>8</td></tr>
<tr><td>4</td><td>UNION bỏ bản trùng (Hoàng Thị Hà có ở cả hai vế)</td><td>7</td></tr>
</tbody>
</table>
<p>Cùng các dòng đó có thể lấy bằng một câu với OR: <code>WHERE empName LIKE 'H%' OR empSalary &gt; 80000</code>. UNION trở nên cần thiết khi hai phần đến từ <strong>hai bảng khác nhau</strong> (nhân viên + người thân ở slide 40).</p>
<p class="meo">🧠 Đề nói "hoặc" → UNION hoặc OR; "và" → INTERSECT hoặc AND (trong cùng một dòng); "nhưng không" → EXCEPT hoặc NOT EXISTS.</p>`],
      [42, 'Difference - Example 10.2',
        `<p class="y-chinh">🎯 Example 10.2 finds the "normal" employees — those who supervise nobody — as all SSNs EXCEPT the SSNs that appear as someone's supervisor.</p>
<pre><code class="language-sql">/*10.2*/
SELECT empSSN FROM tblEmployee
EXCEPT
SELECT supervisorSSN FROM tblEmployee
GO</code></pre>
<table>
<thead><tr><th>empSSN</th></tr></thead>
<tbody>
<tr><td>30121050003</td></tr>
<tr><td>30121050004</td></tr>
<tr><td>30121050005</td></tr>
<tr><td>30121050011</td></tr>
<tr><td>30121050012</td></tr>
<tr><td>30121050021</td></tr>
<tr><td>30121050027</td></tr>
<tr><td>30121050030</td></tr>
<tr><td>30121050038</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Step</th><th>Query</th><th>Result</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>SELECT empSSN FROM tblEmployee</code></td><td>14 SSNs</td></tr>
<tr><td>2</td><td><code>SELECT supervisorSSN FROM tblEmployee</code></td><td>001, 002, 010, 020, 037 (+ one NULL for the director)</td></tr>
<tr><td>3</td><td>EXCEPT</td><td>14 − 5 = 9 employees</td></tr>
</tbody>
</table>
<p>Now the "same" idea with NOT IN — a very common way students write it:</p>
<pre><code class="language-sql">-- the same idea with NOT IN: 0 rows! (supervisorSSN contains a NULL)
SELECT empSSN FROM tblEmployee
WHERE empSSN NOT IN (SELECT supervisorSSN FROM tblEmployee);
-- fixed: drop the NULLs inside
SELECT COUNT(*) AS normal_employees FROM tblEmployee
WHERE empSSN NOT IN (SELECT supervisorSSN FROM tblEmployee WHERE supervisorSSN IS NOT NULL);
-- or NOT EXISTS, which is safe with NULL
SELECT COUNT(*) AS normal_employees FROM tblEmployee e
WHERE NOT EXISTS (SELECT * FROM tblEmployee s WHERE s.supervisorSSN = e.empSSN);</code></pre>
<table>
<thead><tr><th>empSSN</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>normal_employees</th></tr></thead>
<tbody>
<tr><td>9</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>normal_employees</th></tr></thead>
<tbody>
<tr><td>9</td></tr>
</tbody>
</table>
<p>Why 0 rows? <code>x NOT IN (001, 002, …, NULL)</code> means <code>x &lt;&gt; 001 AND … AND x &lt;&gt; NULL</code>; the last comparison is UNKNOWN, so the whole condition is never TRUE (NULL logic, lesson 5.A). EXCEPT compares rows, treating NULL = NULL, so it does not have this problem; NOT EXISTS does not either.</p>
<div class="pitfall">NOT IN over a column that can contain NULL returns nothing, without any error. In the PE use NOT EXISTS, or add <code>WHERE col IS NOT NULL</code> inside the subquery. This is also a favourite interview question.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 10.2 tìm các nhân viên "thường" — người không giám sát ai — bằng mọi SSN TRỪ ĐI (EXCEPT) các SSN xuất hiện với vai trò người giám sát của ai đó.</p>
<pre><code class="language-sql">/*10.2*/
SELECT empSSN FROM tblEmployee
EXCEPT
SELECT supervisorSSN FROM tblEmployee
GO</code></pre>
<table>
<thead><tr><th>empSSN</th></tr></thead>
<tbody>
<tr><td>30121050003</td></tr>
<tr><td>30121050004</td></tr>
<tr><td>30121050005</td></tr>
<tr><td>30121050011</td></tr>
<tr><td>30121050012</td></tr>
<tr><td>30121050021</td></tr>
<tr><td>30121050027</td></tr>
<tr><td>30121050030</td></tr>
<tr><td>30121050038</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Bước</th><th>Câu truy vấn</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>SELECT empSSN FROM tblEmployee</code></td><td>14 SSN</td></tr>
<tr><td>2</td><td><code>SELECT supervisorSSN FROM tblEmployee</code></td><td>001, 002, 010, 020, 037 (+ một NULL của giám đốc)</td></tr>
<tr><td>3</td><td>EXCEPT</td><td>14 − 5 = 9 nhân viên</td></tr>
</tbody>
</table>
<p>Giờ viết "cùng" ý đó bằng NOT IN — cách sinh viên rất hay viết:</p>
<pre><code class="language-sql">-- cùng ý đó bằng NOT IN: 0 dòng! (supervisorSSN có một NULL)
SELECT empSSN FROM tblEmployee
WHERE empSSN NOT IN (SELECT supervisorSSN FROM tblEmployee);
-- sửa: bỏ NULL ở bên trong
SELECT COUNT(*) AS normal_employees FROM tblEmployee
WHERE empSSN NOT IN (SELECT supervisorSSN FROM tblEmployee WHERE supervisorSSN IS NOT NULL);
-- hoặc NOT EXISTS, an toàn với NULL
SELECT COUNT(*) AS normal_employees FROM tblEmployee e
WHERE NOT EXISTS (SELECT * FROM tblEmployee s WHERE s.supervisorSSN = e.empSSN);</code></pre>
<table>
<thead><tr><th>empSSN</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>normal_employees</th></tr></thead>
<tbody>
<tr><td>9</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>normal_employees</th></tr></thead>
<tbody>
<tr><td>9</td></tr>
</tbody>
</table>
<p>Vì sao 0 dòng? <code>x NOT IN (001, 002, …, NULL)</code> nghĩa là <code>x &lt;&gt; 001 AND … AND x &lt;&gt; NULL</code>; phép so cuối là UNKNOWN, nên cả điều kiện không bao giờ TRUE (logic của NULL, bài 5.A). EXCEPT so sánh cả dòng và coi NULL = NULL, nên không bị lỗi này; NOT EXISTS cũng vậy.</p>
<div class="pitfall">NOT IN trên một cột có thể chứa NULL sẽ trả về rỗng, không báo lỗi gì. Trong bài PE hãy dùng NOT EXISTS, hoặc thêm <code>WHERE cột IS NOT NULL</code> trong câu con. Đây cũng là câu hỏi phỏng vấn rất được ưa chuộng.</div>`],
      [43, 'Intersection - Example 10.3',
        `<p class="y-chinh">🎯 Example 10.3 finds the employees who work on ProjectB AND on ProjectC: the INTERSECT of "who works on B" and "who works on C".</p>
<pre><code class="language-sql">/*10.3*/
SELECT empSSN
FROM tblWorksOn w, tblProject p
WHERE w.proNum=p.proNum AND p.proName='ProjectB'
INTERSECT
SELECT empSSN
FROM tblWorksOn w, tblProject p
WHERE w.proNum=p.proNum AND p.proName='ProjectC'
GO</code></pre>
<table>
<thead><tr><th>empSSN</th></tr></thead>
<tbody>
<tr><td>30121050003</td></tr>
<tr><td>30121050005</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Step</th><th>Query</th><th>Result</th></tr></thead>
<tbody>
<tr><td>1</td><td>empSSN of ProjectB (join tblWorksOn–tblProject, proName = 'ProjectB')</td><td>003, 004, 005</td></tr>
<tr><td>2</td><td>empSSN of ProjectC</td><td>003, 005, 011, 012</td></tr>
<tr><td>3</td><td>INTERSECT</td><td>003, 005</td></tr>
</tbody>
</table>
<p>The tempting wrong answer puts both names in one WHERE:</p>
<pre><code class="language-sql">-- WRONG: one row cannot be ProjectB and ProjectC at the same time
SELECT w.empSSN
FROM tblWorksOn w, tblProject p
WHERE w.proNum = p.proNum AND p.proName = 'ProjectB' AND p.proName = 'ProjectC';</code></pre>
<table>
<thead><tr><th>empSSN</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td></tr>
</tbody>
</table>
<p>WHERE looks at <strong>one row at a time</strong>, and one row has one proName — it cannot equal 'ProjectB' and 'ProjectC' at once, so the result is empty. "Works on B and on C" is a condition on <strong>two different rows</strong> of tblWorksOn: INTERSECT, a self-join, or <code>IN … AND IN …</code> solve it.</p>
<div class="pitfall">Check the INTERSECT columns: intersect on <code>empSSN</code> only. If you also select <code>proNum</code> or <code>proName</code>, the rows (003, B) and (003, C) are different and the intersection becomes empty.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 10.3 tìm các nhân viên làm ProjectB VÀ làm ProjectC: phép giao (INTERSECT) của "ai làm B" và "ai làm C".</p>
<pre><code class="language-sql">/*10.3*/
SELECT empSSN
FROM tblWorksOn w, tblProject p
WHERE w.proNum=p.proNum AND p.proName='ProjectB'
INTERSECT
SELECT empSSN
FROM tblWorksOn w, tblProject p
WHERE w.proNum=p.proNum AND p.proName='ProjectC'
GO</code></pre>
<table>
<thead><tr><th>empSSN</th></tr></thead>
<tbody>
<tr><td>30121050003</td></tr>
<tr><td>30121050005</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Bước</th><th>Câu truy vấn</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>1</td><td>empSSN của ProjectB (nối tblWorksOn–tblProject, proName = 'ProjectB')</td><td>003, 004, 005</td></tr>
<tr><td>2</td><td>empSSN của ProjectC</td><td>003, 005, 011, 012</td></tr>
<tr><td>3</td><td>INTERSECT</td><td>003, 005</td></tr>
</tbody>
</table>
<p>Đáp án sai hấp dẫn nhất đặt cả hai tên vào một WHERE:</p>
<pre><code class="language-sql">-- SAI: một dòng không thể vừa là ProjectB vừa là ProjectC
SELECT w.empSSN
FROM tblWorksOn w, tblProject p
WHERE w.proNum = p.proNum AND p.proName = 'ProjectB' AND p.proName = 'ProjectC';</code></pre>
<table>
<thead><tr><th>empSSN</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td></tr>
</tbody>
</table>
<p>WHERE nhìn <strong>từng dòng một</strong>, mà một dòng chỉ có một proName — không thể vừa bằng 'ProjectB' vừa bằng 'ProjectC', nên kết quả rỗng. "Làm B và làm C" là điều kiện trên <strong>hai dòng khác nhau</strong> của tblWorksOn: INTERSECT, tự nối, hoặc <code>IN … AND IN …</code> đều giải được.</p>
<div class="pitfall">Kiểm các cột của INTERSECT: chỉ giao theo <code>empSSN</code>. Nếu chọn thêm <code>proNum</code> hay <code>proName</code>, các dòng (003, B) và (003, C) khác nhau và phép giao thành rỗng.</div>`],
      [44, '6.3 Sub queries',
        `<p class="y-chinh">🎯 Section 6.3 of the deck: subqueries — a query written inside another query.</p>
<p>Slides 45–57 cover the three places a subquery can stand (as one value, as a set in WHERE, as a table in FROM) and the special case of a subquery that depends on the outer row (correlated). The old lesson 6.4 on this website ("Nested queries: IN, EXISTS, ANY, ALL &amp; NULL logic") is good extra reading after this part.</p>`,
        `<p class="y-chinh">🎯 Mục 6.3 của bộ slide: truy vấn con (subquery) — một câu truy vấn viết bên trong một câu khác.</p>
<p>Slide 45–57 nói về ba chỗ truy vấn con có thể đứng (như một giá trị, như một tập trong WHERE, như một bảng trong FROM) và trường hợp đặc biệt khi câu con phụ thuộc vào dòng bên ngoài (tương quan — correlated). Bài 6.4 cũ trên web ("Truy vấn lồng: IN, EXISTS, ANY, ALL &amp; lô-gic NULL") là tài liệu đọc thêm tốt sau phần này.</p>`],
      [45, 'Sub-queries',
        `<p class="y-chinh">🎯 A subquery is a query that helps evaluate another one; it can return a single constant (compared in WHERE), a relation (tested in WHERE), or be used as a table in FROM with an alias.</p>
<pre><code class="language-sql">-- (1) in WHERE, returning ONE value
SELECT empName, empSalary FROM tblEmployee
WHERE empSalary &gt; (SELECT AVG(empSalary) FROM tblEmployee);
-- (2) in WHERE, returning a SET of values
SELECT proName FROM tblProject
WHERE depNum IN (SELECT depNum FROM tblDepLocation WHERE locNum = 3);
-- (3) in FROM, with a tuple-variable alias
SELECT t.depNum, t.n FROM (SELECT depNum, COUNT(*) AS n FROM tblEmployee GROUP BY depNum) AS t
WHERE t.n &gt;= 3;</code></pre>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>88000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>proName</th></tr></thead>
<tbody>
<tr><td>ProjectE</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>n</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td></tr>
<tr><td>2</td><td>4</td></tr>
<tr><td>3</td><td>3</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>#</th><th>Where</th><th>Returns</th><th>Used with</th><th>Here</th></tr></thead>
<tbody>
<tr><td>1</td><td>WHERE</td><td>one value (a scalar)</td><td>= &lt; &gt; …</td><td>salary above the company average (73214.29): 5 people</td></tr>
<tr><td>2</td><td>WHERE</td><td>a set (one column, many rows)</td><td>IN, EXISTS, ANY, ALL</td><td>projects of the departments located in city 3</td></tr>
<tr><td>3</td><td>FROM</td><td>a table</td><td>an alias (<code>AS t</code>)</td><td>departments with at least 3 employees</td></tr>
</tbody>
</table>
<p>Execution: an ordinary (non-correlated) subquery is evaluated <strong>first and once</strong>; its result is then used like a constant, a list, or a table by the outer query.</p>
<p class="meo">🧠 To read a nested query, cover the outer part with your hand, run the inner query in your head, write its result on paper, then read the outer query with that result in place.</p>`,
        `<p class="y-chinh">🎯 Truy vấn con là một câu truy vấn giúp tính một câu khác; nó có thể trả về một hằng duy nhất (đem so trong WHERE), một quan hệ (đem kiểm trong WHERE), hoặc được dùng như một bảng trong FROM kèm bí danh.</p>
<pre><code class="language-sql">-- (1) trong WHERE, trả về MỘT giá trị
SELECT empName, empSalary FROM tblEmployee
WHERE empSalary &gt; (SELECT AVG(empSalary) FROM tblEmployee);
-- (2) trong WHERE, trả về một TẬP giá trị
SELECT proName FROM tblProject
WHERE depNum IN (SELECT depNum FROM tblDepLocation WHERE locNum = 3);
-- (3) trong FROM, có bí danh biến bộ
SELECT t.depNum, t.n FROM (SELECT depNum, COUNT(*) AS n FROM tblEmployee GROUP BY depNum) AS t
WHERE t.n &gt;= 3;</code></pre>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>88000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>proName</th></tr></thead>
<tbody>
<tr><td>ProjectE</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>n</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td></tr>
<tr><td>2</td><td>4</td></tr>
<tr><td>3</td><td>3</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>#</th><th>Ở đâu</th><th>Trả về</th><th>Dùng với</th><th>Ở đây</th></tr></thead>
<tbody>
<tr><td>1</td><td>WHERE</td><td>một giá trị (vô hướng — scalar)</td><td>= &lt; &gt; …</td><td>lương trên mức trung bình công ty (73214,29): 5 người</td></tr>
<tr><td>2</td><td>WHERE</td><td>một tập (một cột, nhiều dòng)</td><td>IN, EXISTS, ANY, ALL</td><td>dự án của các phòng đặt ở thành phố 3</td></tr>
<tr><td>3</td><td>FROM</td><td>một bảng</td><td>bí danh (<code>AS t</code>)</td><td>các phòng có ít nhất 3 nhân viên</td></tr>
</tbody>
</table>
<p>Thực thi: truy vấn con thường (không tương quan) được tính <strong>trước tiên và một lần</strong>; kết quả của nó rồi được câu ngoài dùng như một hằng, một danh sách, hay một bảng.</p>
<p class="meo">🧠 Để đọc câu lồng nhau, lấy tay che phần ngoài, chạy câu trong trong đầu, ghi kết quả ra giấy, rồi đọc câu ngoài với kết quả đó thay vào.</p>`],
      [46, 'Sub-queries that Produce Scalar Values',
        `<p class="y-chinh">🎯 A scalar is one atomic value (one row, one column); a subquery that returns a scalar can stand wherever a constant can — the slide then compares two ways to answer the same request.</p>
<p>Query 1 of slide 45 is the model: <code>(SELECT AVG(empSalary) FROM tblEmployee)</code> returns one number, so <code>empSalary &gt; ( … )</code> is just <code>empSalary &gt; 73214.285714</code>. You could not write that number yourself in advance — it changes whenever the data changes — which is exactly why a subquery is useful.</p>
<p>Slides 47–50 answer the same question, "the employees of Phòng Phần mềm trong nước", first with a join (Example 7), then with a scalar subquery (Example 11) in three spellings.</p>
<div class="pitfall">A scalar subquery must really return <strong>one</strong> row. Zero rows gives NULL (the comparison becomes UNKNOWN → no row); two or more rows gives error 512 (slide 48).</div>`,
        `<p class="y-chinh">🎯 Giá trị vô hướng (scalar) là một giá trị nguyên tố (một dòng, một cột); truy vấn con trả về một giá trị vô hướng đứng được ở mọi chỗ mà một hằng đứng được — rồi slide so hai cách trả lời cùng một yêu cầu.</p>
<p>Câu 1 ở slide 45 là mẫu: <code>(SELECT AVG(empSalary) FROM tblEmployee)</code> trả về một con số, nên <code>empSalary &gt; ( … )</code> chỉ là <code>empSalary &gt; 73214.285714</code>. Bạn không thể tự viết sẵn con số đó — nó đổi mỗi khi dữ liệu đổi — và đó chính là lý do truy vấn con có ích.</p>
<p>Slide 47–50 trả lời cùng một câu hỏi, "nhân viên của Phòng Phần mềm trong nước", trước bằng phép nối (Ví dụ 7), sau bằng truy vấn con vô hướng (Ví dụ 11) theo ba cách viết.</p>
<div class="pitfall">Truy vấn con vô hướng phải thật sự trả về <strong>một</strong> dòng. Không dòng nào thì ra NULL (phép so thành UNKNOWN → không dòng nào); hai dòng trở lên thì lỗi 512 (slide 48).</div>`],
      [47, 'Sub-queries that Produce Scalar Values - Example 7 again',
        `<p class="y-chinh">🎯 Example 7 again — the join version — as the first of the two ways to find the employees of Phòng Phần mềm trong nước.</p>
<pre><code class="language-sql">/*7*/
SELECT *
FROM tblEmployee E, tblDepartment D
WHERE e.depNum=d.depNum AND d.depName LIKE N'Phòng phần mềm trong nước';
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th><th>depNum</th><th>depName</th><th>mgrSSN</th><th>mgrAssDate</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
</tbody>
</table>
<p>Recap of slide 35: FROM makes 70 pairs, WHERE keeps the 14 matching pairs and then the 4 of department 1, SELECT * shows the 12 columns of both tables.</p>
<table>
<thead><tr><th></th><th>Join (Example 7)</th><th>Subquery (Example 11)</th></tr></thead>
<tbody>
<tr><td>Tables in FROM</td><td>tblEmployee and tblDepartment</td><td>only tblEmployee</td></tr>
<tr><td>Columns you can show</td><td>of both tables (depName too)</td><td>only of tblEmployee</td></tr>
<tr><td>Duplicates</td><td>a row repeats if it matches several rows on the other side</td><td>never — each employee is tested once</td></tr>
</tbody>
</table>
<p class="meo">🧠 Need a column of the second table in the output? Join. Only need it to <strong>test</strong> a condition? A subquery reads more naturally.</p>`,
        `<p class="y-chinh">🎯 Lại là Ví dụ 7 — bản dùng phép nối — làm cách thứ nhất trong hai cách tìm nhân viên Phòng Phần mềm trong nước.</p>
<pre><code class="language-sql">/*7*/
SELECT *
FROM tblEmployee E, tblDepartment D
WHERE e.depNum=d.depNum AND d.depName LIKE N'Phòng phần mềm trong nước';
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th><th>depNum</th><th>depName</th><th>mgrSSN</th><th>mgrAssDate</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td></tr>
</tbody>
</table>
<p>Nhắc lại slide 35: FROM tạo 70 cặp, WHERE giữ 14 cặp khớp rồi 4 cặp của phòng 1, SELECT * cho xem 12 cột của cả hai bảng.</p>
<table>
<thead><tr><th></th><th>Phép nối (Ví dụ 7)</th><th>Truy vấn con (Ví dụ 11)</th></tr></thead>
<tbody>
<tr><td>Bảng trong FROM</td><td>tblEmployee và tblDepartment</td><td>chỉ tblEmployee</td></tr>
<tr><td>Cột hiện được</td><td>của cả hai bảng (cả depName)</td><td>chỉ của tblEmployee</td></tr>
<tr><td>Bản trùng</td><td>một dòng bị lặp nếu khớp nhiều dòng bên kia</td><td>không bao giờ — mỗi nhân viên được thử một lần</td></tr>
</tbody>
</table>
<p class="meo">🧠 Cần một cột của bảng thứ hai trong kết quả? Dùng phép nối. Chỉ cần nó để <strong>kiểm</strong> một điều kiện? Truy vấn con đọc tự nhiên hơn.</p>`],
      [48, 'Sub-queries that Produce Scalar Values - Example 11 with =',
        `<p class="y-chinh">🎯 Example 11 finds the same employees with a scalar subquery: <code>depNum = (SELECT depNum FROM tblDepartment WHERE depName = N'…')</code>.</p>
<pre><code class="language-sql">/*11*/
SELECT *
FROM tblEmployee
WHERE depNum = (SELECT depNum
                FROM tblDepartment
                WHERE depName=N'Phòng Phần mềm trong nước')
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Part</th><th>What happens</th><th>Result</th></tr></thead>
<tbody>
<tr><td>1</td><td>inner query</td><td>find the number of that department</td><td>1 (one value)</td></tr>
<tr><td>2</td><td>outer FROM tblEmployee</td><td>whole table</td><td>14 rows</td></tr>
<tr><td>3</td><td>outer WHERE depNum = 1</td><td>the subquery is now a constant</td><td>4 rows</td></tr>
<tr><td>4</td><td>SELECT *</td><td>only the 8 columns of tblEmployee</td><td>4 rows</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- step 1: the inner query alone -&gt; one value
SELECT depNum FROM tblDepartment WHERE depName = N'Phòng Phần mềm trong nước';</code></pre>
<table>
<thead><tr><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
</tbody>
</table>
<p>It works because department names are unique (the constraint uq_department_name), so the inner query can never return two rows. When it can, <code>=</code> breaks:</p>
<pre><code class="language-sql">-- the inner query now returns TWO departments (1 and 2)
SELECT empName
FROM tblEmployee
WHERE depNum = (SELECT depNum FROM tblDepartment WHERE depName LIKE N'Phòng Phần mềm%');
GO</code></pre>
<table>
<thead><tr><th>empName</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 512, Level 16, State 1<br>
Subquery returned more than 1 value. This is not permitted when the subquery follows =, !=, &lt;, &lt;= , &gt;, &gt;= or when the subquery is used as an expression.</b></div>
<div class="pitfall">Msg 512 in the PE usually means "you used = where the subquery may return several rows". Fix: <code>IN</code> (slide 50) — or make sure the subquery filters on a key.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 11 tìm đúng những nhân viên đó bằng truy vấn con vô hướng: <code>depNum = (SELECT depNum FROM tblDepartment WHERE depName = N'…')</code>.</p>
<pre><code class="language-sql">/*11*/
SELECT *
FROM tblEmployee
WHERE depNum = (SELECT depNum
                FROM tblDepartment
                WHERE depName=N'Phòng Phần mềm trong nước')
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Phần</th><th>Chuyện gì xảy ra</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>1</td><td>câu trong</td><td>tìm số của phòng đó</td><td>1 (một giá trị)</td></tr>
<tr><td>2</td><td>FROM ngoài tblEmployee</td><td>cả bảng</td><td>14 dòng</td></tr>
<tr><td>3</td><td>WHERE ngoài depNum = 1</td><td>câu con giờ là một hằng</td><td>4 dòng</td></tr>
<tr><td>4</td><td>SELECT *</td><td>chỉ 8 cột của tblEmployee</td><td>4 dòng</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- bước 1: riêng câu trong -&gt; một giá trị
SELECT depNum FROM tblDepartment WHERE depName = N'Phòng Phần mềm trong nước';</code></pre>
<table>
<thead><tr><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
</tbody>
</table>
<p>Chạy được vì tên phòng là duy nhất (ràng buộc uq_department_name), nên câu trong không bao giờ trả về hai dòng. Khi nó có thể trả hai dòng thì <code>=</code> vỡ:</p>
<pre><code class="language-sql">-- câu trong lúc này trả về HAI phòng (1 và 2)
SELECT empName
FROM tblEmployee
WHERE depNum = (SELECT depNum FROM tblDepartment WHERE depName LIKE N'Phòng Phần mềm%');
GO</code></pre>
<table>
<thead><tr><th>empName</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 512, Level 16, State 1<br>
Subquery returned more than 1 value. This is not permitted when the subquery follows =, !=, &lt;, &lt;= , &gt;, &gt;= or when the subquery is used as an expression.</b></div>
<div class="pitfall">Msg 512 trong bài PE thường nghĩa là "bạn dùng = ở chỗ câu con có thể trả về nhiều dòng". Sửa: dùng <code>IN</code> (slide 50) — hoặc bảo đảm câu con lọc theo khoá.</div>`],
      [49, 'Sub-queries - Example 11 with =ANY',
        `<p class="y-chinh">🎯 The same Example 11 with <code>= ANY</code>: TRUE when depNum equals at least one value returned by the subquery.</p>
<pre><code class="language-sql">SELECT  *
FROM    tblEmployee
WHERE   depNum =ANY (SELECT depNum
                     FROM tblDepartment
                     WHERE depName=N'Phòng Phần mềm trong nước')
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<p>With a one-value subquery, <code>= ANY (1)</code> is the same as <code>= 1</code>: same 4 rows. The difference appears when the subquery returns several values — where <code>=</code> raised error 512, <code>= ANY</code> simply tests each value:</p>
<pre><code class="language-sql">-- =ANY does not break when the inner query returns 2 values
SELECT empName, depNum
FROM tblEmployee
WHERE depNum = ANY (SELECT depNum FROM tblDepartment WHERE depName LIKE N'Phòng Phần mềm%')
ORDER BY depNum, empName;</code></pre>
<table>
<thead><tr><th>empName</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>1</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>1</td></tr>
<tr><td>Trần Minh Quang</td><td>1</td></tr>
<tr><td>Võ Việt Anh</td><td>1</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>2</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>2</td></tr>
<tr><td>Mai Duy An</td><td>2</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Part</th><th>Result</th></tr></thead>
<tbody>
<tr><td>1</td><td>inner: departments whose name starts with "Phòng Phần mềm"</td><td>{1, 2}</td></tr>
<tr><td>2</td><td>outer WHERE depNum = ANY {1, 2}</td><td>depNum = 1 OR depNum = 2 → 8 rows</td></tr>
</tbody>
</table>
<p class="meo">🧠 <code>= ANY</code> ≡ <code>IN</code>. <code>&lt;&gt; ANY</code> does NOT mean "not in" — it is TRUE as soon as the value differs from one element (almost always). "Not in" is <code>&lt;&gt; ALL</code> ≡ <code>NOT IN</code>.</p>`,
        `<p class="y-chinh">🎯 Cùng Ví dụ 11 viết với <code>= ANY</code>: TRUE khi depNum bằng ít nhất một giá trị mà câu con trả về.</p>
<pre><code class="language-sql">SELECT  *
FROM    tblEmployee
WHERE   depNum =ANY (SELECT depNum
                     FROM tblDepartment
                     WHERE depName=N'Phòng Phần mềm trong nước')
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<p>Với câu con một giá trị, <code>= ANY (1)</code> giống hệt <code>= 1</code>: cùng 4 dòng. Khác biệt lộ ra khi câu con trả về nhiều giá trị — chỗ <code>=</code> báo lỗi 512 thì <code>= ANY</code> chỉ việc thử từng giá trị:</p>
<pre><code class="language-sql">-- =ANY không vỡ khi câu trong trả về 2 giá trị
SELECT empName, depNum
FROM tblEmployee
WHERE depNum = ANY (SELECT depNum FROM tblDepartment WHERE depName LIKE N'Phòng Phần mềm%')
ORDER BY depNum, empName;</code></pre>
<table>
<thead><tr><th>empName</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>1</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>1</td></tr>
<tr><td>Trần Minh Quang</td><td>1</td></tr>
<tr><td>Võ Việt Anh</td><td>1</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>2</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>2</td></tr>
<tr><td>Mai Duy An</td><td>2</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Phần</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>1</td><td>câu trong: các phòng có tên bắt đầu "Phòng Phần mềm"</td><td>{1, 2}</td></tr>
<tr><td>2</td><td>WHERE ngoài depNum = ANY {1, 2}</td><td>depNum = 1 OR depNum = 2 → 8 dòng</td></tr>
</tbody>
</table>
<p class="meo">🧠 <code>= ANY</code> ≡ <code>IN</code>. <code>&lt;&gt; ANY</code> KHÔNG có nghĩa "không nằm trong" — nó TRUE ngay khi giá trị khác một phần tử nào đó (gần như luôn luôn). "Không nằm trong" là <code>&lt;&gt; ALL</code> ≡ <code>NOT IN</code>.</p>`],
      [50, 'Sub-queries - Example 11 with IN',
        `<p class="y-chinh">🎯 The third spelling of Example 11 uses IN — the one to prefer, because it works for one value or many.</p>
<pre><code class="language-sql">SELECT  *
FROM    tblEmployee
WHERE   depNum IN (SELECT depNum
                   FROM tblDepartment
                   WHERE depName=N'Phòng Phần mềm trong nước')
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Spelling</th><th>Subquery returns 1 value</th><th>returns several values</th><th>returns 0 values</th></tr></thead>
<tbody>
<tr><td><code>depNum = (…)</code></td><td>works</td><td>error 512</td><td>NULL → 0 rows</td></tr>
<tr><td><code>depNum = ANY (…)</code></td><td>works</td><td>works</td><td>FALSE → 0 rows</td></tr>
<tr><td><code>depNum IN (…)</code></td><td>works</td><td>works</td><td>FALSE → 0 rows</td></tr>
</tbody>
</table>
<p>All three give the same 4 rows here. Execution order is the same for all: inner query once → set {1} → outer FROM → WHERE tests each employee → SELECT.</p>
<div class="pitfall">IN's evil twin is NOT IN with a NULL inside (slide 42): 0 rows. <code>IN</code> itself is safe with NULLs in the list; only the negation breaks.</div>`,
        `<p class="y-chinh">🎯 Cách viết thứ ba của Ví dụ 11 dùng IN — cách nên dùng, vì nó chạy với một giá trị hay nhiều giá trị đều được.</p>
<pre><code class="language-sql">SELECT  *
FROM    tblEmployee
WHERE   depNum IN (SELECT depNum
                   FROM tblDepartment
                   WHERE depName=N'Phòng Phần mềm trong nước')
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Cách viết</th><th>Câu con trả 1 giá trị</th><th>trả nhiều giá trị</th><th>trả 0 giá trị</th></tr></thead>
<tbody>
<tr><td><code>depNum = (…)</code></td><td>chạy</td><td>lỗi 512</td><td>NULL → 0 dòng</td></tr>
<tr><td><code>depNum = ANY (…)</code></td><td>chạy</td><td>chạy</td><td>FALSE → 0 dòng</td></tr>
<tr><td><code>depNum IN (…)</code></td><td>chạy</td><td>chạy</td><td>FALSE → 0 dòng</td></tr>
</tbody>
</table>
<p>Cả ba cho cùng 4 dòng ở đây. Thứ tự thực thi như nhau: câu trong chạy một lần → tập {1} → FROM ngoài → WHERE thử từng nhân viên → SELECT.</p>
<div class="pitfall">"Anh em sinh đôi xấu tính" của IN là NOT IN có NULL bên trong (slide 42): 0 dòng. Bản thân <code>IN</code> an toàn khi danh sách có NULL; chỉ phép phủ định mới vỡ.</div>`],
      [51, 'Conditions Involving Relations',
        `<p class="y-chinh">🎯 Four operators turn a relation R into TRUE/FALSE: EXISTS R (R is not empty), s IN R (s equals some value of R), s &gt; ALL R (s beats every value), s &gt; ANY R (s beats at least one value).</p>
<pre><code class="language-sql">-- EXISTS: departments that control at least one project
SELECT d.depNum, d.depName FROM tblDepartment d
WHERE EXISTS (SELECT * FROM tblProject p WHERE p.depNum = d.depNum);
-- &gt; ALL: earns more than EVERY employee of department 2 (max 105000)
SELECT empName, empSalary FROM tblEmployee
WHERE empSalary &gt; ALL (SELECT empSalary FROM tblEmployee WHERE depNum = 2);
-- &gt; ANY: earns more than AT LEAST ONE employee of department 2 (min 55000)
SELECT COUNT(*) AS more_than_any FROM tblEmployee
WHERE empSalary &gt; ANY (SELECT empSalary FROM tblEmployee WHERE depNum = 2);</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td></tr>
<tr><td>4</td><td>Phòng Hành chính</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>more_than_any</th></tr></thead>
<tbody>
<tr><td>9</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Condition</th><th>Here</th><th>Result</th></tr></thead>
<tbody>
<tr><td>EXISTS (projects of department d)</td><td>tested for each department d (a correlated subquery, slide 54)</td><td>departments 1–4; 5 has no project</td></tr>
<tr><td>empSalary &gt; ALL (salaries of dept 2 = 55000, 72000, 95000, 105000)</td><td>must beat 105000</td><td>only Trần Minh Quang</td></tr>
<tr><td>empSalary &gt; ANY (same set)</td><td>must beat 55000</td><td>9 employees</td></tr>
</tbody>
</table>
<p>The empty-set corner case is a classic exam question:</p>
<pre><code class="language-sql">-- department 9 does not exist: the inner set is EMPTY
SELECT COUNT(*) AS gt_ALL_empty FROM tblEmployee
WHERE empSalary &gt; ALL (SELECT empSalary FROM tblEmployee WHERE depNum = 9);
SELECT COUNT(*) AS gt_ANY_empty FROM tblEmployee
WHERE empSalary &gt; ANY (SELECT empSalary FROM tblEmployee WHERE depNum = 9);</code></pre>
<table>
<thead><tr><th>gt_ALL_empty</th></tr></thead>
<tbody>
<tr><td>14</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>gt_ANY_empty</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<p><code>&gt; ALL (empty)</code> is TRUE for everybody ("greater than every element of nothing" — nothing contradicts it); <code>&gt; ANY (empty)</code> is FALSE ("greater than at least one element" — there is none).</p>
<p class="meo">🧠 &gt; ALL = greater than the MAX; &gt; ANY = greater than the MIN (for non-empty sets without NULL). Any operator = &lt;&gt; &lt; &lt;= &gt; &gt;= can be combined with ALL/ANY.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> EXISTS, IN, ALL, ANY (and SOME) behave exactly the same; PostgreSQL adds <code>= ANY(array)</code> for arrays. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-7-2-correlated-exists">PostgreSQL 7.2 — correlated subqueries and EXISTS</a>.</div>`,
        `<p class="y-chinh">🎯 Bốn toán tử biến một quan hệ R thành TRUE/FALSE: EXISTS R (R khác rỗng), s IN R (s bằng một giá trị nào đó của R), s &gt; ALL R (s lớn hơn mọi giá trị), s &gt; ANY R (s lớn hơn ít nhất một giá trị).</p>
<pre><code class="language-sql">-- EXISTS: các phòng quản lý ít nhất một dự án
SELECT d.depNum, d.depName FROM tblDepartment d
WHERE EXISTS (SELECT * FROM tblProject p WHERE p.depNum = d.depNum);
-- &gt; ALL: lương cao hơn MỌI nhân viên phòng 2 (cao nhất 105000)
SELECT empName, empSalary FROM tblEmployee
WHERE empSalary &gt; ALL (SELECT empSalary FROM tblEmployee WHERE depNum = 2);
-- &gt; ANY: lương cao hơn ÍT NHẤT MỘT nhân viên phòng 2 (thấp nhất 55000)
SELECT COUNT(*) AS more_than_any FROM tblEmployee
WHERE empSalary &gt; ANY (SELECT empSalary FROM tblEmployee WHERE depNum = 2);</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td></tr>
<tr><td>4</td><td>Phòng Hành chính</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>more_than_any</th></tr></thead>
<tbody>
<tr><td>9</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Điều kiện</th><th>Ở đây</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>EXISTS (các dự án của phòng d)</td><td>kiểm cho từng phòng d (truy vấn con tương quan, slide 54)</td><td>phòng 1–4; phòng 5 không có dự án</td></tr>
<tr><td>empSalary &gt; ALL (lương phòng 2 = 55000, 72000, 95000, 105000)</td><td>phải hơn 105000</td><td>chỉ Trần Minh Quang</td></tr>
<tr><td>empSalary &gt; ANY (cùng tập đó)</td><td>phải hơn 55000</td><td>9 nhân viên</td></tr>
</tbody>
</table>
<p>Trường hợp tập rỗng là câu hỏi thi kinh điển:</p>
<pre><code class="language-sql">-- phòng 9 không tồn tại: tập bên trong RỖNG
SELECT COUNT(*) AS gt_ALL_empty FROM tblEmployee
WHERE empSalary &gt; ALL (SELECT empSalary FROM tblEmployee WHERE depNum = 9);
SELECT COUNT(*) AS gt_ANY_empty FROM tblEmployee
WHERE empSalary &gt; ANY (SELECT empSalary FROM tblEmployee WHERE depNum = 9);</code></pre>
<table>
<thead><tr><th>gt_ALL_empty</th></tr></thead>
<tbody>
<tr><td>14</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>gt_ANY_empty</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<p><code>&gt; ALL (rỗng)</code> là TRUE với mọi người ("lớn hơn mọi phần tử của cái không có gì" — không có gì phản bác); <code>&gt; ANY (rỗng)</code> là FALSE ("lớn hơn ít nhất một phần tử" — mà chẳng có phần tử nào).</p>
<p class="meo">🧠 &gt; ALL = lớn hơn MAX; &gt; ANY = lớn hơn MIN (với tập khác rỗng, không có NULL). Toán tử nào trong = &lt;&gt; &lt; &lt;= &gt; &gt;= cũng ghép được với ALL/ANY.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> EXISTS, IN, ALL, ANY (và SOME) chạy y hệt; PostgreSQL có thêm <code>= ANY(mảng)</code> cho kiểu mảng. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-7-2-correlated-exists">PostgreSQL 7.2 — truy vấn con tương quan và EXISTS</a>.</div>`],
      [52, 'Conditions Involving Tuples',
        `<p class="y-chinh">🎯 In standard SQL a tuple is written as a list of values in brackets, <code>(a, b)</code>, and can be compared with a relation of the same width using IN, ANY, ALL.</p>
<p>Example: "the employees in the same department AND of the same sex as Võ Việt Anh" = <code>(depNum, empSex) IN (SELECT depNum, empSex …)</code>. Standard SQL — but SQL Server does not implement it:</p>
<pre><code class="language-sql">-- "same department AND same sex as Võ Việt Anh": comparing a pair with a set of pairs
SELECT empName FROM tblEmployee
WHERE (depNum, empSex) IN (SELECT depNum, empSex FROM tblEmployee WHERE empName = N'Võ Việt Anh');
GO
-- SQL Server: rewrite with EXISTS
SELECT e.empName FROM tblEmployee e
WHERE EXISTS (SELECT * FROM tblEmployee v
              WHERE v.empName = N'Võ Việt Anh'
                AND v.depNum = e.depNum AND v.empSex = e.empSex);
GO</code></pre>
<div class="out"><b>Msg 4145, Level 15, State 1<br>
An expression of non-boolean type specified in a context where a condition is expected, near ','.</b></div>
<table>
<thead><tr><th>empName</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td></tr>
<tr><td>Võ Việt Anh</td></tr>
</tbody>
</table>
<ul>
<li>Msg 4145: SQL Server does not accept a row value <code>(depNum, empSex)</code> in a condition.</li>
<li>The rewrite with EXISTS compares the columns one by one inside the subquery: <code>v.depNum = e.depNum AND v.empSex = e.empSex</code>. Result: the two men of department 1 (Võ Việt Anh himself included).</li>
</ul>
<div class="pitfall">In the PE (SQL Server) never write <code>(a, b) IN (SELECT …)</code>; the standard rewrite is EXISTS with one equality per column. The same trick replaces <code>(a, b) NOT IN</code> by NOT EXISTS.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> row values work exactly as the slide says:
<pre><code class="language-sql">SELECT empName FROM tblEmployee
WHERE (depNum, empSex) IN (SELECT depNum, empSex FROM tblEmployee WHERE empName = 'Võ Việt Anh')
ORDER BY empName;</code></pre>
<table>
<thead><tr><th>empname</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td></tr>
<tr><td>Võ Việt Anh</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-7-1-subquery">PostgreSQL 7.1 — subqueries</a>.</div>`,
        `<p class="y-chinh">🎯 Trong SQL chuẩn một bộ (tuple) được viết là danh sách giá trị trong ngoặc, <code>(a, b)</code>, và so được với một quan hệ cùng số cột bằng IN, ANY, ALL.</p>
<p>Ví dụ: "các nhân viên cùng phòng VÀ cùng giới tính với Võ Việt Anh" = <code>(depNum, empSex) IN (SELECT depNum, empSex …)</code>. Đúng SQL chuẩn — nhưng SQL Server không cài đặt nó:</p>
<pre><code class="language-sql">-- "cùng phòng VÀ cùng giới tính với Võ Việt Anh": so một cặp với một tập các cặp
SELECT empName FROM tblEmployee
WHERE (depNum, empSex) IN (SELECT depNum, empSex FROM tblEmployee WHERE empName = N'Võ Việt Anh');
GO
-- SQL Server: viết lại bằng EXISTS
SELECT e.empName FROM tblEmployee e
WHERE EXISTS (SELECT * FROM tblEmployee v
              WHERE v.empName = N'Võ Việt Anh'
                AND v.depNum = e.depNum AND v.empSex = e.empSex);
GO</code></pre>
<div class="out"><b>Msg 4145, Level 15, State 1<br>
An expression of non-boolean type specified in a context where a condition is expected, near ','.</b></div>
<table>
<thead><tr><th>empName</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td></tr>
<tr><td>Võ Việt Anh</td></tr>
</tbody>
</table>
<ul>
<li>Msg 4145: SQL Server không nhận giá trị dòng (row value) <code>(depNum, empSex)</code> trong điều kiện.</li>
<li>Bản viết lại bằng EXISTS so từng cột một bên trong câu con: <code>v.depNum = e.depNum AND v.empSex = e.empSex</code>. Kết quả: hai người nam của phòng 1 (có cả chính Võ Việt Anh).</li>
</ul>
<div class="pitfall">Trong bài PE (SQL Server) đừng bao giờ viết <code>(a, b) IN (SELECT …)</code>; cách viết lại chuẩn là EXISTS với mỗi cột một phép bằng. Cùng mẹo đó thay <code>(a, b) NOT IN</code> bằng NOT EXISTS.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> giá trị dòng chạy đúng như slide nói:
<pre><code class="language-sql">SELECT empName FROM tblEmployee
WHERE (depNum, empSex) IN (SELECT depNum, empSex FROM tblEmployee WHERE empName = 'Võ Việt Anh')
ORDER BY empName;</code></pre>
<table>
<thead><tr><th>empname</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td></tr>
<tr><td>Võ Việt Anh</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-7-1-subquery">PostgreSQL 7.1 — truy vấn con</a>.</div>`],
    ]),
    books([
      ['ullman', 'Ullman &amp; Widom (3e) — §6.2.2–6.2.5 Disambiguating attributes, tuple variables, set operators; §6.3.1–6.3.3 Subqueries, conditions involving relations and tuples', 'Ullman &amp; Widom (3e) — §6.2.2–6.2.5 Phân biệt thuộc tính, biến bộ, phép toán tập hợp; §6.3.1–6.3.3 Truy vấn con, điều kiện trên quan hệ và bộ'],
      ['ramakrishnan', 'Ramakrishnan &amp; Gehrke — ch. 5.3 UNION, INTERSECT, EXCEPT; 5.4 Nested queries', 'Ramakrishnan &amp; Gehrke — mục 5.3 UNION, INTERSECT, EXCEPT; 5.4 Truy vấn lồng'],
    ]),
  ].join('\n'),
};

/* ───────── 6.C — 📑 Slide by slide · Correlated subqueries, JOIN expressions, outer joins (Chapter 6, slides 53–67) ───────── */
const L_dbi7_5 = {
  title: '6.C — 📑 Slide by slide · Correlated subqueries, JOIN expressions, outer joins (Chapter 6, slides 53–67)|||6.C — 📑 Học theo từng slide · Truy vấn con tương quan, JOIN, nối ngoài (Chapter 6, slide 53–67)',
  slug: 'dbi202-slide-dbi7-5',
  type: 'VIDEO',
  description: 'Giảng từng slide 53–67 của bộ slide Chapter 6 của trường (phần 2): Example 12 (IN), truy vấn con tương quan và luật phạm vi tên (Example 13 — thật ra không tương quan, ví dụ Movies), truy vấn con trong FROM, CROSS JOIN và JOIN … ON (Example 15), NATURAL JOIN (SQL Server không có), nối ngoài LEFT/RIGHT/FULL (Example 17.1–17.2, bẫy điều kiện ở WHERE), DISTINCT và túi (Example 17.3) — từng câu giải theo thứ tự thực thi, vẽ bảng trung gian, chạy thật trên FUHCompany, ô 🐘 PostgreSQL ở mọi chỗ cú pháp khác.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.C · school slides "Chapter 6", part 2 (slides 22–82)</span>
<h2>Correlated subqueries, JOIN expressions and outer joins</h2>
<p class="lead">School "Chapter 6" slides, part 2 — this lesson covers slides 53–67 (part 1, slides 1–21, is in Chapter 5 of this website). The two ideas that decide most PE marks live here: a subquery that is re-run for every outer row, and the outer join that keeps rows without a partner ("list every department, including those with no project").</p>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>You must be able to</th></tr></thead>
<tbody>
<tr><td>53–56</td><td>IN subquery (Example 12); correlated subqueries (Example 13, Movies)</td><td>say whether a subquery is correlated; evaluate it row by row</td></tr>
<tr><td>57</td><td>subquery in FROM</td><td>give it an alias; read it as a temporary table</td></tr>
<tr><td>58–61</td><td>CROSS JOIN, JOIN … ON (Example 15), NATURAL JOIN</td><td>count the rows of a product / join; know SQL Server has no NATURAL JOIN</td></tr>
<tr><td>62–64</td><td>LEFT / RIGHT / FULL OUTER JOIN (Example 17.1–17.2)</td><td>keep the dangling rows; not destroy them with WHERE</td></tr>
<tr><td>65–67</td><td>full-relation operations, DISTINCT (Example 17.3)</td><td>remove duplicates on purpose</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 6 · Bài 6.C · slide "Chapter 6" của trường, phần 2 (slide 22–82)</span>
<h2>Truy vấn con tương quan, biểu thức JOIN và nối ngoài</h2>
<p class="lead">Slide Chapter 6 của trường, phần 2 — bài này học slide 53–67 (phần 1, slide 1–21, ở Chương 5 của web). Hai ý quyết định phần lớn điểm PE nằm ở đây: truy vấn con được chạy lại cho từng dòng bên ngoài, và phép nối ngoài (outer join) giữ lại những dòng không có bạn ghép ("liệt kê mọi phòng, kể cả phòng không có dự án").</p>
<table>
<thead><tr><th>Slide</th><th>Ý chính</th><th>Bạn phải làm được</th></tr></thead>
<tbody>
<tr><td>53–56</td><td>truy vấn con với IN (Ví dụ 12); truy vấn con tương quan (Ví dụ 13, Movies)</td><td>nói được câu con có tương quan không; tính nó từng dòng</td></tr>
<tr><td>57</td><td>truy vấn con trong FROM</td><td>đặt bí danh; đọc nó như một bảng tạm</td></tr>
<tr><td>58–61</td><td>CROSS JOIN, JOIN … ON (Ví dụ 15), NATURAL JOIN</td><td>đếm số dòng của tích / phép nối; biết SQL Server không có NATURAL JOIN</td></tr>
<tr><td>62–64</td><td>LEFT / RIGHT / FULL OUTER JOIN (Ví dụ 17.1–17.2)</td><td>giữ các dòng treo; không phá chúng bằng WHERE</td></tr>
<tr><td>65–67</td><td>phép toán trên cả quan hệ, DISTINCT (Ví dụ 17.3)</td><td>chủ động bỏ bản trùng</td></tr>
</tbody>
</table>`),
    walkHead('dbi7', 53, 67),
    walk('dbi7', [
      [53, 'Sub-queries - Example 12 with IN',
        `<p class="y-chinh">🎯 Example 12 finds the dependents of all employees of department 1: the subquery returns a SET of SSNs and IN tests each dependent against it.</p>
<pre><code class="language-sql">/*12*/
SELECT *
FROM tblDependent
WHERE empSSN IN (SELECT empSSN
                 FROM tblEmployee
                 WHERE depNum=1)
GO</code></pre>
<table>
<thead><tr><th>depName</th><th>empSSN</th><th>depSex</th><th>depBirthdate</th><th>depRelationship</th></tr></thead>
<tbody>
<tr><td>Phạm Thị Hoa</td><td>30121050001</td><td>F</td><td>1970-01-20</td><td>Vợ</td></tr>
<tr><td>Trần Minh Khang</td><td>30121050001</td><td>M</td><td>2000-05-05</td><td>Con trai</td></tr>
<tr><td>Nguyễn Văn Bình</td><td>30121050002</td><td>M</td><td>1983-09-12</td><td>Chồng</td></tr>
</tbody>
</table>
<p>Step 1, the inner query alone — a relation with one column and 4 rows, so <code>=</code> would fail here (error 512) and IN is required:</p>
<pre><code class="language-sql">-- step 1: the inner query -&gt; the set of SSNs of department 1
SELECT empSSN FROM tblEmployee WHERE depNum = 1;</code></pre>
<table>
<thead><tr><th>empSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td></tr>
<tr><td>30121050002</td></tr>
<tr><td>30121050003</td></tr>
<tr><td>30121050004</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Part</th><th>What happens</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>inner: SSNs of department 1</td><td>{001, 002, 003, 004}</td><td>4</td></tr>
<tr><td>2</td><td>outer FROM tblDependent</td><td>every relative</td><td>5</td></tr>
<tr><td>3</td><td>WHERE empSSN IN {…}</td><td>Phạm Gia Huy (of 010) and Trương Minh Châu (of 027) fail</td><td>3</td></tr>
<tr><td>4</td><td>SELECT *</td><td>5 columns of tblDependent</td><td>3</td></tr>
</tbody>
</table>
<p>The same answer as a join (tblDependent ⋈ tblEmployee, then σ<sub>depNum=1</sub>):</p>
<pre><code class="language-sql">-- the same request written as a join
SELECT dp.*
FROM tblDependent dp JOIN tblEmployee e ON dp.empSSN = e.empSSN
WHERE e.depNum = 1;</code></pre>
<table>
<thead><tr><th>depName</th><th>empSSN</th><th>depSex</th><th>depBirthdate</th><th>depRelationship</th></tr></thead>
<tbody>
<tr><td>Phạm Thị Hoa</td><td>30121050001</td><td>F</td><td>1970-01-20</td><td>Vợ</td></tr>
<tr><td>Trần Minh Khang</td><td>30121050001</td><td>M</td><td>2000-05-05</td><td>Con trai</td></tr>
<tr><td>Nguyễn Văn Bình</td><td>30121050002</td><td>M</td><td>1983-09-12</td><td>Chồng</td></tr>
</tbody>
</table>
<p class="meo">🧠 The slide title still says "scalar values", but this subquery returns a relation — it belongs to slide 51's "conditions involving relations".</p>`,
        `<p class="y-chinh">🎯 Ví dụ 12 tìm người thân của mọi nhân viên phòng 1: câu con trả về một TẬP các SSN và IN đem từng người thân ra thử với tập đó.</p>
<pre><code class="language-sql">/*12*/
SELECT *
FROM tblDependent
WHERE empSSN IN (SELECT empSSN
                 FROM tblEmployee
                 WHERE depNum=1)
GO</code></pre>
<table>
<thead><tr><th>depName</th><th>empSSN</th><th>depSex</th><th>depBirthdate</th><th>depRelationship</th></tr></thead>
<tbody>
<tr><td>Phạm Thị Hoa</td><td>30121050001</td><td>F</td><td>1970-01-20</td><td>Vợ</td></tr>
<tr><td>Trần Minh Khang</td><td>30121050001</td><td>M</td><td>2000-05-05</td><td>Con trai</td></tr>
<tr><td>Nguyễn Văn Bình</td><td>30121050002</td><td>M</td><td>1983-09-12</td><td>Chồng</td></tr>
</tbody>
</table>
<p>Bước 1, riêng câu trong — một quan hệ một cột 4 dòng, nên ở đây <code>=</code> sẽ lỗi (512) và bắt buộc phải dùng IN:</p>
<pre><code class="language-sql">-- bước 1: câu trong -&gt; tập SSN của phòng 1
SELECT empSSN FROM tblEmployee WHERE depNum = 1;</code></pre>
<table>
<thead><tr><th>empSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td></tr>
<tr><td>30121050002</td></tr>
<tr><td>30121050003</td></tr>
<tr><td>30121050004</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Phần</th><th>Chuyện gì xảy ra</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>câu trong: SSN của phòng 1</td><td>{001, 002, 003, 004}</td><td>4</td></tr>
<tr><td>2</td><td>FROM ngoài tblDependent</td><td>mọi người thân</td><td>5</td></tr>
<tr><td>3</td><td>WHERE empSSN IN {…}</td><td>Phạm Gia Huy (của 010) và Trương Minh Châu (của 027) bị loại</td><td>3</td></tr>
<tr><td>4</td><td>SELECT *</td><td>5 cột của tblDependent</td><td>3</td></tr>
</tbody>
</table>
<p>Cùng đáp án viết bằng phép nối (tblDependent ⋈ tblEmployee, rồi σ<sub>depNum=1</sub>):</p>
<pre><code class="language-sql">-- cùng yêu cầu viết bằng phép nối
SELECT dp.*
FROM tblDependent dp JOIN tblEmployee e ON dp.empSSN = e.empSSN
WHERE e.depNum = 1;</code></pre>
<table>
<thead><tr><th>depName</th><th>empSSN</th><th>depSex</th><th>depBirthdate</th><th>depRelationship</th></tr></thead>
<tbody>
<tr><td>Phạm Thị Hoa</td><td>30121050001</td><td>F</td><td>1970-01-20</td><td>Vợ</td></tr>
<tr><td>Trần Minh Khang</td><td>30121050001</td><td>M</td><td>2000-05-05</td><td>Con trai</td></tr>
<tr><td>Nguyễn Văn Bình</td><td>30121050002</td><td>M</td><td>1983-09-12</td><td>Chồng</td></tr>
</tbody>
</table>
<p class="meo">🧠 Tiêu đề slide vẫn ghi "scalar values" (giá trị vô hướng), nhưng câu con này trả về một quan hệ — nó thuộc loại "điều kiện trên quan hệ" của slide 51.</p>`],
      [54, 'Correlated Sub-queries',
        `<p class="y-chinh">🎯 A correlated subquery uses a column of the OUTER query, so it cannot be evaluated once and for all — conceptually it is re-run for every row of the outer query.</p>
<p>Example: employees who earn more than the average of <strong>their own</strong> department. The inner query mentions <code>e.depNum</code>, and e belongs to the outer FROM:</p>
<pre><code class="language-sql">-- employees who earn more than the average of THEIR OWN department
SELECT e.empName, e.depNum, e.empSalary
FROM tblEmployee e
WHERE e.empSalary &gt; (SELECT AVG(x.empSalary)
                     FROM tblEmployee x
                     WHERE x.depNum = e.depNum)   -- e comes from OUTSIDE
ORDER BY e.depNum;</code></pre>
<table>
<thead><tr><th>empName</th><th>depNum</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>1</td><td>150000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>1</td><td>90000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>2</td><td>95000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>2</td><td>105000</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>3</td><td>88000</td></tr>
<tr><td>Lý Thanh Tâm</td><td>5</td><td>65000</td></tr>
</tbody>
</table>
<p>What the inner query returns for each possible value of e.depNum:</p>
<pre><code class="language-sql">-- what the inner query returns for each value of e.depNum
SELECT depNum, AVG(empSalary) AS avg_of_this_department
FROM tblEmployee
GROUP BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>avg_of_this_department</th></tr></thead>
<tbody>
<tr><td>1</td><td>86250.000000</td></tr>
<tr><td>2</td><td>81750.000000</td></tr>
<tr><td>3</td><td>60000.000000</td></tr>
<tr><td>4</td><td>70000.000000</td></tr>
<tr><td>5</td><td>51500.000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Outer row e</th><th>e.depNum</th><th>inner AVG</th><th>e.empSalary &gt; AVG?</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>1</td><td>86250</td><td>150000 → TRUE</td></tr>
<tr><td>Võ Việt Anh</td><td>1</td><td>86250</td><td>60000 → FALSE</td></tr>
<tr><td>Mai Duy An</td><td>2</td><td>81750</td><td>55000 → FALSE</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>2</td><td>81750</td><td>105000 → TRUE</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>3</td><td>60000</td><td>88000 → TRUE</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>4</td><td>70000</td><td>70000 → FALSE (not strictly greater)</td></tr>
<tr><td>… (14 rows in all)</td><td></td><td></td><td>6 TRUE</td></tr>
</tbody>
</table>
<p><strong>Scoping rule for names</strong> (the red note on the slide): a column name in the subquery is first looked up in the subquery's own FROM (x), then in the enclosing query (e). That is why the inner copy needs its own alias x — with two unaliased <code>tblEmployee</code> the name depNum would refer to the inner one only.</p>
<div class="pitfall">If you forget the correlation (write <code>WHERE x.depNum = x.depNum</code> or omit it), the inner AVG becomes the company average — the query still runs and returns a wrong, plausible answer.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> correlated subqueries are written identically. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-7-2-correlated-exists">PostgreSQL 7.2 — correlated subqueries and EXISTS</a>.</div>`,
        `<p class="y-chinh">🎯 Truy vấn con tương quan (correlated subquery) dùng một cột của câu truy vấn BÊN NGOÀI, nên không thể tính một lần là xong — về khái niệm nó được chạy lại cho từng dòng của câu ngoài.</p>
<p>Ví dụ: nhân viên có lương cao hơn lương trung bình của <strong>chính phòng mình</strong>. Câu trong nhắc tới <code>e.depNum</code>, mà e thuộc FROM của câu ngoài:</p>
<pre><code class="language-sql">-- nhân viên có lương cao hơn lương trung bình của CHÍNH phòng mình
SELECT e.empName, e.depNum, e.empSalary
FROM tblEmployee e
WHERE e.empSalary &gt; (SELECT AVG(x.empSalary)
                     FROM tblEmployee x
                     WHERE x.depNum = e.depNum)   -- e đến từ BÊN NGOÀI
ORDER BY e.depNum;</code></pre>
<table>
<thead><tr><th>empName</th><th>depNum</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>1</td><td>150000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>1</td><td>90000</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>2</td><td>95000</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>2</td><td>105000</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>3</td><td>88000</td></tr>
<tr><td>Lý Thanh Tâm</td><td>5</td><td>65000</td></tr>
</tbody>
</table>
<p>Câu trong trả về gì với từng giá trị có thể có của e.depNum:</p>
<pre><code class="language-sql">-- câu trong trả về gì với từng giá trị của e.depNum
SELECT depNum, AVG(empSalary) AS avg_of_this_department
FROM tblEmployee
GROUP BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>avg_of_this_department</th></tr></thead>
<tbody>
<tr><td>1</td><td>86250.000000</td></tr>
<tr><td>2</td><td>81750.000000</td></tr>
<tr><td>3</td><td>60000.000000</td></tr>
<tr><td>4</td><td>70000.000000</td></tr>
<tr><td>5</td><td>51500.000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Dòng ngoài e</th><th>e.depNum</th><th>AVG bên trong</th><th>e.empSalary &gt; AVG?</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang</td><td>1</td><td>86250</td><td>150000 → TRUE</td></tr>
<tr><td>Võ Việt Anh</td><td>1</td><td>86250</td><td>60000 → FALSE</td></tr>
<tr><td>Mai Duy An</td><td>2</td><td>81750</td><td>55000 → FALSE</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>2</td><td>81750</td><td>105000 → TRUE</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>3</td><td>60000</td><td>88000 → TRUE</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>4</td><td>70000</td><td>70000 → FALSE (không lớn hơn hẳn)</td></tr>
<tr><td>… (tổng 14 dòng)</td><td></td><td></td><td>6 TRUE</td></tr>
</tbody>
</table>
<p><strong>Luật phạm vi của tên</strong> (scoping rules — dòng chữ đỏ trên slide): tên cột trong câu con được tìm trước ở FROM của chính câu con (x), rồi mới tới câu bao ngoài (e). Vì thế bản sao bên trong cần bí danh riêng x — nếu cả hai <code>tblEmployee</code> đều không có bí danh thì tên depNum chỉ trỏ vào bảng bên trong.</p>
<div class="pitfall">Quên điều kiện tương quan (viết <code>WHERE x.depNum = x.depNum</code> hoặc bỏ luôn), AVG bên trong thành mức trung bình cả công ty — câu vẫn chạy và trả về một đáp án sai mà trông hợp lý.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> truy vấn con tương quan viết y hệt. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-7-2-correlated-exists">PostgreSQL 7.2 — truy vấn con tương quan và EXISTS</a>.</div>`],
      [55, 'Correlated Sub-queries - Example 13',
        `<p class="y-chinh">🎯 Example 13 finds the projects located in the same place as ProjectA — but, despite the slide's title, its subquery is NOT correlated: it never mentions the outer row.</p>
<pre><code class="language-sql">/*13*/
SELECT * FROM tblProject
WHERE locNum = (SELECT p.locNum
                FROM tblProject p
                WHERE p.proName=N'ProjectA')
GO</code></pre>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>locNum</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>1</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>1</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Part</th><th>What happens</th><th>Result</th></tr></thead>
<tbody>
<tr><td>1</td><td>inner: locNum of ProjectA (alias p)</td><td>evaluated once</td><td>1</td></tr>
<tr><td>2</td><td>outer FROM tblProject</td><td>6 projects</td><td>6</td></tr>
<tr><td>3</td><td>WHERE locNum = 1</td><td>ProjectA and ProjectC</td><td>2</td></tr>
</tbody>
</table>
<p class="dap-an">✅ How to tell: remove the outer query — can the inner query still run alone? <code>SELECT p.locNum FROM tblProject p WHERE p.proName = N'ProjectA'</code> can, so it is an ordinary subquery. A truly correlated version names the outer row (p1) inside:</p>
<pre><code class="language-sql">-- a truly correlated version: the inner query uses p1 from outside
SELECT p1.proNum, p1.proName, p1.locNum
FROM tblProject p1
WHERE EXISTS (SELECT *
              FROM tblProject p2
              WHERE p2.proName = N'ProjectA'
                AND p2.locNum = p1.locNum);</code></pre>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>locNum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>1</td></tr>
</tbody>
</table>
<p>Same 2 rows; now for each p1 the inner query asks "is there a ProjectA in p1's location?".</p>
<div class="pitfall">ProjectA itself is in the answer (it is in its own location). If the question says "other projects", add <code>AND proName &lt;&gt; N'ProjectA'</code> — a frequent missing condition in PE answers.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 13 tìm các dự án cùng địa điểm với ProjectA — nhưng, dù tiêu đề slide ghi "correlated", câu con của nó KHÔNG tương quan: nó không hề nhắc tới dòng bên ngoài.</p>
<pre><code class="language-sql">/*13*/
SELECT * FROM tblProject
WHERE locNum = (SELECT p.locNum
                FROM tblProject p
                WHERE p.proName=N'ProjectA')
GO</code></pre>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>locNum</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>1</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>1</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Phần</th><th>Chuyện gì xảy ra</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>1</td><td>câu trong: locNum của ProjectA (bí danh p)</td><td>tính một lần</td><td>1</td></tr>
<tr><td>2</td><td>FROM ngoài tblProject</td><td>6 dự án</td><td>6</td></tr>
<tr><td>3</td><td>WHERE locNum = 1</td><td>ProjectA và ProjectC</td><td>2</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Cách nhận biết: bỏ câu ngoài đi — câu trong còn chạy một mình được không? <code>SELECT p.locNum FROM tblProject p WHERE p.proName = N'ProjectA'</code> chạy được, nên nó là truy vấn con thường. Bản tương quan thật sự phải gọi tên dòng bên ngoài (p1) ở bên trong:</p>
<pre><code class="language-sql">-- bản tương quan thật: câu trong dùng p1 từ bên ngoài
SELECT p1.proNum, p1.proName, p1.locNum
FROM tblProject p1
WHERE EXISTS (SELECT *
              FROM tblProject p2
              WHERE p2.proName = N'ProjectA'
                AND p2.locNum = p1.locNum);</code></pre>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>locNum</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>1</td></tr>
<tr><td>3</td><td>ProjectC</td><td>1</td></tr>
</tbody>
</table>
<p>Vẫn 2 dòng; giờ với mỗi p1 câu trong hỏi "có ProjectA nào ở địa điểm của p1 không?".</p>
<div class="pitfall">Chính ProjectA cũng nằm trong đáp án (nó cùng địa điểm với chính nó). Nếu đề nói "các dự án khác", thêm <code>AND proName &lt;&gt; N'ProjectA'</code> — điều kiện hay bị thiếu trong bài PE.</div>`],
      [56, 'Correlated Sub-queries - another example',
        `<p class="y-chinh">🎯 The textbook's example finds the movie titles used for two or more movies: a title is printed when some OTHER movie with the same title was made later (<code>year &lt; ANY</code> of the years of that title).</p>
<p>The slide's text "two or movies" means "two or more movies". Movies(title, year) with illustrative data (three King Kongs, two Titanics, one Avatar), then the slide's query:</p>
<pre><code class="language-sql">-- Movies(title, year): illustrative data, three films share a title
CREATE TABLE Movies (title NVARCHAR(50) NOT NULL, year INT NOT NULL, CONSTRAINT pk_movies PRIMARY KEY (title, year));
INSERT INTO Movies VALUES (N'King Kong', 1933), (N'King Kong', 1976), (N'King Kong', 2005),
                          (N'Titanic', 1953), (N'Titanic', 1997), (N'Avatar', 2009);
GO
SELECT title
FROM Movies Old
WHERE year &lt; ANY
    (SELECT year
     FROM Movies
     WHERE title = Old.title);
GO</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>title</th></tr></thead>
<tbody>
<tr><td>King Kong</td></tr>
<tr><td>King Kong</td></tr>
<tr><td>Titanic</td></tr>
</tbody>
</table>
<p>For each outer row Old, the inner query is re-run with Old.title — the correlation:</p>
<pre><code class="language-sql">CREATE TABLE Movies (title NVARCHAR(50) NOT NULL, year INT NOT NULL, CONSTRAINT pk_movies PRIMARY KEY (title, year));
INSERT INTO Movies VALUES (N'King Kong', 1933), (N'King Kong', 1976), (N'King Kong', 2005),
                          (N'Titanic', 1953), (N'Titanic', 1997), (N'Avatar', 2009);
GO
-- for EACH row Old: the inner set, and the result of year &lt; ANY
SELECT Old.title, Old.year,
       (SELECT COUNT(*) FROM Movies m WHERE m.title = Old.title) AS inner_set_size,
       (SELECT MAX(year) FROM Movies m WHERE m.title = Old.title) AS inner_max,
       CASE WHEN Old.year &lt; ANY (SELECT year FROM Movies m WHERE m.title = Old.title)
            THEN 'TRUE' ELSE 'FALSE' END AS year_lt_ANY
FROM Movies Old
ORDER BY Old.title, Old.year;
GO
-- the version that lists each title once
SELECT DISTINCT title FROM Movies Old
WHERE year &lt; ANY (SELECT year FROM Movies WHERE title = Old.title);</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>inner_set_size</th><th>inner_max</th><th>year_lt_ANY</th></tr></thead>
<tbody>
<tr><td>Avatar</td><td>2009</td><td>1</td><td>2009</td><td>FALSE</td></tr>
<tr><td>King Kong</td><td>1933</td><td>3</td><td>2005</td><td>TRUE</td></tr>
<tr><td>King Kong</td><td>1976</td><td>3</td><td>2005</td><td>TRUE</td></tr>
<tr><td>King Kong</td><td>2005</td><td>3</td><td>2005</td><td>FALSE</td></tr>
<tr><td>Titanic</td><td>1953</td><td>2</td><td>1997</td><td>TRUE</td></tr>
<tr><td>Titanic</td><td>1997</td><td>2</td><td>1997</td><td>FALSE</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th></tr></thead>
<tbody>
<tr><td>King Kong</td></tr>
<tr><td>Titanic</td></tr>
</tbody>
</table>
<ul>
<li>King Kong 1933 and 1976 each find a later King Kong → TRUE; 2005 is the latest → FALSE. So King Kong is printed <strong>twice</strong> (n copies → n − 1 rows).</li>
<li>Avatar has only itself in the inner set; <code>2009 &lt; ANY {2009}</code> is FALSE → not printed. Correct: a title used once must not appear.</li>
<li><code>DISTINCT</code> gives each title once.</li>
</ul>
<p class="meo">🧠 Correlated = "for each row outside, ask a question about this row inside". Say it in words first, then write it.</p>`,
        `<p class="y-chinh">🎯 Ví dụ của giáo trình tìm các tên phim đã được dùng cho hai phim trở lên: một tên được in ra khi có một phim KHÁC cùng tên làm muộn hơn (<code>year &lt; ANY</code> các năm của tên đó).</p>
<p>Chữ "two or movies" trên slide nghĩa là "two or more movies" (hai phim trở lên). Bảng Movies(title, year) với dữ liệu minh hoạ (ba phim King Kong, hai Titanic, một Avatar), rồi câu truy vấn của slide:</p>
<pre><code class="language-sql">-- Movies(title, year): dữ liệu minh hoạ, ba phim trùng tên
CREATE TABLE Movies (title NVARCHAR(50) NOT NULL, year INT NOT NULL, CONSTRAINT pk_movies PRIMARY KEY (title, year));
INSERT INTO Movies VALUES (N'King Kong', 1933), (N'King Kong', 1976), (N'King Kong', 2005),
                          (N'Titanic', 1953), (N'Titanic', 1997), (N'Avatar', 2009);
GO
SELECT title
FROM Movies Old
WHERE year &lt; ANY
    (SELECT year
     FROM Movies
     WHERE title = Old.title);
GO</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>title</th></tr></thead>
<tbody>
<tr><td>King Kong</td></tr>
<tr><td>King Kong</td></tr>
<tr><td>Titanic</td></tr>
</tbody>
</table>
<p>Với mỗi dòng ngoài Old, câu trong được chạy lại với Old.title — đó là sự tương quan:</p>
<pre><code class="language-sql">CREATE TABLE Movies (title NVARCHAR(50) NOT NULL, year INT NOT NULL, CONSTRAINT pk_movies PRIMARY KEY (title, year));
INSERT INTO Movies VALUES (N'King Kong', 1933), (N'King Kong', 1976), (N'King Kong', 2005),
                          (N'Titanic', 1953), (N'Titanic', 1997), (N'Avatar', 2009);
GO
-- với MỖI dòng Old: tập bên trong, và kết quả của year &lt; ANY
SELECT Old.title, Old.year,
       (SELECT COUNT(*) FROM Movies m WHERE m.title = Old.title) AS inner_set_size,
       (SELECT MAX(year) FROM Movies m WHERE m.title = Old.title) AS inner_max,
       CASE WHEN Old.year &lt; ANY (SELECT year FROM Movies m WHERE m.title = Old.title)
            THEN 'TRUE' ELSE 'FALSE' END AS year_lt_ANY
FROM Movies Old
ORDER BY Old.title, Old.year;
GO
-- bản liệt kê mỗi tên phim một lần
SELECT DISTINCT title FROM Movies Old
WHERE year &lt; ANY (SELECT year FROM Movies WHERE title = Old.title);</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>inner_set_size</th><th>inner_max</th><th>year_lt_ANY</th></tr></thead>
<tbody>
<tr><td>Avatar</td><td>2009</td><td>1</td><td>2009</td><td>FALSE</td></tr>
<tr><td>King Kong</td><td>1933</td><td>3</td><td>2005</td><td>TRUE</td></tr>
<tr><td>King Kong</td><td>1976</td><td>3</td><td>2005</td><td>TRUE</td></tr>
<tr><td>King Kong</td><td>2005</td><td>3</td><td>2005</td><td>FALSE</td></tr>
<tr><td>Titanic</td><td>1953</td><td>2</td><td>1997</td><td>TRUE</td></tr>
<tr><td>Titanic</td><td>1997</td><td>2</td><td>1997</td><td>FALSE</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th></tr></thead>
<tbody>
<tr><td>King Kong</td></tr>
<tr><td>Titanic</td></tr>
</tbody>
</table>
<ul>
<li>King Kong 1933 và 1976 mỗi dòng tìm được một King Kong muộn hơn → TRUE; bản 2005 là muộn nhất → FALSE. Nên King Kong được in <strong>hai lần</strong> (n bản → n − 1 dòng).</li>
<li>Avatar chỉ có chính nó trong tập bên trong; <code>2009 &lt; ANY {2009}</code> là FALSE → không in. Đúng: tên chỉ dùng một lần thì không được xuất hiện.</li>
<li><code>DISTINCT</code> cho mỗi tên một lần.</li>
</ul>
<p class="meo">🧠 Tương quan = "với mỗi dòng bên ngoài, hỏi một câu về chính dòng này ở bên trong". Nói bằng lời trước, rồi mới viết.</p>`],
      [57, 'Sub-queries in FROM Clauses',
        `<p class="y-chinh">🎯 A parenthesized subquery can stand in the FROM list like a table, and it MUST get a tuple-variable alias (here d).</p>
<pre><code class="language-sql">SELECT  *
FROM    tblEmployee e,
        (SELECT depNum
         FROM tblDepartment
         WHERE depName=N'Phòng phần mềm trong nước') d
WHERE   e.depNum=d.depNum</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td><td>1</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td><td>1</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td><td>1</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Part</th><th>What happens</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>subquery d</td><td>the departments named "Phòng phần mềm trong nước" (case ignored)</td><td>1 row: depNum 1</td></tr>
<tr><td>2</td><td>FROM tblEmployee e, d</td><td>product 14 × 1</td><td>14</td></tr>
<tr><td>3</td><td>WHERE e.depNum = d.depNum</td><td>join</td><td>4</td></tr>
<tr><td>4</td><td>SELECT *</td><td>8 columns of e + the 1 column of d</td><td>4</td></tr>
</tbody>
</table>
<p>Without the alias SQL Server refuses:</p>
<pre><code class="language-sql">-- the same query without the alias d
SELECT *
FROM tblEmployee e, (SELECT depNum FROM tblDepartment WHERE depNum = 1)
WHERE e.depNum = 1;
GO</code></pre>
<div class="out"><b>Msg 156, Level 15, State 1<br>
Incorrect syntax near the keyword 'WHERE'.</b></div>
<p class="meo">🧠 A subquery in FROM is a temporary, nameless table that lives for one query; the alias is its name. It is the natural tool for "aggregate first, then join or filter" (lesson 6.D, practice exercise 7).</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> (since version 16) the alias is optional, but the habit at work is a <strong>CTE</strong>: name the subquery first with <code>WITH d AS (…)</code>, then use d like a table — easier to read and to reuse. SQL Server also supports WITH:
<pre><code class="language-sql">-- the habit at work: name the sub-query first with WITH (a CTE)
WITH d AS (
    SELECT depNum FROM tblDepartment
    WHERE depName ILIKE 'Phòng phần mềm trong nước'   -- ILIKE: the slide writes a small p
)
SELECT e.empName, e.depNum
FROM tblEmployee e JOIN d ON e.depNum = d.depNum
ORDER BY e.empName;</code></pre>
<table>
<thead><tr><th>empname</th><th>depnum</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>1</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>1</td></tr>
<tr><td>Trần Minh Quang</td><td>1</td></tr>
<tr><td>Võ Việt Anh</td><td>1</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-7-3-cte">PostgreSQL 7.3 — CTE (WITH)</a>.</div>`,
        `<p class="y-chinh">🎯 Một câu truy vấn con trong ngoặc có thể đứng trong danh sách FROM như một bảng, và BẮT BUỘC phải có bí danh biến bộ (ở đây là d).</p>
<pre><code class="language-sql">SELECT  *
FROM    tblEmployee e,
        (SELECT depNum
         FROM tblDepartment
         WHERE depName=N'Phòng phần mềm trong nước') d
WHERE   e.depNum=d.depNum</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td><td>1</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td><td>1</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td><td>1</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Phần</th><th>Chuyện gì xảy ra</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>câu con d</td><td>các phòng tên "Phòng phần mềm trong nước" (bỏ qua hoa thường)</td><td>1 dòng: depNum 1</td></tr>
<tr><td>2</td><td>FROM tblEmployee e, d</td><td>tích 14 × 1</td><td>14</td></tr>
<tr><td>3</td><td>WHERE e.depNum = d.depNum</td><td>nối</td><td>4</td></tr>
<tr><td>4</td><td>SELECT *</td><td>8 cột của e + 1 cột của d</td><td>4</td></tr>
</tbody>
</table>
<p>Không có bí danh thì SQL Server từ chối:</p>
<pre><code class="language-sql">-- cùng câu đó nhưng bỏ bí danh d
SELECT *
FROM tblEmployee e, (SELECT depNum FROM tblDepartment WHERE depNum = 1)
WHERE e.depNum = 1;
GO</code></pre>
<div class="out"><b>Msg 156, Level 15, State 1<br>
Incorrect syntax near the keyword 'WHERE'.</b></div>
<p class="meo">🧠 Truy vấn con trong FROM là một bảng tạm, không tên, sống trong một câu truy vấn; bí danh chính là tên của nó. Đây là công cụ tự nhiên cho kiểu "gộp trước, rồi nối hoặc lọc" (bài 6.D, bài thực hành 7).</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> (từ bản 16) bí danh là tuỳ chọn, nhưng thói quen khi đi làm là dùng <strong>CTE</strong> (common table expression — biểu thức bảng chung): đặt tên câu con trước bằng <code>WITH d AS (…)</code>, rồi dùng d như một bảng — dễ đọc và dùng lại được. SQL Server cũng có WITH:
<pre><code class="language-sql">-- thói quen khi đi làm: đặt tên câu con trước bằng WITH (CTE)
WITH d AS (
    SELECT depNum FROM tblDepartment
    WHERE depName ILIKE 'Phòng phần mềm trong nước'   -- ILIKE: slide viết chữ p thường
)
SELECT e.empName, e.depNum
FROM tblEmployee e JOIN d ON e.depNum = d.depNum
ORDER BY e.empName;</code></pre>
<table>
<thead><tr><th>empname</th><th>depnum</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>1</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>1</td></tr>
<tr><td>Trần Minh Quang</td><td>1</td></tr>
<tr><td>Võ Việt Anh</td><td>1</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-7-3-cte">PostgreSQL 7.3 — CTE (WITH)</a>.</div>`],
      [58, 'SQL Join Expressions',
        `<p class="y-chinh">🎯 Joins can be written as expressions in FROM: <code>R CROSS JOIN S</code> is the Cartesian product, <code>R JOIN S ON condition</code> is the theta-join; such an expression can be a query by itself or part of a bigger FROM.</p>
<pre><code class="language-sql">-- R CROSS JOIN S: 6 projects x 4 locations
SELECT COUNT(*) AS cross_rows FROM tblProject CROSS JOIN tblLocation;
-- R JOIN S ON condition: each project with ITS location
SELECT p.proName, l.locName
FROM tblProject p JOIN tblLocation l ON p.locNum = l.locNum
ORDER BY p.proNum;</code></pre>
<table>
<thead><tr><th>cross_rows</th></tr></thead>
<tbody>
<tr><td>24</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>proName</th><th>locName</th></tr></thead>
<tbody>
<tr><td>ProjectA</td><td>TP Hà Nội</td></tr>
<tr><td>ProjectB</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>ProjectC</td><td>TP Hà Nội</td></tr>
<tr><td>ProjectD</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>ProjectE</td><td>TP Đà Nẵng</td></tr>
<tr><td>ProjectF</td><td>TP Hồ Chí Minh</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Syntax</th><th>Algebra</th><th>Rows here</th></tr></thead>
<tbody>
<tr><td><code>tblProject CROSS JOIN tblLocation</code></td><td>tblProject × tblLocation</td><td>6 × 4 = 24</td></tr>
<tr><td><code>tblProject p JOIN tblLocation l ON p.locNum = l.locNum</code></td><td>σ<sub>p.locNum=l.locNum</sub>(p × l) = p ⋈<sub>θ</sub> l</td><td>6 (each project has one location)</td></tr>
</tbody>
</table>
<p><code>JOIN … ON</code> gives the same rows as "list the tables in FROM + condition in WHERE" (slide 35), but keeps the join condition next to the table it belongs to, and leaves WHERE for the real filters. <code>JOIN</code> means <code>INNER JOIN</code>.</p>
<p class="meo">🧠 One JOIN per foreign-key line of the ERD, one ON per JOIN. Missing ON after JOIN is a syntax error — a useful safety net that the comma style does not have.</p>`,
        `<p class="y-chinh">🎯 Phép nối có thể viết thành biểu thức trong FROM: <code>R CROSS JOIN S</code> là tích Descartes, <code>R JOIN S ON điều_kiện</code> là phép nối theta; biểu thức đó có thể tự nó là một câu truy vấn hoặc là một phần của FROM lớn hơn.</p>
<pre><code class="language-sql">-- R CROSS JOIN S: 6 dự án x 4 địa điểm
SELECT COUNT(*) AS cross_rows FROM tblProject CROSS JOIN tblLocation;
-- R JOIN S ON điều kiện: mỗi dự án với địa điểm CỦA NÓ
SELECT p.proName, l.locName
FROM tblProject p JOIN tblLocation l ON p.locNum = l.locNum
ORDER BY p.proNum;</code></pre>
<table>
<thead><tr><th>cross_rows</th></tr></thead>
<tbody>
<tr><td>24</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>proName</th><th>locName</th></tr></thead>
<tbody>
<tr><td>ProjectA</td><td>TP Hà Nội</td></tr>
<tr><td>ProjectB</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>ProjectC</td><td>TP Hà Nội</td></tr>
<tr><td>ProjectD</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>ProjectE</td><td>TP Đà Nẵng</td></tr>
<tr><td>ProjectF</td><td>TP Hồ Chí Minh</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Cú pháp</th><th>Đại số</th><th>Số dòng ở đây</th></tr></thead>
<tbody>
<tr><td><code>tblProject CROSS JOIN tblLocation</code></td><td>tblProject × tblLocation</td><td>6 × 4 = 24</td></tr>
<tr><td><code>tblProject p JOIN tblLocation l ON p.locNum = l.locNum</code></td><td>σ<sub>p.locNum=l.locNum</sub>(p × l) = p ⋈<sub>θ</sub> l</td><td>6 (mỗi dự án một địa điểm)</td></tr>
</tbody>
</table>
<p><code>JOIN … ON</code> cho cùng các dòng như "liệt kê bảng trong FROM + điều kiện ở WHERE" (slide 35), nhưng giữ điều kiện nối ngay cạnh bảng của nó, và để WHERE cho các điều kiện lọc thật sự. <code>JOIN</code> nghĩa là <code>INNER JOIN</code> (nối trong).</p>
<p class="meo">🧠 Mỗi đường khoá ngoại trên ERD một JOIN, mỗi JOIN một ON. Thiếu ON sau JOIN là lỗi cú pháp — một lưới an toàn mà kiểu viết dấu phẩy không có.</p>`],
      [59, 'SQL Join Expression - Example 15.1 and 15.2',
        `<p class="y-chinh">🎯 Example 15.1 is the product of Department and Employee (5 × 14 = 70 rows); Example 15.2 joins them on depNum, giving each department with its employees (14 rows).</p>
<p>The slide shows only the code of 15.2; here is 15.1 with CROSS JOIN (first 8 of the 70 rows — note Mai Duy An of department 2 paired with department 1):</p>
<pre><code class="language-sql">-- Example 15.1: the product of Department and Employee
SELECT d.depNum, d.depName, e.empName, e.depNum AS e_depNum
FROM tblDepartment d CROSS JOIN tblEmployee e
ORDER BY d.depNum, e.empSSN;</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>empName</th><th>e_depNum</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Trần Minh Quang</td><td>1</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Hoàng Thị Hà</td><td>1</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Võ Việt Anh</td><td>1</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Lê Thị Lan Anh</td><td>1</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Mai Duy An</td><td>2</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Phạm Quốc Bảo</td><td>2</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Hồ Ngọc Hân</td><td>2</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Đặng Tuấn Anh</td><td>2</td></tr>
</tbody>
</table>
<p><small>… 62 more rows (70 rows in total)</small></p>
<p>Example 15.2 as on the slide:</p>
<pre><code class="language-sql">SELECT *
FROM tblDepartment d JOIN tblEmployee e ON d.depNum=e.depNum
GO</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>mgrSSN</th><th>mgrAssDate</th><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>30121050010</td><td>2018-06-15</td><td>30121050005</td><td>Mai Duy An</td><td>7 Hàng Bài, Hoàn Kiếm, TP Hà Nội</td><td>55000</td><td>M</td><td>1992-05-30</td><td>2</td><td>30121050010</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>30121050010</td><td>2018-06-15</td><td>30121050010</td><td>Phạm Quốc Bảo</td><td>102 Kim Mã, Ba Đình, TP Hà Nội</td><td>95000</td><td>M</td><td>1978-09-09</td><td>2</td><td>30121050001</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>30121050010</td><td>2018-06-15</td><td>30121050011</td><td>Hồ Ngọc Hân</td><td>33 Cầu Giấy, TP Hà Nội</td><td>72000</td><td>F</td><td>1988-12-01</td><td>2</td><td>30121050010</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>30121050010</td><td>2018-06-15</td><td>30121050012</td><td>Đặng Tuấn Anh</td><td>5 Láng Hạ, Đống Đa, TP Hà Nội</td><td>105000</td><td>M</td><td>1970-04-18</td><td>2</td><td>30121050010</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>30121050020</td><td>2019-03-01</td><td>30121050020</td><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td><td>88000</td><td>F</td><td>1980-06-25</td><td>3</td><td>30121050001</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>30121050020</td><td>2019-03-01</td><td>30121050021</td><td>Bùi Văn Nam</td><td><em>NULL</em></td><td>40000</td><td>M</td><td>1998-02-14</td><td>3</td><td>30121050020</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>30121050020</td><td>2019-03-01</td><td>30121050027</td><td>Trương Thị Thu</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td><td>52000</td><td>F</td><td>1993-08-08</td><td>3</td><td>30121050020</td></tr>
<tr><td>4</td><td>Phòng Hành chính</td><td>30121050030</td><td>2020-09-01</td><td>30121050030</td><td>Huỳnh Văn Tài</td><td>9 Võ Văn Tần, Q.3, TP Hồ Chí Minh</td><td>70000</td><td>M</td><td>1975-10-10</td><td>4</td><td>30121050001</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td><td>30121050037</td><td>2022-01-10</td><td>30121050037</td><td>Lý Thanh Tâm</td><td>77 Hùng Vương, Hải Châu, TP Đà Nẵng</td><td>65000</td><td>F</td><td>1983-03-03</td><td>5</td><td>30121050001</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td><td>30121050037</td><td>2022-01-10</td><td>30121050038</td><td>Phan Hữu Nghĩa</td><td>3 Lý Thường Kiệt, TP Hà Nội</td><td>38000</td><td>M</td><td><em>NULL</em></td><td>5</td><td>30121050037</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>What happens</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblDepartment d JOIN tblEmployee e ON d.depNum = e.depNum</td><td>pairs with the same depNum</td><td>14</td></tr>
<tr><td>5</td><td>SELECT *</td><td>4 columns of d, then 8 of e</td><td>14</td></tr>
</tbody>
</table>
<p>The column order follows the FROM order: d's columns first. Every employee has a department, so no employee is lost; every department has at least one employee, so no department is lost either — in this data the inner join loses nothing (compare slide 64).</p>`,
        `<p class="y-chinh">🎯 Ví dụ 15.1 là tích của Department và Employee (5 × 14 = 70 dòng); Ví dụ 15.2 nối chúng theo depNum, cho mỗi phòng kèm các nhân viên của nó (14 dòng).</p>
<p>Slide chỉ có code của 15.2; đây là 15.1 viết bằng CROSS JOIN (8 dòng đầu trong 70 — để ý Mai Duy An của phòng 2 bị ghép với phòng 1):</p>
<pre><code class="language-sql">-- Ví dụ 15.1: tích của Department và Employee
SELECT d.depNum, d.depName, e.empName, e.depNum AS e_depNum
FROM tblDepartment d CROSS JOIN tblEmployee e
ORDER BY d.depNum, e.empSSN;</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>empName</th><th>e_depNum</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Trần Minh Quang</td><td>1</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Hoàng Thị Hà</td><td>1</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Võ Việt Anh</td><td>1</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Lê Thị Lan Anh</td><td>1</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Mai Duy An</td><td>2</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Phạm Quốc Bảo</td><td>2</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Hồ Ngọc Hân</td><td>2</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>Đặng Tuấn Anh</td><td>2</td></tr>
</tbody>
</table>
<p><small>… còn 62 dòng nữa (tổng 70 dòng)</small></p>
<p>Ví dụ 15.2 đúng như slide:</p>
<pre><code class="language-sql">SELECT *
FROM tblDepartment d JOIN tblEmployee e ON d.depNum=e.depNum
GO</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>mgrSSN</th><th>mgrAssDate</th><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>30121050001</td><td>2015-01-01</td><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>30121050010</td><td>2018-06-15</td><td>30121050005</td><td>Mai Duy An</td><td>7 Hàng Bài, Hoàn Kiếm, TP Hà Nội</td><td>55000</td><td>M</td><td>1992-05-30</td><td>2</td><td>30121050010</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>30121050010</td><td>2018-06-15</td><td>30121050010</td><td>Phạm Quốc Bảo</td><td>102 Kim Mã, Ba Đình, TP Hà Nội</td><td>95000</td><td>M</td><td>1978-09-09</td><td>2</td><td>30121050001</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>30121050010</td><td>2018-06-15</td><td>30121050011</td><td>Hồ Ngọc Hân</td><td>33 Cầu Giấy, TP Hà Nội</td><td>72000</td><td>F</td><td>1988-12-01</td><td>2</td><td>30121050010</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>30121050010</td><td>2018-06-15</td><td>30121050012</td><td>Đặng Tuấn Anh</td><td>5 Láng Hạ, Đống Đa, TP Hà Nội</td><td>105000</td><td>M</td><td>1970-04-18</td><td>2</td><td>30121050010</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>30121050020</td><td>2019-03-01</td><td>30121050020</td><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td><td>88000</td><td>F</td><td>1980-06-25</td><td>3</td><td>30121050001</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>30121050020</td><td>2019-03-01</td><td>30121050021</td><td>Bùi Văn Nam</td><td><em>NULL</em></td><td>40000</td><td>M</td><td>1998-02-14</td><td>3</td><td>30121050020</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>30121050020</td><td>2019-03-01</td><td>30121050027</td><td>Trương Thị Thu</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td><td>52000</td><td>F</td><td>1993-08-08</td><td>3</td><td>30121050020</td></tr>
<tr><td>4</td><td>Phòng Hành chính</td><td>30121050030</td><td>2020-09-01</td><td>30121050030</td><td>Huỳnh Văn Tài</td><td>9 Võ Văn Tần, Q.3, TP Hồ Chí Minh</td><td>70000</td><td>M</td><td>1975-10-10</td><td>4</td><td>30121050001</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td><td>30121050037</td><td>2022-01-10</td><td>30121050037</td><td>Lý Thanh Tâm</td><td>77 Hùng Vương, Hải Châu, TP Đà Nẵng</td><td>65000</td><td>F</td><td>1983-03-03</td><td>5</td><td>30121050001</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td><td>30121050037</td><td>2022-01-10</td><td>30121050038</td><td>Phan Hữu Nghĩa</td><td>3 Lý Thường Kiệt, TP Hà Nội</td><td>38000</td><td>M</td><td><em>NULL</em></td><td>5</td><td>30121050037</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Chuyện gì xảy ra</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblDepartment d JOIN tblEmployee e ON d.depNum = e.depNum</td><td>các cặp cùng depNum</td><td>14</td></tr>
<tr><td>5</td><td>SELECT *</td><td>4 cột của d, rồi 8 cột của e</td><td>14</td></tr>
</tbody>
</table>
<p>Thứ tự cột theo thứ tự trong FROM: cột của d trước. Nhân viên nào cũng có phòng nên không mất nhân viên nào; phòng nào cũng có ít nhất một nhân viên nên cũng không mất phòng nào — với dữ liệu này phép nối trong không làm mất gì (so với slide 64).</p>`],
      [60, 'SQL Join Expression - More Example',
        `<p class="y-chinh">🎯 The slide is titled "More Example" but its picture area is empty in the deck; here are two joins that complete the topic: a three-table join and a theta-join whose condition is not an equality.</p>
<p>(1) Who works on the projects of department 2, and how many hours — three tables, two JOINs, following the ERD path Employee — WorksOn — Project:</p>
<pre><code class="language-sql">-- who works on which project, how many hours: 3 tables, 2 joins
SELECT e.empName, p.proName, w.workHours
FROM tblEmployee e
JOIN tblWorksOn w ON e.empSSN = w.empSSN
JOIN tblProject p ON w.proNum = p.proNum
WHERE p.depNum = 2
ORDER BY p.proName, w.workHours DESC;</code></pre>
<table>
<thead><tr><th>empName</th><th>proName</th><th>workHours</th></tr></thead>
<tbody>
<tr><td>Hồ Ngọc Hân</td><td>ProjectC</td><td>30.0</td></tr>
<tr><td>Mai Duy An</td><td>ProjectC</td><td>25.0</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>ProjectC</td><td>15.0</td></tr>
<tr><td>Võ Việt Anh</td><td>ProjectC</td><td>10.0</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>ProjectD</td><td>30.0</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>ProjectD</td><td>20.0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>What happens</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM e JOIN w ON e.empSSN = w.empSSN</td><td>each work record with its employee</td><td>16</td></tr>
<tr><td>1</td><td>JOIN p ON w.proNum = p.proNum</td><td>+ its project</td><td>16</td></tr>
<tr><td>2</td><td>WHERE p.depNum = 2</td><td>projects C and D</td><td>6</td></tr>
<tr><td>5–6</td><td>SELECT … ORDER BY</td><td>3 columns, sorted</td><td>6</td></tr>
</tbody>
</table>
<p>(2) A theta-join with <code>&gt;</code>: who earns more than his own supervisor? Self-join + two conditions in ON:</p>
<pre><code class="language-sql">-- a theta join whose condition is NOT an equality: who earns more than his supervisor?
SELECT e.empName, e.empSalary, s.empName AS supervisor, s.empSalary AS supervisorSalary
FROM tblEmployee e
JOIN tblEmployee s ON e.supervisorSSN = s.empSSN AND e.empSalary &gt; s.empSalary;</code></pre>
<table>
<thead><tr><th>empName</th><th>empSalary</th><th>supervisor</th><th>supervisorSalary</th></tr></thead>
<tbody>
<tr><td>Đặng Tuấn Anh</td><td>105000</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>On PostgreSQL</strong> multi-table joins are written exactly the same. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-3-multi-self-join">PostgreSQL 5.3 — multi-table and self joins</a>.</div>`,
        `<p class="y-chinh">🎯 Slide có tiêu đề "More Example" nhưng phần hình trong bộ slide bị trống; đây là hai phép nối để làm trọn chủ đề: nối ba bảng và một phép nối theta có điều kiện không phải dấu bằng.</p>
<p>(1) Ai làm các dự án của phòng 2, bao nhiêu giờ — ba bảng, hai JOIN, đi theo đường trên ERD Employee — WorksOn — Project:</p>
<pre><code class="language-sql">-- ai làm dự án nào, bao nhiêu giờ: 3 bảng, 2 phép nối
SELECT e.empName, p.proName, w.workHours
FROM tblEmployee e
JOIN tblWorksOn w ON e.empSSN = w.empSSN
JOIN tblProject p ON w.proNum = p.proNum
WHERE p.depNum = 2
ORDER BY p.proName, w.workHours DESC;</code></pre>
<table>
<thead><tr><th>empName</th><th>proName</th><th>workHours</th></tr></thead>
<tbody>
<tr><td>Hồ Ngọc Hân</td><td>ProjectC</td><td>30.0</td></tr>
<tr><td>Mai Duy An</td><td>ProjectC</td><td>25.0</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>ProjectC</td><td>15.0</td></tr>
<tr><td>Võ Việt Anh</td><td>ProjectC</td><td>10.0</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>ProjectD</td><td>30.0</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>ProjectD</td><td>20.0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Chuyện gì xảy ra</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM e JOIN w ON e.empSSN = w.empSSN</td><td>mỗi bản ghi làm việc kèm nhân viên của nó</td><td>16</td></tr>
<tr><td>1</td><td>JOIN p ON w.proNum = p.proNum</td><td>+ dự án của nó</td><td>16</td></tr>
<tr><td>2</td><td>WHERE p.depNum = 2</td><td>dự án C và D</td><td>6</td></tr>
<tr><td>5–6</td><td>SELECT … ORDER BY</td><td>3 cột, sắp xếp</td><td>6</td></tr>
</tbody>
</table>
<p>(2) Phép nối theta với <code>&gt;</code>: ai lương cao hơn chính người giám sát mình? Tự nối + hai điều kiện trong ON:</p>
<pre><code class="language-sql">-- phép nối theta mà điều kiện KHÔNG phải dấu bằng: ai lương cao hơn người giám sát mình?
SELECT e.empName, e.empSalary, s.empName AS supervisor, s.empSalary AS supervisorSalary
FROM tblEmployee e
JOIN tblEmployee s ON e.supervisorSSN = s.empSSN AND e.empSalary &gt; s.empSalary;</code></pre>
<table>
<thead><tr><th>empName</th><th>empSalary</th><th>supervisor</th><th>supervisorSalary</th></tr></thead>
<tbody>
<tr><td>Đặng Tuấn Anh</td><td>105000</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> nối nhiều bảng viết y hệt. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-3-multi-self-join">PostgreSQL 5.3 — nối nhiều bảng và tự nối</a>.</div>`],
      [61, 'Natural Joins',
        `<p class="y-chinh">🎯 A natural join equates ALL pairs of columns with the same name and keeps one copy of each — and Microsoft SQL Server does not support NATURAL JOIN at all.</p>
<pre><code class="language-sql">SELECT * FROM tblDepartment NATURAL JOIN tblEmployee;
GO</code></pre>
<div class="out"><b>Msg 102, Level 15, State 1<br>
Incorrect syntax near ';'.</b></div>
<p>The error is strange: SQL Server reads <code>NATURAL</code> as an <strong>alias</strong> of tblDepartment, then finds a JOIN without ON. In SQL Server you always write <code>JOIN … ON</code> with the columns named explicitly.</p>
<div class="pitfall">Why NATURAL JOIN is dangerous even where it exists: it joins on every column with the same name, whether or not they mean the same thing. tblDependent.depName (a person) and tblDepartment.depName (a department) would be "joined" — see the 0 rows in the 🐘 box.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> NATURAL JOIN exists; the common column depNum appears once, first. <code>JOIN … USING (col)</code> is the safer middle ground: you name the common column yourself:
<pre><code class="language-sql">-- the only common column is depNum: it appears ONCE, first
SELECT depNum, depName, empName FROM tblDepartment NATURAL JOIN tblEmployee
WHERE depNum = 4;
-- the trap: tblDependent.depName (a person) meets tblDepartment.depName (a department)
SELECT COUNT(*) AS natural_rows FROM tblDependent NATURAL JOIN tblDepartment;
-- USING (depNum) = say explicitly which common column to join on
SELECT COUNT(*) AS using_rows FROM tblDepartment JOIN tblEmployee USING (depNum);</code></pre>
<table>
<thead><tr><th>depnum</th><th>depname</th><th>empname</th></tr></thead>
<tbody>
<tr><td>4</td><td>Phòng Hành chính</td><td>Huỳnh Văn Tài</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>natural_rows</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>using_rows</th></tr></thead>
<tbody>
<tr><td>14</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-4-cross-join-traps">PostgreSQL 5.4 — CROSS JOIN and join traps</a>.</div>`,
        `<p class="y-chinh">🎯 Nối tự nhiên (natural join) đặt bằng nhau MỌI cặp cột trùng tên và giữ mỗi cột một bản — và Microsoft SQL Server hoàn toàn không có NATURAL JOIN.</p>
<pre><code class="language-sql">SELECT * FROM tblDepartment NATURAL JOIN tblEmployee;
GO</code></pre>
<div class="out"><b>Msg 102, Level 15, State 1<br>
Incorrect syntax near ';'.</b></div>
<p>Thông báo lỗi trông lạ: SQL Server đọc <code>NATURAL</code> thành một <strong>bí danh</strong> của tblDepartment, rồi gặp một JOIN không có ON. Trong SQL Server bạn luôn viết <code>JOIN … ON</code> và ghi rõ các cột.</p>
<div class="pitfall">Vì sao NATURAL JOIN nguy hiểm ngay cả ở nơi có nó: nó nối theo mọi cột trùng tên, dù chúng có cùng nghĩa hay không. tblDependent.depName (tên người) và tblDepartment.depName (tên phòng) sẽ bị "nối" với nhau — xem 0 dòng trong ô 🐘.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> có NATURAL JOIN; cột chung depNum hiện một lần, đứng đầu. <code>JOIN … USING (cột)</code> là cách an toàn ở giữa: bạn tự nêu tên cột chung:
<pre><code class="language-sql">-- cột chung duy nhất là depNum: nó hiện MỘT lần, đứng đầu
SELECT depNum, depName, empName FROM tblDepartment NATURAL JOIN tblEmployee
WHERE depNum = 4;
-- cái bẫy: tblDependent.depName (tên người) gặp tblDepartment.depName (tên phòng)
SELECT COUNT(*) AS natural_rows FROM tblDependent NATURAL JOIN tblDepartment;
-- USING (depNum) = nói rõ nối theo cột chung nào
SELECT COUNT(*) AS using_rows FROM tblDepartment JOIN tblEmployee USING (depNum);</code></pre>
<table>
<thead><tr><th>depnum</th><th>depname</th><th>empname</th></tr></thead>
<tbody>
<tr><td>4</td><td>Phòng Hành chính</td><td>Huỳnh Văn Tài</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>natural_rows</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>using_rows</th></tr></thead>
<tbody>
<tr><td>14</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-4-cross-join-traps">PostgreSQL 5.4 — CROSS JOIN và các bẫy khi nối</a>.</div>`],
      [62, 'Outer Joins',
        `<p class="y-chinh">🎯 An outer join adds to the join result the dangling tuples (rows with no partner), padded with NULL: LEFT keeps those of the left table, RIGHT those of the right table, FULL those of both.</p>
<p>A tiny illustrative database makes all four visible: faculty GD has no student, student Dũng has no faculty.</p>
<pre><code class="language-sql">-- illustrative data: a faculty with no student, a student with no faculty
CREATE TABLE Khoa (maKhoa CHAR(2) PRIMARY KEY, tenKhoa NVARCHAR(30));
CREATE TABLE SinhVien (maSV CHAR(4) PRIMARY KEY, ten NVARCHAR(30), maKhoa CHAR(2) NULL);
INSERT INTO Khoa VALUES ('SE', N'Kỹ thuật phần mềm'), ('AI', N'Trí tuệ nhân tạo'), ('GD', N'Thiết kế đồ hoạ');
INSERT INTO SinhVien VALUES ('S001', N'An', 'SE'), ('S002', N'Bình', 'SE'), ('S003', N'Chi', 'AI'), ('S004', N'Dũng', NULL);
GO
SELECT k.tenKhoa, s.ten FROM Khoa k JOIN SinhVien s ON k.maKhoa = s.maKhoa ORDER BY s.maSV;             -- inner
SELECT k.tenKhoa, s.ten FROM Khoa k LEFT OUTER JOIN SinhVien s ON k.maKhoa = s.maKhoa ORDER BY k.maKhoa, s.maSV;  -- + dangling Khoa
SELECT k.tenKhoa, s.ten FROM Khoa k RIGHT OUTER JOIN SinhVien s ON k.maKhoa = s.maKhoa ORDER BY s.maSV;  -- + dangling SinhVien
SELECT k.tenKhoa, s.ten FROM Khoa k FULL OUTER JOIN SinhVien s ON k.maKhoa = s.maKhoa ORDER BY s.maSV;   -- + both</code></pre>
<div class="out">(3 rows affected)<br>
(4 rows affected)</div>
<table>
<thead><tr><th>tenKhoa</th><th>ten</th></tr></thead>
<tbody>
<tr><td>Kỹ thuật phần mềm</td><td>An</td></tr>
<tr><td>Kỹ thuật phần mềm</td><td>Bình</td></tr>
<tr><td>Trí tuệ nhân tạo</td><td>Chi</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>tenKhoa</th><th>ten</th></tr></thead>
<tbody>
<tr><td>Trí tuệ nhân tạo</td><td>Chi</td></tr>
<tr><td>Thiết kế đồ hoạ</td><td><em>NULL</em></td></tr>
<tr><td>Kỹ thuật phần mềm</td><td>An</td></tr>
<tr><td>Kỹ thuật phần mềm</td><td>Bình</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>tenKhoa</th><th>ten</th></tr></thead>
<tbody>
<tr><td>Kỹ thuật phần mềm</td><td>An</td></tr>
<tr><td>Kỹ thuật phần mềm</td><td>Bình</td></tr>
<tr><td>Trí tuệ nhân tạo</td><td>Chi</td></tr>
<tr><td><em>NULL</em></td><td>Dũng</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>tenKhoa</th><th>ten</th></tr></thead>
<tbody>
<tr><td>Thiết kế đồ hoạ</td><td><em>NULL</em></td></tr>
<tr><td>Kỹ thuật phần mềm</td><td>An</td></tr>
<tr><td>Kỹ thuật phần mềm</td><td>Bình</td></tr>
<tr><td>Trí tuệ nhân tạo</td><td>Chi</td></tr>
<tr><td><em>NULL</em></td><td>Dũng</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Join</th><th>Algebra</th><th>Rows</th><th>Dangling rows kept</th></tr></thead>
<tbody>
<tr><td>JOIN (inner)</td><td>⋈</td><td>3</td><td>none</td></tr>
<tr><td>LEFT OUTER JOIN</td><td>⟕</td><td>4</td><td>Thiết kế đồ hoạ + NULL</td></tr>
<tr><td>RIGHT OUTER JOIN</td><td>⟖</td><td>4</td><td>NULL + Dũng</td></tr>
<tr><td>FULL OUTER JOIN</td><td>⟗</td><td>5</td><td>both</td></tr>
</tbody>
</table>
<p class="meo">🧠 "Left" = the table written BEFORE the word JOIN. <code>A LEFT JOIN B</code> = <code>B RIGHT JOIN A</code>. The word OUTER is optional.</p>
<div class="pitfall">Count checks: |LEFT| = |inner| + dangling left rows; |FULL| = |inner| + dangling on both sides. If your LEFT JOIN has fewer rows than the left table, a WHERE is killing the NULL rows (slide 64).</div>`,
        `<p class="y-chinh">🎯 Phép nối ngoài (outer join) thêm vào kết quả nối các bộ treo (dangling tuple — dòng không có bạn ghép), đệm NULL: LEFT giữ dòng treo của bảng trái, RIGHT của bảng phải, FULL của cả hai.</p>
<p>Một CSDL minh hoạ nhỏ xíu cho thấy cả bốn: khoa GD chưa có sinh viên, sinh viên Dũng chưa có khoa.</p>
<pre><code class="language-sql">-- dữ liệu minh hoạ: một khoa chưa có sinh viên, một sinh viên chưa có khoa
CREATE TABLE Khoa (maKhoa CHAR(2) PRIMARY KEY, tenKhoa NVARCHAR(30));
CREATE TABLE SinhVien (maSV CHAR(4) PRIMARY KEY, ten NVARCHAR(30), maKhoa CHAR(2) NULL);
INSERT INTO Khoa VALUES ('SE', N'Kỹ thuật phần mềm'), ('AI', N'Trí tuệ nhân tạo'), ('GD', N'Thiết kế đồ hoạ');
INSERT INTO SinhVien VALUES ('S001', N'An', 'SE'), ('S002', N'Bình', 'SE'), ('S003', N'Chi', 'AI'), ('S004', N'Dũng', NULL);
GO
SELECT k.tenKhoa, s.ten FROM Khoa k JOIN SinhVien s ON k.maKhoa = s.maKhoa ORDER BY s.maSV;             -- nối trong
SELECT k.tenKhoa, s.ten FROM Khoa k LEFT OUTER JOIN SinhVien s ON k.maKhoa = s.maKhoa ORDER BY k.maKhoa, s.maSV;  -- + khoa treo
SELECT k.tenKhoa, s.ten FROM Khoa k RIGHT OUTER JOIN SinhVien s ON k.maKhoa = s.maKhoa ORDER BY s.maSV;  -- + sinh viên treo
SELECT k.tenKhoa, s.ten FROM Khoa k FULL OUTER JOIN SinhVien s ON k.maKhoa = s.maKhoa ORDER BY s.maSV;   -- + cả hai</code></pre>
<div class="out">(3 rows affected)<br>
(4 rows affected)</div>
<table>
<thead><tr><th>tenKhoa</th><th>ten</th></tr></thead>
<tbody>
<tr><td>Kỹ thuật phần mềm</td><td>An</td></tr>
<tr><td>Kỹ thuật phần mềm</td><td>Bình</td></tr>
<tr><td>Trí tuệ nhân tạo</td><td>Chi</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>tenKhoa</th><th>ten</th></tr></thead>
<tbody>
<tr><td>Trí tuệ nhân tạo</td><td>Chi</td></tr>
<tr><td>Thiết kế đồ hoạ</td><td><em>NULL</em></td></tr>
<tr><td>Kỹ thuật phần mềm</td><td>An</td></tr>
<tr><td>Kỹ thuật phần mềm</td><td>Bình</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>tenKhoa</th><th>ten</th></tr></thead>
<tbody>
<tr><td>Kỹ thuật phần mềm</td><td>An</td></tr>
<tr><td>Kỹ thuật phần mềm</td><td>Bình</td></tr>
<tr><td>Trí tuệ nhân tạo</td><td>Chi</td></tr>
<tr><td><em>NULL</em></td><td>Dũng</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>tenKhoa</th><th>ten</th></tr></thead>
<tbody>
<tr><td>Thiết kế đồ hoạ</td><td><em>NULL</em></td></tr>
<tr><td>Kỹ thuật phần mềm</td><td>An</td></tr>
<tr><td>Kỹ thuật phần mềm</td><td>Bình</td></tr>
<tr><td>Trí tuệ nhân tạo</td><td>Chi</td></tr>
<tr><td><em>NULL</em></td><td>Dũng</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Phép nối</th><th>Đại số</th><th>Số dòng</th><th>Dòng treo được giữ</th></tr></thead>
<tbody>
<tr><td>JOIN (nối trong)</td><td>⋈</td><td>3</td><td>không có</td></tr>
<tr><td>LEFT OUTER JOIN</td><td>⟕</td><td>4</td><td>Thiết kế đồ hoạ + NULL</td></tr>
<tr><td>RIGHT OUTER JOIN</td><td>⟖</td><td>4</td><td>NULL + Dũng</td></tr>
<tr><td>FULL OUTER JOIN</td><td>⟗</td><td>5</td><td>cả hai</td></tr>
</tbody>
</table>
<p class="meo">🧠 "Trái" = bảng viết TRƯỚC chữ JOIN. <code>A LEFT JOIN B</code> = <code>B RIGHT JOIN A</code>. Chữ OUTER có thể bỏ.</p>
<div class="pitfall">Phép kiểm bằng cách đếm: |LEFT| = |nối trong| + số dòng treo bên trái; |FULL| = |nối trong| + dòng treo cả hai bên. Nếu LEFT JOIN của bạn có ít dòng hơn bảng trái, có một WHERE đang giết các dòng NULL (slide 64).</div>`],
      [63, 'Outer joins - Example 17.1',
        `<p class="y-chinh">🎯 Example 17.1 lists, for EACH location, the projects processed there — LEFT OUTER JOIN keeps TP Cần Thơ, which has no project, with NULLs.</p>
<pre><code class="language-sql">/*17.1*/
SELECT l.locNum,l.locName,p.proNum,p.proName
FROM tblLocation l LEFT OUTER JOIN tblProject p ON l.locNum=p.locNum;
GO</code></pre>
<table>
<thead><tr><th>locNum</th><th>locName</th><th>proNum</th><th>proName</th></tr></thead>
<tbody>
<tr><td>1</td><td>TP Hà Nội</td><td>1</td><td>ProjectA</td></tr>
<tr><td>1</td><td>TP Hà Nội</td><td>3</td><td>ProjectC</td></tr>
<tr><td>2</td><td>TP Hồ Chí Minh</td><td>2</td><td>ProjectB</td></tr>
<tr><td>2</td><td>TP Hồ Chí Minh</td><td>4</td><td>ProjectD</td></tr>
<tr><td>2</td><td>TP Hồ Chí Minh</td><td>6</td><td>ProjectF</td></tr>
<tr><td>3</td><td>TP Đà Nẵng</td><td>5</td><td>ProjectE</td></tr>
<tr><td>4</td><td>TP Cần Thơ</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>What happens</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1a</td><td>tblLocation l JOIN tblProject p ON l.locNum = p.locNum</td><td>the matching pairs (inner part)</td><td>6</td></tr>
<tr><td>1b</td><td>LEFT OUTER: add the dangling left rows</td><td>TP Cần Thơ + NULL, NULL</td><td>7</td></tr>
<tr><td>5</td><td>SELECT 4 columns</td><td>proNum, proName are NULL for Cần Thơ</td><td>7</td></tr>
</tbody>
</table>
<p>Compare with the inner join, and the classic way to list ONLY the dangling rows ("locations with no project"):</p>
<pre><code class="language-sql">-- with an inner JOIN, TP Cần Thơ disappears
SELECT COUNT(*) AS inner_rows FROM tblLocation l JOIN tblProject p ON l.locNum = p.locNum;
-- the dangling locations alone: LEFT JOIN + IS NULL
SELECT l.locNum, l.locName
FROM tblLocation l LEFT JOIN tblProject p ON l.locNum = p.locNum
WHERE p.proNum IS NULL;</code></pre>
<table>
<thead><tr><th>inner_rows</th></tr></thead>
<tbody>
<tr><td>6</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>locNum</th><th>locName</th></tr></thead>
<tbody>
<tr><td>4</td><td>TP Cần Thơ</td></tr>
</tbody>
</table>
<p class="meo">🧠 "For each X, list its Y" — or any question with "including those that have none" — means LEFT JOIN from X.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> LEFT/RIGHT/FULL JOIN are identical. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-2-outer-join">PostgreSQL 5.2 — outer joins</a>.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 17.1 liệt kê, với MỖI địa điểm, các dự án thực hiện ở đó — LEFT OUTER JOIN giữ lại TP Cần Thơ, nơi không có dự án nào, với các giá trị NULL.</p>
<pre><code class="language-sql">/*17.1*/
SELECT l.locNum,l.locName,p.proNum,p.proName
FROM tblLocation l LEFT OUTER JOIN tblProject p ON l.locNum=p.locNum;
GO</code></pre>
<table>
<thead><tr><th>locNum</th><th>locName</th><th>proNum</th><th>proName</th></tr></thead>
<tbody>
<tr><td>1</td><td>TP Hà Nội</td><td>1</td><td>ProjectA</td></tr>
<tr><td>1</td><td>TP Hà Nội</td><td>3</td><td>ProjectC</td></tr>
<tr><td>2</td><td>TP Hồ Chí Minh</td><td>2</td><td>ProjectB</td></tr>
<tr><td>2</td><td>TP Hồ Chí Minh</td><td>4</td><td>ProjectD</td></tr>
<tr><td>2</td><td>TP Hồ Chí Minh</td><td>6</td><td>ProjectF</td></tr>
<tr><td>3</td><td>TP Đà Nẵng</td><td>5</td><td>ProjectE</td></tr>
<tr><td>4</td><td>TP Cần Thơ</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Chuyện gì xảy ra</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1a</td><td>tblLocation l JOIN tblProject p ON l.locNum = p.locNum</td><td>các cặp khớp (phần nối trong)</td><td>6</td></tr>
<tr><td>1b</td><td>LEFT OUTER: thêm dòng treo bên trái</td><td>TP Cần Thơ + NULL, NULL</td><td>7</td></tr>
<tr><td>5</td><td>SELECT 4 cột</td><td>proNum, proName là NULL với Cần Thơ</td><td>7</td></tr>
</tbody>
</table>
<p>So với phép nối trong, và cách kinh điển để liệt kê CHỈ các dòng treo ("các địa điểm không có dự án"):</p>
<pre><code class="language-sql">-- với JOIN thường, TP Cần Thơ biến mất
SELECT COUNT(*) AS inner_rows FROM tblLocation l JOIN tblProject p ON l.locNum = p.locNum;
-- riêng các địa điểm treo: LEFT JOIN + IS NULL
SELECT l.locNum, l.locName
FROM tblLocation l LEFT JOIN tblProject p ON l.locNum = p.locNum
WHERE p.proNum IS NULL;</code></pre>
<table>
<thead><tr><th>inner_rows</th></tr></thead>
<tbody>
<tr><td>6</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>locNum</th><th>locName</th></tr></thead>
<tbody>
<tr><td>4</td><td>TP Cần Thơ</td></tr>
</tbody>
</table>
<p class="meo">🧠 "Với mỗi X, liệt kê các Y của nó" — hay câu nào có "kể cả những cái không có" — nghĩa là LEFT JOIN xuất phát từ X.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> LEFT/RIGHT/FULL JOIN y hệt. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-2-outer-join">PostgreSQL 5.2 — nối ngoài</a>.</div>`],
      [64, 'Outer joins - Example 17.2',
        `<p class="y-chinh">🎯 Example 17.2 lists, for each department, the projects it controls — Phòng Nghiên cứu controls none and appears with proName NULL.</p>
<pre><code class="language-sql">/*17.2*/
SELECT d.depName,p.proName
FROM tblDepartment d LEFT OUTER JOIN tblProject p ON d.depNum=p.depNum
GO</code></pre>
<table>
<thead><tr><th>depName</th><th>proName</th></tr></thead>
<tbody>
<tr><td>Phòng Phần mềm trong nước</td><td>ProjectA</td></tr>
<tr><td>Phòng Phần mềm trong nước</td><td>ProjectB</td></tr>
<tr><td>Phòng Phần mềm nước ngoài</td><td>ProjectC</td></tr>
<tr><td>Phòng Phần mềm nước ngoài</td><td>ProjectD</td></tr>
<tr><td>Phòng Kinh doanh</td><td>ProjectE</td></tr>
<tr><td>Phòng Hành chính</td><td>ProjectF</td></tr>
<tr><td>Phòng Nghiên cứu</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p>Execution: inner part 6 pairs (one per project) + 1 dangling department = 7 rows. Now the trap that costs the most marks with outer joins — where to put an extra condition:</p>
<pre><code class="language-sql">-- condition in ON: every department stays, only projects at location 2 are attached
SELECT d.depName, p.proName
FROM tblDepartment d LEFT JOIN tblProject p ON d.depNum = p.depNum AND p.locNum = 2
ORDER BY d.depNum;
-- the same condition in WHERE: the NULL rows are thrown away, it became an inner join
SELECT d.depName, p.proName
FROM tblDepartment d LEFT JOIN tblProject p ON d.depNum = p.depNum
WHERE p.locNum = 2
ORDER BY d.depNum;</code></pre>
<table>
<thead><tr><th>depName</th><th>proName</th></tr></thead>
<tbody>
<tr><td>Phòng Phần mềm trong nước</td><td>ProjectB</td></tr>
<tr><td>Phòng Phần mềm nước ngoài</td><td>ProjectD</td></tr>
<tr><td>Phòng Kinh doanh</td><td><em>NULL</em></td></tr>
<tr><td>Phòng Hành chính</td><td>ProjectF</td></tr>
<tr><td>Phòng Nghiên cứu</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depName</th><th>proName</th></tr></thead>
<tbody>
<tr><td>Phòng Phần mềm trong nước</td><td>ProjectB</td></tr>
<tr><td>Phòng Phần mềm nước ngoài</td><td>ProjectD</td></tr>
<tr><td>Phòng Hành chính</td><td>ProjectF</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Condition <code>p.locNum = 2</code> placed in</th><th>Evaluated</th><th>Effect</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>ON</td><td>during the join (step 1)</td><td>only projects in HCMC are attached; departments without such a project stay with NULL</td><td>5</td></tr>
<tr><td>WHERE</td><td>after the join (step 2)</td><td>NULL = 2 is UNKNOWN → every padded row is removed: the outer join became an inner join</td><td>3</td></tr>
</tbody>
</table>
<div class="pitfall">Conditions on the <strong>right</strong> table of a LEFT JOIN belong in ON. A condition in WHERE on a right-table column (other than <code>IS NULL</code>) silently removes the rows the LEFT JOIN was written to keep.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 17.2 liệt kê, với mỗi phòng, các dự án nó quản lý — Phòng Nghiên cứu không quản lý dự án nào và hiện ra với proName NULL.</p>
<pre><code class="language-sql">/*17.2*/
SELECT d.depName,p.proName
FROM tblDepartment d LEFT OUTER JOIN tblProject p ON d.depNum=p.depNum
GO</code></pre>
<table>
<thead><tr><th>depName</th><th>proName</th></tr></thead>
<tbody>
<tr><td>Phòng Phần mềm trong nước</td><td>ProjectA</td></tr>
<tr><td>Phòng Phần mềm trong nước</td><td>ProjectB</td></tr>
<tr><td>Phòng Phần mềm nước ngoài</td><td>ProjectC</td></tr>
<tr><td>Phòng Phần mềm nước ngoài</td><td>ProjectD</td></tr>
<tr><td>Phòng Kinh doanh</td><td>ProjectE</td></tr>
<tr><td>Phòng Hành chính</td><td>ProjectF</td></tr>
<tr><td>Phòng Nghiên cứu</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p>Thực thi: phần nối trong 6 cặp (mỗi dự án một cặp) + 1 phòng treo = 7 dòng. Giờ là cái bẫy làm mất điểm nhiều nhất với nối ngoài — đặt thêm điều kiện ở đâu:</p>
<pre><code class="language-sql">-- điều kiện ở ON: mọi phòng còn nguyên, chỉ gắn dự án ở địa điểm 2
SELECT d.depName, p.proName
FROM tblDepartment d LEFT JOIN tblProject p ON d.depNum = p.depNum AND p.locNum = 2
ORDER BY d.depNum;
-- cùng điều kiện đặt ở WHERE: các dòng NULL bị vứt, thành nối trong
SELECT d.depName, p.proName
FROM tblDepartment d LEFT JOIN tblProject p ON d.depNum = p.depNum
WHERE p.locNum = 2
ORDER BY d.depNum;</code></pre>
<table>
<thead><tr><th>depName</th><th>proName</th></tr></thead>
<tbody>
<tr><td>Phòng Phần mềm trong nước</td><td>ProjectB</td></tr>
<tr><td>Phòng Phần mềm nước ngoài</td><td>ProjectD</td></tr>
<tr><td>Phòng Kinh doanh</td><td><em>NULL</em></td></tr>
<tr><td>Phòng Hành chính</td><td>ProjectF</td></tr>
<tr><td>Phòng Nghiên cứu</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depName</th><th>proName</th></tr></thead>
<tbody>
<tr><td>Phòng Phần mềm trong nước</td><td>ProjectB</td></tr>
<tr><td>Phòng Phần mềm nước ngoài</td><td>ProjectD</td></tr>
<tr><td>Phòng Hành chính</td><td>ProjectF</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Điều kiện <code>p.locNum = 2</code> đặt ở</th><th>Được xét lúc</th><th>Tác dụng</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>ON</td><td>trong lúc nối (bước 1)</td><td>chỉ gắn dự án ở TP HCM; phòng không có dự án như vậy vẫn ở lại với NULL</td><td>5</td></tr>
<tr><td>WHERE</td><td>sau khi nối (bước 2)</td><td>NULL = 2 là UNKNOWN → mọi dòng được đệm bị loại: nối ngoài thành nối trong</td><td>3</td></tr>
</tbody>
</table>
<div class="pitfall">Điều kiện trên bảng <strong>bên phải</strong> của LEFT JOIN phải đặt ở ON. Điều kiện ở WHERE trên một cột của bảng phải (trừ <code>IS NULL</code>) lặng lẽ xoá đúng những dòng mà LEFT JOIN được viết ra để giữ.</div>`],
      [65, '6.4 Full-Relation Operations',
        `<p class="y-chinh">🎯 Section 6.4 of the deck: operations that act on a relation as a whole rather than on one tuple at a time — duplicate elimination, bag set operations, grouping and aggregation.</p>
<p>Until now each row was tested alone (WHERE) or paired with another (joins). From here the question becomes "how many distinct…", "how many per…", "the average of…" — the result depends on many rows together. Slides 66–82 build up to GROUP BY and HAVING.</p>`,
        `<p class="y-chinh">🎯 Mục 6.4 của bộ slide: các phép tác động lên cả một quan hệ thay vì từng bộ một — loại bỏ trùng lặp, phép tập hợp trên túi, gom nhóm và hàm gộp.</p>
<p>Tới giờ mỗi dòng được thử riêng (WHERE) hoặc được ghép với dòng khác (phép nối). Từ đây câu hỏi thành "có bao nhiêu … khác nhau", "mỗi … có bao nhiêu", "trung bình của …" — kết quả phụ thuộc vào nhiều dòng cùng lúc. Slide 66–82 dẫn tới GROUP BY và HAVING.</p>`],
      [66, 'Eliminating Duplicates',
        `<p class="y-chinh">🎯 A relation in theory is a set (no duplicate tuples), but an SQL result is a bag: SELECT keeps duplicates by default, and DISTINCT removes them.</p>
<pre><code class="language-sql">-- a bag: 14 rows, the same sex many times
SELECT COUNT(*) AS bag_rows FROM (SELECT empSex FROM tblEmployee) t;
-- a set: each value once
SELECT DISTINCT empSex FROM tblEmployee;</code></pre>
<table>
<thead><tr><th>bag_rows</th></tr></thead>
<tbody>
<tr><td>14</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSex</th></tr></thead>
<tbody>
<tr><td>F</td></tr>
<tr><td>M</td></tr>
</tbody>
</table>
<ul>
<li><code>SELECT empSex FROM tblEmployee</code> returns 14 rows — F and M repeated — because SQL does not check for duplicates unless asked.</li>
<li>Why not always remove them? Removing duplicates means sorting or hashing the whole result — costly on big tables — and sometimes the duplicates are information (two employees with the same salary are two people).</li>
<li>DISTINCT works on the <strong>whole output row</strong>, not on the first column only.</li>
</ul>
<div class="pitfall"><code>SELECT DISTINCT empName, empSalary</code> removes rows that are identical in BOTH columns; it does not give "each name once". And DISTINCT is not a function: <code>DISTINCT(a), b</code> still applies to (a, b).</div>`,
        `<p class="y-chinh">🎯 Về lý thuyết một quan hệ là một tập (không có bộ trùng), nhưng kết quả SQL là một túi (bag): SELECT mặc định giữ bản trùng, còn DISTINCT thì bỏ chúng.</p>
<pre><code class="language-sql">-- một túi: 14 dòng, cùng giới tính lặp nhiều lần
SELECT COUNT(*) AS bag_rows FROM (SELECT empSex FROM tblEmployee) t;
-- một tập: mỗi giá trị một lần
SELECT DISTINCT empSex FROM tblEmployee;</code></pre>
<table>
<thead><tr><th>bag_rows</th></tr></thead>
<tbody>
<tr><td>14</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSex</th></tr></thead>
<tbody>
<tr><td>F</td></tr>
<tr><td>M</td></tr>
</tbody>
</table>
<ul>
<li><code>SELECT empSex FROM tblEmployee</code> trả về 14 dòng — F và M lặp lại — vì SQL không kiểm tra trùng trừ khi được yêu cầu.</li>
<li>Sao không luôn bỏ trùng? Bỏ trùng nghĩa là phải sắp xếp hoặc băm (hash) cả kết quả — tốn kém với bảng lớn — và đôi khi bản trùng là thông tin (hai nhân viên cùng lương là hai con người).</li>
<li>DISTINCT làm trên <strong>cả dòng đầu ra</strong>, không chỉ trên cột đầu tiên.</li>
</ul>
<div class="pitfall"><code>SELECT DISTINCT empName, empSalary</code> bỏ các dòng giống nhau ở CẢ HAI cột; nó không cho "mỗi tên một lần". Và DISTINCT không phải hàm: <code>DISTINCT(a), b</code> vẫn áp dụng cho (a, b).</div>`],
      [67, 'Eliminating Duplicates - Example 17.3',
        `<p class="y-chinh">🎯 Example 17.3 lists the locations where projects are processed; joining locations with projects repeats a location once per project, and DISTINCT keeps each location once.</p>
<p>The slide shows the same query twice, both with DISTINCT; the red line "Location name is repeated many times" describes the first one <strong>without</strong> DISTINCT. Both versions:</p>
<pre><code class="language-sql">-- without DISTINCT: one row per project
SELECT l.locNum, l.locName
FROM tblLocation l JOIN tblProject p ON l.locNum=p.locNum;
-- with DISTINCT
SELECT DISTINCT l.locNum, l.locName
FROM tblLocation l JOIN tblProject p ON l.locNum=p.locNum;</code></pre>
<table>
<thead><tr><th>locNum</th><th>locName</th></tr></thead>
<tbody>
<tr><td>1</td><td>TP Hà Nội</td></tr>
<tr><td>2</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>1</td><td>TP Hà Nội</td></tr>
<tr><td>2</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>3</td><td>TP Đà Nẵng</td></tr>
<tr><td>2</td><td>TP Hồ Chí Minh</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>locNum</th><th>locName</th></tr></thead>
<tbody>
<tr><td>1</td><td>TP Hà Nội</td></tr>
<tr><td>2</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>3</td><td>TP Đà Nẵng</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>What happens</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM l JOIN p ON l.locNum = p.locNum</td><td>one row per project</td><td>6</td></tr>
<tr><td>5a</td><td>SELECT l.locNum, l.locName</td><td>HCMC 3 times, Hà Nội twice</td><td>6</td></tr>
<tr><td>5b</td><td>DISTINCT</td><td>each location once</td><td>3</td></tr>
</tbody>
</table>
<p>An equivalent without duplicates to remove: <code>SELECT locNum, locName FROM tblLocation l WHERE EXISTS (SELECT * FROM tblProject p WHERE p.locNum = l.locNum)</code> — each location is tested once, so it can appear only once.</p>
<p class="meo">🧠 Join from the "one" side to the "many" side (location → projects) multiplies the "one" rows. Asked for a list of the "one" side? Add DISTINCT, or use EXISTS.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> DISTINCT is the same; PostgreSQL also has <code>DISTINCT ON (col)</code> to keep the first row of each group — no SQL Server equivalent. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT, DISTINCT</a>.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 17.3 liệt kê các địa điểm có dự án thực hiện; nối địa điểm với dự án làm mỗi địa điểm lặp lại một lần cho mỗi dự án, và DISTINCT giữ mỗi địa điểm một lần.</p>
<p>Slide đưa cùng một câu hai lần, cả hai đều có DISTINCT; dòng chữ đỏ "Location name is repeated many times" (tên địa điểm bị lặp nhiều lần) mô tả câu đầu <strong>không có</strong> DISTINCT. Cả hai bản:</p>
<pre><code class="language-sql">-- không DISTINCT: mỗi dự án một dòng
SELECT l.locNum, l.locName
FROM tblLocation l JOIN tblProject p ON l.locNum=p.locNum;
-- có DISTINCT
SELECT DISTINCT l.locNum, l.locName
FROM tblLocation l JOIN tblProject p ON l.locNum=p.locNum;</code></pre>
<table>
<thead><tr><th>locNum</th><th>locName</th></tr></thead>
<tbody>
<tr><td>1</td><td>TP Hà Nội</td></tr>
<tr><td>2</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>1</td><td>TP Hà Nội</td></tr>
<tr><td>2</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>3</td><td>TP Đà Nẵng</td></tr>
<tr><td>2</td><td>TP Hồ Chí Minh</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>locNum</th><th>locName</th></tr></thead>
<tbody>
<tr><td>1</td><td>TP Hà Nội</td></tr>
<tr><td>2</td><td>TP Hồ Chí Minh</td></tr>
<tr><td>3</td><td>TP Đà Nẵng</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Chuyện gì xảy ra</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM l JOIN p ON l.locNum = p.locNum</td><td>mỗi dự án một dòng</td><td>6</td></tr>
<tr><td>5a</td><td>SELECT l.locNum, l.locName</td><td>TP HCM 3 lần, Hà Nội 2 lần</td><td>6</td></tr>
<tr><td>5b</td><td>DISTINCT</td><td>mỗi địa điểm một lần</td><td>3</td></tr>
</tbody>
</table>
<p>Một cách tương đương không sinh bản trùng: <code>SELECT locNum, locName FROM tblLocation l WHERE EXISTS (SELECT * FROM tblProject p WHERE p.locNum = l.locNum)</code> — mỗi địa điểm chỉ được thử một lần, nên chỉ xuất hiện được một lần.</p>
<p class="meo">🧠 Nối từ phía "một" sang phía "nhiều" (địa điểm → dự án) sẽ nhân bản các dòng phía "một". Đề hỏi danh sách phía "một"? Thêm DISTINCT, hoặc dùng EXISTS.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> DISTINCT y hệt; PostgreSQL còn có <code>DISTINCT ON (cột)</code> để giữ dòng đầu tiên của mỗi nhóm — SQL Server không có tương đương. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT, DISTINCT</a>.</div>`],
    ]),
    books([
      ['ullman', 'Ullman &amp; Widom (3e) — §6.3.4–6.3.8 Correlated subqueries, subqueries in FROM, join expressions, natural and outer joins; §6.4.1 Eliminating duplicates', 'Ullman &amp; Widom (3e) — §6.3.4–6.3.8 Truy vấn con tương quan, truy vấn con trong FROM, biểu thức nối, nối tự nhiên và nối ngoài; §6.4.1 Loại bỏ trùng lặp'],
      ['ramakrishnan', 'Ramakrishnan &amp; Gehrke — ch. 5.4.2 Correlated nested queries; 5.6.4 Outer joins', 'Ramakrishnan &amp; Gehrke — mục 5.4.2 Truy vấn lồng tương quan; 5.6.4 Nối ngoài'],
    ]),
  ].join('\n'),
};

/* ───────── 6.D — 📑 Slide by slide · Bags, aggregates, GROUP BY, NULLs and HAVING (Chapter 6, slides 68–82) ───────── */
const L_dbi7_6 = {
  title: '6.D — 📑 Slide by slide · Bags, aggregates, GROUP BY, NULLs and HAVING (Chapter 6, slides 68–82)|||6.D — 📑 Học theo từng slide · Túi, hàm gộp, GROUP BY, NULL và HAVING (Chapter 6, slide 68–82)',
  slug: 'dbi202-slide-dbi7-6',
  type: 'VIDEO',
  description: 'Giảng từng slide 68–82 của bộ slide Chapter 6 của trường (phần 2): UNION/INTERSECT/EXCEPT ALL trên túi, gom nhóm, năm hàm gộp SUM/AVG/MIN/MAX/COUNT (Example 18), GROUP BY và cách máy hiểu nó (Example 19–20), NULL trong gộp và nhóm, WHERE khác HAVING, thứ tự thực thi đủ sáu mệnh đề, HAVING (Example 21 và slide 82 — có sửa lỗi slide) — mỗi câu vẽ bảng trước/sau khi nhóm, chạy thật trên FUHCompany, ô 🐘 PostgreSQL ở mọi chỗ cú pháp khác.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.D · school slides "Chapter 6", part 2 (slides 22–82)</span>
<h2>Bags, grouping, aggregation and HAVING</h2>
<p class="lead">School "Chapter 6" slides, part 2 — this lesson covers the last slides, 68–82 (part 1, slides 1–21, is in Chapter 5 of this website). "How many employees per department", "departments whose average salary exceeds…": every PE has at least one GROUP BY question, and interviewers love WHERE vs HAVING.</p>
<div class="callout"><strong>The full execution order, now with all six steps used.</strong> FROM → WHERE (filter <strong>rows</strong>) → GROUP BY (make groups) → HAVING (filter <strong>groups</strong>) → SELECT (one output row per group) → ORDER BY. After GROUP BY, the query no longer sees individual rows — only groups — so SELECT and HAVING may use only grouping columns and aggregates.</div>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>You must be able to</th></tr></thead>
<tbody>
<tr><td>68</td><td>UNION / INTERSECT / EXCEPT ALL</td><td>count the rows of bag operations; know SQL Server has only UNION ALL</td></tr>
<tr><td>69–71</td><td>five aggregates (Example 18)</td><td>SUM, AVG, MIN, MAX, COUNT(*) vs COUNT(col) vs COUNT(DISTINCT col)</td></tr>
<tr><td>72–75</td><td>GROUP BY (Example 19–20)</td><td>draw the groups; know what may appear in SELECT</td></tr>
<tr><td>76–77</td><td>NULL in aggregation</td><td>predict COUNT and SUM when values are NULL or the bag is empty</td></tr>
<tr><td>78–82</td><td>HAVING (Example 21)</td><td>choose WHERE or HAVING; order the six clauses</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 6 · Bài 6.D · slide "Chapter 6" của trường, phần 2 (slide 22–82)</span>
<h2>Túi, gom nhóm, hàm gộp và HAVING</h2>
<p class="lead">Slide Chapter 6 của trường, phần 2 — bài này học các slide cuối, 68–82 (phần 1, slide 1–21, ở Chương 5 của web). "Mỗi phòng có bao nhiêu nhân viên", "các phòng có lương trung bình trên…": đề PE nào cũng có ít nhất một câu GROUP BY, và người phỏng vấn rất thích hỏi WHERE khác HAVING thế nào.</p>
<div class="callout"><strong>Thứ tự thực thi đầy đủ, giờ dùng đủ cả sáu bước.</strong> FROM → WHERE (lọc <strong>dòng</strong>) → GROUP BY (tạo nhóm) → HAVING (lọc <strong>nhóm</strong>) → SELECT (mỗi nhóm một dòng đầu ra) → ORDER BY. Sau GROUP BY, câu truy vấn không còn thấy từng dòng — chỉ thấy các nhóm — nên SELECT và HAVING chỉ được dùng cột nhóm và hàm gộp.</div>
<table>
<thead><tr><th>Slide</th><th>Ý chính</th><th>Bạn phải làm được</th></tr></thead>
<tbody>
<tr><td>68</td><td>UNION / INTERSECT / EXCEPT ALL</td><td>đếm số dòng của phép trên túi; biết SQL Server chỉ có UNION ALL</td></tr>
<tr><td>69–71</td><td>năm hàm gộp (Ví dụ 18)</td><td>SUM, AVG, MIN, MAX, COUNT(*) khác COUNT(cột) khác COUNT(DISTINCT cột)</td></tr>
<tr><td>72–75</td><td>GROUP BY (Ví dụ 19–20)</td><td>vẽ được các nhóm; biết cái gì được đứng trong SELECT</td></tr>
<tr><td>76–77</td><td>NULL trong phép gộp</td><td>đoán đúng COUNT và SUM khi giá trị NULL hoặc túi rỗng</td></tr>
<tr><td>78–82</td><td>HAVING (Ví dụ 21)</td><td>chọn WHERE hay HAVING; xếp đúng thứ tự sáu mệnh đề</td></tr>
</tbody>
</table>`),
    walkHead('dbi7', 68, 82),
    walk('dbi7', [
      [68, 'Duplicates in Unions, Intersections, and Differences',
        `<p class="y-chinh">🎯 UNION, INTERSECT and EXCEPT remove duplicates automatically (set semantics); adding ALL keeps them (bag semantics) — <code>R UNION ALL S</code>, <code>R INTERSECT ALL S</code>, <code>R EXCEPT ALL S</code>.</p>
<p>Take R = the locations of departments (tblDepLocation, 8 rows) and S = the locations of projects (tblProject, 6 rows):</p>
<pre><code class="language-sql">-- R = locations of departments (8 rows), S = locations of projects (6 rows)
SELECT locNum FROM tblDepLocation
UNION
SELECT locNum FROM tblProject;
GO
SELECT COUNT(*) AS union_all_rows FROM (
  SELECT locNum FROM tblDepLocation
  UNION ALL
  SELECT locNum FROM tblProject) AS t;
GO</code></pre>
<table>
<thead><tr><th>locNum</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>2</td></tr>
<tr><td>3</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>union_all_rows</th></tr></thead>
<tbody>
<tr><td>14</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Operation</th><th>Rule for a value appearing n times in R and m times in S</th><th>Rows here</th></tr></thead>
<tbody>
<tr><td>UNION</td><td>once if n + m &gt; 0</td><td>3 (1, 2, 3)</td></tr>
<tr><td>UNION ALL</td><td>n + m copies</td><td>8 + 6 = 14</td></tr>
<tr><td>INTERSECT ALL</td><td>MIN(n, m) copies</td><td>loc 1: min(3,2)=2, loc 2: min(3,3)=3, loc 3: min(2,1)=1 → 6</td></tr>
<tr><td>EXCEPT ALL</td><td>MAX(n − m, 0) copies</td><td>loc 1: 1, loc 2: 0, loc 3: 1 → 2</td></tr>
</tbody>
</table>
<p>But the slide's second and third lines do not run on SQL Server:</p>
<pre><code class="language-sql">SELECT locNum FROM tblDepLocation
INTERSECT ALL
SELECT locNum FROM tblProject;
GO</code></pre>
<div class="out"><b>Msg 324, Level 15, State 1<br>
The 'ALL' version of the INTERSECT operator is not supported.</b></div>
<p class="meo">🧠 UNION ALL is also <strong>faster</strong> than UNION (no duplicate check). When you know the two sides cannot overlap, prefer UNION ALL.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> all three ALL forms exist and follow the rules of the table exactly:
<pre><code class="language-sql">-- how many times each location appears in R and in S
SELECT locNum,
       (SELECT COUNT(*) FROM tblDepLocation d WHERE d.locNum = l.locNum) AS in_R,
       (SELECT COUNT(*) FROM tblProject p WHERE p.locNum = l.locNum) AS in_S
FROM tblLocation l ORDER BY locNum;
-- INTERSECT ALL keeps MIN(in_R, in_S) copies
SELECT locNum FROM tblDepLocation
INTERSECT ALL
SELECT locNum FROM tblProject
ORDER BY locNum;
-- EXCEPT ALL keeps in_R - in_S copies (never below 0)
SELECT locNum FROM tblDepLocation
EXCEPT ALL
SELECT locNum FROM tblProject
ORDER BY locNum;</code></pre>
<table>
<thead><tr><th>locnum</th><th>in_r</th><th>in_s</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>2</td></tr>
<tr><td>2</td><td>3</td><td>3</td></tr>
<tr><td>3</td><td>2</td><td>1</td></tr>
<tr><td>4</td><td>0</td><td>0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>locnum</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>1</td></tr>
<tr><td>2</td></tr>
<tr><td>2</td></tr>
<tr><td>2</td></tr>
<tr><td>3</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>locnum</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>3</td></tr>
</tbody>
</table>
Lessons: <a href="/courses/postgresql/learn?lessonSlug=postgresql-7-1-subquery">PostgreSQL 7.1 — subqueries and set operators</a>.</div>`,
        `<p class="y-chinh">🎯 UNION, INTERSECT và EXCEPT tự động bỏ bản trùng (ngữ nghĩa tập); thêm ALL thì giữ chúng (ngữ nghĩa túi) — <code>R UNION ALL S</code>, <code>R INTERSECT ALL S</code>, <code>R EXCEPT ALL S</code>.</p>
<p>Lấy R = địa điểm của các phòng (tblDepLocation, 8 dòng) và S = địa điểm của các dự án (tblProject, 6 dòng):</p>
<pre><code class="language-sql">-- R = địa điểm của các phòng (8 dòng), S = địa điểm của các dự án (6 dòng)
SELECT locNum FROM tblDepLocation
UNION
SELECT locNum FROM tblProject;
GO
SELECT COUNT(*) AS union_all_rows FROM (
  SELECT locNum FROM tblDepLocation
  UNION ALL
  SELECT locNum FROM tblProject) AS t;
GO</code></pre>
<table>
<thead><tr><th>locNum</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>2</td></tr>
<tr><td>3</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>union_all_rows</th></tr></thead>
<tbody>
<tr><td>14</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Phép</th><th>Luật cho một giá trị xuất hiện n lần trong R và m lần trong S</th><th>Số dòng ở đây</th></tr></thead>
<tbody>
<tr><td>UNION</td><td>một lần nếu n + m &gt; 0</td><td>3 (1, 2, 3)</td></tr>
<tr><td>UNION ALL</td><td>n + m bản</td><td>8 + 6 = 14</td></tr>
<tr><td>INTERSECT ALL</td><td>MIN(n, m) bản</td><td>đ.điểm 1: min(3,2)=2, đ.điểm 2: min(3,3)=3, đ.điểm 3: min(2,1)=1 → 6</td></tr>
<tr><td>EXCEPT ALL</td><td>MAX(n − m, 0) bản</td><td>đ.điểm 1: 1, đ.điểm 2: 0, đ.điểm 3: 1 → 2</td></tr>
</tbody>
</table>
<p>Nhưng dòng thứ hai và thứ ba trên slide không chạy được trên SQL Server:</p>
<pre><code class="language-sql">SELECT locNum FROM tblDepLocation
INTERSECT ALL
SELECT locNum FROM tblProject;
GO</code></pre>
<div class="out"><b>Msg 324, Level 15, State 1<br>
The 'ALL' version of the INTERSECT operator is not supported.</b></div>
<p class="meo">🧠 UNION ALL còn <strong>nhanh hơn</strong> UNION (không phải kiểm trùng). Khi biết chắc hai vế không chồng lên nhau, hãy dùng UNION ALL.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> có đủ cả ba dạng ALL và tuân đúng các luật trong bảng:
<pre><code class="language-sql">-- mỗi địa điểm xuất hiện mấy lần trong R và trong S
SELECT locNum,
       (SELECT COUNT(*) FROM tblDepLocation d WHERE d.locNum = l.locNum) AS in_R,
       (SELECT COUNT(*) FROM tblProject p WHERE p.locNum = l.locNum) AS in_S
FROM tblLocation l ORDER BY locNum;
-- INTERSECT ALL giữ MIN(in_R, in_S) bản
SELECT locNum FROM tblDepLocation
INTERSECT ALL
SELECT locNum FROM tblProject
ORDER BY locNum;
-- EXCEPT ALL giữ in_R - in_S bản (không âm)
SELECT locNum FROM tblDepLocation
EXCEPT ALL
SELECT locNum FROM tblProject
ORDER BY locNum;</code></pre>
<table>
<thead><tr><th>locnum</th><th>in_r</th><th>in_s</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>2</td></tr>
<tr><td>2</td><td>3</td><td>3</td></tr>
<tr><td>3</td><td>2</td><td>1</td></tr>
<tr><td>4</td><td>0</td><td>0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>locnum</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>1</td></tr>
<tr><td>2</td></tr>
<tr><td>2</td></tr>
<tr><td>2</td></tr>
<tr><td>3</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>locnum</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>3</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-7-1-subquery">PostgreSQL 7.1 — truy vấn con và phép tập hợp</a>.</div>`],
      [69, 'Grouping and Aggregation in SQL',
        `<p class="y-chinh">🎯 Grouping partitions the rows into groups that share the same value of one or more attributes; then an aggregate summarises each group; SQL writes this with GROUP BY.</p>
<p>Picture it with the employees sorted by department — each department is a block (a group); GROUP BY squeezes each block into ONE output row:</p>
<pre><code class="language-sql">-- before grouping: rows sorted so that each department forms a block
SELECT depNum, empName, empSalary FROM tblEmployee ORDER BY depNum, empSalary DESC;
-- after grouping: ONE row per block, the other columns are aggregated
SELECT depNum, COUNT(*) AS n, SUM(empSalary) AS total_salary
FROM tblEmployee
GROUP BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>1</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>1</td><td>Võ Việt Anh</td><td>60000</td></tr>
<tr><td>1</td><td>Lê Thị Lan Anh</td><td>45000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>2</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>2</td><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>2</td><td>Mai Duy An</td><td>55000</td></tr>
<tr><td>3</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>3</td><td>Trương Thị Thu</td><td>52000</td></tr>
<tr><td>3</td><td>Bùi Văn Nam</td><td>40000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
<tr><td>5</td><td>Phan Hữu Nghĩa</td><td>38000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>n</th><th>total_salary</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td><td>345000</td></tr>
<tr><td>2</td><td>4</td><td>327000</td></tr>
<tr><td>3</td><td>3</td><td>180000</td></tr>
<tr><td>4</td><td>1</td><td>70000</td></tr>
<tr><td>5</td><td>2</td><td>103000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Group depNum</th><th>Rows in the group</th><th>COUNT(*)</th><th>SUM(empSalary)</th></tr></thead>
<tbody>
<tr><td>1</td><td>Quang, Hà, Việt Anh, Lan Anh</td><td>4</td><td>150000+90000+60000+45000 = 345000</td></tr>
<tr><td>2</td><td>Tuấn Anh, Bảo, Hân, An</td><td>4</td><td>327000</td></tr>
<tr><td>3</td><td>Mai, Thu, Nam</td><td>3</td><td>180000</td></tr>
<tr><td>4</td><td>Tài</td><td>1</td><td>70000</td></tr>
<tr><td>5</td><td>Tâm, Nghĩa</td><td>2</td><td>103000</td></tr>
</tbody>
</table>
<p class="meo">🧠 This is the algebra's γ (Chapter 2, school slides "Chapter 5"): γ<sub>depNum, COUNT(*), SUM(empSalary)</sub>(tblEmployee).</p>`,
        `<p class="y-chinh">🎯 Gom nhóm (grouping) chia các dòng thành những nhóm có cùng giá trị ở một hay nhiều thuộc tính; rồi một hàm gộp (aggregate) tóm tắt mỗi nhóm; SQL viết việc này bằng GROUP BY.</p>
<p>Hình dung bằng danh sách nhân viên sắp theo phòng — mỗi phòng là một khối (một nhóm); GROUP BY ép mỗi khối thành MỘT dòng đầu ra:</p>
<pre><code class="language-sql">-- trước khi nhóm: sắp dòng để mỗi phòng thành một khối
SELECT depNum, empName, empSalary FROM tblEmployee ORDER BY depNum, empSalary DESC;
-- sau khi nhóm: MỘT dòng mỗi khối, các cột khác được gộp
SELECT depNum, COUNT(*) AS n, SUM(empSalary) AS total_salary
FROM tblEmployee
GROUP BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>1</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>1</td><td>Võ Việt Anh</td><td>60000</td></tr>
<tr><td>1</td><td>Lê Thị Lan Anh</td><td>45000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>2</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>2</td><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>2</td><td>Mai Duy An</td><td>55000</td></tr>
<tr><td>3</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>3</td><td>Trương Thị Thu</td><td>52000</td></tr>
<tr><td>3</td><td>Bùi Văn Nam</td><td>40000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
<tr><td>5</td><td>Phan Hữu Nghĩa</td><td>38000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>n</th><th>total_salary</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td><td>345000</td></tr>
<tr><td>2</td><td>4</td><td>327000</td></tr>
<tr><td>3</td><td>3</td><td>180000</td></tr>
<tr><td>4</td><td>1</td><td>70000</td></tr>
<tr><td>5</td><td>2</td><td>103000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Nhóm depNum</th><th>Các dòng trong nhóm</th><th>COUNT(*)</th><th>SUM(empSalary)</th></tr></thead>
<tbody>
<tr><td>1</td><td>Quang, Hà, Việt Anh, Lan Anh</td><td>4</td><td>150000+90000+60000+45000 = 345000</td></tr>
<tr><td>2</td><td>Tuấn Anh, Bảo, Hân, An</td><td>4</td><td>327000</td></tr>
<tr><td>3</td><td>Mai, Thu, Nam</td><td>3</td><td>180000</td></tr>
<tr><td>4</td><td>Tài</td><td>1</td><td>70000</td></tr>
<tr><td>5</td><td>Tâm, Nghĩa</td><td>2</td><td>103000</td></tr>
</tbody>
</table>
<p class="meo">🧠 Đây chính là phép γ của đại số (Chương 2, slide "Chapter 5" của trường): γ<sub>depNum, COUNT(*), SUM(empSalary)</sub>(tblEmployee).</p>`],
      [70, 'Aggregation Operators',
        `<p class="y-chinh">🎯 Five aggregation operators: SUM, AVG, MIN, MAX on one column, and COUNT on a column or on whole rows (<code>*</code>); DISTINCT inside removes duplicates before aggregating.</p>
<pre><code class="language-sql">SELECT SUM(empSalary)            AS [SUM],
       AVG(empSalary)            AS [AVG],
       MIN(empSalary)            AS [MIN],
       MAX(empSalary)            AS [MAX],
       COUNT(*)                  AS [COUNT(*)],
       COUNT(empBirthdate)       AS [COUNT(empBirthdate)],
       COUNT(DISTINCT depNum)    AS [COUNT(DISTINCT depNum)]
FROM tblEmployee;
-- MIN and MAX also work on text and dates
SELECT MIN(empName) AS first_name_az, MAX(empBirthdate) AS youngest_birthdate FROM tblEmployee;
-- AVG of an INT column is an INT on SQL Server
SELECT AVG(proNum) AS avg_int, AVG(proNum * 1.0) AS avg_decimal FROM tblWorksOn;</code></pre>
<table>
<thead><tr><th>SUM</th><th>AVG</th><th>MIN</th><th>MAX</th><th>COUNT(*)</th><th>COUNT(empBirthdate)</th><th>COUNT(DISTINCT depNum)</th></tr></thead>
<tbody>
<tr><td>1025000</td><td>73214.285714</td><td>38000</td><td>150000</td><td>14</td><td>13</td><td>5</td></tr>
</tbody>
</table>
<div class="out">Warning: Null value is eliminated by an aggregate or other SET operation.<br>
(1 row affected)</div>
<table>
<thead><tr><th>first_name_az</th><th>youngest_birthdate</th></tr></thead>
<tbody>
<tr><td>Bùi Văn Nam</td><td>1998-02-14</td></tr>
</tbody>
</table>
<div class="out">Warning: Null value is eliminated by an aggregate or other SET operation.<br>
(1 row affected)</div>
<table>
<thead><tr><th>avg_int</th><th>avg_decimal</th></tr></thead>
<tbody>
<tr><td>3</td><td>3.125000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Aggregate</th><th>Value</th><th>Note</th></tr></thead>
<tbody>
<tr><td>SUM(empSalary)</td><td>1025000</td><td>total of 14 salaries</td></tr>
<tr><td>AVG(empSalary)</td><td>73214.285714</td><td>SUM / number of non-NULL values</td></tr>
<tr><td>MIN / MAX</td><td>38000 / 150000</td><td></td></tr>
<tr><td>COUNT(*)</td><td>14</td><td>counts rows</td></tr>
<tr><td>COUNT(empBirthdate)</td><td>13</td><td>counts non-NULL values (Phan Hữu Nghĩa's is NULL)</td></tr>
<tr><td>COUNT(DISTINCT depNum)</td><td>5</td><td>different departments</td></tr>
</tbody>
</table>
<ul>
<li>The slide says MIN and MAX act on a "numeric column" — in fact they work on any ordered type: <code>MIN(empName)</code> is the first name alphabetically, <code>MAX(empBirthdate)</code> the youngest person.</li>
<li>The "Warning: Null value is eliminated…" message is SQL Server telling you an aggregate skipped NULLs (slide 76) — not an error.</li>
<li>AVG of an INT column is an INT on SQL Server: 3.125 is cut to 3. Multiply by 1.0 (or CAST) first.</li>
</ul>
<div class="callout">🐘 <strong>On PostgreSQL</strong> AVG of an integer column returns a numeric with decimals — the 3 of SQL Server becomes 3.125; <code>round(x, n)</code> chooses the decimals:
<pre><code class="language-sql">-- PostgreSQL: AVG of an integer column returns a numeric with decimals
SELECT AVG(proNum) AS avg_int FROM tblWorksOn;
-- round() to choose the number of decimals
SELECT round(AVG(empSalary), 2) AS avg_salary FROM tblEmployee;</code></pre>
<table>
<thead><tr><th>avg_int</th></tr></thead>
<tbody>
<tr><td>3.1250000000000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>avg_salary</th></tr></thead>
<tbody>
<tr><td>73214.29</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-1-ham-tong-hop">PostgreSQL 6.1 — aggregate functions</a>.</div>`,
        `<p class="y-chinh">🎯 Năm hàm gộp: SUM (tổng), AVG (trung bình), MIN (nhỏ nhất), MAX (lớn nhất) trên một cột, và COUNT (đếm) trên một cột hoặc trên cả dòng (<code>*</code>); DISTINCT đặt bên trong bỏ bản trùng trước khi gộp.</p>
<pre><code class="language-sql">SELECT SUM(empSalary)            AS [SUM],
       AVG(empSalary)            AS [AVG],
       MIN(empSalary)            AS [MIN],
       MAX(empSalary)            AS [MAX],
       COUNT(*)                  AS [COUNT(*)],
       COUNT(empBirthdate)       AS [COUNT(empBirthdate)],
       COUNT(DISTINCT depNum)    AS [COUNT(DISTINCT depNum)]
FROM tblEmployee;
-- MIN và MAX dùng được cả với chữ và ngày
SELECT MIN(empName) AS first_name_az, MAX(empBirthdate) AS youngest_birthdate FROM tblEmployee;
-- AVG của cột INT ra INT trên SQL Server
SELECT AVG(proNum) AS avg_int, AVG(proNum * 1.0) AS avg_decimal FROM tblWorksOn;</code></pre>
<table>
<thead><tr><th>SUM</th><th>AVG</th><th>MIN</th><th>MAX</th><th>COUNT(*)</th><th>COUNT(empBirthdate)</th><th>COUNT(DISTINCT depNum)</th></tr></thead>
<tbody>
<tr><td>1025000</td><td>73214.285714</td><td>38000</td><td>150000</td><td>14</td><td>13</td><td>5</td></tr>
</tbody>
</table>
<div class="out">Warning: Null value is eliminated by an aggregate or other SET operation.<br>
(1 row affected)</div>
<table>
<thead><tr><th>first_name_az</th><th>youngest_birthdate</th></tr></thead>
<tbody>
<tr><td>Bùi Văn Nam</td><td>1998-02-14</td></tr>
</tbody>
</table>
<div class="out">Warning: Null value is eliminated by an aggregate or other SET operation.<br>
(1 row affected)</div>
<table>
<thead><tr><th>avg_int</th><th>avg_decimal</th></tr></thead>
<tbody>
<tr><td>3</td><td>3.125000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Hàm gộp</th><th>Giá trị</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>SUM(empSalary)</td><td>1025000</td><td>tổng 14 mức lương</td></tr>
<tr><td>AVG(empSalary)</td><td>73214.285714</td><td>SUM / số giá trị khác NULL</td></tr>
<tr><td>MIN / MAX</td><td>38000 / 150000</td><td></td></tr>
<tr><td>COUNT(*)</td><td>14</td><td>đếm dòng</td></tr>
<tr><td>COUNT(empBirthdate)</td><td>13</td><td>đếm giá trị khác NULL (của Phan Hữu Nghĩa là NULL)</td></tr>
<tr><td>COUNT(DISTINCT depNum)</td><td>5</td><td>số phòng khác nhau</td></tr>
</tbody>
</table>
<ul>
<li>Slide nói MIN và MAX làm trên "cột số" — thật ra chúng làm được với mọi kiểu có thứ tự: <code>MIN(empName)</code> là tên đứng đầu theo bảng chữ cái, <code>MAX(empBirthdate)</code> là người trẻ nhất.</li>
<li>Thông báo "Warning: Null value is eliminated…" (cảnh báo: giá trị NULL đã bị bỏ qua) là SQL Server báo cho bạn biết hàm gộp đã bỏ qua NULL (slide 76) — không phải lỗi.</li>
<li>AVG của cột INT ra INT trên SQL Server: 3,125 bị cắt còn 3. Nhân với 1.0 (hoặc CAST) trước.</li>
</ul>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> AVG của cột số nguyên trả về numeric có phần lẻ — số 3 của SQL Server thành 3.125; <code>round(x, n)</code> để chọn số chữ số lẻ:
<pre><code class="language-sql">-- PostgreSQL: AVG của cột số nguyên trả về numeric có phần lẻ
SELECT AVG(proNum) AS avg_int FROM tblWorksOn;
-- dùng round() để chọn số chữ số lẻ
SELECT round(AVG(empSalary), 2) AS avg_salary FROM tblEmployee;</code></pre>
<table>
<thead><tr><th>avg_int</th></tr></thead>
<tbody>
<tr><td>3.1250000000000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>avg_salary</th></tr></thead>
<tbody>
<tr><td>73214.29</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-1-ham-tong-hop">PostgreSQL 6.1 — hàm tổng hợp</a>.</div>`],
      [71, 'Aggregation Operators - Example 18.1 and 18.2',
        `<p class="y-chinh">🎯 Example 18.1 computes the average salary of all employees, Example 18.2 counts the employees — without GROUP BY the whole table is ONE group, so each query returns exactly one row.</p>
<pre><code class="language-sql">/*18.1*/
SELECT AVG(empSalary) AS Average_Of_Salary
FROM tblEmployee
GO
/*18.2*/
SELECT COUNT(*) AS Count_Of_Employees
FROM tblEmployee
GO</code></pre>
<table>
<thead><tr><th>Average_Of_Salary</th></tr></thead>
<tbody>
<tr><td>73214.285714</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Count_Of_Employees</th></tr></thead>
<tbody>
<tr><td>14</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>What happens</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee</td><td>14 rows</td><td>14</td></tr>
<tr><td>3</td><td>(no GROUP BY)</td><td>the whole table is one group</td><td>1 group</td></tr>
<tr><td>5</td><td>SELECT AVG(empSalary) / COUNT(*)</td><td>one value per group, renamed</td><td>1</td></tr>
</tbody>
</table>
<p>1025000 / 14 = 73214.285714…; SQL Server shows 6 decimals because AVG of a DECIMAL(10,0) returns DECIMAL(38,6).</p>
<div class="pitfall"><code>SELECT empName, AVG(empSalary) FROM tblEmployee</code> is an error (Msg 8120): one output row, but 14 different names — which one? Once an aggregate appears without GROUP BY, every other column must be aggregated too. "The employee with the highest salary" needs a subquery or TOP, not <code>SELECT empName, MAX(empSalary)</code>.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 18.1 tính lương trung bình của mọi nhân viên, Ví dụ 18.2 đếm số nhân viên — không có GROUP BY thì cả bảng là MỘT nhóm, nên mỗi câu trả về đúng một dòng.</p>
<pre><code class="language-sql">/*18.1*/
SELECT AVG(empSalary) AS Average_Of_Salary
FROM tblEmployee
GO
/*18.2*/
SELECT COUNT(*) AS Count_Of_Employees
FROM tblEmployee
GO</code></pre>
<table>
<thead><tr><th>Average_Of_Salary</th></tr></thead>
<tbody>
<tr><td>73214.285714</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Count_Of_Employees</th></tr></thead>
<tbody>
<tr><td>14</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Chuyện gì xảy ra</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee</td><td>14 dòng</td><td>14</td></tr>
<tr><td>3</td><td>(không có GROUP BY)</td><td>cả bảng là một nhóm</td><td>1 nhóm</td></tr>
<tr><td>5</td><td>SELECT AVG(empSalary) / COUNT(*)</td><td>mỗi nhóm một giá trị, đổi tên</td><td>1</td></tr>
</tbody>
</table>
<p>1025000 / 14 = 73214,285714…; SQL Server hiện 6 chữ số lẻ vì AVG của DECIMAL(10,0) trả về DECIMAL(38,6).</p>
<div class="pitfall"><code>SELECT empName, AVG(empSalary) FROM tblEmployee</code> là lỗi (Msg 8120): một dòng đầu ra, mà có 14 cái tên khác nhau — lấy tên nào? Khi đã có hàm gộp mà không có GROUP BY, mọi cột khác cũng phải được gộp. "Nhân viên có lương cao nhất" cần truy vấn con hoặc TOP, không phải <code>SELECT empName, MAX(empSalary)</code>.</div>`],
      [72, 'Grouping - syntax',
        `<p class="y-chinh">🎯 GROUP BY comes after WHERE: <code>SELECT … FROM … WHERE … GROUP BY list of attributes</code> — rows are filtered first, the survivors are grouped.</p>
<pre><code class="language-sql">-- WHERE first (only women), then GROUP BY
SELECT depNum, COUNT(*) AS women
FROM tblEmployee
WHERE empSex = 'F'
GROUP BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>women</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>2</td><td>1</td></tr>
<tr><td>3</td><td>2</td></tr>
<tr><td>5</td><td>1</td></tr>
</tbody>
</table>
<p>Execution: FROM (14) → WHERE empSex = 'F' (6 women) → GROUP BY depNum (4 groups — department 4 has no woman, so it has no group at all, not a group with 0) → SELECT one row per group.</p>
<p>Because GROUP BY runs before SELECT, it cannot use an alias made in SELECT:</p>
<pre><code class="language-sql">-- GROUP BY cannot see an alias made in SELECT (GROUP BY runs first)
SELECT CASE WHEN empSalary &gt;= 80000 THEN 'high' ELSE 'normal' END AS band, COUNT(*) AS n
FROM tblEmployee
GROUP BY band;
GO
-- SQL Server: repeat the whole expression
SELECT CASE WHEN empSalary &gt;= 80000 THEN 'high' ELSE 'normal' END AS band, COUNT(*) AS n
FROM tblEmployee
GROUP BY CASE WHEN empSalary &gt;= 80000 THEN 'high' ELSE 'normal' END;
GO</code></pre>
<div class="out"><b>Msg 207, Level 16, State 1<br>
Invalid column name 'band'.</b></div>
<table>
<thead><tr><th>band</th><th>n</th></tr></thead>
<tbody>
<tr><td>high</td><td>5</td></tr>
<tr><td>normal</td><td>9</td></tr>
</tbody>
</table>
<div class="pitfall">A group exists only if at least one row reaches it. "Number of women in EACH department, 0 included" needs a LEFT JOIN from tblDepartment (practice exercise 8), not WHERE + GROUP BY.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> GROUP BY may use an output alias or a position number, so the expression need not be repeated:
<pre><code class="language-sql">SELECT CASE WHEN empSalary &gt;= 80000 THEN 'high' ELSE 'normal' END AS band, COUNT(*) AS n
FROM tblEmployee
GROUP BY band                 -- PostgreSQL accepts the alias (or GROUP BY 1)
ORDER BY band;</code></pre>
<table>
<thead><tr><th>band</th><th>n</th></tr></thead>
<tbody>
<tr><td>high</td><td>5</td></tr>
<tr><td>normal</td><td>9</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-2-group-by">PostgreSQL 6.2 — GROUP BY</a>.</div>`,
        `<p class="y-chinh">🎯 GROUP BY đứng sau WHERE: <code>SELECT … FROM … WHERE … GROUP BY danh sách thuộc tính</code> — lọc dòng trước, những dòng còn lại mới được gom nhóm.</p>
<pre><code class="language-sql">-- WHERE trước (chỉ nữ), rồi GROUP BY
SELECT depNum, COUNT(*) AS women
FROM tblEmployee
WHERE empSex = 'F'
GROUP BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>women</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>2</td><td>1</td></tr>
<tr><td>3</td><td>2</td></tr>
<tr><td>5</td><td>1</td></tr>
</tbody>
</table>
<p>Thực thi: FROM (14) → WHERE empSex = 'F' (6 người nữ) → GROUP BY depNum (4 nhóm — phòng 4 không có nữ nên không có nhóm nào cả, chứ không phải một nhóm bằng 0) → SELECT mỗi nhóm một dòng.</p>
<p>Vì GROUP BY chạy trước SELECT, nó không dùng được bí danh đặt ở SELECT:</p>
<pre><code class="language-sql">-- GROUP BY không thấy bí danh đặt ở SELECT (GROUP BY chạy trước)
SELECT CASE WHEN empSalary &gt;= 80000 THEN 'high' ELSE 'normal' END AS band, COUNT(*) AS n
FROM tblEmployee
GROUP BY band;
GO
-- SQL Server: lặp lại cả biểu thức
SELECT CASE WHEN empSalary &gt;= 80000 THEN 'high' ELSE 'normal' END AS band, COUNT(*) AS n
FROM tblEmployee
GROUP BY CASE WHEN empSalary &gt;= 80000 THEN 'high' ELSE 'normal' END;
GO</code></pre>
<div class="out"><b>Msg 207, Level 16, State 1<br>
Invalid column name 'band'.</b></div>
<table>
<thead><tr><th>band</th><th>n</th></tr></thead>
<tbody>
<tr><td>high</td><td>5</td></tr>
<tr><td>normal</td><td>9</td></tr>
</tbody>
</table>
<div class="pitfall">Một nhóm chỉ tồn tại nếu có ít nhất một dòng tới được nó. "Số nhân viên nữ của TỪNG phòng, kể cả 0" cần LEFT JOIN từ tblDepartment (bài thực hành 8), không phải WHERE + GROUP BY.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> GROUP BY dùng được bí danh đầu ra hoặc số thứ tự cột, không phải lặp lại biểu thức:
<pre><code class="language-sql">SELECT CASE WHEN empSalary &gt;= 80000 THEN 'high' ELSE 'normal' END AS band, COUNT(*) AS n
FROM tblEmployee
GROUP BY band                 -- PostgreSQL nhận bí danh (hoặc GROUP BY 1)
ORDER BY band;</code></pre>
<table>
<thead><tr><th>band</th><th>n</th></tr></thead>
<tbody>
<tr><td>high</td><td>5</td></tr>
<tr><td>normal</td><td>9</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-2-group-by">PostgreSQL 6.2 — GROUP BY</a>.</div>`],
      [73, 'Grouping - Example 19.1 and 19.2',
        `<p class="y-chinh">🎯 Example 19.1 only SORTS the employees by department (every row stays); Example 19.2 really GROUPS them and counts each department, ordered by that count.</p>
<pre><code class="language-sql">/*19.1*/
SELECT *
FROM tblEmployee
ORDER BY depNum
GO
/*19.2*/
SELECT depNum, COUNT(*) AS Num_Of_Employees
FROM tblEmployee
GROUP BY depNum
ORDER BY count(*) ASC
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>7 Hàng Bài, Hoàn Kiếm, TP Hà Nội</td><td>55000</td><td>M</td><td>1992-05-30</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>102 Kim Mã, Ba Đình, TP Hà Nội</td><td>95000</td><td>M</td><td>1978-09-09</td><td>2</td><td>30121050001</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>33 Cầu Giấy, TP Hà Nội</td><td>72000</td><td>F</td><td>1988-12-01</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>5 Láng Hạ, Đống Đa, TP Hà Nội</td><td>105000</td><td>M</td><td>1970-04-18</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050020</td><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td><td>88000</td><td>F</td><td>1980-06-25</td><td>3</td><td>30121050001</td></tr>
<tr><td>30121050021</td><td>Bùi Văn Nam</td><td><em>NULL</em></td><td>40000</td><td>M</td><td>1998-02-14</td><td>3</td><td>30121050020</td></tr>
<tr><td>30121050027</td><td>Trương Thị Thu</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td><td>52000</td><td>F</td><td>1993-08-08</td><td>3</td><td>30121050020</td></tr>
<tr><td>30121050030</td><td>Huỳnh Văn Tài</td><td>9 Võ Văn Tần, Q.3, TP Hồ Chí Minh</td><td>70000</td><td>M</td><td>1975-10-10</td><td>4</td><td>30121050001</td></tr>
<tr><td>30121050037</td><td>Lý Thanh Tâm</td><td>77 Hùng Vương, Hải Châu, TP Đà Nẵng</td><td>65000</td><td>F</td><td>1983-03-03</td><td>5</td><td>30121050001</td></tr>
<tr><td>30121050038</td><td>Phan Hữu Nghĩa</td><td>3 Lý Thường Kiệt, TP Hà Nội</td><td>38000</td><td>M</td><td><em>NULL</em></td><td>5</td><td>30121050037</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>Num_Of_Employees</th></tr></thead>
<tbody>
<tr><td>4</td><td>1</td></tr>
<tr><td>5</td><td>2</td></tr>
<tr><td>3</td><td>3</td></tr>
<tr><td>1</td><td>4</td></tr>
<tr><td>2</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th></th><th>19.1 ORDER BY depNum</th><th>19.2 GROUP BY depNum</th></tr></thead>
<tbody>
<tr><td>Rows out</td><td>14 (one per employee)</td><td>5 (one per department)</td></tr>
<tr><td>Columns</td><td>all 8</td><td>depNum + the count</td></tr>
<tr><td>What it answers</td><td>"show employees department by department"</td><td>"how many employees per department"</td></tr>
</tbody>
</table>
<p>19.2 in execution order: FROM (14) → GROUP BY depNum (5 groups) → SELECT depNum, COUNT(*) → ORDER BY count(*) ASC — an aggregate is allowed in ORDER BY because ORDER BY runs after grouping. Ties (1 and 2 both have 4) keep no guaranteed order.</p>
<p>What may appear in SELECT after GROUP BY: grouping columns and aggregates, nothing else:</p>
<pre><code class="language-sql">-- empName is neither grouped nor aggregated
SELECT depNum, empName, COUNT(*) AS n
FROM tblEmployee
GROUP BY depNum;
GO</code></pre>
<div class="out"><b>Msg 8120, Level 16, State 1<br>
Column 'tblEmployee.empName' is invalid in the select list because it is not contained in either an aggregate function or the GROUP BY clause.</b></div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the same error appears for empName — except in one case: if you group by a table's <strong>primary key</strong>, the other columns of that table are allowed (they depend functionally on the key — Chapter 4's FD). SQL Server would require <code>GROUP BY d.depNum, d.depName</code>:
<pre><code class="language-sql">-- PostgreSQL allows d.depName here: it depends on the primary key d.depNum that is grouped
SELECT d.depNum, d.depName, COUNT(e.empSSN) AS n
FROM tblDepartment d JOIN tblEmployee e ON e.depNum = d.depNum
GROUP BY d.depNum
ORDER BY n, d.depNum;</code></pre>
<table>
<thead><tr><th>depnum</th><th>depname</th><th>n</th></tr></thead>
<tbody>
<tr><td>4</td><td>Phòng Hành chính</td><td>1</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td><td>2</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>3</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>4</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>4</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-2-group-by">PostgreSQL 6.2 — GROUP BY</a>.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 19.1 chỉ SẮP XẾP nhân viên theo phòng (mọi dòng vẫn còn); Ví dụ 19.2 mới thật sự GOM NHÓM và đếm từng phòng, sắp theo số đếm đó.</p>
<pre><code class="language-sql">/*19.1*/
SELECT *
FROM tblEmployee
ORDER BY depNum
GO
/*19.2*/
SELECT depNum, COUNT(*) AS Num_Of_Employees
FROM tblEmployee
GROUP BY depNum
ORDER BY count(*) ASC
GO</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050005</td><td>Mai Duy An</td><td>7 Hàng Bài, Hoàn Kiếm, TP Hà Nội</td><td>55000</td><td>M</td><td>1992-05-30</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050010</td><td>Phạm Quốc Bảo</td><td>102 Kim Mã, Ba Đình, TP Hà Nội</td><td>95000</td><td>M</td><td>1978-09-09</td><td>2</td><td>30121050001</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>33 Cầu Giấy, TP Hà Nội</td><td>72000</td><td>F</td><td>1988-12-01</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050012</td><td>Đặng Tuấn Anh</td><td>5 Láng Hạ, Đống Đa, TP Hà Nội</td><td>105000</td><td>M</td><td>1970-04-18</td><td>2</td><td>30121050010</td></tr>
<tr><td>30121050020</td><td>Nguyễn Thị Mai</td><td>60 Bạch Đằng, Hải Châu, TP Đà Nẵng</td><td>88000</td><td>F</td><td>1980-06-25</td><td>3</td><td>30121050001</td></tr>
<tr><td>30121050021</td><td>Bùi Văn Nam</td><td><em>NULL</em></td><td>40000</td><td>M</td><td>1998-02-14</td><td>3</td><td>30121050020</td></tr>
<tr><td>30121050027</td><td>Trương Thị Thu</td><td>14 Nguyễn Văn Linh, TP Đà Nẵng</td><td>52000</td><td>F</td><td>1993-08-08</td><td>3</td><td>30121050020</td></tr>
<tr><td>30121050030</td><td>Huỳnh Văn Tài</td><td>9 Võ Văn Tần, Q.3, TP Hồ Chí Minh</td><td>70000</td><td>M</td><td>1975-10-10</td><td>4</td><td>30121050001</td></tr>
<tr><td>30121050037</td><td>Lý Thanh Tâm</td><td>77 Hùng Vương, Hải Châu, TP Đà Nẵng</td><td>65000</td><td>F</td><td>1983-03-03</td><td>5</td><td>30121050001</td></tr>
<tr><td>30121050038</td><td>Phan Hữu Nghĩa</td><td>3 Lý Thường Kiệt, TP Hà Nội</td><td>38000</td><td>M</td><td><em>NULL</em></td><td>5</td><td>30121050037</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>Num_Of_Employees</th></tr></thead>
<tbody>
<tr><td>4</td><td>1</td></tr>
<tr><td>5</td><td>2</td></tr>
<tr><td>3</td><td>3</td></tr>
<tr><td>1</td><td>4</td></tr>
<tr><td>2</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th></th><th>19.1 ORDER BY depNum</th><th>19.2 GROUP BY depNum</th></tr></thead>
<tbody>
<tr><td>Số dòng ra</td><td>14 (mỗi nhân viên một dòng)</td><td>5 (mỗi phòng một dòng)</td></tr>
<tr><td>Các cột</td><td>đủ 8 cột</td><td>depNum + số đếm</td></tr>
<tr><td>Trả lời câu hỏi</td><td>"cho xem nhân viên theo từng phòng"</td><td>"mỗi phòng có bao nhiêu nhân viên"</td></tr>
</tbody>
</table>
<p>19.2 theo thứ tự thực thi: FROM (14) → GROUP BY depNum (5 nhóm) → SELECT depNum, COUNT(*) → ORDER BY count(*) ASC — hàm gộp được phép trong ORDER BY vì ORDER BY chạy sau khi nhóm. Các nhóm bằng nhau (phòng 1 và 2 đều 4 người) không được bảo đảm thứ tự.</p>
<p>Cái gì được đứng trong SELECT sau GROUP BY: cột nhóm và hàm gộp, ngoài ra không gì khác:</p>
<pre><code class="language-sql">-- empName không được nhóm cũng không được gộp
SELECT depNum, empName, COUNT(*) AS n
FROM tblEmployee
GROUP BY depNum;
GO</code></pre>
<div class="out"><b>Msg 8120, Level 16, State 1<br>
Column 'tblEmployee.empName' is invalid in the select list because it is not contained in either an aggregate function or the GROUP BY clause.</b></div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> cũng báo lỗi đó với empName — trừ một trường hợp: nếu nhóm theo <strong>khoá chính</strong> của một bảng, các cột khác của bảng đó được phép (chúng phụ thuộc hàm vào khoá — FD ở Chương 4). SQL Server thì bắt viết <code>GROUP BY d.depNum, d.depName</code>:
<pre><code class="language-sql">-- PostgreSQL cho phép d.depName ở đây: nó phụ thuộc khoá chính d.depNum đã được nhóm
SELECT d.depNum, d.depName, COUNT(e.empSSN) AS n
FROM tblDepartment d JOIN tblEmployee e ON e.depNum = d.depNum
GROUP BY d.depNum
ORDER BY n, d.depNum;</code></pre>
<table>
<thead><tr><th>depnum</th><th>depname</th><th>n</th></tr></thead>
<tbody>
<tr><td>4</td><td>Phòng Hành chính</td><td>1</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td><td>2</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>3</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>4</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>4</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-2-group-by">PostgreSQL 6.2 — GROUP BY</a>.</div>`],
      [74, 'Grouping - how a GROUP BY query is interpreted',
        `<p class="y-chinh">🎯 The SELECT of a grouped query holds two kinds of terms — aggregates and grouping attributes — and the query is evaluated in three steps: build R from FROM and WHERE, group R by the GROUP BY attributes, produce one row per group.</p>
<p>The three steps on "for each department, how many employees earn more than 50000, and the top salary":</p>
<pre><code class="language-sql">-- step 1: R = FROM + WHERE (salary above 50000)
SELECT depNum, empName, empSalary FROM tblEmployee WHERE empSalary &gt; 50000 ORDER BY depNum;
-- steps 2-3: group R by depNum, one row per group with its aggregates
SELECT depNum, COUNT(*) AS n, MAX(empSalary) AS top_salary
FROM tblEmployee
WHERE empSalary &gt; 50000
GROUP BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>1</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>1</td><td>Võ Việt Anh</td><td>60000</td></tr>
<tr><td>2</td><td>Mai Duy An</td><td>55000</td></tr>
<tr><td>2</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>2</td><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>3</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>3</td><td>Trương Thị Thu</td><td>52000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>n</th><th>top_salary</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>150000</td></tr>
<tr><td>2</td><td>4</td><td>105000</td></tr>
<tr><td>3</td><td>2</td><td>88000</td></tr>
<tr><td>4</td><td>1</td><td>70000</td></tr>
<tr><td>5</td><td>1</td><td>65000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Step</th><th>Slide's words</th><th>Here</th></tr></thead>
<tbody>
<tr><td>1</td><td>evaluate R from FROM and WHERE</td><td>11 employees with salary &gt; 50000 (the first table)</td></tr>
<tr><td>2</td><td>group R by the GROUP BY attributes</td><td>5 groups: dep 1 (3 people), 2 (4), 3 (2), 4 (1), 5 (1)</td></tr>
<tr><td>3</td><td>produce the attributes and aggregations of SELECT</td><td>one row per group: depNum, COUNT(*), MAX(empSalary)</td></tr>
</tbody>
</table>
<p>Notice department 1 counts 3, not 4: Lê Thị Lan Anh (45000) was removed at step 1, <strong>before</strong> grouping. WHERE changes what is counted.</p>
<p class="meo">🧠 Draw it on paper in the PE: (1) cross out the rows WHERE rejects, (2) circle the groups, (3) write one line per circle. Most GROUP BY mistakes vanish.</p>`,
        `<p class="y-chinh">🎯 SELECT của một câu có nhóm chứa hai loại thành phần — hàm gộp và thuộc tính nhóm — và câu truy vấn được tính trong ba bước: dựng R từ FROM và WHERE, nhóm R theo các thuộc tính của GROUP BY, sinh mỗi nhóm một dòng.</p>
<p>Ba bước đó trên câu "với mỗi phòng, có bao nhiêu nhân viên lương trên 50000, và lương cao nhất":</p>
<pre><code class="language-sql">-- bước 1: R = FROM + WHERE (lương trên 50000)
SELECT depNum, empName, empSalary FROM tblEmployee WHERE empSalary &gt; 50000 ORDER BY depNum;
-- bước 2-3: nhóm R theo depNum, mỗi nhóm một dòng kèm giá trị gộp
SELECT depNum, COUNT(*) AS n, MAX(empSalary) AS top_salary
FROM tblEmployee
WHERE empSalary &gt; 50000
GROUP BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>1</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>1</td><td>Võ Việt Anh</td><td>60000</td></tr>
<tr><td>2</td><td>Mai Duy An</td><td>55000</td></tr>
<tr><td>2</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>2</td><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>3</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>3</td><td>Trương Thị Thu</td><td>52000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>n</th><th>top_salary</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>150000</td></tr>
<tr><td>2</td><td>4</td><td>105000</td></tr>
<tr><td>3</td><td>2</td><td>88000</td></tr>
<tr><td>4</td><td>1</td><td>70000</td></tr>
<tr><td>5</td><td>1</td><td>65000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Bước</th><th>Lời của slide</th><th>Ở đây</th></tr></thead>
<tbody>
<tr><td>1</td><td>tính R từ FROM và WHERE</td><td>11 nhân viên lương &gt; 50000 (bảng thứ nhất)</td></tr>
<tr><td>2</td><td>nhóm R theo thuộc tính của GROUP BY</td><td>5 nhóm: phòng 1 (3 người), 2 (4), 3 (2), 4 (1), 5 (1)</td></tr>
<tr><td>3</td><td>sinh các thuộc tính và hàm gộp của SELECT</td><td>mỗi nhóm một dòng: depNum, COUNT(*), MAX(empSalary)</td></tr>
</tbody>
</table>
<p>Để ý phòng 1 đếm được 3, không phải 4: Lê Thị Lan Anh (45000) bị loại ở bước 1, <strong>trước</strong> khi nhóm. WHERE làm thay đổi cái được đếm.</p>
<p class="meo">🧠 Trong bài PE hãy vẽ ra giấy: (1) gạch các dòng bị WHERE loại, (2) khoanh các nhóm, (3) mỗi vòng khoanh viết một dòng. Phần lớn lỗi GROUP BY tự biến mất.</p>`],
      [75, 'Grouping - Example 20',
        `<p class="y-chinh">🎯 Example 20 counts the employees of each project by grouping tblWorksOn on proNum.</p>
<pre><code class="language-sql">/*20*/
SELECT proNum,COUNT(*) AS Num_Of_Employees
FROM tblWorksOn
GROUP BY proNum
GO</code></pre>
<table>
<thead><tr><th>proNum</th><th>Num_Of_Employees</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td></tr>
<tr><td>2</td><td>3</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>4</td><td>2</td></tr>
<tr><td>5</td><td>3</td></tr>
<tr><td>6</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>What happens</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblWorksOn</td><td>16 work records</td><td>16</td></tr>
<tr><td>3</td><td>GROUP BY proNum</td><td>6 groups (projects 1–6)</td><td>6</td></tr>
<tr><td>5</td><td>SELECT proNum, COUNT(*)</td><td>one count per project</td><td>6</td></tr>
</tbody>
</table>
<p>COUNT(*) counts people here only because the key of tblWorksOn is (empSSN, proNum): one person appears at most once per project. The project <strong>name</strong> lives in tblProject, so showing it needs a join and grouping by both columns:</p>
<pre><code class="language-sql">-- the same count with the project name: group by both columns
SELECT p.proNum, p.proName, COUNT(*) AS Num_Of_Employees, SUM(w.workHours) AS Total_Hours
FROM tblWorksOn w JOIN tblProject p ON w.proNum = p.proNum
GROUP BY p.proNum, p.proName
ORDER BY p.proNum;</code></pre>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>Num_Of_Employees</th><th>Total_Hours</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>3</td><td>60.0</td></tr>
<tr><td>2</td><td>ProjectB</td><td>3</td><td>67.5</td></tr>
<tr><td>3</td><td>ProjectC</td><td>4</td><td>80.0</td></tr>
<tr><td>4</td><td>ProjectD</td><td>2</td><td>50.0</td></tr>
<tr><td>5</td><td>ProjectE</td><td>3</td><td>85.0</td></tr>
<tr><td>6</td><td>ProjectF</td><td>1</td><td>40.0</td></tr>
</tbody>
</table>
<div class="pitfall">A project with no member would be missing from both results (no row in tblWorksOn → no group). "Every project, 0 included" = LEFT JOIN from tblProject + COUNT(w.empSSN) — practice exercise 8.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> grouping after a join is written the same. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-4-tong-hop-tren-join">PostgreSQL 6.4 — aggregates over joins</a>.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 20 đếm số nhân viên của mỗi dự án bằng cách nhóm tblWorksOn theo proNum.</p>
<pre><code class="language-sql">/*20*/
SELECT proNum,COUNT(*) AS Num_Of_Employees
FROM tblWorksOn
GROUP BY proNum
GO</code></pre>
<table>
<thead><tr><th>proNum</th><th>Num_Of_Employees</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td></tr>
<tr><td>2</td><td>3</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>4</td><td>2</td></tr>
<tr><td>5</td><td>3</td></tr>
<tr><td>6</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Chuyện gì xảy ra</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblWorksOn</td><td>16 bản ghi làm việc</td><td>16</td></tr>
<tr><td>3</td><td>GROUP BY proNum</td><td>6 nhóm (dự án 1–6)</td><td>6</td></tr>
<tr><td>5</td><td>SELECT proNum, COUNT(*)</td><td>mỗi dự án một số đếm</td><td>6</td></tr>
</tbody>
</table>
<p>COUNT(*) đếm đúng số người ở đây chỉ vì khoá của tblWorksOn là (empSSN, proNum): một người xuất hiện tối đa một lần trong mỗi dự án. <strong>Tên</strong> dự án nằm ở tblProject, nên muốn hiện nó phải nối bảng và nhóm theo cả hai cột:</p>
<pre><code class="language-sql">-- cùng phép đếm kèm tên dự án: nhóm theo cả hai cột
SELECT p.proNum, p.proName, COUNT(*) AS Num_Of_Employees, SUM(w.workHours) AS Total_Hours
FROM tblWorksOn w JOIN tblProject p ON w.proNum = p.proNum
GROUP BY p.proNum, p.proName
ORDER BY p.proNum;</code></pre>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>Num_Of_Employees</th><th>Total_Hours</th></tr></thead>
<tbody>
<tr><td>1</td><td>ProjectA</td><td>3</td><td>60.0</td></tr>
<tr><td>2</td><td>ProjectB</td><td>3</td><td>67.5</td></tr>
<tr><td>3</td><td>ProjectC</td><td>4</td><td>80.0</td></tr>
<tr><td>4</td><td>ProjectD</td><td>2</td><td>50.0</td></tr>
<tr><td>5</td><td>ProjectE</td><td>3</td><td>85.0</td></tr>
<tr><td>6</td><td>ProjectF</td><td>1</td><td>40.0</td></tr>
</tbody>
</table>
<div class="pitfall">Dự án không có thành viên nào sẽ vắng mặt ở cả hai kết quả (không có dòng trong tblWorksOn → không có nhóm). "Mọi dự án, kể cả 0 người" = LEFT JOIN từ tblProject + COUNT(w.empSSN) — bài thực hành 8.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> nhóm sau khi nối viết y hệt. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-4-tong-hop-tren-join">PostgreSQL 6.4 — tổng hợp trên phép nối</a>.</div>`],
      [76, 'Grouping, Aggregation, and Nulls',
        `<p class="y-chinh">🎯 Four NULL rules: aggregates ignore NULL; COUNT(*) counts rows but COUNT(A) counts non-NULL values of A; NULL forms an ordinary group in GROUP BY; on an empty bag COUNT is 0 and every other aggregate is NULL.</p>
<pre><code class="language-sql">-- NULL is skipped: 14 employees, 13 known addresses, 13 known birth dates
SELECT COUNT(*) AS [COUNT(*)], COUNT(empAddress) AS [COUNT(empAddress)], COUNT(empBirthdate) AS [COUNT(empBirthdate)]
FROM tblEmployee;
GO
-- NULL forms ONE group of its own
SELECT supervisorSSN, COUNT(*) AS n
FROM tblEmployee
GROUP BY supervisorSSN;
GO
-- the empty bag: COUNT gives 0, the others give NULL
SELECT COUNT(*) AS n, SUM(empSalary) AS s, AVG(empSalary) AS a, MAX(empSalary) AS m
FROM tblEmployee
WHERE depNum = 9;
GO</code></pre>
<table>
<thead><tr><th>COUNT(*)</th><th>COUNT(empAddress)</th><th>COUNT(empBirthdate)</th></tr></thead>
<tbody>
<tr><td>14</td><td>13</td><td>13</td></tr>
</tbody>
</table>
<div class="out">Warning: Null value is eliminated by an aggregate or other SET operation.<br>
(1 row affected)</div>
<table>
<thead><tr><th>supervisorSSN</th><th>n</th></tr></thead>
<tbody>
<tr><td><em>NULL</em></td><td>1</td></tr>
<tr><td>30121050001</td><td>5</td></tr>
<tr><td>30121050002</td><td>2</td></tr>
<tr><td>30121050010</td><td>3</td></tr>
<tr><td>30121050020</td><td>2</td></tr>
<tr><td>30121050037</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>n</th><th>s</th><th>a</th><th>m</th></tr></thead>
<tbody>
<tr><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rule</th><th>Evidence above</th></tr></thead>
<tbody>
<tr><td>NULL ignored in aggregates</td><td>COUNT(empAddress) = 13: Bùi Văn Nam's address is NULL</td></tr>
<tr><td>COUNT(*) vs COUNT(A)</td><td>14 rows, but 13 addresses and 13 birth dates</td></tr>
<tr><td>NULL is a group</td><td>supervisorSSN NULL → 1 row (the director) forms its own group</td></tr>
<tr><td>empty bag</td><td>department 9 does not exist: COUNT 0, SUM/AVG/MAX NULL</td></tr>
</tbody>
</table>
<p class="meo">🧠 COUNT never returns NULL; SUM of nothing is NULL, not 0 — wrap it in <code>ISNULL(SUM(x), 0)</code> when you need 0.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the four rules are the same (and there is no "Null value is eliminated" warning); <code>ISNULL(x, 0)</code> is written <code>COALESCE(x, 0)</code> — COALESCE also works on SQL Server, so it is the portable habit. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-1-ham-tong-hop">PostgreSQL 6.1 — aggregate functions</a>.</div>`,
        `<p class="y-chinh">🎯 Bốn luật về NULL: hàm gộp bỏ qua NULL; COUNT(*) đếm dòng còn COUNT(A) đếm các giá trị khác NULL của A; NULL tạo thành một nhóm bình thường trong GROUP BY; trên túi rỗng COUNT ra 0 còn mọi hàm gộp khác ra NULL.</p>
<pre><code class="language-sql">-- NULL bị bỏ qua: 14 nhân viên, 13 địa chỉ đã biết, 13 ngày sinh đã biết
SELECT COUNT(*) AS [COUNT(*)], COUNT(empAddress) AS [COUNT(empAddress)], COUNT(empBirthdate) AS [COUNT(empBirthdate)]
FROM tblEmployee;
GO
-- NULL tạo thành MỘT nhóm riêng
SELECT supervisorSSN, COUNT(*) AS n
FROM tblEmployee
GROUP BY supervisorSSN;
GO
-- túi rỗng: COUNT ra 0, các hàm khác ra NULL
SELECT COUNT(*) AS n, SUM(empSalary) AS s, AVG(empSalary) AS a, MAX(empSalary) AS m
FROM tblEmployee
WHERE depNum = 9;
GO</code></pre>
<table>
<thead><tr><th>COUNT(*)</th><th>COUNT(empAddress)</th><th>COUNT(empBirthdate)</th></tr></thead>
<tbody>
<tr><td>14</td><td>13</td><td>13</td></tr>
</tbody>
</table>
<div class="out">Warning: Null value is eliminated by an aggregate or other SET operation.<br>
(1 row affected)</div>
<table>
<thead><tr><th>supervisorSSN</th><th>n</th></tr></thead>
<tbody>
<tr><td><em>NULL</em></td><td>1</td></tr>
<tr><td>30121050001</td><td>5</td></tr>
<tr><td>30121050002</td><td>2</td></tr>
<tr><td>30121050010</td><td>3</td></tr>
<tr><td>30121050020</td><td>2</td></tr>
<tr><td>30121050037</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>n</th><th>s</th><th>a</th><th>m</th></tr></thead>
<tbody>
<tr><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Luật</th><th>Bằng chứng ở trên</th></tr></thead>
<tbody>
<tr><td>Hàm gộp bỏ qua NULL</td><td>COUNT(empAddress) = 13: địa chỉ của Bùi Văn Nam là NULL</td></tr>
<tr><td>COUNT(*) khác COUNT(A)</td><td>14 dòng, nhưng 13 địa chỉ và 13 ngày sinh</td></tr>
<tr><td>NULL là một nhóm</td><td>supervisorSSN NULL → 1 dòng (giám đốc) thành một nhóm riêng</td></tr>
<tr><td>túi rỗng</td><td>phòng 9 không tồn tại: COUNT 0, SUM/AVG/MAX là NULL</td></tr>
</tbody>
</table>
<p class="meo">🧠 COUNT không bao giờ trả về NULL; SUM của "không có gì" là NULL, không phải 0 — bọc bằng <code>ISNULL(SUM(x), 0)</code> khi cần số 0.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> bốn luật y hệt (và không có cảnh báo "Null value is eliminated"); <code>ISNULL(x, 0)</code> viết là <code>COALESCE(x, 0)</code> — COALESCE cũng chạy trên SQL Server, nên đó là thói quen dùng được ở cả hai. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-1-ham-tong-hop">PostgreSQL 6.1 — hàm tổng hợp</a>.</div>`],
      [77, 'Grouping, Aggregation, and Nulls - Example R(A,B)',
        `<p class="y-chinh">🎯 With R(A, B) holding one tuple (NULL, NULL), grouping by A gives one group (A = NULL); COUNT(B) in it is 0 and SUM(B) is NULL — exactly the slide's (NULL, 0) and (NULL, NULL).</p>
<pre><code class="language-sql">CREATE TABLE R (A INT NULL, B INT NULL);
INSERT INTO R VALUES (NULL, NULL);
GO
SELECT A, count(B)
FROM R
GROUP BY A;
GO
SELECT A, sum(B)
FROM R
GROUP BY A;
GO</code></pre>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>A</th><th>(No column name)</th></tr></thead>
<tbody>
<tr><td><em>NULL</em></td><td>0</td></tr>
</tbody>
</table>
<div class="out">Warning: Null value is eliminated by an aggregate or other SET operation.<br>
(1 row affected)</div>
<table>
<thead><tr><th>A</th><th>(No column name)</th></tr></thead>
<tbody>
<tr><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="out">Warning: Null value is eliminated by an aggregate or other SET operation.<br>
(1 row affected)</div>
<table>
<thead><tr><th>Step</th><th>count(B) query</th><th>sum(B) query</th></tr></thead>
<tbody>
<tr><td>FROM R</td><td>1 row (NULL, NULL)</td><td>same</td></tr>
<tr><td>GROUP BY A</td><td>one group, A = NULL (rule 3)</td><td>same</td></tr>
<tr><td>aggregate over B = {NULL}</td><td>NULL ignored → empty → COUNT = 0</td><td>NULL ignored → empty → SUM = NULL</td></tr>
<tr><td>result</td><td>(NULL, 0)</td><td>(NULL, NULL)</td></tr>
</tbody>
</table>
<p>The output column has no name ("(No column name)") because the slide gives no alias to count(B) — in the PE always write <code>AS …</code>.</p>
<div class="pitfall">Exam trap: "how many rows does it return?" — one, not zero. A group made of NULLs is still a group; the row is there even though every value in it is NULL or 0.</div>`,
        `<p class="y-chinh">🎯 Với R(A, B) chứa một bộ (NULL, NULL), nhóm theo A cho một nhóm (A = NULL); trong nhóm đó COUNT(B) là 0 còn SUM(B) là NULL — đúng (NULL, 0) và (NULL, NULL) như slide.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT NULL, B INT NULL);
INSERT INTO R VALUES (NULL, NULL);
GO
SELECT A, count(B)
FROM R
GROUP BY A;
GO
SELECT A, sum(B)
FROM R
GROUP BY A;
GO</code></pre>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>A</th><th>(No column name)</th></tr></thead>
<tbody>
<tr><td><em>NULL</em></td><td>0</td></tr>
</tbody>
</table>
<div class="out">Warning: Null value is eliminated by an aggregate or other SET operation.<br>
(1 row affected)</div>
<table>
<thead><tr><th>A</th><th>(No column name)</th></tr></thead>
<tbody>
<tr><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="out">Warning: Null value is eliminated by an aggregate or other SET operation.<br>
(1 row affected)</div>
<table>
<thead><tr><th>Bước</th><th>câu count(B)</th><th>câu sum(B)</th></tr></thead>
<tbody>
<tr><td>FROM R</td><td>1 dòng (NULL, NULL)</td><td>như vậy</td></tr>
<tr><td>GROUP BY A</td><td>một nhóm, A = NULL (luật 3)</td><td>như vậy</td></tr>
<tr><td>gộp trên B = {NULL}</td><td>bỏ NULL → rỗng → COUNT = 0</td><td>bỏ NULL → rỗng → SUM = NULL</td></tr>
<tr><td>kết quả</td><td>(NULL, 0)</td><td>(NULL, NULL)</td></tr>
</tbody>
</table>
<p>Cột đầu ra không có tên ("(No column name)") vì slide không đặt bí danh cho count(B) — trong bài PE luôn viết <code>AS …</code>.</p>
<div class="pitfall">Bẫy trắc nghiệm: "câu này trả về mấy dòng?" — một, không phải không. Một nhóm toàn NULL vẫn là một nhóm; dòng đó vẫn có, dù mọi giá trị trong nó là NULL hoặc 0.</div>`],
      [78, 'Considerations - WHERE or HAVING',
        `<p class="y-chinh">🎯 Conditions on single rows go in WHERE; conditions on groups — built from aggregates — go in a HAVING clause after GROUP BY.</p>
<p>Why an aggregate cannot be in WHERE: WHERE runs at step 2 and looks at <strong>one row</strong>; groups (and so AVG per group) only exist from step 3.</p>
<pre><code class="language-sql">-- an aggregate in WHERE: WHERE looks at ONE row, there is no group yet
SELECT depNum, AVG(empSalary) AS avgSalary
FROM tblEmployee
WHERE AVG(empSalary) &gt; 80000
GROUP BY depNum;
GO</code></pre>
<div class="out"><b>Msg 147, Level 15, State 1<br>
An aggregate may not appear in the WHERE clause unless it is in a subquery contained in a HAVING clause or a select list, and the column being aggregated is an outer reference.</b></div>
<table>
<thead><tr><th></th><th>WHERE</th><th>HAVING</th></tr></thead>
<tbody>
<tr><td>Runs</td><td>before GROUP BY (step 2)</td><td>after GROUP BY (step 4)</td></tr>
<tr><td>Filters</td><td>rows</td><td>groups</td></tr>
<tr><td>May contain an aggregate</td><td>no (Msg 147)</td><td>yes — that is its purpose</td></tr>
<tr><td>Example</td><td><code>empSex = 'M'</code></td><td><code>AVG(empSalary) &gt; 80000</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 Ask "can I decide by looking at ONE row?" Yes → WHERE. Need several rows (a count, an average) → HAVING.</p>`,
        `<p class="y-chinh">🎯 Điều kiện trên từng dòng đặt ở WHERE; điều kiện trên nhóm — dựng từ hàm gộp — đặt ở mệnh đề HAVING sau GROUP BY.</p>
<p>Vì sao hàm gộp không đứng được trong WHERE: WHERE chạy ở bước 2 và nhìn <strong>một dòng</strong>; nhóm (và do đó AVG của nhóm) chỉ có từ bước 3.</p>
<pre><code class="language-sql">-- hàm gộp trong WHERE: WHERE nhìn MỘT dòng, lúc đó chưa có nhóm
SELECT depNum, AVG(empSalary) AS avgSalary
FROM tblEmployee
WHERE AVG(empSalary) &gt; 80000
GROUP BY depNum;
GO</code></pre>
<div class="out"><b>Msg 147, Level 15, State 1<br>
An aggregate may not appear in the WHERE clause unless it is in a subquery contained in a HAVING clause or a select list, and the column being aggregated is an outer reference.</b></div>
<table>
<thead><tr><th></th><th>WHERE</th><th>HAVING</th></tr></thead>
<tbody>
<tr><td>Chạy lúc</td><td>trước GROUP BY (bước 2)</td><td>sau GROUP BY (bước 4)</td></tr>
<tr><td>Lọc</td><td>dòng</td><td>nhóm</td></tr>
<tr><td>Chứa hàm gộp được không</td><td>không (Msg 147)</td><td>được — đó là việc của nó</td></tr>
<tr><td>Ví dụ</td><td><code>empSex = 'M'</code></td><td><code>AVG(empSalary) &gt; 80000</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 Tự hỏi "nhìn MỘT dòng có quyết được không?" Được → WHERE. Cần nhiều dòng (một số đếm, một trung bình) → HAVING.</p>`],
      [79, 'HAVING clause - syntax',
        `<p class="y-chinh">🎯 The complete syntax: <code>SELECT … FROM … WHERE &lt;conditions on tuples&gt; GROUP BY … HAVING &lt;conditions on groups&gt;</code> — plus ORDER BY at the end.</p>
<p>One query using all six clauses; the numbers in the comments are the execution order:</p>
<pre><code class="language-sql">SELECT   depNum, COUNT(*) AS men, AVG(empSalary) AS avgSalary   -- 5
FROM     tblEmployee                                            -- 1
WHERE    empSex = 'M'                                           -- 2
GROUP BY depNum                                                 -- 3
HAVING   COUNT(*) &gt;= 2                                          -- 4
ORDER BY avgSalary DESC;                                        -- 6</code></pre>
<table>
<thead><tr><th>depNum</th><th>men</th><th>avgSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>105000.000000</td></tr>
<tr><td>2</td><td>3</td><td>85000.000000</td></tr>
</tbody>
</table>
<p>The tables between the steps:</p>
<pre><code class="language-sql">-- after 1-2 (FROM, WHERE): the men only
SELECT depNum, empName, empSalary FROM tblEmployee WHERE empSex = 'M' ORDER BY depNum;
-- after 3 (GROUP BY), before HAVING: one row per group
SELECT depNum, COUNT(*) AS men, AVG(empSalary) AS avgSalary
FROM tblEmployee WHERE empSex = 'M' GROUP BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>1</td><td>Võ Việt Anh</td><td>60000</td></tr>
<tr><td>2</td><td>Mai Duy An</td><td>55000</td></tr>
<tr><td>2</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>3</td><td>Bùi Văn Nam</td><td>40000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Phan Hữu Nghĩa</td><td>38000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>men</th><th>avgSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>105000.000000</td></tr>
<tr><td>2</td><td>3</td><td>85000.000000</td></tr>
<tr><td>3</td><td>1</td><td>40000.000000</td></tr>
<tr><td>4</td><td>1</td><td>70000.000000</td></tr>
<tr><td>5</td><td>1</td><td>38000.000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Step</th><th>Clause</th><th>Rows / groups left</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee</td><td>14 rows</td></tr>
<tr><td>2</td><td>WHERE empSex = 'M'</td><td>8 rows (men)</td></tr>
<tr><td>3</td><td>GROUP BY depNum</td><td>5 groups: 1 (2 men), 2 (3), 3 (1), 4 (1), 5 (1)</td></tr>
<tr><td>4</td><td>HAVING COUNT(*) &gt;= 2</td><td>2 groups: departments 1 and 2</td></tr>
<tr><td>5</td><td>SELECT depNum, COUNT(*), AVG(empSalary)</td><td>2 rows, alias avgSalary created</td></tr>
<tr><td>6</td><td>ORDER BY avgSalary DESC</td><td>105000 before 85000</td></tr>
</tbody>
</table>
<p class="meo">🧠 Written order: <strong>S</strong>ELECT <strong>F</strong>ROM <strong>W</strong>HERE <strong>G</strong>ROUP <strong>H</strong>AVING <strong>O</strong>RDER. Run order: F-W-G-H-S-O. The only clause that moves is SELECT: from first to fifth.</p>`,
        `<p class="y-chinh">🎯 Cú pháp đầy đủ: <code>SELECT … FROM … WHERE &lt;điều kiện trên bộ&gt; GROUP BY … HAVING &lt;điều kiện trên nhóm&gt;</code> — thêm ORDER BY ở cuối.</p>
<p>Một câu dùng đủ sáu mệnh đề; số trong chú thích là thứ tự thực thi:</p>
<pre><code class="language-sql">SELECT   depNum, COUNT(*) AS men, AVG(empSalary) AS avgSalary   -- 5
FROM     tblEmployee                                            -- 1
WHERE    empSex = 'M'                                           -- 2
GROUP BY depNum                                                 -- 3
HAVING   COUNT(*) &gt;= 2                                          -- 4
ORDER BY avgSalary DESC;                                        -- 6</code></pre>
<table>
<thead><tr><th>depNum</th><th>men</th><th>avgSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>105000.000000</td></tr>
<tr><td>2</td><td>3</td><td>85000.000000</td></tr>
</tbody>
</table>
<p>Các bảng ở giữa các bước:</p>
<pre><code class="language-sql">-- sau 1-2 (FROM, WHERE): chỉ còn nam
SELECT depNum, empName, empSalary FROM tblEmployee WHERE empSex = 'M' ORDER BY depNum;
-- sau 3 (GROUP BY), trước HAVING: mỗi nhóm một dòng
SELECT depNum, COUNT(*) AS men, AVG(empSalary) AS avgSalary
FROM tblEmployee WHERE empSex = 'M' GROUP BY depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>1</td><td>Võ Việt Anh</td><td>60000</td></tr>
<tr><td>2</td><td>Mai Duy An</td><td>55000</td></tr>
<tr><td>2</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>3</td><td>Bùi Văn Nam</td><td>40000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Phan Hữu Nghĩa</td><td>38000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>men</th><th>avgSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>105000.000000</td></tr>
<tr><td>2</td><td>3</td><td>85000.000000</td></tr>
<tr><td>3</td><td>1</td><td>40000.000000</td></tr>
<tr><td>4</td><td>1</td><td>70000.000000</td></tr>
<tr><td>5</td><td>1</td><td>38000.000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Bước</th><th>Mệnh đề</th><th>Còn lại bao nhiêu dòng / nhóm</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee</td><td>14 dòng</td></tr>
<tr><td>2</td><td>WHERE empSex = 'M'</td><td>8 dòng (nam)</td></tr>
<tr><td>3</td><td>GROUP BY depNum</td><td>5 nhóm: 1 (2 nam), 2 (3), 3 (1), 4 (1), 5 (1)</td></tr>
<tr><td>4</td><td>HAVING COUNT(*) &gt;= 2</td><td>2 nhóm: phòng 1 và 2</td></tr>
<tr><td>5</td><td>SELECT depNum, COUNT(*), AVG(empSalary)</td><td>2 dòng, bí danh avgSalary được tạo</td></tr>
<tr><td>6</td><td>ORDER BY avgSalary DESC</td><td>105000 đứng trước 85000</td></tr>
</tbody>
</table>
<p class="meo">🧠 Thứ tự viết: <strong>S</strong>ELECT <strong>F</strong>ROM <strong>W</strong>HERE <strong>G</strong>ROUP <strong>H</strong>AVING <strong>O</strong>RDER. Thứ tự chạy: F-W-G-H-S-O. Mệnh đề duy nhất đổi chỗ là SELECT: từ thứ nhất xuống thứ năm.</p>`],
      [80, 'HAVING clause - Example 21',
        `<p class="y-chinh">🎯 Example 21 keeps only the departments whose average salary exceeds 80000, using HAVING AVG(empSalary) &gt; 80000.</p>
<pre><code class="language-sql">/*21*/
SELECT depNum, AVG(empSalary) AS Average_Of_Salary
FROM tblEmployee
GROUP BY depNum
HAVING AVG(empSalary)&gt;80000
GO</code></pre>
<table>
<thead><tr><th>depNum</th><th>Average_Of_Salary</th></tr></thead>
<tbody>
<tr><td>1</td><td>86250.000000</td></tr>
<tr><td>2</td><td>81750.000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>What happens</th><th>Groups</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee</td><td>14 rows</td><td>—</td></tr>
<tr><td>3</td><td>GROUP BY depNum</td><td>averages: 1 → 86250, 2 → 81750, 3 → 60000, 4 → 70000, 5 → 51500</td><td>5</td></tr>
<tr><td>4</td><td>HAVING AVG(empSalary) &gt; 80000</td><td>keep 1 and 2</td><td>2</td></tr>
<tr><td>5</td><td>SELECT depNum, AVG(…)</td><td></td><td>2</td></tr>
</tbody>
</table>
<p class="dap-an">✅ The task says "print the <strong>number of employees</strong> for each department whose average salary exceeds 80000", but the slide's code prints the average. The code the task asks for adds COUNT(*) (keeping the average is harmless):</p>
<pre><code class="language-sql">-- what the task text asks: the NUMBER of employees of those departments
SELECT depNum, COUNT(*) AS Num_Of_Employees, AVG(empSalary) AS Average_Of_Salary
FROM tblEmployee
GROUP BY depNum
HAVING AVG(empSalary) &gt; 80000;</code></pre>
<table>
<thead><tr><th>depNum</th><th>Num_Of_Employees</th><th>Average_Of_Salary</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td><td>86250.000000</td></tr>
<tr><td>2</td><td>4</td><td>81750.000000</td></tr>
</tbody>
</table>
<p class="meo">🧠 HAVING may test an aggregate that is not in SELECT, and SELECT may show aggregates that HAVING does not test — they are independent.</p>`,
        `<p class="y-chinh">🎯 Ví dụ 21 chỉ giữ các phòng có lương trung bình trên 80000, bằng HAVING AVG(empSalary) &gt; 80000.</p>
<pre><code class="language-sql">/*21*/
SELECT depNum, AVG(empSalary) AS Average_Of_Salary
FROM tblEmployee
GROUP BY depNum
HAVING AVG(empSalary)&gt;80000
GO</code></pre>
<table>
<thead><tr><th>depNum</th><th>Average_Of_Salary</th></tr></thead>
<tbody>
<tr><td>1</td><td>86250.000000</td></tr>
<tr><td>2</td><td>81750.000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Chuyện gì xảy ra</th><th>Số nhóm</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee</td><td>14 dòng</td><td>—</td></tr>
<tr><td>3</td><td>GROUP BY depNum</td><td>trung bình: 1 → 86250, 2 → 81750, 3 → 60000, 4 → 70000, 5 → 51500</td><td>5</td></tr>
<tr><td>4</td><td>HAVING AVG(empSalary) &gt; 80000</td><td>giữ phòng 1 và 2</td><td>2</td></tr>
<tr><td>5</td><td>SELECT depNum, AVG(…)</td><td></td><td>2</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Đề bài nói "in ra <strong>số nhân viên</strong> của mỗi phòng có lương trung bình trên 80000", nhưng code trên slide lại in ra lương trung bình. Code đúng như đề thêm COUNT(*) (giữ cột trung bình cũng không sao):</p>
<pre><code class="language-sql">-- đúng như đề bài hỏi: SỐ nhân viên của các phòng đó
SELECT depNum, COUNT(*) AS Num_Of_Employees, AVG(empSalary) AS Average_Of_Salary
FROM tblEmployee
GROUP BY depNum
HAVING AVG(empSalary) &gt; 80000;</code></pre>
<table>
<thead><tr><th>depNum</th><th>Num_Of_Employees</th><th>Average_Of_Salary</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td><td>86250.000000</td></tr>
<tr><td>2</td><td>4</td><td>81750.000000</td></tr>
</tbody>
</table>
<p class="meo">🧠 HAVING được kiểm một hàm gộp không có trong SELECT, và SELECT được hiện các hàm gộp mà HAVING không kiểm — hai bên độc lập với nhau.</p>`],
      [81, 'HAVING clause - rules',
        `<p class="y-chinh">🎯 Two rules: an aggregate in HAVING applies only to the rows of the group being tested; and a column may appear in HAVING un-aggregated only if it is in the GROUP BY list (the same rule as for SELECT).</p>
<pre><code class="language-sql">-- empSalary is not grouped: which salary of the group?
SELECT depNum, COUNT(*) AS n
FROM tblEmployee
GROUP BY depNum
HAVING empSalary &gt; 50000;
GO
-- allowed: an aggregate of any column, or a grouped column
SELECT depNum, COUNT(*) AS n
FROM tblEmployee
GROUP BY depNum
HAVING MIN(empBirthdate) &lt; '1980-01-01' AND depNum &lt;&gt; 4;
GO</code></pre>
<div class="out"><b>Msg 8121, Level 16, State 1<br>
Column 'tblEmployee.empSalary' is invalid in the HAVING clause because it is not contained in either an aggregate function or the GROUP BY clause.</b></div>
<table>
<thead><tr><th>depNum</th><th>n</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td></tr>
<tr><td>2</td><td>4</td></tr>
</tbody>
</table>
<div class="out">Warning: Null value is eliminated by an aggregate or other SET operation.<br>
(2 rows affected)</div>
<ul>
<li>Msg 8121: <code>HAVING empSalary &gt; 50000</code> — a group has several salaries, so "the" salary of a group means nothing.</li>
<li>The second query is legal: <code>MIN(empBirthdate)</code> is an aggregate of any column (rule 1: the oldest birth date <strong>of that group</strong>), <code>depNum</code> is a grouping column (rule 2). Departments 1 and 2 have someone born before 1980; department 4 is excluded by the depNum test.</li>
</ul>
<div class="pitfall"><code>HAVING depNum &lt;&gt; 4</code> is legal but belongs in WHERE: filtering the rows first means fewer rows to group. Keep HAVING for conditions that need an aggregate (slide 82 shows the same point).</div>`,
        `<p class="y-chinh">🎯 Hai luật: hàm gộp trong HAVING chỉ áp dụng cho các dòng của nhóm đang được xét; và một cột chỉ được đứng trần (không gộp) trong HAVING nếu nó có trong danh sách GROUP BY (cùng luật như SELECT).</p>
<pre><code class="language-sql">-- empSalary không được nhóm: lương của ai trong nhóm?
SELECT depNum, COUNT(*) AS n
FROM tblEmployee
GROUP BY depNum
HAVING empSalary &gt; 50000;
GO
-- được phép: hàm gộp của cột bất kỳ, hoặc cột đã nhóm
SELECT depNum, COUNT(*) AS n
FROM tblEmployee
GROUP BY depNum
HAVING MIN(empBirthdate) &lt; '1980-01-01' AND depNum &lt;&gt; 4;
GO</code></pre>
<div class="out"><b>Msg 8121, Level 16, State 1<br>
Column 'tblEmployee.empSalary' is invalid in the HAVING clause because it is not contained in either an aggregate function or the GROUP BY clause.</b></div>
<table>
<thead><tr><th>depNum</th><th>n</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td></tr>
<tr><td>2</td><td>4</td></tr>
</tbody>
</table>
<div class="out">Warning: Null value is eliminated by an aggregate or other SET operation.<br>
(2 rows affected)</div>
<ul>
<li>Msg 8121: <code>HAVING empSalary &gt; 50000</code> — một nhóm có nhiều mức lương, nên "lương của nhóm" chẳng có nghĩa gì.</li>
<li>Câu thứ hai hợp lệ: <code>MIN(empBirthdate)</code> là hàm gộp của một cột bất kỳ (luật 1: ngày sinh sớm nhất <strong>của nhóm đó</strong>), <code>depNum</code> là cột nhóm (luật 2). Phòng 1 và 2 có người sinh trước 1980; phòng 4 bị loại bởi phép kiểm depNum.</li>
</ul>
<div class="pitfall"><code>HAVING depNum &lt;&gt; 4</code> hợp lệ nhưng nên đặt ở WHERE: lọc dòng trước thì có ít dòng hơn phải nhóm. Để HAVING cho các điều kiện cần hàm gộp (slide 82 nói đúng ý này).</div>`],
      [82, 'HAVING clause - examples',
        `<p class="y-chinh">🎯 Two HAVING examples on tblWorksOn: projects whose average working hours exceed 20, and the (poor) use of HAVING for a plain condition proNum = 4.</p>
<p>The slide's code has a comma after <code>Number_Of_Employees</code>, just before FROM — copied as is, it does not run:</p>
<pre><code class="language-sql">-- copied exactly from the slide: a comma before FROM
SELECT proNum, COUNT(empSSN) AS Number_Of_Employees,
FROM  tblWorksOn
GROUP BY proNum
HAVING AVG(workHours)&gt;20
GO</code></pre>
<div class="out"><b>Msg 156, Level 15, State 1<br>
Incorrect syntax near the keyword 'FROM'.</b></div>
<p>With the comma removed, both queries:</p>
<pre><code class="language-sql">SELECT proNum, COUNT(empSSN) AS Number_Of_Employees
FROM  tblWorksOn
GROUP BY proNum
HAVING AVG(workHours)&gt;20
GO
SELECT proNum, COUNT(empSSN) AS Number_Of_Employees
FROM  tblWorksOn
GROUP BY proNum
HAVING proNum=4
GO</code></pre>
<table>
<thead><tr><th>proNum</th><th>Number_Of_Employees</th></tr></thead>
<tbody>
<tr><td>2</td><td>3</td></tr>
<tr><td>4</td><td>2</td></tr>
<tr><td>5</td><td>3</td></tr>
<tr><td>6</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>proNum</th><th>Number_Of_Employees</th></tr></thead>
<tbody>
<tr><td>4</td><td>2</td></tr>
</tbody>
</table>
<p>Every group before HAVING, with the value HAVING tests:</p>
<pre><code class="language-sql">-- every group BEFORE HAVING, with the value HAVING tests
SELECT proNum, COUNT(empSSN) AS Number_Of_Employees, AVG(workHours) AS avg_hours
FROM tblWorksOn
GROUP BY proNum;
-- HAVING proNum = 4 is better written as WHERE: filter rows before grouping
SELECT proNum, COUNT(empSSN) AS Number_Of_Employees
FROM tblWorksOn
WHERE proNum = 4
GROUP BY proNum;</code></pre>
<table>
<thead><tr><th>proNum</th><th>Number_Of_Employees</th><th>avg_hours</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>20.000000</td></tr>
<tr><td>2</td><td>3</td><td>22.500000</td></tr>
<tr><td>3</td><td>4</td><td>20.000000</td></tr>
<tr><td>4</td><td>2</td><td>25.000000</td></tr>
<tr><td>5</td><td>3</td><td>28.333333</td></tr>
<tr><td>6</td><td>1</td><td>40.000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>proNum</th><th>Number_Of_Employees</th></tr></thead>
<tbody>
<tr><td>4</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>proNum</th><th>COUNT(empSSN)</th><th>AVG(workHours)</th><th>&gt; 20?</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>20.000000</td><td>no — exactly 20 is not greater</td></tr>
<tr><td>2</td><td>3</td><td>22.500000</td><td>yes</td></tr>
<tr><td>3</td><td>4</td><td>20.000000</td><td>no</td></tr>
<tr><td>4</td><td>2</td><td>25.000000</td><td>yes</td></tr>
<tr><td>5</td><td>3</td><td>28.333333</td><td>yes</td></tr>
<tr><td>6</td><td>1</td><td>40.000000</td><td>yes</td></tr>
</tbody>
</table>
<p><code>HAVING proNum = 4</code> works (proNum is a grouping column) but builds all 6 groups and then throws 5 away; <code>WHERE proNum = 4</code> (second table of the file above) removes the rows first — same result, less work.</p>
<div class="pitfall">A trailing comma before FROM is the most common syntax error in the PE after a long SELECT list; "Incorrect syntax near the keyword 'FROM'" means: look at the end of the previous line.</div>`,
        `<p class="y-chinh">🎯 Hai ví dụ HAVING trên tblWorksOn: các dự án có số giờ làm trung bình trên 20, và cách dùng HAVING (chưa tốt) cho một điều kiện thường proNum = 4.</p>
<p>Code trên slide có dấu phẩy sau <code>Number_Of_Employees</code>, ngay trước FROM — chép nguyên thì không chạy:</p>
<pre><code class="language-sql">-- chép đúng slide: dấu phẩy trước FROM
SELECT proNum, COUNT(empSSN) AS Number_Of_Employees,
FROM  tblWorksOn
GROUP BY proNum
HAVING AVG(workHours)&gt;20
GO</code></pre>
<div class="out"><b>Msg 156, Level 15, State 1<br>
Incorrect syntax near the keyword 'FROM'.</b></div>
<p>Bỏ dấu phẩy đi, cả hai câu:</p>
<pre><code class="language-sql">SELECT proNum, COUNT(empSSN) AS Number_Of_Employees
FROM  tblWorksOn
GROUP BY proNum
HAVING AVG(workHours)&gt;20
GO
SELECT proNum, COUNT(empSSN) AS Number_Of_Employees
FROM  tblWorksOn
GROUP BY proNum
HAVING proNum=4
GO</code></pre>
<table>
<thead><tr><th>proNum</th><th>Number_Of_Employees</th></tr></thead>
<tbody>
<tr><td>2</td><td>3</td></tr>
<tr><td>4</td><td>2</td></tr>
<tr><td>5</td><td>3</td></tr>
<tr><td>6</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>proNum</th><th>Number_Of_Employees</th></tr></thead>
<tbody>
<tr><td>4</td><td>2</td></tr>
</tbody>
</table>
<p>Mọi nhóm trước HAVING, kèm giá trị mà HAVING đem ra kiểm:</p>
<pre><code class="language-sql">-- mọi nhóm TRƯỚC HAVING, kèm giá trị HAVING đem ra kiểm
SELECT proNum, COUNT(empSSN) AS Number_Of_Employees, AVG(workHours) AS avg_hours
FROM tblWorksOn
GROUP BY proNum;
-- HAVING proNum = 4 nên viết thành WHERE: lọc dòng trước khi nhóm
SELECT proNum, COUNT(empSSN) AS Number_Of_Employees
FROM tblWorksOn
WHERE proNum = 4
GROUP BY proNum;</code></pre>
<table>
<thead><tr><th>proNum</th><th>Number_Of_Employees</th><th>avg_hours</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>20.000000</td></tr>
<tr><td>2</td><td>3</td><td>22.500000</td></tr>
<tr><td>3</td><td>4</td><td>20.000000</td></tr>
<tr><td>4</td><td>2</td><td>25.000000</td></tr>
<tr><td>5</td><td>3</td><td>28.333333</td></tr>
<tr><td>6</td><td>1</td><td>40.000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>proNum</th><th>Number_Of_Employees</th></tr></thead>
<tbody>
<tr><td>4</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>proNum</th><th>COUNT(empSSN)</th><th>AVG(workHours)</th><th>&gt; 20?</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>20.000000</td><td>không — đúng bằng 20 thì không lớn hơn</td></tr>
<tr><td>2</td><td>3</td><td>22.500000</td><td>có</td></tr>
<tr><td>3</td><td>4</td><td>20.000000</td><td>không</td></tr>
<tr><td>4</td><td>2</td><td>25.000000</td><td>có</td></tr>
<tr><td>5</td><td>3</td><td>28.333333</td><td>có</td></tr>
<tr><td>6</td><td>1</td><td>40.000000</td><td>có</td></tr>
</tbody>
</table>
<p><code>HAVING proNum = 4</code> chạy được (proNum là cột nhóm) nhưng phải dựng đủ 6 nhóm rồi vứt 5; <code>WHERE proNum = 4</code> (bảng thứ hai của file trên) bỏ dòng từ trước — cùng kết quả, ít việc hơn.</p>
<div class="pitfall">Dấu phẩy thừa trước FROM là lỗi cú pháp hay gặp nhất trong bài PE sau một danh sách SELECT dài; "Incorrect syntax near the keyword 'FROM'" nghĩa là: nhìn vào cuối dòng ngay trước đó.</div>`],
    ]),
    bi(`<h2>📌 Chapter 6 slides in one page</h2>
<ol>
<li>Read every query in execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY (→ TOP).</li>
<li>Several tables = product; the join condition (FK = PK) turns it into a join. JOIN … ON keeps it tidy.</li>
<li>Self-join = the same table twice with two aliases. UNION / INTERSECT / EXCEPT combine whole results.</li>
<li>Subquery: one value (=), a set (IN, EXISTS, ANY, ALL), or a table in FROM (alias required). Correlated = uses the outer row.</li>
<li>NOT IN + NULL = empty result; prefer NOT EXISTS.</li>
<li>LEFT JOIN keeps rows without a partner; a WHERE on the right table destroys them.</li>
<li>GROUP BY makes one row per group; SELECT/HAVING may use only grouping columns and aggregates; WHERE filters rows, HAVING filters groups.</li>
</ol>
<p>Next: the practice lesson (8 PE-style exercises) and Quiz 3.</p>`,
    `<h2>📌 Slide Chương 6 trong một trang</h2>
<ol>
<li>Đọc mọi câu truy vấn theo thứ tự thực thi: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY (→ TOP).</li>
<li>Nhiều bảng = tích; điều kiện nối (khoá ngoại = khoá chính) biến nó thành phép nối. JOIN … ON giữ code gọn gàng.</li>
<li>Tự nối = cùng một bảng hai lần với hai bí danh. UNION / INTERSECT / EXCEPT kết hợp cả kết quả.</li>
<li>Truy vấn con: một giá trị (=), một tập (IN, EXISTS, ANY, ALL), hoặc một bảng trong FROM (bắt buộc bí danh). Tương quan = dùng dòng bên ngoài.</li>
<li>NOT IN + NULL = kết quả rỗng; hãy dùng NOT EXISTS.</li>
<li>LEFT JOIN giữ các dòng không có bạn ghép; một WHERE trên bảng bên phải phá chúng.</li>
<li>GROUP BY sinh mỗi nhóm một dòng; SELECT/HAVING chỉ được dùng cột nhóm và hàm gộp; WHERE lọc dòng, HAVING lọc nhóm.</li>
</ol>
<p>Tiếp theo: bài thực hành (8 bài kiểu đề PE) và Quiz 3.</p>`),
    books([
      ['ullman', 'Ullman &amp; Widom (3e) — §6.4.2–6.4.7 Duplicates in set operations, grouping and aggregation, HAVING', 'Ullman &amp; Widom (3e) — §6.4.2–6.4.7 Bản trùng trong phép tập hợp, gom nhóm và hàm gộp, HAVING'],
      ['ramakrishnan', 'Ramakrishnan &amp; Gehrke — ch. 5.5 Aggregate operators, GROUP BY and HAVING', 'Ramakrishnan &amp; Gehrke — mục 5.5 Toán tử gộp, GROUP BY và HAVING'],
    ]),
  ].join('\n'),
};

/* ───────── 6.6 — 🧪 Practice + 🗂 Glossary + 📌 Summary · SQL queries, PE style ───────── */
const L_on_ch6 = {
  title: '6.6 — 🧪 Practice + 🗂 Glossary + 📌 Summary · SQL queries, PE style|||6.6 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Truy vấn SQL kiểu đề PE',
  slug: 'dbi202-on-ch6',
  type: 'VIDEO',
  description: '8 bài tập kiểu đề PE 85 phút trên CSDL FUHCompany, tăng dần độ khó: lọc + sắp xếp (BETWEEN, LIKE với [ ]), nối 4 bảng, tự nối có ISNULL, NOT EXISTS và phép chia, truy vấn con tương quan, GROUP BY + HAVING, TOP WITH TIES và top-N mỗi nhóm, nối ngoài đếm cả 0 — mỗi bài có đề, hướng nghĩ, lời giải giải theo thứ tự thực thi chạy thật trên SQL Server, bẫy hay mất điểm và bản PostgreSQL ở chỗ cú pháp khác; bảng T-SQL ↔ PostgreSQL, 22 thuật ngữ Anh–Việt, tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.6 · Practice &amp; review</span>
<h2>SQL queries — eight PE-style exercises on FUHCompany</h2>
<p class="lead">The PE (practical exam, 85 minutes, 30 % of the grade) gives you a database and 8–10 questions "write a query that returns…", ordered from easy to hard. These eight exercises follow that order and cover every pattern of Chapter 6. Each one: the task → how to think → the solution read in execution order, run for real on SQL Server → the trap that costs marks. Where PostgreSQL (what you will use at work) writes it differently, a 🐘 box shows that version too.</p>
<div class="callout"><strong>How to work on this page.</strong>
<ol>
<li>Open SSMS (or Azure Data Studio), create the FUHCompany database from lesson 5.B, and keep this page's solutions hidden.</li>
<li>For each exercise: write the query, run it, and compare the <strong>number of rows</strong> and the rows themselves with the result here. Same rows, different order is fine unless the task asks for an order.</li>
<li>Read the trap even when you were right — it is the mistake the marker is looking for.</li>
</ol></div>
<h3>A method for every PE query (write it on your scrap paper)</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Output</div><div class="lz-d">which columns, in which order, with which names?</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Tables</div><div class="lz-d">which tables hold those columns and the conditions? follow the ERD lines to join them</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Rows</div><div class="lz-d">conditions on one row → WHERE; "every/none" → NOT EXISTS</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Groups</div><div class="lz-d">"per / each / number of" → GROUP BY; conditions on counts/averages → HAVING</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Order</div><div class="lz-d">ORDER BY, TOP … WITH TIES</div></div>
</div>
<p>Reminder of the database: tblEmployee (14), tblDepartment (5), tblLocation (4), tblDepLocation (8), tblProject (6), tblWorksOn (16), tblDependent (5). TP Cần Thơ has no project, department 5 has no project, departments 1 and 2 both have 4 employees, Bùi Văn Nam has no address, Phan Hữu Nghĩa no birth date.</p>`,
    `<span class="eyebrow">Chương 6 · Bài 6.6 · Thực hành &amp; ôn tập</span>
<h2>Truy vấn SQL — tám bài tập kiểu đề PE trên FUHCompany</h2>
<p class="lead">Bài PE (thi thực hành, 85 phút, 30 % điểm) cho bạn một CSDL và 8–10 câu "viết câu truy vấn trả về…", xếp từ dễ tới khó. Tám bài này đi đúng thứ tự đó và phủ mọi dạng của Chương 6. Mỗi bài: đề → hướng nghĩ → lời giải đọc theo thứ tự thực thi, chạy thật trên SQL Server → cái bẫy làm mất điểm. Chỗ nào PostgreSQL (thứ bạn dùng khi đi làm) viết khác, một ô 🐘 cho xem luôn bản đó.</p>
<div class="callout"><strong>Cách làm với trang này.</strong>
<ol>
<li>Mở SSMS (hoặc Azure Data Studio), tạo CSDL FUHCompany theo bài 5.B, và che lời giải trên trang này lại.</li>
<li>Với mỗi bài: viết câu truy vấn, chạy, rồi so <strong>số dòng</strong> và chính các dòng với kết quả ở đây. Cùng các dòng mà khác thứ tự thì vẫn đúng, trừ khi đề yêu cầu thứ tự.</li>
<li>Đọc cái bẫy kể cả khi bạn làm đúng — đó là lỗi mà người chấm đang tìm.</li>
</ol></div>
<h3>Một phương pháp cho mọi câu PE (ghi ra giấy nháp)</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Đầu ra</div><div class="lz-d">những cột nào, thứ tự nào, tên gì?</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Bảng</div><div class="lz-d">bảng nào chứa các cột và điều kiện đó? đi theo các đường trên ERD để nối</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Dòng</div><div class="lz-d">điều kiện trên một dòng → WHERE; "mọi / không có" → NOT EXISTS</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Nhóm</div><div class="lz-d">"mỗi / từng / số lượng" → GROUP BY; điều kiện trên số đếm/trung bình → HAVING</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Thứ tự</div><div class="lz-d">ORDER BY, TOP … WITH TIES</div></div>
</div>
<p>Nhắc lại CSDL: tblEmployee (14), tblDepartment (5), tblLocation (4), tblDepLocation (8), tblProject (6), tblWorksOn (16), tblDependent (5). TP Cần Thơ không có dự án, phòng 5 không có dự án, phòng 1 và 2 cùng có 4 nhân viên, Bùi Văn Nam không có địa chỉ, Phan Hữu Nghĩa không có ngày sinh.</p>`),
    bi(`<h3>🧪 Exercise 1 — filter and sort (PE question 1–2 · ~5 min)</h3>
<p class="nhan">Task</p>
<p>(a) List the SSN, name and salary of the female employees whose salary is from 50000 to 90000, highest salary first; equal salaries by name. (b) List the name and salary of the employees whose name starts with H, L or T.</p>
<p class="nhan">How to think</p>
<p>One table, conditions on one row → only FROM, WHERE, SELECT, ORDER BY. "From 50000 to 90000" includes both ends → BETWEEN. "Starts with H, L or T" → one LIKE pattern with a character set.</p>
<p class="nhan">Solution</p>
<pre><code class="language-sql">SELECT empSSN, empName, empSalary
FROM tblEmployee
WHERE empSex = 'F'
  AND empSalary BETWEEN 50000 AND 90000        -- both ends included
ORDER BY empSalary DESC, empName ASC;</code></pre>
<pre><code class="language-sql">SELECT empName, empSalary
FROM tblEmployee
WHERE empName LIKE N'[HLT]%'                   -- first letter H, L or T (SQL Server only)
ORDER BY empName;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>30121050020</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>30121050037</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
<tr><td>30121050027</td><td>Trương Thị Thu</td><td>52000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>45000</td></tr>
<tr><td>Lý Thanh Tâm</td><td>65000</td></tr>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Trương Thị Thu</td><td>52000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause (a)</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee</td><td>14</td></tr>
<tr><td>2</td><td>WHERE empSex = 'F' AND empSalary BETWEEN 50000 AND 90000</td><td>6 women → Lê Thị Lan Anh (45000) fails → 5</td></tr>
<tr><td>5</td><td>SELECT empSSN, empName, empSalary</td><td>5</td></tr>
<tr><td>6</td><td>ORDER BY empSalary DESC, empName</td><td>90000 … 52000</td></tr>
</tbody>
</table>
<ul>
<li><code>BETWEEN a AND b</code> = <code>&gt;= a AND &lt;= b</code>: Hoàng Thị Hà with exactly 90000 is included.</li>
<li><code>[HLT]</code> in a LIKE pattern = one character among H, L, T (SQL Server). <code>[A-C]</code> is a range, <code>[^H]</code> = any character except H.</li>
<li>In (b) the names are sorted by the database collation, which is not Vietnamese: "Hồ" comes before "Hoàng" because accents are compared in a Latin order.</li>
</ul>
<div class="pitfall">Traps: <code>BETWEEN 90000 AND 50000</code> (reversed) returns nothing; <code>empSex = 'f'</code> works on SQL Server (case-insensitive) but not on PostgreSQL; and <code>LIKE 'H%' OR 'L%'</code> is not a condition — each alternative needs its own <code>empName LIKE …</code>, or one <code>[HLT]</code> pattern.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> <code>[ ]</code> is NOT a wildcard in LIKE — the same pattern finds nobody. Use a regular expression <code>~ '^[HLT]'</code> (or <code>SIMILAR TO '[HLT]%'</code>):
<pre><code class="language-sql">SELECT empName, empSalary
FROM tblEmployee
WHERE empName ~ '^[HLT]'                       -- regular expression: starts with H, L or T
ORDER BY empName;
SELECT empName
FROM tblEmployee
WHERE empName LIKE '[HLT]%';                   -- in PostgreSQL [ ] is NOT a wildcard: 0 rows</code></pre>
<table>
<thead><tr><th>empname</th><th>empsalary</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>45000</td></tr>
<tr><td>Lý Thanh Tâm</td><td>65000</td></tr>
<tr><td>Trương Thị Thu</td><td>52000</td></tr>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empname</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-2-select-where">PostgreSQL 4.2 — SELECT … WHERE</a>.</div>`,
    `<h3>🧪 Bài 1 — lọc và sắp xếp (câu 1–2 của đề PE · ~5 phút)</h3>
<p class="nhan">Đề</p>
<p>(a) Liệt kê SSN, tên và lương của các nhân viên nữ có lương từ 50000 đến 90000, lương cao trước; cùng lương thì theo tên. (b) Liệt kê tên và lương của các nhân viên có tên bắt đầu bằng H, L hoặc T.</p>
<p class="nhan">Hướng nghĩ</p>
<p>Một bảng, điều kiện trên một dòng → chỉ cần FROM, WHERE, SELECT, ORDER BY. "Từ 50000 đến 90000" lấy cả hai đầu → BETWEEN. "Bắt đầu bằng H, L hoặc T" → một mẫu LIKE với tập ký tự.</p>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">SELECT empSSN, empName, empSalary
FROM tblEmployee
WHERE empSex = 'F'
  AND empSalary BETWEEN 50000 AND 90000        -- lấy cả hai đầu mút
ORDER BY empSalary DESC, empName ASC;</code></pre>
<pre><code class="language-sql">SELECT empName, empSalary
FROM tblEmployee
WHERE empName LIKE N'[HLT]%'                   -- chữ đầu là H, L hoặc T (chỉ SQL Server)
ORDER BY empName;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>30121050020</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>30121050011</td><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>30121050037</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
<tr><td>30121050027</td><td>Trương Thị Thu</td><td>52000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>45000</td></tr>
<tr><td>Lý Thanh Tâm</td><td>65000</td></tr>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>Trương Thị Thu</td><td>52000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề (a)</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM tblEmployee</td><td>14</td></tr>
<tr><td>2</td><td>WHERE empSex = 'F' AND empSalary BETWEEN 50000 AND 90000</td><td>6 người nữ → Lê Thị Lan Anh (45000) bị loại → 5</td></tr>
<tr><td>5</td><td>SELECT empSSN, empName, empSalary</td><td>5</td></tr>
<tr><td>6</td><td>ORDER BY empSalary DESC, empName</td><td>90000 … 52000</td></tr>
</tbody>
</table>
<ul>
<li><code>BETWEEN a AND b</code> = <code>&gt;= a AND &lt;= b</code>: Hoàng Thị Hà lương đúng 90000 vẫn được lấy.</li>
<li><code>[HLT]</code> trong mẫu LIKE = một ký tự thuộc H, L, T (SQL Server). <code>[A-C]</code> là một khoảng, <code>[^H]</code> = ký tự bất kỳ trừ H.</li>
<li>Ở (b) tên được sắp theo collation (bộ luật so sánh chữ) của CSDL, vốn không phải tiếng Việt: "Hồ" đứng trước "Hoàng" vì dấu được so theo thứ tự Latin.</li>
</ul>
<div class="pitfall">Bẫy: <code>BETWEEN 90000 AND 50000</code> (đảo ngược) ra rỗng; <code>empSex = 'f'</code> chạy được trên SQL Server (không phân biệt hoa thường) nhưng không chạy trên PostgreSQL; và <code>LIKE 'H%' OR 'L%'</code> không phải một điều kiện — mỗi lựa chọn cần một <code>empName LIKE …</code> riêng, hoặc một mẫu <code>[HLT]</code>.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> <code>[ ]</code> KHÔNG phải ký tự đại diện trong LIKE — cùng mẫu đó không tìm được ai. Dùng biểu thức chính quy (regular expression) <code>~ '^[HLT]'</code> (hoặc <code>SIMILAR TO '[HLT]%'</code>):
<pre><code class="language-sql">SELECT empName, empSalary
FROM tblEmployee
WHERE empName ~ '^[HLT]'                       -- biểu thức chính quy: bắt đầu bằng H, L hoặc T
ORDER BY empName;
SELECT empName
FROM tblEmployee
WHERE empName LIKE '[HLT]%';                   -- trong PostgreSQL [ ] KHÔNG phải ký tự đại diện: 0 dòng</code></pre>
<table>
<thead><tr><th>empname</th><th>empsalary</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>72000</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>45000</td></tr>
<tr><td>Lý Thanh Tâm</td><td>65000</td></tr>
<tr><td>Trương Thị Thu</td><td>52000</td></tr>
<tr><td>Trần Minh Quang</td><td>150000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empname</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-2-select-where">PostgreSQL 4.2 — SELECT … WHERE</a>.</div>`),
    bi(`<h3>🧪 Exercise 2 — join four tables (PE question 3 · ~8 min)</h3>
<p class="nhan">Task</p>
<p>For every project located in "TP Hồ Chí Minh", give the project name, the name of the department that controls it, and its manager written as "Name (SSN)".</p>
<p class="nhan">How to think</p>
<p>Follow the ERD: project → location (to test the city), project → department (controls), department → employee (the manager, via mgrSSN). Four tables, three join conditions. The employee here plays the role "manager", so give it an alias that says so (m).</p>
<p class="nhan">Solution</p>
<pre><code class="language-sql">SELECT p.proName,
       d.depName,
       m.empName + N' (' + CAST(m.empSSN AS VARCHAR(20)) + N')' AS manager
FROM tblProject p
JOIN tblLocation   l ON p.locNum = l.locNum
JOIN tblDepartment d ON p.depNum = d.depNum
JOIN tblEmployee   m ON d.mgrSSN = m.empSSN          -- m = the manager of the department
WHERE l.locName = N'TP Hồ Chí Minh'
ORDER BY p.proName;</code></pre>
<table>
<thead><tr><th>proName</th><th>depName</th><th>manager</th></tr></thead>
<tbody>
<tr><td>ProjectB</td><td>Phòng Phần mềm trong nước</td><td>Trần Minh Quang (30121050001)</td></tr>
<tr><td>ProjectD</td><td>Phòng Phần mềm nước ngoài</td><td>Phạm Quốc Bảo (30121050010)</td></tr>
<tr><td>ProjectF</td><td>Phòng Hành chính</td><td>Huỳnh Văn Tài (30121050030)</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM p JOIN l (p.locNum = l.locNum)</td><td>6 (each project has one location)</td></tr>
<tr><td>1</td><td>JOIN d (p.depNum = d.depNum)</td><td>6</td></tr>
<tr><td>1</td><td>JOIN m (d.mgrSSN = m.empSSN)</td><td>6 (each department has a manager)</td></tr>
<tr><td>2</td><td>WHERE l.locName = N'TP Hồ Chí Minh'</td><td>3: ProjectB, ProjectD, ProjectF</td></tr>
<tr><td>5</td><td>SELECT … + … AS manager</td><td>build the text</td></tr>
<tr><td>6</td><td>ORDER BY p.proName</td><td></td></tr>
</tbody>
</table>
<p><code>+</code> joins strings in T-SQL, but it does NOT convert numbers: empSSN is DECIMAL, so it must be CAST to text first. Without the CAST, and with NULLs:</p>
<pre><code class="language-sql">-- + between a string and a number: SQL Server tries to turn the STRING into a number
SELECT empName + N' - ' + empSalary AS label FROM tblEmployee WHERE empSSN = 30121050001;
GO
-- CONCAT converts everything to text and treats NULL as '' (works on PostgreSQL too)
SELECT CONCAT(empName, N' - ', empSalary) AS label, empName + N' / ' + empAddress AS plus_null
FROM tblEmployee WHERE empSSN IN (30121050001, 30121050021);
GO</code></pre>
<table>
<thead><tr><th>label</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 8114, Level 16, State 5<br>
Error converting data type nvarchar to numeric.</b></div>
<table>
<thead><tr><th>label</th><th>plus_null</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang - 150000</td><td>Trần Minh Quang / 45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Bùi Văn Nam - 40000</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="pitfall">Two traps. (1) <code>'text' + number</code> makes SQL Server try to turn the text into a number → Msg 8114. (2) <code>'text' + NULL</code> is NULL — Bùi Văn Nam's whole label vanishes. <code>CONCAT(…)</code> avoids both. And a join through the wrong column (d.depNum = m.depNum instead of d.mgrSSN = m.empSSN) gives every employee of the department instead of its manager.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> strings are joined with <code>||</code>, and a number next to a string is converted automatically (but <code>|| NULL</code> still gives NULL; <code>concat()</code> ignores NULLs, as on SQL Server):
<pre><code class="language-sql">SELECT p.proName,
       d.depName,
       m.empName || ' (' || m.empSSN || ')' AS manager      -- || joins strings; numbers are converted
FROM tblProject p
JOIN tblLocation   l ON p.locNum = l.locNum
JOIN tblDepartment d ON p.depNum = d.depNum
JOIN tblEmployee   m ON d.mgrSSN = m.empSSN
WHERE l.locName = 'TP Hồ Chí Minh'
ORDER BY p.proName;</code></pre>
<table>
<thead><tr><th>proname</th><th>depname</th><th>manager</th></tr></thead>
<tbody>
<tr><td>ProjectB</td><td>Phòng Phần mềm trong nước</td><td>Trần Minh Quang (30121050001)</td></tr>
<tr><td>ProjectD</td><td>Phòng Phần mềm nước ngoài</td><td>Phạm Quốc Bảo (30121050010)</td></tr>
<tr><td>ProjectF</td><td>Phòng Hành chính</td><td>Huỳnh Văn Tài (30121050030)</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-3-multi-self-join">PostgreSQL 5.3 — multi-table joins</a> · <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-2-text">2.2 — text</a>.</div>`,
    `<h3>🧪 Bài 2 — nối bốn bảng (câu 3 của đề PE · ~8 phút)</h3>
<p class="nhan">Đề</p>
<p>Với mỗi dự án đặt ở "TP Hồ Chí Minh", cho biết tên dự án, tên phòng quản lý nó, và trưởng phòng viết dạng "Tên (SSN)".</p>
<p class="nhan">Hướng nghĩ</p>
<p>Đi theo ERD: dự án → địa điểm (để kiểm thành phố), dự án → phòng (quản lý), phòng → nhân viên (trưởng phòng, qua mgrSSN). Bốn bảng, ba điều kiện nối. Nhân viên ở đây đóng vai "trưởng phòng", nên đặt bí danh nói đúng vai đó (m).</p>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">SELECT p.proName,
       d.depName,
       m.empName + N' (' + CAST(m.empSSN AS VARCHAR(20)) + N')' AS manager
FROM tblProject p
JOIN tblLocation   l ON p.locNum = l.locNum
JOIN tblDepartment d ON p.depNum = d.depNum
JOIN tblEmployee   m ON d.mgrSSN = m.empSSN          -- m = trưởng phòng của phòng đó
WHERE l.locName = N'TP Hồ Chí Minh'
ORDER BY p.proName;</code></pre>
<table>
<thead><tr><th>proName</th><th>depName</th><th>manager</th></tr></thead>
<tbody>
<tr><td>ProjectB</td><td>Phòng Phần mềm trong nước</td><td>Trần Minh Quang (30121050001)</td></tr>
<tr><td>ProjectD</td><td>Phòng Phần mềm nước ngoài</td><td>Phạm Quốc Bảo (30121050010)</td></tr>
<tr><td>ProjectF</td><td>Phòng Hành chính</td><td>Huỳnh Văn Tài (30121050030)</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM p JOIN l (p.locNum = l.locNum)</td><td>6 (mỗi dự án một địa điểm)</td></tr>
<tr><td>1</td><td>JOIN d (p.depNum = d.depNum)</td><td>6</td></tr>
<tr><td>1</td><td>JOIN m (d.mgrSSN = m.empSSN)</td><td>6 (phòng nào cũng có trưởng phòng)</td></tr>
<tr><td>2</td><td>WHERE l.locName = N'TP Hồ Chí Minh'</td><td>3: ProjectB, ProjectD, ProjectF</td></tr>
<tr><td>5</td><td>SELECT … + … AS manager</td><td>ghép chuỗi</td></tr>
<tr><td>6</td><td>ORDER BY p.proName</td><td></td></tr>
</tbody>
</table>
<p><code>+</code> nối chuỗi trong T-SQL, nhưng KHÔNG tự đổi số: empSSN là DECIMAL nên phải CAST sang chữ trước. Không CAST, và khi gặp NULL:</p>
<pre><code class="language-sql">-- + giữa chuỗi và số: SQL Server cố đổi CHUỖI thành số
SELECT empName + N' - ' + empSalary AS label FROM tblEmployee WHERE empSSN = 30121050001;
GO
-- CONCAT đổi mọi thứ thành chữ và coi NULL là '' (PostgreSQL cũng có)
SELECT CONCAT(empName, N' - ', empSalary) AS label, empName + N' / ' + empAddress AS plus_null
FROM tblEmployee WHERE empSSN IN (30121050001, 30121050021);
GO</code></pre>
<table>
<thead><tr><th>label</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 8114, Level 16, State 5<br>
Error converting data type nvarchar to numeric.</b></div>
<table>
<thead><tr><th>label</th><th>plus_null</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang - 150000</td><td>Trần Minh Quang / 45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td></tr>
<tr><td>Bùi Văn Nam - 40000</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="pitfall">Hai cái bẫy. (1) <code>'chữ' + số</code> khiến SQL Server cố đổi chữ thành số → Msg 8114. (2) <code>'chữ' + NULL</code> là NULL — cả nhãn của Bùi Văn Nam biến mất. <code>CONCAT(…)</code> tránh được cả hai. Còn nối nhầm cột (d.depNum = m.depNum thay vì d.mgrSSN = m.empSSN) sẽ ra mọi nhân viên của phòng thay vì trưởng phòng.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> chuỗi được nối bằng <code>||</code>, và số đứng cạnh chuỗi được tự đổi (nhưng <code>|| NULL</code> vẫn ra NULL; <code>concat()</code> bỏ qua NULL, như trên SQL Server):
<pre><code class="language-sql">SELECT p.proName,
       d.depName,
       m.empName || ' (' || m.empSSN || ')' AS manager      -- || nối chuỗi; số được tự đổi
FROM tblProject p
JOIN tblLocation   l ON p.locNum = l.locNum
JOIN tblDepartment d ON p.depNum = d.depNum
JOIN tblEmployee   m ON d.mgrSSN = m.empSSN
WHERE l.locName = 'TP Hồ Chí Minh'
ORDER BY p.proName;</code></pre>
<table>
<thead><tr><th>proname</th><th>depname</th><th>manager</th></tr></thead>
<tbody>
<tr><td>ProjectB</td><td>Phòng Phần mềm trong nước</td><td>Trần Minh Quang (30121050001)</td></tr>
<tr><td>ProjectD</td><td>Phòng Phần mềm nước ngoài</td><td>Phạm Quốc Bảo (30121050010)</td></tr>
<tr><td>ProjectF</td><td>Phòng Hành chính</td><td>Huỳnh Văn Tài (30121050030)</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-3-multi-self-join">PostgreSQL 5.3 — nối nhiều bảng</a> · <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-2-text">2.2 — kiểu chữ</a>.</div>`),
    bi(`<h3>🧪 Exercise 3 — self-join (PE question 4 · ~8 min)</h3>
<p class="nhan">Task</p>
<p>(a) List every employee with the name of his supervisor; the director, who has none, must appear with "(none)". (b) List the employees whose supervisor works in a different department.</p>
<p class="nhan">How to think</p>
<p>Supervisor = another row of the same table (the SUPERVISION line on the ERD) → two aliases, e and s. "Every employee, even without a supervisor" → LEFT JOIN, and replace the NULL with a text.</p>
<p class="nhan">Solution</p>
<pre><code class="language-sql">SELECT e.empName                      AS employee,
       ISNULL(s.empName, N'(none)')   AS supervisor,
       e.depNum                       AS empDep,
       s.depNum                       AS supDep
FROM tblEmployee e
LEFT JOIN tblEmployee s ON e.supervisorSSN = s.empSSN
ORDER BY e.depNum, e.empName;</code></pre>
<table>
<thead><tr><th>employee</th><th>supervisor</th><th>empDep</th><th>supDep</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>Trần Minh Quang</td><td>1</td><td>1</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>Hoàng Thị Hà</td><td>1</td><td>1</td></tr>
<tr><td>Trần Minh Quang</td><td>(none)</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>Võ Việt Anh</td><td>Hoàng Thị Hà</td><td>1</td><td>1</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>Phạm Quốc Bảo</td><td>2</td><td>2</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>Phạm Quốc Bảo</td><td>2</td><td>2</td></tr>
<tr><td>Mai Duy An</td><td>Phạm Quốc Bảo</td><td>2</td><td>2</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>Trần Minh Quang</td><td>2</td><td>1</td></tr>
<tr><td>Bùi Văn Nam</td><td>Nguyễn Thị Mai</td><td>3</td><td>3</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>Trần Minh Quang</td><td>3</td><td>1</td></tr>
<tr><td>Trương Thị Thu</td><td>Nguyễn Thị Mai</td><td>3</td><td>3</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>Trần Minh Quang</td><td>4</td><td>1</td></tr>
<tr><td>Lý Thanh Tâm</td><td>Trần Minh Quang</td><td>5</td><td>1</td></tr>
<tr><td>Phan Hữu Nghĩa</td><td>Lý Thanh Tâm</td><td>5</td><td>5</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>Rows</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM e LEFT JOIN s ON e.supervisorSSN = s.empSSN</td><td>13 matches + Trần Minh Quang padded with NULL = 14</td></tr>
<tr><td>5</td><td>SELECT ISNULL(s.empName, N'(none)')</td><td>NULL → "(none)"</td></tr>
<tr><td>6</td><td>ORDER BY e.depNum, e.empName</td><td></td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- (b) supervised by someone of ANOTHER department
SELECT e.empName, e.depNum, s.empName AS supervisor, s.depNum AS supDep
FROM tblEmployee e
JOIN tblEmployee s ON e.supervisorSSN = s.empSSN
WHERE e.depNum &lt;&gt; s.depNum
ORDER BY e.empName;</code></pre>
<table>
<thead><tr><th>empName</th><th>depNum</th><th>supervisor</th><th>supDep</th></tr></thead>
<tbody>
<tr><td>Huỳnh Văn Tài</td><td>4</td><td>Trần Minh Quang</td><td>1</td></tr>
<tr><td>Lý Thanh Tâm</td><td>5</td><td>Trần Minh Quang</td><td>1</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>3</td><td>Trần Minh Quang</td><td>1</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>2</td><td>Trần Minh Quang</td><td>1</td></tr>
</tbody>
</table>
<p>(b) needs an inner join (the director has no supervisor, so no "different department") and a condition comparing the two copies: <code>e.depNum &lt;&gt; s.depNum</code>. The four department heads report to the director of department 1.</p>
<div class="pitfall">With a plain JOIN in (a) the director disappears (13 rows instead of 14) — exactly the "every employee" the task insists on. And writing <code>s.supervisorSSN = e.empSSN</code> swaps the roles: you get each employee with the people HE supervises.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> <code>ISNULL(x, y)</code> does not exist; use the standard <code>COALESCE(x, y)</code> (which SQL Server also accepts — the portable habit):
<pre><code class="language-sql">SELECT e.empName AS employee,
       COALESCE(s.empName, '(none)') AS supervisor        -- T-SQL: ISNULL(x, y)
FROM tblEmployee e
LEFT JOIN tblEmployee s ON e.supervisorSSN = s.empSSN
WHERE e.depNum IN (1, 5)
ORDER BY e.depNum, e.empName;</code></pre>
<table>
<thead><tr><th>employee</th><th>supervisor</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>Trần Minh Quang</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>Hoàng Thị Hà</td></tr>
<tr><td>Trần Minh Quang</td><td>(none)</td></tr>
<tr><td>Võ Việt Anh</td><td>Hoàng Thị Hà</td></tr>
<tr><td>Lý Thanh Tâm</td><td>Trần Minh Quang</td></tr>
<tr><td>Phan Hữu Nghĩa</td><td>Lý Thanh Tâm</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-3-multi-self-join">PostgreSQL 5.3 — self joins</a>.</div>`,
    `<h3>🧪 Bài 3 — tự nối (câu 4 của đề PE · ~8 phút)</h3>
<p class="nhan">Đề</p>
<p>(a) Liệt kê mọi nhân viên kèm tên người giám sát; giám đốc, người không có ai giám sát, phải hiện với "(none)". (b) Liệt kê các nhân viên có người giám sát làm ở phòng khác.</p>
<p class="nhan">Hướng nghĩ</p>
<p>Người giám sát = một dòng khác của cùng bảng (đường SUPERVISION trên ERD) → hai bí danh, e và s. "Mọi nhân viên, kể cả không có người giám sát" → LEFT JOIN, rồi thay NULL bằng một chuỗi.</p>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">SELECT e.empName                      AS employee,
       ISNULL(s.empName, N'(none)')   AS supervisor,
       e.depNum                       AS empDep,
       s.depNum                       AS supDep
FROM tblEmployee e
LEFT JOIN tblEmployee s ON e.supervisorSSN = s.empSSN
ORDER BY e.depNum, e.empName;</code></pre>
<table>
<thead><tr><th>employee</th><th>supervisor</th><th>empDep</th><th>supDep</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>Trần Minh Quang</td><td>1</td><td>1</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>Hoàng Thị Hà</td><td>1</td><td>1</td></tr>
<tr><td>Trần Minh Quang</td><td>(none)</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>Võ Việt Anh</td><td>Hoàng Thị Hà</td><td>1</td><td>1</td></tr>
<tr><td>Đặng Tuấn Anh</td><td>Phạm Quốc Bảo</td><td>2</td><td>2</td></tr>
<tr><td>Hồ Ngọc Hân</td><td>Phạm Quốc Bảo</td><td>2</td><td>2</td></tr>
<tr><td>Mai Duy An</td><td>Phạm Quốc Bảo</td><td>2</td><td>2</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>Trần Minh Quang</td><td>2</td><td>1</td></tr>
<tr><td>Bùi Văn Nam</td><td>Nguyễn Thị Mai</td><td>3</td><td>3</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>Trần Minh Quang</td><td>3</td><td>1</td></tr>
<tr><td>Trương Thị Thu</td><td>Nguyễn Thị Mai</td><td>3</td><td>3</td></tr>
<tr><td>Huỳnh Văn Tài</td><td>Trần Minh Quang</td><td>4</td><td>1</td></tr>
<tr><td>Lý Thanh Tâm</td><td>Trần Minh Quang</td><td>5</td><td>1</td></tr>
<tr><td>Phan Hữu Nghĩa</td><td>Lý Thanh Tâm</td><td>5</td><td>5</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM e LEFT JOIN s ON e.supervisorSSN = s.empSSN</td><td>13 dòng khớp + Trần Minh Quang đệm NULL = 14</td></tr>
<tr><td>5</td><td>SELECT ISNULL(s.empName, N'(none)')</td><td>NULL → "(none)"</td></tr>
<tr><td>6</td><td>ORDER BY e.depNum, e.empName</td><td></td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- (b) được giám sát bởi người của phòng KHÁC
SELECT e.empName, e.depNum, s.empName AS supervisor, s.depNum AS supDep
FROM tblEmployee e
JOIN tblEmployee s ON e.supervisorSSN = s.empSSN
WHERE e.depNum &lt;&gt; s.depNum
ORDER BY e.empName;</code></pre>
<table>
<thead><tr><th>empName</th><th>depNum</th><th>supervisor</th><th>supDep</th></tr></thead>
<tbody>
<tr><td>Huỳnh Văn Tài</td><td>4</td><td>Trần Minh Quang</td><td>1</td></tr>
<tr><td>Lý Thanh Tâm</td><td>5</td><td>Trần Minh Quang</td><td>1</td></tr>
<tr><td>Nguyễn Thị Mai</td><td>3</td><td>Trần Minh Quang</td><td>1</td></tr>
<tr><td>Phạm Quốc Bảo</td><td>2</td><td>Trần Minh Quang</td><td>1</td></tr>
</tbody>
</table>
<p>(b) cần nối trong (giám đốc không có người giám sát, nên không có "phòng khác") và một điều kiện so hai bản sao: <code>e.depNum &lt;&gt; s.depNum</code>. Bốn trưởng phòng báo cáo cho giám đốc ở phòng 1.</p>
<div class="pitfall">Dùng JOIN thường ở (a) thì giám đốc biến mất (13 dòng thay vì 14) — đúng cái "mọi nhân viên" mà đề nhấn mạnh. Còn viết <code>s.supervisorSSN = e.empSSN</code> là đảo vai: bạn được mỗi nhân viên kèm những người mà ANH TA giám sát.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> không có <code>ISNULL(x, y)</code>; dùng hàm chuẩn <code>COALESCE(x, y)</code> (SQL Server cũng nhận — thói quen dùng được ở cả hai):
<pre><code class="language-sql">SELECT e.empName AS employee,
       COALESCE(s.empName, '(none)') AS supervisor        -- T-SQL: ISNULL(x, y)
FROM tblEmployee e
LEFT JOIN tblEmployee s ON e.supervisorSSN = s.empSSN
WHERE e.depNum IN (1, 5)
ORDER BY e.depNum, e.empName;</code></pre>
<table>
<thead><tr><th>employee</th><th>supervisor</th></tr></thead>
<tbody>
<tr><td>Hoàng Thị Hà</td><td>Trần Minh Quang</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>Hoàng Thị Hà</td></tr>
<tr><td>Trần Minh Quang</td><td>(none)</td></tr>
<tr><td>Võ Việt Anh</td><td>Hoàng Thị Hà</td></tr>
<tr><td>Lý Thanh Tâm</td><td>Trần Minh Quang</td></tr>
<tr><td>Phan Hữu Nghĩa</td><td>Lý Thanh Tâm</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-3-multi-self-join">PostgreSQL 5.3 — tự nối</a>.</div>`),
    bi(`<h3>🧪 Exercise 4 — NOT EXISTS and "division" (PE question 5–6 · ~12 min)</h3>
<p class="nhan">Task</p>
<p>(a) Find the employees who work on no project. (b) Find the employees who work on <strong>every</strong> project controlled by department 1.</p>
<p class="nhan">How to think</p>
<p>"No project" = there does not exist a row in tblWorksOn for him → NOT EXISTS. "Every project of dept 1" is relational division (÷); SQL has no ÷, so say it with a double negation: "there is <strong>no</strong> project of department 1 that he does <strong>not</strong> work on".</p>
<p class="nhan">Solution</p>
<pre><code class="language-sql">-- (a) employees who work on NO project
SELECT e.empSSN, e.empName
FROM tblEmployee e
WHERE NOT EXISTS (SELECT * FROM tblWorksOn w WHERE w.empSSN = e.empSSN);</code></pre>
<pre><code class="language-sql">-- (b) employees who work on EVERY project controlled by department 1
SELECT e.empSSN, e.empName
FROM tblEmployee e
WHERE NOT EXISTS (                       -- there is no project of dept 1 ...
    SELECT * FROM tblProject p
    WHERE p.depNum = 1
      AND NOT EXISTS (                   -- ... that e does not work on
          SELECT * FROM tblWorksOn w
          WHERE w.empSSN = e.empSSN AND w.proNum = p.proNum));</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th></tr></thead>
<tbody>
<tr><td>30121050037</td><td>Lý Thanh Tâm</td></tr>
<tr><td>30121050038</td><td>Phan Hữu Nghĩa</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td></tr>
</tbody>
</table>
<p>How (b) is evaluated: for each employee e (outer, correlated), the middle query lists the projects of department 1 (projects 1 and 2) that e is missing; e is kept when that list is empty. The count of missing projects for the first five employees:</p>
<pre><code class="language-sql">-- for each candidate e: how many dept-1 projects (1, 2) are MISSING for e
SELECT e.empName,
       (SELECT COUNT(*) FROM tblProject p
        WHERE p.depNum = 1
          AND NOT EXISTS (SELECT * FROM tblWorksOn w WHERE w.empSSN = e.empSSN AND w.proNum = p.proNum)) AS missing
FROM tblEmployee e
WHERE e.empSSN IN (30121050001, 30121050002, 30121050003, 30121050004, 30121050005)
ORDER BY missing, e.empName;</code></pre>
<table>
<thead><tr><th>empName</th><th>missing</th></tr></thead>
<tbody>
<tr><td>Võ Việt Anh</td><td>0</td></tr>
<tr><td>Hoàng Thị Hà</td><td>1</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>1</td></tr>
<tr><td>Mai Duy An</td><td>1</td></tr>
<tr><td>Trần Minh Quang</td><td>1</td></tr>
</tbody>
</table>
<p>Only Võ Việt Anh misses 0 (he works on both 1 and 2). The same division by counting — "works on as many dept-1 projects as department 1 has":</p>
<pre><code class="language-sql">-- the same division with counting: works on as many dept-1 projects as dept 1 has
SELECT w.empSSN, COUNT(*) AS dep1_projects_done
FROM tblWorksOn w JOIN tblProject p ON w.proNum = p.proNum
WHERE p.depNum = 1
GROUP BY w.empSSN
HAVING COUNT(*) = (SELECT COUNT(*) FROM tblProject WHERE depNum = 1);</code></pre>
<table>
<thead><tr><th>empSSN</th><th>dep1_projects_done</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>2</td></tr>
</tbody>
</table>
<div class="pitfall"><code>WHERE proNum IN (1, 2)</code> finds who works on 1 <strong>or</strong> 2 (4 people), not on both. Hard-coding 1 and 2 also breaks as soon as department 1 gets a new project — the NOT EXISTS version reads the list from the data. For (a), <code>NOT IN (SELECT empSSN FROM tblWorksOn)</code> works only because empSSN there can never be NULL; NOT EXISTS is always safe.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the double NOT EXISTS is written identically — it is the standard division pattern at work too. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-7-2-correlated-exists">PostgreSQL 7.2 — correlated subqueries and EXISTS</a>.</div>`,
    `<h3>🧪 Bài 4 — NOT EXISTS và "phép chia" (câu 5–6 của đề PE · ~12 phút)</h3>
<p class="nhan">Đề</p>
<p>(a) Tìm các nhân viên không làm dự án nào. (b) Tìm các nhân viên làm <strong>mọi</strong> dự án do phòng 1 quản lý.</p>
<p class="nhan">Hướng nghĩ</p>
<p>"Không làm dự án nào" = không tồn tại dòng nào trong tblWorksOn của người đó → NOT EXISTS. "Mọi dự án của phòng 1" là phép chia quan hệ (÷); SQL không có ÷, nên nói bằng phủ định kép: "<strong>không có</strong> dự án nào của phòng 1 mà người đó <strong>không</strong> làm".</p>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">-- (a) nhân viên không làm dự án nào
SELECT e.empSSN, e.empName
FROM tblEmployee e
WHERE NOT EXISTS (SELECT * FROM tblWorksOn w WHERE w.empSSN = e.empSSN);</code></pre>
<pre><code class="language-sql">-- (b) nhân viên làm MỌI dự án do phòng 1 quản lý
SELECT e.empSSN, e.empName
FROM tblEmployee e
WHERE NOT EXISTS (                       -- không có dự án nào của phòng 1 ...
    SELECT * FROM tblProject p
    WHERE p.depNum = 1
      AND NOT EXISTS (                   -- ... mà e không làm
          SELECT * FROM tblWorksOn w
          WHERE w.empSSN = e.empSSN AND w.proNum = p.proNum));</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th></tr></thead>
<tbody>
<tr><td>30121050037</td><td>Lý Thanh Tâm</td></tr>
<tr><td>30121050038</td><td>Phan Hữu Nghĩa</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>Võ Việt Anh</td></tr>
</tbody>
</table>
<p>Cách (b) được tính: với mỗi nhân viên e (bên ngoài, tương quan), câu giữa liệt kê các dự án của phòng 1 (dự án 1 và 2) mà e còn thiếu; e được giữ khi danh sách đó rỗng. Số dự án còn thiếu của năm nhân viên đầu:</p>
<pre><code class="language-sql">-- với mỗi ứng viên e: e còn THIẾU bao nhiêu dự án của phòng 1 (1, 2)
SELECT e.empName,
       (SELECT COUNT(*) FROM tblProject p
        WHERE p.depNum = 1
          AND NOT EXISTS (SELECT * FROM tblWorksOn w WHERE w.empSSN = e.empSSN AND w.proNum = p.proNum)) AS missing
FROM tblEmployee e
WHERE e.empSSN IN (30121050001, 30121050002, 30121050003, 30121050004, 30121050005)
ORDER BY missing, e.empName;</code></pre>
<table>
<thead><tr><th>empName</th><th>missing</th></tr></thead>
<tbody>
<tr><td>Võ Việt Anh</td><td>0</td></tr>
<tr><td>Hoàng Thị Hà</td><td>1</td></tr>
<tr><td>Lê Thị Lan Anh</td><td>1</td></tr>
<tr><td>Mai Duy An</td><td>1</td></tr>
<tr><td>Trần Minh Quang</td><td>1</td></tr>
</tbody>
</table>
<p>Chỉ Võ Việt Anh thiếu 0 (anh làm cả dự án 1 và 2). Cùng phép chia bằng cách đếm — "số dự án của phòng 1 mà người đó làm bằng số dự án phòng 1 có":</p>
<pre><code class="language-sql">-- cùng phép chia bằng cách đếm: số dự án phòng 1 mà e làm = số dự án phòng 1 có
SELECT w.empSSN, COUNT(*) AS dep1_projects_done
FROM tblWorksOn w JOIN tblProject p ON w.proNum = p.proNum
WHERE p.depNum = 1
GROUP BY w.empSSN
HAVING COUNT(*) = (SELECT COUNT(*) FROM tblProject WHERE depNum = 1);</code></pre>
<table>
<thead><tr><th>empSSN</th><th>dep1_projects_done</th></tr></thead>
<tbody>
<tr><td>30121050003</td><td>2</td></tr>
</tbody>
</table>
<div class="pitfall"><code>WHERE proNum IN (1, 2)</code> tìm người làm dự án 1 <strong>hoặc</strong> 2 (4 người), không phải làm cả hai. Viết cứng 1 và 2 còn hỏng ngay khi phòng 1 có thêm dự án — bản NOT EXISTS đọc danh sách từ dữ liệu. Với (a), <code>NOT IN (SELECT empSSN FROM tblWorksOn)</code> chạy đúng chỉ vì empSSN ở đó không bao giờ NULL; NOT EXISTS thì luôn an toàn.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> NOT EXISTS lồng hai tầng viết y hệt — đi làm cũng dùng đúng mẫu phép chia này. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-7-2-correlated-exists">PostgreSQL 7.2 — truy vấn con tương quan và EXISTS</a>.</div>`),
    bi(`<h3>🧪 Exercise 5 — correlated subquery (PE question 6 · ~10 min)</h3>
<p class="nhan">Task</p>
<p>For each department, list the employee(s) with the highest salary <strong>in that department</strong>: department number, name, salary.</p>
<p class="nhan">How to think</p>
<p>"Highest in HIS department" — the maximum depends on the outer row's department → a correlated subquery: <code>empSalary = (SELECT MAX(…) FROM tblEmployee x WHERE x.depNum = e.depNum)</code>.</p>
<p class="nhan">Solution</p>
<pre><code class="language-sql">SELECT e.depNum, e.empName, e.empSalary
FROM tblEmployee e
WHERE e.empSalary = (SELECT MAX(x.empSalary)
                     FROM tblEmployee x
                     WHERE x.depNum = e.depNum)
ORDER BY e.depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>3</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Outer row e (examples)</th><th>inner MAX for e.depNum</th><th>kept?</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang (1, 150000)</td><td>150000</td><td>yes</td></tr>
<tr><td>Hoàng Thị Hà (1, 90000)</td><td>150000</td><td>no</td></tr>
<tr><td>Đặng Tuấn Anh (2, 105000)</td><td>105000</td><td>yes</td></tr>
<tr><td>Phan Hữu Nghĩa (5, 38000)</td><td>65000</td><td>no</td></tr>
</tbody>
</table>
<p>Two wrong versions that look right. The second one gives the correct answer on the original data by luck, so the file first raises Bùi Văn Nam (department 3) to 70000 — the maximum of department 4 — in its own test database:</p>
<pre><code class="language-sql">-- wrong 1: no correlation -&gt; the maximum of the whole company
SELECT e.depNum, e.empName, e.empSalary
FROM tblEmployee e
WHERE e.empSalary = (SELECT MAX(x.empSalary) FROM tblEmployee x);
GO
-- give Bùi Văn Nam (dept 3) 70000 = the maximum of dept 4, in this test database only
UPDATE tblEmployee SET empSalary = 70000 WHERE empSSN = 30121050021;
GO
-- wrong 2: IN (max of each department) also accepts the max of ANOTHER department
SELECT e.depNum, e.empName, e.empSalary
FROM tblEmployee e
WHERE e.empSalary IN (SELECT MAX(empSalary) FROM tblEmployee GROUP BY depNum)
ORDER BY e.depNum;
GO
-- the correlated version stays correct on the same data
SELECT e.depNum, e.empName, e.empSalary
FROM tblEmployee e
WHERE e.empSalary = (SELECT MAX(x.empSalary) FROM tblEmployee x WHERE x.depNum = e.depNum)
ORDER BY e.depNum;
GO</code></pre>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>3</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>3</td><td>Bùi Văn Nam</td><td>70000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>3</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
</tbody>
</table>
<div class="pitfall">Wrong 1 forgets the correlation: only the company maximum (1 row). Wrong 2, <code>IN (SELECT MAX(…) … GROUP BY depNum)</code>, compares with the list of all departments' maxima, so Bùi Văn Nam (70000 = max of dept 4) sneaks in for department 3. <code>SELECT depNum, empName, MAX(empSalary) … GROUP BY depNum</code> is not even legal (Msg 8120). Ties: if two people share the maximum of a department, the correlated version correctly returns both.</div>`,
    `<h3>🧪 Bài 5 — truy vấn con tương quan (câu 6 của đề PE · ~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Với mỗi phòng, liệt kê (các) nhân viên có lương cao nhất <strong>trong phòng đó</strong>: số phòng, tên, lương.</p>
<p class="nhan">Hướng nghĩ</p>
<p>"Cao nhất trong phòng CỦA MÌNH" — mức cao nhất phụ thuộc vào phòng của dòng bên ngoài → truy vấn con tương quan: <code>empSalary = (SELECT MAX(…) FROM tblEmployee x WHERE x.depNum = e.depNum)</code>.</p>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">SELECT e.depNum, e.empName, e.empSalary
FROM tblEmployee e
WHERE e.empSalary = (SELECT MAX(x.empSalary)
                     FROM tblEmployee x
                     WHERE x.depNum = e.depNum)
ORDER BY e.depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>3</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Dòng ngoài e (ví dụ)</th><th>MAX bên trong theo e.depNum</th><th>giữ?</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang (1, 150000)</td><td>150000</td><td>có</td></tr>
<tr><td>Hoàng Thị Hà (1, 90000)</td><td>150000</td><td>không</td></tr>
<tr><td>Đặng Tuấn Anh (2, 105000)</td><td>105000</td><td>có</td></tr>
<tr><td>Phan Hữu Nghĩa (5, 38000)</td><td>65000</td><td>không</td></tr>
</tbody>
</table>
<p>Hai bản sai mà trông đúng. Bản thứ hai tình cờ ra đúng với dữ liệu gốc, nên file này trước hết tăng lương Bùi Văn Nam (phòng 3) lên 70000 — đúng mức cao nhất của phòng 4 — trong CSDL thử của riêng nó:</p>
<pre><code class="language-sql">-- sai 1: thiếu tương quan -&gt; mức cao nhất của cả công ty
SELECT e.depNum, e.empName, e.empSalary
FROM tblEmployee e
WHERE e.empSalary = (SELECT MAX(x.empSalary) FROM tblEmployee x);
GO
-- cho Bùi Văn Nam (phòng 3) 70000 = mức cao nhất của phòng 4, chỉ trong CSDL thử này
UPDATE tblEmployee SET empSalary = 70000 WHERE empSSN = 30121050021;
GO
-- sai 2: IN (max của từng phòng) nhận cả mức cao nhất của phòng KHÁC
SELECT e.depNum, e.empName, e.empSalary
FROM tblEmployee e
WHERE e.empSalary IN (SELECT MAX(empSalary) FROM tblEmployee GROUP BY depNum)
ORDER BY e.depNum;
GO
-- bản tương quan vẫn đúng trên cùng dữ liệu
SELECT e.depNum, e.empName, e.empSalary
FROM tblEmployee e
WHERE e.empSalary = (SELECT MAX(x.empSalary) FROM tblEmployee x WHERE x.depNum = e.depNum)
ORDER BY e.depNum;
GO</code></pre>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>3</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>3</td><td>Bùi Văn Nam</td><td>70000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>3</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
</tbody>
</table>
<div class="pitfall">Sai 1 quên điều kiện tương quan: chỉ ra mức cao nhất cả công ty (1 dòng). Sai 2, <code>IN (SELECT MAX(…) … GROUP BY depNum)</code>, so với danh sách mức cao nhất của mọi phòng, nên Bùi Văn Nam (70000 = max của phòng 4) lọt vào ở phòng 3. <code>SELECT depNum, empName, MAX(empSalary) … GROUP BY depNum</code> thậm chí không hợp lệ (Msg 8120). Trường hợp bằng nhau: nếu hai người cùng lương cao nhất một phòng, bản tương quan trả về đúng cả hai.</div>`),
    bi(`<h3>🧪 Exercise 6 — GROUP BY + HAVING (PE question 7 · ~10 min)</h3>
<p class="nhan">Task</p>
<p>For each project with at least 3 employees, give the project number, name, number of employees, total hours and average hours (2 decimals), largest total first.</p>
<p class="nhan">How to think</p>
<p>"For each project" → GROUP BY the project (number AND name, since both are shown). "At least 3 employees" is a condition on a count → HAVING, not WHERE. The name is in tblProject, the hours in tblWorksOn → join first.</p>
<p class="nhan">Solution</p>
<pre><code class="language-sql">SELECT p.proNum, p.proName,
       COUNT(w.empSSN)  AS numEmployees,
       SUM(w.workHours) AS totalHours,
       CAST(AVG(w.workHours) AS DECIMAL(6,2)) AS avgHours
FROM tblProject p
JOIN tblWorksOn w ON p.proNum = w.proNum
GROUP BY p.proNum, p.proName
HAVING COUNT(w.empSSN) &gt;= 3
ORDER BY totalHours DESC;</code></pre>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>numEmployees</th><th>totalHours</th><th>avgHours</th></tr></thead>
<tbody>
<tr><td>5</td><td>ProjectE</td><td>3</td><td>85.0</td><td>28.33</td></tr>
<tr><td>3</td><td>ProjectC</td><td>4</td><td>80.0</td><td>20.00</td></tr>
<tr><td>2</td><td>ProjectB</td><td>3</td><td>67.5</td><td>22.50</td></tr>
<tr><td>1</td><td>ProjectA</td><td>3</td><td>60.0</td><td>20.00</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause</th><th>Rows / groups</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM p JOIN w ON p.proNum = w.proNum</td><td>16 work records</td></tr>
<tr><td>3</td><td>GROUP BY p.proNum, p.proName</td><td>6 groups</td></tr>
<tr><td>4</td><td>HAVING COUNT(w.empSSN) &gt;= 3</td><td>4 groups (project 4 has 2, project 6 has 1)</td></tr>
<tr><td>5</td><td>SELECT … COUNT, SUM, CAST(AVG …)</td><td>aliases created</td></tr>
<tr><td>6</td><td>ORDER BY totalHours DESC</td><td>alias allowed here (ORDER BY runs after SELECT)</td></tr>
</tbody>
</table>
<div class="pitfall"><code>HAVING numEmployees &gt;= 3</code> fails (the alias does not exist yet at step 4) — repeat the aggregate. <code>WHERE COUNT(*) &gt;= 3</code> fails with Msg 147. Forgetting p.proName in GROUP BY gives Msg 8120 on SQL Server. And "at least 3" is <code>&gt;= 3</code>, not <code>&gt; 3</code>.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> round the average with <code>round(AVG(x), 2)</code>; and grouping by the key p.proNum is enough to show p.proName (functional dependency on the primary key):
<pre><code class="language-sql">SELECT p.proNum, p.proName,
       COUNT(w.empSSN)             AS numEmployees,
       SUM(w.workHours)            AS totalHours,
       round(AVG(w.workHours), 2)  AS avgHours        -- T-SQL: CAST(AVG(x) AS DECIMAL(6,2))
FROM tblProject p
JOIN tblWorksOn w ON p.proNum = w.proNum
GROUP BY p.proNum                                     -- p.proName allowed: proNum is the key
HAVING COUNT(w.empSSN) &gt;= 3
ORDER BY totalHours DESC;</code></pre>
<table>
<thead><tr><th>pronum</th><th>proname</th><th>numemployees</th><th>totalhours</th><th>avghours</th></tr></thead>
<tbody>
<tr><td>5</td><td>ProjectE</td><td>3</td><td>85.0</td><td>28.33</td></tr>
<tr><td>3</td><td>ProjectC</td><td>4</td><td>80.0</td><td>20.00</td></tr>
<tr><td>2</td><td>ProjectB</td><td>3</td><td>67.5</td><td>22.50</td></tr>
<tr><td>1</td><td>ProjectA</td><td>3</td><td>60.0</td><td>20.00</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-3-having-filter">PostgreSQL 6.3 — HAVING and FILTER</a>.</div>`,
    `<h3>🧪 Bài 6 — GROUP BY + HAVING (câu 7 của đề PE · ~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Với mỗi dự án có ít nhất 3 nhân viên, cho biết số dự án, tên, số nhân viên, tổng số giờ và số giờ trung bình (2 chữ số lẻ), tổng lớn nhất đứng trước.</p>
<p class="nhan">Hướng nghĩ</p>
<p>"Với mỗi dự án" → GROUP BY theo dự án (cả số VÀ tên, vì cả hai đều hiện ra). "Ít nhất 3 nhân viên" là điều kiện trên một số đếm → HAVING, không phải WHERE. Tên ở tblProject, số giờ ở tblWorksOn → phải nối trước.</p>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">SELECT p.proNum, p.proName,
       COUNT(w.empSSN)  AS numEmployees,
       SUM(w.workHours) AS totalHours,
       CAST(AVG(w.workHours) AS DECIMAL(6,2)) AS avgHours
FROM tblProject p
JOIN tblWorksOn w ON p.proNum = w.proNum
GROUP BY p.proNum, p.proName
HAVING COUNT(w.empSSN) &gt;= 3
ORDER BY totalHours DESC;</code></pre>
<table>
<thead><tr><th>proNum</th><th>proName</th><th>numEmployees</th><th>totalHours</th><th>avgHours</th></tr></thead>
<tbody>
<tr><td>5</td><td>ProjectE</td><td>3</td><td>85.0</td><td>28.33</td></tr>
<tr><td>3</td><td>ProjectC</td><td>4</td><td>80.0</td><td>20.00</td></tr>
<tr><td>2</td><td>ProjectB</td><td>3</td><td>67.5</td><td>22.50</td></tr>
<tr><td>1</td><td>ProjectA</td><td>3</td><td>60.0</td><td>20.00</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề</th><th>Số dòng / nhóm</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM p JOIN w ON p.proNum = w.proNum</td><td>16 bản ghi làm việc</td></tr>
<tr><td>3</td><td>GROUP BY p.proNum, p.proName</td><td>6 nhóm</td></tr>
<tr><td>4</td><td>HAVING COUNT(w.empSSN) &gt;= 3</td><td>4 nhóm (dự án 4 có 2 người, dự án 6 có 1)</td></tr>
<tr><td>5</td><td>SELECT … COUNT, SUM, CAST(AVG …)</td><td>tạo bí danh</td></tr>
<tr><td>6</td><td>ORDER BY totalHours DESC</td><td>được dùng bí danh (ORDER BY chạy sau SELECT)</td></tr>
</tbody>
</table>
<div class="pitfall"><code>HAVING numEmployees &gt;= 3</code> báo lỗi (ở bước 4 bí danh chưa tồn tại) — phải lặp lại hàm gộp. <code>WHERE COUNT(*) &gt;= 3</code> lỗi Msg 147. Quên p.proName trong GROUP BY thì SQL Server báo Msg 8120. Và "ít nhất 3" là <code>&gt;= 3</code>, không phải <code>&gt; 3</code>.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> làm tròn trung bình bằng <code>round(AVG(x), 2)</code>; và nhóm theo khoá p.proNum là đủ để hiện p.proName (phụ thuộc hàm vào khoá chính):
<pre><code class="language-sql">SELECT p.proNum, p.proName,
       COUNT(w.empSSN)             AS numEmployees,
       SUM(w.workHours)            AS totalHours,
       round(AVG(w.workHours), 2)  AS avgHours        -- T-SQL: CAST(AVG(x) AS DECIMAL(6,2))
FROM tblProject p
JOIN tblWorksOn w ON p.proNum = w.proNum
GROUP BY p.proNum                                     -- được viết p.proName: proNum là khoá
HAVING COUNT(w.empSSN) &gt;= 3
ORDER BY totalHours DESC;</code></pre>
<table>
<thead><tr><th>pronum</th><th>proname</th><th>numemployees</th><th>totalhours</th><th>avghours</th></tr></thead>
<tbody>
<tr><td>5</td><td>ProjectE</td><td>3</td><td>85.0</td><td>28.33</td></tr>
<tr><td>3</td><td>ProjectC</td><td>4</td><td>80.0</td><td>20.00</td></tr>
<tr><td>2</td><td>ProjectB</td><td>3</td><td>67.5</td><td>22.50</td></tr>
<tr><td>1</td><td>ProjectA</td><td>3</td><td>60.0</td><td>20.00</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-3-having-filter">PostgreSQL 6.3 — HAVING và FILTER</a>.</div>`),
    bi(`<h3>🧪 Exercise 7 — TOP WITH TIES and top-N per group (PE question 8 · ~12 min)</h3>
<p class="nhan">Task</p>
<p>(a) Find the department(s) with the largest number of employees. (b) List the two best-paid employees of each department.</p>
<p class="nhan">How to think</p>
<p>(a) Count per department, sort by the count descending, keep the first — and every department tied with it → <code>TOP 1 WITH TIES</code>. (b) "Top n inside each group": a plain TOP works on the whole result, so either count, for each employee, how many colleagues of the same department earn more (fewer than 2 → keep), or number the rows inside each department with a window function.</p>
<p class="nhan">Solution</p>
<pre><code class="language-sql">-- (a) the department(s) with the most employees
SELECT TOP 1 WITH TIES d.depNum, d.depName, COUNT(*) AS numEmployees
FROM tblDepartment d JOIN tblEmployee e ON d.depNum = e.depNum
GROUP BY d.depNum, d.depName
ORDER BY COUNT(*) DESC;</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>numEmployees</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>4</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>4</td></tr>
</tbody>
</table>
<p>Departments 1 and 2 both have 4 employees. Without WITH TIES one of them disappears — which one is not even defined:</p>
<pre><code class="language-sql">-- without WITH TIES: one of the two tied departments silently disappears
SELECT TOP 1 d.depNum, d.depName, COUNT(*) AS numEmployees
FROM tblDepartment d JOIN tblEmployee e ON d.depNum = e.depNum
GROUP BY d.depNum, d.depName
ORDER BY COUNT(*) DESC;</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>numEmployees</th></tr></thead>
<tbody>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>4</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- (b) the 2 best-paid employees of EACH department — way 1: correlated count
SELECT e.depNum, e.empName, e.empSalary
FROM tblEmployee e
WHERE (SELECT COUNT(*) FROM tblEmployee x
       WHERE x.depNum = e.depNum AND x.empSalary &gt; e.empSalary) &lt; 2
ORDER BY e.depNum, e.empSalary DESC;</code></pre>
<pre><code class="language-sql">-- way 2: a window function numbers the rows inside each department
SELECT depNum, empName, empSalary
FROM (SELECT depNum, empName, empSalary,
             ROW_NUMBER() OVER (PARTITION BY depNum ORDER BY empSalary DESC) AS rn
      FROM tblEmployee) AS t
WHERE rn &lt;= 2
ORDER BY depNum, empSalary DESC;</code></pre>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>1</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>2</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>3</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>3</td><td>Trương Thị Thu</td><td>52000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
<tr><td>5</td><td>Phan Hữu Nghĩa</td><td>38000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>1</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>2</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>3</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>3</td><td>Trương Thị Thu</td><td>52000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
<tr><td>5</td><td>Phan Hữu Nghĩa</td><td>38000</td></tr>
</tbody>
</table>
<ul>
<li>Way 1, for Hoàng Thị Hà (dept 1, 90000): colleagues of dept 1 earning more = 1 (Quang) &lt; 2 → kept; Võ Việt Anh: 2 → dropped.</li>
<li>Way 2: <code>ROW_NUMBER() OVER (PARTITION BY depNum ORDER BY empSalary DESC)</code> restarts the numbering at 1 in each department; the outer query keeps rn ≤ 2 (a window function cannot be used in WHERE directly, hence the subquery in FROM).</li>
<li>Departments 4 and 5 have fewer than 2 people / exactly 2: they return 1 and 2 rows. 9 rows in total.</li>
</ul>
<div class="pitfall"><code>SELECT TOP 2 … ORDER BY empSalary DESC</code> gives the 2 best of the <strong>company</strong>, not of each department. And with ties, way 1 keeps everyone tied (like WITH TIES) while ROW_NUMBER cuts arbitrarily — use <code>RANK()</code> instead of ROW_NUMBER if ties must be kept.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> write <code>FETCH FIRST 1 ROWS WITH TIES</code> at the end instead of <code>TOP 1 WITH TIES</code>; ROW_NUMBER / RANK are identical:
<pre><code class="language-sql">SELECT d.depNum, d.depName, COUNT(*) AS numEmployees
FROM tblDepartment d JOIN tblEmployee e ON d.depNum = e.depNum
GROUP BY d.depNum
ORDER BY COUNT(*) DESC
FETCH FIRST 1 ROWS WITH TIES;                 -- T-SQL: SELECT TOP 1 WITH TIES</code></pre>
<table>
<thead><tr><th>depnum</th><th>depname</th><th>numemployees</th></tr></thead>
<tbody>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>4</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>4</td></tr>
</tbody>
</table>
Lessons: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT</a> · <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-2-group-by">6.2 — GROUP BY</a>.</div>`,
    `<h3>🧪 Bài 7 — TOP WITH TIES và top-N mỗi nhóm (câu 8 của đề PE · ~12 phút)</h3>
<p class="nhan">Đề</p>
<p>(a) Tìm (các) phòng có nhiều nhân viên nhất. (b) Liệt kê hai nhân viên lương cao nhất của mỗi phòng.</p>
<p class="nhan">Hướng nghĩ</p>
<p>(a) Đếm theo phòng, sắp số đếm giảm dần, giữ phòng đầu tiên — và mọi phòng bằng điểm với nó → <code>TOP 1 WITH TIES</code>. (b) "Top n trong từng nhóm": TOP thường làm trên cả kết quả, nên hoặc đếm, với mỗi nhân viên, có bao nhiêu đồng nghiệp cùng phòng lương cao hơn (ít hơn 2 → giữ), hoặc đánh số dòng trong từng phòng bằng hàm cửa sổ (window function).</p>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">-- (a) (các) phòng đông nhân viên nhất
SELECT TOP 1 WITH TIES d.depNum, d.depName, COUNT(*) AS numEmployees
FROM tblDepartment d JOIN tblEmployee e ON d.depNum = e.depNum
GROUP BY d.depNum, d.depName
ORDER BY COUNT(*) DESC;</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>numEmployees</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>4</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>4</td></tr>
</tbody>
</table>
<p>Phòng 1 và 2 cùng có 4 nhân viên. Không có WITH TIES thì một trong hai biến mất — mà biến mất phòng nào còn không được định nghĩa:</p>
<pre><code class="language-sql">-- không có WITH TIES: một trong hai phòng bằng nhau lặng lẽ biến mất
SELECT TOP 1 d.depNum, d.depName, COUNT(*) AS numEmployees
FROM tblDepartment d JOIN tblEmployee e ON d.depNum = e.depNum
GROUP BY d.depNum, d.depName
ORDER BY COUNT(*) DESC;</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>numEmployees</th></tr></thead>
<tbody>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>4</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- (b) 2 người lương cao nhất của TỪNG phòng — cách 1: đếm tương quan
SELECT e.depNum, e.empName, e.empSalary
FROM tblEmployee e
WHERE (SELECT COUNT(*) FROM tblEmployee x
       WHERE x.depNum = e.depNum AND x.empSalary &gt; e.empSalary) &lt; 2
ORDER BY e.depNum, e.empSalary DESC;</code></pre>
<pre><code class="language-sql">-- cách 2: hàm cửa sổ đánh số dòng trong từng phòng
SELECT depNum, empName, empSalary
FROM (SELECT depNum, empName, empSalary,
             ROW_NUMBER() OVER (PARTITION BY depNum ORDER BY empSalary DESC) AS rn
      FROM tblEmployee) AS t
WHERE rn &lt;= 2
ORDER BY depNum, empSalary DESC;</code></pre>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>1</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>2</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>3</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>3</td><td>Trương Thị Thu</td><td>52000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
<tr><td>5</td><td>Phan Hữu Nghĩa</td><td>38000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>1</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
<tr><td>2</td><td>Đặng Tuấn Anh</td><td>105000</td></tr>
<tr><td>2</td><td>Phạm Quốc Bảo</td><td>95000</td></tr>
<tr><td>3</td><td>Nguyễn Thị Mai</td><td>88000</td></tr>
<tr><td>3</td><td>Trương Thị Thu</td><td>52000</td></tr>
<tr><td>4</td><td>Huỳnh Văn Tài</td><td>70000</td></tr>
<tr><td>5</td><td>Lý Thanh Tâm</td><td>65000</td></tr>
<tr><td>5</td><td>Phan Hữu Nghĩa</td><td>38000</td></tr>
</tbody>
</table>
<ul>
<li>Cách 1, với Hoàng Thị Hà (phòng 1, 90000): số đồng nghiệp phòng 1 lương cao hơn = 1 (Quang) &lt; 2 → giữ; Võ Việt Anh: 2 → loại.</li>
<li>Cách 2: <code>ROW_NUMBER() OVER (PARTITION BY depNum ORDER BY empSalary DESC)</code> đánh số lại từ 1 trong mỗi phòng; câu ngoài giữ rn ≤ 2 (hàm cửa sổ không dùng thẳng trong WHERE được, nên cần câu con trong FROM).</li>
<li>Phòng 4 và 5 có ít hơn 2 / đúng 2 người: trả về 1 và 2 dòng. Tổng 9 dòng.</li>
</ul>
<div class="pitfall"><code>SELECT TOP 2 … ORDER BY empSalary DESC</code> cho 2 người cao nhất của <strong>cả công ty</strong>, không phải của từng phòng. Và khi có người bằng lương, cách 1 giữ mọi người bằng nhau (như WITH TIES) còn ROW_NUMBER cắt tuỳ ý — dùng <code>RANK()</code> thay ROW_NUMBER nếu phải giữ người bằng điểm.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> viết <code>FETCH FIRST 1 ROWS WITH TIES</code> ở cuối thay cho <code>TOP 1 WITH TIES</code>; ROW_NUMBER / RANK y hệt:
<pre><code class="language-sql">SELECT d.depNum, d.depName, COUNT(*) AS numEmployees
FROM tblDepartment d JOIN tblEmployee e ON d.depNum = e.depNum
GROUP BY d.depNum
ORDER BY COUNT(*) DESC
FETCH FIRST 1 ROWS WITH TIES;                 -- T-SQL: SELECT TOP 1 WITH TIES</code></pre>
<table>
<thead><tr><th>depnum</th><th>depname</th><th>numemployees</th></tr></thead>
<tbody>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>4</td></tr>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>4</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT</a> · <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-2-group-by">6.2 — GROUP BY</a>.</div>`),
    bi(`<h3>🧪 Exercise 8 — outer join that counts zeros (PE question 9–10 · ~12 min)</h3>
<p class="nhan">Task</p>
<p>(a) For EVERY department give the number of projects it controls — 0 included. (b) For every department give the number of female employees — 0 included.</p>
<p class="nhan">How to think</p>
<p>"Every department, 0 included" → start FROM tblDepartment and LEFT JOIN the table to count; count a column of the right table (NULL for the padded row → not counted). A condition on the right table (sex = 'F') goes into ON, so it does not kill the padded rows.</p>
<p class="nhan">Solution</p>
<pre><code class="language-sql">-- (a) EVERY department with its number of projects, 0 included
SELECT d.depNum, d.depName, COUNT(p.proNum) AS numProjects
FROM tblDepartment d
LEFT JOIN tblProject p ON p.depNum = d.depNum
GROUP BY d.depNum, d.depName
ORDER BY d.depNum;</code></pre>
<pre><code class="language-sql">-- (b) number of WOMEN in every department, 0 included: the sex test goes in ON
SELECT d.depNum, COUNT(e.empSSN) AS numWomen
FROM tblDepartment d
LEFT JOIN tblEmployee e ON e.depNum = d.depNum AND e.empSex = 'F'
GROUP BY d.depNum
ORDER BY d.depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>numProjects</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>2</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>2</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>1</td></tr>
<tr><td>4</td><td>Phòng Hành chính</td><td>1</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td><td>0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>numWomen</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>2</td><td>1</td></tr>
<tr><td>3</td><td>2</td></tr>
<tr><td>4</td><td>0</td></tr>
<tr><td>5</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Order</th><th>Clause (b)</th><th>Rows / groups</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM d LEFT JOIN e ON e.depNum = d.depNum AND e.empSex = 'F'</td><td>6 women matched + department 4 padded with NULL = 7</td></tr>
<tr><td>3</td><td>GROUP BY d.depNum</td><td>5 groups</td></tr>
<tr><td>5</td><td>SELECT COUNT(e.empSSN)</td><td>NULL not counted → department 4 = 0</td></tr>
</tbody>
</table>
<p>The three classic wrong versions, run for real:</p>
<pre><code class="language-sql">-- trap 1: COUNT(*) counts the padded row -&gt; department 5 gets 1
SELECT d.depNum, COUNT(*) AS wrong_count
FROM tblDepartment d LEFT JOIN tblProject p ON p.depNum = d.depNum
GROUP BY d.depNum ORDER BY d.depNum;
-- trap 2: the sex test in WHERE -&gt; department 4 disappears
SELECT d.depNum, COUNT(e.empSSN) AS numWomen
FROM tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum
WHERE e.empSex = 'F'
GROUP BY d.depNum ORDER BY d.depNum;
-- trap 3: two LEFT JOINs to two "many" tables multiply each other
SELECT d.depNum, COUNT(p.proNum) AS projects_wrong, COUNT(DISTINCT p.proNum) AS projects_ok,
       COUNT(e.empSSN) AS employees_wrong, COUNT(DISTINCT e.empSSN) AS employees_ok
FROM tblDepartment d
LEFT JOIN tblProject  p ON p.depNum = d.depNum
LEFT JOIN tblEmployee e ON e.depNum = d.depNum
GROUP BY d.depNum ORDER BY d.depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>wrong_count</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>2</td><td>2</td></tr>
<tr><td>3</td><td>1</td></tr>
<tr><td>4</td><td>1</td></tr>
<tr><td>5</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>numWomen</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>2</td><td>1</td></tr>
<tr><td>3</td><td>2</td></tr>
<tr><td>5</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>projects_wrong</th><th>projects_ok</th><th>employees_wrong</th><th>employees_ok</th></tr></thead>
<tbody>
<tr><td>1</td><td>8</td><td>2</td><td>8</td><td>4</td></tr>
<tr><td>2</td><td>8</td><td>2</td><td>8</td><td>4</td></tr>
<tr><td>3</td><td>3</td><td>1</td><td>3</td><td>3</td></tr>
<tr><td>4</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>5</td><td>0</td><td>0</td><td>2</td><td>2</td></tr>
</tbody>
</table>
<div class="out">Warning: Null value is eliminated by an aggregate or other SET operation.<br>
(5 rows affected)</div>
<div class="pitfall">Trap 1: <code>COUNT(*)</code> counts the padded row, so department 5 shows 1 project. Trap 2: <code>WHERE e.empSex = 'F'</code> runs after the join, rejects the NULL row, and department 4 vanishes (4 rows). Trap 3: two LEFT JOINs to two "many" tables multiply (department 1: 2 projects × 4 employees = 8 rows) — use <code>COUNT(DISTINCT …)</code> or one subquery per count.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the same LEFT JOIN works; PostgreSQL also has <code>COUNT(*) FILTER (WHERE empSex = 'F')</code>, a neat way to count several conditions in one pass (SQL Server: <code>SUM(CASE WHEN … THEN 1 ELSE 0 END)</code>). Lessons: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-2-outer-join">PostgreSQL 5.2 — outer joins</a> · <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-4-tong-hop-tren-join">6.4 — aggregates over joins</a>.</div>`,
    `<h3>🧪 Bài 8 — nối ngoài đếm cả số 0 (câu 9–10 của đề PE · ~12 phút)</h3>
<p class="nhan">Đề</p>
<p>(a) Với MỌI phòng cho biết số dự án nó quản lý — kể cả 0. (b) Với mọi phòng cho biết số nhân viên nữ — kể cả 0.</p>
<p class="nhan">Hướng nghĩ</p>
<p>"Mọi phòng, kể cả 0" → bắt đầu FROM tblDepartment rồi LEFT JOIN bảng cần đếm; đếm một cột của bảng bên phải (NULL ở dòng được đệm → không được đếm). Điều kiện trên bảng bên phải (giới tính = 'F') đặt vào ON, để nó không giết các dòng được đệm.</p>
<p class="nhan">Lời giải</p>
<pre><code class="language-sql">-- (a) MỌI phòng kèm số dự án, kể cả 0
SELECT d.depNum, d.depName, COUNT(p.proNum) AS numProjects
FROM tblDepartment d
LEFT JOIN tblProject p ON p.depNum = d.depNum
GROUP BY d.depNum, d.depName
ORDER BY d.depNum;</code></pre>
<pre><code class="language-sql">-- (b) số nhân viên NỮ của mọi phòng, kể cả 0: điều kiện giới tính đặt ở ON
SELECT d.depNum, COUNT(e.empSSN) AS numWomen
FROM tblDepartment d
LEFT JOIN tblEmployee e ON e.depNum = d.depNum AND e.empSex = 'F'
GROUP BY d.depNum
ORDER BY d.depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>depName</th><th>numProjects</th></tr></thead>
<tbody>
<tr><td>1</td><td>Phòng Phần mềm trong nước</td><td>2</td></tr>
<tr><td>2</td><td>Phòng Phần mềm nước ngoài</td><td>2</td></tr>
<tr><td>3</td><td>Phòng Kinh doanh</td><td>1</td></tr>
<tr><td>4</td><td>Phòng Hành chính</td><td>1</td></tr>
<tr><td>5</td><td>Phòng Nghiên cứu</td><td>0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>numWomen</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>2</td><td>1</td></tr>
<tr><td>3</td><td>2</td></tr>
<tr><td>4</td><td>0</td></tr>
<tr><td>5</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Thứ tự</th><th>Mệnh đề (b)</th><th>Số dòng / nhóm</th></tr></thead>
<tbody>
<tr><td>1</td><td>FROM d LEFT JOIN e ON e.depNum = d.depNum AND e.empSex = 'F'</td><td>6 người nữ khớp + phòng 4 đệm NULL = 7</td></tr>
<tr><td>3</td><td>GROUP BY d.depNum</td><td>5 nhóm</td></tr>
<tr><td>5</td><td>SELECT COUNT(e.empSSN)</td><td>NULL không được đếm → phòng 4 = 0</td></tr>
</tbody>
</table>
<p>Ba bản sai kinh điển, chạy thật:</p>
<pre><code class="language-sql">-- bẫy 1: COUNT(*) đếm cả dòng được đệm -&gt; phòng 5 thành 1
SELECT d.depNum, COUNT(*) AS wrong_count
FROM tblDepartment d LEFT JOIN tblProject p ON p.depNum = d.depNum
GROUP BY d.depNum ORDER BY d.depNum;
-- bẫy 2: điều kiện giới tính ở WHERE -&gt; phòng 4 biến mất
SELECT d.depNum, COUNT(e.empSSN) AS numWomen
FROM tblDepartment d LEFT JOIN tblEmployee e ON e.depNum = d.depNum
WHERE e.empSex = 'F'
GROUP BY d.depNum ORDER BY d.depNum;
-- bẫy 3: hai LEFT JOIN tới hai bảng "nhiều" nhân lẫn nhau
SELECT d.depNum, COUNT(p.proNum) AS projects_wrong, COUNT(DISTINCT p.proNum) AS projects_ok,
       COUNT(e.empSSN) AS employees_wrong, COUNT(DISTINCT e.empSSN) AS employees_ok
FROM tblDepartment d
LEFT JOIN tblProject  p ON p.depNum = d.depNum
LEFT JOIN tblEmployee e ON e.depNum = d.depNum
GROUP BY d.depNum ORDER BY d.depNum;</code></pre>
<table>
<thead><tr><th>depNum</th><th>wrong_count</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>2</td><td>2</td></tr>
<tr><td>3</td><td>1</td></tr>
<tr><td>4</td><td>1</td></tr>
<tr><td>5</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>numWomen</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>2</td><td>1</td></tr>
<tr><td>3</td><td>2</td></tr>
<tr><td>5</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depNum</th><th>projects_wrong</th><th>projects_ok</th><th>employees_wrong</th><th>employees_ok</th></tr></thead>
<tbody>
<tr><td>1</td><td>8</td><td>2</td><td>8</td><td>4</td></tr>
<tr><td>2</td><td>8</td><td>2</td><td>8</td><td>4</td></tr>
<tr><td>3</td><td>3</td><td>1</td><td>3</td><td>3</td></tr>
<tr><td>4</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>5</td><td>0</td><td>0</td><td>2</td><td>2</td></tr>
</tbody>
</table>
<div class="out">Warning: Null value is eliminated by an aggregate or other SET operation.<br>
(5 rows affected)</div>
<div class="pitfall">Bẫy 1: <code>COUNT(*)</code> đếm cả dòng được đệm, nên phòng 5 hiện 1 dự án. Bẫy 2: <code>WHERE e.empSex = 'F'</code> chạy sau phép nối, loại dòng NULL, và phòng 4 biến mất (còn 4 dòng). Bẫy 3: hai LEFT JOIN tới hai bảng "nhiều" nhân nhau (phòng 1: 2 dự án × 4 nhân viên = 8 dòng) — dùng <code>COUNT(DISTINCT …)</code> hoặc mỗi số đếm một câu con.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> LEFT JOIN y hệt; PostgreSQL còn có <code>COUNT(*) FILTER (WHERE empSex = 'F')</code>, cách gọn để đếm nhiều điều kiện trong một lượt (SQL Server: <code>SUM(CASE WHEN … THEN 1 ELSE 0 END)</code>). Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-2-outer-join">PostgreSQL 5.2 — nối ngoài</a> · <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-4-tong-hop-tren-join">6.4 — tổng hợp trên phép nối</a>.</div>`),
    bi(`<h2>🐘 T-SQL ↔ PostgreSQL for queries</h2>
<p>The query language is 90 % the same. These are the differences you met in this chapter — the right column is what you will type at work.</p>
<table>
<thead><tr><th>Task</th><th>T-SQL (SQL Server, the PE)</th><th>PostgreSQL (work)</th></tr></thead>
<tbody>
<tr><td>first n rows</td><td><code>SELECT TOP 5 … ORDER BY x</code></td><td><code>… ORDER BY x LIMIT 5</code> (or <code>FETCH FIRST 5 ROWS ONLY</code>)</td></tr>
<tr><td>keep ties</td><td><code>TOP 1 WITH TIES</code></td><td><code>FETCH FIRST 1 ROWS WITH TIES</code></td></tr>
<tr><td>alias with spaces</td><td><code>AS 'Họ và tên'</code>, <code>[Họ và tên]</code>, <code>"Họ và tên"</code></td><td>only <code>"Họ và tên"</code> (single quotes = a string)</td></tr>
<tr><td>Unicode text</td><td><code>N'Phòng'</code></td><td><code>'Phòng'</code></td></tr>
<tr><td>join strings</td><td><code>a + b</code> (NULL → NULL, no number conversion)</td><td><code>a || b</code> (numbers converted, NULL → NULL)</td></tr>
<tr><td>NULL replacement</td><td><code>ISNULL(x, 0)</code> or <code>COALESCE(x, 0)</code></td><td><code>COALESCE(x, 0)</code></td></tr>
<tr><td>case-insensitive match</td><td>default collation: <code>=</code> and LIKE ignore case</td><td><code>ILIKE</code>, or <code>lower(x) = lower(y)</code></td></tr>
<tr><td>character set in a pattern</td><td><code>LIKE '[HLT]%'</code></td><td><code>~ '^[HLT]'</code> or <code>SIMILAR TO '[HLT]%'</code></td></tr>
<tr><td>current date, year</td><td><code>GETDATE()</code>, <code>YEAR(d)</code></td><td><code>now()</code>, <code>EXTRACT(YEAR FROM d)</code>, <code>age(d)</code></td></tr>
<tr><td>NULL position in ORDER BY</td><td>first in ASC, no option</td><td>last in ASC; <code>NULLS FIRST / LAST</code></td></tr>
<tr><td>NATURAL JOIN / USING</td><td>not supported</td><td>supported (prefer <code>USING (col)</code>)</td></tr>
<tr><td>row comparison <code>(a, b) IN (…)</code></td><td>not supported → EXISTS</td><td>supported</td></tr>
<tr><td>INTERSECT ALL / EXCEPT ALL</td><td>not supported (only UNION ALL)</td><td>supported</td></tr>
<tr><td>AVG of an integer column</td><td>integer (3.125 → 3)</td><td>numeric (3.125)</td></tr>
<tr><td>GROUP BY an alias / non-key column</td><td>not allowed</td><td>alias allowed; columns of a grouped primary key allowed</td></tr>
<tr><td>subquery in FROM</td><td>alias required</td><td>alias optional (v16+); CTE <code>WITH</code> is the habit</td></tr>
</tbody>
</table>`,
    `<h2>🐘 T-SQL ↔ PostgreSQL cho câu truy vấn</h2>
<p>Ngôn ngữ truy vấn giống nhau tới 90 %. Đây là những chỗ khác bạn đã gặp trong chương — cột bên phải là thứ bạn sẽ gõ khi đi làm.</p>
<table>
<thead><tr><th>Việc cần làm</th><th>T-SQL (SQL Server, bài PE)</th><th>PostgreSQL (đi làm)</th></tr></thead>
<tbody>
<tr><td>lấy n dòng đầu</td><td><code>SELECT TOP 5 … ORDER BY x</code></td><td><code>… ORDER BY x LIMIT 5</code> (hoặc <code>FETCH FIRST 5 ROWS ONLY</code>)</td></tr>
<tr><td>giữ các dòng bằng điểm</td><td><code>TOP 1 WITH TIES</code></td><td><code>FETCH FIRST 1 ROWS WITH TIES</code></td></tr>
<tr><td>bí danh có dấu cách</td><td><code>AS 'Họ và tên'</code>, <code>[Họ và tên]</code>, <code>"Họ và tên"</code></td><td>chỉ <code>"Họ và tên"</code> (nháy đơn = chuỗi)</td></tr>
<tr><td>chữ Unicode</td><td><code>N'Phòng'</code></td><td><code>'Phòng'</code></td></tr>
<tr><td>nối chuỗi</td><td><code>a + b</code> (NULL → NULL, không tự đổi số)</td><td><code>a || b</code> (tự đổi số, NULL → NULL)</td></tr>
<tr><td>thay NULL</td><td><code>ISNULL(x, 0)</code> hoặc <code>COALESCE(x, 0)</code></td><td><code>COALESCE(x, 0)</code></td></tr>
<tr><td>so khớp không phân biệt hoa thường</td><td>collation mặc định: <code>=</code> và LIKE bỏ qua hoa thường</td><td><code>ILIKE</code>, hoặc <code>lower(x) = lower(y)</code></td></tr>
<tr><td>tập ký tự trong mẫu</td><td><code>LIKE '[HLT]%'</code></td><td><code>~ '^[HLT]'</code> hoặc <code>SIMILAR TO '[HLT]%'</code></td></tr>
<tr><td>ngày hiện tại, năm</td><td><code>GETDATE()</code>, <code>YEAR(d)</code></td><td><code>now()</code>, <code>EXTRACT(YEAR FROM d)</code>, <code>age(d)</code></td></tr>
<tr><td>vị trí NULL khi ORDER BY</td><td>đứng đầu khi ASC, không chọn được</td><td>đứng cuối khi ASC; <code>NULLS FIRST / LAST</code></td></tr>
<tr><td>NATURAL JOIN / USING</td><td>không có</td><td>có (nên dùng <code>USING (cột)</code>)</td></tr>
<tr><td>so sánh bộ <code>(a, b) IN (…)</code></td><td>không có → dùng EXISTS</td><td>có</td></tr>
<tr><td>INTERSECT ALL / EXCEPT ALL</td><td>không có (chỉ có UNION ALL)</td><td>có</td></tr>
<tr><td>AVG của cột số nguyên</td><td>ra số nguyên (3,125 → 3)</td><td>ra numeric (3,125)</td></tr>
<tr><td>GROUP BY theo bí danh / cột không phải khoá</td><td>không cho</td><td>cho bí danh; cho cột của bảng đã nhóm theo khoá chính</td></tr>
<tr><td>truy vấn con trong FROM</td><td>bắt buộc bí danh</td><td>bí danh tuỳ chọn (từ bản 16); thói quen là CTE <code>WITH</code></td></tr>
</tbody>
</table>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>query</strong></td><td>câu truy vấn</td><td>A question to the database written in SQL; its answer is always a table.</td></tr>
<tr><td><strong>DML (Data Manipulation Language)</strong></td><td>ngôn ngữ thao tác dữ liệu</td><td>INSERT, UPDATE, DELETE and SELECT: statements that read or change rows.</td></tr>
<tr><td><strong>execution order</strong></td><td>thứ tự thực thi</td><td>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY, not the written order.</td></tr>
<tr><td><strong>alias</strong></td><td>bí danh</td><td>A temporary name for a column (in SELECT) or a table (in FROM).</td></tr>
<tr><td><strong>tuple variable</strong></td><td>biến bộ</td><td>A table alias that ranges over its rows; two aliases let a table appear twice.</td></tr>
<tr><td><strong>join condition</strong></td><td>điều kiện nối</td><td>The equality foreign key = primary key that pairs related rows.</td></tr>
<tr><td><strong>Cartesian product / CROSS JOIN</strong></td><td>tích Descartes</td><td>Every row of one table with every row of the other: n × m rows.</td></tr>
<tr><td><strong>self-join</strong></td><td>tự nối</td><td>Joining a table with itself through two aliases.</td></tr>
<tr><td><strong>natural join</strong></td><td>nối tự nhiên</td><td>Joins on all same-named columns; not available in SQL Server.</td></tr>
<tr><td><strong>outer join (LEFT / RIGHT / FULL)</strong></td><td>nối ngoài</td><td>A join that keeps the rows without a partner, padded with NULL.</td></tr>
<tr><td><strong>dangling tuple</strong></td><td>bộ treo</td><td>A row that matches nothing on the other side of a join.</td></tr>
<tr><td><strong>subquery</strong></td><td>truy vấn con</td><td>A query in brackets used as a value, a set or a table inside another query.</td></tr>
<tr><td><strong>scalar subquery</strong></td><td>truy vấn con vô hướng</td><td>A subquery returning exactly one value; more rows → error 512.</td></tr>
<tr><td><strong>correlated subquery</strong></td><td>truy vấn con tương quan</td><td>A subquery that uses a column of the outer row, so it is re-evaluated per row.</td></tr>
<tr><td><strong>EXISTS / NOT EXISTS</strong></td><td>tồn tại / không tồn tại</td><td>TRUE when the subquery returns at least one row / no row.</td></tr>
<tr><td><strong>ANY / ALL</strong></td><td>bất kỳ / tất cả</td><td>Compare a value with at least one / every value of a subquery.</td></tr>
<tr><td><strong>set operators (UNION, INTERSECT, EXCEPT)</strong></td><td>phép toán tập hợp</td><td>Combine two results with the same columns: ∪, ∩, −.</td></tr>
<tr><td><strong>bag / DISTINCT</strong></td><td>túi / loại trùng</td><td>SQL results may contain duplicates (a bag); DISTINCT turns them into a set.</td></tr>
<tr><td><strong>aggregate function</strong></td><td>hàm gộp</td><td>SUM, AVG, MIN, MAX, COUNT: one value from many rows, ignoring NULL.</td></tr>
<tr><td><strong>GROUP BY</strong></td><td>gom nhóm</td><td>Splits rows into groups with equal values; one output row per group.</td></tr>
<tr><td><strong>HAVING</strong></td><td>điều kiện trên nhóm</td><td>Filters groups after GROUP BY, usually with an aggregate.</td></tr>
<tr><td><strong>relational division</strong></td><td>phép chia quan hệ</td><td>"Related to ALL of a set" — written with double NOT EXISTS or a count.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>query</strong></td><td>câu truy vấn</td><td>Một câu hỏi gửi CSDL viết bằng SQL; câu trả lời luôn là một bảng.</td></tr>
<tr><td><strong>DML (Data Manipulation Language)</strong></td><td>ngôn ngữ thao tác dữ liệu</td><td>INSERT, UPDATE, DELETE và SELECT: các câu lệnh đọc hoặc sửa dòng.</td></tr>
<tr><td><strong>execution order</strong></td><td>thứ tự thực thi</td><td>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY, khác thứ tự viết.</td></tr>
<tr><td><strong>alias</strong></td><td>bí danh</td><td>Tên tạm cho một cột (ở SELECT) hoặc một bảng (ở FROM).</td></tr>
<tr><td><strong>tuple variable</strong></td><td>biến bộ</td><td>Bí danh bảng chạy qua các dòng của nó; hai bí danh cho một bảng xuất hiện hai lần.</td></tr>
<tr><td><strong>join condition</strong></td><td>điều kiện nối</td><td>Phép bằng khoá ngoại = khoá chính ghép các dòng liên quan với nhau.</td></tr>
<tr><td><strong>Cartesian product / CROSS JOIN</strong></td><td>tích Descartes</td><td>Mỗi dòng bảng này ghép với mọi dòng bảng kia: n × m dòng.</td></tr>
<tr><td><strong>self-join</strong></td><td>tự nối</td><td>Nối một bảng với chính nó qua hai bí danh.</td></tr>
<tr><td><strong>natural join</strong></td><td>nối tự nhiên</td><td>Nối theo mọi cột trùng tên; SQL Server không có.</td></tr>
<tr><td><strong>outer join (LEFT / RIGHT / FULL)</strong></td><td>nối ngoài</td><td>Phép nối giữ các dòng không có bạn ghép, đệm NULL.</td></tr>
<tr><td><strong>dangling tuple</strong></td><td>bộ treo</td><td>Dòng không khớp với dòng nào ở phía bên kia của phép nối.</td></tr>
<tr><td><strong>subquery</strong></td><td>truy vấn con</td><td>Câu truy vấn trong ngoặc dùng như một giá trị, một tập hay một bảng trong câu khác.</td></tr>
<tr><td><strong>scalar subquery</strong></td><td>truy vấn con vô hướng</td><td>Truy vấn con trả về đúng một giá trị; nhiều dòng hơn → lỗi 512.</td></tr>
<tr><td><strong>correlated subquery</strong></td><td>truy vấn con tương quan</td><td>Truy vấn con dùng một cột của dòng bên ngoài, nên được tính lại cho từng dòng.</td></tr>
<tr><td><strong>EXISTS / NOT EXISTS</strong></td><td>tồn tại / không tồn tại</td><td>TRUE khi câu con trả về ít nhất một dòng / không dòng nào.</td></tr>
<tr><td><strong>ANY / ALL</strong></td><td>bất kỳ / tất cả</td><td>So một giá trị với ít nhất một / mọi giá trị của câu con.</td></tr>
<tr><td><strong>set operators (UNION, INTERSECT, EXCEPT)</strong></td><td>phép toán tập hợp</td><td>Kết hợp hai kết quả cùng cột: ∪, ∩, −.</td></tr>
<tr><td><strong>bag / DISTINCT</strong></td><td>túi / loại trùng</td><td>Kết quả SQL có thể chứa bản trùng (túi); DISTINCT biến chúng thành tập.</td></tr>
<tr><td><strong>aggregate function</strong></td><td>hàm gộp</td><td>SUM, AVG, MIN, MAX, COUNT: một giá trị từ nhiều dòng, bỏ qua NULL.</td></tr>
<tr><td><strong>GROUP BY</strong></td><td>gom nhóm</td><td>Chia dòng thành các nhóm cùng giá trị; mỗi nhóm một dòng đầu ra.</td></tr>
<tr><td><strong>HAVING</strong></td><td>điều kiện trên nhóm</td><td>Lọc các nhóm sau GROUP BY, thường dùng hàm gộp.</td></tr>
<tr><td><strong>relational division</strong></td><td>phép chia quan hệ</td><td>"Liên quan tới TẤT CẢ một tập" — viết bằng NOT EXISTS lồng hai tầng hoặc bằng đếm.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 6</h2>
<ol>
<li><strong>Execution order</strong> FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY (→ TOP). It explains every "invalid column name", every Msg 147 and 8120.</li>
<li><strong>DML</strong>: always list the columns in INSERT; test an UPDATE/DELETE's WHERE with a SELECT first; mind the foreign keys; TRUNCATE ≠ DELETE.</li>
<li><strong>Several tables</strong>: n tables need n − 1 join conditions along the ERD lines; JOIN … ON keeps them next to their table. The same table twice = self-join with two aliases.</li>
<li><strong>Set operators</strong> stack results with the same columns; UNION removes duplicates, UNION ALL keeps them; "B and C on different rows" = INTERSECT, never <code>x = 'B' AND x = 'C'</code>.</li>
<li><strong>Subqueries</strong>: <code>=</code> for one value, IN/EXISTS/ANY/ALL for a set, an alias in FROM; correlated = uses the outer row. NOT IN + NULL = empty → prefer NOT EXISTS. "All of" = double NOT EXISTS.</li>
<li><strong>Outer joins</strong> keep the rows without partner: start from the table that must be complete, put right-table conditions in ON, count a right-table column.</li>
<li><strong>GROUP BY</strong>: SELECT/HAVING hold only grouping columns and aggregates; WHERE filters rows before grouping, HAVING filters groups after; COUNT(*) vs COUNT(col) vs COUNT(DISTINCT col).</li>
<li><strong>Top results</strong>: TOP + ORDER BY, WITH TIES for equal values; top-N per group = correlated count or ROW_NUMBER/RANK OVER (PARTITION BY).</li>
</ol>
<h3>✅ Check yourself before Quiz 3</h3>
<ol>
<li>Why does <code>SELECT empSalary * 12 AS y FROM tblEmployee WHERE y &gt; 1000000</code> fail?</li>
<li>tblDepartment has 5 rows, tblProject 6 rows, and every project has a department. How many rows does <code>tblDepartment LEFT JOIN tblProject</code> have, and why?</li>
<li>Which departments does <code>SELECT depNum FROM tblEmployee GROUP BY depNum HAVING COUNT(*) &gt;= 4</code> return?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) WHERE runs before SELECT, so the alias y does not exist yet — repeat <code>empSalary * 12</code>. (2) 7: 6 matched pairs + department 5 (no project) padded with NULL. (3) Departments 1 and 2 (4 employees each).</p>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 6</h2>
<ol>
<li><strong>Thứ tự thực thi</strong> FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY (→ TOP). Nó giải thích mọi lỗi "invalid column name", mọi Msg 147 và 8120.</li>
<li><strong>DML</strong>: luôn ghi danh sách cột trong INSERT; thử WHERE của UPDATE/DELETE bằng một câu SELECT trước; để ý khoá ngoại; TRUNCATE ≠ DELETE.</li>
<li><strong>Nhiều bảng</strong>: n bảng cần n − 1 điều kiện nối theo các đường trên ERD; JOIN … ON giữ chúng cạnh bảng của mình. Cùng một bảng hai lần = tự nối với hai bí danh.</li>
<li><strong>Phép tập hợp</strong> xếp chồng các kết quả cùng cột; UNION bỏ trùng, UNION ALL giữ; "B và C trên hai dòng khác nhau" = INTERSECT, không bao giờ là <code>x = 'B' AND x = 'C'</code>.</li>
<li><strong>Truy vấn con</strong>: <code>=</code> cho một giá trị, IN/EXISTS/ANY/ALL cho một tập, bí danh khi ở FROM; tương quan = dùng dòng bên ngoài. NOT IN + NULL = rỗng → dùng NOT EXISTS. "Tất cả" = NOT EXISTS lồng hai tầng.</li>
<li><strong>Nối ngoài</strong> giữ các dòng không có bạn ghép: bắt đầu từ bảng phải đầy đủ, điều kiện trên bảng bên phải đặt ở ON, đếm một cột của bảng bên phải.</li>
<li><strong>GROUP BY</strong>: SELECT/HAVING chỉ chứa cột nhóm và hàm gộp; WHERE lọc dòng trước khi nhóm, HAVING lọc nhóm sau đó; COUNT(*) khác COUNT(cột) khác COUNT(DISTINCT cột).</li>
<li><strong>Kết quả đứng đầu</strong>: TOP + ORDER BY, WITH TIES khi có giá trị bằng nhau; top-N mỗi nhóm = đếm tương quan hoặc ROW_NUMBER/RANK OVER (PARTITION BY).</li>
</ol>
<h3>✅ Tự kiểm tra trước khi làm Quiz 3</h3>
<ol>
<li>Vì sao <code>SELECT empSalary * 12 AS y FROM tblEmployee WHERE y &gt; 1000000</code> báo lỗi?</li>
<li>tblDepartment có 5 dòng, tblProject 6 dòng, dự án nào cũng có phòng. <code>tblDepartment LEFT JOIN tblProject</code> có bao nhiêu dòng, vì sao?</li>
<li><code>SELECT depNum FROM tblEmployee GROUP BY depNum HAVING COUNT(*) &gt;= 4</code> trả về những phòng nào?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) WHERE chạy trước SELECT, nên bí danh y chưa tồn tại — phải lặp lại <code>empSalary * 12</code>. (2) 7: 6 cặp khớp + phòng 5 (không có dự án) được đệm NULL. (3) Phòng 1 và 2 (mỗi phòng 4 nhân viên).</p>`),
  ].join('\n'),
};

/* ───────── Quiz (dbi202-quiz-3) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'In which order does SQL Server logically evaluate the clauses of a query that uses SELECT, FROM, WHERE, GROUP BY, HAVING and ORDER BY?|||SQL Server tính các mệnh đề của một câu truy vấn có SELECT, FROM, WHERE, GROUP BY, HAVING và ORDER BY theo thứ tự logic nào?',
      options: ['FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY|||FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY', 'SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY|||SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY', 'FROM, GROUP BY, WHERE, HAVING, SELECT, ORDER BY|||FROM, GROUP BY, WHERE, HAVING, SELECT, ORDER BY', 'FROM, WHERE, SELECT, GROUP BY, HAVING, ORDER BY|||FROM, WHERE, SELECT, GROUP BY, HAVING, ORDER BY'],
      correctIndex: 0,
      points: 1,
      explanation: 'Rows are taken (FROM) and filtered (WHERE) before they can be grouped (GROUP BY); groups are filtered (HAVING) before the output columns are computed (SELECT); sorting comes last. B is the order in which you WRITE the clauses, not the order they run — that is why an alias made in SELECT cannot be used in WHERE but can be used in ORDER BY.|||Các dòng được lấy (FROM) và lọc (WHERE) trước khi có thể nhóm (GROUP BY); nhóm được lọc (HAVING) trước khi tính các cột đầu ra (SELECT); sắp xếp làm cuối cùng. B là thứ tự bạn VIẾT các mệnh đề, không phải thứ tự chạy — vì thế bí danh đặt ở SELECT không dùng được trong WHERE nhưng dùng được trong ORDER BY.' },
    { id: 'q2',
      question: 'T(x) holds 1, 2, 3 and S(y) holds 2 and NULL. What does this query return?|||T(x) chứa 1, 2, 3 và S(y) chứa 2 và NULL. Câu truy vấn này trả về gì?',
      code: `SELECT x
FROM T
WHERE x NOT IN (SELECT y FROM S);`,
      codeLang: 'sql',
      options: ['2 rows: 1 and 3|||2 dòng: 1 và 3', '1 row: 1|||1 dòng: 1', '0 rows — the NULL makes every NOT IN test UNKNOWN|||0 dòng — NULL làm mọi phép kiểm NOT IN thành UNKNOWN', '3 rows: 1, 2 and 3|||3 dòng: 1, 2 và 3'],
      correctIndex: 2,
      points: 1,
      explanation: 'x NOT IN (2, NULL) means x <> 2 AND x <> NULL. The comparison with NULL is UNKNOWN, so the condition is FALSE for 2 and UNKNOWN for 1 and 3 — never TRUE, so no row is returned. A is what you expect without the NULL; it is exactly the trap. Use NOT EXISTS, or filter y IS NOT NULL inside the subquery.|||x NOT IN (2, NULL) nghĩa là x <> 2 AND x <> NULL. Phép so với NULL là UNKNOWN, nên điều kiện là FALSE với 2 và UNKNOWN với 1 và 3 — không bao giờ TRUE, nên không dòng nào được trả về. A là điều bạn mong đợi nếu không có NULL; đó chính là cái bẫy. Hãy dùng NOT EXISTS, hoặc lọc y IS NOT NULL bên trong câu con.' },
    { id: 'q3',
      question: 'Dept has departments 10, 20, 30; Emp has An and Binh in 10, Chi in 20, Dung with no department. What value of n does this query show for department 30?|||Dept có các phòng 10, 20, 30; Emp có An và Binh ở phòng 10, Chi ở phòng 20, Dung không thuộc phòng nào. Câu truy vấn này hiện n bằng bao nhiêu cho phòng 30?',
      code: `SELECT d.id, COUNT(*) AS n
FROM Dept d LEFT JOIN Emp e ON e.dep = d.id
GROUP BY d.id;`,
      codeLang: 'sql',
      options: ['0 — nobody works in department 30|||0 — không ai làm ở phòng 30', '1 — COUNT(*) counts the NULL-padded row|||1 — COUNT(*) đếm cả dòng được đệm NULL', 'NULL — an empty group has no count|||NULL — nhóm rỗng không có số đếm', 'Department 30 does not appear at all|||Phòng 30 hoàn toàn không xuất hiện'],
      correctIndex: 1,
      points: 1,
      explanation: 'The LEFT JOIN keeps department 30 as one row padded with NULL on the Emp side; COUNT(*) counts rows, so that row counts as 1. A is the intended answer, obtained with COUNT(e.name), which ignores the NULL. D would be true for an inner JOIN. Dung (no department) matches no department and simply disappears.|||LEFT JOIN giữ phòng 30 thành một dòng được đệm NULL ở phía Emp; COUNT(*) đếm dòng, nên dòng đó được tính là 1. A là đáp án người viết mong muốn, có được bằng COUNT(e.name), vốn bỏ qua NULL. D đúng nếu dùng JOIN thường. Dung (không có phòng) không khớp phòng nào và chỉ đơn giản biến mất.' },
    { id: 'q4',
      question: 'W(emp, pro, hours) = (1,A,10), (2,A,30), (3,B,20), (4,B,20), (5,C,25). What does this query return?|||W(emp, pro, hours) = (1,A,10), (2,A,30), (3,B,20), (4,B,20), (5,C,25). Câu truy vấn này trả về gì?',
      code: `SELECT pro
FROM W
GROUP BY pro
HAVING AVG(hours) > 20;`,
      codeLang: 'sql',
      options: ['A and C|||A và C', 'A, B and C|||A, B và C', 'No row — HAVING needs a WHERE clause|||Không dòng nào — HAVING cần có WHERE', 'Only C|||Chỉ C'],
      correctIndex: 3,
      points: 1,
      explanation: 'Group averages: A = (10 + 30) / 2 = 20, B = 20, C = 25. Only 25 is strictly greater than 20. A is tempting because project A has a 30-hour worker — but HAVING tests the average of the group, not any single row, and exactly 20 is not > 20. C is false: HAVING works without WHERE.|||Trung bình từng nhóm: A = (10 + 30) / 2 = 20, B = 20, C = 25. Chỉ 25 là lớn hơn hẳn 20. A hấp dẫn vì dự án A có người làm 30 giờ — nhưng HAVING kiểm trung bình của nhóm, không phải một dòng nào đó, và đúng bằng 20 thì không > 20. C sai: HAVING chạy được khi không có WHERE.' },
    { id: 'q5',
      question: 'Score(name, score) = An 9, Bình 8, Chi 8, Dũng 7. How many rows does this query return?|||Score(name, score) = An 9, Bình 8, Chi 8, Dũng 7. Câu truy vấn này trả về bao nhiêu dòng?',
      code: `SELECT TOP 2 WITH TIES name, score
FROM Score
ORDER BY score DESC;`,
      codeLang: 'sql',
      options: ['3 rows — Chi ties with Bình at the cut-off|||3 dòng — Chi bằng điểm Bình ở chỗ cắt', '2 rows — TOP 2 always returns two rows|||2 dòng — TOP 2 luôn trả về hai dòng', '4 rows — WITH TIES keeps every row|||4 dòng — WITH TIES giữ mọi dòng', '1 row — only the highest score|||1 dòng — chỉ điểm cao nhất'],
      correctIndex: 0,
      points: 1,
      explanation: 'After ORDER BY score DESC the first two rows are An (9) and Bình (8); WITH TIES also keeps every further row equal to the last kept one, so Chi (8) is added: 3 rows. B is what TOP 2 without WITH TIES gives (and it would drop Chi or Bình arbitrarily). On PostgreSQL the same query is ORDER BY score DESC FETCH FIRST 2 ROWS WITH TIES.|||Sau ORDER BY score DESC hai dòng đầu là An (9) và Bình (8); WITH TIES giữ thêm mọi dòng tiếp theo bằng dòng cuối được giữ, nên Chi (8) được thêm: 3 dòng. B là kết quả của TOP 2 không có WITH TIES (và nó bỏ Chi hoặc Bình một cách tuỳ ý). Trên PostgreSQL câu tương đương là ORDER BY score DESC FETCH FIRST 2 ROWS WITH TIES.' },
    { id: 'q6',
      question: 'WorksOn(empSSN, proNum) says who works on which project. Which query lists the employees who work on BOTH project 1 and project 2?|||WorksOn(empSSN, proNum) cho biết ai làm dự án nào. Câu nào liệt kê các nhân viên làm CẢ dự án 1 lẫn dự án 2?',
      options: ['SELECT empSSN FROM WorksOn WHERE proNum = 1 AND proNum = 2|||SELECT empSSN FROM WorksOn WHERE proNum = 1 AND proNum = 2', 'SELECT empSSN FROM WorksOn WHERE proNum IN (1, 2)|||SELECT empSSN FROM WorksOn WHERE proNum IN (1, 2)', 'SELECT empSSN FROM WorksOn WHERE proNum = 1 INTERSECT SELECT empSSN FROM WorksOn WHERE proNum = 2|||SELECT empSSN FROM WorksOn WHERE proNum = 1 INTERSECT SELECT empSSN FROM WorksOn WHERE proNum = 2', 'SELECT DISTINCT empSSN FROM WorksOn GROUP BY empSSN HAVING COUNT(*) >= 1|||SELECT DISTINCT empSSN FROM WorksOn GROUP BY empSSN HAVING COUNT(*) >= 1'],
      correctIndex: 2,
      points: 1,
      explanation: '"Works on 1 and on 2" is a fact about two different rows of WorksOn, so it needs two queries combined with INTERSECT (or a self-join, or IN ... AND IN ...). A looks right but WHERE tests one row at a time and one row cannot have proNum 1 and 2 at once: always empty. B returns people on 1 OR 2. D returns everybody who works on any project.|||"Làm dự án 1 và dự án 2" là sự thật về hai dòng khác nhau của WorksOn, nên cần hai câu kết hợp bằng INTERSECT (hoặc tự nối, hoặc IN ... AND IN ...). A trông đúng nhưng WHERE kiểm từng dòng một, mà một dòng không thể vừa có proNum 1 vừa có proNum 2: luôn rỗng. B trả về người làm 1 HOẶC 2. D trả về mọi người làm bất kỳ dự án nào.' },
    { id: 'q7',
      question: 'Table E has 5 employees in departments 1, 2 and 3; no department 99 exists. What does this query return?|||Bảng E có 5 nhân viên ở các phòng 1, 2 và 3; không có phòng 99. Câu truy vấn này trả về gì?',
      code: `SELECT COUNT(*)
FROM E
WHERE salary > ALL (SELECT salary FROM E WHERE dep = 99);`,
      codeLang: 'sql',
      options: ['0 — nobody can beat an empty set|||0 — không ai lớn hơn được một tập rỗng', '5 — > ALL of an empty set is TRUE for every row|||5 — > ALL của tập rỗng là TRUE với mọi dòng', 'An error: the subquery returned no value|||Báo lỗi: câu con không trả về giá trị nào', 'NULL, because the subquery is empty|||NULL, vì câu con rỗng'],
      correctIndex: 1,
      points: 1,
      explanation: 'x > ALL (R) means "x is greater than every value of R"; when R is empty there is no value to contradict it, so it is TRUE for all 5 rows. A mixes it up with > ANY, which is FALSE on an empty set (no value to beat). C would be a scalar subquery with = returning several rows (error 512), not an empty one.|||x > ALL (R) nghĩa là "x lớn hơn mọi giá trị của R"; khi R rỗng thì không có giá trị nào phản bác, nên nó TRUE với cả 5 dòng. A nhầm với > ANY, vốn là FALSE trên tập rỗng (không có giá trị nào để vượt). C là chuyện của truy vấn con vô hướng dùng = mà trả về nhiều dòng (lỗi 512), không phải tập rỗng.' },
    { id: 'q8',
      question: "R(x) holds the four values 'A', NULL, 'A', 'B'. What are the three numbers returned by this query?|||R(x) chứa bốn giá trị 'A', NULL, 'A', 'B'. Câu truy vấn này trả về ba con số nào?",
      code: `SELECT COUNT(*), COUNT(x), COUNT(DISTINCT x)
FROM R;`,
      codeLang: 'sql',
      options: ['4 / 4 / 3|||4 / 4 / 3', '3 / 3 / 2|||3 / 3 / 2', '4 / 3 / 3|||4 / 3 / 3', '4 / 3 / 2|||4 / 3 / 2'],
      correctIndex: 3,
      points: 1,
      explanation: "COUNT(*) counts rows: 4. COUNT(x) counts non-NULL values: 'A', 'A', 'B' = 3. COUNT(DISTINCT x) counts different non-NULL values: 'A', 'B' = 2 — NULL is never counted by COUNT(column), with or without DISTINCT. C is tempting if you think DISTINCT keeps NULL as a value; it does in SELECT DISTINCT, but not inside COUNT.|||COUNT(*) đếm dòng: 4. COUNT(x) đếm giá trị khác NULL: 'A', 'A', 'B' = 3. COUNT(DISTINCT x) đếm các giá trị khác NULL khác nhau: 'A', 'B' = 2 — COUNT(cột) không bao giờ đếm NULL, dù có DISTINCT hay không. C hấp dẫn nếu nghĩ DISTINCT giữ NULL như một giá trị; SELECT DISTINCT thì có, nhưng bên trong COUNT thì không." },
    { id: 'q9',
      question: 'Emp.depNum is a foreign key to Dept (default NO ACTION) and employee 100 is in department 1. After running this script, how many rows does the last SELECT count in Dept?|||Emp.depNum là khoá ngoại trỏ tới Dept (mặc định NO ACTION) và nhân viên 100 thuộc phòng 1. Chạy xong đoạn script này, câu SELECT cuối đếm được bao nhiêu dòng trong Dept?',
      code: `CREATE TABLE Dept (depNum INT CONSTRAINT pk_dept PRIMARY KEY);
CREATE TABLE Emp (empId INT CONSTRAINT pk_emp PRIMARY KEY,
                  depNum INT CONSTRAINT fk_emp_dept REFERENCES Dept(depNum));
INSERT INTO Dept VALUES (1), (2);
INSERT INTO Emp VALUES (100, 1);
GO
DELETE FROM Dept WHERE depNum = 1;
GO
SELECT COUNT(*) FROM Dept;`,
      codeLang: 'sql',
      options: ['2 — the DELETE fails with error 547 and removes nothing|||2 — câu DELETE lỗi 547 và không xoá gì', '1 — department 1 is removed, employee 100 keeps depNum 1|||1 — phòng 1 bị xoá, nhân viên 100 vẫn giữ depNum 1', '1 — department 1 and employee 100 are both removed|||1 — cả phòng 1 lẫn nhân viên 100 bị xoá', '1 — department 1 is removed and depNum becomes NULL|||1 — phòng 1 bị xoá và depNum thành NULL'],
      correctIndex: 0,
      points: 1,
      explanation: 'With the default NO ACTION rule, deleting a parent row that still has children is refused: SQL Server reports Msg 547 (REFERENCE constraint fk_emp_dept) and the whole statement is cancelled, so Dept still has 2 rows. C and D describe ON DELETE CASCADE and ON DELETE SET NULL, which must be declared explicitly. B would break referential integrity, which is exactly what the constraint prevents.|||Với luật mặc định NO ACTION, xoá một dòng cha còn dòng con bị từ chối: SQL Server báo Msg 547 (ràng buộc REFERENCE fk_emp_dept) và cả câu lệnh bị huỷ, nên Dept vẫn có 2 dòng. C và D là hành vi của ON DELETE CASCADE và ON DELETE SET NULL, phải khai báo rõ mới có. B phá toàn vẹn tham chiếu, đúng thứ mà ràng buộc ngăn lại.' },
    { id: 'q10',
      question: 'Emp already contains a row with salary -5. What happens when this ALTER TABLE runs?|||Emp đang có một dòng lương -5. Chuyện gì xảy ra khi câu ALTER TABLE này chạy?',
      code: `CREATE TABLE Emp (empId INT PRIMARY KEY, salary INT);
INSERT INTO Emp VALUES (1, 500), (2, -5);
GO
ALTER TABLE Emp ADD CONSTRAINT ck_emp_salary CHECK (salary > 0);
GO`,
      codeLang: 'sql',
      options: ['The constraint is added and only future rows are checked|||Ràng buộc được thêm và chỉ kiểm các dòng về sau', 'It fails with error 547, so the constraint is not added|||Câu lệnh lỗi 547, nên ràng buộc không được thêm', 'The row with -5 is deleted, then the constraint is added|||Dòng -5 bị xoá, rồi ràng buộc được thêm', 'The salary -5 is changed to NULL, then it is added|||Lương -5 bị đổi thành NULL, rồi ràng buộc được thêm'],
      correctIndex: 1,
      points: 1,
      explanation: 'By default ALTER TABLE ... ADD CONSTRAINT ... CHECK checks the rows already in the table; the row with -5 violates salary > 0, so SQL Server reports "The ALTER TABLE statement conflicted with the CHECK constraint" (Msg 547) and the constraint is not created. A only happens if you write WITH NOCHECK explicitly (and the constraint is then not trusted). The DBMS never deletes or changes your data to satisfy a constraint (C, D).|||Mặc định ALTER TABLE ... ADD CONSTRAINT ... CHECK kiểm cả các dòng đang có trong bảng; dòng -5 vi phạm salary > 0, nên SQL Server báo "The ALTER TABLE statement conflicted with the CHECK constraint" (Msg 547) và ràng buộc không được tạo. A chỉ xảy ra khi bạn ghi rõ WITH NOCHECK (và ràng buộc khi đó không được tin cậy). DBMS không bao giờ tự xoá hay sửa dữ liệu của bạn để thoả ràng buộc (C, D).' },
  ],
};

export default {
  slides: [L_dbi7_3, L_dbi7_4, L_dbi7_5, L_dbi7_6],
  practice: L_on_ch6,
  quiz: QUIZ,
  quizDescription: '10 câu kiểu FE/PT cho Chương 5–6: thứ tự thực thi của câu SELECT, NOT IN gặp NULL, LEFT JOIN với COUNT(*), HAVING AVG, TOP WITH TIES, tìm "làm cả hai dự án", > ALL trên tập rỗng, COUNT(*)/COUNT(cột)/COUNT(DISTINCT), xoá dòng cha còn khoá ngoại trỏ tới, và thêm ràng buộc CHECK khi dữ liệu cũ vi phạm — 8 câu "kết quả là gì" được chạy thật trên SQL Server để xác nhận đáp án; mỗi câu có giải thích vì sao đúng và vì sao phương án hấp dẫn nhất sai.',
};
