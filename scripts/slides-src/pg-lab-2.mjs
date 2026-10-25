/**
 * pg-lab-2 — PostgreSQL · Lab 2 · CT Shop "Fill the shop, ask it questions" (slide EN, kiểu FU, agent lab 25/10/2026).
 * Nguồn: content/courses/postgresql/lab/lab-2.mjs + lab/sql/lab2-*.{sql,csv}. Output psql = chạy thật PostgreSQL 17.11
 * (container pgcourse17, DB ctlab, lab2-solution.sql chạy bằng psql -f) — video-bai-giang/src/khung/pg/that/pg-lab-2*.out.txt.
 * Chỉ dùng kiến thức tới Ch4 (một bảng mỗi truy vấn; JOIN để Lab 3). COPY/\copy, EXCLUDED, keyset giảng mới ngay trong lab.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, sh, c, esc } from './_pg-chung.mjs';
import { PG, CAM, NAU, XANH, DO } from './pg-lab-hinh.mjs';

export const deck = { key: 'pg-lab-2', code: 'PG Lab 2', title: 'Lab 2 — CT Shop: fill the shop, ask it questions', sub: 'COPY, UPSERT, 10 queries, safe changes' };

const P = (t, o = {}) => psql(t, { title: 'psql (17.11) — ctshop', ...o });
const R = (q, o, opts = {}) => run(q, o, { title: 'psql (17.11) — ctshop', ...opts });
const col = (...xs) => `<div style="display:flex;flex-direction:column;gap:12px;min-width:0">${xs.join('')}</div>`;

/* COPY (máy chủ đọc đĩa của nó) vs \copy (psql đọc tệp trên máy bạn rồi gửi qua kết nối). */
const copyHinh = () => `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial">
<defs><marker id="m2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>
<rect x="10" y="20" width="380" height="210" rx="16" fill="#eef4fa" stroke="${PG}" stroke-width="2.5"/>
<text x="200" y="54" text-anchor="middle" font-size="22" font-weight="800" fill="${PG}">Your machine</text>
<text x="60" y="118" font-size="44">📄</text><text x="112" y="108" font-size="19" fill="#333" font-family="Menlo,monospace">lab2-products.csv</text>
<text x="112" y="134" font-size="16" fill="#666">the file you downloaded</text>
<rect x="60" y="160" width="280" height="50" rx="10" fill="#fff" stroke="${PG}" stroke-width="2"/><text x="200" y="192" text-anchor="middle" font-size="20" font-weight="700" fill="#333" font-family="Menlo,monospace">psql  \\copy …</text>
<rect x="720" y="20" width="380" height="210" rx="16" fill="#eaf4ee" stroke="${XANH}" stroke-width="2.5"/>
<text x="910" y="54" text-anchor="middle" font-size="22" font-weight="800" fill="${XANH}">PostgreSQL server</text>
<text x="760" y="118" font-size="44">🐘</text><text x="820" y="108" font-size="19" fill="#333" font-family="Menlo,monospace">COPY … FROM 'path'</text>
<text x="820" y="134" font-size="16" fill="#666">reads the SERVER's own disk</text>
<rect x="770" y="160" width="280" height="50" rx="10" fill="#fff" stroke="${XANH}" stroke-width="2"/><text x="910" y="192" text-anchor="middle" font-size="20" font-weight="700" fill="#333" font-family="Menlo,monospace">table shop.product</text>
<line x1="342" y1="185" x2="764" y2="185" stroke="${NAU}" stroke-width="4" marker-end="url(#m2)"/>
<text x="553" y="172" text-anchor="middle" font-size="18" font-weight="700" fill="${NAU}">rows stream over the connection</text>
<text x="553" y="215" text-anchor="middle" font-size="17" fill="#555">(COPY … FROM STDIN under the hood)</text>
</svg>`;

/* UPSERT rẽ nhánh. */
const upsertHinh = () => `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial">
<defs><marker id="m3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>
<rect x="10" y="80" width="250" height="70" rx="12" fill="#fff7ef" stroke="${CAM}" stroke-width="2.5"/>
<text x="135" y="110" text-anchor="middle" font-size="19" font-weight="800" fill="#9a4a12">a row arrives</text><text x="135" y="134" text-anchor="middle" font-size="16" fill="#555" font-family="Menlo,monospace">CT1001 · 720000 · +30</text>
<path d="M330,115 L420,60 L510,115 L420,170 z" fill="#eef4fa" stroke="${PG}" stroke-width="2.5"/>
<text x="420" y="110" text-anchor="middle" font-size="17" font-weight="800" fill="${PG}">sku already</text><text x="420" y="130" text-anchor="middle" font-size="17" font-weight="800" fill="${PG}">exists?</text>
<line x1="262" y1="115" x2="326" y2="115" stroke="${NAU}" stroke-width="3.5" marker-end="url(#m3)"/>
<path d="M500,95 L600,40 L640,40" fill="none" stroke="${NAU}" stroke-width="3.5" marker-end="url(#m3)"/>
<path d="M500,135 L600,190 L640,190" fill="none" stroke="${NAU}" stroke-width="3.5" marker-end="url(#m3)"/>
<text x="560" y="52" font-size="17" font-weight="800" fill="${XANH}">yes</text><text x="560" y="198" font-size="17" font-weight="800" fill="${DO}">no</text>
<rect x="645" y="8" width="455" height="70" rx="12" fill="#eaf4ee" stroke="${XANH}" stroke-width="2.5"/>
<text x="660" y="38" font-size="18" font-weight="800" fill="#1f5c38">DO UPDATE — the shelf row changes</text><text x="660" y="62" font-size="16" fill="#333" font-family="Menlo,monospace">price = EXCLUDED.price, stock = stock + 30</text>
<rect x="645" y="152" width="455" height="70" rx="12" fill="#fdf0ee" stroke="${DO}" stroke-width="2.5"/>
<text x="660" y="182" font-size="18" font-weight="800" fill="#a52a1d">INSERT — a new product appears</text><text x="660" y="206" font-size="16" fill="#333" font-family="Menlo,monospace">CT1207 · 119000 · stock 40 · new id</text>
</svg>`;

