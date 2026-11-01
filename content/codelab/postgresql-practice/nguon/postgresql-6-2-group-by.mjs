/** PostgreSQL · 6.2 — GROUP BY: một tóm tắt mỗi nhóm, luật "cột phải được gom hoặc tổng hợp", hạt (grain). */
import { mod, pg, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { O_APP } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-6-2-group-by', '6.2 GROUP BY: a summary per group', [
  pg({
    ...O_APP, t: 'Notes and average views per tag', k: 'EASY', p: 5, kn: ['GROUP BY', 'NULL forms its own group'], tag: ['aggregate', 'group-by'],
    en: '<p>For each tag return <code>tag, notes, avg_views</code> (rounded to 1 decimal). Order by notes descending, then tag (NULL last).</p>',
    vi: '<p>Với mỗi thẻ trả về <code>tag, notes, avg_views</code> (làm tròn 1 chữ số). Sắp số ghi chú giảm dần, rồi theo thẻ (NULL cuối).</p>',
    yc: [['<code>GROUP BY tag</code>.', '<code>GROUP BY tag</code>.'], ['<code>ORDER BY notes DESC, tag NULLS LAST</code>.', '<code>ORDER BY notes DESC, tag NULLS LAST</code>.']],
    giai: `SELECT tag, count(*) AS notes, round(avg(views), 1) AS avg_views
FROM note
GROUP BY tag                         -- all untagged notes form ONE group (tag NULL)
ORDER BY notes DESC, tag NULLS LAST;`,
    kiem: [
      kq(['sql 3, date 2, ops 1, NULL 1', 'sql 3, date 2, ops 1, NULL 1'], T),
      kqAn(['A new tag group', 'Một nhóm thẻ mới'], "INSERT INTO note VALUES (8, 4, 'Hue food', 'life', 3, false), (9, 4, 'Hue rain', 'life', 5, false)", T),
      ma(['GROUP BY tag', 'GROUP BY tag'], 'GROUP\\s+BY\\s+tag\\b'),
    ],
    sai: ['SELECT tag, count(views) AS notes, round(avg(views), 1) AS avg_views FROM note GROUP BY tag ORDER BY notes DESC, tag NULLS LAST', 'SELECT tag, count(*) AS notes, round(avg(views), 1) AS avg_views FROM note WHERE tag IS NOT NULL GROUP BY tag ORDER BY notes DESC, tag NULLS LAST'],
    gy: [['One output row per distinct tag value.', 'Mỗi giá trị thẻ khác nhau một dòng kết quả.'], ['count(*) counts rows of the group.', 'count(*) đếm dòng của nhóm.']],
    lhg: [['count(views) for "notes" — a note whose views are unknown is not counted.', 'count(views) cho "notes" — ghi chú chưa biết views không được đếm.'], ['Dropping the NULL group with WHERE — the brief keeps untagged notes as their own group.', 'Bỏ nhóm NULL bằng WHERE — đề giữ ghi chú chưa gắn thẻ thành một nhóm riêng.']],
    gt: ['<p>GROUP BY makes one group per distinct value; for grouping, all NULLs are considered equal and form one group. Aggregates are then computed inside each group.</p>', '<p>GROUP BY tạo một nhóm cho mỗi giá trị khác nhau; khi gom nhóm, mọi NULL được coi là bằng nhau và tạo một nhóm. Hàm tổng hợp được tính trong từng nhóm.</p>'],
    tn: [TN.groupBy],
  }),

  pg({
    ...O_APP, t: 'Group by two columns: city × tag', k: 'MEDIUM', p: 7, kn: ['GROUP BY a, b', 'join then group'], tag: ['aggregate', 'group-by', 'join'],
    en: '<p>How many notes per <b>author city</b> and tag? Return <code>city, tag, notes</code> for notes that have an author, ordered by city, then tag (NULL last).</p>',
    vi: '<p>Bao nhiêu ghi chú theo <b>thành phố của tác giả</b> và thẻ? Trả về <code>city, tag, notes</code> cho các ghi chú có tác giả, sắp theo city rồi tag (NULL cuối).</p>',
    yc: [['Join note to app_user, then <code>GROUP BY u.city, n.tag</code>.', 'Nối note với app_user, rồi <code>GROUP BY u.city, n.tag</code>.'], ['Every non-aggregated column of SELECT must be in GROUP BY.', 'Mọi cột không tổng hợp trong SELECT phải có trong GROUP BY.']],
    giai: `SELECT u.city, n.tag, count(*) AS notes
FROM note n
JOIN app_user u ON u.id = n.user_id
GROUP BY u.city, n.tag                   -- one group per (city, tag) pair
ORDER BY u.city, n.tag NULLS LAST;`,
    kiem: [
      kq(['Danang date 2, Hanoi ops 1, Hanoi sql 3', 'Danang date 2, Hanoi ops 1, Hanoi sql 3'], T),
      kqAn(['Hoa from Hue writes two notes', 'Hoa ở Huế viết hai ghi chú'], "INSERT INTO note VALUES (8, 4, 'Hue food', 'life', 3, false), (9, 4, 'Hue SQL meetup', 'sql', 5, false)", T),
      ma(['GROUP BY two columns', 'GROUP BY hai cột'], 'GROUP\\s+BY\\s+[\\w.]+\\s*,\\s*[\\w.]+'),
    ],
    sai: ['SELECT u.city, n.tag, count(*) AS notes FROM note n JOIN app_user u ON u.id = n.user_id GROUP BY u.city, n.tag, n.id ORDER BY u.city, n.tag NULLS LAST', 'SELECT u.city, max(n.tag) AS tag, count(*) AS notes FROM note n JOIN app_user u ON u.id = n.user_id GROUP BY u.city ORDER BY u.city'],
    gy: [['The grain of the result is (city, tag): exactly those two go into GROUP BY.', 'Hạt của kết quả là (city, tag): đúng hai cột đó vào GROUP BY.'], ['Adding n.id to GROUP BY splits every note into its own group.', 'Thêm n.id vào GROUP BY tách mỗi ghi chú thành một nhóm riêng.']],
    lhg: [['Grouping by an extra column (the note id) — every count becomes 1.', 'Gom thêm một cột (id ghi chú) — mọi số đếm thành 1.'], ['Grouping by city only and hiding tag in max() — the answer loses a dimension.', 'Chỉ gom theo city rồi giấu tag trong max() — kết quả mất một chiều.']],
    gt: ['<p>The GROUP BY list IS the grain of the answer: one row per distinct combination. Choose it from the question ("per city and tag"), then everything else in SELECT must be aggregated.</p>', '<p>Danh sách GROUP BY CHÍNH LÀ hạt của câu trả lời: mỗi tổ hợp khác nhau một dòng. Chọn nó từ câu hỏi ("theo city và tag"), rồi mọi thứ khác trong SELECT phải được tổng hợp.</p>'],
    tn: [tn('grain', 'hạt (một dòng đại diện cho gì)')],
  }),

  pg({
    t: 'Products and stock per category', k: 'MEDIUM', p: 7, kn: ['GROUP BY a key, show its name', 'functional dependency'], tag: ['aggregate', 'group-by', 'ctshop'],
    en: '<p>For each category that has products return <code>category_id, name, products, units</code> (count and total stock), ordered by category_id.</p>',
    vi: '<p>Với mỗi danh mục có sản phẩm trả về <code>category_id, name, products, units</code> (số sản phẩm và tổng tồn kho), sắp theo category_id.</p>',
    yc: [['Join product to category; group by the category key.', 'Nối product với category; gom theo khoá danh mục.'], ['Grouping by <code>c.id</code> alone is enough to also select <code>c.name</code> (it is the primary key).', 'Chỉ gom theo <code>c.id</code> là đủ để chọn cả <code>c.name</code> (vì là khoá chính).']],
    giai: `SELECT c.id AS category_id, c.name, count(*) AS products, sum(p.stock) AS units
FROM category c
JOIN product p ON p.category_id = c.id
GROUP BY c.id                         -- c.name depends on the primary key: PostgreSQL allows it
ORDER BY c.id;`,
    kiem: [
      kq(['Eight leaf categories', 'Tám danh mục lá'], T),
      kqAn(['New products in Thước & compa', 'Sản phẩm mới trong Thước & compa'], "INSERT INTO product (sku, name, category_id, price, stock) VALUES ('CT1102', 'Thước thép Deli 30cm', 11, 15000, 70), ('CT1104', 'Compa chì kim', 11, 29000, 12)", T),
      ma(['Groups', 'Có gom nhóm'], '\\bGROUP\\s+BY\\b'),
    ],
    sai: ['SELECT c.id AS category_id, c.name, count(*) AS products, sum(p.stock) AS units FROM category c LEFT JOIN product p ON p.category_id = c.id GROUP BY c.id ORDER BY c.id', 'SELECT p.category_id, c.name, count(*) AS products, sum(p.stock) AS units FROM category c JOIN product p ON p.category_id = c.id GROUP BY p.category_id, c.name, p.stock ORDER BY p.category_id'],
    gy: [['GROUP BY the key; PostgreSQL knows the other columns of that table are determined by it.', 'GROUP BY theo khoá; PostgreSQL biết các cột khác của bảng đó phụ thuộc vào khoá.'], ['"Categories that have products" ⇒ INNER JOIN.', '"Danh mục có sản phẩm" ⇒ INNER JOIN.']],
    lhg: [['LEFT JOIN with count(*): root categories without products get products = 1.', 'LEFT JOIN với count(*): danh mục gốc không có sản phẩm nhận products = 1.'], ['Adding p.stock to GROUP BY — one group per distinct stock value.', 'Thêm p.stock vào GROUP BY — mỗi giá trị tồn kho một nhóm.']],
    gt: ['<p>Since PostgreSQL 9.1, columns functionally dependent on a grouped primary key may be selected without being listed. Grouping by the key (not by the name) also keeps two categories with the same name apart.</p>', '<p>Từ PostgreSQL 9.1, cột phụ thuộc hàm vào khoá chính đã gom có thể được chọn mà không cần liệt kê. Gom theo khoá (không theo tên) còn giữ hai danh mục trùng tên tách riêng.</p>'],
    tn: [tn('functional dependency', 'phụ thuộc hàm')],
  }),

  pg({
    t: 'Monthly revenue — at the right grain', k: 'HARD', p: 12, kn: ['date_trunc month', 'count(DISTINCT) after a join', 'grain'], tag: ['aggregate', 'group-by', 'ctshop'],
    en: '<p>For <b>paid</b> and <b>shipped</b> orders, per month of the order date (Vietnam time) return <code>month</code> (a date), <code>orders</code> (number of orders), <code>items</code> (Σ qty) and <code>revenue</code> (Σ qty × unit_price). Oldest month first.</p>',
    vi: '<p>Với các đơn <b>paid</b> và <b>shipped</b>, theo tháng của ngày đặt (giờ Việt Nam) trả về <code>month</code> (kiểu date), <code>orders</code> (số đơn), <code>items</code> (Σ qty) và <code>revenue</code> (Σ qty × unit_price). Tháng cũ trước.</p>',
    yc: [['Join orders to order_item: one row per LINE, so count orders with <code>count(DISTINCT o.id)</code>.', 'Nối orders với order_item: mỗi DÒNG ĐƠN một dòng, nên đếm đơn bằng <code>count(DISTINCT o.id)</code>.'], ['<code>date_trunc(\'month\', o.created_at)::date</code>.', '<code>date_trunc(\'month\', o.created_at)::date</code>.']],
    giai: `SELECT date_trunc('month', o.created_at)::date AS month,
       count(DISTINCT o.id)                    AS orders,     -- the join has one row per LINE
       sum(oi.qty)                             AS items,
       sum(oi.qty * oi.unit_price)             AS revenue
FROM orders o
JOIN order_item oi ON oi.order_id = o.id
WHERE o.status IN ('paid', 'shipped')
GROUP BY 1
ORDER BY 1;`,
    kiem: [
      kq(['August, September, October', 'Tháng 8, 9, 10'], T),
      kqAn(['A big order with four lines in October', 'Một đơn lớn bốn dòng trong tháng 10'], "INSERT INTO orders (customer_id, status, created_at) OVERRIDING SYSTEM VALUE VALUES (8, 'paid', '2026-10-07 10:00+07'); INSERT INTO order_item VALUES (15, 1, 2, 5000), (15, 4, 1, 28000), (15, 19, 3, 6000), (15, 25, 1, 32000)", T),
      ma(['count(DISTINCT …)', 'count(DISTINCT …)'], 'count\\s*\\(\\s*DISTINCT'),
    ],
    sai: ["SELECT date_trunc('month', o.created_at)::date AS month, count(*) AS orders, sum(oi.qty) AS items, sum(oi.qty * oi.unit_price) AS revenue FROM orders o JOIN order_item oi ON oi.order_id = o.id WHERE o.status IN ('paid', 'shipped') GROUP BY 1 ORDER BY 1", "SELECT date_trunc('month', o.created_at)::date AS month, count(DISTINCT o.id) AS orders, sum(oi.qty) AS items, sum(oi.qty * oi.unit_price) AS revenue FROM orders o JOIN order_item oi ON oi.order_id = o.id GROUP BY 1 ORDER BY 1"],
    gy: [['After the join, ask: what does ONE row represent? (an order line)', 'Sau phép nối, tự hỏi: MỘT dòng đại diện cho gì? (một dòng đơn)'], ['Counting a coarser thing (orders) at a finer grain needs DISTINCT.', 'Đếm thứ thô hơn (đơn) ở hạt mịn hơn cần DISTINCT.']],
    lhg: [['count(*) for orders — counts lines (an order with 3 lines counts 3 times).', 'count(*) cho số đơn — đếm dòng (đơn có 3 dòng bị đếm 3 lần).'], ['Forgetting the status filter — cancelled orders inflate revenue.', 'Quên lọc trạng thái — đơn huỷ làm phồng doanh thu.']],
    gt: ['<p>The grain rule of lesson 6.2: know what one row of your FROM … JOIN means before you aggregate. Sums of line values are right at line grain; counts of orders need DISTINCT. The hidden check adds a four-line order.</p>', '<p>Luật hạt của bài 6.2: biết một dòng của FROM … JOIN nghĩa là gì trước khi tổng hợp. Tổng giá trị dòng thì đúng ở hạt dòng; đếm đơn cần DISTINCT. Kiểm ẩn thêm một đơn bốn dòng.</p>'],
    tn: [tn('grain', 'hạt'), tn('count(DISTINCT)', 'đếm giá trị khác nhau')],
  }),
]);
