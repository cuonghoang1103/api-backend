\set ON_ERROR_STOP on
\pset pager off
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (id INT PRIMARY KEY, name TEXT, attrs JSONB);
INSERT INTO products VALUES
 (1,'Laptop',   '{"brand":"Acme","price":1200,"specs":{"ram":16,"cpu":"i7"},"tags":["computer","portable"]}'),
 (2,'Mouse',    '{"brand":"Acme","price":25,"specs":{"dpi":1600},"tags":["accessory"]}'),
 (3,'Keyboard', '{"brand":"KeyCo","price":80,"specs":{"switches":"blue"},"tags":["accessory","mechanical"]}');

\echo '===== EX 1: Extract Fields with the Arrow Operators ====='
SELECT name, attrs ->> 'brand' AS brand, (attrs ->> 'price')::int AS price FROM products ORDER BY id;

\echo '===== EX 2: Reach into Nested Objects ====='
SELECT name, attrs -> 'specs' ->> 'ram' AS ram, attrs #>> '{specs,cpu}' AS cpu FROM products ORDER BY id;

\echo '===== EX 3: Filter Rows by JSON Content and Containment ====='
SELECT (SELECT count(*) FROM products WHERE attrs ->> 'brand' = 'Acme') AS brand, (SELECT count(*) FROM products WHERE (attrs ->> 'price')::int > 50) AS expensive, (SELECT count(*) FROM products WHERE attrs @> '{"brand":"Acme"}') AS contains;

\echo '===== EX 4: Work with JSON Arrays ====='
SELECT (SELECT string_agg(name || ':' || tag, ', ' ORDER BY name, tag) FROM products, jsonb_array_elements_text(attrs -> 'tags') AS tag) AS expanded, (SELECT count(*) FROM products WHERE attrs -> 'tags' @> '["accessory"]') AS accessory, (SELECT count(*) FROM products WHERE attrs -> 'tags' ? 'mechanical') AS mechanical;

\echo '===== EX 5: Modify JSONB with jsonb_set, Merge, and Delete ====='
WITH edited AS (SELECT (jsonb_set(attrs, '{price}', '999') || '{"onSale": true}'::jsonb) - 'specs' AS a FROM products WHERE id = 1) SELECT (a ->> 'price')::int AS price, (a ->> 'onSale')::boolean AS onsale, (a ->> 'specs' IS NULL) AS specs_removed FROM edited;

\echo '===== EX 6: Inspect Keys and Values with jsonb_each and Existence ====='
SELECT (SELECT string_agg(k, ', ' ORDER BY k) FROM jsonb_object_keys((SELECT attrs FROM products WHERE id = 1)) AS k) AS keys, (SELECT count(*) FROM products WHERE attrs ? 'price') AS haveprice, (SELECT count(*) FROM products WHERE attrs ?| array['weight','brand']) AS eitherkey;

\echo '===== EX 7: Build JSON from Rows with jsonb_build_object and jsonb_agg ====='
WITH built AS (SELECT jsonb_agg(jsonb_build_object('id', id, 'name', name, 'price', (attrs ->> 'price')::int) ORDER BY id) AS arr FROM products) SELECT jsonb_array_length(arr) AS len, arr -> 0 ->> 'name' AS first FROM built;

\echo '===== EX 8: Expand JSON Arrays into Relational Rows ====='
SELECT tag, count(*) AS uses FROM products, jsonb_array_elements_text(attrs -> 'tags') AS tag GROUP BY tag ORDER BY count(*) DESC, tag;

\echo '===== EX 9: Index JSONB for Fast Containment Queries ====='
CREATE INDEX IF NOT EXISTS idx_products_attrs ON products USING GIN (attrs);
SELECT (SELECT indexname FROM pg_indexes WHERE tablename = 'products' AND indexname = 'idx_products_attrs') AS index, (SELECT count(*) FROM products WHERE attrs @> '{"brand":"Acme"}') AS acme;

\echo '===== EX 10: Query and Reshape a Nested Document Catalog ====='
WITH elems AS (SELECT jsonb_agg(jsonb_build_object('product', name, 'price', (attrs ->> 'price')::int, 'tag_count', jsonb_array_length(attrs -> 'tags'), 'first_spec', (SELECT min(k) FROM jsonb_object_keys(attrs -> 'specs') AS k)) ORDER BY (attrs ->> 'price')::int DESC) AS arr FROM products WHERE attrs ->> 'brand' = 'Acme') SELECT jsonb_array_length(arr) AS count, arr -> 0 ->> 'product' AS top FROM elems;
