/**
 * PostgreSQL — mục "Thi cuối khoá" (MỚI, 26/10/2026, agent chua-pe): chữa TRỌN đề thực hành PE1 + PE2 của Phòng thi khoá này.
 * Đăng ký trong ./them.mjs (SAU_CH16, sau Ch17) — KHÔNG sửa postgresql.mjs.
 *
 * Luật chủ kênh (~/Documents/video-bai-giang/LUAT-VIDEO-CHUA-DE.md): mỗi đề = MỘT bài VIDEO dài; mọi phần video cùng slug bài
 * (`postgresql-pe1-chua-tron-de`, `postgresql-pe2-chua-tron-de`), ghép bằng xuat/ghep-phan.mts; video gắn sau qua
 * content/course-videos/postgresql.mjs. Mốc "Phần k" có sẵn; thời điểm (0:00…) điền vào MOC_PE1/MOC_PE2 khi bản ghép xong.
 *
 * Lời giải mẫu + expected output lấy THẲNG từ đề (content/exams/POSTGRESQL-PE*.mjs — một nguồn sự thật, import kiểu namespace).
 * Khối BAY = lời giải SAI dùng làm bẫy, SQL + output THẬT PostgreSQL 17.11 (pgcourse17), sinh từ
 * ~/Documents/video-bai-giang/src/khung/pg/that/thi-pe1.* · thi-pe2.* · thi-pe2-them.* (scratchpad gen-bay.mts). Không sửa tay khối BAY.
 * Kiểm 26/10/2026: chạy lại mọi sampleSolution của PE1 trên 17.11 (đề ghi 16.14) và cả 10 tệp PE2 (starter + lời giải) trên CT Shop
 * nạp lab3-start.sql — KHỚP từng dòng expectedOutput.
 *
 * ⇒ Agent FE: thêm bài FE1/FE2 vào CUỐI mảng `lessons` dưới cùng (giữ thứ tự PE1, PE2, FE1, FE2).
 * Không dùng template literal trong tệp này (bộ kiểm course-content-check đọc mã nguồn); mọi mã/output đi qua esc().
 */
import * as DE_PE1 from '../../exams/POSTGRESQL-PE.mjs';
import * as DE_PE2 from '../../exams/POSTGRESQL-PE2.mjs';

const L = '/courses/postgresql/learn?lessonSlug=';
const EXAM = '/exam?course=PostgreSQL&amp;kind=PE';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '&#96;');
const sql = (s) => '<pre><code class="language-sql">' + esc(s.replace(/\n+$/, '')) + '</code></pre>';
const out = (s) => '<div class="out">' + esc(s.replace(/\n+$/, '')) + '</div>';
const pick = (s, vi) => (s.includes('|||') ? s.split('|||')[vi ? 1 : 0] : s);
const bai = (slug, en, vi) => '<a href="' + L + slug + '">' + (vi ? vi : en) + '</a>';

