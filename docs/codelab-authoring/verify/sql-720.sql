\set ON_ERROR_STOP on
\pset pager off
DROP TABLE IF EXISTS events CASCADE;
CREATE TABLE events (
  id         INT  PRIMARY KEY,
  user_id    INT  NOT NULL,
  kind       TEXT NOT NULL,
  email      TEXT NOT NULL,
  payload    JSONB NOT NULL,
  created_at DATE NOT NULL
);
INSERT INTO events
SELECT g,
       g % 5000,
       (ARRAY['click','view','buy','error'])[1 + g % 4],
       'User' || (g % 5000) || '@Example.IO',
       jsonb_build_object('score', g % 100, 'tags', to_jsonb(ARRAY[(ARRAY['a','b','c'])[1 + g % 3]])),
       DATE '2026-01-01' + (g % 200)
FROM generate_series(1, 60000) g;
ANALYZE events;

-- Reports which plan the planner chose: node type, the index it used, and the
-- condition pushed into that index. These are stable run to run; buffer counts
-- and timings are not, so they are what the exercises assert on.
CREATE OR REPLACE FUNCTION plan_uses(q TEXT) RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE j JSONB; node TEXT; idx TEXT; cond TEXT;
BEGIN
  EXECUTE 'EXPLAIN (FORMAT JSON, COSTS OFF) ' || q INTO j;
  node := j->0->'Plan'->>'Node Type';
  SELECT string_agg(DISTINCT v #>> '{}', ',') INTO idx  FROM jsonb_path_query(j, '$.**."Index Name"') AS t(v);
  SELECT string_agg(DISTINCT v #>> '{}', ',') INTO cond FROM jsonb_path_query(j, '$.**."Index Cond"') AS t(v);
  RETURN node || COALESCE(' via ' || idx, '') || COALESCE(' cond ' || cond, '');
END; $$;

-- Parallel workers change the shape of a plan; switch them off so the exercises
-- are about indexes rather than about how many cores the machine has.
SET max_parallel_workers_per_gather = 0;

\echo '===== EX 1: Turn a Sequential Scan into an Index Scan ====='
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT indexname FROM pg_indexes
           WHERE tablename = 'events' AND indexname <> 'events_pkey' LOOP
    EXECUTE format('DROP INDEX IF EXISTS %I', r.indexname);
  END LOOP;
END; $$;
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE user_id = 42') AS before;
CREATE INDEX ix_events_user ON events(user_id);
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE user_id = 42') AS after;
SELECT count(*) AS matched FROM events WHERE user_id = 42;
SELECT count(*) AS total FROM events;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''buy''') AS broad;

\echo '===== EX 2: Enforce Uniqueness and Get an Index for Free ====='
DROP TABLE IF EXISTS accounts CASCADE;
CREATE TABLE accounts (id INT PRIMARY KEY, email TEXT);
ALTER TABLE accounts ADD CONSTRAINT uq_accounts_email UNIQUE (email);
INSERT INTO accounts SELECT g, 'user' || g || '@x.io' FROM generate_series(1, 5000) g;
ANALYZE accounts;
DO $$ BEGIN INSERT INTO accounts VALUES (99999, 'user1@x.io'); RAISE NOTICE 'duplicate unexpectedly accepted'; EXCEPTION WHEN unique_violation THEN RAISE NOTICE 'duplicate rejected SQLSTATE %', SQLSTATE; END; $$;
SELECT indexname AS backing FROM pg_indexes WHERE tablename = 'accounts' AND indexname = 'uq_accounts_email';
ANALYZE accounts;
SELECT plan_uses('SELECT * FROM accounts WHERE email = ''user1@x.io''') AS lookup;
INSERT INTO accounts VALUES (100001, NULL), (100002, NULL);
SELECT count(*) AS rows_with_two_nulls FROM accounts;
CREATE UNIQUE INDEX uq_accounts_active ON accounts(id) WHERE email IS NOT NULL;
SELECT indexname AS partial FROM pg_indexes WHERE tablename = 'accounts' AND indexname = 'uq_accounts_active';

\echo '===== EX 3: Order the Columns of a Composite Index Deliberately ====='
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT indexname FROM pg_indexes
           WHERE tablename = 'events' AND indexname <> 'events_pkey' LOOP
    EXECUTE format('DROP INDEX IF EXISTS %I', r.indexname);
  END LOOP;
END; $$;
CREATE INDEX ix_events_kind_user ON events(kind, user_id);
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''buy'' AND user_id = 7') AS both;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''buy''') AS leading;
SELECT plan_uses('SELECT * FROM events WHERE user_id = 7') AS trailing;
DROP INDEX ix_events_kind_user;
CREATE INDEX ix_events_user_kind ON events(user_id, kind);
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE user_id = 7') AS trailing2;
SELECT count(*) AS rows_kind FROM events WHERE kind = 'buy';
SELECT count(*) AS rows_user FROM events WHERE user_id = 7;

