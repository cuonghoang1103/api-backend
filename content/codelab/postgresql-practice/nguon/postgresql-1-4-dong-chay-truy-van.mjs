/** PostgreSQL · 1.4 — Một truy vấn chảy qua Postgres: parser → rewriter → planner → executor; EXPLAIN vs EXPLAIN ANALYZE. */
import { mod, pg, cs, q, ord, kq, kqAn, ma, pre, TN, tn } from './_chung.mjs';
import { NOTES } from './postgresql-0-4-mo-hinh.mjs';

const LD = {
  en: `<h4>Sample table</h4>${pre('notes (id identity PK, title, body, pinned boolean, created_at timestamptz, meta jsonb) — 5 rows, no index except the primary key')}`,
  vi: `<h4>Bảng mẫu</h4>${pre('notes (id identity PK, title, body, pinned boolean, created_at timestamptz, meta jsonb) — 5 dòng, không chỉ mục nào ngoài khoá chính')}`,
};

export default mod('postgresql-1-4-dong-chay-truy-van', '1.4 How a query flows through Postgres', [
  cs({
    t: 'Put the four stages in order', k: 'EASY', p: 4, loai: 'order', kn: ['parser', 'rewriter', 'planner', 'executor'], tag: ['concepts', 'planner'],
    en: '<p>Your app sends <code>SELECT title FROM notes WHERE pinned;</code>. Order what happens inside the server.</p>',
    vi: '<p>App gửi <code>SELECT title FROM notes WHERE pinned;</code>. Sắp thứ tự những gì diễn ra trong máy chủ.</p>',
    cau: [ord('o1', ['From SQL text to rows', 'Từ chữ SQL tới các dòng'], [
      'Parser: check the syntax and build a parse tree / kiểm cú pháp, dựng cây phân tích',
      'Analyzer + rewriter: resolve table/column names, expand views and rules / tra tên bảng/cột, bung view và rule',
      'Planner: estimate costs of possible plans, pick the cheapest / ước lượng chi phí các kế hoạch, chọn cái rẻ nhất',
      'Executor: run the chosen plan and stream rows back / chạy kế hoạch đã chọn và gửi dòng về',
    ], ['A misspelled keyword fails in the parser; an unknown column fails in analysis; only a valid query reaches the planner, and only the planner\'s plan is executed. EXPLAIN shows the planner\'s output without executing it.', 'Từ khoá sai chính tả hỏng ở parser; cột không tồn tại hỏng ở bước phân tích; chỉ truy vấn hợp lệ mới tới planner, và executor chỉ chạy kế hoạch planner chọn. EXPLAIN in kết quả của planner mà không chạy.'])],
    gy: [['Text must be understood before it can be optimized.', 'Phải hiểu được chữ trước khi tối ưu.'], ['Planning comes before any row is read.', 'Lập kế hoạch xảy ra trước khi đọc bất kỳ dòng nào.']],
    lhg: [['Thinking the planner runs while rows are read — the plan is fixed before execution starts.', 'Nghĩ planner chạy trong lúc đọc dòng — kế hoạch đã chốt trước khi thực thi.'], ['Placing view expansion after planning.', 'Đặt bước bung view sau lập kế hoạch.']],
    tn: [tn('planner', 'bộ lập kế hoạch'), tn('executor', 'bộ thực thi')],
  }),

  pg({
    t: 'Ask for the plan, not the rows', k: 'EASY', p: 6, kn: ['EXPLAIN', 'COSTS OFF', 'Seq Scan', 'Filter'], tag: ['explain', 'notes'],
    csdl: NOTES, tenCsdl: 'notes', ld: LD,
    en: '<p>Show the plan PostgreSQL chooses for <code>SELECT title FROM notes WHERE pinned</code> — without running it — and hide the cost numbers so the output is stable: use <code>EXPLAIN (COSTS OFF)</code>.</p>',
    vi: '<p>Hiện kế hoạch PostgreSQL chọn cho <code>SELECT title FROM notes WHERE pinned</code> — không chạy nó — và ẩn các con số chi phí cho output ổn định: dùng <code>EXPLAIN (COSTS OFF)</code>.</p>',
    yc: [['Exactly the query above, prefixed with <code>EXPLAIN (COSTS OFF)</code>.', 'Đúng câu truy vấn trên, thêm tiền tố <code>EXPLAIN (COSTS OFF)</code>.'], ['No ANALYZE: the query must not run.', 'Không ANALYZE: truy vấn không được chạy.']],
    giai: `EXPLAIN (COSTS OFF)
SELECT title FROM notes WHERE pinned;
-- Seq Scan on notes      ← read every row of the table
--   Filter: pinned       ← keep those where pinned is true`,
    kiem: [
      kq(['The plan: a sequential scan with a filter', 'Kế hoạch: quét tuần tự kèm bộ lọc'], { thuTu: true }),
      ma(['EXPLAIN without ANALYZE', 'EXPLAIN không có ANALYZE'], '^(?![\\s\\S]*\\bANALY[SZ]E\\b)[\\s\\S]*\\bEXPLAIN\\b'),
      kqAn(['The same plan when the table is bigger', 'Cùng kế hoạch khi bảng lớn hơn'], "INSERT INTO notes (title) SELECT 'n' || g FROM generate_series(1, 50) g", { thuTu: true }),
    ],
    sai: ['SELECT title FROM notes WHERE pinned', 'EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF) SELECT title FROM notes WHERE pinned'],
    gy: [['Prefix the statement: <code>EXPLAIN (COSTS OFF) SELECT …</code>.', 'Thêm tiền tố: <code>EXPLAIN (COSTS OFF) SELECT …</code>.'], ['Each output line is a row of the result: read it top-down, children indented.', 'Mỗi dòng output là một dòng kết quả: đọc từ trên xuống, nút con thụt vào.']],
    lhg: [['Adding ANALYZE "to be thorough": the query really runs — dangerous for an UPDATE or DELETE.', 'Thêm ANALYZE "cho chắc": truy vấn chạy thật — nguy hiểm với UPDATE hay DELETE.'], ['Comparing plans with costs on: the numbers depend on table size and settings, so they change between machines.', 'So kế hoạch khi bật chi phí: các con số phụ thuộc kích thước bảng và cấu hình nên đổi theo máy.']],
    gt: ['<p>Without an index on <code>pinned</code>, the only way to find pinned notes is to read all rows and filter: <code>Seq Scan</code> + <code>Filter: pinned</code>. EXPLAIN stops after planning; EXPLAIN ANALYZE would also execute and add actual row counts and times.</p>', '<p>Không có chỉ mục trên <code>pinned</code> thì cách duy nhất là đọc mọi dòng rồi lọc: <code>Seq Scan</code> + <code>Filter: pinned</code>. EXPLAIN dừng sau bước lập kế hoạch; EXPLAIN ANALYZE còn chạy thật và thêm số dòng, thời gian thực tế.</p>'],
    tn: [TN.explain, tn('Seq Scan', 'quét tuần tự', 'đọc mọi trang của bảng')],
  }),

  cs({
    t: 'EXPLAIN or EXPLAIN ANALYZE?', k: 'MEDIUM', p: 5, kn: ['EXPLAIN', 'EXPLAIN ANALYZE'], tag: ['explain', 'concepts'],
    en: '<p>Choose the right tool and read the right number.</p>', vi: '<p>Chọn đúng công cụ và đọc đúng con số.</p>',
    cau: [
      q('q1', ['You want to know why <code>DELETE FROM orders WHERE created_at &lt; \'2024-01-01\'</code> is slow on production, without deleting anything.', 'Muốn biết vì sao <code>DELETE FROM orders WHERE created_at &lt; \'2024-01-01\'</code> chậm trên production mà không xoá gì.'], ['plain <code>EXPLAIN</code> (or EXPLAIN ANALYZE inside BEGIN … ROLLBACK)', '<code>EXPLAIN ANALYZE</code> directly in autocommit', 'run the DELETE and time it', '<code>\\timing</code> then the DELETE'], ['EXPLAIN ANALYZE executes the statement. For writes, either use plain EXPLAIN or wrap ANALYZE in a transaction you roll back.', 'EXPLAIN ANALYZE chạy thật câu lệnh. Với lệnh ghi, dùng EXPLAIN thường hoặc bọc ANALYZE trong giao dịch rồi ROLLBACK.']),
      q('q2', ['In <code>EXPLAIN ANALYZE</code>, a node shows <code>rows=10</code> (estimate) and <code>actual rows=48210</code>. What does the gap tell you?', 'Trong <code>EXPLAIN ANALYZE</code>, một nút ghi <code>rows=10</code> (ước lượng) và <code>actual rows=48210</code>. Khoảng cách đó nói gì?'], ['the planner\'s statistics are off — it may have chosen a plan for 10 rows that is bad for 48 210', 'the query returned wrong results', 'the index is corrupted', 'nothing — estimates are never close'], ['Bad estimates lead to bad plan choices (e.g. a nested loop meant for a handful of rows). Chapter 10.3 fixes them with ANALYZE and extended statistics.', 'Ước lượng sai dẫn tới chọn kế hoạch tồi (vd vòng lặp lồng dành cho vài dòng). Chương 10.3 sửa bằng ANALYZE và thống kê mở rộng.']),
      q('q3', ['Which number in <code>cost=0.00..18.10</code> is the TOTAL estimated cost?', 'Trong <code>cost=0.00..18.10</code>, số nào là tổng chi phí ước lượng?'], ['18.10 — the second number', '0.00 — the first number', 'their difference', 'neither: cost is in milliseconds'], ['The first number is the startup cost (before the first row), the second the total cost — in abstract planner units, not milliseconds.', 'Số đầu là chi phí khởi động (trước dòng đầu tiên), số sau là tổng chi phí — đơn vị trừu tượng của planner, không phải mili giây.']),
      q('q4', ['Where does EXPLAIN get its row estimates from?', 'EXPLAIN lấy số dòng ước lượng từ đâu?'], ['statistics gathered by ANALYZE / autovacuum (pg_statistic)', 'by counting the table on every EXPLAIN', 'from the client', 'from the last time the query ran'], ['The planner never counts the table while planning; it uses sampled statistics. Stale statistics ⇒ stale estimates.', 'Planner không bao giờ đếm bảng khi lập kế hoạch; nó dùng thống kê lấy mẫu. Thống kê cũ ⇒ ước lượng cũ.']),
    ],
    gy: [['ANALYZE in EXPLAIN means "execute and measure".', 'ANALYZE trong EXPLAIN nghĩa là "chạy và đo".'], ['Estimates come from statistics, actuals from execution.', 'Ước lượng đến từ thống kê, số thực đến từ lúc chạy.']],
    lhg: [['Running EXPLAIN ANALYZE on a DELETE in production "just to look".', 'Chạy EXPLAIN ANALYZE cho một DELETE trên production "chỉ để xem".'], ['Reading cost as milliseconds.', 'Đọc cost như mili giây.']],
    tn: [TN.explain],
  }),
]);
