/** PostgreSQL · 8.3 — LAG, LEAD & tổng luỹ tiến. */
import { mod, pg, kq, kqAn, ma, tn } from './_chung.mjs';
import { O_SALE } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-8-3-lag-running-total', '8.3 LAG, LEAD & running totals', [
  pg({
    ...O_SALE, t: 'Running total per seller', k: 'EASY', p: 5, kn: ['sum() OVER (PARTITION BY … ORDER BY …)'], tag: ['window', 'running-total'],
    en: '<p>For every sale return <code>seller, sold_on, amount, running_total</code> — the seller\'s cumulative sales up to and including that day. Order by seller, sold_on.</p>',
    vi: '<p>Với mọi giao dịch trả về <code>seller, sold_on, amount, running_total</code> — doanh số cộng dồn của người bán tới hết ngày đó. Sắp theo seller, sold_on.</p>',
    yc: [['An ORDER BY inside OVER turns sum() into a running sum.', 'ORDER BY bên trong OVER biến sum() thành tổng cộng dồn.'], ['Restart for each seller: PARTITION BY seller.', 'Bắt đầu lại cho mỗi người bán: PARTITION BY seller.']],
    giai: `SELECT seller, sold_on, amount,
       sum(amount) OVER (PARTITION BY seller ORDER BY sold_on) AS running_total
FROM sale
ORDER BY seller, sold_on;`,
    kiem: [
      kq(['Alice 100 → 250, Bob 200 → 350, …', 'Alice 100 → 250, Bob 200 → 350, …'], T),
      kqAn(['A third sale of Carol', 'Giao dịch thứ ba của Carol'], "INSERT INTO sale VALUES (9, 'South', 'Carol', 75, '2026-03-28')", T),
      ma(['ORDER BY inside OVER', 'ORDER BY bên trong OVER'], 'OVER\\s*\\([^)]*ORDER\\s+BY'),
    ],
    sai: ['SELECT seller, sold_on, amount, sum(amount) OVER (PARTITION BY seller) AS running_total FROM sale ORDER BY seller, sold_on', 'SELECT seller, sold_on, amount, sum(amount) OVER (ORDER BY sold_on) AS running_total FROM sale ORDER BY seller, sold_on'],
    gy: [['Without ORDER BY the window is the whole partition (a total, not a running total).', 'Không có ORDER BY thì cửa sổ là cả phần (một tổng, không phải tổng dồn).'], ['With ORDER BY the default frame is "from the start up to the current row".', 'Có ORDER BY thì khung mặc định là "từ đầu tới dòng hiện tại".']],
    lhg: [['No ORDER BY in OVER: every row shows the seller\'s grand total.', 'Không có ORDER BY trong OVER: mọi dòng hiện tổng của người bán.'], ['No PARTITION BY: one running total across all sellers.', 'Không có PARTITION BY: một tổng dồn chung cho mọi người bán.']],
    gt: ['<p>ORDER BY inside a window changes the frame from "all rows of the partition" to "rows up to the current one" — that is a running total.</p>', '<p>ORDER BY bên trong cửa sổ đổi khung từ "mọi dòng của phần" thành "các dòng tới dòng hiện tại" — đó là tổng dồn.</p>'],
    tn: [tn('running total', 'tổng luỹ tiến')],
  }),

  pg({
    ...O_SALE, t: 'Change since the previous sale: LAG', k: 'MEDIUM', p: 6, kn: ['lag()', 'NULL on the first row'], tag: ['window', 'lag'],
    en: '<p>For every sale return <code>seller, sold_on, amount, prev_amount, change</code> — the seller\'s previous sale amount and the difference (NULL for the first sale of each seller). Order by seller, sold_on.</p>',
    vi: '<p>Với mọi giao dịch trả về <code>seller, sold_on, amount, prev_amount, change</code> — số tiền giao dịch trước đó của người bán và chênh lệch (NULL ở giao dịch đầu của mỗi người). Sắp theo seller, sold_on.</p>',
    yc: [['<code>lag(amount) OVER (PARTITION BY seller ORDER BY sold_on)</code>.', '<code>lag(amount) OVER (PARTITION BY seller ORDER BY sold_on)</code>.'], ['change = amount − prev_amount.', 'change = amount − prev_amount.']],
    giai: `SELECT seller, sold_on, amount,
       lag(amount) OVER w          AS prev_amount,
       amount - lag(amount) OVER w AS change
FROM sale
WINDOW w AS (PARTITION BY seller ORDER BY sold_on)
ORDER BY seller, sold_on;`,
    kiem: [
      kq(['Alice +50, Bob −50, Carol −50, Dave +40', 'Alice +50, Bob −50, Carol −50, Dave +40'], T),
      kqAn(['More sales', 'Thêm giao dịch'], "INSERT INTO sale VALUES (9, 'North', 'Alice', 60, '2026-03-30'), (10, 'South', 'Dave', 220, '2026-03-31')", T),
      ma(['Uses lag()', 'Dùng lag()'], '\\blag\\s*\\('),
    ],
    sai: ['SELECT seller, sold_on, amount, lag(amount) OVER (ORDER BY sold_on) AS prev_amount, amount - lag(amount) OVER (ORDER BY sold_on) AS change FROM sale ORDER BY seller, sold_on', 'SELECT seller, sold_on, amount, lead(amount) OVER (PARTITION BY seller ORDER BY sold_on) AS prev_amount, amount - lead(amount) OVER (PARTITION BY seller ORDER BY sold_on) AS change FROM sale ORDER BY seller, sold_on'],
    gy: [['lag(x) = x of the previous row in the window order; lead(x) = the next row.', 'lag(x) = x của dòng trước theo thứ tự cửa sổ; lead(x) = dòng sau.'], ['The first row has no previous one ⇒ NULL.', 'Dòng đầu không có dòng trước ⇒ NULL.']],
    lhg: [['No PARTITION BY: Alice\'s first sale is compared with somebody else\'s sale.', 'Không PARTITION BY: giao dịch đầu của Alice bị so với giao dịch của người khác.'], ['lead instead of lag — compares with the NEXT sale.', 'lead thay vì lag — so với giao dịch SAU.']],
    gt: ['<p>lag/lead look sideways at neighbouring rows of the same window — no self-join needed. The partition keeps each seller\'s timeline separate.</p>', '<p>lag/lead nhìn ngang sang dòng kề trong cùng cửa sổ — không cần tự nối. Việc chia phần giữ dòng thời gian của từng người bán tách riêng.</p>'],
    tn: [tn('lag / lead', 'dòng trước / dòng sau')],
  }),

  pg({
    ...O_SALE, t: 'Days until the next sale: LEAD', k: 'MEDIUM', p: 6, kn: ['lead()', 'date − date'], tag: ['window', 'lead'],
    en: '<p>For every sale return <code>seller, sold_on, next_sold_on, gap_days</code>: the date of the seller\'s next sale and the number of days between (NULL for the last one). Order by seller, sold_on.</p>',
    vi: '<p>Với mọi giao dịch trả về <code>seller, sold_on, next_sold_on, gap_days</code>: ngày của giao dịch kế tiếp của người bán và số ngày giữa hai lần (NULL ở lần cuối). Sắp theo seller, sold_on.</p>',
    yc: [['<code>lead(sold_on) OVER (PARTITION BY seller ORDER BY sold_on)</code>.', '<code>lead(sold_on) OVER (PARTITION BY seller ORDER BY sold_on)</code>.'], ['date − date gives an integer number of days.', 'date − date cho số nguyên ngày.']],
    giai: `SELECT seller, sold_on,
       lead(sold_on) OVER w           AS next_sold_on,
       lead(sold_on) OVER w - sold_on AS gap_days
FROM sale
WINDOW w AS (PARTITION BY seller ORDER BY sold_on)
ORDER BY seller, sold_on;`,
    kiem: [
      kq(['Alice 36 days, Bob 40, Carol 36, Dave 33', 'Alice 36 ngày, Bob 40, Carol 36, Dave 33'], T),
      kqAn(['A new sale between two others', 'Giao dịch mới chen giữa hai lần khác'], "INSERT INTO sale VALUES (9, 'North', 'Bob', 90, '2026-02-01')", T),
      ma(['Uses lead()', 'Dùng lead()'], '\\blead\\s*\\('),
    ],
    sai: ['SELECT seller, sold_on, lead(sold_on) OVER (ORDER BY sold_on) AS next_sold_on, lead(sold_on) OVER (ORDER BY sold_on) - sold_on AS gap_days FROM sale ORDER BY seller, sold_on'],
    gy: [['lead is the mirror of lag.', 'lead là ảnh gương của lag.'], ['Subtract two dates directly.', 'Trừ thẳng hai ngày.']],
    lhg: [['Forgetting the partition: the "next sale" belongs to another seller.', 'Quên chia phần: "giao dịch kế tiếp" thuộc người bán khác.'], ['Casting to timestamp and getting an interval like "36 days" instead of 36.', 'Ép sang timestamp rồi nhận khoảng "36 days" thay vì 36.']],
    gt: ['<p>Gaps between events are a classic lead/lag use: churn detection, delivery delays, sessionization. The last event of each partition has no next one, so the gap is NULL.</p>', '<p>Khoảng cách giữa các sự kiện là ứng dụng kinh điển của lead/lag: phát hiện khách rời bỏ, trễ giao hàng, chia phiên. Sự kiện cuối của mỗi phần không có sự kiện kế tiếp nên khoảng cách là NULL.</p>'],
    tn: [tn('lead', 'dòng sau')],
  }),

  pg({
    t: 'September, day by day: revenue, month-to-date and change', k: 'HARD', p: 14, kn: ['aggregate per day, then window', 'running total', 'lag on aggregated rows'], tag: ['window', 'running-total', 'ctshop'],
    en: '<p>For every day of September 2026 that had at least one payment return <code>day, payments, revenue, month_to_date, change</code>: number of payments, revenue of the day, cumulative revenue since 1 September, and the difference with the previous paying day (NULL on the first). Order by day.</p>',
    vi: '<p>Với mỗi ngày của tháng 9/2026 có ít nhất một thanh toán trả về <code>day, payments, revenue, month_to_date, change</code>: số thanh toán, doanh thu trong ngày, doanh thu cộng dồn từ 1/9, và chênh lệch với ngày có thanh toán trước đó (NULL ở ngày đầu). Sắp theo ngày.</p>',
    yc: [['Aggregate payments to one row per day (CTE), then apply the windows.', 'Tổng hợp thanh toán về một dòng mỗi ngày (CTE), rồi mới áp cửa sổ.'], ['Day = <code>paid_at::date</code> (Vietnam time); half-open September.', 'Ngày = <code>paid_at::date</code> (giờ Việt Nam); tháng 9 nửa mở.']],
    giai: `WITH d AS (
  SELECT paid_at::date AS day, count(*) AS payments, sum(amount) AS revenue
  FROM payment
  WHERE paid_at >= '2026-09-01' AND paid_at < '2026-10-01'
  GROUP BY 1
)
SELECT day, payments, revenue,
       sum(revenue) OVER (ORDER BY day)            AS month_to_date,
       revenue - lag(revenue) OVER (ORDER BY day)  AS change
FROM d
ORDER BY day;`,
    kiem: [
      kq(['Five paying days', 'Năm ngày có thanh toán'], T),
      kqAn(['Two payments on the same day are one row', 'Hai thanh toán cùng ngày là một dòng'], "INSERT INTO payment (order_id, amount, method, paid_at) VALUES (7, 95000, 'cod', '2026-09-12 08:00+07'), (11, 78000, 'card', '2026-09-03 10:00+07')", T),
      ma(['A window over the daily rows', 'Cửa sổ trên các dòng theo ngày'], 'OVER\\s*\\(\\s*ORDER\\s+BY\\s+day'),
    ],
    sai: ["SELECT p.paid_at::date AS day, 1 AS payments, p.amount AS revenue, sum(p.amount) OVER (ORDER BY p.paid_at::date) AS month_to_date, p.amount - lag(p.amount) OVER (ORDER BY p.paid_at::date) AS change FROM payment p WHERE p.paid_at >= '2026-09-01' AND p.paid_at < '2026-10-01' ORDER BY day", "WITH d AS (SELECT paid_at::date AS day, count(*) AS payments, sum(amount) AS revenue FROM payment WHERE paid_at >= '2026-09-01' AND paid_at <= '2026-09-30' GROUP BY 1) SELECT day, payments, revenue, sum(revenue) OVER (ORDER BY day) AS month_to_date, revenue - lag(revenue) OVER (ORDER BY day) AS change FROM d ORDER BY day"],
    gy: [['Windows run after GROUP BY: aggregate per day first, then the running total over those rows.', 'Cửa sổ chạy sau GROUP BY: tổng hợp theo ngày trước, rồi tổng dồn trên các dòng đó.'], ['A September payment at 21:20 on the 30th must be included.', 'Thanh toán 21:20 ngày 30/9 phải được tính.']],
    lhg: [['Windowing raw payments: two payments on one day become two rows, and with ORDER BY a repeated date the default RANGE frame gives both the same running total.', 'Áp cửa sổ trên thanh toán thô: hai thanh toán một ngày thành hai dòng, và ORDER BY một ngày lặp lại thì khung RANGE mặc định cho cả hai cùng một tổng dồn.'], ['<code>paid_at &lt;= \'2026-09-30\'</code> stops at midnight — the evening of the 30th is lost.', '<code>paid_at &lt;= \'2026-09-30\'</code> dừng ở nửa đêm — mất buổi tối ngày 30.']],
    gt: ['<p>A chart needs one point per day, so the grain must be the day before the window runs. With one row per day, ROWS and RANGE frames agree and the running total is unambiguous (Lab 4 W3).</p>', '<p>Biểu đồ cần một điểm mỗi ngày, nên hạt phải là ngày trước khi cửa sổ chạy. Mỗi ngày một dòng thì khung ROWS và RANGE trùng nhau và tổng dồn không mơ hồ (Lab 4 W3).</p>'],
    tn: [tn('month-to-date', 'luỹ kế từ đầu tháng')],
  }),
]);
