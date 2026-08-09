/**
 * Web Foundations — Chương 8: Dữ liệu & SQL (database, SELECT, CRUD viết dữ liệu,
 * quan hệ + JOIN, ORM/Prisma). Nền tảng dữ liệu phía server cho khoá NODE.JS.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${. Quiz có field content.
 */

export default {
  title: 'Chapter 8 — Data & SQL|||Chương 8 — Dữ liệu & SQL',
  description: 'API của bạn ở Chương 6 trả về dữ liệu — nhưng dữ liệu đó nằm ở đâu, và làm sao đọc/ghi nó một cách đáng tin cậy? Học cách một cơ sở dữ liệu quan hệ tổ chức dữ liệu thành bảng, cách đọc dữ liệu bằng SELECT, cách thay đổi dữ liệu an toàn với INSERT/UPDATE/DELETE, cách nối nhiều bảng bằng JOIN, và cách một ORM như Prisma (đúng công cụ dự án này dùng) biến các dòng SQL thành object JavaScript quen thuộc.',
  lessons: [
    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — What a database is|||8.1 — Cơ sở dữ liệu là gì',
      slug: 'wf-8-1-databases',
      type: 'VIDEO',
      isFreePreview: true,
      video: { url: 'https://youtu.be/27axs9dO7AE', durationSeconds: 0 },
      description: 'Vì sao ứng dụng cần lưu trữ bền vững, bảng/dòng/cột, và sự khác biệt giữa cơ sở dữ liệu quan hệ với NoSQL.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>An app forgets everything unless something remembers for it</h2>
<p class="lead">Back in Chapter 6, a request came in and a JSON response went out — <code>{ "id": 42, "name": "Lan" }</code>. But where did that data actually live? A running Node.js process keeps things only in memory (RAM), and RAM empties the instant the process restarts or the server reboots. A <strong>database</strong> is separate software whose entire job is to store data <em>persistently</em> — it survives restarts, crashes, and redeploys.</p>

<h3>Tables, rows and columns</h3>
<p>The most common kind of database is <strong>relational</strong>, and it organizes data almost exactly like a spreadsheet: a <strong>table</strong> is a named grid, a <strong>column</strong> is a labelled field every entry has (with a fixed type), and a <strong>row</strong> is one single entry — one user, one post, one order.</p>
<pre><code>Table: users
┌────┬────────┬───────────────────┐
│ id │ name   │ email              │
├────┼────────┼───────────────────┤
│ 1  │ Lan    │ lan@example.com   │
│ 2  │ Minh   │ minh@example.com  │
└────┴────────┴───────────────────┘</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Table</span><span class="v">A named collection of same-shaped records, e.g. "users" or "posts".</span></div>
  <div class="kv"><span class="k">Column</span><span class="v">A named field with a type, shared by every row: id (number), name (text)...</span></div>
  <div class="kv"><span class="k">Row</span><span class="v">One record — one specific user, with a value for every column.</span></div>
</div>

<h3>Relational vs NoSQL — the one-paragraph version</h3>
<p>A <strong>relational</strong> database (like PostgreSQL, MySQL) stores strict tables with fixed columns and lets tables reference each other by ID (Lesson 8.4) — great when your data has clear structure and things relate to other things. A <strong>NoSQL</strong> database (like MongoDB) instead stores flexible documents (closer to JSON) with no fixed shape and often no cross-references — great for loosely structured or rapidly changing data. Most everyday apps, including this project, use relational: the structure of "a user has posts" maps cleanly onto tables.</p>

<h3>Recap: that API response WAS a database query</h3>
<p class="note-ct"><strong>Connecting back to Chapter 6:</strong> when a GET request returns <code>{ "id": 42, "name": "Lan" }</code>, the server did not invent that JSON — it asked a database "give me the row where id = 42" and turned the row into JSON. Every API you use daily is, underneath, a thin translator between HTTP and a database. This chapter teaches the language on the other side of that translator: SQL.</p>

<h3>SQL — the language you talk to a relational database with</h3>
<p><strong>SQL</strong> (Structured Query Language) is how you ask a relational database to read or change data. It reads close to English: <code>SELECT name FROM users WHERE id = 42</code> means "give me the name column, from the users table, where id equals 42". The next four lessons teach exactly this language, one piece at a time.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Một app quên sạch mọi thứ trừ khi có gì đó nhớ giúp nó</h2>
<p class="lead">Quay lại Chương 6, một yêu cầu tới và một phản hồi JSON đi ra — <code>{ "id": 42, "name": "Lan" }</code>. Nhưng dữ liệu đó thật ra nằm ở đâu? Một tiến trình Node.js đang chạy chỉ giữ mọi thứ trong bộ nhớ (RAM), và RAM trống rỗng ngay khi tiến trình khởi động lại hoặc server reboot. Một <strong>cơ sở dữ liệu (database)</strong> là phần mềm riêng biệt mà toàn bộ công việc của nó là lưu dữ liệu <em>bền vững</em> — sống sót qua khởi động lại, sập, và deploy lại.</p>

<h3>Bảng, dòng và cột</h3>
<p>Loại database phổ biến nhất là <strong>quan hệ (relational)</strong>, và nó tổ chức dữ liệu gần giống hệt một bảng tính: một <strong>bảng (table)</strong> là một lưới có tên, một <strong>cột (column)</strong> là một trường có nhãn mà mọi mục đều có (với kiểu cố định), và một <strong>dòng (row)</strong> là một mục duy nhất — một user, một bài viết, một đơn hàng.</p>
<pre><code>Bảng: users
┌────┬────────┬───────────────────┐
│ id │ name   │ email              │
├────┼────────┼───────────────────┤
│ 1  │ Lan    │ lan@example.com   │
│ 2  │ Minh   │ minh@example.com  │
└────┴────────┴───────────────────┘</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Table</span><span class="v">Một tập hợp có tên gồm các bản ghi cùng hình dạng, vd "users" hay "posts".</span></div>
  <div class="kv"><span class="k">Column</span><span class="v">Một trường có tên với một kiểu, mọi dòng đều có: id (số), name (chữ)...</span></div>
  <div class="kv"><span class="k">Row</span><span class="v">Một bản ghi — một user cụ thể, với một giá trị cho mỗi cột.</span></div>
</div>

<h3>Quan hệ vs NoSQL — bản một đoạn</h3>
<p>Một database <strong>quan hệ (relational)</strong> (như PostgreSQL, MySQL) lưu các bảng nghiêm ngặt với cột cố định và cho phép bảng tham chiếu lẫn nhau qua ID (Bài 8.4) — tuyệt vời khi dữ liệu của bạn có cấu trúc rõ ràng và các thứ liên quan tới nhau. Một database <strong>NoSQL</strong> (như MongoDB) thay vào đó lưu các document linh hoạt (gần với JSON) không có hình dạng cố định và thường không tham chiếu chéo — tuyệt vời cho dữ liệu cấu trúc lỏng lẻo hoặc thay đổi nhanh. Hầu hết app hằng ngày, kể cả dự án này, dùng quan hệ: cấu trúc "một user có nhiều bài viết" khớp gọn gàng vào các bảng.</p>

<h3>Ôn lại: phản hồi API đó CHÍNH LÀ một truy vấn database</h3>
<p class="note-ct"><strong>Nối lại với Chương 6:</strong> khi một yêu cầu GET trả về <code>{ "id": 42, "name": "Lan" }</code>, server không tự bịa ra JSON đó — nó hỏi một database "cho tôi dòng có id = 42" rồi biến dòng đó thành JSON. Mọi API bạn dùng hằng ngày, phía dưới, đều là một lớp dịch mỏng giữa HTTP và một database. Chương này dạy ngôn ngữ ở phía bên kia của lớp dịch đó: SQL.</p>

<h3>SQL — ngôn ngữ bạn nói chuyện với database quan hệ</h3>
<p><strong>SQL</strong> (Structured Query Language) là cách bạn yêu cầu một database quan hệ đọc hay đổi dữ liệu. Nó đọc gần giống tiếng Anh: <code>SELECT name FROM users WHERE id = 42</code> nghĩa là "cho tôi cột name, từ bảng users, nơi id bằng 42". Bốn bài kế tiếp dạy đúng ngôn ngữ này, từng mảnh một.</p>
</div>
`,
    },

    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — Reading data with SELECT|||8.2 — Đọc dữ liệu với SELECT',
      slug: 'wf-8-2-select',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/9ylj9NR0Lcg', durationSeconds: 0 },
      description: 'Cú pháp SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT, với bảng ví dụ nhỏ và kết quả chính xác.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>SELECT is how you ask "show me this data"</h2>
<p class="lead">Every read starts with <strong>SELECT</strong>. It names which columns you want, which table to read from, and — optionally — which rows to keep, what order to return them in, and how many. Let's use one small example table for every query in this lesson.</p>

<h3>The example table: posts</h3>
<pre><code>id | title              | views | published
---+--------------------+-------+----------
1  | Hello World         | 120   | true
2  | Learning SQL        | 45    | true
3  | Draft Post          | 3     | false
4  | Node.js Basics      | 300   | true
5  | Old Announcement    | 80    | true</code></pre>

<h3>SELECT columns FROM table</h3>
<pre><code>SELECT title, views FROM posts;</code></pre>
<p>Result — every row, but only the two named columns:</p>
<pre><code>title              | views
-------------------+------
Hello World         | 120
Learning SQL        | 45
Draft Post          | 3
Node.js Basics      | 300
Old Announcement    | 80</code></pre>
<p><code>SELECT * FROM posts;</code> means "give me every column" — <code>*</code> is a wildcard for "all".</p>

<h3>WHERE — keep only matching rows</h3>
<pre><code>SELECT title, views FROM posts WHERE published = true;</code></pre>
<p>Result — row 3 ("Draft Post") is excluded because <code>published</code> is false:</p>
<pre><code>title              | views
-------------------+------
Hello World         | 120
Learning SQL        | 45
Node.js Basics      | 300
Old Announcement    | 80</code></pre>

<h3>ORDER BY — control the order</h3>
<pre><code>SELECT title, views FROM posts WHERE published = true ORDER BY views DESC;</code></pre>
<p>Result — same 4 rows as above, now sorted by <code>views</code> highest first (<code>DESC</code> = descending; <code>ASC</code> = ascending, the default):</p>
<pre><code>title              | views
-------------------+------
Node.js Basics      | 300
Hello World         | 120
Old Announcement    | 80
Learning SQL        | 45</code></pre>

<h3>LIMIT — take only the first N</h3>
<pre><code>SELECT title, views FROM posts WHERE published = true ORDER BY views DESC LIMIT 2;</code></pre>
<p>Result — only the top 2 rows survive:</p>
<pre><code>title              | views
-------------------+------
Node.js Basics      | 300
Hello World         | 120</code></pre>
<p>This exact pattern — filter, sort, take a page — is precisely what powers "top posts" lists and pagination (Chapter 6's <code>?page=2&amp;limit=10</code> query string becomes a <code>LIMIT</code>/<code>OFFSET</code> in SQL).</p>

<p class="pitfall"><strong>Clause order is fixed and matters:</strong> <code>SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ...</code>. Writing <code>ORDER BY</code> before <code>WHERE</code>, for instance, is a syntax error — the database expects this exact sequence every time.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>SELECT là cách bạn yêu cầu "cho tôi xem dữ liệu này"</h2>
<p class="lead">Mọi lần đọc bắt đầu bằng <strong>SELECT</strong>. Nó nêu bạn muốn cột nào, đọc từ bảng nào, và — tuỳ chọn — giữ lại dòng nào, trả về theo thứ tự gì, và bao nhiêu dòng. Hãy dùng một bảng ví dụ nhỏ cho mọi truy vấn trong bài này.</p>

<h3>Bảng ví dụ: posts</h3>
<pre><code>id | title              | views | published
---+--------------------+-------+----------
1  | Hello World         | 120   | true
2  | Learning SQL        | 45    | true
3  | Draft Post          | 3     | false
4  | Node.js Basics      | 300   | true
5  | Old Announcement    | 80    | true</code></pre>

<h3>SELECT cột FROM bảng</h3>
<pre><code>SELECT title, views FROM posts;</code></pre>
<p>Kết quả — mọi dòng, nhưng chỉ hai cột được nêu tên:</p>
<pre><code>title              | views
-------------------+------
Hello World         | 120
Learning SQL        | 45
Draft Post          | 3
Node.js Basics      | 300
Old Announcement    | 80</code></pre>
<p><code>SELECT * FROM posts;</code> nghĩa là "cho tôi mọi cột" — <code>*</code> là ký tự đại diện cho "tất cả".</p>

<h3>WHERE — chỉ giữ dòng khớp điều kiện</h3>
<pre><code>SELECT title, views FROM posts WHERE published = true;</code></pre>
<p>Kết quả — dòng 3 ("Draft Post") bị loại vì <code>published</code> là false:</p>
<pre><code>title              | views
-------------------+------
Hello World         | 120
Learning SQL        | 45
Node.js Basics      | 300
Old Announcement    | 80</code></pre>

<h3>ORDER BY — kiểm soát thứ tự</h3>
<pre><code>SELECT title, views FROM posts WHERE published = true ORDER BY views DESC;</code></pre>
<p>Kết quả — cùng 4 dòng trên, giờ sắp theo <code>views</code> cao nhất trước (<code>DESC</code> = giảm dần; <code>ASC</code> = tăng dần, mặc định):</p>
<pre><code>title              | views
-------------------+------
Node.js Basics      | 300
Hello World         | 120
Old Announcement    | 80
Learning SQL        | 45</code></pre>

<h3>LIMIT — chỉ lấy N dòng đầu</h3>
<pre><code>SELECT title, views FROM posts WHERE published = true ORDER BY views DESC LIMIT 2;</code></pre>
<p>Kết quả — chỉ 2 dòng đầu sống sót:</p>
<pre><code>title              | views
-------------------+------
Node.js Basics      | 300
Hello World         | 120</code></pre>
<p>Đúng khuôn mẫu này — lọc, sắp xếp, lấy một trang — chính là thứ chạy sau lưng danh sách "bài viết nổi bật" và phân trang (query string <code>?page=2&amp;limit=10</code> ở Chương 6 biến thành <code>LIMIT</code>/<code>OFFSET</code> trong SQL).</p>

<p class="pitfall"><strong>Thứ tự mệnh đề cố định và quan trọng:</strong> <code>SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ...</code>. Viết <code>ORDER BY</code> trước <code>WHERE</code>, chẳng hạn, là lỗi cú pháp — database luôn mong đúng trình tự này.</p>
</div>
`,
    },

    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — Changing data: INSERT, UPDATE, DELETE|||8.3 — Thay đổi dữ liệu: INSERT, UPDATE, DELETE',
      slug: 'wf-8-3-crud',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/9Pzj7Aj25lw', durationSeconds: 0 },
      description: 'Ghi dữ liệu bằng INSERT INTO, UPDATE ... SET ... WHERE, DELETE FROM ... WHERE, và mối nguy khi thiếu WHERE.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Reading is only half the story — now you write</h2>
<p class="lead">SELECT never changes anything (it is safe, just like GET from Chapter 6). Three other statements change data: <strong>INSERT</strong> creates a row, <strong>UPDATE</strong> changes a row, <strong>DELETE</strong> removes a row. Same <code>posts</code> table as Lesson 8.2 — watch it change step by step.</p>

<h3>Starting state</h3>
<pre><code>id | title              | views | published
---+--------------------+-------+----------
1  | Hello World         | 120   | true
2  | Learning SQL        | 45    | true
3  | Draft Post          | 3     | false</code></pre>

<h3>INSERT INTO — create a new row</h3>
<pre><code>INSERT INTO posts (title, views, published)
VALUES ('New Tutorial', 0, false);</code></pre>
<p>Result — a new row 4 is added (the database usually assigns the <code>id</code> automatically):</p>
<pre><code>id | title              | views | published
---+--------------------+-------+----------
1  | Hello World         | 120   | true
2  | Learning SQL        | 45    | true
3  | Draft Post          | 3     | false
4  | New Tutorial        | 0     | false</code></pre>

<h3>UPDATE ... SET ... WHERE — change existing rows</h3>
<pre><code>UPDATE posts SET published = true WHERE id = 4;</code></pre>
<p>Result — only row 4 changes; every other row is untouched:</p>
<pre><code>id | title              | views | published
---+--------------------+-------+----------
1  | Hello World         | 120   | true
2  | Learning SQL        | 45    | true
3  | Draft Post          | 3     | false
4  | New Tutorial        | 0     | true</code></pre>

<h3>DELETE FROM ... WHERE — remove rows</h3>
<pre><code>DELETE FROM posts WHERE id = 3;</code></pre>
<p>Result — row 3 ("Draft Post") is gone entirely:</p>
<pre><code>id | title              | views | published
---+--------------------+-------+----------
1  | Hello World         | 120   | true
2  | Learning SQL        | 45    | true
4  | New Tutorial        | 0     | true</code></pre>

<p class="pitfall"><strong>UPDATE or DELETE without WHERE hits every row in the table — not just one.</strong> &#96;DELETE FROM posts;&#96; (no WHERE) deletes ALL posts. &#96;UPDATE posts SET published = false;&#96; (no WHERE) unpublishes every single post. This is one of the most common and most damaging real-world mistakes — always write the WHERE clause first, or better, run a SELECT with the same WHERE first to see exactly which rows you are about to hit before you run the write.</p>

<p class="note-ct"><strong>Connecting to Chapter 6:</strong> a POST route (<code>router.post("/posts", ...)</code>) runs an INSERT; a PATCH route runs an UPDATE; a DELETE route runs a DELETE — the HTTP method you learned there and the SQL statement here are two ends of the same operation. This is CRUD: Create, Read, Update, Delete — the four things every API ultimately does to data.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Đọc chỉ là nửa câu chuyện — giờ bạn viết</h2>
<p class="lead">SELECT không bao giờ thay đổi gì (nó an toàn, giống GET ở Chương 6). Ba câu lệnh khác thay đổi dữ liệu: <strong>INSERT</strong> tạo một dòng, <strong>UPDATE</strong> đổi một dòng, <strong>DELETE</strong> xoá một dòng. Cùng bảng <code>posts</code> như Bài 8.2 — hãy xem nó đổi từng bước.</p>

<h3>Trạng thái ban đầu</h3>
<pre><code>id | title              | views | published
---+--------------------+-------+----------
1  | Hello World         | 120   | true
2  | Learning SQL        | 45    | true
3  | Draft Post          | 3     | false</code></pre>

<h3>INSERT INTO — tạo một dòng mới</h3>
<pre><code>INSERT INTO posts (title, views, published)
VALUES ('New Tutorial', 0, false);</code></pre>
<p>Kết quả — một dòng 4 mới được thêm (database thường tự gán <code>id</code>):</p>
<pre><code>id | title              | views | published
---+--------------------+-------+----------
1  | Hello World         | 120   | true
2  | Learning SQL        | 45    | true
3  | Draft Post          | 3     | false
4  | New Tutorial        | 0     | false</code></pre>

<h3>UPDATE ... SET ... WHERE — đổi dòng đang có</h3>
<pre><code>UPDATE posts SET published = true WHERE id = 4;</code></pre>
<p>Kết quả — chỉ dòng 4 đổi; mọi dòng khác không đụng tới:</p>
<pre><code>id | title              | views | published
---+--------------------+-------+----------
1  | Hello World         | 120   | true
2  | Learning SQL        | 45    | true
3  | Draft Post          | 3     | false
4  | New Tutorial        | 0     | true</code></pre>

<h3>DELETE FROM ... WHERE — xoá dòng</h3>
<pre><code>DELETE FROM posts WHERE id = 3;</code></pre>
<p>Kết quả — dòng 3 ("Draft Post") biến mất hoàn toàn:</p>
<pre><code>id | title              | views | published
---+--------------------+-------+----------
1  | Hello World         | 120   | true
2  | Learning SQL        | 45    | true
4  | New Tutorial        | 0     | true</code></pre>

<p class="pitfall"><strong>UPDATE hay DELETE thiếu WHERE đánh trúng MỌI dòng trong bảng — không chỉ một.</strong> &#96;DELETE FROM posts;&#96; (không WHERE) xoá TOÀN BỘ post. &#96;UPDATE posts SET published = false;&#96; (không WHERE) gỡ xuất bản MỌI post. Đây là một trong những lỗi thực tế phổ biến và tàn phá nhất — luôn viết mệnh đề WHERE trước, hoặc tốt hơn, chạy một SELECT với cùng WHERE trước để thấy chính xác dòng nào sắp bị đụng trước khi chạy lệnh ghi.</p>

<p class="note-ct"><strong>Nối lại với Chương 6:</strong> một route POST (<code>router.post("/posts", ...)</code>) chạy một INSERT; một route PATCH chạy một UPDATE; một route DELETE chạy một DELETE — method HTTP bạn học ở đó và câu lệnh SQL ở đây là hai đầu của cùng một thao tác. Đây là CRUD: Create, Read, Update, Delete — bốn việc mà mọi API cuối cùng đều làm với dữ liệu.</p>
</div>
`,
    },

    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — Relationships & JOINs|||8.4 — Quan hệ & JOIN',
      slug: 'wf-8-4-relationships-joins',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/Yh4CrPHVBdE', durationSeconds: 0 },
      description: 'Khoá chính, khoá ngoại, quan hệ một-nhiều, và INNER JOIN vs LEFT JOIN với ví dụ users + posts cụ thể.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Real data is not one table — it is tables that point at each other</h2>
<p class="lead">A blog has users and posts, and each post belongs to a user. Rather than repeating a user's whole name and email inside every post row, a relational database stores a small reference — an ID — and <strong>JOIN</strong> stitches the tables back together when you read.</p>

<h3>Primary key and foreign key</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Primary key (PK)</span><span class="v">A column that uniquely identifies each row in its own table, e.g. users.id.</span></div>
  <div class="kv"><span class="k">Foreign key (FK)</span><span class="v">A column in one table that stores the primary key of a row in another table — the link.</span></div>
  <div class="kv"><span class="k">One-to-many</span><span class="v">One user can have MANY posts, but each post belongs to exactly ONE user.</span></div>
</div>

<h3>The example tables</h3>
<pre><code>users
id | name
---+------
1  | Lan
2  | Minh

posts
id | title              | user_id   ← foreign key, points at users.id
---+--------------------+---------
1  | Hello World         | 1
2  | Learning SQL        | 1
3  | Minh's Notes        | 2
4  | Orphan Draft        | NULL     ← no author yet</code></pre>
<p><code>posts.user_id = 1</code> means "this post belongs to the user whose id is 1" — that is the entire relationship, one number.</p>

<h3>INNER JOIN — only rows that match on both sides</h3>
<pre><code>SELECT posts.title, users.name
FROM posts
INNER JOIN users ON posts.user_id = users.id;</code></pre>
<p>Result — post 4 ("Orphan Draft") is DROPPED because its <code>user_id</code> is NULL and matches no user:</p>
<pre><code>title              | name
-------------------+------
Hello World         | Lan
Learning SQL        | Lan
Minh's Notes        | Minh</code></pre>

<h3>LEFT JOIN — keep every row from the left table regardless</h3>
<pre><code>SELECT posts.title, users.name
FROM posts
LEFT JOIN users ON posts.user_id = users.id;</code></pre>
<p>Result — post 4 is KEPT, with <code>name</code> filled in as NULL since it has no matching user:</p>
<pre><code>title              | name
-------------------+------
Hello World         | Lan
Learning SQL        | Lan
Minh's Notes        | Minh
Orphan Draft        | NULL</code></pre>
<p class="note-ct"><strong>Pick JOIN type by the question you're asking:</strong> "posts that have a known author" → INNER JOIN. "every post, author or not" → LEFT JOIN. The left table in <code>LEFT JOIN</code> is whichever table is written before it — here, <code>posts</code>.</p>
<p class="pitfall"><strong>Forgetting the ON condition</strong> (or using a plain, unqualified <code>JOIN</code> without it) produces a cross join — every row of the first table paired with every row of the second, an explosion of nonsense rows. Always pair JOIN with an explicit ON.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Dữ liệu thật không phải một bảng — mà là các bảng trỏ vào nhau</h2>
<p class="lead">Một blog có user và post, và mỗi post thuộc về một user. Thay vì lặp lại toàn bộ tên và email của user trong mỗi dòng post, một database quan hệ lưu một tham chiếu nhỏ — một ID — và <strong>JOIN</strong> khâu các bảng lại với nhau khi bạn đọc.</p>

<h3>Khoá chính và khoá ngoại</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Primary key (PK)</span><span class="v">Một cột định danh duy nhất mỗi dòng trong bảng của nó, vd users.id.</span></div>
  <div class="kv"><span class="k">Foreign key (FK)</span><span class="v">Một cột ở bảng này lưu khoá chính của một dòng ở bảng khác — mối liên kết.</span></div>
  <div class="kv"><span class="k">Một-nhiều (one-to-many)</span><span class="v">Một user có thể có NHIỀU post, nhưng mỗi post thuộc về đúng MỘT user.</span></div>
</div>

<h3>Các bảng ví dụ</h3>
<pre><code>users
id | name
---+------
1  | Lan
2  | Minh

posts
id | title              | user_id   ← khoá ngoại, trỏ vào users.id
---+--------------------+---------
1  | Hello World         | 1
2  | Learning SQL        | 1
3  | Minh's Notes        | 2
4  | Orphan Draft        | NULL     ← chưa có tác giả</code></pre>
<p><code>posts.user_id = 1</code> nghĩa là "post này thuộc về user có id là 1" — đó là toàn bộ mối quan hệ, một con số.</p>

<h3>INNER JOIN — chỉ dòng khớp ở cả hai bên</h3>
<pre><code>SELECT posts.title, users.name
FROM posts
INNER JOIN users ON posts.user_id = users.id;</code></pre>
<p>Kết quả — post 4 ("Orphan Draft") bị LOẠI vì <code>user_id</code> của nó là NULL và không khớp user nào:</p>
<pre><code>title              | name
-------------------+------
Hello World         | Lan
Learning SQL        | Lan
Minh's Notes        | Minh</code></pre>

<h3>LEFT JOIN — giữ mọi dòng từ bảng bên trái bất kể thế nào</h3>
<pre><code>SELECT posts.title, users.name
FROM posts
LEFT JOIN users ON posts.user_id = users.id;</code></pre>
<p>Kết quả — post 4 được GIỮ, với <code>name</code> điền là NULL vì nó không có user khớp:</p>
<pre><code>title              | name
-------------------+------
Hello World         | Lan
Learning SQL        | Lan
Minh's Notes        | Minh
Orphan Draft        | NULL</code></pre>
<p class="note-ct"><strong>Chọn loại JOIN theo câu hỏi bạn đang hỏi:</strong> "các post có tác giả rõ ràng" → INNER JOIN. "mọi post, có tác giả hay không" → LEFT JOIN. Bảng bên trái trong <code>LEFT JOIN</code> là bảng nào được viết trước nó — ở đây là <code>posts</code>.</p>
<p class="pitfall"><strong>Quên điều kiện ON</strong> (hay dùng một <code>JOIN</code> trần không điều kiện) tạo ra một cross join — mỗi dòng của bảng đầu ghép với mỗi dòng của bảng thứ hai, một vụ nổ dòng vô nghĩa. Luôn ghép JOIN với một ON rõ ràng.</p>
</div>
`,
    },

    /* ─────────────────────────── 8.5 ─────────────────────────── */
    {
      title: '8.5 — ORMs & Prisma|||8.5 — ORM & Prisma',
      slug: 'wf-8-5-orm-prisma',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/rLRIB6AF2Dg', durationSeconds: 0 },
      description: 'ORM ánh xạ dòng sang object; một schema Prisma nhỏ và ví dụ findMany/create — cách nó ánh xạ lại về SQL bạn vừa học.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>An ORM lets you write JavaScript instead of raw SQL strings</h2>
<p class="lead">You now know enough SQL to read and write data by hand. In real Node.js code, though, you usually do not paste raw SQL strings — you use an <strong>ORM</strong> (Object-Relational Mapper), a library that maps database rows to JavaScript objects and lets you call methods instead of writing query text. This exact project uses <strong>Prisma</strong> with a <strong>PostgreSQL</strong> database.</p>

<h3>What an ORM actually does</h3>
<p>An ORM sits between your code and the database. You call a method like <code>prisma.user.findMany()</code>; the ORM builds the SQL (<code>SELECT * FROM users;</code>), runs it, and hands you back plain JavaScript objects — an array of <code>{ id, name, email }</code> — instead of raw rows. You get autocomplete, type-checking, and no hand-written SQL strings scattered through your app.</p>

<h3>A tiny Prisma schema</h3>
<pre><code>// prisma/schema.prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
  posts Post[]              // one user has many posts
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int                        // foreign key
  author   User   @relation(fields: [authorId], references: [id])
}</code></pre>
<p>Compare this to Lesson 8.4: <code>User</code>/<code>Post</code> are the <code>users</code>/<code>posts</code> tables, <code>authorId</code> is the foreign key (<code>user_id</code>), and <code>posts</code> on <code>User</code> plus <code>author</code> on <code>Post</code> describe the same one-to-many relationship — just spelled as a schema instead of two separate tables.</p>