/* ── BẪY: SQL + output THẬT PostgreSQL 17.11 (sinh tự động, không sửa tay) ── */
const BAY = {
 "pe1": {
  "BẪY Q1a": {
   "sql": "SELECT c.name AS customer, count(o.id) AS orders,\n       count(o.id) FILTER (WHERE o.status = 'paid') AS paid_orders\nFROM customer c JOIN orders o ON o.customer_id = c.id\nGROUP BY c.id, c.name ORDER BY paid_orders DESC, c.name;",
   "out": " customer | orders | paid_orders \n----------+--------+-------------\n An       |      3 |           2\n Binh     |      2 |           1\n Chi      |      1 |           1\n(3 rows)"
  },
  "BẪY Q1b": {
   "sql": "SELECT c.name AS customer, count(*) AS orders\nFROM customer c LEFT JOIN orders o ON o.customer_id = c.id\nGROUP BY c.id, c.name ORDER BY orders DESC, c.name;",
   "out": " customer | orders \n----------+--------\n An       |      3\n Binh     |      2\n Chi      |      1\n Dung     |      1\n Em       |      1\n(5 rows)"
  },
  "BẪY Q1c": {
   "sql": "SELECT c.name AS customer, count(o.id) AS orders\nFROM customer c LEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.status = 'paid'\nGROUP BY c.id, c.name ORDER BY orders DESC, c.name;",
   "out": " customer | orders \n----------+--------\n An       |      2\n Binh     |      1\n Chi      |      1\n(3 rows)"
  },
  "BẪY Q2a": {
   "sql": "SELECT c.name AS customer, count(o.id) AS orders, coalesce(sum(oi.qty * p.price), 0)::numeric(12,2) AS revenue\nFROM customer c\nLEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'paid'\nLEFT JOIN order_item oi ON oi.order_id = o.id\nLEFT JOIN product p ON p.id = oi.product_id\nGROUP BY c.id, c.name ORDER BY revenue DESC, c.name;",
   "out": " customer | orders | revenue \n----------+--------+---------\n Chi      |      2 | 2700.00\n An       |      3 | 2580.00\n Binh     |      1 |  700.00\n Dung     |      0 |    0.00\n Em       |      0 |    0.00\n(5 rows)"
  },
  "BẪY Q2b": {
   "sql": "WITH order_total AS (\n  SELECT oi.order_id, sum(oi.qty * p.price) AS total\n  FROM order_item oi JOIN product p ON p.id = oi.product_id GROUP BY oi.order_id\n)\nSELECT c.name AS customer, count(o.id) AS orders, coalesce(sum(ot.total), 0)::numeric(12,2) AS revenue\nFROM customer c\nLEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'paid'\nLEFT JOIN order_item oi ON oi.order_id = o.id\nLEFT JOIN order_total ot ON ot.order_id = o.id\nGROUP BY c.id, c.name ORDER BY revenue DESC, c.name;",
   "out": " customer | orders | revenue \n----------+--------+---------\n Chi      |      2 | 5400.00\n An       |      3 | 3660.00\n Binh     |      1 |  700.00\n Dung     |      0 |    0.00\n Em       |      0 |    0.00\n(5 rows)"
  },
  "BẪY Q2c": {
   "sql": "SELECT c.name AS customer, sum(ot.total) AS revenue\nFROM customer c\nLEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'paid'\nLEFT JOIN (SELECT oi.order_id, sum(oi.qty * p.price) AS total FROM order_item oi JOIN product p ON p.id = oi.product_id GROUP BY oi.order_id) ot ON ot.order_id = o.id\nGROUP BY c.id, c.name ORDER BY revenue DESC NULLS LAST, c.name;",
   "out": " customer | revenue \n----------+---------\n Chi      | 2700.00\n An       | 2580.00\n Binh     |  700.00\n Dung     |        \n Em       |        \n(5 rows)"
  },
  "BẪY Q3a": {
   "sql": "SELECT p.name, row_number() OVER (PARTITION BY p.category_id ORDER BY p.price DESC) AS rn\nFROM product p WHERE row_number() OVER (PARTITION BY p.category_id ORDER BY p.price DESC) <= 2;",
   "out": "ERROR:  window functions are not allowed in WHERE at character 112"
  },
  "BẪY Q3b": {
   "sql": "WITH sold AS (\n  SELECT p.category_id, p.id AS product_id, p.name, sum(oi.qty * p.price) AS revenue\n  FROM order_item oi JOIN product p ON p.id = oi.product_id JOIN orders o ON o.id = oi.order_id\n  WHERE o.status = 'paid' GROUP BY p.category_id, p.id, p.name\n)\nSELECT name, revenue,\n       row_number() OVER w AS row_number, rank() OVER w AS rank, dense_rank() OVER w AS dense_rank\nFROM sold WHERE category_id = 5\nWINDOW w AS (PARTITION BY category_id ORDER BY revenue DESC);",
   "out": "  name   | revenue | row_number | rank | dense_rank \n---------+---------+------------+------+------------\n Phone P |  700.00 |          1 |    1 |          1\n Phone Q |  700.00 |          2 |    1 |          1\n(2 rows)"
  },
  "Q3: thêm cột phá hoà": {
   "sql": "WITH sold AS (\n  SELECT p.category_id, p.id AS product_id, p.name, sum(oi.qty * p.price) AS revenue\n  FROM order_item oi JOIN product p ON p.id = oi.product_id JOIN orders o ON o.id = oi.order_id\n  WHERE o.status = 'paid' GROUP BY p.category_id, p.id, p.name\n)\nSELECT name, revenue,\n       row_number() OVER w AS row_number, rank() OVER w AS rank\nFROM sold WHERE category_id = 5\nWINDOW w AS (PARTITION BY category_id ORDER BY revenue DESC, product_id);",
   "out": "  name   | revenue | row_number | rank \n---------+---------+------------+------\n Phone P |  700.00 |          1 |    1\n Phone Q |  700.00 |          2 |    2\n(2 rows)"
  },
  "BẪY Q3c": {
   "sql": "SELECT p.name, sum(oi.qty * p.price) AS revenue\nFROM order_item oi JOIN product p ON p.id = oi.product_id\nWHERE p.category_id = 5 GROUP BY p.id, p.name ORDER BY revenue DESC;",
   "out": "  name   | revenue \n---------+---------\n Phone P | 2800.00\n Phone Q |  700.00\n(2 rows)"
  },
  "BẪY Q4a": {
   "sql": "SET statement_timeout = '2s';\nWITH RECURSIVE tree AS (\n  SELECT c.id, c.name, 1 AS depth, c.name::text AS path FROM category c WHERE c.id IN (1, 7)\n  UNION ALL\n  SELECT c.id, c.name, t.depth + 1, t.path || ' > ' || c.name FROM category c JOIN tree t ON c.parent_id = t.id\n)\nSELECT count(*) FROM tree;",
   "out": "ERROR:  canceling statement due to statement timeout"
  },
  "BẪY Q4b": {
   "sql": "WITH RECURSIVE tree AS (\n  SELECT c.id, c.name, 1 AS depth, c.name::text AS path FROM category c WHERE c.id IN (1, 7)\n  UNION\n  SELECT c.id, c.name, t.depth + 1, t.path || ' > ' || c.name FROM category c JOIN tree t ON c.parent_id = t.id\n)\nSELECT count(*) FROM tree;\nRESET statement_timeout;",
   "out": "ERROR:  canceling statement due to statement timeout"
  },
  "BẪY Q4c": {
   "sql": "WITH RECURSIVE tree AS (\n  SELECT c.id, c.name, 1 AS depth, c.name::text AS path FROM category c WHERE c.id IN (1, 7)\n  UNION ALL\n  SELECT c.id, c.name, t.depth + 1, t.path || ' > ' || c.name FROM category c JOIN tree t ON c.parent_id = t.id WHERE t.depth < 10\n)\nSELECT depth, path FROM tree WHERE path LIKE 'Promo%' ORDER BY depth;",
   "out": " depth |                                           path                                            \n-------+-------------------------------------------------------------------------------------------\n     1 | Promo\n     2 | Promo > Promo A\n     3 | Promo > Promo A > Promo B\n     4 | Promo > Promo A > Promo B > Promo\n     5 | Promo > Promo A > Promo B > Promo > Promo A\n     6 | Promo > Promo A > Promo B > Promo > Promo A > Promo B\n     7 | Promo > Promo A > Promo B > Promo > Promo A > Promo B > Promo\n     8 | Promo > Promo A > Promo B > Promo > Promo A > Promo B > Promo > Promo A\n     9 | Promo > Promo A > Promo B > Promo > Promo A > Promo B > Promo > Promo A > Promo B\n    10 | Promo > Promo A > Promo B > Promo > Promo A > Promo B > Promo > Promo A > Promo B > Promo\n(10 rows)"
  },
  "Q4: bỏ ::text": {
   "sql": "WITH RECURSIVE tree AS (\n  SELECT c.id, c.name, 1 AS depth, c.name AS path, ARRAY[c.id] AS seen FROM category c WHERE c.id IN (1, 7)\n  UNION ALL\n  SELECT c.id, c.name, t.depth + 1, t.path || ' > ' || c.name, t.seen || c.id\n  FROM category c JOIN tree t ON c.parent_id = t.id WHERE t.depth < 10 AND NOT (c.id = ANY (t.seen))\n)\nSELECT count(*) FROM tree;",
   "out": " count \n-------\n     9\n(1 row)"
  },
  "Q4: nếu cột là varchar": {
   "sql": "CREATE TEMP TABLE cat_v (id int, name varchar(40), parent_id int);\nINSERT INTO cat_v SELECT id, name, parent_id FROM category;\nWITH RECURSIVE tree AS (\n  SELECT c.id, c.name AS path FROM cat_v c WHERE c.id = 1\n  UNION ALL\n  SELECT c.id, t.path || ' > ' || c.name FROM cat_v c JOIN tree t ON c.parent_id = t.id\n)\nSELECT count(*) FROM tree;",
   "out": "ERROR:  recursive query \"tree\" column 2 has type character varying(40) in non-recursive term but type character varying overall at character 41"
  },
  "BẪY Q5a": {
   "sql": "SELECT name, props ->> 'credit' AS credit FROM customer ORDER BY credit DESC NULLS LAST, name;",
   "out": " name | credit \n------+--------\n Chi  | 90\n Binh | 300\n An   | 1500\n Dung | \n Em   | \n(5 rows)"
  },
  "BẪY Q5b": {
   "sql": "SELECT name, props ->> 'credit' AS credit, (props ->> 'credit') >= '500' AS text_compare FROM customer WHERE props ? 'credit' ORDER BY id;",
   "out": " name | credit | text_compare \n------+--------+--------------\n An   | 1500   | f\n Binh | 300    | f\n Chi  | 90     | t\n(3 rows)"
  },
  "Q5: credit = 0": {
   "sql": "SELECT p AS props,\n       coalesce((p ->> 'credit')::numeric, 0) <> 0 AS by_value,\n       jsonb_exists(p, 'credit')                  AS by_key\nFROM (VALUES ('{\"credit\": 0}'::jsonb), ('{}'::jsonb)) AS v(p);",
   "out": "     props     | by_value | by_key \n---------------+----------+--------\n {\"credit\": 0} | f        | t\n {}            | f        | f\n(2 rows)"
  },
  "BẪY Q5d": {
   "sql": "SELECT props ->> 'tier' AS tier, count(*) AS customers, sum((props ->> 'credit')::numeric) AS total_credit\nFROM customer GROUP BY 1 ORDER BY total_credit DESC NULLS LAST, tier;",
   "out": "  tier  | customers | total_credit \n--------+-----------+--------------\n gold   |         2 |         1590\n silver |         2 |          300\n        |         1 |             \n(3 rows)"
  }
 },
 "pe2": {
  "BẪY Q1a": {
   "sql": "SELECT count(*) FROM customer WHERE phone = NULL AND city IN ('Hà Nội', 'Đà Nẵng');",
   "out": " count \n-------\n     0\n(1 row)"
  },
  "BẪY Q1b": {
   "sql": "SELECT count(*) FROM customer WHERE city = 'Hà Nội' OR city = 'Đà Nẵng' AND phone IS NULL;",
   "out": " count \n-------\n    64\n(1 row)"
  },
  "Q1: hai khách": {
   "sql": "SELECT id, created_at FROM customer WHERE id IN (210, 245);",
   "out": " id  |       created_at       \n-----+------------------------\n 210 | 2025-05-05 08:00:00+07\n 245 | 2025-05-05 08:00:00+07\n(2 rows)"
  },
  "BẪY Q2a": {
   "sql": "SELECT c.id, count(o.id) AS orders FROM customer c LEFT JOIN orders o ON o.customer_id = c.id\nWHERE c.id BETWEEN 286 AND 295 AND o.created_at >= '2026-01-01' AND o.created_at < '2027-01-01'\nGROUP BY c.id ORDER BY c.id;",
   "out": " id  | orders \n-----+--------\n 286 |      4\n 287 |      2\n 288 |      6\n 289 |      2\n 290 |      7\n(5 rows)"
  },
  "BẪY Q2b": {
   "sql": "SELECT c.id, count(*) AS orders FROM customer c LEFT JOIN orders o ON o.customer_id = c.id\nWHERE c.id BETWEEN 291 AND 293 GROUP BY c.id ORDER BY c.id;",
   "out": " id  | orders \n-----+--------\n 291 |      1\n 292 |      1\n 293 |      1\n(3 rows)"
  },
  "BẪY Q2c": {
   "sql": "SET TimeZone = 'UTC';\nSELECT id, created_at FROM orders WHERE id = 1761;\nSELECT count(*) FILTER (WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01') AS orders_2026_utc FROM orders WHERE customer_id = 288;",
   "out": "  id  |       created_at       \n------+------------------------\n 1761 | 2025-12-31 20:31:00+00\n(1 row)\n\n orders_2026_utc \n-----------------\n               5\n(1 row)"
  },
  "BẪY Q3": {
   "sql": "SELECT c.city, count(*) AS paid_orders, sum(oi.qty) AS units, sum(p.amount) AS revenue\nFROM payment p JOIN orders o ON o.id = p.order_id JOIN customer c ON c.id = o.customer_id\nJOIN order_item oi ON oi.order_id = o.id\nWHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2027-01-01'\nGROUP BY c.city HAVING count(*) >= 135 ORDER BY revenue DESC;",
   "out": "   city    | paid_orders | units |   revenue    \n-----------+-------------+-------+--------------\n TP.HCM    |         394 |   787 | 317826000.00\n Cần Thơ   |         351 |   689 | 254147000.00\n Hải Phòng |         394 |   785 | 245399000.00\n Đà Nẵng   |         329 |   671 | 212853000.00\n Hà Nội    |         313 |   598 | 211646000.00\n(5 rows)"
  },
  "Q3: hai thành phố": {
   "sql": "SELECT c.city, count(*) FROM payment p JOIN orders o ON o.id = p.order_id JOIN customer c ON c.id = o.customer_id\nWHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2027-01-01' GROUP BY c.city ORDER BY 2 DESC;",
   "out": "   city    | count \n-----------+-------\n Hải Phòng |   160\n TP.HCM    |   151\n Đà Nẵng   |   138\n Cần Thơ   |   133\n Hà Nội    |   132\n(5 rows)"
  },
  "BẪY Q4": {
   "sql": "SELECT reason, count(*) AS rows, count(order_id) AS with_order FROM stock_movement GROUP BY reason ORDER BY reason;\nSELECT o.status, count(*) AS missing FROM orders o\nWHERE o.status <> 'cancelled' AND o.id NOT IN (SELECT order_id FROM stock_movement)\nGROUP BY o.status ORDER BY o.status;\nSELECT 1 NOT IN (2, NULL) AS not_in_with_null;",
   "out": " reason | rows | with_order \n--------+------+------------\n import |   48 |          0\n sale   |  381 |        381\n(2 rows)\n\n status | missing \n--------+---------\n(0 rows)\n\n not_in_with_null \n------------------\n \n(1 row)"
  },
  "BẪY Q5": {
   "sql": "SELECT attrs->>'tags' AS tags_text, attrs->'tags'->>0 AS first_tag FROM product WHERE sku = 'CT0606';\nSELECT count(*) FROM product WHERE attrs->>'tags' = 'học sinh';\nSELECT count(*) FROM product WHERE attrs @> '{\"tags\": \"học sinh\"}';",
   "out": "  tags_text   | first_tag \n--------------+-----------\n [\"học sinh\"] | học sinh\n(1 row)\n\n count \n-------\n     0\n(1 row)\n\n count \n-------\n     0\n(1 row)"
  },
  "BẪY Q6a: row_number": {
   "sql": "WITH sold AS (\n  SELECT p.category_id, p.sku, sum(oi.qty) AS units\n  FROM payment pm JOIN order_item oi ON oi.order_id = pm.order_id JOIN product p ON p.id = oi.product_id\n  WHERE pm.paid_at >= '2026-01-01' AND pm.paid_at < '2027-01-01'\n  GROUP BY p.category_id, p.sku\n)\nSELECT category_id, sku, units,\n       row_number() OVER w AS rn, rank() OVER w AS rk, dense_rank() OVER w AS drk\nFROM sold WHERE category_id IN (8, 9)\nWINDOW w AS (PARTITION BY category_id ORDER BY units DESC)\nORDER BY category_id, units DESC, sku;",
   "out": " category_id |  sku   | units | rn | rk | drk \n-------------+--------+-------+----+----+-----\n           8 | CT0803 |   102 |  1 |  1 |   1\n           8 | CT0804 |    64 |  3 |  2 |   2\n           8 | CT0805 |    64 |  2 |  2 |   2\n           8 | CT0801 |    63 |  4 |  4 |   3\n           8 | CT0802 |    52 |  5 |  5 |   4\n           8 | CT0806 |    47 |  6 |  6 |   5\n           9 | CT0901 |    85 |  1 |  1 |   1\n           9 | CT0903 |    79 |  2 |  2 |   2\n           9 | CT0904 |    69 |  4 |  3 |   3\n           9 | CT0906 |    69 |  3 |  3 |   3\n           9 | CT0902 |    68 |  5 |  5 |   4\n           9 | CT0905 |    48 |  6 |  6 |   5\n(12 rows)"
  },
  "BẪY Q6a: lọc": {
   "sql": "SELECT sku FROM product WHERE rank() OVER (ORDER BY price) <= 3;",
   "out": "ERROR:  window functions are not allowed in WHERE at character 31"
  },
  "Q6b: date_trunc": {
   "sql": "SET TimeZone = 'UTC';\nSELECT to_char(date_trunc('month', paid_at), 'YYYY-MM') AS month, sum(amount) FROM payment\nWHERE paid_at >= '2026-01-01' AND paid_at < '2026-03-01' GROUP BY 1 ORDER BY 1;",
   "out": "  month  |     sum     \n---------+-------------\n 2026-01 | 48749000.00\n 2026-02 | 32889000.00\n(2 rows)"
  },
  "BẪY Q7": {
   "sql": "BEGIN;\nINSERT INTO category (name, parent_id) SELECT 'Máy tính khoa học', id FROM category WHERE name = 'Máy tính cầm tay';\nINSERT INTO category (name, parent_id) SELECT 'Casio fx', id FROM category WHERE name = 'Máy tính khoa học';\nUPDATE product SET category_id = (SELECT id FROM category WHERE name = 'Casio fx') WHERE sku IN ('CT1001', 'CT1002', 'CT1004');\nUPDATE product SET category_id = (SELECT id FROM category WHERE name = 'Máy tính khoa học') WHERE sku = 'CT1003';\nSELECT coalesce(parent.name, c.name) AS root, count(p.id) AS products\nFROM product p JOIN category c ON c.id = p.category_id LEFT JOIN category parent ON parent.id = c.parent_id\nGROUP BY 1 ORDER BY 1;\nROLLBACK;",
   "out": "       root        | products \n-------------------+----------\n Bút & mực         |       18\n Dụng cụ học tập   |        8\n Máy tính cầm tay  |        1\n Máy tính khoa học |        3\n Sách & tài liệu   |        6\n Vở & giấy         |       12\n(6 rows)"
  },
  "BẪY Q8: ON CONFLICT DO NOTHING": {
   "sql": "BEGIN;\nCREATE TABLE cart_item (customer_id bigint NOT NULL REFERENCES customer(id), product_id bigint NOT NULL REFERENCES product(id),\n  qty int NOT NULL DEFAULT 1 CHECK (qty BETWEEN 1 AND 20), PRIMARY KEY (customer_id, product_id));\nINSERT INTO cart_item VALUES (7, 34, 1) ON CONFLICT DO NOTHING RETURNING product_id, qty;\nINSERT INTO cart_item VALUES (7, 34, 2) ON CONFLICT DO NOTHING RETURNING product_id, qty;",
   "out": " product_id | qty \n------------+-----\n         34 |   1\n(1 row)\n\n product_id | qty \n------------+-----\n(0 rows)"
  },
  "BẪY Q8: không SAVEPOINT": {
   "sql": "INSERT INTO cart_item VALUES (7, 12, 25);\nSELECT count(*) FROM cart_item;\nROLLBACK;",
   "out": "ERROR:  new row for relation \"cart_item\" violates check constraint \"cart_item_qty_check\"\nERROR:  current transaction is aborted, commands ignored until end of transaction block"
  },
  "BẪY Q8: DO UPDATE": {
   "sql": "BEGIN;\nCREATE TABLE cart_item (customer_id bigint, product_id bigint, qty int, PRIMARY KEY (customer_id, product_id));\nINSERT INTO cart_item VALUES (7, 34, 1);\nINSERT INTO cart_item VALUES (7, 34, 2) ON CONFLICT (customer_id, product_id) DO UPDATE SET qty = qty + EXCLUDED.qty;\nROLLBACK;",
   "out": "ERROR:  column reference \"qty\" is ambiguous at character 99"
  },
  "BẪY Q9: AFTER": {
   "sql": "BEGIN;\nCREATE FUNCTION trim_after() RETURNS trigger LANGUAGE plpgsql AS $ BEGIN NEW.body := nullif(btrim(NEW.body), ''); RETURN NEW; END; $;\nCREATE TRIGGER trim_after AFTER INSERT ON review FOR EACH ROW EXECUTE FUNCTION trim_after();\nINSERT INTO review (product_id, customer_id, rating, body) VALUES (41, 7, 3, '   ');\nSELECT body IS NULL AS no_body, length(body) FROM review WHERE customer_id = 7 AND product_id = 41;\nROLLBACK;",
   "out": " no_body | length \n---------+--------\n f       |      3\n(1 row)"
  },
  "BẪY Q9: kiểm": {
   "sql": "SELECT o.id, o.status FROM orders o JOIN order_item oi ON oi.order_id = o.id WHERE o.customer_id = 7 AND oi.product_id = 22;",
   "out": " id  | status  \n-----+---------\n 703 | pending\n(1 row)"
  },
  "Q10: PK (order_id": {
   "sql": "BEGIN;\nSET LOCAL enable_seqscan = off;\nEXPLAIN (COSTS OFF) SELECT count(*) FROM order_item WHERE product_id = 34;\nROLLBACK;",
   "out": "                        QUERY PLAN                         \n-----------------------------------------------------------\n Aggregate\n   ->  Index Only Scan using order_item_pkey on order_item\n         Index Cond: (product_id = 34)\n(3 rows)"
  },
  "Q10: PK phục vụ": {
   "sql": "EXPLAIN (COSTS OFF) SELECT count(*) FROM order_item WHERE order_id = 34;",
   "out": "                        QUERY PLAN                         \n-----------------------------------------------------------\n Aggregate\n   ->  Index Only Scan using order_item_pkey on order_item\n         Index Cond: (order_id = 34)\n(3 rows)"
  }
 }
};

