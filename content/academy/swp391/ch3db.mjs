// content/academy/swp391/ch3db.mjs — Chapter 3, database-design part (imported by ch3.mjs).
// Deck: 'g-db' = Slide4 Database Design (25 pages, Gomaa COMET ch. 15 style), plus the G5 sample
// database (schema only — never the INSERT rows, they hold real students' data) and Claude prompt #7.
import { walk, walkHead, slide, bi, books } from './_slides.mjs';

/* ═════════════ LESSON 3.1 — data modelling, entity → table, PK, FK (g-db 1–8) ═════════════ */
const L1_INTRO = bi(`<span class="eyebrow">Chapter 3 · Lesson 3.6 · Database Design slides 1–8</span>
<h2>Data modelling — from use cases to tables, primary keys and foreign keys</h2>
<p class="lead">In SWP391 the database is not a separate phase: in <strong>every iteration</strong> each member designs the tables behind his or her 3–4 screens, writes them into the RDS document (section "Database Design") and commits the SQL script together with the code. The teacher's deck <em>Slide4 Database Design</em> follows Gomaa's COMET method: take the entity classes of the static model and map them, rule by rule, to relational tables.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li><strong>Place</strong> database design inside COMET (requirements → analysis → design) and name its 4 inputs</li>
<li><strong>Map</strong> an entity class to a table: class → table, attribute → column, object → row</li>
<li><strong>Choose</strong> a primary key for every table and explain why it must be unique and stable</li>
<li><strong>Use</strong> foreign keys to represent 1:1 and 1:N associations, and know that M:N needs its own table</li>
<li><strong>Normalise</strong> a draft to 3NF and write the table descriptions the RDS / SDS template asks for</li>
</ul></div>
<h3>The essentials in one screen</h3>
<table>
<thead><tr><th>Static model (UML)</th><th>Relational design (table)</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Entity class</td><td>One (or more) table</td><td>5–6</td></tr>
<tr><td>Attribute</td><td>Column with a data type</td><td>5–6</td></tr>
<tr><td>Object (instance)</td><td>Row (record)</td><td>5–6</td></tr>
<tr><td>Identity of an object</td><td>Primary key — one or more columns, unique</td><td>7</td></tr>
<tr><td>1:1 / 0..1 / 1:N association</td><td>Foreign key column</td><td>8–12</td></tr>
<tr><td>M:N association / association class</td><td>Associative table with a concatenated key</td><td>13–15</td></tr>
<tr><td>Aggregation / composition</td><td>Whole table + part tables (key of the whole inside the part)</td><td>16–17</td></tr>
<tr><td>Generalisation / specialisation</td><td>3 options: super + sub tables · sub only · super only</td><td>18–22</td></tr>
</tbody>
</table>`,
  `<span class="eyebrow">Chương 3 · Bài 3.6 · Database Design slide 1–8</span>
<h2>Mô hình hoá dữ liệu — từ use case tới bảng, khoá chính và khoá ngoại</h2>
<p class="lead">Ở SWP391, CSDL không phải một giai đoạn riêng: trong <strong>mỗi iteration</strong>, từng thành viên thiết kế các bảng phía sau 3–4 màn hình của mình, ghi vào tài liệu RDS (mục "Database Design") và commit script SQL cùng với code. Bộ slide <em>Slide4 Database Design</em> của thầy/cô đi theo phương pháp COMET của Gomaa: lấy các entity class của static model rồi ánh xạ, theo từng quy tắc, thành bảng quan hệ.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li><strong>Đặt</strong> thiết kế CSDL vào đúng chỗ trong COMET (requirements → analysis → design) và kể 4 đầu vào của nó</li>
<li><strong>Ánh xạ</strong> entity class thành bảng: class → bảng, attribute → cột, object → dòng</li>
<li><strong>Chọn</strong> khoá chính cho mọi bảng và giải thích vì sao nó phải duy nhất và ổn định</li>
<li><strong>Dùng</strong> khoá ngoại để biểu diễn quan hệ 1:1 và 1:N, và biết M:N cần bảng riêng</li>
<li><strong>Chuẩn hoá</strong> bản nháp tới 3NF và viết mô tả bảng theo mẫu RDS / SDS</li>
</ul></div>
<h3>Cốt lõi trong một màn hình</h3>
<table>
<thead><tr><th>Static model (UML)</th><th>Thiết kế quan hệ (bảng)</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Entity class</td><td>Một (hoặc nhiều) bảng</td><td>5–6</td></tr>
<tr><td>Attribute</td><td>Cột có kiểu dữ liệu</td><td>5–6</td></tr>
<tr><td>Object (thể hiện)</td><td>Dòng (record)</td><td>5–6</td></tr>
<tr><td>Định danh của object</td><td>Khoá chính — một hay nhiều cột, duy nhất</td><td>7</td></tr>
<tr><td>Quan hệ 1:1 / 0..1 / 1:N</td><td>Cột khoá ngoại</td><td>8–12</td></tr>
<tr><td>Quan hệ M:N / association class</td><td>Bảng liên kết (associative) với khoá ghép</td><td>13–15</td></tr>
<tr><td>Aggregation / composition</td><td>Bảng tổng thể + các bảng bộ phận (khoá của tổng thể nằm trong bộ phận)</td><td>16–17</td></tr>
<tr><td>Generalisation / specialisation</td><td>3 cách: bảng cha + bảng con · chỉ bảng con · chỉ bảng cha</td><td>18–22</td></tr>
</tbody>
</table>`);

const L1_ROWS = [
  [1, 'Title — Database Design Guides',
    `<p class="y-chinh">🎯 The fourth guide deck of SWP391: how to turn your analysis model into a relational database.</p>
<p class="nhan">Where it fits in the course</p>
<ul>
<li><strong>Slide2 Software Requirement</strong> — use cases, screens, ERD (what data exists)</li>
<li><strong>Slide3 System Design</strong> — architecture, class &amp; sequence diagrams</li>
<li><strong>Slide4 Database Design</strong> — this deck: tables, keys and mapping rules</li>
</ul>
<p class="nhan">What the teacher checks</p>
<ul>
<li><strong>RDS document</strong> — section "Database Design": a. database schema (diagram) + b. table descriptions</li>
<li><strong>Source tag</strong> — the DB script that creates exactly the tables your screens use</li>
</ul>`,
    `<p class="y-chinh">🎯 Bộ slide hướng dẫn thứ tư của SWP391: biến analysis model thành một CSDL quan hệ.</p>
<p class="nhan">Vị trí trong môn học</p>
<ul>
<li><strong>Slide2 Software Requirement</strong> — use case, màn hình, ERD (có những dữ liệu gì)</li>
<li><strong>Slide3 System Design</strong> — kiến trúc, class &amp; sequence diagram</li>
<li><strong>Slide4 Database Design</strong> — bộ này: bảng, khoá và quy tắc ánh xạ</li>
</ul>
<p class="nhan">Thầy/cô kiểm tra gì</p>
<ul>
<li><strong>Tài liệu RDS</strong> — mục "Database Design": a. database schema (sơ đồ) + b. mô tả các bảng</li>
<li><strong>Tag mã nguồn</strong> — script DB tạo đúng các bảng mà màn hình của bạn dùng</li>
</ul>`],
  [2, 'Main contents',
    `<p class="y-chinh">🎯 Eight topics — one simple mapping rule each, then one full example.</p>
<ol>
<li><strong>Overview</strong> — RDD, COMET steps, inputs (slides 3–5)</li>
<li><strong>Entity classes &amp; relational tables</strong> (slide 6)</li>
<li><strong>Primary keys</strong> (slide 7)</li>
<li><strong>Foreign keys</strong> (slide 8)</li>
<li><strong>Association mapping</strong> — 1:1, 0..1, 1:N, association class (slides 9–15)</li>
<li><strong>Aggregation / composition hierarchy</strong> (slides 16–17)</li>
<li><strong>Generalisation / specialisation hierarchy</strong> (slides 18–22)</li>
<li><strong>Example relational DB design</strong> — Banking System (slides 23–24)</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> this course splits them into three lessons — 3.1 (topics 1–4), 3.7 (5–6), 3.8 (7–8).</p>`,
    `<p class="y-chinh">🎯 Tám chủ đề — mỗi chủ đề một quy tắc ánh xạ đơn giản, cuối cùng là một ví dụ trọn vẹn.</p>
<ol>
<li><strong>Tổng quan</strong> — RDD, các bước COMET, đầu vào (slide 3–5)</li>
<li><strong>Entity class &amp; bảng quan hệ</strong> (slide 6)</li>
<li><strong>Khoá chính</strong> (slide 7)</li>
<li><strong>Khoá ngoại</strong> (slide 8)</li>
<li><strong>Ánh xạ association</strong> — 1:1, 0..1, 1:N, association class (slide 9–15)</li>
<li><strong>Cây aggregation / composition</strong> (slide 16–17)</li>
<li><strong>Cây generalisation / specialisation</strong> (slide 18–22)</li>
<li><strong>Ví dụ thiết kế CSDL</strong> — Banking System (slide 23–24)</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> khoá học chia thành ba bài — 3.1 (chủ đề 1–4), 3.7 (5–6), 3.8 (7–8).</p>`],
  [3, 'Overview — relational database design inside COMET/UML',
    `<p class="y-chinh">🎯 Database design is one of the three parts of <em>Design Modeling</em> in COMET, done after requirements and analysis.</p>
<p class="nhan">Relational database design (RDD)</p>
<ul>
<li><strong>Table (relation)</strong> — rows and columns; each <strong>row</strong> is one record, each <strong>column</strong> one attribute</li>
<li><strong>SQL</strong> — the language used to create and manipulate it (DDL: CREATE/ALTER; DML: SELECT/INSERT/UPDATE/DELETE)</li>
</ul>
<p class="nhan">The three COMET models</p>
<ol>
<li><strong>Requirements model</strong> — use cases (Slide2)</li>
<li><strong>Analysis model</strong> — static model with entity classes, dynamic model with interactions</li>
<li><strong>Design model</strong> — architecture design · <strong>database design</strong> · detailed design</li>
</ol>
<p class="nhan">Read the diagram</p>
<p>The COMET life cycle is iterative: design → incremental construction → integration → system testing, and back to requirements (arrows 10–15). That is exactly SWP391's 3 iterations: the schema grows every iteration.</p>
<div class="pitfall co-tieu-de"><strong>Designing all tables in week 1.</strong> Many teams draw a 40-table ERD at the start and never use half of it. Design the tables your iteration's screens need, and extend them later with ALTER scripts.</div>`,
    `<p class="y-chinh">🎯 Thiết kế CSDL là một trong ba phần của <em>Design Modeling</em> trong COMET, làm sau requirements và analysis.</p>
<p class="nhan">Thiết kế CSDL quan hệ (RDD)</p>
<ul>
<li><strong>Bảng (relation)</strong> — gồm dòng và cột; mỗi <strong>dòng</strong> là một record, mỗi <strong>cột</strong> là một thuộc tính</li>
<li><strong>SQL</strong> — ngôn ngữ để tạo và thao tác (DDL: CREATE/ALTER; DML: SELECT/INSERT/UPDATE/DELETE)</li>
</ul>
<p class="nhan">Ba mô hình của COMET</p>
<ol>
<li><strong>Requirements model</strong> — use case (Slide2)</li>
<li><strong>Analysis model</strong> — static model với entity class, dynamic model với tương tác</li>
<li><strong>Design model</strong> — thiết kế kiến trúc · <strong>thiết kế CSDL</strong> · thiết kế chi tiết</li>
</ol>
<p class="nhan">Đọc sơ đồ</p>
<p>Vòng đời COMET là lặp: design → xây dựng tăng dần → tích hợp → system testing, rồi quay lại requirements (mũi tên 10–15). Đó chính là 3 iteration của SWP391: schema lớn dần qua từng iteration.</p>
<div class="pitfall co-tieu-de"><strong>Thiết kế hết mọi bảng ngay tuần 1.</strong> Nhiều nhóm vẽ ERD 40 bảng từ đầu rồi không dùng tới một nửa. Hãy thiết kế các bảng mà màn hình của iteration cần, rồi mở rộng sau bằng script ALTER.</div>`],
  [4, 'Overview — main inputs',
    `<p class="y-chinh">🎯 You never design tables from nothing: four documents you already wrote feed the database design.</p>
<p class="nhan">The 4 inputs</p>
<ol>
<li><strong>UC specifications</strong> — every "the system saves / shows / updates …" step names data you must store</li>
<li><strong>Entity Relationship Diagram (ERD)</strong> — the entities and their multiplicities (SRS §1.5, crow's-foot notation)</li>
<li><strong>Entity class diagrams &amp; attributes</strong> — the static model: names, types, associations</li>
<li><strong>GUI / screen layout design</strong> — every input field and every column of a list screen needs a source column</li>
</ol>
<p class="nhan">Example — G5 "Job IT for Freelancer"</p>
<ul>
<li><strong>UC "Apply job"</strong> → store who applied, which post, when, with which CV, and the status</li>
<li><strong>Screen "Post detail"</strong> → title, budget, location, job type, duration, category, expiry date</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> "U-E-C-G" — Use cases, ERD, Classes, GUI. A column that no screen and no use case needs is a column you should question.</p>`,
    `<p class="y-chinh">🎯 Không bao giờ thiết kế bảng từ số không: bốn tài liệu bạn đã viết là đầu vào của thiết kế CSDL.</p>
<p class="nhan">4 đầu vào</p>
<ol>
<li><strong>Đặc tả use case</strong> — mỗi bước "hệ thống lưu / hiển thị / cập nhật …" gọi tên một dữ liệu phải lưu</li>
<li><strong>Entity Relationship Diagram (ERD)</strong> — các thực thể và bội số quan hệ (SRS §1.5, ký hiệu crow's-foot)</li>
<li><strong>Entity class diagram &amp; thuộc tính</strong> — static model: tên, kiểu, quan hệ</li>
<li><strong>Thiết kế giao diện / layout màn hình</strong> — mỗi ô nhập và mỗi cột của màn hình danh sách cần một cột nguồn</li>
</ol>
<p class="nhan">Ví dụ — nhóm G5 "Job IT for Freelancer"</p>
<ul>
<li><strong>UC "Apply job"</strong> → lưu ai ứng tuyển, bài đăng nào, lúc nào, CV nào, và trạng thái</li>
<li><strong>Màn "Post detail"</strong> → title, budget, location, job type, duration, category, ngày hết hạn</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "U-E-C-G" — Use case, ERD, Class, GUI. Cột nào không màn hình và không use case nào cần thì nên xem lại.</p>`],
  [5, 'Overview — the relational database design objective and steps',
    `<p class="y-chinh">🎯 Objective: map the static model to a relational database — one checklist of five mapping topics.</p>
<p class="nhan">For each entity class that must be stored</p>
<ul>
<li><strong>Class → table</strong> — one, or more than one if it is split (e.g. a hierarchy)</li>
<li><strong>Attribute → column</strong></li>
<li><strong>Object instance → row</strong></li>
</ul>
<p class="nhan">Then decide, in this order</p>
<ol>
<li><strong>Primary keys</strong></li>
<li><strong>Foreign keys</strong> for associations</li>
<li><strong>Association classes</strong></li>
<li><strong>Aggregation / composition</strong> hierarchies</li>
<li><strong>Generalisation / specialisation</strong> hierarchies</li>
</ol>
<p class="ghi-chu">"Needs to be stored" matters: boundary and control classes (servlets, controllers, DAO) are not tables — only <em>entity</em> classes are.</p>`,
    `<p class="y-chinh">🎯 Mục tiêu: ánh xạ static model thành CSDL quan hệ — một checklist gồm năm chủ đề ánh xạ.</p>
<p class="nhan">Với mỗi entity class cần lưu trữ</p>
<ul>
<li><strong>Class → bảng</strong> — một bảng, hoặc nhiều hơn nếu bị tách (ví dụ cây kế thừa)</li>
<li><strong>Attribute → cột</strong></li>
<li><strong>Object → dòng</strong></li>
</ul>
<p class="nhan">Rồi quyết định, theo thứ tự</p>
<ol>
<li><strong>Khoá chính</strong></li>
<li><strong>Khoá ngoại</strong> cho các association</li>
<li><strong>Association class</strong></li>
<li>Cây <strong>aggregation / composition</strong></li>
<li>Cây <strong>generalisation / specialisation</strong></li>
</ol>
<p class="ghi-chu">"Cần lưu trữ" là điểm quan trọng: boundary và control class (servlet, controller, DAO) không phải bảng — chỉ <em>entity</em> class mới thành bảng.</p>`],
  [6, 'Entity classes and relational tables — the Account example',
    `<p class="y-chinh">🎯 The same thing twice: the <em>Account</em> class (design time) and the <em>Account</em> table (run time, three rows).</p>
<p class="nhan">Read the picture</p>
<ul>
<li><strong>Class box</strong> — name <code>Account</code>; attributes <code>accountNumber: Integer</code>, <code>balance: Real</code></li>
<li><strong>Table</strong> — columns <code>Account Number</code>, <code>Balance</code>; rows 1234 / 5678 / 1287 = three Account objects</li>
</ul>
<p class="nhan">UML type → MySQL 8 type</p>
<ul>
<li><strong>Integer</strong> → <code>INT</code> (or <code>BIGINT</code> for ids that may grow large)</li>
<li><strong>Real</strong> for money → <code>DECIMAL(15,2)</code>, never <code>FLOAT</code>/<code>DOUBLE</code> (rounding errors)</li>
<li><strong>String</strong> → <code>VARCHAR(n)</code> with a real maximum; long text → <code>TEXT</code></li>
<li><strong>Date / time</strong> → <code>DATE</code>, <code>DATETIME</code>; <strong>Boolean</strong> → <code>BOOLEAN</code> (= <code>TINYINT(1)</code>)</li>
</ul>
<div class="pitfall">"Real" on the slide is a UML analysis type. When you write the physical table for a job budget or a salary, pick <code>DECIMAL</code> — examiners do ask why.</div>`,
    `<p class="y-chinh">🎯 Cùng một thứ nhìn hai lần: class <em>Account</em> (lúc thiết kế) và bảng <em>Account</em> (lúc chạy, có ba dòng).</p>
<p class="nhan">Đọc hình</p>
<ul>
<li><strong>Hộp class</strong> — tên <code>Account</code>; thuộc tính <code>accountNumber: Integer</code>, <code>balance: Real</code></li>
<li><strong>Bảng</strong> — cột <code>Account Number</code>, <code>Balance</code>; các dòng 1234 / 5678 / 1287 = ba object Account</li>
</ul>
<p class="nhan">Kiểu UML → kiểu MySQL 8</p>
<ul>
<li><strong>Integer</strong> → <code>INT</code> (hoặc <code>BIGINT</code> cho id có thể rất lớn)</li>
<li><strong>Real</strong> dùng cho tiền → <code>DECIMAL(15,2)</code>, không bao giờ <code>FLOAT</code>/<code>DOUBLE</code> (sai số làm tròn)</li>
<li><strong>String</strong> → <code>VARCHAR(n)</code> với độ dài tối đa thật; văn bản dài → <code>TEXT</code></li>
<li><strong>Date / time</strong> → <code>DATE</code>, <code>DATETIME</code>; <strong>Boolean</strong> → <code>BOOLEAN</code> (= <code>TINYINT(1)</code>)</li>
</ul>
<div class="pitfall">"Real" trên slide là kiểu ở mức phân tích. Khi viết bảng vật lý cho budget hay lương, hãy chọn <code>DECIMAL</code> — hội đồng hay hỏi vì sao.</div>`],
  [7, 'Primary keys',
    `<p class="y-chinh">🎯 Every table must have a primary key — one or more columns whose value locates exactly one row.</p>
<p class="nhan">The rule</p>
<ul>
<li><strong>Each relation must have a PK</strong> — no exceptions, not even for "log" or "bookmark" tables</li>
<li><strong>One or more attributes</strong> — a single column, or a <em>concatenated</em> (composite) key</li>
<li><strong>Uniquely locates a row</strong> — so it is <code>NOT NULL</code> and never duplicated</li>
</ul>
<p class="nhan">Notation used in the whole deck</p>
<p><code>Account (<u>Account number</u>, Balance)</code> — <u>underline</u> = primary key; later <em>italic</em> = foreign key.</p>
<p class="nhan">Natural or surrogate key?</p>
<ul>
<li><strong>Natural key</strong> — a real-world value (account number, student ID). Meaningful, but it may change or be reused</li>
<li><strong>Surrogate key</strong> — an <code>AUTO_INCREMENT</code> id with no meaning. Stable; the usual choice in SWP391 projects. Keep the natural value as a <code>UNIQUE</code> column</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Real finding in the G5 sample.</strong> Its <code>Mark</code> table (a recruiter bookmarks a freelancer) has a <code>MarkID</code> column but <em>no PRIMARY KEY constraint</em> — it breaks slide 7 and allows duplicate rows (lesson 3.9).</div>`,
    `<p class="y-chinh">🎯 Mọi bảng phải có khoá chính — một hay nhiều cột mà giá trị của nó chỉ đúng một dòng.</p>
<p class="nhan">Quy tắc</p>
<ul>
<li><strong>Mỗi relation phải có PK</strong> — không ngoại lệ, kể cả bảng "log" hay "bookmark"</li>
<li><strong>Một hay nhiều thuộc tính</strong> — một cột, hoặc khoá <em>ghép</em> (composite / concatenated)</li>
<li><strong>Xác định duy nhất một dòng</strong> — nên nó <code>NOT NULL</code> và không bao giờ trùng</li>
</ul>
<p class="nhan">Ký hiệu dùng xuyên suốt bộ slide</p>
<p><code>Account (<u>Account number</u>, Balance)</code> — <u>gạch chân</u> = khoá chính; về sau <em>in nghiêng</em> = khoá ngoại.</p>
<p class="nhan">Khoá tự nhiên hay khoá thay thế?</p>
<ul>
<li><strong>Natural key</strong> — giá trị ngoài đời (số tài khoản, mã sinh viên). Có nghĩa, nhưng có thể đổi hoặc bị tái sử dụng</li>
<li><strong>Surrogate key</strong> — id <code>AUTO_INCREMENT</code> không mang nghĩa. Ổn định; lựa chọn thường gặp ở đồ án SWP391. Giữ giá trị tự nhiên thành cột <code>UNIQUE</code></li>
</ul>
<div class="pitfall co-tieu-de"><strong>Lỗi thật trong mẫu G5.</strong> Bảng <code>Mark</code> (recruiter đánh dấu một freelancer) có cột <code>MarkID</code> nhưng <em>không có ràng buộc PRIMARY KEY</em> — vi phạm slide 7 và cho phép dòng trùng (bài 3.9).</div>`],
  [8, 'Foreign keys',
    `<p class="y-chinh">🎯 Associations become either a foreign key (1:1, 1:N) or a table of their own (M:N).</p>
<p class="nhan">Which mapping for which association</p>
<ul>
<li><strong>Many-to-many</strong> → maps to a <em>relation</em> (an associative table — slides 13–15)</li>
<li><strong>One-to-one and one-to-many</strong> → use <em>foreign keys</em> (slides 9–12)</li>
</ul>
<p class="nhan">What a foreign key is</p>
<ul>
<li><strong>Definition</strong> — the primary key of one table embedded in another table</li>
<li><strong>Purpose</strong> — represents the association between the two relations</li>
<li><strong>Navigation</strong> — lets you JOIN from one table to the other</li>
</ul>
<p class="nhan">Example — G5</p>
<p><code>Post (<u>postID</u>, title, …, <em>recruiterID</em>, <em>caID</em>)</code>: <code>recruiterID</code> is the PK of <code>Recruiter</code> embedded in <code>Post</code>, so "all posts of recruiter 7" is <code>SELECT … FROM Post WHERE recruiterID = 7</code>.</p>
<div class="pitfall co-tieu-de"><strong>A column is not a foreign key until you declare it.</strong> Writing <code>recruiterID INT</code> without <code>FOREIGN KEY … REFERENCES</code> lets the database store posts of recruiters that do not exist. Declare every FK in the script, and show it in the schema diagram.</div>`,
    `<p class="y-chinh">🎯 Association trở thành hoặc khoá ngoại (1:1, 1:N), hoặc một bảng riêng (M:N).</p>
<p class="nhan">Loại association nào ánh xạ thế nào</p>
<ul>
<li><strong>Nhiều-nhiều</strong> → ánh xạ thành một <em>relation</em> (bảng liên kết — slide 13–15)</li>
<li><strong>Một-một và một-nhiều</strong> → dùng <em>khoá ngoại</em> (slide 9–12)</li>
</ul>
<p class="nhan">Khoá ngoại là gì</p>
<ul>
<li><strong>Định nghĩa</strong> — khoá chính của một bảng được nhúng vào bảng khác</li>
<li><strong>Mục đích</strong> — biểu diễn quan hệ giữa hai relation</li>
<li><strong>Điều hướng</strong> — cho phép JOIN từ bảng này sang bảng kia</li>
</ul>
<p class="nhan">Ví dụ — G5</p>
<p><code>Post (<u>postID</u>, title, …, <em>recruiterID</em>, <em>caID</em>)</code>: <code>recruiterID</code> là PK của <code>Recruiter</code> nhúng vào <code>Post</code>, nên "mọi bài đăng của recruiter 7" là <code>SELECT … FROM Post WHERE recruiterID = 7</code>.</p>
<div class="pitfall co-tieu-de"><strong>Một cột chưa phải khoá ngoại cho tới khi bạn khai báo.</strong> Viết <code>recruiterID INT</code> mà không có <code>FOREIGN KEY … REFERENCES</code> thì CSDL vẫn lưu bài đăng của recruiter không tồn tại. Khai báo mọi FK trong script, và thể hiện nó trên sơ đồ schema.</div>`],
];

