/**
 * Bài 8.3 — INSERT, UPDATE, DELETE và giao dịch (nâng cấp 02/11/2026). Output thật: _demo/_t8/chay.sh (sqlite3 3.54: RETURNING,
 * UPDATE quên WHERE đổi cả 6 dòng, chuyển 700 000 không giao dịch ⇒ tiền tự sinh ra, BEGIN…COMMIT mà chạy tiếp sau lỗi ⇒ vẫn sai,
 * dừng ở lỗi ⇒ hoàn tác), _demo/_t8/injection.mjs (Node 22.23 + node:sqlite: SQL injection với ghép chuỗi, an toàn với tham số).
 * Deck: scripts/slides-src/wf-8-3.mjs (9 slide, WF/v1/wf-8-3). Code Lab: wf-8-3-crud.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const doan = (key, ...n) => { const p = OUT[key].split(/\n+(?=sqlite> )/); return n.map((i) => p[i].trim()).join('\n\n'); };
/** Các khối "-- (a) …" của output giao dịch. */
const tx = (...n) => { const p = OUT['_t8/out/transaction'].split(/\n+(?=-- \()/); return n.map((i) => p[i].trim()).join('\n\n'); };

const G = walkWf('wf-8-3', 'Writing data', 'Ghi dữ liệu', [
  [1, 'Writing data',
    '<p>Reading is half of the story. Every sign-up, comment and payment is an INSERT, UPDATE or DELETE. Writing is also where data gets damaged: a missing WHERE, a half-finished transfer, a search box that runs the attacker\'s SQL. This lesson does each of these on purpose so you recognise them.</p>',
    '<p>Đọc chỉ là một nửa câu chuyện. Mọi lượt đăng ký, bình luận và thanh toán đều là INSERT, UPDATE hoặc DELETE. Ghi cũng là nơi dữ liệu bị hỏng: một WHERE bị quên, một lần chuyển tiền dở dang, một ô tìm kiếm chạy SQL của kẻ tấn công. Bài này cố ý làm từng lỗi đó để bạn nhận ra chúng.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to insert, update and delete rows and get the changed rows back, protect yourself from an UPDATE without WHERE, group several changes into a transaction that really rolls back, and send user input to the database with parameters so that it can never become SQL.</p>',
    '<p>Bạn sẽ chèn, cập nhật và xoá được dòng và nhận lại các dòng đã đổi, tự bảo vệ khỏi một UPDATE không có WHERE, gom nhiều thay đổi vào một giao dịch thật sự hoàn tác được, và gửi dữ liệu người dùng tới CSDL bằng tham số để nó không bao giờ trở thành SQL.</p>'],
  [3, 'INSERT, UPDATE, DELETE',
    '<p>INSERT adds a row and the database fills in the id and defaults. UPDATE changes the rows that match WHERE. DELETE removes them. RETURNING sends the affected rows back, so the API can answer 201 with the new product in one round trip.</p>',
    '<p>INSERT thêm một dòng và CSDL điền id và giá trị mặc định. UPDATE đổi các dòng khớp WHERE. DELETE xoá chúng. RETURNING gửi lại các dòng bị tác động, để API trả 201 kèm sản phẩm mới chỉ trong một lần đi về.</p>'],
  [4, 'The missing WHERE',
    '<p>With WHERE id equals one, one row changed. Without WHERE, the same statement changed all six rows: every post now has zero views. SQL does not ask "are you sure?". Checking the number of changed rows is how code catches this.</p>',
    '<p>Với WHERE id bằng một, một dòng đổi. Không có WHERE, cùng câu lệnh đổi cả sáu dòng: mọi bài giờ có không lượt xem. SQL không hỏi "bạn chắc chứ?". Kiểm số dòng bị đổi là cách mã bắt được lỗi này.</p>'],
  [5, 'Money from nowhere',
    '<p>A transfer is two updates. Without a transaction, the first succeeded, the second failed a CHECK rule, and Lan gained seven hundred thousand that nobody paid. A transaction makes both steps happen together or not at all.</p>',
    '<p>Một lần chuyển tiền là hai lệnh cập nhật. Không có giao dịch, lệnh đầu thành công, lệnh hai vi phạm luật CHECK, và Lan được thêm bảy trăm nghìn mà không ai trả. Giao dịch khiến cả hai bước cùng xảy ra hoặc cùng không.</p>'],
  [6, 'A transaction must roll back',
    '<p>Wrapping the statements in BEGIN and COMMIT was not enough: the script kept going after the error and committed the half-done work. Only when the script stopped at the first error was the transaction rolled back. In code: commit on success, rollback in the catch.</p>',
    '<p>Bọc các câu lệnh trong BEGIN và COMMIT vẫn chưa đủ: script chạy tiếp sau lỗi và commit phần làm dở. Chỉ khi script dừng ở lỗi đầu tiên thì giao dịch mới được hoàn tác. Trong mã: commit khi thành công, rollback trong catch.</p>'],
  [7, 'SQL injection',
    '<p>When a search box is glued into the SQL text, the user\'s text becomes part of the query. One crafted search returned every post, including drafts; another returned every user\'s email. An honest apostrophe crashed the query.</p>',
    '<p>Khi ô tìm kiếm được ghép vào chuỗi SQL, chữ người dùng gõ trở thành một phần của truy vấn. Một chuỗi tìm kiếm được soạn sẵn trả về mọi bài, kể cả bản nháp; chuỗi khác trả về email của mọi người dùng. Một dấu nháy đơn vô tình làm truy vấn hỏng.</p>'],
  [8, 'Parameters fix it',
    '<p>With a question-mark placeholder, the SQL text is fixed and the value travels separately. The same malicious inputs matched nothing, and the apostrophe was simply a character. Every database library supports parameters; never build SQL from user input.</p>',
    '<p>Với chỗ giữ chỗ dấu hỏi, chuỗi SQL cố định và giá trị đi riêng. Cùng những đầu vào độc hại đó không khớp gì, và dấu nháy chỉ là một ký tự. Mọi thư viện CSDL đều hỗ trợ tham số; đừng bao giờ dựng SQL từ dữ liệu người dùng.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to write the four statements for a small notes table, catch an UPDATE without WHERE using the changed-row count, implement a transfer with a real rollback in Node, and attack then fix a search function. "Done when" checks balances and the injection result.</p>',
    '<p>Bài luyện yêu cầu bạn viết bốn câu lệnh cho một bảng ghi chú nhỏ, bắt UPDATE không có WHERE bằng số dòng bị đổi, cài đặt chuyển tiền có rollback thật trong Node, rồi tấn công và sửa một hàm tìm kiếm. "Xong khi" kiểm số dư và kết quả injection.</p>'],
]);

export default {
  title: '8.3 — INSERT, UPDATE, DELETE and transactions|||8.3 — INSERT, UPDATE, DELETE và giao dịch',
  slug: 'wf-8-3-crud',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/9Pzj7Aj25lw', durationSeconds: 0 },
  description: 'Ghi dữ liệu trên CSDL blog thật: INSERT/UPDATE/DELETE … RETURNING; UPDATE quên WHERE đổi cả 6 dòng (changes()); chuyển 700 000 không giao dịch ⇒ tiền tự sinh ra, BEGIN…COMMIT mà chạy tiếp sau lỗi ⇒ vẫn sai, dừng ở lỗi ⇒ hoàn tác; giao dịch trong mã Node (try/commit, catch/rollback); SQL injection đo thật bằng node:sqlite (lộ bản nháp, lộ email người dùng, dấu nháy làm hỏng truy vấn) và tham số ? sửa tất cả.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Writing is where data gets damaged — so learn the safe way first</h2>
<p class="lead">After this lesson you can add, change and remove rows and get the affected rows back; notice when an UPDATE or DELETE touches more rows than intended; group related changes into a transaction that really rolls back on error; and pass user input to SQL through parameters so that it can never be executed as SQL. These four habits prevent the most expensive database mistakes beginners make in real projects — including one that is still in the OWASP Top 10.</p>

<h3>Step 1 — INSERT, UPDATE, DELETE … RETURNING</h3>
${ra(OUT['_t8/out/crud'])}
<table>
<thead><tr><th>Statement</th><th>Does</th><th>HTTP (Chapter 6)</th></tr></thead>
<tbody>
<tr><td><code>INSERT INTO t (cols) VALUES (…)</code></td><td>Adds rows; the database fills the id and defaults (<code>views 0</code>, <code>published 0</code>).</td><td>POST → 201</td></tr>
<tr><td><code>UPDATE t SET col = … WHERE …</code></td><td>Changes the matching rows; <code>views = views + 1</code> is computed inside the database (atomic, Lesson 8.1).</td><td>PUT / PATCH → 200</td></tr>
<tr><td><code>DELETE FROM t WHERE …</code></td><td>Removes the matching rows.</td><td>DELETE → 204</td></tr>
<tr><td><code>… RETURNING cols</code></td><td>Sends the affected rows back in the same round trip (SQLite 3.35+, PostgreSQL).</td><td>the response body</td></tr>
</tbody>
</table>
<p>Without RETURNING, libraries give you a count (<code>changes</code>, <code>rowCount</code>) and the last inserted id. Either way, <strong>look at the count</strong>: an UPDATE that changed 0 rows means "not found" — your API should answer 404, not 200.</p>

<h3>Step 2 — the missing WHERE</h3>
${ra(OUT['_t8/out/no-where'])}
<p>Same statement, one clause missing, six rows changed. There is no undo and no "are you sure?" — the only protection is habit and code:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Write WHERE first</span><span class="v">Type <code>UPDATE posts WHERE id = 1</code>, then go back and add <code>SET …</code>.</span></div>
  <div class="kv"><span class="k">SELECT first</span><span class="v">Run <code>SELECT count(*) FROM posts WHERE …</code> with the same WHERE before changing anything.</span></div>
  <div class="kv"><span class="k">Check the count in code</span><span class="v">If <code>changes</code> is not exactly 1 for a single-row update, throw and roll back.</span></div>
  <div class="kv"><span class="k">Backups</span><span class="v">Production databases need automatic backups you have actually restored once (Lesson 14.3).</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — a WHERE that matches more than you think.</strong> <code>DELETE FROM comments WHERE user_id = user_id</code> (comparing the column with itself) or <code>WHERE status &lt;&gt; 'keep'</code> with NULLs around (Lesson 8.2) look fine and match almost every row. Before any bulk change, run the same WHERE in a SELECT and read the count.</p></div>

<h3>Step 3 — transactions: all or nothing</h3>
<p>Moving money is two updates: add to Lan, subtract from Minh. The <code>accounts</code> table has <code>CHECK (balance &gt;= 0)</code>, and Minh only has 100,000. Watch what happens to a 700,000 transfer three ways:</p>
${ra(tx(0))}
<p>(a) No transaction: the first UPDATE succeeded, the second failed, and Lan now has 700,000 that nobody paid. The data is wrong and nothing tells you.</p>
${ra(tx(1))}
<p>(b) Inside <code>BEGIN … COMMIT</code>, and still wrong! The failing UPDATE was cancelled, but the script carried on and ran <code>COMMIT</code>, saving the first half. A transaction only protects you if the error <em>stops</em> the work and you roll back.</p>
${ra(tx(2))}
<p>(c) The same four lines, stopping at the first error (<code>sqlite3 -bail</code>): the transaction was never committed, so the database rolled it back. Both balances are exactly as before.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">BEGIN</span><span class="lz-t">start</span><span class="lz-d">Changes are invisible to others and can be undone.</span></div>
<div class="lz-step"><span class="lz-k">statements</span><span class="lz-t">do the work</span><span class="lz-d">Any error → go straight to ROLLBACK.</span></div>
<div class="lz-step"><span class="lz-k">COMMIT</span><span class="lz-t">only if everything succeeded</span><span class="lz-d">All changes become visible and durable at once.</span></div>
<div class="lz-step"><span class="lz-k">ROLLBACK</span><span class="lz-t">on any error</span><span class="lz-d">As if nothing happened.</span></div>
</div>
<p>In application code that pattern is a <code>try … catch</code>:</p>
<pre><code class="language-javascript">db.exec('BEGIN');
try {
  db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').run(amount, toId);
  db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?').run(amount, fromId);
  db.exec('COMMIT');
} catch (err) {
  db.exec('ROLLBACK');   // undo the half-done transfer
  throw err;             // and let the route answer 409 / 422
}</code></pre>
<p>ORMs wrap the same idea: <code>prisma.$transaction([...])</code> (Lesson 8.5). You will write this exact function in the Code Lab.</p>

<h3>Step 4 — SQL injection (measured)</h3>
<p>Writes and reads from an app always contain user input — a search box, a login form, a URL parameter. The dangerous way is to glue it into the SQL text:</p>
${ma('javascript', CODE['_t8/injection.mjs'], [10, 19])}
${ra(OUT['_t8/out/injection'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Input 1</span><span class="lz-t">%' OR 1=1 --</span><span class="lz-d">The <code>'</code> closes the string, <code>OR 1=1</code> makes every row match, <code>--</code> turns the rest into a comment. Drafts that were never published leaked.</span></div>
<div class="lz-layer"><span class="lz-k">Input 2</span><span class="lz-t">x' UNION SELECT id, email FROM users --</span><span class="lz-d">Glues a second query onto the first: the "search results" are now every user's email.</span></div>
<div class="lz-layer"><span class="lz-k">Input 3</span><span class="lz-t">Bob's</span><span class="lz-d">No attacker at all — an honest apostrophe broke the query with a syntax error (a 500 for a real user).</span></div>
<div class="lz-layer"><span class="lz-k">Parameter</span><span class="lz-t">… LIKE '%' || ? || '%'</span><span class="lz-d">The SQL text never changes; the value is sent separately and is only ever compared as text. All three inputs became harmless.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — "escaping" the quotes yourself, or using template strings.</strong> <code>&#96;… WHERE email = '\${email}'&#96;</code> is exactly the gluing above with nicer syntax. Replacing <code>'</code> with <code>''</code> by hand misses other characters and other databases' rules. Use the placeholder of your library — <code>?</code> in SQLite and MySQL, <code>$1</code> in PostgreSQL's <code>pg</code>, tagged templates in Prisma — for every value, every time. Placeholders cannot hold table or column names; pick those from an allow-list (Lesson 6.5's <code>sort</code>).</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (40 minutes) — write safely</strong></p>
<ol>
<li>In <code>blog.db</code>, create <code>notes(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, text TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0)</code>. INSERT three notes with RETURNING, mark one done, delete one.</li>
<li>Run an UPDATE without WHERE on <code>notes</code>, then <code>SELECT changes();</code>. Repeat with the correct WHERE.</li>
<li>Create the <code>accounts</code> table from Step 3 and reproduce (a), (b) and (c).</li>
<li>In Node 22, write <code>transfer(db, fromId, toId, amount)</code> with BEGIN/COMMIT/ROLLBACK and try 50,000 (works) and 700,000 (fails).</li>
<li>Copy <code>findPostsUnsafe</code>, attack it with the three inputs, then fix it with a parameter.</li>
</ol>
<p>Hint: <code>import { DatabaseSync } from 'node:sqlite'</code> and <code>db.prepare(sql).run(...values)</code>; run Node with <code>--no-warnings</code> to hide the "experimental" message.</p>
<p><strong>Done when:</strong> step 2 prints 2 then 1; after the failed transfer in step 4 the balances are still 500,000 and 100,000 and after the good one 550,000 and 50,000; and your fixed search returns 0 rows for <code>%' OR 1=1 --</code> while <code>SQL</code> still finds "Learning SQL". Then Code Lab module 8.3.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">INSERT / UPDATE / DELETE</span><span class="v">chèn / cập nhật / xoá dòng.</span></div>
  <div class="kv"><span class="k">RETURNING</span><span class="v">trả lại các dòng bị tác động.</span></div>
  <div class="kv"><span class="k">affected rows</span><span class="v">số dòng bị tác động — changes, rowCount.</span></div>
  <div class="kv"><span class="k">transaction</span><span class="v">giao dịch — nhóm lệnh tất cả hoặc không.</span></div>
  <div class="kv"><span class="k">commit / rollback</span><span class="v">xác nhận / hoàn tác.</span></div>
  <div class="kv"><span class="k">atomicity</span><span class="v">tính nguyên tử — chữ A trong ACID.</span></div>
  <div class="kv"><span class="k">SQL injection</span><span class="v">chèn mã SQL qua dữ liệu người dùng.</span></div>
  <div class="kv"><span class="k">parameterized query</span><span class="v">truy vấn tham số hoá — giá trị đi riêng.</span></div>
  <div class="kv"><span class="k">placeholder</span><span class="v">chỗ giữ chỗ — ?, $1.</span></div>
  <div class="kv"><span class="k">allow-list</span><span class="v">danh sách cho phép — cho tên cột/bảng.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>INSERT adds, UPDATE changes, DELETE removes — always with the WHERE you meant; RETURNING gives the rows back.</li>
  <li>Check the affected-row count: 0 means not found, more than expected means a bad WHERE.</li>
  <li>Related changes go in one transaction; COMMIT only on success, ROLLBACK on any error.</li>
  <li>BEGIN … COMMIT that keeps going after an error still saves half the work.</li>
  <li>Never glue user input into SQL: use placeholders for every value.</li>
  <li>Names (columns, sort order) cannot be parameters — use an allow-list.</li>
</ul>
${nguon('📗', 'OWASP — SQL Injection Prevention Cheat Sheet', 'Parameters, allow-lists and what escaping cannot fix', 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html')}
${nguon('📘', 'SQLite — Transactions', 'BEGIN, COMMIT, ROLLBACK and how errors behave', 'https://sqlite.org/lang_transaction.html')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-4-4-update-delete', title: 'PostgreSQL 4.4 — UPDATE and DELETE', sub: 'Safe bulk changes and RETURNING on PostgreSQL', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Ghi là lúc dữ liệu bị hỏng — nên học cách an toàn trước</h2>
<p class="lead">Học xong bài này bạn thêm, đổi và xoá được dòng và nhận lại các dòng bị tác động; nhận ra khi một UPDATE hay DELETE chạm nhiều dòng hơn ý định; gom các thay đổi liên quan vào một giao dịch thật sự hoàn tác khi có lỗi; và đưa dữ liệu người dùng vào SQL qua tham số để nó không bao giờ bị thực thi như SQL. Bốn thói quen này ngăn những lỗi CSDL đắt giá nhất mà người mới gây ra trong dự án thật — kể cả một lỗi vẫn nằm trong OWASP Top 10.</p>

<h3>Bước 1 — INSERT, UPDATE, DELETE … RETURNING</h3>
${ra(OUT['_t8/out/crud'])}
<table>
<thead><tr><th>Câu lệnh</th><th>Làm gì</th><th>HTTP (Chương 6)</th></tr></thead>
<tbody>
<tr><td><code>INSERT INTO t (cột) VALUES (…)</code></td><td>Thêm dòng; CSDL điền id và giá trị mặc định (<code>views 0</code>, <code>published 0</code>).</td><td>POST → 201</td></tr>
<tr><td><code>UPDATE t SET cột = … WHERE …</code></td><td>Đổi các dòng khớp; <code>views = views + 1</code> được tính ngay trong CSDL (nguyên tử, Bài 8.1).</td><td>PUT / PATCH → 200</td></tr>
<tr><td><code>DELETE FROM t WHERE …</code></td><td>Xoá các dòng khớp.</td><td>DELETE → 204</td></tr>
<tr><td><code>… RETURNING cột</code></td><td>Gửi lại các dòng bị tác động trong cùng một lần đi về (SQLite 3.35+, PostgreSQL).</td><td>phần thân response</td></tr>
</tbody>
</table>
<p>Không có RETURNING, thư viện trả cho bạn một con số (<code>changes</code>, <code>rowCount</code>) và id vừa chèn. Dù cách nào, <strong>hãy nhìn con số</strong>: UPDATE đổi 0 dòng nghĩa là "không tìm thấy" — API của bạn nên trả 404, không phải 200.</p>

<h3>Bước 2 — WHERE bị quên</h3>
${ra(OUT['_t8/out/no-where'])}
<p>Cùng câu lệnh, thiếu một mệnh đề, sáu dòng bị đổi. Không có nút hoàn tác và không có "bạn chắc chứ?" — cách bảo vệ duy nhất là thói quen và mã:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Viết WHERE trước</span><span class="v">Gõ <code>UPDATE posts WHERE id = 1</code>, rồi quay lại thêm <code>SET …</code>.</span></div>
  <div class="kv"><span class="k">SELECT trước</span><span class="v">Chạy <code>SELECT count(*) FROM posts WHERE …</code> với cùng WHERE trước khi đổi gì.</span></div>
  <div class="kv"><span class="k">Kiểm con số trong mã</span><span class="v">Nếu <code>changes</code> không đúng bằng 1 cho một lần cập nhật một dòng, hãy ném lỗi và rollback.</span></div>
  <div class="kv"><span class="k">Sao lưu</span><span class="v">CSDL production cần sao lưu tự động mà bạn đã thật sự khôi phục thử một lần (Bài 14.3).</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — WHERE khớp nhiều hơn bạn nghĩ.</strong> <code>DELETE FROM comments WHERE user_id = user_id</code> (so cột với chính nó) hay <code>WHERE status &lt;&gt; 'keep'</code> khi có NULL quanh đó (Bài 8.2) trông ổn và khớp gần như mọi dòng. Trước mọi thay đổi hàng loạt, chạy cùng WHERE trong một SELECT và đọc con số.</p></div>

<h3>Bước 3 — giao dịch: tất cả hoặc không</h3>
<p>Chuyển tiền là hai lệnh cập nhật: cộng cho Lan, trừ của Minh. Bảng <code>accounts</code> có <code>CHECK (balance &gt;= 0)</code>, và Minh chỉ có 100 000. Xem chuyện gì xảy ra với lần chuyển 700 000 theo ba cách:</p>
${ra(tx(0))}
<p>(a) Không giao dịch: lệnh UPDATE đầu thành công, lệnh hai hỏng, và Lan giờ có thêm 700 000 mà không ai trả. Dữ liệu sai và không gì báo cho bạn.</p>
${ra(tx(1))}
<p>(b) Bên trong <code>BEGIN … COMMIT</code>, vẫn sai! Lệnh UPDATE hỏng bị huỷ, nhưng script chạy tiếp tới <code>COMMIT</code>, lưu luôn nửa đầu. Giao dịch chỉ bảo vệ bạn khi lỗi <em>dừng</em> công việc lại và bạn rollback.</p>
${ra(tx(2))}
<p>(c) Cùng bốn dòng đó, dừng ở lỗi đầu tiên (<code>sqlite3 -bail</code>): giao dịch không bao giờ được commit, nên CSDL hoàn tác nó. Cả hai số dư đúng như trước.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">BEGIN</span><span class="lz-t">bắt đầu</span><span class="lz-d">Thay đổi vô hình với người khác và hoàn tác được.</span></div>
<div class="lz-step"><span class="lz-k">các câu lệnh</span><span class="lz-t">làm việc</span><span class="lz-d">Lỗi bất kỳ → đi thẳng tới ROLLBACK.</span></div>
<div class="lz-step"><span class="lz-k">COMMIT</span><span class="lz-t">chỉ khi mọi thứ thành công</span><span class="lz-d">Mọi thay đổi cùng hiện ra và được lưu bền vững một lúc.</span></div>
<div class="lz-step"><span class="lz-k">ROLLBACK</span><span class="lz-t">khi có bất kỳ lỗi nào</span><span class="lz-d">Như chưa có gì xảy ra.</span></div>
</div>
<p>Trong mã ứng dụng, khuôn đó là một <code>try … catch</code>:</p>
<pre><code class="language-javascript">db.exec('BEGIN');
try {
  db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').run(amount, toId);
  db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?').run(amount, fromId);
  db.exec('COMMIT');
} catch (err) {
  db.exec('ROLLBACK');   // hoàn tác lần chuyển dở dang
  throw err;             // và để route trả 409 / 422
}</code></pre>
<p>ORM bọc cùng ý tưởng đó: <code>prisma.$transaction([...])</code> (Bài 8.5). Bạn sẽ tự viết đúng hàm này trong Code Lab.</p>

<h3>Bước 4 — SQL injection (đo thật)</h3>
<p>Lệnh ghi và đọc từ app luôn chứa dữ liệu người dùng — ô tìm kiếm, form đăng nhập, tham số URL. Cách nguy hiểm là ghép nó vào chuỗi SQL:</p>
${ma('javascript', CODE['_t8/injection.mjs'], [10, 19])}
${ra(OUT['_t8/out/injection'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Đầu vào 1</span><span class="lz-t">%' OR 1=1 --</span><span class="lz-d">Dấu <code>'</code> đóng chuỗi, <code>OR 1=1</code> làm mọi dòng khớp, <code>--</code> biến phần còn lại thành chú thích. Bản nháp chưa đăng bị lộ.</span></div>
<div class="lz-layer"><span class="lz-k">Đầu vào 2</span><span class="lz-t">x' UNION SELECT id, email FROM users --</span><span class="lz-d">Ghép thêm truy vấn thứ hai vào truy vấn đầu: "kết quả tìm kiếm" giờ là email của mọi người dùng.</span></div>
<div class="lz-layer"><span class="lz-k">Đầu vào 3</span><span class="lz-t">Bob's</span><span class="lz-d">Không có kẻ tấn công nào — một dấu nháy vô tình làm truy vấn hỏng cú pháp (một lỗi 500 cho người dùng thật).</span></div>
<div class="lz-layer"><span class="lz-k">Tham số</span><span class="lz-t">… LIKE '%' || ? || '%'</span><span class="lz-d">Chuỗi SQL không bao giờ đổi; giá trị được gửi riêng và chỉ được so như chữ. Cả ba đầu vào thành vô hại.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tự "thoát" dấu nháy, hoặc dùng template string.</strong> <code>&#96;… WHERE email = '\${email}'&#96;</code> chính là phép ghép ở trên với cú pháp đẹp hơn. Tự thay <code>'</code> bằng <code>''</code> sẽ sót ký tự khác và luật của CSDL khác. Hãy dùng chỗ giữ chỗ của thư viện — <code>?</code> trong SQLite và MySQL, <code>$1</code> trong <code>pg</code> của PostgreSQL, tagged template trong Prisma — cho mọi giá trị, mọi lúc. Chỗ giữ chỗ không chứa được tên bảng hay tên cột; hãy chọn chúng từ một danh sách cho phép (như <code>sort</code> ở Bài 6.5).</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (40 phút) — ghi cho an toàn</strong></p>
<ol>
<li>Trong <code>blog.db</code>, tạo <code>notes(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, text TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0)</code>. INSERT ba ghi chú kèm RETURNING, đánh dấu một cái xong, xoá một cái.</li>
<li>Chạy một UPDATE không có WHERE trên <code>notes</code>, rồi <code>SELECT changes();</code>. Làm lại với WHERE đúng.</li>
<li>Tạo bảng <code>accounts</code> ở Bước 3 và tái hiện (a), (b) và (c).</li>
<li>Trong Node 22, viết <code>transfer(db, fromId, toId, amount)</code> với BEGIN/COMMIT/ROLLBACK và thử 50 000 (chạy) và 700 000 (hỏng).</li>
<li>Chép <code>findPostsUnsafe</code>, tấn công nó bằng ba đầu vào, rồi sửa bằng tham số.</li>
</ol>
<p>Gợi ý: <code>import { DatabaseSync } from 'node:sqlite'</code> và <code>db.prepare(sql).run(...giá trị)</code>; chạy Node với <code>--no-warnings</code> để ẩn thông báo "experimental".</p>
<p><strong>Xong khi:</strong> bước 2 in 2 rồi 1; sau lần chuyển hỏng ở bước 4 số dư vẫn là 500 000 và 100 000, sau lần chuyển tốt là 550 000 và 50 000; và hàm tìm kiếm đã sửa trả 0 dòng cho <code>%' OR 1=1 --</code> trong khi <code>SQL</code> vẫn tìm ra "Learning SQL". Sau đó làm module Code Lab 8.3.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">INSERT / UPDATE / DELETE</span><span class="v">chèn / cập nhật / xoá dòng.</span></div>
  <div class="kv"><span class="k">RETURNING</span><span class="v">trả lại các dòng bị tác động.</span></div>
  <div class="kv"><span class="k">affected rows</span><span class="v">số dòng bị tác động — changes, rowCount.</span></div>
  <div class="kv"><span class="k">transaction</span><span class="v">giao dịch — nhóm lệnh tất cả hoặc không.</span></div>
  <div class="kv"><span class="k">commit / rollback</span><span class="v">xác nhận / hoàn tác.</span></div>
  <div class="kv"><span class="k">atomicity</span><span class="v">tính nguyên tử — chữ A trong ACID.</span></div>
  <div class="kv"><span class="k">SQL injection</span><span class="v">chèn mã SQL qua dữ liệu người dùng.</span></div>
  <div class="kv"><span class="k">parameterized query</span><span class="v">truy vấn tham số hoá — giá trị đi riêng.</span></div>
  <div class="kv"><span class="k">placeholder</span><span class="v">chỗ giữ chỗ — ?, $1.</span></div>
  <div class="kv"><span class="k">allow-list</span><span class="v">danh sách cho phép — cho tên cột/bảng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>INSERT thêm, UPDATE đổi, DELETE xoá — luôn với đúng WHERE bạn định; RETURNING trả lại các dòng.</li>
  <li>Kiểm số dòng bị tác động: 0 là không tìm thấy, nhiều hơn mong đợi là WHERE sai.</li>
  <li>Các thay đổi liên quan đi trong một giao dịch; chỉ COMMIT khi thành công, ROLLBACK khi có lỗi.</li>
  <li>BEGIN … COMMIT mà chạy tiếp sau lỗi vẫn lưu một nửa công việc.</li>
  <li>Không bao giờ ghép dữ liệu người dùng vào SQL: dùng chỗ giữ chỗ cho mọi giá trị.</li>
  <li>Tên (cột, chiều sắp xếp) không làm tham số được — dùng danh sách cho phép.</li>
</ul>
${nguon('📗', 'OWASP — SQL Injection Prevention Cheat Sheet', 'Tham số, danh sách cho phép và những gì thoát ký tự không sửa được', 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html')}
${nguon('📘', 'SQLite — Transactions', 'BEGIN, COMMIT, ROLLBACK và cách lỗi hành xử', 'https://sqlite.org/lang_transaction.html')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-4-4-update-delete', title: 'PostgreSQL 4.4 — UPDATE và DELETE', sub: 'Thay đổi hàng loạt an toàn và RETURNING trên PostgreSQL', cta: 'Mở bài' })}
</div>
`,
};
