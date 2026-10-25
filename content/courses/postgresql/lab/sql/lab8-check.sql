-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop · Lab 8 — FINGERPRINT of a CT Shop database (reconciliation after a restore / on a replica)
-- Lab 8 — DẤU VÂN TAY của một CSDL CT Shop (đối soát sau khi khôi phục / trên bản sao)
-- cuongthai.com/courses/postgresql · PostgreSQL 17
--
-- One line per fact: tables (row count + md5 of EVERY row in primary-key order), sequences (last value),
-- privileges (who may do what on each table), roles (login + per-role settings).
-- Run it on BOTH servers and let diff compare — never compare by eye:
--   docker exec -i pglab8-primary psql -U postgres -d ctshop -At -f - < lab8-check.sql > check-primary.txt
--   docker exec -i pglab8-replica psql -U postgres -d ctshop -At -f - < lab8-check.sql > check-replica.txt
--   diff check-primary.txt check-replica.txt && echo "✓ identical"
-- ═══════════════════════════════════════════════════════════════════════════
SELECT 'table|category|'       || count(*) || '|' || md5(coalesce(string_agg(t::text, E'\n' ORDER BY t.id), ''))                      FROM shop.category t
UNION ALL SELECT 'table|product|'        || count(*) || '|' || md5(coalesce(string_agg(t::text, E'\n' ORDER BY t.id), ''))             FROM shop.product t
UNION ALL SELECT 'table|customer|'       || count(*) || '|' || md5(coalesce(string_agg(t::text, E'\n' ORDER BY t.id), ''))             FROM shop.customer t
UNION ALL SELECT 'table|orders|'         || count(*) || '|' || md5(coalesce(string_agg(t::text, E'\n' ORDER BY t.id), ''))             FROM shop.orders t
UNION ALL SELECT 'table|order_item|'     || count(*) || '|' || md5(coalesce(string_agg(t::text, E'\n' ORDER BY t.order_id, t.product_id), '')) FROM shop.order_item t
UNION ALL SELECT 'table|payment|'        || count(*) || '|' || md5(coalesce(string_agg(t::text, E'\n' ORDER BY t.id), ''))             FROM shop.payment t
UNION ALL SELECT 'table|stock_movement|' || count(*) || '|' || md5(coalesce(string_agg(t::text, E'\n' ORDER BY t.id), ''))             FROM shop.stock_movement t
UNION ALL SELECT 'table|review|'         || count(*) || '|' || md5(coalesce(string_agg(t::text, E'\n' ORDER BY t.id), ''))             FROM shop.review t;

-- sequences: a restore that forgets them hands out ids that already exist
SELECT 'seq|' || sequencename || '|' || coalesce(last_value::text, 'never used')
FROM pg_sequences WHERE schemaname = 'shop' ORDER BY sequencename;

-- privileges: rows can be complete while the GRANTs are missing
SELECT 'acl|' || c.relname || '|' || coalesce(array_to_string(c.relacl, ' '), 'owner only')
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'shop' AND c.relkind = 'r' ORDER BY c.relname;

-- roles of the cluster (not the built-in pg_* ones)
SELECT 'role|' || r.rolname || '|login=' || r.rolcanlogin || '|' || coalesce(array_to_string(s.setconfig, ' '), '-')
FROM pg_roles r LEFT JOIN pg_db_role_setting s ON s.setrole = r.oid AND s.setdatabase = 0
WHERE r.rolname !~ '^pg_' ORDER BY r.rolname;
