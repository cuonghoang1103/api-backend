/**
 * pg-13-1 — PostgreSQL · Chapter 13 · Lesson 13.1 "JSONB: a document type that indexes" (slide EN, kiểu FU, 26/10/2026, agent c13).
 * Nguồn: content/courses/postgresql/s13-jsonb-fts.mjs › postgresql-13-1-jsonb. Output = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-13-1.sql/.out.txt, bài tập pg-13-1ex, CT Shop pg-13-ctshop, Prisma pg-13-prisma.txt) — đọc qua pg-13-out.mjs.
 * Câu SQL trên slide có thể XUỐNG DÒNG khác bản chạy (chỉ khác khoảng trắng — L() kiểm), output giữ nguyên.
 * Bổ sung so với bài web: json không có toán tử =, jsonb không nhỏ hơn (48 vs 33 byte), cây tài liệu + đường dẫn, -> so với text ⇒ LỖI (không phải false),
 * mảng ->0 / ->>-1 / #>, ?| ?&, sửa tài liệu (jsonb_set / || / - / #-), bẫy jsonb_set(…, NULL) ⇒ NULL cả tài liệu + jsonb_set_lax,
 * dựng/tháo (jsonb_build_object, jsonb_agg, jsonb_each, jsonb_array_elements_text), SQL/JSON path (@? @@ strict/lax, biến),
 * PG17: JSON_TABLE, JSON_EXISTS / JSON_VALUE / JSON_QUERY + ON ERROR, cột generated, bẫy không lược đồ + CHECK (NULL lọt CHECK!),
 * Prisma Json path ⇒ SQL thật (#> =), CT Shop attrs.
 */
import { lamDeck, two, box, cards, vsd } from './_pg-chung.mjs';
import { formVsSheet, jsonVsJsonb, docTree, P, S, p, L } from './pg-13-hinh.mjs';

export const deck = { key: 'pg-13-1', code: 'PG 13.1', title: 'JSONB: a document type that indexes', sub: 'json vs jsonb, operators, editing, SQL/JSON path, JSON_TABLE' };

const J = (...xs) => xs.join('\n');

