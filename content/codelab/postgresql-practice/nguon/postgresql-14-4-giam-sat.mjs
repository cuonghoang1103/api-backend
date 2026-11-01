/**
 * PostgreSQL · 14.4 — Giám sát. pg_stat_activity/pg_stat_statements/pg_stat_user_indexes của PGlite trống (một phiên, không
 * extension, bộ đếm 0) ⇒ ba truy vấn của bài chạy trên ẢNH CHỤP từ máy chủ thật (nói rõ trong đề, tên cột giữ nguyên);
 * dựng pg_stat_statements + tải hỗn hợp là bài tay.
 */
import { mod, pg, cs, q, qn, tay, kq, kqAn, ma, pre, tn } from './_chung.mjs';

const T = { thuTu: true };

const PHIEN = `SET TimeZone = 'Asia/Ho_Chi_Minh';
CREATE TABLE snap (taken_at timestamptz NOT NULL);           -- the moment the snapshot was taken (= now())
INSERT INTO snap VALUES ('2026-10-26 10:00:00+07');
CREATE TABLE activity (                                      -- columns of pg_stat_activity
  pid int PRIMARY KEY, backend_type text NOT NULL, application_name text NOT NULL, state text,
  wait_event_type text, wait_event text, xact_start timestamptz, query_start timestamptz, query text);
INSERT INTO activity VALUES
  (232, 'client backend', 'bao-cao',  'active',                        'Timeout', 'PgSleep',       '2026-10-26 09:58:30+07', '2026-10-26 09:58:30+07', 'SELECT pg_sleep(90) AS bao_cao'),
  (240, 'client backend', 'web-quen', 'idle in transaction',           'Client',  'ClientRead',    '2026-10-26 09:41:12+07', '2026-10-26 09:41:13+07', 'UPDATE hang SET n = n + 1 WHERE id = 1'),
  (250, 'client backend', 'loi',      'idle in transaction (aborted)', 'Client',  'ClientRead',    '2026-10-26 09:55:00+07', '2026-10-26 09:55:02+07', 'SELECT 1/0;'),
  (255, 'client backend', 'web-3',    'idle in transaction',           'Client',  'ClientRead',    '2026-10-26 09:59:58+07', '2026-10-26 09:59:58+07', 'SELECT * FROM hang WHERE id = 7'),
  (260, 'client backend', 'pool',     'idle',                          'Client',  'ClientRead',    NULL,                     '2026-10-26 09:12:00+07', 'SELECT 1;'),
  (270, 'client backend', 'web-2',    'active',                        'Lock',    'transactionid', '2026-10-26 09:59:20+07', '2026-10-26 09:59:20+07', 'UPDATE hang SET n = n + 1 WHERE id = 1'),
  (11,  'autovacuum launcher', '',    NULL, 'Activity', 'AutovacuumMain', NULL, NULL, '');`;
const LD_PHIEN = { en: `<h4>Tables (snapshot of a real server at 10:00:00)</h4>${pre(`snap (taken_at)                    -- use it instead of now()
activity (pid, backend_type, application_name, state, wait_event_type, wait_event, xact_start, query_start, query)
-- the five sessions of lesson 14.4 + one young transaction + a helper process`)}`, vi: `<h4>Bảng (ảnh chụp một máy chủ thật lúc 10:00:00)</h4>${pre(`snap (taken_at)                    -- dùng nó thay cho now()
activity (pid, backend_type, application_name, state, wait_event_type, wait_event, xact_start, query_start, query)
-- năm phiên của bài 14.4 + một giao dịch còn non + một tiến trình phụ`)}` };

const CAU_LENH = `CREATE TABLE statements (                    -- columns of pg_stat_statements (literals already replaced by $1)
  queryid bigint PRIMARY KEY, calls bigint NOT NULL, total_exec_time double precision NOT NULL,
  mean_exec_time double precision NOT NULL, rows bigint NOT NULL, query text NOT NULL);
INSERT INTO statements VALUES
  (1, 20005, 1048.52, 0.0524, 20005, 'SELECT count(*) FROM big WHERE bucket = $1'),
  (2,     2,  103.31, 51.655,     2, 'SELECT count(*) FROM big WHERE val LIKE $1'),
  (3,     1,   34.48, 34.48,      1, 'SELECT sum(id) FROM big'),
  (4,   310,   12.40, 0.04,     310, 'SELECT id, name FROM product WHERE sku = $1'),
  (5,     1, 3012.70, 3012.70,  365, 'SELECT day, sum(total) FROM nightly_report GROUP BY day'),
  (6,  1200,  640.05, 0.5334,  1200, 'UPDATE cart SET qty = qty + $1 WHERE id = $2');`;
