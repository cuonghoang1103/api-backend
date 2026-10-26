/**
 * Lab 7 — CT Shop: thuộc tính sản phẩm JSONB + ô tìm kiếm FTS + trigram, tiếng Việt không dấu (sau Chương 13). Agent lab7, 26/10/2026.
 * Chèn vào Chương 13 bằng lab/index.mjs (LAB_SAU[13]) — sau bài 13.4, trước quiz.
 * Kiến thức tới Ch13 (jsonb, toán tử, jsonb_set, JSON_TABLE — 13.1; GIN, jsonb_path_ops, B-tree biểu thức — 13.2;
 * tsvector/tsquery, websearch_to_tsquery, setweight, ts_rank, ts_headline, unaccent — 13.3; pg_trgm, word_similarity, GiST KNN, f_unaccent — 13.4)
 * + hàm/trigger/view của Ch12. Mới, giảng ngắn ngay trong lab: IS JSON OBJECT, jsonb_strip_nulls, jsonb_set_lax, NESTED PATH,
 * ERROR ON ERROR, ts_debug, CREATE FUNCTION … SET, \copy … TO, toán tử <<-> (khoảng cách từ).
 * Dữ liệu: lab7-start.sql = lược đồ chuẩn + dữ liệu chuẩn + bảng tạm spec_feed (48 tài liệu JSON của nhà cung cấp, có 4 giá trị sai kiểu).
 * Mọi output = chạy thật PostgreSQL 17.11 (lab7-start.sql rồi lab7-solution.sql bằng psql -f qua TTY, DB nháp ctlab7, đã xoá);
 * Prisma 5.22 chạy thật trên cùng DB (src/khung/pg/that/pg-lab-7.prisma.txt).
 * Q / O / SOL SINH TỰ ĐỘNG từ lab/sql/lab7-solution.sql + output thật (scratchpad lab7/mk7.mjs) — không gõ tay.
 * LUẬT escaping như các tệp chương: không backtick trần, ${ trong mã → \${, < > trong mã → esc().
 */
import G from '../giang/pg-lab-7.mjs';

const F = 'https://media.cuongthai.com/files/academy/PG/labs/v1';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const code = (s, lang = 'sql') => `<pre><code class="language-${lang}">${esc(s).split('\n').map((l) => l.replace(lang === 'sql' ? /(--.*)$/ : /(\/\/.*)$/, '<span class="tok-comment">$1</span>')).join('\n')}</code></pre>`;
const out = (s) => `<div class="out">${esc(s)}</div>`;
const card = (href, ico, title, sub, cta) => `<a class="link-card" href="${href}" target="_blank" rel="noopener">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>
  <span class="lc-cta">${cta}</span>
</a>`;
const details = (sum, body) => `<details><summary>${sum}</summary>\n${body}\n</details>`;

/* Câu SQL từng bước — sinh từ lab7-solution.sql. */
/* Q:BEGIN */
const Q = {
  EXT1: `CREATE EXTENSION IF NOT EXISTS unaccent SCHEMA public;`,
  EXT2: `CREATE EXTENSION IF NOT EXISTS pg_trgm  SCHEMA public;`,
  J1A: `SELECT k AS key, jsonb_typeof(v) AS json_type, count(*) AS docs
FROM spec_feed, jsonb_each(doc->'specs') AS e(k, v)
GROUP BY k, jsonb_typeof(v)
ORDER BY k, docs DESC;   -- 25 rows: 20 keys; desc is in all 48 documents`,
  J1B: `SELECT k AS key, string_agg(DISTINCT jsonb_typeof(v), ', ') AS json_types, count(*) AS docs
FROM spec_feed, jsonb_each(doc->'specs') AS e(k, v)
GROUP BY k
HAVING count(DISTINCT jsonb_typeof(v)) > 1
ORDER BY k;   -- 4 keys: gsm, pages, solar, tip_mm`,
  J1C: `SELECT f.line, f.doc->>'sku' AS sku, e.k AS key, e.v AS value, jsonb_typeof(e.v) AS json_type
FROM spec_feed f, jsonb_each(f.doc->'specs') AS e(k, v)
WHERE (e.k IN ('pages', 'tip_mm', 'gsm') AND jsonb_typeof(e.v) <> 'number')
   OR (e.k = 'solar' AND jsonb_typeof(e.v) <> 'boolean')
ORDER BY f.line;   -- 5 values: 4 badly typed strings + 1 JSON null`,
  J1D: `SELECT f.line, f.doc->>'sku' AS sku, f.doc->'specs'->>'desc' AS description
FROM spec_feed f
WHERE NOT EXISTS (SELECT 1 FROM product p WHERE p.sku = f.doc->>'sku');   -- line 48, CT1207`,
  J1E: `SELECT p.sku, p.name
FROM product p
WHERE NOT EXISTS (SELECT 1 FROM spec_feed f WHERE f.doc->>'sku' = p.sku);   -- CT0906, the Moleskine`,
  J1F: `SELECT c.id, c.name AS category, string_agg(DISTINCT k, ', ' ORDER BY k) AS spec_keys
FROM spec_feed f
JOIN product p ON p.sku = f.doc->>'sku'
JOIN category c ON c.id = p.category_id,
     jsonb_object_keys(f.doc->'specs') AS k
WHERE k <> 'desc'
GROUP BY c.id, c.name
ORDER BY c.id;   -- 8 categories, 8 different filter panels`,
  J2A: `UPDATE product p SET attrs = p.attrs || f.doc->'specs'
FROM spec_feed f WHERE f.doc->>'sku' = p.sku;`,
  J2B: `SELECT sku, attrs FROM product WHERE sku = 'CT1201';   -- brand, color and tags are GONE`,
  J2C: `SELECT '{"brand": "CT Books"}'::jsonb || '{"specs": {"pages": 320}}'::jsonb -> 'specs' AS without_parentheses,
       '{"brand": "CT Books"}'::jsonb || ('{"specs": {"pages": 320}}'::jsonb -> 'specs') AS with_parentheses;`,
  J2D: `UPDATE product p SET attrs = p.attrs || (f.doc->'specs')
FROM spec_feed f WHERE f.doc->>'sku' = p.sku;   -- UPDATE 47`,
  J2E: `SELECT sku, attrs FROM product WHERE sku = 'CT1201';`,
  J2F: `ALTER TABLE product ADD CONSTRAINT product_attrs_object CHECK (attrs IS JSON OBJECT);`,
  J2G: `ALTER TABLE product ADD CONSTRAINT product_attrs_types CHECK (
      jsonb_typeof(attrs->'pages')   = 'number'  AND jsonb_typeof(attrs->'tip_mm') = 'number'
  AND jsonb_typeof(attrs->'pack')    = 'number'  AND jsonb_typeof(attrs->'gsm')    = 'number'
  AND jsonb_typeof(attrs->'solar')   = 'boolean' AND jsonb_typeof(attrs->'exam_ok') = 'boolean'
  AND jsonb_typeof(attrs->'tags')    = 'array');   -- ERROR: the dirty documents are in the table now`,
  J2H: `SELECT sku, k AS key, v AS value, jsonb_typeof(v) AS json_type
FROM product, jsonb_each(attrs) AS e(k, v)
WHERE (k IN ('pages', 'tip_mm', 'pack', 'gsm') AND jsonb_typeof(v) <> 'number')
   OR (k IN ('solar', 'exam_ok') AND jsonb_typeof(v) <> 'boolean')
   OR (k = 'tags' AND jsonb_typeof(v) <> 'array')
ORDER BY sku;   -- the same 5 values, now inside product.attrs`,
  J2I: `UPDATE product
SET attrs = jsonb_set(attrs, '{pages}', to_jsonb(substring(attrs->>'pages' FROM '[0-9]+')::int))
WHERE jsonb_typeof(attrs->'pages') = 'string'
RETURNING sku, attrs->'pages' AS pages;`,
  J2J: `UPDATE product
SET attrs = jsonb_set(attrs, '{tip_mm}', to_jsonb((attrs->>'tip_mm')::numeric))
WHERE jsonb_typeof(attrs->'tip_mm') = 'string'
RETURNING sku, attrs->'tip_mm' AS tip_mm;`,
  J2K: `UPDATE product
SET attrs = jsonb_set(attrs, '{solar}', to_jsonb(attrs->>'solar' IN ('có', 'yes', 'true')))
WHERE jsonb_typeof(attrs->'solar') = 'string'
RETURNING sku, attrs->'solar' AS solar;`,
  J2L: `SELECT sku, attrs->'gsm' AS gsm_json, attrs->>'gsm' IS NULL AS text_is_null, attrs ? 'gsm' AS has_key
FROM product WHERE sku IN ('CT0801', 'CT0803', 'CT0901') ORDER BY sku;`,
  J2M: `UPDATE product SET attrs = jsonb_strip_nulls(attrs)
WHERE attrs @> '{"gsm": null}'
RETURNING sku, attrs ? 'gsm' AS has_gsm;`,
  J2N: `UPDATE product SET attrs = (attrs - 'colour') || jsonb_build_object('color', attrs->'colour')
WHERE attrs ? 'colour'
RETURNING sku, attrs->'color' AS color, attrs ? 'colour' AS still_has_colour;`,
  J2O: `ALTER TABLE product ADD CONSTRAINT product_attrs_types CHECK (
      jsonb_typeof(attrs->'pages')   = 'number'  AND jsonb_typeof(attrs->'tip_mm') = 'number'
  AND jsonb_typeof(attrs->'pack')    = 'number'  AND jsonb_typeof(attrs->'gsm')    = 'number'
  AND jsonb_typeof(attrs->'solar')   = 'boolean' AND jsonb_typeof(attrs->'exam_ok') = 'boolean'
  AND jsonb_typeof(attrs->'tags')    = 'array');   -- now it is accepted`,
  J2P: `UPDATE product SET attrs = jsonb_set(attrs, '{pages}', '"300 trang"') WHERE sku = 'CT1201';`,
  J2Q: `UPDATE product SET attrs = '[]' WHERE sku = 'CT0501';`,
  J2S: `UPDATE product
SET attrs = jsonb_set(attrs, '{tags}', (attrs->'tags') || '["ôn thi"]')
WHERE attrs @> '{"exam_ok": true}' OR attrs @> '{"hardness": "2B"}'
RETURNING sku, attrs->'tags' AS tags;   -- UPDATE 7: 4 calculators + 3 pencils`,
  J2U: `UPDATE product SET attrs = jsonb_set(attrs, '{discount}', to_jsonb(NULL::int)) WHERE sku = 'CT0501';`,
  J2V: `SELECT jsonb_set('{"brand": "Thiên Long"}', '{discount}', to_jsonb(NULL::int))       AS jsonb_set,
       jsonb_set_lax('{"brand": "Thiên Long"}', '{discount}', NULL)                   AS lax_json_null,
       jsonb_set_lax('{"brand": "Thiên Long", "discount": 10}', '{discount}', NULL,
                     true, 'delete_key')                                              AS lax_delete_key;`,
  J2W: `SELECT count(*) AS products, count(*) FILTER (WHERE attrs ? 'desc') AS with_specs,
       count(*) FILTER (WHERE attrs ? 'colour') AS colour_left
FROM product;   -- 48 | 47 | 0`,
  J3A: `INSERT INTO product (sku, name, category_id, price, stock, attrs, is_active, created_at)
SELECT 'MP' || lpad(g::text, 6, '0'),
       CASE g % 4 WHEN 0 THEN b.name   -- sellers write titles their own way:
                  WHEN 1 THEN unaccent(b.name)   -- without accents,
                  WHEN 2 THEN b.name || ' chính hãng'   -- with a slogan,
                  ELSE upper(b.name) END,   -- IN CAPITALS
       b.category_id,
       greatest(1000, round(b.price * (0.85 + (g % 31) / 100.0), -3)),
       (g * 7) % 250,
       b.attrs || jsonb_build_object('seller', s.seller, 'color', (ARRAY['xanh', 'đen', 'đỏ', 'tím', 'vàng'])[1 + g % 5]),
       g % 10 <> 0,   -- 10 % of the listings are switched off
       timestamptz '2026-09-01 08:00+07' + g * interval '1 minute'
FROM generate_series(1, 60000) AS g
JOIN product b ON b.id = 1 + g % 48
CROSS JOIN LATERAL (SELECT (ARRAY['Nhà sách Bình Minh', 'VPP Ánh Dương', 'Shop Mực Tím', 'Góc Học Tập', 'VPP Sao Mai',
  'Nhà sách Hải Âu', 'Tiệm Bút Xinh', 'VPP Phương Nam', 'Kho Sỉ Học Đường', 'Shop Cô Giáo Thảo'])[1 + (g / 48) % 10] AS seller) AS s;`,
  J3B: `ANALYZE product;`,
  J3C: `SELECT count(*) AS listings, count(*) FILTER (WHERE is_active) AS active,
       pg_size_pretty(pg_table_size('product')) AS table_size
FROM product;   -- 60048 | 54048 | 20 MB`,
  J3D: `SELECT sku, name, attrs->>'color' AS color FROM product WHERE sku BETWEEN 'MP000001' AND 'MP000004' ORDER BY sku;`,
  J3E: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name, price FROM product
WHERE category_id = 5 AND is_active AND attrs @> '{"ink": "gel", "tip_mm": 0.5, "color": "tím"}'
ORDER BY price LIMIT 24;   -- before: Seq Scan, 59.548 rows removed to keep 500`,
  J3G: `CREATE INDEX product_attrs_gin ON product USING GIN (attrs jsonb_path_ops);`,
  J3H: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name, price FROM product
WHERE category_id = 5 AND is_active AND attrs @> '{"ink": "gel", "tip_mm": 0.5, "color": "tím"}'
ORDER BY price LIMIT 24;   -- after: Bitmap Index Scan on product_attrs_gin, 500 heap pages instead of 2.546`,
  J3I: `SELECT pg_size_pretty(pg_relation_size('product_attrs_gin')) AS gin_index, pg_size_pretty(pg_relation_size('product')) AS heap;`,
  J3J: `SELECT count(*) FILTER (WHERE attrs @> '{"ink": "gel"}')   AS ink_gel,
       count(*) FILTER (WHERE attrs @> '{"tip_mm": 0.5}')  AS tip_05,
       count(*) FILTER (WHERE attrs @> '{"color": "tím"}') AS color_tim
FROM product;   -- 2502 | 7506 | 12005 → all three at once: 500`,
  J3K: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name, price FROM product
WHERE category_id = 5 AND is_active AND attrs @> '{"ink": "gel", "tip_mm": 0.5}'
ORDER BY price LIMIT 24;   -- 2.502 candidates on 1.292 pages: still the index, but half the table`,
  J3L: `SELECT count(*) FILTER (WHERE attrs ? 'refill') AS has_key_refill,
       count(*) FILTER (WHERE attrs @> '{"refill": true}') AS refill_true
FROM product;   -- 3753 vs 2502: refill = false also HAS the key`,
  J3M: `EXPLAIN (COSTS OFF) SELECT count(*) FROM product WHERE attrs ? 'refill';`,
  J3N: `EXPLAIN (COSTS OFF) SELECT count(*) FROM product WHERE attrs @> '{"refill": true}';`,
  J3O: `SELECT sku, attrs->'tip_mm' AS tip_mm, attrs->>'tip_mm' = '0.5' AS text_equal, attrs @> '{"tip_mm": 0.5}' AS json_equal
FROM product WHERE sku IN ('CT0504', 'CT0602') ORDER BY sku;`,
  J3P: `SELECT count(*) FILTER (WHERE attrs @> '{"tip_mm": 0.5}') AS json_equal,
       count(*) FILTER (WHERE attrs->>'tip_mm' = '0.5') AS text_equal
FROM product;   -- 7506 vs 6255: the text comparison loses CT0602 and its 1.250 listings`,
  J3Q: `SELECT sku, attrs->>'pages' AS pages,
       attrs->>'pages' > '100' AS text_gt_100, (attrs->>'pages')::int > 100 AS int_gt_100
FROM product WHERE sku IN ('CT0801', 'CT0805', 'CT1203') ORDER BY sku;`,
  J3R: `CREATE INDEX product_pages ON product (((attrs->>'pages')::int));`,
  J3S: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name, price FROM product
WHERE (attrs->>'pages')::int BETWEEN 400 AND 500 AND is_active
ORDER BY price LIMIT 24;`,
  J4V: `CREATE VIEW product_attr_export AS
SELECT p.sku, p.name, jt.*
FROM product p,
     JSON_TABLE(p.attrs, '$' COLUMNS (
       brand   text    PATH '$.brand',
       color   text    PATH '$.color',
       pages   int     PATH '$.pages',
       tip_mm  numeric PATH '$.tip_mm',
       solar   boolean PATH '$.solar',
       exam_ok boolean PATH '$.exam_ok',
       NESTED PATH '$.tags[*]' COLUMNS (tag text PATH '$')   -- one row per tag
     )) AS jt;`,
  J4A: `SELECT sku, brand, pages, tip_mm, solar, exam_ok, tag
FROM product_attr_export
WHERE sku IN ('CT0504', 'CT0601', 'CT1001', 'CT1201') ORDER BY sku, tag;`,
  J4B: `SELECT count(*) AS export_rows, count(DISTINCT sku) AS products FROM product_attr_export WHERE sku LIKE 'CT%';   -- 55 rows for 48 products (7 have two tags)`,
  J4C: `\\copy (SELECT * FROM product_attr_export WHERE sku LIKE 'CT%' ORDER BY sku, tag) TO '/tmp/lab7-attrs.csv' WITH (FORMAT csv, HEADER)`,
  J4D: `SELECT f.line, f.doc->>'sku' AS sku, f.doc->'specs'->'pages' AS raw_pages, jt.pages, f.doc->'specs'->'solar' AS raw_solar, jt.solar
FROM spec_feed f,
     JSON_TABLE(f.doc, '$.specs' COLUMNS (pages int PATH '$.pages', solar boolean PATH '$.solar')) AS jt
WHERE f.line IN (19, 20, 22, 32) ORDER BY f.line;`,
  J4E: `SELECT jt.pages
FROM spec_feed f,
     JSON_TABLE(f.doc, '$.specs' COLUMNS (pages int PATH '$.pages' ERROR ON ERROR)) AS jt
WHERE f.line IN (19, 20);   -- ask for errors and you get one`,
  S1A: `SELECT to_tsvector('simple', 'Bút bi Thiên Long TL-027 (xanh)') AS simple_doc,
       to_tsvector('simple', 'Bút bi Thiên Long TL-027 (xanh)') @@ websearch_to_tsquery('simple', 'but bi thien long') AS found;`,
  S1B: `CREATE TEXT SEARCH CONFIGURATION vn_unaccent (COPY = simple);`,
  S1C: `ALTER TEXT SEARCH CONFIGURATION vn_unaccent
  ALTER MAPPING FOR hword, hword_part, word WITH unaccent, simple;`,
  S1D: `SELECT alias, token, dictionaries, lexemes FROM ts_debug('vn_unaccent', 'Bút bi Thiên Long TL-027');`,
  S1E: `SELECT to_tsvector('vn_unaccent', 'Bút bi Thiên Long TL-027 (xanh)') AS vn_doc,
       to_tsvector('vn_unaccent', 'BÚT BI THIÊN LONG') = to_tsvector('vn_unaccent', 'But bi Thien Long') AS same_doc;`,
  S1F: `SELECT to_tsvector('vn_unaccent', 'Máy tính cho học sinh') @@ websearch_to_tsquery('vn_unaccent', 'sinh hoc')     AS words_sinh_hoc,
       to_tsvector('vn_unaccent', 'Máy tính cho học sinh') @@ websearch_to_tsquery('vn_unaccent', '"sinh hoc"')   AS phrase_sinh_hoc,
       to_tsvector('vn_unaccent', 'Máy tính cho học sinh') @@ websearch_to_tsquery('vn_unaccent', '"hoc sinh"')   AS phrase_hoc_sinh,
       to_tsvector('vn_unaccent', 'Bàn học gấp gọn')       @@ websearch_to_tsquery('vn_unaccent', 'ban')          AS ban_finds_desk,
       to_tsvector('vn_unaccent', 'Sách bản in')           @@ websearch_to_tsquery('vn_unaccent', 'ban')          AS ban_finds_edition;`,
  S1G: `ALTER TABLE product ADD COLUMN name_fold text GENERATED ALWAYS AS (lower(unaccent(name))) STORED;`,
  S1H: `SELECT provolatile FROM pg_proc WHERE oid = 'public.unaccent(text)'::regprocedure;`,
  S1I: `CREATE FUNCTION f_unaccent(text) RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
  RETURN public.unaccent('public.unaccent'::regdictionary, $1);   -- the dictionary is named: nothing left to look up`,
  S1J: `SELECT f_unaccent('Vở ô ly Hồng Hà — Đà Nẵng') AS folded;`,
  S2A: `ALTER TABLE product ADD COLUMN search_tsv tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('vn_unaccent', name), 'A') ||
  setweight(to_tsvector('vn_unaccent', (SELECT c.name FROM category c WHERE c.id = category_id)), 'B')) STORED;`,
  S2B: `ALTER TABLE product ADD COLUMN search_tsv tsvector;`,
  S2C: `CREATE FUNCTION product_search_doc() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE cat text;
BEGIN
  SELECT concat_ws(' ', parent.name, c.name) INTO cat   -- "Bút & mực Bút bi"
  FROM category c LEFT JOIN category parent ON parent.id = c.parent_id
  WHERE c.id = NEW.category_id;
  NEW.search_tsv := setweight(to_tsvector('vn_unaccent', NEW.name), 'A')
                 || setweight(to_tsvector('vn_unaccent', coalesce(cat, '')), 'B')
                 || setweight(to_tsvector('vn_unaccent', concat_ws(' ', NEW.attrs->>'brand', NEW.attrs->>'desc')), 'C');
  RETURN NEW;
END $$;`,
  S2D: `CREATE TRIGGER product_search_doc BEFORE INSERT OR UPDATE OF name, category_id, attrs ON product
  FOR EACH ROW EXECUTE FUNCTION product_search_doc();`,
  S2F: `UPDATE product SET name = name;   -- back-fill: fires the trigger once per row`,
  S2G: `CREATE INDEX product_search_gin ON product USING GIN (search_tsv);`,
  S2I: `ANALYZE product;`,
  S2J: `SELECT sku, name, search_tsv FROM product WHERE sku = 'CT1203';`,
  S2K: `SELECT count(*) AS matches, count(*) FILTER (WHERE is_active) AS active
FROM product WHERE search_tsv @@ websearch_to_tsquery('vn_unaccent', 'but bi thien long');   -- 2502 | 2252`,
  S2L: `SELECT sku, ts_headline('vn_unaccent', name, q, 'StartSel=[, StopSel=]') AS name, round(ts_rank(search_tsv, q)::numeric, 4) AS rank
FROM product, websearch_to_tsquery('vn_unaccent', 'but bi thien long') AS q
WHERE is_active AND search_tsv @@ q
ORDER BY rank DESC, id LIMIT 5;`,
  S2M: `SELECT sku, name, round(ts_rank(search_tsv, q)::numeric, 4) AS rank
FROM product, websearch_to_tsquery('vn_unaccent', 'giao trinh') AS q
WHERE sku LIKE 'CT%' AND search_tsv @@ q
ORDER BY rank DESC, id;`,
  S2N: `SELECT sku, name, ts_headline('vn_unaccent', attrs->>'desc', q, 'StartSel=[, StopSel=]') AS snippet
FROM product, websearch_to_tsquery('vn_unaccent', 'mang vao phong thi') AS q
WHERE sku LIKE 'CT%' AND search_tsv @@ q
ORDER BY ts_rank(search_tsv, q) DESC, id;`,
  S2O: `SELECT x AS typed, websearch_to_tsquery('vn_unaccent', x) AS tsquery,
       (SELECT count(*) FROM product WHERE sku LIKE 'CT%' AND search_tsv @@ websearch_to_tsquery('vn_unaccent', x)) AS own_products
FROM unnest(ARRAY['so tay', 'so tay -moleskine', '"bullet journal"', 'casio or vinacal']) AS x;`,
  S2P: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name FROM product, websearch_to_tsquery('vn_unaccent', 'but bi thien long') AS q
WHERE is_active AND search_tsv @@ q
ORDER BY ts_rank(search_tsv, q) DESC, id LIMIT 20;   -- finding is fast; ranking every match is the cost`,
  S2Q: `CREATE FUNCTION category_renamed() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE product SET category_id = category_id   -- "touch" the rows ⇒ product_search_doc runs again
  WHERE category_id IN (SELECT id FROM category WHERE id = NEW.id OR parent_id = NEW.id);
  RETURN NULL;
END $$;`,
  S2R: `CREATE TRIGGER category_renamed AFTER UPDATE OF name ON category
  FOR EACH ROW WHEN (OLD.name IS DISTINCT FROM NEW.name) EXECUTE FUNCTION category_renamed();`,
  S2S: `UPDATE category SET name = 'Giáo trình CNTT' WHERE name = 'Giáo trình IT';`,
  S2T: `SELECT count(*) AS found_by_cntt FROM product WHERE search_tsv @@ websearch_to_tsquery('vn_unaccent', 'cntt');   -- 7506 = 6 products + 7.500 listings`,
  S2U: `EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF) UPDATE product SET stock = stock - 1 WHERE sku = 'CT0501';`,
  S2V: `EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF) UPDATE product SET name = name || ' ' WHERE sku = 'CT0501';`,
  S3A: `SELECT count(*) AS fts_matches FROM product WHERE search_tsv @@ websearch_to_tsquery('vn_unaccent', 'casoi fx 580');   -- 0: a typo is a different lexeme`,
  S3B: `ALTER TABLE product ADD COLUMN name_fold text GENERATED ALWAYS AS (lower(f_unaccent(name))) STORED;`,
  S3C: `SELECT sku, name, name_fold FROM product WHERE sku IN ('CT1001', 'MP000003') ORDER BY sku;`,
  S3D: `SELECT sku, name_fold,
       round(similarity('casoi fx 580', name_fold)::numeric, 3)             AS similarity,
       round(word_similarity('casoi fx 580', name_fold)::numeric, 3)        AS word_similarity,
       round(strict_word_similarity('casoi fx 580', name_fold)::numeric, 3) AS strict_word_similarity
