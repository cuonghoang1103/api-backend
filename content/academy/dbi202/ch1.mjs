/**
 * DBI202 · Chương 1 — thế giới các hệ CSDL (slide Chapter 1).
 * Bài 📑 học theo từng slide: dbi2 (Chapter 1.pptx, slide 1–21).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: dbi202-on-ch1.
 * Quiz MỚI (10 câu, slug dbi202-quiz-ch1).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/DBI202/gen/gen.mjs từ gen/src/** và gen/sql/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node DBI202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 1.A — 📑 Slide by slide · The worlds of database systems (school Chapter 1, slides 1–21) ───────── */
const L_dbi2_1 = {
  title: '1.A — 📑 Slide by slide · The worlds of database systems (school Chapter 1, slides 1–21)|||1.A — 📑 Học theo từng slide · Thế giới các hệ CSDL (Chapter 1 của trường, slide 1–21)',
  slug: 'dbi202-slide-dbi2-1',
  type: 'VIDEO',
  description: 'Giảng đủ 21 slide Chapter 1 của trường: dữ liệu và thông tin, CSDL – DBMS – hệ CSDL, 5 nhiệm vụ của DBMS, mô hình phân cấp/mạng/quan hệ, ví dụ bảng BOOK chạy thật 4 câu SQL, NoSQL/NewSQL, tích hợp thông tin (kho dữ liệu, mediator), sơ đồ thành phần DBMS, ba nhóm người dùng, DDL/DML, bộ biên dịch truy vấn và kế hoạch thực thi (kèm ô PostgreSQL EXPLAIN).',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.A · school deck "Chapter 1", slides 1–21</span>
<h2>The worlds of database systems — the deck, slide by slide</h2>
<p class="lead">This is the deck of sessions 1–2 (CLO1). It has almost no SQL, but it gives the vocabulary the whole course uses: data vs information, database vs DBMS vs database system, the jobs a DBMS must do, the history of data models, the parts inside a DBMS, and the two families of SQL commands (DDL and DML). Progress tests and the FE ask these definitions word for word.</p>
<div class="callout"><strong>Syllabus link.</strong> The constructive questions of this chapter are CQ1.1 (why do we need a database, how has it evolved?), CQ1.2 (what is a database system, what is a DBMS?) and CQ1.3 (what is a data model?). Lesson 1.2 answers all three in full with model answers.</div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.A · bộ slide "Chapter 1" của trường, slide 1–21</span>
<h2>Thế giới các hệ CSDL — học bộ slide từng trang</h2>
<p class="lead">Đây là bộ slide của buổi 1–2 (chuẩn đầu ra CLO1). Gần như không có SQL, nhưng nó cho bạn bộ từ vựng mà cả môn dùng: dữ liệu (data) khác thông tin (information), cơ sở dữ liệu (database) khác hệ quản trị CSDL (DBMS) khác hệ CSDL (database system), các việc một DBMS phải làm, lịch sử các mô hình dữ liệu, các thành phần bên trong DBMS và hai nhóm lệnh SQL (DDL và DML). Progress test và FE hỏi đúng từng định nghĩa này.</p>
<div class="callout"><strong>Liên hệ syllabus.</strong> Câu hỏi thảo luận (constructive question — CQ) của chương là CQ1.1 (vì sao cần CSDL, CSDL đã phát triển qua những giai đoạn nào?), CQ1.2 (hệ CSDL là gì, DBMS là gì?) và CQ1.3 (mô hình dữ liệu là gì?). Bài 1.2 trả lời đầy đủ cả ba kèm đáp án mẫu.</div>`),
    walkHead('dbi2', 1, 21),
    walk('dbi2', [
      [1, 'Chapter 1 The Worlds of Database Systems',
        `<p class="y-chinh">🎯 Chapter 1 answers one question: what is a database system, and why does almost every piece of software need one?</p>
<p>The title comes from chapter 1 of the textbook (Ullman &amp; Widom). "Worlds" in the plural: a database system is used by very different people — the programmer who queries it, the designer who shapes it, the administrator who keeps it running.</p>`,
        `<p class="y-chinh">🎯 Chương 1 trả lời một câu hỏi: hệ cơ sở dữ liệu (database system) là gì, và vì sao gần như phần mềm nào cũng cần nó?</p>
<p>Tiêu đề lấy từ chương 1 của giáo trình (Ullman &amp; Widom). "Worlds" ở số nhiều — nhiều "thế giới": một hệ CSDL được dùng bởi những người rất khác nhau — lập trình viên truy vấn nó, người thiết kế định hình nó, người quản trị giữ cho nó chạy.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 After this chapter you must be able to define five words precisely: information, data, database, DBMS, database system.</p>
<p>They sound alike and FE questions exploit that: "SQL Server is a database" is <strong>false</strong> (it is a DBMS); "a database system = DBMS + data" is <strong>true</strong>. Slides 4–5 give the definitions; the rest of the deck shows what a DBMS does and what is inside it.</p>
<p class="meo">🧠 <strong>Remember:</strong> database = the data; DBMS = the software; database system = both together.</p>`,
        `<p class="y-chinh">🎯 Học xong chương này bạn phải định nghĩa chính xác năm từ: thông tin (information), dữ liệu (data), cơ sở dữ liệu (database), hệ quản trị CSDL (DBMS), hệ CSDL (database system).</p>
<p>Chúng nghe na ná nhau và câu hỏi FE khai thác đúng điều đó: "SQL Server là một cơ sở dữ liệu" là <strong>sai</strong> (nó là DBMS); "hệ CSDL = DBMS + dữ liệu" là <strong>đúng</strong>. Slide 4–5 cho định nghĩa; phần còn lại của bộ slide nói DBMS làm gì và bên trong nó có gì.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> database = dữ liệu; DBMS = phần mềm; database system = cả hai cộng lại.</p>`],
      [3, 'Contents',
        `<p class="y-chinh">🎯 Two parts: 1.1 how database systems evolved (slides 4–14) and 1.2 what is inside a DBMS (slides 15–20), plus a last slide on today's trends.</p>
<p>The textbook has a third section, 1.3 "Outline of Database-System Studies", which the syllabus schedules for session 2 together with the assignment introduction; it is a map of the book, not new theory.</p>`,
        `<p class="y-chinh">🎯 Hai phần: 1.1 các hệ CSDL đã tiến hoá thế nào (slide 4–14) và 1.2 bên trong một DBMS có gì (slide 15–20), cộng một slide cuối về xu hướng hiện nay.</p>
<p>Giáo trình còn mục 1.3 "Outline of Database-System Studies" (tổng quan nội dung môn), syllabus xếp vào buổi 2 cùng phần giới thiệu assignment; đó là bản đồ của cuốn sách, không phải lý thuyết mới.</p>`],
      [4, 'Data vs Information',
        `<p class="y-chinh">🎯 Data are raw recorded facts; information is data that has been processed so that it means something to someone — the slide draws it as a funnel: 0s and 1s → PROCESS → INFORMATION.</p>
<ul>
<li><strong>Data</strong>: "SE190001, DBI202, 3.5" — a fact, with no context and no conclusion.</li>
<li><strong>Information</strong>: "30% of the class failed DBI202 this semester, the average is 5.6" — the result of grouping, counting and comparing data; it supports a decision (open a revision class).</li>
</ul>
<p>The processing step is exactly what SQL does: <code>SELECT course, AVG(score) … GROUP BY course</code> turns rows of marks into information (lesson 1.2, exercise 7, runs it).</p>
<p class="dap-an">✅ <strong>The slide's question — differences:</strong> data are raw, unorganised and meaningless alone; information is processed, organised, has context and is useful for a decision. Data is the input, information the output of processing.</p>`,
        `<p class="y-chinh">🎯 Dữ liệu (data) là các sự kiện thô được ghi lại; thông tin (information) là dữ liệu đã qua xử lý để có ý nghĩa với ai đó — slide vẽ thành cái phễu: các bit 0 và 1 → PROCESS (xử lý) → INFORMATION.</p>
<ul>
<li><strong>Dữ liệu</strong>: "SE190001, DBI202, 3.5" — một sự kiện, không có ngữ cảnh, không có kết luận.</li>
<li><strong>Thông tin</strong>: "kỳ này 30% lớp trượt DBI202, điểm trung bình 5,6" — kết quả của việc gom nhóm, đếm, so sánh dữ liệu; nó giúp ra quyết định (mở lớp ôn tập).</li>
</ul>
<p>Bước xử lý chính là việc SQL làm: <code>SELECT course, AVG(score) … GROUP BY course</code> biến các dòng điểm thành thông tin (bài 1.2, bài tập 7 chạy thật câu này).</p>
<p class="dap-an">✅ <strong>Câu hỏi trên slide — khác nhau ở đâu:</strong> dữ liệu là thô, chưa tổ chức, đứng một mình thì vô nghĩa; thông tin đã được xử lý, tổ chức, có ngữ cảnh và dùng được để ra quyết định. Dữ liệu là đầu vào, thông tin là đầu ra của quá trình xử lý.</p>`],
      [5, 'Database, DBMS, Database System',
        `<p class="y-chinh">🎯 Three nested ideas: the database (the data, kept for a long time), the DBMS (the software that creates and maintains it) and the database system (DBMS + data, sometimes + applications).</p>
<ul>
<li><strong>Database</strong>: "a collection of information that exists over a long period of time", "a collection of related data", "managed by a DBMS". Example: the FAP data of all FPTU students.</li>
<li><strong>DBMS</strong>: "a software package/system to facilitate the creation and maintenance of a computerized database" — SQL Server, PostgreSQL, MySQL, Oracle.</li>
<li><strong>Database system</strong>: the DBMS software together with the data itself.</li>
</ul>
<p>The diagram on the right shows the layers: users/programmers send <em>application programs/queries</em> into the database system; inside, the DBMS software has a part that <em>processes queries/programs</em> and a part that <em>accesses stored data</em>; underneath lie two stores — the <strong>stored database definition (meta-data)</strong>, i.e. the description of the tables, and the <strong>stored database</strong>, the rows themselves.</p>
<p class="nhan">Three everyday examples — which one is a database system?</p>
<table>
<thead><tr><th>Example</th><th>Database?</th><th>DBMS?</th><th>Database system?</th></tr></thead>
<tbody>
<tr><td>A paper mark book of your class</td><td>yes — related data kept for a long time</td><td>no — a person writes and searches it by hand</td><td>no</td></tr>
<tr><td>An Excel file of marks</td><td>yes — the data</td><td>no — Excel is a spreadsheet: no real query language, no protection when two people edit, no recovery</td><td>no</td></tr>
<tr><td>Your banking app (Vietcombank, MB…)</td><td>yes — accounts and transactions</td><td>yes — e.g. Oracle or SQL Server on the bank's servers</td><td>yes: the DBMS + the data (+ the app)</td></tr>
</tbody>
</table>
<div class="pitfall">Meta-data (the catalog: table names, column types, constraints) is also stored by the DBMS. An FE option "the DBMS stores only user data" is false — SQL Server exposes its meta-data through views such as <code>INFORMATION_SCHEMA.COLUMNS</code> (used on slide 18 below).</div>`,
        `<p class="y-chinh">🎯 Ba khái niệm lồng nhau: cơ sở dữ liệu (database — dữ liệu, được giữ lâu dài), hệ quản trị CSDL (DBMS — phần mềm tạo và duy trì nó) và hệ CSDL (database system — DBMS + dữ liệu, đôi khi + cả ứng dụng).</p>
<ul>
<li><strong>Cơ sở dữ liệu</strong>: "một tập thông tin tồn tại trong thời gian dài", "một tập dữ liệu có liên quan với nhau", "do một DBMS quản lý". Ví dụ: dữ liệu FAP của mọi sinh viên FPTU.</li>
<li><strong>DBMS</strong> (Database Management System): "một gói/hệ phần mềm giúp tạo và duy trì một CSDL trên máy tính" — SQL Server, PostgreSQL, MySQL, Oracle.</li>
<li><strong>Hệ CSDL</strong>: phần mềm DBMS cộng với chính dữ liệu.</li>
</ul>
<p>Sơ đồ bên phải vẽ các tầng: người dùng/lập trình viên gửi <em>chương trình ứng dụng/truy vấn</em> vào hệ CSDL; bên trong, phần mềm DBMS có một phần <em>xử lý truy vấn/chương trình</em> và một phần <em>truy cập dữ liệu đã lưu</em>; bên dưới là hai kho — <strong>định nghĩa CSDL đã lưu (meta-data — siêu dữ liệu)</strong>, tức bản mô tả các bảng, và <strong>CSDL đã lưu (stored database)</strong>, tức chính các dòng dữ liệu.</p>
<p class="nhan">Ba ví dụ đời thường — cái nào là một hệ CSDL?</p>
<table>
<thead><tr><th>Ví dụ</th><th>Có CSDL?</th><th>Có DBMS?</th><th>Là hệ CSDL?</th></tr></thead>
<tbody>
<tr><td>Sổ điểm giấy của lớp</td><td>có — dữ liệu liên quan, giữ lâu dài</td><td>không — người ghi và tra bằng tay</td><td>không</td></tr>
<tr><td>File Excel điểm</td><td>có — là dữ liệu</td><td>không — Excel là bảng tính: không có ngôn ngữ truy vấn thật sự, không bảo vệ khi hai người cùng sửa, không phục hồi khi hỏng</td><td>không</td></tr>
<tr><td>App ngân hàng của bạn (Vietcombank, MB…)</td><td>có — tài khoản và giao dịch</td><td>có — vd Oracle hay SQL Server trên máy chủ ngân hàng</td><td>có: DBMS + dữ liệu (+ ứng dụng)</td></tr>
</tbody>
</table>
<div class="pitfall">Siêu dữ liệu (catalog — danh mục: tên bảng, kiểu cột, ràng buộc) cũng do DBMS lưu. Phương án FE "DBMS chỉ lưu dữ liệu người dùng" là sai — SQL Server cho xem siêu dữ liệu qua các view như <code>INFORMATION_SCHEMA.COLUMNS</code> (dùng ở slide 18 bên dưới).</div>`],
      [6, 'What a DBMS is expected to do',
        `<p class="y-chinh">🎯 A DBMS has five duties; the first DBMSs of the 1960s, built on top of file systems, did most of them badly — the table on the slide rates each one.</p>
<table>
<thead><tr><th>#</th><th>The DBMS is expected to …</th><th>Early file-based DBMS (1960s)</th><th>Modern DBMS (SQL Server)</th></tr></thead>
<tbody>
<tr><td>(1)</td><td>let users create new databases and specify their schemas</td><td>Limited</td><td><code>CREATE DATABASE</code>, <code>CREATE TABLE</code> (DDL)</td></tr>
<tr><td>(2)</td><td>give users the ability to query the data</td><td>Not directly supported</td><td>SQL <code>SELECT</code></td></tr>
<tr><td>(3)</td><td>support the storage of very large amounts of data</td><td>Yes</td><td>terabytes, with indexes</td></tr>
<tr><td>(4)</td><td>enable durability — data survive failures</td><td>Not always supported</td><td>transaction log, backup, recovery</td></tr>
<tr><td>(5)</td><td>control access to data from many users at once</td><td>No</td><td>locks, transactions, permissions</td></tr>
</tbody>
</table>
<p><strong>Two words used above.</strong> A <em>schema</em> is the description of the data — which tables exist, which columns each has, what type each column is (like the header row of a spreadsheet, fixed in advance). A <em>query</em> is a question asked to the database, such as "list the students of class SE1901"; in this course queries are written in SQL.</p>
<p>Durability means that once a change is committed it is never lost, even if the power goes out a second later. Duty (5) is why two students registering for the last seat of a class never both get it.</p>
<p class="meo">🧠 <strong>Remember the five as "S-Q-B-D-C":</strong> Schema, Query, Big data, Durability, Concurrency.</p>`,
        `<p class="y-chinh">🎯 DBMS có năm nhiệm vụ; các DBMS đầu tiên của thập niên 1960, dựng trên hệ thống tệp (file system), làm kém phần lớn chúng — bảng trên slide chấm từng việc.</p>
<table>
<thead><tr><th>#</th><th>DBMS được mong đợi …</th><th>DBMS thời đầu dựa trên tệp (1960s)</th><th>DBMS hiện đại (SQL Server)</th></tr></thead>
<tbody>
<tr><td>(1)</td><td>cho người dùng tạo CSDL mới và khai báo lược đồ (schema)</td><td>Hạn chế</td><td><code>CREATE DATABASE</code>, <code>CREATE TABLE</code> (DDL)</td></tr>
<tr><td>(2)</td><td>cho người dùng truy vấn dữ liệu</td><td>Không hỗ trợ trực tiếp</td><td>SQL <code>SELECT</code></td></tr>
<tr><td>(3)</td><td>lưu trữ lượng dữ liệu rất lớn</td><td>Có</td><td>hàng terabyte, có chỉ mục</td></tr>
<tr><td>(4)</td><td>bảo đảm tính bền vững (durability) — dữ liệu còn sau sự cố</td><td>Không phải lúc nào cũng có</td><td>nhật ký giao dịch, sao lưu, phục hồi</td></tr>
<tr><td>(5)</td><td>kiểm soát nhiều người truy cập cùng lúc</td><td>Không</td><td>khoá (lock), giao dịch, phân quyền</td></tr>
</tbody>
</table>
<p><strong>Hai từ dùng ở trên.</strong> <em>Lược đồ (schema)</em> là bản mô tả dữ liệu — có những bảng nào, mỗi bảng có cột nào, mỗi cột kiểu gì (giống dòng tiêu đề của bảng tính nhưng được định sẵn từ trước). <em>Truy vấn (query)</em> là một câu hỏi gửi cho CSDL, vd "liệt kê sinh viên lớp SE1901"; trong môn này truy vấn được viết bằng SQL (Structured Query Language — ngôn ngữ truy vấn có cấu trúc).</p>
<p>Tính bền vững nghĩa là một thay đổi đã xác nhận (commit) thì không bao giờ mất, kể cả khi mất điện ngay giây sau đó. Nhiệm vụ (5) là lý do hai sinh viên cùng bấm đăng ký chỗ cuối cùng của một lớp không bao giờ cùng được nhận.</p>
<p class="meo">🧠 <strong>Nhớ năm việc theo "S-Q-B-D-C":</strong> Schema (lược đồ), Query (truy vấn), Big data (dữ liệu lớn), Durability (bền vững), Concurrency (đồng thời).</p>`],
      [7, 'Hierarchical data model',
        `<p class="y-chinh">🎯 The hierarchical model stores records as a tree: each child has exactly one parent — used by early mainframe DBMSs such as IBM IMS.</p>
<p>The slide's tree: record types Student → Course → Instructor. Student S1 has courses C1 and C2 (C1 taught by I1, C2 by I2); student S2 has C2, C3, C4 (taught by I2, I3, I1).</p>
<pre><code class="language-plaintext">S1                 S2
├── C1             ├── C2
│   └── I1         │   └── I2
└── C2             ├── C3
    └── I2         │   └── I3
                   └── C4
                       └── I1</code></pre>
<p>Look at C2 and I2: they are stored <strong>twice</strong>, once under S1 and once under S2, because a tree node cannot have two parents. Duplicated data means wasted space and updates that can miss a copy. Queries must also follow the tree from the root: "which students take C2?" means visiting every student.</p>
<div class="pitfall">"Tree-based = hierarchical, graph-based = network." FE questions swap the two words; remember that a tree forbids a second parent.</div>`,
        `<p class="y-chinh">🎯 Mô hình phân cấp (hierarchical model) lưu bản ghi thành cây: mỗi con có đúng một cha — dùng trong các DBMS máy lớn (mainframe) đời đầu như IBM IMS.</p>
<p>Cây trên slide: các loại bản ghi Student → Course → Instructor (sinh viên → môn → giảng viên). Sinh viên S1 học môn C1 và C2 (C1 do I1 dạy, C2 do I2 dạy); sinh viên S2 học C2, C3, C4 (do I2, I3, I1 dạy).</p>
<pre><code class="language-plaintext">S1                 S2
├── C1             ├── C2
│   └── I1         │   └── I2
└── C2             ├── C3
    └── I2         │   └── I3
                   └── C4
                       └── I1</code></pre>
<p>Nhìn C2 và I2: chúng bị lưu <strong>hai lần</strong>, một dưới S1 và một dưới S2, vì một nút của cây không thể có hai cha. Dữ liệu trùng lặp nghĩa là tốn chỗ và khi cập nhật dễ sót một bản. Truy vấn cũng phải đi theo cây từ gốc: "sinh viên nào học C2?" nghĩa là phải duyệt qua mọi sinh viên.</p>
<div class="pitfall">"Dạng cây = phân cấp (hierarchical), dạng đồ thị = mạng (network)." Câu FE hay tráo hai chữ này; hãy nhớ cây thì cấm cha thứ hai.</div>`],
      [8, 'Network data model',
        `<p class="y-chinh">🎯 The network model (graph-based, Charles Bachman, late 1960s; CODASYL standard 1969) lets a record have several parents and several children — but it has no high-level query language.</p>
<p>The slide's graph: Store points to Customer, Manager and Salesman; Customer, Manager and Salesman all point to Order (Order has <strong>three parents</strong>); Salesman also points to Items. The duplication of the tree disappears — one Order record can be reached from its customer, its manager and its salesman.</p>
<p>The price, written in red on the slide: <strong>no high-level query language</strong>. A program had to navigate pointer by pointer ("find the first Order of this Customer, then the next…"). Changing the structure broke those programs.</p>
<p class="meo">🧠 <strong>Remember:</strong> hierarchical and network models answer "how do I walk to the data"; the relational model (next slide) answers "what data do I want".</p>`,
        `<p class="y-chinh">🎯 Mô hình mạng (network model — dạng đồ thị, Charles Bachman, cuối thập niên 1960; chuẩn CODASYL 1969) cho một bản ghi có nhiều cha và nhiều con — nhưng không có ngôn ngữ truy vấn bậc cao.</p>
<p>Đồ thị trên slide: Store (cửa hàng) trỏ tới Customer (khách), Manager (quản lý) và Salesman (nhân viên bán hàng); cả Customer, Manager và Salesman đều trỏ tới Order (đơn hàng — Order có <strong>ba cha</strong>); Salesman còn trỏ tới Items (mặt hàng). Sự trùng lặp của cây biến mất — một bản ghi Order đi tới được từ khách, từ quản lý và từ nhân viên bán hàng của nó.</p>
<p>Cái giá, ghi màu đỏ trên slide: <strong>không có ngôn ngữ truy vấn bậc cao</strong>. Chương trình phải đi theo từng con trỏ ("tìm Order đầu tiên của Customer này, rồi Order kế tiếp…"). Đổi cấu trúc là các chương trình đó hỏng.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mô hình phân cấp và mạng trả lời "đi đường nào để tới dữ liệu"; mô hình quan hệ (slide sau) trả lời "tôi muốn dữ liệu nào".</p>`],
      [9, 'Relational Database Systems',
        `<p class="y-chinh">🎯 In the 1970s Ted Codd defined the relational model — data as tables (relations) — and it became the model almost every business database still uses.</p>
<ul>
<li><strong>1970</strong>: Edgar F. "Ted" Codd (IBM) publishes the relational model — the "revolutionary idea" of the slide.</li>
<li>Research prototypes: <strong>System R</strong> (IBM, later the product DB2) and <strong>Ingres</strong> (University of California, Berkeley — its ideas later led to PostgreSQL).</li>
<li><strong>1974</strong>: IBM develops SQL (first called SEQUEL), the most important query language.</li>
<li><strong>1979</strong>: Oracle v.2, the first commercial RDBMS (relational DBMS) using SQL.</li>
</ul>
<p>The revolution is <strong>data independence</strong>: you say <em>what</em> you want (<code>SELECT … WHERE …</code>) and the DBMS decides <em>how</em> to find it; the storage can change without rewriting queries.</p>`,
        `<p class="y-chinh">🎯 Thập niên 1970, Ted Codd định nghĩa mô hình quan hệ (relational model) — dữ liệu là các bảng (quan hệ — relation) — và đó là mô hình mà gần như mọi CSDL nghiệp vụ vẫn dùng đến nay.</p>
<ul>
<li><strong>1970</strong>: Edgar F. "Ted" Codd (IBM) công bố mô hình quan hệ — "ý tưởng cách mạng" của slide.</li>
<li>Các nguyên mẫu nghiên cứu: <strong>System R</strong> (IBM, sau thành sản phẩm DB2) và <strong>Ingres</strong> (Đại học California, Berkeley — ý tưởng của nó về sau dẫn tới PostgreSQL).</li>
<li><strong>1974</strong>: IBM phát triển SQL (ban đầu tên SEQUEL), ngôn ngữ truy vấn quan trọng nhất.</li>
<li><strong>1979</strong>: Oracle v.2, RDBMS (DBMS quan hệ) thương mại đầu tiên dùng SQL.</li>
</ul>
<p>Cuộc cách mạng nằm ở <strong>tính độc lập dữ liệu (data independence)</strong>: bạn nói <em>muốn gì</em> (<code>SELECT … WHERE …</code>) và DBMS tự quyết <em>làm thế nào</em> để tìm; cách lưu trữ có thể đổi mà không phải viết lại truy vấn.</p>`],
      [10, 'Book relation example',
        `<p class="y-chinh">🎯 A relation is just a table — BOOK(Title, Author, Publisher, Year) — and four SQL statements insert, delete, update and query its rows.</p>
<table>
<thead><tr><th>Word</th><th>Meaning</th><th>In BOOK</th></tr></thead>
<tbody>
<tr><td>relation (table)</td><td>a named table of data</td><td>BOOK</td></tr>
<tr><td>attribute (column)</td><td>one kind of fact, with a name and a type</td><td>Title, Author, Publisher, Year</td></tr>
<tr><td>tuple (row)</td><td>one item, one value per column</td><td>("London Fields", Amis, Penguin, 1989)</td></tr>
<tr><td>primary key</td><td>a column whose value identifies exactly one row</td><td>Title (in this example)</td></tr>
</tbody>
</table>
<p>The slide's arrows: the <strong>yellow</strong> row "Fund. of DB Systems / Elmasri / Addison-Wesley / 1989" is added by <code>INSERT</code>; the <strong>pink</strong> row "London Fields" is removed by <code>DELETE</code>; the <strong>grey</strong> row "The history man" gets year 1975 by <code>UPDATE</code>; and <code>SELECT Title, Author … WHERE Year = '1989'</code> returns the small table (Fund. of DB Systems / Elmasri, London Fields / Amis). Here is the same thing run for real — the table is built from the four other rows, then the statements run in the order that gives the slide's result (the SELECT runs before the DELETE, otherwise London Fields would be gone):</p>
<pre><code class="language-sql">INSERT INTO BOOK VALUES ('Fund. of DB Systems', 'Elmasri', 'Addison-Wesley', '1989');  -- yellow row
SELECT Title, Author FROM BOOK WHERE Year = '1989';                                     -- before the DELETE
DELETE FROM BOOK WHERE Title = 'London Fields';                                         -- pink row
UPDATE BOOK SET Year = '1975' WHERE Title = 'The history man';                          -- grey row
SELECT * FROM BOOK ORDER BY Title;                                                      -- the table afterwards</code></pre>
<div class="out">(4 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>Title</th><th>Author</th></tr></thead>
<tbody>
<tr><td>Fund. of DB Systems</td><td>Elmasri</td></tr>
<tr><td>London Fields</td><td>Amis</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>Title</th><th>Author</th><th>Publisher</th><th>Year</th></tr></thead>
<tbody>
<tr><td>100 years of solitude</td><td>Marquez</td><td>Picador</td><td>1982</td></tr>
<tr><td>Fund. of DB Systems</td><td>Elmasri</td><td>Addison-Wesley</td><td>1989</td></tr>
<tr><td>Intro to DB Systems</td><td>Date</td><td>Addison-Wesley</td><td>1986</td></tr>
<tr><td>The history man</td><td>Bradbury</td><td>Arrow Books</td><td>1975</td></tr>
</tbody>
</table>
<p>The slide abbreviates the values ("Fund of…", "..") and misses a quote in <code>WHERE TITLE=The history man'</code>; the code above is the complete, corrected version.</p>
<div class="pitfall"><code>Year</code> is compared with <code>'1989'</code> in quotes because the slide stores it as text. On a numeric column write <code>WHERE Year = 1989</code>. Mixing the two works in SQL Server by implicit conversion, but it is slow and a classic PE mark loss when the column holds values like <code>'1989 '</code>.</div>`,
        `<p class="y-chinh">🎯 Một quan hệ chỉ là một bảng — BOOK(Title, Author, Publisher, Year) — và bốn câu SQL thêm, xoá, sửa và truy vấn các dòng của nó.</p>
<table>
<thead><tr><th>Từ</th><th>Nghĩa</th><th>Trong BOOK</th></tr></thead>
<tbody>
<tr><td>quan hệ (relation) = bảng (table)</td><td>một bảng dữ liệu có tên</td><td>BOOK</td></tr>
<tr><td>thuộc tính (attribute) = cột (column)</td><td>một loại thông tin, có tên và kiểu</td><td>Title (tên sách), Author (tác giả), Publisher (nhà xuất bản), Year (năm)</td></tr>
<tr><td>bộ (tuple) = dòng (row)</td><td>một đối tượng, mỗi cột một giá trị</td><td>("London Fields", Amis, Penguin, 1989)</td></tr>
<tr><td>khoá chính (primary key)</td><td>cột mà giá trị của nó xác định đúng một dòng</td><td>Title (trong ví dụ này)</td></tr>
</tbody>
</table>
<p>Bốn câu lệnh trên slide: <code>INSERT</code> (thêm dòng), <code>DELETE</code> (xoá dòng), <code>UPDATE</code> (sửa giá trị), <code>SELECT</code> (lấy dữ liệu ra xem). Các mũi tên trên slide: dòng <strong>vàng</strong> "Fund. of DB Systems / Elmasri / Addison-Wesley / 1989" được thêm bằng <code>INSERT</code>; dòng <strong>hồng</strong> "London Fields" bị xoá bằng <code>DELETE</code>; dòng <strong>xám</strong> "The history man" được đổi năm thành 1975 bằng <code>UPDATE</code>; còn <code>SELECT Title, Author … WHERE Year = '1989'</code> trả về bảng nhỏ (Fund. of DB Systems / Elmasri, London Fields / Amis). Dưới đây là đúng việc đó chạy thật — bảng được dựng từ bốn dòng còn lại, rồi các câu lệnh chạy theo thứ tự cho ra đúng kết quả của slide (SELECT chạy trước DELETE, nếu không London Fields đã mất):</p>
<pre><code class="language-sql">INSERT INTO BOOK VALUES ('Fund. of DB Systems', 'Elmasri', 'Addison-Wesley', '1989');  -- dòng tô vàng
SELECT Title, Author FROM BOOK WHERE Year = '1989';                                     -- trước khi DELETE
DELETE FROM BOOK WHERE Title = 'London Fields';                                         -- dòng tô hồng
UPDATE BOOK SET Year = '1975' WHERE Title = 'The history man';                          -- dòng tô xám
SELECT * FROM BOOK ORDER BY Title;                                                      -- bảng sau bốn lệnh</code></pre>
<div class="out">(4 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>Title</th><th>Author</th></tr></thead>
<tbody>
<tr><td>Fund. of DB Systems</td><td>Elmasri</td></tr>
<tr><td>London Fields</td><td>Amis</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>Title</th><th>Author</th><th>Publisher</th><th>Year</th></tr></thead>
<tbody>
<tr><td>100 years of solitude</td><td>Marquez</td><td>Picador</td><td>1982</td></tr>
<tr><td>Fund. of DB Systems</td><td>Elmasri</td><td>Addison-Wesley</td><td>1989</td></tr>
<tr><td>Intro to DB Systems</td><td>Date</td><td>Addison-Wesley</td><td>1986</td></tr>
<tr><td>The history man</td><td>Bradbury</td><td>Arrow Books</td><td>1975</td></tr>
</tbody>
</table>
<p>Slide viết tắt giá trị ("Fund of…", "..") và thiếu một dấu nháy trong <code>WHERE TITLE=The history man'</code>; đoạn code trên là bản đầy đủ, đã sửa.</p>
<div class="pitfall"><code>Year</code> được so với <code>'1989'</code> có nháy vì slide lưu nó dạng chữ. Với cột kiểu số thì viết <code>WHERE Year = 1989</code>. Trộn hai kiểu vẫn chạy trên SQL Server nhờ chuyển kiểu ngầm, nhưng chậm và là lỗi mất điểm PE kinh điển khi cột chứa giá trị như <code>'1989 '</code>.</div>`],
      [11, 'Evolution of database modeling techniques',
        `<p class="y-chinh">🎯 The figure shows data models taking over from one another decade by decade — file systems, hierarchical, network, relational, object, object-relational — and since the 2000s, NoSQL and NewSQL.</p>
<p>Reading the shaded bands of the figure from left to right: file systems dominate until about 1970; the hierarchical model the 1960s–1980s; the network model the 1970s–1990; the relational model from the 1970s and it is still growing past Y2K; the object and object-relational models appear in the 1990s. The long arrow is the trend: each model fixes a weakness of the previous one.</p>
<ul>
<li><strong>NoSQL</strong> ("not only SQL"): document, key-value, graph stores that give up some relational guarantees for scale or flexibility (slide 21).</li>
<li><strong>NewSQL</strong>: systems that keep SQL and transactions but scale across many machines.</li>
</ul>
<p class="meo">🧠 <strong>Order to remember (CQ1.1):</strong> File → Hierarchical → Network → Relational → Object / Object-relational → NoSQL / NewSQL.</p>`,
        `<p class="y-chinh">🎯 Hình cho thấy các mô hình dữ liệu nối tiếp nhau qua từng thập niên — hệ thống tệp, phân cấp, mạng, quan hệ, hướng đối tượng, quan hệ – đối tượng — và từ những năm 2000 là NoSQL và NewSQL.</p>
<p>Đọc các dải tô xám của hình từ trái sang phải: hệ thống tệp chiếm ưu thế tới khoảng 1970; mô hình phân cấp những năm 1960–1980; mô hình mạng 1970–1990; mô hình quan hệ từ thập niên 1970 và vẫn tiếp tục lớn lên sau năm 2000 (Y2K); mô hình hướng đối tượng (object) và quan hệ – đối tượng (object-relational) xuất hiện từ thập niên 1990. Mũi tên dài là xu hướng: mô hình sau sửa một điểm yếu của mô hình trước.</p>
<ul>
<li><strong>NoSQL</strong> ("not only SQL" — không chỉ SQL): kho dạng tài liệu (document), khoá – giá trị (key-value), đồ thị (graph), chấp nhận bỏ bớt một số bảo đảm của mô hình quan hệ để đổi lấy khả năng mở rộng hoặc sự linh hoạt (slide 21).</li>
<li><strong>NewSQL</strong>: các hệ giữ SQL và giao dịch nhưng mở rộng được trên nhiều máy.</li>
</ul>
<p class="meo">🧠 <strong>Thứ tự cần thuộc (CQ1.1):</strong> Tệp → Phân cấp → Mạng → Quan hệ → Đối tượng / Quan hệ – đối tượng → NoSQL / NewSQL.</p>`],
      [12, 'Smaller and bigger systems',
        `<p class="y-chinh">🎯 Two opposite trends: DBMSs became small enough for a phone, and databases became big enough to hold petabytes.</p>
<ul>
<li><strong>Smaller</strong>: DBMSs were once large, expensive software on mainframes; today a relational DBMS runs on a PC or a mobile phone (SQLite is inside every Android and iOS device).</li>
<li><strong>Bigger</strong>: data keep growing; many databases store <strong>petabytes</strong> (1 PB = 1,000 TB = one million GB) and still answer users quickly — that is why indexes and query optimization (Chapter 8) matter.</li>
</ul>
<p>The symbol ⇒ on the slide draws the conclusion: relational systems are now available "for even very small machines".</p>`,
        `<p class="y-chinh">🎯 Hai xu hướng ngược chiều: DBMS nhỏ tới mức chạy được trên điện thoại, còn CSDL lớn tới mức chứa hàng petabyte.</p>
<ul>
<li><strong>Nhỏ hơn</strong>: DBMS từng là phần mềm lớn, đắt tiền chạy trên máy mainframe; ngày nay một DBMS quan hệ chạy trên PC hay điện thoại (SQLite có sẵn trong mọi máy Android và iOS).</li>
<li><strong>Lớn hơn</strong>: dữ liệu không ngừng tăng; nhiều CSDL lưu hàng <strong>petabyte</strong> (1 PB = 1.000 TB = một triệu GB) mà vẫn trả lời người dùng nhanh — đó là lý do chỉ mục (index) và tối ưu truy vấn (Chương 8) quan trọng.</li>
</ul>
<p>Ký hiệu ⇒ trên slide rút ra kết luận: hệ CSDL quan hệ nay có cả "cho những máy rất nhỏ".</p>`],
      [13, 'Information Integration',
        `<p class="y-chinh">🎯 Information integration = making many existing, different databases look like one, without rebuilding them.</p>
<p>The slide's example: a large company has many divisions; each built its own database of products and employees on a different DBMS with a different structure. Management wants one answer to "how many employees do we have, and which products sell best?". The databases cannot simply be merged: other applications depend on each of them.</p>
<p>The solution on the slide: build <strong>structures on top of the existing databases</strong> whose goal is to integrate the information spread among them. Slide 14 gives the two classic structures. Real-life version: FPT Education has separate systems for admissions, FAP (grades) and finance; a report on "students who owe fees and failed a course" needs data from all three.</p>`,
        `<p class="y-chinh">🎯 Tích hợp thông tin (information integration) = làm cho nhiều CSDL có sẵn, khác nhau trông như một, mà không phải xây lại chúng.</p>
<p>Ví dụ trên slide: một công ty lớn có nhiều bộ phận; mỗi bộ phận tự xây CSDL sản phẩm và nhân viên riêng trên DBMS khác nhau, cấu trúc khác nhau. Ban giám đốc muốn một câu trả lời cho "ta có bao nhiêu nhân viên, sản phẩm nào bán chạy nhất?". Không thể gộp thẳng các CSDL: các ứng dụng khác đang phụ thuộc vào từng cái.</p>
<p>Giải pháp trên slide: xây <strong>các cấu trúc nằm trên các CSDL có sẵn</strong> với mục tiêu tích hợp thông tin đang rải rác giữa chúng. Slide 14 nêu hai cấu trúc kinh điển. Ví dụ đời thực: FPT Education có hệ thống tuyển sinh, FAP (điểm) và tài chính riêng; báo cáo "sinh viên còn nợ học phí và trượt môn" cần dữ liệu từ cả ba.</p>`],
      [14, 'Two approaches to integration',
        `<p class="y-chinh">🎯 Two ways to integrate: a data warehouse copies the data periodically into one central database; a mediator (middleware) leaves the data where it is and translates each query.</p>
<table>
<thead><tr><th></th><th>Data warehouse</th><th>Mediator (middleware)</th></tr></thead>
<tbody>
<tr><td>Where the data live</td><td>copied, with translation, into a central database</td><td>stay in the original databases</td></tr>
<tr><td>When it is copied</td><td>periodically (e.g. every night)</td><td>never — queries are translated on the fly</td></tr>
<tr><td>Freshness</td><td>as old as the last load</td><td>always current</td></tr>
<tr><td>Query speed</td><td>fast: one database, built for analysis</td><td>slower: several databases answer each query</td></tr>
<tr><td>Typical use</td><td>reports, dashboards, BI</td><td>live views over systems that must stay separate</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> warehouse = <em>copy</em> then ask; mediator = ask, then <em>translate</em>.</p>`,
        `<p class="y-chinh">🎯 Hai cách tích hợp: kho dữ liệu (data warehouse) định kỳ chép dữ liệu về một CSDL trung tâm; bộ trung gian (mediator — middleware) để dữ liệu nằm nguyên chỗ và dịch từng câu truy vấn.</p>
<table>
<thead><tr><th></th><th>Kho dữ liệu (data warehouse)</th><th>Bộ trung gian (mediator / middleware)</th></tr></thead>
<tbody>
<tr><td>Dữ liệu nằm ở</td><td>được chép, kèm chuyển đổi, về một CSDL trung tâm</td><td>vẫn ở các CSDL gốc</td></tr>
<tr><td>Khi nào chép</td><td>định kỳ (vd mỗi đêm)</td><td>không bao giờ — truy vấn được dịch tức thời</td></tr>
<tr><td>Độ mới</td><td>cũ bằng lần nạp gần nhất</td><td>luôn là dữ liệu hiện tại</td></tr>
<tr><td>Tốc độ truy vấn</td><td>nhanh: một CSDL, dựng cho phân tích</td><td>chậm hơn: nhiều CSDL cùng trả lời mỗi truy vấn</td></tr>
<tr><td>Dùng điển hình</td><td>báo cáo, dashboard, BI (phân tích kinh doanh)</td><td>xem trực tiếp trên các hệ phải để tách riêng</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> warehouse = <em>chép</em> rồi mới hỏi; mediator = hỏi rồi <em>dịch</em>.</p>`],
      [15, '1.2 Overview of DBMS',
        `<p class="y-chinh">🎯 Section 1.2 opens: four topics — the components of a DBMS, its users, its languages, and relational databases.</p>
<p>Slides 16–20 take them in order: the component diagram (16), the three kinds of users (17), the two languages DDL and DML (18–20). "Relational databases" is the subject of the whole next chapter.</p>`,
        `<p class="y-chinh">🎯 Mở đầu mục 1.2: bốn chủ đề — các thành phần của DBMS, người dùng, ngôn ngữ, và CSDL quan hệ.</p>
<p>Slide 16–20 đi lần lượt: sơ đồ thành phần (16), ba nhóm người dùng (17), hai ngôn ngữ DDL và DML (18–20). "CSDL quan hệ" là chủ đề của cả chương sau.</p>`],
      [16, 'DBMS components',
        `<p class="y-chinh">🎯 Inside a DBMS: a query compiler, a transaction manager and a DDL compiler receive the commands; the execution engine runs them through the index/file/record manager, buffer manager and storage manager down to the disk.</p>
<p>Legend on the slide: single box = system component, double box = memory data structure (Buffers, Lock table), solid line = control and data flow, dashed line = data flow only. Following the arrows:</p>
<table>
<thead><tr><th>Component</th><th>What it does</th></tr></thead>
<tbody>
<tr><td>Query compiler</td><td>receives queries and updates from users/applications, parses and optimizes them into a <em>query plan</em>, using metadata and statistics</td></tr>
<tr><td>DDL compiler</td><td>receives DDL commands from the database administrator and changes the metadata (the schema)</td></tr>
<tr><td>Transaction manager</td><td>receives transaction commands; talks to logging/recovery and concurrency control</td></tr>
<tr><td>Execution engine</td><td>executes the plan; sends index, file and record requests down</td></tr>
<tr><td>Index/file/record manager</td><td>knows where rows and indexes live; sends page commands</td></tr>
<tr><td>Buffer manager</td><td>keeps disk pages in memory (Buffers) and reads/writes pages from storage</td></tr>
<tr><td>Storage manager</td><td>moves pages between disk and memory</td></tr>
<tr><td>Logging and recovery</td><td>writes log pages so that committed work survives a crash (durability)</td></tr>
<tr><td>Concurrency control</td><td>uses the Lock table so that simultaneous users do not corrupt each other's work</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember the path of a query:</strong> compiler → plan → execution engine → index/file/record manager → buffer → storage → disk.</p>`,
        `<p class="y-chinh">🎯 Bên trong một DBMS: bộ biên dịch truy vấn, bộ quản lý giao dịch và bộ biên dịch DDL nhận lệnh; bộ máy thực thi (execution engine) chạy chúng qua bộ quản lý chỉ mục/tệp/bản ghi, bộ quản lý bộ đệm và bộ quản lý lưu trữ xuống tới đĩa.</p>
<p>Chú giải trên slide: ô đơn = thành phần hệ thống, ô đôi = cấu trúc dữ liệu trong bộ nhớ (Buffers — bộ đệm, Lock table — bảng khoá), nét liền = luồng điều khiển và dữ liệu, nét đứt = chỉ luồng dữ liệu. Đi theo các mũi tên:</p>
<table>
<thead><tr><th>Thành phần</th><th>Việc nó làm</th></tr></thead>
<tbody>
<tr><td>Query compiler — bộ biên dịch truy vấn</td><td>nhận truy vấn và lệnh cập nhật từ người dùng/ứng dụng, phân tích và tối ưu thành <em>kế hoạch thực thi (query plan)</em>, dựa trên siêu dữ liệu và thống kê</td></tr>
<tr><td>DDL compiler — bộ biên dịch DDL</td><td>nhận lệnh DDL từ người quản trị CSDL và sửa siêu dữ liệu (lược đồ)</td></tr>
<tr><td>Transaction manager — bộ quản lý giao dịch</td><td>nhận lệnh giao dịch; làm việc với phần ghi nhật ký/phục hồi và điều khiển đồng thời</td></tr>
<tr><td>Execution engine — bộ máy thực thi</td><td>chạy kế hoạch; gửi yêu cầu chỉ mục, tệp, bản ghi xuống dưới</td></tr>
<tr><td>Index/file/record manager — quản lý chỉ mục/tệp/bản ghi</td><td>biết dòng và chỉ mục nằm ở đâu; gửi lệnh theo trang (page)</td></tr>
<tr><td>Buffer manager — quản lý bộ đệm</td><td>giữ các trang đĩa trong bộ nhớ (Buffers), đọc/ghi trang từ bộ lưu trữ</td></tr>
<tr><td>Storage manager — quản lý lưu trữ</td><td>chuyển trang giữa đĩa và bộ nhớ</td></tr>
<tr><td>Logging and recovery — ghi nhật ký và phục hồi</td><td>ghi các trang nhật ký để việc đã commit sống sót sau sự cố (tính bền vững)</td></tr>
<tr><td>Concurrency control — điều khiển đồng thời</td><td>dùng Lock table để những người dùng đồng thời không làm hỏng việc của nhau</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Nhớ đường đi của một truy vấn:</strong> bộ biên dịch → kế hoạch → bộ máy thực thi → quản lý chỉ mục/tệp/bản ghi → bộ đệm → lưu trữ → đĩa.</p>`],
      [17, 'Database Users',
        `<p class="y-chinh">🎯 Three kinds of users: administrators run the database, designers shape it, end users use its data.</p>
<table>
<thead><tr><th>User</th><th>Job on the slide</th><th>FPTU example</th></tr></thead>
<tbody>
<tr><td>Database administrator (DBA)</td><td>authorizes access, coordinates and monitors use, acquires software and hardware</td><td>the IT staff who back up FAP every night and grant accounts</td></tr>
<tr><td>Database designer</td><td>defines content, structure, constraints, functions and transactions</td><td>you, in the assignment and PE question 1 (ERD → tables)</td></tr>
<tr><td>End user</td><td>queries, reports; some also update the content</td><td>a lecturer entering marks, a student viewing a timetable</td></tr>
</tbody>
</table>
<div class="pitfall">The DDL compiler of slide 16 is fed by the <strong>administrator</strong>; ordinary end users send queries and updates, not schema changes.</div>`,
        `<p class="y-chinh">🎯 Ba nhóm người dùng: người quản trị vận hành CSDL, người thiết kế định hình nó, người dùng cuối sử dụng dữ liệu.</p>
<table>
<thead><tr><th>Người dùng</th><th>Việc trên slide</th><th>Ví dụ ở FPTU</th></tr></thead>
<tbody>
<tr><td>Người quản trị CSDL (database administrator — DBA)</td><td>cấp quyền truy cập, điều phối và giám sát việc dùng, mua sắm phần mềm và phần cứng</td><td>nhân viên IT sao lưu FAP mỗi đêm và cấp tài khoản</td></tr>
<tr><td>Người thiết kế CSDL (database designer)</td><td>định nghĩa nội dung, cấu trúc, ràng buộc, hàm và giao dịch</td><td>chính bạn, trong assignment và câu 1 đề PE (ERD → bảng)</td></tr>
<tr><td>Người dùng cuối (end user)</td><td>truy vấn, làm báo cáo; một số còn cập nhật nội dung</td><td>giảng viên nhập điểm, sinh viên xem lịch học</td></tr>
</tbody>
</table>
<div class="pitfall">Bộ biên dịch DDL ở slide 16 nhận lệnh từ <strong>người quản trị</strong>; người dùng cuối bình thường gửi truy vấn và cập nhật, không sửa lược đồ.</div>`],
      [18, 'DDL — Data Definition Language',
        `<p class="y-chinh">🎯 DDL commands (CREATE, ALTER, DROP) change the schema — the structure — not the rows; they need special authority and they change the metadata.</p>
<p>The slide's path: a DDL command is parsed by the DDL compiler, passed to the execution engine, then goes through the index/file/record manager to alter the metadata. The script below creates a table, adds a column, reads the metadata back from <code>INFORMATION_SCHEMA.COLUMNS</code>, drops the table and checks it is gone:</p>
<pre><code class="language-sql">CREATE TABLE Student (                      -- DDL: create a schema object
  StudentID CHAR(8) PRIMARY KEY,
  FullName  NVARCHAR(50) NOT NULL
);
ALTER TABLE Student ADD Email VARCHAR(100); -- DDL: change the schema
SELECT COLUMN_NAME, DATA_TYPE               -- read the metadata the DBMS keeps
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Student'
ORDER BY ORDINAL_POSITION;
DROP TABLE Student;                         -- DDL: remove the table and its data
SELECT COUNT(*) AS tables_left FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Student';</code></pre>
<table>
<thead><tr><th>COLUMN_NAME</th><th>DATA_TYPE</th></tr></thead>
<tbody>
<tr><td>StudentID</td><td>char</td></tr>
<tr><td>FullName</td><td>nvarchar</td></tr>
<tr><td>Email</td><td>varchar</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>tables_left</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> DDL talks about <em>tables</em>; DML talks about <em>rows</em>.</p>
<div class="pitfall"><code>DROP TABLE</code> removes the structure <strong>and</strong> all its rows; <code>DELETE FROM</code> (DML) removes rows and keeps the table. PE instructions such as "remove all orders" want <code>DELETE</code>.</div>`,
        `<p class="y-chinh">🎯 Lệnh DDL (Data Definition Language — ngôn ngữ định nghĩa dữ liệu: CREATE, ALTER, DROP) đổi lược đồ — cấu trúc — chứ không đổi các dòng; chúng cần quyền đặc biệt và làm thay đổi siêu dữ liệu.</p>
<p>Đường đi theo slide: lệnh DDL được bộ biên dịch DDL phân tích, chuyển cho bộ máy thực thi, rồi qua bộ quản lý chỉ mục/tệp/bản ghi để sửa siêu dữ liệu. Đoạn script dưới đây tạo một bảng, thêm một cột, đọc lại siêu dữ liệu từ <code>INFORMATION_SCHEMA.COLUMNS</code>, xoá bảng và kiểm tra nó đã mất:</p>
<pre><code class="language-sql">CREATE TABLE Student (                      -- DDL: tạo một đối tượng lược đồ
  StudentID CHAR(8) PRIMARY KEY,
  FullName  NVARCHAR(50) NOT NULL
);
ALTER TABLE Student ADD Email VARCHAR(100); -- DDL: sửa lược đồ
SELECT COLUMN_NAME, DATA_TYPE               -- đọc siêu dữ liệu (metadata) DBMS lưu
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Student'
ORDER BY ORDINAL_POSITION;
DROP TABLE Student;                         -- DDL: xoá bảng cùng dữ liệu
SELECT COUNT(*) AS tables_left FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Student';</code></pre>
<table>
<thead><tr><th>COLUMN_NAME</th><th>DATA_TYPE</th></tr></thead>
<tbody>
<tr><td>StudentID</td><td>char</td></tr>
<tr><td>FullName</td><td>nvarchar</td></tr>
<tr><td>Email</td><td>varchar</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>tables_left</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> DDL nói về <em>bảng</em>; DML nói về <em>dòng</em>.</p>
<div class="pitfall"><code>DROP TABLE</code> xoá cấu trúc <strong>và</strong> mọi dòng; <code>DELETE FROM</code> (DML) xoá dòng, giữ bảng. Đề PE ghi "xoá mọi đơn hàng" là muốn <code>DELETE</code>.</div>`],
      [19, 'DML — Data Manipulation Language',
        `<p class="y-chinh">🎯 DML commands retrieve, insert, delete and update data; they change the content (or just read it) and leave the schema untouched.</p>
<p>DML has two subsystems on the slide: <strong>answering the query</strong> and <strong>transaction processing</strong> (slide 20). The four DML verbs in action:</p>
<pre><code class="language-sql">CREATE TABLE Student (StudentID CHAR(8) PRIMARY KEY, FullName NVARCHAR(50) NOT NULL, GPA DECIMAL(3,1));
INSERT INTO Student VALUES ('SE190001', N'Nguyễn Văn An', 7.5),
                           ('SE190002', N'Trần Thị Bình', 8.2);   -- DML: add rows
UPDATE Student SET GPA = 7.9 WHERE StudentID = 'SE190001';        -- DML: change content
DELETE FROM Student WHERE GPA &lt; 5;                                -- DML: no row matches, nothing deleted
SELECT StudentID, FullName, GPA FROM Student;                     -- DML: query</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>StudentID</th><th>FullName</th><th>GPA</th></tr></thead>
<tbody>
<tr><td>SE190001</td><td>Nguyễn Văn An</td><td>7.9</td></tr>
<tr><td>SE190002</td><td>Trần Thị Bình</td><td>8.2</td></tr>
</tbody>
</table>
<p>The final SELECT shows the effect of the three modifications: two rows inserted, An's GPA changed from 7.5 to 7.9, and nothing deleted because no GPA is below 5. The schema (the columns of <code>Student</code>) is the same before and after.</p>
<div class="pitfall">SELECT is DML too — it "extracts data from the database" (slide text). An FE option "DML only modifies data" is false.</div>`,
        `<p class="y-chinh">🎯 Lệnh DML (Data Manipulation Language — ngôn ngữ thao tác dữ liệu) lấy ra, thêm, xoá và sửa dữ liệu; chúng đổi nội dung (hoặc chỉ đọc) và để nguyên lược đồ.</p>
<p>Theo slide, DML có hai phân hệ: <strong>trả lời truy vấn</strong> và <strong>xử lý giao dịch</strong> (slide 20). Bốn động từ DML khi chạy thật:</p>
<pre><code class="language-sql">CREATE TABLE Student (StudentID CHAR(8) PRIMARY KEY, FullName NVARCHAR(50) NOT NULL, GPA DECIMAL(3,1));
INSERT INTO Student VALUES ('SE190001', N'Nguyễn Văn An', 7.5),
                           ('SE190002', N'Trần Thị Bình', 8.2);   -- DML: thêm dòng
UPDATE Student SET GPA = 7.9 WHERE StudentID = 'SE190001';        -- DML: đổi nội dung
DELETE FROM Student WHERE GPA &lt; 5;                                -- DML: không dòng nào khớp, không xoá gì
SELECT StudentID, FullName, GPA FROM Student;                     -- DML: truy vấn</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>StudentID</th><th>FullName</th><th>GPA</th></tr></thead>
<tbody>
<tr><td>SE190001</td><td>Nguyễn Văn An</td><td>7.9</td></tr>
<tr><td>SE190002</td><td>Trần Thị Bình</td><td>8.2</td></tr>
</tbody>
</table>
<p>Câu SELECT cuối cho thấy tác dụng của ba lệnh sửa đổi: hai dòng được thêm, GPA của An đổi từ 7.5 thành 7.9, và không dòng nào bị xoá vì không ai có GPA dưới 5. Lược đồ (các cột của <code>Student</code>) trước và sau vẫn như nhau.</p>
<div class="pitfall">SELECT cũng là DML — nó "lấy dữ liệu ra khỏi CSDL" (chữ trên slide). Phương án FE "DML chỉ dùng để sửa dữ liệu" là sai.</div>`],
      [20, 'Answering the query and transaction processing',
        `<p class="y-chinh">🎯 A query is parsed and optimized by the query compiler into a query plan, which the execution engine runs; a transaction is a group of operations handled by the transaction manager.</p>
<p>You can ask SQL Server to show the plan instead of running the query. <code>SET SHOWPLAN_TEXT ON</code> makes it return the plan of the next statements:</p>
<pre><code class="language-sql">SET SHOWPLAN_TEXT ON;          -- show the query plan instead of running the query
GO
SELECT Title, Author FROM BOOK WHERE Year = '1989';
GO
SET SHOWPLAN_TEXT OFF;
GO</code></pre>
<div class="out">(3 rows affected)</div>
<table>
<thead><tr><th>StmtText</th></tr></thead>
<tbody>
<tr><td>SELECT Title, Author FROM BOOK WHERE Year = '1989';</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>StmtText</th></tr></thead>
<tbody>
<tr><td>  |--Clustered Index Scan(OBJECT:([DBI202].[dbo].[BOOK].[PK__BOOK__C7DFEBA9D77F1231]), WHERE:([DBI202].[dbo].[BOOK].[Year]=[@1]))</td></tr>
</tbody>
</table>
<p>Reading it: the table has a primary key on Title, so SQL Server stores it as a <em>clustered index</em> and the plan is a <strong>Clustered Index Scan</strong> with the filter on Year — it reads every row because there is no index on Year. Chapter 8 shows how an index changes this plan.</p>
<p><strong>Transaction processing</strong> ("will be discussed in the next chapters"): a transaction groups several operations so that they happen all or nothing — lesson 1.2 exercise 4 runs a bank transfer and rolls it back.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> there is no <code>SET SHOWPLAN_TEXT</code>: you put <code>EXPLAIN</code> in front of the query (and <code>EXPLAIN ANALYZE</code> to run it and show real times). PostgreSQL does not keep tables as clustered indexes, so the same query gives a <em>Seq Scan</em> (sequential scan) with a filter:
<pre><code class="language-sql">CREATE TABLE book (title varchar(50) PRIMARY KEY, author varchar(30), publisher varchar(30), year varchar(4));
INSERT INTO book VALUES ('Fund. of DB Systems', 'Elmasri', 'Addison-Wesley', '1989'),
                        ('London Fields', 'Amis', 'Penguin', '1989'),
                        ('The history man', 'Bradbury', 'Arrow Books', '1977');
EXPLAIN SELECT title, author FROM book WHERE year = '1989';   -- the plan, the query is not run</code></pre>
<div class="out">INSERT 0 3</div>
<table>
<thead><tr><th>QUERY PLAN</th></tr></thead>
<tbody>
<tr><td>Seq Scan on book  (cost=0.00..13.12 rows=1 width=196)</td></tr>
<tr><td>  Filter: ((year)::text = '1989'::text)</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-10-1-doc-explain">PostgreSQL course — reading EXPLAIN</a>.</div>`,
        `<p class="y-chinh">🎯 Một truy vấn được bộ biên dịch truy vấn phân tích và tối ưu thành kế hoạch thực thi (query plan), rồi bộ máy thực thi chạy nó; một giao dịch (transaction) là một nhóm thao tác do bộ quản lý giao dịch xử lý.</p>
<p>Bạn có thể bảo SQL Server cho xem kế hoạch thay vì chạy truy vấn. <code>SET SHOWPLAN_TEXT ON</code> làm nó trả về kế hoạch của các câu lệnh tiếp theo:</p>
<pre><code class="language-sql">SET SHOWPLAN_TEXT ON;          -- hiện kế hoạch thực thi thay vì chạy truy vấn
GO
SELECT Title, Author FROM BOOK WHERE Year = '1989';
GO
SET SHOWPLAN_TEXT OFF;
GO</code></pre>
<div class="out">(3 rows affected)</div>
<table>
<thead><tr><th>StmtText</th></tr></thead>
<tbody>
<tr><td>SELECT Title, Author FROM BOOK WHERE Year = '1989';</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>StmtText</th></tr></thead>
<tbody>
<tr><td>  |--Clustered Index Scan(OBJECT:([DBI202].[dbo].[BOOK].[PK__BOOK__C7DFEBA9D77F1231]), WHERE:([DBI202].[dbo].[BOOK].[Year]=[@1]))</td></tr>
</tbody>
</table>
<p>Cách đọc: bảng có khoá chính trên Title nên SQL Server lưu nó dạng <em>chỉ mục cụm (clustered index)</em>, và kế hoạch là <strong>Clustered Index Scan</strong> (quét cả chỉ mục cụm) kèm bộ lọc trên Year — nó đọc mọi dòng vì không có chỉ mục trên Year. Chương 8 cho thấy một chỉ mục làm kế hoạch này thay đổi ra sao.</p>
<p><strong>Xử lý giao dịch</strong> ("sẽ bàn ở các chương sau"): một giao dịch gom nhiều thao tác để chúng xảy ra trọn vẹn hoặc không xảy ra gì — bài 1.2, bài tập 4 chạy thật một lần chuyển tiền rồi hoàn tác (rollback).</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> không có <code>SET SHOWPLAN_TEXT</code>: bạn đặt <code>EXPLAIN</code> trước câu truy vấn (và <code>EXPLAIN ANALYZE</code> để chạy thật và xem thời gian thật). PostgreSQL không lưu bảng dạng chỉ mục cụm, nên cùng câu truy vấn cho ra <em>Seq Scan</em> (quét tuần tự) kèm bộ lọc:
<pre><code class="language-sql">CREATE TABLE book (title varchar(50) PRIMARY KEY, author varchar(30), publisher varchar(30), year varchar(4));
INSERT INTO book VALUES ('Fund. of DB Systems', 'Elmasri', 'Addison-Wesley', '1989'),
                        ('London Fields', 'Amis', 'Penguin', '1989'),
                        ('The history man', 'Bradbury', 'Arrow Books', '1977');
EXPLAIN SELECT title, author FROM book WHERE year = '1989';   -- kế hoạch, truy vấn không chạy</code></pre>
<div class="out">INSERT 0 3</div>
<table>
<thead><tr><th>QUERY PLAN</th></tr></thead>
<tbody>
<tr><td>Seq Scan on book  (cost=0.00..13.12 rows=1 width=196)</td></tr>
<tr><td>  Filter: ((year)::text = '1989'::text)</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-10-1-doc-explain">Khoá PostgreSQL — đọc EXPLAIN</a>.</div>`],
      [21, 'The trends of DB design and DBMS',
        `<p class="y-chinh">🎯 Two trends: non-relational (NoSQL) databases such as MongoDB and Redis, and multi-model databases such as Oracle Database and ArangoDB that store several kinds of data in one engine.</p>
<ul>
<li><strong>MongoDB</strong>: a document store — each record is a JSON-like document; good when the shape of records changes often.</li>
<li><strong>Redis</strong>: an in-memory key-value store — used as a cache, for sessions and counters.</li>
<li><strong>Multi-model</strong>: one DBMS handles tables, documents, graphs and key-value data (Oracle Database, ArangoDB). PostgreSQL also works this way with its <code>jsonb</code> type.</li>
</ul>
<p>Relational databases are not being replaced: most companies use SQL for money, orders and people, and add a NoSQL store next to it for caching or logs. Everything in this course stays useful.</p>`,
        `<p class="y-chinh">🎯 Hai xu hướng: CSDL phi quan hệ (NoSQL) như MongoDB và Redis, và CSDL đa mô hình (multi-model) như Oracle Database và ArangoDB lưu nhiều kiểu dữ liệu trong một bộ máy.</p>
<ul>
<li><strong>MongoDB</strong>: kho tài liệu (document store) — mỗi bản ghi là một tài liệu dạng JSON; hợp khi hình dạng bản ghi hay thay đổi.</li>
<li><strong>Redis</strong>: kho khoá – giá trị (key-value) nằm trong bộ nhớ — dùng làm bộ nhớ đệm (cache), lưu phiên đăng nhập và bộ đếm.</li>
<li><strong>Đa mô hình</strong>: một DBMS xử lý cả bảng, tài liệu, đồ thị và khoá – giá trị (Oracle Database, ArangoDB). PostgreSQL cũng làm được theo cách này với kiểu <code>jsonb</code>.</li>
</ul>
<p>CSDL quan hệ không bị thay thế: đa số công ty dùng SQL cho tiền, đơn hàng và con người, rồi đặt thêm một kho NoSQL bên cạnh để làm cache hay lưu log. Mọi thứ trong môn này vẫn hữu ích.</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>Is SQL Server a database, a DBMS or a database system?</li>
<li>Which data model stored course C2 twice on slide 7, and why?</li>
<li><code>TRUNCATE TABLE</code>, <code>UPDATE</code>, <code>ALTER TABLE</code>, <code>SELECT</code> — which are DDL?</li>
<li>Which DBMS component turns a query into a query plan?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) a DBMS; SQL Server plus your data is a database system. (2) the hierarchical model — a tree node cannot have two parents, so C2 is copied under S1 and under S2. (3) <code>TRUNCATE TABLE</code> (in SQL Server) and <code>ALTER TABLE</code>; <code>UPDATE</code> and <code>SELECT</code> are DML. (4) the query compiler.</p>
<p><strong>Next:</strong> lesson 1.1 below (why databases and what a DBMS does), then lesson 1.2 (practice on CQ1.1–CQ1.3, glossary, summary) and the chapter quiz.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>SQL Server là một CSDL, một DBMS hay một hệ CSDL?</li>
<li>Mô hình dữ liệu nào lưu môn C2 hai lần ở slide 7, và vì sao?</li>
<li><code>TRUNCATE TABLE</code>, <code>UPDATE</code>, <code>ALTER TABLE</code>, <code>SELECT</code> — lệnh nào là DDL?</li>
<li>Thành phần nào của DBMS biến truy vấn thành kế hoạch thực thi?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) một DBMS; SQL Server cộng dữ liệu của bạn mới là một hệ CSDL. (2) mô hình phân cấp — một nút của cây không thể có hai cha, nên C2 bị chép dưới S1 và dưới S2. (3) <code>TRUNCATE TABLE</code> (trong SQL Server) và <code>ALTER TABLE</code>; <code>UPDATE</code> và <code>SELECT</code> là DML. (4) bộ biên dịch truy vấn (query compiler).</p>
<p><strong>Học tiếp:</strong> bài 1.1 ngay bên dưới (vì sao cần CSDL và DBMS làm gì), rồi bài 1.2 (thực hành CQ1.1–CQ1.3, thuật ngữ, tóm tắt) và bài trắc nghiệm của chương.</p>`),
    books([
      ['ullman', 'Ch.1 The Worlds of Database Systems — §1.1 The Evolution of Database Systems · §1.2 Overview of a Database Management System · §1.3 Outline of Database-System Studies', 'Chương 1 The Worlds of Database Systems — §1.1 The Evolution of Database Systems (tiến hoá của hệ CSDL) · §1.2 Overview of a Database Management System (tổng quan DBMS) · §1.3 Outline of Database-System Studies (bố cục môn học)'],
    ]),
  ].join('\n'),
};

