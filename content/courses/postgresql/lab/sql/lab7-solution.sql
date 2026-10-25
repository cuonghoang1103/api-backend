-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop · Lab 7 — SOLUTION: product attributes in JSONB + a search box that forgives
-- Lab 7 — ĐÁP ÁN: thuộc tính sản phẩm JSONB + ô tìm kiếm gõ không dấu / gõ sai vẫn ra
-- cuongthai.com/courses/postgresql · PostgreSQL 17 · run AFTER lab7-start.sql, in ONE psql session:
--   docker cp lab7-solution.sql pgdemo:/tmp/
--   docker exec -it pgdemo psql -U postgres -d ctshop -f /tmp/lab7-solution.sql
-- Numbers in the comments come from one real run (PostgreSQL 17.11). Times differ per machine; counts do not.
-- ═══════════════════════════════════════════════════════════════════════════
\pset pager off
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
\timing on
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
\timing off
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
\timing on
CREATE INDEX product_attrs_gin ON product USING GIN (attrs jsonb_path_ops);
\timing off
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
\copy (SELECT * FROM product_attr_export WHERE sku LIKE 'CT%' ORDER BY sku, tag) TO '/tmp/lab7-attrs.csv' WITH (FORMAT csv, HEADER)
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
\timing on
UPDATE product SET name = name;   -- back-fill: fires the trigger once per row
CREATE INDEX product_search_gin ON product USING GIN (search_tsv);
\timing off
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
\timing on
UPDATE category SET name = 'Giáo trình CNTT' WHERE name = 'Giáo trình IT';
\timing off
SELECT count(*) AS found_by_cntt FROM product WHERE search_tsv @@ websearch_to_tsquery('vn_unaccent', 'cntt');   -- 7506 = 6 products + 7.500 listings
-- the trigger fires on a name change, not on a stock change
BEGIN;
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF) UPDATE product SET stock = stock - 1 WHERE sku = 'CT0501';
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF) UPDATE product SET name = name || ' ' WHERE sku = 'CT0501';
ROLLBACK;

-- ═══ S3 · typos and autocomplete: pg_trgm ═══
SELECT count(*) AS fts_matches FROM product WHERE search_tsv @@ websearch_to_tsquery('vn_unaccent', 'casoi fx 580');   -- 0: a typo is a different lexeme
\timing on
ALTER TABLE product ADD COLUMN name_fold text GENERATED ALWAYS AS (lower(f_unaccent(name))) STORED;
\timing off
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
\timing on
CREATE INDEX product_name_trgm ON product USING GIN (name_fold gin_trgm_ops);
\timing off
EXPLAIN (ANALYZE, BUFFERS) SELECT count(*) FROM product WHERE name_fold LIKE '%mildliner%';
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name FROM product
WHERE is_active AND 'casoi fx 580' <% name_fold
ORDER BY word_similarity('casoi fx 580', name_fold) DESC, id LIMIT 20;
-- autocomplete = the 8 NEAREST names: KNN needs GiST (it walks nearest-first and stops at LIMIT)
\timing on
CREATE INDEX product_name_gist ON product USING GIST (name_fold gist_trgm_ops);
\timing off
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
\timing on
SELECT count(*) FROM search_products('but bi thien long');
SELECT count(*) FROM search_products('casoi fx 580');
SELECT count(*) FROM search_products('mildliner');
\timing off
-- EXPLAIN sees only a black box: the plan inside the function is invisible here
EXPLAIN (ANALYZE, COSTS OFF) SELECT * FROM search_products('casoi fx 580');

-- ═══ self-check — your end state must match ═══
SELECT conname FROM pg_constraint WHERE conrelid = 'product'::regclass AND contype = 'c' ORDER BY conname;
SELECT x AS typed, count(r.id) AS results, min(r.how) AS how
FROM unnest(ARRAY['but bi thien long', 'giao trinh cntt', 'casoi fx 580', 'thien lomg', 'so tay -moleskine']) AS x
LEFT JOIN LATERAL search_products(x, 100000) AS r ON true
GROUP BY x ORDER BY x;   -- 2252 fts · 1001 fuzzy · 6756 fts · 7757 fts · 7507 fuzzy
SELECT count(*) AS products, count(search_tsv) AS with_search_doc, count(name_fold) AS with_name_fold FROM product;
DROP TABLE spec_feed;   -- the staging table has done its job
