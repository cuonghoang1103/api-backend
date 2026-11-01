/** PostgreSQL · 7.1 — Truy vấn con: vô hướng, IN, bảng dẫn xuất. */
import { mod, pg, kq, kqAn, ma, tn } from './_chung.mjs';
import { O_APP } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-7-1-subquery', '7.1 Subqueries: a query inside a query', [
  pg({
    ...O_APP, t: 'Notes above the average', k: 'EASY', p: 5, kn: ['scalar subquery in WHERE'], tag: ['subquery'],
    en: '<p>Return <code>title, views</code> of the notes whose views are above the average views of all notes, most viewed first.</p>',
    vi: '<p>Trả về <code>title, views</code> của các ghi chú có lượt xem cao hơn lượt xem trung bình của mọi ghi chú, xem nhiều nhất trước.</p>',
    yc: [['<code>WHERE views &gt; (SELECT avg(views) FROM note)</code>.', '<code>WHERE views &gt; (SELECT avg(views) FROM note)</code>.'], ['Never type the average by hand.', 'Đừng bao giờ gõ tay con số trung bình.']],
    giai: `SELECT title, views
FROM note
WHERE views > (SELECT avg(views) FROM note)     -- a scalar subquery: one row, one column
ORDER BY views DESC;`,
    kiem: [
      kq(['Intro to SQL and Indexes', 'Intro to SQL và Indexes'], T),
      kqAn(['A viral note raises the average', 'Một ghi chú nổi bật kéo trung bình lên'], "INSERT INTO note VALUES (8, 4, 'Viral', 'life', 1000, false)", T),
      ma(['Subquery with avg', 'Truy vấn con có avg'], '\\(\\s*SELECT\\s+avg\\s*\\('),
    ],
    sai: ['SELECT title, views FROM note WHERE views > 59.4 ORDER BY views DESC', 'SELECT title, views FROM note WHERE views > (SELECT avg(COALESCE(views, 0)) FROM note) ORDER BY views DESC'],
    gy: [['A subquery in parentheses that returns one value can stand wherever a value can.', 'Truy vấn con trong ngoặc trả một giá trị đứng được ở bất cứ đâu một giá trị đứng được.'], ['avg(views) ignores notes whose views are NULL.', 'avg(views) bỏ qua ghi chú có views NULL.']],
    lhg: [['Hard-coding 59.4 — wrong the moment a note is added.', 'Ghi cứng 59.4 — sai ngay khi có thêm ghi chú.'], ['Averaging with COALESCE(views, 0) changes the question (unknown views counted as 0 lower the bar).', 'Lấy trung bình với COALESCE(views, 0) là đổi câu hỏi (views chưa biết tính là 0 hạ ngưỡng xuống).']],
    gt: ['<p>The inner query runs once, produces a single number, and the outer WHERE compares each row with it. Because it does not reference the outer row, it is <b>uncorrelated</b>.</p>', '<p>Truy vấn trong chạy một lần, cho một con số, rồi WHERE ngoài so từng dòng với nó. Vì không tham chiếu dòng ngoài nên nó <b>không tương quan</b>.</p>'],
    tn: [tn('scalar subquery', 'truy vấn con vô hướng')],
  }),

  pg({
    ...O_APP, t: 'Notes written in Hanoi (IN subquery)', k: 'EASY', p: 5, kn: ['IN (subquery)'], tag: ['subquery'],
    en: '<p>Return the <code>id, title</code> of every note whose author lives in <b>Hanoi</b>, ordered by id. Use a subquery, not a join.</p>',
    vi: '<p>Trả về <code>id, title</code> của mọi ghi chú có tác giả sống ở <b>Hanoi</b>, sắp theo id. Dùng truy vấn con, không dùng JOIN.</p>',
    yc: [['<code>WHERE user_id IN (SELECT id FROM app_user WHERE city = \'Hanoi\')</code>.', '<code>WHERE user_id IN (SELECT id FROM app_user WHERE city = \'Hanoi\')</code>.'], ['No JOIN keyword.', 'Không dùng từ khoá JOIN.']],
    giai: `SELECT id, title
FROM note
WHERE user_id IN (SELECT id FROM app_user WHERE city = 'Hanoi')   -- the set {1, 3}
ORDER BY id;`,
    kiem: [
      kq(['Notes of Cuong and Minh', 'Ghi chú của Cuong và Minh'], T),
      kqAn(['Lan moves to Hanoi', 'Lan chuyển ra Hanoi'], "UPDATE app_user SET city = 'Hanoi' WHERE id = 2", T),
      ma(['IN (SELECT …), no JOIN', 'IN (SELECT …), không JOIN'], '^(?![\\s\\S]*\\bJOIN\\b)[\\s\\S]*\\bIN\\s*\\(\\s*SELECT'),
    ],
    sai: ['SELECT id, title FROM note WHERE user_id IN (1, 3) ORDER BY id', 'SELECT n.id, n.title FROM note n JOIN app_user u ON u.id = n.user_id WHERE u.city = \'Hanoi\' ORDER BY n.id'],
    gy: [['The inner query returns a set of ids; IN tests membership.', 'Truy vấn trong trả một tập id; IN thử thuộc tập.'], ['It must return exactly one column.', 'Nó phải trả đúng một cột.']],
    lhg: [['Typing the ids (1, 3) yourself — breaks when anyone moves.', 'Tự gõ id (1, 3) — hỏng khi có người chuyển nhà.'], ['A subquery returning two columns: "subquery has too many columns".', 'Truy vấn con trả hai cột: "subquery has too many columns".']],
    gt: ['<p>IN (subquery) is a semi-join: each note appears at most once even if the inner set had duplicates, which a JOIN does not guarantee.</p>', '<p>IN (truy vấn con) là semi-join: mỗi ghi chú xuất hiện tối đa một lần dù tập bên trong có trùng lặp — điều mà JOIN không bảo đảm.</p>'],
    tn: [tn('semi-join', 'phép nối nửa')],
  }),

  pg({
    ...O_APP, t: 'Each note against the overall average', k: 'MEDIUM', p: 7, kn: ['scalar subquery in SELECT', 'NULL in arithmetic'], tag: ['subquery'],
    en: '<p>For every note return <code>title, views, overall_avg, diff</code>: the average views of all notes (1 decimal) and <code>views − overall_avg</code> (1 decimal; NULL when views is unknown). Order by note id.</p>',
    vi: '<p>Với mọi ghi chú trả về <code>title, views, overall_avg, diff</code>: lượt xem trung bình của mọi ghi chú (1 chữ số) và <code>views − overall_avg</code> (1 chữ số; NULL khi chưa biết views). Sắp theo id ghi chú.</p>',
    yc: [['A scalar subquery in the SELECT list.', 'Một truy vấn con vô hướng trong danh sách SELECT.'], ['Round both computed columns to 1 decimal.', 'Làm tròn cả hai cột tính toán tới 1 chữ số.']],
    giai: `SELECT title, views,
       (SELECT round(avg(views), 1) FROM note)          AS overall_avg,
       round(views - (SELECT avg(views) FROM note), 1)  AS diff        -- NULL views ⇒ NULL diff
FROM note
ORDER BY id;`,
    kiem: [
      kq(['Seven notes, overall average 59.4', 'Bảy ghi chú, trung bình chung 59.4'], T),
      kqAn(['Averages follow the data', 'Trung bình đi theo dữ liệu'], 'UPDATE note SET views = 300 WHERE id = 4', T),
      ma(['Subquery in SELECT', 'Truy vấn con trong SELECT'], '^\\s*SELECT[\\s\\S]*\\(\\s*SELECT[\\s\\S]*\\bFROM\\s+note\\b'),
    ],
    sai: ['SELECT title, views, 59.4 AS overall_avg, round(views - 59.4, 1) AS diff FROM note ORDER BY id', 'SELECT title, views, (SELECT round(avg(views), 1) FROM note) AS overall_avg, round(COALESCE(views, 0) - (SELECT avg(views) FROM note), 1) AS diff FROM note ORDER BY id'],
    gy: [['The same subquery can be used twice; PostgreSQL evaluates an uncorrelated one once.', 'Có thể dùng cùng truy vấn con hai lần; PostgreSQL tính truy vấn không tương quan một lần.'], ['Any arithmetic with NULL gives NULL.', 'Mọi phép tính với NULL cho ra NULL.']],
    lhg: [['Hard-coding the average.', 'Ghi cứng con số trung bình.'], ['Turning unknown views into 0 — "Date math" suddenly looks 59.4 below average.', 'Biến views chưa biết thành 0 — "Date math" bỗng thấp hơn trung bình 59.4.']],
    gt: ['<p>A scalar subquery in SELECT adds a computed value to every row. Unknown stays unknown: <code>NULL − 59.4</code> is NULL, which is the honest answer.</p>', '<p>Truy vấn con vô hướng trong SELECT thêm một giá trị tính toán vào mọi dòng. Chưa biết vẫn là chưa biết: <code>NULL − 59.4</code> là NULL — câu trả lời trung thực.</p>'],
    tn: [tn('scalar subquery', 'truy vấn con vô hướng')],
  }),

  pg({
    t: 'Orders bigger than the average order (derived table)', k: 'HARD', p: 12, kn: ['derived table in FROM', 'average of aggregates'], tag: ['subquery', 'ctshop'],
    en: '<p>The average order total is the average of the per-order totals (Σ qty × unit_price per order). Return <code>order_id, total</code> of the orders whose total is above that average, biggest first (ties by order_id).</p>',
    vi: '<p>Giá trị đơn trung bình là trung bình của các tổng theo từng đơn (Σ qty × unit_price mỗi đơn). Trả về <code>order_id, total</code> của các đơn có tổng cao hơn trung bình đó, lớn nhất trước (bằng nhau theo order_id).</p>',
    yc: [['Build the per-order totals once (derived table or CTE), then compare with their average.', 'Dựng tổng theo đơn một lần (bảng dẫn xuất hoặc CTE), rồi so với trung bình của chúng.'], ['<code>avg(qty * unit_price)</code> over lines is a different (wrong) number.', '<code>avg(qty * unit_price)</code> trên dòng đơn là một con số khác (sai).']],
    giai: `SELECT t.order_id, t.total
FROM (SELECT order_id, sum(qty * unit_price) AS total
      FROM order_item
      GROUP BY order_id) t                                   -- derived table: one row per order
WHERE t.total > (SELECT avg(total)
                 FROM (SELECT sum(qty * unit_price) AS total
                       FROM order_item GROUP BY order_id) a)  -- average of the ORDER totals
ORDER BY t.total DESC, t.order_id;`,
    kiem: [
      kq(['Orders 2, 9, 14, 4', 'Đơn 2, 9, 14, 4'], T),
      kqAn(['A huge new order moves the average', 'Một đơn rất lớn làm dời trung bình'], "INSERT INTO orders (customer_id, status, created_at) VALUES (8, 'paid', '2026-10-09 10:00+07'); INSERT INTO order_item VALUES (15, 30, 5, 590000)", T),
      ma(['Subquery in FROM (or a CTE)', 'Truy vấn con trong FROM (hoặc CTE)'], '\\bFROM\\s*\\(\\s*SELECT|\\bWITH\\b'),
    ],
    sai: ['SELECT order_id, sum(qty * unit_price) AS total FROM order_item GROUP BY order_id HAVING sum(qty * unit_price) > (SELECT avg(qty * unit_price) FROM order_item) ORDER BY total DESC, order_id'],
    gy: [['Step 1: <code>SELECT order_id, sum(qty * unit_price) AS total FROM order_item GROUP BY order_id</code>.', 'Bước 1: <code>SELECT order_id, sum(qty * unit_price) AS total FROM order_item GROUP BY order_id</code>.'], ['Step 2: use step 1 as a table — twice: once to list, once to average.', 'Bước 2: dùng bước 1 như một bảng — hai lần: một lần để liệt kê, một lần để lấy trung bình.']],
    lhg: [['Averaging LINE values instead of ORDER totals — the bar is much lower and small orders sneak in.', 'Lấy trung bình giá trị DÒNG thay vì tổng ĐƠN — ngưỡng thấp hơn nhiều và đơn nhỏ lọt vào.'], ['Writing <code>avg(sum(…))</code> directly — aggregates cannot be nested in one query level.', 'Viết thẳng <code>avg(sum(…))</code> — hàm tổng hợp không lồng được trong cùng một tầng truy vấn.']],
    gt: ['<p>A subquery in FROM (a derived table) turns an aggregated result into a table you can filter, join or aggregate again. An average of totals needs two levels: totals per order, then their average.</p>', '<p>Truy vấn con trong FROM (bảng dẫn xuất) biến kết quả đã tổng hợp thành một bảng để lọc, nối hay tổng hợp tiếp. Trung bình của các tổng cần hai tầng: tổng mỗi đơn, rồi trung bình của chúng.</p>'],
    tn: [tn('derived table', 'bảng dẫn xuất')],
  }),
]);