<h3>Reading and writing through Prisma</h3>
<pre><code>// SELECT * FROM users WHERE id = 1;
const user = await prisma.user.findUnique({ where: { id: 1 } });

// SELECT * FROM users;
const allUsers = await prisma.user.findMany();

// INSERT INTO users (name, email) VALUES ('Lan', 'lan@example.com');
const newUser = await prisma.user.create({
  data: { name: 'Lan', email: 'lan@example.com' },
});

// SELECT posts.*, users.name FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.author_id = 1;
const postsWithAuthor = await prisma.post.findMany({
  where: { authorId: 1 },
  include: { author: true },   // this "include" IS the JOIN from Lesson 8.4
});</code></pre>
<p>Every Prisma call in this snippet is doing exactly the SQL statement written in its comment — <code>findMany</code> is SELECT, <code>create</code> is INSERT, and <code>include</code> is a JOIN. The ORM never invents a new idea; it gives the SQL you already learned a JavaScript-shaped handle.</p>

<p class="note-ct"><strong>Why this matters for what comes next:</strong> when you build the Node.js/Express backend, you will not write <code>SELECT</code> strings by hand — you will call <code>prisma.post.findMany(...)</code> inside a route handler, exactly as shown here, and Prisma turns it into the SQL you now understand. Knowing SQL first means you can always predict what your ORM call will actually do to the database.</p>

