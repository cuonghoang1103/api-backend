/** PostgreSQL · 5.2 — OUTER JOIN: LEFT, anti-join, RIGHT/FULL. */
import { mod, pg, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { O_APP } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-5-2-outer-join', '5.2 OUTER JOINs: keeping the unmatched rows', [
  pg({
    ...O_APP, t: 'Every user, with or without notes', k: 'EASY', p: 5, kn: ['LEFT JOIN', 'NULL for missing partners'], tag: ['join', 'outer'],
    en: '<p>List every user with each of their note titles: <code>name, title</code>. A user without notes still appears once, with <code>title</code> NULL. Order by user id, then note id.</p>',
    vi: '<p>Liệt kê mọi user kèm từng tiêu đề ghi chú của họ: <code>name, title</code>. User không có ghi chú vẫn hiện một lần, với <code>title</code> NULL. Sắp theo id user rồi id ghi chú.</p>',
    yc: [['<code>FROM app_user u LEFT JOIN note n ON n.user_id = u.id</code>.', '<code>FROM app_user u LEFT JOIN note n ON n.user_id = u.id</code>.'], ['<code>ORDER BY u.id, n.id</code>.', '<code>ORDER BY u.id, n.id</code>.']],
    giai: `SELECT u.name, n.title
FROM app_user u
LEFT JOIN note n ON n.user_id = u.id     -- keep every user; no note ⇒ n.* is NULL
ORDER BY u.id, n.id;`,
    kiem: [
      kq(['Hoa appears with NULL', 'Hoa xuất hiện với NULL'], T),
      kqAn(['A new user with no notes appears too', 'User mới chưa có ghi chú cũng xuất hiện'], "INSERT INTO app_user VALUES (5, 'Khoa', 'Hanoi')", T),
      ma(['Uses LEFT JOIN', 'Dùng LEFT JOIN'], '\\bLEFT\\s+(OUTER\\s+)?JOIN\\b'),
    ],
    sai: ['SELECT u.name, n.title FROM app_user u JOIN note n ON n.user_id = u.id ORDER BY u.id, n.id', 'SELECT u.name, n.title FROM note n LEFT JOIN app_user u ON n.user_id = u.id ORDER BY u.id, n.id'],
    gy: [['The table whose rows must ALL appear goes on the LEFT.', 'Bảng mà MỌI dòng phải xuất hiện đặt bên TRÁI.'], ['Missing partner ⇒ every column of the right table is NULL.', 'Không có cặp ⇒ mọi cột của bảng phải là NULL.']],
    lhg: [['Plain JOIN: Hoa disappears from the list of users.', 'JOIN thường: Hoa biến mất khỏi danh sách user.'], ['Putting note on the left: now the orphan draft is kept and Hoa is lost.', 'Đặt note bên trái: giờ bản nháp mồ côi được giữ còn Hoa thì mất.']],
    gt: ['<p>LEFT JOIN returns every row of the left table at least once; when ON finds no partner, the right side is filled with NULLs.</p>', '<p>LEFT JOIN trả mọi dòng của bảng trái ít nhất một lần; khi ON không tìm được cặp, phía phải được điền NULL.</p>'],
    tn: [TN.leftJoin],
  }),

  pg({
    ...O_APP, t: 'Anti-join: users who never wrote a note', k: 'MEDIUM', p: 6, kn: ['LEFT JOIN … WHERE right.key IS NULL'], tag: ['join', 'anti-join'],
    en: '<p>Return <code>id, name</code> of every user who has <b>no</b> note at all, ordered by id.</p>',
    vi: '<p>Trả về <code>id, name</code> của mọi user <b>chưa có</b> ghi chú nào, sắp theo id.</p>',
    yc: [['LEFT JOIN note, then keep the rows where the note side is NULL.', 'LEFT JOIN note, rồi giữ các dòng có phía note là NULL.'], ['Test a column that can never be NULL in a real match: the primary key <code>n.id</code>.', 'Thử trên cột không bao giờ NULL khi khớp thật: khoá chính <code>n.id</code>.']],
    giai: `SELECT u.id, u.name
FROM app_user u
LEFT JOIN note n ON n.user_id = u.id
WHERE n.id IS NULL                  -- no partner found ⇒ the anti-join
ORDER BY u.id;`,
    kiem: [
      kq(['Only Hoa', 'Chỉ Hoa'], T),
      kqAn(['Hoa writes a note; Khoa writes an untagged note; Linh writes nothing', 'Hoa viết một ghi chú; Khoa viết ghi chú chưa gắn thẻ; Linh chưa viết gì'], "INSERT INTO app_user VALUES (5, 'Khoa', 'Hanoi'), (6, 'Linh', NULL); INSERT INTO note VALUES (8, 4, 'Hue food', 'life', 3, false), (9, 5, 'Untagged idea', NULL, 1, false)", T),
      ma(['IS NULL after the LEFT JOIN', 'IS NULL sau LEFT JOIN'], '\\bIS\\s+NULL\\b|NOT\\s+EXISTS'),
    ],
    sai: ['SELECT u.id, u.name FROM app_user u LEFT JOIN note n ON n.user_id = u.id WHERE n.tag IS NULL ORDER BY u.id', 'SELECT u.id, u.name FROM app_user u JOIN note n ON n.user_id = u.id WHERE n.id IS NULL ORDER BY u.id'],
    gy: [['The "no match" rows are the ones where the right table\'s key is NULL.', 'Dòng "không khớp" là dòng có khoá của bảng phải bằng NULL.'], ['Do not test a nullable column like tag — a real note can have tag NULL.', 'Đừng thử trên cột cho phép NULL như tag — ghi chú thật vẫn có thể có tag NULL.']],
    lhg: [['<code>WHERE n.tag IS NULL</code>: users whose note simply has no tag are reported as "no notes".', '<code>WHERE n.tag IS NULL</code>: user có ghi chú chưa gắn thẻ bị báo là "không có ghi chú".'], ['INNER JOIN + IS NULL — always empty.', 'INNER JOIN + IS NULL — luôn rỗng.']],
    gt: ['<p>The anti-join pattern is "LEFT JOIN, then keep the rows that found nothing". Test the primary key of the right table, which is NULL only when there was no match. NOT EXISTS (chapter 7) is the other spelling.</p>', '<p>Mẫu anti-join là "LEFT JOIN rồi giữ những dòng không tìm được gì". Thử trên khoá chính của bảng phải, chỉ NULL khi không có cặp. NOT EXISTS (chương 7) là cách viết khác.</p>'],
    tn: [tn('anti-join', 'phép nối loại trừ')],
  }),

  pg({
    t: 'Products nobody has ever ordered', k: 'MEDIUM', p: 7, kn: ['anti-join on CT Shop'], tag: ['join', 'anti-join', 'ctshop'],
    en: '<p>Purchasing wants to know which products have <b>never appeared in any order</b>. Return <code>sku, name, stock</code>, ordered by sku.</p>',
    vi: '<p>Bộ phận mua hàng muốn biết sản phẩm nào <b>chưa từng xuất hiện trong đơn nào</b>. Trả về <code>sku, name, stock</code>, sắp theo sku.</p>',
    yc: [['product LEFT JOIN order_item, keep the unmatched.', 'product LEFT JOIN order_item, giữ dòng không khớp.'], ['Each product at most once in the result.', 'Mỗi sản phẩm tối đa một lần trong kết quả.']],
    giai: `SELECT p.sku, p.name, p.stock
FROM product p
LEFT JOIN order_item oi ON oi.product_id = p.id
WHERE oi.order_id IS NULL
ORDER BY p.sku;`,
    kiem: [
      kq(['Only CT1006', 'Chỉ CT1006'], T),
      kqAn(['New products that nobody bought yet', 'Sản phẩm mới chưa ai mua'], "INSERT INTO product (sku, name, category_id, price) VALUES ('CT1207', 'Python cơ bản', 12, 99000), ('CT0902', 'Sổ tay Klong A5', 9, 65000)", T),
      ma(['Anti-join', 'Phép nối loại trừ'], '\\bIS\\s+NULL\\b|NOT\\s+EXISTS'),
    ],
    sai: ['SELECT p.sku, p.name, p.stock FROM product p WHERE p.stock = 0 ORDER BY p.sku', 'SELECT DISTINCT p.sku, p.name, p.stock FROM product p JOIN order_item oi ON oi.product_id = p.id ORDER BY p.sku'],
    gy: [['Same anti-join as the users/notes exercise, on CT Shop tables.', 'Cùng mẫu anti-join như bài user/ghi chú, trên bảng CT Shop.'], ['order_item.order_id is part of its primary key, so it is NULL only when nothing matched.', 'order_item.order_id thuộc khoá chính, nên chỉ NULL khi không có gì khớp.']],
    lhg: [['Guessing from <code>stock = 0</code> — out of stock is not the same as never sold.', 'Đoán theo <code>stock = 0</code> — hết hàng khác với chưa từng bán.'], ['An INNER JOIN lists the products that WERE ordered — the opposite question.', 'INNER JOIN liệt kê sản phẩm ĐÃ được đặt — câu hỏi ngược lại.']],
    gt: ['<p>CT Shop sold 15 of its 16 sample products; the anti-join finds the one with no order_item row. Lab 3 uses the same pattern to find customers to win back.</p>', '<p>CT Shop đã bán 15/16 sản phẩm mẫu; anti-join tìm ra món không có dòng order_item nào. Lab 3 dùng lại mẫu này để tìm khách cần kéo về.</p>'],
    tn: [tn('anti-join', 'phép nối loại trừ')],
  }),

  pg({
    ...O_APP, t: 'FULL JOIN: nobody left behind on either side', k: 'HARD', p: 8, kn: ['FULL OUTER JOIN', 'NULLS LAST in ORDER BY'], tag: ['join', 'outer'],
    en: '<p>An audit wants both kinds of orphans in one list: users without notes <b>and</b> notes without users. Return <code>author, title</code> for every user–note pair, plus Hoa (no note) and the orphan draft (no user). Order by user id then note id, NULLs last.</p>',
    vi: '<p>Kiểm toán muốn cả hai loại mồ côi trong một danh sách: user không có ghi chú <b>và</b> ghi chú không có user. Trả về <code>author, title</code> cho mọi cặp user–ghi chú, cộng Hoa (không ghi chú) và bản nháp mồ côi (không user). Sắp theo id user rồi id ghi chú, NULL xếp cuối.</p>',
    yc: [['<code>FROM app_user u FULL JOIN note n ON n.user_id = u.id</code>.', '<code>FROM app_user u FULL JOIN note n ON n.user_id = u.id</code>.'], ['<code>ORDER BY u.id NULLS LAST, n.id NULLS LAST</code>.', '<code>ORDER BY u.id NULLS LAST, n.id NULLS LAST</code>.']],
    giai: `SELECT u.name AS author, n.title
FROM app_user u
FULL JOIN note n ON n.user_id = u.id         -- unmatched rows of BOTH sides are kept
ORDER BY u.id NULLS LAST, n.id NULLS LAST;`,
    kiem: [
      kq(['Seven pairs, Hoa with NULL, the orphan draft with NULL author', 'Bảy cặp, Hoa với NULL, bản nháp mồ côi với tác giả NULL'], T),
      kqAn(['Another orphan note and another lonely user', 'Thêm một ghi chú mồ côi và một user lẻ loi'], "INSERT INTO note VALUES (8, NULL, 'Untitled', NULL, NULL, false); INSERT INTO app_user VALUES (5, 'Khoa', 'Hanoi')", T),
      ma(['Uses FULL JOIN', 'Dùng FULL JOIN'], '\\bFULL\\s+(OUTER\\s+)?JOIN\\b'),
    ],
    sai: ['SELECT u.name AS author, n.title FROM app_user u LEFT JOIN note n ON n.user_id = u.id ORDER BY u.id NULLS LAST, n.id NULLS LAST', 'SELECT u.name AS author, n.title FROM app_user u RIGHT JOIN note n ON n.user_id = u.id ORDER BY u.id NULLS LAST, n.id NULLS LAST'],
    gy: [['LEFT keeps the left orphans, RIGHT the right orphans, FULL both.', 'LEFT giữ mồ côi bên trái, RIGHT giữ bên phải, FULL giữ cả hai.'], ['Rows with u.id NULL must sort after real users.', 'Dòng có u.id NULL phải xếp sau user thật.']],
    lhg: [['LEFT JOIN: the orphan draft is missing.', 'LEFT JOIN: thiếu bản nháp mồ côi.'], ['RIGHT JOIN: Hoa is missing.', 'RIGHT JOIN: thiếu Hoa.']],
    gt: ['<p>FULL JOIN = LEFT JOIN ∪ RIGHT JOIN: every row of both tables appears at least once, padded with NULLs where no partner exists. Handy for reconciliations (orders vs payments, stock vs movements).</p>', '<p>FULL JOIN = LEFT JOIN ∪ RIGHT JOIN: mọi dòng của cả hai bảng xuất hiện ít nhất một lần, chỗ thiếu cặp được điền NULL. Tiện cho đối soát (đơn vs thanh toán, tồn kho vs nhật ký kho).</p>'],
    tn: [tn('FULL OUTER JOIN', 'nối ngoài hai phía')],
  }),
]);
