/**
 * PostgreSQL — Chương 1: Vì sao PostgreSQL tồn tại.
 * Mô hình quan hệ · ACID (chứng minh từng tính chất bằng output THẬT) ·
 * PostgreSQL vs MySQL/SQLite/NoSQL · dòng chảy một truy vấn (EXPLAIN).
 * Output chạy thật trên PostgreSQL 15.4, db pgcourse, localhost:5433.
 * LUẬT: < > trong code → &lt; &gt; ; & → &amp; ; backtick → &#96; ; ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 1 — Why PostgreSQL exists|||Chương 1 — Vì sao PostgreSQL tồn tại',
  description: 'Mô hình quan hệ, bốn bảo đảm ACID được chứng minh bằng ví dụ thật, PostgreSQL khác MySQL/SQLite/NoSQL thế nào, và một truy vấn chảy qua Postgres ra sao.',
  lessons: [
    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — The relational model & why it won|||1.1 — Mô hình quan hệ & vì sao nó thắng',
      slug: 'postgresql-1-1-mo-hinh-quan-he',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bảng, dòng, cột, khoá và quan hệ — vì sao dữ liệu ở dạng bảng liên kết đánh bại file phẳng và bảng tính.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The relational model — data as tables that link</h2>
<p class="lead">PostgreSQL is a <strong>relational</strong> database. That word is the single most important idea in this whole course, and it's older than almost every technology you use: it comes from a 1970 paper by Edgar F. Codd at IBM. The idea is deceptively simple — store data as <strong>tables</strong> of rows and columns, and express connections between them as <strong>relationships</strong> — but it's why databases stayed sane while everything around them churned.</p>

<h3>The three words: table, row, column</h3>
<p>A <strong>table</strong> models one kind of thing (users, notes, orders). Each <strong>row</strong> is one of that thing (one user). Each <strong>column</strong> is one attribute (a username, an email) with a fixed <em>type</em>. That's it. A database is a set of such tables. Here are two — <code>users</code> and <code>notes</code>:</p>
<pre><code>CREATE TABLE users (
  id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username text NOT NULL UNIQUE,
  email    text NOT NULL
);

CREATE TABLE notes (
  id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id  bigint NOT NULL REFERENCES users(id),
  title    varchar(200) NOT NULL,
  pinned   boolean NOT NULL DEFAULT false
);</code></pre>

<h3>Keys — how a row is identified and linked</h3>
<p>Two kinds of key make the model work:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Primary key</span><span class="v">A column (here <code>id</code>) that uniquely identifies each row. No two rows share it; it's never null. It's the row's permanent name.</span></div>
  <div class="kv"><span class="k">Foreign key</span><span class="v"><code>notes.user_id REFERENCES users(id)</code> — it says "this note belongs to that user". It's how one table <em>relates</em> to another.</span></div>
</div>
<p>The connection isn't stored by duplicating the user's data into every note. It's stored as a single number — the user's <code>id</code> — in the note's <code>user_id</code> column. To see a note <em>with</em> its owner, you <strong>join</strong> the two tables on that link (Chapter 5 is all about joins; here's a first taste):</p>
<pre><code>SELECT u.username, n.title, n.pinned
FROM notes n
JOIN users u ON u.id = n.user_id
ORDER BY u.username, n.id;</code></pre>
<div class="out"> username |     title      | pinned
----------+----------------+--------
 cuong    | Hoc PostgreSQL | t
 cuong    | Mua ca phe     | f
 mai      | Doc tai lieu   | t
(3 rows)</div>
<p>Two users, three notes, and the database stitched them together on demand. The user's name lives in exactly one place (<code>users</code>); if Cuong renames himself, you change one row and every note "sees" the new name automatically. That principle — <strong>store each fact once</strong> — is called normalization, and the "100 Ngày Database" series on this site covers it in depth.</p>

<h3>Referential integrity — the database refuses bad links</h3>
<p>Because <code>user_id</code> is a foreign key, the database will <strong>not let you</strong> create a note pointing at a user who doesn't exist. Watch it reject an orphan:</p>
<pre><code>INSERT INTO notes (user_id, title) VALUES (999, 'orphan note');</code></pre>
<div class="out">ERROR:  insert or update on table "notes" violates foreign key constraint "notes_user_id_fkey"
DETAIL:  Key (user_id)=(999) is not present in table "users".</div>
<p>This is huge. The <em>database itself</em> guarantees your data can never get into a broken state — no note ever dangles pointing at a deleted user. You don't have to remember to check in your application code; the rule lives with the data, where it can't be bypassed.</p>

<h3>Why not a spreadsheet, a JSON file, or one giant table?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">A JSON file / in-memory object</span><span class="v">No concurrency (two writers corrupt it), no querying ("all pinned notes by users in Hanoi" means writing a loop), and it's all lost on restart.</span></div>
  <div class="kv"><span class="k">A spreadsheet</span><span class="v">Fine for a human eyeballing 200 rows. Falls apart at a million rows, many users, or any relationship between sheets.</span></div>
  <div class="kv"><span class="k">One giant table</span><span class="v">Repeating the username in every note means renaming a user = updating thousands of rows, and one missed row = inconsistent data. Splitting into related tables fixes this.</span></div>
  <div class="kv"><span class="k">Relational tables</span><span class="v">Each fact once, links by key, the database enforces integrity, and you query with SQL instead of loops. This is why it won.</span></div>
</div>
<div class="callout ok">"Relational" does <strong>not</strong> mean "tables have relationships" in the loose sense — it comes from Codd's mathematical <em>relations</em> (sets of tuples). But the practical takeaway is exactly the intuitive one: real data is a web of connected things, and relational databases model that web directly and safely.</div>
<div class="note-ct">This site's schema is 248 such tables. A <code>post</code> references its author (<code>users</code>); a <code>comment</code> references its post; a <code>message</code> references a thread and a sender. Every feature you see is tables linked by foreign keys — and because those keys are enforced, a deleted user can never leave a broken comment behind.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: model your own two related tables</span><span class="lc-sub">The Code Lab track has you design tables and links from scratch.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Mô hình quan hệ — dữ liệu là những bảng liên kết nhau</h2>
<p class="lead">PostgreSQL là một cơ sở dữ liệu <strong>quan hệ</strong>. Chữ đó là ý tưởng quan trọng nhất trong cả khoá này, và nó già hơn gần như mọi công nghệ bạn đang dùng: nó đến từ một bài báo năm 1970 của Edgar F. Codd ở IBM. Ý tưởng đơn giản đến mức đánh lừa — lưu dữ liệu thành các <strong>bảng</strong> gồm dòng và cột, rồi diễn đạt các mối nối giữa chúng bằng <strong>quan hệ</strong> — nhưng đó là lý do cơ sở dữ liệu giữ được sự tỉnh táo trong khi mọi thứ quanh nó xoay vần.</p>

<h3>Ba từ: bảng, dòng, cột</h3>
<p>Một <strong>bảng</strong> mô hình hoá một loại sự vật (users, notes, orders). Mỗi <strong>dòng</strong> là một sự vật loại đó (một user). Mỗi <strong>cột</strong> là một thuộc tính (một username, một email) với một <em>kiểu</em> cố định. Chỉ vậy thôi. Một cơ sở dữ liệu là một tập những bảng như thế. Đây là hai bảng — <code>users</code> và <code>notes</code>:</p>
<pre><code>CREATE TABLE users (
  id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username text NOT NULL UNIQUE,
  email    text NOT NULL
);

CREATE TABLE notes (
  id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id  bigint NOT NULL REFERENCES users(id),
  title    varchar(200) NOT NULL,
  pinned   boolean NOT NULL DEFAULT false
);</code></pre>

<h3>Khoá — cách một dòng được nhận diện và liên kết</h3>
<p>Hai loại khoá làm mô hình này chạy được:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Khoá chính (primary key)</span><span class="v">Một cột (ở đây là <code>id</code>) nhận diện duy nhất mỗi dòng. Không hai dòng nào trùng nó; nó không bao giờ null. Nó là cái tên vĩnh viễn của dòng.</span></div>
  <div class="kv"><span class="k">Khoá ngoại (foreign key)</span><span class="v"><code>notes.user_id REFERENCES users(id)</code> — nói rằng "note này thuộc về user kia". Đó là cách một bảng <em>quan hệ</em> với bảng khác.</span></div>
</div>
<p>Mối nối không được lưu bằng cách chép dữ liệu của user vào từng note. Nó được lưu bằng một con số duy nhất — <code>id</code> của user — trong cột <code>user_id</code> của note. Muốn thấy một note <em>kèm</em> chủ của nó, bạn <strong>join</strong> hai bảng theo mối nối đó (Chương 5 nói trọn về join; đây là mẩu nếm thử):</p>
<pre><code>SELECT u.username, n.title, n.pinned
FROM notes n
JOIN users u ON u.id = n.user_id
ORDER BY u.username, n.id;</code></pre>
<div class="out"> username |     title      | pinned
----------+----------------+--------
 cuong    | Hoc PostgreSQL | t
 cuong    | Mua ca phe     | f
 mai      | Doc tai lieu   | t
(3 rows)</div>
<p>Hai user, ba note, và cơ sở dữ liệu khâu chúng lại với nhau khi được yêu cầu. Tên của user chỉ nằm đúng một chỗ (<code>users</code>); nếu Cuong đổi tên mình, bạn sửa một dòng và mọi note "thấy" tên mới ngay lập tức. Nguyên tắc đó — <strong>lưu mỗi sự thật đúng một lần</strong> — gọi là chuẩn hoá (normalization), và loạt "100 Ngày Database" trên trang này nói sâu về nó.</p>

<h3>Toàn vẹn tham chiếu — cơ sở dữ liệu từ chối mối nối sai</h3>
<p>Vì <code>user_id</code> là khoá ngoại, cơ sở dữ liệu sẽ <strong>không cho bạn</strong> tạo một note trỏ tới một user không tồn tại. Xem nó từ chối một dòng mồ côi:</p>
<pre><code>INSERT INTO notes (user_id, title) VALUES (999, 'note mo coi');</code></pre>
<div class="out">ERROR:  insert or update on table "notes" violates foreign key constraint "notes_user_id_fkey"
DETAIL:  Key (user_id)=(999) is not present in table "users".</div>
<p>Điều này cực lớn. <em>Chính cơ sở dữ liệu</em> bảo đảm dữ liệu của bạn không bao giờ rơi vào trạng thái hỏng — không note nào lơ lửng trỏ tới một user đã bị xoá. Bạn không phải nhớ đi kiểm trong code ứng dụng; luật sống cùng dữ liệu, nơi không thể bị lách qua.</p>

<h3>Vì sao không dùng bảng tính, một file JSON, hay một bảng khổng lồ?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Một file JSON / object trong bộ nhớ</span><span class="v">Không có đồng thời (hai người ghi làm hỏng nó), không truy vấn được ("mọi note đã ghim của user ở Hà Nội" nghĩa là phải viết một vòng lặp), và mất sạch khi khởi động lại.</span></div>
  <div class="kv"><span class="k">Một bảng tính</span><span class="v">Ổn để một người liếc 200 dòng. Rã rời ở một triệu dòng, nhiều user, hay bất kỳ quan hệ nào giữa các sheet.</span></div>
  <div class="kv"><span class="k">Một bảng khổng lồ</span><span class="v">Lặp username trong mọi note nghĩa là đổi tên một user = cập nhật hàng nghìn dòng, và sót một dòng = dữ liệu mâu thuẫn. Tách thành các bảng có quan hệ khắc phục điều này.</span></div>
  <div class="kv"><span class="k">Các bảng quan hệ</span><span class="v">Mỗi sự thật một lần, nối bằng khoá, cơ sở dữ liệu tự bảo đảm toàn vẹn, và bạn truy vấn bằng SQL thay vì vòng lặp. Đó là lý do nó thắng.</span></div>
</div>
<div class="callout ok">"Quan hệ" (relational) <strong>không</strong> nghĩa là "các bảng có mối quan hệ" theo nghĩa lỏng lẻo — nó đến từ khái niệm <em>relation</em> toán học của Codd (tập các bộ - tuple). Nhưng điều rút ra thực dụng đúng bằng trực giác: dữ liệu thật là một mạng lưới những sự vật kết nối, và cơ sở dữ liệu quan hệ mô hình hoá mạng lưới đó một cách trực tiếp và an toàn.</div>
<div class="note-ct">Lược đồ trang này là 248 bảng như thế. Một <code>post</code> tham chiếu tác giả của nó (<code>users</code>); một <code>comment</code> tham chiếu bài đăng của nó; một <code>message</code> tham chiếu một thread và một người gửi. Mọi tính năng bạn thấy đều là các bảng nối bằng khoá ngoại — và vì các khoá đó được cưỡng chế, một user đã xoá không bao giờ để lại một comment hỏng phía sau.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tự mô hình hai bảng có quan hệ</span><span class="lc-sub">Track Code Lab cho bạn thiết kế bảng và mối nối từ đầu.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — ACID: the four guarantees, proven|||1.2 — ACID: bốn bảo đảm, được chứng minh',
      slug: 'postgresql-1-2-acid',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Atomicity, Consistency, Isolation, Durability — mỗi tính chất chứng minh bằng một ví dụ chạy thật, kể cả một phi vụ chuyển tiền.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>ACID — the promises that make a database trustworthy</h2>
<p class="lead">Anyone can store data. What makes PostgreSQL a <em>database</em> and not a fancy file is a set of four guarantees, abbreviated <strong>ACID</strong>: Atomicity, Consistency, Isolation, Durability. They are the reason a bank can trust it with money. We'll prove each one with a real transaction — a transfer between two accounts — and watch Postgres refuse to break its word.</p>
<pre><code>CREATE TABLE accounts (
  id      text PRIMARY KEY,
  owner   text NOT NULL,
  balance numeric(12,2) NOT NULL CHECK (balance &gt;= 0)
);
INSERT INTO accounts VALUES ('A','Cuong', 100.00), ('B','Mai', 0.00);</code></pre>
<div class="out"> id | owner | balance
----+-------+---------
 A  | Cuong |  100.00
 B  | Mai   |    0.00
(2 rows)</div>

<h3>A — Atomicity: all of it, or none of it</h3>
<p>A money transfer is two steps: subtract from A, add to B. If the power dies between them, you must <strong>not</strong> end up with money subtracted from A but never added to B. A <strong>transaction</strong> (<code>BEGIN … COMMIT</code>) makes the two steps one indivisible unit. Let's deliberately break it: transfer 150 when A only has 100. The <code>CHECK (balance &gt;= 0)</code> will reject step one:</p>
<pre><code>BEGIN;
UPDATE accounts SET balance = balance - 150 WHERE id = 'A';   -- would make A = -50
UPDATE accounts SET balance = balance + 150 WHERE id = 'B';
COMMIT;</code></pre>
<div class="out">BEGIN
ERROR:  new row for relation "accounts" violates check constraint "accounts_balance_check"
DETAIL:  Failing row contains (A, Cuong, -50.00).
ERROR:  current transaction is aborted, commands ignored until end of transaction block
ROLLBACK</div>
<p>The first update failed, so Postgres <strong>aborted the whole transaction</strong> — the second update never even ran, and the final <code>COMMIT</code> turned into a <code>ROLLBACK</code>. Check the balances afterwards:</p>
<div class="out"> id | owner | balance
----+-------+---------
 A  | Cuong |  100.00
 B  | Mai   |    0.00
(2 rows)</div>
<p>Untouched. No money vanished. <em>That</em> is atomicity: the transaction happened completely or not at all — never halfway. A valid transfer of 60, by contrast, commits both steps together:</p>
<div class="out">BEGIN
UPDATE 1
UPDATE 1
COMMIT
 id | owner | balance
----+-------+---------
 A  | Cuong |   40.00
 B  | Mai   |   60.00
(2 rows)</div>

<h3>C — Consistency: the rules always hold</h3>
<p>You already saw it: the <code>CHECK (balance &gt;= 0)</code> rule made it <em>impossible</em> to leave the database in a state where an account is negative. Consistency means every transaction moves the database from one valid state to another — all constraints (primary keys, foreign keys, checks, not-null) hold before and after. Postgres will abort any transaction that would violate a rule, exactly as it did above.</p>

<h3>I — Isolation: concurrent transactions don't see each other's mess</h3>
<p>Many users hit the database at once. Isolation means an in-progress transaction's half-done changes are <strong>invisible</strong> to everyone else until it commits. Here two sessions run at the same time. Session A subtracts 10 from A but holds the transaction open (doesn't commit yet). Meanwhile Session B reads the balances:</p>
<pre><code><span class="tok-comment">-- Session A (transaction still OPEN, not committed):</span>
BEGIN;
UPDATE accounts SET balance = balance - 10 WHERE id = 'A';   -- A becomes 30 *inside A's view*
<span class="tok-comment">-- ... A pauses here, holding the transaction ...</span></code></pre>
<div class="out"><span class="tok-comment">-- Session B reads WHILE A is uncommitted — still sees 40, not 30:</span>
A|40.00
B|60.00</div>
<pre><code><span class="tok-comment">-- Now Session A runs COMMIT. Session B reads again:</span></code></pre>
<div class="out">A|30.00
B|60.00</div>
<p>Session B never saw the dirty, in-between value of 30 — it saw the last committed state (40) until A actually committed, then the new state (30). PostgreSQL achieves this with <strong>MVCC</strong> (Multi-Version Concurrency Control): readers never block writers and writers never block readers, because each sees a consistent snapshot. Chapter 11 is devoted to this; for now, the guarantee is what matters — no transaction ever observes another's half-finished work.</p>

<h3>D — Durability: once committed, it survives anything</h3>
<p>When <code>COMMIT</code> returns successfully, the change is <strong>permanent</strong> — it survives a crash, a power cut, a kill -9. Postgres achieves this with a <strong>write-ahead log</strong> (WAL): before changing the actual data files, it first writes the change to an append-only log and flushes that to disk. If the server dies mid-work, on restart it replays the WAL and no committed transaction is lost. The relevant settings are real and on by default:</p>
<div class="out">wal_level          = replica
fsync              = on
synchronous_commit = on</div>
<p><code>fsync = on</code> means Postgres forces the operating system to physically write to disk (not just cache) before reporting a commit as durable. Turning it off is faster and <em>dangerous</em> — a crash can then lose committed data. Leave it on in production.</p>
<div class="callout ok">ACID in one sentence: <strong>A</strong>tomicity = all-or-nothing; <strong>C</strong>onsistency = rules always hold; <strong>I</strong>solation = concurrent work stays separate; <strong>D</strong>urability = committed means permanent. Together they are why you can put money, orders, and identities in a relational database and sleep at night.</div>
<div class="note-ct">On this site, ACID isn't academic. When someone buys Pro membership, the code that grants access and records the payment runs inside one transaction — so a failure halfway can never leave a user charged-but-not-upgraded, or upgraded-but-not-charged. That's atomicity doing its job on production.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: build your own transfer and break it</span><span class="lc-sub">The Code Lab track walks through BEGIN/COMMIT/ROLLBACK hands-on.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>ACID — những lời hứa khiến một cơ sở dữ liệu đáng tin</h2>
<p class="lead">Ai cũng lưu được dữ liệu. Cái khiến PostgreSQL là một <em>cơ sở dữ liệu</em> chứ không phải một file hoa mỹ là một bộ bốn bảo đảm, viết tắt là <strong>ACID</strong>: Atomicity (nguyên tử), Consistency (nhất quán), Isolation (cô lập), Durability (bền vững). Đó là lý do một ngân hàng dám giao tiền cho nó. Ta sẽ chứng minh từng cái bằng một giao dịch thật — một phi vụ chuyển tiền giữa hai tài khoản — và xem Postgres từ chối nuốt lời.</p>
<pre><code>CREATE TABLE accounts (
  id      text PRIMARY KEY,
  owner   text NOT NULL,
  balance numeric(12,2) NOT NULL CHECK (balance &gt;= 0)
);
INSERT INTO accounts VALUES ('A','Cuong', 100.00), ('B','Mai', 0.00);</code></pre>
<div class="out"> id | owner | balance
----+-------+---------
 A  | Cuong |  100.00
 B  | Mai   |    0.00
(2 rows)</div>

<h3>A — Atomicity: hoặc trọn vẹn, hoặc không gì cả</h3>
<p>Một phi vụ chuyển tiền gồm hai bước: trừ ở A, cộng vào B. Nếu mất điện giữa hai bước, bạn <strong>không được phép</strong> rơi vào cảnh tiền đã trừ ở A mà chưa từng được cộng vào B. Một <strong>giao dịch</strong> (<code>BEGIN … COMMIT</code>) biến hai bước thành một khối không thể chia cắt. Hãy cố tình phá nó: chuyển 150 khi A chỉ có 100. Ràng buộc <code>CHECK (balance &gt;= 0)</code> sẽ từ chối bước một:</p>
<pre><code>BEGIN;
UPDATE accounts SET balance = balance - 150 WHERE id = 'A';   -- sẽ làm A = -50
UPDATE accounts SET balance = balance + 150 WHERE id = 'B';
COMMIT;</code></pre>
<div class="out">BEGIN
ERROR:  new row for relation "accounts" violates check constraint "accounts_balance_check"
DETAIL:  Failing row contains (A, Cuong, -50.00).
ERROR:  current transaction is aborted, commands ignored until end of transaction block
ROLLBACK</div>
<p>Bước cập nhật đầu tiên thất bại, nên Postgres <strong>huỷ toàn bộ giao dịch</strong> — bước cập nhật thứ hai thậm chí không chạy, và lệnh <code>COMMIT</code> cuối cùng biến thành <code>ROLLBACK</code>. Kiểm số dư sau đó:</p>
<div class="out"> id | owner | balance
----+-------+---------
 A  | Cuong |  100.00
 B  | Mai   |    0.00
(2 rows)</div>
<p>Không hề bị đụng. Không đồng nào biến mất. <em>Đó</em> là tính nguyên tử: giao dịch hoặc xảy ra trọn vẹn hoặc không hề — không bao giờ nửa chừng. Ngược lại, một phi vụ chuyển 60 hợp lệ commit cả hai bước cùng nhau:</p>
<div class="out">BEGIN
UPDATE 1
UPDATE 1
COMMIT
 id | owner | balance
----+-------+---------
 A  | Cuong |   40.00
 B  | Mai   |   60.00
(2 rows)</div>

<h3>C — Consistency: các luật luôn được giữ</h3>
<p>Bạn vừa thấy nó: luật <code>CHECK (balance &gt;= 0)</code> khiến việc để cơ sở dữ liệu ở trạng thái có tài khoản âm trở nên <em>bất khả</em>. Nhất quán nghĩa là mọi giao dịch đưa cơ sở dữ liệu từ một trạng thái hợp lệ sang một trạng thái hợp lệ khác — mọi ràng buộc (khoá chính, khoá ngoại, check, not-null) đều đúng cả trước lẫn sau. Postgres sẽ huỷ bất kỳ giao dịch nào vi phạm một luật, đúng như nó vừa làm ở trên.</p>

<h3>I — Isolation: các giao dịch đồng thời không thấy mớ dở dang của nhau</h3>
<p>Nhiều người truy cập cơ sở dữ liệu cùng lúc. Cô lập nghĩa là những thay đổi làm dở của một giao dịch đang chạy thì <strong>vô hình</strong> với mọi người khác cho tới khi nó commit. Ở đây hai phiên chạy cùng lúc. Phiên A trừ 10 khỏi A nhưng giữ giao dịch mở (chưa commit). Trong lúc đó phiên B đọc số dư:</p>
<pre><code><span class="tok-comment">-- Phiên A (giao dịch vẫn MỞ, chưa commit):</span>
BEGIN;
UPDATE accounts SET balance = balance - 10 WHERE id = 'A';   -- A thành 30 *trong tầm nhìn của A*
<span class="tok-comment">-- ... A dừng ở đây, giữ giao dịch ...</span></code></pre>
<div class="out"><span class="tok-comment">-- Phiên B đọc TRONG KHI A chưa commit — vẫn thấy 40, không phải 30:</span>
A|40.00
B|60.00</div>
<pre><code><span class="tok-comment">-- Giờ phiên A chạy COMMIT. Phiên B đọc lại:</span></code></pre>
<div class="out">A|30.00
B|60.00</div>
<p>Phiên B không bao giờ thấy giá trị bẩn, nửa vời là 30 — nó thấy trạng thái đã commit gần nhất (40) cho tới khi A thật sự commit, rồi mới thấy trạng thái mới (30). PostgreSQL đạt được điều này bằng <strong>MVCC</strong> (Multi-Version Concurrency Control — điều khiển đồng thời đa phiên bản): người đọc không bao giờ chặn người ghi và người ghi không bao giờ chặn người đọc, vì mỗi bên thấy một ảnh chụp nhất quán. Chương 11 dành riêng cho điều này; giờ, điều quan trọng là cái bảo đảm — không giao dịch nào từng quan sát được phần việc dở dang của giao dịch khác.</p>

<h3>D — Durability: đã commit thì sống sót qua mọi thứ</h3>
<p>Khi <code>COMMIT</code> trả về thành công, thay đổi trở nên <strong>vĩnh viễn</strong> — nó sống sót qua sập máy, mất điện, một cú kill -9. Postgres đạt được điều này bằng <strong>write-ahead log</strong> (WAL — nhật ký ghi-trước): trước khi đổi các file dữ liệu thật, nó ghi thay đổi vào một nhật ký chỉ-nối-thêm và ép nhật ký đó xuống đĩa trước. Nếu máy chủ chết giữa chừng, khi khởi động lại nó phát lại WAL và không giao dịch đã commit nào bị mất. Các tham số liên quan là thật và bật mặc định:</p>
<div class="out">wal_level          = replica
fsync              = on
synchronous_commit = on</div>
<p><code>fsync = on</code> nghĩa là Postgres ép hệ điều hành thật sự ghi vật lý xuống đĩa (không chỉ cache) trước khi báo một commit là bền vững. Tắt nó thì nhanh hơn nhưng <em>nguy hiểm</em> — một cú sập khi đó có thể làm mất dữ liệu đã commit. Trên production hãy để nó bật.</p>
<div class="callout ok">ACID trong một câu: <strong>A</strong>tomicity = được ăn cả ngã về không; <strong>C</strong>onsistency = luật luôn giữ; <strong>I</strong>solation = việc đồng thời giữ riêng biệt; <strong>D</strong>urability = đã commit là vĩnh viễn. Cùng nhau, chúng là lý do bạn dám đặt tiền, đơn hàng và danh tính vào một cơ sở dữ liệu quan hệ và ngủ ngon.</div>
<div class="note-ct">Trên trang này, ACID không hề mang tính học thuật. Khi ai đó mua gói Pro, đoạn code cấp quyền truy cập và ghi nhận thanh toán chạy bên trong một giao dịch — nên một cú hỏng giữa chừng không bao giờ để lại một user đã-bị-trừ-tiền-mà-chưa-nâng-cấp, hay đã-nâng-cấp-mà-chưa-trừ-tiền. Đó là tính nguyên tử làm việc của nó trên production.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tự dựng một phi vụ chuyển tiền và phá nó</span><span class="lc-sub">Track Code Lab dẫn qua BEGIN/COMMIT/ROLLBACK thực hành.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — PostgreSQL vs MySQL, SQLite & NoSQL|||1.3 — PostgreSQL vs MySQL, SQLite & NoSQL',
      slug: 'postgresql-1-3-vs-alternatives',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bức tranh toàn cảnh: khi nào chọn Postgres, khi nào SQLite, khi nào một cơ sở dữ liệu NoSQL — và vì sao "chọn Postgres" là mặc định an toàn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Where PostgreSQL sits — and when to pick something else</h2>
<p class="lead">PostgreSQL is a fantastic default, but "always use Postgres" is a slogan, not an argument. Knowing the neighbours — MySQL, SQLite, and the NoSQL family — tells you <em>why</em> it's the default and, more usefully, the few cases where it isn't the right tool. Choosing a database is one of the highest-leverage decisions in a project; make it on purpose.</p>

<h3>The two other SQL databases you'll meet</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SQLite</span><span class="v">Not a server — a C library that reads/writes one file. Zero setup, runs inside your app or phone. Brilliant for local apps, tests, and read-heavy embedded use. Weak at many concurrent writers (it locks the whole file).</span></div>
  <div class="kv"><span class="k">MySQL / MariaDB</span><span class="v">A server like Postgres, historically the "LAMP stack" default, huge ecosystem. Very capable. Postgres tends to win on correctness (stricter types, real check constraints), advanced SQL (window functions, CTEs matured earlier), and rich types (JSONB, arrays).</span></div>
  <div class="kv"><span class="k">PostgreSQL</span><span class="v">The most feature-complete open-source SQL server: JSONB, full-text search, GIS (PostGIS), window functions, powerful indexing, extensions. Strict, correct, and boringly reliable — which is the highest compliment for a database.</span></div>
</div>

<h3>SQL vs NoSQL — a real distinction, often misunderstood</h3>
<p>"NoSQL" lumps together very different tools (MongoDB, Redis, Cassandra, DynamoDB) whose only shared trait is "not a traditional relational SQL database". They exist for real reasons, but they trade away things Postgres gives you for free.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Document stores (MongoDB)</span><span class="v">Store JSON-like documents with no fixed schema. Flexible early on; but relationships and consistency become your app's problem. Note: Postgres stores JSON too, with <code>jsonb</code> — often you don't need to leave.</span></div>
  <div class="kv"><span class="k">Key-value / cache (Redis)</span><span class="v">Blazing-fast in-memory lookups by key. Not your source of truth — a companion to Postgres for caching and rate-limits (the Node.js course measured Redis at 120× faster than a Postgres aggregate, but volatile).</span></div>
  <div class="kv"><span class="k">Wide-column (Cassandra)</span><span class="v">Built for enormous write volume across many machines, giving up joins and strong consistency to get there. The right tool only at a scale most apps never reach.</span></div>
  <div class="kv"><span class="k">Relational (PostgreSQL)</span><span class="v">Schema, joins, transactions, and ACID — the things most applications actually need. And it does JSON when you want flexibility, so the "NoSQL for flexibility" argument is weaker than it sounds.</span></div>
</div>
<div class="callout warn">A common expensive mistake: reaching for a NoSQL database "for scale" on a project that has 10,000 users. You give up joins, transactions and ad-hoc queries to solve a scaling problem you don't have — and then reinvent them badly in application code. Postgres comfortably handles millions of rows and thousands of writes per second on modest hardware.</div>

<h3>A decision guide</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-st">Local app / test / one file?</div><div class="lz-sd">SQLite. No server to run.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-st">A web app backend?</div><div class="lz-sd">PostgreSQL. The safe, capable default.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-st">Need a cache / rate-limiter / pub-sub?</div><div class="lz-sd">Redis — alongside Postgres, not instead of it.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-st">Truly planet-scale writes, no joins?</div><div class="lz-sd">A specialised store — but be honest that you're really there.</div></div>
</div>

<h3>Why PostgreSQL is the right default</h3>
<p>It's free and open (no vendor can pull the rug), it's decades-hardened for correctness, it has the richest feature set so you rarely hit a wall, and every skill transfers — the SQL you learn here is standard. You can start a project on Postgres and grow to millions of users before you ever need to reconsider. That combination of "won't bite you now" and "won't limit you later" is exactly what a default should be.</p>
<div class="note-ct">This site uses PostgreSQL as the single source of truth (248 tables — users, posts, courses, payments) and Redis <em>alongside</em> it purely for caching and rate-limiting (in production: 256MB, allkeys-lru, ~89% hit rate). That's the canonical pairing: Postgres owns the truth, Redis makes the hot path fast. No NoSQL document store anywhere — <code>jsonb</code> columns cover the few places flexible data is needed.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Later: JSONB gives you NoSQL flexibility inside Postgres</span><span class="lc-sub">Chapter 13 shows schemaless JSON with real indexes — the best of both.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>PostgreSQL đứng ở đâu — và khi nào nên chọn thứ khác</h2>
<p class="lead">PostgreSQL là một mặc định tuyệt vời, nhưng "luôn dùng Postgres" là một khẩu hiệu, không phải một lập luận. Biết các hàng xóm — MySQL, SQLite, và họ NoSQL — cho bạn hiểu <em>vì sao</em> nó là mặc định và, hữu ích hơn, vài trường hợp nó không phải công cụ đúng. Chọn cơ sở dữ liệu là một trong những quyết định có sức nặng nhất trong một dự án; hãy quyết định có chủ đích.</p>

<h3>Hai cơ sở dữ liệu SQL còn lại bạn sẽ gặp</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SQLite</span><span class="v">Không phải máy chủ — một thư viện C đọc/ghi một file. Không cần cài đặt, chạy bên trong app hay điện thoại. Xuất sắc cho app cục bộ, chạy test, và dùng nhúng thiên về đọc. Yếu khi nhiều người ghi đồng thời (nó khoá cả file).</span></div>
  <div class="kv"><span class="k">MySQL / MariaDB</span><span class="v">Một máy chủ như Postgres, xưa nay là mặc định của "LAMP stack", hệ sinh thái khổng lồ. Rất mạnh. Postgres thường thắng ở tính đúng (kiểu khắt khe hơn, ràng buộc check thật), SQL nâng cao (hàm cửa sổ, CTE chín sớm hơn), và kiểu phong phú (JSONB, mảng).</span></div>
  <div class="kv"><span class="k">PostgreSQL</span><span class="v">Máy chủ SQL mã nguồn mở đầy đủ tính năng nhất: JSONB, full-text search, GIS (PostGIS), hàm cửa sổ, đánh chỉ mục mạnh, extension. Khắt khe, đúng đắn, và đáng tin một cách "nhàm chán" — mà đó là lời khen cao nhất cho một cơ sở dữ liệu.</span></div>
</div>

<h3>SQL vs NoSQL — một khác biệt thật, thường bị hiểu sai</h3>
<p>"NoSQL" gộp chung những công cụ rất khác nhau (MongoDB, Redis, Cassandra, DynamoDB) mà điểm chung duy nhất là "không phải cơ sở dữ liệu SQL quan hệ truyền thống". Chúng tồn tại vì những lý do thật, nhưng chúng đánh đổi đi những thứ Postgres cho bạn miễn phí.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Kho tài liệu (MongoDB)</span><span class="v">Lưu tài liệu kiểu JSON không có lược đồ cố định. Linh hoạt lúc đầu; nhưng quan hệ và nhất quán trở thành việc của app bạn. Lưu ý: Postgres cũng lưu JSON, với <code>jsonb</code> — thường bạn không cần rời đi.</span></div>
  <div class="kv"><span class="k">Khoá-giá trị / cache (Redis)</span><span class="v">Tra cứu theo khoá trong bộ nhớ cực nhanh. Không phải nguồn sự thật — mà là bạn đồng hành của Postgres cho cache và rate-limit (khoá Node.js đo Redis nhanh 120× so với một phép tổng hợp Postgres, nhưng dễ bay hơi).</span></div>
  <div class="kv"><span class="k">Cột-rộng (Cassandra)</span><span class="v">Sinh ra cho lượng ghi khổng lồ trải trên nhiều máy, đánh đổi join và nhất quán mạnh để có được. Là công cụ đúng chỉ ở quy mô mà đa số app không bao giờ chạm tới.</span></div>
  <div class="kv"><span class="k">Quan hệ (PostgreSQL)</span><span class="v">Lược đồ, join, giao dịch và ACID — những thứ đa số ứng dụng thật sự cần. Và nó làm được JSON khi bạn muốn linh hoạt, nên lập luận "NoSQL cho linh hoạt" yếu hơn nghe tưởng.</span></div>
</div>
<div class="callout warn">Một sai lầm đắt giá thường gặp: vơ lấy một cơ sở dữ liệu NoSQL "để mở rộng" cho một dự án có 10.000 user. Bạn từ bỏ join, giao dịch và truy vấn tuỳ biến để giải một bài toán mở rộng bạn không có — rồi tái phát minh chúng một cách tệ hại trong code ứng dụng. Postgres xử lý thoải mái hàng triệu dòng và hàng nghìn lượt ghi mỗi giây trên phần cứng khiêm tốn.</div>

<h3>Một cẩm nang quyết định</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-st">App cục bộ / test / một file?</div><div class="lz-sd">SQLite. Không có máy chủ nào phải chạy.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-st">Backend cho một web app?</div><div class="lz-sd">PostgreSQL. Mặc định an toàn và đủ mạnh.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-st">Cần cache / rate-limiter / pub-sub?</div><div class="lz-sd">Redis — bên cạnh Postgres, không thay thế nó.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-st">Ghi ở quy mô hành tinh, không join?</div><div class="lz-sd">Một kho chuyên dụng — nhưng hãy thành thật là bạn thật sự tới đó.</div></div>
</div>

<h3>Vì sao PostgreSQL là mặc định đúng</h3>
<p>Nó miễn phí và mở (không nhà cung cấp nào rút thảm được), nó được tôi luyện mấy chục năm cho tính đúng, nó có bộ tính năng giàu nhất nên bạn hiếm khi đụng tường, và mọi kỹ năng đều chuyển được — SQL bạn học ở đây là chuẩn. Bạn có thể khởi động một dự án trên Postgres và lớn tới hàng triệu user trước khi cần cân nhắc lại. Sự kết hợp "không cắn bạn bây giờ" và "không giới hạn bạn sau này" chính là điều một mặc định nên có.</p>
<div class="note-ct">Trang này dùng PostgreSQL làm nguồn sự thật duy nhất (248 bảng — users, posts, courses, payments) và Redis <em>bên cạnh</em> nó thuần tuý để cache và rate-limit (trên production: 256MB, allkeys-lru, tỉ lệ trúng ~89%). Đó là cặp đôi kinh điển: Postgres giữ sự thật, Redis làm đường nóng nhanh. Không có kho tài liệu NoSQL nào — các cột <code>jsonb</code> lo vài chỗ cần dữ liệu linh hoạt.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Sau này: JSONB cho bạn sự linh hoạt NoSQL ngay trong Postgres</span><span class="lc-sub">Chương 13 chỉ cách dùng JSON không lược đồ với chỉ mục thật — tốt cả đôi đường.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — How a query flows through Postgres|||1.4 — Một truy vấn chảy qua Postgres ra sao',
      slug: 'postgresql-1-4-dong-chay-truy-van',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Parser → planner → executor: bốn chặng một câu SELECT đi qua, và cách EXPLAIN cho bạn nhìn thấy kế hoạch của bộ máy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>What actually happens when you run a query</h2>
<p class="lead">In lesson 0.4 we said SQL is <em>declarative</em>: you describe the result, not the steps. This lesson opens the box and shows the steps PostgreSQL takes on your behalf. Understanding this pipeline is what separates someone who writes queries from someone who can make them fast — and it sets up Chapter 10, the most valuable chapter in the course.</p>

<h3>The four stages of a query</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-st">Parse</div><div class="lz-sd">Read the SQL text; check it's valid grammar; turn it into a tree.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-st">Plan / optimise</div><div class="lz-sd">The planner considers strategies (scan the table? use an index?) and picks the cheapest by estimated cost.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-st">Execute</div><div class="lz-sd">Run the chosen plan against the data on disk (and in memory cache).</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-st">Return</div><div class="lz-sd">Stream the resulting rows back to the client over the connection.</div></div>
</div>
<p>Stage 2 is where the magic — and the performance — lives. For any non-trivial query there are many possible ways to compute the answer, and they can differ by factors of <em>thousands</em>. The planner's whole job is to pick a good one, using statistics about your data (how many rows, how they're distributed).</p>

<h3>Seeing the plan: EXPLAIN</h3>
<p>You don't have to guess what the planner decided — <code>EXPLAIN</code> shows you the plan <em>without running the query</em>. Take a simple one over our notes:</p>
<pre><code>EXPLAIN SELECT title FROM notes WHERE pinned = true;</code></pre>
<div class="out">                      QUERY PLAN
------------------------------------------------------
 Seq Scan on notes  (cost=0.00..1.03 rows=2 width=13)
   Filter: pinned</div>
<p>Read it inside-out. <strong>Seq Scan on notes</strong> means "read every row of the table, top to bottom" — sensible here because the table is tiny. <strong>Filter: pinned</strong> is the WHERE condition applied to each row. The numbers matter:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">cost=0.00..1.03</span><span class="v">The planner's estimate: cost to return the first row (0.00) and the last row (1.03), in arbitrary units. Lower is what it optimises for.</span></div>
  <div class="kv"><span class="k">rows=2</span><span class="v">Its estimate of how many rows match — based on statistics, not a real count. Chapter 10 shows what happens when this estimate is wrong.</span></div>
  <div class="kv"><span class="k">width=13</span><span class="v">Estimated average bytes per returned row.</span></div>
</div>

<h3>Seeing reality: EXPLAIN ANALYZE</h3>
<p>Add <code>ANALYZE</code> and Postgres <em>actually runs</em> the query and reports the real timings next to its estimates:</p>
<pre><code>EXPLAIN ANALYZE SELECT title FROM notes WHERE pinned = true;</code></pre>
<div class="out">                                           QUERY PLAN
------------------------------------------------------------------------------------------------
 Seq Scan on notes  (cost=0.00..1.03 rows=2 width=13) (actual time=0.003..0.004 rows=2 loops=1)
   Filter: pinned
   Rows Removed by Filter: 1
 Planning Time: 0.163 ms
 Execution Time: 0.025 ms</div>
<p>Now you can compare the guess to the truth:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">actual time=0.003..0.004</span><span class="v">Real milliseconds to first and last row. Here the estimate (rows=2) matched reality (rows=2) — good statistics.</span></div>
  <div class="kv"><span class="k">Rows Removed by Filter: 1</span><span class="v">One row was read and thrown away because it wasn't pinned. On a million-row table, "removed by filter: 999,980" is the smell of a missing index.</span></div>
  <div class="kv"><span class="k">Planning Time vs Execution Time</span><span class="v">Time to <em>choose</em> the plan (0.163 ms) vs time to <em>run</em> it (0.025 ms). Both are reported separately.</span></div>
</div>
<div class="pitfall">
<p><strong>EXPLAIN ANALYZE really runs the query</strong> — including <code>UPDATE</code>, <code>DELETE</code> and <code>INSERT</code>. Running <code>EXPLAIN ANALYZE DELETE FROM notes</code> will <em>actually delete the rows</em>. To measure a write safely, wrap it in a transaction you roll back: <code>BEGIN; EXPLAIN ANALYZE DELETE …; ROLLBACK;</code>. Plain <code>EXPLAIN</code> (without ANALYZE) never executes, so it's always safe.</p>
</div>
<div class="callout ok">The core insight of this whole course: on a small table a Seq Scan is fine, but as data grows, reading every row to find a few becomes catastrophic. The fix is to give the planner a better option — an <strong>index</strong> — so it can jump straight to matching rows instead of scanning. That's Chapters 9 and 10, and this lesson is the foundation they stand on.</div>
<div class="note-ct">On this site, <code>EXPLAIN ANALYZE</code> is the first tool reached for when a page is slow. The Node.js course caught a real one: a feed query doing <code>Rows Removed by Filter</code> over a 751,000-row table ran a 28 ms sequential scan; the right index turned the same query into a 0.129 ms index scan — 222× faster — by giving the planner a way to skip straight to the rows it needed.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Next chapter: data types — the ground everything sits on</span><span class="lc-sub">Then joins, aggregation, and finally reading plans like a pro.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Chuyện gì thật sự xảy ra khi bạn chạy một truy vấn</h2>
<p class="lead">Ở bài 0.4 ta nói SQL là <em>khai báo</em>: bạn mô tả kết quả, không mô tả các bước. Bài này mở nắp hộp và cho thấy những bước PostgreSQL làm thay bạn. Hiểu đường ống này là cái tách một người viết được truy vấn khỏi một người làm được cho truy vấn nhanh — và nó dọn đường cho Chương 10, chương giá trị nhất khoá này.</p>

<h3>Bốn chặng của một truy vấn</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-st">Phân tích (Parse)</div><div class="lz-sd">Đọc văn bản SQL; kiểm ngữ pháp hợp lệ; biến thành một cây.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-st">Lập kế hoạch / tối ưu</div><div class="lz-sd">Bộ lập kế hoạch cân nhắc các chiến lược (quét bảng? dùng chỉ mục?) và chọn cái rẻ nhất theo cost ước lượng.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-st">Thực thi (Execute)</div><div class="lz-sd">Chạy kế hoạch đã chọn trên dữ liệu ở đĩa (và trong cache bộ nhớ).</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-st">Trả về (Return)</div><div class="lz-sd">Chuyển dòng kết quả về client qua kết nối.</div></div>
</div>
<p>Chặng 2 là nơi phép màu — và hiệu năng — trú ngụ. Với bất kỳ truy vấn không tầm thường nào, có nhiều cách tính ra đáp án, và chúng chênh nhau hàng <em>nghìn</em> lần. Toàn bộ việc của bộ lập kế hoạch là chọn một cách tốt, dựa trên thống kê về dữ liệu của bạn (bao nhiêu dòng, phân bố ra sao).</p>

<h3>Nhìn thấy kế hoạch: EXPLAIN</h3>
<p>Bạn không phải đoán bộ lập kế hoạch quyết định gì — <code>EXPLAIN</code> cho bạn xem kế hoạch <em>mà không chạy truy vấn</em>. Lấy một truy vấn đơn giản trên bảng notes:</p>
<pre><code>EXPLAIN SELECT title FROM notes WHERE pinned = true;</code></pre>
<div class="out">                      QUERY PLAN
------------------------------------------------------
 Seq Scan on notes  (cost=0.00..1.03 rows=2 width=13)
   Filter: pinned</div>
<p>Đọc từ trong ra. <strong>Seq Scan on notes</strong> nghĩa là "đọc mọi dòng của bảng, từ trên xuống dưới" — hợp lý ở đây vì bảng tí xíu. <strong>Filter: pinned</strong> là điều kiện WHERE áp lên từng dòng. Các con số có ý nghĩa:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">cost=0.00..1.03</span><span class="v">Ước lượng của bộ lập kế hoạch: chi phí để trả về dòng đầu tiên (0.00) và dòng cuối cùng (1.03), theo đơn vị quy ước. Nó tối ưu theo hướng số này càng thấp càng tốt.</span></div>
  <div class="kv"><span class="k">rows=2</span><span class="v">Ước lượng của nó về số dòng khớp — dựa trên thống kê, không phải đếm thật. Chương 10 chỉ ra chuyện gì xảy ra khi ước lượng này sai.</span></div>
  <div class="kv"><span class="k">width=13</span><span class="v">Ước lượng số byte trung bình mỗi dòng trả về.</span></div>
</div>

<h3>Nhìn thấy thực tế: EXPLAIN ANALYZE</h3>
<p>Thêm <code>ANALYZE</code> và Postgres <em>thật sự chạy</em> truy vấn rồi báo thời gian thật bên cạnh ước lượng của nó:</p>
<pre><code>EXPLAIN ANALYZE SELECT title FROM notes WHERE pinned = true;</code></pre>
<div class="out">                                           QUERY PLAN
------------------------------------------------------------------------------------------------
 Seq Scan on notes  (cost=0.00..1.03 rows=2 width=13) (actual time=0.003..0.004 rows=2 loops=1)
   Filter: pinned
   Rows Removed by Filter: 1
 Planning Time: 0.163 ms
 Execution Time: 0.025 ms</div>
<p>Giờ bạn có thể so ước đoán với sự thật:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">actual time=0.003..0.004</span><span class="v">Mili-giây thật tới dòng đầu và dòng cuối. Ở đây ước lượng (rows=2) khớp thực tế (rows=2) — thống kê tốt.</span></div>
  <div class="kv"><span class="k">Rows Removed by Filter: 1</span><span class="v">Một dòng đã bị đọc rồi vứt đi vì nó không được ghim. Trên một bảng triệu dòng, "removed by filter: 999.980" là mùi của một chỉ mục bị thiếu.</span></div>
  <div class="kv"><span class="k">Planning Time vs Execution Time</span><span class="v">Thời gian <em>chọn</em> kế hoạch (0.163 ms) so với thời gian <em>chạy</em> nó (0.025 ms). Cả hai được báo riêng.</span></div>
</div>
<div class="pitfall">
<p><strong>EXPLAIN ANALYZE thật sự chạy truy vấn</strong> — kể cả <code>UPDATE</code>, <code>DELETE</code> và <code>INSERT</code>. Chạy <code>EXPLAIN ANALYZE DELETE FROM notes</code> sẽ <em>thật sự xoá các dòng</em>. Muốn đo một câu ghi cho an toàn, hãy bọc nó trong một giao dịch rồi cuộn ngược: <code>BEGIN; EXPLAIN ANALYZE DELETE …; ROLLBACK;</code>. <code>EXPLAIN</code> trơn (không có ANALYZE) không bao giờ thực thi, nên luôn an toàn.</p>
</div>
<div class="callout ok">Cái nhìn cốt lõi của cả khoá này: trên một bảng nhỏ, Seq Scan là ổn, nhưng khi dữ liệu lớn lên, đọc mọi dòng để tìm vài dòng trở thành thảm hoạ. Cách sửa là cho bộ lập kế hoạch một lựa chọn tốt hơn — một <strong>chỉ mục</strong> — để nó nhảy thẳng tới các dòng khớp thay vì quét. Đó là Chương 9 và 10, và bài này là nền chúng đứng lên.</div>
<div class="note-ct">Trên trang này, <code>EXPLAIN ANALYZE</code> là công cụ đầu tiên được vơ tới khi một trang chậm. Khoá Node.js bắt được một ca thật: một truy vấn feed đang <code>Rows Removed by Filter</code> trên một bảng 751.000 dòng chạy quét tuần tự 28 ms; chỉ mục đúng biến cùng truy vấn đó thành một index scan 0,129 ms — nhanh 222× — bằng cách cho bộ lập kế hoạch một đường nhảy thẳng tới các dòng nó cần.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Chương tới: kiểu dữ liệu — mặt đất mọi thứ đứng lên</span><span class="lc-sub">Rồi join, tổng hợp, và cuối cùng là đọc kế hoạch như dân chuyên.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 1.5 Quiz ─────────────────────────── */
    {
      title: '1.5 — Chapter 1 quiz|||1.5 — Kiểm tra Chương 1',
      slug: 'postgresql-1-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về mô hình quan hệ, khoá, ACID, MVCC, so sánh cơ sở dữ liệu, và đọc EXPLAIN.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the relational model, ACID, and the query pipeline. Answer from memory; the questions follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The ACID guarantees (1.2) and reading an EXPLAIN plan (1.4) are the two ideas the whole rest of the course leans on.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về mô hình quan hệ, ACID, và đường ống truy vấn. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Bốn bảo đảm ACID (1.2) và đọc một kế hoạch EXPLAIN (1.4) là hai ý tưởng mà toàn bộ phần còn lại của khoá dựa vào.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does a FOREIGN KEY like notes.user_id REFERENCES users(id) guarantee?|||Một FOREIGN KEY như notes.user_id REFERENCES users(id) bảo đảm điều gì?',
            options: [
              'The note copies the whole user row|||Note chép cả dòng user vào',
              'A note can never reference a user that does not exist|||Một note không bao giờ tham chiếu tới một user không tồn tại',
              'Notes are sorted by user|||Note được sắp theo user',
              'The user_id column is faster to read|||Cột user_id đọc nhanh hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The core storage principle of the relational model is?|||Nguyên tắc lưu trữ cốt lõi của mô hình quan hệ là?',
            options: [
              'Store every fact once, and link by key|||Lưu mỗi sự thật một lần, và nối bằng khoá',
              'Duplicate data so joins are unnecessary|||Nhân bản dữ liệu để khỏi cần join',
              'Keep everything in one big table|||Giữ mọi thứ trong một bảng lớn',
              'Store data as JSON documents|||Lưu dữ liệu dưới dạng tài liệu JSON',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In ACID, what does Atomicity mean for a two-step transfer where step one fails?|||Trong ACID, Atomicity nghĩa là gì với một phi vụ chuyển hai bước mà bước một hỏng?',
            options: [
              'Step one is kept, step two is skipped|||Giữ bước một, bỏ bước hai',
              'Both steps are rolled back — the database is unchanged|||Cả hai bước bị cuộn ngược — cơ sở dữ liệu không đổi',
              'The database retries automatically|||Cơ sở dữ liệu tự thử lại',
              'Only a warning is logged|||Chỉ ghi một cảnh báo',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A CHECK (balance >= 0) constraint being enforced is an example of which ACID property?|||Ràng buộc CHECK (balance >= 0) được cưỡng chế là ví dụ của tính chất ACID nào?',
            options: [
              'Durability|||Durability (bền vững)',
              'Isolation|||Isolation (cô lập)',
              'Consistency|||Consistency (nhất quán)',
              'Atomicity|||Atomicity (nguyên tử)',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'While session A holds an uncommitted UPDATE, what does session B see (default isolation)?|||Khi phiên A giữ một UPDATE chưa commit, phiên B thấy gì (mức cô lập mặc định)?',
            options: [
              "A's new, uncommitted value|||Giá trị mới, chưa commit của A",
              'An error until A commits|||Một lỗi cho tới khi A commit',
              'The last committed value, until A commits|||Giá trị đã commit gần nhất, cho tới khi A commit',
              'NULL|||NULL',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Which guarantee means a committed change survives a crash or power loss?|||Bảo đảm nào nghĩa là một thay đổi đã commit sống sót qua sập máy hay mất điện?',
            options: [
              'Durability, via the write-ahead log (WAL)|||Durability, nhờ write-ahead log (WAL)',
              'Isolation, via MVCC|||Isolation, nhờ MVCC',
              'Consistency, via CHECK constraints|||Consistency, nhờ ràng buộc CHECK',
              'Atomicity, via ROLLBACK|||Atomicity, nhờ ROLLBACK',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'For a web app backend that needs joins and transactions, the safe default database is?|||Cho backend một web app cần join và giao dịch, cơ sở dữ liệu mặc định an toàn là?',
            options: [
              'MongoDB, for flexibility|||MongoDB, để linh hoạt',
              'SQLite, because it needs no server|||SQLite, vì không cần máy chủ',
              'PostgreSQL — and Redis alongside it for caching|||PostgreSQL — và Redis bên cạnh để cache',
              'Cassandra, for scale|||Cassandra, để mở rộng',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'In an EXPLAIN plan, "Seq Scan ... Rows Removed by Filter: 999,980" on a huge table usually means?|||Trong một kế hoạch EXPLAIN, "Seq Scan ... Rows Removed by Filter: 999.980" trên một bảng khổng lồ thường nghĩa là?',
            options: [
              'The query is optimal|||Truy vấn đã tối ưu',
              'A missing index — it reads the whole table to find a few rows|||Thiếu một chỉ mục — nó đọc cả bảng để tìm vài dòng',
              'The table is corrupted|||Bảng bị hỏng',
              'EXPLAIN failed|||EXPLAIN thất bại',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