const LD_CAU_LENH = { en: `<h4>Table (snapshot)</h4>${pre(`statements (queryid, calls, total_exec_time ms, mean_exec_time ms, rows, query)   -- 6 normalized queries`)}`, vi: `<h4>Bảng (ảnh chụp)</h4>${pre(`statements (queryid, calls, total_exec_time ms, mean_exec_time ms, rows, query)   -- 6 truy vấn đã chuẩn hoá`)}` };

const CHI_MUC = `CREATE TABLE index_usage (                   -- pg_stat_user_indexes + pg_index + pg_relation_size(indexrelid)
  relname text NOT NULL, indexrelname text PRIMARY KEY, idx_scan bigint NOT NULL,
  size_bytes bigint NOT NULL, is_unique boolean NOT NULL, is_primary boolean NOT NULL);
INSERT INTO index_usage VALUES
  ('orders',     'orders_pkey',               91234,  4513792, true,  true),
  ('orders',     'orders_customer_id_idx',    40210,  2269184, false, false),
  ('orders',     'orders_status_idx',             0,  2252800, false, false),
  ('orders',     'orders_created_at_status_idx',  0,  5578752, false, false),
  ('customer',   'customer_email_key',            0,   229376, true,  false),
  ('customer',   'customer_city_idx',             0,   122880, false, false),
  ('product',    'product_pkey',               5120,    16384, true,  true),
  ('product',    'product_attrs_gin',            88,    32768, false, false),
  ('payment',    'payment_pkey',                  0,   917504, true,  true);
CREATE TABLE db_stats (datname text PRIMARY KEY, stats_reset timestamptz);
INSERT INTO db_stats VALUES ('ctshop', '2026-07-01 00:00:00+07');`;
const LD_CHI_MUC = { en: `<h4>Tables (snapshot)</h4>${pre(`index_usage (relname, indexrelname, idx_scan, size_bytes, is_unique, is_primary)   -- 9 indexes of CT Shop production
db_stats (datname, stats_reset)                                                      -- counters since 2026-07-01`)}`, vi: `<h4>Bảng (ảnh chụp)</h4>${pre(`index_usage (relname, indexrelname, idx_scan, size_bytes, is_unique, is_primary)   -- 9 chỉ mục của CT Shop production
db_stats (datname, stats_reset)                                                      -- bộ đếm tính từ 2026-07-01`)}` };

const TAI = `-- workload.sql — needs shared_preload_libraries = 'pg_stat_statements' (restart!) then:
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
DROP TABLE IF EXISTS big;
CREATE TABLE big (id int PRIMARY KEY, bucket int, val text);
INSERT INTO big SELECT g, g % 100, md5(g::text) FROM generate_series(1, 500000) g;
CREATE INDEX ON big (bucket);
ANALYZE big;
SELECT pg_stat_statements_reset();
SELECT count(*) FROM big WHERE val LIKE '%abc%';
SELECT count(*) FROM big WHERE val LIKE '%fff%';
SELECT sum(id) FROM big;
SELECT count(*) FROM big WHERE bucket = 7;   -- run this one 5 times, then 20 000 times (pgbench -f, or \\gexec)

SELECT calls, round(total_exec_time::numeric, 1) AS total_ms, round(mean_exec_time::numeric, 2) AS mean_ms,
       rows, left(query, 52) AS query
FROM pg_stat_statements WHERE query LIKE '%FROM big%'
ORDER BY total_exec_time DESC LIMIT 5;`;