/* Đường thời gian tháng 9: BETWEEN dừng ở 30/09 00:00. */
const thangChin = () => {
  const W = 1110, x0 = 40, x1 = 1070, day = (d) => x0 + ((d - 1) / 31) * (x1 - x0);
  let s = `<svg viewBox="0 0 ${W} 170" width="${W}" height="170" font-family="Arial">`;
  s += `<rect x="${day(1)}" y="40" width="${day(30) - day(1)}" height="34" fill="#fde2e0" stroke="${DO}" stroke-width="2"/>`;
  s += `<rect x="${day(1)}" y="92" width="${day(31) - day(1)}" height="34" fill="#e3f3e8" stroke="${XANH}" stroke-width="2"/>`;
  s += `<text x="${day(1) + 10}" y="63" font-size="17" font-weight="700" fill="#a52a1d">BETWEEN '2026-09-01' AND '2026-09-30'  → 91</text>`;
  s += `<text x="${day(1) + 10}" y="115" font-size="17" font-weight="700" fill="#1f6b40">&gt;= '2026-09-01' AND &lt; '2026-10-01'  → 95</text>`;
  [1, 10, 20, 30].forEach((d) => { s += `<line x1="${day(d)}" y1="30" x2="${day(d)}" y2="134" stroke="#bbb" stroke-dasharray="4 4"/><text x="${day(d) - (d === 30 ? 4 : 0)}" y="155" text-anchor="${d === 30 ? 'end' : 'middle'}" font-size="16" fill="#555">${String(d).padStart(2, '0')}/09</text>`; });
  s += `<text x="${day(31) + 4}" y="155" text-anchor="start" font-size="16" fill="#555">01/10</text>`;
  s += `<rect x="${day(30)}" y="86" width="${day(31) - day(30)}" height="46" fill="#ffd54f" opacity=".55"/><text x="${(day(30) + day(31)) / 2}" y="24" text-anchor="middle" font-size="16" font-weight="800" fill="#9a4a12">4 orders lost</text>`;
  return s + '</svg>';
};

/* OFFSET vs keyset. */
const trangHinh = () => {
  let s = `<svg viewBox="0 0 1110 200" width="1110" height="200" font-family="Arial">`;
  for (let i = 0; i < 30; i++) {
    const x = 20 + i * 35, page = Math.floor(i / 10);
    const fill = page < 2 ? '#f0f0f0' : '#e3f3e8', st = page < 2 ? '#bbb' : XANH;
    s += `<rect x="${x}" y="30" width="30" height="40" rx="4" fill="${fill}" stroke="${st}" stroke-width="1.5"/>`;
  }
  s += `<text x="20" y="22" font-size="17" font-weight="700" fill="#555">orders, newest first — page 1 · page 2 · page 3</text>`;
  s += `<path d="M20,90 L715,90" stroke="${DO}" stroke-width="4" stroke-dasharray="9 6"/><text x="20" y="116" font-size="17" font-weight="700" fill="#a52a1d">OFFSET 20: read 20 rows, throw them away, then return 10 — page 1000 reads 10,000 rows</text>`;
  s += `<path d="M715,140 L1065,140" stroke="${XANH}" stroke-width="5"/><circle cx="715" cy="140" r="8" fill="${XANH}"/>`;
  s += `<text x="20" y="146" font-size="17" font-weight="700" fill="#1f6b40">keyset:</text><text x="96" y="146" font-size="17" fill="#1f6b40">start right after the last row you showed —</text>`;
  s += `<text x="20" y="172" font-size="17" fill="#1f6b40" font-family="Menlo,monospace">WHERE (created_at, id) &lt; ('2026-09-26 16:54+07', 1522)</text>`;
  return s + '</svg>';
};

