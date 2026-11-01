/** PostgreSQL · 8.1 — Hàm cửa sổ là gì: tổng hợp mà không gộp dòng. Bảng sale của bài + CT Shop mini. */
import { mod, pg, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { O_SALE } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-8-1-window-la-gi', '8.1 What a window function is: aggregate without collapsing', [
  pg({
    ...O_SALE, t: 'A grand total on every row: OVER ()', k: 'EASY', p: 5, kn: ['sum() OVER ()', 'percentage of total'], tag: ['window'],
    en: '<p>For every sale return <code>seller, amount, grand_total, pct_of_total</code> — the total of all sales on every row, and this sale as a percentage of it (1 decimal). Order by id.</p>',
    vi: '<p>Với mọi giao dịch trả về <code>seller, amount, grand_total, pct_of_total</code> — tổng mọi giao dịch trên từng dòng, và giao dịch này chiếm bao nhiêu phần trăm (1 chữ số). Sắp theo id.</p>',
    yc: [['<code>sum(amount) OVER ()</code> — an empty window means "all rows".', '<code>sum(amount) OVER ()</code> — cửa sổ rỗng nghĩa là "mọi dòng".'], ['No GROUP BY: all 8 rows stay.', 'Không GROUP BY: giữ đủ 8 dòng.']],
    giai: `SELECT seller, amount,
       sum(amount) OVER ()                            AS grand_total,
       round(100.0 * amount / sum(amount) OVER (), 1) AS pct_of_total
FROM sale
ORDER BY id;`,
    kiem: [
      kq(['Eight rows, grand total 1550', 'Tám dòng, tổng 1550'], T),
      kqAn(['A big new sale changes every percentage', 'Một giao dịch lớn mới làm đổi mọi phần trăm'], "INSERT INTO sale VALUES (9, 'North', 'Bob', 450, '2026-03-20')", T),
      ma(['Uses OVER ()', 'Dùng OVER ()'], 'OVER\\s*\\(\\s*\\)'),
    ],
    sai: ['SELECT seller, amount, (SELECT sum(amount) FROM sale) AS grand_total, round(100 * amount / 1550, 1) AS pct_of_total FROM sale ORDER BY id', 'SELECT seller, amount, sum(amount) AS grand_total, round(100.0 * amount / sum(amount), 1) AS pct_of_total FROM sale GROUP BY id, seller, amount ORDER BY id'],
    gy: [['A window function = an aggregate followed by OVER (…).', 'Hàm cửa sổ = một hàm tổng hợp kèm OVER (…).'], ['The rows are not collapsed: every row gets the value.', 'Các dòng không bị gộp: dòng nào cũng nhận giá trị.']],
    lhg: [['Hard-coding the total 1550.', 'Ghi cứng tổng 1550.'], ['GROUP BY id with sum(amount): each group is one row, so "total" equals the row and every percentage is 100.', 'GROUP BY id với sum(amount): mỗi nhóm một dòng nên "tổng" bằng chính dòng và mọi phần trăm là 100.']],
    gt: ['<p>An aggregate with OVER () is computed over the whole result but written next to each row. That is the one idea of chapter 8: aggregate without collapsing.</p>', '<p>Hàm tổng hợp với OVER () được tính trên toàn bộ kết quả nhưng ghi cạnh từng dòng. Đó là ý chính của chương 8: tổng hợp mà không gộp dòng.</p>'],
    tn: [TN.window],
  }),

  pg({
    ...O_SALE, t: 'One window per region: PARTITION BY', k: 'MEDIUM', p: 6, kn: ['PARTITION BY'], tag: ['window'],
    en: '<p>For every sale return <code>region, seller, amount, region_total, pct_of_region</code> (1 decimal). Order by region, then id.</p>',
    vi: '<p>Với mọi giao dịch trả về <code>region, seller, amount, region_total, pct_of_region</code> (1 chữ số). Sắp theo region, rồi id.</p>',
    yc: [['<code>sum(amount) OVER (PARTITION BY region)</code>.', '<code>sum(amount) OVER (PARTITION BY region)</code>.'], ['Use the same window in the percentage.', 'Dùng cùng cửa sổ đó trong phần trăm.']],
    giai: `SELECT region, seller, amount,
       sum(amount) OVER (PARTITION BY region)                             AS region_total,
       round(100.0 * amount / sum(amount) OVER (PARTITION BY region), 1)  AS pct_of_region
FROM sale
ORDER BY region, id;`,
    kiem: [
      kq(['North 600, South 950', 'North 600, South 950'], T),
      kqAn(['A new region', 'Một vùng mới'], "INSERT INTO sale VALUES (9, 'Central', 'Hoa', 120, '2026-03-02'), (10, 'Central', 'Hoa', 80, '2026-03-12')", T),
      ma(['PARTITION BY region', 'PARTITION BY region'], 'PARTITION\\s+BY\\s+region'),
    ],
    sai: ['SELECT region, seller, amount, sum(amount) OVER () AS region_total, round(100.0 * amount / sum(amount) OVER (), 1) AS pct_of_region FROM sale ORDER BY region, id', 'SELECT region, seller, amount, sum(amount) OVER (PARTITION BY seller) AS region_total, round(100.0 * amount / sum(amount) OVER (PARTITION BY seller), 1) AS pct_of_region FROM sale ORDER BY region, id'],
    gy: [['PARTITION BY splits the rows into groups for the window only.', 'PARTITION BY chia dòng thành nhóm chỉ cho cửa sổ.'], ['Like GROUP BY, but the rows stay.', 'Giống GROUP BY, nhưng các dòng vẫn còn.']],
    lhg: [['OVER () — the total of the whole table, not of the region.', 'OVER () — tổng cả bảng, không phải của vùng.'], ['Partitioning by seller instead of region.', 'Chia theo seller thay vì region.']],
    gt: ['<p>PARTITION BY region gives each row the aggregate of its own region. You can mix windows with different partitions in one SELECT.</p>', '<p>PARTITION BY region cho mỗi dòng giá trị tổng hợp của chính vùng đó. Một câu SELECT có thể trộn nhiều cửa sổ với cách chia khác nhau.</p>'],
    tn: [tn('PARTITION BY', 'chia cửa sổ theo nhóm')],
  }),

  pg({
    ...O_SALE, t: 'Sales above their region average (window, then filter)', k: 'MEDIUM', p: 8, kn: ['window functions cannot be used in WHERE', 'subquery / CTE around the window'], tag: ['window', 'cte'],
    en: '<p>Return <code>id, region, seller, amount, region_avg</code> (1 decimal) of the sales whose amount is <b>above the average of their region</b>, ordered by id.</p>',
    vi: '<p>Trả về <code>id, region, seller, amount, region_avg</code> (1 chữ số) của các giao dịch có số tiền <b>cao hơn trung bình vùng của nó</b>, sắp theo id.</p>',
    yc: [['Compute <code>avg(amount) OVER (PARTITION BY region)</code> in a CTE or subquery, filter outside.', 'Tính <code>avg(amount) OVER (PARTITION BY region)</code> trong CTE hoặc truy vấn con, lọc ở ngoài.'], ['A window function in WHERE is an error.', 'Hàm cửa sổ trong WHERE là lỗi.']],
    giai: `WITH s AS (
  SELECT id, region, seller, amount,
         avg(amount) OVER (PARTITION BY region) AS region_avg   -- windows run AFTER WHERE …
  FROM sale
)
SELECT id, region, seller, amount, round(region_avg, 1) AS region_avg
FROM s
WHERE amount > region_avg                                       -- … so filter one level up
ORDER BY id;`,
    kiem: [
      kq(['Sales 3, 5, 6', 'Giao dịch 3, 5, 6'], T),
      kqAn(['Averages move with the data', 'Trung bình đổi theo dữ liệu'], "INSERT INTO sale VALUES (9, 'North', 'Alice', 20, '2026-03-25')", T),
      ma(['Window inside a CTE or subquery', 'Cửa sổ nằm trong CTE hoặc truy vấn con'], '(WITH|FROM\\s*\\()[\\s\\S]*OVER\\s*\\('),
    ],
    sai: ['SELECT id, region, seller, amount, round((SELECT avg(amount) FROM sale), 1) AS region_avg FROM sale WHERE amount > (SELECT avg(amount) FROM sale) ORDER BY id'],
    gy: [['Logical order: FROM → WHERE → GROUP BY → HAVING → window functions → SELECT → ORDER BY.', 'Thứ tự logic: FROM → WHERE → GROUP BY → HAVING → hàm cửa sổ → SELECT → ORDER BY.'], ['Wrap the windowed query and filter its output.', 'Bọc truy vấn có cửa sổ lại rồi lọc kết quả của nó.']],
    lhg: [['<code>WHERE amount &gt; avg(amount) OVER (…)</code> — ERROR: window functions are not allowed in WHERE.', '<code>WHERE amount &gt; avg(amount) OVER (…)</code> — LỖI: window functions are not allowed in WHERE.'], ['Comparing with the average of the whole table — Carol\'s 250 looks big against North sales.', 'So với trung bình cả bảng — 250 của Carol trông lớn so với các giao dịch miền Bắc.']],
    gt: ['<p>Window functions are evaluated after WHERE/GROUP BY/HAVING, so they cannot filter in the same level. A CTE or subquery computes the window first; the outer query filters.</p>', '<p>Hàm cửa sổ được tính sau WHERE/GROUP BY/HAVING, nên không lọc được trong cùng tầng. CTE hoặc truy vấn con tính cửa sổ trước; truy vấn ngoài lọc.</p>'],
    tn: [TN.window],
  }),

  pg({
    t: 'Each product next to its category: price gap and stock share', k: 'HARD', p: 10, kn: ['several windows in one SELECT', 'avg/sum OVER (PARTITION BY)'], tag: ['window', 'ctshop'],
    en: '<p>For every <b>active</b> product return <code>sku, category_id, price, cat_avg, gap, stock_share</code>: the average price of active products in its category (whole đồng), <code>price − cat_avg</code>, and this product\'s share of its category\'s stock in % (1 decimal; 0 when the category has no stock). Order by category_id, sku.</p>',
    vi: '<p>Với mọi sản phẩm <b>đang bán</b> trả về <code>sku, category_id, price, cat_avg, gap, stock_share</code>: giá trung bình của các sản phẩm đang bán trong danh mục (làm tròn tới đồng), <code>price − cat_avg</code>, và phần trăm tồn kho của sản phẩm này trong tồn kho danh mục (1 chữ số; 0 khi danh mục hết hàng). Sắp theo category_id, sku.</p>',
    yc: [['Windows partitioned by category_id over the active products only.', 'Cửa sổ chia theo category_id trên các sản phẩm đang bán.'], ['Guard the division with <code>NULLIF(…, 0)</code> + COALESCE.', 'Chặn phép chia bằng <code>NULLIF(…, 0)</code> + COALESCE.']],
    giai: `SELECT sku, category_id, price,
       round(avg(price) OVER w)            AS cat_avg,
       price - round(avg(price) OVER w)    AS gap,
       COALESCE(round(100.0 * stock / NULLIF(sum(stock) OVER w, 0), 1), 0) AS stock_share
FROM product
WHERE is_active
WINDOW w AS (PARTITION BY category_id)        -- one named window, used three times
ORDER BY category_id, sku;`,
    kiem: [
      kq(['Fifteen active products', 'Mười lăm sản phẩm đang bán'], T),
      kqAn(['A new pen and a sold-out category', 'Bút mới và một danh mục hết hàng'], "INSERT INTO product (sku, name, category_id, price, stock) VALUES ('CT0505', 'Bút gel Zebra', 5, 24000, 35); UPDATE product SET stock = 0 WHERE category_id = 11", T),
      ma(['PARTITION BY category_id', 'PARTITION BY category_id'], 'PARTITION\\s+BY\\s+category_id'),
    ],
    sai: ['SELECT sku, category_id, price, round(avg(price) OVER (PARTITION BY category_id)) AS cat_avg, price - round(avg(price) OVER (PARTITION BY category_id)) AS gap, round(100.0 * stock / sum(stock) OVER (PARTITION BY category_id), 1) AS stock_share FROM product WHERE is_active ORDER BY category_id, sku', 'SELECT sku, category_id, price, round(avg(price) OVER (PARTITION BY category_id)) AS cat_avg, price - round(avg(price) OVER (PARTITION BY category_id)) AS gap, COALESCE(round(100.0 * stock / NULLIF(sum(stock) OVER (PARTITION BY category_id), 0), 1), 0) AS stock_share FROM product ORDER BY category_id, sku'],
    gy: [['<code>WINDOW w AS (…)</code> names a window you can reuse.', '<code>WINDOW w AS (…)</code> đặt tên một cửa sổ để dùng lại.'], ['WHERE runs before the window, so the averages only see active products.', 'WHERE chạy trước cửa sổ, nên trung bình chỉ thấy sản phẩm đang bán.']],
    lhg: [['Dividing by a category stock of 0 — ERROR: division by zero.', 'Chia cho tồn kho danh mục bằng 0 — LỖI: division by zero.'], ['No is_active filter — the discontinued Deli calculator appears and lowers its category average.', 'Không lọc is_active — máy tính Deli ngừng bán xuất hiện và kéo trung bình danh mục xuống.']],
    gt: ['<p>Several windows over the same partition are cheap: PostgreSQL sorts once. NULLIF(x, 0) turns a zero divisor into NULL (no error), and COALESCE turns the NULL result into 0.</p>', '<p>Nhiều cửa sổ trên cùng một cách chia rất rẻ: PostgreSQL chỉ sắp một lần. NULLIF(x, 0) biến số chia 0 thành NULL (không lỗi), COALESCE biến kết quả NULL thành 0.</p>'],
    tn: [TN.window, tn('WINDOW clause', 'đặt tên cửa sổ')],
  }),
]);
