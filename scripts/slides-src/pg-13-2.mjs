/**
 * pg-13-2 — PostgreSQL · Chapter 13 · Lesson 13.2 "Querying JSONB and indexing it with GIN" (slide EN, kiểu FU, 26/10/2026, agent c13).
 * Nguồn: content/courses/postgresql/s13-jsonb-fts.mjs › postgresql-13-2-gin-jsonb. Output = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-13-2.sql/.out.txt, bài tập pg-13-2ex) — đọc qua pg-13-out.mjs. SQL trên slide chỉ khác bản chạy ở chỗ xuống dòng.
 * Bổ sung so với bài web: ngữ nghĩa @> (mảng không cần thứ tự, '{"tags":"light"}' KHÔNG khớp mảng, phải đúng tầng, {} luôn đúng, <@),
 * tự dựng chỉ mục ngược bằng SQL trên dữ liệu thật (jsonb_ops: khoá + giá trị; jsonb_path_ops: đường dẫn = giá trị), bảng 200.000 dòng 39 MB,
 * Seq 18,8 ms → GIN 0,94 ms, BUFFERS 161 trang, 4 bước kế hoạch, độ chọn lọc 25% (26,8 → 24,7 ms), kích thước 19 MB vs 14 MB + bảng toán tử
 * từ catalog, path_ops nhanh hơn cho @> (0,167 ms) nhưng ? ⇒ Seq Scan, @? dùng được GIN, bẫy so khoảng (ước lượng 66.667 vs thật 500),
 * chỉ mục biểu thức (numeric dùng được, ::int thì KHÔNG), chỉ mục một khoá (sku), Prisma path equals ⇒ #> = ⇒ Seq Scan dù có GIN,
 * bảng chọn chỉ mục, GIN thật trên CuongThai (không cột jsonb nào; tsvector/trgm/mảng), idx_scan.
 */
import { lamDeck, two, box, cards, vsd, flow } from './_pg-chung.mjs';
import { bookIndex, opsPic, P, S, p, L } from './pg-13-hinh.mjs';
import { barsPages } from './pg-09-hinh.mjs';

export const deck = { key: 'pg-13-2', code: 'PG 13.2', title: 'Querying JSONB and indexing it with GIN', sub: 'containment, existence, inverted index, jsonb_ops vs jsonb_path_ops' };

const J = (...xs) => xs.join('\n');

