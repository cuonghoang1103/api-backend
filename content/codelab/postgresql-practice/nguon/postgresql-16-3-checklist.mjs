/**
 * PostgreSQL · 16.3 — Checklist trước khi có người dùng thật. Chạy THẬT trên CT Shop: khoá ngoại thiếu chỉ mục (pg_constraint
 * + pg_index), role ứng dụng quyền tối thiểu + timeout gắn vào role (SET ROLE để thử), và bản checklist thu nhỏ thành một
 * truy vấn đọc thiết lập/danh mục thật (đổi thiết lập trong giao dịch ⇒ dòng chuyển ✓).
 */
import { mod, pg, cs, bang1, kq, kqAn, sau, chan, duoc, ma, tn } from './_chung.mjs';

const T = { thuTu: true };

const FK_KHONG_CHI_MUC = `SELECT c.conrelid::regclass::text AS table_name,
       a.attname AS fk_column,
       c.confrelid::regclass::text AS references_table
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
WHERE c.contype = 'f'
  AND array_length(c.conkey, 1) = 1
  AND NOT EXISTS (                                   -- no index whose FIRST column is the FK column
        SELECT 1 FROM pg_index i
        WHERE i.indrelid = c.conrelid AND i.indkey[0] = c.conkey[1])
ORDER BY table_name, fk_column;`;

const APP = `CREATE ROLE ctshop_app LOGIN PASSWORD 'app-secret';
ALTER ROLE ctshop_app SET statement_timeout = '5s';
ALTER ROLE ctshop_app SET idle_in_transaction_session_timeout = '30s';
GRANT USAGE ON SCHEMA public TO ctshop_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ctshop_app;   -- data, not structure`;

const CHECKLIST = `SELECT '1 idle_in_transaction_session_timeout' AS item,
       current_setting('idle_in_transaction_session_timeout') AS value,
       current_setting('idle_in_transaction_session_timeout') <> '0' AS ok
UNION ALL
SELECT '2 statement_timeout', current_setting('statement_timeout'), current_setting('statement_timeout') <> '0'
UNION ALL
SELECT '3 log_lock_waits', current_setting('log_lock_waits'), current_setting('log_lock_waits') = 'on'
UNION ALL
SELECT '4 foreign keys without an index', count(*)::text, count(*) = 0
FROM pg_constraint c
WHERE c.contype = 'f' AND NOT EXISTS (SELECT 1 FROM pg_index i WHERE i.indrelid = c.conrelid AND i.indkey[0] = c.conkey[1])
UNION ALL
SELECT '5 INVALID indexes (failed CONCURRENTLY)', count(*)::text, count(*) = 0
FROM pg_index WHERE NOT indisvalid
ORDER BY item;`;