FROM product WHERE sku IN ('CT1001', 'CT1002', 'CT1004') ORDER BY sku;`,
  S3E: `SELECT current_setting('pg_trgm.similarity_threshold') AS similarity_threshold,
       current_setting('pg_trgm.word_similarity_threshold') AS word_similarity_threshold;`,
  S3F: `SELECT count(*) FILTER (WHERE 'casoi fx 580' % name_fold)  AS by_similarity,
       count(*) FILTER (WHERE 'casoi fx 580' <% name_fold) AS by_word_similarity
FROM product;   -- 1 and 0: the defaults (0,3 and 0,6) are too strict for this typo`,
  S3G: `SET pg_trgm.word_similarity_threshold = 0.5;`,
  S3H: `SELECT count(*) FILTER (WHERE 'casoi fx 580' <% name_fold) AS by_word_similarity_05 FROM product;   -- 1251: the FX-580 and its listings`,
  S3I: `EXPLAIN (ANALYZE, BUFFERS) SELECT count(*) FROM product WHERE name_fold LIKE '%mildliner%';`,
  S3J: `CREATE INDEX product_name_trgm ON product USING GIN (name_fold gin_trgm_ops);`,
  S3K: `EXPLAIN (ANALYZE, BUFFERS) SELECT count(*) FROM product WHERE name_fold LIKE '%mildliner%';`,
  S3L: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name FROM product
WHERE is_active AND 'casoi fx 580' <% name_fold
ORDER BY word_similarity('casoi fx 580', name_fold) DESC, id LIMIT 20;`,
  S3M: `CREATE INDEX product_name_gist ON product USING GIST (name_fold gist_trgm_ops);`,
  S3N: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name FROM product WHERE is_active
ORDER BY 'thien long tl' <<-> name_fold LIMIT 8;`,
  S3O: `SELECT sku, name, round(('thien long tl' <<-> name_fold)::numeric, 3) AS distance
FROM product WHERE is_active
ORDER BY 'thien long tl' <<-> name_fold, id LIMIT 8;`,
  S3P: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name FROM product WHERE is_active
ORDER BY name_fold <<-> 'thien long tl' LIMIT 8;`,
  S3Q: `RESET pg_trgm.word_similarity_threshold;`,
  S3R: `SELECT indexrelname AS index, pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes WHERE relname = 'product'
ORDER BY pg_relation_size(indexrelid) DESC;`,
  S4A: `CREATE FUNCTION search_products(q text, lim int DEFAULT 20)
RETURNS TABLE (id bigint, sku text, name text, how text, score real)
LANGUAGE plpgsql STABLE
SET pg_trgm.word_similarity_threshold = 0.5   -- this function's own threshold, whatever the session says
SET search_path = shop, public   -- the app connects with search_path = shop: pin where <% and word_similarity live
AS $$
BEGIN
  RETURN QUERY
    SELECT p.id, p.sku, p.name, 'fts', ts_rank(p.search_tsv, tq)
    FROM product p, websearch_to_tsquery('vn_unaccent', q) AS tq
    WHERE p.is_active AND p.search_tsv @@ tq
    ORDER BY 5 DESC, p.id
    LIMIT lim;
  IF FOUND THEN RETURN; END IF;   -- full-text found something: done
  RETURN QUERY
    SELECT p.id, p.sku, p.name, 'fuzzy', word_similarity(lower(f_unaccent(q)), p.name_fold)
    FROM product p
    WHERE p.is_active AND lower(f_unaccent(q)) <% p.name_fold
    ORDER BY 5 DESC, p.id
    LIMIT lim;
END $$;`,
  S4B: `SELECT * FROM search_products('but bi thien long', 3);`,
  S4C: `SELECT * FROM search_products('giáo trình', 3);`,
  S4D: `SELECT * FROM search_products('casoi fx 580', 3);`,
  S4E: `SELECT * FROM search_products('thien lomg', 3);`,
  S4F: `SELECT * FROM search_products('xyz qwerty', 3);`,
  S4G: `SELECT count(*) FROM search_products('but bi thien long');`,
  S4H: `SELECT count(*) FROM search_products('casoi fx 580');`,
  S4I: `SELECT count(*) FROM search_products('mildliner');`,
  S4J: `EXPLAIN (ANALYZE, COSTS OFF) SELECT * FROM search_products('casoi fx 580');`,
  SC1: `SELECT conname FROM pg_constraint WHERE conrelid = 'product'::regclass AND contype = 'c' ORDER BY conname;`,
  SC2: `SELECT x AS typed, count(r.id) AS results, min(r.how) AS how
FROM unnest(ARRAY['but bi thien long', 'giao trinh cntt', 'casoi fx 580', 'thien lomg', 'so tay -moleskine']) AS x
LEFT JOIN LATERAL search_products(x, 100000) AS r ON true
GROUP BY x ORDER BY x;   -- 2252 fts · 1001 fuzzy · 6756 fts · 7757 fts · 7507 fuzzy`,
  SC3: `SELECT count(*) AS products, count(search_tsv) AS with_search_doc, count(name_fold) AS with_name_fold FROM product;`,
  SC4: `DROP TABLE spec_feed;   -- the staging table has done its job`,
};
/* Q:END */

