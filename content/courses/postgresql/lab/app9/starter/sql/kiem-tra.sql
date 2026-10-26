-- Lab 9 · C9 — the production checklist of lesson 16.3 as a script: 12 lines · measured value · ✓/✗
-- Run: docker exec -i pgdemo psql -U postgres -d ctlab9 < sql/kiem-tra.sql   (and once as ctshop_app — see README)
\pset pager off
-- kiem-tra.sql — checklist production chạy được (mỗi dòng: mục · giá trị đo · đạt?)
WITH s AS (SELECT name, setting FROM pg_settings),
fk AS (
  SELECT count(*) AS n FROM pg_constraint c WHERE contype = 'f' AND NOT EXISTS (
    SELECT 1 FROM pg_index i WHERE i.indrelid = c.conrelid
      AND (i.indkey::int2[])[0:cardinality(c.conkey)-1] @> c.conkey
      AND (i.indkey::int2[])[0:cardinality(c.conkey)-1] <@ c.conkey))
SELECT muc, gia_tri, dat FROM (VALUES
 ('1 kết nối đang dùng / max',
   (SELECT count(*) FROM pg_stat_activity WHERE backend_type = 'client backend') || ' / ' || (SELECT setting FROM s WHERE name = 'max_connections'),
   (SELECT count(*) FROM pg_stat_activity WHERE backend_type = 'client backend') < 0.8 * (SELECT setting::int FROM s WHERE name = 'max_connections')),
 ('2 giao dịch già nhất',
   coalesce((SELECT max(now() - xact_start)::text FROM pg_stat_activity WHERE xact_start IS NOT NULL AND pid <> pg_backend_pid()), 'không có'),
   coalesce((SELECT max(now() - xact_start) FROM pg_stat_activity WHERE xact_start IS NOT NULL AND pid <> pg_backend_pid()) < interval '5 min', true)),
 ('3 idle_in_transaction_session_timeout', (SELECT setting FROM s WHERE name = 'idle_in_transaction_session_timeout'),
   (SELECT setting::int FROM s WHERE name = 'idle_in_transaction_session_timeout') > 0),
 ('4 statement_timeout (máy chủ / role)', (SELECT setting FROM s WHERE name = 'statement_timeout') || ' / ' ||
   coalesce((SELECT string_agg(c, ',') FROM pg_db_role_setting, unnest(setconfig) c WHERE c LIKE 'statement_timeout%'), 'chưa đặt'),
   (SELECT setting::int FROM s WHERE name = 'statement_timeout') > 0 OR EXISTS (SELECT 1 FROM pg_db_role_setting, unnest(setconfig) c WHERE c LIKE 'statement_timeout%')),
 ('5 pg_stat_statements đã nạp', coalesce(nullif((SELECT setting FROM s WHERE name = 'shared_preload_libraries'), ''), '(trống)'),
   (SELECT setting FROM s WHERE name = 'shared_preload_libraries') LIKE '%pg_stat_statements%'),
 ('6 log_min_duration_statement (ms)', (SELECT setting FROM s WHERE name = 'log_min_duration_statement'),
   (SELECT setting::int FROM s WHERE name = 'log_min_duration_statement') >= 0),
 ('7 log_lock_waits', (SELECT setting FROM s WHERE name = 'log_lock_waits'), (SELECT setting FROM s WHERE name = 'log_lock_waits') = 'on'),
 ('8 khoá ngoại không có chỉ mục', (SELECT n::text FROM fk), (SELECT n FROM fk) = 0),
 ('9 bảng có > 20% dòng chết', (SELECT count(*)::text FROM pg_stat_user_tables WHERE n_dead_tup > 0.2 * greatest(n_live_tup, 1000)),
   (SELECT count(*) FROM pg_stat_user_tables WHERE n_dead_tup > 0.2 * greatest(n_live_tup, 1000)) = 0),
 ('10 replication slot bỏ rơi', (SELECT count(*)::text FROM pg_replication_slots WHERE NOT active), (SELECT count(*) FROM pg_replication_slots WHERE NOT active) = 0),
 ('11 age(datfrozenxid) lớn nhất', (SELECT max(age(datfrozenxid))::text FROM pg_database), (SELECT max(age(datfrozenxid)) FROM pg_database) < 200000000),
 ('12 chỉ mục INVALID (CONCURRENTLY hỏng)', (SELECT count(*)::text FROM pg_index WHERE NOT indisvalid), (SELECT count(*) FROM pg_index WHERE NOT indisvalid) = 0)
) AS t(muc, gia_tri, ok)
CROSS JOIN LATERAL (SELECT CASE WHEN ok THEN '✓' ELSE '✗' END AS dat) d
ORDER BY split_part(muc, ' ', 1)::int;