\echo '===== EX 4: Answer a Query From the Index Alone with INCLUDE ====='
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT indexname FROM pg_indexes
           WHERE tablename = 'events' AND indexname <> 'events_pkey' LOOP
    EXECUTE format('DROP INDEX IF EXISTS %I', r.indexname);
  END LOOP;
END; $$;
CREATE INDEX ix_events_user ON events(user_id);
ANALYZE events;
SELECT plan_uses('SELECT user_id, kind FROM events WHERE user_id = 42') AS needs_heap;
SELECT pg_size_pretty(pg_relation_size('ix_events_user')) AS plain_size;
DROP INDEX ix_events_user;
CREATE INDEX ix_events_user_inc ON events(user_id) INCLUDE (kind);
ANALYZE events;
SELECT plan_uses('SELECT user_id, kind FROM events WHERE user_id = 42') AS covering;
SELECT plan_uses('SELECT user_id, kind, created_at FROM events WHERE user_id = 42') AS extra_column;
VACUUM events;
SELECT plan_uses('SELECT user_id, kind FROM events WHERE user_id = 42') AS after_vacuum;
SELECT pg_size_pretty(pg_relation_size('ix_events_user_inc')) AS incl_size;

\echo '===== EX 5: Index Only the Rows You Query with a Partial Index ====='
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT indexname FROM pg_indexes
           WHERE tablename = 'events' AND indexname <> 'events_pkey' LOOP
    EXECUTE format('DROP INDEX IF EXISTS %I', r.indexname);
  END LOOP;
END; $$;
CREATE INDEX ix_events_created ON events(created_at);
ANALYZE events;
SELECT pg_size_pretty(pg_relation_size('ix_events_created')) AS full_size;
CREATE INDEX ix_events_err ON events(created_at) WHERE kind = 'error';
ANALYZE events;
SELECT pg_size_pretty(pg_relation_size('ix_events_err')) AS partial_size;
DROP INDEX ix_events_created;
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''error'' AND created_at > DATE ''2026-06-01''') AS matching;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''buy'' AND created_at > DATE ''2026-06-01''') AS non_matching;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''error'' AND created_at > DATE ''2026-06-15''') AS implied;
SELECT count(*) AS rows_error FROM events WHERE kind = 'error';
SELECT count(*) AS rows_total FROM events;

\echo '===== EX 6: Index a Computed Value with an Expression Index ====='
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT indexname FROM pg_indexes
           WHERE tablename = 'events' AND indexname <> 'events_pkey' LOOP
    EXECUTE format('DROP INDEX IF EXISTS %I', r.indexname);
  END LOOP;
END; $$;
CREATE INDEX ix_events_email ON events(email);
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE lower(email) = ''user42@example.io''') AS plain_on_column;
SELECT plan_uses('SELECT * FROM events WHERE email = ''User42@Example.IO''') AS exact_match;
DROP INDEX ix_events_email;
CREATE INDEX ix_events_lower_email ON events(lower(email));
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE lower(email) = ''user42@example.io''') AS expr_index;
SELECT plan_uses('SELECT * FROM events WHERE upper(email) = ''USER42@EXAMPLE.IO''') AS mismatch;
SELECT count(*) AS found FROM events WHERE lower(email) = 'user42@example.io';

\echo '===== EX 7: Search Inside JSONB with a GIN Index ====='
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT indexname FROM pg_indexes
           WHERE tablename = 'events' AND indexname <> 'events_pkey' LOOP
    EXECUTE format('DROP INDEX IF EXISTS %I', r.indexname);
  END LOOP;
END; $$;
CREATE INDEX ix_events_payload_btree ON events(payload);
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE payload @> ''{"score": 5}''') AS btree;
DROP INDEX ix_events_payload_btree;
CREATE INDEX ix_events_payload ON events USING GIN (payload);
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE payload @> ''{"score": 5}''') AS gin;
SELECT plan_uses('SELECT * FROM events WHERE payload @> ''{"tags": ["b"]}''') AS array_containment;
SELECT plan_uses('SELECT * FROM events WHERE payload ? ''score''') AS key_exists;
SELECT plan_uses('SELECT * FROM events WHERE payload->>''score'' = ''5''') AS equality;
SELECT pg_size_pretty(pg_relation_size('ix_events_payload')) AS gin_size;
SELECT count(*) AS rows_found FROM events WHERE payload @> '{"score": 5}';

\echo '===== EX 8: Find the Indexes That Only Cost You ====='
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT indexname FROM pg_indexes
           WHERE tablename = 'events' AND indexname <> 'events_pkey' LOOP
    EXECUTE format('DROP INDEX IF EXISTS %I', r.indexname);
  END LOOP;
