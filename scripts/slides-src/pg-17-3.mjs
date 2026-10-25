/**
 * pg-17-3 — PostgreSQL · Chapter 17 · Lesson 17.3 "MongoDB documents vs PostgreSQL JSONB" (slide EN, kiểu FU, agent c17, 25/10/2026).
 * Nguồn: content/courses/postgresql/s17-bon-he-csdl.mjs › postgresql-17-3-mongodb-vs-jsonb.
 * CÙNG 2.000 đơn CT Shop ba cách lưu: bảng quan hệ ch17.orders + order_item (PostgreSQL 17.11) · collection orders (MongoDB 7.0.37, mongoimport)
 * · bảng ch17.orders_doc (id, doc jsonb). Output thật: video-bai-giang/src/khung/pg/that/pg-17-3.{sql,out.txt}.
 */
import { lamDeck, sql, two, three, box, cards as cards0, steps, flow, vsd } from './_pg-chung.mjs';
import { T, HE, bang3 } from './pg-17-hinh.mjs';

const cards = (items, cot) => cards0(items.map(([h, p]) => [h, p.replace(/<b>/g, '<span style="font-weight:800;color:#262626">').replace(/<\/b>/g, '</span>')]), cot);
const col = (...a) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${a.join('')}</div>`;
const fz = (n) => (s) => s.replace('<pre>', `<pre style="font-size:${n}px;line-height:1.36">`);
const t12 = fz(12), t13 = fz(13), t15 = fz(15), t17 = fz(17);
const js = (s, o = {}) => sql(s, { sm: true, lang: 'javascript', ...o });

export const deck = { key: 'pg-17-3', code: 'PG 17.3', title: 'MongoDB documents vs PostgreSQL JSONB', sub: 'The same 2,000 CT Shop orders as tables, as Mongo documents and as a JSONB column' };

const MG = '#2f8d46', PG = '#336791';

/* Ba cách lưu một đơn. */
const baCach = () => `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial">
  ${[
    [10, PG, '① Tables', ['orders: 1 row', 'order_item: 2 rows', 'product, category,', 'customer: shared'], 'JOIN to read'],
    [380, MG, '② MongoDB document', ['collection orders', '1 document = 1 order', 'customer + items', 'copied inside'], 'one read, no JOIN'],
    [750, '#7a5a9a', '③ PostgreSQL JSONB', ['table orders_doc', '(id int, doc jsonb)', 'the same document', 'in one column'], 'SQL + JSON operators'],
  ].map(([x, m, t, ls, f]) => `<rect data-k="cach" x="${x}" y="10" width="350" height="210" rx="14" fill="${m}12" stroke="${m}" stroke-width="3"/>
  <text x="${x + 175}" y="44" text-anchor="middle" font-size="22" font-weight="800" fill="${m}">${t}</text>
  ${ls.map((l, i) => `<text x="${x + 175}" y="${82 + i * 28}" text-anchor="middle" font-size="18" font-family="Menlo,monospace" fill="#333">${l}</text>`).join('')}
  <text x="${x + 175}" y="205" text-anchor="middle" font-size="17" font-weight="700" fill="${m}">${f}</text>`).join('')}
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 17 — SQL Server · MySQL · PostgreSQL · MongoDB', bai: '17.3' }, [
  { cover: true, t: 'MongoDB documents<br>vs PostgreSQL JSONB', sub: 'The same 2,000 CT Shop orders stored three ways —<br>tables, Mongo documents, a JSONB column —<br>queried, indexed and measured for real.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>document</b> is, and how one CT Shop order looks as a document</li>
<li>The same questions in <b>MQL</b> (find, aggregate) and in <b>SQL on JSONB</b> (<code class="i">@&gt;</code>, <code class="i">-&gt;&gt;</code>) — same answers</li>
<li>Indexes on both sides: Mongo multikey index vs PostgreSQL <b>GIN</b></li>
<li>What duplication costs: size, and renaming a product</li>
<li>When the document model wins — and when tables win</li>
</ul>` },

  { t: 'An everyday picture: the receipt and the price list', giua: true, body: two(cards([
    ['🧾 A receipt (document)', 'Everything about one purchase on one paper: who, when, each line with the <b>price of that day</b>. You never need another paper to read it — and you <b>want</b> it frozen: if the shop raises prices tomorrow, yesterday’s receipt must not change.'],
    ['📋 The price list (relational)', 'One master list of products. Change a price once and every future order sees it. To print an order you look things up in the list — a JOIN.'],
  ], 1), col(box('The trade-off in one sentence', 'Documents make <b>reading one thing</b> cheap by copying data into it. Tables make <b>changing shared things</b> and <b>asking new questions</b> cheap by storing each fact once.', 'lam'),
    box('Both live in this lesson', 'CT Shop’s 2,000 orders become 2,000 Mongo documents and 2,000 JSONB values — built from the same tables, so every answer can be checked against SQL.', 'ok')), 'r64') },

  { t: 'Three ways to store one order', body: `${baCach()}
${two(t13(T('mg', `ctshop> db.orders.findOne({ _id: 1 })
{ _id: 1,
  customer: { id: 61, name: 'Vũ Thị Bình', city: 'Đà Nẵng' },
  status: 'paid',
  created_at: ISODate('2026-09-05T23:28:00.000Z'),
  items: [ { sku: 'CT1004', name: 'Máy tính Casio FX-880BTG',
             category: 'Máy tính cầm tay',
             qty: 1, unit_price: 790000 },
           { sku: 'CT1102', … qty: 1, unit_price: 15000 } ] }`, { title: 'mongosh — keys keep the order you wrote (layout compacted)' })),
    t13(T('pg', `ctshop=# SELECT jsonb_pretty(doc) FROM orders_doc WHERE id = 1;
 { "items": [ { "qty": 1, "sku": "CT1004",
     "name": "Máy tính Casio FX-880BTG",
     "category": "Máy tính cầm tay", "unit_price": 790000.00 },
   { "qty": 1, "sku": "CT1102", … } ],
   "status": "paid",
   "customer": { "id": 61, "city": "Đà Nẵng",
                 "name": "Vũ Thị Bình" },
   "created_at": "2026-09-06T06:28:00+07:00" }`, { title: 'psql — jsonb re-orders keys (layout compacted)' })))}` },

  { t: 'Building the documents from the tables', giua: true, body: two(col(sql(`-- one JSON document per order, built by SQL (docs.sql)
SELECT json_build_object(
  '_id', o.id,
  'customer', json_build_object('id', c.id,
                'name', c.full_name, 'city', c.city),
  'status', o.status,
  'created_at', json_build_object('$date', …),
  'items', (SELECT json_agg(json_build_object(
              'sku', p.sku, 'name', p.name,
              'category', cat.name, 'qty', oi.qty,
              'unit_price', oi.unit_price) ORDER BY p.sku)
            FROM order_item oi JOIN product p … ))
FROM orders o JOIN customer c ON c.id = o.customer_id;`, { sm: true })),
    col(T('sh', `$ psql -At -f docs.sql > orders.ndjson   # 2000 lines
$ mongoimport --db ctshop --collection orders \\
    --drop --file orders.ndjson
2000 document(s) imported successfully.
0 document(s) failed to import.`, { title: 'terminal — load MongoDB (real counts)' }),
      box('And the JSONB copy', '<code class="i">CREATE TABLE orders_doc (id int PRIMARY KEY, doc jsonb NOT NULL)</code> filled with <code class="i">jsonb_build_object(…)</code> — the same shape. Product names and categories are now <b>copied</b> into every order.', 'lam'))) },

  { t: 'Question 1 — which orders contain product CT0503?', giua: true, body: `${three(
    col(js(`db.orders.countDocuments(
  { "items.sku": "CT0503" })`), t17(T('mg', `ctshop> db.orders.countDocuments(…)
119`, { title: 'mongosh — dot path into the array' }))),
    col(sql(`SELECT count(*) FROM orders_doc
WHERE doc @> '{"items":
  [{"sku": "CT0503"}]}';`, { sm: true }), t17(T('pg', ` count
-------
   119`, { title: 'psql — JSONB containment @>' }))),
    col(sql(`SELECT count(DISTINCT oi.order_id)
FROM order_item oi
JOIN product p ON p.id = oi.product_id
WHERE p.sku = 'CT0503';`, { sm: true }), t17(T('pg', ` count
-------
   119`, { title: 'psql — plain tables, JOIN' }))))}
${box('Read it like this', 'Mongo: “find documents whose <b>items</b> array has an element with sku CT0503”. PostgreSQL <code class="i">@&gt;</code>: “the document <b>contains</b> this smaller JSON”. Tables: “join the item rows to products”. Three spellings, one answer: <b>119</b>.', 'lam')}` },

  { t: 'Reading inside a document: the operators', giua: true, body: `${bang3([
    ['A nested field', "customer.name", "doc->'customer'->>'name'", 'JOIN customer, then c.full_name'],
    ['Text vs JSON value', '(always typed values)', '-> gives JSON · ->> gives text', '(columns are typed)'],
    ['Contains', '{ "items.sku": "CT0503" }', "doc @> '{\"items\":[{\"sku\":\"CT0503\"}]}'", 'EXISTS / JOIN'],
    ['Has a key', '{ field: { $exists: true } }', "doc ? 'note'", 'column IS NOT NULL'],
    ['Array length', '{ $size: "$items" }', "jsonb_array_length(doc->'items')", 'COUNT(*) GROUP BY order'],
  ], { he: ['mg', 'pg', 'pg'], fs: 18, w1: 190, dau: 'task' }).replace(/🐘 PostgreSQL<\/th><th style="background:#336791">🐘 PostgreSQL/, '🐘 PostgreSQL JSONB</th><th style="background:#336791">🐘 PostgreSQL tables')}
${two(t15(T('pg', `ctshop=# SELECT doc->'customer'->>'name' AS customer,
ctshop-#   doc->>'status' AS status,
ctshop-#   jsonb_array_length(doc->'items') AS n_items
ctshop-# FROM orders_doc WHERE id = 1;
  customer   | status | n_items
-------------+--------+---------
 Vũ Thị Bình | paid   |       2`, { title: 'psql (17.11) — ctshop' })),
    box('Chapter 13', 'JSONB operators, jsonb_path and indexing are taught step by step in Chapter 13.1–13.2. Here we only need four of them.', 'ok'))}` },

  { t: 'Question 2 — revenue by category: the Mongo pipeline', body: two(js(`db.orders.aggregate([
  { $match: { status: { $in: ["paid", "shipped"] },
              created_at: { $gte: ISODate("2025-12-31T17:00:00Z") } } },
  { $unwind: "$items" },
  { $group: { _id: "$items.category",
              orders: { $addToSet: "$_id" },
              revenue: { $sum: { $multiply:
                         ["$items.qty", "$items.unit_price"] } } } },
  { $project: { orders: { $size: "$orders" }, revenue: 1 } },
  { $sort: { revenue: -1 } },
  { $limit: 5 }
])`).replace('<pre class="vs sm">', '<pre class="vs sm" style="font-size:14px">'), col(flow([
    { t: '$match', s: 'WHERE', mau: MG }, { t: '$unwind', s: '1 row / item', mau: MG }, { t: '$group', s: 'GROUP BY', mau: MG },
  ], { w: 380, h: 120, fs: 17 }), flow([
    { t: '$project', s: 'SELECT', mau: MG }, { t: '$sort', s: 'ORDER BY', mau: MG }, { t: '$limit', s: 'LIMIT', mau: MG },
  ], { w: 380, h: 120, fs: 17 }), box('A pipeline', 'Documents flow through stages, each stage feeding the next — like the logical order of a SELECT (Chapter 4.2), written in the order it runs.', 'lam')), 'r64') },

  { t: 'Question 2 — same numbers from all three', giua: true, body: `${three(t13(T('mg', `{ _id: 'Máy tính cầm tay',
  revenue: 225855000, orders: 216 }
{ _id: 'Sổ tay',
  revenue: 57982000, orders: 188 }
{ _id: 'Giáo trình IT',
  revenue: 46403000, orders: 206 }
{ _id: 'Bút chì & tẩy',
  revenue: 22782000, orders: 202 }
{ _id: 'Bút dạ quang',
  revenue: 16507000, orders: 185 }`, { title: 'mongosh — aggregate (layout compacted)' })),
    col(sql(`SELECT i->>'category' AS category,
  count(DISTINCT d.id) AS orders,
  sum((i->>'qty')::int
    * (i->>'unit_price')::numeric)
    AS revenue
FROM orders_doc d,
  jsonb_array_elements(d.doc->'items') i
WHERE d.doc->>'status' IN ('paid','shipped')
  AND (d.doc->>'created_at')::timestamptz
      >= '2026-01-01'
GROUP BY 1 ORDER BY revenue DESC LIMIT 5;`, { sm: true }).replace('<pre class="vs sm">', '<pre class="vs sm" style="font-size:13px">')),
    t12(T('pg', `     category     | orders |   revenue
------------------+--------+--------------
 Máy tính cầm tay |    216 | 225855000.00
 Sổ tay           |    188 |  57982000.00
 Giáo trình IT    |    206 |  46403000.00
 Bút chì & tẩy    |    202 |  22782000.00
 Bút dạ quang     |    185 |  16507000.00
(5 rows)`, { title: 'psql — JSONB (= the relational report of 17.2)' })))}
${box('Check', '<b>jsonb_array_elements</b> plays the role of <b>$unwind</b>: one row per item. The relational report in Lesson 17.2 printed exactly these five numbers too.', 'ok')}` },

  { t: 'MQL ↔ SQL phrasebook', to: true, giua: true, body: bang3([
    ['Filter', 'find({…}) / $match', 'WHERE'],
    ['Pick fields', 'projection / $project', 'SELECT col, …'],
    ['Explode an array', '$unwind', 'jsonb_array_elements(…) / JOIN the child table'],
    ['Group', '$group: { _id: … }', 'GROUP BY'],
    ['Sort · limit', '$sort · $limit', 'ORDER BY · LIMIT'],
    ['Join another collection', '$lookup', 'JOIN'],
    ['Count', 'countDocuments()', 'count(*)'],
  ], { he: ['mg', 'pg'], fs: 22, w1: 260, dau: 'task' }).replace('🐘 PostgreSQL', '🐘 SQL (tables or JSONB)') },

  { t: 'Index 1 — MongoDB: COLLSCAN → IXSCAN', giua: true, body: two(col(js(`db.orders.find({ "items.sku": "CT0503" })
  .explain("executionStats")
db.orders.createIndex({ "items.sku": 1 })`), box('Multikey index', 'Because <b>items</b> is an array, MongoDB makes one index entry <b>per array element</b> — a multikey index. That is how “any item with this sku” becomes a fast lookup.', 'lam')),
    col(t17(T('mg', `> explain BEFORE index
{ stage: 'COLLSCAN', nReturned: 119,
  totalDocsExamined: 2000, totalKeysExamined: 0 }
> db.orders.createIndex({ 'items.sku': 1 })
items.sku_1
{ stage: 'IXSCAN', isMultiKey: true, nReturned: 119,
  totalDocsExamined: 119, totalKeysExamined: 119 }`, { title: 'mongosh — explain (fields picked, layout compacted)' })),
      box('Read the numbers', 'Before: read <b>2000</b> documents to return 119. After: read <b>119</b> index keys and 119 documents.', 'ok'))) },

  { t: 'Index 2 — PostgreSQL: Seq Scan → GIN', giua: true, body: two(col(sql(`EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)
