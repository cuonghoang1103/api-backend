/** PostgreSQL · 6.4 — Tổng hợp trên JOIN: thuần hoá fan-out (count DISTINCT, count(col) với LEFT JOIN, tổng hợp trước rồi nối). */
import { mod, pg, cs, q, kq, kqAn, ma, tn } from './_chung.mjs';
import { O_APP } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-6-4-tong-hop-tren-join', '6.4 Aggregating over joins: taming fan-out', [
  pg({
    ...O_APP, t: 'Notes and comments per author, counted right', k: 'MEDIUM', p: 8, kn: ['fan-out', 'count(DISTINCT)', 'LEFT JOIN + count(col)'], tag: ['aggregate', 'join', 'fan-out'],
    en: '<p>For every author who wrote notes, return <code>name, notes, comments</code>: how many notes they wrote and how many comments those notes received in total. Notes without comments still count as notes. Order by name.</p>',
    vi: '<p>Với mọi tác giả đã viết ghi chú, trả về <code>name, notes, comments</code>: họ viết bao nhiêu ghi chú và các ghi chú đó nhận tổng cộng bao nhiêu bình luận. Ghi chú không có bình luận vẫn tính là ghi chú. Sắp theo tên.</p>',
    yc: [['<code>JOIN note</code>, <code>LEFT JOIN comment</code>.', '<code>JOIN note</code>, <code>LEFT JOIN comment</code>.'], ['<code>count(DISTINCT n.id)</code> for notes, <code>count(c.id)</code> for comments.', '<code>count(DISTINCT n.id)</code> cho notes, <code>count(c.id)</code> cho comments.']],
    giai: `SELECT u.name,
       count(DISTINCT n.id) AS notes,       -- the comment join repeats each note once per comment
       count(c.id)          AS comments     -- NULL (no comment) is not counted
FROM app_user u
JOIN note n         ON n.user_id = u.id
LEFT JOIN comment c ON c.note_id = n.id
GROUP BY u.name
ORDER BY u.name;`,
    kiem: [
      kq(['Cuong 3/4, Lan 2/1, Minh 1/1', 'Cuong 3/4, Lan 2/1, Minh 1/1'], T),
      kqAn(['More comments on one note', 'Thêm bình luận trên một ghi chú'], "INSERT INTO comment VALUES (7, 3, 3, 'Thanks'), (8, 3, 4, 'Bookmarked')", T),
      ma(['count(DISTINCT …)', 'count(DISTINCT …)'], 'count\\s*\\(\\s*DISTINCT'),
    ],
    sai: ['SELECT u.name, count(*) AS notes, count(c.id) AS comments FROM app_user u JOIN note n ON n.user_id = u.id LEFT JOIN comment c ON c.note_id = n.id GROUP BY u.name ORDER BY u.name', 'SELECT u.name, count(DISTINCT n.id) AS notes, count(c.id) AS comments FROM app_user u JOIN note n ON n.user_id = u.id JOIN comment c ON c.note_id = n.id GROUP BY u.name ORDER BY u.name'],
    gy: [['Write the joined rows out for Cuong first: how many rows does "Intro to SQL" produce?', 'Viết ra các dòng đã nối cho Cuong trước: "Intro to SQL" sinh ra bao nhiêu dòng?'], ['A note with no comment still needs one row: LEFT JOIN.', 'Ghi chú không có bình luận vẫn cần một dòng: LEFT JOIN.']],
    lhg: [['count(*) for notes — Intro to SQL is counted three times (one per comment).', 'count(*) cho notes — Intro to SQL bị đếm ba lần (mỗi bình luận một lần).'], ['INNER JOIN comment — notes without comments vanish from both counts (Cuong shows 2 notes).', 'INNER JOIN comment — ghi chú không bình luận biến mất khỏi cả hai số đếm (Cuong còn 2 ghi chú).']],
    gt: ['<p>Joining a one-to-many table repeats the "one" side. count(DISTINCT key) counts each note once; count(col) on the LEFT-joined side counts only real comments.</p>', '<p>Nối với bảng một–nhiều làm lặp phía "một". count(DISTINCT khoá) đếm mỗi ghi chú một lần; count(cột) ở phía LEFT JOIN chỉ đếm bình luận thật.</p>'],
    tn: [tn('fan-out', 'nhân dòng')],
  }),

  pg({
    ...O_APP, t: 'count(*) vs count(col) after a LEFT JOIN', k: 'MEDIUM', p: 6, kn: ['LEFT JOIN + GROUP BY', 'count(n.id) gives 0'], tag: ['aggregate', 'join'],
    en: '<p>Return every user with the number of notes they wrote: <code>name, notes</code>. A user with no note must show <b>0</b>. Order by notes descending, then name.</p>',
    vi: '<p>Trả về mọi user kèm số ghi chú họ viết: <code>name, notes</code>. User chưa có ghi chú phải hiện <b>0</b>. Sắp số ghi chú giảm dần, rồi theo tên.</p>',
    yc: [['LEFT JOIN note.', 'LEFT JOIN note.'], ['<code>count(n.id)</code>, not <code>count(*)</code>.', '<code>count(n.id)</code>, không phải <code>count(*)</code>.']],
    giai: `SELECT u.name, count(n.id) AS notes      -- the NULL row of Hoa is not counted ⇒ 0
FROM app_user u
LEFT JOIN note n ON n.user_id = u.id
GROUP BY u.name
ORDER BY notes DESC, u.name;`,
    kiem: [
      kq(['Cuong 3, Lan 2, Minh 1, Hoa 0', 'Cuong 3, Lan 2, Minh 1, Hoa 0'], T),
      kqAn(['A new user with no notes', 'User mới chưa có ghi chú'], "INSERT INTO app_user VALUES (5, 'Khoa', 'Hanoi')", T),
      ma(['count on a column of note', 'count trên một cột của note'], 'count\\s*\\(\\s*n\\.\\w+\\s*\\)'),
    ],
    sai: ['SELECT u.name, count(*) AS notes FROM app_user u LEFT JOIN note n ON n.user_id = u.id GROUP BY u.name ORDER BY notes DESC, u.name', 'SELECT u.name, count(n.id) AS notes FROM app_user u JOIN note n ON n.user_id = u.id GROUP BY u.name ORDER BY notes DESC, u.name'],
    gy: [['The LEFT JOIN gives Hoa one row with n.* = NULL.', 'LEFT JOIN cho Hoa một dòng với n.* = NULL.'], ['count(*) counts that row; count(n.id) does not.', 'count(*) đếm dòng đó; count(n.id) thì không.']],
    lhg: [['count(*): Hoa shows 1 note.', 'count(*): Hoa hiện 1 ghi chú.'], ['INNER JOIN: Hoa disappears instead of showing 0.', 'INNER JOIN: Hoa biến mất thay vì hiện 0.']],
    gt: ['<p>After a LEFT JOIN, an unmatched row exists but its right-hand columns are NULL. Counting a right-hand column turns "no partner" into 0 — the standard way to get zero counts.</p>', '<p>Sau LEFT JOIN, dòng không khớp vẫn tồn tại nhưng các cột phía phải là NULL. Đếm một cột phía phải biến "không có cặp" thành 0 — cách chuẩn để có số đếm bằng 0.</p>'],
    tn: [tn('count(col)', 'đếm giá trị khác NULL')],
  }),

  pg({
    t: 'Paid amount and units per customer — aggregate before you join', k: 'HARD', p: 15, kn: ['pre-aggregation in a derived table', 'fan-out of payment × order_item'], tag: ['aggregate', 'join', 'fan-out', 'ctshop'],
    en: '<p>For every customer who paid at least once, return <code>customer_id, paid_orders, paid_amount, units</code>: number of paid orders, Σ payment.amount, and Σ qty of the lines of those orders. Order by customer_id. Joining payment straight to order_item multiplies each amount by the number of lines — avoid it.</p>',
    vi: '<p>Với mọi khách đã trả tiền ít nhất một lần, trả về <code>customer_id, paid_orders, paid_amount, units</code>: số đơn đã trả, Σ payment.amount, và Σ qty của các dòng của những đơn đó. Sắp theo customer_id. Nối thẳng payment với order_item sẽ nhân mỗi khoản tiền theo số dòng — hãy tránh.</p>',
    yc: [['Aggregate order_item to ONE row per order first (derived table or CTE), then join it to payment and orders.', 'Tổng hợp order_item về MỘT dòng mỗi đơn trước (bảng dẫn xuất hoặc CTE), rồi nối với payment và orders.'], ['Columns exactly <code>customer_id, paid_orders, paid_amount, units</code>.', 'Cột đúng <code>customer_id, paid_orders, paid_amount, units</code>.']],
    giai: `SELECT o.customer_id,
       count(*)       AS paid_orders,
       sum(p.amount)  AS paid_amount,
       sum(i.units)   AS units
FROM payment p
JOIN orders o ON o.id = p.order_id
JOIN (SELECT order_id, sum(qty) AS units        -- one row per order ⇒ no fan-out
      FROM order_item
      GROUP BY order_id) i ON i.order_id = p.order_id
GROUP BY o.customer_id
ORDER BY o.customer_id;`,
    kiem: [
      kq(['Six paying customers', 'Sáu khách đã trả tiền'], T),
      kqAn(['Order 7 is paid (two lines)', 'Đơn 7 được trả (hai dòng)'], "UPDATE orders SET status = 'paid' WHERE id = 7; INSERT INTO payment (order_id, amount, method, paid_at) VALUES (7, 95000, 'cod', '2026-10-02 08:00+07')", T),
      ma(['Pre-aggregates order_item', 'Tổng hợp order_item trước'], '\\(\\s*SELECT[\\s\\S]*FROM\\s+order_item[\\s\\S]*GROUP\\s+BY|WITH\\s+\\w+\\s+AS\\s*\\('),
    ],
    sai: ['SELECT o.customer_id, count(*) AS paid_orders, sum(p.amount) AS paid_amount, sum(oi.qty) AS units FROM payment p JOIN orders o ON o.id = p.order_id JOIN order_item oi ON oi.order_id = p.order_id GROUP BY o.customer_id ORDER BY o.customer_id', 'SELECT o.customer_id, count(DISTINCT p.id) AS paid_orders, sum(DISTINCT p.amount) AS paid_amount, sum(oi.qty) AS units FROM payment p JOIN orders o ON o.id = p.order_id JOIN order_item oi ON oi.order_id = p.order_id GROUP BY o.customer_id ORDER BY o.customer_id'],
    gy: [['Look at order 1: one payment, three lines ⇒ the naive join repeats 134 000 three times.', 'Xem đơn 1: một thanh toán, ba dòng ⇒ phép nối ngây thơ lặp 134 000 ba lần.'], ['<code>(SELECT order_id, sum(qty) AS units FROM order_item GROUP BY order_id)</code> has one row per order.', '<code>(SELECT order_id, sum(qty) AS units FROM order_item GROUP BY order_id)</code> có một dòng mỗi đơn.']],
    lhg: [['Joining payment to order_item directly — paid_amount ×3 for order 1, and paid_orders counts lines.', 'Nối payment thẳng với order_item — paid_amount ×3 ở đơn 1, và paid_orders đếm dòng.'], ['<code>sum(DISTINCT p.amount)</code> — "fixes" the sample, then two different orders of the same amount are added once.', '<code>sum(DISTINCT p.amount)</code> — "sửa" được mẫu, rồi hai đơn khác nhau cùng số tiền chỉ được cộng một lần.']],
    gt: ['<p>When two one-to-many relations hang off the same row, aggregate the many side down to the grain you join at. Then every join is one-to-one and every sum is right (lab 3 R4).</p>', '<p>Khi hai quan hệ một–nhiều cùng treo vào một dòng, hãy tổng hợp phía "nhiều" về đúng hạt bạn sẽ nối. Khi đó mọi phép nối là một–một và mọi tổng đều đúng (Lab 3 R4).</p>'],
    tn: [tn('pre-aggregation', 'tổng hợp trước khi nối'), tn('derived table', 'bảng dẫn xuất')],
  }),

  cs({
    t: 'Two orders of operations, two different numbers', k: 'MEDIUM', p: 6, kn: ['fan-out diagnosis'], tag: ['aggregate', 'fan-out'],
    en: '<p>Reason about joins and aggregates without running anything.</p>', vi: '<p>Suy luận về phép nối và tổng hợp mà không cần chạy gì.</p>',
    cau: [
      q('q1', ['An order has 1 payment of 300 000 đ and 4 order lines. <code>SELECT sum(p.amount) FROM payment p JOIN order_item oi ON oi.order_id = p.order_id WHERE p.order_id = 87</code> returns…', 'Một đơn có 1 thanh toán 300 000 đ và 4 dòng đơn. <code>SELECT sum(p.amount) FROM payment p JOIN order_item oi ON oi.order_id = p.order_id WHERE p.order_id = 87</code> trả về…'], ['1 200 000 — the payment repeats once per line', '300 000 — the join does not change the sum', '75 000 — the amount is split across 4 lines', 'an error: sum() is not allowed after a join'], ['The join produces 4 rows, each carrying the same amount.', 'Phép nối sinh 4 dòng, dòng nào cũng mang cùng số tiền.']),
      q('q2', ['The quickest test that a join fanned out:', 'Cách nhanh nhất để biết phép nối đã nhân dòng:'], ['compare count(*) with count(DISTINCT payment.id)', 'run EXPLAIN and look for a Nested Loop node', 'add DISTINCT to the SELECT and compare totals', 'check the joined columns for NULL values'], ['If count(*) &gt; count(DISTINCT payment.id), each payment appears more than once.', 'Nếu count(*) &gt; count(DISTINCT payment.id) thì mỗi thanh toán xuất hiện nhiều hơn một lần.']),
      q('q3', ['Which fix is correct for "revenue AND units per month"?', 'Cách sửa nào đúng cho "doanh thu VÀ số món theo tháng"?'], ['aggregate order_item per order, then join', 'SELECT DISTINCT rows first, then sum()', 'use sum(DISTINCT p.amount) for revenue', 'replace the JOIN with a LEFT JOIN'], ['Pre-aggregation removes the multiplication at its source. DISTINCT tricks collapse legitimately equal values; LEFT JOIN changes nothing about multiplicity.', 'Tổng hợp trước loại bỏ phép nhân tận gốc. Mẹo DISTINCT gộp cả các giá trị bằng nhau hợp lệ; LEFT JOIN không đổi gì về số lần lặp.']),
      q('q4', ['<code>count(DISTINCT n.id)</code> fixes the NOTE count after joining comments. Why does the same trick not fix <code>sum(n.views)</code>?', '<code>count(DISTINCT n.id)</code> sửa được số GHI CHÚ sau khi nối bình luận. Vì sao mẹo đó không sửa được <code>sum(n.views)</code>?'], ['it would merge two notes that have equal views', 'sum() cannot be used at all after a join', 'views can be NULL, and DISTINCT drops them', 'DISTINCT is not allowed inside sum()'], ['DISTINCT works on values, not on rows: 45 + 45 from two notes would become 45. Sum per note first, or use a subquery.', 'DISTINCT làm việc trên giá trị, không trên dòng: 45 + 45 của hai ghi chú thành 45. Hãy cộng theo từng ghi chú trước, hoặc dùng truy vấn con.']),
    ],
    gy: [['Count the rows the join produces for one parent.', 'Đếm số dòng phép nối sinh ra cho một dòng cha.'], ['DISTINCT acts on values, not identities.', 'DISTINCT tác động lên giá trị, không lên danh tính.']],
    lhg: [['"Fixing" a doubled sum with DISTINCT.', '"Sửa" tổng bị nhân đôi bằng DISTINCT.'], ['Trusting a total without comparing count(*) and count(DISTINCT).', 'Tin một con số tổng mà không so count(*) với count(DISTINCT).']],
    tn: [tn('fan-out', 'nhân dòng')],
  }),
]);
