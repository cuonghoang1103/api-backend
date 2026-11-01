/**
 * PostgreSQL · 15.4 — Phân mảnh (partitioning). Chạy THẬT trên PGlite: khai RANGE, định tuyến (tableoid), partition pruning
 * (chấm bằng kế hoạch thật qua plan_nodes trên một VIEW người học viết), DROP/DETACH/DEFAULT cho thời hạn giữ dữ liệu.
 * Dữ liệu: 368 sự kiện tất định, mỗi 6 giờ từ 01/06 tới 31/08/2026 (+07): tháng 6 = 120, tháng 7 = 124, tháng 8 = 124.
 */
import { mod, pg, cs, q, qn, kq, sau, chan, ma, PLAN_ALL, pre, tn } from './_chung.mjs';

const TZ = "SET TimeZone = 'Asia/Ho_Chi_Minh';";
const SU_KIEN = "INSERT INTO event_p (luc, payload) SELECT g, 'p' || (extract(epoch FROM g)::bigint / 21600 % 97) FROM generate_series(timestamptz '2026-06-01 00:00+07', '2026-08-31 18:00+07', interval '6 hours') g;";
const KHAI = `CREATE TABLE event_p (
  id      bigint GENERATED ALWAYS AS IDENTITY,
  luc     timestamptz NOT NULL,
  payload text NOT NULL
) PARTITION BY RANGE (luc);
CREATE TABLE event_p_2026_06 PARTITION OF event_p FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE event_p_2026_07 PARTITION OF event_p FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE event_p_2026_08 PARTITION OF event_p FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');`;
const NEN = `${TZ}\n${KHAI}\n${SU_KIEN}\nANALYZE event_p;\n${PLAN_ALL}`;
const LD = { en: `<h4>Partitioned table (lesson 15.4)</h4>${pre(`event_p (id identity, luc timestamptz, payload text) PARTITION BY RANGE (luc)
  event_p_2026_06  [2026-06-01, 2026-07-01)   120 rows
  event_p_2026_07  [2026-07-01, 2026-08-01)   124 rows
  event_p_2026_08  [2026-08-01, 2026-09-01)   124 rows      -- one event every 6 hours, TimeZone Asia/Ho_Chi_Minh`)}`, vi: `<h4>Bảng phân mảnh (bài 15.4)</h4>${pre(`event_p (id identity, luc timestamptz, payload text) PARTITION BY RANGE (luc)
  event_p_2026_06  [2026-06-01, 2026-07-01)   120 dòng
  event_p_2026_07  [2026-07-01, 2026-08-01)   124 dòng
  event_p_2026_08  [2026-08-01, 2026-09-01)   124 dòng      -- mỗi 6 giờ một sự kiện, TimeZone Asia/Ho_Chi_Minh`)}` };
const PHAN = "SELECT tableoid::regclass::text AS partition, count(*) AS n, min(luc)::date AS first_day, max(luc)::date AS last_day FROM event_p GROUP BY 1 ORDER BY 1";
const CAC_MANH = "SELECT c.relname, pg_get_expr(c.relpartbound, c.oid) AS bound FROM pg_inherits i JOIN pg_class c ON c.oid = i.inhrelid WHERE i.inhparent = 'event_p'::regclass ORDER BY c.relname";

