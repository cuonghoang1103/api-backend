/** PostgreSQL · 8.2 — Xếp hạng: ROW_NUMBER, RANK, DENSE_RANK; top-N mỗi nhóm; khử trùng. */
import { mod, pg, kq, kqAn, ma, tn } from './_chung.mjs';
import { O_SALE } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-8-2-ranking', '8.2 Ranking: ROW_NUMBER, RANK & DENSE_RANK', [
  pg({
    ...O_SALE, t: 'Three ranking functions side by side', k: 'EASY', p: 6, kn: ['row_number', 'rank', 'dense_rank'], tag: ['window', 'ranking'],
    en: '<p>Within each region, rank sales by amount (largest first). Return <code>region, seller, amount, rn, rnk, drnk</code> (row_number, rank, dense_rank). Order by region, amount descending, seller.</p>',
    vi: '<p>Trong mỗi vùng, xếp hạng giao dịch theo số tiền (lớn nhất trước). Trả về <code>region, seller, amount, rn, rnk, drnk</code> (row_number, rank, dense_rank). Sắp theo region, amount giảm dần, seller.</p>',
    yc: [['Same window for the three: <code>PARTITION BY region ORDER BY amount DESC</code>.', 'Cùng một cửa sổ cho cả ba: <code>PARTITION BY region ORDER BY amount DESC</code>.'], ['For a deterministic rn add <code>seller</code> as tie-breaker in the window.', 'Để rn xác định, thêm <code>seller</code> làm khoá phá hoà trong cửa sổ.']],
    giai: `SELECT region, seller, amount,
       row_number() OVER (PARTITION BY region ORDER BY amount DESC, seller) AS rn,
       rank()       OVER (PARTITION BY region ORDER BY amount DESC)         AS rnk,
       dense_rank() OVER (PARTITION BY region ORDER BY amount DESC)         AS drnk
FROM sale
ORDER BY region, amount DESC, seller;`,
    kiem: [
      kq(['North has a tie at 150: ranks 1, 2, 2, 4 / dense 1, 2, 2, 3', 'North có hoà ở 150: rank 1, 2, 2, 4 / dense 1, 2, 2, 3'], T),
      kqAn(['A tie for first place in South', 'Hoà hạng nhất ở South'], "INSERT INTO sale VALUES (9, 'South', 'Em', 300, '2026-03-15')", T),
      ma(['Uses dense_rank', 'Dùng dense_rank'], '\\bdense_rank\\s*\\(\\s*\\)'),
    ],
    sai: ['SELECT region, seller, amount, row_number() OVER (PARTITION BY region ORDER BY amount DESC, seller) AS rn, dense_rank() OVER (PARTITION BY region ORDER BY amount DESC) AS rnk, rank() OVER (PARTITION BY region ORDER BY amount DESC) AS drnk FROM sale ORDER BY region, amount DESC, seller'],
    gy: [['row_number never ties; rank skips after a tie; dense_rank does not skip.', 'row_number không bao giờ hoà; rank nhảy số sau khi hoà; dense_rank không nhảy.'], ['North amounts: 200, 150, 150, 100.', 'Số tiền North: 200, 150, 150, 100.']],
    lhg: [['Swapping rank and dense_rank — after a tie for 2nd, rank gives 4, dense_rank gives 3.', 'Nhầm rank với dense_rank — sau khi hoà hạng 2, rank cho 4, dense_rank cho 3.'], ['row_number without a tie-breaker — which of the two 150s gets 2 is arbitrary.', 'row_number thiếu khoá phá hoà — giao dịch 150 nào nhận số 2 là tuỳ ý.']],
    gt: ['<p>The three functions answer "what happens on a tie": row_number picks an arbitrary order (make it deterministic), rank leaves gaps (1, 2, 2, 4), dense_rank does not (1, 2, 2, 3).</p>', '<p>Ba hàm trả lời "hoà thì sao": row_number chọn thứ tự tuỳ ý (hãy làm nó xác định), rank để lỗ hổng (1, 2, 2, 4), dense_rank thì không (1, 2, 2, 3).</p>'],
    tn: [tn('row_number / rank / dense_rank', 'đánh số / xếp hạng / xếp hạng liền')],
  }),

  pg({
    ...O_SALE, t: 'Top 2 sales per region', k: 'MEDIUM', p: 7, kn: ['top-N per group', 'rank in a CTE, filter outside'], tag: ['window', 'ranking', 'cte'],
    en: '<p>Return the <b>two largest sales of every region</b>: <code>region, seller, amount, rn</code>. When amounts tie, the seller name decides. Order by region, rn.</p>',
    vi: '<p>Trả về <b>hai giao dịch lớn nhất của mỗi vùng</b>: <code>region, seller, amount, rn</code>. Số tiền bằng nhau thì tên người bán quyết định. Sắp theo region, rn.</p>',
    yc: [['row_number in a CTE, <code>WHERE rn &lt;= 2</code> outside.', 'row_number trong CTE, <code>WHERE rn &lt;= 2</code> ở ngoài.'], ['Exactly 2 rows per region.', 'Đúng 2 dòng mỗi vùng.']],
    giai: `WITH ranked AS (
  SELECT region, seller, amount,
         row_number() OVER (PARTITION BY region ORDER BY amount DESC, seller) AS rn
  FROM sale
)
SELECT region, seller, amount, rn
FROM ranked
WHERE rn <= 2
ORDER BY region, rn;`,
    kiem: [
      kq(['North: Bob 200, Alice 150 · South: Carol 300, Carol 250', 'North: Bob 200, Alice 150 · South: Carol 300, Carol 250'], T),
      kqAn(['A third region and a tie', 'Vùng thứ ba và một trường hợp hoà'], "INSERT INTO sale VALUES (9, 'Central', 'Hoa', 90, '2026-03-02'), (10, 'Central', 'Giang', 90, '2026-03-03'), (11, 'Central', 'Hoa', 40, '2026-03-04')", T),
      ma(['Filters rn outside the window query', 'Lọc rn ở ngoài truy vấn cửa sổ'], '\\brn\\s*<=?\\s*\\d'),
    ],
    sai: ['WITH ranked AS (SELECT region, seller, amount, rank() OVER (PARTITION BY region ORDER BY amount DESC) AS rn FROM sale) SELECT region, seller, amount, rn FROM ranked WHERE rn <= 2 ORDER BY region, rn', 'SELECT region, seller, amount, 1 AS rn FROM sale ORDER BY amount DESC LIMIT 2'],
    gy: [['You cannot write <code>WHERE row_number() … &lt;= 2</code> — rank first, filter in the outer query.', 'Không viết được <code>WHERE row_number() … &lt;= 2</code> — xếp hạng trước, lọc ở truy vấn ngoài.'], ['row_number guarantees exactly N rows; rank can return more on ties.', 'row_number bảo đảm đúng N dòng; rank có thể trả nhiều hơn khi hoà.']],
    lhg: [['rank() for "top 2": a tie for second place returns 3 rows.', 'rank() cho "top 2": hoà hạng hai trả về 3 dòng.'], ['A global LIMIT 2 — the top two of the whole table, not of each region.', 'LIMIT 2 toàn cục — hai dòng đầu cả bảng, không phải của mỗi vùng.']],
    gt: ['<p>"Top-N per group" = number the rows inside each partition, then keep numbers ≤ N. It is the general form of DISTINCT ON (which only does N = 1).</p>', '<p>"Top-N mỗi nhóm" = đánh số dòng trong từng phần, rồi giữ số ≤ N. Đây là dạng tổng quát của DISTINCT ON (chỉ làm được N = 1).</p>'],
    tn: [tn('top-N per group', 'N dòng đầu mỗi nhóm')],
  }),

  pg({
    ...O_SALE, t: 'Latest sale per seller with ROW_NUMBER', k: 'MEDIUM', p: 7, kn: ['dedup with row_number', 'portable alternative to DISTINCT ON'], tag: ['window', 'ranking'],
    en: '<p>Without DISTINCT ON, return each seller\'s <b>most recent</b> sale: <code>seller, sold_on, amount</code>, ordered by seller. If a seller sold twice on the same day, keep the larger amount.</p>',
    vi: '<p>Không dùng DISTINCT ON, trả về giao dịch <b>gần nhất</b> của mỗi người bán: <code>seller, sold_on, amount</code>, sắp theo seller. Nếu một người bán có hai giao dịch cùng ngày, giữ số tiền lớn hơn.</p>',
    yc: [['<code>row_number() OVER (PARTITION BY seller ORDER BY sold_on DESC, amount DESC)</code> = 1.', '<code>row_number() OVER (PARTITION BY seller ORDER BY sold_on DESC, amount DESC)</code> = 1.'], ['No DISTINCT ON.', 'Không dùng DISTINCT ON.']],
    giai: `SELECT seller, sold_on, amount
FROM (SELECT seller, sold_on, amount,
             row_number() OVER (PARTITION BY seller ORDER BY sold_on DESC, amount DESC) AS rn
      FROM sale) s
WHERE rn = 1
ORDER BY seller;`,
    kiem: [
      kq(['Four sellers, their latest sale', 'Bốn người bán, giao dịch mới nhất'], T),
      kqAn(['Two sales of Alice on the same day', 'Hai giao dịch của Alice cùng ngày'], "INSERT INTO sale VALUES (9, 'North', 'Alice', 90, '2026-03-30'), (10, 'North', 'Alice', 120, '2026-03-30')", T),
      ma(['row_number, no DISTINCT ON', 'row_number, không DISTINCT ON'], '^(?![\\s\\S]*DISTINCT\\s+ON)[\\s\\S]*row_number'),
    ],
    sai: ['SELECT seller, max(sold_on) AS sold_on, max(amount) AS amount FROM sale GROUP BY seller ORDER BY seller', 'SELECT seller, sold_on, amount FROM (SELECT seller, sold_on, amount, row_number() OVER (PARTITION BY seller ORDER BY sold_on DESC) AS rn FROM sale) s WHERE rn = 1 ORDER BY seller'],
    gy: [['The "best" row of each partition gets number 1.', 'Dòng "tốt nhất" của mỗi phần nhận số 1.'], ['The ORDER BY inside OVER decides what "best" means — include the tie-breaker.', 'ORDER BY bên trong OVER quyết định "tốt nhất" là gì — đưa cả khoá phá hoà vào.']],
    lhg: [['<code>max(sold_on), max(amount)</code> — the two maxima may come from different sales (a row that never existed).', '<code>max(sold_on), max(amount)</code> — hai giá trị lớn nhất có thể đến từ hai giao dịch khác nhau (một dòng chưa từng tồn tại).'], ['Forgetting the tie-breaker — on a same-day tie the kept amount is random.', 'Quên khoá phá hoà — khi trùng ngày, số tiền được giữ là ngẫu nhiên.']],
    gt: ['<p>row_number = 1 per partition is the standard SQL way (it runs on SQL Server, MySQL 8, Oracle) to keep one whole row per group — the portable twin of PostgreSQL\'s DISTINCT ON.</p>', '<p>row_number = 1 mỗi phần là cách SQL chuẩn (chạy trên SQL Server, MySQL 8, Oracle) để giữ một dòng nguyên vẹn mỗi nhóm — người anh em chạy mọi hệ của DISTINCT ON trong PostgreSQL.</p>'],
    tn: [tn('deduplication', 'khử trùng lặp')],
  }),

  pg({
    t: 'Best seller of every root category — ties included', k: 'HARD', p: 14, kn: ['rank() = 1 keeps ties', 'aggregate then rank', 'root via self-join'], tag: ['window', 'ranking', 'ctshop'],
    en: '<p>Using lines of <b>paid or shipped</b> orders, find the best-selling product (by units) of every <b>root</b> category. If two products tie for first place, show both. Return <code>root, sku, units</code>, ordered by root, sku.</p>',
    vi: '<p>Dùng các dòng của đơn <b>paid hoặc shipped</b>, tìm sản phẩm bán chạy nhất (theo số món) của mỗi danh mục <b>gốc</b>. Nếu hai sản phẩm hoà hạng nhất, hiện cả hai. Trả về <code>root, sku, units</code>, sắp theo root, sku.</p>',
    yc: [['Step 1: units per product with its root (join category twice).', 'Bước 1: số món theo sản phẩm kèm gốc (nối category hai lần).'], ['Step 2: <code>rank() OVER (PARTITION BY root ORDER BY units DESC)</code> = 1 — rank keeps ties.', 'Bước 2: <code>rank() OVER (PARTITION BY root ORDER BY units DESC)</code> = 1 — rank giữ các dòng hoà.']],
    giai: `WITH sold AS (
  SELECT r.name AS root, p.sku, sum(oi.qty) AS units
  FROM orders o
  JOIN order_item oi ON oi.order_id = o.id
  JOIN product p     ON p.id = oi.product_id
  JOIN category c    ON c.id = p.category_id
  JOIN category r    ON r.id = c.parent_id
  WHERE o.status IN ('paid', 'shipped')
  GROUP BY r.name, p.sku
), ranked AS (
  SELECT root, sku, units, rank() OVER (PARTITION BY root ORDER BY units DESC) AS rk
  FROM sold
)
SELECT root, sku, units
FROM ranked
WHERE rk = 1                       -- rank: every product tied for first stays
ORDER BY root, sku;`,
    kiem: [
      kq(['One winner per root', 'Mỗi gốc một sản phẩm thắng'], T),
      kqAn(['A tie for first place under Vở & giấy', 'Hoà hạng nhất trong Vở & giấy'], "INSERT INTO order_item VALUES (12, 25, 12, 32000)", T),
      ma(['rank() (not row_number)', 'rank() (không phải row_number)'], '\\b(rank|dense_rank)\\s*\\(\\s*\\)'),
    ],
    sai: ["WITH sold AS (SELECT r.name AS root, p.sku, sum(oi.qty) AS units FROM orders o JOIN order_item oi ON oi.order_id = o.id JOIN product p ON p.id = oi.product_id JOIN category c ON c.id = p.category_id JOIN category r ON r.id = c.parent_id WHERE o.status IN ('paid', 'shipped') GROUP BY r.name, p.sku), ranked AS (SELECT root, sku, units, row_number() OVER (PARTITION BY root ORDER BY units DESC, sku) AS rk FROM sold) SELECT root, sku, units FROM ranked WHERE rk = 1 ORDER BY root, sku", "WITH sold AS (SELECT r.name AS root, p.sku, sum(oi.qty) AS units FROM orders o JOIN order_item oi ON oi.order_id = o.id JOIN product p ON p.id = oi.product_id JOIN category c ON c.id = p.category_id JOIN category r ON r.id = c.parent_id GROUP BY r.name, p.sku), ranked AS (SELECT root, sku, units, rank() OVER (PARTITION BY root ORDER BY units DESC) AS rk FROM sold) SELECT root, sku, units FROM ranked WHERE rk = 1 ORDER BY root, sku"],
    gy: [['Aggregate first (units per product), then rank the aggregated rows.', 'Tổng hợp trước (số món theo sản phẩm), rồi xếp hạng các dòng đã tổng hợp.'], ['"Show both on a tie" is exactly what rank() = 1 does.', '"Hoà thì hiện cả hai" chính là việc rank() = 1 làm.']],
    lhg: [['row_number() = 1 — on a tie one product silently loses its medal.', 'row_number() = 1 — khi hoà, một sản phẩm lặng lẽ mất huy chương.'], ['Counting cancelled and pending orders as sales.', 'Tính cả đơn huỷ và đơn chờ là đã bán.']],
    gt: ['<p>Choosing the ranking function is a business decision: "exactly one winner" ⇒ row_number with a tie-breaker; "everyone who shares first place" ⇒ rank (or dense_rank) = 1. Lab 4 W4 shows how the three give different row counts.</p>', '<p>Chọn hàm xếp hạng là quyết định nghiệp vụ: "đúng một người thắng" ⇒ row_number kèm khoá phá hoà; "mọi người cùng hạng nhất" ⇒ rank (hoặc dense_rank) = 1. Lab 4 W4 cho thấy ba hàm ra số dòng khác nhau thế nào.</p>'],
    tn: [tn('rank', 'xếp hạng (có nhảy số)')],
  }),
]);
