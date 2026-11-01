/** PostgreSQL · 10.3 — Thống kê: planner ước lượng thế nào, khi nào sai (cột tương quan ⇒ CREATE STATISTICS). */
import { mod, pg, cs, q, kq, kqAn, sau, ma, PLAN_ALL, pre, tn } from './_chung.mjs';
import { O_EVENT } from './_du-lieu.mjs';

const CUST = `CREATE TABLE customer (id int PRIMARY KEY, city text NOT NULL, region text NOT NULL);
-- 50 cities, each city belongs to exactly ONE of 5 regions ⇒ city determines region (correlated columns)
INSERT INTO customer SELECT g, 'C' || (g % 50), 'R' || (g % 50 % 5) FROM generate_series(1, 20000) g;
ANALYZE customer;
-- grader helpers
${PLAN_ALL}`;
const LD_C = { en: pre('customer (id PK, city, region) — 20 000 rows, 50 cities (400 customers each), 5 regions; every city lies in exactly one region. ANALYZEd.\nplan_rows(q) returns the planner\'s row ESTIMATE for query text q.'), vi: pre('customer (id PK, city, region) — 20 000 dòng, 50 thành phố (mỗi nơi 400 khách), 5 vùng; mỗi thành phố thuộc đúng một vùng. Đã ANALYZE.\nplan_rows(q) trả số dòng ƯỚC LƯỢNG của planner cho truy vấn q.') };
const Q2 = "SELECT * FROM customer WHERE city = ''C7'' AND region = ''R2''";

