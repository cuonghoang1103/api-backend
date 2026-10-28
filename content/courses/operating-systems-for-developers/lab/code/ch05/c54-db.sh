# @ chạy trong container postgres:17 (os-pg5), người dùng postgres — xem lab/README
@ psql -qX -f schema.sql 2>/dev/null
psql -qX -f schema.sql
psql -qX -v who=alice -f book-naive.sql & sleep 0.1; psql -qX -v who=bob -f book-naive.sql & wait
psql -X -c "SELECT * FROM seats"
psql -qX -f schema.sql
psql -qX -v who=alice -f book-lock.sql & sleep 0.1; psql -qX -v who=bob -f book-lock.sql & sleep 0.2; psql -X -c "SELECT pid, state, wait_event_type, wait_event, left(query, 40) AS query FROM pg_stat_activity WHERE wait_event_type = 'Lock'"; wait
psql -X -c "SELECT * FROM seats"
psql -qX -f schema.sql
psql -qX -v who=alice -f book-cond.sql & sleep 0.1; psql -qX -v who=bob -f book-cond.sql & wait
psql -X -c "SELECT * FROM seats"
psql -qX -f schema.sql
psql -qX -v who=request -f pay.sql & sleep 0.1; psql -qX -v who=retry -f pay.sql & wait
psql -X -c "SELECT balance FROM wallets" -c "SELECT * FROM payments"
psql -qX -f schema.sql
psql -qX -v who=request -v key=pay-7f3a -f pay-idem.sql & sleep 0.1; psql -qX -v who=retry -v key=pay-7f3a -f pay-idem.sql & wait
psql -X -c "SELECT balance FROM wallets" -c "SELECT * FROM payments" -c "SELECT * FROM idempotency_keys"
