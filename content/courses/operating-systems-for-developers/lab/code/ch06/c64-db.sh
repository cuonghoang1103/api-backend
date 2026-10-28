# @ chạy trong container postgres:17 (os-pg6), người dùng postgres — xem đầu s06-deadlock.mjs
@ psql -qX -f accounts.sql 2>/dev/null
psql -X -c "SHOW deadlock_timeout"
psql -X -v from=1 -v to=2 -f transfer.sql 2>&1 | sed -u 's/^/[T1] /' & sleep 0.1; psql -X -v from=2 -v to=1 -f transfer.sql 2>&1 | sed -u 's/^/[T2] /' & wait
psql -X -c "SELECT * FROM accounts ORDER BY id"
grep -h -A4 'detected deadlock' /tmp/pglog/*.log | cut -c 25-
psql -qX -c "ALTER SYSTEM SET deadlock_timeout = '10s'" -c "SELECT pg_reload_conf()"
psql -qX -f accounts.sql
psql -qX -v from=1 -v to=2 -f transfer.sql >/dev/null 2>&1 & sleep 0.1; psql -qX -v from=2 -v to=1 -f transfer.sql >/dev/null 2>&1 & sleep 1.5; psql -X -c "SELECT pid, pg_blocking_pids(pid) AS blocked_by, wait_event, left(query, 52) AS query FROM pg_stat_activity WHERE wait_event_type = 'Lock'"; wait
psql -qX -c "ALTER SYSTEM RESET deadlock_timeout" -c "SELECT pg_reload_conf()"
psql -qX -f accounts.sql
psql -X -v from=1 -v to=2 -f transfer-ordered.sql 2>&1 | sed -u 's/^/[T1] /' & sleep 0.1; psql -X -v from=2 -v to=1 -f transfer-ordered.sql 2>&1 | sed -u 's/^/[T2] /' & wait
psql -X -c "SELECT * FROM accounts ORDER BY id"
