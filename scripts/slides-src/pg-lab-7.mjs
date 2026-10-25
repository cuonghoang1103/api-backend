/**
 * pg-lab-7 — PostgreSQL · Lab 7 · CT Shop "JSONB attributes + a search box that forgives" (slide EN, kiểu FU, agent lab7 26/10/2026).
 * Nguồn: content/courses/postgresql/lab/lab-7.mjs + lab/sql/lab7-*.sql. Output psql = chạy thật PostgreSQL 17.11
 * (container pgcourse17, DB nháp ctlab7, lab7-start.sql rồi lab7-solution.sql bằng psql -f) — Q/O bên dưới SINH TỰ ĐỘNG (scratchpad lab7/mk7.mjs).
 * Kế hoạch EXPLAIN trên slide: bỏ phần (cost=…) và dòng "Planning: Buffers" cho vừa khung — ghi "(costs trimmed)" ở tiêu đề khung (hàm kh()).
 * Dòng JSON dài được bẻ tay và ghi "(wrapped)"; hình nào là sơ đồ ghi "schematic"; mọi CON SỐ trên hình lấy từ O (output thật).
 * Tập 1 (video pg-lab-7) = slide 1–16 (J1–J4) · tập 2 (pg-lab-7-2) = slide 17–34 (S1–S4, Prisma, tự kiểm).
 */
import { lamDeck, sql, psql, tbl, two, box, steps, kw, vsd, flow, esc } from './_pg-chung.mjs';
import { PG, CAM, NAU, XANH, DO, TIM } from './pg-lab-hinh.mjs';

export const deck = { key: 'pg-lab-7', code: 'PG Lab 7', title: 'Lab 7 — CT Shop: JSONB attributes and a search box that forgives', sub: 'survey · clean · CHECK · GIN filters · JSON_TABLE · vn_unaccent · weighted search · pg_trgm · search_products · Prisma' };

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

/* ── HELPERS ── */
const P = (t, o = {}) => psql(t, { title: 'psql (17.11) — ctshop', ...o });
const col = (...xs) => `<div style="display:flex;flex-direction:column;gap:12px;min-width:0">${xs.join('')}</div>`;
const p = (t, fs = 21) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;
const bo = (s) => s.split('\n').map((l) => l.replace(/\s+--.*$/, '')).join('\n');
const S = (k, to = [], o = {}) => { const t = bo(Q[k]); return sql(t, { sm: true, hl: t.split('\n').map((l, i) => (to.some((x) => l.includes(x)) ? i + 1 : 0)).filter(Boolean), ...o }); };
const nho = (h, fs = 13) => h.replace(/<pre>/g, `<pre style="font-size:${fs}px;line-height:1.34">`);
const ma = (h, fs = 13.5) => h.replace(/<pre class="vs sm">/g, `<pre class="vs sm" style="font-size:${fs}px;line-height:1.38">`);
const kh = (o, { boPlan = true, tt = false } = {}) => {
  const L = o.split('\n'); const than = [];
  for (let i = 2; i < L.length; i++) {
    const l = L[i];
    if (/^\(\d+ rows?\)$/.test(l)) continue;
    if (boPlan && l === ' Planning:') { i++; continue; }
    let x = l.replace(/\s+\(cost=[\d.]+\.\.[\d.]+ rows=\d+ width=\d+\)/, '').replace(/\s+$/, '');
    if (tt) x = x.replace(/\(actual time=[\d.]+\.\.[\d.]+ (rows=\d+ loops=\d+)\)/, '(actual $1)');
    than.push(x);
  }
  const w = Math.max(10, ...than.map((l) => l.length)); const pad = Math.floor((w - 10) / 2);
  return [' '.repeat(pad + 1) + 'QUERY PLAN', '-'.repeat(w + 1), ...than].join('\n');
};
const dong = (t, to) => t.split('\n').map((l, i) => (to.some((x) => l.includes(x)) ? i + 1 : 0)).filter(Boolean);
const K = (k, to = [], o = {}) => { let t = kh(O[k], o); if (o.bo) t = t.split('\n').filter((l) => !o.bo.some((x) => l.includes(x))).join('\n'); return P(t, { sm: true, title: o.title || `EXPLAIN (ANALYZE, BUFFERS) — real output, ${o.tt ? 'costs + node times trimmed' : 'costs trimmed'}${o.bo ? ', lines selected' : ''}`, hl: dong(t, to) }); };
const PO = (k, to = [], o = {}) => P(O[k], { sm: true, hl: dong(O[k], to), ...o });
const lay = (k, re) => { const m = O[k].match(re); if (!m) throw new Error(`không thấy ${re} trong O.${k}`); return m[1]; };
const vn = (x, le = 0) => { const [a, b] = Number(x).toFixed(le).split('.'); return a.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (b ? ',' + b : ''); };
const ms = (k, le = 1) => vn(lay(k, /Execution Time: ([\d.]+) ms/), le);
const tg = (k, le = 1) => vn(Number(lay(k, /Time: ([\d.]+) ms/)) / 1000, le);
const trang = (k) => { const l = O[k].split('\n').find((x) => /^\s+Buffers:/.test(x)); return vn(Number((l.match(/hit=(\d+)/) || [0, 0])[1]) + Number((l.match(/read=(\d+)/) || [0, 0])[1])); };
const idxMs = (k, le = 2) => vn(lay(k, /Bitmap Index Scan[^\n]*actual time=[\d.]+\.\.([\d.]+)/), le);
/** Bỏ dòng "psql:/tmp/…:N: " ở đầu lỗi cho gọn; bẻ DETAIL dài. */
const boc = (l, w) => { const r = []; let x = l; while (x.length > w) { let i = x.lastIndexOf(' ', w); if (i < w * 0.5) i = w; r.push(x.slice(0, i)); x = '  ' + x.slice(i).trimStart(); } r.push(x); return r; };
const loi = (k, w = 92) => O[k].split('\n').map((l) => l.replace(/^psql:\/tmp\/lab7-solution\.sql:\d+: /, '')).flatMap((l) => boc(l, w)).join('\n');
const c = (t) => `<code class="i">${esc(t)}</code>`;

/* ── HÌNH ── */
/** Hai cây phân tích của a || b -> 'specs' (độ ưu tiên ngang nhau, kết hợp trái). */
const cayUuTien = () => {
  const W = 1110, H = 210;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Menlo,monospace"><defs><marker id="l7u" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#888"/></marker></defs>`;
  const nut = (x, y, t, mau, k) => `<g data-k="${k}"><rect x="${x - t.length * 6.6 - 14}" y="${y - 20}" width="${t.length * 13.2 + 28}" height="40" rx="9" fill="${mau}18" stroke="${mau}" stroke-width="2.5"/><text x="${x}" y="${y + 7}" text-anchor="middle" font-size="22" font-weight="700" fill="${mau}">${esc(t)}</text></g>`;
  const ke = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#888" stroke-width="2" marker-end="url(#l7u)"/>`;
  s += `<text x="20" y="22" font-family="Arial" font-size="18" font-weight="800" fill="${DO}">what PostgreSQL reads (same precedence, left to right)</text>`;
  s += nut(250, 64, "-> 'specs'", DO, 'u-root') + ke(250, 84, 160, 124) + nut(140, 144, '||', DO, 'u-or') + ke(140, 164, 70, 184) + ke(140, 164, 220, 184);
  s += `<text x="60" y="204" font-size="19" fill="#333">p.attrs</text><text x="200" y="204" font-size="19" fill="#333">f.doc</text>`;
  s += `<text x="600" y="22" font-family="Arial" font-size="18" font-weight="800" fill="${XANH}">what you meant — p.attrs || (f.doc->'specs')</text>`;
  s += nut(800, 64, '||', XANH, 'u-ok') + ke(800, 84, 700, 124) + ke(800, 84, 920, 124);
  s += `<text x="650" y="150" font-size="19" fill="#333">p.attrs</text>` + nut(930, 144, "f.doc -> 'specs'", XANH, 'u-ok2');
  return s + '</svg>';
};