const L1_DEEP = [
  bi(`<h2>🛠️ Worked example — from use cases to tables (Job IT for Freelancer)</h2>
<p>The running example of this chapter is the G5 sample system: freelancers build a profile and apply for IT jobs; recruiters post jobs for their company; an admin moderates posts and writes blogs. Follow the five steps below for <em>your</em> screens each iteration.</p>
<p class="nhan">Step 1 — collect the nouns from use cases and screens</p>
<p>From "UC Apply job", "UC Add post", "UC Add post in favourite", "UC Mark freelancer", "UC Add blog", "Screen Post detail": <em>freelancer, recruiter, admin, account, company, post, category, job type, duration, application, CV, favourite, skill, education, experience, report, blog</em>.</p>
<p class="nhan">Step 2 — keep only entity classes (data that must be stored)</p>
<ul>
<li><strong>Keep</strong> — User, Freelancer, Recruiter, Admin, Company, Post, Category, JobType, Duration, Skill, Education, Experience, Blog, Report</li>
<li><strong>Attribute, not entity</strong> — CV (a file path column of the application), status</li>
<li><strong>Association, not entity</strong> — application (Freelancer–Post, M:N with data), favourite (Freelancer–Post, M:N)</li>
</ul>
<p class="nhan">Step 3 — attributes from the screen fields</p>
<p>Screen "Add post" has: title, image, job type, duration, quantity, budget, location, expiry date, category, description → those are Post's columns (job type, duration, category become FKs to lookup tables).</p>
<p class="nhan">Step 4 — a primary key for each table (slide 7)</p>
<p>Surrogate <code>INT AUTO_INCREMENT</code> ids everywhere; natural unique values (username, e-mail) become <code>UNIQUE</code> columns.</p>
<p class="nhan">Step 5 — associations to foreign keys (slide 8)</p>
<pre>User       (<u>user_id</u>, username, email, password_hash, <em>role_id</em>, status, created_at)
Recruiter  (<u>recruiter_id</u>, <em>user_id</em> UNIQUE, first_name, last_name, phone)
Company    (<u>company_id</u>, <em>recruiter_id</em> UNIQUE, name, website, <em>team_size_id</em>)
Category   (<u>category_id</u>, name)
Post       (<u>post_id</u>, <em>recruiter_id</em>, <em>category_id</em>, <em>job_type_id</em>, <em>duration_id</em>,
            title, quantity, budget, location, posted_at, expires_at, status)
Freelancer (<u>freelancer_id</u>, <em>user_id</em> UNIQUE, first_name, last_name, dob, gender)
JobApply   (<u>apply_id</u>, <em>freelancer_id</em>, <em>post_id</em>, cv_url, applied_at, status)
           -- UNIQUE (freelancer_id, post_id): one application per post

<u>underline</u> = primary key     <em>italic</em> = foreign key   (the deck's notation, slide 10)</pre>
<p class="ghi-chu">This is the <em>logical</em> design. Lessons 3.7 and 3.8 explain each mapping choice (why the FK of 1:1 goes into Freelancer, why JobApply is an associative table); lesson 3.9 turns it into MySQL 8 DDL.</p>`,
  `<h2>🛠️ Ví dụ làm từng bước — từ use case tới bảng (Job IT for Freelancer)</h2>
<p>Ví dụ xuyên suốt chương là hệ thống mẫu của nhóm G5: freelancer tạo hồ sơ và ứng tuyển việc IT; recruiter đăng tin cho công ty của mình; admin duyệt bài đăng và viết blog. Làm theo năm bước dưới đây cho các màn hình <em>của bạn</em> ở mỗi iteration.</p>
<p class="nhan">Bước 1 — gom danh từ từ use case và màn hình</p>
<p>Từ "UC Apply job", "UC Add post", "UC Add post in favourite", "UC Mark freelancer", "UC Add blog", "Màn Post detail": <em>freelancer, recruiter, admin, tài khoản, công ty, bài đăng, danh mục, loại việc, thời lượng, đơn ứng tuyển, CV, yêu thích, kỹ năng, học vấn, kinh nghiệm, báo cáo, blog</em>.</p>
<p class="nhan">Bước 2 — chỉ giữ entity class (dữ liệu phải lưu)</p>
<ul>
<li><strong>Giữ</strong> — User, Freelancer, Recruiter, Admin, Company, Post, Category, JobType, Duration, Skill, Education, Experience, Blog, Report</li>
<li><strong>Là thuộc tính, không phải thực thể</strong> — CV (cột đường dẫn file của đơn ứng tuyển), trạng thái</li>
<li><strong>Là quan hệ, không phải thực thể</strong> — đơn ứng tuyển (Freelancer–Post, M:N có dữ liệu), yêu thích (Freelancer–Post, M:N)</li>
</ul>
<p class="nhan">Bước 3 — thuộc tính lấy từ các ô trên màn hình</p>
<p>Màn "Add post" có: title, image, job type, duration, quantity, budget, location, ngày hết hạn, category, description → đó là các cột của Post (job type, duration, category thành FK tới bảng tra cứu).</p>
<p class="nhan">Bước 4 — khoá chính cho mỗi bảng (slide 7)</p>
<p>Dùng id thay thế <code>INT AUTO_INCREMENT</code> ở mọi bảng; giá trị tự nhiên duy nhất (username, e-mail) thành cột <code>UNIQUE</code>.</p>
<p class="nhan">Bước 5 — association thành khoá ngoại (slide 8)</p>
<pre>User       (<u>user_id</u>, username, email, password_hash, <em>role_id</em>, status, created_at)
Recruiter  (<u>recruiter_id</u>, <em>user_id</em> UNIQUE, first_name, last_name, phone)
Company    (<u>company_id</u>, <em>recruiter_id</em> UNIQUE, name, website, <em>team_size_id</em>)
Category   (<u>category_id</u>, name)
Post       (<u>post_id</u>, <em>recruiter_id</em>, <em>category_id</em>, <em>job_type_id</em>, <em>duration_id</em>,
            title, quantity, budget, location, posted_at, expires_at, status)
Freelancer (<u>freelancer_id</u>, <em>user_id</em> UNIQUE, first_name, last_name, dob, gender)
JobApply   (<u>apply_id</u>, <em>freelancer_id</em>, <em>post_id</em>, cv_url, applied_at, status)
           -- UNIQUE (freelancer_id, post_id): mỗi bài chỉ ứng tuyển một lần

<u>gạch chân</u> = khoá chính     <em>nghiêng</em> = khoá ngoại   (ký hiệu của bộ slide, slide 10)</pre>
<p class="ghi-chu">Đây là thiết kế <em>logic</em>. Bài 3.7 và 3.8 giải thích từng lựa chọn ánh xạ (vì sao FK của quan hệ 1:1 nằm ở Freelancer, vì sao JobApply là bảng liên kết); bài 3.9 biến nó thành DDL MySQL 8.</p>`),
  bi(`<h2>📐 ERD — three levels and the crow's-foot notation</h2>
<p class="nhan">Three levels of the same model</p>
<table>
<thead><tr><th>Level</th><th>Shows</th><th>Where in your documents</th></tr></thead>
<tbody>
<tr><td><strong>Conceptual</strong></td><td>Entities and relationships only, with multiplicities</td><td>SRS Template1 §1.5 "Entity Relationship Diagram" + entity description table (#, Entity, Description)</td></tr>
<tr><td><strong>Logical</strong></td><td>Attributes, PK (underline), FK (italic), associative tables</td><td>The relational notation of this deck</td></tr>
<tr><td><strong>Physical</strong></td><td>Real tables, types, NULL / NOT NULL, UNIQUE, indexes</td><td>RDS "Database Design" / SDS Template2 §1.3 + the SQL script</td></tr>
</tbody>
</table>
<p class="nhan">Crow's-foot symbols (the SRS template asks for this notation)</p>
<table>
<thead><tr><th>Symbol at the end of a line</th><th>Meaning</th><th>UML multiplicity</th></tr></thead>
<tbody>
<tr><td>bar + bar ( ‖ )</td><td>exactly one</td><td>1</td></tr>
<tr><td>circle + bar ( o| )</td><td>zero or one</td><td>0..1</td></tr>
<tr><td>bar + crow's foot ( |&lt; )</td><td>one or many</td><td>1..*</td></tr>
<tr><td>circle + crow's foot ( o&lt; )</td><td>zero or many</td><td>*</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> read the symbol <em>next to the entity it describes</em>. "Recruiter ‖——o&lt; Post" = one recruiter has zero or many posts; each post has exactly one recruiter.</p>
<div class="pitfall co-tieu-de"><strong>The auto-generated diagram is not an ERD.</strong> A screenshot of SQL Server's or MySQL Workbench's diagram (as the G5 RDS uses) shows the physical schema. It is fine for "Database Schema", but SRS §1.5 expects a readable conceptual ERD with named relationships.</div>`,
  `<h2>📐 ERD — ba mức và ký hiệu crow's-foot</h2>
<p class="nhan">Ba mức của cùng một mô hình</p>
<table>
<thead><tr><th>Mức</th><th>Thể hiện</th><th>Nằm ở đâu trong tài liệu</th></tr></thead>
<tbody>
<tr><td><strong>Conceptual</strong></td><td>Chỉ thực thể và quan hệ, có bội số</td><td>SRS Template1 §1.5 "Entity Relationship Diagram" + bảng mô tả thực thể (#, Entity, Description)</td></tr>
<tr><td><strong>Logical</strong></td><td>Thuộc tính, PK (gạch chân), FK (nghiêng), bảng liên kết</td><td>Ký hiệu quan hệ của bộ slide này</td></tr>
<tr><td><strong>Physical</strong></td><td>Bảng thật, kiểu, NULL / NOT NULL, UNIQUE, index</td><td>RDS "Database Design" / SDS Template2 §1.3 + script SQL</td></tr>
</tbody>
</table>
<p class="nhan">Ký hiệu crow's-foot (mẫu SRS yêu cầu ký hiệu này)</p>
<table>
<thead><tr><th>Ký hiệu ở đầu đường nối</th><th>Nghĩa</th><th>Bội số UML</th></tr></thead>
<tbody>
<tr><td>vạch + vạch ( ‖ )</td><td>đúng một</td><td>1</td></tr>
<tr><td>vòng + vạch ( o| )</td><td>không hoặc một</td><td>0..1</td></tr>
<tr><td>vạch + chân chim ( |&lt; )</td><td>một hoặc nhiều</td><td>1..*</td></tr>
<tr><td>vòng + chân chim ( o&lt; )</td><td>không hoặc nhiều</td><td>*</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đọc ký hiệu <em>nằm sát thực thể mà nó mô tả</em>. "Recruiter ‖——o&lt; Post" = một recruiter có không hoặc nhiều post; mỗi post có đúng một recruiter.</p>
<div class="pitfall co-tieu-de"><strong>Sơ đồ tự sinh không phải là ERD.</strong> Ảnh chụp diagram của SQL Server hay MySQL Workbench (như RDS của G5) là schema vật lý. Dùng cho mục "Database Schema" thì được, nhưng SRS §1.5 cần một ERD conceptual dễ đọc, có tên quan hệ.</div>`),
  bi(`<h2>🧹 Normalisation — up to 3NF, with real G5 examples</h2>
<p>The deck assumes your entity classes are already clean. If they are not, the mapping rules faithfully copy the mess into tables. Check each table against three normal forms.</p>
<ol>
<li><strong>1NF — atomic values, no repeating groups.</strong> G5's <code>Post.skill nvarchar(50)</code> stores skills as free text (e.g. "Java, SQL") while a proper <code>Skills</code> table exists for freelancers. You cannot search "posts that need Java" reliably. Fix: a <code>post_skill (post_id, skill_id)</code> associative table.</li>
<li><strong>2NF — no partial dependency on part of a composite key.</strong> In <code>JobApply (<u>freelancer_id, post_id</u>, post_title, status)</code>, <code>post_title</code> depends on <code>post_id</code> alone. Fix: drop it; JOIN to Post.</li>
<li><strong>3NF — no transitive dependency (non-key → non-key).</strong> G5 keeps <code>email</code> in <code>User</code> and again <code>email_contact</code> in <code>Freelancer</code>/<code>Recruiter</code>, plus <code>email</code>, <code>phone</code> in <code>Admin</code>. Two copies drift apart. Keep the login e-mail once in User; keep a separate contact e-mail only if the requirement really says so.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> "The key, the whole key, and nothing but the key" — 1NF, 2NF, 3NF.</p>
<p class="ghi-chu">Deliberate denormalisation (e.g. caching <code>apply_count</code> on Post) is allowed only with a reason written in the RDS and code that keeps it in sync.</p>`,
  `<h2>🧹 Chuẩn hoá — tới 3NF, với ví dụ thật từ G5</h2>
<p>Bộ slide mặc định entity class của bạn đã sạch. Nếu chưa, các quy tắc ánh xạ sẽ chép nguyên sự lộn xộn vào bảng. Hãy soát từng bảng theo ba dạng chuẩn.</p>
<ol>
<li><strong>1NF — giá trị nguyên tử, không nhóm lặp.</strong> <code>Post.skill nvarchar(50)</code> của G5 lưu kỹ năng dạng chữ tự do (ví dụ "Java, SQL") trong khi đã có bảng <code>Skills</code> cho freelancer. Không thể tìm "các bài cần Java" một cách tin cậy. Sửa: thêm bảng liên kết <code>post_skill (post_id, skill_id)</code>.</li>
<li><strong>2NF — không phụ thuộc bộ phận vào một phần của khoá ghép.</strong> Trong <code>JobApply (<u>freelancer_id, post_id</u>, post_title, status)</code>, <code>post_title</code> chỉ phụ thuộc <code>post_id</code>. Sửa: bỏ cột đó; JOIN sang Post.</li>
<li><strong>3NF — không phụ thuộc bắc cầu (không khoá → không khoá).</strong> G5 giữ <code>email</code> trong <code>User</code> và lại có <code>email_contact</code> trong <code>Freelancer</code>/<code>Recruiter</code>, cùng <code>email</code>, <code>phone</code> trong <code>Admin</code>. Hai bản sao sẽ lệch nhau. Giữ e-mail đăng nhập một lần trong User; chỉ thêm e-mail liên hệ riêng nếu yêu cầu thật sự nói vậy.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "Theo khoá, theo trọn khoá, và chỉ theo khoá" — 1NF, 2NF, 3NF.</p>
<p class="ghi-chu">Phi chuẩn hoá có chủ đích (ví dụ lưu sẵn <code>apply_count</code> trong Post) chỉ được phép khi có lý do ghi trong RDS và có code giữ nó đồng bộ.</p>`),
  bi(`<h2>📝 The table description — field by field (SDS §1.3 / RDS "Database Design")</h2>
<p>Template2 (SDS) asks, for every table: a short description, then one row per field with the flags <strong>PK</strong> (primary key), <strong>FK</strong> (foreign key), <strong>UN</strong> (unique), <strong>NN</strong> (not null). A filled example for <code>post</code>:</p>
<table>
<thead><tr><th>#</th><th>Field</th><th>Type</th><th>PK</th><th>FK</th><th>UN</th><th>NN</th><th>Description</th></tr></thead>
<tbody>
<tr><td>1</td><td>post_id</td><td>INT AUTO_INCREMENT</td><td>x</td><td></td><td>x</td><td>x</td><td>Surrogate id</td></tr>
<tr><td>2</td><td>recruiter_id</td><td>INT</td><td></td><td>x</td><td></td><td>x</td><td>Owner of the post → recruiter.recruiter_id</td></tr>
<tr><td>3</td><td>category_id</td><td>INT</td><td></td><td>x</td><td></td><td>x</td><td>→ category.category_id</td></tr>
<tr><td>4</td><td>title</td><td>VARCHAR(150)</td><td></td><td></td><td></td><td>x</td><td>Shown on the job list screen</td></tr>
<tr><td>5</td><td>budget</td><td>DECIMAL(12,2)</td><td></td><td></td><td></td><td></td><td>VND, CHECK ≥ 0; NULL = negotiable</td></tr>
<tr><td>6</td><td>expires_at</td><td>DATE</td><td></td><td></td><td></td><td>x</td><td>CHECK ≥ posted_at</td></tr>
<tr><td>7</td><td>status</td><td>ENUM('DRAFT','PENDING','APPROVED','REJECTED','CLOSED')</td><td></td><td></td><td></td><td>x</td><td>Moderation state; default PENDING</td></tr>
</tbody>
</table>
<p class="nhan">What makes the description worth marks</p>
<ul>
<li><strong>Description column says the business meaning</strong> — units, allowed values, who writes it</li>
<li><strong>Every status column lists its values</strong> — and matches the state chart in SDS §1.4</li>
<li><strong>The table names match the SQL script and the code</strong> — reviewers compare them</li>
</ul>`,
  `<h2>📝 Mô tả bảng — từng trường (SDS §1.3 / RDS "Database Design")</h2>
<p>Template2 (SDS) yêu cầu, với mỗi bảng: một mô tả ngắn, rồi mỗi trường một dòng với các cờ <strong>PK</strong> (khoá chính), <strong>FK</strong> (khoá ngoại), <strong>UN</strong> (duy nhất), <strong>NN</strong> (không null). Ví dụ đã điền cho <code>post</code>:</p>
<table>
<thead><tr><th>#</th><th>Trường</th><th>Kiểu</th><th>PK</th><th>FK</th><th>UN</th><th>NN</th><th>Mô tả</th></tr></thead>
<tbody>
<tr><td>1</td><td>post_id</td><td>INT AUTO_INCREMENT</td><td>x</td><td></td><td>x</td><td>x</td><td>Id thay thế</td></tr>
<tr><td>2</td><td>recruiter_id</td><td>INT</td><td></td><td>x</td><td></td><td>x</td><td>Chủ bài đăng → recruiter.recruiter_id</td></tr>
<tr><td>3</td><td>category_id</td><td>INT</td><td></td><td>x</td><td></td><td>x</td><td>→ category.category_id</td></tr>
<tr><td>4</td><td>title</td><td>VARCHAR(150)</td><td></td><td></td><td></td><td>x</td><td>Hiện ở màn danh sách việc</td></tr>
<tr><td>5</td><td>budget</td><td>DECIMAL(12,2)</td><td></td><td></td><td></td><td></td><td>VND, CHECK ≥ 0; NULL = thoả thuận</td></tr>
<tr><td>6</td><td>expires_at</td><td>DATE</td><td></td><td></td><td></td><td>x</td><td>CHECK ≥ posted_at</td></tr>
<tr><td>7</td><td>status</td><td>ENUM('DRAFT','PENDING','APPROVED','REJECTED','CLOSED')</td><td></td><td></td><td></td><td>x</td><td>Trạng thái duyệt; mặc định PENDING</td></tr>
</tbody>
</table>
<p class="nhan">Điều làm phần mô tả được điểm</p>
<ul>
<li><strong>Cột mô tả nói nghĩa nghiệp vụ</strong> — đơn vị, giá trị cho phép, ai ghi</li>
<li><strong>Mọi cột trạng thái liệt kê giá trị</strong> — và khớp state chart ở SDS §1.4</li>
<li><strong>Tên bảng khớp script SQL và code</strong> — người chấm sẽ đối chiếu</li>
</ul>`),
  bi(`<h2>✅ Checklist before you submit an iteration</h2>
<ol>
<li>Every entity in the ERD is used by at least one use case of this or a previous iteration.</li>
<li>Every table has a PK; every association column is a declared FK.</li>
<li>Each M:N association is an associative table with a UNIQUE (or composite PK) pair.</li>
<li>Names follow one convention (e.g. <code>snake_case</code>, singular, <code>&lt;table&gt;_id</code>) — no typos.</li>
<li>Money is DECIMAL, dates are DATE/DATETIME, statuses are ENUM or a lookup table — not free text.</li>
<li>The RDS table descriptions, the SQL script in the GitLab tag and the Java model classes agree.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Mistakes that lose marks in the final presentation (design = 20 %).</strong> "Why does this table have no primary key?" · "Why is the password column 50 characters of plain text?" · "Your ERD shows 12 tables, your script creates 22." · "Where is the FK between Post and Category?" Each one is a design question you cannot answer by opening the code.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Schema migrations.</strong> Professional teams never edit the database by hand. Each change is a numbered script (<code>V1__init.sql</code>, <code>V2__add_post_skill.sql</code>) applied in order by a tool such as <em>Flyway</em> or <em>Liquibase</em>, so every teammate and the demo machine have the same schema. In SWP391 you can imitate it with one folder <code>db/</code> in the repo and one script per iteration. <em>Outside the syllabus because the guides only ask for "DB scripts" in the iteration package.</em></div>`,
  `<h2>✅ Checklist trước khi nộp một iteration</h2>
<ol>
<li>Mọi thực thể trong ERD được ít nhất một use case của iteration này hoặc trước đó dùng tới.</li>
<li>Mọi bảng có PK; mọi cột quan hệ là FK đã khai báo.</li>
<li>Mỗi quan hệ M:N là một bảng liên kết có cặp UNIQUE (hoặc PK ghép).</li>
<li>Tên theo một quy ước (ví dụ <code>snake_case</code>, số ít, <code>&lt;bảng&gt;_id</code>) — không lỗi chính tả.</li>
<li>Tiền là DECIMAL, ngày là DATE/DATETIME, trạng thái là ENUM hoặc bảng tra cứu — không phải chữ tự do.</li>
<li>Mô tả bảng trong RDS, script SQL trong tag GitLab và các class model Java khớp nhau.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Lỗi làm mất điểm ở buổi thuyết trình cuối (design = 20 %).</strong> "Sao bảng này không có khoá chính?" · "Sao cột password là 50 ký tự chữ thường?" · "ERD của em có 12 bảng, script tạo 22 bảng." · "FK giữa Post và Category đâu?" Đều là câu hỏi thiết kế, không trả lời được bằng cách mở code.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Schema migration.</strong> Nhóm chuyên nghiệp không bao giờ sửa CSDL bằng tay. Mỗi thay đổi là một script đánh số (<code>V1__init.sql</code>, <code>V2__add_post_skill.sql</code>) được công cụ như <em>Flyway</em> hay <em>Liquibase</em> chạy theo thứ tự, nên mọi thành viên và máy demo có cùng schema. Ở SWP391 bạn có thể bắt chước bằng một thư mục <code>db/</code> trong repo và một script cho mỗi iteration. <em>Ngoài giáo trình vì hướng dẫn chỉ yêu cầu "DB scripts" trong gói nộp iteration.</em></div>`),
  books([
    ['gomaa', 'Ch. 7 Static Modeling (entity classes, associations) and the relational database design section the deck cites as "Chapter 15"', 'Ch. 7 Static Modeling (entity class, association) và phần thiết kế CSDL quan hệ mà slide ghi là "Chapter 15"'],
    ['sommerville', 'Ch. 5 System Modeling — structural models (class diagrams)', 'Ch. 5 System Modeling — mô hình cấu trúc (class diagram)'],
    ['fowler', 'Ch. 3 Class Diagrams: The Essentials (multiplicity, associations)', 'Ch. 3 Class Diagrams: The Essentials (bội số, association)'],
  ]),
].join('\n');

