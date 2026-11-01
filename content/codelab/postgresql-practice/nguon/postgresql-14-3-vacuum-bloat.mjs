/**
 * PostgreSQL · 14.3 — VACUUM, autovacuum, bloat. Autovacuum là tiến trình nền và PGlite không chạy VACUUM trong giao dịch,
 * bộ đếm pg_stat_* luôn 0 ⇒ "nhìn autovacuum chạy" là bài tay. Chấm được: chỉnh autovacuum theo bảng (ALTER TABLE … SET,
 * đọc pg_class.reloptions THẬT), phép tính ngưỡng và truy vấn tìm bảng phình trên ẢNH CHỤP pg_stat_user_tables.
 */
import { mod, pg, cs, q, tay, kq, kqAn, sau, ma, CT_SHOP, LUOC_DO_CT_SHOP, pre, tn } from './_chung.mjs';

const T = { thuTu: true };

const NGUONG = `CREATE TABLE av_setting (name text PRIMARY KEY, setting text NOT NULL);   -- copied from pg_settings
INSERT INTO av_setting VALUES ('autovacuum_vacuum_threshold', '50'), ('autovacuum_vacuum_scale_factor', '0.2'), ('autovacuum_naptime', '60');
CREATE TABLE table_stat (relname text PRIMARY KEY, n_live_tup bigint NOT NULL, n_dead_tup bigint NOT NULL);   -- from pg_stat_user_tables
INSERT INTO table_stat VALUES
  ('don_hang', 200000, 50000), ('event', 1000000, 150000), ('customer', 5000, 900),
  ('av_demo', 1000, 300), ('setting_kv', 10, 55), ('country', 250, 0);`;
const LD_NGUONG = { en: `<h4>Tables (snapshot of a real server)</h4>${pre(`av_setting (name, setting text)                 -- threshold 50, scale_factor 0.2, naptime 60
table_stat (relname, n_live_tup, n_dead_tup)    -- 6 tables`)}`, vi: `<h4>Bảng (ảnh chụp một máy chủ thật)</h4>${pre(`av_setting (name, setting text)                 -- threshold 50, scale_factor 0.2, naptime 60
table_stat (relname, n_live_tup, n_dead_tup)    -- 6 bảng`)}` };

const PHINH = `CREATE TABLE user_tables (            -- a snapshot of pg_stat_user_tables + pg_relation_size(relid)
  relname text PRIMARY KEY, n_live_tup bigint NOT NULL, n_dead_tup bigint NOT NULL,
  size_bytes bigint NOT NULL, last_autovacuum timestamptz);
SET TimeZone = 'Asia/Ho_Chi_Minh';
INSERT INTO user_tables VALUES
  ('don_hang',      200000, 50000, 14680064, NULL),
  ('av_demo',         1000,   300,   106496, '2026-10-26 01:15:43+07'),
  ('session_store',      0,    40,    65536, '2026-10-25 22:00:00+07'),
  ('customer',        5000,   900,  1179648, '2026-10-26 00:40:00+07'),
  ('product',          480,    12,   131072, '2026-10-25 23:10:00+07'),
  ('stock_movement', 90000,  8000,  6291456, '2026-10-26 01:02:00+07'),
  ('payment',        40000,  2500,  3145728, '2026-10-26 00:55:00+07'),
  ('country',          250,     0,    16384, NULL);`;
const LD_PHINH = { en: `<h4>Table (snapshot)</h4>${pre(`user_tables (relname, n_live_tup, n_dead_tup, size_bytes, last_autovacuum)   -- 8 tables, 7 with dead rows`)}`, vi: `<h4>Bảng (ảnh chụp)</h4>${pre(`user_tables (relname, n_live_tup, n_dead_tup, size_bytes, last_autovacuum)   -- 8 bảng, 7 bảng có dòng chết`)}` };

