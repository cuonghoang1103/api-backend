/**
 * PostgreSQL · 4.3 — ORDER BY, LIMIT/OFFSET & DISTINCT ON. Loại 'sql-pg' (PostgreSQL nguyên bản).
 * Kiểm có thứ tự (thuTu) khi đề yêu cầu ORDER BY. Sắp theo số/thời gian/id — không theo chữ có dấu (collation).
 * CSDL: CT Shop thu gọn. Bài giảng: postgresql-4-3-order-limit-distinct.
 */
import { doiDau, KHOA, sqlPg, kq, kqAn, ma, TN } from './_chung.mjs';

const THU_TU = { thuTu: true };

export default doiDau({
  slug: 'postgresql-4-3-order-limit-distinct',
  ten: '4.3 ORDER BY, LIMIT/OFFSET & DISTINCT ON',
  khoa: KHOA,
  baiHoc: 'postgresql-4-3-order-limit-distinct',
  de: [
    sqlPg({
      tieuDe: 'The three most expensive products on sale',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['ORDER BY … DESC', 'LIMIT', 'tie-breaker'], the: ['select', 'order-by', 'limit', 'ctshop'],
      moTa: {
        en: '<p>The home page shows the <b>3 most expensive products that are still on sale</b> (<code>is_active</code>). Return <code>sku, name, price</code>, most expensive first. When two products cost the same, the one with the smaller <code>id</code> comes first.</p>',
        vi: '<p>Trang chủ hiện <b>3 sản phẩm đắt nhất còn đang bán</b> (<code>is_active</code>). Trả về <code>sku, name, price</code>, đắt nhất trước. Hai sản phẩm cùng giá thì <code>id</code> nhỏ hơn đứng trước.</p>',
      },
      yeuCau: {
        en: ['Only active products.', 'Order by price descending, then id ascending.', 'Exactly 3 rows — PostgreSQL: <code>LIMIT 3</code> (or <code>FETCH FIRST 3 ROWS ONLY</code>).'],
        vi: ['Chỉ sản phẩm đang bán.', 'Sắp giá giảm dần, rồi id tăng dần.', 'Đúng 3 dòng — PostgreSQL: <code>LIMIT 3</code> (hoặc <code>FETCH FIRST 3 ROWS ONLY</code>).'],
      },
      giai: `SELECT sku, name, price
FROM product
WHERE is_active                -- a boolean column is already a condition
ORDER BY price DESC, id        -- id breaks ties ⇒ the same order every time
LIMIT 3;`,
      kiem: [
        kq('Top 3 active products, in order', THU_TU),
        kqAn('A very expensive but INACTIVE product must not appear', "INSERT INTO product (sku, name, category_id, price, is_active) VALUES ('LT-PRO', 'Laptop trưng bày', 3, 99000000, false)", THU_TU),
        kqAn('Ties on price: the smaller id first', "INSERT INTO product (sku, name, category_id, price) VALUES ('LT-TIE', 'Laptop cùng giá', 3, 24500000); UPDATE product SET price = 24500000 WHERE sku = 'LT-AIR'", THU_TU),
      ],
      saiMau: ['SELECT sku, name, price FROM product ORDER BY price DESC, id LIMIT 3', 'SELECT sku, name, price FROM product WHERE is_active ORDER BY price LIMIT 3'],
      goiY: ['WHERE is_active filters first, ORDER BY sorts, LIMIT cuts — in that order.', 'Without the id at the end of ORDER BY, two products with the same price may swap places between runs.'],
      loiHayGap: [
        { en: 'Forgetting the is_active filter — a hidden product sneaks onto the home page.', vi: 'Quên lọc is_active — sản phẩm đã ẩn lọt lên trang chủ.' },
        { en: 'LIMIT without a complete ORDER BY — "the first 3 rows" is not defined; PostgreSQL may return different rows tomorrow.', vi: 'LIMIT mà ORDER BY không đủ — "3 dòng đầu" không xác định; mai PostgreSQL có thể trả 3 dòng khác.' },
      ],
      giaiThich: { en: '<p>PostgreSQL filters with WHERE, sorts with ORDER BY and only then applies LIMIT. Adding the primary key as the last sort key makes the order total, so paging and "top N" lists are stable.</p>', vi: '<p>PostgreSQL lọc bằng WHERE, sắp bằng ORDER BY rồi mới áp LIMIT. Thêm khoá chính làm khoá sắp cuối cùng giúp thứ tự xác định hoàn toàn, nên phân trang và danh sách "top N" luôn ổn định.</p>' },
      thuatNgu: [TN.limit, TN.tieBreak],
    }),
    sqlPg({
      tieuDe: 'Page 2 of the catalogue',
      doKho: 'MEDIUM', phut: 8,
      khaiNiem: ['LIMIT', 'OFFSET', 'pagination'], the: ['select', 'limit', 'offset', 'pagination', 'ctshop'],
      moTa: {
        en: '<p>The catalogue lists active products from the <b>cheapest</b> up (ties: smaller <code>id</code> first), <b>4 per page</b>. Return page <b>2</b>: columns <code>id, sku, price</code>.</p>',
        vi: '<p>Trang danh mục liệt kê sản phẩm đang bán từ <b>rẻ nhất</b> trở lên (cùng giá: <code>id</code> nhỏ trước), <b>4 sản phẩm mỗi trang</b>. Trả về trang <b>2</b>: các cột <code>id, sku, price</code>.</p>',
      },
      yeuCau: {
        en: ['Active products only, ordered by price then id.', 'Page size 4, page number 2 ⇒ skip the first page.'],
        vi: ['Chỉ sản phẩm đang bán, sắp theo giá rồi id.', 'Mỗi trang 4, trang số 2 ⇒ bỏ qua trang đầu.'],
      },
      giai: `SELECT id, sku, price
FROM product
WHERE is_active
ORDER BY price, id
LIMIT 4 OFFSET 4;          -- OFFSET = (page - 1) * page_size`,
      kiem: [
        kq('Rows 5–8 of the sorted catalogue', THU_TU),
        kqAn('Still page 2 after two cheap products are added', "INSERT INTO product (sku, name, category_id, price) VALUES ('BK-A', 'Sổ tay', 8, 50000), ('BK-B', 'Bút bi', 8, 15000)", THU_TU),
        ma('Uses LIMIT/OFFSET (or OFFSET … FETCH)', '\\b(LIMIT|FETCH)\\b'),
      ],
      saiMau: ['SELECT id, sku, price FROM product WHERE is_active ORDER BY price, id LIMIT 4 OFFSET 5', 'SELECT id, sku, price FROM product WHERE is_active ORDER BY price, id LIMIT 4 OFFSET 8'],
      goiY: ['Page n starts after (n − 1) × 4 rows.', 'OFFSET counts rows to SKIP, not the row number to start at.'],
      loiHayGap: [
        { en: 'OFFSET 5 for page 2 — off by one: page 2 starts at row 5, which means skipping 4 rows.', vi: 'OFFSET 5 cho trang 2 — lệch một: trang 2 bắt đầu ở dòng 5, tức là bỏ qua 4 dòng.' },
        { en: 'Deep pages with a big OFFSET still read and discard every skipped row — for "infinite scroll" use keyset pagination (WHERE (price, id) > (last_price, last_id)).', vi: 'Trang sâu với OFFSET lớn vẫn phải đọc rồi bỏ mọi dòng bị bỏ qua — cuộn vô tận nên dùng phân trang theo khoá (WHERE (price, id) > (gia_cuoi, id_cuoi)).' },
      ],
      giaiThich: { en: '<p><code>OFFSET 4</code> skips the first page, <code>LIMIT 4</code> keeps the next four. The tie-breaker on <code>id</code> guarantees that no product appears on two pages or on none.</p>', vi: '<p><code>OFFSET 4</code> bỏ trang đầu, <code>LIMIT 4</code> giữ bốn dòng tiếp. Khoá phá hoà <code>id</code> bảo đảm không sản phẩm nào xuất hiện ở hai trang hay bị sót.</p>' },
      thuatNgu: [TN.limit, TN.tieBreak, { en: 'pagination', vi: 'phân trang' }],
    }),
    sqlPg({
      tieuDe: 'Each customer\'s latest order (DISTINCT ON)',
      doKho: 'HARD', phut: 12,
      khaiNiem: ['DISTINCT ON', 'ORDER BY decides which row wins'], the: ['select', 'distinct-on', 'greatest-n-per-group', 'ctshop'],
      moTa: {
        en: '<p>Customer support wants the <b>most recent order of every customer who has ordered</b>: <code>customer_id, order_id, status, created_at</code>, one row per customer, ordered by <code>customer_id</code>. If a customer placed two orders at the very same moment, keep the one with the larger order id.</p>',
        vi: '<p>Bộ phận CSKH cần <b>đơn gần nhất của mỗi khách đã từng đặt hàng</b>: <code>customer_id, order_id, status, created_at</code>, mỗi khách một dòng, sắp theo <code>customer_id</code>. Nếu một khách có hai đơn cùng thời điểm, giữ đơn có id lớn hơn.</p>',
      },
      yeuCau: {
        en: ['Use PostgreSQL\'s <code>DISTINCT ON (customer_id)</code>.', 'Name the order id column <code>order_id</code>.', 'Result ordered by <code>customer_id</code>.'],
        vi: ['Dùng <code>DISTINCT ON (customer_id)</code> của PostgreSQL.', 'Đặt tên cột id đơn là <code>order_id</code>.', 'Kết quả sắp theo <code>customer_id</code>.'],
      },
      giai: `SELECT DISTINCT ON (customer_id)
       customer_id, id AS order_id, status, created_at
FROM orders
ORDER BY customer_id, created_at DESC, id DESC;   -- the FIRST row of each customer_id wins`,
      kiem: [
        kq('One row per customer: their latest order', THU_TU),
        kqAn('New orders arrive (one ties on time) — still the latest per customer', "INSERT INTO orders (customer_id, status, created_at) VALUES (1, 'pending', '2026-10-20 08:00'), (5, 'paid', '2026-10-01 10:00'), (1, 'paid', '2026-10-20 08:00')", THU_TU),
        ma('Uses DISTINCT ON', '\\bDISTINCT\\s+ON\\s*\\('),
      ],
      saiMau: [
        'SELECT DISTINCT ON (customer_id) customer_id, id AS order_id, status, created_at FROM orders ORDER BY customer_id, created_at',
        'SELECT customer_id, max(id) AS order_id FROM orders GROUP BY customer_id ORDER BY customer_id',
      ],
      goiY: ['DISTINCT ON (customer_id) keeps the FIRST row of each customer in ORDER BY order.', 'So ORDER BY must start with customer_id, then put the "best" row first: created_at DESC, id DESC.'],
      loiHayGap: [
        { en: 'ORDER BY customer_id, created_at (ascending) — DISTINCT ON then keeps the OLDEST order.', vi: 'ORDER BY customer_id, created_at (tăng dần) — DISTINCT ON khi đó giữ đơn CŨ NHẤT.' },
        { en: 'max(id) per customer — assumes ids grow with time; imports and back-dated orders break that. Sort by the real timestamp.', vi: 'max(id) theo khách — ngầm cho rằng id tăng theo thời gian; nhập liệu và đơn ghi lùi ngày phá giả định đó. Hãy sắp theo thời điểm thật.' },
        { en: 'DISTINCT ON (customer_id) with ORDER BY created_at first — PostgreSQL error: "SELECT DISTINCT ON expressions must match initial ORDER BY expressions".', vi: 'DISTINCT ON (customer_id) mà ORDER BY bắt đầu bằng created_at — PostgreSQL báo lỗi "SELECT DISTINCT ON expressions must match initial ORDER BY expressions".' },
      ],
      giaiThich: { en: '<p><code>DISTINCT ON</code> is PostgreSQL\'s shortcut for "greatest-N-per-group" with N = 1: rows are sorted, and for each distinct <code>customer_id</code> only the first is kept. The portable equivalent is <code>ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC, id DESC) = 1</code> (Chapter 8).</p>', vi: '<p><code>DISTINCT ON</code> là lối tắt của PostgreSQL cho bài "N dòng lớn nhất mỗi nhóm" với N = 1: các dòng được sắp, với mỗi <code>customer_id</code> chỉ giữ dòng đầu. Cách viết chạy mọi hệ là <code>ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC, id DESC) = 1</code> (Chương 8).</p>' },
      thuatNgu: [TN.distinctOn, { en: 'greatest-N-per-group', vi: 'N dòng lớn nhất mỗi nhóm' }],
    }),
  ],
});
