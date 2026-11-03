/**
 * Bài 8.1 — Cơ sở dữ liệu là gì (nâng cấp 02/11/2026). Output thật: _demo/_t8/json-vs-db.mjs (Node 22.23 + node:sqlite: tệp JSON mất
 * like và đọc phải tệp ghi dở, CSDL đủ 400), _demo/_t8/chay.sh (sqlite3 3.54: .schema, ràng buộc UNIQUE/NOT NULL/CHECK/FOREIGN KEY từ
 * chối dữ liệu sai). Deck: scripts/slides-src/wf-8-1.mjs (9 slide, WF/v1/wf-8-1). Code Lab: wf-8-1-databases.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-8-1', 'Why a database', 'Vì sao cần cơ sở dữ liệu', [
  [1, 'Why a database',
    '<p>The product API in Chapter 6 forgot everything when it restarted. Real apps must remember users, orders and messages for years, while many requests change them at the same time. This lesson shows, with measurements, why a plain file is not enough and what a database adds.</p>',
    '<p>API sản phẩm ở Chương 6 quên sạch mọi thứ khi khởi động lại. App thật phải nhớ người dùng, đơn hàng và tin nhắn trong nhiều năm, trong khi nhiều request cùng thay đổi chúng một lúc. Bài này cho thấy, bằng số đo, vì sao một tệp thường không đủ và cơ sở dữ liệu thêm được gì.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to explain what goes wrong when an app keeps data in memory or in a JSON file, read a table definition, name the parts of a table, use constraints to make bad data impossible, and choose between a relational and a document database for a simple project.</p>',
    '<p>Bạn sẽ giải thích được chuyện gì hỏng khi app giữ dữ liệu trong bộ nhớ hay trong tệp JSON, đọc được định nghĩa một bảng, gọi tên các phần của bảng, dùng ràng buộc để dữ liệu sai không thể vào, và chọn giữa CSDL quan hệ và CSDL tài liệu cho một dự án đơn giản.</p>'],
  [3, 'A JSON file under load',
    '<p>Two simulated users each pressed "like" two hundred times at the same moment. The JSON file ended with about two hundred likes instead of four hundred, and dozens of reads found the file half-written and crashed. The database counted exactly four hundred.</p>',
    '<p>Hai người dùng giả lập mỗi người bấm "thích" hai trăm lần cùng lúc. Tệp JSON kết thúc với khoảng hai trăm lượt thay vì bốn trăm, và hàng chục lần đọc gặp tệp đang ghi dở rồi hỏng. Cơ sở dữ liệu đếm đúng bốn trăm.</p>'],
  [4, 'Read, change, write',
    '<p>The file version reads the whole file, changes one number, and writes the whole file back. When two requests overlap, the second one writes back an old value and erases the first. The database runs "add one" as a single step that nothing can interrupt.</p>',
    '<p>Bản dùng tệp đọc cả tệp, đổi một con số, rồi ghi cả tệp lại. Khi hai request chồng nhau, cái thứ hai ghi lại một giá trị cũ và xoá mất cái thứ nhất. Cơ sở dữ liệu chạy "cộng một" thành một bước duy nhất không gì chen vào được.</p>'],
  [5, 'Tables, rows, columns',
    '<p>A relational database stores data in tables. Each column has a name and a type; each row is one thing, such as one user. The primary key gives every row a unique id, and other tables point to rows by that id.</p>',
    '<p>CSDL quan hệ lưu dữ liệu trong các bảng. Mỗi cột có tên và kiểu; mỗi dòng là một thứ, ví dụ một người dùng. Khoá chính cho mỗi dòng một id duy nhất, và các bảng khác trỏ tới dòng bằng id đó.</p>'],
  [6, 'Constraints refuse bad data',
    '<p>We tried four bad inserts: a duplicate email, a missing name, negative views and a post by a user who does not exist. The database refused every one, whatever bug the application might have. Rules written in the schema protect the data from all code paths at once.</p>',
    '<p>Ta thử bốn lệnh chèn sai: email trùng, thiếu tên, lượt xem âm và một bài viết của người dùng không tồn tại. Cơ sở dữ liệu từ chối tất cả, dù app có lỗi gì đi nữa. Luật viết trong lược đồ bảo vệ dữ liệu khỏi mọi đường mã cùng một lúc.</p>'],
  [7, 'Relational or document?',
    '<p>Relational databases such as PostgreSQL, MySQL and SQLite store tables linked by keys and are queried with SQL. Document databases such as MongoDB store JSON-like documents. For most web apps with users, orders and comments, a relational database is the safe default.</p>',
    '<p>CSDL quan hệ như PostgreSQL, MySQL và SQLite lưu các bảng nối với nhau bằng khoá và được truy vấn bằng SQL. CSDL tài liệu như MongoDB lưu các tài liệu giống JSON. Với phần lớn web app có người dùng, đơn hàng và bình luận, CSDL quan hệ là mặc định an toàn.</p>'],
  [8, 'SQL in one sentence',
    '<p>SQL describes what you want, not how to get it: "the titles of published posts, most viewed first". The database decides how to find them. Four verbs cover almost everything: SELECT, INSERT, UPDATE and DELETE, the topics of the next two lessons.</p>',
    '<p>SQL mô tả bạn muốn gì, không phải làm thế nào: "tiêu đề các bài đã đăng, xem nhiều nhất trước". CSDL tự quyết định cách tìm. Bốn động từ phủ gần hết mọi thứ: SELECT, INSERT, UPDATE và DELETE, chủ đề của hai bài tới.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to build the chapter\'s blog database with one command, read its schema, and try to break each constraint. "Done when" checks four refused inserts and the counts that stayed the same.</p>',
    '<p>Bài luyện yêu cầu bạn dựng CSDL blog của chương bằng một lệnh, đọc lược đồ của nó, và thử phá từng ràng buộc. "Xong khi" kiểm bốn lệnh chèn bị từ chối và các con số đếm không đổi.</p>'],
]);

export default {
  title: '8.1 — Why a database, and what is inside one|||8.1 — Vì sao cần cơ sở dữ liệu, và bên trong có gì',
  slug: 'wf-8-1-databases',
  type: 'VIDEO',
  isFreePreview: true,
  video: { url: 'https://youtu.be/27axs9dO7AE', durationSeconds: 0 },
  description: 'Vì sao bộ nhớ và tệp JSON không đủ (đo thật: 2 × 200 lượt thích ⇒ tệp giữ ~200 và hàng chục lần đọc gặp tệp ghi dở, CSDL đủ 400 và còn nguyên sau khi mở lại); bảng, dòng, cột, kiểu, khoá chính (sqlite3 .schema); ràng buộc UNIQUE/NOT NULL/CHECK/FOREIGN KEY từ chối dữ liệu sai; quan hệ hay tài liệu; SQLite/PostgreSQL/MySQL; SQL là ngôn ngữ khai báo.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>An app forgets everything unless something remembers for it</h2>
<p class="lead">After this lesson you can explain, with numbers you measured, why keeping data in a server variable or a JSON file breaks under real use; read a table definition and name its parts; use constraints so that bad data cannot get in no matter which code writes it; and choose a sensible kind of database for a first project. Every Node.js, Next.js or Spring app you build from here on stores its data this way.</p>

<h3>Step 1 — where the data has to live</h3>
<p>The product API in Chapter 6 kept its products in a JavaScript array. Restart the server and every change is gone. Real apps need data that:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Survives restarts</span><span class="v">Deploys, crashes and power cuts happen every week. Data must be on disk, not only in memory.</span></div>
  <div class="kv"><span class="k">Handles many writers</span><span class="v">Hundreds of requests change the same rows at the same moment. No update may be lost.</span></div>
  <div class="kv"><span class="k">Stays correct</span><span class="v">No duplicate emails, no orders for products that do not exist — even when the code has a bug.</span></div>
  <div class="kv"><span class="k">Is fast to search</span><span class="v">"Posts by user 42, newest first" among millions of rows, in milliseconds (Lesson 8.2).</span></div>
</div>

<h3>Step 2 — a JSON file under load (measured)</h3>
<p>The tempting shortcut is a <code>data.json</code> file. Here two simulated users each press "like" 200 times at the same moment — once with a JSON file, once with SQLite (a database stored in a single file, built into Node 22 as <code>node:sqlite</code>):</p>
${ma('javascript', CODE['_t8/json-vs-db.mjs'], [2, 49])}
${ra(OUT['_t8/out/json-vs-db'])}
<p>Two different failures appeared. <strong>Lost updates</strong>: request A reads 57, request B reads 57, both write 58 — one like vanishes (about half of them vanished here; the exact number changes every run). <strong>Torn reads</strong>: a request read the file while the other was in the middle of rewriting it and got an empty or half-written file — <code>Unexpected end of JSON input</code>. In a real app that would be a 500 error, or worse, an empty file saved over all your data. The database got exactly 400, and the value was still there after reopening the file.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">File</span><span class="lz-t">read → change → write</span><span class="lz-d">Three separate steps. Another request can run between any two of them.</span></div>
<div class="lz-step"><span class="lz-k">Database</span><span class="lz-t">UPDATE … SET likes = likes + 1</span><span class="lz-d">One statement, executed <em>atomically</em>: nothing can slip in between the read and the write.</span></div>
<div class="lz-step"><span class="lz-k">Also</span><span class="lz-t">journal on disk</span><span class="lz-d">A crash halfway through a write does not leave a half-written database — it is rolled back on the next start.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — "it works on my machine" with a JSON file or an in-memory array.</strong> Testing alone, you never send two requests at the same instant, so lost updates and torn reads never show up. They appear on the first busy day — and an in-memory array also disappears at every deploy, and is not shared when you run two server processes. Use a database from the first version that other people will use.</p></div>

<h3>Step 3 — tables, rows and columns</h3>
<p>This chapter uses one small blog database. The whole definition and its data fit on one screen; save it as <code>blog.sql</code> and every query in the chapter runs on your machine with <code>sqlite3 blog.db &lt; blog.sql</code>:</p>
${ma('sql', CODE['_t8/blog.sql'])}
${ra(OUT['_t8/out/schema'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Database</span><span class="lz-t">blog.db</span><span class="lz-d">One app's data: several tables. SQLite keeps it in one file; PostgreSQL keeps it in a server.</span></div>
<div class="lz-layer"><span class="lz-k">Table</span><span class="lz-t">users, posts, comments</span><span class="lz-d">One kind of thing per table — like one sheet in a spreadsheet, but with strict rules.</span></div>
<div class="lz-layer"><span class="lz-k">Row</span><span class="lz-t">(1, 'Lan', 'lan@example.com', …)</span><span class="lz-d">One thing: one user, one post.</span></div>
<div class="lz-layer"><span class="lz-k">Column</span><span class="lz-t">email TEXT NOT NULL UNIQUE</span><span class="lz-d">A name, a type, and rules every row must follow.</span></div>
</div>
<table>
<thead><tr><th>Keyword</th><th>Means</th></tr></thead>
<tbody>
<tr><td><code>INTEGER PRIMARY KEY</code></td><td>The row's unique id; SQLite fills it in automatically (PostgreSQL: <code>SERIAL</code> / <code>GENERATED … AS IDENTITY</code>).</td></tr>
<tr><td><code>NOT NULL</code></td><td>The value is required.</td></tr>
<tr><td><code>UNIQUE</code></td><td>No two rows may share the value.</td></tr>
<tr><td><code>DEFAULT (…)</code></td><td>Used when an insert leaves the column out.</td></tr>
<tr><td><code>CHECK (views &gt;= 0)</code></td><td>Any rule that fits in one expression.</td></tr>
<tr><td><code>REFERENCES users(id)</code></td><td>A foreign key: the value must be the id of an existing user (Lesson 8.4).</td></tr>
</tbody>
</table>

<h3>Step 4 — constraints refuse bad data</h3>
${ra(OUT['_t8/out/constraints'])}
<p>Four bad inserts, four refusals, and the counts did not change. The application should still validate input and show friendly messages (Lesson 6.3's 422) — but the database is the last line of defence that holds even when a script, an admin tool or a new endpoint forgets a check. The error messages are also useful: <code>UNIQUE constraint failed: users.email</code> becomes "this email is already registered" (a 409).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — SQLite does not check foreign keys unless you ask.</strong> For historical reasons SQLite ignores <code>REFERENCES</code> until each connection runs <code>PRAGMA foreign_keys = ON;</code> — every command in this chapter does. Forget it and the "Ghost author" post above is silently accepted. PostgreSQL and MySQL (InnoDB) always enforce foreign keys. It is a good example of why you test that your rules actually fire.</p></div>

<h3>Step 5 — relational or document?</h3>
<table>
<thead><tr><th></th><th>Relational (SQL)</th><th>Document (NoSQL)</th></tr></thead>
<tbody>
<tr><td>Examples</td><td>PostgreSQL, MySQL, SQLite, SQL Server</td><td>MongoDB, Firestore, DynamoDB</td></tr>
<tr><td>Shape</td><td>Tables with fixed columns, linked by keys</td><td>JSON-like documents, each can differ</td></tr>
<tr><td>Strong at</td><td>Relationships, constraints, transactions, ad-hoc questions</td><td>Storing a whole object at once, flexible fields, some kinds of scaling</td></tr>
<tr><td>Typical use</td><td>Shops, accounts, school systems — most web apps</td><td>Event logs, content with very varied shapes, caches</td></tr>
</tbody>
</table>
<p>This chapter uses <strong>SQLite</strong> because it needs no installation and runs anywhere (it is in every phone and browser). The PostgreSQL course uses the same SQL against a real server; the differences you meet first are small (types like <code>BOOLEAN</code> and <code>TIMESTAMPTZ</code>, <code>SERIAL</code> ids). PostgreSQL also stores JSON columns, so "relational" does not mean "no JSON".</p>

<h3>Step 6 — SQL describes <em>what</em>, not <em>how</em></h3>
<p>SQL is <strong>declarative</strong>: <code>SELECT title FROM posts WHERE published = 1 ORDER BY views DESC</code> says what result you want; the database chooses whether to scan the table or use an index (Lesson 8.2). Four statements cover almost everything an app does:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">SELECT</span><span class="v">Read rows (Lesson 8.2).</span></div>
  <div class="kv"><span class="k">INSERT</span><span class="v">Add rows (Lesson 8.3).</span></div>
  <div class="kv"><span class="k">UPDATE</span><span class="v">Change rows (Lesson 8.3).</span></div>
  <div class="kv"><span class="k">DELETE</span><span class="v">Remove rows (Lesson 8.3).</span></div>
</div>
<p>They map one-to-one onto Chapter 6: GET → SELECT, POST → INSERT, PUT/PATCH → UPDATE, DELETE → DELETE.</p>

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes) — build the blog and try to break it</strong></p>
<ol>
<li>Check that you have SQLite: <code>sqlite3 --version</code> (built into macOS and most Linux; on Windows download the "command-line tools" zip from sqlite.org).</li>
<li>Save <code>blog.sql</code> from Step 3 and run <code>sqlite3 blog.db &lt; blog.sql</code>. Open it with <code>sqlite3 blog.db</code>, then type <code>.tables</code>, <code>.schema posts</code> and <code>.mode table</code>.</li>
<li>Type <code>PRAGMA foreign_keys = ON;</code>, then try four inserts that break UNIQUE, NOT NULL, CHECK and the foreign key. Read each message.</li>
<li>Open a second terminal with <code>sqlite3 blog.db</code> and insert a user there; check you can see it from the first terminal.</li>
<li>Optional: save the Step 2 program as <code>likes.mjs</code> and run it with Node 22 two or three times.</li>
</ol>
<p>Hint: <code>.quit</code> leaves sqlite3; the arrow-up key repeats the previous command.</p>
<p><strong>Done when:</strong> <code>.tables</code> lists <code>comments posts users</code>; your four inserts fail with the four messages from Step 4 and <code>SELECT count(*) FROM users</code> still returns 3; and the user added in the second terminal appears in the first. Then Code Lab module 8.1.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">database</span><span class="v">cơ sở dữ liệu (CSDL).</span></div>
  <div class="kv"><span class="k">table / row / column</span><span class="v">bảng / dòng (bản ghi) / cột (trường).</span></div>
  <div class="kv"><span class="k">schema</span><span class="v">lược đồ — định nghĩa các bảng và luật.</span></div>
  <div class="kv"><span class="k">primary key</span><span class="v">khoá chính — id duy nhất của dòng.</span></div>
  <div class="kv"><span class="k">foreign key</span><span class="v">khoá ngoại — trỏ tới dòng của bảng khác.</span></div>
  <div class="kv"><span class="k">constraint</span><span class="v">ràng buộc — NOT NULL, UNIQUE, CHECK…</span></div>
  <div class="kv"><span class="k">lost update</span><span class="v">mất cập nhật — hai lần ghi chồng nhau.</span></div>
  <div class="kv"><span class="k">atomic</span><span class="v">nguyên tử — xảy ra trọn vẹn hoặc không.</span></div>
  <div class="kv"><span class="k">relational vs document</span><span class="v">quan hệ (bảng) và tài liệu (JSON).</span></div>
  <div class="kv"><span class="k">declarative</span><span class="v">khai báo — nói muốn gì, không nói làm thế nào.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Memory forgets on restart; files lose updates and get read half-written under concurrent use.</li>
  <li>A database runs each change atomically and keeps data safe on disk.</li>
  <li>Tables hold one kind of thing; rows are things; columns have a type and rules.</li>
  <li>Constraints (NOT NULL, UNIQUE, CHECK, FOREIGN KEY) protect data from every code path. In SQLite, turn foreign keys on.</li>
  <li>Relational (SQL) is the default for most web apps; document databases suit some special cases.</li>
  <li>SQL is declarative: SELECT, INSERT, UPDATE, DELETE.</li>
</ul>
${nguon('📗', 'SQLite — Command Line Shell', 'Every dot-command used in this chapter', 'https://sqlite.org/cli.html')}
${nguon('📘', 'PostgreSQL tutorial — Creating a new table', 'The same ideas on a database server', 'https://www.postgresql.org/docs/current/tutorial-table.html')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-1-1-mo-hinh-quan-he', title: 'PostgreSQL 1.1 — The relational model', sub: 'Tables, keys and why relational databases won, in more depth', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Một app quên sạch mọi thứ trừ khi có gì đó nhớ giúp nó</h2>
<p class="lead">Học xong bài này bạn giải thích được, bằng số do chính bạn đo, vì sao giữ dữ liệu trong biến của máy chủ hay trong tệp JSON sẽ hỏng khi dùng thật; đọc được định nghĩa một bảng và gọi tên các phần của nó; dùng ràng buộc để dữ liệu sai không vào được dù mã nào ghi; và chọn được một loại CSDL hợp lý cho dự án đầu tiên. Mọi app Node.js, Next.js hay Spring bạn dựng từ đây đều lưu dữ liệu theo cách này.</p>

<h3>Bước 1 — dữ liệu phải sống ở đâu</h3>
<p>API sản phẩm ở Chương 6 giữ sản phẩm trong một mảng JavaScript. Khởi động lại máy chủ là mọi thay đổi biến mất. App thật cần dữ liệu:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Sống qua khởi động lại</span><span class="v">Deploy, sập, mất điện xảy ra hằng tuần. Dữ liệu phải nằm trên đĩa, không chỉ trong bộ nhớ.</span></div>
  <div class="kv"><span class="k">Chịu được nhiều người ghi</span><span class="v">Hàng trăm request đổi cùng những dòng vào cùng một lúc. Không cập nhật nào được mất.</span></div>
  <div class="kv"><span class="k">Luôn đúng</span><span class="v">Không email trùng, không đơn hàng cho sản phẩm không tồn tại — kể cả khi mã có lỗi.</span></div>
  <div class="kv"><span class="k">Tìm nhanh</span><span class="v">"Bài của người dùng 42, mới nhất trước" giữa hàng triệu dòng, trong vài mili giây (Bài 8.2).</span></div>
</div>

<h3>Bước 2 — tệp JSON khi có tải (đo thật)</h3>
<p>Lối tắt hấp dẫn là một tệp <code>data.json</code>. Ở đây hai người dùng giả lập mỗi người bấm "thích" 200 lần cùng lúc — một lần với tệp JSON, một lần với SQLite (CSDL lưu trong một tệp, có sẵn trong Node 22 dưới tên <code>node:sqlite</code>):</p>
${ma('javascript', CODE['_t8/json-vs-db.mjs'], [2, 49])}
${ra(OUT['_t8/out/json-vs-db'])}
<p>Hai kiểu hỏng khác nhau xuất hiện. <strong>Mất cập nhật</strong>: request A đọc 57, request B đọc 57, cả hai ghi 58 — một lượt thích biến mất (ở đây mất khoảng một nửa; con số đúng thay đổi mỗi lần chạy). <strong>Đọc phải tệp ghi dở</strong>: một request đọc tệp đúng lúc request kia đang ghi lại nó và nhận tệp rỗng hay ghi dở — <code>Unexpected end of JSON input</code>. Trong app thật đó là lỗi 500, hoặc tệ hơn, một tệp rỗng được lưu đè lên toàn bộ dữ liệu. CSDL ra đúng 400, và giá trị vẫn còn sau khi mở lại tệp.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Tệp</span><span class="lz-t">đọc → đổi → ghi</span><span class="lz-d">Ba bước rời nhau. Request khác có thể chen vào giữa bất kỳ hai bước nào.</span></div>
<div class="lz-step"><span class="lz-k">CSDL</span><span class="lz-t">UPDATE … SET likes = likes + 1</span><span class="lz-d">Một câu lệnh, chạy <em>nguyên tử</em>: không gì lọt vào giữa lúc đọc và lúc ghi.</span></div>
<div class="lz-step"><span class="lz-k">Thêm nữa</span><span class="lz-t">nhật ký trên đĩa</span><span class="lz-d">Sập giữa lúc ghi không để lại CSDL ghi dở — nó được hoàn tác ở lần khởi động sau.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "máy tôi chạy được" với tệp JSON hay mảng trong bộ nhớ.</strong> Thử một mình, bạn không bao giờ gửi hai request đúng cùng một khoảnh khắc, nên mất cập nhật và đọc ghi dở không bao giờ lộ ra. Chúng xuất hiện vào ngày đông khách đầu tiên — còn mảng trong bộ nhớ thì biến mất ở mỗi lần deploy, và không dùng chung được khi chạy hai tiến trình máy chủ. Hãy dùng CSDL ngay từ phiên bản đầu tiên mà người khác sẽ dùng.</p></div>

<h3>Bước 3 — bảng, dòng và cột</h3>
<p>Chương này dùng một CSDL blog nhỏ. Toàn bộ định nghĩa và dữ liệu vừa một màn hình; lưu nó thành <code>blog.sql</code> là mọi truy vấn trong chương chạy được trên máy bạn với <code>sqlite3 blog.db &lt; blog.sql</code>:</p>
${ma('sql', CODE['_t8/blog.sql'])}
${ra(OUT['_t8/out/schema'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">CSDL</span><span class="lz-t">blog.db</span><span class="lz-d">Dữ liệu của một app: nhiều bảng. SQLite giữ trong một tệp; PostgreSQL giữ trong một máy chủ.</span></div>
<div class="lz-layer"><span class="lz-k">Bảng</span><span class="lz-t">users, posts, comments</span><span class="lz-d">Mỗi bảng một loại thứ — như một trang tính, nhưng có luật chặt chẽ.</span></div>
<div class="lz-layer"><span class="lz-k">Dòng</span><span class="lz-t">(1, 'Lan', 'lan@example.com', …)</span><span class="lz-d">Một thứ: một người dùng, một bài viết.</span></div>
<div class="lz-layer"><span class="lz-k">Cột</span><span class="lz-t">email TEXT NOT NULL UNIQUE</span><span class="lz-d">Một tên, một kiểu, và luật mà mọi dòng phải theo.</span></div>
</div>
<table>
<thead><tr><th>Từ khoá</th><th>Nghĩa là</th></tr></thead>
<tbody>
<tr><td><code>INTEGER PRIMARY KEY</code></td><td>Id duy nhất của dòng; SQLite tự điền (PostgreSQL: <code>SERIAL</code> / <code>GENERATED … AS IDENTITY</code>).</td></tr>
<tr><td><code>NOT NULL</code></td><td>Bắt buộc có giá trị.</td></tr>
<tr><td><code>UNIQUE</code></td><td>Không hai dòng nào trùng giá trị.</td></tr>
<tr><td><code>DEFAULT (…)</code></td><td>Dùng khi lệnh chèn bỏ trống cột.</td></tr>
<tr><td><code>CHECK (views &gt;= 0)</code></td><td>Luật bất kỳ viết được trong một biểu thức.</td></tr>
<tr><td><code>REFERENCES users(id)</code></td><td>Khoá ngoại: giá trị phải là id của một người dùng có thật (Bài 8.4).</td></tr>
</tbody>
</table>

<h3>Bước 4 — ràng buộc từ chối dữ liệu sai</h3>
${ra(OUT['_t8/out/constraints'])}
<p>Bốn lệnh chèn sai, bốn lần từ chối, và số đếm không đổi. App vẫn nên kiểm dữ liệu vào và hiện thông báo dễ hiểu (mã 422 ở Bài 6.3) — nhưng CSDL là tuyến phòng thủ cuối vẫn giữ vững khi một script, một công cụ quản trị hay một endpoint mới quên kiểm. Thông báo lỗi cũng có ích: <code>UNIQUE constraint failed: users.email</code> trở thành "email này đã được đăng ký" (mã 409).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — SQLite không kiểm khoá ngoại trừ khi bạn yêu cầu.</strong> Vì lý do lịch sử, SQLite bỏ qua <code>REFERENCES</code> cho tới khi mỗi kết nối chạy <code>PRAGMA foreign_keys = ON;</code> — mọi lệnh trong chương này đều làm vậy. Quên nó là bài "Ghost author" ở trên được nhận lặng lẽ. PostgreSQL và MySQL (InnoDB) luôn kiểm khoá ngoại. Đây là ví dụ tốt cho việc phải thử xem luật của bạn có thật sự chạy không.</p></div>

<h3>Bước 5 — quan hệ hay tài liệu?</h3>
<table>
<thead><tr><th></th><th>Quan hệ (SQL)</th><th>Tài liệu (NoSQL)</th></tr></thead>
<tbody>
<tr><td>Ví dụ</td><td>PostgreSQL, MySQL, SQLite, SQL Server</td><td>MongoDB, Firestore, DynamoDB</td></tr>
<tr><td>Hình dạng</td><td>Bảng cột cố định, nối bằng khoá</td><td>Tài liệu giống JSON, mỗi cái có thể khác</td></tr>
<tr><td>Mạnh ở</td><td>Quan hệ, ràng buộc, giao dịch, câu hỏi bất chợt</td><td>Lưu cả object một lần, trường linh hoạt, vài kiểu mở rộng</td></tr>
<tr><td>Dùng cho</td><td>Cửa hàng, tài khoản, hệ thống trường học — đa số web app</td><td>Nhật ký sự kiện, nội dung rất khác hình dạng, bộ đệm</td></tr>
</tbody>
</table>
<p>Chương này dùng <strong>SQLite</strong> vì không cần cài đặt và chạy ở đâu cũng được (nó có trong mọi điện thoại và trình duyệt). Khoá PostgreSQL dùng cùng SQL đó trên một máy chủ thật; khác biệt đầu tiên bạn gặp là nhỏ (kiểu <code>BOOLEAN</code> và <code>TIMESTAMPTZ</code>, id <code>SERIAL</code>). PostgreSQL cũng lưu được cột JSON, nên "quan hệ" không có nghĩa là "không có JSON".</p>

<h3>Bước 6 — SQL mô tả <em>cái gì</em>, không phải <em>làm thế nào</em></h3>
<p>SQL là ngôn ngữ <strong>khai báo</strong>: <code>SELECT title FROM posts WHERE published = 1 ORDER BY views DESC</code> nói kết quả bạn muốn; CSDL tự chọn quét cả bảng hay dùng chỉ mục (Bài 8.2). Bốn câu lệnh phủ gần hết mọi việc của một app:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">SELECT</span><span class="v">Đọc dòng (Bài 8.2).</span></div>
  <div class="kv"><span class="k">INSERT</span><span class="v">Thêm dòng (Bài 8.3).</span></div>
  <div class="kv"><span class="k">UPDATE</span><span class="v">Đổi dòng (Bài 8.3).</span></div>
  <div class="kv"><span class="k">DELETE</span><span class="v">Xoá dòng (Bài 8.3).</span></div>
</div>
<p>Chúng khớp một-một với Chương 6: GET → SELECT, POST → INSERT, PUT/PATCH → UPDATE, DELETE → DELETE.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút) — dựng blog rồi thử phá nó</strong></p>
<ol>
<li>Kiểm bạn có SQLite: <code>sqlite3 --version</code> (có sẵn trên macOS và đa số Linux; trên Windows tải gói "command-line tools" ở sqlite.org).</li>
<li>Lưu <code>blog.sql</code> ở Bước 3 rồi chạy <code>sqlite3 blog.db &lt; blog.sql</code>. Mở nó bằng <code>sqlite3 blog.db</code>, rồi gõ <code>.tables</code>, <code>.schema posts</code> và <code>.mode table</code>.</li>
<li>Gõ <code>PRAGMA foreign_keys = ON;</code>, rồi thử bốn lệnh chèn phá UNIQUE, NOT NULL, CHECK và khoá ngoại. Đọc từng thông báo.</li>
<li>Mở terminal thứ hai với <code>sqlite3 blog.db</code> và chèn một người dùng ở đó; kiểm bạn thấy nó từ terminal thứ nhất.</li>
<li>Tuỳ chọn: lưu chương trình ở Bước 2 thành <code>likes.mjs</code> và chạy bằng Node 22 hai ba lần.</li>
</ol>
<p>Gợi ý: <code>.quit</code> để thoát sqlite3; phím mũi tên lên lặp lại lệnh trước.</p>
<p><strong>Xong khi:</strong> <code>.tables</code> liệt kê <code>comments posts users</code>; bốn lệnh chèn của bạn hỏng với bốn thông báo ở Bước 4 và <code>SELECT count(*) FROM users</code> vẫn trả 3; và người dùng thêm ở terminal thứ hai hiện ở terminal thứ nhất. Sau đó làm module Code Lab 8.1.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">database</span><span class="v">cơ sở dữ liệu (CSDL).</span></div>
  <div class="kv"><span class="k">table / row / column</span><span class="v">bảng / dòng (bản ghi) / cột (trường).</span></div>
  <div class="kv"><span class="k">schema</span><span class="v">lược đồ — định nghĩa các bảng và luật.</span></div>
  <div class="kv"><span class="k">primary key</span><span class="v">khoá chính — id duy nhất của dòng.</span></div>
  <div class="kv"><span class="k">foreign key</span><span class="v">khoá ngoại — trỏ tới dòng của bảng khác.</span></div>
  <div class="kv"><span class="k">constraint</span><span class="v">ràng buộc — NOT NULL, UNIQUE, CHECK…</span></div>
  <div class="kv"><span class="k">lost update</span><span class="v">mất cập nhật — hai lần ghi chồng nhau.</span></div>
  <div class="kv"><span class="k">atomic</span><span class="v">nguyên tử — xảy ra trọn vẹn hoặc không.</span></div>
  <div class="kv"><span class="k">relational vs document</span><span class="v">quan hệ (bảng) và tài liệu (JSON).</span></div>
  <div class="kv"><span class="k">declarative</span><span class="v">khai báo — nói muốn gì, không nói làm thế nào.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Bộ nhớ quên khi khởi động lại; tệp mất cập nhật và bị đọc lúc ghi dở khi dùng đồng thời.</li>
  <li>CSDL chạy mỗi thay đổi một cách nguyên tử và giữ dữ liệu an toàn trên đĩa.</li>
  <li>Bảng chứa một loại thứ; dòng là các thứ; cột có kiểu và luật.</li>
  <li>Ràng buộc (NOT NULL, UNIQUE, CHECK, FOREIGN KEY) bảo vệ dữ liệu khỏi mọi đường mã. Trong SQLite, nhớ bật khoá ngoại.</li>
  <li>Quan hệ (SQL) là mặc định cho đa số web app; CSDL tài liệu hợp vài trường hợp riêng.</li>
  <li>SQL là ngôn ngữ khai báo: SELECT, INSERT, UPDATE, DELETE.</li>
</ul>
${nguon('📗', 'SQLite — Command Line Shell', 'Mọi lệnh chấm dùng trong chương này', 'https://sqlite.org/cli.html')}
${nguon('📘', 'PostgreSQL tutorial — Creating a new table', 'Cùng ý tưởng trên một máy chủ CSDL', 'https://www.postgresql.org/docs/current/tutorial-table.html')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-1-1-mo-hinh-quan-he', title: 'PostgreSQL 1.1 — Mô hình quan hệ', sub: 'Bảng, khoá và vì sao CSDL quan hệ thắng thế, sâu hơn', cta: 'Mở bài' })}
</div>
`,
};