export const slides = lamDeck({ chuong: 'Chapter 13 — JSONB, GIN, full-text search & trigram', bai: '13.2' }, [
  { cover: true, t: 'Querying JSONB<br>and indexing it with GIN', sub: '@&gt; contains · ? key exists · the inverted index<br>jsonb_ops vs jsonb_path_ops · when GIN does not help' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Search <b>inside</b> documents: <code class="i">@&gt;</code> (contains), <code class="i">?</code> <code class="i">?|</code> <code class="i">?&amp;</code> (key exists) — exact rules</li>
<li>What a GIN index really stores: an <b>inverted index</b>, built by hand in SQL on our data</li>
<li>200,000 rows: Seq Scan vs GIN, read the 4-step plan, and why <b>selectivity</b> still rules</li>
<li><b>jsonb_ops</b> vs <b>jsonb_path_ops</b>: size, speed, supported operators</li>
<li>When GIN does <b>not</b> help: ranges, one key, Prisma <code class="i">path</code> filters — and what to use instead</li>
</ul>` },

  { t: 'Everyday example first: the index at the back of a cookbook', giua: true, body: `
${bookIndex()}
${p('To find recipes with egg you could read every page — or open the index at the back: one entry per <b>ingredient</b>, each with its list of pages. A <b>GIN</b> index (Generalized Inverted iNdex) is exactly that: one entry per <b>piece inside</b> a value, with the list of rows that contain it. A B-tree indexes whole values; GIN indexes what is inside them.', 21)}` },

  { t: 'Containment: @> is the operator you will use most', body: `
${two(P(J(L('2', "SELECT name FROM product WHERE props @> '{\"brand\":\"Acme\"}'", { q: "SELECT name FROM product\n WHERE props @> '{\"brand\":\"Acme\"}' ORDER BY id;" }), L('2', "SELECT name FROM product WHERE props @> '{\"tags\":[\"light\"]}'", { q: "SELECT name FROM product\n WHERE props @> '{\"tags\":[\"light\"]}' ORDER BY id;" })), { w: 540, max: 0.95 }),
P(J(L('2', "SELECT name FROM product WHERE props @> '{\"specs\":{\"ram\":8}}'", { q: "SELECT name FROM product\n WHERE props @> '{\"specs\":{\"ram\":8}}' ORDER BY id;" }), L('2', "SELECT name FROM product WHERE props @> '{\"brand\":\"Acme\",\"tags\"", { q: "SELECT name FROM product\n WHERE props @> '{\"brand\":\"Acme\",\"tags\":[\"laptop\"]}'\n ORDER BY id;" })), { w: 540, max: 0.95 }))}
${box('“Does the left document contain the right one?”', 'At <b>any depth</b> (<code class="i">specs.ram = 8</code>), inside <b>arrays</b> (tags contains "light", whatever else is in the array), several conditions at once (brand Acme <b>and</b> tag laptop) — and everything you do not mention is ignored.', 'lam')}` },

  { t: '@> precisely: arrays, scalars, levels', body: `
${two(P(L('2', "SELECT name FROM product WHERE props @> '{\"tags\":\"light\"}'", { q: "SELECT name FROM product\n WHERE props @> '{\"tags\":\"light\"}' ORDER BY id;" }), { w: 480, hm: ['(0 rows)'] }),
P(J(L('2', "SELECT '[\"a\",\"b\",\"c\"]'::jsonb @>"), L('2', "SELECT '{\"a\":1,\"b\":2}'::jsonb <@")), { w: 620, max: 0.95, hm: [' t                | t'] }))}
${cards([['Array on both sides', '<code class="i">{"tags":"light"}</code> asks for a <b>string</b> “light” — the tags value is an array, so <b>0 rows</b>. Write <code class="i">{"tags":["light"]}</code>.'],
['Order and repeats ignored', '<code class="i">["a","b","c"] @&gt; ["c","a"]</code> is true; <code class="i">["a","a"]</code> is contained too. And <code class="i">{}</code> is contained in everything.'],
['Same level only', '<code class="i">{"specs":{"ram":8}} @&gt; {"ram":8}</code> is <b>false</b>: ram lives under specs. <code class="i">&lt;@</code> is the same test written the other way round.']], 3)}` },

  { t: 'Existence: does this key exist?', body: `
${two(P(J(L('2', "SELECT name FROM product WHERE props ? 'specs'", { q: "SELECT name FROM product\n WHERE props ? 'specs' ORDER BY id;" }), L('2', "SELECT name FROM product WHERE props->'specs' ? 'storage'", { q: "SELECT name FROM product\n WHERE props->'specs' ? 'storage' ORDER BY id;" })), { w: 540, max: 0.95 }),
P(J(L('2', "SELECT name FROM product WHERE props->'tags' ? 'light'", { q: "SELECT name FROM product\n WHERE props->'tags' ? 'light' ORDER BY id;" }), L('2', 'SELECT name FROM product WHERE jsonb_exists(', { q: "SELECT name FROM product\n WHERE jsonb_exists(props->'specs', 'storage')\n ORDER BY id;" })), { w: 540, max: 0.95 }))}
${box('Trap: ? is also the placeholder of many client libraries', '<code class="i">?</code> works on a key of an object <b>and</b> on a string element of an array (tags ? \'light\'). But in JDBC, PHP PDO and others <code class="i">?</code> marks a parameter, so the operator gets mangled before reaching PostgreSQL. Use <code class="i">jsonb_exists(doc, key)</code> (same result) or the driver’s escape (<code class="i">??</code> in JDBC).', 'do2')}` },

  { t: 'Build the inverted index by hand — jsonb_ops', body: `
${two(`<div>` + S(`WITH muc AS (
  SELECT id, 'key  ' || k AS muc
  FROM product, jsonb_object_keys(props) AS k
  UNION ALL
  SELECT id, 'value ' || v::text
  FROM product, jsonb_path_query(props,
    'strict $.** ? (@.type() == "string"
                    || @.type() == "number")') AS v
)
SELECT muc, array_agg(id ORDER BY id) AS dong
FROM muc GROUP BY muc ORDER BY muc;`, { w: 560 }) + p('Every <b>key</b> and every scalar <b>value</b> of every document becomes an entry, with the rows that contain it. That is the shape of the default GIN, <b>jsonb_ops</b>.', 19) + `</div>`,
P(L('2', 'WITH muc AS (', { chiOut: true }), { w: 400, max: 0.8, hm: ['"light"', '"Acme"'] }), 'r64')}` },

  { t: 'jsonb_path_ops: one entry per path to a value', body: `
${two(`<div>${opsPic().replace('width="1110" height="330"', 'width="640" height="190"')}</div>`, P(L('2', 'WITH RECURSIVE t(id, path, v) AS (', { chiOut: true }), { w: 440, max: 0.86, hm: ['tags = "light"', 'specs.ram = 8'] }), 'r64')}
${p('Right: a recursive CTE (lesson 7.4) walks every path of our 5 documents — <b>19 entries</b> like <code class="i">specs.ram = 8 → {2,3}</code>. jsonb_path_ops stores a <b>hash</b> of each path + value: fewer, smaller entries, and an @&gt; query looks up whole paths at once.', 19)}` },

  { t: 'A table big enough to matter: 200,000 documents', body: `
${S(`CREATE TABLE ev (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, props jsonb NOT NULL);
INSERT INTO ev (props)
SELECT jsonb_build_object(
  'sku',    'SKU-' || lpad(i::text, 6, '0'),
  'brand',  CASE WHEN i % 2 = 0 THEN 'Nova' ELSE 'Acme' END,       -- 50 / 50
  'region', CASE WHEN (i / 2) % 2 = 0 THEN 'east' ELSE 'west' END, -- 50 / 50
  'price',  i % 2000,                                                -- each price 100×
  'tags',   jsonb_build_array('t' || (i % 50), 'k' || (i % 13)),
  'specs',  jsonb_build_object('ram', (ARRAY[4,8,16,32])[i % 4 + 1], 'cpu', 'C' || (i % 7))
) || CASE WHEN i % 10 = 0 THEN '{"color":"red"}'::jsonb ELSE '{}'::jsonb END
FROM generate_series(1, 200000) AS i;`, { max: 0.95 })}
${two(P(L('2', 'SELECT count(*) AS so_dong', { q: "SELECT count(*) AS so_dong,\n       pg_size_pretty(pg_table_size('ev')) AS bang FROM ev;" }), { w: 380, max: 1.0 }), P(L('2', 'SELECT props FROM ev WHERE id = 1234'), { wrap: true, z: 0.9 }), 'r37')}` },

  { t: 'Without an index: Seq Scan through 200,000 documents', giua: true, body: `
${P(L('2', `EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props @> '{"price":1234}'`), { hm: ['Seq Scan', 'Rows Removed', 'Execution Time'], max: 1.05 })}
${cards([['Seq Scan', 'reads <b>every</b> row and tests @&gt; on each document'], ['Rows Removed by Filter: 199,900', 'all that work, to keep <b>100</b> rows'], ['rows=20 (estimate) vs 100 (actual)', 'no per-key statistics inside jsonb — the planner guesses']], 3)}` },

  { t: 'CREATE INDEX … USING GIN: 18.8 ms → 0.94 ms', body: `
${P(J(L('2', 'CREATE INDEX ev_props_gin ON ev USING GIN (props)'), L('2', `EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props @> '{"price":1234}'`, { lan: 1 })), { hm: ['Time:', 'Bitmap Index Scan', 'Execution Time'], max: 0.98 })}
${barsPages({ rows: [['Seq Scan', 18.8, '#c0392b', 'no index'], ['GIN', 0.94, '#7a5a9a', 'Bitmap Index Scan on ev_props_gin']], max: 20, w: 1110, lw: 200, unit: 'ms', fs: 21 })}` },

  { t: 'Reading a GIN plan: always the same four steps', body: `
${flow([{ t: '1 · Bitmap Index Scan', s: 'GIN looks up “price=1234”', mau: '#7a5a9a' }, { t: '2 · Build the bitmap', s: 'candidate rows, by page', mau: '#336791' }, { t: '3 · Bitmap Heap Scan', s: 'read those pages in order', mau: '#336791' }, { t: '4 · Recheck Cond', s: 'test the real condition', mau: '#e08a1e' }], { fs: 19, h: 120 })}
${P(L('2', 'EXPLAIN (ANALYZE, BUFFERS) SELECT count(*) FROM ev', { cat: [2, 11] }), { max: 0.98, hm: ['shared hit=161', 'exact=100', 'shared hit=61'] })}
${p('Index pages: <b>61</b>. Heap pages: <b>100</b>, one per matching row (<code class="i">Heap Blocks: exact=100</code>). <b>161</b> pages in total, instead of every page of a 39 MB table. GIN knows which rows <i>may</i> contain the value — so step 4 always rechecks the real condition.', 20)}` },

  { t: 'Selectivity still decides everything', body: `
${two(P(J(L('2', `SELECT count(*) FROM ev WHERE props @> '{"brand":"Nova","region":"east"}'`), L('2', `EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props @> '{"brand":"Nova","region":"east"}'`, { cat: [2, 10] })), { hm: ['50000', 'Bitmap Heap', 'Execution'], wrap: true, z: 0.7 }),
P(`-- the same query with the GIN dropped (BEGIN … ROLLBACK):\n${L('2', `EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props @> '{"brand":"Nova","region":"east"}'`, { lan: 1, cat: [2, 8] })}`, { hm: ['Seq Scan', 'Execution'], wrap: true, z: 0.7 }))}
${barsPages({ rows: [['1 row in 2,000', 0.94, '#2f7d4f', 'price = 1234 · GIN vs 18.8 ms'], ['1 row in 4', 24.7, '#e08a1e', 'brand Nova + east · GIN vs 26.8 ms without']], max: 27, w: 1110, lw: 220, unit: 'ms', fs: 20 })}
${p('Matching <b>25%</b> of the table, the index saves almost nothing: those 50,000 rows must be visited anyway. GIN, like any index (Chapter 9), is for finding a <b>few</b> rows among many.', 19)}` },

  { t: 'Two flavours: jsonb_ops vs jsonb_path_ops', body: `
${two(S(`CREATE INDEX ev_props_gin      ON ev USING GIN (props);
CREATE INDEX ev_props_gin_path ON ev USING GIN (props jsonb_path_ops);`, { w: 700 }), P(L('2', 'CREATE INDEX ev_props_gin_path', { chiOut: true }), { w: 380 }), 'r64')}
${two(P(L('2', 'SELECT indexrelname, pg_size_pretty(pg_relation_size(indexrelid)) AS kich_thuoc, pg_relation_size', { q: "SELECT indexrelname,\n       pg_size_pretty(pg_relation_size(indexrelid)) AS kich_thuoc,\n       pg_relation_size(indexrelid) AS bytes\nFROM pg_stat_user_indexes WHERE relname = 'ev' ORDER BY indexrelname;" }), { w: 560, hm: ['ev_props_gin '] }),
P(L('2', 'SELECT opc.opcname AS lop_toan_tu', { q: "SELECT opc.opcname AS lop_toan_tu,\n       string_agg(op.oprname, '  ' ORDER BY amop.amopstrategy) AS toan_tu\nFROM pg_opclass opc\nJOIN pg_am am ON am.oid = opc.opcmethod AND am.amname = 'gin'\nJOIN pg_amop amop ON amop.amopfamily = opc.opcfamily\nJOIN pg_operator op ON op.oid = amop.amopopr\nWHERE opc.opcname IN ('jsonb_ops', 'jsonb_path_ops')\nGROUP BY opc.opcname ORDER BY 1;" }), { w: 540, hm: ['jsonb_path_ops |'] }))}
${p('Real numbers on 200,000 rows: <b>19 MB vs 14 MB</b> (26% smaller), built in 1.35 s vs 0.49 s. The catalog says it plainly: jsonb_path_ops serves only <code class="i">@&gt; @? @@</code> — no <code class="i">? ?| ?&amp;</code>.', 19)}` },

  { t: 'jsonb_path_ops in action — and where it stops', body: `
${P(J('-- only jsonb_path_ops left (default GIN dropped in BEGIN … ROLLBACK):', L('2', `EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props @> '{"price":1234}'`, { lan: 2, cat: [2, 8] }), L('2', "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props ? 'color'", { cat: [2, 6] }), L('2', "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props @? ", { cat: [2, 8] })), { hm: ['ev_props_gin_path', 'Seq Scan'], max: 0.95 })}
${p('@&gt; on path_ops: <b>0.167 ms</b> (vs 0.94 ms on the default GIN — one hashed path lookup instead of key + value). <code class="i">? \'color\'</code>: <b>Seq Scan</b>, path_ops cannot answer it. A jsonpath <code class="i">@?</code> filter: index used. Choose by the operators your app sends.', 19)}` },

  { t: 'Trap: GIN does not do ranges (and the planner guesses)', body: `
${P(L('2', `EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE (props->>'price')::numeric < 5`), { hm: ['Seq Scan', 'Filter', 'Execution'] })}
${cards([['Both GIN indexes ignored', 'GIN answers “contains / has key”. <code class="i">&lt;</code> on a value <b>extracted</b> from the document is a different question — Seq Scan, 34 ms.'],
['rows=66667 vs actual 500', 'With no statistics inside jsonb, the planner assumes <b>one third</b> of the rows match a range. Wrong by 133× — and bad estimates make bad join plans (Chapter 10).'],
['You still pay for them', 'Two GIN indexes = 33 MB and slower writes, bought for queries that are not this one. Check with EXPLAIN.']], 3)}` },

  { t: 'The fix: an expression index on exactly that expression', body: `
${P(J(L('2', "CREATE INDEX ev_price ON ev (((props->>'price')::numeric))"), 'pgcourse=# ANALYZE ev;\nANALYZE', L('2', `EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE (props->>'price')::numeric < 5`, { lan: 1, cat: [2, 8] }), L('2', `EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE (props->>'price')::int < 5`, { cat: [2, 6] })), { max: 0.95, hm: ['ev_price', 'rows=493', 'Seq Scan', 'Execution'] })}
${two(box('It works — and it fixed the estimate', 'B-tree on <code class="i">((props-&gt;&gt;\'price\')::numeric)</code>: 0.26 ms. After ANALYZE the planner estimates <b>493</b> rows (actual 500): an expression index gets <b>statistics</b> of its own.', 'xanh'),
box('Trap: same idea, different expression', '<code class="i">::int</code> instead of <code class="i">::numeric</code> is another expression ⇒ index <b>not</b> used: Seq Scan, 22 ms. The WHERE must match the index expression <b>exactly</b>.', 'do2'))}` },

  { t: 'One hot key? A small B-tree beats a big GIN', body: `
${P(J(L('2', "CREATE INDEX ev_sku ON ev ((props->>'sku'))"), L('2', "EXPLAIN ANALYZE SELECT props->>'brand' FROM ev WHERE props->>'sku'", { q: "EXPLAIN ANALYZE SELECT props->>'brand' FROM ev\n WHERE props->>'sku' = 'SKU-123456';", cat: [2, 6] })), { hm: ['Index Scan using ev_sku', 'Execution'], max: 1.0 })}
${two(P(L('2', 'SELECT indexrelname, pg_size_pretty(pg_relation_size(indexrelid)) AS kich_thuoc\n', { q: "SELECT indexrelname,\n  pg_size_pretty(pg_relation_size(indexrelid)) AS kich_thuoc\nFROM pg_stat_user_indexes WHERE relname = 'ev'\nORDER BY pg_relation_size(indexrelid) DESC;" }), { w: 460, max: 0.95, hm: ['ev_sku', 'ev_props_gin '] }),
box('Rule of thumb', 'Always the same key, compared with <code class="i">=</code> / <code class="i">&lt;</code> / ORDER BY ⇒ expression B-tree (6 MB, Index Scan, 0.07 ms). Arbitrary keys or “contains” on unpredictable documents ⇒ GIN (14–19 MB). Filter on that key every day ⇒ make it a column (13.1).', 'lam'), 'r46')}` },

  { t: 'Trap: the Prisma path filter cannot use GIN', body: `
${S(`// CuongThai: prisma.socialNotification.findMany({ where: { payload: { path: ['surface'], equals: 'work' } } })
// SQL Prisma 5.22 sends:  WHERE ("payload" #> ARRAY[$1]::text[])::jsonb::jsonb = $2`, { lang: 'typescript', max: 0.95 })}
${P(L('2', "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE (props #> ARRAY['sku']", { q: "EXPLAIN ANALYZE SELECT count(*) FROM ev\n WHERE (props #> ARRAY['sku']::text[])::jsonb = '\"SKU-123456\"';" }), { hm: ['Seq Scan', 'Execution'], max: 0.95 })}
${two(box('Same shape as Prisma ⇒ Seq Scan, 52 ms', 'Two GIN indexes and an expression index on <code class="i">-&gt;&gt;\'sku\'</code> exist — none matches <code class="i">#&gt; … =</code>. The <code class="i">@&gt;</code> form of the same question took <b>0.03 ms</b> on GIN.', 'do2'),
box('What to do', 'Index the expression Prisma generates: <code class="i">CREATE INDEX ON t ((payload #&gt; \'{surface}\'))</code> — or send <code class="i">payload @&gt; \'{"surface":"work"}\'</code> via <code class="i">$queryRaw</code> and use GIN. Measure with EXPLAIN.', 'xanh'))}` },

  { t: 'Choosing an index for JSONB', body: `
<table class="t" style="font-size:19.5px">
<tr><th style="width:36%">Your query</th><th style="width:30%">Index</th><th>Why</th></tr>
<tr><td><code class="i">props @&gt; '{…}'</code>, any keys</td><td>GIN <b>jsonb_path_ops</b></td><td>smallest, fastest for containment; also <code class="i">@?</code> <code class="i">@@</code></td></tr>
<tr><td>also <code class="i">? ?| ?&amp;</code> (key exists)</td><td>GIN <b>jsonb_ops</b> (default)</td><td>the only one that indexes keys alone</td></tr>
<tr><td>one key: <code class="i">= &lt; &gt; ORDER BY</code></td><td>B-tree on the <b>expression</b></td><td>small, sorted, gets statistics — match the expression exactly</td></tr>
<tr><td>Prisma <code class="i">path … equals</code></td><td>B-tree on <code class="i">(col #&gt; '{key}')</code></td><td>that is the expression Prisma sends</td></tr>
<tr><td>filter on it every day</td><td><b>a real column</b></td><td>constraints, statistics, normal indexes (13.1)</td></tr>
<tr><td>matches a big share of rows</td><td>probably none</td><td>selectivity: the index cannot skip work it has to do</td></tr>
</table>
${box('Every GIN has a write cost', 'One row = many GIN entries (every key and value). Chapter 9.4 measured inserts <b>2.2×</b> slower with one GIN. Check that an index is used before keeping it: <code class="i">pg_stat_user_indexes.idx_scan</code>.', '')}` },

  { t: 'In practice: GIN on CuongThai and CT Shop', body: `
${two(S(`-- CuongThai migrations: every GIN, by kind
-- tsvector (full-text, 13.3)
CREATE INDEX "idx_projects_search_vector" ON "projects" USING GIN ("search_vector");
-- trigram (13.4)
CREATE INDEX … ON "users" USING gin ("username" gin_trgm_ops);
-- arrays
CREATE INDEX "idx_interview_questions_tags" ON "interview_questions" USING GIN ("tags");
-- Prisma schema
@@index([nguoiChoi], type: Gin)   // nguoiChoi Int[]`, { w: 640, max: 0.95 }),
box('No GIN on a jsonb column — on purpose', 'CuongThai’s JSON columns (notification payloads, settings) are read <b>by id</b>, not searched — so a GIN there would only slow writes. Its GINs serve search: tsvector, trigram, arrays. CT Shop’s 48-row <code class="i">attrs</code> is too small for any index to beat a Seq Scan (9.4); Lab 7 grows it.', 'lam'), 'r64')}
${P(L('2ex', 'SELECT indexrelname, idx_scan', { q: "SELECT indexrelname, idx_scan,\n       pg_size_pretty(pg_relation_size(indexrelid)) AS kich_thuoc\nFROM pg_stat_user_indexes\nWHERE schemaname = 'ch13' AND relname = 'ev' ORDER BY indexrelname;" }), { max: 0.8, hm: ['ev_props_gin '] })}` },

  { t: 'Exercise', to: true, giua: true, body: `
<ol>
<li>Count documents with <b>ram 16</b> inside specs <b>and</b> color red. Which index does the plan use?</li>
<li><code class="i">props ?&amp; array['color','sku']</code> — which of our two GIN indexes can serve it?</li>
<li>Prices from 10 to 12: write the WHERE so that the existing <code class="i">ev_price</code> index is used.</li>
</ol>
${box('Hint', 'nested object inside @&gt; · look at the operator table from the catalog · the expression must match the index exactly', 'lam')}` },

  { t: 'Solution', body: `
${two(P(J(L('2ex', 'SELECT count(*) FROM ev WHERE props @> '), L('2ex', 'EXPLAIN SELECT count(*) FROM ev WHERE props @> ')), { w: 560, max: 0.85, hm: ['10000', 'ev_props_gin_path'] }),
P(L('2ex', 'EXPLAIN SELECT count(*) FROM ev WHERE props ?&'), { w: 520, max: 0.85, hm: ['ev_props_gin '] }))}
${P(J(L('2ex', "EXPLAIN SELECT count(*) FROM ev WHERE (props->>'price')::numeric BETWEEN"), L('2ex', "SELECT count(*) FROM ev WHERE (props->>'price')::numeric BETWEEN", { lan: 1 })), { hm: ['ev_price', '   300'], wrap: true, z: 0.82 })}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why does <code class="i">props @&gt; '{"tags":"light"}'</code> return no rows?</li>
<li>You index with jsonb_path_ops. Which of <code class="i">@&gt;</code>, <code class="i">?</code>, <code class="i">@?</code> can use it?</li>
<li>A GIN exists, yet <code class="i">(props-&gt;&gt;'price')::numeric &lt; 5</code> is a Seq Scan. Why, and the fix?</li>
</ol>
${box('Answers', '1 · tags is an array; the right side asks for a string. Use <code class="i">{"tags":["light"]}</code>. &nbsp;2 · <code class="i">@&gt;</code> and <code class="i">@?</code> (and <code class="i">@@</code>) — not <code class="i">?</code>. &nbsp;3 · GIN answers contains / key exists, not ranges on an extracted value. Expression B-tree on exactly <code class="i">((props-&gt;&gt;\'price\')::numeric)</code>, or a real column.', 'xanh')}` },

  { t: 'Summary & next', to: true, body: `
<ul>
<li><code class="i">@&gt;</code> contains (any depth, arrays, order ignored) · <code class="i">? ?| ?&amp;</code> key exists</li>
<li>GIN = an <b>inverted index</b>: piece → rows. Plan: Bitmap Index Scan → Bitmap Heap Scan → Recheck</li>
<li>18.8 ms → 0.94 ms for 100 rows in 200,000; for 25% of the table, almost no gain</li>
<li>jsonb_path_ops: 26% smaller, faster @&gt;, no <code class="i">?</code>. Ranges & one key ⇒ expression B-tree</li>
<li>Prisma <code class="i">path</code> filters become <code class="i">#&gt; =</code>: index that, or use <code class="i">@&gt;</code></li>
</ul>
${box('Next — 13.3: full-text search', 'tsvector and tsquery: stems, stop words, ranking, highlighted snippets, a generated column with weights and a GIN — and Vietnamese with unaccent.', 'lam')}` },
]);
