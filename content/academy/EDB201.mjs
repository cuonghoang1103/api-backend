/**
 * EDB201 — Database Application. Giáo trình FLM (khối Quản trị Kinh doanh,
 * kỳ 3): Elmasri/Navathe "Fundamentals of Database Systems"; Microsoft SQL
 * Server & MySQL docs; "SQL in 10 Minutes" (Forta). ERD → SQL SELECT/JOIN →
 * INSERT/UPDATE/DELETE & transaction → view/procedure/function → kết nối
 * ứng dụng (form/report) → bảo mật & sao lưu → xây app bán hàng/kho hoàn
 * chỉnh. Song ngữ + ví dụ SQL + bài tập. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; escape &lt;/&gt; trong SQL so sánh.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('edb201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (Elmasri/Navathe), tài liệu chính thức SQL Server/MySQL, sách SQL in 10 Minutes, công cụ thực hành online, lộ trình tự học.',
  [[
    `<span class="eyebrow">EDB201 · Materials</span>
<h2>Database Application — resource hub</h2>
<p class="lead">Everything to learn Database Application — ERD design, SQL querying &amp; data manipulation, views/procedures/functions, connecting a database to an app, security &amp; backup — in one place. The official FPTU slides live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for EDB201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Ramez Elmasri &amp; Shamkant Navathe — <em>Fundamentals of Database Systems</em> (ERD, relational model, normalization, SQL).</li>
<li>Ben Forta — <em>SQL in 10 Minutes, Sams Teach Yourself</em> (fast, practical SQL by example).</li>
</ul>
<h3>🌐 Official documentation</h3>
<ul>
<li><a href="https://learn.microsoft.com/en-us/sql/t-sql/language-reference" target="_blank" rel="noopener">Microsoft SQL Server — Transact-SQL reference</a></li>
<li><a href="https://dev.mysql.com/doc/refman/8.0/en/" target="_blank" rel="noopener">MySQL 8.0 Reference Manual</a></li>
<li><a href="https://www.postgresql.org/docs/current/tutorial.html" target="_blank" rel="noopener">PostgreSQL Tutorial (official docs)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp.org</a> — full SQL &amp; database courses</li>
<li><a href="https://www.youtube.com/@ProgrammingwithMosh" target="_blank" rel="noopener">Programming with Mosh</a> — SQL fundamentals &amp; database design</li>
</ul>
<h3>🛠️ Tools (thực hành ngay trên trình duyệt)</h3>
<ul>
<li><a href="https://www.db-fiddle.com/" target="_blank" rel="noopener">DB Fiddle</a> — chạy SQL trực tiếp (MySQL/PostgreSQL/SQL Server), không cần cài đặt.</li>
<li><a href="https://sqlzoo.net/" target="_blank" rel="noopener">SQLZoo</a> — luyện SELECT/JOIN theo bài có chấm điểm ngay.</li>
<li><a href="https://dbdiagram.io/" target="_blank" rel="noopener">dbdiagram.io</a> — vẽ ERD nhanh, xuất ra SQL tạo bảng.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — ERD (thực thể, quan hệ, khóa chính/ngoại), SELECT/WHERE/JOIN, INSERT/UPDATE/DELETE.</li>
<li><strong>Practice</strong> — viết lại mọi ví dụ SQL trong bài trên DB Fiddle, đổi số liệu để chắc mình hiểu, không chỉ chép.</li>
<li><strong>Go deeper</strong> — view, stored procedure/function, transaction, phân quyền GRANT/REVOKE, backup/restore.</li>
<li><strong>Job-ready</strong> — tự thiết kế và cài đặt một CSDL ứng dụng nhỏ (bán hàng/kho) từ ERD đến truy vấn báo cáo.</li>
</ol></div>`,
    `<span class="eyebrow">EDB201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Ứng dụng cơ sở dữ liệu — thiết kế ERD, SQL truy vấn &amp; thao tác dữ liệu, view/procedure/function, kết nối CSDL với ứng dụng, bảo mật &amp; sao lưu — gom về một chỗ. Slide chính thức FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của EDB201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Ramez Elmasri &amp; Shamkant Navathe — <em>Fundamentals of Database Systems</em> (ERD, mô hình quan hệ, chuẩn hoá, SQL).</li>
<li>Ben Forta — <em>SQL in 10 Minutes, Sams Teach Yourself</em> (SQL nhanh, thực tế, qua ví dụ).</li>
</ul>
<h3>🌐 Tài liệu chính thức</h3>
<ul>
<li><a href="https://learn.microsoft.com/en-us/sql/t-sql/language-reference" target="_blank" rel="noopener">Microsoft SQL Server — tham chiếu Transact-SQL</a></li>
<li><a href="https://dev.mysql.com/doc/refman/8.0/en/" target="_blank" rel="noopener">MySQL 8.0 Reference Manual</a></li>
<li><a href="https://www.postgresql.org/docs/current/tutorial.html" target="_blank" rel="noopener">PostgreSQL Tutorial (tài liệu chính thức)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp.org</a> — khoá SQL &amp; CSDL đầy đủ</li>
<li><a href="https://www.youtube.com/@ProgrammingwithMosh" target="_blank" rel="noopener">Programming with Mosh</a> — nền tảng SQL &amp; thiết kế CSDL</li>
</ul>
<h3>🛠️ Công cụ (thực hành ngay trên trình duyệt)</h3>
<ul>
<li><a href="https://www.db-fiddle.com/" target="_blank" rel="noopener">DB Fiddle</a> — chạy SQL trực tiếp (MySQL/PostgreSQL/SQL Server), không cần cài đặt.</li>
<li><a href="https://sqlzoo.net/" target="_blank" rel="noopener">SQLZoo</a> — luyện SELECT/JOIN theo bài, chấm điểm ngay.</li>
<li><a href="https://dbdiagram.io/" target="_blank" rel="noopener">dbdiagram.io</a> — vẽ ERD nhanh, xuất ra SQL tạo bảng.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — ERD (thực thể, quan hệ, khóa chính/ngoại), SELECT/WHERE/JOIN, INSERT/UPDATE/DELETE.</li>
<li><strong>Luyện tập</strong> — chạy lại mọi ví dụ SQL trong bài trên DB Fiddle, đổi số liệu để chắc mình hiểu, không chỉ chép.</li>
<li><strong>Đào sâu</strong> — view, stored procedure/function, transaction, phân quyền GRANT/REVOKE, backup/restore.</li>
<li><strong>Sẵn sàng đi làm</strong> — tự thiết kế và cài một CSDL ứng dụng nhỏ (bán hàng/kho) từ ERD đến truy vấn báo cáo.</li>
</ol></div>`,
  ]]);

const intro = doc('edb201-0-1-overview', 'Course overview: Database Application|||Tổng quan: Ứng dụng cơ sở dữ liệu',
  'Vì sao mọi ứng dụng doanh nghiệp cần CSDL; lộ trình 8 chương: tổng quan → ERD → SQL truy vấn → SQL thao tác dữ liệu → view/procedure/function → kết nối ứng dụng → bảo mật/sao lưu → xây app hoàn chỉnh.',
  [[
    `<span class="eyebrow">EDB201 · Lesson 0.1 · Overview</span>
<h2>Database Application</h2>
<p class="lead">This course is about the database <strong>underneath every business application</strong> — the sales system, the inventory tracker, the HR portal. You will design a small database from a real business need, write the SQL that powers it, and connect it to a working application layer (forms and reports).</p>
<h3>Why this matters</h3>
<p>Every enterprise app — no matter the framework on top — ends up doing the same four things to a database: <strong>store</strong>, <strong>query</strong>, <strong>update</strong>, and <strong>protect</strong> data. Get these wrong and the app is slow, wrong, or unsafe no matter how good the UI looks.</p>
<h3>Roadmap</h3>
<p>Overview of enterprise DB apps → ERD design → SQL querying (SELECT/WHERE/JOIN) → SQL data manipulation (INSERT/UPDATE/DELETE, transactions) → views, stored procedures &amp; functions → connecting the database to an app (forms/reports) → security, backup &amp; permissions → building a complete sales/inventory application. Bilingual, with runnable SQL examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">EDB201 · Bài 0.1 · Tổng quan</span>
<h2>Ứng dụng cơ sở dữ liệu</h2>
<p class="lead">Môn này nói về cái CSDL <strong>nằm bên dưới mọi ứng dụng doanh nghiệp</strong> — hệ thống bán hàng, phần mềm quản lý kho, cổng nhân sự. Bạn sẽ thiết kế một CSDL nhỏ từ một nhu cầu thực tế, viết SQL vận hành nó, và nối nó với một lớp ứng dụng thật (form và report).</p>
<h3>Vì sao quan trọng</h3>
<p>Mọi ứng dụng doanh nghiệp — bất kể dùng công nghệ gì ở trên — đều làm bốn việc giống nhau với CSDL: <strong>lưu trữ</strong>, <strong>truy vấn</strong>, <strong>cập nhật</strong>, và <strong>bảo vệ</strong> dữ liệu. Sai một trong bốn thì ứng dụng chậm, sai, hoặc mất an toàn, cho dù giao diện đẹp đến đâu.</p>
<h3>Lộ trình</h3>
<p>Tổng quan CSDL ứng dụng doanh nghiệp → thiết kế ERD → SQL truy vấn (SELECT/WHERE/JOIN) → SQL thao tác dữ liệu (INSERT/UPDATE/DELETE, transaction) → view, stored procedure &amp; function → kết nối CSDL với ứng dụng (form/report) → bảo mật, sao lưu &amp; phân quyền → xây dựng ứng dụng quản lý bán hàng/kho hoàn chỉnh. Song ngữ, có ví dụ SQL chạy được và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('edb201-1-1-overview-enterprise', '1.1 — Database applications in the enterprise|||1.1 — CSDL ứng dụng trong doanh nghiệp',
  '3-tier architecture (CSDL — business logic — UI); vai trò DBA vs. developer; ví dụ ứng dụng CSDL điển hình (bán hàng, kho, nhân sự).',
  [[
    `<span class="eyebrow">EDB201 · Chapter 1 · Lesson 1.1</span>
<h2>Database applications in the enterprise</h2>
<h3>What is a "database application"?</h3>
<p>A <strong>database application</strong> is software built <em>on top of</em> a database to let non-technical users do useful work without writing SQL — enter a sale, check stock, print a payroll report. The database is the shared, durable source of truth; the application is the door people walk through to reach it.</p>
<h3>The 3-tier picture</h3>
<pre><code>[ UI / Presentation ]   forms, reports, dashboards, mobile screens
        |
[ Business Logic ]      validation rules, calculations, workflow
        |
[ Database ]            tables, constraints, stored procedures
</code></pre>
<p>Each tier can change without breaking the others: redesign the UI, and the tables underneath are untouched; add a validation rule, and the screens don't need to know how it's enforced.</p>
<h3>Who does what</h3>
<ul>
<li><strong>Database Administrator (DBA)</strong> — designs and tunes the schema, manages backups, security, and performance.</li>
<li><strong>Application developer</strong> — writes the business logic and UI, and the SQL queries the application needs.</li>
<li>In a small company, one person often wears both hats — which is exactly why this course covers design, SQL, and connecting to an app.</li>
</ul>
<h3>Typical enterprise database applications</h3>
<ul>
<li><strong>Sales / POS system</strong> — products, orders, customers, invoices.</li>
<li><strong>Inventory management</strong> — stock levels, suppliers, purchase orders.</li>
<li><strong>HR / payroll</strong> — employees, departments, salaries, attendance.</li>
<li><strong>Library management</strong> — books, members, loans, due dates.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> The database doesn't just "store data" — it enforces the rules that keep the business correct (no order without a customer, no negative stock) even when several apps or users touch it at once.</div>`,
    `<span class="eyebrow">EDB201 · Chương 1 · Bài 1.1</span>
<h2>CSDL ứng dụng trong doanh nghiệp</h2>
<h3>"Ứng dụng CSDL" là gì?</h3>
<p>Một <strong>ứng dụng CSDL</strong> là phần mềm được xây <em>trên</em> một CSDL để người không biết SQL vẫn làm được việc hữu ích — nhập một đơn bán, kiểm tồn kho, in báo cáo lương. CSDL là nguồn sự thật chung, bền vững; ứng dụng là cánh cửa để người dùng chạm tới nó.</p>
<h3>Bức tranh 3 lớp</h3>
<pre><code>[ Giao diện ]        form, report, dashboard, màn hình mobile
      |
[ Xử lý nghiệp vụ ]  quy tắc kiểm tra, tính toán, luồng xử lý
      |
[ CSDL ]             bảng, ràng buộc, stored procedure
</code></pre>
<p>Mỗi lớp đổi mà không phá lớp khác: thiết kế lại giao diện, bảng bên dưới không đụng tới; thêm một quy tắc kiểm tra, màn hình không cần biết nó được thực thi ở đâu.</p>
<h3>Ai làm gì</h3>
<ul>
<li><strong>DBA (quản trị CSDL)</strong> — thiết kế &amp; tối ưu schema, quản lý sao lưu, bảo mật, hiệu năng.</li>
<li><strong>Developer ứng dụng</strong> — viết xử lý nghiệp vụ và giao diện, cùng các câu SQL ứng dụng cần.</li>
<li>Ở công ty nhỏ, một người thường làm cả hai vai — đúng lý do môn này gồm cả thiết kế, SQL, và kết nối ứng dụng.</li>
</ul>
<h3>Ứng dụng CSDL doanh nghiệp điển hình</h3>
<ul>
<li><strong>Bán hàng / POS</strong> — sản phẩm, đơn hàng, khách hàng, hoá đơn.</li>
<li><strong>Quản lý kho</strong> — mức tồn, nhà cung cấp, đơn nhập hàng.</li>
<li><strong>Nhân sự / lương</strong> — nhân viên, phòng ban, lương, chấm công.</li>
<li><strong>Quản lý thư viện</strong> — sách, thành viên, phiếu mượn, hạn trả.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> CSDL không chỉ "lưu dữ liệu" — nó giữ đúng các quy tắc nghiệp vụ (không đơn hàng nếu chưa có khách, không tồn kho âm) dù nhiều ứng dụng hay người dùng cùng chạm vào một lúc.</div>`,
  ]]);

const c1q = quiz('edb201-quiz-1', 'Quiz 1 — Overview|||Quiz 1 — Tổng quan', [
  { id: 'q1', question: 'Kiến trúc 3 lớp của ứng dụng CSDL gồm những lớp nào?', options: ['CSDL — xử lý nghiệp vụ — giao diện', 'CSDL — mạng — phần cứng', 'Giao diện — hệ điều hành — CSDL', 'Backup — restore — CSDL'], correctIndex: 0, explanation: 'Ba lớp: CSDL (dữ liệu) → xử lý nghiệp vụ (business logic) → giao diện (UI).' },
  { id: 'q2', question: 'Vai trò chính của CSDL trong một ứng dụng doanh nghiệp là gì?', options: ['Chỉ hiển thị dữ liệu đẹp', 'Lưu trữ & giữ đúng các quy tắc nghiệp vụ dù nhiều người cùng dùng', 'Thay thế hoàn toàn giao diện', 'Chỉ dùng để in báo cáo'], correctIndex: 1, explanation: 'CSDL là nguồn sự thật chung, thi hành ràng buộc/quy tắc nghiệp vụ cho nhiều người dùng đồng thời.' },
  { id: 'q3', question: 'Đâu là một ví dụ ứng dụng CSDL doanh nghiệp điển hình?', options: ['Trình soạn văn bản offline', 'Hệ thống quản lý bán hàng/kho', 'Máy tính bỏ túi', 'Trò chơi không lưu tiến độ'], correctIndex: 1, explanation: 'Hệ thống bán hàng/kho là ứng dụng CSDL kinh điển: sản phẩm, đơn hàng, tồn kho đều cần lưu và truy vấn liên tục.' },
]);

const c2 = doc('edb201-2-1-erd-design', '2.1 — Database design & ERD for applications|||2.1 — Thiết kế CSDL & ERD cho ứng dụng',
  'Entity-Relationship Diagram: thực thể, thuộc tính, quan hệ, cardinality (1-1/1-n/n-n); ánh xạ ERD sang bảng; chuẩn hoá cơ bản (1NF/2NF/3NF); khóa chính/khóa ngoại.',
  [[
    `<span class="eyebrow">EDB201 · Chapter 2 · Lesson 2.1</span>
<h2>Database design &amp; ERD for applications</h2>
<h3>From requirements to a diagram</h3>
<p>Before any SQL is written, a database application starts from a picture: the <strong>Entity-Relationship Diagram (ERD)</strong>. It captures three things — <strong>entities</strong> (things we track: Customer, Product, Order), their <strong>attributes</strong> (properties: name, price, orderDate), and <strong>relationships</strong> between entities.</p>
<h3>Cardinality — how entities relate</h3>
<ul>
<li><strong>1-1</strong> — one Employee has one Contract (rare, used for optional detail tables).</li>
<li><strong>1-N</strong> — one Customer places many Orders; one Order belongs to one Customer.</li>
<li><strong>N-N</strong> — many Orders contain many Products, and one Product appears on many Orders — resolved with a <strong>junction table</strong> (e.g. OrderDetail).</li>
</ul>
<h3>Mapping ERD to tables</h3>
<pre><code>Customer (CustomerID PK, Name, Phone)
Order    (OrderID PK, OrderDate, CustomerID FK -&gt; Customer.CustomerID)
Product  (ProductID PK, Name, Price)
OrderDetail (OrderID FK, ProductID FK, Quantity, UnitPrice,
             PRIMARY KEY (OrderID, ProductID))
</code></pre>
<p>Every 1-N relationship becomes a <strong>foreign key (FK)</strong> on the "many" side pointing back to the <strong>primary key (PK)</strong> of the "one" side. Every N-N relationship becomes its own junction table holding both foreign keys.</p>
<h3>Normalization, briefly</h3>
<ul>
<li><strong>1NF</strong> — each column holds one atomic value (no comma-separated lists in a cell).</li>
<li><strong>2NF</strong> — every non-key column depends on the whole primary key, not part of it.</li>
<li><strong>3NF</strong> — every non-key column depends only on the key, not on another non-key column.</li>
</ul>
<div class="callout"><span class="badge">Why bother</span> A well-normalized design avoids storing the same fact twice — so updating a customer's phone number never means "did I remember to fix it in every table?"</div>`,
    `<span class="eyebrow">EDB201 · Chương 2 · Bài 2.1</span>
<h2>Thiết kế CSDL &amp; ERD cho ứng dụng</h2>
<h3>Từ yêu cầu đến sơ đồ</h3>
<p>Trước khi viết bất kỳ dòng SQL nào, một ứng dụng CSDL bắt đầu từ một bức tranh: <strong>ERD (Entity-Relationship Diagram)</strong>. Nó nắm ba thứ — <strong>thực thể</strong> (đối tượng cần theo dõi: Khách hàng, Sản phẩm, Đơn hàng), <strong>thuộc tính</strong> của chúng (tên, giá, ngày đặt), và <strong>quan hệ</strong> giữa các thực thể.</p>
<h3>Cardinality — thực thể liên hệ ra sao</h3>
<ul>
<li><strong>1-1</strong> — một Nhân viên có một Hợp đồng (hiếm, dùng cho bảng chi tiết tuỳ chọn).</li>
<li><strong>1-N</strong> — một Khách hàng có nhiều Đơn hàng; một Đơn hàng thuộc một Khách hàng.</li>
<li><strong>N-N</strong> — nhiều Đơn hàng chứa nhiều Sản phẩm, một Sản phẩm xuất hiện ở nhiều Đơn hàng — giải quyết bằng <strong>bảng trung gian</strong> (vd OrderDetail).</li>
</ul>
<h3>Ánh xạ ERD sang bảng</h3>
<pre><code>Customer (CustomerID PK, Name, Phone)
Order    (OrderID PK, OrderDate, CustomerID FK -&gt; Customer.CustomerID)
Product  (ProductID PK, Name, Price)
OrderDetail (OrderID FK, ProductID FK, Quantity, UnitPrice,
             PRIMARY KEY (OrderID, ProductID))
</code></pre>
<p>Mỗi quan hệ 1-N trở thành một <strong>khóa ngoại (FK)</strong> ở phía "nhiều", trỏ về <strong>khóa chính (PK)</strong> của phía "một". Mỗi quan hệ N-N trở thành một bảng trung gian riêng, chứa cả hai khóa ngoại.</p>
<h3>Chuẩn hoá, ngắn gọn</h3>
<ul>
<li><strong>1NF</strong> — mỗi cột chứa một giá trị nguyên tố (không nhồi danh sách ngăn dấu phẩy vào một ô).</li>
<li><strong>2NF</strong> — mọi cột không-khóa phụ thuộc vào TOÀN BỘ khóa chính, không phải một phần.</li>
<li><strong>3NF</strong> — mọi cột không-khóa chỉ phụ thuộc vào khóa, không phụ thuộc vào cột không-khóa khác.</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Thiết kế chuẩn hoá tốt tránh lưu một sự thật hai lần — nên khi sửa số điện thoại khách hàng, không phải lo "mình có sửa hết ở mọi bảng chưa?".</div>`,
  ]]);

const c2q = quiz('edb201-quiz-2', 'Quiz 2 — ERD & design|||Quiz 2 — ERD & thiết kế', [
  { id: 'q1', question: 'ERD (Entity-Relationship Diagram) dùng để làm gì?', options: ['Viết báo cáo tài chính', 'Mô hình hoá thực thể & quan hệ trước khi tạo bảng', 'Thay thế cho SQL', 'Chỉ dùng để vẽ giao diện'], correctIndex: 1, explanation: 'ERD ghi lại thực thể, thuộc tính và quan hệ — bước thiết kế trước khi tạo bảng thật.' },
  { id: 'q2', question: 'Quan hệ N-N giữa Đơn hàng và Sản phẩm được cài đặt bằng cách nào?', options: ['Thêm cột danh sách sản phẩm vào bảng Order', 'Dùng một bảng trung gian chứa khóa ngoại của cả hai bảng', 'Xoá bảng Product', 'Gộp Order và Product thành một bảng'], correctIndex: 1, explanation: 'Bảng trung gian (vd OrderDetail) chứa OrderID và ProductID, giải quyết quan hệ nhiều-nhiều.' },
  { id: 'q3', question: 'Chuẩn hoá (normalization) nhằm mục đích chính gì?', options: ['Làm bảng có nhiều cột hơn', 'Giảm dư thừa dữ liệu, tránh bất thường khi cập nhật', 'Tăng tốc độ nhập liệu', 'Xoá hết khóa ngoại'], correctIndex: 1, explanation: 'Chuẩn hoá giảm lưu trùng một sự thật ở nhiều nơi, tránh dữ liệu lệch nhau khi cập nhật.' },
]);

const c3 = doc('edb201-3-1-sql-select-join', '3.1 — SQL querying: SELECT, WHERE, JOIN|||3.1 — SQL truy vấn: SELECT, WHERE, JOIN',
  'SELECT/FROM/WHERE/ORDER BY; toán tử so sánh & logic, LIKE/IN/BETWEEN; các loại JOIN (INNER/LEFT/RIGHT); hàm tổng hợp & GROUP BY/HAVING.',
  [[
    `<span class="eyebrow">EDB201 · Chapter 3 · Lesson 3.1</span>
<h2>SQL querying: SELECT, WHERE, JOIN</h2>
<h3>The basic shape</h3>
<pre><code>SELECT column1, column2
FROM   table_name
WHERE  condition
ORDER BY column1;
</code></pre>
<p><strong>SELECT</strong> picks columns, <strong>FROM</strong> picks the table, <strong>WHERE</strong> filters rows, <strong>ORDER BY</strong> sorts the result. Use <code>SELECT *</code> only while exploring — name columns explicitly in real application code.</p>
<h3>Filtering with WHERE</h3>
<pre><code>SELECT Name, Price FROM Product
WHERE Price &gt; 100000 AND Price &lt; 500000;

SELECT * FROM Customer WHERE Phone LIKE '090%';

SELECT * FROM Product WHERE CategoryID IN (1, 3, 5);

SELECT * FROM Order WHERE OrderDate BETWEEN '2026-01-01' AND '2026-01-31';
</code></pre>
<p>Comparison operators (<code>=</code>, <code>&lt;&gt;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>) combine with <code>AND</code>/<code>OR</code>/<code>NOT</code>. <code>LIKE</code> pattern-matches text (<code>%</code> = any characters), <code>IN</code> checks a list, <code>BETWEEN</code> checks a range.</p>
<h3>Joining tables</h3>
<pre><code>-- INNER JOIN: only rows that match in BOTH tables
SELECT o.OrderID, c.Name
FROM Order o
INNER JOIN Customer c ON o.CustomerID = c.CustomerID;

-- LEFT JOIN: all rows from the LEFT table, matched or not
SELECT c.Name, o.OrderID
FROM Customer c
LEFT JOIN Order o ON o.CustomerID = c.CustomerID;
</code></pre>
<p><strong>INNER JOIN</strong> keeps only rows with a match on both sides. <strong>LEFT JOIN</strong> keeps every row from the left table, filling unmatched right-side columns with <code>NULL</code> — useful for "customers who never ordered" reports.</p>
<h3>Aggregating with GROUP BY</h3>
<pre><code>SELECT CustomerID, COUNT(*) AS OrderCount, SUM(TotalAmount) AS Revenue
FROM Order
GROUP BY CustomerID
HAVING COUNT(*) &gt; 3;
</code></pre>
<p><code>COUNT</code>/<code>SUM</code>/<code>AVG</code>/<code>MIN</code>/<code>MAX</code> summarize groups of rows made by <code>GROUP BY</code>; <code>HAVING</code> filters those groups (while <code>WHERE</code> filters rows <em>before</em> grouping).</p>
<div class="callout"><span class="badge">Order of thinking</span> SQL is written SELECT-first but the database effectively runs it FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY — filtering happens before summarizing.</div>`,
    `<span class="eyebrow">EDB201 · Chương 3 · Bài 3.1</span>
<h2>SQL truy vấn: SELECT, WHERE, JOIN</h2>
<h3>Cấu trúc cơ bản</h3>
<pre><code>SELECT column1, column2
FROM   table_name
WHERE  condition
ORDER BY column1;
</code></pre>
<p><strong>SELECT</strong> chọn cột, <strong>FROM</strong> chọn bảng, <strong>WHERE</strong> lọc dòng, <strong>ORDER BY</strong> sắp xếp kết quả. Chỉ dùng <code>SELECT *</code> khi khám phá dữ liệu — trong mã ứng dụng thật nên nêu tên cột rõ ràng.</p>
<h3>Lọc với WHERE</h3>
<pre><code>SELECT Name, Price FROM Product
WHERE Price &gt; 100000 AND Price &lt; 500000;

SELECT * FROM Customer WHERE Phone LIKE '090%';

SELECT * FROM Product WHERE CategoryID IN (1, 3, 5);

SELECT * FROM Order WHERE OrderDate BETWEEN '2026-01-01' AND '2026-01-31';
</code></pre>
<p>Toán tử so sánh (<code>=</code>, <code>&lt;&gt;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>) kết hợp với <code>AND</code>/<code>OR</code>/<code>NOT</code>. <code>LIKE</code> khớp mẫu chuỗi (<code>%</code> = mọi ký tự), <code>IN</code> kiểm tra trong danh sách, <code>BETWEEN</code> kiểm tra trong khoảng.</p>
<h3>Kết bảng (JOIN)</h3>
<pre><code>-- INNER JOIN: chỉ giữ dòng khớp ở CẢ HAI bảng
SELECT o.OrderID, c.Name
FROM Order o
INNER JOIN Customer c ON o.CustomerID = c.CustomerID;

-- LEFT JOIN: giữ hết dòng bảng TRÁI, khớp hay không
SELECT c.Name, o.OrderID
FROM Customer c
LEFT JOIN Order o ON o.CustomerID = c.CustomerID;
</code></pre>
<p><strong>INNER JOIN</strong> chỉ giữ dòng khớp ở cả hai bên. <strong>LEFT JOIN</strong> giữ mọi dòng của bảng trái, điền <code>NULL</code> vào cột bên phải nếu không khớp — hữu ích cho báo cáo "khách hàng chưa từng đặt hàng".</p>
<h3>Tổng hợp với GROUP BY</h3>
<pre><code>SELECT CustomerID, COUNT(*) AS OrderCount, SUM(TotalAmount) AS Revenue
FROM Order
GROUP BY CustomerID
HAVING COUNT(*) &gt; 3;
</code></pre>
<p><code>COUNT</code>/<code>SUM</code>/<code>AVG</code>/<code>MIN</code>/<code>MAX</code> tổng hợp các nhóm dòng do <code>GROUP BY</code> tạo ra; <code>HAVING</code> lọc các nhóm đó (còn <code>WHERE</code> lọc dòng <em>trước</em> khi nhóm).</p>
<div class="callout"><span class="badge">Thứ tự suy nghĩ</span> SQL viết SELECT trước, nhưng CSDL thực thi theo thứ tự FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY — lọc dòng xảy ra trước khi tổng hợp.</div>`,
  ]]);

const c3q = quiz('edb201-quiz-3', 'Quiz 3 — SELECT/WHERE/JOIN|||Quiz 3 — SELECT/WHERE/JOIN', [
  { id: 'q1', question: 'Mệnh đề nào dùng để LỌC DÒNG theo điều kiện trong câu SELECT?', options: ['ORDER BY', 'WHERE', 'GROUP BY', 'SELECT'], correctIndex: 1, explanation: 'WHERE lọc các dòng thoả điều kiện trước khi trả kết quả (và trước khi GROUP BY).' },
  { id: 'q2', question: 'INNER JOIN giữa hai bảng trả về những dòng nào?', options: ['Toàn bộ dòng của cả hai bảng', 'Chỉ các dòng khớp điều kiện ở CẢ HAI bảng', 'Chỉ dòng của bảng bên trái', 'Không dòng nào'], correctIndex: 1, explanation: 'INNER JOIN chỉ giữ lại dòng có khớp ở cả hai bảng theo điều kiện ON.' },
  { id: 'q3', question: 'HAVING khác WHERE ở điểm nào?', options: ['HAVING lọc dòng trước khi nhóm, WHERE lọc sau khi nhóm', 'HAVING lọc NHÓM (sau GROUP BY), WHERE lọc DÒNG (trước khi nhóm)', 'Hai mệnh đề hoàn toàn giống nhau', 'HAVING chỉ dùng với ORDER BY'], correctIndex: 1, explanation: 'WHERE lọc dòng trước khi nhóm; HAVING lọc các nhóm đã tổng hợp (ví dụ COUNT(*) > 3).' },
]);

const c4 = doc('edb201-4-1-dml-transaction', '4.1 — SQL data manipulation & transactions|||4.1 — SQL thao tác dữ liệu & transaction',
  'INSERT INTO, UPDATE ... SET ... WHERE, DELETE FROM ... WHERE; nguy hiểm khi quên WHERE; transaction BEGIN/COMMIT/ROLLBACK; tính chất ACID.',
  [[
    `<span class="eyebrow">EDB201 · Chapter 4 · Lesson 4.1</span>
<h2>SQL data manipulation &amp; transactions</h2>
<h3>Adding, changing, removing rows</h3>
<pre><code>INSERT INTO Customer (Name, Phone)
VALUES ('Nguyen Van A', '0901234567');

UPDATE Product
SET Price = Price * 1.1
WHERE CategoryID = 2;

DELETE FROM Order
WHERE OrderDate &lt; '2020-01-01';
</code></pre>
<p><strong>INSERT INTO</strong> adds new rows. <strong>UPDATE</strong> changes existing rows matched by <code>WHERE</code>. <strong>DELETE</strong> removes rows matched by <code>WHERE</code>.</p>
<div class="callout"><span class="badge">⚠️ The most expensive typo in SQL</span> Running <code>UPDATE Product SET Price = Price * 1.1;</code> or <code>DELETE FROM Order;</code> WITHOUT a <code>WHERE</code> clause applies the change to EVERY row in the table. Always write and check the <code>WHERE</code> first — test it as a <code>SELECT</code> before turning it into an <code>UPDATE</code>/<code>DELETE</code>.</div>
<h3>Transactions — all or nothing</h3>
<pre><code>BEGIN TRANSACTION;

UPDATE Account SET Balance = Balance - 500000 WHERE AccountID = 1;
UPDATE Account SET Balance = Balance + 500000 WHERE AccountID = 2;

COMMIT;   -- both updates become permanent together
-- or: ROLLBACK;  -- undo both if something went wrong
</code></pre>
<p>A money transfer is really two <code>UPDATE</code>s. A <strong>transaction</strong> groups them so they succeed or fail <em>together</em> — the database never ends up in a state where money left one account but never arrived in the other.</p>
<h3>ACID, in one line each</h3>
<ul>
<li><strong>Atomicity</strong> — a transaction is all-or-nothing.</li>
<li><strong>Consistency</strong> — it can only move the database from one valid state to another.</li>
<li><strong>Isolation</strong> — concurrent transactions don't see each other's half-finished work.</li>
<li><strong>Durability</strong> — once committed, it survives a crash.</li>
</ul>`,
    `<span class="eyebrow">EDB201 · Chương 4 · Bài 4.1</span>
<h2>SQL thao tác dữ liệu &amp; transaction</h2>
<h3>Thêm, sửa, xoá dòng</h3>
<pre><code>INSERT INTO Customer (Name, Phone)
VALUES ('Nguyen Van A', '0901234567');

UPDATE Product
SET Price = Price * 1.1
WHERE CategoryID = 2;

DELETE FROM Order
WHERE OrderDate &lt; '2020-01-01';
</code></pre>
<p><strong>INSERT INTO</strong> thêm dòng mới. <strong>UPDATE</strong> sửa các dòng khớp <code>WHERE</code>. <strong>DELETE</strong> xoá các dòng khớp <code>WHERE</code>.</p>
<div class="callout"><span class="badge">⚠️ Lỗi đánh máy đắt giá nhất trong SQL</span> Chạy <code>UPDATE Product SET Price = Price * 1.1;</code> hoặc <code>DELETE FROM Order;</code> KHÔNG có <code>WHERE</code> sẽ áp dụng lên TẤT CẢ dòng trong bảng. Luôn viết và kiểm tra <code>WHERE</code> trước — thử nó dưới dạng <code>SELECT</code> rồi mới chuyển thành <code>UPDATE</code>/<code>DELETE</code>.</div>
<h3>Transaction — làm hết hoặc không làm gì</h3>
<pre><code>BEGIN TRANSACTION;

UPDATE Account SET Balance = Balance - 500000 WHERE AccountID = 1;
UPDATE Account SET Balance = Balance + 500000 WHERE AccountID = 2;

COMMIT;   -- cả hai lệnh cùng trở thành vĩnh viễn
-- hoặc: ROLLBACK;  -- hủy cả hai nếu có gì sai
</code></pre>
<p>Một lượt chuyển tiền thực ra là hai câu <code>UPDATE</code>. Một <strong>transaction</strong> gom chúng lại để cùng thành công hoặc cùng thất bại — CSDL không bao giờ rơi vào trạng thái tiền rời khỏi tài khoản này nhưng chưa tới tài khoản kia.</p>
<h3>ACID, mỗi tính chất một câu</h3>
<ul>
<li><strong>Atomicity (nguyên tử)</strong> — transaction làm hết hoặc không làm gì.</li>
<li><strong>Consistency (nhất quán)</strong> — chỉ đưa CSDL từ một trạng thái hợp lệ sang trạng thái hợp lệ khác.</li>
<li><strong>Isolation (cách ly)</strong> — các transaction chạy đồng thời không thấy phần việc dở của nhau.</li>
<li><strong>Durability (bền vững)</strong> — đã COMMIT thì sống sót qua cả sự cố sập máy.</li>
</ul>`,
  ]]);

const c4q = quiz('edb201-quiz-4', 'Quiz 4 — DML & transaction|||Quiz 4 — DML & transaction', [
  { id: 'q1', question: 'Câu lệnh nào dùng để thêm một dòng mới vào bảng?', options: ['UPDATE', 'INSERT INTO', 'DELETE FROM', 'SELECT'], correctIndex: 1, explanation: 'INSERT INTO ... VALUES (...) thêm dòng mới vào bảng.' },
  { id: 'q2', question: 'Nếu chạy DELETE FROM Order; mà QUÊN mệnh đề WHERE, điều gì xảy ra?', options: ['Không có gì xảy ra, SQL tự chặn', 'Chỉ xoá dòng đầu tiên', 'Xoá TẤT CẢ các dòng trong bảng Order', 'Báo lỗi cú pháp'], correctIndex: 2, explanation: 'Không có WHERE, UPDATE/DELETE áp dụng lên toàn bộ dòng trong bảng — đây là lỗi rất tốn kém trong thực tế.' },
  { id: 'q3', question: 'ROLLBACK trong một transaction dùng để làm gì?', options: ['Lưu vĩnh viễn các thay đổi', 'Hủy các thay đổi CHƯA COMMIT, đưa dữ liệu về trạng thái trước', 'Xoá toàn bộ bảng', 'Tạo bảng mới'], correctIndex: 1, explanation: 'ROLLBACK hủy mọi thay đổi trong transaction hiện tại nếu chưa COMMIT.' },
]);

const c5 = doc('edb201-5-1-view-procedure-function', '5.1 — Views, stored procedures & functions|||5.1 — View, stored procedure & function',
  'CREATE VIEW (bảng ảo, giới hạn cột/đơn giản hoá truy vấn); CREATE PROCEDURE (gói logic, tham số, giảm round-trip); CREATE FUNCTION (trả giá trị, dùng trong SELECT).',
  [[
    `<span class="eyebrow">EDB201 · Chapter 5 · Lesson 5.1</span>
<h2>Views, stored procedures &amp; functions</h2>
<h3>Views — a saved query you can query</h3>
<pre><code>CREATE VIEW CustomerOrderSummary AS
SELECT c.CustomerID, c.Name, COUNT(o.OrderID) AS OrderCount
FROM Customer c
LEFT JOIN Order o ON o.CustomerID = c.CustomerID
GROUP BY c.CustomerID, c.Name;

SELECT * FROM CustomerOrderSummary WHERE OrderCount &gt; 5;
</code></pre>
<p>A <strong>view</strong> is a virtual table backed by a <code>SELECT</code> — it doesn't store data itself. Use views to hide a complex join behind a simple name, or to expose only a subset of columns to an application (e.g. hiding a Salary column from a general-purpose report view).</p>
<h3>Stored procedures — logic that lives in the database</h3>
<pre><code>CREATE PROCEDURE AddOrder (@CustomerID INT, @ProductID INT, @Qty INT)
AS
BEGIN
  INSERT INTO Order (CustomerID, OrderDate) VALUES (@CustomerID, GETDATE());
  DECLARE @NewOrderID INT = SCOPE_IDENTITY();
  INSERT INTO OrderDetail (OrderID, ProductID, Quantity)
  VALUES (@NewOrderID, @ProductID, @Qty);
END;

EXEC AddOrder @CustomerID = 1, @ProductID = 5, @Qty = 2;
</code></pre>
<p>A <strong>stored procedure</strong> bundles several statements (and parameters) into one callable unit. The application sends one call instead of several round-trip queries, and the business rule ("creating an order also creates its detail row") lives in one place instead of being copy-pasted into every app that touches orders.</p>
<h3>Functions — a value you can use inside a query</h3>
<pre><code>CREATE FUNCTION GetCustomerTotalSpent (@CustomerID INT)
RETURNS DECIMAL(18,2)
AS
BEGIN
  RETURN (SELECT SUM(TotalAmount) FROM Order WHERE CustomerID = @CustomerID);
END;

SELECT Name, dbo.GetCustomerTotalSpent(CustomerID) AS TotalSpent
FROM Customer;
</code></pre>
<p>Unlike a procedure, a <strong>function</strong> always returns a value and can be used directly inside a <code>SELECT</code> column list or a <code>WHERE</code> clause.</p>
<div class="callout"><span class="badge">When to use which</span> View = a reusable named query. Function = a reusable named calculation you plug into a query. Procedure = a reusable named action (often changes data, can run several statements).</div>`,
    `<span class="eyebrow">EDB201 · Chương 5 · Bài 5.1</span>
<h2>View, stored procedure &amp; function</h2>
<h3>View — một câu truy vấn được lưu tên, truy vấn lại được</h3>
<pre><code>CREATE VIEW CustomerOrderSummary AS
SELECT c.CustomerID, c.Name, COUNT(o.OrderID) AS OrderCount
FROM Customer c
LEFT JOIN Order o ON o.CustomerID = c.CustomerID
GROUP BY c.CustomerID, c.Name;

SELECT * FROM CustomerOrderSummary WHERE OrderCount &gt; 5;
</code></pre>
<p>Một <strong>view</strong> là bảng ảo đứng sau một câu <code>SELECT</code> — nó không tự lưu dữ liệu. Dùng view để giấu một câu JOIN phức tạp sau một cái tên đơn giản, hoặc chỉ lộ ra một số cột cho ứng dụng (vd giấu cột Salary khỏi view báo cáo dùng chung).</p>
<h3>Stored procedure — logic sống trong CSDL</h3>
<pre><code>CREATE PROCEDURE AddOrder (@CustomerID INT, @ProductID INT, @Qty INT)
AS
BEGIN
  INSERT INTO Order (CustomerID, OrderDate) VALUES (@CustomerID, GETDATE());
  DECLARE @NewOrderID INT = SCOPE_IDENTITY();
  INSERT INTO OrderDetail (OrderID, ProductID, Quantity)
  VALUES (@NewOrderID, @ProductID, @Qty);
END;

EXEC AddOrder @CustomerID = 1, @ProductID = 5, @Qty = 2;
</code></pre>
<p>Một <strong>stored procedure</strong> gói nhiều câu lệnh (và tham số) vào một đơn vị gọi được. Ứng dụng chỉ cần gửi một lượt gọi thay vì nhiều lượt truy vấn qua lại, và quy tắc nghiệp vụ ("tạo đơn hàng cũng phải tạo dòng chi tiết") nằm ở một chỗ duy nhất thay vì bị chép lại ở mọi ứng dụng đụng tới đơn hàng.</p>
<h3>Function — một giá trị dùng được ngay trong câu truy vấn</h3>
<pre><code>CREATE FUNCTION GetCustomerTotalSpent (@CustomerID INT)
RETURNS DECIMAL(18,2)
AS
BEGIN
  RETURN (SELECT SUM(TotalAmount) FROM Order WHERE CustomerID = @CustomerID);
END;

SELECT Name, dbo.GetCustomerTotalSpent(CustomerID) AS TotalSpent
FROM Customer;
</code></pre>
<p>Khác với procedure, một <strong>function</strong> luôn trả về một giá trị và dùng được trực tiếp trong danh sách cột của <code>SELECT</code> hoặc trong <code>WHERE</code>.</p>
<div class="callout"><span class="badge">Dùng cái nào</span> View = câu truy vấn được đặt tên, tái dùng được. Function = phép tính được đặt tên, cắm được vào truy vấn. Procedure = một hành động được đặt tên (thường đổi dữ liệu, chạy được nhiều câu lệnh).</div>`,
  ]]);

const c5q = quiz('edb201-quiz-5', 'Quiz 5 — View/procedure/function|||Quiz 5 — View/procedure/function', [
  { id: 'q1', question: 'View trong SQL là gì?', options: ['Một bảng vật lý lưu dữ liệu riêng', 'Bảng ảo — kết quả một câu SELECT được đặt tên', 'Một loại chỉ mục (index)', 'Một tài khoản người dùng'], correctIndex: 1, explanation: 'View không tự lưu dữ liệu, nó chỉ là câu SELECT được đặt tên để truy vấn lại như một bảng.' },
  { id: 'q2', question: 'Lợi ích chính khi gói logic vào stored procedure là gì?', options: ['Làm chậm ứng dụng', 'Gói nhiều câu lệnh + logic nghiệp vụ vào một nơi, giảm số lượt gọi qua lại', 'Xoá được nhu cầu dùng WHERE', 'Chỉ dùng được để đọc dữ liệu'], correctIndex: 1, explanation: 'Procedure gói nhiều statement/tham số thành một lượt gọi, và tập trung quy tắc nghiệp vụ ở một chỗ.' },
  { id: 'q3', question: 'Khác biệt chính giữa function và procedure trong SQL là gì?', options: ['Không có khác biệt nào', 'Function luôn trả về giá trị & dùng trong SELECT được; procedure không bắt buộc', 'Procedure luôn nhanh hơn function', 'Function không nhận tham số'], correctIndex: 1, explanation: 'Function bắt buộc RETURN một giá trị và có thể dùng trực tiếp trong câu SELECT; procedure thì không.' },
]);

const c6 = doc('edb201-6-1-connect-app', '6.1 — Connecting a database to an application|||6.1 — Kết nối CSDL với ứng dụng',
  'Connection string, driver (ODBC/JDBC/ADO.NET); parameterized query chống SQL injection; form nhập liệu (CRUD) & report tổng hợp.',
  [[
    `<span class="eyebrow">EDB201 · Chapter 6 · Lesson 6.1</span>
<h2>Connecting a database to an application</h2>
<h3>How an app talks to a database</h3>
<pre><code>Server=localhost;Database=SalesDB;User Id=app_user;Password=****;
</code></pre>
<p>An application connects through a <strong>driver</strong> (ODBC, JDBC for Java, ADO.NET for .NET, a Node.js/Python DB library) using a <strong>connection string</strong> — server address, database name, and credentials. The driver translates the app's calls into the network protocol the database understands.</p>
<h3>Never build SQL by pasting in user input</h3>
<pre><code>-- DANGEROUS: string-concatenated SQL
"SELECT * FROM Customer WHERE Name = '" + userInput + "'"
-- if userInput is:  x'; DROP TABLE Customer; --
-- the final SQL becomes two statements — SQL injection.

-- SAFE: parameterized query — the value is never parsed as SQL
SELECT * FROM Customer WHERE Name = @Name;   -- @Name bound separately
</code></pre>
<p>A <strong>parameterized query</strong> sends the SQL text and the user's value as two separate things — the database never re-interprets the value as SQL code. This is the single most important rule when an application's forms feed into SQL.</p>
<h3>Forms — the CRUD front door</h3>
<p>A data-entry <strong>form</strong> maps its fields to <code>INSERT</code>/<code>UPDATE</code> (save), reads a row back with <code>SELECT</code> (load an existing record to edit), and triggers <code>DELETE</code> (remove) — the four actions are commonly called <strong>CRUD</strong> (Create, Read, Update, Delete).</p>
<h3>Reports — read-only, aggregated</h3>
<p>A <strong>report</strong> is typically a read-only screen or printout built from a <code>SELECT</code> with <code>JOIN</code>s and <code>GROUP BY</code> — e.g. "revenue by month", "top 10 products this quarter". Reports should use a database account with <strong>read-only</strong> permissions where possible.</p>
<div class="callout"><span class="badge">Rule of thumb</span> Forms write, reports read. Both go through the driver's parameterized query API — never through hand-built SQL strings.</div>`,
    `<span class="eyebrow">EDB201 · Chương 6 · Bài 6.1</span>
<h2>Kết nối CSDL với ứng dụng</h2>
<h3>Ứng dụng "nói chuyện" với CSDL thế nào</h3>
<pre><code>Server=localhost;Database=SalesDB;User Id=app_user;Password=****;
</code></pre>
<p>Ứng dụng kết nối qua một <strong>driver</strong> (ODBC, JDBC cho Java, ADO.NET cho .NET, thư viện DB của Node.js/Python) bằng một <strong>connection string</strong> — địa chỉ server, tên CSDL, và thông tin đăng nhập. Driver dịch lệnh gọi của ứng dụng thành giao thức mạng mà CSDL hiểu.</p>
<h3>Đừng bao giờ ghép chuỗi SQL từ dữ liệu người dùng nhập</h3>
<pre><code>-- NGUY HIỂM: nối chuỗi SQL trực tiếp
"SELECT * FROM Customer WHERE Name = '" + userInput + "'"
-- nếu userInput là:  x'; DROP TABLE Customer; --
-- SQL cuối cùng trở thành hai câu lệnh — SQL injection.

-- AN TOÀN: parameterized query — giá trị KHÔNG bị hiểu là SQL
SELECT * FROM Customer WHERE Name = @Name;   -- @Name gán riêng
</code></pre>
<p>Một <strong>parameterized query</strong> gửi phần chữ SQL và giá trị người dùng như hai thứ tách biệt — CSDL không bao giờ diễn giải lại giá trị đó thành mã SQL. Đây là quy tắc quan trọng nhất khi form của ứng dụng đưa dữ liệu vào SQL.</p>
<h3>Form — cửa vào CRUD</h3>
<p>Một <strong>form</strong> nhập liệu gắn các ô nhập với <code>INSERT</code>/<code>UPDATE</code> (lưu), đọc lại một dòng bằng <code>SELECT</code> (nạp bản ghi có sẵn để sửa), và gọi <code>DELETE</code> (xoá) — bốn hành động này thường gọi là <strong>CRUD</strong> (Create, Read, Update, Delete).</p>
<h3>Report — chỉ đọc, đã tổng hợp</h3>
<p>Một <strong>report</strong> thường là màn hình hoặc bản in chỉ-đọc, dựng từ một câu <code>SELECT</code> có <code>JOIN</code> và <code>GROUP BY</code> — vd "doanh thu theo tháng", "top 10 sản phẩm quý này". Report nên dùng tài khoản CSDL chỉ có quyền <strong>đọc</strong> khi có thể.</p>
<div class="callout"><span class="badge">Quy tắc ghi nhớ</span> Form để ghi, report để đọc. Cả hai đều đi qua API parameterized query của driver — không bao giờ qua chuỗi SQL ghép tay.</div>`,
  ]]);

const c6q = quiz('edb201-quiz-6', 'Quiz 6 — Connecting to an app|||Quiz 6 — Kết nối ứng dụng', [
  { id: 'q1', question: 'Vì sao nên dùng parameterized query khi ứng dụng gửi dữ liệu người dùng vào SQL?', options: ['Để chuỗi SQL ngắn hơn', 'Để tránh SQL injection — giá trị không bị hiểu là mã SQL', 'Để không cần WHERE', 'Để không cần driver'], correctIndex: 1, explanation: 'Parameterized query tách phần chữ SQL và giá trị người dùng, chặn kiểu tấn công SQL injection.' },
  { id: 'q2', question: 'Form nhập liệu trong ứng dụng CSDL thường thực hiện nhóm hành động nào?', options: ['CRUD (Create, Read, Update, Delete)', 'Chỉ đọc dữ liệu', 'Chỉ sao lưu CSDL', 'Chỉ vẽ biểu đồ'], correctIndex: 0, explanation: 'Form ánh xạ tới INSERT (Create), SELECT (Read), UPDATE, DELETE — gọi chung là CRUD.' },
  { id: 'q3', question: 'Report trong ứng dụng CSDL nên dùng loại tài khoản CSDL nào khi có thể?', options: ['Tài khoản có toàn quyền xoá bảng', 'Tài khoản chỉ có quyền đọc (read-only)', 'Không cần tài khoản', 'Tài khoản admin hệ điều hành'], correctIndex: 1, explanation: 'Report chỉ đọc dữ liệu để hiển thị/in, nên nên giới hạn quyền ở mức chỉ đọc.' },
]);

const c7 = doc('edb201-7-1-security-backup', '7.1 — Security, backup & permissions|||7.1 — Bảo mật, sao lưu & phân quyền',
  'Tài khoản người dùng CSDL, GRANT/REVOKE, vai trò (role), nguyên tắc đặc quyền tối thiểu; loại sao lưu (full/differential/log) & restore.',
  [[
    `<span class="eyebrow">EDB201 · Chapter 7 · Lesson 7.1</span>
<h2>Security, backup &amp; permissions</h2>
<h3>Accounts, roles &amp; permissions</h3>
<pre><code>CREATE USER app_reporting WITH PASSWORD = '****';

GRANT SELECT ON Order TO app_reporting;
GRANT SELECT, INSERT, UPDATE ON Order TO app_sales;
REVOKE UPDATE ON Order FROM app_sales;
</code></pre>
<p><strong>GRANT</strong> gives a user or role a specific privilege (<code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>, ...) on a specific object; <strong>REVOKE</strong> takes it away. A <strong>role</strong> groups permissions so you assign them to many users at once (e.g. a "sales_staff" role with exactly the rights a sales clerk needs).</p>
<h3>Principle of least privilege</h3>
<p>Give every account only the permissions its job strictly needs — a reporting app gets <code>SELECT</code> only, never <code>DELETE</code>; a cashier's login can update orders but never touch the Employee salary table. This limits the damage of a bug or a compromised account.</p>
<h3>Backup types</h3>
<ul>
<li><strong>Full backup</strong> — a complete copy of the database at one point in time.</li>
<li><strong>Differential backup</strong> — only the data changed since the last full backup (smaller, faster).</li>
<li><strong>Transaction log backup</strong> — every committed change since the last log backup, enabling point-in-time restore.</li>
</ul>
<pre><code>BACKUP DATABASE SalesDB TO DISK = 'D:\\Backups\\SalesDB_full.bak';

RESTORE DATABASE SalesDB FROM DISK = 'D:\\Backups\\SalesDB_full.bak'
WITH REPLACE;
</code></pre>
<div class="callout"><span class="badge">A backup you haven't restored is a guess</span> Test the restore procedure before you need it in an emergency — a backup file that has never been restored may be corrupted, incomplete, or simply the wrong one, and you only find out at the worst possible moment.</div>`,
    `<span class="eyebrow">EDB201 · Chương 7 · Bài 7.1</span>
<h2>Bảo mật, sao lưu &amp; phân quyền</h2>
<h3>Tài khoản, vai trò &amp; quyền</h3>
<pre><code>CREATE USER app_reporting WITH PASSWORD = '****';

GRANT SELECT ON Order TO app_reporting;
GRANT SELECT, INSERT, UPDATE ON Order TO app_sales;
REVOKE UPDATE ON Order FROM app_sales;
</code></pre>
<p><strong>GRANT</strong> cấp cho một user hoặc role một quyền cụ thể (<code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>, ...) trên một đối tượng cụ thể; <strong>REVOKE</strong> thu hồi lại. Một <strong>role (vai trò)</strong> gom nhiều quyền để gán cùng lúc cho nhiều user (vd role "sales_staff" có đúng những quyền một nhân viên bán hàng cần).</p>
<h3>Nguyên tắc đặc quyền tối thiểu</h3>
<p>Chỉ cấp cho mỗi tài khoản đúng quyền công việc cần — ứng dụng báo cáo chỉ cần <code>SELECT</code>, không bao giờ cần <code>DELETE</code>; đăng nhập của thu ngân có thể sửa đơn hàng nhưng không được đụng tới bảng lương nhân viên. Điều này giới hạn thiệt hại nếu có lỗi phần mềm hoặc tài khoản bị lộ.</p>
<h3>Các loại sao lưu</h3>
<ul>
<li><strong>Full backup</strong> — bản sao đầy đủ toàn bộ CSDL tại một thời điểm.</li>
<li><strong>Differential backup</strong> — chỉ phần dữ liệu thay đổi từ lần full backup gần nhất (nhỏ hơn, nhanh hơn).</li>
<li><strong>Transaction log backup</strong> — mọi thay đổi đã COMMIT từ lần sao lưu log gần nhất, cho phép khôi phục về một thời điểm cụ thể.</li>
</ul>
<pre><code>BACKUP DATABASE SalesDB TO DISK = 'D:\\Backups\\SalesDB_full.bak';

RESTORE DATABASE SalesDB FROM DISK = 'D:\\Backups\\SalesDB_full.bak'
WITH REPLACE;
</code></pre>
<div class="callout"><span class="badge">Bản sao lưu chưa restore thử = một lời đoán</span> Hãy thử quy trình restore trước khi thật sự cần dùng nó lúc khẩn cấp — một file backup chưa từng được restore có thể bị hỏng, thiếu, hoặc sai file, và bạn chỉ biết điều đó vào lúc tệ nhất.</div>`,
  ]]);

const c7q = quiz('edb201-quiz-7', 'Quiz 7 — Security & backup|||Quiz 7 — Bảo mật & sao lưu', [
  { id: 'q1', question: 'Lệnh GRANT trong SQL dùng để làm gì?', options: ['Xoá một bảng', 'Cấp quyền truy cập (SELECT/INSERT/...) cho user hoặc role', 'Sao lưu CSDL', 'Tạo view'], correctIndex: 1, explanation: 'GRANT cấp một quyền cụ thể trên một đối tượng cụ thể cho user/role.' },
  { id: 'q2', question: 'Nguyên tắc "đặc quyền tối thiểu" (least privilege) nghĩa là gì?', options: ['Cấp toàn quyền cho mọi tài khoản để tiện dùng', 'Chỉ cấp đúng quyền cần thiết cho công việc, không hơn', 'Không cấp quyền cho ai cả', 'Chỉ áp dụng cho tài khoản admin'], correctIndex: 1, explanation: 'Mỗi tài khoản chỉ nên có đúng quyền công việc cần, để giảm thiệt hại nếu có sự cố.' },
  { id: 'q3', question: 'Differential backup khác full backup ở điểm nào?', options: ['Differential sao lưu toàn bộ CSDL, full chỉ sao lưu phần thay đổi', 'Differential chỉ sao lưu phần thay đổi từ lần full backup gần nhất', 'Hai loại hoàn toàn giống nhau', 'Differential không thể dùng để restore'], correctIndex: 1, explanation: 'Full backup là bản sao toàn bộ; differential chỉ chứa phần thay đổi từ lần full gần nhất, nên nhỏ và nhanh hơn.' },
]);

const c8 = doc('edb201-8-1-build-sales-app', '8.1 — Building a complete database application (sales/inventory) & practice|||8.1 — Xây dựng ứng dụng CSDL hoàn chỉnh (bán hàng/kho) & thực hành',
  'Ghép mọi chương lại: ERD hệ thống bán hàng/kho (Product, Category, Customer, Order, OrderDetail, Supplier), tạo schema, truy vấn báo cáo, checklist trước khi đưa vào dùng.',
  [[
    `<span class="eyebrow">EDB201 · Chapter 8 · Lesson 8.1</span>
<h2>Building a complete database application &amp; practice</h2>
<h3>Putting every chapter together</h3>
<p>A small <strong>sales &amp; inventory application</strong> exercises everything so far: an ERD with 1-N and N-N relationships, a normalized schema, queries with <code>JOIN</code>/<code>GROUP BY</code>, transactions when stock changes, a view/procedure for common operations, and permissions before it ships.</p>
<h3>The ERD</h3>
<pre><code>Category  (CategoryID PK, Name)
Product   (ProductID PK, Name, Price, StockQty, CategoryID FK, SupplierID FK)
Supplier  (SupplierID PK, Name, Phone)
Customer  (CustomerID PK, Name, Phone)
Order     (OrderID PK, OrderDate, CustomerID FK)
OrderDetail (OrderID FK, ProductID FK, Quantity, UnitPrice,
             PRIMARY KEY (OrderID, ProductID))
</code></pre>
<p>Product-Category and Product-Supplier are 1-N; Order-Product is N-N, resolved by OrderDetail — exactly the pattern from Chapter 2.</p>
<h3>A sale that updates stock — as one transaction</h3>
<pre><code>BEGIN TRANSACTION;

INSERT INTO Order (CustomerID, OrderDate) VALUES (3, GETDATE());
DECLARE @OrderID INT = SCOPE_IDENTITY();

INSERT INTO OrderDetail (OrderID, ProductID, Quantity, UnitPrice)
VALUES (@OrderID, 10, 2, 150000);

UPDATE Product SET StockQty = StockQty - 2 WHERE ProductID = 10;

IF (SELECT StockQty FROM Product WHERE ProductID = 10) &lt; 0
  ROLLBACK;
ELSE
  COMMIT;
</code></pre>
<p>Creating the order line and reducing stock must succeed together — this is Chapter 4's transaction lesson applied to a real business rule.</p>
<h3>Report queries</h3>
<pre><code>-- Revenue by month
SELECT MONTH(o.OrderDate) AS Month, SUM(d.Quantity * d.UnitPrice) AS Revenue
FROM Order o JOIN OrderDetail d ON d.OrderID = o.OrderID
GROUP BY MONTH(o.OrderDate);

-- Products below minimum stock
SELECT Name, StockQty FROM Product WHERE StockQty &lt; 10;
</code></pre>
<h3>Pre-launch checklist</h3>
<ul>
<li>ERD reviewed, keys and foreign keys in place, schema in 3NF where reasonable.</li>
<li>Every form/report goes through parameterized queries — no string-built SQL.</li>
<li>Multi-step operations wrapped in transactions.</li>
<li>Application accounts hold only the permissions they need (Chapter 7).</li>
<li>A full backup exists, and the restore has been tested.</li>
</ul>
<div class="callout"><span class="badge">Practice</span> Design your own ERD for a small business you know (a print shop, a mini-mart, a tutoring center), write the CREATE TABLE statements, then the five queries an owner would actually ask for.</div>`,
    `<span class="eyebrow">EDB201 · Chương 8 · Bài 8.1</span>
<h2>Xây dựng ứng dụng CSDL hoàn chỉnh &amp; thực hành</h2>
<h3>Ghép mọi chương lại</h3>
<p>Một <strong>ứng dụng bán hàng &amp; quản lý kho</strong> nhỏ luyện tập lại mọi thứ đã học: ERD có quan hệ 1-N và N-N, schema chuẩn hoá, truy vấn với <code>JOIN</code>/<code>GROUP BY</code>, transaction khi tồn kho thay đổi, view/procedure cho các thao tác thường gặp, và phân quyền trước khi đưa vào dùng.</p>
<h3>ERD</h3>
<pre><code>Category  (CategoryID PK, Name)
Product   (ProductID PK, Name, Price, StockQty, CategoryID FK, SupplierID FK)
Supplier  (SupplierID PK, Name, Phone)
Customer  (CustomerID PK, Name, Phone)
Order     (OrderID PK, OrderDate, CustomerID FK)
OrderDetail (OrderID FK, ProductID FK, Quantity, UnitPrice,
             PRIMARY KEY (OrderID, ProductID))
</code></pre>
<p>Product-Category và Product-Supplier là 1-N; Order-Product là N-N, giải quyết bằng OrderDetail — đúng mẫu đã học ở Chương 2.</p>
<h3>Một lượt bán hàng cập nhật tồn kho — trong một transaction</h3>
<pre><code>BEGIN TRANSACTION;

INSERT INTO Order (CustomerID, OrderDate) VALUES (3, GETDATE());
DECLARE @OrderID INT = SCOPE_IDENTITY();

INSERT INTO OrderDetail (OrderID, ProductID, Quantity, UnitPrice)
VALUES (@OrderID, 10, 2, 150000);

UPDATE Product SET StockQty = StockQty - 2 WHERE ProductID = 10;

IF (SELECT StockQty FROM Product WHERE ProductID = 10) &lt; 0
  ROLLBACK;
ELSE
  COMMIT;
</code></pre>
<p>Tạo dòng đơn hàng và giảm tồn kho phải cùng thành công — đây là bài học transaction ở Chương 4, áp dụng vào một quy tắc nghiệp vụ thật.</p>
<h3>Truy vấn báo cáo</h3>
<pre><code>-- Doanh thu theo tháng
SELECT MONTH(o.OrderDate) AS Month, SUM(d.Quantity * d.UnitPrice) AS Revenue
FROM Order o JOIN OrderDetail d ON d.OrderID = o.OrderID
GROUP BY MONTH(o.OrderDate);

-- Sản phẩm dưới mức tồn kho tối thiểu
SELECT Name, StockQty FROM Product WHERE StockQty &lt; 10;
</code></pre>
<h3>Checklist trước khi đưa vào dùng</h3>
<ul>
<li>ERD đã rà lại, khóa chính/khóa ngoại đầy đủ, schema đạt 3NF khi hợp lý.</li>
<li>Mọi form/report đi qua parameterized query — không ghép chuỗi SQL.</li>
<li>Thao tác nhiều bước được gói trong transaction.</li>
<li>Tài khoản ứng dụng chỉ có đúng quyền cần (Chương 7).</li>
<li>Đã có full backup, và đã thử restore thật.</li>
</ul>
<div class="callout"><span class="badge">Thực hành</span> Tự thiết kế ERD cho một cửa hàng nhỏ bạn biết (tiệm in, mini-mart, trung tâm gia sư), viết các câu CREATE TABLE, rồi viết năm câu truy vấn mà chủ tiệm thật sự sẽ cần hỏi.</div>`,
  ]]);

const c8q = quiz('edb201-quiz-8', 'Quiz 8 — Build a complete app|||Quiz 8 — Xây app hoàn chỉnh', [
  { id: 'q1', question: 'Trong CSDL quản lý bán hàng, bảng OrderDetail (chi tiết đơn hàng) thường lưu gì?', options: ['Chỉ tổng tiền của đơn hàng', 'Sản phẩm, số lượng, đơn giá cho từng đơn hàng — giải quyết quan hệ N-N giữa Order và Product', 'Thông tin đăng nhập khách hàng', 'Lịch sử sao lưu CSDL'], correctIndex: 1, explanation: 'OrderDetail là bảng trung gian chứa OrderID + ProductID cùng Quantity/UnitPrice, giải quyết quan hệ nhiều-nhiều.' },
  { id: 'q2', question: 'Để tìm sản phẩm sắp hết hàng, nên viết câu lệnh nào?', options: ['DELETE FROM Product', 'SELECT ... WHERE StockQty nhỏ hơn mức tối thiểu', 'CREATE TABLE Product', 'GRANT SELECT ON Product'], correctIndex: 1, explanation: 'Một câu SELECT với điều kiện so sánh (StockQty < mức tối thiểu) trả về đúng danh sách cần.' },
  { id: 'q3', question: 'Vì sao thao tác "tạo đơn hàng + giảm tồn kho" nên nằm trong MỘT transaction?', options: ['Để chạy nhanh hơn', 'Để cả hai cùng thành công hoặc cùng thất bại, tránh lệch dữ liệu', 'Vì SQL bắt buộc phải làm vậy với mọi câu lệnh', 'Để không cần GRANT quyền'], correctIndex: 1, explanation: 'Nếu tách riêng, một bước có thể thành công còn bước kia thất bại, khiến dữ liệu (đơn hàng vs tồn kho) lệch nhau — transaction đảm bảo cả hai đi cùng nhau.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'EDB201',
    slug: 'edb201-database-application',
    title: 'Database Application',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EDB201.webp',
    shortDescription: 'How business apps use databases — ERD design, SQL (SELECT/WHERE/JOIN), transactions, views/procedures/functions, connecting a DB to forms & reports, security/backup, and building a full sales app. Bilingual, SQL examples & quizzes.|||Ứng dụng CSDL doanh nghiệp — thiết kế ERD, SQL (SELECT/WHERE/JOIN), transaction, view/procedure/function, kết nối CSDL với form & report, bảo mật/sao lưu, xây ứng dụng bán hàng/kho hoàn chỉnh. Song ngữ, ví dụ SQL & quiz.',
    description: 'Môn <strong>EDB201 — Database Application</strong> (kỳ 3, khối Quản trị Kinh doanh) giúp hiểu <strong>cách doanh nghiệp dùng CSDL trong ứng dụng thực tế</strong>. Từ <strong>tổng quan &amp; thiết kế ERD</strong> → <strong>SQL truy vấn</strong> (SELECT/WHERE/JOIN) → <strong>SQL thao tác dữ liệu</strong> (INSERT/UPDATE/DELETE, transaction) → <strong>view, stored procedure &amp; function</strong> → <strong>kết nối CSDL với ứng dụng</strong> (form, report) → <strong>bảo mật, sao lưu &amp; phân quyền</strong> → <strong>xây dựng ứng dụng CSDL hoàn chỉnh</strong> (quản lý bán hàng/kho) &amp; thực hành. Bám giáo trình Elmasri/Navathe, tài liệu SQL Server/MySQL, song ngữ, nhiều ví dụ SQL và quiz mỗi chương.',
    whatYouLearn: 'Vai trò CSDL trong ứng dụng doanh nghiệp (3 lớp: CSDL — nghiệp vụ — giao diện); ERD & chuẩn hoá (1NF/2NF/3NF), khóa chính/khóa ngoại; SELECT/WHERE/ORDER BY, các loại JOIN, GROUP BY/HAVING; INSERT/UPDATE/DELETE, transaction (COMMIT/ROLLBACK) & ACID; view, stored procedure, function; kết nối CSDL với ứng dụng qua parameterized query, form nhập liệu & report; tài khoản, GRANT/REVOKE, backup/restore; xây dựng ứng dụng quản lý bán hàng/kho từ ERD đến báo cáo.',
    requirements: 'Kiến thức CSDL nền tảng (bảng, khóa chính/khóa ngoại) hoặc đã học qua môn nhập môn CSDL. Nên dùng SQL Server/MySQL hoặc công cụ online (DB Fiddle) để thực hành theo bài.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Elmasri/Navathe, tài liệu SQL Server/MySQL, sách SQL in 10 Minutes, công cụ thực hành online, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao mọi ứng dụng doanh nghiệp cần CSDL; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan CSDL ứng dụng|||Chapter 1 — Overview', description: '3 lớp CSDL-nghiệp vụ-UI, vai trò DBA/developer, ví dụ ứng dụng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thiết kế CSDL & ERD|||Chapter 2 — Design & ERD', description: 'Thực thể, quan hệ, cardinality, ánh xạ sang bảng, chuẩn hoá.', lessons: [c2, c2q] },
    { title: 'Chương 3 — SQL truy vấn (SELECT/JOIN)|||Chapter 3 — SQL querying', description: 'SELECT/WHERE, các loại JOIN, GROUP BY/HAVING.', lessons: [c3, c3q] },
    { title: 'Chương 4 — SQL thao tác dữ liệu & transaction|||Chapter 4 — DML & transactions', description: 'INSERT/UPDATE/DELETE, transaction, ACID.', lessons: [c4, c4q] },
    { title: 'Chương 5 — View, stored procedure & function|||Chapter 5 — Views, procedures & functions', description: 'Bảng ảo, gói logic, hàm dùng trong truy vấn.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kết nối CSDL với ứng dụng|||Chapter 6 — Connecting to an app', description: 'Driver, parameterized query, form & report.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Bảo mật, sao lưu & phân quyền|||Chapter 7 — Security & backup', description: 'GRANT/REVOKE, đặc quyền tối thiểu, các loại backup.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xây dựng ứng dụng CSDL hoàn chỉnh|||Chapter 8 — Building a complete app', description: 'ERD bán hàng/kho, transaction thực tế, báo cáo, checklist, thực hành.', lessons: [c8, c8q] },
  ],
};