/* ═════════════ LESSON 3.7 — association & aggregation mapping (g-db 9–17) ═════════════ */
const L2_INTRO = bi(`<span class="eyebrow">Chapter 3 · Lesson 3.7 · Database Design slides 9–17</span>
<h2>Mapping associations — 1:1, 0..1, 1:N, association classes and whole/part hierarchies</h2>
<p class="lead">Once every entity class has a table and a primary key, the lines of the class diagram must become columns or tables. The deck gives one rule per kind of line. Learn the rules with the deck's banking and college examples, then apply them to the Job IT for Freelancer tables — including the two places where the G5 sample got it half right.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li><strong>Map</strong> a 1:1 and a 0..1 association with a foreign key on the correct side</li>
<li><strong>Map</strong> a 1:N association by putting the FK in the "many" table</li>
<li><strong>Map</strong> an association class (M:N with attributes) to an associative table with a concatenated key</li>
<li><strong>Map</strong> aggregation / composition, choosing when the whole's key becomes part of the part's key</li>
<li><strong>Write</strong> the MySQL 8 DDL, including UNIQUE and ON DELETE rules, for each case</li>
</ul></div>
<h3>The essentials in one screen</h3>
<table>
<thead><tr><th>Association</th><th>Where the key goes</th><th>G5 example</th></tr></thead>
<tbody>
<tr><td>1 — 1</td><td>FK in either table (choose the one created later) + UNIQUE</td><td>User — Recruiter</td></tr>
<tr><td>1 — 0..1</td><td>FK in the <em>optional</em> table + UNIQUE</td><td>User — Freelancer profile</td></tr>
<tr><td>1 — N</td><td>FK in the "many" table</td><td>Recruiter — Post</td></tr>
<tr><td>M — N (with attributes)</td><td>Associative table, PK = both FKs</td><td>Freelancer — Post via JobApply</td></tr>
<tr><td>Whole — part 1:1</td><td>Part's PK = whole's PK</td><td>Freelancer — (profile settings)</td></tr>
<tr><td>Whole — part 1:N</td><td>Whole's PK is part of the part's PK, or just an FK</td><td>Freelancer — Education, Experience</td></tr>
</tbody>
</table>`,
  `<span class="eyebrow">Chương 3 · Bài 3.7 · Database Design slide 9–17</span>
<h2>Ánh xạ association — 1:1, 0..1, 1:N, association class và cây tổng thể/bộ phận</h2>
<p class="lead">Khi mỗi entity class đã có bảng và khoá chính, các đường nối trong class diagram phải trở thành cột hoặc bảng. Bộ slide cho một quy tắc cho mỗi loại đường nối. Học quy tắc qua ví dụ ngân hàng và trường đại học của slide, rồi áp vào các bảng của Job IT for Freelancer — gồm cả hai chỗ mẫu G5 mới làm đúng một nửa.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li><strong>Ánh xạ</strong> quan hệ 1:1 và 0..1 bằng khoá ngoại đặt đúng phía</li>
<li><strong>Ánh xạ</strong> quan hệ 1:N bằng cách đặt FK ở bảng phía "nhiều"</li>
<li><strong>Ánh xạ</strong> association class (M:N có thuộc tính) thành bảng liên kết với khoá ghép</li>
<li><strong>Ánh xạ</strong> aggregation / composition, biết khi nào khoá của tổng thể thành một phần khoá của bộ phận</li>
<li><strong>Viết</strong> DDL MySQL 8, gồm UNIQUE và quy tắc ON DELETE, cho từng trường hợp</li>
</ul></div>
<h3>Cốt lõi trong một màn hình</h3>
<table>
<thead><tr><th>Association</th><th>Khoá đặt ở đâu</th><th>Ví dụ G5</th></tr></thead>
<tbody>
<tr><td>1 — 1</td><td>FK ở một trong hai bảng (chọn bảng được tạo sau) + UNIQUE</td><td>User — Recruiter</td></tr>
<tr><td>1 — 0..1</td><td>FK ở bảng <em>tuỳ chọn</em> + UNIQUE</td><td>User — hồ sơ Freelancer</td></tr>
<tr><td>1 — N</td><td>FK ở bảng phía "nhiều"</td><td>Recruiter — Post</td></tr>
<tr><td>M — N (có thuộc tính)</td><td>Bảng liên kết, PK = cả hai FK</td><td>Freelancer — Post qua JobApply</td></tr>
<tr><td>Tổng thể — bộ phận 1:1</td><td>PK của bộ phận = PK của tổng thể</td><td>Freelancer — (cài đặt hồ sơ)</td></tr>
<tr><td>Tổng thể — bộ phận 1:N</td><td>PK của tổng thể là một phần PK của bộ phận, hoặc chỉ là FK</td><td>Freelancer — Education, Experience</td></tr>
</tbody>
</table>`);

const L2_ROWS = [
  [9, 'Association mapping — one-to-one or zero-or-one (1/2)',
    `<p class="y-chinh">🎯 A 1:1 association becomes a foreign key in one of the two tables; with 0..1 the FK goes into the optional side.</p>
<p class="nhan">The two rules</p>
<ul>
<li><strong>One-to-one</strong> → foreign key in <em>one</em> of the relations (either side works)</li>
<li><strong>Zero-or-one</strong> → foreign key in the <em>optional</em> relation — the one that may not exist</li>
</ul>
<p class="nhan">Read the picture — Customer Owns Debit Card</p>
<ul>
<li><strong>Customer</strong> end = 1 — every card belongs to exactly one customer</li>
<li><strong>DebitCard</strong> end = 0..1 — a customer has no card or one card</li>
<li><strong>So</strong> DebitCard is the optional side → it receives <code>customerId</code></li>
</ul>
<p class="nhan">Why not put the FK in Customer?</p>
<p>Customers without a card would need <code>cardId = NULL</code>. The rule keeps NULLs out of the mandatory table and matches the order of creation: the customer exists first, the card is added later.</p>`,
    `<p class="y-chinh">🎯 Quan hệ 1:1 thành khoá ngoại ở một trong hai bảng; với 0..1 thì FK nằm ở phía tuỳ chọn.</p>
<p class="nhan">Hai quy tắc</p>
<ul>
<li><strong>Một-một</strong> → khoá ngoại ở <em>một</em> trong hai relation (phía nào cũng được)</li>
<li><strong>Không-hoặc-một</strong> → khoá ngoại ở relation <em>tuỳ chọn</em> — bên có thể không tồn tại</li>
</ul>
<p class="nhan">Đọc hình — Customer Owns Debit Card</p>
<ul>
<li><strong>Đầu Customer</strong> = 1 — mỗi thẻ thuộc đúng một khách hàng</li>
<li><strong>Đầu DebitCard</strong> = 0..1 — một khách hàng có không hoặc một thẻ</li>
<li><strong>Vậy</strong> DebitCard là phía tuỳ chọn → nó nhận <code>customerId</code></li>
</ul>
<p class="nhan">Sao không đặt FK ở Customer?</p>
<p>Khách chưa có thẻ sẽ phải để <code>cardId = NULL</code>. Quy tắc giữ NULL khỏi bảng bắt buộc và khớp thứ tự tạo: khách hàng có trước, thẻ thêm sau.</p>`],
  [10, 'Association mapping — one-to-one or zero-or-one (2/2)',
    `<p class="y-chinh">🎯 The result: <code>Debit Card (<u>Card Id</u>, PIN, Expiration date, Status, <em>Customer Id</em>)</code>.</p>
<ol>
<li><strong>Customer Id</strong> — chosen as PK of Customer</li>
<li><strong>Card Id</strong> — chosen as PK of Debit Card</li>
<li><strong>Customer Id</strong> — copied into Debit Card as FK; it <em>is</em> the association</li>
</ol>
<p class="nhan">The detail the slide leaves out</p>
<p>An FK alone allows many cards per customer — that is 1:N, not 0..1. To really enforce "at most one card", add <code>UNIQUE</code> on the FK column.</p>
<pre>CREATE TABLE debit_card (
  card_id     INT PRIMARY KEY AUTO_INCREMENT,
  pin_hash    VARCHAR(100) NOT NULL,
  expires_on  DATE NOT NULL,
  status      TINYINT NOT NULL,
  customer_id INT NOT NULL UNIQUE,            -- UNIQUE = "0..1", without it = "many"
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);</pre>
<p class="nhan">Same pattern in G5</p>
<p><code>Freelancer.userID</code>, <code>Recruiter.userID</code> and <code>Admin.userID</code> are FKs to User, each with a UNIQUE index (<code>IX_Freelancer</code> …) — exactly this rule. ✅ One of the things the sample does right.</p>`,
    `<p class="y-chinh">🎯 Kết quả: <code>Debit Card (<u>Card Id</u>, PIN, Expiration date, Status, <em>Customer Id</em>)</code>.</p>
<ol>
<li><strong>Customer Id</strong> — được chọn làm PK của Customer</li>
<li><strong>Card Id</strong> — được chọn làm PK của Debit Card</li>
<li><strong>Customer Id</strong> — chép sang Debit Card làm FK; chính nó <em>là</em> quan hệ</li>
</ol>
<p class="nhan">Chi tiết slide bỏ qua</p>
<p>Chỉ có FK thì một khách vẫn có nhiều thẻ — đó là 1:N, không phải 0..1. Muốn thật sự ép "tối đa một thẻ", thêm <code>UNIQUE</code> trên cột FK.</p>
<pre>CREATE TABLE debit_card (
  card_id     INT PRIMARY KEY AUTO_INCREMENT,
  pin_hash    VARCHAR(100) NOT NULL,
  expires_on  DATE NOT NULL,
  status      TINYINT NOT NULL,
  customer_id INT NOT NULL UNIQUE,            -- UNIQUE = "0..1", không có = "nhiều"
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);</pre>
<p class="nhan">Cùng mẫu trong G5</p>
<p><code>Freelancer.userID</code>, <code>Recruiter.userID</code> và <code>Admin.userID</code> là FK tới User, mỗi cột có index UNIQUE (<code>IX_Freelancer</code> …) — đúng quy tắc này. ✅ Một điểm mẫu làm đúng.</p>`],
  [11, 'Association mapping — one-to-many (1/2)',
    `<p class="y-chinh">🎯 One-to-many: the primary key of the "one" side becomes a foreign key in the "many" side.</p>
<p class="nhan">Read the example — Customer Owns Account</p>
<ul>
<li><strong>Customer (1)</strong> — Customer Name, Customer Id, Customer Address</li>
<li><strong>Account (many)</strong> — Account number, Balance</li>
<li><strong>Rule</strong> — Customer's PK goes into Account</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> "the foot carries the key" — in crow's-foot notation the FK always sits at the end with the crow's foot.</p>
<div class="pitfall co-tieu-de"><strong>Putting the list on the "one" side.</strong> A column <code>accountNumbers = '1234,5678'</code> in Customer breaks 1NF and cannot have an FK. There is no "list" column in a relational table — the many side points back.</div>`,
    `<p class="y-chinh">🎯 Một-nhiều: khoá chính của phía "một" thành khoá ngoại ở phía "nhiều".</p>
<p class="nhan">Đọc ví dụ — Customer Owns Account</p>
<ul>
<li><strong>Customer (1)</strong> — Customer Name, Customer Id, Customer Address</li>
<li><strong>Account (nhiều)</strong> — Account number, Balance</li>
<li><strong>Quy tắc</strong> — PK của Customer đi vào Account</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "chân chim cõng khoá" — trong ký hiệu crow's-foot, FK luôn nằm ở đầu có chân chim.</p>
<div class="pitfall co-tieu-de"><strong>Để danh sách ở phía "một".</strong> Cột <code>accountNumbers = '1234,5678'</code> trong Customer vi phạm 1NF và không thể có FK. Bảng quan hệ không có cột "danh sách" — phía nhiều trỏ ngược về.</div>`],
  [12, 'Association mapping — one-to-many (2/2)',
    `<p class="y-chinh">🎯 The result: <code>Account (<u>Account Number</u>, Balance, <em>Customer Id</em>)</code>.</p>
<ol>
<li><strong>Customer Id</strong> — PK of Customer</li>
<li><strong>Account Number</strong> — PK of Account</li>
<li><strong>Customer Id</strong> — FK in Account (no UNIQUE this time: many accounts may share it)</li>
</ol>
<p class="nhan">Compare with slide 10</p>
<ul>
<li><strong>0..1</strong> — FK + <code>UNIQUE</code></li>
<li><strong>1:N</strong> — FK only (plus a normal index for fast JOINs)</li>
</ul>
<p class="nhan">G5 — the 1:N associations in the sample</p>
<ul>
<li><strong>Recruiter → Post</strong> (<code>Post.recruiterID</code>), <strong>Category → Post</strong> (<code>caID</code>), <strong>JobType / Duration → Post</strong></li>
<li><strong>Freelancer → Education, Experience, Skills</strong>; <strong>Admin → Blogs</strong>; <strong>Role → User</strong></li>
</ul>
<p class="ghi-chu">Mandatory or optional "one" side? <code>recruiter_id NOT NULL</code> = every post must have an owner (1); <code>NULL</code> allowed = 0..1. Decide it from the use case, and write it in the table description.</p>`,
    `<p class="y-chinh">🎯 Kết quả: <code>Account (<u>Account Number</u>, Balance, <em>Customer Id</em>)</code>.</p>
<ol>
<li><strong>Customer Id</strong> — PK của Customer</li>
<li><strong>Account Number</strong> — PK của Account</li>
<li><strong>Customer Id</strong> — FK trong Account (lần này không UNIQUE: nhiều tài khoản có thể cùng giá trị)</li>
</ol>
<p class="nhan">So với slide 10</p>
<ul>
<li><strong>0..1</strong> — FK + <code>UNIQUE</code></li>
<li><strong>1:N</strong> — chỉ FK (cộng một index thường để JOIN nhanh)</li>
</ul>
<p class="nhan">G5 — các quan hệ 1:N trong mẫu</p>
<ul>
<li><strong>Recruiter → Post</strong> (<code>Post.recruiterID</code>), <strong>Category → Post</strong> (<code>caID</code>), <strong>JobType / Duration → Post</strong></li>
<li><strong>Freelancer → Education, Experience, Skills</strong>; <strong>Admin → Blogs</strong>; <strong>Role → User</strong></li>
</ul>
<p class="ghi-chu">Phía "một" bắt buộc hay tuỳ chọn? <code>recruiter_id NOT NULL</code> = mọi bài đăng phải có chủ (1); cho phép <code>NULL</code> = 0..1. Quyết định dựa vào use case, và ghi vào mô tả bảng.</p>`],
  [13, 'Association mapping — static model association class (1/2)',
    `<p class="y-chinh">🎯 An association class (usually on an M:N association) becomes an associative table whose PK concatenates the PKs of the participants.</p>
<ol>
<li><strong>Association class</strong> — models the association between two or more classes; typically many-to-many; holds data that belongs to the <em>pair</em>, not to either side</li>
<li><strong>Mapping</strong> — association class → <em>associative relation</em></li>
<li><strong>Associative relation</strong> — a table that represents the association; its PK is a <strong>concatenated key</strong> formed from the PK of each participating relation</li>
</ol>
<p class="nhan">How to recognise one in your project</p>
<ul>
<li><strong>Question</strong> — "Is this value about A, about B, or about A-and-B together?"</li>
<li><strong>Example</strong> — the status of an application is not a property of the freelancer, nor of the post: it belongs to "this freelancer applying to this post"</li>
</ul>`,
    `<p class="y-chinh">🎯 Association class (thường gắn trên quan hệ M:N) thành bảng liên kết có PK ghép từ PK của các bên tham gia.</p>
<ol>
<li><strong>Association class</strong> — mô hình hoá quan hệ giữa hai hay nhiều class; thường là nhiều-nhiều; chứa dữ liệu thuộc về <em>cặp</em>, không thuộc riêng bên nào</li>
<li><strong>Ánh xạ</strong> — association class → <em>associative relation</em> (bảng liên kết)</li>
<li><strong>Bảng liên kết</strong> — bảng biểu diễn quan hệ; PK là <strong>khoá ghép</strong> (concatenated key) tạo từ PK của từng relation tham gia</li>
</ol>
<p class="nhan">Cách nhận ra trong đồ án của bạn</p>
<ul>
<li><strong>Câu hỏi</strong> — "Giá trị này nói về A, về B, hay về A-cùng-B?"</li>
<li><strong>Ví dụ</strong> — trạng thái đơn ứng tuyển không phải thuộc tính của freelancer, cũng không của bài đăng: nó thuộc về "freelancer này ứng tuyển bài này"</li>
</ul>`],
  [14, 'Association mapping — static model association class (2/2): Hours',
    `<p class="y-chinh">🎯 Example: an employee works on many projects, a project has many employees, and <em>Hours Worked</em> belongs to the pair.</p>
<p class="nhan">Read the picture</p>
<ul>
<li><strong>Employee * — * Project</strong> — a many-to-many association</li>
<li><strong>Hours</strong> — the association class hanging on the line by a dashed link; one attribute <code>hoursWorked: Real</code></li>
</ul>
<p class="nhan">Static model</p>
<ul>
<li><code>Project (Project id, Project name)</code></li>
<li><code>Employee (Employee id, Employee name, Employee address)</code></li>
<li><code>Hours (Hours Worked)</code> — no id of its own in the static model</li>
</ul>
<p class="nhan">Same shape in G5</p>
<ul>
<li><strong>JobApply</strong> — Freelancer * — * Post, with <code>status</code>, <code>dateApply</code>, <code>Resume</code></li>
<li><strong>Skills</strong> — Freelancer * — * Skill_Set, with <code>level</code></li>
<li><strong>FreelancerFavorites</strong>, <strong>Mark</strong> — M:N with no attributes (a plain link table)</li>
</ul>`,
    `<p class="y-chinh">🎯 Ví dụ: một nhân viên làm nhiều dự án, một dự án có nhiều nhân viên, và <em>Hours Worked</em> thuộc về cặp đó.</p>
<p class="nhan">Đọc hình</p>
<ul>
<li><strong>Employee * — * Project</strong> — quan hệ nhiều-nhiều</li>
<li><strong>Hours</strong> — association class treo trên đường nối bằng nét đứt; một thuộc tính <code>hoursWorked: Real</code></li>
</ul>
<p class="nhan">Static model</p>
<ul>
<li><code>Project (Project id, Project name)</code></li>
<li><code>Employee (Employee id, Employee name, Employee address)</code></li>
<li><code>Hours (Hours Worked)</code> — trong static model không có id riêng</li>
</ul>
<p class="nhan">Cùng dạng trong G5</p>
<ul>
<li><strong>JobApply</strong> — Freelancer * — * Post, có <code>status</code>, <code>dateApply</code>, <code>Resume</code></li>
<li><strong>Skills</strong> — Freelancer * — * Skill_Set, có <code>level</code></li>
<li><strong>FreelancerFavorites</strong>, <strong>Mark</strong> — M:N không có thuộc tính (bảng nối thuần)</li>
</ul>`],
  [15, 'Association mapping — the associative relation Hours',
    `<p class="y-chinh">🎯 Result: <code>Hours (<u><em>Project id</em></u>, <u><em>Employee id</em></u>, Hours worked)</code> — the two ids are both the PK and FKs.</p>
<ol>
<li><strong>Project, Employee</strong> — unchanged, each with its own PK</li>
<li><strong>Project id + Employee id</strong> — form the concatenated PK of Hours</li>
<li><strong>Also foreign keys</strong> — each part points back to its table (underlined <em>and</em> italic on the slide)</li>
</ol>
<p class="nhan">MySQL 8 — JobApply the "deck way"</p>
<pre>CREATE TABLE job_apply (
  freelancer_id INT NOT NULL,
  post_id       INT NOT NULL,
  cv_url        VARCHAR(500) NOT NULL,
  applied_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status        ENUM('PENDING','ACCEPTED','REJECTED') NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (freelancer_id, post_id),                 -- concatenated key
  FOREIGN KEY (freelancer_id) REFERENCES freelancer(freelancer_id),
  FOREIGN KEY (post_id)       REFERENCES post(post_id)
);</pre>
<p class="nhan">Surrogate id variant (what G5 did — and what is missing)</p>
<p>G5 gives JobApply its own <code>applyID</code> PK. That is acceptable (simpler URLs, simpler Java), <strong>but only with <code>UNIQUE (freelanceID, postID)</code></strong>. G5 has no such constraint, so the same freelancer can apply to the same post twice — the same gap exists in <code>FreelancerFavorites</code> and <code>Skills</code>.</p>`,
    `<p class="y-chinh">🎯 Kết quả: <code>Hours (<u><em>Project id</em></u>, <u><em>Employee id</em></u>, Hours worked)</code> — hai id vừa là PK vừa là FK.</p>
<ol>
<li><strong>Project, Employee</strong> — giữ nguyên, mỗi bảng có PK riêng</li>
<li><strong>Project id + Employee id</strong> — tạo PK ghép của Hours</li>
<li><strong>Đồng thời là khoá ngoại</strong> — mỗi phần trỏ về bảng của nó (trên slide vừa gạch chân <em>vừa</em> in nghiêng)</li>
</ol>
<p class="nhan">MySQL 8 — JobApply "theo đúng slide"</p>
<pre>CREATE TABLE job_apply (
  freelancer_id INT NOT NULL,
  post_id       INT NOT NULL,
  cv_url        VARCHAR(500) NOT NULL,
  applied_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status        ENUM('PENDING','ACCEPTED','REJECTED') NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (freelancer_id, post_id),                 -- khoá ghép
  FOREIGN KEY (freelancer_id) REFERENCES freelancer(freelancer_id),
  FOREIGN KEY (post_id)       REFERENCES post(post_id)
);</pre>
<p class="nhan">Biến thể id thay thế (G5 làm — và còn thiếu gì)</p>
<p>G5 cho JobApply một PK riêng <code>applyID</code>. Chấp nhận được (URL gọn, code Java gọn), <strong>nhưng chỉ khi có <code>UNIQUE (freelanceID, postID)</code></strong>. G5 không có ràng buộc đó, nên một freelancer có thể ứng tuyển cùng một bài hai lần — lỗ hổng tương tự ở <code>FreelancerFavorites</code> và <code>Skills</code>.</p>`],
  [16, 'Aggregation / composition hierarchy — the rules',
    `<p class="y-chinh">🎯 Whole/part: the whole and each part get their own table; the whole's PK goes into each part — as part of its PK or as a plain FK.</p>
<p class="nhan">Mapping</p>
<ul>
<li><strong>Aggregate / composite (whole) class</strong> → a relation</li>
<li><strong>Each part class</strong> → a relation</li>
</ul>
<p class="nhan">The whole's PK inside the part is…</p>
<ol>
<li><strong>All of the part's PK</strong> — for a <em>1-1</em> aggregation (one part per whole)</li>
<li><strong>Part of the part's PK</strong> — for a <em>1-n</em> aggregation (key = whole id + a local name/number)</li>
<li><strong>Just a foreign key</strong> — if it is not needed to identify the part uniquely (the part has its own id)</li>
</ol>
<p class="nhan">Aggregation vs composition, in one line each</p>
<ul>
<li><strong>Composition</strong> (filled diamond) — the part cannot live without the whole → <code>ON DELETE CASCADE</code></li>
<li><strong>Aggregation</strong> (hollow diamond) — the part may survive → <code>ON DELETE SET NULL</code> or <code>RESTRICT</code></li>
</ul>`,
    `<p class="y-chinh">🎯 Tổng thể/bộ phận: tổng thể và mỗi bộ phận có bảng riêng; PK của tổng thể đi vào mỗi bộ phận — làm một phần PK hoặc chỉ là FK thường.</p>
<p class="nhan">Ánh xạ</p>
<ul>
<li><strong>Class tổng thể (aggregate / composite)</strong> → một relation</li>
<li><strong>Mỗi class bộ phận</strong> → một relation</li>
</ul>
<p class="nhan">PK của tổng thể nằm trong bộ phận dưới dạng…</p>
<ol>
<li><strong>Toàn bộ PK của bộ phận</strong> — với aggregation <em>1-1</em> (mỗi tổng thể một bộ phận)</li>
<li><strong>Một phần PK của bộ phận</strong> — với aggregation <em>1-n</em> (khoá = id tổng thể + tên/số cục bộ)</li>
<li><strong>Chỉ là khoá ngoại</strong> — nếu không cần nó để định danh bộ phận (bộ phận có id riêng)</li>
</ol>
<p class="nhan">Aggregation và composition, mỗi thứ một dòng</p>
<ul>
<li><strong>Composition</strong> (thoi đặc) — bộ phận không sống được khi mất tổng thể → <code>ON DELETE CASCADE</code></li>
<li><strong>Aggregation</strong> (thoi rỗng) — bộ phận có thể còn lại → <code>ON DELETE SET NULL</code> hoặc <code>RESTRICT</code></li>
</ul>`],
  [17, 'Aggregation / composition — the College example',
    `<p class="y-chinh">🎯 College is the whole; Admin Office (1) and Department (1..*) are parts, so both carry <code>College name</code>.</p>
<p class="nhan">Static model</p>
<ul>
<li><strong>Department IS PART OF College</strong>; <strong>Admin Office IS PART OF College</strong></li>
<li><code>College (College name)</code>, <code>Admin Office (Location)</code>, <code>Department (Department name, Location)</code></li>
</ul>
<p class="nhan">Relational design — the three rules at work</p>
<ul>
<li><code>College (<u>College name</u>)</code> — the aggregate's PK</li>
<li><code>Admin Office (<u>College name</u>, Location)</code> — 1-1 part: the <em>whole</em> PK is the part's entire PK</li>
<li><code>Department (<u>Department name</u>, College name, Location)</code> — 1-n part: Department name identifies it, College name is a plain FK (rule 3). If two colleges could both have "Mathematics", the key must become (College name, Department name) — rule 2</li>
</ul>
<p class="ghi-chu">The picture also shows Research Center (1..*) — mapped the same way as Department; the slide simply leaves it out.</p>`,
    `<p class="y-chinh">🎯 College là tổng thể; Admin Office (1) và Department (1..*) là bộ phận, nên cả hai mang <code>College name</code>.</p>
<p class="nhan">Static model</p>
<ul>
<li><strong>Department IS PART OF College</strong>; <strong>Admin Office IS PART OF College</strong></li>
<li><code>College (College name)</code>, <code>Admin Office (Location)</code>, <code>Department (Department name, Location)</code></li>
</ul>
<p class="nhan">Thiết kế quan hệ — ba quy tắc được áp dụng</p>
<ul>
<li><code>College (<u>College name</u>)</code> — PK của tổng thể</li>
<li><code>Admin Office (<u>College name</u>, Location)</code> — bộ phận 1-1: PK của <em>tổng thể</em> là toàn bộ PK của bộ phận</li>
<li><code>Department (<u>Department name</u>, College name, Location)</code> — bộ phận 1-n: Department name định danh nó, College name chỉ là FK (quy tắc 3). Nếu hai college đều có thể có "Mathematics", khoá phải thành (College name, Department name) — quy tắc 2</li>
</ul>
<p class="ghi-chu">Hình còn có Research Center (1..*) — ánh xạ giống Department; slide chỉ không nhắc tới.</p>`],
];