SELECT count(*) FROM orders_doc
WHERE doc @> '{"items": [{"sku": "CT0503"}]}';

CREATE INDEX orders_doc_gin ON orders_doc
  USING gin (doc jsonb_path_ops);
ANALYZE orders_doc;`, { sm: true }), box('GIN = Generalized Inverted Index', 'Like the index at the back of a book: for each value (path + key) inside the documents it lists the rows that contain it. <b>jsonb_path_ops</b> is the compact variant for <code class="i">@&gt;</code>. Chapter 13.2.', 'lam')),
    col(t13(T('pg', `                    QUERY PLAN
------------------------------------------------------
 Aggregate (actual rows=1 loops=1)
   ->  Seq Scan on orders_doc (actual rows=119 loops=1)
         Filter: (doc @> '{"items": [{"sku": "CT0503"}]}'::jsonb)
         Rows Removed by Filter: 1881`, { title: 'psql — before: read every row', hl: [6] })),
      t13(T('pg', `                    QUERY PLAN
----------------------------------------------------------------
 Aggregate (actual rows=1 loops=1)
   ->  Bitmap Heap Scan on orders_doc (actual rows=119 loops=1)
         Recheck Cond: (doc @> '{"items": [{"sku": "CT0503"}]}'::jsonb)
         Heap Blocks: exact=86
         ->  Bitmap Index Scan on orders_doc_gin (actual rows=119 loops=1)
               Index Cond: (doc @> '{"items": [{"sku": "CT0503"}]}'::jsonb)`, { title: 'psql — after: the GIN index finds the 119', hl: [4, 7] }))), 'r46') },

  { t: 'What the copies cost: size', body: two(col(t15(T('pg', `ctshop=# SELECT pg_size_pretty(pg_table_size('orders_doc'))
