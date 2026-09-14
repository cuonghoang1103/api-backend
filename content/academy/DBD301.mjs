/**
 * DBD301 — Advanced Database. Giáo trình (trích dẫn, không upload PDF):
 * Silberschatz/Korth/Sudarshan "Database System Concepts"; Elmasri/Navathe
 * "Fundamentals of Database Systems"; Kleppmann "Designing Data-Intensive
 * Applications". 8 chương: SQL nâng cao → chuẩn hoá & thiết kế lược đồ →
 * chỉ mục & tối ưu truy vấn → giao dịch/ACID & đồng thời → stored
 * procedure/trigger/view → kho dữ liệu & OLAP → NoSQL & phân tán → bảo
 * mật/backup & quản trị. Song ngữ + ví dụ SQL + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('dbd301-0-1-overview', 'Course overview: Advanced Database|||Tổng quan: Cơ sở dữ liệu nâng cao',
  'Môn tiếp theo sau nhập môn CSDL: SQL nâng cao, thiết kế lược đồ đúng, cách CSDL thực thi truy vấn, đúng đắn khi có đồng thời, và biết khi nào KHÔNG dùng quan hệ. Lộ trình 8 chương.',
  [[
    `<span class="eyebrow">DBD301 · Lesson 0.1 · Overview</span>
<h2>Advanced Database</h2>
<p class="lead">This course goes beyond an intro database course. You already know tables, primary/foreign keys and basic SQL — here you learn to <strong>write real analytical SQL</strong>, <strong>design correct schemas</strong>, understand <strong>how the database actually executes a query</strong>, guarantee correctness under concurrency, push logic into the database when it belongs there, and know when a relational database is the wrong tool.</p>
<h3>Why "advanced"?</h3>
<ul>
<li><strong>Correctness at scale</strong> — many users touching the same rows at once (transactions, ACID, concurrency control).</li>
<li><strong>Performance</strong> — the same query can take 10ms or 10 minutes depending on indexes and how the optimizer reads it.</li>
<li><strong>Beyond one table</strong> — real systems need reporting (data warehouses) and sometimes a different kind of database entirely (NoSQL).</li>
</ul>
<h3>Roadmap</h3>
<p>Advanced SQL (joins/subqueries/window functions) → normalization &amp; schema design → indexing &amp; query optimization → transactions, ACID &amp; concurrency control → stored procedures/triggers/views → data warehousing &amp; OLAP → NoSQL &amp; distributed databases → security, backup &amp; recovery. Bilingual, with runnable SQL examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">DBD301 · Bài 0.1 · Tổng quan</span>
<h2>Cơ sở dữ liệu nâng cao</h2>
<p class="lead">Môn này đi tiếp sau môn nhập môn CSDL. Bạn đã biết bảng, khoá chính/ngoại và SQL cơ bản — ở đây bạn học <strong>viết SQL phân tích thật sự</strong>, <strong>thiết kế lược đồ đúng</strong>, hiểu <strong>CSDL thực thi truy vấn như thế nào</strong>, đảm bảo đúng đắn khi nhiều người dùng cùng lúc, đưa logic vào CSDL khi hợp lý, và biết khi nào CSDL quan hệ KHÔNG phải công cụ đúng.</p>
<h3>Vì sao gọi là "nâng cao"?</h3>
<ul>
<li><strong>Đúng đắn khi có tải lớn</strong> — nhiều người dùng chạm cùng dòng dữ liệu (giao dịch, ACID, điều khiển đồng thời).</li>
<li><strong>Hiệu năng</strong> — cùng một câu truy vấn có thể chạy 10ms hoặc 10 phút tuỳ có chỉ mục và optimizer đọc nó thế nào.</li>
<li><strong>Vượt ra ngoài một bảng</strong> — hệ thống thật cần báo cáo (kho dữ liệu) và đôi khi cần một loại CSDL hoàn toàn khác (NoSQL).</li>
</ul>
<h3>Lộ trình</h3>
<p>SQL nâng cao (join/subquery/window function) → chuẩn hoá &amp; thiết kế lược đồ → chỉ mục &amp; tối ưu truy vấn → giao dịch, ACID &amp; điều khiển đồng thời → stored procedure/trigger/view → kho dữ liệu &amp; OLAP → NoSQL &amp; CSDL phân tán → bảo mật, sao lưu &amp; phục hồi. Song ngữ, có ví dụ SQL chạy được và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('dbd301-1-1-advanced-sql', '1.1 — Advanced SQL: joins, subqueries & window functions|||1.1 — SQL nâng cao: join, subquery & window function',
  'INNER/LEFT/self join; subquery tương quan & không tương quan; window function (OVER, PARTITION BY) khác GROUP BY thế nào.',
  [[
    `<span class="eyebrow">DBD301 · Chapter 1 · Lesson 1.1</span>
<h2>Advanced SQL: joins, subqueries &amp; window functions</h2>
<h3>Beyond basic SELECT</h3>
<p>This course builds on introductory SQL. You already know <code>SELECT/WHERE/GROUP BY</code>; here we combine multiple tables and compute values across sets of related rows.</p>
<h3>Joins</h3>
<ul>
<li><strong>INNER JOIN</strong> — keep rows that match on both sides.</li>
<li><strong>LEFT JOIN</strong> — keep all rows from the left table, NULL-fill unmatched right columns.</li>
<li><strong>Self-join</strong> — join a table to itself (e.g. employee → manager, both in the same table).</li>
</ul>
<h3>Subqueries</h3>
<p>A subquery is a query nested inside another. A <strong>correlated subquery</strong> references a column from the outer query and re-runs once per outer row; an <strong>uncorrelated</strong> one runs once, independently, and is usually cheaper.</p>
<h3>Window functions</h3>
<p>Unlike <code>GROUP BY</code>, a window function (<code>OVER (...)</code>) keeps every row while computing an aggregate or ranking "over a window" of related rows — e.g. rank each employee's salary within their department without collapsing rows into one per group.</p>
<pre><code>-- rank employees by salary within each department
SELECT name, department_id, salary,
  RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk
FROM employees;

-- correlated subquery: employees earning above their dept average
SELECT e.name, e.salary
FROM employees e
WHERE e.salary &gt; (
  SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department_id = e.department_id
);
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Reports (top-N per group, running totals, rankings) are painful with plain <code>GROUP BY</code> and easy with window functions — this is the SQL an advanced-database course adds on top of the basics.</div>`,
    `<span class="eyebrow">DBD301 · Chương 1 · Bài 1.1</span>
<h2>SQL nâng cao: join, subquery &amp; window function</h2>
<h3>Vượt ra ngoài SELECT cơ bản</h3>
<p>Môn này xây trên nền SQL nhập môn. Bạn đã biết <code>SELECT/WHERE/GROUP BY</code>; ở đây ta kết hợp nhiều bảng và tính giá trị trên tập các dòng liên quan.</p>
<h3>Join</h3>
<ul>
<li><strong>INNER JOIN</strong> — chỉ giữ dòng khớp ở cả hai bảng.</li>
<li><strong>LEFT JOIN</strong> — giữ toàn bộ dòng bảng trái, điền NULL cho cột bảng phải không khớp.</li>
<li><strong>Self-join</strong> — join một bảng với chính nó (vd nhân viên → quản lý, cùng nằm trong một bảng).</li>
</ul>
<h3>Subquery</h3>
<p>Subquery là truy vấn lồng trong truy vấn khác. <strong>Correlated subquery</strong> tham chiếu cột của truy vấn ngoài và chạy lại cho mỗi dòng ngoài; <strong>uncorrelated subquery</strong> chạy đúng một lần, độc lập, và thường rẻ hơn.</p>
<h3>Window function</h3>
<p>Khác với <code>GROUP BY</code>, window function (<code>OVER (...)</code>) giữ nguyên mọi dòng trong khi tính tổng hợp/xếp hạng theo một "cửa sổ" các dòng liên quan — vd xếp hạng lương nhân viên trong từng phòng ban mà không gộp dòng lại.</p>
<pre><code>-- xếp hạng lương nhân viên trong từng phòng ban
SELECT name, department_id, salary,
  RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk
FROM employees;

-- correlated subquery: nhân viên lương cao hơn trung bình phòng ban mình
SELECT e.name, e.salary
FROM employees e
WHERE e.salary &gt; (
  SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department_id = e.department_id
);
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Báo cáo (top-N mỗi nhóm, tổng luỹ kế, xếp hạng) khó làm bằng <code>GROUP BY</code> thuần nhưng dễ với window function — đây là phần SQL môn nâng cao thêm vào trên nền cơ bản.</div>`,
  ]]);

const c1q = quiz('dbd301-quiz-1', 'Quiz 1 — Advanced SQL|||Quiz 1 — SQL nâng cao', [
  { id: 'q1', question: 'Sự khác biệt chính giữa INNER JOIN và LEFT JOIN là?', options: ['INNER JOIN nhanh hơn LEFT JOIN', 'LEFT JOIN giữ toàn bộ dòng bên trái dù không khớp, INNER JOIN chỉ giữ dòng khớp cả hai bên', 'INNER JOIN dùng cho subquery, LEFT JOIN thì không', 'Không có khác biệt'], correctIndex: 1, explanation: 'LEFT JOIN giữ mọi dòng bảng trái, điền NULL cho cột phải không khớp; INNER JOIN chỉ giữ dòng khớp cả hai bảng.' },
  { id: 'q2', question: 'Window function (OVER(...)) khác GROUP BY ở điểm nào?', options: ['Window function luôn nhanh hơn', 'Window function gộp các dòng thành 1 dòng như GROUP BY', "Window function giữ nguyên từng dòng, chỉ tính thêm giá trị tổng hợp theo 'cửa sổ'", 'Window function không dùng được với ORDER BY'], correctIndex: 2, explanation: 'Không giống GROUP BY, window function KHÔNG gộp dòng — mỗi dòng gốc vẫn giữ, kèm thêm giá trị tính theo PARTITION/ORDER BY.' },
  { id: 'q3', question: 'Subquery tương quan (correlated subquery) là gì?', options: ['Subquery chạy đúng 1 lần, độc lập với truy vấn ngoài', 'Subquery tham chiếu cột của truy vấn ngoài, chạy lại cho mỗi dòng ngoài', 'Subquery luôn nằm trong WHERE', 'Subquery không được phép dùng hàm tổng hợp'], correctIndex: 1, explanation: 'Correlated subquery tham chiếu cột truy vấn ngoài nên phải chạy lại cho mỗi dòng của truy vấn ngoài — chậm hơn subquery độc lập nếu bảng lớn.' },
]);

const c2 = doc('dbd301-2-1-normalization', '2.1 — Advanced normalization & schema design|||2.1 — Chuẩn hoá nâng cao & thiết kế lược đồ',
  'Phụ thuộc hàm; 1NF/2NF/3NF/BCNF; khi nào denormalize có chủ đích là hợp lý.',
  [[
    `<span class="eyebrow">DBD301 · Chapter 2 · Lesson 2.1</span>
<h2>Advanced normalization &amp; schema design</h2>
<h3>Functional dependencies</h3>
<p>A <strong>functional dependency</strong> A → B means: for any two rows with the same value of A, B must also be the same. Normalization uses functional dependencies to remove redundancy.</p>
<h3>Normal forms</h3>
<ul>
<li><strong>1NF</strong> — atomic columns, no repeating groups.</li>
<li><strong>2NF</strong> — 1NF + no partial dependency on part of a composite key.</li>
<li><strong>3NF</strong> — 2NF + no transitive dependency (a non-key column depending on another non-key column).</li>
<li><strong>BCNF</strong> — every determinant of a functional dependency is a candidate key (stricter than 3NF).</li>
</ul>
<h3>When to denormalize</h3>
<p>Read-heavy reporting sometimes trades some redundancy for fewer joins — deliberate denormalization is a design decision, not a mistake, as long as it's documented and updates are controlled.</p>
<pre><code>-- Un-normalized: order_id, product_name, product_price repeated per line
-- 3NF: split into orders, order_items, products
CREATE TABLE products (product_id INT PRIMARY KEY, name VARCHAR(100), price NUMERIC);
CREATE TABLE orders (order_id INT PRIMARY KEY, customer_id INT, order_date DATE);
CREATE TABLE order_items (
  order_id INT REFERENCES orders(order_id),
  product_id INT REFERENCES products(product_id),
  quantity INT,
  PRIMARY KEY (order_id, product_id)
);
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Each fact should be stored in exactly one place. If updating one row can leave the database inconsistent, there's a hidden functional dependency you haven't normalized away.</div>`,
    `<span class="eyebrow">DBD301 · Chương 2 · Bài 2.1</span>
<h2>Chuẩn hoá nâng cao &amp; thiết kế lược đồ</h2>
<h3>Phụ thuộc hàm (functional dependency)</h3>
<p><strong>Phụ thuộc hàm</strong> A → B nghĩa là: hai dòng bất kỳ có cùng giá trị A thì phải cùng giá trị B. Chuẩn hoá dùng phụ thuộc hàm để loại dư dữ liệu.</p>
<h3>Các dạng chuẩn</h3>
<ul>
<li><strong>1NF</strong> — cột nguyên tố, không có nhóm lặp.</li>
<li><strong>2NF</strong> — 1NF + không phụ thuộc bộ phận vào một phần của khoá phức hợp.</li>
<li><strong>3NF</strong> — 2NF + không có phụ thuộc bắc cầu (cột không khoá phụ thuộc vào cột không khoá khác).</li>
<li><strong>BCNF</strong> — mọi vế trái của phụ thuộc hàm phải là khoá ứng viên (chặt hơn 3NF).</li>
</ul>
<h3>Khi nào nên phi chuẩn hoá</h3>
<p>Hệ thống đọc nhiều cho báo cáo đôi khi đánh đổi bớt chuẩn hoá để giảm số join — phi chuẩn hoá có chủ đích là quyết định thiết kế, không phải lỗi, miễn được ghi nhận rõ và kiểm soát cập nhật.</p>
<pre><code>-- Chưa chuẩn hoá: order_id, product_name, product_price lặp lại theo dòng
-- 3NF: tách thành orders, order_items, products
CREATE TABLE products (product_id INT PRIMARY KEY, name VARCHAR(100), price NUMERIC);
CREATE TABLE orders (order_id INT PRIMARY KEY, customer_id INT, order_date DATE);
CREATE TABLE order_items (
  order_id INT REFERENCES orders(order_id),
  product_id INT REFERENCES products(product_id),
  quantity INT,
  PRIMARY KEY (order_id, product_id)
);
</code></pre>
<div class="callout"><span class="badge">Quy tắc chung</span> Mỗi sự thật chỉ nên nằm ở đúng một chỗ. Nếu cập nhật một dòng có thể làm CSDL mất nhất quán, đang có một phụ thuộc hàm bạn chưa chuẩn hoá hết.</div>`,
  ]]);

const c2q = quiz('dbd301-quiz-2', 'Quiz 2 — Normalization|||Quiz 2 — Chuẩn hoá', [
  { id: 'q1', question: 'Phụ thuộc hàm (functional dependency) A → B nghĩa là?', options: ['A và B luôn bằng nhau', 'Hai dòng có cùng giá trị A thì cũng phải cùng giá trị B', 'B quyết định A', 'A là khoá ngoại của B'], correctIndex: 1, explanation: 'A → B: giá trị A xác định duy nhất giá trị B; hai dòng cùng A thì B phải giống nhau.' },
  { id: 'q2', question: '3NF thêm điều kiện gì so với 2NF?', options: ['Không có cột lặp', 'Không có phụ thuộc bắc cầu (transitive dependency) giữa các cột không khoá', 'Mỗi bảng chỉ có 1 cột', 'Không được dùng khoá ngoại'], correctIndex: 1, explanation: '3NF = 2NF + loại phụ thuộc bắc cầu: cột không khoá không được phụ thuộc vào cột không khoá khác.' },
  { id: 'q3', question: 'Denormalize (phi chuẩn hoá) có thể hợp lý khi nào?', options: ['Không bao giờ hợp lý', 'Khi hệ thống đọc nhiều, cần báo cáo nhanh và chấp nhận đánh đổi dư dữ liệu có kiểm soát', 'Chỉ khi hệ thống chỉ có 1 bảng', 'Khi không biết cách chuẩn hoá'], correctIndex: 1, explanation: 'Denormalize có chủ đích cho hệ báo cáo đọc nhiều là quyết định thiết kế hợp lý, miễn được ghi nhận rõ và kiểm soát cập nhật.' },
]);

const c3 = doc('dbd301-3-1-indexing-optimization', '3.1 — Indexes & query optimization|||3.1 — Chỉ mục & tối ưu truy vấn',
  'B-tree/hash/composite index; đọc EXPLAIN ANALYZE; đánh đổi tốc độ đọc/ghi.',
  [[
    `<span class="eyebrow">DBD301 · Chapter 3 · Lesson 3.1</span>
<h2>Indexes &amp; query optimization</h2>
<h3>Why indexes</h3>
<p>Without an index, finding a row means scanning the whole table (<strong>sequential/full scan</strong>). A <strong>B-tree index</strong> keeps sorted pointers so the database can jump straight to matching rows — close to O(log n) instead of O(n).</p>
<h3>Types of indexes</h3>
<ul>
<li><strong>B-tree</strong> — default, good for equality &amp; range queries (<code>=, &lt;, &gt;, BETWEEN</code>).</li>
<li><strong>Hash index</strong> — equality only, no range support.</li>
<li><strong>Composite index</strong> — covers multiple columns; column order matters (leftmost-prefix rule).</li>
</ul>
<h3>Reading a query plan</h3>
<p><code>EXPLAIN</code> (and <code>EXPLAIN ANALYZE</code>) shows how the optimizer will execute a query — look for <strong>Seq Scan</strong> (bad on a large table you filter often) vs <strong>Index Scan</strong>, and compare estimated vs actual row counts.</p>
<pre><code>EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 42;
-- Seq Scan on orders (cost=0.00..1834.00 rows=5) -- no index, scans everything
-- add an index:
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
-- re-run: Index Scan using idx_orders_customer_id (cost=0.29..8.31 rows=5)
</code></pre>
<div class="callout"><span class="badge">Trade-off</span> Indexes speed up reads but slow down writes (every INSERT/UPDATE must also update each index) and cost storage — index the columns you actually filter/join/sort by, not every column.</div>`,
    `<span class="eyebrow">DBD301 · Chương 3 · Bài 3.1</span>
<h2>Chỉ mục &amp; tối ưu truy vấn</h2>
<h3>Vì sao cần chỉ mục</h3>
<p>Không có chỉ mục, tìm một dòng nghĩa là quét toàn bảng (<strong>sequential/full scan</strong>). <strong>Chỉ mục B-tree</strong> giữ con trỏ đã sắp xếp để CSDL nhảy thẳng tới dòng khớp — gần O(log n) thay vì O(n).</p>
<h3>Các loại chỉ mục</h3>
<ul>
<li><strong>B-tree</strong> — mặc định, tốt cho truy vấn bằng &amp; theo khoảng (<code>=, &lt;, &gt;, BETWEEN</code>).</li>
<li><strong>Hash index</strong> — chỉ dùng cho so sánh bằng, không hỗ trợ khoảng.</li>
<li><strong>Composite index</strong> — phủ nhiều cột; thứ tự cột quan trọng (quy tắc tiền tố trái nhất).</li>
</ul>
<h3>Đọc kế hoạch truy vấn</h3>
<p><code>EXPLAIN</code> (và <code>EXPLAIN ANALYZE</code>) cho thấy optimizer sẽ thực thi truy vấn thế nào — chú ý <strong>Seq Scan</strong> (xấu trên bảng lớn hay bị lọc) so với <strong>Index Scan</strong>, và so sánh số dòng ước lượng với thực tế.</p>
<pre><code>EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 42;
-- Seq Scan on orders (cost=0.00..1834.00 rows=5) -- chưa có index, quét hết
-- thêm chỉ mục:
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
-- chạy lại: Index Scan using idx_orders_customer_id (cost=0.29..8.31 rows=5)
</code></pre>
<div class="callout"><span class="badge">Đánh đổi</span> Chỉ mục tăng tốc đọc nhưng làm chậm ghi (mỗi INSERT/UPDATE phải cập nhật thêm từng chỉ mục) và tốn dung lượng — chỉ đánh chỉ mục cột thực sự dùng để lọc/join/sắp xếp, không phải mọi cột.</div>`,
  ]]);

const c3q = quiz('dbd301-quiz-3', 'Quiz 3 — Indexing & optimization|||Quiz 3 — Chỉ mục & tối ưu', [
  { id: 'q1', question: 'Chỉ mục B-tree giúp gì?', options: ['Giảm dung lượng bảng', 'Tăng tốc tìm kiếm bằng cách giữ con trỏ đã sắp xếp, tránh quét toàn bảng', 'Tự động chuẩn hoá dữ liệu', 'Thay thế hoàn toàn khoá chính'], correctIndex: 1, explanation: 'B-tree index giữ dữ liệu đã sắp xếp nên tìm kiếm gần O(log n) thay vì quét hết bảng O(n).' },
  { id: 'q2', question: 'EXPLAIN ANALYZE dùng để làm gì?', options: ['Sửa lỗi cú pháp SQL', 'Xem kế hoạch thực thi thật (Seq Scan/Index Scan…) và số dòng thực tế của một câu truy vấn', 'Tự tạo chỉ mục', 'Xoá dữ liệu cũ'], correctIndex: 1, explanation: 'EXPLAIN (ANALYZE) cho thấy optimizer chọn kế hoạch nào và ước lượng/số dòng thật, giúp phát hiện Seq Scan không mong muốn.' },
  { id: 'q3', question: 'Đánh chỉ mục có đánh đổi gì?', options: ['Không có đánh đổi nào', 'Tăng tốc đọc nhưng làm chậm ghi (INSERT/UPDATE phải cập nhật thêm chỉ mục) và tốn dung lượng', 'Chỉ tốn dung lượng, không ảnh hưởng tốc độ ghi', 'Luôn làm chậm cả đọc và ghi'], correctIndex: 1, explanation: 'Mỗi chỉ mục phải được cập nhật khi ghi dữ liệu, nên chỉ mục tăng tốc đọc nhưng làm chậm ghi và tốn thêm dung lượng.' },
]);

const c4 = doc('dbd301-4-1-transactions-acid', '4.1 — Transactions, ACID & concurrency control|||4.1 — Giao dịch, ACID & điều khiển đồng thời',
  'Atomicity/Consistency/Isolation/Durability; dirty read/non-repeatable/phantom; mức cô lập; khoá & deadlock.',
  [[
    `<span class="eyebrow">DBD301 · Chapter 4 · Lesson 4.1</span>
<h2>Transactions, ACID &amp; concurrency control</h2>
<h3>ACID</h3>
<ul>
<li><strong>Atomicity</strong> — a transaction's statements all succeed or all roll back, no partial state.</li>
<li><strong>Consistency</strong> — a transaction moves the database from one valid state to another (constraints hold).</li>
<li><strong>Isolation</strong> — concurrent transactions don't see each other's uncommitted changes.</li>
<li><strong>Durability</strong> — once committed, changes survive a crash.</li>
</ul>
<h3>Isolation levels &amp; anomalies</h3>
<p>Stricter isolation prevents more anomalies but costs concurrency: <strong>dirty read</strong> (seeing uncommitted data), <strong>non-repeatable read</strong> (same query, different results within one transaction), <strong>phantom read</strong> (new rows appear matching a repeated condition). SQL defines READ UNCOMMITTED &lt; READ COMMITTED &lt; REPEATABLE READ &lt; SERIALIZABLE.</p>
<h3>Locking &amp; deadlock</h3>
<p>Databases use locks (shared/exclusive) to enforce isolation. A <strong>deadlock</strong> happens when two transactions each hold a lock the other needs — the database detects the cycle and aborts one transaction.</p>
<pre><code>BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- both updates happen, or neither (atomicity)
</code></pre>
<div class="callout"><span class="badge">Default matters</span> PostgreSQL's default isolation level is READ COMMITTED, not SERIALIZABLE — know your engine's default before assuming an anomaly can't happen.</div>`,
    `<span class="eyebrow">DBD301 · Chương 4 · Bài 4.1</span>
<h2>Giao dịch, ACID &amp; điều khiển đồng thời</h2>
<h3>ACID</h3>
<ul>
<li><strong>Atomicity (nguyên tử)</strong> — các câu lệnh trong giao dịch thành công toàn bộ hoặc rollback toàn bộ, không có trạng thái nửa vời.</li>
<li><strong>Consistency (nhất quán)</strong> — giao dịch đưa CSDL từ một trạng thái hợp lệ sang trạng thái hợp lệ khác (ràng buộc luôn đúng).</li>
<li><strong>Isolation (cô lập)</strong> — các giao dịch chạy đồng thời không thấy thay đổi chưa commit của nhau.</li>
<li><strong>Durability (bền vững)</strong> — đã commit thì dữ liệu sống sót qua sự cố sập hệ thống.</li>
</ul>
<h3>Mức cô lập &amp; bất thường</h3>
<p>Cô lập chặt hơn ngăn nhiều bất thường hơn nhưng tốn độ đồng thời: <strong>dirty read</strong> (đọc dữ liệu chưa commit), <strong>non-repeatable read</strong> (cùng truy vấn, kết quả khác trong một giao dịch), <strong>phantom read</strong> (dòng mới xuất hiện khớp điều kiện lặp lại). SQL định nghĩa READ UNCOMMITTED &lt; READ COMMITTED &lt; REPEATABLE READ &lt; SERIALIZABLE.</p>
<h3>Khoá &amp; deadlock</h3>
<p>CSDL dùng khoá (shared/exclusive) để đảm bảo cô lập. <strong>Deadlock</strong> xảy ra khi hai giao dịch mỗi bên giữ một khoá mà bên kia cần — CSDL phát hiện vòng chờ và tự hủy một giao dịch.</p>
<pre><code>BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- cả hai cập nhật xảy ra, hoặc không cái nào (atomicity)
</code></pre>
<div class="callout"><span class="badge">Mặc định khác nhau</span> Mức cô lập mặc định của PostgreSQL là READ COMMITTED, không phải SERIALIZABLE — biết mặc định của engine mình trước khi khẳng định một bất thường "không thể xảy ra".</div>`,
  ]]);

const c4q = quiz('dbd301-quiz-4', 'Quiz 4 — Transactions & ACID|||Quiz 4 — Giao dịch & ACID', [
  { id: 'q1', question: 'Tính chất nào của ACID đảm bảo một giao dịch KHÔNG bao giờ ở trạng thái nửa chừng?', options: ['Consistency', 'Isolation', 'Atomicity', 'Durability'], correctIndex: 2, explanation: 'Atomicity: các câu lệnh trong giao dịch thành công toàn bộ hoặc rollback toàn bộ, không có trạng thái nửa vời.' },
  { id: 'q2', question: 'Dirty read xảy ra khi nào?', options: ['Khi đọc dữ liệu đã commit', 'Khi một giao dịch đọc được dữ liệu CHƯA commit của giao dịch khác', 'Khi hai giao dịch cùng đọc dữ liệu giống nhau', 'Khi có deadlock'], correctIndex: 1, explanation: 'Dirty read: đọc dữ liệu chưa commit — nếu giao dịch ghi dữ liệu đó rollback, dữ liệu vừa đọc trở nên vô nghĩa.' },
  { id: 'q3', question: 'Deadlock xảy ra khi nào?', options: ['Một giao dịch chạy quá lâu', 'Hai giao dịch mỗi bên giữ một khoá mà bên kia đang cần, tạo vòng chờ lẫn nhau', 'Chỉ mục bị hỏng', 'Không có transaction nào đang chạy'], correctIndex: 1, explanation: 'Deadlock là vòng chờ khoá lẫn nhau giữa các giao dịch; hệ CSDL phát hiện và tự hủy (abort) một trong số đó.' },
]);

const c5 = doc('dbd301-5-1-procedures-triggers-views', '5.1 — Stored procedures, triggers & views|||5.1 — Stored procedure, trigger & view',
  'View vs materialized view; stored procedure/function; trigger BEFORE/AFTER; vì sao không nên lạm dụng.',
  [[
    `<span class="eyebrow">DBD301 · Chapter 5 · Lesson 5.1</span>
<h2>Stored procedures, triggers &amp; views</h2>
<h3>Views</h3>
<p>A <strong>view</strong> is a saved query you can select from like a table — it doesn't store data itself (unless it's a <em>materialized</em> view), but simplifies repeated complex queries and can restrict which columns/rows a user sees.</p>
<h3>Stored procedures &amp; functions</h3>
<p>Logic that lives inside the database — reusable, runs close to the data (less network round-trip), but harder to version-control and test than application code. Use for logic that must be atomic and data-local (e.g. multi-table validation).</p>
<h3>Triggers</h3>
<p>Code that fires automatically <strong>BEFORE</strong> or <strong>AFTER</strong> an <code>INSERT/UPDATE/DELETE</code>. Useful for audit logs and enforcing invariants a CHECK constraint can't express — but overusing triggers makes behavior invisible from application code ("magic" side effects).</p>
<pre><code>CREATE VIEW active_customers AS
  SELECT * FROM customers WHERE status = 'ACTIVE';

CREATE OR REPLACE FUNCTION log_salary_change() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO salary_audit(employee_id, old_salary, new_salary, changed_at)
  VALUES (OLD.id, OLD.salary, NEW.salary, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_salary_audit
AFTER UPDATE OF salary ON employees
FOR EACH ROW EXECUTE FUNCTION log_salary_change();
</code></pre>
<div class="callout"><span class="badge">Use sparingly</span> Triggers and stored procedures move logic out of application code and version control — great for guarantees the database itself must enforce, risky as a place to hide business rules.</div>`,
    `<span class="eyebrow">DBD301 · Chương 5 · Bài 5.1</span>
<h2>Stored procedure, trigger &amp; view</h2>
<h3>View</h3>
<p><strong>View</strong> là một câu truy vấn đã lưu, có thể SELECT như một bảng — nó không tự lưu dữ liệu (trừ khi là <em>materialized view</em>), nhưng giúp đơn giản hoá truy vấn phức tạp lặp lại và có thể hạn chế cột/dòng người dùng được thấy.</p>
<h3>Stored procedure &amp; function</h3>
<p>Logic sống bên trong CSDL — dùng lại được, chạy gần dữ liệu (ít round-trip qua mạng), nhưng khó version-control và test hơn code ứng dụng. Dùng cho logic cần tính nguyên tử và gắn chặt với dữ liệu (vd kiểm tra nhiều bảng).</p>
<h3>Trigger</h3>
<p>Code tự động chạy <strong>BEFORE</strong> hoặc <strong>AFTER</strong> một <code>INSERT/UPDATE/DELETE</code>. Hữu ích cho log kiểm toán và ép ràng buộc mà CHECK constraint không diễn tả được — nhưng lạm dụng trigger làm hành vi trở nên vô hình với code ứng dụng (hiệu ứng phụ "ma thuật").</p>
<pre><code>CREATE VIEW active_customers AS
  SELECT * FROM customers WHERE status = 'ACTIVE';

CREATE OR REPLACE FUNCTION log_salary_change() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO salary_audit(employee_id, old_salary, new_salary, changed_at)
  VALUES (OLD.id, OLD.salary, NEW.salary, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_salary_audit
AFTER UPDATE OF salary ON employees
FOR EACH ROW EXECUTE FUNCTION log_salary_change();
</code></pre>
<div class="callout"><span class="badge">Dùng có kiểm soát</span> Trigger và stored procedure đưa logic ra ngoài code ứng dụng và quy trình version-control — tốt cho những đảm bảo bản thân CSDL phải ép, nhưng rủi ro nếu dùng để giấu quy tắc nghiệp vụ.</div>`,
  ]]);

const c5q = quiz('dbd301-quiz-5', 'Quiz 5 — Procedures, triggers & views|||Quiz 5 — Stored procedure, trigger & view', [
  { id: 'q1', question: 'View khác gì với bảng thật?', options: ['View lưu dữ liệu riêng độc lập với bảng gốc', 'View là câu truy vấn đã lưu, không tự lưu dữ liệu (trừ materialized view), chạy lại truy vấn gốc mỗi lần SELECT', 'View luôn nhanh hơn bảng thật', 'View không cho phép SELECT'], correctIndex: 1, explanation: 'View (không materialized) chỉ lưu câu truy vấn; mỗi lần SELECT từ view là chạy lại truy vấn nền, không tự lưu dữ liệu riêng.' },
  { id: 'q2', question: 'Trigger AFTER UPDATE dùng để làm gì trong ví dụ ghi log lương?', options: ['Ngăn không cho UPDATE xảy ra', 'Tự động chạy sau khi UPDATE thành công để ghi lại lương cũ/mới vào bảng audit', 'Xoá dòng vừa UPDATE', 'Tạo chỉ mục mới'], correctIndex: 1, explanation: 'Trigger AFTER UPDATE tự chạy ngay sau khi câu UPDATE hoàn tất, thường dùng để ghi log/audit mà ứng dụng không cần tự gọi thêm.' },
  { id: 'q3', question: 'Vì sao nên dùng trigger/stored procedure có kiểm soát, không lạm dụng?', options: ['Vì chúng luôn chạy chậm hơn code ứng dụng', 'Vì lạm dụng làm logic nghiệp vụ trở nên vô hình, khó version-control và test như code ứng dụng', 'Vì cơ sở dữ liệu không cho phép tạo nhiều trigger', 'Vì trigger không hỗ trợ INSERT'], correctIndex: 1, explanation: "Trigger/stored procedure nằm ngoài code ứng dụng và ngoài quy trình review/test thông thường — lạm dụng biến thành hiệu ứng phụ 'vô hình' khó theo dõi." },
]);

const c6 = doc('dbd301-6-1-warehouse-olap', '6.1 — Data warehousing & OLAP|||6.1 — Kho dữ liệu & OLAP',
  'OLTP vs OLAP; star schema (fact/dimension); snowflake schema; ETL.',
  [[
    `<span class="eyebrow">DBD301 · Chapter 6 · Lesson 6.1</span>
<h2>Data warehousing &amp; OLAP</h2>
<h3>OLTP vs OLAP</h3>
<p><strong>OLTP</strong> (Online Transaction Processing) — the operational database: many small, fast reads/writes (place an order, update a balance). <strong>OLAP</strong> (Online Analytical Processing) — a separate <strong>data warehouse</strong> optimized for large, read-heavy analytical queries (sales by region by quarter) without slowing down production.</p>
<h3>Star schema</h3>
<ul>
<li><strong>Fact table</strong> — measurable events (e.g. <code>sales_fact</code>: quantity, revenue), one row per event, foreign keys to dimensions.</li>
<li><strong>Dimension tables</strong> — descriptive context (<code>dim_product</code>, <code>dim_customer</code>, <code>dim_date</code>) that facts join to.</li>
</ul>
<p>A <strong>star schema</strong> puts one fact table at the center with dimensions radiating out — simple joins, fast aggregate queries. A <strong>snowflake schema</strong> further normalizes the dimensions (more joins, less redundancy).</p>
<h3>ETL</h3>
<p><strong>ETL (Extract, Transform, Load)</strong> moves data from OLTP source systems into the warehouse on a schedule — cleaning, reshaping and aggregating along the way.</p>
<pre><code>SELECT d.year, p.category, SUM(f.revenue) AS total_revenue
FROM sales_fact f
JOIN dim_date d ON f.date_id = d.date_id
JOIN dim_product p ON f.product_id = p.product_id
GROUP BY d.year, p.category;
</code></pre>
<div class="callout"><span class="badge">Different job, different design</span> A schema normalized for OLTP integrity is often the wrong shape for OLAP speed — that's why warehouses deliberately denormalize into star schemas.</div>`,
    `<span class="eyebrow">DBD301 · Chương 6 · Bài 6.1</span>
<h2>Kho dữ liệu &amp; OLAP</h2>
<h3>OLTP so với OLAP</h3>
<p><strong>OLTP</strong> (xử lý giao dịch trực tuyến) — CSDL vận hành: nhiều lượt đọc/ghi nhỏ và nhanh (đặt hàng, cập nhật số dư). <strong>OLAP</strong> (xử lý phân tích trực tuyến) — một <strong>kho dữ liệu</strong> riêng, tối ưu cho truy vấn phân tích lớn, đọc nhiều (doanh số theo vùng theo quý) mà không làm chậm hệ vận hành.</p>
<h3>Star schema</h3>
<ul>
<li><strong>Fact table</strong> — các sự kiện đo được (vd <code>sales_fact</code>: số lượng, doanh thu), mỗi dòng là một sự kiện, khoá ngoại tới các dimension.</li>
<li><strong>Dimension table</strong> — bối cảnh mô tả (<code>dim_product</code>, <code>dim_customer</code>, <code>dim_date</code>) mà fact join tới.</li>
</ul>
<p><strong>Star schema</strong> đặt một fact table ở trung tâm với các dimension toả ra — join đơn giản, truy vấn tổng hợp nhanh. <strong>Snowflake schema</strong> chuẩn hoá tiếp các dimension (nhiều join hơn, ít dư hơn).</p>
<h3>ETL</h3>
<p><strong>ETL (Extract, Transform, Load)</strong> chuyển dữ liệu từ hệ OLTP nguồn vào kho dữ liệu theo lịch — làm sạch, biến đổi và tổng hợp dọc đường.</p>
<pre><code>SELECT d.year, p.category, SUM(f.revenue) AS total_revenue
FROM sales_fact f
JOIN dim_date d ON f.date_id = d.date_id
JOIN dim_product p ON f.product_id = p.product_id
GROUP BY d.year, p.category;
</code></pre>
<div class="callout"><span class="badge">Việc khác, thiết kế khác</span> Lược đồ chuẩn hoá cho tính nhất quán OLTP thường là hình dạng SAI cho tốc độ OLAP — đó là lý do kho dữ liệu cố ý phi chuẩn hoá thành star schema.</div>`,
  ]]);

const c6q = quiz('dbd301-quiz-6', 'Quiz 6 — Warehousing & OLAP|||Quiz 6 — Kho dữ liệu & OLAP', [
  { id: 'q1', question: 'OLTP và OLAP khác nhau ở điểm nào?', options: ['OLTP dùng cho báo cáo, OLAP dùng cho giao dịch', 'OLTP tối ưu cho giao dịch nhỏ-nhanh; OLAP tối ưu cho truy vấn phân tích lớn, đọc nhiều', 'Không có khác biệt thực tế', 'OLAP luôn nhanh hơn OLTP với mọi loại truy vấn'], correctIndex: 1, explanation: 'OLTP phục vụ giao dịch vận hành (đặt hàng, cập nhật số dư); OLAP phục vụ truy vấn phân tích lớn trên kho dữ liệu riêng.' },
  { id: 'q2', question: 'Trong star schema, fact table chứa gì?', options: ['Thông tin mô tả như tên sản phẩm, tên khách hàng', 'Các sự kiện đo được (số lượng, doanh thu…) kèm khoá ngoại tới các bảng dimension', 'Chỉ chứa ngày tháng', 'Không chứa khoá ngoại nào'], correctIndex: 1, explanation: 'Fact table lưu các phép đo của sự kiện (VD doanh thu) và khoá ngoại tới các dimension mô tả bối cảnh (sản phẩm, khách hàng, thời gian).' },
  { id: 'q3', question: 'ETL là viết tắt của?', options: ['Extract, Transform, Load', 'Extract, Transfer, List', 'Edit, Transform, Load', 'Extract, Test, Load'], correctIndex: 0, explanation: 'ETL = Extract (trích), Transform (biến đổi), Load (tải) — quy trình đưa dữ liệu từ hệ OLTP vào kho dữ liệu.' },
]);

const c7 = doc('dbd301-7-1-nosql-distributed', '7.1 — NoSQL & distributed databases|||7.1 — NoSQL & cơ sở dữ liệu phân tán',
  'Key-value/document/column-family/graph; định lý CAP; sharding & replication.',
  [[
    `<span class="eyebrow">DBD301 · Chapter 7 · Lesson 7.1</span>
<h2>NoSQL &amp; distributed databases</h2>
<h3>Why NoSQL</h3>
<p>Relational databases assume a fixed schema and mostly vertical scaling. <strong>NoSQL</strong> databases trade some of SQL's guarantees for flexible schemas and horizontal scaling across many machines. Four common families:</p>
<ul>
<li><strong>Key-value</strong> (Redis) — simplest, fastest; lookup by key.</li>
<li><strong>Document</strong> (MongoDB) — JSON-like documents, flexible fields per record.</li>
<li><strong>Column-family</strong> (Cassandra) — wide rows, optimized for write-heavy, huge scale.</li>
<li><strong>Graph</strong> (Neo4j) — nodes &amp; edges, optimized for traversing relationships.</li>
</ul>
<h3>CAP theorem</h3>
<p>In a distributed system, during a network partition you must choose: <strong>Consistency</strong> (every read sees the latest write) or <strong>Availability</strong> (every request gets a response) — you can't have both. Most NoSQL systems choose <strong>AP</strong> (available, eventually consistent); traditional relational databases choose <strong>CP</strong> or simply run single-node (no partition to worry about).</p>
<h3>Sharding &amp; replication</h3>
<p><strong>Sharding</strong> splits data across nodes by key (horizontal scaling for writes). <strong>Replication</strong> copies the same data to multiple nodes (scaling reads, surviving node failure). The two combine in most large-scale distributed databases.</p>
<pre><code>// MongoDB document — flexible schema, nested data, no JOIN needed
{
  "_id": "u123",
  "name": "Nguyen Van A",
  "orders": [
    { "product": "Keyboard", "qty": 1 },
    { "product": "Mouse", "qty": 2 }
  ]
}
</code></pre>
<div class="callout"><span class="badge">Not a replacement</span> NoSQL doesn't replace relational databases — it's a different trade-off for a different shape of problem. Many real systems run both, side by side.</div>`,
    `<span class="eyebrow">DBD301 · Chương 7 · Bài 7.1</span>
<h2>NoSQL &amp; cơ sở dữ liệu phân tán</h2>
<h3>Vì sao có NoSQL</h3>
<p>CSDL quan hệ giả định lược đồ cố định và chủ yếu scale theo chiều dọc. CSDL <strong>NoSQL</strong> đánh đổi bớt vài đảm bảo của SQL để có lược đồ linh hoạt và scale ngang qua nhiều máy. Bốn nhóm phổ biến:</p>
<ul>
<li><strong>Key-value</strong> (Redis) — đơn giản nhất, nhanh nhất; tra theo khoá.</li>
<li><strong>Document</strong> (MongoDB) — tài liệu dạng JSON, trường linh hoạt theo từng bản ghi.</li>
<li><strong>Column-family</strong> (Cassandra) — dòng rộng, tối ưu cho ghi nhiều, quy mô khổng lồ.</li>
<li><strong>Graph</strong> (Neo4j) — nút &amp; cạnh, tối ưu để duyệt quan hệ.</li>
</ul>
<h3>Định lý CAP</h3>
<p>Trong hệ phân tán, khi xảy ra network partition phải chọn: <strong>Consistency</strong> (mọi lần đọc thấy dữ liệu mới nhất) hoặc <strong>Availability</strong> (mọi yêu cầu đều được trả lời) — không thể có cả hai. Hầu hết NoSQL chọn <strong>AP</strong> (luôn sẵn sàng, nhất quán dần); CSDL quan hệ truyền thống chọn <strong>CP</strong> hoặc chạy đơn node (không có partition để lo).</p>
<h3>Sharding &amp; replication</h3>
<p><strong>Sharding</strong> chia dữ liệu ra nhiều node theo khoá (scale ghi theo chiều ngang). <strong>Replication</strong> sao chép cùng dữ liệu ra nhiều node (scale đọc, chịu lỗi khi node hỏng). Hai kỹ thuật này kết hợp trong hầu hết CSDL phân tán quy mô lớn.</p>
<pre><code>// Document MongoDB — lược đồ linh hoạt, dữ liệu lồng, không cần JOIN
{
  "_id": "u123",
  "name": "Nguyen Van A",
  "orders": [
    { "product": "Keyboard", "qty": 1 },
    { "product": "Mouse", "qty": 2 }
  ]
}
</code></pre>
<div class="callout"><span class="badge">Không phải thay thế</span> NoSQL không thay thế CSDL quan hệ — nó là một đánh đổi khác cho một dạng bài toán khác. Nhiều hệ thống thật chạy song song cả hai.</div>`,
  ]]);

const c7q = quiz('dbd301-quiz-7', 'Quiz 7 — NoSQL & distributed|||Quiz 7 — NoSQL & phân tán', [
  { id: 'q1', question: 'Theo định lý CAP, khi xảy ra network partition, hệ phân tán phải chọn giữa?', options: ['Consistency và Performance', 'Consistency và Availability', 'Availability và Durability', 'Partition và Atomicity'], correctIndex: 1, explanation: 'CAP: khi có partition, phải chọn Consistency (dữ liệu mới nhất) hoặc Availability (luôn trả lời được), không thể có cả hai.' },
  { id: 'q2', question: 'Sharding khác gì với replication?', options: ['Sharding chia dữ liệu ra nhiều node theo khoá; replication sao chép CÙNG dữ liệu ra nhiều node', 'Chúng giống nhau hoàn toàn', 'Sharding chỉ dùng cho NoSQL, replication chỉ dùng cho SQL', 'Replication làm giảm khả năng chịu lỗi'], correctIndex: 0, explanation: 'Sharding chia (partition) dữ liệu theo khoá ra nhiều node để scale ghi; replication sao chép cùng dữ liệu ra nhiều node để scale đọc và chịu lỗi.' },
  { id: 'q3', question: 'NoSQL document (như MongoDB) phù hợp khi nào?', options: ['Khi cần schema cố định tuyệt đối cho mọi bản ghi', 'Khi cần lược đồ linh hoạt, dữ liệu lồng nhau, không cần JOIN phức tạp', 'Khi cần ACID nghiêm ngặt trên nhiều bảng như RDBMS', 'NoSQL luôn thay thế hoàn toàn SQL'], correctIndex: 1, explanation: 'Document store phù hợp khi cần lược đồ linh hoạt theo từng bản ghi và dữ liệu lồng nhau tự nhiên, đánh đổi bớt một số ràng buộc quan hệ chặt của SQL.' },
]);

const c8 = doc('dbd301-8-1-security-backup', '8.1 — Database security, backup & administration|||8.1 — Bảo mật CSDL, sao lưu-phục hồi & quản trị',
  'Least privilege; chống SQL injection bằng parameterized query; full/incremental backup; PITR; RPO/RTO.',
  [[
    `<span class="eyebrow">DBD301 · Chapter 8 · Lesson 8.1</span>
<h2>Database security, backup/recovery &amp; administration</h2>
<h3>Access control</h3>
<p><strong>Authentication</strong> (who are you) vs <strong>authorization</strong> (what can you do). Follow the <strong>principle of least privilege</strong>: grant only the permissions a role actually needs — an application's DB user rarely needs <code>DROP TABLE</code>.</p>
<pre><code>CREATE ROLE app_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;
REVOKE DELETE, DROP ON orders FROM app_readonly;
</code></pre>
<h3>SQL injection</h3>
<p>Never build SQL by concatenating raw user input — always use <strong>parameterized queries / prepared statements</strong>, which send the query and the data separately so user input can never change the query's structure.</p>
<h3>Backup &amp; recovery</h3>
<ul>
<li><strong>Full backup</strong> — a complete copy at a point in time.</li>
<li><strong>Incremental/differential backup</strong> — only what changed since the last backup, faster and smaller.</li>
<li><strong>Point-in-time recovery (PITR)</strong> — replay the write-ahead log (WAL) from a base backup to restore to any exact moment, not just the last backup's time.</li>
</ul>
<p>Two numbers to define with the business before an incident happens: <strong>RPO</strong> (Recovery Point Objective — how much data loss is acceptable) and <strong>RTO</strong> (Recovery Time Objective — how long recovery may take).</p>
<div class="callout"><span class="badge">Untested backup = no backup</span> A backup you have never restored is a guess, not a guarantee — schedule regular restore drills.</div>`,
    `<span class="eyebrow">DBD301 · Chương 8 · Bài 8.1</span>
<h2>Bảo mật CSDL, sao lưu-phục hồi &amp; quản trị</h2>
<h3>Kiểm soát truy cập</h3>
<p><strong>Authentication</strong> (bạn là ai) khác <strong>authorization</strong> (bạn được làm gì). Theo <strong>nguyên tắc least privilege</strong>: chỉ cấp đúng quyền một vai trò thực sự cần — user CSDL của ứng dụng hiếm khi cần <code>DROP TABLE</code>.</p>
<pre><code>CREATE ROLE app_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;
REVOKE DELETE, DROP ON orders FROM app_readonly;
</code></pre>
<h3>SQL injection</h3>
<p>Không bao giờ nối SQL trực tiếp với input người dùng — luôn dùng <strong>parameterized query / prepared statement</strong>, gửi câu lệnh và dữ liệu tách riêng để input người dùng không thể thay đổi cấu trúc câu lệnh.</p>
<h3>Sao lưu &amp; phục hồi</h3>
<ul>
<li><strong>Full backup</strong> — bản sao đầy đủ tại một thời điểm.</li>
<li><strong>Incremental/differential backup</strong> — chỉ phần đã đổi từ lần backup trước, nhanh và nhỏ hơn.</li>
<li><strong>Point-in-time recovery (PITR)</strong> — phát lại write-ahead log (WAL) từ một base backup để khôi phục về đúng một thời điểm bất kỳ, không chỉ thời điểm backup gần nhất.</li>
</ul>
<p>Hai con số cần định nghĩa với nghiệp vụ TRƯỚC khi sự cố xảy ra: <strong>RPO</strong> (Recovery Point Objective — lượng dữ liệu mất chấp nhận được) và <strong>RTO</strong> (Recovery Time Objective — thời gian phục hồi tối đa cho phép).</p>
<div class="callout"><span class="badge">Backup chưa test = không có backup</span> Một bản backup chưa từng được khôi phục thử chỉ là một lời đoán, không phải một sự đảm bảo — lên lịch diễn tập khôi phục định kỳ.</div>`,
  ]]);

const c8q = quiz('dbd301-quiz-8', 'Quiz 8 — Security & backup|||Quiz 8 — Bảo mật & sao lưu', [
  { id: 'q1', question: "Nguyên tắc 'least privilege' nghĩa là?", options: ['Cấp toàn quyền cho mọi user để tiện dùng', 'Chỉ cấp đúng quyền một vai trò thực sự cần, không hơn', 'Chỉ admin mới được đăng nhập', 'Không cấp quyền cho bất kỳ ai'], correctIndex: 1, explanation: 'Least privilege: mỗi role/user chỉ nên có đúng quyền cần cho công việc của họ, hạn chế thiệt hại nếu tài khoản bị lộ.' },
  { id: 'q2', question: 'Cách đúng để chống SQL injection là?', options: ['Lọc thủ công ký tự đặc biệt trong chuỗi nối SQL', 'Dùng parameterized query / prepared statement, tách riêng câu lệnh và dữ liệu', 'Ẩn thông báo lỗi', 'Chỉ dùng stored procedure là đủ, không cần gì khác'], correctIndex: 1, explanation: 'Parameterized query gửi câu lệnh và dữ liệu tách biệt tới CSDL nên input người dùng không thể thay đổi cấu trúc câu lệnh.' },
  { id: 'q3', question: 'RPO (Recovery Point Objective) đo điều gì?', options: ['Thời gian tối đa để phục hồi hệ thống', 'Lượng dữ liệu tối đa được phép mất tính từ lần backup gần nhất', 'Số lượng bản backup cần giữ', 'Tốc độ mạng khi backup'], correctIndex: 1, explanation: 'RPO là lượng dữ liệu/thời gian tổn thất tối đa chấp nhận được nếu phải khôi phục từ backup gần nhất; RTO mới là thời gian phục hồi tối đa.' },
]);

const taiLieu = doc('dbd301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">DBD301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything for Advanced Database — advanced SQL, schema design, indexing, transactions, procedural SQL, warehousing, NoSQL and security — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal references.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DBD301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.db-book.com/" target="_blank" rel="noopener"><em>Database System Concepts</em> — Silberschatz, Korth &amp; Sudarshan</a></li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/fundamentals-of-database-systems/P200000003226" target="_blank" rel="noopener"><em>Fundamentals of Database Systems</em> — Elmasri &amp; Navathe</a></li>
<li><a href="https://dataintensive.net/" target="_blank" rel="noopener"><em>Designing Data-Intensive Applications</em> — Martin Kleppmann</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://use-the-index-luke.com/" target="_blank" rel="noopener">Use The Index, Luke! — SQL indexing &amp; performance</a></li>
<li><a href="https://www.postgresql.org/docs/current/" target="_blank" rel="noopener">PostgreSQL official documentation</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@cmudatabasegroup" target="_blank" rel="noopener">CMU Database Group (Andy Pavlo)</a> — full graduate-level DB courses, free</li>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp</a> — SQL &amp; database design courses</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.db-fiddle.com/" target="_blank" rel="noopener">DB Fiddle</a> — run SQL against real Postgres/MySQL/SQLite in the browser</li>
<li><a href="https://dbdiagram.io/" target="_blank" rel="noopener">dbdiagram.io</a> — draw ER diagrams from SQL-like syntax</li>
<li><a href="https://www.mongodb.com/docs/manual/" target="_blank" rel="noopener">MongoDB Manual</a> — hands-on NoSQL practice</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — advanced SQL (joins, subqueries, window functions) and normalization/BCNF.</li>
<li><strong>Practice</strong> — write and EXPLAIN real queries on DB Fiddle; design a schema and check every functional dependency.</li>
<li><strong>Go deeper</strong> — transactions/ACID/isolation levels, procedural SQL, star-schema warehousing.</li>
<li><strong>Job-ready</strong> — read query plans in production, know when to reach for NoSQL, and never skip a backup restore drill.</li>
</ol></div>`,
    `<span class="eyebrow">DBD301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ cho Cơ sở dữ liệu nâng cao — SQL nâng cao, thiết kế lược đồ, chỉ mục, giao dịch, SQL thủ tục, kho dữ liệu, NoSQL và bảo mật — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DBD301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.db-book.com/" target="_blank" rel="noopener"><em>Database System Concepts</em> — Silberschatz, Korth &amp; Sudarshan</a></li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/fundamentals-of-database-systems/P200000003226" target="_blank" rel="noopener"><em>Fundamentals of Database Systems</em> — Elmasri &amp; Navathe</a></li>
<li><a href="https://dataintensive.net/" target="_blank" rel="noopener"><em>Designing Data-Intensive Applications</em> — Martin Kleppmann</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://use-the-index-luke.com/" target="_blank" rel="noopener">Use The Index, Luke! — chỉ mục &amp; hiệu năng SQL</a></li>
<li><a href="https://www.postgresql.org/docs/current/" target="_blank" rel="noopener">Tài liệu chính thức PostgreSQL</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@cmudatabasegroup" target="_blank" rel="noopener">CMU Database Group (Andy Pavlo)</a> — trọn khoá CSDL sau đại học, miễn phí</li>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp</a> — khoá SQL &amp; thiết kế CSDL</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.db-fiddle.com/" target="_blank" rel="noopener">DB Fiddle</a> — chạy SQL thật trên Postgres/MySQL/SQLite ngay trình duyệt</li>
<li><a href="https://dbdiagram.io/" target="_blank" rel="noopener">dbdiagram.io</a> — vẽ sơ đồ ER từ cú pháp giống SQL</li>
<li><a href="https://www.mongodb.com/docs/manual/" target="_blank" rel="noopener">MongoDB Manual</a> — luyện tay NoSQL</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — SQL nâng cao (join, subquery, window function) và chuẩn hoá/BCNF.</li>
<li><strong>Luyện tập</strong> — viết và EXPLAIN truy vấn thật trên DB Fiddle; thiết kế lược đồ và soát từng phụ thuộc hàm.</li>
<li><strong>Đào sâu thực tế</strong> — giao dịch/ACID/mức cô lập, SQL thủ tục, kho dữ liệu star schema.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc query plan trên production, biết khi nào cần NoSQL, và không bao giờ bỏ qua diễn tập khôi phục backup.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'DBD301',
    slug: 'dbd301-advanced-database',
    title: 'Advanced Database',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DBD301.webp',
    shortDescription: "Advanced SQL (joins, subqueries, window functions), normalization, indexing & query optimization, transactions & ACID, procedures/triggers/views, data warehousing & OLAP, NoSQL & distributed databases, security & backup.|||SQL nâng cao (join, subquery, window function), chuẩn hoá, chỉ mục & tối ưu truy vấn, giao dịch & ACID, procedure/trigger/view, kho dữ liệu & OLAP, NoSQL & CSDL phân tán, bảo mật & sao lưu.",
    description: 'Môn <strong>DBD301 — Advanced Database</strong> (kỳ 5) đi tiếp sau môn nhập môn CSDL. Từ <strong>SQL nâng cao</strong> (join, subquery, window function) → <strong>chuẩn hoá &amp; thiết kế lược đồ</strong> (phụ thuộc hàm, 2NF/3NF/BCNF) → <strong>chỉ mục &amp; tối ưu truy vấn</strong> (EXPLAIN, B-tree) → <strong>giao dịch, ACID &amp; điều khiển đồng thời</strong> → <strong>stored procedure/trigger/view</strong> → <strong>kho dữ liệu &amp; OLAP</strong> (star schema) → <strong>NoSQL &amp; CSDL phân tán</strong> (CAP, sharding) → <strong>bảo mật, sao lưu &amp; quản trị</strong>. Bám giáo trình Silberschatz/Elmasri/Kleppmann, song ngữ, có ví dụ SQL và quiz mỗi chương.',
    whatYouLearn: 'JOIN/subquery tương quan/window function; phụ thuộc hàm & 1NF-BCNF; chỉ mục B-tree/hash/composite & đọc EXPLAIN; ACID, mức cô lập, khoá & deadlock; view/materialized view, stored procedure, trigger BEFORE/AFTER; OLTP vs OLAP, star/snowflake schema, ETL; NoSQL (key-value/document/column/graph), định lý CAP, sharding & replication; least privilege, chống SQL injection, backup/PITR, RPO/RTO.',
    requirements: 'Đã học qua CSDL nhập môn (bảng, khoá chính/ngoại, SQL cơ bản SELECT/WHERE/GROUP BY/JOIN đơn giản). Nên cài PostgreSQL hoặc dùng DB Fiddle để chạy ví dụ.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao "nâng cao", lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — SQL nâng cao|||Chapter 1 — Advanced SQL', description: 'Join, subquery, window function.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chuẩn hoá & thiết kế lược đồ|||Chapter 2 — Normalization & schema design', description: 'Phụ thuộc hàm, 1NF-BCNF, denormalize.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chỉ mục & tối ưu truy vấn|||Chapter 3 — Indexing & query optimization', description: 'B-tree, EXPLAIN, đánh đổi đọc/ghi.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Giao dịch, ACID & điều khiển đồng thời|||Chapter 4 — Transactions, ACID & concurrency', description: 'ACID, mức cô lập, khoá & deadlock.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Stored procedure, trigger & view|||Chapter 5 — Procedures, triggers & views', description: 'View, procedure, trigger BEFORE/AFTER.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kho dữ liệu & OLAP|||Chapter 6 — Data warehousing & OLAP', description: 'OLTP vs OLAP, star schema, ETL.', lessons: [c6, c6q] },
    { title: 'Chương 7 — NoSQL & CSDL phân tán|||Chapter 7 — NoSQL & distributed databases', description: 'CAP, sharding, replication.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Bảo mật, sao lưu-phục hồi & quản trị|||Chapter 8 — Security, backup & administration', description: 'Least privilege, SQL injection, PITR, RPO/RTO.', lessons: [c8, c8q] },
  ],
};