const L2_DEEP = [
  bi(`<h2>🛠️ Worked example — every association of the freelancer profile, as MySQL 8 DDL</h2>
<p>The G5 "View / Update profile" screens show a freelancer with educations, experiences and skills. Map each line of that part of the class diagram with the rules above.</p>
<ol>
<li><strong>User 1 — 0..1 Freelancer</strong> (a user account may or may not have a freelancer profile) → FK <code>user_id</code> in <code>freelancer</code> + <code>UNIQUE</code> (slides 9–10).</li>
<li><strong>Freelancer 1 — * Education</strong> as a composition (an education row means nothing without its owner) → FK + <code>ON DELETE CASCADE</code> (slides 16–17, rule 3).</li>
<li><strong>Degree 1 — * Education</strong> (a lookup) → FK + <code>ON DELETE RESTRICT</code>: you may not delete a degree still in use.</li>
<li><strong>Freelancer * — * Skill</strong> with attribute <code>level</code> → associative table, concatenated PK (slides 13–15).</li>
</ol>
<pre>CREATE TABLE freelancer (
  freelancer_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id       INT NOT NULL,
  first_name    VARCHAR(50) NOT NULL,
  last_name     VARCHAR(50) NOT NULL,
  CONSTRAINT uq_freelancer_user UNIQUE (user_id),                       -- 0..1
  CONSTRAINT fk_freelancer_user FOREIGN KEY (user_id) REFERENCES user_account(user_id)
);
CREATE TABLE education (
  education_id  INT PRIMARY KEY AUTO_INCREMENT,
  freelancer_id INT NOT NULL,
  degree_id     INT NOT NULL,
  school_name   VARCHAR(150) NOT NULL,
  start_date    DATE NOT NULL,
  end_date      DATE NULL,                                              -- NULL = still studying
  CONSTRAINT ck_education_dates CHECK (end_date IS NULL OR end_date &gt;= start_date),
  CONSTRAINT fk_edu_freelancer FOREIGN KEY (freelancer_id)
      REFERENCES freelancer(freelancer_id) ON DELETE CASCADE,          -- composition
  CONSTRAINT fk_edu_degree FOREIGN KEY (degree_id)
      REFERENCES degree(degree_id) ON DELETE RESTRICT                  -- lookup
);
CREATE TABLE freelancer_skill (
  freelancer_id INT NOT NULL,
  skill_id      INT NOT NULL,
  level         TINYINT NOT NULL CHECK (level BETWEEN 1 AND 5),
  PRIMARY KEY (freelancer_id, skill_id),                                -- concatenated key
  FOREIGN KEY (freelancer_id) REFERENCES freelancer(freelancer_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id)      REFERENCES skill(skill_id)
);</pre>
<p class="ghi-chu"><code>CHECK</code> constraints are enforced from MySQL 8.0.16. On older versions they are parsed and silently ignored — say which version your team uses in the RDS.</p>`,
  `<h2>🛠️ Ví dụ làm từng bước — mọi quan hệ của hồ sơ freelancer, viết thành DDL MySQL 8</h2>
<p>Màn "View / Update profile" của G5 hiển thị một freelancer cùng học vấn, kinh nghiệm và kỹ năng. Ánh xạ từng đường nối của phần class diagram đó bằng các quy tắc ở trên.</p>
<ol>
<li><strong>User 1 — 0..1 Freelancer</strong> (một tài khoản có thể có hoặc không có hồ sơ freelancer) → FK <code>user_id</code> trong <code>freelancer</code> + <code>UNIQUE</code> (slide 9–10).</li>
<li><strong>Freelancer 1 — * Education</strong> là composition (một dòng học vấn vô nghĩa khi mất chủ) → FK + <code>ON DELETE CASCADE</code> (slide 16–17, quy tắc 3).</li>
<li><strong>Degree 1 — * Education</strong> (bảng tra cứu) → FK + <code>ON DELETE RESTRICT</code>: không được xoá một bằng cấp đang được dùng.</li>
<li><strong>Freelancer * — * Skill</strong> có thuộc tính <code>level</code> → bảng liên kết, PK ghép (slide 13–15).</li>
</ol>
<pre>CREATE TABLE freelancer (
  freelancer_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id       INT NOT NULL,
  first_name    VARCHAR(50) NOT NULL,
  last_name     VARCHAR(50) NOT NULL,
  CONSTRAINT uq_freelancer_user UNIQUE (user_id),                       -- 0..1
  CONSTRAINT fk_freelancer_user FOREIGN KEY (user_id) REFERENCES user_account(user_id)
);
CREATE TABLE education (
  education_id  INT PRIMARY KEY AUTO_INCREMENT,
  freelancer_id INT NOT NULL,
  degree_id     INT NOT NULL,
  school_name   VARCHAR(150) NOT NULL,
  start_date    DATE NOT NULL,
  end_date      DATE NULL,                                              -- NULL = đang học
  CONSTRAINT ck_education_dates CHECK (end_date IS NULL OR end_date &gt;= start_date),
  CONSTRAINT fk_edu_freelancer FOREIGN KEY (freelancer_id)
      REFERENCES freelancer(freelancer_id) ON DELETE CASCADE,          -- composition
  CONSTRAINT fk_edu_degree FOREIGN KEY (degree_id)
      REFERENCES degree(degree_id) ON DELETE RESTRICT                  -- bảng tra cứu
);
CREATE TABLE freelancer_skill (
  freelancer_id INT NOT NULL,
  skill_id      INT NOT NULL,
  level         TINYINT NOT NULL CHECK (level BETWEEN 1 AND 5),
  PRIMARY KEY (freelancer_id, skill_id),                                -- khoá ghép
  FOREIGN KEY (freelancer_id) REFERENCES freelancer(freelancer_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id)      REFERENCES skill(skill_id)
);</pre>
<p class="ghi-chu">Ràng buộc <code>CHECK</code> chỉ được thực thi từ MySQL 8.0.16. Bản cũ hơn đọc cú pháp rồi âm thầm bỏ qua — ghi rõ phiên bản nhóm dùng trong RDS.</p>`),
  bi(`<h2>🎯 Practice — decide the mapping (answers below each)</h2>
<ol>
<li><strong>A recruiter owns exactly one company page; a company page belongs to one recruiter.</strong> Where is the FK?</li>
</ol>
<p class="dap-an">✅ 1:1 — FK in either table. Put <code>recruiter_id</code> in <code>company</code> (the company page is created after the recruiter signs up) and make it <code>UNIQUE</code>. G5 does exactly this (<code>IX_Company</code> on <code>Company.recruiterID</code>).</p>
<ol start="2">
<li><strong>A freelancer can save many posts as favourites; a post can be saved by many freelancers.</strong> Table?</li>
</ol>
<p class="dap-an">✅ M:N without attributes → <code>favorite (freelancer_id, post_id)</code> with PK (or UNIQUE) on the pair; add <code>saved_at</code> if the "My favourites" screen sorts by date.</p>
<ol start="3">
<li><strong>A freelancer reports a post with a message; the admin later resolves it.</strong> Association class?</li>
</ol>
<p class="dap-an">✅ Yes — the message belongs to (freelancer, post). But the same freelancer may report the same post twice over time, so a surrogate <code>report_id</code> is better than the concatenated key here, plus <code>status</code> and <code>resolved_by</code> (FK to admin).</p>
<div class="pitfall co-tieu-de"><strong>Common mistakes that lose design marks.</strong> (1) 0..1 mapped without UNIQUE — the database silently allows two profiles per user. (2) M:N stored as a comma list in one column. (3) A surrogate id on a link table with no UNIQUE pair — duplicate applications. (4) <code>ON DELETE CASCADE</code> on a lookup table — deleting a category wipes every post in it.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Identifying vs non-identifying relationships.</strong> Tools like MySQL Workbench draw a <em>solid</em> line when the parent's key is part of the child's PK (identifying — slide 16 rules 1–2, e.g. Admin Office, Hours) and a <em>dashed</em> line when it is just an FK (non-identifying — rule 3, e.g. Department). The same idea appears in JPA: a composite key is written with <code>@EmbeddedId</code> / <code>@MapsId</code>, a plain FK with <code>@ManyToOne</code>. <em>Outside the syllabus because the deck uses Gomaa's wording, not the tool vocabulary.</em></div>`,
  `<h2>🎯 Luyện tập — chọn cách ánh xạ (đáp án ngay dưới mỗi câu)</h2>
<ol>
<li><strong>Một recruiter sở hữu đúng một trang công ty; một trang công ty thuộc một recruiter.</strong> FK đặt ở đâu?</li>
</ol>
<p class="dap-an">✅ 1:1 — FK ở bảng nào cũng được. Đặt <code>recruiter_id</code> trong <code>company</code> (trang công ty tạo sau khi recruiter đăng ký) và cho nó <code>UNIQUE</code>. G5 làm đúng như vậy (<code>IX_Company</code> trên <code>Company.recruiterID</code>).</p>
<ol start="2">
<li><strong>Một freelancer lưu nhiều bài làm yêu thích; một bài được nhiều freelancer lưu.</strong> Bảng nào?</li>
</ol>
<p class="dap-an">✅ M:N không thuộc tính → <code>favorite (freelancer_id, post_id)</code> với PK (hoặc UNIQUE) trên cặp; thêm <code>saved_at</code> nếu màn "My favourites" sắp xếp theo ngày.</p>
<ol start="3">
<li><strong>Freelancer báo cáo một bài đăng kèm lời nhắn; admin xử lý sau.</strong> Có phải association class?</li>
</ol>
<p class="dap-an">✅ Có — lời nhắn thuộc về (freelancer, post). Nhưng cùng một freelancer có thể báo cáo cùng bài hai lần theo thời gian, nên ở đây id thay thế <code>report_id</code> tốt hơn khoá ghép, kèm <code>status</code> và <code>resolved_by</code> (FK tới admin).</p>
<div class="pitfall co-tieu-de"><strong>Lỗi thường gặp làm mất điểm thiết kế.</strong> (1) 0..1 ánh xạ không có UNIQUE — CSDL âm thầm cho một user có hai hồ sơ. (2) M:N lưu thành danh sách phẩy trong một cột. (3) Bảng nối có id thay thế mà không có cặp UNIQUE — đơn ứng tuyển trùng. (4) <code>ON DELETE CASCADE</code> trên bảng tra cứu — xoá một category là xoá sạch mọi bài đăng trong đó.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Quan hệ identifying và non-identifying.</strong> Công cụ như MySQL Workbench vẽ nét <em>liền</em> khi khoá của bảng cha là một phần PK của bảng con (identifying — slide 16 quy tắc 1–2, ví dụ Admin Office, Hours) và nét <em>đứt</em> khi nó chỉ là FK (non-identifying — quy tắc 3, ví dụ Department). JPA cũng có ý này: khoá ghép viết bằng <code>@EmbeddedId</code> / <code>@MapsId</code>, FK thường bằng <code>@ManyToOne</code>. <em>Ngoài giáo trình vì slide dùng thuật ngữ của Gomaa, không dùng từ vựng của công cụ.</em></div>`),
  books([
    ['gomaa', 'Ch. 7 Static Modeling — associations, association classes, composition and aggregation; relational mapping section cited by the deck (Ch. 15)', 'Ch. 7 Static Modeling — association, association class, composition and aggregation; phần ánh xạ quan hệ mà slide dẫn (Ch. 15)'],
    ['fowler', 'Ch. 5 Class Diagrams: Advanced Concepts (association class, aggregation and composition)', 'Ch. 5 Class Diagrams: Advanced Concepts (association class, aggregation and composition)'],
  ]),
].join('\n');

/* ═════════════ LESSON 3.8 — generalisation mapping + the Banking example (g-db 18–25) ═════════════ */
const L3_INTRO = bi(`<span class="eyebrow">Chapter 3 · Lesson 3.8 · Database Design slides 18–25</span>
<h2>Generalisation / specialisation — three ways to store an inheritance tree, and the full Banking example</h2>
<p class="lead">Almost every SWP391 system has an inheritance tree: <em>User</em> specialised into Admin, Recruiter and Freelancer; <em>Post</em> into job types; <em>Payment</em> into methods. A relational table has no "extends", so the deck gives three mappings and when to use each. The last pages put every rule of this deck together on one Banking System — read it as a model answer for your RDS.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li><strong>Name</strong> the three mappings of a generalisation hierarchy and draw the tables for each</li>
<li><strong>Use</strong> a discriminator column and a shared primary key correctly</li>
<li><strong>Choose</strong> the mapping from the numbers of attributes and subclasses, and the way the application searches</li>
<li><strong>Read</strong> the Banking System example and explain every PK and FK in it</li>
<li><strong>Spot</strong> the typo on slide 21 and the design decision hidden in the "assumption" of slide 24</li>
</ul></div>
<h3>The essentials in one screen</h3>
<table>
<thead><tr><th>Option</th><th>Tables</th><th>Use when</th><th>Price</th></tr></thead>
<tbody>
<tr><td>1. Superclass &amp; subclasses</td><td>1 super (with discriminator) + 1 per sub, <strong>shared PK</strong></td><td>Default; clean and extensible</td><td>JOIN to read a full object</td></tr>
<tr><td>2. Subclasses only</td><td>1 per sub, super attributes copied into each</td><td>Many sub attributes, few super attributes, app knows which sub to search</td><td>"All accounts" needs UNION; no FK can point to "any account"</td></tr>
<tr><td>3. Superclass only</td><td>1 table, all sub attributes pulled up, discriminator</td><td>Many super attributes, few sub attributes, only 2–3 subclasses</td><td>Many NULL columns; NOT NULL rules per sub cannot be declared simply</td></tr>
</tbody>
</table>`,
  `<span class="eyebrow">Chương 3 · Bài 3.8 · Database Design slide 18–25</span>
<h2>Generalisation / specialisation — ba cách lưu một cây kế thừa, và ví dụ Banking trọn vẹn</h2>
<p class="lead">Gần như mọi hệ thống SWP391 đều có cây kế thừa: <em>User</em> chuyên biệt thành Admin, Recruiter và Freelancer; <em>Post</em> thành các loại việc; <em>Payment</em> thành các phương thức. Bảng quan hệ không có "extends", nên slide đưa ra ba cách ánh xạ và khi nào dùng cách nào. Các trang cuối ghép mọi quy tắc của bộ slide vào một Banking System — hãy đọc nó như một đáp án mẫu cho RDS của bạn.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li><strong>Kể tên</strong> ba cách ánh xạ cây generalisation và vẽ bảng cho từng cách</li>
<li><strong>Dùng</strong> cột phân loại (discriminator) và khoá chính dùng chung đúng cách</li>
<li><strong>Chọn</strong> cách ánh xạ dựa trên số thuộc tính, số class con, và cách ứng dụng tìm kiếm</li>
<li><strong>Đọc</strong> ví dụ Banking System và giải thích mọi PK, FK trong đó</li>
<li><strong>Phát hiện</strong> lỗi đánh máy ở slide 21 và quyết định thiết kế ẩn trong "assumption" của slide 24</li>
</ul></div>
<h3>Cốt lõi trong một màn hình</h3>
<table>
<thead><tr><th>Cách</th><th>Các bảng</th><th>Dùng khi</th><th>Cái giá</th></tr></thead>
<tbody>
<tr><td>1. Bảng cha &amp; bảng con</td><td>1 bảng cha (có discriminator) + 1 bảng mỗi class con, <strong>PK dùng chung</strong></td><td>Mặc định; gọn và dễ mở rộng</td><td>Phải JOIN để đọc đủ một object</td></tr>
<tr><td>2. Chỉ bảng con</td><td>1 bảng mỗi class con, thuộc tính cha chép vào từng bảng</td><td>Con nhiều thuộc tính, cha ít thuộc tính, ứng dụng biết tìm ở class con nào</td><td>"Mọi tài khoản" cần UNION; không FK nào trỏ được tới "tài khoản bất kỳ"</td></tr>
<tr><td>3. Chỉ bảng cha</td><td>1 bảng, kéo mọi thuộc tính con lên, có discriminator</td><td>Cha nhiều thuộc tính, con ít thuộc tính, chỉ 2–3 class con</td><td>Nhiều cột NULL; khó khai báo NOT NULL riêng cho từng loại</td></tr>
</tbody>
</table>`);