export default mod('postgresql-16-3-checklist', '16.3 The production checklist', [
  pg({
    t: 'Foreign keys without an index', k: 'MEDIUM', p: 12, kn: ['pg_constraint.conkey', 'pg_index.indkey[0]', 'leading-column rule', 'cost of deleting a parent row'], tag: ['checklist', 'catalog', 'index', 'ctshop'],
    en: '<p>Item 8 of the checklist. List every single-column foreign key of CT Shop whose column is <b>not the first column of any index</b> on its table: <code>table_name, fk_column, references_table</code>, ordered by table then column. (A primary key or UNIQUE that starts with the column counts as an index.)</p>',
    vi: '<p>Mục 8 của checklist. Liệt kê mọi khoá ngoại một cột của CT Shop mà cột đó <b>không phải cột đầu tiên của chỉ mục nào</b> trên bảng của nó: <code>table_name, fk_column, references_table</code>, sắp theo bảng rồi cột. (Khoá chính hay UNIQUE bắt đầu bằng cột đó cũng tính là chỉ mục.)</p>',
    yc: [['<code>conkey[1]</code> is the FK column number (arrays start at 1); <code>indkey[0]</code> is the first column of an index (int2vector starts at 0).', '<code>conkey[1]</code> là số thứ tự cột khoá ngoại (mảng bắt đầu từ 1); <code>indkey[0]</code> là cột đầu của chỉ mục (int2vector bắt đầu từ 0).'], ['Join pg_attribute to turn the number into a name.', 'Nối pg_attribute để đổi số thành tên.']],
    giai: FK_KHONG_CHI_MUC,
    kiem: [
      kq(['Seven foreign keys without an index', 'Bảy khoá ngoại không có chỉ mục'], T),
      kqAn(['After indexing orders.customer_id and review.customer_id', 'Sau khi đánh chỉ mục orders.customer_id và review.customer_id'], 'CREATE INDEX ON orders (customer_id); CREATE INDEX ON review (customer_id, created_at)', T),
      kqAn(['An index where the FK is the SECOND column does not count', 'Chỉ mục mà khoá ngoại là cột THỨ HAI thì không tính'], 'CREATE INDEX ON stock_movement (created_at, product_id)', T),
    ],
    sai: [
      "SELECT c.conrelid::regclass::text AS table_name, a.attname AS fk_column, c.confrelid::regclass::text AS references_table FROM pg_constraint c JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1] WHERE c.contype = 'f' AND NOT EXISTS (SELECT 1 FROM pg_index i WHERE i.indrelid = c.conrelid AND c.conkey[1] = ANY (i.indkey)) ORDER BY table_name, fk_column",
      "SELECT c.conrelid::regclass::text AS table_name, a.attname AS fk_column, c.confrelid::regclass::text AS references_table FROM pg_constraint c JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1] WHERE c.contype = 'f' AND NOT EXISTS (SELECT 1 FROM pg_index i WHERE i.indrelid = c.conrelid AND i.indkey[0] = c.conkey[1] AND NOT i.indisunique) ORDER BY table_name, fk_column",
    ],
    gy: [['order_item.order_id is covered by the primary key (order_id, product_id); payment.order_id by its UNIQUE.', 'order_item.order_id được khoá chính (order_id, product_id) phủ; payment.order_id được UNIQUE của nó phủ.'], ['<code>c.conkey[1] = ANY (i.indkey)</code> accepts any position — too lenient.', '<code>c.conkey[1] = ANY (i.indkey)</code> nhận mọi vị trí — quá dễ dãi.']],
    lhg: [['Counting an index where the FK column is not first — the leading-column rule of chapter 9.', 'Tính cả chỉ mục mà cột khoá ngoại không đứng đầu — luật cột dẫn đầu của chương 9.'], ['Ignoring unique indexes — a UNIQUE (product_id, customer_id) serves lookups by product_id.', 'Bỏ qua chỉ mục unique — UNIQUE (product_id, customer_id) phục vụ tra theo product_id.']],
    gt: ['<p>PostgreSQL indexes the referenced side (it must be unique) but never the referencing side. Without one, deleting a customer scans orders and review to check the constraint, and joins from the parent are scans. On the site\'s real schema this query found 187 — each needs a decision (how parents are deleted, how big the table is), not a blind loop of CREATE INDEX.</p>', '<p>PostgreSQL đánh chỉ mục phía được tham chiếu (bắt buộc unique) nhưng không bao giờ phía tham chiếu. Thiếu nó, xoá một khách sẽ quét orders và review để kiểm ràng buộc, và phép nối từ bảng cha là quét. Trên lược đồ thật của web truy vấn này tìm ra 187 — mỗi cái cần một quyết định (bảng cha bị xoá thế nào, bảng lớn cỡ nào), không phải một vòng CREATE INDEX mù quáng.</p>'],
    tn: [tn('referencing column', 'cột tham chiếu'), tn('int2vector', 'vector số nguyên 2 byte')],
  }),

  pg({
    t: 'The application role: least privilege, timeouts on the role', k: 'MEDIUM', p: 10, kn: ['ALTER ROLE … SET statement_timeout', 'idle_in_transaction_session_timeout', 'DML grants, not ownership'], tag: ['checklist', 'roles', 'ctshop'],
    en: '<p>Item 7. Create <code>ctshop_app</code> (LOGIN) with <code>statement_timeout = \'5s\'</code> and <code>idle_in_transaction_session_timeout = \'30s\'</code> set <b>on the role</b>, and only SELECT, INSERT, UPDATE, DELETE on the tables of schema public. It must not be able to drop or truncate anything — migrations run as the owner.</p>',
    vi: '<p>Mục 7. Tạo <code>ctshop_app</code> (LOGIN) với <code>statement_timeout = \'5s\'</code> và <code>idle_in_transaction_session_timeout = \'30s\'</code> đặt <b>trên role</b>, và chỉ có SELECT, INSERT, UPDATE, DELETE trên các bảng của schema public. Nó không được xoá hay truncate bất cứ thứ gì — migration chạy bằng role chủ sở hữu.</p>',
    yc: [['<code>ALTER ROLE ctshop_app SET …</code> applies to every new session of that role — no app code needed.', '<code>ALTER ROLE ctshop_app SET …</code> áp cho mọi phiên mới của role đó — không cần sửa mã app.'], ['Identity columns need no extra sequence grant for INSERT.', 'Cột identity không cần cấp thêm quyền sequence để INSERT.']],
    giai: APP,
    kiem: [
      sau(['The role and its settings', 'Role và thiết lập của nó'], "SELECT r.rolname, r.rolcanlogin, r.rolsuper, (SELECT array_agg(x ORDER BY x) FROM unnest(s.setconfig) x)::text AS settings FROM pg_roles r LEFT JOIN pg_db_role_setting s ON s.setrole = r.oid WHERE r.rolname = 'ctshop_app'"),
      duoc(['As ctshop_app: read, insert, update and delete work', 'Với ctshop_app: đọc, chèn, sửa, xoá đều chạy'], "SET ROLE ctshop_app; SELECT count(*) FROM orders; INSERT INTO orders (customer_id) VALUES (8); UPDATE orders SET status = 'paid' WHERE id = 1; DELETE FROM review WHERE id = 8"),
      chan(['As ctshop_app: DROP TABLE is refused', 'Với ctshop_app: DROP TABLE bị từ chối'], 'SET ROLE ctshop_app; DROP TABLE review', '42501'),
      chan(['As ctshop_app: TRUNCATE is refused', 'Với ctshop_app: TRUNCATE bị từ chối'], 'SET ROLE ctshop_app; TRUNCATE customer CASCADE', '42501', { an: true }),
    ],
    sai: [
      "CREATE ROLE ctshop_app LOGIN PASSWORD 'app-secret'; ALTER ROLE ctshop_app SET statement_timeout = '5s'; ALTER ROLE ctshop_app SET idle_in_transaction_session_timeout = '30s'; GRANT ALL ON ALL TABLES IN SCHEMA public TO ctshop_app;",
      "CREATE ROLE ctshop_app LOGIN PASSWORD 'app-secret'; GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ctshop_app;",
      "CREATE ROLE ctshop_app LOGIN PASSWORD 'app-secret'; ALTER ROLE ctshop_app SET statement_timeout = '5s'; ALTER ROLE ctshop_app SET idle_in_transaction_session_timeout = '30s'; GRANT SELECT ON ALL TABLES IN SCHEMA public TO ctshop_app;",
    ],
    gy: [['GRANT ALL includes TRUNCATE (and REFERENCES, TRIGGER).', 'GRANT ALL gồm cả TRUNCATE (và REFERENCES, TRIGGER).'], ['DROP needs ownership — a grant can never give it.', 'DROP cần quyền sở hữu — không lệnh GRANT nào cho được.']],
    lhg: [['Letting the app log in as the owner (or postgres) — one SQL injection is a DROP TABLE.', 'Cho app đăng nhập bằng chủ sở hữu (hoặc postgres) — một lỗi SQL injection là một DROP TABLE.'], ['Setting timeouts in the app\'s connection string only — psql sessions and workers of the same role miss them.', 'Chỉ đặt timeout trong chuỗi kết nối của app — phiên psql và worker cùng role bỏ lỡ chúng.']],
    gt: ['<p>Measured in the lesson: logged in as ctshop_app, SELECT and INSERT work while DROP TABLE orders → must be owner of table orders and TRUNCATE → permission denied. Timeouts on the role catch the runaway query and the forgotten BEGIN no matter which program opened the session.</p>', '<p>Đo trong bài: đăng nhập bằng ctshop_app, SELECT và INSERT chạy còn DROP TABLE orders → must be owner of table orders và TRUNCATE → permission denied. Timeout trên role bắt được truy vấn chạy mãi và BEGIN bị quên, bất kể chương trình nào mở phiên.</p>'],
    tn: [tn('least privilege', 'quyền tối thiểu'), tn('owner role', 'role chủ sở hữu')],
  }),

  pg({
    t: 'The checklist as one query', k: 'HARD', p: 15, kn: ['current_setting', 'UNION ALL of checks', 'pg_index.indisvalid'], tag: ['checklist', 'catalog'],
    en: '<p>Turn five checklist items into one query returning <code>item, value, ok</code>, ordered by item, with exactly these item labels:</p><ul><li><code>1 idle_in_transaction_session_timeout</code> — ok when not <code>0</code></li><li><code>2 statement_timeout</code> — ok when not <code>0</code></li><li><code>3 log_lock_waits</code> — ok when <code>on</code></li><li><code>4 foreign keys without an index</code> — value = the count as text, ok when 0</li><li><code>5 INVALID indexes (failed CONCURRENTLY)</code> — value = the count as text, ok when 0</li></ul>',
    vi: '<p>Biến năm mục checklist thành một truy vấn trả về <code>item, value, ok</code>, sắp theo item, với đúng các nhãn sau:</p><ul><li><code>1 idle_in_transaction_session_timeout</code> — ok khi khác <code>0</code></li><li><code>2 statement_timeout</code> — ok khi khác <code>0</code></li><li><code>3 log_lock_waits</code> — ok khi là <code>on</code></li><li><code>4 foreign keys without an index</code> — value = số đếm dạng chữ, ok khi bằng 0</li><li><code>5 INVALID indexes (failed CONCURRENTLY)</code> — value = số đếm dạng chữ, ok khi bằng 0</li></ul>',
    yc: [['<code>current_setting(\'name\')</code> returns the effective value as text.', '<code>current_setting(\'tên\')</code> trả giá trị đang hiệu lực dạng chữ.'], ['A failed CREATE INDEX CONCURRENTLY leaves an index with <code>indisvalid = false</code>.', 'CREATE INDEX CONCURRENTLY hỏng để lại chỉ mục có <code>indisvalid = false</code>.']],
    giai: CHECKLIST,
    kiem: [
      kq(['A fresh server: mostly red', 'Máy chủ mới: phần lớn đỏ'], T),
      kqAn(['After setting two timeouts and turning on log_lock_waits', 'Sau khi đặt hai timeout và bật log_lock_waits'], "SET idle_in_transaction_session_timeout = '30s'; SET statement_timeout = '5s'; SET log_lock_waits = on", T),
      kqAn(['After indexing every foreign key', 'Sau khi đánh chỉ mục mọi khoá ngoại'], 'CREATE INDEX ON category (parent_id); CREATE INDEX ON product (category_id); CREATE INDEX ON orders (customer_id); CREATE INDEX ON order_item (product_id); CREATE INDEX ON stock_movement (product_id); CREATE INDEX ON stock_movement (order_id); CREATE INDEX ON review (customer_id)', T),
    ],
    sai: [
      CHECKLIST.replace("current_setting('log_lock_waits') = 'on'", 'true'),
      CHECKLIST.replace('i.indkey[0] = c.conkey[1]', 'c.conkey[1] = ANY (i.indkey)'),
    ],
    gy: [['One SELECT per item, glued with UNION ALL; the ORDER BY applies to the whole result.', 'Mỗi mục một SELECT, ghép bằng UNION ALL; ORDER BY áp cho cả kết quả.'], ['Every branch must return the same three column types (text, text, boolean).', 'Mọi nhánh phải trả cùng ba kiểu cột (text, text, boolean).']],
    lhg: [['Hard-coding ok = true for settings "we always set" — the checklist exists because they drift.', 'Viết cứng ok = true cho thiết lập "lúc nào cũng đặt" — checklist tồn tại chính vì chúng trôi.'], ['Forgetting the ::text cast — UNION ALL refuses to mix bigint and text.', 'Quên ép ::text — UNION ALL không chịu trộn bigint với text.']],
    gt: ['<p>The lesson\'s full script has 12 lines; run on a fresh production image it was mostly red, and four settings, one role setting and a restart turned items 3–7 green. Schedule it: every item decays (a new worker, a rotated password, a table that grew).</p>', '<p>Script đầy đủ của bài có 12 dòng; chạy trên ảnh production mới thì phần lớn đỏ, và bốn thiết lập, một thiết lập role và một lần khởi động lại đã chuyển mục 3–7 sang xanh. Hãy chạy nó theo lịch: mục nào cũng mục dần (thêm worker, đổi mật khẩu, bảng lớn lên).</p>'],
    tn: [tn('current_setting', 'giá trị thiết lập đang hiệu lực'), tn('indisvalid', 'chỉ mục hợp lệ')],
  }),

  cs({
    t: 'Which failure does each item prevent?', k: 'EASY', p: 6, kn: ['restore drill', 'connection arithmetic', 'pg_stat_statements preloaded', 'no read-modify-write'], tag: ['checklist'], loai: 'table',
    en: '<p>Match each checklist item with the failure it prevents.</p>', vi: '<p>Ghép mỗi mục checklist với sự cố nó ngăn.</p>',
    bang: [bang1('b1', ['Item → failure', 'Mục → sự cố'], [{ ma: 'i', ten: 'Item / Mục' }, { ma: 'f', ten: 'Prevents / Ngăn', luaChon: ['backups that cannot be restored', 'too many clients already', 'no history during the incident', 'silent lost updates', 'a migration that queues the whole site', 'disk full from retained WAL'] }], [
      { o: { i: 'A restore rehearsed end to end, with row counts compared / Diễn tập khôi phục trọn vẹn, có so số dòng' }, a: { f: 'backups that cannot be restored' } },
      { o: { i: '(processes × pool) < max_connections with headroom / (tiến trình × pool) < max_connections, có dư' }, a: { f: 'too many clients already' } },
      { o: { i: "shared_preload_libraries = 'pg_stat_statements' / nạp sẵn pg_stat_statements" }, a: { f: 'no history during the incident' } },
      { o: { i: 'UPDATE … SET balance = balance - $1 instead of read-then-write / UPDATE … SET balance = balance - $1 thay vì đọc rồi ghi' }, a: { f: 'silent lost updates' } },
      { o: { i: 'SET lock_timeout before DDL / Đặt lock_timeout trước DDL' }, a: { f: 'a migration that queues the whole site' } },
      { o: { i: 'No replication slot with active = f and a growing size / Không có khe sao chép active = f mà ngày càng lớn' }, a: { f: 'disk full from retained WAL' } },
    ], ['Each item is a chapter restated as something you can verify in an afternoon: 15.1, 14.1, 14.4, 11.4, 16.1, 15.2.', 'Mỗi mục là một chương được viết lại thành thứ kiểm được trong một buổi chiều: 15.1, 14.1, 14.4, 11.4, 16.1, 15.2.'])],
    gy: [['Each failure is silent until the day it happens.', 'Mỗi sự cố đều im lặng cho tới ngày nó xảy ra.'], ['Think which chapter each line comes from.', 'Nghĩ xem mỗi dòng đến từ chương nào.']],
    lhg: [['Treating the list as a one-time launch checklist.', 'Coi danh sách là checklist làm một lần trước khi ra mắt.'], ['Raising max_connections instead of fixing the arithmetic.', 'Tăng max_connections thay vì sửa phép tính.']],
    tn: [tn('checklist', 'danh sách kiểm')],
  }),
]);