/* Mốc video: [thời điểm hoặc null, EN, VI]. Thời điểm điền khi bản ghép -tron xong (mo-ta-chuong.txt). */
const MOC_PE1 = [
  [null, 'Part 1 — reading the paper: rules, grading, schema, data, every question, the 90-minute plan', 'Phần 1 — đọc đề: luật, cách chấm, lược đồ, dữ liệu, từng câu, chia 90 phút'],
  [null, 'Part 2 — Q1 (OUTER JOIN + FILTER) · Q2 (no fan-out)', 'Phần 2 — câu 1 (OUTER JOIN + FILTER) · câu 2 (chống fan-out)'],
  [null, 'Part 3 — Q3 (ranking with a tie) · Q4 (a tree with a cycle)', 'Phần 3 — câu 3 (xếp hạng có hoà) · câu 4 (cây có vòng)'],
  [null, 'Part 4 — Q5 (typed values out of jsonb) · check & submit', 'Phần 4 — câu 5 (giá trị đúng kiểu từ jsonb) · soát & nộp'],
];
const MOC_PE2 = [
  [null, 'Part 1 — reading the paper: CT Shop, the starter files, grading, all ten questions, the 120-minute plan', 'Phần 1 — đọc đề: CT Shop, tệp khởi đầu, cách chấm, cả mười câu, chia 120 phút'],
  [null, 'Part 2 — Q1 (stable paging) · Q2 (outer join and time zones)', 'Phần 2 — câu 1 (phân trang ổn định) · câu 2 (outer join và múi giờ)'],
  [null, 'Part 3 — Q3 (fan-out and HAVING) · Q4 (NOT EXISTS vs NOT IN)', 'Phần 3 — câu 3 (fan-out và HAVING) · câu 4 (NOT EXISTS vs NOT IN)'],
  [null, 'Part 4 — Q5 (jsonb arrays) · Q6 (rank, lag, running total)', 'Phần 4 — câu 5 (mảng trong jsonb) · câu 6 (rank, lag, luỹ tiến)'],
  [null, 'Part 5 — Q7 (a tree of any depth) · Q8 (DDL, UPSERT, SAVEPOINT)', 'Phần 5 — câu 7 (cây mọi độ sâu) · câu 8 (DDL, UPSERT, SAVEPOINT)'],
  [null, 'Part 6 — Q9 (BEFORE trigger) · Q10 (prove an index with EXPLAIN) · submit', 'Phần 6 — câu 9 (trigger BEFORE) · câu 10 (chứng minh chỉ mục bằng EXPLAIN) · nộp'],
];
const moc = (ds, vi) => '<ul>' + ds.map(([t, en, v]) => '<li>' + (t ? '<b>' + t + '</b> — ' : '') + (vi ? v : en) + '</li>').join('') + '</ul>';

