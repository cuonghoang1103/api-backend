/**
 * pg-lab-3 — PostgreSQL · Lab 3 · CT Shop "The 9-month report" (slide EN, kiểu FU, agent lab34 25/10/2026).
 * Nguồn: content/courses/postgresql/lab/lab-3.mjs + lab/sql/lab3-*.sql. Output psql = chạy thật PostgreSQL 17.11
 * (container pgcourse17, DB nháp ctlab3, lab3-solution.sql bằng psql -f) — Q/O bên dưới SINH TỰ ĐỘNG (scratchpad lab34/mk-o.mjs).
 * Kiến thức tới Ch6 (+ NOT EXISTS, AT TIME ZONE giảng ngắn trong lab).
 */
import { lamDeck, sql, psql, tbl, two, box, steps, cards, kw, vsd, flow, sh, c, esc } from './_pg-chung.mjs';
import { erdShop, PG, CAM, NAU, XANH, DO, TIM } from './pg-lab-hinh.mjs';

export const deck = { key: 'pg-lab-3', code: 'PG Lab 3', title: 'Lab 3 — CT Shop: the 9-month report', sub: 'JOIN, self-join, anti-join, fan-out, HAVING, FILTER' };

/* Q:BEGIN */
const Q = {
  R0: `SELECT count(*) AS payments, sum(amount) AS revenue
FROM payment
WHERE paid_at >= '2026-01-01' AND paid_at < '2026-10-01';   -- 713 | 411147000.00`,
  R1: `SELECT to_char(date_trunc('month', p.paid_at), 'YYYY-MM') AS month,
       count(*)                      AS orders,
       count(DISTINCT o.customer_id) AS buyers,
       sum(p.amount)                 AS revenue,
       round(avg(p.amount))          AS avg_order
FROM payment p
JOIN orders o ON o.id = p.order_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY 1
ORDER BY 1;   -- 9 rows, best month 2026-03: 63914000`,
  R2: `SELECT r.name AS root, c.name AS category,
       sum(oi.qty)                 AS units,
       sum(oi.qty * oi.unit_price) AS revenue
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
JOIN product pr    ON pr.id = oi.product_id
JOIN category c    ON c.id = pr.category_id
JOIN category r    ON r.id = c.parent_id   -- self-join: the parent row
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY r.name, c.name
ORDER BY revenue DESC;   -- 8 rows, calculators 225855000`,
  R2B: `SELECT r.name AS root, sum(oi.qty * oi.unit_price) AS revenue
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
JOIN product pr    ON pr.id = oi.product_id
JOIN category c    ON c.id = pr.category_id
JOIN category r    ON r.id = c.parent_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY r.name
ORDER BY revenue DESC;   -- 240969000 + 68949000 + 54875000 + 46354000 = 411147000 ✓`,
  R3A: `SELECT c.id, c.email, c.city, c.created_at::date AS joined
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL
ORDER BY c.id;   -- 10 rows: 291…300`,
  R3A2: `SELECT count(*) AS never_ordered
FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);   -- 10`,
  R3B: `SELECT count(*) AS no_purchase_2026
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
                  AND o.status IN ('paid', 'shipped')
                  AND o.created_at >= '2026-01-01'
WHERE o.id IS NULL;   -- 30 (10 never + 20 lapsed)`,
  R3BX: `SELECT count(*) AS no_purchase_2026
FROM customer c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status IN ('paid', 'shipped')
  AND o.created_at >= '2026-01-01'
  AND o.id IS NULL;   -- 0 ✗`,
  R3C: `SELECT c.id, c.full_name, c.phone, max(o.created_at)::date AS last_purchase
FROM customer c
JOIN orders o ON o.customer_id = c.id AND o.status IN ('paid', 'shipped')
WHERE NOT EXISTS (SELECT 1 FROM orders o2
                  WHERE o2.customer_id = c.id
                    AND o2.status IN ('paid', 'shipped')
                    AND o2.created_at >= '2026-01-01')
GROUP BY c.id
ORDER BY last_purchase DESC, c.id;   -- 20 rows`,
  R4X: `SELECT to_char(date_trunc('month', p.paid_at), 'YYYY-MM') AS month,
       count(*) AS orders, sum(p.amount) AS revenue, sum(oi.qty) AS units
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY 1
ORDER BY 1;   -- revenue ×3, orders ×2.5 — units is right`,
  R4RAW: `SELECT p.order_id, p.amount, oi.product_id, oi.qty, oi.unit_price
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
WHERE p.order_id = 87;   -- 4 rows, 832000 four times`,
  R4TELL: `SELECT count(*) AS joined_rows, count(DISTINCT p.id) AS payments, sum(p.amount) AS revenue
FROM payment p
JOIN order_item oi ON oi.order_id = p.order_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01';   -- 1779 | 713 | 1240593000.00 ✗`,
  R4FIX: `SELECT to_char(date_trunc('month', p.paid_at), 'YYYY-MM') AS month,
       count(*) AS orders, sum(p.amount) AS revenue, sum(i.units) AS units
FROM payment p
JOIN (SELECT order_id, sum(qty) AS units
      FROM order_item
      GROUP BY order_id) i ON i.order_id = p.order_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'
GROUP BY 1
ORDER BY 1;   -- revenue back to R1, units 3528 in total`,
  R5: `SELECT c.id, c.full_name, c.city, count(*) AS orders, sum(p.amount) AS spent
FROM customer c
JOIN orders o  ON o.customer_id = c.id
JOIN payment p ON p.order_id = o.id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01'   -- filters ROWS (before grouping)
GROUP BY c.id
HAVING sum(p.amount) >= 4000000 AND count(*) >= 5   -- filters GROUPS (after)
ORDER BY spent DESC;   -- 7 rows`,
  R5X: `SELECT c.id
FROM customer c
JOIN orders o ON o.customer_id = c.id
WHERE count(*) >= 5
GROUP BY c.id;   -- ERROR aggregate functions are not allowed in WHERE`,
  R6: `SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS month,
       count(*)                                     AS placed,
       count(*) FILTER (WHERE status = 'pending')   AS pending,
       count(*) FILTER (WHERE status = 'paid')      AS paid,
       count(*) FILTER (WHERE status = 'shipped')   AS shipped,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       round(100.0 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS cancel_pct
FROM orders
WHERE created_at >= '2026-01-01' AND created_at < '2026-10-01'
GROUP BY 1
ORDER BY 1;   -- 855 placed, worst month 2026-08: 12.2 %`,
  R6X: `SELECT 100 * count(*) FILTER (WHERE status = 'cancelled') / count(*)   AS int_pct,
       round(100.0 * count(*) FILTER (WHERE status = 'cancelled') / count(*), 1) AS real_pct
FROM orders
WHERE created_at >= '2026-08-01' AND created_at < '2026-09-01';   -- 12 | 12.2`,
  R6B: `SELECT sum(amount) FILTER (WHERE method = 'cod')  AS cod,
       sum(amount) FILTER (WHERE method = 'card') AS card,
       sum(amount) FILTER (WHERE method = 'momo') AS momo,
       sum(amount) FILTER (WHERE method = 'bank') AS bank
FROM payment
WHERE paid_at >= '2026-01-01' AND paid_at < '2026-10-01';   -- adds up to 411147000`,
  T1A: `SELECT order_id, amount, paid_at
FROM payment
WHERE paid_at >= '2026-02-01 00:00+07' AND paid_at < '2026-02-01 07:00+07';   -- paid 00:48 on 1 Feb in Hà Nội = 31 Jan in UTC`,
  T1X: `SELECT to_char(date_trunc('month', paid_at), 'YYYY-MM') AS month, count(*) AS orders, sum(amount) AS revenue
FROM payment
WHERE paid_at >= '2026-01-01 00:00+07' AND paid_at < '2026-04-01 00:00+07'
GROUP BY 1 ORDER BY 1;   -- 76 / 66 / 89 ✗ (should be 75 / 64 / 92)`,
  T1: `SELECT to_char(date_trunc('month', paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'), 'YYYY-MM') AS month,
       count(*) AS orders, sum(amount) AS revenue
FROM payment
WHERE paid_at >= '2026-01-01 00:00+07' AND paid_at < '2026-04-01 00:00+07'
GROUP BY 1 ORDER BY 1;   -- 75 / 64 / 92 ✓`,
  SC1: `SELECT count(*) AS payments, sum(amount) AS revenue
FROM payment WHERE paid_at >= '2026-01-01' AND paid_at < '2026-10-01';   -- 713 | 411147000.00`,
  SC2: `SELECT sum(oi.qty) AS units, sum(oi.qty * oi.unit_price) AS item_revenue
FROM payment p JOIN order_item oi ON oi.order_id = p.order_id
WHERE p.paid_at >= '2026-01-01' AND p.paid_at < '2026-10-01';   -- 3528 | 411147000.00`,
  SC3: `SELECT count(*) AS never_ordered FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);   -- 10`,
  SC4: `SELECT count(*) AS orders_2026 FROM orders
WHERE created_at >= '2026-01-01' AND created_at < '2026-10-01';   -- 855`,
};
/* Q:END */
/* O:BEGIN */
const O = {
  R0: ` payments |   revenue    
----------+--------------
      713 | 411147000.00
(1 row)`,
  R1: `  month  | orders | buyers |   revenue   | avg_order 
---------+--------+--------+-------------+-----------
 2026-01 |     75 |     67 | 48698000.00 |    649307
 2026-02 |     64 |     56 | 31046000.00 |    485094
 2026-03 |     92 |     80 | 63914000.00 |    694717
 2026-04 |     69 |     64 | 37252000.00 |    539884
 2026-05 |     73 |     62 | 49290000.00 |    675205
 2026-06 |     81 |     68 | 40587000.00 |    501074
 2026-07 |     99 |     85 | 60560000.00 |    611717
 2026-08 |     80 |     67 | 37315000.00 |    466438
 2026-09 |     80 |     74 | 42485000.00 |    531063
(9 rows)`,
  R2: `      root       |     category     | units |   revenue    
-----------------+------------------+-------+--------------
 Dụng cụ học tập | Máy tính cầm tay |   474 | 225855000.00
 Vở & giấy       | Sổ tay           |   417 |  57392000.00
 Sách & tài liệu | Giáo trình IT    |   464 |  46354000.00
 Bút & mực       | Bút chì & tẩy    |   451 |  22782000.00
 Bút & mực       | Bút dạ quang     |   373 |  16507000.00
 Bút & mực       | Bút bi           |   506 |  15586000.00
 Dụng cụ học tập | Thước & compa    |   451 |  15114000.00
 Vở & giấy       | Vở ô ly          |   392 |  11557000.00
(8 rows)`,
  R2B: `      root       |   revenue    
-----------------+--------------
 Dụng cụ học tập | 240969000.00
 Vở & giấy       |  68949000.00
 Bút & mực       |  54875000.00
 Sách & tài liệu |  46354000.00
(4 rows)`,
  R3A: ` id  |      email      |   city    |   joined   
-----+-----------------+-----------+------------
 291 | kh291@ctshop.vn | Đà Nẵng   | 2026-08-11
 292 | kh292@ctshop.vn | TP.HCM    | 2025-04-20
 293 | kh293@ctshop.vn | Cần Thơ   | 2025-05-29
 294 | kh294@ctshop.vn | Hải Phòng | 2025-03-10
 295 | kh295@ctshop.vn | Cần Thơ   | 2025-01-11
 296 | kh296@ctshop.vn | Đà Nẵng   | 2025-07-18
 297 | kh297@ctshop.vn | Cần Thơ   | 2025-08-19
 298 | kh298@ctshop.vn | Hà Nội    | 2025-07-12
 299 | kh299@ctshop.vn | Cần Thơ   | 2025-12-10
 300 | kh300@ctshop.vn | Cần Thơ   | 2026-02-07
(10 rows)`,
  R3A2: ` never_ordered 
---------------
            10
(1 row)`,
  R3B: ` no_purchase_2026 
------------------
               30
(1 row)`,
  R3BX: ` no_purchase_2026 
------------------
                0
(1 row)`,
  R3C: ` id  |    full_name    |   phone    | last_purchase 
-----+-----------------+------------+---------------
 197 | Vũ Gia Nam      | 0931560043 | 2025-12-28
 241 | Trần Thị Bình   | 0911908479 | 2025-12-28
 186 | Lê Văn Linh     | 0981472934 | 2025-12-17
 230 | Đặng Minh An    | 0971821370 | 2025-11-28
 252 | Hoàng Văn Chi   |            | 2025-11-26
  47 | Bùi Gia Nam     | 0930372193 | 2025-11-12
  24 | Nguyễn Văn Hà   | 0350190056 | 2025-11-06
 158 | Đặng Minh Phúc  | 0321251202 | 2025-11-06
 118 | Đặng Thu Phúc   | 0810934442 | 2025-10-31
 105 | Trần Quốc Khoa  |            | 2025-10-16
 152 | Nguyễn Minh Chi | 0931203688 | 2025-10-12
  37 | Vũ Thị Nam      | 0860293003 | 2025-09-18
 141 | Vũ Quốc Bình    | 0981116579 | 2025-08-18
 221 | Vũ Gia Bình     | 0701750099 | 2025-08-01
 126 | Đặng Văn Linh   |            | 2025-07-25
 189 | Vũ Quốc Trang   |            | 2025-07-16
 264 | Nguyễn Văn Hà   | 0352090616 | 2025-06-10
 130 | Lê Thu An       | 0381029470 | 2025-04-06
 153 | Trần Quốc Dũng  | 0941211607 | 2025-03-25
 144 | Nguyễn Văn Hà   | 0351140336 | 2025-02-13
(20 rows)`,
  R4X: `  month  | orders |   revenue    | units 
---------+--------+--------------+-------
 2026-01 |    185 | 149045000.00 |   354
 2026-02 |    157 |  93381000.00 |   320
 2026-03 |    242 | 204918000.00 |   488
 2026-04 |    160 | 100083000.00 |   323
 2026-05 |    186 | 152807000.00 |   376
 2026-06 |    201 | 118270000.00 |   396
 2026-07 |    250 | 184921000.00 |   494
 2026-08 |    200 | 115884000.00 |   382
 2026-09 |    198 | 121284000.00 |   395
(9 rows)`,
  R4RAW: ` order_id |  amount   | product_id | qty | unit_price 
----------+-----------+------------+-----+------------
       87 | 832000.00 |         21 |   1 |   13000.00
       87 | 832000.00 |         37 |   3 |    5000.00
       87 | 832000.00 |         43 |   3 |   89000.00
       87 | 832000.00 |         45 |   3 |  179000.00
(4 rows)`,
  R4TELL: ` joined_rows | payments |    revenue    
-------------+----------+---------------
        1779 |      713 | 1240593000.00
(1 row)`,
  R4FIX: `  month  | orders |   revenue   | units 
---------+--------+-------------+-------
 2026-01 |     75 | 48698000.00 |   354
 2026-02 |     64 | 31046000.00 |   320
 2026-03 |     92 | 63914000.00 |   488
 2026-04 |     69 | 37252000.00 |   323
 2026-05 |     73 | 49290000.00 |   376
 2026-06 |     81 | 40587000.00 |   396
 2026-07 |     99 | 60560000.00 |   494
 2026-08 |     80 | 37315000.00 |   382
 2026-09 |     80 | 42485000.00 |   395
(9 rows)`,
  R5: ` id  |    full_name    |  city   | orders |   spent    
-----+-----------------+---------+--------+------------
 270 | Đặng Văn An     | Hà Nội  |      8 | 6936000.00
  51 | Phạm Quốc Bình  | TP.HCM  |      5 | 5328000.00
 188 | Hoàng Minh Phúc | TP.HCM  |     10 | 5108000.00
 202 | Lê Thu Chi      | Đà Nẵng |      5 | 4659000.00
 254 | Đặng Minh Hà    | TP.HCM  |      7 | 4404000.00
  94 | Đặng Thu Hà     | Cần Thơ |      5 | 4124000.00
  59 | Phạm Gia Trang  | TP.HCM  |      5 | 4015000.00
(7 rows)`,
  R5X: `psql:/tmp/lab3-solution.sql:138: ERROR:  aggregate functions are not allowed in WHERE
LINE 4: WHERE count(*) >= 5
              ^`,
  R6: `  month  | placed | pending | paid | shipped | cancelled | cancel_pct 
---------+--------+---------+------+---------+-----------+------------
 2026-01 |     96 |      12 |   28 |      48 |         8 |        8.3
 2026-02 |     78 |       7 |   28 |      36 |         7 |        9.0
 2026-03 |    113 |      15 |   47 |      44 |         7 |        6.2
 2026-04 |     80 |       5 |   33 |      36 |         6 |        7.5
 2026-05 |     89 |       9 |   36 |      37 |         7 |        7.9
 2026-06 |     93 |       6 |   28 |      53 |         6 |        6.5
 2026-07 |    113 |       9 |   39 |      61 |         4 |        3.5
 2026-08 |     98 |       6 |   33 |      47 |        12 |       12.2
 2026-09 |     95 |      10 |   27 |      52 |         6 |        6.3
(9 rows)`,
  R6X: ` int_pct | real_pct 
---------+----------
      12 |     12.2
(1 row)`,
  R6B: `     cod     |    card     |     momo     |     bank     
-------------+-------------+--------------+--------------
 38923000.00 | 77206000.00 | 132814000.00 | 162204000.00
(1 row)`,
  T1A: ` order_id |  amount  |        paid_at         
----------+----------+------------------------
      854 | 51000.00 | 2026-01-31 17:48:00+00
(1 row)`,
  T1X: `  month  | orders |   revenue   
---------+--------+-------------
 2026-01 |     76 | 48749000.00
 2026-02 |     66 | 32889000.00
 2026-03 |     89 | 62020000.00
(3 rows)`,
  T1: `  month  | orders |   revenue   
---------+--------+-------------
 2026-01 |     75 | 48698000.00
 2026-02 |     64 | 31046000.00
 2026-03 |     92 | 63914000.00
(3 rows)`,
  SC1: ` payments |   revenue    
----------+--------------
      713 | 411147000.00
(1 row)`,
  SC2: ` units | item_revenue 
-------+--------------
  3528 | 411147000.00
(1 row)`,
  SC3: ` never_ordered 
---------------
            10
(1 row)`,
  SC4: ` orders_2026 
-------------
         855
(1 row)`,
};
/* O:END */

