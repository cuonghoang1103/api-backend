/** Output THẬT PostgreSQL 17.11 (pgcourse17, schema ch13) — sinh tự động từ video-bai-giang/src/khung/pg/that/pg-13-{1..4}.sql + .out.txt.
 *  T['1'][i] = { sql, out }. KHÔNG sửa tay. */
export const T = {
 "1": [
  {
   "sql": "SET search_path = ch13;",
   "out": "SET"
  },
  {
   "sql": "SELECT id, name, props FROM product ORDER BY id;",
   "out": " id |     name      |                                             props                                              \n----+---------------+------------------------------------------------------------------------------------------------\n  1 | Laptop Pro 14 | {\"tags\": [\"laptop\", \"pro\"], \"brand\": \"Acme\", \"price\": 1299, \"specs\": {\"cpu\": \"M3\", \"ram\": 16}}\n  2 | Laptop Air 13 | {\"tags\": [\"laptop\", \"light\"], \"brand\": \"Acme\", \"price\": 999, \"specs\": {\"cpu\": \"M2\", \"ram\": 8}}\n  3 | Phone X       | {\"tags\": [\"phone\"], \"brand\": \"Zeta\", \"price\": 799, \"specs\": {\"ram\": 8, \"storage\": 256}}\n  4 | Tablet Mini   | {\"tags\": [\"tablet\", \"light\"], \"brand\": \"Zeta\", \"price\": 449, \"specs\": {\"ram\": 4}}\n  5 | Keyboard K1   | {\"tags\": [\"accessory\"], \"brand\": \"Acme\", \"price\": 89}\n(5 rows)"
  },
  {
   "sql": "SELECT '{\"b\":1,\"a\":2,\"a\":3}'::json  AS kieu_json;",
   "out": "      kieu_json      \n---------------------\n {\"b\":1,\"a\":2,\"a\":3}\n(1 row)"
  },
  {
   "sql": "SELECT '{\"b\":1,\"a\":2,\"a\":3}'::jsonb AS kieu_jsonb;",
   "out": "    kieu_jsonb    \n------------------\n {\"a\": 3, \"b\": 1}\n(1 row)"
  },
  {
   "sql": "SELECT '{ \"name\" : \"Phone X\",   \"id\": 3, \"ok\":true }'::json AS json_giu_nguyen,\n       '{ \"name\" : \"Phone X\",   \"id\": 3, \"ok\":true }'::jsonb AS jsonb_chuan_hoa;",
   "out": "               json_giu_nguyen                |             jsonb_chuan_hoa              \n----------------------------------------------+------------------------------------------\n { \"name\" : \"Phone X\",   \"id\": 3, \"ok\":true } | {\"id\": 3, \"ok\": true, \"name\": \"Phone X\"}\n(1 row)"
  },
  {
   "sql": "SELECT '{\"a\":1,\"b\":2}'::json  = '{\"b\":2,\"a\":1}'::json;",
   "out": "ERROR:  operator does not exist: json = json\nLINE 1: SELECT '{\"a\":1,\"b\":2}'::json  = '{\"b\":2,\"a\":1}'::json;\n                                      ^\nHINT:  No operator matches the given name and argument types. You might need to add explicit type casts."
  },
  {
   "sql": "SELECT '{\"a\":1,\"b\":2}'::jsonb = '{\"b\":2,\"a\":1}'::jsonb AS bang_nhau;",
   "out": " bang_nhau \n-----------\n t\n(1 row)"
  },
  {
   "sql": "SELECT '1.50'::jsonb AS so, '[1, \"1\", true, null]'::jsonb AS mang, jsonb_typeof('null'::jsonb) AS kieu_null;",
   "out": "  so  |         mang         | kieu_null \n------+----------------------+-----------\n 1.50 | [1, \"1\", true, null] | null\n(1 row)"
  },
  {
   "sql": "SELECT name,\n       props->'brand'               AS mui_ten,\n       props->>'brand'              AS mui_ten_kep,\n       jsonb_typeof(props->'brand') AS kieu\nFROM product ORDER BY id LIMIT 3;",
   "out": "     name      | mui_ten | mui_ten_kep |  kieu  \n---------------+---------+-------------+--------\n Laptop Pro 14 | \"Acme\"  | Acme        | string\n Laptop Air 13 | \"Acme\"  | Acme        | string\n Phone X       | \"Zeta\"  | Zeta        | string\n(3 rows)"
  },
  {
   "sql": "SELECT pg_typeof(props->'brand') AS kieu_cua_mui_ten, pg_typeof(props->>'brand') AS kieu_cua_mui_ten_kep FROM product WHERE id = 1;",
   "out": " kieu_cua_mui_ten | kieu_cua_mui_ten_kep \n------------------+----------------------\n jsonb            | text\n(1 row)"
  },
  {
   "sql": "SELECT count(*) FROM product WHERE props->'brand' = 'Acme';",
   "out": "ERROR:  invalid input syntax for type json\nLINE 1: SELECT count(*) FROM product WHERE props->'brand' = 'Acme';\n                                                            ^\nDETAIL:  Token \"Acme\" is invalid.\nCONTEXT:  JSON data, line 1: Acme"
  },
  {
   "sql": "SELECT count(*) FROM product WHERE props->>'brand' = 'Acme';",
   "out": " count \n-------\n     3\n(1 row)"
  },
  {
   "sql": "SELECT name,\n       props->'specs'->>'ram'   AS ram,\n       props#>>'{specs,cpu}'    AS cpu\nFROM product ORDER BY id;",
   "out": "     name      | ram | cpu \n---------------+-----+-----\n Laptop Pro 14 | 16  | M3\n Laptop Air 13 | 8   | M2\n Phone X       | 8   | \n Tablet Mini   | 4   | \n Keyboard K1   |     | \n(5 rows)"
  },
  {
   "sql": "SELECT name, props->'tags'->0 AS tag_dau, props->'tags'->>-1 AS tag_cuoi, props #> '{tags,1}' AS tag_hai, jsonb_array_length(props->'tags') AS so_tag\nFROM product ORDER BY id;",
   "out": "     name      |   tag_dau   | tag_cuoi  | tag_hai | so_tag \n---------------+-------------+-----------+---------+--------\n Laptop Pro 14 | \"laptop\"    | pro       | \"pro\"   |      2\n Laptop Air 13 | \"laptop\"    | light     | \"light\" |      2\n Phone X       | \"phone\"     | phone     |         |      1\n Tablet Mini   | \"tablet\"    | light     | \"light\" |      2\n Keyboard K1   | \"accessory\" | accessory |         |      1\n(5 rows)"
  },
  {
   "sql": "SELECT name, props->>'Brand' AS go_sai_hoa_thuong, props->>'brnd' AS go_sai_chinh_ta FROM product WHERE id = 1;",
   "out": "     name      | go_sai_hoa_thuong | go_sai_chinh_ta \n---------------+-------------------+-----------------\n Laptop Pro 14 |                   | \n(1 row)"
  },
  {
   "sql": "SELECT name, props->>'price' AS price FROM product WHERE props->>'price' < '500' ORDER BY id;",
   "out": "     name      | price \n---------------+-------\n Laptop Pro 14 | 1299\n Tablet Mini   | 449\n(2 rows)"
  },
  {
   "sql": "SELECT name, props->>'price' AS price FROM product WHERE (props->>'price')::numeric < 500 ORDER BY id;",
   "out": "    name     | price \n-------------+-------\n Tablet Mini | 449\n Keyboard K1 | 89\n(2 rows)"
  },
  {
   "sql": "SELECT name, (props->'price')::numeric AS price FROM product WHERE (props->'price')::numeric < 500 ORDER BY id;",
   "out": "    name     | price \n-------------+-------\n Tablet Mini |   449\n Keyboard K1 |    89\n(2 rows)"
  },
  {
   "sql": "SELECT name FROM product WHERE props @> '{\"brand\":\"Acme\"}' ORDER BY id;",
   "out": "     name      \n---------------\n Laptop Pro 14\n Laptop Air 13\n Keyboard K1\n(3 rows)"
  },
  {
   "sql": "SELECT name FROM product WHERE props ? 'specs' ORDER BY id;",
   "out": "     name      \n---------------\n Laptop Pro 14\n Laptop Air 13\n Phone X\n Tablet Mini\n(4 rows)"
  },
  {
   "sql": "SELECT name FROM product WHERE props->'specs' ?| array['storage','cpu'] ORDER BY id;",
   "out": "     name      \n---------------\n Laptop Pro 14\n Laptop Air 13\n Phone X\n(3 rows)"
  },
  {
   "sql": "SELECT name FROM product WHERE props->'specs' ?& array['ram','cpu'] ORDER BY id;",
   "out": "     name      \n---------------\n Laptop Pro 14\n Laptop Air 13\n(2 rows)"
  },
  {
   "sql": "SELECT jsonb_set(props, '{price}', '1199') AS doi_gia FROM product WHERE id = 1;",
   "out": "                                            doi_gia                                             \n------------------------------------------------------------------------------------------------\n {\"tags\": [\"laptop\", \"pro\"], \"brand\": \"Acme\", \"price\": 1199, \"specs\": {\"cpu\": \"M3\", \"ram\": 16}}\n(1 row)"
  },
  {
   "sql": "SELECT jsonb_set(props, '{specs,ram}', '32') -> 'specs' AS doi_ram FROM product WHERE id = 1;",
   "out": "         doi_ram          \n--------------------------\n {\"cpu\": \"M3\", \"ram\": 32}\n(1 row)"
  },
  {
   "sql": "SELECT jsonb_set(props, '{specs,gpu}', '\"10-core\"') -> 'specs' AS them_khoa FROM product WHERE id = 1;",
   "out": "                 them_khoa                  \n--------------------------------------------\n {\"cpu\": \"M3\", \"gpu\": \"10-core\", \"ram\": 16}\n(1 row)"
  },
  {
   "sql": "SELECT jsonb_set(props, '{specs,gpu}', '\"10-core\"', false) -> 'specs' AS khong_tao_moi FROM product WHERE id = 1;",
   "out": "      khong_tao_moi       \n--------------------------\n {\"cpu\": \"M3\", \"ram\": 16}\n(1 row)"
  },
  {
   "sql": "SELECT props || '{\"color\":\"silver\",\"price\":1249}' AS gop FROM product WHERE id = 5;",
   "out": "                                    gop                                     \n----------------------------------------------------------------------------\n {\"tags\": [\"accessory\"], \"brand\": \"Acme\", \"color\": \"silver\", \"price\": 1249}\n(1 row)"
  },
  {
   "sql": "SELECT props - 'tags' AS bo_khoa FROM product WHERE id = 5;",
   "out": "            bo_khoa             \n--------------------------------\n {\"brand\": \"Acme\", \"price\": 89}\n(1 row)"
  },
  {
   "sql": "SELECT props #- '{specs,cpu}' AS bo_duong_dan FROM product WHERE id = 2;",
   "out": "                                   bo_duong_dan                                    \n-----------------------------------------------------------------------------------\n {\"tags\": [\"laptop\", \"light\"], \"brand\": \"Acme\", \"price\": 999, \"specs\": {\"ram\": 8}}\n(1 row)"
  },
  {
   "sql": "SELECT (props->'tags') || '[\"sale\"]' AS them_vao_mang, (props->'tags') - 'pro' AS bo_khoi_mang FROM product WHERE id = 1;",
   "out": "       them_vao_mang       | bo_khoi_mang \n---------------------------+--------------\n [\"laptop\", \"pro\", \"sale\"] | [\"laptop\"]\n(1 row)"
  },
  {
   "sql": "BEGIN;",
   "out": "BEGIN"
  },
  {
   "sql": "UPDATE product SET props = jsonb_set(props, '{price}', to_jsonb(1199)) WHERE id = 1 RETURNING id, props->'price' AS price;",
   "out": " id | price \n----+-------\n  1 | 1199\n(1 row)\n\nUPDATE 1"
  },
  {
   "sql": "UPDATE product SET props = props || jsonb_build_object('stock', 12) WHERE id = 1 RETURNING id, props;",
   "out": " id |                                                    props                                                    \n----+-------------------------------------------------------------------------------------------------------------\n  1 | {\"tags\": [\"laptop\", \"pro\"], \"brand\": \"Acme\", \"price\": 1199, \"specs\": {\"cpu\": \"M3\", \"ram\": 16}, \"stock\": 12}\n(1 row)\n\nUPDATE 1"
  },
  {
   "sql": "UPDATE product SET props = jsonb_set(props, '{note}', NULL) WHERE id = 2 RETURNING id, props;",
   "out": "ERROR:  null value in column \"props\" of relation \"product\" violates not-null constraint\nDETAIL:  Failing row contains (2, Laptop Air 13, null)."
  },
  {
   "sql": "ROLLBACK;",
   "out": "ROLLBACK"
  },
  {
   "sql": "SELECT jsonb_set('{\"a\":1}', '{b}', NULL) AS ra_null;",
   "out": " ra_null \n---------\n \n(1 row)"
  },
  {
   "sql": "SELECT jsonb_set_lax('{\"a\":1}', '{b}', NULL) AS lax_mac_dinh, jsonb_set_lax('{\"a\":1}', '{a}', NULL, true, 'delete_key') AS lax_xoa_khoa;",
   "out": "    lax_mac_dinh     | lax_xoa_khoa \n---------------------+--------------\n {\"a\": 1, \"b\": null} | {}\n(1 row)"
  },
  {
   "sql": "SELECT jsonb_build_object('id', id, 'name', name, 'brand', props->>'brand') AS the FROM product WHERE id <= 2 ORDER BY id;",
   "out": "                         the                         \n-----------------------------------------------------\n {\"id\": 1, \"name\": \"Laptop Pro 14\", \"brand\": \"Acme\"}\n {\"id\": 2, \"name\": \"Laptop Air 13\", \"brand\": \"Acme\"}\n(2 rows)"
  },
  {
   "sql": "SELECT jsonb_agg(name ORDER BY id) AS ten_acme FROM product WHERE props @> '{\"brand\":\"Acme\"}';",
   "out": "                     ten_acme                      \n---------------------------------------------------\n [\"Laptop Pro 14\", \"Laptop Air 13\", \"Keyboard K1\"]\n(1 row)"
  },
  {
   "sql": "SELECT key, value, jsonb_typeof(value) AS kieu FROM product, jsonb_each(props) WHERE id = 3;",
   "out": "  key  |           value            |  kieu  \n-------+----------------------------+--------\n tags  | [\"phone\"]                  | array\n brand | \"Zeta\"                     | string\n price | 799                        | number\n specs | {\"ram\": 8, \"storage\": 256} | object\n(4 rows)"
  },
  {
   "sql": "SELECT name, tag FROM product, jsonb_array_elements_text(props->'tags') AS tag ORDER BY id, tag;",
   "out": "     name      |    tag    \n---------------+-----------\n Laptop Pro 14 | laptop\n Laptop Pro 14 | pro\n Laptop Air 13 | laptop\n Laptop Air 13 | light\n Phone X       | phone\n Tablet Mini   | light\n Tablet Mini   | tablet\n Keyboard K1   | accessory\n(8 rows)"
  },
  {
   "sql": "SELECT tag, count(*) FROM product, jsonb_array_elements_text(props->'tags') AS tag GROUP BY tag ORDER BY count(*) DESC, tag;",
   "out": "    tag    | count \n-----------+-------\n laptop    |     2\n light     |     2\n accessory |     1\n phone     |     1\n pro       |     1\n tablet    |     1\n(6 rows)"
  },
  {
   "sql": "SELECT DISTINCT jsonb_object_keys(props) AS khoa FROM product ORDER BY 1;",
   "out": " khoa  \n-------\n brand\n price\n specs\n tags\n(4 rows)"
  },
  {
   "sql": "SELECT name, jsonb_path_query(props, '$.specs.ram') AS ram FROM product ORDER BY id;",
   "out": "     name      | ram \n---------------+-----\n Laptop Pro 14 | 16\n Laptop Air 13 | 8\n Phone X       | 8\n Tablet Mini   | 4\n(4 rows)"
  },
  {
   "sql": "SELECT name FROM product WHERE props @? '$.specs ? (@.ram >= 8)' ORDER BY id;",
   "out": "     name      \n---------------\n Laptop Pro 14\n Laptop Air 13\n Phone X\n(3 rows)"
  },
  {
   "sql": "SELECT name FROM product WHERE props @@ '$.price < 500' ORDER BY id;",
   "out": "    name     \n-------------\n Tablet Mini\n Keyboard K1\n(2 rows)"
  },
  {
   "sql": "SELECT name, jsonb_path_query_array(props, '$.tags[*] ? (@ starts with \"l\")') AS tag_l FROM product ORDER BY id;",
   "out": "     name      |        tag_l        \n---------------+---------------------\n Laptop Pro 14 | [\"laptop\"]\n Laptop Air 13 | [\"laptop\", \"light\"]\n Phone X       | []\n Tablet Mini   | [\"light\"]\n Keyboard K1   | []\n(5 rows)"
  },
  {
   "sql": "SELECT jsonb_path_query('{\"a\":[1,2,3,4]}', '$.a[*] ? (@ > $min)', '{\"min\": 2}') AS lon_hon_min;",
   "out": " lon_hon_min \n-------------\n 3\n 4\n(2 rows)"
  },
  {
   "sql": "SELECT jsonb_path_query('{\"a\":\"x\"}', 'strict $.b') ;",
   "out": "ERROR:  JSON object does not contain key \"b\""
  },
  {
   "sql": "SELECT jsonb_path_query('{\"a\":\"x\"}', 'lax $.b') AS lax_khong_loi;",
   "out": " lax_khong_loi \n---------------\n(0 rows)"
  },
  {
   "sql": "SELECT jt.*\nFROM product p,\n     JSON_TABLE(p.props, '$' COLUMNS (\n       brand text    PATH '$.brand',\n       price numeric PATH '$.price',\n       ram   int     PATH '$.specs.ram',\n       cpu   text    PATH '$.specs.cpu' DEFAULT 'n/a' ON EMPTY\n     )) AS jt\nORDER BY p.id;",
   "out": " brand | price | ram | cpu \n-------+-------+-----+-----\n Acme  |  1299 |  16 | M3\n Acme  |   999 |   8 | M2\n Zeta  |   799 |   8 | n/a\n Zeta  |   449 |   4 | n/a\n Acme  |    89 |     | n/a\n(5 rows)"
  },
  {
   "sql": "SELECT p.name, t.ord, t.tag\nFROM product p,\n     JSON_TABLE(p.props, '$.tags[*]' COLUMNS (ord FOR ORDINALITY, tag text PATH '$')) AS t\nWHERE p.id IN (1, 2) ORDER BY p.id, t.ord;",
   "out": "     name      | ord |  tag   \n---------------+-----+--------\n Laptop Pro 14 |   1 | laptop\n Laptop Pro 14 |   2 | pro\n Laptop Air 13 |   1 | laptop\n Laptop Air 13 |   2 | light\n(4 rows)"
  },
  {
   "sql": "SELECT name,\n       JSON_EXISTS(props, '$.specs.storage')          AS co_storage,\n       JSON_VALUE(props, '$.specs.ram' RETURNING int) AS ram_int,\n       JSON_QUERY(props, '$.tags')                    AS tags\nFROM product ORDER BY id;",
   "out": "     name      | co_storage | ram_int |        tags         \n---------------+------------+---------+---------------------\n Laptop Pro 14 | f          |      16 | [\"laptop\", \"pro\"]\n Laptop Air 13 | f          |       8 | [\"laptop\", \"light\"]\n Phone X       | t          |       8 | [\"phone\"]\n Tablet Mini   | f          |       4 | [\"tablet\", \"light\"]\n Keyboard K1   | f          |         | [\"accessory\"]\n(5 rows)"
  },
  {
   "sql": "SELECT JSON_VALUE('{\"ram\":\"16GB\"}', '$.ram' RETURNING int) AS loi_im_lang;",
   "out": " loi_im_lang \n-------------\n            \n(1 row)"
  },
  {
   "sql": "SELECT JSON_VALUE('{\"ram\":\"16GB\"}', '$.ram' RETURNING int ERROR ON ERROR);",
   "out": "ERROR:  invalid input syntax for type integer: \"16GB\""
  },
  {
   "sql": "SELECT JSON_VALUE('{\"ram\":\"16GB\"}', '$.ram' RETURNING int DEFAULT -1 ON ERROR) AS mac_dinh;",
   "out": " mac_dinh \n----------\n       -1\n(1 row)"
  },
  {
   "sql": "BEGIN;",
   "out": "BEGIN"
  },
  {
   "sql": "ALTER TABLE product ADD COLUMN price numeric GENERATED ALWAYS AS ((props->>'price')::numeric) STORED;",
   "out": "ALTER TABLE"
  },
  {
   "sql": "SELECT id, name, price FROM product ORDER BY price DESC;",
   "out": " id |     name      | price \n----+---------------+-------\n  1 | Laptop Pro 14 |  1299\n  2 | Laptop Air 13 |   999\n  3 | Phone X       |   799\n  4 | Tablet Mini   |   449\n  5 | Keyboard K1   |    89\n(5 rows)"
  },
  {
   "sql": "ROLLBACK;",
   "out": "ROLLBACK"
  },
  {
   "sql": "BEGIN;",
   "out": "BEGIN"
  },
  {
   "sql": "INSERT INTO product (name, props) VALUES\n ('Mouse M1', '{\"brand\":\"Acme\",\"price\":\"25\"}'),\n ('Mouse M2', '{\"brand\":\"Acme\",\"Price\":29}'),\n ('Mouse M3', '{\"brand\":\"Acme\",\"prise\":31}');",
   "out": "INSERT 0 3"
  },
  {
   "sql": "SELECT count(*) AS dem_co_gia, sum((props->>'price')::numeric) AS tong FROM product WHERE props->>'brand' = 'Acme' AND props ? 'price';",
   "out": " dem_co_gia | tong \n------------+------\n          4 | 2412\n(1 row)"
  },
  {
   "sql": "SELECT name, jsonb_typeof(props->'price') AS kieu_price FROM product WHERE props->>'brand' = 'Acme' ORDER BY id;",
   "out": "     name      | kieu_price \n---------------+------------\n Laptop Pro 14 | number\n Laptop Air 13 | number\n Keyboard K1   | number\n Mouse M1      | string\n Mouse M2      | \n Mouse M3      | \n(6 rows)"
  },
  {
   "sql": "ROLLBACK;",
   "out": "ROLLBACK"
  },
  {
   "sql": "BEGIN;",
   "out": "BEGIN"
  },
  {
   "sql": "ALTER TABLE product ADD CONSTRAINT props_price_is_number CHECK (jsonb_typeof(props->'price') = 'number');",
   "out": "ALTER TABLE"
  },
  {
   "sql": "INSERT INTO product (name, props) VALUES ('Mouse M1', '{\"brand\":\"Acme\",\"price\":\"25\"}');",
   "out": "ERROR:  new row for relation \"product\" violates check constraint \"props_price_is_number\"\nDETAIL:  Failing row contains (9, Mouse M1, {\"brand\": \"Acme\", \"price\": \"25\"})."
  },
  {
   "sql": "ROLLBACK;",
   "out": "ROLLBACK"
  },
  {
   "sql": "BEGIN;",
   "out": "BEGIN"
  },
  {
   "sql": "ALTER TABLE product ADD CONSTRAINT props_price_is_number CHECK (jsonb_typeof(props->'price') = 'number');",
   "out": "ALTER TABLE"
  },
  {
   "sql": "INSERT INTO product (name, props) VALUES ('Mouse M2', '{\"brand\":\"Acme\",\"Price\":29}');",
   "out": "INSERT 0 1"
  },
  {
   "sql": "ROLLBACK;",
   "out": "ROLLBACK"
  },
  {
   "sql": "SELECT pg_column_size('{\"brand\":\"Acme\",\"price\":1299}'::json) AS json_bytes, pg_column_size('{\"brand\":\"Acme\",\"price\":1299}'::jsonb) AS jsonb_bytes;",
   "out": " json_bytes | jsonb_bytes \n------------+-------------\n         33 |          48\n(1 row)"
  },
  {
   "sql": "BEGIN;",
   "out": "BEGIN"
  },
  {
   "sql": "ALTER TABLE product ADD CONSTRAINT props_price_is_number CHECK (props ? 'price' AND jsonb_typeof(props->'price') = 'number');",
   "out": "ALTER TABLE"
  },
  {
   "sql": "INSERT INTO product (name, props) VALUES ('Mouse M2', '{\"brand\":\"Acme\",\"Price\":29}');",
   "out": "ERROR:  new row for relation \"product\" violates check constraint \"props_price_is_number\"\nDETAIL:  Failing row contains (11, Mouse M2, {\"Price\": 29, \"brand\": \"Acme\"})."
  },
  {
   "sql": "ROLLBACK;",
   "out": "ROLLBACK"
  }
 ],
 "2": [
  {
   "sql": "SET search_path = ch13;",
   "out": "SET"
  },
  {
   "sql": "SET max_parallel_workers_per_gather = 0;",
   "out": "SET"
  },
  {
   "sql": "SELECT name FROM product WHERE props @> '{\"brand\":\"Acme\"}' ORDER BY id;",
   "out": "     name      \n---------------\n Laptop Pro 14\n Laptop Air 13\n Keyboard K1\n(3 rows)"
  },
  {
   "sql": "SELECT name FROM product WHERE props @> '{\"tags\":[\"light\"]}' ORDER BY id;",
   "out": "     name      \n---------------\n Laptop Air 13\n Tablet Mini\n(2 rows)"
  },
  {
   "sql": "SELECT name FROM product WHERE props @> '{\"specs\":{\"ram\":8}}' ORDER BY id;",
   "out": "     name      \n---------------\n Laptop Air 13\n Phone X\n(2 rows)"
  },
  {
   "sql": "SELECT name FROM product WHERE props @> '{\"brand\":\"Acme\",\"tags\":[\"laptop\"]}' ORDER BY id;",
   "out": "     name      \n---------------\n Laptop Pro 14\n Laptop Air 13\n(2 rows)"
  },
  {
   "sql": "SELECT name FROM product WHERE props @> '{\"tags\":\"light\"}' ORDER BY id;",
   "out": " name \n------\n(0 rows)"
  },
  {
   "sql": "SELECT '[\"a\",\"b\",\"c\"]'::jsonb @> '[\"c\",\"a\"]' AS khong_can_thu_tu,\n       '[\"a\",\"b\"]'::jsonb @> '[\"a\",\"a\"]'     AS trung_cung_duoc,\n       '{\"a\":1}'::jsonb @> '{}'              AS rong_luon_dung,\n       '{\"specs\":{\"ram\":8}}'::jsonb @> '{\"ram\":8}' AS phai_dung_tang;",
   "out": " khong_can_thu_tu | trung_cung_duoc | rong_luon_dung | phai_dung_tang \n------------------+-----------------+----------------+----------------\n t                | t               | t              | f\n(1 row)"
  },
  {
   "sql": "SELECT '{\"a\":1,\"b\":2}'::jsonb <@ '{\"a\":1,\"b\":2,\"c\":3}' AS nam_trong;",
   "out": " nam_trong \n-----------\n t\n(1 row)"
  },
  {
   "sql": "SELECT name FROM product WHERE props ? 'specs' ORDER BY id;",
   "out": "     name      \n---------------\n Laptop Pro 14\n Laptop Air 13\n Phone X\n Tablet Mini\n(4 rows)"
  },
  {
   "sql": "SELECT name FROM product WHERE props->'specs' ? 'storage' ORDER BY id;",
   "out": "  name   \n---------\n Phone X\n(1 row)"
  },
  {
   "sql": "SELECT name FROM product WHERE props->'tags' ? 'light' ORDER BY id;",
   "out": "     name      \n---------------\n Laptop Air 13\n Tablet Mini\n(2 rows)"
  },
  {
   "sql": "SELECT name FROM product WHERE jsonb_exists(props->'specs', 'storage') ORDER BY id;",
   "out": "  name   \n---------\n Phone X\n(1 row)"
  },
  {
   "sql": "WITH muc AS (\n  SELECT id, 'key  ' || k AS muc FROM product, jsonb_object_keys(props) AS k\n  UNION ALL\n  SELECT id, 'value ' || v::text FROM product, jsonb_path_query(props, 'strict $.** ? (@.type() == \"string\" || @.type() == \"number\")') AS v\n)\nSELECT muc, array_agg(id ORDER BY id) AS dong FROM muc GROUP BY muc ORDER BY muc;",
   "out": "        muc        |    dong     \n-------------------+-------------\n key  brand        | {1,2,3,4,5}\n key  price        | {1,2,3,4,5}\n key  specs        | {1,2,3,4}\n key  tags         | {1,2,3,4,5}\n value 1299        | {1}\n value 16          | {1}\n value 256         | {3}\n value 4           | {4}\n value 449         | {4}\n value 799         | {3}\n value 8           | {2,3}\n value 89          | {5}\n value 999         | {2}\n value \"accessory\" | {5}\n value \"Acme\"      | {1,2,5}\n value \"laptop\"    | {1,2}\n value \"light\"     | {2,4}\n value \"M2\"        | {2}\n value \"M3\"        | {1}\n value \"phone\"     | {3}\n value \"pro\"       | {1}\n value \"tablet\"    | {4}\n value \"Zeta\"      | {3,4}\n(23 rows)"
  },
  {
   "sql": "WITH RECURSIVE t(id, path, v) AS (\n  SELECT id, k, props->k FROM product, jsonb_object_keys(props) AS k\n  UNION ALL\n  SELECT t.id, CASE WHEN c.k IS NULL THEN t.path ELSE t.path || '.' || c.k END, c.v\n  FROM t, LATERAL (\n    SELECT key, value FROM jsonb_each(CASE WHEN jsonb_typeof(t.v) = 'object' THEN t.v END)\n    UNION ALL\n    SELECT NULL, value FROM jsonb_array_elements(CASE WHEN jsonb_typeof(t.v) = 'array' THEN t.v END)\n  ) AS c(k, v)\n)\nSELECT path || ' = ' || v AS duong_dan_va_gia_tri, array_agg(id ORDER BY id) AS dong\nFROM t WHERE jsonb_typeof(v) NOT IN ('object', 'array')\nGROUP BY 1 ORDER BY 1;",
   "out": " duong_dan_va_gia_tri |  dong   \n----------------------+---------\n brand = \"Acme\"       | {1,2,5}\n brand = \"Zeta\"       | {3,4}\n price = 1299         | {1}\n price = 449          | {4}\n price = 799          | {3}\n price = 89           | {5}\n price = 999          | {2}\n specs.cpu = \"M2\"     | {2}\n specs.cpu = \"M3\"     | {1}\n specs.ram = 16       | {1}\n specs.ram = 4        | {4}\n specs.ram = 8        | {2,3}\n specs.storage = 256  | {3}\n tags = \"accessory\"   | {5}\n tags = \"laptop\"      | {1,2}\n tags = \"light\"       | {2,4}\n tags = \"phone\"       | {3}\n tags = \"pro\"         | {1}\n tags = \"tablet\"      | {4}\n(19 rows)"
  },
  {
   "sql": "CREATE TABLE ev (\n  id    int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  props jsonb NOT NULL\n);",
   "out": "CREATE TABLE"
  },
  {
   "sql": "INSERT INTO ev (props)\nSELECT jsonb_build_object(\n  'sku',    'SKU-' || lpad(i::text, 6, '0'),\n  'brand',  CASE WHEN i % 2 = 0 THEN 'Nova' ELSE 'Acme' END,\n  'region', CASE WHEN (i / 2) % 2 = 0 THEN 'east' ELSE 'west' END,\n  'price',  i % 2000,\n  'tags',   jsonb_build_array('t' || (i % 50), 'k' || (i % 13)),\n  'specs',  jsonb_build_object('ram', (ARRAY[4, 8, 16, 32])[i % 4 + 1], 'cpu', 'C' || (i % 7))\n) || CASE WHEN i % 10 = 0 THEN '{\"color\":\"red\"}'::jsonb ELSE '{}'::jsonb END\nFROM generate_series(1, 200000) AS i;",
   "out": "INSERT 0 200000"
  },
  {
   "sql": "VACUUM ANALYZE ev;",
   "out": "VACUUM"
  },
  {
   "sql": "SELECT count(*) AS so_dong, pg_size_pretty(pg_table_size('ev')) AS bang FROM ev;",
   "out": " so_dong | bang  \n---------+-------\n  200000 | 39 MB\n(1 row)"
  },
  {
   "sql": "SELECT props FROM ev WHERE id = 1234;",
   "out": "                                                               props                                                                \n------------------------------------------------------------------------------------------------------------------------------------\n {\"sku\": \"SKU-001234\", \"tags\": [\"t34\", \"k12\"], \"brand\": \"Nova\", \"price\": 1234, \"specs\": {\"cpu\": \"C2\", \"ram\": 16}, \"region\": \"west\"}\n(1 row)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props @> '{\"price\":1234}';",
   "out": "                                               QUERY PLAN                                                \n---------------------------------------------------------------------------------------------------------\n Aggregate  (cost=7522.05..7522.06 rows=1 width=8) (actual time=18.801..18.802 rows=1 loops=1)\n   ->  Seq Scan on ev  (cost=0.00..7522.00 rows=20 width=0) (actual time=0.156..18.785 rows=100 loops=1)\n         Filter: (props @> '{\"price\": 1234}'::jsonb)\n         Rows Removed by Filter: 199900\n Planning Time: 0.044 ms\n Execution Time: 18.817 ms\n(6 rows)"
  },
  {
   "sql": "\\timing on",
   "out": "Timing is on."
  },
  {
   "sql": "CREATE INDEX ev_props_gin ON ev USING GIN (props);",
   "out": "CREATE INDEX\nTime: 1353.837 ms (00:01.354)"
  },
  {
   "sql": "\\timing off",
   "out": "Timing is off."
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props @> '{\"price\":1234}';",
   "out": "                                                          QUERY PLAN                                                           \n-------------------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=106.68..106.69 rows=1 width=8) (actual time=0.919..0.920 rows=1 loops=1)\n   ->  Bitmap Heap Scan on ev  (cost=30.16..106.63 rows=20 width=0) (actual time=0.779..0.914 rows=100 loops=1)\n         Recheck Cond: (props @> '{\"price\": 1234}'::jsonb)\n         Heap Blocks: exact=100\n         ->  Bitmap Index Scan on ev_props_gin  (cost=0.00..30.16 rows=20 width=0) (actual time=0.765..0.765 rows=100 loops=1)\n               Index Cond: (props @> '{\"price\": 1234}'::jsonb)\n Planning Time: 0.139 ms\n Execution Time: 0.938 ms\n(8 rows)"
  },
  {
   "sql": "EXPLAIN (ANALYZE, BUFFERS) SELECT count(*) FROM ev WHERE props @> '{\"price\":1234}';",
   "out": "                                                          QUERY PLAN                                                           \n-------------------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=106.68..106.69 rows=1 width=8) (actual time=0.869..0.870 rows=1 loops=1)\n   Buffers: shared hit=161\n   ->  Bitmap Heap Scan on ev  (cost=30.16..106.63 rows=20 width=0) (actual time=0.757..0.863 rows=100 loops=1)\n         Recheck Cond: (props @> '{\"price\": 1234}'::jsonb)\n         Heap Blocks: exact=100\n         Buffers: shared hit=161\n         ->  Bitmap Index Scan on ev_props_gin  (cost=0.00..30.16 rows=20 width=0) (actual time=0.745..0.745 rows=100 loops=1)\n               Index Cond: (props @> '{\"price\": 1234}'::jsonb)\n               Buffers: shared hit=61\n Planning:\n   Buffers: shared hit=1\n Planning Time: 0.067 ms\n Execution Time: 0.883 ms\n(13 rows)"
  },
  {
   "sql": "SELECT count(*) FROM ev WHERE props @> '{\"price\":1234}';",
   "out": " count \n-------\n   100\n(1 row)"
  },
  {
   "sql": "SELECT count(*) FROM ev WHERE props @> '{\"brand\":\"Nova\",\"region\":\"east\"}';",
   "out": " count \n-------\n 50000\n(1 row)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props @> '{\"brand\":\"Nova\",\"region\":\"east\"}';",
   "out": "                                                             QUERY PLAN                                                              \n-------------------------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=6043.99..6044.00 rows=1 width=8) (actual time=24.682..24.683 rows=1 loops=1)\n   ->  Bitmap Heap Scan on ev  (cost=355.33..5932.88 rows=44444 width=0) (actual time=8.040..23.050 rows=50000 loops=1)\n         Recheck Cond: (props @> '{\"brand\": \"Nova\", \"region\": \"east\"}'::jsonb)\n         Heap Blocks: exact=5022\n         ->  Bitmap Index Scan on ev_props_gin  (cost=0.00..344.22 rows=44444 width=0) (actual time=7.572..7.573 rows=50000 loops=1)\n               Index Cond: (props @> '{\"brand\": \"Nova\", \"region\": \"east\"}'::jsonb)\n Planning Time: 0.088 ms\n Execution Time: 24.708 ms\n(8 rows)"
  },
  {
   "sql": "BEGIN;",
   "out": "BEGIN"
  },
  {
   "sql": "DROP INDEX ev_props_gin;",
   "out": "DROP INDEX"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props @> '{\"brand\":\"Nova\",\"region\":\"east\"}';",
   "out": "                                                  QUERY PLAN                                                  \n--------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=7633.11..7633.12 rows=1 width=8) (actual time=26.807..26.808 rows=1 loops=1)\n   ->  Seq Scan on ev  (cost=0.00..7522.00 rows=44444 width=0) (actual time=0.008..25.137 rows=50000 loops=1)\n         Filter: (props @> '{\"brand\": \"Nova\", \"region\": \"east\"}'::jsonb)\n         Rows Removed by Filter: 150000\n Planning Time: 0.086 ms\n Execution Time: 26.826 ms\n(6 rows)"
  },
  {
   "sql": "ROLLBACK;",
   "out": "ROLLBACK"
  },
  {
   "sql": "\\timing on",
   "out": "Timing is on."
  },
  {
   "sql": "CREATE INDEX ev_props_gin_path ON ev USING GIN (props jsonb_path_ops);",
   "out": "CREATE INDEX\nTime: 486.971 ms"
  },
  {
   "sql": "\\timing off",
   "out": "Timing is off."
  },
  {
   "sql": "SELECT indexrelname, pg_size_pretty(pg_relation_size(indexrelid)) AS kich_thuoc, pg_relation_size(indexrelid) AS bytes\nFROM pg_stat_user_indexes WHERE relname = 'ev' ORDER BY indexrelname;",
   "out": "   indexrelname    | kich_thuoc |  bytes   \n-------------------+------------+----------\n ev_pkey           | 4408 kB    |  4513792\n ev_props_gin      | 19 MB      | 19628032\n ev_props_gin_path | 14 MB      | 14548992\n(3 rows)"
  },
  {
   "sql": "SELECT pg_size_pretty(pg_table_size('ev')) AS bang;",
   "out": " bang  \n-------\n 39 MB\n(1 row)"
  },
  {
   "sql": "SELECT opc.opcname AS lop_toan_tu, string_agg(op.oprname, '  ' ORDER BY amop.amopstrategy) AS toan_tu\nFROM pg_opclass opc\nJOIN pg_am am ON am.oid = opc.opcmethod AND am.amname = 'gin'\nJOIN pg_amop amop ON amop.amopfamily = opc.opcfamily\nJOIN pg_operator op ON op.oid = amop.amopopr\nWHERE opc.opcname IN ('jsonb_ops', 'jsonb_path_ops')\nGROUP BY opc.opcname ORDER BY 1;",
   "out": "  lop_toan_tu   |        toan_tu        \n----------------+-----------------------\n jsonb_ops      | @>  ?  ?|  ?&  @?  @@\n jsonb_path_ops | @>  @?  @@\n(2 rows)"
  },
  {
   "sql": "BEGIN;",
   "out": "BEGIN"
  },
  {
   "sql": "DROP INDEX ev_props_gin;",
   "out": "DROP INDEX"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props @> '{\"price\":1234}';",
   "out": "                                                             QUERY PLAN                                                             \n------------------------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=93.71..93.72 rows=1 width=8) (actual time=0.158..0.159 rows=1 loops=1)\n   ->  Bitmap Heap Scan on ev  (cost=17.20..93.66 rows=20 width=0) (actual time=0.028..0.154 rows=100 loops=1)\n         Recheck Cond: (props @> '{\"price\": 1234}'::jsonb)\n         Heap Blocks: exact=100\n         ->  Bitmap Index Scan on ev_props_gin_path  (cost=0.00..17.19 rows=20 width=0) (actual time=0.014..0.014 rows=100 loops=1)\n               Index Cond: (props @> '{\"price\": 1234}'::jsonb)\n Planning Time: 0.061 ms\n Execution Time: 0.167 ms\n(8 rows)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props ? 'color';",
   "out": "                                                  QUERY PLAN                                                  \n--------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=7572.51..7572.52 rows=1 width=8) (actual time=12.820..12.820 rows=1 loops=1)\n   ->  Seq Scan on ev  (cost=0.00..7522.00 rows=20202 width=0) (actual time=0.004..12.173 rows=20000 loops=1)\n         Filter: (props ? 'color'::text)\n         Rows Removed by Filter: 180000\n Planning Time: 0.028 ms\n Execution Time: 12.829 ms\n(6 rows)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props @? '$.specs ? (@.ram == 32)';",
   "out": "                                                                QUERY PLAN                                                                \n------------------------------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=5960.05..5960.06 rows=1 width=8) (actual time=22.319..22.320 rows=1 loops=1)\n   ->  Bitmap Heap Scan on ev  (cost=301.69..5853.99 rows=42424 width=0) (actual time=2.519..20.658 rows=50000 loops=1)\n         Recheck Cond: (props @? '$.\"specs\"?(@.\"ram\" == 32)'::jsonpath)\n         Heap Blocks: exact=5022\n         ->  Bitmap Index Scan on ev_props_gin_path  (cost=0.00..291.09 rows=42424 width=0) (actual time=2.090..2.090 rows=50000 loops=1)\n               Index Cond: (props @? '$.\"specs\"?(@.\"ram\" == 32)'::jsonpath)\n Planning Time: 0.093 ms\n Execution Time: 22.339 ms\n(8 rows)"
  },
  {
   "sql": "ROLLBACK;",
   "out": "ROLLBACK"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props ? 'color';",
   "out": "                                                             QUERY PLAN                                                              \n-------------------------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=5477.06..5477.07 rows=1 width=8) (actual time=7.834..7.835 rows=1 loops=1)\n   ->  Bitmap Heap Scan on ev  (cost=152.03..5426.55 rows=20202 width=0) (actual time=1.572..7.186 rows=20000 loops=1)\n         Recheck Cond: (props ? 'color'::text)\n         Heap Blocks: exact=5022\n         ->  Bitmap Index Scan on ev_props_gin  (cost=0.00..146.98 rows=20202 width=0) (actual time=1.112..1.112 rows=20000 loops=1)\n               Index Cond: (props ? 'color'::text)\n Planning Time: 0.101 ms\n Execution Time: 7.853 ms\n(8 rows)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE (props->>'price')::numeric < 5;",
   "out": "                                                 QUERY PLAN                                                 \n------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=9188.67..9188.68 rows=1 width=8) (actual time=34.296..34.296 rows=1 loops=1)\n   ->  Seq Scan on ev  (cost=0.00..9022.00 rows=66667 width=0) (actual time=0.008..34.272 rows=500 loops=1)\n         Filter: (((props ->> 'price'::text))::numeric < '5'::numeric)\n         Rows Removed by Filter: 199500\n Planning Time: 0.042 ms\n Execution Time: 34.307 ms\n(6 rows)"
  },
  {
   "sql": "\\timing on",
   "out": "Timing is on."
  },
  {
   "sql": "CREATE INDEX ev_price ON ev (((props->>'price')::numeric));",
   "out": "CREATE INDEX\nTime: 89.556 ms"
  },
  {
   "sql": "\\timing off",
   "out": "Timing is off."
  },
  {
   "sql": "ANALYZE ev;",
   "out": "ANALYZE"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE (props->>'price')::numeric < 5;",
   "out": "                                                         QUERY PLAN                                                         \n----------------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=1471.98..1471.99 rows=1 width=8) (actual time=0.248..0.249 rows=1 loops=1)\n   ->  Bitmap Heap Scan on ev  (cost=12.24..1470.75 rows=493 width=0) (actual time=0.053..0.229 rows=500 loops=1)\n         Recheck Cond: (((props ->> 'price'::text))::numeric < '5'::numeric)\n         Heap Blocks: exact=109\n         ->  Bitmap Index Scan on ev_price  (cost=0.00..12.12 rows=493 width=0) (actual time=0.038..0.038 rows=500 loops=1)\n               Index Cond: (((props ->> 'price'::text))::numeric < '5'::numeric)\n Planning Time: 0.189 ms\n Execution Time: 0.263 ms\n(8 rows)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE (props->>'price')::int < 5;",
   "out": "                                                 QUERY PLAN                                                 \n------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=9188.67..9188.68 rows=1 width=8) (actual time=21.845..21.846 rows=1 loops=1)\n   ->  Seq Scan on ev  (cost=0.00..9022.00 rows=66667 width=0) (actual time=0.009..21.819 rows=500 loops=1)\n         Filter: (((props ->> 'price'::text))::integer < 5)\n         Rows Removed by Filter: 199500\n Planning Time: 0.040 ms\n Execution Time: 21.865 ms\n(6 rows)"
  },
  {
   "sql": "CREATE INDEX ev_sku ON ev ((props->>'sku'));",
   "out": "CREATE INDEX"
  },
  {
   "sql": "ANALYZE ev;",
   "out": "ANALYZE"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT props->>'brand' FROM ev WHERE props->>'sku' = 'SKU-123456';",
   "out": "                                                 QUERY PLAN                                                 \n------------------------------------------------------------------------------------------------------------\n Index Scan using ev_sku on ev  (cost=0.42..8.44 rows=1 width=32) (actual time=0.060..0.061 rows=1 loops=1)\n   Index Cond: ((props ->> 'sku'::text) = 'SKU-123456'::text)\n Planning Time: 0.106 ms\n Execution Time: 0.072 ms\n(4 rows)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE props @> '{\"sku\":\"SKU-123456\"}';",
   "out": "                                                            QUERY PLAN                                                            \n----------------------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=93.71..93.72 rows=1 width=8) (actual time=0.016..0.017 rows=1 loops=1)\n   ->  Bitmap Heap Scan on ev  (cost=17.20..93.66 rows=20 width=0) (actual time=0.014..0.015 rows=1 loops=1)\n         Recheck Cond: (props @> '{\"sku\": \"SKU-123456\"}'::jsonb)\n         Heap Blocks: exact=1\n         ->  Bitmap Index Scan on ev_props_gin_path  (cost=0.00..17.19 rows=20 width=0) (actual time=0.009..0.009 rows=1 loops=1)\n               Index Cond: (props @> '{\"sku\": \"SKU-123456\"}'::jsonb)\n Planning Time: 0.074 ms\n Execution Time: 0.030 ms\n(8 rows)"
  },
  {
   "sql": "SELECT indexrelname, pg_size_pretty(pg_relation_size(indexrelid)) AS kich_thuoc\nFROM pg_stat_user_indexes WHERE relname = 'ev' ORDER BY pg_relation_size(indexrelid) DESC;",
   "out": "   indexrelname    | kich_thuoc \n-------------------+------------\n ev_props_gin      | 19 MB\n ev_props_gin_path | 14 MB\n ev_sku            | 6184 kB\n ev_price          | 4416 kB\n ev_pkey           | 4408 kB\n(5 rows)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE (props #> ARRAY['brand']::text[])::jsonb = '\"Nova\"';",
   "out": "                                                  QUERY PLAN                                                  \n--------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=8024.50..8024.51 rows=1 width=8) (actual time=53.540..53.541 rows=1 loops=1)\n   ->  Seq Scan on ev  (cost=0.00..8022.00 rows=1000 width=0) (actual time=0.007..50.309 rows=100000 loops=1)\n         Filter: ((props #> '{brand}'::text[]) = '\"Nova\"'::jsonb)\n         Rows Removed by Filter: 100000\n Planning Time: 0.028 ms\n Execution Time: 53.552 ms\n(6 rows)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM ev WHERE (props #> ARRAY['sku']::text[])::jsonb = '\"SKU-123456\"';",
   "out": "                                                QUERY PLAN                                                \n----------------------------------------------------------------------------------------------------------\n Aggregate  (cost=8024.50..8024.51 rows=1 width=8) (actual time=52.379..52.380 rows=1 loops=1)\n   ->  Seq Scan on ev  (cost=0.00..8022.00 rows=1000 width=0) (actual time=31.897..52.373 rows=1 loops=1)\n         Filter: ((props #> '{sku}'::text[]) = '\"SKU-123456\"'::jsonb)\n         Rows Removed by Filter: 199999\n Planning Time: 0.054 ms\n Execution Time: 52.396 ms\n(6 rows)"
  }
 ],
 "3": [
  {
   "sql": "SET search_path = ch13;",
   "out": "SET"
  },
  {
   "sql": "SET max_parallel_workers_per_gather = 0;",
   "out": "SET"
  },
  {
   "sql": "CREATE TABLE note (id int PRIMARY KEY, body text NOT NULL);",
   "out": "CREATE TABLE"
  },
  {
   "sql": "INSERT INTO note VALUES (1, 'The fox jumped over the fence'), (2, 'Jumping rope every morning'), (3, 'The jumper is warm');",
   "out": "INSERT 0 3"
  },
  {
   "sql": "SELECT id, body FROM note WHERE body ILIKE '%jumping%';",
   "out": " id |            body            \n----+----------------------------\n  2 | Jumping rope every morning\n(1 row)"
  },
  {
   "sql": "SELECT id, body FROM note WHERE body ILIKE '%jump%';",
   "out": " id |             body              \n----+-------------------------------\n  1 | The fox jumped over the fence\n  2 | Jumping rope every morning\n  3 | The jumper is warm\n(3 rows)"
  },
  {
   "sql": "SELECT id, body FROM note WHERE to_tsvector('english', body) @@ to_tsquery('english', 'jumping');",
   "out": " id |             body              \n----+-------------------------------\n  1 | The fox jumped over the fence\n  2 | Jumping rope every morning\n(2 rows)"
  },
  {
   "sql": "SELECT to_tsvector('english', 'The quick brown foxes were jumping over the lazy dogs');",
   "out": "                      to_tsvector                       \n--------------------------------------------------------\n 'brown':3 'dog':10 'fox':4 'jump':6 'lazi':9 'quick':2\n(1 row)"
  },
  {
   "sql": "SELECT alias, token, dictionaries, lexemes FROM ts_debug('english', 'The quick brown foxes were jumping over the lazy dogs');",
   "out": "   alias   |  token  |  dictionaries  | lexemes \n-----------+---------+----------------+---------\n asciiword | The     | {english_stem} | {}\n blank     |         | {}             | \n asciiword | quick   | {english_stem} | {quick}\n blank     |         | {}             | \n asciiword | brown   | {english_stem} | {brown}\n blank     |         | {}             | \n asciiword | foxes   | {english_stem} | {fox}\n blank     |         | {}             | \n asciiword | were    | {english_stem} | {}\n blank     |         | {}             | \n asciiword | jumping | {english_stem} | {jump}\n blank     |         | {}             | \n asciiword | over    | {english_stem} | {}\n blank     |         | {}             | \n asciiword | the     | {english_stem} | {}\n blank     |         | {}             | \n asciiword | lazy    | {english_stem} | {lazi}\n blank     |         | {}             | \n asciiword | dogs    | {english_stem} | {dog}\n(19 rows)"
  },
  {
   "sql": "SELECT to_tsvector('english', 'jumping jumped jumps') AS english, to_tsvector('simple', 'jumping jumped jumps') AS simple;",
   "out": "   english    |              simple              \n--------------+----------------------------------\n 'jump':1,2,3 | 'jumped':2 'jumping':1 'jumps':3\n(1 row)"
  },
  {
   "sql": "SELECT to_tsvector('english', 'Email me at an@cuongthai.com about https://cuongthai.com/courses/postgresql in 2026');",
   "out": "                                                       to_tsvector                                                       \n-------------------------------------------------------------------------------------------------------------------------\n '/courses/postgresql':8 '2026':10 'an@cuongthai.com':4 'cuongthai.com':7 'cuongthai.com/courses/postgresql':6 'email':1\n(1 row)"
  },
  {
   "sql": "SELECT to_tsquery('english', 'foxes & dogs') AS q;",
   "out": "       q       \n---------------\n 'fox' & 'dog'\n(1 row)"
  },
  {
   "sql": "SELECT to_tsvector('english', 'The quick brown foxes were jumping over the lazy dogs') @@ to_tsquery('english', 'fox & dog') AS khop;",
   "out": " khop \n------\n t\n(1 row)"
  },
  {
   "sql": "SELECT v @@ to_tsquery('english', 'fox & cat') AS va,\n       v @@ to_tsquery('english', 'fox | cat') AS hoac,\n       v @@ to_tsquery('english', 'fox & !cat') AS khong,\n       v @@ to_tsquery('english', 'quick <-> brown') AS ngay_sau,\n       v @@ to_tsquery('english', 'brown <-> quick') AS nguoc,\n       v @@ to_tsquery('english', 'quick <2> fox') AS cach_2\nFROM (SELECT to_tsvector('english', 'The quick brown foxes were jumping over the lazy dogs') AS v) s;",
   "out": " va | hoac | khong | ngay_sau | nguoc | cach_2 \n----+------+-------+----------+-------+--------\n f  | t    | t     | t        | f     | t\n(1 row)"
  },
  {
   "sql": "SELECT to_tsquery('english', 'jump:*') AS tien_to, to_tsvector('english', 'jumper') @@ to_tsquery('english', 'jump:*') AS khop_tien_to;",
   "out": " tien_to  | khop_tien_to \n----------+--------------\n 'jump':* | t\n(1 row)"
  },
  {
   "sql": "SELECT to_tsquery('english', 'lazy dog');",
   "out": "ERROR:  syntax error in tsquery: \"lazy dog\""
  },
  {
   "sql": "SELECT plainto_tsquery('english', 'lazy dog') AS plain, phraseto_tsquery('english', 'lazy dog') AS phrase;",
   "out": "     plain      |      phrase      \n----------------+------------------\n 'lazi' & 'dog' | 'lazi' <-> 'dog'\n(1 row)"
  },
  {
   "sql": "SELECT websearch_to_tsquery('english', '\"brown fox\" or cat -dog') AS web;",
   "out": "                web                 \n------------------------------------\n 'brown' <-> 'fox' | 'cat' & !'dog'\n(1 row)"
  },
  {
   "sql": "SELECT websearch_to_tsquery('english', 'fox & (dog') AS web_khong_loi;",
   "out": " web_khong_loi \n---------------\n 'fox' & 'dog'\n(1 row)"
  },
  {
   "sql": "CREATE TABLE article (\n  id    int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  title text NOT NULL,\n  body  text NOT NULL,\n  tsv tsvector GENERATED ALWAYS AS (\n    setweight(to_tsvector('english', title), 'A') ||\n    setweight(to_tsvector('english', body),  'B')\n  ) STORED\n);",
   "out": "CREATE TABLE"
  },
  {
   "sql": "INSERT INTO article (title, body) VALUES\n ('PostgreSQL indexing basics', 'A B-tree index makes lookups fast. Every index has a cost on writes.'),\n ('Scaling a database', 'Replicas spread the reads; partitioning splits big tables.'),\n ('Fast queries with indexes', 'Read the plan with EXPLAIN before adding an index.');",
   "out": "INSERT 0 3"
  },
  {
   "sql": "SELECT id, title, tsv FROM article ORDER BY id;",
   "out": " id |           title            |                                                                      tsv                                                                       \n----+----------------------------+------------------------------------------------------------------------------------------------------------------------------------------------\n  1 | PostgreSQL indexing basics | 'b':6B 'b-tree':5B 'basic':3A 'cost':16B 'everi':12B 'fast':11B 'index':2A,8B,13B 'lookup':10B 'make':9B 'postgresql':1A 'tree':7B 'write':18B\n  2 | Scaling a database         | 'big':10B 'databas':3A 'partit':8B 'read':7B 'replica':4B 'scale':1A 'split':9B 'spread':5B 'tabl':11B\n  3 | Fast queries with indexes  | 'ad':11B 'explain':9B 'fast':1A 'index':4A,13B 'plan':7B 'queri':2A 'read':5B\n(3 rows)"
  },
  {
   "sql": "SELECT id, title, round(ts_rank(tsv, to_tsquery('english', 'index'))::numeric, 4) AS hang\nFROM article WHERE tsv @@ to_tsquery('english', 'index') ORDER BY hang DESC;",
   "out": " id |           title            |  hang  \n----+----------------------------+--------\n  1 | PostgreSQL indexing basics | 0.6957\n  3 | Fast queries with indexes  | 0.6687\n(2 rows)"
  },
  {
   "sql": "SELECT id, title,\n       round(ts_rank(tsv, q)::numeric, 4)    AS rank,\n       round(ts_rank_cd(tsv, q)::numeric, 4) AS rank_cd\nFROM article, websearch_to_tsquery('english', 'fast index') AS q\nWHERE tsv @@ q ORDER BY rank DESC;",
   "out": " id |           title            |  rank  | rank_cd \n----+----------------------------+--------+---------\n  3 | Fast queries with indexes  | 0.9772 |  0.3333\n  1 | PostgreSQL indexing basics | 0.7511 |  0.3333\n(2 rows)"
  },
  {
   "sql": "SELECT id, title, round(ts_rank('{0.1, 0.2, 0.4, 1.0}', tsv, q)::numeric, 4) AS mac_dinh, round(ts_rank('{0, 0, 0.4, 0.1}', tsv, q)::numeric, 4) AS chi_tieu_de_nhe\nFROM article, to_tsquery('english', 'index') AS q WHERE tsv @@ q ORDER BY id;",
   "out": " id |           title            | mac_dinh | chi_tieu_de_nhe \n----+----------------------------+----------+-----------------\n  1 | PostgreSQL indexing basics |   0.6957 |          0.3310\n  3 | Fast queries with indexes  |   0.6687 |          0.3040\n(2 rows)"
  },
  {
   "sql": "SELECT id, ts_headline('english', body, to_tsquery('english', 'index'), 'StartSel=<b>, StopSel=</b>') AS trich\nFROM article WHERE tsv @@ to_tsquery('english', 'index') ORDER BY id;",
   "out": " id |                                       trich                                        \n----+------------------------------------------------------------------------------------\n  1 | A B-tree <b>index</b> makes lookups fast. Every <b>index</b> has a cost on writes.\n  3 | Read the plan with EXPLAIN before adding an <b>index</b>.\n(2 rows)"
  },
  {
   "sql": "INSERT INTO article (title, body)\nSELECT 'Note ' || i,\n       'Note ' || i || ' covers ' || (ARRAY['joins','vacuum','backups','replication','locks','triggers','views','json','window functions','cte'])[i % 10 + 1]\n       || ' with examples from lesson ' || (i % 97) || '.'\n       || CASE WHEN i % 20000 = 0 THEN ' It explains transaction id wraparound.' ELSE '' END\nFROM generate_series(1, 200000) AS i;",
   "out": "INSERT 0 200000"
  },
  {
   "sql": "VACUUM ANALYZE article;",
   "out": "VACUUM"
  },
  {
   "sql": "SELECT count(*) AS so_bai, pg_size_pretty(pg_table_size('article')) AS bang FROM article;",
   "out": " so_bai | bang  \n--------+-------\n 200003 | 40 MB\n(1 row)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT id, title FROM article WHERE tsv @@ to_tsquery('english', 'wraparound');",
   "out": "                                               QUERY PLAN                                                \n---------------------------------------------------------------------------------------------------------\n Seq Scan on article  (cost=0.00..7564.04 rows=893 width=15) (actual time=1.493..15.094 rows=10 loops=1)\n   Filter: (tsv @@ '''wraparound'''::tsquery)\n   Rows Removed by Filter: 199993\n Planning Time: 0.055 ms\n Execution Time: 15.104 ms\n(5 rows)"
  },
  {
   "sql": "\\timing on",
   "out": "Timing is on."
  },
  {
   "sql": "CREATE INDEX article_tsv_gin ON article USING GIN (tsv);",
   "out": "CREATE INDEX\nTime: 649.101 ms"
  },
  {
   "sql": "\\timing off",
   "out": "Timing is off."
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT id, title FROM article WHERE tsv @@ to_tsquery('english', 'wraparound');",
   "out": "                                                         QUERY PLAN                                                         \n----------------------------------------------------------------------------------------------------------------------------\n Bitmap Heap Scan on article  (cost=21.78..2325.22 rows=893 width=15) (actual time=0.016..0.047 rows=10 loops=1)\n   Recheck Cond: (tsv @@ '''wraparound'''::tsquery)\n   Heap Blocks: exact=10\n   ->  Bitmap Index Scan on article_tsv_gin  (cost=0.00..21.56 rows=893 width=0) (actual time=0.010..0.010 rows=10 loops=1)\n         Index Cond: (tsv @@ '''wraparound'''::tsquery)\n Planning Time: 0.132 ms\n Execution Time: 0.057 ms\n(7 rows)"
  },
  {
   "sql": "SELECT id, title FROM article WHERE tsv @@ to_tsquery('english', 'wraparound') ORDER BY id;",
   "out": "   id   |    title    \n--------+-------------\n  20003 | Note 20000\n  40003 | Note 40000\n  60003 | Note 60000\n  80003 | Note 80000\n 100003 | Note 100000\n 120003 | Note 120000\n 140003 | Note 140000\n 160003 | Note 160000\n 180003 | Note 180000\n 200003 | Note 200000\n(10 rows)"
  },
  {
   "sql": "SELECT pg_size_pretty(pg_relation_size('article_tsv_gin')) AS chi_muc_tsv;",
   "out": " chi_muc_tsv \n-------------\n 13 MB\n(1 row)"
  },
  {
   "sql": "CREATE INDEX article_body_fts ON article USING GIN (to_tsvector('english', body));",
   "out": "CREATE INDEX"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM article WHERE to_tsvector('english', body) @@ to_tsquery('english', 'wraparound');",
   "out": "                                                             QUERY PLAN                                                             \n------------------------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=2772.16..2772.17 rows=1 width=8) (actual time=0.036..0.037 rows=1 loops=1)\n   ->  Bitmap Heap Scan on article  (cost=22.34..2769.66 rows=1000 width=0) (actual time=0.018..0.034 rows=10 loops=1)\n         Recheck Cond: (to_tsvector('english'::regconfig, body) @@ '''wraparound'''::tsquery)\n         Heap Blocks: exact=10\n         ->  Bitmap Index Scan on article_body_fts  (cost=0.00..22.09 rows=1000 width=0) (actual time=0.012..0.012 rows=10 loops=1)\n               Index Cond: (to_tsvector('english'::regconfig, body) @@ '''wraparound'''::tsquery)\n Planning Time: 0.130 ms\n Execution Time: 0.052 ms\n(8 rows)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM article WHERE to_tsvector(body) @@ to_tsquery('english', 'wraparound');",
   "out": "                                                     QUERY PLAN                                                     \n--------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=57567.29..57567.30 rows=1 width=8) (actual time=1091.490..1091.490 rows=1 loops=1)\n   ->  Seq Scan on article  (cost=0.00..57564.79 rows=1000 width=0) (actual time=104.515..1091.464 rows=10 loops=1)\n         Filter: (to_tsvector(body) @@ '''wraparound'''::tsquery)\n         Rows Removed by Filter: 199993\n Planning Time: 0.019 ms\n Execution Time: 1091.500 ms\n(6 rows)"
  },
  {
   "sql": "DROP INDEX article_body_fts;",
   "out": "DROP INDEX"
  },
  {
   "sql": "SHOW default_text_search_config;",
   "out": " default_text_search_config \n----------------------------\n pg_catalog.english\n(1 row)"
  },
  {
   "sql": "SELECT provolatile FROM pg_proc WHERE oid = 'to_tsvector(text)'::regprocedure;",
   "out": " provolatile \n-------------\n s\n(1 row)"
  },
  {
   "sql": "SELECT provolatile FROM pg_proc WHERE oid = 'to_tsvector(regconfig,text)'::regprocedure;",
   "out": " provolatile \n-------------\n i\n(1 row)"
  },
  {
   "sql": "ALTER TABLE note ADD COLUMN tsv tsvector GENERATED ALWAYS AS (to_tsvector(body)) STORED;",
   "out": "ERROR:  generation expression is not immutable"
  },
  {
   "sql": "SELECT to_tsvector('english', 'Bút bi Thiên Long, hộp 20 cây cho học sinh') AS english;",
   "out": "                                      english                                       \n------------------------------------------------------------------------------------\n '20':6 'bi':2 'bút':1 'cho':8 'câi':7 'học':9 'hộp':5 'long':4 'sinh':10 'thiên':3\n(1 row)"
  },
  {
   "sql": "SELECT to_tsvector('simple', 'Bút bi Thiên Long, hộp 20 cây cho học sinh') AS simple;",
   "out": "                                       simple                                       \n------------------------------------------------------------------------------------\n '20':6 'bi':2 'bút':1 'cho':8 'cây':7 'học':9 'hộp':5 'long':4 'sinh':10 'thiên':3\n(1 row)"
  },
  {
   "sql": "SELECT to_tsvector('simple', 'Bút bi Thiên Long') @@ plainto_tsquery('simple', 'but bi') AS go_khong_dau;",
   "out": " go_khong_dau \n--------------\n f\n(1 row)"
  },
  {
   "sql": "CREATE EXTENSION unaccent SCHEMA ch13;",
   "out": "CREATE EXTENSION"
  },
  {
   "sql": "SELECT unaccent('Bút bi Thiên Long — Đặng Văn Linh, Hồ Chí Minh') AS bo_dau;",
   "out": "                     bo_dau                     \n------------------------------------------------\n But bi Thien Long - Dang Van Linh, Ho Chi Minh\n(1 row)"
  },
  {
   "sql": "CREATE TEXT SEARCH CONFIGURATION vi_unaccent (COPY = simple);",
   "out": "CREATE TEXT SEARCH CONFIGURATION"
  },
  {
   "sql": "ALTER TEXT SEARCH CONFIGURATION vi_unaccent ALTER MAPPING FOR hword, hword_part, word WITH unaccent, simple;",
   "out": "ALTER TEXT SEARCH CONFIGURATION"
  },
  {
   "sql": "SELECT to_tsvector('vi_unaccent', 'Bút bi Thiên Long, hộp 20 cây cho học sinh') AS vi_unaccent;",
   "out": "                                    vi_unaccent                                     \n------------------------------------------------------------------------------------\n '20':6 'bi':2 'but':1 'cay':7 'cho':8 'hoc':9 'hop':5 'long':4 'sinh':10 'thien':3\n(1 row)"
  },
  {
   "sql": "SELECT to_tsvector('vi_unaccent', 'Bút bi Thiên Long') @@ plainto_tsquery('vi_unaccent', 'but bi') AS go_khong_dau;",
   "out": " go_khong_dau \n--------------\n t\n(1 row)"
  },
  {
   "sql": "SELECT to_tsvector('vi_unaccent', 'Đặng Văn Linh, Hồ Chí Minh') AS ten_nguoi;",
   "out": "                     ten_nguoi                     \n---------------------------------------------------\n 'chi':5 'dang':1 'ho':4 'linh':3 'minh':6 'van':2\n(1 row)"
  },
  {
   "sql": "SELECT count(*) AS so_sp FROM sp;",
   "out": " so_sp \n-------\n    48\n(1 row)"
  },
  {
   "sql": "ALTER TABLE sp ADD COLUMN tsv tsvector GENERATED ALWAYS AS (\n  setweight(to_tsvector('vi_unaccent', name), 'A') ||\n  setweight(to_tsvector('vi_unaccent', coalesce(attrs->>'brand', '')), 'B') ||\n  setweight(to_tsvector('vi_unaccent', coalesce(attrs->'tags'->>0, '')), 'C')\n) STORED;",
   "out": "ALTER TABLE"
  },
  {
   "sql": "SELECT id, name, tsv FROM sp WHERE id IN (1, 19) ORDER BY id;",
   "out": " id |              name               |                                              tsv                                              \n----+---------------------------------+-----------------------------------------------------------------------------------------------\n  1 | Bút bi Thiên Long TL-027 (xanh) | '-027':6A 'bi':2A 'but':1A 'long':4A,9B 'phong':11C 'thien':3A,8B 'tl':5A 'van':10C 'xanh':7A\n 19 | Vở ô ly Hồng Hà 48 trang        | '48':6A 'ha':5A,9B 'hoc':10C 'hong':4A,8B 'ly':3A 'o':2A 'sinh':11C 'trang':7A 'vo':1A\n(2 rows)"
  },
  {
   "sql": "SELECT id, name, round(ts_rank(tsv, q)::numeric, 3) AS hang\nFROM sp, websearch_to_tsquery('vi_unaccent', 'but bi thien long') AS q\nWHERE tsv @@ q ORDER BY hang DESC, id;",
   "out": " id |                 name                  | hang  \n----+---------------------------------------+-------\n  1 | Bút bi Thiên Long TL-027 (xanh)       | 1.000\n  2 | Bút bi Thiên Long TL-079 (hộp 20 cây) | 1.000\n(2 rows)"
  },
  {
   "sql": "SELECT id, name FROM sp WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'vo hong ha') ORDER BY id;",
   "out": " id |            name            \n----+----------------------------\n 19 | Vở ô ly Hồng Hà 48 trang\n 20 | Vở ô ly Hồng Hà 96 trang\n 23 | Lốc 10 vở Hồng Hà 96 trang\n(3 rows)"
  },
  {
   "sql": "SELECT id, name, attrs->'tags'->>0 AS tag FROM sp WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'sinh') ORDER BY id LIMIT 6;",
   "out": " id |                 name                  |    tag    \n----+---------------------------------------+-----------\n  2 | Bút bi Thiên Long TL-079 (hộp 20 cây) | học sinh\n  3 | Bút bi Pentel BK77 0.7mm              | sinh viên\n  5 | Bút gel Zebra Sarasa Clip 0.5mm       | học sinh\n  7 | Bút chì gỗ Thiên Long 2B GP-01        | sinh viên\n  8 | Bút chì kim Pentel A255 0.5mm         | sinh viên\n 10 | Tẩy Pentel Hi-Polymer                 | sinh viên\n(6 rows)"
  },
  {
   "sql": "SELECT count(*) FILTER (WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'sinh'))         AS sinh,\n       count(*) FILTER (WHERE tsv @@ websearch_to_tsquery('vi_unaccent', '\"hoc sinh\"'))   AS cum_hoc_sinh,\n       count(*) FILTER (WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'sinh hoc'))     AS sinh_va_hoc,\n       count(*) FILTER (WHERE tsv @@ websearch_to_tsquery('vi_unaccent', '\"sinh hoc\"'))   AS cum_sinh_hoc,\n       count(*) FILTER (WHERE tsv @@ websearch_to_tsquery('vi_unaccent', '\"sinh vien\"'))  AS cum_sinh_vien\nFROM sp;",
   "out": " sinh | cum_hoc_sinh | sinh_va_hoc | cum_sinh_hoc | cum_sinh_vien \n------+--------------+-------------+--------------+---------------\n   31 |           15 |          15 |            0 |            16\n(1 row)"
  },
  {
   "sql": "SELECT websearch_to_tsquery('vi_unaccent', '\"hoc sinh\"') AS cum, websearch_to_tsquery('vi_unaccent', 'Bút   bi!!') AS bo_ky_hieu;",
   "out": "       cum        |  bo_ky_hieu  \n------------------+--------------\n 'hoc' <-> 'sinh' | 'but' & 'bi'\n(1 row)"
  },
  {
   "sql": "SELECT to_tsvector('vi_unaccent', 'Cơ sở dữ liệu') @@ websearch_to_tsquery('vi_unaccent', 'co so du lieu') AS khop,\n       to_tsvector('vi_unaccent', 'Cơ sở dữ liệu') @@ websearch_to_tsquery('vi_unaccent', 'csdl') AS viet_tat;",
   "out": " khop | viet_tat \n------+----------\n t    | f\n(1 row)"
  }
 ],
 "4": [
  {
   "sql": "SET search_path = ch13;",
   "out": "SET"
  },
  {
   "sql": "SET max_parallel_workers_per_gather = 0;",
   "out": "SET"
  },
  {
   "sql": "CREATE EXTENSION pg_trgm SCHEMA ch13;",
   "out": "CREATE EXTENSION"
  },
  {
   "sql": "SELECT to_tsvector('simple', 'Nguyen Van An') @@ to_tsquery('simple', 'nguyn') AS fts_go_sai;",
   "out": " fts_go_sai \n------------\n f\n(1 row)"
  },
  {
   "sql": "SELECT show_trgm('cat') AS ba_ky_tu;",
   "out": "        ba_ky_tu         \n-------------------------\n {\"  c\",\" ca\",\"at \",cat}\n(1 row)"
  },
  {
   "sql": "SELECT show_trgm('Nguyen') AS nguyen, show_trgm('Nguyn') AS nguyn;",
   "out": "               nguyen                |              nguyn              \n-------------------------------------+---------------------------------\n {\"  n\",\" ng\",\"en \",guy,ngu,uye,yen} | {\"  n\",\" ng\",guy,ngu,uyn,\"yn \"}\n(1 row)"
  },
  {
   "sql": "SELECT similarity('Nguyen', 'Nguyn') AS go_sai;",
   "out": "   go_sai   \n------------\n 0.44444445\n(1 row)"
  },
  {
   "sql": "SELECT similarity('PostgreSQL', 'PostgresSQL') AS gan_giong, similarity('PostgreSQL', 'MySQL') AS khac_han;",
   "out": " gan_giong |  khac_han  \n-----------+------------\n 0.7692308 | 0.13333334\n(1 row)"
  },
  {
   "sql": "SELECT show_limit() AS nguong, current_setting('pg_trgm.similarity_threshold') AS bien;",
   "out": " nguong | bien \n--------+------\n    0.3 | 0.3\n(1 row)"
  },
  {
   "sql": "SELECT 'PostgreSQL' % 'PostgresSQL' AS gan, 'PostgreSQL' % 'MySQL' AS xa;",
   "out": " gan | xa \n-----+----\n t   | f\n(1 row)"
  },
  {
   "sql": "SELECT similarity('index', 'PostgreSQL indexing basics') AS similarity,\n       word_similarity('index', 'PostgreSQL indexing basics') AS word_similarity,\n       strict_word_similarity('index', 'PostgreSQL indexing basics') AS strict_word;",
   "out": " similarity | word_similarity | strict_word \n------------+-----------------+-------------\n 0.17857143 |       0.8333333 |         0.5\n(1 row)"
  },
  {
   "sql": "SELECT 'PostgreSQL' <-> 'PostgresSQL' AS khoang_cach;",
   "out": " khoang_cach \n-------------\n  0.23076922\n(1 row)"
  },
  {
   "sql": "SELECT title, round(similarity(title, 'postgres indexs')::numeric, 3) AS diem\nFROM article WHERE id <= 3 ORDER BY diem DESC LIMIT 3;",
   "out": "           title            | diem  \n----------------------------+-------\n PostgreSQL indexing basics | 0.433\n Fast queries with indexes  | 0.171\n Scaling a database         | 0.000\n(3 rows)"
  },
  {
   "sql": "SELECT full_name, count(*) AS so_khach, round(max(similarity(full_name, 'Nguyen Minh Phuc'))::numeric, 3) AS diem FROM kh GROUP BY full_name ORDER BY diem DESC, full_name LIMIT 3;",
   "out": "    full_name     | so_khach | diem  \n------------------+----------+-------\n Nguyễn Minh Phúc |        3 | 0.478\n Nguyễn Minh An   |        2 | 0.391\n Nguyễn Minh Hà   |        2 | 0.391\n(3 rows)"
  },
  {
   "sql": "SELECT count(*) FROM article WHERE title ILIKE '%12345%';",
   "out": " count \n-------\n    12\n(1 row)"
  },
  {
   "sql": "SELECT id, title FROM article WHERE title ILIKE '%12345%' ORDER BY id;",
   "out": "   id   |    title    \n--------+-------------\n  12348 | Note 12345\n 112348 | Note 112345\n 123453 | Note 123450\n 123454 | Note 123451\n 123455 | Note 123452\n 123456 | Note 123453\n 123457 | Note 123454\n 123458 | Note 123455\n 123459 | Note 123456\n 123460 | Note 123457\n 123461 | Note 123458\n 123462 | Note 123459\n(12 rows)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM article WHERE title ILIKE '%12345%';",
   "out": "                                                 QUERY PLAN                                                  \n-------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=7564.09..7564.10 rows=1 width=8) (actual time=77.102..77.103 rows=1 loops=1)\n   ->  Seq Scan on article  (cost=0.00..7564.04 rows=20 width=0) (actual time=4.481..77.092 rows=12 loops=1)\n         Filter: (title ~~* '%12345%'::text)\n         Rows Removed by Filter: 199991\n Planning Time: 0.086 ms\n Execution Time: 77.121 ms\n(6 rows)"
  },
  {
   "sql": "CREATE INDEX article_title_btree ON article (title);",
   "out": "CREATE INDEX"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM article WHERE title ILIKE '%12345%';",
   "out": "                                                                  QUERY PLAN                                                                  \n----------------------------------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=6592.52..6592.53 rows=1 width=8) (actual time=79.033..79.033 rows=1 loops=1)\n   ->  Index Only Scan using article_title_btree on article  (cost=0.42..6592.47 rows=20 width=0) (actual time=5.404..79.025 rows=12 loops=1)\n         Filter: (title ~~* '%12345%'::text)\n         Rows Removed by Filter: 199991\n         Heap Fetches: 0\n Planning Time: 0.210 ms\n Execution Time: 79.050 ms\n(7 rows)"
  },
  {
   "sql": "EXPLAIN SELECT count(*) FROM article WHERE title LIKE 'Note 12345%';",
   "out": "                                            QUERY PLAN                                            \n--------------------------------------------------------------------------------------------------\n Aggregate  (cost=6592.52..6592.53 rows=1 width=8)\n   ->  Index Only Scan using article_title_btree on article  (cost=0.42..6592.47 rows=20 width=0)\n         Filter: (title ~~ 'Note 12345%'::text)\n(3 rows)"
  },
  {
   "sql": "DROP INDEX article_title_btree;",
   "out": "DROP INDEX"
  },
  {
   "sql": "\\timing on",
   "out": "Timing is on."
  },
  {
   "sql": "CREATE INDEX article_title_trgm ON article USING GIN (title gin_trgm_ops);",
   "out": "CREATE INDEX\nTime: 421.909 ms"
  },
  {
   "sql": "\\timing off",
   "out": "Timing is off."
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM article WHERE title ILIKE '%12345%';",
   "out": "                                                             QUERY PLAN                                                             \n------------------------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=106.81..106.82 rows=1 width=8) (actual time=0.060..0.060 rows=1 loops=1)\n   ->  Bitmap Heap Scan on article  (cost=30.28..106.76 rows=20 width=0) (actual time=0.048..0.057 rows=12 loops=1)\n         Recheck Cond: (title ~~* '%12345%'::text)\n         Heap Blocks: exact=3\n         ->  Bitmap Index Scan on article_title_trgm  (cost=0.00..30.27 rows=20 width=0) (actual time=0.041..0.041 rows=12 loops=1)\n               Index Cond: (title ~~* '%12345%'::text)\n Planning Time: 0.161 ms\n Execution Time: 0.075 ms\n(8 rows)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM article WHERE title ~ '1234[0-9]$';",
   "out": "                                                              QUERY PLAN                                                              \n--------------------------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=193.20..193.21 rows=1 width=8) (actual time=0.296..0.297 rows=1 loops=1)\n   ->  Bitmap Heap Scan on article  (cost=116.67..193.15 rows=20 width=0) (actual time=0.228..0.294 rows=20 loops=1)\n         Recheck Cond: (title ~ '1234[0-9]$'::text)\n         Rows Removed by Index Recheck: 100\n         Heap Blocks: exact=6\n         ->  Bitmap Index Scan on article_title_trgm  (cost=0.00..116.67 rows=20 width=0) (actual time=0.217..0.218 rows=120 loops=1)\n               Index Cond: (title ~ '1234[0-9]$'::text)\n Planning Time: 0.194 ms\n Execution Time: 0.310 ms\n(9 rows)"
  },
  {
   "sql": "SELECT show_trgm('12345') AS trigram_cua_mau;",
   "out": "         trigram_cua_mau         \n---------------------------------\n {\"  1\",\" 12\",123,234,345,\"45 \"}\n(1 row)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM article WHERE title ILIKE '%12%';",
   "out": "                                                    QUERY PLAN                                                     \n-------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=7599.39..7599.40 rows=1 width=8) (actual time=72.385..72.385 rows=1 loops=1)\n   ->  Seq Scan on article  (cost=0.00..7564.04 rows=14142 width=0) (actual time=0.012..71.774 rows=17641 loops=1)\n         Filter: (title ~~* '%12%'::text)\n         Rows Removed by Filter: 182362\n Planning Time: 0.073 ms\n Execution Time: 72.399 ms\n(6 rows)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT title FROM article WHERE similarity(title, 'Note 12345') > 0.6;",
   "out": "                                                 QUERY PLAN                                                  \n-------------------------------------------------------------------------------------------------------------\n Seq Scan on article  (cost=0.00..8064.05 rows=66668 width=11) (actual time=0.233..378.567 rows=153 loops=1)\n   Filter: (similarity(title, 'Note 12345'::text) > '0.6'::double precision)\n   Rows Removed by Filter: 199850\n Planning Time: 0.068 ms\n Execution Time: 378.597 ms\n(5 rows)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT title FROM article WHERE title % 'Note 12345';",
   "out": "                                                               QUERY PLAN                                                                \n-----------------------------------------------------------------------------------------------------------------------------------------\n Bitmap Heap Scan on article  (cost=902.77..7456.70 rows=119194 width=11) (actual time=24.356..409.745 rows=121594 loops=1)\n   Recheck Cond: (title % 'Note 12345'::text)\n   Rows Removed by Index Recheck: 78406\n   Heap Blocks: exact=5064\n   ->  Bitmap Index Scan on article_title_trgm  (cost=0.00..872.98 rows=119194 width=0) (actual time=23.878..23.878 rows=200000 loops=1)\n         Index Cond: (title % 'Note 12345'::text)\n Planning Time: 0.253 ms\n Execution Time: 412.913 ms\n(8 rows)"
  },
  {
   "sql": "SET pg_trgm.similarity_threshold = 0.6;",
   "out": "SET"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT title FROM article WHERE title % 'Note 12345';",
   "out": "                                                            QUERY PLAN                                                            \n----------------------------------------------------------------------------------------------------------------------------------\n Bitmap Heap Scan on article  (cost=107.99..184.47 rows=20 width=11) (actual time=5.862..32.485 rows=153 loops=1)\n   Recheck Cond: (title % 'Note 12345'::text)\n   Rows Removed by Index Recheck: 12726\n   Heap Blocks: exact=1490\n   ->  Bitmap Index Scan on article_title_trgm  (cost=0.00..107.98 rows=20 width=0) (actual time=5.714..5.714 rows=12879 loops=1)\n         Index Cond: (title % 'Note 12345'::text)\n Planning Time: 0.254 ms\n Execution Time: 32.516 ms\n(8 rows)"
  },
  {
   "sql": "SELECT title, round(similarity(title, 'Note 12345')::numeric, 3) AS diem FROM article WHERE title % 'Note 12345' ORDER BY diem DESC, title LIMIT 5;",
   "out": "    title    | diem  \n-------------+-------\n Note 12345  | 1.000\n Note 112345 | 0.769\n Note 122345 | 0.769\n Note 123345 | 0.769\n Note 123445 | 0.769\n(5 rows)"
  },
  {
   "sql": "RESET pg_trgm.similarity_threshold;",
   "out": "RESET"
  },
  {
   "sql": "\\timing on",
   "out": "Timing is on."
  },
  {
   "sql": "CREATE INDEX article_title_gist ON article USING GIST (title gist_trgm_ops);",
   "out": "CREATE INDEX\nTime: 2426.855 ms (00:02.427)"
  },
  {
   "sql": "\\timing off",
   "out": "Timing is off."
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT title FROM article ORDER BY title <-> 'Note 12345' LIMIT 3;",
   "out": "                                                                 QUERY PLAN                                                                  \n---------------------------------------------------------------------------------------------------------------------------------------------\n Limit  (cost=0.28..0.76 rows=3 width=15) (actual time=1.595..21.071 rows=3 loops=1)\n   ->  Index Scan using article_title_gist on article  (cost=0.28..32036.34 rows=200003 width=15) (actual time=1.593..21.069 rows=3 loops=1)\n         Order By: (title <-> 'Note 12345'::text)\n Planning Time: 0.154 ms\n Execution Time: 21.676 ms\n(5 rows)"
  },
  {
   "sql": "BEGIN;",
   "out": "BEGIN"
  },
  {
   "sql": "DROP INDEX article_title_gist;",
   "out": "DROP INDEX"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT title FROM article ORDER BY title <-> 'Note 12345' LIMIT 3;",
   "out": "                                                         QUERY PLAN                                                          \n-----------------------------------------------------------------------------------------------------------------------------\n Limit  (cost=10149.04..10149.05 rows=3 width=15) (actual time=417.997..418.000 rows=3 loops=1)\n   ->  Sort  (cost=10149.04..10649.05 rows=200003 width=15) (actual time=417.995..417.997 rows=3 loops=1)\n         Sort Key: ((title <-> 'Note 12345'::text))\n         Sort Method: top-N heapsort  Memory: 25kB\n         ->  Seq Scan on article  (cost=0.00..7564.04 rows=200003 width=15) (actual time=0.015..400.121 rows=200003 loops=1)\n Planning Time: 0.072 ms\n Execution Time: 418.015 ms\n(7 rows)"
  },
  {
   "sql": "ROLLBACK;",
   "out": "ROLLBACK"
  },
  {
   "sql": "SELECT title, round((title <-> 'Note 12345')::numeric, 3) AS khoang_cach FROM article ORDER BY title <-> 'Note 12345' LIMIT 3;",
   "out": "    title    | khoang_cach \n-------------+-------------\n Note 12345  |       0.000\n Note 123445 |       0.231\n Note 123458 |       0.231\n(3 rows)"
  },
  {
   "sql": "SELECT indexrelname, pg_size_pretty(pg_relation_size(indexrelid)) AS kich_thuoc FROM pg_stat_user_indexes WHERE relname = 'article' ORDER BY indexrelname;",
   "out": "    indexrelname    | kich_thuoc \n--------------------+------------\n article_pkey       | 4408 kB\n article_title_gist | 15 MB\n article_title_trgm | 4560 kB\n article_tsv_gin    | 13 MB\n(4 rows)"
  },
  {
   "sql": "SELECT provolatile FROM pg_proc WHERE oid = 'unaccent(text)'::regprocedure;",
   "out": " provolatile \n-------------\n s\n(1 row)"
  },
  {
   "sql": "CREATE INDEX sp_name_unaccent ON sp USING GIN (unaccent(name) gin_trgm_ops);",
   "out": "ERROR:  functions in index expression must be marked IMMUTABLE"
  },
  {
   "sql": "CREATE FUNCTION f_unaccent(text) RETURNS text\n  LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT\n  RETURN ch13.unaccent('ch13.unaccent'::regdictionary, $1);",
   "out": "CREATE FUNCTION"
  },
  {
   "sql": "SELECT f_unaccent('Bút bi Thiên Long') AS bo_dau;",
   "out": "      bo_dau       \n-------------------\n But bi Thien Long\n(1 row)"
  },
  {
   "sql": "CREATE INDEX sp_name_trgm ON sp USING GIN (lower(f_unaccent(name)) gin_trgm_ops);",
   "out": "CREATE INDEX"
  },
  {
   "sql": "SELECT id, name FROM sp WHERE lower(f_unaccent(name)) LIKE '%' || lower(f_unaccent('but bi')) || '%' ORDER BY id;",
   "out": " id |                 name                  \n----+---------------------------------------\n  1 | Bút bi Thiên Long TL-027 (xanh)\n  2 | Bút bi Thiên Long TL-079 (hộp 20 cây)\n  3 | Bút bi Pentel BK77 0.7mm\n  6 | Bút bi bấm Deli 0.7mm (hộp 12 cây)\n(4 rows)"
  },
  {
   "sql": "SELECT id, name FROM sp WHERE lower(f_unaccent(name)) LIKE '%thien long%' ORDER BY id;",
   "out": " id |                 name                  \n----+---------------------------------------\n  1 | Bút bi Thiên Long TL-027 (xanh)\n  2 | Bút bi Thiên Long TL-079 (hộp 20 cây)\n  7 | Bút chì gỗ Thiên Long 2B GP-01\n 13 | Bút dạ quang Thiên Long HL-03\n 37 | Thước kẻ nhựa Thiên Long 20cm\n 39 | Bộ thước ê-ke đo độ Thiên Long\n 40 | Compa chì kim Thiên Long\n(7 rows)"
  },
  {
   "sql": "CREATE TABLE sp_lon AS\nSELECT g AS id, s.name || ' — lô ' || g AS name\nFROM generate_series(1, 200000) AS g JOIN sp s ON s.id = (g % 48) + 1;",
   "out": "SELECT 200000"
  },
  {
   "sql": "CREATE INDEX sp_lon_trgm ON sp_lon USING GIN (lower(f_unaccent(name)) gin_trgm_ops);",
   "out": "CREATE INDEX"
  },
  {
   "sql": "VACUUM ANALYZE sp_lon;",
   "out": "VACUUM"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM sp_lon WHERE lower(f_unaccent(name)) LIKE '%thien long tl-027%';",
   "out": "                                                            QUERY PLAN                                                            \n----------------------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=3340.67..3340.68 rows=1 width=8) (actual time=15.566..15.567 rows=1 loops=1)\n   ->  Bitmap Heap Scan on sp_lon  (cost=205.07..3330.57 rows=4040 width=0) (actual time=4.433..15.393 rows=4166 loops=1)\n         Recheck Cond: (lower(f_unaccent(name)) ~~ '%thien long tl-027%'::text)\n         Heap Blocks: exact=2046\n         ->  Bitmap Index Scan on sp_lon_trgm  (cost=0.00..204.06 rows=4040 width=0) (actual time=4.217..4.218 rows=4166 loops=1)\n               Index Cond: (lower(f_unaccent(name)) ~~ '%thien long tl-027%'::text)\n Planning Time: 0.101 ms\n Execution Time: 15.588 ms\n(8 rows)"
  },
  {
   "sql": "EXPLAIN ANALYZE SELECT count(*) FROM sp_lon WHERE lower(unaccent(name)) LIKE '%thien long tl-027%';",
   "out": "                                                  QUERY PLAN                                                   \n---------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=5548.05..5548.06 rows=1 width=8) (actual time=335.923..335.924 rows=1 loops=1)\n   ->  Seq Scan on sp_lon  (cost=0.00..5548.00 rows=20 width=0) (actual time=0.091..335.721 rows=4166 loops=1)\n         Filter: (lower(unaccent(name)) ~~ '%thien long tl-027%'::text)\n         Rows Removed by Filter: 195834\n Planning Time: 0.043 ms\n Execution Time: 335.966 ms\n(6 rows)"
  },
  {
   "sql": "SELECT name, round(word_similarity('thien lomg', lower(f_unaccent(name)))::numeric, 3) AS diem FROM sp ORDER BY diem DESC, id LIMIT 4;",
   "out": "                 name                  | diem  \n---------------------------------------+-------\n Bút bi Thiên Long TL-027 (xanh)       | 0.727\n Bút bi Thiên Long TL-079 (hộp 20 cây) | 0.727\n Bút chì gỗ Thiên Long 2B GP-01        | 0.727\n Bút dạ quang Thiên Long HL-03         | 0.727\n(4 rows)"
  },
  {
   "sql": "SELECT full_name, count(*) AS so_khach, round(max(similarity(lower(f_unaccent(full_name)), 'nguyen minh phuk'))::numeric, 3) AS diem FROM kh GROUP BY full_name ORDER BY diem DESC, full_name LIMIT 3;",
   "out": "    full_name     | so_khach | diem  \n------------------+----------+-------\n Nguyễn Minh Phúc |        3 | 0.789\n Nguyễn Minh An   |        2 | 0.600\n Nguyễn Minh Hà   |        2 | 0.600\n(3 rows)"
  },
  {
   "sql": "ALTER TABLE sp ADD COLUMN name_fold text GENERATED ALWAYS AS (lower(translate(name,\n  'àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ',\n  'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD'))) STORED;",
   "out": "ALTER TABLE"
  },
  {
   "sql": "SELECT id, name, name_fold FROM sp WHERE id IN (1, 19, 43) ORDER BY id;",
   "out": " id |               name                |             name_fold             \n----+-----------------------------------+-----------------------------------\n  1 | Bút bi Thiên Long TL-027 (xanh)   | but bi thien long tl-027 (xanh)\n 19 | Vở ô ly Hồng Hà 48 trang          | vo o ly hong ha 48 trang\n 43 | Giáo trình Cơ sở dữ liệu (bản in) | giao trinh co so du lieu (ban in)\n(3 rows)"
  },
  {
   "sql": "ALTER TABLE sp ADD COLUMN name_fold2 text GENERATED ALWAYS AS (lower(unaccent(name))) STORED;",
   "out": "ERROR:  generation expression is not immutable"
  },
  {
   "sql": "SELECT id, name, 'fts' AS cach FROM sp WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'compa staedler')\nUNION ALL\nSELECT id, name, 'trigram' FROM (\n  SELECT id, name FROM sp\n  WHERE NOT EXISTS (SELECT 1 FROM sp WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'compa staedler'))\n  ORDER BY word_similarity('compa staedler', name_fold) DESC LIMIT 3\n) AS lui;",
   "out": " id |                  name                   |  cach   \n----+-----------------------------------------+---------\n 41 | Compa Staedtler Noris                   | trigram\n 40 | Compa chì kim Thiên Long                | trigram\n 11 | Bút chì Staedtler Noris 2B (hộp 12 cây) | trigram\n(3 rows)"
  },
  {
   "sql": "CREATE TABLE longdoc AS\nSELECT i AS id, (SELECT string_agg((ARRAY['postgres','index','query','table','row','column','vacuum','planner','join','hash','merge','scan','tuple','page','buffer','lock','commit','rollback','snapshot','replica','backup','restore','schema','view','trigger','function','json','array','search','vector','ranking','lexeme','token','stem','word','phrase','server','client','pool','connection','timeout','latency','throughput','cache','memory','disk','write','read','update','insert','delete','select','where','group','order','limit','offset','window','partition','sequence'])[1 + ((i * 7919 + j * 104729) % 60)], ' ') FROM generate_series(1, 300) AS j) AS body\nFROM generate_series(1, 20000) AS i;",
   "out": "SELECT 20000"
  },
  {
   "sql": "SELECT count(*) AS so_bai, avg(length(body))::int AS do_dai_tb FROM longdoc;",
   "out": " so_bai | do_dai_tb \n--------+-----------\n  20000 |      2039\n(1 row)"
  },
  {
   "sql": "\\timing on",
   "out": "Timing is on."
  },
  {
   "sql": "CREATE INDEX longdoc_trgm ON longdoc USING GIN (body gin_trgm_ops);",
   "out": "CREATE INDEX\nTime: 5551.452 ms (00:05.551)"
  },
  {
   "sql": "CREATE INDEX longdoc_fts ON longdoc USING GIN (to_tsvector('english', body));",
   "out": "CREATE INDEX\nTime: 4463.289 ms (00:04.463)"
  },
  {
   "sql": "\\timing off",
   "out": "Timing is off."
  },
  {
   "sql": "SELECT relname AS ten, pg_size_pretty(pg_relation_size(oid)) AS kich_thuoc FROM pg_class\nWHERE relname IN ('longdoc', 'longdoc_trgm', 'longdoc_fts') ORDER BY pg_relation_size(oid) DESC;",
   "out": "     ten      | kich_thuoc \n--------------+------------\n longdoc      | 10 MB\n longdoc_trgm | 10096 kB\n longdoc_fts  | 1904 kB\n(3 rows)"
  }
 ],
 "1ex": [
  {
   "sql": "SET search_path = ch13;",
   "out": "SET"
  },
  {
   "sql": "SELECT name, (props->'specs'->>'ram')::int AS ram, coalesce(props#>>'{specs,cpu}', 'n/a') AS cpu, (props->>'price')::numeric AS price\nFROM product WHERE props @? '$.specs ? (@.ram >= 8)' ORDER BY price DESC;",
   "out": "     name      | ram | cpu | price \n---------------+-----+-----+-------\n Laptop Pro 14 |  16 | M3  |  1299\n Laptop Air 13 |   8 | M2  |   999\n Phone X       |   8 | n/a |   799\n(3 rows)"
  },
  {
   "sql": "BEGIN;",
   "out": "BEGIN"
  },
  {
   "sql": "UPDATE product SET props = jsonb_set(props, '{tags}', (props->'tags') || '[\"sale\"]')\nWHERE props @> '{\"brand\":\"Acme\"}' RETURNING name, props->'tags' AS tags;",
   "out": "     name      |            tags             \n---------------+-----------------------------\n Laptop Pro 14 | [\"laptop\", \"pro\", \"sale\"]\n Laptop Air 13 | [\"laptop\", \"light\", \"sale\"]\n Keyboard K1   | [\"accessory\", \"sale\"]\n(3 rows)\n\nUPDATE 3"
  },
  {
   "sql": "ROLLBACK;",
   "out": "ROLLBACK"
  },
  {
   "sql": "SELECT props->>'brand' AS brand, count(*) AS so_sp, round(avg((props->>'price')::numeric)) AS gia_tb\nFROM product GROUP BY 1 ORDER BY 1;",
   "out": " brand | so_sp | gia_tb \n-------+-------+--------\n Acme  |     3 |    796\n Zeta  |     2 |    624\n(2 rows)"
  }
 ],
 "2ex": [
  {
   "sql": "SET search_path = ch13;",
   "out": "SET"
  },
  {
   "sql": "SET max_parallel_workers_per_gather = 0;",
   "out": "SET"
  },
  {
   "sql": "SELECT count(*) FROM ev WHERE props @> '{\"specs\":{\"ram\":16},\"color\":\"red\"}';",
   "out": " count \n-------\n 10000\n(1 row)"
  },
  {
   "sql": "EXPLAIN SELECT count(*) FROM ev WHERE props @> '{\"specs\":{\"ram\":16},\"color\":\"red\"}';",
   "out": "                                        QUERY PLAN                                        \n------------------------------------------------------------------------------------------\n Aggregate  (cost=5442.73..5442.74 rows=1 width=8)\n   ->  Bitmap Heap Scan on ev  (cost=70.13..5427.58 rows=6061 width=0)\n         Recheck Cond: (props @> '{\"color\": \"red\", \"specs\": {\"ram\": 16}}'::jsonb)\n         ->  Bitmap Index Scan on ev_props_gin_path  (cost=0.00..68.61 rows=6061 width=0)\n               Index Cond: (props @> '{\"color\": \"red\", \"specs\": {\"ram\": 16}}'::jsonb)\n(5 rows)"
  },
  {
   "sql": "EXPLAIN SELECT count(*) FROM ev WHERE props ?& array['color','sku'];",
   "out": "                                      QUERY PLAN                                       \n---------------------------------------------------------------------------------------\n Aggregate  (cost=5444.99..5445.00 rows=1 width=8)\n   ->  Bitmap Heap Scan on ev  (cost=150.26..5399.54 rows=18182 width=0)\n         Recheck Cond: (props ?& '{color,sku}'::text[])\n         ->  Bitmap Index Scan on ev_props_gin  (cost=0.00..145.72 rows=18182 width=0)\n               Index Cond: (props ?& '{color,sku}'::text[])\n(5 rows)"
  },
  {
   "sql": "EXPLAIN SELECT count(*) FROM ev WHERE (props->>'price')::numeric BETWEEN 10 AND 12;",
   "out": "                                                                   QUERY PLAN                                                                    \n-------------------------------------------------------------------------------------------------------------------------------------------------\n Aggregate  (cost=997.66..997.67 rows=1 width=8)\n   ->  Bitmap Heap Scan on ev  (cost=7.59..996.89 rows=309 width=0)\n         Recheck Cond: ((((props ->> 'price'::text))::numeric >= '10'::numeric) AND (((props ->> 'price'::text))::numeric <= '12'::numeric))\n         ->  Bitmap Index Scan on ev_price  (cost=0.00..7.51 rows=309 width=0)\n               Index Cond: ((((props ->> 'price'::text))::numeric >= '10'::numeric) AND (((props ->> 'price'::text))::numeric <= '12'::numeric))\n(5 rows)"
  },
  {
   "sql": "SELECT count(*) FROM ev WHERE (props->>'price')::numeric BETWEEN 10 AND 12;",
   "out": " count \n-------\n   300\n(1 row)"
  },
  {
   "sql": "SELECT indexrelname, idx_scan, pg_size_pretty(pg_relation_size(indexrelid)) AS kich_thuoc FROM pg_stat_user_indexes WHERE schemaname = 'ch13' AND relname = 'ev' ORDER BY indexrelname;",
   "out": "   indexrelname    | idx_scan | kich_thuoc \n-------------------+----------+------------\n ev_pkey           |        2 | 4408 kB\n ev_price          |       17 | 4416 kB\n ev_props_gin      |        6 | 19 MB\n ev_props_gin_path |        6 | 14 MB\n ev_sku            |        1 | 6184 kB\n(5 rows)"
  }
 ],
 "3ex": [
  {
   "sql": "SET search_path = ch13;",
   "out": "SET"
  },
  {
   "sql": "SET max_parallel_workers_per_gather = 0;",
   "out": "SET"
  },
  {
   "sql": "SELECT id, title, round(ts_rank(tsv, q)::numeric, 4) AS hang\nFROM article, websearch_to_tsquery('english', 'fast indexes -replicas') AS q\nWHERE tsv @@ q ORDER BY hang DESC;",
   "out": " id |           title            |  hang  \n----+----------------------------+--------\n  3 | Fast queries with indexes  | 0.9772\n  1 | PostgreSQL indexing basics | 0.7511\n(2 rows)"
  },
  {
   "sql": "SELECT id, name, ts_headline('vi_unaccent', name, websearch_to_tsquery('vi_unaccent', 'thuoc thien long'), 'StartSel=[, StopSel=]') AS trich\nFROM sp WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'thuoc thien long') ORDER BY id;",
   "out": " id |              name              |                trich                 \n----+--------------------------------+--------------------------------------\n 37 | Thước kẻ nhựa Thiên Long 20cm  | [Thước] kẻ nhựa [Thiên] [Long] 20cm\n 39 | Bộ thước ê-ke đo độ Thiên Long | Bộ [thước] ê-ke đo độ [Thiên] [Long]\n(2 rows)"
  },
  {
   "sql": "EXPLAIN SELECT id FROM sp WHERE tsv @@ websearch_to_tsquery('vi_unaccent', 'thuoc');",
   "out": "                    QUERY PLAN                    \n--------------------------------------------------\n Seq Scan on sp  (cost=0.00..2.60 rows=1 width=8)\n   Filter: (tsv @@ '''thuoc'''::tsquery)\n(2 rows)"
  }
 ],
 "4ex": [
  {
   "sql": "SET search_path = ch13;",
   "out": "SET"
  },
  {
   "sql": "SET max_parallel_workers_per_gather = 0;",
   "out": "SET"
  },
  {
   "sql": "SELECT id, name, round(word_similarity('pentl', name_fold)::numeric, 3) AS diem\nFROM sp WHERE 'pentl' <% name_fold ORDER BY diem DESC, id LIMIT 5;",
   "out": " id |             name              | diem  \n----+-------------------------------+-------\n  3 | Bút bi Pentel BK77 0.7mm      | 0.667\n  8 | Bút chì kim Pentel A255 0.5mm | 0.667\n  9 | Ruột chì kim Pentel 0.5mm 2B  | 0.667\n 10 | Tẩy Pentel Hi-Polymer         | 0.667\n 18 | Bút dạ quang Pentel Illumina  | 0.667\n(5 rows)"
  },
  {
   "sql": "EXPLAIN SELECT count(*) FROM sp_lon WHERE lower(f_unaccent(name)) LIKE '%casio fx-5%';",
   "out": "                                     QUERY PLAN                                      \n-------------------------------------------------------------------------------------\n Aggregate  (cost=4350.43..4350.44 rows=1 width=8)\n   ->  Bitmap Heap Scan on sp_lon  (cost=140.76..4330.22 rows=8081 width=0)\n         Recheck Cond: (lower(f_unaccent(name)) ~~ '%casio fx-5%'::text)\n         ->  Bitmap Index Scan on sp_lon_trgm  (cost=0.00..138.74 rows=8081 width=0)\n               Index Cond: (lower(f_unaccent(name)) ~~ '%casio fx-5%'::text)\n(5 rows)"
  },
  {
   "sql": "SELECT count(*) FROM sp_lon WHERE lower(f_unaccent(name)) LIKE '%casio fx-5%';",
   "out": " count \n-------\n  8334\n(1 row)"
  }
 ],
 "ctshop": [
  {
   "sql": "SET search_path = shop;",
   "out": "SET"
  },
  {
   "sql": "SELECT k AS khoa, count(*) AS so_sp FROM product, jsonb_object_keys(attrs) AS k GROUP BY k ORDER BY so_sp DESC, k;",
   "out": " khoa  | so_sp \n-------+-------\n brand |    48\n color |    48\n tags  |    48\n(3 rows)"
  },
  {
   "sql": "SELECT attrs->>'brand' AS brand, count(*) AS so_sp FROM product GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT 5;",
   "out": "   brand    | so_sp \n------------+-------\n Thiên Long |     7\n Deli       |     6\n CT Books   |     5\n Pentel     |     5\n Casio      |     4\n(5 rows)"
  },
  {
   "sql": "SELECT id, name, attrs->>'color' AS color FROM product WHERE attrs @> '{\"color\":\"đỏ\"}' ORDER BY id;",
   "out": " id |              name               | color \n----+---------------------------------+-------\n  4 | Bút gel Uni-ball Signo 0.5mm    | đỏ\n  8 | Bút chì kim Pentel A255 0.5mm   | đỏ\n 10 | Tẩy Pentel Hi-Polymer           | đỏ\n 23 | Lốc 10 vở Hồng Hà 96 trang      | đỏ\n 28 | Sổ tay Deli B5 kẻ ngang         | đỏ\n 36 | Máy tính Deli D82TL             | đỏ\n 42 | Bộ thước vẽ kỹ thuật Deli 4 món | đỏ\n 46 | Sổ tay SQL bỏ túi               | đỏ\n(8 rows)"
  },
  {
   "sql": "SELECT t AS tag, count(*) AS so_sp FROM product, jsonb_array_elements_text(attrs->'tags') AS t GROUP BY t ORDER BY 2 DESC, 1;",
   "out": "    tag    | so_sp \n-----------+-------\n văn phòng |    17\n sinh viên |    16\n học sinh  |    15\n(3 rows)"
  },
  {
   "sql": "SELECT id, name, attrs FROM product WHERE NOT attrs ? 'color' ORDER BY id LIMIT 3;",
   "out": " id | name | attrs \n----+------+-------\n(0 rows)"
  }
 ]
};
/** Lấy output theo đoạn đầu câu SQL (duy nhất). */
export function O(k, dau, lan = 0) {
  const ds = T[k].filter((x) => x.sql.startsWith(dau) || x.sql.includes(dau));
  if (!ds[lan]) throw new Error('pg-13-out: không thấy ' + k + ' / ' + dau);
  return ds[lan];
}