<div class="link-card"><a href="https://www.prisma.io/docs" target="_blank" rel="noopener">Prisma — official docs</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Một ORM cho bạn viết JavaScript thay vì chuỗi SQL thô</h2>
<p class="lead">Giờ bạn đã biết đủ SQL để đọc và ghi dữ liệu bằng tay. Trong code Node.js thật, tuy vậy, bạn thường không dán chuỗi SQL thô — bạn dùng một <strong>ORM</strong> (Object-Relational Mapper), một thư viện ánh xạ dòng database sang object JavaScript và cho bạn gọi phương thức thay vì viết chữ truy vấn. Đúng dự án này dùng <strong>Prisma</strong> với database <strong>PostgreSQL</strong>.</p>

<h3>Một ORM thật ra làm gì</h3>
<p>Một ORM nằm giữa code của bạn và database. Bạn gọi một phương thức như <code>prisma.user.findMany()</code>; ORM dựng SQL (<code>SELECT * FROM users;</code>), chạy nó, và trả lại cho bạn các object JavaScript thuần — một mảng <code>{ id, name, email }</code> — thay vì các dòng thô. Bạn có autocomplete, kiểm tra kiểu, và không có chuỗi SQL viết tay rải rác khắp app.</p>

<h3>Một schema Prisma nhỏ</h3>
<pre><code>// prisma/schema.prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
  posts Post[]              // một user có nhiều post
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int                        // khoá ngoại
  author   User   @relation(fields: [authorId], references: [id])
}</code></pre>
<p>So với Bài 8.4: <code>User</code>/<code>Post</code> là bảng <code>users</code>/<code>posts</code>, <code>authorId</code> là khoá ngoại (<code>user_id</code>), và <code>posts</code> trên <code>User</code> cùng <code>author</code> trên <code>Post</code> mô tả đúng quan hệ một-nhiều đó — chỉ đánh vần thành một schema thay vì hai bảng riêng.</p>