/* Output THẬT (PostgreSQL 17.11) — sinh từ lab7-solution.sql chạy bằng psql -f. */
/* O:BEGIN */
const O = {
  EXT1: `CREATE EXTENSION`,
  EXT2: `CREATE EXTENSION`,
  J1A: `    key    | json_type | docs 
-----------+-----------+------
 colour    | string    |    1
 cover     | string    |    1
 desc      | string    |   48
 digits    | number    |    1
 exam_ok   | boolean   |    6
 format    | string    |    7
 functions | number    |    5
 gsm       | number    |    5
 gsm       | null      |    1
 hardness  | string    |    4
 ink       | string    |    6
 length_cm | number    |    4
 material  | string    |    6
 pack      | number    |   21
 pages     | number    |   16
 pages     | string    |    2
 refill    | boolean   |    3
 ruling    | string    |    8
 size      | string    |    5
 solar     | boolean   |    5
 solar     | string    |    1
 tip       | string    |    6
 tip_mm    | number    |    7
 tip_mm    | string    |    1
 year      | number    |    7
(25 rows)`,
  J1B: `  key   |   json_types    | docs 
--------+-----------------+------
 gsm    | null, number    |    6
 pages  | number, string  |   18
 solar  | boolean, string |    6
 tip_mm | number, string  |    8
(4 rows)`,
  J1C: ` line |  sku   |  key   |   value    | json_type 
------+--------+--------+------------+-----------
    3 | CT0503 | tip_mm | "0.7"      | string
   20 | CT0802 | pages  | "96 trang" | string
   21 | CT0803 | gsm    | null       | null
   22 | CT0804 | pages  | "200"      | string
   32 | CT1003 | solar  | "có"       | string
(5 rows)`,
  J1D: ` line |  sku   |            description            
------+--------+-----------------------------------
   48 | CT1207 | PostgreSQL từ số 0 tới production
(1 row)`,
  J1E: `  sku   |            name             
--------+-----------------------------
 CT0906 | Sổ tay Moleskine Classic A5
(1 row)`,
  J1F: ` id |     category     |             spec_keys             
----+------------------+-----------------------------------
  5 | Bút bi           | ink, pack, refill, tip_mm
  6 | Bút chì & tẩy    | hardness, pack, refill, tip_mm
  7 | Bút dạ quang     | pack, tip
  8 | Vở ô ly          | colour, gsm, pack, pages, ruling
  9 | Sổ tay           | cover, pages, ruling, size
 10 | Máy tính cầm tay | digits, exam_ok, functions, solar
 11 | Thước & compa    | length_cm, material, pack
 12 | Giáo trình IT    | format, pages, year
(8 rows)`,
  J2A: `UPDATE 47`,
  J2B: `  sku   |                                                              attrs                                                              
--------+---------------------------------------------------------------------------------------------------------------------------------
 CT1201 | {"desc": "Mô hình quan hệ, SQL, chuẩn hoá, giao dịch, kèm bài tập có lời giải", "year": 2025, "pages": 320, "format": "bản in"}
(1 row)`,
  J2C: ` without_parentheses |          with_parentheses           
---------------------+-------------------------------------
 {"pages": 320}      | {"brand": "CT Books", "pages": 320}
(1 row)`,
  J2D: `UPDATE 47`,
  J2E: `  sku   |                                                                                            attrs                                                                                            
--------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 CT1201 | {"desc": "Mô hình quan hệ, SQL, chuẩn hoá, giao dịch, kèm bài tập có lời giải", "tags": ["học sinh"], "year": 2025, "brand": "CT Books", "color": "vàng", "pages": 320, "format": "bản in"}
(1 row)`,
  J2F: `ALTER TABLE`,
  J2G: `psql:/tmp/lab7-solution.sql:72: ERROR:  check constraint "product_attrs_types" of relation "product" is violated by some row`,
  J2H: `  sku   |  key   |   value    | json_type 
--------+--------+------------+-----------
 CT0503 | tip_mm | "0.7"      | string
 CT0802 | pages  | "96 trang" | string
 CT0803 | gsm    | null       | null
 CT0804 | pages  | "200"      | string
 CT1003 | solar  | "có"       | string
(5 rows)`,
  J2I: `  sku   | pages 
--------+-------
 CT0802 | 96
 CT0804 | 200
(2 rows)

UPDATE 2`,
  J2J: `  sku   | tip_mm 
--------+--------
 CT0503 | 0.7
(1 row)

UPDATE 1`,
  J2K: `  sku   | solar 
--------+-------
 CT1003 | true
(1 row)

UPDATE 1`,
  J2L: `  sku   | gsm_json | text_is_null | has_key 
--------+----------+--------------+---------
 CT0801 | 70       | f            | t
 CT0803 | null     | t            | t
 CT0901 |          | t            | f
(3 rows)`,
  J2M: `  sku   | has_gsm 
--------+---------
 CT0803 | f
(1 row)

UPDATE 1`,
  J2N: `  sku   | color  | still_has_colour 
--------+--------+------------------
 CT0806 | "xanh" | f
(1 row)

UPDATE 1`,
  J2O: `ALTER TABLE`,
  J2P: `psql:/tmp/lab7-solution.sql:109: ERROR:  new row for relation "product" violates check constraint "product_attrs_types"
DETAIL:  Failing row contains (43, CT1201, Giáo trình Cơ sở dữ liệu (bản in), 12, 89000.00, 137, {"desc": "Mô hình quan hệ, SQL, chuẩn hoá, giao dịch, k..., t, 2025-01-02 08:00:00+07).`,
  J2Q: `psql:/tmp/lab7-solution.sql:110: ERROR:  new row for relation "product" violates check constraint "product_attrs_object"
DETAIL:  Failing row contains (1, CT0501, Bút bi Thiên Long TL-027 (xanh), 5, 5000.00, 198, [], t, 2025-01-02 08:00:00+07).`,
  J2S: `  sku   |          tags           
--------+-------------------------
 CT0601 | ["sinh viên", "ôn thi"]
 CT0603 | ["văn phòng", "ôn thi"]
 CT0605 | ["học sinh", "ôn thi"]
 CT1001 | ["học sinh", "ôn thi"]
 CT1002 | ["văn phòng", "ôn thi"]
 CT1004 | ["học sinh", "ôn thi"]
 CT1003 | ["văn phòng", "ôn thi"]
(7 rows)

UPDATE 7`,
  J2U: `psql:/tmp/lab7-solution.sql:117: ERROR:  null value in column "attrs" of relation "product" violates not-null constraint
DETAIL:  Failing row contains (1, CT0501, Bút bi Thiên Long TL-027 (xanh), 5, 5000.00, 198, null, t, 2025-01-02 08:00:00+07).`,
  J2V: ` jsonb_set |               lax_json_null               |     lax_delete_key      
-----------+-------------------------------------------+-------------------------
           | {"brand": "Thiên Long", "discount": null} | {"brand": "Thiên Long"}
(1 row)`,
  J2W: ` products | with_specs | colour_left 
----------+------------+-------------
       48 |         47 |           0
(1 row)`,
  J3A: `INSERT 0 60000
Time: 702.188 ms`,
  J3B: `ANALYZE`,
  J3C: ` listings | active | table_size 
----------+--------+------------
    60048 |  54048 | 20 MB
(1 row)`,
  J3D: `   sku    |                 name                  | color 
----------+---------------------------------------+-------
 MP000001 | But bi Thien Long TL-079 (hop 20 cay) | đen
 MP000002 | Bút bi Pentel BK77 0.7mm chính hãng   | đỏ
 MP000003 | BÚT GEL UNI-BALL SIGNO 0.5MM          | tím
 MP000004 | Bút gel Zebra Sarasa Clip 0.5mm       | vàng
(4 rows)`,
  J3E: `                                                          QUERY PLAN                                                           
-------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=3448.93..3448.99 rows=24 width=49) (actual time=9.230..9.234 rows=24 loops=1)
   Buffers: shared hit=2546
   ->  Sort  (cost=3448.93..3449.12 rows=79 width=49) (actual time=9.229..9.231 rows=24 loops=1)
         Sort Key: price
         Sort Method: top-N heapsort  Memory: 27kB
         Buffers: shared hit=2546
         ->  Seq Scan on product  (cost=0.00..3446.72 rows=79 width=49) (actual time=0.018..9.139 rows=500 loops=1)
               Filter: (is_active AND (attrs @> '{"ink": "gel", "color": "tím", "tip_mm": 0.5}'::jsonb) AND (category_id = 5))
               Rows Removed by Filter: 59548
               Buffers: shared hit=2546
 Planning:
   Buffers: shared hit=19
 Planning Time: 0.086 ms
 Execution Time: 9.249 ms
(14 rows)`,
  J3G: `CREATE INDEX
Time: 64.431 ms`,
  J3H: `                                                                QUERY PLAN                                                                 
-------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=1621.73..1621.79 rows=24 width=49) (actual time=1.050..1.053 rows=24 loops=1)
   Buffers: shared hit=516
   ->  Sort  (cost=1621.73..1621.92 rows=79 width=49) (actual time=1.048..1.050 rows=24 loops=1)
         Sort Key: price
         Sort Method: top-N heapsort  Memory: 27kB
         Buffers: shared hit=516
         ->  Bitmap Heap Scan on product  (cost=37.83..1619.52 rows=79 width=49) (actual time=0.280..0.963 rows=500 loops=1)
               Recheck Cond: (attrs @> '{"ink": "gel", "color": "tím", "tip_mm": 0.5}'::jsonb)
               Filter: (is_active AND (category_id = 5))
               Heap Blocks: exact=500
               Buffers: shared hit=516
               ->  Bitmap Index Scan on product_attrs_gin  (cost=0.00..37.81 rows=712 width=0) (actual time=0.235..0.235 rows=500 loops=1)
                     Index Cond: (attrs @> '{"ink": "gel", "color": "tím", "tip_mm": 0.5}'::jsonb)
                     Buffers: shared hit=16
 Planning:
   Buffers: shared hit=23
 Planning Time: 0.173 ms
 Execution Time: 1.068 ms
(18 rows)`,
  J3I: ` gin_index | heap  
-----------+-------
 1048 kB   | 20 MB
(1 row)`,
  J3J: ` ink_gel | tip_05 | color_tim 
---------+--------+-----------
    2502 |   7506 |     12005
(1 row)`,
  J3K: `                                                                 QUERY PLAN                                                                  
---------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=2692.36..2692.42 rows=24 width=49) (actual time=2.213..2.216 rows=24 loops=1)
   Buffers: shared hit=1302
   ->  Sort  (cost=2692.36..2693.03 rows=269 width=49) (actual time=2.211..2.212 rows=24 loops=1)
         Sort Key: price
         Sort Method: top-N heapsort  Memory: 27kB
         Buffers: shared hit=1302
         ->  Bitmap Heap Scan on product  (cost=37.73..2684.85 rows=269 width=49) (actual time=0.352..1.911 rows=2252 loops=1)
               Recheck Cond: (attrs @> '{"ink": "gel", "tip_mm": 0.5}'::jsonb)
               Filter: (is_active AND (category_id = 5))
               Rows Removed by Filter: 250
               Heap Blocks: exact=1292
               Buffers: shared hit=1302
               ->  Bitmap Index Scan on product_attrs_gin  (cost=0.00..37.66 rows=2416 width=0) (actual time=0.249..0.249 rows=2502 loops=1)
                     Index Cond: (attrs @> '{"ink": "gel", "tip_mm": 0.5}'::jsonb)
                     Buffers: shared hit=10
 Planning:
   Buffers: shared hit=1
 Planning Time: 0.126 ms
 Execution Time: 2.229 ms
(19 rows)`,
  J3L: ` has_key_refill | refill_true 
----------------+-------------
           3753 |        2502
(1 row)`,
  J3M: `                QUERY PLAN                
------------------------------------------
 Aggregate
   ->  Seq Scan on product
         Filter: (attrs ? 'refill'::text)
(3 rows)`,
  J3N: `                           QUERY PLAN                           
----------------------------------------------------------------
 Aggregate
   ->  Bitmap Heap Scan on product
         Recheck Cond: (attrs @> '{"refill": true}'::jsonb)
         ->  Bitmap Index Scan on product_attrs_gin
               Index Cond: (attrs @> '{"refill": true}'::jsonb)
(5 rows)`,
  J3O: `  sku   | tip_mm | text_equal | json_equal 
--------+--------+------------+------------
 CT0504 | 0.5    | t          | t
 CT0602 | 0.50   | f          | t
(2 rows)`,
  J3P: ` json_equal | text_equal 
------------+------------
       7506 |       6255
(1 row)`,
  J3Q: `  sku   | pages | text_gt_100 | int_gt_100 
--------+-------+-------------+------------
 CT0801 | 48    | t           | f
 CT0805 | 96    | t           | f
 CT1203 | 464   | t           | t
(3 rows)`,
  J3R: `CREATE INDEX`,
  J3S: `                                                              QUERY PLAN                                                               
---------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=875.34..875.40 rows=24 width=49) (actual time=1.566..1.570 rows=24 loops=1)
   Buffers: shared hit=1251 read=3
   ->  Sort  (cost=875.34..876.02 rows=270 width=49) (actual time=1.565..1.566 rows=24 loops=1)
         Sort Key: price
         Sort Method: top-N heapsort  Memory: 30kB
         Buffers: shared hit=1251 read=3
         ->  Bitmap Heap Scan on product  (cost=7.36..867.80 rows=270 width=49) (actual time=0.242..1.423 rows=1001 loops=1)
               Recheck Cond: ((((attrs ->> 'pages'::text))::integer >= 400) AND (((attrs ->> 'pages'::text))::integer <= 500))
               Filter: is_active
               Rows Removed by Filter: 250
               Heap Blocks: exact=1251
               Buffers: shared hit=1251 read=3
               ->  Bitmap Index Scan on product_pages  (cost=0.00..7.29 rows=300 width=0) (actual time=0.139..0.139 rows=1251 loops=1)
                     Index Cond: ((((attrs ->> 'pages'::text))::integer >= 400) AND (((attrs ->> 'pages'::text))::integer <= 500))
                     Buffers: shared read=3
 Planning:
   Buffers: shared hit=21 read=1
 Planning Time: 0.199 ms
 Execution Time: 1.587 ms
(19 rows)`,
  J4V: `CREATE VIEW`,
  J4A: `  sku   |   brand    | pages | tip_mm | solar | exam_ok |    tag    
--------+------------+-------+--------+-------+---------+-----------
 CT0504 | Uni        |       |    0.5 |       |         | văn phòng
 CT0601 | Thiên Long |       |        |       |         | ôn thi
 CT0601 | Thiên Long |       |        |       |         | sinh viên
 CT1001 | Casio      |       |        | t     | t       | học sinh
 CT1001 | Casio      |       |        | t     | t       | ôn thi
 CT1201 | CT Books   |   320 |        |       |         | học sinh
(6 rows)`,
  J4B: ` export_rows | products 
-------------+----------
          55 |       48
(1 row)`,
  J4C: `COPY 55`,
  J4D: ` line |  sku   | raw_pages  | pages | raw_solar | solar 
------+--------+------------+-------+-----------+-------
   19 | CT0801 | 48         |    48 |           | 
   20 | CT0802 | "96 trang" |       |           | 
   22 | CT0804 | "200"      |   200 |           | 
   32 | CT1003 |            |       | "có"      | 
(4 rows)`,
  J4E: `psql:/tmp/lab7-solution.sql:223: ERROR:  invalid input syntax for type integer: "96 trang"`,
  S1A: `                         simple_doc                         | found 
------------------------------------------------------------+-------
 '-027':6 'bi':2 'bút':1 'long':4 'thiên':3 'tl':5 'xanh':7 | f
(1 row)`,
  S1B: `CREATE TEXT SEARCH CONFIGURATION`,
  S1C: `ALTER TEXT SEARCH CONFIGURATION`,
  S1D: `   alias   | token |   dictionaries    | lexemes 
-----------+-------+-------------------+---------
 word      | Bút   | {unaccent,simple} | {But}
 blank     |       | {}                | 
 asciiword | bi    | {simple}          | {bi}
 blank     |       | {}                | 
 word      | Thiên | {unaccent,simple} | {Thien}
 blank     |       | {}                | 
 asciiword | Long  | {simple}          | {long}
 blank     |       | {}                | 
 asciiword | TL    | {simple}          | {tl}
 int       | -027  | {simple}          | {-027}
(10 rows)`,
  S1E: `                           vn_doc                           | same_doc 
------------------------------------------------------------+----------
 '-027':6 'bi':2 'but':1 'long':4 'thien':3 'tl':5 'xanh':7 | t
(1 row)`,
  S1F: ` words_sinh_hoc | phrase_sinh_hoc | phrase_hoc_sinh | ban_finds_desk | ban_finds_edition 
----------------+-----------------+-----------------+----------------+-------------------
 t              | f               | t               | t              | t
(1 row)`,
  S1G: `psql:/tmp/lab7-solution.sql:241: ERROR:  generation expression is not immutable`,
  S1H: ` provolatile 
-------------
 s
(1 row)`,
  S1I: `CREATE FUNCTION`,
  S1J: `          folded           
---------------------------
 Vo o ly Hong Ha - Da Nang
(1 row)`,
  S2A: `psql:/tmp/lab7-solution.sql:252: ERROR:  cannot use subquery in column generation expression`,
  S2B: `ALTER TABLE`,
  S2C: `CREATE FUNCTION`,
  S2D: `CREATE TRIGGER`,
  S2F: `UPDATE 60048
Time: 2313.855 ms (00:02.314)`,
  S2G: `CREATE INDEX
Time: 170.221 ms`,
  S2I: `ANALYZE`,
  S2J: `  sku   |               name               |                                                                                                      search_tsv                                                                                                       
--------+----------------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 CT1203 | Sách Clean Code (bản tiếng Việt) | 'ban':4A 'clean':2A 'code':3A 'dat':18C 'giao':10B 'ham':20C 'it':12B 'kiem':22C 'lieu':9B 'ma':16C 'ngan':21C 'nxb':13C 'sach':1A,7B,17C 'tai':8B 'ten':19C 'thu':23C 'tieng':5A 'tre':14C 'trinh':11B 'viet':6A,15C
(1 row)`,
  S2K: ` matches | active 
---------+--------
    2502 |   2252
(1 row)`,
  S2L: `   sku    |                     name                      |  rank  
----------+-----------------------------------------------+--------
 CT0501   | [Bút] [bi] [Thiên] [Long] TL-027 (xanh)       | 1.0000
 CT0502   | [Bút] [bi] [Thiên] [Long] TL-079 (hộp 20 cây) | 1.0000
 MP000001 | [But] [bi] [Thien] [Long] TL-079 (hop 20 cay) | 1.0000
 MP000048 | [Bút] [bi] [Thiên] [Long] TL-027 (xanh)       | 1.0000
 MP000049 | [But] [bi] [Thien] [Long] TL-079 (hop 20 cay) | 1.0000
(5 rows)`,
  S2M: `  sku   |               name                |  rank  
--------+-----------------------------------+--------
 CT1202 | Giáo trình Lập trình Java căn bản | 1.0000
 CT1201 | Giáo trình Cơ sở dữ liệu (bản in) | 0.9968
 CT1203 | Sách Clean Code (bản tiếng Việt)  | 0.3964
 CT1204 | Sổ tay SQL bỏ túi                 | 0.3964
 CT1205 | Cấu trúc dữ liệu & giải thuật     | 0.3964
 CT1206 | Bộ đề luyện thi PE/FE (bản in)    | 0.3964
(6 rows)`,
  S2N: `  sku   |              name              |                                     snippet                                     
--------+--------------------------------+---------------------------------------------------------------------------------
 CT1001 | Máy tính Casio FX-580VN X      | Máy tính khoa học được [mang] [vào] [phòng] [thi], giải phương trình, tích phân
 CT1002 | Máy tính Casio FX-570VN Plus   | tính khoa học quen thuộc của học sinh cấp ba, được [mang] [vào] [phòng] [thi]
 CT1003 | Máy tính Vinacal 570ES Plus II | Máy tính khoa học giá tốt, được [mang] [vào] [phòng] [thi]
 CT1006 | Máy tính Deli D82TL            | Máy tính khoa học dùng pin, không [mang] [vào] [phòng] [thi]
(4 rows)`,
  S2O: `       typed       |           tsquery           | own_products 
-------------------+-----------------------------+--------------
 so tay            | 'so' & 'tay'                |            8
 so tay -moleskine | 'so' & 'tay' & !'moleskine' |            7
 "bullet journal"  | 'bullet' <-> 'journal'      |            2
 casio or vinacal  | 'casio' | 'vinacal'         |            5
(4 rows)`,
  S2P: `                                                                 QUERY PLAN                                                                 
--------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=276.97..277.02 rows=20 width=47) (actual time=3.558..3.561 rows=20 loops=1)
   Buffers: shared hit=1284
   ->  Sort  (cost=276.97..277.10 rows=54 width=47) (actual time=3.556..3.558 rows=20 loops=1)
         Sort Key: (ts_rank(product.search_tsv, '''but'' & ''bi'' & ''thien'' & ''long'''::tsquery)) DESC, product.id
         Sort Method: top-N heapsort  Memory: 27kB
         Buffers: shared hit=1284
         ->  Bitmap Heap Scan on product  (cost=51.51..275.53 rows=54 width=47) (actual time=0.921..3.291 rows=2252 loops=1)
               Recheck Cond: (search_tsv @@ '''but'' & ''bi'' & ''thien'' & ''long'''::tsquery)
               Filter: is_active
               Rows Removed by Filter: 250
               Heap Blocks: exact=1256
               Buffers: shared hit=1284
               ->  Bitmap Index Scan on product_search_gin  (cost=0.00..51.49 rows=60 width=0) (actual time=0.818..0.818 rows=2502 loops=1)
                     Index Cond: (search_tsv @@ '''but'' & ''bi'' & ''thien'' & ''long'''::tsquery)
                     Buffers: shared hit=28
 Planning:
   Buffers: shared hit=1
 Planning Time: 0.106 ms
 Execution Time: 3.576 ms
(19 rows)`,
  S2Q: `CREATE FUNCTION`,
  S2R: `CREATE TRIGGER`,
  S2S: `UPDATE 1
Time: 352.201 ms`,
  S2T: ` found_by_cntt 
---------------
          7506
(1 row)`,
  S2U: `                                QUERY PLAN                                 
---------------------------------------------------------------------------
 Update on product (actual rows=0 loops=1)
   ->  Index Scan using product_sku_key on product (actual rows=1 loops=1)
         Index Cond: (sku = 'CT0501'::text)
(3 rows)`,
  S2V: `                                QUERY PLAN                                 
---------------------------------------------------------------------------
 Update on product (actual rows=0 loops=1)
   ->  Index Scan using product_sku_key on product (actual rows=1 loops=1)
         Index Cond: (sku = 'CT0501'::text)
 Trigger for constraint product_category_id_fkey: calls=1
 Trigger product_search_doc: calls=1
(5 rows)`,
  S3A: ` fts_matches 
-------------
           0
(1 row)`,
  S3B: `ALTER TABLE
Time: 645.601 ms`,
  S3C: `   sku    |             name             |          name_fold           
----------+------------------------------+------------------------------
 CT1001   | Máy tính Casio FX-580VN X    | may tinh casio fx-580vn x
 MP000003 | BÚT GEL UNI-BALL SIGNO 0.5MM | but gel uni-ball signo 0.5mm
(2 rows)`,
  S3D: `  sku   |          name_fold           | similarity | word_similarity | strict_word_similarity 
--------+------------------------------+------------+-----------------+------------------------
 CT1001 | may tinh casio fx-580vn x    |      0.300 |           0.563 |                  0.474
 CT1002 | may tinh casio fx-570vn plus |      0.200 |           0.438 |                  0.375
 CT1004 | may tinh casio fx-880btg     |      0.188 |           0.375 |                  0.375
(3 rows)`,
  S3E: ` similarity_threshold | word_similarity_threshold 
----------------------+---------------------------
 0.3                  | 0.6
(1 row)`,
  S3F: ` by_similarity | by_word_similarity 
---------------+--------------------
             1 |                  0
(1 row)`,
  S3G: `SET`,
  S3H: ` by_word_similarity_05 
-----------------------
                  1251
(1 row)`,
  S3I: `                                                  QUERY PLAN                                                  
--------------------------------------------------------------------------------------------------------------
 Aggregate  (cost=5358.62..5358.63 rows=1 width=8) (actual time=13.274..13.275 rows=1 loops=1)
   Buffers: shared hit=1674 read=2934
   ->  Seq Scan on product  (cost=0.00..5358.60 rows=6 width=0) (actual time=0.030..13.216 rows=1251 loops=1)
         Filter: (name_fold ~~ '%mildliner%'::text)
         Rows Removed by Filter: 58797
         Buffers: shared hit=1674 read=2934
 Planning Time: 0.070 ms
 Execution Time: 13.293 ms
(8 rows)`,
  S3J: `CREATE INDEX
Time: 317.902 ms`,
  S3K: `                                                             QUERY PLAN                                                             
------------------------------------------------------------------------------------------------------------------------------------
 Aggregate  (cost=113.05..113.06 rows=1 width=8) (actual time=4.063..4.064 rows=1 loops=1)
   Buffers: shared hit=348 read=919
   ->  Bitmap Heap Scan on product  (cost=89.61..113.04 rows=6 width=0) (actual time=0.380..4.010 rows=1251 loops=1)
         Recheck Cond: (name_fold ~~ '%mildliner%'::text)
         Heap Blocks: exact=1251
         Buffers: shared hit=348 read=919
         ->  Bitmap Index Scan on product_name_trgm  (cost=0.00..89.61 rows=6 width=0) (actual time=0.272..0.272 rows=1251 loops=1)
               Index Cond: (name_fold ~~ '%mildliner%'::text)
               Buffers: shared hit=16
 Planning:
   Buffers: shared hit=25 dirtied=1
 Planning Time: 0.128 ms
 Execution Time: 4.084 ms
(13 rows)`,
  S3L: `                                                                 QUERY PLAN                                                                  
---------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=1856.81..1856.86 rows=20 width=47) (actual time=20.540..20.544 rows=20 loops=1)
   Buffers: shared hit=404 read=944
   ->  Sort  (cost=1856.81..1858.16 rows=541 width=47) (actual time=20.538..20.540 rows=20 loops=1)
         Sort Key: (word_similarity('casoi fx 580'::text, name_fold)) DESC, id
         Sort Method: top-N heapsort  Memory: 27kB
         Buffers: shared hit=404 read=944
         ->  Bitmap Heap Scan on product  (cost=169.51..1842.41 rows=541 width=47) (actual time=1.164..20.404 rows=1001 loops=1)
               Filter: (is_active AND ('casoi fx 580'::text <% name_fold))
               Rows Removed by Filter: 1501
               Heap Blocks: exact=1293
               Buffers: shared hit=404 read=944
               ->  Bitmap Index Scan on product_name_trgm  (cost=0.00..169.37 rows=600 width=0) (actual time=1.013..1.013 rows=2502 loops=1)
                     Index Cond: (name_fold %> 'casoi fx 580'::text)
                     Buffers: shared hit=55
 Planning:
   Buffers: shared hit=9
 Planning Time: 0.097 ms
 Execution Time: 20.596 ms
(18 rows)`,
  S3M: `CREATE INDEX
Time: 680.126 ms`,
  S3N: `                                                                QUERY PLAN                                                                
------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=0.28..4.02 rows=8 width=47) (actual time=0.180..0.287 rows=8 loops=1)
   Buffers: shared hit=9 read=9
   ->  Index Scan using product_name_gist on product  (cost=0.28..25294.27 rows=54061 width=47) (actual time=0.178..0.285 rows=8 loops=1)
         Order By: (name_fold <->> 'thien long tl'::text)
         Filter: is_active
         Rows Removed by Filter: 1
         Buffers: shared hit=9 read=9
 Planning:
   Buffers: shared hit=29
 Planning Time: 0.140 ms
 Execution Time: 0.330 ms
(11 rows)`,
  S3O: `   sku    |                 name                  | distance 
----------+---------------------------------------+----------
 CT0501   | Bút bi Thiên Long TL-027 (xanh)       |    0.000
 CT0502   | Bút bi Thiên Long TL-079 (hộp 20 cây) |    0.000
 MP000001 | But bi Thien Long TL-079 (hop 20 cay) |    0.000
 MP000048 | Bút bi Thiên Long TL-027 (xanh)       |    0.000
 MP000049 | But bi Thien Long TL-079 (hop 20 cay) |    0.000
 MP000096 | Bút bi Thiên Long TL-027 (xanh)       |    0.000
 MP000097 | But bi Thien Long TL-079 (hop 20 cay) |    0.000
 MP000144 | Bút bi Thiên Long TL-027 (xanh)       |    0.000
(8 rows)`,
  S3P: `                                                        QUERY PLAN                                                         
---------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=6424.85..6424.87 rows=8 width=47) (actual time=271.231..271.233 rows=8 loops=1)
   Buffers: shared hit=4516 read=92
   ->  Sort  (cost=6424.85..6560.01 rows=54061 width=47) (actual time=271.229..271.230 rows=8 loops=1)
         Sort Key: ((name_fold <<-> 'thien long tl'::text))
         Sort Method: top-N heapsort  Memory: 25kB
         Buffers: shared hit=4516 read=92
         ->  Seq Scan on product  (cost=0.00..5343.63 rows=54061 width=47) (actual time=0.017..265.415 rows=54048 loops=1)
               Filter: is_active
               Rows Removed by Filter: 6000
               Buffers: shared hit=4516 read=92
 Planning:
   Buffers: shared hit=2
 Planning Time: 0.086 ms
 Execution Time: 271.248 ms
(14 rows)`,
  S3Q: `RESET`,
  S3R: `       index        |  size   
--------------------+---------
 product_name_gist  | 11 MB
 product_name_trgm  | 4232 kB
 product_search_gin | 2640 kB
 product_sku_key    | 1880 kB
 product_pkey       | 1336 kB
 product_attrs_gin  | 1088 kB
 product_pages      | 424 kB
(7 rows)`,
  S4A: `CREATE FUNCTION`,
  S4B: ` id |   sku    |                 name                  | how | score 
----+----------+---------------------------------------+-----+-------
  1 | CT0501   | Bút bi Thiên Long TL-027 (xanh)       | fts |     1
  2 | CT0502   | Bút bi Thiên Long TL-079 (hộp 20 cây) | fts |     1
 49 | MP000001 | But bi Thien Long TL-079 (hop 20 cay) | fts |     1
(3 rows)`,
  S4C: ` id  |   sku    |               name                | how |   score   
-----+----------+-----------------------------------+-----+-----------
  44 | CT1202   | Giáo trình Lập trình Java căn bản | fts | 0.9999701
  91 | MP000043 | GIÁO TRÌNH LẬP TRÌNH JAVA CĂN BẢN | fts | 0.9999701
 139 | MP000091 | GIÁO TRÌNH LẬP TRÌNH JAVA CĂN BẢN | fts | 0.9999701
(3 rows)`,
  S4D: ` id  |   sku    |                 name                 |  how  | score  
-----+----------+--------------------------------------+-------+--------
  31 | CT1001   | Máy tính Casio FX-580VN X            | fuzzy | 0.5625
 126 | MP000078 | Máy tính Casio FX-580VN X chính hãng | fuzzy | 0.5625
 174 | MP000126 | Máy tính Casio FX-580VN X chính hãng | fuzzy | 0.5625
(3 rows)`,
  S4E: ` id |  sku   |                 name                  |  how  |   score    
----+--------+---------------------------------------+-------+------------
  1 | CT0501 | Bút bi Thiên Long TL-027 (xanh)       | fuzzy | 0.72727275
  2 | CT0502 | Bút bi Thiên Long TL-079 (hộp 20 cây) | fuzzy | 0.72727275
  7 | CT0601 | Bút chì gỗ Thiên Long 2B GP-01        | fuzzy | 0.72727275
(3 rows)`,
  S4F: ` id | sku | name | how | score 
----+-----+------+-----+-------
(0 rows)`,
  S4G: ` count 
-------
    20
(1 row)

Time: 3.677 ms`,
  S4H: ` count 
-------
    20
(1 row)

Time: 18.308 ms`,
  S4I: ` count 
-------
    20
(1 row)

Time: 1.684 ms`,
  S4J: `                                  QUERY PLAN                                   
-------------------------------------------------------------------------------
 Function Scan on search_products (actual time=18.417..18.419 rows=20 loops=1)
 Planning Time: 0.019 ms
 Execution Time: 18.427 ms
(3 rows)`,
  SC1: `       conname        
----------------------
 product_attrs_object
 product_attrs_types
 product_price_check
 product_stock_check
(4 rows)`,
  SC2: `       typed       | results |  how  
-------------------+---------+-------
 but bi thien long |    2252 | fts
 casoi fx 580      |    1001 | fuzzy
 giao trinh cntt   |    6756 | fts
 so tay -moleskine |    7757 | fts
 thien lomg        |    7507 | fuzzy
(5 rows)`,
  SC3: ` products | with_search_doc | with_name_fold 
----------+-----------------+----------------
    60048 |           60048 |          60048
(1 row)`,
  SC4: `DROP TABLE`,
};
/* O:END */

/* Số lấy từ output thật (đổi mỗi lần chạy) — KHÔNG gõ tay thời gian. */
const lay = (k, re) => { const m = O[k].match(re); if (!m) throw new Error(`lab-7: không thấy ${re} trong O.${k}`); return m[1]; };
const vn = (x, le = 0) => { const [a, b] = Number(x).toFixed(le).split('.'); return a.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (b ? ',' + b : ''); };
const ms = (k, le = 1) => vn(lay(k, /Execution Time: ([\d.]+) ms/), le);
const tg = (k, le = 1) => vn(Number(lay(k, /Time: ([\d.]+) ms/)) / 1000, le);   // \timing ⇒ giây
const trang = (k) => { const l = O[k].split('\n').find((x) => /^\s+Buffers:/.test(x)); return vn(Number((l.match(/hit=(\d+)/) || [0, 0])[1]) + Number((l.match(/read=(\d+)/) || [0, 0])[1])); };
const idxMs = (k, le = 2) => vn(lay(k, /Bitmap Index Scan[^\n]*actual time=[\d.]+\.\.([\d.]+)/), le);

