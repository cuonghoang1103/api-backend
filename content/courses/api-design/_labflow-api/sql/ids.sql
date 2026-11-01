\timing on
DROP TABLE IF EXISTS id_seq, id_v4, id_v7;
CREATE TABLE id_seq (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, n int);
CREATE TABLE id_v4 (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), n int);
CREATE TABLE id_v7 (id uuid PRIMARY KEY DEFAULT uuidv7(), n int);
INSERT INTO id_seq (n) SELECT g FROM generate_series(1, 1000000) g;
INSERT INTO id_v4 (n) SELECT g FROM generate_series(1, 1000000) g;
INSERT INTO id_v7 (n) SELECT g FROM generate_series(1, 1000000) g;
\timing off
SELECT relname AS index, pg_size_pretty(pg_relation_size(oid)) AS size FROM pg_class WHERE relname IN ('id_seq_pkey', 'id_v4_pkey', 'id_v7_pkey') ORDER BY relname;
SELECT id, uuid_extract_timestamp(id) AS created FROM id_v7 ORDER BY id LIMIT 2;
SELECT id FROM id_v4 ORDER BY id LIMIT 2;