ctshop-#     AS orders_doc_data,
ctshop-#   pg_size_pretty(pg_table_size('orders')
ctshop-#     + pg_table_size('order_item'))
ctshop-#     AS orders_plus_items_data,
ctshop-#   pg_size_pretty(pg_relation_size('orders_doc_gin'))
ctshop-#     AS gin_index;
 orders_doc_data | orders_plus_items_data | gin_index
-----------------+------------------------+-----------
 1216 kB         | 432 kB                 | 248 kB`, { title: 'psql — same 2,000 orders' })),
    t15(T('mg', `ctshop> db.orders.stats().size
894954`, { title: 'mongosh — BSON data size, bytes (≈ 874 KB, before compression)' }))),
    col(`<svg viewBox="0 0 420 220" width="420" height="220" font-family="Arial">
  <rect data-k="cot" x="30" y="${200 - 160 * 432 / 1216}" width="90" height="${160 * 432 / 1216}" fill="${PG}"/><text x="75" y="215" text-anchor="middle" font-size="15">tables</text><text x="75" y="${190 - 160 * 432 / 1216}" text-anchor="middle" font-size="16" font-weight="800">432 kB</text>
  <rect data-k="cot" x="165" y="${200 - 160 * 874 / 1216}" width="90" height="${160 * 874 / 1216}" fill="${MG}"/><text x="210" y="215" text-anchor="middle" font-size="15">Mongo BSON</text><text x="210" y="${190 - 160 * 874 / 1216}" text-anchor="middle" font-size="16" font-weight="800">874 KB</text>
  <rect data-k="cot" x="300" y="40" width="90" height="160" fill="#7a5a9a"/><text x="345" y="215" text-anchor="middle" font-size="15">JSONB</text><text x="345" y="32" text-anchor="middle" font-size="16" font-weight="800">1216 kB</text>