END; $$;
CREATE INDEX ix_a ON events(user_id);
CREATE INDEX ix_b ON events(user_id, kind);
CREATE INDEX ix_c ON events(email);
ANALYZE events;
SELECT pg_stat_reset();
SELECT count(*) FROM events WHERE user_id = 42;
SELECT count(*) FROM events WHERE user_id = 42 AND kind = 'buy';
SELECT pg_stat_force_next_flush();
SELECT indexrelname || '=' || idx_scan AS usage FROM pg_stat_user_indexes WHERE relname = 'events' AND indexrelname IN ('ix_a','ix_b','ix_c') ORDER BY indexrelname;
SELECT string_agg(indexrelname, ',' ORDER BY indexrelname) AS never_used FROM pg_stat_user_indexes WHERE relname = 'events' AND idx_scan = 0 AND indexrelname <> 'events_pkey';
SELECT a.indexrelid::regclass::text AS redundant FROM pg_index a JOIN pg_index b ON a.indrelid = b.indrelid AND a.indexrelid <> b.indexrelid AND array_to_string(b.indkey, ' ') LIKE array_to_string(a.indkey, ' ') || ' %' WHERE a.indrelid = 'events'::regclass;
DROP INDEX ix_c;
DROP INDEX ix_a;
SELECT string_agg(indexname, ',' ORDER BY indexname) AS remaining FROM pg_indexes WHERE tablename = 'events';

\echo '===== EX 9: Split a Large Table by Range and Watch Pruning Work ====='
DROP TABLE IF EXISTS logs CASCADE;
CREATE TABLE logs (id INT, at DATE NOT NULL, msg TEXT) PARTITION BY RANGE (at);
CREATE TABLE logs_2026_01 PARTITION OF logs FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE logs_2026_02 PARTITION OF logs FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE logs_2026_03 PARTITION OF logs FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
INSERT INTO logs SELECT g, DATE '2026-01-01' + ((g % 3) * 31) + (g % 20), 'msg' || g FROM generate_series(1, 300) g;
ANALYZE logs;
SELECT string_agg(c.relname || '=' || cnt, ', ' ORDER BY c.relname) AS counts FROM pg_class c JOIN LATERAL (SELECT count(*) AS cnt FROM logs l WHERE tableoid = c.oid) s ON TRUE WHERE c.relname LIKE 'logs\_2026%';
CREATE OR REPLACE FUNCTION partitions_in_plan(q TEXT) RETURNS INT LANGUAGE plpgsql AS $$
DECLARE j JSONB; n INT;
BEGIN
  EXECUTE 'EXPLAIN (FORMAT JSON, COSTS OFF) ' || q INTO j;
  SELECT count(DISTINCT v #>> '{}') INTO n FROM jsonb_path_query(j, '$.**."Relation Name"') AS t(v) WHERE v #>> '{}' LIKE 'logs\_2026%';
  RETURN n;
END; $$;
SELECT partitions_in_plan('SELECT * FROM logs WHERE at >= DATE ''2026-02-01'' AND at < DATE ''2026-03-01''') AS pruned;
SELECT partitions_in_plan('SELECT * FROM logs WHERE msg = ''msg7''') AS no_key;
CREATE INDEX ix_logs_at ON logs(at);
SELECT count(*) AS child_indexes FROM pg_indexes WHERE tablename LIKE 'logs\_2026%';
ALTER TABLE logs DETACH PARTITION logs_2026_01;
DROP TABLE logs_2026_01;
SELECT count(*) AS after_drop_rows FROM logs;
SELECT string_agg(c.relname, ',' ORDER BY c.relname) AS after_drop_partitions FROM pg_class c WHERE c.relname LIKE 'logs\_2026%' AND c.relkind = 'r';

\echo '===== EX 10: Capstone: Design the Index Set for a Whole Workload ====='
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT indexname FROM pg_indexes
           WHERE tablename = 'events' AND indexname <> 'events_pkey' LOOP
    EXECUTE format('DROP INDEX IF EXISTS %I', r.indexname);
  END LOOP;
END; $$;
CREATE INDEX ix_events_user_created ON events(user_id, created_at DESC);
CREATE INDEX ix_events_user_kind ON events(user_id, kind);
CREATE INDEX ix_events_err_created ON events(created_at) WHERE kind = 'error';
CREATE INDEX ix_events_lower_email ON events(lower(email));
DROP INDEX ix_events_user_kind;
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE user_id = 42 ORDER BY created_at DESC LIMIT 20') AS q1;
SELECT plan_uses('SELECT * FROM events WHERE user_id = 42 AND kind = ''buy''') AS q2;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''error'' AND created_at >= DATE ''2026-06-01''') AS q3;
SELECT plan_uses('SELECT * FROM events WHERE lower(email) = ''user42@example.io''') AS q4;
SELECT count(*) AS index_count FROM pg_indexes WHERE tablename = 'events' AND indexname <> 'events_pkey';
SELECT count(*) AS redundant FROM pg_index a JOIN pg_index b ON a.indrelid = b.indrelid AND a.indexrelid <> b.indexrelid AND array_to_string(b.indkey, ' ') LIKE array_to_string(a.indkey, ' ') || ' %' WHERE a.indrelid = 'events'::regclass;