<h3>Đọc và ghi qua Prisma</h3>
<pre><code>// SELECT * FROM users WHERE id = 1;
const user = await prisma.user.findUnique({ where: { id: 1 } });

// SELECT * FROM users;
const allUsers = await prisma.user.findMany();

// INSERT INTO users (name, email) VALUES ('Lan', 'lan@example.com');
const newUser = await prisma.user.create({
  data: { name: 'Lan', email: 'lan@example.com' },
});

// SELECT posts.*, users.name FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.author_id = 1;
const postsWithAuthor = await prisma.post.findMany({
  where: { authorId: 1 },
  include: { author: true },   // "include" này CHÍNH LÀ JOIN ở Bài 8.4
});</code></pre>
<p>Mỗi lời gọi Prisma trong đoạn này làm đúng câu lệnh SQL viết trong chú thích của nó — <code>findMany</code> là SELECT, <code>create</code> là INSERT, và <code>include</code> là một JOIN. ORM không bịa ra ý tưởng mới; nó cho SQL bạn đã học một tay cầm hình dạng JavaScript.</p>

<p class="note-ct"><strong>Vì sao điều này quan trọng cho phần tiếp theo:</strong> khi bạn dựng backend Node.js/Express, bạn sẽ không viết chuỗi <code>SELECT</code> bằng tay — bạn sẽ gọi <code>prisma.post.findMany(...)</code> bên trong một route handler, đúng như minh hoạ ở đây, và Prisma biến nó thành SQL bạn giờ đã hiểu. Biết SQL trước nghĩa là bạn luôn đoán được lời gọi ORM của mình thật sự sẽ làm gì với database.</p>

