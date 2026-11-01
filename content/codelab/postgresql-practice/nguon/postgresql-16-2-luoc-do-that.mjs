/**
 * PostgreSQL · 16.2 — Lược đồ thật. Truy vấn danh mục hệ thống THẬT trên CT Shop (pg_constraint, pg_index, kích thước bảng)
 * và truy vấn "tìm chỉ mục thiếu" bằng seq_scan trên ẢNH CHỤP pg_stat_user_tables (PGlite không đếm thống kê).
 */
import { mod, pg, cs, q, kq, kqAn, ma, pre, tn } from './_chung.mjs';

const T = { thuTu: true };

const QUET = `CREATE TABLE user_tables (            -- snapshot of pg_stat_user_tables on a copy of a real 600-table schema
  relname text PRIMARY KEY, seq_scan bigint NOT NULL, seq_tup_read bigint NOT NULL,
  idx_scan bigint NOT NULL, n_live_tup bigint NOT NULL);
INSERT INTO user_tables VALUES
  ('users',              1203,     4812000, 9912345, 4000),
  ('notes',             18450, 92250000000,    3120, 5000000),
  ('work_issues',         310,    37200000,  884120, 120000),
  ('post_music',         5120,      512000,       0, 100),
  ('chat_messages',      2210, 17680000000,    1500, 8000000),
  ('languages',         99812,     1497180,       0, 15),
  ('course_progress',   25000,   500000000,    9000, 500000);`;
const LD_QUET = { en: `<h4>Table (snapshot)</h4>${pre(`user_tables (relname, seq_scan, seq_tup_read, idx_scan, n_live_tup)   -- 7 tables of a large schema`)}`, vi: `<h4>Bảng (ảnh chụp)</h4>${pre(`user_tables (relname, seq_scan, seq_tup_read, idx_scan, n_live_tup)   -- 7 bảng của một lược đồ lớn`)}` };

