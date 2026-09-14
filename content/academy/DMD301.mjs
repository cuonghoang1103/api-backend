/**
 * DMD301 — Data Modeling and Databases. Giáo trình FLM (syl): tổng quan
 * CSDL/DBMS, mô hình ER, mô hình quan hệ & chuyển đổi ER→Relational, chuẩn
 * hoá (1NF-3NF/BCNF), SQL cơ bản & nâng cao (DDL/DML, join, group by,
 * subquery), toàn vẹn dữ liệu & ràng buộc, kho dữ liệu & NoSQL. Song ngữ +
 * ví dụ ERD/SQL + bài tập. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dmd301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (Elmasri/Navathe, Silberschatz, Hoberman), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">DMD301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Data Modeling and Databases — ER diagrams, the relational model, normalization, SQL and data warehousing/NoSQL — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DMD301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Elmasri &amp; Navathe — <em>Fundamentals of Database Systems</em> (the core ER/relational/normalization reference).</li>
<li>Silberschatz, Korth &amp; Sudarshan — <em>Database System Concepts</em> (SQL, transactions, storage &amp; indexing).</li>
<li>Steve Hoberman — <em>Data Modeling Made Simple</em> (practical, business-friendly modeling).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.postgresql.org/docs/current/tutorial.html" target="_blank" rel="noopener">PostgreSQL Tutorial (official docs)</a></li>
<li><a href="https://www.w3schools.com/sql/" target="_blank" rel="noopener">W3Schools SQL</a> — quick syntax reference &amp; try-it editor</li>
<li><a href="https://sqlbolt.com/" target="_blank" rel="noopener">SQLBolt</a> — interactive SQL exercises</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@techTFQ" target="_blank" rel="noopener">techTFQ</a> — SQL, data modeling &amp; interview prep</li>
<li><a href="https://www.youtube.com/@ByteByteGo" target="_blank" rel="noopener">ByteByteGo</a> — database &amp; system-design concepts explained visually</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://dbdiagram.io/" target="_blank" rel="noopener">dbdiagram.io</a> — draw ER diagrams from simple text</li>
<li><a href="https://www.db-fiddle.com/" target="_blank" rel="noopener">DB Fiddle</a> — run SQL online against several database engines</li>
<li><a href="https://sqlitebrowser.org/" target="_blank" rel="noopener">DB Browser for SQLite</a> — free, local, visual database tool</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — database vs DBMS, ER diagrams, the relational model, normalization rules.</li>
<li><strong>Practice</strong> — write CREATE TABLE + SELECT/JOIN queries on DB Fiddle until they run correctly.</li>
<li><strong>Go deeper</strong> — constraints &amp; referential integrity, subqueries, aggregate reporting queries.</li>
<li><strong>Job-ready</strong> — model a small real system end to end (ERD → tables → seed data → report queries); skim data-warehouse &amp; NoSQL basics.</li>
</ol></div>`,
    `<span class="eyebrow">DMD301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Mô hình hoá dữ liệu &amp; Cơ sở dữ liệu — sơ đồ ER, mô hình quan hệ, chuẩn hoá, SQL và kho dữ liệu/NoSQL — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DMD301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Elmasri &amp; Navathe — <em>Fundamentals of Database Systems</em> (tài liệu gốc về ER/quan hệ/chuẩn hoá).</li>
<li>Silberschatz, Korth &amp; Sudarshan — <em>Database System Concepts</em> (SQL, transaction, lưu trữ &amp; chỉ mục).</li>
<li>Steve Hoberman — <em>Data Modeling Made Simple</em> (mô hình hoá thực tế, dễ hiểu cho người không chuyên).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.postgresql.org/docs/current/tutorial.html" target="_blank" rel="noopener">PostgreSQL Tutorial (tài liệu chính thức)</a></li>
<li><a href="https://www.w3schools.com/sql/" target="_blank" rel="noopener">W3Schools SQL</a> — tra cú pháp nhanh &amp; trình soạn thử</li>
<li><a href="https://sqlbolt.com/" target="_blank" rel="noopener">SQLBolt</a> — bài tập SQL tương tác</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@techTFQ" target="_blank" rel="noopener">techTFQ</a> — SQL, mô hình hoá dữ liệu &amp; luyện phỏng vấn</li>
<li><a href="https://www.youtube.com/@ByteByteGo" target="_blank" rel="noopener">ByteByteGo</a> — khái niệm CSDL &amp; thiết kế hệ thống bằng hình vẽ</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://dbdiagram.io/" target="_blank" rel="noopener">dbdiagram.io</a> — vẽ sơ đồ ER chỉ từ đoạn văn bản đơn giản</li>
<li><a href="https://www.db-fiddle.com/" target="_blank" rel="noopener">DB Fiddle</a> — chạy SQL trực tuyến trên nhiều hệ quản trị</li>
<li><a href="https://sqlitebrowser.org/" target="_blank" rel="noopener">DB Browser for SQLite</a> — công cụ CSDL trực quan, miễn phí, cài máy</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — CSDL vs DBMS, sơ đồ ER, mô hình quan hệ, quy tắc chuẩn hoá.</li>
<li><strong>Luyện tập</strong> — viết CREATE TABLE + câu SELECT/JOIN trên DB Fiddle đến khi chạy đúng.</li>
<li><strong>Đào sâu</strong> — ràng buộc &amp; toàn vẹn tham chiếu, subquery, câu truy vấn báo cáo tổng hợp.</li>
<li><strong>Sẵn sàng đi làm</strong> — mô hình hoá một hệ nhỏ thật (ERD → bảng → dữ liệu mẫu → truy vấn báo cáo); đọc lướt kho dữ liệu &amp; NoSQL.</li>
</ol></div>`,
  ]]);

const intro = doc('dmd301-0-1-overview', 'Course overview: Data Modeling and Databases|||Tổng quan: Mô hình hoá dữ liệu & Cơ sở dữ liệu',
  'Vì sao cần mô hình hoá dữ liệu; DBMS làm gì; lộ trình môn: ER → quan hệ → chuẩn hoá → SQL cơ bản → SQL nâng cao → toàn vẹn & ràng buộc → kho dữ liệu/NoSQL.',
  [[
    `<span class="eyebrow">DMD301 · Lesson 0.1 · Overview</span>
<h2>Data Modeling and Databases</h2>
<p class="lead">Almost every application — banking, e-commerce, school management — stores and retrieves data. This course teaches you how to <strong>design</strong> that data correctly (so it stays consistent and doesn't waste space) and how to <strong>query</strong> it efficiently using <strong>SQL</strong>, the language every relational database speaks.</p>
<h3>Why modeling matters</h3>
<p>A database designed badly leads to duplicated data, contradictory records, and slow queries. A database designed well — starting from an <strong>Entity-Relationship (ER) diagram</strong> and following the rules of <strong>normalization</strong> — stays correct and scales as the application grows.</p>
<h3>Roadmap</h3>
<ol>
<li><strong>Chapter 1</strong> — Databases &amp; DBMS: what they are and why we use them.</li>
<li><strong>Chapter 2</strong> — Entity-Relationship (ER) modeling: entities, attributes, relationships.</li>
<li><strong>Chapter 3</strong> — The relational model &amp; mapping an ER diagram to tables.</li>
<li><strong>Chapter 4</strong> — Normalization: 1NF, 2NF, 3NF, BCNF.</li>
<li><strong>Chapter 5</strong> — Basic SQL: DDL (create tables) &amp; DML (insert/update/delete/select).</li>
<li><strong>Chapter 6</strong> — Advanced SQL: joins, GROUP BY, subqueries.</li>
<li><strong>Chapter 7</strong> — Data integrity: keys, constraints, referential integrity.</li>
<li><strong>Chapter 8</strong> — Beyond the relational model: data warehousing &amp; NoSQL.</li>
</ol>
<div class="callout"><span class="badge">How to study</span> This is a hands-on subject. Draw every ER diagram by hand or in a tool, and run every SQL example yourself — reading SQL is not the same as writing it correctly.</div>`,
    `<span class="eyebrow">DMD301 · Bài 0.1 · Tổng quan</span>
<h2>Mô hình hoá dữ liệu &amp; Cơ sở dữ liệu</h2>
<p class="lead">Hầu hết mọi ứng dụng — ngân hàng, thương mại điện tử, quản lý trường học — đều lưu và truy xuất dữ liệu. Môn này dạy bạn cách <strong>thiết kế</strong> dữ liệu đó đúng cách (để luôn nhất quán và không phí chỗ) và cách <strong>truy vấn</strong> nó hiệu quả bằng <strong>SQL</strong> — ngôn ngữ mà mọi CSDL quan hệ đều "nói".</p>
<h3>Vì sao mô hình hoá quan trọng</h3>
<p>Một CSDL thiết kế tệ dẫn đến dữ liệu trùng lặp, mâu thuẫn nhau, và truy vấn chậm. Một CSDL thiết kế tốt — bắt đầu từ <strong>sơ đồ Thực thể-Liên kết (ER)</strong> và tuân theo quy tắc <strong>chuẩn hoá</strong> — luôn đúng và mở rộng tốt khi ứng dụng lớn lên.</p>
<h3>Lộ trình</h3>
<ol>
<li><strong>Chương 1</strong> — CSDL &amp; DBMS: chúng là gì và vì sao ta dùng.</li>
<li><strong>Chương 2</strong> — Mô hình Thực thể-Liên kết (ER): thực thể, thuộc tính, mối quan hệ.</li>
<li><strong>Chương 3</strong> — Mô hình quan hệ &amp; chuyển sơ đồ ER thành bảng.</li>
<li><strong>Chương 4</strong> — Chuẩn hoá: 1NF, 2NF, 3NF, BCNF.</li>
<li><strong>Chương 5</strong> — SQL cơ bản: DDL (tạo bảng) &amp; DML (thêm/sửa/xoá/chọn).</li>
<li><strong>Chương 6</strong> — SQL nâng cao: join, GROUP BY, subquery.</li>
<li><strong>Chương 7</strong> — Toàn vẹn dữ liệu: khoá, ràng buộc, toàn vẹn tham chiếu.</li>
<li><strong>Chương 8</strong> — Vượt ra ngoài mô hình quan hệ: kho dữ liệu &amp; NoSQL.</li>
</ol>
<div class="callout"><span class="badge">Cách học hiệu quả</span> Đây là môn thực hành. Hãy tự vẽ mọi sơ đồ ER bằng tay hoặc công cụ, và tự chạy mọi ví dụ SQL — đọc SQL không giống với viết SQL cho đúng.</div>`,
  ]]);

const c1 = doc('dmd301-1-1-dbms-overview', '1.1 — Databases & DBMS overview|||1.1 — Tổng quan CSDL & hệ quản trị CSDL (DBMS)',
  'Dữ liệu vs thông tin; hạn chế của hệ thống file; CSDL & DBMS; kiến trúc 3 lớp (external/conceptual/internal); vai trò DBA; ví dụ DBMS phổ biến.',
  [[
    `<span class="eyebrow">DMD301 · Chapter 1 · Lesson 1.1</span>
<h2>Databases &amp; DBMS overview</h2>
<h3>From file systems to databases</h3>
<p>Before databases, applications stored data directly in files. This caused three classic problems:</p>
<ul>
<li><strong>Data redundancy</strong> — the same fact (e.g. a customer's address) copied in many files, easy to become inconsistent.</li>
<li><strong>Difficulty accessing data</strong> — every new question needs a new program.</li>
<li><strong>Poor data integrity &amp; concurrency control</strong> — nothing enforces rules or coordinates simultaneous writers.</li>
</ul>
<h3>Database &amp; DBMS</h3>
<p>A <strong>database</strong> is an organized, shared collection of related data. A <strong>Database Management System (DBMS)</strong> is the software that lets users define, create, maintain and control access to that database — e.g. <strong>MySQL, PostgreSQL, Oracle, SQL Server, MongoDB</strong>.</p>
<h3>Three-schema architecture</h3>
<pre><code>External level    (per-user views: what each application/user sees)
Conceptual level  (the whole logical structure: entities, relationships, constraints)
Internal level    (physical storage: files, indexes, on disk)
</code></pre>
<p>This separation gives <strong>data independence</strong>: you can change how data is physically stored without breaking the applications built on the conceptual level.</p>
<h3>Who works with a DBMS</h3>
<ul>
<li><strong>DBA (Database Administrator)</strong> — manages the DBMS, security, backups, performance.</li>
<li><strong>Database designer</strong> — decides what data to store and how (ER diagrams, schemas).</li>
<li><strong>End users / application programmers</strong> — query and update data through applications.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> A DBMS's whole job is to let many people and programs share the same data safely, consistently, and without needless duplication.</div>`,
    `<span class="eyebrow">DMD301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan CSDL &amp; hệ quản trị CSDL (DBMS)</h2>
<h3>Từ hệ thống file đến cơ sở dữ liệu</h3>
<p>Trước khi có CSDL, ứng dụng lưu dữ liệu trực tiếp trong file. Điều này gây ba vấn đề kinh điển:</p>
<ul>
<li><strong>Dư thừa dữ liệu</strong> — cùng một thông tin (vd địa chỉ khách hàng) chép lại ở nhiều file, dễ lệch nhau.</li>
<li><strong>Khó truy xuất dữ liệu</strong> — mỗi câu hỏi mới cần một chương trình mới.</li>
<li><strong>Toàn vẹn &amp; kiểm soát đồng thời kém</strong> — không có gì thực thi quy tắc hay điều phối nhiều người ghi cùng lúc.</li>
</ul>
<h3>Cơ sở dữ liệu &amp; DBMS</h3>
<p>Một <strong>cơ sở dữ liệu (database)</strong> là tập dữ liệu liên quan, có tổ chức, được chia sẻ. Một <strong>hệ quản trị cơ sở dữ liệu (DBMS)</strong> là phần mềm cho phép người dùng định nghĩa, tạo, duy trì và kiểm soát truy cập CSDL đó — vd <strong>MySQL, PostgreSQL, Oracle, SQL Server, MongoDB</strong>.</p>
<h3>Kiến trúc ba lớp</h3>
<pre><code>Lớp ngoài (external)    (khung nhìn riêng từng người dùng/ứng dụng)
Lớp khái niệm (conceptual) (toàn bộ cấu trúc logic: thực thể, quan hệ, ràng buộc)
Lớp trong (internal)    (lưu trữ vật lý: file, chỉ mục, trên đĩa)
</code></pre>
<p>Sự tách biệt này tạo ra <strong>tính độc lập dữ liệu</strong>: bạn có thể đổi cách lưu trữ vật lý mà không phá vỡ ứng dụng xây trên lớp khái niệm.</p>
<h3>Ai làm việc với DBMS</h3>
<ul>
<li><strong>DBA (Quản trị CSDL)</strong> — quản lý DBMS, an ninh, sao lưu, hiệu năng.</li>
<li><strong>Người thiết kế CSDL</strong> — quyết định lưu gì và lưu thế nào (sơ đồ ER, schema).</li>
<li><strong>Người dùng cuối / người viết ứng dụng</strong> — truy vấn và cập nhật dữ liệu qua ứng dụng.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Việc của DBMS là cho nhiều người và nhiều chương trình dùng chung một dữ liệu một cách an toàn, nhất quán, không dư thừa vô lý.</div>`,
  ]]);

const c1q = quiz('dmd301-quiz-1', 'Quiz 1 — Databases & DBMS|||Quiz 1 — CSDL & DBMS', [
  { id: 'q1', question: 'DBMS là gì?', options: ['Một loại ổ cứng', 'Phần mềm quản lý việc tạo & truy cập CSDL', 'Một ngôn ngữ lập trình', 'Một sơ đồ ER'], correctIndex: 1, explanation: 'DBMS là phần mềm định nghĩa, tạo, duy trì và kiểm soát truy cập CSDL.' },
  { id: 'q2', question: 'Vấn đề của hệ thống lưu trữ bằng file (trước CSDL) là gì?', options: ['Không tốn chi phí', 'Dư thừa dữ liệu & khó truy xuất', 'Luôn nhất quán', 'Không cần chương trình để đọc'], correctIndex: 1, explanation: 'File rời rạc gây dư thừa, mâu thuẫn và khó truy xuất linh hoạt.' },
  { id: 'q3', question: 'Lớp nào trong kiến trúc 3 lớp mô tả cách dữ liệu được lưu vật lý trên đĩa?', options: ['External', 'Conceptual', 'Internal', 'Application'], correctIndex: 2, explanation: 'Lớp Internal quản lý lưu trữ vật lý: file, chỉ mục.' },
]);

const c2 = doc('dmd301-2-1-er-model', '2.1 — Entity-Relationship (ER) modeling|||2.1 — Mô hình thực thể-liên kết (ERD)',
  'Thực thể, thuộc tính (đơn/phức/dẫn xuất/đa trị), khoá; mối quan hệ & lực lượng liên kết (1:1, 1:N, M:N); thực thể yếu; ví dụ sơ đồ ER.',
  [[
    `<span class="eyebrow">DMD301 · Chapter 2 · Lesson 2.1</span>
<h2>Entity-Relationship (ER) modeling</h2>
<h3>Entities &amp; attributes</h3>
<p>An <strong>entity</strong> is a distinguishable real-world object (a <em>Customer</em>, an <em>Order</em>). An <strong>attribute</strong> describes an entity. Attributes can be:</p>
<ul>
<li><strong>Simple</strong> — cannot be divided further (e.g. <em>Age</em>).</li>
<li><strong>Composite</strong> — made of parts (e.g. <em>Address</em> = street + city + zip).</li>
<li><strong>Derived</strong> — computed from other data (e.g. <em>Age</em> derived from <em>BirthDate</em>).</li>
<li><strong>Multivalued</strong> — can hold more than one value (e.g. a <em>Customer</em> can have several <em>Phone Numbers</em>).</li>
</ul>
<h3>Keys</h3>
<p>A <strong>key</strong> is one or more attributes that uniquely identify an entity instance. The chosen one is the <strong>primary key</strong> (e.g. <em>CustomerID</em>); other candidates not chosen are <strong>candidate keys</strong>.</p>
<h3>Relationships &amp; cardinality</h3>
<p>A <strong>relationship</strong> connects two (or more) entities (e.g. Customer <em>places</em> Order). Its <strong>cardinality ratio</strong> describes how many instances of one entity relate to how many of another:</p>
<ul>
<li><strong>1:1</strong> — one Employee <em>manages</em> one Department, one Department has one manager.</li>
<li><strong>1:N</strong> — one Customer <em>places</em> many Orders, each Order belongs to one Customer.</li>
<li><strong>M:N</strong> — many Students <em>enroll in</em> many Courses.</li>
</ul>
<h3>Weak entities</h3>
<p>A <strong>weak entity</strong> has no primary key of its own — it depends on a related "owner" entity for identification (e.g. a <em>Dependent</em> identified together with the <em>Employee</em> it belongs to, via a partial key).</p>
<h3>Example ER diagram (crow's foot text notation)</h3>
<pre><code>CUSTOMER  ||--o{ ORDER       : places
ORDER     ||--|{ ORDER_ITEM  : contains
PRODUCT   }o--|| ORDER_ITEM  : "listed in"
STUDENT   }o--o{ COURSE      : enrolls_in   (M:N relationship)
</code></pre>
<p>Reading it: <code>||</code> means exactly one, <code>o{</code> means zero-or-many — so one CUSTOMER places zero-or-many ORDERs, and each ORDER belongs to exactly one CUSTOMER.</p>
<div class="callout"><span class="badge">Key idea</span> The ER diagram is a communication tool with stakeholders BEFORE you write any table — get the entities, attributes and cardinalities right here, and the relational design in Chapter 3 becomes almost mechanical.</div>`,
    `<span class="eyebrow">DMD301 · Chương 2 · Bài 2.1</span>
<h2>Mô hình thực thể-liên kết (ERD)</h2>
<h3>Thực thể &amp; thuộc tính</h3>
<p>Một <strong>thực thể (entity)</strong> là một đối tượng thực tế phân biệt được (một <em>Khách hàng</em>, một <em>Đơn hàng</em>). Một <strong>thuộc tính (attribute)</strong> mô tả thực thể đó. Thuộc tính có thể là:</p>
<ul>
<li><strong>Đơn giản (simple)</strong> — không chia nhỏ được nữa (vd <em>Tuổi</em>).</li>
<li><strong>Phức hợp (composite)</strong> — gồm nhiều phần (vd <em>Địa chỉ</em> = đường + thành phố + mã vùng).</li>
<li><strong>Dẫn xuất (derived)</strong> — tính ra từ dữ liệu khác (vd <em>Tuổi</em> tính từ <em>Ngày sinh</em>).</li>
<li><strong>Đa trị (multivalued)</strong> — có thể mang nhiều giá trị (vd một <em>Khách hàng</em> có nhiều <em>Số điện thoại</em>).</li>
</ul>
<h3>Khoá (keys)</h3>
<p>Một <strong>khoá</strong> là một hay nhiều thuộc tính xác định duy nhất một thực thể. Khoá được chọn gọi là <strong>khoá chính (primary key)</strong> (vd <em>CustomerID</em>); các ứng viên không được chọn gọi là <strong>khoá dự tuyển (candidate key)</strong>.</p>
<h3>Mối quan hệ &amp; lực lượng liên kết</h3>
<p>Một <strong>mối quan hệ (relationship)</strong> nối hai (hoặc nhiều) thực thể (vd Khách hàng <em>đặt</em> Đơn hàng). <strong>Tỉ số lực lượng liên kết (cardinality)</strong> mô tả bao nhiêu bản thể của thực thể này liên kết với bao nhiêu bản thể của thực thể khác:</p>
<ul>
<li><strong>1:1</strong> — một Nhân viên <em>quản lý</em> một Phòng ban, một Phòng ban có một quản lý.</li>
<li><strong>1:N</strong> — một Khách hàng <em>đặt</em> nhiều Đơn hàng, mỗi Đơn hàng thuộc một Khách hàng.</li>
<li><strong>M:N</strong> — nhiều Sinh viên <em>đăng ký</em> nhiều Môn học.</li>
</ul>
<h3>Thực thể yếu (weak entity)</h3>
<p>Một <strong>thực thể yếu</strong> không có khoá chính riêng — nó phụ thuộc vào một thực thể "chủ" liên quan để xác định (vd <em>Người thân</em> được xác định cùng với <em>Nhân viên</em> mà nó thuộc về, thông qua khoá bộ phận).</p>
<h3>Ví dụ sơ đồ ER (ký hiệu crow's foot dạng văn bản)</h3>
<pre><code>CUSTOMER  ||--o{ ORDER       : places
ORDER     ||--|{ ORDER_ITEM  : contains
PRODUCT   }o--|| ORDER_ITEM  : "listed in"
STUDENT   }o--o{ COURSE      : enrolls_in   (quan hệ M:N)
</code></pre>
<p>Đọc: <code>||</code> nghĩa là chính xác một, <code>o{</code> nghĩa là không-hoặc-nhiều — vậy một CUSTOMER đặt không-hoặc-nhiều ORDER, và mỗi ORDER thuộc đúng một CUSTOMER.</p>
<div class="callout"><span class="badge">Ý chính</span> Sơ đồ ER là công cụ trao đổi với người liên quan TRƯỚC khi viết bảng nào — làm đúng thực thể, thuộc tính, lực lượng liên kết ở đây thì thiết kế quan hệ ở Chương 3 gần như là máy móc.</div>`,
  ]]);

const c2q = quiz('dmd301-quiz-2', 'Quiz 2 — ER model|||Quiz 2 — Mô hình ER', [
  { id: 'q1', question: 'Thuộc tính "Tuổi" tính từ "Ngày sinh" thuộc loại nào?', options: ['Đơn giản', 'Phức hợp', 'Dẫn xuất (derived)', 'Đa trị'], correctIndex: 2, explanation: 'Derived: tính ra từ thuộc tính khác, không lưu trực tiếp.' },
  { id: 'q2', question: 'Một Khách hàng đặt nhiều Đơn hàng, mỗi Đơn hàng thuộc một Khách hàng — đây là quan hệ gì?', options: ['1:1', '1:N', 'M:N', 'Không có quan hệ'], correctIndex: 1, explanation: '1 Customer ↔ nhiều Order, mỗi Order chỉ 1 Customer → 1:N.' },
  { id: 'q3', question: 'Thực thể yếu (weak entity) là gì?', options: ['Thực thể có nhiều thuộc tính', 'Thực thể không có khoá chính riêng, phụ thuộc thực thể chủ', 'Thực thể chỉ có 1 thuộc tính', 'Thực thể không có quan hệ nào'], correctIndex: 1, explanation: 'Weak entity không tự xác định được, cần thực thể chủ + khoá bộ phận.' },
]);

const c3 = doc('dmd301-3-1-relational-mapping', '3.1 — Relational model & mapping ER to tables|||3.1 — Mô hình quan hệ & chuyển ER sang bảng',
  'Quan hệ, bộ, thuộc tính, miền giá trị; siêu khoá/khoá dự tuyển/khoá chính/khoá ngoại; thuật toán chuyển ER→Relational cho thực thể mạnh/yếu, quan hệ 1:1/1:N/M:N, thuộc tính đa trị.',
  [[
    `<span class="eyebrow">DMD301 · Chapter 3 · Lesson 3.1</span>
<h2>Relational model &amp; mapping ER to tables</h2>
<h3>Relational model vocabulary</h3>
<ul>
<li><strong>Relation</strong> — a table.</li>
<li><strong>Tuple</strong> — a row.</li>
<li><strong>Attribute</strong> — a column.</li>
<li><strong>Domain</strong> — the set of allowed values for an attribute (e.g. INT, VARCHAR(50), DATE).</li>
</ul>
<h3>Types of keys</h3>
<ul>
<li><strong>Superkey</strong> — any set of attributes that uniquely identifies a tuple.</li>
<li><strong>Candidate key</strong> — a minimal superkey (no attribute can be removed and still be unique).</li>
<li><strong>Primary key (PK)</strong> — the candidate key chosen to identify rows.</li>
<li><strong>Foreign key (FK)</strong> — an attribute in one table that references the primary key of another table, implementing a relationship.</li>
</ul>
<h3>Mapping algorithm (ER → tables)</h3>
<pre><code>1. Strong entity        -&gt; one table; its attributes become columns; PK = entity key.
2. Weak entity          -&gt; one table; add the owner's PK as an FK, combine with the
                          partial key to form the table's PK.
3. 1:1 relationship     -&gt; put the FK on either side's table (often the one with
                          mandatory participation).
4. 1:N relationship     -&gt; put the FK on the "N" (many) side's table, referencing
                          the "1" side's PK.
5. M:N relationship     -&gt; create a NEW junction table holding both sides' PKs as
                          a composite FK/PK pair.
6. Multivalued attribute -&gt; create a NEW table with an FK back to the owning entity.
</code></pre>
<h3>Worked example</h3>
<p>ER: <em>Student</em> M:N <em>Course</em> (via "enrolls_in", with a Grade). Mapping:</p>
<pre><code>STUDENT(student_id PK, name, email)
COURSE(course_id PK, title, credits)
ENROLLMENT(student_id FK, course_id FK, grade, PRIMARY KEY(student_id, course_id))
</code></pre>
<p>The junction table <code>ENROLLMENT</code> both resolves the M:N relationship AND is the natural place to store an attribute that belongs to the relationship itself (the grade).</p>
<div class="callout"><span class="badge">Rule of thumb</span> The FK always sits on the "many" side. When BOTH sides are "many" (M:N), you need a brand-new table in between.</div>`,
    `<span class="eyebrow">DMD301 · Chương 3 · Bài 3.1</span>
<h2>Mô hình quan hệ &amp; chuyển ER sang bảng</h2>
<h3>Từ vựng mô hình quan hệ</h3>
<ul>
<li><strong>Quan hệ (relation)</strong> — một bảng.</li>
<li><strong>Bộ (tuple)</strong> — một dòng.</li>
<li><strong>Thuộc tính (attribute)</strong> — một cột.</li>
<li><strong>Miền giá trị (domain)</strong> — tập giá trị hợp lệ của một thuộc tính (vd INT, VARCHAR(50), DATE).</li>
</ul>
<h3>Các loại khoá</h3>
<ul>
<li><strong>Siêu khoá (superkey)</strong> — bất kỳ tập thuộc tính nào xác định duy nhất một bộ.</li>
<li><strong>Khoá dự tuyển (candidate key)</strong> — siêu khoá tối thiểu (không thể bỏ thuộc tính nào mà vẫn còn duy nhất).</li>
<li><strong>Khoá chính (primary key - PK)</strong> — khoá dự tuyển được chọn để xác định dòng.</li>
<li><strong>Khoá ngoại (foreign key - FK)</strong> — thuộc tính ở một bảng tham chiếu đến khoá chính của bảng khác, hiện thực hoá một mối quan hệ.</li>
</ul>
<h3>Thuật toán chuyển đổi (ER → bảng)</h3>
<pre><code>1. Thực thể mạnh       -&gt; một bảng; thuộc tính thành cột; PK = khoá thực thể.
2. Thực thể yếu        -&gt; một bảng; thêm PK của thực thể chủ làm FK, kết hợp với
                         khoá bộ phận để tạo PK của bảng.
3. Quan hệ 1:1          -&gt; đặt FK ở bảng của một trong hai phía (thường phía tham
                         gia bắt buộc).
4. Quan hệ 1:N          -&gt; đặt FK ở bảng phía "N" (nhiều), tham chiếu PK phía "1".
5. Quan hệ M:N          -&gt; tạo bảng TRUNG GIAN mới chứa PK của cả hai phía làm
                         cặp FK/PK phức hợp.
6. Thuộc tính đa trị    -&gt; tạo bảng MỚI có FK trỏ về thực thể chủ.
</code></pre>
<h3>Ví dụ minh hoạ</h3>
<p>ER: <em>Sinh viên</em> M:N <em>Môn học</em> (qua "đăng ký", có Điểm). Chuyển đổi:</p>
<pre><code>STUDENT(student_id PK, name, email)
COURSE(course_id PK, title, credits)
ENROLLMENT(student_id FK, course_id FK, grade, PRIMARY KEY(student_id, course_id))
</code></pre>
<p>Bảng trung gian <code>ENROLLMENT</code> vừa giải quyết quan hệ M:N VỪA là nơi tự nhiên để lưu thuộc tính thuộc về chính mối quan hệ (điểm số).</p>
<div class="callout"><span class="badge">Quy tắc nhớ nhanh</span> FK luôn nằm ở phía "nhiều". Khi CẢ HAI phía đều là "nhiều" (M:N), cần một bảng mới ở giữa.</div>`,
  ]]);

const c3q = quiz('dmd301-quiz-3', 'Quiz 3 — Relational mapping|||Quiz 3 — Chuyển đổi quan hệ', [
  { id: 'q1', question: 'Khoá dự tuyển tối thiểu, không thể bỏ thuộc tính nào mà vẫn duy nhất, gọi là?', options: ['Siêu khoá', 'Khoá ngoại', 'Candidate key', 'Khoá phức hợp'], correctIndex: 2, explanation: 'Candidate key là siêu khoá tối thiểu.' },
  { id: 'q2', question: 'Quan hệ 1:N thì khoá ngoại (FK) đặt ở đâu?', options: ['Phía "1"', 'Phía "N" (nhiều)', 'Bảng trung gian mới', 'Không cần FK'], correctIndex: 1, explanation: 'FK đặt ở phía "nhiều", tham chiếu PK phía "một".' },
  { id: 'q3', question: 'Quan hệ M:N khi chuyển sang bảng cần gì?', options: ['Chỉ cần thêm FK vào 1 bảng', 'Một bảng trung gian mới chứa cả 2 FK', 'Không cần thay đổi gì', 'Xoá một trong hai thực thể'], correctIndex: 1, explanation: 'M:N cần bảng trung gian với cặp FK làm PK phức hợp.' },
]);

const c4 = doc('dmd301-4-1-normalization', '4.1 — Normalization (1NF–3NF, BCNF)|||4.1 — Chuẩn hoá (1NF-3NF, BCNF)',
  'Dị thường dữ liệu (insertion/update/deletion anomaly); phụ thuộc hàm; 1NF, 2NF (phụ thuộc bộ phận), 3NF (phụ thuộc bắc cầu), BCNF; ví dụ chuẩn hoá từng bước.',
  [[
    `<span class="eyebrow">DMD301 · Chapter 4 · Lesson 4.1</span>
<h2>Normalization (1NF–3NF, BCNF)</h2>
<h3>Why normalize? Data anomalies</h3>
<p>A poorly structured table causes:</p>
<ul>
<li><strong>Insertion anomaly</strong> — you can't add one fact without also having another (e.g. can't record a new course before it has a student).</li>
<li><strong>Update anomaly</strong> — the same fact stored in several rows; update one, forget another → contradictions.</li>
<li><strong>Deletion anomaly</strong> — deleting one fact accidentally erases another you still needed.</li>
</ul>
<h3>Functional dependency</h3>
<p>Attribute B is <strong>functionally dependent</strong> on A (written A → B) if each value of A is associated with exactly one value of B. Normalization is built entirely on reasoning about these dependencies.</p>
<h3>The normal forms</h3>
<pre><code>1NF — every column holds a single, atomic value; no repeating groups.
2NF — 1NF + no partial dependency (a non-key attribute must depend on the
      WHOLE primary key, not just part of a composite key).
3NF — 2NF + no transitive dependency (a non-key attribute must depend
      DIRECTLY on the key, not on another non-key attribute).
BCNF — for every functional dependency X -&gt; Y, X must be a candidate key
      (a stricter version of 3NF).
</code></pre>
<h3>Worked example</h3>
<p>Start with a denormalized table:</p>
<pre><code>ORDER_INFO(order_id, product_id, product_name, customer_id, customer_name, qty)
-- product_name depends only on product_id (partial dependency if PK is
-- order_id+product_id) -&gt; violates 2NF.
-- customer_name depends on customer_id, not directly on order_id -&gt; a
-- transitive dependency once customer_id is in the table -&gt; violates 3NF.</code></pre>
<p>Normalized into 3NF:</p>
<pre><code>CUSTOMER(customer_id PK, customer_name)
PRODUCT(product_id PK, product_name)
ORDERS(order_id PK, customer_id FK)
ORDER_ITEM(order_id FK, product_id FK, qty, PRIMARY KEY(order_id, product_id))
</code></pre>
<div class="callout"><span class="badge">Trade-off</span> Higher normal forms remove redundancy and anomalies but require more JOINs to read data. In practice most production databases target <strong>3NF</strong>, and occasionally denormalize on purpose for read performance.</div>`,
    `<span class="eyebrow">DMD301 · Chương 4 · Bài 4.1</span>
<h2>Chuẩn hoá (1NF-3NF, BCNF)</h2>
<h3>Vì sao phải chuẩn hoá? Dị thường dữ liệu</h3>
<p>Một bảng cấu trúc kém gây ra:</p>
<ul>
<li><strong>Dị thường thêm (insertion anomaly)</strong> — không thể thêm một thông tin nếu chưa có thông tin khác đi kèm (vd không thêm được môn học mới nếu chưa có sinh viên).</li>
<li><strong>Dị thường sửa (update anomaly)</strong> — cùng một thông tin lưu ở nhiều dòng; sửa một dòng, quên dòng khác → mâu thuẫn.</li>
<li><strong>Dị thường xoá (deletion anomaly)</strong> — xoá một thông tin vô tình xoá luôn thông tin khác vẫn cần giữ.</li>
</ul>
<h3>Phụ thuộc hàm (functional dependency)</h3>
<p>Thuộc tính B <strong>phụ thuộc hàm</strong> vào A (ký hiệu A → B) nếu mỗi giá trị của A gắn với đúng một giá trị của B. Chuẩn hoá dựa hoàn toàn vào việc suy luận trên các phụ thuộc này.</p>
<h3>Các dạng chuẩn</h3>
<pre><code>1NF — mỗi cột chứa đúng một giá trị nguyên tố; không có nhóm lặp.
2NF — 1NF + không có phụ thuộc bộ phận (thuộc tính không khoá phải phụ
      thuộc TOÀN BỘ khoá chính, không chỉ một phần của khoá phức hợp).
3NF — 2NF + không có phụ thuộc bắc cầu (thuộc tính không khoá phải phụ
      thuộc TRỰC TIẾP vào khoá, không qua thuộc tính không khoá khác).
BCNF — với mọi phụ thuộc hàm X -&gt; Y, X phải là khoá dự tuyển
      (phiên bản nghiêm ngặt hơn của 3NF).
</code></pre>
<h3>Ví dụ minh hoạ</h3>
<p>Bắt đầu với một bảng chưa chuẩn hoá:</p>
<pre><code>ORDER_INFO(order_id, product_id, product_name, customer_id, customer_name, qty)
-- product_name chỉ phụ thuộc product_id (phụ thuộc bộ phận nếu PK là
-- order_id+product_id) -&gt; vi phạm 2NF.
-- customer_name phụ thuộc customer_id, không phụ thuộc trực tiếp order_id
-- -&gt; phụ thuộc bắc cầu khi đã có customer_id trong bảng -&gt; vi phạm 3NF.</code></pre>
<p>Chuẩn hoá về 3NF:</p>
<pre><code>CUSTOMER(customer_id PK, customer_name)
PRODUCT(product_id PK, product_name)
ORDERS(order_id PK, customer_id FK)
ORDER_ITEM(order_id FK, product_id FK, qty, PRIMARY KEY(order_id, product_id))
</code></pre>
<div class="callout"><span class="badge">Đánh đổi</span> Dạng chuẩn cao hơn loại bỏ dư thừa &amp; dị thường nhưng cần nhiều JOIN hơn khi đọc. Thực tế hầu hết CSDL sản phẩm hướng tới <strong>3NF</strong>, và đôi khi phi chuẩn hoá có chủ đích để tăng tốc đọc.</div>`,
  ]]);

const c4q = quiz('dmd301-quiz-4', 'Quiz 4 — Normalization|||Quiz 4 — Chuẩn hoá', [
  { id: 'q1', question: '1NF yêu cầu điều gì?', options: ['Mỗi cột chứa nhiều giá trị', 'Mỗi cột chứa một giá trị nguyên tố, không nhóm lặp', 'Không có khoá chính', 'Mọi thuộc tính là khoá'], correctIndex: 1, explanation: '1NF: giá trị nguyên tố (atomic), không nhóm lặp.' },
  { id: 'q2', question: 'Phụ thuộc bộ phận (partial dependency) vi phạm dạng chuẩn nào?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctIndex: 1, explanation: '2NF yêu cầu thuộc tính không khoá phụ thuộc TOÀN BỘ khoá chính.' },
  { id: 'q3', question: 'Phụ thuộc bắc cầu (transitive dependency) là gì?', options: ['Thuộc tính không khoá phụ thuộc khoá chính trực tiếp', 'Thuộc tính không khoá phụ thuộc qua một thuộc tính không khoá khác', 'Khoá chính phụ thuộc thuộc tính khác', 'Không có phụ thuộc nào'], correctIndex: 1, explanation: 'Bắc cầu: A→B→C, C phụ thuộc gián tiếp A qua B — vi phạm 3NF.' },
]);

const c5 = doc('dmd301-5-1-sql-basics', '5.1 — SQL basics: DDL & DML|||5.1 — SQL cơ bản: DDL & DML',
  'CREATE/ALTER/DROP TABLE (DDL); INSERT/UPDATE/DELETE (DML); SELECT cơ bản: WHERE, ORDER BY, DISTINCT, các toán tử so sánh & logic.',
  [[
    `<span class="eyebrow">DMD301 · Chapter 5 · Lesson 5.1</span>
<h2>SQL basics: DDL &amp; DML</h2>
<h3>DDL — Data Definition Language</h3>
<pre><code>CREATE TABLE customer (
  customer_id  INT PRIMARY KEY,
  full_name    VARCHAR(100) NOT NULL,
  email        VARCHAR(100) UNIQUE,
  created_at   DATE DEFAULT CURRENT_DATE
);

ALTER TABLE customer ADD COLUMN phone VARCHAR(20);
DROP TABLE customer;   -- removes the table (and its data) entirely
</code></pre>
<h3>DML — Data Manipulation Language</h3>
<pre><code>INSERT INTO customer (customer_id, full_name, email)
VALUES (1, 'Nguyen Van A', 'a@example.com');

UPDATE customer SET phone = '0900000000' WHERE customer_id = 1;

DELETE FROM customer WHERE customer_id = 1;
</code></pre>
<h3>Basic SELECT queries</h3>
<pre><code>SELECT full_name, email FROM customer;

SELECT DISTINCT city FROM customer;

SELECT * FROM customer
WHERE created_at &gt;= '2026-01-01' AND email IS NOT NULL
ORDER BY full_name ASC;

SELECT * FROM product WHERE price &gt; 100000 AND price &lt; 500000;
</code></pre>
<h3>Common operators</h3>
<ul>
<li>Comparison: <code>=</code>, <code>&lt;&gt;</code>, <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code></li>
<li>Logical: <code>AND</code>, <code>OR</code>, <code>NOT</code></li>
<li>Pattern &amp; range: <code>LIKE '%pattern%'</code>, <code>BETWEEN x AND y</code>, <code>IN (a, b, c)</code></li>
</ul>
<div class="callout"><span class="badge">Practice</span> Type every query above yourself in <a href="https://www.db-fiddle.com/" target="_blank" rel="noopener">DB Fiddle</a> — muscle memory for SQL syntax only comes from typing it.</div>`,
    `<span class="eyebrow">DMD301 · Chương 5 · Bài 5.1</span>
<h2>SQL cơ bản: DDL &amp; DML</h2>
<h3>DDL — Ngôn ngữ định nghĩa dữ liệu</h3>
<pre><code>CREATE TABLE customer (
  customer_id  INT PRIMARY KEY,
  full_name    VARCHAR(100) NOT NULL,
  email        VARCHAR(100) UNIQUE,
  created_at   DATE DEFAULT CURRENT_DATE
);

ALTER TABLE customer ADD COLUMN phone VARCHAR(20);
DROP TABLE customer;   -- xoá hẳn bảng (và dữ liệu trong đó)
</code></pre>
<h3>DML — Ngôn ngữ thao tác dữ liệu</h3>
<pre><code>INSERT INTO customer (customer_id, full_name, email)
VALUES (1, 'Nguyen Van A', 'a@example.com');

UPDATE customer SET phone = '0900000000' WHERE customer_id = 1;

DELETE FROM customer WHERE customer_id = 1;
</code></pre>
<h3>Câu SELECT cơ bản</h3>
<pre><code>SELECT full_name, email FROM customer;

SELECT DISTINCT city FROM customer;

SELECT * FROM customer
WHERE created_at &gt;= '2026-01-01' AND email IS NOT NULL
ORDER BY full_name ASC;

SELECT * FROM product WHERE price &gt; 100000 AND price &lt; 500000;
</code></pre>
<h3>Các toán tử thường dùng</h3>
<ul>
<li>So sánh: <code>=</code>, <code>&lt;&gt;</code>, <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code></li>
<li>Logic: <code>AND</code>, <code>OR</code>, <code>NOT</code></li>
<li>Mẫu &amp; khoảng: <code>LIKE '%mau%'</code>, <code>BETWEEN x AND y</code>, <code>IN (a, b, c)</code></li>
</ul>
<div class="callout"><span class="badge">Luyện tập</span> Tự gõ lại mọi câu SQL trên trong <a href="https://www.db-fiddle.com/" target="_blank" rel="noopener">DB Fiddle</a> — chỉ có gõ tay mới hình thành phản xạ cú pháp SQL.</div>`,
  ]]);

const c5q = quiz('dmd301-quiz-5', 'Quiz 5 — SQL basics|||Quiz 5 — SQL cơ bản', [
  { id: 'q1', question: 'Câu lệnh nào dùng để TẠO một bảng mới?', options: ['SELECT', 'CREATE TABLE', 'UPDATE', 'ALTER'], correctIndex: 1, explanation: 'CREATE TABLE thuộc DDL, dùng để tạo bảng mới.' },
  { id: 'q2', question: 'Câu lệnh nào dùng để SỬA dữ liệu đã có trong bảng?', options: ['INSERT', 'UPDATE', 'CREATE', 'DROP'], correctIndex: 1, explanation: 'UPDATE thuộc DML, sửa giá trị của dòng đã tồn tại.' },
  { id: 'q3', question: 'Mệnh đề nào dùng để lọc dòng thoả điều kiện trong SELECT?', options: ['ORDER BY', 'GROUP BY', 'WHERE', 'DISTINCT'], correctIndex: 2, explanation: 'WHERE lọc dòng theo điều kiện, chạy trước khi sắp xếp/nhóm.' },
]);

const c6 = doc('dmd301-6-1-sql-advanced', '6.1 — Advanced SQL: joins, GROUP BY, subqueries|||6.1 — SQL nâng cao: join, GROUP BY, subquery',
  'INNER/LEFT/RIGHT JOIN; GROUP BY + hàm tổng hợp (COUNT/SUM/AVG/MAX/MIN) & HAVING; subquery (scalar, IN, tương quan); UNION.',
  [[
    `<span class="eyebrow">DMD301 · Chapter 6 · Lesson 6.1</span>
<h2>Advanced SQL: joins, GROUP BY, subqueries</h2>
<h3>Joins — combining tables</h3>
<pre><code>-- INNER JOIN: only rows that match in both tables
SELECT o.order_id, c.full_name
FROM orders o
INNER JOIN customer c ON o.customer_id = c.customer_id;

-- LEFT JOIN: all customers, even those with zero orders (NULL on the right)
SELECT c.full_name, o.order_id
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.customer_id;
</code></pre>
<h3>Aggregation: GROUP BY + HAVING</h3>
<pre><code>SELECT customer_id, COUNT(*) AS order_count, SUM(total) AS total_spent
FROM orders
GROUP BY customer_id
HAVING COUNT(*) &gt; 3          -- filters GROUPS, not rows
ORDER BY total_spent DESC;
</code></pre>
<p>Aggregate functions: <code>COUNT</code>, <code>SUM</code>, <code>AVG</code>, <code>MAX</code>, <code>MIN</code>. Key rule: <strong>WHERE filters rows before grouping; HAVING filters groups after grouping.</strong></p>
<h3>Subqueries</h3>
<pre><code>-- Scalar subquery in WHERE
SELECT * FROM product
WHERE price &gt; (SELECT AVG(price) FROM product);

-- Subquery with IN
SELECT full_name FROM customer
WHERE customer_id IN (SELECT customer_id FROM orders WHERE total &gt; 1000000);

-- Correlated subquery: re-evaluated for each outer row
SELECT c.full_name FROM customer c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);
</code></pre>
<h3>Set operations</h3>
<pre><code>SELECT city FROM customer
UNION
SELECT city FROM supplier;   -- combines rows, removes duplicates
</code></pre>
<div class="callout"><span class="badge">Debugging tip</span> Build a query incrementally: start with the FROM/JOIN, run it to check the row count, THEN add WHERE, THEN GROUP BY. Adding everything at once makes mistakes hard to find.</div>`,
    `<span class="eyebrow">DMD301 · Chương 6 · Bài 6.1</span>
<h2>SQL nâng cao: join, GROUP BY, subquery</h2>
<h3>Join — kết hợp nhiều bảng</h3>
<pre><code>-- INNER JOIN: chỉ lấy dòng khớp ở CẢ HAI bảng
SELECT o.order_id, c.full_name
FROM orders o
INNER JOIN customer c ON o.customer_id = c.customer_id;

-- LEFT JOIN: lấy hết khách hàng, cả người chưa có đơn nào (NULL bên phải)
SELECT c.full_name, o.order_id
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.customer_id;
</code></pre>
<h3>Tổng hợp: GROUP BY + HAVING</h3>
<pre><code>SELECT customer_id, COUNT(*) AS order_count, SUM(total) AS total_spent
FROM orders
GROUP BY customer_id
HAVING COUNT(*) &gt; 3          -- lọc NHÓM, không phải lọc dòng
ORDER BY total_spent DESC;
</code></pre>
<p>Hàm tổng hợp: <code>COUNT</code>, <code>SUM</code>, <code>AVG</code>, <code>MAX</code>, <code>MIN</code>. Quy tắc chính: <strong>WHERE lọc dòng TRƯỚC khi nhóm; HAVING lọc nhóm SAU khi nhóm.</strong></p>
<h3>Subquery (truy vấn con)</h3>
<pre><code>-- Subquery vô hướng trong WHERE
SELECT * FROM product
WHERE price &gt; (SELECT AVG(price) FROM product);

-- Subquery với IN
SELECT full_name FROM customer
WHERE customer_id IN (SELECT customer_id FROM orders WHERE total &gt; 1000000);

-- Subquery tương quan: chạy lại cho mỗi dòng ngoài
SELECT c.full_name FROM customer c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);
</code></pre>
<h3>Phép toán tập hợp</h3>
<pre><code>SELECT city FROM customer
UNION
SELECT city FROM supplier;   -- gộp dòng, loại trùng
</code></pre>
<div class="callout"><span class="badge">Mẹo gỡ lỗi</span> Xây câu truy vấn từng bước: viết FROM/JOIN trước, chạy để kiểm số dòng, RỒI thêm WHERE, RỒI GROUP BY. Viết hết một lượt sẽ khó tìm lỗi khi sai.</div>`,
  ]]);

const c6q = quiz('dmd301-quiz-6', 'Quiz 6 — Advanced SQL|||Quiz 6 — SQL nâng cao', [
  { id: 'q1', question: 'LEFT JOIN khác INNER JOIN ở điểm nào?', options: ['LEFT JOIN chỉ lấy dòng khớp cả hai bảng', 'LEFT JOIN giữ tất cả dòng bảng trái, kể cả không khớp (NULL)', 'Không có khác biệt', 'LEFT JOIN nhanh hơn'], correctIndex: 1, explanation: 'LEFT JOIN giữ hết dòng bên trái, điền NULL khi không khớp bên phải.' },
  { id: 'q2', question: 'HAVING khác WHERE ở điểm nào?', options: ['HAVING lọc dòng, WHERE lọc nhóm', 'HAVING lọc nhóm (sau GROUP BY), WHERE lọc dòng (trước GROUP BY)', 'Hai mệnh đề giống nhau hoàn toàn', 'HAVING chỉ dùng với JOIN'], correctIndex: 1, explanation: 'WHERE chạy trước khi nhóm; HAVING chạy sau, lọc trên kết quả nhóm.' },
  { id: 'q3', question: 'Subquery tương quan (correlated subquery) có đặc điểm gì?', options: ['Chạy một lần duy nhất', 'Được tính lại cho mỗi dòng của truy vấn ngoài', 'Không thể dùng với EXISTS', 'Luôn trả về nhiều bảng'], correctIndex: 1, explanation: 'Correlated subquery tham chiếu cột của truy vấn ngoài → tính lại từng dòng.' },
]);

const c7 = doc('dmd301-7-1-integrity-constraints', '7.1 — Data integrity, keys & constraints|||7.1 — Toàn vẹn dữ liệu, khoá & ràng buộc',
  'PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, DEFAULT; toàn vẹn thực thể vs toàn vẹn tham chiếu; ON DELETE CASCADE/SET NULL/RESTRICT; sơ lược transaction & ACID.',
  [[
    `<span class="eyebrow">DMD301 · Chapter 7 · Lesson 7.1</span>
<h2>Data integrity, keys &amp; constraints</h2>
<h3>Constraint types</h3>
<pre><code>CREATE TABLE order_item (
  order_id    INT NOT NULL,
  product_id  INT NOT NULL,
  quantity    INT CHECK (quantity &gt; 0),
  unit_price  DECIMAL(10,2) DEFAULT 0,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id)   REFERENCES orders(order_id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE RESTRICT
);
</code></pre>
<ul>
<li><strong>PRIMARY KEY</strong> — uniquely identifies each row; implies NOT NULL + UNIQUE.</li>
<li><strong>FOREIGN KEY</strong> — enforces that a value must exist in the referenced table (or be NULL).</li>
<li><strong>UNIQUE</strong> — no two rows may share this value (but NULL is allowed, unlike PK).</li>
<li><strong>NOT NULL</strong> — the column cannot be empty.</li>
<li><strong>CHECK</strong> — an arbitrary boolean rule the value must satisfy (e.g. <code>quantity &gt; 0</code>).</li>
<li><strong>DEFAULT</strong> — value used when none is supplied on insert.</li>
</ul>
<h3>Entity integrity vs referential integrity</h3>
<ul>
<li><strong>Entity integrity</strong> — every table has a primary key, and no primary key value is NULL.</li>
<li><strong>Referential integrity</strong> — every foreign key value either matches an existing primary key in the referenced table, or is NULL.</li>
</ul>
<h3>What happens on delete/update of a referenced row</h3>
<pre><code>ON DELETE CASCADE   -&gt; deleting the parent row deletes matching child rows too.
ON DELETE SET NULL  -&gt; deleting the parent sets the child's FK to NULL.
ON DELETE RESTRICT  -&gt; blocks the delete while matching child rows still exist.
</code></pre>
<h3>Transactions &amp; ACID (brief)</h3>
<p>A <strong>transaction</strong> groups statements that must all succeed or all fail together. <strong>ACID</strong>: <strong>A</strong>tomicity (all-or-nothing), <strong>C</strong>onsistency (never leaves data in an invalid state), <strong>I</strong>solation (concurrent transactions don't corrupt each other), <strong>D</strong>urability (once committed, survives a crash).</p>
<div class="callout"><span class="badge">Why it matters</span> Constraints are the DBMS enforcing your data-modeling decisions automatically — a bad INSERT that violates a rule fails immediately instead of silently corrupting the database.</div>`,
    `<span class="eyebrow">DMD301 · Chương 7 · Bài 7.1</span>
<h2>Toàn vẹn dữ liệu, khoá &amp; ràng buộc</h2>
<h3>Các loại ràng buộc</h3>
<pre><code>CREATE TABLE order_item (
  order_id    INT NOT NULL,
  product_id  INT NOT NULL,
  quantity    INT CHECK (quantity &gt; 0),
  unit_price  DECIMAL(10,2) DEFAULT 0,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id)   REFERENCES orders(order_id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE RESTRICT
);
</code></pre>
<ul>
<li><strong>PRIMARY KEY</strong> — xác định duy nhất mỗi dòng; ngầm định NOT NULL + UNIQUE.</li>
<li><strong>FOREIGN KEY</strong> — bắt buộc giá trị phải tồn tại ở bảng được tham chiếu (hoặc là NULL).</li>
<li><strong>UNIQUE</strong> — không hai dòng nào trùng giá trị này (nhưng cho phép NULL, khác PK).</li>
<li><strong>NOT NULL</strong> — cột không được để trống.</li>
<li><strong>CHECK</strong> — một quy tắc boolean tuỳ ý giá trị phải thoả (vd <code>quantity &gt; 0</code>).</li>
<li><strong>DEFAULT</strong> — giá trị dùng khi không truyền lúc thêm dòng.</li>
</ul>
<h3>Toàn vẹn thực thể vs toàn vẹn tham chiếu</h3>
<ul>
<li><strong>Toàn vẹn thực thể</strong> — mọi bảng có khoá chính, và không giá trị khoá chính nào là NULL.</li>
<li><strong>Toàn vẹn tham chiếu</strong> — mọi giá trị khoá ngoại phải khớp một khoá chính có thật ở bảng được tham chiếu, hoặc là NULL.</li>
</ul>
<h3>Điều gì xảy ra khi xoá/sửa dòng bị tham chiếu</h3>
<pre><code>ON DELETE CASCADE   -&gt; xoá dòng cha sẽ xoá luôn các dòng con khớp.
ON DELETE SET NULL  -&gt; xoá dòng cha sẽ đặt FK của dòng con thành NULL.
ON DELETE RESTRICT  -&gt; chặn việc xoá khi vẫn còn dòng con khớp.
</code></pre>
<h3>Transaction &amp; ACID (sơ lược)</h3>
<p>Một <strong>transaction</strong> nhóm các câu lệnh phải cùng thành công hoặc cùng thất bại. <strong>ACID</strong>: <strong>A</strong>tomicity (tất-cả-hoặc-không-gì), <strong>C</strong>onsistency (không để dữ liệu ở trạng thái không hợp lệ), <strong>I</strong>solation (các transaction đồng thời không làm hỏng nhau), <strong>D</strong>urability (đã commit thì tồn tại được kể cả khi sập hệ thống).</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Ràng buộc là cách DBMS tự động thực thi quyết định mô hình hoá của bạn — một câu INSERT sai quy tắc sẽ thất bại ngay, thay vì làm hỏng dữ liệu một cách âm thầm.</div>`,
  ]]);

const c7q = quiz('dmd301-quiz-7', 'Quiz 7 — Integrity & constraints|||Quiz 7 — Toàn vẹn & ràng buộc', [
  { id: 'q1', question: 'Ràng buộc nào bắt buộc giá trị phải tồn tại ở bảng khác (hoặc NULL)?', options: ['UNIQUE', 'CHECK', 'FOREIGN KEY', 'DEFAULT'], correctIndex: 2, explanation: 'FOREIGN KEY thực thi toàn vẹn tham chiếu tới bảng khác.' },
  { id: 'q2', question: '"Không giá trị khoá chính nào là NULL" là nội dung của?', options: ['Toàn vẹn tham chiếu', 'Toàn vẹn thực thể', 'Chuẩn hoá', 'Transaction'], correctIndex: 1, explanation: 'Entity integrity: mọi bảng có PK, PK không NULL.' },
  { id: 'q3', question: 'ON DELETE CASCADE làm gì?', options: ['Chặn việc xoá dòng cha', 'Xoá dòng cha kéo theo xoá dòng con liên quan', 'Đặt FK con thành NULL', 'Không cho phép FK'], correctIndex: 1, explanation: 'CASCADE lan truyền việc xoá xuống các dòng con tham chiếu.' },
]);

const c8 = doc('dmd301-8-1-warehouse-nosql', '8.1 — Data warehousing & NoSQL|||8.1 — Kho dữ liệu & NoSQL',
  'OLTP vs OLAP; kho dữ liệu, mô hình sao (fact/dimension), ETL; các loại NoSQL (document, key-value, column-family, graph); khi nào chọn quan hệ vs NoSQL.',
  [[
    `<span class="eyebrow">DMD301 · Chapter 8 · Lesson 8.1</span>
<h2>Data warehousing &amp; NoSQL</h2>
<h3>OLTP vs OLAP</h3>
<ul>
<li><strong>OLTP</strong> (Online Transaction Processing) — the day-to-day relational database: many small reads/writes (place an order, update a profile). Normalized to keep writes cheap and consistent.</li>
<li><strong>OLAP</strong> (Online Analytical Processing) — built for big, read-heavy analytical queries ("total revenue by region by month"). Denormalized on purpose for fast aggregation.</li>
</ul>
<h3>Data warehouse &amp; the star schema</h3>
<pre><code>            DIM_CUSTOMER
                 |
DIM_DATE  --  FACT_SALES  --  DIM_PRODUCT
                 |
            DIM_STORE
</code></pre>
<p>A <strong>fact table</strong> (FACT_SALES) holds measurable events (quantity, revenue) plus FKs to <strong>dimension tables</strong> (who, what, when, where) that hold descriptive attributes. This "star" shape makes slicing data by any dimension fast and intuitive.</p>
<h3>ETL</h3>
<p><strong>Extract, Transform, Load</strong> — the pipeline that periodically pulls data out of OLTP systems, cleans/reshapes it, and loads it into the warehouse for reporting, without slowing down the live application.</p>
<h3>NoSQL — beyond tables</h3>
<ul>
<li><strong>Document</strong> (e.g. <strong>MongoDB</strong>) — stores flexible JSON-like documents; great for evolving, nested data.</li>
<li><strong>Key-value</strong> (e.g. <strong>Redis</strong>) — simplest model, extremely fast lookups by key; great for caching/sessions.</li>
<li><strong>Column-family</strong> (e.g. <strong>Cassandra</strong>) — optimized for huge write volumes across many machines.</li>
<li><strong>Graph</strong> (e.g. <strong>Neo4j</strong>) — nodes &amp; edges; great for highly connected data (social networks, recommendations).</li>
</ul>
<h3>When to choose which</h3>
<p>Choose a <strong>relational DB</strong> when data has a clear structure and relationships that must stay consistent (money, inventory, enrollment). Reach for <strong>NoSQL</strong> when the schema changes often, the scale is extreme, or the data's natural shape (a document, a graph) doesn't map cleanly to tables.</p>
<div class="callout"><span class="badge">Big picture</span> Everything in Chapters 1–7 — ER modeling, normalization, SQL, constraints — is the foundation. Warehousing and NoSQL are what you reach for once that foundation isn't the right tool for a specific job (reporting at scale, or flexible/huge data).</div>`,
    `<span class="eyebrow">DMD301 · Chương 8 · Bài 8.1</span>
<h2>Kho dữ liệu &amp; NoSQL</h2>
<h3>OLTP vs OLAP</h3>
<ul>
<li><strong>OLTP</strong> (xử lý giao dịch trực tuyến) — CSDL quan hệ dùng hàng ngày: nhiều lượt đọc/ghi nhỏ (đặt đơn hàng, sửa hồ sơ). Được chuẩn hoá để ghi rẻ và nhất quán.</li>
<li><strong>OLAP</strong> (xử lý phân tích trực tuyến) — dựng cho truy vấn phân tích lớn, nặng về đọc ("tổng doanh thu theo vùng theo tháng"). Phi chuẩn hoá có chủ đích để tổng hợp nhanh.</li>
</ul>
<h3>Kho dữ liệu &amp; mô hình sao (star schema)</h3>
<pre><code>            DIM_CUSTOMER
                 |
DIM_DATE  --  FACT_SALES  --  DIM_PRODUCT
                 |
            DIM_STORE
</code></pre>
<p>Một <strong>bảng sự kiện (fact table)</strong> (FACT_SALES) chứa các số đo được (số lượng, doanh thu) cộng FK tới các <strong>bảng chiều (dimension table)</strong> (ai, cái gì, khi nào, ở đâu) chứa thuộc tính mô tả. Hình "sao" này giúp cắt lát dữ liệu theo bất kỳ chiều nào nhanh và dễ hiểu.</p>
<h3>ETL</h3>
<p><strong>Trích xuất, Biến đổi, Nạp (Extract, Transform, Load)</strong> — quy trình định kỳ lấy dữ liệu từ hệ OLTP, làm sạch/tái cấu trúc, rồi nạp vào kho để phục vụ báo cáo, không làm chậm ứng dụng đang chạy.</p>
<h3>NoSQL — vượt ra ngoài bảng</h3>
<ul>
<li><strong>Document</strong> (vd <strong>MongoDB</strong>) — lưu tài liệu dạng JSON linh hoạt; phù hợp dữ liệu lồng nhau, hay thay đổi cấu trúc.</li>
<li><strong>Key-value</strong> (vd <strong>Redis</strong>) — mô hình đơn giản nhất, tra cứu theo khoá cực nhanh; phù hợp cache/session.</li>
<li><strong>Column-family</strong> (vd <strong>Cassandra</strong>) — tối ưu cho khối lượng ghi cực lớn trải trên nhiều máy.</li>
<li><strong>Graph</strong> (vd <strong>Neo4j</strong>) — nút &amp; cạnh; phù hợp dữ liệu liên kết chặt (mạng xã hội, gợi ý).</li>
</ul>
<h3>Khi nào chọn cái gì</h3>
<p>Chọn <strong>CSDL quan hệ</strong> khi dữ liệu có cấu trúc rõ và mối quan hệ cần luôn nhất quán (tiền, kho hàng, đăng ký học). Chọn <strong>NoSQL</strong> khi schema thay đổi thường xuyên, quy mô cực lớn, hoặc hình dạng tự nhiên của dữ liệu (một tài liệu, một đồ thị) không ánh xạ gọn vào bảng.</p>
<div class="callout"><span class="badge">Nhìn tổng thể</span> Mọi thứ ở Chương 1–7 — mô hình ER, chuẩn hoá, SQL, ràng buộc — là nền tảng. Kho dữ liệu và NoSQL là thứ dùng đến khi nền tảng đó không còn là công cụ đúng cho một việc cụ thể (báo cáo ở quy mô lớn, hoặc dữ liệu linh hoạt/khổng lồ).</div>`,
  ]]);

const c8q = quiz('dmd301-quiz-8', 'Quiz 8 — Warehousing & NoSQL|||Quiz 8 — Kho dữ liệu & NoSQL', [
  { id: 'q1', question: 'OLAP khác OLTP ở điểm nào?', options: ['OLAP dùng cho giao dịch nhỏ hàng ngày', 'OLAP tối ưu cho truy vấn phân tích lớn, nặng đọc', 'OLTP luôn phi chuẩn hoá', 'Không có khác biệt'], correctIndex: 1, explanation: 'OLAP phục vụ phân tích/báo cáo lớn; OLTP phục vụ giao dịch nhỏ hàng ngày.' },
  { id: 'q2', question: 'Trong mô hình sao (star schema), bảng chứa số đo (doanh thu, số lượng) gọi là?', options: ['Dimension table', 'Fact table', 'Junction table', 'Lookup table'], correctIndex: 1, explanation: 'Fact table chứa số đo + FK tới các dimension table.' },
  { id: 'q3', question: 'MongoDB thuộc loại NoSQL nào?', options: ['Key-value', 'Document', 'Column-family', 'Graph'], correctIndex: 1, explanation: 'MongoDB lưu dữ liệu dạng document JSON linh hoạt.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'DMD301',
    slug: 'dmd301-data-modeling-and-databases',
    title: 'Data Modeling and Databases',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DMD301.webp',
    shortDescription: 'How to model & manage data — ER diagrams, the relational model, normalization (1NF-BCNF), SQL (DDL/DML, joins, subqueries), integrity constraints, and an intro to data warehousing & NoSQL. Bilingual, with ERD/SQL examples & quizzes.|||Cách mô hình hoá & quản lý dữ liệu — sơ đồ ER, mô hình quan hệ, chuẩn hoá (1NF-BCNF), SQL (DDL/DML, join, subquery), ràng buộc toàn vẹn, và nhập môn kho dữ liệu & NoSQL. Song ngữ, có ví dụ ERD/SQL & quiz.',
    description: 'Môn <strong>DMD301 — Data Modeling and Databases</strong> (kỳ 4) dạy cách <strong>thiết kế &amp; truy vấn cơ sở dữ liệu quan hệ</strong>. Từ <strong>CSDL &amp; DBMS</strong> → <strong>mô hình thực thể-liên kết (ERD)</strong> → <strong>mô hình quan hệ &amp; chuyển ER sang bảng</strong> → <strong>chuẩn hoá</strong> (1NF-3NF, BCNF) → <strong>SQL cơ bản</strong> (DDL/DML) → <strong>SQL nâng cao</strong> (join, GROUP BY, subquery) → <strong>toàn vẹn dữ liệu &amp; ràng buộc</strong> → <strong>kho dữ liệu &amp; NoSQL</strong>. Bám giáo trình Elmasri/Navathe, Silberschatz, Hoberman, song ngữ, nhiều ví dụ ERD/SQL, quiz mỗi chương.',
    whatYouLearn: 'CSDL vs DBMS, kiến trúc 3 lớp; sơ đồ ER (thực thể, thuộc tính, lực lượng liên kết 1:1/1:N/M:N, thực thể yếu); mô hình quan hệ & thuật toán chuyển ER→bảng; chuẩn hoá 1NF-3NF/BCNF & dị thường dữ liệu; SQL DDL (CREATE/ALTER/DROP) & DML (INSERT/UPDATE/DELETE/SELECT); JOIN, GROUP BY/HAVING, subquery, UNION; khoá & ràng buộc (PK/FK/UNIQUE/CHECK), toàn vẹn tham chiếu, ACID; OLTP vs OLAP, star schema, ETL, các loại NoSQL (document/key-value/column-family/graph).',
    requirements: 'Không cần biết SQL trước. Nên cài một công cụ CSDL (PostgreSQL/MySQL) hoặc dùng công cụ trực tuyến (DB Fiddle) để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách (Elmasri/Navathe, Silberschatz, Hoberman), tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao cần mô hình hoá dữ liệu, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — CSDL & DBMS|||Chapter 1 — Databases & DBMS', description: 'Database vs DBMS, kiến trúc 3 lớp, vai trò DBA.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mô hình ER|||Chapter 2 — ER model', description: 'Thực thể, thuộc tính, quan hệ, lực lượng liên kết.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mô hình quan hệ & chuyển đổi|||Chapter 3 — Relational mapping', description: 'Khoá, thuật toán chuyển ER sang bảng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Chuẩn hoá|||Chapter 4 — Normalization', description: '1NF-3NF, BCNF, dị thường dữ liệu.', lessons: [c4, c4q] },
    { title: 'Chương 5 — SQL cơ bản|||Chapter 5 — Basic SQL', description: 'DDL, DML, SELECT cơ bản.', lessons: [c5, c5q] },
    { title: 'Chương 6 — SQL nâng cao|||Chapter 6 — Advanced SQL', description: 'JOIN, GROUP BY, subquery.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Toàn vẹn & ràng buộc|||Chapter 7 — Integrity & constraints', description: 'Khoá, ràng buộc, toàn vẹn tham chiếu, ACID.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Kho dữ liệu & NoSQL|||Chapter 8 — Warehousing & NoSQL', description: 'OLTP/OLAP, star schema, ETL, NoSQL.', lessons: [c8, c8q] },
  ],
};