/** GIN jsonb_path_ops như sổ mục lục: 3 mục → danh sách dòng → giao (sơ đồ, số dòng thật từ O). */
const soMucLuc = () => {
  const W = 1110, H = 200;
  const so = O.J3J.split('\n')[2].split('|').map((x) => vn(x.trim()));
  const muc = [['ink = "gel"', `${so[0]} rows`, CAM], ['tip_mm = 0.5', `${so[1]} rows`, CAM], ['color = "tím"', `${so[2]} rows`, CAM]];
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs><marker id="l7g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>`;
  s += `<text x="0" y="20" font-size="17" font-weight="800" fill="${PG}">GIN (jsonb_path_ops) = a book index: one entry per path = value, each pointing to the rows that have it — schematic</text>`;
  muc.forEach(([m, n, mau], i) => {
    const y = 34 + i * 54;
    s += `<g data-k="m-${i}"><rect x="0" y="${y}" width="270" height="44" rx="8" fill="#fff7ef" stroke="${mau}" stroke-width="2.5"/><text x="16" y="${y + 29}" font-size="20" font-weight="700" fill="${NAU}" font-family="Menlo,monospace">${esc(m)}</text></g>`;
    s += `<line x1="276" y1="${y + 22}" x2="356" y2="${y + 22}" stroke="${NAU}" stroke-width="2.5" marker-end="url(#l7g)"/>`;
    for (let j = 0; j < 14; j++) s += `<rect x="${364 + j * 26}" y="${y + 8}" width="20" height="28" rx="3" fill="${(j + i) % 3 === 0 ? CAM : '#f0d6bd'}"/>`;
    s += `<text x="${364 + 14 * 26 + 8}" y="${y + 29}" font-size="18" fill="#555">${n}</text>`;
  });
  s += `<g data-k="giao"><rect x="860" y="50" width="250" height="110" rx="12" fill="#f1f9f4" stroke="${XANH}" stroke-width="3"/><text x="985" y="92" text-anchor="middle" font-size="21" font-weight="800" fill="${XANH}">AND of the 3 lists</text><text x="985" y="126" text-anchor="middle" font-size="20" fill="#333">→ 500 rows · 500 pages</text></g>`;
  return s + '</svg>';
};

/** Tài liệu tìm kiếm có trọng số: tên A · danh mục B · thương hiệu + mô tả C (ví dụ CT1203, lexeme thật từ O.S2J). */
const taiLieu = () => {
  const W = 1110, H = 200;
  const hang = [['A', 'name', 'Sách Clean Code (bản tiếng Việt)', "'sach':1A 'clean':2A 'code':3A 'ban':4A …", '1.0', PG],
    ['B', 'category path', 'Sách & tài liệu · Giáo trình IT', "'sach':7B 'tai':8B 'lieu':9B 'giao':10B …", '0.4', CAM],
    ['C', 'brand + desc', 'NXB Trẻ · Viết mã sạch: đặt tên, hàm ngắn…', "'nxb':13C 'viet':15C 'sach':17C …", '0.2', TIM]];
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  hang.forEach(([w, ten, vd, lx, he, mau], i) => {
    const y = 6 + i * 64;
    s += `<g data-k="w-${w}"><rect x="0" y="${y}" width="56" height="54" rx="10" fill="${mau}"/><text x="28" y="${y + 37}" text-anchor="middle" font-size="28" font-weight="900" fill="#fff">${w}</text>`;
    s += `<text x="72" y="${y + 22}" font-size="18" font-weight="800" fill="${mau}">${ten} · weight ${he}</text><text x="72" y="${y + 46}" font-size="18" fill="#333">${esc(vd)}</text>`;
    s += `<text x="560" y="${y + 36}" font-size="17" fill="#555" font-family="Menlo,monospace">${esc(lx)}</text></g>`;
  });
  return s + '</svg>';
};

/** Thanh kích thước chỉ mục (số thật từ O.S3R + heap J3I). */
const thanhChiMuc = () => {
  const rows = O.S3R.split('\n').slice(2, -1).map((l) => l.split('|').map((x) => x.trim()));
  const kb = (t) => (/MB/.test(t) ? parseFloat(t) * 1024 : parseFloat(t));
  const max = Math.max(...rows.map(([, z]) => kb(z)));
  const W = 1110, h = 30, wTen = 250, wMax = W - wTen - 150;
  const mau = { product_name_gist: DO, product_name_trgm: TIM, product_search_gin: CAM, product_attrs_gin: XANH, product_pages: PG };
  let s = `<svg viewBox="0 0 ${W} ${rows.length * (h + 10) + 6}" width="${W}" height="${rows.length * (h + 10) + 6}" font-family="Arial">`;
  rows.forEach(([n, z], i) => {
    const y = 4 + i * (h + 10), w = Math.max(4, (kb(z) / max) * wMax);
    s += `<g data-k="bar-${i}"><text x="${wTen - 10}" y="${y + 21}" text-anchor="end" font-size="17" fill="#333" font-family="Menlo,monospace">${n}</text><rect x="${wTen}" y="${y}" width="${w}" height="${h}" rx="5" fill="${mau[n] || '#9aa8b8'}"/><text x="${wTen + w + 10}" y="${y + 21}" font-size="17" font-weight="800" fill="#333">${z}</text></g>`;
  });
  return s + '</svg>';
};

const SC2_ROWS = O.SC2.split('\n').slice(2, -1).map((l) => l.split('|').map((x) => x.trim()));