const L3_ROWS = [
  [18, 'Generalisation / specialisation hierarchy — three alternative mappings',
    `<p class="y-chinh">🎯 A relational database has no inheritance, so an "is-a" tree can be stored in three different ways.</p>
<ol>
<li><strong>Superclass &amp; subclasses mapped to relations</strong> — one table per class in the tree (slides 19–20)</li>
<li><strong>Subclasses only mapped to relations</strong> — no table for the superclass (slide 21)</li>
<li><strong>Superclass only mapped to relation</strong> — one wide table for the whole tree (slide 22)</li>
</ol>
<p class="nhan">Where you meet this in SWP391</p>
<ul>
<li><strong>User → Admin / Recruiter / Freelancer</strong> — the most common tree in team projects</li>
<li><strong>Notification → Email / In-app</strong>, <strong>Payment → Cash / VNPay / Card</strong></li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> "Both · Down · Up" — keep both levels, push the super attributes <em>down</em> into the subs, or pull the sub attributes <em>up</em> into the super.</p>`,
    `<p class="y-chinh">🎯 CSDL quan hệ không có kế thừa, nên một cây "is-a" có thể lưu theo ba cách khác nhau.</p>
<ol>
<li><strong>Superclass &amp; subclasses mapped to relations</strong> — mỗi class trong cây một bảng (slide 19–20)</li>
<li><strong>Subclasses only mapped to relations</strong> — không có bảng cho class cha (slide 21)</li>
<li><strong>Superclass only mapped to relation</strong> — một bảng rộng cho cả cây (slide 22)</li>
</ol>
<p class="nhan">Gặp ở đâu trong SWP391</p>
<ul>
<li><strong>User → Admin / Recruiter / Freelancer</strong> — cây phổ biến nhất trong đồ án nhóm</li>
<li><strong>Notification → Email / In-app</strong>, <strong>Payment → Cash / VNPay / Card</strong></li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "Giữ cả · Đẩy xuống · Kéo lên" — giữ cả hai tầng, đẩy thuộc tính cha <em>xuống</em> các bảng con, hoặc kéo thuộc tính con <em>lên</em> bảng cha.</p>`],
  [19, 'Generalisation — superclass and subclasses mapped to relations (1/4)',
    `<p class="y-chinh">🎯 Option 1: one table for the superclass (with a discriminator) and one per subclass, all sharing the same primary key.</p>
<p class="nhan">The rules</p>
<ul>
<li><strong>Superclass → table</strong> — holds the common attributes</li>
<li><strong>Discriminator</strong> — an attribute of the superclass table telling which subclass a row is (e.g. <code>account_type</code>)</li>
<li><strong>Each subclass → table</strong> — holds only its own attributes</li>
<li><strong>Shared id for PK</strong> — the same key value in the super row and its sub row; in the sub table it is PK <em>and</em> FK</li>
</ul>
<p class="nhan">Trade-off</p>
<ul>
<li><strong>Pro</strong> — clean (3NF, no NULL columns) and extensible (a new subclass = a new table)</li>
<li><strong>Con</strong> — navigation super ↔ sub may be slow: every full read is a JOIN</li>
</ul>
<div class="pitfall">Without a discriminator you must probe every sub table to learn the type of a row. Keep it, and make it <code>NOT NULL</code> with a fixed set of values.</div>`,
    `<p class="y-chinh">🎯 Cách 1: một bảng cho class cha (có discriminator) và một bảng cho mỗi class con, tất cả dùng chung một khoá chính.</p>
<p class="nhan">Quy tắc</p>
<ul>
<li><strong>Class cha → bảng</strong> — chứa các thuộc tính chung</li>
<li><strong>Discriminator</strong> — một thuộc tính của bảng cha cho biết dòng đó thuộc class con nào (ví dụ <code>account_type</code>)</li>
<li><strong>Mỗi class con → bảng</strong> — chỉ chứa thuộc tính riêng</li>
<li><strong>PK dùng chung</strong> — cùng một giá trị khoá ở dòng cha và dòng con; trong bảng con nó vừa là PK <em>vừa</em> là FK</li>
</ul>
<p class="nhan">Được và mất</p>
<ul>
<li><strong>Được</strong> — gọn (3NF, không cột NULL) và dễ mở rộng (thêm class con = thêm bảng)</li>
<li><strong>Mất</strong> — điều hướng cha ↔ con có thể chậm: đọc đủ một object luôn là một phép JOIN</li>
</ul>
<div class="pitfall">Không có discriminator thì phải dò mọi bảng con mới biết loại của một dòng. Hãy giữ nó, và cho <code>NOT NULL</code> với tập giá trị cố định.</div>`],
  [20, 'Generalisation — superclass and subclasses: the Account example (2/4)',
    `<p class="y-chinh">🎯 Account is split into Checking and Savings; <code>Account Number</code> is the PK of all three tables and <code>Account Type</code> is the discriminator.</p>
<p class="nhan">Static model</p>
<ul>
<li><strong>Superclass</strong> — <code>Account (Account number, Balance)</code></li>
<li><strong>Subclasses</strong> — <code>Checking Account (Last Deposit Amount)</code>, <code>Savings Account (Interest)</code></li>
</ul>
<p class="nhan">Relational design</p>
<pre>Account          (<u>Account number</u>, Account Type, Balance)
Checking Account (<u>Account Number</u>, Last Deposit Amount)
Savings Account  (<u>Account Number</u>, Interest)</pre>
<p class="nhan">In MySQL 8</p>
<pre>CREATE TABLE account (
  account_number INT PRIMARY KEY,
  account_type   ENUM('CHECKING','SAVINGS') NOT NULL,     -- discriminator
  balance        DECIMAL(15,2) NOT NULL DEFAULT 0
);
CREATE TABLE savings_account (
  account_number INT PRIMARY KEY,                         -- shared id
  interest       DECIMAL(5,2) NOT NULL,
  FOREIGN KEY (account_number) REFERENCES account(account_number) ON DELETE CASCADE
);</pre>`,
    `<p class="y-chinh">🎯 Account tách thành Checking và Savings; <code>Account Number</code> là PK của cả ba bảng và <code>Account Type</code> là discriminator.</p>
<p class="nhan">Static model</p>
<ul>
<li><strong>Class cha</strong> — <code>Account (Account number, Balance)</code></li>
<li><strong>Class con</strong> — <code>Checking Account (Last Deposit Amount)</code>, <code>Savings Account (Interest)</code></li>
</ul>
<p class="nhan">Thiết kế quan hệ</p>
<pre>Account          (<u>Account number</u>, Account Type, Balance)
Checking Account (<u>Account Number</u>, Last Deposit Amount)
Savings Account  (<u>Account Number</u>, Interest)</pre>
<p class="nhan">Viết bằng MySQL 8</p>
<pre>CREATE TABLE account (
  account_number INT PRIMARY KEY,
  account_type   ENUM('CHECKING','SAVINGS') NOT NULL,     -- discriminator
  balance        DECIMAL(15,2) NOT NULL DEFAULT 0
);
CREATE TABLE savings_account (
  account_number INT PRIMARY KEY,                         -- id dùng chung
  interest       DECIMAL(5,2) NOT NULL,
  FOREIGN KEY (account_number) REFERENCES account(account_number) ON DELETE CASCADE
);</pre>`],
  [21, 'Generalisation — subclasses only mapped to relations (3/4)',
    `<p class="y-chinh">🎯 Option 2: no superclass table — each subclass table repeats the superclass attributes.</p>
<div class="pitfall co-tieu-de"><strong>Typo on the slide.</strong> Its heading says "Superclass only mapped to relations", but the content (and slide 18) describe <em>subclasses only</em>. The real "superclass only" option is slide 22. Quote the content, not the heading, in the exam.</div>
<p class="nhan">The rules</p>
<ul>
<li><strong>Map each subclass to a relation</strong></li>
<li><strong>No superclass relation</strong></li>
<li><strong>Superclass attributes replicated</strong> in each subclass table</li>
</ul>
<p class="nhan">Can use if</p>
<ul>
<li><strong>Subclass has many attributes</strong>, superclass has few</li>
<li><strong>The application knows which subclass to search</strong> — e.g. the "Savings" screen only ever reads savings accounts</li>
</ul>
<p class="nhan">Result for the Account example</p>
<pre>Checking Account (<u>Account Number</u>, Balance, Last Deposit Amount)
Savings Account  (<u>Account Number</u>, Balance, Interest)</pre>
<p class="ghi-chu">Cost: "list all accounts of a customer" needs a UNION, and uniqueness of account numbers across both tables is no longer guaranteed by one PK.</p>`,
    `<p class="y-chinh">🎯 Cách 2: không có bảng cha — mỗi bảng con lặp lại các thuộc tính của class cha.</p>
<div class="pitfall co-tieu-de"><strong>Lỗi đánh máy trên slide.</strong> Tiêu đề ghi "Superclass only mapped to relations", nhưng nội dung (và slide 18) mô tả <em>chỉ bảng con</em>. Cách "chỉ bảng cha" thật sự là slide 22. Khi thi, trích theo nội dung, đừng theo tiêu đề.</div>
<p class="nhan">Quy tắc</p>
<ul>
<li><strong>Ánh xạ mỗi class con thành một relation</strong></li>
<li><strong>Không có relation cho class cha</strong></li>
<li><strong>Thuộc tính của class cha được lặp lại</strong> trong từng bảng con</li>
</ul>
<p class="nhan">Dùng khi</p>
<ul>
<li><strong>Class con nhiều thuộc tính</strong>, class cha ít thuộc tính</li>
<li><strong>Ứng dụng biết cần tìm ở class con nào</strong> — ví dụ màn "Savings" chỉ đọc tài khoản tiết kiệm</li>
</ul>
<p class="nhan">Kết quả cho ví dụ Account</p>
<pre>Checking Account (<u>Account Number</u>, Balance, Last Deposit Amount)
Savings Account  (<u>Account Number</u>, Balance, Interest)</pre>
<p class="ghi-chu">Cái giá: "liệt kê mọi tài khoản của một khách" cần UNION, và việc số tài khoản không trùng giữa hai bảng không còn được một PK duy nhất bảo đảm.</p>`],
  [22, 'Generalisation — superclass only mapped to relation (4/4)',
    `<p class="y-chinh">🎯 Option 3: one table for the whole tree — all subclass attributes are pulled up, and a discriminator says which ones a row uses.</p>
<p class="nhan">The rules</p>
<ol>
<li><strong>Superclass only</strong> mapped to a relation</li>
<li><strong>All subclass attributes brought up</strong> to the superclass table</li>
<li><strong>Discriminator</strong> — attribute of the table; each row uses the attributes of one subclass, the others are NULL</li>
</ol>
<p class="nhan">Can use if</p>
<ul>
<li><strong>Superclass has many attributes</strong>, subclasses have few</li>
<li><strong>Only two or three subclasses</strong></li>
</ul>
<p class="nhan">Result and a safety net</p>
<pre>CREATE TABLE account (
  account_number      INT PRIMARY KEY,
  account_type        ENUM('CHECKING','SAVINGS') NOT NULL,
  balance             DECIMAL(15,2) NOT NULL,
  last_deposit_amount DECIMAL(15,2) NULL,     -- CHECKING only
  interest            DECIMAL(5,2)  NULL,     -- SAVINGS only
  CHECK ((account_type = 'SAVINGS'  AND interest IS NOT NULL)
      OR (account_type = 'CHECKING' AND interest IS NULL))
);</pre>
<p class="ghi-chu">Fastest to query (no JOIN), and the choice many teams make for small trees — but write the CHECK, otherwise nothing stops a checking account with an interest rate.</p>`,
    `<p class="y-chinh">🎯 Cách 3: một bảng cho cả cây — mọi thuộc tính của class con được kéo lên, và discriminator cho biết dòng đó dùng những cột nào.</p>
<p class="nhan">Quy tắc</p>
<ol>
<li><strong>Chỉ class cha</strong> được ánh xạ thành relation</li>
<li><strong>Mọi thuộc tính của class con được kéo lên</strong> bảng cha</li>
<li><strong>Discriminator</strong> — thuộc tính của bảng; mỗi dòng dùng thuộc tính của một class con, các cột khác là NULL</li>
</ol>
<p class="nhan">Dùng khi</p>
<ul>
<li><strong>Class cha nhiều thuộc tính</strong>, class con ít thuộc tính</li>
<li><strong>Chỉ có hai hoặc ba class con</strong></li>
</ul>
<p class="nhan">Kết quả và một lưới an toàn</p>
<pre>CREATE TABLE account (
  account_number      INT PRIMARY KEY,
  account_type        ENUM('CHECKING','SAVINGS') NOT NULL,
  balance             DECIMAL(15,2) NOT NULL,
  last_deposit_amount DECIMAL(15,2) NULL,     -- chỉ CHECKING
  interest            DECIMAL(5,2)  NULL,     -- chỉ SAVINGS
  CHECK ((account_type = 'SAVINGS'  AND interest IS NOT NULL)
      OR (account_type = 'CHECKING' AND interest IS NULL))
);</pre>
<p class="ghi-chu">Truy vấn nhanh nhất (không JOIN), và là lựa chọn của nhiều nhóm với cây nhỏ — nhưng hãy viết CHECK, nếu không thì chẳng gì ngăn một tài khoản thanh toán có lãi suất.</p>`],
  [23, 'Example relational DB design (1/2) — the Banking System static model',
    `<p class="y-chinh">🎯 One diagram that uses every rule of the deck — read it as a map of which rule applies to which line.</p>
<p class="nhan">Associations and the rule each one triggers</p>
<ul>
<li><strong>Bank 1 — 1..* ATMInfo</strong> (Maintains) — composition-like: ATM is identified inside its bank → rule of slide 16</li>
<li><strong>Bank 1 — 1..* Customer</strong> (Has), <strong>Bank 1 — 1..* DebitCard</strong> (Manages) — 1:N → FK</li>
<li><strong>Customer 1 — 0..1 DebitCard</strong> (Owns) — slides 9–10 → FK in DebitCard</li>
<li><strong>Customer 1..* — 1..* Account</strong> (Owns) — M:N → associative table Customer Account</li>
<li><strong>DebitCard * — 1..* Account</strong> (Provides Access to), with <strong>CardAccount</strong> as association class → associative table</li>
<li><strong>Account ▷ Checking / Savings</strong> — generalisation (slides 18–22)</li>
<li><strong>ATMTransaction ▷ Withdrawal / Query / Transfer / PINValidation</strong> — a second hierarchy the slide 24 list does not map</li>
</ul>
<p class="ghi-chu">"1,2" on Account — ATMTransaction: a transfer touches two accounts, every other transaction one.</p>`,
    `<p class="y-chinh">🎯 Một sơ đồ dùng mọi quy tắc của bộ slide — hãy đọc nó như bản đồ: đường nối nào kích hoạt quy tắc nào.</p>
<p class="nhan">Các quan hệ và quy tắc tương ứng</p>
<ul>
<li><strong>Bank 1 — 1..* ATMInfo</strong> (Maintains) — gần như composition: ATM được định danh bên trong ngân hàng → quy tắc slide 16</li>
<li><strong>Bank 1 — 1..* Customer</strong> (Has), <strong>Bank 1 — 1..* DebitCard</strong> (Manages) — 1:N → FK</li>
<li><strong>Customer 1 — 0..1 DebitCard</strong> (Owns) — slide 9–10 → FK ở DebitCard</li>
<li><strong>Customer 1..* — 1..* Account</strong> (Owns) — M:N → bảng liên kết Customer Account</li>
<li><strong>DebitCard * — 1..* Account</strong> (Provides Access to), với <strong>CardAccount</strong> là association class → bảng liên kết</li>
<li><strong>Account ▷ Checking / Savings</strong> — generalisation (slide 18–22)</li>
<li><strong>ATMTransaction ▷ Withdrawal / Query / Transfer / PINValidation</strong> — cây thứ hai mà danh sách ở slide 24 không ánh xạ</li>
</ul>
<p class="ghi-chu">"1,2" ở Account — ATMTransaction: giao dịch chuyển khoản chạm tới hai tài khoản, mọi giao dịch khác chạm một.</p>`],
  [24, 'Example relational DB design (2/2) — the Banking System tables',
    `<p class="y-chinh">🎯 The resulting schema — eight relations, each one explained by a rule you have already learnt.</p>
<table>
<thead><tr><th>Relation</th><th>Key</th><th>Rule</th></tr></thead>
<tbody>
<tr><td>Bank (bankName, Bank Address, <u>bankId</u>)</td><td>bankId</td><td>Entity → table (slide 6–7)</td></tr>
<tr><td>ATM Info (<u>bankId</u>, <u>ATMId</u>, Location, Address)</td><td>bankId + ATMId</td><td>1-n part: whole's PK is <em>part of</em> the key (slide 16)</td></tr>
<tr><td>Customer (customerName, <u>customerId</u>, customerAddress)</td><td>customerId</td><td>Entity → table</td></tr>
<tr><td>Debit Card (<u>cardId</u>, PIN, …, <em>customerId</em>)</td><td>cardId</td><td>0..1 → FK in optional side (slide 10)</td></tr>
<tr><td>Checking / Savings Account (<u>accountNumber</u>, accountType, balance, …)</td><td>accountNumber</td><td>Generalisation — <strong>subclasses only</strong> (slide 21)</td></tr>
<tr><td>Card Account (<u>cardId</u>, <u>accountNumber</u>)</td><td>concatenated</td><td>Association class (slides 13–15)</td></tr>
<tr><td>Customer Account (<u>customerId</u>, <u>accountNumber</u>)</td><td>concatenated</td><td>M:N → associative relation</td></tr>
</tbody>
</table>
<p class="nhan">The assumption at the bottom</p>
<p>"Account type is determined from account number" — because there is no Account table, Card Account and Customer Account cannot declare an FK to "an account". The number itself (e.g. its first digit) tells which table to look in. That is the hidden price of option 2.</p>
<div class="pitfall">Also note: the list keeps <code>accountType</code> inside each subclass table although option 2 makes it redundant, and Debit Card has no <code>bankId</code> although the diagram says Bank Manages DebitCard. Good exam questions — and good practice in reading a model critically.</div>`,
    `<p class="y-chinh">🎯 Schema kết quả — tám relation, mỗi cái được giải thích bằng một quy tắc bạn đã học.</p>
<table>
<thead><tr><th>Relation</th><th>Khoá</th><th>Quy tắc</th></tr></thead>
<tbody>
<tr><td>Bank (bankName, Bank Address, <u>bankId</u>)</td><td>bankId</td><td>Entity → bảng (slide 6–7)</td></tr>
<tr><td>ATM Info (<u>bankId</u>, <u>ATMId</u>, Location, Address)</td><td>bankId + ATMId</td><td>Bộ phận 1-n: PK tổng thể là <em>một phần</em> khoá (slide 16)</td></tr>
<tr><td>Customer (customerName, <u>customerId</u>, customerAddress)</td><td>customerId</td><td>Entity → bảng</td></tr>
<tr><td>Debit Card (<u>cardId</u>, PIN, …, <em>customerId</em>)</td><td>cardId</td><td>0..1 → FK ở phía tuỳ chọn (slide 10)</td></tr>
<tr><td>Checking / Savings Account (<u>accountNumber</u>, accountType, balance, …)</td><td>accountNumber</td><td>Generalisation — <strong>chỉ bảng con</strong> (slide 21)</td></tr>
<tr><td>Card Account (<u>cardId</u>, <u>accountNumber</u>)</td><td>ghép</td><td>Association class (slide 13–15)</td></tr>
<tr><td>Customer Account (<u>customerId</u>, <u>accountNumber</u>)</td><td>ghép</td><td>M:N → bảng liên kết</td></tr>
</tbody>
</table>
<p class="nhan">Giả định ở cuối trang</p>
<p>"Account type is determined from account number" — vì không có bảng Account, Card Account và Customer Account không khai báo được FK tới "một tài khoản". Chính con số (ví dụ chữ số đầu) cho biết phải tìm ở bảng nào. Đó là cái giá ẩn của cách 2.</p>
<div class="pitfall">Để ý thêm: danh sách vẫn giữ <code>accountType</code> trong từng bảng con dù cách 2 khiến nó thừa, và Debit Card không có <code>bankId</code> dù sơ đồ ghi Bank Manages DebitCard. Câu hỏi thi hay — và là bài tập đọc mô hình có phê phán.</div>`],
  [25, 'Q&A',
    `<p class="y-chinh">🎯 End of the deck — test yourself with the questions the teacher typically asks at the design review.</p>
<ol>
<li><strong>Why does every table need a PK, even a link table?</strong> — to identify and update one row; for a link table it also forbids duplicates.</li>
<li><strong>Where does the FK go in a 0..1 association?</strong> — in the optional table, with UNIQUE.</li>
<li><strong>When is an associative table's PK concatenated?</strong> — when the pair can occur only once; otherwise use a surrogate id + UNIQUE where needed.</li>
<li><strong>Which generalisation option did your team choose for User, and why?</strong> — answer with the "can use if" conditions of slides 21–22.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> every answer should cite a rule <em>and</em> a table from your own schema.</p>`,
    `<p class="y-chinh">🎯 Hết bộ slide — tự kiểm tra bằng các câu thầy/cô hay hỏi ở buổi review thiết kế.</p>
<ol>
<li><strong>Vì sao mọi bảng cần PK, kể cả bảng nối?</strong> — để định danh và cập nhật một dòng; với bảng nối nó còn chặn dòng trùng.</li>
<li><strong>Trong quan hệ 0..1, FK đặt ở đâu?</strong> — ở bảng tuỳ chọn, kèm UNIQUE.</li>
<li><strong>Khi nào PK của bảng liên kết là khoá ghép?</strong> — khi cặp đó chỉ xuất hiện một lần; nếu không, dùng id thay thế + UNIQUE nơi cần.</li>
<li><strong>Nhóm em chọn cách ánh xạ generalisation nào cho User, vì sao?</strong> — trả lời bằng điều kiện "can use if" của slide 21–22.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mỗi câu trả lời nên dẫn một quy tắc <em>và</em> một bảng trong schema của chính nhóm.</p>`],
];

const L3_DEEP = [
  bi(`<h2>🛠️ Worked example — the User tree of Job IT for Freelancer, three ways</h2>
<p>Static model: <code>User (username, email, password, status, role)</code> specialised into <code>Admin (first name, last name, phone)</code>, <code>Recruiter (first name, last name, gender, dob, phone)</code> and <code>Freelancer (first name, last name, gender, dob, description)</code>.</p>
<table>
<thead><tr><th>Option</th><th>Tables</th><th>Verdict for this system</th></tr></thead>
<tbody>
<tr><td>1. Super &amp; sub, shared PK</td><td><code>user_account (<u>user_id</u>, role, …)</code>, <code>freelancer (<u><em>user_id</em></u>, …)</code>, <code>recruiter (<u><em>user_id</em></u>, …)</code>, <code>admin (<u><em>user_id</em></u>, …)</code></td><td>✅ Best fit: login code reads one table; each role has its own fields; a new role = a new table</td></tr>
<tr><td>2. Subclasses only</td><td><code>freelancer</code>, <code>recruiter</code>, <code>admin</code>, each with username/email/password</td><td>❌ Login must search 3 tables; a username could exist twice</td></tr>
<tr><td>3. Superclass only</td><td>one <code>user_account</code> with every role's columns, NULL where unused</td><td>⚠️ Acceptable for 2–3 small roles; here the roles differ too much</td></tr>
</tbody>
</table>
<p class="nhan">What G5 actually built — a variant of option 1</p>
<ul>
<li><strong>Superclass table</strong> <code>User</code> with discriminator <code>roleID</code> → <code>Role</code> ✅</li>
<li><strong>Subclass tables</strong> <code>Admin</code>, <code>Recruiter</code>, <code>Freelancer</code>, each with <code>userID</code> FK + UNIQUE ✅</li>
<li><strong>But</strong> each subclass also has its own IDENTITY id (<code>freelanceID</code>, <code>recruiterID</code>, <code>adminID</code>) instead of the shared id of slide 19 — two ids for one person, and every other table must choose which to reference</li>
<li><strong>And</strong> nothing guarantees that a <code>Freelancer</code> row points to a User whose role is Freelancer — the discriminator and the sub table can disagree</li>
</ul>
<p class="ghi-chu">Both variants pass the course. What earns marks is being able to say which option you chose, quote the slide's conditions, and show the constraint that keeps it consistent.</p>`,
  `<h2>🛠️ Ví dụ làm từng bước — cây User của Job IT for Freelancer, theo cả ba cách</h2>
<p>Static model: <code>User (username, email, password, status, role)</code> chuyên biệt thành <code>Admin (first name, last name, phone)</code>, <code>Recruiter (first name, last name, gender, dob, phone)</code> và <code>Freelancer (first name, last name, gender, dob, description)</code>.</p>
<table>
<thead><tr><th>Cách</th><th>Các bảng</th><th>Kết luận cho hệ thống này</th></tr></thead>
<tbody>
<tr><td>1. Cha &amp; con, PK dùng chung</td><td><code>user_account (<u>user_id</u>, role, …)</code>, <code>freelancer (<u><em>user_id</em></u>, …)</code>, <code>recruiter (<u><em>user_id</em></u>, …)</code>, <code>admin (<u><em>user_id</em></u>, …)</code></td><td>✅ Hợp nhất: code đăng nhập chỉ đọc một bảng; mỗi vai trò có trường riêng; thêm vai trò = thêm bảng</td></tr>
<tr><td>2. Chỉ bảng con</td><td><code>freelancer</code>, <code>recruiter</code>, <code>admin</code>, bảng nào cũng có username/email/password</td><td>❌ Đăng nhập phải dò 3 bảng; một username có thể tồn tại hai lần</td></tr>
<tr><td>3. Chỉ bảng cha</td><td>một <code>user_account</code> chứa cột của mọi vai trò, NULL chỗ không dùng</td><td>⚠️ Được với 2–3 vai trò nhỏ; ở đây các vai trò khác nhau quá nhiều</td></tr>
</tbody>
</table>
<p class="nhan">G5 thực tế làm gì — một biến thể của cách 1</p>
<ul>
<li><strong>Bảng cha</strong> <code>User</code> với discriminator <code>roleID</code> → <code>Role</code> ✅</li>
<li><strong>Bảng con</strong> <code>Admin</code>, <code>Recruiter</code>, <code>Freelancer</code>, mỗi bảng có FK <code>userID</code> + UNIQUE ✅</li>
<li><strong>Nhưng</strong> mỗi bảng con lại có id IDENTITY riêng (<code>freelanceID</code>, <code>recruiterID</code>, <code>adminID</code>) thay vì id dùng chung như slide 19 — một người hai id, và mọi bảng khác phải chọn tham chiếu id nào</li>
<li><strong>Và</strong> không gì bảo đảm một dòng <code>Freelancer</code> trỏ tới User có role Freelancer — discriminator và bảng con có thể mâu thuẫn</li>
</ul>
<p class="ghi-chu">Cả hai biến thể đều qua môn. Điều được điểm là nói được nhóm chọn cách nào, dẫn điều kiện của slide, và chỉ ra ràng buộc giữ cho nó nhất quán.</p>`),
  bi(`<h2>🏦 The Banking example rebuilt with option 1 — MySQL 8</h2>
<p>Slide 24 chose "subclasses only" and paid with the assumption about account numbers. With option 1 every link table gets a real FK. Compare the two and be ready to defend either.</p>
<pre>CREATE TABLE bank     (bank_id INT PRIMARY KEY, bank_name VARCHAR(100) NOT NULL, address VARCHAR(255));
CREATE TABLE atm_info (bank_id INT, atm_id INT, location VARCHAR(100), address VARCHAR(255),
                       PRIMARY KEY (bank_id, atm_id),                          -- 1-n part (slide 16)
                       FOREIGN KEY (bank_id) REFERENCES bank(bank_id));
CREATE TABLE customer (customer_id INT PRIMARY KEY, customer_name VARCHAR(100) NOT NULL,
                       customer_address VARCHAR(255));
CREATE TABLE debit_card (card_id INT PRIMARY KEY, pin_hash VARCHAR(100) NOT NULL,
                       start_date DATE, expiration_date DATE, status TINYINT,
                       card_limit DECIMAL(15,2), total DECIMAL(15,2),
                       customer_id INT NOT NULL UNIQUE,                         -- 0..1 (slide 10)
                       bank_id INT NOT NULL,                                    -- Bank Manages card
                       FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
                       FOREIGN KEY (bank_id) REFERENCES bank(bank_id));
CREATE TABLE account  (account_number INT PRIMARY KEY,
                       account_type ENUM('CHECKING','SAVINGS') NOT NULL,        -- discriminator
                       balance DECIMAL(15,2) NOT NULL DEFAULT 0);
CREATE TABLE checking_account (account_number INT PRIMARY KEY, last_deposit_amount DECIMAL(15,2),
                       FOREIGN KEY (account_number) REFERENCES account(account_number));
CREATE TABLE savings_account  (account_number INT PRIMARY KEY, interest DECIMAL(5,2) NOT NULL,
                       FOREIGN KEY (account_number) REFERENCES account(account_number));
CREATE TABLE card_account (card_id INT, account_number INT,
                       PRIMARY KEY (card_id, account_number),                   -- association class
                       FOREIGN KEY (card_id) REFERENCES debit_card(card_id),
                       FOREIGN KEY (account_number) REFERENCES account(account_number));
CREATE TABLE customer_account (customer_id INT, account_number INT,
                       PRIMARY KEY (customer_id, account_number),               -- M:N
                       FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
                       FOREIGN KEY (account_number) REFERENCES account(account_number));</pre>
<p class="ghi-chu">The PIN is stored as a hash (<code>pin_hash</code>), never as the digits — the slide's "PIN" is an analysis attribute, not a storage format.</p>
<div class="pitfall co-tieu-de"><strong>Mistakes seen in team projects.</strong> (1) Option 1 without the shared id — two ids per person (G5's variant). (2) Option 3 with no CHECK — a Freelancer row carrying a company name. (3) The discriminator stored twice — <code>user.role_id</code> and a <code>user_type</code> string that drift apart. (4) Choosing option 2 and then writing a report screen that lists "all users".</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>The same three options in JPA / Hibernate.</strong> <code>@Inheritance(strategy = JOINED)</code> = option 1 (with <code>@DiscriminatorColumn</code> optional), <code>TABLE_PER_CLASS</code> = option 2, <code>SINGLE_TABLE</code> = option 3 (discriminator required). If your Java team later moves from JDBC/DAO to Spring Data JPA, the database design you chose here maps one-to-one onto an annotation. <em>Outside the syllabus because the recommended stack is plain JDBC with NetBeans.</em></div>`,
  `<h2>🏦 Ví dụ Banking dựng lại theo cách 1 — MySQL 8</h2>
<p>Slide 24 chọn "chỉ bảng con" và phải trả giá bằng giả định về số tài khoản. Với cách 1, mọi bảng nối đều có FK thật. Hãy so sánh hai bản và sẵn sàng bảo vệ bản nào cũng được.</p>
<pre>CREATE TABLE bank     (bank_id INT PRIMARY KEY, bank_name VARCHAR(100) NOT NULL, address VARCHAR(255));
CREATE TABLE atm_info (bank_id INT, atm_id INT, location VARCHAR(100), address VARCHAR(255),
                       PRIMARY KEY (bank_id, atm_id),                          -- bộ phận 1-n (slide 16)
                       FOREIGN KEY (bank_id) REFERENCES bank(bank_id));
CREATE TABLE customer (customer_id INT PRIMARY KEY, customer_name VARCHAR(100) NOT NULL,
                       customer_address VARCHAR(255));
CREATE TABLE debit_card (card_id INT PRIMARY KEY, pin_hash VARCHAR(100) NOT NULL,
                       start_date DATE, expiration_date DATE, status TINYINT,
                       card_limit DECIMAL(15,2), total DECIMAL(15,2),
                       customer_id INT NOT NULL UNIQUE,                         -- 0..1 (slide 10)
                       bank_id INT NOT NULL,                                    -- Bank Manages card
                       FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
                       FOREIGN KEY (bank_id) REFERENCES bank(bank_id));
CREATE TABLE account  (account_number INT PRIMARY KEY,
                       account_type ENUM('CHECKING','SAVINGS') NOT NULL,        -- discriminator
                       balance DECIMAL(15,2) NOT NULL DEFAULT 0);
CREATE TABLE checking_account (account_number INT PRIMARY KEY, last_deposit_amount DECIMAL(15,2),
                       FOREIGN KEY (account_number) REFERENCES account(account_number));
CREATE TABLE savings_account  (account_number INT PRIMARY KEY, interest DECIMAL(5,2) NOT NULL,
                       FOREIGN KEY (account_number) REFERENCES account(account_number));
CREATE TABLE card_account (card_id INT, account_number INT,
                       PRIMARY KEY (card_id, account_number),                   -- association class
                       FOREIGN KEY (card_id) REFERENCES debit_card(card_id),
                       FOREIGN KEY (account_number) REFERENCES account(account_number));
CREATE TABLE customer_account (customer_id INT, account_number INT,
                       PRIMARY KEY (customer_id, account_number),               -- M:N
                       FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
                       FOREIGN KEY (account_number) REFERENCES account(account_number));</pre>
<p class="ghi-chu">PIN được lưu dạng băm (<code>pin_hash</code>), không bao giờ lưu nguyên các chữ số — "PIN" trên slide là thuộc tính ở mức phân tích, không phải định dạng lưu trữ.</p>
<div class="pitfall co-tieu-de"><strong>Lỗi hay gặp trong đồ án nhóm.</strong> (1) Cách 1 mà không có id dùng chung — một người hai id (biến thể của G5). (2) Cách 3 mà không có CHECK — một dòng Freelancer mang tên công ty. (3) Discriminator lưu hai lần — <code>user.role_id</code> và chuỗi <code>user_type</code>, rồi lệch nhau. (4) Chọn cách 2 rồi lại làm màn báo cáo liệt kê "mọi user".</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Cùng ba cách ấy trong JPA / Hibernate.</strong> <code>@Inheritance(strategy = JOINED)</code> = cách 1 (có thể thêm <code>@DiscriminatorColumn</code>), <code>TABLE_PER_CLASS</code> = cách 2, <code>SINGLE_TABLE</code> = cách 3 (bắt buộc discriminator). Nếu sau này nhóm Java chuyển từ JDBC/DAO sang Spring Data JPA, thiết kế CSDL bạn chọn ở đây ánh xạ một-một thành một annotation. <em>Ngoài giáo trình vì stack được khuyến nghị là JDBC thuần với NetBeans.</em></div>`),
  books([
    ['gomaa', 'Ch. 7 Static Modeling — generalisation/specialisation hierarchies; the relational mapping section the deck cites (Ch. 15), source of the Banking System example', 'Ch. 7 Static Modeling — cây generalisation/specialisation; phần ánh xạ quan hệ mà slide dẫn (Ch. 15), nguồn của ví dụ Banking System'],
    ['fowler', 'Ch. 5 Class Diagrams: Advanced Concepts (generalisation, discriminators)', 'Ch. 5 Class Diagrams: Advanced Concepts (generalisation, discriminator)'],
  ]),
].join('\n');

