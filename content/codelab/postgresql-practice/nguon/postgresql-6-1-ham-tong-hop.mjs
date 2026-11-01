/** PostgreSQL · 6.1 — Hàm tổng hợp: count/sum/avg/min/max, luật NULL, count(*) vs count(col), string_agg. */
import { mod, pg, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { O_APP } from './_du-lieu.mjs';

export default mod('postgresql-6-1-ham-tong-hop', '6.1 Aggregate functions: many rows into one number', [
  pg({
    ...O_APP, t: 'The five aggregates in one row', k: 'EASY', p: 6, kn: ['count(*)', 'count(col)', 'count(DISTINCT)', 'sum/avg/min/max'], tag: ['aggregate'],
    en: '<p>One summary row over all notes: <code>total_notes</code> (rows), <code>notes_with_views</code> (views known), <code>authors</code> (distinct user_id), <code>total_views</code>, <code>avg_views</code> (rounded to 1 decimal), <code>min_views</code>, <code>max_views</code>.</p>',
    vi: '<p>Một dòng tóm tắt trên mọi ghi chú: <code>total_notes</code> (số dòng), <code>notes_with_views</code> (đã biết views), <code>authors</code> (số user_id khác nhau), <code>total_views</code>, <code>avg_views</code> (làm tròn 1 chữ số), <code>min_views</code>, <code>max_views</code>.</p>',
    yc: [['No GROUP BY: the whole table is one group.', 'Không GROUP BY: cả bảng là một nhóm.'], ['Columns in exactly that order.', 'Cột đúng thứ tự đó.']],
    giai: `SELECT count(*)                AS total_notes,       -- rows
       count(views)            AS notes_with_views,  -- non-NULL views only
       count(DISTINCT user_id) AS authors,           -- NULL user_id is not counted
       sum(views)              AS total_views,
       round(avg(views), 1)    AS avg_views,         -- avg ignores NULLs
       min(views)              AS min_views,
       max(views)              AS max_views
FROM note;`,
    kiem: [
      kq(['7 notes, 5 with views, 3 authors', '7 ghi chú, 5 có views, 3 tác giả']),
      kqAn(['A new author with an unmeasured note', 'Tác giả mới với ghi chú chưa đo views'], "INSERT INTO note VALUES (8, 4, 'Hue food', 'life', NULL, false), (9, 4, 'Hue rain', 'life', 200, false)"),
      ma(['count(DISTINCT user_id)', 'count(DISTINCT user_id)'], 'count\\s*\\(\\s*DISTINCT\\s+user_id\\s*\\)'),
    ],
    sai: ['SELECT count(*) AS total_notes, count(*) AS notes_with_views, count(DISTINCT user_id) AS authors, sum(views) AS total_views, round(avg(views), 1) AS avg_views, min(views) AS min_views, max(views) AS max_views FROM note', 'SELECT count(*) AS total_notes, count(views) AS notes_with_views, count(user_id) AS authors, sum(views) AS total_views, round(avg(views), 1) AS avg_views, min(views) AS min_views, max(views) AS max_views FROM note'],
    gy: [['count(*) counts rows; count(col) counts non-NULL values of col.', 'count(*) đếm dòng; count(cột) đếm giá trị khác NULL của cột.'], ['Every aggregate except count(*) skips NULLs.', 'Mọi hàm tổng hợp trừ count(*) đều bỏ qua NULL.']],
    lhg: [['count(*) for "notes with views" — counts the unmeasured ones too.', 'count(*) cho "ghi chú có views" — đếm cả ghi chú chưa đo.'], ['count(user_id) for authors — counts notes, not distinct authors.', 'count(user_id) cho số tác giả — đếm ghi chú, không đếm tác giả khác nhau.']],
    gt: ['<p>Aggregates collapse all rows into one. NULL is "unknown", so sum/avg/min/max/count(col) ignore it; only count(*) counts rows regardless of content.</p>', '<p>Hàm tổng hợp gộp mọi dòng thành một. NULL là "chưa biết" nên sum/avg/min/max/count(cột) bỏ qua nó; chỉ count(*) đếm dòng bất kể nội dung.</p>'],
    tn: [tn('aggregate function', 'hàm tổng hợp')],
  }),

  pg({
    ...O_APP, t: 'Average views: ignore the unknown, or count it as zero?', k: 'MEDIUM', p: 6, kn: ['avg and NULL', 'COALESCE inside an aggregate'], tag: ['aggregate', 'null'],
    en: '<p>Two people quote two different "average views". Return one row with both: <code>avg_known</code> = average over notes whose views are known, and <code>avg_all</code> = average over <b>all</b> notes counting unknown views as 0. Round both to 1 decimal.</p>',
    vi: '<p>Hai người đưa ra hai "lượt xem trung bình" khác nhau. Trả về một dòng có cả hai: <code>avg_known</code> = trung bình trên các ghi chú đã biết views, và <code>avg_all</code> = trung bình trên <b>mọi</b> ghi chú, views chưa biết tính là 0. Làm tròn cả hai tới 1 chữ số.</p>',
    yc: [['<code>avg(views)</code> skips NULLs.', '<code>avg(views)</code> bỏ qua NULL.'], ['<code>avg(COALESCE(views, 0))</code> counts them as 0.', '<code>avg(COALESCE(views, 0))</code> tính chúng là 0.']],
    giai: `SELECT round(avg(views), 1)              AS avg_known,   -- 297 / 5
       round(avg(COALESCE(views, 0)), 1) AS avg_all      -- 297 / 7
FROM note;`,
    kiem: [
      kq(['59.4 and 42.4', '59.4 và 42.4']),
      kqAn(['With more unmeasured notes', 'Khi có thêm ghi chú chưa đo'], "INSERT INTO note VALUES (8, 4, 'a', NULL, NULL, false), (9, 4, 'b', NULL, 10, false)"),
      ma(['COALESCE inside avg', 'COALESCE bên trong avg'], 'avg\\s*\\(\\s*COALESCE'),
    ],
    sai: ['SELECT round(avg(views), 1) AS avg_known, round(COALESCE(avg(views), 0), 1) AS avg_all FROM note', 'SELECT round(avg(views), 1) AS avg_known, round(sum(views) / count(*), 1) AS avg_all FROM note'],
    gy: [['Decide per row (inside the aggregate) what a NULL means.', 'Quyết định NULL nghĩa là gì ở từng dòng (bên trong hàm tổng hợp).'], ['sum(int) / count(*) is integer division.', 'sum(int) / count(*) là chia nguyên.']],
    lhg: [['<code>COALESCE(avg(views), 0)</code> — the COALESCE is outside, so NULL rows are still skipped.', '<code>COALESCE(avg(views), 0)</code> — COALESCE nằm ngoài nên dòng NULL vẫn bị bỏ qua.'], ['<code>sum(views) / count(*)</code> — bigint ÷ bigint drops the decimals (42 instead of 42.4).', '<code>sum(views) / count(*)</code> — bigint ÷ bigint mất phần lẻ (42 thay vì 42.4).']],
    gt: ['<p>Neither average is "wrong"; they answer different questions. What matters is choosing on purpose: NULL means unknown, and avg() excludes unknowns unless you convert them first.</p>', '<p>Không trung bình nào "sai"; chúng trả lời hai câu hỏi khác nhau. Điều quan trọng là chọn có chủ ý: NULL là chưa biết, và avg() loại cái chưa biết trừ khi bạn đổi chúng trước.</p>'],
    tn: [TN.nullT],
  }),

  pg({
    t: 'Shelf summary of CT Shop', k: 'MEDIUM', p: 7, kn: ['aggregates over a filtered set', 'sum of an expression'], tag: ['aggregate', 'ctshop'],
    en: '<p>One row describing the <b>active</b> products: <code>products</code> (count), <code>units</code> (total stock), <code>stock_value</code> (Σ price × stock), <code>cheapest</code>, <code>priciest</code>.</p>',
    vi: '<p>Một dòng mô tả các sản phẩm <b>đang bán</b>: <code>products</code> (số lượng), <code>units</code> (tổng tồn kho), <code>stock_value</code> (Σ giá × tồn), <code>cheapest</code>, <code>priciest</code>.</p>',
    yc: [['WHERE is_active, then aggregate.', 'WHERE is_active, rồi tổng hợp.'], ['<code>sum(price * stock)</code>, not <code>sum(price) * sum(stock)</code>.', '<code>sum(price * stock)</code>, không phải <code>sum(price) * sum(stock)</code>.']],
    giai: `SELECT count(*)             AS products,
       sum(stock)           AS units,
       sum(price * stock)   AS stock_value,      -- per row first, then add up
       min(price)           AS cheapest,
       max(price)           AS priciest
FROM product
WHERE is_active;`,
    kiem: [
      kq(['15 active products', '15 sản phẩm đang bán']),
      kqAn(['A delivery changes the value', 'Một lô hàng làm đổi giá trị'], "UPDATE product SET stock = stock + 10 WHERE sku = 'CT1001'; UPDATE product SET is_active = false WHERE sku = 'CT0906'"),
      ma(['sum of price × stock', 'sum của giá × tồn'], 'sum\\s*\\(\\s*\\w*\\.?price\\s*\\*\\s*\\w*\\.?stock\\s*\\)|sum\\s*\\(\\s*\\w*\\.?stock\\s*\\*\\s*\\w*\\.?price\\s*\\)'),
    ],
    sai: ['SELECT count(*) AS products, sum(stock) AS units, sum(price) * sum(stock) AS stock_value, min(price) AS cheapest, max(price) AS priciest FROM product WHERE is_active', 'SELECT count(*) AS products, sum(stock) AS units, sum(price * stock) AS stock_value, min(price) AS cheapest, max(price) AS priciest FROM product'],
    gy: [['The expression inside sum() is computed per row.', 'Biểu thức trong sum() được tính cho từng dòng.'], ['Filter first with WHERE.', 'Lọc trước bằng WHERE.']],
    lhg: [['<code>sum(price) * sum(stock)</code> — multiplies two totals, a meaningless huge number.', '<code>sum(price) * sum(stock)</code> — nhân hai tổng, ra con số khổng lồ vô nghĩa.'], ['Forgetting is_active — the discontinued calculator counts as stock.', 'Quên is_active — máy tính ngừng bán bị tính vào tồn kho.']],
    gt: ['<p>Aggregates accept any expression: <code>sum(price * stock)</code> multiplies on each row and then adds. WHERE removes rows before the aggregation sees them.</p>', '<p>Hàm tổng hợp nhận mọi biểu thức: <code>sum(price * stock)</code> nhân trên từng dòng rồi mới cộng. WHERE loại dòng trước khi hàm tổng hợp thấy chúng.</p>'],
    tn: [tn('sum(expression)', 'tổng của biểu thức')],
  }),

  pg({
    t: 'One-line order summary with string_agg', k: 'HARD', p: 10, kn: ['string_agg … ORDER BY', 'aggregates over a join'], tag: ['aggregate', 'string_agg', 'ctshop'],
    en: '<p>The order list shows, for <b>order 1</b>, one row: <code>order_id</code>, <code>lines</code>, <code>items</code> (Σ qty), <code>total</code> (Σ qty × unit_price) and <code>skus</code> — the SKUs joined by <code>", "</code> in alphabetical order.</p>',
    vi: '<p>Danh sách đơn hiển thị, cho <b>đơn 1</b>, một dòng: <code>order_id</code>, <code>lines</code>, <code>items</code> (Σ qty), <code>total</code> (Σ qty × unit_price) và <code>skus</code> — các SKU nối bằng <code>", "</code> theo thứ tự chữ cái.</p>',
    yc: [['<code>string_agg(p.sku, \', \' ORDER BY p.sku)</code> — the ORDER BY goes inside the aggregate.', '<code>string_agg(p.sku, \', \' ORDER BY p.sku)</code> — ORDER BY đặt bên trong hàm tổng hợp.'], ['Filter order 1 with WHERE; <code>order_id</code> can be the literal or <code>min(oi.order_id)</code>, or group by it.', 'Lọc đơn 1 bằng WHERE; <code>order_id</code> có thể là hằng, <code>min(oi.order_id)</code>, hoặc gom nhóm theo nó.']],
    giai: `SELECT oi.order_id,
       count(*)                                  AS lines,
       sum(oi.qty)                               AS items,
       sum(oi.qty * oi.unit_price)               AS total,
       string_agg(p.sku, ', ' ORDER BY p.sku)    AS skus     -- deterministic text: sorted inside the aggregate
FROM order_item oi
JOIN product p ON p.id = oi.product_id
WHERE oi.order_id = 1
GROUP BY oi.order_id;`,
    kiem: [
      kq(['3 lines, 9 items, 134 000 đ, CT0501, CT0801, CT1201', '3 dòng, 9 món, 134 000 đ, CT0501, CT0801, CT1201']),
      kqAn(['A fourth line is added', 'Thêm dòng thứ tư'], 'INSERT INTO order_item VALUES (1, 4, 2, 28000)'),
      ma(['string_agg with ORDER BY', 'string_agg có ORDER BY'], 'string_agg\\s*\\([^)]*ORDER\\s+BY'),
    ],
    sai: ["SELECT oi.order_id, count(*) AS lines, sum(oi.qty) AS items, sum(oi.qty * oi.unit_price) AS total, string_agg(p.sku, ', ') AS skus FROM order_item oi JOIN product p ON p.id = oi.product_id WHERE oi.order_id = 1 GROUP BY oi.order_id", "SELECT oi.order_id, count(*) AS lines, count(*) AS items, sum(oi.qty * oi.unit_price) AS total, string_agg(p.sku, ', ' ORDER BY p.sku) AS skus FROM order_item oi JOIN product p ON p.id = oi.product_id WHERE oi.order_id = 1 GROUP BY oi.order_id"],
    gy: [['string_agg(value, separator ORDER BY …) concatenates the values of the group.', 'string_agg(giá trị, dấu nối ORDER BY …) nối các giá trị trong nhóm.'], ['items = sum(qty), lines = count(*).', 'items = sum(qty), lines = count(*).']],
    lhg: [['string_agg without ORDER BY: the order follows the plan and can change between runs.', 'string_agg không ORDER BY: thứ tự theo kế hoạch chạy và có thể đổi giữa các lần.'], ['count(*) for items — counts lines, not units.', 'count(*) cho items — đếm dòng, không đếm số món.']],
    gt: ['<p>Ordered-set behaviour inside aggregates (<code>ORDER BY</code> in string_agg, array_agg, jsonb_agg) makes text output deterministic. The hidden check adds a line whose SKU sorts in the middle.</p>', '<p>ORDER BY bên trong hàm tổng hợp (string_agg, array_agg, jsonb_agg) làm chuỗi kết quả xác định. Kiểm ẩn thêm một dòng có SKU nằm giữa thứ tự.</p>'],
    tn: [tn('string_agg', 'nối chuỗi trong nhóm')],
  }),
]);