export const slides = lamDeck({ chuong: 'Lab 7 · CT Shop', bai: '' }, [
  /* 1 */ { cover: true, t: 'Lab 7 — CT Shop:<br>JSONB attributes,<br>a search box that forgives', sub: 'survey · clean · CHECK · GIN filters · JSON_TABLE ·<br>vn_unaccent · weighted full-text · pg_trgm · one search function' },

  /* 2 */ { t: 'Your assignment', body: two(
    box('The ticket', `<ul style="margin:0">
<li>The supplier’s <b>spec sheet</b>: 48 JSON documents ⇒ <code class="i">product.attrs</code>, clean</li>
<li>A <b>filter panel</b> per category page</li>
<li>The <b>marketplace</b> opens: 60.000 listings</li>
<li><b>Accounting</b> wants a flat table (CSV)</li>
<li>The <b>search box</b>: no accents, CAPITALS, typos</li></ul>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      'survey: <b>4</b> bad types + <b>1</b> JSON null · CT1207 · CT0906',
      '2 CHECKs reject <b>"300 trang"</b> and <b>[]</b>',
      'filter = <b>Bitmap Index Scan</b>, 500 pages not 2.546',
      'export view: <b>55</b> rows for 48 products',
      '<b>search_products</b>: “but bi thien long” · “casoi fx 580”',
    ]))), giua: true, to: true },

  /* 3 */ { t: 'Files and setup', body: `${two(col(sql(`$ docker cp lab7-start.sql pgdemo:/tmp/
$ docker exec -it pgdemo psql -U postgres -d ctshop \\
      -f /tmp/lab7-start.sql`, { sm: true, lang: 'bash' }), nho(P(`CREATE TABLE
INSERT 0 48
 categories | products | customers | orders | order_lines | payments | spec_docs 
------------+----------+-----------+--------+-------------+----------+-----------
         12 |       48 |       300 |   2000 |        5000 |     1663 |        48`, { sm: true, hl: [5], title: 'lab7-start.sql — last lines of the real run' }), 11.5)),
    col(ma(sql(`SET search_path = shop, public;
SET TimeZone = 'Asia/Ho_Chi_Minh';
SET max_parallel_workers_per_gather = 0;
CREATE EXTENSION IF NOT EXISTS unaccent SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pg_trgm  SCHEMA public;`, { sm: true, hl: [1] }), 12.5),
      p('<b>public</b> is in the search path because the two extensions live there.', 18)), 'r64')}
${box('Part B — a staging table', '<code class="i">spec_feed(line, doc jsonb)</code>: what the supplier sent, one JSON document per line of their file. Not one of the 8 tables of the model; dropped at the end. <b>Look closely at the values:</b>', 'lam')}
${nho(P(`ctshop=# SELECT line, doc->>'sku' AS sku, (doc->'specs') - 'desc' AS specs_without_desc
ctshop-# FROM spec_feed WHERE line IN (3, 20, 24) ORDER BY line;
 line |  sku   |                        specs_without_desc                         
------+--------+-------------------------------------------------------------------
    3 | CT0503 | {"ink": "dầu", "pack": 1, "tip_mm": "0.7"}
   20 | CT0802 | {"gsm": 70, "pages": "96 trang", "ruling": "ô ly"}
   24 | CT0806 | {"gsm": 80, "pages": 120, "colour": "xanh", "ruling": "kẻ ngang"}`, { sm: true, title: 'three documents as they arrived — real output', hl: [5, 6, 7] }), 13.5)}`, giua: true },

  /* 4 */ { t: 'The plan: two halves', body: `<div class="tcap">Part J — the catalogue (video 1)</div>
${flow([{ t: 'J1 · Survey', s: 'keys · types', mau: PG }, { t: 'J2 · Clean + guard', s: '|| · jsonb_set · CHECK', mau: CAM }, { t: 'J3 · Filters', s: '@> · GIN · 60.000 rows', mau: XANH }, { t: 'J4 · Export', s: 'JSON_TABLE', mau: NAU }], { h: 150, fs: 22 })}
<div class="tcap">Part S — the search box (video 2)</div>
${flow([{ t: 'S1 · vn_unaccent', s: 'no accents', mau: PG }, { t: 'S2 · Document', s: 'A · B · C + trigger', mau: CAM }, { t: 'S3 · Trigrams', s: 'typos · suggest', mau: TIM }, { t: 'S4 · One function', s: 'fts → fuzzy', mau: XANH }], { h: 150, fs: 22 })}
${two(box('Tools', 'Chapter 13 — jsonb, GIN, JSON_TABLE, full-text, unaccent, pg_trgm — plus the functions, triggers and views of Chapter 12.', 'lam'),
    box('The data is dirty', 'As real data is: strings where numbers belong, a JSON null, a misspelt key, 60.000 titles written ten different ways.', 'do2'))}`, giua: true, to: true },

  /* 5 */ { t: 'J1 · Survey the feed before importing', body: two(col(sql(`SELECT k AS key,
       string_agg(DISTINCT jsonb_typeof(v), ', ')
         AS json_types,
       count(*) AS docs
FROM spec_feed,
     jsonb_each(doc->'specs') AS e(k, v)
GROUP BY k
HAVING count(DISTINCT jsonb_typeof(v)) > 1
ORDER BY k;`, { sm: true, hl: [6, 8] }), PO('J1B', ['pages', 'solar', 'tip_mm'])),
    col(PO('J1C', ['"0.7"', '"96 trang"', '"200"', '"có"']),
      box('Nothing was rejected on arrival', `A <code class="i">jsonb</code> column accepts <b>any valid JSON</b>. 20 keys arrived; 4 of them with two types: strings where numbers belong, <b>"có"</b> instead of <b>true</b> — and one JSON <b>null</b>.`, 'do2')), 'r64'), giua: true },

  /* 6 */ { t: 'J1 · Orphans on both sides, and the facets', body: two(col(sql(`-- a sku the shop does not sell
SELECT f.line, f.doc->>'sku' AS sku
FROM spec_feed f
WHERE NOT EXISTS (SELECT 1 FROM product p
                  WHERE p.sku = f.doc->>'sku');`, { sm: true }), PO('J1D', ['CT1207']), PO('J1E', ['CT0906'])),
    col(`<div class="tcap">keys per category = the filter panel of each page</div>`, nho(PO('J1F', ['Bút bi', 'Máy tính']), 12.5),
      box('An import must…', '<b>skip</b> CT1207 (no product yet) — not fail · <b>report</b> the Moleskine (its filters will be empty).', 'lam')), 'r46'), giua: true },

  /* 7 */ { t: 'J2 · Trap: the merge that deleted brand, color, tags', body: `${vsd(col(sql(`BEGIN;
UPDATE product p SET attrs = p.attrs || f.doc->'specs'
FROM spec_feed f WHERE f.doc->>'sku' = p.sku;   -- UPDATE 47
SELECT attrs FROM product WHERE sku = 'CT1201';
ROLLBACK;`, { sm: true, hl: [2] }), P(`{"desc": "Mô hình quan hệ, SQL, …", "year": 2025,
 "pages": 320, "format": "bản in"}`, { sm: true, title: 'CT1201 attrs — real output (wrapped)' })),
  col(sql(`UPDATE product p SET attrs = p.attrs || (f.doc->'specs')
FROM spec_feed f WHERE f.doc->>'sku' = p.sku;`, { sm: true, hl: [1] }), P(`{"desc": "Mô hình quan hệ, SQL, …", "tags": ["học sinh"],
 "year": 2025, "brand": "CT Books", "color": "vàng",
 "pages": 320, "format": "bản in"}`, { sm: true, title: 'CT1201 attrs — real output (wrapped)', hl: [1, 2] })),
  '✗ brand · color · tags gone', '✓ parentheses')}
${cayUuTien()}`, giua: true },

  /* 8 */ { t: 'J2 · Guard the column with CHECK', body: two(col(sql(`ALTER TABLE product ADD CONSTRAINT product_attrs_object
  CHECK (attrs IS JSON OBJECT);                 -- PG 16+
ALTER TABLE product ADD CONSTRAINT product_attrs_types
  CHECK (    jsonb_typeof(attrs->'pages')   = 'number'
         AND jsonb_typeof(attrs->'tip_mm')  = 'number'
         AND jsonb_typeof(attrs->'pack')    = 'number'
         AND jsonb_typeof(attrs->'gsm')     = 'number'
         AND jsonb_typeof(attrs->'solar')   = 'boolean'
         AND jsonb_typeof(attrs->'exam_ok') = 'boolean'
         AND jsonb_typeof(attrs->'tags')    = 'array');`, { sm: true, hl: [2] }), P(loi('J2G', 70), { sm: true, title: 'psql — real error (wrapped)' })),
    col(tbl(['product', "attrs->'pages'", 'jsonb_typeof', 'CHECK'], [['CT1201', '320', "'number'", '<b class="xanh">true ✓</b>'], ['CT0501 (a pen)', 'NULL (no key)', 'NULL', '<b class="xanh">NULL ⇒ passes ✓</b>'], ['CT0802', '"96 trang"', "'string'", '<b class="do">false ✗</b>']], { cap: 'a CHECK fails only on FALSE' }),
      box('Why it fails now', 'The dirty documents are <b>in the table</b>. Find them with the same predicates, repair, then add the CHECK.', 'do2')), 'r64'), giua: true },

  /* 9 */ { t: 'J2 · Repair with the smallest change', body: two(col(ma(sql(`UPDATE product
SET attrs = jsonb_set(attrs, '{pages}',
      to_jsonb(substring(attrs->>'pages' FROM '[0-9]+')::int))
WHERE jsonb_typeof(attrs->'pages') = 'string'
RETURNING sku, attrs->'pages' AS pages;`, { sm: true, hl: [2, 3] }), 13), PO('J2I'),
      ma(sql(`SET attrs = jsonb_set(attrs, '{tip_mm}',
      to_jsonb((attrs->>'tip_mm')::numeric))      -- "0.7" → 0.7
SET attrs = jsonb_set(attrs, '{solar}',
      to_jsonb(attrs->>'solar' IN ('có', 'yes', 'true')))   -- → true`, { sm: true }), 12.5)),
    col(`<div class="tcap">JSON null is not SQL NULL</div>`, PO('J2L', ['CT0803']),
      ma(sql(`UPDATE product SET attrs = jsonb_strip_nulls(attrs)
WHERE attrs @> '{"gsm": null}';
UPDATE product
SET attrs = (attrs - 'colour')
   || jsonb_build_object('color',
                         attrs->'colour')
WHERE attrs ? 'colour';`, { sm: true, hl: [1, 4, 5] }), 12.5),
      p(`${kw('jsonb_set', 'replace ONE key')} ${kw('-', 'remove a key')} ${kw('||', 'add / overwrite')} ${kw('jsonb_strip_nulls', 'drop JSON nulls')}`, 17)), 'r64'), giua: true },

  /* 10 */ { t: 'J2 · From now on: refused at the door', body: two(col(sql(`ALTER TABLE product ADD CONSTRAINT product_attrs_types CHECK (…);
-- ALTER TABLE  ✓ (5 documents repaired)
UPDATE product SET attrs = jsonb_set(attrs, '{pages}', '"300 trang"')
WHERE sku = 'CT1201';
UPDATE product SET attrs = '[]' WHERE sku = 'CT0501';`, { sm: true, hl: [3, 5] }),
    nho(P(loi('J2P', 74) + '\n' + loi('J2Q', 74), { sm: true, title: 'psql — real errors (wrapped)' }), 12.5)),
    col(box('Whoever sends it', 'The app, a script, a psql session at 2 a.m. — the database itself refuses. The rule lives <b>next to the data</b>.', 'xanh'),
      ma(sql(`UPDATE product
SET attrs = jsonb_set(attrs, '{tags}',
              (attrs->'tags') || '["ôn thi"]')
WHERE attrs @> '{"exam_ok": true}'
   OR attrs @> '{"hardness": "2B"}';`, { sm: true, hl: [2, 3] }), 13),
      p(`Marketing’s tag “ôn thi”: <b>UPDATE 7</b> — 4 calculators + 3 pencils. Appending to an array = <code class="i">jsonb_set</code> + <code class="i">||</code>.`, 19)), 'r64'), giua: true },

  /* 11 */ { t: 'J2 · Trap: jsonb_set is STRICT', body: `${two(col(sql(`-- the app "removes the discount" by sending NULL
UPDATE product
SET attrs = jsonb_set(attrs, '{discount}', to_jsonb(NULL::int))
WHERE sku = 'CT0501';`, { sm: true, hl: [3] }), nho(P(loi('J2U', 76), { sm: true, title: 'psql — real error (wrapped)' }), 12.5)),
    col(box('NULL in ⇒ NULL out', 'jsonb_set is <b>STRICT</b>: one NULL argument ⇒ the <b>whole</b> document is NULL. NOT NULL on attrs saved the product here; on a nullable column every attribute would be <b>silently gone</b>.', 'do2'),
      p(`${kw('jsonb_set_lax', 'PostgreSQL 13+')} decides what NULL means: a JSON <b>null</b> (default), or <b>delete the key</b>.`, 20)), 'r64')}
${sql(`SELECT jsonb_set('{"brand": "Thiên Long"}', '{discount}', to_jsonb(NULL::int))   AS jsonb_set,
       jsonb_set_lax('{"brand": "Thiên Long"}', '{discount}', NULL)               AS lax_json_null,
       jsonb_set_lax('{"brand": "Thiên Long", "discount": 10}', '{discount}', NULL,
                     true, 'delete_key')                                          AS lax_delete_key;`, { sm: true, hl: [2, 3, 4] }).replace('<pre class="vs sm">', '<pre class="vs sm" style="font-size:13px;line-height:1.3">')}
${nho(PO('J2V'), 12.5)}`, giua: true },

  /* 12 */ { t: 'J3 · The marketplace opens: 60.000 listings', body: two(col(ma(sql(`INSERT INTO product (sku, name, category_id, price,
                     stock, attrs, is_active, created_at)
SELECT 'MP' || lpad(g::text, 6, '0'),
       CASE g % 4 WHEN 0 THEN b.name
                  WHEN 1 THEN unaccent(b.name)
                  WHEN 2 THEN b.name || ' chính hãng'
                  ELSE upper(b.name) END,
       b.category_id, …,
       b.attrs || jsonb_build_object('seller', s.seller, 'color', …),
       g % 10 <> 0, …
FROM generate_series(1, 60000) AS g
JOIN product b ON b.id = 1 + g % 48 …;`, { sm: true, hl: [5, 6, 7, 9] }), 12.5), P(O.J3A, { sm: true })),
    col(PO('J3C'), PO('J3D', ['Thien', 'BÚT']), box('Like a real marketplace', 'Ten sellers, the same 48 products, every title written <b>their own way</b>; each listing inherits the cleaned attributes + seller + colour; 10 % switched off.', 'lam')), 'r64'), giua: true },

  /* 13 */ { t: 'J3 · Filter “gel · 0.5 mm · tím”: GIN, before / after', body: `${soMucLuc()}
${two(nho(K('J3E', ['Seq Scan', 'Rows Removed', 'Execution Time'], { tt: true, bo: ['Sort Method', 'Planning Time', 'Sort Key'], title: 'before — real output (costs trimmed, lines selected)' }), 11.5),
    nho(K('J3H', ['Bitmap Index Scan on product_attrs_gin', 'Heap Blocks', 'Execution Time'], { tt: true, bo: ['Sort Method', 'Planning Time', 'Sort Key', 'Recheck Cond', 'Index Cond'], title: 'after CREATE INDEX … USING GIN (attrs jsonb_path_ops)' }), 11.5))}
${p(`<b>${trang('J3E')}</b> pages · ${ms('J3E')} ms → <b>${trang('J3H')}</b> pages · ${ms('J3H', 2)} ms. Index ${lay('J3I', /\n\s+(\d+ kB)/)} next to a ${lay('J3I', /\| (\d+ MB)/)} table.`, 20)}` },

  /* 14 */ { t: 'J3 · Two traps of attribute filters', body: two(col(`<div class="tcap">“has the key” ≠ “is true” — and path_ops has no ?</div>`, PO('J3L'), nho(P(O.J3M, { sm: true, title: "attrs ? 'refill'", hl: [3] }), 13), nho(P(O.J3N, { sm: true, title: `attrs @> '{"refill": true}'`, hl: [4] }), 13)),
    col(`<div class="tcap">->> returns TEXT: '0.50' ≠ '0.5'</div>`, PO('J3O', ['CT0602']), PO('J3P'),
      box('1.251 rows lost', 'The supplier wrote <b>0.50</b>. As JSON numbers 0.50 = 0.5; as text they differ. Equality ⇒ <code class="i">@&gt;</code>.', 'do2')), 'r64'), giua: true },

  /* 15 */ { t: 'J3 · Ranges: text order lies, an expression B-tree helps', body: `${two(col(sql(`SELECT sku, attrs->>'pages' AS pages,
       attrs->>'pages' > '100'      AS text_gt_100,
       (attrs->>'pages')::int > 100 AS int_gt_100
FROM product WHERE sku IN ('CT0801', 'CT0805', 'CT1203');`, { sm: true, hl: [2] }), PO('J3Q', ['CT0801', 'CT0805'])),
    col(box('\'4\' > \'1\'', 'Text compares character by character: a 48-page notebook “has more than 100 pages”. Cast to a number — the CHECK of J2 makes the cast safe.', 'do2'),
      p('A range is not containment ⇒ GIN cannot serve it; a <b>B-tree on the expression</b> can (lesson 13.2).', 20)), 'r64')}
${two(sql(`CREATE INDEX product_pages
  ON product
  (((attrs->>'pages')::int));
SELECT id, name, price
FROM product
WHERE (attrs->>'pages')::int
        BETWEEN 400 AND 500
  AND is_active
ORDER BY price LIMIT 24;`, { sm: true, hl: [3, 6, 7] }), nho(K('J3S', ['Bitmap Index Scan on product_pages', 'Execution Time'], { tt: true, bo: ['Sort Method', 'Planning Time', 'Sort Key', 'Recheck Cond', 'Buffers'] }), 11), 'r37')}`, giua: true },

  /* 16 */ { t: 'J4 · A flat table for accounting: JSON_TABLE', body: two(col(ma(sql(`CREATE VIEW product_attr_export AS
SELECT p.sku, p.name, jt.*
FROM product p, JSON_TABLE(p.attrs, '$' COLUMNS (
  brand   text    PATH '$.brand',
  pages   int     PATH '$.pages',
  tip_mm  numeric PATH '$.tip_mm',
  solar   boolean PATH '$.solar',
  exam_ok boolean PATH '$.exam_ok',
  NESTED PATH '$.tags[*]' COLUMNS (tag text PATH '$')
)) AS jt;
\\copy (SELECT * FROM product_attr_export WHERE sku LIKE 'CT%'
       ORDER BY sku, tag) TO '/tmp/lab7-attrs.csv' WITH (FORMAT csv, HEADER)`, { sm: true, hl: [9] }), 12.5), P(O.J4B + '\n' + O.J4C, { sm: true })),
    col(nho(PO('J4A', ['CT0601', 'CT1001']), 12.5),
      `<div class="tcap">Trap: NULL ON ERROR is the default — on the raw feed</div>`, nho(PO('J4D', ['"96 trang"', '"có"']), 12),
      nho(P(loi('J4E', 52), { sm: true, title: "… pages int PATH '$.pages' ERROR ON ERROR" }), 12.5)), 'r64'), giua: true },

  /* ── tập 2 ── */
  /* 17 */ { t: 'S1 · A search configuration: vn_unaccent', body: `${flow([{ t: 'Bút bi Thiên Long', s: 'what is stored', mau: PG }, { t: 'parser', s: 'word · asciiword · int', mau: NAU }, { t: 'unaccent', s: 'Bút → But', mau: CAM }, { t: 'simple', s: 'lower case', mau: TIM }, { t: "'but' 'bi' 'thien' 'long'", s: 'lexemes', mau: XANH }], { h: 120, fs: 18 })}
${two(col(sql(`CREATE TEXT SEARCH CONFIGURATION vn_unaccent (COPY = simple);
ALTER TEXT SEARCH CONFIGURATION vn_unaccent
  ALTER MAPPING FOR hword, hword_part, word
  WITH unaccent, simple;`, { sm: true, hl: [3, 4] }), nho(P(O.S1A, { sm: true, title: "simple: accents kept ⇒ 'but bi' ≠ 'bút bi'", hl: [3] }), 11)),
  nho(PO('S1D', ['word      | Bút', 'word      | Thiên', '-027']), 12.5), 'r64')}
${nho(PO('S1E'), 12.5)}`, giua: true },

  /* 18 */ { t: 'S1 · The limits — and an IMMUTABLE f_unaccent', body: two(col(`<div class="tcap">no word segmentation · accents dropped ⇒ words merge</div>`,
    tbl(['text', 'typed', 'match'], [['…cho học sinh', 'sinh hoc', '<b class="do">t</b> 2 words'], ['…cho học sinh', '"sinh hoc"', 'f phrase'], ['…cho học sinh', '"hoc sinh"', 't'], ['Bàn học…', 'ban', '<b class="do">t</b> bàn'], ['Sách bản in', 'ban', '<b class="do">t</b> bản']], { cap: `S1F — real output: ${O.S1F.split('\n')[2].replace(/\s+/g, ' ').trim()}` }),
    box('Promise less', 'More matches, less precision. <b>Ranking</b> (S2) puts the right ones first; true segmentation needs a search engine with a Vietnamese analyzer.', 'lam')),
    col(sql(`ALTER TABLE product ADD COLUMN name_fold text
  GENERATED ALWAYS AS (lower(unaccent(name)))
  STORED;`, { sm: true }), P(loi('S1G'), { sm: true, title: 'psql — real error' }),
      ma(sql(`CREATE FUNCTION f_unaccent(text) RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
  RETURN public.unaccent(
    'public.unaccent'::regdictionary, $1);`, { sm: true, hl: [2, 3, 4] }), 13), P(O.S1J, { sm: true }),
      p(`unaccent is <b>STABLE</b> (provolatile = ${lay('S1H', /\n\s+(\w)\n/)}): it finds its dictionary via the search path. Name the dictionary ⇒ nothing left to look up.`, 18)), 'r46'), giua: true },

  /* 19 */ { t: 'S2 · The search document: A · B · C', body: `${taiLieu()}
${vsd(col(sql(`ALTER TABLE product ADD COLUMN search_tsv tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('vn_unaccent', name), 'A') ||
  setweight(to_tsvector('vn_unaccent',
    (SELECT c.name FROM category c WHERE c.id = category_id)), 'B')
) STORED;`, { sm: true, hl: [5] }), nho(P(loi('S2A', 66), { sm: true, title: 'psql — real error (wrapped)' }), 12.5)),
  col(p('A generated column sees <b>only its own row</b>. The category name lives in <code class="i">category</code> ⇒ a plain column + a <b>BEFORE trigger</b> (Chapter 12).', 20),
    p('“giáo trình” is in the names of 2 books but in the <b>category</b> of 6.', 20)), '✗ generated column', '✓ trigger')}`, giua: true },

  /* 20 */ { t: 'S2 · The trigger, the back-fill, the index', body: two(ma(sql(`CREATE FUNCTION product_search_doc() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE cat text;
BEGIN
  SELECT concat_ws(' ', parent.name, c.name) INTO cat
  FROM category c LEFT JOIN category parent ON parent.id = c.parent_id
  WHERE c.id = NEW.category_id;
  NEW.search_tsv :=
       setweight(to_tsvector('vn_unaccent', NEW.name), 'A')
    || setweight(to_tsvector('vn_unaccent', coalesce(cat, '')), 'B')
    || setweight(to_tsvector('vn_unaccent',
         concat_ws(' ', NEW.attrs->>'brand', NEW.attrs->>'desc')), 'C');
  RETURN NEW;
END $$;
CREATE TRIGGER product_search_doc
  BEFORE INSERT OR UPDATE OF name, category_id, attrs ON product
  FOR EACH ROW EXECUTE FUNCTION product_search_doc();`, { sm: true, hl: [5, 9, 10, 11, 12, 16] }), 12),
    col(sql(`UPDATE product SET name = name;   -- back-fill
CREATE INDEX product_search_gin
  ON product USING GIN (search_tsv);`, { sm: true }), P(O.S2F + '\n' + O.S2G, { sm: true, title: 'psql \\timing — real run' }),
      box('UPDATE OF name, category_id, attrs', 'A checkout that only changes <b>stock</b> must not rebuild the document (proof on slide 24).', 'xanh'),
      p(`60.048 documents in ${tg('S2F')} s — the trigger runs once per row.`, 19)), 'r64'), giua: true },

  /* 21 */ { t: 'S2 · “but bi thien long” and “giao trinh”', body: two(col(sql(`SELECT sku, ts_headline('vn_unaccent', name, q,
         'StartSel=[, StopSel=]') AS name,
       round(ts_rank(search_tsv, q)::numeric, 4) AS rank
FROM product,
     websearch_to_tsquery('vn_unaccent', 'but bi thien long') AS q
WHERE is_active AND search_tsv @@ q
ORDER BY rank DESC, id LIMIT 5;`, { sm: true, hl: [5, 6] }), nho(PO('S2L', ['[But]']), 12.5),
      p(`<b>${vn(lay('S2K', /\n\s+(\d+) \|/))}</b> matches, <b>${vn(lay('S2K', /\|\s+(\d+)\n/))}</b> active. ts_headline marks words in the <b>original</b> text.`, 19)),
    col(`<div class="tcap">the category weight at work (own products)</div>`, nho(PO('S2M', ['CT1202', 'CT1201']), 13),
      box('A = 1,0 · B = 0,4', 'Two books have “Giáo trình” in the <b>name</b> (A); four are found only through the <b>category</b> (B). Without it, 4 of 6 would be missed.', 'xanh')), 'r64'), giua: true },

  /* 22 */ { t: 'S2 · The description, and what customers type', body: `<div class="tcap">websearch_to_tsquery('vn_unaccent', 'mang vao phong thi') — found through weight C, the description</div>
${nho(PO('S2N', ['CT1006']), 12)}
${two(box('Words, not meaning', 'The Deli is found: its description says it is <b>not</b> allowed in the exam room. Full-text matches words; the precise answer is a filter: <code class="i">attrs @&gt; \'{"exam_ok": true}\'</code>.', 'do2'),
    col(nho(PO('S2O', ['-moleskine', 'bullet', ' or ']), 13), p('<code class="i">-word</code> = NOT · <code class="i">"…"</code> = phrase (<code class="i">&lt;-&gt;</code>) · <code class="i">or</code> = OR · and websearch_to_tsquery <b>never</b> raises a syntax error on user input.', 18)), 'r46')}`, giua: true },

  /* 23 */ { t: 'S2 · The cost of ranking', body: `${nho(K('S2P', ['Bitmap Index Scan on product_search_gin', 'Sort Key', 'Execution Time'], { tt: true, bo: ['Recheck Cond', 'Sort Method', 'Planning Time', 'Rows Removed', 'Filter: is_active'] }), 12.5)}
${two(box('Finding is cheap', `The GIN hands over the 2.502 matching rows in <b>${idxMs('S2P')} ms</b> (${lay('S2P', /product_search_gin[^\n]*\n[^\n]*\n\s+Buffers: shared hit=(\d+)/)} index pages).`, 'xanh'),
    box('Ranking is not', `<b>ts_rank</b> must read and score <b>every</b> match, then sort — most of the <b>${ms('S2P')} ms</b>. Full-text in PostgreSQL cannot stop early: big result sets are its weak spot.`, 'do2'))}`, giua: true, to: true },

  /* 24 */ { t: 'S2 · Keeping the document fresh', body: `${two(ma(sql(`CREATE FUNCTION category_renamed() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE product SET category_id = category_id      -- "touch" the rows
  WHERE category_id IN (SELECT id FROM category
                        WHERE id = NEW.id OR parent_id = NEW.id);
  RETURN NULL;
END $$;
CREATE TRIGGER category_renamed AFTER UPDATE OF name ON category
  FOR EACH ROW WHEN (OLD.name IS DISTINCT FROM NEW.name)
  EXECUTE FUNCTION category_renamed();`, { sm: true, hl: [4, 9] }), 12.5),
    col(sql(`UPDATE category SET name = 'Giáo trình CNTT'
WHERE name = 'Giáo trình IT';`, { sm: true }), P(O.S2S, { sm: true }),
      p(`Then <code class="i">'cntt'</code> finds <b>${vn(lay('S2T', /\n\s+(\d+)\n/))}</b> rows: 6 products + 7.500 listings, re-indexed by the product trigger.`, 18)), 'r64')}
<div class="tcap">EXPLAIN ANALYZE lists the triggers that ran (inside BEGIN … ROLLBACK)</div>
${two(nho(P(O.S2U, { sm: true, title: 'UPDATE product SET stock = stock - 1 WHERE sku = …' }), 11.5),
    nho(P(O.S2V, { sm: true, title: "UPDATE product SET name = name || ' ' WHERE sku = …", hl: [7] }), 11.5))}`, giua: true },

  /* 25 */ { t: 'S3 · Typos: trigram scores and thresholds', body: `${p(`Full-text finds <b>${lay('S3A', /\n\s+(\d+)\n/)}</b> rows for <code class="i">'casoi fx 580'</code>: a typo is a different word. Trigrams compare pieces of three letters:`, 20)}
<div style="flex-shrink:0">${nho(PO('S3D', ['CT1001']), 13)}</div>
${two(col(PO('S3E'), PO('S3F')), col(sql(`SET pg_trgm.word_similarity_threshold = 0.5;`, { sm: true }), PO('S3H'),
      p('<code class="i">%</code> needs ≥ 0,3, <code class="i">&lt;%</code> ≥ 0,6. The typo scores 0,563 ⇒ at 0,5 it finds the FX-580 and its listings.', 18)))}
${p('<b>similarity</b>: query vs the <b>whole</b> name — long names score low. <b>word_similarity</b>: query vs the best-matching <b>part</b> — the search-box question.', 19)}`, giua: true },

  /* 26 */ { t: 'S3 · “Contains” with a trigram GIN', body: `${two(col(sql(`ALTER TABLE product ADD COLUMN name_fold text
  GENERATED ALWAYS AS (lower(f_unaccent(name))) STORED;
CREATE INDEX product_name_trgm
  ON product USING GIN (name_fold gin_trgm_ops);`, { sm: true, hl: [2, 4] }), nho(PO('S3C'), 12.5)),
    col(box('Folded once, stored', 'The name without accents and in lower case is computed on write — every search compares against it, and the index is built on it.', 'xanh')), 'r64')}
${two(nho(K('S3I', ['Seq Scan', 'Execution Time'], { tt: true, bo: ['Planning Time'], title: "before — LIKE '%mildliner%' (costs trimmed)" }), 12),
    nho(K('S3K', ['Bitmap Index Scan on product_name_trgm', 'Execution Time'], { tt: true, bo: ['Planning Time', 'Recheck Cond', 'Heap Blocks'], title: 'after — the same query (costs trimmed, lines selected)' }), 12))}
${p(`The typo query <code class="i">WHERE 'casoi fx 580' &lt;% name_fold</code> uses the same index: <code class="i">Index Cond: (name_fold %&gt; 'casoi fx 580'::text)</code> — %&gt; is the mirror of &lt;%.`, 18)}`, giua: true },

  /* 27 */ { t: 'S3 · Autocomplete = the 8 nearest names: GiST KNN', body: `${two(col(sql(`CREATE INDEX product_name_gist
  ON product USING GIST
     (name_fold gist_trgm_ops);
SELECT id, name FROM product WHERE is_active
ORDER BY 'thien long tl' <<-> name_fold
LIMIT 8;`, { sm: true, hl: [5] }).replace('<pre class="vs sm">', '<pre class="vs sm" style="font-size:12.5px">'),
      p(`${kw('<<->', 'word distance = 1 − word_similarity')} GiST walks the <b>nearest</b> entries first and stops at LIMIT: <b>${trang('S3N')}</b> pages, <b>${ms('S3N', 2)} ms</b>.`, 19)),
    nho(K('S3N', ['Index Scan using product_name_gist', 'Order By', 'Execution Time'], { tt: true, bo: ['Planning Time'] }), 12), 'r46')}
${vsd(col(sql(`ORDER BY name_fold <<-> 'thien long tl' LIMIT 8`, { sm: true }), nho(K('S3P', ['Seq Scan', 'Sort Key', 'Execution Time'], { tt: true, bo: ['Planning Time', 'Sort Method', 'Rows Removed', 'Filter: is_active', 'Buffers'] }), 11.5)),
  col(sql(`ORDER BY 'thien long tl' <<-> name_fold LIMIT 8`, { sm: true }),
    p(`<b>Query left, column right</b> = word_similarity(query, name): the operator the index supports (the plan shows it as <code class="i">name_fold &lt;-&gt;&gt; …</code>). Swapped, it is word_similarity(<b>name</b>, query) — another function: a Seq Scan over 54.048 rows and a sort, <b>${ms('S3P', 0)} ms</b>.`, 18)), '✗ swapped operands', '✓ as indexed')}`, giua: true },

  /* 28 */ { t: 'S3 · The price list of search', body: `${thanhChiMuc()}
${two(box('Build what a screen needs', `GiST (KNN suggestions) is the biggest — more than half the ${lay('J3I', /\| (\d+ MB)/)} table. Trigram GIN for “contains” / typos, full-text GIN for words, attribute GIN for filters, a small B-tree for the page range.`, ''),
    box('Every index is paid on every write', 'The back-fill and the category rename of S2 updated tens of thousands of rows — each one through all of these indexes (Lab 5, P6).', 'do2'))}`, giua: true },

  /* 29 */ { t: 'S4 · One function for the search box', body: two(ma(sql(`CREATE FUNCTION search_products(q text, lim int DEFAULT 20)
RETURNS TABLE (id bigint, sku text, name text, how text, score real)
LANGUAGE plpgsql STABLE
SET pg_trgm.word_similarity_threshold = 0.5
SET search_path = shop, public
AS $$
BEGIN
  RETURN QUERY
    SELECT p.id, p.sku, p.name, 'fts', ts_rank(p.search_tsv, tq)
    FROM product p, websearch_to_tsquery('vn_unaccent', q) AS tq
    WHERE p.is_active AND p.search_tsv @@ tq
    ORDER BY 5 DESC, p.id LIMIT lim;
  IF FOUND THEN RETURN; END IF;
  RETURN QUERY
    SELECT p.id, p.sku, p.name, 'fuzzy',
           word_similarity(lower(f_unaccent(q)), p.name_fold)
    FROM product p
    WHERE p.is_active AND lower(f_unaccent(q)) <% p.name_fold
    ORDER BY 5 DESC, p.id LIMIT lim;
END $$;`, { sm: true, hl: [4, 5, 13, 16, 18] }), 12.5),
    col(steps(['<b>full-text</b> first: precise, ranked by weight A/B/C', '<code class="i">IF FOUND THEN RETURN</code> — <code class="i">RETURN QUERY</code> sets FOUND', 'else <b>trigram</b>: forgiving, ranked by word_similarity', 'on ties: <b>id</b> ⇒ the shop’s own products (1–48) first']),
      box('CREATE FUNCTION … SET', 'The function carries its <b>own</b> settings while it runs: the threshold — and the search path (why: slide 32).', 'xanh')), 'r64'), giua: true },

  /* 30 */ { t: 'S4 · Five things a customer types', body: `${two(col(nho(PO('S4B', ['fts']), 11.5), nho(PO('S4C', ['fts']), 11.5), nho(PO('S4D', ['fuzzy']), 11.5)),
    col(nho(PO('S4E', ['fuzzy']), 11.5), nho(PO('S4F'), 11.5),
      P(['but bi thien long', 'casoi fx 580', 'mildliner'].map((x, i) => `${("'" + x + "'").padEnd(20)} → ${O[['S4G', 'S4H', 'S4I'][i]].match(/Time: ([\d.]+ ms)/)[1]}`).join('\n'), { sm: true, title: 'count(search_products(…)) · psql \\timing — real run' })))}
${p('“giáo trình” typed <b>with</b> accents works too · nonsense gets an honest empty result · <code class="i">EXPLAIN</code> sees only a <b>Function Scan</b> — tune the two inner queries by themselves.', 19)}`, giua: true },

  /* 31 */ { t: 'In a real Node app: what Prisma sees and sends', body: two(col(ma(sql(`// npx prisma db pull (lines selected, wrapped)
model product {
  attrs      Json   @default("{}")
  search_tsv Unsupported("tsvector")?
  name_fold  String?
    @default(dbgenerated("lower(f_unaccent(name))"))
  @@index([attrs(ops: JsonbPathOps)], type: Gin)
  @@index([name_fold(ops: raw("gin_trgm_ops"))],
          type: Gin)
}
// warning: expression index product_pages
//          is not supported by Prisma`, { sm: true, lang: 'typescript' }), 12.5),
      box('db pull says', '<b>tsvector</b> = Unsupported (the trigger owns it) · <b>name_fold</b> looks like a default but is GENERATED — writing it fails · the <b>expression index</b> lives in a hand-written migration.', 'lam')),
    col(nho(P(`findMany({ where: { attrs: { path: ['tags'],
                       array_contains: ['ôn thi'] } } })
⇒ WHERE (attrs#>ARRAY[$1]::text[])::jsonb @> $2 …
 Seq Scan on product
   Filter: (((attrs #> ARRAY[$1]) @> $2) AND …)`, { sm: true, title: 'Prisma path filter → EXPLAIN (GENERIC_PLAN) — real (wrapped)', hl: [4] }), 12.5),
      nho(P(`$queryRaw\`… WHERE is_active AND attrs @> \${filter}::jsonb …\`
 Bitmap Heap Scan on product
   Recheck Cond: (attrs @> $1)
   ->  Bitmap Index Scan on product_attrs_gin`, { sm: true, title: '$queryRaw with @> → EXPLAIN (GENERIC_PLAN) — real (wrapped)', hl: [4] }), 12.5),
      p('Prisma’s <code class="i">path</code> filters compile to <code class="i">#&gt;</code> — an expression the GIN does not index. Indexed filters go through <b>$queryRaw + @&gt;</b>, still as a parameter.', 18)), 'r46'), giua: true },

  /* 32 */ { t: 'Trap: the app’s search path is not yours', body: `${nho(P(`prisma:query SELECT sku, name, how, score FROM search_products($1, 3)
params ["casoi fx 580"]
Raw query failed. Code: \`42883\`. Message: \`ERROR: function word_similarity(text, text) does not exist
HINT: No function matches the given name and argument types. You might need to add explicit type casts.\`
  code: 'P2010'`, { sm: true, title: 'Prisma 5.22 — the first version of search_products, called from the app (real, wrapped)', hl: [3] }), 12.5)}