const P = (t, o = {}) => psql(t, { title: 'psql (17.11) — ctshop', ...o });
const col = (...xs) => `<div style="display:flex;flex-direction:column;gap:12px;min-width:0">${xs.join('')}</div>`;
const p = (t, fs = 21) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;
/** Bỏ chú thích cuối dòng (-- …) khỏi câu SQL cho gọn slide. */
const bo = (s) => s.split('\n').map((l) => l.replace(/\s+--.*$/, '')).join('\n');
/** Bẻ dòng SQL dài cho vừa cột slide (chỉ đổi XUỐNG DÒNG/khoảng trắng, không đổi chữ). */
const sau0 = (l, i) => { let d = 0, q = false; for (let k = 0; k < i; k++) { const ch = l[k]; if (ch === "'") q = !q; else if (!q && ch === '(') d++; else if (!q && ch === ')') d--; } return d <= 0 && !q; };
function gon(src, W = 54) {
  const ra = [];
  const di = (l) => {
    if (l.length <= W) return ra.push(l);
    const ind = l.match(/^\s*/)[0];
    let m = l.match(/^(\s*SELECT )to_char\((date_trunc\(.*\)), '(YYYY-MM)'\)(.*)$/);
    if (m) {
      const dau = `${m[1]}to_char(${m[2]},`;
      if (dau.length > W && dau.includes("date_trunc('month', ")) { const k = dau.indexOf("date_trunc('month', ") + 20; ra.push(dau.slice(0, k - 1)); ra.push('        ' + dau.slice(k)); } else ra.push(dau);
      const pad = ' '.repeat(m[1].length + 8), j = m[4].indexOf(', ');
      if (j >= 0 && (pad + "'YYYY-MM')" + m[4]).length > W) { ra.push(`${pad}'YYYY-MM')${m[4].slice(0, j + 1)}`); return di('       ' + m[4].slice(j + 2)); }
      return di(`${pad}'YYYY-MM')${m[4]}`);
    }
    let k = l.indexOf(' / count(*)');
    if (k > 20) { ra.push(l.slice(0, k)); return di(`${ind}${l.trimStart().startsWith('SELECT') ? '        ' : '      '} ${l.slice(k + 1)}`); }
    m = l.match(/^(.*\(SELECT 1 FROM \w+ \w+)( WHERE .*)$/);
    if (m) { ra.push(m[1]); return di(' '.repeat(l.indexOf('(SELECT') + 1) + m[2].trimStart()); }
    const coChu = (i) => l.slice(0, i).trim().length > 0;
    for (let i = W; i > 18; i--) if (l.startsWith(' AND ', i) && coChu(i) && sau0(l, i)) { ra.push(l.slice(0, i)); return di(`${ind}  ${l.slice(i + 1)}`); }
    for (let i = W; i > 18; i--) if (l.startsWith(', ', i) && coChu(i) && sau0(l, i)) { ra.push(l.slice(0, i + 1)); return di(`${ind}${l.trimStart().startsWith('SELECT') ? '       ' : ind.length >= 7 ? '' : '  '}${l.slice(i + 2)}`); }
    for (let i = W; i > 18; i--) if (l.startsWith(' ON ', i)) { ra.push(l.slice(0, i)); return di(`${ind}  ${l.slice(i + 1)}`); }
    ra.push(l);
  };
  src.split('\n').map((l) => l.replace(/(\S) {2,}(AS \w+,?$)/, '$1 $2')).forEach(di);
  return ra.join('\n');
}
/** SQL của bước k cho slide: bỏ chú thích, bẻ dòng, tô các dòng chứa một trong các chuỗi `to`. */
const S = (k, to = [], o = {}) => { const t = gon(bo(Q[k]), o.W); return sql(t, { sm: true, hl: t.split('\n').map((l, i) => (to.some((x) => l.includes(x)) ? i + 1 : 0)).filter(Boolean), ...o }); };
/** Bẻ dòng output psql dài (ghi rõ "(long lines wrapped)" ở tiêu đề khung). */
const bePsql = (t, n = 64) => t.split('\n').flatMap((l) => { if (l.length <= n) return [l]; const k = l.lastIndexOf(' ', n); return [l.slice(0, k), '        ' + l.slice(k + 1)]; }).join('\n');
/** Chữ mã nhỏ hơn (13px) cho slide chật. */
const nho = (h) => h.replace(/<pre class="vs sm">/g, '<pre class="vs sm" style="font-size:13.5px;line-height:1.38">').replace(/<pre>/g, '<pre style="font-size:13px;line-height:1.34">');
/** Giữ tiêu đề + n dòng đầu của một bảng psql, rồi "…" và dòng (N rows) thật. */
const dau = (o, n) => { const L = o.split('\n'); const cuoi = L[L.length - 1]; return [...L.slice(0, 2 + n), ' …', cuoi].join('\n'); };

/* Biểu đồ cột R1: 9 tháng (số thật từ O.R1). */
const cotThang = () => {
  const rows = O.R1.split('\n').filter((l) => /^ 2026-/.test(l)).map((l) => l.split('|').map((x) => x.trim()));
  const W = 1110, H = 330, x0 = 70, bw = 86, gap = (W - x0 - 20 - 9 * bw) / 8, max = 70e6, y0 = 280;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  [0, 20, 40, 60].forEach((m) => { const y = y0 - (m * 1e6 / max) * 250; s += `<line x1="${x0 - 6}" y1="${y}" x2="${W - 10}" y2="${y}" stroke="#e3e3e3"/><text x="${x0 - 12}" y="${y + 6}" text-anchor="end" font-size="16" fill="#888">${m}M</text>`; });
  rows.forEach(([m, n, , rev], i) => {
    const v = Number(rev), h = (v / max) * 250, x = x0 + i * (bw + gap);
    const mau = m === '2026-03' || m === '2026-07' ? XANH : m === '2026-02' || m === '2026-08' ? DO : PG;
    s += `<g data-k="cot-${m}"><rect x="${x}" y="${y0 - h}" width="${bw}" height="${h}" rx="5" fill="${mau}" opacity=".88"/>`;
    s += `<text x="${x + bw / 2}" y="${y0 - h - 10}" text-anchor="middle" font-size="18" font-weight="800" fill="#333">${(v / 1e6).toFixed(1)}M</text>`;
    s += `<text x="${x + bw / 2}" y="${y0 + 24}" text-anchor="middle" font-size="17" fill="#444" font-family="Menlo,monospace">${m.slice(5)}/26</text>`;
    s += `<text x="${x + bw / 2}" y="${y0 + 46}" text-anchor="middle" font-size="15" fill="#888">${n} orders</text></g>`;
  });
  return s + `<line x1="${x0 - 6}" y1="${y0}" x2="${W - 10}" y2="${y0}" stroke="#999" stroke-width="2"/></svg>`;
};

/* Self-join: bảng category hiện HAI lần (c = con, r = cha). */
const tuNoi = () => {
  const con = [['5', 'Bút bi', 1], ['6', 'Bút chì & tẩy', 1], ['7', 'Bút dạ quang', 1], ['8', 'Vở ô ly', 2], ['9', 'Sổ tay', 2], ['10', 'Máy tính cầm tay', 3], ['11', 'Thước & compa', 3], ['12', 'Giáo trình IT', 4]];
  const cha = [['1', 'Bút & mực'], ['2', 'Vở & giấy'], ['3', 'Dụng cụ học tập'], ['4', 'Sách & tài liệu']];
  const R = 34, yc = 52, yr = 112;
  let s = `<svg viewBox="0 0 640 360" width="640" height="360" font-family="Arial">`;
  s += `<text x="6" y="22" font-size="19" font-weight="800" fill="${XANH}" font-family="Menlo,monospace">category c  (sub)</text><text x="400" y="22" font-size="19" font-weight="800" fill="${NAU}" font-family="Menlo,monospace">category r  (root)</text>`;
  s += `<rect x="6" y="32" width="300" height="${R - 6}" fill="${XANH}"/><text x="14" y="52" font-size="15" font-weight="800" fill="#fff" font-family="Menlo,monospace">id  name              parent_id</text>`;
  con.forEach(([id, n, pid], i) => { const y = yc + 8 + i * (R - 3); s += `<g data-k="c-${id}"><rect x="6" y="${y}" width="300" height="${R - 5}" fill="#fff" stroke="#c9d5e2"/><text x="14" y="${y + 20}" font-size="15" fill="#333" font-family="Menlo,monospace">${id.padStart(2)}  ${esc(n.padEnd(17))}</text><text x="282" y="${y + 20}" text-anchor="end" font-size="15" font-weight="800" fill="${PG}" font-family="Menlo,monospace">${pid}</text></g>`; });
  s += `<rect x="400" y="32" width="230" height="${R - 6}" fill="${NAU}"/><text x="408" y="52" font-size="15" font-weight="800" fill="#fff" font-family="Menlo,monospace">id  name</text>`;
  cha.forEach(([id, n], i) => { const y = yr + i * 52; s += `<g data-k="r-${id}"><rect x="400" y="${y}" width="230" height="40" rx="4" fill="#fff7ef" stroke="${NAU}" stroke-width="1.6"/><text x="408" y="${y + 26}" font-size="15" fill="#333" font-family="Menlo,monospace">${id}  ${esc(n)}</text></g>`; });
  const mau = [CAM, CAM, CAM, PG, PG, XANH, XANH, TIM];
  con.forEach(([, , pid], i) => { const y1 = yc + 8 + i * (R - 3) + 14, y2 = yr + (pid - 1) * 52 + 20; s += `<path d="M306,${y1} C350,${y1} 356,${y2} 398,${y2}" fill="none" stroke="${mau[i]}" stroke-width="2.2" opacity=".85"/>`; });
  s += `<text x="320" y="352" text-anchor="middle" font-size="17" font-weight="700" fill="#555" font-family="Menlo,monospace">JOIN category r ON r.id = c.parent_id</text>`;
  return s + '</svg>';
};

/* Fan-out: 1 dòng payment bị chép thành 4 dòng của đơn 87. */
const fanOut = () => {
  const L = [['21', '1', '13000'], ['37', '3', '5000'], ['43', '3', '89000'], ['45', '3', '179000']];
  let s = `<svg viewBox="0 0 1110 285" width="1040" height="267" font-family="Arial" style="align-self:center">
<defs><marker id="f3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>`;
  s += `<text x="10" y="26" font-size="19" font-weight="800" fill="${NAU}" font-family="Menlo,monospace">payment (one row)</text>`;
  s += `<g data-k="pay87"><rect x="10" y="118" width="250" height="56" rx="8" fill="#fff7ef" stroke="${NAU}" stroke-width="2.5"/><text x="24" y="153" font-size="20" font-weight="800" fill="#333" font-family="Menlo,monospace">87 · 832000</text></g>`;
  s += `<text x="350" y="26" font-size="19" font-weight="800" fill="${CAM}" font-family="Menlo,monospace">order_item (4 lines of order 87)</text>`;
  L.forEach(([pid, q, u], i) => {
    const y = 42 + i * 62;
    s += `<path d="M262,146 C300,146 300,${y + 24} 342,${y + 24}" fill="none" stroke="${NAU}" stroke-width="2.4" marker-end="url(#f3)"/>`;
    s += `<g data-k="dong-${i}"><rect x="346" y="${y}" width="330" height="48" rx="6" fill="#fff" stroke="#c9d5e2" stroke-width="1.6"/><text x="360" y="${y + 31}" font-size="18" fill="#333" font-family="Menlo,monospace">product ${pid.padStart(2)} · qty ${q} · ${u}</text>`;
    s += `<rect x="690" y="${y + 6}" width="150" height="36" rx="6" fill="#fde2e0" stroke="${DO}" stroke-width="1.6"/><text x="765" y="${y + 31}" text-anchor="middle" font-size="18" font-weight="800" fill="#a52a1d" font-family="Menlo,monospace">832000</text></g>`;
  });
  s += `<g data-k="tong"><text x="870" y="120" font-size="20" font-weight="800" fill="#a52a1d">sum(p.amount)</text><text x="870" y="150" font-size="24" font-weight="900" fill="#a52a1d" font-family="Menlo,monospace">3328000 ✗</text>`;
  s += `<text x="870" y="200" font-size="20" font-weight="800" fill="#1f6b40">real payment</text><text x="870" y="230" font-size="24" font-weight="900" fill="#1f6b40" font-family="Menlo,monospace">832000 ✓</text></g>`;
  return s + '</svg>';
};

/* Sửa: gộp order_item về 1 dòng/đơn rồi mới nối 1–1. */
const gopTruoc = () => `<svg viewBox="0 0 1110 170" width="1110" height="170" font-family="Arial">
<defs><marker id="g3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${XANH}"/></marker></defs>
<g data-k="bon"><rect x="6" y="20" width="300" height="130" rx="10" fill="#fff" stroke="${CAM}" stroke-width="2.4"/>
<text x="20" y="48" font-size="17" font-weight="800" fill="${CAM}" font-family="Menlo,monospace">order_item · order 87</text>
<text x="20" y="76" font-size="16" fill="#333" font-family="Menlo,monospace">4 lines · qty 1 + 3 + 3 + 3</text>
<text x="20" y="104" font-size="16" fill="#555">many rows per order</text></g>
<line x1="310" y1="85" x2="400" y2="85" stroke="${XANH}" stroke-width="4" marker-end="url(#g3)"/><text x="355" y="70" text-anchor="middle" font-size="15" font-weight="800" fill="${XANH}">GROUP BY</text>
<g data-k="mot"><rect x="406" y="40" width="310" height="90" rx="10" fill="#eaf4ee" stroke="${XANH}" stroke-width="2.6"/>
<text x="420" y="74" font-size="17" font-weight="800" fill="#1f5c38" font-family="Menlo,monospace">i: order 87 · units 10</text>
<text x="420" y="104" font-size="16" fill="#1f5c38">exactly ONE row per order</text></g>
<line x1="720" y1="85" x2="800" y2="85" stroke="${XANH}" stroke-width="4" marker-end="url(#g3)"/><text x="760" y="70" text-anchor="middle" font-size="15" font-weight="800" fill="${XANH}">JOIN 1–1</text>
<g data-k="ket"><rect x="806" y="40" width="298" height="90" rx="10" fill="#fff" stroke="${XANH}" stroke-width="2.6"/>
<text x="820" y="74" font-size="17" font-weight="800" fill="#1f5c38" font-family="Menlo,monospace">832000 · units 10</text>
<text x="820" y="104" font-size="16" fill="#1f5c38">counted once ✓</text></g>
</svg>`;

export const slides = lamDeck({ chuong: 'Lab 3 · CT Shop', bai: '' }, [
  { cover: true, t: 'Lab 3 — CT Shop:<br>the 9-month report', sub: 'JOIN 5 tables · self-join · LEFT JOIN anti-join · NOT EXISTS ·<br>the fan-out trap · HAVING · FILTER · a report that survives UTC' },

  { t: 'Your assignment', body: two(
    box('Friday, 19:40 — a message from the owner', `<p style="margin:0 0 8px">“Monday 9:00, nine-month review. I need <b>revenue by month</b>, <b>which categories make the money</b>, <b>who we should call back</b>, a <b>VIP list</b> for vouchers, and <b>how many orders get cancelled</b>.”</p>
<p style="margin:0">Period: <b>1 Jan → 30 Sep 2026</b>. Data: the complete CT Shop — order lines, payments, reviews.</p>`, 'lam'),
    col(`<div class="tcap">Done means — your numbers are</div>`, steps([
      '<b>713</b> payments · <b>411.147.000 đ</b> (R0, R1)',
      'the 4 root categories add up to <b>411.147.000</b> (R2)',
      '<b>10</b> never ordered · <b>30</b> no purchase in 2026 (R3)',
      '<b>3.528</b> units, revenue NOT inflated (R4)',
      '<b>7</b> VIP (R5) · <b>855</b> orders placed, August <b>12,2 %</b> cancelled (R6)',
    ]))), giua: true, to: true },

  { t: 'Files and setup — a clean shop', body: `
${tbl(['File', 'What it is'], [
  ['lab3-start.sql', 'Rebuilds schema <b>shop</b> with the standard data (= ctshop-schema.sql + ctshop-data.sql) + the R0–R6 to-do list'],
  ['lab3-solution.sql', 'Every query, every trap, the real output in the comments — open it after your own attempt'],
], { w: 1110 })}
${sh(`$ docker cp lab3-start.sql pgdemo:/tmp/
$ docker exec -i pgdemo psql -U postgres -d ctshop -q -f /tmp/lab3-start.sql
 categories | products | customers | orders | order_lines | payments
------------+----------+-----------+--------+-------------+----------
         12 |       48 |       300 |   2000 |        5000 |     1663
$ docker exec -it pgdemo psql -U postgres -d ctshop
ctshop=# SET search_path = shop;  SET TimeZone = 'Asia/Ho_Chi_Minh';`, { sm: true, hl: [5] })}
${cards([['R0 – R2 · money', 'by month, by category — and the totals must agree'], ['R3 · people', 'who never bought, who stopped buying, who to call'], ['R4 – R6 · traps', 'fan-out, HAVING vs WHERE, FILTER, integer ÷, UTC']], 3)}
${p('Deterministic data (<code class="i">setseed</code>): your numbers match the lesson exactly — whatever Lab 1 and Lab 2 left behind is gone.', 20)}` },

  { t: 'Two decisions before the first query', body: two(col(
    box('1 · Which date?', `Money counts on the day it is <b>paid</b>: ${c('payment.paid_at')}.<br>Order counts (R6) use ${c('orders.created_at')}.<br><span class="nho">An order placed at 23:50 is paid after midnight — the two dates can disagree by a day, even by a month.</span>`, 'lam'),
    box('2 · Which period?', `Half-open, always:<br>${c("paid_at >= '2026-01-01'")}<br>${c("AND paid_at < '2026-10-01'")}<br><span class="nho">BETWEEN … '2026-09-30' would cut 30 September at 00:00 (Lab 2).</span>`, '')),
  col(box('The question of this lab', '<b>What is one row here?</b><br>Ask it before you trust any total. Every bug in this lab is a wrong answer to that question.', 'xanh'),
    S('R0'), P(O.R0, { sm: true }), p('R0 is the <b>anchor</b>: every later report must agree with it.', 20))), giua: true },

  { t: 'The map: which tables does the report touch?', body: `${erdShop({ sang: ['payment', 'orders', 'order_item', 'product', 'category', 'customer'], mo: ['review', 'stock_movement'], w: 1000, h: 468 })}`.replace('<svg', '<svg style="align-self:center"') +
    p('Path for money by category: <b>payment → order_item → product → category → category</b> (its parent). Customers: <b>customer → orders → payment</b>.', 20) },

  { t: 'R1 · revenue by month', body: two(col(S('R1', ['JOIN orders']), box('Why count(*) is safe here', 'One payment per order (UNIQUE from Lab 1) ⇒ one row = one order. Buyers need <code class="i">orders</code>: count(DISTINCT o.customer_id).', 'xanh')), P(O.R1, { sm: true })) },

  { t: 'The nine months at a glance', body: `${cotThang()}
${two(box('Read it like the owner', 'March (63.9M) and July (60.6M) are the best months; February and August the weakest. The bars add up to <b>411.147.000</b> = R0.', 'lam'),
    box('What GROUP BY did', 'Each of the 713 payments was dropped into the basket of its month — 9 baskets, one row per basket.', ''))}` },

  { t: 'R2 · which categories make the money', body: two(S('R2', ['JOIN category r']), col(P(O.R2, { sm: true }), p('Calculators: <b>6 of 48</b> products, <b>55 %</b> of the money. Revenue per line = qty × unit_price — the price <i>at the time of purchase</i>.', 19))) },

  { t: 'Self-join: the same table, two roles', body: two(`<div style="display:flex;justify-content:center">${tuNoi()}</div>`, col(P(O.R2B, { sm: true, title: 'R2b · rolled up to the 4 roots' }),
    box('Two reports that agree', '240.969.000 + 68.949.000 + 54.875.000 + 46.354.000 = <b>411.147.000</b> — R0 again, computed from a different table. The cheapest test you will ever write.', 'xanh'),
    box('Only two levels', 'The self-join assumes exactly sub → root. Lab 4 replaces it with a recursive query that works at any depth.', '')), 'r64') },

  { t: 'R3a · never ordered: two ways to say it', body: two(col(`<div class="tcap">LEFT JOIN … IS NULL (anti-join)</div>`, S('R3A', ['o.id IS NULL']), P(dau(O.R3A, 4), { sm: true, title: 'first 4 of 10 rows' })),
    col(`<div class="tcap">NOT EXISTS — new, Chapter 7 goes deeper</div>`, S('R3A2', ['NOT EXISTS']), P(O.R3A2, { sm: true }),
      box('Read it as a sentence', 'Keep customer c if there does <b>not exist</b> an order with customer_id = c.id. Yes/no only ⇒ <code class="i">SELECT 1</code>. It can never multiply rows.', 'lam'))) },

  { t: 'R3b · no purchase in 2026 — ON, not WHERE', body: vsd(col(S('R3BX', ['o.status', 'o.created_at']), P(O.R3BX, { sm: true }),
    p('WHERE runs <b>after</b> the join: on the “no match” rows o.status is NULL ⇒ not true ⇒ removed. The LEFT JOIN became an INNER JOIN.', 19)),
  col(S('R3B', ['o.status', 'o.created_at']), P(O.R3B, { sm: true }), p('Conditions that say <b>which orders count</b> belong in ON. 30 = 10 never ordered + 20 lapsed.', 19)), '✗ Condition in WHERE', '✓ Condition in ON') },

  { t: 'R3c · the call list: 20 lapsed customers', body: two(S('R3C', ['NOT EXISTS']), col(P(dau(O.R3C, 9), { sm: true, title: 'first 9 of 20 rows · latest purchase first' }),
    box('Who to call first', 'Customers who left in December are the easiest to win back. Four of the 20 have no phone — they get an email instead.', 'xanh'))) },

  { t: 'R4 · “just add units sold” — run it first', body: two(col(S('R4X', ['JOIN order_item']), box('Compare with R1', 'March: <b class="do">204.918.000</b> instead of 63.914.000. 242 “orders” instead of 92. No error, every number plausible — and the units column is even right.', 'do2')), P(O.R4X, { sm: true, hl: [5] })) },

  { t: 'Look at the raw rows: fan-out', body: `${fanOut()}
${two(col(P(O.R4RAW, { sm: true, title: 'raw rows: … JOIN order_item … WHERE p.order_id = 87' }), p('Order 87 has <b>4 lines</b> ⇒ its one payment appears <b>4 times</b>.', 19)), col(P(O.R4TELL, { sm: true, title: 'the tell: count(*) beside count(DISTINCT key)' }),
  box('The grain is wrong', '1.779 rows for 713 payments. Period total <b class="do">1.240.593.000</b> — three times the truth.', 'do2')))}` },

  { t: 'R4 · the fix: aggregate first, then join', body: `${gopTruoc()}
${two(col(S('R4FIX', ['JOIN (SELECT', 'FROM order_item', 'GROUP BY order_id']), p('Revenue back to R1, units add up to <b>3.528</b>.', 20)), P(O.R4FIX, { sm: true }))}` },

  { t: 'R5 · the VIP list — WHERE for rows, HAVING for groups', body: `${flow([{ t: 'FROM / JOIN', s: 'all joined rows', mau: PG }, { t: 'WHERE', s: 'the period (rows)', mau: CAM }, { t: 'GROUP BY', s: 'one group per c.id', mau: PG }, { t: 'HAVING', s: '≥ 4M AND ≥ 5 orders', mau: XANH }, { t: 'SELECT', s: 'ORDER BY · 7 rows', mau: PG }], { h: 120, fs: 19 })}
${two(S('R5', ['WHERE', 'HAVING']), col(P(O.R5, { sm: true }), p('Customer 60: 6.831.000 đ but 3 orders. Customer 240: 6 orders but 3.687.000 đ. The AND keeps neither.', 18)))}` },

  { t: 'Trap: an aggregate in WHERE', body: two(col(S('R5X', ['count(*) >= 5']), P(bePsql(O.R5X, 58), { sm: true, title: 'psql (17.11) — ctshop · long line wrapped' })),
    col(box('Why it cannot work', 'WHERE decides about <b>one row at a time</b>, before any group exists — there is no count(*) to ask about yet.', 'do2'),
      box('Rule', 'Condition on a <b>column</b> ⇒ WHERE (cheaper: fewer rows to group).<br>Condition on an <b>aggregate</b> ⇒ HAVING.', 'xanh'),
      box('GROUP BY c.id, SELECT c.full_name?', 'Allowed: id is the primary key, so the name cannot vary inside the group (functional dependency).', 'lam'))), giua: true },

  { t: 'R6 · order health by month — FILTER', body: nho(S('R6', ['FILTER'], { W: 90 }) + P(O.R6, { sm: true, hl: [10], title: 'count(*) FILTER (WHERE …) counts only the rows that pass its own WHERE — August: 12 of 98 cancelled' })) },

  { t: 'Two small traps, one bonus', body: nho(two(col(`<div class="tcap">integer ÷ integer = integer</div>`, S('R6X', ['100 *'], { W: 70 }), P(O.R6X, { sm: true }),
    p('count(*) is bigint: 1200 / 98 = 12, the decimals are <b>dropped</b>. Write <code class="i">100.0 *</code>.', 19)),
  col(`<div class="tcap">bonus · payment methods in one row</div>`, S('R6B', [], { W: 70 }), P(O.R6B, { sm: true }),
    p('Adds up to 411.147.000 again. COD: 183 payments (MoMo 184) but the least money — cash for small orders.', 19)))) },

  { t: 'T1 · the report that changes when the server moves', body: two(col(P(`ctshop=# SET TimeZone = 'UTC';\n${O.T1A}`, { sm: true, title: 'order 854: paid 00:48 on 1 Feb in Hà Nội', hl: [4] }),
    P(O.T1X, { sm: true, title: '✗ date_trunc in a UTC session' }), p('Same data, same query: 76 / 66 / 89.', 19)),
  col(S('T1', ['AT TIME ZONE']), P(O.T1, { sm: true, title: '✓ AT TIME ZONE inside the query' }),
    box('Why', 'date_trunc on timestamptz uses the <b>session</b> TimeZone — Docker and most clouds run UTC. Name the zone in the query.', 'xanh'))) },

  { t: 'In a real Node app: Prisma groupBy vs raw SQL', body: two(col(sql(`// one table, plain columns — groupBy is fine
const byStatus = await prisma.orders.groupBy({
  by: ['status'],
  _count: { _all: true },
  where: { created_at: { gte: from, lt: to } },
});`, { sm: true, lang: 'typescript' }), box('groupBy cannot', 'date_trunc · JOIN · count(DISTINCT) · FILTER. Reports like R1 are written in SQL.', '')),
  col(sql(`const rows = await prisma.$queryRaw\`
  SELECT to_char(date_trunc('month',
           p.paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'),
           'YYYY-MM') AS month,
         count(*)::int AS orders,  -- BigInt otherwise
         sum(p.amount) AS revenue  -- Prisma.Decimal
  FROM shop.payment p
  JOIN shop.orders o ON o.id = p.order_id
  WHERE p.paid_at >= \${from} AND p.paid_at < \${to}
  GROUP BY 1 ORDER BY 1\`;`, { sm: true, lang: 'typescript', hl: [5, 9] }), box('$queryRaw', 'The tagged template sends <b>from</b>/<b>to</b> as parameters — never glued into the string (no SQL injection).', 'xanh')), 'r46') +
    box('Rule of thumb on real projects', 'ORM for everyday reads and writes (one table, a few relations). <b>SQL for reports</b> — and the SQL is exactly what you wrote in this lab, so test it in psql first.', 'lam') },

  { t: 'Self-check — your numbers must match', body: two(tbl(['check', 'expected'], [
    ['R0 · payments', '713'],
    ['R0 · revenue', '411.147.000'],
    ['R2b · 4 roots added up', '411.147.000'],
    ['R3a · never ordered', '10 (291–300)'],
    ['R3b · no purchase in 2026', '30'],
    ['R4 · units in the period', '3.528'],
    ['R5 · VIP', '7'],
    ['R6 · orders placed', '855'],
    ['R6 · August cancel %', '12,2'],
  ], { cap: 'after R0–R6' }), col(`<ol style="font-size:21px;margin:0;padding-left:26px">
<li>R4’s wrong query: units right, revenue ×3. Why?</li>
<li>R3b: why does moving the 2026 condition to WHERE give 0?</li>
<li>Why may GROUP BY c.id select c.full_name?</li></ol>`,
  box('Answers', '1 · qty lives on the many side (once per line); amount on the one side, copied to every line. 2 · WHERE runs after the join and removes the NULL “no match” rows. 3 · id is the primary key — the name depends on it.', 'xanh'))), giua: true },

  { t: 'Traps of Lab 3', body: vsd(`<ul style="font-size:22px">
<li>sum(one-side amount) after joining a many-side table</li>
<li>Right-table condition of a LEFT JOIN in WHERE</li>
<li>count(*) in WHERE</li>
<li>100 * a / b with integers</li>
<li>date_trunc in whatever TimeZone the server has</li>
<li>created_at here, paid_at there</li></ul>`,
  `<ul style="font-size:22px">
<li>Aggregate the many side first; check count(*) vs count(DISTINCT)</li>
<li>Put it in ON (or use NOT EXISTS)</li>
<li>HAVING count(*) &gt;= 5</li>
<li>100.0 * a / b</li>
<li>AT TIME ZONE 'Asia/Ho_Chi_Minh'</li>
<li>One date per report, written on the report</li></ul>`, '✗ Trap', '✓ Do this'), giua: true },

  { t: 'Summary — and next: Lab 4', body: two(steps([
    'Decide the <b>date</b> and the <b>half-open period</b> first',
    'Anchor number (R0) ⇒ every report must agree with it',
    'Self-join for the parent · LEFT JOIN … IS NULL / NOT EXISTS for “without”',
    '<b>What is one row?</b> — aggregate the many side before joining',
    'WHERE for rows, HAVING for groups, FILTER for one column per case',
  ]), box('Lab 4 — after Chapter 8', 'Growth vs last month and last year (<b>LAG</b>), a running total, the <b>top 3</b> of every category, each category’s <b>share %</b>, and a category tree that survives a third level (<b>WITH RECURSIVE</b>).', 'lam'), 'r64'), giua: true, to: true },
]);
