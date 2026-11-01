/** PostgreSQL · 4.4 — UPDATE & DELETE an toàn: WHERE, RETURNING, UPDATE … FROM, xoá có điều kiện chính xác. */
import { mod, pg, kq, kqAn, sau, ma, TN, tn } from './_chung.mjs';
import { O_NOTE } from './_du-lieu.mjs';

export default mod('postgresql-4-4-update-delete', '4.4 UPDATE & DELETE — safely', [
  pg({
    ...O_NOTE, t: 'Count one more view', k: 'EASY', p: 4, kn: ['UPDATE … WHERE', 'SET col = col + 1', 'RETURNING'], tag: ['dml', 'update', 'notes'],
    en: '<p>A reader opened note 3. Add one view to it and return <code>id, title, views</code> of the changed row.</p>',
    vi: '<p>Một người đọc mở ghi chú 3. Cộng một lượt xem cho nó và trả về <code>id, title, views</code> của dòng vừa đổi.</p>',
    yc: [['<code>SET views = views + 1</code> — relative to the current value.', '<code>SET views = views + 1</code> — tính từ giá trị hiện tại.'], ['<code>WHERE id = 3</code> and <code>RETURNING id, title, views</code>.', '<code>WHERE id = 3</code> và <code>RETURNING id, title, views</code>.']],
    giai: `UPDATE note
SET views = views + 1          -- the server reads and writes the row in one step
WHERE id = 3
RETURNING id, title, views;`,
    kiem: [
      kq(['Note 3 now has 46 views', 'Ghi chú 3 giờ có 46 lượt xem']),
      kqAn(['Relative to whatever the count is', 'Tính từ số đếm hiện có'], 'UPDATE note SET views = 999 WHERE id = 3'),
      sau(['No other note changed', 'Không ghi chú nào khác bị đổi'], 'SELECT sum(views) AS total FROM note'),
    ],
    sai: ['UPDATE note SET views = 46 WHERE id = 3 RETURNING id, title, views', 'UPDATE note SET views = views + 1 RETURNING id, title, views'],
    gy: [['Never compute the new value in the app and write it back — let SQL add 1.', 'Đừng tính giá trị mới ở app rồi ghi đè — để SQL tự cộng 1.'], ['RETURNING shows the row after the change.', 'RETURNING hiện dòng sau khi đổi.']],
    lhg: [['<code>SET views = 46</code> computed in the app — two readers at once both write 46 (a lost update, chapter 11).', '<code>SET views = 46</code> tính ở app — hai người đọc cùng lúc đều ghi 46 (mất cập nhật, chương 11).'], ['No WHERE — every note gets +1.', 'Thiếu WHERE — mọi ghi chú đều +1.']],
    gt: ['<p><code>views = views + 1</code> is evaluated on the current row version under a row lock, so concurrent increments add up instead of overwriting each other.</p>', '<p><code>views = views + 1</code> được tính trên phiên bản dòng hiện tại dưới khoá dòng, nên các lần cộng đồng thời dồn lại thay vì ghi đè nhau.</p>'],
    tn: [TN.returning],
  }),

  pg({
    ...O_NOTE, t: 'Unpin, and report only what really changed', k: 'EASY', p: 6, kn: ['UPDATE with two conditions', 'RETURNING as an audit'], tag: ['dml', 'update', 'notes'],
    en: '<p>Cuong wants all his notes unpinned. Write the UPDATE so that only rows that actually <b>change</b> are touched (his notes that are pinned now), and return <code>id, title, pinned</code> of those rows.</p>',
    vi: '<p>Cuong muốn bỏ ghim mọi ghi chú của mình. Viết lệnh UPDATE chỉ đụng tới dòng thật sự <b>thay đổi</b> (ghi chú của anh đang được ghim), và trả về <code>id, title, pinned</code> của các dòng đó.</p>',
    yc: [['<code>WHERE author = \'Cuong\' AND pinned</code>.', '<code>WHERE author = \'Cuong\' AND pinned</code>.'], ['<code>RETURNING id, title, pinned</code>.', '<code>RETURNING id, title, pinned</code>.']],
    giai: `UPDATE note
SET pinned = false
WHERE author = 'Cuong' AND pinned      -- rows already unpinned are left alone (no new row version, no lock)
RETURNING id, title, pinned;`,
    kiem: [
      kq(['Notes 1 and 6', 'Ghi chú 1 và 6']),
      sau(['Cuong has no pinned note left; others untouched', 'Cuong không còn ghi chú ghim; người khác giữ nguyên'], 'SELECT author, count(*) FILTER (WHERE pinned) AS pinned FROM note GROUP BY author ORDER BY author', { thuTu: true }),
      kqAn(['Works when Lan also has a pinned note', 'Đúng khi Lan cũng có ghi chú ghim'], 'UPDATE note SET pinned = true WHERE id IN (2, 3)'),
    ],
    sai: ["UPDATE note SET pinned = false WHERE author = 'Cuong' RETURNING id, title, pinned", "UPDATE note SET pinned = false WHERE pinned RETURNING id, title, pinned"],
    gy: [['Add the "is it pinned now?" test to WHERE.', 'Thêm điều kiện "đang được ghim?" vào WHERE.'], ['RETURNING lists exactly the rows the UPDATE matched.', 'RETURNING liệt kê đúng các dòng UPDATE khớp.']],
    lhg: [['Only <code>author = \'Cuong\'</code>: note 2 is rewritten for nothing and appears in the "changed" report.', 'Chỉ <code>author = \'Cuong\'</code>: ghi chú 2 bị ghi lại vô ích và hiện trong báo cáo "đã đổi".'], ['Only <code>pinned</code>: Lan\'s pinned notes get unpinned too.', 'Chỉ <code>pinned</code>: ghi chú ghim của Lan cũng bị bỏ ghim.']],
    gt: ['<p>In PostgreSQL every updated row produces a new row version (MVCC, chapter 11), even if the value does not change. Filtering out rows that are already in the target state saves writes, locks and vacuum work — and makes RETURNING an honest audit.</p>', '<p>Trong PostgreSQL mỗi dòng bị UPDATE sinh ra một phiên bản mới (MVCC, chương 11), kể cả khi giá trị không đổi. Loại các dòng đã ở trạng thái đích giúp bớt ghi, bớt khoá, bớt việc cho vacuum — và làm RETURNING thành nhật ký trung thực.</p>'],
    tn: [TN.returning],
  }),

  pg({
    ...O_NOTE, t: 'Delete empty drafts and keep the receipt', k: 'MEDIUM', p: 6, kn: ['DELETE … WHERE', 'RETURNING'], tag: ['dml', 'delete', 'notes'],
    en: '<p>Clean-up job: delete every <b>draft</b> — a note with <b>0 views</b> and <b>no tag</b> — and return <code>id, title</code> of what was deleted.</p>',
    vi: '<p>Job dọn dẹp: xoá mọi <b>bản nháp</b> — ghi chú có <b>0 lượt xem</b> và <b>không thẻ</b> — và trả về <code>id, title</code> của những gì đã xoá.</p>',
    yc: [['<code>DELETE FROM note WHERE views = 0 AND tag IS NULL</code>.', '<code>DELETE FROM note WHERE views = 0 AND tag IS NULL</code>.'], ['<code>RETURNING id, title</code>.', '<code>RETURNING id, title</code>.']],
    giai: `DELETE FROM note
WHERE views = 0 AND tag IS NULL        -- "no tag" is IS NULL, never "= NULL"
RETURNING id, title;`,
    kiem: [
      kq(['Quick draft (id 7) is deleted', 'Quick draft (id 7) bị xoá']),
      sau(['Six notes remain', 'Còn sáu ghi chú'], 'SELECT count(*) AS remaining FROM note'),
      kqAn(['A tagged note with 0 views is NOT a draft', 'Ghi chú có thẻ mà 0 lượt xem KHÔNG phải nháp'], "INSERT INTO note (title, author, tag, created_at) VALUES ('Fresh post', 'Lan', 'sql', '2026-04-15'), ('Empty idea', 'Lan', NULL, '2026-04-16')"),
    ],
    sai: ['DELETE FROM note WHERE views = 0 RETURNING id, title', 'DELETE FROM note WHERE views = 0 AND tag = NULL RETURNING id, title'],
    gy: [['Write the SELECT first (same WHERE), look at the rows, then turn it into DELETE.', 'Viết SELECT trước (cùng WHERE), xem các dòng, rồi mới đổi thành DELETE.'], ['NULL test: <code>IS NULL</code>.', 'Phép thử NULL: <code>IS NULL</code>.']],
    lhg: [['<code>tag = NULL</code> — never true, the DELETE removes nothing.', '<code>tag = NULL</code> — không bao giờ đúng, DELETE không xoá gì.'], ['Only <code>views = 0</code> — a brand-new published note is deleted too.', 'Chỉ <code>views = 0</code> — ghi chú mới đăng cũng bị xoá.']],
    gt: ['<p>DELETE … RETURNING gives you a receipt of exactly what disappeared — log it, or show it to the user. The habit from lesson 4.4: run the WHERE as a SELECT first, then delete with the same WHERE.</p>', '<p>DELETE … RETURNING cho bạn biên nhận đúng những gì đã biến mất — ghi log hoặc hiện cho người dùng. Thói quen của bài 4.4: chạy WHERE dưới dạng SELECT trước, rồi xoá với đúng WHERE đó.</p>'],
    tn: [TN.returning, TN.nullT],
  }),

  pg({
    t: 'Raise calculator prices by 10 % (UPDATE … FROM)', k: 'MEDIUM', p: 10, kn: ['UPDATE … FROM', 'round(x, -3)', 'join in UPDATE'], tag: ['dml', 'update', 'ctshop'],
    en: '<p>Supplier prices for the category named <b>Máy tính cầm tay</b> go up. Raise the price of every <b>active</b> product of that category by 10 %, rounded to the nearest 1 000 đ, and return <code>sku, price</code>. Find the category by its <b>name</b> — do not hard-code its id.</p>',
    vi: '<p>Giá nhập của danh mục tên <b>Máy tính cầm tay</b> tăng. Tăng 10 % giá mọi sản phẩm <b>đang bán</b> của danh mục đó, làm tròn tới 1 000 đ gần nhất, và trả về <code>sku, price</code>. Tìm danh mục theo <b>tên</b> — không ghi cứng id.</p>',
    yc: [['<code>UPDATE product p SET … FROM category c WHERE c.id = p.category_id AND c.name = \'Máy tính cầm tay\' AND p.is_active</code>.', '<code>UPDATE product p SET … FROM category c WHERE c.id = p.category_id AND c.name = \'Máy tính cầm tay\' AND p.is_active</code>.'], ['<code>round(price * 1.1, -3)</code> rounds to thousands.', '<code>round(price * 1.1, -3)</code> làm tròn tới hàng nghìn.']],
    giai: `UPDATE product p
SET price = round(p.price * 1.1, -3)           -- -3 ⇒ round to the nearest 1 000
FROM category c
WHERE c.id = p.category_id                     -- the join condition goes in WHERE
  AND c.name = 'Máy tính cầm tay'
  AND p.is_active
RETURNING p.sku, p.price;`,
    kiem: [
      kq(['CT1001: 705 000 → 776 000', 'CT1001: 705 000 → 776 000']),
      sau(['The inactive calculator and other categories keep their price', 'Máy tính ngừng bán và danh mục khác giữ giá'], "SELECT sku, price FROM product WHERE category_id IN (10, 11) ORDER BY sku", { thuTu: true }),
      kqAn(['A second active calculator is raised too', 'Máy tính đang bán thứ hai cũng được tăng'], "INSERT INTO product (sku, name, category_id, price) VALUES ('CT1003', 'Máy tính Vinacal 570ES Plus II', 10, 345000)"),
      ma(['UPDATE … FROM category', 'UPDATE … FROM category'], '\\bFROM\\s+category\\b'),
    ],
    sai: ["UPDATE product SET price = round(price * 1.1, -3) WHERE category_id = 10 RETURNING sku, price", "UPDATE product p SET price = p.price * 1.1 FROM category c WHERE c.id = p.category_id AND c.name = 'Máy tính cầm tay' AND p.is_active RETURNING p.sku, p.price"],
    gy: [['PostgreSQL\'s UPDATE can join other tables with FROM; the join condition goes into WHERE.', 'UPDATE của PostgreSQL nối được bảng khác bằng FROM; điều kiện nối đặt trong WHERE.'], ['A negative second argument to round() rounds to the left of the decimal point.', 'Đối số thứ hai âm của round() làm tròn về bên trái dấu thập phân.']],
    lhg: [['<code>WHERE category_id = 10</code> — hard-coded id, and the inactive calculator CT1006 gets a new price too.', '<code>WHERE category_id = 10</code> — ghi cứng id, và máy tính ngừng bán CT1006 cũng bị đổi giá.'], ['No rounding: 775 500.00 on the price tag.', 'Không làm tròn: nhãn giá ghi 775 500.00.']],
    gt: ['<p><code>UPDATE … FROM</code> joins the target with other tables; each target row is updated once using the matching row. Rounding with <code>round(x, -3)</code> keeps prices on the thousand, as shops expect.</p>', '<p><code>UPDATE … FROM</code> nối bảng đích với bảng khác; mỗi dòng đích được cập nhật một lần theo dòng khớp. <code>round(x, -3)</code> giữ giá chẵn nghìn như cửa hàng mong đợi.</p>'],
    tn: [tn('UPDATE … FROM', 'cập nhật có nối bảng')],
  }),

  pg({
    t: 'Purge old cancelled orders — exactly those', k: 'HARD', p: 12, kn: ['DELETE … WHERE … AND …', 'ON DELETE CASCADE', 'RETURNING', 'NOT EXISTS'], tag: ['dml', 'delete', 'ctshop'],
    en: '<p>Housekeeping: delete <b>cancelled</b> orders created <b>before 1 September 2026</b> that have <b>no payment</b> (never delete money records). Their lines go with them (order_item is ON DELETE CASCADE). Return <code>id, customer_id</code> of the deleted orders.</p>',
    vi: '<p>Dọn dẹp: xoá các đơn <b>đã huỷ</b> tạo <b>trước 1/9/2026</b> mà <b>không có thanh toán</b> (không bao giờ xoá chứng từ tiền). Dòng đơn đi theo (order_item là ON DELETE CASCADE). Trả về <code>id, customer_id</code> của các đơn đã xoá.</p>',
    yc: [['Three conditions: status, date (half-open), and no row in payment.', 'Ba điều kiện: trạng thái, ngày (khoảng nửa mở), và không có dòng trong payment.'], ['<code>NOT EXISTS (SELECT 1 FROM payment WHERE payment.order_id = orders.id)</code>.', '<code>NOT EXISTS (SELECT 1 FROM payment WHERE payment.order_id = orders.id)</code>.']],
    giai: `DELETE FROM orders o
WHERE o.status = 'cancelled'
  AND o.created_at < '2026-09-01'
  AND NOT EXISTS (SELECT 1 FROM payment p WHERE p.order_id = o.id)   -- never delete money records
RETURNING o.id, o.customer_id;`,
    kiem: [
      kq(['Order 4 is deleted', 'Đơn 4 bị xoá']),
      sau(['Its line is gone too, other lines stay', 'Dòng của nó cũng mất, dòng khác giữ nguyên'], 'SELECT count(*) AS lines FROM order_item'),
      kqAn(['A cancelled order WITH a payment, and a September cancellation, are kept', 'Đơn huỷ CÓ thanh toán, và đơn huỷ tháng 9, được giữ'], "UPDATE orders SET status = 'cancelled' WHERE id IN (3, 6)"),
      ma(['Checks payment', 'Có kiểm payment'], '\\bpayment\\b'),
    ],
    sai: ["DELETE FROM orders WHERE status = 'cancelled' RETURNING id, customer_id", "DELETE FROM orders WHERE status = 'cancelled' AND created_at < '2026-09-01' RETURNING id, customer_id"],
    gy: [['Start from the SELECT with the same WHERE and check the ids.', 'Bắt đầu từ SELECT với cùng WHERE và soát các id.'], ['A payment row references the order: NOT EXISTS keeps such orders.', 'Dòng payment trỏ tới đơn: NOT EXISTS giữ lại các đơn đó.']],
    lhg: [['Only <code>status = \'cancelled\'</code> — order 14 (6 Oct) is deleted although it is recent.', 'Chỉ <code>status = \'cancelled\'</code> — đơn 14 (6/10) bị xoá dù còn mới.'], ['No payment check — an order cancelled after being paid either fails with a foreign-key error or, worse with CASCADE, takes the money record with it.', 'Không kiểm thanh toán — đơn huỷ sau khi đã trả tiền hoặc lỗi khoá ngoại, hoặc tệ hơn nếu CASCADE thì kéo luôn chứng từ tiền.']],
    gt: ['<p>A safe DELETE states every condition explicitly. NOT EXISTS is the precise way to say "has no payment"; CASCADE on order_item removes the lines in the same statement, and RETURNING records what was removed.</p>', '<p>DELETE an toàn nêu tường minh mọi điều kiện. NOT EXISTS là cách chính xác để nói "không có thanh toán"; CASCADE trên order_item xoá dòng đơn trong cùng lệnh, và RETURNING ghi lại thứ đã xoá.</p>'],
    tn: [tn('NOT EXISTS', 'không tồn tại dòng khớp'), TN.returning],
  }),
]);
