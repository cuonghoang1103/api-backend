/**
 * DBI202 · Chương 2 — mô hình quan hệ & đại số quan hệ trên set và bag (slide Chapter 2 + Chapter 5).
 * Bài 📑 học theo từng slide: dbi3 (Chapter 2.pptx, slide 1–25); dbi6 (Chapter 5- selfstudying.pptx, slide 1–30).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: dbi202-on-ch2.
 * Quiz viết lại (10 câu, giữ slug dbi202-quiz-1).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/DBI202/gen/gen.mjs từ gen/src/** và gen/sql/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node DBI202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 2.A — 📑 Slide by slide · Data models, relations, keys & the idea of an algebra (Chapter 2, slides 1–11) ───────── */
const L_dbi3_1 = {
  title: '2.A — 📑 Slide by slide · Data models, relations, keys & the idea of an algebra (Chapter 2, slides 1–11)|||2.A — 📑 Học theo từng slide · Mô hình dữ liệu, quan hệ, khoá & ý tưởng đại số (Chapter 2, slide 1–11)',
  slug: 'dbi202-slide-dbi3-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–11 của bộ slide Chapter 2 của trường (The Relational Model of Data): mô hình dữ liệu gồm cấu trúc – phép toán – ràng buộc, mô hình quan hệ và bán cấu trúc (XML), lược đồ và thể hiện, bậc và lực lượng, lược đồ CSDL Sailors/Boats/Reserves, các loại thuộc tính và khoá (ứng viên, chính, ngoại), rồi đại số quan hệ là gì và bốn nhóm phép — mọi bảng tạo và chạy thật trên SQL Server.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.A · school slides "Chapter 2", slides 1–11</span>
<h2>The relational model — the deck, slide by slide</h2>
<p class="lead">⚠️ <strong>This is the school's "Chapter 2" deck</strong> (The Relational Model of Data). On this website it is also Chapter 2, so the numbers match here. Slides 1–11 answer three questions a beginner has: what is a "data model", what exactly is a "relation" (the thing we casually call a table), and what is the "algebra" that every SQL query is built from.</p>
<div class="callout"><strong>After this lesson you can:</strong> name the three parts of any data model; read a relation schema such as Student(StudentID: string, Name: string, …); tell schema from instance, degree from cardinality; explain key, candidate key, primary key and foreign key with a real table (and see SQL Server refuse a duplicate key and a dangling foreign key); list the four classes of relational-algebra operators. Every table below was created and queried on SQL Server; the results are the real output.</div>
<h3>Starting from zero — a table you already know</h3>
<p>A database is just an organised place to keep data. Think of the class list your lecturer keeps:</p>
<table>
<thead><tr><th>Student ID</th><th>Name</th><th>Year registered</th></tr></thead>
<tbody>
<tr><td>s01</td><td>Akeroyd</td><td>1993</td></tr>
<tr><td>s02</td><td>Thompson</td><td>1998</td></tr>
</tbody>
</table>
<p>In the relational model this list is called a <strong>relation</strong>. Its columns are <strong>attributes</strong>, its rows are <strong>tuples</strong>. <strong>SQL</strong> (Structured Query Language) is the language we use to create such tables and ask questions about them; <strong>SQL Server</strong> (Microsoft, used in class and in the PE exam) and <strong>PostgreSQL</strong> (free, what you will most likely use at work) are two programs — two <em>DBMSs</em>, database management systems — that understand SQL.</p>
<h3>The whole part in one table</h3>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>You must be able to</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>title, objectives, contents</td><td>know the three sections 2.1–2.3</td></tr>
<tr><td>4–6</td><td>data model = structure + operations + constraints; relational vs semi-structured (XML)</td><td>explain the three parts with an example</td></tr>
<tr><td>7–9</td><td>relation, schema, instance, degree, cardinality; database schema; kinds of attributes and keys</td><td>read a schema; point to the key and the foreign keys</td></tr>
<tr><td>10–11</td><td>relational algebra = operators on relations; four classes</td><td>name each operator class and the SQL it becomes</td></tr>
</tbody>
</table>
<p>Lesson 2.B continues with the operators themselves (slides 12–25). Lessons 2.1–2.4 below go over the same ideas in another order — read them after these two.</p>`,
    `<span class="eyebrow">Chương 2 · Bài 2.A · slide "Chapter 2" của trường, slide 1–11</span>
<h2>Mô hình quan hệ — học bộ slide từng trang</h2>
<p class="lead">⚠️ <strong>Đây là bộ slide "Chapter 2" của trường</strong> (The Relational Model of Data — mô hình dữ liệu quan hệ). Trên web này nó cũng là Chương 2, nên số chương khớp nhau. Slide 1–11 trả lời ba câu hỏi của người mới: "mô hình dữ liệu" (data model) là gì, "quan hệ" (relation — thứ ta vẫn gọi nôm là cái bảng) chính xác là gì, và "đại số" (algebra) mà mọi câu truy vấn SQL được xây từ đó là gì.</p>
<div class="callout"><strong>Học xong bài này bạn làm được:</strong> kể ba phần của mọi mô hình dữ liệu; đọc một lược đồ quan hệ (relation schema) như Student(StudentID: string, Name: string, …); phân biệt lược đồ với thể hiện (instance), bậc (degree) với lực lượng (cardinality); giải thích khoá, khoá ứng viên, khoá chính, khoá ngoại trên một bảng thật (và xem SQL Server từ chối một khoá trùng và một khoá ngoại trỏ vào hư không); kể bốn nhóm phép của đại số quan hệ. Mọi bảng bên dưới đã được tạo và truy vấn trên SQL Server; bảng kết quả là output thật.</div>
<h3>Bắt đầu từ con số 0 — một cái bảng bạn đã quen</h3>
<p>Cơ sở dữ liệu (database — CSDL) chỉ là một nơi cất dữ liệu có tổ chức. Hãy nghĩ tới danh sách lớp mà giảng viên giữ:</p>
<table>
<thead><tr><th>Mã SV</th><th>Tên</th><th>Năm nhập học</th></tr></thead>
<tbody>
<tr><td>s01</td><td>Akeroyd</td><td>1993</td></tr>
<tr><td>s02</td><td>Thompson</td><td>1998</td></tr>
</tbody>
</table>
<p>Trong mô hình quan hệ, danh sách này gọi là một <strong>quan hệ (relation)</strong>. Mỗi cột là một <strong>thuộc tính (attribute)</strong>, mỗi dòng là một <strong>bộ (tuple)</strong>. <strong>SQL</strong> (Structured Query Language — ngôn ngữ truy vấn có cấu trúc) là ngôn ngữ để tạo những bảng như vậy và hỏi dữ liệu trong đó; <strong>SQL Server</strong> (của Microsoft, dùng trên lớp và trong bài thi PE) và <strong>PostgreSQL</strong> (miễn phí, thứ bạn nhiều khả năng dùng khi đi làm) là hai phần mềm — hai <em>hệ quản trị CSDL (DBMS — database management system)</em> — hiểu được SQL.</p>
<h3>Cả phần trong một bảng</h3>
<table>
<thead><tr><th>Slide</th><th>Ý</th><th>Bạn phải làm được</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>tiêu đề, mục tiêu, nội dung</td><td>biết ba mục 2.1–2.3</td></tr>
<tr><td>4–6</td><td>mô hình dữ liệu = cấu trúc + phép toán + ràng buộc; mô hình quan hệ và bán cấu trúc (XML)</td><td>giải thích ba phần bằng một ví dụ</td></tr>
<tr><td>7–9</td><td>quan hệ, lược đồ, thể hiện, bậc, lực lượng; lược đồ CSDL; các loại thuộc tính và khoá</td><td>đọc một lược đồ; chỉ ra khoá và các khoá ngoại</td></tr>
<tr><td>10–11</td><td>đại số quan hệ = các phép toán trên quan hệ; bốn nhóm</td><td>gọi tên từng nhóm phép và câu SQL tương ứng</td></tr>
</tbody>
</table>
<p>Bài 2.B đi tiếp vào chính các phép toán (slide 12–25). Các bài 2.1–2.4 bên dưới nói lại cùng các ý theo thứ tự khác — đọc sau hai bài này.</p>`),
    walkHead('dbi3', 1, 11),
    walk('dbi3', [
      [1, 'Chapter 2 The Relational Model of Data',
        `<p class="y-chinh">🎯 The title slide of the school's Chapter 2: the relational model — data stored as tables — which every DBMS in this course (SQL Server, PostgreSQL) is built on.</p>
<p>Everything later in DBI202 — keys, normalization, SQL queries, triggers — assumes this model. Spend the time here: a solid picture of "relation = set of rows" makes SQL results predictable instead of surprising.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề của Chapter 2 của trường: mô hình quan hệ (relational model) — dữ liệu được lưu thành các bảng — nền móng của mọi DBMS trong môn (SQL Server, PostgreSQL).</p>
<p>Mọi thứ về sau trong DBI202 — khoá, chuẩn hoá, câu truy vấn SQL, trigger — đều dựa trên mô hình này. Hãy bỏ thời gian ở đây: nắm chắc hình ảnh "quan hệ = một tập các dòng" thì kết quả SQL sẽ đoán trước được chứ không còn làm bạn bất ngờ.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Four objectives: understand the relational model, use it to describe data, know the basic relational-algebra operators under <strong>set</strong> semantics, and write queries with them.</p>
<ul>
<li>"Conceptualize data using the relational model" = turn a description ("a sailor reserves a boat on a day") into relation schemas (slide 8).</li>
<li>"Under set semantics" = in this deck a relation never contains the same row twice. The school's Chapter 5 deck (lessons 2.C–2.D) repeats the operators on <strong>bags</strong>, where duplicates are allowed — which is what SQL really does.</li>
<li>"Express queries using relational algebra" = the exam gives a question in English and asks for an expression such as π<sub>title</sub>(σ<sub>year&gt;2000</sub>(Movies)), then often asks for the SQL too.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bốn mục tiêu: hiểu mô hình quan hệ, dùng nó để mô tả dữ liệu, biết các phép cơ bản của đại số quan hệ theo ngữ nghĩa <strong>tập hợp (set)</strong>, và viết được truy vấn bằng các phép đó.</p>
<ul>
<li>"Conceptualize data using the relational model" (khái niệm hoá dữ liệu bằng mô hình quan hệ) = biến một mô tả ("thuỷ thủ đặt thuyền vào một ngày") thành các lược đồ quan hệ (slide 8).</li>
<li>"Under set semantics" (theo ngữ nghĩa tập hợp) = trong bộ slide này một quan hệ không bao giờ chứa cùng một dòng hai lần. Bộ slide Chapter 5 của trường (bài 2.C–2.D) làm lại các phép trên <strong>túi (bag)</strong>, nơi cho phép dòng trùng — đó mới là cách SQL thật sự chạy.</li>
<li>"Express queries using relational algebra" (diễn đạt truy vấn bằng đại số quan hệ) = đề cho một câu hỏi bằng tiếng Anh và bắt viết biểu thức như π<sub>title</sub>(σ<sub>year&gt;2000</sub>(Movies)), rồi thường hỏi luôn câu SQL.</li>
</ul>`],
      [3, 'Contents',
        `<p class="y-chinh">🎯 Three sections: 2.1 data models in general, 2.2 the relational model, 2.3 an algebraic query language.</p>
<p>2.1 and 2.2 describe <em>what</em> is stored; 2.3 describes <em>how to ask</em> about it. The same split exists in SQL: CREATE TABLE describes, SELECT asks.</p>`,
        `<p class="y-chinh">🎯 Ba mục: 2.1 mô hình dữ liệu nói chung, 2.2 mô hình quan hệ, 2.3 một ngôn ngữ truy vấn dạng đại số.</p>
<p>2.1 và 2.2 mô tả <em>lưu cái gì</em>; 2.3 mô tả <em>hỏi thế nào</em>. SQL cũng chia y như vậy: CREATE TABLE để mô tả, SELECT để hỏi.</p>`],
      [4, '2.1 An Overview of Data Models',
        `<p class="y-chinh">🎯 A data model is a way of describing data with three parts: the structure of the data, the operations on the data, and the constraints on the data.</p>
<table>
<thead><tr><th>Part</th><th>Meaning</th><th>In a shop's product list</th><th>In SQL</th></tr></thead>
<tbody>
<tr><td>structure</td><td>how the data is laid out</td><td>a table with columns code, name, price</td><td>CREATE TABLE</td></tr>
<tr><td>operations</td><td>what you may do with it: queries and modifications</td><td>"products under 50,000 đ", "raise the price of X"</td><td>SELECT, INSERT, UPDATE, DELETE</td></tr>
<tr><td>constraints</td><td>limits on what may be stored</td><td>price is never negative; two products never share a code</td><td>CHECK, PRIMARY KEY, FOREIGN KEY</td></tr>
</tbody>
</table>
<p>The slide's example of structure, "arrays or objects", comes from programming: a Java array is also a structure, but it offers only a few operations (get by index) and almost no constraints. A data model gives all three together, and the DBMS enforces the constraints for every program that uses the data.</p>
<p class="meo">🧠 <strong>Remember "S-O-C":</strong> Structure, Operations, Constraints — an FE question often lists four options and one of them (e.g. "the storage device") is not a part of a data model.</p>`,
        `<p class="y-chinh">🎯 Mô hình dữ liệu (data model) là một cách mô tả dữ liệu gồm ba phần: cấu trúc của dữ liệu, các phép toán trên dữ liệu, và các ràng buộc trên dữ liệu.</p>
<table>
<thead><tr><th>Phần</th><th>Nghĩa</th><th>Trong danh sách sản phẩm của một cửa hàng</th><th>Trong SQL</th></tr></thead>
<tbody>
<tr><td>cấu trúc (structure)</td><td>dữ liệu được sắp xếp ra sao</td><td>một bảng có các cột mã, tên, giá</td><td>CREATE TABLE</td></tr>
<tr><td>phép toán (operations)</td><td>được làm gì với dữ liệu: truy vấn và sửa đổi</td><td>"các sản phẩm dưới 50.000 đ", "tăng giá món X"</td><td>SELECT, INSERT, UPDATE, DELETE</td></tr>
<tr><td>ràng buộc (constraints)</td><td>giới hạn về thứ được phép lưu</td><td>giá không bao giờ âm; hai sản phẩm không trùng mã</td><td>CHECK, PRIMARY KEY, FOREIGN KEY</td></tr>
</tbody>
</table>
<p>Ví dụ về cấu trúc trên slide, "arrays or objects" (mảng hoặc đối tượng), lấy từ lập trình: một mảng Java cũng là một cấu trúc, nhưng chỉ có vài phép toán (lấy theo chỉ số) và gần như không có ràng buộc. Mô hình dữ liệu cho cả ba thứ cùng lúc, và DBMS bắt buộc mọi chương trình dùng dữ liệu phải tuân theo ràng buộc.</p>
<p class="meo">🧠 <strong>Nhớ "S-O-C":</strong> Structure (cấu trúc), Operations (phép toán), Constraints (ràng buộc) — câu FE hay đưa bốn phương án, trong đó có một thứ (ví dụ "thiết bị lưu trữ") không phải là một phần của mô hình dữ liệu.</p>`],
      [5, '2.1 An Overview of Data Models - relational and semi-structured',
        `<p class="y-chinh">🎯 Two data models matter today: the relational model (tables, with object-relational extensions) and the semi-structured model (trees, e.g. XML).</p>
<table>
<thead><tr><th></th><th>Relational model</th><th>Semi-structured model (XML)</th></tr></thead>
<tbody>
<tr><td>structure</td><td>tables of rows and columns</td><td>a tree (or graph) of nested, tagged elements</td></tr>
<tr><td>operations</td><td>work on whole tables: select rows, keep columns, join tables</td><td>follow a path in the tree: from an element to its nested sub-elements, and so on</td></tr>
<tr><td>constraints</td><td>keys, foreign keys, types of columns</td><td>the data type of the value inside a tag</td></tr>
</tbody>
</table>
<p>"Object-relational extensions" means relational DBMSs that also store richer values — PostgreSQL, for example, can keep an array or a JSON document in one column. "Semi-structured" means the shape is not fixed in advance: one &lt;PART&gt; element may have a &lt;COLOR&gt; child and the next one may not.</p>
<p>At work you meet both: the tables of your project live in PostgreSQL (relational), while the JSON your API sends to the browser is semi-structured.</p>`,
        `<p class="y-chinh">🎯 Hai mô hình dữ liệu quan trọng hiện nay: mô hình quan hệ (bảng, kèm phần mở rộng quan hệ – đối tượng) và mô hình bán cấu trúc (semi-structured — dạng cây, ví dụ XML).</p>
<table>
<thead><tr><th></th><th>Mô hình quan hệ</th><th>Mô hình bán cấu trúc (XML)</th></tr></thead>
<tbody>
<tr><td>cấu trúc</td><td>các bảng gồm dòng và cột</td><td>một cây (hoặc đồ thị) các phần tử lồng nhau có gắn thẻ (tag)</td></tr>
<tr><td>phép toán</td><td>làm trên cả bảng: chọn dòng, giữ cột, nối bảng</td><td>đi theo một đường trong cây: từ một phần tử xuống các phần tử con lồng trong nó, cứ thế tiếp</td></tr>
<tr><td>ràng buộc</td><td>khoá, khoá ngoại, kiểu của cột</td><td>kiểu dữ liệu của giá trị nằm trong một thẻ</td></tr>
</tbody>
</table>
<p>"Object-relational extensions" (mở rộng quan hệ – đối tượng) là các DBMS quan hệ lưu được cả giá trị phức tạp hơn — ví dụ PostgreSQL cất được một mảng hay một tài liệu JSON trong một cột. "Bán cấu trúc" nghĩa là hình dạng không cố định trước: phần tử &lt;PART&gt; này có con &lt;COLOR&gt;, phần tử kế tiếp có thể không.</p>
<p>Đi làm bạn gặp cả hai: các bảng của dự án nằm trong PostgreSQL (quan hệ), còn JSON mà API gửi cho trình duyệt là bán cấu trúc.</p>`],
      [6, '2.1 An Overview of Data Models - an XML document',
        `<p class="y-chinh">🎯 The slide shows an XML document: a list of computer parts, each part a &lt;PART&gt; element with ITEM, MANUFACTURER, MODEL and COST inside.</p>
<p>The same data as a relation — each &lt;PART&gt; becomes one row, each child tag becomes a column:</p>
<table>
<thead><tr><th>ITEM</th><th>MANUFACTURER</th><th>MODEL</th><th>COST</th></tr></thead>
<tbody>
<tr><td>Motherboard</td><td>ASUS</td><td>P3B-F</td><td>123.00</td></tr>
<tr><td>Video Card</td><td>ATI</td><td>All-in-Wonder Pro</td><td>160.00</td></tr>
<tr><td>Sound Card</td><td>Creative Labs</td><td>Sound Blaster Live</td><td>80.00</td></tr>
<tr><td>(…) inch Monitor</td><td>LG Electronics</td><td>995E</td><td>290.00</td></tr>
</tbody>
</table>
<p>(The size of the monitor is unreadable on the slide — one character did not render.) The XML repeats every tag name for every part; the table writes the column names once. In XML the order of the parts and the nesting carry meaning; in a relation the order of rows means nothing (slide 7).</p>
<div class="pitfall">"XML is not a database model" is wrong: it is the standard example of the <strong>semi-structured</strong> model on this slide.</div>`,
        `<p class="y-chinh">🎯 Slide đưa một tài liệu XML: danh sách linh kiện máy tính, mỗi linh kiện là một phần tử &lt;PART&gt; chứa ITEM, MANUFACTURER, MODEL và COST.</p>
<p>Cùng dữ liệu đó viết thành một quan hệ — mỗi &lt;PART&gt; thành một dòng, mỗi thẻ con thành một cột:</p>
<table>
<thead><tr><th>ITEM</th><th>MANUFACTURER</th><th>MODEL</th><th>COST</th></tr></thead>
<tbody>
<tr><td>Motherboard</td><td>ASUS</td><td>P3B-F</td><td>123.00</td></tr>
<tr><td>Video Card</td><td>ATI</td><td>All-in-Wonder Pro</td><td>160.00</td></tr>
<tr><td>Sound Card</td><td>Creative Labs</td><td>Sound Blaster Live</td><td>80.00</td></tr>
<tr><td>(…) inch Monitor</td><td>LG Electronics</td><td>995E</td><td>290.00</td></tr>
</tbody>
</table>
<p>(Cỡ màn hình trên slide không đọc được — một ký tự bị lỗi hiển thị.) XML lặp lại tên thẻ cho từng linh kiện; bảng chỉ viết tên cột một lần. Trong XML thứ tự các linh kiện và cách lồng nhau mang ý nghĩa; trong một quan hệ thứ tự các dòng không có ý nghĩa gì (slide 7).</p>
<div class="pitfall">"XML không phải là một mô hình dữ liệu" là SAI: nó chính là ví dụ tiêu biểu của mô hình <strong>bán cấu trúc</strong> trên slide này.</div>`],
      [7, '2.2 Basics of the Relational Model',
        `<p class="y-chinh">🎯 A relation has two parts: a <strong>schema</strong> (the name, the attribute names and their types) and an <strong>instance</strong> (the rows stored now); count the rows and you get the cardinality, count the columns and you get the degree.</p>
<p>The slide's schema Student(StudentID: string, Name: string, Registered: int, CounsellorNo: int, Region: int) written in SQL, with the six rows of the figure as its instance:</p>
<pre><code class="language-sql">CREATE TABLE Student (                 -- schema: name of the relation + attributes + types
  StudentID    VARCHAR(5)  NOT NULL,
  Name         VARCHAR(30) NOT NULL,
  Registered   INT,
  CounsellorNo INT,
  Region       INT,
  CONSTRAINT pk_student PRIMARY KEY (StudentID)
);
INSERT INTO Student VALUES             -- instance: the 6 rows on the slide
  ('s01', 'Akeroyd',  1993, 3158, 3),
  ('s02', 'Thompson', 1998, 5212, 4),
  ('s05', 'Ellis',    1997, 5212, 4),
  ('s07', 'Gillies',  1996, 3158, 3),
  ('s09', 'Reeves',   1998, 5212, 4),
  ('s10', 'Urbach',   1997, 5212, 4);
SELECT * FROM Student;
SELECT COUNT(*) AS cardinality         -- number of rows
FROM Student;
SELECT COUNT(*) AS degree              -- number of columns
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Student';
GO
-- try to add the tuple of Ellis a second time
INSERT INTO Student VALUES ('s05', 'Ellis', 1997, 5212, 4);</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>StudentID</th><th>Name</th><th>Registered</th><th>CounsellorNo</th><th>Region</th></tr></thead>
<tbody>
<tr><td>s01</td><td>Akeroyd</td><td>1993</td><td>3158</td><td>3</td></tr>
<tr><td>s02</td><td>Thompson</td><td>1998</td><td>5212</td><td>4</td></tr>
<tr><td>s05</td><td>Ellis</td><td>1997</td><td>5212</td><td>4</td></tr>
<tr><td>s07</td><td>Gillies</td><td>1996</td><td>3158</td><td>3</td></tr>
<tr><td>s09</td><td>Reeves</td><td>1998</td><td>5212</td><td>4</td></tr>
<tr><td>s10</td><td>Urbach</td><td>1997</td><td>5212</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>cardinality</th></tr></thead>
<tbody>
<tr><td>6</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>degree</th></tr></thead>
<tbody>
<tr><td>5</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'pk_student'. Cannot insert duplicate key in object 'dbo.Student'. The duplicate key value is (s05).</b><br>
The statement has been terminated.</div>
<p class="nhan">Reading it line by line</p>
<ul>
<li><code>CREATE TABLE Student (…)</code> — writes the <strong>schema</strong>: the relation name and each attribute with its type (<code>VARCHAR(5)</code> = text of at most 5 characters, the slide's "string"; <code>INT</code> = whole number).</li>
<li><code>CONSTRAINT pk_student PRIMARY KEY (StudentID)</code> — StudentID is the primary key (the underlined, highlighted column on the figure).</li>
<li><code>INSERT INTO Student VALUES …</code> — puts the six tuples in: that is the <strong>instance</strong>. Tomorrow a new student arrives, the instance changes; the schema does not.</li>
<li>The two <code>COUNT(*)</code> queries measure the figure's labels: <strong>cardinality 6</strong> (rows) and <strong>degree 5</strong> (columns — also called <em>arity</em>).</li>
<li>The last INSERT tries to store Ellis's row a second time and is rejected: with a key, the relation stays "a set of distinct rows or tuples", exactly the slide's last line.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> degree = number of columns, the "width" of the table; cardinality = number of rows, its "length". Degree changes only with ALTER TABLE; cardinality changes with every INSERT or DELETE.</p>`,
        `<p class="y-chinh">🎯 Một quan hệ có hai phần: <strong>lược đồ (schema)</strong> (tên, tên các thuộc tính và kiểu của chúng) và <strong>thể hiện (instance)</strong> (các dòng đang lưu lúc này); đếm số dòng được lực lượng (cardinality), đếm số cột được bậc (degree).</p>
<p>Lược đồ trên slide Student(StudentID: string, Name: string, Registered: int, CounsellorNo: int, Region: int) viết bằng SQL, với sáu dòng trong hình làm thể hiện:</p>
<pre><code class="language-sql">CREATE TABLE Student (                 -- lược đồ: tên quan hệ + thuộc tính + kiểu
  StudentID    VARCHAR(5)  NOT NULL,
  Name         VARCHAR(30) NOT NULL,
  Registered   INT,
  CounsellorNo INT,
  Region       INT,
  CONSTRAINT pk_student PRIMARY KEY (StudentID)
);
INSERT INTO Student VALUES             -- thể hiện: 6 dòng trên slide
  ('s01', 'Akeroyd',  1993, 3158, 3),
  ('s02', 'Thompson', 1998, 5212, 4),
  ('s05', 'Ellis',    1997, 5212, 4),
  ('s07', 'Gillies',  1996, 3158, 3),
  ('s09', 'Reeves',   1998, 5212, 4),
  ('s10', 'Urbach',   1997, 5212, 4);
SELECT * FROM Student;
SELECT COUNT(*) AS cardinality         -- số dòng
FROM Student;
SELECT COUNT(*) AS degree              -- số cột
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Student';
GO
-- thử thêm bộ của Ellis lần thứ hai
INSERT INTO Student VALUES ('s05', 'Ellis', 1997, 5212, 4);</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>StudentID</th><th>Name</th><th>Registered</th><th>CounsellorNo</th><th>Region</th></tr></thead>
<tbody>
<tr><td>s01</td><td>Akeroyd</td><td>1993</td><td>3158</td><td>3</td></tr>
<tr><td>s02</td><td>Thompson</td><td>1998</td><td>5212</td><td>4</td></tr>
<tr><td>s05</td><td>Ellis</td><td>1997</td><td>5212</td><td>4</td></tr>
<tr><td>s07</td><td>Gillies</td><td>1996</td><td>3158</td><td>3</td></tr>
<tr><td>s09</td><td>Reeves</td><td>1998</td><td>5212</td><td>4</td></tr>
<tr><td>s10</td><td>Urbach</td><td>1997</td><td>5212</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>cardinality</th></tr></thead>
<tbody>
<tr><td>6</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>degree</th></tr></thead>
<tbody>
<tr><td>5</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'pk_student'. Cannot insert duplicate key in object 'dbo.Student'. The duplicate key value is (s05).</b><br>
The statement has been terminated.</div>
<p class="nhan">Đọc từng dòng</p>
<ul>
<li><code>CREATE TABLE Student (…)</code> — viết <strong>lược đồ</strong>: tên quan hệ và từng thuộc tính kèm kiểu (<code>VARCHAR(5)</code> = chuỗi tối đa 5 ký tự, chính là "string" của slide; <code>INT</code> = số nguyên).</li>
<li><code>CONSTRAINT pk_student PRIMARY KEY (StudentID)</code> — StudentID là khoá chính (primary key — cột được gạch chân, tô đậm trong hình).</li>
<li><code>INSERT INTO Student VALUES …</code> — đưa sáu bộ vào: đó là <strong>thể hiện</strong>. Mai có sinh viên mới thì thể hiện đổi; lược đồ thì không.</li>
<li>Hai câu <code>COUNT(*)</code> đo đúng hai nhãn trong hình: <strong>lực lượng 6</strong> (số dòng) và <strong>bậc 5</strong> (số cột — còn gọi là <em>arity</em>, ngôi).</li>
<li>Câu INSERT cuối thử lưu dòng của Ellis lần thứ hai và bị từ chối: có khoá thì quan hệ vẫn là "một tập các dòng (bộ) phân biệt", đúng như dòng cuối của slide.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> bậc (degree) = số cột, là "độ rộng" của bảng; lực lượng (cardinality) = số dòng, là "độ dài" của bảng. Bậc chỉ đổi khi ALTER TABLE; lực lượng đổi sau mỗi INSERT hay DELETE.</p>`],
      [8, '2.2 Basics of the Relational Model - database schema',
        `<p class="y-chinh">🎯 A database schema is the set of the relation schemas of one database — here Sailors, Boats and Reserves; underlined attributes form the key of each relation.</p>
<p>Read the three schemas as a small boat-rental club: <strong>Sailors</strong>(<u>sid</u>, sname, rating, age) lists members, <strong>Boats</strong>(<u>bid</u>, bname, color) lists boats, <strong>Reserves</strong>(<u>sid, bid</u>, day) records "sailor sid reserved boat bid on day". In SQL (with three sample sailors, two boats, three reservations — illustrative data):</p>
<pre><code class="language-sql">CREATE TABLE Sailors (
  sid    INT         NOT NULL,
  sname  VARCHAR(30) NOT NULL,
  rating INT,
  age    REAL,
  CONSTRAINT pk_sailors PRIMARY KEY (sid)
);
CREATE TABLE Boats (
  bid   INT         NOT NULL,
  bname VARCHAR(30) NOT NULL,
  color VARCHAR(10),
  CONSTRAINT pk_boats PRIMARY KEY (bid)
);
CREATE TABLE Reserves (
  sid INT  NOT NULL,
  bid INT  NOT NULL,
  day DATE NOT NULL,
  CONSTRAINT pk_reserves PRIMARY KEY (sid, bid),                          -- key of two attributes
  CONSTRAINT fk_reserves_sailors FOREIGN KEY (sid) REFERENCES Sailors(sid),
  CONSTRAINT fk_reserves_boats   FOREIGN KEY (bid) REFERENCES Boats(bid)
);</code></pre>
<pre><code class="language-sql">-- the database schema = the set of the three relation schemas
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME IN ('Sailors', 'Boats', 'Reserves')
ORDER BY TABLE_NAME, ORDINAL_POSITION;</code></pre>
<div class="out">(3 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>TABLE_NAME</th><th>COLUMN_NAME</th><th>DATA_TYPE</th></tr></thead>
<tbody>
<tr><td>Boats</td><td>bid</td><td>int</td></tr>
<tr><td>Boats</td><td>bname</td><td>varchar</td></tr>
<tr><td>Boats</td><td>color</td><td>varchar</td></tr>
<tr><td>Reserves</td><td>sid</td><td>int</td></tr>
<tr><td>Reserves</td><td>bid</td><td>int</td></tr>
<tr><td>Reserves</td><td>day</td><td>date</td></tr>
<tr><td>Sailors</td><td>sid</td><td>int</td></tr>
<tr><td>Sailors</td><td>sname</td><td>varchar</td></tr>
<tr><td>Sailors</td><td>rating</td><td>int</td></tr>
<tr><td>Sailors</td><td>age</td><td>real</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the FOREIGN KEY constraint "fk_reserves_sailors". The conflict occurred in database "DBI202", table "dbo.Sailors", column 'sid'.</b><br>
The statement has been terminated.</div>
<p>The first result lists the database schema as SQL Server stores it (the system view <code>INFORMATION_SCHEMA.COLUMNS</code> holds one row per column of every table). The last INSERT is explained on slide 9.</p>
<p>Seen as an ERD (web Chapter 3): Sailors and Boats are entities, Reserves is the many-to-many relationship between them, so its key is made of the two foreign keys. Note: with this key a sailor can reserve the same boat only once, ever — the key would have to include day to allow repeats. The slide keeps the textbook key; an FE question may ask exactly that.</p>`,
        `<p class="y-chinh">🎯 Lược đồ CSDL (database schema) là tập các lược đồ quan hệ của một CSDL — ở đây là Sailors, Boats và Reserves; thuộc tính gạch chân tạo thành khoá của mỗi quan hệ.</p>
<p>Đọc ba lược đồ như một câu lạc bộ cho thuê thuyền nhỏ: <strong>Sailors</strong>(<u>sid</u>, sname, rating, age) là danh sách thành viên (thuỷ thủ), <strong>Boats</strong>(<u>bid</u>, bname, color) là danh sách thuyền, <strong>Reserves</strong>(<u>sid, bid</u>, day) ghi "thuỷ thủ sid đặt thuyền bid vào ngày day". Viết bằng SQL (kèm ba thuỷ thủ, hai thuyền, ba lượt đặt — dữ liệu minh hoạ):</p>
<pre><code class="language-sql">CREATE TABLE Sailors (
  sid    INT         NOT NULL,
  sname  VARCHAR(30) NOT NULL,
  rating INT,
  age    REAL,
  CONSTRAINT pk_sailors PRIMARY KEY (sid)
);
CREATE TABLE Boats (
  bid   INT         NOT NULL,
  bname VARCHAR(30) NOT NULL,
  color VARCHAR(10),
  CONSTRAINT pk_boats PRIMARY KEY (bid)
);
CREATE TABLE Reserves (
  sid INT  NOT NULL,
  bid INT  NOT NULL,
  day DATE NOT NULL,
  CONSTRAINT pk_reserves PRIMARY KEY (sid, bid),                          -- khoá gồm hai thuộc tính
  CONSTRAINT fk_reserves_sailors FOREIGN KEY (sid) REFERENCES Sailors(sid),
  CONSTRAINT fk_reserves_boats   FOREIGN KEY (bid) REFERENCES Boats(bid)
);</code></pre>
<pre><code class="language-sql">-- lược đồ CSDL = tập ba lược đồ quan hệ
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME IN ('Sailors', 'Boats', 'Reserves')
ORDER BY TABLE_NAME, ORDINAL_POSITION;</code></pre>
<div class="out">(3 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>TABLE_NAME</th><th>COLUMN_NAME</th><th>DATA_TYPE</th></tr></thead>
<tbody>
<tr><td>Boats</td><td>bid</td><td>int</td></tr>
<tr><td>Boats</td><td>bname</td><td>varchar</td></tr>
<tr><td>Boats</td><td>color</td><td>varchar</td></tr>
<tr><td>Reserves</td><td>sid</td><td>int</td></tr>
<tr><td>Reserves</td><td>bid</td><td>int</td></tr>
<tr><td>Reserves</td><td>day</td><td>date</td></tr>
<tr><td>Sailors</td><td>sid</td><td>int</td></tr>
<tr><td>Sailors</td><td>sname</td><td>varchar</td></tr>
<tr><td>Sailors</td><td>rating</td><td>int</td></tr>
<tr><td>Sailors</td><td>age</td><td>real</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the FOREIGN KEY constraint "fk_reserves_sailors". The conflict occurred in database "DBI202", table "dbo.Sailors", column 'sid'.</b><br>
The statement has been terminated.</div>
<p>Kết quả đầu tiên liệt kê lược đồ CSDL đúng như SQL Server lưu (khung nhìn hệ thống <code>INFORMATION_SCHEMA.COLUMNS</code> có một dòng cho mỗi cột của mọi bảng). Câu INSERT cuối được giải thích ở slide 9.</p>
<p>Nhìn bằng ERD (Chương 3 trên web): Sailors và Boats là thực thể (entity), Reserves là liên kết nhiều–nhiều (many-to-many relationship) giữa chúng, nên khoá của nó ghép từ hai khoá ngoại. Lưu ý: với khoá này một thuỷ thủ chỉ đặt được một thuyền đúng một lần trong đời — muốn đặt lại nhiều lần thì khoá phải có thêm day. Slide giữ khoá của sách; câu FE có thể hỏi đúng chỗ này.</p>`],
      [9, '2.2 Basics of the Relational Model - attributes and keys',
        `<p class="y-chinh">🎯 Seven words to know: key attribute, non-key attribute, multi-valued attribute, derived attribute, candidate key, primary key, foreign key.</p>
<table>
<thead><tr><th>Term</th><th>Meaning</th><th>Example (slides 7–8)</th></tr></thead>
<tbody>
<tr><td>key attribute</td><td>an attribute that is part of a key</td><td>sid in Sailors; sid and bid in Reserves</td></tr>
<tr><td>non-key attribute</td><td>an attribute in no key</td><td>sname, rating, age</td></tr>
<tr><td>multi-valued attribute</td><td>one entity has several values (not allowed in a relation cell)</td><td>the phone numbers of a sailor ⇒ a separate table</td></tr>
<tr><td>derived attribute</td><td>computed from other data, usually not stored</td><td>age from a birth date; "number of reservations" from Reserves</td></tr>
<tr><td>candidate key</td><td>a minimal set of attributes whose values never repeat</td><td>StudentID; (sid, bid)</td></tr>
<tr><td>primary key</td><td>the candidate key the designer picks; never NULL</td><td>PRIMARY KEY (sid)</td></tr>
<tr><td>foreign key</td><td>attributes whose values must exist in the key of another relation</td><td>Reserves.sid → Sailors.sid</td></tr>
</tbody>
</table>
<p>The foreign key is what the last INSERT of slide 8 hit: sailor 99 does not exist, so SQL Server refuses to store a reservation for him (message 547, constraint <code>fk_reserves_sailors</code>). This is <em>referential integrity</em>: no row may point to nothing.</p>
<div class="pitfall">A relation may have several <strong>candidate</strong> keys but exactly one <strong>primary</strong> key. "A primary key may contain NULL" and "a foreign key must be unique" are both false — a foreign key usually repeats (sailor 22 has two reservations).</div>
<p class="meo">🧠 Multi-valued and derived attributes are E/R words: they appear again in web Chapter 3 (ERD), where a multi-valued attribute becomes its own table.</p>`,
        `<p class="y-chinh">🎯 Bảy từ phải biết: thuộc tính khoá, thuộc tính không khoá, thuộc tính đa trị, thuộc tính dẫn xuất, khoá ứng viên, khoá chính, khoá ngoại.</p>
<table>
<thead><tr><th>Thuật ngữ</th><th>Nghĩa</th><th>Ví dụ (slide 7–8)</th></tr></thead>
<tbody>
<tr><td>thuộc tính khoá (key attribute)</td><td>thuộc tính nằm trong một khoá</td><td>sid trong Sailors; sid và bid trong Reserves</td></tr>
<tr><td>thuộc tính không khoá (non-key attribute)</td><td>không nằm trong khoá nào</td><td>sname, rating, age</td></tr>
<tr><td>thuộc tính đa trị (multi-valued attribute)</td><td>một đối tượng có nhiều giá trị (ô của quan hệ không cho phép)</td><td>các số điện thoại của một thuỷ thủ ⇒ tách thành bảng riêng</td></tr>
<tr><td>thuộc tính dẫn xuất (derived attribute)</td><td>tính ra từ dữ liệu khác, thường không lưu</td><td>tuổi tính từ ngày sinh; "số lượt đặt" tính từ Reserves</td></tr>
<tr><td>khoá ứng viên (candidate key)</td><td>tập thuộc tính tối thiểu có giá trị không bao giờ lặp</td><td>StudentID; (sid, bid)</td></tr>
<tr><td>khoá chính (primary key)</td><td>khoá ứng viên được người thiết kế chọn; không bao giờ NULL</td><td>PRIMARY KEY (sid)</td></tr>
<tr><td>khoá ngoại (foreign key)</td><td>các thuộc tính mà giá trị phải có trong khoá của quan hệ khác</td><td>Reserves.sid → Sailors.sid</td></tr>
</tbody>
</table>
<p>Khoá ngoại chính là thứ câu INSERT cuối của slide 8 đụng phải: thuỷ thủ 99 không tồn tại, nên SQL Server từ chối lưu lượt đặt của anh ta (thông báo 547, ràng buộc <code>fk_reserves_sailors</code>). Đây là <em>toàn vẹn tham chiếu (referential integrity)</em>: không dòng nào được trỏ vào hư không.</p>
<div class="pitfall">Một quan hệ có thể có nhiều khoá <strong>ứng viên</strong> nhưng đúng một khoá <strong>chính</strong>. "Khoá chính được chứa NULL" và "khoá ngoại phải duy nhất" đều SAI — khoá ngoại thường lặp lại (thuỷ thủ 22 có hai lượt đặt).</div>
<p class="meo">🧠 Thuộc tính đa trị và dẫn xuất là từ của mô hình E/R: chúng gặp lại ở Chương 3 trên web (ERD), nơi thuộc tính đa trị được tách thành một bảng riêng.</p>`],
      [10, '2.3 An Algebraic Query Language - relational algebra',
        `<p class="y-chinh">🎯 Relational algebra is a set of operators that take relations as input and produce a new relation; its operands are relation variables (like Movies) and constant relations.</p>
<p>Compare with the algebra you know: in (x + 3) × 2 the operands are a variable x and constants 3, 2, and + and × produce a new number. In relational algebra the "numbers" are whole tables:</p>
<table>
<thead><tr><th>School algebra</th><th>Relational algebra</th></tr></thead>
<tbody>
<tr><td>operand: a number (x, 3)</td><td>operand: a relation (Movies, or a small constant table)</td></tr>
<tr><td>operator: +, −, ×</td><td>operator: σ, π, ∪, −, ×, ⋈, ρ …</td></tr>
<tr><td>result: a number</td><td>result: a new relation</td></tr>
<tr><td>(x + 3) × 2</td><td>π<sub>title</sub>(σ<sub>year&gt;2000</sub>(Movies))</td></tr>
</tbody>
</table>
<p>Because every result is again a relation, operators can be stacked like brackets in maths — that is what makes it a "query language". SQL is not literally algebra, but SQL Server translates each SELECT into such an expression before running it (slide 22).</p>`,
        `<p class="y-chinh">🎯 Đại số quan hệ (relational algebra) là một tập các phép toán nhận quan hệ làm đầu vào và cho ra một quan hệ mới; toán hạng của nó là biến quan hệ (như Movies) và quan hệ hằng.</p>
<p>So với đại số bạn đã học: trong (x + 3) × 2 toán hạng là biến x và hằng 3, 2, còn + và × cho ra một số mới. Trong đại số quan hệ "các con số" là nguyên cả bảng:</p>
<table>
<thead><tr><th>Đại số ở trường phổ thông</th><th>Đại số quan hệ</th></tr></thead>
<tbody>
<tr><td>toán hạng: một số (x, 3)</td><td>toán hạng: một quan hệ (Movies, hay một bảng hằng nhỏ)</td></tr>
<tr><td>phép toán: +, −, ×</td><td>phép toán: σ, π, ∪, −, ×, ⋈, ρ …</td></tr>
<tr><td>kết quả: một số</td><td>kết quả: một quan hệ mới</td></tr>
<tr><td>(x + 3) × 2</td><td>π<sub>title</sub>(σ<sub>year&gt;2000</sub>(Movies))</td></tr>
</tbody>
</table>
<p>Vì kết quả nào cũng lại là một quan hệ, các phép có thể lồng nhau như ngoặc trong toán — chính điều đó làm nó thành một "ngôn ngữ truy vấn". SQL không hẳn là đại số, nhưng SQL Server dịch mỗi câu SELECT thành một biểu thức như vậy trước khi chạy (slide 22).</p>`],
      [11, '2.3 An Algebraic Query Language - four classes',
        `<p class="y-chinh">🎯 The operators fall into four classes: set operations (∪ ∩ −), selection and projection (σ π), Cartesian product and joins (× ⋈), and rename (ρ).</p>
<table>
<thead><tr><th>Class</th><th>Symbol</th><th>Name</th><th>Does</th><th>SQL</th></tr></thead>
<tbody>
<tr><td>set operations</td><td>∪ ∩ −</td><td>union, intersection, difference</td><td>combine two relations of the same shape</td><td>UNION, INTERSECT, EXCEPT</td></tr>
<tr><td>remove parts of one relation</td><td>σ</td><td>selection</td><td>keep the rows that satisfy a condition</td><td>WHERE</td></tr>
<tr><td></td><td>π</td><td>projection</td><td>keep some columns</td><td>the SELECT list</td></tr>
<tr><td>combine tuples of two relations</td><td>×</td><td>Cartesian product</td><td>every row with every row</td><td>CROSS JOIN</td></tr>
<tr><td></td><td>⋈</td><td>natural join / θ-join</td><td>pairs that match</td><td>JOIN … ON</td></tr>
<tr><td>rename</td><td>ρ</td><td>rename</td><td>new name for the relation or its attributes</td><td>AS</td></tr>
</tbody>
</table>
<p>Lesson 2.B works through each class with the slide's tables, before and after, and runs the SQL. Keep this table: an FE question such as "σ corresponds to which SQL clause?" is answered from it.</p>
<div class="pitfall">σ (sigma, selection) chooses <strong>rows</strong> and becomes WHERE — not SELECT. π (pi, projection) chooses <strong>columns</strong> and becomes the list after SELECT. The names cross over, and that is the trap.</div>`,
        `<p class="y-chinh">🎯 Các phép chia thành bốn nhóm: phép tập hợp (∪ ∩ −), phép chọn và phép chiếu (σ π), tích Descartes và phép nối (× ⋈), và phép đổi tên (ρ).</p>
<table>
<thead><tr><th>Nhóm</th><th>Ký hiệu</th><th>Tên</th><th>Làm gì</th><th>SQL</th></tr></thead>
<tbody>
<tr><td>phép tập hợp</td><td>∪ ∩ −</td><td>hợp, giao, hiệu</td><td>gộp hai quan hệ cùng dạng</td><td>UNION, INTERSECT, EXCEPT</td></tr>
<tr><td>bỏ bớt một phần của một quan hệ</td><td>σ</td><td>phép chọn (selection)</td><td>giữ các dòng thoả điều kiện</td><td>WHERE</td></tr>
<tr><td></td><td>π</td><td>phép chiếu (projection)</td><td>giữ một số cột</td><td>danh sách sau SELECT</td></tr>
<tr><td>ghép bộ của hai quan hệ</td><td>×</td><td>tích Descartes (Cartesian product)</td><td>mỗi dòng với mọi dòng</td><td>CROSS JOIN</td></tr>
<tr><td></td><td>⋈</td><td>nối tự nhiên / θ-join</td><td>các cặp khớp nhau</td><td>JOIN … ON</td></tr>
<tr><td>đổi tên</td><td>ρ</td><td>đổi tên (rename)</td><td>tên mới cho quan hệ hoặc thuộc tính</td><td>AS</td></tr>
</tbody>
</table>
<p>Bài 2.B đi qua từng nhóm bằng đúng các bảng trên slide, có bảng trước và sau, và chạy câu SQL. Giữ bảng này: câu FE kiểu "σ tương ứng mệnh đề SQL nào?" trả lời được ngay từ đây.</p>
<div class="pitfall">σ (sigma, phép chọn) chọn <strong>dòng</strong> và thành WHERE — không phải SELECT. π (pi, phép chiếu) chọn <strong>cột</strong> và thành danh sách sau SELECT. Tên gọi bị "bắt chéo", và đó chính là cái bẫy.</div>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>Name the three parts of a data model and give the SQL keyword for each.</li>
<li>A table has 7 columns and 120 rows. What are its degree and cardinality?</li>
<li>In Reserves(sid, bid, day), which attributes are foreign keys, and why may they repeat?</li>
<li>Which operator keeps rows and which keeps columns?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) structure (CREATE TABLE), operations (SELECT/INSERT/UPDATE/DELETE), constraints (PRIMARY KEY, FOREIGN KEY, CHECK). (2) Degree 7, cardinality 120. (3) sid → Sailors and bid → Boats; one sailor makes many reservations, so the same sid appears in many rows — a foreign key is not a key of its own table. (4) σ keeps rows (WHERE), π keeps columns (SELECT list).</p>
<p><strong>Next:</strong> lesson 2.B — the operators on the slide's tables, with the SQL that computes each result.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Kể ba phần của một mô hình dữ liệu và từ khoá SQL cho mỗi phần.</li>
<li>Một bảng có 7 cột và 120 dòng. Bậc và lực lượng của nó là bao nhiêu?</li>
<li>Trong Reserves(sid, bid, day), thuộc tính nào là khoá ngoại, và vì sao chúng được lặp lại?</li>
<li>Phép nào giữ dòng, phép nào giữ cột?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) cấu trúc (CREATE TABLE), phép toán (SELECT/INSERT/UPDATE/DELETE), ràng buộc (PRIMARY KEY, FOREIGN KEY, CHECK). (2) Bậc 7, lực lượng 120. (3) sid → Sailors và bid → Boats; một thuỷ thủ đặt nhiều lần nên cùng một sid xuất hiện ở nhiều dòng — khoá ngoại không phải là khoá của chính bảng chứa nó. (4) σ giữ dòng (WHERE), π giữ cột (danh sách SELECT).</p>
<p><strong>Tiếp theo:</strong> bài 2.B — các phép toán trên đúng các bảng của slide, kèm câu SQL tính ra từng kết quả.</p>`),
    books([
      ['ullman', 'Ch.2 The Relational Model of Data — §2.1 An Overview of Data Models · §2.2 Basics of the Relational Model (attributes, schemas, tuples, domains, keys)', 'Chương 2 The Relational Model of Data — §2.1 An Overview of Data Models (tổng quan mô hình dữ liệu) · §2.2 Basics of the Relational Model (thuộc tính, lược đồ, bộ, miền giá trị, khoá)'],
      ['ramakrishnan', 'Ch.3 The Relational Model — §3.1 Introduction to the Relational Model · §3.2 Integrity Constraints over Relations (key and foreign key constraints)', 'Chương 3 The Relational Model — §3.1 giới thiệu mô hình quan hệ · §3.2 ràng buộc toàn vẹn trên quan hệ (khoá, khoá ngoại)'],
    ]),
  ].join('\n'),
};

/* ───────── 2.B — 📑 Slide by slide · Set ops, σ, π, joins, rename & expression trees (Chapter 2, slides 12–25) ───────── */
const L_dbi3_2 = {
  title: '2.B — 📑 Slide by slide · Set ops, σ, π, joins, rename & expression trees (Chapter 2, slides 12–25)|||2.B — 📑 Học theo từng slide · Phép tập hợp, σ, π, phép nối, đổi tên & cây biểu thức (Chapter 2, slide 12–25)',
  slug: 'dbi202-slide-dbi3-2',
  type: 'VIDEO',
  description: 'Giảng từng slide 12–25 của bộ slide Chapter 2 của trường: hợp – giao – hiệu và điều kiện tương thích, phép chọn σ, phép chiếu π (tập và túi), tích Descartes, θ-join, nối tự nhiên, đổi tên ρ, biểu thức và cây biểu thức, vai trò của đại số trong DBMS, và bài tập PC/Laptop/Printer — mỗi phép có bảng trước và sau, kèm câu SQL chạy thật trên SQL Server và ô NATURAL JOIN / đổi tên cột của PostgreSQL.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.B · school slides "Chapter 2", slides 12–25</span>
<h2>The operators of relational algebra — one at a time, with SQL</h2>
<p class="lead">⚠️ Still the school's <strong>"Chapter 2"</strong> deck. Here every operator of slide 11 is shown on a tiny table: the table <strong>before</strong>, the table <strong>after</strong>, and the SQL statement that produces the "after" table on SQL Server. All these operators work on <strong>sets</strong> — a relation never holds the same row twice. Keep an eye on the places where SQL behaves differently (it keeps duplicates unless you ask it not to): that difference is the whole topic of lessons 2.C–2.D.</p>
<div class="callout"><strong>After this lesson you can:</strong> compute R ∪ S, R ∩ S, R − S and say when they are allowed; apply σ and π and write them as WHERE and SELECT; compute R × S, a θ-join and a natural join and count their rows before computing them; rename with ρ; build an expression tree for an English question and turn it into SQL — and solve the slide's exercise on the PC/Laptop/Printer database.</div>
<h3>Algebra ↔ SQL — the cheat sheet of this lesson</h3>
<table>
<thead><tr><th>Algebra</th><th>Read it as</th><th>SQL Server</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>R ∪ S · R ∩ S · R − S</td><td>union, intersection, difference</td><td>UNION · INTERSECT · EXCEPT</td><td>12–14</td></tr>
<tr><td>σ<sub>C</sub>(R)</td><td>rows of R satisfying C</td><td>SELECT * FROM R WHERE C</td><td>15</td></tr>
<tr><td>π<sub>A,B</sub>(R)</td><td>columns A, B of R</td><td>SELECT DISTINCT A, B FROM R</td><td>16</td></tr>
<tr><td>R × S</td><td>every pair of rows</td><td>SELECT * FROM R CROSS JOIN S</td><td>17</td></tr>
<tr><td>R ⋈<sub>C</sub> S</td><td>pairs that satisfy C</td><td>SELECT * FROM R JOIN S ON C</td><td>18</td></tr>
<tr><td>R ⋈ S</td><td>pairs equal on all common attributes</td><td>JOIN … ON R.B = S.B (PostgreSQL: NATURAL JOIN)</td><td>19</td></tr>
<tr><td>ρ<sub>S(X,C,D)</sub>(R)</td><td>the same rows, new names</td><td>AS S(X, C, D)</td><td>20</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 2 · Bài 2.B · slide "Chapter 2" của trường, slide 12–25</span>
<h2>Các phép của đại số quan hệ — từng phép một, kèm SQL</h2>
<p class="lead">⚠️ Vẫn là bộ slide <strong>"Chapter 2"</strong> của trường. Ở đây mỗi phép của slide 11 được làm trên một bảng nhỏ xíu: bảng <strong>trước</strong>, bảng <strong>sau</strong>, và câu SQL cho ra đúng bảng "sau" trên SQL Server. Mọi phép ở đây làm trên <strong>tập hợp (set)</strong> — một quan hệ không bao giờ chứa cùng một dòng hai lần. Hãy để ý những chỗ SQL cư xử khác (nó giữ dòng trùng trừ khi bạn yêu cầu bỏ): khác biệt đó là toàn bộ nội dung bài 2.C–2.D.</p>
<div class="callout"><strong>Học xong bài này bạn làm được:</strong> tính R ∪ S, R ∩ S, R − S và nói khi nào được phép; áp dụng σ, π và viết thành WHERE, SELECT; tính R × S, θ-join và nối tự nhiên, đếm trước số dòng của chúng; đổi tên bằng ρ; dựng cây biểu thức cho một câu hỏi tiếng Anh rồi chuyển thành SQL — và giải bài tập PC/Laptop/Printer của slide.</div>
<h3>Đại số ↔ SQL — bảng tra nhanh của bài này</h3>
<table>
<thead><tr><th>Đại số</th><th>Đọc là</th><th>SQL Server</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>R ∪ S · R ∩ S · R − S</td><td>hợp, giao, hiệu</td><td>UNION · INTERSECT · EXCEPT</td><td>12–14</td></tr>
<tr><td>σ<sub>C</sub>(R)</td><td>các dòng của R thoả C</td><td>SELECT * FROM R WHERE C</td><td>15</td></tr>
<tr><td>π<sub>A,B</sub>(R)</td><td>các cột A, B của R</td><td>SELECT DISTINCT A, B FROM R</td><td>16</td></tr>
<tr><td>R × S</td><td>mọi cặp dòng</td><td>SELECT * FROM R CROSS JOIN S</td><td>17</td></tr>
<tr><td>R ⋈<sub>C</sub> S</td><td>các cặp thoả C</td><td>SELECT * FROM R JOIN S ON C</td><td>18</td></tr>
<tr><td>R ⋈ S</td><td>các cặp bằng nhau trên mọi thuộc tính chung</td><td>JOIN … ON R.B = S.B (PostgreSQL: NATURAL JOIN)</td><td>19</td></tr>
<tr><td>ρ<sub>S(X,C,D)</sub>(R)</td><td>cùng các dòng, tên mới</td><td>AS S(X, C, D)</td><td>20</td></tr>
</tbody>
</table>`),
    walkHead('dbi3', 12, 25),
    walk('dbi3', [
      [12, 'Set operations - union, intersection, difference',
        `<p class="y-chinh">🎯 R ∪ S keeps tuples in R or S, R ∩ S keeps tuples in both, R − S (the slide writes R \\ S) keeps tuples in R but not in S — and R, S must be type compatible: same number of attributes, compatible domains.</p>
<p>The formulas read: R ∪ S = { t | t ∈ R ∨ t ∈ S } — "all t such that t is in R <em>or</em> t is in S"; ∧ means "and", ∉ means "is not in". The last line, <strong>R ∩ S = R − (R − S)</strong>, says intersection is not really needed: remove from R everything that is not in S, and what is left is in both. Checked on SQL Server with the tables of slide 13:</p>
<pre><code class="language-sql">CREATE TABLE R (name VARCHAR(20), address VARCHAR(30), gender CHAR(1), birthdate DATE);
CREATE TABLE S (name VARCHAR(20), address VARCHAR(30), gender CHAR(1), birthdate DATE);
INSERT INTO R VALUES ('Carrie Fisher', '123 Maple St., Holywood', 'F', '1999-09-09'),
                     ('Mark Hamill',   '456 Oak Rd., Brentwood',   'M', '1988-08-08');
INSERT INTO S VALUES ('Carrie Fisher', '123 Maple St., Holywood', 'F', '1999-09-09'),
                     ('Harrison Ford', '789 Palm Dr., Beverly Hills', 'M', '1988-08-08');
-- R ∩ S written as R − (R − S)
SELECT * FROM R
EXCEPT
(SELECT * FROM R EXCEPT SELECT * FROM S);</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>name</th><th>address</th><th>gender</th><th>birthdate</th></tr></thead>
<tbody>
<tr><td>Carrie Fisher</td><td>123 Maple St., Holywood</td><td>F</td><td>1999-09-09</td></tr>
</tbody>
</table>
<p>One row, Carrie Fisher — the same answer as INTERSECT on slide 14. Now the "type compatible" rule: try a union of a 4-column table with a 2-column table:</p>
<pre><code class="language-sql">CREATE TABLE R (name VARCHAR(20), address VARCHAR(30), gender CHAR(1), birthdate DATE);
CREATE TABLE Movies (title VARCHAR(30), year INT);
GO
-- 4 columns UNION 2 columns: not type compatible
SELECT * FROM R
UNION
SELECT * FROM Movies;</code></pre>
<div class="out"><b>Msg 205, Level 16, State 1<br>
All queries combined using a UNION, INTERSECT or EXCEPT operator must have an equal number of expressions in their target lists.</b></div>
<p>SQL Server checks only the <em>number</em> of columns and whether the types can be converted; it does not check that the columns mean the same thing. A union of (name, address) with (address, name) runs without error and gives nonsense — putting columns in the same order is your job.</p>
<p class="meo">🧠 <strong>Everyday picture:</strong> R = students in the football club, S = students in the music club. ∪ = in at least one club, ∩ = in both, R − S = football only.</p>`,
        `<p class="y-chinh">🎯 R ∪ S giữ các bộ có trong R hoặc S, R ∩ S giữ các bộ có ở cả hai, R − S (slide viết R \\ S) giữ các bộ có trong R mà không có trong S — và R, S phải tương thích kiểu (type compatible): cùng số thuộc tính, miền giá trị tương ứng tương thích.</p>
<p>Các công thức đọc là: R ∪ S = { t | t ∈ R ∨ t ∈ S } — "mọi t sao cho t thuộc R <em>hoặc</em> t thuộc S"; ∧ nghĩa là "và", ∉ nghĩa là "không thuộc". Dòng cuối, <strong>R ∩ S = R − (R − S)</strong>, nói rằng phép giao không thật sự cần thiết: bỏ khỏi R mọi thứ không có trong S, phần còn lại có ở cả hai. Kiểm trên SQL Server với các bảng của slide 13:</p>
<pre><code class="language-sql">CREATE TABLE R (name VARCHAR(20), address VARCHAR(30), gender CHAR(1), birthdate DATE);
CREATE TABLE S (name VARCHAR(20), address VARCHAR(30), gender CHAR(1), birthdate DATE);
INSERT INTO R VALUES ('Carrie Fisher', '123 Maple St., Holywood', 'F', '1999-09-09'),
                     ('Mark Hamill',   '456 Oak Rd., Brentwood',   'M', '1988-08-08');
INSERT INTO S VALUES ('Carrie Fisher', '123 Maple St., Holywood', 'F', '1999-09-09'),
                     ('Harrison Ford', '789 Palm Dr., Beverly Hills', 'M', '1988-08-08');
-- R ∩ S viết thành R − (R − S)
SELECT * FROM R
EXCEPT
(SELECT * FROM R EXCEPT SELECT * FROM S);</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>name</th><th>address</th><th>gender</th><th>birthdate</th></tr></thead>
<tbody>
<tr><td>Carrie Fisher</td><td>123 Maple St., Holywood</td><td>F</td><td>1999-09-09</td></tr>
</tbody>
</table>
<p>Một dòng, Carrie Fisher — đúng như kết quả INTERSECT ở slide 14. Giờ tới luật "tương thích kiểu": thử hợp một bảng 4 cột với một bảng 2 cột:</p>
<pre><code class="language-sql">CREATE TABLE R (name VARCHAR(20), address VARCHAR(30), gender CHAR(1), birthdate DATE);
CREATE TABLE Movies (title VARCHAR(30), year INT);
GO
-- 4 cột UNION 2 cột: không tương thích
SELECT * FROM R
UNION
SELECT * FROM Movies;</code></pre>
<div class="out"><b>Msg 205, Level 16, State 1<br>
All queries combined using a UNION, INTERSECT or EXCEPT operator must have an equal number of expressions in their target lists.</b></div>
<p>SQL Server chỉ kiểm <em>số</em> cột và kiểu có đổi được cho nhau không; nó không kiểm các cột có cùng ý nghĩa hay không. Hợp (name, address) với (address, name) vẫn chạy không lỗi và cho ra kết quả vô nghĩa — xếp cột đúng thứ tự là việc của bạn.</p>
<p class="meo">🧠 <strong>Hình ảnh đời thường:</strong> R = sinh viên CLB bóng đá, S = sinh viên CLB âm nhạc. ∪ = ở ít nhất một CLB, ∩ = ở cả hai, R − S = chỉ đá bóng.</p>`],
      [13, 'Set operations - Example (R and S)',
        `<p class="y-chinh">🎯 Two relations with the same four attributes (name, address, gender, birthdate): R holds Carrie Fisher and Mark Hamill, S holds Carrie Fisher and Harrison Ford.</p>
<p class="nhan">Before — the two inputs</p>
<table>
<thead><tr><th>Relation</th><th>name</th><th>address</th><th>gender</th><th>birthdate</th></tr></thead>
<tbody>
<tr><td>R</td><td>Carrie Fisher</td><td>123 Maple St., Holywood</td><td>F</td><td>9/9/99</td></tr>
<tr><td>R</td><td>Mark Hamill</td><td>456 Oak Rd., Brentwood</td><td>M</td><td>8/8/88</td></tr>
<tr><td>S</td><td>Carrie Fisher</td><td>123 Maple St., Holywood</td><td>F</td><td>9/9/99</td></tr>
<tr><td>S</td><td>Harrison Ford</td><td>789 Palm Dr., Beverly Hills</td><td>M</td><td>8/8/88</td></tr>
</tbody>
</table>
<p>The tables in SQL (the dates are stored as real <code>DATE</code> values, 1999-09-09 and 1988-08-08; "Holywood" is spelled as on the slide):</p>
<pre><code class="language-sql">CREATE TABLE R (name VARCHAR(20), address VARCHAR(30), gender CHAR(1), birthdate DATE);
CREATE TABLE S (name VARCHAR(20), address VARCHAR(30), gender CHAR(1), birthdate DATE);
INSERT INTO R VALUES ('Carrie Fisher', '123 Maple St., Holywood', 'F', '1999-09-09'),
                     ('Mark Hamill',   '456 Oak Rd., Brentwood',   'M', '1988-08-08');
INSERT INTO S VALUES ('Carrie Fisher', '123 Maple St., Holywood', 'F', '1999-09-09'),
                     ('Harrison Ford', '789 Palm Dr., Beverly Hills', 'M', '1988-08-08');</code></pre>
<p>Both relations are type compatible: four attributes each, with the same domains in the same order. Carrie Fisher's row is <em>identical</em> in R and S — equal on all four attributes — which is what "the same tuple" means for ∩ and −. If her address differed by one character, the two rows would be different tuples.</p>`,
        `<p class="y-chinh">🎯 Hai quan hệ cùng bốn thuộc tính (name, address, gender, birthdate): R chứa Carrie Fisher và Mark Hamill, S chứa Carrie Fisher và Harrison Ford.</p>
<p class="nhan">Trước — hai đầu vào</p>
<table>
<thead><tr><th>Quan hệ</th><th>name</th><th>address</th><th>gender</th><th>birthdate</th></tr></thead>
<tbody>
<tr><td>R</td><td>Carrie Fisher</td><td>123 Maple St., Holywood</td><td>F</td><td>9/9/99</td></tr>
<tr><td>R</td><td>Mark Hamill</td><td>456 Oak Rd., Brentwood</td><td>M</td><td>8/8/88</td></tr>
<tr><td>S</td><td>Carrie Fisher</td><td>123 Maple St., Holywood</td><td>F</td><td>9/9/99</td></tr>
<tr><td>S</td><td>Harrison Ford</td><td>789 Palm Dr., Beverly Hills</td><td>M</td><td>8/8/88</td></tr>
</tbody>
</table>
<p>Các bảng viết bằng SQL (ngày được lưu thành giá trị <code>DATE</code> thật, 1999-09-09 và 1988-08-08; "Holywood" giữ đúng chính tả trên slide):</p>
<pre><code class="language-sql">CREATE TABLE R (name VARCHAR(20), address VARCHAR(30), gender CHAR(1), birthdate DATE);
CREATE TABLE S (name VARCHAR(20), address VARCHAR(30), gender CHAR(1), birthdate DATE);
INSERT INTO R VALUES ('Carrie Fisher', '123 Maple St., Holywood', 'F', '1999-09-09'),
                     ('Mark Hamill',   '456 Oak Rd., Brentwood',   'M', '1988-08-08');
INSERT INTO S VALUES ('Carrie Fisher', '123 Maple St., Holywood', 'F', '1999-09-09'),
                     ('Harrison Ford', '789 Palm Dr., Beverly Hills', 'M', '1988-08-08');</code></pre>
<p>Hai quan hệ tương thích kiểu: mỗi bên bốn thuộc tính, miền giá trị giống nhau theo cùng thứ tự. Dòng của Carrie Fisher <em>giống hệt</em> nhau trong R và S — bằng nhau trên cả bốn thuộc tính — đó mới là "cùng một bộ" đối với ∩ và −. Nếu địa chỉ của cô ấy khác nhau một ký tự thì hai dòng là hai bộ khác nhau.</p>`],
      [14, 'Set operations - Example (results)',
        `<p class="y-chinh">🎯 R ∪ S has 3 tuples (Carrie Fisher only once), R ∩ S has 1 (Carrie Fisher), R − S has 1 (Mark Hamill).</p>
<pre><code class="language-sql">SELECT * FROM R UNION     SELECT * FROM S;   -- R ∪ S
SELECT * FROM R INTERSECT SELECT * FROM S;   -- R ∩ S
SELECT * FROM R EXCEPT    SELECT * FROM S;   -- R − S  (the slide writes R \\ S</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>name</th><th>address</th><th>gender</th><th>birthdate</th></tr></thead>
<tbody>
<tr><td>Carrie Fisher</td><td>123 Maple St., Holywood</td><td>F</td><td>1999-09-09</td></tr>
<tr><td>Harrison Ford</td><td>789 Palm Dr., Beverly Hills</td><td>M</td><td>1988-08-08</td></tr>
<tr><td>Mark Hamill</td><td>456 Oak Rd., Brentwood</td><td>M</td><td>1988-08-08</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>name</th><th>address</th><th>gender</th><th>birthdate</th></tr></thead>
<tbody>
<tr><td>Carrie Fisher</td><td>123 Maple St., Holywood</td><td>F</td><td>1999-09-09</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>name</th><th>address</th><th>gender</th><th>birthdate</th></tr></thead>
<tbody>
<tr><td>Mark Hamill</td><td>456 Oak Rd., Brentwood</td><td>M</td><td>1988-08-08</td></tr>
</tbody>
</table>
<ul>
<li><code>UNION</code> = ∪ and removes duplicates: 2 + 2 = 4 rows go in, 3 come out. (SQL Server happens to return them sorted by name — never count on an order you did not ask for with ORDER BY.)</li>
<li><code>INTERSECT</code> = ∩: only the row present in both.</li>
<li><code>EXCEPT</code> = − : rows of the first query missing from the second. R − S ≠ S − R: S − R would give Harrison Ford.</li>
</ul>
<p>The three keywords are spelled the same on PostgreSQL. What changes between the two systems is only the bag versions (INTERSECT ALL, EXCEPT ALL), in lesson 2.C.</p>
<div class="pitfall"><strong>UNION vs UNION ALL</strong> — UNION follows set semantics (removes duplicates); UNION ALL keeps every row, so it would return 4 rows here with Carrie Fisher twice. This is the first place where "set vs bag" becomes a real SQL choice.</div>`,
        `<p class="y-chinh">🎯 R ∪ S có 3 bộ (Carrie Fisher chỉ một lần), R ∩ S có 1 (Carrie Fisher), R − S có 1 (Mark Hamill).</p>
<pre><code class="language-sql">SELECT * FROM R UNION     SELECT * FROM S;   -- R ∪ S
SELECT * FROM R INTERSECT SELECT * FROM S;   -- R ∩ S
SELECT * FROM R EXCEPT    SELECT * FROM S;   -- slide viết R \\ S)</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>name</th><th>address</th><th>gender</th><th>birthdate</th></tr></thead>
<tbody>
<tr><td>Carrie Fisher</td><td>123 Maple St., Holywood</td><td>F</td><td>1999-09-09</td></tr>
<tr><td>Harrison Ford</td><td>789 Palm Dr., Beverly Hills</td><td>M</td><td>1988-08-08</td></tr>
<tr><td>Mark Hamill</td><td>456 Oak Rd., Brentwood</td><td>M</td><td>1988-08-08</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>name</th><th>address</th><th>gender</th><th>birthdate</th></tr></thead>
<tbody>
<tr><td>Carrie Fisher</td><td>123 Maple St., Holywood</td><td>F</td><td>1999-09-09</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>name</th><th>address</th><th>gender</th><th>birthdate</th></tr></thead>
<tbody>
<tr><td>Mark Hamill</td><td>456 Oak Rd., Brentwood</td><td>M</td><td>1988-08-08</td></tr>
</tbody>
</table>
<ul>
<li><code>UNION</code> = ∪ và bỏ dòng trùng: 2 + 2 = 4 dòng đi vào, 3 dòng đi ra. (SQL Server tình cờ trả về theo thứ tự tên — đừng bao giờ tin vào một thứ tự mà bạn không yêu cầu bằng ORDER BY.)</li>
<li><code>INTERSECT</code> = ∩: chỉ dòng có ở cả hai.</li>
<li><code>EXCEPT</code> = − : các dòng của câu thứ nhất mà câu thứ hai không có. R − S ≠ S − R: S − R sẽ cho Harrison Ford.</li>
</ul>
<p>Ba từ khoá này viết y hệt trên PostgreSQL. Chỗ hai hệ khác nhau chỉ là bản túi (INTERSECT ALL, EXCEPT ALL), ở bài 2.C.</p>
<div class="pitfall"><strong>UNION và UNION ALL</strong> — UNION theo ngữ nghĩa tập (bỏ dòng trùng); UNION ALL giữ mọi dòng, nên ở đây sẽ ra 4 dòng với Carrie Fisher hai lần. Đây là chỗ đầu tiên "tập hay túi" (set vs bag) thành một lựa chọn thật trong SQL.</div>`],
      [15, 'Selection and projection - selection σ',
        `<p class="y-chinh">🎯 Selection σ<sub>C</sub>(R) keeps the tuples of R that satisfy the condition C; the result has the same attributes as R. σ<sub>length ≥ 100</sub>(Movies) keeps Gone With the Wind and Star Wars and drops Wayne's World (95).</p>
<pre><code class="language-sql">CREATE TABLE Movies (title VARCHAR(30), year INT, length INT, genre VARCHAR(10));
INSERT INTO Movies VALUES ('Gone With the Wind', 1939, 231, 'Drama'),
                          ('Star Wars',          1977, 124, 'Scifi'),
                          ('Wayne''s World',     1992,  95, 'Comedy');
-- σ length &gt;= 100 (Movies)
SELECT *
FROM Movies
WHERE length &gt;= 100;
-- σ C1 (σ C2 (R)) = σ C1 AND C2 (R): nested form
SELECT * FROM (SELECT * FROM Movies WHERE genre = 'Scifi') AS T
WHERE length &gt;= 100;
-- one selection with AND
SELECT * FROM Movies
WHERE length &gt;= 100 AND genre = 'Scifi';</code></pre>
<div class="out">(3 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>genre</th></tr></thead>
<tbody>
<tr><td>Gone With the Wind</td><td>1939</td><td>231</td><td>Drama</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Scifi</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>genre</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Scifi</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>genre</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Scifi</td></tr>
</tbody>
</table>
<p>Line by line: <code>SELECT *</code> = keep every column (σ never removes columns); <code>FROM Movies</code> = the input relation; <code>WHERE length &gt;= 100</code> = the condition C, tested row by row. The first result is the slide's "after" table: 3 rows in, 2 out.</p>
<p>The slide's second line, σ<sub>C1</sub>(σ<sub>C2</sub>(R)) = σ<sub>C2</sub>(σ<sub>C1</sub>(R)) = σ<sub>C1 AND C2</sub>(R), says: two filters one after the other, in any order, equal one filter with AND. The last two results show it (C1 = length ≥ 100, C2 = genre = 'Scifi'): the nested query and the AND query both return Star Wars only. This is why the order of conditions in a WHERE never changes the answer.</p>
<p class="meo">🧠 σ = <strong>s</strong>igma = <strong>s</strong>election = keep rows, like a sieve: rows fall through or stay, but every row that stays is complete.</p>`,
        `<p class="y-chinh">🎯 Phép chọn (selection) σ<sub>C</sub>(R) giữ các bộ của R thoả điều kiện C; kết quả có đúng các thuộc tính của R. σ<sub>length ≥ 100</sub>(Movies) giữ Gone With the Wind và Star Wars, bỏ Wayne's World (95).</p>
<pre><code class="language-sql">CREATE TABLE Movies (title VARCHAR(30), year INT, length INT, genre VARCHAR(10));
INSERT INTO Movies VALUES ('Gone With the Wind', 1939, 231, 'Drama'),
                          ('Star Wars',          1977, 124, 'Scifi'),
                          ('Wayne''s World',     1992,  95, 'Comedy');
-- σ length &gt;= 100 (Movies)
SELECT *
FROM Movies
WHERE length &gt;= 100;
-- dạng lồng nhau
SELECT * FROM (SELECT * FROM Movies WHERE genre = 'Scifi') AS T
WHERE length &gt;= 100;
-- một phép chọn với AND
SELECT * FROM Movies
WHERE length &gt;= 100 AND genre = 'Scifi';</code></pre>
<div class="out">(3 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>genre</th></tr></thead>
<tbody>
<tr><td>Gone With the Wind</td><td>1939</td><td>231</td><td>Drama</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Scifi</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>genre</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Scifi</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>genre</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Scifi</td></tr>
</tbody>
</table>
<p>Từng dòng: <code>SELECT *</code> = giữ mọi cột (σ không bao giờ bỏ cột); <code>FROM Movies</code> = quan hệ đầu vào; <code>WHERE length &gt;= 100</code> = điều kiện C, kiểm từng dòng một. Kết quả đầu tiên chính là bảng "sau" của slide: 3 dòng vào, 2 dòng ra.</p>
<p>Dòng thứ hai của slide, σ<sub>C1</sub>(σ<sub>C2</sub>(R)) = σ<sub>C2</sub>(σ<sub>C1</sub>(R)) = σ<sub>C1 AND C2</sub>(R), nói: hai lần lọc nối tiếp, theo thứ tự nào cũng được, bằng một lần lọc với AND. Hai kết quả cuối cho thấy điều đó (C1 = length ≥ 100, C2 = genre = 'Scifi'): câu lồng nhau và câu dùng AND đều chỉ trả về Star Wars. Đây là lý do thứ tự các điều kiện trong WHERE không bao giờ làm đổi đáp án.</p>
<p class="meo">🧠 σ = <strong>s</strong>igma = <strong>s</strong>election = giữ dòng, như cái rây: dòng rơi xuống hoặc ở lại, nhưng dòng nào ở lại thì còn nguyên vẹn.</p>`],
      [16, 'Selection and projection - projection π',
        `<p class="y-chinh">🎯 Projection π<sub>A1,…,An</sub>(R) keeps only the listed attributes; the result has schema S(A1,…,An). π<sub>title,year,length</sub>(Movies) drops genre; π<sub>genre</sub>(Movies) gives {Scifi, Comedy} — 2 tuples, not 3.</p>
<pre><code class="language-sql">CREATE TABLE Movies (title VARCHAR(30), year INT, length INT, genre VARCHAR(10));
INSERT INTO Movies VALUES ('Star Wars',     1977, 124, 'Scifi'),
                          ('Galaxy Quest',  1999, 104, 'Comedy'),
                          ('Wayne''s World', 1992,  95, 'Comedy');
-- π title, year, length (Movies)
SELECT title, year, length FROM Movies;
-- π genre (Movies) as a SET: duplicates removed
SELECT DISTINCT genre FROM Movies;
-- the same without DISTINCT: SQL keeps duplicates (a BAG)
SELECT genre FROM Movies;</code></pre>
<div class="out">(3 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>124</td></tr>
<tr><td>Galaxy Quest</td><td>1999</td><td>104</td></tr>
<tr><td>Wayne's World</td><td>1992</td><td>95</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>genre</th></tr></thead>
<tbody>
<tr><td>Comedy</td></tr>
<tr><td>Scifi</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>genre</th></tr></thead>
<tbody>
<tr><td>Scifi</td></tr>
<tr><td>Comedy</td></tr>
<tr><td>Comedy</td></tr>
</tbody>
</table>
<ul>
<li>First result: π<sub>title,year,length</sub>(Movies) — 3 rows, one column fewer. No duplicates can appear here, because title and year together already differ in every row.</li>
<li>Second result: <code>SELECT DISTINCT genre</code> — the slide's π<sub>genre</sub>: Comedy appeared twice in Movies and is kept once, because a relation is a <strong>set</strong>.</li>
<li>Third result: plain <code>SELECT genre</code> — SQL does <strong>not</strong> remove duplicates by itself: Comedy is there twice. SQL tables and results are <strong>bags</strong>.</li>
</ul>
<div class="pitfall">"π<sub>genre</sub>(Movies) has as many rows as Movies" is <strong>false</strong> in set algebra (2 rows, not 3) — but it is true for <code>SELECT genre FROM Movies</code>. In the exam, algebra = sets unless the question says "bag"; to write π in SQL exactly, write <code>SELECT DISTINCT</code>.</div>
<p class="meo">🧠 π = <strong>p</strong>i = <strong>p</strong>rojection = pick columns, like the shadow of a 3-D object on a wall: you lose a dimension, and two different objects may cast the same shadow (two Comedy rows → one).</p>`,
        `<p class="y-chinh">🎯 Phép chiếu (projection) π<sub>A1,…,An</sub>(R) chỉ giữ các thuộc tính được liệt kê; kết quả có lược đồ S(A1,…,An). π<sub>title,year,length</sub>(Movies) bỏ cột genre; π<sub>genre</sub>(Movies) cho {Scifi, Comedy} — 2 bộ, không phải 3.</p>
<pre><code class="language-sql">CREATE TABLE Movies (title VARCHAR(30), year INT, length INT, genre VARCHAR(10));
INSERT INTO Movies VALUES ('Star Wars',     1977, 124, 'Scifi'),
                          ('Galaxy Quest',  1999, 104, 'Comedy'),
                          ('Wayne''s World', 1992,  95, 'Comedy');
-- π title, year, length (Movies)
SELECT title, year, length FROM Movies;
-- dạng TẬP: bỏ trùng
SELECT DISTINCT genre FROM Movies;
-- không DISTINCT: SQL giữ dòng trùng (TÚI)
SELECT genre FROM Movies;</code></pre>
<div class="out">(3 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>124</td></tr>
<tr><td>Galaxy Quest</td><td>1999</td><td>104</td></tr>
<tr><td>Wayne's World</td><td>1992</td><td>95</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>genre</th></tr></thead>
<tbody>
<tr><td>Comedy</td></tr>
<tr><td>Scifi</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>genre</th></tr></thead>
<tbody>
<tr><td>Scifi</td></tr>
<tr><td>Comedy</td></tr>
<tr><td>Comedy</td></tr>
</tbody>
</table>
<ul>
<li>Kết quả thứ nhất: π<sub>title,year,length</sub>(Movies) — 3 dòng, bớt một cột. Ở đây không thể có dòng trùng, vì title và year gộp lại đã khác nhau ở mọi dòng.</li>
<li>Kết quả thứ hai: <code>SELECT DISTINCT genre</code> — chính là π<sub>genre</sub> của slide: Comedy xuất hiện hai lần trong Movies và được giữ một lần, vì quan hệ là một <strong>tập hợp</strong>.</li>
<li>Kết quả thứ ba: <code>SELECT genre</code> trơn — SQL <strong>không</strong> tự bỏ dòng trùng: Comedy có mặt hai lần. Bảng và kết quả của SQL là <strong>túi (bag)</strong>.</li>
</ul>
<div class="pitfall">"π<sub>genre</sub>(Movies) có số dòng bằng Movies" là <strong>SAI</strong> trong đại số trên tập (2 dòng chứ không phải 3) — nhưng lại ĐÚNG với <code>SELECT genre FROM Movies</code>. Trong đề thi, đại số = tập hợp trừ khi câu hỏi nói "bag"; muốn viết π bằng SQL cho chuẩn xác thì viết <code>SELECT DISTINCT</code>.</div>
<p class="meo">🧠 π = <strong>p</strong>i = <strong>p</strong>rojection = chọn cột, như cái bóng của một vật 3 chiều in lên tường: mất một chiều, và hai vật khác nhau có thể cho cùng một cái bóng (hai dòng Comedy → một).</p>`],
      [17, 'Cartesian product',
        `<p class="y-chinh">🎯 The Cartesian product R × S pairs every tuple of R with every tuple of S: 2 rows × 3 rows = 6 rows, and 2 + 3 = 5 columns. The attribute B exists on both sides, so it appears twice, as R.B and S.B.</p>
<p class="nhan">Before</p>
<table>
<thead><tr><th>R: A</th><th>R: B</th><th></th><th>S: B</th><th>S: C</th><th>S: D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td></td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>3</td><td>4</td><td></td><td>4</td><td>7</td><td>8</td></tr>
<tr><td></td><td></td><td></td><td>9</td><td>10</td><td>11</td></tr>
</tbody>
</table>
<p class="nhan">After — SQL Server</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);
CREATE TABLE S (B INT, C INT, D INT);
INSERT INTO R VALUES (1, 2), (3, 4);
INSERT INTO S VALUES (2, 5, 6), (4, 7, 8), (9, 10, 11);
-- R × S: every row of R with every row of S
SELECT R.A, R.B AS [R.B], S.B AS [S.B], S.C, S.D
FROM R CROSS JOIN S
ORDER BY R.A, S.B;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>R.B</th><th>S.B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>7</td><td>8</td></tr>
<tr><td>1</td><td>2</td><td>9</td><td>10</td><td>11</td></tr>
<tr><td>3</td><td>4</td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>3</td><td>4</td><td>4</td><td>7</td><td>8</td></tr>
<tr><td>3</td><td>4</td><td>9</td><td>10</td><td>11</td></tr>
</tbody>
</table>
<p><code>CROSS JOIN</code> has no condition: it really forms every pair. <code>AS [R.B]</code> only gives the column a name with a dot in it (square brackets allow such names in SQL Server) so the output looks like the slide. <code>ORDER BY</code> fixes the order for easy comparison — without it, the order of rows is not guaranteed.</p>
<p>Most pairs are meaningless — (1, 2) with (9, 10, 11) has nothing in common. The product is the raw material: the joins on the next two slides are "product, then keep the pairs that make sense".</p>
<div class="pitfall">Forgetting the join condition — <code>FROM R, S</code> with no WHERE — is a product. On two tables of 10,000 rows that is 100 million rows. If a PE answer returns far too many rows, look for a missing condition first.</div>`,
        `<p class="y-chinh">🎯 Tích Descartes (Cartesian product) R × S ghép mỗi bộ của R với mọi bộ của S: 2 dòng × 3 dòng = 6 dòng, và 2 + 3 = 5 cột. Thuộc tính B có ở cả hai bên nên xuất hiện hai lần, thành R.B và S.B.</p>
<p class="nhan">Trước</p>
<table>
<thead><tr><th>R: A</th><th>R: B</th><th></th><th>S: B</th><th>S: C</th><th>S: D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td></td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>3</td><td>4</td><td></td><td>4</td><td>7</td><td>8</td></tr>
<tr><td></td><td></td><td></td><td>9</td><td>10</td><td>11</td></tr>
</tbody>
</table>
<p class="nhan">Sau — SQL Server</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);
CREATE TABLE S (B INT, C INT, D INT);
INSERT INTO R VALUES (1, 2), (3, 4);
INSERT INTO S VALUES (2, 5, 6), (4, 7, 8), (9, 10, 11);
-- mỗi dòng R ghép với mọi dòng S
SELECT R.A, R.B AS [R.B], S.B AS [S.B], S.C, S.D
FROM R CROSS JOIN S
ORDER BY R.A, S.B;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>R.B</th><th>S.B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>7</td><td>8</td></tr>
<tr><td>1</td><td>2</td><td>9</td><td>10</td><td>11</td></tr>
<tr><td>3</td><td>4</td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>3</td><td>4</td><td>4</td><td>7</td><td>8</td></tr>
<tr><td>3</td><td>4</td><td>9</td><td>10</td><td>11</td></tr>
</tbody>
</table>
<p><code>CROSS JOIN</code> không có điều kiện: nó thật sự tạo mọi cặp. <code>AS [R.B]</code> chỉ đặt cho cột một cái tên có dấu chấm (dấu ngoặc vuông cho phép tên như vậy trong SQL Server) để output trông giống slide. <code>ORDER BY</code> cố định thứ tự cho dễ so — không có nó, thứ tự dòng không được đảm bảo.</p>
<p>Phần lớn các cặp vô nghĩa — (1, 2) với (9, 10, 11) chẳng có gì chung. Tích là nguyên liệu thô: các phép nối ở hai slide sau là "lấy tích, rồi giữ các cặp có nghĩa".</p>
<div class="pitfall">Quên điều kiện nối — <code>FROM R, S</code> mà không có WHERE — chính là một phép tích. Hai bảng 10.000 dòng cho ra 100 triệu dòng. Bài PE nào trả về nhiều dòng bất thường thì trước hết hãy tìm điều kiện bị thiếu.</div>`],
      [18, 'Theta join',
        `<p class="y-chinh">🎯 A theta-join R ⋈<sub>C</sub> S keeps the pairs of R × S that satisfy the condition C: U ⋈<sub>A&lt;D</sub> V has 5 of the 9 pairs, and adding U.B ≠ V.B leaves 1.</p>
<p class="nhan">Before</p>
<table>
<thead><tr><th>U: A</th><th>U: B</th><th>U: C</th><th></th><th>V: B</th><th>V: C</th><th>V: D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td><td></td><td>2</td><td>3</td><td>4</td></tr>
<tr><td>6</td><td>7</td><td>8</td><td></td><td>2</td><td>3</td><td>5</td></tr>
<tr><td>9</td><td>7</td><td>8</td><td></td><td>7</td><td>8</td><td>10</td></tr>
</tbody>
</table>
<p class="nhan">After — Figure 2.17 and the second result, on SQL Server</p>
<pre><code class="language-sql">CREATE TABLE U (A INT, B INT, C INT);
CREATE TABLE V (B INT, C INT, D INT);
INSERT INTO U VALUES (1, 2, 3), (6, 7, 8), (9, 7, 8);
INSERT INTO V VALUES (2, 3, 4), (2, 3, 5), (7, 8, 10);
-- U ⋈ A&lt;D V
SELECT U.A, U.B AS [U.B], U.C AS [U.C], V.B AS [V.B], V.C AS [V.C], V.D
FROM U JOIN V ON U.A &lt; V.D
ORDER BY U.A, V.D;
-- U ⋈ A&lt;D AND U.B≠V.B V
SELECT U.A, U.B AS [U.B], U.C AS [U.C], V.B AS [V.B], V.C AS [V.C], V.D
FROM U JOIN V ON U.A &lt; V.D AND U.B &lt;&gt; V.B;</code></pre>
<div class="out">(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>U.B</th><th>U.C</th><th>V.B</th><th>V.C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td><td>2</td><td>3</td><td>4</td></tr>
<tr><td>1</td><td>2</td><td>3</td><td>2</td><td>3</td><td>5</td></tr>
<tr><td>1</td><td>2</td><td>3</td><td>7</td><td>8</td><td>10</td></tr>
<tr><td>6</td><td>7</td><td>8</td><td>7</td><td>8</td><td>10</td></tr>
<tr><td>9</td><td>7</td><td>8</td><td>7</td><td>8</td><td>10</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>U.B</th><th>U.C</th><th>V.B</th><th>V.C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td><td>7</td><td>8</td><td>10</td></tr>
</tbody>
</table>
<p>Why 5: A = 1 is less than every D (4, 5, 10) → 3 pairs; A = 6 and A = 9 are less only than D = 10 → 1 pair each. With the extra condition U.B ≠ V.B (written <code>&lt;&gt;</code> in SQL), only (1, 2, 3) with (7, 8, 10) is left. θ ("theta") stands for any comparison: =, &lt;, &gt;, ≠, ≤, ≥, combined with AND.</p>
<p>The definition "R ⋈<sub>C</sub> S = σ<sub>C</sub>(R × S)" can be checked directly — count the product, then count after the filter:</p>
<pre><code class="language-sql">CREATE TABLE U (A INT, B INT, C INT);
CREATE TABLE V (B INT, C INT, D INT);
INSERT INTO U VALUES (1, 2, 3), (6, 7, 8), (9, 7, 8);
INSERT INTO V VALUES (2, 3, 4), (2, 3, 5), (7, 8, 10);
-- σ A&lt;D (U × V): product first, then selection
SELECT COUNT(*) AS rows_in_product FROM U CROSS JOIN V;
SELECT COUNT(*) AS rows_after_selection
FROM U CROSS JOIN V
WHERE U.A &lt; V.D;</code></pre>
<div class="out">(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>rows_in_product</th></tr></thead>
<tbody>
<tr><td>9</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>rows_after_selection</th></tr></thead>
<tbody>
<tr><td>5</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Theta-join = product + WHERE.</strong> <code>FROM U JOIN V ON cond</code> and <code>FROM U CROSS JOIN V WHERE cond</code> give the same rows; the JOIN … ON form is preferred because the condition sits next to the tables it links.</p>`,
        `<p class="y-chinh">🎯 Phép θ-join (nối theta) R ⋈<sub>C</sub> S giữ các cặp của R × S thoả điều kiện C: U ⋈<sub>A&lt;D</sub> V giữ 5 trong 9 cặp, thêm U.B ≠ V.B thì còn 1.</p>
<p class="nhan">Trước</p>
<table>
<thead><tr><th>U: A</th><th>U: B</th><th>U: C</th><th></th><th>V: B</th><th>V: C</th><th>V: D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td><td></td><td>2</td><td>3</td><td>4</td></tr>
<tr><td>6</td><td>7</td><td>8</td><td></td><td>2</td><td>3</td><td>5</td></tr>
<tr><td>9</td><td>7</td><td>8</td><td></td><td>7</td><td>8</td><td>10</td></tr>
</tbody>
</table>
<p class="nhan">Sau — Hình 2.17 và kết quả thứ hai, trên SQL Server</p>
<pre><code class="language-sql">CREATE TABLE U (A INT, B INT, C INT);
CREATE TABLE V (B INT, C INT, D INT);
INSERT INTO U VALUES (1, 2, 3), (6, 7, 8), (9, 7, 8);
INSERT INTO V VALUES (2, 3, 4), (2, 3, 5), (7, 8, 10);
-- U ⋈ A&lt;D V
SELECT U.A, U.B AS [U.B], U.C AS [U.C], V.B AS [V.B], V.C AS [V.C], V.D
FROM U JOIN V ON U.A &lt; V.D
ORDER BY U.A, V.D;
-- U ⋈ A&lt;D AND U.B≠V.B V
SELECT U.A, U.B AS [U.B], U.C AS [U.C], V.B AS [V.B], V.C AS [V.C], V.D
FROM U JOIN V ON U.A &lt; V.D AND U.B &lt;&gt; V.B;</code></pre>
<div class="out">(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>U.B</th><th>U.C</th><th>V.B</th><th>V.C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td><td>2</td><td>3</td><td>4</td></tr>
<tr><td>1</td><td>2</td><td>3</td><td>2</td><td>3</td><td>5</td></tr>
<tr><td>1</td><td>2</td><td>3</td><td>7</td><td>8</td><td>10</td></tr>
<tr><td>6</td><td>7</td><td>8</td><td>7</td><td>8</td><td>10</td></tr>
<tr><td>9</td><td>7</td><td>8</td><td>7</td><td>8</td><td>10</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>U.B</th><th>U.C</th><th>V.B</th><th>V.C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td><td>7</td><td>8</td><td>10</td></tr>
</tbody>
</table>
<p>Vì sao 5: A = 1 nhỏ hơn mọi D (4, 5, 10) → 3 cặp; A = 6 và A = 9 chỉ nhỏ hơn D = 10 → mỗi cái 1 cặp. Thêm điều kiện U.B ≠ V.B (viết <code>&lt;&gt;</code> trong SQL) thì chỉ còn (1, 2, 3) với (7, 8, 10). θ ("theta") đại diện cho một phép so sánh bất kỳ: =, &lt;, &gt;, ≠, ≤, ≥, ghép bằng AND.</p>
<p>Định nghĩa "R ⋈<sub>C</sub> S = σ<sub>C</sub>(R × S)" kiểm được trực tiếp — đếm tích, rồi đếm sau khi lọc:</p>
<pre><code class="language-sql">CREATE TABLE U (A INT, B INT, C INT);
CREATE TABLE V (B INT, C INT, D INT);
INSERT INTO U VALUES (1, 2, 3), (6, 7, 8), (9, 7, 8);
INSERT INTO V VALUES (2, 3, 4), (2, 3, 5), (7, 8, 10);
-- tích trước, chọn sau
SELECT COUNT(*) AS rows_in_product FROM U CROSS JOIN V;
SELECT COUNT(*) AS rows_after_selection
FROM U CROSS JOIN V
WHERE U.A &lt; V.D;</code></pre>
<div class="out">(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>rows_in_product</th></tr></thead>
<tbody>
<tr><td>9</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>rows_after_selection</th></tr></thead>
<tbody>
<tr><td>5</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>θ-join = tích + WHERE.</strong> <code>FROM U JOIN V ON đk</code> và <code>FROM U CROSS JOIN V WHERE đk</code> cho cùng các dòng; nên viết dạng JOIN … ON vì điều kiện đứng ngay cạnh hai bảng mà nó nối.</p>`],
      [19, 'Natural join',
        `<p class="y-chinh">🎯 The natural join R ⋈ S pairs the tuples that are equal on <strong>all</strong> attributes the two relations have in common (here only B), and keeps that common attribute once: 2 rows, schema (A, B, C, D).</p>
<p>Same R and S as slide 17. Of the 6 pairs of R × S, only two have R.B = S.B: (1, 2) with (2, 5, 6) and (3, 4) with (4, 7, 8). The S row (9, 10, 11) has no partner and disappears — a <em>dangling tuple</em> (lesson 2.D brings it back with outer joins).</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);
CREATE TABLE S (B INT, C INT, D INT);
INSERT INTO R VALUES (1, 2), (3, 4);
INSERT INTO S VALUES (2, 5, 6), (4, 7, 8), (9, 10, 11);
-- R ⋈ S: equal on the common attribute B, and B is shown ONCE
SELECT R.A, R.B, S.C, S.D
FROM R JOIN S ON R.B = S.B;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>3</td><td>4</td><td>7</td><td>8</td></tr>
</tbody>
</table>
<p>SQL Server has no NATURAL JOIN keyword, so the common attribute is written in the ON condition, and the SELECT list shows B only once — that is how a natural join differs from the θ-join R ⋈<sub>R.B=S.B</sub> S, which would keep both R.B and S.B.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> (what you will type at work) the natural join has its own keyword, and <code>USING (b)</code> is the same thing with the common column named explicitly:
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT);
CREATE TABLE s (b INT, c INT, d INT);
INSERT INTO r VALUES (1, 2), (3, 4);
INSERT INTO s VALUES (2, 5, 6), (4, 7, 8), (9, 10, 11);
SELECT * FROM r NATURAL JOIN s;       -- R ⋈ S in one keyword
SELECT * FROM r JOIN s USING (b);     -- same result, common column named</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 3</div>
<table>
<thead><tr><th>b</th><th>a</th><th>c</th><th>d</th></tr></thead>
<tbody>
<tr><td>2</td><td>1</td><td>5</td><td>6</td></tr>
<tr><td>4</td><td>3</td><td>7</td><td>8</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>b</th><th>a</th><th>c</th><th>d</th></tr></thead>
<tbody>
<tr><td>2</td><td>1</td><td>5</td><td>6</td></tr>
<tr><td>4</td><td>3</td><td>7</td><td>8</td></tr>
</tbody>
</table>
PostgreSQL puts the common column first. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-1-inner-join">PostgreSQL 5.1 — INNER JOIN</a>.</div>
<div class="pitfall">NATURAL JOIN matches <em>every</em> column with the same name. If both tables also had a column <code>name</code> or <code>created_at</code>, it would silently match on those too and lose rows. At work prefer <code>JOIN … USING (…)</code> or <code>ON</code>, where you can see the condition.</div>`,
        `<p class="y-chinh">🎯 Phép nối tự nhiên (natural join) R ⋈ S ghép các bộ bằng nhau trên <strong>mọi</strong> thuộc tính chung của hai quan hệ (ở đây chỉ có B), và giữ thuộc tính chung đó một lần: 2 dòng, lược đồ (A, B, C, D).</p>
<p>Cùng R và S như slide 17. Trong 6 cặp của R × S, chỉ hai cặp có R.B = S.B: (1, 2) với (2, 5, 6) và (3, 4) với (4, 7, 8). Dòng (9, 10, 11) của S không có bạn ghép nên biến mất — gọi là <em>bộ treo (dangling tuple)</em> (bài 2.D đưa nó trở lại bằng phép nối ngoài).</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);
CREATE TABLE S (B INT, C INT, D INT);
INSERT INTO R VALUES (1, 2), (3, 4);
INSERT INTO S VALUES (2, 5, 6), (4, 7, 8), (9, 10, 11);
-- bằng nhau trên thuộc tính chung B, và B chỉ hiện MỘT lần
SELECT R.A, R.B, S.C, S.D
FROM R JOIN S ON R.B = S.B;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>3</td><td>4</td><td>7</td><td>8</td></tr>
</tbody>
</table>
<p>SQL Server không có từ khoá NATURAL JOIN, nên thuộc tính chung được viết trong điều kiện ON, và danh sách SELECT chỉ hiện B một lần — đó là chỗ nối tự nhiên khác θ-join R ⋈<sub>R.B=S.B</sub> S, vốn giữ cả R.B lẫn S.B.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> (thứ bạn sẽ gõ khi đi làm) phép nối tự nhiên có từ khoá riêng, còn <code>USING (b)</code> là cùng thứ đó nhưng gọi tên cột chung ra:
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT);
CREATE TABLE s (b INT, c INT, d INT);
INSERT INTO r VALUES (1, 2), (3, 4);
INSERT INTO s VALUES (2, 5, 6), (4, 7, 8), (9, 10, 11);
SELECT * FROM r NATURAL JOIN s;       -- R ⋈ S bằng một từ khoá
SELECT * FROM r JOIN s USING (b);     -- cùng kết quả, gọi tên cột chung</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 3</div>
<table>
<thead><tr><th>b</th><th>a</th><th>c</th><th>d</th></tr></thead>
<tbody>
<tr><td>2</td><td>1</td><td>5</td><td>6</td></tr>
<tr><td>4</td><td>3</td><td>7</td><td>8</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>b</th><th>a</th><th>c</th><th>d</th></tr></thead>
<tbody>
<tr><td>2</td><td>1</td><td>5</td><td>6</td></tr>
<tr><td>4</td><td>3</td><td>7</td><td>8</td></tr>
</tbody>
</table>
PostgreSQL đưa cột chung lên đầu. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-1-inner-join">PostgreSQL 5.1 — INNER JOIN</a>.</div>
<div class="pitfall">NATURAL JOIN khớp <em>mọi</em> cột trùng tên. Nếu hai bảng còn cùng có cột <code>name</code> hay <code>created_at</code>, nó âm thầm khớp cả theo những cột đó và làm mất dòng. Đi làm nên dùng <code>JOIN … USING (…)</code> hoặc <code>ON</code>, nơi bạn nhìn thấy điều kiện.</div>`],
      [20, 'Rename ρ',
        `<p class="y-chinh">🎯 ρ<sub>S(A1,…,An)</sub>(R) gives R a new name S and new attribute names A1,…,An — same tuples, new schema. R × ρ<sub>S(X,C,D)</sub>(S) renames S.B to X, so the product has five distinct names A, B, X, C, D.</p>
<p>Why rename? Without it, R × S has two columns called B (slide 17) and we had to write R.B and S.B. After renaming, every attribute name is unique and the result is a proper relation. The simplified notation on the slide, S := R(A1,…,An), means the same.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);
CREATE TABLE S (B INT, C INT, D INT);
INSERT INTO R VALUES (1, 2), (3, 4);
INSERT INTO S VALUES (2, 5, 6), (4, 7, 8), (9, 10, 11);
-- R × ρ S(X,C,D) (S): S2 is S with its columns renamed X, C, D
SELECT *
FROM R CROSS JOIN (SELECT * FROM S) AS S2(X, C, D)
ORDER BY A, X;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>X</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>7</td><td>8</td></tr>
<tr><td>1</td><td>2</td><td>9</td><td>10</td><td>11</td></tr>
<tr><td>3</td><td>4</td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>3</td><td>4</td><td>4</td><td>7</td><td>8</td></tr>
<tr><td>3</td><td>4</td><td>9</td><td>10</td><td>11</td></tr>
</tbody>
</table>
<p>In SQL Server the rename is an <strong>alias</strong>: <code>(SELECT * FROM S) AS S2(X, C, D)</code> — the inner query is S, <code>AS S2</code> renames the relation, and <code>(X, C, D)</code> renames its columns in order. SQL Server accepts a column list only after a sub-query, hence the <code>SELECT *</code> wrapper. The six rows match the slide exactly.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a column list can follow a table name directly — this is ρ written almost literally:
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT);
CREATE TABLE s (b INT, c INT, d INT);
INSERT INTO r VALUES (1, 2), (3, 4);
INSERT INTO s VALUES (2, 5, 6), (4, 7, 8), (9, 10, 11);
-- PostgreSQL renames the columns of a TABLE directly
SELECT *
FROM r CROSS JOIN s AS s2(x, c, d)
ORDER BY a, x;</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 3</div>
<table>
<thead><tr><th>a</th><th>b</th><th>x</th><th>c</th><th>d</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>7</td><td>8</td></tr>
<tr><td>1</td><td>2</td><td>9</td><td>10</td><td>11</td></tr>
<tr><td>3</td><td>4</td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>3</td><td>4</td><td>4</td><td>7</td><td>8</td></tr>
<tr><td>3</td><td>4</td><td>9</td><td>10</td><td>11</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-3-multi-self-join">PostgreSQL 5.3 — multi-table and self joins</a> (aliases are what make a self join possible).</div>
<p class="meo">🧠 The everyday use of ρ is the <strong>self join</strong>: to compare two students of the same table you need two names for it — <code>Student AS S1</code>, <code>Student AS S2</code> (practice exercise 5).</p>`,
        `<p class="y-chinh">🎯 ρ<sub>S(A1,…,An)</sub>(R) đặt cho R tên mới S và tên thuộc tính mới A1,…,An — cùng các bộ, lược đồ mới. R × ρ<sub>S(X,C,D)</sub>(S) đổi S.B thành X, nên tích có năm tên phân biệt A, B, X, C, D.</p>
<p>Vì sao phải đổi tên? Không đổi thì R × S có hai cột tên B (slide 17) và ta phải viết R.B, S.B. Đổi tên xong, mọi tên thuộc tính đều duy nhất và kết quả là một quan hệ đúng nghĩa. Cách viết gọn trên slide, S := R(A1,…,An), có cùng nghĩa.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);
CREATE TABLE S (B INT, C INT, D INT);
INSERT INTO R VALUES (1, 2), (3, 4);
INSERT INTO S VALUES (2, 5, 6), (4, 7, 8), (9, 10, 11);
-- S2 là S với các cột đổi tên thành X, C, D
SELECT *
FROM R CROSS JOIN (SELECT * FROM S) AS S2(X, C, D)
ORDER BY A, X;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>X</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>7</td><td>8</td></tr>
<tr><td>1</td><td>2</td><td>9</td><td>10</td><td>11</td></tr>
<tr><td>3</td><td>4</td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>3</td><td>4</td><td>4</td><td>7</td><td>8</td></tr>
<tr><td>3</td><td>4</td><td>9</td><td>10</td><td>11</td></tr>
</tbody>
</table>
<p>Trong SQL Server phép đổi tên là một <strong>bí danh (alias)</strong>: <code>(SELECT * FROM S) AS S2(X, C, D)</code> — câu bên trong chính là S, <code>AS S2</code> đổi tên quan hệ, <code>(X, C, D)</code> đổi tên các cột theo thứ tự. SQL Server chỉ nhận danh sách tên cột sau một truy vấn con, nên mới phải bọc <code>SELECT *</code>. Sáu dòng khớp đúng slide.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> danh sách tên cột đặt được ngay sau tên bảng — đây là ρ viết gần như nguyên văn:
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT);
CREATE TABLE s (b INT, c INT, d INT);
INSERT INTO r VALUES (1, 2), (3, 4);
INSERT INTO s VALUES (2, 5, 6), (4, 7, 8), (9, 10, 11);
-- PostgreSQL đổi tên cột của BẢNG trực tiếp
SELECT *
FROM r CROSS JOIN s AS s2(x, c, d)
ORDER BY a, x;</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 3</div>
<table>
<thead><tr><th>a</th><th>b</th><th>x</th><th>c</th><th>d</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>7</td><td>8</td></tr>
<tr><td>1</td><td>2</td><td>9</td><td>10</td><td>11</td></tr>
<tr><td>3</td><td>4</td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>3</td><td>4</td><td>4</td><td>7</td><td>8</td></tr>
<tr><td>3</td><td>4</td><td>9</td><td>10</td><td>11</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-3-multi-self-join">PostgreSQL 5.3 — nối nhiều bảng và tự nối</a> (bí danh là thứ làm tự nối khả thi).</div>
<p class="meo">🧠 Công dụng đời thường của ρ là <strong>tự nối (self join)</strong>: muốn so hai sinh viên trong cùng một bảng thì cần hai cái tên cho bảng đó — <code>Student AS S1</code>, <code>Student AS S2</code> (bài thực hành 5).</p>`],
      [21, 'Relational Expression',
        `<p class="y-chinh">🎯 Operators can be applied to the results of other operators, forming relational expressions; an expression can be drawn as an expression tree.</p>
<ul>
<li>Leaves of the tree = the stored relations (Movies, StarsIn …).</li>
<li>Inner nodes = operators; each node takes its children's results as input.</li>
<li>The root = the final answer. Evaluate bottom-up, like (x + 3) × 2: the bracket first.</li>
</ul>
<p>In SQL the same nesting appears as sub-queries — <code>SELECT … FROM (SELECT … ) AS T</code> — or, more often, as one SELECT whose clauses correspond to operators: FROM/JOIN = × and ⋈, WHERE = σ, the SELECT list = π. Slides 23–24 build one tree step by step.</p>`,
        `<p class="y-chinh">🎯 Có thể áp một phép lên kết quả của phép khác, tạo thành biểu thức quan hệ (relational expression); một biểu thức vẽ được thành cây biểu thức (expression tree).</p>
<ul>
<li>Lá của cây = các quan hệ được lưu (Movies, StarsIn …).</li>
<li>Nút trong = các phép toán; mỗi nút nhận kết quả của các nút con làm đầu vào.</li>
<li>Gốc = đáp án cuối cùng. Tính từ dưới lên, như (x + 3) × 2: tính ngoặc trước.</li>
</ul>
<p>Trong SQL cùng kiểu lồng nhau đó xuất hiện dưới dạng truy vấn con — <code>SELECT … FROM (SELECT … ) AS T</code> — hoặc thường gặp hơn là một câu SELECT mà mỗi mệnh đề ứng với một phép: FROM/JOIN = × và ⋈, WHERE = σ, danh sách SELECT = π. Slide 23–24 dựng một cây từng bước.</p>`],
      [22, 'The role of relational algebra in a DBMS',
        `<p class="y-chinh">🎯 Inside a DBMS, an SQL query is parsed into a relational-algebra expression, the query optimizer turns that into a query execution plan, and a code generator turns the plan into executable code.</p>
<div class="lz-flow">
<div class="lz-step"><div class="lz-k">1</div><div class="lz-t">SQL Query</div><div class="lz-d">what you type</div></div>
<div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Relational Algebra Expression</div><div class="lz-d">made by the parser</div></div>
<div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Query Execution Plan</div><div class="lz-d">chosen by the query optimizer</div></div>
<div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Executable Code</div><div class="lz-d">made by the code generator</div></div>
</div>
<p>The optimizer uses algebra rules such as σ<sub>C1 AND C2</sub> = σ<sub>C1</sub>(σ<sub>C2</sub>) (slide 15) to rewrite the tree — for example, filter a table <em>before</em> joining it, so the join handles fewer rows. That is why two SQL queries written differently can run at the same speed. You will see real plans in web Chapter 8 (the "Execution plan" button in SQL Server, <code>EXPLAIN</code> in PostgreSQL).</p>`,
        `<p class="y-chinh">🎯 Bên trong một DBMS, câu truy vấn SQL được bộ phân tích cú pháp (parser) dịch thành biểu thức đại số quan hệ, bộ tối ưu truy vấn (query optimizer) biến nó thành kế hoạch thực thi (query execution plan), rồi bộ sinh mã (code generator) biến kế hoạch thành mã chạy được.</p>
<div class="lz-flow">
<div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Câu truy vấn SQL</div><div class="lz-d">thứ bạn gõ</div></div>
<div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Biểu thức đại số quan hệ</div><div class="lz-d">do parser tạo</div></div>
<div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Kế hoạch thực thi</div><div class="lz-d">do bộ tối ưu chọn</div></div>
<div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Mã chạy được</div><div class="lz-d">do bộ sinh mã tạo</div></div>
</div>
<p>Bộ tối ưu dùng các luật đại số như σ<sub>C1 AND C2</sub> = σ<sub>C1</sub>(σ<sub>C2</sub>) (slide 15) để viết lại cây — ví dụ lọc một bảng <em>trước</em> khi nối, để phép nối phải xử lý ít dòng hơn. Vì vậy hai câu SQL viết khác nhau có thể chạy nhanh như nhau. Bạn sẽ xem kế hoạch thật ở Chương 8 trên web (nút "Execution plan" trong SQL Server, lệnh <code>EXPLAIN</code> trong PostgreSQL).</p>`],
      [23, 'Relational Expression - the Fox example',
        `<p class="y-chinh">🎯 "Titles and years of movies made by Fox that are at least 100 minutes long" = (1) σ<sub>length≥100</sub>(Movies), (2) σ<sub>studioName='Fox'</sub>(Movies), (3) the intersection of (1) and (2), (4) project (3) onto title, year.</p>
<p>The slide gives the steps but no data, so here is a small <strong>illustrative</strong> Movies table (not from the slide) with one film in each situation — Fox and long, Fox and short, long but not Fox, neither:</p>
<pre><code class="language-sql">CREATE TABLE Movies (title VARCHAR(30), year INT, length INT, studioName VARCHAR(20));
INSERT INTO Movies VALUES ('Star Wars',          1977, 124, 'Fox'),
                          ('The Simpsons Movie', 2007,  87, 'Fox'),
                          ('Gone With the Wind', 1939, 231, 'MGM'),
                          ('Wayne''s World',     1992,  95, 'Paramount'),
                          ('Galaxy Quest',       1999, 102, 'DreamWorks');</code></pre>
<p>Each step as SQL, then the four results in order (1), (2), (3), (4):</p>
<pre><code class="language-sql">-- (1) σ length&gt;=100 (Movies)
SELECT * FROM Movies WHERE length &gt;= 100;</code></pre>
<pre><code class="language-sql">-- (2) σ studioName='Fox' (Movies)
SELECT * FROM Movies WHERE studioName = 'Fox';</code></pre>
<pre><code class="language-sql">-- (3) = (1) ∩ (2)
SELECT * FROM Movies WHERE length &gt;= 100
INTERSECT
SELECT * FROM Movies WHERE studioName = 'Fox';</code></pre>
<pre><code class="language-sql">-- (4) π title,year ((3))
SELECT title, year
FROM (SELECT * FROM Movies WHERE length &gt;= 100
      INTERSECT
      SELECT * FROM Movies WHERE studioName = 'Fox') AS T;</code></pre>
<pre><code class="language-sql">-- the shorter equivalent expression: one σ with AND
SELECT title, year
FROM Movies
WHERE length &gt;= 100 AND studioName = 'Fox';</code></pre>
<div class="out">(5 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Fox</td></tr>
<tr><td>Gone With the Wind</td><td>1939</td><td>231</td><td>MGM</td></tr>
<tr><td>Galaxy Quest</td><td>1999</td><td>102</td><td>DreamWorks</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Fox</td></tr>
<tr><td>The Simpsons Movie</td><td>2007</td><td>87</td><td>Fox</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Fox</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td></tr>
</tbody>
</table>
<p>(1) keeps 3 long films, (2) keeps 2 Fox films, only Star Wars is in both, and π leaves (Star Wars, 1977). The fifth result is the one-σ version of slide 24 — same answer. The Simpsons Movie (Fox, 87 min) and Gone With the Wind (231 min, MGM) each pass one test only, which is exactly why the intersection is needed.</p>`,
        `<p class="y-chinh">🎯 "Tên và năm của các phim do Fox làm, dài ít nhất 100 phút" = (1) σ<sub>length≥100</sub>(Movies), (2) σ<sub>studioName='Fox'</sub>(Movies), (3) giao của (1) và (2), (4) chiếu (3) lên title, year.</p>
<p>Slide cho các bước nhưng không cho dữ liệu, nên đây là một bảng Movies nhỏ <strong>minh hoạ</strong> (không phải của slide) có mỗi tình huống một phim — Fox và dài, Fox và ngắn, dài mà không phải Fox, không thoả gì:</p>
<pre><code class="language-sql">CREATE TABLE Movies (title VARCHAR(30), year INT, length INT, studioName VARCHAR(20));
INSERT INTO Movies VALUES ('Star Wars',          1977, 124, 'Fox'),
                          ('The Simpsons Movie', 2007,  87, 'Fox'),
                          ('Gone With the Wind', 1939, 231, 'MGM'),
                          ('Wayne''s World',     1992,  95, 'Paramount'),
                          ('Galaxy Quest',       1999, 102, 'DreamWorks');</code></pre>
<p>Từng bước viết bằng SQL, rồi bốn kết quả theo đúng thứ tự (1), (2), (3), (4):</p>
<pre><code class="language-sql">-- (1) σ length&gt;=100 (Movies)
SELECT * FROM Movies WHERE length &gt;= 100;</code></pre>
<pre><code class="language-sql">-- (2) σ studioName='Fox' (Movies)
SELECT * FROM Movies WHERE studioName = 'Fox';</code></pre>
<pre><code class="language-sql">-- (3) = (1) ∩ (2)
SELECT * FROM Movies WHERE length &gt;= 100
INTERSECT
SELECT * FROM Movies WHERE studioName = 'Fox';</code></pre>
<pre><code class="language-sql">-- (4) π title,year ((3))
SELECT title, year
FROM (SELECT * FROM Movies WHERE length &gt;= 100
      INTERSECT
      SELECT * FROM Movies WHERE studioName = 'Fox') AS T;</code></pre>
<pre><code class="language-sql">-- biểu thức tương đương ngắn hơn: một σ với AND
SELECT title, year
FROM Movies
WHERE length &gt;= 100 AND studioName = 'Fox';</code></pre>
<div class="out">(5 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Fox</td></tr>
<tr><td>Gone With the Wind</td><td>1939</td><td>231</td><td>MGM</td></tr>
<tr><td>Galaxy Quest</td><td>1999</td><td>102</td><td>DreamWorks</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Fox</td></tr>
<tr><td>The Simpsons Movie</td><td>2007</td><td>87</td><td>Fox</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Fox</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td></tr>
</tbody>
</table>
<p>(1) giữ 3 phim dài, (2) giữ 2 phim của Fox, chỉ Star Wars có ở cả hai, và π để lại (Star Wars, 1977). Kết quả thứ năm là bản một σ của slide 24 — cùng đáp án. The Simpsons Movie (Fox, 87 phút) và Gone With the Wind (231 phút, MGM) mỗi phim chỉ qua được một điều kiện, đó chính là lý do cần phép giao.</p>`],
      [24, 'Relational Expression - expression tree',
        `<p class="y-chinh">🎯 Figure 2.18 draws π<sub>title,year</sub>(σ<sub>length≥100</sub>(Movies) ∩ σ<sub>studioName='Fox'</sub>(Movies)) as a tree, and shows the equivalent shorter expression π<sub>title,year</sub>(σ<sub>length≥100 AND studioName='Fox'</sub>(Movies)).</p>
<pre><code class="language-plaintext">            π title,year                 ← root: the answer
                 |
                 ∩
          /             \\
σ length&gt;=100      σ studioName='Fox'
       |                   |
    Movies              Movies           ← leaves: stored relation</code></pre>
<p>Read bottom-up: each σ reads Movies, ∩ combines their results, π at the top trims the columns. The second expression replaces "two σ + ∩" with "one σ with AND" — correct because both σ read the <em>same</em> relation (σ<sub>C1</sub>(R) ∩ σ<sub>C2</sub>(R) = σ<sub>C1 AND C2</sub>(R)). The SQL of both forms ran on slide 23 and gave the same row.</p>
<div class="pitfall">The same trick does <strong>not</strong> work across rows: "students who take DBI202 <em>and</em> CSD201" is ∩ of two σ over Enroll, but σ<sub>cid='DBI202' AND cid='CSD201'</sub>(Enroll) is empty — no single row has two course codes (practice exercise 3).</div>`,
        `<p class="y-chinh">🎯 Hình 2.18 vẽ π<sub>title,year</sub>(σ<sub>length≥100</sub>(Movies) ∩ σ<sub>studioName='Fox'</sub>(Movies)) thành một cây, và cho biểu thức tương đương ngắn hơn π<sub>title,year</sub>(σ<sub>length≥100 AND studioName='Fox'</sub>(Movies)).</p>
<pre><code class="language-plaintext">            π title,year                 ← gốc: đáp án
                 |
                 ∩
          /             \\
σ length&gt;=100      σ studioName='Fox'
       |                   |
    Movies              Movies           ← lá: quan hệ được lưu</code></pre>
<p>Đọc từ dưới lên: mỗi σ đọc Movies, ∩ gộp hai kết quả, π trên cùng cắt bớt cột. Biểu thức thứ hai thay "hai σ + ∩" bằng "một σ với AND" — đúng vì cả hai σ đọc <em>cùng một</em> quan hệ (σ<sub>C1</sub>(R) ∩ σ<sub>C2</sub>(R) = σ<sub>C1 AND C2</sub>(R)). SQL của cả hai dạng đã chạy ở slide 23 và cho cùng một dòng.</p>
<div class="pitfall">Mẹo này <strong>không</strong> dùng được khi điều kiện nằm trên các dòng khác nhau: "sinh viên học DBI202 <em>và</em> CSD201" là ∩ của hai σ trên Enroll, còn σ<sub>cid='DBI202' AND cid='CSD201'</sub>(Enroll) thì rỗng — không dòng nào có hai mã môn (bài thực hành 3).</div>`],
      [25, 'Exercise - PC, Laptop, Printer',
        `<p class="y-chinh">🎯 The exercise: on Product(maker, model, type), PC(model, speed, ram, hd, price), Laptop(model, speed, ram, hd, screen, price), Printer(model, color, type, price), write algebra for five questions (a)–(e).</p>
<p>The slide gives only the schemas. To run the answers we use a sample dataset made up for this lesson in the style of the textbook exercise (Ullman, Exercise 2.4.1). It is NOT the book’s own data, so the book’s printed answers will differ — practise the method, then check against the book: 30 products from makers A–H, 13 PCs, 10 laptops, 7 printers; <code>color</code> is a BIT (1 = colour).</p>
<pre><code class="language-sql">CREATE TABLE Product (maker CHAR(1), model INT, type VARCHAR(10));
CREATE TABLE PC (model INT, speed DECIMAL(4,2), ram INT, hd INT, price INT);
CREATE TABLE Laptop (model INT, speed DECIMAL(4,2), ram INT, hd INT, screen DECIMAL(4,1), price INT);
CREATE TABLE Printer (model INT, color BIT, type VARCHAR(10), price INT);</code></pre>
<table>
<thead><tr><th>Question</th><th>Relational algebra</th></tr></thead>
<tbody>
<tr><td>a) PC models with speed ≥ 3.00</td><td>π<sub>model</sub>(σ<sub>speed≥3.00</sub>(PC))</td></tr>
<tr><td>b) makers of laptops with hd ≥ 100 GB</td><td>π<sub>maker</sub>(Product ⋈ σ<sub>hd≥100</sub>(Laptop))</td></tr>
<tr><td>c) model and price of every product of maker B</td><td>π<sub>model,price</sub>(σ<sub>maker='B'</sub>(Product) ⋈ PC) ∪ (same with Laptop) ∪ (same with Printer)</td></tr>
<tr><td>d) models of colour laser printers</td><td>π<sub>model</sub>(σ<sub>color=true AND type='laser'</sub>(Printer))</td></tr>
<tr><td>e) makers that sell laptops but not PCs</td><td>π<sub>maker</sub>(σ<sub>type='laptop'</sub>(Product)) − π<sub>maker</sub>(σ<sub>type='pc'</sub>(Product))</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- a) π model (σ speed &gt;= 3.00 (PC))
SELECT model FROM PC WHERE speed &gt;= 3.00;</code></pre>
<pre><code class="language-sql">-- b) π maker (Product ⋈ σ hd &gt;= 100 (Laptop))
SELECT DISTINCT P.maker
FROM Product AS P JOIN Laptop AS L ON P.model = L.model
WHERE L.hd &gt;= 100;</code></pre>
<pre><code class="language-sql">-- c) π model,price (σ maker='B' (Product) ⋈ PC) ∪ (… ⋈ Laptop) ∪ (… ⋈ Printer)
SELECT PC.model, PC.price FROM Product AS P JOIN PC ON P.model = PC.model WHERE P.maker = 'B'
UNION
SELECT L.model, L.price FROM Product AS P JOIN Laptop AS L ON P.model = L.model WHERE P.maker = 'B'
UNION
SELECT R.model, R.price FROM Product AS P JOIN Printer AS R ON P.model = R.model WHERE P.maker = 'B';</code></pre>
<pre><code class="language-sql">-- d) π model (σ color = true AND type = 'laser' (Printer))
SELECT model FROM Printer WHERE color = 1 AND type = 'laser';</code></pre>
<pre><code class="language-sql">-- e) π maker (σ type='laptop' (Product)) − π maker (σ type='pc' (Product))
SELECT maker FROM Product WHERE type = 'laptop'
EXCEPT
SELECT maker FROM Product WHERE type = 'pc';</code></pre>
<div class="out">(30 rows affected)<br>
(13 rows affected)<br>
(10 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>model</th></tr></thead>
<tbody>
<tr><td>1005</td></tr>
<tr><td>1006</td></tr>
<tr><td>1013</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>maker</th></tr></thead>
<tbody>
<tr><td>A</td></tr>
<tr><td>B</td></tr>
<tr><td>E</td></tr>
<tr><td>F</td></tr>
<tr><td>G</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>model</th><th>price</th></tr></thead>
<tbody>
<tr><td>1004</td><td>649</td></tr>
<tr><td>1005</td><td>630</td></tr>
<tr><td>1006</td><td>1049</td></tr>
<tr><td>2007</td><td>1429</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>model</th></tr></thead>
<tbody>
<tr><td>3003</td></tr>
<tr><td>3007</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>maker</th></tr></thead>
<tbody>
<tr><td>F</td></tr>
<tr><td>G</td></tr>
</tbody>
</table>
<p class="dap-an">✅ (a) 1005, 1006, 1013. (b) A, B, E, F, G — <code>DISTINCT</code> is π on a set: several laptops of the same maker would otherwise repeat the maker. (c) 1004, 1005, 1006 (PCs) and 2007 (laptop); B makes no printer. In (c) the natural join Product ⋈ PC is on model — the only common attribute that matters; beware that Product and Printer <em>both</em> have an attribute called type, so a real natural join Product ⋈ Printer would also demand Product.type = Printer.type ('printer' = 'laser'?) and return nothing — that is why the SQL names the condition <code>P.model = R.model</code>. (d) 3003, 3007. (e) F and G: A, B and E make laptops but also PCs.</p>`,
        `<p class="y-chinh">🎯 Bài tập: trên Product(maker, model, type), PC(model, speed, ram, hd, price), Laptop(model, speed, ram, hd, screen, price), Printer(model, color, type, price), viết đại số cho năm câu hỏi (a)–(e).</p>
<p>Slide chỉ cho lược đồ. Để chạy được lời giải, bài dùng một bộ dữ liệu mẫu TỰ ĐẶT theo kiểu bài tập của sách (Ullman, Exercise 2.4.1). Đây KHÔNG phải dữ liệu in trong sách, nên đáp số trong sách sẽ khác — hãy luyện cách làm, rồi đối chiếu với sách: 30 sản phẩm của các nhà sản xuất A–H, 13 PC, 10 laptop, 7 máy in; <code>color</code> kiểu BIT (1 = in màu).</p>
<pre><code class="language-sql">CREATE TABLE Product (maker CHAR(1), model INT, type VARCHAR(10));
CREATE TABLE PC (model INT, speed DECIMAL(4,2), ram INT, hd INT, price INT);
CREATE TABLE Laptop (model INT, speed DECIMAL(4,2), ram INT, hd INT, screen DECIMAL(4,1), price INT);
CREATE TABLE Printer (model INT, color BIT, type VARCHAR(10), price INT);</code></pre>
<table>
<thead><tr><th>Câu hỏi</th><th>Đại số quan hệ</th></tr></thead>
<tbody>
<tr><td>a) các model PC có tốc độ ≥ 3.00</td><td>π<sub>model</sub>(σ<sub>speed≥3.00</sub>(PC))</td></tr>
<tr><td>b) các hãng làm laptop có ổ cứng ≥ 100 GB</td><td>π<sub>maker</sub>(Product ⋈ σ<sub>hd≥100</sub>(Laptop))</td></tr>
<tr><td>c) model và giá của mọi sản phẩm của hãng B</td><td>π<sub>model,price</sub>(σ<sub>maker='B'</sub>(Product) ⋈ PC) ∪ (tương tự với Laptop) ∪ (tương tự với Printer)</td></tr>
<tr><td>d) model của các máy in laser màu</td><td>π<sub>model</sub>(σ<sub>color=true AND type='laser'</sub>(Printer))</td></tr>
<tr><td>e) các hãng bán laptop nhưng không bán PC</td><td>π<sub>maker</sub>(σ<sub>type='laptop'</sub>(Product)) − π<sub>maker</sub>(σ<sub>type='pc'</sub>(Product))</td></tr>
</tbody>
</table>
<pre><code class="language-sql">-- a) π model (σ speed &gt;= 3.00 (PC))
SELECT model FROM PC WHERE speed &gt;= 3.00;</code></pre>
<pre><code class="language-sql">-- b) π maker (Product ⋈ σ hd &gt;= 100 (Laptop))
SELECT DISTINCT P.maker
FROM Product AS P JOIN Laptop AS L ON P.model = L.model
WHERE L.hd &gt;= 100;</code></pre>
<pre><code class="language-sql">-- c) π model,price (σ maker='B' (Product) ⋈ PC) ∪ (… ⋈ Laptop) ∪ (… ⋈ Printer)
SELECT PC.model, PC.price FROM Product AS P JOIN PC ON P.model = PC.model WHERE P.maker = 'B'
UNION
SELECT L.model, L.price FROM Product AS P JOIN Laptop AS L ON P.model = L.model WHERE P.maker = 'B'
UNION
SELECT R.model, R.price FROM Product AS P JOIN Printer AS R ON P.model = R.model WHERE P.maker = 'B';</code></pre>
<pre><code class="language-sql">-- d) π model (σ color = true AND type = 'laser' (Printer))
SELECT model FROM Printer WHERE color = 1 AND type = 'laser';</code></pre>
<pre><code class="language-sql">-- e) π maker (σ type='laptop' (Product)) − π maker (σ type='pc' (Product))
SELECT maker FROM Product WHERE type = 'laptop'
EXCEPT
SELECT maker FROM Product WHERE type = 'pc';</code></pre>
<div class="out">(30 rows affected)<br>
(13 rows affected)<br>
(10 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>model</th></tr></thead>
<tbody>
<tr><td>1005</td></tr>
<tr><td>1006</td></tr>
<tr><td>1013</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>maker</th></tr></thead>
<tbody>
<tr><td>A</td></tr>
<tr><td>B</td></tr>
<tr><td>E</td></tr>
<tr><td>F</td></tr>
<tr><td>G</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>model</th><th>price</th></tr></thead>
<tbody>
<tr><td>1004</td><td>649</td></tr>
<tr><td>1005</td><td>630</td></tr>
<tr><td>1006</td><td>1049</td></tr>
<tr><td>2007</td><td>1429</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>model</th></tr></thead>
<tbody>
<tr><td>3003</td></tr>
<tr><td>3007</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>maker</th></tr></thead>
<tbody>
<tr><td>F</td></tr>
<tr><td>G</td></tr>
</tbody>
</table>
<p class="dap-an">✅ (a) 1005, 1006, 1013. (b) A, B, E, F, G — <code>DISTINCT</code> chính là π trên tập: không có nó thì hãng có nhiều laptop sẽ bị lặp. (c) 1004, 1005, 1006 (PC) và 2007 (laptop); B không làm máy in. Ở (c) phép nối tự nhiên Product ⋈ PC là theo model — thuộc tính chung duy nhất có ý nghĩa; coi chừng Product và Printer <em>cùng</em> có thuộc tính tên type, nên một phép nối tự nhiên thật Product ⋈ Printer sẽ đòi thêm Product.type = Printer.type ('printer' = 'laser'?) và trả về rỗng — vì vậy câu SQL ghi rõ điều kiện <code>P.model = R.model</code>. (d) 3003, 3007. (e) F và G: A, B và E làm laptop nhưng cũng làm PC.</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>R has 4 rows, S has 5 rows. How many rows does R × S have? And R ∪ S at most?</li>
<li>Which SQL gives exactly π<sub>genre</sub>(Movies)?</li>
<li>Write σ<sub>C1</sub>(σ<sub>C2</sub>(R)) with a single σ.</li>
<li>R(A, B) and S(B, C): what are the attributes of R ⋈ S, and of R × S?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) 4 × 5 = 20; at most 4 + 5 = 9 (fewer if rows are shared, and only if R, S are type compatible). (2) <code>SELECT DISTINCT genre FROM Movies</code> — without DISTINCT you get a bag. (3) σ<sub>C1 AND C2</sub>(R). (4) R ⋈ S: (A, B, C), B once; R × S: (A, R.B, S.B, C).</p>
<p><strong>Next:</strong> lesson 2.C — the same operators when duplicates are allowed (bags), which is how SQL really works.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>R có 4 dòng, S có 5 dòng. R × S có bao nhiêu dòng? R ∪ S tối đa bao nhiêu dòng?</li>
<li>Câu SQL nào cho đúng π<sub>genre</sub>(Movies)?</li>
<li>Viết σ<sub>C1</sub>(σ<sub>C2</sub>(R)) bằng một σ duy nhất.</li>
<li>R(A, B) và S(B, C): R ⋈ S có những thuộc tính nào, còn R × S?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) 4 × 5 = 20; tối đa 4 + 5 = 9 (ít hơn nếu có dòng chung, và chỉ khi R, S tương thích kiểu). (2) <code>SELECT DISTINCT genre FROM Movies</code> — thiếu DISTINCT thì ra một túi. (3) σ<sub>C1 AND C2</sub>(R). (4) R ⋈ S: (A, B, C), B một lần; R × S: (A, R.B, S.B, C).</p>
<p><strong>Tiếp theo:</strong> bài 2.C — cùng các phép đó khi cho phép dòng trùng (túi), đúng cách SQL thật sự chạy.</p>`),
    books([
      ['ullman', 'Ch.2 The Relational Model of Data — §2.4 An Algebraic Query Language (set operations, selection, projection, product, natural and theta joins, combining operations, renaming) · Exercise 2.4.1 (the PC/Laptop/Printer database)', 'Chương 2 The Relational Model of Data — §2.4 An Algebraic Query Language (phép tập hợp, chọn, chiếu, tích, nối tự nhiên và theta, kết hợp phép, đổi tên) · Exercise 2.4.1 (CSDL PC/Laptop/Printer)'],
      ['ramakrishnan', 'Ch.4 Relational Algebra and Calculus — §4.2 Relational Algebra (selection and projection, set operations, renaming, joins)', 'Chương 4 Relational Algebra and Calculus — §4.2 đại số quan hệ (chọn và chiếu, phép tập hợp, đổi tên, phép nối)'],
    ]),
  ].join('\n'),
};

/* ───────── 2.C — 📑 Slide by slide · Relations as bags: ∪ ∩ − π σ × ⋈ with duplicates (Chapter 5, slides 1–14) ───────── */
const L_dbi6_1 = {
  title: '2.C — 📑 Slide by slide · Relations as bags: ∪ ∩ − π σ × ⋈ with duplicates (Chapter 5, slides 1–14)|||2.C — 📑 Học theo từng slide · Quan hệ là túi: ∪ ∩ − π σ × ⋈ khi có dòng trùng (Chapter 5, slide 1–14)',
  slug: 'dbi202-slide-dbi6-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–14 của bộ slide Chapter 5 (tự học) của trường: vì sao DBMS thật coi quan hệ là túi (bag), hợp – giao – hiệu trên túi với luật n + m, MIN(n, m), MAX(0, n − m), phép chiếu, chọn, tích và nối trên túi — mỗi phép có bảng trước/sau và câu SQL chạy thật; nói rõ tập ↔ túi chính là SELECT DISTINCT ↔ SELECT, UNION ↔ UNION ALL, và INTERSECT ALL / EXCEPT ALL của PostgreSQL (SQL Server phải giả lập bằng ROW_NUMBER).',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.C · school slides "Chapter 5" (self-study), slides 1–14</span>
<h2>Relations as bags — the algebra that SQL really runs</h2>
<p class="lead">⚠️ <strong>This is the school's "Chapter 5" deck, marked "self-studying"</strong> — it is not taught in class, but it is in the syllabus and it shows up in PT/FE questions. It is placed here, in web Chapter 2, right after the set algebra of lessons 2.A–2.B, because it is the same algebra with one change: <strong>a relation may contain the same tuple several times</strong>. Such a collection is called a <strong>bag</strong> (or multiset). Slides 1–14 redo ∪ ∩ − π σ × ⋈ on bags; lesson 2.D adds the extended operators δ, γ, τ and outer joins.</p>
<div class="callout"><strong>The one idea of this lesson:</strong> set vs bag in algebra is exactly SELECT DISTINCT vs SELECT, and UNION vs UNION ALL, in SQL.
<table>
<thead><tr><th>Algebra on sets (lessons 2.A–2.B)</th><th>Algebra on bags (this lesson)</th><th>SQL</th></tr></thead>
<tbody>
<tr><td>π<sub>A</sub>(R) removes duplicates</td><td>π<sub>A</sub>(R) keeps them</td><td>SELECT DISTINCT A · SELECT A</td></tr>
<tr><td>R ∪ S: a tuple once</td><td>t appears n + m times</td><td>UNION · UNION ALL</td></tr>
<tr><td>R ∩ S: in both</td><td>t appears MIN(n, m) times</td><td>INTERSECT · INTERSECT ALL (PostgreSQL only)</td></tr>
<tr><td>R − S: in R, not in S</td><td>t appears MAX(0, n − m) times</td><td>EXCEPT · EXCEPT ALL (PostgreSQL only)</td></tr>
</tbody>
</table>
</div>
<div class="callout"><strong>After this lesson you can:</strong> say why real DBMSs use bags; compute bag ∪, ∩, − by counting copies; apply π, σ, ×, ⋈ to a bag without removing duplicates; predict how many rows an SQL query returns; and run bag ∩ and − on both PostgreSQL (INTERSECT ALL, EXCEPT ALL) and SQL Server (which has no ALL version — you will number the copies with ROW_NUMBER).</div>`,
    `<span class="eyebrow">Chương 2 · Bài 2.C · slide "Chapter 5" của trường (tự học), slide 1–14</span>
<h2>Quan hệ là túi — thứ đại số mà SQL thật sự chạy</h2>
<p class="lead">⚠️ <strong>Đây là bộ slide "Chapter 5" của trường, ghi là "self-studying" (tự học)</strong> — trên lớp không giảng, nhưng có trong syllabus và có mặt trong câu hỏi PT/FE. Nó được đặt ở đây, trong Chương 2 trên web, ngay sau đại số trên tập của bài 2.A–2.B, vì đây vẫn là thứ đại số đó với đúng một thay đổi: <strong>một quan hệ được phép chứa cùng một bộ nhiều lần</strong>. Một tập hợp như vậy gọi là <strong>túi (bag)</strong> (hay đa tập — multiset). Slide 1–14 làm lại ∪ ∩ − π σ × ⋈ trên túi; bài 2.D thêm các phép mở rộng δ, γ, τ và nối ngoài.</p>
<div class="callout"><strong>Ý duy nhất của bài này:</strong> tập hay túi trong đại số chính là SELECT DISTINCT hay SELECT, và UNION hay UNION ALL, trong SQL.
<table>
<thead><tr><th>Đại số trên tập (bài 2.A–2.B)</th><th>Đại số trên túi (bài này)</th><th>SQL</th></tr></thead>
<tbody>
<tr><td>π<sub>A</sub>(R) bỏ dòng trùng</td><td>π<sub>A</sub>(R) giữ dòng trùng</td><td>SELECT DISTINCT A · SELECT A</td></tr>
<tr><td>R ∪ S: mỗi bộ một lần</td><td>t xuất hiện n + m lần</td><td>UNION · UNION ALL</td></tr>
<tr><td>R ∩ S: có ở cả hai</td><td>t xuất hiện MIN(n, m) lần</td><td>INTERSECT · INTERSECT ALL (chỉ PostgreSQL)</td></tr>
<tr><td>R − S: có ở R, không có ở S</td><td>t xuất hiện MAX(0, n − m) lần</td><td>EXCEPT · EXCEPT ALL (chỉ PostgreSQL)</td></tr>
</tbody>
</table>
</div>
<div class="callout"><strong>Học xong bài này bạn làm được:</strong> nói vì sao DBMS thật dùng túi; tính ∪, ∩, − trên túi bằng cách đếm số bản; áp dụng π, σ, ×, ⋈ lên túi mà không bỏ dòng trùng; đoán trước một câu SQL trả về bao nhiêu dòng; và chạy ∩, − trên túi ở cả PostgreSQL (INTERSECT ALL, EXCEPT ALL) lẫn SQL Server (không có bản ALL — bạn sẽ đánh số các bản bằng ROW_NUMBER).</div>`),
    walkHead('dbi6', 1, 14),
    walk('dbi6', [
      [1, 'Chapter 5 Algebraic Query Language',
        `<p class="y-chinh">🎯 The title slide of the school's Chapter 5, "Algebraic Query Language" — the second half of relational algebra, the one that matches SQL.</p>
<p>In the textbook (Ullman, Chapter 5) this chapter follows the SQL-free algebra of Chapter 2. The school marks it "self-studying", so this lesson and the next are your class notes for it.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề của Chapter 5 của trường, "Algebraic Query Language" (ngôn ngữ truy vấn dạng đại số) — nửa sau của đại số quan hệ, nửa khớp với SQL.</p>
<p>Trong sách (Ullman, Chương 5) chương này đi sau phần đại số "chưa có SQL" của Chương 2. Trường ghi nó là "self-studying" (tự học), nên bài này và bài sau chính là vở ghi của bạn cho chương đó.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Three objectives: understand why we need bags (multisets), know the relational operations on bags, know the extended operations on bags.</p>
<ul>
<li>Why bags — slides 3–6 (this lesson).</li>
<li>Operations on bags: ∪ ∩ − (slides 7–8), π σ (9–10), × ⋈ (11–14).</li>
<li>Extended operations: δ, aggregation, γ, extended π, τ, outer joins (slides 15–30, lesson 2.D).</li>
</ul>`,
        `<p class="y-chinh">🎯 Ba mục tiêu: hiểu vì sao cần túi (bag — đa tập), biết các phép quan hệ trên túi, biết các phép mở rộng trên túi.</p>
<ul>
<li>Vì sao cần túi — slide 3–6 (bài này).</li>
<li>Các phép trên túi: ∪ ∩ − (slide 7–8), π σ (9–10), × ⋈ (11–14).</li>
<li>Các phép mở rộng: δ, phép gộp, γ, π mở rộng, τ, nối ngoài (slide 15–30, bài 2.D).</li>
</ul>`],
      [3, 'Relational Operations on Bags',
        `<p class="y-chinh">🎯 From now on a relation is a bag: the same tuple may appear more than once, so some operators need a new definition.</p>
<p>Everyday picture: a <strong>set</strong> is the list of drinks a café sells (each name once); a <strong>bag</strong> is the list of drinks it sold today (iced coffee appears every time someone buys one). Both are useful — but "how many iced coffees did we sell?" can only be answered from the bag.</p>
<p>σ and π keep their meaning (test a row, keep columns) but no longer remove duplicates; ∪, ∩, − get counting rules (slide 7). Which one you want is a choice, and SQL lets you make it: by default it keeps duplicates, DISTINCT removes them.</p>`,
        `<p class="y-chinh">🎯 Từ đây một quan hệ là một túi: cùng một bộ có thể xuất hiện nhiều lần, nên vài phép toán cần định nghĩa lại.</p>
<p>Hình ảnh đời thường: <strong>tập</strong> là danh sách đồ uống quán cà phê có bán (mỗi tên một lần); <strong>túi</strong> là danh sách đồ uống đã bán hôm nay (cà phê sữa đá xuất hiện mỗi lần có người mua). Cả hai đều có ích — nhưng câu "hôm nay bán được mấy ly cà phê sữa?" chỉ trả lời được từ cái túi.</p>
<p>σ và π giữ nguyên ý nghĩa (kiểm từng dòng, giữ cột) nhưng không còn bỏ dòng trùng; ∪, ∩, − có luật đếm riêng (slide 7). Muốn cái nào là một lựa chọn, và SQL cho bạn chọn: mặc định giữ dòng trùng, DISTINCT thì bỏ.</p>`],
      [4, 'Relational Operations on Bags - Example',
        `<p class="y-chinh">🎯 In the relation R(A, B) = {(1,2), (3,4), (1,2), (1,2)} the tuple (1, 2) appears 3 times: as a set we would keep it once; as a bag we keep all three, and, as for sets, the order of the tuples does not matter.</p>
<p>A table with no primary key is exactly such a bag — SQL Server stores the four rows as given:</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);          -- no PRIMARY KEY: the same row may be stored many times
INSERT INTO R VALUES (1, 2), (3, 4), (1, 2), (1, 2);
SELECT * FROM R;                        -- the bag: 4 rows
SELECT DISTINCT * FROM R;               -- the set: 2 rows
SELECT A, B, COUNT(*) AS times          -- how many times each tuple appears
FROM R
GROUP BY A, B;</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th><th>times</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td></tr>
<tr><td>3</td><td>4</td><td>1</td></tr>
</tbody>
</table>
<ul>
<li><code>SELECT * FROM R</code> — the bag: 4 rows, (1, 2) three times.</li>
<li><code>SELECT DISTINCT * FROM R</code> — the set view: 2 rows.</li>
<li><code>GROUP BY A, B</code> with <code>COUNT(*)</code> — the bag written as "tuple + number of copies": (1, 2) × 3, (3, 4) × 1. This is the easiest way to reason about bags: count copies per tuple.</li>
</ul>
<p class="meo">🧠 A bag = a set of tuples, each with a counter. Every bag rule on slide 7 is just arithmetic on those counters.</p>`,
        `<p class="y-chinh">🎯 Trong quan hệ R(A, B) = {(1,2), (3,4), (1,2), (1,2)} bộ (1, 2) xuất hiện 3 lần: coi là tập thì chỉ giữ một lần; coi là túi thì giữ cả ba, và cũng như tập, thứ tự các bộ không quan trọng.</p>
<p>Một bảng không có khoá chính chính là một cái túi như vậy — SQL Server lưu nguyên bốn dòng như được đưa vào:</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);          -- không có khoá chính: một dòng có thể lưu nhiều lần
INSERT INTO R VALUES (1, 2), (3, 4), (1, 2), (1, 2);
SELECT * FROM R;                        -- túi: 4 dòng
SELECT DISTINCT * FROM R;               -- tập: 2 dòng
SELECT A, B, COUNT(*) AS times          -- mỗi bộ xuất hiện mấy lần
FROM R
GROUP BY A, B;</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th><th>times</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td></tr>
<tr><td>3</td><td>4</td><td>1</td></tr>
</tbody>
</table>
<ul>
<li><code>SELECT * FROM R</code> — cái túi: 4 dòng, (1, 2) ba lần.</li>
<li><code>SELECT DISTINCT * FROM R</code> — góc nhìn tập: 2 dòng.</li>
<li><code>GROUP BY A, B</code> kèm <code>COUNT(*)</code> — cái túi viết dưới dạng "bộ + số bản": (1, 2) × 3, (3, 4) × 1. Đây là cách dễ nhất để suy luận về túi: đếm số bản của từng bộ.</li>
</ul>
<p class="meo">🧠 Túi = một tập các bộ, mỗi bộ có một bộ đếm. Mọi luật của túi ở slide 7 chỉ là phép tính trên các bộ đếm đó.</p>`],
      [5, 'Why Bags?',
        `<p class="y-chinh">🎯 Commercial DBMSs implement relations as bags, because some operations — union and projection — are much cheaper when duplicates need not be removed.</p>
<ul>
<li><strong>Projection</strong> on a set must compare every result row with all others to throw out duplicates (in practice: sort or hash the whole result). On a bag it just copies the chosen columns of each row.</li>
<li><strong>Union</strong> on a set must again find duplicates between R and S; on a bag it simply appends S after R.</li>
</ul>
<p>That is why SQL's default is the bag: <code>SELECT A FROM R</code> and <code>UNION ALL</code> are fast, and you pay for DISTINCT or UNION only when you ask. On a table of a million rows the difference is visible in the execution plan (web Chapter 8): a "Sort" or "Hash Match" step appears only for the set version.</p>
<div class="pitfall">"SQL removes duplicate rows automatically" is <strong>false</strong> — except in UNION, INTERSECT, EXCEPT and DISTINCT. It is a classic wrong option in FE questions.</div>`,
        `<p class="y-chinh">🎯 Các DBMS thương mại cài đặt quan hệ dưới dạng túi, vì vài phép — hợp và chiếu — rẻ hơn hẳn khi không phải bỏ dòng trùng.</p>
<ul>
<li><strong>Phép chiếu</strong> trên tập phải so mỗi dòng kết quả với mọi dòng khác để loại dòng trùng (thực tế: sắp xếp hoặc băm cả kết quả). Trên túi nó chỉ việc chép các cột được chọn của từng dòng.</li>
<li><strong>Phép hợp</strong> trên tập lại phải tìm dòng trùng giữa R và S; trên túi nó chỉ việc nối S vào sau R.</li>
</ul>
<p>Vì thế mặc định của SQL là túi: <code>SELECT A FROM R</code> và <code>UNION ALL</code> chạy nhanh, còn DISTINCT hay UNION chỉ tốn công khi bạn yêu cầu. Trên một bảng một triệu dòng, khác biệt thấy rõ trong kế hoạch thực thi (execution plan — Chương 8 trên web): bước "Sort" hay "Hash Match" chỉ xuất hiện ở bản tập.</p>
<div class="pitfall">"SQL tự động bỏ các dòng trùng" là <strong>SAI</strong> — trừ khi dùng UNION, INTERSECT, EXCEPT và DISTINCT. Đây là phương án sai kinh điển trong câu FE.</div>`],
      [6, 'Why Bags? - the average example',
        `<p class="y-chinh">🎯 Project R(A, B, C) onto A, B and take the average of A: the bag gives (1+3+1+1)/4 = 1.5, the set gives (1+3)/2 = 2 — only the bag gives the true average of the data.</p>
<p class="nhan">Before: R, and the two versions of π<sub>A,B</sub>(R)</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (1, 2, 5), (3, 4, 6), (1, 2, 7), (1, 2, 8);</code></pre>
<pre><code class="language-sql">SELECT A, B FROM R;                     -- π A,B (R) as a BAG: 4 rows
SELECT DISTINCT A, B FROM R;            -- π A,B (R) as a SET: 2 rows</code></pre>
<pre><code class="language-sql">-- average of A over the BAG (all 4 rows)
SELECT AVG(A * 1.0) AS avg_bag FROM R;
-- average of A over the SET (the 2 distinct rows)
SELECT AVG(A * 1.0) AS avg_set FROM (SELECT DISTINCT A, B FROM R) AS T;</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>avg_bag</th></tr></thead>
<tbody>
<tr><td>1.500000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>avg_set</th></tr></thead>
<tbody>
<tr><td>2.000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>avg_int</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
</tbody>
</table>
<p>The four rows are four different people (C differs), so the average of A over all of them is 1.5. The set version collapsed three different rows (1, 2, 5), (1, 2, 7), (1, 2, 8) into one (1, 2) and then averaged over only two values — a wrong answer to the real question. <strong>So the slide's red question has this answer:</strong> treating the projection as a set loses information that aggregates need; treating it as a bag keeps it.</p>
<p>The last result is a trap of SQL Server, not of algebra: <code>AVG(A)</code> on an <code>INT</code> column returns an INT, so 1.5 becomes <strong>1</strong>. That is why the queries above write <code>AVG(A * 1.0)</code> (multiplying by 1.0 turns the numbers into decimals first).</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the average of integers is a decimal (<code>numeric</code>) — no trap:
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT, c INT);
INSERT INTO r VALUES (1, 2, 5), (3, 4, 6), (1, 2, 7), (1, 2, 8);
SELECT AVG(a) AS avg_bag FROM r;                                  -- PostgreSQL: AVG(int) gives numeric
SELECT AVG(a) AS avg_set FROM (SELECT DISTINCT a, b FROM r) AS t;</code></pre>
<div class="out">INSERT 0 4</div>
<table>
<thead><tr><th>avg_bag</th></tr></thead>
<tbody>
<tr><td>1.5000000000000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>avg_set</th></tr></thead>
<tbody>
<tr><td>2.0000000000000000</td></tr>
</tbody>
</table>
If you move a query from SQL Server to PostgreSQL (or back), averages of integer columns can change. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-1-ham-tong-hop">PostgreSQL 6.1 — aggregate functions</a>.</div>`,
        `<p class="y-chinh">🎯 Chiếu R(A, B, C) lên A, B rồi lấy trung bình của A: túi cho (1+3+1+1)/4 = 1.5, tập cho (1+3)/2 = 2 — chỉ túi cho đúng trung bình của dữ liệu.</p>
<p class="nhan">Trước: R, và hai phiên bản của π<sub>A,B</sub>(R)</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (1, 2, 5), (3, 4, 6), (1, 2, 7), (1, 2, 8);</code></pre>
<pre><code class="language-sql">SELECT A, B FROM R;                     -- dạng TÚI: 4 dòng
SELECT DISTINCT A, B FROM R;            -- dạng TẬP: 2 dòng</code></pre>
<pre><code class="language-sql">-- trung bình A trên TÚI (cả 4 dòng)
SELECT AVG(A * 1.0) AS avg_bag FROM R;
-- trung bình A trên TẬP (2 dòng khác nhau)
SELECT AVG(A * 1.0) AS avg_set FROM (SELECT DISTINCT A, B FROM R) AS T;</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>avg_bag</th></tr></thead>
<tbody>
<tr><td>1.500000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>avg_set</th></tr></thead>
<tbody>
<tr><td>2.000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>avg_int</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
</tbody>
</table>
<p>Bốn dòng là bốn người khác nhau (C khác nhau), nên trung bình A của cả bốn là 1.5. Bản tập đã gộp ba dòng khác nhau (1, 2, 5), (1, 2, 7), (1, 2, 8) thành một (1, 2) rồi lấy trung bình trên chỉ hai giá trị — sai với câu hỏi thật. <strong>Vậy câu hỏi màu đỏ trên slide có đáp án:</strong> coi phép chiếu là tập thì mất thông tin mà phép gộp cần; coi là túi thì giữ được.</p>
<p>Kết quả cuối là cái bẫy của SQL Server, không phải của đại số: <code>AVG(A)</code> trên cột <code>INT</code> trả về INT, nên 1.5 thành <strong>1</strong>. Vì thế các câu ở trên viết <code>AVG(A * 1.0)</code> (nhân với 1.0 để đổi các số sang số thập phân trước).</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> trung bình của số nguyên là số thập phân (<code>numeric</code>) — không có bẫy:
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT, c INT);
INSERT INTO r VALUES (1, 2, 5), (3, 4, 6), (1, 2, 7), (1, 2, 8);
SELECT AVG(a) AS avg_bag FROM r;                                  -- AVG(int) ra numeric
SELECT AVG(a) AS avg_set FROM (SELECT DISTINCT a, b FROM r) AS t;</code></pre>
<div class="out">INSERT 0 4</div>
<table>
<thead><tr><th>avg_bag</th></tr></thead>
<tbody>
<tr><td>1.5000000000000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>avg_set</th></tr></thead>
<tbody>
<tr><td>2.0000000000000000</td></tr>
</tbody>
</table>
Chuyển một câu truy vấn từ SQL Server sang PostgreSQL (hay ngược lại) thì trung bình của cột số nguyên có thể đổi. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-1-ham-tong-hop">PostgreSQL 6.1 — hàm tổng hợp</a>.</div>`],
      [7, 'Union, Intersection, and Difference of Bags',
        `<p class="y-chinh">🎯 If tuple t appears n times in R and m times in S, then t appears n + m times in R ∪ S, MIN(n, m) times in R ∩ S, and MAX(0, n − m) times in R − S.</p>
<table>
<thead><tr><th>Operation</th><th>Copies of t in the result</th><th>Picture (café sales, t = iced coffee, n = 3, m = 1)</th><th>SQL</th></tr></thead>
<tbody>
<tr><td>R ∪ S</td><td>n + m</td><td>both branches together sold 4</td><td>UNION ALL</td></tr>
<tr><td>R ∩ S</td><td>MIN(n, m)</td><td>"matched" sales: 1</td><td>INTERSECT ALL (PostgreSQL)</td></tr>
<tr><td>R − S</td><td>MAX(0, n − m)</td><td>branch R sold 2 more than S</td><td>EXCEPT ALL (PostgreSQL)</td></tr>
</tbody>
</table>
<p>MAX(0, …) is there because a count cannot be negative: if R has t once and S three times, R − S has t zero times, not −2 times. When every tuple appears at most once (n, m ∈ {0, 1}), the three rules give exactly the set operators of slide 12 in lesson 2.B — set algebra is a special case of bag algebra.</p>
<div class="pitfall">On bags, R ∩ S = R − (R − S) still holds, but R ∪ S is no longer "at most |R| + |S| different rows" — it is <strong>exactly</strong> |R| + |S| rows.</div>`,
        `<p class="y-chinh">🎯 Nếu bộ t xuất hiện n lần trong R và m lần trong S, thì t xuất hiện n + m lần trong R ∪ S, MIN(n, m) lần trong R ∩ S, và MAX(0, n − m) lần trong R − S.</p>
<table>
<thead><tr><th>Phép</th><th>Số bản của t trong kết quả</th><th>Hình ảnh (bán cà phê, t = cà phê sữa, n = 3, m = 1)</th><th>SQL</th></tr></thead>
<tbody>
<tr><td>R ∪ S</td><td>n + m</td><td>hai chi nhánh cộng lại bán 4 ly</td><td>UNION ALL</td></tr>
<tr><td>R ∩ S</td><td>MIN(n, m)</td><td>số ly "khớp nhau": 1</td><td>INTERSECT ALL (PostgreSQL)</td></tr>
<tr><td>R − S</td><td>MAX(0, n − m)</td><td>chi nhánh R bán hơn S 2 ly</td><td>EXCEPT ALL (PostgreSQL)</td></tr>
</tbody>
</table>
<p>Có MAX(0, …) vì số đếm không thể âm: R có t một lần, S có t ba lần thì R − S có t không lần, chứ không phải −2 lần. Khi mọi bộ xuất hiện nhiều nhất một lần (n, m ∈ {0, 1}), ba luật cho ra đúng các phép tập hợp ở slide 12 của bài 2.B — đại số trên tập là trường hợp riêng của đại số trên túi.</p>
<div class="pitfall">Trên túi, R ∩ S = R − (R − S) vẫn đúng, nhưng R ∪ S không còn là "tối đa |R| + |S| dòng khác nhau" nữa — nó có <strong>đúng</strong> |R| + |S| dòng.</div>`],
      [8, 'Union, Intersection, and Difference of Bags - Example',
        `<p class="y-chinh">🎯 R = {(1,2)×3, (3,4)×1}, S = {(1,2)×1, (3,4)×2, (5,6)×1}: R ∪ S has 8 rows, R ∩ S = {(1,2), (3,4)}, R − S = {(1,2), (1,2)}.</p>
<p class="nhan">Counting copies first (this is how to do it on paper)</p>
<table>
<thead><tr><th>Tuple</th><th>n (in R)</th><th>m (in S)</th><th>∪: n + m</th><th>∩: MIN(n, m)</th><th>−: MAX(0, n − m)</th></tr></thead>
<tbody>
<tr><td>(1, 2)</td><td>3</td><td>1</td><td>4</td><td>1</td><td>2</td></tr>
<tr><td>(3, 4)</td><td>1</td><td>2</td><td>3</td><td>1</td><td>0</td></tr>
<tr><td>(5, 6)</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>total rows</td><td></td><td></td><td>8</td><td>2</td><td>2</td></tr>
</tbody>
</table>
<p class="nhan">Bag union on SQL Server, then the set versions for comparison</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);
CREATE TABLE S (A INT, B INT);
INSERT INTO R VALUES (1, 2), (3, 4), (1, 2), (1, 2);
INSERT INTO S VALUES (1, 2), (3, 4), (3, 4), (5, 6);
-- bag union R ∪ S: n + m copies
SELECT A, B FROM R
UNION ALL
SELECT A, B FROM S
ORDER BY A, B;
-- the SET versions for comparison
SELECT A, B FROM R UNION     SELECT A, B FROM S;
SELECT A, B FROM R INTERSECT SELECT A, B FROM S;
SELECT A, B FROM R EXCEPT    SELECT A, B FROM S;</code></pre>
<div class="out">(4 rows affected)<br>
(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>5</td><td>6</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>5</td><td>6</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
<p>UNION ALL returns the slide's 8 rows (sorted here to make counting easy). The set versions differ: UNION gives 3 rows, INTERSECT happens to give the same 2 rows as the bag version, and EXCEPT gives <strong>0 rows</strong> — as sets, both (1, 2) and (3, 4) are in S, while the bag says R has two more copies of (1, 2) than S.</p>
<p class="nhan">Bag ∩ and − on SQL Server: number the copies</p>
<p>SQL Server has no INTERSECT ALL or EXCEPT ALL. The trick: give each copy of a tuple a number (1st, 2nd, 3rd …) with <code>ROW_NUMBER() OVER (PARTITION BY A, B …)</code>; now every row is different, and the ordinary set INTERSECT/EXCEPT on (A, B, number) counts copies exactly as MIN and MAX(0, n − m) do.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);
CREATE TABLE S (A INT, B INT);
INSERT INTO R VALUES (1, 2), (3, 4), (1, 2), (1, 2);
INSERT INTO S VALUES (1, 2), (3, 4), (3, 4), (5, 6);
-- number the copies of each tuple: 1st, 2nd, 3rd …
SELECT A, B, ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A) AS copy_no
FROM R;
-- bag intersection: copies (A, B, copy_no) present in both
SELECT A, B FROM (
  SELECT A, B, ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A) AS n FROM R
  INTERSECT
  SELECT A, B, ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A) AS n FROM S
) AS T;
-- bag difference: copies of R that S does not have
SELECT A, B FROM (
  SELECT A, B, ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A) AS n FROM R
  EXCEPT
  SELECT A, B, ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A) AS n FROM S
) AS T;</code></pre>
<div class="out">(4 rows affected)<br>
(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>copy_no</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>1</td></tr>
<tr><td>1</td><td>2</td><td>2</td></tr>
<tr><td>1</td><td>2</td><td>3</td></tr>
<tr><td>3</td><td>4</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>On PostgreSQL</strong> bag intersection and difference are built in — the slide's two results in two lines:
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT);
CREATE TABLE s (a INT, b INT);
INSERT INTO r VALUES (1, 2), (3, 4), (1, 2), (1, 2);
INSERT INTO s VALUES (1, 2), (3, 4), (3, 4), (5, 6);
SELECT a, b FROM r INTERSECT ALL SELECT a, b FROM s;   -- bag ∩: MIN(n, m) copies
SELECT a, b FROM r EXCEPT ALL    SELECT a, b FROM s;   -- bag −: MAX(0, n − m) copies</code></pre>
<div class="out">INSERT 0 4<br>
INSERT 0 4</div>
<table>
<thead><tr><th>a</th><th>b</th></tr></thead>
<tbody>
<tr><td>3</td><td>4</td></tr>
<tr><td>1</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>a</th><th>b</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT, DISTINCT</a>.</div>`,
        `<p class="y-chinh">🎯 R = {(1,2)×3, (3,4)×1}, S = {(1,2)×1, (3,4)×2, (5,6)×1}: R ∪ S có 8 dòng, R ∩ S = {(1,2), (3,4)}, R − S = {(1,2), (1,2)}.</p>
<p class="nhan">Đếm số bản trước (làm trên giấy thì làm thế này)</p>
<table>
<thead><tr><th>Bộ</th><th>n (trong R)</th><th>m (trong S)</th><th>∪: n + m</th><th>∩: MIN(n, m)</th><th>−: MAX(0, n − m)</th></tr></thead>
<tbody>
<tr><td>(1, 2)</td><td>3</td><td>1</td><td>4</td><td>1</td><td>2</td></tr>
<tr><td>(3, 4)</td><td>1</td><td>2</td><td>3</td><td>1</td><td>0</td></tr>
<tr><td>(5, 6)</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>tổng số dòng</td><td></td><td></td><td>8</td><td>2</td><td>2</td></tr>
</tbody>
</table>
<p class="nhan">Hợp túi trên SQL Server, rồi các bản tập để so sánh</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);
CREATE TABLE S (A INT, B INT);
INSERT INTO R VALUES (1, 2), (3, 4), (1, 2), (1, 2);
INSERT INTO S VALUES (1, 2), (3, 4), (3, 4), (5, 6);
-- hợp túi: n + m bản
SELECT A, B FROM R
UNION ALL
SELECT A, B FROM S
ORDER BY A, B;
-- bản TẬP để so sánh
SELECT A, B FROM R UNION     SELECT A, B FROM S;
SELECT A, B FROM R INTERSECT SELECT A, B FROM S;
SELECT A, B FROM R EXCEPT    SELECT A, B FROM S;</code></pre>
<div class="out">(4 rows affected)<br>
(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>5</td><td>6</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>5</td><td>6</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
<p>UNION ALL trả về đúng 8 dòng của slide (ở đây có sắp xếp cho dễ đếm). Các bản tập thì khác: UNION ra 3 dòng, INTERSECT tình cờ ra đúng 2 dòng như bản túi, còn EXCEPT ra <strong>0 dòng</strong> — xét như tập thì cả (1, 2) lẫn (3, 4) đều có trong S, trong khi túi nói R có nhiều hơn S hai bản (1, 2).</p>
<p class="nhan">∩ và − trên túi ở SQL Server: đánh số các bản</p>
<p>SQL Server không có INTERSECT ALL hay EXCEPT ALL. Mẹo: đánh số từng bản của một bộ (bản 1, bản 2, bản 3 …) bằng <code>ROW_NUMBER() OVER (PARTITION BY A, B …)</code>; giờ mọi dòng đều khác nhau, và INTERSECT/EXCEPT bản tập thông thường trên (A, B, số thứ tự) đếm số bản đúng y như MIN và MAX(0, n − m).</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);
CREATE TABLE S (A INT, B INT);
INSERT INTO R VALUES (1, 2), (3, 4), (1, 2), (1, 2);
INSERT INTO S VALUES (1, 2), (3, 4), (3, 4), (5, 6);
-- đánh số các bản của mỗi bộ: bản 1, 2, 3 …
SELECT A, B, ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A) AS copy_no
FROM R;
-- giao túi: các bản có ở cả hai
SELECT A, B FROM (
  SELECT A, B, ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A) AS n FROM R
  INTERSECT
  SELECT A, B, ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A) AS n FROM S
) AS T;
-- hiệu túi: các bản của R mà S không có
SELECT A, B FROM (
  SELECT A, B, ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A) AS n FROM R
  EXCEPT
  SELECT A, B, ROW_NUMBER() OVER (PARTITION BY A, B ORDER BY A) AS n FROM S
) AS T;</code></pre>
<div class="out">(4 rows affected)<br>
(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>copy_no</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>1</td></tr>
<tr><td>1</td><td>2</td><td>2</td></tr>
<tr><td>1</td><td>2</td><td>3</td></tr>
<tr><td>3</td><td>4</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> giao và hiệu trên túi có sẵn — hai kết quả của slide trong hai dòng:
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT);
CREATE TABLE s (a INT, b INT);
INSERT INTO r VALUES (1, 2), (3, 4), (1, 2), (1, 2);
INSERT INTO s VALUES (1, 2), (3, 4), (3, 4), (5, 6);
SELECT a, b FROM r INTERSECT ALL SELECT a, b FROM s;   -- MIN(n, m) bản
SELECT a, b FROM r EXCEPT ALL    SELECT a, b FROM s;   -- MAX(0, n − m) bản</code></pre>
<div class="out">INSERT 0 4<br>
INSERT 0 4</div>
<table>
<thead><tr><th>a</th><th>b</th></tr></thead>
<tbody>
<tr><td>3</td><td>4</td></tr>
<tr><td>1</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>a</th><th>b</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT, DISTINCT</a>.</div>`],
      [9, 'Projection of Bags',
        `<p class="y-chinh">🎯 On a bag, projection processes each tuple independently and does not eliminate duplicates: π<sub>A,B</sub> of the 4-row R gives 4 rows, (1, 2) three times.</p>
<p class="nhan">Before: R(A, B, C) = (1,2,2), (2,4,4), (1,2,2), (1,2,2). After:</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (1, 2, 2), (2, 4, 4), (1, 2, 2), (1, 2, 2);
SELECT A, B FROM R;            -- π A,B (R) on a bag: every row kept
SELECT DISTINCT A, B FROM R;   -- δ(π A,B (R)): what set semantics would give</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>2</td><td>4</td></tr>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>2</td><td>4</td></tr>
</tbody>
</table>
<p><code>SELECT A, B FROM R</code> is exactly bag projection: one output row per input row, C cut off. For comparison, the set projection (what lesson 2.B's π did) needs DISTINCT:</p>
<pre><code class="language-sql">SELECT DISTINCT A, B FROM R;   -- δ(π A,B (R)): what set semantics would give</code></pre>
<p>It returns 2 rows — the rule "π on a set = SELECT DISTINCT" from slide 16 of the Chapter 2 deck. The result of this second query is the δ of slide 17 applied to the first.</p>
<p class="meo">🧠 Bag projection never changes the number of rows: |π<sub>L</sub>(R)| = |R|. Set projection can only lower it.</p>`,
        `<p class="y-chinh">🎯 Trên túi, phép chiếu xử lý từng bộ độc lập và không bỏ dòng trùng: π<sub>A,B</sub> của R 4 dòng cho 4 dòng, (1, 2) ba lần.</p>
<p class="nhan">Trước: R(A, B, C) = (1,2,2), (2,4,4), (1,2,2), (1,2,2). Sau:</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (1, 2, 2), (2, 4, 4), (1, 2, 2), (1, 2, 2);
SELECT A, B FROM R;            -- trên túi: giữ mọi dòng
SELECT DISTINCT A, B FROM R;   -- thứ ngữ nghĩa tập sẽ cho</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>2</td><td>4</td></tr>
<tr><td>1</td><td>2</td></tr>
<tr><td>1</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>2</td><td>4</td></tr>
</tbody>
</table>
<p><code>SELECT A, B FROM R</code> chính là phép chiếu trên túi: mỗi dòng vào cho một dòng ra, cột C bị cắt. Để so, phép chiếu trên tập (thứ π của bài 2.B làm) cần DISTINCT:</p>
<pre><code class="language-sql">SELECT DISTINCT A, B FROM R;   -- thứ ngữ nghĩa tập sẽ cho</code></pre>
<p>Câu này trả về 2 dòng — đúng luật "π trên tập = SELECT DISTINCT" ở slide 16 của bộ Chapter 2. Kết quả câu thứ hai chính là phép δ của slide 17 áp lên câu thứ nhất.</p>
<p class="meo">🧠 Phép chiếu trên túi không bao giờ đổi số dòng: |π<sub>L</sub>(R)| = |R|. Phép chiếu trên tập chỉ có thể làm giảm nó.</p>`],
      [10, 'Selection on Bags',
        `<p class="y-chinh">🎯 On a bag, selection tests each tuple independently and does not eliminate duplicates: σ<sub>C=2</sub>(R) keeps the three copies of (1, 2, 2).</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (1, 2, 2), (2, 4, 4), (1, 2, 2), (1, 2, 2);
SELECT * FROM R WHERE C = 2;   -- σ C=2 (R): each row tested on its own</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>2</td></tr>
<tr><td>1</td><td>2</td><td>2</td></tr>
<tr><td>1</td><td>2</td><td>2</td></tr>
</tbody>
</table>
<p>Each of the four rows is tested on its own: the three (1, 2, 2) rows pass (C = 2), the row (2, 4, 4) fails. Selection behaves the same on sets and bags — if R has no duplicates, σ<sub>C</sub>(R) has none either. The difference with sets only shows when the input already has duplicates.</p>
<p class="meo">🧠 σ on a bag: each copy passes or fails alone, so a tuple with n copies keeps either all n or none.</p>`,
        `<p class="y-chinh">🎯 Trên túi, phép chọn kiểm từng bộ độc lập và không bỏ dòng trùng: σ<sub>C=2</sub>(R) giữ cả ba bản (1, 2, 2).</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (1, 2, 2), (2, 4, 4), (1, 2, 2), (1, 2, 2);
SELECT * FROM R WHERE C = 2;   -- mỗi dòng được kiểm riêng</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>2</td></tr>
<tr><td>1</td><td>2</td><td>2</td></tr>
<tr><td>1</td><td>2</td><td>2</td></tr>
</tbody>
</table>
<p>Từng dòng trong bốn dòng được kiểm riêng: ba dòng (1, 2, 2) qua (C = 2), dòng (2, 4, 4) không qua. Phép chọn cư xử như nhau trên tập và trên túi — nếu R không có dòng trùng thì σ<sub>C</sub>(R) cũng không. Khác biệt với tập chỉ lộ ra khi đầu vào đã có sẵn dòng trùng.</p>
<p class="meo">🧠 σ trên túi: mỗi bản tự qua hay trượt, nên một bộ có n bản thì hoặc giữ cả n, hoặc không giữ bản nào.</p>`],
      [11, 'Product of Bags',
        `<p class="y-chinh">🎯 In R × S every tuple of R is paired with every tuple of S, duplicates included: if r appears m times in R and s appears n times in S, the pair rs appears m·n times.</p>
<p>So the size rule of slide 17 (Chapter 2) does not change: |R × S| = |R| × |S|, whether or not the rows are duplicates. A 2-row R and a 3-row S give 6 rows even if R's two rows are identical — the next slide shows exactly that.</p>
<p class="meo">🧠 Duplicates multiply: 2 copies × 2 copies = 4 copies of the pair. This is how a join on a column with repeated values "explodes" the row count.</p>`,
        `<p class="y-chinh">🎯 Trong R × S mỗi bộ của R ghép với mọi bộ của S, kể cả bản trùng: nếu r xuất hiện m lần trong R và s xuất hiện n lần trong S thì cặp rs xuất hiện m·n lần.</p>
<p>Vì vậy luật số dòng của slide 17 (Chapter 2) không đổi: |R × S| = |R| × |S|, dù các dòng có trùng hay không. R 2 dòng và S 3 dòng cho 6 dòng ngay cả khi hai dòng của R giống hệt nhau — slide sau cho thấy đúng điều đó.</p>
<p class="meo">🧠 Bản trùng thì nhân lên: 2 bản × 2 bản = 4 bản của cặp. Đây là cách một phép nối trên cột có giá trị lặp làm số dòng "phình to".</p>`],
      [12, 'Product of Bags - Example',
        `<p class="y-chinh">🎯 R = {(1,2), (1,2)}, S = {(2,3), (4,5), (4,5)}: R × S has 2 × 3 = 6 rows — (1,2,2,3) twice and (1,2,4,5) four times.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);
CREATE TABLE S (B INT, C INT);
INSERT INTO R VALUES (1, 2), (1, 2);
INSERT INTO S VALUES (2, 3), (4, 5), (4, 5);
SELECT R.A, R.B AS [R.B], S.B AS [S.B], S.C
FROM R CROSS JOIN S
ORDER BY S.B;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>R.B</th><th>S.B</th><th>C</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>2</td><td>3</td></tr>
<tr><td>1</td><td>2</td><td>2</td><td>3</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
</tbody>
</table>
<p>Count with the rule: (1, 2) has 2 copies, (2, 3) has 1 → 2 × 1 = 2 copies of (1, 2, 2, 3); (4, 5) has 2 copies → 2 × 2 = 4 copies of (1, 2, 4, 5). Total 6, the slide's figure.</p>`,
        `<p class="y-chinh">🎯 R = {(1,2), (1,2)}, S = {(2,3), (4,5), (4,5)}: R × S có 2 × 3 = 6 dòng — (1,2,2,3) hai lần và (1,2,4,5) bốn lần.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);
CREATE TABLE S (B INT, C INT);
INSERT INTO R VALUES (1, 2), (1, 2);
INSERT INTO S VALUES (2, 3), (4, 5), (4, 5);
SELECT R.A, R.B AS [R.B], S.B AS [S.B], S.C
FROM R CROSS JOIN S
ORDER BY S.B;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>R.B</th><th>S.B</th><th>C</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>2</td><td>3</td></tr>
<tr><td>1</td><td>2</td><td>2</td><td>3</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
</tbody>
</table>
<p>Đếm bằng luật: (1, 2) có 2 bản, (2, 3) có 1 → 2 × 1 = 2 bản của (1, 2, 2, 3); (4, 5) có 2 bản → 2 × 2 = 4 bản của (1, 2, 4, 5). Tổng 6, đúng hình trên slide.</p>`],
      [13, 'Joins of Bags',
        `<p class="y-chinh">🎯 A join of bags pairs each tuple of one relation with each tuple of the other that satisfies the join condition, duplicates or not.</p>
<p>Since R ⋈<sub>C</sub> S = σ<sub>C</sub>(R × S) (lesson 2.B, slide 18), the bag rules follow from the two previous slides: the product multiplies copies, then selection keeps or drops each copy on its own. Nothing is ever merged.</p>
<p>Practical meaning: joining Orders to OrderLines, an order with 3 lines appears 3 times — correct, not a bug. But joining on a column that repeats on <em>both</em> sides multiplies twice, a classic cause of totals that are "too big" in reports.</p>`,
        `<p class="y-chinh">🎯 Phép nối trên túi ghép mỗi bộ của quan hệ này với mỗi bộ của quan hệ kia thoả điều kiện nối, trùng hay không trùng.</p>
<p>Vì R ⋈<sub>C</sub> S = σ<sub>C</sub>(R × S) (bài 2.B, slide 18), luật trên túi suy ra ngay từ hai slide trước: phép tích nhân số bản, rồi phép chọn giữ hoặc bỏ từng bản một. Không có gì bị gộp lại.</p>
<p>Ý nghĩa thực tế: nối Orders với OrderLines, một đơn có 3 dòng hàng xuất hiện 3 lần — đúng, không phải lỗi. Nhưng nối theo một cột lặp ở <em>cả hai</em> bên thì nhân hai lần, nguyên nhân kinh điển của các con số tổng "to bất thường" trong báo cáo.</p>`],
      [14, 'Joins of Bags - Example',
        `<p class="y-chinh">🎯 With the same R and S, R ⋈<sub>R.B&lt;S.B</sub> S has 4 rows: each of the 2 copies of (1, 2) matches each of the 2 copies of (4, 5); (2, 3) fails because 2 &lt; 2 is false.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);
CREATE TABLE S (B INT, C INT);
INSERT INTO R VALUES (1, 2), (1, 2);
INSERT INTO S VALUES (2, 3), (4, 5), (4, 5);
-- R ⋈ R.B&lt;S.B S
SELECT R.A, R.B AS [R.B], S.B AS [S.B], S.C
FROM R JOIN S ON R.B &lt; S.B;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>R.B</th><th>S.B</th><th>C</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
</tbody>
</table>
<p>From the 6 rows of R × S (slide 12), the 2 rows with S.B = 2 are dropped by the condition R.B &lt; S.B, and the 4 rows with S.B = 4 stay — four identical rows, exactly as on the slide.</p>
<p class="dap-an">✅ How many rows would <code>SELECT DISTINCT …</code> of this join return? One — (1, 2, 4, 5). That is the set answer; the bag answer is 4.</p>`,
        `<p class="y-chinh">🎯 Cùng R và S, R ⋈<sub>R.B&lt;S.B</sub> S có 4 dòng: mỗi bản trong 2 bản (1, 2) khớp với mỗi bản trong 2 bản (4, 5); (2, 3) không khớp vì 2 &lt; 2 sai.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT);
CREATE TABLE S (B INT, C INT);
INSERT INTO R VALUES (1, 2), (1, 2);
INSERT INTO S VALUES (2, 3), (4, 5), (4, 5);
-- R ⋈ R.B&lt;S.B S
SELECT R.A, R.B AS [R.B], S.B AS [S.B], S.C
FROM R JOIN S ON R.B &lt; S.B;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>R.B</th><th>S.B</th><th>C</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>5</td></tr>
</tbody>
</table>
<p>Trong 6 dòng của R × S (slide 12), 2 dòng có S.B = 2 bị điều kiện R.B &lt; S.B loại, 4 dòng có S.B = 4 được giữ — bốn dòng giống hệt nhau, đúng như slide.</p>
<p class="dap-an">✅ <code>SELECT DISTINCT …</code> của phép nối này trả về mấy dòng? Một — (1, 2, 4, 5). Đó là đáp án theo tập; theo túi là 4.</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>R = {a, a, b}, S = {a, b, b, c} (one-column bags). How many rows do R ∪ S, R ∩ S, R − S and S − R have?</li>
<li>Which SQL keyword gives bag union, and which one gives set union?</li>
<li>Why is <code>SELECT A FROM R</code> faster than <code>SELECT DISTINCT A FROM R</code> on a big table?</li>
<li>SQL Server: how do you compute a bag difference without EXCEPT ALL?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) ∪: 3 + 4 = 7; ∩: a MIN(2,1) = 1, b MIN(1,2) = 1 → 2; R − S: a MAX(0, 2−1) = 1, b 0 → 1 (one a); S − R: b 1, c 1 → 2. (2) UNION ALL (bag), UNION (set). (3) No duplicate elimination — no sort or hash over the whole result. (4) Number the copies with ROW_NUMBER() OVER (PARTITION BY …) on both sides, then EXCEPT on (columns, number).</p>
<p><strong>Next:</strong> lesson 2.D — the extended operators δ, aggregation, γ, extended projection, τ and outer joins.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>R = {a, a, b}, S = {a, b, b, c} (túi một cột). R ∪ S, R ∩ S, R − S và S − R có bao nhiêu dòng?</li>
<li>Từ khoá SQL nào cho hợp túi, từ khoá nào cho hợp tập?</li>
<li>Vì sao trên bảng lớn <code>SELECT A FROM R</code> nhanh hơn <code>SELECT DISTINCT A FROM R</code>?</li>
<li>Trên SQL Server, tính hiệu túi thế nào khi không có EXCEPT ALL?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) ∪: 3 + 4 = 7; ∩: a MIN(2,1) = 1, b MIN(1,2) = 1 → 2; R − S: a MAX(0, 2−1) = 1, b 0 → 1 (một a); S − R: b 1, c 1 → 2. (2) UNION ALL (túi), UNION (tập). (3) Không phải bỏ dòng trùng — không phải sắp xếp hay băm cả kết quả. (4) Đánh số các bản bằng ROW_NUMBER() OVER (PARTITION BY …) ở cả hai bên, rồi EXCEPT trên (các cột, số thứ tự).</p>
<p><strong>Tiếp theo:</strong> bài 2.D — các phép mở rộng δ, phép gộp, γ, phép chiếu mở rộng, τ và nối ngoài.</p>`),
    books([
      ['ullman', 'Ch.5 Algebraic and Logical Query Languages — §5.1 Relational Operations on Bags (why bags, union/intersection/difference, projection, selection, product and joins of bags)', 'Chương 5 Algebraic and Logical Query Languages — §5.1 Relational Operations on Bags (vì sao cần túi, hợp/giao/hiệu, chiếu, chọn, tích và nối trên túi)'],
      ['ramakrishnan', 'Ch.5 SQL: Queries, Constraints, Triggers — §5.3 UNION, INTERSECT and EXCEPT (the ALL versions and multiset semantics)', 'Chương 5 SQL: Queries, Constraints, Triggers — §5.3 UNION, INTERSECT và EXCEPT (bản ALL và ngữ nghĩa đa tập)'],
    ]),
  ].join('\n'),
};

/* ───────── 2.D — 📑 Slide by slide · Extended operators: δ, aggregation, γ, extended π, τ, outer joins (Chapter 5, slides 15–30) ───────── */
const L_dbi6_2 = {
  title: '2.D — 📑 Slide by slide · Extended operators: δ, aggregation, γ, extended π, τ, outer joins (Chapter 5, slides 15–30)|||2.D — 📑 Học theo từng slide · Phép mở rộng: δ, phép gộp, γ, π mở rộng, τ, nối ngoài (Chapter 5, slide 15–30)',
  slug: 'dbi202-slide-dbi6-2',
  type: 'VIDEO',
  description: 'Giảng từng slide 15–30 của bộ slide Chapter 5 (tự học) của trường: loại trùng δ = DISTINCT, năm phép gộp SUM/AVG/MIN/MAX/COUNT (và bẫy AVG trên cột INT của SQL Server), phép nhóm γ = GROUP BY trên bảng Movies/stars, phép chiếu mở rộng (biểu thức, đổi tên), sắp xếp τ = ORDER BY (NULL đầu hay cuối), nối ngoài tự nhiên và nối ngoài trái/phải/đầy đủ — mỗi phép có bảng trước/sau, SQL chạy thật trên SQL Server và ô PostgreSQL ở chỗ cú pháp khác.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.D · school slides "Chapter 5" (self-study), slides 15–30</span>
<h2>Extended operators — the algebra behind DISTINCT, GROUP BY, ORDER BY and outer joins</h2>
<p class="lead">⚠️ Still the school's <strong>"Chapter 5" self-study deck</strong>. The basic algebra (σ π ∪ ∩ − × ⋈ ρ) cannot count, sum, sort or keep unmatched rows. Slides 15–30 add six operators that can — and each of them is one familiar SQL clause. After this lesson, a SELECT statement reads as an expression tree from bottom to top.</p>
<div class="callout"><strong>The six extended operators and their SQL:</strong>
<table>
<thead><tr><th>Operator</th><th>Name</th><th>SQL</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>δ(R)</td><td>duplicate elimination</td><td>SELECT DISTINCT</td><td>17</td></tr>
<tr><td>SUM AVG MIN MAX COUNT</td><td>aggregation</td><td>the same five functions</td><td>18–19</td></tr>
<tr><td>γ<sub>L</sub>(R)</td><td>grouping</td><td>GROUP BY (+ aggregates in the SELECT list)</td><td>20–23</td></tr>
<tr><td>π<sub>L</sub>(R) with expressions</td><td>extended projection</td><td>SELECT A, B + C AS X</td><td>24–25</td></tr>
<tr><td>τ<sub>L</sub>(R)</td><td>sorting</td><td>ORDER BY</td><td>26</td></tr>
<tr><td>⟕ ⟖ ⟗</td><td>left / right / full outer join</td><td>LEFT / RIGHT / FULL OUTER JOIN</td><td>27–30</td></tr>
</tbody>
</table>
</div>
<p>How a full SELECT maps to them — read this once now and again at the end of the lesson:</p>
<pre><code class="language-plaintext">SELECT   DISTINCT cid, COUNT(*) AS n     ← π extended + δ
FROM     Course LEFT JOIN Enroll ON …    ← ⟕
WHERE    credits = 3                     ← σ (before grouping)
GROUP BY cid                             ← γ
HAVING   COUNT(*) &gt;= 2                   ← σ (after grouping)
ORDER BY n DESC                          ← τ (always last)</code></pre>`,
    `<span class="eyebrow">Chương 2 · Bài 2.D · slide "Chapter 5" của trường (tự học), slide 15–30</span>
<h2>Các phép mở rộng — đại số đằng sau DISTINCT, GROUP BY, ORDER BY và nối ngoài</h2>
<p class="lead">⚠️ Vẫn là bộ slide <strong>"Chapter 5" tự học</strong> của trường. Đại số cơ bản (σ π ∪ ∩ − × ⋈ ρ) không đếm, không cộng, không sắp xếp và không giữ được các dòng không khớp. Slide 15–30 thêm sáu phép làm được những việc đó — và mỗi phép chính là một mệnh đề SQL quen thuộc. Học xong bài này, một câu SELECT đọc được như một cây biểu thức từ dưới lên.</p>
<div class="callout"><strong>Sáu phép mở rộng và SQL của chúng:</strong>
<table>
<thead><tr><th>Phép</th><th>Tên</th><th>SQL</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>δ(R)</td><td>loại bỏ trùng lặp (duplicate elimination)</td><td>SELECT DISTINCT</td><td>17</td></tr>
<tr><td>SUM AVG MIN MAX COUNT</td><td>phép gộp (aggregation)</td><td>đúng năm hàm đó</td><td>18–19</td></tr>
<tr><td>γ<sub>L</sub>(R)</td><td>phép nhóm (grouping)</td><td>GROUP BY (+ hàm gộp trong danh sách SELECT)</td><td>20–23</td></tr>
<tr><td>π<sub>L</sub>(R) có biểu thức</td><td>phép chiếu mở rộng (extended projection)</td><td>SELECT A, B + C AS X</td><td>24–25</td></tr>
<tr><td>τ<sub>L</sub>(R)</td><td>phép sắp xếp (sorting)</td><td>ORDER BY</td><td>26</td></tr>
<tr><td>⟕ ⟖ ⟗</td><td>nối ngoài trái / phải / đầy đủ (outer join)</td><td>LEFT / RIGHT / FULL OUTER JOIN</td><td>27–30</td></tr>
</tbody>
</table>
</div>
<p>Một câu SELECT đầy đủ ứng với các phép đó ra sao — đọc một lần bây giờ và một lần nữa ở cuối bài:</p>
<pre><code class="language-plaintext">SELECT   DISTINCT cid, COUNT(*) AS n     ← π mở rộng + δ
FROM     Course LEFT JOIN Enroll ON …    ← ⟕
WHERE    credits = 3                     ← σ (trước khi nhóm)
GROUP BY cid                             ← γ
HAVING   COUNT(*) &gt;= 2                   ← σ (sau khi nhóm)
ORDER BY n DESC                          ← τ (luôn làm cuối)</code></pre>`),
    walkHead('dbi6', 15, 30),
    walk('dbi6', [
      [15, 'Extended Operations of Relational Algebra',
        `<p class="y-chinh">🎯 A section title: the extended operators of relational algebra — operators beyond σ π ∪ ∩ − × ⋈ ρ, needed to express what real SQL queries do.</p>
<p>"Extended" means they are added on top of the basic algebra; all of them work on bags (lesson 2.C), because counting and summing only make sense when duplicates are kept.</p>`,
        `<p class="y-chinh">🎯 Tiêu đề mục: các phép mở rộng của đại số quan hệ — những phép ngoài σ π ∪ ∩ − × ⋈ ρ, cần để diễn đạt được thứ mà câu SQL thật làm.</p>
<p>"Mở rộng" (extended) nghĩa là chúng được thêm lên trên đại số cơ bản; tất cả đều làm việc trên túi (bài 2.C), vì đếm và cộng chỉ có nghĩa khi dòng trùng được giữ lại.</p>`],
      [16, 'Extended Operators of Relational Algebra - the list',
        `<p class="y-chinh">🎯 Six extended operators: duplicate elimination δ, aggregation operators, grouping γ, extended projection π, sorting τ, and outer joins.</p>
<p>The callout at the top of this lesson maps each one to its SQL clause. Two of them are special:</p>
<ul>
<li><strong>Aggregation operators</strong> (SUM, AVG …) are not used alone in algebra; they live inside γ ("used by the grouping operator", says the slide).</li>
<li><strong>τ</strong> is the only operator whose result is a <em>list</em>, not a set or bag — order matters only after τ, so it must be the last step (ORDER BY is the last clause of a SELECT).</li>
</ul>`,
        `<p class="y-chinh">🎯 Sáu phép mở rộng: loại trùng δ, các phép gộp, phép nhóm γ, phép chiếu mở rộng π, phép sắp xếp τ, và các phép nối ngoài.</p>
<p>Khung ở đầu bài đã nối mỗi phép với mệnh đề SQL của nó. Có hai phép đặc biệt:</p>
<ul>
<li><strong>Các phép gộp</strong> (aggregation — SUM, AVG …) không đứng một mình trong đại số; chúng nằm bên trong γ ("used by the grouping operator", slide viết).</li>
<li><strong>τ</strong> là phép duy nhất cho ra một <em>danh sách</em> (list), không phải tập hay túi — thứ tự chỉ có nghĩa sau τ, nên nó phải là bước cuối (ORDER BY là mệnh đề cuối của câu SELECT).</li>
</ul>`],
      [17, 'Duplicate Elimination δ',
        `<p class="y-chinh">🎯 δ(R) converts a bag into a set: each tuple is kept once. δ of {(1,2,2), (3,4,4), (1,2,2), (1,2,2)} is {(1,2,2), (3,4,4)}.</p>
<p class="nhan">Before: R has 4 rows, (1, 2, 2) three times. After:</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (1, 2, 2), (3, 4, 4), (1, 2, 2), (1, 2, 2);
SELECT DISTINCT * FROM R;      -- δ(R): one copy of each tuple</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>2</td></tr>
<tr><td>3</td><td>4</td><td>4</td></tr>
</tbody>
</table>
<p>δ is <code>DISTINCT</code>, applied to whole rows. With it we can write the set projection of lesson 2.B inside bag algebra: π<sub>set</sub>(R) = δ(π<sub>bag</sub>(R)) — which is literally <code>SELECT DISTINCT A, B FROM R</code>.</p>
<div class="pitfall">DISTINCT applies to the <strong>whole row</strong> of the SELECT list, not to the first column: <code>SELECT DISTINCT A, C</code> keeps (1, 2) and (1, 5) as two rows. And <code>SELECT DISTINCT(A), C</code> is the same thing — the brackets do nothing.</div>`,
        `<p class="y-chinh">🎯 δ(R) biến một túi thành một tập: mỗi bộ giữ một lần. δ của {(1,2,2), (3,4,4), (1,2,2), (1,2,2)} là {(1,2,2), (3,4,4)}.</p>
<p class="nhan">Trước: R có 4 dòng, (1, 2, 2) ba lần. Sau:</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (1, 2, 2), (3, 4, 4), (1, 2, 2), (1, 2, 2);
SELECT DISTINCT * FROM R;      -- mỗi bộ giữ một bản</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>2</td></tr>
<tr><td>3</td><td>4</td><td>4</td></tr>
</tbody>
</table>
<p>δ chính là <code>DISTINCT</code>, áp lên cả dòng. Có nó, ta viết được phép chiếu trên tập của bài 2.B bằng đại số trên túi: π<sub>tập</sub>(R) = δ(π<sub>túi</sub>(R)) — đúng từng chữ là <code>SELECT DISTINCT A, B FROM R</code>.</p>
<div class="pitfall">DISTINCT áp lên <strong>cả dòng</strong> của danh sách SELECT, không phải lên cột đầu tiên: <code>SELECT DISTINCT A, C</code> giữ (1, 2) và (1, 5) thành hai dòng. Và <code>SELECT DISTINCT(A), C</code> cũng y như vậy — cặp ngoặc chẳng có tác dụng gì.</div>`],
      [18, 'Aggregation Operators',
        `<p class="y-chinh">🎯 Aggregation operators summarize the values of one column into a single value; the five standard ones are SUM, AVG, MIN, MAX and COUNT.</p>
<table>
<thead><tr><th>Operator</th><th>Returns</th><th>Everyday question (café sales)</th></tr></thead>
<tbody>
<tr><td>SUM(x)</td><td>the total of the values</td><td>total revenue today</td></tr>
<tr><td>AVG(x)</td><td>the average</td><td>average price per cup</td></tr>
<tr><td>MIN(x) / MAX(x)</td><td>the smallest / largest value</td><td>cheapest / most expensive cup sold</td></tr>
<tr><td>COUNT(x)</td><td>how many values (NULLs not counted)</td><td>number of cups sold</td></tr>
</tbody>
</table>
<p>All five read the column as a <strong>bag</strong> — each copy counts. COUNT(*) counts rows; COUNT(x) counts rows where x is not NULL; COUNT(DISTINCT x) counts different values. SUM, AVG, MIN, MAX also ignore NULLs. The same five exist, with the same names, in SQL Server and PostgreSQL.</p>
<div class="pitfall">AVG is not SUM / COUNT(*) when there are NULLs: AVG ignores NULL rows, COUNT(*) does not. A column (10, NULL, 20) has AVG = 15, but SUM / COUNT(*) = 30 / 3 = 10.</div>`,
        `<p class="y-chinh">🎯 Các phép gộp (aggregation operators) tóm các giá trị của một cột thành một giá trị duy nhất; năm phép chuẩn là SUM, AVG, MIN, MAX và COUNT.</p>
<table>
<thead><tr><th>Phép</th><th>Trả về</th><th>Câu hỏi đời thường (bán cà phê)</th></tr></thead>
<tbody>
<tr><td>SUM(x)</td><td>tổng các giá trị</td><td>tổng doanh thu hôm nay</td></tr>
<tr><td>AVG(x)</td><td>trung bình</td><td>giá trung bình mỗi ly</td></tr>
<tr><td>MIN(x) / MAX(x)</td><td>giá trị nhỏ nhất / lớn nhất</td><td>ly rẻ nhất / đắt nhất đã bán</td></tr>
<tr><td>COUNT(x)</td><td>có bao nhiêu giá trị (không đếm NULL)</td><td>số ly đã bán</td></tr>
</tbody>
</table>
<p>Cả năm đọc cột như một <strong>túi</strong> — bản nào cũng được tính. COUNT(*) đếm dòng; COUNT(x) đếm các dòng mà x khác NULL; COUNT(DISTINCT x) đếm số giá trị khác nhau. SUM, AVG, MIN, MAX cũng bỏ qua NULL. Năm hàm này có mặt, cùng tên, trong cả SQL Server lẫn PostgreSQL.</p>
<div class="pitfall">Khi có NULL thì AVG không bằng SUM / COUNT(*): AVG bỏ qua dòng NULL, COUNT(*) thì không. Cột (10, NULL, 20) có AVG = 15, nhưng SUM / COUNT(*) = 30 / 3 = 10.</div>`],
      [19, 'Aggregation Operators - Example',
        `<p class="y-chinh">🎯 On R = {(1,2,2), (3,4,4), (1,2,2), (1,2,2)}: SUM(B) = 2+4+2+2 = 10, AVG(A) = (1+3+1+1)/4 = 1.5, MIN(A) = 1, MAX(B) = 4, COUNT(A) = 4.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (1, 2, 2), (3, 4, 4), (1, 2, 2), (1, 2, 2);
SELECT SUM(B)       AS sum_B,     -- 2 + 4 + 2 + 2
       AVG(A * 1.0) AS avg_A,     -- (1 + 3 + 1 + 1) / 4
       MIN(A)       AS min_A,
       MAX(B)       AS max_B,
       COUNT(A)     AS count_A
FROM R;
SELECT AVG(A) AS avg_A_int,              -- INT column ⇒ INT average: 6 / 4 = 1
       AVG(DISTINCT A * 1.0) AS avg_distinct_A,
       COUNT(DISTINCT A) AS count_distinct_A
FROM R;</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>sum_B</th><th>avg_A</th><th>min_A</th><th>max_B</th><th>count_A</th></tr></thead>
<tbody>
<tr><td>10</td><td>1.500000</td><td>1</td><td>4</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>avg_A_int</th><th>avg_distinct_A</th><th>count_distinct_A</th></tr></thead>
<tbody>
<tr><td>1</td><td>2.000000</td><td>2</td></tr>
</tbody>
</table>
<ul>
<li>The first result is the slide, value for value — every copy of (1, 2, 2) is counted, because aggregation works on the bag.</li>
<li>Second result: the SQL Server trap again — <code>AVG(A)</code> on an INT column returns <strong>1</strong>. Write <code>AVG(A * 1.0)</code> or <code>AVG(CAST(A AS DECIMAL(10,2)))</code>.</li>
<li><code>AVG(DISTINCT …)</code> and <code>COUNT(DISTINCT A)</code> aggregate the <em>set</em> δ(π<sub>A</sub>(R)) = {1, 3}: average 2, count 2 — the "set" answers of slide 6.</li>
</ul>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the same query needs no <code>* 1.0</code>:
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT, c INT);
INSERT INTO r VALUES (1, 2, 2), (3, 4, 4), (1, 2, 2), (1, 2, 2);
SELECT SUM(b) AS sum_b, AVG(a) AS avg_a, MIN(a) AS min_a, MAX(b) AS max_b, COUNT(a) AS count_a
FROM r;</code></pre>
<div class="out">INSERT 0 4</div>
<table>
<thead><tr><th>sum_b</th><th>avg_a</th><th>min_a</th><th>max_b</th><th>count_a</th></tr></thead>
<tbody>
<tr><td>10</td><td>1.5000000000000000</td><td>1</td><td>4</td><td>4</td></tr>
</tbody>
</table>
avg_a = 1.5000000000000000 (type numeric). Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-1-ham-tong-hop">PostgreSQL 6.1 — aggregate functions</a>.</div>`,
        `<p class="y-chinh">🎯 Trên R = {(1,2,2), (3,4,4), (1,2,2), (1,2,2)}: SUM(B) = 2+4+2+2 = 10, AVG(A) = (1+3+1+1)/4 = 1.5, MIN(A) = 1, MAX(B) = 4, COUNT(A) = 4.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (1, 2, 2), (3, 4, 4), (1, 2, 2), (1, 2, 2);
SELECT SUM(B)       AS sum_B,     -- 2 + 4 + 2 + 2
       AVG(A * 1.0) AS avg_A,     -- (1 + 3 + 1 + 1) / 4
       MIN(A)       AS min_A,
       MAX(B)       AS max_B,
       COUNT(A)     AS count_A
FROM R;
SELECT AVG(A) AS avg_A_int,              -- cột INT ⇒ trung bình INT
       AVG(DISTINCT A * 1.0) AS avg_distinct_A,
       COUNT(DISTINCT A) AS count_distinct_A
FROM R;</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>sum_B</th><th>avg_A</th><th>min_A</th><th>max_B</th><th>count_A</th></tr></thead>
<tbody>
<tr><td>10</td><td>1.500000</td><td>1</td><td>4</td><td>4</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>avg_A_int</th><th>avg_distinct_A</th><th>count_distinct_A</th></tr></thead>
<tbody>
<tr><td>1</td><td>2.000000</td><td>2</td></tr>
</tbody>
</table>
<ul>
<li>Kết quả đầu khớp slide từng giá trị — mọi bản của (1, 2, 2) đều được tính, vì phép gộp làm trên túi.</li>
<li>Kết quả thứ hai: lại cái bẫy của SQL Server — <code>AVG(A)</code> trên cột INT trả về <strong>1</strong>. Hãy viết <code>AVG(A * 1.0)</code> hoặc <code>AVG(CAST(A AS DECIMAL(10,2)))</code>.</li>
<li><code>AVG(DISTINCT …)</code> và <code>COUNT(DISTINCT A)</code> gộp trên <em>tập</em> δ(π<sub>A</sub>(R)) = {1, 3}: trung bình 2, đếm 2 — chính là các đáp án "theo tập" của slide 6.</li>
</ul>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> cùng câu đó không cần <code>* 1.0</code>:
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT, c INT);
INSERT INTO r VALUES (1, 2, 2), (3, 4, 4), (1, 2, 2), (1, 2, 2);
SELECT SUM(b) AS sum_b, AVG(a) AS avg_a, MIN(a) AS min_a, MAX(b) AS max_b, COUNT(a) AS count_a
FROM r;</code></pre>
<div class="out">INSERT 0 4</div>
<table>
<thead><tr><th>sum_b</th><th>avg_a</th><th>min_a</th><th>max_b</th><th>count_a</th></tr></thead>
<tbody>
<tr><td>10</td><td>1.5000000000000000</td><td>1</td><td>4</td><td>4</td></tr>
</tbody>
</table>
avg_a = 1.5000000000000000 (kiểu numeric). Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-1-ham-tong-hop">PostgreSQL 6.1 — hàm tổng hợp</a>.</div>`],
      [20, 'How do we ... count the stars of each movie',
        `<p class="y-chinh">🎯 Question: the total number of stars of each movie. Without grouping we would need one temporary relation per movie (three here) and a COUNT on each — "so complicated".</p>
<p class="nhan">Before: the Movies relation of the slide (one row per film and star)</p>
<pre><code class="language-sql">CREATE TABLE Movies (title VARCHAR(30), year INT, length INT, genre VARCHAR(10),
                     studioName VARCHAR(20), starName VARCHAR(30));
INSERT INTO Movies VALUES
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Carrie Fisher'),
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Mark Hamill'),
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Harrison Ford'),
  ('Gone With The Wind', 1939, 231, 'drama',  'MGM',       'Vivien Leigh'),
  ('Wayne''s World',     1992,  95, 'comedy', 'Paramount', 'Dana Carvey'),
  ('Wayne''s World',     1992,  95, 'comedy', 'Paramount', 'Mike Meyers');</code></pre>
<p>The "complicated" way, literally — one σ + COUNT per film:</p>
<pre><code class="language-sql">CREATE TABLE Movies (title VARCHAR(30), year INT, length INT, genre VARCHAR(10),
                     studioName VARCHAR(20), starName VARCHAR(30));
INSERT INTO Movies VALUES
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Carrie Fisher'),
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Mark Hamill'),
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Harrison Ford'),
  ('Gone With The Wind', 1939, 231, 'drama',  'MGM',       'Vivien Leigh'),
  ('Wayne''s World',     1992,  95, 'comedy', 'Paramount', 'Dana Carvey'),
  ('Wayne''s World',     1992,  95, 'comedy', 'Paramount', 'Mike Meyers');
-- the "complicated" way: one temporary relation per movie, then COUNT
SELECT COUNT(starName) AS stars_of_star_wars   FROM Movies WHERE title = 'Star Wars'          AND year = 1977;
SELECT COUNT(starName) AS stars_of_gone_with   FROM Movies WHERE title = 'Gone With The Wind' AND year = 1939;
SELECT COUNT(starName) AS stars_of_waynes      FROM Movies WHERE title = 'Wayne''s World'     AND year = 1992;</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>stars_of_star_wars</th></tr></thead>
<tbody>
<tr><td>3</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>stars_of_gone_with</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>stars_of_waynes</th></tr></thead>
<tbody>
<tr><td>2</td></tr>
</tbody>
</table>
<p>It works, but you must know the list of films in advance and write one query each; with 10,000 films it is impossible. What we want is one operator that splits the relation into groups by itself — slide 21.</p>`,
        `<p class="y-chinh">🎯 Câu hỏi: tổng số ngôi sao của mỗi phim. Không có phép nhóm thì phải tạo một quan hệ tạm cho mỗi phim (ở đây là ba) rồi COUNT từng cái — "so complicated" (rườm rà quá).</p>
<p class="nhan">Trước: quan hệ Movies của slide (mỗi dòng một cặp phim – ngôi sao)</p>
<pre><code class="language-sql">CREATE TABLE Movies (title VARCHAR(30), year INT, length INT, genre VARCHAR(10),
                     studioName VARCHAR(20), starName VARCHAR(30));
INSERT INTO Movies VALUES
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Carrie Fisher'),
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Mark Hamill'),
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Harrison Ford'),
  ('Gone With The Wind', 1939, 231, 'drama',  'MGM',       'Vivien Leigh'),
  ('Wayne''s World',     1992,  95, 'comedy', 'Paramount', 'Dana Carvey'),
  ('Wayne''s World',     1992,  95, 'comedy', 'Paramount', 'Mike Meyers');</code></pre>
<p>Cách "rườm rà", làm đúng từng chữ — mỗi phim một σ + COUNT:</p>
<pre><code class="language-sql">CREATE TABLE Movies (title VARCHAR(30), year INT, length INT, genre VARCHAR(10),
                     studioName VARCHAR(20), starName VARCHAR(30));
INSERT INTO Movies VALUES
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Carrie Fisher'),
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Mark Hamill'),
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Harrison Ford'),
  ('Gone With The Wind', 1939, 231, 'drama',  'MGM',       'Vivien Leigh'),
  ('Wayne''s World',     1992,  95, 'comedy', 'Paramount', 'Dana Carvey'),
  ('Wayne''s World',     1992,  95, 'comedy', 'Paramount', 'Mike Meyers');
-- cách "rườm rà": mỗi phim một quan hệ tạm, rồi COUNT
SELECT COUNT(starName) AS stars_of_star_wars   FROM Movies WHERE title = 'Star Wars'          AND year = 1977;
SELECT COUNT(starName) AS stars_of_gone_with   FROM Movies WHERE title = 'Gone With The Wind' AND year = 1939;
SELECT COUNT(starName) AS stars_of_waynes      FROM Movies WHERE title = 'Wayne''s World'     AND year = 1992;</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>stars_of_star_wars</th></tr></thead>
<tbody>
<tr><td>3</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>stars_of_gone_with</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>stars_of_waynes</th></tr></thead>
<tbody>
<tr><td>2</td></tr>
</tbody>
</table>
<p>Chạy được, nhưng phải biết trước danh sách phim và mỗi phim viết một câu; có 10.000 phim thì bó tay. Thứ ta cần là một phép tự chia quan hệ thành các nhóm — slide 21.</p>`],
      [21, 'So how we do? - group, then aggregate',
        `<p class="y-chinh">🎯 The answer: first group the tuples of Movies (one group per film), then apply COUNT to each group independently — that is the grouping operator.</p>
<table>
<thead><tr><th>Group (title, year)</th><th>Rows in the group</th><th>COUNT(starName)</th></tr></thead>
<tbody>
<tr><td>Star Wars, 1977</td><td>Carrie Fisher · Mark Hamill · Harrison Ford</td><td>3</td></tr>
<tr><td>Gone With The Wind, 1939</td><td>Vivien Leigh</td><td>1</td></tr>
<tr><td>Wayne's World, 1992</td><td>Dana Carvey · Mike Meyers</td><td>2</td></tr>
</tbody>
</table>
<p>Two steps: <strong>partition</strong> (sort the rows into piles by title and year) and <strong>aggregate</strong> (one number per pile). The piles never appear in the result — each pile becomes exactly one output row. Slide 23 runs it in SQL.</p>
<p class="meo">🧠 Think of a teacher returning exams: she first makes one pile per class (group), then writes the number of papers on each pile (COUNT).</p>`,
        `<p class="y-chinh">🎯 Lời giải: trước hết nhóm các bộ của Movies (mỗi phim một nhóm), rồi áp COUNT lên từng nhóm một cách độc lập — đó là phép nhóm (grouping operator).</p>
<table>
<thead><tr><th>Nhóm (title, year)</th><th>Các dòng trong nhóm</th><th>COUNT(starName)</th></tr></thead>
<tbody>
<tr><td>Star Wars, 1977</td><td>Carrie Fisher · Mark Hamill · Harrison Ford</td><td>3</td></tr>
<tr><td>Gone With The Wind, 1939</td><td>Vivien Leigh</td><td>1</td></tr>
<tr><td>Wayne's World, 1992</td><td>Dana Carvey · Mike Meyers</td><td>2</td></tr>
</tbody>
</table>
<p>Hai bước: <strong>chia nhóm</strong> (xếp các dòng thành từng chồng theo title và year) và <strong>gộp</strong> (mỗi chồng một con số). Các chồng không bao giờ hiện ra trong kết quả — mỗi chồng thành đúng một dòng đầu ra. Slide 23 chạy nó bằng SQL.</p>
<p class="meo">🧠 Hình dung cô giáo trả bài thi: trước hết xếp mỗi lớp một chồng (nhóm), rồi ghi số bài lên từng chồng (COUNT).</p>`],
      [22, 'Grouping and Grouping Operator γ',
        `<p class="y-chinh">🎯 γ<sub>L</sub>(R): L lists grouping attributes (R is partitioned by them) and aggregations applied to aggregated attributes; the result has one tuple per group, holding the group's grouping values and the aggregates over the group.</p>
<ul>
<li><strong>Grouping attribute</strong> — an attribute of R in L; rows with equal values on all grouping attributes form one group. SQL: the columns after GROUP BY.</li>
<li><strong>Aggregated attribute</strong> — an attribute inside an aggregation in L, such as starName in COUNT(starName). SQL: the aggregate functions in the SELECT list.</li>
<li>Result schema = grouping attributes + one attribute per aggregation (renamed with → if you like).</li>
</ul>
<div class="pitfall">In SQL, a column in the SELECT list that is neither in GROUP BY nor inside an aggregate is an error on SQL Server ("… is invalid in the select list because it is not contained in either an aggregate function or the GROUP BY clause"). In γ it cannot even be written: L only allows grouping attributes and aggregations.</div>
<p class="meo">🧠 γ with no grouping attribute (L = only aggregations) makes the whole relation one group — that is slide 19's <code>SELECT SUM(B), … FROM R</code> with no GROUP BY.</p>`,
        `<p class="y-chinh">🎯 γ<sub>L</sub>(R): L liệt kê các thuộc tính nhóm (R được chia nhóm theo chúng) và các phép gộp áp lên thuộc tính được gộp; kết quả có một bộ cho mỗi nhóm, gồm giá trị các thuộc tính nhóm và các giá trị gộp trên nhóm đó.</p>
<ul>
<li><strong>Thuộc tính nhóm (grouping attribute)</strong> — một thuộc tính của R có trong L; các dòng bằng nhau trên mọi thuộc tính nhóm tạo thành một nhóm. SQL: các cột sau GROUP BY.</li>
<li><strong>Thuộc tính được gộp (aggregated attribute)</strong> — thuộc tính nằm trong một phép gộp của L, như starName trong COUNT(starName). SQL: các hàm gộp trong danh sách SELECT.</li>
<li>Lược đồ kết quả = các thuộc tính nhóm + mỗi phép gộp một thuộc tính (đặt tên bằng → nếu muốn).</li>
</ul>
<div class="pitfall">Trong SQL, một cột trong danh sách SELECT mà không có trong GROUP BY và cũng không nằm trong hàm gộp là lỗi trên SQL Server ("… is invalid in the select list because it is not contained in either an aggregate function or the GROUP BY clause"). Trong γ thì còn không viết ra được: L chỉ cho phép thuộc tính nhóm và phép gộp.</div>
<p class="meo">🧠 γ không có thuộc tính nhóm nào (L chỉ gồm phép gộp) thì cả quan hệ là một nhóm — chính là câu <code>SELECT SUM(B), … FROM R</code> không có GROUP BY ở slide 19.</p>`],
      [23, 'Grouping Operator - Example',
        `<p class="y-chinh">🎯 γ<sub>title→movieTitle, year→movieYear, COUNT(starName)→totalStars</sub>(Movies) gives Star Wars 1977 → 3, Gone With The Wind 1939 → 1, Wayne's World 1992 → 2.</p>
<pre><code class="language-sql">CREATE TABLE Movies (title VARCHAR(30), year INT, length INT, genre VARCHAR(10),
                     studioName VARCHAR(20), starName VARCHAR(30));
INSERT INTO Movies VALUES
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Carrie Fisher'),
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Mark Hamill'),
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Harrison Ford'),
  ('Gone With The Wind', 1939, 231, 'drama',  'MGM',       'Vivien Leigh'),
  ('Wayne''s World',     1992,  95, 'comedy', 'Paramount', 'Dana Carvey'),
  ('Wayne''s World',     1992,  95, 'comedy', 'Paramount', 'Mike Meyers');
-- γ title→movieTitle, year→movieYear, COUNT(starName)→totalStars (Movies)
SELECT title           AS movieTitle,
       year            AS movieYear,
       COUNT(starName) AS totalStars
FROM Movies
GROUP BY title, year
ORDER BY totalStars DESC;</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>movieTitle</th><th>movieYear</th><th>totalStars</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>3</td></tr>
<tr><td>Wayne's World</td><td>1992</td><td>2</td></tr>
<tr><td>Gone With The Wind</td><td>1939</td><td>1</td></tr>
</tbody>
</table>
<p class="nhan">Reading the γ subscript as SQL</p>
<ul>
<li><code>title → movieTitle</code> — grouping attribute title, renamed: <code>title AS movieTitle</code> in SELECT, <code>title</code> in GROUP BY.</li>
<li><code>year → movieYear</code> — the second grouping attribute. Grouping by title <em>and</em> year matters: two different films with the same title (remakes) stay apart.</li>
<li><code>COUNT(starName) → totalStars</code> — the aggregation: <code>COUNT(starName) AS totalStars</code>.</li>
<li><code>ORDER BY totalStars DESC</code> is τ, added only to fix the order (γ itself gives a bag without order).</li>
</ul>
<p>The slide writes "Gone With The <em>Wine</em>" in the result — a typo for Wind; the data says Wind.</p>`,
        `<p class="y-chinh">🎯 γ<sub>title→movieTitle, year→movieYear, COUNT(starName)→totalStars</sub>(Movies) cho Star Wars 1977 → 3, Gone With The Wind 1939 → 1, Wayne's World 1992 → 2.</p>
<pre><code class="language-sql">CREATE TABLE Movies (title VARCHAR(30), year INT, length INT, genre VARCHAR(10),
                     studioName VARCHAR(20), starName VARCHAR(30));
INSERT INTO Movies VALUES
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Carrie Fisher'),
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Mark Hamill'),
  ('Star Wars',          1977, 124, 'SciFi',  'Fox',       'Harrison Ford'),
  ('Gone With The Wind', 1939, 231, 'drama',  'MGM',       'Vivien Leigh'),
  ('Wayne''s World',     1992,  95, 'comedy', 'Paramount', 'Dana Carvey'),
  ('Wayne''s World',     1992,  95, 'comedy', 'Paramount', 'Mike Meyers');
-- γ title→movieTitle, year→movieYear, COUNT(starName)→totalStars (Movies)
SELECT title           AS movieTitle,
       year            AS movieYear,
       COUNT(starName) AS totalStars
FROM Movies
GROUP BY title, year
ORDER BY totalStars DESC;</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>movieTitle</th><th>movieYear</th><th>totalStars</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>3</td></tr>
<tr><td>Wayne's World</td><td>1992</td><td>2</td></tr>
<tr><td>Gone With The Wind</td><td>1939</td><td>1</td></tr>
</tbody>
</table>
<p class="nhan">Đọc chỉ số dưới của γ thành SQL</p>
<ul>
<li><code>title → movieTitle</code> — thuộc tính nhóm title, đổi tên: <code>title AS movieTitle</code> trong SELECT, <code>title</code> trong GROUP BY.</li>
<li><code>year → movieYear</code> — thuộc tính nhóm thứ hai. Nhóm theo title <em>và</em> year là quan trọng: hai phim khác nhau trùng tên (bản làm lại) vẫn tách riêng.</li>
<li><code>COUNT(starName) → totalStars</code> — phép gộp: <code>COUNT(starName) AS totalStars</code>.</li>
<li><code>ORDER BY totalStars DESC</code> là τ, thêm vào chỉ để cố định thứ tự (bản thân γ cho ra một túi không có thứ tự).</li>
</ul>
<p>Slide ghi "Gone With The <em>Wine</em>" trong bảng kết quả — lỗi gõ của Wind; dữ liệu ghi Wind.</p>`],
      [24, 'Extending the Projection Operator',
        `<p class="y-chinh">🎯 Extended projection π<sub>L</sub>(R) allows in L: a plain attribute of R, a renaming x → y, or an expression E → z computed from attributes, constants and arithmetic or string operators.</p>
<table>
<thead><tr><th>Element of L</th><th>Meaning</th><th>SQL</th></tr></thead>
<tbody>
<tr><td>A</td><td>keep attribute A</td><td>SELECT A</td></tr>
<tr><td>x → y</td><td>keep x, call it y</td><td>SELECT x AS y</td></tr>
<tr><td>E → z</td><td>compute E for every row, call the result z</td><td>SELECT B + C AS z, price * 1.1 AS vat_price</td></tr>
</tbody>
</table>
<p>This is what the list after SELECT really is: not only column names but any expression, one output value per input row. It is still a <em>projection</em> on a bag: one row in, one row out, duplicates kept (slide 25 shows two identical results).</p>
<p class="meo">🧠 Extended π works <strong>per row</strong>; aggregation works <strong>per group</strong>. <code>SELECT price * 2</code> doubles each price; <code>SELECT SUM(price)</code> collapses the rows.</p>`,
        `<p class="y-chinh">🎯 Phép chiếu mở rộng π<sub>L</sub>(R) cho phép trong L: một thuộc tính của R, một phép đổi tên x → y, hoặc một biểu thức E → z tính từ các thuộc tính, hằng số, phép toán số học hay phép toán chuỗi.</p>
<table>
<thead><tr><th>Phần tử của L</th><th>Nghĩa</th><th>SQL</th></tr></thead>
<tbody>
<tr><td>A</td><td>giữ thuộc tính A</td><td>SELECT A</td></tr>
<tr><td>x → y</td><td>giữ x, gọi là y</td><td>SELECT x AS y</td></tr>
<tr><td>E → z</td><td>tính E cho từng dòng, gọi kết quả là z</td><td>SELECT B + C AS z, price * 1.1 AS vat_price</td></tr>
</tbody>
</table>
<p>Đây mới là bản chất của danh sách sau SELECT: không chỉ là tên cột mà là biểu thức bất kỳ, mỗi dòng vào cho một giá trị ra. Nó vẫn là một phép <em>chiếu</em> trên túi: một dòng vào, một dòng ra, giữ dòng trùng (slide 25 cho thấy hai kết quả giống nhau).</p>
<p class="meo">🧠 π mở rộng làm <strong>theo từng dòng</strong>; phép gộp làm <strong>theo từng nhóm</strong>. <code>SELECT price * 2</code> nhân đôi từng giá; <code>SELECT SUM(price)</code> gộp các dòng lại.</p>`],
      [25, 'Extending the Projection Operator - Example',
        `<p class="y-chinh">🎯 π<sub>A, B+C→X</sub>(R) on R = {(0,1,2), (0,1,2), (3,4,5)} gives {(0,3), (0,3), (3,9)} — the duplicate is kept.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (0, 1, 2), (0, 1, 2), (3, 4, 5);
-- π A, B+C→X (R)
SELECT A, B + C AS X
FROM R;
-- an expression on strings: T-SQL joins strings with +
CREATE TABLE Movies (title VARCHAR(30), year INT, length INT);
INSERT INTO Movies VALUES ('Star Wars', 1977, 124), ('Wayne''s World', 1992, 95);
SELECT title + ' (' + CAST(year AS VARCHAR(4)) + ')' AS label,
       length / 60.0 AS hours
FROM Movies;</code></pre>
<div class="out">(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>X</th></tr></thead>
<tbody>
<tr><td>0</td><td>3</td></tr>
<tr><td>0</td><td>3</td></tr>
<tr><td>3</td><td>9</td></tr>
</tbody>
</table>
<div class="out">(2 rows affected)</div>
<table>
<thead><tr><th>label</th><th>hours</th></tr></thead>
<tbody>
<tr><td>Star Wars (1977)</td><td>2.066666</td></tr>
<tr><td>Wayne's World (1992)</td><td>1.583333</td></tr>
</tbody>
</table>
<p>First result: exactly the slide. B + C is computed row by row (1 + 2 = 3, 4 + 5 = 9) and named X with <code>AS X</code>. The second result shows the string version of "E → z": in T-SQL strings are joined with <code>+</code>, and a number must first be turned into text with <code>CAST(year AS VARCHAR(4))</code>, otherwise SQL Server tries to add the text to the number and fails. <code>length / 60.0</code> is an arithmetic expression (dividing by 60.0 rather than 60 avoids integer division).</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> strings are joined with <code>||</code>, and the number is converted automatically:
<pre><code class="language-sql">CREATE TABLE movies (title VARCHAR(30), year INT, length INT);
INSERT INTO movies VALUES ('Star Wars', 1977, 124), ('Wayne''s World', 1992, 95);
SELECT title || ' (' || year || ')' AS label,    -- || joins strings; year is converted by itself
       round(length / 60.0, 2) AS hours
FROM movies;</code></pre>
<div class="out">INSERT 0 2</div>
<table>
<thead><tr><th>label</th><th>hours</th></tr></thead>
<tbody>
<tr><td>Star Wars (1977)</td><td>2.07</td></tr>
<tr><td>Wayne's World (1992)</td><td>1.58</td></tr>
</tbody>
</table>
<code>+</code> between two strings is an error on PostgreSQL, <code>||</code> does not concatenate on SQL Server — one of the most common differences when you move code between them. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-2-text">PostgreSQL 2.2 — text types and functions</a>.</div>`,
        `<p class="y-chinh">🎯 π<sub>A, B+C→X</sub>(R) trên R = {(0,1,2), (0,1,2), (3,4,5)} cho {(0,3), (0,3), (3,9)} — dòng trùng được giữ.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (0, 1, 2), (0, 1, 2), (3, 4, 5);
-- π A, B+C→X (R)
SELECT A, B + C AS X
FROM R;
-- biểu thức trên chuỗi: T-SQL nối chuỗi bằng +
CREATE TABLE Movies (title VARCHAR(30), year INT, length INT);
INSERT INTO Movies VALUES ('Star Wars', 1977, 124), ('Wayne''s World', 1992, 95);
SELECT title + ' (' + CAST(year AS VARCHAR(4)) + ')' AS label,
       length / 60.0 AS hours
FROM Movies;</code></pre>
<div class="out">(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>X</th></tr></thead>
<tbody>
<tr><td>0</td><td>3</td></tr>
<tr><td>0</td><td>3</td></tr>
<tr><td>3</td><td>9</td></tr>
</tbody>
</table>
<div class="out">(2 rows affected)</div>
<table>
<thead><tr><th>label</th><th>hours</th></tr></thead>
<tbody>
<tr><td>Star Wars (1977)</td><td>2.066666</td></tr>
<tr><td>Wayne's World (1992)</td><td>1.583333</td></tr>
</tbody>
</table>
<p>Kết quả đầu: đúng slide. B + C được tính từng dòng (1 + 2 = 3, 4 + 5 = 9) và đặt tên X bằng <code>AS X</code>. Kết quả thứ hai là bản chuỗi của "E → z": trong T-SQL chuỗi được nối bằng <code>+</code>, và số phải đổi sang chữ trước bằng <code>CAST(year AS VARCHAR(4))</code>, nếu không SQL Server sẽ cố cộng chữ với số và báo lỗi. <code>length / 60.0</code> là một biểu thức số học (chia cho 60.0 thay vì 60 để tránh phép chia nguyên).</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> chuỗi được nối bằng <code>||</code>, và số được tự động đổi sang chữ:
<pre><code class="language-sql">CREATE TABLE movies (title VARCHAR(30), year INT, length INT);
INSERT INTO movies VALUES ('Star Wars', 1977, 124), ('Wayne''s World', 1992, 95);
SELECT title || ' (' || year || ')' AS label,    -- || nối chuỗi; year tự đổi sang chuỗi
       round(length / 60.0, 2) AS hours
FROM movies;</code></pre>
<div class="out">INSERT 0 2</div>
<table>
<thead><tr><th>label</th><th>hours</th></tr></thead>
<tbody>
<tr><td>Star Wars (1977)</td><td>2.07</td></tr>
<tr><td>Wayne's World (1992)</td><td>1.58</td></tr>
</tbody>
</table>
<code>+</code> giữa hai chuỗi là lỗi trên PostgreSQL, còn <code>||</code> không nối chuỗi trên SQL Server — một trong những khác biệt hay gặp nhất khi chuyển mã giữa hai hệ. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-2-text">PostgreSQL 2.2 — kiểu chuỗi và hàm chuỗi</a>.</div>`],
      [26, 'The Sorting Operator τ',
        `<p class="y-chinh">🎯 τ<sub>L</sub>(R) sorts the tuples of R by the attributes in L (first by the first one, ties broken by the next): τ<sub>A</sub>(R) orders the rows 1, 2, 3, 4 by A.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (1, 1, 2), (4, 1, 2), (3, 4, 5), (2, 2, 2);
SELECT * FROM R ORDER BY A;              -- τ A (R)
SELECT * FROM R ORDER BY B DESC, A;      -- τ B, A: by B (descending), ties broken by A
INSERT INTO R VALUES (NULL, 9, 9);
SELECT * FROM R ORDER BY A;              -- SQL Server puts NULL FIRST</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>2</td></tr>
<tr><td>2</td><td>2</td><td>2</td></tr>
<tr><td>3</td><td>4</td><td>5</td></tr>
<tr><td>4</td><td>1</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
<tbody>
<tr><td>3</td><td>4</td><td>5</td></tr>
<tr><td>2</td><td>2</td><td>2</td></tr>
<tr><td>1</td><td>1</td><td>2</td></tr>
<tr><td>4</td><td>1</td><td>2</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
<tbody>
<tr><td><em>NULL</em></td><td>9</td><td>9</td></tr>
<tr><td>1</td><td>1</td><td>2</td></tr>
<tr><td>2</td><td>2</td><td>2</td></tr>
<tr><td>3</td><td>4</td><td>5</td></tr>
<tr><td>4</td><td>1</td><td>2</td></tr>
</tbody>
</table>
<ul>
<li>First result: τ<sub>A</sub>(R), the slide's figure. <code>ORDER BY A</code> sorts ascending (smallest first) by default.</li>
<li>Second: τ<sub>B,A</sub> with B descending — two rows have B = 1, and the tie is broken by A (1 before 4).</li>
<li>Third: after adding a row with A = NULL, SQL Server puts NULL <strong>first</strong> in ascending order (it treats NULL as smaller than any value).</li>
</ul>
<p>τ is special: its result is a list, and any operator applied after it would forget the order again. That is why ORDER BY is allowed only at the very end of a query (SQL Server even refuses ORDER BY inside a sub-query or view without TOP).</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> NULL is treated as <em>larger</em> than any value, so it goes <strong>last</strong> in ascending order — the opposite of SQL Server; <code>NULLS FIRST</code> / <code>NULLS LAST</code> set it explicitly:
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT, c INT);
INSERT INTO r VALUES (1, 1, 2), (4, 1, 2), (3, 4, 5), (2, 2, 2), (NULL, 9, 9);
SELECT * FROM r ORDER BY a;                -- PostgreSQL puts NULL LAST
SELECT * FROM r ORDER BY a NULLS FIRST;    -- ask for SQL Server's order explicitly</code></pre>
<div class="out">INSERT 0 5</div>
<table>
<thead><tr><th>a</th><th>b</th><th>c</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>2</td></tr>
<tr><td>2</td><td>2</td><td>2</td></tr>
<tr><td>3</td><td>4</td><td>5</td></tr>
<tr><td>4</td><td>1</td><td>2</td></tr>
<tr><td><em>NULL</em></td><td>9</td><td>9</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>a</th><th>b</th><th>c</th></tr></thead>
<tbody>
<tr><td><em>NULL</em></td><td>9</td><td>9</td></tr>
<tr><td>1</td><td>1</td><td>2</td></tr>
<tr><td>2</td><td>2</td><td>2</td></tr>
<tr><td>3</td><td>4</td><td>5</td></tr>
<tr><td>4</td><td>1</td><td>2</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT, DISTINCT</a>.</div>`,
        `<p class="y-chinh">🎯 τ<sub>L</sub>(R) sắp xếp các bộ của R theo các thuộc tính trong L (trước theo thuộc tính đầu, bằng nhau thì theo thuộc tính kế): τ<sub>A</sub>(R) xếp các dòng 1, 2, 3, 4 theo A.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (1, 1, 2), (4, 1, 2), (3, 4, 5), (2, 2, 2);
SELECT * FROM R ORDER BY A;              -- τ A (R)
SELECT * FROM R ORDER BY B DESC, A;      -- theo B (giảm dần), bằng nhau thì theo A
INSERT INTO R VALUES (NULL, 9, 9);
SELECT * FROM R ORDER BY A;              -- SQL Server đặt NULL LÊN ĐẦU</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>2</td></tr>
<tr><td>2</td><td>2</td><td>2</td></tr>
<tr><td>3</td><td>4</td><td>5</td></tr>
<tr><td>4</td><td>1</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
<tbody>
<tr><td>3</td><td>4</td><td>5</td></tr>
<tr><td>2</td><td>2</td><td>2</td></tr>
<tr><td>1</td><td>1</td><td>2</td></tr>
<tr><td>4</td><td>1</td><td>2</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
<tbody>
<tr><td><em>NULL</em></td><td>9</td><td>9</td></tr>
<tr><td>1</td><td>1</td><td>2</td></tr>
<tr><td>2</td><td>2</td><td>2</td></tr>
<tr><td>3</td><td>4</td><td>5</td></tr>
<tr><td>4</td><td>1</td><td>2</td></tr>
</tbody>
</table>
<ul>
<li>Kết quả đầu: τ<sub>A</sub>(R), đúng hình của slide. <code>ORDER BY A</code> mặc định sắp tăng dần (nhỏ trước).</li>
<li>Thứ hai: τ<sub>B,A</sub> với B giảm dần — hai dòng có B = 1, và được phân định bằng A (1 trước 4).</li>
<li>Thứ ba: thêm một dòng A = NULL, SQL Server đặt NULL <strong>lên đầu</strong> khi sắp tăng dần (nó coi NULL nhỏ hơn mọi giá trị).</li>
</ul>
<p>τ đặc biệt: kết quả của nó là một danh sách, và phép nào áp sau nó cũng sẽ quên thứ tự đi. Vì vậy ORDER BY chỉ được đặt ở cuối cùng câu truy vấn (SQL Server còn từ chối ORDER BY trong truy vấn con hay view nếu không có TOP).</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> NULL được coi là <em>lớn hơn</em> mọi giá trị, nên nằm <strong>cuối</strong> khi sắp tăng dần — ngược với SQL Server; <code>NULLS FIRST</code> / <code>NULLS LAST</code> đặt rõ ý muốn:
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT, c INT);
INSERT INTO r VALUES (1, 1, 2), (4, 1, 2), (3, 4, 5), (2, 2, 2), (NULL, 9, 9);
SELECT * FROM r ORDER BY a;                -- PostgreSQL đặt NULL XUỐNG CUỐI
SELECT * FROM r ORDER BY a NULLS FIRST;    -- xin đúng thứ tự của SQL Server</code></pre>
<div class="out">INSERT 0 5</div>
<table>
<thead><tr><th>a</th><th>b</th><th>c</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>2</td></tr>
<tr><td>2</td><td>2</td><td>2</td></tr>
<tr><td>3</td><td>4</td><td>5</td></tr>
<tr><td>4</td><td>1</td><td>2</td></tr>
<tr><td><em>NULL</em></td><td>9</td><td>9</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>a</th><th>b</th><th>c</th></tr></thead>
<tbody>
<tr><td><em>NULL</em></td><td>9</td><td>9</td></tr>
<tr><td>1</td><td>1</td><td>2</td></tr>
<tr><td>2</td><td>2</td><td>2</td></tr>
<tr><td>3</td><td>4</td><td>5</td></tr>
<tr><td>4</td><td>1</td><td>2</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT, DISTINCT</a>.</div>`],
      [27, 'Outer joins - dangling tuples',
        `<p class="y-chinh">🎯 A natural join may leave tuples that match no tuple of the other relation — dangling tuples — and they simply vanish: R ⋈ S below has 2 rows, and 3 input tuples are lost.</p>
<p class="nhan">Before: R(A, B, C) = (1,2,3), (4,5,6), (7,8,9) · S(B, C, D) = (2,3,10), (2,3,11), (6,7,12). After R ⋈ S, and the dangling tuples:</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
CREATE TABLE S (B INT, C INT, D INT);
INSERT INTO R VALUES (1, 2, 3), (4, 5, 6), (7, 8, 9);
INSERT INTO S VALUES (2, 3, 10), (2, 3, 11), (6, 7, 12);
-- R ⋈ S (natural join on B and C)
SELECT R.A, R.B, R.C, S.D
FROM R JOIN S ON R.B = S.B AND R.C = S.C;
-- dangling tuples of R: no partner in S
SELECT * FROM R
WHERE NOT EXISTS (SELECT * FROM S WHERE S.B = R.B AND S.C = R.C);
-- dangling tuples of S
SELECT * FROM S
WHERE NOT EXISTS (SELECT * FROM R WHERE R.B = S.B AND R.C = S.C);</code></pre>
<div class="out">(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td><td>10</td></tr>
<tr><td>1</td><td>2</td><td>3</td><td>11</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
<tbody>
<tr><td>4</td><td>5</td><td>6</td></tr>
<tr><td>7</td><td>8</td><td>9</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>6</td><td>7</td><td>12</td></tr>
</tbody>
</table>
<p>The common attributes are B and C, so both must be equal. Only (1, 2, 3) of R finds partners — two of them, (2, 3, 10) and (2, 3, 11). (4, 5, 6) and (7, 8, 9) of R and (6, 7, 12) of S have no partner. <code>NOT EXISTS (…)</code> in the last two queries means "there is no row in the other table with the same B and C".</p>
<p class="dap-an">✅ <strong>"What do you consider?"</strong> The join lost information: from its result you cannot tell that A = 4 or A = 7 exist. Real question: "list all customers with their orders" — a customer with no order would disappear. The fix is the outer join (slide 28).</p>`,
        `<p class="y-chinh">🎯 Phép nối tự nhiên có thể để lại những bộ không khớp với bộ nào của quan hệ kia — bộ treo (dangling tuple) — và chúng biến mất luôn: R ⋈ S bên dưới có 2 dòng, 3 bộ đầu vào bị mất.</p>
<p class="nhan">Trước: R(A, B, C) = (1,2,3), (4,5,6), (7,8,9) · S(B, C, D) = (2,3,10), (2,3,11), (6,7,12). Sau R ⋈ S, và các bộ treo:</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
CREATE TABLE S (B INT, C INT, D INT);
INSERT INTO R VALUES (1, 2, 3), (4, 5, 6), (7, 8, 9);
INSERT INTO S VALUES (2, 3, 10), (2, 3, 11), (6, 7, 12);
-- nối tự nhiên theo B và C
SELECT R.A, R.B, R.C, S.D
FROM R JOIN S ON R.B = S.B AND R.C = S.C;
-- bộ treo của R: không có bạn ghép trong S
SELECT * FROM R
WHERE NOT EXISTS (SELECT * FROM S WHERE S.B = R.B AND S.C = R.C);
-- bộ treo của S
SELECT * FROM S
WHERE NOT EXISTS (SELECT * FROM R WHERE R.B = S.B AND R.C = S.C);</code></pre>
<div class="out">(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td><td>10</td></tr>
<tr><td>1</td><td>2</td><td>3</td><td>11</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
<tbody>
<tr><td>4</td><td>5</td><td>6</td></tr>
<tr><td>7</td><td>8</td><td>9</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>6</td><td>7</td><td>12</td></tr>
</tbody>
</table>
<p>Thuộc tính chung là B và C, nên cả hai phải bằng nhau. Chỉ (1, 2, 3) của R tìm được bạn ghép — hai bạn, (2, 3, 10) và (2, 3, 11). (4, 5, 6), (7, 8, 9) của R và (6, 7, 12) của S không có bạn ghép. <code>NOT EXISTS (…)</code> ở hai câu cuối nghĩa là "không có dòng nào của bảng kia cùng B và C".</p>
<p class="dap-an">✅ <strong>"What do you consider?"</strong> (bạn nhận xét gì?) Phép nối đã làm mất thông tin: nhìn kết quả không thể biết A = 4 hay A = 7 có tồn tại. Câu hỏi thật: "liệt kê mọi khách hàng kèm đơn hàng của họ" — khách chưa có đơn nào sẽ biến mất. Cách chữa là phép nối ngoài (slide 28).</p>`],
      [28, 'Natural Outer Joins',
        `<p class="y-chinh">🎯 The natural outer join R ⟗ S joins on all common attributes like R ⋈ S, then adds the dangling tuples of R and of S, padded with the special null symbol ⊥ in the attributes they do not have.</p>
<p>So R ⟗ S = (R ⋈ S) + (dangling tuples of R, padded) + (dangling tuples of S, padded). "Padded" = filled: a dangling tuple of R has no D, so it gets D = ⊥; a dangling tuple of S has no A, so it gets A = ⊥. In SQL ⊥ is <code>NULL</code>.</p>
<p>(On the slide image the symbol renders as ⋈ with a small "o" above it — the textbook's notation; the standard symbol today is ⟗.)</p>
<p class="meo">🧠 Outer join = inner join + "nobody gets left behind". The result has exactly the rows of the natural join plus every dangling tuple of both sides.</p>`,
        `<p class="y-chinh">🎯 Nối ngoài tự nhiên (natural outer join) R ⟗ S nối theo mọi thuộc tính chung như R ⋈ S, rồi thêm các bộ treo của R và của S, được đệm (padded) bằng ký hiệu null đặc biệt ⊥ ở những thuộc tính chúng không có.</p>
<p>Vậy R ⟗ S = (R ⋈ S) + (bộ treo của R, đã đệm) + (bộ treo của S, đã đệm). "Đệm" = lấp chỗ trống: bộ treo của R không có D, nên nhận D = ⊥; bộ treo của S không có A, nên nhận A = ⊥. Trong SQL ⊥ chính là <code>NULL</code>.</p>
<p>(Trên ảnh slide ký hiệu hiện thành ⋈ có chữ "o" nhỏ phía trên — cách viết của sách; ký hiệu chuẩn ngày nay là ⟗.)</p>
<p class="meo">🧠 Nối ngoài = nối trong + "không bỏ lại ai". Kết quả có ít nhất số dòng của phép nối tự nhiên cộng với mọi bộ treo của cả hai bên.</p>`],
      [29, 'Natural Outer Joins - Example',
        `<p class="y-chinh">🎯 R ⟗ S = the 2 matched rows (1,2,3,10), (1,2,3,11) + dangling R rows (4,5,6,⊥), (7,8,9,⊥) + dangling S row (⊥,6,7,12): 5 rows.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
CREATE TABLE S (B INT, C INT, D INT);
INSERT INTO R VALUES (1, 2, 3), (4, 5, 6), (7, 8, 9);
INSERT INTO S VALUES (2, 3, 10), (2, 3, 11), (6, 7, 12);
-- R ⟗ S: natural FULL outer join on B and C
SELECT R.A,
       COALESCE(R.B, S.B) AS B,   -- take B from whichever side exists
       COALESCE(R.C, S.C) AS C,
       S.D
FROM R FULL OUTER JOIN S ON R.B = S.B AND R.C = S.C;</code></pre>
<div class="out">(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td><td>10</td></tr>
<tr><td>1</td><td>2</td><td>3</td><td>11</td></tr>
<tr><td>4</td><td>5</td><td>6</td><td><em>NULL</em></td></tr>
<tr><td>7</td><td>8</td><td>9</td><td><em>NULL</em></td></tr>
<tr><td><em>NULL</em></td><td>6</td><td>7</td><td>12</td></tr>
</tbody>
</table>
<p class="nhan">Reading the SQL</p>
<ul>
<li><code>FULL OUTER JOIN … ON R.B = S.B AND R.C = S.C</code> — keep matches, plus unmatched rows of both sides; this is the full outer join ⟗ (slide 30).</li>
<li>For a dangling S row, R.B and R.C are NULL, so <code>COALESCE(R.B, S.B)</code> ("the first value that is not NULL") takes B from whichever side has it — that is how SQL Server shows the common attribute once, like a natural join.</li>
</ul>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the natural outer join exists as one keyword — no COALESCE needed:
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT, c INT);
CREATE TABLE s (b INT, c INT, d INT);
INSERT INTO r VALUES (1, 2, 3), (4, 5, 6), (7, 8, 9);
INSERT INTO s VALUES (2, 3, 10), (2, 3, 11), (6, 7, 12);
SELECT * FROM r NATURAL FULL JOIN s ORDER BY b, c;   -- the slide's R ⟗ S in one line</code></pre>
<div class="out">INSERT 0 3<br>
INSERT 0 3</div>
<table>
<thead><tr><th>b</th><th>c</th><th>a</th><th>d</th></tr></thead>
<tbody>
<tr><td>2</td><td>3</td><td>1</td><td>10</td></tr>
<tr><td>2</td><td>3</td><td>1</td><td>11</td></tr>
<tr><td>5</td><td>6</td><td>4</td><td><em>NULL</em></td></tr>
<tr><td>6</td><td>7</td><td><em>NULL</em></td><td>12</td></tr>
<tr><td>8</td><td>9</td><td>7</td><td><em>NULL</em></td></tr>
</tbody>
</table>
The common columns b, c come first and are merged automatically. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-2-outer-join">PostgreSQL 5.2 — OUTER JOIN</a>.</div>
<div class="pitfall">In the result, NULL means "no partner", not "value unknown in the data". A later <code>WHERE S.D = NULL</code> finds nothing — you must write <code>WHERE S.D IS NULL</code> (the NULL logic of web Chapter 5).</div>`,
        `<p class="y-chinh">🎯 R ⟗ S = 2 dòng khớp (1,2,3,10), (1,2,3,11) + các dòng treo của R (4,5,6,⊥), (7,8,9,⊥) + dòng treo của S (⊥,6,7,12): 5 dòng.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
CREATE TABLE S (B INT, C INT, D INT);
INSERT INTO R VALUES (1, 2, 3), (4, 5, 6), (7, 8, 9);
INSERT INTO S VALUES (2, 3, 10), (2, 3, 11), (6, 7, 12);
-- nối ngoài ĐẦY ĐỦ tự nhiên theo B và C
SELECT R.A,
       COALESCE(R.B, S.B) AS B,   -- lấy B từ bên nào có
       COALESCE(R.C, S.C) AS C,
       S.D
FROM R FULL OUTER JOIN S ON R.B = S.B AND R.C = S.C;</code></pre>
<div class="out">(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td><td>10</td></tr>
<tr><td>1</td><td>2</td><td>3</td><td>11</td></tr>
<tr><td>4</td><td>5</td><td>6</td><td><em>NULL</em></td></tr>
<tr><td>7</td><td>8</td><td>9</td><td><em>NULL</em></td></tr>
<tr><td><em>NULL</em></td><td>6</td><td>7</td><td>12</td></tr>
</tbody>
</table>
<p class="nhan">Đọc câu SQL</p>
<ul>
<li><code>FULL OUTER JOIN … ON R.B = S.B AND R.C = S.C</code> — giữ các dòng khớp, cộng các dòng không khớp của cả hai bên; đây là nối ngoài đầy đủ ⟗ (slide 30).</li>
<li>Với một dòng treo của S, R.B và R.C là NULL, nên <code>COALESCE(R.B, S.B)</code> ("giá trị đầu tiên khác NULL") lấy B từ bên nào có — đó là cách SQL Server hiện thuộc tính chung một lần, giống nối tự nhiên.</li>
</ul>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> nối ngoài tự nhiên có sẵn thành một từ khoá — không cần COALESCE:
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT, c INT);
CREATE TABLE s (b INT, c INT, d INT);
INSERT INTO r VALUES (1, 2, 3), (4, 5, 6), (7, 8, 9);
INSERT INTO s VALUES (2, 3, 10), (2, 3, 11), (6, 7, 12);
SELECT * FROM r NATURAL FULL JOIN s ORDER BY b, c;   -- R ⟗ S của slide trong một dòng</code></pre>
<div class="out">INSERT 0 3<br>
INSERT 0 3</div>
<table>
<thead><tr><th>b</th><th>c</th><th>a</th><th>d</th></tr></thead>
<tbody>
<tr><td>2</td><td>3</td><td>1</td><td>10</td></tr>
<tr><td>2</td><td>3</td><td>1</td><td>11</td></tr>
<tr><td>5</td><td>6</td><td>4</td><td><em>NULL</em></td></tr>
<tr><td>6</td><td>7</td><td><em>NULL</em></td><td>12</td></tr>
<tr><td>8</td><td>9</td><td>7</td><td><em>NULL</em></td></tr>
</tbody>
</table>
Các cột chung b, c đứng đầu và được gộp tự động. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-2-outer-join">PostgreSQL 5.2 — OUTER JOIN</a>.</div>
<div class="pitfall">Trong kết quả, NULL nghĩa là "không có bạn ghép", không phải "giá trị chưa biết trong dữ liệu". Viết tiếp <code>WHERE S.D = NULL</code> sẽ không tìm được gì — phải viết <code>WHERE S.D IS NULL</code> (logic NULL ở Chương 5 trên web).</div>`],
      [30, 'Outer Joins - left, right, full',
        `<p class="y-chinh">🎯 Variants of the outer join: the left outer join (⟕) pads only dangling tuples of the left relation, the right outer join (⟖) only those of the right relation, the full outer join (⟗) both.</p>
<p>(The slide writes R ⋈<sub>L</sub> S and R ⋈<sub>R</sub> S, and the three symbols after "Left / Right / Full outer join" did not render on the image — they are ⟕ ⟖ ⟗.) With the R and S of slide 29:</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
CREATE TABLE S (B INT, C INT, D INT);
INSERT INTO R VALUES (1, 2, 3), (4, 5, 6), (7, 8, 9);
INSERT INTO S VALUES (2, 3, 10), (2, 3, 11), (6, 7, 12);
-- R ⟕ S: keep every tuple of R
SELECT R.A, R.B, R.C, S.D
FROM R LEFT OUTER JOIN S ON R.B = S.B AND R.C = S.C;
-- R ⟖ S: keep every tuple of S
SELECT R.A, S.B, S.C, S.D
FROM R RIGHT OUTER JOIN S ON R.B = S.B AND R.C = S.C;</code></pre>
<div class="out">(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td><td>10</td></tr>
<tr><td>1</td><td>2</td><td>3</td><td>11</td></tr>
<tr><td>4</td><td>5</td><td>6</td><td><em>NULL</em></td></tr>
<tr><td>7</td><td>8</td><td>9</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td><td>10</td></tr>
<tr><td>1</td><td>2</td><td>3</td><td>11</td></tr>
<tr><td><em>NULL</em></td><td>6</td><td>7</td><td>12</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Operator</th><th>Keeps</th><th>Rows here</th><th>SQL</th></tr></thead>
<tbody>
<tr><td>R ⋈ S</td><td>matches only</td><td>2</td><td>JOIN</td></tr>
<tr><td>R ⟕ S</td><td>matches + dangling of R</td><td>2 + 2 = 4</td><td>LEFT OUTER JOIN</td></tr>
<tr><td>R ⟖ S</td><td>matches + dangling of S</td><td>2 + 1 = 3</td><td>RIGHT OUTER JOIN</td></tr>
<tr><td>R ⟗ S</td><td>matches + dangling of both</td><td>2 + 2 + 1 = 5</td><td>FULL OUTER JOIN</td></tr>
</tbody>
</table>
<p>LEFT and RIGHT are mirror images: R ⟖ S = S ⟕ R (only the column order differs), so in practice people write LEFT JOIN and put the table whose rows must all survive on the left. The word OUTER is optional in SQL: <code>LEFT JOIN</code> = <code>LEFT OUTER JOIN</code>. These keywords are the same on PostgreSQL.</p>
<p class="meo">🧠 Everyday use: "every course with its number of students, including courses nobody takes" = Course ⟕ Enroll, then γ with COUNT(E.sid) — practice exercise 8.</p>`,
        `<p class="y-chinh">🎯 Các biến thể của nối ngoài: nối ngoài trái (left outer join — ⟕) chỉ đệm các bộ treo của quan hệ bên trái, nối ngoài phải (right outer join — ⟖) chỉ đệm bộ treo của bên phải, nối ngoài đầy đủ (full outer join — ⟗) đệm cả hai.</p>
<p>(Slide viết R ⋈<sub>L</sub> S và R ⋈<sub>R</sub> S, và ba ký hiệu sau "Left / Right / Full outer join" không hiện được trên ảnh — chúng là ⟕ ⟖ ⟗.) Với R và S của slide 29:</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
CREATE TABLE S (B INT, C INT, D INT);
INSERT INTO R VALUES (1, 2, 3), (4, 5, 6), (7, 8, 9);
INSERT INTO S VALUES (2, 3, 10), (2, 3, 11), (6, 7, 12);
-- giữ mọi bộ của R
SELECT R.A, R.B, R.C, S.D
FROM R LEFT OUTER JOIN S ON R.B = S.B AND R.C = S.C;
-- giữ mọi bộ của S
SELECT R.A, S.B, S.C, S.D
FROM R RIGHT OUTER JOIN S ON R.B = S.B AND R.C = S.C;</code></pre>
<div class="out">(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td><td>10</td></tr>
<tr><td>1</td><td>2</td><td>3</td><td>11</td></tr>
<tr><td>4</td><td>5</td><td>6</td><td><em>NULL</em></td></tr>
<tr><td>7</td><td>8</td><td>9</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td><td>10</td></tr>
<tr><td>1</td><td>2</td><td>3</td><td>11</td></tr>
<tr><td><em>NULL</em></td><td>6</td><td>7</td><td>12</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Phép</th><th>Giữ</th><th>Số dòng ở đây</th><th>SQL</th></tr></thead>
<tbody>
<tr><td>R ⋈ S</td><td>chỉ các dòng khớp</td><td>2</td><td>JOIN</td></tr>
<tr><td>R ⟕ S</td><td>khớp + bộ treo của R</td><td>2 + 2 = 4</td><td>LEFT OUTER JOIN</td></tr>
<tr><td>R ⟖ S</td><td>khớp + bộ treo của S</td><td>2 + 1 = 3</td><td>RIGHT OUTER JOIN</td></tr>
<tr><td>R ⟗ S</td><td>khớp + bộ treo của cả hai</td><td>2 + 2 + 1 = 5</td><td>FULL OUTER JOIN</td></tr>
</tbody>
</table>
<p>LEFT và RIGHT là ảnh gương của nhau: R ⟖ S = S ⟕ R (chỉ khác thứ tự cột), nên thực tế người ta viết LEFT JOIN và đặt bảng mà mọi dòng phải được giữ lại ở bên trái. Chữ OUTER là tuỳ chọn trong SQL: <code>LEFT JOIN</code> = <code>LEFT OUTER JOIN</code>. Các từ khoá này viết y hệt trên PostgreSQL.</p>
<p class="meo">🧠 Dùng đời thường: "mọi môn học kèm số sinh viên, kể cả môn chưa ai học" = Course ⟕ Enroll, rồi γ với COUNT(E.sid) — bài thực hành 8.</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>Write "the number of different genres in Movies" with δ and an aggregation, then in SQL.</li>
<li>In γ<sub>studio, AVG(length)→avgLen</sub>(Movies), which is the grouping attribute and which the aggregated one?</li>
<li>R has 5 rows, S has 4 rows, R ⋈ S has 3 rows using 2 rows of R and 3 rows of S. How many rows does R ⟕ S have?</li>
<li>Why is <code>AVG(A)</code> = 1 on SQL Server when the true average is 1.5?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) γ<sub>COUNT(genre)</sub>(δ(π<sub>genre</sub>(Movies))) — <code>SELECT COUNT(DISTINCT genre) FROM Movies</code>. (2) studio is grouping, length is aggregated (one row per studio). (3) 3 matches + 5 − 2 = 3 dangling rows of R = 6. (4) A is INT, so SQL Server returns an INT average (truncated); write AVG(A * 1.0).</p>
<p><strong>Next:</strong> lessons 2.1–2.4 below revisit the model and the algebra, then the practice lesson 2.5 drills every operator on one small university database and checks each answer with SQL.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Viết "số thể loại (genre) khác nhau trong Movies" bằng δ và một phép gộp, rồi bằng SQL.</li>
<li>Trong γ<sub>studio, AVG(length)→avgLen</sub>(Movies), đâu là thuộc tính nhóm, đâu là thuộc tính được gộp?</li>
<li>R có 5 dòng, S có 4 dòng, R ⋈ S có 3 dòng dùng tới 2 dòng của R và 3 dòng của S. R ⟕ S có bao nhiêu dòng?</li>
<li>Vì sao trên SQL Server <code>AVG(A)</code> = 1 trong khi trung bình thật là 1.5?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) γ<sub>COUNT(genre)</sub>(δ(π<sub>genre</sub>(Movies))) — <code>SELECT COUNT(DISTINCT genre) FROM Movies</code>. (2) studio là thuộc tính nhóm, length là thuộc tính được gộp (mỗi hãng một dòng). (3) 3 dòng khớp + 5 − 2 = 3 dòng treo của R = 6. (4) A kiểu INT nên SQL Server trả trung bình kiểu INT (bị cắt phần lẻ); viết AVG(A * 1.0).</p>
<p><strong>Tiếp theo:</strong> các bài 2.1–2.4 bên dưới ôn lại mô hình và đại số, rồi bài thực hành 2.5 luyện mọi phép trên một CSDL trường học nhỏ và kiểm từng đáp án bằng SQL.</p>`),
    books([
      ['ullman', 'Ch.5 Algebraic and Logical Query Languages — §5.2 Extended Operators of Relational Algebra (duplicate elimination, aggregation, grouping, extended projection, sorting, outer joins)', 'Chương 5 Algebraic and Logical Query Languages — §5.2 Extended Operators of Relational Algebra (loại trùng, gộp, nhóm, chiếu mở rộng, sắp xếp, nối ngoài)'],
      ['ramakrishnan', 'Ch.5 SQL: Queries, Constraints, Triggers — §5.5 Aggregate Operators (GROUP BY, HAVING) · §5.6 Null Values (outer joins)', 'Chương 5 SQL: Queries, Constraints, Triggers — §5.5 hàm gộp (GROUP BY, HAVING) · §5.6 giá trị NULL (nối ngoài)'],
    ]),
  ].join('\n'),
};

/* ───────── 2.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Relational algebra on sets and bags ───────── */
const L_on_ch2 = {
  title: '2.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Relational algebra on sets and bags|||2.5 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Đại số quan hệ trên tập và túi',
  slug: 'dbi202-on-ch2',
  type: 'VIDEO',
  description: '8 bài tập kiểu đề FPTU: viết biểu thức đại số quan hệ (σ π ∪ ∩ − ⋈ θ-join ρ, rồi túi, γ, τ, nối ngoài) cho câu hỏi tiếng Anh trên một CSDL trường học nhỏ, vẽ bảng kết quả từng phép, và đối chiếu mỗi bài bằng câu SQL tương đương chạy thật trên SQL Server (và PostgreSQL ở chỗ cú pháp khác: NATURAL JOIN, đổi tên cột, INTERSECT ALL/EXCEPT ALL); 16 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.5 · Practice &amp; review</span>
<h2>Relational algebra — practise like the exam, check every answer with SQL</h2>
<p class="lead">Eight exercises in the shape FPTU uses for this chapter: an English question, "write the relational-algebra expression", sometimes "and the result". Each solution builds the expression step by step, shows the table after every operator, and then runs the <strong>equivalent SQL</strong> on SQL Server — so no result on this page was computed by hand. Where PostgreSQL writes it differently, a 🐘 box shows that version too.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Copy the three tables below on paper. For each exercise, hide the solution, write the expression, and compute the result table by hand.</li>
<li>Then compare step by step with the tables here — and read the trap: it is the wrong answer you were about to give.</li>
<li>Finally type the SQL yourself (SSMS or Azure Data Studio for SQL Server, psql or DBeaver for PostgreSQL) and see the same rows appear.</li>
</ol>
<p>Exercises 1–5 use the set algebra of lessons 2.A–2.B (school slides "Chapter 2"); 6–8 use the bag and extended operators of lessons 2.C–2.D (school slides "Chapter 5").</p></div>
<h3>The database used in every exercise (illustrative data)</h3>
<p>A small university: <strong>Student</strong>(<u>sid</u>, name, major), <strong>Course</strong>(<u>cid</u>, title, credits), <strong>Enroll</strong>(<u>sid, cid</u>, score) with Enroll.sid → Student and Enroll.cid → Course. As an ERD: two entities Student and Course, and the many-to-many relationship Enroll between them, carrying the attribute score (web Chapter 3).</p>
<pre><code class="language-sql">CREATE TABLE Student (sid CHAR(4) NOT NULL, name NVARCHAR(20) NOT NULL, major CHAR(2) NOT NULL,
                      CONSTRAINT pk_student PRIMARY KEY (sid));
CREATE TABLE Course  (cid CHAR(6) NOT NULL, title NVARCHAR(30) NOT NULL, credits INT NOT NULL,
                      CONSTRAINT pk_course PRIMARY KEY (cid));
CREATE TABLE Enroll  (sid CHAR(4) NOT NULL, cid CHAR(6) NOT NULL, score DECIMAL(3,1),
                      CONSTRAINT pk_enroll PRIMARY KEY (sid, cid),
                      CONSTRAINT fk_enroll_student FOREIGN KEY (sid) REFERENCES Student(sid),
                      CONSTRAINT fk_enroll_course  FOREIGN KEY (cid) REFERENCES Course(cid));
INSERT INTO Student VALUES ('SE01', N'An', 'SE'), ('SE02', N'Bình', 'SE'), ('AI01', N'Chi', 'AI'),
                           ('SE03', N'An', 'SE'), ('GD01', N'Dũng', 'GD');
INSERT INTO Course VALUES ('DBI202', N'Databases', 3), ('CSD201', N'Data Structures', 3),
                          ('MAE101', N'Mathematics', 3), ('JPD113', N'Japanese 1', 3);
INSERT INTO Enroll VALUES ('SE01', 'DBI202', 8.5), ('SE01', 'CSD201', 7.0), ('SE02', 'DBI202', 6.0),
                          ('SE02', 'MAE101', 9.0), ('AI01', 'DBI202', 9.5), ('AI01', 'CSD201', 8.0),
                          ('SE03', 'CSD201', 5.5);
SELECT * FROM Student;
SELECT * FROM Course;
SELECT * FROM Enroll;</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>sid</th><th>name</th><th>major</th></tr></thead>
<tbody>
<tr><td>AI01</td><td>Chi</td><td>AI</td></tr>
<tr><td>GD01</td><td>Dũng</td><td>GD</td></tr>
<tr><td>SE01</td><td>An</td><td>SE</td></tr>
<tr><td>SE02</td><td>Bình</td><td>SE</td></tr>
<tr><td>SE03</td><td>An</td><td>SE</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>cid</th><th>title</th><th>credits</th></tr></thead>
<tbody>
<tr><td>CSD201</td><td>Data Structures</td><td>3</td></tr>
<tr><td>DBI202</td><td>Databases</td><td>3</td></tr>
<tr><td>JPD113</td><td>Japanese 1</td><td>3</td></tr>
<tr><td>MAE101</td><td>Mathematics</td><td>3</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>sid</th><th>cid</th><th>score</th></tr></thead>
<tbody>
<tr><td>AI01</td><td>CSD201</td><td>8.0</td></tr>
<tr><td>AI01</td><td>DBI202</td><td>9.5</td></tr>
<tr><td>SE01</td><td>CSD201</td><td>7.0</td></tr>
<tr><td>SE01</td><td>DBI202</td><td>8.5</td></tr>
<tr><td>SE02</td><td>DBI202</td><td>6.0</td></tr>
<tr><td>SE02</td><td>MAE101</td><td>9.0</td></tr>
<tr><td>SE03</td><td>CSD201</td><td>5.5</td></tr>
</tbody>
</table>
<p>Notice on purpose: two different students are called An (SE01, SE03); Dũng (GD01) takes no course; nobody takes JPD113. Those three facts are what make the traps below visible.</p>`,
    `<span class="eyebrow">Chương 2 · Bài 2.5 · Thực hành &amp; ôn tập</span>
<h2>Đại số quan hệ — luyện như đề thi, kiểm mọi đáp án bằng SQL</h2>
<p class="lead">Tám bài tập đúng dạng FPTU hay ra cho chương này: một câu hỏi tiếng Anh, "viết biểu thức đại số quan hệ", đôi khi "và cho biết kết quả". Lời giải nào cũng dựng biểu thức từng bước, cho xem bảng sau mỗi phép, rồi chạy <strong>câu SQL tương đương</strong> trên SQL Server — nên không kết quả nào trong trang này được tính nhẩm. Chỗ nào PostgreSQL viết khác, một ô 🐘 cho xem luôn bản đó.</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Chép ba bảng bên dưới ra giấy. Với mỗi bài, che lời giải, viết biểu thức, và tự tính bảng kết quả bằng tay.</li>
<li>Rồi so từng bước với các bảng ở đây — và đọc cái bẫy: đó là đáp án sai mà bạn suýt đưa ra.</li>
<li>Cuối cùng tự gõ câu SQL (SSMS hoặc Azure Data Studio cho SQL Server, psql hoặc DBeaver cho PostgreSQL) và xem đúng các dòng đó hiện ra.</li>
</ol>
<p>Bài 1–5 dùng đại số trên tập của bài 2.A–2.B (slide "Chapter 2" của trường); bài 6–8 dùng các phép trên túi và phép mở rộng của bài 2.C–2.D (slide "Chapter 5" của trường).</p></div>
<h3>CSDL dùng cho mọi bài (dữ liệu minh hoạ)</h3>
<p>Một trường đại học nhỏ: <strong>Student</strong>(<u>sid</u>, name, major) — sinh viên, <strong>Course</strong>(<u>cid</u>, title, credits) — môn học, <strong>Enroll</strong>(<u>sid, cid</u>, score) — đăng ký học và điểm, với khoá ngoại Enroll.sid → Student và Enroll.cid → Course. Nhìn bằng ERD: hai thực thể Student và Course, và liên kết nhiều–nhiều Enroll giữa chúng mang thuộc tính score (Chương 3 trên web).</p>
<pre><code class="language-sql">CREATE TABLE Student (sid CHAR(4) NOT NULL, name NVARCHAR(20) NOT NULL, major CHAR(2) NOT NULL,
                      CONSTRAINT pk_student PRIMARY KEY (sid));
CREATE TABLE Course  (cid CHAR(6) NOT NULL, title NVARCHAR(30) NOT NULL, credits INT NOT NULL,
                      CONSTRAINT pk_course PRIMARY KEY (cid));
CREATE TABLE Enroll  (sid CHAR(4) NOT NULL, cid CHAR(6) NOT NULL, score DECIMAL(3,1),
                      CONSTRAINT pk_enroll PRIMARY KEY (sid, cid),
                      CONSTRAINT fk_enroll_student FOREIGN KEY (sid) REFERENCES Student(sid),
                      CONSTRAINT fk_enroll_course  FOREIGN KEY (cid) REFERENCES Course(cid));
INSERT INTO Student VALUES ('SE01', N'An', 'SE'), ('SE02', N'Bình', 'SE'), ('AI01', N'Chi', 'AI'),
                           ('SE03', N'An', 'SE'), ('GD01', N'Dũng', 'GD');
INSERT INTO Course VALUES ('DBI202', N'Databases', 3), ('CSD201', N'Data Structures', 3),
                          ('MAE101', N'Mathematics', 3), ('JPD113', N'Japanese 1', 3);
INSERT INTO Enroll VALUES ('SE01', 'DBI202', 8.5), ('SE01', 'CSD201', 7.0), ('SE02', 'DBI202', 6.0),
                          ('SE02', 'MAE101', 9.0), ('AI01', 'DBI202', 9.5), ('AI01', 'CSD201', 8.0),
                          ('SE03', 'CSD201', 5.5);
SELECT * FROM Student;
SELECT * FROM Course;
SELECT * FROM Enroll;</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>sid</th><th>name</th><th>major</th></tr></thead>
<tbody>
<tr><td>AI01</td><td>Chi</td><td>AI</td></tr>
<tr><td>GD01</td><td>Dũng</td><td>GD</td></tr>
<tr><td>SE01</td><td>An</td><td>SE</td></tr>
<tr><td>SE02</td><td>Bình</td><td>SE</td></tr>
<tr><td>SE03</td><td>An</td><td>SE</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>cid</th><th>title</th><th>credits</th></tr></thead>
<tbody>
<tr><td>CSD201</td><td>Data Structures</td><td>3</td></tr>
<tr><td>DBI202</td><td>Databases</td><td>3</td></tr>
<tr><td>JPD113</td><td>Japanese 1</td><td>3</td></tr>
<tr><td>MAE101</td><td>Mathematics</td><td>3</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>sid</th><th>cid</th><th>score</th></tr></thead>
<tbody>
<tr><td>AI01</td><td>CSD201</td><td>8.0</td></tr>
<tr><td>AI01</td><td>DBI202</td><td>9.5</td></tr>
<tr><td>SE01</td><td>CSD201</td><td>7.0</td></tr>
<tr><td>SE01</td><td>DBI202</td><td>8.5</td></tr>
<tr><td>SE02</td><td>DBI202</td><td>6.0</td></tr>
<tr><td>SE02</td><td>MAE101</td><td>9.0</td></tr>
<tr><td>SE03</td><td>CSD201</td><td>5.5</td></tr>
</tbody>
</table>
<p>Cố ý sắp đặt: hai sinh viên khác nhau cùng tên An (SE01, SE03); Dũng (GD01) không học môn nào; không ai học JPD113. Chính ba điều đó làm lộ ra các cái bẫy bên dưới.</p>`),
    bi(`<h3>🧪 Exercise 1 — σ and π, set vs bag (FE style · ~5 min)</h3>
<p class="nhan">Task</p>
<p>(a) Write the expression for "the names of all SE students". (b) How many tuples does it return under set semantics, and how many rows does <code>SELECT name FROM Student WHERE major = 'SE'</code> return?</p>
<p class="nhan">Solution</p>
<p>Keep the SE rows first (σ), then keep the column name (π): <strong>π<sub>name</sub>(σ<sub>major='SE'</sub>(Student))</strong>.</p>
<pre><code class="language-sql">-- σ major='SE' (Student)
SELECT * FROM Student WHERE major = 'SE';</code></pre>
<pre><code class="language-sql">-- π name (σ major='SE' (Student)) — SET: DISTINCT
SELECT DISTINCT name FROM Student WHERE major = 'SE';</code></pre>
<pre><code class="language-sql">-- the same on a BAG: no DISTINCT
SELECT name FROM Student WHERE major = 'SE';</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>sid</th><th>name</th><th>major</th></tr></thead>
<tbody>
<tr><td>SE01</td><td>An</td><td>SE</td></tr>
<tr><td>SE02</td><td>Bình</td><td>SE</td></tr>
<tr><td>SE03</td><td>An</td><td>SE</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>name</th></tr></thead>
<tbody>
<tr><td>An</td></tr>
<tr><td>Bình</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>name</th></tr></thead>
<tbody>
<tr><td>An</td></tr>
<tr><td>Bình</td></tr>
<tr><td>An</td></tr>
</tbody>
</table>
<p>After σ: 3 rows (SE01, SE02, SE03). After π on a <strong>set</strong>: {An, Bình} — 2 tuples, because the two Ans become the same tuple (An) once the sid is cut off. SQL without DISTINCT works on a <strong>bag</strong>: 3 rows, An twice.</p>
<p class="dap-an">✅ (a) π<sub>name</sub>(σ<sub>major='SE'</sub>(Student)). (b) 2 tuples in set algebra = <code>SELECT DISTINCT name</code>; 3 rows for plain <code>SELECT name</code>.</p>
<div class="pitfall">The order matters in one direction: π<sub>name</sub> first and σ<sub>major='SE'</sub> after is <strong>wrong</strong> — after the projection, major no longer exists, so the condition cannot be tested. Select first, project last.</div>`,
    `<h3>🧪 Bài 1 — σ và π, tập và túi (dạng FE · ~5 phút)</h3>
<p class="nhan">Đề</p>
<p>(a) Viết biểu thức cho "tên của mọi sinh viên ngành SE". (b) Theo ngữ nghĩa tập nó trả về bao nhiêu bộ, và <code>SELECT name FROM Student WHERE major = 'SE'</code> trả về bao nhiêu dòng?</p>
<p class="nhan">Lời giải</p>
<p>Giữ các dòng ngành SE trước (σ), rồi giữ cột name (π): <strong>π<sub>name</sub>(σ<sub>major='SE'</sub>(Student))</strong>.</p>
<pre><code class="language-sql">-- σ major='SE' (Student)
SELECT * FROM Student WHERE major = 'SE';</code></pre>
<pre><code class="language-sql">-- TẬP: DISTINCT
SELECT DISTINCT name FROM Student WHERE major = 'SE';</code></pre>
<pre><code class="language-sql">-- cùng câu trên TÚI: không DISTINCT
SELECT name FROM Student WHERE major = 'SE';</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>sid</th><th>name</th><th>major</th></tr></thead>
<tbody>
<tr><td>SE01</td><td>An</td><td>SE</td></tr>
<tr><td>SE02</td><td>Bình</td><td>SE</td></tr>
<tr><td>SE03</td><td>An</td><td>SE</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>name</th></tr></thead>
<tbody>
<tr><td>An</td></tr>
<tr><td>Bình</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>name</th></tr></thead>
<tbody>
<tr><td>An</td></tr>
<tr><td>Bình</td></tr>
<tr><td>An</td></tr>
</tbody>
</table>
<p>Sau σ: 3 dòng (SE01, SE02, SE03). Sau π trên <strong>tập</strong>: {An, Bình} — 2 bộ, vì hai bạn An thành cùng một bộ (An) khi cột sid bị cắt. SQL không có DISTINCT làm việc trên <strong>túi</strong>: 3 dòng, An hai lần.</p>
<p class="dap-an">✅ (a) π<sub>name</sub>(σ<sub>major='SE'</sub>(Student)). (b) 2 bộ trong đại số trên tập = <code>SELECT DISTINCT name</code>; 3 dòng với <code>SELECT name</code> trơn.</p>
<div class="pitfall">Thứ tự quan trọng theo một chiều: π<sub>name</sub> trước rồi σ<sub>major='SE'</sub> sau là <strong>SAI</strong> — sau phép chiếu cột major không còn nữa, nên không kiểm được điều kiện. Chọn trước, chiếu sau.</div>`),
    bi(`<h3>🧪 Exercise 2 — join, select, project: an expression tree (PT style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>"Find the names of students who scored at least 8 in DBI202." Write the expression, draw its tree, and give the table after each operator.</p>
<p class="nhan">Solution</p>
<p><strong>π<sub>name</sub>(σ<sub>cid='DBI202' AND score≥8</sub>(Student ⋈ Enroll))</strong> — the natural join is on the only common attribute, sid.</p>
<pre><code class="language-plaintext">       π name
         |
σ cid='DBI202' AND score&gt;=8
         |
         ⋈   (on sid)
       /   \\
 Student    Enroll</code></pre>
<pre><code class="language-sql">-- step 1: Student ⋈ Enroll
SELECT S.sid, S.name, S.major, E.cid, E.score
FROM Student AS S JOIN Enroll AS E ON S.sid = E.sid
ORDER BY S.sid, E.cid;</code></pre>
<pre><code class="language-sql">-- step 2: σ cid='DBI202' AND score&gt;=8 (step 1)
SELECT S.sid, S.name, S.major, E.cid, E.score
FROM Student AS S JOIN Enroll AS E ON S.sid = E.sid
WHERE E.cid = 'DBI202' AND E.score &gt;= 8;</code></pre>
<pre><code class="language-sql">-- step 3: π name (step 2)
SELECT S.name
FROM Student AS S JOIN Enroll AS E ON S.sid = E.sid
WHERE E.cid = 'DBI202' AND E.score &gt;= 8;</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>sid</th><th>name</th><th>major</th><th>cid</th><th>score</th></tr></thead>
<tbody>
<tr><td>AI01</td><td>Chi</td><td>AI</td><td>CSD201</td><td>8.0</td></tr>
<tr><td>AI01</td><td>Chi</td><td>AI</td><td>DBI202</td><td>9.5</td></tr>
<tr><td>SE01</td><td>An</td><td>SE</td><td>CSD201</td><td>7.0</td></tr>
<tr><td>SE01</td><td>An</td><td>SE</td><td>DBI202</td><td>8.5</td></tr>
<tr><td>SE02</td><td>Bình</td><td>SE</td><td>DBI202</td><td>6.0</td></tr>
<tr><td>SE02</td><td>Bình</td><td>SE</td><td>MAE101</td><td>9.0</td></tr>
<tr><td>SE03</td><td>An</td><td>SE</td><td>CSD201</td><td>5.5</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>sid</th><th>name</th><th>major</th><th>cid</th><th>score</th></tr></thead>
<tbody>
<tr><td>AI01</td><td>Chi</td><td>AI</td><td>DBI202</td><td>9.5</td></tr>
<tr><td>SE01</td><td>An</td><td>SE</td><td>DBI202</td><td>8.5</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>name</th></tr></thead>
<tbody>
<tr><td>Chi</td></tr>
<tr><td>An</td></tr>
</tbody>
</table>
<p>Step 1: 7 rows — one per enrolment, each with the student's name and major attached; Dũng has no enrolment and vanishes (he is a dangling tuple). Step 2: 2 rows survive (Chi 9.5, An 8.5; Bình's 6.0 fails). Step 3: {Chi, An}.</p>
<p class="dap-an">✅ π<sub>name</sub>(σ<sub>cid='DBI202' AND score≥8</sub>(Student ⋈ Enroll)) = {An, Chi}. An equivalent, often faster tree pushes σ down: π<sub>name</sub>(Student ⋈ σ<sub>cid='DBI202' AND score≥8</sub>(Enroll)) — filter the small table before joining (the optimizer does this for you, slide 22).</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the natural join can be written literally:
<pre><code class="language-sql">CREATE TABLE Student (sid CHAR(4) NOT NULL, name VARCHAR(20) NOT NULL, major CHAR(2) NOT NULL,
                      CONSTRAINT pk_student PRIMARY KEY (sid));
CREATE TABLE Course  (cid CHAR(6) NOT NULL, title VARCHAR(30) NOT NULL, credits INT NOT NULL,
                      CONSTRAINT pk_course PRIMARY KEY (cid));
CREATE TABLE Enroll  (sid CHAR(4) NOT NULL, cid CHAR(6) NOT NULL, score DECIMAL(3,1),
                      CONSTRAINT pk_enroll PRIMARY KEY (sid, cid),
                      CONSTRAINT fk_enroll_student FOREIGN KEY (sid) REFERENCES Student(sid),
                      CONSTRAINT fk_enroll_course  FOREIGN KEY (cid) REFERENCES Course(cid));
INSERT INTO Student VALUES ('SE01', 'An', 'SE'), ('SE02', 'Bình', 'SE'), ('AI01', 'Chi', 'AI'),
                           ('SE03', 'An', 'SE'), ('GD01', 'Dũng', 'GD');
INSERT INTO Course VALUES ('DBI202', 'Databases', 3), ('CSD201', 'Data Structures', 3),
                          ('MAE101', 'Mathematics', 3), ('JPD113', 'Japanese 1', 3);
INSERT INTO Enroll VALUES ('SE01', 'DBI202', 8.5), ('SE01', 'CSD201', 7.0), ('SE02', 'DBI202', 6.0),
                          ('SE02', 'MAE101', 9.0), ('AI01', 'DBI202', 9.5), ('AI01', 'CSD201', 8.0),
                          ('SE03', 'CSD201', 5.5);
SELECT name
FROM student NATURAL JOIN enroll            -- matches on the only common column: sid
WHERE cid = 'DBI202' AND score &gt;= 8;</code></pre>
<div class="out">INSERT 0 5<br>
INSERT 0 4<br>
INSERT 0 7</div>
<table>
<thead><tr><th>name</th></tr></thead>
<tbody>
<tr><td>An</td></tr>
<tr><td>Chi</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-1-inner-join">PostgreSQL 5.1 — INNER JOIN</a>.</div>`,
    `<h3>🧪 Bài 2 — nối, chọn, chiếu: một cây biểu thức (dạng PT · ~10 phút)</h3>
<p class="nhan">Đề</p>
<p>"Tìm tên các sinh viên đạt ít nhất 8 điểm môn DBI202." Viết biểu thức, vẽ cây của nó, và cho bảng sau mỗi phép.</p>
<p class="nhan">Lời giải</p>
<p><strong>π<sub>name</sub>(σ<sub>cid='DBI202' AND score≥8</sub>(Student ⋈ Enroll))</strong> — phép nối tự nhiên theo thuộc tính chung duy nhất là sid.</p>
<pre><code class="language-plaintext">       π name
         |
σ cid='DBI202' AND score&gt;=8
         |
         ⋈   (theo sid)
       /   \\
 Student    Enroll</code></pre>
<pre><code class="language-sql">-- bước 1
SELECT S.sid, S.name, S.major, E.cid, E.score
FROM Student AS S JOIN Enroll AS E ON S.sid = E.sid
ORDER BY S.sid, E.cid;</code></pre>
<pre><code class="language-sql">-- bước 2
SELECT S.sid, S.name, S.major, E.cid, E.score
FROM Student AS S JOIN Enroll AS E ON S.sid = E.sid
WHERE E.cid = 'DBI202' AND E.score &gt;= 8;</code></pre>
<pre><code class="language-sql">-- bước 3
SELECT S.name
FROM Student AS S JOIN Enroll AS E ON S.sid = E.sid
WHERE E.cid = 'DBI202' AND E.score &gt;= 8;</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>sid</th><th>name</th><th>major</th><th>cid</th><th>score</th></tr></thead>
<tbody>
<tr><td>AI01</td><td>Chi</td><td>AI</td><td>CSD201</td><td>8.0</td></tr>
<tr><td>AI01</td><td>Chi</td><td>AI</td><td>DBI202</td><td>9.5</td></tr>
<tr><td>SE01</td><td>An</td><td>SE</td><td>CSD201</td><td>7.0</td></tr>
<tr><td>SE01</td><td>An</td><td>SE</td><td>DBI202</td><td>8.5</td></tr>
<tr><td>SE02</td><td>Bình</td><td>SE</td><td>DBI202</td><td>6.0</td></tr>
<tr><td>SE02</td><td>Bình</td><td>SE</td><td>MAE101</td><td>9.0</td></tr>
<tr><td>SE03</td><td>An</td><td>SE</td><td>CSD201</td><td>5.5</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>sid</th><th>name</th><th>major</th><th>cid</th><th>score</th></tr></thead>
<tbody>
<tr><td>AI01</td><td>Chi</td><td>AI</td><td>DBI202</td><td>9.5</td></tr>
<tr><td>SE01</td><td>An</td><td>SE</td><td>DBI202</td><td>8.5</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>name</th></tr></thead>
<tbody>
<tr><td>Chi</td></tr>
<tr><td>An</td></tr>
</tbody>
</table>
<p>Bước 1: 7 dòng — mỗi lượt đăng ký một dòng, kèm tên và ngành của sinh viên; Dũng không đăng ký gì nên biến mất (bạn ấy là một bộ treo). Bước 2: còn 2 dòng (Chi 9.5, An 8.5; điểm 6.0 của Bình không qua). Bước 3: {Chi, An}.</p>
<p class="dap-an">✅ π<sub>name</sub>(σ<sub>cid='DBI202' AND score≥8</sub>(Student ⋈ Enroll)) = {An, Chi}. Một cây tương đương, thường nhanh hơn, đẩy σ xuống dưới: π<sub>name</sub>(Student ⋈ σ<sub>cid='DBI202' AND score≥8</sub>(Enroll)) — lọc bảng nhỏ trước khi nối (bộ tối ưu tự làm việc này, slide 22).</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> phép nối tự nhiên viết được đúng nguyên văn:
<pre><code class="language-sql">CREATE TABLE Student (sid CHAR(4) NOT NULL, name VARCHAR(20) NOT NULL, major CHAR(2) NOT NULL,
                      CONSTRAINT pk_student PRIMARY KEY (sid));
CREATE TABLE Course  (cid CHAR(6) NOT NULL, title VARCHAR(30) NOT NULL, credits INT NOT NULL,
                      CONSTRAINT pk_course PRIMARY KEY (cid));
CREATE TABLE Enroll  (sid CHAR(4) NOT NULL, cid CHAR(6) NOT NULL, score DECIMAL(3,1),
                      CONSTRAINT pk_enroll PRIMARY KEY (sid, cid),
                      CONSTRAINT fk_enroll_student FOREIGN KEY (sid) REFERENCES Student(sid),
                      CONSTRAINT fk_enroll_course  FOREIGN KEY (cid) REFERENCES Course(cid));
INSERT INTO Student VALUES ('SE01', 'An', 'SE'), ('SE02', 'Bình', 'SE'), ('AI01', 'Chi', 'AI'),
                           ('SE03', 'An', 'SE'), ('GD01', 'Dũng', 'GD');
INSERT INTO Course VALUES ('DBI202', 'Databases', 3), ('CSD201', 'Data Structures', 3),
                          ('MAE101', 'Mathematics', 3), ('JPD113', 'Japanese 1', 3);
INSERT INTO Enroll VALUES ('SE01', 'DBI202', 8.5), ('SE01', 'CSD201', 7.0), ('SE02', 'DBI202', 6.0),
                          ('SE02', 'MAE101', 9.0), ('AI01', 'DBI202', 9.5), ('AI01', 'CSD201', 8.0),
                          ('SE03', 'CSD201', 5.5);
SELECT name
FROM student NATURAL JOIN enroll            -- khớp theo cột chung duy nhất: sid
WHERE cid = 'DBI202' AND score &gt;= 8;</code></pre>
<div class="out">INSERT 0 5<br>
INSERT 0 4<br>
INSERT 0 7</div>
<table>
<thead><tr><th>name</th></tr></thead>
<tbody>
<tr><td>An</td></tr>
<tr><td>Chi</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-1-inner-join">PostgreSQL 5.1 — INNER JOIN</a>.</div>`),
    bi(`<h3>🧪 Exercise 3 — ∩ and ∪: "both" and "either" (FE style · ~5 min)</h3>
<p class="nhan">Task</p>
<p>(a) The sids of students who take <em>both</em> DBI202 and CSD201. (b) The sids of students who take DBI202 <em>or</em> CSD201.</p>
<p class="nhan">Solution</p>
<p>(a) <strong>π<sub>sid</sub>(σ<sub>cid='DBI202'</sub>(Enroll)) ∩ π<sub>sid</sub>(σ<sub>cid='CSD201'</sub>(Enroll))</strong>. (b) the same with ∪. Both operands have one attribute, sid — type compatible.</p>
<pre><code class="language-sql">-- π sid (σ cid='DBI202' (Enroll)) ∩ π sid (σ cid='CSD201' (Enroll))
SELECT sid FROM Enroll WHERE cid = 'DBI202'
INTERSECT
SELECT sid FROM Enroll WHERE cid = 'CSD201';</code></pre>
<pre><code class="language-sql">-- π sid (σ cid='DBI202' (Enroll)) ∪ π sid (σ cid='CSD201' (Enroll))
SELECT sid FROM Enroll WHERE cid = 'DBI202'
UNION
SELECT sid FROM Enroll WHERE cid = 'CSD201';</code></pre>
<pre><code class="language-sql">-- TRAP: one σ with AND on the same row — nobody's row has two cids
SELECT sid FROM Enroll WHERE cid = 'DBI202' AND cid = 'CSD201';</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>sid</th></tr></thead>
<tbody>
<tr><td>AI01</td></tr>
<tr><td>SE01</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>sid</th></tr></thead>
<tbody>
<tr><td>AI01</td></tr>
<tr><td>SE01</td></tr>
<tr><td>SE02</td></tr>
<tr><td>SE03</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>sid</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td></tr>
</tbody>
</table>
<p>Left operand {SE01, SE02, AI01}, right operand {SE01, AI01, SE03}. ∩ = {AI01, SE01}, ∪ = {AI01, SE01, SE02, SE03}.</p>
<p class="dap-an">✅ (a) {SE01, AI01}. (b) {SE01, SE02, AI01, SE03}.</p>
<div class="pitfall">The third query is the classic wrong answer: σ<sub>cid='DBI202' AND cid='CSD201'</sub>(Enroll) returns <strong>0 rows</strong>, because σ tests one row at a time and no row has two course codes. "Both" across rows needs ∩ (or a self join), never AND inside one σ. (Contrast with slide 24, where both conditions are about the same row.)</div>`,
    `<h3>🧪 Bài 3 — ∩ và ∪: "cả hai" và "một trong hai" (dạng FE · ~5 phút)</h3>
<p class="nhan">Đề</p>
<p>(a) Mã các sinh viên học <em>cả</em> DBI202 lẫn CSD201. (b) Mã các sinh viên học DBI202 <em>hoặc</em> CSD201.</p>
<p class="nhan">Lời giải</p>
<p>(a) <strong>π<sub>sid</sub>(σ<sub>cid='DBI202'</sub>(Enroll)) ∩ π<sub>sid</sub>(σ<sub>cid='CSD201'</sub>(Enroll))</strong>. (b) tương tự với ∪. Hai toán hạng đều chỉ có một thuộc tính sid — tương thích kiểu.</p>
<pre><code class="language-sql">-- π sid (σ cid='DBI202' (Enroll)) ∩ π sid (σ cid='CSD201' (Enroll))
SELECT sid FROM Enroll WHERE cid = 'DBI202'
INTERSECT
SELECT sid FROM Enroll WHERE cid = 'CSD201';</code></pre>
<pre><code class="language-sql">-- π sid (σ cid='DBI202' (Enroll)) ∪ π sid (σ cid='CSD201' (Enroll))
SELECT sid FROM Enroll WHERE cid = 'DBI202'
UNION
SELECT sid FROM Enroll WHERE cid = 'CSD201';</code></pre>
<pre><code class="language-sql">-- BẪY: một σ với AND trên cùng dòng — không dòng nào có hai cid
SELECT sid FROM Enroll WHERE cid = 'DBI202' AND cid = 'CSD201';</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>sid</th></tr></thead>
<tbody>
<tr><td>AI01</td></tr>
<tr><td>SE01</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>sid</th></tr></thead>
<tbody>
<tr><td>AI01</td></tr>
<tr><td>SE01</td></tr>
<tr><td>SE02</td></tr>
<tr><td>SE03</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>sid</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td></tr>
</tbody>
</table>
<p>Toán hạng trái {SE01, SE02, AI01}, toán hạng phải {SE01, AI01, SE03}. ∩ = {AI01, SE01}, ∪ = {AI01, SE01, SE02, SE03}.</p>
<p class="dap-an">✅ (a) {SE01, AI01}. (b) {SE01, SE02, AI01, SE03}.</p>
<div class="pitfall">Câu thứ ba là đáp án sai kinh điển: σ<sub>cid='DBI202' AND cid='CSD201'</sub>(Enroll) trả về <strong>0 dòng</strong>, vì σ kiểm từng dòng một và không dòng nào có hai mã môn. "Cả hai" trải trên nhiều dòng thì cần ∩ (hoặc tự nối), không bao giờ là AND trong một σ. (So với slide 24, nơi cả hai điều kiện nói về cùng một dòng.)</div>`),
    bi(`<h3>🧪 Exercise 4 — difference: "who has not…" (PE style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>(a) The sids of students who take no course. (b) Their names. (c) The courses that nobody takes.</p>
<p class="nhan">Solution</p>
<p>(a) All students minus the students that appear in Enroll: <strong>π<sub>sid</sub>(Student) − π<sub>sid</sub>(Enroll)</strong>. (b) Join the result back to Student to recover the name: <strong>π<sub>name</sub>((π<sub>sid</sub>(Student) − π<sub>sid</sub>(Enroll)) ⋈ Student)</strong>. (c) <strong>π<sub>cid</sub>(Course) − π<sub>cid</sub>(Enroll)</strong>.</p>
<pre><code class="language-sql">-- π sid (Student) − π sid (Enroll)
SELECT sid FROM Student
EXCEPT
SELECT sid FROM Enroll;</code></pre>
<pre><code class="language-sql">-- (π sid (Student) − π sid (Enroll)) ⋈ Student, then π name
SELECT S.name
FROM (SELECT sid FROM Student EXCEPT SELECT sid FROM Enroll) AS T
JOIN Student AS S ON S.sid = T.sid;</code></pre>
<pre><code class="language-sql">-- the other direction: π sid (Enroll) − π sid (Student)
SELECT sid FROM Enroll
EXCEPT
SELECT sid FROM Student;</code></pre>
<pre><code class="language-sql">-- π cid (Course) − π cid (Enroll): courses nobody takes
SELECT cid FROM Course
EXCEPT
SELECT cid FROM Enroll;</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>sid</th></tr></thead>
<tbody>
<tr><td>GD01</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>name</th></tr></thead>
<tbody>
<tr><td>Dũng</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>sid</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>cid</th></tr></thead>
<tbody>
<tr><td>JPD113</td></tr>
</tbody>
</table>
<p class="dap-an">✅ (a) {GD01}. (b) {Dũng}. (c) {JPD113}. The third result (the other direction, Enroll − Student) is empty — it must be, because the foreign key forbids an enrolment of a non-existing student.</p>
<div class="pitfall">Two traps. (1) Why not π<sub>name</sub>(Student) − π<sub>name</sub>(Student ⋈ Enroll)? With duplicate names it breaks: if the second An (SE03) took no course, "An" would still be removed because the first An takes one. Subtract <strong>keys</strong>, then join back for the names. (2) − is not symmetric: Enroll − Student ≠ Student − Enroll.</div>`,
    `<h3>🧪 Bài 4 — phép hiệu: "ai chưa…" (dạng PE · ~10 phút)</h3>
<p class="nhan">Đề</p>
<p>(a) Mã các sinh viên không học môn nào. (b) Tên của họ. (c) Các môn chưa ai học.</p>
<p class="nhan">Lời giải</p>
<p>(a) Mọi sinh viên trừ đi các sinh viên có mặt trong Enroll: <strong>π<sub>sid</sub>(Student) − π<sub>sid</sub>(Enroll)</strong>. (b) Nối kết quả lại với Student để lấy tên: <strong>π<sub>name</sub>((π<sub>sid</sub>(Student) − π<sub>sid</sub>(Enroll)) ⋈ Student)</strong>. (c) <strong>π<sub>cid</sub>(Course) − π<sub>cid</sub>(Enroll)</strong>.</p>
<pre><code class="language-sql">-- π sid (Student) − π sid (Enroll)
SELECT sid FROM Student
EXCEPT
SELECT sid FROM Enroll;</code></pre>
<pre><code class="language-sql">-- rồi π name
SELECT S.name
FROM (SELECT sid FROM Student EXCEPT SELECT sid FROM Enroll) AS T
JOIN Student AS S ON S.sid = T.sid;</code></pre>
<pre><code class="language-sql">-- chiều ngược lại
SELECT sid FROM Enroll
EXCEPT
SELECT sid FROM Student;</code></pre>
<pre><code class="language-sql">-- môn chưa ai học
SELECT cid FROM Course
EXCEPT
SELECT cid FROM Enroll;</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>sid</th></tr></thead>
<tbody>
<tr><td>GD01</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>name</th></tr></thead>
<tbody>
<tr><td>Dũng</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>sid</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>cid</th></tr></thead>
<tbody>
<tr><td>JPD113</td></tr>
</tbody>
</table>
<p class="dap-an">✅ (a) {GD01}. (b) {Dũng}. (c) {JPD113}. Kết quả thứ ba (chiều ngược lại, Enroll − Student) rỗng — và phải rỗng, vì khoá ngoại cấm đăng ký cho một sinh viên không tồn tại.</p>
<div class="pitfall">Hai cái bẫy. (1) Sao không viết π<sub>name</sub>(Student) − π<sub>name</sub>(Student ⋈ Enroll)? Có tên trùng là hỏng: nếu bạn An thứ hai (SE03) không học gì, "An" vẫn bị trừ mất vì bạn An thứ nhất có học. Hãy trừ trên <strong>khoá</strong>, rồi nối lại để lấy tên. (2) − không đối xứng: Enroll − Student ≠ Student − Enroll.</div>`),
    bi(`<h3>🧪 Exercise 5 — θ-join and ρ: a self join (PT style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>List every pair of different students in the same major, each pair once.</p>
<p class="nhan">Solution</p>
<p>We need two copies of Student side by side — that is what ρ is for: <strong>ρ<sub>S1</sub>(Student) ⋈<sub>S1.major=S2.major AND S1.sid&lt;S2.sid</sub> ρ<sub>S2</sub>(Student)</strong>. The condition S1.major = S2.major pairs students of the same major; S1.sid &lt; S2.sid removes (x, x) pairs <em>and</em> keeps only one of (x, y) / (y, x).</p>
<pre><code class="language-sql">CREATE TABLE Student (sid CHAR(4) NOT NULL, name NVARCHAR(20) NOT NULL, major CHAR(2) NOT NULL,
                      CONSTRAINT pk_student PRIMARY KEY (sid));
CREATE TABLE Course  (cid CHAR(6) NOT NULL, title NVARCHAR(30) NOT NULL, credits INT NOT NULL,
                      CONSTRAINT pk_course PRIMARY KEY (cid));
CREATE TABLE Enroll  (sid CHAR(4) NOT NULL, cid CHAR(6) NOT NULL, score DECIMAL(3,1),
                      CONSTRAINT pk_enroll PRIMARY KEY (sid, cid),
                      CONSTRAINT fk_enroll_student FOREIGN KEY (sid) REFERENCES Student(sid),
                      CONSTRAINT fk_enroll_course  FOREIGN KEY (cid) REFERENCES Course(cid));
INSERT INTO Student VALUES ('SE01', N'An', 'SE'), ('SE02', N'Bình', 'SE'), ('AI01', N'Chi', 'AI'),
                           ('SE03', N'An', 'SE'), ('GD01', N'Dũng', 'GD');
INSERT INTO Course VALUES ('DBI202', N'Databases', 3), ('CSD201', N'Data Structures', 3),
                          ('MAE101', N'Mathematics', 3), ('JPD113', N'Japanese 1', 3);
INSERT INTO Enroll VALUES ('SE01', 'DBI202', 8.5), ('SE01', 'CSD201', 7.0), ('SE02', 'DBI202', 6.0),
                          ('SE02', 'MAE101', 9.0), ('AI01', 'DBI202', 9.5), ('AI01', 'CSD201', 8.0),
                          ('SE03', 'CSD201', 5.5);
-- ρ S1 (Student) ⋈ S1.major = S2.major AND S1.sid &lt; S2.sid ρ S2 (Student)
SELECT S1.sid AS sid1, S1.name AS name1, S2.sid AS sid2, S2.name AS name2, S1.major
FROM Student AS S1 JOIN Student AS S2
  ON S1.major = S2.major AND S1.sid &lt; S2.sid
ORDER BY sid1, sid2;
-- TRAP: only S1.major = S2.major (no S1.sid &lt; S2.sid)
SELECT COUNT(*) AS pairs
FROM Student AS S1 JOIN Student AS S2 ON S1.major = S2.major;</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>sid1</th><th>name1</th><th>sid2</th><th>name2</th><th>major</th></tr></thead>
<tbody>
<tr><td>SE01</td><td>An</td><td>SE02</td><td>Bình</td><td>SE</td></tr>
<tr><td>SE01</td><td>An</td><td>SE03</td><td>An</td><td>SE</td></tr>
<tr><td>SE02</td><td>Bình</td><td>SE03</td><td>An</td><td>SE</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>pairs</th></tr></thead>
<tbody>
<tr><td>11</td></tr>
</tbody>
</table>
<p class="dap-an">✅ 3 pairs, all in SE: (SE01, SE02), (SE01, SE03), (SE02, SE03). Chi (AI) and Dũng (GD) are alone in their majors.</p>
<div class="pitfall">With only S1.major = S2.major the join returns <strong>11</strong> rows (the second result): 3 × 3 = 9 for SE, plus Chi with herself and Dũng with himself. Using ≠ instead of &lt; gives 6 — every pair twice.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the ρ that renames columns can be written on the table directly:
<pre><code class="language-sql">CREATE TABLE Student (sid CHAR(4) NOT NULL, name VARCHAR(20) NOT NULL, major CHAR(2) NOT NULL,
                      CONSTRAINT pk_student PRIMARY KEY (sid));
CREATE TABLE Course  (cid CHAR(6) NOT NULL, title VARCHAR(30) NOT NULL, credits INT NOT NULL,
                      CONSTRAINT pk_course PRIMARY KEY (cid));
CREATE TABLE Enroll  (sid CHAR(4) NOT NULL, cid CHAR(6) NOT NULL, score DECIMAL(3,1),
                      CONSTRAINT pk_enroll PRIMARY KEY (sid, cid),
                      CONSTRAINT fk_enroll_student FOREIGN KEY (sid) REFERENCES Student(sid),
                      CONSTRAINT fk_enroll_course  FOREIGN KEY (cid) REFERENCES Course(cid));
INSERT INTO Student VALUES ('SE01', 'An', 'SE'), ('SE02', 'Bình', 'SE'), ('AI01', 'Chi', 'AI'),
                           ('SE03', 'An', 'SE'), ('GD01', 'Dũng', 'GD');
INSERT INTO Course VALUES ('DBI202', 'Databases', 3), ('CSD201', 'Data Structures', 3),
                          ('MAE101', 'Mathematics', 3), ('JPD113', 'Japanese 1', 3);
INSERT INTO Enroll VALUES ('SE01', 'DBI202', 8.5), ('SE01', 'CSD201', 7.0), ('SE02', 'DBI202', 6.0),
                          ('SE02', 'MAE101', 9.0), ('AI01', 'DBI202', 9.5), ('AI01', 'CSD201', 8.0),
                          ('SE03', 'CSD201', 5.5);
-- rename the columns in FROM: student AS s1(sid1, name1, major1)
SELECT sid1, name1, sid2, name2, major1 AS major
FROM student AS s1(sid1, name1, major1)
JOIN student AS s2(sid2, name2, major2)
  ON major1 = major2 AND sid1 &lt; sid2
ORDER BY sid1, sid2;</code></pre>
<div class="out">INSERT 0 5<br>
INSERT 0 4<br>
INSERT 0 7</div>
<table>
<thead><tr><th>sid1</th><th>name1</th><th>sid2</th><th>name2</th><th>major</th></tr></thead>
<tbody>
<tr><td>SE01</td><td>An</td><td>SE02</td><td>Bình</td><td>SE</td></tr>
<tr><td>SE01</td><td>An</td><td>SE03</td><td>An</td><td>SE</td></tr>
<tr><td>SE02</td><td>Bình</td><td>SE03</td><td>An</td><td>SE</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-3-multi-self-join">PostgreSQL 5.3 — multi-table and self joins</a>.</div>`,
    `<h3>🧪 Bài 5 — θ-join và ρ: tự nối (dạng PT · ~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Liệt kê mọi cặp hai sinh viên khác nhau cùng ngành, mỗi cặp một lần.</p>
<p class="nhan">Lời giải</p>
<p>Cần hai bản sao của Student đặt cạnh nhau — ρ sinh ra để làm việc đó: <strong>ρ<sub>S1</sub>(Student) ⋈<sub>S1.major=S2.major AND S1.sid&lt;S2.sid</sub> ρ<sub>S2</sub>(Student)</strong>. Điều kiện S1.major = S2.major ghép các sinh viên cùng ngành; S1.sid &lt; S2.sid bỏ các cặp (x, x) <em>và</em> chỉ giữ một trong hai (x, y) / (y, x).</p>
<pre><code class="language-sql">CREATE TABLE Student (sid CHAR(4) NOT NULL, name NVARCHAR(20) NOT NULL, major CHAR(2) NOT NULL,
                      CONSTRAINT pk_student PRIMARY KEY (sid));
CREATE TABLE Course  (cid CHAR(6) NOT NULL, title NVARCHAR(30) NOT NULL, credits INT NOT NULL,
                      CONSTRAINT pk_course PRIMARY KEY (cid));
CREATE TABLE Enroll  (sid CHAR(4) NOT NULL, cid CHAR(6) NOT NULL, score DECIMAL(3,1),
                      CONSTRAINT pk_enroll PRIMARY KEY (sid, cid),
                      CONSTRAINT fk_enroll_student FOREIGN KEY (sid) REFERENCES Student(sid),
                      CONSTRAINT fk_enroll_course  FOREIGN KEY (cid) REFERENCES Course(cid));
INSERT INTO Student VALUES ('SE01', N'An', 'SE'), ('SE02', N'Bình', 'SE'), ('AI01', N'Chi', 'AI'),
                           ('SE03', N'An', 'SE'), ('GD01', N'Dũng', 'GD');
INSERT INTO Course VALUES ('DBI202', N'Databases', 3), ('CSD201', N'Data Structures', 3),
                          ('MAE101', N'Mathematics', 3), ('JPD113', N'Japanese 1', 3);
INSERT INTO Enroll VALUES ('SE01', 'DBI202', 8.5), ('SE01', 'CSD201', 7.0), ('SE02', 'DBI202', 6.0),
                          ('SE02', 'MAE101', 9.0), ('AI01', 'DBI202', 9.5), ('AI01', 'CSD201', 8.0),
                          ('SE03', 'CSD201', 5.5);
-- ρ S1 (Student) ⋈ S1.major = S2.major AND S1.sid &lt; S2.sid ρ S2 (Student)
SELECT S1.sid AS sid1, S1.name AS name1, S2.sid AS sid2, S2.name AS name2, S1.major
FROM Student AS S1 JOIN Student AS S2
  ON S1.major = S2.major AND S1.sid &lt; S2.sid
ORDER BY sid1, sid2;
-- BẪY: chỉ có S1.major = S2.major
SELECT COUNT(*) AS pairs
FROM Student AS S1 JOIN Student AS S2 ON S1.major = S2.major;</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>sid1</th><th>name1</th><th>sid2</th><th>name2</th><th>major</th></tr></thead>
<tbody>
<tr><td>SE01</td><td>An</td><td>SE02</td><td>Bình</td><td>SE</td></tr>
<tr><td>SE01</td><td>An</td><td>SE03</td><td>An</td><td>SE</td></tr>
<tr><td>SE02</td><td>Bình</td><td>SE03</td><td>An</td><td>SE</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>pairs</th></tr></thead>
<tbody>
<tr><td>11</td></tr>
</tbody>
</table>
<p class="dap-an">✅ 3 cặp, đều ngành SE: (SE01, SE02), (SE01, SE03), (SE02, SE03). Chi (AI) và Dũng (GD) một mình một ngành.</p>
<div class="pitfall">Chỉ có S1.major = S2.major thì phép nối trả về <strong>11</strong> dòng (kết quả thứ hai): 3 × 3 = 9 cho SE, cộng Chi với chính Chi và Dũng với chính Dũng. Dùng ≠ thay cho &lt; thì ra 6 — mỗi cặp hai lần.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> phép ρ đổi tên cột viết được ngay trên bảng:
<pre><code class="language-sql">CREATE TABLE Student (sid CHAR(4) NOT NULL, name VARCHAR(20) NOT NULL, major CHAR(2) NOT NULL,
                      CONSTRAINT pk_student PRIMARY KEY (sid));
CREATE TABLE Course  (cid CHAR(6) NOT NULL, title VARCHAR(30) NOT NULL, credits INT NOT NULL,
                      CONSTRAINT pk_course PRIMARY KEY (cid));
CREATE TABLE Enroll  (sid CHAR(4) NOT NULL, cid CHAR(6) NOT NULL, score DECIMAL(3,1),
                      CONSTRAINT pk_enroll PRIMARY KEY (sid, cid),
                      CONSTRAINT fk_enroll_student FOREIGN KEY (sid) REFERENCES Student(sid),
                      CONSTRAINT fk_enroll_course  FOREIGN KEY (cid) REFERENCES Course(cid));
INSERT INTO Student VALUES ('SE01', 'An', 'SE'), ('SE02', 'Bình', 'SE'), ('AI01', 'Chi', 'AI'),
                           ('SE03', 'An', 'SE'), ('GD01', 'Dũng', 'GD');
INSERT INTO Course VALUES ('DBI202', 'Databases', 3), ('CSD201', 'Data Structures', 3),
                          ('MAE101', 'Mathematics', 3), ('JPD113', 'Japanese 1', 3);
INSERT INTO Enroll VALUES ('SE01', 'DBI202', 8.5), ('SE01', 'CSD201', 7.0), ('SE02', 'DBI202', 6.0),
                          ('SE02', 'MAE101', 9.0), ('AI01', 'DBI202', 9.5), ('AI01', 'CSD201', 8.0),
                          ('SE03', 'CSD201', 5.5);
-- đổi tên cột ngay trong FROM
SELECT sid1, name1, sid2, name2, major1 AS major
FROM student AS s1(sid1, name1, major1)
JOIN student AS s2(sid2, name2, major2)
  ON major1 = major2 AND sid1 &lt; sid2
ORDER BY sid1, sid2;</code></pre>
<div class="out">INSERT 0 5<br>
INSERT 0 4<br>
INSERT 0 7</div>
<table>
<thead><tr><th>sid1</th><th>name1</th><th>sid2</th><th>name2</th><th>major</th></tr></thead>
<tbody>
<tr><td>SE01</td><td>An</td><td>SE02</td><td>Bình</td><td>SE</td></tr>
<tr><td>SE01</td><td>An</td><td>SE03</td><td>An</td><td>SE</td></tr>
<tr><td>SE02</td><td>Bình</td><td>SE03</td><td>An</td><td>SE</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-3-multi-self-join">PostgreSQL 5.3 — nối nhiều bảng và tự nối</a>.</div>`),
    bi(`<h3>🧪 Exercise 6 — bags: two cafés' sales (FE style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>Two branches of a café record each cup sold (no key — one row per cup, so each table is a bag). SaleQ1 = {cà phê sữa ×3, trà đào ×1, bạc xỉu ×1}, SaleQ3 = {trà đào ×2, cà phê sữa ×1}. Compute, as <strong>bags</strong>: SaleQ1 ∪ SaleQ3, SaleQ1 ∩ SaleQ3, SaleQ1 − SaleQ3; and compare with the set answers.</p>
<p class="nhan">Solution — count copies first</p>
<table>
<thead><tr><th>drink</th><th>n (Q1)</th><th>m (Q3)</th><th>∪ n + m</th><th>∩ MIN(n, m)</th><th>− MAX(0, n − m)</th></tr></thead>
<tbody>
<tr><td>cà phê sữa</td><td>3</td><td>1</td><td>4</td><td>1</td><td>2</td></tr>
<tr><td>trà đào</td><td>1</td><td>2</td><td>3</td><td>1</td><td>0</td></tr>
<tr><td>bạc xỉu</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>total</td><td>5</td><td>3</td><td>8</td><td>2</td><td>3</td></tr>
</tbody>
</table>
<pre><code class="language-sql">CREATE TABLE SaleQ1 (drink NVARCHAR(20));   -- branch District 1, no key: a bag
CREATE TABLE SaleQ3 (drink NVARCHAR(20));   -- branch District 3
INSERT INTO SaleQ1 VALUES (N'cà phê sữa'), (N'trà đào'), (N'cà phê sữa'), (N'bạc xỉu'), (N'cà phê sữa');
INSERT INTO SaleQ3 VALUES (N'trà đào'), (N'cà phê sữa'), (N'trà đào');</code></pre>
<pre><code class="language-sql">SELECT drink FROM SaleQ1 UNION ALL SELECT drink FROM SaleQ3 ORDER BY drink;  -- bag ∪
SELECT drink FROM SaleQ1 UNION     SELECT drink FROM SaleQ3;                 -- set ∪</code></pre>
<pre><code class="language-sql">-- bag ∩ on SQL Server: number the copies, then INTERSECT
SELECT drink FROM (
  SELECT drink, ROW_NUMBER() OVER (PARTITION BY drink ORDER BY drink) AS n FROM SaleQ1
  INTERSECT
  SELECT drink, ROW_NUMBER() OVER (PARTITION BY drink ORDER BY drink) AS n FROM SaleQ3
) AS T;</code></pre>
<pre><code class="language-sql">-- bag − : SaleQ1 − SaleQ3
SELECT drink FROM (
  SELECT drink, ROW_NUMBER() OVER (PARTITION BY drink ORDER BY drink) AS n FROM SaleQ1
  EXCEPT
  SELECT drink, ROW_NUMBER() OVER (PARTITION BY drink ORDER BY drink) AS n FROM SaleQ3
) AS T;
-- set − for comparison
SELECT drink FROM SaleQ1 EXCEPT SELECT drink FROM SaleQ3;</code></pre>
<div class="out">(5 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>drink</th></tr></thead>
<tbody>
<tr><td>bạc xỉu</td></tr>
<tr><td>cà phê sữa</td></tr>
<tr><td>cà phê sữa</td></tr>
<tr><td>cà phê sữa</td></tr>
<tr><td>cà phê sữa</td></tr>
<tr><td>trà đào</td></tr>
<tr><td>trà đào</td></tr>
<tr><td>trà đào</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>drink</th></tr></thead>
<tbody>
<tr><td>bạc xỉu</td></tr>
<tr><td>cà phê sữa</td></tr>
<tr><td>trà đào</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>drink</th></tr></thead>
<tbody>
<tr><td>cà phê sữa</td></tr>
<tr><td>trà đào</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>drink</th></tr></thead>
<tbody>
<tr><td>bạc xỉu</td></tr>
<tr><td>cà phê sữa</td></tr>
<tr><td>cà phê sữa</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>drink</th></tr></thead>
<tbody>
<tr><td>bạc xỉu</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Bag ∪: 8 rows (UNION ALL). Set ∪: 3 drinks (UNION). Bag ∩: {cà phê sữa, trà đào}. Bag −: {cà phê sữa, cà phê sữa, bạc xỉu} — "Q1 sold 2 more milk coffees and 1 more bạc xỉu than Q3". Set −: only {bạc xỉu} — the set version cannot say "more", only "not at all".</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> (what you will type at work) the bag operators are keywords — no ROW_NUMBER trick:
<pre><code class="language-sql">CREATE TABLE SaleQ1 (drink VARCHAR(20));   -- branch District 1, no key: a bag
CREATE TABLE SaleQ3 (drink VARCHAR(20));   -- branch District 3
INSERT INTO SaleQ1 VALUES ('cà phê sữa'), ('trà đào'), ('cà phê sữa'), ('bạc xỉu'), ('cà phê sữa');
INSERT INTO SaleQ3 VALUES ('trà đào'), ('cà phê sữa'), ('trà đào');
SELECT drink FROM saleq1 INTERSECT ALL SELECT drink FROM saleq3;   -- bag ∩
SELECT drink FROM saleq1 EXCEPT ALL    SELECT drink FROM saleq3;   -- bag −</code></pre>
<div class="out">INSERT 0 5<br>
INSERT 0 3</div>
<table>
<thead><tr><th>drink</th></tr></thead>
<tbody>
<tr><td>cà phê sữa</td></tr>
<tr><td>trà đào</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>drink</th></tr></thead>
<tbody>
<tr><td>cà phê sữa</td></tr>
<tr><td>cà phê sữa</td></tr>
<tr><td>bạc xỉu</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT, DISTINCT</a>.</div>`,
    `<h3>🧪 Bài 6 — túi: doanh số hai quán cà phê (dạng FE · ~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Hai chi nhánh một quán cà phê ghi lại từng ly bán ra (không có khoá — mỗi ly một dòng, nên mỗi bảng là một túi). SaleQ1 = {cà phê sữa ×3, trà đào ×1, bạc xỉu ×1}, SaleQ3 = {trà đào ×2, cà phê sữa ×1}. Tính theo <strong>túi</strong>: SaleQ1 ∪ SaleQ3, SaleQ1 ∩ SaleQ3, SaleQ1 − SaleQ3; rồi so với đáp án theo tập.</p>
<p class="nhan">Lời giải — đếm số bản trước</p>
<table>
<thead><tr><th>drink</th><th>n (Q1)</th><th>m (Q3)</th><th>∪ n + m</th><th>∩ MIN(n, m)</th><th>− MAX(0, n − m)</th></tr></thead>
<tbody>
<tr><td>cà phê sữa</td><td>3</td><td>1</td><td>4</td><td>1</td><td>2</td></tr>
<tr><td>trà đào</td><td>1</td><td>2</td><td>3</td><td>1</td><td>0</td></tr>
<tr><td>bạc xỉu</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>tổng</td><td>5</td><td>3</td><td>8</td><td>2</td><td>3</td></tr>
</tbody>
</table>
<pre><code class="language-sql">CREATE TABLE SaleQ1 (drink NVARCHAR(20));   -- chi nhánh Quận 1, không khoá: một túi
CREATE TABLE SaleQ3 (drink NVARCHAR(20));   -- chi nhánh Quận 3
INSERT INTO SaleQ1 VALUES (N'cà phê sữa'), (N'trà đào'), (N'cà phê sữa'), (N'bạc xỉu'), (N'cà phê sữa');
INSERT INTO SaleQ3 VALUES (N'trà đào'), (N'cà phê sữa'), (N'trà đào');</code></pre>
<pre><code class="language-sql">SELECT drink FROM SaleQ1 UNION ALL SELECT drink FROM SaleQ3 ORDER BY drink;  -- hợp túi
SELECT drink FROM SaleQ1 UNION     SELECT drink FROM SaleQ3;                 -- hợp tập</code></pre>
<pre><code class="language-sql">-- giao túi trên SQL Server: đánh số bản, rồi INTERSECT
SELECT drink FROM (
  SELECT drink, ROW_NUMBER() OVER (PARTITION BY drink ORDER BY drink) AS n FROM SaleQ1
  INTERSECT
  SELECT drink, ROW_NUMBER() OVER (PARTITION BY drink ORDER BY drink) AS n FROM SaleQ3
) AS T;</code></pre>
<pre><code class="language-sql">-- hiệu túi
SELECT drink FROM (
  SELECT drink, ROW_NUMBER() OVER (PARTITION BY drink ORDER BY drink) AS n FROM SaleQ1
  EXCEPT
  SELECT drink, ROW_NUMBER() OVER (PARTITION BY drink ORDER BY drink) AS n FROM SaleQ3
) AS T;
-- hiệu tập để so
SELECT drink FROM SaleQ1 EXCEPT SELECT drink FROM SaleQ3;</code></pre>
<div class="out">(5 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>drink</th></tr></thead>
<tbody>
<tr><td>bạc xỉu</td></tr>
<tr><td>cà phê sữa</td></tr>
<tr><td>cà phê sữa</td></tr>
<tr><td>cà phê sữa</td></tr>
<tr><td>cà phê sữa</td></tr>
<tr><td>trà đào</td></tr>
<tr><td>trà đào</td></tr>
<tr><td>trà đào</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>drink</th></tr></thead>
<tbody>
<tr><td>bạc xỉu</td></tr>
<tr><td>cà phê sữa</td></tr>
<tr><td>trà đào</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>drink</th></tr></thead>
<tbody>
<tr><td>cà phê sữa</td></tr>
<tr><td>trà đào</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>drink</th></tr></thead>
<tbody>
<tr><td>bạc xỉu</td></tr>
<tr><td>cà phê sữa</td></tr>
<tr><td>cà phê sữa</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>drink</th></tr></thead>
<tbody>
<tr><td>bạc xỉu</td></tr>
</tbody>
</table>
<p class="dap-an">✅ ∪ túi: 8 dòng (UNION ALL). ∪ tập: 3 loại đồ uống (UNION). ∩ túi: {cà phê sữa, trà đào}. − túi: {cà phê sữa, cà phê sữa, bạc xỉu} — "Q1 bán nhiều hơn Q3 2 ly cà phê sữa và 1 ly bạc xỉu". − tập: chỉ {bạc xỉu} — bản tập không nói được "nhiều hơn", chỉ nói được "hoàn toàn không có".</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> (thứ bạn sẽ gõ khi đi làm) các phép trên túi là từ khoá sẵn — không cần mẹo ROW_NUMBER:
<pre><code class="language-sql">CREATE TABLE SaleQ1 (drink VARCHAR(20));   -- chi nhánh Quận 1, không khoá: một túi
CREATE TABLE SaleQ3 (drink VARCHAR(20));   -- chi nhánh Quận 3
INSERT INTO SaleQ1 VALUES ('cà phê sữa'), ('trà đào'), ('cà phê sữa'), ('bạc xỉu'), ('cà phê sữa');
INSERT INTO SaleQ3 VALUES ('trà đào'), ('cà phê sữa'), ('trà đào');
SELECT drink FROM saleq1 INTERSECT ALL SELECT drink FROM saleq3;   -- bag ∩
SELECT drink FROM saleq1 EXCEPT ALL    SELECT drink FROM saleq3;   -- bag −</code></pre>
<div class="out">INSERT 0 5<br>
INSERT 0 3</div>
<table>
<thead><tr><th>drink</th></tr></thead>
<tbody>
<tr><td>cà phê sữa</td></tr>
<tr><td>trà đào</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>drink</th></tr></thead>
<tbody>
<tr><td>cà phê sữa</td></tr>
<tr><td>cà phê sữa</td></tr>
<tr><td>bạc xỉu</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">PostgreSQL 4.3 — ORDER BY, LIMIT, DISTINCT</a>.</div>`),
    bi(`<h3>🧪 Exercise 7 — γ, σ after γ, τ (PE style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>For each course with at least 2 students, give the number of students and the average score, best average first.</p>
<p class="nhan">Solution</p>
<p>Inside out: group Enroll by cid and aggregate; keep the groups with n ≥ 2 (a σ <em>on the result of γ</em>); sort: <strong>τ<sub>avgScore DESC</sub>(σ<sub>n≥2</sub>(γ<sub>cid, COUNT(sid)→n, AVG(score)→avgScore</sub>(Enroll)))</strong>.</p>
<pre><code class="language-sql">-- γ cid, COUNT(sid)→n, AVG(score)→avgScore (Enroll)
SELECT cid, COUNT(sid) AS n, AVG(score) AS avgScore
FROM Enroll
GROUP BY cid;</code></pre>
<pre><code class="language-sql">-- τ avgScore DESC ( σ n&gt;=2 ( γ cid, COUNT(sid)→n, AVG(score)→avgScore (Enroll) ) )
SELECT cid, COUNT(sid) AS n, CAST(AVG(score) AS DECIMAL(4,2)) AS avgScore
FROM Enroll
GROUP BY cid
HAVING COUNT(sid) &gt;= 2
ORDER BY avgScore DESC;</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>cid</th><th>n</th><th>avgScore</th></tr></thead>
<tbody>
<tr><td>CSD201</td><td>3</td><td>6.833333</td></tr>
<tr><td>DBI202</td><td>3</td><td>8.000000</td></tr>
<tr><td>MAE101</td><td>1</td><td>9.000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>cid</th><th>n</th><th>avgScore</th></tr></thead>
<tbody>
<tr><td>DBI202</td><td>3</td><td>8.00</td></tr>
<tr><td>CSD201</td><td>3</td><td>6.83</td></tr>
</tbody>
</table>
<p>After γ: 3 groups (JPD113 has no row in Enroll, so it has no group at all). σ<sub>n≥2</sub> drops MAE101 (1 student). τ puts DBI202 (8.00) before CSD201 (6.83). In SQL, a σ on the result of γ is <strong>HAVING</strong>; a σ <em>before</em> γ would be WHERE. <code>CAST(… AS DECIMAL(4,2))</code> only rounds the display to 2 decimals.</p>
<p class="dap-an">✅ DBI202 — 3 students — 8.00; CSD201 — 3 — 6.83.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> round with <code>ROUND(x, 2)</code> (and an alias can be used in ORDER BY the same way):
<pre><code class="language-sql">CREATE TABLE Student (sid CHAR(4) NOT NULL, name VARCHAR(20) NOT NULL, major CHAR(2) NOT NULL,
                      CONSTRAINT pk_student PRIMARY KEY (sid));
CREATE TABLE Course  (cid CHAR(6) NOT NULL, title VARCHAR(30) NOT NULL, credits INT NOT NULL,
                      CONSTRAINT pk_course PRIMARY KEY (cid));
CREATE TABLE Enroll  (sid CHAR(4) NOT NULL, cid CHAR(6) NOT NULL, score DECIMAL(3,1),
                      CONSTRAINT pk_enroll PRIMARY KEY (sid, cid),
                      CONSTRAINT fk_enroll_student FOREIGN KEY (sid) REFERENCES Student(sid),
                      CONSTRAINT fk_enroll_course  FOREIGN KEY (cid) REFERENCES Course(cid));
INSERT INTO Student VALUES ('SE01', 'An', 'SE'), ('SE02', 'Bình', 'SE'), ('AI01', 'Chi', 'AI'),
                           ('SE03', 'An', 'SE'), ('GD01', 'Dũng', 'GD');
INSERT INTO Course VALUES ('DBI202', 'Databases', 3), ('CSD201', 'Data Structures', 3),
                          ('MAE101', 'Mathematics', 3), ('JPD113', 'Japanese 1', 3);
INSERT INTO Enroll VALUES ('SE01', 'DBI202', 8.5), ('SE01', 'CSD201', 7.0), ('SE02', 'DBI202', 6.0),
                          ('SE02', 'MAE101', 9.0), ('AI01', 'DBI202', 9.5), ('AI01', 'CSD201', 8.0),
                          ('SE03', 'CSD201', 5.5);
SELECT cid, COUNT(sid) AS n, ROUND(AVG(score), 2) AS avg_score
FROM enroll
GROUP BY cid
HAVING COUNT(sid) &gt;= 2
ORDER BY avg_score DESC;</code></pre>
<div class="out">INSERT 0 5<br>
INSERT 0 4<br>
INSERT 0 7</div>
<table>
<thead><tr><th>cid</th><th>n</th><th>avg_score</th></tr></thead>
<tbody>
<tr><td>DBI202</td><td>3</td><td>8.00</td></tr>
<tr><td>CSD201</td><td>3</td><td>6.83</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-3-having-filter">PostgreSQL 6.3 — HAVING and FILTER</a>.</div>
<div class="pitfall"><code>WHERE COUNT(sid) &gt;= 2</code> is an error: WHERE runs before grouping, when there is nothing to count yet. Conditions on aggregates go in HAVING.</div>`,
    `<h3>🧪 Bài 7 — γ, σ sau γ, τ (dạng PE · ~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Với mỗi môn có từ 2 sinh viên trở lên, cho số sinh viên và điểm trung bình, môn có trung bình cao nhất lên trước.</p>
<p class="nhan">Lời giải</p>
<p>Từ trong ra ngoài: nhóm Enroll theo cid rồi gộp; giữ các nhóm có n ≥ 2 (một σ <em>trên kết quả của γ</em>); sắp xếp: <strong>τ<sub>avgScore DESC</sub>(σ<sub>n≥2</sub>(γ<sub>cid, COUNT(sid)→n, AVG(score)→avgScore</sub>(Enroll)))</strong>.</p>
<pre><code class="language-sql">-- γ cid, COUNT(sid)→n, AVG(score)→avgScore (Enroll)
SELECT cid, COUNT(sid) AS n, AVG(score) AS avgScore
FROM Enroll
GROUP BY cid;</code></pre>
<pre><code class="language-sql">-- τ avgScore DESC ( σ n&gt;=2 ( γ cid, COUNT(sid)→n, AVG(score)→avgScore (Enroll) ) )
SELECT cid, COUNT(sid) AS n, CAST(AVG(score) AS DECIMAL(4,2)) AS avgScore
FROM Enroll
GROUP BY cid
HAVING COUNT(sid) &gt;= 2
ORDER BY avgScore DESC;</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>cid</th><th>n</th><th>avgScore</th></tr></thead>
<tbody>
<tr><td>CSD201</td><td>3</td><td>6.833333</td></tr>
<tr><td>DBI202</td><td>3</td><td>8.000000</td></tr>
<tr><td>MAE101</td><td>1</td><td>9.000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>cid</th><th>n</th><th>avgScore</th></tr></thead>
<tbody>
<tr><td>DBI202</td><td>3</td><td>8.00</td></tr>
<tr><td>CSD201</td><td>3</td><td>6.83</td></tr>
</tbody>
</table>
<p>Sau γ: 3 nhóm (JPD113 không có dòng nào trong Enroll nên không có nhóm). σ<sub>n≥2</sub> bỏ MAE101 (1 sinh viên). τ đặt DBI202 (8.00) trước CSD201 (6.83). Trong SQL, σ trên kết quả của γ là <strong>HAVING</strong>; σ <em>trước</em> γ là WHERE. <code>CAST(… AS DECIMAL(4,2))</code> chỉ làm tròn phần hiển thị còn 2 chữ số thập phân.</p>
<p class="dap-an">✅ DBI202 — 3 sinh viên — 8.00; CSD201 — 3 — 6.83.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> làm tròn bằng <code>ROUND(x, 2)</code> (và bí danh cũng dùng được trong ORDER BY như vậy):
<pre><code class="language-sql">CREATE TABLE Student (sid CHAR(4) NOT NULL, name VARCHAR(20) NOT NULL, major CHAR(2) NOT NULL,
                      CONSTRAINT pk_student PRIMARY KEY (sid));
CREATE TABLE Course  (cid CHAR(6) NOT NULL, title VARCHAR(30) NOT NULL, credits INT NOT NULL,
                      CONSTRAINT pk_course PRIMARY KEY (cid));
CREATE TABLE Enroll  (sid CHAR(4) NOT NULL, cid CHAR(6) NOT NULL, score DECIMAL(3,1),
                      CONSTRAINT pk_enroll PRIMARY KEY (sid, cid),
                      CONSTRAINT fk_enroll_student FOREIGN KEY (sid) REFERENCES Student(sid),
                      CONSTRAINT fk_enroll_course  FOREIGN KEY (cid) REFERENCES Course(cid));
INSERT INTO Student VALUES ('SE01', 'An', 'SE'), ('SE02', 'Bình', 'SE'), ('AI01', 'Chi', 'AI'),
                           ('SE03', 'An', 'SE'), ('GD01', 'Dũng', 'GD');
INSERT INTO Course VALUES ('DBI202', 'Databases', 3), ('CSD201', 'Data Structures', 3),
                          ('MAE101', 'Mathematics', 3), ('JPD113', 'Japanese 1', 3);
INSERT INTO Enroll VALUES ('SE01', 'DBI202', 8.5), ('SE01', 'CSD201', 7.0), ('SE02', 'DBI202', 6.0),
                          ('SE02', 'MAE101', 9.0), ('AI01', 'DBI202', 9.5), ('AI01', 'CSD201', 8.0),
                          ('SE03', 'CSD201', 5.5);
SELECT cid, COUNT(sid) AS n, ROUND(AVG(score), 2) AS avg_score
FROM enroll
GROUP BY cid
HAVING COUNT(sid) &gt;= 2
ORDER BY avg_score DESC;</code></pre>
<div class="out">INSERT 0 5<br>
INSERT 0 4<br>
INSERT 0 7</div>
<table>
<thead><tr><th>cid</th><th>n</th><th>avg_score</th></tr></thead>
<tbody>
<tr><td>DBI202</td><td>3</td><td>8.00</td></tr>
<tr><td>CSD201</td><td>3</td><td>6.83</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-3-having-filter">PostgreSQL 6.3 — HAVING và FILTER</a>.</div>
<div class="pitfall"><code>WHERE COUNT(sid) &gt;= 2</code> là lỗi: WHERE chạy trước khi nhóm, lúc chưa có gì để đếm. Điều kiện trên hàm gộp phải đặt trong HAVING.</div>`),
    bi(`<h3>🧪 Exercise 8 — outer join + γ: counting zeros (PE style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>List <em>every</em> course with its number of students — JPD113, which nobody takes, must appear with 0.</p>
<p class="nhan">Solution</p>
<p>A plain join loses JPD113 (it is dangling). Keep it with a left outer join, then group: <strong>γ<sub>cid, title, COUNT(sid)→students</sub>(Course ⟕ Enroll)</strong>.</p>
<pre><code class="language-sql">-- step 1: Course ⟕ Enroll
SELECT C.cid, C.title, E.sid, E.score
FROM Course AS C LEFT OUTER JOIN Enroll AS E ON C.cid = E.cid
ORDER BY C.cid;</code></pre>
<pre><code class="language-sql">-- step 2: γ cid, title, COUNT(sid)→students (step 1)
SELECT C.cid, C.title, COUNT(E.sid) AS students
FROM Course AS C LEFT OUTER JOIN Enroll AS E ON C.cid = E.cid
GROUP BY C.cid, C.title
ORDER BY students DESC, C.cid;</code></pre>
<pre><code class="language-sql">-- TRAP 1: COUNT(*) counts the padded row too
SELECT C.cid, COUNT(*) AS wrong_count
FROM Course AS C LEFT OUTER JOIN Enroll AS E ON C.cid = E.cid
GROUP BY C.cid
ORDER BY C.cid;
-- TRAP 2: an inner join drops JPD113 completely
SELECT C.cid, COUNT(E.sid) AS students
FROM Course AS C JOIN Enroll AS E ON C.cid = E.cid
GROUP BY C.cid
ORDER BY C.cid;</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>cid</th><th>title</th><th>sid</th><th>score</th></tr></thead>
<tbody>
<tr><td>CSD201</td><td>Data Structures</td><td>AI01</td><td>8.0</td></tr>
<tr><td>CSD201</td><td>Data Structures</td><td>SE01</td><td>7.0</td></tr>
<tr><td>CSD201</td><td>Data Structures</td><td>SE03</td><td>5.5</td></tr>
<tr><td>DBI202</td><td>Databases</td><td>AI01</td><td>9.5</td></tr>
<tr><td>DBI202</td><td>Databases</td><td>SE01</td><td>8.5</td></tr>
<tr><td>DBI202</td><td>Databases</td><td>SE02</td><td>6.0</td></tr>
<tr><td>JPD113</td><td>Japanese 1</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
<tr><td>MAE101</td><td>Mathematics</td><td>SE02</td><td>9.0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>cid</th><th>title</th><th>students</th></tr></thead>
<tbody>
<tr><td>CSD201</td><td>Data Structures</td><td>3</td></tr>
<tr><td>DBI202</td><td>Databases</td><td>3</td></tr>
<tr><td>MAE101</td><td>Mathematics</td><td>1</td></tr>
<tr><td>JPD113</td><td>Japanese 1</td><td>0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>cid</th><th>wrong_count</th></tr></thead>
<tbody>
<tr><td>CSD201</td><td>3</td></tr>
<tr><td>DBI202</td><td>3</td></tr>
<tr><td>JPD113</td><td>1</td></tr>
<tr><td>MAE101</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>cid</th><th>students</th></tr></thead>
<tbody>
<tr><td>CSD201</td><td>3</td></tr>
<tr><td>DBI202</td><td>3</td></tr>
<tr><td>MAE101</td><td>1</td></tr>
</tbody>
</table>
<p>Step 1: 8 rows — the 7 enrolments plus JPD113 padded with NULL (⊥) in sid and score. Step 2: COUNT(E.sid) counts only non-NULL sids, so JPD113 gets <strong>0</strong>.</p>
<p class="dap-an">✅ CSD201 3, DBI202 3, MAE101 1, JPD113 0.</p>
<div class="pitfall">Trap 1 (third result): <code>COUNT(*)</code> counts rows, and the padded row is a row — JPD113 gets 1. Count a column of the right-hand table instead. Trap 2 (fourth result): an inner JOIN makes JPD113 disappear completely — 3 rows instead of 4. Both mistakes are frequent in PE.</div>`,
    `<h3>🧪 Bài 8 — nối ngoài + γ: đếm cả số 0 (dạng PE · ~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Liệt kê <em>mọi</em> môn học kèm số sinh viên — JPD113, môn chưa ai học, phải có mặt với số 0.</p>
<p class="nhan">Lời giải</p>
<p>Nối thường làm mất JPD113 (nó là bộ treo). Giữ nó lại bằng nối ngoài trái, rồi nhóm: <strong>γ<sub>cid, title, COUNT(sid)→students</sub>(Course ⟕ Enroll)</strong>.</p>
<pre><code class="language-sql">-- bước 1
SELECT C.cid, C.title, E.sid, E.score
FROM Course AS C LEFT OUTER JOIN Enroll AS E ON C.cid = E.cid
ORDER BY C.cid;</code></pre>
<pre><code class="language-sql">-- bước 2
SELECT C.cid, C.title, COUNT(E.sid) AS students
FROM Course AS C LEFT OUTER JOIN Enroll AS E ON C.cid = E.cid
GROUP BY C.cid, C.title
ORDER BY students DESC, C.cid;</code></pre>
<pre><code class="language-sql">-- BẪY 1: COUNT(*) đếm cả dòng được đệm NULL
SELECT C.cid, COUNT(*) AS wrong_count
FROM Course AS C LEFT OUTER JOIN Enroll AS E ON C.cid = E.cid
GROUP BY C.cid
ORDER BY C.cid;
-- BẪY 2: nối trong làm mất hẳn JPD113
SELECT C.cid, COUNT(E.sid) AS students
FROM Course AS C JOIN Enroll AS E ON C.cid = E.cid
GROUP BY C.cid
ORDER BY C.cid;</code></pre>
<div class="out">(5 rows affected)<br>
(4 rows affected)<br>
(7 rows affected)</div>
<table>
<thead><tr><th>cid</th><th>title</th><th>sid</th><th>score</th></tr></thead>
<tbody>
<tr><td>CSD201</td><td>Data Structures</td><td>AI01</td><td>8.0</td></tr>
<tr><td>CSD201</td><td>Data Structures</td><td>SE01</td><td>7.0</td></tr>
<tr><td>CSD201</td><td>Data Structures</td><td>SE03</td><td>5.5</td></tr>
<tr><td>DBI202</td><td>Databases</td><td>AI01</td><td>9.5</td></tr>
<tr><td>DBI202</td><td>Databases</td><td>SE01</td><td>8.5</td></tr>
<tr><td>DBI202</td><td>Databases</td><td>SE02</td><td>6.0</td></tr>
<tr><td>JPD113</td><td>Japanese 1</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
<tr><td>MAE101</td><td>Mathematics</td><td>SE02</td><td>9.0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>cid</th><th>title</th><th>students</th></tr></thead>
<tbody>
<tr><td>CSD201</td><td>Data Structures</td><td>3</td></tr>
<tr><td>DBI202</td><td>Databases</td><td>3</td></tr>
<tr><td>MAE101</td><td>Mathematics</td><td>1</td></tr>
<tr><td>JPD113</td><td>Japanese 1</td><td>0</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>cid</th><th>wrong_count</th></tr></thead>
<tbody>
<tr><td>CSD201</td><td>3</td></tr>
<tr><td>DBI202</td><td>3</td></tr>
<tr><td>JPD113</td><td>1</td></tr>
<tr><td>MAE101</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>cid</th><th>students</th></tr></thead>
<tbody>
<tr><td>CSD201</td><td>3</td></tr>
<tr><td>DBI202</td><td>3</td></tr>
<tr><td>MAE101</td><td>1</td></tr>
</tbody>
</table>
<p>Bước 1: 8 dòng — 7 lượt đăng ký cộng JPD113 được đệm NULL (⊥) ở sid và score. Bước 2: COUNT(E.sid) chỉ đếm các sid khác NULL, nên JPD113 được <strong>0</strong>.</p>
<p class="dap-an">✅ CSD201 3, DBI202 3, MAE101 1, JPD113 0.</p>
<div class="pitfall">Bẫy 1 (kết quả thứ ba): <code>COUNT(*)</code> đếm dòng, mà dòng được đệm cũng là một dòng — JPD113 thành 1. Hãy đếm một cột của bảng bên phải. Bẫy 2 (kết quả thứ tư): JOIN thường làm JPD113 biến mất hẳn — 3 dòng thay vì 4. Cả hai lỗi đều hay gặp trong bài PE.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>relation</strong></td><td>quan hệ</td><td>A table: a named set (or bag) of tuples with the same attributes.</td></tr>
<tr><td><strong>schema / instance</strong></td><td>lược đồ / thể hiện</td><td>The schema is the name and attributes; the instance is the rows stored now.</td></tr>
<tr><td><strong>degree / cardinality</strong></td><td>bậc / lực lượng</td><td>Number of columns / number of rows of a relation.</td></tr>
<tr><td><strong>foreign key</strong></td><td>khoá ngoại</td><td>Attributes whose values must exist in the key of another relation.</td></tr>
<tr><td><strong>relational algebra</strong></td><td>đại số quan hệ</td><td>Operators that take relations and return a relation.</td></tr>
<tr><td><strong>selection σ</strong></td><td>phép chọn</td><td>Keeps the rows that satisfy a condition — SQL WHERE.</td></tr>
<tr><td><strong>projection π</strong></td><td>phép chiếu</td><td>Keeps some columns — the SELECT list (with DISTINCT on sets).</td></tr>
<tr><td><strong>type compatible</strong></td><td>tương thích kiểu</td><td>Same number of attributes with compatible domains; required for ∪ ∩ −.</td></tr>
<tr><td><strong>Cartesian product ×</strong></td><td>tích Descartes</td><td>Every tuple of R paired with every tuple of S — CROSS JOIN.</td></tr>
<tr><td><strong>theta-join ⋈θ</strong></td><td>phép nối theta</td><td>σθ(R × S): pairs that satisfy a condition — JOIN … ON.</td></tr>
<tr><td><strong>natural join ⋈</strong></td><td>phép nối tự nhiên</td><td>Pairs equal on all common attributes, which are kept once.</td></tr>
<tr><td><strong>rename ρ</strong></td><td>phép đổi tên</td><td>Gives a relation or its attributes new names — AS in SQL.</td></tr>
<tr><td><strong>bag (multiset)</strong></td><td>túi (đa tập)</td><td>A collection where the same tuple may appear several times; SQL tables are bags.</td></tr>
<tr><td><strong>duplicate elimination δ</strong></td><td>loại bỏ trùng lặp</td><td>Turns a bag into a set — SELECT DISTINCT.</td></tr>
<tr><td><strong>grouping γ</strong></td><td>phép nhóm</td><td>Partitions rows by grouping attributes and aggregates each group — GROUP BY.</td></tr>
<tr><td><strong>sorting τ</strong></td><td>phép sắp xếp</td><td>Orders the tuples by a list of attributes — ORDER BY.</td></tr>
<tr><td><strong>dangling tuple</strong></td><td>bộ treo</td><td>A tuple that matches nothing in the other relation of a join.</td></tr>
<tr><td><strong>outer join ⟕ ⟖ ⟗</strong></td><td>phép nối ngoài</td><td>A join that keeps dangling tuples, padded with NULL — LEFT/RIGHT/FULL JOIN.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>relation</strong></td><td>quan hệ</td><td>Một bảng: tập (hoặc túi) có tên gồm các bộ cùng thuộc tính.</td></tr>
<tr><td><strong>schema / instance</strong></td><td>lược đồ / thể hiện</td><td>Lược đồ là tên và các thuộc tính; thể hiện là các dòng đang lưu.</td></tr>
<tr><td><strong>degree / cardinality</strong></td><td>bậc / lực lượng</td><td>Số cột / số dòng của một quan hệ.</td></tr>
<tr><td><strong>foreign key</strong></td><td>khoá ngoại</td><td>Các thuộc tính mà giá trị phải có trong khoá của quan hệ khác.</td></tr>
<tr><td><strong>relational algebra</strong></td><td>đại số quan hệ</td><td>Các phép toán nhận quan hệ và trả về một quan hệ.</td></tr>
<tr><td><strong>selection σ</strong></td><td>phép chọn</td><td>Giữ các dòng thoả điều kiện — WHERE trong SQL.</td></tr>
<tr><td><strong>projection π</strong></td><td>phép chiếu</td><td>Giữ một số cột — danh sách SELECT (thêm DISTINCT khi là tập).</td></tr>
<tr><td><strong>type compatible</strong></td><td>tương thích kiểu</td><td>Cùng số thuộc tính, miền giá trị tương thích; bắt buộc cho ∪ ∩ −.</td></tr>
<tr><td><strong>Cartesian product ×</strong></td><td>tích Descartes</td><td>Mỗi bộ của R ghép với mọi bộ của S — CROSS JOIN.</td></tr>
<tr><td><strong>theta-join ⋈θ</strong></td><td>phép nối theta</td><td>σθ(R × S): các cặp thoả một điều kiện — JOIN … ON.</td></tr>
<tr><td><strong>natural join ⋈</strong></td><td>phép nối tự nhiên</td><td>Các cặp bằng nhau trên mọi thuộc tính chung, thuộc tính chung giữ một lần.</td></tr>
<tr><td><strong>rename ρ</strong></td><td>phép đổi tên</td><td>Đặt tên mới cho quan hệ hoặc thuộc tính — AS trong SQL.</td></tr>
<tr><td><strong>bag (multiset)</strong></td><td>túi (đa tập)</td><td>Tập hợp cho phép một bộ xuất hiện nhiều lần; bảng SQL là túi.</td></tr>
<tr><td><strong>duplicate elimination δ</strong></td><td>loại bỏ trùng lặp</td><td>Biến túi thành tập — SELECT DISTINCT.</td></tr>
<tr><td><strong>grouping γ</strong></td><td>phép nhóm</td><td>Chia dòng theo thuộc tính nhóm rồi gộp từng nhóm — GROUP BY.</td></tr>
<tr><td><strong>sorting τ</strong></td><td>phép sắp xếp</td><td>Sắp các bộ theo một danh sách thuộc tính — ORDER BY.</td></tr>
<tr><td><strong>dangling tuple</strong></td><td>bộ treo</td><td>Bộ không khớp với bộ nào của quan hệ kia trong phép nối.</td></tr>
<tr><td><strong>outer join ⟕ ⟖ ⟗</strong></td><td>phép nối ngoài</td><td>Phép nối giữ bộ treo, đệm NULL — LEFT/RIGHT/FULL JOIN.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 2</h2>
<ol>
<li><strong>Relation</strong> = schema (name, attributes, types) + instance (rows). Degree = columns, cardinality = rows. A key never repeats; a foreign key must point to an existing key value (and usually repeats).</li>
<li><strong>σ keeps rows (WHERE), π keeps columns (SELECT list)</strong> — the names cross over. Select first, project last.</li>
<li><strong>∪ ∩ −</strong> need type-compatible operands; − is not symmetric; R ∩ S = R − (R − S). SQL: UNION, INTERSECT, EXCEPT.</li>
<li><strong>× then σ = θ-join</strong>; |R × S| = |R| · |S|. The natural join equates all common attributes and keeps them once; SQL Server writes it as JOIN … ON, PostgreSQL has NATURAL JOIN (use it with care).</li>
<li><strong>ρ</strong> renames — needed for self joins (two copies of the same table).</li>
<li><strong>Set vs bag = DISTINCT vs no DISTINCT, UNION vs UNION ALL.</strong> Bag counts: ∪ n + m, ∩ MIN(n, m), − MAX(0, n − m). PostgreSQL has INTERSECT ALL / EXCEPT ALL; SQL Server does not.</li>
<li><strong>Extended operators</strong>: δ = DISTINCT, γ = GROUP BY (+ aggregates), σ after γ = HAVING, extended π = expressions in SELECT, τ = ORDER BY (last). AVG of an INT column is an INT on SQL Server.</li>
<li><strong>Outer joins</strong> keep dangling tuples padded with NULL; count with COUNT(column of the right table), not COUNT(*).</li>
</ol>
<h3>✅ Check yourself before the quiz</h3>
<ol>
<li>Write "titles of courses that SE01 does not take" in algebra.</li>
<li>R has 3 rows, S has 4 rows; how many rows can R ⋈ S have at most, and R ⟕ S at least?</li>
<li>Which of UNION / UNION ALL is the bag union?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) π<sub>title</sub>((π<sub>cid</sub>(Course) − π<sub>cid</sub>(σ<sub>sid='SE01'</sub>(Enroll))) ⋈ Course). (2) At most 3 × 4 = 12 (if every pair matches); R ⟕ S has at least 3 rows (every R row survives). (3) UNION ALL.</p>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 2</h2>
<ol>
<li><strong>Quan hệ</strong> = lược đồ (tên, thuộc tính, kiểu) + thể hiện (các dòng). Bậc = số cột, lực lượng = số dòng. Khoá không bao giờ lặp; khoá ngoại phải trỏ tới một giá trị khoá có thật (và thường lặp lại).</li>
<li><strong>σ giữ dòng (WHERE), π giữ cột (danh sách SELECT)</strong> — tên gọi bắt chéo nhau. Chọn trước, chiếu sau.</li>
<li><strong>∪ ∩ −</strong> cần hai toán hạng tương thích kiểu; − không đối xứng; R ∩ S = R − (R − S). SQL: UNION, INTERSECT, EXCEPT.</li>
<li><strong>× rồi σ = θ-join</strong>; |R × S| = |R| · |S|. Nối tự nhiên đặt bằng nhau mọi thuộc tính chung và giữ chúng một lần; SQL Server viết bằng JOIN … ON, PostgreSQL có NATURAL JOIN (dùng cẩn thận).</li>
<li><strong>ρ</strong> đổi tên — cần cho tự nối (hai bản sao của cùng một bảng).</li>
<li><strong>Tập hay túi = có hay không DISTINCT, UNION hay UNION ALL.</strong> Đếm trên túi: ∪ n + m, ∩ MIN(n, m), − MAX(0, n − m). PostgreSQL có INTERSECT ALL / EXCEPT ALL; SQL Server thì không.</li>
<li><strong>Phép mở rộng</strong>: δ = DISTINCT, γ = GROUP BY (+ hàm gộp), σ sau γ = HAVING, π mở rộng = biểu thức trong SELECT, τ = ORDER BY (làm cuối). AVG của cột INT trên SQL Server ra INT.</li>
<li><strong>Nối ngoài</strong> giữ bộ treo được đệm NULL; đếm bằng COUNT(một cột của bảng bên phải), không dùng COUNT(*).</li>
</ol>
<h3>✅ Tự kiểm tra trước khi làm bài trắc nghiệm (quiz)</h3>
<ol>
<li>Viết "tên các môn mà SE01 không học" bằng đại số.</li>
<li>R có 3 dòng, S có 4 dòng; R ⋈ S có tối đa bao nhiêu dòng, và R ⟕ S có tối thiểu bao nhiêu dòng?</li>
<li>UNION và UNION ALL, cái nào là hợp túi?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) π<sub>title</sub>((π<sub>cid</sub>(Course) − π<sub>cid</sub>(σ<sub>sid='SE01'</sub>(Enroll))) ⋈ Course). (2) Tối đa 3 × 4 = 12 (nếu cặp nào cũng khớp); R ⟕ S có ít nhất 3 dòng (mọi dòng của R đều được giữ). (3) UNION ALL.</p>`),
  ].join('\n'),
};

/* ───────── Quiz (dbi202-quiz-1) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'The table Student(StudentID, Name, Registered, CounsellorNo, Region) currently stores 6 rows. What are its degree and its cardinality?|||Bảng Student(StudentID, Name, Registered, CounsellorNo, Region) đang lưu 6 dòng. Bậc (degree) và lực lượng (cardinality) của nó là bao nhiêu?',
      options: ['Degree 6, cardinality 5|||Bậc 6, lực lượng 5', 'Degree 5, cardinality 6|||Bậc 5, lực lượng 6', 'Degree 5, cardinality 5|||Bậc 5, lực lượng 5', 'Degree 1, cardinality 6|||Bậc 1, lực lượng 6'],
      correctIndex: 1,
      points: 1,
      explanation: 'Degree (arity) is the number of attributes, the columns: 5. Cardinality is the number of tuples, the rows: 6. Option A swaps the two words — the most common slip; degree only changes with ALTER TABLE, cardinality with every INSERT/DELETE.|||Bậc (degree, arity) là số thuộc tính, tức số cột: 5. Lực lượng (cardinality) là số bộ, tức số dòng: 6. Phương án A đảo hai từ — lỗi hay gặp nhất; bậc chỉ đổi khi ALTER TABLE, lực lượng đổi sau mỗi INSERT/DELETE.' },
    { id: 'q2',
      question: "Reserves(sid, bid, day) has key (sid, bid) and the foreign key sid → Sailors(sid). Sailors has no sailor 99. What happens to INSERT INTO Reserves VALUES (99, 101, '2026-12-01')?|||Reserves(sid, bid, day) có khoá (sid, bid) và khoá ngoại sid → Sailors(sid). Sailors không có thuỷ thủ 99. Câu INSERT INTO Reserves VALUES (99, 101, '2026-12-01') sẽ ra sao?",
      options: ['It succeeds, because (99, 101) is a new key value|||Thành công, vì (99, 101) là giá trị khoá mới', 'It succeeds, and sailor 99 is added to Sailors automatically|||Thành công, và thuỷ thủ 99 được tự thêm vào Sailors', 'It fails, because a foreign key value must be unique|||Thất bại, vì giá trị khoá ngoại phải duy nhất', 'It fails, because the foreign key must refer to an existing sailor|||Thất bại, vì khoá ngoại phải trỏ tới một thuỷ thủ có thật'],
      correctIndex: 3,
      points: 1,
      explanation: 'Referential integrity: every value of Reserves.sid must exist in Sailors.sid, so SQL Server rejects the row (error 547, FOREIGN KEY conflict). A is tempting because the primary key is indeed not violated — but the key and the foreign key are two separate checks. C is false: foreign keys usually repeat (one sailor, many reservations).|||Toàn vẹn tham chiếu: mọi giá trị Reserves.sid phải có trong Sailors.sid, nên SQL Server từ chối dòng này (lỗi 547, xung đột FOREIGN KEY). A hấp dẫn vì khoá chính quả thật không bị vi phạm — nhưng khoá chính và khoá ngoại là hai phép kiểm riêng. C sai: khoá ngoại thường lặp lại (một thuỷ thủ, nhiều lượt đặt).' },
    { id: 'q3',
      question: 'R(A, B) has 3 rows and S(B, C) has 4 rows (below). How many rows does this query return on SQL Server?|||R(A, B) có 3 dòng và S(B, C) có 4 dòng (bên dưới). Câu truy vấn này trả về bao nhiêu dòng trên SQL Server?',
      code: `SELECT *
FROM R CROSS JOIN S;`,
      codeLang: 'sql',
      options: ['12 rows — every row of R with every row of S|||12 dòng — mỗi dòng R với mọi dòng S', '7 rows — the rows of R followed by the rows of S|||7 dòng — các dòng của R rồi đến các dòng của S', '5 rows — only the pairs with R.B = S.B|||5 dòng — chỉ các cặp có R.B = S.B', '4 rows — the larger of the two tables|||4 dòng — bảng lớn hơn trong hai bảng'],
      correctIndex: 0,
      points: 1,
      explanation: 'CROSS JOIN is the Cartesian product R × S: |R| × |S| = 3 × 4 = 12 rows, whatever the values. C is the natural join (it needs a condition R.B = S.B, which CROSS JOIN does not have); B would be a union, which is not even allowed here because R and S are not type compatible in meaning.|||CROSS JOIN là tích Descartes R × S: |R| × |S| = 3 × 4 = 12 dòng, bất kể giá trị. C là phép nối tự nhiên (cần điều kiện R.B = S.B, mà CROSS JOIN không có); B là phép hợp, vốn còn không hợp lý ở đây vì R và S khác ý nghĩa.' },
    { id: 'q4',
      question: 'With R = {(1,2), (3,4), (5,2)} and S = {(2,7), (2,8), (4,9), (6,0)}, how many rows does the natural join R ⋈ S (written below for SQL Server) return?|||Với R = {(1,2), (3,4), (5,2)} và S = {(2,7), (2,8), (4,9), (6,0)}, phép nối tự nhiên R ⋈ S (viết cho SQL Server bên dưới) trả về bao nhiêu dòng?',
      code: `SELECT R.A, R.B, S.C
FROM R JOIN S ON R.B = S.B;`,
      codeLang: 'sql',
      options: ['3 rows — one per row of R|||3 dòng — mỗi dòng R một dòng', '2 rows — B = 2 and B = 4|||2 dòng — B = 2 và B = 4', '5 rows — B = 2 gives 2 × 2, B = 4 gives 1|||5 dòng — B = 2 cho 2 × 2, B = 4 cho 1', '12 rows — the product of R and S|||12 dòng — tích của R và S'],
      correctIndex: 2,
      points: 1,
      explanation: 'Count per value of the common attribute B: B = 2 appears in 2 rows of R and 2 rows of S → 2 × 2 = 4 pairs; B = 4 → 1 × 1 = 1; B = 6 has no partner in R. Total 5. A assumes each R row matches once, but (1,2) and (5,2) each match two S rows; D forgets the join condition.|||Đếm theo từng giá trị của thuộc tính chung B: B = 2 có 2 dòng ở R và 2 dòng ở S → 2 × 2 = 4 cặp; B = 4 → 1 × 1 = 1; B = 6 không có bạn ghép trong R. Tổng 5. A cho rằng mỗi dòng R khớp một lần, nhưng (1,2) và (5,2) mỗi dòng khớp hai dòng S; D quên điều kiện nối.' },
    { id: 'q5',
      question: 'U(A, B, C) = {(1,2,3), (6,7,8), (9,7,8)}, V(B, C, D) = {(2,3,4), (2,3,5), (7,8,10)}. How many rows does the theta-join U ⋈ U.B=V.B V return?|||U(A, B, C) = {(1,2,3), (6,7,8), (9,7,8)}, V(B, C, D) = {(2,3,4), (2,3,5), (7,8,10)}. Phép θ-join U ⋈ U.B=V.B V trả về bao nhiêu dòng?',
      code: `SELECT *
FROM U JOIN V ON U.B = V.B;`,
      codeLang: 'sql',
      options: ['3 rows|||3 dòng', '4 rows|||4 dòng', '5 rows|||5 dòng', '9 rows|||9 dòng'],
      correctIndex: 1,
      points: 1,
      explanation: "U.B = 2 (1 row) matches V.B = 2 (2 rows) → 2; U.B = 7 (2 rows) matches V.B = 7 (1 row) → 2. Total 4, each with 6 columns because a theta-join keeps both U.B and V.B. C (5) is the answer of the slide's other example U ⋈ A<D V — a different condition; D is the whole product 3 × 3.|||U.B = 2 (1 dòng) khớp V.B = 2 (2 dòng) → 2; U.B = 7 (2 dòng) khớp V.B = 7 (1 dòng) → 2. Tổng 4, mỗi dòng 6 cột vì θ-join giữ cả U.B lẫn V.B. C (5) là đáp án của ví dụ khác trên slide, U ⋈ A<D V — điều kiện khác; D là cả phép tích 3 × 3." },
    { id: 'q6',
      question: 'R(A, B) = {(1,x), (1,y), (2,x), (1,x)}. In set algebra, how many tuples does π A (R) have, and how many rows does the SQL below return?|||R(A, B) = {(1,x), (1,y), (2,x), (1,x)}. Trong đại số trên tập, π A (R) có bao nhiêu bộ, và câu SQL dưới đây trả về bao nhiêu dòng?',
      code: `SELECT A
FROM R;`,
      codeLang: 'sql',
      options: ['2 tuples; SQL returns 4 rows|||2 bộ; SQL trả về 4 dòng', '2 tuples; SQL returns 2 rows|||2 bộ; SQL trả về 2 dòng', '4 tuples; SQL returns 4 rows|||4 bộ; SQL trả về 4 dòng', '3 tuples; SQL returns 3 rows|||3 bộ; SQL trả về 3 dòng'],
      correctIndex: 0,
      points: 1,
      explanation: 'A set projection removes duplicates: {1, 2}, 2 tuples. SQL works on bags and does not remove duplicates unless you write DISTINCT, so SELECT A returns one row per input row: 4 rows (1, 1, 2, 1). B is the answer for SELECT DISTINCT A; D wrongly thinks R itself had a duplicate removed.|||Phép chiếu trên tập bỏ dòng trùng: {1, 2}, 2 bộ. SQL làm việc trên túi và không bỏ dòng trùng trừ khi viết DISTINCT, nên SELECT A trả về mỗi dòng vào một dòng ra: 4 dòng (1, 1, 2, 1). B là đáp án của SELECT DISTINCT A; D tưởng rằng bản thân R đã bị bỏ một dòng trùng.' },
    { id: 'q7',
      question: 'One-column bags R = {1, 1, 1, 2} and S = {1, 2, 2, 3}. How many rows does the bag difference R − S (EXCEPT ALL on PostgreSQL) return?|||Hai túi một cột R = {1, 1, 1, 2} và S = {1, 2, 2, 3}. Hiệu túi R − S (EXCEPT ALL trên PostgreSQL) trả về bao nhiêu dòng?',
      code: `SELECT a FROM r
EXCEPT ALL
SELECT a FROM s;`,
      codeLang: 'sql',
      options: ['0 rows — every value of R also appears in S|||0 dòng — mọi giá trị của R đều có trong S', '1 row — the value 1 once|||1 dòng — giá trị 1 một lần', '3 rows — three copies of 1|||3 dòng — ba bản của 1', '2 rows — the value 1 twice|||2 dòng — giá trị 1 hai lần'],
      correctIndex: 3,
      points: 1,
      explanation: 'Bag difference keeps MAX(0, n − m) copies: value 1 → MAX(0, 3 − 1) = 2; value 2 → MAX(0, 1 − 2) = 0. So {1, 1}: 2 rows. A is the SET answer (plain EXCEPT): as sets {1, 2} − {1, 2, 3} is empty. C forgets that S also has one copy of 1 to subtract.|||Hiệu túi giữ MAX(0, n − m) bản: giá trị 1 → MAX(0, 3 − 1) = 2; giá trị 2 → MAX(0, 1 − 2) = 0. Vậy {1, 1}: 2 dòng. A là đáp án theo TẬP (EXCEPT thường): xét như tập thì {1, 2} − {1, 2, 3} rỗng. C quên rằng S cũng có một bản của 1 để trừ.' },
    { id: 'q8',
      question: 'Dept(d) = {D1, D2, D3}; Emp(e, d) = {(E1,D1), (E2,D1), (E3,D2), (E4,NULL)}. How many rows does the full outer join below return?|||Dept(d) = {D1, D2, D3}; Emp(e, d) = {(E1,D1), (E2,D1), (E3,D2), (E4,NULL)}. Phép nối ngoài đầy đủ dưới đây trả về bao nhiêu dòng?',
      code: `SELECT Dept.d, Emp.e
FROM Dept FULL OUTER JOIN Emp ON Dept.d = Emp.d;`,
      codeLang: 'sql',
      options: ['3 rows — the matched pairs only|||3 dòng — chỉ các cặp khớp', '4 rows — matches plus the empty department D3|||4 dòng — các cặp khớp cộng phòng trống D3', '5 rows — matches, D3 and E4, padded with NULL|||5 dòng — các cặp khớp, D3 và E4, đệm NULL', '7 rows — every row of both tables|||7 dòng — mọi dòng của cả hai bảng'],
      correctIndex: 2,
      points: 1,
      explanation: '3 matches (E1–D1, E2–D1, E3–D2) + the dangling Dept row D3 (e = NULL) + the dangling Emp row E4 (Dept.d = NULL; NULL equals nothing, not even NULL) = 5. B is the LEFT outer join Dept ⟕ Emp, which drops E4; A is the inner join.|||3 cặp khớp (E1–D1, E2–D1, E3–D2) + dòng treo D3 của Dept (e = NULL) + dòng treo E4 của Emp (Dept.d = NULL; NULL không bằng gì cả, kể cả NULL) = 5. B là nối ngoài TRÁI Dept ⟕ Emp, bỏ mất E4; A là nối trong.' },
    { id: 'q9',
      question: 'Column A is INT and holds 1, 3, 1, 1. What does SQL Server return for the query below?|||Cột A kiểu INT chứa 1, 3, 1, 1. SQL Server trả về gì cho câu truy vấn dưới đây?',
      code: `SELECT AVG(A)
FROM R;`,
      codeLang: 'sql',
      options: ['1 — the average of an INT column is an INT|||1 — trung bình của cột INT là một số INT', '1.5 — the exact average of the bag|||1.5 — trung bình chính xác của túi', '2 — the average of the distinct values|||2 — trung bình của các giá trị khác nhau', '1.500000 — a decimal with 6 places|||1.500000 — số thập phân 6 chữ số'],
      correctIndex: 0,
      points: 1,
      explanation: "The bag average is (1 + 3 + 1 + 1) / 4 = 1.5, but SQL Server computes AVG of an INT column in integer arithmetic and returns 1 (the fraction is cut). Write AVG(A * 1.0) to get 1.500000 (option D's form). B is what PostgreSQL returns; C would be AVG(DISTINCT A), the set answer.|||Trung bình trên túi là (1 + 3 + 1 + 1) / 4 = 1.5, nhưng SQL Server tính AVG của cột INT bằng số học số nguyên và trả về 1 (phần lẻ bị cắt). Viết AVG(A * 1.0) để được 1.500000 (dạng của phương án D). B là thứ PostgreSQL trả về; C là AVG(DISTINCT A), đáp án theo tập." },
    { id: 'q10',
      question: 'Which expression is always equal to R ∩ S, for type-compatible relations R and S?|||Biểu thức nào luôn bằng R ∩ S, với hai quan hệ R và S tương thích kiểu?',
      options: ['R − (S − R)|||R − (S − R)', 'R − (R − S)|||R − (R − S)', '(R ∪ S) − R|||(R ∪ S) − R', 'σ R=S (R × S)|||σ R=S (R × S)'],
      correctIndex: 1,
      points: 1,
      explanation: 'R − S is the part of R that is not in S; removing that part from R leaves exactly the tuples of R that are in S — the intersection (slide 12). A is tempting but S − R contains nothing of R, so R − (S − R) = R. C gives the tuples of S that are not in R, the opposite of what we want.|||R − S là phần của R không có trong S; bỏ phần đó khỏi R thì còn đúng các bộ của R có trong S — chính là phép giao (slide 12). A hấp dẫn nhưng S − R không chứa bộ nào của R, nên R − (S − R) = R. C cho các bộ của S không có trong R, ngược với thứ cần tìm.' },
  ],
};

export default {
  slides: [L_dbi3_1, L_dbi3_2, L_dbi6_1, L_dbi6_2],
  practice: L_on_ch2,
  quiz: QUIZ,
  quizDescription: '10 câu kiểu FE/PT về mô hình quan hệ và đại số quan hệ: bậc và lực lượng, khoá ngoại, đếm số dòng của tích Descartes, nối tự nhiên, θ-join, phép chiếu trên tập và trên túi (SELECT vs SELECT DISTINCT), hiệu túi (EXCEPT ALL), nối ngoài đầy đủ, bẫy AVG trên cột INT của SQL Server, và viết lại phép giao bằng phép hiệu — 7 câu "kết quả có mấy dòng" được chạy thật để xác nhận đáp án; mỗi câu có giải thích.',
};