export default mod('postgresql-10-3-thong-ke-uoc-luong', '10.3 Statistics: how the planner estimates, and when it\'s wrong', [
  pg({
    ...O_EVENT, t: 'Read the statistics ANALYZE collected', k: 'MEDIUM', p: 7, kn: ['pg_stats', 'n_distinct', 'most_common_vals / freqs'], tag: ['statistics'],
    en: '<p>The planner estimates <code>WHERE status = \'pending\'</code> from the statistics in <code>pg_stats</code>. Return <code>n_distinct, most_common_vals, most_common_freqs</code> of column <code>event.status</code> (cast the two arrays to text).</p>',
    vi: '<p>Planner ước lượng <code>WHERE status = \'pending\'</code> từ thống kê trong <code>pg_stats</code>. Trả về <code>n_distinct, most_common_vals, most_common_freqs</code> của cột <code>event.status</code> (ép hai mảng sang text).</p>',
    yc: [['<code>FROM pg_stats WHERE tablename = \'event\' AND attname = \'status\'</code>.', '<code>FROM pg_stats WHERE tablename = \'event\' AND attname = \'status\'</code>.'], ['<code>most_common_vals::text, most_common_freqs::text</code>.', '<code>most_common_vals::text, most_common_freqs::text</code>.']],
    giai: `SELECT n_distinct,
       most_common_vals::text  AS most_common_vals,     -- {active,done,pending}
       most_common_freqs::text AS most_common_freqs     -- {0.66,0.33,0.01}: pending ⇒ 1 % ⇒ ~200 rows
FROM pg_stats
WHERE tablename = 'event' AND attname = 'status';`,
    kiem: [
      kq(['3 values, frequencies 0.66 / 0.33 / 0.01', '3 giá trị, tần suất 0.66 / 0.33 / 0.01']),
      kqAn(['After a bulk insert + ANALYZE the stats change', 'Sau khi chèn lô + ANALYZE, thống kê đổi'], "INSERT INTO event (user_id, status, amount, email, created_at, props) SELECT 1, 'pending', 1, 'bulk' || g || '@x.vn', now(), '{}' FROM generate_series(1, 4000) g; ANALYZE event"),
      ma(['Reads pg_stats', 'Đọc pg_stats'], '\\bpg_stats\\b'),
    ],
    sai: ["SELECT status, count(*) FROM event GROUP BY status"],
    gy: [['pg_stats is a readable view over pg_statistic.', 'pg_stats là view dễ đọc trên pg_statistic.'], ['Selectivity of status = \'pending\' ≈ its most_common_freq (0.01).', 'Độ chọn lọc của status = \'pending\' ≈ most_common_freq của nó (0.01).']],
    lhg: [['Counting the table instead — that is what the planner does NOT do when planning.', 'Đếm cả bảng thay vào đó — đó chính là việc planner KHÔNG làm khi lập kế hoạch.'], ['Expecting fresh numbers after a big change without ANALYZE (autovacuum may not have run yet).', 'Mong số liệu mới ngay sau thay đổi lớn mà không ANALYZE (autovacuum có thể chưa chạy).']],
    gt: ['<p>ANALYZE samples up to 300 × default_statistics_target rows (30 000 by default) and stores, per column, the number of distinct values, the most common values with their frequencies and a histogram. Estimates multiply these selectivities by the table size.</p>', '<p>ANALYZE lấy mẫu tối đa 300 × default_statistics_target dòng (mặc định 30 000) và lưu, cho từng cột, số giá trị khác nhau, các giá trị phổ biến nhất kèm tần suất và một biểu đồ tần suất. Ước lượng = các độ chọn lọc đó nhân với kích thước bảng.</p>'],
    tn: [tn('pg_stats', 'view thống kê cột'), tn('selectivity', 'độ chọn lọc')],
  }),

  pg({
    csdl: CUST, tenCsdl: 'customer', ld: LD_C,
    t: 'Correlated columns: fix the estimate with CREATE STATISTICS', k: 'HARD', p: 12, kn: ['independence assumption', 'CREATE STATISTICS (dependencies)', 'ANALYZE'], tag: ['statistics', 'planner'],
    en: `<p><code>SELECT * FROM customer WHERE city = 'C7' AND region = 'R2'</code> returns 400 rows, but the planner estimates 20 000 × 1/50 × 1/5 = <b>80</b>: it assumes city and region are independent, while city actually determines region. Teach the planner the dependency so the estimate becomes 400.</p>`,
    vi: `<p><code>SELECT * FROM customer WHERE city = 'C7' AND region = 'R2'</code> trả 400 dòng, nhưng planner ước lượng 20 000 × 1/50 × 1/5 = <b>80</b>: nó giả định city và region độc lập, trong khi city quyết định region. Dạy planner về sự phụ thuộc này để ước lượng thành 400.</p>`,
    yc: [['<code>CREATE STATISTICS … (dependencies) ON city, region FROM customer</code>.', '<code>CREATE STATISTICS … (dependencies) ON city, region FROM customer</code>.'], ['Extended statistics are only filled by the next ANALYZE — run it.', 'Thống kê mở rộng chỉ được điền ở lần ANALYZE kế tiếp — hãy chạy nó.']],
    giai: `CREATE STATISTICS st_customer_city_region (dependencies) ON city, region FROM customer;
ANALYZE customer;             -- computes the dependency city ⇒ region`,
    kiem: [
      sau(['The estimate is now 400', 'Ước lượng giờ là 400'], `SELECT plan_rows('${Q2}') AS estimate`),
      sau(['Extended statistics exist', 'Đã có thống kê mở rộng'], "SELECT stxkind::text FROM pg_statistic_ext WHERE stxrelid = 'customer'::regclass"),
      sau(['Another city/region pair is estimated right too', 'Cặp thành phố/vùng khác cũng ước lượng đúng'], "SELECT plan_rows('SELECT * FROM customer WHERE city = ''C33'' AND region = ''R3''') AS estimate", { an: true }),
    ],
    sai: ['CREATE STATISTICS st_customer_city_region (dependencies) ON city, region FROM customer', 'ANALYZE customer'],
    gy: [['The planner multiplies selectivities of separate conditions — wrong when columns are correlated.', 'Planner nhân độ chọn lọc của các điều kiện riêng — sai khi các cột tương quan.'], ['CREATE STATISTICS only declares; ANALYZE computes.', 'CREATE STATISTICS chỉ khai báo; ANALYZE mới tính.']],
    lhg: [['Creating the statistics object and forgetting ANALYZE — the estimate stays 80.', 'Tạo đối tượng thống kê mà quên ANALYZE — ước lượng vẫn là 80.'], ['Running ANALYZE alone — per-column statistics cannot express the dependency.', 'Chỉ chạy ANALYZE — thống kê theo từng cột không diễn đạt được sự phụ thuộc.']],
    gt: ['<p>A 5× under-estimate is enough to push the planner into nested loops meant for few rows. Functional-dependency statistics tell it that region adds no selectivity once city is known, so the estimate matches reality.</p>', '<p>Ước lượng thấp 5 lần đủ đẩy planner vào vòng lặp lồng dành cho ít dòng. Thống kê phụ thuộc hàm cho nó biết region không thêm độ chọn lọc khi đã biết city, nên ước lượng khớp thực tế.</p>'],
    tn: [tn('extended statistics', 'thống kê mở rộng'), tn('functional dependency', 'phụ thuộc hàm')],
  }),

  cs({
    t: 'When estimates go wrong', k: 'MEDIUM', p: 5, kn: ['stale statistics', 'correlation', 'functions'], tag: ['statistics'],
    en: '<p>Pick the most likely cause and the right fix.</p>', vi: '<p>Chọn nguyên nhân khả dĩ nhất và cách sửa đúng.</p>',
    cau: [
      q('q1', ['Right after importing 2 million rows, a query on the new rows estimates 1 row and runs a slow nested loop.', 'Ngay sau khi nhập 2 triệu dòng, một truy vấn trên dòng mới ước lượng 1 dòng và chạy vòng lặp lồng chậm.'], ['stale statistics: run ANALYZE after the import', 'bloat: the table needs a VACUUM FULL first', 'memory: work_mem is too small for the join', 'corruption: the index must be rebuilt'], ['Autovacuum\'s ANALYZE may not have run yet; a bulk import should end with an explicit ANALYZE.', 'ANALYZE của autovacuum có thể chưa chạy; nhập lô xong nên ANALYZE tường minh.']),
      q('q2', ['<code>WHERE lower(email) = \'x\'</code> is estimated at 0.5 % of rows no matter what.', '<code>WHERE lower(email) = \'x\'</code> luôn được ước lượng 0.5 % số dòng.'], ['no stats on the expression: add an expression index or statistics', 'lower() cannot be estimated, so it is always 0.5 %', 'text columns never get any statistics', 'the planner refuses to estimate any function call'], ['Without stats the planner uses a default selectivity. ANALYZE collects stats for indexed expressions and for CREATE STATISTICS on expressions (PG 14+).', 'Không có thống kê thì planner dùng độ chọn lọc mặc định. ANALYZE thu thống kê cho biểu thức có chỉ mục và cho CREATE STATISTICS trên biểu thức (PG 14+).']),
      q('q3', ['A column has 10 000 distinct values but the histogram is coarse and estimates for rare values are off.', 'Một cột có 10 000 giá trị khác nhau nhưng biểu đồ thô và ước lượng cho giá trị hiếm bị lệch.'], ['raise the column statistics target, then ANALYZE', 'drop and re-create the column with a new type', 'add more RAM so the planner sees more rows', 'turn off enable_seqscan for the whole server'], ['A larger target keeps more most-common values and histogram buckets, at the cost of a slower ANALYZE.', 'Mục tiêu lớn hơn giữ nhiều giá trị phổ biến và ô biểu đồ hơn, đổi lại ANALYZE chậm hơn.']),
    ],
    gy: [['Compare estimate and actual first; then ask where the estimate came from.', 'So ước lượng với thực tế trước; rồi hỏi ước lượng đến từ đâu.'], ['Statistics are per column unless you create extended statistics.', 'Thống kê theo từng cột trừ khi bạn tạo thống kê mở rộng.']],
    lhg: [['Fixing a bad estimate with enable_* switches in production.', 'Sửa ước lượng sai bằng công tắc enable_* trên production.'], ['Forgetting ANALYZE after large data changes.', 'Quên ANALYZE sau thay đổi dữ liệu lớn.']],
    tn: [tn('statistics target', 'mức chi tiết thống kê')],
  }),
]);
