-- Lab 9 · C9 — row counts of every table + two checksums + the migration history.
-- Run on the original AND on the restored copy: the two outputs must be IDENTICAL (diff prints nothing).
\pset pager off
SELECT "table", "rows" FROM (VALUES
  (1, 'category',           (SELECT count(*) FROM shop.category)),
  (2, 'customer',           (SELECT count(*) FROM shop.customer)),
  (3, 'product',            (SELECT count(*) FROM shop.product)),
  (4, 'orders',             (SELECT count(*) FROM shop.orders)),
  (5, 'order_item',         (SELECT count(*) FROM shop.order_item)),
  (6, 'payment',            (SELECT count(*) FROM shop.payment)),
  (7, 'stock_movement',     (SELECT count(*) FROM shop.stock_movement)),
  (8, 'review',             (SELECT count(*) FROM shop.review)),
  (9, '_prisma_migrations', (SELECT count(*) FROM shop._prisma_migrations)),
  (10, 'sum(stock)',        (SELECT sum(stock) FROM shop.product)),
  (11, 'sum(amount)',       (SELECT sum(amount)::bigint FROM shop.payment))
) AS t(n, "table", "rows") ORDER BY n;