${two(box('Why only the typo fails', 'psql: <code class="i">search_path = shop, public</code>. Prisma <code class="i">?schema=shop</code> ⇒ <code class="i">search_path = shop</code>. Full-text finds “but bi thien long”; the <b>fuzzy</b> branch needs <code class="i">word_similarity</code> and <code class="i">&lt;%</code> from <b>public</b>.', 'do2'),
    col(sql(`CREATE FUNCTION search_products(q text, lim int DEFAULT 20) …
SET pg_trgm.word_similarity_threshold = 0.5
SET search_path = shop, public      -- pin it (as lesson 12.1)`, { sm: true, hl: [3] }),
      nho(P(`params ["casoi fx 580"] 49ms
rows [{"sku":"CT1001","name":"Máy tính Casio FX-580VN X","how":"fuzzy",…}, …]`, { sm: true, title: 'Prisma — after the fix (real, wrapped)' }), 12)), 'r46')}
${box('Stay in PostgreSQL — or move?', 'Stay while results are small after filters and one transaction keeps data + search in sync. Move to <b>Meilisearch / Elasticsearch</b> for BM25 relevance, typo tolerance on every word, Vietnamese analyzers, facets on huge result sets — at the price of a second copy of the data, kept in sync.', 'lam')}`, giua: true },

  /* 33 */ { t: 'Self-check — the end state', body: two(col(tbl(['typed', 'results', 'how'], SC2_ROWS, { cap: 'search_products(x, 100000) — real output', hl: [1, 4] }),
      nho(PO('SC1'), 12.5), nho(PO('SC3'), 12.5)),
    col(`<ol style="font-size:20px;margin:0;padding-left:26px;display:flex;flex-direction:column;gap:10px">