/**
 * Một câu: tên, đề bắt gì, lời giải (từ đề), output, các bẫy chạy thật, rubric (từ đề), bài ôn.
 * c = { q, tieu: [en, vi], bat: [en, vi], bay: [[khoá BAY, en, vi]], on: [[slug, en, vi]], ghi?: [en, vi] }
 */
const cau = (de, D, c, vi) => {
  const Q = D.default.exams[0].questions[c.q - 1];
  const B = BAY[de];
  return (
    '<h3>' + (vi ? 'Câu ' : 'Q') + c.q + ' — ' + c.tieu[vi ? 1 : 0] + ' (' + String(Q.points).replace('.', vi ? ',' : '.') + (vi ? ' điểm' : ' marks') + ')</h3>' +
    '<p><b>' + (vi ? 'Đề bắt gì.' : 'What it tests.') + '</b> ' + c.bat[vi ? 1 : 0] + '</p>' +
    '<p><b>' + (vi ? 'Lời giải (chạy thật, PostgreSQL 17.11):' : 'Solution (run for real, PostgreSQL 17.11):') + '</b></p>' +
    sql(Q.sampleSolution) + out(Q.expectedOutput) +
    (c.ghi ? '<div class="callout">' + c.ghi[vi ? 1 : 0] + '</div>' : '') +
    '<p><b>' + (vi ? 'Lời giải sai hay gặp — cũng chạy thật:' : 'Common wrong answers — also run for real:') + '</b></p>' +
    c.bay.map(([k, en, v]) => '<p>' + (vi ? v : en) + '</p>' + sql(B[k].sql) + out(B[k].out)).join('') +
    '<p><b>Rubric:</b></p><ul>' + Q.rubric.map((r) => '<li><b>' + String(r.maxScore).replace('.', vi ? ',' : '.') + '</b> — ' + pick(r.criterion, vi) + '</li>').join('') + '</ul>' +
    '<p>📚 ' + (vi ? 'Ôn lại: ' : 'Review: ') + c.on.map(([s, en, v]) => bai(s, en, vi ? v : null)).join(' · ') + '</p>'
  );
};

const lesson = ({ slug, de, D, title, desc, eyebrow, lead, chay, mocs, cauHoi }) => ({
  title: title[0] + '|||' + title[1],
  slug,
  type: 'VIDEO',
  description: desc,
  content:
    '<div class="ml-en">' +
    '<span class="eyebrow">' + eyebrow[0] + '</span>' +
    '<h2>' + title[0] + '</h2>' +
    '<p class="lead">' + lead[0] + '</p>' +
    '<div class="callout">Take it first, timed, in the <a href="' + EXAM + '">Exam room</a> → PostgreSQL → <b>' + D.default.exams[0].title.split('|||')[0] + '</b>. The paper, the starter files and the loading instructions are there; this lesson is the full walkthrough — the video and, below it, every answer in writing.</div>' +
    '<h3>Parts of the video</h3>' + moc(mocs, false) +
    '<p>' + chay[0] + '</p>' +
    cauHoi.map((c) => cau(de, D, c, false)).join('') +
    '</div>' +
    '<div class="ml-vi">' +
    '<span class="eyebrow">' + eyebrow[1] + '</span>' +
    '<h2>' + title[1] + '</h2>' +
    '<p class="lead">' + lead[1] + '</p>' +
    '<div class="callout">Làm thử trước, bấm giờ, trong <a href="' + EXAM + '">Phòng thi</a> → PostgreSQL → <b>' + D.default.exams[0].title.split('|||')[1] + '</b>. Đề, tệp khởi đầu và hướng dẫn nạp dữ liệu đều ở đó; bài này chữa trọn — video, và ngay dưới là mọi lời giải bằng chữ.</div>' +
    '<h3>Các phần của video</h3>' + moc(mocs, true) +
    '<p>' + chay[1] + '</p>' +
    cauHoi.map((c) => cau(de, D, c, true)).join('') +
    '</div>',
});