export default mod('postgresql-15-4-phan-manh', '15.4 Partitioning: splitting a table without splitting the queries', [
  pg({
    csdl: TZ, tenCsdl: 'events', ld: null,
    t: 'Declare a RANGE-partitioned table and let PostgreSQL route the rows', k: 'MEDIUM', p: 12, kn: ['PARTITION BY RANGE', 'FOR VALUES FROM … TO … (upper bound exclusive)', 'tableoid', 'index on the parent'], tag: ['partitioning'],
    en: '<p>Create <code>event_p (id bigint GENERATED ALWAYS AS IDENTITY, luc timestamptz NOT NULL, payload text NOT NULL)</code> partitioned by RANGE on <code>luc</code>, with three monthly partitions <code>event_p_2026_06</code>, <code>event_p_2026_07</code>, <code>event_p_2026_08</code> (June, July, August 2026, local time), and an index on <code>luc</code> created on the parent.</p>',
    vi: '<p>Tạo <code>event_p (id bigint GENERATED ALWAYS AS IDENTITY, luc timestamptz NOT NULL, payload text NOT NULL)</code> phân mảnh RANGE theo <code>luc</code>, với ba mảnh theo tháng <code>event_p_2026_06</code>, <code>event_p_2026_07</code>, <code>event_p_2026_08</code> (tháng 6, 7, 8 năm 2026, giờ địa phương), và một chỉ mục trên <code>luc</code> tạo ở bảng cha.</p>',
    yc: [['<code>FOR VALUES FROM (\'2026-06-01\') TO (\'2026-07-01\')</code> — the upper bound is exclusive, so months chain without gaps.', '<code>FOR VALUES FROM (\'2026-06-01\') TO (\'2026-07-01\')</code> — cận trên không bao gồm, nên các tháng nối nhau không hở.'], ['<code>CREATE INDEX ON event_p (luc)</code> creates it on every partition, including future ones.', '<code>CREATE INDEX ON event_p (luc)</code> tạo nó trên mọi mảnh, kể cả mảnh thêm sau.']],
    giai: `${KHAI}
CREATE INDEX event_p_luc_idx ON event_p (luc);      -- propagated to every partition`,
    kiem: [
      sau(['368 events land in their month', '368 sự kiện rơi vào đúng tháng'], `${SU_KIEN} ${PHAN}`, { thuTu: true }),
      sau(['Midnight of 1 July goes to July, 23:59 of 30 June to June', 'Nửa đêm 1/7 vào tháng 7, 23:59 ngày 30/6 vào tháng 6'], "INSERT INTO event_p (luc, payload) VALUES ('2026-07-01 00:00+07', 'a'), ('2026-06-30 23:59+07', 'b'); SELECT payload, tableoid::regclass::text AS partition FROM event_p ORDER BY payload", { thuTu: true }),
      chan(['A September event has no partition yet', 'Sự kiện tháng 9 chưa có mảnh'], "INSERT INTO event_p (luc, payload) VALUES ('2026-09-05 10:00+07', 'x')", '23514'),
      sau(['Every partition got the luc index', 'Mọi mảnh đều có chỉ mục luc'], "SELECT tablename FROM pg_indexes WHERE tablename LIKE 'event_p_2026_%' AND indexdef LIKE '%(luc)%' ORDER BY tablename", { thuTu: true, an: true }),
    ],
    sai: [
      KHAI.replace("TO ('2026-07-01')", "TO ('2026-06-30')").replace("FROM ('2026-07-01')", "FROM ('2026-06-30')") + '\nCREATE INDEX event_p_luc_idx ON event_p (luc);',
      KHAI,
    ],
    gy: [['tableoid::regclass names the physical table a row came from.', 'tableoid::regclass cho biết dòng đến từ bảng vật lý nào.'], ['Bounds are compared in the session time zone — the grader uses Asia/Ho_Chi_Minh.', 'Cận được so theo múi giờ của phiên — máy chấm dùng Asia/Ho_Chi_Minh.']],
    lhg: [['TO (\'2026-06-30\') — the whole of 30 June has no home.', 'TO (\'2026-06-30\') — cả ngày 30/6 không có chỗ.'], ['A PRIMARY KEY (id) on the parent — refused: it must include the partition key, e.g. (id, luc).', 'PRIMARY KEY (id) trên bảng cha — bị từ chối: nó phải gồm khoá phân mảnh, vd. (id, luc).']],
    gt: ['<p>The INSERT names only event_p; PostgreSQL routes each row by luc. A row outside every range raises <code>no partition of relation … found for row</code> (23514) — create partitions ahead of time, or add a DEFAULT one.</p>', '<p>Lệnh INSERT chỉ gọi event_p; PostgreSQL định tuyến từng dòng theo luc. Dòng nằm ngoài mọi khoảng báo <code>no partition of relation … found for row</code> (23514) — hãy tạo mảnh trước, hoặc thêm một mảnh DEFAULT.</p>'],
    tn: [tn('partition', 'mảnh'), tn('partition key', 'khoá phân mảnh')],
  }),

  pg({
    csdl: NEN, tenCsdl: 'events', ld: LD,
    t: 'Partition pruning: write the filter the planner can use', k: 'HARD', p: 12, kn: ['partition pruning', 'range predicate on the key', 'functions on the key defeat pruning'], tag: ['partitioning', 'explain'],
    en: '<p>Create the view <code>august_count</code> returning one column <code>n</code> = the number of events in August 2026, written so that the planner reads <b>only</b> <code>event_p_2026_08</code> (the check looks at the real plan of <code>SELECT * FROM august_count</code>).</p>',
    vi: '<p>Tạo view <code>august_count</code> trả về một cột <code>n</code> = số sự kiện trong tháng 8/2026, viết sao cho planner <b>chỉ</b> đọc <code>event_p_2026_08</code> (phép kiểm xem kế hoạch thật của <code>SELECT * FROM august_count</code>).</p>',
    yc: [["<code>WHERE luc &gt;= '2026-08-01' AND luc &lt; '2026-09-01'</code> — compare the key itself with constants.", "<code>WHERE luc &gt;= '2026-08-01' AND luc &lt; '2026-09-01'</code> — so chính khoá với hằng số."], ['Half-open range: no BETWEEN with an end-of-month date.', 'Khoảng nửa mở: không BETWEEN với ngày cuối tháng.']],
    giai: `CREATE VIEW august_count AS
SELECT count(*) AS n
FROM event_p
WHERE luc >= '2026-08-01' AND luc < '2026-09-01';     -- the planner proves June and July cannot match`,
    kiem: [
      sau(['124 events in August', '124 sự kiện trong tháng 8'], 'SELECT * FROM august_count'),
      sau(['Only the August partition is in the plan', 'Chỉ mảnh tháng 8 có trong kế hoạch'], "SELECT plan_text('SELECT * FROM august_count') ~ 'event_p_2026_08' AS reads_august, plan_text('SELECT * FROM august_count') ~ 'event_p_2026_0[67]' AS reads_june_or_july"),
      sau(['Still correct after a late event on 31 August', 'Vẫn đúng sau một sự kiện muộn ngày 31/8'], "INSERT INTO event_p (luc, payload) VALUES ('2026-08-31 23:30+07', 'late'), ('2026-09-01 00:00+07', 'x'); SELECT * FROM august_count", { an: true, themCsdl: "CREATE TABLE event_p_2026_09 PARTITION OF event_p FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');" }),
    ],
    sai: [
      "CREATE VIEW august_count AS SELECT count(*) AS n FROM event_p WHERE date_trunc('month', luc) = '2026-08-01'",
      "CREATE VIEW august_count AS SELECT count(*) AS n FROM event_p WHERE luc BETWEEN '2026-08-01' AND '2026-08-31'",
      "CREATE VIEW august_count AS SELECT count(*) AS n FROM event_p WHERE extract(month FROM luc) = 8",
    ],
    gy: [['Pruning works when the WHERE compares the partition key with values known at plan time.', 'Pruning hoạt động khi WHERE so khoá phân mảnh với giá trị biết được lúc lập kế hoạch.'], ['Look at the plan yourself: <code>EXPLAIN SELECT * FROM august_count</code>.', 'Tự xem kế hoạch: <code>EXPLAIN SELECT * FROM august_count</code>.']],
    lhg: [['date_trunc(\'month\', luc) / extract(month …) — correct count, but every partition is scanned.', 'date_trunc(\'month\', luc) / extract(month …) — đếm đúng, nhưng mọi mảnh đều bị quét.'], ['BETWEEN \'2026-08-01\' AND \'2026-08-31\' — stops at midnight of the 31st.', 'BETWEEN \'2026-08-01\' AND \'2026-08-31\' — dừng ở nửa đêm ngày 31.']],
    gt: ['<p>With a range predicate on luc the plan has a single scan on event_p_2026_08 — two thirds of the data are never touched. Wrap the key in a function and the planner can no longer prove anything, so it scans all partitions (an Append over three).</p>', '<p>Với điều kiện khoảng trên luc, kế hoạch chỉ có một lượt quét event_p_2026_08 — hai phần ba dữ liệu không bao giờ bị chạm. Bọc khoá trong một hàm thì planner không chứng minh được gì nữa, nên nó quét mọi mảnh (một Append trên ba mảnh).</p>'],
    tn: [tn('partition pruning', 'loại mảnh'), tn('Append', 'nút nối kết quả nhiều mảnh')],
  }),

  pg({
    csdl: NEN, tenCsdl: 'events', ld: LD,
    t: 'Retention by DROP, an archive by DETACH, and a safety net', k: 'HARD', p: 12, kn: ['DROP a partition vs DELETE', 'DETACH PARTITION', 'DEFAULT partition', 'creating partitions ahead'], tag: ['partitioning', 'retention'],
    en: '<p>The retention policy keeps two months online. (1) Remove June instantly. (2) Detach July and rename it <code>event_archive_2026_07</code> (it will be dumped, then dropped). (3) Create <code>event_p_2026_09</code> for September ahead of time. (4) Add <code>event_p_default</code> as a DEFAULT partition, so an unexpected date never fails an insert.</p>',
    vi: '<p>Chính sách lưu giữ giữ hai tháng trên hệ thống. (1) Bỏ tháng 6 ngay lập tức. (2) Tách tháng 7 ra và đổi tên thành <code>event_archive_2026_07</code> (sẽ được dump rồi xoá). (3) Tạo trước <code>event_p_2026_09</code> cho tháng 9. (4) Thêm <code>event_p_default</code> làm mảnh DEFAULT, để một ngày bất ngờ không bao giờ làm hỏng lệnh chèn.</p>',
    yc: [['<code>DROP TABLE event_p_2026_06</code> — not DELETE: no dead rows, space returned at once.', '<code>DROP TABLE event_p_2026_06</code> — không DELETE: không dòng chết, trả chỗ ngay.'], ['<code>ALTER TABLE event_p DETACH PARTITION event_p_2026_07</code> keeps its rows as a standalone table.', '<code>ALTER TABLE event_p DETACH PARTITION event_p_2026_07</code> giữ các dòng thành một bảng độc lập.']],
    giai: `DROP TABLE event_p_2026_06;                                         -- 4.5 ms vs 34.9 ms for DELETE, and 0 dead rows
ALTER TABLE event_p DETACH PARTITION event_p_2026_07;
ALTER TABLE event_p_2026_07 RENAME TO event_archive_2026_07;
CREATE TABLE event_p_2026_09 PARTITION OF event_p FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE event_p_default PARTITION OF event_p DEFAULT;`,
    kiem: [
      sau(['The partitions of event_p now', 'Các mảnh của event_p bây giờ'], CAC_MANH, { thuTu: true }),
      sau(['Rows online and in the archive', 'Số dòng trên hệ thống và trong kho lưu'], 'SELECT (SELECT count(*) FROM event_p) AS online, (SELECT count(*) FROM event_archive_2026_07) AS archived'),
      sau(['September and an odd date both find a home', 'Tháng 9 và một ngày lạ đều có chỗ'], "INSERT INTO event_p (luc, payload) VALUES ('2026-09-05 10:00+07', 'sep'), ('2027-01-01 00:00+07', 'odd'); SELECT payload, tableoid::regclass::text AS partition FROM event_p WHERE payload IN ('sep', 'odd') ORDER BY payload", { thuTu: true }),
      ma(['Drops, does not DELETE', 'DROP, không DELETE'], '\\bDELETE\\s+FROM\\b', true),
    ],
    sai: [
      "DELETE FROM event_p WHERE luc < '2026-07-01'; ALTER TABLE event_p DETACH PARTITION event_p_2026_07; ALTER TABLE event_p_2026_07 RENAME TO event_archive_2026_07; CREATE TABLE event_p_2026_09 PARTITION OF event_p FOR VALUES FROM ('2026-09-01') TO ('2026-10-01'); CREATE TABLE event_p_default PARTITION OF event_p DEFAULT;",
      "DROP TABLE event_p_2026_06; DROP TABLE event_p_2026_07; CREATE TABLE event_p_2026_09 PARTITION OF event_p FOR VALUES FROM ('2026-09-01') TO ('2026-10-01'); CREATE TABLE event_p_default PARTITION OF event_p DEFAULT;",
      "DROP TABLE event_p_2026_06; ALTER TABLE event_p DETACH PARTITION event_p_2026_07; ALTER TABLE event_p_2026_07 RENAME TO event_archive_2026_07; CREATE TABLE event_p_default PARTITION OF event_p DEFAULT;",
    ],
    gy: [['Order matters: create September BEFORE the default partition — a DEFAULT holding September rows would block it.', 'Thứ tự quan trọng: tạo tháng 9 TRƯỚC mảnh default — default đang chứa dòng tháng 9 sẽ chặn việc đó.'], ['pg_get_expr(relpartbound, oid) prints the bounds of each partition.', 'pg_get_expr(relpartbound, oid) in ra cận của từng mảnh.']],
    lhg: [['DELETE for retention — tens of thousands of dead rows, a file that does not shrink, and vacuum work (14.3).', 'DELETE để dọn dữ liệu cũ — hàng vạn dòng chết, tệp không co lại, và việc cho vacuum (14.3).'], ['Relying on the DEFAULT partition forever — rows pile up there and later block creating the right partition.', 'Dựa mãi vào mảnh DEFAULT — dòng dồn ở đó và về sau chặn việc tạo đúng mảnh.']],
    gt: ['<p>This is the real case for partitioning: retention becomes DROP (instant, no dead tuples) or DETACH (keep the rows, archive them, drop later). Partitions should be created ahead (cron or pg_partman); the DEFAULT partition is only a safety net to watch.</p>', '<p>Đây là lý lẽ thật của phân mảnh: dọn dữ liệu cũ thành DROP (tức thì, không dòng chết) hoặc DETACH (giữ dòng, lưu trữ, xoá sau). Mảnh nên được tạo trước (cron hoặc pg_partman); mảnh DEFAULT chỉ là lưới an toàn cần theo dõi.</p>'],
    tn: [tn('DETACH PARTITION', 'tách mảnh'), tn('retention', 'thời hạn lưu giữ')],
  }),

  cs({
    t: 'When to partition, and which kind', k: 'EASY', p: 6, kn: ['RANGE / LIST / HASH', 'primary key includes the key', 'cost of partitioning'], tag: ['partitioning'],
    en: '<p>Lesson 15.4 in four questions.</p>', vi: '<p>Bài 15.4 trong bốn câu.</p>',
    cau: [
      q('q1', ['What is the strongest reason to partition an events table by month?', 'Lý do mạnh nhất để phân mảnh bảng sự kiện theo tháng là gì?'], ['a retention policy: old data leaves by DROP instead of DELETE', 'every query becomes faster automatically', 'it removes the need for indexes', 'it lets replicas accept writes'], ['Pruning helps queries that filter on the key; the decisive win is cheap, clean deletion.', 'Pruning giúp truy vấn lọc theo khoá; cái lợi quyết định là xoá rẻ và sạch.']),
      q('q2', ['Why does <code>PRIMARY KEY (id)</code> fail on a table partitioned by luc?', 'Vì sao <code>PRIMARY KEY (id)</code> thất bại trên bảng phân mảnh theo luc?'], ['uniqueness is enforced per partition, so the key must include luc', 'identity columns can never be part of a primary key', 'partitioned tables cannot have any key at all', 'the id column would have to be of type text'], ['Use PRIMARY KEY (id, luc), or no PK on the parent.', 'Dùng PRIMARY KEY (id, luc), hoặc không đặt PK ở bảng cha.']),
      q('q3', ['Tenants are a fixed set of 12 regions. Which kind of partitioning?', 'Khách thuê là 12 vùng cố định. Kiểu phân mảnh nào?'], ['LIST (region)', 'RANGE (region)', 'HASH (created_at)', 'no partitioning is possible'], ['LIST for a fixed set of values, RANGE for time, HASH to spread evenly without natural groups.', 'LIST cho tập giá trị cố định, RANGE cho thời gian, HASH để chia đều khi không có nhóm tự nhiên.']),
      qn('q4', ['Which are real costs of partitioning? (choose all)', 'Đâu là chi phí thật của phân mảnh? (chọn tất cả)'], ['planning time grows with the number of partitions', 'queries not filtering on the key touch every partition', 'partitions must be created ahead of time', 'the table can no longer be queried by its name'], [0, 1, 2], ['The parent name keeps working for every query — that is the point. Below tens of millions of rows the costs usually outweigh the gains.', 'Tên bảng cha vẫn dùng được cho mọi truy vấn — đó chính là mục đích. Dưới vài chục triệu dòng, chi phí thường lớn hơn lợi ích.']),
    ],
    gy: [['Think operations (retention) before speed.', 'Nghĩ tới vận hành (lưu giữ) trước tốc độ.'], ['Every unique constraint must contain the partition key.', 'Mọi ràng buộc unique phải chứa khoá phân mảnh.']],
    lhg: [['Partitioning a 2-million-row table "for performance".', 'Phân mảnh bảng 2 triệu dòng "cho nhanh".'], ['RANGE on a column with a handful of fixed values.', 'RANGE trên cột chỉ có vài giá trị cố định.']],
    tn: [tn('LIST / HASH partitioning', 'phân mảnh theo danh sách / băm')],
  }),
]);