<li>Why did <code class="i">p.attrs || f.doc-&gt;'specs'</code> delete brand, color, tags — without any error?</li>
<li><code class="i">-&gt;&gt;'tip_mm' = '0.5'</code>: 6.255 rows · <code class="i">@&gt; '{"tip_mm": 0.5}'</code>: 7.506. Which is right?</li>
<li>Why a trigger and not a generated column for the search document — and why a second trigger on category?</li></ol>`,
      box('Answers', '1 · Same precedence, left to right: <code class="i">(p.attrs || f.doc) -&gt; \'specs\'</code> — still a valid object, so nothing complains.<br>2 · @&gt;: JSON compares numbers (0.50 = 0.5); text \'0.50\' ≠ \'0.5\'.<br>3 · A generated column reads only its own row; a rename must rebuild the products’ documents.', 'xanh')), 'r64'), giua: true },

  /* 34 */ { t: 'Summary — and next', body: two(`<ul style="font-size:22px">
<li><b>Survey</b> JSON before importing: keys × <code class="i">jsonb_typeof</code></li>
<li><b>Parenthesise</b> <code class="i">||</code> with <code class="i">-&gt;</code>; guard attrs with <b>CHECK</b></li>
<li>Filters: <code class="i">@&gt;</code> + GIN path_ops; ranges: cast + B-tree</li>
<li><b>JSON_TABLE</b> view for exports; ERROR ON ERROR when it must be complete</li>
<li><b>vn_unaccent</b> + weights A/B/C kept by a <b>trigger</b></li>
<li><b>pg_trgm</b>: word_similarity for typos, GiST KNN for suggestions</li>
<li>One <b>search_products</b> with its own SET — called from Prisma</li></ul>`,
    col(box('Next: Chapter 14', 'Connections and pooling, <b>VACUUM and bloat</b> — the 60.048 rows you updated twice left dead tuples — and monitoring.', 'lam'),
      box('Then Lab 8 (after Chapter 15)', 'Back up and replicate CT Shop. <code class="i">lab8-start.sql</code> rebuilds the shop at its standard size.', ''),
      box('Practise', 'Code Lab — PostgreSQL track: JSONB and search exercises, from easy to hard.', 'xanh')), 'r64'), giua: true, to: true },
]);
