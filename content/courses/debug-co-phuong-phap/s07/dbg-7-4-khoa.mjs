/**
 * 7.4 — Khoá và deadlock: pg_locks, pg_stat_activity, "idle in transaction" (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: PostgreSQL 16.16 (dbg-pg, log_lock_waits=on, deadlock_timeout=1s), nhiều phiên psql song song lái qua FIFO
 * (tools/phien.sh), API Express 5 + Prisma 6.19.3 — scratchpad/dbg/lab/ch7 (tools/c74-treo.sh, c74-chan.sh, c74-deadlock.sh, c74-sua.sh; o-74-*.txt).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { PHIEN } from './_ma-7.mjs';
import { TREO, TREO_GO, CHAN_1, CHAN_2, HANG_DOI, MIGRATE, APPNAME, DEADLOCK_PSQL, DEADLOCK_API, DEADLOCK_SUA } from './_ra-7.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const MA_AI_CHAN = ma(`-- "Ai đang chặn ai?" — giữ sẵn câu này trong snippet của DBeaver/psql
SELECT pid, application_name, state, wait_event_type, wait_event,
       pg_blocking_pids(pid) AS bi_chan_boi,
       now() - xact_start  AS tx_da_mo,
       now() - state_change AS o_trang_thai_nay,
       left(query, 80)      AS cau_cuoi
FROM pg_stat_activity
WHERE backend_type = 'client backend' AND pid &lt;&gt; pg_backend_pid()
ORDER BY xact_start NULLS LAST;

-- Gỡ: hỏi chủ phiên trước. pg_cancel_backend(pid) huỷ CÂU đang chạy; pg_terminate_backend(pid) đóng cả PHIÊN (rollback).`, 'sql');

const MA_DEADLOCK = ma(`// LỖI: hai request khoá hai dòng theo thứ tự ngược nhau
await prisma.$transaction(async (tx) =&gt; {
  await tx.datLich.update({ where: { id: a }, data: { batDau: db.batDau } });   // khoá a
  await goiDichVuKhac();                                                       // … thời gian trôi
  await tx.datLich.update({ where: { id: b }, data: { batDau: da.batDau } });   // chờ b — người kia đang giữ b và chờ a
});

// SỬA: khoá TẤT CẢ dòng cần dùng ngay đầu transaction, LUÔN theo cùng một thứ tự (id tăng dần)
await prisma.$transaction(async (tx) =&gt; {
  await tx.$queryRaw\`SELECT id FROM "DatLich" WHERE id IN (\${a}, \${b}) ORDER BY id FOR UPDATE\`;
  // … rồi mới đọc/ghi
});`);

const MA_JAVA_KHOA = ma(`// Spring Data JPA: cùng ý tưởng — khoá theo thứ tự cố định, và đặt thời hạn chờ khoá
@Lock(LockModeType.PESSIMISTIC_WRITE)
@QueryHints(@QueryHint(name = "jakarta.persistence.lock.timeout", value = "2000"))   // ms
@Query("select d from DatCho d where d.id in :ids order by d.id")
List&lt;DatCho&gt; khoaTheoThuTu(Collection&lt;Long&gt; ids);`, 'java');

const BANG_KHOA_EN = `<table>
<thead><tr><th>Mode (pg_locks.mode)</th><th>Taken by</th><th>Conflicts with</th></tr></thead>
<tbody>
<tr><td><code>AccessShareLock</code> (table)</td><td><code>SELECT</code></td><td>only <code>AccessExclusiveLock</code></td></tr>
<tr><td><code>RowExclusiveLock</code> (table)</td><td><code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code></td><td><code>SHARE</code> and stronger (e.g. <code>CREATE INDEX</code> without CONCURRENTLY)</td></tr>
<tr><td><code>AccessExclusiveLock</code> (table)</td><td><code>ALTER TABLE</code>, <code>DROP</code>, <code>TRUNCATE</code>, <code>VACUUM FULL</code></td><td>everything, even <code>SELECT</code></td></tr>
<tr><td>row lock (shown as <code>transactionid</code> / <code>tuple</code> waits)</td><td><code>UPDATE</code>, <code>DELETE</code>, <code>SELECT … FOR UPDATE</code></td><td>another writer or <code>FOR UPDATE</code> of the same row — never a plain <code>SELECT</code></td></tr>
</tbody></table>`;

const BANG_KHOA_VI = `<table>
<thead><tr><th>Kiểu khoá (pg_locks.mode)</th><th>Ai lấy</th><th>Xung đột với</th></tr></thead>
<tbody>
<tr><td><code>AccessShareLock</code> (bảng)</td><td><code>SELECT</code></td><td>chỉ <code>AccessExclusiveLock</code></td></tr>
<tr><td><code>RowExclusiveLock</code> (bảng)</td><td><code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code></td><td><code>SHARE</code> trở lên (vd. <code>CREATE INDEX</code> không CONCURRENTLY)</td></tr>
<tr><td><code>AccessExclusiveLock</code> (bảng)</td><td><code>ALTER TABLE</code>, <code>DROP</code>, <code>TRUNCATE</code>, <code>VACUUM FULL</code></td><td>tất cả, kể cả <code>SELECT</code></td></tr>
<tr><td>khoá dòng (hiện thành chờ <code>transactionid</code> / <code>tuple</code>)</td><td><code>UPDATE</code>, <code>DELETE</code>, <code>SELECT … FOR UPDATE</code></td><td>một người ghi khác hoặc <code>FOR UPDATE</code> trên cùng dòng — không bao giờ chặn <code>SELECT</code> thường</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🐘', 'PostgreSQL 16 — Explicit Locking', 'Bảng xung đột giữa các kiểu khoá bảng, khoá dòng, deadlock, advisory lock.', 'https://www.postgresql.org/docs/16/explicit-locking.html'),
  nguon('🐘', 'PostgreSQL 16 — Client Connection Defaults', 'lock_timeout, statement_timeout, idle_in_transaction_session_timeout.', 'https://www.postgresql.org/docs/16/runtime-config-client.html'),
  nguon('🐘', 'PostgreSQL 16 — pg_stat_activity, pg_locks', 'Các cột state, wait_event, xact_start; hàm pg_blocking_pids().', 'https://www.postgresql.org/docs/16/monitoring-stats.html'),
  nguon('📘', 'Prisma ORM — Transactions', 'Interactive transaction: timeout (mặc định 5000 ms), maxWait (2000 ms), isolationLevel.', 'https://www.prisma.io/docs/orm/prisma-client/queries/transactions'),
  nguon('🧯', 'Sentry — Transaction ID Wraparound in Postgres (2015)', 'Sự cố thật: vacuum không theo kịp, Postgres dừng nhận ghi để tự bảo vệ — nhiều giờ gián đoạn.', 'https://blog.sentry.io/transaction-id-wraparound-in-postgres/'),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-11-4-khoa-deadlock', title: 'PostgreSQL 11.4 — Khoá dòng, lost update và deadlock', sub: 'Lý thuyết khoá và mức cô lập đầy đủ — bài này chỉ dạy cách tìm và gỡ.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-7-3-khoa', title: 'Prisma ORM 7.3 — Khoá: bi quan, lạc quan, advisory', sub: 'FOR UPDATE qua $queryRaw, cột version, advisory lock trong Prisma.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'spring-boot', bai: 'sb-7-5-khoa-lac-quan', title: 'Spring Boot 7.5 — Khoá lạc quan và bi quan', sub: '@Version, @Lock(PESSIMISTIC_WRITE) và cách xử lý khi xung đột.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-8-1-race', title: 'Bài 8.1 — Race condition: đặt trùng, mất cập nhật', sub: 'Khi KHÔNG khoá: hai người cùng đặt một phòng.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '7.4 — Locks and deadlocks: pg_locks, pg_stat_activity, "idle in transaction"|||7.4 — Khoá và deadlock: pg_locks, pg_stat_activity, "idle in transaction"',
  slug: 'dbg-7-4-khoa',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tái hiện thật "API treo vì ai đó mở transaction trong DBeaver quên commit": curl hết giờ sau 5 s, pg_stat_activity + pg_blocking_pids chỉ ra phiên idle in transaction, log_lock_waits ghi "still waiting for ShareLock", pg_terminate_backend gỡ — và câu UPDATE của API vẫn chạy xong sau 5,1 s dù client đã bỏ đi. Chặn tái phát: lock_timeout 2 s (Prisma báo lỗi 55P03 không kèm mã P), idle_in_transaction_session_timeout, application_name. Hàng đợi khoá: một ALTER TABLE chờ sau phiên quên commit làm mọi SELECT treo theo. Deadlock bằng hai cửa sổ psql và bằng hai request Prisma đổi lịch ngược chiều (20/20 vòng có một lượt 500); khoá theo thứ tự id ⇒ 0 deadlock.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>"It just hangs": somebody is holding a lock</h2>
<p class="lead">A request that hangs with 0% CPU, no error and no log line is very often waiting for a lock in the database. The database knows exactly who is waiting for whom — you only need to ask it. This lesson reproduces the most common OJT incident (a forgotten transaction in DBeaver), finds the culprit with two views, removes it, and then makes it impossible to repeat. Then it does the same for deadlocks, both in psql and in Prisma code. Several psql sessions run in parallel, driven through FIFOs so every output is a real, repeatable run.</p>

<h3>An everyday picture: the shared bathroom key</h3>
<p>Your boarding house has one bathroom key on a hook. Someone takes it, goes out for lunch and forgets to put it back. Everyone else queues at the door — nobody is "doing" anything, they are all waiting. A deadlock is two people each holding one of two keys the other needs: they would wait forever, so the landlord (PostgreSQL) steps in and sends one of them away.</p>
<details><summary>tools/phien.sh — drive long-lived psql sessions from a script</summary>${ma(PHIEN, 'bash')}</details>

<h3>1. Reproduce: the forgotten transaction</h3>
${ra(TREO)}
<p>Read the first table row by row. Session <code>dbeaver</code> is <code>idle in transaction</code> — it ran an <code>UPDATE</code> 6 seconds ago and has done nothing since, but its transaction is open, so the row lock is still held. The API's session is <code>active</code>, waiting (<code>wait_event_type = Lock</code>, <code>transactionid</code>), and <code>pg_blocking_pids</code> names the blocker directly. In <code>pg_locks</code> the only line with <code>granted = f</code> is the API waiting for a <code>ShareLock</code> on the dbeaver transaction's id — that is how a row lock wait looks. Because the container runs with <code>log_lock_waits = on</code>, the server log already contained the answer after 1 second.</p>
${MA_AI_CHAN}
${BANG_KHOA_EN}

<h3>2. Remove the blocker — and what that costs</h3>
${ra(TREO_GO)}
<p>Three facts to remember. (1) <code>pg_terminate_backend</code> rolls back the whole transaction: the colleague's change (<code>soGio = 3</code>) is gone — the row shows <code>soGio = 1</code>. Ask first. (2) Their client only notices on the next command: <code>FATAL: terminating connection due to administrator command</code>. (3) The API's <code>UPDATE</code> finished 5.1 s after it started, <em>after</em> curl had given up at 5 s: a client timeout does not cancel the query on the server. Users who retried meanwhile produced duplicate work.</p>

<h3>3. Make it impossible to repeat</h3>
${ra(CHAN_1)}
<p>With <code>lock_timeout = 2s</code> the API fails fast with a clear reason instead of hanging until the load balancer gives up. Note what Prisma 6.19 gave us: <code>e.code</code> is <strong>undefined</strong> — the PostgreSQL code <code>55P03</code> is only inside the message text. Map it yourself (retry or 409/503 with a clear message).</p>
${ra(CHAN_2)}
<p><code>idle_in_transaction_session_timeout</code> closes sessions that keep a transaction open without doing anything. Set it for human roles and tools (DBeaver, psql) at minutes, and for the application at a few seconds. Also give every connection a name, so the first view shows <em>who</em> it is:</p>
${ra(APPNAME)}

<h3>4. The lock queue: one ALTER TABLE freezes everyone</h3>
${ra(HANG_DOI)}
<p>This one surprises even experienced developers. The forgotten transaction only <em>read</em> the table (an <code>AccessShareLock</code>, harmless on its own). A deploy then runs a migration, <code>ALTER TABLE … ADD COLUMN</code>, which needs <code>AccessExclusiveLock</code> and waits. Every new query — even a plain <code>SELECT count(*)</code> — queues <em>behind the migration</em>: <code>pg_blocking_pids</code> of the api session is the migration, not the original transaction. The site is down although nothing is "doing" anything. The fix for migrations:</p>
${ra(MIGRATE)}
<p>Run schema changes with a short <code>lock_timeout</code> and retry, so the migration gives up instead of becoming a wall. Tools such as Flyway and Prisma Migrate let you put <code>SET lock_timeout</code> at the top of the migration file.</p>

<h3>5. Deadlock: two psql windows</h3>
${ra(DEADLOCK_PSQL)}
<p>A locks room 1, B locks room 2, then each asks for the other's row. After <code>deadlock_timeout</code> (1 s here) PostgreSQL detects the cycle and kills one transaction: window A gets <code>ERROR: deadlock detected</code> and its <code>COMMIT</code> becomes <code>ROLLBACK</code>; window B continues. The client sees only the two process ids; the <em>server log</em> contains both statements — always read the log.</p>

<h3>6. The same deadlock in application code</h3>
${MA_DEADLOCK}
${ra(DEADLOCK_API)}
${ra(DEADLOCK_SUA)}
<p>Two people swap bookings 7↔8 and 8↔7 at the same moment. In 20 rounds, every round produced exactly one HTTP 500 with <code>40P01 deadlock detected</code> — and again Prisma gave no <code>e.code</code>. Locking both rows at the start of the transaction, always in ascending id order, makes a cycle impossible: 40 out of 40 succeed. (Retrying a transaction that failed with <code>40P01</code> is also correct, but ordering removes the cause.) The JPA version:</p>
${MA_JAVA_KHOA}

<h3>Incident: the transaction that never ends</h3>
<p>Long-open transactions do more than block writers. They also stop VACUUM from removing old row versions, so tables bloat and, in the extreme, PostgreSQL approaches transaction ID wraparound. Sentry wrote up such an outage in 2015: vacuum could not keep up, the database stopped accepting writes to protect itself, and the service was degraded for hours ("Transaction ID Wraparound in Postgres"). <code>idle in transaction</code> sessions that live for hours are the everyday version of that risk — check <code>now() - xact_start</code> in your monitoring.</p>

<h3>On the job</h3>
<p>The scenario of this lesson is real and common in the first weeks of OJT: a developer opens DBeaver in manual-commit mode on the shared dev or UAT database, edits a row to "test something", and goes to a meeting; the whole team's API stops. Etiquette: use auto-commit in GUI tools unless you need a transaction, give your tool connection a name (DBeaver: <em>Connection settings → Initialization → Application name</em>), and when you are the one who finds the blocker, message its owner before terminating. In the incident note write the blocker's pid, application name, transaction age and the statement — the four columns of the first query above.</p>

<h3>🧪 Practice (45 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>tools/c74-treo.sh</code>. Before the script terminates the blocker, write down which column told you who it was.</li>
<li>Repeat with two psql windows by hand. Use <code>pg_cancel_backend</code> first: what changes compared to <code>pg_terminate_backend</code>?</li>
<li>Set <code>lock_timeout</code> on the database and handle the error in the API: return 503 with a short message and log the <code>55P03</code> code.</li>
<li>Reproduce the lock queue with an <code>ALTER TABLE</code>; then make the migration safe with <code>SET lock_timeout</code>.</li>
<li>Run <code>tools/c74-sua.sh</code> before and after the ordered <code>FOR UPDATE</code>; explain in two sentences why ordering removes the deadlock.</li>
</ol>
<p><strong>Done when:</strong> for each hang you can name the blocking pid, its application, how long its transaction has been open, and the statement — and you have one setting that prevents it.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">idle in transaction</span><span class="v">A session with an open transaction that is not running anything.</span></div>
  <div class="kv"><span class="k">pg_blocking_pids(pid)</span><span class="v">The pids that the given session is waiting for.</span></div>
  <div class="kv"><span class="k">Lock queue</span><span class="v">Requests wait in order; one strong waiter blocks all later weaker ones.</span></div>
  <div class="kv"><span class="k">Deadlock</span><span class="v">A cycle of waits; PostgreSQL aborts one transaction (SQLSTATE 40P01).</span></div>
  <div class="kv"><span class="k">lock_timeout</span><span class="v">Maximum time a statement waits for a lock (SQLSTATE 55P03).</span></div>
  <div class="kv"><span class="k">application_name</span><span class="v">Connection label shown in <code>pg_stat_activity</code> and logs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A hang with no CPU is usually a lock wait; <code>pg_stat_activity</code> + <code>pg_blocking_pids</code> name the blocker.</li>
<li>Terminating a session rolls back its work — ask its owner first.</li>
<li>Client timeouts do not cancel server work; set <code>lock_timeout</code> and <code>statement_timeout</code>.</li>
<li><code>idle_in_transaction_session_timeout</code> and <code>application_name</code> make forgotten sessions short-lived and visible.</li>
<li>DDL waits create a queue that blocks reads; run migrations with a short <code>lock_timeout</code>.</li>
<li>Deadlocks: read the server log; lock rows in one fixed order.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>"Nó cứ treo thế thôi": ai đó đang giữ khoá</h2>
<p class="lead">Một request treo với CPU 0%, không lỗi, không dòng log nào, rất thường là đang chờ một khoá trong cơ sở dữ liệu. Cơ sở dữ liệu biết chính xác ai đang chờ ai — bạn chỉ cần hỏi nó. Bài này tái hiện sự cố OJT phổ biến nhất (một transaction bị bỏ quên trong DBeaver), tìm thủ phạm bằng hai view, gỡ nó ra, rồi làm cho nó không thể lặp lại. Sau đó làm y như vậy với deadlock, cả trong psql lẫn trong mã Prisma. Nhiều phiên psql chạy song song, lái qua FIFO nên mọi output là lần chạy thật, lặp lại được.</p>

<h3>Liên tưởng đời thường: chìa khoá nhà tắm chung</h3>
<p>Nhà trọ của bạn có một chìa khoá nhà tắm treo trên móc. Có người cầm đi, ra ngoài ăn trưa và quên trả. Mọi người khác xếp hàng trước cửa — chẳng ai "làm" gì cả, tất cả đều đang chờ. Deadlock là hai người, mỗi người giữ một trong hai chiếc chìa mà người kia cần: họ sẽ chờ nhau mãi mãi, nên chủ nhà (PostgreSQL) phải ra tay và mời một người đi.</p>
<details><summary>tools/phien.sh — lái các phiên psql sống lâu từ một script</summary>${ma(PHIEN, 'bash')}</details>

<h3>1. Tái hiện: transaction bị bỏ quên</h3>
${ra(TREO)}
<p>Đọc bảng đầu tiên từng dòng một. Phiên <code>dbeaver</code> đang <code>idle in transaction</code> — nó chạy một câu <code>UPDATE</code> 6 giây trước và từ đó không làm gì, nhưng transaction vẫn mở nên khoá dòng vẫn bị giữ. Phiên của API đang <code>active</code>, đang chờ (<code>wait_event_type = Lock</code>, <code>transactionid</code>), và <code>pg_blocking_pids</code> gọi thẳng tên kẻ chặn. Trong <code>pg_locks</code>, dòng duy nhất có <code>granted = f</code> là API đang chờ <code>ShareLock</code> trên mã transaction của dbeaver — chờ khoá dòng trông như thế. Vì container chạy với <code>log_lock_waits = on</code>, log của server đã có sẵn câu trả lời sau 1 giây.</p>
${MA_AI_CHAN}
${BANG_KHOA_VI}

<h3>2. Gỡ kẻ chặn — và cái giá phải trả</h3>
${ra(TREO_GO)}
<p>Ba điều cần nhớ. (1) <code>pg_terminate_backend</code> rollback cả transaction: thay đổi của đồng nghiệp (<code>soGio = 3</code>) mất — dòng vẫn là <code>soGio = 1</code>. Hãy hỏi trước. (2) Client của họ chỉ biết khi gõ lệnh tiếp theo: <code>FATAL: terminating connection due to administrator command</code>. (3) Câu <code>UPDATE</code> của API xong sau 5,1 s kể từ lúc bắt đầu, <em>sau</em> khi curl đã bỏ cuộc ở giây thứ 5: client hết giờ không huỷ được truy vấn trên server. Người dùng bấm thử lại trong lúc đó tạo ra việc trùng.</p>

<h3>3. Làm cho nó không thể lặp lại</h3>
${ra(CHAN_1)}
<p>Với <code>lock_timeout = 2s</code>, API thất bại nhanh với lý do rõ ràng thay vì treo cho tới khi load balancer bỏ cuộc. Để ý điều Prisma 6.19 trả về: <code>e.code</code> là <strong>undefined</strong> — mã PostgreSQL <code>55P03</code> chỉ nằm trong chữ của thông báo. Hãy tự ánh xạ nó (thử lại, hoặc 409/503 kèm thông báo rõ).</p>
${ra(CHAN_2)}
<p><code>idle_in_transaction_session_timeout</code> đóng các phiên giữ transaction mở mà không làm gì. Đặt vài phút cho role của người và công cụ (DBeaver, psql), vài giây cho ứng dụng. Ngoài ra hãy đặt tên cho mọi kết nối, để view đầu tiên cho thấy <em>ai</em> đang ở đó:</p>
${ra(APPNAME)}

<h3>4. Hàng đợi khoá: một ALTER TABLE làm mọi người đứng hình</h3>
${ra(HANG_DOI)}
<p>Cái này làm cả dev lâu năm bất ngờ. Transaction bị bỏ quên chỉ <em>đọc</em> bảng (một <code>AccessShareLock</code>, tự nó vô hại). Rồi một lần deploy chạy migration <code>ALTER TABLE … ADD COLUMN</code>, cần <code>AccessExclusiveLock</code>, và phải chờ. Mọi truy vấn mới — kể cả một câu <code>SELECT count(*)</code> trơn — xếp hàng <em>sau migration</em>: <code>pg_blocking_pids</code> của phiên api là migration, không phải transaction ban đầu. Trang web chết dù chẳng có gì đang "làm" cả. Cách sửa cho migration:</p>
${ra(MIGRATE)}
<p>Chạy thay đổi lược đồ với <code>lock_timeout</code> ngắn và thử lại, để migration bỏ cuộc thay vì trở thành một bức tường. Flyway và Prisma Migrate đều cho đặt <code>SET lock_timeout</code> ở đầu tệp migration.</p>

<h3>5. Deadlock: hai cửa sổ psql</h3>
${ra(DEADLOCK_PSQL)}
<p>A khoá phòng 1, B khoá phòng 2, rồi mỗi bên xin dòng của bên kia. Sau <code>deadlock_timeout</code> (ở đây 1 s), PostgreSQL phát hiện vòng chờ và giết một transaction: cửa sổ A nhận <code>ERROR: deadlock detected</code> và <code>COMMIT</code> của nó thành <code>ROLLBACK</code>; cửa sổ B chạy tiếp. Client chỉ thấy hai mã tiến trình; <em>log của server</em> mới có cả hai câu lệnh — luôn đọc log.</p>

<h3>6. Cùng deadlock đó trong mã ứng dụng</h3>
${MA_DEADLOCK}
${ra(DEADLOCK_API)}
${ra(DEADLOCK_SUA)}
<p>Hai người đổi lịch 7↔8 và 8↔7 cùng một lúc. Trong 20 vòng, vòng nào cũng có đúng một HTTP 500 với <code>40P01 deadlock detected</code> — và một lần nữa Prisma không cho <code>e.code</code>. Khoá cả hai dòng ngay đầu transaction, luôn theo id tăng dần, khiến vòng chờ không thể xảy ra: 40 trên 40 thành công. (Thử lại transaction thất bại vì <code>40P01</code> cũng đúng, nhưng sắp thứ tự mới gỡ bỏ nguyên nhân.) Bản JPA:</p>
${MA_JAVA_KHOA}

<h3>Sự cố thật: transaction không bao giờ kết thúc</h3>
<p>Transaction mở lâu không chỉ chặn người ghi. Nó còn ngăn VACUUM dọn các phiên bản dòng cũ, nên bảng phình ra và, ở mức cực đoan, PostgreSQL tiến gần tới tràn vòng mã transaction (wraparound). Sentry đã viết lại một sự cố như vậy năm 2015: vacuum không theo kịp, cơ sở dữ liệu ngừng nhận ghi để tự bảo vệ, và dịch vụ chập chờn nhiều giờ ("Transaction ID Wraparound in Postgres"). Các phiên <code>idle in transaction</code> sống hàng giờ là phiên bản đời thường của rủi ro đó — hãy theo dõi <code>now() - xact_start</code> trong hệ thống giám sát.</p>

<h3>Tình huống đi làm</h3>
<p>Kịch bản của bài này có thật và hay gặp trong những tuần đầu OJT: một bạn dev mở DBeaver ở chế độ commit thủ công trên DB dev hoặc UAT dùng chung, sửa một dòng để "thử cái này", rồi đi họp; API của cả nhóm đứng im. Phép lịch sự: để auto-commit trong công cụ GUI trừ khi bạn cần transaction, đặt tên cho kết nối của công cụ (DBeaver: <em>Connection settings → Initialization → Application name</em>), và khi bạn là người tìm ra kẻ chặn, nhắn chủ của nó trước khi kết thúc phiên. Trong ghi chú sự cố, ghi pid của kẻ chặn, tên ứng dụng, tuổi transaction và câu lệnh — bốn cột của truy vấn đầu tiên ở trên.</p>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>tools/c74-treo.sh</code>. Trước khi script kết thúc kẻ chặn, ghi lại cột nào cho bạn biết đó là ai.</li>
<li>Làm lại bằng hai cửa sổ psql gõ tay. Dùng <code>pg_cancel_backend</code> trước: khác gì so với <code>pg_terminate_backend</code>?</li>
<li>Đặt <code>lock_timeout</code> cho database và xử lý lỗi trong API: trả 503 kèm thông báo ngắn và ghi log mã <code>55P03</code>.</li>
<li>Tái hiện hàng đợi khoá bằng một <code>ALTER TABLE</code>; rồi làm migration an toàn bằng <code>SET lock_timeout</code>.</li>
<li>Chạy <code>tools/c74-sua.sh</code> trước và sau khi có <code>FOR UPDATE</code> theo thứ tự; giải thích trong hai câu vì sao sắp thứ tự gỡ được deadlock.</li>
</ol>
<p><strong>Đạt khi:</strong> với mỗi lần treo, bạn gọi tên được pid đang chặn, ứng dụng của nó, transaction đã mở bao lâu, và câu lệnh — và có một thiết lập ngăn nó tái diễn.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">idle in transaction</span><span class="v">Phiên có transaction đang mở nhưng không chạy gì.</span></div>
  <div class="kv"><span class="k">pg_blocking_pids(pid)</span><span class="v">Các pid mà phiên đó đang phải chờ.</span></div>
  <div class="kv"><span class="k">Hàng đợi khoá</span><span class="v">Các yêu cầu chờ theo thứ tự; một người chờ khoá mạnh chặn mọi người tới sau.</span></div>
  <div class="kv"><span class="k">Deadlock</span><span class="v">Vòng chờ khép kín; PostgreSQL huỷ một transaction (SQLSTATE 40P01).</span></div>
  <div class="kv"><span class="k">lock_timeout</span><span class="v">Thời gian tối đa một câu lệnh được chờ khoá (SQLSTATE 55P03).</span></div>
  <div class="kv"><span class="k">application_name</span><span class="v">Nhãn của kết nối, hiện trong <code>pg_stat_activity</code> và log.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Treo mà không tốn CPU thường là chờ khoá; <code>pg_stat_activity</code> + <code>pg_blocking_pids</code> gọi tên kẻ chặn.</li>
<li>Kết thúc một phiên là rollback việc của nó — hỏi chủ phiên trước.</li>
<li>Client hết giờ không huỷ việc trên server; đặt <code>lock_timeout</code> và <code>statement_timeout</code>.</li>
<li><code>idle_in_transaction_session_timeout</code> và <code>application_name</code> làm phiên bị quên vừa ngắn ngủi vừa dễ thấy.</li>
<li>DDL phải chờ sẽ tạo hàng đợi chặn cả lệnh đọc; chạy migration với <code>lock_timeout</code> ngắn.</li>
<li>Deadlock: đọc log server; khoá các dòng theo một thứ tự cố định.</li>
</ul>
${NGUON}
</div>
`,
};