/* ═══════════════════════════════ PE1 ═══════════════════════════════ */
const PE1 = lesson({
  slug: 'postgresql-pe1-chua-tron-de', de: 'pe1', D: DE_PE1,
  title: ['PE1 fully solved — 5 questions, at the right grain', 'Chữa trọn đề PE1 — 5 câu, đúng grain'],
  desc: 'Chữa trọn đề thi thực hành PE1 của khoá PostgreSQL: 5 câu, 90 phút — OUTER JOIN + FILTER, CTE chống fan-out, top-N có phá hoà, CTE đệ quy chặn vòng, giá trị đúng kiểu từ jsonb. Mọi lời giải và mọi bẫy chạy thật trên PostgreSQL 17.11.',
  eyebrow: ['Final exam · Practical Exam 1, solved', 'Thi cuối khoá · Đề thực hành 1, chữa trọn'],
  lead: [
    'Five SQL questions on five small tables (customer, orders, order_item, product, category), 90 minutes, 10 marks (1.5 + 2 + 2 + 2 + 2.5), pass at 4. Graded on the result first and the method second: every question has one row planted to catch a shortcut — Dung and Em with no orders, orders 1 and 4 with two lines each, Phone P and Phone Q tied at 700.00, a category cycle 7 → 9 → 8 → 7, and customers whose <code>props</code> lack a key.',
    'Năm câu SQL trên năm bảng nhỏ (customer, orders, order_item, product, category), 90 phút, 10 điểm (1,5 + 2 + 2 + 2 + 2,5), đạt từ 4. Chấm kết quả trước, cách làm sau: câu nào cũng có một dòng dữ liệu đặt sẵn để bắt lối tắt — Dung và Em không có đơn, đơn 1 và 4 mỗi đơn hai dòng hàng, Phone P và Phone Q hoà đúng 700.00, cây danh mục có vòng 7 → 9 → 8 → 7, và khách có <code>props</code> thiếu khoá.',
  ],
  chay: [
    'The paper says the reference answers were produced on PostgreSQL 16.14. Every answer and every wrong answer below was re-run on <b>PostgreSQL 17.11</b> (the course machine) against the schema loaded exactly as written: the five reference outputs match the paper line for line. Each file may assume <code>SET search_path = pe, public;</code> has already run.',
    'Đề ghi đáp án mẫu tạo trên PostgreSQL 16.14. Mọi lời giải và mọi lời giải sai bên dưới đều chạy lại trên <b>PostgreSQL 17.11</b> (máy của khoá) với lược đồ nạp đúng nguyên văn: năm output mẫu khớp đề từng dòng. Mỗi tệp được coi như đã chạy <code>SET search_path = pe, public;</code>.',
  ],
  mocs: MOC_PE1,
  cauHoi: [
    {
      q: 1, tieu: ['keep every customer', 'giữ lại mọi khách hàng'],
      bat: ['"Every customer" means the customer table drives a <code>LEFT JOIN</code>; Dung and Em must show <code>0 | 0</code>. Count a real child column (<code>count(o.id)</code>, not <code>count(*)</code>), and count the paid ones in the same pass with <code>FILTER</code>. No condition on <code>orders</code> may sit in <code>WHERE</code>.',
        '"Mọi khách" nghĩa là bảng customer dẫn một phép <code>LEFT JOIN</code>; Dung và Em phải hiện <code>0 | 0</code>. Đếm một cột thật của bảng con (<code>count(o.id)</code>, không phải <code>count(*)</code>), và đếm đơn paid trong cùng lượt bằng <code>FILTER</code>. Không điều kiện nào về <code>orders</code> được nằm ở <code>WHERE</code>.'],
      bay: [
        ['BẪY Q1a', 'A plain <code>JOIN</code>: Dung and Em vanish — no error, three rows.', '<code>JOIN</code> thường: Dung và Em biến mất — không lỗi, ba dòng.'],
        ['BẪY Q1b', '<code>count(*)</code> counts the NULL-padded row: Dung and Em score 1.', '<code>count(*)</code> đếm cả dòng đệm NULL: Dung và Em thành 1.'],
        ['BẪY Q1c', "<code>status = 'paid'</code> in <code>WHERE</code> runs after the join and drops the NULL-padded rows (their status is NULL): three rows, and An's total becomes 2.", "<code>status = 'paid'</code> ở <code>WHERE</code> chạy sau phép nối và loại các dòng đệm NULL (status là NULL): ba dòng, và tổng của An thành 2."],
      ],
      on: [['postgresql-5-2-outer-join', '5.2 OUTER JOIN', '5.2 OUTER JOIN'], ['postgresql-6-3-having-filter', '6.3 HAVING vs WHERE, FILTER', '6.3 HAVING vs WHERE, FILTER']],
    },
    {
      q: 2, tieu: ['revenue without fan-out', 'doanh thu không bị fan-out'],
      bat: ['Joining <code>orders</code> straight to <code>order_item</code> turns each order into one row per item, so the order count inflates (An 3, Chi 2). Aggregate the many side first — a CTE with one row per order — then join 1 : 1. Keep <code>paid</code> in the <code>ON</code> clause, and <code>coalesce</code> the empty sum to <code>0.00</code> (an aggregate over zero rows is NULL; only <code>count</code> returns 0).',
        'Nối thẳng <code>orders</code> với <code>order_item</code> biến mỗi đơn thành một dòng cho mỗi món, nên số đơn bị thổi phồng (An 3, Chi 2). Tổng hợp phía nhiều trước — một CTE mỗi đơn một dòng — rồi nối 1 : 1. Giữ <code>paid</code> trong <code>ON</code>, và <code>coalesce</code> tổng rỗng về <code>0.00</code> (hàm tổng hợp trên 0 dòng ra NULL; chỉ <code>count</code> ra 0).'],
      bay: [
        ['BẪY Q2a', 'Straight join: revenue happens to be right (summing per line is fine), but An shows 3 orders and Chi 2.', 'Nối thẳng: doanh thu tình cờ đúng (cộng theo dòng hàng vẫn đúng), nhưng An ra 3 đơn, Chi 2 đơn.'],
        ['BẪY Q2b', 'The dangerous version: the per-order total is already computed, but <code>order_item</code> is still joined — each order total is added once per item (An 3660, Chi 5400).', 'Bản nguy hiểm: đã có tổng cấp đơn mà vẫn nối thêm <code>order_item</code> — mỗi tổng cấp đơn bị cộng một lần cho mỗi dòng hàng (An 3660, Chi 5400).'],
        ['BẪY Q2c', 'No <code>coalesce</code>: Dung and Em print an empty cell instead of <code>0.00</code>.', 'Thiếu <code>coalesce</code>: Dung và Em ra ô trống thay vì <code>0.00</code>.'],
      ],
      ghi: ['Why not just <code>count(DISTINCT o.id)</code> on the straight join? On this data it prints the right numbers, but the rubric grades the grain: add any order-level money column (a shipping fee) and DISTINCT cannot save the sum. Pre-aggregating is the fix that keeps working.',
        'Sao không <code>count(DISTINCT o.id)</code> trên phép nối thẳng? Trên dữ liệu này nó ra số đúng, nhưng rubric chấm grain: thêm bất kỳ cột tiền cấp đơn nào (phí ship) là DISTINCT không cứu được tổng. Tổng hợp trước mới là cách bền.'],
      on: [['postgresql-6-4-tong-hop-tren-join', '6.4 Aggregating over joins', '6.4 Tổng hợp trên JOIN'], ['postgresql-7-3-cte', '7.3 CTE', '7.3 CTE']],
    },
    {
      q: 3, tieu: ['top two products per category', 'hai sản phẩm dẫn đầu mỗi danh mục'],
      bat: ['Top-N per group is a window function: <code>PARTITION BY</code> category, <code>ORDER BY</code> revenue. It cannot be filtered in the <code>WHERE</code> of its own <code>SELECT</code> — rank in a CTE, filter outside. The tie Phone P = Phone Q = 700.00 needs distinct numbers (1, 2), so <code>row_number()</code>, with <code>product_id</code> as a deterministic tiebreaker.',
        'Top-N mỗi nhóm là hàm cửa sổ: <code>PARTITION BY</code> danh mục, <code>ORDER BY</code> doanh thu. Không lọc được ở <code>WHERE</code> của chính câu <code>SELECT</code> đó — xếp hạng trong CTE, lọc ở ngoài. Cặp hoà Phone P = Phone Q = 700.00 cần số phân biệt (1, 2), nên dùng <code>row_number()</code>, kèm <code>product_id</code> làm cột phá hoà xác định.'],
      bay: [
        ['BẪY Q3a', 'Filtering the window function in <code>WHERE</code> is an error — <code>WHERE</code> runs before window functions are computed.', 'Lọc hàm cửa sổ ở <code>WHERE</code> là lỗi — <code>WHERE</code> chạy trước khi hàm cửa sổ được tính.'],
        ['BẪY Q3b', 'Ordered by revenue only, <code>rank()</code> and <code>dense_rank()</code> give the tie 1 and 1; <code>row_number()</code> gives 1 and 2, but nothing guarantees which product is first.', 'Chỉ sắp theo doanh thu: <code>rank()</code> và <code>dense_rank()</code> cho cặp hoà 1 và 1; <code>row_number()</code> cho 1 và 2, nhưng không gì bảo đảm ai đứng trước.'],
        ['Q3: thêm cột phá hoà', 'With <code>product_id</code> added to the window order, the result is fixed: Phone P 1, Phone Q 2.', 'Thêm <code>product_id</code> vào thứ tự của cửa sổ, kết quả cố định: Phone P 1, Phone Q 2.'],
        ['BẪY Q3c', 'Forgetting <code>paid</code>: Phone P picks up refunded order 3 and earns 2800 — the tie (and the trap) disappears.', 'Quên <code>paid</code>: Phone P cộng cả đơn 3 đã hoàn tiền, thành 2800 — cái hoà (và cái bẫy) biến mất.'],
      ],
      on: [['postgresql-8-2-ranking', '8.2 ROW_NUMBER, RANK, DENSE_RANK', '8.2 ROW_NUMBER, RANK, DENSE_RANK']],
    },
    {
      q: 4, tieu: ['walk a tree that contains a cycle', 'đi qua một cây có vòng'],
      bat: ['A tree of unknown depth is <code>WITH RECURSIVE</code>: an anchor (ids 1 and 7) <code>UNION ALL</code> a recursive term that goes one level down per pass. The data has a cycle, and a recursive CTE stops only when a pass returns no rows — so carry the visited ids in an array (<code>NOT (c.id = ANY (t.seen))</code>) and also cap the depth.',
        'Cây không biết trước độ sâu là <code>WITH RECURSIVE</code>: vế khởi đầu (id 1 và 7) <code>UNION ALL</code> vế đệ quy, mỗi lượt xuống một tầng. Dữ liệu có vòng, mà CTE đệ quy chỉ dừng khi một lượt không ra dòng nào — nên mang mảng id đã thăm (<code>NOT (c.id = ANY (t.seen))</code>) và chặn thêm độ sâu.'],
      bay: [
        ['BẪY Q4a', 'No guard at all (with a 2-second <code>statement_timeout</code> so it cannot run for ever): cancelled.', 'Không lớp chặn nào (đặt <code>statement_timeout</code> 2 giây để khỏi chạy mãi): bị huỷ.'],
        ['BẪY Q4b', 'Switching to <code>UNION</code> does not help: the path differs on every pass, so no row is a duplicate — also cancelled.', 'Đổi sang <code>UNION</code> cũng không cứu: path mỗi lượt một khác nên không dòng nào trùng — cũng bị huỷ.'],
        ['BẪY Q4c', 'Only the depth cap: it stops, but the Promo branch loops to depth 10 — ten junk rows.', 'Chỉ chặn độ sâu: dừng được, nhưng nhánh Promo lặp tới tầng 10 — mười dòng rác.'],
        ['Q4: bỏ ::text', 'The note about <code>::text</code>: here <code>name</code> is already <code>text</code>, so dropping the cast still gives 9 rows…', 'Ghi chú về <code>::text</code>: ở đây <code>name</code> đã là <code>text</code>, nên bỏ phép ép vẫn ra 9 dòng…'],
        ['Q4: nếu cột là varchar', '…but with a <code>varchar(40)</code> column the two terms disagree on type and PostgreSQL refuses. The cast is a good habit, not optional decoration.', '…nhưng với cột <code>varchar(40)</code> hai vế lệch kiểu và PostgreSQL từ chối. Ép kiểu là thói quen đúng, không phải trang trí.'],
      ],
      on: [['postgresql-7-4-recursive-cte', '7.4 Recursive CTEs', '7.4 CTE đệ quy']],
    },
    {
      q: 5, tieu: ['typed values out of jsonb', 'giá trị đúng kiểu từ jsonb'],
      bat: ['<code>-&gt;&gt;</code> always returns <code>text</code>: cast to <code>numeric</code> at the boundary or <code>\'90\'</code> sorts above <code>\'1500\'</code>. A missing key yields NULL, so <code>none</code> and <code>0</code> must be supplied with <code>coalesce</code>. "Absent" is not "zero": <code>has_credit</code> is an existence test, <code>jsonb_exists(props, \'credit\')</code> (the <code>?</code> operator is a bind placeholder in most drivers). <code>rich</code> is <code>count(*) FILTER</code> in the same pass.',
        '<code>-&gt;&gt;</code> luôn trả <code>text</code>: ép <code>numeric</code> ngay khi lấy ra, không thì <code>\'90\'</code> đứng trên <code>\'1500\'</code>. Khoá vắng cho NULL, nên <code>none</code> và <code>0</code> phải tự điền bằng <code>coalesce</code>. "Không có" khác "bằng 0": <code>has_credit</code> là phép kiểm tồn tại, <code>jsonb_exists(props, \'credit\')</code> (toán tử <code>?</code> là chỗ giữ tham số trong hầu hết driver). <code>rich</code> là <code>count(*) FILTER</code> trong cùng lượt.'],
      bay: [
        ['BẪY Q5a', 'No cast: credit sorts as text — 90, 300, 1500.', 'Không ép kiểu: credit sắp như chữ — 90, 300, 1500.'],
        ['BẪY Q5b', "Comparing text: <code>'90' &gt;= '500'</code> is true, so Chi would count as rich and An would not.", "So chữ: <code>'90' &gt;= '500'</code> là đúng, nên Chi thành người giàu còn An thì không."],
        ['Q5: credit = 0', 'Why <code>has_credit</code> must not be "coalesced credit &lt;&gt; 0": a customer whose credit really is 0 has the key, and only the existence test says so.', 'Vì sao <code>has_credit</code> không được viết "credit đã coalesce &lt;&gt; 0": khách có credit thật sự bằng 0 vẫn có khoá, và chỉ phép kiểm tồn tại nói đúng điều đó.'],
        ['BẪY Q5d', 'Query 5b without <code>coalesce</code>: the third row has an empty tier and an empty total.', 'Truy vấn 5b thiếu <code>coalesce</code>: dòng thứ ba có tier trống và tổng trống.'],
      ],
      on: [['postgresql-2-4-uuid-enum-array-jsonb', '2.4 jsonb', '2.4 jsonb'], ['postgresql-13-1-jsonb', '13.1 JSONB', '13.1 JSONB'], ['postgresql-6-3-having-filter', '6.3 FILTER', '6.3 FILTER']],
    },
  ],
});

