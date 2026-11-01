/** PostgreSQL · 6.3 — HAVING vs WHERE, và FILTER. */
import { mod, pg, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { O_APP } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-6-3-having-filter', '6.3 HAVING vs WHERE, and FILTER', [
  pg({
    ...O_APP, t: 'Authors with at least two notes', k: 'EASY', p: 5, kn: ['HAVING'], tag: ['aggregate', 'having'],
    en: '<p>Return <code>author, notes</code> for every author who wrote <b>at least 2</b> notes, most notes first (ties by author name).</p>',
    vi: '<p>Trả về <code>author, notes</code> của mọi tác giả viết <b>từ 2</b> ghi chú trở lên, nhiều ghi chú nhất trước (bằng nhau thì theo tên).</p>',
    yc: [['A condition on a COUNT belongs in HAVING.', 'Điều kiện trên COUNT đặt trong HAVING.'], ['<code>ORDER BY notes DESC, author</code>.', '<code>ORDER BY notes DESC, author</code>.']],
    giai: `SELECT u.name AS author, count(*) AS notes
FROM note n
JOIN app_user u ON u.id = n.user_id
GROUP BY u.name
HAVING count(*) >= 2                 -- filters GROUPS, after counting
ORDER BY notes DESC, author;`,
    kiem: [
      kq(['Cuong 3, Lan 2', 'Cuong 3, Lan 2'], T),
      kqAn(['Minh writes a second note', 'Minh viết ghi chú thứ hai'], "INSERT INTO note VALUES (8, 3, 'Restore drill', 'ops', 4, false)", T),
      ma(['Uses HAVING', 'Dùng HAVING'], '\\bHAVING\\b'),
    ],
    sai: ['SELECT u.name AS author, count(*) AS notes FROM note n JOIN app_user u ON u.id = n.user_id GROUP BY u.name HAVING count(*) > 2 ORDER BY notes DESC, author', 'SELECT u.name AS author, count(*) AS notes FROM note n JOIN app_user u ON u.id = n.user_id GROUP BY u.name ORDER BY notes DESC, author'],
    gy: [['WHERE cannot see count(*): the groups do not exist yet when WHERE runs.', 'WHERE không thấy count(*): lúc WHERE chạy, nhóm chưa tồn tại.'], ['"At least 2" ⇒ <code>&gt;= 2</code>.', '"Từ 2 trở lên" ⇒ <code>&gt;= 2</code>.']],
    lhg: [['<code>WHERE count(*) &gt;= 2</code> — ERROR: aggregate functions are not allowed in WHERE.', '<code>WHERE count(*) &gt;= 2</code> — LỖI: aggregate functions are not allowed in WHERE.'], ['<code>&gt; 2</code> loses the authors with exactly two notes.', '<code>&gt; 2</code> mất tác giả có đúng hai ghi chú.']],
    gt: ['<p>Clause order of execution: FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. HAVING is the WHERE of groups.</p>', '<p>Thứ tự chạy: FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. HAVING là WHERE của nhóm.</p>'],
    tn: [TN.having],
  }),

  pg({
    ...O_APP, t: 'WHERE first, HAVING after', k: 'MEDIUM', p: 7, kn: ['WHERE vs HAVING in one query'], tag: ['aggregate', 'having'],
    en: '<p>Considering only notes whose views are <b>known</b>, return <code>tag, notes, total_views</code> for tags whose total views exceed <b>50</b>. Order by tag.</p>',
    vi: '<p>Chỉ xét ghi chú đã <b>biết</b> views, trả về <code>tag, notes, total_views</code> cho các thẻ có tổng views vượt <b>50</b>. Sắp theo tag.</p>',
    yc: [['Row filter (views known) in WHERE.', 'Lọc dòng (đã biết views) trong WHERE.'], ['Group filter (total &gt; 50) in HAVING.', 'Lọc nhóm (tổng &gt; 50) trong HAVING.']],
    giai: `SELECT tag, count(*) AS notes, sum(views) AS total_views
FROM note
WHERE views IS NOT NULL         -- drop rows first
GROUP BY tag
HAVING sum(views) > 50          -- then drop small groups
ORDER BY tag;`,
    kiem: [
      kq(['sql only (240)', 'chỉ sql (240)'], T),
      kqAn(['date reaches exactly 50 — not above 50', 'date đạt đúng 50 — chưa vượt 50'], 'UPDATE note SET views = 5 WHERE id = 7', T),
      kqAn(['ops reaches 62', 'ops đạt 62'], "INSERT INTO note VALUES (8, 3, 'Restore drill', 'ops', 50, false)", T),
      ma(['WHERE and HAVING', 'Có WHERE và HAVING'], '\\bWHERE\\b[\\s\\S]*\\bHAVING\\b'),
    ],
    sai: ['SELECT tag, count(*) AS notes, sum(views) AS total_views FROM note GROUP BY tag HAVING sum(views) > 50 ORDER BY tag', 'SELECT tag, count(*) AS notes, sum(views) AS total_views FROM note WHERE views IS NOT NULL GROUP BY tag HAVING sum(views) >= 50 ORDER BY tag'],
    gy: [['Ask of each condition: does it look at one row, or at a group?', 'Hỏi từng điều kiện: nó nhìn một dòng, hay một nhóm?'], ['"Exceed" means strictly greater.', '"Vượt" là lớn hơn hẳn.']],
    lhg: [['No WHERE: count(*) still counts the unmeasured notes, so "notes" is wrong for date.', 'Không WHERE: count(*) vẫn đếm ghi chú chưa đo, nên "notes" của date bị sai.'], ['<code>&gt;= 50</code> instead of <code>&gt; 50</code>.', '<code>&gt;= 50</code> thay vì <code>&gt; 50</code>.']],
    gt: ['<p>Filtering rows early (WHERE) is both correct and cheaper: fewer rows reach the grouping step. HAVING is only for conditions on aggregates.</p>', '<p>Lọc dòng sớm (WHERE) vừa đúng vừa rẻ: ít dòng tới bước gom nhóm. HAVING chỉ dành cho điều kiện trên hàm tổng hợp.</p>'],
    tn: [TN.having],
  }),

  pg({
    ...O_APP, t: 'Four totals in one pass with FILTER', k: 'MEDIUM', p: 6, kn: ['aggregate FILTER (WHERE …)'], tag: ['aggregate', 'filter'],
    en: '<p>One row: <code>total</code> notes, <code>sql_notes</code>, <code>pinned_notes</code>, and <code>sql_views</code> (sum of views of sql notes).</p>',
    vi: '<p>Một dòng: tổng <code>total</code> ghi chú, <code>sql_notes</code>, <code>pinned_notes</code>, và <code>sql_views</code> (tổng views của ghi chú sql).</p>',
    yc: [['<code>count(*) FILTER (WHERE tag = \'sql\')</code> etc.', '<code>count(*) FILTER (WHERE tag = \'sql\')</code> v.v.'], ['One SELECT, no subqueries.', 'Một câu SELECT, không truy vấn con.']],
    giai: `SELECT count(*)                              AS total,
       count(*) FILTER (WHERE tag = 'sql')   AS sql_notes,
       count(*) FILTER (WHERE pinned)        AS pinned_notes,
       sum(views) FILTER (WHERE tag = 'sql') AS sql_views
FROM note;`,
    kiem: [
      kq(['7, 3, 2, 240', '7, 3, 2, 240']),
      kqAn(['More notes', 'Thêm ghi chú'], "INSERT INTO note VALUES (8, 4, 'Window functions', 'sql', 11, true)"),
      ma(['Uses FILTER', 'Dùng FILTER'], '\\bFILTER\\s*\\(\\s*WHERE'),
    ],
    sai: ["SELECT count(*) AS total, count(tag = 'sql') AS sql_notes, count(pinned) AS pinned_notes, sum(views) FILTER (WHERE tag = 'sql') AS sql_views FROM note"],
    gy: [['FILTER (WHERE …) restricts which rows ONE aggregate sees.', 'FILTER (WHERE …) giới hạn dòng mà MỘT hàm tổng hợp nhìn thấy.'], ['Each aggregate can have its own filter.', 'Mỗi hàm tổng hợp có bộ lọc riêng.']],
    lhg: [['<code>count(tag = \'sql\')</code> counts every non-NULL boolean — true AND false.', '<code>count(tag = \'sql\')</code> đếm mọi boolean khác NULL — cả true lẫn false.'], ['Running four separate queries — four scans of the table.', 'Chạy bốn truy vấn riêng — bốn lần quét bảng.']],
    gt: ['<p>FILTER is standard SQL for conditional aggregation; it replaces <code>sum(CASE WHEN … THEN 1 ELSE 0 END)</code> with something readable, in a single scan.</p>', '<p>FILTER là SQL chuẩn cho tổng hợp có điều kiện; nó thay <code>sum(CASE WHEN … THEN 1 ELSE 0 END)</code> bằng thứ dễ đọc, chỉ trong một lần quét.</p>'],
    tn: [TN.filter],
  }),

  pg({
    t: 'Customer health: FILTER + HAVING on CT Shop', k: 'HARD', p: 12, kn: ['FILTER per status', 'HAVING on a FILTERed count', 'percentage without integer division'], tag: ['aggregate', 'filter', 'having', 'ctshop'],
    en: '<p>For every customer with <b>at least 2 orders</b> return <code>customer_id, orders, completed</code> (paid or shipped), <code>cancelled</code>, and <code>cancel_pct</code> = 100 × cancelled / orders rounded to 1 decimal. Order by customer_id.</p>',
    vi: '<p>Với mọi khách có <b>từ 2 đơn</b> trở lên trả về <code>customer_id, orders, completed</code> (paid hoặc shipped), <code>cancelled</code>, và <code>cancel_pct</code> = 100 × cancelled / orders làm tròn 1 chữ số. Sắp theo customer_id.</p>',
    yc: [['Two FILTERed counts and one plain count per customer.', 'Hai số đếm có FILTER và một số đếm thường cho mỗi khách.'], ['Use <code>100.0 *</code> so the division is not integer division.', 'Dùng <code>100.0 *</code> để phép chia không phải chia nguyên.']],
    giai: `SELECT customer_id,
       count(*)                                                AS orders,
       count(*) FILTER (WHERE status IN ('paid', 'shipped'))   AS completed,
       count(*) FILTER (WHERE status = 'cancelled')            AS cancelled,
       round(100.0 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS cancel_pct
FROM orders
GROUP BY customer_id
HAVING count(*) >= 2
ORDER BY customer_id;`,
    kiem: [
      kq(['Customers 1, 2, 3, 5, 6', 'Khách 1, 2, 3, 5, 6'], T),
      kqAn(['Customer 4 cancels a second order; customer 3 cancels 1 of 3 (33.3 %)', 'Khách 4 huỷ đơn thứ hai; khách 3 huỷ 1/3 đơn (33.3 %)'], "INSERT INTO orders (customer_id, status, created_at) VALUES (4, 'cancelled', '2026-10-08 09:00+07'); UPDATE orders SET status = 'cancelled' WHERE id = 7", T),
      ma(['FILTER and HAVING', 'FILTER và HAVING'], '\\bFILTER\\b[\\s\\S]*\\bHAVING\\b'),
    ],
    sai: ["SELECT customer_id, count(*) AS orders, count(*) FILTER (WHERE status IN ('paid', 'shipped')) AS completed, count(*) FILTER (WHERE status = 'cancelled') AS cancelled, round(100 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS cancel_pct FROM orders GROUP BY customer_id HAVING count(*) >= 2 ORDER BY customer_id", "SELECT customer_id, count(*) AS orders, count(*) FILTER (WHERE status IN ('paid', 'shipped')) AS completed, count(*) FILTER (WHERE status = 'cancelled') AS cancelled, round(100.0 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS cancel_pct FROM orders WHERE status <> 'pending' GROUP BY customer_id HAVING count(*) >= 2 ORDER BY customer_id"],
    gy: [['count(*) FILTER (…) is just another aggregate — use it in SELECT and in expressions.', 'count(*) FILTER (…) chỉ là một hàm tổng hợp nữa — dùng được trong SELECT và trong biểu thức.'], ['bigint / bigint is integer division: 100 × 1 / 2 = 50, but 100 × 1 / 3 = 33 (not 33.3).', 'bigint / bigint là chia nguyên: 100 × 1 / 2 = 50, nhưng 100 × 1 / 3 = 33 (không phải 33.3).']],
    lhg: [['<code>100 * … / count(*)</code>: integer division silently drops the decimals (33 instead of 33.3).', '<code>100 * … / count(*)</code>: chia nguyên lặng lẽ bỏ phần lẻ (33 thay vì 33.3).'], ['Excluding pending orders in WHERE — they are orders too, so the totals and percentages change.', 'Loại đơn pending trong WHERE — chúng vẫn là đơn, nên tổng và phần trăm bị đổi.']],
    gt: ['<p>One GROUP BY, several FILTERed aggregates, one HAVING: a whole health report in a single pass. Multiplying by 100.0 makes the expression numeric, so the percentage keeps its decimals (Lab 3 R6).</p>', '<p>Một GROUP BY, vài hàm tổng hợp có FILTER, một HAVING: cả báo cáo sức khoẻ trong một lượt quét. Nhân 100.0 biến biểu thức thành numeric nên phần trăm giữ phần lẻ (Lab 3 R6).</p>'],
    tn: [TN.filter, TN.having],
  }),
]);