/* SOL:BEGIN */
const SOL = `-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop · Lab 7 — SOLUTION: product attributes in JSONB + a search box that forgives
-- Lab 7 — ĐÁP ÁN: thuộc tính sản phẩm JSONB + ô tìm kiếm gõ không dấu / gõ sai vẫn ra
-- cuongthai.com/courses/postgresql · PostgreSQL 17 · run AFTER lab7-start.sql, in ONE psql session:
--   docker cp lab7-solution.sql pgdemo:/tmp/
--   docker exec -it pgdemo psql -U postgres -d ctshop -f /tmp/lab7-solution.sql
-- Numbers in the comments come from one real run (PostgreSQL 17.11). Times differ per machine; counts do not.
-- ═══════════════════════════════════════════════════════════════════════════
\\pset pager off
SET search_path = shop, public;          -- public: where the two extensions live
SET TimeZone = 'Asia/Ho_Chi_Minh';
SET max_parallel_workers_per_gather = 0;  -- one process per query: shorter plans, fair comparisons
CREATE EXTENSION IF NOT EXISTS unaccent SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pg_trgm  SCHEMA public;

-- ═══ J1 · survey the supplier's feed BEFORE importing anything ═══
-- every key of every "specs" object, with its JSON type and in how many documents it appears
SELECT k AS key, jsonb_typeof(v) AS json_type, count(*) AS docs
FROM spec_feed, jsonb_each(doc->'specs') AS e(k, v)
GROUP BY k, jsonb_typeof(v)
ORDER BY k, docs DESC;   -- 25 rows: 20 keys; desc is in all 48 documents
-- keys that arrive with more than one type = trouble for every filter and every cast
SELECT k AS key, string_agg(DISTINCT jsonb_typeof(v), ', ') AS json_types, count(*) AS docs
FROM spec_feed, jsonb_each(doc->'specs') AS e(k, v)
GROUP BY k
HAVING count(DISTINCT jsonb_typeof(v)) > 1
ORDER BY k;   -- 4 keys: gsm, pages, solar, tip_mm
-- the offending values themselves
SELECT f.line, f.doc->>'sku' AS sku, e.k AS key, e.v AS value, jsonb_typeof(e.v) AS json_type
FROM spec_feed f, jsonb_each(f.doc->'specs') AS e(k, v)
WHERE (e.k IN ('pages', 'tip_mm', 'gsm') AND jsonb_typeof(e.v) <> 'number')
   OR (e.k = 'solar' AND jsonb_typeof(e.v) <> 'boolean')
ORDER BY f.line;   -- 5 values: 4 badly typed strings + 1 JSON null
-- a sku the shop does not sell (yet) …
SELECT f.line, f.doc->>'sku' AS sku, f.doc->'specs'->>'desc' AS description
FROM spec_feed f
WHERE NOT EXISTS (SELECT 1 FROM product p WHERE p.sku = f.doc->>'sku');   -- line 48, CT1207
-- … and a product the supplier sent nothing for
SELECT p.sku, p.name
FROM product p
WHERE NOT EXISTS (SELECT 1 FROM spec_feed f WHERE f.doc->>'sku' = p.sku);   -- CT0906, the Moleskine
-- the facets of each category page = the keys its products carry (desc is text, not a filter)
SELECT c.id, c.name AS category, string_agg(DISTINCT k, ', ' ORDER BY k) AS spec_keys
FROM spec_feed f
JOIN product p ON p.sku = f.doc->>'sku'
JOIN category c ON c.id = p.category_id,
     jsonb_object_keys(f.doc->'specs') AS k
WHERE k <> 'desc'
GROUP BY c.id, c.name
ORDER BY c.id;   -- 8 categories, 8 different filter panels

-- ═══ J2 · merge the specs into product.attrs — and guard the column ═══
-- first attempt, inside a transaction so it can be undone
BEGIN;
UPDATE product p SET attrs = p.attrs || f.doc->'specs'
FROM spec_feed f WHERE f.doc->>'sku' = p.sku;
SELECT sku, attrs FROM product WHERE sku = 'CT1201';   -- brand, color and tags are GONE
ROLLBACK;
-- why: || and -> have the SAME precedence and group left to right ⇒ (p.attrs || f.doc) -> 'specs'
SELECT '{"brand": "CT Books"}'::jsonb || '{"specs": {"pages": 320}}'::jsonb -> 'specs' AS without_parentheses,
       '{"brand": "CT Books"}'::jsonb || ('{"specs": {"pages": 320}}'::jsonb -> 'specs') AS with_parentheses;
UPDATE product p SET attrs = p.attrs || (f.doc->'specs')
FROM spec_feed f WHERE f.doc->>'sku' = p.sku;   -- UPDATE 47
SELECT sku, attrs FROM product WHERE sku = 'CT1201';
-- guard 1: attrs is always a JSON object (IS JSON — SQL/JSON predicate, PostgreSQL 16+)
ALTER TABLE product ADD CONSTRAINT product_attrs_object CHECK (attrs IS JSON OBJECT);
-- guard 2: the keys the filters rely on have the right JSON type (a missing key ⇒ NULL ⇒ the CHECK passes)
ALTER TABLE product ADD CONSTRAINT product_attrs_types CHECK (
      jsonb_typeof(attrs->'pages')   = 'number'  AND jsonb_typeof(attrs->'tip_mm') = 'number'
  AND jsonb_typeof(attrs->'pack')    = 'number'  AND jsonb_typeof(attrs->'gsm')    = 'number'
  AND jsonb_typeof(attrs->'solar')   = 'boolean' AND jsonb_typeof(attrs->'exam_ok') = 'boolean'
  AND jsonb_typeof(attrs->'tags')    = 'array');   -- ERROR: the dirty documents are in the table now
-- which rows break it?
SELECT sku, k AS key, v AS value, jsonb_typeof(v) AS json_type
FROM product, jsonb_each(attrs) AS e(k, v)
WHERE (k IN ('pages', 'tip_mm', 'pack', 'gsm') AND jsonb_typeof(v) <> 'number')
   OR (k IN ('solar', 'exam_ok') AND jsonb_typeof(v) <> 'boolean')
   OR (k = 'tags' AND jsonb_typeof(v) <> 'array')
ORDER BY sku;   -- the same 5 values, now inside product.attrs
-- repair each one with the smallest change: jsonb_set replaces ONE key, the rest of the document stays
UPDATE product
SET attrs = jsonb_set(attrs, '{pages}', to_jsonb(substring(attrs->>'pages' FROM '[0-9]+')::int))
WHERE jsonb_typeof(attrs->'pages') = 'string'
RETURNING sku, attrs->'pages' AS pages;
UPDATE product
SET attrs = jsonb_set(attrs, '{tip_mm}', to_jsonb((attrs->>'tip_mm')::numeric))
WHERE jsonb_typeof(attrs->'tip_mm') = 'string'
RETURNING sku, attrs->'tip_mm' AS tip_mm;
UPDATE product
SET attrs = jsonb_set(attrs, '{solar}', to_jsonb(attrs->>'solar' IN ('có', 'yes', 'true')))
WHERE jsonb_typeof(attrs->'solar') = 'string'
RETURNING sku, attrs->'solar' AS solar;
-- JSON null is not SQL NULL: ->> hides the difference, ? and @> do not
SELECT sku, attrs->'gsm' AS gsm_json, attrs->>'gsm' IS NULL AS text_is_null, attrs ? 'gsm' AS has_key
FROM product WHERE sku IN ('CT0801', 'CT0803', 'CT0901') ORDER BY sku;
UPDATE product SET attrs = jsonb_strip_nulls(attrs)
WHERE attrs @> '{"gsm": null}'
RETURNING sku, attrs ? 'gsm' AS has_gsm;
-- one supplier wrote "colour": move the value to "color" (minus removes a key, || adds one)
UPDATE product SET attrs = (attrs - 'colour') || jsonb_build_object('color', attrs->'colour')
WHERE attrs ? 'colour'
RETURNING sku, attrs->'color' AS color, attrs ? 'colour' AS still_has_colour;
ALTER TABLE product ADD CONSTRAINT product_attrs_types CHECK (
      jsonb_typeof(attrs->'pages')   = 'number'  AND jsonb_typeof(attrs->'tip_mm') = 'number'
  AND jsonb_typeof(attrs->'pack')    = 'number'  AND jsonb_typeof(attrs->'gsm')    = 'number'
  AND jsonb_typeof(attrs->'solar')   = 'boolean' AND jsonb_typeof(attrs->'exam_ok') = 'boolean'
  AND jsonb_typeof(attrs->'tags')    = 'array');   -- now it is accepted
-- from now on a bad document is refused at the door
UPDATE product SET attrs = jsonb_set(attrs, '{pages}', '"300 trang"') WHERE sku = 'CT1201';
UPDATE product SET attrs = '[]' WHERE sku = 'CT0501';
-- marketing adds the tag "ôn thi" (exam prep) to exam-approved calculators and 2B pencils
UPDATE product
SET attrs = jsonb_set(attrs, '{tags}', (attrs->'tags') || '["ôn thi"]')
WHERE attrs @> '{"exam_ok": true}' OR attrs @> '{"hardness": "2B"}'
RETURNING sku, attrs->'tags' AS tags;   -- UPDATE 7: 4 calculators + 3 pencils
-- the NULL trap: jsonb_set is STRICT — a NULL argument makes the WHOLE document NULL
UPDATE product SET attrs = jsonb_set(attrs, '{discount}', to_jsonb(NULL::int)) WHERE sku = 'CT0501';
SELECT jsonb_set('{"brand": "Thiên Long"}', '{discount}', to_jsonb(NULL::int))       AS jsonb_set,
       jsonb_set_lax('{"brand": "Thiên Long"}', '{discount}', NULL)                   AS lax_json_null,
       jsonb_set_lax('{"brand": "Thiên Long", "discount": 10}', '{discount}', NULL,
                     true, 'delete_key')                                              AS lax_delete_key;
SELECT count(*) AS products, count(*) FILTER (WHERE attrs ? 'desc') AS with_specs,
       count(*) FILTER (WHERE attrs ? 'colour') AS colour_left
FROM product;   -- 48 | 47 | 0

-- ═══ J3 · the marketplace opens: 60.000 seller listings — attribute filters that stay fast ═══
\\timing on
INSERT INTO product (sku, name, category_id, price, stock, attrs, is_active, created_at)
SELECT 'MP' || lpad(g::text, 6, '0'),
       CASE g % 4 WHEN 0 THEN b.name                          -- sellers write titles their own way:
                  WHEN 1 THEN unaccent(b.name)                -- without accents,
                  WHEN 2 THEN b.name || ' chính hãng'         -- with a slogan,
                  ELSE upper(b.name) END,                     -- IN CAPITALS
       b.category_id,
       greatest(1000, round(b.price * (0.85 + (g % 31) / 100.0), -3)),
       (g * 7) % 250,
       b.attrs || jsonb_build_object('seller', s.seller, 'color', (ARRAY['xanh', 'đen', 'đỏ', 'tím', 'vàng'])[1 + g % 5]),
       g % 10 <> 0,                                           -- 10 % of the listings are switched off
       timestamptz '2026-09-01 08:00+07' + g * interval '1 minute'
FROM generate_series(1, 60000) AS g
JOIN product b ON b.id = 1 + g % 48
CROSS JOIN LATERAL (SELECT (ARRAY['Nhà sách Bình Minh', 'VPP Ánh Dương', 'Shop Mực Tím', 'Góc Học Tập', 'VPP Sao Mai',
  'Nhà sách Hải Âu', 'Tiệm Bút Xinh', 'VPP Phương Nam', 'Kho Sỉ Học Đường', 'Shop Cô Giáo Thảo'])[1 + (g / 48) % 10] AS seller) AS s;
   -- INSERT 0 60000; every listing inherits the cleaned attrs of its product + seller + colour
\\timing off
ANALYZE product;
SELECT count(*) AS listings, count(*) FILTER (WHERE is_active) AS active,
       pg_size_pretty(pg_table_size('product')) AS table_size
FROM product;   -- 60048 | 54048 | 20 MB
SELECT sku, name, attrs->>'color' AS color FROM product WHERE sku BETWEEN 'MP000001' AND 'MP000004' ORDER BY sku;
-- the category page "Bút bi" with three ticked filters: gel ink · 0.5 mm · purple
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name, price FROM product
WHERE category_id = 5 AND is_active AND attrs @> '{"ink": "gel", "tip_mm": 0.5, "color": "tím"}'
ORDER BY price LIMIT 24;   -- before: Seq Scan, 59.548 rows removed to keep 500
\\timing on
CREATE INDEX product_attrs_gin ON product USING GIN (attrs jsonb_path_ops);
\\timing off
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name, price FROM product
WHERE category_id = 5 AND is_active AND attrs @> '{"ink": "gel", "tip_mm": 0.5, "color": "tím"}'
ORDER BY price LIMIT 24;   -- after: Bitmap Index Scan on product_attrs_gin, 500 heap pages instead of 2.546
SELECT pg_size_pretty(pg_relation_size('product_attrs_gin')) AS gin_index, pg_size_pretty(pg_relation_size('product')) AS heap;
-- the index keeps one list of rows per path = value; the query intersects three of them
SELECT count(*) FILTER (WHERE attrs @> '{"ink": "gel"}')   AS ink_gel,
       count(*) FILTER (WHERE attrs @> '{"tip_mm": 0.5}')  AS tip_05,
       count(*) FILTER (WHERE attrs @> '{"color": "tím"}') AS color_tim
FROM product;   -- 2502 | 7506 | 12005 → all three at once: 500
-- only two filters ticked: 10 times more candidates, on half of the table's pages
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name, price FROM product
WHERE category_id = 5 AND is_active AND attrs @> '{"ink": "gel", "tip_mm": 0.5}'
ORDER BY price LIMIT 24;   -- 2.502 candidates on 1.292 pages: still the index, but half the table
-- trap: "has the key" is not "is true" — and jsonb_path_ops cannot answer ? at all
SELECT count(*) FILTER (WHERE attrs ? 'refill') AS has_key_refill,
       count(*) FILTER (WHERE attrs @> '{"refill": true}') AS refill_true
FROM product;   -- 3753 vs 2502: refill = false also HAS the key
EXPLAIN (COSTS OFF) SELECT count(*) FROM product WHERE attrs ? 'refill';
EXPLAIN (COSTS OFF) SELECT count(*) FROM product WHERE attrs @> '{"refill": true}';
-- trap: ->> returns TEXT. 0.50 is the number 0.5, but the text '0.50' is not the text '0.5'
SELECT sku, attrs->'tip_mm' AS tip_mm, attrs->>'tip_mm' = '0.5' AS text_equal, attrs @> '{"tip_mm": 0.5}' AS json_equal
FROM product WHERE sku IN ('CT0504', 'CT0602') ORDER BY sku;
SELECT count(*) FILTER (WHERE attrs @> '{"tip_mm": 0.5}') AS json_equal,
       count(*) FILTER (WHERE attrs->>'tip_mm' = '0.5') AS text_equal
FROM product;   -- 7506 vs 6255: the text comparison loses CT0602 and its 1.250 listings
-- trap: text compares character by character — '48' > '100' because '4' > '1'
SELECT sku, attrs->>'pages' AS pages,
       attrs->>'pages' > '100' AS text_gt_100, (attrs->>'pages')::int > 100 AS int_gt_100
FROM product WHERE sku IN ('CT0801', 'CT0805', 'CT1203') ORDER BY sku;
-- a range filter needs a B-tree on the expression (GIN only answers containment); the CHECK of J2 makes the cast safe
CREATE INDEX product_pages ON product (((attrs->>'pages')::int));
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name, price FROM product
WHERE (attrs->>'pages')::int BETWEEN 400 AND 500 AND is_active
ORDER BY price LIMIT 24;

-- ═══ J4 · an attribute table for accounting: JSON_TABLE (PostgreSQL 17) ═══
CREATE VIEW product_attr_export AS
SELECT p.sku, p.name, jt.*
FROM product p,
     JSON_TABLE(p.attrs, '$' COLUMNS (
       brand   text    PATH '$.brand',
       color   text    PATH '$.color',
       pages   int     PATH '$.pages',
       tip_mm  numeric PATH '$.tip_mm',
       solar   boolean PATH '$.solar',
       exam_ok boolean PATH '$.exam_ok',
       NESTED PATH '$.tags[*]' COLUMNS (tag text PATH '$')   -- one row per tag
     )) AS jt;
SELECT sku, brand, pages, tip_mm, solar, exam_ok, tag
FROM product_attr_export
WHERE sku IN ('CT0504', 'CT0601', 'CT1001', 'CT1201') ORDER BY sku, tag;
SELECT count(*) AS export_rows, count(DISTINCT sku) AS products FROM product_attr_export WHERE sku LIKE 'CT%';   -- 55 rows for 48 products (7 have two tags)
\\copy (SELECT * FROM product_attr_export WHERE sku LIKE 'CT%' ORDER BY sku, tag) TO '/tmp/lab7-attrs.csv' WITH (FORMAT csv, HEADER)
-- trap: JSON_TABLE turns a value it cannot cast into NULL — silently (NULL ON ERROR is the default)
SELECT f.line, f.doc->>'sku' AS sku, f.doc->'specs'->'pages' AS raw_pages, jt.pages, f.doc->'specs'->'solar' AS raw_solar, jt.solar
FROM spec_feed f,
     JSON_TABLE(f.doc, '$.specs' COLUMNS (pages int PATH '$.pages', solar boolean PATH '$.solar')) AS jt
WHERE f.line IN (19, 20, 22, 32) ORDER BY f.line;
SELECT jt.pages
FROM spec_feed f,
     JSON_TABLE(f.doc, '$.specs' COLUMNS (pages int PATH '$.pages' ERROR ON ERROR)) AS jt
WHERE f.line IN (19, 20);   -- ask for errors and you get one

-- ═══ S1 · a search configuration for Vietnamese typed without accents ═══
SELECT to_tsvector('simple', 'Bút bi Thiên Long TL-027 (xanh)') AS simple_doc,
       to_tsvector('simple', 'Bút bi Thiên Long TL-027 (xanh)') @@ websearch_to_tsquery('simple', 'but bi thien long') AS found;
CREATE TEXT SEARCH CONFIGURATION vn_unaccent (COPY = simple);
ALTER TEXT SEARCH CONFIGURATION vn_unaccent
  ALTER MAPPING FOR hword, hword_part, word WITH unaccent, simple;
SELECT alias, token, dictionaries, lexemes FROM ts_debug('vn_unaccent', 'Bút bi Thiên Long TL-027');
SELECT to_tsvector('vn_unaccent', 'Bút bi Thiên Long TL-027 (xanh)') AS vn_doc,
       to_tsvector('vn_unaccent', 'BÚT BI THIÊN LONG') = to_tsvector('vn_unaccent', 'But bi Thien Long') AS same_doc;
-- the limits: no word segmentation, and dropping the accents merges different words
SELECT to_tsvector('vn_unaccent', 'Máy tính cho học sinh') @@ websearch_to_tsquery('vn_unaccent', 'sinh hoc')     AS words_sinh_hoc,
       to_tsvector('vn_unaccent', 'Máy tính cho học sinh') @@ websearch_to_tsquery('vn_unaccent', '"sinh hoc"')   AS phrase_sinh_hoc,
       to_tsvector('vn_unaccent', 'Máy tính cho học sinh') @@ websearch_to_tsquery('vn_unaccent', '"hoc sinh"')   AS phrase_hoc_sinh,
       to_tsvector('vn_unaccent', 'Bàn học gấp gọn')       @@ websearch_to_tsquery('vn_unaccent', 'ban')          AS ban_finds_desk,
       to_tsvector('vn_unaccent', 'Sách bản in')           @@ websearch_to_tsquery('vn_unaccent', 'ban')          AS ban_finds_edition;
-- a STABLE function cannot feed a generated column or an index
ALTER TABLE product ADD COLUMN name_fold text GENERATED ALWAYS AS (lower(unaccent(name))) STORED;
SELECT provolatile FROM pg_proc WHERE oid = 'public.unaccent(text)'::regprocedure;
CREATE FUNCTION f_unaccent(text) RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
  RETURN public.unaccent('public.unaccent'::regdictionary, $1);   -- the dictionary is named: nothing left to look up
SELECT f_unaccent('Vở ô ly Hồng Hà — Đà Nẵng') AS folded;

-- ═══ S2 · the search document: name (A) + category (B) + brand and description (C) ═══
-- a generated column may only read its own row
ALTER TABLE product ADD COLUMN search_tsv tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('vn_unaccent', name), 'A') ||
  setweight(to_tsvector('vn_unaccent', (SELECT c.name FROM category c WHERE c.id = category_id)), 'B')) STORED;
-- ⇒ a plain column, filled by a trigger (Chapter 12)
ALTER TABLE product ADD COLUMN search_tsv tsvector;
CREATE FUNCTION product_search_doc() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE cat text;
BEGIN
  SELECT concat_ws(' ', parent.name, c.name) INTO cat          -- "Bút & mực Bút bi"
  FROM category c LEFT JOIN category parent ON parent.id = c.parent_id
  WHERE c.id = NEW.category_id;
  NEW.search_tsv := setweight(to_tsvector('vn_unaccent', NEW.name), 'A')
                 || setweight(to_tsvector('vn_unaccent', coalesce(cat, '')), 'B')
                 || setweight(to_tsvector('vn_unaccent', concat_ws(' ', NEW.attrs->>'brand', NEW.attrs->>'desc')), 'C');
  RETURN NEW;
END $$;
-- UPDATE OF …: a checkout that only changes stock must not rebuild the search document
CREATE TRIGGER product_search_doc BEFORE INSERT OR UPDATE OF name, category_id, attrs ON product
  FOR EACH ROW EXECUTE FUNCTION product_search_doc();
\\timing on
UPDATE product SET name = name;   -- back-fill: fires the trigger once per row
CREATE INDEX product_search_gin ON product USING GIN (search_tsv);
\\timing off
ANALYZE product;
SELECT sku, name, search_tsv FROM product WHERE sku = 'CT1203';
SELECT count(*) AS matches, count(*) FILTER (WHERE is_active) AS active
FROM product WHERE search_tsv @@ websearch_to_tsquery('vn_unaccent', 'but bi thien long');   -- 2502 | 2252
SELECT sku, ts_headline('vn_unaccent', name, q, 'StartSel=[, StopSel=]') AS name, round(ts_rank(search_tsv, q)::numeric, 4) AS rank
FROM product, websearch_to_tsquery('vn_unaccent', 'but bi thien long') AS q
WHERE is_active AND search_tsv @@ q
ORDER BY rank DESC, id LIMIT 5;
-- the category weight at work: "giáo trình" is in 2 product names but in the category of 6
SELECT sku, name, round(ts_rank(search_tsv, q)::numeric, 4) AS rank
FROM product, websearch_to_tsquery('vn_unaccent', 'giao trinh') AS q
WHERE sku LIKE 'CT%' AND search_tsv @@ q
ORDER BY rank DESC, id;
-- the description (weight C) answers questions no product name does
SELECT sku, name, ts_headline('vn_unaccent', attrs->>'desc', q, 'StartSel=[, StopSel=]') AS snippet
FROM product, websearch_to_tsquery('vn_unaccent', 'mang vao phong thi') AS q
WHERE sku LIKE 'CT%' AND search_tsv @@ q
ORDER BY ts_rank(search_tsv, q) DESC, id;
-- what a customer types → what PostgreSQL searches
SELECT x AS typed, websearch_to_tsquery('vn_unaccent', x) AS tsquery,
       (SELECT count(*) FROM product WHERE sku LIKE 'CT%' AND search_tsv @@ websearch_to_tsquery('vn_unaccent', x)) AS own_products
FROM unnest(ARRAY['so tay', 'so tay -moleskine', '"bullet journal"', 'casio or vinacal']) AS x;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name FROM product, websearch_to_tsquery('vn_unaccent', 'but bi thien long') AS q
WHERE is_active AND search_tsv @@ q
ORDER BY ts_rank(search_tsv, q) DESC, id LIMIT 20;   -- finding is fast; ranking every match is the cost
-- keep the category part fresh: a rename touches the products of that category (and of its children)
CREATE FUNCTION category_renamed() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE product SET category_id = category_id      -- "touch" the rows ⇒ product_search_doc runs again
  WHERE category_id IN (SELECT id FROM category WHERE id = NEW.id OR parent_id = NEW.id);
  RETURN NULL;
END $$;
CREATE TRIGGER category_renamed AFTER UPDATE OF name ON category
  FOR EACH ROW WHEN (OLD.name IS DISTINCT FROM NEW.name) EXECUTE FUNCTION category_renamed();
\\timing on
UPDATE category SET name = 'Giáo trình CNTT' WHERE name = 'Giáo trình IT';
\\timing off
SELECT count(*) AS found_by_cntt FROM product WHERE search_tsv @@ websearch_to_tsquery('vn_unaccent', 'cntt');   -- 7506 = 6 products + 7.500 listings
-- the trigger fires on a name change, not on a stock change
BEGIN;
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF) UPDATE product SET stock = stock - 1 WHERE sku = 'CT0501';
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF) UPDATE product SET name = name || ' ' WHERE sku = 'CT0501';
ROLLBACK;

-- ═══ S3 · typos and autocomplete: pg_trgm ═══
SELECT count(*) AS fts_matches FROM product WHERE search_tsv @@ websearch_to_tsquery('vn_unaccent', 'casoi fx 580');   -- 0: a typo is a different lexeme
\\timing on
ALTER TABLE product ADD COLUMN name_fold text GENERATED ALWAYS AS (lower(f_unaccent(name))) STORED;
\\timing off
SELECT sku, name, name_fold FROM product WHERE sku IN ('CT1001', 'MP000003') ORDER BY sku;
SELECT sku, name_fold,
       round(similarity('casoi fx 580', name_fold)::numeric, 3)             AS similarity,
       round(word_similarity('casoi fx 580', name_fold)::numeric, 3)        AS word_similarity,
       round(strict_word_similarity('casoi fx 580', name_fold)::numeric, 3) AS strict_word_similarity
FROM product WHERE sku IN ('CT1001', 'CT1002', 'CT1004') ORDER BY sku;
SELECT current_setting('pg_trgm.similarity_threshold') AS similarity_threshold,
       current_setting('pg_trgm.word_similarity_threshold') AS word_similarity_threshold;
SELECT count(*) FILTER (WHERE 'casoi fx 580' % name_fold)  AS by_similarity,
       count(*) FILTER (WHERE 'casoi fx 580' <% name_fold) AS by_word_similarity
FROM product;   -- 1 and 0: the defaults (0,3 and 0,6) are too strict for this typo
SET pg_trgm.word_similarity_threshold = 0.5;
SELECT count(*) FILTER (WHERE 'casoi fx 580' <% name_fold) AS by_word_similarity_05 FROM product;   -- 1251: the FX-580 and its listings
-- "contains" for the search box: ILIKE '%…%' (here LIKE on the folded column)
EXPLAIN (ANALYZE, BUFFERS) SELECT count(*) FROM product WHERE name_fold LIKE '%mildliner%';
\\timing on
CREATE INDEX product_name_trgm ON product USING GIN (name_fold gin_trgm_ops);
\\timing off
EXPLAIN (ANALYZE, BUFFERS) SELECT count(*) FROM product WHERE name_fold LIKE '%mildliner%';
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name FROM product
WHERE is_active AND 'casoi fx 580' <% name_fold
ORDER BY word_similarity('casoi fx 580', name_fold) DESC, id LIMIT 20;
-- autocomplete = the 8 NEAREST names: KNN needs GiST (it walks nearest-first and stops at LIMIT)
\\timing on
CREATE INDEX product_name_gist ON product USING GIST (name_fold gist_trgm_ops);
\\timing off
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name FROM product WHERE is_active
ORDER BY 'thien long tl' <<-> name_fold LIMIT 8;
SELECT sku, name, round(('thien long tl' <<-> name_fold)::numeric, 3) AS distance
FROM product WHERE is_active
ORDER BY 'thien long tl' <<-> name_fold, id LIMIT 8;
-- trap: the operands the other way round mean word_similarity(name, query) — no index, a full sort
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name FROM product WHERE is_active
ORDER BY name_fold <<-> 'thien long tl' LIMIT 8;
RESET pg_trgm.word_similarity_threshold;
SELECT indexrelname AS index, pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes WHERE relname = 'product'
ORDER BY pg_relation_size(indexrelid) DESC;

-- ═══ S4 · search_products(q): full-text first, trigram when full-text finds nothing ═══
CREATE FUNCTION search_products(q text, lim int DEFAULT 20)
RETURNS TABLE (id bigint, sku text, name text, how text, score real)
LANGUAGE plpgsql STABLE
SET pg_trgm.word_similarity_threshold = 0.5      -- this function's own threshold, whatever the session says
SET search_path = shop, public                   -- the app connects with search_path = shop: pin where <% and word_similarity live
AS $$
BEGIN
  RETURN QUERY
    SELECT p.id, p.sku, p.name, 'fts', ts_rank(p.search_tsv, tq)
    FROM product p, websearch_to_tsquery('vn_unaccent', q) AS tq
    WHERE p.is_active AND p.search_tsv @@ tq
    ORDER BY 5 DESC, p.id
    LIMIT lim;
  IF FOUND THEN RETURN; END IF;                   -- full-text found something: done
  RETURN QUERY
    SELECT p.id, p.sku, p.name, 'fuzzy', word_similarity(lower(f_unaccent(q)), p.name_fold)
    FROM product p
    WHERE p.is_active AND lower(f_unaccent(q)) <% p.name_fold
    ORDER BY 5 DESC, p.id
    LIMIT lim;
END $$;
SELECT * FROM search_products('but bi thien long', 3);
SELECT * FROM search_products('giáo trình', 3);
SELECT * FROM search_products('casoi fx 580', 3);
SELECT * FROM search_products('thien lomg', 3);
SELECT * FROM search_products('xyz qwerty', 3);
\\timing on
SELECT count(*) FROM search_products('but bi thien long');
SELECT count(*) FROM search_products('casoi fx 580');
SELECT count(*) FROM search_products('mildliner');
\\timing off
-- EXPLAIN sees only a black box: the plan inside the function is invisible here
EXPLAIN (ANALYZE, COSTS OFF) SELECT * FROM search_products('casoi fx 580');

-- ═══ self-check — your end state must match ═══
SELECT conname FROM pg_constraint WHERE conrelid = 'product'::regclass AND contype = 'c' ORDER BY conname;
SELECT x AS typed, count(r.id) AS results, min(r.how) AS how
FROM unnest(ARRAY['but bi thien long', 'giao trinh cntt', 'casoi fx 580', 'thien lomg', 'so tay -moleskine']) AS x
LEFT JOIN LATERAL search_products(x, 100000) AS r ON true
GROUP BY x ORDER BY x;   -- 2252 fts · 1001 fuzzy · 6756 fts · 7757 fts · 7507 fuzzy
SELECT count(*) AS products, count(search_tsv) AS with_search_doc, count(name_fold) AS with_name_fold FROM product;
DROP TABLE spec_feed;   -- the staging table has done its job`;
/* SOL:END */