export default mod('postgresql-16-2-luoc-do-that', '16.2 A real schema: reading one you did not write', [
  pg({
    t: 'The gravitational centre: which table do foreign keys point at?', k: 'MEDIUM', p: 8, kn: ['pg_constraint', "contype = 'f'", 'confrelid::regclass'], tag: ['catalog', 'schema', 'ctshop'],
    en: '<p>From the system catalog of CT Shop, count the foreign keys pointing at each table: <code>target_table, incoming_fks</code> (target as text), most first, ties alphabetical. On the site\'s real schema the same query puts <code>users</code> first with 241.</p>',
    vi: '<p>Từ danh mục hệ thống của CT Shop, đếm số khoá ngoại trỏ tới mỗi bảng: <code>target_table, incoming_fks</code> (bảng đích dạng chữ), nhiều nhất trước, bằng nhau theo chữ cái. Trên lược đồ thật của web, cùng truy vấn này đưa <code>users</code> lên đầu với 241.</p>',
    yc: [["<code>FROM pg_constraint WHERE contype = 'f'</code>, grouped by <code>confrelid</code>.", "<code>FROM pg_constraint WHERE contype = 'f'</code>, gộp theo <code>confrelid</code>."], ['<code>confrelid::regclass::text</code> gives the table name.', '<code>confrelid::regclass::text</code> cho tên bảng.']],
    giai: `SELECT confrelid::regclass::text AS target_table, count(*) AS incoming_fks
FROM pg_constraint
WHERE contype = 'f'                      -- f = foreign key; confrelid = the referenced table
GROUP BY confrelid
ORDER BY incoming_fks DESC, target_table;`,
    kiem: [
      kq(['product and orders are the centres of CT Shop', 'product và orders là trung tâm của CT Shop'], T),
      kqAn(['A wishlist table is added', 'Thêm bảng wishlist'], 'CREATE TABLE wishlist (customer_id bigint REFERENCES customer(id), product_id bigint REFERENCES product(id), PRIMARY KEY (customer_id, product_id))', T),
      ma(['Reads pg_constraint', 'Đọc pg_constraint'], 'pg_constraint'),
    ],
    sai: ["SELECT conrelid::regclass::text AS target_table, count(*) AS incoming_fks FROM pg_constraint WHERE contype = 'f' GROUP BY conrelid ORDER BY incoming_fks DESC, target_table", "SELECT confrelid::regclass::text AS target_table, count(*) AS incoming_fks FROM pg_constraint GROUP BY confrelid ORDER BY incoming_fks DESC, target_table"],
    gy: [['conrelid = the table that HAS the foreign key; confrelid = the table it points AT.', 'conrelid = bảng CÓ khoá ngoại; confrelid = bảng nó trỏ TỚI.'], ['A self-reference (category.parent_id) counts too.', 'Tự tham chiếu (category.parent_id) cũng được đếm.']],
    lhg: [['Grouping by conrelid — you count outgoing keys, not incoming.', 'Gộp theo conrelid — bạn đếm khoá đi ra, không phải đi vào.'], ['Forgetting contype = \'f\' — primary keys and checks have confrelid = 0 and pollute the list.', 'Quên contype = \'f\' — khoá chính và check có confrelid = 0 làm bẩn danh sách.']],
    gt: ['<p>The tables many foreign keys point at are where every feature meets — in an application with accounts, almost always the user table. Start reading an unknown schema there, then follow the keys outward two hops.</p>', '<p>Bảng được nhiều khoá ngoại trỏ tới là nơi mọi tính năng gặp nhau — trong ứng dụng có tài khoản, hầu như luôn là bảng người dùng. Bắt đầu đọc lược đồ lạ từ đó, rồi đi theo các khoá ra ngoài hai bước.</p>'],
    tn: [tn('system catalog', 'danh mục hệ thống'), tn('confrelid', 'bảng được tham chiếu')],
  }),

  pg({
    csdl: QUET, tenCsdl: 'stats', ld: LD_QUET,
    t: 'Find the missing index from the statistics alone', k: 'MEDIUM', p: 10, kn: ['seq_scan vs idx_scan', 'seq_tup_read / seq_scan', 'small tables are fine to scan'], tag: ['catalog', 'index', 'monitoring'],
    en: '<p>The lesson\'s highest-value query. Return the tables with more than <b>10 000</b> live rows that are read by sequential scans more often than by an index: <code>relname, seq_scan, idx_scan, n_live_tup, rows_per_seq_scan</code> (seq_tup_read ÷ seq_scan, whole number), the ones that read the most rows by scanning first (seq_tup_read DESC).</p>',
    vi: '<p>Truy vấn giá trị nhất của bài. Trả về các bảng có hơn <b>10 000</b> dòng sống mà bị đọc bằng quét tuần tự nhiều hơn bằng chỉ mục: <code>relname, seq_scan, idx_scan, n_live_tup, rows_per_seq_scan</code> (seq_tup_read ÷ seq_scan, số nguyên), bảng đọc nhiều dòng nhất bằng quét đứng trước (seq_tup_read DESC).</p>',
    yc: [['<code>WHERE n_live_tup &gt; 10000 AND seq_scan &gt; idx_scan</code>.', '<code>WHERE n_live_tup &gt; 10000 AND seq_scan &gt; idx_scan</code>.'], ['Integer division of two bigints already gives a whole number.', 'Chia hai bigint đã ra số nguyên.']],
    giai: `SELECT relname, seq_scan, idx_scan, n_live_tup,
       seq_tup_read / seq_scan AS rows_per_seq_scan          -- ≈ n_live_tup ⇒ each scan reads the whole table
FROM user_tables
WHERE n_live_tup > 10000            -- scanning a 15-row lookup table is the RIGHT plan
  AND seq_scan > idx_scan
ORDER BY seq_tup_read DESC;`,
    kiem: [
      kq(['notes and chat_messages are read end to end', 'notes và chat_messages bị đọc từ đầu tới cuối'], T),
      kqAn(['After CREATE INDEX on notes and a day of traffic', 'Sau CREATE INDEX trên notes và một ngày truy cập'], "UPDATE user_tables SET seq_scan = 12, seq_tup_read = 60000000, idx_scan = 310000 WHERE relname = 'notes'", T),
      ma(['Filters out small tables', 'Loại bảng nhỏ'], 'n_live_tup\\s*>'),
    ],
    sai: ['SELECT relname, seq_scan, idx_scan, n_live_tup, seq_tup_read / seq_scan AS rows_per_seq_scan FROM user_tables WHERE seq_scan > idx_scan ORDER BY seq_tup_read DESC', 'SELECT relname, seq_scan, idx_scan, n_live_tup, seq_tup_read / seq_scan AS rows_per_seq_scan FROM user_tables WHERE n_live_tup > 10000 AND seq_scan > idx_scan ORDER BY seq_scan DESC'],
    gy: [['On a live database: <code>FROM pg_stat_user_tables</code>, same columns.', 'Trên CSDL thật: <code>FROM pg_stat_user_tables</code>, cùng các cột.'], ['rows_per_seq_scan close to n_live_tup means every scan read the whole table.', 'rows_per_seq_scan gần n_live_tup nghĩa là mỗi lượt quét đọc cả bảng.']],
    lhg: [['Flagging languages (15 rows) — a seq scan is the best plan for tiny tables.', 'Cắm cờ languages (15 dòng) — quét tuần tự là kế hoạch tốt nhất cho bảng tí hon.'], ['Ordering by seq_scan — a small table scanned often outranks a huge one scanned less.', 'Sắp theo seq_scan — bảng nhỏ bị quét thường xuyên xếp trên bảng khổng lồ bị quét ít hơn.']],
    gt: ['<p>Without reading a line of application code: notes (5 M rows) was scanned 18 450 times, each time reading the whole table — a missing index (chapter 9). Then find the query in pg_stat_statements and EXPLAIN it.</p>', '<p>Không cần đọc dòng mã ứng dụng nào: notes (5 triệu dòng) bị quét 18 450 lần, mỗi lần đọc cả bảng — thiếu chỉ mục (chương 9). Rồi tìm truy vấn trong pg_stat_statements và EXPLAIN nó.</p>'],
    tn: [tn('seq_scan', 'số lượt quét tuần tự'), tn('seq_tup_read', 'số dòng đọc bằng quét tuần tự')],
  }),

  pg({
    t: 'Table, indexes and total size', k: 'EASY', p: 8, kn: ['pg_relation_size', 'pg_indexes_size', 'pg_total_relation_size', 'count of indexes'], tag: ['catalog', 'ctshop'],
    en: '<p>For every table of CT Shop (schema public) return <code>table_name, indexes, table_bytes, index_bytes, total_bytes</code>: the number of indexes (pg_index), <code>pg_relation_size</code>, <code>pg_indexes_size</code> and <code>pg_total_relation_size</code>. Biggest total first, ties by name.</p>',
    vi: '<p>Với mọi bảng của CT Shop (schema public) trả về <code>table_name, indexes, table_bytes, index_bytes, total_bytes</code>: số chỉ mục (pg_index), <code>pg_relation_size</code>, <code>pg_indexes_size</code> và <code>pg_total_relation_size</code>. Tổng lớn nhất trước, bằng nhau theo tên.</p>',
    yc: [["<code>FROM pg_class c WHERE c.relnamespace = 'public'::regnamespace AND c.relkind = 'r'</code>.", "<code>FROM pg_class c WHERE c.relnamespace = 'public'::regnamespace AND c.relkind = 'r'</code>."], ['total = table + indexes + TOAST (+ free space map and visibility map).', 'tổng = bảng + chỉ mục + TOAST (+ bản đồ chỗ trống và bản đồ hiển thị).']],
    giai: `SELECT c.relname AS table_name,
       (SELECT count(*) FROM pg_index i WHERE i.indrelid = c.oid) AS indexes,
       pg_relation_size(c.oid)       AS table_bytes,
       pg_indexes_size(c.oid)        AS index_bytes,
       pg_total_relation_size(c.oid) AS total_bytes
FROM pg_class c
WHERE c.relnamespace = 'public'::regnamespace AND c.relkind = 'r'
ORDER BY total_bytes DESC, table_name;`,
    kiem: [
      kq(['The eight CT Shop tables', 'Tám bảng của CT Shop'], T),
      kqAn(['Two more indexes on orders', 'Thêm hai chỉ mục trên orders'], 'CREATE INDEX ON orders (customer_id); CREATE INDEX ON orders (created_at)', T),
      ma(['Uses pg_total_relation_size', 'Dùng pg_total_relation_size'], 'pg_total_relation_size'),
    ],
    sai: ["SELECT c.relname AS table_name, (SELECT count(*) FROM pg_index i WHERE i.indrelid = c.oid) AS indexes, pg_relation_size(c.oid) AS table_bytes, pg_indexes_size(c.oid) AS index_bytes, pg_relation_size(c.oid) AS total_bytes FROM pg_class c WHERE c.relnamespace = 'public'::regnamespace AND c.relkind = 'r' ORDER BY total_bytes DESC, table_name", "SELECT c.relname AS table_name, (SELECT count(*) FROM pg_index i WHERE i.indrelid = c.oid) AS indexes, pg_relation_size(c.oid) AS table_bytes, pg_indexes_size(c.oid) AS index_bytes, pg_total_relation_size(c.oid) AS total_bytes FROM pg_class c WHERE c.relnamespace = 'public'::regnamespace ORDER BY total_bytes DESC, table_name"],
    gy: [['Every PRIMARY KEY and UNIQUE is an index too.', 'Mọi PRIMARY KEY và UNIQUE cũng là một chỉ mục.'], ['relkind r = ordinary table (i = index, S = sequence, v = view).', 'relkind r = bảng thường (i = chỉ mục, S = sequence, v = view).']],
    lhg: [['Reporting pg_relation_size as "the size" — indexes are often as big as the table.', 'Báo pg_relation_size là "kích thước" — chỉ mục thường to ngang bảng.'], ['Forgetting relkind — indexes and sequences appear as "tables".', 'Quên relkind — chỉ mục và sequence hiện ra như "bảng".']],
    gt: ['<p>Even on tiny tables the indexes outweigh the data: every key brings an index. On the site\'s replica, notes was 41 MB in total for a much smaller heap — always compare total with table size before deciding what is big.</p>', '<p>Ngay cả trên bảng tí hon, chỉ mục nặng hơn dữ liệu: mỗi khoá kéo theo một chỉ mục. Trên bản sao của web, notes tổng cộng 41 MB trong khi phần bảng nhỏ hơn nhiều — luôn so tổng với kích thước bảng trước khi quyết định cái gì là lớn.</p>'],
    tn: [tn('TOAST', 'nơi lưu giá trị lớn ngoài dòng'), tn('pg_total_relation_size', 'tổng dung lượng bảng')],
  }),

  cs({
    t: 'How to approach a schema you did not write', k: 'EASY', p: 6, kn: ['start from a feature', 'follow foreign keys', 'indexes reveal access patterns', 'schema ≠ data'], tag: ['schema'],
    en: '<p>Lesson 16.2 in three questions.</p>', vi: '<p>Bài 16.2 trong ba câu.</p>',
    cau: [
      q('q1', ['You join a team with a 17 000-line schema.prisma. Where do you start?', 'Bạn vào một nhóm có schema.prisma 17 000 dòng. Bắt đầu từ đâu?'], ['a feature you can see, then its table and two hops of foreign keys', 'line 1 of schema.prisma, reading on to the very end', 'the alphabetically first model, then the next one', 'the migration with the oldest timestamp, then forward'], ['File order teaches nothing; features and relations do.', 'Thứ tự trong tệp không dạy gì; tính năng và quan hệ thì có.']),
      q('q2', ['<code>@@index([userId, createdAt])</code> tells you that the app probably…', '<code>@@index([userId, createdAt])</code> cho biết ứng dụng có lẽ…'], ['lists one user\'s rows, newest first', 'sorts all rows by user name', 'deletes old rows nightly', 'counts users per day'], ['Indexes are statements about how the data is read.', 'Chỉ mục là lời khai về cách dữ liệu được đọc.']),
      q('q3', ['Two tables have rows with the same slug although no code path writes both. Most likely…', 'Hai bảng có dòng trùng slug dù không đường mã nào ghi cả hai. Khả năng cao nhất…'], ['a migration or a manual fix copied the data — check the data itself', 'PostgreSQL duplicated the rows during a crash recovery', 'the schema is wrong and has to be redesigned first', 'the ORM caches stale rows and shows them in both places'], ['The schema says what the code can create from now on; the data has its own history. Ask the data.', 'Lược đồ nói mã CÓ THỂ tạo gì từ nay; dữ liệu có lịch sử riêng. Hãy hỏi dữ liệu.']),
    ],
    gy: [['Two hops covers a feature.', 'Hai bước là đủ phủ một tính năng.'], ['Code describes possibility, data describes reality.', 'Mã nói về khả năng, dữ liệu nói về thực tế.']],
    lhg: [['Reading the schema top to bottom.', 'Đọc lược đồ từ đầu tới cuối.'], ['Concluding "impossible" from code alone.', 'Kết luận "không thể" chỉ từ mã.']],
    tn: [tn('access pattern', 'cách truy cập dữ liệu')],
  }),
]);
