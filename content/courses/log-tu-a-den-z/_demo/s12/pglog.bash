# 12.1 — log PostgreSQL: nằm đâu, bật collector + jsonlog, prefix, đọc FATAL/ERROR/chờ khoá/deadlock/quá tải kết nối.
# Chạy: python3 cong-cu/chay-ct.py pglog.bash (sau cong-cu/dung-pg.bash). Mặc định chạy trong lgz-pg12 (người dùng postgres, thư mục /var/lib/postgresql/data).
@host docker logs lgz-pg12 2>&1 | tail -4
psql -c 'SHOW logging_collector' -c 'SHOW log_destination' -c 'SHOW log_line_prefix' -c 'SHOW log_connections' -At
psql -Atc "SELECT name, setting FROM pg_settings WHERE name IN ('log_directory','log_filename','log_rotation_age','log_rotation_size','log_min_messages','log_min_error_statement','log_lock_waits','log_timezone') ORDER BY name"
psql -q -c "ALTER SYSTEM SET logging_collector = on" \
  -c "ALTER SYSTEM SET log_destination = 'stderr,jsonlog'" \
  -c "ALTER SYSTEM SET log_line_prefix = '%m [%p] %q%u@%d app=%a client=%h '" \
  -c "ALTER SYSTEM SET log_connections = on" \
  -c "ALTER SYSTEM SET log_disconnections = on" \
  -c "ALTER SYSTEM SET log_lock_waits = on" \
  -c "ALTER SYSTEM SET deadlock_timeout = '1s'" \
  -c "ALTER SYSTEM SET max_connections = 12"
cat postgresql.auto.conf
psql -Atc "SELECT name, setting, pending_restart FROM pg_settings WHERE pending_restart OR name = 'log_line_prefix'"
!@host bash cong-cu/khoi-dong-lai.bash
@host docker logs lgz-pg12 2>&1 | tail -2
ls -l log/
psql -Atc "SELECT pg_current_logfile(), pg_current_logfile('jsonlog')"
!sleep 1; : > /tmp/m; psql -Atc "SELECT pg_size_pretty(pg_relation_size('pg_class'))" >/dev/null
PGPASSWORD=sai-roi psql -h 10.20.0.50 -U app -d shop -c 'SELECT 1'
PGPASSWORD=App-Lab-2026 psql -h 10.20.0.50 -U app -d shopp -c 'SELECT 1'
PGPASSWORD=App-Lab-2026 PGAPPNAME=shop-api psql -h 10.20.0.50 -U app -d shop -c "SELECT ownr FROM accounts"
PGPASSWORD=App-Lab-2026 PGAPPNAME=shop-api psql -h 10.20.0.50 -U app -d shop -c "INSERT INTO customers (email, phone, full_name) VALUES ('an@example.com', '0999999999', 'An giả')"
tail -n 22 log/$(ls -t log | grep '\.log$' | head -1)
!export PGPASSWORD=App-Lab-2026 PGAPPNAME=shop-api; (psql -h 10.20.0.50 -U app -d shop -qc "BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1; SELECT pg_sleep(3); COMMIT;" &) ; sleep 0.5; PGAPPNAME=report-job psql -h 10.20.0.50 -U app -d shop -qc "UPDATE accounts SET balance = balance + 0 WHERE id = 1"; sleep 1
grep -E 'still waiting|acquired|Process holding|Wait queue' log/postgresql-*.log | cut -c1-200
!export PGPASSWORD=App-Lab-2026; (PGAPPNAME=chuyen-tien-A psql -h 10.20.0.50 -U app -d shop -qc "BEGIN; UPDATE accounts SET balance = balance - 10 WHERE id = 1; SELECT pg_sleep(1.5); UPDATE accounts SET balance = balance + 10 WHERE id = 2; COMMIT;" >/dev/null 2>&1 &); sleep 0.3; PGAPPNAME=chuyen-tien-B psql -h 10.20.0.50 -U app -d shop -qc "BEGIN; UPDATE accounts SET balance = balance - 5 WHERE id = 2; SELECT pg_sleep(1.5); UPDATE accounts SET balance = balance + 5 WHERE id = 1; COMMIT;" >/dev/null 2>&1; sleep 2
grep -A 7 'deadlock detected' log/postgresql-*.log | cut -c1-230
!export PGPASSWORD=App-Lab-2026; for i in $(seq 1 9); do (PGAPPNAME=worker-$i psql -h 10.20.0.50 -U app -d shop -qc "SELECT pg_sleep(4)" >/dev/null 2>&1 &); done; sleep 1.5
PGPASSWORD=App-Lab-2026 PGAPPNAME=shop-api psql -h 10.20.0.50 -U app -d shop -c 'SELECT 1'
psql -Atc "SELECT count(*), current_setting('max_connections'), current_setting('superuser_reserved_connections') FROM pg_stat_activity WHERE backend_type = 'client backend'"
!for i in 1 2 3; do (PGAPPNAME=dba-$i psql -qc "SELECT pg_sleep(3)" >/dev/null 2>&1 &); done; sleep 1
psql -c 'SELECT 1'
!sleep 4
grep -hE 'FATAL:  (sorry|remaining)' log/postgresql-*.log | cut -c1-160
grep -oE '(FATAL|ERROR|WARNING|LOG):  [a-z ]{3,40}' log/postgresql-*.log | sed -E 's/^[^:]*:([A-Z]+:  )/\1/' | sort | uniq -c | sort -rn | head -12
jq -c 'select(.error_severity == "FATAL") | {timestamp, user, dbname, remote_host, application_name, state_code, message}' log/postgresql-*.json
jq -r 'select(.error_severity == "ERROR") | [.state_code, .message, .statement] | @tsv' log/postgresql-*.json
jq -r 'select(.message | startswith("disconnection")) | .message' log/postgresql-*.json | tail -3