export const slides = lamDeck({ chuong: 'Chapter 13 — JSONB, GIN, full-text search & trigram', bai: '13.1' }, [
  { cover: true, t: 'JSONB:<br>a document type that indexes', sub: 'json vs jsonb · -&gt; · -&gt;&gt; · #&gt;&gt; · editing documents<br>SQL/JSON path · JSON_TABLE (new in PostgreSQL 17)' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why one database can hold <b>rigid</b> rows and <b>free-form</b> documents — and why you <b>always pick jsonb</b> over json</li>
<li>Reading inside a document: <code class="i">-&gt;</code> <code class="i">-&gt;&gt;</code> <code class="i">#&gt;</code> <code class="i">#&gt;&gt;</code>, arrays, missing keys</li>
<li>Changing a document: <code class="i">jsonb_set</code>, <code class="i">||</code>, <code class="i">-</code>, <code class="i">#-</code> — and the NULL trap</li>
<li>SQL/JSON path, and PostgreSQL 17’s <b>JSON_TABLE</b>, <b>JSON_VALUE</b>, <b>JSON_EXISTS</b></li>
<li>The real decision: <b>column or JSONB?</b> Prisma <code class="i">Json</code> on CuongThai, CT Shop <code class="i">attrs</code></li>
</ul>` },

  { t: 'Everyday example first: a form vs a spec sheet', giua: true, body: `
${formVsSheet()}
${p('A table with columns is a <b>printed form</b>: every row fills the same boxes. Some data is not like that — a laptop has RAM and a CPU, a keyboard has neither. <b>JSONB</b> lets each row carry its own “spec sheet” (a JSON document) in one column — and you can still query and index it.', 21)}` },

  { t: 'The table used in this lesson', body: `
${two(S(`CREATE TABLE product (
  id    int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name  text  NOT NULL,
  props jsonb NOT NULL      -- the spec sheet
);
INSERT INTO product (name, props) VALUES
 ('Laptop Pro 14', '{"brand":"Acme","price":1299,
    "tags":["laptop","pro"],"specs":{"ram":16,"cpu":"M3"}}'),
 ('Laptop Air 13', '{… "tags":["laptop","light"] …}'),
 ('Phone X',  '{… "specs":{"ram":8,"storage":256}}'),
 ('Tablet Mini',   '{… "specs":{"ram":4}}'),
 ('Keyboard K1',   '{"brand":"Acme","price":89,
    "tags":["accessory"]}');           -- no specs at all`, { w: 520 }),
box('Deliberately irregular', 'Five products, <b>not</b> the same keys: Phone X has <code class="i">storage</code>, Tablet Mini has only <code class="i">ram</code>, Keyboard K1 has no <code class="i">specs</code> at all. Exactly the data a fixed set of columns handles badly.', 'lam'), 'r64')}
${P(L('1', 'SELECT id, name, props FROM product'), { hm: ['Phone X', 'Keyboard K1'] })}` },

  { t: 'json vs jsonb — always pick jsonb', body: `
${two(P(J(L('1', "SELECT '{\"b\":1,\"a\":2,\"a\":3}'::json "), L('1', "SELECT '{\"b\":1,\"a\":2,\"a\":3}'::jsonb")), { w: 520, hm: [' {"b":1,"a":2,"a":3}', ' {"a": 3, "b": 1}'] }),
P(L('1', 'SELECT pg_column_size(', { q: `SELECT pg_column_size(
         '{"brand":"Acme","price":1299}'::json)  AS json_bytes,
       pg_column_size(
         '{"brand":"Acme","price":1299}'::jsonb) AS jsonb_bytes;` }), { w: 560, hm: ['33 |'] }))}
${jsonVsJsonb()}
${p('<b>jsonb</b> is not smaller (48 vs 33 bytes here: it stores offsets for fast lookup). You pay a little space so the document never has to be parsed again.', 19)}` },

  { t: 'What jsonb normalises — and why that is safe', body: `
${P(L('1', `SELECT '{ "name" : "Phone X"`, { q: `SELECT '{ "name" : "Phone X",   "id": 3, "ok":true }'::json AS json_giu_nguyen,
       '{ "name" : "Phone X",   "id": 3, "ok":true }'::jsonb AS jsonb_chuan_hoa;` }), { hm: [' { "name"'], max: 1.0 })}
${P(J(L('1', "SELECT '{\"a\":1,\"b\":2}'::json  ="), L('1', "SELECT '{\"a\":1,\"b\":2}'::jsonb =")), { hm: ['ERROR'], max: 0.95 })}
${box('Key order never meant anything', 'Key order in a JSON object carries no meaning, so sorting loses nothing. In exchange jsonb can be <b>compared</b> (json has no <code class="i">=</code> at all) and <b>indexed</b>. Use json only to keep the exact original bytes — rare.', 'xanh')}` },

  { t: 'A document is a tree — operators walk it', giua: true, body: `
${docTree()}
${p('Every key is a branch, every array element a numbered child. <code class="i">-&gt;</code> takes <b>one step</b> (a key, or an array index), <code class="i">#&gt;</code> takes a whole path in one go, and SQL/JSON path (<code class="i">$.specs.ram</code>) describes the walk as a string.', 21)}` },

  { t: '-> returns jsonb, ->> returns text', body: `
${two(P(L('1', "SELECT name,\n       props->'brand'"), { w: 540, hm: ['"Acme"  | Acme'] }),
P(J(L('1', "SELECT count(*) FROM product WHERE props->'brand' = 'Acme'", { q: "SELECT count(*) FROM product\n WHERE props->'brand' = 'Acme';" }), L('1', "SELECT count(*) FROM product WHERE props->>'brand' = 'Acme'", { q: "SELECT count(*) FROM product\n WHERE props->>'brand' = 'Acme';" })), { w: 560, hm: ['ERROR', '     3'] }))}
${box('One character, most of the confusion', '<code class="i">props-&gt;\'brand\'</code> is the JSON value <code class="i">"Acme"</code> (quotes included, type <b>jsonb</b>); <code class="i">props-&gt;&gt;\'brand\'</code> is the text <code class="i">Acme</code>. Comparing the jsonb side with a text literal is not “false” — PostgreSQL tries to read <code class="i">Acme</code> as JSON and <b>raises an error</b>. Compare text with <code class="i">-&gt;&gt;</code>.', 'do2')}` },

  { t: 'Nested keys, arrays and missing keys', body: `
${two(P(L('1', "SELECT name,\n       props->'specs'->>'ram'"), { w: 440, hm: ['Phone X', 'Keyboard'] }),
P(L('1', "SELECT name, props->'tags'->0", { q: `SELECT name, props->'tags'->0       AS tag_dau,
             props->'tags'->>-1     AS tag_cuoi,
             props #> '{tags,1}'    AS tag_hai,
             jsonb_array_length(props->'tags') AS so_tag
FROM product ORDER BY id;` }), { w: 620 }), 'r37')}
${two(P(L('1', "SELECT name, props->>'Brand'", { q: "SELECT name, props->>'Brand' AS go_sai_hoa_thuong,\n             props->>'brnd'  AS go_sai_chinh_ta\nFROM product WHERE id = 1;" }), { w: 540 }),
box('Never an error — that is the danger', 'A missing key, a wrong case (<code class="i">Brand</code>) or a typo (<code class="i">brnd</code>) all give <b>NULL</b>, silently. Arrays: <code class="i">-&gt;0</code> is the first element, <code class="i">-&gt;&gt;-1</code> the last, <code class="i">#&gt;\'{tags,1}\'</code> a path with an index.', 'do2'))}` },

  { t: 'Trap: every number comes out as text', body: `
${vsd(P(L('1', "SELECT name, props->>'price' AS price FROM product WHERE props->>'price' < '500'", { q: "SELECT name, props->>'price' AS price\nFROM product\nWHERE props->>'price' < '500'\nORDER BY id;" }), { w: 520, hm: ['Laptop Pro', 'Tablet'] }) + p("Text comparison, character by character: <code class=\"i\">'1299' &lt; '500'</code> because <b>1</b> &lt; <b>5</b>. Keyboard K1 (89) is missing because <b>'8'</b> &gt; <b>'5'</b>.", 20),
P(L('1', "SELECT name, props->>'price' AS price FROM product WHERE (props->>'price')::numeric", { q: "SELECT name, props->>'price' AS price\nFROM product\nWHERE (props->>'price')::numeric < 500\nORDER BY id;" }), { w: 520, hm: ['Tablet', 'Keyboard'] }) + p('Cast first: <code class="i">(props-&gt;&gt;\'price\')::numeric</code> — or <code class="i">(props-&gt;\'price\')::numeric</code> straight from jsonb. Now 449 and 89: correct.', 20))}
${box('Rule', 'Anything that leaves <code class="i">-&gt;&gt;</code> is <b>text</b>. Before <code class="i">&lt; &gt; BETWEEN</code>, <code class="i">sum()</code> or <code class="i">ORDER BY</code>, cast to the type you mean.', '')}` },

  { t: 'Searching by content: @> and ? (deep dive in 13.2)', body: `
${two(P(J(L('1', "SELECT name FROM product WHERE props @> '{\"brand\":\"Acme\"}'", { q: "SELECT name FROM product\n WHERE props @> '{\"brand\":\"Acme\"}' ORDER BY id;" }), L('1', "SELECT name FROM product WHERE props ? 'specs'", { q: "SELECT name FROM product\n WHERE props ? 'specs' ORDER BY id;" })), { w: 540, max: 0.9 }),
P(J(L('1', "SELECT name FROM product WHERE props->'specs' ?| array", { q: "SELECT name FROM product\n WHERE props->'specs' ?| array['storage','cpu']\n ORDER BY id;" }), L('1', "SELECT name FROM product WHERE props->'specs' ?& array", { q: "SELECT name FROM product\n WHERE props->'specs' ?& array['ram','cpu']\n ORDER BY id;" })), { w: 540, max: 0.9 }))}
${cards([['@>  contains', 'contains this smaller document, any depth'], ['?  key exists', 'top-level key of the left value'], ['?|  any of', 'specs has storage <b>or</b> cpu'], ['?&amp;  all of', 'specs has ram <b>and</b> cpu']], 4)}` },

  { t: 'Changing a document: jsonb_set, ||, -, #-', body: `
${two(P(J(L('1', "SELECT jsonb_set(props, '{specs,gpu}', '\"10-core\"') ->", { q: "SELECT jsonb_set(props, '{specs,gpu}', '\"10-core\"')\n       -> 'specs' AS them_khoa\nFROM product WHERE id = 1;" }), L('1', "SELECT jsonb_set(props, '{specs,gpu}', '\"10-core\"', false)", { q: "SELECT jsonb_set(props, '{specs,gpu}', '\"10-core\"', false)\n       -> 'specs' AS khong_tao_moi\nFROM product WHERE id = 1;" })), { w: 540, hm: ['"gpu"'] }),
P(J(L('1', "SELECT props || '{", { q: "SELECT props || '{\"color\":\"silver\",\"price\":1249}' AS gop\nFROM product WHERE id = 5;" }), L('1', "SELECT props - 'tags'", { q: "SELECT props - 'tags' AS bo_khoa\nFROM product WHERE id = 5;" }), L('1', "SELECT props #- '{specs,cpu}'", { q: "SELECT props #- '{specs,cpu}' AS bo_duong_dan\nFROM product WHERE id = 2;" })), { w: 560, hm: ['"color": "silver"'] }))}
${p('<code class="i">jsonb_set(doc, path, new)</code> replaces or <b>adds</b> (4th argument <code class="i">false</code> ⇒ only replace) · <code class="i">||</code> merges, the right side wins (price 89 → 1249) · <code class="i">-</code> removes a key · <code class="i">#-</code> removes at a path. Each returns a <b>new</b> document — nothing is stored until you UPDATE.', 19)}` },

  { t: 'UPDATE a document — and the NULL trap', body: `
${two(P(J('pgcourse=# BEGIN;', 'BEGIN', L('1', "UPDATE product SET props = jsonb_set(props, '{price}', to_jsonb(1199))", { tx: '*', q: "UPDATE product\n   SET props = jsonb_set(props, '{price}', to_jsonb(1199))\n WHERE id = 1 RETURNING id, props->'price' AS price;" }), L('1', "UPDATE product SET props = jsonb_set(props, '{note}', NULL)", { tx: '*', q: "UPDATE product\n   SET props = jsonb_set(props, '{note}', NULL)\n WHERE id = 2 RETURNING id, props;" }), 'pgcourse=!# ROLLBACK;', 'ROLLBACK'), { hm: ['ERROR', 'DETAIL'], wrap: true, z: 0.88 }),
P(J(L('1', "SELECT jsonb_set('{\"a\":1}', '{b}', NULL)"), L('1', 'SELECT jsonb_set_lax(', { q: "SELECT jsonb_set_lax('{\"a\":1}', '{b}', NULL)\n         AS lax_mac_dinh,\n       jsonb_set_lax('{\"a\":1}', '{a}', NULL,\n                     true, 'delete_key') AS lax_xoa_khoa;" })), { w: 480, hm: ['{"a": 1, "b": null}'], max: 0.95 }), 'r64')}
${box('Why the whole document vanished', '<code class="i">jsonb_set</code> is STRICT: one NULL argument ⇒ the result is NULL — the <b>entire</b> props, not one key. Here NOT NULL saved the row; without it the data would be gone. Use <code class="i">jsonb_set_lax</code> (stores JSON <code class="i">null</code>, or deletes the key) or <code class="i">coalesce(…, \'null\')</code>.', 'do2')}` },

  { t: 'Building and unpacking documents', body: `
${two(P(J(L('1', "SELECT jsonb_build_object('id', id", { q: "SELECT jsonb_build_object('id', id, 'name', name,\n                          'brand', props->>'brand') AS the\nFROM product WHERE id <= 2 ORDER BY id;" }), L('1', 'SELECT jsonb_agg(name ORDER BY id)', { q: "SELECT jsonb_agg(name ORDER BY id) AS ten_acme\nFROM product WHERE props @> '{\"brand\":\"Acme\"}';" })), { w: 560, max: 0.85 }),
P(L('1', 'SELECT key, value, jsonb_typeof(value)', { q: 'SELECT key, value, jsonb_typeof(value) AS kieu\nFROM product, jsonb_each(props) WHERE id = 3;' }), { w: 540, max: 0.9 }))}
${two(P(L('1', 'SELECT tag, count(*) FROM product, jsonb_array_elements_text', { q: "SELECT tag, count(*)\nFROM product, jsonb_array_elements_text(props->'tags') AS tag\nGROUP BY tag ORDER BY count(*) DESC, tag;" }), { w: 560, hm: ['laptop    |', 'light     |'], max: 0.8 }),
`<ul style="font-size:20px">
<li><b>Build</b>: <code class="i">jsonb_build_object</code>, <code class="i">jsonb_agg</code> — an API response straight from SQL</li>
<li><b>Unpack</b>: <code class="i">jsonb_each</code> (key/value rows), <code class="i">jsonb_array_elements_text</code> (one row per element)</li>
<li>Unpacked rows join, filter and <b>GROUP BY</b> like any table: “how many products per tag?”</li>
</ul>`)}` },

  { t: 'SQL/JSON path: a query language inside the document', body: `
${two(P(J(L('1', "SELECT name, jsonb_path_query(props, '$.specs.ram')", { q: "SELECT name, jsonb_path_query(props, '$.specs.ram') AS ram\nFROM product ORDER BY id;" }), L('1', 'SELECT name FROM product WHERE props @? ', { q: "SELECT name FROM product\n WHERE props @? '$.specs ? (@.ram >= 8)' ORDER BY id;" })), { w: 540, max: 0.9 }),
P(J(L('1', 'SELECT name FROM product WHERE props @@ ', { q: "SELECT name FROM product\n WHERE props @@ '$.price < 500' ORDER BY id;" }), L('1', "SELECT jsonb_path_query('{\"a\":[1,2,3,4]}'", { q: "SELECT jsonb_path_query('{\"a\":[1,2,3,4]}',\n         '$.a[*] ? (@ > $min)', '{\"min\": 2}') AS lon_hon_min;" }), L('1', "SELECT jsonb_path_query('{\"a\":\"x\"}', 'strict"), L('1', "SELECT jsonb_path_query('{\"a\":\"x\"}', 'lax")), { w: 560, hm: ['ERROR'] }))}
${p('<code class="i">$</code> = the document · <code class="i">.key</code> · <code class="i">[*]</code> every element · filter <code class="i">? (@.ram &gt;= 8)</code> · variables <code class="i">$min</code>. <code class="i">@?</code> “does the path find anything?”, <code class="i">@@</code> “is this predicate true?” — both can use a GIN index (13.2). <b>lax</b> (default) forgives a missing key; <b>strict</b> raises an error.', 19)}` },

  { t: 'New in PostgreSQL 17: JSON_TABLE', body: `
${two(S(`SELECT jt.*
FROM product p,
     JSON_TABLE(p.props, '$' COLUMNS (
       brand text    PATH '$.brand',
       price numeric PATH '$.price',
       ram   int     PATH '$.specs.ram',
       cpu   text    PATH '$.specs.cpu'
             DEFAULT 'n/a' ON EMPTY
     )) AS jt
ORDER BY p.id;`, { w: 520, max: 0.95 }), P(L('1', 'SELECT jt.*', { chiOut: true }), { w: 400, hm: ['Zeta  |   799', 'Acme  |    89'] }), 'r64')}
${two(P(L('1', 'SELECT p.name, t.ord, t.tag', { q: "SELECT p.name, t.ord, t.tag\nFROM product p,\n     JSON_TABLE(p.props, '$.tags[*]' COLUMNS (\n       ord FOR ORDINALITY, tag text PATH '$')) AS t\nWHERE p.id IN (1, 2) ORDER BY p.id, t.ord;" }), { w: 560, max: 0.85 }),
box('A document becomes typed rows', 'The SQL standard way (also Oracle, MySQL 8): declare columns with a type and a path; <code class="i">ON EMPTY</code> fills missing keys; <code class="i">$.tags[*]</code> + <code class="i">FOR ORDINALITY</code> turns an array into numbered rows. Before 17: <code class="i">jsonb_to_record</code>, <code class="i">jsonb_array_elements</code>.', 'lam'))}` },

  { t: 'PostgreSQL 17: JSON_VALUE and friends', body: `
${P(L('1', 'SELECT name,\n       JSON_EXISTS'), { hm: ['Phone X       | t'], max: 0.82 })}
${two(P(J(L('1', "SELECT JSON_VALUE('{\"ram\":\"16GB\"}', '$.ram' RETURNING int) AS", { q: "SELECT JSON_VALUE('{\"ram\":\"16GB\"}', '$.ram'\n  RETURNING int) AS loi_im_lang;" }), L('1', "SELECT JSON_VALUE('{\"ram\":\"16GB\"}', '$.ram' RETURNING int ERROR", { q: "SELECT JSON_VALUE('{\"ram\":\"16GB\"}', '$.ram'\n  RETURNING int ERROR ON ERROR);" }), L('1', "SELECT JSON_VALUE('{\"ram\":\"16GB\"}', '$.ram' RETURNING int DEFAULT", { q: "SELECT JSON_VALUE('{\"ram\":\"16GB\"}', '$.ram'\n  RETURNING int DEFAULT -1 ON ERROR) AS mac_dinh;" })), { w: 620, hm: ['ERROR:'], max: 0.78 }),
box('Silent by default', '"16GB" is not an int, and the default is <b>NULL ON ERROR</b> — no warning at all. Say what you want: <code class="i">ERROR ON ERROR</code> or <code class="i">DEFAULT -1 ON ERROR</code>.', 'do2'), 'r64')}` },

  { t: 'The real decision: a column or JSONB?', body: `
${cards([['Make it a real column when…', 'you <b>filter, sort or join</b> on it; it must never be missing; it needs a foreign key, CHECK or NOT NULL. Columns get types, constraints, natural indexes and <b>honest planner statistics</b>.'],
['Use JSONB when…', 'keys <b>really differ</b> per row (product specs, per-integration settings, a webhook payload kept verbatim) or the <b>user</b>, not you, decides the shape.'],
['The honest middle', 'Promote a key to a column the moment production filters on it — a <b>generated column</b> does it without rewriting the app.']], 3)}
${two(`<div>${S(`BEGIN;
ALTER TABLE product ADD COLUMN price numeric
  GENERATED ALWAYS AS ((props->>'price')::numeric) STORED;
SELECT id, name, price FROM product ORDER BY price DESC;
ROLLBACK;`, { w: 600 })}${p('PostgreSQL keeps <code class="i">price</code> in sync on every write; it is a real numeric column — index it, sort it, trust its statistics.', 19)}</div>`, P(L('1', 'SELECT id, name, price FROM product ORDER BY price DESC', { chiOut: true }), { w: 400 }), 'r64')}` },

  { t: 'Trap: no schema — nothing checks the keys', body: `
${P(J(L('1', 'INSERT INTO product (name, props) VALUES\n', { tx: '*' }), L('1', 'SELECT count(*) AS dem_co_gia', { tx: '*', q: "SELECT count(*) AS dem_co_gia, sum((props->>'price')::numeric) AS tong\nFROM product WHERE props->>'brand' = 'Acme' AND props ? 'price';" }), L('1', "SELECT name, jsonb_typeof(props->'price') AS kieu_price", { tx: '*', q: "SELECT name, jsonb_typeof(props->'price') AS kieu_price\nFROM product WHERE props->>'brand' = 'Acme' ORDER BY id;" })), { hm: ['Mouse M1      | string', 'Mouse M2      |', 'Mouse M3      |', '4 | 2412'], max: 0.78 })}
${box('Every insert accepted, the report silently wrong', 'A string <code class="i">"25"</code>, a wrong case <code class="i">"Price"</code>, a typo <code class="i">"prise"</code> — nothing objects; the report counts <b>4</b> prices. And the planner has <b>no statistics</b> per key inside a blob, so its estimates for JSONB filters are guesses (13.2 shows it).', 'do2')}` },

  { t: 'A CHECK constraint helps — mind the NULL hole', body: `
${two(P(J(L('1', 'ALTER TABLE product ADD CONSTRAINT props_price_is_number CHECK (jsonb_typeof', { tx: '*', q: "ALTER TABLE product\n  ADD CONSTRAINT props_price_is_number\n  CHECK (jsonb_typeof(props->'price') = 'number');" }), L('1', "INSERT INTO product (name, props) VALUES ('Mouse M1'", { tx: '*', q: "INSERT INTO product (name, props)\n VALUES ('Mouse M1',\n         '{\"brand\":\"Acme\",\"price\":\"25\"}');" })), { hm: ['ERROR'], title: 'transaction 1 — CHECK on the type', wrap: true, z: 0.8 }),
P(J(L('1', 'ALTER TABLE product ADD CONSTRAINT props_price_is_number CHECK (jsonb_typeof', { lan: 1, tx: '*', q: "ALTER TABLE product\n  ADD CONSTRAINT props_price_is_number\n  CHECK (jsonb_typeof(props->'price') = 'number');" }), L('1', "INSERT INTO product (name, props) VALUES ('Mouse M2'", { tx: '*', q: "INSERT INTO product (name, props)\n VALUES ('Mouse M2',\n         '{\"brand\":\"Acme\",\"Price\":29}');" })), { hm: ['INSERT 0 1'], title: 'transaction 2 — same CHECK, key "Price"', wrap: true, z: 0.8 }))}
${two(P(J(L('1', "ALTER TABLE product ADD CONSTRAINT props_price_is_number CHECK (props ?", { tx: '*', q: "ALTER TABLE product\n  ADD CONSTRAINT props_price_is_number\n  CHECK (props ? 'price'\n         AND jsonb_typeof(props->'price') = 'number');" }), L('1', "INSERT INTO product (name, props) VALUES ('Mouse M2'", { lan: 1, tx: '*', q: "INSERT INTO product (name, props)\n VALUES ('Mouse M2',\n         '{\"brand\":\"Acme\",\"Price\":29}');" })), { hm: ['ERROR'], title: 'transaction 3 — require the key too', wrap: true, z: 0.8 }),
box('NULL passes a CHECK', 'For “Price” the key <code class="i">price</code> is missing, so <code class="i">jsonb_typeof(NULL) = \'number\'</code> is <b>NULL</b> — and a CHECK only rejects <b>false</b>. Require the key (<code class="i">props ? \'price\' AND …</code>), or better: make price a real column.', 'do2'))}` },

  { t: 'In practice: Prisma Json on CuongThai', body: `
${two(S(`model SocialNotification {
  id         Int   @id @default(autoincrement())
  receiverId Int   @map("receiver_id")
  payload    Json? @map("payload") @db.JsonB
  …
}
// CuongThai code (src/routes/work.feed.db.test.ts)
prisma.socialNotification.findMany({
  where: { payload: { path: ['surface'],
                      equals: 'work' } } })`, { lang: 'typescript', w: 540 }),
`<div>${S(`-- SQL Prisma 5.22 really sent (query log):
SELECT "id" FROM "social_notifications"
WHERE ("payload" #> ARRAY[$1]::text[])::jsonb::jsonb = $2
-- $1 = 'surface', $2 = "work"`, { w: 540 })}
${box('What it means', '<code class="i">Json</code> + <code class="i">@db.JsonB</code> = a jsonb column. A <code class="i">path</code> filter becomes <code class="i">#&gt; … =</code> — <b>not</b> <code class="i">@&gt;</code>. Lesson 13.2 shows why that matters for indexes. Anything richer (path queries, JSON_TABLE) ⇒ <code class="i">$queryRaw</code>.', 'lam')}</div>`)}
${two(S(`where: { payload: { path: ['surface'],
                    string_starts_with: 'wo' } }`, { lang: 'typescript', w: 540 }), S(`-- SQL Prisma 5.22 really sent:
WHERE ("payload" #>> ARRAY[$1]::text[]) LIKE $2   -- 'wo%'
  AND JSONB_TYPEOF(
        ("payload" #> ARRAY[$3]::text[])::jsonb) = $4   -- 'string'`, { w: 540 }), 'r46')}` },

  { t: 'CT Shop: product.attrs', body: `
${two(P(L('ctshop', 'SELECT k AS khoa', { db: 'ctshop', q: 'SELECT k AS khoa, count(*) AS so_sp\nFROM product, jsonb_object_keys(attrs) AS k\nGROUP BY k ORDER BY so_sp DESC, k;' }), { w: 440, title: 'psql (17.11) — ctshop', max: 0.85 }),
P(L('ctshop', "SELECT attrs->>'brand' AS brand", { db: 'ctshop', q: "SELECT attrs->>'brand' AS brand, count(*) AS so_sp\nFROM product GROUP BY 1\nORDER BY 2 DESC, 1 LIMIT 5;" }), { w: 600, title: 'psql (17.11) — ctshop', max: 0.85 }), 'r37')}
${two(P(L('ctshop', "SELECT id, name, attrs->>'color'", { db: 'ctshop', q: "SELECT id, name, attrs->>'color' AS color FROM product\n WHERE attrs @> '{\"color\":\"đỏ\"}' ORDER BY id;" }), { w: 560, title: 'psql (17.11) — ctshop', max: 0.8 }),
box('Apply the rule', 'All 48 CT Shop products carry <b>the same three keys</b> (brand, color, tags) — so <code class="i">brand</code> is a column in disguise. If the shop filters by brand every day, promote it (generated column, or real column + backfill). Lab 7 builds CT Shop search on this table.', ''))}` },

  { t: 'Exercise', to: true, giua: true, body: `
<ol>
<li>List products with <b>at least 8 GB RAM</b>: name, ram (as int), cpu (or <code class="i">'n/a'</code>), price — most expensive first.</li>
<li>Add the tag <code class="i">"sale"</code> to every Acme product (inside a transaction, then roll back).</li>
<li>Count products and the average price <b>per brand</b>.</li>
</ol>
${box('Hint', 'path filter <code class="i">@?</code> · <code class="i">#&gt;&gt;</code> + <code class="i">coalesce</code> · <code class="i">jsonb_set(props, \'{tags}\', … || \'["sale"]\')</code> · cast before <code class="i">avg()</code>', 'lam')}` },

  { t: 'Solution', body: `
${P(L('1ex', 'SELECT name, (props', { q: "SELECT name, (props->'specs'->>'ram')::int AS ram,\n       coalesce(props#>>'{specs,cpu}', 'n/a') AS cpu,\n       (props->>'price')::numeric AS price\nFROM product WHERE props @? '$.specs ? (@.ram >= 8)'\nORDER BY price DESC;" }), { max: 0.95 })}
${two(P(L('1ex', 'UPDATE product SET props = jsonb_set(props', { tx: '*', q: "UPDATE product\n   SET props = jsonb_set(props, '{tags}',\n                         (props->'tags') || '[\"sale\"]')\nWHERE props @> '{\"brand\":\"Acme\"}'\nRETURNING name, props->'tags' AS tags;" }), { w: 560, max: 0.85 }), P(L('1ex', "SELECT props->>'brand' AS brand", { q: "SELECT props->>'brand' AS brand, count(*) AS so_sp,\n       round(avg((props->>'price')::numeric)) AS gia_tb\nFROM product GROUP BY 1 ORDER BY 1;" }), { w: 520, max: 0.85 }))}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why does <code class="i">WHERE props-&gt;&gt;'price' &lt; '500'</code> return Laptop Pro 14?</li>
<li><code class="i">SET props = jsonb_set(props, '{note}', $1)</code> with <code class="i">$1</code> = NULL — what happens to the row?</li>
<li>Name two signs that a JSONB key should become a real column.</li>
</ol>
${box('Answers', '1 · <code class="i">-&gt;&gt;</code> returns text: <code class="i">\'1299\' &lt; \'500\'</code> character by character. Cast to numeric. &nbsp;2 · jsonb_set is strict ⇒ the whole props becomes NULL (NOT NULL error, or lost data). Use jsonb_set_lax. &nbsp;3 · You filter/sort/join on it; it must always exist or needs a type, CHECK, FK.', 'xanh')}` },

  { t: 'Summary & next', to: true, body: `
<ul>
<li><b>jsonb</b>, not json: parsed once, keys sorted, comparable, indexable</li>
<li><code class="i">-&gt;</code> jsonb · <code class="i">-&gt;&gt;</code> text · <code class="i">#&gt;</code>/<code class="i">#&gt;&gt;</code> paths — missing ⇒ NULL; cast before comparing numbers</li>
<li>Edit with <code class="i">jsonb_set</code> / <code class="i">||</code> / <code class="i">-</code> / <code class="i">#-</code>; beware the strict NULL</li>
<li>SQL/JSON path; PostgreSQL 17 JSON_TABLE / JSON_VALUE / JSON_EXISTS</li>
<li>Filter on it often ⇒ make it a column; JSONB is for the long tail</li>
</ul>
${box('Next — 13.2: querying JSONB fast with GIN', 'Containment and existence in depth, the inverted index behind GIN, jsonb_ops vs jsonb_path_ops, and when GIN does not help at all.', 'lam')}` },
]);
