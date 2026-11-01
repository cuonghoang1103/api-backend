/** PostgreSQL · 5.4 — CROSS JOIN & các bẫy join: tích Descartes cố ý/vô tình, fan-out, WHERE biến LEFT thành INNER. */
import { mod, pg, cs, q, kq, kqAn, ma, tn } from './_chung.mjs';
import { O_APP } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-5-4-cross-join-traps', '5.4 CROSS JOIN & the join traps', [
  pg({
    ...O_APP, t: 'Every size in every colour', k: 'EASY', p: 4, kn: ['CROSS JOIN'], tag: ['join', 'cross-join'],
    en: '<p>The T-shirt page needs every combination of <code>size</code> (table <code>sz</code>) and <code>color</code> (table <code>col</code>). Return <code>size, color</code> ordered by size then color.</p>',
    vi: '<p>Trang áo thun cần mọi tổ hợp <code>size</code> (bảng <code>sz</code>) và <code>color</code> (bảng <code>col</code>). Trả về <code>size, color</code> sắp theo size rồi color.</p>',
    yc: [['<code>FROM sz CROSS JOIN col</code>.', '<code>FROM sz CROSS JOIN col</code>.'], ['3 × 2 = 6 rows.', '3 × 2 = 6 dòng.']],
    giai: `SELECT size, color
FROM sz CROSS JOIN col          -- every row of sz paired with every row of col
ORDER BY size, color;`,
    kiem: [
      kq(['Six combinations', 'Sáu tổ hợp'], T),
      kqAn(['A new colour adds three rows', 'Thêm một màu là thêm ba dòng'], "INSERT INTO col VALUES ('red')", T),
      ma(['Uses CROSS JOIN', 'Dùng CROSS JOIN'], '\\bCROSS\\s+JOIN\\b'),
    ],
    sai: ["SELECT size, color FROM sz JOIN col ON col.color = 'black' ORDER BY size, color"],
    gy: [['CROSS JOIN has no ON: it pairs everything with everything.', 'CROSS JOIN không có ON: ghép mọi thứ với mọi thứ.'], ['Collation C: L &lt; M &lt; S alphabetically.', 'Collation C: L &lt; M &lt; S theo chữ cái.']],
    lhg: [['Adding a join condition that filters colours — combinations go missing.', 'Thêm điều kiện nối lọc màu — mất tổ hợp.'], ['Using CROSS JOIN on two big tables by accident — millions of rows.', 'Vô tình CROSS JOIN hai bảng lớn — hàng triệu dòng.']],
    gt: ['<p>A deliberate cross product is useful for grids (sizes × colours, days × stores). The row count is the product of both sides, so keep at least one side tiny.</p>', '<p>Tích Descartes cố ý hữu ích cho lưới (size × màu, ngày × cửa hàng). Số dòng là tích hai bên, nên giữ ít nhất một bên thật nhỏ.</p>'],
    tn: [tn('CROSS JOIN', 'tích Descartes')],
  }),

  pg({
    ...O_APP, t: 'Users with their sql notes — without losing anyone', k: 'MEDIUM', p: 7, kn: ['LEFT JOIN … ON … AND filter', 'WHERE turns LEFT into INNER'], tag: ['join', 'outer', 'trap'],
    en: '<p>List every user with each of their notes tagged <code>sql</code>: <code>name, title</code>. Users without any sql note must still appear (title NULL). Order by user id, then note id.</p>',
    vi: '<p>Liệt kê mọi user kèm từng ghi chú gắn thẻ <code>sql</code> của họ: <code>name, title</code>. User không có ghi chú sql vẫn phải xuất hiện (title NULL). Sắp theo id user, rồi id ghi chú.</p>',
    yc: [['Put the tag condition in the ON clause, not in WHERE.', 'Đặt điều kiện thẻ trong ON, không đặt trong WHERE.'], ['<code>ORDER BY u.id, n.id</code>.', '<code>ORDER BY u.id, n.id</code>.']],
    giai: `SELECT u.name, n.title
FROM app_user u
LEFT JOIN note n ON n.user_id = u.id
                AND n.tag = 'sql'        -- filter the RIGHT side inside ON: unmatched users survive
ORDER BY u.id, n.id;`,
    kiem: [
      kq(['Cuong 3 notes; Lan, Minh, Hoa with NULL', 'Cuong 3 ghi chú; Lan, Minh, Hoa với NULL'], T),
      kqAn(['Minh writes a sql note', 'Minh viết một ghi chú sql'], "INSERT INTO note VALUES (8, 3, 'CTE basics', 'sql', 7, false)", T),
      ma(['Condition inside ON', 'Điều kiện nằm trong ON'], "\\bON\\b[^;]*\\bAND\\b[^;]*tag\\s*=\\s*'sql'"),
    ],
    sai: ["SELECT u.name, n.title FROM app_user u LEFT JOIN note n ON n.user_id = u.id WHERE n.tag = 'sql' ORDER BY u.id, n.id"],
    gy: [['WHERE runs after the join: rows with n.tag NULL fail <code>n.tag = \'sql\'</code> and are thrown away.', 'WHERE chạy sau phép nối: dòng có n.tag NULL trượt <code>n.tag = \'sql\'</code> và bị loại.'], ['A condition in ON only decides which notes MATCH; the user is kept anyway.', 'Điều kiện trong ON chỉ quyết định ghi chú nào KHỚP; user vẫn được giữ.']],
    lhg: [['Filtering the right table in WHERE: the LEFT JOIN silently becomes an INNER JOIN.', 'Lọc bảng phải trong WHERE: LEFT JOIN lặng lẽ thành INNER JOIN.'], ['Adding <code>OR n.tag IS NULL</code> to the WHERE: also keeps users whose only notes are untagged, and still loses users whose notes are tagged something else.', 'Thêm <code>OR n.tag IS NULL</code> vào WHERE: lại giữ user chỉ có ghi chú chưa gắn thẻ, và vẫn mất user có ghi chú thẻ khác.']],
    gt: ['<p>For an outer join, ON says what counts as a match; WHERE filters the final rows. Conditions on the optional side belong in ON.</p>', '<p>Với nối ngoài, ON nói thế nào là khớp; WHERE lọc dòng cuối cùng. Điều kiện trên phía tuỳ chọn phải đặt trong ON.</p>'],
    tn: [tn('ON vs WHERE', 'điều kiện khớp vs lọc kết quả')],
  }),

  pg({
    t: 'Recommend books customers have not bought yet', k: 'HARD', p: 12, kn: ['CROSS JOIN to build candidates', 'anti-join to remove owned pairs'], tag: ['join', 'cross-join', 'anti-join', 'ctshop'],
    en: '<p>Marketing e-mails customers 1, 2 and 3 a recommendation for every <b>active</b> product of category <b>Giáo trình IT</b> (id 12) they have <b>not</b> bought yet (in any order, whatever its status). Return <code>customer_id, sku</code> ordered by customer_id, sku.</p>',
    vi: '<p>Marketing gửi khách 1, 2, 3 lời giới thiệu cho mọi sản phẩm <b>đang bán</b> thuộc danh mục <b>Giáo trình IT</b> (id 12) mà họ <b>chưa</b> mua (trong bất kỳ đơn nào, trạng thái nào). Trả về <code>customer_id, sku</code> sắp theo customer_id, sku.</p>',
    yc: [['Candidates = customers {1,2,3} CROSS JOIN active books.', 'Ứng viên = khách {1,2,3} CROSS JOIN sách đang bán.'], ['Remove the pairs that already appear in that customer\'s order lines.', 'Bỏ các cặp đã có trong dòng đơn của khách đó.']],
    giai: `SELECT c.id AS customer_id, p.sku
FROM customer c
CROSS JOIN product p                                  -- every customer × every book …
LEFT JOIN (orders o JOIN order_item oi ON oi.order_id = o.id)
       ON o.customer_id = c.id AND oi.product_id = p.id
WHERE c.id IN (1, 2, 3)
  AND p.category_id = 12 AND p.is_active
  AND oi.order_id IS NULL                             -- … minus what they already bought
ORDER BY c.id, p.sku;`,
    kiem: [
      kq(['Three recommendations', 'Ba lời giới thiệu'], T),
      kqAn(['A new book, and customer 2 buys CT1201', 'Sách mới, và khách 2 mua CT1201'], "INSERT INTO product (sku, name, category_id, price) VALUES ('CT1207', 'Python cơ bản', 12, 99000); INSERT INTO order_item VALUES (3, 43, 1, 89000)", T),
      ma(['Builds candidates with CROSS JOIN', 'Dựng ứng viên bằng CROSS JOIN'], '\\bCROSS\\s+JOIN\\b'),
    ],
    sai: ['SELECT c.id AS customer_id, p.sku FROM customer c CROSS JOIN product p WHERE c.id IN (1, 2, 3) AND p.category_id = 12 AND p.is_active ORDER BY c.id, p.sku', "SELECT c.id AS customer_id, p.sku FROM customer c CROSS JOIN product p LEFT JOIN orders o ON o.customer_id = c.id LEFT JOIN order_item oi ON oi.order_id = o.id AND oi.product_id = p.id WHERE c.id IN (1, 2, 3) AND p.category_id = 12 AND p.is_active AND oi.order_id IS NULL ORDER BY c.id, p.sku"],
    gy: [['Step 1: the CROSS JOIN of the three customers and the active books (6 rows).', 'Bước 1: CROSS JOIN ba khách với sách đang bán (6 dòng).'], ['Step 2: LEFT JOIN the purchases on BOTH customer and product, keep the unmatched (or use NOT EXISTS).', 'Bước 2: LEFT JOIN các lần mua theo CẢ khách lẫn sản phẩm, giữ dòng không khớp (hoặc dùng NOT EXISTS).']],
    lhg: [['No anti-join: customer 1 is told to buy the database textbook he already owns.', 'Không có anti-join: khách 1 được mời mua giáo trình CSDL anh đã có.'], ['Two separate LEFT JOINs (orders, then items): every order of the customer produces a candidate row, so a book bought in one order still looks "not bought" via the other orders.', 'Hai LEFT JOIN rời (orders rồi items): mỗi đơn của khách sinh một dòng ứng viên, nên sách đã mua ở đơn này vẫn trông như "chưa mua" qua các đơn khác.']],
    gt: ['<p>CROSS JOIN builds the full candidate set on purpose; the anti-join then removes what already exists. Joining orders and order_item together (in parentheses, or with NOT EXISTS) makes "this customer bought this product" one test, avoiding the fan-out of the second wrong answer.</p>', '<p>CROSS JOIN cố ý dựng đủ tập ứng viên; anti-join rồi bỏ những gì đã có. Nối orders với order_item thành một khối (trong ngoặc, hoặc dùng NOT EXISTS) khiến "khách này đã mua sản phẩm này" là một phép thử duy nhất, tránh nhân dòng của đáp án sai thứ hai.</p>'],
    tn: [tn('CROSS JOIN', 'tích Descartes'), tn('anti-join', 'phép nối loại trừ')],
  }),

  cs({
    t: 'Name the join trap', k: 'MEDIUM', p: 6, kn: ['accidental cross join', 'fan-out', 'LEFT → INNER', 'non-unique join key'], tag: ['join', 'trap'],
    en: '<p>Each symptom comes from one of the traps of lesson 5.4. Pick the cause.</p>', vi: '<p>Mỗi triệu chứng đến từ một bẫy của bài 5.4. Chọn nguyên nhân.</p>',
    cau: [
      q('q1', ['<code>SELECT … FROM orders, customer WHERE orders.status = \'paid\'</code> returns 6 000 rows for 750 paid orders and 8 customers.', '<code>SELECT … FROM orders, customer WHERE orders.status = \'paid\'</code> trả 6 000 dòng cho 750 đơn đã trả và 8 khách.'], ['an accidental cross join: no join condition', 'fan-out: one order repeated for each order line', 'a LEFT JOIN whose filter was written in WHERE', 'duplicate customers stored with the same email'], ['750 × 8 = 6 000: every paid order paired with every customer. The comma syntax makes a forgotten condition easy — write explicit JOIN … ON.', '750 × 8 = 6 000: mọi đơn đã trả ghép với mọi khách. Cú pháp dấu phẩy dễ quên điều kiện — hãy viết JOIN … ON tường minh.']),
      q('q2', ['Revenue per customer doubles after you add <code>JOIN order_item</code> to a query that sums <code>payment.amount</code>.', 'Doanh thu theo khách tăng gấp đôi sau khi thêm <code>JOIN order_item</code> vào truy vấn cộng <code>payment.amount</code>.'], ['fan-out: the payment row repeats once per line', 'an accidental cross join with the customer table', 'sum() counting NULL amounts as zero twice', 'the session timezone shifting payments into the month'], ['A one-to-many join multiplies the "one" side. Sum amounts before joining the lines (chapter 6.4).', 'Phép nối một–nhiều nhân bản phía "một". Cộng tiền trước khi nối với dòng đơn (bài 6.4).']),
      q('q3', ['A LEFT JOIN report "every customer and their paid orders" suddenly lost the customers with no paid order.', 'Báo cáo LEFT JOIN "mọi khách và đơn đã trả của họ" bỗng mất các khách chưa có đơn đã trả.'], ['the status filter was written in WHERE, not in ON', 'fan-out of the order lines doubling the rows', 'an accidental cross join with payments', 'a missing index on orders.customer_id'], ['WHERE o.status = \'paid\' rejects the NULL rows the LEFT JOIN kept. Move it into ON.', 'WHERE o.status = \'paid\' loại những dòng NULL mà LEFT JOIN vừa giữ. Chuyển nó vào ON.']),
      q('q4', ['Joining notes to users with <code>ON u.name = n.author_name</code> shows some notes twice.', 'Nối ghi chú với user bằng <code>ON u.name = n.author_name</code> làm vài ghi chú hiện hai lần.'], ['the join key is not unique: two users share a name', 'fan-out of comments attached to the notes', 'an accidental cross join of the two tables', 'NULL author names matching each other'], ['A join is safe when one side is unique (a key). Names are not unique — join on ids.', 'Phép nối an toàn khi một phía là duy nhất (một khoá). Tên không duy nhất — hãy nối theo id.']),
    ],
    gy: [['Compare the row count with what you expected: × N means a multiplication.', 'So số dòng với số mong đợi: × N nghĩa là có phép nhân.'], ['Rows MISSING from a LEFT JOIN ⇒ look at the WHERE clause.', 'Dòng BỊ MẤT khỏi LEFT JOIN ⇒ xem mệnh đề WHERE.']],
    lhg: [['Fixing a fan-out with DISTINCT on the final rows — it hides the bug and breaks sums.', 'Sửa nhân dòng bằng DISTINCT ở dòng cuối — che lỗi và làm hỏng phép cộng.'], ['Blaming performance for wrong numbers.', 'Đổ lỗi cho hiệu năng khi số liệu sai.']],
    tn: [tn('fan-out', 'nhân dòng'), tn('Cartesian product', 'tích Descartes')],
  }),
]);