const SETUP = `$ docker cp lab7-start.sql pgdemo:/tmp/
$ docker exec -it pgdemo psql -U postgres -d ctshop -f /tmp/lab7-start.sql
…   (part A: DROP/CREATE, INSERT … — the standard shop)
CREATE TABLE
INSERT 0 48
 categories | products | customers | orders | order_lines | payments | spec_docs
------------+----------+-----------+--------+-------------+----------+-----------
         12 |       48 |       300 |   2000 |        5000 |     1663 |        48
(1 row)`;
const PREP = `SET search_path = shop, public;          -- public: where the extensions live
SET TimeZone = 'Asia/Ho_Chi_Minh';
SET max_parallel_workers_per_gather = 0;  -- shorter plans, fair comparisons
CREATE EXTENSION IF NOT EXISTS unaccent SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pg_trgm  SCHEMA public;`;
const FEED = `SELECT line, doc->>'sku' AS sku, (doc->'specs') - 'desc' AS specs_without_desc
FROM spec_feed WHERE line IN (3, 20, 24) ORDER BY line;
 line |  sku   |                        specs_without_desc                         
------+--------+-------------------------------------------------------------------
    3 | CT0503 | {"ink": "dầu", "pack": 1, "tip_mm": "0.7"}
   20 | CT0802 | {"gsm": 70, "pages": "96 trang", "ruling": "ô ly"}
   24 | CT0806 | {"gsm": 80, "pages": 120, "colour": "xanh", "ruling": "kẻ ngang"}
(3 rows)`;
/* Cùng câu nhưng thiếu ngoặc — lỗi thật (that/pg-lab-7-feed.out.txt). */
const FEED_ERR = `SELECT line, doc->>'sku' AS sku, doc->'specs' - 'desc' AS specs_without_desc FROM spec_feed …;
ERROR:  operator is not unique: unknown - unknown
LINE 1: SELECT line, doc->>'sku' AS sku, doc->'specs' - 'desc' AS sp...
                                                      ^
HINT:  Could not choose a best candidate operator. You might need to add explicit type casts.`;

/* Prisma 5.22 chạy thật trên DB nháp ctlab7 (src/khung/pg/that/pg-lab-7.prisma.txt). */
const PRISMA_PULL = `// npx prisma db pull — what Prisma reads back from the finished table (lines selected)
model product {
  id          BigInt                   @id @default(autoincrement())
  sku         String                   @unique
  name        String
  attrs       Json                     @default("{}")
  search_tsv  Unsupported("tsvector")?
  name_fold   String?                  @default(dbgenerated("lower(f_unaccent(name))"))
  …
  @@index([attrs(ops: JsonbPathOps)], map: "product_attrs_gin", type: Gin)
  @@index([name_fold(ops: raw("gist_trgm_ops"))], map: "product_name_gist", type: Gist)
  @@index([name_fold(ops: raw("gin_trgm_ops"))], map: "product_name_trgm", type: Gin)
  @@index([search_tsv], map: "product_search_gin", type: Gin)
}
// warning: "These indexes are not supported by Prisma Client … expression indexes: product_pages"`;
const PRISMA_CODE = `// 1) a Json path filter — Prisma's own API
await prisma.product.findMany({ where: { attrs: { path: ['ink'], equals: 'gel' }, isActive: true },
  select: { sku: true, name: true }, orderBy: { id: 'asc' }, take: 3 });
// 2) array_contains on a path
await prisma.product.count({ where: { attrs: { path: ['tags'], array_contains: ['ôn thi'] } } });
// 3) the filter panel as ONE containment test — raw SQL, the value still goes as a parameter
const filter = { ink: 'gel', tip_mm: 0.5, color: 'tím' };
await prisma.$queryRaw\`SELECT sku, name FROM product WHERE is_active AND attrs @> \${JSON.stringify(filter)}::jsonb
                         ORDER BY price, id LIMIT 3\`;
// 4) the search box
await prisma.$queryRaw\`SELECT sku, name, how, score FROM search_products(\${q}, 3)\`;`;
const PRISMA_LOG = `prisma:query SELECT "shop"."product"."id", "shop"."product"."sku", "shop"."product"."name" FROM "shop"."product" WHERE (("shop"."product"."attrs"#>ARRAY[$1]::text[])::jsonb::jsonb = $2 AND "shop"."product"."is_active" = $3) ORDER BY "shop"."product"."id" ASC LIMIT $4 OFFSET $5
params ["ink","gel",true,3,0] 2ms
prisma:query SELECT COUNT(*) FROM (SELECT "shop"."product"."id" FROM "shop"."product" WHERE (("shop"."product"."attrs"#>ARRAY[$1]::text[])::jsonb @> $2 AND JSONB_TYPEOF(("shop"."product"."attrs"#>ARRAY[$3]::text[])::jsonb) = $4) OFFSET $5) AS "sub"
params ["tags",["ôn thi"],"tags","array",0] 33ms
count 8757
prisma:query SELECT sku, name FROM product WHERE is_active AND attrs @> $1::jsonb ORDER BY price, id LIMIT 3
params ["{"ink":"gel","tip_mm":0.5,"color":"tím"}"] 2ms`;
const PRISMA_PLAN = `EXPLAIN (GENERIC_PLAN)   -- Prisma's array_contains, exactly as sent
SELECT COUNT(*) FROM (SELECT "shop"."product"."id" FROM "shop"."product" WHERE (("shop"."product"."attrs"#>ARRAY[$1]::text[])::jsonb @> $2 AND JSONB_TYPEOF(("shop"."product"."attrs"#>ARRAY[$3]::text[])::jsonb) = $4) OFFSET $5) AS "sub";
                                             QUERY PLAN
----------------------------------------------------------------------------------------------------
 Aggregate  (cost=5959.11..5959.12 rows=1 width=8)
   ->  Limit  (cost=1986.36..5959.08 rows=2 width=8)
         ->  Seq Scan on product  (cost=0.00..5959.08 rows=3 width=8)
               Filter: (((attrs #> ARRAY[$1]) @> $2) AND (jsonb_typeof((attrs #> ARRAY[$3])) = $4))
(4 rows)

EXPLAIN (GENERIC_PLAN)   -- the raw query of 3)
SELECT sku, name FROM product WHERE is_active AND attrs @> $1::jsonb ORDER BY price, id LIMIT 3;
                                          QUERY PLAN
-----------------------------------------------------------------------------------------------
 Limit  (cost=1694.46..1694.47 rows=3 width=57)
   ->  Sort  (cost=1694.46..1695.81 rows=540 width=57)
         Sort Key: price, id
         ->  Bitmap Heap Scan on product  (cost=15.93..1687.48 rows=540 width=57)
               Recheck Cond: (attrs @> $1)
               Filter: is_active
               ->  Bitmap Index Scan on product_attrs_gin  (cost=0.00..15.79 rows=540 width=0)
                     Index Cond: (attrs @> $1)
(8 rows)`;
const PRISMA_ERR = `prisma:query SELECT sku, name, how, score FROM search_products($1, 3)
params ["casoi fx 580"] …
PrismaClientKnownRequestError:
Invalid \`prisma.$queryRaw()\` invocation:
Raw query failed. Code: \`42883\`. Message: \`ERROR: function word_similarity(text, text) does not exist
HINT: No function matches the given name and argument types. You might need to add explicit type casts.\`
  code: 'P2010',`;
const PRISMA_OK = `prisma:query SELECT sku, name, how, score FROM search_products($1, 3)
params ["casoi fx 580"] 49ms
rows [{"sku":"CT1001","name":"Máy tính Casio FX-580VN X","how":"fuzzy","score":0.5625},{"sku":"MP000078","name":"Máy tính Casio FX-580VN X chính hãng","how":"fuzzy","score":0.5625},{"sku":"MP000126","name":"Máy tính Casio FX-580VN X chính hãng","how":"fuzzy","score":0.5625}]`;

const FILES = (vi) => [
  [`${F}/lab7-start.sql`, '🧩', 'lab7-start.sql', vi ? 'CT Shop sạch (lược đồ + dữ liệu chuẩn, 48 sản phẩm) + bảng tạm spec_feed: 48 tài liệu JSON thông số của nhà cung cấp, đúng như lúc nhận + danh sách việc J1–J4, S1–S4' : 'A clean CT Shop (standard schema + data, 48 products) + the staging table spec_feed: the supplier’s 48 JSON spec documents, exactly as they arrived + the J1–J4, S1–S4 to-do list'],
  [`${F}/lab7-solution.sql`, '🔑', 'lab7-solution.sql', vi ? 'Mọi bước khảo sát → làm sạch → lọc → tìm kiếm, mọi bẫy, con số thật trong chú thích — mở sau khi tự làm' : 'Every survey → clean → filter → search step, every trap, real numbers in the comments — open after your own attempt'],
].map(([h, i, t, s]) => card(h, i, t, s, vi ? 'TẢI VỀ →' : 'DOWNLOAD →')).join('\n');

const buoc = (lang, k, de, goiY, keys, sau = '') => `<h4>${k} — ${de}</h4>
${goiY ? `<p class="meo">💡 ${goiY}</p>` : ''}
${details(lang === 'en' ? `Answer — ${k}` : `Đáp án — ${k}`, keys.map((x) => code(Q[x]) + out(O[x])).join('\n') + (sau ? `<p>${sau}</p>` : ''))}`;
const bay = (tieuDe, chu, keys) => `<div class="pitfall"><p><strong>${tieuDe}</strong> ${chu}</p></div>
${keys.map((x) => code(Q[x]) + out(O[x])).join('\n')}`;
const qo = (...keys) => keys.map((x) => code(Q[x]) + out(O[x])).join('\n');
const ans = (lang, k, keys, sau = '') => details(lang === 'en' ? `Answer — ${k}` : `Đáp án — ${k}`, keys.map((x) => code(Q[x]) + out(O[x])).join('\n') + (sau ? `<p>${sau}</p>` : ''));

const RUBRIC = (vi) => `<table>
<tr><th>${vi ? 'Phần' : 'Part'}</th><th>${vi ? 'Điểm' : 'Points'}</th><th>${vi ? 'Chấm khi' : 'Awarded when'}</th></tr>
<tr><td>J1</td><td>1</td><td>${vi ? 'bảng khoá × kiểu × số tài liệu; chỉ ra đủ 4 giá trị sai kiểu + 1 JSON null, sku lạ CT1207, sản phẩm thiếu thông số CT0906' : 'key × type × documents table; all 4 badly typed values + 1 JSON null found, the unknown sku CT1207, the product without specs CT0906'}</td></tr>
<tr><td>J2</td><td>2</td><td>${vi ? 'gộp bằng <code>||</code> có ngoặc (giải thích được bẫy độ ưu tiên); hai CHECK được thêm sau khi sửa đúng 5 tài liệu bằng jsonb_set / jsonb_strip_nulls / - ; CHECK từ chối tài liệu xấu; nêu được bẫy NULL của jsonb_set' : 'merged with a parenthesised <code>||</code> (the precedence trap explained); both CHECKs added after repairing exactly 5 documents with jsonb_set / jsonb_strip_nulls / -; the CHECK rejects a bad document; the jsonb_set NULL trap stated'}</td></tr>
<tr><td>J3</td><td>2</td><td>${vi ? 'bộ lọc @> chuyển từ Seq Scan sang Bitmap Index Scan trên GIN jsonb_path_ops; giải thích ? với path_ops, 0.50 vs "0.5", "48" &gt; "100"; khoảng số trang dùng B-tree biểu thức' : 'the @> filter goes from Seq Scan to Bitmap Index Scan on a jsonb_path_ops GIN; ? with path_ops, 0.50 vs "0.5" and "48" &gt; "100" explained; the page range uses an expression B-tree'}</td></tr>
<tr><td>J4</td><td>1</td><td>${vi ? 'view JSON_TABLE có NESTED PATH ra 55 dòng / 48 sản phẩm, xuất CSV; chỉ ra NULL ON ERROR nuốt "96 trang"' : 'a JSON_TABLE view with NESTED PATH giving 55 rows / 48 products, exported to CSV; NULL ON ERROR swallowing "96 trang" shown'}</td></tr>
<tr><td>S1–S2</td><td>2</td><td>${vi ? 'cấu hình vn_unaccent; f_unaccent IMMUTABLE; tài liệu tìm kiếm có trọng số A/B/C bằng trigger (vì sao không generated được), GIN; "giao trinh" ra đủ 6 sách, đổi tên danh mục vẫn đúng' : 'the vn_unaccent configuration; an IMMUTABLE f_unaccent; a weighted A/B/C search document kept by a trigger (why not generated), GIN; "giao trinh" returns all 6 books, a category rename stays correct'}</td></tr>
<tr><td>S3</td><td>1</td><td>${vi ? 'cột name_fold + GIN trigram cho LIKE "%…%", ngưỡng word_similarity cho "casoi fx 580", GiST KNN cho gợi ý (đúng chiều toán tử)' : 'name_fold + a trigram GIN for LIKE "%…%", the word_similarity threshold for "casoi fx 580", a GiST KNN for suggestions (operands the right way round)'}</td></tr>
<tr><td>S4</td><td>1</td><td>${vi ? 'search_products: FTS trước, trigram sau; SET ngưỡng + search_path trong hàm; gọi được từ Prisma' : 'search_products: full-text first, trigram after; threshold + search_path SET on the function; callable from Prisma'}</td></tr>
</table>`;

