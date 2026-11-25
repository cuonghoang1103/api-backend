# Lab 12 — tìm câu SQL làm API chậm bằng log ứng dụng + log PostgreSQL + auto_explain + pgBadger + pg_stat_statements, sửa bằng chỉ mục, đo lại.
# Chạy: cp lab12.bash vào thư mục làm việc có lab12/ (+ app/node_modules: npm i), rồi MAC=lab12db python3 <…>/cong-cu/chay-ct.py lab12.bash.
# Mặc định chạy trong lgz-lab12db (người dùng postgres, thư mục dữ liệu); "@host" = máy của bạn (thư mục làm việc).
!@host mkdir -p lab12/app/logs && : > lab12/app/logs/api.log; docker compose -f lab12/compose.yaml down -v >/dev/null 2>&1
!@host docker compose -f lab12/compose.yaml up -d >/dev/null 2>&1; for i in $(seq 180); do docker logs lgz-lab12db 2>&1 | grep -q 'init process complete' && docker exec -u postgres lgz-lab12db pg_isready -q 2>/dev/null && break; sleep 2; done; docker restart lgz-lab12api >/dev/null; sleep 2
@host docker compose -f lab12/compose.yaml ps --format 'table {{.Service}}\t{{.Image}}\t{{.Status}}'
@host docker exec lgz-lab12api node tai.mjs
@host grep -m 2 '"rid"' lab12/app/logs/api.log
@host jq -s -r 'map(select(.ms)) | group_by(.route)[] | (map(.ms) | sort) as $m | [.[0].route, length, $m[length / 2 | floor], $m[length * 0.95 | floor], $m[-1]] | @tsv' lab12/app/logs/api.log | (echo -e 'route\tn\tp50_ms\tp95_ms\tmax_ms'; cat) | column -t
@host jq -r 'select(.route == "/api/orders") | [.ms, .rid] | @tsv' lab12/app/logs/api.log | sort -rn | head -3
@host RID=$(jq -r 'select(.route == "/api/orders") | [.ms, .rid] | @tsv' lab12/app/logs/api.log | sort -rn | head -1 | cut -f2); docker exec -u postgres lgz-lab12db sh -c "grep -h -A 18 'rid=$RID' /var/lib/postgresql/data/log/*.log" | cut -c1-190
cat log/postgresql-*.log | grep -c 'duration: '
grep -oE 'duration: [0-9.]+ ms  (statement|execute <unnamed>): /\* rid=[0-9a-f]+,route=[^ ]+' log/postgresql-*.log | grep -oE 'route=[^ ]+' | sort | uniq -c
pgbadger -q -j 2 -f jsonlog -o /tmp/r.txt log/postgresql-*.json; grep -A 7 -m1 '^- Queries that took up the most time' /tmp/r.txt | grep -vE '^\s+(->|Buffers|Workers|Sort|Filter|Rows)' | cut -c1-170
psql -d shop -c "SELECT calls, round(total_exec_time) AS total_ms, round(mean_exec_time::numeric, 1) AS mean_ms, left(regexp_replace(query, '\s+', ' ', 'g'), 80) AS query FROM pg_stat_statements WHERE calls > 1 ORDER BY total_exec_time DESC LIMIT 3"
PGPASSWORD=App-Lab-2026 psql -h localhost -U app -d shop -c "EXPLAIN (ANALYZE, BUFFERS, COSTS OFF) SELECT id, total, status, created_at FROM orders WHERE customer_email = 'khach4242@example.com' ORDER BY created_at DESC LIMIT 20" | grep -vE '^\s*$'
PGPASSWORD=App-Lab-2026 PGAPPNAME=dba-an psql -h localhost -U app -d shop -c 'CREATE INDEX CONCURRENTLY orders_email_created_idx ON orders (customer_email, created_at DESC)'
grep -h 'app=dba-an' log/postgresql-*.log | cut -c1-200
PGPASSWORD=App-Lab-2026 psql -h localhost -U app -d shop -c "EXPLAIN (ANALYZE, BUFFERS, COSTS OFF) SELECT id, total, status, created_at FROM orders WHERE customer_email = 'khach4242@example.com' ORDER BY created_at DESC LIMIT 20" | grep -vE '^\s*$'
!@host cp lab12/app/logs/api.log lab12/app/logs/api-truoc.log && : > lab12/app/logs/api.log; docker exec -u postgres lgz-lab12db psql -d shop -qc 'SELECT pg_stat_statements_reset()' >/dev/null; docker exec -u postgres lgz-lab12db sh -c 'cd /var/lib/postgresql/data; cat log/postgresql-*.log | grep -c "duration: " > /tmp/truoc.txt'
@host docker exec lgz-lab12api node tai.mjs
@host jq -s -r 'map(select(.ms)) | group_by(.route)[] | (map(.ms) | sort) as $m | [.[0].route, length, $m[length / 2 | floor], $m[length * 0.95 | floor], $m[-1]] | @tsv' lab12/app/logs/api.log | (echo -e 'route\tn\tp50_ms\tp95_ms\tmax_ms'; cat) | column -t
echo "dòng duration trước: $(cat /tmp/truoc.txt), sau: $(cat log/postgresql-*.log | grep -c 'duration: ')"; grep -h 'duration: ' log/postgresql-*.log | tail -n 3 | cut -c1-170
psql -d shop -c "SELECT calls, round(total_exec_time) AS total_ms, round(mean_exec_time::numeric, 2) AS mean_ms, left(regexp_replace(query, '\s+', ' ', 'g'), 80) AS query FROM pg_stat_statements WHERE calls > 1 ORDER BY total_exec_time DESC LIMIT 3"
!@host docker compose -f lab12/compose.yaml down -v >/dev/null 2>&1
@host docker ps -a --filter name=lgz-lab12 --format '{{.Names}}' | wc -l