/* ═══════════════════════════════ PE2 ═══════════════════════════════ */
const PE2 = lesson({
  slug: 'postgresql-pe2-chua-tron-de', de: 'pe2', D: DE_PE2,
  title: ['PE2 fully solved — 10 SQL tasks on CT Shop', 'Chữa trọn đề PE2 — 10 việc SQL trên CT Shop'],
  desc: 'Chữa trọn đề thi thực hành PE2 của khoá PostgreSQL: 10 câu trên CSDL CT Shop của các lab, 120 phút — phân trang ổn định, OUTER JOIN + múi giờ, fan-out + HAVING, NOT EXISTS, jsonb, rank/lag, cây đệ quy, DDL + UPSERT + SAVEPOINT, trigger BEFORE, chỉ mục + EXPLAIN. Chạy thật trên PostgreSQL 17.11.',
  eyebrow: ['Final exam · Practical Exam 2, solved', 'Thi cuối khoá · Đề thực hành 2, chữa trọn'],
  lead: [
    'Ten SQL questions on the CT Shop database you built in the labs (schema <code>shop</code>, 8 tables, 300 customers, 2,000 orders), 120 minutes, 10 marks, pass at 4. Each file starts from the given starter (<code>search_path</code>, Vietnam <code>TimeZone</code>, <code>VERBOSITY terse</code>); Q7–Q10 run inside <code>BEGIN … ROLLBACK</code>, so even your DDL disappears and the shop stays pristine.',
    'Mười câu SQL trên CSDL CT Shop bạn đã dựng qua các lab (schema <code>shop</code>, 8 bảng, 300 khách, 2.000 đơn), 120 phút, 10 điểm, đạt từ 4. Mỗi tệp bắt đầu từ tệp khởi đầu của đề (<code>search_path</code>, <code>TimeZone</code> giờ Việt Nam, <code>VERBOSITY terse</code>); câu 7–10 chạy trong <code>BEGIN … ROLLBACK</code>, nên cả DDL của bạn cũng biến mất và cửa hàng luôn nguyên vẹn.',
  ],
  chay: [
    'Every file below is the starter with the answer written into it, run exactly as the paper says — <code>docker exec -i pgdemo psql -U postgres -d ctshop -X -q &lt; Qn.sql</code> — on PostgreSQL 17.11 with CT Shop freshly loaded from <code>lab3-start.sql</code>. All ten outputs match the expected output line for line, including the two <code>ERROR</code> lines of Q8 and the three of Q9. Below, only the answer part of each file is shown.',
    'Mỗi tệp bên dưới là tệp khởi đầu đã điền lời giải, chạy đúng lệnh của đề — <code>docker exec -i pgdemo psql -U postgres -d ctshop -X -q &lt; Qn.sql</code> — trên PostgreSQL 17.11 với CT Shop vừa nạp từ <code>lab3-start.sql</code>. Cả mười output khớp expected output từng dòng, kể cả hai dòng <code>ERROR</code> của câu 8 và ba dòng của câu 9. Bên dưới chỉ in phần lời giải của mỗi tệp.',
  ],
  mocs: MOC_PE2,
  cauHoi: [
    {
      q: 1, tieu: ['a stable page of a filtered list', 'một trang ổn định của danh sách đã lọc'],
      bat: ['"No phone" is <code>IS NULL</code>; two cities is <code>IN</code> (or parentheses — <code>AND</code> binds tighter than <code>OR</code>): 19 customers. Page 2 of 7 is <code>LIMIT 7 OFFSET 7</code>, and the order must end in a unique column: customers 210 and 245 signed up at the same instant, right on the page 2 / page 3 boundary.',
        '"Không có số điện thoại" là <code>IS NULL</code>; hai thành phố là <code>IN</code> (hoặc ngoặc — <code>AND</code> buộc chặt hơn <code>OR</code>): 19 khách. Trang 2, mỗi trang 7 là <code>LIMIT 7 OFFSET 7</code>, và thứ tự phải kết thúc bằng một cột duy nhất: khách 210 và 245 đăng ký cùng một thời điểm, nằm đúng ranh trang 2 / trang 3.'],
      bay: [
        ['BẪY Q1a', '<code>phone = NULL</code> is never true: 0 rows.', '<code>phone = NULL</code> không bao giờ đúng: 0 dòng.'],
        ['BẪY Q1b', 'No parentheses: every Hà Nội customer slips in — 64 rows instead of 19.', 'Không ngoặc: mọi khách Hà Nội lọt vào — 64 dòng thay vì 19.'],
        ['Q1: hai khách', 'The two customers on the boundary: same <code>created_at</code>. Only the trailing <code>id</code> fixes their order across page loads.', 'Hai khách ở ranh trang: cùng <code>created_at</code>. Chỉ cột <code>id</code> cuối mới cố định thứ tự của họ giữa các lần tải trang.'],
      ],
      on: [['postgresql-4-2-select-where', '4.2 SELECT & WHERE', '4.2 SELECT & WHERE'], ['postgresql-4-3-order-limit-distinct', '4.3 ORDER BY, LIMIT/OFFSET', '4.3 ORDER BY, LIMIT/OFFSET']],
    },
    {
      q: 2, tieu: ['keep the customers who never bought', 'giữ lại cả khách chưa từng mua'],
      bat: ['Customers 291–295 never ordered and must show <code>0 | 0 | 0</code>: <code>customer LEFT JOIN orders</code>, <code>count(o.id)</code>, and the two conditional counts with <code>FILTER</code> — the 2026 condition must not sit in <code>WHERE</code>. 2026 is a half-open range in Vietnam time: order 1761 was placed at 03:31 on 1 January 2026 in Vietnam, still 31 December in UTC.',
        'Khách 291–295 chưa từng mua và phải hiện <code>0 | 0 | 0</code>: <code>customer LEFT JOIN orders</code>, <code>count(o.id)</code>, hai phép đếm có điều kiện bằng <code>FILTER</code> — điều kiện năm 2026 không được nằm ở <code>WHERE</code>. Năm 2026 là khoảng nửa mở theo giờ Việt Nam: đơn 1761 đặt lúc 03:31 ngày 1/1/2026 giờ Việt Nam, vẫn là 31/12 theo UTC.'],
      bay: [
        ['BẪY Q2a', 'The 2026 condition in <code>WHERE</code>: five customers vanish, and <code>orders</code> becomes the 2026 count (288: 12 → 6).', 'Điều kiện 2026 ở <code>WHERE</code>: năm khách biến mất, và <code>orders</code> thành số đơn 2026 (288: 12 → 6).'],
        ['BẪY Q2b', '<code>count(*)</code>: customers who never bought score 1.', '<code>count(*)</code>: khách chưa mua thành 1.'],
        ['BẪY Q2c', 'A UTC session: order 1761 falls into 2025 and customer 288 has only 5 orders in 2026.', 'Phiên UTC: đơn 1761 rơi về 2025 và khách 288 chỉ còn 5 đơn năm 2026.'],
      ],
      on: [['postgresql-5-2-outer-join', '5.2 OUTER JOIN', '5.2 OUTER JOIN'], ['postgresql-6-3-having-filter', '6.3 FILTER', '6.3 FILTER'], ['postgresql-2-3-ngay-gio', '2.3 Dates, times and time zones', '2.3 Ngày giờ và múi giờ']],
    },
    {
      q: 3, tieu: ['revenue by city without fan-out', 'doanh thu theo thành phố không bị fan-out'],
      bat: ['Money is on <code>payment</code> (one row per order), units are on <code>order_item</code> (1–4 rows per order). Sum the units to one row per order first (CTE <code>units</code>), then join. The year goes in <code>WHERE</code> (half-open on <code>paid_at</code>), the "at least 135" goes in <code>HAVING</code>; <code>buyers</code> is <code>count(DISTINCT …)</code>, <code>card_pct</code> uses <code>FILTER</code>.',
        'Tiền ở <code>payment</code> (một dòng mỗi đơn), số món ở <code>order_item</code> (1–4 dòng mỗi đơn). Cộng số món về một dòng mỗi đơn trước (CTE <code>units</code>), rồi mới nối. Điều kiện năm ở <code>WHERE</code> (nửa mở trên <code>paid_at</code>), "ít nhất 135" ở <code>HAVING</code>; <code>buyers</code> là <code>count(DISTINCT …)</code>, <code>card_pct</code> dùng <code>FILTER</code>.'],
      bay: [
        ['BẪY Q3', 'Joining <code>order_item</code> straight in: every payment is added once per line — TP.HCM 394 payments and 317,826,000 instead of 151 and 101,630,000, and all five cities pass the filter.', 'Nối thẳng <code>order_item</code>: mỗi khoản tiền bị cộng một lần cho mỗi dòng hàng — TP.HCM 394 lần thanh toán và 317.826.000 thay vì 151 và 101.630.000, và cả năm thành phố đều qua ngưỡng.'],
        ['Q3: hai thành phố', 'The real counts per city: Cần Thơ (133) and Hà Nội (132) must be cut by <code>HAVING</code>.', 'Số đếm thật mỗi thành phố: Cần Thơ (133) và Hà Nội (132) phải bị <code>HAVING</code> loại.'],
      ],
      on: [['postgresql-6-3-having-filter', '6.3 HAVING vs WHERE', '6.3 HAVING vs WHERE'], ['postgresql-6-4-tong-hop-tren-join', '6.4 Fan-out', '6.4 Fan-out'], ['postgresql-lab-3-bao-cao-doanh-thu-ct-shop', 'Lab 3', 'Lab 3']],
    },
    {
      q: 4, tieu: ['stock reconciliation with NOT EXISTS', 'đối soát kho bằng NOT EXISTS'],
      bat: ['"Orders with no movement" is an anti-join. <code>NOT IN (SELECT order_id FROM stock_movement)</code> returns nothing because the 48 <code>import</code> rows have <code>order_id</code> NULL: <code>x NOT IN (…, NULL)</code> is never TRUE, it is NULL. <code>EXISTS</code> / <code>NOT EXISTS</code> only ask whether a row exists, so the NULLs are harmless.',
        '"Đơn không có dòng kho nào" là một anti-join. <code>NOT IN (SELECT order_id FROM stock_movement)</code> không ra gì vì 48 dòng <code>import</code> có <code>order_id</code> NULL: <code>x NOT IN (…, NULL)</code> không bao giờ TRUE, nó là NULL. <code>EXISTS</code> / <code>NOT EXISTS</code> chỉ hỏi có dòng hay không, nên NULL vô hại.'],
      bay: [
        ['BẪY Q4', 'The NULL source, the <code>NOT IN</code> report (0 rows, no error), and the one-line proof: <code>1 NOT IN (2, NULL)</code> is NULL.', 'Nguồn NULL, báo cáo dùng <code>NOT IN</code> (0 dòng, không lỗi), và bằng chứng một dòng: <code>1 NOT IN (2, NULL)</code> là NULL.'],
      ],
      on: [['postgresql-7-2-correlated-exists', '7.2 EXISTS and the NOT IN trap', '7.2 EXISTS & bẫy NOT IN']],
    },
    {
      q: 5, tieu: ['product attributes in jsonb', 'thuộc tính sản phẩm trong jsonb'],
      bat: ['<code>tags</code> is an array. One containment test answers 5a — <code>attrs @&gt; \'{"tags": ["học sinh"], "color": "đen"}\'</code>, the array written as an array — and it is the form a GIN index can serve. For 5b the array must become rows first: <code>CROSS JOIN LATERAL jsonb_array_elements_text(p.attrs-&gt;\'tags\')</code>, then <code>GROUP BY</code> the tag. (In this data every product has exactly one tag; the answer is still written for an array.)',
        '<code>tags</code> là một mảng. Một phép chứa trả lời 5a — <code>attrs @&gt; \'{"tags": ["học sinh"], "color": "đen"}\'</code>, mảng viết thành mảng — và đó là dạng chỉ mục GIN phục vụ được. Ở 5b mảng phải thành dòng trước: <code>CROSS JOIN LATERAL jsonb_array_elements_text(p.attrs-&gt;\'tags\')</code>, rồi <code>GROUP BY</code> theo nhãn. (Trong dữ liệu này mọi sản phẩm có đúng một nhãn; lời giải vẫn viết cho mảng.)'],
      bay: [
        ['BẪY Q5', '<code>-&gt;&gt;</code> on the array returns the JSON text <code>["học sinh"]</code>, so the equality finds nothing; and containment with a string where the data has an array finds nothing either.', '<code>-&gt;&gt;</code> trên mảng trả chuỗi JSON <code>["học sinh"]</code>, nên phép bằng không ra gì; và phép chứa viết chuỗi trong khi dữ liệu là mảng cũng không ra gì.'],
      ],
      on: [['postgresql-13-2-gin-jsonb', '13.2 JSONB queries and GIN', '13.2 Truy vấn JSONB & GIN']],
    },
    {
      q: 6, tieu: ['ranking with ties, then month on month', 'xếp hạng có hoà, rồi so tháng'],
      bat: ['6a: "fewer than three products sold strictly more" is exactly <code>rank()</code> — ties at the boundary are kept (Vở ô ly 64 / 64 at 2nd, Sổ tay 69 / 69 at 3rd). Rank in a CTE and filter outside; find the root through <code>parent_id</code>. 6b: aggregate to one row per month (<code>date_trunc</code> in the Vietnam session) before <code>lag()</code> and the running <code>sum() OVER</code>; September\'s running total is 411,147,000 — the 9-month figure of Lab 3.',
        '6a: "ít hơn ba sản phẩm bán nhiều hơn hẳn" chính là <code>rank()</code> — hoà ở ranh giới được giữ (Vở ô ly 64 / 64 ở hạng 2, Sổ tay 69 / 69 ở hạng 3). Xếp hạng trong CTE, lọc ở ngoài; tìm gốc qua <code>parent_id</code>. 6b: gom về một dòng mỗi tháng (<code>date_trunc</code> trong phiên giờ Việt Nam) rồi mới <code>lag()</code> và <code>sum() OVER</code> luỹ tiến; luỹ tiến tháng 9 là 411.147.000 — đúng con số 9 tháng của Lab 3.'],
      bay: [
        ['BẪY Q6a: row_number', 'All three ranking functions side by side: <code>row_number()</code> drops one of the 69-unit Sổ tay products, <code>dense_rank()</code> lets the 63-unit Vở ô ly product in.', 'Ba hàm xếp hạng cạnh nhau: <code>row_number()</code> làm rơi một sản phẩm Sổ tay 69 món, <code>dense_rank()</code> cho lọt sản phẩm Vở ô ly 63 món.'],
        ['BẪY Q6a: lọc', 'A window function in <code>WHERE</code>: error.', 'Hàm cửa sổ trong <code>WHERE</code>: lỗi.'],
        ['Q6b: date_trunc', 'The same monthly sum in a UTC session: January becomes 48,749,000 instead of 48,698,000.', 'Cùng phép cộng theo tháng trong phiên UTC: tháng 1 thành 48.749.000 thay vì 48.698.000.'],
      ],
      on: [['postgresql-8-2-ranking', '8.2 Ranking', '8.2 Xếp hạng'], ['postgresql-8-3-lag-running-total', '8.3 LAG and running totals', '8.3 LAG & tổng luỹ tiến'], ['postgresql-lab-4-cte-ham-cua-so-ct-shop', 'Lab 4', 'Lab 4']],
    },
    {
      q: 7, tieu: ['the category tree, at any depth', 'cây danh mục, mọi độ sâu'],
      bat: ['The given lines add a third and fourth level (Máy tính khoa học, Casio fx). A self-join to the parent only knows two levels; use <code>WITH RECURSIVE</code> from the roots. For <code>in_subtree</code>, carry each node\'s lineage (array of ids from the root) — a product belongs to node t\'s subtree when t is in the lineage of the product\'s category. Cast the anchor path to <code>text</code>, <code>UNION ALL</code>, and a depth guard.',
        'Phần đề cho thêm tầng 3 và 4 (Máy tính khoa học, Casio fx). Tự nối với cha chỉ biết hai tầng; dùng <code>WITH RECURSIVE</code> từ các gốc. Với <code>in_subtree</code>, mang theo lineage của mỗi nút (mảng id từ gốc) — sản phẩm thuộc cây con của nút t khi t nằm trong lineage của danh mục sản phẩm. Ép path khởi đầu sang <code>text</code>, <code>UNION ALL</code>, và chặn độ sâu.'],
      bay: [
        ['BẪY Q7', 'The two-level self-join on the four-level tree: Dụng cụ học tập reports 8 instead of 12, and two invented "roots" appear.', 'Self-join hai tầng trên cây bốn tầng: Dụng cụ học tập ra 8 thay vì 12, và xuất hiện hai "gốc" bịa ra.'],
      ],
      on: [['postgresql-7-4-recursive-cte', '7.4 Recursive CTEs', '7.4 CTE đệ quy']],
    },
    {
      q: 8, tieu: ['a shopping cart: DDL, named constraints, UPSERT', 'giỏ hàng: DDL, ràng buộc đặt tên, UPSERT'],
      bat: ['Create <code>cart_item</code> exactly as specified (CASCADE only on the customer key, a CHECK named <code>cart_item_qty_check</code>, the composite primary key, the named index). One "add to cart" statement: <code>ON CONFLICT (customer_id, product_id) DO UPDATE SET qty = cart_item.qty + EXCLUDED.qty, updated_at = now()</code>, with <code>(xmax = 0)</code> telling an insert from an update. The 21-unit add fails on the CHECK, so it runs inside <code>SAVEPOINT too_many</code> and is rolled back to it — the transaction survives for the given checks.',
        'Tạo <code>cart_item</code> đúng đặc tả (CASCADE chỉ ở khoá khách, CHECK tên <code>cart_item_qty_check</code>, khoá chính hai cột, chỉ mục đúng tên). Một lệnh "thêm vào giỏ": <code>ON CONFLICT (customer_id, product_id) DO UPDATE SET qty = cart_item.qty + EXCLUDED.qty, updated_at = now()</code>, với <code>(xmax = 0)</code> phân biệt chèn mới và cập nhật. Lần thêm 21 món vi phạm CHECK, nên chạy trong <code>SAVEPOINT too_many</code> rồi rollback về đó — giao dịch sống tiếp cho các phép kiểm của đề.'],
      bay: [
        ['BẪY Q8: ON CONFLICT DO NOTHING', '<code>DO NOTHING</code> swallows the second add: <code>RETURNING</code> is empty and the quantity stays 1.', '<code>DO NOTHING</code> nuốt lần thêm thứ hai: <code>RETURNING</code> rỗng và số lượng vẫn là 1.'],
        ['BẪY Q8: không SAVEPOINT', 'No savepoint: after the CHECK error every following statement fails with "current transaction is aborted".', 'Không savepoint: sau lỗi CHECK mọi lệnh tiếp theo đều chết với "current transaction is aborted".'],
        ['BẪY Q8: DO UPDATE', 'A bare <code>qty</code> in <code>DO UPDATE</code> is ambiguous — write <code>cart_item.qty</code>.', '<code>qty</code> trần trong <code>DO UPDATE</code> bị mơ hồ — viết <code>cart_item.qty</code>.'],
      ],
      on: [['postgresql-3-3-rang-buoc-cot', '3.3 Column constraints', '3.3 Ràng buộc cột'], ['postgresql-4-1-insert', '4.1 INSERT, RETURNING, UPSERT', '4.1 INSERT, RETURNING, UPSERT'], ['postgresql-11-1-giao-dich', '11.1 Transactions', '11.1 Giao dịch']],
    },
    {
      q: 9, tieu: ['only buyers may review: a validating trigger', 'chỉ người đã mua mới được đánh giá: trigger kiểm dữ liệu'],
      bat: ['It must be a <code>BEFORE INSERT OR UPDATE OF product_id, customer_id, body</code> row trigger: only BEFORE can change <code>NEW.body</code> (trimmed, all-blank → NULL) and reject the row. "Bought" means a <code>shipped</code> order containing the product — customer 7 has product 22 only in pending order 703. The trigger runs before constraints, so the duplicate review of product 1 passes the guard and is stopped by UNIQUE.',
        'Phải là trigger theo dòng <code>BEFORE INSERT OR UPDATE OF product_id, customer_id, body</code>: chỉ BEFORE mới sửa được <code>NEW.body</code> (cắt trắng, toàn trắng → NULL) và chặn dòng. "Đã mua" nghĩa là có đơn <code>shipped</code> chứa sản phẩm — khách 7 chỉ có sản phẩm 22 trong đơn pending 703. Trigger chạy trước ràng buộc, nên đánh giá trùng sản phẩm 1 qua được trigger rồi bị UNIQUE chặn.'],
      bay: [
        ['BẪY Q9: AFTER', 'An AFTER trigger cannot change the row: the blank body stays three characters long.', 'Trigger AFTER không sửa được dòng: body trắng vẫn dài ba ký tự.'],
        ['BẪY Q9: kiểm', 'Checking <code>order_item</code> without <code>shipped</code> lets order 703 (pending) through.', 'Kiểm <code>order_item</code> mà không lọc <code>shipped</code> thì đơn 703 (pending) lọt qua.'],
      ],
      on: [['postgresql-12-1-ham', '12.1 Functions', '12.1 Hàm'], ['postgresql-12-2-trigger', '12.2 Triggers', '12.2 Trigger'], ['postgresql-lab-6-dat-hang-an-toan-ct-shop', 'Lab 6', 'Lab 6']],
    },
    {
      q: 10, tieu: ['prove an index with EXPLAIN', 'chứng minh một chỉ mục bằng EXPLAIN'],
      bat: ['Before: <code>Seq Scan</code> + <code>Filter</code>. After creating <code>order_item_product_id_idx</code>: a <code>Bitmap Index Scan</code> (99 rows) feeding a <code>Bitmap Heap Scan</code> with <code>Recheck Cond</code>; <code>Heap Blocks: exact=36</code> of the table\'s 37 pages. The primary key <code>(order_id, product_id)</code> cannot help: a B-tree is sorted by its leading column, so product 34 is scattered across the whole index.',
        'Trước: <code>Seq Scan</code> + <code>Filter</code>. Sau khi tạo <code>order_item_product_id_idx</code>: <code>Bitmap Index Scan</code> (99 dòng) đưa lên <code>Bitmap Heap Scan</code> có <code>Recheck Cond</code>; <code>Heap Blocks: exact=36</code> trên 37 trang của bảng. Khoá chính <code>(order_id, product_id)</code> không giúp được: B-tree sắp theo cột dẫn đầu, nên product 34 rải khắp chỉ mục.'],
      bay: [
        ['Q10: PK (order_id', 'Forcing the primary key (<code>enable_seqscan = off</code>): an Index Only Scan with the condition on the non-leading column — the whole index is read.', 'Ép dùng khoá chính (<code>enable_seqscan = off</code>): Index Only Scan với điều kiện trên cột không dẫn đầu — phải đọc trọn chỉ mục.'],
        ['Q10: PK phục vụ', 'The same key does serve <code>order_id = 34</code> — the leading column.', 'Cùng khoá đó phục vụ được <code>order_id = 34</code> — cột dẫn đầu.'],
      ],
      on: [['postgresql-9-2-to-hop-covering', '9.2 Composite indexes', '9.2 Chỉ mục tổ hợp'], ['postgresql-10-1-doc-explain', '10.1 Reading a plan', '10.1 Đọc một plan'], ['postgresql-lab-5-chi-muc-explain-ct-shop', 'Lab 5', 'Lab 5']],
    },
  ],
});

/* Thứ tự bài: PE1, PE2 — agent FE thêm FE1, FE2 vào CUỐI mảng này. */
const lessons = [PE1, PE2];

export default {
  title: 'Final exam — practical and multiple-choice papers, solved|||Thi cuối khoá — chữa trọn đề thực hành và trắc nghiệm',
  description: 'Mục chữa đề của khoá: mỗi đề một bài, có video dài chữa trọn và lời giải bằng chữ cho từng câu — SQL, output thật PostgreSQL 17.11, các lời giải sai hay gặp chạy thật, rubric chấm, và bài cần ôn. Làm đề trong Phòng thi trước, rồi mới xem.',
  lessons,
};
