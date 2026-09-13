/**
 * IDB201 — Introduction to Databases (Nhập môn Cơ sở dữ liệu). Ngành Khoa học
 * Máy tính FPTU, Kỳ 3. Khung 8 chương bám giáo trình chuẩn quốc tế: Elmasri &
 * Navathe "Fundamentals of Database Systems" và Silberschatz "Database System
 * Concepts", tài liệu chính thức PostgreSQL/MySQL, W3Schools SQL. Song ngữ
 * EN+VI + ví dụ + khối pre-code (SQL/ERD text) + quiz mỗi chương.
 * Giữ NGUYÊN slug/semester(KY3)/courseCode/thumb(v3).
 * ⚠️ KHÔNG backtick lồng, KHÔNG ${ } trong chuỗi HTML; "&" trong text HTML là &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

/* ─────────────────────────  Tài liệu tham khảo  ───────────────────────── */
const taiLieu = doc('idb201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn Elmasri & Navathe + Silberschatz, tài liệu chính thức PostgreSQL/MySQL/W3Schools, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">IDB201 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning databases from the ground up — the relational model, ER design, SQL, normalization and transactions. The official slides &amp; syllabus live on <strong>FLM</strong>; below are the standard textbooks and free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official IDB201 syllabus and lecture slides.</p>
<h3>📗 Textbooks</h3>
<ul>
<li><strong>Main —</strong> <a href="https://www.pearson.com/en-us/subject-catalog/p/fundamentals-of-database-systems/P200000003546" target="_blank" rel="noopener"><em>Fundamentals of Database Systems</em>, 7th ed.</a> — Elmasri &amp; Navathe (ER modeling, relational model, algebra, SQL, normalization).</li>
<li><a href="https://www.db-book.com/" target="_blank" rel="noopener"><em>Database System Concepts</em>, 7th ed.</a> — Silberschatz, Korth &amp; Sudarshan (free slides &amp; sample data on the site).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.postgresql.org/docs/current/tutorial.html" target="_blank" rel="noopener">PostgreSQL Tutorial &amp; Documentation</a> — a complete, standards-close SQL reference.</li>
<li><a href="https://dev.mysql.com/doc/" target="_blank" rel="noopener">MySQL Reference Manual</a> — the other engine you will meet in practice.</li>
<li><a href="https://www.w3schools.com/sql/" target="_blank" rel="noopener">W3Schools SQL Tutorial</a> — quick, runnable SQL examples.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/watch?v=HXV3zeQKqGY" target="_blank" rel="noopener">freeCodeCamp — SQL &amp; Databases full course</a> — from zero to joins and design.</li>
<li><a href="https://www.youtube.com/@DatabaseStar" target="_blank" rel="noopener">Database Star</a> — SQL, normalization and modeling explained.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://sqliteonline.com/" target="_blank" rel="noopener">SQLite Online</a> — run SQL in the browser, no install.</li>
<li><a href="https://www.pgadmin.org/" target="_blank" rel="noopener">pgAdmin</a> — the standard PostgreSQL client.</li>
<li><a href="https://dbdiagram.io/" target="_blank" rel="noopener">dbdiagram.io</a> — draw ER diagrams from text.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what a DBMS is, the 3-level architecture, ER modeling and the relational model (keys, constraints).</li>
<li><strong>Query</strong> — relational algebra then SQL: SELECT/WHERE/JOIN/GROUP BY, subqueries and views.</li>
<li><strong>Design</strong> — normalize schemas to 3NF/BCNF to remove redundancy and anomalies.</li>
<li><strong>Job-ready</strong> — indexes for speed, transactions (ACID) for correctness, and backup for safety.</li>
</ol></div>`,
    `<span class="eyebrow">IDB201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Một chỗ để học cơ sở dữ liệu từ gốc — mô hình quan hệ, thiết kế ER, SQL, chuẩn hoá và giao dịch. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là sách chuẩn và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của IDB201.</p>
<h3>📗 Sách chuẩn</h3>
<ul>
<li><strong>Chính —</strong> <a href="https://www.pearson.com/en-us/subject-catalog/p/fundamentals-of-database-systems/P200000003546" target="_blank" rel="noopener"><em>Fundamentals of Database Systems</em>, 7th ed.</a> — Elmasri &amp; Navathe (mô hình ER, mô hình quan hệ, đại số, SQL, chuẩn hoá).</li>
<li><a href="https://www.db-book.com/" target="_blank" rel="noopener"><em>Database System Concepts</em>, 7th ed.</a> — Silberschatz, Korth &amp; Sudarshan (có slide &amp; dữ liệu mẫu miễn phí).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.postgresql.org/docs/current/tutorial.html" target="_blank" rel="noopener">PostgreSQL Tutorial &amp; Documentation</a> — tài liệu SQL đầy đủ, bám chuẩn.</li>
<li><a href="https://dev.mysql.com/doc/" target="_blank" rel="noopener">MySQL Reference Manual</a> — engine còn lại bạn sẽ gặp khi đi làm.</li>
<li><a href="https://www.w3schools.com/sql/" target="_blank" rel="noopener">W3Schools SQL Tutorial</a> — ví dụ SQL ngắn, chạy được ngay.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/watch?v=HXV3zeQKqGY" target="_blank" rel="noopener">freeCodeCamp — SQL &amp; Databases full course</a> — từ số 0 tới join và thiết kế.</li>
<li><a href="https://www.youtube.com/@DatabaseStar" target="_blank" rel="noopener">Database Star</a> — SQL, chuẩn hoá và mô hình hoá.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://sqliteonline.com/" target="_blank" rel="noopener">SQLite Online</a> — chạy SQL trên trình duyệt, không cài đặt.</li>
<li><a href="https://www.pgadmin.org/" target="_blank" rel="noopener">pgAdmin</a> — client PostgreSQL chuẩn.</li>
<li><a href="https://dbdiagram.io/" target="_blank" rel="noopener">dbdiagram.io</a> — vẽ sơ đồ ER từ văn bản.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — DBMS là gì, kiến trúc ba lớp, mô hình ER và mô hình quan hệ (khoá, ràng buộc).</li>
<li><strong>Truy vấn</strong> — đại số quan hệ rồi tới SQL: SELECT/WHERE/JOIN/GROUP BY, truy vấn con và view.</li>
<li><strong>Thiết kế</strong> — chuẩn hoá lược đồ tới 3NF/BCNF để khử dư thừa và bất thường.</li>
<li><strong>Sẵn sàng đi làm</strong> — index cho tốc độ, giao dịch (ACID) cho đúng đắn, và backup cho an toàn.</li>
</ol></div>`,
  ]]);

/* ─────────────────────────  Giới thiệu môn  ───────────────────────── */
const intro = doc('idb201-0-1-overview', 'Course overview: Introduction to Databases|||Tổng quan: Nhập môn Cơ sở dữ liệu',
  'CSDL & DBMS làm gì; vì sao thay hệ tệp; lộ trình: mô hình ER → mô hình quan hệ → đại số quan hệ → SQL cơ bản/nâng cao → chuẩn hoá → giao dịch (ACID).',
  [[
    `<span class="eyebrow">IDB201 · Lesson 0.1 · Overview</span>
<h2>Introduction to Databases</h2>
<p class="lead">This course teaches you <strong>how data is stored, structured and queried</strong> — the foundation behind every web app, mobile app and business system. You will design databases with <strong>ER diagrams</strong>, turn them into <strong>relational tables</strong>, query them with <strong>SQL</strong>, and keep them correct with <strong>normalization</strong> and <strong>transactions</strong>.</p>
<h3>Why databases?</h3>
<p>A <strong>database</strong> is an organized collection of related data; a <strong>DBMS</strong> (Database Management System) is the software that stores, secures and queries it. Compared to plain files, a DBMS gives you <strong>querying, integrity, concurrency, security and recovery</strong> for free.</p>
<h3>Roadmap</h3>
<p>Overview &amp; DBMS → ER modeling → relational model (keys &amp; constraints) → relational algebra → SQL (basic then advanced) → normalization (1NF-BCNF) → transactions &amp; integrity (ACID). Bilingual, with worked examples, SQL code and a quiz per chapter.</p>`,
    `<span class="eyebrow">IDB201 · Bài 0.1 · Tổng quan</span>
<h2>Nhập môn Cơ sở dữ liệu</h2>
<p class="lead">Môn này dạy bạn <strong>dữ liệu được lưu, cấu trúc và truy vấn thế nào</strong> — nền của mọi ứng dụng web, mobile và hệ thống nghiệp vụ. Bạn sẽ thiết kế CSDL bằng <strong>sơ đồ ER</strong>, chuyển thành <strong>bảng quan hệ</strong>, truy vấn bằng <strong>SQL</strong>, và giữ đúng đắn bằng <strong>chuẩn hoá</strong> và <strong>giao dịch</strong>.</p>
<h3>Vì sao cần CSDL?</h3>
<p>Một <strong>cơ sở dữ liệu</strong> là tập dữ liệu liên quan được tổ chức có hệ thống; <strong>DBMS</strong> (Hệ quản trị CSDL) là phần mềm lưu trữ, bảo mật và truy vấn nó. So với tệp thường, DBMS cho sẵn <strong>truy vấn, toàn vẹn, tương tranh, bảo mật và phục hồi</strong>.</p>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; DBMS → mô hình ER → mô hình quan hệ (khoá &amp; ràng buộc) → đại số quan hệ → SQL (cơ bản rồi nâng cao) → chuẩn hoá (1NF-BCNF) → giao dịch &amp; toàn vẹn (ACID). Song ngữ, có ví dụ, mã SQL và quiz mỗi chương.</p>`,
  ]]);

/* ─────────────────────────  Chương 1  ───────────────────────── */
const c1 = doc('idb201-1-1-dbms-overview', '1.1 — Database systems & DBMS|||1.1 — Hệ CSDL & DBMS',
  'Dữ liệu/CSDL/DBMS; vì sao dùng DBMS thay hệ tệp; kiến trúc ba lớp ANSI/SPARC (ngoài/quan niệm/trong) & độc lập dữ liệu; các mô hình dữ liệu.',
  [[
    `<span class="eyebrow">IDB201 · Chapter 1 · Lesson 1.1</span>
<h2>Database systems &amp; DBMS</h2>
<h3>Data, database, DBMS</h3>
<ul>
<li><strong>Data</strong> — raw facts (a name, a price). <strong>Information</strong> is data given meaning.</li>
<li><strong>Database</strong> — an organized, related collection of data.</li>
<li><strong>DBMS</strong> — software that defines, stores, queries and controls the database (PostgreSQL, MySQL, Oracle, SQL Server).</li>
</ul>
<h3>Why a DBMS beats plain files</h3>
<p>File-based systems suffer from <strong>redundancy, inconsistency</strong> and no easy querying. A DBMS adds <strong>declarative queries, data integrity, concurrent access, security and backup/recovery</strong>, and separates programs from the physical storage.</p>
<h3>The three-level (ANSI/SPARC) architecture</h3>
<pre><code>External level   -> user views (what each user sees)
Conceptual level -> the whole logical schema (tables, relationships)
Internal level   -> physical storage (files, indexes on disk)
</code></pre>
<p>This split gives <strong>data independence</strong>: change storage (add an index) without touching programs (physical independence), or change the logical schema without breaking existing views (logical independence).</p>
<h3>Data models</h3>
<p>A <strong>data model</strong> describes how data is structured: <em>hierarchical</em> and <em>network</em> (old), the <strong>relational</strong> model (tables — the focus of this course), plus object-oriented and NoSQL models.</p>
<div class="callout"><span class="badge">Key idea</span> The DBMS lets you say <em>what</em> data you want, not <em>how</em> to fetch it — that is the power of a declarative system.</div>`,
    `<span class="eyebrow">IDB201 · Chương 1 · Bài 1.1</span>
<h2>Hệ CSDL &amp; DBMS</h2>
<h3>Dữ liệu, CSDL, DBMS</h3>
<ul>
<li><strong>Dữ liệu</strong> — sự kiện thô (một cái tên, một mức giá). <strong>Thông tin</strong> là dữ liệu đã có ý nghĩa.</li>
<li><strong>Cơ sở dữ liệu</strong> — tập dữ liệu liên quan, được tổ chức.</li>
<li><strong>DBMS</strong> — phần mềm định nghĩa, lưu, truy vấn và kiểm soát CSDL (PostgreSQL, MySQL, Oracle, SQL Server).</li>
</ul>
<h3>Vì sao DBMS hơn hệ tệp</h3>
<p>Hệ dựa trên tệp bị <strong>dư thừa, thiếu nhất quán</strong> và khó truy vấn. DBMS bổ sung <strong>truy vấn khai báo, toàn vẹn dữ liệu, truy cập tương tranh, bảo mật và sao lưu/phục hồi</strong>, và tách chương trình khỏi lưu trữ vật lý.</p>
<h3>Kiến trúc ba lớp (ANSI/SPARC)</h3>
<pre><code>Lớp ngoài (external)    -> khung nhìn người dùng (mỗi người thấy gì)
Lớp quan niệm (concept) -> toàn bộ lược đồ logic (bảng, quan hệ)
Lớp trong (internal)    -> lưu trữ vật lý (tệp, chỉ mục trên đĩa)
</code></pre>
<p>Cách chia này cho <strong>độc lập dữ liệu</strong>: đổi lưu trữ (thêm index) mà không đụng chương trình (độc lập vật lý), hoặc đổi lược đồ logic mà không hỏng khung nhìn cũ (độc lập logic).</p>
<h3>Các mô hình dữ liệu</h3>
<p>Một <strong>mô hình dữ liệu</strong> mô tả cách cấu trúc dữ liệu: <em>phân cấp</em> và <em>mạng</em> (cũ), mô hình <strong>quan hệ</strong> (bảng — trọng tâm môn này), cùng mô hình hướng đối tượng và NoSQL.</p>
<div class="callout"><span class="badge">Ý chính</span> DBMS cho phép bạn nói <em>cần dữ liệu gì</em>, không phải <em>lấy thế nào</em> — đó là sức mạnh của hệ khai báo.</div>`,
  ]]);
const c1q = quiz('idb201-quiz-1', 'Quiz 1 — DBMS & architecture|||Quiz 1 — DBMS & kiến trúc', [
  { id: 'q1', question: 'DBMS là gì?', options: ['Một ngôn ngữ lập trình', 'Phần mềm quản trị cơ sở dữ liệu', 'Một loại đĩa cứng', 'Một mạng máy tính'], correctIndex: 1, explanation: 'DBMS là phần mềm định nghĩa, lưu, truy vấn và kiểm soát CSDL.' },
  { id: 'q2', question: 'Kiến trúc ba lớp ANSI/SPARC gồm các lớp nào?', options: ['Nhanh/chậm/vừa', 'Ngoài/quan niệm/trong', 'Cao/trung/thấp', 'Đọc/ghi/xoá'], correctIndex: 1, explanation: 'Ba lớp: external (ngoài), conceptual (quan niệm), internal (trong).' },
  { id: 'q3', question: 'Ưu điểm KHÔNG phải của DBMS so với hệ tệp là?', options: ['Giảm dư thừa dữ liệu', 'Truy vấn khai báo', 'Chạy nhanh hơn mọi phép tính CPU', 'Kiểm soát tương tranh'], correctIndex: 2, explanation: 'DBMS lo dữ liệu, không làm CPU tính toán nhanh hơn.' },
]);

/* ─────────────────────────  Chương 2  ───────────────────────── */
const c2 = doc('idb201-2-1-er-model', '2.1 — Entity-Relationship model|||2.1 — Mô hình thực thể - liên kết',
  'Thực thể & tập thực thể, thuộc tính (đơn/phức/đa trị/dẫn xuất), khoá; liên kết & lực lượng (1:1, 1:N, M:N); vẽ sơ đồ ERD.',
  [[
    `<span class="eyebrow">IDB201 · Chapter 2 · Lesson 2.1</span>
<h2>The Entity-Relationship (ER) model</h2>
<p>The <strong>ER model</strong> is a high-level design tool: you sketch the real world as <strong>entities</strong>, their <strong>attributes</strong>, and the <strong>relationships</strong> between them, before writing any table.</p>
<h3>Building blocks</h3>
<ul>
<li><strong>Entity</strong> — a real-world object (a Student, a Course). An <strong>entity set</strong> is all entities of one type.</li>
<li><strong>Attribute</strong> — a property: simple or <em>composite</em> (Name = First + Last), single- or <em>multi-valued</em> (phones), and <em>derived</em> (Age from DateOfBirth).</li>
<li><strong>Key attribute</strong> — uniquely identifies an entity (StudentID).</li>
<li><strong>Relationship</strong> — an association, e.g. a Student <em>enrolls in</em> a Course.</li>
</ul>
<h3>Cardinality (mapping ratios)</h3>
<pre><code>1:1  one Department has one Manager
1:N  one Department has many Employees
M:N  many Students enroll in many Courses
</code></pre>
<h3>An ERD in text</h3>
<pre><code>[STUDENT] --(enrolls in)-- [COURSE]
 StudentID (key)    M:N     CourseID (key)
 Name                       Title
 DateOfBirth               Credits
</code></pre>
<div class="callout"><span class="badge">Design first</span> An M:N relationship usually carries its own data (a grade, an enrollment date) — a hint it will become its own table later.</div>`,
    `<span class="eyebrow">IDB201 · Chương 2 · Bài 2.1</span>
<h2>Mô hình thực thể - liên kết (ER)</h2>
<p><strong>Mô hình ER</strong> là công cụ thiết kế mức cao: bạn phác thế giới thực thành các <strong>thực thể</strong>, <strong>thuộc tính</strong> của chúng, và các <strong>liên kết</strong> giữa chúng, trước khi viết bất kỳ bảng nào.</p>
<h3>Các thành phần</h3>
<ul>
<li><strong>Thực thể</strong> — một đối tượng thực (Sinh viên, Môn học). <strong>Tập thực thể</strong> là tất cả thực thể cùng loại.</li>
<li><strong>Thuộc tính</strong> — một tính chất: đơn hoặc <em>phức hợp</em> (Tên = Họ + Tên), đơn trị hoặc <em>đa trị</em> (số điện thoại), và <em>dẫn xuất</em> (Tuổi từ Ngày sinh).</li>
<li><strong>Thuộc tính khoá</strong> — định danh duy nhất một thực thể (MãSV).</li>
<li><strong>Liên kết</strong> — một mối kết hợp, vd Sinh viên <em>đăng ký</em> Môn học.</li>
</ul>
<h3>Lực lượng (tỉ lệ ánh xạ)</h3>
<pre><code>1:1  một Phòng ban có một Trưởng phòng
1:N  một Phòng ban có nhiều Nhân viên
M:N  nhiều Sinh viên đăng ký nhiều Môn học
</code></pre>
<h3>Một ERD dạng văn bản</h3>
<pre><code>[SINHVIEN] --(đăng ký)-- [MONHOC]
 MaSV (khoá)      M:N      MaMon (khoá)
 HoTen                     TenMon
 NgaySinh                  SoTinChi
</code></pre>
<div class="callout"><span class="badge">Thiết kế trước</span> Liên kết M:N thường mang dữ liệu riêng (điểm, ngày đăng ký) — dấu hiệu nó sẽ thành một bảng riêng về sau.</div>`,
  ]]);
const c2q = quiz('idb201-quiz-2', 'Quiz 2 — ER model|||Quiz 2 — Mô hình ER', [
  { id: 'q1', question: 'Trong mô hình ER, "thực thể" (entity) là?', options: ['Một câu lệnh SQL', 'Một đối tượng thực trong thế giới', 'Một chỉ mục', 'Một giao dịch'], correctIndex: 1, explanation: 'Thực thể là một đối tượng thực (Sinh viên, Môn học...).' },
  { id: 'q2', question: 'Thuộc tính "Tuổi" tính từ "Ngày sinh" là loại thuộc tính gì?', options: ['Đa trị', 'Phức hợp', 'Dẫn xuất', 'Khoá'], correctIndex: 2, explanation: 'Thuộc tính dẫn xuất (derived) được tính từ thuộc tính khác.' },
  { id: 'q3', question: 'Nhiều Sinh viên đăng ký nhiều Môn học là liên kết loại?', options: ['1:1', '1:N', 'M:N', 'N:1'], correctIndex: 2, explanation: 'Đây là liên kết nhiều-nhiều (M:N).' },
]);

/* ─────────────────────────  Chương 3  ───────────────────────── */
const c3 = doc('idb201-3-1-relational-model', '3.1 — The relational model|||3.1 — Mô hình quan hệ',
  'Quan hệ (bảng), bộ, thuộc tính, miền; siêu khoá/khoá dự tuyển/khoá chính/khoá ngoại; ràng buộc toàn vẹn (thực thể, tham chiếu); chuyển ER → quan hệ.',
  [[
    `<span class="eyebrow">IDB201 · Chapter 3 · Lesson 3.1</span>
<h2>The relational model</h2>
<p>Codd's <strong>relational model</strong> stores everything as <strong>relations</strong> (tables). A <strong>tuple</strong> is a row, an <strong>attribute</strong> is a column, and a <strong>domain</strong> is the allowed set of values for a column.</p>
<h3>Keys</h3>
<ul>
<li><strong>Superkey</strong> — any set of attributes that is unique per row.</li>
<li><strong>Candidate key</strong> — a minimal superkey.</li>
<li><strong>Primary key (PK)</strong> — the chosen candidate key; never NULL.</li>
<li><strong>Foreign key (FK)</strong> — an attribute referencing the PK of another table.</li>
</ul>
<h3>Integrity constraints</h3>
<ul>
<li><strong>Entity integrity</strong> — the primary key cannot be NULL.</li>
<li><strong>Referential integrity</strong> — a foreign key must match an existing PK value (or be NULL).</li>
<li><strong>Domain constraint</strong> — a value must belong to the column domain (a type, a CHECK).</li>
</ul>
<h3>Mapping ER to relations</h3>
<pre><code>STUDENT(StudentID PK, Name, DateOfBirth)
COURSE(CourseID PK, Title, Credits)
-- an M:N relationship becomes its own table:
ENROLLMENT(StudentID FK, CourseID FK, Grade)
   PRIMARY KEY (StudentID, CourseID)
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Each entity set becomes a table; each M:N relationship becomes a join table whose PK is the pair of foreign keys.</div>`,
    `<span class="eyebrow">IDB201 · Chương 3 · Bài 3.1</span>
<h2>Mô hình quan hệ</h2>
<p><strong>Mô hình quan hệ</strong> của Codd lưu mọi thứ dưới dạng <strong>quan hệ</strong> (bảng). Một <strong>bộ</strong> (tuple) là một hàng, một <strong>thuộc tính</strong> là một cột, và <strong>miền</strong> (domain) là tập giá trị hợp lệ của cột.</p>
<h3>Các loại khoá</h3>
<ul>
<li><strong>Siêu khoá</strong> — tập thuộc tính bất kỳ mà duy nhất theo hàng.</li>
<li><strong>Khoá dự tuyển</strong> — siêu khoá tối thiểu.</li>
<li><strong>Khoá chính (PK)</strong> — khoá dự tuyển được chọn; không bao giờ NULL.</li>
<li><strong>Khoá ngoại (FK)</strong> — thuộc tính tham chiếu tới PK của bảng khác.</li>
</ul>
<h3>Ràng buộc toàn vẹn</h3>
<ul>
<li><strong>Toàn vẹn thực thể</strong> — khoá chính không được NULL.</li>
<li><strong>Toàn vẹn tham chiếu</strong> — khoá ngoại phải khớp một giá trị PK đang tồn tại (hoặc NULL).</li>
<li><strong>Ràng buộc miền</strong> — giá trị phải thuộc miền của cột (kiểu, CHECK).</li>
</ul>
<h3>Chuyển ER sang quan hệ</h3>
<pre><code>SINHVIEN(MaSV PK, HoTen, NgaySinh)
MONHOC(MaMon PK, TenMon, SoTinChi)
-- liên kết M:N thành một bảng riêng:
DANGKY(MaSV FK, MaMon FK, Diem)
   PRIMARY KEY (MaSV, MaMon)
</code></pre>
<div class="callout"><span class="badge">Quy tắc</span> Mỗi tập thực thể thành một bảng; mỗi liên kết M:N thành một bảng nối có PK là cặp khoá ngoại.</div>`,
  ]]);
const c3q = quiz('idb201-quiz-3', 'Quiz 3 — Relational model|||Quiz 3 — Mô hình quan hệ', [
  { id: 'q1', question: 'Trong mô hình quan hệ, một "bộ" (tuple) là?', options: ['Một cột', 'Một hàng của bảng', 'Một bảng', 'Một chỉ mục'], correctIndex: 1, explanation: 'Bộ (tuple) là một hàng; thuộc tính là một cột.' },
  { id: 'q2', question: 'Ràng buộc toàn vẹn thực thể nói rằng?', options: ['Khoá ngoại phải khớp PK', 'Khoá chính không được NULL', 'Mọi cột phải là số', 'Bảng phải có index'], correctIndex: 1, explanation: 'Toàn vẹn thực thể: khoá chính không được NULL.' },
  { id: 'q3', question: 'Khoá ngoại (FK) dùng để?', options: ['Tăng tốc truy vấn', 'Tham chiếu tới khoá chính của bảng khác', 'Sắp xếp dữ liệu', 'Mã hoá dữ liệu'], correctIndex: 1, explanation: 'FK tham chiếu PK của bảng khác, giữ toàn vẹn tham chiếu.' },
]);

/* ─────────────────────────  Chương 4  ───────────────────────── */
const c4 = doc('idb201-4-1-relational-algebra', '4.1 — Relational algebra|||4.1 — Đại số quan hệ',
  'Các phép cơ bản: chọn (σ), chiếu (π), hợp/giao/hiệu, tích Descartes; phép kết (join); ghép các phép thành biểu thức truy vấn.',
  [[
    `<span class="eyebrow">IDB201 · Chapter 4 · Lesson 4.1</span>
<h2>Relational algebra</h2>
<p><strong>Relational algebra</strong> is the theory behind SQL: a set of operators that take relations in and give a relation out, so they compose.</p>
<h3>Core operators</h3>
<ul>
<li><strong>Select (σ)</strong> — pick rows matching a condition. σ(age &gt; 18)(STUDENT).</li>
<li><strong>Project (π)</strong> — pick columns. π(Name, Age)(STUDENT).</li>
<li><strong>Union / Intersection / Difference</strong> — set operations on two union-compatible relations.</li>
<li><strong>Cartesian product (×)</strong> — every row of A paired with every row of B.</li>
<li><strong>Join (⋈)</strong> — a product filtered to matching rows (product + select on the join key).</li>
</ul>
<h3>Composing a query</h3>
<pre><code>-- names of students older than 18
π(Name)( σ(age &gt; 18)(STUDENT) )

-- students with their course titles
π(Name, Title)( STUDENT ⋈ ENROLLMENT ⋈ COURSE )
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Because each operator returns a relation, you can chain them — exactly what an SQL query does under the hood, and what the optimizer rewrites for speed.</div>`,
    `<span class="eyebrow">IDB201 · Chương 4 · Bài 4.1</span>
<h2>Đại số quan hệ</h2>
<p><strong>Đại số quan hệ</strong> là lý thuyết đằng sau SQL: một tập toán tử nhận quan hệ vào và trả quan hệ ra, nên chúng ghép được với nhau.</p>
<h3>Các phép cơ bản</h3>
<ul>
<li><strong>Chọn (σ)</strong> — lấy các hàng thoả điều kiện. σ(tuoi &gt; 18)(SINHVIEN).</li>
<li><strong>Chiếu (π)</strong> — lấy các cột. π(HoTen, Tuoi)(SINHVIEN).</li>
<li><strong>Hợp / Giao / Hiệu</strong> — phép tập hợp trên hai quan hệ khả hợp.</li>
<li><strong>Tích Descartes (×)</strong> — mỗi hàng của A ghép với mọi hàng của B.</li>
<li><strong>Kết (⋈)</strong> — tích đã lọc theo hàng khớp (tích + chọn theo khoá kết).</li>
</ul>
<h3>Ghép thành truy vấn</h3>
<pre><code>-- tên các sinh viên trên 18 tuổi
π(HoTen)( σ(tuoi &gt; 18)(SINHVIEN) )

-- sinh viên kèm tên môn học
π(HoTen, TenMon)( SINHVIEN ⋈ DANGKY ⋈ MONHOC )
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Vì mỗi phép trả về một quan hệ, bạn nối chuỗi được — đúng như một truy vấn SQL bên dưới, và là thứ trình tối ưu viết lại để chạy nhanh.</div>`,
  ]]);
const c4q = quiz('idb201-quiz-4', 'Quiz 4 — Relational algebra|||Quiz 4 — Đại số quan hệ', [
  { id: 'q1', question: 'Phép "chọn" (σ, select) trong đại số quan hệ lấy ra?', options: ['Các cột thoả điều kiện', 'Các hàng thoả điều kiện', 'Toàn bộ bảng', 'Chỉ khoá chính'], correctIndex: 1, explanation: 'Select (σ) lọc các HÀNG thoả điều kiện.' },
  { id: 'q2', question: 'Phép "chiếu" (π, project) lấy ra?', options: ['Các hàng thoả điều kiện', 'Các cột được chỉ định', 'Giao của hai bảng', 'Tích Descartes'], correctIndex: 1, explanation: 'Project (π) chọn các CỘT.' },
  { id: 'q3', question: 'Phép kết (join, ⋈) tương đương với?', options: ['Tích Descartes rồi chọn theo khoá kết', 'Hợp hai bảng', 'Xoá hàng trùng', 'Sắp xếp bảng'], correctIndex: 0, explanation: 'Join = tích Descartes + phép chọn trên khoá kết.' },
]);

/* ─────────────────────────  Chương 5  ───────────────────────── */
const c5 = doc('idb201-5-1-sql-basics', '5.1 — SQL basics (DDL & DML)|||5.1 — SQL cơ bản (DDL & DML)',
  'DDL (CREATE/ALTER/DROP), DML (INSERT/UPDATE/DELETE); truy vấn SELECT ... WHERE; JOIN nhiều bảng; GROUP BY & hàm tổng hợp; có khối pre-code SQL.',
  [[
    `<span class="eyebrow">IDB201 · Chapter 5 · Lesson 5.1</span>
<h2>SQL basics — DDL &amp; DML</h2>
<p><strong>SQL</strong> is the standard language of relational databases. <strong>DDL</strong> defines structure; <strong>DML</strong> manipulates data.</p>
<h3>DDL — define the schema</h3>
<pre><code>CREATE TABLE Student (
  StudentID  INT PRIMARY KEY,
  Name       VARCHAR(100) NOT NULL,
  Age        INT CHECK (Age &gt;= 0)
);
ALTER TABLE Student ADD Email VARCHAR(150);
DROP TABLE Student;
</code></pre>
<h3>DML — change the data</h3>
<pre><code>INSERT INTO Student (StudentID, Name, Age) VALUES (1, 'An', 20);
UPDATE Student SET Age = 21 WHERE StudentID = 1;
DELETE FROM Student WHERE StudentID = 1;
</code></pre>
<h3>SELECT, WHERE, JOIN, GROUP BY</h3>
<pre><code>-- filter + sort
SELECT Name, Age FROM Student WHERE Age &gt; 18 ORDER BY Age DESC;

-- join two tables
SELECT s.Name, c.Title
FROM Student s
JOIN Enrollment e ON s.StudentID = e.StudentID
JOIN Course c     ON e.CourseID  = c.CourseID;

-- aggregate per group
SELECT CourseID, COUNT(*) AS Students
FROM Enrollment
GROUP BY CourseID
HAVING COUNT(*) &gt; 30;
</code></pre>
<div class="callout"><span class="badge">Order of clauses</span> Write in the order FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY; use WHERE to filter rows and HAVING to filter groups.</div>`,
    `<span class="eyebrow">IDB201 · Chương 5 · Bài 5.1</span>
<h2>SQL cơ bản — DDL &amp; DML</h2>
<p><strong>SQL</strong> là ngôn ngữ chuẩn của CSDL quan hệ. <strong>DDL</strong> định nghĩa cấu trúc; <strong>DML</strong> thao tác dữ liệu.</p>
<h3>DDL — định nghĩa lược đồ</h3>
<pre><code>CREATE TABLE SinhVien (
  MaSV   INT PRIMARY KEY,
  HoTen  VARCHAR(100) NOT NULL,
  Tuoi   INT CHECK (Tuoi &gt;= 0)
);
ALTER TABLE SinhVien ADD Email VARCHAR(150);
DROP TABLE SinhVien;
</code></pre>
<h3>DML — thay đổi dữ liệu</h3>
<pre><code>INSERT INTO SinhVien (MaSV, HoTen, Tuoi) VALUES (1, 'An', 20);
UPDATE SinhVien SET Tuoi = 21 WHERE MaSV = 1;
DELETE FROM SinhVien WHERE MaSV = 1;
</code></pre>
<h3>SELECT, WHERE, JOIN, GROUP BY</h3>
<pre><code>-- lọc + sắp xếp
SELECT HoTen, Tuoi FROM SinhVien WHERE Tuoi &gt; 18 ORDER BY Tuoi DESC;

-- kết hai bảng
SELECT s.HoTen, m.TenMon
FROM SinhVien s
JOIN DangKy d ON s.MaSV  = d.MaSV
JOIN MonHoc m ON d.MaMon = m.MaMon;

-- tổng hợp theo nhóm
SELECT MaMon, COUNT(*) AS SoSV
FROM DangKy
GROUP BY MaMon
HAVING COUNT(*) &gt; 30;
</code></pre>
<div class="callout"><span class="badge">Thứ tự mệnh đề</span> Viết theo FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY; WHERE lọc hàng, HAVING lọc nhóm.</div>`,
  ]]);
const c5q = quiz('idb201-quiz-5', 'Quiz 5 — SQL basics|||Quiz 5 — SQL cơ bản', [
  { id: 'q1', question: 'Lệnh nào thuộc DDL (định nghĩa dữ liệu)?', options: ['SELECT', 'CREATE TABLE', 'INSERT', 'UPDATE'], correctIndex: 1, explanation: 'CREATE/ALTER/DROP là DDL; INSERT/UPDATE/DELETE/SELECT là DML/DQL.' },
  { id: 'q2', question: 'Mệnh đề nào lọc theo NHÓM sau khi GROUP BY?', options: ['WHERE', 'HAVING', 'ORDER BY', 'JOIN'], correctIndex: 1, explanation: 'WHERE lọc hàng, HAVING lọc nhóm sau khi tổng hợp.' },
  { id: 'q3', question: 'Để lấy dữ liệu từ hai bảng liên quan ta dùng?', options: ['JOIN', 'DROP', 'GROUP BY', 'CHECK'], correctIndex: 0, explanation: 'JOIN kết hai bảng theo điều kiện khớp khoá.' },
]);

/* ─────────────────────────  Chương 6  ───────────────────────── */
const c6 = doc('idb201-6-1-sql-advanced', '6.1 — Advanced SQL|||6.1 — SQL nâng cao',
  'Truy vấn con (subquery, IN/EXISTS), hàm tổng hợp (COUNT/SUM/AVG/MIN/MAX), view, index; khi nào nên đánh index; có khối pre-code SQL.',
  [[
    `<span class="eyebrow">IDB201 · Chapter 6 · Lesson 6.1</span>
<h2>Advanced SQL</h2>
<h3>Subqueries</h3>
<pre><code>-- students older than the average age
SELECT Name FROM Student
WHERE Age &gt; (SELECT AVG(Age) FROM Student);

-- students who enrolled in at least one course (EXISTS)
SELECT Name FROM Student s
WHERE EXISTS (SELECT 1 FROM Enrollment e WHERE e.StudentID = s.StudentID);
</code></pre>
<h3>Aggregate functions</h3>
<pre><code>SELECT COUNT(*) , AVG(Age), MIN(Age), MAX(Age), SUM(Age)
FROM Student;
</code></pre>
<h3>Views — a saved query</h3>
<pre><code>CREATE VIEW ActiveStudents AS
  SELECT StudentID, Name FROM Student WHERE Age &gt;= 18;
SELECT * FROM ActiveStudents;
</code></pre>
<h3>Indexes — speed for reads</h3>
<pre><code>CREATE INDEX idx_student_name ON Student(Name);
</code></pre>
<p>An <strong>index</strong> is a sorted lookup structure (often a B-tree) that makes searches and joins fast — at the cost of extra storage and slightly slower writes. Index columns you filter or join on, not every column.</p>
<div class="callout"><span class="badge">Trade-off</span> Views simplify complex queries and add a security layer; indexes speed reads but slow writes — measure before adding one everywhere.</div>`,
    `<span class="eyebrow">IDB201 · Chương 6 · Bài 6.1</span>
<h2>SQL nâng cao</h2>
<h3>Truy vấn con (subquery)</h3>
<pre><code>-- sinh viên lớn tuổi hơn tuổi trung bình
SELECT HoTen FROM SinhVien
WHERE Tuoi &gt; (SELECT AVG(Tuoi) FROM SinhVien);

-- sinh viên đã đăng ký ít nhất một môn (EXISTS)
SELECT HoTen FROM SinhVien s
WHERE EXISTS (SELECT 1 FROM DangKy d WHERE d.MaSV = s.MaSV);
</code></pre>
<h3>Hàm tổng hợp</h3>
<pre><code>SELECT COUNT(*) , AVG(Tuoi), MIN(Tuoi), MAX(Tuoi), SUM(Tuoi)
FROM SinhVien;
</code></pre>
<h3>View — truy vấn được lưu</h3>
<pre><code>CREATE VIEW SinhVienDuTuoi AS
  SELECT MaSV, HoTen FROM SinhVien WHERE Tuoi &gt;= 18;
SELECT * FROM SinhVienDuTuoi;
</code></pre>
<h3>Index — tăng tốc đọc</h3>
<pre><code>CREATE INDEX idx_sv_hoten ON SinhVien(HoTen);
</code></pre>
<p>Một <strong>index</strong> là cấu trúc tra cứu đã sắp xếp (thường là B-tree) giúp tìm kiếm và kết nhanh — đổi lại tốn thêm lưu trữ và ghi chậm hơn chút. Hãy đánh index cột bạn hay lọc hoặc kết, không phải mọi cột.</p>
<div class="callout"><span class="badge">Đánh đổi</span> View đơn giản hoá truy vấn phức tạp và thêm lớp bảo mật; index tăng tốc đọc nhưng làm chậm ghi — đo trước khi thêm ở khắp nơi.</div>`,
  ]]);
const c6q = quiz('idb201-quiz-6', 'Quiz 6 — Advanced SQL|||Quiz 6 — SQL nâng cao', [
  { id: 'q1', question: 'Hàm nào tính GIÁ TRỊ TRUNG BÌNH của một cột?', options: ['SUM()', 'COUNT()', 'AVG()', 'MAX()'], correctIndex: 2, explanation: 'AVG() trả về trung bình; SUM tổng, COUNT đếm.' },
  { id: 'q2', question: 'View trong SQL là?', options: ['Một bản sao vật lý của bảng', 'Một truy vấn được lưu như bảng ảo', 'Một chỉ mục', 'Một giao dịch'], correctIndex: 1, explanation: 'View là truy vấn được lưu, dùng như một bảng ảo.' },
  { id: 'q3', question: 'Index chủ yếu đánh đổi điều gì?', options: ['Đọc nhanh hơn nhưng ghi chậm hơn & tốn lưu trữ', 'Ghi nhanh hơn nhưng đọc chậm hơn', 'Xoá toàn bộ dữ liệu cũ', 'Không có đánh đổi nào'], correctIndex: 0, explanation: 'Index tăng tốc đọc/kết, đổi lại tốn lưu trữ và ghi chậm hơn.' },
]);

/* ─────────────────────────  Chương 7  ───────────────────────── */
const c7 = doc('idb201-7-1-normalization', '7.1 — Normalization|||7.1 — Chuẩn hoá',
  'Phụ thuộc hàm (functional dependency); các bất thường khi thêm/xoá/sửa; các dạng chuẩn 1NF, 2NF, 3NF, BCNF; khử dư thừa bằng phân rã.',
  [[
    `<span class="eyebrow">IDB201 · Chapter 7 · Lesson 7.1</span>
<h2>Normalization</h2>
<p><strong>Normalization</strong> restructures tables to remove redundancy and the <strong>update, insert and delete anomalies</strong> it causes.</p>
<h3>Functional dependency</h3>
<p>A <strong>functional dependency</strong> X → Y means X determines Y: given a StudentID you know exactly one Name. Normalization is driven by these dependencies.</p>
<h3>The normal forms</h3>
<ul>
<li><strong>1NF</strong> — every cell is atomic (no repeating groups or lists in a column).</li>
<li><strong>2NF</strong> — 1NF and no non-key attribute depends on only PART of a composite key.</li>
<li><strong>3NF</strong> — 2NF and no transitive dependency (a non-key attribute depending on another non-key attribute).</li>
<li><strong>BCNF</strong> — a stricter 3NF: for every dependency X → Y, X must be a superkey.</li>
</ul>
<h3>Decomposing to remove redundancy</h3>
<pre><code>-- Not normalized (redundant dept name on every row):
EMP(EmpID, Name, DeptID, DeptName)   -- DeptID -&gt; DeptName is transitive

-- 3NF: split the transitive dependency out
EMP(EmpID PK, Name, DeptID FK)
DEPT(DeptID PK, DeptName)
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Aim for 3NF in most designs: each non-key attribute depends on the key, the whole key, and nothing but the key.</div>`,
    `<span class="eyebrow">IDB201 · Chương 7 · Bài 7.1</span>
<h2>Chuẩn hoá</h2>
<p><strong>Chuẩn hoá</strong> tái cấu trúc bảng để khử dư thừa và các <strong>bất thường khi sửa/thêm/xoá</strong> mà dư thừa gây ra.</p>
<h3>Phụ thuộc hàm</h3>
<p>Một <strong>phụ thuộc hàm</strong> X → Y nghĩa là X xác định Y: biết MãSV thì biết đúng một HoTen. Chuẩn hoá được dẫn dắt bởi các phụ thuộc này.</p>
<h3>Các dạng chuẩn</h3>
<ul>
<li><strong>1NF</strong> — mọi ô là nguyên tử (không nhóm lặp, không danh sách trong một cột).</li>
<li><strong>2NF</strong> — 1NF và không thuộc tính ngoài khoá nào phụ thuộc vào MỘT PHẦN của khoá phức.</li>
<li><strong>3NF</strong> — 2NF và không có phụ thuộc bắc cầu (thuộc tính ngoài khoá phụ thuộc thuộc tính ngoài khoá khác).</li>
<li><strong>BCNF</strong> — 3NF chặt hơn: với mọi phụ thuộc X → Y, X phải là siêu khoá.</li>
</ul>
<h3>Phân rã để khử dư thừa</h3>
<pre><code>-- Chưa chuẩn (tên phòng lặp ở mọi hàng):
NHANVIEN(MaNV, HoTen, MaPhong, TenPhong)  -- MaPhong -&gt; TenPhong là bắc cầu

-- 3NF: tách phụ thuộc bắc cầu ra
NHANVIEN(MaNV PK, HoTen, MaPhong FK)
PHONG(MaPhong PK, TenPhong)
</code></pre>
<div class="callout"><span class="badge">Quy tắc</span> Đa số thiết kế nhắm 3NF: mỗi thuộc tính ngoài khoá phụ thuộc vào khoá, toàn bộ khoá, và chỉ khoá mà thôi.</div>`,
  ]]);
const c7q = quiz('idb201-quiz-7', 'Quiz 7 — Normalization|||Quiz 7 — Chuẩn hoá', [
  { id: 'q1', question: 'Dạng chuẩn 1NF yêu cầu?', options: ['Không phụ thuộc bắc cầu', 'Mọi ô là nguyên tử (không nhóm lặp)', 'Mọi cột là khoá', 'Có ít nhất một index'], correctIndex: 1, explanation: '1NF: mỗi ô chứa một giá trị nguyên tử, không danh sách/nhóm lặp.' },
  { id: 'q2', question: 'Phụ thuộc hàm X → Y nghĩa là?', options: ['Y xác định X', 'X xác định duy nhất Y', 'X và Y độc lập', 'X là khoá ngoại của Y'], correctIndex: 1, explanation: 'X → Y: mỗi giá trị X xác định đúng một giá trị Y.' },
  { id: 'q3', question: 'Mục tiêu chính của chuẩn hoá là?', options: ['Tăng tốc CPU', 'Khử dư thừa & các bất thường khi cập nhật', 'Mã hoá dữ liệu', 'Tạo nhiều bản sao dữ liệu'], correctIndex: 1, explanation: 'Chuẩn hoá khử dư thừa và bất thường thêm/xoá/sửa.' },
]);

/* ─────────────────────────  Chương 8  ───────────────────────── */
const c8 = doc('idb201-8-1-transactions', '8.1 — Transactions & integrity|||8.1 — Giao dịch & toàn vẹn',
  'Giao dịch (transaction) & COMMIT/ROLLBACK; tính chất ACID; tương tranh cơ bản (khoá, các bất thường); sao lưu & phục hồi.',
  [[
    `<span class="eyebrow">IDB201 · Chapter 8 · Lesson 8.1</span>
<h2>Transactions &amp; integrity</h2>
<p>A <strong>transaction</strong> is a unit of work that must happen completely or not at all — the classic example is a bank transfer of two updates.</p>
<pre><code>BEGIN;
  UPDATE Account SET balance = balance - 100 WHERE id = 1;
  UPDATE Account SET balance = balance + 100 WHERE id = 2;
COMMIT;   -- or ROLLBACK to undo everything
</code></pre>
<h3>ACID properties</h3>
<ul>
<li><strong>Atomicity</strong> — all steps commit, or none do.</li>
<li><strong>Consistency</strong> — a transaction moves the DB from one valid state to another (constraints hold).</li>
<li><strong>Isolation</strong> — concurrent transactions do not corrupt each other.</li>
<li><strong>Durability</strong> — once committed, data survives a crash.</li>
</ul>
<h3>Concurrency &amp; anomalies</h3>
<p>When transactions run at once you can get a <strong>dirty read, non-repeatable read</strong> or <strong>lost update</strong>. The DBMS prevents these with <strong>locks</strong> and isolation levels.</p>
<h3>Backup &amp; recovery</h3>
<p>Regular <strong>backups</strong> plus a <strong>transaction log</strong> let the DBMS recover to a consistent state after a crash — redoing committed work and undoing uncommitted work.</p>
<div class="callout"><span class="badge">Remember</span> ACID is why money and orders are safe in a relational database even when thousands of users write at the same moment.</div>`,
    `<span class="eyebrow">IDB201 · Chương 8 · Bài 8.1</span>
<h2>Giao dịch &amp; toàn vẹn</h2>
<p>Một <strong>giao dịch</strong> là một đơn vị công việc phải xảy ra trọn vẹn hoặc không xảy ra gì cả — ví dụ kinh điển là chuyển khoản gồm hai lệnh cập nhật.</p>
<pre><code>BEGIN;
  UPDATE TaiKhoan SET soDu = soDu - 100 WHERE id = 1;
  UPDATE TaiKhoan SET soDu = soDu + 100 WHERE id = 2;
COMMIT;   -- hoặc ROLLBACK để huỷ toàn bộ
</code></pre>
<h3>Tính chất ACID</h3>
<ul>
<li><strong>Tính nguyên tử (Atomicity)</strong> — mọi bước cùng commit, hoặc không bước nào.</li>
<li><strong>Tính nhất quán (Consistency)</strong> — giao dịch đưa CSDL từ trạng thái hợp lệ này sang trạng thái hợp lệ khác (ràng buộc còn đúng).</li>
<li><strong>Tính cô lập (Isolation)</strong> — các giao dịch chạy song song không làm hỏng nhau.</li>
<li><strong>Tính bền vững (Durability)</strong> — đã commit thì dữ liệu sống sót qua sự cố.</li>
</ul>
<h3>Tương tranh &amp; bất thường</h3>
<p>Khi giao dịch chạy cùng lúc có thể gặp <strong>đọc bẩn, đọc không lặp lại</strong> hoặc <strong>mất cập nhật</strong>. DBMS ngăn chúng bằng <strong>khoá</strong> và các mức cô lập.</p>
<h3>Sao lưu &amp; phục hồi</h3>
<p><strong>Sao lưu</strong> định kỳ cộng <strong>nhật ký giao dịch</strong> cho phép DBMS phục hồi về trạng thái nhất quán sau sự cố — làm lại phần đã commit và huỷ phần chưa commit.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> ACID là lý do tiền và đơn hàng vẫn an toàn trong CSDL quan hệ dù hàng nghìn người ghi cùng một lúc.</div>`,
  ]]);
const c8q = quiz('idb201-quiz-8', 'Quiz 8 — Transactions & ACID|||Quiz 8 — Giao dịch & ACID', [
  { id: 'q1', question: 'Chữ "A" trong ACID là?', options: ['Availability', 'Atomicity (nguyên tử)', 'Access', 'Automation'], correctIndex: 1, explanation: 'A = Atomicity: mọi bước cùng thành công hoặc cùng huỷ.' },
  { id: 'q2', question: 'Lệnh nào HUỶ toàn bộ thay đổi của một giao dịch?', options: ['COMMIT', 'ROLLBACK', 'SELECT', 'GRANT'], correctIndex: 1, explanation: 'ROLLBACK huỷ mọi thay đổi; COMMIT lưu chúng lại.' },
  { id: 'q3', question: 'Tính "Durability" (bền vững) bảo đảm điều gì?', options: ['Giao dịch chạy nhanh', 'Dữ liệu đã commit sống sót qua sự cố', 'Không bao giờ có khoá', 'Mọi truy vấn đều đọc bẩn'], correctIndex: 1, explanation: 'Durability: sau khi commit, dữ liệu tồn tại kể cả khi hệ thống sập.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'IDB201',
    slug: 'idb201-introduction-to-databases',
    title: 'Introduction to Databases',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IDB201.webp',
    shortDescription: 'How databases work — DBMS & the 3-level architecture, ER modeling, relational model (keys & integrity), relational algebra, SQL (joins, GROUP BY, subqueries, views, indexes), normalization (1NF-BCNF) & transactions (ACID). Bilingual, with SQL examples.|||CSDL hoạt động thế nào — DBMS & kiến trúc 3 lớp, mô hình ER, mô hình quan hệ (khoá & toàn vẹn), đại số quan hệ, SQL (join, GROUP BY, truy vấn con, view, index), chuẩn hoá (1NF-BCNF) & giao dịch (ACID). Song ngữ, có ví dụ SQL & quiz.',
    description: 'Môn <strong>IDB201 — Introduction to Databases</strong> (Nhập môn Cơ sở dữ liệu, Kỳ 3, ngành Khoa học Máy tính) dạy bạn <strong>dữ liệu được lưu, thiết kế và truy vấn thế nào</strong>. Từ <strong>tổng quan DBMS &amp; kiến trúc ba lớp</strong> → <strong>mô hình ER</strong> (thực thể/thuộc tính/liên kết, ERD) → <strong>mô hình quan hệ</strong> (khoá, ràng buộc toàn vẹn) → <strong>đại số quan hệ</strong> → <strong>SQL cơ bản &amp; nâng cao</strong> (DDL/DML, JOIN, GROUP BY, subquery, view, index) → <strong>chuẩn hoá</strong> (1NF-BCNF) → <strong>giao dịch &amp; ACID</strong>. Bám giáo trình chuẩn Elmasri &amp; Navathe và Silberschatz, song ngữ, có ví dụ &amp; mã SQL, quiz mỗi chương.',
    whatYouLearn: 'Khái niệm DBMS & kiến trúc ba lớp; mô hình ER và cách vẽ ERD; mô hình quan hệ (siêu khoá/khoá chính/khoá ngoại, toàn vẹn thực thể & tham chiếu); chuyển ER sang bảng; đại số quan hệ (chọn/chiếu/hợp/kết); SQL (CREATE/INSERT/SELECT/WHERE/JOIN/GROUP BY, subquery, view, index, hàm tổng hợp); chuẩn hoá 1NF/2NF/3NF/BCNF; giao dịch, ACID, tương tranh cơ bản, sao lưu & phục hồi.',
    requirements: 'Kiến thức lập trình cơ bản và tư duy logic. Không cần biết SQL trước. Nên cài PostgreSQL hoặc dùng SQLite Online để chạy thử các ví dụ.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Elmasri & Navathe + Silberschatz, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'CSDL & DBMS là gì, vì sao, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan CSDL|||Chapter 1 — Database systems & DBMS', description: 'DBMS, vì sao dùng, kiến trúc ba lớp, mô hình dữ liệu.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mô hình thực thể - liên kết|||Chapter 2 — ER model', description: 'Thực thể/thuộc tính/liên kết, lực lượng, ERD.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mô hình quan hệ|||Chapter 3 — Relational model', description: 'Quan hệ, khoá, ràng buộc toàn vẹn, chuyển ER → quan hệ.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đại số quan hệ|||Chapter 4 — Relational algebra', description: 'Chọn/chiếu/hợp/giao/hiệu/tích/kết, ghép truy vấn.', lessons: [c4, c4q] },
    { title: 'Chương 5 — SQL cơ bản|||Chapter 5 — SQL basics', description: 'DDL/DML, SELECT/WHERE/JOIN/GROUP BY, pre-code SQL.', lessons: [c5, c5q] },
    { title: 'Chương 6 — SQL nâng cao|||Chapter 6 — Advanced SQL', description: 'Subquery, hàm tổng hợp, view, index, pre-code SQL.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Chuẩn hoá|||Chapter 7 — Normalization', description: 'Phụ thuộc hàm, 1NF/2NF/3NF/BCNF, khử dư thừa.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Giao dịch & toàn vẹn|||Chapter 8 — Transactions & integrity', description: 'Giao dịch, ACID, tương tranh, sao lưu & phục hồi.', lessons: [c8, c8q] },
  ],
};
