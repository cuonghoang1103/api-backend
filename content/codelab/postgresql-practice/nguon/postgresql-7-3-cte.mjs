/** PostgreSQL · 7.3 — CTE (WITH): truy vấn theo bước, sửa fan-out, CTE ghi dữ liệu (DELETE … RETURNING ⇒ INSERT). */
import { mod, pg, kq, kqAn, sau, ma, CT_SHOP, LUOC_DO_CT_SHOP, TN, tn } from './_chung.mjs';
import { O_APP } from './_du-lieu.mjs';

const T = { thuTu: true };
const ARCHIVE = `${CT_SHOP}
CREATE TABLE orders_archive (
  id          bigint PRIMARY KEY,
  customer_id bigint NOT NULL,
  status      text NOT NULL,
  created_at  timestamptz NOT NULL,
  archived_at timestamptz NOT NULL DEFAULT now()
);`;

export default mod('postgresql-7-3-cte', '7.3 CTEs (WITH): queries in readable steps', [
  pg({
    ...O_APP, t: 'Author statistics as a named step', k: 'EASY', p: 6, kn: ['WITH … AS', 'join a CTE'], tag: ['cte'],
    en: '<p>In a CTE <code>author_stats</code>, compute per author (<code>user_id</code>) the number of notes and the total views. Then return <code>name, notes, total_views</code> of the authors whose total views exceed 100, most viewed first.</p>',
    vi: '<p>Trong CTE <code>author_stats</code>, tính cho mỗi tác giả (<code>user_id</code>) số ghi chú và tổng views. Rồi trả về <code>name, notes, total_views</code> của các tác giả có tổng views vượt 100, nhiều nhất trước.</p>',
    yc: [['<code>WITH author_stats AS (…) SELECT … FROM author_stats JOIN app_user …</code>.', '<code>WITH author_stats AS (…) SELECT … FROM author_stats JOIN app_user …</code>.'], ['Exclude the orphan draft inside the CTE.', 'Loại bản nháp mồ côi ngay trong CTE.']],
    giai: `WITH author_stats AS (
  SELECT user_id, count(*) AS notes, sum(views) AS total_views
  FROM note
  WHERE user_id IS NOT NULL
  GROUP BY user_id
)
SELECT u.name, s.notes, s.total_views
FROM author_stats s
JOIN app_user u ON u.id = s.user_id
WHERE s.total_views > 100
ORDER BY s.total_views DESC;`,
    kiem: [
      kq(['Only Cuong (240)', 'Chỉ Cuong (240)'], T),
      kqAn(['Lan reaches exactly 100 — not above 100', 'Lan đạt đúng 100 — chưa vượt 100'], 'UPDATE note SET views = 55 WHERE id = 7', T),
      kqAn(['Lan becomes popular', 'Lan trở nên nổi tiếng'], 'UPDATE note SET views = 80 WHERE id = 7', T),
      ma(['A CTE named author_stats', 'Một CTE tên author_stats'], 'WITH\\s+author_stats\\s+AS\\s*\\('),
    ],
    sai: ['WITH author_stats AS (SELECT user_id, count(*) AS notes, sum(views) AS total_views FROM note GROUP BY user_id) SELECT u.name, s.notes, s.total_views FROM author_stats s JOIN app_user u ON u.id = s.user_id WHERE s.total_views >= 100 ORDER BY s.total_views DESC'],
    gy: [['A CTE is a named subquery placed before the main query.', 'CTE là truy vấn con có tên đặt trước truy vấn chính.'], ['The main query uses it like a table.', 'Truy vấn chính dùng nó như một bảng.']],
    lhg: [['<code>&gt;= 100</code> instead of "exceed".', '<code>&gt;= 100</code> thay vì "vượt".'], ['Putting the HAVING-style filter inside the CTE and again outside — harmless here, but it hides the step structure.', 'Đặt điều kiện kiểu HAVING trong CTE rồi lại đặt bên ngoài — ở đây vô hại, nhưng làm mờ cấu trúc các bước.']],
    gt: ['<p>A CTE names an intermediate result so the main query reads top-down. Since PostgreSQL 12 a simple CTE used once is inlined, so it costs nothing compared with a subquery.</p>', '<p>CTE đặt tên cho một kết quả trung gian để truy vấn chính đọc từ trên xuống. Từ PostgreSQL 12, CTE đơn giản dùng một lần được nhập thẳng vào truy vấn, nên không tốn gì hơn truy vấn con.</p>'],
    tn: [TN.cte],
  }),

  pg({
    ...O_APP, t: 'Fix the fan-out sum with a CTE', k: 'MEDIUM', p: 8, kn: ['pre-aggregate in a CTE', 'LEFT JOIN + COALESCE'], tag: ['cte', 'fan-out'],
    en: '<p>Joining notes to comments makes <code>sum(n.views)</code> count a note once per comment. Return <code>name, total_views, comments</code> per author correctly: aggregate comments per note in a CTE <code>note_comments</code> first. Authors only (no orphan); order by name.</p>',
    vi: '<p>Nối ghi chú với bình luận khiến <code>sum(n.views)</code> tính một ghi chú nhiều lần theo số bình luận. Trả về <code>name, total_views, comments</code> theo tác giả cho đúng: tổng hợp bình luận theo ghi chú trong CTE <code>note_comments</code> trước. Chỉ tác giả (không tính bản mồ côi); sắp theo tên.</p>',
    yc: [['<code>WITH note_comments AS (SELECT note_id, count(*) AS comments FROM comment GROUP BY note_id)</code>.', '<code>WITH note_comments AS (SELECT note_id, count(*) AS comments FROM comment GROUP BY note_id)</code>.'], ['LEFT JOIN it (notes without comments) and COALESCE the sum.', 'LEFT JOIN nó (ghi chú không có bình luận) và COALESCE phép cộng.']],
    giai: `WITH note_comments AS (
  SELECT note_id, count(*) AS comments          -- one row per note ⇒ joining it cannot fan out
  FROM comment
  GROUP BY note_id
)
SELECT u.name,
       sum(n.views)                     AS total_views,
       COALESCE(sum(nc.comments), 0)    AS comments
FROM app_user u
JOIN note n ON n.user_id = u.id
LEFT JOIN note_comments nc ON nc.note_id = n.id
GROUP BY u.name
ORDER BY u.name;`,
    kiem: [
      kq(['Cuong 240 views / 4 comments, Lan 45 / 1, Minh 12 / 1', 'Cuong 240 views / 4 bình luận, Lan 45 / 1, Minh 12 / 1'], T),
      kqAn(['More comments do not change views; Hoa has a note without comments', 'Thêm bình luận không đổi views; Hoa có ghi chú chưa ai bình luận'], "INSERT INTO comment VALUES (7, 2, 3, 'x'), (8, 2, 4, 'y'), (9, 6, 2, 'z'); INSERT INTO note VALUES (8, 4, 'Hue food', 'life', 3, false)", T),
      ma(['A CTE note_comments', 'Một CTE note_comments'], 'WITH\\s+note_comments\\s+AS'),
    ],
    sai: ['SELECT u.name, sum(n.views) AS total_views, count(c.id) AS comments FROM app_user u JOIN note n ON n.user_id = u.id LEFT JOIN comment c ON c.note_id = n.id GROUP BY u.name ORDER BY u.name', 'WITH note_comments AS (SELECT note_id, count(*) AS comments FROM comment GROUP BY note_id) SELECT u.name, sum(n.views) AS total_views, sum(nc.comments) AS comments FROM app_user u JOIN note n ON n.user_id = u.id LEFT JOIN note_comments nc ON nc.note_id = n.id GROUP BY u.name ORDER BY u.name'],
    gy: [['Aggregate the many side down to one row per note before joining.', 'Tổng hợp phía nhiều về một dòng mỗi ghi chú trước khi nối.'], ['sum() of only NULLs is NULL — COALESCE it to 0.', 'sum() của toàn NULL là NULL — COALESCE về 0.']],
    lhg: [['Joining comment directly: Cuong\'s views become 120 × 3 + 90 + 30 = 480.', 'Nối thẳng comment: views của Cuong thành 120 × 3 + 90 + 30 = 480.'], ['Forgetting COALESCE — an author whose notes have no comments shows NULL comments.', 'Quên COALESCE — tác giả mà ghi chú không có bình luận hiện comments NULL.']],
    gt: ['<p>The CTE turns comment into a one-row-per-note table; after that every join is one-to-one per note and sum(views) is correct.</p>', '<p>CTE biến comment thành bảng một dòng mỗi ghi chú; sau đó mọi phép nối là một–một theo ghi chú và sum(views) đúng.</p>'],
    tn: [TN.cte, tn('fan-out', 'nhân dòng')],
  }),

  pg({
    t: 'Top spenders in three readable steps', k: 'MEDIUM', p: 10, kn: ['several CTEs', 'each step one grain'], tag: ['cte', 'ctshop'],
    en: '<p>Return <code>customer_id, full_name, spent</code> of customers whose total spent on <b>paid or shipped</b> orders is above the average spend of those customers, biggest first. Write it as three CTEs: <code>order_total</code> (per order), <code>spend</code> (per customer), <code>avg_spend</code> (one number).</p>',
    vi: '<p>Trả về <code>customer_id, full_name, spent</code> của những khách có tổng chi cho đơn <b>paid hoặc shipped</b> cao hơn mức chi trung bình của các khách đó, lớn nhất trước. Viết bằng ba CTE: <code>order_total</code> (theo đơn), <code>spend</code> (theo khách), <code>avg_spend</code> (một con số).</p>',
    yc: [['Three CTEs separated by commas after one WITH.', 'Ba CTE cách nhau dấu phẩy sau một WITH.'], ['Each step has one grain: order → customer → shop.', 'Mỗi bước một hạt: đơn → khách → cửa hàng.']],
    giai: `WITH order_total AS (
  SELECT o.id, o.customer_id, sum(oi.qty * oi.unit_price) AS total
  FROM orders o JOIN order_item oi ON oi.order_id = o.id
  WHERE o.status IN ('paid', 'shipped')
  GROUP BY o.id, o.customer_id
), spend AS (
  SELECT customer_id, sum(total) AS spent FROM order_total GROUP BY customer_id
), avg_spend AS (
  SELECT avg(spent) AS a FROM spend
)
SELECT s.customer_id, c.full_name, s.spent
FROM spend s
JOIN customer c ON c.id = s.customer_id
WHERE s.spent > (SELECT a FROM avg_spend)
ORDER BY s.spent DESC;`,
    kiem: [
      kq(['Customers 1 and 5', 'Khách 1 và 5'], T),
      kqAn(['Customer 7 makes a big purchase', 'Khách 7 mua một đơn lớn'], "INSERT INTO order_item VALUES (12, 30, 2, 590000)", T),
      ma(['Three CTEs', 'Ba CTE'], 'WITH\\s+\\w+\\s+AS\\s*\\([\\s\\S]*\\)\\s*,\\s*\\w+\\s+AS\\s*\\([\\s\\S]*\\)\\s*,\\s*\\w+\\s+AS\\s*\\('),
    ],
    sai: ["WITH order_total AS (SELECT o.id, o.customer_id, sum(oi.qty * oi.unit_price) AS total FROM orders o JOIN order_item oi ON oi.order_id = o.id GROUP BY o.id, o.customer_id), spend AS (SELECT customer_id, sum(total) AS spent FROM order_total GROUP BY customer_id), avg_spend AS (SELECT avg(spent) AS a FROM spend) SELECT s.customer_id, c.full_name, s.spent FROM spend s JOIN customer c ON c.id = s.customer_id WHERE s.spent > (SELECT a FROM avg_spend) ORDER BY s.spent DESC"],
    gy: [['Read your query from top to bottom like a recipe.', 'Đọc truy vấn từ trên xuống như một công thức.'], ['Later CTEs may use earlier ones.', 'CTE sau dùng được CTE trước.']],
    lhg: [['Forgetting the status filter in the first step — cancelled orders count as spending.', 'Quên lọc trạng thái ở bước đầu — đơn huỷ bị tính là tiền đã chi.'], ['Averaging per order instead of per customer.', 'Lấy trung bình theo đơn thay vì theo khách.']],
    gt: ['<p>Each CTE has exactly one grain, so each aggregate is obviously right. Breaking a report into named steps is the main reason CTEs exist.</p>', '<p>Mỗi CTE có đúng một hạt, nên mỗi phép tổng hợp đúng một cách hiển nhiên. Chia báo cáo thành các bước có tên là lý do chính CTE tồn tại.</p>'],
    tn: [TN.cte],
  }),

  pg({
    t: 'Archive old cancelled orders in one statement', k: 'HARD', p: 12, kn: ['data-modifying CTE', 'DELETE … RETURNING feeding INSERT'], tag: ['cte', 'dml', 'ctshop'],
    csdl: ARCHIVE, tenCsdl: 'ctshop-archive', ld: { en: LUOC_DO_CT_SHOP.en + '<p>Plus <code>orders_archive (id PK, customer_id, status, created_at, archived_at DEFAULT now())</code>, empty.</p>', vi: LUOC_DO_CT_SHOP.vi + '<p>Cộng <code>orders_archive (id PK, customer_id, status, created_at, archived_at DEFAULT now())</code>, rỗng.</p>' },
    en: '<p>Move every <b>cancelled</b> order created before <b>1 October 2026</b> from <code>orders</code> to <code>orders_archive</code> — delete it from orders (its lines go by CASCADE) and insert <code>id, customer_id, status, created_at</code> into the archive — in <b>one statement</b>. Return the archived ids.</p>',
    vi: '<p>Chuyển mọi đơn <b>cancelled</b> tạo trước <b>1/10/2026</b> từ <code>orders</code> sang <code>orders_archive</code> — xoá khỏi orders (dòng đơn đi theo CASCADE) và chèn <code>id, customer_id, status, created_at</code> vào kho lưu — trong <b>một lệnh</b>. Trả về các id đã lưu trữ.</p>',
    yc: [['<code>WITH moved AS (DELETE FROM orders … RETURNING …) INSERT INTO orders_archive (…) SELECT … FROM moved RETURNING id</code>.', '<code>WITH moved AS (DELETE FROM orders … RETURNING …) INSERT INTO orders_archive (…) SELECT … FROM moved RETURNING id</code>.'], ['One statement: either both happen or neither.', 'Một lệnh: hoặc cả hai cùng xảy ra, hoặc không gì cả.']],
    giai: `WITH moved AS (
  DELETE FROM orders
  WHERE status = 'cancelled' AND created_at < '2026-10-01'
  RETURNING id, customer_id, status, created_at          -- the deleted rows, handed to the next step
)
INSERT INTO orders_archive (id, customer_id, status, created_at)
SELECT id, customer_id, status, created_at FROM moved
RETURNING id;`,
    kiem: [
      kq(['Order 4 archived', 'Đơn 4 được lưu trữ']),
      sau(['Archive and orders agree', 'Kho lưu và bảng orders khớp nhau'], "SELECT (SELECT count(*) FROM orders_archive) AS archived, (SELECT count(*) FROM orders WHERE status = 'cancelled') AS still_cancelled, (SELECT count(*) FROM order_item WHERE order_id = 4) AS lines_of_4"),
      kqAn(['Two more old cancellations', 'Thêm hai đơn huỷ cũ'], "UPDATE orders SET status = 'cancelled' WHERE id IN (7, 11); UPDATE orders SET created_at = '2026-09-28 10:00+07' WHERE id = 11"),
      ma(['DELETE inside WITH', 'DELETE nằm trong WITH'], 'WITH\\s+\\w+\\s+AS\\s*\\(\\s*DELETE'),
    ],
    sai: ["INSERT INTO orders_archive (id, customer_id, status, created_at) SELECT id, customer_id, status, created_at FROM orders WHERE status = 'cancelled' AND created_at < '2026-10-01' RETURNING id", "WITH moved AS (DELETE FROM orders WHERE status = 'cancelled' RETURNING id, customer_id, status, created_at) INSERT INTO orders_archive (id, customer_id, status, created_at) SELECT id, customer_id, status, created_at FROM moved RETURNING id"],
    gy: [['A CTE may contain INSERT/UPDATE/DELETE … RETURNING; the main statement sees the returned rows.', 'CTE được phép chứa INSERT/UPDATE/DELETE … RETURNING; lệnh chính thấy các dòng được trả về.'], ['The whole WITH statement is a single atomic statement.', 'Cả lệnh WITH là một câu lệnh nguyên tử duy nhất.']],
    lhg: [['Copying without deleting — the orders are now in two places.', 'Chép mà không xoá — đơn nằm ở hai nơi.'], ['Forgetting the date condition — the recent cancellation (order 14) is archived too.', 'Quên điều kiện ngày — đơn vừa huỷ (đơn 14) cũng bị lưu trữ.']],
    gt: ['<p>Data-modifying CTEs let several writes share one snapshot and one statement: rows deleted in <code>moved</code> are exactly the rows inserted into the archive, with no window for another session to see a half-moved state.</p>', '<p>CTE ghi dữ liệu cho phép nhiều thao tác ghi dùng chung một ảnh chụp và một lệnh: các dòng bị xoá trong <code>moved</code> chính là các dòng được chèn vào kho lưu, không có khe hở nào để phiên khác thấy trạng thái chuyển dở.</p>'],
    tn: [tn('data-modifying CTE', 'CTE ghi dữ liệu'), TN.returning],
  }),
]);