<div class="link-card"><a href="https://www.prisma.io/docs" target="_blank" rel="noopener">Prisma — tài liệu chính thức</a></div>
</div>
`,
    },

    /* ─────────────────────────── 8.6 quiz ─────────────────────────── */
    {
      title: '8.6 — Chapter 8 quiz|||8.6 — Kiểm tra chương 8',
      slug: 'wf-8-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về database quan hệ, SELECT, INSERT/UPDATE/DELETE, khoá chính/khoá ngoại, JOIN và ORM/Prisma.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 8: what a database is, reading data with SELECT, changing data with INSERT/UPDATE/DELETE, primary/foreign keys and JOINs, and how an ORM like Prisma maps to the SQL you learned.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> The best way to internalise SQL is to write real queries against real tables. On Code Lab, run SELECT, INSERT, UPDATE, DELETE and JOIN yourself on the SQL track.</p>
<div class="link-card"><a href="/code-lab/sql">Practice on Code Lab → SQL track</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 8: database là gì, đọc dữ liệu với SELECT, đổi dữ liệu với INSERT/UPDATE/DELETE, khoá chính/khoá ngoại và JOIN, và cách một ORM như Prisma ánh xạ về SQL bạn đã học.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Cách tốt nhất để thấm SQL là tự viết truy vấn thật trên bảng thật. Trên Code Lab, hãy tự chạy SELECT, INSERT, UPDATE, DELETE và JOIN ở track SQL.</p>
<div class="link-card"><a href="/code-lab/sql">Luyện tập ở Code Lab → track SQL</a></div></div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why do applications need a database instead of just keeping data in memory?|||Vì sao ứng dụng cần một database thay vì chỉ giữ dữ liệu trong bộ nhớ?',
            options: [
              'A database stores data persistently, surviving restarts and crashes|||Database lưu dữ liệu bền vững, sống sót qua khởi động lại và sập',
              'Memory is slower than a database|||Bộ nhớ chậm hơn database',
              'Databases are only for images|||Database chỉ dùng cho ảnh',
              'Memory cannot store text|||Bộ nhớ không lưu được chữ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In a relational database, what is a row?|||Trong một database quan hệ, một dòng (row) là gì?',
            options: [
              'One single record in a table, with a value for every column|||Một bản ghi duy nhất trong một bảng, với một giá trị cho mỗi cột',
              'The name of a table|||Tên của một bảng',
              'A column type|||Một kiểu cột',
              'A SQL keyword|||Một từ khoá SQL',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Given posts(id, title, views, published) with rows (1,"A",120,true), (2,"B",45,true), (3,"C",3,false), what does SELECT title FROM posts WHERE published = true ORDER BY views DESC LIMIT 1; return?|||Cho posts(id, title, views, published) với các dòng (1,"A",120,true), (2,"B",45,true), (3,"C",3,false), SELECT title FROM posts WHERE published = true ORDER BY views DESC LIMIT 1; trả về gì?',
            options: [
              'Just "A" (highest views among published rows)|||Chỉ "A" (views cao nhất trong các dòng đã xuất bản)',
              'Just "C"|||Chỉ "C"',
              'All three titles|||Cả ba tiêu đề',
              'An empty result|||Một kết quả rỗng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which statement creates a brand-new row in a table?|||Câu lệnh nào tạo một dòng hoàn toàn mới trong một bảng?',
            options: [
              'INSERT INTO|||INSERT INTO',
              'SELECT|||SELECT',
              'UPDATE|||UPDATE',
              'ORDER BY|||ORDER BY',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What happens if you run UPDATE posts SET published = false; with no WHERE clause?|||Điều gì xảy ra nếu chạy UPDATE posts SET published = false; không có mệnh đề WHERE?',
            options: [
              'Every row in the posts table gets published set to false|||Mọi dòng trong bảng posts đều bị đặt published thành false',
              'Nothing happens without WHERE|||Không có gì xảy ra nếu thiếu WHERE',
              'Only the first row changes|||Chỉ dòng đầu tiên đổi',
              'It causes a syntax error|||Nó gây lỗi cú pháp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Given posts(id, title, views) with rows (1,"A",120), (2,"B",45), (3,"C",3), what does DELETE FROM posts WHERE id = 2; leave in the table?|||Cho posts(id, title, views) với các dòng (1,"A",120), (2,"B",45), (3,"C",3), DELETE FROM posts WHERE id = 2; để lại gì trong bảng?',
            options: [
              'Rows 1 ("A") and 3 ("C") only|||Chỉ dòng 1 ("A") và 3 ("C")',
              'All three rows|||Cả ba dòng',
              'No rows at all|||Không dòng nào cả',
              'Only row 2|||Chỉ dòng 2',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is a foreign key?|||Khoá ngoại (foreign key) là gì?',
            options: [
              'A column in one table storing the primary key of a row in another table|||Một cột ở bảng này lưu khoá chính của một dòng ở bảng khác',
              'A password for the database|||Một mật khẩu cho database',
              'A column that must always be empty|||Một cột luôn phải rỗng',
              'A type of index used only for text|||Một loại index chỉ dùng cho chữ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Given users(id,name) = (1,"Lan"),(2,"Minh") and posts(id,title,user_id) = (1,"X",1),(2,"Y",NULL), what does INNER JOIN return for SELECT posts.title, users.name FROM posts INNER JOIN users ON posts.user_id = users.id;?|||Cho users(id,name) = (1,"Lan"),(2,"Minh") và posts(id,title,user_id) = (1,"X",1),(2,"Y",NULL), INNER JOIN trả về gì cho SELECT posts.title, users.name FROM posts INNER JOIN users ON posts.user_id = users.id;?',
            options: [
              'Only one row: "X" with "Lan" — post "Y" is dropped since its user_id is NULL|||Chỉ một dòng: "X" với "Lan" — post "Y" bị loại vì user_id của nó là NULL',
              'Both posts, "Y" paired with NULL|||Cả hai post, "Y" ghép với NULL',
              'Every combination of every post and every user|||Mọi tổ hợp của mọi post và mọi user',
              'An empty result|||Một kết quả rỗng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Using the same tables, what would LEFT JOIN return instead, for the same query with LEFT JOIN in place of INNER JOIN?|||Dùng cùng các bảng, LEFT JOIN sẽ trả về gì thay vào đó, cho cùng truy vấn nhưng thay INNER JOIN bằng LEFT JOIN?',
            options: [
              'Both rows: "X" with "Lan", and "Y" with NULL for name|||Cả hai dòng: "X" với "Lan", và "Y" với NULL cho name',
              'Only "X" with "Lan"|||Chỉ "X" với "Lan"',
              'Only "Y" with NULL|||Chỉ "Y" với NULL',
              'Neither row|||Không dòng nào',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does an ORM like Prisma do?|||Một ORM như Prisma làm gì?',
            options: [
              'Maps database rows to JavaScript objects so you call methods instead of writing raw SQL strings|||Ánh xạ dòng database sang object JavaScript để bạn gọi phương thức thay vì viết chuỗi SQL thô',
              'Replaces the need for a database entirely|||Thay thế hoàn toàn nhu cầu về database',
              'Only works with NoSQL databases|||Chỉ hoạt động với database NoSQL',
              'Sends HTTP requests instead of SQL queries|||Gửi yêu cầu HTTP thay vì truy vấn SQL',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
