/**
 * DBI202 · ⭐ CS.1.2 — chuẩn SQL, NoSQL/NewSQL, CAP, so sánh bốn hệ, GitLab 2017, khác biệt cú pháp T-SQL ↔ PostgreSQL (slide 14–25).
 * Phần tự thêm, không thi — đề tĩnh.
 */
import { mod, cs, q, bang1, tn } from './_chung.mjs';

export default mod('dbi202-slide-cs1-2', '⭐ CS.1.2 SQL standards, NoSQL/NewSQL and dialects', [
  cs({
    t: 'Four NoSQL families: what they store and when to use them', k: 'EASY', p: 6, loai: 'table',
    kn: ['key-value', 'document', 'wide-column', 'graph'], tag: ['advanced', 'nosql'],
    en: '<p>Slide 17 names one product per NoSQL family. Fill the family and a fitting job for each.</p>',
    vi: '<p>Slide 17 nêu một sản phẩm cho mỗi họ NoSQL. Điền họ và một việc phù hợp cho từng sản phẩm.</p>',
    bang: [bang1('b1', ['Product → family → typical job', 'Sản phẩm → họ → việc điển hình'],
      [{ ma: 'sp', ten: 'Product / Sản phẩm' },
        { ma: 'ho', ten: 'Family / Họ', luaChon: ['key-value', 'document', 'wide-column', 'graph'] },
        { ma: 'viec', ten: 'Typical job / Việc điển hình', luaChon: ['session cache and counters', 'product catalogue with varied fields', 'huge write-heavy time series', 'friend-of-friend recommendations'] }],
      [{ o: { sp: 'Redis' }, a: { ho: 'key-value', viec: 'session cache and counters' } },
        { o: { sp: 'MongoDB' }, a: { ho: 'document', viec: 'product catalogue with varied fields' } },
        { o: { sp: 'Cassandra' }, a: { ho: 'wide-column', viec: 'huge write-heavy time series' } },
        { o: { sp: 'Neo4j' }, a: { ho: 'graph', viec: 'friend-of-friend recommendations' } }],
      ['Each family drops part of the relational model (joins, a fixed schema, strict consistency) to win one kind of workload.', 'Mỗi họ bỏ một phần của mô hình quan hệ (phép nối, lược đồ cố định, nhất quán chặt) để thắng một kiểu tải.'])],
    gy: [['Look-up by one key ⇒ key-value; nested JSON ⇒ document.', 'Tra theo một khoá ⇒ key-value; JSON lồng ⇒ document.'], ['Relationships are the data ⇒ graph.', 'Quan hệ chính là dữ liệu ⇒ graph.']],
    lhg: [['Calling MongoDB "key-value" — it stores and queries whole documents.', 'Gọi MongoDB là "key-value" — nó lưu và truy vấn cả tài liệu.'], ['Using a graph database for a write-heavy log.', 'Dùng CSDL đồ thị cho nhật ký ghi nhiều.']],
    tn: [tn('key-value store', 'kho khoá–giá trị'), tn('document store', 'kho tài liệu'), tn('wide-column store', 'kho cột rộng')],
  }),
  cs({
    t: 'SQL standards, CAP and NewSQL', k: 'MEDIUM', p: 7,
    kn: ['SQL standard', 'CAP theorem', 'NewSQL'], tag: ['advanced', 'nosql'],
    en: '<p>Five questions on slides 14–19.</p>', vi: '<p>Năm câu về slide 14–19.</p>',
    cau: [
      q('c1', ['Window functions (ROW_NUMBER() OVER …) entered the SQL standard in…', 'Hàm cửa sổ (ROW_NUMBER() OVER …) vào chuẩn SQL ở…'], ['SQL:2003', 'SQL-86', 'SQL-92', 'SQL:2023'], ['SQL:1999 brought recursive CTEs, SQL:2003 window functions, SQL:2016 JSON, SQL:2023 property-graph queries.', 'SQL:1999 thêm CTE đệ quy, SQL:2003 hàm cửa sổ, SQL:2016 JSON, SQL:2023 truy vấn đồ thị thuộc tính.']),
      q('c2', ['The CAP theorem says that during a network partition a distributed store must…', 'Định lý CAP nói khi mạng bị chia cắt, một kho phân tán phải…'], ['choose between consistency and availability', 'give up partition tolerance for good', 'switch to a relational model', 'lose every write made since the split'], ['P is not optional in a real network; the choice is C or A while the partition lasts.', 'P không tuỳ chọn trong mạng thật; phải chọn C hoặc A khi còn chia cắt.']),
      q('c3', ['NewSQL systems (CockroachDB, Google Spanner) aim to…', 'Hệ NewSQL (CockroachDB, Google Spanner) nhắm tới…'], ['keep SQL and ACID while scaling out', 'drop SQL in favour of JSON APIs', 'store every row as a key-value pair', 'replace transactions with eventual consistency'], ['They scale horizontally like NoSQL but keep relational guarantees.', 'Chúng mở rộng ngang như NoSQL nhưng giữ đảm bảo quan hệ.']),
      q('c4', ['Why do most business systems still start on a relational DBMS?', 'Vì sao đa số hệ thống doanh nghiệp vẫn bắt đầu bằng DBMS quan hệ?'], ['ACID, a query optimizer and decades of tooling', 'it is always faster than any NoSQL store', 'NoSQL stores cannot run on Linux servers', 'relational data never needs a backup'], ['Correctness and flexible querying matter more than raw scale for most systems.', 'Tính đúng và truy vấn linh hoạt quan trọng hơn quy mô thô với đa số hệ thống.']),
      q('c5', ['A single PostgreSQL server behind one web app is…', 'Một máy PostgreSQL duy nhất sau một web app là…'], ['not a CAP problem at all: nothing is distributed', 'a CP system that must reject writes', 'an AP system with eventual consistency', 'unable to guarantee ACID transactions'], ['CAP only applies to data spread over an unreliable network.', 'CAP chỉ áp dụng cho dữ liệu trải trên mạng không tin cậy.']),
    ],
    gy: [['1999 recursion · 2003 windows · 2016 JSON · 2023 graphs.', '1999 đệ quy · 2003 cửa sổ · 2016 JSON · 2023 đồ thị.'], ['CAP: P is a fact of life, the choice is C or A.', 'CAP: P là thực tế, lựa chọn là C hay A.']],
    lhg: [['Thinking CAP lets you "pick any two" freely.', 'Tưởng CAP cho "chọn hai bất kỳ" thoải mái.'], ['Applying CAP to a single server.', 'Áp CAP cho một máy chủ đơn.']],
    tn: [tn('CAP theorem', 'định lý CAP'), tn('network partition', 'chia cắt mạng'), tn('horizontal scaling', 'mở rộng ngang')],
  }),
  cs({
    t: 'T-SQL ↔ PostgreSQL: translate each piece', k: 'MEDIUM', p: 7, loai: 'table',
    kn: ['dialects', 'portability'], tag: ['advanced', 'dialect', 'postgresql'],
    en: '<p>Slide 23 lists the differences you meet first when moving a query between the two engines. Give the PostgreSQL counterpart of each T-SQL piece.</p>',
    vi: '<p>Slide 23 liệt kê các khác biệt gặp đầu tiên khi chuyển truy vấn giữa hai hệ. Cho phần tương ứng PostgreSQL của từng mảnh T-SQL.</p>',
    bang: [bang1('b1', ['T-SQL → PostgreSQL', 'T-SQL → PostgreSQL'],
      [{ ma: 't', ten: 'T-SQL' }, { ma: 'p', ten: 'PostgreSQL', luaChon: ['… LIMIT 3 at the end', 'COALESCE(x, 0)', "'a' || b", 'now()', 'GENERATED ALWAYS AS IDENTITY', 'SELECT version()', 'VARCHAR / TEXT (UTF-8)'] }],
      [{ o: { t: 'SELECT TOP 3 …' }, a: { p: '… LIMIT 3 at the end' } },
        { o: { t: 'ISNULL(x, 0)' }, a: { p: 'COALESCE(x, 0)' } },
        { o: { t: "N'a' + b" }, a: { p: "'a' || b" } },
        { o: { t: 'GETDATE()' }, a: { p: 'now()' } },
        { o: { t: 'INT IDENTITY(1,1)' }, a: { p: 'GENERATED ALWAYS AS IDENTITY' } },
        { o: { t: 'SELECT @@VERSION' }, a: { p: 'SELECT version()' } },
        { o: { t: 'NVARCHAR(50)' }, a: { p: 'VARCHAR / TEXT (UTF-8)' } }],
      ['COALESCE and OFFSET … FETCH NEXT … ROWS ONLY run on BOTH engines — prefer them when a query must be portable.', 'COALESCE và OFFSET … FETCH NEXT … ROWS ONLY chạy được trên CẢ HAI hệ — ưu tiên chúng khi truy vấn cần chạy ở cả hai.'])],
    gy: [['PostgreSQL strings are UTF-8 already: no N prefix needed.', 'Chuỗi PostgreSQL vốn là UTF-8: không cần tiền tố N.'], ['TOP moves to the end as LIMIT (or FETCH FIRST).', 'TOP chuyển xuống cuối thành LIMIT (hoặc FETCH FIRST).']],
    lhg: [['Using + to join strings in PostgreSQL — it is numeric addition there.', 'Dùng + nối chuỗi trong PostgreSQL — ở đó nó là phép cộng số.'], ['Forgetting that PostgreSQL sorts NULL first on DESC.', 'Quên PostgreSQL xếp NULL lên đầu khi DESC.']],
    tn: [tn('dialect', 'phương ngữ SQL'), tn('portable SQL', 'SQL chạy được nhiều hệ')],
  }),
  cs({
    t: 'GitLab, 31 January 2017: why five backups were not enough', k: 'MEDIUM', p: 6,
    kn: ['backup', 'restore test', '3-2-1 rule'], tag: ['advanced', 'operations'],
    en: '<p>Slide 22 retells the GitLab outage: a production database directory was deleted by mistake, and six hours of data were lost although five backup/replication methods existed.</p>',
    vi: '<p>Slide 22 kể lại sự cố GitLab: thư mục CSDL production bị xoá nhầm và mất sáu giờ dữ liệu dù có năm cách sao lưu/nhân bản.</p>',
    cau: [
      q('c1', ['The real root cause of the unrecoverable loss was…', 'Nguyên nhân gốc của việc mất không khôi phục được là…'], ['no one had tested that a restore actually worked', 'the engineer typed the command too quickly', 'PostgreSQL cannot be backed up while running', 'the team used only one backup method'], ['A backup is an action; a tested restore is a guarantee.', 'Sao lưu là một hành động; khôi phục đã thử là một đảm bảo.']),
      q('c2', ['The 3-2-1 rule means…', 'Quy tắc 3-2-1 nghĩa là…'], ['3 copies, on 2 kinds of media, 1 kept off-site', '3 backups a day, kept 2 weeks, 1 restore', '3 servers, 2 replicas, 1 primary', '3 DBAs, 2 approvals, 1 production key'], ['Three copies of the data, two different storage types, one copy in another location.', 'Ba bản dữ liệu, hai loại lưu trữ, một bản ở nơi khác.']),
      q('c3', ['A replica that copies every change instantly protects you from…', 'Một bản sao chép mọi thay đổi tức thì bảo vệ bạn khỏi…'], ['a dead server, but not from a mistaken DELETE', 'a mistaken DELETE, but not from a dead server', 'both a dead server and a mistaken DELETE', 'neither a dead server nor a mistaken DELETE'], ['Replication copies the mistake too; only a point-in-time backup can go back before it.', 'Nhân bản chép luôn cả sai lầm; chỉ sao lưu theo thời điểm mới quay lại trước nó.']),
    ],
    gy: [['Ask "when did we last restore it?", not "do we back it up?".', 'Hỏi "lần cuối khôi phục thử là khi nào?", không hỏi "có sao lưu không?".'], ['Replication ≠ backup.', 'Nhân bản ≠ sao lưu.']],
    lhg: [['Blaming only the human error.', 'Chỉ đổ lỗi cho sai sót của người.'], ['Counting a replica as a backup.', 'Tính bản sao nhân bản là một bản sao lưu.']],
    tn: [tn('point-in-time recovery', 'khôi phục về một thời điểm'), tn('replication', 'nhân bản')],
  }),
]);