/* ═════════════ LESSON 3.9 — the G5 sample database: reverse-engineered ERD, review, MySQL 8 DDL ═════════════ */
// SCHEMA ONLY. The INSERT rows of g5.sql contain real students' names, e-mails and phones — never quote them.
const L4_INTRO = bi(`<span class="eyebrow">Chapter 3 · Lesson 3.9 · Case study: the G5 sample database</span>
<h2>Reviewing a real SWP391 database — the G5 "Job IT for Freelancer" schema</h2>
<p class="lead">The teacher's sample package includes the SQL Server script of team G5 (22 tables, one database named <code>freelancer</code>). It is a real, passing SWP391 project — not a model answer. In this lesson you reverse-engineer its ERD from the script, review it against the rules of the Database Design deck, and rewrite its core in MySQL 8, the DBMS the course recommends.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li><strong>Reverse-engineer</strong> an ERD (entities, keys, relationships) from a CREATE/ALTER script</li>
<li><strong>Review</strong> a schema with a checklist: keys, constraints, types, naming, normalisation, security</li>
<li><strong>Rewrite</strong> SQL Server DDL as MySQL 8 DDL (IDENTITY → AUTO_INCREMENT, NVARCHAR → utf8mb4 VARCHAR, BIT → BOOLEAN)</li>
<li><strong>Write</strong> the "Database Design" section of your RDS better than the sample does</li>
</ul></div>
<div class="pitfall co-tieu-de"><strong>Privacy.</strong> The sample's INSERT statements contain what look like real people's names, e-mails and phone numbers. This lesson uses the <em>schema</em> only. Do the same with any sample you receive, and never put real personal data in your own demo data.</div>`,
  `<span class="eyebrow">Chương 3 · Bài 3.9 · Case study: CSDL mẫu của G5</span>
<h2>Review một CSDL SWP391 thật — schema "Job IT for Freelancer" của nhóm G5</h2>
<p class="lead">Gói mẫu của thầy/cô có script SQL Server của nhóm G5 (22 bảng, một database tên <code>freelancer</code>). Đây là một đồ án SWP391 thật, đã qua môn — không phải đáp án mẫu. Trong bài này bạn dựng lại ERD từ script, review nó theo các quy tắc của bộ slide Database Design, và viết lại phần lõi bằng MySQL 8, hệ quản trị mà môn học khuyến nghị.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li><strong>Dựng ngược</strong> ERD (thực thể, khoá, quan hệ) từ một script CREATE/ALTER</li>
<li><strong>Review</strong> schema theo checklist: khoá, ràng buộc, kiểu, đặt tên, chuẩn hoá, bảo mật</li>
<li><strong>Viết lại</strong> DDL SQL Server thành DDL MySQL 8 (IDENTITY → AUTO_INCREMENT, NVARCHAR → VARCHAR utf8mb4, BIT → BOOLEAN)</li>
<li><strong>Viết</strong> mục "Database Design" trong RDS của nhóm tốt hơn bản mẫu</li>
</ul></div>
<div class="pitfall co-tieu-de"><strong>Quyền riêng tư.</strong> Các lệnh INSERT của bản mẫu chứa thứ trông như tên, e-mail, số điện thoại của người thật. Bài này chỉ dùng <em>schema</em>. Hãy làm như vậy với mọi bản mẫu bạn nhận được, và không bao giờ đưa dữ liệu cá nhân thật vào demo data của nhóm.</div>`);

// The 22 tables of g5.sql: [table, PK, foreign keys, meaning EN, meaning VI] — read from CREATE/ALTER only.
const G5_TABLES = [
  ['User', 'userID', 'roleID → Role', 'Login account: username, password, email, status, role, created date', 'Tài khoản đăng nhập: username, password, email, status, role, ngày tạo'],
  ['Role', 'roleID', '—', 'Lookup: SuperAdmin, Admin, Freelancer, Recruiter, Customer', 'Tra cứu: SuperAdmin, Admin, Freelancer, Recruiter, Customer'],
  ['Admin', 'adminID', 'userID → User (UNIQUE)', 'Admin profile (subclass of User)', 'Hồ sơ admin (class con của User)'],
  ['Recruiter', 'recruiterID', 'userID → User (UNIQUE)', 'Recruiter profile (subclass of User)', 'Hồ sơ recruiter (class con của User)'],
  ['Freelancer', 'freelanceID', 'userID → User (UNIQUE)', 'Freelancer profile (subclass of User)', 'Hồ sơ freelancer (class con của User)'],
  ['Company', 'companyID', 'recruiterID → Recruiter (UNIQUE), team_numberID → Team_Number', 'Company page of one recruiter', 'Trang công ty của một recruiter'],
  ['Team_Number', 'team_numberID', '—', 'Lookup: company size ranges', 'Tra cứu: quy mô công ty'],
  ['Post', 'postID', 'recruiterID, caID, job_type_ID → JobType, durationID', 'Job post with budget, quantity, expiry, moderation flags', 'Tin tuyển dụng có budget, số lượng, hạn, cờ duyệt'],
  ['Categories', 'caID', '—', 'Lookup: job categories', 'Tra cứu: danh mục việc'],
  ['JobType', 'jobID', '—', 'Lookup: Fresher, Junior, Middle, Senior, Intern', 'Tra cứu: Fresher, Junior, Middle, Senior, Intern'],
  ['Duration', 'durationID', '—', 'Lookup: Full Time, Part Time, Internship', 'Tra cứu: Full Time, Part Time, Internship'],
  ['JobApply', 'applyID', 'freelanceID, postID', 'Application (association class): status, date, resume', 'Đơn ứng tuyển (association class): trạng thái, ngày, CV'],
  ['FreelancerFavorites', 'favoritesID', 'freelanceID, postID', 'Posts saved by a freelancer (M:N link)', 'Bài freelancer đã lưu (bảng nối M:N)'],
  ['Report', 'ReportID', 'freelancerID, postID', 'A freelancer reports a post, with a message', 'Freelancer báo cáo một bài, kèm lời nhắn'],
  ['Mark', '<strong>none</strong>', 'RecruiterID, FreelancerID (both NULL-able)', 'A recruiter bookmarks a freelancer (M:N link)', 'Recruiter đánh dấu một freelancer (bảng nối M:N)'],
  ['Education', 'educationID', 'freelanceID, degreeID → Degree', 'Education entries of a freelancer', 'Các dòng học vấn của freelancer'],
  ['Degree', 'dregeeID', '—', 'Lookup: Bachelor, Master, Basic', 'Tra cứu: Cử nhân, Thạc sĩ, Cơ bản'],
  ['Experience', 'experienceID', 'freelanceID', 'Work experience entries of a freelancer', 'Các dòng kinh nghiệm của freelancer'],
  ['Skills', 'skillID', 'skill_set_ID, freelancerID', 'Freelancer ↔ skill link with level (association class)', 'Liên kết freelancer ↔ kỹ năng có level (association class)'],
  ['Skill_Set', 'skill_set_ID', 'ExpertiID → Expertise (NULL-able)', 'Catalogue of skills', 'Danh mục kỹ năng'],
  ['Expertise', 'ExpertiseID', '—', 'Lookup: skill groups (Language, Database, Domain, Other)', 'Tra cứu: nhóm kỹ năng (Language, Database, Domain, Other)'],
  ['Blogs', 'blogID', 'adminID → Admin', 'Blog articles written by admins', 'Bài blog do admin viết'],
];
const g5Table = (lang) => `<table>
<thead><tr><th>#</th><th>${lang === 'en' ? 'Table' : 'Bảng'}</th><th>PK</th><th>${lang === 'en' ? 'Foreign keys' : 'Khoá ngoại'}</th><th>${lang === 'en' ? 'Meaning' : 'Ý nghĩa'}</th></tr></thead>
<tbody>${G5_TABLES.map(([t, pk, fk, en, vi], i) => `<tr><td>${i + 1}</td><td><strong>${t}</strong></td><td>${pk}</td><td>${fk}</td><td>${lang === 'en' ? en : vi}</td></tr>`).join('')}</tbody>
</table>`;

