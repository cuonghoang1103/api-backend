# 12.2 — truy vấn chậm: log_min_duration_statement, tham số trong log, auto_explain, pg_stat_statements, cái giá của ngưỡng 0, pgBadger.
# Chạy sau pglog.bash (cấu hình log của 12.1 vẫn giữ). Bảng orders 2 triệu dòng: du-lieu-orders.sql.
!psql -d shop -q -f /lab/du-lieu-orders.sql
!psql -qc "ALTER SYSTEM SET log_connections = off" -c "ALTER SYSTEM SET log_disconnections = off" -c "ALTER SYSTEM SET max_connections = 100" -c "SELECT pg_reload_conf()"
!@host bash cong-cu/khoi-dong-lai.bash
psql -d shop -Atc "SELECT count(*), pg_size_pretty(pg_total_relation_size('orders')) FROM orders"
psql -qc "ALTER SYSTEM SET log_min_duration_statement = '50ms'" -c "SELECT pg_reload_conf()"
export PGPASSWORD=App-Lab-2026 PGAPPNAME=shop-api; psql -h 10.20.0.50 -U app -d shop -c '\timing on' \
  -c "SELECT id, total FROM orders WHERE customer_email = 'khach4242@example.com' ORDER BY created_at DESC LIMIT 3" \
  -c "SELECT id, total FROM orders WHERE id = 4242"
tail -n 2 log/$(ls -t log | grep '\.log$' | head -1)
export PGPASSWORD=App-Lab-2026 PGAPPNAME=shop-api; echo "SELECT id, total FROM orders WHERE customer_email = \$1 ORDER BY created_at DESC LIMIT 3 \bind 'khach777@example.com' \g" | psql -h 10.20.0.50 -U app -d shop -q >/dev/null
tail -n 2 log/$(ls -t log | grep '\.log$' | head -1)
psql -qc "ALTER SYSTEM SET shared_preload_libraries = pg_stat_statements, auto_explain" \
  -c "ALTER SYSTEM SET auto_explain.log_min_duration = '50ms'" \
  -c "ALTER SYSTEM SET auto_explain.log_analyze = on" \
  -c "ALTER SYSTEM SET auto_explain.log_buffers = on" \
  -c "ALTER SYSTEM SET auto_explain.log_timing = off"
!@host bash cong-cu/khoi-dong-lai.bash
psql -d shop -qc 'CREATE EXTENSION IF NOT EXISTS pg_stat_statements' -c 'SELECT pg_stat_statements_reset()' >/dev/null; psql -Atc 'SHOW shared_preload_libraries'
export PGPASSWORD=App-Lab-2026 PGAPPNAME=shop-api; psql -h 10.20.0.50 -U app -d shop -qc "SELECT id, total FROM orders WHERE customer_email = 'khach4242@example.com' ORDER BY created_at DESC LIMIT 3" >/dev/null
tail -n 22 log/$(ls -t log | grep '\.log$' | head -1)
export PGPASSWORD=App-Lab-2026 PGAPPNAME=bao-cao-doanh-thu; pgbench -h 10.20.0.50 -U app -n -f /lab/nghin-vet-cat.sql -c 2 -j 2 -t 300 shop 2>&1 | grep -E 'transactions actually|latency average'
grep -c 'bao-cao-doanh-thu' log/$(ls -t log | grep '\.log$' | head -1)
psql -d shop -c "SELECT calls, round(total_exec_time) AS total_ms, round(mean_exec_time::numeric, 1) AS mean_ms, round(max_exec_time::numeric, 1) AS max_ms, left(regexp_replace(query, '\s+', ' ', 'g'), 70) AS query FROM pg_stat_statements WHERE dbid = (SELECT oid FROM pg_database WHERE datname = 'shop') ORDER BY total_exec_time DESC LIMIT 4"
!psql -qc "ALTER SYSTEM SET log_min_duration_statement = -1" -c "ALTER SYSTEM SET auto_explain.log_min_duration = -1" -c "SELECT pg_reload_conf()"; psql -qc 'DROP DATABASE IF EXISTS bench' -c 'CREATE DATABASE bench'; pgbench -q -i -s 10 bench >/dev/null 2>&1
L=$(ls -t log/*.log | head -1); a=$(stat -c %s $L); pgbench -n -S -c 4 -j 2 -T 10 bench 2>&1 | grep '^tps'; echo "log tăng: $(( ($(stat -c %s $L) - a) / 1024 )) KiB"
psql -qc "ALTER SYSTEM SET log_min_duration_statement = 0" -c "SELECT pg_reload_conf()"
L=$(ls -t log/*.log | head -1); J=$(ls -t log/*.json | head -1); a=$(stat -c %s $L); b=$(stat -c %s $J); pgbench -n -S -c 4 -j 2 -T 10 bench 2>&1 | grep '^tps'; echo "log tăng: $(( ($(stat -c %s $L) - a) / 1024 / 1024 )) MiB (.log) + $(( ($(stat -c %s $J) - b) / 1024 / 1024 )) MiB (.json)"
tail -n 2 log/$(ls -t log | grep '\.log$' | head -1)
psql -qc "ALTER SYSTEM SET log_min_duration_statement = '50ms'" -c "SELECT pg_reload_conf()"
!psql -qc 'DROP DATABASE bench'
pgbadger -q -j 2 -f jsonlog -d shop -u app -o /tmp/bao-cao.txt log/postgresql-*.json; grep -A 9 -m1 '^- Slowest queries' /tmp/bao-cao.txt | cut -c1-150
grep -A 8 -m1 '^- Queries that took up the most time' /tmp/bao-cao.txt | grep -vE '^\s+-> |^  Buffers|^ +(Workers|Buffers)' | cut -c1-150
pgbadger -q -j 2 -f jsonlog -d shop -u app -o /tmp/bao-cao.html log/postgresql-*.json; ls -lh /tmp/bao-cao.html | awk '{print $5, $9}'