const EN = `
<div class="ml-en">
<span class="eyebrow">Lab 7 · CT Shop · after Chapter 13</span>
<h2>A catalogue that filters, a search box that forgives</h2>
<p class="lead">Lab 6 made checkout correct when many people buy at once. This lab works on the other half of a shop: <em>finding</em> things. The supplier has sent the technical specs of every product as JSON, the marketplace is about to open with 60.000 seller listings, and customers type “but bi thien long” without accents, in capitals, with typos. You will import and clean the specs into <code>product.attrs</code>, build filter panels that stay fast, give accounting a flat table, and write the one function the app calls when someone presses Enter in the search box.</p>

<h3>1 · The brief</h3>
<p>The ticket from the CT Shop team:</p>
<ul>
<li>The supplier’s <strong>spec sheet</strong> arrived as 48 JSON documents (table <code>spec_feed</code>). Import it into <code>product.attrs</code> — and make sure a bad document can never get in again.</li>
<li>Each category page needs a <strong>filter panel</strong>: ink and tip size for pens, pages for notebooks, “allowed in the exam room” for calculators…</li>
<li>Next week the <strong>marketplace</strong> opens: 60.000 listings from ten sellers. The filters must stay fast.</li>
<li><strong>Accounting</strong> wants the attributes as a plain table (a CSV they can open), one row per tag.</li>
<li>The <strong>search box</strong>: “but bi thien long” must find “Bút bi Thiên Long”, “giao trinh” must find every textbook, and “casoi fx 580” (a typo) must still find the Casio FX-580VN X. One function, ranked results.</li>
</ul>
<p>Tools: Chapter 13 — <code>jsonb</code> and its operators, <code>jsonb_set</code>, <code>JSON_TABLE</code> (13.1), GIN and <code>jsonb_path_ops</code>, expression B-trees (13.2), <code>tsvector</code>/<code>tsquery</code>, weights, ranking, <code>unaccent</code> (13.3), <code>pg_trgm</code> and GiST KNN (13.4) — plus the functions, triggers and views of Chapter 12. Small new pieces are explained where they appear: <code>IS JSON OBJECT</code>, <code>jsonb_strip_nulls</code>, <code>jsonb_set_lax</code>, <code>NESTED PATH</code>, <code>ERROR ON ERROR</code>, <code>ts_debug</code>, <code>CREATE FUNCTION … SET</code>, <code>\\copy … TO</code> and the word-distance operator <code>&lt;&lt;-&gt;</code>.</p>
<p>Chapter 13 ran its examples on a copy of the 48 products. Here everything happens on CT Shop’s own table — with its constraints, its category tree, 60.000 marketplace rows and an app (Prisma) on top — and the data is dirty, as real data is.</p>

<h3>2 · Requirements and pass criteria</h3>
<ol>
<li><strong>J1</strong> — survey the feed before importing: keys, JSON types, unknown sku, product without specs, the facets of each category.</li>
<li><strong>J2</strong> — merge the specs into <code>attrs</code>; guard the column with CHECK constraints (they fail first — find out why, repair, then add them); the NULL trap of <code>jsonb_set</code>.</li>
<li><strong>J3</strong> — the marketplace: 60.000 listings; the filter “gel · 0.5 mm · purple” with a GIN index, before/after; the text-comparison traps of <code>-&gt;&gt;</code>; a page-count range.</li>
<li><strong>J4</strong> — an attribute table for accounting with <code>JSON_TABLE</code>, tags as rows; what bad data does to it.</li>
<li><strong>S1</strong> — a search configuration <code>vn_unaccent</code> and an IMMUTABLE <code>f_unaccent</code>.</li>
<li><strong>S2</strong> — the search document: name (A) + category (B) + brand and description (C), kept by a trigger; GIN; <code>websearch_to_tsquery</code>, <code>ts_rank</code>, <code>ts_headline</code>.</li>
<li><strong>S3</strong> — typos and autocomplete with <code>pg_trgm</code>: thresholds, GIN for “contains”, GiST for “nearest”.</li>
<li><strong>S4</strong> — <code>search_products(q)</code>: full-text first, trigram when full-text finds nothing; call it from Prisma.</li>
</ol>
<div class="callout ok"><p><strong>You pass when:</strong> the survey finds <strong>4</strong> badly typed values + <strong>1</strong> JSON null, the unknown sku <strong>CT1207</strong> and the product without specs <strong>CT0906</strong> · <code>product_attrs_object</code> and <code>product_attrs_types</code> exist and reject <code>"300 trang"</code> and <code>[]</code> · the filter “gel · 0.5 · tím” is a <strong>Bitmap Index Scan on product_attrs_gin</strong> reading <strong>500</strong> heap pages instead of 2.546 · the export view gives <strong>55</strong> rows for 48 products · “but bi thien long” finds <strong>2.252</strong> active listings by full-text, “giao trinh” ranks the 2 named textbooks above the 4 others of the category · <code>search_products</code> answers “casoi fx 580” (<strong>1.001</strong> results, <code>fuzzy</code>) and “thien lomg” · the same call works from Prisma.</p></div>
<p><strong>Times on your machine will differ</strong>. Judge by what does not change: the counts, the plan nodes, the pages in <code>Buffers</code>, the index sizes and the ratio before/after.</p>
<h4>Rubric (10 points)</h4>
${RUBRIC(false)}

<h3>3 · Downloads and setup</h3>
<div class="callout"><p><code>pgdemo</code> is the name of <em>your</em> PostgreSQL 17 container. If you built it in lesson 0.3 it is called <code>pg17</code>: either write <code>pg17</code> instead of <code>pgdemo</code> in every command below, or give it the alias once with <code>docker rename pg17 pgdemo</code>.</p></div>
${FILES(false)}
<p>The start file rebuilds the standard shop (the same rows as Labs 1–4 and 6) and adds one staging table, <code>spec_feed</code>: what the supplier sent, one JSON document per line of their file. It is not one of the 8 tables of the model; the solution drops it at the end.</p>
${out(SETUP)}
<p>Three documents of the feed, as they arrived — look closely at the values:</p>
${out(FEED)}
<p>Then open psql and prepare the session. The two extensions go into <code>public</code>, so the search path must include it:</p>
${code(PREP)}
${out(O.EXT1 + '\n' + O.EXT2)}

<h3>4 · Step by step</h3>

<h4>J1 — survey the feed before you import anything</h4>
<p class="meo">💡 <code>jsonb_each(doc-&gt;'specs')</code> turns every key/value of a document into a row; group by key and by <code>jsonb_typeof(value)</code>. A key that arrives with two types will break every filter and every cast built on it.</p>
${ans('en', 'J1', ['J1A', 'J1B', 'J1C'], 'Twenty keys; four of them arrive with two types. The culprits: a tip size sent as the string <code>"0.7"</code>, pages as <code>"96 trang"</code> and <code>"200"</code>, a calculator whose <code>solar</code> is <code>"có"</code> instead of <code>true</code> — and one <code>gsm</code> that is a JSON <code>null</code>. Nothing is rejected on arrival: a <code>jsonb</code> column accepts any valid JSON.')}
<p>Two more checks every import needs — rows on one side without a partner on the other:</p>
${qo('J1D', 'J1E')}
<p>CT1207 is a book the shop does not sell yet (the import must skip it, not fail); the Moleskine got no specs (its filters will show nothing — tell the buyer). Finally, which keys belong to which category? That list <em>is</em> the filter panel of each category page:</p>
${qo('J1F')}

<h4>J2 — merge into attrs, then guard the column</h4>
<p>The obvious merge is “old attributes <code>||</code> new specs”. Try it inside a transaction and look at one product:</p>
${qo('J2A', 'J2B')}
${bay('Trap — operator precedence.', 'brand, color and tags are gone: the product now holds <em>only</em> the specs. In PostgreSQL <code>||</code> and <code>-&gt;</code> have the same precedence and group from left to right, so <code>p.attrs || f.doc-&gt;\'specs\'</code> means <code>(p.attrs || f.doc) -&gt; \'specs\'</code>. ROLLBACK, and see it on two literals:', ['J2C'])}
<p>The other direction bites too: <code>-</code> binds <em>tighter</em> than <code>-&gt;</code>, so <code>doc-&gt;'specs' - 'desc'</code> tries <code>'specs' - 'desc'</code> first:</p>
${out(FEED_ERR)}
<p>Rule of thumb: whenever <code>||</code>, <code>-</code>, <code>#-</code> meet <code>-&gt;</code> / <code>-&gt;&gt;</code>, add parentheses. The real merge:</p>
${qo('J2D', 'J2E')}
<p><strong>UPDATE 47</strong> (CT1207 has no product, the Moleskine has no document). Now protect the column. <strong>New: <code>IS JSON OBJECT</code></strong> (SQL/JSON, PostgreSQL 16+) is true only for a JSON object — not an array, not a scalar. And a CHECK on the types of the keys the filters use. Note the trick: <code>attrs-&gt;'pages'</code> is SQL NULL when the key is missing, <code>jsonb_typeof(NULL)</code> is NULL, and a CHECK only fails on <em>false</em> — so products without pages pass.</p>
${qo('J2F', 'J2G')}
<p class="meo">💡 The second CHECK fails because the dirty documents are in the table now. Find the rows with the same predicates, then repair each value with the smallest change: <code>jsonb_set</code> replaces one key and keeps the rest of the document.</p>
${ans('en', 'J2 (repair)', ['J2H', 'J2I', 'J2J', 'J2K'], '<code>substring(… FROM \'[0-9]+\')</code> keeps the digits of “96 trang”; <code>to_jsonb(…::int)</code> makes a JSON <em>number</em> again. For <code>solar</code> the business rule decides: “có”, “yes” and “true” mean true.')}
<p>The <code>gsm</code> of CT0803 is a different case: it is a JSON <code>null</code>, which is not SQL NULL. <code>-&gt;&gt;</code> hides the difference; <code>?</code> does not:</p>
${qo('J2L')}
<p><strong>New: <code>jsonb_strip_nulls</code></strong> removes every key whose value is JSON null. And the supplier who wrote <code>colour</code>: move the value with <code>-</code> (remove a key) and <code>||</code> (add one):</p>
${qo('J2M', 'J2N', 'J2O')}
<p>From now on a bad document is refused at the door — by the database, whatever app, script or psql session sends it:</p>
${qo('J2P', 'J2Q')}
<p>Marketing wants the tag “ôn thi” (exam prep) on exam-approved calculators and 2B pencils — append to an array with <code>jsonb_set(attrs, '{tags}', (attrs-&gt;'tags') || '["ôn thi"]')</code>:</p>
${qo('J2S')}
${bay('Trap — jsonb_set is STRICT.', 'An app “removes the discount” by sending NULL. <code>to_jsonb(NULL)</code> is SQL NULL, a STRICT function given NULL returns NULL — the <em>whole</em> document. Here the NOT NULL on attrs saves the product; on a nullable column it would silently lose every attribute:', ['J2U'])}
<p><strong>New: <code>jsonb_set_lax</code></strong> decides what a NULL means: by default it stores a JSON null; with <code>\'delete_key\'</code> it removes the key:</p>
${qo('J2V', 'J2W')}

<h4>J3 — the marketplace opens: filters on 60.000 listings</h4>
<p>Ten sellers list the same 48 products, each title written their own way — without accents, with “chính hãng”, in capitals — and each listing inherits the cleaned attributes plus its seller and a colour. 10 % are switched off (<code>is_active = false</code>):</p>
${qo('J3A', 'J3B', 'J3C', 'J3D')}
<p>Now the page “Bút bi” with three ticked boxes: gel ink, 0.5 mm, purple. One containment test carries the whole panel:</p>
${qo('J3E')}
<p class="meo">💡 <code>@&gt;</code> is the operator a GIN index answers (lesson 13.2). <code>jsonb_path_ops</code> stores one hash per path-and-value, so it is smaller than the default <code>jsonb_ops</code> — but it only supports <code>@&gt;</code>, <code>@?</code> and <code>@@</code>.</p>
${ans('en', 'J3 (index)', ['J3G', 'J3H', 'J3I', 'J3J'], `<strong>Bitmap Index Scan on product_attrs_gin</strong>: the index hands over exactly the 500 matching rows, the heap visit reads 500 pages instead of 2.546, ${ms('J3E')} ms → ${ms('J3H', 2)} ms. The index is about 1 MB next to a 20 MB table. The last query shows what it does: three lists of rows (2.502, 7.506, 12.005), intersected — 500 rows. Note <code>Recheck Cond</code>: GIN is lossy for <code>@&gt;</code> on path hashes, so PostgreSQL re-tests each row.`)}
<p>Untick the colour and the result is ten times larger:</p>
${qo('J3K')}
<p>Still the index, but now 2.502 candidates on 1.292 pages — half the table. With a few more matches the planner would rightly switch back to a Seq Scan: an index pays off when it lets PostgreSQL <em>skip</em> most pages.</p>
${bay('Trap — “has the key” is not “is true”, and jsonb_path_ops has no ?.', 'The filter “refillable” written as <code>attrs ? \'refill\'</code> also counts the pens with <code>"refill": false</code>, and the path_ops index cannot help:', ['J3L', 'J3M', 'J3N'])}
${bay('Trap — ->> returns text.', 'The supplier wrote 0.50 for the Pentel A255. As JSON numbers, 0.50 = 0.5; as text, \'0.50\' ≠ \'0.5\':', ['J3O', 'J3P'])}
<p>1.251 rows lost by a text comparison. Text order hurts ranges too:</p>
${qo('J3Q')}
<p>A 48-page notebook “has more than 100 pages” because <code>\'4\' &gt; \'1\'</code>. Cast to a number — the CHECK of J2 guarantees the cast never fails. A range is not containment, so GIN cannot serve it; a <strong>B-tree on the expression</strong> can (lesson 13.2):</p>
${qo('J3R', 'J3S')}

<h4>J4 — a flat attribute table for accounting</h4>
<p class="meo">💡 <code>JSON_TABLE</code> (PostgreSQL 17, lesson 13.1) turns each document into typed columns. <strong>New: <code>NESTED PATH '$.tags[*]'</code></strong> gives one row per element of an array. Put it in a view: accounting reads the view, never the JSON.</p>
${ans('en', 'J4', ['J4V', 'J4A', 'J4B', 'J4C'], 'CT0601 and CT1001 appear twice — one row per tag. <strong>New: <code>\\copy (query) TO \'file\' WITH (FORMAT csv, HEADER)</code></strong> is the export twin of Lab 2’s <code>\\copy … FROM</code>: psql writes the file on the machine where psql runs (here inside the container: <code>docker cp pgdemo:/tmp/lab7-attrs.csv .</code>).')}
${bay('Trap — JSON_TABLE swallows bad values.', 'Run it on the raw feed: a value that cannot be cast becomes NULL without a word (<code>NULL ON ERROR</code> is the default). “96 trang” vanishes, “200” is quietly accepted, “có” vanishes:', ['J4D'])}
<p>Ask for errors and you get one — use <code>ERROR ON ERROR</code> when an export must be complete or fail:</p>
${qo('J4E')}

<h4>S1 — a search configuration for Vietnamese without accents</h4>
${qo('S1A')}
<p>The <code>simple</code> configuration keeps the accents, so “but bi” does not match “bút bi”. Build the configuration of lesson 13.3 for the shop: copy <code>simple</code>, then run every word through <code>unaccent</code> first:</p>
${ans('en', 'S1 (vn_unaccent)', ['S1B', 'S1C', 'S1D', 'S1E'], '<strong>New: <code>ts_debug</code></strong> shows the pipeline token by token: “Bút” and “Thiên” are <code>word</code> tokens (non-ASCII letters) and go through unaccent then simple; “bi”, “Long”, “TL” are <code>asciiword</code> and go straight to simple. Accents and capitals no longer matter: both spellings give the same document. Note the model code: “TL-027” becomes two lexemes, <code>tl</code> and <code>-027</code> — model codes are trigram territory (S3).')}
<p>Know the limits before you promise anything to the business:</p>
${qo('S1F')}
<p>PostgreSQL does not segment Vietnamese: “học sinh” is two words, so the words “sinh hoc” match a text about <em>học sinh</em> (only the phrase search keeps the order). And dropping accents merges different words: “ban” finds <em>bàn</em> (desk) and <em>bản</em> (edition) alike — more matches, less precision. Ranking (S2) puts the right ones first.</p>
<p>The trigram column of S3 needs an unaccented name too — and a generated column, like an index, only accepts IMMUTABLE functions:</p>
${qo('S1G', 'S1H')}
<p><code>unaccent</code> is STABLE: it looks up its dictionary through the search path, which can change. The wrapper of lesson 13.4 names the dictionary explicitly, so nothing is left to look up:</p>
${qo('S1I', 'S1J')}

<h4>S2 — the search document: name, category, brand and description</h4>
<p>Customers type category words: “giáo trình” is in the names of 2 books but in the category of 6. The search document should hold the name (weight A), the category path (B), and the brand and the supplier’s description (C). First attempt — a generated column like lesson 13.3:</p>
${qo('S2A')}
${bay('Trap — a generated column only sees its own row.', 'No subquery, no other table. The category name lives in <code>category</code>. The Chapter 12 answer: a plain column filled by a BEFORE trigger. Two details matter: <code>UPDATE OF name, category_id, attrs</code> — a checkout that only changes <code>stock</code> must not rebuild the document — and a second trigger on <code>category</code>, because renaming a category changes the documents of its products.', [])}
${ans('en', 'S2 (trigger + GIN)', ['S2B', 'S2C', 'S2D', 'S2F', 'S2G'], `The back-fill <code>UPDATE product SET name = name</code> fires the trigger once per row: 60.048 documents in ${tg('S2F')} s on this run. The GIN index takes ${tg('S2G')} s.`)}
${qo('S2J')}
<p>Read the document: <code>sach</code> appears at 1A (the name), 7B (the category “Sách &amp; tài liệu”) and 17C (the description “Viết mã sạch”: <em>sạch</em> and <em>sách</em> fold to the same word — the limit of S1 again).</p>
${qo('S2K', 'S2L')}
<p>2.502 matches, 2.252 of them active. <code>ts_headline</code> marks the matched words in the <em>original</em> text, accents included. Now the category weight:</p>
${qo('S2M')}
<p>The two books with “Giáo trình” in their name rank 1,0 (weight A); the four others of the category are found through weight B (0,40). Without the category in the document, “giao trinh” would miss four of the six. The description answers questions no name does:</p>
${qo('S2N')}
<p>The Deli is found too — its description says it is <em>not</em> allowed in the exam room. Full-text search matches words, not meaning; a filter on <code>attrs @&gt; '{"exam_ok": true}'</code> is the precise answer. What customers type, and what PostgreSQL searches:</p>
${qo('S2O', 'S2P')}
<p>Finding is fast (the Bitmap Index Scan returns 2.502 rows in ${idxMs('S2P')} ms); <strong>ranking</strong> every match and sorting is most of the ${ms('S2P')} ms. That is the cost model of full-text in PostgreSQL: it ranks <em>all</em> matches, it cannot stop early. Keep the category part fresh when a category is renamed:</p>
${qo('S2Q', 'S2R', 'S2S', 'S2T')}
<p>And the proof that a stock change does not touch the document — <code>EXPLAIN ANALYZE</code> lists the triggers that ran:</p>
${qo('S2U', 'S2V')}

<h4>S3 — typos and autocomplete with pg_trgm</h4>
${qo('S3A')}
<p>Full-text compares whole words: “casoi” is not a word of any document. Trigrams compare pieces of three letters (lesson 13.4). They need a folded name — a generated column, now that <code>f_unaccent</code> is IMMUTABLE:</p>
${qo('S3B', 'S3C', 'S3D', 'S3E', 'S3F')}
<p class="meo">💡 <code>similarity</code> compares the query with the <em>whole</em> name, so a long name scores low; <code>word_similarity</code> asks “how well does the query match the best part of the name?” — the right question for a search box. Both thresholds are settings: <code>%</code> uses <code>pg_trgm.similarity_threshold</code> (0,3), <code>&lt;%</code> uses <code>pg_trgm.word_similarity_threshold</code> (0,6). At 0,6 the typo finds nothing.</p>
${qo('S3G', 'S3H')}
<p>“Contains” for the search box — <code>LIKE '%…%'</code> on the folded column, with a trigram GIN:</p>
${ans('en', 'S3 (GIN)', ['S3I', 'S3J', 'S3K', 'S3L'], `The Seq Scan reads all ${trang('S3I')} pages (${ms('S3I')} ms); the trigram GIN finds the 1.251 rows in ${idxMs('S3K')} ms. The fuzzy query uses the same index through <code>%&gt;</code> (the commutator of <code>&lt;%</code>).`)}
<p>Autocomplete is a different question: not “every match” but “the 8 nearest names”. GIN cannot order by distance; <strong>GiST</strong> can, walking the nearest entries first and stopping at the LIMIT. <strong>New: <code>&lt;&lt;-&gt;</code></strong> is the word distance, 1 − word_similarity:</p>
${ans('en', 'S3 (GiST KNN)', ['S3M', 'S3N', 'S3O'], `<strong>Index Scan using product_name_gist</strong> with <code>Order By</code>: 8 rows, ${trang('S3N')} pages, ${ms('S3N', 2)} ms.`)}
${bay('Trap — the operands the other way round.', `<code>name_fold &lt;&lt;-&gt; 'thien long tl'</code> measures how well the <em>name</em> fits inside the query — a different function, which the index does not support: a Seq Scan computing 54.048 distances, then a sort (${ms('S3P', 0)} ms):`, ['S3P'])}
${qo('S3Q', 'S3R')}
<p>The price list of search: the GiST is the biggest index (11 MB, more than half the table), the trigram GIN 4 MB, the full-text GIN 2,6 MB, the attribute GIN 1 MB. Build what a screen needs — not all of them by default.</p>

<h4>S4 — one function for the search box</h4>
<p class="meo">💡 Full-text first (precise, ranked by weight); when it finds nothing, trigram (forgiving). In PL/pgSQL, <code>RETURN QUERY</code> appends rows and sets <code>FOUND</code>. <strong>New: <code>CREATE FUNCTION … SET</code></strong> gives the function its own settings while it runs — the threshold here, and (see Prisma below) the search path.</p>
${ans('en', 'S4', ['S4A', 'S4B', 'S4C', 'S4D', 'S4E', 'S4F'], 'Three answers through full-text (“giáo trình” typed <em>with</em> accents works the same), two through trigram, and an honest empty result for nonsense. On ties the order is by id, so the shop’s own products (ids 1–48) come before the listings.')}
${qo('S4G', 'S4H', 'S4I', 'S4J')}
<p><code>EXPLAIN</code> sees a black box: the plan inside a PL/pgSQL function is not shown. To tune it, run its two queries by themselves (as in S2 and S3).</p>

<h4>In a real Node app — what Prisma reads, sends and breaks</h4>
<p><code>prisma db pull</code> on the finished table:</p>
${code(PRISMA_PULL, 'ts')}
<p>Three things to notice. <code>search_tsv</code> is <code>Unsupported("tsvector")</code>: Prisma will never read or write it — fine, the trigger owns it. <code>name_fold</code> looks like a column with a default, but it is GENERATED: writing to it from Prisma fails. And the expression index <code>product_pages</code> cannot be described in the schema at all: it lives in a hand-written migration. Now the queries (real log):</p>
${code(PRISMA_CODE, 'ts')}
${out(PRISMA_LOG)}
<p>Prisma’s <code>path</code> filters compile to <code>attrs #&gt; ARRAY[…]</code> — an expression the GIN on <code>attrs</code> does not index. The generic plans of lesson 10.4 make it visible:</p>
${out(PRISMA_PLAN)}
<p>So the filter panel goes through <code>$queryRaw</code> with <code>@&gt;</code> — still a parameter, never string concatenation. And the search box, first version of <code>search_products</code> (without the <code>SET search_path</code> line):</p>
${out(PRISMA_ERR)}
${bay('Trap — the app’s search path is not yours.', 'In psql we set <code>search_path = shop, public</code>. Prisma connects with <code>?schema=shop</code>, i.e. <code>search_path = shop</code>, and inside the function <code>word_similarity</code> and <code>&lt;%</code> (in public) are not found — but only in the fuzzy branch, so “but bi thien long” works and “casoi fx 580” fails. Pin the path on the function (<code>SET search_path = shop, public</code>), as lesson 12.1 did for SECURITY DEFINER. Then:', [])}
${out(PRISMA_OK)}

<h4>When is PostgreSQL search not enough?</h4>
<ul>
<li><strong>Stay in PostgreSQL</strong> while the catalogue fits (tens of thousands to a few million rows), the result sets are small after filters, and one transaction keeps product and search in sync — no second system to feed, monitor and repair.</li>
<li><strong>Move to Meilisearch / Elasticsearch / OpenSearch</strong> when you need relevance PostgreSQL does not have (BM25 scoring, typo tolerance on every word, synonyms, Vietnamese word segmentation via plugins), facet counts on huge result sets, “search as you type” at high traffic, or when ranking every match (S2: 2.252 rows for one query) becomes the bottleneck. The price: a second copy of the data, kept in sync by a queue or by logical decoding, and eventual consistency.</li>
</ul>

<h3>5 · Self-check — your end state must match</h3>
${qo('SC1', 'SC2', 'SC3')}
<ol>
<li>Why did <code>p.attrs || f.doc-&gt;'specs'</code> delete brand, color and tags — and why did the UPDATE not fail?</li>
<li>The filter <code>attrs-&gt;&gt;'tip_mm' = '0.5'</code> returns 6.255 rows, <code>attrs @&gt; '{"tip_mm": 0.5}'</code> returns 7.506. Which is right, and why?</li>
<li>Why is the search document a trigger-maintained column and not a generated column, and why the second trigger on <code>category</code>?</li>
</ol>
${details('Answers', '<ol><li><code>||</code> and <code>-&gt;</code> have the same precedence and group left to right: the expression is <code>(p.attrs || f.doc) -&gt; \'specs\'</code>, the specs object alone. It is still a valid JSON object, so no constraint or type check complains — a silent data loss. Parentheses.</li><li>The containment test: JSON compares numbers as numbers (0.50 = 0.5). <code>-&gt;&gt;</code> returns text, and the text \'0.50\' of CT0602 (and its 1.250 listings) is not \'0.5\'.</li><li>A generated column can only read its own row; the category name is in another table (“cannot use subquery in column generation expression”). A BEFORE trigger can look it up. When a category is renamed, the products’ documents still hold the old name, so the AFTER UPDATE trigger on category touches them (<code>SET category_id = category_id</code>) and the product trigger rebuilds them.</li></ol>')}
${qo('SC4')}

<h3>6 · Full solution</h3>
${details('Show the whole lab7-solution.sql', code(SOL))}

<h3>7 · Traps</h3>
<div class="pitfall"><p><strong>Importing JSON without a survey</strong> — a jsonb column accepts anything valid. Count keys and <code>jsonb_typeof</code> first; guard the column with CHECKs after.</p></div>
<div class="pitfall"><p><strong><code>a || b -&gt; 'k'</code></strong> — same precedence, left to right: it is <code>(a || b) -&gt; 'k'</code>. Parenthesise every mix of <code>||</code>, <code>-&gt;</code>, <code>-</code>, <code>#-</code>.</p></div>
<div class="pitfall"><p><strong>JSON null vs SQL NULL</strong> — <code>-&gt;&gt;</code> gives NULL for both; <code>?</code> and <code>@&gt; '{"k": null}'</code> tell them apart. <code>jsonb_strip_nulls</code> removes JSON nulls.</p></div>
<div class="pitfall"><p><strong>jsonb_set with a NULL value</strong> — the whole document becomes NULL. Use <code>jsonb_set_lax</code>, or <code>coalesce</code>, and keep attrs NOT NULL.</p></div>
<div class="pitfall"><p><strong>Comparing <code>-&gt;&gt;</code> text</strong> — '0.50' ≠ '0.5', '48' &gt; '100'. Use <code>@&gt;</code> for equality, a cast for ranges.</p></div>
<div class="pitfall"><p><strong><code>?</code> for a boolean filter</strong> — it tests the key, not the value, and <code>jsonb_path_ops</code> cannot answer it. <code>@&gt; '{"refill": true}'</code>.</p></div>
<div class="pitfall"><p><strong>Prisma <code>path</code> filters</strong> — compile to <code>#&gt;</code>: no GIN. Use <code>$queryRaw</code> with <code>@&gt;</code> for indexed filters.</p></div>
<div class="pitfall"><p><strong>JSON_TABLE’s default NULL ON ERROR</strong> — bad values disappear silently. <code>ERROR ON ERROR</code> for exports that must be complete.</p></div>
<div class="pitfall"><p><strong>unaccent in an index or generated column</strong> — STABLE ⇒ refused. Wrap it in an IMMUTABLE function that names the dictionary.</p></div>
<div class="pitfall"><p><strong>Expecting Vietnamese word segmentation</strong> — “học sinh” is two words; “ban” is bàn, bản and bạn at once. Rank, use phrases, or move to an engine with a Vietnamese analyzer.</p></div>
<div class="pitfall"><p><strong><code>col &lt;&lt;-&gt; 'q'</code> instead of <code>'q' &lt;&lt;-&gt; col</code></strong> — a different function, no index, a full sort.</p></div>
<div class="pitfall"><p><strong>A function that relies on the caller’s search_path</strong> — works in psql, fails in the app. <code>SET search_path</code> on the function.</p></div>

<h3>8 · Extra challenge — and next</h3>
<ul>
<li><strong>Challenge 1</strong> — make <code>search_products</code> rank the shop’s own products and in-stock listings first on equal scores, without losing the index (hint: the ORDER BY of the first query).</li>
<li><strong>Challenge 2</strong> — facet counts: next to the results, show “Thiên Long (2.252) · Deli (…)” for the brands of the matches, in one query (<code>GROUP BY attrs-&gt;&gt;'brand'</code> over the full-text matches). Measure it on “but” — and see why big result sets push shops towards a search engine.</li>
<li><strong>Challenge 3</strong> — the expression index <code>product_pages</code> indexes 60.048 rows although most have no pages. Rewrite it as a partial index and find out what the query must say for the planner to use it.</li>
</ul>
<p>Chapter 14 leaves the data model and looks at the server: connections and pooling (why the app’s 10 connections matter), VACUUM and bloat — the 60.048 rows you just updated twice left dead tuples behind — and monitoring. Lab 8, after Chapter 15, backs CT Shop up and replicates it. <code>lab8-start.sql</code> rebuilds the shop at its standard size; the marketplace of this lab can go.</p>
</div>
`;

