/** PostgreSQL · 5.3 — Join nhiều bảng & self-join. */
import { mod, pg, kq, kqAn, ma, tn, TN } from './_chung.mjs';
import { O_APP } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-5-3-multi-self-join', '5.3 Joining many tables & the self-join', [
  pg({
    ...O_APP, t: 'Employee and manager: a self-join', k: 'EASY', p: 6, kn: ['self-join', 'two aliases of one table', 'LEFT JOIN for the root'], tag: ['join', 'self-join'],
    en: '<p>Return <code>employee, manager</code> (names) for every employee, ordered by employee id. The boss has no manager and must still appear, with manager NULL.</p>',
    vi: '<p>Trả về <code>employee, manager</code> (tên) cho mọi nhân viên, sắp theo id nhân viên. Sếp không có quản lý vẫn phải xuất hiện, với manager NULL.</p>',
    yc: [['<code>FROM employee e LEFT JOIN employee m ON m.id = e.manager_id</code>.', '<code>FROM employee e LEFT JOIN employee m ON m.id = e.manager_id</code>.'], ['Columns aliased <code>employee</code> and <code>manager</code>.', 'Cột đặt bí danh <code>employee</code> và <code>manager</code>.']],
    giai: `SELECT e.name AS employee, m.name AS manager
FROM employee e
LEFT JOIN employee m ON m.id = e.manager_id    -- the same table, playing the role of "manager"
ORDER BY e.id;`,
    kiem: [
      kq(['Six employees, An without manager', 'Sáu nhân viên, An không có quản lý'], T),
      kqAn(['A new hire under Chi', 'Nhân viên mới dưới quyền Chi'], "INSERT INTO employee VALUES (7, 'Hanh', 3)", T),
      ma(['employee joined to itself', 'employee nối với chính nó'], '\\bemployee\\b[\\s\\S]*\\bJOIN\\s+employee\\b'),
    ],
    sai: ['SELECT e.name AS employee, m.name AS manager FROM employee e JOIN employee m ON m.id = e.manager_id ORDER BY e.id', 'SELECT e.name AS employee, m.name AS manager FROM employee e LEFT JOIN employee m ON e.id = m.manager_id ORDER BY e.id'],
    gy: [['Give the table two aliases: e (the employee) and m (the manager).', 'Đặt hai bí danh cho bảng: e (nhân viên) và m (quản lý).'], ['The employee row points at its manager: <code>m.id = e.manager_id</code>.', 'Dòng nhân viên trỏ tới quản lý: <code>m.id = e.manager_id</code>.']],
    lhg: [['INNER self-join: the boss disappears.', 'Self-join INNER: sếp biến mất.'], ['Reversing the condition (<code>e.id = m.manager_id</code>) lists subordinates instead of managers, with duplicates.', 'Đảo điều kiện (<code>e.id = m.manager_id</code>) ra danh sách cấp dưới thay vì quản lý, còn bị lặp.']],
    gt: ['<p>A self-join treats one table as two: the alias decides the role. LEFT keeps the root of the hierarchy. For any depth of hierarchy, chapter 7.4 uses a recursive CTE.</p>', '<p>Self-join coi một bảng như hai: bí danh quyết định vai trò. LEFT giữ gốc của cây. Với cây sâu bất kỳ, bài 7.4 dùng CTE đệ quy.</p>'],
    tn: [tn('self-join', 'tự nối')],
  }),

  pg({
    ...O_APP, t: 'Comments with the note, its author and the commenter', k: 'MEDIUM', p: 8, kn: ['chain of joins', 'one table joined twice'], tag: ['join'],
    en: '<p>Return <code>body, title, note_author, commenter</code> for every comment, ordered by comment id: the note it belongs to, who wrote the note and who wrote the comment.</p>',
    vi: '<p>Trả về <code>body, title, note_author, commenter</code> cho mọi bình luận, sắp theo id bình luận: ghi chú chứa nó, ai viết ghi chú và ai viết bình luận.</p>',
    yc: [['comment → note → app_user (author) and comment → app_user (commenter).', 'comment → note → app_user (tác giả) và comment → app_user (người bình luận).'], ['app_user appears twice with two aliases.', 'app_user xuất hiện hai lần với hai bí danh.']],
    giai: `SELECT c.body, n.title, au.name AS note_author, cu.name AS commenter
FROM comment c
JOIN note n      ON n.id  = c.note_id
JOIN app_user au ON au.id = n.user_id     -- who wrote the note
JOIN app_user cu ON cu.id = c.user_id     -- who wrote the comment
ORDER BY c.id;`,
    kiem: [
      kq(['Six comments', 'Sáu bình luận'], T),
      kqAn(['Hoa comments on her own note', 'Hoa bình luận ghi chú của chính mình'], "INSERT INTO note VALUES (8, 4, 'Hue food', 'life', 3, false); INSERT INTO comment VALUES (7, 8, 4, 'Bún bò!')", T),
      ma(['Two aliases of app_user', 'Hai bí danh của app_user'], 'app_user\\s+\\w+[\\s\\S]*app_user\\s+\\w+'),
    ],
    sai: ['SELECT c.body, n.title, u.name AS note_author, u.name AS commenter FROM comment c JOIN note n ON n.id = c.note_id JOIN app_user u ON u.id = n.user_id ORDER BY c.id', 'SELECT c.body, n.title, au.name AS note_author, cu.name AS commenter FROM comment c JOIN note n ON n.id = c.note_id JOIN app_user au ON au.id = c.user_id JOIN app_user cu ON cu.id = n.user_id ORDER BY c.id'],
    gy: [['Join one table at a time; each ON connects the new table to one already in the query.', 'Nối từng bảng một; mỗi ON nối bảng mới với một bảng đã có trong truy vấn.'], ['Two roles of one table = two aliases.', 'Hai vai của một bảng = hai bí danh.']],
    lhg: [['Joining app_user once and printing it twice — the commenter is shown as the note author.', 'Nối app_user một lần rồi in hai lần — người bình luận bị hiện thành tác giả.'], ['Swapping the two ON conditions — author and commenter columns are exchanged.', 'Đổi chỗ hai điều kiện ON — cột tác giả và người bình luận bị tráo.']],
    gt: ['<p>Long joins are easy to read when each line adds one table along one foreign key. The same table can appear many times, once per role.</p>', '<p>Phép nối dài dễ đọc khi mỗi dòng thêm một bảng theo một khoá ngoại. Một bảng có thể xuất hiện nhiều lần, mỗi lần một vai.</p>'],
    tn: [TN.join],
  }),

  pg({
    t: 'Category with its parent name (CT Shop tree)', k: 'MEDIUM', p: 6, kn: ['self-join on category', 'LEFT JOIN for roots'], tag: ['join', 'self-join', 'ctshop'],
    en: '<p>For every category return <code>id, name, parent</code> where <code>parent</code> is the name of its parent category (NULL for the four roots). Order by id.</p>',
    vi: '<p>Với mọi danh mục trả về <code>id, name, parent</code> trong đó <code>parent</code> là tên danh mục cha (NULL với bốn danh mục gốc). Sắp theo id.</p>',
    yc: [['<code>category c LEFT JOIN category p ON p.id = c.parent_id</code>.', '<code>category c LEFT JOIN category p ON p.id = c.parent_id</code>.'], ['Twelve rows.', 'Mười hai dòng.']],
    giai: `SELECT c.id, c.name, p.name AS parent
FROM category c
LEFT JOIN category p ON p.id = c.parent_id
ORDER BY c.id;`,
    kiem: [
      kq(['Twelve categories, roots with NULL parent', 'Mười hai danh mục, gốc có parent NULL'], T),
      kqAn(['A third level appears', 'Xuất hiện tầng thứ ba'], "INSERT INTO category (name, parent_id) VALUES ('Bút bi gel', 5)", T),
      ma(['category joined to itself', 'category nối với chính nó'], '\\bcategory\\b[\\s\\S]*JOIN\\s+category\\b'),
    ],
    sai: ['SELECT c.id, c.name, p.name AS parent FROM category c JOIN category p ON p.id = c.parent_id ORDER BY c.id'],
    gy: [['Same pattern as employee/manager.', 'Cùng mẫu với nhân viên/quản lý.'], ['Roots have parent_id NULL — keep them with LEFT JOIN.', 'Gốc có parent_id NULL — giữ chúng bằng LEFT JOIN.']],
    lhg: [['INNER JOIN: the four root categories vanish.', 'INNER JOIN: bốn danh mục gốc biến mất.'], ['Joining on names instead of ids.', 'Nối theo tên thay vì id.']],
    gt: ['<p>CT Shop\'s category tree is two levels deep; one self-join reaches the parent. Lab 3 uses this exact join to roll revenue up to the four roots.</p>', '<p>Cây danh mục CT Shop sâu hai tầng; một lần tự nối là tới cha. Lab 3 dùng đúng phép nối này để gộp doanh thu lên bốn gốc.</p>'],
    tn: [tn('self-join', 'tự nối')],
  }),

  pg({
    t: 'Shipped lines with customer and category: five tables', k: 'HARD', p: 12, kn: ['five-table join', 'filter + total order'], tag: ['join', 'ctshop'],
    en: '<p>The warehouse audit needs every line of every <b>shipped</b> order: <code>order_id, full_name, sku, category, qty</code> (category = the product\'s category name). Order by order_id, then sku.</p>',
    vi: '<p>Kiểm kho cần mọi dòng của mọi đơn <b>đã giao</b>: <code>order_id, full_name, sku, category, qty</code> (category = tên danh mục của sản phẩm). Sắp theo order_id rồi sku.</p>',
    yc: [['orders → customer, orders → order_item → product → category.', 'orders → customer, orders → order_item → product → category.'], ['Only <code>status = \'shipped\'</code>.', 'Chỉ <code>status = \'shipped\'</code>.']],
    giai: `SELECT o.id AS order_id, cu.full_name, p.sku, ca.name AS category, oi.qty
FROM orders o
JOIN customer   cu ON cu.id = o.customer_id
JOIN order_item oi ON oi.order_id = o.id
JOIN product    p  ON p.id = oi.product_id
JOIN category   ca ON ca.id = p.category_id
WHERE o.status = 'shipped'
ORDER BY o.id, p.sku;`,
    kiem: [
      kq(['Lines of orders 1, 3, 5, 9, 10, 13', 'Dòng của các đơn 1, 3, 5, 9, 10, 13'], T),
      kqAn(['Order 2 ships', 'Đơn 2 được giao'], "UPDATE orders SET status = 'shipped' WHERE id = 2", T),
      ma(['Joins category', 'Có nối category'], '\\bJOIN\\s+category\\b'),
    ],
    sai: ["SELECT o.id AS order_id, cu.full_name, p.sku, ca.name AS category, oi.qty FROM orders o JOIN customer cu ON cu.id = o.customer_id JOIN order_item oi ON oi.order_id = o.id JOIN product p ON p.id = oi.product_id JOIN category ca ON ca.id = p.category_id ORDER BY o.id, p.sku", "SELECT o.id AS order_id, cu.full_name, p.sku, ca.name AS category, oi.qty FROM orders o JOIN customer cu ON cu.id = o.customer_id JOIN order_item oi ON oi.order_id = o.id JOIN product p ON p.id = oi.product_id JOIN category ca ON ca.id = p.id WHERE o.status = 'shipped' ORDER BY o.id, p.sku"],
    gy: [['Write the FROM … JOIN chain first, one line per table.', 'Viết chuỗi FROM … JOIN trước, mỗi bảng một dòng.'], ['Check every ON uses a foreign key → primary key pair.', 'Soát mọi ON đều là cặp khoá ngoại → khoá chính.']],
    lhg: [['<code>ca.id = p.id</code>: category chosen by product id — most lines vanish or get a random category.', '<code>ca.id = p.id</code>: chọn danh mục theo id sản phẩm — đa số dòng biến mất hoặc nhận danh mục bừa.'], ['Forgetting the status filter — pending and cancelled orders are "audited" too.', 'Quên lọc trạng thái — đơn pending và cancelled cũng bị "kiểm".']],
    gt: ['<p>Five tables, four joins, each following one foreign key. Because every key is unique on the referenced side, each order line produces exactly one result row — no fan-out.</p>', '<p>Năm bảng, bốn phép nối, mỗi phép theo một khoá ngoại. Vì mọi khoá đều duy nhất ở phía được trỏ tới, mỗi dòng đơn cho đúng một dòng kết quả — không bị nhân dòng.</p>'],
    tn: [TN.join, tn('fan-out', 'nhân dòng khi nối 1–nhiều')],
  }),
]);
