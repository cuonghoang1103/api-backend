/** PostgreSQL · 8.4 — Khung cửa sổ, FIRST_VALUE / LAST_VALUE & NTILE. */
import { mod, pg, kq, kqAn, ma, tn } from './_chung.mjs';
import { O_SALE } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-8-4-frame-ntile', '8.4 Window frames, FIRST_VALUE & NTILE', [
  pg({
    ...O_SALE, t: 'Two-sale moving average', k: 'EASY', p: 6, kn: ['ROWS BETWEEN 1 PRECEDING AND CURRENT ROW'], tag: ['window', 'frame'],
    en: '<p>For every sale return <code>seller, sold_on, amount, moving_avg2</code> — the average of this sale and the seller\'s previous one (1 decimal). Order by seller, sold_on.</p>',
    vi: '<p>Với mọi giao dịch trả về <code>seller, sold_on, amount, moving_avg2</code> — trung bình của giao dịch này và giao dịch trước đó của người bán (1 chữ số). Sắp theo seller, sold_on.</p>',
    yc: [['Frame <code>ROWS BETWEEN 1 PRECEDING AND CURRENT ROW</code>.', 'Khung <code>ROWS BETWEEN 1 PRECEDING AND CURRENT ROW</code>.'], ['The first sale of a seller averages over itself only.', 'Giao dịch đầu của mỗi người chỉ lấy trung bình trên chính nó.']],
    giai: `SELECT seller, sold_on, amount,
       round(avg(amount) OVER (PARTITION BY seller ORDER BY sold_on
                               ROWS BETWEEN 1 PRECEDING AND CURRENT ROW), 1) AS moving_avg2
FROM sale
ORDER BY seller, sold_on;`,
    kiem: [
      kq(['Alice 100.0, 125.0 …', 'Alice 100.0, 125.0 …'], T),
      kqAn(['A third sale: the window slides', 'Giao dịch thứ ba: cửa sổ trượt'], "INSERT INTO sale VALUES (9, 'North', 'Alice', 50, '2026-03-30')", T),
      ma(['A ROWS frame', 'Một khung ROWS'], 'ROWS\\s+BETWEEN\\s+1\\s+PRECEDING'),
    ],
    sai: ['SELECT seller, sold_on, amount, round(avg(amount) OVER (PARTITION BY seller ORDER BY sold_on), 1) AS moving_avg2 FROM sale ORDER BY seller, sold_on'],
    gy: [['The frame clause comes after ORDER BY inside OVER.', 'Mệnh đề khung đặt sau ORDER BY trong OVER.'], ['With 2 sales per seller the default frame happens to look similar — the hidden check adds a third.', 'Mỗi người 2 giao dịch thì khung mặc định trông giống — kiểm ẩn thêm giao dịch thứ ba.']],
    lhg: [['Relying on the default frame (start → current row): it is a cumulative average, not a moving one.', 'Dựa vào khung mặc định (đầu → dòng hiện tại): đó là trung bình cộng dồn, không phải trượt.'], ['RANGE BETWEEN 1 PRECEDING … on a date: means "1 day before", not "1 row before".', 'RANGE BETWEEN 1 PRECEDING … trên cột ngày: nghĩa là "1 ngày trước", không phải "1 dòng trước".']],
    gt: ['<p>The frame defines which rows of the partition the aggregate sees. ROWS counts physical rows; the default with ORDER BY is RANGE from the start to the current row.</p>', '<p>Khung xác định hàm tổng hợp nhìn thấy những dòng nào của phần. ROWS đếm dòng vật lý; mặc định khi có ORDER BY là RANGE từ đầu tới dòng hiện tại.</p>'],
    tn: [tn('window frame', 'khung cửa sổ')],
  }),

  pg({
    ...O_SALE, t: 'Top and bottom of the region: the LAST_VALUE trap', k: 'MEDIUM', p: 8, kn: ['first_value', 'last_value', 'UNBOUNDED FOLLOWING'], tag: ['window', 'frame'],
    en: '<p>For every sale return <code>region, seller, amount, top_amount, bottom_amount</code> — the largest and the smallest amount of its region. Order by region, amount descending, seller.</p>',
    vi: '<p>Với mọi giao dịch trả về <code>region, seller, amount, top_amount, bottom_amount</code> — số tiền lớn nhất và nhỏ nhất của vùng. Sắp theo region, amount giảm dần, seller.</p>',
    yc: [['<code>first_value(amount) OVER (PARTITION BY region ORDER BY amount DESC)</code> for the top.', '<code>first_value(amount) OVER (PARTITION BY region ORDER BY amount DESC)</code> cho số lớn nhất.'], ['last_value needs the frame <code>ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</code>.', 'last_value cần khung <code>ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</code>.']],
    giai: `SELECT region, seller, amount,
       first_value(amount) OVER w AS top_amount,
       last_value(amount)  OVER w AS bottom_amount
FROM sale
WINDOW w AS (PARTITION BY region ORDER BY amount DESC
             ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)   -- the whole partition
ORDER BY region, amount DESC, seller;`,
    kiem: [
      kq(['North 200/100, South 300/180', 'North 200/100, South 300/180'], T),
      kqAn(['A new smallest sale in South', 'Giao dịch nhỏ nhất mới ở South'], "INSERT INTO sale VALUES (9, 'South', 'Em', 40, '2026-03-15')", T),
      ma(['UNBOUNDED FOLLOWING (or min/max over the partition)', 'UNBOUNDED FOLLOWING (hoặc min/max trên phần)'], 'UNBOUNDED\\s+FOLLOWING|\\bmin\\s*\\(\\s*amount\\s*\\)\\s*OVER'),
    ],
    sai: ['SELECT region, seller, amount, first_value(amount) OVER (PARTITION BY region ORDER BY amount DESC) AS top_amount, last_value(amount) OVER (PARTITION BY region ORDER BY amount DESC) AS bottom_amount FROM sale ORDER BY region, amount DESC, seller'],
    gy: [['With ORDER BY, the default frame ends at the CURRENT row (and its peers).', 'Có ORDER BY thì khung mặc định kết thúc ở dòng HIỆN TẠI (và các dòng ngang hàng).'], ['So last_value with the default frame is "the current row", not the last of the partition.', 'Nên last_value với khung mặc định là "dòng hiện tại", không phải dòng cuối của phần.']],
    lhg: [['last_value with the default frame — every row shows its own amount as the "bottom".', 'last_value với khung mặc định — mọi dòng hiện chính số tiền của nó là "nhỏ nhất".'], ['Using first_value with ORDER BY amount (ascending) for the top.', 'Dùng first_value với ORDER BY amount (tăng dần) cho số lớn nhất.']],
    gt: ['<p>first_value works with the default frame because the frame always starts at the partition\'s first row. last_value needs the frame extended to UNBOUNDED FOLLOWING — or simply use <code>min(amount) OVER (PARTITION BY region)</code>.</p>', '<p>first_value đúng với khung mặc định vì khung luôn bắt đầu ở dòng đầu của phần. last_value cần khung mở tới UNBOUNDED FOLLOWING — hoặc đơn giản dùng <code>min(amount) OVER (PARTITION BY region)</code>.</p>'],
    tn: [tn('first_value / last_value', 'giá trị đầu / cuối của khung')],
  }),

  pg({
    ...O_SALE, t: 'Split sales into halves with NTILE', k: 'MEDIUM', p: 5, kn: ['ntile(n)'], tag: ['window', 'ntile'],
    en: '<p>Split all sales into 2 equal buckets by amount (largest first): return <code>seller, amount, half</code> (1 = top half). Order by amount descending, seller.</p>',
    vi: '<p>Chia mọi giao dịch thành 2 nhóm đều nhau theo số tiền (lớn nhất trước): trả về <code>seller, amount, half</code> (1 = nửa trên). Sắp theo amount giảm dần, seller.</p>',
    yc: [['<code>ntile(2) OVER (ORDER BY amount DESC, seller)</code>.', '<code>ntile(2) OVER (ORDER BY amount DESC, seller)</code>.'], ['Include the tie-breaker so the buckets are deterministic.', 'Đưa khoá phá hoà vào để nhóm xác định.']],
    giai: `SELECT seller, amount,
       ntile(2) OVER (ORDER BY amount DESC, seller) AS half
FROM sale
ORDER BY amount DESC, seller;`,
    kiem: [
      kq(['Four rows in each half', 'Mỗi nửa bốn dòng'], T),
      kqAn(['An odd count: the first bucket gets the extra row', 'Số lẻ: nhóm đầu nhận thêm một dòng'], "INSERT INTO sale VALUES (9, 'North', 'Em', 175, '2026-03-15')", T),
      ma(['Uses ntile(2)', 'Dùng ntile(2)'], '\\bntile\\s*\\(\\s*2\\s*\\)'),
    ],
    sai: ['SELECT seller, amount, CASE WHEN amount >= 175 THEN 1 ELSE 2 END AS half FROM sale ORDER BY amount DESC, seller', 'SELECT seller, amount, ntile(2) OVER (ORDER BY amount) AS half FROM sale ORDER BY amount DESC, seller'],
    gy: [['ntile(n) numbers rows 1..n in equal-sized consecutive groups.', 'ntile(n) đánh số 1..n cho các nhóm liên tiếp có cỡ bằng nhau.'], ['If rows do not divide evenly, earlier buckets get one more.', 'Nếu không chia đều, các nhóm đầu được thêm một dòng.']],
    lhg: [['A hard-coded threshold (175) — not a half once the data changes.', 'Ngưỡng ghi cứng (175) — không còn là một nửa khi dữ liệu đổi.'], ['Ordering ascending: half 1 becomes the BOTTOM half.', 'Sắp tăng dần: nửa 1 thành nửa DƯỚI.']],
    gt: ['<p>ntile buckets by position, not by value: two equal amounts can land in different buckets. Use it for quartiles/deciles of a ranked list; use width_bucket for value ranges.</p>', '<p>ntile chia nhóm theo vị trí, không theo giá trị: hai số tiền bằng nhau có thể rơi vào hai nhóm. Dùng nó cho tứ phân vị/thập phân vị của danh sách đã xếp; dùng width_bucket cho khoảng giá trị.</p>'],
    tn: [tn('ntile', 'chia nhóm đều')],
  }),

  pg({
    t: 'Each order inside its customer\'s history', k: 'HARD', p: 14, kn: ['several windows', 'share of partition', 'running total with a unique order'], tag: ['window', 'frame', 'ctshop'],
    en: '<p>For every <b>paid or shipped</b> order return <code>customer_id, order_id, total, customer_total, pct, cum_total, nth</code>: the order total (Σ qty × unit_price), the customer\'s total over those orders, this order\'s share in % (1 decimal), the customer\'s cumulative total in time order, and the order\'s position in that history (1 = first). Order by customer_id, created_at.</p>',
    vi: '<p>Với mọi đơn <b>paid hoặc shipped</b> trả về <code>customer_id, order_id, total, customer_total, pct, cum_total, nth</code>: tổng đơn (Σ qty × unit_price), tổng của khách trên các đơn đó, phần trăm của đơn này (1 chữ số), tổng cộng dồn của khách theo thời gian, và vị trí của đơn trong lịch sử đó (1 = đơn đầu). Sắp theo customer_id, created_at.</p>',
    yc: [['Order totals in a CTE first (one row per order).', 'Tổng đơn trong CTE trước (mỗi đơn một dòng).'], ['cum_total: <code>ORDER BY created_at, order_id</code> with a ROWS frame (unique order).', 'cum_total: <code>ORDER BY created_at, order_id</code> với khung ROWS (thứ tự duy nhất).']],
    giai: `WITH t AS (
  SELECT o.id AS order_id, o.customer_id, o.created_at, sum(oi.qty * oi.unit_price) AS total
  FROM orders o
  JOIN order_item oi ON oi.order_id = o.id
  WHERE o.status IN ('paid', 'shipped')
  GROUP BY o.id, o.customer_id, o.created_at
)
SELECT customer_id, order_id, total,
       sum(total) OVER (PARTITION BY customer_id)                                   AS customer_total,
       round(100.0 * total / sum(total) OVER (PARTITION BY customer_id), 1)         AS pct,
       sum(total) OVER (PARTITION BY customer_id ORDER BY created_at, order_id
                        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)           AS cum_total,
       row_number() OVER (PARTITION BY customer_id ORDER BY created_at, order_id)   AS nth
FROM t
ORDER BY customer_id, created_at;`,
    kiem: [
      kq(['Ten orders of six customers', 'Mười đơn của sáu khách'], T),
      kqAn(['Customer 6 completes two orders at the same time', 'Khách 6 hoàn tất hai đơn cùng thời điểm'], "UPDATE orders SET status = 'paid', created_at = '2026-10-02 09:00+07' WHERE id IN (11, 14)", T),
      ma(['A ROWS frame for the running total', 'Khung ROWS cho tổng dồn'], 'ROWS\\s+BETWEEN\\s+UNBOUNDED\\s+PRECEDING'),
    ],
    sai: ["WITH t AS (SELECT o.id AS order_id, o.customer_id, o.created_at, sum(oi.qty * oi.unit_price) AS total FROM orders o JOIN order_item oi ON oi.order_id = o.id WHERE o.status IN ('paid', 'shipped') GROUP BY o.id, o.customer_id, o.created_at) SELECT customer_id, order_id, total, sum(total) OVER (PARTITION BY customer_id) AS customer_total, round(100.0 * total / sum(total) OVER (PARTITION BY customer_id), 1) AS pct, sum(total) OVER (PARTITION BY customer_id ORDER BY created_at) AS cum_total, row_number() OVER (PARTITION BY customer_id ORDER BY created_at, order_id) AS nth FROM t ORDER BY customer_id, created_at"],
    gy: [['Two kinds of windows: whole partition (customer_total, pct) and growing frame (cum_total, nth).', 'Hai loại cửa sổ: cả phần (customer_total, pct) và khung lớn dần (cum_total, nth).'], ['If two orders share created_at, only a unique ORDER BY + ROWS gives each its own running total.', 'Nếu hai đơn trùng created_at, chỉ ORDER BY duy nhất + ROWS mới cho mỗi đơn một tổng dồn riêng.']],
    lhg: [['Default RANGE frame with a repeated timestamp: both orders show the same cumulative total.', 'Khung RANGE mặc định với thời điểm lặp lại: hai đơn hiện cùng một tổng dồn.'], ['Computing windows on order_item rows — totals are per line, not per order.', 'Tính cửa sổ trên dòng order_item — tổng theo dòng, không theo đơn.']],
    gt: ['<p>The same partition can host different frames: no ORDER BY ⇒ the whole partition, ORDER BY + ROWS ⇒ a growing prefix. Making the ORDER BY unique (created_at, order_id) is what makes running totals reproducible.</p>', '<p>Cùng một phần có thể dùng khung khác nhau: không ORDER BY ⇒ cả phần, ORDER BY + ROWS ⇒ một đoạn đầu lớn dần. Làm ORDER BY duy nhất (created_at, order_id) mới khiến tổng dồn lặp lại được.</p>'],
    tn: [tn('ROWS vs RANGE', 'khung theo dòng vs theo giá trị')],
  }),
]);
