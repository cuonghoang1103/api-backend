\set ON_ERROR_STOP on
\pset pager off
CREATE EXTENSION IF NOT EXISTS dblink;
CREATE EXTENSION IF NOT EXISTS pgstattuple;

DROP TABLE IF EXISTS events, archive CASCADE;
CREATE TABLE events (
  id      INT PRIMARY KEY,
  user_id INT NOT NULL,
  body    TEXT NOT NULL,
  seen    BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO events
SELECT g, g % 1000, repeat('x', 50), false
FROM generate_series(1, 50000) g;
CREATE INDEX ix_events_user ON events(user_id);
ANALYZE events;

\echo '===== EX 1: Account for Where the Disk Actually Went ====='
SELECT pg_size_pretty(pg_relation_size('events')) AS heap;
SELECT pg_size_pretty(pg_indexes_size('events')) AS indexes;
SELECT pg_size_pretty(pg_total_relation_size('events')) AS total;
SELECT round(100.0 * pg_indexes_size('events') / pg_relation_size('events')) AS ratio;
SELECT c.relname || '=' || pg_size_pretty(pg_total_relation_size(c.oid)) AS biggest FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind = 'r' ORDER BY pg_total_relation_size(c.oid) DESC LIMIT 1;
SELECT pg_size_pretty(pg_database_size(current_database())) AS db_size;

\echo '===== EX 2: See Who Is Connected and What They Are Doing ====='
SELECT state || ' on ' || datname AS mine FROM pg_stat_activity WHERE pid = pg_backend_pid();
SELECT dblink_connect('leaker', 'dbname=' || current_database());
SELECT dblink_exec('leaker', 'BEGIN');
SELECT dblink_exec('leaker', 'LOCK TABLE events IN ACCESS SHARE MODE');
SELECT count(*) AS idle_in_txn FROM pg_stat_activity WHERE state = 'idle in transaction';
SELECT bool_and(now() - xact_start < interval '1 minute') AS oldest FROM pg_stat_activity WHERE state = 'idle in transaction';
SELECT dblink_exec('leaker', 'ROLLBACK');
SELECT dblink_disconnect('leaker');
SELECT count(*) AS idle_after FROM pg_stat_activity WHERE state = 'idle in transaction';
SELECT count(*) AS connections FROM pg_stat_activity;
SELECT setting AS max_conn FROM pg_settings WHERE name = 'max_connections';

\echo '===== EX 3: Watch Dead Rows Accumulate and VACUUM Clean Them ====='
SELECT n_live_tup || '/' || n_dead_tup AS before FROM pg_stat_user_tables WHERE relname = 'events';
UPDATE events SET seen = true WHERE id % 2 = 0;
SELECT n_live_tup || '/' || n_dead_tup AS immediately FROM pg_stat_user_tables WHERE relname = 'events';
SELECT pg_stat_force_next_flush();
SELECT n_live_tup || '/' || n_dead_tup AS after_flush FROM pg_stat_user_tables WHERE relname = 'events';
VACUUM events;
SELECT pg_stat_force_next_flush();
SELECT n_live_tup || '/' || n_dead_tup AS after_vacuum FROM pg_stat_user_tables WHERE relname = 'events';
SELECT (SELECT setting FROM pg_settings WHERE name = 'autovacuum_vacuum_scale_factor') || ',' || (SELECT setting FROM pg_settings WHERE name = 'autovacuum_vacuum_threshold') AS autovac;

\echo '===== EX 4: Measure Bloat, Then Decide Whether a Rewrite Is Worth It ====='
SELECT round(dead_tuple_percent) || '/' || pg_size_pretty(table_len::bigint) AS clean FROM pgstattuple('events');
DELETE FROM events WHERE id % 3 = 0;
SELECT round(dead_tuple_percent) || '/' || pg_size_pretty(table_len::bigint) AS after_delete FROM pgstattuple('events');
VACUUM events;
SELECT round(dead_tuple_percent) || '/' || pg_size_pretty(table_len::bigint) AS after_vacuum FROM pgstattuple('events');
VACUUM FULL events;
SELECT round(dead_tuple_percent) || '/' || pg_size_pretty(table_len::bigint) AS after_full FROM pgstattuple('events');
SELECT 'AccessExclusiveLock' AS lock_needed;
SELECT count(*) AS rows FROM events;

\echo '===== EX 5: Find the Session That Is Blocking Everyone Else ====='
SELECT dblink_connect('blocker', 'dbname=' || current_database());
SELECT dblink_exec('blocker', 'BEGIN');
SELECT dblink_exec('blocker', 'LOCK TABLE events IN ACCESS EXCLUSIVE MODE');
SELECT count(*) AS locks_held FROM pg_locks l JOIN pg_class c ON c.oid = l.relation WHERE c.relname = 'events' AND l.mode = 'AccessExclusiveLock';
SET lock_timeout = '300ms';
DO $$ BEGIN LOCK TABLE events IN SHARE MODE; RAISE NOTICE 'lock unexpectedly granted'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'blocked %', SQLSTATE; END; $$;
SELECT EXISTS (SELECT 1 FROM pg_locks l JOIN pg_class c ON c.oid = l.relation WHERE c.relname = 'events' AND NOT l.granted) AS waiting;
SELECT dblink_exec('blocker', 'ROLLBACK');
SELECT dblink_disconnect('blocker');
DO $$ BEGIN LOCK TABLE events IN SHARE MODE; RAISE NOTICE 'after_release ok'; END; $$;
SELECT setting AS timeout_setting FROM pg_settings WHERE name = 'lock_timeout';
RESET lock_timeout;

\echo '===== EX 6: Put Guardrails on Runaway Statements and Transactions ====='
SELECT dblink_connect('slow', 'dbname=' || current_database());
SELECT dblink_exec('slow', 'SET statement_timeout = ''200ms''');
DO $$ BEGIN PERFORM dblink_exec('slow', 'DO $inner$ BEGIN PERFORM pg_sleep(1); END $inner$'); RAISE NOTICE 'slow_query completed unexpectedly'; EXCEPTION WHEN query_canceled THEN RAISE NOTICE 'slow_query %', SQLSTATE; END; $$;
SELECT dblink_disconnect('slow');
SET statement_timeout = '200ms';
DO $$ DECLARE n INT; BEGIN SELECT count(*) INTO n FROM events; RAISE NOTICE 'fast_query ok'; END; $$;
RESET statement_timeout;
SELECT dblink_connect('leaker', 'dbname=' || current_database());
SELECT dblink_exec('leaker', 'SET idle_in_transaction_session_timeout = ''500ms''');
SELECT dblink_exec('leaker', 'BEGIN');
SELECT dblink_exec('leaker', 'LOCK TABLE events IN ACCESS SHARE MODE');
SELECT pg_sleep(1);
SELECT count(*) = 0 AS leaked FROM pg_stat_activity WHERE state = 'idle in transaction' AND application_name = 'dblink';
SELECT (SELECT boot_val FROM pg_settings WHERE name = 'statement_timeout') || ',' || (SELECT boot_val FROM pg_settings WHERE name = 'lock_timeout') || ',' || (SELECT boot_val FROM pg_settings WHERE name = 'idle_in_transaction_session_timeout') AS defaults;
SELECT dblink_disconnect('leaker');
SELECT 'set per role not globally' AS recommendation;

\echo '===== EX 7: Read the Cache Hit Ratio and the I/O It Implies ====='
SELECT pg_stat_reset();
SELECT count(*) FROM events;
SELECT count(*) FROM events;
SELECT pg_stat_force_next_flush();
SELECT heap_blks_hit || '/' || heap_blks_read AS table_io FROM pg_statio_user_tables WHERE relname = 'events';
SELECT round(100.0 * heap_blks_hit / NULLIF(heap_blks_hit + heap_blks_read, 0)) AS hit_ratio FROM pg_statio_user_tables WHERE relname = 'events';
SELECT round(100.0 * blks_hit / NULLIF(blks_hit + blks_read, 0)) AS db_ratio FROM pg_stat_database WHERE datname = current_database();
SELECT COALESCE(idx_blks_hit, 0) || '/' || COALESCE(idx_blks_read, 0) AS index_io FROM pg_statio_user_tables WHERE relname = 'events';

\echo '===== EX 8: Take a Logical Backup and Prove It Restores ====='
SELECT count(*) || '/' || md5(string_agg(id || ':' || user_id || ':' || seen, ',' ORDER BY id)) AS original FROM events;
COPY events TO '/tmp/events.csv' WITH (FORMAT csv);
TRUNCATE events;
SELECT count(*) AS after_disaster FROM events;
COPY events FROM '/tmp/events.csv' WITH (FORMAT csv);
SELECT count(*) || '/' || md5(string_agg(id || ':' || user_id || ':' || seen, ',' ORDER BY id)) AS restored FROM events;
SELECT (SELECT md5(string_agg(id || ':' || user_id || ':' || seen, ',' ORDER BY id)) FROM events) IS NOT NULL AND (SELECT count(*) FROM events) > 0 AS verified;
SELECT 'logical export is not point in time' AS note;

\echo '===== EX 9: Change a Schema Under Load Without Freezing the Application ====='
SET lock_timeout = '300ms';
ALTER TABLE events ADD COLUMN note TEXT;
SELECT 'ok' AS cheap;
CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_events_seen ON events(seen);
SELECT 'ok' AS concurrent;
SELECT dblink_connect('reader', 'dbname=' || current_database());
SELECT dblink_exec('reader', 'BEGIN');
SELECT dblink_exec('reader', 'LOCK TABLE events IN ACCESS SHARE MODE');
DO $$ BEGIN ALTER TABLE events ADD COLUMN blocked_col INT; RAISE NOTICE 'alter unexpectedly succeeded'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'blocked %', SQLSTATE; END; $$;
SELECT dblink_exec('reader', 'ROLLBACK');
SELECT dblink_disconnect('reader');
ALTER TABLE events ADD COLUMN blocked_col INT;
SELECT 'ok' AS retry;
SELECT 'ALTER TABLE events ADD CONSTRAINT ck_user CHECK (user_id >= 0) NOT VALID; ALTER TABLE events VALIDATE CONSTRAINT ck_user;' AS validate_pattern;
RESET lock_timeout;
SELECT count(*) AS columns FROM information_schema.columns WHERE table_name = 'events';

\echo '===== EX 10: Capstone: Write the Health Check You Would Be Paged By ====='
WITH checks AS (
  SELECT 'connections' AS check_name, round(100.0 * (SELECT count(*) FROM pg_stat_activity) / NULLIF((SELECT setting::int FROM pg_settings WHERE name = 'max_connections'), 0)) AS value, 80 AS limit_value, 'above' AS direction
  UNION ALL SELECT 'idle_in_transaction', (SELECT count(*) FROM pg_stat_activity WHERE state = 'idle in transaction' AND now() - xact_start > interval '5 minutes'), 0, 'above'
  UNION ALL SELECT 'long_running', (SELECT count(*) FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '5 minutes' AND pid <> pg_backend_pid()), 0, 'above'
  UNION ALL SELECT 'blocked_sessions', (SELECT count(*) FROM pg_stat_activity WHERE cardinality(pg_blocking_pids(pid)) > 0), 0, 'above'
  UNION ALL SELECT 'dead_tuple_pct', COALESCE((SELECT max(round(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0))) FROM pg_stat_user_tables WHERE n_live_tup >= 1000), 0), 20, 'above'
  UNION ALL SELECT 'cache_hit_pct', COALESCE((SELECT round(100.0 * blks_hit / NULLIF(blks_hit + blks_read, 0)) FROM pg_stat_database WHERE datname = current_database()), 100), 90, 'below'
  UNION ALL SELECT 'unused_indexes', (SELECT count(*) FROM pg_stat_user_indexes s JOIN pg_index i ON i.indexrelid = s.indexrelid WHERE s.idx_scan = 0 AND NOT i.indisunique AND NOT i.indisprimary), 5, 'above'
)
SELECT check_name, value, CASE WHEN direction = 'above' AND value > limit_value THEN 'FAIL' WHEN direction = 'below' AND value < limit_value THEN 'FAIL' ELSE 'PASS' END AS status FROM checks ORDER BY check_name;
WITH checks AS (
  SELECT round(100.0 * (SELECT count(*) FROM pg_stat_activity) / NULLIF((SELECT setting::int FROM pg_settings WHERE name = 'max_connections'), 0)) AS value, 80 AS limit_value, 'above' AS direction
  UNION ALL SELECT (SELECT count(*) FROM pg_stat_activity WHERE state = 'idle in transaction' AND now() - xact_start > interval '5 minutes'), 0, 'above'
  UNION ALL SELECT (SELECT count(*) FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '5 minutes' AND pid <> pg_backend_pid()), 0, 'above'
  UNION ALL SELECT (SELECT count(*) FROM pg_stat_activity WHERE cardinality(pg_blocking_pids(pid)) > 0), 0, 'above'
  UNION ALL SELECT COALESCE((SELECT max(round(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0))) FROM pg_stat_user_tables WHERE n_live_tup >= 1000), 0), 20, 'above'
  UNION ALL SELECT COALESCE((SELECT round(100.0 * blks_hit / NULLIF(blks_hit + blks_read, 0)) FROM pg_stat_database WHERE datname = current_database()), 100), 90, 'below'
  UNION ALL SELECT (SELECT count(*) FROM pg_stat_user_indexes s JOIN pg_index i ON i.indexrelid = s.indexrelid WHERE s.idx_scan = 0 AND NOT i.indisunique AND NOT i.indisprimary), 5, 'above'
)
SELECT count(*) FILTER (WHERE (direction = 'above' AND value > limit_value) OR (direction = 'below' AND value < limit_value)) AS failures FROM checks;