const OUT_S1 = ` id |      name
----+-----------------
  1 | Bút & mực
  2 | Vở & giấy
  3 | Dụng cụ học tập
  4 | Sách & tài liệu
(4 rows)

INSERT 0 4`;
const OUT_S2 = ` id |       name       | parent_id
----+------------------+-----------
  5 | Bút bi           |         1
  6 | Bút chì & tẩy    |         1
  7 | Bút dạ quang     |         1
  8 | Vở ô ly          |         2
  9 | Sổ tay           |         2
 10 | Máy tính cầm tay |         3
 11 | Thước & compa    |         3
 12 | Giáo trình IT    |         4
(8 rows)

INSERT 0 8`;

export const slides = lamDeck({ chuong: 'Lab 2 · CT Shop', bai: '' }, [
  { cover: true, t: 'Lab 2 — CT Shop:<br>fill the shop, ask it questions', sub: 'Multi-row INSERT · RETURNING · COPY from CSV · UPSERT a price list ·<br>10 business questions · UPDATE/DELETE inside BEGIN … ROLLBACK' },

  { t: 'Your assignment', body: two(
    box('Launch day', `<p style="margin:0 0 8px">The owner exports the old spreadsheet: <b>48 products, 300 customers, 2,000 orders</b> as CSV. A supplier sends a new <b>price list</b>. Then the team starts asking questions.</p>
<p style="margin:0">Load everything into the Lab 1 schema, answer <b>10 questions</b> with real numbers, and change data <b>without ever losing a row by accident</b>.</p>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      '12 categories, 48 → <b>50</b> products, <b>300</b> customers, <b>2,000</b> orders',
      'The price list applied with <b>one</b> UPSERT',
      'Q1–Q10 return exactly the numbers in the lesson',
      'Every UPDATE/DELETE runs inside <b>BEGIN</b> and is checked before COMMIT',
      'Self-check: 50 · 8129 · 54 · 300 · 2000 · 10 · 327',
    ]))), giua: true },

  { t: 'Files and setup', body: `
${tbl(['File', 'Rows', 'What it is'], [
  ['lab2-start.sql', '—', 'The empty standard schema (= Lab 1 solution) — start from a clean slate'],
  ['lab2-products.csv', '48', 'sku, name, category_id, price, stock, attrs (JSON), is_active, created_at'],
  ['lab2-customers.csv', '300', 'email, full_name, phone (42 empty), city, created_at'],
  ['lab2-orders.csv', '2,000', 'customer_id, status, created_at, note'],
  ['lab2-price-update.csv', '6', 'the supplier’s new price list: 4 known skus + 2 new products'],
  ['lab2-solution.sql', '—', 'every step, every answer, real output in the comments'],
], { w: 1110 })}
${sh(`$ for f in lab2-*.csv; do docker cp $f pgdemo:/tmp/; done
$ docker exec -i pgdemo psql -U postgres -d ctshop < lab2-start.sql
$ docker exec -it pgdemo psql -U postgres -d ctshop
ctshop=# SET search_path = shop;  SET TimeZone = 'Asia/Ho_Chi_Minh';`, { sm: true })}` },

  { t: 'Load order = follow the arrows again', body: two(col(steps([
    '<b>S1–S2</b> · category — 12 rows typed by hand: multi-row INSERT + RETURNING',
    '<b>S3</b> · product ← lab2-products.csv (needs category)',
    '<b>S4</b> · customer ← lab2-customers.csv',
    '<b>S5</b> · orders ← lab2-orders.csv (needs customer)',
    '<b>S6</b> · supplier price list → UPSERT into product',
  ]), tbl(['table', 'rows after loading'], [['category', '12'], ['product', '48 → 50 after S6'], ['customer', '300'], ['orders', '2,000']], { cap: 'what you should have at the end of S6' })), col(box('Why this order?', 'A CSV row of <code class="i">orders</code> says <code class="i">customer_id = 61</code>. The foreign key checks that customer 61 exists — so customers must be loaded first, exactly like CREATE TABLE in Lab 1.', 'lam'),
  box('TimeZone matters', 'The CSV times carry <b>+07</b>. The Docker image runs in <b>UTC</b> — set <code class="i">TimeZone = \'Asia/Ho_Chi_Minh\'</code> so the lab’s outputs and date filters match yours.', '')), 'r64') },

  { t: 'S1–S2 · categories with one INSERT each', body: two(col(sql(`INSERT INTO category (name)
VALUES ('Bút & mực'),
       ('Vở & giấy'),
       ('Dụng cụ học tập'),
       ('Sách & tài liệu')
RETURNING id, name;`, { sm: true }), P(OUT_S1, { sm: true })),
  col(sql(`INSERT INTO category (name, parent_id)
VALUES ('Bút bi', 1), ('Bút chì & tẩy', 1), ('Bút dạ quang', 1),
       ('Vở ô ly', 2), ('Sổ tay', 2),
       ('Máy tính cầm tay', 3), ('Thước & compa', 3),
       ('Giáo trình IT', 4)
RETURNING id, name, parent_id;`, { sm: true, hl: [2] }), P(OUT_S2, { sm: true }),
  `<p style="font-size:19px;margin:0">Step 1’s RETURNING told us the parents are 1–4 — that is where the numbers in step 2 come from.</p>`), 'r46') },

  { t: 'COPY vs \\copy — who reads the file?', body: `${copyHinh()}
${psql(`ctshop=# COPY product (…) FROM '/Users/an/Downloads/lab2-products.csv' WITH (FORMAT csv, HEADER true);
ERROR:  could not open file "/Users/an/Downloads/lab2-products.csv" for reading: No such file or directory
HINT:  COPY FROM instructs the PostgreSQL server process to read a file. You may want a client-side facility such as psql's \\copy.`, { sm: true, title: 'server-side COPY looks on the SERVER — the file is on your laptop' })}
<p style="font-size:20px;margin:0">${kw('\\copy', 'psql meta-command, one line, no semicolon')} reads <b>your</b> file and streams it. Same options as COPY. Hundreds of times faster than INSERT one row at a time.</p>` },

  { t: 'Anatomy of a CSV line', body: `
<div class="term sm"><div class="tb"><i style="background:#ff5f56"></i><i style="background:#ffbd2e"></i><i style="background:#27c93f"></i>&nbsp;lab2-products.csv — header + first row (long line wrapped)</div><pre style="white-space:pre-wrap;word-break:break-all">${esc(`sku,name,category_id,price,stock,attrs,is_active,created_at
CT0501,Bút bi Thiên Long TL-027 (xanh),5,5000.00,198,"{""tags"": [""văn phòng""], ""brand"": ""Thiên Long"", ""color"": ""đen""}",t,2025-01-02 08:00:00+07`)}</pre></div>
${psql(`email,full_name,phone,city,created_at
kh006@ctshop.vn,Đặng Văn Linh,0980047514,Hải Phòng,2025-11-03 08:00:00+07
kh007@ctshop.vn,Bùi Thị Nam,,Hải Phòng,2025-08-08 08:00:00+07`, { sm: true, title: 'lab2-customers.csv — customer 7 has no phone', hl: [3] })}
${cards([
  ['HEADER true', 'Line 1 holds names, not data — skip it.'],
  ['"…" and ""', 'A field with commas is quoted; a quote inside is doubled. That is how JSON fits in one field.'],
  [',, = NULL', 'An empty unquoted field becomes NULL (customer 7’s phone). <code class="i">""</code> would be an empty string.'],
  ['Column list', '<code class="i">\\copy product (sku, …)</code> — same order as the file; <b>id</b> is left to identity.'],
], 4)}` },

  { t: 'S3–S5 · three \\copy, three counts', body: two(col(sql(`\\copy product (sku, name, category_id, price, stock, attrs,
  is_active, created_at) FROM '/tmp/lab2-products.csv'
  WITH (FORMAT csv, HEADER true)
\\copy customer (email, full_name, phone, city, created_at)
  FROM '/tmp/lab2-customers.csv' WITH (FORMAT csv, HEADER true)
SELECT min(id), max(id), count(*) FROM customer;
\\copy orders (customer_id, status, created_at, note)
  FROM '/tmp/lab2-orders.csv' WITH (FORMAT csv, HEADER true)`, { sm: true, hl: [6] }),
  `<p class="nho" style="margin:0">In psql each <code class="i">\\copy</code> is typed on <b>one line</b> — wrapped here to fit the slide.</p>`),
  col(P(`COPY 48
COPY 300
 min | max | count
-----+-----+-------
   1 | 300 |   300
(1 row)

COPY 2000`, { sm: true, hl: [5] }), box('The check in the middle', '<code class="i">orders.csv</code> says “customer 61”. That is only the right person if customers got ids <b>1…300</b>. Check before you load the children.', 'xanh')), 'r64') },

  { t: 'Trap: a failed COPY still burns ids', body: two(psql(`-- 1st try: columns in the wrong order
ERROR:  new row for relation "customer" violates check
        constraint "customer_email_check"
DETAIL:  Failing row contains (1, Trần Thị Bình, kh001@…)
CONTEXT:  COPY customer, line 2: "kh001@ctshop.vn,…"
 count
-------
     0          ← nothing was loaded (all or nothing)
-- 2nd try, correct order:
COPY 300
 min | max | count
-----+-----+-------
   2 | 301 |   300   ← id 1 was used by the failed row
-- now load the orders:
ERROR:  insert or update on table "orders" violates foreign key
        constraint "orders_customer_id_fkey"
DETAIL:  Key (customer_id)=(1) is not present in table "customer".`, { sm: true, title: 'real run in a scratch schema (long lines wrapped, comments added)' }),
  col(box('Why', 'The identity value is taken <b>before</b> the row is checked. The failed COPY rolled back its rows, not the sequence.', 'do2'),
    box('Fix', `Empty the tables and restart the counters, then load again:<br>${c('TRUNCATE customer, orders RESTART IDENTITY;')}`, 'xanh'),
    box('Lesson', 'Always check <b>min(id), max(id)</b> after loading a parent table whose ids the children use.', 'lam')), 'r64') },

  { t: 'S6 · the supplier’s price list → UPSERT', body: two(col(sql(`CREATE TABLE price_update (
  sku text PRIMARY KEY, name text NOT NULL,
  category_id int NOT NULL, price numeric(12,2) NOT NULL,
  stock int NOT NULL);                 -- units delivered
\\copy price_update FROM '/tmp/lab2-price-update.csv'
  WITH (FORMAT csv, HEADER true)
INSERT INTO product (sku, name, category_id, price, stock)
SELECT sku, name, category_id, price, stock FROM price_update
ON CONFLICT (sku) DO UPDATE
  SET price = EXCLUDED.price,
      stock = product.stock + EXCLUDED.stock
RETURNING id, sku, price, stock;
DROP TABLE price_update;`, { sm: true, hl: [9, 10, 11] })),
  col(tbl(['sku', 'before', 'after'], [['CT0702', '22000/86', '23000/186'], ['CT0806', '15000/71', '15000/271'], ['CT1001', '705000/247', '720000/277'], ['CT1002', '495000/182', '489000/202'], ['CT0507', '—', '6000/300'], ['CT1207', '—', '119000/40']], { cap: 'price / stock — real output', hl: [4, 5] }),
  `<p style="font-size:19px;margin:0">${kw('EXCLUDED', 'the row that tried to come in')} — new values, while <code class="i">product.stock</code> is the row already on the shelf.</p>`), 'r64') },

  { t: 'UPSERT = one statement, two branches', body: `${upsertHinh()}
${two(psql(` id |  sku   |   price   | stock
----+--------+-----------+-------
 31 | CT1001 | 720000.00 |   277
 32 | CT1002 | 489000.00 |   202
 14 | CT0702 |  23000.00 |   186
 24 | CT0806 |  15000.00 |   271
 53 | CT0507 |   6000.00 |   300
 54 | CT1207 | 119000.00 |    40
(6 rows)

INSERT 0 6`, { sm: true, title: 'RETURNING — real output', hl: [7, 8] }),
  col(box('Where are ids 49–52?', 'Each of the 4 conflicting rows took an identity number before PostgreSQL saw the conflict. The 2 new products got <b>53 and 54</b>. Gaps again — normal.', ''),
    box('Why not SELECT then UPDATE or INSERT?', 'Two statements leave a gap where another session can insert the same sku. ON CONFLICT decides in one atomic step (lesson 4.1).', 'lam')))}` },

  { t: 'Q1–Q2 · products', body: two(col(R(`-- Q1 every Casio item, most expensive first
SELECT sku, name, price FROM product
WHERE name ILIKE '%casio%' ORDER BY price DESC;`, `  sku   |               name                |   price
--------+-----------------------------------+-----------
 CT1004 | Máy tính Casio FX-880BTG          | 790000.00
 CT1001 | Máy tính Casio FX-580VN X         | 720000.00
 CT1002 | Máy tính Casio FX-570VN Plus      | 489000.00
 CT1005 | Máy tính Casio MX-12B (văn phòng) | 195000.00
(4 rows)`), `<p style="font-size:19px;margin:0"><b>ILIKE</b> ignores case: “Casio” matches '%casio%'. CT1001 already shows the new price from S6.</p>`),
  col(R(`-- Q2 everything under 10.000 đ
SELECT sku, name, price FROM product
WHERE price < 10000 ORDER BY price, sku;`, `  sku   |              name               |  price
--------+---------------------------------+---------
 CT0601 | Bút chì gỗ Thiên Long 2B GP-01  | 4000.00
 CT0501 | Bút bi Thiên Long TL-027 (xanh) | 5000.00
 CT1101 | Thước kẻ nhựa Thiên Long 20cm   | 5000.00
 CT0507 | Bút bi Thiên Long TL-095 (xanh) | 6000.00
 CT0801 | Vở ô ly Hồng Hà 48 trang        | 6000.00
 CT0701 | Bút dạ quang Thiên Long HL-03   | 7000.00
 CT0604 | Tẩy Pentel Hi-Polymer           | 9000.00
 CT0704 | Bút dạ quang hai đầu Deli       | 9000.00
(8 rows)`, { hlOut: [4, 5] }), `<p style="font-size:19px;margin:0">Ties (5000, 6000, 9000) are broken by <b>sku</b> — without it their order could change between runs.</p>`)) },

  { t: 'Q3–Q4 · stock alert and a price band', body: two(col(R(`-- Q3 active products with fewer than 80 units
SELECT sku, name, stock FROM product
WHERE stock < 80 AND is_active ORDER BY stock, sku;`, `  sku   |                  name                  | stock
--------+----------------------------------------+-------
 CT1207 | Giáo trình PostgreSQL từ số 0 (bản in) |    40
 CT0704 | Bút dạ quang hai đầu Deli              |    54
 CT0502 | Bút bi Thiên Long TL-079 (hộp 20 cây)  |    62
 CT0601 | Bút chì gỗ Thiên Long 2B GP-01         |    66
 CT1004 | Máy tính Casio FX-880BTG               |    79
(5 rows)`), `<p style="font-size:19px;margin:0">CT0806 had 71 before S6 — the delivery of 200 took it off this list.</p>`),
  col(R(`-- Q4 pens (categories 5, 6, 7), 20.000–50.000 đ
SELECT sku, name, price FROM product
WHERE category_id IN (5, 6, 7)
  AND price BETWEEN 20000 AND 50000
ORDER BY price DESC, sku;`, `  sku   |                name                |  price
--------+------------------------------------+----------
 CT0506 | Bút bi bấm Deli 0.7mm (hộp 12 cây) | 45000.00
 CT0602 | Bút chì kim Pentel A255 0.5mm      | 32000.00
 CT0504 | Bút gel Uni-ball Signo 0.5mm       | 28000.00
 CT0505 | Bút gel Zebra Sarasa Clip 0.5mm    | 24000.00
 CT0702 | Bút dạ quang Stabilo Boss Original | 23000.00
(5 rows)`), `<p style="font-size:19px;margin:0">No JOIN yet: the ids 5, 6, 7 come from S2’s RETURNING. Lab 3 does it by name with a JOIN.</p>`)) },

  { t: 'Q5–Q6 · customers, and the NULL trap', body: two(col(R(`-- Q5 Đà Nẵng customers with no phone
SELECT id, full_name, city FROM customer
WHERE city = 'Đà Nẵng' AND phone IS NULL
ORDER BY id;`, ` id  |   full_name    |  city
-----+----------------+---------
  21 | Vũ Quốc Bình   | Đà Nẵng
  49 | Trần Thị Trang | Đà Nẵng
  70 | Đặng Thu An    | Đà Nẵng
  91 | Phạm Thị Bình  | Đà Nẵng
 161 | Trần Gia Bình  | Đà Nẵng
 231 | Bùi Quốc Bình  | Đà Nẵng
 259 | Phạm Thị Trang | Đà Nẵng
 273 | Trần Quốc Dũng | Đà Nẵng
(8 rows)`)),
  col(sql(`-- Q6 who can the 09x SMS gateway NOT reach?
SELECT count(*) FROM customer
WHERE phone NOT LIKE '09%';                 -- 137 ✗
SELECT count(*) FROM customer
WHERE phone NOT LIKE '09%' OR phone IS NULL; -- 179 ✓`, { sm: true, hl: [3, 5] }),
  P(` count
-------
   137
(1 row)

 count
-------
   179
(1 row)`, { sm: true, title: 'the two results (real run)', hl: [3, 8] }),
  box('42 customers vanished', '<code class="i">NULL NOT LIKE \'09%\'</code> is <b>unknown</b>, not true — so the 42 customers with no phone fall out of the first count. They are exactly the ones the gateway cannot reach.', 'do2')), 'r46') },

  { t: 'Q7 · “orders in September” and BETWEEN', body: `${thangChin()}
${two(P(`ctshop=# SELECT count(*) FROM orders
ctshop-#   WHERE created_at
ctshop-#   BETWEEN '2026-09-01' AND '2026-09-30';
 count
-------
    91
ctshop=# SELECT count(*) FROM orders
ctshop-#   WHERE created_at >= '2026-09-01'
ctshop-#     AND created_at <  '2026-10-01';
 count
-------
    95`, { sm: true, hl: [6, 12] }), P(`ctshop=# SELECT id, customer_id, created_at
ctshop-#   FROM orders
ctshop-#   WHERE created_at >= '2026-09-30'
ctshop-#     AND created_at <  '2026-10-01'
ctshop-#   ORDER BY created_at;
  id  | customer_id |       created_at
------+-------------+------------------------
 1475 |          64 | 2026-09-30 00:50:00+07
   53 |          64 | 2026-09-30 07:46:00+07
  907 |         220 | 2026-09-30 12:35:00+07
 1034 |          56 | 2026-09-30 14:50:00+07
(4 rows)`, { sm: true, title: 'the 4 orders BETWEEN missed' }))}` },

  { t: 'Q8–Q9 · stale orders and “latest per customer”', body: two(col(R(`-- Q8 still pending, created before 1 Sep 2026
SELECT count(*) FROM orders
WHERE status = 'pending' AND created_at < '2026-09-01';
SELECT id, customer_id, created_at FROM orders
WHERE status = 'pending' AND created_at < '2026-09-01'
ORDER BY created_at, id LIMIT 5;`, ` count
-------
   170
(1 row)

  id  | customer_id |       created_at
------+-------------+------------------------
  622 |         285 | 2025-01-01 16:52:00+07
  995 |         133 | 2025-01-06 23:37:00+07
  800 |         183 | 2025-01-07 06:35:00+07
 1953 |         137 | 2025-01-17 07:48:00+07
  956 |         175 | 2025-01-20 22:53:00+07
(5 rows)`)),
  col(R(`-- Q9 the latest order of customers 1–5
SELECT DISTINCT ON (customer_id)
       customer_id, id AS last_order, status, created_at
FROM orders WHERE customer_id IN (1, 2, 3, 4, 5)
ORDER BY customer_id, created_at DESC;`, ` customer_id | last_order | status  |       created_at
-------------+------------+---------+------------------------
           1 |        335 | shipped | 2026-09-29 06:39:00+07
           2 |        287 | shipped | 2026-02-26 00:47:00+07
           3 |       1852 | shipped | 2026-08-29 07:52:00+07
           4 |       1408 | paid    | 2026-07-12 20:45:00+07
           5 |        250 | shipped | 2026-07-17 07:58:00+07
(5 rows)`), `<p style="font-size:19px;margin:0"><b>DISTINCT ON</b> keeps the first row of each customer — and ORDER BY decides which row is first.</p>`)) },

  { t: 'Q10 · page 3 of the newest orders — OFFSET vs keyset', body: `${trangHinh()}
${two(col(sql(`-- OFFSET: skip 20 rows, return 10
SELECT id, customer_id, status, created_at
FROM orders
ORDER BY created_at DESC, id DESC
LIMIT 10 OFFSET 20;
-- keyset: continue after page 2's last row
SELECT id, customer_id, status, created_at
FROM orders
WHERE (created_at, id) < ('2026-09-26 16:54:00+07', 1522)
ORDER BY created_at DESC, id DESC
LIMIT 10;`, { sm: true, hl: [9] })), P(`  id  | customer_id |  status   |       created_at
------+-------------+-----------+------------------------
 1706 |          58 | paid      | 2026-09-26 14:02:00+07
  471 |         110 | shipped   | 2026-09-26 12:46:00+07
 1832 |          34 | shipped   | 2026-09-25 19:56:00+07
 1570 |         168 | shipped   | 2026-09-25 19:51:00+07
 1383 |          33 | paid      | 2026-09-25 07:30:00+07
 1840 |         135 | cancelled | 2026-09-25 03:28:00+07
 1229 |         211 | pending   | 2026-09-25 02:20:00+07
  798 |         104 | shipped   | 2026-09-24 20:05:00+07
  116 |         201 | paid      | 2026-09-23 11:20:00+07
 1316 |         225 | paid      | 2026-09-23 06:15:00+07
(10 rows)`, { sm: true, title: 'both queries return exactly these 10 rows (real run)' }))}` },

  { t: 'U1–U2 · rehearse, then the forgotten WHERE', body: two(psql(`ctshop=# BEGIN;
BEGIN
ctshop=*# UPDATE product SET price = price * 1.05
ctshop-*#   WHERE category_id = 12 RETURNING sku, price;
  sku   |   price
--------+-----------
 CT1201 |  93450.00
 CT1202 |  99750.00
 CT1203 | 187950.00
 CT1204 |  61950.00
 CT1205 | 131250.00
 CT1206 |  51450.00
 CT1207 | 124950.00
(7 rows)
UPDATE 7
ctshop=*# ROLLBACK;
ROLLBACK
ctshop=# SELECT sku, price FROM product WHERE sku = 'CT1201';
  sku   |  price
--------+----------
 CT1201 | 89000.00
(1 row)`, { sm: true, title: 'U1 · look at RETURNING, then throw it away' }),
  psql(`ctshop=# BEGIN;
BEGIN
ctshop=*# UPDATE product SET stock = 0;
UPDATE 50
ctshop=*# SELECT count(*) AS empty_shelves
ctshop-*#   FROM product WHERE stock = 0;
 empty_shelves
---------------
            50
(1 row)
ctshop=*# ROLLBACK;
ROLLBACK
ctshop=# SELECT count(*) AS empty_shelves
ctshop-#   FROM product WHERE stock = 0;
 empty_shelves
---------------
             0
(1 row)`, { sm: true, title: 'U2 · “UPDATE 50” — every shelf empty, caught in time', hl: [4] })) +
  `<p style="font-size:19px;margin:0">The prompt changes to <code class="i">ctshop=*#</code> inside a transaction — a reminder that nothing is permanent until COMMIT.</p>` },

  { t: 'U3–U4 · a constraint as a safety net, then COMMIT', body: two(col(psql(`ctshop=# UPDATE product SET price = price - 5000
ctshop-#   WHERE category_id = 5;
ERROR:  new row for relation "product" violates check
        constraint "product_price_check"
DETAIL:  Failing row contains (1, CT0501, Bút bi Thiên Long
        TL-027 (xanh), 5, 0.00, 198, …)`, { sm: true, title: 'U3 · one bad row (5000 − 5000 = 0) stops the whole UPDATE' }),
  box('Nothing changed', 'The 6 other pens kept their price too: a statement is all or nothing. Lab 1’s CHECK just saved the shop from free pens.', 'xanh')),
  psql(`ctshop=# BEGIN;
BEGIN
ctshop=*# UPDATE orders
ctshop-*#   SET status = 'cancelled',
ctshop-*#       note = 'auto-cancel: pending > 30 days'
ctshop-*#   WHERE status = 'pending'
ctshop-*#     AND created_at < '2026-09-01';
UPDATE 170
ctshop=*# SELECT count(*) AS still_pending
ctshop-*#   FROM orders WHERE status = 'pending';
 still_pending
---------------
            10
(1 row)
ctshop=*# COMMIT;
COMMIT`, { sm: true, title: 'U4 · 170 = Q8’s number ⇒ safe to COMMIT', hl: [8] })) },

  { t: 'U5 · an error poisons the transaction', body: two(psql(`ctshop=# BEGIN;
BEGIN
ctshop=*# DELETE FROM customer WHERE id = 300
ctshop-*#   RETURNING id, email;
 id  |      email
-----+-----------------
 300 | kh300@ctshop.vn
(1 row)

DELETE 1
ctshop=*# DELETE FROM customer WHERE id = 1;
ERROR:  update or delete on table "customer" violates foreign
        key constraint "orders_customer_id_fkey" on table "orders"
DETAIL:  Key (id)=(1) is still referenced from table "orders".
ctshop=!# SELECT count(*) FROM customer;
ERROR:  current transaction is aborted, commands ignored
        until end of transaction block
ctshop=!# ROLLBACK;
ROLLBACK
ctshop=# SELECT count(*) AS customers FROM customer;
 customers
-----------
       300`, { sm: true, title: 'U5 · real run (long lines wrapped)', hl: [14, 15] }),
  col(box('Customer 300 could go', 'No orders point at them, so the DELETE succeeded — inside the transaction.', 'xanh'),
    box('Customer 1 could not', 'Lab 1’s foreign key protects the history of their 7 orders.', 'do2'),
    box('Then psql says =!#', 'After an error the transaction is <b>aborted</b>: every command is refused until ROLLBACK. Even the successful delete of customer 300 is undone.', 'lam')), 'r64') },

  { t: 'Self-check — your numbers must match', body: two(tbl(['query', 'expected'], [
    ['SELECT count(*), sum(stock), max(id) FROM product;', '50 · 8129 · 54'],
    ['SELECT count(*) FROM customer;', '300'],
    ['SELECT count(*) FROM orders;', '2000'],
    ["… WHERE status = 'pending';", '10'],
    ["… WHERE status = 'cancelled';", '327 (157 + 170)'],
    ['Q6 (with OR phone IS NULL)', '179'],
    ['Q7 (half-open range)', '95'],
  ], { cap: 'after S1–S6, Q1–Q10, U1–U5' }), col(`<ol style="font-size:21px;margin:0;padding-left:26px">
<li>Why does S6 give the new products ids 53 and 54, not 49 and 50?</li>
<li>Why is <code class="i">BETWEEN '2026-09-01' AND '2026-09-30'</code> wrong for a timestamptz column?</li>
<li>After an ERROR inside BEGIN, what must you type next?</li></ol>`,
  box('Answers', '1 · The 4 conflicting rows used ids 49–52 before the conflict was found. 2 · \'2026-09-30\' means 30/09 at 00:00 — the rest of that day is cut off (4 orders). 3 · <b>ROLLBACK</b> — the transaction is aborted.', 'xanh')), 'r46') },

  { t: 'Traps of Lab 2', body: vsd(`<ul style="font-size:21px">
<li>Server-side <code class="i">COPY … FROM '/Users/…'</code></li>
<li>Re-running a COPY that failed half-way, then loading orders</li>
<li><code class="i">phone NOT LIKE '09%'</code> to count “not 09x”</li>
<li>BETWEEN … '2026-09-30' on a timestamptz</li>
<li>LIMIT/OFFSET sorted by created_at only</li>
<li>UPDATE straight into autocommit</li></ul>`,
  `<ul style="font-size:21px">
<li><code class="i">\\copy</code> — psql reads your file</li>
<li>Check min/max id; TRUNCATE … RESTART IDENTITY</li>
<li>Add <code class="i">OR phone IS NULL</code></li>
<li><code class="i">&gt;= start AND &lt; next day</code></li>
<li>Sort by (created_at, id) — then keyset is possible</li>
<li>BEGIN → read the count → COMMIT or ROLLBACK</li></ul>`, '✗ Trap', '✓ Do this'), giua: true },

  { t: 'Summary — and next: Lab 3', body: two(steps([
    'Small reference data: multi-row INSERT + RETURNING',
    'Bulk data: <b>\\copy</b> from CSV, parents before children, check the ids',
    'Price lists: <b>INSERT … ON CONFLICT DO UPDATE</b> with EXCLUDED',
    'Questions: WHERE, IN, BETWEEN, ILIKE, IS NULL, DISTINCT ON, keyset',
    'Changes: BEGIN → RETURNING / count → COMMIT or ROLLBACK',
  ]), box('Lab 3 — after Chapter 6', 'Load the full CT Shop (order lines, payments, reviews) and finally <b>JOIN</b> the tables: revenue by month and by category, customers who never bought, and the fan-out trap that double-counts money.', 'lam'), 'r64'), giua: true, to: true },
]);
