/**
 * PostgreSQL · LAB 4 (sau Ch8) — CT Shop: bảng tăng trưởng (CTE + hàm cửa sổ). 5 câu × 2 điểm theo W1/W1-bẫy/W3/W4/W5 của
 * lab4-solution.sql trên CT Shop mini (dữ liệu tháng 8–10/2026; tiền tính theo payment.paid_at).
 */
import { doiDau, KHOA, deLonPg, CT_SHOP, kq, kqAn, ma, TN, tn } from './_chung.mjs';

const T = { thuTu: true };

export default doiDau({
  slug: 'postgresql-lab-4-cte-ham-cua-so-ct-shop',
  ten: '8.5 Lab 4 — CT Shop: the growth dashboard (CTE + window functions)',
  khoa: KHOA,
  baiHoc: 'postgresql-lab-4-cte-ham-cua-so-ct-shop',
  de: [
    deLonPg({
      dangBai: 'lab',
      tieuDe: { en: 'Lab 4 — CT Shop: the growth dashboard', vi: 'Lab 4 — CT Shop: bảng tăng trưởng' },
      doKho: 'HARD', phut: 80, diem: 100,
      khaiNiem: ['CTE steps', 'LAG for growth', 'window first, filter after', 'running total with a unique order', 'top-N per group with tie-breakers', 'share of total with sum(sum()) OVER'],
      tienQuyet: ['7.3, 8.1–8.4 of this track'],
      the: ['postgresql', 'lab', 'window', 'cte', 'ctshop'],
      csdl: CT_SHOP, tenCsdl: 'ctshop',
      thuMuc: 'RollNo_Name_PG_Lab4',
      phu: { en: 'PostgreSQL course · after Chapter 8 · Suggested time: 80 minutes · 10 marks (5 × 2)', vi: 'Khoá PostgreSQL · sau Chương 8 · Thời gian gợi ý: 80 phút · 10 điểm (5 × 2)' },
      moTa: {
        en: '<p>The dashboard of CT Shop has five tiles. Each is one query built from CTE steps and window functions — the W1, W3, W4 and W5 queries of the course lab, on the mini data (payments from August to October 2026, Vietnam time). The hidden checks add payments and lines, so every number must be computed.</p>',
        vi: '<p>Bảng điều khiển của CT Shop có năm ô. Mỗi ô là một truy vấn dựng từ các bước CTE và hàm cửa sổ — các truy vấn W1, W3, W4, W5 của lab trong khoá, trên dữ liệu mini (thanh toán tháng 8 tới tháng 10/2026, giờ Việt Nam). Kiểm ẩn thêm thanh toán và dòng đơn, nên mọi con số phải được tính.</p>',
      },
      yeuCauChung: [
        { en: 'Months as text <code>YYYY-MM</code>; percentages rounded to 1 decimal with <code>100.0 *</code> or numeric operands.', vi: 'Tháng dạng chữ <code>YYYY-MM</code>; phần trăm làm tròn 1 chữ số với <code>100.0 *</code> hoặc toán hạng numeric.' },
        { en: 'Every ORDER BY inside a window must be total when the brief asks for one value per row.', vi: 'Mọi ORDER BY trong cửa sổ phải xác định hoàn toàn khi đề cần một giá trị riêng cho mỗi dòng.' },
      ],
      moHinh: [
        { ten: 'payment', truong: [['order_id', 'bigint', '→ orders'], ['amount', 'numeric(12,2)', ''], ['paid_at', 'timestamptz', 'decides day / month']] },
        { ten: 'order_item ⋈ product ⋈ category', truong: [['qty, unit_price', '', 'units and revenue of a line'], ['product.category_id', 'int', 'leaf category'], ['category.parent_id', 'int', 'its root']] },
      ],
      cau: [
        {
          ten: { en: 'W1 · revenue and month-over-month growth', vi: 'W1 · doanh thu và tăng trưởng so với tháng trước' }, diem: 2,
          moTa: { en: 'Per month of paid_at: <code>month, revenue, prev_revenue, mom_pct</code> where mom_pct = 100 × (revenue − prev) / prev (NULL for the first month). Order by month.', vi: 'Theo tháng của paid_at: <code>month, revenue, prev_revenue, mom_pct</code> với mom_pct = 100 × (revenue − prev) / prev (NULL ở tháng đầu). Sắp theo tháng.' },
          yeuCau: [{ en: 'CTE of monthly revenue, then <code>lag(revenue) OVER (ORDER BY month)</code>.', vi: 'CTE doanh thu theo tháng, rồi <code>lag(revenue) OVER (ORDER BY month)</code>.' }],
          giai: `WITH m AS (
  SELECT date_trunc('month', paid_at) AS month, sum(amount) AS revenue
  FROM payment
  GROUP BY 1
)
SELECT to_char(month, 'YYYY-MM') AS month, revenue,
       lag(revenue) OVER w AS prev_revenue,
       round(100 * (revenue - lag(revenue) OVER w) / lag(revenue) OVER w, 1) AS mom_pct
FROM m
WINDOW w AS (ORDER BY month)
ORDER BY month;`,
          kiem: [
            kq(['W1 · August, September, October', 'W1 · tháng 8, 9, 10'], T),
            kqAn(['W1 · a November payment', 'W1 · một thanh toán tháng 11'], "INSERT INTO payment (order_id, amount, method, paid_at) VALUES (7, 95000, 'cod', '2026-11-02 09:00+07')", T),
            ma(['W1 · lag()', 'W1 · lag()'], '\\blag\\s*\\('),
          ],
          saiMau: ["WITH m AS (SELECT date_trunc('month', paid_at) AS month, sum(amount) AS revenue FROM payment GROUP BY 1) SELECT to_char(month, 'YYYY-MM') AS month, revenue, lead(revenue) OVER (ORDER BY month) AS prev_revenue, round(100 * (revenue - lead(revenue) OVER (ORDER BY month)) / lead(revenue) OVER (ORDER BY month), 1) AS mom_pct FROM m ORDER BY month"],
        },
        {
          ten: { en: 'W1b · October only, but still compared with September', vi: 'W1b · chỉ tháng 10, nhưng vẫn so với tháng 9' }, diem: 2,
          moTa: { en: 'The tile shows only <b>October 2026</b>: <code>month, revenue, prev_revenue</code>. Filtering October in the same query as the window loses September (WHERE runs first) — compute the window first, filter after.', vi: 'Ô này chỉ hiện <b>tháng 10/2026</b>: <code>month, revenue, prev_revenue</code>. Lọc tháng 10 trong cùng truy vấn với cửa sổ sẽ mất tháng 9 (WHERE chạy trước) — tính cửa sổ trước, lọc sau.' },
          yeuCau: [{ en: 'Two CTE levels: monthly revenue → lag → then <code>WHERE month = …</code> in the outer query.', vi: 'Hai tầng CTE: doanh thu theo tháng → lag → rồi <code>WHERE month = …</code> ở truy vấn ngoài.' }],
          giai: `WITH m AS (
  SELECT date_trunc('month', paid_at) AS month, sum(amount) AS revenue
  FROM payment
  GROUP BY 1
), g AS (
  SELECT month, revenue, lag(revenue) OVER (ORDER BY month) AS prev_revenue   -- window over ALL months
  FROM m
)
SELECT to_char(month, 'YYYY-MM') AS month, revenue, prev_revenue
FROM g
WHERE month = '2026-10-01'                                                    -- filter afterwards
ORDER BY month;`,
          kiem: [
            kq(['W1b · October with September as previous', 'W1b · tháng 10 với tháng trước là tháng 9'], T),
            kqAn(['W1b · more September money', 'W1b · thêm tiền tháng 9'], "INSERT INTO payment (order_id, amount, method, paid_at) VALUES (7, 95000, 'cod', '2026-09-25 09:00+07')", T),
          ],
          saiMau: ["WITH m AS (SELECT date_trunc('month', paid_at) AS month, sum(amount) AS revenue FROM payment GROUP BY 1) SELECT to_char(month, 'YYYY-MM') AS month, revenue, lag(revenue) OVER (ORDER BY month) AS prev_revenue FROM m WHERE month = '2026-10-01' ORDER BY month"],
        },
        {
          ten: { en: 'W3 · September running total, payment by payment', vi: 'W3 · tổng dồn tháng 9, từng thanh toán' }, diem: 2,
          moTa: { en: 'Every payment of September: <code>day, order_id, amount, running</code> where running is the cumulative revenue in the order <code>paid_at, id</code>. Order the same way.', vi: 'Mọi thanh toán tháng 9: <code>day, order_id, amount, running</code> với running là doanh thu cộng dồn theo thứ tự <code>paid_at, id</code>. Sắp cùng thứ tự đó.' },
          yeuCau: [{ en: 'A unique window order (paid_at, id) so two payments at the same instant never share a running total.', vi: 'Thứ tự cửa sổ duy nhất (paid_at, id) để hai thanh toán cùng thời điểm không bao giờ chung một tổng dồn.' }],
          giai: `SELECT p.paid_at::date AS day, p.order_id, p.amount,
       sum(p.amount) OVER (ORDER BY p.paid_at, p.id) AS running     -- unique order ⇒ one value per payment
FROM payment p
WHERE p.paid_at >= '2026-09-01' AND p.paid_at < '2026-10-01'
ORDER BY p.paid_at, p.id;`,
          kiem: [
            kq(['W3 · five September payments', 'W3 · năm thanh toán tháng 9'], T),
            kqAn(['W3 · two payments at exactly the same instant', 'W3 · hai thanh toán đúng cùng thời điểm'], "INSERT INTO payment (order_id, amount, method, paid_at) VALUES (7, 95000, 'cod', '2026-09-08 09:55+07'), (11, 78000, 'card', '2026-09-08 09:55+07')", T),
          ],
          saiMau: ["SELECT p.paid_at::date AS day, p.order_id, p.amount, sum(p.amount) OVER (ORDER BY p.paid_at::date) AS running FROM payment p WHERE p.paid_at >= '2026-09-01' AND p.paid_at < '2026-10-01' ORDER BY p.paid_at, p.id"],
        },
        {
          ten: { en: 'W4 · top 2 products of every root (units sold)', vi: 'W4 · 2 sản phẩm đứng đầu mỗi gốc (số món bán)' }, diem: 2,
          moTa: { en: 'Using lines of orders paid in August–October: <code>root, pos, sku, units</code> for the 2 best products of each root category by units; ties broken by revenue (desc), then sku. Order by root, pos.', vi: 'Dùng dòng của các đơn được trả trong tháng 8–10: <code>root, pos, sku, units</code> cho 2 sản phẩm tốt nhất của mỗi danh mục gốc theo số món; hoà thì theo doanh thu (giảm dần), rồi sku. Sắp theo root, pos.' },
          yeuCau: [{ en: 'Aggregate per (root, sku) in a CTE, then <code>row_number() OVER (PARTITION BY root ORDER BY units DESC, revenue DESC, sku)</code>, keep pos ≤ 2.', vi: 'Tổng hợp theo (root, sku) trong CTE, rồi <code>row_number() OVER (PARTITION BY root ORDER BY units DESC, revenue DESC, sku)</code>, giữ pos ≤ 2.' }],
          giai: `WITH sold AS (
  SELECT r.name AS root, pr.sku, sum(oi.qty) AS units, sum(oi.qty * oi.unit_price) AS revenue
  FROM payment p
  JOIN order_item oi ON oi.order_id = p.order_id
  JOIN product pr    ON pr.id = oi.product_id
  JOIN category c    ON c.id = pr.category_id
  JOIN category r    ON r.id = c.parent_id
  GROUP BY r.name, pr.sku
), ranked AS (
  SELECT root, sku, units,
         row_number() OVER (PARTITION BY root ORDER BY units DESC, revenue DESC, sku) AS pos
  FROM sold
)
SELECT root, pos, sku, units
FROM ranked
WHERE pos <= 2
ORDER BY root, pos;`,
          kiem: [
            kq(['W4 · two per root (one where only one product sold)', 'W4 · hai mỗi gốc (một gốc chỉ có một sản phẩm bán được)'], T),
            kqAn(['W4 · a tie on units broken by revenue', 'W4 · hoà số món, phá hoà bằng doanh thu'], "INSERT INTO order_item VALUES (12, 25, 12, 32000)", T),
          ],
          saiMau: ["WITH sold AS (SELECT r.name AS root, pr.sku, sum(oi.qty) AS units, sum(oi.qty * oi.unit_price) AS revenue FROM payment p JOIN order_item oi ON oi.order_id = p.order_id JOIN product pr ON pr.id = oi.product_id JOIN category c ON c.id = pr.category_id JOIN category r ON r.id = c.parent_id GROUP BY r.name, pr.sku), ranked AS (SELECT root, sku, units, rank() OVER (PARTITION BY root ORDER BY units DESC) AS pos FROM sold) SELECT root, pos, sku, units FROM ranked WHERE pos <= 2 ORDER BY root, pos"],
        },
        {
          ten: { en: 'W5 · share of the shop and of the root', vi: 'W5 · tỷ trọng trong cửa hàng và trong gốc' }, diem: 2,
          moTa: { en: 'Per leaf category (revenue of lines of paid orders): <code>root, category, revenue, pct_shop, pct_in_root</code>. Order by root, revenue descending.', vi: 'Theo danh mục lá (doanh thu dòng của các đơn đã trả): <code>root, category, revenue, pct_shop, pct_in_root</code>. Sắp theo root, doanh thu giảm dần.' },
          yeuCau: [{ en: 'One GROUP BY + windows over the aggregated rows: <code>sum(sum(…)) OVER ()</code> and <code>OVER (PARTITION BY root)</code>.', vi: 'Một GROUP BY + cửa sổ trên các dòng đã tổng hợp: <code>sum(sum(…)) OVER ()</code> và <code>OVER (PARTITION BY root)</code>.' }],
          giai: `SELECT r.name AS root, c.name AS category,
       sum(oi.qty * oi.unit_price) AS revenue,
       round(100 * sum(oi.qty * oi.unit_price) / sum(sum(oi.qty * oi.unit_price)) OVER (), 1)                    AS pct_shop,
       round(100 * sum(oi.qty * oi.unit_price) / sum(sum(oi.qty * oi.unit_price)) OVER (PARTITION BY r.name), 1) AS pct_in_root
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
JOIN product pr    ON pr.id = oi.product_id
JOIN category c    ON c.id = pr.category_id
JOIN category r    ON r.id = c.parent_id
GROUP BY r.name, c.name
ORDER BY r.name, revenue DESC;`,
          kiem: [
            kq(['W5 · seven leaf categories', 'W5 · bảy danh mục lá'], T),
            kqAn(['W5 · a big calculator order is paid', 'W5 · một đơn máy tính lớn được trả'], "INSERT INTO payment (order_id, amount, method, paid_at) VALUES (14, 705000, 'card', '2026-10-06 19:00+07')", T),
            ma(['W5 · window over an aggregate', 'W5 · cửa sổ trên hàm tổng hợp'], 'sum\\s*\\(\\s*sum\\s*\\('),
          ],
          saiMau: ["SELECT r.name AS root, c.name AS category, sum(oi.qty * oi.unit_price) AS revenue, round(100 * sum(oi.qty * oi.unit_price) / sum(sum(oi.qty * oi.unit_price)) OVER (), 1) AS pct_shop, round(100 * sum(oi.qty * oi.unit_price) / sum(sum(oi.qty * oi.unit_price)) OVER (), 1) AS pct_in_root FROM payment p JOIN order_item oi ON oi.order_id = p.order_id JOIN product pr ON pr.id = oi.product_id JOIN category c ON c.id = pr.category_id JOIN category r ON r.id = c.parent_id GROUP BY r.name, c.name ORDER BY r.name, revenue DESC"],
        },
      ],
      truDiem: [
        { en: 'Filtering in the same query level as the window that needs the filtered-out rows.', vi: 'Lọc ở cùng tầng truy vấn với cửa sổ đang cần các dòng bị lọc đi.' },
        { en: 'Integer division in percentages.', vi: 'Chia nguyên trong phần trăm.' },
      ],
      nopBai: {
        en: 'Tabs Q1.sql … Q5.sql (W1, W1b, W3, W4, W5). <b>Run</b> = sample checks; <b>Submit</b> = every check and the 10-mark table.',
        vi: 'Các tab Q1.sql … Q5.sql (W1, W1b, W3, W4, W5). <b>Chạy thử</b> = kiểm mẫu; <b>Nộp</b> = mọi kiểm và bảng điểm thang 10.',
      },
      thuatNgu: [TN.cte, TN.window, tn('month-over-month', 'so với tháng trước'), tn('sum(sum()) OVER', 'cửa sổ trên giá trị đã tổng hợp')],
      goiY: [
        { en: 'Logical order: FROM → WHERE → GROUP BY → HAVING → window → SELECT → ORDER BY.', vi: 'Thứ tự logic: FROM → WHERE → GROUP BY → HAVING → cửa sổ → SELECT → ORDER BY.' },
        { en: 'W5: the inner sum() is the GROUP BY aggregate, the outer sum() OVER adds those group results.', vi: 'W5: sum() bên trong là hàm tổng hợp của GROUP BY, sum() OVER bên ngoài cộng các kết quả nhóm đó.' },
      ],
      loiHayGap: [
        { en: 'W1 using lead instead of lag — growth computed against the NEXT month.', vi: 'W1 dùng lead thay lag — tăng trưởng tính so với tháng SAU.' },
        { en: 'W1b filtering October before the window — prev_revenue becomes NULL.', vi: 'W1b lọc tháng 10 trước khi có cửa sổ — prev_revenue thành NULL.' },
        { en: 'W3 ordering the window by the date only — same-day payments share one running value.', vi: 'W3 sắp cửa sổ chỉ theo ngày — các thanh toán cùng ngày chung một giá trị dồn.' },
      ],
      giaiThich: { en: '<p>Same patterns as <code>lab4-solution.sql</code> (W1, W1 trap, W3, W4, W5) on the mini data.</p>', vi: '<p>Cùng các mẫu của <code>lab4-solution.sql</code> (W1, bẫy W1, W3, W4, W5) trên dữ liệu mini.</p>' },
    }),
  ],
});
