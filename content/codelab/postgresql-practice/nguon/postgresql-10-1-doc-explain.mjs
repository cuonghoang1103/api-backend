/** PostgreSQL · 10.1 — Đọc một plan: EXPLAIN vs EXPLAIN ANALYZE, đọc từ trong ra ngoài, Rows Removed by Filter. */
import { mod, pg, cs, ord, q, kq, sau, ma, pre, TN, tn } from './_chung.mjs';
import { O_EVENT } from './_du-lieu.mjs';

const lit = (s) => s.replace(/'/g, "''");
const Q_P = "SELECT * FROM event WHERE status = 'pending'";

export default mod('postgresql-10-1-doc-explain', '10.1 Reading a plan: EXPLAIN vs EXPLAIN ANALYZE', [
  cs({
    t: 'Read a plan from the inside out', k: 'EASY', p: 6, loai: 'order', kn: ['plan tree', 'execution order'], tag: ['explain'],
    en: `<p>Order the nodes of this plan in the order rows start flowing (the innermost, most indented node produces rows first):</p>${pre(`Limit
  ->  Sort
        Sort Key: (sum(e.amount)) DESC
        ->  HashAggregate
              Group Key: u.country
              ->  Hash Join
                    Hash Cond: (e.user_id = u.id)
                    ->  Seq Scan on event e
                    ->  Hash
                          ->  Seq Scan on users u`)}`,
    vi: `<p>Sắp các nút của kế hoạch này theo thứ tự dòng bắt đầu chảy (nút trong cùng, thụt sâu nhất, sinh dòng trước):</p>${pre(`Limit
  ->  Sort
        Sort Key: (sum(e.amount)) DESC
        ->  HashAggregate
              Group Key: u.country
              ->  Hash Join
                    Hash Cond: (e.user_id = u.id)
                    ->  Seq Scan on event e
                    ->  Hash
                          ->  Seq Scan on users u`)}`,
    cau: [ord('o1', ['From the leaves to the root', 'Từ lá lên gốc'], [
      'Seq Scan on users u, loaded into the Hash / đọc users vào bảng băm',
      'Seq Scan on event e, each row probes the hash / đọc event, mỗi dòng dò bảng băm',
      'Hash Join emits matching pairs / Hash Join phát ra các cặp khớp',
      'HashAggregate sums per country / HashAggregate cộng theo quốc gia',
      'Sort by the sum / Sort theo tổng',
      'Limit cuts the first rows / Limit cắt các dòng đầu',
    ], ['A Hash Join first builds its hash table from the inner (Hash) child, then streams the outer child through it. Every parent consumes its children\'s output; the top node is the last to finish.', 'Hash Join dựng bảng băm từ con bên trong (Hash) trước, rồi cho con bên ngoài chảy qua. Mỗi nút cha tiêu thụ output của con; nút trên cùng xong sau cùng.'])],
    gy: [['Indentation = depth; deeper nodes feed shallower ones.', 'Thụt lề = độ sâu; nút sâu hơn cấp dữ liệu cho nút nông hơn.'], ['The Hash child of a Hash Join is built before the join emits anything.', 'Nút Hash của Hash Join được dựng xong trước khi phép nối phát dòng nào.']],
    lhg: [['Reading the plan top-down like code.', 'Đọc kế hoạch từ trên xuống như đọc mã.'], ['Thinking the outer Seq Scan runs before the hash table is built.', 'Nghĩ rằng Seq Scan bên ngoài chạy trước khi bảng băm được dựng.']],
    tn: [tn('plan node', 'nút kế hoạch')],
  }),

  pg({
    ...O_EVENT, t: 'EXPLAIN ANALYZE: how many rows did the filter throw away?', k: 'MEDIUM', p: 6, kn: ['EXPLAIN ANALYZE', 'actual rows', 'Rows Removed by Filter'], tag: ['explain'],
    en: `<p>Run <code>${Q_P}</code> under <code>EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)</code> — the options remove every number that changes between runs, so the output is exactly comparable. Your script\'s last statement is that EXPLAIN.</p>`,
    vi: `<p>Chạy <code>${Q_P}</code> dưới <code>EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)</code> — các tuỳ chọn này bỏ mọi con số thay đổi giữa các lần chạy, nên output so khớp được tuyệt đối. Câu cuối trong script là lệnh EXPLAIN đó.</p>`,
    yc: [['All five options, in any order.', 'Đủ năm tuỳ chọn, thứ tự tuỳ ý.'], ['Read the line <code>Rows Removed by Filter</code> — that is wasted work.', 'Đọc dòng <code>Rows Removed by Filter</code> — đó là công sức bỏ phí.']],
    giai: `EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF)
SELECT * FROM event WHERE status = 'pending';
-- Seq Scan on event (actual rows=200.00 loops=1)
--   Filter: (status = 'pending'::text)
--   Rows Removed by Filter: 19800        ← read 20 000 rows to keep 200`,
    kiem: [
      kq(['200 rows kept, 19 800 removed', 'Giữ 200 dòng, bỏ 19 800'], { thuTu: true }),
      ma(['EXPLAIN with ANALYZE', 'EXPLAIN có ANALYZE'], 'EXPLAIN\\s*\\([^)]*ANALY[SZ]E'),
      ma(['Timing switched off', 'Đã tắt đo thời gian'], 'TIMING\\s+OFF'),
    ],
    sai: [`EXPLAIN (COSTS OFF) ${Q_P}`, `EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF) SELECT * FROM event WHERE status = 'done'`],
    gy: [['ANALYZE executes the query and adds actual rows/loops to every node.', 'ANALYZE chạy thật truy vấn và thêm số dòng/vòng thực tế vào mọi nút.'], ['PostgreSQL 18 prints actual rows with two decimals (an average per loop).', 'PostgreSQL 18 in số dòng thực tế kèm hai chữ số thập phân (trung bình mỗi vòng lặp).']],
    lhg: [['Plain EXPLAIN — no actual numbers, no "Rows Removed by Filter".', 'EXPLAIN thường — không có số thực tế, không có "Rows Removed by Filter".'], ['Leaving TIMING and BUFFERS on when comparing plans — the numbers differ on every run.', 'Để TIMING và BUFFERS bật khi so kế hoạch — số liệu khác nhau mỗi lần chạy.']],
    gt: ['<p>"Rows Removed by Filter: 19800" for 200 kept rows is the classic signature of a missing (or unusable) index: 99 % of the work is reading rows only to throw them away. The next exercise fixes it.</p>', '<p>"Rows Removed by Filter: 19800" cho 200 dòng được giữ là dấu hiệu kinh điển của chỉ mục bị thiếu (hoặc không dùng được): 99 % công sức là đọc dòng để rồi vứt đi. Bài sau sửa nó.</p>'],
    tn: [TN.explain, tn('Rows Removed by Filter', 'số dòng bị bộ lọc loại')],
  }),

  pg({
    ...O_EVENT, t: 'Remove the wasted work you just measured', k: 'HARD', p: 10, kn: ['diagnose from EXPLAIN ANALYZE', 'targeted index'], tag: ['explain', 'index'],
    en: `<p>Make <code>${Q_P}</code> stop discarding rows: after your change, <code>EXPLAIN ANALYZE</code> of that query must contain no <code>Rows Removed by Filter</code> and still return the 200 pending events. Choose the smallest index that does it.</p>`,
    vi: `<p>Làm cho <code>${Q_P}</code> thôi vứt dòng: sau thay đổi của bạn, <code>EXPLAIN ANALYZE</code> của truy vấn đó không còn dòng <code>Rows Removed by Filter</code> và vẫn trả 200 sự kiện pending. Chọn chỉ mục nhỏ nhất làm được.</p>`,
    yc: [['One CREATE INDEX (a partial one is the smallest).', 'Một lệnh CREATE INDEX (chỉ mục từng phần là nhỏ nhất).'], ['Do not change the query.', 'Không đổi truy vấn.']],
    giai: `CREATE INDEX idx_event_pending ON event (status) WHERE status = 'pending';
-- or (created_at) WHERE status = 'pending' (see 9.3); a full index on status works too, 100 times bigger`,
    kiem: [
      sau(['No row is read only to be discarded', 'Không dòng nào bị đọc chỉ để vứt đi'], `SELECT plan_analyze('${lit(Q_P)}') !~ 'Rows Removed by Filter' AS no_waste, plan_analyze('${lit(Q_P)}') ~ 'actual rows=200' AS still_200`),
      sau(['Still 200 rows', 'Vẫn 200 dòng'], `SELECT count(*) AS pending FROM event WHERE status = 'pending'`),
      sau(['A small index', 'Một chỉ mục nhỏ'], "SELECT bool_and(pg_relation_size(i.indexrelid) < 100000) AS small FROM pg_index i WHERE i.indrelid = 'event'::regclass AND NOT i.indisprimary", { an: true }),
    ],
    sai: ["CREATE INDEX idx_event_status ON event (status)", "CREATE INDEX idx_event_created ON event (created_at)"],
    gy: [['The Filter line names the column and value to index.', 'Dòng Filter nêu cột và giá trị cần đánh chỉ mục.'], ['Only 1 % of rows match: a partial index on exactly that predicate is tiny.', 'Chỉ 1 % dòng khớp: chỉ mục từng phần trên đúng điều kiện đó rất nhỏ.']],
    lhg: [['A full index on status (all 20 000 entries) — it works, but is ~100× bigger than needed.', 'Chỉ mục đầy đủ trên status (đủ 20 000 mục) — chạy được, nhưng lớn hơn cần thiết khoảng 100 lần.'], ['Indexing a column that is not in the filter.', 'Đánh chỉ mục cột không có trong bộ lọc.']],
    gt: ['<p>The workflow of chapter 10: measure with EXPLAIN ANALYZE, find the node that does the most useless work, fix that node, measure again. Here the fix turns "Seq Scan + Filter (19 800 removed)" into an index scan that touches only the 200 rows needed.</p>', '<p>Quy trình của chương 10: đo bằng EXPLAIN ANALYZE, tìm nút làm nhiều việc vô ích nhất, sửa nút đó, đo lại. Ở đây cách sửa biến "Seq Scan + Filter (bỏ 19 800)" thành quét chỉ mục chỉ chạm 200 dòng cần thiết.</p>'],
    tn: [TN.explain, TN.index],
  }),

  cs({
    t: 'Estimate, actual, loops: what the numbers mean', k: 'MEDIUM', p: 5, kn: ['rows estimate', 'actual rows × loops'], tag: ['explain'],
    en: '<p>Interpret these fragments of EXPLAIN ANALYZE output.</p>', vi: '<p>Diễn giải các mẩu output EXPLAIN ANALYZE sau.</p>',
    cau: [
      q('q1', ['<code>Index Scan using users_pkey on users u (actual rows=1.00 loops=200)</code> — how many rows did this node return in total?', '<code>Index Scan using users_pkey on users u (actual rows=1.00 loops=200)</code> — nút này trả tổng cộng bao nhiêu dòng?'], ['200 — 1 row per loop × 200 loops', '1 — the node ran a single time', '201 — loops plus one returned row', '0 — the .00 means nothing matched'], ['Inside a Nested Loop the inner node runs once per outer row; "actual rows" is per execution.', 'Trong Nested Loop, nút bên trong chạy một lần cho mỗi dòng ngoài; "actual rows" tính cho mỗi lần chạy.']),
      q('q2', ['<code>Seq Scan on event (rows=200) (actual rows=200.00 loops=1)</code> — is the estimate good?', '<code>Seq Scan on event (rows=200) (actual rows=200.00 loops=1)</code> — ước lượng có tốt không?'], ['yes — estimate and actual match, the statistics are fine', 'no — the seq scan proves the stats are wrong', 'cannot tell without BUFFERS', 'no — estimates are always too low'], ['Good estimates are the first thing to check. A Seq Scan can still be the right plan.', 'Ước lượng tốt là thứ cần kiểm đầu tiên. Seq Scan vẫn có thể là kế hoạch đúng.']),
      q('q3', ['<code>Sort Method: external merge  Disk: 928kB</code> means…', '<code>Sort Method: external merge  Disk: 928kB</code> nghĩa là…'], ['the sort did not fit in work_mem and spilled to temporary files', 'the table is stored on disk', 'the sort used an index', 'the query read 928 kB from the table'], ['External merge = sort in chunks on disk. Raising work_mem (for that session or query) or sorting fewer rows fixes it — lesson 10.4.', 'External merge = sắp theo từng khúc trên đĩa. Tăng work_mem (cho phiên hay truy vấn đó) hoặc sắp ít dòng hơn là sửa được — bài 10.4.']),
    ],
    gy: [['Total rows of a node = actual rows × loops.', 'Tổng số dòng của một nút = actual rows × loops.'], ['Compare estimate and actual on every node, top to bottom.', 'So ước lượng và thực tế ở mọi nút, từ trên xuống.']],
    lhg: [['Ignoring loops and thinking an inner index scan returned one row.', 'Bỏ qua loops và nghĩ nút quét chỉ mục bên trong chỉ trả một dòng.'], ['Treating every Seq Scan as a problem.', 'Coi mọi Seq Scan là vấn đề.']],
    tn: [tn('loops', 'số lần nút được chạy')],
  }),
]);