const L4_BODY = [
  slide('g5-rds', 25, 'RDS §3.1 Database Design — a. Database Schema (SQL Server diagram) and the start of b. Table Descriptions',
    `<p class="y-chinh">🎯 This is how G5 documented its database in the RDS: an auto-generated SQL Server diagram plus one description row per table.</p>
<p class="nhan">What the page contains</p>
<ul>
<li><strong>a. Database Schema</strong> — the 22 tables with key symbols and relationship lines (SQL Server Management Studio diagram)</li>
<li><strong>b. Table Descriptions</strong> — No · Table · Description, where "description" is the column list copied from the CREATE script (pages 25–29)</li>
</ul>
<p class="nhan">How to do better in your RDS</p>
<ul>
<li><strong>Describe meaning, not syntax</strong> — use the SDS table format (Field, Type, PK/FK/UN/NN, Description) from lesson 3.1</li>
<li><strong>Make the diagram readable</strong> — group tables by feature; a picture where column names cannot be read at 100 % zoom earns no credit</li>
</ul>`,
    `<p class="y-chinh">🎯 Đây là cách G5 ghi CSDL vào RDS: một sơ đồ SQL Server tự sinh cộng một dòng mô tả cho mỗi bảng.</p>
<p class="nhan">Trang này có gì</p>
<ul>
<li><strong>a. Database Schema</strong> — 22 bảng với ký hiệu khoá và đường quan hệ (sơ đồ của SQL Server Management Studio)</li>
<li><strong>b. Table Descriptions</strong> — No · Table · Description, trong đó "description" là danh sách cột chép từ script CREATE (trang 25–29)</li>
</ul>
<p class="nhan">Làm tốt hơn trong RDS của nhóm</p>
<ul>
<li><strong>Mô tả ý nghĩa, không chép cú pháp</strong> — dùng định dạng bảng của SDS (Field, Type, PK/FK/UN/NN, Description) ở bài 3.1</li>
<li><strong>Làm sơ đồ đọc được</strong> — nhóm bảng theo tính năng; một hình mà ở zoom 100 % không đọc nổi tên cột thì không được điểm</li>
</ul>`),
  bi(`<h2>🔎 Step 1 — the reverse-engineered ERD: 22 entities</h2>
<p>Read only the <code>CREATE TABLE</code> and <code>ALTER TABLE … FOREIGN KEY / UNIQUE</code> statements (lines 1–387 and 1218–1366 of the script). The INSERT section in between is data, and here it is private data.</p>
${g5Table('en')}`,
  `<h2>🔎 Bước 1 — ERD dựng ngược: 22 thực thể</h2>
<p>Chỉ đọc các lệnh <code>CREATE TABLE</code> và <code>ALTER TABLE … FOREIGN KEY / UNIQUE</code> (dòng 1–387 và 1218–1366 của script). Phần INSERT ở giữa là dữ liệu, và ở đây là dữ liệu riêng tư.</p>
${g5Table('vi')}`),
  bi(`<h2>🔗 Step 2 — the relationships, classified with the deck's rules</h2>
<table>
<thead><tr><th>Relationship</th><th>Multiplicity</th><th>Implemented as</th><th>Deck rule</th></tr></thead>
<tbody>
<tr><td>Role — User</td><td>1 — *</td><td>FK <code>User.roleID</code></td><td>1:N (slide 11–12)</td></tr>
<tr><td>User — Admin / Recruiter / Freelancer</td><td>1 — 0..1 each</td><td>FK <code>userID</code> + UNIQUE in each subclass</td><td>Generalisation, option 1 variant (slide 19) + 0..1 (slide 10)</td></tr>
<tr><td>Recruiter — Company</td><td>1 — 0..1</td><td>FK <code>Company.recruiterID</code> + UNIQUE</td><td>0..1 (slide 10)</td></tr>
<tr><td>Team_Number — Company · Admin — Blogs</td><td>1 — *</td><td>FK</td><td>1:N</td></tr>
<tr><td>Recruiter / Categories / JobType / Duration — Post</td><td>1 — *</td><td>4 FKs in Post</td><td>1:N</td></tr>
<tr><td>Freelancer — Education, Experience</td><td>1 — *</td><td>FK <code>freelanceID</code></td><td>Composition, rule 3 (slide 16)</td></tr>
<tr><td>Degree — Education · Expertise — Skill_Set</td><td>1 — * · 0..1 — *</td><td>FK (Skill_Set's is NULL-able)</td><td>1:N</td></tr>
<tr><td>Freelancer — Post (apply)</td><td>* — *</td><td><code>JobApply</code> with status, date, resume</td><td>Association class (slides 13–15), surrogate id</td></tr>
<tr><td>Freelancer — Post (favourite, report)</td><td>* — *</td><td><code>FreelancerFavorites</code>, <code>Report</code></td><td>Associative relation, surrogate id</td></tr>
<tr><td>Freelancer — Skill_Set</td><td>* — *</td><td><code>Skills</code> with level</td><td>Association class</td></tr>
<tr><td>Recruiter — Freelancer (mark)</td><td>* — *</td><td><code>Mark</code>, no PK</td><td>Associative relation — <strong>broken</strong></td></tr>
</tbody>
</table>
<p class="ghi-chu">25 foreign-key constraints in total — every association is declared. That is better than many team projects.</p>`,
  `<h2>🔗 Bước 2 — các quan hệ, phân loại theo quy tắc của slide</h2>
<table>
<thead><tr><th>Quan hệ</th><th>Bội số</th><th>Cài đặt bằng</th><th>Quy tắc của slide</th></tr></thead>
<tbody>
<tr><td>Role — User</td><td>1 — *</td><td>FK <code>User.roleID</code></td><td>1:N (slide 11–12)</td></tr>
<tr><td>User — Admin / Recruiter / Freelancer</td><td>1 — 0..1 mỗi bảng</td><td>FK <code>userID</code> + UNIQUE ở mỗi bảng con</td><td>Generalisation, biến thể cách 1 (slide 19) + 0..1 (slide 10)</td></tr>
<tr><td>Recruiter — Company</td><td>1 — 0..1</td><td>FK <code>Company.recruiterID</code> + UNIQUE</td><td>0..1 (slide 10)</td></tr>
<tr><td>Team_Number — Company · Admin — Blogs</td><td>1 — *</td><td>FK</td><td>1:N</td></tr>
<tr><td>Recruiter / Categories / JobType / Duration — Post</td><td>1 — *</td><td>4 FK trong Post</td><td>1:N</td></tr>
<tr><td>Freelancer — Education, Experience</td><td>1 — *</td><td>FK <code>freelanceID</code></td><td>Composition, quy tắc 3 (slide 16)</td></tr>
<tr><td>Degree — Education · Expertise — Skill_Set</td><td>1 — * · 0..1 — *</td><td>FK (của Skill_Set cho phép NULL)</td><td>1:N</td></tr>
<tr><td>Freelancer — Post (ứng tuyển)</td><td>* — *</td><td><code>JobApply</code> có status, ngày, CV</td><td>Association class (slide 13–15), id thay thế</td></tr>
<tr><td>Freelancer — Post (yêu thích, báo cáo)</td><td>* — *</td><td><code>FreelancerFavorites</code>, <code>Report</code></td><td>Bảng liên kết, id thay thế</td></tr>
<tr><td>Freelancer — Skill_Set</td><td>* — *</td><td><code>Skills</code> có level</td><td>Association class</td></tr>
<tr><td>Recruiter — Freelancer (đánh dấu)</td><td>* — *</td><td><code>Mark</code>, không PK</td><td>Bảng liên kết — <strong>hỏng</strong></td></tr>
</tbody>
</table>
<p class="ghi-chu">Tổng cộng 25 ràng buộc khoá ngoại — mọi quan hệ đều được khai báo. Tốt hơn nhiều đồ án nhóm.</p>`),
  bi(`<h2>🩺 Step 3 — the review: what G5 did well, and 20 findings</h2>
<p class="nhan">Done well (keep these habits)</p>
<ul>
<li><strong>21 of 22 tables have a PK</strong>; all 25 associations are declared FKs</li>
<li><strong>0..1 enforced with UNIQUE</strong> on <code>userID</code> in Admin / Recruiter / Freelancer and on <code>Company.recruiterID</code></li>
<li><strong>Lookup tables</strong> for job type, duration, category, degree, team size — no hard-coded lists in Java</li>
</ul>
<p class="nhan">Keys and constraints</p>
<ol>
<li><strong>Mark has no PK</strong>, and both its FKs are NULL-able — a bookmark "of nobody" is legal (slide 7).</li>
<li><strong>No UNIQUE on <code>User.username</code> or <code>User.email</code></strong> — two accounts can share a login.</li>
<li><strong>No UNIQUE pair</strong> on JobApply, FreelancerFavorites, Skills, Mark — duplicates allowed (slide 15).</li>
<li><strong>No CHECK</strong>: end_date ≥ start_date, quantity &gt; 0, budget ≥ 0, level range.</li>
<li><strong>No DEFAULT</strong> for <code>CreateDate</code>, <code>dateApply</code>, statuses — every INSERT in Java must remember them.</li>
<li><strong>No ON DELETE policy</strong> — deleting a freelancer fails while an education row exists; the code has to delete children by hand.</li>
</ol>
<p class="nhan">Types</p>
<ol start="7">
<li><strong>Status stored four ways</strong>: <code>bit</code> (statusBlog), <code>int</code> (Post.status, Post.checking), <code>nvarchar</code> 'active'/'inactive' (User), <code>nvarchar</code> holding '0'/'1'/'2' (JobApply).</li>
<li><strong>Money as <code>int</code></strong> (<code>Post.budget</code>) — no currency, no decimals.</li>
<li><strong>Lengths that will break</strong>: <code>Post.title nvarchar(50)</code>; contact e-mail <code>nvarchar(30)</code>; <code>Recruiter.image varchar(100)</code> while others use 220.</li>
<li><strong>Date only</strong> for applications and posts — two applications on one day cannot be ordered.</li>
</ol>
<p class="nhan">Naming</p>
<ol start="11">
<li><strong>Typos frozen into the schema</strong>: <code>dregeeID</code>, <code>messeage</code>, <code>email__contact</code>, <code>ExpertiID</code>, and lookup values "Orther", "Custormer".</li>
<li><strong>Same thing, different names</strong>: <code>freelanceID</code> vs <code>freelancerID</code>; <code>job_type_ID</code> → <code>jobID</code>; <code>ReportID</code> vs <code>postID</code>.</li>
<li><strong>Mixed plural/singular</strong> (Blogs, Categories, Skills vs Post, Company) and <strong>reserved words</strong> as names (<code>User</code>, <code>describe</code>) that need quoting.</li>
<li><strong><code>Skills</code> is the link table</strong> and <code>Skill_Set</code> the catalogue — the names suggest the opposite.</li>
</ol>
<p class="nhan">Normalisation and design</p>
<ol start="15">
<li><strong>1NF</strong> — <code>Post.skill nvarchar(50)</code> free text duplicates the skills catalogue.</li>
<li><strong>Redundancy</strong> — e-mail in User and again in Admin / Freelancer / Recruiter; names in three subclass tables.</li>
<li><strong>Two ids per person</strong> — generalisation without the shared id (lesson 3.8).</li>
<li><strong>Admin appears twice</strong> — as a Role value (SuperAdmin, Admin) and as a table; the role "Customer" has no table and no use case.</li>
<li><strong>Report has no status</strong> — the admin cannot mark a report as handled.</li>
</ol>
<p class="nhan">Security</p>
<ol start="20">
<li><strong>Passwords</strong> — <code>password nvarchar(50)</code> holds a 28-character Base64 SHA-1 digest without salt; every demo account has the same digest, i.e. the same password. Use BCrypt/Argon2 in <code>VARCHAR(255)</code>.</li>
</ol>`,
  `<h2>🩺 Bước 3 — review: G5 làm tốt gì, và 20 phát hiện</h2>
<p class="nhan">Làm tốt (hãy giữ thói quen này)</p>
<ul>
<li><strong>21/22 bảng có PK</strong>; cả 25 quan hệ đều là FK được khai báo</li>
<li><strong>0..1 được ép bằng UNIQUE</strong> trên <code>userID</code> ở Admin / Recruiter / Freelancer và trên <code>Company.recruiterID</code></li>
<li><strong>Bảng tra cứu</strong> cho job type, duration, category, degree, quy mô — không cứng danh sách trong Java</li>
</ul>
<p class="nhan">Khoá và ràng buộc</p>
<ol>
<li><strong>Mark không có PK</strong>, và cả hai FK cho phép NULL — một dấu "của không ai" vẫn hợp lệ (slide 7).</li>
<li><strong>Không UNIQUE trên <code>User.username</code> hay <code>User.email</code></strong> — hai tài khoản có thể chung thông tin đăng nhập.</li>
<li><strong>Không có cặp UNIQUE</strong> ở JobApply, FreelancerFavorites, Skills, Mark — cho phép dòng trùng (slide 15).</li>
<li><strong>Không có CHECK</strong>: end_date ≥ start_date, quantity &gt; 0, budget ≥ 0, khoảng của level.</li>
<li><strong>Không có DEFAULT</strong> cho <code>CreateDate</code>, <code>dateApply</code>, trạng thái — mọi lệnh INSERT trong Java phải tự nhớ.</li>
<li><strong>Không có chính sách ON DELETE</strong> — xoá freelancer thất bại khi còn dòng học vấn; code phải tự xoá bảng con.</li>
</ol>
<p class="nhan">Kiểu dữ liệu</p>
<ol start="7">
<li><strong>Trạng thái lưu bốn kiểu</strong>: <code>bit</code> (statusBlog), <code>int</code> (Post.status, Post.checking), <code>nvarchar</code> 'active'/'inactive' (User), <code>nvarchar</code> chứa '0'/'1'/'2' (JobApply).</li>
<li><strong>Tiền là <code>int</code></strong> (<code>Post.budget</code>) — không đơn vị, không phần thập phân.</li>
<li><strong>Độ dài sẽ vỡ</strong>: <code>Post.title nvarchar(50)</code>; e-mail liên hệ <code>nvarchar(30)</code>; <code>Recruiter.image varchar(100)</code> trong khi chỗ khác dùng 220.</li>
<li><strong>Chỉ có ngày</strong> cho đơn ứng tuyển và bài đăng — hai đơn trong cùng ngày không sắp được thứ tự.</li>
</ol>
<p class="nhan">Đặt tên</p>
<ol start="11">
<li><strong>Lỗi chính tả đóng băng vào schema</strong>: <code>dregeeID</code>, <code>messeage</code>, <code>email__contact</code>, <code>ExpertiID</code>, và giá trị tra cứu "Orther", "Custormer".</li>
<li><strong>Cùng một thứ, khác tên</strong>: <code>freelanceID</code> và <code>freelancerID</code>; <code>job_type_ID</code> → <code>jobID</code>; <code>ReportID</code> và <code>postID</code>.</li>
<li><strong>Lẫn số nhiều/số ít</strong> (Blogs, Categories, Skills và Post, Company) và <strong>từ khoá dành riêng</strong> làm tên (<code>User</code>, <code>describe</code>) phải đặt trong ngoặc.</li>
<li><strong><code>Skills</code> là bảng nối</strong> còn <code>Skill_Set</code> là danh mục — tên gợi ý điều ngược lại.</li>
</ol>
<p class="nhan">Chuẩn hoá và thiết kế</p>
<ol start="15">
<li><strong>1NF</strong> — <code>Post.skill nvarchar(50)</code> chữ tự do trùng lặp với danh mục kỹ năng.</li>
<li><strong>Dư thừa</strong> — e-mail trong User và lại trong Admin / Freelancer / Recruiter; tên nằm ở ba bảng con.</li>
<li><strong>Một người hai id</strong> — generalisation không dùng id chung (bài 3.8).</li>
<li><strong>Admin xuất hiện hai lần</strong> — là giá trị Role (SuperAdmin, Admin) và là bảng; role "Customer" không có bảng và không có use case.</li>
<li><strong>Report không có trạng thái</strong> — admin không đánh dấu được báo cáo đã xử lý.</li>
</ol>
<p class="nhan">Bảo mật</p>
<ol start="20">
<li><strong>Mật khẩu</strong> — <code>password nvarchar(50)</code> chứa chuỗi băm SHA-1 dạng Base64 28 ký tự, không có salt; mọi tài khoản demo có cùng chuỗi băm, tức cùng mật khẩu. Dùng BCrypt/Argon2 trong <code>VARCHAR(255)</code>.</li>
</ol>`),
  bi(`<h2>🛠️ Step 4 — the corrected core in MySQL 8 (part 1: accounts and profiles)</h2>
<p>Conventions: <code>snake_case</code>, singular table names, <code>&lt;table&gt;_id</code> keys, InnoDB + <code>utf8mb4</code> (Vietnamese text and emoji), generalisation option 1 with a <strong>shared id</strong>, statuses as ENUM.</p>
<pre>CREATE DATABASE job_it CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE job_it;

CREATE TABLE role (
  role_id   TINYINT PRIMARY KEY,
  role_name VARCHAR(30) NOT NULL UNIQUE                  -- ADMIN, RECRUITER, FREELANCER
) ENGINE = InnoDB;

CREATE TABLE user_account (                              -- superclass; "user" is a reserved word
  user_id       INT PRIMARY KEY AUTO_INCREMENT,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,                   -- BCrypt, never plain / unsalted SHA-1
  role_id       TINYINT NOT NULL,                        -- discriminator
  status        ENUM('ACTIVE','LOCKED','UNVERIFIED') NOT NULL DEFAULT 'UNVERIFIED',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(role_id)
) ENGINE = InnoDB;

CREATE TABLE freelancer (                                -- subclass: shared id (slide 19)
  user_id     INT PRIMARY KEY,
  first_name  VARCHAR(50) NOT NULL,
  last_name   VARCHAR(50) NOT NULL,
  gender      ENUM('MALE','FEMALE','OTHER') NULL,
  dob         DATE NULL,
  phone       VARCHAR(20) NULL,
  about       TEXT NULL,
  avatar_url  VARCHAR(500) NULL,
  CONSTRAINT fk_freelancer_user FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE recruiter (
  user_id     INT PRIMARY KEY,
  first_name  VARCHAR(50) NOT NULL,
  last_name   VARCHAR(50) NOT NULL,
  phone       VARCHAR(20) NULL,
  CONSTRAINT fk_recruiter_user FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE team_size (team_size_id TINYINT PRIMARY KEY, label VARCHAR(50) NOT NULL UNIQUE);

CREATE TABLE company (
  company_id     INT PRIMARY KEY AUTO_INCREMENT,
  recruiter_id   INT NOT NULL UNIQUE,                    -- 1 recruiter : 0..1 company
  company_name   VARCHAR(150) NOT NULL,
  team_size_id   TINYINT NOT NULL,
  established_on DATE NULL,
  website        VARCHAR(255) NULL,
  location       VARCHAR(255) NULL,
  description    TEXT NULL,
  CONSTRAINT fk_company_recruiter FOREIGN KEY (recruiter_id) REFERENCES recruiter(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_company_size FOREIGN KEY (team_size_id) REFERENCES team_size(team_size_id)
) ENGINE = InnoDB;</pre>
<p class="ghi-chu">Admin needs no extra table here: it has no fields beyond User. Add one (with the shared id) only when an admin screen needs admin-only data.</p>`,
  `<h2>🛠️ Bước 4 — phần lõi đã sửa bằng MySQL 8 (phần 1: tài khoản và hồ sơ)</h2>
<p>Quy ước: <code>snake_case</code>, tên bảng số ít, khoá <code>&lt;bảng&gt;_id</code>, InnoDB + <code>utf8mb4</code> (tiếng Việt và emoji), generalisation cách 1 với <strong>id dùng chung</strong>, trạng thái là ENUM.</p>
<pre>CREATE DATABASE job_it CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE job_it;

CREATE TABLE role (
  role_id   TINYINT PRIMARY KEY,
  role_name VARCHAR(30) NOT NULL UNIQUE                  -- ADMIN, RECRUITER, FREELANCER
) ENGINE = InnoDB;

CREATE TABLE user_account (                              -- bảng cha; "user" là từ khoá dành riêng
  user_id       INT PRIMARY KEY AUTO_INCREMENT,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,                   -- BCrypt, không bao giờ để thô / SHA-1 không salt
  role_id       TINYINT NOT NULL,                        -- discriminator
  status        ENUM('ACTIVE','LOCKED','UNVERIFIED') NOT NULL DEFAULT 'UNVERIFIED',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(role_id)
) ENGINE = InnoDB;

CREATE TABLE freelancer (                                -- bảng con: id dùng chung (slide 19)
  user_id     INT PRIMARY KEY,
  first_name  VARCHAR(50) NOT NULL,
  last_name   VARCHAR(50) NOT NULL,
  gender      ENUM('MALE','FEMALE','OTHER') NULL,
  dob         DATE NULL,
  phone       VARCHAR(20) NULL,
  about       TEXT NULL,
  avatar_url  VARCHAR(500) NULL,
  CONSTRAINT fk_freelancer_user FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE recruiter (
  user_id     INT PRIMARY KEY,
  first_name  VARCHAR(50) NOT NULL,
  last_name   VARCHAR(50) NOT NULL,
  phone       VARCHAR(20) NULL,
  CONSTRAINT fk_recruiter_user FOREIGN KEY (user_id) REFERENCES user_account(user_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE team_size (team_size_id TINYINT PRIMARY KEY, label VARCHAR(50) NOT NULL UNIQUE);

CREATE TABLE company (
  company_id     INT PRIMARY KEY AUTO_INCREMENT,
  recruiter_id   INT NOT NULL UNIQUE,                    -- 1 recruiter : 0..1 company
  company_name   VARCHAR(150) NOT NULL,
  team_size_id   TINYINT NOT NULL,
  established_on DATE NULL,
  website        VARCHAR(255) NULL,
  location       VARCHAR(255) NULL,
  description    TEXT NULL,
  CONSTRAINT fk_company_recruiter FOREIGN KEY (recruiter_id) REFERENCES recruiter(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_company_size FOREIGN KEY (team_size_id) REFERENCES team_size(team_size_id)
) ENGINE = InnoDB;</pre>
<p class="ghi-chu">Admin không cần bảng riêng ở đây: nó không có trường nào ngoài User. Chỉ thêm bảng (với id dùng chung) khi một màn admin cần dữ liệu riêng của admin.</p>`),
  bi(`<h2>🛠️ Step 4 — the corrected core in MySQL 8 (part 2: posts and the M:N tables)</h2>
<pre>CREATE TABLE category (category_id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(80) NOT NULL UNIQUE,
                       is_active BOOLEAN NOT NULL DEFAULT TRUE);
CREATE TABLE job_level (job_level_id TINYINT PRIMARY KEY, name VARCHAR(30) NOT NULL UNIQUE);     -- was JobType
CREATE TABLE work_type (work_type_id TINYINT PRIMARY KEY, name VARCHAR(30) NOT NULL UNIQUE);     -- was Duration
CREATE TABLE skill     (skill_id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(80) NOT NULL UNIQUE,
                        skill_group ENUM('LANGUAGE','DATABASE','DOMAIN','OTHER') NOT NULL);    -- Skill_Set + Expertise

CREATE TABLE post (
  post_id      INT PRIMARY KEY AUTO_INCREMENT,
  recruiter_id INT NOT NULL,
  category_id  INT NOT NULL,
  job_level_id TINYINT NOT NULL,
  work_type_id TINYINT NOT NULL,
  title        VARCHAR(150) NOT NULL,
  description  TEXT NULL,
  quantity     SMALLINT NOT NULL CHECK (quantity &gt; 0),
  budget       DECIMAL(12,2) NULL CHECK (budget &gt;= 0),     -- NULL = negotiable
  location     VARCHAR(150) NULL,
  posted_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at   DATETIME NOT NULL,
  status       ENUM('PENDING','APPROVED','REJECTED','CLOSED') NOT NULL DEFAULT 'PENDING',  -- was status + checking
  CHECK (expires_at &gt; posted_at),
  FOREIGN KEY (recruiter_id) REFERENCES recruiter(user_id),
  FOREIGN KEY (category_id)  REFERENCES category(category_id),
  FOREIGN KEY (job_level_id) REFERENCES job_level(job_level_id),
  FOREIGN KEY (work_type_id) REFERENCES work_type(work_type_id),
  INDEX ix_post_status_expiry (status, expires_at)          -- the public job list filters on these
) ENGINE = InnoDB;

CREATE TABLE post_skill (                                   -- replaces the free-text Post.skill (1NF)
  post_id INT NOT NULL, skill_id INT NOT NULL,
  PRIMARY KEY (post_id, skill_id),
  FOREIGN KEY (post_id)  REFERENCES post(post_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skill(skill_id)
) ENGINE = InnoDB;

CREATE TABLE job_apply (                                    -- association class, surrogate id + UNIQUE pair
  apply_id      INT PRIMARY KEY AUTO_INCREMENT,
  freelancer_id INT NOT NULL,
  post_id       INT NOT NULL,
  cv_url        VARCHAR(500) NOT NULL,
  applied_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status        ENUM('PENDING','ACCEPTED','REJECTED','WITHDRAWN') NOT NULL DEFAULT 'PENDING',
  CONSTRAINT uq_apply UNIQUE (freelancer_id, post_id),
  FOREIGN KEY (freelancer_id) REFERENCES freelancer(user_id) ON DELETE CASCADE,
  FOREIGN KEY (post_id)       REFERENCES post(post_id)
) ENGINE = InnoDB;

CREATE TABLE favorite_post (                                -- was FreelancerFavorites
  freelancer_id INT NOT NULL, post_id INT NOT NULL,
  saved_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (freelancer_id, post_id),
  FOREIGN KEY (freelancer_id) REFERENCES freelancer(user_id) ON DELETE CASCADE,
  FOREIGN KEY (post_id)       REFERENCES post(post_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE freelancer_bookmark (                          -- was Mark: now with a PK and NOT NULL FKs
  recruiter_id INT NOT NULL, freelancer_id INT NOT NULL,
  marked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (recruiter_id, freelancer_id),
  FOREIGN KEY (recruiter_id)  REFERENCES recruiter(user_id) ON DELETE CASCADE,
  FOREIGN KEY (freelancer_id) REFERENCES freelancer(user_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE post_report (
  report_id     INT PRIMARY KEY AUTO_INCREMENT,
  freelancer_id INT NOT NULL,
  post_id       INT NOT NULL,
  message       VARCHAR(1000) NOT NULL,
  reported_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status        ENUM('OPEN','RESOLVED','DISMISSED') NOT NULL DEFAULT 'OPEN',   -- was missing
  FOREIGN KEY (freelancer_id) REFERENCES freelancer(user_id) ON DELETE CASCADE,
  FOREIGN KEY (post_id)       REFERENCES post(post_id) ON DELETE CASCADE
) ENGINE = InnoDB;</pre>
<p class="ghi-chu">Education, experience and freelancer_skill follow the DDL of lesson 3.7 with <code>freelancer(user_id)</code> as the parent key; blog follows the same pattern with an FK to <code>user_account</code>. That is 18 tables instead of 22, with every finding above resolved.</p>`,
  `<h2>🛠️ Bước 4 — phần lõi đã sửa bằng MySQL 8 (phần 2: bài đăng và các bảng M:N)</h2>
<pre>CREATE TABLE category (category_id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(80) NOT NULL UNIQUE,
                       is_active BOOLEAN NOT NULL DEFAULT TRUE);
CREATE TABLE job_level (job_level_id TINYINT PRIMARY KEY, name VARCHAR(30) NOT NULL UNIQUE);     -- trước là JobType
CREATE TABLE work_type (work_type_id TINYINT PRIMARY KEY, name VARCHAR(30) NOT NULL UNIQUE);     -- trước là Duration
CREATE TABLE skill     (skill_id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(80) NOT NULL UNIQUE,
                        skill_group ENUM('LANGUAGE','DATABASE','DOMAIN','OTHER') NOT NULL);    -- gộp Skill_Set + Expertise

CREATE TABLE post (
  post_id      INT PRIMARY KEY AUTO_INCREMENT,
  recruiter_id INT NOT NULL,
  category_id  INT NOT NULL,
  job_level_id TINYINT NOT NULL,
  work_type_id TINYINT NOT NULL,
  title        VARCHAR(150) NOT NULL,
  description  TEXT NULL,
  quantity     SMALLINT NOT NULL CHECK (quantity &gt; 0),
  budget       DECIMAL(12,2) NULL CHECK (budget &gt;= 0),     -- NULL = thoả thuận
  location     VARCHAR(150) NULL,
  posted_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at   DATETIME NOT NULL,
  status       ENUM('PENDING','APPROVED','REJECTED','CLOSED') NOT NULL DEFAULT 'PENDING',  -- thay status + checking
  CHECK (expires_at &gt; posted_at),
  FOREIGN KEY (recruiter_id) REFERENCES recruiter(user_id),
  FOREIGN KEY (category_id)  REFERENCES category(category_id),
  FOREIGN KEY (job_level_id) REFERENCES job_level(job_level_id),
  FOREIGN KEY (work_type_id) REFERENCES work_type(work_type_id),
  INDEX ix_post_status_expiry (status, expires_at)          -- danh sách việc công khai lọc theo hai cột này
) ENGINE = InnoDB;

CREATE TABLE post_skill (                                   -- thay cột chữ tự do Post.skill (1NF)
  post_id INT NOT NULL, skill_id INT NOT NULL,
  PRIMARY KEY (post_id, skill_id),
  FOREIGN KEY (post_id)  REFERENCES post(post_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skill(skill_id)
) ENGINE = InnoDB;

CREATE TABLE job_apply (                                    -- association class, id thay thế + cặp UNIQUE
  apply_id      INT PRIMARY KEY AUTO_INCREMENT,
  freelancer_id INT NOT NULL,
  post_id       INT NOT NULL,
  cv_url        VARCHAR(500) NOT NULL,
  applied_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status        ENUM('PENDING','ACCEPTED','REJECTED','WITHDRAWN') NOT NULL DEFAULT 'PENDING',
  CONSTRAINT uq_apply UNIQUE (freelancer_id, post_id),
  FOREIGN KEY (freelancer_id) REFERENCES freelancer(user_id) ON DELETE CASCADE,
  FOREIGN KEY (post_id)       REFERENCES post(post_id)
) ENGINE = InnoDB;

CREATE TABLE favorite_post (                                -- trước là FreelancerFavorites
  freelancer_id INT NOT NULL, post_id INT NOT NULL,
  saved_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (freelancer_id, post_id),
  FOREIGN KEY (freelancer_id) REFERENCES freelancer(user_id) ON DELETE CASCADE,
  FOREIGN KEY (post_id)       REFERENCES post(post_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE freelancer_bookmark (                          -- trước là Mark: nay có PK và FK NOT NULL
  recruiter_id INT NOT NULL, freelancer_id INT NOT NULL,
  marked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (recruiter_id, freelancer_id),
  FOREIGN KEY (recruiter_id)  REFERENCES recruiter(user_id) ON DELETE CASCADE,
  FOREIGN KEY (freelancer_id) REFERENCES freelancer(user_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE post_report (
  report_id     INT PRIMARY KEY AUTO_INCREMENT,
  freelancer_id INT NOT NULL,
  post_id       INT NOT NULL,
  message       VARCHAR(1000) NOT NULL,
  reported_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status        ENUM('OPEN','RESOLVED','DISMISSED') NOT NULL DEFAULT 'OPEN',   -- trước đây thiếu
  FOREIGN KEY (freelancer_id) REFERENCES freelancer(user_id) ON DELETE CASCADE,
  FOREIGN KEY (post_id)       REFERENCES post(post_id) ON DELETE CASCADE
) ENGINE = InnoDB;</pre>
<p class="ghi-chu">Education, experience và freelancer_skill theo DDL của bài 3.7 với khoá cha là <code>freelancer(user_id)</code>; blog cùng mẫu với FK tới <code>user_account</code>. Tổng cộng 18 bảng thay vì 22, và mọi phát hiện ở trên đều đã được xử lý.</p>`),
  bi(`<h2>🔁 SQL Server → MySQL 8 — the conversion table</h2>
<table>
<thead><tr><th>G5 (SQL Server)</th><th>MySQL 8</th><th>Note</th></tr></thead>
<tbody>
<tr><td><code>int IDENTITY(1,1)</code></td><td><code>INT AUTO_INCREMENT</code></td><td>Only one AUTO_INCREMENT per table, and it must be a key</td></tr>
<tr><td><code>nvarchar(n)</code></td><td><code>VARCHAR(n)</code> with <code>utf8mb4</code></td><td>Unicode comes from the charset, not an N prefix</td></tr>
<tr><td><code>nvarchar(max)</code></td><td><code>TEXT</code> / <code>MEDIUMTEXT</code></td><td>TEXT holds 64 KB</td></tr>
<tr><td><code>bit</code></td><td><code>BOOLEAN</code> (<code>TINYINT(1)</code>)</td><td>Or better: an ENUM status</td></tr>
<tr><td><code>datetime</code></td><td><code>DATETIME</code></td><td><code>TIMESTAMP</code> converts to UTC and ends in 2038</td></tr>
<tr><td><code>[User]</code>, <code>[dbo].</code></td><td><code>user_account</code> (or back-ticks)</td><td>Avoid reserved words instead of quoting them</td></tr>
<tr><td><code>CLUSTERED</code> PK, <code>GO</code>, <code>WITH (PAD_INDEX …)</code></td><td>drop them</td><td>InnoDB always clusters on the PK</td></tr>
<tr><td>FK columns with no index</td><td>indexed automatically</td><td>InnoDB creates the index an FK needs; SQL Server does not</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Let the database draw the ERD back.</strong> After running your script, use MySQL Workbench → <em>Database → Reverse Engineer</em> to generate the diagram from the real schema, and compare it with the ERD in your SRS. Any line missing in the generated diagram is an FK you forgot to declare. <em>Outside the syllabus because the guides do not prescribe a modelling tool.</em></div>`,
  `<h2>🔁 SQL Server → MySQL 8 — bảng chuyển đổi</h2>
<table>
<thead><tr><th>G5 (SQL Server)</th><th>MySQL 8</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td><code>int IDENTITY(1,1)</code></td><td><code>INT AUTO_INCREMENT</code></td><td>Mỗi bảng chỉ một cột AUTO_INCREMENT, và nó phải là khoá</td></tr>
<tr><td><code>nvarchar(n)</code></td><td><code>VARCHAR(n)</code> với <code>utf8mb4</code></td><td>Unicode đến từ charset, không từ tiền tố N</td></tr>
<tr><td><code>nvarchar(max)</code></td><td><code>TEXT</code> / <code>MEDIUMTEXT</code></td><td>TEXT chứa 64 KB</td></tr>
<tr><td><code>bit</code></td><td><code>BOOLEAN</code> (<code>TINYINT(1)</code>)</td><td>Hoặc tốt hơn: một trạng thái ENUM</td></tr>
<tr><td><code>datetime</code></td><td><code>DATETIME</code></td><td><code>TIMESTAMP</code> tự đổi sang UTC và hết hạn năm 2038</td></tr>
<tr><td><code>[User]</code>, <code>[dbo].</code></td><td><code>user_account</code> (hoặc dấu back-tick)</td><td>Tránh từ khoá dành riêng thay vì phải đặt trong ngoặc</td></tr>
<tr><td>PK <code>CLUSTERED</code>, <code>GO</code>, <code>WITH (PAD_INDEX …)</code></td><td>bỏ đi</td><td>InnoDB luôn gom cụm theo PK</td></tr>
<tr><td>Cột FK không có index</td><td>tự có index</td><td>InnoDB tự tạo index mà FK cần; SQL Server thì không</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Để CSDL vẽ ngược lại ERD.</strong> Sau khi chạy script, dùng MySQL Workbench → <em>Database → Reverse Engineer</em> để sinh sơ đồ từ schema thật, rồi so với ERD trong SRS. Đường nối nào thiếu trên sơ đồ sinh ra là một FK bạn quên khai báo. <em>Ngoài giáo trình vì hướng dẫn không quy định công cụ vẽ mô hình.</em></div>`),
  books([
    ['gomaa', 'Ch. 7 Static Modeling and the relational design rules the review applies (deck "Chapter 15")', 'Ch. 7 Static Modeling và các quy tắc thiết kế quan hệ dùng để review (slide ghi "Chapter 15")'],
    ['sommerville', 'Ch. 13 Security Engineering — why passwords are stored as salted slow hashes', 'Ch. 13 Security Engineering — vì sao mật khẩu phải lưu bằng hàm băm chậm có salt'],
  ]),
].join('\n');

/* ═════════════ LESSON 3.10 — the teacher's Claude prompt #7: MySQL schema + demo data ═════════════ */
const L5_INTRO = bi(`<span class="eyebrow">Chapter 3 · Lesson 3.10 · AI-assisted database design</span>
<h2>Prompt #7 — letting Claude draft the MySQL schema and demo data, then proving it is right</h2>
<p class="lead">The teacher's guide folder ships <em>Claude_Prompts.txt</em>: nine prompts that take a Job Board System from an idea to test cases. Prompt #7 turns the ERD of prompt #5 into a MySQL database. It saves hours — and it produces exactly the mistakes this chapter warns about unless you check the output. The course allows AI, but every use goes into the <strong>AI Usage Report</strong> (Template5), and at the final presentation <em>you</em> answer for every table.</p>
<div class="callout"><strong>After this lesson you can:</strong>
<ul>
<li><strong>Place</strong> prompt #7 in the chain #5 (ERD) → #7 (DB) → #8 (technical design)</li>
<li><strong>Run</strong> it with the right attachments and an improved, SWP391-specific wording</li>
<li><strong>Verify</strong> the three output files with a checklist and SQL queries against information_schema</li>
<li><strong>Record</strong> what the AI produced and what you changed, for the AI Usage Report</li>
</ul></div>`,
  `<span class="eyebrow">Chương 3 · Bài 3.10 · Thiết kế CSDL có AI hỗ trợ</span>
<h2>Prompt #7 — để Claude soạn nháp schema MySQL và demo data, rồi chứng minh nó đúng</h2>
<p class="lead">Thư mục hướng dẫn của thầy/cô có file <em>Claude_Prompts.txt</em>: chín prompt đưa một Job Board System từ ý tưởng tới test case. Prompt #7 biến ERD của prompt #5 thành một CSDL MySQL. Nó tiết kiệm hàng giờ — và nó tạo ra đúng những lỗi chương này cảnh báo nếu bạn không kiểm tra đầu ra. Môn học cho phép dùng AI, nhưng mọi lần dùng phải ghi vào <strong>AI Usage Report</strong> (Template5), và ở buổi thuyết trình cuối <em>bạn</em> chịu trách nhiệm từng bảng.</p>
<div class="callout"><strong>Học xong bài này bạn có thể:</strong>
<ul>
<li><strong>Đặt</strong> prompt #7 vào chuỗi #5 (ERD) → #7 (DB) → #8 (thiết kế kỹ thuật)</li>
<li><strong>Chạy</strong> nó với đúng file đính kèm và một cách viết đã cải tiến, sát SWP391</li>
<li><strong>Kiểm chứng</strong> ba file đầu ra bằng checklist và câu SQL truy vấn information_schema</li>
<li><strong>Ghi lại</strong> AI đã tạo gì và bạn đã sửa gì, cho AI Usage Report</li>
</ul></div>`);