</svg>`, box('Why ~2.8× bigger', 'Every order repeats the key names and copies the product name and category text. Tables store each product name once and point to it with a number.', 'lam')), 'r64') },

  { t: 'Changing shared data: rename one product', body: `${two(col(js(`db.orders.updateMany(
  { "items.sku": "CT0503" },
  { $set: { "items.$[i].name":
            "Bút bi Pentel BK77 0.7mm (2027)" } },
  { arrayFilters: [{ "i.sku": "CT0503" }] })`), t15(T('mg', `{ acknowledged: true, insertedId: null,
  matchedCount: 119, modifiedCount: 119,
  upsertedCount: 0 }`, { title: 'mongosh — 119 documents rewritten' }))),
    col(sql(`BEGIN;
UPDATE product
SET name = 'Bút bi Pentel BK77 0.7mm (2027)'
WHERE sku = 'CT0503';
ROLLBACK;`, { sm: true }), t15(T('pg', `UPDATE 1`, { title: 'psql — tables: one row' }))))}
${vsd('<p style="margin:0;font-size:20px">Customer’s email or a product’s <b>current</b> name copied into documents ⇒ every copy must be found and rewritten (119 here, millions in real life).</p>',
    '<p style="margin:0;font-size:20px">But an order line <b>should</b> keep the name and price of the day it was bought — that copy is a feature. CT Shop’s tables do the same: <code class="i">order_item.unit_price</code>.</p>', '✗ Copy that must stay in sync', '✓ Copy that is a snapshot')}` },

  { t: 'When the document model wins', to: true, body: two(`<ul>
