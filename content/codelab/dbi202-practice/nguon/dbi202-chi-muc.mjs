/**
 * DBI202 · 8.1 Chỉ mục & hiệu năng truy vấn — CREATE INDEX / CREATE UNIQUE INDEX (chấm trong trình duyệt), chọn cột đánh chỉ mục,
 * cái giá của chỉ mục.
 */
import { mod, de, cs, q, bang1, sau, chan, duoc, ma, tn } from './_chung.mjs';

export default mod('dbi202-chi-muc', '8.1 Indexes & query performance', [
  de({
    t: 'Index the foreign key you join on', k: 'EASY', p: 7,
    kn: ['CREATE INDEX', 'index on a foreign key'], tag: ['index', 'fuhcompany'],
    en: '<p>Every report joins tblWorksOn to tblProject on <code>proNum</code>, but tblWorksOn\'s primary key starts with empSSN, so searching by proNum scans the table. Create an index named <code>idx_workson_pronum</code> on <code>tblWorksOn(proNum)</code>.</p>',
    vi: '<p>Báo cáo nào cũng nối tblWorksOn với tblProject theo <code>proNum</code>, nhưng khoá chính của tblWorksOn bắt đầu bằng empSSN nên tìm theo proNum phải quét bảng. Tạo chỉ mục tên <code>idx_workson_pronum</code> trên <code>tblWorksOn(proNum)</code>.</p>',
    yc: [['CREATE INDEX idx_workson_pronum ON tblWorksOn (proNum); — the plain form runs on both SQL Server and PostgreSQL (NONCLUSTERED is the SQL Server default).', 'CREATE INDEX idx_workson_pronum ON tblWorksOn (proNum); — dạng thường chạy được cả SQL Server lẫn PostgreSQL (NONCLUSTERED là mặc định của SQL Server).']],
    giai: `CREATE INDEX idx_workson_pronum ON tblWorksOn (proNum);   -- a foreign key used in joins deserves an index`,
    kiem: [
      sau(['The index exists on tblWorksOn(proNum)', 'Chỉ mục có trên tblWorksOn(proNum)'], "SELECT lower(indexname) AS idx, lower(replace(indexdef, ' ', '')) AS def FROM pg_indexes WHERE lower(indexname) = 'idx_workson_pronum'"),
      duoc(['Writes still work', 'Vẫn ghi được'], 'INSERT INTO tblWorksOn VALUES (30121050037, 1, 5.0)'),
      ma(['Uses CREATE INDEX', 'Dùng CREATE INDEX'], '\\bCREATE\\s+(NONCLUSTERED\\s+)?INDEX\\b'),
    ],
    sai: ['CREATE INDEX idx_workson_pronum ON tblWorksOn (empSSN);', 'CREATE INDEX idx_workson_pronum ON tblProject (proNum);'],
    gy: [['Index the column the WHERE / JOIN searches on.', 'Đánh chỉ mục cột mà WHERE / JOIN tìm theo.'], ['tblWorksOn already has (empSSN, proNum) as its key — useless for "by proNum" (leftmost-prefix rule, lesson 8.2).', 'tblWorksOn đã có khoá (empSSN, proNum) — vô dụng cho "theo proNum" (luật tiền tố trái, bài 8.2).']],
    lhg: [['Indexing empSSN — already the first column of the primary key.', 'Đánh chỉ mục empSSN — vốn đã là cột đầu của khoá chính.'], ['Indexing tblProject.proNum — it is the primary key there; the slow side is tblWorksOn.', 'Đánh chỉ mục tblProject.proNum — đó là khoá chính rồi; phía chậm là tblWorksOn.']],
    gt: ['<p>SQL Server does NOT create indexes on foreign keys automatically (only on PRIMARY KEY and UNIQUE). Indexing the FK columns you join on is the most common quick win.</p>', '<p>SQL Server KHÔNG tự tạo chỉ mục cho khoá ngoại (chỉ cho PRIMARY KEY và UNIQUE). Đánh chỉ mục cột khoá ngoại dùng để nối là cách tăng tốc dễ nhất.</p>'],
    tn: [tn('index', 'chỉ mục'), tn('B-tree', 'cây B')],
  }),
  de({
    t: 'A unique index enforces a rule', k: 'MEDIUM', p: 8,
    kn: ['CREATE UNIQUE INDEX'], tag: ['index', 'unique', 'fuhcompany'],
    en: '<p>Two projects must never share a name. Create a unique index <code>ux_project_name</code> on <code>tblProject(proName)</code>: it speeds up searches by name AND rejects duplicates.</p>',
    vi: '<p>Hai dự án không bao giờ được trùng tên. Tạo chỉ mục duy nhất <code>ux_project_name</code> trên <code>tblProject(proName)</code>: vừa tăng tốc tìm theo tên VỪA từ chối trùng lặp.</p>',
    yc: [['CREATE UNIQUE INDEX ux_project_name ON tblProject (proName);', 'CREATE UNIQUE INDEX ux_project_name ON tblProject (proName);']],
    giai: `CREATE UNIQUE INDEX ux_project_name ON tblProject (proName);`,
    kiem: [
      chan(['A second project called ProjectA is rejected', 'Dự án thứ hai tên ProjectA bị từ chối'], "INSERT INTO tblProject VALUES (7, N'ProjectA', 1, 1)", '23505'),
      duoc(['A new name is accepted', 'Tên mới được nhận'], "INSERT INTO tblProject VALUES (7, N'ProjectG', 1, 1)"),
      sau(['The index exists', 'Chỉ mục tồn tại'], "SELECT lower(indexname) AS idx FROM pg_indexes WHERE lower(indexname) = 'ux_project_name'"),
    ],
    sai: ['CREATE INDEX ux_project_name ON tblProject (proName);'],
    gy: [['A UNIQUE constraint creates a unique index behind the scenes; you can also create one directly.', 'Ràng buộc UNIQUE tạo một chỉ mục duy nhất ở hậu trường; bạn cũng tạo trực tiếp được.'], ['CREATE UNIQUE INDEX name ON table (column)', 'CREATE UNIQUE INDEX tên ON bảng (cột)']],
    lhg: [['A plain index — fast searches but duplicates still allowed.', 'Chỉ mục thường — tìm nhanh nhưng vẫn cho trùng.'], ['Creating it while duplicates already exist — the CREATE fails (fix the data first).', 'Tạo khi đã có dữ liệu trùng — lệnh CREATE lỗi (sửa dữ liệu trước).']],
    gt: ['<p>Names are NVARCHAR (case-insensitive on SQL Server): N\'projecta\' would also be rejected there — and in this grader.</p>', '<p>Tên là NVARCHAR (không phân biệt hoa thường trên SQL Server): N\'projecta\' cũng bị từ chối ở đó — và ở máy chấm này.</p>'],
    tn: [tn('unique index', 'chỉ mục duy nhất')],
  }),
  cs({
    t: 'Which index helps this query?', k: 'MEDIUM', p: 8, loai: 'table',
    kn: ['index selection', 'selectivity'], tag: ['index'],
    en: '<p>Table <code>Orders(orderID PK, customerID, orderDate, status, total)</code> with 5 million rows; status has 3 values. For each frequent query pick the most useful new index.</p>',
    vi: '<p>Bảng <code>Orders(orderID PK, customerID, orderDate, status, total)</code> 5 triệu dòng; status có 3 giá trị. Với mỗi truy vấn thường gặp, chọn chỉ mục mới hữu ích nhất.</p>',
    bang: [bang1('b1', ['Query → index', 'Truy vấn → chỉ mục'],
      [{ ma: 'tv', ten: 'Query / Truy vấn' }, { ma: 'cs', ten: 'Index / Chỉ mục', luaChon: ['(customerID)', '(orderDate)', '(customerID, orderDate)', 'none (scan is fine)', '(status)'] }],
      [{ o: { tv: 'WHERE customerID = 42' }, a: { cs: '(customerID)' } },
        { o: { tv: "WHERE orderDate >= '2026-10-01' AND orderDate < '2026-11-01'" }, a: { cs: '(orderDate)' } },
        { o: { tv: 'WHERE customerID = 42 ORDER BY orderDate DESC' }, a: { cs: '(customerID, orderDate)' } },
        { o: { tv: "WHERE status = 'paid' (about a third of the rows)" }, a: { cs: 'none (scan is fine)' } }],
      ['Equality on one column ⇒ index it; a range ⇒ index the range column; equality + sort ⇒ composite (equality column first, then the sort column). A predicate matching a third of the table is not selective: reading by index would cost more than scanning.', 'So bằng trên một cột ⇒ đánh chỉ mục cột đó; khoảng ⇒ cột khoảng; so bằng + sắp ⇒ chỉ mục ghép (cột so bằng trước, cột sắp sau). Điều kiện khớp một phần ba bảng không đủ chọn lọc: đọc qua chỉ mục tốn hơn quét.'])],
    gy: [['Selective = returns few rows. Only selective predicates benefit from a nonclustered index.', 'Chọn lọc = trả ít dòng. Chỉ điều kiện chọn lọc mới lợi từ chỉ mục nonclustered.'], ['For "= x ORDER BY y", the composite (x, y) gives the rows already sorted.', 'Với "= x ORDER BY y", chỉ mục ghép (x, y) cho dòng đã sắp sẵn.']],
    lhg: [['Indexing a low-selectivity column like status.', 'Đánh chỉ mục cột ít chọn lọc như status.'], ['(orderDate, customerID) for "customerID = 42 ORDER BY orderDate" — the equality column must come first.', '(orderDate, customerID) cho "customerID = 42 ORDER BY orderDate" — cột so bằng phải đứng trước.']],
    tn: [tn('selectivity', 'độ chọn lọc')],
  }),
  cs({
    t: 'What an index costs', k: 'EASY', p: 6,
    kn: ['B-tree', 'write cost', 'storage'], tag: ['index'],
    en: '<p>Lesson 8.1 in four questions.</p>', vi: '<p>Bài 8.1 trong bốn câu.</p>',
    cau: [
      q('c1', ['Finding one row among 1,000,000 with a B-tree index takes about how many page reads?', 'Tìm một dòng trong 1.000.000 dòng bằng chỉ mục cây B tốn khoảng bao nhiêu lần đọc trang?'], ['3–4 (the tree height)', '1,000,000', '500,000', '1,000'], ['B-trees are very wide (hundreds of keys per page), so the height stays tiny: O(log n).', 'Cây B rất rộng (hàng trăm khoá mỗi trang) nên chiều cao rất nhỏ: O(log n).']),
      q('c2', ['A table has 8 indexes. One INSERT must…', 'Một bảng có 8 chỉ mục. Một câu INSERT phải…'], ['write the row and update all 8 indexes', 'write only the table row', 'rebuild the 8 indexes', 'lock the whole database'], ['Each index is a separate sorted structure to maintain on every write.', 'Mỗi chỉ mục là một cấu trúc sắp xếp riêng phải bảo trì mỗi lần ghi.']),
      q('c3', ['Which columns get an index automatically in SQL Server?', 'Cột nào được SQL Server tự đánh chỉ mục?'], ['PRIMARY KEY and UNIQUE columns', 'every FOREIGN KEY column', 'every NOT NULL column', 'every column used in a WHERE'], ['Foreign keys do NOT get one — add it yourself when you join on them.', 'Khoá ngoại KHÔNG được tự đánh — tự thêm khi bạn nối theo chúng.']),
      q('c4', ['Indexing every column "just in case" leads to…', 'Đánh chỉ mục mọi cột "cho chắc" dẫn tới…'], ['slower writes and wasted storage, with little read benefit', 'the fastest possible reads and writes everywhere', 'the optimizer rewriting every query for you', 'smaller tables because data is compressed'], ['Index the columns your frequent queries filter, join or sort on — not all of them.', 'Đánh chỉ mục cột mà truy vấn thường xuyên lọc, nối hoặc sắp — không phải mọi cột.']),
    ],
    gy: [['Reads get faster, writes get slower.', 'Đọc nhanh hơn, ghi chậm hơn.'], ['PK and UNIQUE come with an index; FKs do not.', 'PK và UNIQUE có sẵn chỉ mục; FK thì không.']],
    lhg: [['Thinking FKs are indexed automatically.', 'Tưởng FK được tự đánh chỉ mục.'], ['Thinking more indexes are always better.', 'Tưởng càng nhiều chỉ mục càng tốt.']],
    tn: [tn('index maintenance', 'bảo trì chỉ mục')],
  }),
]);