const XEM = `-- watch.sql — psql -f watch.sql, then keep the second query running with \\watch 5
DROP TABLE IF EXISTS av_demo;
CREATE TABLE av_demo (id int PRIMARY KEY, v text);
INSERT INTO av_demo SELECT g, 'row ' || g FROM generate_series(1, 1000) g;
ALTER TABLE av_demo SET (autovacuum_vacuum_threshold = 100, autovacuum_vacuum_scale_factor = 0);
SELECT pg_stat_force_next_flush();
UPDATE av_demo SET v = v || '!';          -- 1000 dead row versions

SELECT now()::time(0) AS t, n_live_tup, n_dead_tup, autovacuum_count, last_autovacuum
FROM pg_stat_user_tables WHERE relname = 'av_demo';`;

const SUA_BANG = `${CT_SHOP}
ALTER TABLE customer SET (autovacuum_enabled = false);   -- someone "fixed" a slow import last year`;

export default mod('postgresql-14-3-vacuum-bloat', '14.3 VACUUM, autovacuum and bloat', [
  pg({
    csdl: NGUONG, tenCsdl: 'autovacuum', ld: LD_NGUONG,
    t: 'Which tables has autovacuum already picked?', k: 'MEDIUM', p: 10, kn: ['autovacuum threshold', 'threshold + scale_factor × rows'], tag: ['vacuum', 'autovacuum'],
    en: '<p>For every table return <code>relname, n_live_tup, n_dead_tup, threshold, due</code>: threshold = autovacuum_vacuum_threshold + autovacuum_vacuum_scale_factor × n_live_tup (settings <b>read from av_setting</b>), due = n_dead_tup &gt; threshold. Most dead rows first.</p>',
    vi: '<p>Với mọi bảng trả về <code>relname, n_live_tup, n_dead_tup, threshold, due</code>: threshold = autovacuum_vacuum_threshold + autovacuum_vacuum_scale_factor × n_live_tup (thiết lập <b>đọc từ av_setting</b>), due = n_dead_tup &gt; threshold. Nhiều dòng chết trước.</p>',
    yc: [['Cast the settings: <code>setting::numeric</code>.', 'Ép kiểu thiết lập: <code>setting::numeric</code>.'], ['Strictly greater: autovacuum fires when dead tuples EXCEED the threshold.', 'Lớn hơn hẳn: autovacuum chạy khi số dòng chết VƯỢT ngưỡng.']],
    giai: `WITH s AS (
  SELECT max(setting::numeric) FILTER (WHERE name = 'autovacuum_vacuum_threshold')    AS base,
         max(setting::numeric) FILTER (WHERE name = 'autovacuum_vacuum_scale_factor') AS scale
  FROM av_setting
)
SELECT t.relname, t.n_live_tup, t.n_dead_tup,
       s.base + s.scale * t.n_live_tup AS threshold,
       t.n_dead_tup > s.base + s.scale * t.n_live_tup AS due
FROM table_stat t, s
ORDER BY t.n_dead_tup DESC, t.relname;`,
    kiem: [
      kq(['Default settings: event (15% dead) is not due yet', 'Thiết lập mặc định: event (15% chết) chưa tới lượt'], T),
      kqAn(['scale_factor lowered to 0.05', 'Hạ scale_factor xuống 0.05'], "UPDATE av_setting SET setting = '0.05' WHERE name = 'autovacuum_vacuum_scale_factor'", T),
      kqAn(['A table exactly at its threshold is not due', 'Bảng đúng bằng ngưỡng thì chưa tới lượt'], "INSERT INTO table_stat VALUES ('edge', 500, 150)", T),
    ],
    sai: ["SELECT relname, n_live_tup, n_dead_tup, 50 + 0.2 * n_live_tup AS threshold, n_dead_tup > 50 + 0.2 * n_live_tup AS due FROM table_stat ORDER BY n_dead_tup DESC, relname", "WITH s AS (SELECT max(setting::numeric) FILTER (WHERE name = 'autovacuum_vacuum_threshold') AS base, max(setting::numeric) FILTER (WHERE name = 'autovacuum_vacuum_scale_factor') AS scale FROM av_setting) SELECT t.relname, t.n_live_tup, t.n_dead_tup, s.base + s.scale * t.n_live_tup AS threshold, t.n_dead_tup >= s.base + s.scale * t.n_live_tup AS due FROM table_stat t, s ORDER BY t.n_dead_tup DESC, t.relname"],
    gy: [['1,000,000 rows ⇒ 200,050 dead rows before autovacuum even looks.', '1.000.000 dòng ⇒ 200.050 dòng chết thì autovacuum mới để ý.'], ['Real PostgreSQL uses reltuples (the planner\'s estimate); n_live_tup is close enough here.', 'PostgreSQL thật dùng reltuples (ước lượng của planner); ở đây n_live_tup đủ sát.']],
    lhg: [['Hard-coding 50 and 0.2 — the per-server (and per-table) settings differ.', 'Viết cứng 50 và 0.2 — thiết lập khác nhau theo máy chủ (và theo bảng).'], ['&gt;= instead of &gt;.', '&gt;= thay vì &gt;.']],
    gt: ['<p>The scale factor is why large tables bloat: 20% of a million rows is 200,000 dead versions before the first pass, and each pass then has more work. The usual fix is per-table settings on the few tables that churn — the next exercise.</p>', '<p>Hệ số tỉ lệ là lý do bảng lớn phình: 20% của một triệu dòng là 200.000 phiên bản chết trước lượt đầu, và mỗi lượt sau càng nhiều việc. Cách sửa thường gặp là thiết lập riêng cho vài bảng biến động nhiều — bài tiếp theo.</p>'],
    tn: [tn('autovacuum', 'tự dọn dẹp'), tn('dead tuple', 'dòng chết')],
  }),

  pg({
    csdl: SUA_BANG, tenCsdl: 'ctshop', ld: LUOC_DO_CT_SHOP,
    t: 'Tune autovacuum per table (and undo a bad tweak)', k: 'MEDIUM', p: 10, kn: ['ALTER TABLE … SET (storage parameters)', 'ALTER TABLE … RESET', 'pg_class.reloptions'], tag: ['vacuum', 'autovacuum', 'ctshop'],
    en: '<p>In CT Shop, <code>orders</code> and <code>stock_movement</code> churn: give both <code>autovacuum_vacuum_scale_factor = 0.01</code> and <code>autovacuum_vacuum_threshold = 1000</code>. Someone also set <code>autovacuum_enabled = false</code> on <code>customer</code> a year ago — put it back to the default. Leave every other table alone.</p>',
    vi: '<p>Trong CT Shop, <code>orders</code> và <code>stock_movement</code> biến động nhiều: đặt cho cả hai <code>autovacuum_vacuum_scale_factor = 0.01</code> và <code>autovacuum_vacuum_threshold = 1000</code>. Một năm trước còn có người đặt <code>autovacuum_enabled = false</code> cho <code>customer</code> — trả nó về mặc định. Không đụng các bảng khác.</p>',
    yc: [['<code>ALTER TABLE orders SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000);</code>', '<code>ALTER TABLE orders SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000);</code>'], ['<code>ALTER TABLE customer RESET (autovacuum_enabled);</code> — RESET removes the option instead of writing a value.', '<code>ALTER TABLE customer RESET (autovacuum_enabled);</code> — RESET xoá tuỳ chọn thay vì ghi một giá trị.']],
    giai: `ALTER TABLE orders         SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000);
ALTER TABLE stock_movement SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000);
ALTER TABLE customer RESET (autovacuum_enabled);     -- back to the server default (on)`,
    kiem: [
      sau(['The storage parameters of the four tables', 'Tham số lưu trữ của bốn bảng'], "SELECT relname, (SELECT array_agg(o ORDER BY o) FROM unnest(reloptions) o)::text AS options FROM pg_class WHERE relname IN ('orders', 'stock_movement', 'customer', 'product') ORDER BY relname", T),
      sau(['No other table was touched', 'Không bảng nào khác bị đụng'], "SELECT count(*) AS tuned FROM pg_class WHERE relkind = 'r' AND reloptions IS NOT NULL AND relnamespace = 'public'::regnamespace"),
      ma(['customer is RESET, not set to true', 'customer được RESET, không đặt true'], 'RESET\\s*\\(\\s*autovacuum_enabled'),
    ],
    sai: [
      "ALTER TABLE orders SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000); ALTER TABLE stock_movement SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000); ALTER TABLE customer SET (autovacuum_enabled = true);",
      "ALTER TABLE orders SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000); ALTER TABLE stock_movement SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000); ALTER TABLE product SET (autovacuum_vacuum_scale_factor = 0.01); ALTER TABLE customer RESET (autovacuum_enabled);",
      "ALTER TABLE orders SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000); ALTER TABLE customer RESET (autovacuum_enabled);",
    ],
    gy: [['Per-table settings live in pg_class.reloptions as text like <code>autovacuum_vacuum_threshold=1000</code>.', 'Thiết lập theo bảng nằm trong pg_class.reloptions dạng chữ như <code>autovacuum_vacuum_threshold=1000</code>.'], ['\\d+ orders in psql shows them under "Options".', '\\d+ orders trong psql hiện chúng ở mục "Options".']],
    lhg: [['SET (autovacuum_enabled = true) — it works today, but the table keeps a hard-coded override nobody remembers.', 'SET (autovacuum_enabled = true) — hôm nay chạy được, nhưng bảng giữ một ghi đè cứng mà không ai nhớ.'], ['Tuning every table "to be safe" — more frequent passes everywhere cost I/O for nothing.', 'Chỉnh mọi bảng "cho chắc" — lượt dọn dày hơn ở khắp nơi tốn I/O vô ích.']],
    gt: ['<p>Per-table autovacuum settings are the right tool for the few tables that churn: about 1% churn triggers a small pass instead of waiting for 20%. RESET returns an option to the server default, which is what you want for the forgotten <code>autovacuum_enabled = false</code> — a table that is never vacuumed bloats and eventually risks wraparound.</p>', '<p>Thiết lập autovacuum theo bảng là công cụ đúng cho vài bảng biến động nhiều: khoảng 1% thay đổi là chạy một lượt nhỏ thay vì đợi tới 20%. RESET trả tuỳ chọn về mặc định của máy chủ — đúng điều cần cho <code>autovacuum_enabled = false</code> bị bỏ quên: bảng không bao giờ được dọn sẽ phình và cuối cùng có nguy cơ wraparound.</p>'],
    tn: [tn('storage parameter', 'tham số lưu trữ'), tn('reloptions', 'tuỳ chọn của bảng')],
  }),

  pg({
    csdl: PHINH, tenCsdl: 'stats', ld: LD_PHINH,
    t: 'Find the bloated tables', k: 'MEDIUM', p: 10, kn: ['dead-tuple ratio', 'division by zero guard', 'pg_size_pretty'], tag: ['vacuum', 'bloat', 'monitoring'],
    en: '<p>The lesson\'s bloat query, on a snapshot: return <code>relname, n_live_tup, n_dead_tup, dead_pct, size, last_autovacuum</code> for the <b>5</b> tables with the most dead rows (only tables that have any). dead_pct = 100 × dead / live rounded to 1 decimal, <b>0 when n_live_tup = 0</b>; size = <code>pg_size_pretty(size_bytes)</code>.</p>',
    vi: '<p>Truy vấn tìm bảng phình của bài học, trên ảnh chụp: trả về <code>relname, n_live_tup, n_dead_tup, dead_pct, size, last_autovacuum</code> cho <b>5</b> bảng nhiều dòng chết nhất (chỉ bảng có dòng chết). dead_pct = 100 × chết / sống làm tròn 1 chữ số, <b>0 khi n_live_tup = 0</b>; size = <code>pg_size_pretty(size_bytes)</code>.</p>',
    yc: [['<code>CASE WHEN n_live_tup &gt; 0 THEN round(100.0 * n_dead_tup / n_live_tup, 1) ELSE 0 END</code>.', '<code>CASE WHEN n_live_tup &gt; 0 THEN round(100.0 * n_dead_tup / n_live_tup, 1) ELSE 0 END</code>.'], ['<code>WHERE n_dead_tup &gt; 0 ORDER BY n_dead_tup DESC LIMIT 5</code>.', '<code>WHERE n_dead_tup &gt; 0 ORDER BY n_dead_tup DESC LIMIT 5</code>.']],
    giai: `SELECT relname, n_live_tup, n_dead_tup,
       CASE WHEN n_live_tup > 0
            THEN round(100.0 * n_dead_tup / n_live_tup, 1)
            ELSE 0 END AS dead_pct,                          -- an emptied table would divide by zero
       pg_size_pretty(size_bytes) AS size,
       last_autovacuum
FROM user_tables
WHERE n_dead_tup > 0
ORDER BY n_dead_tup DESC
LIMIT 5;`,
    kiem: [
      kq(['The five tables with the most dead rows', 'Năm bảng nhiều dòng chết nhất'], T),
      kqAn(['An emptied table becomes the worst one', 'Một bảng vừa bị xoá sạch thành bảng tệ nhất'], "UPDATE user_tables SET n_live_tup = 0, n_dead_tup = 60000 WHERE relname = 'session_store'", T),
      ma(['Guards the division', 'Chặn phép chia cho 0'], 'CASE|NULLIF|GREATEST'),
    ],
    sai: ["SELECT relname, n_live_tup, n_dead_tup, round(100.0 * n_dead_tup / n_live_tup, 1) AS dead_pct, pg_size_pretty(size_bytes) AS size, last_autovacuum FROM user_tables WHERE n_dead_tup > 0 ORDER BY n_dead_tup DESC LIMIT 5", "SELECT relname, n_live_tup, n_dead_tup, CASE WHEN n_live_tup > 0 THEN round(100.0 * n_dead_tup / n_live_tup, 1) ELSE 0 END AS dead_pct, pg_size_pretty(size_bytes) AS size, last_autovacuum FROM user_tables WHERE n_dead_tup > 0 ORDER BY dead_pct DESC LIMIT 5", "SELECT relname, n_live_tup, n_dead_tup, CASE WHEN n_live_tup > 0 THEN round(100 * n_dead_tup / n_live_tup, 1) ELSE 0 END AS dead_pct, pg_size_pretty(size_bytes) AS size, last_autovacuum FROM user_tables WHERE n_dead_tup > 0 ORDER BY n_dead_tup DESC LIMIT 5"],
    gy: [['100.0 (not 100) makes the division decimal.', '100.0 (không phải 100) để phép chia ra số thập phân.'], ['On a live server: FROM pg_stat_user_tables, size = pg_relation_size(relid).', 'Trên máy thật: FROM pg_stat_user_tables, size = pg_relation_size(relid).']],
    lhg: [['No guard — the first table emptied by a DELETE crashes the dashboard with "division by zero".', 'Không chặn — bảng đầu tiên bị DELETE sạch làm bảng giám sát sập với "division by zero".'], ['Sorting by the ratio — a 40-row session table outranks a 14 MB order table.', 'Sắp theo tỉ lệ — bảng session 40 dòng xếp trên bảng đơn hàng 14 MB.']],
    gt: ['<p>Absolute dead rows find the tables where vacuum matters; the ratio tells you whether autovacuum keeps up. A table with a high ratio and no last_autovacuum (don_hang here) is the one to tune.</p>', '<p>Số dòng chết tuyệt đối chỉ ra bảng mà vacuum quan trọng; tỉ lệ cho biết autovacuum có theo kịp không. Bảng tỉ lệ cao mà chưa có last_autovacuum (ở đây là don_hang) là bảng cần chỉnh.</p>'],
    tn: [tn('bloat', 'phình bảng'), tn('pg_stat_user_tables', 'thống kê bảng người dùng')],
  }),

  cs({
    t: 'VACUUM, VACUUM FULL, pg_repack, ANALYZE', k: 'EASY', p: 6, kn: ['VACUUM vs VACUUM FULL', 'ACCESS EXCLUSIVE', 'transaction ID wraparound'], tag: ['vacuum'],
    en: '<p>Lesson 14.3 in four questions.</p>', vi: '<p>Bài 14.3 trong bốn câu.</p>',
    cau: [
      q('q1', ['After a plain VACUUM of a bloated 13 MB table, its file is…', 'Sau VACUUM thường trên bảng phình 13 MB, tệp của nó…'], ['still about 13 MB: the space is reusable, not returned to the OS', 'back to its original 4.6 MB, the dead space is returned', 'deleted and recreated under a new file name', 'locked for writes until the next server restart'], ['VACUUM marks space reusable for the same table; only a rewrite (VACUUM FULL, pg_repack) shrinks the file.', 'VACUUM đánh dấu chỗ trống để chính bảng đó dùng lại; chỉ việc viết lại (VACUUM FULL, pg_repack) mới thu nhỏ tệp.']),
      q('q2', ['Why is VACUUM FULL never routine on a busy table?', 'Vì sao VACUUM FULL không bao giờ là việc thường ngày trên bảng bận?'], ['ACCESS EXCLUSIVE lock (even SELECT waits) plus room for a second copy', 'it can delete live rows that are still being updated', 'it only works on tables that have no indexes at all', 'it turns autovacuum off for that table permanently'], ['Use pg_repack to rewrite without the long exclusive lock.', 'Dùng pg_repack để viết lại mà không giữ khoá độc quyền lâu.']),
      q('q3', ['Plans are bad right after a bulk load of 2 million rows. The usual missing step is…', 'Kế hoạch tệ ngay sau khi nạp lô 2 triệu dòng. Bước thường bị thiếu là…'], ['ANALYZE (fresh planner statistics)', 'VACUUM FULL', 'a new index on every column', 'REINDEX'], ['Autovacuum also analyzes, but not instantly; run ANALYZE after a bulk load.', 'Autovacuum cũng analyze, nhưng không ngay lập tức; hãy chạy ANALYZE sau khi nạp lô.']),
      q('q4', ['What happens if VACUUM can never freeze old rows (e.g. a transaction stays open for weeks)?', 'Chuyện gì xảy ra nếu VACUUM không bao giờ đóng băng được dòng cũ (vd. một giao dịch mở suốt nhiều tuần)?'], ['transaction ID wraparound protection eventually stops all writes', 'queries get slightly slower, nothing more serious happens', 'nothing — the transaction counter is 64-bit and never wraps', 'PostgreSQL truncates the oldest rows of the table'], ['Visibility uses a 32-bit XID; without freezing, PostgreSQL refuses new XIDs to protect the data.', 'Tính hiển thị dùng XID 32 bit; không đóng băng thì PostgreSQL từ chối cấp XID mới để bảo vệ dữ liệu.']),
    ],
    gy: [['Separate "reusable" from "returned to the OS".', 'Tách "dùng lại được" khỏi "trả về hệ điều hành".'], ['ANALYZE is statistics, VACUUM is space and freezing.', 'ANALYZE là thống kê, VACUUM là chỗ trống và đóng băng.']],
    lhg: [['Running VACUUM FULL from a cron job.', 'Chạy VACUUM FULL từ cron.'], ['Ignoring age(datfrozenxid) until it is an outage.', 'Lờ age(datfrozenxid) cho tới khi thành sự cố.']],
    tn: [tn('wraparound', 'tràn vòng bộ đếm giao dịch')],
  }),

  tay({
    t: 'Watch autovacuum fire within a minute', k: 'MEDIUM', p: 12, kn: ['per-table autovacuum_vacuum_threshold', 'autovacuum_naptime', 'pg_stat_user_tables'], tag: ['vacuum', 'autovacuum'],
    en: `<p>On your PostgreSQL (lesson 0.3), give a small table an aggressive threshold, make 1,000 rows dead and watch the counters:</p>${pre(XEM)}`,
    vi: `<p>Trên PostgreSQL của bạn (bài 0.3), cho một bảng nhỏ ngưỡng gắt, tạo 1.000 dòng chết rồi theo dõi bộ đếm:</p>${pre(XEM)}`,
    yc: [['Right after the UPDATE: n_dead_tup = 1000, autovacuum_count = 0.', 'Ngay sau UPDATE: n_dead_tup = 1000, autovacuum_count = 0.'], ['Within about one autovacuum_naptime (60 s): autovacuum_count = 1, n_dead_tup = 0, last_autovacuum filled.', 'Trong khoảng một autovacuum_naptime (60 s): autovacuum_count = 1, n_dead_tup = 0, last_autovacuum có giá trị.']],
    lenh: 'psql -h localhost -p 5444 -U postgres -f watch.sql   # then re-run the last query with \\watch 5',
    lyDo: ['Autovacuum is a background worker of a running server; the browser grader has no background processes and its statistics counters stay at zero.', 'Autovacuum là tiến trình nền của một máy chủ đang chạy; máy chấm trình duyệt không có tiến trình nền và bộ đếm thống kê luôn bằng 0.'],
    tep: { 'watch.sql': XEM + '\n' },
    giaiTep: { 'watch.sql': `${XEM}

-- Expected (PostgreSQL 17.11, polled every 5 s):
-- [0s]  autovacuum_count=0 · n_dead_tup=1000
-- … nothing for ~45 s (autovacuum wakes every autovacuum_naptime = 60 s)
-- [50s] autovacuum_count=1 · n_dead_tup=0 · last_autovacuum=01:15:43
` },
    viDu: [{ input: ['\\watch 5', '\\watch 5'], output: ['n_dead_tup 1000 → 0 after ~50 s', 'n_dead_tup 1000 → 0 sau ~50 s'], explanation: ['The threshold is 100 + 0 × 1000 = 100, so 1000 dead rows qualify at the next wake-up.', 'Ngưỡng là 100 + 0 × 1000 = 100, nên 1000 dòng chết đủ điều kiện ở lần thức dậy kế tiếp.'] }],
    gy: [['Statistics are flushed asynchronously; wait a few seconds before the first reading.', 'Thống kê được đẩy bất đồng bộ; đợi vài giây trước lần đọc đầu.'], ['Use \\watch 5 instead of a shell loop.', 'Dùng \\watch 5 thay cho vòng lặp shell.']],
    lhg: [['Expecting it to fire instantly — it is checked once per naptime.', 'Mong nó chạy ngay — mỗi naptime mới kiểm một lần.'], ['Doing the UPDATE inside a transaction you leave open — the dead rows are not dead yet for anyone.', 'Làm UPDATE trong giao dịch để ngỏ — các dòng đó chưa "chết" với ai cả.']],
    gt: ['<p>The run shows both halves of the lesson: the threshold formula with per-table overrides, and the naptime rhythm of autovacuum.</p>', '<p>Lượt chạy cho thấy cả hai nửa bài học: công thức ngưỡng với thiết lập riêng của bảng, và nhịp naptime của autovacuum.</p>'],
    tn: [tn('autovacuum_naptime', 'khoảng nghỉ của autovacuum')],
  }),
]);