<li>You read and write the thing <b>as one unit</b>: an order, a product page, a user profile, a game save</li>
<li>The shape <b>varies</b> between records: product attributes, form answers, event payloads</li>
<li>Data arrives as JSON and is mostly <b>appended</b>: logs, events, IoT readings</li>
<li>You need to spread one collection over many machines: MongoDB’s <b>sharding</b> is built in</li>
</ul>`, col(box('MongoDB’s honest strengths', 'Developer speed with JSON-shaped app data, flexible schema, horizontal scale-out, a strong managed cloud (Atlas).', 'ok'),
    box('Still design!', '“Schemaless” means the schema lives in your code. Decide what to embed and what to reference — that is the design work.', 'lam')), 'r64') },

  { t: 'When tables win', to: true, body: two(`<ul>
<li>Many-to-many relationships: students ↔ courses, products ↔ orders ↔ customers</li>
<li><b>New questions</b> every week: reports, dashboards, ad-hoc analysis across everything</li>
<li>Shared facts that change: prices, names, stock — stored once, changed once</li>
<li>Integrity the database enforces: foreign keys, CHECK, UNIQUE across tables, transactions everywhere</li>
</ul>`, col(box('PostgreSQL’s middle road', 'Keep the core in <b>tables</b>, and put the parts that really vary in a <b>JSONB</b> column with a GIN index — CT Shop’s <code class="i">product.attrs</code>, and the 266 JSON fields of cuongthai.com.', 'ok'),
    box('MongoDB can join and do transactions too', '<b>$lookup</b> joins collections; multi-document transactions work on a replica set (since 4.0). They exist — but they are not the model’s sweet spot.', 'lam')), 'r64') },

  { t: 'Exercise — write it both ways', to: true, giua: true, body: two(steps([
    'Count <b>paid</b> orders from customers in <b>Đà Nẵng</b> — in MQL and with JSONB <code class="i">@&gt;</code>.',
    'Check your answer with plain tables (JOIN customer).',
    'List the first 3 order ids that have an item with <b>qty ≥ 3</b> — in MQL and in SQL on JSONB.',
  ]), `<div data-k="dapan" class="o ok" style="font-size:19px"><div class="h">Answers (real output)</div>
