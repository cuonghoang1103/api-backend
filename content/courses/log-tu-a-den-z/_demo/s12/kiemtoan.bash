# 12.3 — kiểm toán truy cập: log_statement ddl/mod, ai DROP bảng (tài khoản dùng chung), lỗ hổng của log_statement, pgAudit session/object,
# mật khẩu lọt vào log, dò mật khẩu kết nối (giống PG_MEM 2024). Chạy sau cham.bash.
!psql -qc "ALTER SYSTEM SET shared_preload_libraries = pg_stat_statements, auto_explain, pgaudit" -c "ALTER SYSTEM SET log_statement = 'ddl'" -c "ALTER SYSTEM SET log_connections = on" -c "ALTER SYSTEM SET log_min_duration_statement = -1" -c "ALTER SYSTEM SET auto_explain.log_min_duration = -1"
!mkdir -p ../log-12-1-12-2 && mv log/postgresql-* ../log-12-1-12-2/
!@host bash cong-cu/khoi-dong-lai.bash
# ── Thứ Hai: An làm việc bình thường từ laptop 10.20.0.15; một máy khác (10.20.0.23) dùng tài khoản app dùng chung trong .env
!PGPASSWORD=An-Lab-2026 PGAPPNAME='DBeaver 25.2.0 - Main <shop>' psql -h 10.20.0.15 -U an -d shop -qc "SELECT count(*) FROM coupons" -c "CREATE INDEX ON orders_old (created_at)" >/dev/null
!PGPASSWORD=App-Lab-2026 PGAPPNAME='DBeaver 25.2.0 - SQLEditor <shop>' psql -h 10.20.0.23 -U app -d shop -qc "SELECT * FROM coupons" -c "DROP TABLE coupons" -c "DELETE FROM orders_old WHERE id > 100" >/dev/null
psql -Atc 'SHOW log_statement'
grep -h 'statement: ' log/postgresql-*.log | cut -c1-170
grep -h '\[[0-9]*\] app@shop' log/postgresql-*.log | grep -E 'authorized|statement' | cut -c1-200
grep -c 'DELETE' log/postgresql-*.log
psql -qc "ALTER SYSTEM SET log_statement = 'mod'" -c "SELECT pg_reload_conf()"
!PGPASSWORD=App-Lab-2026 PGAPPNAME='DBeaver 25.2.0 - SQLEditor <shop>' psql -h 10.20.0.23 -U app -d shop -qc "DELETE FROM orders_old WHERE id > 90" -c "DO \$\$ BEGIN EXECUTE 'DELETE FROM ' || 'orders_old' || ' WHERE id > 50'; END \$\$" >/dev/null
grep -hE 'statement: (DELETE|DO)' log/postgresql-*.log | cut -c1-170
psql -d shop -Atc "SELECT count(*) FROM orders_old"
psql -d shop -qc 'CREATE EXTENSION IF NOT EXISTS pgaudit' -c "ALTER SYSTEM SET pgaudit.log = 'write, ddl, role'" -c "ALTER SYSTEM SET pgaudit.log_relation = on" -c "SELECT pg_reload_conf()"
!PGPASSWORD=App-Lab-2026 PGAPPNAME='DBeaver 25.2.0 - SQLEditor <shop>' psql -h 10.20.0.23 -U app -d shop -qc "DO \$\$ BEGIN EXECUTE 'DELETE FROM ' || 'orders_old' || ' WHERE id > 40'; END \$\$" >/dev/null
grep -h 'AUDIT:' log/postgresql-*.log | cut -c1-230
psql -d shop -qc 'CREATE ROLE auditor NOLOGIN' -c 'GRANT SELECT ON customers TO auditor' -c "ALTER SYSTEM SET pgaudit.role = 'auditor'" -c "SELECT pg_reload_conf()"
!PGPASSWORD=An-Lab-2026 PGAPPNAME='DBeaver 25.2.0 - Main <shop>' psql -h 10.20.0.15 -U an -d shop -qc "SELECT full_name, phone FROM customers WHERE email = 'binh@example.com'" -c "SELECT owner, balance FROM accounts" >/dev/null
grep -h 'AUDIT: OBJECT' log/postgresql-*.log | cut -c1-230
!: > /tmp/moc; sleep 0.5; L=$(ls -t log/*.log | head -1); wc -l < $L > /tmp/moc
psql -qc "ALTER ROLE intern PASSWORD 'Intern-Moi-2026!'"
psql -qc "ALTER ROLE intern PASSWORD 'Intern-Moi-2026!' VALID UNTL 'infinity'"
L=$(ls -t log/*.log | head -1); tail -n +$(( $(cat /tmp/moc) + 1 )) $L | grep -iE 'password|STATEMENT' | cut -c1-200
grep -h 'Intern-Moi' log/postgresql-*.json | jq -r '.message // empty, .statement // empty' | sort -u