/* ───────── 1.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Databases & DBMS (CQ1.1–CQ1.3) ───────── */
const L_on_ch1 = {
  title: '1.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Databases & DBMS (CQ1.1–CQ1.3)|||1.2 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · CSDL & DBMS (CQ1.1–CQ1.3)',
  slug: 'dbi202-on-ch1',
  type: 'VIDEO',
  description: '8 bài tập khái niệm và tình huống theo câu hỏi CQ1.1–CQ1.3 của syllabus, có đáp án mẫu viết sẵn để trả lời thầy/cô: vì sao cần CSDL (so với Excel), các giai đoạn phát triển, CSDL – DBMS – hệ CSDL, 5 nhiệm vụ của DBMS, mô hình dữ liệu gồm những gì, ba mức và độc lập dữ liệu, DDL hay DML, dữ liệu và thông tin — minh hoạ bằng 6 đoạn SQL chạy thật; 16 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.2 · Practice &amp; review</span>
<h2>Databases &amp; DBMS — answer the syllabus questions, then check with real SQL</h2>
<p class="lead">Chapter 1 is tested with words, not code: progress tests, FE questions and the lecturer's oral questions in class. The syllabus lists three constructive questions (CQ1.1–CQ1.3). Below, each is broken into exercises with a model answer you can say in two minutes, and — where it helps — a few lines of SQL that really run on SQL Server, so the idea is something you have seen happen, not a sentence to memorise.</p>
<div class="callout"><strong>How to use this page.</strong> Read the question, cover the answer, and say (or write) your own answer in 3–5 sentences. Then compare with the model answer: it is written the way lecturers expect — a definition, then an example, then a consequence.</div>
<table>
<thead><tr><th>Syllabus question</th><th>Exercises</th></tr></thead>
<tbody>
<tr><td>CQ1.1 — Why do we need a database? How many stages has the database gone through?</td><td>1, 2</td></tr>
<tr><td>CQ1.2 — What is a database system and its role? What is a DBMS?</td><td>3, 4, 8</td></tr>
<tr><td>CQ1.3 — What is a data model? What belongs to a data model? Examples?</td><td>5, 6, 7</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 1 · Bài 1.2 · Thực hành &amp; ôn tập</span>
<h2>CSDL &amp; DBMS — trả lời câu hỏi của syllabus, rồi kiểm lại bằng SQL chạy thật</h2>
<p class="lead">Chương 1 được kiểm bằng lời, không bằng code: progress test, câu hỏi FE và câu hỏi miệng của thầy/cô trên lớp. Syllabus nêu ba câu hỏi thảo luận (constructive question — CQ1.1–CQ1.3). Dưới đây mỗi câu được tách thành các bài tập kèm đáp án mẫu nói được trong hai phút, và — khi có ích — vài dòng SQL chạy thật trên SQL Server, để mỗi ý là thứ bạn đã tận mắt thấy xảy ra, chứ không phải một câu học thuộc.</p>
<div class="callout"><strong>Cách dùng trang này.</strong> Đọc câu hỏi, che đáp án lại, rồi tự nói (hoặc viết) câu trả lời trong 3–5 câu. Sau đó so với đáp án mẫu: nó được viết theo cách thầy/cô mong đợi — định nghĩa, rồi ví dụ, rồi hệ quả.</div>
<table>
<thead><tr><th>Câu hỏi của syllabus</th><th>Bài tập</th></tr></thead>
<tbody>
<tr><td>CQ1.1 — Vì sao cần CSDL? CSDL đã phát triển qua mấy giai đoạn?</td><td>1, 2</td></tr>
<tr><td>CQ1.2 — Hệ CSDL là gì và vai trò của nó? DBMS là gì?</td><td>3, 4, 8</td></tr>
<tr><td>CQ1.3 — Mô hình dữ liệu là gì? Gồm những gì? Ví dụ?</td><td>5, 6, 7</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — CQ1.1: "Why do we need a database?" (the Excel scenario)</h3>
<p class="nhan">Situation</p>
<p>Your class monitor keeps everybody's marks in an Excel file on Google Drive. Three lecturers enter marks in it, and the academic office copies it into its own file every week. List the problems this will cause and explain how a DBMS solves each.</p>
<p class="nhan">Model answer</p>
<table>
<thead><tr><th>Problem with files</th><th>What happens in the scenario</th><th>What a DBMS does</th></tr></thead>
<tbody>
<tr><td>Redundancy and inconsistency</td><td>the office's copy and the class file disagree after an edit</td><td>one shared database, no copies</td></tr>
<tr><td>Integrity</td><td>someone types 85 instead of 8.5 and nobody notices</td><td>constraints (CHECK, PRIMARY KEY) reject bad data</td></tr>
<tr><td>Concurrent access</td><td>two lecturers save at once, one edit is lost</td><td>transactions and locks</td></tr>
<tr><td>Atomicity and durability</td><td>the laptop crashes in the middle of a copy: half the marks are updated</td><td>a transaction happens entirely or not at all; committed data survives crashes</td></tr>
<tr><td>Security</td><td>every student with the link sees every mark</td><td>users, permissions, views</td></tr>
<tr><td>Difficult access</td><td>"average of DBI202 per class" needs manual formulas each time</td><td>a query language: one SELECT</td></tr>
</tbody>
</table>
<p>In one sentence: <em>we need a database because many people and programs must share the same data safely, correctly and for a long time — which files alone cannot guarantee.</em> The first two rows, run for real — the DBMS itself refuses the typo and the duplicate:</p>
<pre><code class="language-sql">CREATE TABLE Mark (
  studentID CHAR(8)      NOT NULL,
  course    CHAR(6)      NOT NULL,
  score     DECIMAL(3,1) NOT NULL CHECK (score BETWEEN 0 AND 10),   -- the rule lives in the database
  PRIMARY KEY (studentID, course)                                    -- no duplicate mark
);</code></pre>
<pre><code class="language-sql">INSERT INTO Mark VALUES ('SE190002', 'DBI202', 85);      -- typo: 85 instead of 8.5</code></pre>
<pre><code class="language-sql">INSERT INTO Mark VALUES ('SE190001', 'DBI202', 9.0);     -- the same student and course again</code></pre>
<div class="out">(1 row affected)<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "CK__Mark__score__283243A9". The conflict occurred in database "DBI202", table "dbo.Mark", column 'score'.</b><br>
The statement has been terminated.<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'PK__Mark__E7A0996F4CBC1BC1'. Cannot insert duplicate key in object 'dbo.Mark'. The duplicate key value is (SE190001, DBI202).</b><br>
The statement has been terminated.</div>
<table>
<thead><tr><th>studentID</th><th>course</th><th>score</th></tr></thead>
<tbody>
<tr><td>SE190001</td><td>DBI202</td><td>8.5</td></tr>
</tbody>
</table>
<div class="pitfall">"A database is faster than Excel" is not the main reason and is a weak answer. The reasons lecturers want are sharing, integrity, concurrency, recovery and security.</div>`,
    `<h3>🧪 Bài 1 — CQ1.1: "Vì sao cần cơ sở dữ liệu?" (tình huống Excel)</h3>
<p class="nhan">Tình huống</p>
<p>Lớp trưởng lưu điểm cả lớp trong một file Excel trên Google Drive. Ba giảng viên cùng nhập điểm vào đó, và phòng đào tạo mỗi tuần chép nó sang file riêng. Liệt kê các vấn đề sẽ xảy ra và giải thích DBMS giải quyết từng vấn đề thế nào.</p>
<p class="nhan">Đáp án mẫu</p>
<table>
<thead><tr><th>Vấn đề của lưu bằng tệp</th><th>Chuyện xảy ra trong tình huống</th><th>DBMS làm gì</th></tr></thead>
<tbody>
<tr><td>Dư thừa và không nhất quán (redundancy, inconsistency)</td><td>bản của phòng đào tạo và file của lớp lệch nhau sau một lần sửa</td><td>một CSDL dùng chung, không có bản sao</td></tr>
<tr><td>Toàn vẹn dữ liệu (integrity)</td><td>ai đó gõ 85 thay vì 8.5 mà không ai phát hiện</td><td>ràng buộc (CHECK, PRIMARY KEY) từ chối dữ liệu sai</td></tr>
<tr><td>Truy cập đồng thời (concurrent access)</td><td>hai giảng viên lưu cùng lúc, một lần sửa bị mất</td><td>giao dịch (transaction) và khoá (lock)</td></tr>
<tr><td>Nguyên tố và bền vững (atomicity, durability)</td><td>máy hỏng giữa lúc chép: một nửa điểm được cập nhật</td><td>giao dịch xảy ra trọn vẹn hoặc không; dữ liệu đã commit sống sót sau sự cố</td></tr>
<tr><td>Bảo mật (security)</td><td>sinh viên nào có link cũng xem được điểm của mọi người</td><td>tài khoản, phân quyền, view</td></tr>
<tr><td>Khó truy xuất</td><td>"điểm trung bình DBI202 theo lớp" lần nào cũng phải tự viết công thức</td><td>ngôn ngữ truy vấn: một câu SELECT</td></tr>
</tbody>
</table>
<p>Gói trong một câu: <em>cần CSDL vì nhiều người và nhiều chương trình phải dùng chung cùng một dữ liệu một cách an toàn, đúng đắn và lâu dài — điều mà chỉ dùng tệp không bảo đảm được.</em> Hai dòng đầu, chạy thật — chính DBMS từ chối lỗi gõ nhầm và dòng trùng:</p>
<pre><code class="language-sql">CREATE TABLE Mark (
  studentID CHAR(8)      NOT NULL,
  course    CHAR(6)      NOT NULL,
  score     DECIMAL(3,1) NOT NULL CHECK (score BETWEEN 0 AND 10),   -- luật nằm trong CSDL
  PRIMARY KEY (studentID, course)                                    -- không trùng điểm
);</code></pre>
<pre><code class="language-sql">INSERT INTO Mark VALUES ('SE190002', 'DBI202', 85);      -- gõ nhầm 85 thay vì 8.5</code></pre>
<pre><code class="language-sql">INSERT INTO Mark VALUES ('SE190001', 'DBI202', 9.0);     -- lại cùng sinh viên, cùng môn</code></pre>
<div class="out">(1 row affected)<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "CK__Mark__score__283243A9". The conflict occurred in database "DBI202", table "dbo.Mark", column 'score'.</b><br>
The statement has been terminated.<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'PK__Mark__E7A0996F4CBC1BC1'. Cannot insert duplicate key in object 'dbo.Mark'. The duplicate key value is (SE190001, DBI202).</b><br>
The statement has been terminated.</div>
<table>
<thead><tr><th>studentID</th><th>course</th><th>score</th></tr></thead>
<tbody>
<tr><td>SE190001</td><td>DBI202</td><td>8.5</td></tr>
</tbody>
</table>
<div class="pitfall">"CSDL nhanh hơn Excel" không phải lý do chính và là câu trả lời yếu. Lý do thầy/cô muốn nghe là: dùng chung, toàn vẹn, đồng thời, phục hồi và bảo mật.</div>`),
    bi(`<h3>🧪 Exercise 2 — CQ1.1: "How many stages has the database gone through?"</h3>
<p class="nhan">Task</p>
<p>(a) Give the stages in order with one characteristic each. (b) Match each system to its model: IBM IMS, a CODASYL system, System R, Oracle v.2, MongoDB, Redis, a system with SQL and transactions spread over many servers.</p>
<p class="nhan">Model answer</p>
<table>
<thead><tr><th>Stage</th><th>Period (slide 11)</th><th>Characteristic</th><th>Systems from (b)</th></tr></thead>
<tbody>
<tr><td>File systems</td><td>until about 1970</td><td>each program owns its files; no query language</td><td>—</td></tr>
<tr><td>Hierarchical</td><td>1960s–1980s</td><td>tree: one parent per record, data duplicated</td><td>IBM IMS</td></tr>
<tr><td>Network</td><td>1970s–1990</td><td>graph: several parents; navigation by pointers, no high-level query language</td><td>a CODASYL system</td></tr>
<tr><td>Relational</td><td>from the 1970s</td><td>tables; declarative SQL; data independence</td><td>System R, Oracle v.2</td></tr>
<tr><td>Object / object-relational</td><td>from the 1990s</td><td>objects, complex types inside tables</td><td>—</td></tr>
<tr><td>NoSQL / NewSQL</td><td>2000s–now</td><td>NoSQL: documents, key-value, graphs for scale; NewSQL: SQL + transactions on many machines</td><td>MongoDB, Redis (NoSQL); the last one (NewSQL)</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Say it as a story:</strong> files were private → trees shared but duplicated → graphs removed duplicates but needed pointer programs → tables let you just ask (SQL) → objects and NoSQL added flexibility and scale.</p>`,
    `<h3>🧪 Bài 2 — CQ1.1: "CSDL đã phát triển qua mấy giai đoạn?"</h3>
<p class="nhan">Đề bài</p>
<p>(a) Nêu các giai đoạn theo thứ tự, mỗi giai đoạn một đặc điểm. (b) Ghép mỗi hệ với mô hình của nó: IBM IMS, một hệ CODASYL, System R, Oracle v.2, MongoDB, Redis, một hệ có SQL và giao dịch trải trên nhiều máy chủ.</p>
<p class="nhan">Đáp án mẫu</p>
<table>
<thead><tr><th>Giai đoạn</th><th>Thời kỳ (slide 11)</th><th>Đặc điểm</th><th>Hệ ở câu (b)</th></tr></thead>
<tbody>
<tr><td>Hệ thống tệp (file systems)</td><td>tới khoảng 1970</td><td>mỗi chương trình giữ tệp riêng; không có ngôn ngữ truy vấn</td><td>—</td></tr>
<tr><td>Phân cấp (hierarchical)</td><td>1960–1980</td><td>cây: mỗi bản ghi một cha, dữ liệu bị lặp</td><td>IBM IMS</td></tr>
<tr><td>Mạng (network)</td><td>1970–1990</td><td>đồ thị: nhiều cha; đi theo con trỏ, không có ngôn ngữ truy vấn bậc cao</td><td>một hệ CODASYL</td></tr>
<tr><td>Quan hệ (relational)</td><td>từ thập niên 1970</td><td>bảng; SQL khai báo; độc lập dữ liệu</td><td>System R, Oracle v.2</td></tr>
<tr><td>Đối tượng / quan hệ – đối tượng</td><td>từ thập niên 1990</td><td>đối tượng, kiểu phức tạp trong bảng</td><td>—</td></tr>
<tr><td>NoSQL / NewSQL</td><td>2000 tới nay</td><td>NoSQL: tài liệu, khoá – giá trị, đồ thị để mở rộng; NewSQL: SQL + giao dịch trên nhiều máy</td><td>MongoDB, Redis (NoSQL); hệ cuối (NewSQL)</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Kể như một câu chuyện:</strong> tệp thì của riêng ai nấy giữ → cây cho dùng chung nhưng lặp dữ liệu → đồ thị hết lặp nhưng phải lập trình đi theo con trỏ → bảng cho phép chỉ cần hỏi (SQL) → đối tượng và NoSQL thêm linh hoạt và khả năng mở rộng.</p>`),
    bi(`<h3>🧪 Exercise 3 — CQ1.2: database, DBMS or database system?</h3>
<p class="nhan">Task</p>
<p>Classify each item: (1) Microsoft SQL Server; (2) the rows of all FPTU students' marks; (3) FAP = its application + SQL Server + the marks; (4) PostgreSQL; (5) the file <code>FUHCompany.mdf</code> on disk; (6) an Excel workbook of expenses; (7) the table definitions of FAP (names, columns, types).</p>
<p class="nhan">Model answer</p>
<table>
<thead><tr><th>Item</th><th>Answer</th><th>Reason</th></tr></thead>
<tbody>
<tr><td>1, 4</td><td>DBMS</td><td>software that creates, stores, queries and protects databases</td></tr>
<tr><td>2, 5</td><td>database</td><td>the data itself (5 is where SQL Server keeps it on disk)</td></tr>
<tr><td>3</td><td>database system</td><td>DBMS + data (+ applications), slide 5</td></tr>
<tr><td>6</td><td>none of them</td><td>data in a spreadsheet file; Excel is not a DBMS</td></tr>
<tr><td>7</td><td>meta-data (part of the database)</td><td>the "stored database definition" box of slide 5, kept by the DBMS</td></tr>
</tbody>
</table>
<div class="pitfall">"MySQL is a database" is the everyday phrase, and exactly the trap in FE options: MySQL, SQL Server, Oracle and PostgreSQL are DBMSs.</div>`,
    `<h3>🧪 Bài 3 — CQ1.2: CSDL, DBMS hay hệ CSDL?</h3>
<p class="nhan">Đề bài</p>
<p>Phân loại từng thứ: (1) Microsoft SQL Server; (2) các dòng điểm của mọi sinh viên FPTU; (3) FAP = ứng dụng của nó + SQL Server + điểm; (4) PostgreSQL; (5) tệp <code>FUHCompany.mdf</code> trên đĩa; (6) một workbook Excel ghi chi tiêu; (7) phần định nghĩa bảng của FAP (tên, cột, kiểu).</p>
<p class="nhan">Đáp án mẫu</p>
<table>
<thead><tr><th>Mục</th><th>Đáp án</th><th>Lý do</th></tr></thead>
<tbody>
<tr><td>1, 4</td><td>DBMS</td><td>phần mềm tạo, lưu, truy vấn và bảo vệ CSDL</td></tr>
<tr><td>2, 5</td><td>cơ sở dữ liệu</td><td>chính là dữ liệu (5 là nơi SQL Server cất nó trên đĩa)</td></tr>
<tr><td>3</td><td>hệ CSDL</td><td>DBMS + dữ liệu (+ ứng dụng), slide 5</td></tr>
<tr><td>6</td><td>không thuộc loại nào</td><td>dữ liệu trong một tệp bảng tính; Excel không phải DBMS</td></tr>
<tr><td>7</td><td>siêu dữ liệu (meta-data, một phần của CSDL)</td><td>ô "stored database definition" ở slide 5, do DBMS lưu</td></tr>
</tbody>
</table>
<div class="pitfall">"MySQL là một database" là cách nói đời thường, và đúng là cái bẫy trong phương án FE: MySQL, SQL Server, Oracle và PostgreSQL là DBMS.</div>`),
    bi(`<h3>🧪 Exercise 4 — CQ1.2: the role of a DBMS, seen in a bank transfer</h3>
<p class="nhan">Task</p>
<p>An transfers 200,000 to Bình. The DBMS must subtract from one account and add to the other. What happens if the power fails between the two statements, and which of the five duties of slide 6 prevents a disaster?</p>
<p class="nhan">Model answer</p>
<p>Both statements are put in one <strong>transaction</strong>. Until COMMIT, nothing is final; if the power fails (or the program calls ROLLBACK), the DBMS undoes every change using its log, so money is neither lost nor created. This is duty (4) durability plus atomicity, handled by the transaction manager and the logging and recovery component of slide 16. The script simulates the failure with ROLLBACK:</p>
<pre><code class="language-sql">BEGIN TRANSACTION;                                               -- transfer 200000 from A01 to A02
  UPDATE Account SET balance = balance - 200000 WHERE accID = 'A01';
  UPDATE Account SET balance = balance + 200000 WHERE accID = 'A02';
  SELECT accID, balance FROM Account;                            -- inside the transaction
ROLLBACK;                                                        -- e.g. the power goes out: undo everything
SELECT accID, balance FROM Account;                              -- back to the start</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>accID</th><th>balance</th></tr></thead>
<tbody>
<tr><td>A01</td><td>300000</td></tr>
<tr><td>A02</td><td>300000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>accID</th><th>balance</th></tr></thead>
<tbody>
<tr><td>A01</td><td>500000</td></tr>
<tr><td>A02</td><td>100000</td></tr>
</tbody>
</table>
<p>Inside the transaction A01 has 300,000 and A02 300,000; after ROLLBACK both are back to 500,000 and 100,000.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a transaction usually starts with just <code>BEGIN</code> (<code>BEGIN TRANSACTION</code> is also accepted) and ends with <code>COMMIT</code> or <code>ROLLBACK</code> — the idea is identical:
<pre><code class="language-sql">BEGIN;                                                           -- PG: BEGIN is enough
  UPDATE account SET balance = balance - 200000 WHERE accid = 'A01';
  UPDATE account SET balance = balance + 200000 WHERE accid = 'A02';
ROLLBACK;
SELECT accid, balance FROM account ORDER BY accid;</code></pre>
<div class="out">INSERT 0 2<br>
UPDATE 1<br>
UPDATE 1</div>
<table>
<thead><tr><th>accid</th><th>balance</th></tr></thead>
<tbody>
<tr><td>A01</td><td>500000</td></tr>
<tr><td>A02</td><td>100000</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-1-2-acid">PostgreSQL course — ACID</a>.</div>`,
    `<h3>🧪 Bài 4 — CQ1.2: vai trò của DBMS, nhìn qua một lần chuyển tiền</h3>
<p class="nhan">Đề bài</p>
<p>An chuyển 200.000 cho Bình. DBMS phải trừ ở một tài khoản và cộng vào tài khoản kia. Chuyện gì xảy ra nếu mất điện giữa hai câu lệnh, và nhiệm vụ nào trong năm nhiệm vụ ở slide 6 ngăn được thảm hoạ?</p>
<p class="nhan">Đáp án mẫu</p>
<p>Hai câu lệnh được đặt trong một <strong>giao dịch (transaction)</strong>. Chưa COMMIT thì chưa có gì là chính thức; nếu mất điện (hoặc chương trình gọi ROLLBACK — hoàn tác), DBMS dùng nhật ký (log) để huỷ mọi thay đổi, nên tiền không mất đi cũng không tự sinh ra. Đó là nhiệm vụ (4) tính bền vững cộng tính nguyên tố (atomicity — trọn vẹn hoặc không), do bộ quản lý giao dịch và thành phần ghi nhật ký – phục hồi ở slide 16 đảm nhận. Script mô phỏng sự cố bằng ROLLBACK:</p>
<pre><code class="language-sql">BEGIN TRANSACTION;                                               -- chuyển 200000 từ A01 sang A02
  UPDATE Account SET balance = balance - 200000 WHERE accID = 'A01';
  UPDATE Account SET balance = balance + 200000 WHERE accID = 'A02';
  SELECT accID, balance FROM Account;                            -- bên trong giao dịch
ROLLBACK;                                                        -- vd mất điện: hoàn tác tất cả
SELECT accID, balance FROM Account;                              -- về như lúc đầu</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>accID</th><th>balance</th></tr></thead>
<tbody>
<tr><td>A01</td><td>300000</td></tr>
<tr><td>A02</td><td>300000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>accID</th><th>balance</th></tr></thead>
<tbody>
<tr><td>A01</td><td>500000</td></tr>
<tr><td>A02</td><td>100000</td></tr>
</tbody>
</table>
<p>Bên trong giao dịch A01 còn 300.000 và A02 có 300.000; sau ROLLBACK cả hai trở về 500.000 và 100.000.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> giao dịch thường mở chỉ bằng <code>BEGIN</code> (viết <code>BEGIN TRANSACTION</code> cũng được chấp nhận) và đóng bằng <code>COMMIT</code> hoặc <code>ROLLBACK</code> — ý tưởng y hệt:
<pre><code class="language-sql">BEGIN;                                                           -- PG: chỉ cần BEGIN
  UPDATE account SET balance = balance - 200000 WHERE accid = 'A01';
  UPDATE account SET balance = balance + 200000 WHERE accid = 'A02';
ROLLBACK;
SELECT accid, balance FROM account ORDER BY accid;</code></pre>
<div class="out">INSERT 0 2<br>
UPDATE 1<br>
UPDATE 1</div>
<table>
<thead><tr><th>accid</th><th>balance</th></tr></thead>
<tbody>
<tr><td>A01</td><td>500000</td></tr>
<tr><td>A02</td><td>100000</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-1-2-acid">Khoá PostgreSQL — ACID</a>.</div>`),
    bi(`<h3>🧪 Exercise 5 — CQ1.3: "What is a data model? What belongs to it?"</h3>
<p class="nhan">Model answer</p>
<p>A <strong>data model</strong> is a notation for describing data or information. Following the textbook (Ullman §2.1.1) it has three parts:</p>
<table>
<thead><tr><th>Part</th><th>Meaning</th><th>In the relational model</th></tr></thead>
<tbody>
<tr><td>Structure of the data</td><td>how data is organised</td><td>tables with typed columns</td></tr>
<tr><td>Operations on the data</td><td>what you may do with it: queries and modifications</td><td>SELECT, INSERT, UPDATE, DELETE (relational algebra underneath)</td></tr>
<tr><td>Constraints on the data</td><td>limits on what the data may be</td><td>keys, foreign keys, CHECK, NOT NULL</td></tr>
</tbody>
</table>
<p>Examples of data models: relational (SQL Server), semistructured (XML, JSON documents — MongoDB), and historically hierarchical and network (slides 7–8); the E/R model (Chapter 3) is a high-level model for design. All three parts in a few lines of T-SQL — structure, a constraint, an operation, and the constraint at work:</p>
<pre><code class="language-sql">CREATE TABLE Course (                                            -- 1. structure
  courseCode CHAR(6)      PRIMARY KEY,                           -- 3. constraint: key
  credits    INT          CHECK (credits &gt; 0)                    -- 3. constraint: domain
);</code></pre>
<pre><code class="language-sql">SELECT COUNT(*) AS courses, SUM(credits) AS totalCredits FROM Course;   -- 2. operations</code></pre>
<pre><code class="language-sql">INSERT INTO Course VALUES ('JPD113', 0);                         -- the constraint refuses it</code></pre>
<div class="out">(5 rows affected)</div>
<table>
<thead><tr><th>courses</th><th>totalCredits</th></tr></thead>
<tbody>
<tr><td>5</td><td>15</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "CK__Course__credits__7772503F". The conflict occurred in database "DBI202", table "dbo.Course", column 'credits'.</b><br>
The statement has been terminated.</div>
<div class="pitfall">Students often answer "a data model is a table". A table is only the structure part of one model; the definition must mention structure, operations and constraints.</div>`,
    `<h3>🧪 Bài 5 — CQ1.3: "Mô hình dữ liệu là gì? Gồm những gì?"</h3>
<p class="nhan">Đáp án mẫu</p>
<p><strong>Mô hình dữ liệu (data model)</strong> là một cách ký hiệu để mô tả dữ liệu hay thông tin. Theo giáo trình (Ullman §2.1.1) nó gồm ba phần:</p>
<table>
<thead><tr><th>Phần</th><th>Nghĩa</th><th>Trong mô hình quan hệ</th></tr></thead>
<tbody>
<tr><td>Cấu trúc dữ liệu (structure)</td><td>dữ liệu được tổ chức thế nào</td><td>các bảng với cột có kiểu</td></tr>
<tr><td>Thao tác trên dữ liệu (operations)</td><td>được làm gì với nó: truy vấn và sửa đổi</td><td>SELECT, INSERT, UPDATE, DELETE (bên dưới là đại số quan hệ)</td></tr>
<tr><td>Ràng buộc trên dữ liệu (constraints)</td><td>giới hạn dữ liệu được phép là gì</td><td>khoá, khoá ngoại, CHECK, NOT NULL</td></tr>
</tbody>
</table>
<p>Ví dụ các mô hình dữ liệu: quan hệ (SQL Server), bán cấu trúc (semistructured — tài liệu XML, JSON, như MongoDB), và trong lịch sử là phân cấp, mạng (slide 7–8); mô hình E/R (Chương 3) là mô hình mức cao dùng để thiết kế. Cả ba phần trong vài dòng T-SQL — cấu trúc, một ràng buộc, một thao tác, và ràng buộc đang làm việc:</p>
<pre><code class="language-sql">CREATE TABLE Course (                                            -- 1. cấu trúc
  courseCode CHAR(6)      PRIMARY KEY,                           -- 3. ràng buộc: khoá
  credits    INT          CHECK (credits &gt; 0)                    -- 3. ràng buộc: miền giá trị
);</code></pre>
<pre><code class="language-sql">SELECT COUNT(*) AS courses, SUM(credits) AS totalCredits FROM Course;   -- 2. thao tác</code></pre>
<pre><code class="language-sql">INSERT INTO Course VALUES ('JPD113', 0);                         -- ràng buộc từ chối</code></pre>
<div class="out">(5 rows affected)</div>
<table>
<thead><tr><th>courses</th><th>totalCredits</th></tr></thead>
<tbody>
<tr><td>5</td><td>15</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the CHECK constraint "CK__Course__credits__7772503F". The conflict occurred in database "DBI202", table "dbo.Course", column 'credits'.</b><br>
The statement has been terminated.</div>
<div class="pitfall">Nhiều bạn trả lời "mô hình dữ liệu là một cái bảng". Bảng chỉ là phần cấu trúc của một mô hình; định nghĩa phải nêu đủ cấu trúc, thao tác và ràng buộc.</div>`),
    bi(`<h3>🧪 Exercise 6 — CQ1.3 / CQ8.2: three levels and data independence</h3>
<p class="nhan">Task</p>
<p>For each change, say which level of the three-level architecture (external / conceptual / internal) it touches, and whether the applications must be rewritten: (a) add an index on Student.FullName; (b) add a column Email to Student; (c) give lecturers a view that hides students' phone numbers; (d) move the database files to a faster disk.</p>
<p class="nhan">Model answer</p>
<table>
<thead><tr><th>Change</th><th>Level</th><th>Applications rewritten?</th></tr></thead>
<tbody>
<tr><td>(a) index</td><td>internal</td><td>no — physical data independence</td></tr>
<tr><td>(b) new column</td><td>conceptual</td><td>no for programs that name their columns — logical data independence</td></tr>
<tr><td>(c) view without phones</td><td>external</td><td>no — it is a new window on the same data</td></tr>
<tr><td>(d) faster disk</td><td>internal</td><td>no</td></tr>
</tbody>
</table>
<p>An external view in practice — lecturers see names and departments, never salaries:</p>
<pre><code class="language-sql">CREATE TABLE Employee (empID INT PRIMARY KEY, fullName NVARCHAR(40), dept NVARCHAR(20), salary DECIMAL(12,0));
INSERT INTO Employee VALUES (1, N'Lan', N'Kế toán', 20000000), (2, N'Minh', N'Phần mềm', 30000000), (3, N'Hùng', N'Phần mềm', 25000000);
GO
CREATE VIEW PhoneBook AS                                         -- an external level: no salary
SELECT fullName, dept FROM Employee;
GO
SELECT * FROM PhoneBook ORDER BY fullName;</code></pre>
<div class="out">(3 rows affected)</div>
<table>
<thead><tr><th>fullName</th><th>dept</th></tr></thead>
<tbody>
<tr><td>Hùng</td><td>Phần mềm</td></tr>
<tr><td>Lan</td><td>Kế toán</td></tr>
<tr><td>Minh</td><td>Phần mềm</td></tr>
</tbody>
</table>
<div class="pitfall"><code>SELECT *</code> in application code breaks logical data independence: after change (b) the program suddenly receives one more column. Name the columns you need.</div>`,
    `<h3>🧪 Bài 6 — CQ1.3 / CQ8.2: ba mức và độc lập dữ liệu</h3>
<p class="nhan">Đề bài</p>
<p>Với mỗi thay đổi, cho biết nó đụng tới mức nào của kiến trúc ba mức (ngoài / khái niệm / trong), và ứng dụng có phải viết lại không: (a) thêm chỉ mục trên Student.FullName; (b) thêm cột Email vào Student; (c) cho giảng viên một view ẩn số điện thoại sinh viên; (d) chuyển tệp CSDL sang ổ đĩa nhanh hơn.</p>
<p class="nhan">Đáp án mẫu</p>
<table>
<thead><tr><th>Thay đổi</th><th>Mức</th><th>Viết lại ứng dụng?</th></tr></thead>
<tbody>
<tr><td>(a) chỉ mục</td><td>trong (internal)</td><td>không — độc lập dữ liệu vật lý</td></tr>
<tr><td>(b) cột mới</td><td>khái niệm (conceptual)</td><td>không, với chương trình ghi rõ tên cột — độc lập dữ liệu logic</td></tr>
<tr><td>(c) view không có số điện thoại</td><td>ngoài (external)</td><td>không — chỉ là một khung nhìn mới trên cùng dữ liệu</td></tr>
<tr><td>(d) ổ đĩa nhanh hơn</td><td>trong</td><td>không</td></tr>
</tbody>
</table>
<p>Một khung nhìn ngoài trong thực tế — người xem thấy tên và phòng ban, không bao giờ thấy lương:</p>
<pre><code class="language-sql">CREATE TABLE Employee (empID INT PRIMARY KEY, fullName NVARCHAR(40), dept NVARCHAR(20), salary DECIMAL(12,0));
INSERT INTO Employee VALUES (1, N'Lan', N'Kế toán', 20000000), (2, N'Minh', N'Phần mềm', 30000000), (3, N'Hùng', N'Phần mềm', 25000000);
GO
CREATE VIEW PhoneBook AS                                         -- một mức ngoài: không có lương
SELECT fullName, dept FROM Employee;
GO
SELECT * FROM PhoneBook ORDER BY fullName;</code></pre>
<div class="out">(3 rows affected)</div>
<table>
<thead><tr><th>fullName</th><th>dept</th></tr></thead>
<tbody>
<tr><td>Hùng</td><td>Phần mềm</td></tr>
<tr><td>Lan</td><td>Kế toán</td></tr>
<tr><td>Minh</td><td>Phần mềm</td></tr>
</tbody>
</table>
<div class="pitfall"><code>SELECT *</code> trong code ứng dụng phá độc lập dữ liệu logic: sau thay đổi (b) chương trình bỗng nhận thêm một cột. Hãy ghi rõ tên các cột cần dùng.</div>`),
    bi(`<h3>🧪 Exercise 7 — DDL or DML? (a classic progress-test question)</h3>
<p class="nhan">Task</p>
<p>Classify the eight numbered statements, then run them.</p>
<pre><code class="language-sql">CREATE TABLE Club (clubID INT PRIMARY KEY, name NVARCHAR(40));                 -- 1 DDL
ALTER TABLE Club ADD founded INT;                                              -- 2 DDL
INSERT INTO Club VALUES (1, N'CLB Guitar', 2015), (2, N'CLB Cờ vua', 2018);    -- 3 DML
UPDATE Club SET founded = 2016 WHERE clubID = 1;                               -- 4 DML
SELECT name, founded FROM Club ORDER BY clubID;                                -- 5 DML (query)
DELETE FROM Club WHERE clubID = 2;                                             -- 6 DML
TRUNCATE TABLE Club;                                                           -- 7 DDL in SQL Server
DROP TABLE Club;                                                               -- 8 DDL
SELECT COUNT(*) AS clubTables FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Club';</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>name</th><th>founded</th></tr></thead>
<tbody>
<tr><td>CLB Guitar</td><td>2016</td></tr>
<tr><td>CLB Cờ vua</td><td>2018</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>clubTables</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<p class="nhan">Model answer</p>
<p><strong>DDL</strong> (change the structure): 1 CREATE TABLE, 2 ALTER TABLE, 7 TRUNCATE TABLE, 8 DROP TABLE. <strong>DML</strong> (read or change the rows): 3 INSERT, 4 UPDATE, 5 SELECT, 6 DELETE. The last query proves the DROP: no table named Club is left.</p>
<div class="pitfall">TRUNCATE empties a table like DELETE without WHERE, but SQL Server classifies it as DDL: it deallocates the data pages instead of deleting rows one by one, cannot have a WHERE, and resets an IDENTITY counter.</div>`,
    `<h3>🧪 Bài 7 — DDL hay DML? (câu progress test kinh điển)</h3>
<p class="nhan">Đề bài</p>
<p>Phân loại tám câu lệnh được đánh số, rồi chạy chúng.</p>
<pre><code class="language-sql">CREATE TABLE Club (clubID INT PRIMARY KEY, name NVARCHAR(40));                 -- 1 DDL
ALTER TABLE Club ADD founded INT;                                              -- 2 DDL
INSERT INTO Club VALUES (1, N'CLB Guitar', 2015), (2, N'CLB Cờ vua', 2018);    -- 3 DML
UPDATE Club SET founded = 2016 WHERE clubID = 1;                               -- 4 DML
SELECT name, founded FROM Club ORDER BY clubID;                                -- 5 DML (truy vấn)
DELETE FROM Club WHERE clubID = 2;                                             -- 6 DML
TRUNCATE TABLE Club;                                                           -- 7 DDL trong SQL Server
DROP TABLE Club;                                                               -- 8 DDL
SELECT COUNT(*) AS clubTables FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Club';</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>name</th><th>founded</th></tr></thead>
<tbody>
<tr><td>CLB Guitar</td><td>2016</td></tr>
<tr><td>CLB Cờ vua</td><td>2018</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>clubTables</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<p class="nhan">Đáp án mẫu</p>
<p><strong>DDL</strong> (đổi cấu trúc): 1 CREATE TABLE, 2 ALTER TABLE, 7 TRUNCATE TABLE, 8 DROP TABLE. <strong>DML</strong> (đọc hoặc đổi các dòng): 3 INSERT, 4 UPDATE, 5 SELECT, 6 DELETE. Câu truy vấn cuối chứng minh DROP đã chạy: không còn bảng nào tên Club.</p>
<div class="pitfall">TRUNCATE làm rỗng bảng giống DELETE không có WHERE, nhưng SQL Server xếp nó vào DDL: nó giải phóng các trang dữ liệu thay vì xoá từng dòng, không có WHERE được, và đặt lại bộ đếm IDENTITY.</div>`),
    bi(`<h3>🧪 Exercise 8 — Data vs information, and who does what</h3>
<p class="nhan">Task</p>
<p>(a) The table Mark holds six rows (studentID, course, score). Turn them into information the head of department can act on. (b) Who does each job — DBA, designer or end user: backing up the database every night; deciding that Enroll's key includes the semester; a lecturer typing marks; granting a new staff account.</p>
<p class="nhan">Model answer</p>
<pre><code class="language-sql">SELECT course,
       COUNT(*)                                   AS students,
       AVG(score)                                 AS avgScore,
       SUM(CASE WHEN score &lt; 5 THEN 1 ELSE 0 END) AS failed      -- information for a decision
FROM Mark
GROUP BY course
ORDER BY course;</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>course</th><th>students</th><th>avgScore</th><th>failed</th></tr></thead>
<tbody>
<tr><td>CSD201</td><td>2</td><td>8.000000</td><td>0</td></tr>
<tr><td>DBI202</td><td>4</td><td>5.625000</td><td>2</td></tr>
</tbody>
</table>
<p>(a) The six rows are data; "DBI202: 4 students, average 5.625, 2 failed — CSD201: 2 students, average 8.0, none failed" is information: it tells the department where to open a revision class. (b) Backups and new accounts: the DBA. The key of Enroll: the database designer. Typing marks: an end user.</p>`,
    `<h3>🧪 Bài 8 — Dữ liệu và thông tin, và ai làm việc gì</h3>
<p class="nhan">Đề bài</p>
<p>(a) Bảng Mark có sáu dòng (studentID, course, score). Biến chúng thành thông tin để trưởng bộ môn ra quyết định. (b) Ai làm từng việc — DBA, người thiết kế hay người dùng cuối: sao lưu CSDL mỗi đêm; quyết định khoá của Enroll có cả học kỳ; giảng viên nhập điểm; cấp tài khoản cho nhân viên mới.</p>
<p class="nhan">Đáp án mẫu</p>
<pre><code class="language-sql">SELECT course,
       COUNT(*)                                   AS students,
       AVG(score)                                 AS avgScore,
       SUM(CASE WHEN score &lt; 5 THEN 1 ELSE 0 END) AS failed      -- thông tin để ra quyết định
FROM Mark
GROUP BY course
ORDER BY course;</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>course</th><th>students</th><th>avgScore</th><th>failed</th></tr></thead>
<tbody>
<tr><td>CSD201</td><td>2</td><td>8.000000</td><td>0</td></tr>
<tr><td>DBI202</td><td>4</td><td>5.625000</td><td>2</td></tr>
</tbody>
</table>
<p>(a) Sáu dòng kia là dữ liệu; "DBI202: 4 sinh viên, trung bình 5,625, 2 trượt — CSD201: 2 sinh viên, trung bình 8,0, không ai trượt" là thông tin: nó cho bộ môn biết nên mở lớp ôn ở đâu. (b) Sao lưu và cấp tài khoản: DBA (người quản trị CSDL). Khoá của Enroll: người thiết kế CSDL. Nhập điểm: người dùng cuối.</p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>data</strong></td><td>dữ liệu</td><td>Raw recorded facts without context.</td></tr>
<tr><td><strong>information</strong></td><td>thông tin</td><td>Data processed so that it is meaningful and useful for a decision.</td></tr>
<tr><td><strong>database</strong></td><td>cơ sở dữ liệu (CSDL)</td><td>A collection of related data that exists over a long period, managed by a DBMS.</td></tr>
<tr><td><strong>DBMS (database management system)</strong></td><td>hệ quản trị CSDL</td><td>Software to create, store, query and protect databases — SQL Server, PostgreSQL.</td></tr>
<tr><td><strong>database system</strong></td><td>hệ cơ sở dữ liệu</td><td>The DBMS together with the data, sometimes with the applications.</td></tr>
<tr><td><strong>schema</strong></td><td>lược đồ</td><td>The description of the data: tables, columns, types, constraints.</td></tr>
<tr><td><strong>meta-data</strong></td><td>siêu dữ liệu</td><td>Data about the data (the schema), kept by the DBMS in its catalog.</td></tr>
<tr><td><strong>query</strong></td><td>truy vấn</td><td>A question asked to the database, written in SQL.</td></tr>
<tr><td><strong>query plan</strong></td><td>kế hoạch thực thi</td><td>The steps the DBMS chose to answer a query, produced by the query compiler.</td></tr>
<tr><td><strong>transaction</strong></td><td>giao dịch</td><td>A group of operations executed all or nothing.</td></tr>
<tr><td><strong>durability</strong></td><td>tính bền vững</td><td>Committed changes are never lost, even after a crash.</td></tr>
<tr><td><strong>concurrency control</strong></td><td>điều khiển đồng thời</td><td>Keeping many simultaneous users from corrupting each other's work (locks).</td></tr>
<tr><td><strong>DDL (data definition language)</strong></td><td>ngôn ngữ định nghĩa dữ liệu</td><td>Commands that change the schema: CREATE, ALTER, DROP, TRUNCATE.</td></tr>
<tr><td><strong>DML (data manipulation language)</strong></td><td>ngôn ngữ thao tác dữ liệu</td><td>Commands that read or change rows: SELECT, INSERT, UPDATE, DELETE.</td></tr>
<tr><td><strong>data model</strong></td><td>mô hình dữ liệu</td><td>A notation for data made of structure, operations and constraints.</td></tr>
<tr><td><strong>data independence</strong></td><td>độc lập dữ liệu</td><td>Changing storage (physical) or the schema (logical) without rewriting applications.</td></tr>
<tr><td><strong>data warehouse</strong></td><td>kho dữ liệu</td><td>A central database into which data from many sources is copied periodically for analysis.</td></tr>
<tr><td><strong>DBA (database administrator)</strong></td><td>người quản trị CSDL</td><td>The person who grants access, monitors, backs up and tunes the database.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>data</strong></td><td>dữ liệu</td><td>Các sự kiện thô được ghi lại, chưa có ngữ cảnh.</td></tr>
<tr><td><strong>information</strong></td><td>thông tin</td><td>Dữ liệu đã được xử lý để có ý nghĩa và dùng được cho việc ra quyết định.</td></tr>
<tr><td><strong>database</strong></td><td>cơ sở dữ liệu (CSDL)</td><td>Một tập dữ liệu có liên quan, tồn tại lâu dài, do một DBMS quản lý.</td></tr>
<tr><td><strong>DBMS (database management system)</strong></td><td>hệ quản trị CSDL</td><td>Phần mềm để tạo, lưu, truy vấn và bảo vệ CSDL — SQL Server, PostgreSQL.</td></tr>
<tr><td><strong>database system</strong></td><td>hệ cơ sở dữ liệu</td><td>DBMS cùng với dữ liệu, đôi khi cả các ứng dụng.</td></tr>
<tr><td><strong>schema</strong></td><td>lược đồ</td><td>Bản mô tả dữ liệu: bảng, cột, kiểu, ràng buộc.</td></tr>
<tr><td><strong>meta-data</strong></td><td>siêu dữ liệu</td><td>Dữ liệu về dữ liệu (lược đồ), DBMS lưu trong danh mục của nó.</td></tr>
<tr><td><strong>query</strong></td><td>truy vấn</td><td>Một câu hỏi gửi cho CSDL, viết bằng SQL.</td></tr>
<tr><td><strong>query plan</strong></td><td>kế hoạch thực thi</td><td>Các bước DBMS chọn để trả lời truy vấn, do bộ biên dịch truy vấn tạo ra.</td></tr>
<tr><td><strong>transaction</strong></td><td>giao dịch</td><td>Một nhóm thao tác được thực hiện trọn vẹn hoặc không thực hiện gì.</td></tr>
<tr><td><strong>durability</strong></td><td>tính bền vững</td><td>Thay đổi đã commit không bao giờ mất, kể cả sau sự cố.</td></tr>
<tr><td><strong>concurrency control</strong></td><td>điều khiển đồng thời</td><td>Giữ cho nhiều người dùng cùng lúc không làm hỏng việc của nhau (khoá).</td></tr>
<tr><td><strong>DDL (data definition language)</strong></td><td>ngôn ngữ định nghĩa dữ liệu</td><td>Các lệnh đổi lược đồ: CREATE, ALTER, DROP, TRUNCATE.</td></tr>
<tr><td><strong>DML (data manipulation language)</strong></td><td>ngôn ngữ thao tác dữ liệu</td><td>Các lệnh đọc hoặc đổi dòng: SELECT, INSERT, UPDATE, DELETE.</td></tr>
<tr><td><strong>data model</strong></td><td>mô hình dữ liệu</td><td>Một cách ký hiệu dữ liệu gồm cấu trúc, thao tác và ràng buộc.</td></tr>
<tr><td><strong>data independence</strong></td><td>độc lập dữ liệu</td><td>Đổi cách lưu (vật lý) hay lược đồ (logic) mà không phải viết lại ứng dụng.</td></tr>
<tr><td><strong>data warehouse</strong></td><td>kho dữ liệu</td><td>Một CSDL trung tâm, định kỳ chép dữ liệu từ nhiều nguồn về để phân tích.</td></tr>
<tr><td><strong>DBA (database administrator)</strong></td><td>người quản trị CSDL</td><td>Người cấp quyền, giám sát, sao lưu và tinh chỉnh CSDL.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 1</h2>
<ol>
<li><strong>Data vs information</strong>: data are raw facts; information is processed data that supports a decision. SQL queries are the processing step.</li>
<li><strong>Database / DBMS / database system</strong>: the data / the software (SQL Server) / both together. SQL Server is a DBMS, not a database.</li>
<li><strong>Five duties of a DBMS</strong>: create databases and schemas, query, store very large data, durability, controlled concurrent access. Early file-based DBMSs did them poorly.</li>
<li><strong>History</strong>: files → hierarchical (tree, IMS) → network (graph, CODASYL) → relational (Codd 1970, System R, Ingres, SQL 1974, Oracle 1979) → object / object-relational → NoSQL / NewSQL.</li>
<li><strong>Integration</strong>: data warehouse (copy periodically, fast analysis) vs mediator (translate queries, always fresh).</li>
<li><strong>Inside a DBMS</strong>: query compiler → query plan → execution engine → index/file/record manager → buffer manager → storage manager; transaction manager with logging/recovery and concurrency control (lock table); DDL compiler for schema changes.</li>
<li><strong>Users</strong>: DBA (access, monitoring, resources), designers (structure, constraints), end users (queries, reports, updates).</li>
<li><strong>DDL vs DML</strong>: DDL changes the schema (CREATE, ALTER, DROP, TRUNCATE); DML reads or changes content (SELECT, INSERT, UPDATE, DELETE), through query answering and transaction processing.</li>
</ol>
<h3>✅ Self-check before the quiz</h3>
<ol>
<li>Name the three parts of a data model.</li>
<li>Which component writes the log that makes committed data survive a crash?</li>
<li>Is <code>TRUNCATE TABLE</code> DDL or DML in SQL Server?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) structure, operations, constraints. (2) logging and recovery (driven by the transaction manager). (3) DDL.</p>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 1</h2>
<ol>
<li><strong>Dữ liệu và thông tin</strong>: dữ liệu là sự kiện thô; thông tin là dữ liệu đã xử lý, giúp ra quyết định. Câu truy vấn SQL chính là bước xử lý.</li>
<li><strong>CSDL / DBMS / hệ CSDL</strong>: dữ liệu / phần mềm (SQL Server) / cả hai cộng lại. SQL Server là DBMS, không phải CSDL.</li>
<li><strong>Năm nhiệm vụ của DBMS</strong>: tạo CSDL và lược đồ, truy vấn, lưu dữ liệu rất lớn, bền vững, kiểm soát truy cập đồng thời. DBMS đời đầu dựa trên tệp làm kém các việc này.</li>
<li><strong>Lịch sử</strong>: tệp → phân cấp (cây, IMS) → mạng (đồ thị, CODASYL) → quan hệ (Codd 1970, System R, Ingres, SQL 1974, Oracle 1979) → đối tượng / quan hệ – đối tượng → NoSQL / NewSQL.</li>
<li><strong>Tích hợp thông tin</strong>: kho dữ liệu (chép định kỳ, phân tích nhanh) so với bộ trung gian (dịch truy vấn, luôn mới).</li>
<li><strong>Bên trong DBMS</strong>: bộ biên dịch truy vấn → kế hoạch thực thi → bộ máy thực thi → quản lý chỉ mục/tệp/bản ghi → quản lý bộ đệm → quản lý lưu trữ; bộ quản lý giao dịch cùng ghi nhật ký/phục hồi và điều khiển đồng thời (bảng khoá); bộ biên dịch DDL cho thay đổi lược đồ.</li>
<li><strong>Người dùng</strong>: DBA (quyền truy cập, giám sát, tài nguyên), người thiết kế (cấu trúc, ràng buộc), người dùng cuối (truy vấn, báo cáo, cập nhật).</li>
<li><strong>DDL và DML</strong>: DDL đổi lược đồ (CREATE, ALTER, DROP, TRUNCATE); DML đọc hoặc đổi nội dung (SELECT, INSERT, UPDATE, DELETE), qua hai phân hệ trả lời truy vấn và xử lý giao dịch.</li>
</ol>
<h3>✅ Tự kiểm tra trước khi làm quiz</h3>
<ol>
<li>Nêu ba phần của một mô hình dữ liệu.</li>
<li>Thành phần nào ghi nhật ký giúp dữ liệu đã commit sống sót sau sự cố?</li>
<li><code>TRUNCATE TABLE</code> là DDL hay DML trên SQL Server?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) cấu trúc, thao tác, ràng buộc. (2) ghi nhật ký và phục hồi (logging and recovery, do bộ quản lý giao dịch điều khiển). (3) DDL.</p>`),
  ].join('\n'),
};

