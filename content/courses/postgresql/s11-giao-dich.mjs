/**
 * PostgreSQL — Chương 11: Giao dịch & đồng thời (Giai đoạn 3 — Hiệu năng & bên trong).
 * BEGIN/COMMIT/ROLLBACK, trạng thái aborted, SAVEPOINT, DDL trong giao dịch ·
 * MVCC: xmin/xmax/ctid, ảnh chụp, đọc không chặn ghi, dead tuple ·
 * ba mức cô lập Read Committed/Repeatable Read/Serializable + write skew ·
 * khoá dòng, lost update, FOR UPDATE, SKIP LOCKED, deadlock.
 * Output CHẠY THẬT trên PostgreSQL 16.13, hai phiên psql song song thật (FIFO).
 * LUẬT: < > trong code/out → &lt; &gt;; & → &amp;; backtick → &#96;; ${ → \${.
 * Khối .out LUÔN đóng </div> (KHÔNG </code></pre>).
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 11 — Transactions & concurrency|||Chương 11 — Giao dịch & đồng thời',
  description: 'Điều gì xảy ra khi hai người dùng chạm vào cùng một dòng cùng lúc. Giao dịch và tính nguyên tử, MVCC — cơ chế cho phép người đọc không bao giờ chặn người ghi, ba mức cô lập và đúng những bất thường mỗi mức ngăn được, khoá dòng, lost update, và deadlock. Mọi kịch bản chạy trên hai phiên psql thật, song song.',
  lessons: [
    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — Transactions: all of it, or none of it|||11.1 — Giao dịch: được tất cả, hoặc không gì cả',
      slug: 'postgresql-11-1-giao-dich',
      type: 'LESSON',
      isFreePreview: true,
      description: 'BEGIN/COMMIT/ROLLBACK, vì sao mọi câu lệnh trần đã là một giao dịch, trạng thái "aborted" gây bối rối nhất của Postgres, SAVEPOINT để cứu một giao dịch khỏi lỗi, và điều PostgreSQL làm được mà MySQL không: rollback cả DDL.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1 · Phase 3 — Performance &amp; internals</span>
<h2>The unit of "it worked"</h2>
<p class="lead">Chapter 1 introduced ACID with a bank transfer. This chapter is where you actually learn to control it. A <strong>transaction</strong> is a group of statements that either all take effect or none do — and once you are running a real application with more than one user, almost every bug that is genuinely hard to reproduce lives in this chapter.</p>
<p>Everything below ran on a live PostgreSQL 16.13 with the <code>accounts</code> table from Chapter 1:</p>
<pre><code><span class="tok-keyword">CREATE TABLE</span> accounts (
  id      text <span class="tok-keyword">PRIMARY KEY</span>,
  owner   text <span class="tok-keyword">NOT NULL</span>,
  balance numeric(12,2) <span class="tok-keyword">NOT NULL</span> <span class="tok-keyword">CHECK</span> (balance &gt;= 0)
);
<span class="tok-keyword">INSERT INTO</span> accounts <span class="tok-keyword">VALUES</span> (<span class="tok-string">'A'</span>,<span class="tok-string">'Cuong'</span>, 100.00), (<span class="tok-string">'B'</span>,<span class="tok-string">'Mai'</span>, 0.00);</code></pre>

<h3>You have been using transactions all along</h3>
<p>Run a bare <code>UPDATE</code> with no <code>BEGIN</code> and PostgreSQL still wraps it in a transaction — it just opens and closes one for you. This is called <strong>autocommit</strong>, and it is why a single statement is never half-applied: an <code>UPDATE</code> that touches 40,000 rows and hits a constraint violation on row 39,999 changes <em>nothing</em>.</p>
<p>So <code>BEGIN</code> is not what makes your work atomic. It is what lets you make <em>several</em> statements atomic together.</p>

<h3>ROLLBACK: undo everything, as if it never happened</h3>
<pre><code><span class="tok-keyword">BEGIN</span>;
<span class="tok-keyword">UPDATE</span> accounts <span class="tok-keyword">SET</span> balance = balance - 100 <span class="tok-keyword">WHERE</span> id = <span class="tok-string">'A'</span>;
<span class="tok-keyword">UPDATE</span> accounts <span class="tok-keyword">SET</span> balance = balance + 100 <span class="tok-keyword">WHERE</span> id = <span class="tok-string">'B'</span>;
<span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> accounts <span class="tok-keyword">ORDER BY</span> id;
<span class="tok-keyword">ROLLBACK</span>;
<span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> accounts <span class="tok-keyword">ORDER BY</span> id;</code></pre>
<div class="out">BEGIN
UPDATE 1
UPDATE 1
 id | owner | balance
----+-------+---------
 A  | Cuong |    0.00
 B  | Mai   |  100.00
(2 rows)

ROLLBACK
 id | owner | balance
----+-------+---------
 A  | Cuong |  100.00
 B  | Mai   |    0.00
(2 rows)</div>
<p>Inside the transaction the money had moved. After <code>ROLLBACK</code> it is exactly as before. Note the important half of that: <strong>your own session sees its uncommitted changes</strong> — a transaction reads its own writes. Nobody else does, which is lesson 11.2.</p>
<div class="callout ok"><code>BEGIN; … ROLLBACK;</code> is the safest tool in this course. Before running an <code>UPDATE</code> or <code>DELETE</code> you are unsure about, wrap it, look at the row count and a <code>SELECT</code>, and only then decide between <code>COMMIT</code> and <code>ROLLBACK</code>. It costs one extra line and has saved more production data than any backup.</div>

<h3>The aborted state — the confusing one</h3>
<p>An error inside a transaction does not just fail that statement. It poisons the whole transaction, and every subsequent statement is refused until you end it:</p>
<pre><code><span class="tok-keyword">BEGIN</span>;
<span class="tok-keyword">UPDATE</span> accounts <span class="tok-keyword">SET</span> balance = balance - 500 <span class="tok-keyword">WHERE</span> id = <span class="tok-string">'A'</span>;   <span class="tok-comment">-- vi phạm CHECK</span>
<span class="tok-keyword">SELECT</span> <span class="tok-string">'does this run?'</span> <span class="tok-keyword">AS</span> thu;
<span class="tok-keyword">COMMIT</span>;</code></pre>
<div class="out">BEGIN
ERROR:  new row for relation "accounts" violates check constraint "accounts_balance_check"
DETAIL:  Failing row contains (A, Cuong, -400.00).
ERROR:  current transaction is aborted, commands ignored until end of transaction block
ROLLBACK</div>
<p>Three things to read carefully there:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The <code>CHECK</code> did its job</span><span class="lz-d">Chapter 3's constraint refused a negative balance. The database protected the invariant, exactly as designed.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The <code>SELECT</code> never ran</span><span class="lz-d"><em>current transaction is aborted, commands ignored until end of transaction block.</em> Once a transaction has errored, it accepts nothing but <code>ROLLBACK</code> (or <code>ROLLBACK TO SAVEPOINT</code>). This is the message people hit at 2am and misread as "the database is broken".</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>COMMIT</code> printed <code>ROLLBACK</code></span><span class="lz-d">Look at the last line. You asked to commit; PostgreSQL rolled back. It <strong>cannot</strong> commit an aborted transaction, so committing one is silently a rollback. If your code logs "commit succeeded" here, that log is lying to you.</span></div>
</div>

<h3>SAVEPOINT: a checkpoint inside a transaction</h3>
<p>Sometimes you want one statement to be allowed to fail without losing the rest of the transaction. A <code>SAVEPOINT</code> is a marker you can roll back <em>to</em>:</p>
<pre><code><span class="tok-keyword">BEGIN</span>;
<span class="tok-keyword">UPDATE</span> accounts <span class="tok-keyword">SET</span> balance = balance - 40 <span class="tok-keyword">WHERE</span> id = <span class="tok-string">'A'</span>;
<span class="tok-keyword">SAVEPOINT</span> sp1;
<span class="tok-keyword">UPDATE</span> accounts <span class="tok-keyword">SET</span> balance = balance - 500 <span class="tok-keyword">WHERE</span> id = <span class="tok-string">'A'</span>;   <span class="tok-comment">-- sẽ hỏng</span>
<span class="tok-keyword">ROLLBACK TO SAVEPOINT</span> sp1;
<span class="tok-keyword">UPDATE</span> accounts <span class="tok-keyword">SET</span> balance = balance + 40 <span class="tok-keyword">WHERE</span> id = <span class="tok-string">'B'</span>;
<span class="tok-keyword">COMMIT</span>;</code></pre>
<div class="out">BEGIN
UPDATE 1
SAVEPOINT
ERROR:  new row for relation "accounts" violates check constraint "accounts_balance_check"
DETAIL:  Failing row contains (A, Cuong, -440.00).
ROLLBACK
UPDATE 1
COMMIT
 id | owner | balance
----+-------+---------
 A  | Cuong |   60.00
 B  | Mai   |   40.00
(2 rows)</div>
<p>The failing statement was undone; the transfer of 40 survived and committed. Without the savepoint, that error would have killed the whole transaction.</p>
<div class="callout warn">Savepoints are not free. Each one takes a subtransaction ID, and a loop that creates thousands of them in one transaction is a well-known way to make a busy server crawl. Use them for a handful of genuinely optional steps, not as a general-purpose <code>try/catch</code> per row.</div>

<h3>DDL is transactional too — and this is rare</h3>
<p>In PostgreSQL, <code>CREATE TABLE</code>, <code>ALTER TABLE</code>, <code>DROP TABLE</code> and friends live inside the transaction like everything else:</p>
<pre><code><span class="tok-keyword">BEGIN</span>;
<span class="tok-keyword">CREATE TABLE</span> thu_ddl (id int);
<span class="tok-keyword">INSERT INTO</span> thu_ddl <span class="tok-keyword">VALUES</span> (1);
<span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> thu_ddl;
<span class="tok-keyword">ROLLBACK</span>;
<span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> thu_ddl;</code></pre>
<div class="out">BEGIN
CREATE TABLE
INSERT 0 1
 count
-------
     1
(1 row)

ROLLBACK
ERROR:  relation "thu_ddl" does not exist
LINE 1: SELECT count(*) FROM thu_ddl;
                             ^</div>
<p>The table existed, took a row, and then stopped ever having existed. MySQL cannot do this — DDL there commits implicitly, so a migration that fails halfway leaves you with half a schema. In PostgreSQL a migration can wrap all its steps in one transaction and either land completely or not at all, which is precisely why Prisma migrations (Chapter 16) are as safe as they are.</p>
<div class="pitfall"><p><strong>Trap — a transaction left open.</strong> <code>BEGIN</code> with no matching <code>COMMIT</code>/<code>ROLLBACK</code> is not harmless idling. The session sits in <code>idle in transaction</code>, and while it does it holds its locks and pins a snapshot — which means <code>VACUUM</code> cannot clean up any row version newer than that snapshot, anywhere in the database (Chapter 14). One forgotten <code>psql</code> window with an open <code>BEGIN</code> can bloat a busy table for hours. Find them with <code>SELECT pid, state, xact_start, query FROM pg_stat_activity WHERE state = 'idle in transaction';</code> and set <code>idle_in_transaction_session_timeout</code> so the server closes them for you.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: drive a transaction into the aborted state, then rescue one with a savepoint</span><span class="lc-sub">The Code Lab track reproduces both outputs above line by line.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1 · Giai đoạn 3 — Hiệu năng &amp; bên trong</span>
<h2>Đơn vị của "nó đã chạy xong"</h2>
<p class="lead">Chương 1 giới thiệu ACID bằng một lệnh chuyển tiền. Chương này mới là chỗ bạn thật sự học cách điều khiển nó. Một <strong>giao dịch (transaction)</strong> là một nhóm câu lệnh mà hoặc tất cả cùng có hiệu lực, hoặc không cái nào cả — và một khi bạn chạy ứng dụng thật với nhiều hơn một người dùng, gần như mọi con bug khó tái hiện đều nằm trong chương này.</p>
<p>Mọi thứ dưới đây chạy trên một PostgreSQL 16.13 thật, với bảng <code>accounts</code> từ Chương 1:</p>
<pre><code><span class="tok-keyword">CREATE TABLE</span> accounts (
  id      text <span class="tok-keyword">PRIMARY KEY</span>,
  owner   text <span class="tok-keyword">NOT NULL</span>,
  balance numeric(12,2) <span class="tok-keyword">NOT NULL</span> <span class="tok-keyword">CHECK</span> (balance &gt;= 0)
);
<span class="tok-keyword">INSERT INTO</span> accounts <span class="tok-keyword">VALUES</span> (<span class="tok-string">'A'</span>,<span class="tok-string">'Cuong'</span>, 100.00), (<span class="tok-string">'B'</span>,<span class="tok-string">'Mai'</span>, 0.00);</code></pre>

<h3>Bạn đã dùng giao dịch từ đầu tới giờ rồi</h3>
<p>Chạy một câu <code>UPDATE</code> trần không có <code>BEGIN</code> thì PostgreSQL vẫn bọc nó trong một giao dịch — chỉ là nó tự mở và tự đóng giùm bạn. Cái này gọi là <strong>autocommit</strong>, và đó là lý do một câu lệnh đơn KHÔNG BAO GIỜ áp dụng được một nửa: một <code>UPDATE</code> chạm 40.000 dòng mà vi phạm ràng buộc ở dòng 39.999 thì đổi <em>không gì cả</em>.</p>
<p>Vậy <code>BEGIN</code> không phải thứ làm cho việc của bạn thành nguyên tử. Nó là thứ cho phép bạn làm <em>nhiều</em> câu lệnh nguyên tử CÙNG NHAU.</p>

<h3>ROLLBACK: hoàn tác sạch, như chưa từng xảy ra</h3>
<pre><code><span class="tok-keyword">BEGIN</span>;
<span class="tok-keyword">UPDATE</span> accounts <span class="tok-keyword">SET</span> balance = balance - 100 <span class="tok-keyword">WHERE</span> id = <span class="tok-string">'A'</span>;
<span class="tok-keyword">UPDATE</span> accounts <span class="tok-keyword">SET</span> balance = balance + 100 <span class="tok-keyword">WHERE</span> id = <span class="tok-string">'B'</span>;
<span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> accounts <span class="tok-keyword">ORDER BY</span> id;
<span class="tok-keyword">ROLLBACK</span>;
<span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> accounts <span class="tok-keyword">ORDER BY</span> id;</code></pre>
<div class="out">BEGIN
UPDATE 1
UPDATE 1
 id | owner | balance
----+-------+---------
 A  | Cuong |    0.00
 B  | Mai   |  100.00
(2 rows)

ROLLBACK
 id | owner | balance
----+-------+---------
 A  | Cuong |  100.00
 B  | Mai   |    0.00
(2 rows)</div>
<p>Bên trong giao dịch, tiền đã chuyển. Sau <code>ROLLBACK</code> thì đúng y như cũ. Để ý nửa quan trọng của điều đó: <strong>phiên của chính bạn NHÌN THẤY thay đổi chưa commit của nó</strong> — một giao dịch đọc được cái nó vừa ghi. Người khác thì không, và đó là bài 11.2.</p>
<div class="callout ok"><code>BEGIN; … ROLLBACK;</code> là công cụ an toàn nhất trong cả khoá này. Trước khi chạy một <code>UPDATE</code> hay <code>DELETE</code> mà bạn chưa chắc, hãy bọc nó lại, nhìn số dòng và một câu <code>SELECT</code>, rồi mới chọn giữa <code>COMMIT</code> và <code>ROLLBACK</code>. Nó tốn thêm một dòng và đã cứu nhiều dữ liệu production hơn bất kỳ bản sao lưu nào.</div>

<h3>Trạng thái aborted — cái gây bối rối nhất</h3>
<p>Một lỗi bên trong giao dịch không chỉ làm hỏng câu lệnh đó. Nó đầu độc CẢ giao dịch, và mọi câu lệnh sau đó đều bị từ chối cho tới khi bạn kết thúc:</p>
<pre><code><span class="tok-keyword">BEGIN</span>;
<span class="tok-keyword">UPDATE</span> accounts <span class="tok-keyword">SET</span> balance = balance - 500 <span class="tok-keyword">WHERE</span> id = <span class="tok-string">'A'</span>;   <span class="tok-comment">-- vi phạm CHECK</span>
<span class="tok-keyword">SELECT</span> <span class="tok-string">'câu này có chạy không?'</span> <span class="tok-keyword">AS</span> thu;
<span class="tok-keyword">COMMIT</span>;</code></pre>
<div class="out">BEGIN
ERROR:  new row for relation "accounts" violates check constraint "accounts_balance_check"
DETAIL:  Failing row contains (A, Cuong, -400.00).
ERROR:  current transaction is aborted, commands ignored until end of transaction block
ROLLBACK</div>
<p>Có ba thứ cần đọc thật kỹ ở đó:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cái <code>CHECK</code> đã làm đúng việc của nó</span><span class="lz-d">Ràng buộc từ Chương 3 từ chối một số dư âm. Cơ sở dữ liệu bảo vệ bất biến, đúng như thiết kế.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Câu <code>SELECT</code> KHÔNG hề chạy</span><span class="lz-d"><em>current transaction is aborted, commands ignored until end of transaction block.</em> Một khi giao dịch đã lỗi, nó không nhận gì ngoài <code>ROLLBACK</code> (hoặc <code>ROLLBACK TO SAVEPOINT</code>). Đây chính là dòng chữ người ta gặp lúc 2 giờ sáng và đọc nhầm thành "cơ sở dữ liệu hỏng rồi".</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>COMMIT</code> lại in ra <code>ROLLBACK</code></span><span class="lz-d">Nhìn dòng cuối. Bạn bảo commit; PostgreSQL lùi lại hết. Nó <strong>KHÔNG THỂ</strong> commit một giao dịch đã aborted, nên commit một cái như vậy thực chất là rollback. Nếu mã của bạn ghi log "commit thành công" ở đây, cái log đó đang nói dối bạn.</span></div>
</div>

<h3>SAVEPOINT: một cột mốc bên trong giao dịch</h3>
<p>Đôi khi bạn muốn cho phép MỘT câu lệnh được hỏng mà không mất phần còn lại của giao dịch. <code>SAVEPOINT</code> là một cái mốc bạn có thể lùi <em>về</em>:</p>
<pre><code><span class="tok-keyword">BEGIN</span>;
<span class="tok-keyword">UPDATE</span> accounts <span class="tok-keyword">SET</span> balance = balance - 40 <span class="tok-keyword">WHERE</span> id = <span class="tok-string">'A'</span>;
<span class="tok-keyword">SAVEPOINT</span> sp1;
<span class="tok-keyword">UPDATE</span> accounts <span class="tok-keyword">SET</span> balance = balance - 500 <span class="tok-keyword">WHERE</span> id = <span class="tok-string">'A'</span>;   <span class="tok-comment">-- sẽ hỏng</span>
<span class="tok-keyword">ROLLBACK TO SAVEPOINT</span> sp1;
<span class="tok-keyword">UPDATE</span> accounts <span class="tok-keyword">SET</span> balance = balance + 40 <span class="tok-keyword">WHERE</span> id = <span class="tok-string">'B'</span>;
<span class="tok-keyword">COMMIT</span>;</code></pre>
<div class="out">BEGIN
UPDATE 1
SAVEPOINT
ERROR:  new row for relation "accounts" violates check constraint "accounts_balance_check"
DETAIL:  Failing row contains (A, Cuong, -440.00).
ROLLBACK
UPDATE 1
COMMIT
 id | owner | balance
----+-------+---------
 A  | Cuong |   60.00
 B  | Mai   |   40.00
(2 rows)</div>
<p>Câu lệnh hỏng đã bị hoàn tác; lệnh chuyển 40 sống sót và commit được. Không có savepoint thì lỗi đó đã giết cả giao dịch.</p>
<div class="callout warn">Savepoint không miễn phí. Mỗi cái chiếm một ID giao dịch con, và một vòng lặp tạo hàng nghìn cái trong MỘT giao dịch là cách quen thuộc để làm một máy chủ bận bò lê. Dùng chúng cho một nhúm bước thật sự không bắt buộc, đừng dùng như <code>try/catch</code> cho từng dòng.</div>

<h3>DDL cũng nằm trong giao dịch — và điều này hiếm</h3>
<p>Ở PostgreSQL, <code>CREATE TABLE</code>, <code>ALTER TABLE</code>, <code>DROP TABLE</code> và anh em đều sống trong giao dịch như mọi thứ khác:</p>
<pre><code><span class="tok-keyword">BEGIN</span>;
<span class="tok-keyword">CREATE TABLE</span> thu_ddl (id int);
<span class="tok-keyword">INSERT INTO</span> thu_ddl <span class="tok-keyword">VALUES</span> (1);
<span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> thu_ddl;
<span class="tok-keyword">ROLLBACK</span>;
<span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> thu_ddl;</code></pre>
<div class="out">BEGIN
CREATE TABLE
INSERT 0 1
 count
-------
     1
(1 row)

ROLLBACK
ERROR:  relation "thu_ddl" does not exist
LINE 1: SELECT count(*) FROM thu_ddl;
                             ^</div>
<p>Cái bảng đã tồn tại, đã nhận một dòng, rồi thôi không từng tồn tại nữa. MySQL không làm được điều này — DDL ở đó commit ngầm, nên một migration hỏng giữa chừng để lại cho bạn nửa cái lược đồ. Ở PostgreSQL một migration có thể bọc mọi bước trong MỘT giao dịch và hoặc vào trọn vẹn hoặc không vào gì — chính xác là lý do migration của Prisma (Chương 16) an toàn đến vậy.</p>
<div class="pitfall"><p><strong>Bẫy — một giao dịch bị bỏ ngỏ.</strong> <code>BEGIN</code> mà không có <code>COMMIT</code>/<code>ROLLBACK</code> đi kèm KHÔNG phải là ngồi không vô hại. Phiên đó nằm ở trạng thái <code>idle in transaction</code>, và trong lúc đó nó GIỮ khoá và GHIM một ảnh chụp — nghĩa là <code>VACUUM</code> không dọn nổi bất kỳ phiên bản dòng nào mới hơn ảnh chụp ấy, ở BẤT KỲ ĐÂU trong cơ sở dữ liệu (Chương 14). Một cửa sổ <code>psql</code> bị quên với một <code>BEGIN</code> mở có thể làm phình một bảng bận suốt nhiều giờ. Tìm chúng bằng <code>SELECT pid, state, xact_start, query FROM pg_stat_activity WHERE state = 'idle in transaction';</code> và đặt <code>idle_in_transaction_session_timeout</code> để máy chủ tự đóng giùm.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: đẩy một giao dịch vào trạng thái aborted, rồi cứu một cái bằng savepoint</span><span class="lc-sub">Nhánh Code Lab tái hiện cả hai output ở trên, từng dòng một.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — MVCC: why readers never block writers|||11.2 — MVCC: vì sao người đọc không bao giờ chặn người ghi',
      slug: 'postgresql-11-2-mvcc',
      type: 'LESSON',
      description: 'Cơ chế trung tâm của PostgreSQL: mỗi giao dịch thấy một ảnh chụp riêng. xmin/xmax/ctid hiện ra bằng mắt, một UPDATE thật sự là chép-rồi-đánh-dấu-chết, và cái giá phải trả — dead tuple và bloat, đo thật 4,6 MB → 13 MB.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2 · Phase 3 — Performance &amp; internals</span>
<h2>Everyone gets their own snapshot</h2>
<p class="lead">Here is the design decision that shapes almost everything else about PostgreSQL. When you <code>UPDATE</code> a row, Postgres does <strong>not</strong> overwrite it. It writes a <em>new version</em> of the row and marks the old one as expired. Old readers keep reading the old version; new readers get the new one. This is <strong>MVCC</strong> — Multi-Version Concurrency Control — and its headline consequence is a rule worth memorising: <strong>readers never block writers, and writers never block readers.</strong></p>

<h3>See it with your own eyes: xmin, xmax, ctid</h3>
<p>Every table has hidden system columns. <code>xmin</code> is the transaction that created this row version; <code>ctid</code> is its physical location as <code>(page, slot)</code>:</p>
<pre><code><span class="tok-keyword">CREATE TABLE</span> mvcc_demo (id int <span class="tok-keyword">PRIMARY KEY</span>, val text);
<span class="tok-keyword">INSERT INTO</span> mvcc_demo <span class="tok-keyword">VALUES</span> (1,<span class="tok-string">'first'</span>);
<span class="tok-keyword">SELECT</span> ctid, xmin, xmax, * <span class="tok-keyword">FROM</span> mvcc_demo;</code></pre>
<div class="out"> ctid  | xmin | xmax | id |  val
-------+------+------+----+-------
 (0,1) |  741 |    0 |  1 | first
(1 row)</div>
<p>Now update it and look again:</p>
<pre><code><span class="tok-keyword">UPDATE</span> mvcc_demo <span class="tok-keyword">SET</span> val = <span class="tok-string">'second'</span> <span class="tok-keyword">WHERE</span> id = 1;
<span class="tok-keyword">SELECT</span> ctid, xmin, xmax, * <span class="tok-keyword">FROM</span> mvcc_demo;</code></pre>
<div class="out"> ctid  | xmin | xmax | id |  val
-------+------+------+----+--------
 (0,2) |  742 |    0 |  1 | second
(1 row)</div>
<p>Read those two outputs side by side. The <code>ctid</code> moved from <code>(0,1)</code> to <code>(0,2)</code> — <strong>slot 2 of the same page</strong>. The row you see is a physically different row than before. The old version is still sitting in slot 1, now stamped with <code>xmax = 742</code>, invisible to anyone whose snapshot started after that transaction committed.</p>
<div class="callout ok">This is the single most useful mental model in PostgreSQL: an <code>UPDATE</code> is really <em>an <code>INSERT</code> of a new version plus a "died at" stamp on the old one</em>. A <code>DELETE</code> is just the stamp with no new version. Once you hold that picture, index-only scans, bloat, <code>VACUUM</code>, replication lag and long-transaction problems all stop being separate mysteries.</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">INSERT</span><span class="lz-v">A row version is written with <code>xmin</code> = the creating transaction and <code>xmax</code> = 0. Visible to every snapshot that starts after that transaction commits.</span></div>
<div class="lz-layer"><span class="lz-k">UPDATE</span><span class="lz-v">A <em>new</em> version is written at a new <code>ctid</code>, and the old one is stamped <code>xmax</code> = the updating transaction. Both exist on disk simultaneously.</span></div>
<div class="lz-layer"><span class="lz-k">old snapshots</span><span class="lz-v">A transaction that began earlier keeps reading the old version. This is why it never has to wait — nothing was overwritten.</span></div>
<div class="lz-layer"><span class="lz-k">dead tuple</span><span class="lz-v">Once no snapshot can still need it, the old version is garbage — but it stays on disk, occupying space, until something clears it.</span></div>
<div class="lz-layer"><span class="lz-k">VACUUM</span><span class="lz-v">Marks that space reusable by this table. The file does not shrink (measured below); only <code>VACUUM FULL</code> returns space to the OS.</span></div>
</div>
<h3>The payoff: a writer in flight does not stop a reader</h3>
<p>Two real psql sessions, side by side. Session A opens a transaction and updates a row without committing; session B reads the same row:</p>
<div class="out">A│ BEGIN;
A│ BEGIN
A│ UPDATE accounts SET balance = balance - 10 WHERE id = 'A';
A│ UPDATE 1
B│ SELECT id, balance FROM accounts WHERE id = 'A';
B│  id | balance
B│ ----+---------
B│  A  |   50.00
B│ (1 row)
A│ COMMIT;
A│ COMMIT
B│ SELECT id, balance FROM accounts WHERE id = 'A';
B│  id | balance
B│ ----+---------
B│  A  |   40.00
B│ (1 row)</div>
<p>B's first <code>SELECT</code> returned <strong>instantly</strong> with the old value (50.00), while A was mid-update. It did not wait, and it did not see A's uncommitted work. After A committed, B's next <code>SELECT</code> saw 40.00.</p>
<p>In a database that locks on read, B would have blocked until A finished. That is the difference you feel on a live site: a long report query cannot freeze your checkout, and a slow write cannot freeze your dashboard.</p>
<div class="note-ct">This is also why <code>SELECT</code> on cuongthai.com's feed stays responsive while posts are being written. No reader in the app takes a lock to read; the snapshot mechanism does the work.</div>

<h3>The price: dead tuples and bloat</h3>
<p>Nothing is free. Every superseded row version stays on disk until something cleans it up. Measured on a real 100,000-row table:</p>
<pre><code><span class="tok-keyword">CREATE TABLE</span> bloat_demo <span class="tok-keyword">AS</span> <span class="tok-keyword">SELECT</span> g <span class="tok-keyword">AS</span> id, <span class="tok-string">'row '</span>||g <span class="tok-keyword">AS</span> val <span class="tok-keyword">FROM</span> generate_series(1,100000) g;
<span class="tok-keyword">SELECT</span> pg_size_pretty(pg_relation_size(<span class="tok-string">'bloat_demo'</span>));
<span class="tok-keyword">UPDATE</span> bloat_demo <span class="tok-keyword">SET</span> val = val || <span class="tok-string">'!'</span>;    <span class="tok-comment">-- lượt 1</span>
<span class="tok-keyword">UPDATE</span> bloat_demo <span class="tok-keyword">SET</span> val = val || <span class="tok-string">'!'</span>;    <span class="tok-comment">-- lượt 2</span></code></pre>
<div class="out">-- ban đầu
 4608 kB
-- sau UPDATE lượt 1
 8928 kB
-- sau UPDATE lượt 2
 13 MB</div>
<p>The table still holds exactly 100,000 live rows, and it has nearly <strong>tripled</strong> on disk. Ask Postgres how many corpses are in there:</p>
<pre><code><span class="tok-keyword">SELECT</span> n_live_tup, n_dead_tup <span class="tok-keyword">FROM</span> pg_stat_user_tables <span class="tok-keyword">WHERE</span> relname=<span class="tok-string">'bloat_demo'</span>;</code></pre>
<div class="out"> n_live_tup | n_dead_tup
------------+------------
     100000 |     199915
(1 row)</div>
<p>199,915 dead tuples — two full rounds of updates, minus a few the system already tidied. This is what <code>VACUUM</code> exists for:</p>
<pre><code><span class="tok-keyword">VACUUM</span> bloat_demo;
<span class="tok-keyword">SELECT</span> n_live_tup, n_dead_tup <span class="tok-keyword">FROM</span> pg_stat_user_tables <span class="tok-keyword">WHERE</span> relname=<span class="tok-string">'bloat_demo'</span>;
<span class="tok-keyword">SELECT</span> pg_size_pretty(pg_relation_size(<span class="tok-string">'bloat_demo'</span>));</code></pre>
<div class="out"> n_live_tup | n_dead_tup
------------+------------
     100000 |          0
(1 row)

 13 MB</div>
<p>Read that result carefully, because it surprises nearly everyone: the dead tuples are gone, and <strong>the file is still 13 MB</strong>. Plain <code>VACUUM</code> marks that space reusable <em>by this table</em>; it does not hand it back to the operating system. Only <code>VACUUM FULL</code> rewrites the table to shrink it — and it takes an <code>ACCESS EXCLUSIVE</code> lock, blocking everything, so it is not a routine operation. Chapter 14 covers autovacuum, when bloat actually matters, and what to do about it.</p>
<div class="pitfall"><p><strong>Trap — a long-running transaction quietly disables cleanup everywhere.</strong> <code>VACUUM</code> may only remove a dead row version if no snapshot could still need it. A transaction that has been open for two hours pins a snapshot from two hours ago, so <em>every</em> row version created since then must be kept — across the whole database, not just the tables that transaction touched. The symptom looks unrelated: an unrelated hot table balloons and its queries slow down, while nothing about that table has changed. That report query someone left open in a psql tab is the cause. Check <code>SELECT pid, now()-xact_start AS age, state, query FROM pg_stat_activity WHERE xact_start IS NOT NULL ORDER BY age DESC;</code> before you go looking for anything cleverer.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: watch ctid move, then bloat a table and vacuum it</span><span class="lc-sub">The Code Lab track reproduces the 4,608 kB → 13 MB measurement.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2 · Giai đoạn 3 — Hiệu năng &amp; bên trong</span>
<h2>Ai cũng có ảnh chụp riêng của mình</h2>
<p class="lead">Đây là quyết định thiết kế định hình gần như mọi thứ khác của PostgreSQL. Khi bạn <code>UPDATE</code> một dòng, Postgres <strong>KHÔNG</strong> ghi đè lên nó. Nó ghi một <em>phiên bản mới</em> của dòng và đánh dấu bản cũ là đã hết hạn. Người đọc cũ vẫn đọc bản cũ; người đọc mới nhận bản mới. Đây là <strong>MVCC</strong> — Multi-Version Concurrency Control — và hệ quả nổi bật của nó là một quy tắc đáng thuộc lòng: <strong>người đọc không bao giờ chặn người ghi, và người ghi không bao giờ chặn người đọc.</strong></p>

<h3>Nhìn tận mắt: xmin, xmax, ctid</h3>
<p>Mọi bảng đều có các cột hệ thống ẩn. <code>xmin</code> là giao dịch đã tạo ra phiên bản dòng này; <code>ctid</code> là vị trí vật lý của nó dạng <code>(trang, ô)</code>:</p>
<pre><code><span class="tok-keyword">CREATE TABLE</span> mvcc_demo (id int <span class="tok-keyword">PRIMARY KEY</span>, val text);
<span class="tok-keyword">INSERT INTO</span> mvcc_demo <span class="tok-keyword">VALUES</span> (1,<span class="tok-string">'first'</span>);
<span class="tok-keyword">SELECT</span> ctid, xmin, xmax, * <span class="tok-keyword">FROM</span> mvcc_demo;</code></pre>
<div class="out"> ctid  | xmin | xmax | id |  val
-------+------+------+----+-------
 (0,1) |  741 |    0 |  1 | first
(1 row)</div>
<p>Giờ cập nhật nó rồi nhìn lại:</p>
<pre><code><span class="tok-keyword">UPDATE</span> mvcc_demo <span class="tok-keyword">SET</span> val = <span class="tok-string">'second'</span> <span class="tok-keyword">WHERE</span> id = 1;
<span class="tok-keyword">SELECT</span> ctid, xmin, xmax, * <span class="tok-keyword">FROM</span> mvcc_demo;</code></pre>
<div class="out"> ctid  | xmin | xmax | id |  val
-------+------+------+----+--------
 (0,2) |  742 |    0 |  1 | second
(1 row)</div>
<p>Đọc hai output cạnh nhau. <code>ctid</code> đã nhảy từ <code>(0,1)</code> sang <code>(0,2)</code> — <strong>ô số 2 của cùng một trang</strong>. Dòng bạn đang thấy là một dòng VẬT LÝ KHÁC so với lúc nãy. Bản cũ vẫn còn nằm ở ô 1, giờ mang dấu <code>xmax = 742</code>, vô hình với bất kỳ ai có ảnh chụp bắt đầu sau khi giao dịch đó commit.</p>
<div class="callout ok">Đây là mô hình tư duy hữu ích nhất trong cả PostgreSQL: một <code>UPDATE</code> thực chất là <em>một <code>INSERT</code> phiên bản mới CỘNG một con dấu "chết lúc" lên bản cũ</em>. Một <code>DELETE</code> chỉ là con dấu đó mà không có bản mới. Một khi bạn giữ được bức tranh ấy, index-only scan, bloat, <code>VACUUM</code>, độ trễ nhân bản và các vấn đề giao dịch dài đều thôi là những bí ẩn rời rạc.</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">INSERT</span><span class="lz-v">Một phiên bản dòng được ghi ra với <code>xmin</code> = giao dịch tạo ra nó và <code>xmax</code> = 0. Nhìn thấy được với mọi ảnh chụp bắt đầu sau khi giao dịch đó commit.</span></div>
<div class="lz-layer"><span class="lz-k">UPDATE</span><span class="lz-v">Một phiên bản <em>MỚI</em> được ghi ở một <code>ctid</code> mới, còn bản cũ bị đóng dấu <code>xmax</code> = giao dịch vừa cập nhật. CẢ HAI cùng tồn tại trên đĩa.</span></div>
<div class="lz-layer"><span class="lz-k">ảnh chụp cũ</span><span class="lz-v">Một giao dịch bắt đầu sớm hơn vẫn đọc bản cũ. Đó là lý do nó không bao giờ phải chờ — chẳng có gì bị ghi đè cả.</span></div>
<div class="lz-layer"><span class="lz-k">dead tuple</span><span class="lz-v">Khi không còn ảnh chụp nào có thể cần tới nó, bản cũ thành rác — nhưng nó VẪN nằm trên đĩa, chiếm chỗ, cho tới khi có thứ gì dọn đi.</span></div>
<div class="lz-layer"><span class="lz-k">VACUUM</span><span class="lz-v">Đánh dấu chỗ đó là dùng lại được bởi chính bảng này. File KHÔNG co lại (đo ở dưới); chỉ <code>VACUUM FULL</code> mới trả chỗ về cho hệ điều hành.</span></div>
</div>
<h3>Phần thưởng: một người ghi đang dở KHÔNG chặn người đọc</h3>
<p>Hai phiên psql thật, cạnh nhau. Phiên A mở một giao dịch và cập nhật một dòng mà chưa commit; phiên B đọc đúng dòng đó:</p>
<div class="out">A│ BEGIN;
A│ BEGIN
A│ UPDATE accounts SET balance = balance - 10 WHERE id = 'A';
A│ UPDATE 1
B│ SELECT id, balance FROM accounts WHERE id = 'A';
B│  id | balance
B│ ----+---------
B│  A  |   50.00
B│ (1 row)
A│ COMMIT;
A│ COMMIT
B│ SELECT id, balance FROM accounts WHERE id = 'A';
B│  id | balance
B│ ----+---------
B│  A  |   40.00
B│ (1 row)</div>
<p>Câu <code>SELECT</code> đầu của B trả về <strong>NGAY LẬP TỨC</strong> với giá trị cũ (50.00), trong lúc A đang cập nhật dở. Nó không chờ, và nó không thấy phần việc chưa commit của A. Sau khi A commit, câu <code>SELECT</code> tiếp theo của B thấy 40.00.</p>
<p>Ở một cơ sở dữ liệu khoá khi đọc, B đã phải treo cho tới khi A xong. Đó là khác biệt bạn CẢM THẤY trên một trang đang chạy: một truy vấn báo cáo chạy lâu không thể làm đơ trang thanh toán, và một lệnh ghi chậm không thể làm đơ bảng điều khiển.</p>
<div class="note-ct">Đây cũng là lý do <code>SELECT</code> trên feed của cuongthai.com vẫn mượt trong lúc có người đang đăng bài. Không người đọc nào trong app phải lấy khoá để đọc; cơ chế ảnh chụp làm hết việc đó.</div>

<h3>Cái giá: dead tuple và bloat</h3>
<p>Không có gì miễn phí. Mọi phiên bản dòng đã bị thay thế vẫn nằm trên đĩa cho tới khi có thứ gì đó dọn nó. Đo thật trên một bảng 100.000 dòng:</p>
<pre><code><span class="tok-keyword">CREATE TABLE</span> bloat_demo <span class="tok-keyword">AS</span> <span class="tok-keyword">SELECT</span> g <span class="tok-keyword">AS</span> id, <span class="tok-string">'row '</span>||g <span class="tok-keyword">AS</span> val <span class="tok-keyword">FROM</span> generate_series(1,100000) g;
<span class="tok-keyword">SELECT</span> pg_size_pretty(pg_relation_size(<span class="tok-string">'bloat_demo'</span>));
<span class="tok-keyword">UPDATE</span> bloat_demo <span class="tok-keyword">SET</span> val = val || <span class="tok-string">'!'</span>;    <span class="tok-comment">-- lượt 1</span>
<span class="tok-keyword">UPDATE</span> bloat_demo <span class="tok-keyword">SET</span> val = val || <span class="tok-string">'!'</span>;    <span class="tok-comment">-- lượt 2</span></code></pre>
<div class="out">-- ban đầu
 4608 kB
-- sau UPDATE lượt 1
 8928 kB
-- sau UPDATE lượt 2
 13 MB</div>
<p>Bảng vẫn chứa đúng 100.000 dòng sống, và nó đã <strong>gần GẤP BA</strong> trên đĩa. Hỏi Postgres xem trong đó có bao nhiêu xác:</p>
<pre><code><span class="tok-keyword">SELECT</span> n_live_tup, n_dead_tup <span class="tok-keyword">FROM</span> pg_stat_user_tables <span class="tok-keyword">WHERE</span> relname=<span class="tok-string">'bloat_demo'</span>;</code></pre>
<div class="out"> n_live_tup | n_dead_tup
------------+------------
     100000 |     199915
(1 row)</div>
<p>199.915 dead tuple — hai lượt cập nhật toàn bảng, trừ đi vài cái hệ thống đã kịp dọn. Đây chính là việc mà <code>VACUUM</code> sinh ra để làm:</p>
<pre><code><span class="tok-keyword">VACUUM</span> bloat_demo;
<span class="tok-keyword">SELECT</span> n_live_tup, n_dead_tup <span class="tok-keyword">FROM</span> pg_stat_user_tables <span class="tok-keyword">WHERE</span> relname=<span class="tok-string">'bloat_demo'</span>;
<span class="tok-keyword">SELECT</span> pg_size_pretty(pg_relation_size(<span class="tok-string">'bloat_demo'</span>));</code></pre>
<div class="out"> n_live_tup | n_dead_tup
------------+------------
     100000 |          0
(1 row)

 13 MB</div>
<p>Đọc kỹ kết quả đó, vì nó làm gần như ai cũng bất ngờ: dead tuple đã sạch, mà <strong>file vẫn 13 MB</strong>. <code>VACUUM</code> thường đánh dấu chỗ đó là dùng lại được <em>bởi chính bảng này</em>; nó KHÔNG trả lại cho hệ điều hành. Chỉ <code>VACUUM FULL</code> mới viết lại cả bảng để co nhỏ — và nó lấy khoá <code>ACCESS EXCLUSIVE</code>, chặn mọi thứ, nên đó không phải thao tác thường ngày. Chương 14 nói về autovacuum, khi nào bloat mới thật sự đáng lo, và làm gì với nó.</p>
<div class="pitfall"><p><strong>Bẫy — một giao dịch chạy dài âm thầm VÔ HIỆU HOÁ việc dọn dẹp ở KHẮP NƠI.</strong> <code>VACUUM</code> chỉ được phép gỡ một phiên bản dòng chết nếu không còn ảnh chụp nào có thể cần tới nó. Một giao dịch mở suốt hai tiếng ghim một ảnh chụp của hai tiếng trước, nên <em>MỌI</em> phiên bản dòng tạo ra từ lúc đó đều phải giữ lại — trên toàn bộ cơ sở dữ liệu, không chỉ những bảng mà giao dịch ấy chạm vào. Triệu chứng trông chẳng liên quan: một bảng nóng KHÔNG dính dáng gì phình lên và truy vấn của nó chậm đi, trong khi bản thân bảng đó không có gì đổi. Cái truy vấn báo cáo ai đó để quên trong một tab psql mới là nguyên nhân. Kiểm <code>SELECT pid, now()-xact_start AS age, state, query FROM pg_stat_activity WHERE xact_start IS NOT NULL ORDER BY age DESC;</code> trước khi đi tìm thứ gì cao siêu hơn.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: nhìn ctid dịch chuyển, rồi làm phình một bảng và vacuum nó</span><span class="lc-sub">Nhánh Code Lab tái hiện đúng phép đo 4.608 kB → 13 MB.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 11.3 ─────────────────────────── */
    {
      title: '11.3 — Isolation levels and the anomalies they stop|||11.3 — Các mức cô lập và những bất thường mỗi mức chặn được',
      slug: 'postgresql-11-3-muc-co-lap',
      type: 'LESSON',
      description: 'Read Committed (mặc định), Repeatable Read và Serializable — mỗi mức chặn đúng bất thường nào, chứng minh bằng hai phiên chạy thật, kể cả write skew mà chỉ Serializable bắt được, và vì sao dùng Serializable thì BẮT BUỘC phải có vòng thử lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3 · Phase 3 — Performance &amp; internals</span>
<h2>How much of the outside world may leak in?</h2>
<p class="lead">MVCC gives every transaction a snapshot. The <strong>isolation level</strong> decides <em>when</em> that snapshot is taken and how strictly Postgres polices the result. PostgreSQL offers three usable levels, and the difference between them is not academic — it is the difference between a booking system that double-books and one that does not.</p>

<h3>Read Committed — the default</h3>
<p>Each <em>statement</em> gets a fresh snapshot. You never see uncommitted data (no dirty reads), but two identical queries in one transaction can return different answers if someone commits in between:</p>
<div class="out">A│ BEGIN;
A│ BEGIN
A│ SELECT balance FROM accounts WHERE id = 'A';
A│  balance
A│ ---------
A│   100.00
A│ (1 row)
B│ UPDATE accounts SET balance = 999 WHERE id = 'A';
B│ UPDATE 1
A│ SELECT balance FROM accounts WHERE id = 'A';
A│  balance
A│ ---------
A│   999.00
A│ (1 row)
A│ COMMIT;</div>
<p>Same query, same transaction, two different answers. This is a <strong>non-repeatable read</strong>, and at Read Committed it is expected behaviour, not a bug. For most web requests — read a row, render it, respond — it is completely fine and it is the cheapest option, which is why it is the default.</p>

<h3>Repeatable Read — one snapshot for the whole transaction</h3>
<p>The snapshot is taken once, at the first statement, and never moves:</p>
<div class="out">A│ BEGIN ISOLATION LEVEL REPEATABLE READ;
A│ BEGIN
A│ SELECT balance FROM accounts WHERE id = 'A';
A│  balance
A│ ---------
A│   100.00
A│ (1 row)
B│ UPDATE accounts SET balance = 777 WHERE id = 'A';
B│ UPDATE 1
A│ SELECT balance FROM accounts WHERE id = 'A';
A│  balance
A│ ---------
A│   100.00
A│ (1 row)
A│ COMMIT;
A│ COMMIT
A│ SELECT balance FROM accounts WHERE id = 'A';
A│  balance
A│ ---------
A│   777.00
A│ (1 row)</div>
<p>A kept seeing 100.00 for its whole life, even though B had committed 777. Only after A's <code>COMMIT</code> — a new transaction, a new snapshot — did it see the new value. This is what you want for a multi-query report: every query in it describes the same instant in time, so the totals across sections actually agree with each other.</p>

<h3>Serializable — as if the transactions ran one at a time</h3>
<p>Repeatable Read is still not enough for every invariant, and the classic proof is <strong>write skew</strong>. Two engineers are on call. Each checks "is anyone else on call?", sees yes, and takes themselves off. Both checks were correct when they ran:</p>
<pre><code><span class="tok-keyword">CREATE TABLE</span> oncall (name text <span class="tok-keyword">PRIMARY KEY</span>, on_call boolean <span class="tok-keyword">NOT NULL</span>);
<span class="tok-keyword">INSERT INTO</span> oncall <span class="tok-keyword">VALUES</span> (<span class="tok-string">'Cuong'</span>, true), (<span class="tok-string">'Mai'</span>, true);</code></pre>
<div class="out">A│ BEGIN ISOLATION LEVEL REPEATABLE READ;
B│ BEGIN ISOLATION LEVEL REPEATABLE READ;
A│ SELECT count(*) FROM oncall WHERE on_call;   →  2
B│ SELECT count(*) FROM oncall WHERE on_call;   →  2
A│ UPDATE oncall SET on_call = false WHERE name = 'Cuong';
A│ UPDATE 1
B│ UPDATE oncall SET on_call = false WHERE name = 'Mai';
B│ UPDATE 1
A│ COMMIT;
A│ COMMIT
B│ COMMIT;
B│ COMMIT</div>
<p>Both committed. The result:</p>
<div class="out"> name  | on_call
-------+---------
 Cuong | f
 Mai   | f
(2 rows)</div>
<p>Nobody is on call. No constraint was violated, no row was overwritten, no lock was contended — and the invariant "at least one person is always on call" is broken. Neither transaction did anything wrong <em>individually</em>; the damage lives in the combination. That is write skew, and Repeatable Read cannot see it because the two transactions never touched the same row.</p>
<p>Run exactly the same script at <code>SERIALIZABLE</code>:</p>
<div class="out">A│ BEGIN ISOLATION LEVEL SERIALIZABLE;
B│ BEGIN ISOLATION LEVEL SERIALIZABLE;
A│ SELECT count(*) FROM oncall WHERE on_call;   →  2
B│ SELECT count(*) FROM oncall WHERE on_call;   →  2
A│ UPDATE oncall SET on_call = false WHERE name = 'Cuong';
A│ UPDATE 1
B│ UPDATE oncall SET on_call = false WHERE name = 'Mai';
B│ UPDATE 1
A│ COMMIT;
A│ COMMIT
B│ COMMIT;
B│ ERROR:  could not serialize access due to read/write dependencies among transactions
B│ DETAIL:  Reason code: Canceled on identification as a pivot, during commit attempt.
B│ HINT:  The transaction might succeed if retried.</div>
<div class="out"> name  | on_call
-------+---------
 Cuong | f
 Mai   | t
(2 rows)</div>
<p>A committed; B was refused. The invariant holds. PostgreSQL tracked that B had <em>read</em> data that A then <em>wrote</em>, decided no serial order of the two could produce this outcome, and cancelled one. It is genuine serializable isolation — not locking, but detection.</p>
<div class="callout warn">Read the <code>HINT</code>: <em>The transaction might succeed if retried.</em> That is not advice, it is a requirement. <code>SERIALIZABLE</code> works by <strong>aborting</strong> transactions, so any code path using it MUST catch SQLSTATE <code>40001</code> and retry the whole transaction from <code>BEGIN</code>. Without a retry loop you have not made the system correct — you have made it fail under load.</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Read Committed</span><span class="lz-lnote">Snapshot per <em>statement</em>. Stops dirty reads. Allows non-repeatable reads and phantoms. Cheapest, never aborts for isolation reasons. The right default for ordinary web requests.</span></div>
<div class="lz-layer"><span class="lz-lname">Repeatable Read</span><span class="lz-lnote">Snapshot per <em>transaction</em>. Also stops non-repeatable reads and phantoms. Can abort with <code>40001</code> when two transactions update the same row. Use it for multi-query reports and consistent exports.</span></div>
<div class="lz-layer"><span class="lz-lname">Serializable</span><span class="lz-lnote">Everything above, plus write skew. Postgres tracks read/write dependencies and cancels transactions that could not have happened in any serial order. <strong>Requires a retry loop.</strong> Use it for a small number of genuinely critical invariants — booking a seat, allocating stock, on-call rotas.</span></div>
<div class="lz-layer"><span class="lz-lname">Read Uncommitted</span><span class="lz-lnote">Accepted by the parser and silently treated as Read Committed. PostgreSQL never does dirty reads. If you see it in code copied from another database, it is doing nothing.</span></div>
</div>

<h3>Choosing, in practice</h3>
<p>Do not reach for <code>SERIALIZABLE</code> globally. Most application code is correct at Read Committed because it does the safe thing anyway — <code>UPDATE … SET balance = balance - 10</code> reads and writes in one statement, so there is nothing to skew. Raise the level for the specific transaction that guards an invariant spanning several rows, and leave the rest alone.</p>
<div class="pitfall"><p><strong>Trap — assuming a higher isolation level removes the need to think.</strong> Two failure modes follow. First, <code>SERIALIZABLE</code> without a retry loop converts a rare wrong answer into a frequent <code>40001</code> error under exactly the load you cared about. Second, and worse: isolation only governs what happens <em>inside</em> the database. If your application reads a row, thinks in Node.js for 50 ms, and writes back a value it computed from what it read, no isolation level saves you — the read and the write are two separate transactions with a gap. That is the lost update in lesson 11.4, and the fix there is a lock or a single atomic statement, not a level.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: break the on-call invariant, then watch SERIALIZABLE refuse it</span><span class="lc-sub">The Code Lab track runs both versions side by side in two sessions.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3 · Giai đoạn 3 — Hiệu năng &amp; bên trong</span>
<h2>Cho phép thế giới bên ngoài lọt vào bao nhiêu?</h2>
<p class="lead">MVCC cho mỗi giao dịch một ảnh chụp. <strong>Mức cô lập (isolation level)</strong> quyết định ảnh chụp đó được lấy <em>lúc nào</em> và Postgres soi kết quả chặt tới đâu. PostgreSQL có ba mức dùng được, và khác biệt giữa chúng không hề hàn lâm — nó là khác biệt giữa một hệ đặt chỗ bị đặt trùng và một hệ không.</p>

<h3>Read Committed — mặc định</h3>
<p>Mỗi <em>câu lệnh</em> lấy một ảnh chụp mới. Bạn không bao giờ thấy dữ liệu chưa commit (không có dirty read), nhưng hai truy vấn giống hệt nhau trong cùng một giao dịch có thể trả lời khác nhau nếu có ai đó commit ở giữa:</p>
<div class="out">A│ BEGIN;
A│ BEGIN
A│ SELECT balance FROM accounts WHERE id = 'A';
A│  balance
A│ ---------
A│   100.00
A│ (1 row)
B│ UPDATE accounts SET balance = 999 WHERE id = 'A';
B│ UPDATE 1
A│ SELECT balance FROM accounts WHERE id = 'A';
A│  balance
A│ ---------
A│   999.00
A│ (1 row)
A│ COMMIT;</div>
<p>Cùng một truy vấn, cùng một giao dịch, hai câu trả lời khác nhau. Đây là <strong>non-repeatable read</strong>, và ở Read Committed nó là hành vi ĐƯỢC MONG ĐỢI, không phải bug. Với đa số request web — đọc một dòng, dựng ra màn hình, trả lời — nó hoàn toàn ổn và là lựa chọn rẻ nhất, nên nó là mặc định.</p>

<h3>Repeatable Read — MỘT ảnh chụp cho cả giao dịch</h3>
<p>Ảnh chụp được lấy một lần, ở câu lệnh đầu tiên, và không bao giờ dịch chuyển:</p>
<div class="out">A│ BEGIN ISOLATION LEVEL REPEATABLE READ;
A│ BEGIN
A│ SELECT balance FROM accounts WHERE id = 'A';
A│  balance
A│ ---------
A│   100.00
A│ (1 row)
B│ UPDATE accounts SET balance = 777 WHERE id = 'A';
B│ UPDATE 1
A│ SELECT balance FROM accounts WHERE id = 'A';
A│  balance
A│ ---------
A│   100.00
A│ (1 row)
A│ COMMIT;
A│ COMMIT
A│ SELECT balance FROM accounts WHERE id = 'A';
A│  balance
A│ ---------
A│   777.00
A│ (1 row)</div>
<p>A vẫn thấy 100.00 suốt cả đời nó, dù B đã commit 777. Chỉ sau <code>COMMIT</code> của A — một giao dịch mới, một ảnh chụp mới — nó mới thấy giá trị mới. Đây là thứ bạn muốn cho một báo cáo nhiều truy vấn: mọi truy vấn trong đó mô tả CÙNG một khoảnh khắc, nên các con số tổng ở những mục khác nhau mới khớp được với nhau.</p>

<h3>Serializable — như thể các giao dịch chạy lần lượt từng cái</h3>
<p>Repeatable Read vẫn chưa đủ cho mọi bất biến, và bằng chứng kinh điển là <strong>write skew</strong>. Hai kỹ sư đang trực. Mỗi người kiểm "còn ai trực nữa không?", thấy còn, rồi tự cho mình nghỉ. Cả hai phép kiểm đều ĐÚNG vào lúc chúng chạy:</p>
<pre><code><span class="tok-keyword">CREATE TABLE</span> oncall (name text <span class="tok-keyword">PRIMARY KEY</span>, on_call boolean <span class="tok-keyword">NOT NULL</span>);
<span class="tok-keyword">INSERT INTO</span> oncall <span class="tok-keyword">VALUES</span> (<span class="tok-string">'Cuong'</span>, true), (<span class="tok-string">'Mai'</span>, true);</code></pre>
<div class="out">A│ BEGIN ISOLATION LEVEL REPEATABLE READ;
B│ BEGIN ISOLATION LEVEL REPEATABLE READ;
A│ SELECT count(*) FROM oncall WHERE on_call;   →  2
B│ SELECT count(*) FROM oncall WHERE on_call;   →  2
A│ UPDATE oncall SET on_call = false WHERE name = 'Cuong';
A│ UPDATE 1
B│ UPDATE oncall SET on_call = false WHERE name = 'Mai';
B│ UPDATE 1
A│ COMMIT;
A│ COMMIT
B│ COMMIT;
B│ COMMIT</div>
<p>Cả hai đều commit. Kết quả:</p>
<div class="out"> name  | on_call
-------+---------
 Cuong | f
 Mai   | f
(2 rows)</div>
<p>KHÔNG CÒN AI TRỰC. Không ràng buộc nào bị vi phạm, không dòng nào bị ghi đè, không khoá nào tranh chấp — và bất biến "luôn có ít nhất một người trực" đã vỡ. Không giao dịch nào làm sai điều gì khi xét <em>riêng lẻ</em>; thiệt hại nằm ở sự KẾT HỢP. Đó là write skew, và Repeatable Read không thấy được vì hai giao dịch chưa từng chạm vào cùng một dòng.</p>
<p>Chạy đúng kịch bản đó ở <code>SERIALIZABLE</code>:</p>
<div class="out">A│ BEGIN ISOLATION LEVEL SERIALIZABLE;
B│ BEGIN ISOLATION LEVEL SERIALIZABLE;
A│ SELECT count(*) FROM oncall WHERE on_call;   →  2
B│ SELECT count(*) FROM oncall WHERE on_call;   →  2
A│ UPDATE oncall SET on_call = false WHERE name = 'Cuong';
A│ UPDATE 1
B│ UPDATE oncall SET on_call = false WHERE name = 'Mai';
B│ UPDATE 1
A│ COMMIT;
A│ COMMIT
B│ COMMIT;
B│ ERROR:  could not serialize access due to read/write dependencies among transactions
B│ DETAIL:  Reason code: Canceled on identification as a pivot, during commit attempt.
B│ HINT:  The transaction might succeed if retried.</div>
<div class="out"> name  | on_call
-------+---------
 Cuong | f
 Mai   | t
(2 rows)</div>
<p>A commit được; B bị từ chối. Bất biến còn nguyên. PostgreSQL đã theo dõi rằng B <em>ĐỌC</em> dữ liệu mà A sau đó <em>GHI</em>, kết luận không thứ tự tuần tự nào của hai cái có thể sinh ra kết cục này, và huỷ một cái. Đó là cô lập tuần tự thật sự — không phải bằng khoá, mà bằng PHÁT HIỆN.</p>
<div class="callout warn">Đọc dòng <code>HINT</code>: <em>The transaction might succeed if retried.</em> Đó không phải lời khuyên, đó là YÊU CẦU. <code>SERIALIZABLE</code> làm việc bằng cách <strong>HUỶ</strong> giao dịch, nên mọi nhánh mã dùng nó BẮT BUỘC phải bắt SQLSTATE <code>40001</code> và thử lại CẢ giao dịch từ <code>BEGIN</code>. Không có vòng thử lại thì bạn chưa làm hệ thống đúng — bạn đã làm nó HỎNG khi tải cao.</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Read Committed</span><span class="lz-lnote">Ảnh chụp theo từng <em>câu lệnh</em>. Chặn dirty read. Cho phép non-repeatable read và phantom. Rẻ nhất, không bao giờ huỷ vì lý do cô lập. Mặc định đúng cho request web thông thường.</span></div>
<div class="lz-layer"><span class="lz-lname">Repeatable Read</span><span class="lz-lnote">Ảnh chụp theo từng <em>giao dịch</em>. Chặn thêm non-repeatable read và phantom. Có thể huỷ với <code>40001</code> khi hai giao dịch cùng cập nhật một dòng. Dùng cho báo cáo nhiều truy vấn và xuất dữ liệu nhất quán.</span></div>
<div class="lz-layer"><span class="lz-lname">Serializable</span><span class="lz-lnote">Mọi thứ ở trên, CỘNG write skew. Postgres theo dõi phụ thuộc đọc/ghi và huỷ những giao dịch không thể xảy ra ở bất kỳ thứ tự tuần tự nào. <strong>BẮT BUỘC có vòng thử lại.</strong> Dùng cho một số ít bất biến thật sự sống còn — đặt ghế, trừ tồn kho, lịch trực.</span></div>
<div class="lz-layer"><span class="lz-lname">Read Uncommitted</span><span class="lz-lnote">Bộ phân tích cú pháp nhận, rồi âm thầm coi như Read Committed. PostgreSQL không bao giờ dirty read. Thấy nó trong mã chép từ cơ sở dữ liệu khác thì nó đang không làm gì cả.</span></div>
</div>

<h3>Chọn thế nào trong thực tế</h3>
<p>Đừng vơ <code>SERIALIZABLE</code> cho toàn hệ thống. Phần lớn mã ứng dụng đã đúng ở Read Committed vì dù sao nó cũng làm điều an toàn — <code>UPDATE … SET balance = balance - 10</code> đọc và ghi trong MỘT câu lệnh, nên chẳng có gì để mà skew. Hãy nâng mức cho ĐÚNG cái giao dịch canh một bất biến trải trên nhiều dòng, còn lại để yên.</p>
<div class="pitfall"><p><strong>Bẫy — tưởng nâng mức cô lập là hết phải suy nghĩ.</strong> Có hai kiểu hỏng theo sau. Thứ nhất, <code>SERIALIZABLE</code> mà không có vòng thử lại sẽ biến một câu trả lời sai hiếm gặp thành một lỗi <code>40001</code> THƯỜNG XUYÊN, đúng vào lúc tải cao mà bạn quan tâm. Thứ hai, và tệ hơn: cô lập chỉ chi phối những gì xảy ra BÊN TRONG cơ sở dữ liệu. Nếu ứng dụng của bạn đọc một dòng, nghĩ trong Node.js 50 ms, rồi ghi ngược lại một giá trị nó TỰ TÍNH từ cái đã đọc, thì không mức cô lập nào cứu được — lần đọc và lần ghi là hai giao dịch riêng biệt có khoảng trống ở giữa. Đó chính là lost update ở bài 11.4, và cách sửa ở đó là một cái khoá hoặc một câu lệnh nguyên tử duy nhất, chứ không phải một cái mức.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: phá bất biến lịch trực, rồi xem SERIALIZABLE từ chối nó</span><span class="lc-sub">Nhánh Code Lab chạy cả hai phiên bản cạnh nhau trên hai phiên.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 11.4 ─────────────────────────── */
    {
      title: '11.4 — Row locks, lost updates and deadlocks|||11.4 — Khoá dòng, lost update và deadlock',
      slug: 'postgresql-11-4-khoa-deadlock',
      type: 'LESSON',
      description: 'Người ghi CHẶN người ghi. Lost update đo thật: trừ 10 rồi trừ 20 từ 100 mà còn 80. Hai cách sửa, FOR UPDATE / NOWAIT / lock_timeout, hàng đợi việc bằng SKIP LOCKED, và một deadlock thật do Postgres tự phát hiện.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4 · Phase 3 — Performance &amp; internals</span>
<h2>Where concurrency actually bites</h2>
<p class="lead">Lesson 11.2 promised that readers never block writers. The other half of the sentence is the one that costs money: <strong>writers do block writers.</strong> Two transactions updating the same row must take turns, and everything in this lesson follows from that.</p>

<h3>Watch one writer wait for another</h3>
<div class="out">A│ BEGIN;
A│ UPDATE accounts SET balance = balance - 10 WHERE id = 'A';
A│ UPDATE 1
B│ BEGIN;
B│ UPDATE accounts SET balance = balance - 20 WHERE id = 'A';
      ← B hangs here. No output. It is waiting for A's row lock.
A│ COMMIT;
A│ COMMIT
B│ UPDATE 1        ← only now does B proceed
B│ COMMIT;</div>
<p>B's <code>UPDATE 1</code> appears only <em>after</em> A commits. An <code>UPDATE</code> takes an exclusive lock on each row it touches and holds it until the transaction ends — not until the statement ends. This is why a transaction that updates a hot row and then does something slow is such a good way to stall an application.</p>

<h3>The lost update — the bug that steals money</h3>
<p>Now the dangerous pattern. The application reads a balance, computes the new value in its own code, and writes it back. Both sessions start from 100.00; one subtracts 10, the other subtracts 20:</p>
<div class="out">A│ SELECT balance FROM accounts WHERE id='A';   →  100.00
B│ SELECT balance FROM accounts WHERE id='A';   →  100.00
A│ UPDATE accounts SET balance = 100 - 10 WHERE id='A';
A│ UPDATE 1
B│ UPDATE accounts SET balance = 100 - 20 WHERE id='A';
A│ COMMIT;
B│ UPDATE 1
B│ COMMIT;</div>
<p>100 − 10 − 20 should leave 70.00. The actual final balance:</p>
<div class="out"> balance
---------
   80.00
(1 row)</div>
<p><strong>A's withdrawal of 10 vanished.</strong> No error, no warning, no deadlock, no constraint violation — both transactions reported success. B read 100 before A wrote, and then overwrote A's result with a number computed from stale data. This is a <strong>lost update</strong>, and it is the single most common serious concurrency bug in application code, because everything about it looks fine in testing with one user.</p>
<div class="callout warn">Nothing about the default isolation level is at fault here, and raising it to Repeatable Read only converts the silent loss into a <code>40001</code> error you must then handle. The real problem is that the read and the write are separated by a round trip through your application.</div>

<h3>Fix 1 — never read a value just to write it back</h3>
<p>Let the database do the arithmetic in one statement. <code>balance = balance - 10</code> reads and writes atomically, under the row lock:</p>
<div class="out">A│ UPDATE accounts SET balance = balance - 10 WHERE id='A';
A│ UPDATE 1
B│ UPDATE accounts SET balance = balance - 20 WHERE id='A';
A│ COMMIT;
B│ UPDATE 1
B│ COMMIT;</div>
<div class="out"> balance
---------
   70.00
(1 row)</div>
<p>70.00 — correct, with no locking code, no retry loop and no isolation change. <strong>This is the fix to reach for first,</strong> and it covers the majority of real cases: counters, balances, stock levels, view counts.</p>

<h3>Fix 2 — SELECT … FOR UPDATE when you genuinely must read first</h3>
<p>Sometimes the new value cannot be expressed as arithmetic on the old one — you need to read, apply business rules, then write. <code>FOR UPDATE</code> locks the rows you selected, so the second reader waits:</p>
<div class="out">A│ BEGIN;
B│ BEGIN;
A│ SELECT balance FROM accounts WHERE id='A' FOR UPDATE;
A│  balance
A│ ---------
A│   100.00
B│ SELECT balance FROM accounts WHERE id='A' FOR UPDATE;
      ← B blocks
A│ UPDATE accounts SET balance = 100 - 10 WHERE id='A';
A│ COMMIT;
B│  balance
B│ ---------
B│    90.00        ← B re-reads and sees A's committed value</div>
<p>The detail that makes this work: when B's lock is finally granted at Read Committed, it does <strong>not</strong> return the 100.00 it would have seen at statement start — it re-reads the row and returns 90.00. B now computes from current data, so its write is correct.</p>

<h3>Not waiting: NOWAIT and lock_timeout</h3>
<p>Waiting forever is rarely what a web request should do. Two ways to bound it:</p>
<div class="out">B│ SELECT balance FROM accounts WHERE id='A' FOR UPDATE NOWAIT;
B│ ERROR:  could not obtain lock on row in relation "accounts"

B│ SET lock_timeout = '250ms';
B│ SELECT balance FROM accounts WHERE id='A' FOR UPDATE;
B│ ERROR:  canceling statement due to lock timeout
B│ CONTEXT:  while locking tuple (0,24) in relation "accounts"</div>
<p><code>NOWAIT</code> fails instantly; <code>lock_timeout</code> gives it a bounded chance first. Setting a modest <code>lock_timeout</code> on user-facing transactions turns "the site is hanging" into a fast, catchable error you can retry or report.</p>

<h3>SKIP LOCKED — a job queue in one query</h3>
<p><code>FOR UPDATE SKIP LOCKED</code> takes what it can and steps over locked rows instead of waiting. That single clause is a correct multi-worker queue:</p>
<pre><code><span class="tok-keyword">SELECT</span> id, payload <span class="tok-keyword">FROM</span> job
 <span class="tok-keyword">WHERE</span> state=<span class="tok-string">'queued'</span>
 <span class="tok-keyword">ORDER BY</span> id
 <span class="tok-keyword">FOR UPDATE SKIP LOCKED</span> <span class="tok-keyword">LIMIT</span> 2;</code></pre>
<div class="out">A│ BEGIN;
A│ SELECT … FOR UPDATE SKIP LOCKED LIMIT 2;
A│  id | payload
A│ ----+---------
A│   1 | job-1
A│   2 | job-2
B│ BEGIN;
B│ SELECT … FOR UPDATE SKIP LOCKED LIMIT 2;
B│  id | payload
B│ ----+---------
B│   3 | job-3
B│   4 | job-4</div>
<p>Two workers, zero coordination, zero waiting, and no job handed out twice. Before reaching for a dedicated queue service, check whether this one clause is enough — for a great many applications it is.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">A locks row A</span><span class="lz-d">Granted immediately. A holds it until its transaction ends — not until the statement ends.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">B locks row B</span><span class="lz-d">Also granted. Nothing is wrong yet, and nothing in either session looks unusual.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">A asks for row B · B asks for row A</span><span class="lz-d">Each waits for a lock the other holds. The cycle is now closed and neither can ever proceed.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">PostgreSQL breaks it</span><span class="lz-d">After <code>deadlock_timeout</code> (1 s) it detects the cycle, aborts one transaction, and lets the other finish. The victim gets <code>deadlock detected</code>.</span></div>
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">The fix is ordering</span><span class="lz-d">If both had locked A before B — say, always ascending by primary key — step 3 could not have formed a cycle. <code>ORDER BY id</code> in the <code>SELECT … FOR UPDATE</code> is often the whole fix.</span></div>
</div>
<h3>Deadlock: two transactions each holding what the other wants</h3>
<p>A locks row A then wants row B; B locks row B then wants row A. Neither can move:</p>
<div class="out">A│ UPDATE accounts SET balance = balance - 1 WHERE id = 'A';
A│ UPDATE 1
B│ UPDATE accounts SET balance = balance - 1 WHERE id = 'B';
B│ UPDATE 1
A│ UPDATE accounts SET balance = balance - 1 WHERE id = 'B';   ← A waits for B
B│ UPDATE accounts SET balance = balance - 1 WHERE id = 'A';   ← B waits for A
A│ ERROR:  deadlock detected
A│ DETAIL:  Process 4328 waits for ShareLock on transaction 773; blocked by process 4329.
A│ Process 4329 waits for ShareLock on transaction 772; blocked by process 4328.
A│ HINT:  See server log for query details.
A│ CONTEXT:  while updating tuple (0,18) in relation "accounts"
B│ UPDATE 1
A│ COMMIT;
A│ ROLLBACK          ← A was already aborted
B│ COMMIT;
B│ COMMIT</div>
<p>PostgreSQL detected the cycle after <code>deadlock_timeout</code> (1 s by default), killed one transaction, and let the other finish. Note the last detail again: A's <code>COMMIT</code> returned <code>ROLLBACK</code>, exactly as in lesson 11.1 — the victim's transaction was already dead.</p>
<div class="callout ok"><strong>The fix for deadlocks is ordering.</strong> If every transaction locks rows in the same order — say, always ascending by primary key — a cycle cannot form. When you must update several rows, sort the IDs first. <code>ORDER BY id</code> in the <code>SELECT … FOR UPDATE</code> that precedes the writes is often the entire fix.</div>
<div class="pitfall"><p><strong>Trap — treating a deadlock as a database fault.</strong> A deadlock is not corruption and not a Postgres bug; it is the server correctly refusing to hang forever, and it is telling you two code paths acquire the same locks in opposite orders. The message names both processes and the exact tuple, which is enough to find them. Two responses are wrong: retrying blindly without fixing the order (the deadlock returns under load, just less predictably), and raising <code>deadlock_timeout</code> to "reduce" them — that only makes the server wait longer before noticing, so both transactions stall for longer first. Fix the order; keep a retry as a safety net, not as the plan.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: reproduce the lost update, fix it twice, then cause a deadlock on purpose</span><span class="lc-sub">The Code Lab track walks both sessions through every transcript above.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4 · Giai đoạn 3 — Hiệu năng &amp; bên trong</span>
<h2>Chỗ mà tính đồng thời thật sự cắn</h2>
<p class="lead">Bài 11.2 hứa rằng người đọc không bao giờ chặn người ghi. Nửa còn lại của câu đó mới là nửa tốn tiền: <strong>người ghi CÓ chặn người ghi.</strong> Hai giao dịch cùng cập nhật một dòng thì phải thay phiên nhau, và mọi thứ trong bài này đều bắt nguồn từ đó.</p>

<h3>Nhìn một người ghi chờ một người ghi khác</h3>
<div class="out">A│ BEGIN;
A│ UPDATE accounts SET balance = balance - 10 WHERE id = 'A';
A│ UPDATE 1
B│ BEGIN;
B│ UPDATE accounts SET balance = balance - 20 WHERE id = 'A';
      ← B TREO ở đây. Không có output. Nó đang chờ khoá dòng của A.
A│ COMMIT;
A│ COMMIT
B│ UPDATE 1        ← tới lúc này B mới đi tiếp
B│ COMMIT;</div>
<p>Dòng <code>UPDATE 1</code> của B chỉ hiện ra <em>SAU KHI</em> A commit. Một <code>UPDATE</code> lấy khoá độc quyền trên từng dòng nó chạm và GIỮ tới khi giao dịch kết thúc — chứ không phải tới khi câu lệnh kết thúc. Đó là lý do một giao dịch cập nhật một dòng nóng rồi làm tiếp việc gì đó chậm lại là cách rất hiệu quả để làm nghẽn cả ứng dụng.</p>

<h3>Lost update — con bug ăn cắp tiền</h3>
<p>Giờ tới cái mẫu nguy hiểm. Ứng dụng đọc số dư, tính giá trị mới trong mã của chính nó, rồi ghi ngược lại. Cả hai phiên đều bắt đầu từ 100.00; một bên trừ 10, bên kia trừ 20:</p>
<div class="out">A│ SELECT balance FROM accounts WHERE id='A';   →  100.00
B│ SELECT balance FROM accounts WHERE id='A';   →  100.00
A│ UPDATE accounts SET balance = 100 - 10 WHERE id='A';
A│ UPDATE 1
B│ UPDATE accounts SET balance = 100 - 20 WHERE id='A';
A│ COMMIT;
B│ UPDATE 1
B│ COMMIT;</div>
<p>100 − 10 − 20 thì phải còn 70.00. Số dư cuối cùng THẬT SỰ:</p>
<div class="out"> balance
---------
   80.00
(1 row)</div>
<p><strong>Lệnh rút 10 của A đã BỐC HƠI.</strong> Không lỗi, không cảnh báo, không deadlock, không vi phạm ràng buộc — cả hai giao dịch đều báo thành công. B đọc 100 trước khi A ghi, rồi ghi đè kết quả của A bằng một con số tính từ dữ liệu đã cũ. Đây là <strong>lost update</strong>, và nó là con bug đồng thời nghiêm trọng PHỔ BIẾN NHẤT trong mã ứng dụng, bởi vì khi test với một người dùng thì mọi thứ trông hoàn toàn ổn.</p>
<div class="callout warn">Mức cô lập mặc định không có lỗi gì ở đây, và nâng lên Repeatable Read chỉ biến việc mất mát âm thầm thành một lỗi <code>40001</code> mà bạn vẫn phải xử lý. Vấn đề thật sự là lần ĐỌC và lần GHI bị ngăn cách bởi một vòng đi-về qua ứng dụng của bạn.</div>

<h3>Cách sửa 1 — đừng bao giờ đọc một giá trị chỉ để ghi nó ngược lại</h3>
<p>Hãy để cơ sở dữ liệu làm phép tính trong MỘT câu lệnh. <code>balance = balance - 10</code> đọc và ghi một cách nguyên tử, dưới khoá dòng:</p>
<div class="out">A│ UPDATE accounts SET balance = balance - 10 WHERE id='A';
A│ UPDATE 1
B│ UPDATE accounts SET balance = balance - 20 WHERE id='A';
A│ COMMIT;
B│ UPDATE 1
B│ COMMIT;</div>
<div class="out"> balance
---------
   70.00
(1 row)</div>
<p>70.00 — đúng, mà không cần dòng mã khoá nào, không vòng thử lại, không đổi mức cô lập. <strong>Đây là cách sửa cần nghĩ tới ĐẦU TIÊN,</strong> và nó bao phủ phần lớn tình huống thật: bộ đếm, số dư, tồn kho, lượt xem.</p>

<h3>Cách sửa 2 — SELECT … FOR UPDATE khi bạn THẬT SỰ phải đọc trước</h3>
<p>Đôi khi giá trị mới không diễn đạt được bằng phép tính trên giá trị cũ — bạn cần đọc, áp quy tắc nghiệp vụ, rồi mới ghi. <code>FOR UPDATE</code> khoá những dòng bạn vừa chọn, nên người đọc thứ hai phải chờ:</p>
<div class="out">A│ BEGIN;
B│ BEGIN;
A│ SELECT balance FROM accounts WHERE id='A' FOR UPDATE;
A│  balance
A│ ---------
A│   100.00
B│ SELECT balance FROM accounts WHERE id='A' FOR UPDATE;
      ← B bị chặn
A│ UPDATE accounts SET balance = 100 - 10 WHERE id='A';
A│ COMMIT;
B│  balance
B│ ---------
B│    90.00        ← B đọc LẠI và thấy giá trị A đã commit</div>
<p>Chi tiết làm cho cách này chạy được: khi khoá của B cuối cùng được cấp ở Read Committed, nó <strong>KHÔNG</strong> trả về 100.00 như nó sẽ thấy lúc câu lệnh bắt đầu — nó ĐỌC LẠI dòng và trả về 90.00. Giờ B tính trên dữ liệu hiện hành, nên lệnh ghi của nó đúng.</p>

<h3>Không chờ: NOWAIT và lock_timeout</h3>
<p>Chờ vô hạn hiếm khi là điều một request web nên làm. Hai cách giới hạn nó:</p>
<div class="out">B│ SELECT balance FROM accounts WHERE id='A' FOR UPDATE NOWAIT;
B│ ERROR:  could not obtain lock on row in relation "accounts"

B│ SET lock_timeout = '250ms';
B│ SELECT balance FROM accounts WHERE id='A' FOR UPDATE;
B│ ERROR:  canceling statement due to lock timeout
B│ CONTEXT:  while locking tuple (0,24) in relation "accounts"</div>
<p><code>NOWAIT</code> hỏng ngay lập tức; <code>lock_timeout</code> cho nó một cơ hội có giới hạn trước. Đặt một <code>lock_timeout</code> vừa phải cho các giao dịch phục vụ người dùng sẽ biến "trang web bị treo" thành một lỗi nhanh, bắt được, để bạn thử lại hoặc báo cáo.</p>

<h3>SKIP LOCKED — một hàng đợi việc gói trong một truy vấn</h3>
<p><code>FOR UPDATE SKIP LOCKED</code> lấy cái nào lấy được và BƯỚC QUA những dòng đang bị khoá thay vì chờ. Đúng một mệnh đề đó là một hàng đợi nhiều worker chạy đúng:</p>
<pre><code><span class="tok-keyword">SELECT</span> id, payload <span class="tok-keyword">FROM</span> job
 <span class="tok-keyword">WHERE</span> state=<span class="tok-string">'queued'</span>
 <span class="tok-keyword">ORDER BY</span> id
 <span class="tok-keyword">FOR UPDATE SKIP LOCKED</span> <span class="tok-keyword">LIMIT</span> 2;</code></pre>
<div class="out">A│ BEGIN;
A│ SELECT … FOR UPDATE SKIP LOCKED LIMIT 2;
A│  id | payload
A│ ----+---------
A│   1 | job-1
A│   2 | job-2
B│ BEGIN;
B│ SELECT … FOR UPDATE SKIP LOCKED LIMIT 2;
B│  id | payload
B│ ----+---------
B│   3 | job-3
B│   4 | job-4</div>
<p>Hai worker, không phối hợp gì, không chờ nhau, và không việc nào bị giao hai lần. Trước khi với tay sang một dịch vụ hàng đợi riêng, hãy thử xem một mệnh đề này đã đủ chưa — với rất nhiều ứng dụng thì nó đủ.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">A khoá dòng A</span><span class="lz-d">Được cấp ngay. A giữ nó tới khi giao dịch kết thúc — chứ không phải tới khi câu lệnh kết thúc.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">B khoá dòng B</span><span class="lz-d">Cũng được cấp. Chưa có gì sai cả, và không phiên nào trông có gì bất thường.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">A đòi dòng B · B đòi dòng A</span><span class="lz-d">Mỗi bên chờ một cái khoá mà bên kia đang giữ. Vòng lặp giờ đã KHÉP KÍN và không bên nào đi tiếp được nữa.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">PostgreSQL phá vòng</span><span class="lz-d">Sau <code>deadlock_timeout</code> (1 giây) nó phát hiện vòng lặp, huỷ MỘT giao dịch, và để cái kia chạy xong. Nạn nhân nhận <code>deadlock detected</code>.</span></div>
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">Cách sửa là THỨ TỰ</span><span class="lz-d">Nếu cả hai đều khoá A trước rồi mới tới B — ví dụ luôn tăng dần theo khoá chính — thì bước 3 đã không thể tạo thành vòng. Một chữ <code>ORDER BY id</code> trong <code>SELECT … FOR UPDATE</code> thường là TOÀN BỘ cách sửa.</span></div>
</div>
<h3>Deadlock: hai giao dịch mỗi bên đang giữ đúng thứ bên kia cần</h3>
<p>A khoá dòng A rồi muốn dòng B; B khoá dòng B rồi muốn dòng A. Không bên nào nhúc nhích được:</p>
<div class="out">A│ UPDATE accounts SET balance = balance - 1 WHERE id = 'A';
A│ UPDATE 1
B│ UPDATE accounts SET balance = balance - 1 WHERE id = 'B';
B│ UPDATE 1
A│ UPDATE accounts SET balance = balance - 1 WHERE id = 'B';   ← A chờ B
B│ UPDATE accounts SET balance = balance - 1 WHERE id = 'A';   ← B chờ A
A│ ERROR:  deadlock detected
A│ DETAIL:  Process 4328 waits for ShareLock on transaction 773; blocked by process 4329.
A│ Process 4329 waits for ShareLock on transaction 772; blocked by process 4328.
A│ HINT:  See server log for query details.
A│ CONTEXT:  while updating tuple (0,18) in relation "accounts"
B│ UPDATE 1
A│ COMMIT;
A│ ROLLBACK          ← A vốn đã bị huỷ từ trước
B│ COMMIT;
B│ COMMIT</div>
<p>PostgreSQL phát hiện vòng lặp sau <code>deadlock_timeout</code> (mặc định 1 giây), giết một giao dịch, và để cái kia chạy xong. Để ý lại chi tiết cuối: <code>COMMIT</code> của A trả về <code>ROLLBACK</code>, y hệt bài 11.1 — giao dịch nạn nhân vốn đã chết rồi.</p>
<div class="callout ok"><strong>Cách sửa deadlock là THỨ TỰ.</strong> Nếu mọi giao dịch đều khoá các dòng theo cùng một thứ tự — ví dụ luôn tăng dần theo khoá chính — thì không thể hình thành vòng lặp. Khi phải cập nhật nhiều dòng, hãy sắp các ID trước. Một chữ <code>ORDER BY id</code> trong câu <code>SELECT … FOR UPDATE</code> đứng trước các lệnh ghi thường là TOÀN BỘ cách sửa.</div>
<div class="pitfall"><p><strong>Bẫy — coi deadlock là lỗi của cơ sở dữ liệu.</strong> Deadlock không phải hỏng dữ liệu và không phải bug của Postgres; nó là máy chủ ĐANG LÀM ĐÚNG khi từ chối treo vĩnh viễn, và nó đang nói cho bạn biết có hai nhánh mã lấy cùng bộ khoá theo thứ tự NGƯỢC nhau. Thông báo nêu đích danh cả hai tiến trình và đúng cái tuple, đủ để đi tìm chúng. Hai phản ứng SAI: thử lại mù mà không sửa thứ tự (deadlock sẽ quay lại khi tải cao, chỉ là khó đoán hơn), và tăng <code>deadlock_timeout</code> để "giảm" chúng — cái đó chỉ làm máy chủ chờ LÂU HƠN mới nhận ra, nên cả hai giao dịch nghẽn lâu hơn trước đã. Hãy sửa thứ tự; giữ vòng thử lại như một lưới an toàn, chứ không phải như kế hoạch chính.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tái hiện lost update, sửa nó hai kiểu, rồi cố tình gây một deadlock</span><span class="lc-sub">Nhánh Code Lab dẫn cả hai phiên đi qua từng bản ghi ở trên.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 11.5 ─────────────────────────── */
    {
      title: '11.5 — Chapter 11 quiz|||11.5 — Kiểm tra Chương 11',
      slug: 'postgresql-11-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về giao dịch và trạng thái aborted, MVCC và dead tuple, ba mức cô lập, lost update, SKIP LOCKED và deadlock.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on transactions and concurrency. Answer from memory; the questions follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: recognising the lost update (11.4) — because it is silent and costs data — and knowing that <code>SERIALIZABLE</code> obliges you to write a retry loop (11.3).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về giao dịch và tính đồng thời. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: nhận ra lost update (11.4) — vì nó ÂM THẦM và làm mất dữ liệu — và biết rằng <code>SERIALIZABLE</code> BẮT BUỘC bạn phải viết vòng thử lại (11.3).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'After a statement inside a transaction raises an error, what happens to the following statements?|||Sau khi một câu lệnh trong giao dịch ném lỗi, chuyện gì xảy ra với các câu lệnh tiếp theo?',
            options: [
              'They run normally|||Chúng chạy bình thường',
              'They are all refused with "current transaction is aborted" until the transaction ends; even COMMIT becomes a ROLLBACK|||Chúng đều bị từ chối với "current transaction is aborted" cho tới khi giao dịch kết thúc; ngay cả COMMIT cũng thành ROLLBACK',
              'Only writes are refused, reads still work|||Chỉ lệnh ghi bị từ chối, lệnh đọc vẫn chạy',
              'PostgreSQL reconnects the session automatically|||PostgreSQL tự kết nối lại phiên',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In PostgreSQL, what does an UPDATE physically do to a row?|||Ở PostgreSQL, một lệnh UPDATE THẬT SỰ làm gì với một dòng về mặt vật lý?',
            options: [
              'Overwrites the existing row in place|||Ghi đè tại chỗ lên dòng đang có',
              'Writes a NEW row version and stamps the old one as expired (xmax); the old version stays until VACUUM|||Ghi một phiên bản dòng MỚI và đóng dấu hết hạn (xmax) lên bản cũ; bản cũ nằm đó tới khi VACUUM dọn',
              'Deletes the row and asks the client to re-insert it|||Xoá dòng rồi yêu cầu client chèn lại',
              'Locks the whole table while it rewrites the row|||Khoá cả bảng trong lúc viết lại dòng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Session A is mid-UPDATE on a row and has not committed. Session B runs SELECT on that same row. What happens?|||Phiên A đang UPDATE dở một dòng và chưa commit. Phiên B chạy SELECT trên đúng dòng đó. Chuyện gì xảy ra?',
            options: [
              'B waits until A commits|||B chờ tới khi A commit',
              'B returns immediately with the old committed value — readers never block writers|||B trả về NGAY với giá trị cũ đã commit — người đọc không bao giờ bị người ghi chặn',
              'B sees A uncommitted new value|||B thấy giá trị mới chưa commit của A',
              'B raises a deadlock error|||B ném lỗi deadlock',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Plain VACUUM on a bloated table removes the dead tuples. What does it NOT do?|||VACUUM thường trên một bảng đã phình sẽ gỡ các dead tuple. Nó KHÔNG làm gì?',
            options: [
              'It does not update statistics|||Nó không cập nhật thống kê',
              'It does not shrink the file on disk — the space is marked reusable by that table, but not returned to the OS (only VACUUM FULL does that)|||Nó KHÔNG co nhỏ file trên đĩa — chỗ đó được đánh dấu dùng lại được bởi chính bảng, chứ không trả về cho hệ điều hành (chỉ VACUUM FULL mới làm)',
              'It does not remove dead rows from indexes|||Nó không gỡ dòng chết khỏi chỉ mục',
              'It does not work on tables with primary keys|||Nó không chạy được trên bảng có khoá chính',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the difference between Read Committed and Repeatable Read?|||Khác biệt giữa Read Committed và Repeatable Read là gì?',
            options: [
              'Read Committed allows dirty reads|||Read Committed cho phép dirty read',
              'Read Committed takes a new snapshot per STATEMENT, Repeatable Read takes one snapshot for the whole TRANSACTION|||Read Committed lấy ảnh chụp mới cho mỗi CÂU LỆNH, Repeatable Read lấy MỘT ảnh chụp cho cả GIAO DỊCH',
              'Repeatable Read is faster|||Repeatable Read nhanh hơn',
              'They are identical in PostgreSQL|||Chúng giống hệt nhau ở PostgreSQL',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Two transactions each read "at least one person is on call", then each takes a DIFFERENT person off call. Both commit. Which isolation level prevents this, and what must the application add?|||Hai giao dịch cùng đọc "còn ít nhất một người trực", rồi mỗi cái cho một người KHÁC NHAU nghỉ. Cả hai commit. Mức cô lập nào ngăn được, và ứng dụng phải thêm gì?',
            options: [
              'Read Committed; nothing extra|||Read Committed; không cần thêm gì',
              'SERIALIZABLE; and the application MUST catch SQLSTATE 40001 and retry the whole transaction|||SERIALIZABLE; và ứng dụng BẮT BUỘC phải bắt SQLSTATE 40001 rồi thử lại CẢ giao dịch',
              'Repeatable Read; nothing extra|||Repeatable Read; không cần thêm gì',
              'No level prevents it; only a table lock does|||Không mức nào ngăn được; chỉ khoá cả bảng mới được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An app reads balance=100, computes 100-10 in Node.js, writes 90. Concurrently another does 100-20 and writes 80. Final balance is 80 instead of 70. What is this, and what is the FIRST fix to reach for?|||Một app đọc balance=100, tính 100-10 trong Node.js, ghi 90. Song song, cái khác tính 100-20 và ghi 80. Số dư cuối là 80 thay vì 70. Đây là gì, và cách sửa cần nghĩ tới ĐẦU TIÊN là gì?',
            options: [
              'A deadlock; increase deadlock_timeout|||Một deadlock; tăng deadlock_timeout',
              'A lost update; do the arithmetic in ONE atomic statement — UPDATE … SET balance = balance - 10|||Một lost update; làm phép tính trong MỘT câu lệnh nguyên tử — UPDATE … SET balance = balance - 10',
              'A dirty read; switch to SERIALIZABLE|||Một dirty read; đổi sang SERIALIZABLE',
              'Normal behaviour; nothing to fix|||Hành vi bình thường; không có gì phải sửa',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does FOR UPDATE SKIP LOCKED give you, and what is the correct fix for a recurring deadlock?|||FOR UPDATE SKIP LOCKED cho bạn cái gì, và cách sửa ĐÚNG cho một deadlock lặp lại là gì?',
            options: [
              'It disables locking; and the deadlock fix is to raise deadlock_timeout|||Nó tắt khoá; và cách sửa deadlock là tăng deadlock_timeout',
              'It skips over rows locked by others instead of waiting — a correct multi-worker job queue; and the deadlock fix is to make every transaction lock rows in the SAME order|||Nó BƯỚC QUA những dòng người khác đang khoá thay vì chờ — một hàng đợi việc nhiều worker chạy đúng; và cách sửa deadlock là bắt mọi giao dịch khoá các dòng theo CÙNG một thứ tự',
              'It locks the whole table; and the deadlock fix is to retry blindly|||Nó khoá cả bảng; và cách sửa deadlock là thử lại mù',
              'It commits early; and deadlocks cannot be fixed|||Nó commit sớm; và deadlock thì không sửa được',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