<code class="i">db.orders.countDocuments({ "customer.city": "Đà Nẵng", status: "paid" })</code> → <b>141</b><br>
<code class="i">doc @&gt; '{"customer": {"city": "Đà Nẵng"}, "status": "paid"}'</code> → <b>141</b> · JOIN → <b>141</b><br>
<code class="i">find({ "items.qty": { $gte: 3 } }, { _id: 1 }).sort({ _id: 1 }).limit(3)</code> → 3, 5, 6<br>
<code class="i">WHERE EXISTS (SELECT 1 FROM jsonb_array_elements(d.doc-&gt;'items') i WHERE (i-&gt;&gt;'qty')::int &gt;= 3)</code> → 3, 5, 6</div>`, 'r46') },

  { t: 'Check yourself', to: true, giua: true, body: `
${steps([
    'Why is copying the product name into an order line fine, but copying a customer’s email into every order risky?',
    'What does <code class="i">@&gt;</code> test, and which index makes it fast?',
    'Which MongoDB stage plays the role of jsonb_array_elements?',
  ])}
<div data-k="dapan3" class="o ok" style="font-size:22px"><div class="h">Answers</div>
1 · The order line is a snapshot of the sale; the email is a current fact that changes and must stay in sync.<br>
2 · “Contains this JSON”; a GIN index (jsonb_path_ops).<br>
3 · <b>$unwind</b>.</div>` },

  { t: 'Summary', to: true, body: two(`<ul>
<li>Same 2,000 orders, three stores: tables, Mongo documents, JSONB — <b>same answers</b> (119 · 225,855,000 · 141)</li>
<li>MQL find / aggregate ↔ SQL WHERE / GROUP BY; $unwind ↔ jsonb_array_elements</li>
<li>Indexes: multikey (Mongo) and GIN (PostgreSQL) turn full scans into lookups</li>
<li>Copies cost space (~2.8×) and sync work — unless they are snapshots</li>
</ul>`, col(box('Next — 17.4', 'How to choose: SQL Server, MySQL, PostgreSQL or MongoDB for real situations — and why cuongthai.com chose PostgreSQL + Prisma.', 'ok'))) },
]);
