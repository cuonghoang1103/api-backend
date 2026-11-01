/** PostgreSQL · 5.1 — INNER JOIN: ON, USING, nối nhiều bảng của CT Shop. */
import { mod, pg, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { O_APP } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-5-1-inner-join', '5.1 INNER JOIN: putting rows back together', [
  pg({
    ...O_APP, t: 'Every note with its author', k: 'EASY', p: 5, kn: ['JOIN … ON', 'table aliases'], tag: ['join'],
    en: '<p>Return <code>title, author, tag</code> for every note that has an author (the author is <code>app_user.name</code>), ordered by note id.</p>',
    vi: '<p>Trả về <code>title, author, tag</code> cho mọi ghi chú có tác giả (tác giả là <code>app_user.name</code>), sắp theo id ghi chú.</p>',
    yc: [['<code>FROM note n JOIN app_user u ON u.id = n.user_id</code>.', '<code>FROM note n JOIN app_user u ON u.id = n.user_id</code>.'], ['Column <code>u.name AS author</code>.', 'Cột <code>u.name AS author</code>.']],
    giai: `SELECT n.title, u.name AS author, n.tag
FROM note n
JOIN app_user u ON u.id = n.user_id      -- INNER: the orphan draft (user_id NULL) has no partner and drops out
ORDER BY n.id;`,
    kiem: [
      kq(['Six notes; the orphan draft is not listed', 'Sáu ghi chú; bản nháp mồ côi không có mặt'], T),
      kqAn(['A new note of Hoa appears', 'Ghi chú mới của Hoa xuất hiện'], "INSERT INTO note VALUES (8, 4, 'Hue food', 'life', 3, false)", T),
      ma(['Uses JOIN … ON', 'Dùng JOIN … ON'], '\\bJOIN\\b[\\s\\S]*\\bON\\b'),
    ],
    sai: ['SELECT n.title, u.name AS author, n.tag FROM note n JOIN app_user u ON u.id = n.id ORDER BY n.id', 'SELECT n.title, u.name AS author, n.tag FROM note n, app_user u ORDER BY n.id'],
    gy: [['Join on the foreign key: note.user_id points at app_user.id.', 'Nối theo khoá ngoại: note.user_id trỏ tới app_user.id.'], ['JOIN alone means INNER JOIN.', 'JOIN trơn nghĩa là INNER JOIN.']],
    lhg: [['<code>ON u.id = n.id</code>: note 1 is paired with user 1 by coincidence, note 5 with nobody, notes 6–7 vanish.', '<code>ON u.id = n.id</code>: ghi chú 1 ghép với user 1 do trùng hợp, ghi chú 5 không ai, ghi chú 6–7 biến mất.'], ['A comma between tables without a join condition: every note × every user (28 rows).', 'Dấu phẩy giữa hai bảng mà không có điều kiện nối: mọi ghi chú × mọi user (28 dòng).']],
    gt: ['<p>INNER JOIN returns one row per pair (note, user) that satisfies ON. The orphan draft has user_id NULL, which equals nothing, so it does not appear — the next lesson keeps such rows with LEFT JOIN.</p>', '<p>INNER JOIN trả một dòng cho mỗi cặp (ghi chú, user) thoả ON. Bản nháp mồ côi có user_id NULL, không bằng gì cả, nên không xuất hiện — bài sau giữ các dòng đó bằng LEFT JOIN.</p>'],
    tn: [TN.join, tn('alias', 'bí danh bảng')],
  }),

  pg({
    ...O_APP, t: 'USING when both columns share a name', k: 'EASY', p: 5, kn: ['JOIN … USING', 'merged column'], tag: ['join'],
    en: '<p><code>note_stat</code> has one row per note with the same column name <code>id</code>. Return <code>id, title, reads</code> of notes read at least 100 times, most read first.</p>',
    vi: '<p><code>note_stat</code> có một dòng cho mỗi ghi chú, cùng tên cột <code>id</code>. Trả về <code>id, title, reads</code> của các ghi chú được đọc từ 100 lần trở lên, đọc nhiều nhất trước.</p>',
    yc: [['<code>FROM note JOIN note_stat USING (id)</code> — the id column appears once.', '<code>FROM note JOIN note_stat USING (id)</code> — cột id chỉ xuất hiện một lần.'], ['Order by reads descending.', 'Sắp reads giảm dần.']],
    giai: `SELECT id, n.title, s.reads           -- with USING, "id" is the merged column: no alias needed
FROM note n
JOIN note_stat s USING (id)
WHERE s.reads >= 100
ORDER BY s.reads DESC;`,
    kiem: [
      kq(['Notes 1, 2, 3', 'Ghi chú 1, 2, 3'], T),
      kqAn(['Exactly 100 reads is included', 'Đúng 100 lượt đọc vẫn được tính'], 'UPDATE note_stat SET reads = 100 WHERE id = 4', T),
      ma(['Uses USING', 'Dùng USING'], '\\bUSING\\s*\\(\\s*id\\s*\\)'),
    ],
    sai: ['SELECT id, n.title, s.reads FROM note n JOIN note_stat s USING (id) WHERE s.reads > 100 ORDER BY s.reads DESC', 'SELECT n.id, n.title, s.reads FROM note n JOIN note_stat s ON s.id = n.id WHERE s.reads >= 100 ORDER BY s.reads'],
    gy: [['USING (id) = ON n.id = s.id, plus one merged id column.', 'USING (id) = ON n.id = s.id, cộng một cột id đã gộp.'], ['"At least 100" ⇒ <code>&gt;= 100</code>.', '"Từ 100 trở lên" ⇒ <code>&gt;= 100</code>.']],
    lhg: [['<code>&gt; 100</code> loses a note read exactly 100 times.', '<code>&gt; 100</code> mất ghi chú được đọc đúng 100 lần.'], ['Writing <code>n.id</code> in SELECT with USING works in PostgreSQL, but the plain merged <code>id</code> is the clearer form.', 'Viết <code>n.id</code> trong SELECT khi dùng USING vẫn chạy, nhưng cột gộp <code>id</code> rõ ràng hơn.']],
    gt: ['<p>USING is a shorthand for equality on identically named columns. It is handy for 1:1 side tables like note_stat that reuse the primary key as their own key.</p>', '<p>USING là cách viết tắt cho phép bằng trên các cột cùng tên. Nó tiện cho bảng phụ 1:1 như note_stat dùng lại khoá chính làm khoá của mình.</p>'],
    tn: [tn('USING', 'nối theo cột cùng tên')],
  }),

  pg({
    t: 'Order 5, line by line', k: 'MEDIUM', p: 7, kn: ['JOIN order_item ↔ product', 'computed column'], tag: ['join', 'ctshop'],
    en: '<p>Print the lines of <b>order 5</b>: <code>sku, name, qty, unit_price, line_total</code> (qty × unit_price), ordered by sku.</p>',
    vi: '<p>In các dòng của <b>đơn 5</b>: <code>sku, name, qty, unit_price, line_total</code> (qty × unit_price), sắp theo sku.</p>',
    yc: [['Join order_item to product on product_id.', 'Nối order_item với product theo product_id.'], ['Use <code>oi.unit_price</code> (price at purchase), not today\'s <code>p.price</code>.', 'Dùng <code>oi.unit_price</code> (giá lúc mua), không dùng <code>p.price</code> hôm nay.']],
    giai: `SELECT p.sku, p.name, oi.qty, oi.unit_price,
       oi.qty * oi.unit_price AS line_total
FROM order_item oi
JOIN product p ON p.id = oi.product_id
WHERE oi.order_id = 5
ORDER BY p.sku;`,
    kiem: [
      kq(['Three lines', 'Ba dòng'], T),
      kqAn(['After a price change the invoice keeps the purchase price', 'Sau khi đổi giá, hoá đơn vẫn giữ giá lúc mua'], "UPDATE product SET price = 4500 WHERE id = 7", T),
      ma(['Uses unit_price from order_item', 'Dùng unit_price của order_item'], 'unit_price'),
    ],
    sai: ['SELECT p.sku, p.name, oi.qty, p.price AS unit_price, oi.qty * p.price AS line_total FROM order_item oi JOIN product p ON p.id = oi.product_id WHERE oi.order_id = 5 ORDER BY p.sku', 'SELECT p.sku, p.name, oi.qty, oi.unit_price, oi.qty * oi.unit_price AS line_total FROM order_item oi JOIN product p ON p.id = oi.order_id WHERE oi.order_id = 5 ORDER BY p.sku'],
    gy: [['The link is <code>p.id = oi.product_id</code>.', 'Mối nối là <code>p.id = oi.product_id</code>.'], ['order_item keeps the price at the moment of purchase on purpose.', 'order_item cố ý giữ giá tại thời điểm mua.']],
    lhg: [['Using <code>p.price</code>: the day the price changes, every old invoice changes too.', 'Dùng <code>p.price</code>: ngày đổi giá, mọi hoá đơn cũ cũng đổi theo.'], ['Joining <code>p.id = oi.order_id</code>: product 5 does not exist — the result is empty.', 'Nối <code>p.id = oi.order_id</code>: sản phẩm 5 không tồn tại — kết quả rỗng.']],
    gt: ['<p>order_item is the junction table between orders and product, and it stores <code>unit_price</code> so history never changes. The join only borrows the sku and name from product.</p>', '<p>order_item là bảng nối giữa orders và product, và nó lưu <code>unit_price</code> để lịch sử không bao giờ đổi. Phép nối chỉ mượn sku và tên từ product.</p>'],
    tn: [tn('junction table', 'bảng nối')],
  }),

  pg({
    t: 'Paid and shipped orders of Hà Nội customers', k: 'HARD', p: 10, kn: ['three-table join', 'filters on both sides'], tag: ['join', 'ctshop'],
    en: '<p>The Hà Nội warehouse prepares a report: every order with status <code>paid</code> or <code>shipped</code> whose customer lives in <b>Hà Nội</b>, with its payment method. Return <code>order_id, full_name, status, method, amount</code>, oldest order first.</p>',
    vi: '<p>Kho Hà Nội làm báo cáo: mọi đơn có trạng thái <code>paid</code> hoặc <code>shipped</code> mà khách sống ở <b>Hà Nội</b>, kèm phương thức thanh toán. Trả về <code>order_id, full_name, status, method, amount</code>, đơn cũ nhất trước.</p>',
    yc: [['orders ⋈ customer ⋈ payment.', 'orders ⋈ customer ⋈ payment.'], ['Order by <code>o.created_at</code>.', 'Sắp theo <code>o.created_at</code>.']],
    giai: `SELECT o.id AS order_id, c.full_name, o.status, p.method, p.amount
FROM orders o
JOIN customer c ON c.id = o.customer_id
JOIN payment  p ON p.order_id = o.id
WHERE c.city = 'Hà Nội'
  AND o.status IN ('paid', 'shipped')
ORDER BY o.created_at;`,
    kiem: [
      kq(['Four orders of Bình and Hà', 'Bốn đơn của Bình và Hà'], T),
      kqAn(['Customer 2 moves to Hà Nội', 'Khách 2 chuyển về Hà Nội'], "UPDATE customer SET city = 'Hà Nội' WHERE id = 2", T),
      ma(['Joins payment', 'Có nối payment'], '\\bJOIN\\s+payment\\b'),
    ],
    sai: ["SELECT o.id AS order_id, c.full_name, o.status, p.method, p.amount FROM orders o JOIN customer c ON c.id = o.customer_id JOIN payment p ON p.order_id = o.id WHERE c.city = 'Hà Nội' ORDER BY o.id", "SELECT o.id AS order_id, c.full_name, o.status, p.method, p.amount FROM orders o JOIN customer c ON c.id = o.id JOIN payment p ON p.order_id = o.id WHERE c.city = 'Hà Nội' AND o.status IN ('paid', 'shipped') ORDER BY o.created_at"],
    gy: [['Start from orders, then join each table you need one by one, each with its own ON.', 'Bắt đầu từ orders, rồi nối từng bảng cần thiết, mỗi bảng một ON riêng.'], ['Order by time, not by id.', 'Sắp theo thời gian, không theo id.']],
    lhg: [['<code>ON c.id = o.id</code>: order ids paired with customer ids by coincidence.', '<code>ON c.id = o.id</code>: id đơn ghép với id khách do trùng hợp.'], ['Ordering by id: order 13 (Oct 5) and order 8 (Sep 5) look out of time order once ids and dates diverge.', 'Sắp theo id: khi id và ngày lệch nhau, thứ tự thời gian bị sai.']],
    gt: ['<p>Every join follows a foreign key: orders.customer_id → customer, payment.order_id → orders. Filters on any joined table go into WHERE. All paid/shipped orders have exactly one payment, so the INNER JOIN does not drop any.</p>', '<p>Mỗi phép nối đi theo một khoá ngoại: orders.customer_id → customer, payment.order_id → orders. Điều kiện lọc trên bảng nào cũng đặt trong WHERE. Mọi đơn paid/shipped đều có đúng một thanh toán, nên INNER JOIN không làm rơi đơn nào.</p>'],
    tn: [TN.join],
  }),
]);
