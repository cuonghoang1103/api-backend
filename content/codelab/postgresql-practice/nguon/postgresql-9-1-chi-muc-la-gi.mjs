/**
 * PostgreSQL · 9.1 — Chỉ mục là gì: B-tree, Seq Scan vs Index Scan. Bảng event 20 000 dòng (đã ANALYZE) — kiểm bằng kế hoạch thật
 * mà bộ lập kế hoạch chọn (plan_nodes/plan_text trong CSDL của đề), không bằng tên chỉ mục người học đặt.
 */
import { mod, pg, cs, q, kq, kqAn, sau, ma, TN, tn } from './_chung.mjs';
import { O_EVENT } from './_du-lieu.mjs';

const lit = (s) => s.replace(/'/g, "''");
const dungIdx = (sql) => `SELECT plan_nodes('${lit(sql)}') ~ 'Index' AS uses_index`;

export default mod('postgresql-9-1-chi-muc-la-gi', '9.1 What an index is: B-tree, Seq Scan vs Index Scan', [
  pg({
    ...O_EVENT, t: 'Make the email lookup use an index', k: 'EASY', p: 6, kn: ['CREATE INDEX', 'B-tree', 'Index Scan'], tag: ['index', 'explain'],
    en: '<p>The login page runs <code>SELECT * FROM event WHERE email = \'user250@example.com\'</code> thousands of times a day, and today it reads all 20 000 rows (<code>Seq Scan</code>). Create the index that lets PostgreSQL jump straight to the row.</p>',
    vi: '<p>Trang đăng nhập chạy <code>SELECT * FROM event WHERE email = \'user250@example.com\'</code> hàng nghìn lần mỗi ngày, và hôm nay nó đọc cả 20 000 dòng (<code>Seq Scan</code>). Tạo chỉ mục giúp PostgreSQL nhảy thẳng tới dòng đó.</p>',
    yc: [['One <code>CREATE INDEX … ON event (email)</code> (any name).', 'Một lệnh <code>CREATE INDEX … ON event (email)</code> (tên tuỳ ý).'], ['Do not change the query or the data.', 'Không đổi truy vấn hay dữ liệu.']],
    giai: `CREATE INDEX idx_event_email ON event (email);   -- a sorted B-tree: lookup in ~log(n) page reads`,
    kiem: [
      sau(['The lookup now uses an Index Scan', 'Truy vấn tra cứu giờ dùng Index Scan'], dungIdx("SELECT * FROM event WHERE email = 'user250@example.com'")),
      sau(['Any other email too', 'Email khác cũng vậy'], dungIdx("SELECT * FROM event WHERE email = 'user19999@example.com'"), { an: true }),
      sau(['Same answer as before (one row)', 'Vẫn cùng kết quả (một dòng)'], "SELECT count(*) AS rows FROM event WHERE email = 'user250@example.com'"),
      ma(['CREATE INDEX on email', 'CREATE INDEX trên email'], 'CREATE\\s+(UNIQUE\\s+)?INDEX[\\s\\S]*\\(\\s*email\\s*\\)'),
    ],
    sai: ['CREATE INDEX idx_event_user ON event (user_id)', 'CREATE INDEX idx_event_email ON event (lower(email))'],
    gy: [['The index must be on the column the WHERE compares.', 'Chỉ mục phải nằm trên đúng cột mà WHERE so sánh.'], ['CREATE INDEX name ON table (column).', 'CREATE INDEX tên ON bảng (cột).']],
    lhg: [['Indexing another column (user_id): the planner still has to scan.', 'Đánh chỉ mục cột khác (user_id): planner vẫn phải quét.'], ['An index on lower(email) does not serve <code>email = …</code> — the expressions must match.', 'Chỉ mục trên lower(email) không phục vụ <code>email = …</code> — biểu thức phải khớp.']],
    gt: ['<p>A B-tree keeps the email values sorted with pointers to their rows. Finding one value takes a few page reads instead of reading the whole table — the plan changes from <code>Seq Scan</code> to <code>Index Scan</code>. The checks ask PostgreSQL for its plan; they do not care what you named the index.</p>', '<p>B-tree giữ các giá trị email đã sắp kèm con trỏ tới dòng. Tìm một giá trị chỉ tốn vài lần đọc trang thay vì đọc cả bảng — kế hoạch đổi từ <code>Seq Scan</code> sang <code>Index Scan</code>. Các kiểm hỏi PostgreSQL kế hoạch của nó; tên chỉ mục bạn đặt không quan trọng.</p>'],
    tn: [TN.index, tn('B-tree', 'cây B (chỉ mục mặc định)')],
  }),

  pg({
    ...O_EVENT, t: 'See the plan change: EXPLAIN before and after', k: 'MEDIUM', p: 8, kn: ['EXPLAIN (COSTS OFF)', 'Index Cond'], tag: ['index', 'explain'],
    en: '<p>Create the index <code>idx_event_email</code> on <code>event(email)</code>, then show the plan of <code>SELECT * FROM event WHERE email = \'user250@example.com\'</code> with <code>EXPLAIN (COSTS OFF)</code>. The last statement of your script is the EXPLAIN — its output is graded.</p>',
    vi: '<p>Tạo chỉ mục <code>idx_event_email</code> trên <code>event(email)</code>, rồi hiện kế hoạch của <code>SELECT * FROM event WHERE email = \'user250@example.com\'</code> bằng <code>EXPLAIN (COSTS OFF)</code>. Câu cuối cùng trong script là EXPLAIN — output của nó được chấm.</p>',
    yc: [['Exactly the index name <code>idx_event_email</code> (it appears in the plan).', 'Đúng tên chỉ mục <code>idx_event_email</code> (nó hiện trong kế hoạch).'], ['<code>EXPLAIN (COSTS OFF)</code> without ANALYZE.', '<code>EXPLAIN (COSTS OFF)</code> không ANALYZE.']],
    giai: `CREATE INDEX idx_event_email ON event (email);
EXPLAIN (COSTS OFF)
SELECT * FROM event WHERE email = 'user250@example.com';
-- Index Scan using idx_event_email on event
--   Index Cond: (email = 'user250@example.com'::text)`,
    kiem: [
      kq(['Index Scan using idx_event_email', 'Index Scan using idx_event_email'], { thuTu: true }),
      ma(['EXPLAIN without ANALYZE', 'EXPLAIN không ANALYZE'], '^(?![\\s\\S]*\\bANALY[SZ]E\\b)[\\s\\S]*\\bEXPLAIN\\b'),
      sau(['The index exists with that name', 'Chỉ mục tồn tại với đúng tên'], "SELECT indexname FROM pg_indexes WHERE tablename = 'event' AND indexname = 'idx_event_email'"),
    ],
    sai: ["EXPLAIN (COSTS OFF) SELECT * FROM event WHERE email = 'user250@example.com'", "CREATE INDEX event_email ON event (email); EXPLAIN (COSTS OFF) SELECT * FROM event WHERE email = 'user250@example.com'"],
    gy: [['Two statements: CREATE INDEX, then EXPLAIN.', 'Hai câu: CREATE INDEX, rồi EXPLAIN.'], ['Index Cond is the condition the index answers.', 'Index Cond là điều kiện mà chỉ mục trả lời.']],
    lhg: [['EXPLAIN alone: <code>Seq Scan on event / Filter: …</code> — no index yet.', 'Chỉ EXPLAIN: <code>Seq Scan on event / Filter: …</code> — chưa có chỉ mục.'], ['A different index name — the plan text names the index you created.', 'Tên chỉ mục khác — dòng kế hoạch ghi tên chỉ mục bạn tạo.']],
    gt: ['<p>Before the index the plan is <code>Seq Scan + Filter</code>; after it, <code>Index Scan using idx_event_email</code> with <code>Index Cond</code>. A <code>Filter</code> line means rows were read and then thrown away; an <code>Index Cond</code> means the index found them.</p>', '<p>Trước khi có chỉ mục, kế hoạch là <code>Seq Scan + Filter</code>; sau đó là <code>Index Scan using idx_event_email</code> với <code>Index Cond</code>. Dòng <code>Filter</code> nghĩa là đọc rồi bỏ; <code>Index Cond</code> nghĩa là chỉ mục tìm ra dòng.</p>'],
    tn: [TN.explain, tn('Index Cond', 'điều kiện chỉ mục trả lời')],
  }),

  cs({
    t: 'What an index buys and what it costs', k: 'EASY', p: 5, kn: ['B-tree', 'write cost'], tag: ['index', 'concepts'],
    en: '<p>Check your mental model of a B-tree index.</p>', vi: '<p>Kiểm tra mô hình tư duy về chỉ mục B-tree.</p>',
    cau: [
      q('q1', ['A table grows from 1 million to 100 million rows. Roughly how many more pages does a B-tree lookup of one value read?', 'Bảng tăng từ 1 triệu lên 100 triệu dòng. Tra một giá trị qua B-tree đọc thêm khoảng bao nhiêu trang?'], ['one or two more levels — depth grows like log(n)', 'about 100 times more pages', 'exactly twice as many', 'the same as a sequential scan'], ['Each B-tree page holds hundreds of keys, so ×100 rows adds about one level.', 'Mỗi trang B-tree chứa hàng trăm khoá, nên ×100 dòng chỉ thêm khoảng một tầng.']),
      q('q2', ['What does every extra index cost?', 'Mỗi chỉ mục thêm vào tốn gì?'], ['disk space and work on every INSERT/UPDATE/DELETE of the table', 'nothing once it is built', 'only memory while queries run', 'it slows down SELECTs that do not use it'], ['Every write must also update every index (unless HOT applies). Index what your queries need, not every column.', 'Mỗi lần ghi phải cập nhật mọi chỉ mục (trừ khi HOT áp dụng). Đánh chỉ mục theo truy vấn cần, không phải mọi cột.']),
      q('q3', ['Which query can a B-tree on <code>event(email)</code> serve?', 'Truy vấn nào chỉ mục B-tree trên <code>event(email)</code> phục vụ được?'], ['<code>WHERE email &gt; \'user5\' ORDER BY email</code>', '<code>WHERE email LIKE \'%@example.com\'</code>', '<code>WHERE lower(email) = \'x\'</code>', '<code>WHERE length(email) = 20</code>'], ['A B-tree is sorted, so it serves =, &lt;, &gt;, BETWEEN, ORDER BY and LIKE \'prefix%\' (with the right opclass). A leading wildcard or a function on the column needs another kind of index.', 'B-tree đã sắp nên phục vụ =, &lt;, &gt;, BETWEEN, ORDER BY và LIKE \'tiền tố%\' (đúng opclass). Ký tự đại diện ở đầu hay hàm trên cột cần loại chỉ mục khác.']),
      q('q4', ['Does the primary key of <code>event</code> already have an index?', 'Khoá chính của <code>event</code> đã có chỉ mục chưa?'], ['yes — PRIMARY KEY and UNIQUE always create a unique B-tree', 'no, you must create it yourself', 'only if the table has more than 1 000 rows', 'only for integer keys'], ['PostgreSQL enforces uniqueness through an index, so every PK/UNIQUE constraint comes with one. Foreign keys, however, do NOT get one automatically.', 'PostgreSQL thực thi tính duy nhất bằng chỉ mục, nên mọi ràng buộc PK/UNIQUE đều kèm một chỉ mục. Khoá ngoại thì KHÔNG tự có.']),
    ],
    gy: [['Think of a phone book: sorted, so you jump.', 'Nghĩ tới danh bạ: đã sắp nên nhảy được.'], ['Writes pay for every index.', 'Thao tác ghi trả giá cho mọi chỉ mục.']],
    lhg: [['Indexing every column "just in case" — inserts slow down, disk fills up.', 'Đánh chỉ mục mọi cột "cho chắc" — chèn chậm đi, đĩa đầy lên.'], ['Assuming foreign keys are indexed automatically (they are not in PostgreSQL).', 'Cho rằng khoá ngoại tự có chỉ mục (trong PostgreSQL thì không).']],
    tn: [TN.index],
  }),
]);
