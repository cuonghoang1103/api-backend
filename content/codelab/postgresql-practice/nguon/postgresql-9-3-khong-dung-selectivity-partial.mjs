/** PostgreSQL · 9.3 — Khi chỉ mục KHÔNG được dùng: hàm trên cột, độ chọn lọc, chỉ mục từng phần, viết lại cho "sargable". */
import { mod, pg, cs, q, kq, kqAn, sau, ma, tn, TN } from './_chung.mjs';
import { O_EVENT, EVENT } from './_du-lieu.mjs';

const lit = (s) => s.replace(/'/g, "''");
const CO_IDX_TIME = `${EVENT}\nCREATE INDEX idx_event_created ON event (created_at);`;

export default mod('postgresql-9-3-khong-dung-selectivity-partial', '9.3 When indexes are NOT used, selectivity & partial indexes', [
  pg({
    ...O_EVENT, t: 'Case-insensitive login with an expression index', k: 'MEDIUM', p: 8, kn: ['expression index', 'lower()'], tag: ['index', 'expression'],
    en: '<p>Logins compare e-mails case-insensitively: <code>SELECT * FROM event WHERE lower(email) = \'user7@example.com\'</code>. A plain index on <code>email</code> cannot serve <code>lower(email)</code>. Create the index that can.</p>',
    vi: '<p>Đăng nhập so email không phân biệt hoa thường: <code>SELECT * FROM event WHERE lower(email) = \'user7@example.com\'</code>. Chỉ mục thường trên <code>email</code> không phục vụ được <code>lower(email)</code>. Tạo chỉ mục làm được.</p>',
    yc: [['<code>CREATE INDEX … ON event (lower(email))</code> — note the extra parentheses.', '<code>CREATE INDEX … ON event (lower(email))</code> — chú ý cặp ngoặc thừa.'], ['The query stays exactly as written.', 'Truy vấn giữ nguyên.']],
    giai: `CREATE INDEX idx_event_lower_email ON event (lower(email));   -- index the EXPRESSION the query uses`,
    kiem: [
      sau(['The lower(email) query uses an index', 'Truy vấn lower(email) dùng chỉ mục'], `SELECT plan_nodes('${lit("SELECT * FROM event WHERE lower(email) = 'user7@example.com'")}') ~ 'Index' AS uses_index`),
      sau(['…for any address', '…với mọi địa chỉ'], `SELECT plan_nodes('${lit("SELECT * FROM event WHERE lower(email) = 'user12345@example.com'")}') ~ 'Index' AS uses_index`, { an: true }),
      ma(['Index on lower(email)', 'Chỉ mục trên lower(email)'], 'ON\\s+event\\s*(USING\\s+btree\\s*)?\\(\\s*lower\\s*\\(\\s*email\\s*\\)\\s*\\)'),
    ],
    sai: ['CREATE INDEX idx_event_email ON event (email)'],
    gy: [['The planner can only use an index whose definition matches the expression in WHERE.', 'Planner chỉ dùng được chỉ mục có định nghĩa khớp biểu thức trong WHERE.'], ['An expression index stores the computed value for every row.', 'Chỉ mục biểu thức lưu giá trị đã tính cho mọi dòng.']],
    lhg: [['Indexing the bare column — <code>lower(email)</code> is a different expression, so it is a Seq Scan.', 'Đánh chỉ mục cột trơn — <code>lower(email)</code> là biểu thức khác nên vẫn Seq Scan.'], ['Wrapping the column in a function in WHERE "to be safe" — that is exactly what defeats a plain index.', 'Bọc cột trong hàm ở WHERE "cho chắc" — chính điều đó vô hiệu hoá chỉ mục thường.']],
    gt: ['<p>An index is on an expression, not on a "column + whatever you do with it". Index the exact expression the query uses (lower(email)), or store normalized data (the CHECK email = lower(email) of CT Shop) and query the bare column.</p>', '<p>Chỉ mục nằm trên một biểu thức, không phải "cột + gì làm với nó cũng được". Đánh chỉ mục đúng biểu thức truy vấn dùng (lower(email)), hoặc lưu dữ liệu đã chuẩn hoá (CHECK email = lower(email) của CT Shop) rồi truy vấn cột trơn.</p>'],
    tn: [tn('expression index', 'chỉ mục biểu thức')],
  }),

  pg({
    ...O_EVENT, t: 'A partial index for the pending queue', k: 'MEDIUM', p: 10, kn: ['partial index', 'WHERE in CREATE INDEX', 'selectivity'], tag: ['index', 'partial'],
    en: '<p>The worker polls <code>SELECT * FROM event WHERE status = \'pending\' ORDER BY created_at LIMIT 10</code>. Only 1 % of rows are pending. Create an index that contains <b>only the pending rows</b>, ordered by created_at.</p>',
    vi: '<p>Worker liên tục hỏi <code>SELECT * FROM event WHERE status = \'pending\' ORDER BY created_at LIMIT 10</code>. Chỉ 1 % dòng là pending. Tạo chỉ mục chỉ chứa <b>các dòng pending</b>, sắp theo created_at.</p>',
    yc: [['<code>CREATE INDEX … ON event (created_at) WHERE status = \'pending\'</code>.', '<code>CREATE INDEX … ON event (created_at) WHERE status = \'pending\'</code>.'], ['The worker query must use it, and the index must be much smaller than a full one.', 'Truy vấn của worker phải dùng nó, và chỉ mục phải nhỏ hơn hẳn chỉ mục đầy đủ.']],
    giai: `CREATE INDEX idx_event_pending ON event (created_at) WHERE status = 'pending';
-- 200 entries instead of 20 000: tiny, always cached, and already in created_at order`,
    kiem: [
      sau(['The worker query uses the partial index, no Sort', 'Truy vấn worker dùng chỉ mục từng phần, không Sort'], `SELECT plan_text('${lit("SELECT * FROM event WHERE status = 'pending' ORDER BY created_at LIMIT 10")}') ~ 'Index Scan' AS index_scan, plan_text('${lit("SELECT * FROM event WHERE status = 'pending' ORDER BY created_at LIMIT 10")}') !~ 'Sort' AS no_sort`),
      sau(['The index is partial (has a predicate)', 'Chỉ mục là từng phần (có điều kiện)'], "SELECT count(*) AS partial_indexes FROM pg_index WHERE indrelid = 'event'::regclass AND indpred IS NOT NULL"),
      sau(['It holds only the pending rows', 'Nó chỉ chứa các dòng pending'], "SELECT max(c.reltuples)::int AS entries FROM pg_index i JOIN pg_class c ON c.oid = i.indexrelid WHERE i.indrelid = 'event'::regclass AND i.indpred IS NOT NULL", { an: true }),
    ],
    sai: ['CREATE INDEX idx_event_status_created ON event (status, created_at)', "CREATE INDEX idx_event_pending ON event (status) WHERE status = 'pending'"],
    gy: [['A partial index = an index + a WHERE clause; only matching rows are indexed.', 'Chỉ mục từng phần = chỉ mục + mệnh đề WHERE; chỉ dòng khớp mới được đánh chỉ mục.'], ['The query must imply the same predicate (status = \'pending\').', 'Truy vấn phải bao hàm đúng điều kiện đó (status = \'pending\').']],
    lhg: [['A full (status, created_at) index: works, but indexes 20 000 rows for a query that needs 200.', 'Chỉ mục đầy đủ (status, created_at): chạy được, nhưng đánh chỉ mục 20 000 dòng cho truy vấn chỉ cần 200.'], ['Indexing status in a partial index on status = \'pending\': every entry has the same key, nothing is sorted by time.', 'Đánh chỉ mục status trong chỉ mục từng phần status = \'pending\': mọi mục cùng một khoá, không sắp theo thời gian.']],
    gt: ['<p>Partial indexes shine for "hot" subsets (pending jobs, unread messages, active users): smaller, faster to update, and they skip the rows nobody searches. The planner uses one only when the query\'s WHERE implies the index predicate.</p>', '<p>Chỉ mục từng phần toả sáng với tập con "nóng" (việc pending, tin chưa đọc, user đang hoạt động): nhỏ hơn, cập nhật nhanh hơn, và bỏ qua các dòng không ai tìm. Planner chỉ dùng khi WHERE của truy vấn bao hàm điều kiện của chỉ mục.</p>'],
    tn: [tn('partial index', 'chỉ mục từng phần')],
  }),

  cs({
    t: 'Why is my index ignored?', k: 'MEDIUM', p: 6, kn: ['selectivity', 'sargability', 'type mismatch'], tag: ['index', 'planner'],
    en: '<p>An index exists on <code>event(status)</code>, <code>event(created_at)</code> and <code>event(email)</code>. Pick the reason each query does not use its index.</p>',
    vi: '<p>Đã có chỉ mục trên <code>event(status)</code>, <code>event(created_at)</code> và <code>event(email)</code>. Chọn lý do mỗi truy vấn không dùng chỉ mục.</p>',
    cau: [
      q('q1', ['<code>WHERE status = \'active\'</code> (66 % of rows)', '<code>WHERE status = \'active\'</code> (66 % số dòng)'], ['low selectivity: most rows match, a scan is cheaper', 'the index is broken and must be rebuilt', 'text columns cannot use a B-tree index', 'statistics are missing, so the planner guesses'], ['When a condition matches a large fraction of rows, random index access is slower than one sequential pass. The planner is right.', 'Khi điều kiện khớp phần lớn dòng, truy cập ngẫu nhiên qua chỉ mục chậm hơn một lượt đọc tuần tự. Planner đúng.']),
      q('q2', ['<code>WHERE date_trunc(\'day\', created_at) = \'2024-03-01\'</code>', '<code>WHERE date_trunc(\'day\', created_at) = \'2024-03-01\'</code>'], ['a function wraps the indexed column (not sargable)', 'the date literal has no time zone', 'date_trunc is not allowed in WHERE', 'low selectivity'], ['Rewrite as a range on the bare column: created_at &gt;= day AND created_at &lt; day + 1.', 'Viết lại thành khoảng trên cột trơn: created_at &gt;= ngày AND created_at &lt; ngày + 1.']),
      q('q3', ['<code>WHERE email LIKE \'%@example.com\'</code>', '<code>WHERE email LIKE \'%@example.com\'</code>'], ['a leading wildcard: a B-tree searches by prefix', 'LIKE can never use any kind of index', 'the email column is too long to index', 'the pattern is case-sensitive, ILIKE is needed'], ['B-trees are sorted by the beginning of the string; "ends with" needs a trigram (pg_trgm) index or a reversed-string index.', 'B-tree sắp theo đầu chuỗi; "kết thúc bằng" cần chỉ mục trigram (pg_trgm) hoặc chỉ mục trên chuỗi đảo ngược.']),
      q('q4', ['<code>WHERE email = 42</code> (an integer literal)', '<code>WHERE email = 42</code> (hằng số nguyên)'], ['type mismatch: PostgreSQL raises an error rather than guessing a cast', 'it uses the index after an implicit cast', 'low selectivity', 'the index needs a NOT NULL'], ['text = integer has no operator: "operator does not exist". Comparing with the right type (\'42\') lets the index work — and avoids silent full scans in other databases.', 'text = integer không có toán tử: "operator does not exist". So với đúng kiểu (\'42\') thì chỉ mục chạy — và tránh quét toàn bảng âm thầm ở các hệ khác.']),
    ],
    gy: [['Ask: does the query touch the bare indexed column with a matching operator?', 'Tự hỏi: truy vấn có chạm cột trơn được đánh chỉ mục bằng toán tử khớp không?'], ['Then: how many rows match?', 'Rồi: bao nhiêu dòng khớp?']],
    lhg: [['Forcing an index with tricks when the planner correctly chose a Seq Scan.', 'Ép dùng chỉ mục bằng mẹo khi planner đã đúng khi chọn Seq Scan.'], ['Assuming every WHERE on an indexed column will use the index.', 'Cho rằng mọi WHERE trên cột có chỉ mục đều dùng chỉ mục.']],
    tn: [tn('selectivity', 'độ chọn lọc'), tn('sargable', 'dùng được chỉ mục')],
  }),

  pg({
    csdl: CO_IDX_TIME, tenCsdl: 'event', ld: { en: O_EVENT.ld.en + '<p>This task already has <code>idx_event_created ON event(created_at)</code>.</p>', vi: O_EVENT.ld.vi + '<p>Bài này đã có sẵn <code>idx_event_created ON event(created_at)</code>.</p>' },
    t: 'Rewrite a non-sargable filter', k: 'HARD', p: 10, kn: ['sargable predicate', 'half-open range instead of date_trunc'], tag: ['index', 'rewrite'],
    en: '<p>The daily report runs <code>SELECT count(*), sum(amount) FROM event WHERE date_trunc(\'day\', created_at) = \'2024-03-01\'</code> and ignores <code>idx_event_created</code>. Rewrite it so it returns the same <code>events, total</code> (one row) and can use the index. Session time zone is UTC.</p>',
    vi: '<p>Báo cáo ngày chạy <code>SELECT count(*), sum(amount) FROM event WHERE date_trunc(\'day\', created_at) = \'2024-03-01\'</code> và bỏ qua <code>idx_event_created</code>. Viết lại để trả cùng <code>events, total</code> (một dòng) và dùng được chỉ mục. Múi giờ của phiên là UTC.</p>',
    yc: [['Leave created_at bare: <code>created_at &gt;= \'2024-03-01\' AND created_at &lt; \'2024-03-02\'</code>.', 'Để created_at trơn: <code>created_at &gt;= \'2024-03-01\' AND created_at &lt; \'2024-03-02\'</code>.'], ['Columns <code>events, total</code>.', 'Cột <code>events, total</code>.']],
    giai: `SELECT count(*) AS events, sum(amount) AS total
FROM event
WHERE created_at >= '2024-03-01'          -- the column stays bare ⇒ the B-tree can seek to the range
  AND created_at <  '2024-03-02';`,
    kiem: [
      kq(['144 events of 1 March', '144 sự kiện ngày 1/3']),
      kqAn(['Rows at the day boundaries', 'Dòng ở biên ngày'], "INSERT INTO event (user_id, status, amount, email, created_at, props) VALUES (1, 'done', 10, 'edge1@x.vn', '2024-03-01 00:00+00', '{}'), (1, 'done', 20, 'edge2@x.vn', '2024-03-02 00:00+00', '{}'), (1, 'done', 30, 'edge3@x.vn', '2024-03-01 23:59:59+00', '{}')"),
      sau(['The same predicate uses the index', 'Cùng điều kiện đó dùng chỉ mục'], `SELECT plan_nodes('${lit("SELECT count(*) FROM event WHERE created_at >= '2024-03-01' AND created_at < '2024-03-02'")}') ~ 'Index' AS uses_index`),
      ma(['No function around created_at', 'Không bọc created_at trong hàm'], 'date_trunc|\\w+\\s*\\(\\s*created_at|created_at\\s*::', true),
    ],
    sai: ["SELECT count(*) AS events, sum(amount) AS total FROM event WHERE date_trunc('day', created_at) = '2024-03-01'", "SELECT count(*) AS events, sum(amount) AS total FROM event WHERE created_at BETWEEN '2024-03-01' AND '2024-03-02'"],
    gy: [['"On day D" = from D 00:00 (inclusive) to D+1 00:00 (exclusive).', '"Trong ngày D" = từ 00:00 ngày D (gồm) tới 00:00 ngày D+1 (không gồm).'], ['A bare column + a range operator is what a B-tree can seek.', 'Cột trơn + toán tử khoảng là thứ B-tree tìm được.']],
    lhg: [['Keeping date_trunc(…) — correct numbers, Seq Scan forever.', 'Giữ date_trunc(…) — đúng số, nhưng Seq Scan mãi mãi.'], ['BETWEEN \'2024-03-01\' AND \'2024-03-02\' — includes the row at exactly midnight of 2 March.', 'BETWEEN \'2024-03-01\' AND \'2024-03-02\' — tính cả dòng đúng nửa đêm ngày 2/3.']],
    gt: ['<p>"Sargable" (Search ARGument ABLE) means the predicate compares the bare indexed column with something constant. Moving the computation to the constant side (a range) keeps the result and unlocks the index.</p>', '<p>"Sargable" nghĩa là vị từ so cột được đánh chỉ mục (để trơn) với một thứ hằng. Dời phép tính sang phía hằng (một khoảng) giữ nguyên kết quả mà mở khoá được chỉ mục.</p>'],
    tn: [tn('sargable', 'dùng được chỉ mục'), TN.index],
  }),
]);