const VI = `
<div class="ml-vi">
<span class="eyebrow">Lab 7 · CT Shop · sau Chương 13</span>
<h2>Trang danh mục lọc được, ô tìm kiếm biết tha lỗi</h2>
<p class="lead">Lab 6 làm cho bước thanh toán đúng khi nhiều người mua cùng lúc. Lab này làm nửa còn lại của một cửa hàng: <em>tìm</em> được hàng. Nhà cung cấp gửi thông số kỹ thuật của mọi sản phẩm dưới dạng JSON, sàn (marketplace) sắp mở với 60.000 tin đăng của người bán, còn khách thì gõ “but bi thien long” không dấu, viết hoa, gõ sai. Bạn sẽ nhập và làm sạch thông số vào <code>product.attrs</code>, dựng bảng lọc vẫn nhanh khi dữ liệu lớn, đưa kế toán một bảng phẳng, và viết đúng một hàm mà app gọi khi khách bấm Enter trong ô tìm kiếm.</p>

<h3>1 · Đề bài</h3>
<p>Phiếu việc của nhóm CT Shop:</p>
<ul>
<li><strong>Bảng thông số</strong> của nhà cung cấp tới dưới dạng 48 tài liệu JSON (bảng <code>spec_feed</code>). Nhập vào <code>product.attrs</code> — và bảo đảm từ nay không tài liệu xấu nào lọt vào được nữa.</li>
<li>Mỗi trang danh mục cần một <strong>bảng lọc</strong>: loại mực và cỡ ngòi cho bút, số trang cho vở, “được mang vào phòng thi” cho máy tính…</li>
<li>Tuần sau <strong>sàn</strong> mở: 60.000 tin đăng từ mười người bán. Bộ lọc vẫn phải nhanh.</li>
<li><strong>Kế toán</strong> muốn thuộc tính ở dạng bảng thường (một tệp CSV mở được), mỗi nhãn một dòng.</li>
<li><strong>Ô tìm kiếm</strong>: “but bi thien long” phải ra “Bút bi Thiên Long”, “giao trinh” phải ra mọi giáo trình, và “casoi fx 580” (gõ sai) vẫn phải ra Casio FX-580VN X. Một hàm, kết quả có xếp hạng.</li>
</ul>
<p>Công cụ: Chương 13 — <code>jsonb</code> và các toán tử, <code>jsonb_set</code>, <code>JSON_TABLE</code> (13.1), GIN và <code>jsonb_path_ops</code>, B-tree biểu thức (13.2), <code>tsvector</code>/<code>tsquery</code>, trọng số, xếp hạng, <code>unaccent</code> (13.3), <code>pg_trgm</code> và GiST KNN (13.4) — cộng hàm, trigger, view của Chương 12. Vài mảnh mới nhỏ được giảng ngay chỗ dùng: <code>IS JSON OBJECT</code>, <code>jsonb_strip_nulls</code>, <code>jsonb_set_lax</code>, <code>NESTED PATH</code>, <code>ERROR ON ERROR</code>, <code>ts_debug</code>, <code>CREATE FUNCTION … SET</code>, <code>\\copy … TO</code> và toán tử khoảng cách từ <code>&lt;&lt;-&gt;</code>.</p>
<p>Chương 13 chạy ví dụ trên một bản chép 48 sản phẩm. Ở đây mọi thứ diễn ra trên chính bảng của CT Shop — với ràng buộc, cây danh mục, 60.000 dòng của sàn và một app (Prisma) phía trên — và dữ liệu bẩn, đúng như dữ liệu thật.</p>

<h3>2 · Yêu cầu và tiêu chí đạt</h3>
<ol>
<li><strong>J1</strong> — khảo sát nguồn trước khi nhập: các khoá, kiểu JSON, sku lạ, sản phẩm không có thông số, bộ lọc của từng danh mục.</li>
<li><strong>J2</strong> — gộp thông số vào <code>attrs</code>; canh cột bằng ràng buộc CHECK (chúng thất bại trước — tìm hiểu vì sao, sửa, rồi mới thêm được); bẫy NULL của <code>jsonb_set</code>.</li>
<li><strong>J3</strong> — sàn: 60.000 tin đăng; bộ lọc “gel · 0.5 mm · tím” với chỉ mục GIN, trước/sau; các bẫy so chữ của <code>-&gt;&gt;</code>; lọc khoảng số trang.</li>
<li><strong>J4</strong> — bảng thuộc tính cho kế toán bằng <code>JSON_TABLE</code>, mỗi nhãn một dòng; dữ liệu xấu làm gì với nó.</li>
<li><strong>S1</strong> — cấu hình tìm kiếm <code>vn_unaccent</code> và hàm <code>f_unaccent</code> IMMUTABLE.</li>
<li><strong>S2</strong> — tài liệu tìm kiếm: tên (A) + danh mục (B) + thương hiệu và mô tả (C), giữ bằng trigger; GIN; <code>websearch_to_tsquery</code>, <code>ts_rank</code>, <code>ts_headline</code>.</li>
<li><strong>S3</strong> — gõ sai và gợi ý khi gõ bằng <code>pg_trgm</code>: ngưỡng, GIN cho “chứa”, GiST cho “gần nhất”.</li>
<li><strong>S4</strong> — <code>search_products(q)</code>: tìm toàn văn trước, trigram khi toàn văn không ra gì; gọi từ Prisma.</li>
</ol>
<div class="callout ok"><p><strong>Đạt khi:</strong> khảo sát tìm ra <strong>4</strong> giá trị sai kiểu + <strong>1</strong> JSON null, sku lạ <strong>CT1207</strong> và sản phẩm không có thông số <strong>CT0906</strong> · <code>product_attrs_object</code> và <code>product_attrs_types</code> có mặt và từ chối <code>"300 trang"</code> lẫn <code>[]</code> · bộ lọc “gel · 0.5 · tím” là <strong>Bitmap Index Scan on product_attrs_gin</strong>, đọc <strong>500</strong> trang heap thay vì 2.546 · view xuất ra <strong>55</strong> dòng cho 48 sản phẩm · “but bi thien long” tìm toàn văn ra <strong>2.252</strong> tin đang bán, “giao trinh” xếp 2 cuốn có chữ đó trong tên lên trên 4 cuốn còn lại của danh mục · <code>search_products</code> trả lời “casoi fx 580” (<strong>1.001</strong> kết quả, <code>fuzzy</code>) và “thien lomg” · cùng lời gọi đó chạy được từ Prisma.</p></div>
<p><strong>Thời gian trên máy bạn sẽ khác</strong>. Hãy chấm bằng những thứ không đổi: số đếm, nút kế hoạch, số trang trong <code>Buffers</code>, kích thước chỉ mục và tỉ lệ trước/sau.</p>
<h4>Thang chấm (10 điểm)</h4>
${RUBRIC(true)}

<h3>3 · Tệp tải về và chuẩn bị</h3>
<div class="callout"><p><code>pgdemo</code> là tên container PostgreSQL 17 của <em>bạn</em>. Nếu bạn dựng theo bài 0.3 thì nó tên <code>pg17</code>: hoặc thay <code>pgdemo</code> bằng <code>pg17</code> trong mọi lệnh bên dưới, hoặc đổi tên một lần bằng <code>docker rename pg17 pgdemo</code>.</p></div>
${FILES(true)}
<p>Tệp start dựng lại shop chuẩn (đúng các dòng của Lab 1–4 và 6) và thêm một bảng tạm, <code>spec_feed</code>: thứ nhà cung cấp gửi, mỗi dòng trong tệp của họ là một tài liệu JSON. Nó không thuộc 8 bảng của mô hình; tệp đáp án xoá nó ở cuối.</p>
${out(SETUP)}
<p>Ba tài liệu của nguồn, đúng như lúc nhận — nhìn kỹ các giá trị:</p>
${out(FEED)}
<p>Rồi mở psql và chuẩn bị phiên. Hai extension đặt trong <code>public</code>, nên search_path phải có nó:</p>
${code(PREP)}
${out(O.EXT1 + '\n' + O.EXT2)}

<h3>4 · Từng bước</h3>

<h4>J1 — khảo sát nguồn trước khi nhập bất cứ thứ gì</h4>
<p class="meo">💡 <code>jsonb_each(doc-&gt;'specs')</code> biến mỗi cặp khoá/giá trị của một tài liệu thành một dòng; nhóm theo khoá và theo <code>jsonb_typeof(giá trị)</code>. Khoá nào tới với hai kiểu sẽ làm vỡ mọi bộ lọc và mọi phép ép kiểu dựng trên nó.</p>
${ans('vi', 'J1', ['J1A', 'J1B', 'J1C'], 'Hai mươi khoá; bốn khoá tới với hai kiểu. Thủ phạm: cỡ ngòi gửi dạng chuỗi <code>"0.7"</code>, số trang là <code>"96 trang"</code> và <code>"200"</code>, một máy tính có <code>solar</code> là <code>"có"</code> thay vì <code>true</code> — và một <code>gsm</code> là JSON <code>null</code>. Không gì bị từ chối lúc nhận: cột <code>jsonb</code> nhận mọi JSON hợp lệ.')}
<p>Hai phép kiểm nữa mà lần nhập nào cũng cần — dòng ở bên này không có bạn ở bên kia:</p>
${qo('J1D', 'J1E')}
<p>CT1207 là cuốn sách shop chưa bán (lần nhập phải bỏ qua nó chứ không được hỏng); cuốn Moleskine không có thông số (bộ lọc của nó sẽ trống — báo cho bộ phận mua hàng). Cuối cùng, khoá nào thuộc danh mục nào? Danh sách đó <em>chính là</em> bảng lọc của từng trang danh mục:</p>
${qo('J1F')}

<h4>J2 — gộp vào attrs, rồi canh cột</h4>
<p>Cách gộp hiển nhiên là “thuộc tính cũ <code>||</code> thông số mới”. Thử trong một giao dịch và nhìn một sản phẩm:</p>
${qo('J2A', 'J2B')}
${bay('Bẫy — độ ưu tiên toán tử.', 'brand, color và tags biến mất: sản phẩm giờ <em>chỉ còn</em> thông số. Trong PostgreSQL <code>||</code> và <code>-&gt;</code> cùng độ ưu tiên và kết hợp từ trái sang phải, nên <code>p.attrs || f.doc-&gt;\'specs\'</code> nghĩa là <code>(p.attrs || f.doc) -&gt; \'specs\'</code>. ROLLBACK, rồi xem trên hai hằng:', ['J2C'])}
<p>Chiều ngược lại cũng cắn: <code>-</code> gắn <em>chặt hơn</em> <code>-&gt;</code>, nên <code>doc-&gt;'specs' - 'desc'</code> thử tính <code>'specs' - 'desc'</code> trước:</p>
${out(FEED_ERR)}
<p>Quy tắc dễ nhớ: hễ <code>||</code>, <code>-</code>, <code>#-</code> gặp <code>-&gt;</code> / <code>-&gt;&gt;</code> là thêm ngoặc. Lệnh gộp đúng:</p>
${qo('J2D', 'J2E')}
<p><strong>UPDATE 47</strong> (CT1207 không có sản phẩm, Moleskine không có tài liệu). Giờ bảo vệ cột. <strong>Mới: <code>IS JSON OBJECT</code></strong> (SQL/JSON, PostgreSQL 16+) chỉ đúng với một đối tượng JSON — không phải mảng, không phải giá trị đơn. Và một CHECK về kiểu của các khoá mà bộ lọc dùng. Để ý mẹo: <code>attrs-&gt;'pages'</code> là NULL của SQL khi thiếu khoá, <code>jsonb_typeof(NULL)</code> là NULL, và CHECK chỉ thất bại khi kết quả là <em>false</em> — nên sản phẩm không có số trang vẫn qua.</p>
${qo('J2F', 'J2G')}
<p class="meo">💡 CHECK thứ hai thất bại vì tài liệu bẩn giờ đã nằm trong bảng. Tìm các dòng bằng đúng các điều kiện đó, rồi sửa từng giá trị bằng thay đổi nhỏ nhất: <code>jsonb_set</code> thay một khoá và giữ nguyên phần còn lại của tài liệu.</p>
${ans('vi', 'J2 (sửa)', ['J2H', 'J2I', 'J2J', 'J2K'], '<code>substring(… FROM \'[0-9]+\')</code> giữ lại phần số của “96 trang”; <code>to_jsonb(…::int)</code> biến nó lại thành một <em>số</em> JSON. Với <code>solar</code> thì luật nghiệp vụ quyết: “có”, “yes” và “true” nghĩa là true.')}
<p><code>gsm</code> của CT0803 là trường hợp khác: nó là JSON <code>null</code>, không phải NULL của SQL. <code>-&gt;&gt;</code> che mất khác biệt; <code>?</code> thì không:</p>
${qo('J2L')}
<p><strong>Mới: <code>jsonb_strip_nulls</code></strong> xoá mọi khoá có giá trị JSON null. Còn nhà cung cấp viết <code>colour</code>: chuyển giá trị bằng <code>-</code> (xoá một khoá) và <code>||</code> (thêm một khoá):</p>
${qo('J2M', 'J2N', 'J2O')}
<p>Từ giờ tài liệu xấu bị chặn ngay ở cửa — bởi chính cơ sở dữ liệu, bất kể app, script hay phiên psql nào gửi tới:</p>
${qo('J2P', 'J2Q')}
<p>Bộ phận marketing muốn gắn nhãn “ôn thi” cho máy tính được mang vào phòng thi và bút chì 2B — nối thêm vào mảng bằng <code>jsonb_set(attrs, '{tags}', (attrs-&gt;'tags') || '["ôn thi"]')</code>:</p>
${qo('J2S')}
${bay('Bẫy — jsonb_set là hàm STRICT.', 'Một app “bỏ giảm giá” bằng cách gửi NULL. <code>to_jsonb(NULL)</code> là NULL của SQL, hàm STRICT nhận NULL thì trả NULL — <em>cả</em> tài liệu. Ở đây NOT NULL của attrs cứu sản phẩm; với cột cho phép NULL thì nó lặng lẽ mất sạch thuộc tính:', ['J2U'])}
<p><strong>Mới: <code>jsonb_set_lax</code></strong> cho bạn quyết NULL nghĩa là gì: mặc định nó lưu JSON null; với <code>\'delete_key\'</code> nó xoá khoá:</p>
${qo('J2V', 'J2W')}

<h4>J3 — sàn mở cửa: bộ lọc trên 60.000 tin đăng</h4>
<p>Mười người bán đăng cùng 48 sản phẩm, mỗi người viết tiêu đề một kiểu — không dấu, thêm “chính hãng”, viết hoa — và mỗi tin đăng thừa hưởng thuộc tính đã làm sạch cộng với người bán và một màu. 10 % bị tắt (<code>is_active = false</code>):</p>
${qo('J3A', 'J3B', 'J3C', 'J3D')}
<p>Giờ trang “Bút bi” với ba ô đã tích: mực gel, 0.5 mm, màu tím. Một phép kiểm chứa mang theo cả bảng lọc:</p>
${qo('J3E')}
<p class="meo">💡 <code>@&gt;</code> là toán tử mà chỉ mục GIN trả lời được (bài 13.2). <code>jsonb_path_ops</code> lưu một mã băm cho mỗi đường dẫn-và-giá trị, nên nhỏ hơn <code>jsonb_ops</code> mặc định — nhưng chỉ hỗ trợ <code>@&gt;</code>, <code>@?</code> và <code>@@</code>.</p>
${ans('vi', 'J3 (chỉ mục)', ['J3G', 'J3H', 'J3I', 'J3J'], `<strong>Bitmap Index Scan on product_attrs_gin</strong>: chỉ mục trao đúng 500 dòng khớp, bước đọc heap chỉ đọc 500 trang thay vì 2.546, ${ms('J3E')} ms → ${ms('J3H', 2)} ms. Chỉ mục khoảng 1 MB bên cạnh bảng 20 MB. Truy vấn cuối cho thấy nó làm gì: ba danh sách dòng (2.502, 7.506, 12.005), lấy giao — 500 dòng. Để ý <code>Recheck Cond</code>: GIN với mã băm đường dẫn là “có thể khớp nhầm”, nên PostgreSQL kiểm lại từng dòng.`)}
<p>Bỏ tích màu thì kết quả lớn gấp mười:</p>
${qo('J3K')}
<p>Vẫn dùng chỉ mục, nhưng giờ là 2.502 ứng viên trên 1.292 trang — nửa bảng. Thêm ít dòng khớp nữa thì bộ lập kế hoạch sẽ quay về Seq Scan, và quay về là đúng: chỉ mục chỉ đáng khi nó cho PostgreSQL <em>bỏ qua</em> phần lớn các trang.</p>
${bay('Bẫy — “có khoá” không phải “bằng true”, và jsonb_path_ops không có ?.', 'Bộ lọc “thay ruột được” viết thành <code>attrs ? \'refill\'</code> đếm luôn cả bút có <code>"refill": false</code>, và chỉ mục path_ops không giúp được:', ['J3L', 'J3M', 'J3N'])}
${bay('Bẫy — ->> trả về chữ.', 'Nhà cung cấp viết 0.50 cho Pentel A255. Là số JSON thì 0.50 = 0.5; là chữ thì \'0.50\' ≠ \'0.5\':', ['J3O', 'J3P'])}
<p>Mất 1.251 dòng vì so chữ. Thứ tự chữ cũng làm hỏng phép so khoảng:</p>
${qo('J3Q')}
<p>Cuốn vở 48 trang “có hơn 100 trang” vì <code>\'4\' &gt; \'1\'</code>. Ép sang số — CHECK của J2 bảo đảm phép ép không bao giờ lỗi. So khoảng không phải phép chứa, nên GIN không phục vụ được; <strong>B-tree trên biểu thức</strong> thì được (bài 13.2):</p>
${qo('J3R', 'J3S')}

<h4>J4 — bảng thuộc tính phẳng cho kế toán</h4>
<p class="meo">💡 <code>JSON_TABLE</code> (PostgreSQL 17, bài 13.1) biến mỗi tài liệu thành các cột có kiểu. <strong>Mới: <code>NESTED PATH '$.tags[*]'</code></strong> cho mỗi phần tử của mảng một dòng. Đặt nó trong một view: kế toán đọc view, không bao giờ đọc JSON.</p>
${ans('vi', 'J4', ['J4V', 'J4A', 'J4B', 'J4C'], 'CT0601 và CT1001 hiện hai lần — mỗi nhãn một dòng. <strong>Mới: <code>\\copy (truy vấn) TO \'tệp\' WITH (FORMAT csv, HEADER)</code></strong> là anh em xuất của <code>\\copy … FROM</code> ở Lab 2: psql ghi tệp lên máy nơi psql chạy (ở đây là trong container: <code>docker cp pgdemo:/tmp/lab7-attrs.csv .</code>).')}
${bay('Bẫy — JSON_TABLE nuốt giá trị xấu.', 'Chạy nó trên nguồn thô: giá trị không ép kiểu được thành NULL mà không một lời báo (<code>NULL ON ERROR</code> là mặc định). “96 trang” biến mất, “200” được nhận im lặng, “có” biến mất:', ['J4D'])}
<p>Đòi báo lỗi thì có lỗi — dùng <code>ERROR ON ERROR</code> khi tệp xuất phải đủ hoặc phải hỏng hẳn:</p>
${qo('J4E')}

<h4>S1 — cấu hình tìm kiếm cho tiếng Việt không dấu</h4>
${qo('S1A')}
<p>Cấu hình <code>simple</code> giữ nguyên dấu, nên “but bi” không khớp “bút bi”. Dựng cấu hình của bài 13.3 cho shop: chép <code>simple</code>, rồi cho mọi từ đi qua <code>unaccent</code> trước:</p>
${ans('vi', 'S1 (vn_unaccent)', ['S1B', 'S1C', 'S1D', 'S1E'], '<strong>Mới: <code>ts_debug</code></strong> cho xem đường ống từng token: “Bút” và “Thiên” là token <code>word</code> (chữ không phải ASCII) nên đi qua unaccent rồi simple; “bi”, “Long”, “TL” là <code>asciiword</code> nên đi thẳng vào simple. Dấu và chữ hoa không còn quan trọng: hai cách viết cho cùng một tài liệu. Để ý mã model: “TL-027” thành hai lexeme, <code>tl</code> và <code>-027</code> — mã model là việc của trigram (S3).')}
<p>Biết giới hạn trước khi hứa gì với bên kinh doanh:</p>
${qo('S1F')}
<p>PostgreSQL không tách từ tiếng Việt: “học sinh” là hai từ, nên các từ “sinh hoc” khớp một văn bản nói về <em>học sinh</em> (chỉ tìm cụm mới giữ thứ tự). Và bỏ dấu thì gộp các từ khác nhau: “ban” ra cả <em>bàn</em> (bàn học) lẫn <em>bản</em> (bản in) — khớp nhiều hơn, kém chính xác hơn. Xếp hạng (S2) đưa kết quả đúng lên trước.</p>
<p>Cột trigram ở S3 cũng cần tên đã bỏ dấu — mà cột generated, cũng như chỉ mục, chỉ nhận hàm IMMUTABLE:</p>
${qo('S1G', 'S1H')}
<p><code>unaccent</code> là STABLE: nó tìm từ điển qua search_path, thứ có thể đổi. Hàm bọc của bài 13.4 ghi rõ tên từ điển, nên không còn gì phải tìm:</p>
${qo('S1I', 'S1J')}

<h4>S2 — tài liệu tìm kiếm: tên, danh mục, thương hiệu và mô tả</h4>
<p>Khách gõ cả chữ của danh mục: “giáo trình” có trong tên của 2 cuốn nhưng là danh mục của 6 cuốn. Tài liệu tìm kiếm nên chứa tên (trọng số A), đường danh mục (B), thương hiệu và mô tả của nhà cung cấp (C). Lần thử đầu — cột generated như bài 13.3:</p>
${qo('S2A')}
${bay('Bẫy — cột generated chỉ thấy dòng của chính nó.', 'Không truy vấn con, không bảng khác. Tên danh mục nằm ở <code>category</code>. Lời giải của Chương 12: một cột thường do trigger BEFORE điền. Hai chi tiết quan trọng: <code>UPDATE OF name, category_id, attrs</code> — lúc thanh toán chỉ đổi <code>stock</code> thì không được dựng lại tài liệu — và một trigger thứ hai trên <code>category</code>, vì đổi tên danh mục làm đổi tài liệu của các sản phẩm trong đó.', [])}
${ans('vi', 'S2 (trigger + GIN)', ['S2B', 'S2C', 'S2D', 'S2F', 'S2G'], `Lệnh điền lại <code>UPDATE product SET name = name</code> bắn trigger một lần mỗi dòng: 60.048 tài liệu trong ${tg('S2F')} giây ở lần chạy này. Chỉ mục GIN mất ${tg('S2G')} giây.`)}
${qo('S2J')}
<p>Đọc tài liệu: <code>sach</code> có ở 1A (tên), 7B (danh mục “Sách &amp; tài liệu”) và 17C (mô tả “Viết mã sạch”: <em>sạch</em> và <em>sách</em> bỏ dấu thành cùng một từ — lại là giới hạn của S1).</p>
${qo('S2K', 'S2L')}
<p>2.502 dòng khớp, 2.252 dòng đang bán. <code>ts_headline</code> đánh dấu từ khớp trên văn bản <em>gốc</em>, còn nguyên dấu. Giờ đến trọng số danh mục:</p>
${qo('S2M')}
<p>Hai cuốn có “Giáo trình” trong tên xếp hạng 1,0 (trọng số A); bốn cuốn còn lại của danh mục được tìm thấy nhờ trọng số B (0,40). Không có danh mục trong tài liệu, “giao trinh” sẽ bỏ sót bốn trên sáu cuốn. Mô tả trả lời những câu mà không tên nào trả lời:</p>
${qo('S2N')}
<p>Máy Deli cũng ra — mô tả của nó nói nó <em>không</em> được mang vào phòng thi. Tìm toàn văn khớp chữ, không hiểu nghĩa; bộ lọc <code>attrs @&gt; '{"exam_ok": true}'</code> mới là câu trả lời chính xác. Khách gõ gì, PostgreSQL tìm gì:</p>
${qo('S2O', 'S2P')}
<p>Tìm thì nhanh (Bitmap Index Scan trả 2.502 dòng trong ${idxMs('S2P')} ms); <strong>xếp hạng</strong> mọi dòng khớp rồi sắp xếp mới là phần lớn của ${ms('S2P')} ms. Đó là mô hình chi phí của tìm toàn văn trong PostgreSQL: nó xếp hạng <em>mọi</em> dòng khớp, không dừng sớm được. Giữ phần danh mục luôn mới khi danh mục đổi tên:</p>
${qo('S2Q', 'S2R', 'S2S', 'S2T')}
<p>Và bằng chứng rằng đổi tồn kho không đụng tới tài liệu — <code>EXPLAIN ANALYZE</code> liệt kê các trigger đã chạy:</p>
${qo('S2U', 'S2V')}

<h4>S3 — gõ sai và gợi ý khi gõ với pg_trgm</h4>
${qo('S3A')}
<p>Tìm toàn văn so cả từ: “casoi” không phải từ nào trong tài liệu. Trigram so từng mẩu ba chữ cái (bài 13.4). Chúng cần tên đã gập dấu — một cột generated, giờ <code>f_unaccent</code> đã IMMUTABLE:</p>
${qo('S3B', 'S3C', 'S3D', 'S3E', 'S3F')}
<p class="meo">💡 <code>similarity</code> so câu hỏi với <em>cả</em> tên, nên tên dài bị điểm thấp; <code>word_similarity</code> hỏi “câu hỏi khớp phần giống nhất của tên tới mức nào?” — đúng câu hỏi của ô tìm kiếm. Cả hai ngưỡng là tham số: <code>%</code> dùng <code>pg_trgm.similarity_threshold</code> (0,3), <code>&lt;%</code> dùng <code>pg_trgm.word_similarity_threshold</code> (0,6). Ở 0,6 lỗi gõ không ra gì.</p>
${qo('S3G', 'S3H')}
<p>“Chứa” cho ô tìm kiếm — <code>LIKE '%…%'</code> trên cột đã gập dấu, với GIN trigram:</p>
${ans('vi', 'S3 (GIN)', ['S3I', 'S3J', 'S3K', 'S3L'], `Seq Scan đọc cả ${trang('S3I')} trang (${ms('S3I')} ms); GIN trigram tìm 1.251 dòng trong ${idxMs('S3K')} ms. Truy vấn gõ sai dùng cùng chỉ mục qua <code>%&gt;</code> (toán tử đảo của <code>&lt;%</code>).`)}
<p>Gợi ý khi gõ là câu hỏi khác: không phải “mọi dòng khớp” mà là “8 tên gần nhất”. GIN không sắp được theo khoảng cách; <strong>GiST</strong> thì được, đi từ mục gần nhất và dừng ở LIMIT. <strong>Mới: <code>&lt;&lt;-&gt;</code></strong> là khoảng cách từ, bằng 1 − word_similarity:</p>
${ans('vi', 'S3 (GiST KNN)', ['S3M', 'S3N', 'S3O'], `<strong>Index Scan using product_name_gist</strong> có <code>Order By</code>: 8 dòng, ${trang('S3N')} trang, ${ms('S3N', 2)} ms.`)}
${bay('Bẫy — đảo chiều hai vế.', `<code>name_fold &lt;&lt;-&gt; 'thien long tl'</code> đo xem <em>tên</em> nằm vừa trong câu hỏi tới đâu — một hàm khác, chỉ mục không hỗ trợ: Seq Scan tính 54.048 khoảng cách rồi sắp xếp (${ms('S3P', 0)} ms):`, ['S3P'])}
${qo('S3Q', 'S3R')}
<p>Bảng giá của tìm kiếm: GiST là chỉ mục to nhất (11 MB, hơn nửa bảng), GIN trigram 4 MB, GIN toàn văn 2,6 MB, GIN thuộc tính 1 MB. Màn hình nào cần thì dựng cái đó — đừng mặc định dựng tất.</p>

<h4>S4 — một hàm cho ô tìm kiếm</h4>
<p class="meo">💡 Toàn văn trước (chính xác, xếp hạng theo trọng số); khi không ra gì thì trigram (dễ tính). Trong PL/pgSQL, <code>RETURN QUERY</code> nối thêm dòng và đặt <code>FOUND</code>. <strong>Mới: <code>CREATE FUNCTION … SET</code></strong> cho hàm tham số riêng trong lúc nó chạy — ở đây là ngưỡng, và (xem phần Prisma) search_path.</p>
${ans('vi', 'S4', ['S4A', 'S4B', 'S4C', 'S4D', 'S4E', 'S4F'], 'Ba câu trả lời qua toàn văn (“giáo trình” gõ <em>có</em> dấu cũng vậy), hai qua trigram, và một kết quả rỗng trung thực cho câu vô nghĩa. Khi điểm bằng nhau thì sắp theo id, nên sản phẩm của chính shop (id 1–48) đứng trước tin đăng.')}
${qo('S4G', 'S4H', 'S4I', 'S4J')}
<p><code>EXPLAIN</code> chỉ thấy một chiếc hộp đen: kế hoạch bên trong hàm PL/pgSQL không hiện ra. Muốn tinh chỉnh thì chạy riêng hai truy vấn của nó (như ở S2 và S3).</p>

<h4>Trong một app Node thật — Prisma đọc gì, gửi gì, hỏng ở đâu</h4>
<p><code>prisma db pull</code> trên bảng đã xong:</p>
${code(PRISMA_PULL, 'ts')}
<p>Ba điều cần để ý. <code>search_tsv</code> là <code>Unsupported("tsvector")</code>: Prisma không bao giờ đọc hay ghi nó — tốt, trigger lo phần đó. <code>name_fold</code> trông như cột có giá trị mặc định, nhưng nó là GENERATED: ghi vào nó từ Prisma sẽ lỗi. Và chỉ mục biểu thức <code>product_pages</code> không mô tả được trong schema: nó sống trong một migration viết tay. Giờ đến các truy vấn (log thật):</p>
${code(PRISMA_CODE, 'ts')}
${out(PRISMA_LOG)}
<p>Bộ lọc <code>path</code> của Prisma dịch thành <code>attrs #&gt; ARRAY[…]</code> — một biểu thức mà GIN trên <code>attrs</code> không đánh chỉ mục. Kế hoạch generic của bài 10.4 cho thấy rõ:</p>
${out(PRISMA_PLAN)}
<p>Vậy bảng lọc đi qua <code>$queryRaw</code> với <code>@&gt;</code> — giá trị vẫn là tham số, không bao giờ nối chuỗi. Còn ô tìm kiếm, bản đầu của <code>search_products</code> (chưa có dòng <code>SET search_path</code>):</p>
${out(PRISMA_ERR)}
${bay('Bẫy — search_path của app không phải của bạn.', 'Trong psql ta đặt <code>search_path = shop, public</code>. Prisma nối với <code>?schema=shop</code>, tức <code>search_path = shop</code>, nên bên trong hàm không thấy <code>word_similarity</code> và <code>&lt;%</code> (ở public) — mà chỉ ở nhánh trigram, nên “but bi thien long” chạy còn “casoi fx 580” hỏng. Ghim đường dẫn trên hàm (<code>SET search_path = shop, public</code>), như bài 12.1 làm với SECURITY DEFINER. Sau đó:', [])}
${out(PRISMA_OK)}

<h4>Khi nào tìm kiếm của PostgreSQL không còn đủ?</h4>
<ul>
<li><strong>Ở lại PostgreSQL</strong> khi danh mục còn vừa (vài chục nghìn tới vài triệu dòng), tập kết quả nhỏ sau khi lọc, và một giao dịch giữ sản phẩm với tìm kiếm luôn khớp nhau — không có hệ thống thứ hai phải nạp, theo dõi và sửa.</li>
<li><strong>Chuyển sang Meilisearch / Elasticsearch / OpenSearch</strong> khi cần độ liên quan mà PostgreSQL không có (chấm điểm BM25, chịu lỗi gõ ở mọi từ, từ đồng nghĩa, tách từ tiếng Việt qua plugin), đếm facet trên tập kết quả khổng lồ, “tìm khi đang gõ” với lưu lượng cao, hoặc khi xếp hạng mọi dòng khớp (S2: 2.252 dòng cho một câu) thành nút thắt. Cái giá: bản sao thứ hai của dữ liệu, đồng bộ qua hàng đợi hay logical decoding, và nhất quán sau (eventual consistency).</li>
</ul>

<h3>5 · Tự kiểm — trạng thái cuối phải khớp</h3>
${qo('SC1', 'SC2', 'SC3')}
<ol>
<li>Vì sao <code>p.attrs || f.doc-&gt;'specs'</code> xoá mất brand, color và tags — và vì sao lệnh UPDATE không báo lỗi?</li>
<li>Bộ lọc <code>attrs-&gt;&gt;'tip_mm' = '0.5'</code> ra 6.255 dòng, <code>attrs @&gt; '{"tip_mm": 0.5}'</code> ra 7.506. Cái nào đúng, vì sao?</li>
<li>Vì sao tài liệu tìm kiếm là cột do trigger giữ chứ không phải cột generated, và vì sao cần trigger thứ hai trên <code>category</code>?</li>
</ol>
${details('Đáp án', '<ol><li><code>||</code> và <code>-&gt;</code> cùng độ ưu tiên, kết hợp từ trái: biểu thức là <code>(p.attrs || f.doc) -&gt; \'specs\'</code>, chỉ còn đối tượng specs. Nó vẫn là đối tượng JSON hợp lệ nên không ràng buộc hay kiểu nào kêu — mất dữ liệu trong im lặng. Thêm ngoặc.</li><li>Phép chứa: JSON so số theo số (0.50 = 0.5). <code>-&gt;&gt;</code> trả chữ, và chữ \'0.50\' của CT0602 (cùng 1.250 tin đăng của nó) không phải \'0.5\'.</li><li>Cột generated chỉ đọc được dòng của chính nó; tên danh mục ở bảng khác (“cannot use subquery in column generation expression”). Trigger BEFORE thì tra được. Khi danh mục đổi tên, tài liệu của sản phẩm vẫn giữ tên cũ, nên trigger AFTER UPDATE trên category “chạm” vào chúng (<code>SET category_id = category_id</code>) và trigger của product dựng lại.</li></ol>')}
${qo('SC4')}

<h3>6 · Đáp án đầy đủ</h3>
${details('Xem toàn bộ lab7-solution.sql', code(SOL))}

<h3>7 · Bẫy</h3>
<div class="pitfall"><p><strong>Nhập JSON mà không khảo sát</strong> — cột jsonb nhận mọi thứ hợp lệ. Đếm khoá và <code>jsonb_typeof</code> trước; canh cột bằng CHECK sau.</p></div>
<div class="pitfall"><p><strong><code>a || b -&gt; 'k'</code></strong> — cùng độ ưu tiên, từ trái sang: thành <code>(a || b) -&gt; 'k'</code>. Thêm ngoặc mỗi khi trộn <code>||</code>, <code>-&gt;</code>, <code>-</code>, <code>#-</code>.</p></div>
<div class="pitfall"><p><strong>JSON null khác SQL NULL</strong> — <code>-&gt;&gt;</code> cho NULL với cả hai; <code>?</code> và <code>@&gt; '{"k": null}'</code> phân biệt được. <code>jsonb_strip_nulls</code> xoá JSON null.</p></div>
<div class="pitfall"><p><strong>jsonb_set với giá trị NULL</strong> — cả tài liệu thành NULL. Dùng <code>jsonb_set_lax</code> hoặc <code>coalesce</code>, và giữ attrs NOT NULL.</p></div>
<div class="pitfall"><p><strong>So chữ của <code>-&gt;&gt;</code></strong> — '0.50' ≠ '0.5', '48' &gt; '100'. Dùng <code>@&gt;</code> để so bằng, ép kiểu để so khoảng.</p></div>
<div class="pitfall"><p><strong>Dùng <code>?</code> cho bộ lọc true/false</strong> — nó kiểm khoá chứ không kiểm giá trị, và <code>jsonb_path_ops</code> không trả lời được. Dùng <code>@&gt; '{"refill": true}'</code>.</p></div>
<div class="pitfall"><p><strong>Bộ lọc <code>path</code> của Prisma</strong> — dịch thành <code>#&gt;</code>: không có GIN. Bộ lọc cần chỉ mục thì dùng <code>$queryRaw</code> với <code>@&gt;</code>.</p></div>
<div class="pitfall"><p><strong>NULL ON ERROR mặc định của JSON_TABLE</strong> — giá trị xấu biến mất trong im lặng. Tệp xuất phải đủ thì dùng <code>ERROR ON ERROR</code>.</p></div>
<div class="pitfall"><p><strong>unaccent trong chỉ mục hay cột generated</strong> — STABLE ⇒ bị từ chối. Bọc bằng hàm IMMUTABLE ghi rõ từ điển.</p></div>
<div class="pitfall"><p><strong>Chờ PostgreSQL tách từ tiếng Việt</strong> — “học sinh” là hai từ; “ban” là cả bàn, bản lẫn bạn. Xếp hạng, tìm cụm, hoặc chuyển sang công cụ có bộ phân tích tiếng Việt.</p></div>
<div class="pitfall"><p><strong><code>cot &lt;&lt;-&gt; 'q'</code> thay vì <code>'q' &lt;&lt;-&gt; cot</code></strong> — một hàm khác, không chỉ mục, sắp xếp toàn bộ.</p></div>
<div class="pitfall"><p><strong>Hàm dựa vào search_path của người gọi</strong> — chạy được trong psql, hỏng trong app. <code>SET search_path</code> trên hàm.</p></div>

<h3>8 · Thử thách thêm — và bài tiếp theo</h3>
<ul>
<li><strong>Thử thách 1</strong> — sửa <code>search_products</code> để khi điểm bằng nhau thì sản phẩm của shop và tin còn hàng đứng trước, mà vẫn giữ chỉ mục (gợi ý: ORDER BY của truy vấn đầu).</li>
<li><strong>Thử thách 2</strong> — đếm facet: cạnh kết quả, hiện “Thiên Long (2.252) · Deli (…)” cho thương hiệu của các dòng khớp, trong một truy vấn (<code>GROUP BY attrs-&gt;&gt;'brand'</code> trên các dòng khớp toàn văn). Đo với từ “but” — rồi thấy vì sao tập kết quả lớn đẩy các shop sang công cụ tìm kiếm riêng.</li>
<li><strong>Thử thách 3</strong> — chỉ mục biểu thức <code>product_pages</code> đánh chỉ mục 60.048 dòng dù phần lớn không có số trang. Viết lại thành chỉ mục một phần (partial) và tìm xem truy vấn phải viết gì thì bộ lập kế hoạch mới dùng nó.</li>
</ul>
<p>Chương 14 rời mô hình dữ liệu để nhìn vào máy chủ: kết nối và pool (vì sao 10 kết nối của app quan trọng), VACUUM và bloat — 60.048 dòng bạn vừa cập nhật hai lần để lại dead tuple — và giám sát. Lab 8, sau Chương 15, sao lưu và nhân bản CT Shop. <code>lab8-start.sql</code> dựng lại shop cỡ chuẩn; sàn của lab này có thể bỏ.</p>
</div>
`;

export default {
  title: 'Lab 7 — CT Shop: thuộc tính JSONB và ô tìm kiếm không dấu|||Lab 7 — CT Shop: JSONB attributes and an accent-free search box',
  slug: 'postgresql-lab-7-jsonb-tim-kiem-ct-shop',
  type: 'LESSON',
  description: 'Lab 7 sau Chương 13: nhập và làm sạch 48 tài liệu JSON thông số vào product.attrs (bẫy độ ưu tiên ||, CHECK IS JSON OBJECT + jsonb_typeof, jsonb_set/jsonb_strip_nulls/jsonb_set_lax), sàn 60.000 tin đăng với bộ lọc @> trên GIN jsonb_path_ops, JSON_TABLE NESTED cho kế toán, cấu hình vn_unaccent, tài liệu tìm kiếm có trọng số do trigger giữ, pg_trgm cho gõ sai + GiST KNN gợi ý, hàm search_products gọi từ Prisma. Output thật PostgreSQL 17.11.',
  content: `${G}${EN}${VI}`,
};
