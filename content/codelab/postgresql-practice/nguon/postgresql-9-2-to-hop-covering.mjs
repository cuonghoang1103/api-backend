/** PostgreSQL · 9.2 — Cột nào, chỉ mục tổ hợp & covering (INCLUDE, Index Only Scan). */
import { mod, pg, cs, bang1, sau, ma, CT_SHOP, LUOC_DO_CT_SHOP, PLAN_ALL, TN, tn } from './_chung.mjs';
import { O_EVENT } from './_du-lieu.mjs';

const lit = (s) => s.replace(/'/g, "''");
const Q_USER = 'SELECT * FROM event WHERE user_id = 42 ORDER BY created_at DESC LIMIT 5';

export default mod('postgresql-9-2-to-hop-covering', '9.2 Which columns, composite indexes & covering', [
  pg({
    ...O_EVENT, t: 'One index for filter + sort: the composite index', k: 'MEDIUM', p: 8, kn: ['composite index', 'column order', 'no Sort node'], tag: ['index', 'composite'],
    en: `<p>The profile page shows a user's 5 latest events: <code>${Q_USER}</code>. Create ONE index that lets PostgreSQL find user 42's rows <b>already sorted by time</b>, so the plan has no <code>Sort</code> node.</p>`,
    vi: `<p>Trang hồ sơ hiện 5 sự kiện mới nhất của một user: <code>${Q_USER}</code>. Tạo MỘT chỉ mục giúp PostgreSQL tìm các dòng của user 42 <b>đã sắp sẵn theo thời gian</b>, để kế hoạch không có nút <code>Sort</code>.</p>`,
    yc: [['A composite index: the equality column first, then the sort column.', 'Chỉ mục tổ hợp: cột so bằng trước, cột sắp xếp sau.'], ['The plan must contain <code>Index Cond: (user_id = 42)</code> and no Sort.', 'Kế hoạch phải có <code>Index Cond: (user_id = 42)</code> và không có Sort.']],
    giai: `CREATE INDEX idx_event_user_created ON event (user_id, created_at);
-- equality column first, then the ORDER BY column: rows of one user sit together, already in time order`,
    kiem: [
      sau(['Plan: index lookup on user_id, no Sort', 'Kế hoạch: tra chỉ mục theo user_id, không Sort'], `SELECT plan_text('${lit(Q_USER)}') ~ 'Index Cond: \\(user_id = 42\\)' AS seeks_user, plan_text('${lit(Q_USER)}') !~ 'Sort' AS no_sort`),
      sau(['The index starts with user_id, then created_at', 'Chỉ mục bắt đầu bằng user_id, rồi created_at'], "SELECT bool_or(indexdef ~ '\\(user_id, created_at') AS right_order FROM pg_indexes WHERE tablename = 'event'"),
      sau(['Works for another user', 'Đúng với user khác'], `SELECT plan_text('${lit(Q_USER.replace('42', '1999'))}') !~ 'Sort' AS no_sort`, { an: true }),
    ],
    sai: ['CREATE INDEX idx_event_user ON event (user_id)', 'CREATE INDEX idx_event_created_user ON event (created_at, user_id)'],
    gy: [['Index columns are sorted left to right like a phone book (surname, then first name).', 'Cột chỉ mục được sắp từ trái sang phải như danh bạ (họ, rồi tên).'], ['Equality first, range/sort after.', 'So bằng trước, khoảng/sắp xếp sau.']],
    lhg: [['An index on user_id alone: it finds the rows, then still sorts them (Sort node).', 'Chỉ mục riêng user_id: tìm được dòng nhưng vẫn phải sắp lại (nút Sort).'], ['(created_at, user_id): PostgreSQL 18 can still use it by "skip scan" (the grader is PG 18), but it walks the whole time range; on PostgreSQL 17 — the version of the lesson — it is not usable at all. Equality column first is the rule.', '(created_at, user_id): PostgreSQL 18 vẫn dùng được nhờ "skip scan" (máy chấm là PG 18), nhưng phải đi qua cả khoảng thời gian; trên PostgreSQL 17 — bản của bài giảng — thì không dùng được. Luật: cột so bằng đứng trước.']],
    gt: ['<p>In (user_id, created_at) all entries of user 42 are contiguous and already ordered by created_at, so PostgreSQL reads 5 entries backwards and stops — no sort, no extra rows. Column order decides which queries an index can serve.</p>', '<p>Trong (user_id, created_at) mọi mục của user 42 nằm liền nhau và đã sắp theo created_at, nên PostgreSQL đọc ngược 5 mục rồi dừng — không sắp, không dòng thừa. Thứ tự cột quyết định chỉ mục phục vụ được truy vấn nào.</p>'],
    tn: [tn('composite index', 'chỉ mục tổ hợp'), tn('skip scan', 'quét nhảy (PostgreSQL 18)')],
  }),

  pg({
    ...O_EVENT, t: 'A covering index: Index Only Scan', k: 'MEDIUM', p: 8, kn: ['INCLUDE', 'Index Only Scan'], tag: ['index', 'covering'],
    en: '<p>The wallet widget runs <code>SELECT user_id, sum(amount) FROM event WHERE user_id = 42 GROUP BY user_id</code>. Create an index on <code>user_id</code> that also <b>carries</b> <code>amount</code>, so the query can be answered from the index alone (<code>Index Only Scan</code>) without visiting the table.</p>',
    vi: '<p>Widget ví chạy <code>SELECT user_id, sum(amount) FROM event WHERE user_id = 42 GROUP BY user_id</code>. Tạo chỉ mục trên <code>user_id</code> <b>mang theo</b> cả <code>amount</code>, để truy vấn trả lời được chỉ từ chỉ mục (<code>Index Only Scan</code>) mà không ghé bảng.</p>',
    yc: [['<code>CREATE INDEX … ON event (user_id) INCLUDE (amount)</code>.', '<code>CREATE INDEX … ON event (user_id) INCLUDE (amount)</code>.'], ['The check turns off bitmap scans so you can see the node the index enables.', 'Kiểm tắt bitmap scan để thấy nút mà chỉ mục cho phép.']],
    giai: `CREATE INDEX idx_event_user_incl ON event (user_id) INCLUDE (amount);
-- user_id is the key; amount is stored in the leaf entries only (not sorted, not searchable)`,
    kiem: [
      sau(['The plan is an Index Only Scan', 'Kế hoạch là Index Only Scan'], "SET LOCAL enable_bitmapscan = off; SELECT plan_text('SELECT user_id, sum(amount) FROM event WHERE user_id = 42 GROUP BY user_id') ~ 'Index Only Scan' AS index_only"),
      sau(['Same total as before', 'Cùng tổng như trước'], 'SELECT user_id, sum(amount) AS total FROM event WHERE user_id = 42 GROUP BY user_id'),
      ma(['Uses INCLUDE (or a composite with amount)', 'Dùng INCLUDE (hoặc tổ hợp có amount)'], 'INCLUDE\\s*\\(\\s*amount\\s*\\)|\\(\\s*user_id\\s*,\\s*amount\\s*\\)'),
    ],
    sai: ['CREATE INDEX idx_event_user ON event (user_id)', 'CREATE INDEX idx_event_amount ON event (amount) INCLUDE (user_id)'],
    gy: [['An Index Only Scan needs EVERY column the query touches to be in the index.', 'Index Only Scan cần MỌI cột truy vấn dùng tới đều nằm trong chỉ mục.'], ['INCLUDE adds non-key columns to the leaf entries.', 'INCLUDE thêm cột không phải khoá vào các mục lá.']],
    lhg: [['Index on user_id only: Index Scan + a heap fetch for every row to read amount.', 'Chỉ mục riêng user_id: Index Scan + một lần ghé bảng cho mỗi dòng để đọc amount.'], ['Key on amount: the WHERE on user_id cannot use it.', 'Khoá là amount: WHERE trên user_id không dùng được.']],
    gt: ['<p>A covering index contains every column of the query, so PostgreSQL can skip the table. On a real server, how often it really skips depends on the visibility map (VACUUM) — EXPLAIN ANALYZE shows it as "Heap Fetches".</p>', '<p>Chỉ mục covering chứa mọi cột của truy vấn, nên PostgreSQL bỏ qua được bảng. Trên máy chủ thật, bỏ qua thật hay không tuỳ visibility map (VACUUM) — EXPLAIN ANALYZE hiện con số "Heap Fetches".</p>'],
    tn: [tn('covering index', 'chỉ mục bao phủ'), tn('Index Only Scan', 'quét chỉ trên chỉ mục')],
  }),

  cs({
    t: 'Which queries can (a, b) serve?', k: 'MEDIUM', p: 6, loai: 'table', kn: ['leftmost prefix'], tag: ['index', 'composite'],
    en: '<p>Index <code>idx ON event (user_id, created_at)</code>. For each query, can the index be used <b>efficiently</b> (seek on the leading column)? Answer as on PostgreSQL 17 (no skip scan).</p>',
    vi: '<p>Chỉ mục <code>idx ON event (user_id, created_at)</code>. Với mỗi truy vấn, chỉ mục có dùng được <b>hiệu quả</b> không (tìm theo cột đầu)? Trả lời như trên PostgreSQL 17 (không có skip scan).</p>',
    bang: [bang1('b1', ['Leftmost prefix rule', 'Luật tiền tố bên trái'], [{ ma: 'q', ten: 'Query / Truy vấn' }, { ma: 'ok', ten: 'Usable?', luaChon: ['yes', 'no'] }], [
      { o: { q: 'WHERE user_id = 42' }, a: { ok: 'yes' } },
      { o: { q: "WHERE user_id = 42 AND created_at >= '2024-03-01'" }, a: { ok: 'yes' } },
      { o: { q: 'WHERE user_id = 42 ORDER BY created_at DESC LIMIT 5' }, a: { ok: 'yes' } },
      { o: { q: "WHERE created_at >= '2024-03-01'" }, a: { ok: 'no' } },
      { o: { q: 'WHERE user_id IN (1, 2, 3)' }, a: { ok: 'yes' } },
      { o: { q: 'ORDER BY created_at LIMIT 10' }, a: { ok: 'no' } },
    ], ['A composite B-tree is sorted by user_id first; created_at is only sorted <i>within</i> each user. Any query that fixes user_id (=, IN) can seek; a query on created_at alone, or sorting by created_at alone, cannot (PostgreSQL 18 adds skip scan, still slower than a proper index).', 'B-tree tổ hợp được sắp theo user_id trước; created_at chỉ được sắp <i>bên trong</i> từng user. Truy vấn nào cố định user_id (=, IN) thì tìm được; truy vấn chỉ trên created_at, hay chỉ sắp theo created_at, thì không (PostgreSQL 18 có skip scan, vẫn chậm hơn chỉ mục đúng).'])],
    gy: [['Ask: does the query fix the FIRST column?', 'Tự hỏi: truy vấn có cố định cột ĐẦU không?'], ['IN on the first column is several equality seeks.', 'IN trên cột đầu là vài lần tìm theo bằng.']],
    lhg: [['Thinking any query that mentions an index column can use it.', 'Nghĩ rằng truy vấn nào nhắc tới cột của chỉ mục cũng dùng được nó.'], ['Building (created_at, user_id) for a "per user" page.', 'Dựng (created_at, user_id) cho trang "theo user".']],
    tn: [tn('leftmost prefix', 'tiền tố bên trái')],
  }),

  pg({
    t: 'Index the foreign key you join and sort on (CT Shop)', k: 'HARD', p: 12, kn: ['FK columns are not indexed automatically', 'composite (customer_id, created_at DESC)', 'testing usability with enable_seqscan'], tag: ['index', 'composite', 'ctshop'],
    csdl: `${CT_SHOP}\n${PLAN_ALL}`, tenCsdl: 'ctshop', ld: { en: LUOC_DO_CT_SHOP.en + '<p>Plus the plan helper functions (plan_text …). The table is tiny, so the checks switch sequential scans off to ask "COULD an index serve this?".</p>', vi: LUOC_DO_CT_SHOP.vi + '<p>Cộng các hàm xem kế hoạch (plan_text …). Bảng rất nhỏ nên kiểm tắt quét tuần tự để hỏi "chỉ mục CÓ THỂ phục vụ không?".</p>' },
    en: '<p>Two hot queries of CT Shop: (1) "my orders, newest first": <code>SELECT * FROM orders WHERE customer_id = 3 ORDER BY created_at DESC</code>; (2) "who bought this product": <code>SELECT order_id FROM order_item WHERE product_id = 31</code>. Neither foreign-key column has an index. Create exactly the two indexes that serve them (no Sort for the first one).</p>',
    vi: '<p>Hai truy vấn nóng của CT Shop: (1) "đơn của tôi, mới nhất trước": <code>SELECT * FROM orders WHERE customer_id = 3 ORDER BY created_at DESC</code>; (2) "ai đã mua sản phẩm này": <code>SELECT order_id FROM order_item WHERE product_id = 31</code>. Cả hai cột khoá ngoại đều chưa có chỉ mục. Tạo đúng hai chỉ mục phục vụ chúng (truy vấn đầu không có Sort).</p>',
    yc: [['<code>orders (customer_id, created_at)</code> (DESC optional — B-trees scan both ways).', '<code>orders (customer_id, created_at)</code> (DESC tuỳ chọn — B-tree quét được cả hai chiều).'], ['<code>order_item (product_id)</code> — the PK (order_id, product_id) starts with order_id, so it does not help.', '<code>order_item (product_id)</code> — PK (order_id, product_id) bắt đầu bằng order_id nên không giúp được.']],
    giai: `CREATE INDEX idx_orders_customer_created ON orders (customer_id, created_at DESC);
CREATE INDEX idx_order_item_product      ON order_item (product_id);   -- FK columns are NOT indexed automatically`,
    kiem: [
      sau(['Query 1 seeks customer_id without sorting', 'Truy vấn 1 tìm theo customer_id mà không sắp lại'], "SET LOCAL enable_seqscan = off; SELECT plan_text('SELECT * FROM orders WHERE customer_id = 3 ORDER BY created_at DESC') ~ 'Index Cond: \\(customer_id = 3\\)' AS seeks, plan_text('SELECT * FROM orders WHERE customer_id = 3 ORDER BY created_at DESC') !~ 'Sort' AS no_sort"),
      sau(['Query 2 seeks product_id with its own index (not a skip scan of the PK)', 'Truy vấn 2 tìm theo product_id bằng chỉ mục riêng (không phải skip scan trên PK)'], "SET LOCAL enable_seqscan = off; SELECT plan_text('SELECT order_id FROM order_item WHERE product_id = 31') ~ 'Index Cond: \\(product_id = 31\\)' AS seeks, plan_text('SELECT order_id FROM order_item WHERE product_id = 31') !~ 'order_item_pkey' AS not_the_pk"),
      sau(['An order_item index LEADS with product_id', 'Có chỉ mục order_item BẮT ĐẦU bằng product_id'], "SELECT bool_or(indexdef ~ 'USING btree \\(product_id') AS leads_with_product_id FROM pg_indexes WHERE tablename = 'order_item'"),
      sau(['Exactly two new indexes', 'Đúng hai chỉ mục mới'], "SELECT count(*) AS new_indexes FROM pg_indexes WHERE tablename IN ('orders', 'order_item') AND indexname NOT LIKE '%pkey'", { an: true }),
    ],
    sai: ['CREATE INDEX idx_orders_customer ON orders (customer_id); CREATE INDEX idx_order_item_product ON order_item (product_id);', 'CREATE INDEX idx_orders_customer_created ON orders (customer_id, created_at DESC); CREATE INDEX idx_order_item_both ON order_item (order_id, product_id);'],
    gy: [['PostgreSQL indexes primary keys and UNIQUE automatically — never foreign keys.', 'PostgreSQL tự đánh chỉ mục cho khoá chính và UNIQUE — không bao giờ cho khoá ngoại.'], ['A second index identical to the PK is pure overhead.', 'Chỉ mục thứ hai giống hệt PK là gánh nặng vô ích.']],
    lhg: [['An index on customer_id alone: query 1 still needs a Sort.', 'Chỉ mục riêng customer_id: truy vấn 1 vẫn cần Sort.'], ['Re-indexing (order_id, product_id): the PK already is that index, and product_id is not its leading column.', 'Đánh lại (order_id, product_id): PK đã là chỉ mục đó, và product_id không phải cột đầu.']],
    gt: ['<p>Missing indexes on foreign keys are the most common production slowdown (chapter 16): every "children of X" query and every DELETE of a parent scans the child table. On a tiny table the planner prefers a seq scan anyway — turning <code>enable_seqscan</code> off in the check asks whether an index could serve the query at all.</p>', '<p>Thiếu chỉ mục trên khoá ngoại là nguyên nhân chậm phổ biến nhất trên production (chương 16): mọi truy vấn "con của X" và mọi lệnh DELETE cha đều quét bảng con. Trên bảng nhỏ, planner vẫn thích quét tuần tự — tắt <code>enable_seqscan</code> trong kiểm là hỏi chỉ mục có thể phục vụ truy vấn hay không.</p>'],
    tn: [TN.index, TN.fk],
  }),
]);