export default mod('postgresql-14-4-giam-sat', '14.4 Monitoring: answering "why is it slow?"', [
  pg({
    csdl: PHIEN, tenCsdl: 'activity', ld: LD_PHIEN,
    t: 'Find the stuck transactions (pg_stat_activity snapshot)', k: 'MEDIUM', p: 10, kn: ["state LIKE 'idle in transaction%'", 'transaction age', 'backend_type filter'], tag: ['monitoring', 'pg_stat_activity'],
    en: '<p>Return the client sessions that sit <b>idle inside a transaction</b> (including the aborted variant) for <b>more than 60 seconds</b>: <code>pid, app, state, xact_seconds, query</code> — xact_seconds = whole seconds since xact_start at <code>snap.taken_at</code>, query = first 30 characters. Oldest first.</p>',
    vi: '<p>Trả về các phiên client <b>ngồi yên bên trong một giao dịch</b> (kể cả dạng aborted) <b>quá 60 giây</b>: <code>pid, app, state, xact_seconds, query</code> — xact_seconds = số giây nguyên tính từ xact_start tới <code>snap.taken_at</code>, query = 30 ký tự đầu. Cũ nhất trước.</p>',
    yc: [['<code>extract(epoch FROM s.taken_at - a.xact_start)::int</code> (on a live server: <code>now()</code>).', '<code>extract(epoch FROM s.taken_at - a.xact_start)::int</code> (trên máy thật: <code>now()</code>).'], ["<code>state LIKE 'idle in transaction%'</code>.", "<code>state LIKE 'idle in transaction%'</code>."]],
    giai: `SELECT a.pid, a.application_name AS app, a.state,
       extract(epoch FROM s.taken_at - a.xact_start)::int AS xact_seconds,
       left(a.query, 30) AS query
FROM activity a, snap s
WHERE a.backend_type = 'client backend'
  AND a.state LIKE 'idle in transaction%'              -- also "(aborted)"
  AND s.taken_at - a.xact_start > interval '60 seconds'
ORDER BY xact_seconds DESC;`,
    kiem: [
      kq(['The forgotten web transaction and the failed one', 'Giao dịch web bị quên và giao dịch đã hỏng'], T),
      kqAn(['Five minutes later', 'Năm phút sau'], "UPDATE snap SET taken_at = taken_at + interval '5 minutes'", T),
      ma(['Matches both idle-in-transaction states', 'Khớp cả hai trạng thái idle in transaction'], "idle in transaction%|LIKE\\s+'idle in transaction"),
    ],
    sai: ["SELECT a.pid, a.application_name AS app, a.state, extract(epoch FROM s.taken_at - a.xact_start)::int AS xact_seconds, left(a.query, 30) AS query FROM activity a, snap s WHERE a.state = 'idle in transaction' AND s.taken_at - a.xact_start > interval '60 seconds' ORDER BY xact_seconds DESC", "SELECT a.pid, a.application_name AS app, a.state, extract(epoch FROM s.taken_at - a.query_start)::int AS xact_seconds, left(a.query, 30) AS query FROM activity a, snap s WHERE a.state LIKE 'idle in transaction%' AND s.taken_at - a.query_start > interval '60 seconds' ORDER BY xact_seconds DESC", "SELECT a.pid, a.application_name AS app, a.state, extract(epoch FROM s.taken_at - a.xact_start)::int AS xact_seconds, left(a.query, 30) AS query FROM activity a, snap s WHERE a.state LIKE 'idle in transaction%' ORDER BY xact_seconds DESC"],
    gy: [['xact_start = when the transaction began; query_start = when its LAST statement began.', 'xact_start = lúc giao dịch bắt đầu; query_start = lúc câu lệnh CUỐI bắt đầu.'], ['The query column shows the last statement, not the one holding the lock.', 'Cột query hiện câu lệnh cuối cùng, không phải câu đang giữ khoá.']],
    lhg: [["<code>= 'idle in transaction'</code> — the aborted session (pid 250) is just as stuck.", "<code>= 'idle in transaction'</code> — phiên aborted (pid 250) cũng kẹt y như vậy."], ['Measuring from query_start — a transaction that ran many statements looks younger than it is.', 'Đo từ query_start — giao dịch chạy nhiều câu lệnh trông trẻ hơn thực tế.']],
    gt: ['<p>An open transaction doing nothing holds its locks and pins a snapshot, so vacuum cannot clean anything newer anywhere. pid 240 is also the one blocking pid 270 (Lock / transactionid). From here: <code>pg_cancel_backend(pid)</code> first, <code>pg_terminate_backend(pid)</code> if needed, then fix the application; <code>idle_in_transaction_session_timeout</code> is the safety net.</p>', '<p>Một giao dịch mở mà không làm gì giữ khoá và ghim một snapshot, nên vacuum không dọn được gì mới hơn ở bất cứ đâu. pid 240 cũng chính là phiên đang chặn pid 270 (Lock / transactionid). Từ đây: <code>pg_cancel_backend(pid)</code> trước, <code>pg_terminate_backend(pid)</code> nếu cần, rồi sửa ứng dụng; <code>idle_in_transaction_session_timeout</code> là lưới an toàn.</p>'],
    tn: [tn('idle in transaction', 'ngồi yên trong giao dịch'), tn('xact_start', 'lúc giao dịch bắt đầu')],
  }),

  pg({
    csdl: CAU_LENH, tenCsdl: 'statements', ld: LD_CAU_LENH,
    t: 'What has been expensive over time? (pg_stat_statements snapshot)', k: 'MEDIUM', p: 8, kn: ['total_exec_time', 'calls × mean', 'normalized queries'], tag: ['monitoring', 'pg_stat_statements'],
    en: '<p>Return the <b>3</b> queries that cost the most database time in total: <code>calls, total_ms, mean_ms, rows, query</code> with total_ms rounded to 1 decimal and mean_ms to 2 (cast to numeric before round).</p>',
    vi: '<p>Trả về <b>3</b> truy vấn tốn nhiều thời gian CSDL nhất tính tổng: <code>calls, total_ms, mean_ms, rows, query</code> với total_ms làm tròn 1 chữ số, mean_ms 2 chữ số (ép numeric trước khi round).</p>',
    yc: [['<code>ORDER BY total_exec_time DESC LIMIT 3</code>.', '<code>ORDER BY total_exec_time DESC LIMIT 3</code>.'], ['<code>round(total_exec_time::numeric, 1)</code> — round(double, int) does not exist.', '<code>round(total_exec_time::numeric, 1)</code> — round(double, int) không tồn tại.']],
    giai: `SELECT calls,
       round(total_exec_time::numeric, 1) AS total_ms,
       round(mean_exec_time::numeric, 2)  AS mean_ms,
       rows, query
FROM statements
ORDER BY total_exec_time DESC            -- the only column that measures real impact
LIMIT 3;`,
    kiem: [
      kq(['The nightly report, the 0.05 ms query called 20 005 times, and the cart update', 'Báo cáo đêm, truy vấn 0,05 ms gọi 20.005 lần, và lệnh cập nhật giỏ'], T),
      kqAn(['A busy afternoon on the product page', 'Một buổi chiều trang sản phẩm đông khách'], 'UPDATE statements SET calls = 120000, total_exec_time = 4800.0 WHERE queryid = 4', T),
      ma(['Ordered by total_exec_time', 'Sắp theo total_exec_time'], 'ORDER\\s+BY\\s+total_exec_time'),
    ],
    sai: ['SELECT calls, round(total_exec_time::numeric, 1) AS total_ms, round(mean_exec_time::numeric, 2) AS mean_ms, rows, query FROM statements ORDER BY mean_exec_time DESC LIMIT 3', 'SELECT calls, round(total_exec_time::numeric, 1) AS total_ms, round(mean_exec_time::numeric, 2) AS mean_ms, rows, query FROM statements ORDER BY calls DESC LIMIT 3'],
    gy: [['total = calls × mean: a 0.05 ms query called 20 005 times costs more than a 51 ms one called twice.', 'tổng = số lần × trung bình: truy vấn 0,05 ms gọi 20.005 lần tốn hơn truy vấn 51 ms gọi hai lần.'], ['Literals are replaced by $1, so every product-page lookup is ONE row.', 'Hằng số được thay bằng $1, nên mọi lần tra trang sản phẩm là MỘT dòng.']],
    lhg: [['Sorting by mean — you optimise the nightly report nobody waits for.', 'Sắp theo trung bình — bạn tối ưu báo cáo đêm mà không ai đợi.'], ['Sorting by calls — the cheap lookup looks scary even when it costs little.', 'Sắp theo số lần gọi — tra cứu rẻ trông đáng sợ dù tốn ít.']],
    gt: ['<p>Only total_exec_time captures impact. Here it puts a 3-second nightly report first, but the 0.05 ms query is second — ten times the "slow" LIKE query, exactly the lesson\'s measurement. On your server the view is <code>pg_stat_statements</code>; the browser grader has no extensions, so this is a snapshot.</p>', '<p>Chỉ total_exec_time đo được tác động. Ở đây báo cáo đêm 3 giây đứng đầu, nhưng truy vấn 0,05 ms đứng thứ hai — gấp mười truy vấn LIKE "chậm", đúng số đo của bài. Trên máy bạn khung nhìn là <code>pg_stat_statements</code>; máy chấm trình duyệt không có extension nên đây là ảnh chụp.</p>'],
    tn: [tn('pg_stat_statements', 'thống kê câu lệnh'), tn('total_exec_time', 'tổng thời gian chạy')],
  }),

  pg({
    csdl: CHI_MUC, tenCsdl: 'indexes', ld: LD_CHI_MUC,
    t: 'Indexes nobody uses — and the ones you must keep', k: 'MEDIUM', p: 10, kn: ['pg_stat_user_indexes.idx_scan', 'unique indexes enforce constraints', 'pg_size_pretty'], tag: ['monitoring', 'index'],
    en: '<p>List the drop candidates: <code>relname, indexrelname, size</code> of indexes with <code>idx_scan = 0</code> that are <b>neither unique nor primary keys</b> (those enforce a constraint even if no query ever scans them), biggest first; size = <code>pg_size_pretty(size_bytes)</code>.</p>',
    vi: '<p>Liệt kê ứng viên để xoá: <code>relname, indexrelname, size</code> của các chỉ mục có <code>idx_scan = 0</code> mà <b>không phải unique cũng không phải khoá chính</b> (những cái đó thực thi ràng buộc dù chưa truy vấn nào quét chúng), lớn nhất trước; size = <code>pg_size_pretty(size_bytes)</code>.</p>',
    yc: [['<code>WHERE idx_scan = 0 AND NOT is_unique</code> (a primary key is unique too).', '<code>WHERE idx_scan = 0 AND NOT is_unique</code> (khoá chính cũng là unique).'], ['<code>ORDER BY size_bytes DESC</code> — not by the pretty text.', '<code>ORDER BY size_bytes DESC</code> — không theo chuỗi đã định dạng.']],
    giai: `SELECT relname, indexrelname, pg_size_pretty(size_bytes) AS size
FROM index_usage
WHERE idx_scan = 0
  AND NOT is_unique              -- unique/PK indexes enforce a rule even if never scanned
ORDER BY size_bytes DESC;`,
    kiem: [
      kq(['Three unused, droppable indexes', 'Ba chỉ mục không dùng, xoá được'], T),
      kqAn(['A 900 kB unused index appears', 'Xuất hiện một chỉ mục 900 kB không dùng'], "INSERT INTO index_usage VALUES ('payment', 'payment_method_idx', 0, 921600, false, false)", T),
      ma(['Sorts by the byte size', 'Sắp theo số byte'], 'ORDER\\s+BY\\s+(size_bytes|pg_relation_size)'),
    ],
    sai: ['SELECT relname, indexrelname, pg_size_pretty(size_bytes) AS size FROM index_usage WHERE idx_scan = 0 ORDER BY size_bytes DESC', 'SELECT relname, indexrelname, pg_size_pretty(size_bytes) AS size FROM index_usage WHERE idx_scan = 0 AND NOT is_unique ORDER BY size DESC'],
    gy: [['Before dropping, check db_stats.stats_reset: counters since July are meaningful, since yesterday are not.', 'Trước khi xoá, xem db_stats.stats_reset: bộ đếm từ tháng 7 thì có nghĩa, từ hôm qua thì không.'], ['A monthly report may use an index once a month — look at a full cycle.', 'Báo cáo hằng tháng có thể dùng chỉ mục mỗi tháng một lần — hãy nhìn trọn một chu kỳ.']],
    lhg: [['Dropping customer_email_key because idx_scan = 0 — duplicate emails start getting in.', 'Xoá customer_email_key vì idx_scan = 0 — email trùng bắt đầu lọt vào.'], ['ORDER BY the pretty size — "5448 kB" sorts below "900 kB" as text.', 'ORDER BY chuỗi kích thước — "5448 kB" xếp dưới "900 kB" khi so chữ.']],
    gt: ['<p>An unused non-unique index is pure cost: every write maintains it and it takes disk and cache. Here about 7.6 MB of indexes on orders and customer serve no query. On your server: <code>pg_stat_user_indexes</code> joined with <code>pg_index</code> (indisunique) and <code>pg_relation_size(indexrelid)</code>.</p>', '<p>Chỉ mục không unique mà không ai dùng là chi phí thuần: mọi lần ghi phải bảo trì nó, và nó chiếm đĩa lẫn bộ đệm. Ở đây khoảng 7,6 MB chỉ mục trên orders và customer không phục vụ truy vấn nào. Trên máy bạn: <code>pg_stat_user_indexes</code> nối với <code>pg_index</code> (indisunique) và <code>pg_relation_size(indexrelid)</code>.</p>'],
    tn: [tn('idx_scan', 'số lần quét chỉ mục'), tn('stats_reset', 'mốc đặt lại thống kê')],
  }),

  cs({
    t: 'Which view answers which question?', k: 'EASY', p: 6, kn: ['pg_stat_activity vs pg_stat_statements', 'pg_cancel_backend vs pg_terminate_backend', 'alarms'], tag: ['monitoring'],
    en: '<p>Lesson 14.4 in four questions.</p>', vi: '<p>Bài 14.4 trong bốn câu.</p>',
    cau: [
      q('q1', ['"The site is slow RIGHT NOW." Where do you look first?', '"Web đang chậm NGAY BÂY GIỜ." Bạn nhìn đâu trước?'], ['pg_stat_activity (state, wait_event, age)', 'pg_stat_statements', 'pg_stat_user_indexes', 'the PostgreSQL log of last week'], ['pg_stat_activity is the present; pg_stat_statements is history since the last reset.', 'pg_stat_activity là hiện tại; pg_stat_statements là lịch sử từ lần đặt lại gần nhất.']),
      q('q2', ['A report query is hogging the CPU. The safe first move is…', 'Một truy vấn báo cáo đang ngốn CPU. Bước đầu an toàn là…'], ['pg_cancel_backend(pid) — cancels the query, keeps the connection', 'pg_terminate_backend(pid) — kills the connection', 'restart PostgreSQL', 'DROP the table it reads'], ['Cancel first; terminate is the blunter tool.', 'Huỷ truy vấn trước; kết thúc kết nối là công cụ thô hơn.']),
      q('q3', ['Why install pg_stat_statements BEFORE the incident?', 'Vì sao phải cài pg_stat_statements TRƯỚC sự cố?'], ['it needs shared_preload_libraries (a restart) and counts only from then', 'installing it under heavy load takes several hours', 'it requires upgrading to a new major PostgreSQL version', 'installing it deletes the statistics collected so far'], ['During the incident a restart makes things worse, and the view starts empty anyway.', 'Giữa sự cố, khởi động lại chỉ làm tệ hơn, và khung nhìn vẫn bắt đầu trống.']),
      qn('q4', ['Which belong on the alarm list of the lesson? (choose all)', 'Mục nào thuộc danh sách cảnh báo của bài? (chọn tất cả)'], ['connections used vs max_connections', 'age of the oldest open transaction', 'age(datfrozenxid)', 'number of tables in the database'], [0, 1, 2], ['Plus the dead-tuple ratio of busy tables and the cache hit ratio. The table count says nothing about health.', 'Thêm tỉ lệ dòng chết của bảng bận và tỉ lệ trúng bộ đệm. Số bảng không nói gì về sức khoẻ.']),
    ],
    gy: [['Now → activity; over time → statements; never used → user_indexes.', 'Bây giờ → activity; theo thời gian → statements; chưa từng dùng → user_indexes.'], ['Alarm on trends that warn early.', 'Cảnh báo theo xu hướng báo sớm.']],
    lhg: [['Terminating first and losing the session that held the evidence.', 'Kết thúc kết nối trước và mất luôn phiên đang giữ bằng chứng.'], ['Enabling pg_stat_statements mid-incident.', 'Bật pg_stat_statements giữa sự cố.']],
    tn: [tn('pg_cancel_backend', 'huỷ truy vấn đang chạy')],
  }),

  tay({
    t: 'Run a mixed workload, then find the expensive query by total time', k: 'HARD', p: 20, kn: ['shared_preload_libraries', 'pg_stat_statements_reset', 'pgbench custom script'], tag: ['monitoring', 'pg_stat_statements'],
    en: `<p>On your PostgreSQL (lesson 0.3): enable pg_stat_statements, run the lesson's workload, and read the view twice — once after 5 runs of the cheap query, once after 20 000.</p>${pre(TAI)}`,
    vi: `<p>Trên PostgreSQL của bạn (bài 0.3): bật pg_stat_statements, chạy tải của bài, và đọc khung nhìn hai lần — sau 5 lần chạy truy vấn rẻ, và sau 20.000 lần.</p>${pre(TAI)}`,
    yc: [['Docker: <code>docker run … postgres:17 -c shared_preload_libraries=pg_stat_statements</code> (or edit postgresql.conf and restart).', 'Docker: <code>docker run … postgres:17 -c shared_preload_libraries=pg_stat_statements</code> (hoặc sửa postgresql.conf rồi khởi động lại).'], ['After 20 000 calls the bucket query is first by total_exec_time, ahead of the LIKE queries.', 'Sau 20.000 lần gọi, truy vấn theo bucket đứng đầu theo total_exec_time, trên cả các truy vấn LIKE.'], ['A pgbench file with <code>\\set b random(0, 99)</code> + <code>SELECT count(*) FROM big WHERE bucket = :b;</code> does the 20 000 calls: <code>pgbench -n -f bucket.sql -t 20000</code>.', 'Một tệp pgbench có <code>\\set b random(0, 99)</code> + <code>SELECT count(*) FROM big WHERE bucket = :b;</code> chạy 20.000 lần: <code>pgbench -n -f bucket.sql -t 20000</code>.']],
    lenh: 'psql -h localhost -p 5444 -U postgres -f workload.sql && pgbench -h localhost -p 5444 -U postgres -n -f bucket.sql -t 20000 postgres',
    lyDo: ['pg_stat_statements is an extension that must be preloaded at server start; the browser grader cannot load extensions.', 'pg_stat_statements là extension phải nạp sẵn lúc máy chủ khởi động; máy chấm trình duyệt không nạp được extension.'],
    tep: { 'workload.sql': TAI + '\n', 'bucket.sql': '-- pgbench script\n' },
    giaiTep: {
      'workload.sql': `${TAI}

-- Expected after 5 runs of the bucket query (PostgreSQL 17.11):
--  calls | total_ms | mean_ms | rows | query
--      2 |    103.3 |   51.65 |    2 | SELECT count(*) FROM big WHERE val LIKE $1
--      1 |     34.5 |   34.48 |    1 | SELECT sum(id) FROM big
--      5 |      0.5 |    0.10 |    5 | SELECT count(*) FROM big WHERE bucket = $1
-- … and after 20 000 more:
--  20005 |   1048.5 |    0.05 | 20005 | SELECT count(*) FROM big WHERE bucket = $1
`,
      'bucket.sql': '\\set b random(0, 99)\nSELECT count(*) FROM big WHERE bucket = :b;\n',
    },
    viDu: [{ input: ['ORDER BY total_exec_time DESC', 'ORDER BY total_exec_time DESC'], output: ['the 0.05 ms query on top after 20 000 calls', 'truy vấn 0,05 ms lên đầu sau 20.000 lần gọi'], explanation: ['Impact = calls × mean.', 'Tác động = số lần × trung bình.'] }],
    gy: [['SHOW shared_preload_libraries; must list pg_stat_statements before CREATE EXTENSION is useful.', 'SHOW shared_preload_libraries; phải có pg_stat_statements thì CREATE EXTENSION mới có tác dụng.'], ['pg_stat_statements_reset() gives you a clean start for the experiment.', 'pg_stat_statements_reset() cho thí nghiệm một khởi đầu sạch.']],
    lhg: [['CREATE EXTENSION without the preload — the view errors with "must be loaded via shared_preload_libraries".', 'CREATE EXTENSION mà không nạp sẵn — khung nhìn báo lỗi "must be loaded via shared_preload_libraries".'], ['Reading mean_exec_time and declaring the LIKE query the problem.', 'Đọc mean_exec_time rồi kết luận truy vấn LIKE là thủ phạm.']],
    gt: ['<p>The measurement of the lesson, reproduced: frequency turns a cheap query into the most expensive one. That is why dashboards sort by total time.</p>', '<p>Số đo của bài, tái hiện lại: tần suất biến một truy vấn rẻ thành truy vấn đắt nhất. Đó là lý do bảng giám sát sắp theo tổng thời gian.</p>'],
    tn: [tn('shared_preload_libraries', 'thư viện nạp sẵn')],
  }),
]);
