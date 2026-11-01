/**
 * PostgreSQL · LAB 3 (sau Ch6) — CT Shop: báo cáo doanh thu (JOIN + GROUP BY). Đề lớn 5 câu × 2 điểm theo R1/R2/R3b/R4/R6 của
 * lab3-solution.sql, trên CT Shop mini; kỳ báo cáo = tiền tính theo ngày TRẢ (payment.paid_at), 1/8 → hết 30/9/2026.
 */
import { doiDau, KHOA, deLonPg, CT_SHOP, kq, kqAn, ma, TN, tn } from './_chung.mjs';

const T = { thuTu: true };
const KY = "p.paid_at >= '2026-08-01' AND p.paid_at < '2026-10-01'";

export default doiDau({
  slug: 'postgresql-lab-3-bao-cao-doanh-thu-ct-shop',
  ten: '6.5 Lab 3 — CT Shop: the revenue report (JOIN + GROUP BY)',
  khoa: KHOA,
  baiHoc: 'postgresql-lab-3-bao-cao-doanh-thu-ct-shop',
  de: [
    deLonPg({
      dangBai: 'lab',
      tieuDe: { en: 'Lab 3 — CT Shop: the two-month revenue report', vi: 'Lab 3 — CT Shop: báo cáo doanh thu hai tháng' },
      doKho: 'HARD', phut: 75, diem: 100,
      khaiNiem: ['JOIN chains', 'self-join to the root category', 'anti-join with the condition in ON', 'fan-out and pre-aggregation', 'FILTER', 'half-open periods'],
      tienQuyet: ['5.1–6.4 of this track'],
      the: ['postgresql', 'lab', 'join', 'aggregate', 'ctshop'],
      csdl: CT_SHOP, tenCsdl: 'ctshop',
      thuMuc: 'RollNo_Name_PG_Lab3',
      phu: { en: 'PostgreSQL course · after Chapter 6 · Suggested time: 75 minutes · 10 marks (5 × 2)', vi: 'Khoá PostgreSQL · sau Chương 6 · Thời gian gợi ý: 75 phút · 10 điểm (5 × 2)' },
      moTa: {
        en: '<p>The owner of CT Shop wants the report for <b>August and September 2026</b>. Money counts on the day it is <b>paid</b> (<code>payment.paid_at</code>), and the period is half-open: <code>[2026-08-01, 2026-10-01)</code> in Vietnam time. Five questions, the same as R1, R2, R3b, R4 and R6 of the course lab, on the mini data. Hidden checks add payments, orders and lines, so every number must be computed.</p>',
        vi: '<p>Chủ CT Shop cần báo cáo <b>tháng 8 và tháng 9/2026</b>. Tiền được tính vào ngày <b>trả</b> (<code>payment.paid_at</code>), và kỳ là khoảng nửa mở <code>[2026-08-01, 2026-10-01)</code> theo giờ Việt Nam. Năm câu, đúng như R1, R2, R3b, R4, R6 của lab trong khoá, trên dữ liệu mini. Kiểm ẩn thêm thanh toán, đơn và dòng đơn, nên mọi con số phải được tính.</p>',
      },
      yeuCauChung: [
        { en: 'Months as text <code>YYYY-MM</code> (<code>to_char(date_trunc(\'month\', …), \'YYYY-MM\')</code>).', vi: 'Tháng dạng chữ <code>YYYY-MM</code> (<code>to_char(date_trunc(\'month\', …), \'YYYY-MM\')</code>).' },
        { en: 'Exact column names and order; ORDER BY as asked.', vi: 'Đúng tên và thứ tự cột; ORDER BY như đề.' },
      ],
      moHinh: [
        { ten: 'payment', truong: [['order_id', 'bigint', '→ orders, UNIQUE'], ['amount', 'numeric(12,2)', 'the money'], ['paid_at', 'timestamptz', 'decides the month']] },
        { ten: 'orders', truong: [['id', 'bigint', 'PK'], ['customer_id', 'bigint', '→ customer'], ['status', 'text', 'pending|paid|shipped|cancelled'], ['created_at', 'timestamptz', '']] },
        { ten: 'order_item', truong: [['order_id', 'bigint', '→ orders'], ['product_id', 'bigint', '→ product'], ['qty', 'int', ''], ['unit_price', 'numeric(12,2)', '']] },
        { ten: 'product / category', truong: [['product.category_id', 'int', '→ category (a leaf)'], ['category.parent_id', 'int', '→ the root (NULL for roots)']] },
      ],
      cau: [
        {
          ten: { en: 'R1 · revenue by month', vi: 'R1 · doanh thu theo tháng' }, diem: 2,
          moTa: { en: 'Per month of <code>paid_at</code>: <code>month, orders, buyers, revenue, avg_order</code> — buyers = distinct customers, avg_order rounded to whole đồng. Order by month.', vi: 'Theo tháng của <code>paid_at</code>: <code>month, orders, buyers, revenue, avg_order</code> — buyers = số khách khác nhau, avg_order làm tròn tới đồng. Sắp theo tháng.' },
          yeuCau: [{ en: 'payment ⋈ orders, filtered on the period.', vi: 'payment ⋈ orders, lọc theo kỳ.' }],
          giai: `SELECT to_char(date_trunc('month', p.paid_at), 'YYYY-MM') AS month,
       count(*)                      AS orders,
       count(DISTINCT o.customer_id) AS buyers,
       sum(p.amount)                 AS revenue,
       round(avg(p.amount))          AS avg_order
FROM payment p
JOIN orders o ON o.id = p.order_id
WHERE ${KY}
GROUP BY 1
ORDER BY 1;`,
          kiem: [
            kq(['R1 · August and September', 'R1 · tháng 8 và tháng 9'], T),
            kqAn(['R1 · a payment at 23:30 on 30 Sep (Vietnam) is September', 'R1 · thanh toán 23:30 ngày 30/9 (giờ VN) thuộc tháng 9'], "INSERT INTO payment (order_id, amount, method, paid_at) VALUES (7, 95000, 'cod', '2026-09-30 23:30+07'), (11, 78000, 'card', '2026-10-01 00:10+07')", T),
          ],
          saiMau: ["SELECT to_char(date_trunc('month', p.paid_at), 'YYYY-MM') AS month, count(*) AS orders, count(o.customer_id) AS buyers, sum(p.amount) AS revenue, round(avg(p.amount)) AS avg_order FROM payment p JOIN orders o ON o.id = p.order_id WHERE p.paid_at >= '2026-08-01' AND p.paid_at < '2026-10-01' GROUP BY 1 ORDER BY 1"],
        },
        {
          ten: { en: 'R2 · revenue by category, with its root', vi: 'R2 · doanh thu theo danh mục, kèm gốc' }, diem: 2,
          moTa: { en: '<code>root, category, units, revenue</code> (Σ qty, Σ qty × unit_price) of the lines of orders paid in the period. Order by revenue descending, then category.', vi: '<code>root, category, units, revenue</code> (Σ qty, Σ qty × unit_price) của các dòng thuộc đơn được trả trong kỳ. Sắp doanh thu giảm dần, rồi theo category.' },
          yeuCau: [{ en: 'Five tables: payment → order_item → product → category c → category r (r.id = c.parent_id).', vi: 'Năm bảng: payment → order_item → product → category c → category r (r.id = c.parent_id).' }],
          giai: `SELECT r.name AS root, c.name AS category,
       sum(oi.qty)                 AS units,
       sum(oi.qty * oi.unit_price) AS revenue
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
JOIN product pr    ON pr.id = oi.product_id
JOIN category c    ON c.id = pr.category_id
JOIN category r    ON r.id = c.parent_id          -- self-join: the parent row
WHERE ${KY}
GROUP BY r.name, c.name
ORDER BY revenue DESC, category;`,
          kiem: [
            kq(['R2 · eight leaf categories with their roots', 'R2 · các danh mục lá kèm gốc'], T),
            kqAn(['R2 · order 7 is paid in September', 'R2 · đơn 7 được trả trong tháng 9'], "INSERT INTO payment (order_id, amount, method, paid_at) VALUES (7, 95000, 'cod', '2026-09-15 10:00+07')", T),
            ma(['R2 · category joined to itself', 'R2 · category nối với chính nó'], 'JOIN\\s+category\\s+\\w+[\\s\\S]*JOIN\\s+category\\s+\\w+'),
          ],
          saiMau: [`SELECT c.name AS root, c.name AS category, sum(oi.qty) AS units, sum(oi.qty * oi.unit_price) AS revenue FROM payment p JOIN order_item oi ON oi.order_id = p.order_id JOIN product pr ON pr.id = oi.product_id JOIN category c ON c.id = pr.category_id WHERE ${KY} GROUP BY c.name ORDER BY revenue DESC, category`],
        },
        {
          ten: { en: 'R3b · customers to win back', vi: 'R3b · khách cần kéo lại' }, diem: 2,
          moTa: { en: 'Customers with <b>no paid or shipped order created since 1 September 2026</b> (including customers who never ordered): <code>id, full_name</code>, ordered by id.', vi: 'Khách <b>không có đơn paid hay shipped nào tạo từ 1/9/2026</b> (kể cả khách chưa từng đặt): <code>id, full_name</code>, sắp theo id.' },
          yeuCau: [{ en: 'LEFT JOIN orders with the status and date conditions IN the ON clause, then <code>WHERE o.id IS NULL</code> (or NOT EXISTS).', vi: 'LEFT JOIN orders với điều kiện trạng thái và ngày NẰM TRONG ON, rồi <code>WHERE o.id IS NULL</code> (hoặc NOT EXISTS).' }],
          giai: `SELECT c.id, c.full_name
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
                  AND o.status IN ('paid', 'shipped')
                  AND o.created_at >= '2026-09-01'      -- conditions on the optional side go in ON
WHERE o.id IS NULL
ORDER BY c.id;`,
          kiem: [
            kq(['R3b · customers 2, 6 and 8', 'R3b · khách 2, 6 và 8'], T),
            kqAn(['R3b · customer 2 orders again; a new customer joins', 'R3b · khách 2 đặt lại; một khách mới đăng ký'], "INSERT INTO orders (customer_id, status, created_at) VALUES (2, 'shipped', '2026-10-04 09:00+07'), (6, 'cancelled', '2026-10-07 09:00+07'); INSERT INTO customer (email, full_name) VALUES ('kh009@ctshop.vn', 'Lê Văn Tú')", T),
          ],
          saiMau: ["SELECT c.id, c.full_name FROM customer c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.status IN ('paid', 'shipped') AND o.created_at >= '2026-09-01' AND o.id IS NULL ORDER BY c.id", "SELECT c.id, c.full_name FROM customer c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL ORDER BY c.id"],
        },
        {
          ten: { en: 'R4 · units sold per month, without the fan-out', vi: 'R4 · số món bán theo tháng, không nhân dòng' }, diem: 2,
          moTa: { en: 'Extend R1 with units: <code>month, orders, revenue, units</code>. Revenue must stay equal to R1.', vi: 'Mở rộng R1 thêm số món: <code>month, orders, revenue, units</code>. Doanh thu phải giữ đúng như R1.' },
          yeuCau: [{ en: 'Aggregate order_item to one row per order BEFORE joining it to payment.', vi: 'Tổng hợp order_item về một dòng mỗi đơn TRƯỚC khi nối với payment.' }],
          giai: `SELECT to_char(date_trunc('month', p.paid_at), 'YYYY-MM') AS month,
       count(*)      AS orders,
       sum(p.amount) AS revenue,
       sum(i.units)  AS units
FROM payment p
JOIN (SELECT order_id, sum(qty) AS units
      FROM order_item
      GROUP BY order_id) i ON i.order_id = p.order_id      -- one row per order: no fan-out
WHERE ${KY}
GROUP BY 1
ORDER BY 1;`,
          kiem: [
            kq(['R4 · revenue equals R1', 'R4 · doanh thu bằng R1'], T),
            kqAn(['R4 · a three-line order paid in August', 'R4 · một đơn ba dòng được trả trong tháng 8'], "INSERT INTO orders (customer_id, status, created_at) VALUES (8, 'paid', '2026-08-20 10:00+07'); INSERT INTO order_item VALUES (15, 1, 4, 5000), (15, 19, 2, 6000), (15, 46, 1, 59000); INSERT INTO payment (order_id, amount, method, paid_at) VALUES (15, 91000, 'momo', '2026-08-20 11:00+07')", T),
          ],
          saiMau: [`SELECT to_char(date_trunc('month', p.paid_at), 'YYYY-MM') AS month, count(*) AS orders, sum(p.amount) AS revenue, sum(oi.qty) AS units FROM payment p JOIN order_item oi ON oi.order_id = p.order_id WHERE ${KY} GROUP BY 1 ORDER BY 1`],
        },
        {
          ten: { en: 'R6 · order health by month (FILTER)', vi: 'R6 · sức khoẻ đơn theo tháng (FILTER)' }, diem: 2,
          moTa: { en: 'Orders <b>created</b> from 1 August to 31 October 2026, per month of created_at: <code>month, placed, pending, paid, shipped, cancelled, cancel_pct</code> (100 × cancelled / placed, 1 decimal). Order by month.', vi: 'Đơn <b>tạo</b> từ 1/8 tới hết 31/10/2026, theo tháng của created_at: <code>month, placed, pending, paid, shipped, cancelled, cancel_pct</code> (100 × cancelled / placed, 1 chữ số). Sắp theo tháng.' },
          yeuCau: [{ en: 'One GROUP BY, one count per status with FILTER, and <code>100.0 *</code> for the percentage.', vi: 'Một GROUP BY, mỗi trạng thái một count có FILTER, và <code>100.0 *</code> cho phần trăm.' }],
          giai: `SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS month,
       count(*)                                     AS placed,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'paid')      AS paid,
       count(*) FILTER (WHERE status = 'shipped')   AS shipped,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       round(100.0 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS cancel_pct
FROM orders
WHERE created_at >= '2026-08-01' AND created_at < '2026-11-01'
GROUP BY 1
ORDER BY 1;`,
          kiem: [
            kq(['R6 · August, September, October', 'R6 · tháng 8, 9, 10'], T),
            kqAn(['R6 · two more cancellations in September', 'R6 · thêm hai đơn huỷ trong tháng 9'], "INSERT INTO orders (customer_id, status, created_at) VALUES (8, 'cancelled', '2026-09-02 09:00+07'), (8, 'cancelled', '2026-09-03 09:00+07')", T),
            ma(['R6 · FILTER', 'R6 · FILTER'], '\\bFILTER\\s*\\(\\s*WHERE'),
          ],
          saiMau: ["SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS month, count(*) AS placed, count(*) FILTER (WHERE status = 'pending') AS pending, count(*) FILTER (WHERE status = 'paid') AS paid, count(*) FILTER (WHERE status = 'shipped') AS shipped, count(*) FILTER (WHERE status = 'cancelled') AS cancelled, round(100 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS cancel_pct FROM orders WHERE created_at >= '2026-08-01' AND created_at < '2026-11-01' GROUP BY 1 ORDER BY 1"],
        },
      ],
      truDiem: [
        { en: 'Months computed in UTC (to_char of paid_at AT TIME ZONE \'UTC\') — payments around midnight land in the wrong month.', vi: 'Tính tháng theo UTC (to_char của paid_at AT TIME ZONE \'UTC\') — thanh toán quanh nửa đêm rơi nhầm tháng.' },
        { en: 'BETWEEN on timestamps for the period.', vi: 'BETWEEN trên timestamp cho kỳ báo cáo.' },
      ],
      nopBai: {
        en: 'Tabs Q1.sql … Q5.sql (R1, R2, R3b, R4, R6). <b>Run</b> = sample checks; <b>Submit</b> = every check and the 10-mark table.',
        vi: 'Các tab Q1.sql … Q5.sql (R1, R2, R3b, R4, R6). <b>Chạy thử</b> = kiểm mẫu; <b>Nộp</b> = mọi kiểm và bảng điểm thang 10.',
      },
      thuatNgu: [TN.join, TN.groupBy, TN.having, TN.filter, tn('fan-out', 'nhân dòng'), tn('anti-join', 'phép nối loại trừ')],
      goiY: [
        { en: 'Write the FROM … JOIN part first and look at a few raw rows; only then add GROUP BY.', vi: 'Viết phần FROM … JOIN trước và xem vài dòng thô; rồi mới thêm GROUP BY.' },
        { en: 'R3b: a filter on the LEFT-joined table in WHERE turns the LEFT JOIN into an INNER JOIN.', vi: 'R3b: lọc bảng được LEFT JOIN trong WHERE biến LEFT JOIN thành INNER JOIN.' },
        { en: 'R4: compare count(*) with count(DISTINCT p.id) after your join.', vi: 'R4: so count(*) với count(DISTINCT p.id) sau phép nối.' },
      ],
      loiHayGap: [
        { en: 'R1 counting buyers with count(customer_id) — a customer with two orders counts twice.', vi: 'R1 đếm người mua bằng count(customer_id) — khách có hai đơn bị đếm hai lần.' },
        { en: 'R4 joining payment to order_item directly — revenue multiplied by the number of lines.', vi: 'R4 nối payment thẳng với order_item — doanh thu bị nhân theo số dòng.' },
        { en: 'R6 integer division in cancel_pct.', vi: 'R6 chia nguyên ở cancel_pct.' },
      ],
      giaiThich: { en: '<p>Same queries as <code>lab3-solution.sql</code> (R1, R2, R3b, R4, R6) applied to the mini data and the August–September period.</p>', vi: '<p>Cùng các truy vấn của <code>lab3-solution.sql</code> (R1, R2, R3b, R4, R6) áp lên dữ liệu mini và kỳ tháng 8–9.</p>' },
    }),
  ],
});
