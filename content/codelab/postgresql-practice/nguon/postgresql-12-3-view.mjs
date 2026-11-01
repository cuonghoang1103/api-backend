/** PostgreSQL · 12.3 — View: truy vấn có tên, view cập nhật được, WITH CHECK OPTION, view cho ứng dụng (CT Shop). */
import { mod, pg, cs, q, sau, chan, duoc, ma, tn } from './_chung.mjs';
import { O_NOTES12 } from './_du-lieu.mjs';

export default mod('postgresql-12-3-view', '12.3 Views: a query with a name', [
  pg({
    ...O_NOTES12, t: 'Name a summary query: note_summary', k: 'EASY', p: 6, kn: ['CREATE VIEW', 'aggregate view'], tag: ['view'],
    en: '<p>Create the view <code>note_summary (user_id, email, notes, tong_views)</code>: one row per user with the number of notes and the total views. Then the dashboard can just say <code>SELECT * FROM note_summary ORDER BY tong_views DESC LIMIT 3</code>.</p>',
    vi: '<p>Tạo view <code>note_summary (user_id, email, notes, tong_views)</code>: mỗi user một dòng với số ghi chú và tổng views. Khi đó dashboard chỉ cần <code>SELECT * FROM note_summary ORDER BY tong_views DESC LIMIT 3</code>.</p>',
    yc: [['<code>CREATE VIEW note_summary AS SELECT u.id AS user_id, u.email, count(n.id) AS notes, COALESCE(sum(n.views), 0) AS tong_views …</code>.', '<code>CREATE VIEW note_summary AS SELECT u.id AS user_id, u.email, count(n.id) AS notes, COALESCE(sum(n.views), 0) AS tong_views …</code>.'], ['Users without notes still appear (LEFT JOIN).', 'User chưa có ghi chú vẫn xuất hiện (LEFT JOIN).']],
    giai: `CREATE VIEW note_summary AS
SELECT u.id AS user_id, u.email,
       count(n.id)               AS notes,
       COALESCE(sum(n.views), 0) AS tong_views
FROM users u
LEFT JOIN notes n ON n.user_id = u.id
GROUP BY u.id, u.email;`,
    kiem: [
      sau(['Top 3 users by views', 'Top 3 user theo views'], 'SELECT * FROM note_summary ORDER BY tong_views DESC, user_id LIMIT 3', { thuTu: true }),
      sau(['The view follows new data (it stores nothing)', 'View đi theo dữ liệu mới (nó không lưu gì)'], "INSERT INTO users (email) VALUES ('new@notes.vn'); UPDATE notes SET views = 1000 WHERE id = 5; SELECT user_id, notes, tong_views FROM note_summary WHERE user_id IN (6, 21) ORDER BY user_id", { thuTu: true }),
      sau(['It is a view, not a table', 'Đó là view, không phải bảng'], "SELECT table_type FROM information_schema.tables WHERE table_name = 'note_summary'"),
    ],
    sai: ['CREATE TABLE note_summary AS SELECT u.id AS user_id, u.email, count(n.id) AS notes, COALESCE(sum(n.views), 0) AS tong_views FROM users u LEFT JOIN notes n ON n.user_id = u.id GROUP BY u.id, u.email', 'CREATE VIEW note_summary AS SELECT u.id AS user_id, u.email, count(n.id) AS notes, sum(n.views) AS tong_views FROM users u JOIN notes n ON n.user_id = u.id GROUP BY u.id, u.email'],
    gy: [['A view is a saved SELECT; querying it runs the SELECT.', 'View là câu SELECT được lưu; truy vấn nó là chạy câu SELECT đó.'], ['LEFT JOIN + count(n.id) + COALESCE for users without notes.', 'LEFT JOIN + count(n.id) + COALESCE cho user chưa có ghi chú.']],
    lhg: [['CREATE TABLE AS — a frozen copy that is wrong after the next write.', 'CREATE TABLE AS — một bản sao đông cứng, sai ngay sau lần ghi kế tiếp.'], ['INNER JOIN — new users vanish from the summary.', 'INNER JOIN — user mới biến mất khỏi bảng tóm tắt.']],
    gt: ['<p>A view gives a query a name and a stable interface: callers do not repeat the join and the grouping, and you can change the inside later. It stores no data, so it is always current.</p>', '<p>View đặt tên cho truy vấn và cho một giao diện ổn định: người gọi không phải lặp lại phép nối và gom nhóm, và bạn đổi được phần bên trong sau này. Nó không lưu dữ liệu nên luôn mới.</p>'],
    tn: [tn('view', 'bảng ảo (truy vấn có tên)')],
  }),

  pg({
    ...O_NOTES12, t: 'A writable view that cannot leak rows: WITH CHECK OPTION', k: 'MEDIUM', p: 8, kn: ['auto-updatable view', 'WITH CHECK OPTION', 'SQLSTATE 44000'], tag: ['view', 'security'],
    en: '<p>User 1\'s screen works through the view <code>note_cua_user1</code> = the notes of user 1. Make it writable for that screen, but so that an UPDATE or INSERT through the view can never create a row that the view would not show (for example moving a note to user 2).</p>',
    vi: '<p>Màn hình của user 1 làm việc qua view <code>note_cua_user1</code> = các ghi chú của user 1. Cho nó ghi được với màn hình đó, nhưng sao cho UPDATE hay INSERT qua view không bao giờ tạo ra dòng mà view không hiện (vd chuyển ghi chú sang user 2).</p>',
    yc: [['<code>CREATE VIEW note_cua_user1 AS SELECT id, user_id, title, views FROM notes WHERE user_id = 1 WITH CHECK OPTION</code>.', '<code>CREATE VIEW note_cua_user1 AS SELECT id, user_id, title, views FROM notes WHERE user_id = 1 WITH CHECK OPTION</code>.'], ['A simple single-table view is automatically updatable.', 'View đơn giản trên một bảng tự động cập nhật được.']],
    giai: `CREATE VIEW note_cua_user1 AS
SELECT id, user_id, title, views
FROM notes
WHERE user_id = 1
WITH CHECK OPTION;            -- writes through the view must still satisfy WHERE user_id = 1`,
    kiem: [
      duoc(['Editing a note of user 1 through the view works', 'Sửa ghi chú của user 1 qua view thì được'], "UPDATE note_cua_user1 SET views = views + 1 WHERE id = 20"),
      chan(['Moving a note to user 2 through the view is refused', 'Chuyển ghi chú sang user 2 qua view bị từ chối'], 'UPDATE note_cua_user1 SET user_id = 2 WHERE id = 20', '44000'),
      chan(['Inserting a note of user 3 through the view is refused', 'Chèn ghi chú của user 3 qua view bị từ chối'], "INSERT INTO note_cua_user1 (user_id, title) VALUES (3, 'sneaky')", '44000'),
      sau(['The view shows the 25 notes of user 1', 'View hiện 25 ghi chú của user 1'], 'SELECT count(*) AS notes FROM note_cua_user1', { an: true }),
    ],
    sai: ['CREATE VIEW note_cua_user1 AS SELECT id, user_id, title, views FROM notes WHERE user_id = 1'],
    gy: [['Without CHECK OPTION the view filters what you SEE, not what you WRITE.', 'Không có CHECK OPTION thì view lọc thứ bạn THẤY, không lọc thứ bạn GHI.'], ['The error SQLSTATE is 44000 (with_check_option_violation).', 'SQLSTATE của lỗi là 44000 (with_check_option_violation).']],
    lhg: [['A plain view: UPDATE … SET user_id = 2 succeeds and the note "disappears" from user 1\'s screen into user 2\'s.', 'View thường: UPDATE … SET user_id = 2 thành công và ghi chú "biến mất" khỏi màn hình user 1 sang user 2.'], ['Trusting the view for security on its own — for multi-tenant isolation use row-level security (chapter 16).', 'Tin riêng vào view để bảo mật — cách ly nhiều người thuê thì dùng row-level security (chương 16).']],
    gt: ['<p>Single-table views without aggregates are automatically updatable. WITH CHECK OPTION adds a guard: every row written through the view must satisfy its WHERE, otherwise SQLSTATE 44000.</p>', '<p>View một bảng không có tổng hợp tự động cập nhật được. WITH CHECK OPTION thêm chốt chặn: mọi dòng ghi qua view phải thoả WHERE của nó, nếu không là SQLSTATE 44000.</p>'],
    tn: [tn('WITH CHECK OPTION', 'chặn ghi ra ngoài phạm vi view'), tn('updatable view', 'view cập nhật được')],
  }),

  pg({
    t: 'The order list the API needs, as a view', k: 'HARD', p: 12, kn: ['view over joins and aggregates', 'hiding columns', 'reusing the view in queries'], tag: ['view', 'ctshop'],
    en: '<p>The mobile API shows orders without ever exposing the phone number or e-mail of customers. Create <code>v_order_summary (order_id, customer_name, city, status, created_at, items, total, paid)</code>: items = Σ qty, total = Σ qty × unit_price, paid = whether a payment exists. Then use it: return the paid orders of Hà Nội customers, newest first — <code>order_id, customer_name, total</code>.</p>',
    vi: '<p>API di động hiển thị đơn mà không bao giờ lộ số điện thoại hay email của khách. Tạo <code>v_order_summary (order_id, customer_name, city, status, created_at, items, total, paid)</code>: items = Σ qty, total = Σ qty × unit_price, paid = có thanh toán hay chưa. Rồi dùng nó: trả về các đơn đã thanh toán của khách ở Hà Nội, mới nhất trước — <code>order_id, customer_name, total</code>.</p>',
    yc: [['Aggregate order_item per order inside the view; LEFT JOIN payment for the paid flag.', 'Tổng hợp order_item theo đơn trong view; LEFT JOIN payment cho cờ paid.'], ['The last statement is the SELECT on the view.', 'Câu cuối là SELECT trên view.']],
    giai: `CREATE VIEW v_order_summary AS
SELECT o.id AS order_id, c.full_name AS customer_name, c.city, o.status, o.created_at,
       i.items, i.total,
       p.id IS NOT NULL AS paid
FROM orders o
JOIN customer c ON c.id = o.customer_id
JOIN (SELECT order_id, sum(qty) AS items, sum(qty * unit_price) AS total
      FROM order_item GROUP BY order_id) i ON i.order_id = o.id
LEFT JOIN payment p ON p.order_id = o.id;      -- no phone, no email: the API cannot leak what the view does not have

SELECT order_id, customer_name, total
FROM v_order_summary
WHERE paid AND city = 'Hà Nội'
ORDER BY created_at DESC;`,
    kiem: [
      sau(['Paid orders of Hà Nội through the view', 'Đơn đã trả của Hà Nội qua view'], "SELECT order_id, customer_name, total FROM v_order_summary WHERE paid AND city = 'Hà Nội' ORDER BY created_at DESC", { thuTu: true }),
      sau(['The view exposes exactly the agreed columns', 'View chỉ lộ đúng các cột đã thống nhất'], "SELECT string_agg(column_name, ',' ORDER BY ordinal_position) AS cols FROM information_schema.columns WHERE table_name = 'v_order_summary'"),
      sau(['Totals of all orders; an order marked paid without a payment row is NOT paid', 'Tổng của mọi đơn; đơn đánh dấu paid mà chưa có dòng thanh toán thì CHƯA trả'], 'SELECT order_id, items, total, paid FROM v_order_summary ORDER BY order_id', { thuTu: true, an: true, themCsdl: "UPDATE orders SET status = 'paid' WHERE id = 7" }),
      ma(['A CREATE VIEW', 'Có CREATE VIEW'], 'CREATE\\s+(OR\\s+REPLACE\\s+)?VIEW\\s+v_order_summary'),
    ],
    sai: ["CREATE VIEW v_order_summary AS SELECT o.id AS order_id, c.full_name AS customer_name, c.city, o.status, o.created_at, sum(oi.qty) AS items, sum(oi.qty * oi.unit_price) AS total, bool_or(p.id IS NOT NULL) AS paid, c.phone FROM orders o JOIN customer c ON c.id = o.customer_id JOIN order_item oi ON oi.order_id = o.id LEFT JOIN payment p ON p.order_id = o.id GROUP BY o.id, c.full_name, c.city, c.phone; SELECT order_id, customer_name, total FROM v_order_summary WHERE paid AND city = 'Hà Nội' ORDER BY created_at DESC;", "CREATE VIEW v_order_summary AS SELECT o.id AS order_id, c.full_name AS customer_name, c.city, o.status, o.created_at, i.items, i.total, o.status IN ('paid', 'shipped') AS paid FROM orders o JOIN customer c ON c.id = o.customer_id JOIN (SELECT order_id, sum(qty) AS items, sum(qty * unit_price) AS total FROM order_item GROUP BY order_id) i ON i.order_id = o.id; SELECT order_id, customer_name, total FROM v_order_summary WHERE paid AND city = 'Hà Nội' ORDER BY created_at DESC;"],
    gy: [['Write and test the SELECT first, then wrap it in CREATE VIEW.', 'Viết và thử câu SELECT trước, rồi bọc trong CREATE VIEW.'], ['Pre-aggregate the lines so the payment join cannot fan out.', 'Tổng hợp dòng đơn trước để phép nối payment không nhân dòng.']],
    lhg: [['Adding c.phone "in case the app needs it" — the whole point of the view is that it cannot leak.', 'Thêm c.phone "phòng khi app cần" — mục đích của view chính là không thể lộ.'], ['Deriving paid from the status instead of the payment table — a status can be wrong, the payment row is the fact.', 'Suy ra paid từ trạng thái thay vì bảng payment — trạng thái có thể sai, dòng thanh toán mới là sự thật.']],
    gt: ['<p>A view is an API for SQL clients: stable columns, no secrets, joins written once. Combined with GRANT SELECT on the view only (not on customer), the app account literally cannot read phone numbers.</p>', '<p>View là API cho client SQL: cột ổn định, không bí mật, phép nối viết một lần. Kết hợp GRANT SELECT chỉ trên view (không trên customer), tài khoản của app thật sự không đọc được số điện thoại.</p>'],
    tn: [tn('view', 'bảng ảo'), tn('column-level exposure', 'phạm vi cột được lộ')],
  }),

  cs({
    t: 'What a view is — and is not', k: 'EASY', p: 4, kn: ['view semantics'], tag: ['view'],
    en: '<p>Three facts about views.</p>', vi: '<p>Ba sự thật về view.</p>',
    cau: [
      q('q1', ['Is a plain view faster than running its SELECT directly?', 'View thường có nhanh hơn chạy trực tiếp câu SELECT của nó không?'], ['no: the view is expanded into the query', 'yes: its last result is kept in a cache', 'yes: a view gets indexes of its own', 'only the first time it is queried'], ['A view is rewritten into the calling query (rewriter stage, lesson 1.4). Need stored results? That is a materialized view.', 'View được viết lại vào truy vấn gọi nó (bước rewriter, bài 1.4). Cần lưu kết quả? Đó là materialized view.']),
      q('q2', ['A view selects <code>SELECT * FROM notes</code>. Later a column is added to notes. Does the view show it?', 'View chọn <code>SELECT * FROM notes</code>. Sau đó bảng notes thêm một cột. View có hiện cột đó không?'], ['no: * became a fixed column list at creation', 'yes: the view picks it up automatically', 'only after the table is ANALYZEd', 'the view becomes invalid and errors'], ['PostgreSQL stores the expanded column list. Recreate the view (CREATE OR REPLACE VIEW) to pick up new columns.', 'PostgreSQL lưu danh sách cột đã bung. Tạo lại view (CREATE OR REPLACE VIEW) để nhận cột mới.']),
      q('q3', ['Which view is automatically updatable?', 'View nào tự động cập nhật được?'], ['SELECT id, title FROM notes WHERE user_id = 1', 'SELECT user_id, count(*) FROM notes GROUP BY user_id', 'SELECT DISTINCT title FROM notes', 'SELECT n.id, u.email FROM notes n JOIN users u ON …'], ['One base table, no aggregates/DISTINCT/GROUP BY, columns referenced directly ⇒ updatable. Others need INSTEAD OF triggers.', 'Một bảng gốc, không tổng hợp/DISTINCT/GROUP BY, cột tham chiếu trực tiếp ⇒ cập nhật được. Còn lại cần trigger INSTEAD OF.']),
    ],
    gy: [['A view is a name for a query, nothing more.', 'View là tên của một truy vấn, không hơn.'], ['Updatable = PostgreSQL can map each view row to exactly one base row.', 'Cập nhật được = PostgreSQL ánh xạ được mỗi dòng view tới đúng một dòng gốc.']],
    lhg: [['Creating views "for performance".', 'Tạo view "cho nhanh".'], ['Expecting SELECT * views to grow new columns by themselves.', 'Mong view SELECT * tự có cột mới.']],
    tn: [tn('rewriter', 'bộ viết lại truy vấn')],
  }),
]);