/* ───────── Quiz (dbi202-quiz-ch1) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'Which statement about Microsoft SQL Server is correct?|||Phát biểu nào về Microsoft SQL Server là đúng?',
      options: ['It is a database: the data of the company|||Nó là một cơ sở dữ liệu: dữ liệu của công ty', 'It is a DBMS: the software that creates and maintains databases|||Nó là một DBMS: phần mềm tạo và duy trì các CSDL', 'It is a data model, like the relational model|||Nó là một mô hình dữ liệu, giống mô hình quan hệ', 'It is a query language, like SQL|||Nó là một ngôn ngữ truy vấn, giống SQL'],
      correctIndex: 1,
      points: 1,
      explanation: 'SQL Server is a database management system: the software package that facilitates the creation and maintenance of databases (slide 5). The database is the data it manages, and SQL Server plus that data forms a database system. Option A is the everyday phrase "SQL Server database" taken literally — the classic trap.|||SQL Server là một hệ quản trị CSDL (DBMS): gói phần mềm giúp tạo và duy trì các CSDL (slide 5). CSDL là dữ liệu mà nó quản lý, còn SQL Server cộng với dữ liệu đó mới là một hệ CSDL. Phương án A là cách nói đời thường "database SQL Server" bị hiểu theo nghĩa đen — cái bẫy kinh điển.' },
    { id: 'q2',
      question: 'Which of the following is NOT one of the five things a DBMS is expected to do (slide 6)?|||Việc nào sau đây KHÔNG thuộc năm việc một DBMS được mong đợi làm (slide 6)?',
      options: ['Enable durability, so committed data survives failures|||Bảo đảm tính bền vững, để dữ liệu đã commit còn sau sự cố', 'Control access to the data from many users at once|||Kiểm soát nhiều người truy cập dữ liệu cùng lúc', 'Support the storage of very large amounts of data|||Hỗ trợ lưu trữ lượng dữ liệu rất lớn', 'Automatically design and normalize the tables for the users|||Tự động thiết kế và chuẩn hoá các bảng cho người dùng'],
      correctIndex: 3,
      points: 1,
      explanation: 'The five duties are: create databases and specify schemas, query the data, store very large amounts of data, enable durability, control concurrent access. Designing and normalizing the schema is the job of the database designer (slide 17), not of the DBMS. Option B sounds technical but is duty (5).|||Năm nhiệm vụ là: tạo CSDL và khai báo lược đồ, truy vấn dữ liệu, lưu lượng dữ liệu rất lớn, bảo đảm bền vững, kiểm soát truy cập đồng thời. Thiết kế và chuẩn hoá lược đồ là việc của người thiết kế CSDL (slide 17), không phải của DBMS. Phương án B nghe kỹ thuật nhưng chính là nhiệm vụ (5).' },
    { id: 'q3',
      question: 'In the hierarchical example of slide 7, course C2 and instructor I2 are stored twice (under S1 and under S2). Why?|||Trong ví dụ mô hình phân cấp ở slide 7, môn C2 và giảng viên I2 bị lưu hai lần (dưới S1 và dưới S2). Vì sao?',
      options: ['In a tree every record has exactly one parent, so data shared by two parents must be copied|||Trong cây mỗi bản ghi có đúng một cha, nên dữ liệu dùng chung bởi hai cha phải bị chép ra', 'The network model forbids a record from having children|||Mô hình mạng cấm một bản ghi có con', 'The relational model requires every value to appear twice for safety|||Mô hình quan hệ đòi mỗi giá trị xuất hiện hai lần cho an toàn', 'IMS stores every record twice as a backup copy|||IMS lưu mỗi bản ghi hai lần làm bản sao lưu'],
      correctIndex: 0,
      points: 1,
      explanation: 'The hierarchical model is tree-based: a child has only one parent. C2 is taken by two students, so it must appear under each of them, which wastes space and risks inconsistent updates. The network model (graph-based) was invented precisely to allow several parents, so option B inverts it.|||Mô hình phân cấp dựa trên cây: một con chỉ có một cha. C2 được hai sinh viên học, nên nó phải xuất hiện dưới mỗi người, vừa tốn chỗ vừa dễ cập nhật lệch nhau. Mô hình mạng (dựa trên đồ thị) ra đời chính là để cho phép nhiều cha, nên phương án B nói ngược.' },
    { id: 'q4',
      question: 'Starting from BOOK with the rows (Intro to DB Systems, 1986), (London Fields, 1989), (The history man, 1977), the code runs. What does the last SELECT return?|||Bắt đầu từ bảng BOOK có các dòng (Intro to DB Systems, 1986), (London Fields, 1989), (The history man, 1977), đoạn code chạy. Câu SELECT cuối trả về gì?',
      code: `INSERT INTO BOOK VALUES ('Fund. of DB Systems', 'Elmasri', 'Addison-Wesley', '1989');
DELETE FROM BOOK WHERE Title = 'London Fields';
UPDATE BOOK SET Year = '1989' WHERE Title = 'The history man';
SELECT COUNT(*) FROM BOOK WHERE Year = '1989';`,
      codeLang: 'sql',
      options: ['1|||1', '3|||3', '2|||2', '0|||0'],
      correctIndex: 2,
      points: 1,
      explanation: "After the INSERT, Fund. of DB Systems (1989) exists; the DELETE removes London Fields (1989); the UPDATE sets The history man to 1989. Two books now have Year = '1989'. Answer A forgets that the UPDATE also changes which rows match; B forgets that London Fields was deleted.|||Sau INSERT có thêm Fund. of DB Systems (1989); DELETE xoá London Fields (1989); UPDATE đổi The history man thành 1989. Giờ có hai cuốn có Year = '1989'. Đáp án A quên rằng UPDATE cũng làm đổi các dòng thoả điều kiện; B quên rằng London Fields đã bị xoá." },
    { id: 'q5',
      question: 'Which DBMS component parses and optimizes a query and produces a query plan?|||Thành phần nào của DBMS phân tích, tối ưu một truy vấn và tạo ra kế hoạch thực thi?',
      options: ['The buffer manager|||Bộ quản lý bộ đệm (buffer manager)', 'The query compiler|||Bộ biên dịch truy vấn (query compiler)', 'The storage manager|||Bộ quản lý lưu trữ (storage manager)', 'The DDL compiler|||Bộ biên dịch DDL (DDL compiler)'],
      correctIndex: 1,
      points: 1,
      explanation: 'Slide 20: the query is parsed and optimized by the query compiler, whose result is the query plan; the plan is then executed by the execution engine. The DDL compiler handles schema-changing commands from the DBA, not queries — the tempting wrong answer because both are "compilers".|||Slide 20: truy vấn được bộ biên dịch truy vấn phân tích và tối ưu, kết quả là kế hoạch thực thi; kế hoạch đó được bộ máy thực thi chạy. Bộ biên dịch DDL xử lý lệnh đổi lược đồ của DBA, không xử lý truy vấn — đáp án sai hấp dẫn vì cả hai đều là "bộ biên dịch".' },
    { id: 'q6',
      question: 'A company copies data from the databases of all its divisions into one central database every night, translating it along the way, to run reports. This approach is called|||Một công ty mỗi đêm chép dữ liệu từ CSDL của mọi bộ phận về một CSDL trung tâm, chuyển đổi trên đường đi, để chạy báo cáo. Cách làm này gọi là',
      options: ['a data warehouse|||kho dữ liệu (data warehouse)', 'a mediator (middleware)|||bộ trung gian (mediator / middleware)', 'a network data model|||mô hình dữ liệu mạng', 'a distributed transaction|||giao dịch phân tán'],
      correctIndex: 0,
      points: 1,
      explanation: 'Slide 14: a data warehouse is a central database into which information from many databases is copied periodically with the appropriate translation. A mediator does the opposite — it copies nothing and translates each query to the original databases, so its data is always current.|||Slide 14: kho dữ liệu là một CSDL trung tâm, định kỳ được chép thông tin từ nhiều CSDL về kèm phép chuyển đổi phù hợp. Bộ trung gian làm ngược lại — không chép gì, mà dịch từng câu truy vấn tới các CSDL gốc, nên dữ liệu luôn là hiện tại.' },
    { id: 'q7',
      question: 'Which group contains only DDL statements?|||Nhóm nào chỉ gồm các câu lệnh DDL?',
      options: ['SELECT, INSERT, UPDATE|||SELECT, INSERT, UPDATE', 'CREATE TABLE, INSERT, DROP TABLE|||CREATE TABLE, INSERT, DROP TABLE', 'DELETE, UPDATE, ALTER TABLE|||DELETE, UPDATE, ALTER TABLE', 'CREATE TABLE, ALTER TABLE, DROP TABLE|||CREATE TABLE, ALTER TABLE, DROP TABLE'],
      correctIndex: 3,
      points: 1,
      explanation: 'DDL commands alter the schema: CREATE, ALTER, DROP (slide 18). INSERT, UPDATE, DELETE and SELECT are DML — they change or read the content, not the structure. Options B and C each hide one DML statement among DDL ones.|||Lệnh DDL sửa lược đồ: CREATE, ALTER, DROP (slide 18). INSERT, UPDATE, DELETE và SELECT là DML — chúng đổi hoặc đọc nội dung, không đổi cấu trúc. Phương án B và C mỗi cái giấu một lệnh DML giữa các lệnh DDL.' },
    { id: 'q8',
      question: 'Account A01 has 500000 and A02 has 100000. After the code runs, what is the balance of A01?|||Tài khoản A01 có 500000 và A02 có 100000. Sau khi đoạn code chạy, số dư của A01 là bao nhiêu?',
      code: `BEGIN TRANSACTION;
  UPDATE Account SET balance = balance - 200000 WHERE accID = 'A01';
  UPDATE Account SET balance = balance + 200000 WHERE accID = 'A02';
ROLLBACK;
SELECT balance FROM Account WHERE accID = 'A01';`,
      codeLang: 'sql',
      options: ['300000|||300000', '700000|||700000', '500000|||500000', '0 — the transaction failed|||0 — giao dịch đã thất bại'],
      correctIndex: 2,
      points: 1,
      explanation: 'Both UPDATEs are inside a transaction that ends with ROLLBACK, so the DBMS undoes them: A01 is back to 500000. 300000 is the value seen inside the transaction, before the rollback — the tempting answer if you stop reading at the second UPDATE.|||Cả hai UPDATE nằm trong một giao dịch kết thúc bằng ROLLBACK, nên DBMS hoàn tác chúng: A01 trở về 500000. 300000 là giá trị nhìn thấy bên trong giao dịch, trước khi hoàn tác — đáp án dễ chọn nếu đọc tới UPDATE thứ hai là dừng.' },
    { id: 'q9',
      question: 'According to the textbook, a data model is made of which three parts?|||Theo giáo trình, một mô hình dữ liệu gồm ba phần nào?',
      options: ['Tables, rows and columns|||Bảng, dòng và cột', 'Structure of the data, operations on the data, constraints on the data|||Cấu trúc dữ liệu, thao tác trên dữ liệu, ràng buộc trên dữ liệu', 'External level, conceptual level, internal level|||Mức ngoài, mức khái niệm, mức trong', 'DDL, DML and transactions|||DDL, DML và giao dịch'],
      correctIndex: 1,
      points: 1,
      explanation: 'Ullman §2.1.1: a data model is a notation for describing data, consisting of the structure of the data, the operations on the data (queries and modifications) and the constraints on the data. Option C is the three-level architecture — also a "three" list from this course, which is why it is tempting; option A only describes the structure of the relational model.|||Ullman §2.1.1: mô hình dữ liệu là một cách ký hiệu mô tả dữ liệu, gồm cấu trúc dữ liệu, thao tác trên dữ liệu (truy vấn và sửa đổi) và ràng buộc trên dữ liệu. Phương án C là kiến trúc ba mức — cũng là một danh sách "ba" trong môn, nên dễ nhầm; phương án A chỉ mô tả phần cấu trúc của mô hình quan hệ.' },
    { id: 'q10',
      question: 'Who authorizes access to the database, monitors its use and acquires software and hardware resources?|||Ai cấp quyền truy cập CSDL, giám sát việc sử dụng và mua sắm tài nguyên phần mềm, phần cứng?',
      options: ['The database administrator (DBA)|||Người quản trị CSDL (DBA)', 'The database designer|||Người thiết kế CSDL', 'The end user|||Người dùng cuối', 'The query compiler|||Bộ biên dịch truy vấn'],
      correctIndex: 0,
      points: 1,
      explanation: 'Slide 17 lists exactly these tasks for database administrators. Designers define content, structure and constraints; end users query and update data. The query compiler is a software component, not a user.|||Slide 17 liệt kê đúng các việc này cho người quản trị CSDL. Người thiết kế định nghĩa nội dung, cấu trúc và ràng buộc; người dùng cuối truy vấn và cập nhật dữ liệu. Bộ biên dịch truy vấn là một thành phần phần mềm, không phải người dùng.' },
  ],
};

const QUIZ_LESSON = {
  title: 'Quiz — Chapter 1 · Databases & DBMS|||Quiz — Chương 1 · CSDL & DBMS',
  slug: 'dbi202-quiz-ch1',
  type: 'QUIZ',
  description: '10 câu về Chương 1 (slide Chapter 1 của trường): CSDL – DBMS – hệ CSDL, 5 nhiệm vụ của DBMS, mô hình phân cấp/mạng, kho dữ liệu và mediator, thành phần của DBMS, DDL/DML, giao dịch và ROLLBACK, mô hình dữ liệu, vai trò DBA — 2 câu đọc kết quả SQL được chạy thật để xác nhận đáp án; mỗi câu có giải thích.',
  quiz: QUIZ,
};

export default {
  slides: [L_dbi2_1],
  practice: L_on_ch1,
  quiz: QUIZ,
  quizDescription: '10 câu về Chương 1 (slide Chapter 1 của trường): CSDL – DBMS – hệ CSDL, 5 nhiệm vụ của DBMS, mô hình phân cấp/mạng, kho dữ liệu và mediator, thành phần của DBMS, DDL/DML, giao dịch và ROLLBACK, mô hình dữ liệu, vai trò DBA — 2 câu đọc kết quả SQL được chạy thật để xác nhận đáp án; mỗi câu có giải thích.',
  quizLesson: QUIZ_LESSON,
};
