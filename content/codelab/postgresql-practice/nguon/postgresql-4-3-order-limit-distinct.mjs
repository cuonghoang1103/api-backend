/**
 * PostgreSQL · 4.3 — ORDER BY, LIMIT/OFFSET & DISTINCT (ON). Bảng note + CT Shop mini (viết lại 01/11/2026 theo dữ liệu
 * lab; giữ tiêu đề 3 đề cũ). Kiểm có thứ tự khi đề yêu cầu ORDER BY; sắp theo số/thời gian/mã — không theo chữ có dấu.
 */
import { mod, pg, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { O_NOTE } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-4-3-order-limit-distinct', '4.3 ORDER BY, LIMIT/OFFSET & DISTINCT ON', [
  pg({
    ...O_NOTE, t: 'Distinct tags, unknown last', k: 'EASY', p: 5, kn: ['DISTINCT', 'NULLS LAST'], tag: ['select', 'distinct', 'notes'],
    en: '<p>The tag filter of the Notes app lists each tag once, alphabetically, with the "no tag" entry (NULL) at the end. Return the single column <code>tag</code>.</p>',
    vi: '<p>Bộ lọc thẻ của app Notes liệt kê mỗi thẻ một lần, theo bảng chữ cái, mục "không thẻ" (NULL) ở cuối. Trả về một cột <code>tag</code>.</p>',
    yc: [['<code>SELECT DISTINCT tag</code>.', '<code>SELECT DISTINCT tag</code>.'], ['<code>ORDER BY tag NULLS LAST</code> — make the NULL position explicit.', '<code>ORDER BY tag NULLS LAST</code> — nói rõ vị trí của NULL.']],
    giai: `SELECT DISTINCT tag
FROM note
ORDER BY tag NULLS LAST;     -- ascending order already puts NULL last in PostgreSQL; say it anyway`,
    kiem: [
      kq(['date, ops, sql, NULL', 'date, ops, sql, NULL'], T),
      kqAn(['A new tag slots in alphabetically', 'Thẻ mới chen vào đúng thứ tự chữ cái'], "INSERT INTO note (title, author, tag, created_at) VALUES ('Docker basics', 'Lan', 'devops', '2026-04-20')", T),
      ma(['Uses DISTINCT', 'Dùng DISTINCT'], '\\bDISTINCT\\b'),
    ],
    sai: ['SELECT tag FROM note ORDER BY tag NULLS LAST', 'SELECT DISTINCT tag FROM note ORDER BY tag NULLS FIRST'],
    gy: [['DISTINCT removes duplicate rows of the result.', 'DISTINCT bỏ các dòng trùng của kết quả.'], ['PostgreSQL sorts NULL as larger than any value: last in ASC, first in DESC.', 'PostgreSQL coi NULL lớn hơn mọi giá trị: cuối khi ASC, đầu khi DESC.']],
    lhg: [['Forgetting DISTINCT — sql appears three times.', 'Quên DISTINCT — sql xuất hiện ba lần.'], ['Assuming NULLs sort first like in SQL Server — in PostgreSQL they come last in ascending order.', 'Cho rằng NULL đứng đầu như SQL Server — trong PostgreSQL chúng đứng cuối khi tăng dần.']],
    gt: ['<p>DISTINCT collapses identical rows; NULLs count as equal for DISTINCT, so "no tag" appears once. <code>NULLS FIRST/LAST</code> overrides the default position.</p>', '<p>DISTINCT gộp các dòng giống nhau; với DISTINCT các NULL được coi là bằng nhau, nên "không thẻ" chỉ hiện một lần. <code>NULLS FIRST/LAST</code> đổi vị trí mặc định.</p>'],
    tn: [tn('DISTINCT', 'bỏ dòng trùng'), tn('NULLS LAST', 'NULL xếp cuối')],
  }),

  pg({
    t: 'The three most expensive products on sale', k: 'EASY', p: 6, kn: ['ORDER BY … DESC', 'LIMIT', 'tie-breaker'], tag: ['select', 'order-by', 'limit', 'ctshop'],
    en: '<p>The home page shows the <b>3 most expensive products that are still on sale</b> (<code>is_active</code>). Return <code>sku, name, price</code>, most expensive first. When two products cost the same, the one with the smaller <code>id</code> comes first.</p>',
    vi: '<p>Trang chủ hiện <b>3 sản phẩm đắt nhất còn đang bán</b> (<code>is_active</code>). Trả về <code>sku, name, price</code>, đắt nhất trước. Hai sản phẩm cùng giá thì <code>id</code> nhỏ hơn đứng trước.</p>',
    yc: [['Only active products.', 'Chỉ sản phẩm đang bán.'], ['Order by price descending, then id ascending.', 'Sắp giá giảm dần, rồi id tăng dần.'], ['Exactly 3 rows — <code>LIMIT 3</code> (or <code>FETCH FIRST 3 ROWS ONLY</code>).', 'Đúng 3 dòng — <code>LIMIT 3</code> (hoặc <code>FETCH FIRST 3 ROWS ONLY</code>).']],
    giai: `SELECT sku, name, price
FROM product
WHERE is_active                -- a boolean column is already a condition
ORDER BY price DESC, id        -- id breaks ties ⇒ the same order every time
LIMIT 3;`,
    kiem: [
      kq(['CT1001, CT0906, CT0805', 'CT1001, CT0906, CT0805'], T),
      kqAn(['A very expensive but INACTIVE product must not appear', 'Sản phẩm rất đắt nhưng NGỪNG BÁN không được hiện'], "INSERT INTO product (sku, name, category_id, price, is_active) VALUES ('CT1004', 'Máy tính Casio FX-880BTG', 10, 790000, false)", T),
      kqAn(['Ties on price: the smaller id first', 'Cùng giá: id nhỏ hơn trước'], "UPDATE product SET price = 705000 WHERE sku = 'CT0906'; INSERT INTO product (sku, name, category_id, price) VALUES ('CT1002', 'Máy tính Casio FX-570VN Plus', 10, 705000)", T),
    ],
    sai: ['SELECT sku, name, price FROM product ORDER BY price DESC, id LIMIT 3', 'SELECT sku, name, price FROM product WHERE is_active ORDER BY price LIMIT 3'],
    gy: [['WHERE is_active filters first, ORDER BY sorts, LIMIT cuts — in that order.', 'WHERE is_active lọc trước, ORDER BY sắp, LIMIT cắt — đúng thứ tự đó.'], ['Without the id at the end of ORDER BY, two products with the same price may swap places between runs.', 'Thiếu id ở cuối ORDER BY, hai sản phẩm cùng giá có thể đổi chỗ giữa các lần chạy.']],
    lhg: [['Forgetting the is_active filter — a discontinued product sneaks onto the home page.', 'Quên lọc is_active — sản phẩm đã ngừng bán lọt lên trang chủ.'], ['LIMIT without a complete ORDER BY — "the first 3 rows" is not defined; PostgreSQL may return different rows tomorrow.', 'LIMIT mà ORDER BY không đủ — "3 dòng đầu" không xác định; mai PostgreSQL có thể trả 3 dòng khác.']],
    gt: ['<p>PostgreSQL filters with WHERE, sorts with ORDER BY and only then applies LIMIT. Adding the primary key as the last sort key makes the order total, so paging and "top N" lists are stable.</p>', '<p>PostgreSQL lọc bằng WHERE, sắp bằng ORDER BY rồi mới áp LIMIT. Thêm khoá chính làm khoá sắp cuối cùng giúp thứ tự xác định hoàn toàn, nên phân trang và danh sách "top N" luôn ổn định.</p>'],
    tn: [TN.limit, TN.tieBreak],
  }),

  pg({
    t: 'Page 2 of the catalogue', k: 'MEDIUM', p: 8, kn: ['LIMIT', 'OFFSET', 'pagination'], tag: ['select', 'limit', 'offset', 'pagination', 'ctshop'],
    en: '<p>The catalogue lists active products from the <b>cheapest</b> up (ties: smaller <code>id</code> first), <b>4 per page</b>. Return page <b>2</b>: columns <code>id, sku, price</code>.</p>',
    vi: '<p>Trang danh mục liệt kê sản phẩm đang bán từ <b>rẻ nhất</b> trở lên (cùng giá: <code>id</code> nhỏ trước), <b>4 sản phẩm mỗi trang</b>. Trả về trang <b>2</b>: các cột <code>id, sku, price</code>.</p>',
    yc: [['Active products only, ordered by price then id.', 'Chỉ sản phẩm đang bán, sắp theo giá rồi id.'], ['Page size 4, page number 2 ⇒ skip the first page.', 'Mỗi trang 4, trang số 2 ⇒ bỏ qua trang đầu.']],
    giai: `SELECT id, sku, price
FROM product
WHERE is_active
ORDER BY price, id
LIMIT 4 OFFSET 4;          -- OFFSET = (page - 1) * page_size`,
    kiem: [
      kq(['Rows 5–8 of the sorted catalogue', 'Dòng 5–8 của danh mục đã sắp'], T),
      kqAn(['Still page 2 after two cheap products are added', 'Vẫn là trang 2 sau khi thêm hai sản phẩm rẻ'], "INSERT INTO product (sku, name, category_id, price) VALUES ('CT0702X', 'Bút dạ quang Deli', 7, 9000), ('CT1102', 'Thước thép Deli 30cm', 11, 15000)", T),
      ma(['Uses LIMIT/OFFSET (or OFFSET … FETCH)', 'Dùng LIMIT/OFFSET (hoặc OFFSET … FETCH)'], '\\b(LIMIT|FETCH)\\b'),
    ],
    sai: ['SELECT id, sku, price FROM product WHERE is_active ORDER BY price, id LIMIT 4 OFFSET 5', 'SELECT id, sku, price FROM product WHERE is_active ORDER BY price, id LIMIT 4 OFFSET 8'],
    gy: [['Page n starts after (n − 1) × 4 rows.', 'Trang n bắt đầu sau (n − 1) × 4 dòng.'], ['OFFSET counts rows to SKIP, not the row number to start at.', 'OFFSET đếm số dòng BỎ QUA, không phải số thứ tự dòng bắt đầu.']],
    lhg: [['OFFSET 5 for page 2 — off by one: page 2 starts at row 5, which means skipping 4 rows.', 'OFFSET 5 cho trang 2 — lệch một: trang 2 bắt đầu ở dòng 5, tức là bỏ qua 4 dòng.'], ['Deep pages with a big OFFSET still read and discard every skipped row — for "infinite scroll" use keyset pagination (WHERE (price, id) > (last_price, last_id)).', 'Trang sâu với OFFSET lớn vẫn phải đọc rồi bỏ mọi dòng bị bỏ qua — cuộn vô tận nên dùng phân trang theo khoá (WHERE (price, id) > (gia_cuoi, id_cuoi)).']],
    gt: ['<p><code>OFFSET 4</code> skips the first page, <code>LIMIT 4</code> keeps the next four. The tie-breaker on <code>id</code> guarantees that no product appears on two pages or on none (CT0501 and CT1101 both cost 5 000 đ).</p>', '<p><code>OFFSET 4</code> bỏ trang đầu, <code>LIMIT 4</code> giữ bốn dòng tiếp. Khoá phá hoà <code>id</code> bảo đảm không sản phẩm nào xuất hiện ở hai trang hay bị sót (CT0501 và CT1101 cùng giá 5 000 đ).</p>'],
    tn: [TN.limit, TN.tieBreak, tn('pagination', 'phân trang')],
  }),

  pg({
    t: 'Each customer\'s latest order (DISTINCT ON)', k: 'HARD', p: 12, kn: ['DISTINCT ON', 'ORDER BY decides which row wins'], tag: ['select', 'distinct-on', 'greatest-n-per-group', 'ctshop'],
    en: '<p>Customer support wants the <b>most recent order of every customer who has ordered</b>: <code>customer_id, order_id, status, created_at</code>, one row per customer, ordered by <code>customer_id</code>. If a customer placed two orders at the very same moment, keep the one with the larger order id.</p>',
    vi: '<p>Bộ phận CSKH cần <b>đơn gần nhất của mỗi khách đã từng đặt hàng</b>: <code>customer_id, order_id, status, created_at</code>, mỗi khách một dòng, sắp theo <code>customer_id</code>. Nếu một khách có hai đơn cùng thời điểm, giữ đơn có id lớn hơn.</p>',
    yc: [['Use PostgreSQL\'s <code>DISTINCT ON (customer_id)</code>.', 'Dùng <code>DISTINCT ON (customer_id)</code> của PostgreSQL.'], ['Name the order id column <code>order_id</code>.', 'Đặt tên cột id đơn là <code>order_id</code>.'], ['Result ordered by <code>customer_id</code>.', 'Kết quả sắp theo <code>customer_id</code>.']],
    giai: `SELECT DISTINCT ON (customer_id)
       customer_id, id AS order_id, status, created_at
FROM orders
ORDER BY customer_id, created_at DESC, id DESC;   -- the FIRST row of each customer_id wins`,
    kiem: [
      kq(['One row per customer: their latest order', 'Mỗi khách một dòng: đơn mới nhất'], T),
      kqAn(['New orders arrive (one ties on time) — still the latest per customer', 'Có đơn mới (một đơn trùng thời điểm) — vẫn là đơn mới nhất của mỗi khách'], "INSERT INTO orders (customer_id, status, created_at) VALUES (1, 'pending', '2026-10-20 08:00+07'), (5, 'paid', '2026-09-01 10:00+07'), (1, 'paid', '2026-10-20 08:00+07')", T),
      ma(['Uses DISTINCT ON', 'Dùng DISTINCT ON'], '\\bDISTINCT\\s+ON\\s*\\('),
    ],
    sai: ['SELECT DISTINCT ON (customer_id) customer_id, id AS order_id, status, created_at FROM orders ORDER BY customer_id, created_at', 'SELECT DISTINCT ON (customer_id) customer_id, id AS order_id, status, created_at FROM orders ORDER BY customer_id, id DESC'],
    gy: [['DISTINCT ON (customer_id) keeps the FIRST row of each customer in ORDER BY order.', 'DISTINCT ON (customer_id) giữ dòng ĐẦU TIÊN của mỗi khách theo thứ tự ORDER BY.'], ['So ORDER BY must start with customer_id, then put the "best" row first: created_at DESC, id DESC.', 'Vì vậy ORDER BY phải bắt đầu bằng customer_id, rồi đưa dòng "tốt nhất" lên đầu: created_at DESC, id DESC.']],
    lhg: [['ORDER BY customer_id, created_at (ascending) — DISTINCT ON then keeps the OLDEST order.', 'ORDER BY customer_id, created_at (tăng dần) — DISTINCT ON khi đó giữ đơn CŨ NHẤT.'], ['Sorting by id instead of time — assumes ids grow with time; imports and back-dated orders break that.', 'Sắp theo id thay vì thời điểm — ngầm cho rằng id tăng theo thời gian; nhập liệu và đơn ghi lùi ngày phá giả định đó.'], ['DISTINCT ON (customer_id) with ORDER BY created_at first — error "SELECT DISTINCT ON expressions must match initial ORDER BY expressions".', 'DISTINCT ON (customer_id) mà ORDER BY bắt đầu bằng created_at — lỗi "SELECT DISTINCT ON expressions must match initial ORDER BY expressions".']],
    gt: ['<p><code>DISTINCT ON</code> is PostgreSQL\'s shortcut for "greatest-N-per-group" with N = 1: rows are sorted, and for each distinct <code>customer_id</code> only the first is kept. The portable equivalent is <code>ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC, id DESC) = 1</code> (chapter 8).</p>', '<p><code>DISTINCT ON</code> là lối tắt của PostgreSQL cho bài "N dòng lớn nhất mỗi nhóm" với N = 1: các dòng được sắp, với mỗi <code>customer_id</code> chỉ giữ dòng đầu. Cách viết chạy mọi hệ là <code>ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC, id DESC) = 1</code> (chương 8).</p>'],
    tn: [TN.distinctOn, tn('greatest-N-per-group', 'N dòng lớn nhất mỗi nhóm')],
  }),
]);