const L5_BODY = [
  bi(`<h2>📜 The prompt as the teacher wrote it</h2>
<p>Original (Vietnamese), from <em>Claude_Prompts.txt</em>:</p>
<blockquote>Cho hệ thống JBS với ERD như trong file đính kèm, bạn hãy giúp tôi thiết kế cơ sở dữ liệu MySQL cho nó, trong đó:<br>- Tạo file markdown mô tả database schema và các bảng: JBS6_DB.md<br>- Tạo 2 file sql: 1 file chứa các lệnh SQL để tạo cấu trúc database (JBS6_Database.sql), 1 file khác để tạo các dữ liệu demo đầy đủ cho hệ thống (JBS6_DemoData.sql)</blockquote>
<p class="nhan">In English</p>
<p>"For the JBS system with the ERD in the attached file, design its MySQL database: a markdown file describing the schema and tables (JBS6_DB.md), one SQL file creating the structure (JBS6_Database.sql) and one filling complete demo data (JBS6_DemoData.sql)."</p>
<p class="nhan">Where it sits in the chain</p>
<ol>
<li><strong>#1</strong> PRD after a senior-BA Q&amp;A → <strong>#2</strong> context diagram → <strong>#3</strong> business flows → <strong>#4</strong> use-case spec</li>
<li><strong>#5</strong> data entities + relationships + traceability matrix (UC ↔ PRD function ↔ flow ↔ entities) → <em>JBS4_ERD.md</em></li>
<li><strong>#6</strong> UI specification → <em>JBS5_SRS.md</em></li>
<li><strong>#7</strong> MySQL schema + demo data ← <em>this lesson</em></li>
<li><strong>#8</strong> Technical Design Spec — its section 7 "Database Conventions" (migration strategy, timezone handling, table creation order) builds on #7 → <strong>#9</strong> test cases</li>
</ol>
<div class="pitfall co-tieu-de"><strong>The prompt file's example stack is not your course stack.</strong> Prompt #1 describes ReactJS + Spring Boot + PostgreSQL; prompt #7 then asks for MySQL. For SWP391 say explicitly: <em>MySQL 8, Java JDBC (NetBeans)</em> — or SQL Server if your team took the .NET path.</div>`,
  `<h2>📜 Prompt nguyên văn của thầy/cô</h2>
<p>Bản gốc (tiếng Việt), trong <em>Claude_Prompts.txt</em>:</p>
<blockquote>Cho hệ thống JBS với ERD như trong file đính kèm, bạn hãy giúp tôi thiết kế cơ sở dữ liệu MySQL cho nó, trong đó:<br>- Tạo file markdown mô tả database schema và các bảng: JBS6_DB.md<br>- Tạo 2 file sql: 1 file chứa các lệnh SQL để tạo cấu trúc database (JBS6_Database.sql), 1 file khác để tạo các dữ liệu demo đầy đủ cho hệ thống (JBS6_DemoData.sql)</blockquote>
<p class="nhan">Tóm ý</p>
<p>Từ ERD đính kèm, thiết kế CSDL MySQL và trả về ba file: mô tả schema và các bảng (JBS6_DB.md), script tạo cấu trúc (JBS6_Database.sql), script tạo demo data đầy đủ (JBS6_DemoData.sql).</p>
<p class="nhan">Vị trí trong chuỗi prompt</p>
<ol>
<li><strong>#1</strong> PRD sau phần hỏi-đáp kiểu senior BA → <strong>#2</strong> context diagram → <strong>#3</strong> business flow → <strong>#4</strong> đặc tả use case</li>
<li><strong>#5</strong> data entity + quan hệ + traceability matrix (UC ↔ chức năng PRD ↔ flow ↔ entity) → <em>JBS4_ERD.md</em></li>
<li><strong>#6</strong> đặc tả UI → <em>JBS5_SRS.md</em></li>
<li><strong>#7</strong> schema MySQL + demo data ← <em>bài này</em></li>
<li><strong>#8</strong> Technical Design Spec — mục 7 "Database Conventions" (chiến lược migration, xử lý múi giờ, thứ tự tạo bảng) dựa trên #7 → <strong>#9</strong> test case</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Stack ví dụ trong file prompt không phải stack của môn.</strong> Prompt #1 mô tả ReactJS + Spring Boot + PostgreSQL; prompt #7 lại xin MySQL. Với SWP391 hãy nói rõ: <em>MySQL 8, Java JDBC (NetBeans)</em> — hoặc SQL Server nếu nhóm đi nhánh .NET.</div>`),
  bi(`<h2>🛠️ Running it for your own project — step by step</h2>
<ol>
<li><strong>Attach the right inputs</strong> — your ERD/entity file (the output of prompt #5, or the SRS §1.5 table), the use-case list of the current iteration, and the screen list. Without the screens the AI invents columns.</li>
<li><strong>Add the constraints the original prompt leaves open</strong> — use the improved wording below.</li>
<li><strong>Ask for the three files separately</strong> if the answer gets cut off: first the .md, then the structure script, then the demo data.</li>
<li><strong>Run the structure script on an empty MySQL 8 database</strong> — twice. The second run must also succeed (<code>DROP … IF EXISTS</code> in the right order).</li>
<li><strong>Verify</strong> with the checklist and queries in the next section; fix by hand or re-prompt with the exact error.</li>
<li><strong>Commit</strong> the reviewed scripts under <code>db/</code> and log the session in the AI Usage Report.</li>
</ol>
<p class="nhan">Improved wording (keep the teacher's three files, add the rules of this chapter)</p>
<pre>You are a database designer. From the attached ERD (entities, attributes, relationships)
and use-case list, design a MySQL 8 database for our SWP391 project
(Java JDBC, NetBeans). Produce 3 files:
1. DB.md       - one section per table: purpose, then a table Field | Type | PK | FK | UN | NN |
                 Description (business meaning, units, allowed values); a relationship list
                 with multiplicities; the mapping choice for every generalisation and M:N.
2. Database.sql - InnoDB, utf8mb4; snake_case singular names; &lt;table&gt;_id keys;
                 every association as a named FOREIGN KEY with an explicit ON DELETE rule;
                 UNIQUE for 0..1 associations and for every M:N pair; CHECK constraints for
                 ranges and dates; DECIMAL for money; ENUM or lookup tables for statuses;
                 passwords stored as BCrypt hashes (VARCHAR(255)); DROP IF EXISTS in
                 dependency order so the script can be re-run.
3. DemoData.sql - realistic but FAKE data only (no real people): at least 3 users per role,
                 every status value of every ENUM used at least once, edge cases
                 (expired post, rejected application, locked account); BCrypt hash of the
                 demo password "Demo@123" for all accounts; inserts in dependency order.
Before writing SQL, list any ERD ambiguity as a question instead of guessing.</pre>
<p class="ghi-chu">The prompt is in English because the table/column names and script comments will be English; you can still discuss with the AI in Vietnamese.</p>`,
  `<h2>🛠️ Chạy prompt cho đồ án của nhóm — từng bước</h2>
<ol>
<li><strong>Đính kèm đúng đầu vào</strong> — file ERD/entity (đầu ra của prompt #5, hoặc bảng SRS §1.5), danh sách use case của iteration hiện tại, và danh sách màn hình. Thiếu màn hình thì AI tự bịa cột.</li>
<li><strong>Bổ sung các ràng buộc mà prompt gốc để ngỏ</strong> — dùng bản viết cải tiến bên dưới.</li>
<li><strong>Xin từng file một</strong> nếu câu trả lời bị cắt: trước là .md, rồi script cấu trúc, rồi demo data.</li>
<li><strong>Chạy script cấu trúc trên một CSDL MySQL 8 trống</strong> — hai lần. Lần hai cũng phải chạy được (<code>DROP … IF EXISTS</code> đúng thứ tự).</li>
<li><strong>Kiểm chứng</strong> bằng checklist và câu truy vấn ở phần sau; sửa tay hoặc prompt lại kèm đúng thông báo lỗi.</li>
<li><strong>Commit</strong> các script đã review vào <code>db/</code> và ghi phiên làm việc vào AI Usage Report.</li>
</ol>
<p class="nhan">Bản viết cải tiến (giữ ba file của thầy/cô, thêm các quy tắc của chương này)</p>
<pre>You are a database designer. From the attached ERD (entities, attributes, relationships)
and use-case list, design a MySQL 8 database for our SWP391 project
(Java JDBC, NetBeans). Produce 3 files:
1. DB.md       - one section per table: purpose, then a table Field | Type | PK | FK | UN | NN |
                 Description (business meaning, units, allowed values); a relationship list
                 with multiplicities; the mapping choice for every generalisation and M:N.
2. Database.sql - InnoDB, utf8mb4; snake_case singular names; &lt;table&gt;_id keys;
                 every association as a named FOREIGN KEY with an explicit ON DELETE rule;
                 UNIQUE for 0..1 associations and for every M:N pair; CHECK constraints for
                 ranges and dates; DECIMAL for money; ENUM or lookup tables for statuses;
                 passwords stored as BCrypt hashes (VARCHAR(255)); DROP IF EXISTS in
                 dependency order so the script can be re-run.
3. DemoData.sql - realistic but FAKE data only (no real people): at least 3 users per role,
                 every status value of every ENUM used at least once, edge cases
                 (expired post, rejected application, locked account); BCrypt hash of the
                 demo password "Demo@123" for all accounts; inserts in dependency order.
Before writing SQL, list any ERD ambiguity as a question instead of guessing.</pre>
<p class="ghi-chu">Prompt để bằng tiếng Anh vì tên bảng/cột và chú thích trong script sẽ là tiếng Anh; bạn vẫn có thể hỏi-đáp với AI bằng tiếng Việt.</p>`),
  bi(`<h2>🔍 Verifying the output — checklist and queries</h2>
<p class="nhan">Read the files (10 minutes)</p>
<ol>
<li><strong>Coverage</strong> — every entity of the ERD has a table; every table is used by a use case (the traceability matrix of prompt #5).</li>
<li><strong>Mapping choices</strong> — each M:N and each generalisation is mapped with a rule you can name (lessons 3.7–3.8).</li>
<li><strong>Consistency</strong> — DB.md, Database.sql and your Java model classes use the same names and types.</li>
<li><strong>Demo data</strong> — fake people only; every status appears; passwords are hashes; nothing copied from a real sample.</li>
</ol>
<p class="nhan">Ask the database (run after Database.sql + DemoData.sql)</p>
<pre>-- 1. Tables without a primary key (must return nothing)
SELECT t.table_name FROM information_schema.tables t
LEFT JOIN information_schema.table_constraints c
  ON c.table_schema = t.table_schema AND c.table_name = t.table_name
 AND c.constraint_type = 'PRIMARY KEY'
WHERE t.table_schema = DATABASE() AND t.table_type = 'BASE TABLE' AND c.constraint_name IS NULL;

-- 2. Columns named *_id that are not a PK and not an FK (probably a forgotten FK)
SELECT c.table_name, c.column_name FROM information_schema.columns c
WHERE c.table_schema = DATABASE() AND c.column_name LIKE '%\\_id' AND c.column_key &lt;&gt; 'PRI'
  AND NOT EXISTS (SELECT 1 FROM information_schema.key_column_usage k
                  WHERE k.table_schema = c.table_schema AND k.table_name = c.table_name
                    AND k.column_name = c.column_name AND k.referenced_table_name IS NOT NULL);

-- 3. The relationship list, to compare with the ERD
SELECT table_name, column_name, referenced_table_name, referenced_column_name
FROM information_schema.key_column_usage
WHERE table_schema = DATABASE() AND referenced_table_name IS NOT NULL ORDER BY table_name;

-- 4. Demo data covers every status (example for job_apply)
SELECT status, COUNT(*) FROM job_apply GROUP BY status;</pre>
<p class="nhan">Try to break it (each must FAIL)</p>
<pre>INSERT INTO job_apply (freelancer_id, post_id, cv_url) VALUES (999999, 1, 'x');  -- FK
INSERT INTO job_apply (freelancer_id, post_id, cv_url)
  SELECT freelancer_id, post_id, cv_url FROM job_apply LIMIT 1;                  -- UNIQUE pair
UPDATE post SET quantity = 0 WHERE post_id = 1;                                  -- CHECK</pre>`,
  `<h2>🔍 Kiểm chứng đầu ra — checklist và câu truy vấn</h2>
<p class="nhan">Đọc các file (10 phút)</p>
<ol>
<li><strong>Độ phủ</strong> — mọi thực thể trong ERD có bảng; mọi bảng được một use case dùng tới (traceability matrix của prompt #5).</li>
<li><strong>Lựa chọn ánh xạ</strong> — mỗi M:N và mỗi generalisation được ánh xạ bằng một quy tắc bạn gọi tên được (bài 3.7–3.8).</li>
<li><strong>Nhất quán</strong> — DB.md, Database.sql và các class model Java dùng cùng tên và kiểu.</li>
<li><strong>Demo data</strong> — chỉ người giả; mọi trạng thái đều xuất hiện; mật khẩu là chuỗi băm; không chép gì từ bản mẫu thật.</li>
</ol>
<p class="nhan">Hỏi chính CSDL (chạy sau Database.sql + DemoData.sql)</p>
<pre>-- 1. Bảng không có khoá chính (phải trả về rỗng)
SELECT t.table_name FROM information_schema.tables t
LEFT JOIN information_schema.table_constraints c
  ON c.table_schema = t.table_schema AND c.table_name = t.table_name
 AND c.constraint_type = 'PRIMARY KEY'
WHERE t.table_schema = DATABASE() AND t.table_type = 'BASE TABLE' AND c.constraint_name IS NULL;

-- 2. Cột tên *_id không phải PK và không phải FK (nhiều khả năng quên FK)
SELECT c.table_name, c.column_name FROM information_schema.columns c
WHERE c.table_schema = DATABASE() AND c.column_name LIKE '%\\_id' AND c.column_key &lt;&gt; 'PRI'
  AND NOT EXISTS (SELECT 1 FROM information_schema.key_column_usage k
                  WHERE k.table_schema = c.table_schema AND k.table_name = c.table_name
                    AND k.column_name = c.column_name AND k.referenced_table_name IS NOT NULL);

-- 3. Danh sách quan hệ, để so với ERD
SELECT table_name, column_name, referenced_table_name, referenced_column_name
FROM information_schema.key_column_usage
WHERE table_schema = DATABASE() AND referenced_table_name IS NOT NULL ORDER BY table_name;

-- 4. Demo data phủ mọi trạng thái (ví dụ với job_apply)
SELECT status, COUNT(*) FROM job_apply GROUP BY status;</pre>
<p class="nhan">Thử phá nó (mỗi lệnh phải THẤT BẠI)</p>
<pre>INSERT INTO job_apply (freelancer_id, post_id, cv_url) VALUES (999999, 1, 'x');  -- FK
INSERT INTO job_apply (freelancer_id, post_id, cv_url)
  SELECT freelancer_id, post_id, cv_url FROM job_apply LIMIT 1;                  -- cặp UNIQUE
UPDATE post SET quantity = 0 WHERE post_id = 1;                                  -- CHECK</pre>`),
  bi(`<h2>🧾 Logging it — the AI Usage Report (Template5)</h2>
<p>Record one row per AI session, so the teacher sees what was generated and what the team decided.</p>
<ul>
<li><strong>Task</strong> — "Generate MySQL schema + demo data from ERD v2 (iteration 2)"</li>
<li><strong>Tool &amp; prompt</strong> — Claude, prompt #7 (improved wording), attachments: ERD, UC list</li>
<li><strong>Output used</strong> — Database.sql (14 tables), DemoData.sql (120 rows)</li>
<li><strong>Human changes</strong> — e.g. "added UNIQUE (freelancer_id, post_id); money FLOAT → DECIMAL; removed a column no screen uses; replaced plain-text passwords with BCrypt hashes"</li>
<li><strong>Verification</strong> — the four queries and three break tests above, all as expected</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Typical AI mistakes in schema generation.</strong> Money as <code>FLOAT</code> · plain or MD5 passwords in demo data · M:N link tables with a surrogate id and no UNIQUE pair · every FK <code>ON DELETE CASCADE</code>, including lookups · <code>TIMESTAMP</code> everywhere · invented tables that no use case needs · demo data that looks like real people (real-looking names plus real e-mail domains). None of these is caught by "the script runs".</div>
<p class="meo">🧠 <strong>Remember:</strong> the AI writes a draft; the team signs the design. At the final presentation "the AI generated it" is not an answer to "why is this a composite key?".</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Generate test data with code, not with a chat.</strong> For larger volumes (e.g. 5,000 posts to test paging and indexes), ask the AI for a small generator script (Java or Python with a fake-data library such as Datafaker / Faker) instead of thousands of INSERT lines. The script is reviewable, repeatable and cannot leak real people's data. <em>Outside the syllabus because the guides only require demo data sufficient for the demo video.</em></div>`,
  `<h2>🧾 Ghi lại — AI Usage Report (Template5)</h2>
<p>Ghi mỗi phiên dùng AI một dòng, để thầy/cô thấy cái gì do AI sinh và nhóm đã quyết định gì.</p>
<ul>
<li><strong>Công việc</strong> — "Sinh schema MySQL + demo data từ ERD v2 (iteration 2)"</li>
<li><strong>Công cụ &amp; prompt</strong> — Claude, prompt #7 (bản cải tiến), đính kèm: ERD, danh sách UC</li>
<li><strong>Đầu ra được dùng</strong> — Database.sql (14 bảng), DemoData.sql (120 dòng)</li>
<li><strong>Nhóm đã sửa</strong> — ví dụ "thêm UNIQUE (freelancer_id, post_id); tiền FLOAT → DECIMAL; bỏ một cột không màn hình nào dùng; thay mật khẩu chữ thường bằng chuỗi băm BCrypt"</li>
<li><strong>Kiểm chứng</strong> — bốn câu truy vấn và ba phép thử phá ở trên, đều đúng như mong đợi</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Lỗi AI hay mắc khi sinh schema.</strong> Tiền là <code>FLOAT</code> · mật khẩu chữ thường hoặc MD5 trong demo data · bảng nối M:N có id thay thế mà không có cặp UNIQUE · mọi FK đều <code>ON DELETE CASCADE</code>, kể cả bảng tra cứu · <code>TIMESTAMP</code> ở khắp nơi · bịa ra bảng mà không use case nào cần · demo data trông như người thật (tên như thật cộng tên miền e-mail thật). Không lỗi nào bị phát hiện chỉ bằng "script chạy được".</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> AI viết bản nháp; nhóm ký tên vào thiết kế. Ở buổi thuyết trình cuối, "AI sinh ra đó ạ" không phải câu trả lời cho "vì sao đây là khoá ghép?".</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Sinh dữ liệu test bằng code, không bằng khung chat.</strong> Với lượng lớn (ví dụ 5.000 bài đăng để thử phân trang và index), hãy xin AI một script sinh dữ liệu nhỏ (Java hoặc Python với thư viện dữ liệu giả như Datafaker / Faker) thay vì hàng nghìn dòng INSERT. Script review được, chạy lại được và không thể làm lộ dữ liệu người thật. <em>Ngoài giáo trình vì hướng dẫn chỉ yêu cầu demo data đủ cho video demo.</em></div>`),
  books([
    ['sommerville', 'Ch. 13 Security Engineering (storing credentials) and Ch. 8 Software Testing (test data)', 'Ch. 13 Security Engineering (lưu thông tin đăng nhập) và Ch. 8 Software Testing (dữ liệu test)'],
    ['gomaa', 'Ch. 7 Static Modeling — the model the AI output must still conform to', 'Ch. 7 Static Modeling — mô hình mà đầu ra của AI vẫn phải tuân theo'],
  ]),
].join('\n');


export default {
  title: 'Chapter 3 (database part)|||Chương 3 (phần CSDL)',
  description: 'Thiết kế CSDL theo slide Database Design (entity class → bảng, PK, FK, 1:1, 1:N, association class, aggregation, generalization), mổ xẻ CSDL mẫu G5 và dùng prompt #7 để sinh schema MySQL.',
  lessons: [
    {
      title: '3.6 — Data modelling: ERD, entity → table, primary & foreign keys, normalisation|||3.6 — Mô hình dữ liệu: ERD, entity → bảng, khoá chính & khoá ngoại, chuẩn hoá',
      slug: 'swp391-3-1-erd-schema',
      type: 'VIDEO',
      description: 'Slide Database Design 1–8: đầu vào của thiết kế CSDL, entity class thành bảng, khoá chính, khoá ngoại; kèm ví dụ Job IT for Freelancer, chuẩn hoá 3NF và mẫu mô tả bảng trong RDS/SDS.',
      content: [L1_INTRO, walkHead('g-db', 1, 8), walk('g-db', L1_ROWS), L1_DEEP].join('\n'),
    },
    {
      title: '3.7 — Mapping associations: 1:1, 1:N, association classes, aggregation & composition|||3.7 — Ánh xạ association: 1:1, 1:N, association class, aggregation & composition',
      slug: 'swp391-3-1b-association-mapping',
      type: 'VIDEO',
      description: 'Slide Database Design 9–17: khoá ngoại cho 1:1, 0..1, 1:N; association class thành bảng liên kết khoá ghép; cây aggregation/composition; áp vào các bảng Job IT for Freelancer với DDL MySQL 8.',
      content: [L2_INTRO, walkHead('g-db', 9, 17), walk('g-db', L2_ROWS), L2_DEEP].join('\n'),
    },
    {
      title: '3.8 — Generalisation / specialisation mapping and the Banking System example|||3.8 — Ánh xạ generalisation / specialisation và ví dụ Banking System',
      slug: 'swp391-3-1c-generalization-mapping',
      type: 'VIDEO',
      description: 'Slide Database Design 18–25: ba cách ánh xạ cây kế thừa (cha+con, chỉ con, chỉ cha), discriminator, PK dùng chung; ví dụ Banking System đầy đủ và cây User/Admin/Recruiter/Freelancer của G5.',
      content: [L3_INTRO, walkHead('g-db', 18, 25), walk('g-db', L3_ROWS), L3_DEEP].join('\n'),
    },
    {
      title: '3.9 — Case study: reverse-engineering and reviewing the G5 sample database (MySQL 8 rewrite)|||3.9 — Case study: dựng ngược và review CSDL mẫu G5 (viết lại bằng MySQL 8)',
      slug: 'swp391-3-1d-g5-database-review',
      type: 'VIDEO',
      description: 'CSDL mẫu 22 bảng của nhóm G5 (SQL Server): dựng ngược ERD, review theo quy tắc của slide (khoá, ràng buộc, kiểu, đặt tên, chuẩn hoá, mật khẩu), và DDL MySQL 8 đã sửa cho các bảng lõi. Chỉ dùng schema, không dùng dữ liệu cá nhân.',
      content: [L4_INTRO, L4_BODY].join('\n'),
    },
    {
      title: '3.10 — AI-assisted schema: Claude prompt #7 (MySQL schema + demo data) and how to verify it|||3.10 — Schema có AI hỗ trợ: prompt Claude #7 (schema MySQL + demo data) và cách kiểm chứng',
      slug: 'swp391-3-1e-ai-mysql-schema',
      type: 'VIDEO',
      description: 'Prompt #7 trong Claude_Prompts.txt: sinh mô tả schema, script tạo CSDL MySQL và demo data từ ERD; cách viết prompt tốt hơn, checklist và câu SQL để kiểm chứng đầu ra, ghi vào AI Usage Report.',
      content: [L5_INTRO, L5_BODY].join('\n'),
    },
  ],
};
