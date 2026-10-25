/**
 * Lab 8 — CT Shop: sao lưu khôi phục được, tài khoản kế toán chỉ đọc, bản sao streaming + độ trễ (sau Chương 15). Agent lab8, 26/10/2026.
 * Chèn vào Chương 15 bằng lab/index.mjs (LAB_SAU[15]) — sau bài 15.4, trước quiz.
 * Kiến thức tới Ch15 (pg_dump/pg_restore/pg_dumpall, bẫy -t / role / phiên bản / pipefail — 15.1; WAL, LSN — 15.2;
 * pg_basebackup -R, standby, pg_stat_replication, slot, độ trễ, failover — 15.3) + Ch14 (kết nối, giám sát, pgbench).
 * Mới, giảng ngắn ngay trong lab: role nhóm NOLOGIN + IN ROLE, ALTER ROLE … SET, has_table_privilege, ALTER DEFAULT PRIVILEGES
 * (cả FOR ROLE), \drg \drds \ddp, pg_restore -f -, OVERRIDING SYSTEM VALUE, --checkpoint=fast, max_slot_wal_keep_size + safe_wal_size,
 * pg_last_wal_replay_lsn() cho "đọc lại cái vừa ghi", @prisma/extension-read-replicas.
 * Mọi output = chạy thật PostgreSQL 17.11 trên 2 container tạm pglab8-primary + pglab8-replica (đã xoá), dựng bằng chính lab8-docker.sh.
 * Q / LG / AI / O / SOL SINH TỰ ĐỘNG từ scratchpad lab8/steps8.mjs + output thật (run8.mjs → gen8.mjs) — không gõ tay.
 * LUẬT escaping như các tệp chương: không backtick trần, ${ trong mã → \${, < > trong mã → esc().
 */
import G from '../giang/pg-lab-8.mjs';

const F = 'https://media.cuongthai.com/files/academy/PG/labs/v1';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const code = (s, lang = 'sql') => `<pre><code class="language-${lang}">${esc(s).split('\n').map((l) => l.replace(lang === 'sql' ? /(--.*)$/ : /(\s#\s.*|^#.*|\/\/.*)$/, '<span class="tok-comment">$1</span>')).join('\n')}</code></pre>`;
const out = (s) => `<div class="out">${esc(s)}</div>`;
const card = (href, ico, title, sub, cta) => `<a class="link-card" href="${href}" target="_blank" rel="noopener">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>
  <span class="lc-cta">${cta}</span>
</a>`;
const details = (sum, body) => `<details><summary>${sum}</summary>\n${body}\n</details>`;

/* Lệnh từng bước (Q), ngôn ngữ (LG), chạy ở đâu (AI) — sinh từ steps8.mjs. */
/* Q:BEGIN */
const Q = {
  S0A: `bash lab8-docker.sh up`,
  S0B: `docker cp lab8-start.sql pglab8-primary:/tmp/
docker exec -it pglab8-primary psql -U postgres -d ctshop -f /tmp/lab8-start.sql | tail -n 5`,
  R1A: `CREATE ROLE report_ro NOLOGIN;                      -- a GROUP: holds privileges, nobody logs in as it
GRANT CONNECT ON DATABASE ctshop TO report_ro;
GRANT USAGE ON SCHEMA shop TO report_ro;               -- may look inside the schema …
GRANT SELECT ON ALL TABLES IN SCHEMA shop TO report_ro;   -- … and read the 8 tables that exist NOW`,
  R1B: `CREATE ROLE ketoan LOGIN PASSWORD 'ketoan-lab8' IN ROLE report_ro;   -- a PERSON: logs in, inherits report_ro
ALTER ROLE ketoan SET default_transaction_read_only = on;
ALTER ROLE ketoan SET statement_timeout = '5s';      -- 5 s for the lab; 30–60 s on a real server
ALTER ROLE ketoan SET search_path = shop;`,
  R1C: `\\drg ketoan
\\drds ketoan`,
  R1D: `SELECT c.relname AS "table",
       has_table_privilege('ketoan', c.oid, 'SELECT') AS sel,
       has_table_privilege('ketoan', c.oid, 'INSERT') AS ins,
       has_table_privilege('ketoan', c.oid, 'UPDATE') AS upd,
       has_table_privilege('ketoan', c.oid, 'DELETE') AS del,
       has_table_privilege('ketoan', c.oid, 'TRUNCATE') AS trunc
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'shop' AND c.relkind = 'r'
ORDER BY 1;   -- pass: 8 rows, sel = t, every other column f`,
  R1E: `SELECT current_user, current_setting('default_transaction_read_only') AS read_only,
       current_setting('statement_timeout') AS timeout, current_setting('search_path') AS path;`,
  R1F: `SELECT count(*) AS payments, sum(amount) AS revenue FROM payment;`,
  R1G: `INSERT INTO orders (customer_id) VALUES (1);`,
  R1H: `SET default_transaction_read_only = off;   -- any user may change it: it is a DEFAULT, not a wall
INSERT INTO orders (customer_id) VALUES (1);
CREATE TABLE public.my_notes (x int);
CREATE TABLE shop.my_notes (x int);`,
  R1I: `\\timing on
SELECT count(*) FROM order_item a, order_item b, category c;   -- 300 million rows: a runaway report`,
  R1J: `\\timing off
SET statement_timeout = 0;
SHOW statement_timeout;   -- the timeout is a default too`,
  R1K: `CREATE TABLE shop.coupon (code text PRIMARY KEY, percent int NOT NULL CHECK (percent BETWEEN 1 AND 50));
INSERT INTO shop.coupon VALUES ('BACKTOSCHOOL', 10), ('TET2027', 15);`,
  R1L: `SELECT * FROM coupon;`,
  R1M: `ALTER DEFAULT PRIVILEGES IN SCHEMA shop GRANT SELECT ON TABLES TO report_ro;   -- tables postgres creates FROM NOW ON
GRANT SELECT ON shop.coupon TO report_ro;                                    -- the one that already exists
CREATE TABLE shop.gift_card (code text PRIMARY KEY, balance numeric(12,2) NOT NULL);
\\ddp`,
  R1N: `SELECT count(*) AS coupons FROM coupon;
SELECT count(*) AS gift_cards FROM gift_card;`,
  R1O: `CREATE ROLE ctshop_app LOGIN PASSWORD 'app-lab8';   -- the app's own account (its migrations create tables)
GRANT USAGE, CREATE ON SCHEMA shop TO ctshop_app;
SET ROLE ctshop_app;
CREATE TABLE shop.flash_sale (product_id bigint PRIMARY KEY, price numeric(12,2) NOT NULL, ends_at timestamptz NOT NULL);
RESET ROLE;`,
  R1P: `SELECT * FROM flash_sale;`,
  R1Q: `ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_app IN SCHEMA shop GRANT SELECT ON TABLES TO report_ro;
GRANT SELECT ON shop.flash_sale TO report_ro;
\\ddp`,
  R1R: `SELECT count(*) AS flash_sales FROM flash_sale;`,
  R1S: `DROP TABLE shop.coupon, shop.gift_card, shop.flash_sale;   -- the lab keeps the 8 standard tables
SELECT count(*) AS tables FROM pg_tables WHERE schemaname = 'shop';`,
  B1A: `mkdir -p backups
docker exec pglab8-primary pg_dump -U postgres -d ctshop -Fc > backups/ctshop.dump
docker exec pglab8-primary pg_dumpall -U postgres --globals-only > backups/globals.sql
chmod 600 backups/globals.sql           # it holds the password hashes
wc -c backups/*`,
  B1B: `grep -E '^(CREATE|ALTER) ROLE|^GRANT' backups/globals.sql | sed -E "s/'SCRAM-SHA-256[^']*'/'SCRAM-SHA-256\\$4096:…'/"`,
  B1C: `docker exec -i pglab8-replica pg_restore -l < backups/ctshop.dump | grep -E ' (TABLE|TABLE DATA|ACL|CONSTRAINT|FK CONSTRAINT|SEQUENCE SET) ' | awk '{print $4, $5}' | sort | uniq -c`,
  B1D: `docker exec -i pglab8-replica pg_restore -U postgres -d ctshop < backups/ctshop.dump
echo "exit code: $?"`,
  B1E: `docker exec -i pglab8-primary psql -U postgres -d ctshop -At -f - < lab8-check.sql > check-primary.txt
docker exec -i pglab8-replica psql -U postgres -d ctshop -At -f - < lab8-check.sql > check-spare.txt
wc -l < check-primary.txt
diff check-primary.txt check-spare.txt
echo "diff exit code: $?"`,
  B1F: `docker exec pglab8-replica psql -U postgres -d postgres -c 'DROP DATABASE ctshop' -c 'CREATE DATABASE ctshop'
docker exec -i pglab8-replica psql -U postgres -d postgres -q < backups/globals.sql
docker exec -i pglab8-replica pg_restore -U postgres -d ctshop --exit-on-error < backups/ctshop.dump
echo "exit code: $?"`,
  B1G: `docker exec -i pglab8-replica psql -U postgres -d ctshop -At -f - < lab8-check.sql > check-spare.txt
diff check-primary.txt check-spare.txt && echo "✓ identical: $(wc -l < check-primary.txt | tr -d ' ') facts"
head -n 3 check-primary.txt; grep -E '^(seq|acl)\\|(orders|review)' check-primary.txt`,
  B2A: `-- 10:05 — a clean-up script for "discontinued notebooks" runs with the wrong filter: the whole category 9 (Sổ tay)
DELETE FROM review WHERE product_id IN (SELECT id FROM product WHERE category_id = 9);`,
  B2B: `-- 10:20 — customers keep writing reviews; they must NOT be lost by the repair
INSERT INTO review (product_id, customer_id, rating, body)
SELECT 1, c.id, 5, 'Mới: viết rất êm' FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM review r WHERE r.product_id = 1 AND r.customer_id = c.id)
ORDER BY c.id LIMIT 2
RETURNING id, product_id, customer_id, created_at;
SELECT count(*) AS reviews_now FROM review;`,
  B2C: `docker exec -i pglab8-primary pg_restore -U postgres -d ctshop --data-only -t review < backups/ctshop.dump
echo "exit code: $?"`,
  B2D: `docker exec -i pglab8-primary pg_restore --data-only -t review -f - < backups/ctshop.dump > review-data.sql
grep -c '' review-data.sql
grep '^COPY' review-data.sql`,
  B2E: `CREATE TABLE shop.review_restore (LIKE shop.review);   -- … into a staging table with the same columns`,
  B2F: `sed 's/^COPY shop\\.review /COPY shop.review_restore /' review-data.sql \\
  | docker exec -i pglab8-primary psql -U postgres -d ctshop -v ON_ERROR_STOP=1 | grep -E '^COPY|ERROR'`,
  B2G: `SELECT count(*) AS in_backup,
       count(*) FILTER (WHERE NOT EXISTS (SELECT 1 FROM review x WHERE x.id = r.id)) AS missing_now,
       count(*) FILTER (WHERE NOT EXISTS (SELECT 1 FROM review x WHERE x.id = r.id)
                          AND r.product_id IN (SELECT id FROM product WHERE category_id = 9)) AS missing_in_cat9
FROM review_restore r;`,
  B2H: `INSERT INTO review
SELECT r.* FROM review_restore r
WHERE NOT EXISTS (SELECT 1 FROM review x WHERE x.id = r.id)
  AND r.product_id IN (SELECT id FROM product WHERE category_id = 9);`,
  B2I: `INSERT INTO review OVERRIDING SYSTEM VALUE        -- keep the ORIGINAL ids (other tables / links may point to them)
SELECT r.* FROM review_restore r
WHERE NOT EXISTS (SELECT 1 FROM review x WHERE x.id = r.id)
  AND r.product_id IN (SELECT id FROM product WHERE category_id = 9);
SELECT count(*) AS reviews_now,
       count(*) FILTER (WHERE body = 'Mới: viết rất êm') AS new_ones_kept
FROM review;
DROP TABLE review_restore;`,
  B3A: `bash lab8-backup-naive.sh; sleep 1
bash lab8-backup-naive.sh; sleep 1
bash lab8-backup-naive.sh
wc -c backups/daily/*`,
  B3B: `docker stop pglab8-primary; sleep 1   # the database server is down tonight (crash, disk, maintenance…)
for night in 1 2 3; do bash lab8-backup-naive.sh; echo "exit code: $?"; sleep 1; done
wc -c backups/daily/*
gzip -dc "$(ls -1t backups/daily/*.sql.gz | head -n 1)" | wc -c`,
  B3C: `docker start pglab8-primary && sleep 3
rm -rf backups/daily
bash lab8-backup.sh; sleep 1
bash lab8-backup.sh; sleep 1
bash lab8-backup.sh
echo "exit code: $?"`,
  B3D: `docker stop pglab8-primary
bash lab8-backup.sh
echo "exit code: $?"
ls -1A backups/daily`,
  B3E: `docker start pglab8-primary && sleep 3
DB=ctshopp bash lab8-backup.sh          # a typo in the cron line
echo "exit code: $?"`,
  B3F: `GOOD="$(ls -1t backups/daily/*.sql.gz | head -n 1)"
gzip -dc "$GOOD" | tail -n 6
head -c 20000 "$GOOD" > broken.sql.gz       # a copy cut short (disk full, network copy interrupted…)
gzip -t broken.sql.gz; echo "gzip -t exit code: $?"`,
  N1A: `bash lab8-docker.sh replica`,
  N1B: `docker logs pglab8-replica 2>&1 | grep -E 'standby mode|consistent recovery|streaming WAL|read-only connections'`,
  N1C: `\\x on
SELECT pid, usename, application_name, client_addr, state, sync_state,
       sent_lsn, write_lsn, flush_lsn, replay_lsn, write_lag, flush_lag, replay_lag
FROM pg_stat_replication;
\\x off
SELECT slot_name, slot_type, active, wal_status, restart_lsn FROM pg_replication_slots;`,
  N1D: `INSERT INTO orders (customer_id, note) VALUES (7, 'first order with a replica') RETURNING id, created_at;`,
  N1E: `SELECT pg_is_in_recovery() AS is_replica;
SELECT id, customer_id, note FROM orders ORDER BY id DESC LIMIT 1;
INSERT INTO orders (customer_id) VALUES (7);`,
  N1F: `SELECT current_user, pg_is_in_recovery() AS on_replica;
SELECT count(*) AS payments, sum(amount) AS revenue FROM payment;`,
  N1G: `docker exec -i pglab8-primary psql -U postgres -d ctshop -At -f - < lab8-check.sql > check-primary.txt
docker exec -i pglab8-replica psql -U postgres -d ctshop -At -f - < lab8-check.sql > check-replica.txt
diff check-primary.txt check-replica.txt && echo "✓ replica = primary: $(wc -l < check-primary.txt | tr -d ' ') facts"`,
  N1H: `docker cp lab8-orders.pgbench pglab8-primary:/tmp/
docker exec pglab8-primary pgbench -U postgres -d ctshop -n -c 8 -j 4 -T 20 -P 5 -f /tmp/lab8-orders.pgbench > pgbench.log 2>&1 &
for i in 1 2 3 4 5 6 7 8 9; do
  sleep 2
  docker exec pglab8-primary psql -U postgres -Atc "SELECT to_char(now(), 'HH24:MI:SS') || ' | behind ' ||
    pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)) || ' | replay_lag ' || coalesce(replay_lag::text, '-')
    FROM pg_stat_replication"
done
wait
grep -E '^progress|^number of transactions actually|^tps' pgbench.log`,
  N1I: `docker exec pglab8-primary psql -U postgres -d ctshop -c "\\\\timing on" -c "INSERT INTO shop.orders (customer_id, status, created_at, note)
  SELECT 1 + g % 290, 'shipped', timestamptz '2024-01-01 08:00+07' + g * interval '1 minute', 'import from the old shop'
  FROM generate_series(1, 500000) g" > import.log 2>&1 &
for i in $(seq 1 10); do
  sleep 1
  docker exec pglab8-primary psql -U postgres -Atc "SELECT to_char(now(), 'HH24:MI:SS') || ' | behind ' ||
    pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)) || ' | replay_lag ' || coalesce(replay_lag::text, '-')
    FROM pg_stat_replication"
done
wait; cat import.log`,
  N1J: `sleep 20                                  # nobody writes for 20 seconds
docker exec pglab8-replica psql -U postgres -c "SELECT now() - pg_last_xact_replay_timestamp() AS since_last_replayed_commit,
       pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn() AS caught_up"
docker exec pglab8-primary psql -U postgres -c "SELECT pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS bytes_behind, replay_lag
FROM pg_stat_replication"`,
  N2A: `npm i pg >/dev/null 2>&1          # once
node lab8-ryw.mjs 500
docker exec pglab8-primary pgbench -U postgres -d ctshop -n -c 8 -j 4 -T 25 -f /tmp/lab8-orders.pgbench > pgbench.log 2>&1 &
sleep 2; node lab8-ryw.mjs 500; wait`,
  N2B: `DATABASE_URL='postgresql://postgres:ctshop-lab8@127.0.0.1:5481/ctshop?schema=shop' \\
REPLICA_URL='postgresql://postgres:ctshop-lab8@127.0.0.1:5482/ctshop?schema=shop' \\
node lab8-prisma-rr.mjs`,
  N2C: `docker stop pglab8-replica        # the replica dies (or its network link does) …`,
  N2D: `SELECT slot_name, active, wal_status,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS wal_kept_for_slot
FROM pg_replication_slots;
SELECT pg_size_pretty(sum(size)) AS pg_wal_size, count(*) AS wal_files FROM pg_ls_waldir();`,
  N2E: `for night in 1 2 3; do   # three nights of the 02:00 job (it rewrites the 500.000 imported orders) — replica still down
  docker exec pglab8-primary psql -U postgres -d ctshop -qc "UPDATE shop.orders SET note = 'archived, night $night' WHERE created_at < '2025-01-01'"
  docker exec pglab8-primary psql -U postgres -qc "CHECKPOINT"
  docker exec pglab8-primary psql -U postgres -Atc "SELECT 'night $night: the slot keeps ' ||
      pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) || ' · pg_wal = ' ||
      pg_size_pretty((SELECT sum(size) FROM pg_ls_waldir())) FROM pg_replication_slots"
done`,
  N2F: `SHOW max_slot_wal_keep_size;   -- -1 = no limit: one dead replica may fill the disk of the primary
ALTER SYSTEM SET max_slot_wal_keep_size = '1GB';
SELECT pg_reload_conf();`,
  N2G: `SHOW max_slot_wal_keep_size;   -- a NEW session sees the reloaded value
-- the alert every replica needs (run it every minute from your monitoring)
SELECT slot_name, active, wal_status,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS kept,
       pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn) > 256 * 1024 * 1024 AS alert,
       pg_size_pretty(safe_wal_size) AS until_slot_is_lost
FROM pg_replication_slots;`,
  N2H: `docker start pglab8-replica && sleep 5     # the replica comes back and catches up by itself
docker exec pglab8-primary psql -U postgres -c "SELECT slot_name, active, wal_status,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS kept FROM pg_replication_slots" \\
  -c "CHECKPOINT" -c "SELECT pg_size_pretty(sum(size)) AS pg_wal_size, count(*) AS wal_files FROM pg_ls_waldir()"`,
  N2I: `docker stop pglab8-primary         # 14:00 — the primary is gone
docker exec pglab8-replica psql -U postgres -d ctshop -c "SELECT pg_promote()" -c "SELECT pg_is_in_recovery() AS still_replica" \\
  -c "INSERT INTO shop.orders (customer_id, note) VALUES (9, 'after the failover') RETURNING id" \\
  -c "SELECT pg_walfile_name(pg_current_wal_lsn()) AS wal_file   -- 00000002… = timeline 2"
docker logs pglab8-replica 2>&1 | grep -E 'promote|selected new timeline|ready to accept' | tail -n 3`,
  N2J: `docker exec pglab8-replica pg_isready -h pglab8-primary   # the app's connection string still points HERE`,
  N2K: `bash lab8-docker.sh down`,
};
const LG = {
  S0A: 'bash',
  S0B: 'bash',
  R1A: 'sql',
  R1B: 'sql',
  R1C: 'sql',
  R1D: 'sql',
  R1E: 'sql',
  R1F: 'sql',
  R1G: 'sql',
  R1H: 'sql',
  R1I: 'sql',
  R1J: 'sql',
  R1K: 'sql',
  R1L: 'sql',
  R1M: 'sql',
  R1N: 'sql',
  R1O: 'sql',
  R1P: 'sql',
  R1Q: 'sql',
  R1R: 'sql',
  R1S: 'sql',
  B1A: 'bash',
  B1B: 'bash',
  B1C: 'bash',
  B1D: 'bash',
  B1E: 'bash',
  B1F: 'bash',
  B1G: 'bash',
  B2A: 'sql',
  B2B: 'sql',
  B2C: 'bash',
  B2D: 'bash',
  B2E: 'sql',
  B2F: 'bash',
  B2G: 'sql',
  B2H: 'sql',
  B2I: 'sql',
  B3A: 'bash',
  B3B: 'bash',
  B3C: 'bash',
  B3D: 'bash',
  B3E: 'bash',
  B3F: 'bash',
  N1A: 'bash',
  N1B: 'bash',
  N1C: 'sql',
  N1D: 'sql',
  N1E: 'sql',
  N1F: 'sql',
  N1G: 'bash',
  N1H: 'bash',
  N1I: 'bash',
  N1J: 'bash',
  N2A: 'bash',
  N2B: 'bash',
  N2C: 'bash',
  N2D: 'sql',
  N2E: 'bash',
  N2F: 'sql',
  N2G: 'sql',
  N2H: 'bash',
  N2I: 'bash',
  N2J: 'bash',
  N2K: 'bash',
};
const AI = {
  S0A: 'bash',
  S0B: 'bash',
  R1A: 'pglab8-primary · postgres',
  R1B: 'pglab8-primary · postgres',
  R1C: 'pglab8-primary · postgres',
  R1D: 'pglab8-primary · postgres',
  R1E: 'pglab8-primary · ketoan',
  R1F: 'pglab8-primary · ketoan',
  R1G: 'pglab8-primary · ketoan',
  R1H: 'pglab8-primary · ketoan',
  R1I: 'pglab8-primary · ketoan',
  R1J: 'pglab8-primary · ketoan',
  R1K: 'pglab8-primary · postgres',
  R1L: 'pglab8-primary · ketoan',
  R1M: 'pglab8-primary · postgres',
  R1N: 'pglab8-primary · ketoan',
  R1O: 'pglab8-primary · postgres',
  R1P: 'pglab8-primary · ketoan',
  R1Q: 'pglab8-primary · postgres',
  R1R: 'pglab8-primary · ketoan',
  R1S: 'pglab8-primary · postgres',
  B1A: 'bash',
  B1B: 'bash',
  B1C: 'bash',
  B1D: 'bash',
  B1E: 'bash',
  B1F: 'bash',
  B1G: 'bash',
  B2A: 'pglab8-primary · postgres',
  B2B: 'pglab8-primary · postgres',
  B2C: 'bash',
  B2D: 'bash',
  B2E: 'pglab8-primary · postgres',
  B2F: 'bash',
  B2G: 'pglab8-primary · postgres',
  B2H: 'pglab8-primary · postgres',
  B2I: 'pglab8-primary · postgres',
  B3A: 'bash',
  B3B: 'bash',
  B3C: 'bash',
  B3D: 'bash',
  B3E: 'bash',
  B3F: 'bash',
  N1A: 'bash',
  N1B: 'bash',
  N1C: 'pglab8-primary · postgres',
  N1D: 'pglab8-primary · postgres',
  N1E: 'pglab8-replica · postgres',
  N1F: 'pglab8-replica · ketoan',
  N1G: 'bash',
  N1H: 'bash',
  N1I: 'bash',
  N1J: 'bash',
  N2A: 'bash',
  N2B: 'bash',
  N2C: 'bash',
  N2D: 'pglab8-primary · postgres',
  N2E: 'bash',
  N2F: 'pglab8-primary · postgres',
  N2G: 'pglab8-primary · postgres',
  N2H: 'bash',
  N2I: 'bash',
  N2J: 'bash',
  N2K: 'bash',
};
/* Q:END */

/* Output THẬT (PostgreSQL 17.11) — sinh từ lần chạy run8.mjs. */
/* O:BEGIN */
const O = {
  S0A: `✓ pglab8-primary is ready
✓ pglab8-replica is ready
primary: PostgreSQL 17.11 (Debian 17.11-1.pgdg13+2) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit`,
  S0B: ` categories | products | customers | orders | order_lines | payments | stock_moves | reviews 
------------+----------+-----------+--------+-------------+----------+-------------+---------
         12 |       48 |       300 |   2000 |        5000 |     1663 |         429 |     678
(1 row)`,
  R1A: `CREATE ROLE
GRANT
GRANT
GRANT`,
  R1B: `CREATE ROLE
ALTER ROLE
ALTER ROLE
ALTER ROLE`,
  R1C: `               List of role grants
 Role name | Member of |   Options    | Grantor  
-----------+-----------+--------------+----------
 ketoan    | report_ro | INHERIT, SET | postgres
(1 row)

                   List of settings
  Role  | Database |             Settings             
--------+----------+----------------------------------
 ketoan |          | default_transaction_read_only=on+
        |          | statement_timeout=5s            +
        |          | search_path=shop
(1 row)`,
  R1D: `     table      | sel | ins | upd | del | trunc 
----------------+-----+-----+-----+-----+-------
 category       | t   | f   | f   | f   | f
 customer       | t   | f   | f   | f   | f
 order_item     | t   | f   | f   | f   | f
 orders         | t   | f   | f   | f   | f
 payment        | t   | f   | f   | f   | f
 product        | t   | f   | f   | f   | f
 review         | t   | f   | f   | f   | f
 stock_movement | t   | f   | f   | f   | f
(8 rows)`,
  R1E: ` current_user | read_only | timeout | path 
--------------+-----------+---------+------
 ketoan       | on        | 5s      | shop
(1 row)`,
  R1F: ` payments |   revenue    
----------+--------------
     1663 | 946164000.00
(1 row)`,
  R1G: `ERROR:  cannot execute INSERT in a read-only transaction`,
  R1H: `SET
ERROR:  permission denied for table orders
ERROR:  permission denied for schema public
LINE 1: CREATE TABLE public.my_notes (x int);
                     ^
ERROR:  permission denied for schema shop
LINE 1: CREATE TABLE shop.my_notes (x int);
                     ^`,
  R1I: `Timing is on.
ERROR:  canceling statement due to statement timeout
Time: 5003.741 ms (00:05.004)`,
  R1J: `Timing is off.
SET
 statement_timeout 
-------------------
 0
(1 row)`,
  R1K: `CREATE TABLE
INSERT 0 2`,
  R1L: `ERROR:  permission denied for table coupon`,
  R1M: `ALTER DEFAULT PRIVILEGES
GRANT
CREATE TABLE
            Default access privileges
  Owner   | Schema | Type  |  Access privileges   
----------+--------+-------+----------------------
 postgres | shop   | table | report_ro=r/postgres
(1 row)`,
  R1N: ` coupons 
---------
       2
(1 row)

 gift_cards 
------------
          0
(1 row)`,
  R1O: `CREATE ROLE
GRANT
SET
CREATE TABLE
RESET`,
  R1P: `ERROR:  permission denied for table flash_sale`,
  R1Q: `ALTER DEFAULT PRIVILEGES
GRANT
              Default access privileges
   Owner    | Schema | Type  |   Access privileges    
------------+--------+-------+------------------------
 ctshop_app | shop   | table | report_ro=r/ctshop_app
 postgres   | shop   | table | report_ro=r/postgres
(2 rows)`,
  R1R: ` flash_sales 
-------------
           0
(1 row)`,
  R1S: `DROP TABLE
 tables 
--------
      8
(1 row)`,
  B1A: `   98394 backups/ctshop.dump
    1616 backups/globals.sql
  100010 total`,
  B1B: `CREATE ROLE ctshop_app;
ALTER ROLE ctshop_app WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:…';
CREATE ROLE ketoan;
ALTER ROLE ketoan WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:…';
CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:…';
CREATE ROLE report_ro;
ALTER ROLE report_ro WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
ALTER ROLE ketoan SET default_transaction_read_only TO 'on';
ALTER ROLE ketoan SET statement_timeout TO '5s';
ALTER ROLE ketoan SET search_path TO 'shop';
GRANT report_ro TO ketoan WITH INHERIT TRUE GRANTED BY postgres;`,
  B1C: `   1 ACL -
   8 ACL shop
  13 CONSTRAINT shop
   2 DEFAULT ACL
  10 FK CONSTRAINT
   7 SEQUENCE SET
   8 TABLE DATA
   8 TABLE shop`,
  B1D: `pg_restore: error: could not execute query: ERROR:  role "report_ro" does not exist
Command was: GRANT USAGE ON SCHEMA shop TO report_ro;
GRANT ALL ON SCHEMA shop TO ctshop_app;


pg_restore: error: could not execute query: ERROR:  role "report_ro" does not exist
Command was: GRANT SELECT ON TABLE shop.category TO report_ro;


pg_restore: error: could not execute query: ERROR:  role "report_ro" does not exist
Command was: GRANT SELECT ON TABLE shop.customer TO report_ro;


pg_restore: error: could not execute query: ERROR:  role "report_ro" does not exist
Command was: GRANT SELECT ON TABLE shop.order_item TO report_ro;


pg_restore: error: could not execute query: ERROR:  role "report_ro" does not exist
Command was: GRANT SELECT ON TABLE shop.orders TO report_ro;


pg_restore: error: could not execute query: ERROR:  role "report_ro" does not exist
Command was: GRANT SELECT ON TABLE shop.payment TO report_ro;


pg_restore: error: could not execute query: ERROR:  role "report_ro" does not exist
Command was: GRANT SELECT ON TABLE shop.product TO report_ro;


pg_restore: error: could not execute query: ERROR:  role "report_ro" does not exist
Command was: GRANT SELECT ON TABLE shop.review TO report_ro;


pg_restore: error: could not execute query: ERROR:  role "report_ro" does not exist
Command was: GRANT SELECT ON TABLE shop.stock_movement TO report_ro;


pg_restore: error: could not execute query: ERROR:  role "report_ro" does not exist
Command was: ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_app IN SCHEMA shop GRANT SELECT ON TABLES TO report_ro;


pg_restore: error: could not execute query: ERROR:  role "report_ro" does not exist
Command was: ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA shop GRANT SELECT ON TABLES TO report_ro;


pg_restore: warning: errors ignored on restore: 11
exit code: 1`,
  B1E: `      27
16,25c16,23
< acl|category|postgres=arwdDxtm/postgres report_ro=r/postgres
< acl|customer|postgres=arwdDxtm/postgres report_ro=r/postgres
< acl|order_item|postgres=arwdDxtm/postgres report_ro=r/postgres
< acl|orders|postgres=arwdDxtm/postgres report_ro=r/postgres
< acl|payment|postgres=arwdDxtm/postgres report_ro=r/postgres
< acl|product|postgres=arwdDxtm/postgres report_ro=r/postgres
< acl|review|postgres=arwdDxtm/postgres report_ro=r/postgres
< acl|stock_movement|postgres=arwdDxtm/postgres report_ro=r/postgres
< role|ctshop_app|login=true|-
< role|ketoan|login=true|default_transaction_read_only=on statement_timeout=5s search_path=shop
---
> acl|category|owner only
> acl|customer|owner only
> acl|order_item|owner only
> acl|orders|owner only
> acl|payment|owner only
> acl|product|owner only
> acl|review|owner only
> acl|stock_movement|owner only
27d24
< role|report_ro|login=false|-
diff exit code: 1`,
  B1F: `DROP DATABASE
CREATE DATABASE
ERROR:  role "postgres" already exists
exit code: 0`,
  B1G: `✓ identical: 27 facts
table|category|12|14f4941c8f9e0457fe9f5c89e698bd21
table|product|48|fe8074767578d091f61db999626dbe21
table|customer|300|a75fb52a8c9207059b32f61c22c353e1
seq|orders_id_seq|2000
seq|review_id_seq|678
acl|orders|postgres=arwdDxtm/postgres report_ro=r/postgres
acl|review|postgres=arwdDxtm/postgres report_ro=r/postgres`,
  B2A: `DELETE 78`,
  B2B: ` id  | product_id | customer_id |          created_at           
-----+------------+-------------+-------------------------------
 679 |          1 |           1 | 2026-10-26 04:26:33.934672+07
 680 |          1 |           2 | 2026-10-26 04:26:33.934672+07
(2 rows)

INSERT 0 2
 reviews_now 
-------------
         602
(1 row)`,
  B2C: `pg_restore: error: COPY failed for table "review": ERROR:  duplicate key value violates unique constraint "review_pkey"
DETAIL:  Key (id)=(1) already exists.
CONTEXT:  COPY review, line 1
pg_restore: warning: errors ignored on restore: 1
exit code: 1`,
  B2D: `713
COPY shop.review (id, product_id, customer_id, rating, body, created_at) FROM stdin;`,
  B2E: `CREATE TABLE`,
  B2F: `COPY 678`,
  B2G: ` in_backup | missing_now | missing_in_cat9 
-----------+-------------+-----------------
       678 |          78 |              78
(1 row)`,
  B2H: `ERROR:  cannot insert a non-DEFAULT value into column "id"
DETAIL:  Column "id" is an identity column defined as GENERATED ALWAYS.
HINT:  Use OVERRIDING SYSTEM VALUE to override.`,
  B2I: `INSERT 0 78
 reviews_now | new_ones_kept 
-------------+---------------
         680 |             2
(1 row)

DROP TABLE`,
  B3A: `✅ backup OK: ctshop-20261026-042635.sql.gz
✅ backup OK: ctshop-20261026-042637.sql.gz
✅ backup OK: ctshop-20261026-042638.sql.gz
   81253 backups/daily/ctshop-20261026-042635.sql.gz
   81252 backups/daily/ctshop-20261026-042637.sql.gz
   81251 backups/daily/ctshop-20261026-042638.sql.gz
  243756 total`,
  B3B: `pglab8-primary
Error response from daemon: container fd16ac66a408d36375320487d5ef4f2e2064ce17e6e09ee3bb7343c87f566349 is not running
✅ backup OK: ctshop-20261026-042641.sql.gz
exit code: 0
Error response from daemon: container fd16ac66a408d36375320487d5ef4f2e2064ce17e6e09ee3bb7343c87f566349 is not running
✅ backup OK: ctshop-20261026-042642.sql.gz
exit code: 0
Error response from daemon: container fd16ac66a408d36375320487d5ef4f2e2064ce17e6e09ee3bb7343c87f566349 is not running
✅ backup OK: ctshop-20261026-042643.sql.gz
exit code: 0
      20 backups/daily/ctshop-20261026-042641.sql.gz
      20 backups/daily/ctshop-20261026-042642.sql.gz
      20 backups/daily/ctshop-20261026-042643.sql.gz
      60 total
       0`,
  B3C: `pglab8-primary
✅ ./backups/daily/ctshop-20261026-042648.sql.gz   80K  ·  checked backups kept: 1
✅ ./backups/daily/ctshop-20261026-042649.sql.gz   80K  ·  checked backups kept: 2
✅ ./backups/daily/ctshop-20261026-042651.sql.gz   80K  ·  checked backups kept: 3
exit code: 0`,
  B3D: `pglab8-primary
Error response from daemon: container fd16ac66a408d36375320487d5ef4f2e2064ce17e6e09ee3bb7343c87f566349 is not running
❌ BACKUP FAILED: pg_dump | gzip returned an error
   the 3 older backups were NOT touched
exit code: 1
ctshop-20261026-042648.sql.gz
ctshop-20261026-042649.sql.gz
ctshop-20261026-042651.sql.gz`,
  B3E: `pglab8-primary
pg_dump: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  database "ctshopp" does not exist
❌ BACKUP FAILED: pg_dump | gzip returned an error
   the 3 older backups were NOT touched
exit code: 1`,
  B3F: `--
-- PostgreSQL database dump complete
--

\\unrestrict 5p9PEs3qtdgFVqsapoi9K9soLOsMCTCrS8EbudjLkoPg2heOYWeyrVZqJRZFgpg

gzip: broken.sql.gz: unexpected end of file
gzip: broken.sql.gz: uncompress failed
gzip -t exit code: 1`,
  N1A: `pg_hba reloaded: true
waiting for checkpoint
32711/32711 kB (100%), 0/1 tablespace
32711/32711 kB (100%), 1/1 tablespace
✓ pglab8-replica is ready
replica in recovery: true`,
  N1B: `2026-10-26 04:27:02.955 +07 [30] LOG:  entering standby mode
2026-10-26 04:27:02.979 +07 [30] LOG:  consistent recovery state reached at 0/2000120
2026-10-26 04:27:02.979 +07 [1] LOG:  database system is ready to accept read-only connections
2026-10-26 04:27:02.992 +07 [45] LOG:  started streaming WAL from primary at 0/3000000 on timeline 1`,
  N1C: `Expanded display is on.
-[ RECORD 1 ]----+----------------
pid              | 60
usename          | replicator
application_name | walreceiver
client_addr      | 172.23.0.3
state            | streaming
sync_state       | async
sent_lsn         | 0/3000000
write_lsn        | 0/3000000
flush_lsn        | 0/3000000
replay_lsn       | 0/3000000
write_lag        | 00:00:00.000415
flush_lag        | 00:00:00.000415
replay_lag       | 00:00:00.000415

Expanded display is off.
 slot_name | slot_type | active | wal_status | restart_lsn 
-----------+-----------+--------+------------+-------------
 replica1  | physical  | t      | reserved   | 0/3000000
(1 row)`,
  N1D: `  id  |          created_at           
------+-------------------------------
 2001 | 2026-10-26 04:27:04.394727+07
(1 row)

INSERT 0 1`,
  N1E: ` is_replica 
------------
 t
(1 row)

  id  | customer_id |            note            
------+-------------+----------------------------
 2001 |           7 | first order with a replica
(1 row)

ERROR:  cannot execute INSERT in a read-only transaction`,
  N1F: ` current_user | on_replica 
--------------+------------
 ketoan       | t
(1 row)

 payments |   revenue    
----------+--------------
     1663 | 946164000.00
(1 row)`,
  N1G: `11c11
< seq|orders_id_seq|2001
---
> seq|orders_id_seq|2033`,
  N1H: `04:27:08 | behind 4272 bytes | replay_lag 00:00:00.018803
04:27:10 | behind 5896 bytes | replay_lag 00:00:00.02277
04:27:12 | behind 3896 bytes | replay_lag 00:00:00.003348
04:27:14 | behind 3368 bytes | replay_lag 00:00:00.018395
04:27:17 | behind 4888 bytes | replay_lag 00:00:00.006433
04:27:19 | behind 4672 bytes | replay_lag 00:00:00.002267
04:27:21 | behind 4960 bytes | replay_lag 00:00:00.003405
04:27:23 | behind 6680 bytes | replay_lag 00:00:00.006107
04:27:26 | behind 2032 bytes | replay_lag 00:00:00.006221
progress: 5.0 s, 773.5 tps, lat 10.312 ms stddev 8.863, 0 failed
progress: 10.0 s, 966.7 tps, lat 8.272 ms stddev 7.449, 0 failed
progress: 15.0 s, 1065.6 tps, lat 7.491 ms stddev 7.637, 0 failed
progress: 20.0 s, 968.6 tps, lat 8.252 ms stddev 6.981, 0 failed
number of transactions actually processed: 18884
tps = 944.095205 (without initial connection time)`,
  N1I: `04:27:27 | behind 13 MB | replay_lag 00:00:00.127367
04:27:28 | behind 24 bytes | replay_lag 00:00:00.360488
04:27:29 | behind 24 bytes | replay_lag 00:00:00.360488
04:27:31 | behind 24 bytes | replay_lag 00:00:00.360488
04:27:32 | behind 24 bytes | replay_lag 00:00:00.360488
04:27:33 | behind 24 bytes | replay_lag 00:00:00.360488
04:27:35 | behind 24 bytes | replay_lag 00:00:00.360488
04:27:36 | behind 0 bytes | replay_lag 00:00:00.008991
04:27:37 | behind 0 bytes | replay_lag 00:00:00.002022
04:27:38 | behind 0 bytes | replay_lag 00:00:00.003795
Timing is on.
INSERT 0 500000
Time: 8793.748 ms (00:08.794)`,
  N1J: ` since_last_replayed_commit | caught_up 
----------------------------+-----------
 00:00:21.792544            | t
(1 row)

 bytes_behind | replay_lag 
--------------+------------
            0 | 
(1 row)`,
  N2A: `1) read on the replica right after COMMIT    :  121 / 500 orders NOT found
2) wait for the replica to reach the commit LSN:    0 / 500 NOT found · wait avg 4.81 ms, p99 24.26 ms, max 27.08 ms
3) read your own write from the PRIMARY       :    0 / 500 NOT found
1) read on the replica right after COMMIT    :  286 / 500 orders NOT found
2) wait for the replica to reach the commit LSN:    0 / 500 NOT found · wait avg 2.03 ms, p99 10.25 ms, max 21.28 ms
3) read your own write from the PRIMARY       :    0 / 500 NOT found`,
  N2B: `prisma.$queryRaw (a read)                    → primary
prisma.$primary().$queryRaw                  → primary
inside prisma.$transaction([...])            → primary
create() then findUnique()            : 11 / 200 orders not found
create() then $primary().findUnique() : 0 / 200 orders not found`,
  N2C: `pglab8-replica`,
  N2D: ` slot_name | active | wal_status | wal_kept_for_slot 
-----------+--------+------------+-------------------
 replica1  | f      | reserved   | 0 bytes
(1 row)

 pg_wal_size | wal_files 
-------------+-----------
 160 MB      |        10
(1 row)`,
  N2E: `night 1: the slot keeps 125 MB · pg_wal = 288 MB
night 2: the slot keeps 308 MB · pg_wal = 336 MB
night 3: the slot keeps 494 MB · pg_wal = 512 MB`,
  N2F: ` max_slot_wal_keep_size 
------------------------
 -1
(1 row)

ALTER SYSTEM
 pg_reload_conf 
----------------
 t
(1 row)`,
  N2G: ` max_slot_wal_keep_size 
------------------------
 1GB
(1 row)

 slot_name | active | wal_status |  kept  | alert | until_slot_is_lost 
-----------+--------+------------+--------+-------+--------------------
 replica1  | f      | reserved   | 494 MB | t     | 536 MB
(1 row)`,
  N2H: `pglab8-replica
 slot_name | active | wal_status |  kept   
-----------+--------+------------+---------
 replica1  | t      | reserved   | 0 bytes
(1 row)

CHECKPOINT
 pg_wal_size | wal_files 
-------------+-----------
 512 MB      |        32
(1 row)`,
  N2I: `pglab8-primary
 pg_promote 
------------
 t
(1 row)

 still_replica 
---------------
 f
(1 row)

   id   
--------
 601578
(1 row)

INSERT 0 1
         wal_file         
--------------------------
 00000002000000000000002A
(1 row)

2026-10-26 04:29:07.577 +07 [29] LOG:  received promote request
2026-10-26 04:29:07.589 +07 [29] LOG:  selected new timeline ID: 2
2026-10-26 04:29:07.662 +07 [1] LOG:  database system is ready to accept connections`,
  N2J: `pglab8-primary:5432 - no response`,
  N2K: `✓ removed pglab8-primary, pglab8-replica, their volumes and pglab8-net`,
};
/* O:END */

/* lab8-solution.sh — sinh từ steps8.mjs + output thật. */
/* SOL:BEGIN */
const SOL = `#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# CT Shop · Lab 8 — SOLUTION: back up, restore, a read-only account, a streaming replica, lag
# Lab 8 — ĐÁP ÁN: sao lưu, khôi phục, tài khoản chỉ đọc, bản sao streaming, độ trễ
# cuongthai.com/courses/postgresql · PostgreSQL 17.11
#
# Every command of the lab in order, each followed by the REAL output it gave (# ⇒ …), PostgreSQL 17.11, 26/10/2026.
# Runnable top to bottom in an empty folder holding the other lab8-* files (≈ 5 minutes, it ends with "down"),
# but you learn more by copying it part by part. Times, LSNs, ids of containers and "behind" bytes differ on your machine;
# row counts, errors and verdicts do not. (Two traps are EXPECTED to print errors — that is the point.)
# Needs: Docker, bash, Node 18+ (for N2: npm i pg).
# ═══════════════════════════════════════════════════════════════════════════

# ───────────────────────────────────────────────────────────────────────────
# SETUP — two servers + the standard shop on the primary
# ───────────────────────────────────────────────────────────────────────────
bash lab8-docker.sh up
#   ⇒ ✓ pglab8-primary is ready
#   ⇒ ✓ pglab8-replica is ready
#   ⇒ primary: PostgreSQL 17.11 (Debian 17.11-1.pgdg13+2) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
docker cp lab8-start.sql pglab8-primary:/tmp/
docker exec -it pglab8-primary psql -U postgres -d ctshop -f /tmp/lab8-start.sql | tail -n 5
#   ⇒  categories | products | customers | orders | order_lines | payments | stock_moves | reviews
#   ⇒ ------------+----------+-----------+--------+-------------+----------+-------------+---------
#   ⇒          12 |       48 |       300 |   2000 |        5000 |     1663 |         429 |     678
#   ⇒ (1 row)

# ───────────────────────────────────────────────────────────────────────────
# R1 — a read-only account for accounting (on the PRIMARY, as postgres)
# ───────────────────────────────────────────────────────────────────────────
docker exec -i pglab8-primary psql -U postgres -d ctshop <<'SQL'
SET search_path = shop;
CREATE ROLE report_ro NOLOGIN;                      -- a GROUP: holds privileges, nobody logs in as it
GRANT CONNECT ON DATABASE ctshop TO report_ro;
GRANT USAGE ON SCHEMA shop TO report_ro;               -- may look inside the schema …
GRANT SELECT ON ALL TABLES IN SCHEMA shop TO report_ro;   -- … and read the 8 tables that exist NOW
--   ⇒ CREATE ROLE
--   ⇒ GRANT
--   ⇒ GRANT
--   ⇒ GRANT
CREATE ROLE ketoan LOGIN PASSWORD 'ketoan-lab8' IN ROLE report_ro;   -- a PERSON: logs in, inherits report_ro
ALTER ROLE ketoan SET default_transaction_read_only = on;
ALTER ROLE ketoan SET statement_timeout = '5s';      -- 5 s for the lab; 30–60 s on a real server
ALTER ROLE ketoan SET search_path = shop;
--   ⇒ CREATE ROLE
--   ⇒ ALTER ROLE
--   ⇒ ALTER ROLE
--   ⇒ ALTER ROLE
\\drg ketoan
\\drds ketoan
--   ⇒                List of role grants
--   ⇒  Role name | Member of |   Options    | Grantor
--   ⇒ -----------+-----------+--------------+----------
--   ⇒  ketoan    | report_ro | INHERIT, SET | postgres
--   ⇒ (1 row)
--   ⇒                    List of settings
--   ⇒ … (6 more lines)
SELECT c.relname AS "table",
       has_table_privilege('ketoan', c.oid, 'SELECT') AS sel,
       has_table_privilege('ketoan', c.oid, 'INSERT') AS ins,
       has_table_privilege('ketoan', c.oid, 'UPDATE') AS upd,
       has_table_privilege('ketoan', c.oid, 'DELETE') AS del,
       has_table_privilege('ketoan', c.oid, 'TRUNCATE') AS trunc
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'shop' AND c.relkind = 'r'
ORDER BY 1;   -- pass: 8 rows, sel = t, every other column f
--   ⇒      table      | sel | ins | upd | del | trunc
--   ⇒ ----------------+-----+-----+-----+-----+-------
--   ⇒  category       | t   | f   | f   | f   | f
--   ⇒  customer       | t   | f   | f   | f   | f
--   ⇒  order_item     | t   | f   | f   | f   | f
--   ⇒  orders         | t   | f   | f   | f   | f
--   ⇒ … (5 more lines)
SQL
# log in AS ketoan (password, over TCP — like the accounting app will)
docker exec -i -e PGPASSWORD=ketoan-lab8 pglab8-primary psql -h 127.0.0.1 -U ketoan -d ctshop <<'SQL'
SELECT current_user, current_setting('default_transaction_read_only') AS read_only,
       current_setting('statement_timeout') AS timeout, current_setting('search_path') AS path;
--   ⇒  current_user | read_only | timeout | path
--   ⇒ --------------+-----------+---------+------
--   ⇒  ketoan       | on        | 5s      | shop
--   ⇒ (1 row)
SELECT count(*) AS payments, sum(amount) AS revenue FROM payment;
--   ⇒  payments |   revenue
--   ⇒ ----------+--------------
--   ⇒      1663 | 946164000.00
--   ⇒ (1 row)
INSERT INTO orders (customer_id) VALUES (1);
--   ⇒ ERROR:  cannot execute INSERT in a read-only transaction
SET default_transaction_read_only = off;   -- any user may change it: it is a DEFAULT, not a wall
INSERT INTO orders (customer_id) VALUES (1);
CREATE TABLE public.my_notes (x int);
CREATE TABLE shop.my_notes (x int);
--   ⇒ SET
--   ⇒ ERROR:  permission denied for table orders
--   ⇒ ERROR:  permission denied for schema public
--   ⇒ LINE 1: CREATE TABLE public.my_notes (x int);
--   ⇒                      ^
--   ⇒ ERROR:  permission denied for schema shop
--   ⇒ LINE 1: CREATE TABLE shop.my_notes (x int);
--   ⇒                      ^
\\timing on
SELECT count(*) FROM order_item a, order_item b, category c;   -- 300 million rows: a runaway report
--   ⇒ Timing is on.
--   ⇒ ERROR:  canceling statement due to statement timeout
--   ⇒ Time: 5003.741 ms (00:05.004)
\\timing off
SET statement_timeout = 0;
SHOW statement_timeout;   -- the timeout is a default too
--   ⇒ Timing is off.
--   ⇒ SET
--   ⇒  statement_timeout
--   ⇒ -------------------
--   ⇒  0
--   ⇒ (1 row)
SQL
# next week a developer adds a table
docker exec -i pglab8-primary psql -U postgres -d ctshop <<'SQL'
SET search_path = shop;
CREATE TABLE shop.coupon (code text PRIMARY KEY, percent int NOT NULL CHECK (percent BETWEEN 1 AND 50));
INSERT INTO shop.coupon VALUES ('BACKTOSCHOOL', 10), ('TET2027', 15);
--   ⇒ CREATE TABLE
--   ⇒ INSERT 0 2
SQL
docker exec -i -e PGPASSWORD=ketoan-lab8 pglab8-primary psql -h 127.0.0.1 -U ketoan -d ctshop <<'SQL'
SELECT * FROM coupon;
--   ⇒ ERROR:  permission denied for table coupon
SQL
docker exec -i pglab8-primary psql -U postgres -d ctshop <<'SQL'
SET search_path = shop;
ALTER DEFAULT PRIVILEGES IN SCHEMA shop GRANT SELECT ON TABLES TO report_ro;   -- tables postgres creates FROM NOW ON
GRANT SELECT ON shop.coupon TO report_ro;                                    -- the one that already exists
CREATE TABLE shop.gift_card (code text PRIMARY KEY, balance numeric(12,2) NOT NULL);
\\ddp
--   ⇒ ALTER DEFAULT PRIVILEGES
--   ⇒ GRANT
--   ⇒ CREATE TABLE
--   ⇒             Default access privileges
--   ⇒   Owner   | Schema | Type  |  Access privileges
--   ⇒ ----------+--------+-------+----------------------
--   ⇒  postgres | shop   | table | report_ro=r/postgres
--   ⇒ (1 row)
SQL
docker exec -i -e PGPASSWORD=ketoan-lab8 pglab8-primary psql -h 127.0.0.1 -U ketoan -d ctshop <<'SQL'
SELECT count(*) AS coupons FROM coupon;
SELECT count(*) AS gift_cards FROM gift_card;
--   ⇒  coupons
--   ⇒ ---------
--   ⇒        2
--   ⇒ (1 row)
--   ⇒  gift_cards
--   ⇒ ------------
--   ⇒           0
--   ⇒ (1 row)
SQL
# the trap that bites in production: the APP creates the tables, not postgres
docker exec -i pglab8-primary psql -U postgres -d ctshop <<'SQL'
SET search_path = shop;
CREATE ROLE ctshop_app LOGIN PASSWORD 'app-lab8';   -- the app's own account (its migrations create tables)
GRANT USAGE, CREATE ON SCHEMA shop TO ctshop_app;
SET ROLE ctshop_app;
CREATE TABLE shop.flash_sale (product_id bigint PRIMARY KEY, price numeric(12,2) NOT NULL, ends_at timestamptz NOT NULL);
RESET ROLE;
--   ⇒ CREATE ROLE
--   ⇒ GRANT
--   ⇒ SET
--   ⇒ CREATE TABLE
--   ⇒ RESET
SQL
docker exec -i -e PGPASSWORD=ketoan-lab8 pglab8-primary psql -h 127.0.0.1 -U ketoan -d ctshop <<'SQL'
SELECT * FROM flash_sale;
--   ⇒ ERROR:  permission denied for table flash_sale
SQL
docker exec -i pglab8-primary psql -U postgres -d ctshop <<'SQL'
SET search_path = shop;
ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_app IN SCHEMA shop GRANT SELECT ON TABLES TO report_ro;
GRANT SELECT ON shop.flash_sale TO report_ro;
\\ddp
--   ⇒ ALTER DEFAULT PRIVILEGES
--   ⇒ GRANT
--   ⇒               Default access privileges
--   ⇒    Owner    | Schema | Type  |   Access privileges
--   ⇒ ------------+--------+-------+------------------------
--   ⇒  ctshop_app | shop   | table | report_ro=r/ctshop_app
--   ⇒  postgres   | shop   | table | report_ro=r/postgres
--   ⇒ (2 rows)
SQL
docker exec -i -e PGPASSWORD=ketoan-lab8 pglab8-primary psql -h 127.0.0.1 -U ketoan -d ctshop <<'SQL'
SELECT count(*) AS flash_sales FROM flash_sale;
--   ⇒  flash_sales
--   ⇒ -------------
--   ⇒            0
--   ⇒ (1 row)
SQL
docker exec -i pglab8-primary psql -U postgres -d ctshop <<'SQL'
SET search_path = shop;
DROP TABLE shop.coupon, shop.gift_card, shop.flash_sale;   -- the lab keeps the 8 standard tables
SELECT count(*) AS tables FROM pg_tables WHERE schemaname = 'shop';
--   ⇒ DROP TABLE
--   ⇒  tables
--   ⇒ --------
--   ⇒       8
--   ⇒ (1 row)
SQL

# ───────────────────────────────────────────────────────────────────────────
# B1 — back up, then PROVE it restores on another server (the blank pglab8-replica)
# ───────────────────────────────────────────────────────────────────────────
mkdir -p backups
docker exec pglab8-primary pg_dump -U postgres -d ctshop -Fc > backups/ctshop.dump
docker exec pglab8-primary pg_dumpall -U postgres --globals-only > backups/globals.sql
chmod 600 backups/globals.sql           # it holds the password hashes
wc -c backups/*
#   ⇒    98394 backups/ctshop.dump
#   ⇒     1616 backups/globals.sql
#   ⇒   100010 total
grep -E '^(CREATE|ALTER) ROLE|^GRANT' backups/globals.sql | sed -E "s/'SCRAM-SHA-256[^']*'/'SCRAM-SHA-256\\$4096:…'/"
#   ⇒ CREATE ROLE ctshop_app;
#   ⇒ ALTER ROLE ctshop_app WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:…';
#   ⇒ CREATE ROLE ketoan;
#   ⇒ ALTER ROLE ketoan WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:…';
#   ⇒ CREATE ROLE postgres;
#   ⇒ ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:…';
#   ⇒ … (6 more lines)
docker exec -i pglab8-replica pg_restore -l < backups/ctshop.dump | grep -E ' (TABLE|TABLE DATA|ACL|CONSTRAINT|FK CONSTRAINT|SEQUENCE SET) ' | awk '{print $4, $5}' | sort | uniq -c
#   ⇒    1 ACL -
#   ⇒    8 ACL shop
#   ⇒   13 CONSTRAINT shop
#   ⇒    2 DEFAULT ACL
#   ⇒   10 FK CONSTRAINT
#   ⇒    7 SEQUENCE SET
#   ⇒    8 TABLE DATA
#   ⇒    8 TABLE shop
# trap first: restore WITHOUT the globals
docker exec -i pglab8-replica pg_restore -U postgres -d ctshop < backups/ctshop.dump
echo "exit code: $?"
#   ⇒ pg_restore: error: could not execute query: ERROR:  role "report_ro" does not exist
#   ⇒ Command was: GRANT USAGE ON SCHEMA shop TO report_ro;
#   ⇒ GRANT ALL ON SCHEMA shop TO ctshop_app;
#   ⇒ pg_restore: error: could not execute query: ERROR:  role "report_ro" does not exist
#   ⇒ Command was: GRANT SELECT ON TABLE shop.category TO report_ro;
#   ⇒ pg_restore: error: could not execute query: ERROR:  role "report_ro" does not exist
#   ⇒ … (19 more lines)
docker exec -i pglab8-primary psql -U postgres -d ctshop -At -f - < lab8-check.sql > check-primary.txt
docker exec -i pglab8-replica psql -U postgres -d ctshop -At -f - < lab8-check.sql > check-spare.txt
wc -l < check-primary.txt
diff check-primary.txt check-spare.txt
echo "diff exit code: $?"
#   ⇒       27
#   ⇒ 16,25c16,23
#   ⇒ < acl|category|postgres=arwdDxtm/postgres report_ro=r/postgres
#   ⇒ < acl|customer|postgres=arwdDxtm/postgres report_ro=r/postgres
#   ⇒ < acl|order_item|postgres=arwdDxtm/postgres report_ro=r/postgres
#   ⇒ < acl|orders|postgres=arwdDxtm/postgres report_ro=r/postgres
#   ⇒ … (18 more lines)
# the right order: globals FIRST, then the dump
docker exec pglab8-replica psql -U postgres -d postgres -c 'DROP DATABASE ctshop' -c 'CREATE DATABASE ctshop'
docker exec -i pglab8-replica psql -U postgres -d postgres -q < backups/globals.sql
docker exec -i pglab8-replica pg_restore -U postgres -d ctshop --exit-on-error < backups/ctshop.dump
echo "exit code: $?"
#   ⇒ DROP DATABASE
#   ⇒ CREATE DATABASE
#   ⇒ ERROR:  role "postgres" already exists
#   ⇒ exit code: 0
docker exec -i pglab8-replica psql -U postgres -d ctshop -At -f - < lab8-check.sql > check-spare.txt
diff check-primary.txt check-spare.txt && echo "✓ identical: $(wc -l < check-primary.txt | tr -d ' ') facts"
head -n 3 check-primary.txt; grep -E '^(seq|acl)\\|(orders|review)' check-primary.txt
#   ⇒ ✓ identical: 27 facts
#   ⇒ table|category|12|14f4941c8f9e0457fe9f5c89e698bd21
#   ⇒ table|product|48|fe8074767578d091f61db999626dbe21
#   ⇒ table|customer|300|a75fb52a8c9207059b32f61c22c353e1
#   ⇒ seq|orders_id_seq|2000
#   ⇒ seq|review_id_seq|678
#   ⇒ acl|orders|postgres=arwdDxtm/postgres report_ro=r/postgres
#   ⇒ acl|review|postgres=arwdDxtm/postgres report_ro=r/postgres

# ───────────────────────────────────────────────────────────────────────────
# B2 — an incident: some rows deleted by mistake; bring back exactly those rows
# ───────────────────────────────────────────────────────────────────────────
docker exec -i pglab8-primary psql -U postgres -d ctshop <<'SQL'
SET search_path = shop;
-- 10:05 — a clean-up script for "discontinued notebooks" runs with the wrong filter: the whole category 9 (Sổ tay)
DELETE FROM review WHERE product_id IN (SELECT id FROM product WHERE category_id = 9);
--   ⇒ DELETE 78
-- 10:20 — customers keep writing reviews; they must NOT be lost by the repair
INSERT INTO review (product_id, customer_id, rating, body)
SELECT 1, c.id, 5, 'Mới: viết rất êm' FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM review r WHERE r.product_id = 1 AND r.customer_id = c.id)
ORDER BY c.id LIMIT 2
RETURNING id, product_id, customer_id, created_at;
SELECT count(*) AS reviews_now FROM review;
--   ⇒  id  | product_id | customer_id |          created_at
--   ⇒ -----+------------+-------------+-------------------------------
--   ⇒  679 |          1 |           1 | 2026-10-26 04:26:33.934672+07
--   ⇒  680 |          1 |           2 | 2026-10-26 04:26:33.934672+07
--   ⇒ (2 rows)
--   ⇒ INSERT 0 2
--   ⇒ … (4 more lines)
SQL
# trap: restore the table data straight into the live table
docker exec -i pglab8-primary pg_restore -U postgres -d ctshop --data-only -t review < backups/ctshop.dump
echo "exit code: $?"
#   ⇒ pg_restore: error: COPY failed for table "review": ERROR:  duplicate key value violates unique constraint "review_pkey"
#   ⇒ DETAIL:  Key (id)=(1) already exists.
#   ⇒ CONTEXT:  COPY review, line 1
#   ⇒ pg_restore: warning: errors ignored on restore: 1
#   ⇒ exit code: 1
# the right way: take the rows OUT of the dump as text …
docker exec -i pglab8-primary pg_restore --data-only -t review -f - < backups/ctshop.dump > review-data.sql
grep -c '' review-data.sql
grep '^COPY' review-data.sql
#   ⇒ 713
#   ⇒ COPY shop.review (id, product_id, customer_id, rating, body, created_at) FROM stdin;
docker exec -i pglab8-primary psql -U postgres -d ctshop <<'SQL'
SET search_path = shop;
CREATE TABLE shop.review_restore (LIKE shop.review);   -- … into a staging table with the same columns
--   ⇒ CREATE TABLE
SQL
sed 's/^COPY shop\\.review /COPY shop.review_restore /' review-data.sql \\
  | docker exec -i pglab8-primary psql -U postgres -d ctshop -v ON_ERROR_STOP=1 | grep -E '^COPY|ERROR'
#   ⇒ COPY 678
docker exec -i pglab8-primary psql -U postgres -d ctshop <<'SQL'
SET search_path = shop;
SELECT count(*) AS in_backup,
       count(*) FILTER (WHERE NOT EXISTS (SELECT 1 FROM review x WHERE x.id = r.id)) AS missing_now,
       count(*) FILTER (WHERE NOT EXISTS (SELECT 1 FROM review x WHERE x.id = r.id)
                          AND r.product_id IN (SELECT id FROM product WHERE category_id = 9)) AS missing_in_cat9
FROM review_restore r;
--   ⇒  in_backup | missing_now | missing_in_cat9
--   ⇒ -----------+-------------+-----------------
--   ⇒        678 |          78 |              78
--   ⇒ (1 row)
INSERT INTO review
SELECT r.* FROM review_restore r
WHERE NOT EXISTS (SELECT 1 FROM review x WHERE x.id = r.id)
  AND r.product_id IN (SELECT id FROM product WHERE category_id = 9);
--   ⇒ ERROR:  cannot insert a non-DEFAULT value into column "id"
--   ⇒ DETAIL:  Column "id" is an identity column defined as GENERATED ALWAYS.
--   ⇒ HINT:  Use OVERRIDING SYSTEM VALUE to override.
INSERT INTO review OVERRIDING SYSTEM VALUE        -- keep the ORIGINAL ids (other tables / links may point to them)
SELECT r.* FROM review_restore r
WHERE NOT EXISTS (SELECT 1 FROM review x WHERE x.id = r.id)
  AND r.product_id IN (SELECT id FROM product WHERE category_id = 9);
SELECT count(*) AS reviews_now,
       count(*) FILTER (WHERE body = 'Mới: viết rất êm') AS new_ones_kept
FROM review;
DROP TABLE review_restore;
--   ⇒ INSERT 0 78
--   ⇒  reviews_now | new_ones_kept
--   ⇒ -------------+---------------
--   ⇒          680 |             2
--   ⇒ (1 row)
--   ⇒ DROP TABLE
SQL

# ───────────────────────────────────────────────────────────────────────────
# B3 — the backup script: naive vs one that cannot lie
# ───────────────────────────────────────────────────────────────────────────
bash lab8-backup-naive.sh; sleep 1
bash lab8-backup-naive.sh; sleep 1
bash lab8-backup-naive.sh
wc -c backups/daily/*
#   ⇒ ✅ backup OK: ctshop-20261026-042635.sql.gz
#   ⇒ ✅ backup OK: ctshop-20261026-042637.sql.gz
#   ⇒ ✅ backup OK: ctshop-20261026-042638.sql.gz
#   ⇒    81253 backups/daily/ctshop-20261026-042635.sql.gz
#   ⇒    81252 backups/daily/ctshop-20261026-042637.sql.gz
#   ⇒    81251 backups/daily/ctshop-20261026-042638.sql.gz
#   ⇒   243756 total
docker stop pglab8-primary; sleep 1   # the database server is down tonight (crash, disk, maintenance…)
for night in 1 2 3; do bash lab8-backup-naive.sh; echo "exit code: $?"; sleep 1; done
wc -c backups/daily/*
gzip -dc "$(ls -1t backups/daily/*.sql.gz | head -n 1)" | wc -c
#   ⇒ pglab8-primary
#   ⇒ Error response from daemon: container fd16ac66a408d36375320487d5ef4f2e2064ce17e6e09ee3bb7343c87f566349 is not running
#   ⇒ ✅ backup OK: ctshop-20261026-042641.sql.gz
#   ⇒ exit code: 0
#   ⇒ Error response from daemon: container fd16ac66a408d36375320487d5ef4f2e2064ce17e6e09ee3bb7343c87f566349 is not running
#   ⇒ ✅ backup OK: ctshop-20261026-042642.sql.gz
#   ⇒ … (9 more lines)
docker start pglab8-primary && sleep 3
rm -rf backups/daily
bash lab8-backup.sh; sleep 1
bash lab8-backup.sh; sleep 1
bash lab8-backup.sh
echo "exit code: $?"
#   ⇒ pglab8-primary
#   ⇒ ✅ ./backups/daily/ctshop-20261026-042648.sql.gz   80K  ·  checked backups kept: 1
#   ⇒ ✅ ./backups/daily/ctshop-20261026-042649.sql.gz   80K  ·  checked backups kept: 2
#   ⇒ ✅ ./backups/daily/ctshop-20261026-042651.sql.gz   80K  ·  checked backups kept: 3
#   ⇒ exit code: 0
docker stop pglab8-primary
bash lab8-backup.sh
echo "exit code: $?"
ls -1A backups/daily
#   ⇒ pglab8-primary
#   ⇒ Error response from daemon: container fd16ac66a408d36375320487d5ef4f2e2064ce17e6e09ee3bb7343c87f566349 is not running
#   ⇒ ❌ BACKUP FAILED: pg_dump | gzip returned an error
#   ⇒    the 3 older backups were NOT touched
#   ⇒ exit code: 1
#   ⇒ ctshop-20261026-042648.sql.gz
#   ⇒ ctshop-20261026-042649.sql.gz
#   ⇒ ctshop-20261026-042651.sql.gz
docker start pglab8-primary && sleep 3
DB=ctshopp bash lab8-backup.sh          # a typo in the cron line
echo "exit code: $?"
#   ⇒ pglab8-primary
#   ⇒ pg_dump: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  database "ctshopp" does not exist
#   ⇒ ❌ BACKUP FAILED: pg_dump | gzip returned an error
#   ⇒    the 3 older backups were NOT touched
#   ⇒ exit code: 1
GOOD="$(ls -1t backups/daily/*.sql.gz | head -n 1)"
gzip -dc "$GOOD" | tail -n 6
head -c 20000 "$GOOD" > broken.sql.gz       # a copy cut short (disk full, network copy interrupted…)
gzip -t broken.sql.gz; echo "gzip -t exit code: $?"
#   ⇒ --
#   ⇒ -- PostgreSQL database dump complete
#   ⇒ --
#   ⇒ \\unrestrict 5p9PEs3qtdgFVqsapoi9K9soLOsMCTCrS8EbudjLkoPg2heOYWeyrVZqJRZFgpg
#   ⇒ gzip: broken.sql.gz: unexpected end of file
#   ⇒ gzip: broken.sql.gz: uncompress failed
#   ⇒ gzip -t exit code: 1

# ───────────────────────────────────────────────────────────────────────────
# N1 — a streaming replica for reports (pglab8-replica is wiped and rebuilt)
# ───────────────────────────────────────────────────────────────────────────
bash lab8-docker.sh replica
#   ⇒ pg_hba reloaded: true
#   ⇒ waiting for checkpoint
#   ⇒ 32711/32711 kB (100%), 0/1 tablespace
#   ⇒ 32711/32711 kB (100%), 1/1 tablespace
#   ⇒ ✓ pglab8-replica is ready
#   ⇒ replica in recovery: true
docker logs pglab8-replica 2>&1 | grep -E 'standby mode|consistent recovery|streaming WAL|read-only connections'
#   ⇒ 2026-10-26 04:27:02.955 +07 [30] LOG:  entering standby mode
#   ⇒ 2026-10-26 04:27:02.979 +07 [30] LOG:  consistent recovery state reached at 0/2000120
#   ⇒ 2026-10-26 04:27:02.979 +07 [1] LOG:  database system is ready to accept read-only connections
#   ⇒ 2026-10-26 04:27:02.992 +07 [45] LOG:  started streaming WAL from primary at 0/3000000 on timeline 1
docker exec -i pglab8-primary psql -U postgres -d ctshop <<'SQL'
SET search_path = shop;
\\x on
SELECT pid, usename, application_name, client_addr, state, sync_state,
       sent_lsn, write_lsn, flush_lsn, replay_lsn, write_lag, flush_lag, replay_lag
FROM pg_stat_replication;
\\x off
SELECT slot_name, slot_type, active, wal_status, restart_lsn FROM pg_replication_slots;
--   ⇒ Expanded display is on.
--   ⇒ -[ RECORD 1 ]----+----------------
--   ⇒ pid              | 60
--   ⇒ usename          | replicator
--   ⇒ application_name | walreceiver
--   ⇒ client_addr      | 172.23.0.3
--   ⇒ … (14 more lines)
INSERT INTO orders (customer_id, note) VALUES (7, 'first order with a replica') RETURNING id, created_at;
--   ⇒   id  |          created_at
--   ⇒ ------+-------------------------------
--   ⇒  2001 | 2026-10-26 04:27:04.394727+07
--   ⇒ (1 row)
--   ⇒ INSERT 0 1
SQL
docker exec -i pglab8-replica psql -U postgres -d ctshop <<'SQL'
SET search_path = shop;
SELECT pg_is_in_recovery() AS is_replica;
SELECT id, customer_id, note FROM orders ORDER BY id DESC LIMIT 1;
INSERT INTO orders (customer_id) VALUES (7);
--   ⇒  is_replica
--   ⇒ ------------
--   ⇒  t
--   ⇒ (1 row)
--   ⇒   id  | customer_id |            note
--   ⇒ ------+-------------+----------------------------
--   ⇒ … (3 more lines)
SQL
# accounting reads on the REPLICA — the role and its GRANTs came with the physical copy
docker exec -i -e PGPASSWORD=ketoan-lab8 pglab8-replica psql -h 127.0.0.1 -U ketoan -d ctshop <<'SQL'
SELECT current_user, pg_is_in_recovery() AS on_replica;
SELECT count(*) AS payments, sum(amount) AS revenue FROM payment;
--   ⇒  current_user | on_replica
--   ⇒ --------------+------------
--   ⇒  ketoan       | t
--   ⇒ (1 row)
--   ⇒  payments |   revenue
--   ⇒ ----------+--------------
--   ⇒      1663 | 946164000.00
--   ⇒ (1 row)
SQL
docker exec -i pglab8-primary psql -U postgres -d ctshop -At -f - < lab8-check.sql > check-primary.txt
docker exec -i pglab8-replica psql -U postgres -d ctshop -At -f - < lab8-check.sql > check-replica.txt
diff check-primary.txt check-replica.txt && echo "✓ replica = primary: $(wc -l < check-primary.txt | tr -d ' ') facts"
#   ⇒ 11c11
#   ⇒ < seq|orders_id_seq|2001
#   ⇒ ---
#   ⇒ > seq|orders_id_seq|2033
# lag while 8 customers order non-stop
docker cp lab8-orders.pgbench pglab8-primary:/tmp/
docker exec pglab8-primary pgbench -U postgres -d ctshop -n -c 8 -j 4 -T 20 -P 5 -f /tmp/lab8-orders.pgbench > pgbench.log 2>&1 &
for i in 1 2 3 4 5 6 7 8 9; do
  sleep 2
  docker exec pglab8-primary psql -U postgres -Atc "SELECT to_char(now(), 'HH24:MI:SS') || ' | behind ' ||
    pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)) || ' | replay_lag ' || coalesce(replay_lag::text, '-')
    FROM pg_stat_replication"
done
wait
grep -E '^progress|^number of transactions actually|^tps' pgbench.log
#   ⇒ 04:27:08 | behind 4272 bytes | replay_lag 00:00:00.018803
#   ⇒ 04:27:10 | behind 5896 bytes | replay_lag 00:00:00.02277
#   ⇒ 04:27:12 | behind 3896 bytes | replay_lag 00:00:00.003348
#   ⇒ 04:27:14 | behind 3368 bytes | replay_lag 00:00:00.018395
#   ⇒ 04:27:17 | behind 4888 bytes | replay_lag 00:00:00.006433
#   ⇒ 04:27:19 | behind 4672 bytes | replay_lag 00:00:00.002267
#   ⇒ … (9 more lines)
# a burst: import 500.000 old orders in ONE statement
docker exec pglab8-primary psql -U postgres -d ctshop -c "\\\\timing on" -c "INSERT INTO shop.orders (customer_id, status, created_at, note)
  SELECT 1 + g % 290, 'shipped', timestamptz '2024-01-01 08:00+07' + g * interval '1 minute', 'import from the old shop'
  FROM generate_series(1, 500000) g" > import.log 2>&1 &
for i in $(seq 1 10); do
  sleep 1
  docker exec pglab8-primary psql -U postgres -Atc "SELECT to_char(now(), 'HH24:MI:SS') || ' | behind ' ||
    pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)) || ' | replay_lag ' || coalesce(replay_lag::text, '-')
    FROM pg_stat_replication"
done
wait; cat import.log
#   ⇒ 04:27:27 | behind 13 MB | replay_lag 00:00:00.127367
#   ⇒ 04:27:28 | behind 24 bytes | replay_lag 00:00:00.360488
#   ⇒ 04:27:29 | behind 24 bytes | replay_lag 00:00:00.360488
#   ⇒ 04:27:31 | behind 24 bytes | replay_lag 00:00:00.360488
#   ⇒ 04:27:32 | behind 24 bytes | replay_lag 00:00:00.360488
#   ⇒ 04:27:33 | behind 24 bytes | replay_lag 00:00:00.360488
#   ⇒ … (7 more lines)
# trap: the "lag" that is not a lag
sleep 20                                  # nobody writes for 20 seconds
docker exec pglab8-replica psql -U postgres -c "SELECT now() - pg_last_xact_replay_timestamp() AS since_last_replayed_commit,
       pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn() AS caught_up"
docker exec pglab8-primary psql -U postgres -c "SELECT pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS bytes_behind, replay_lag
FROM pg_stat_replication"
#   ⇒  since_last_replayed_commit | caught_up
#   ⇒ ----------------------------+-----------
#   ⇒  00:00:21.792544            | t
#   ⇒ (1 row)
#   ⇒  bytes_behind | replay_lag
#   ⇒ --------------+------------
#   ⇒             0 |
#   ⇒ (1 row)

# ───────────────────────────────────────────────────────────────────────────
# N2 — what a replica does NOT give you
# ───────────────────────────────────────────────────────────────────────────
# read-your-writes: idle, then with 8 customers ordering in the background
npm i pg >/dev/null 2>&1          # once
node lab8-ryw.mjs 500
docker exec pglab8-primary pgbench -U postgres -d ctshop -n -c 8 -j 4 -T 25 -f /tmp/lab8-orders.pgbench > pgbench.log 2>&1 &
sleep 2; node lab8-ryw.mjs 500; wait
#   ⇒ 1) read on the replica right after COMMIT    :  121 / 500 orders NOT found
#   ⇒ 2) wait for the replica to reach the commit LSN:    0 / 500 NOT found · wait avg 4.81 ms, p99 24.26 ms, max 27.08 ms
#   ⇒ 3) read your own write from the PRIMARY       :    0 / 500 NOT found
#   ⇒ 1) read on the replica right after COMMIT    :  286 / 500 orders NOT found
#   ⇒ 2) wait for the replica to reach the commit LSN:    0 / 500 NOT found · wait avg 2.03 ms, p99 10.25 ms, max 21.28 ms
#   ⇒ 3) read your own write from the PRIMARY       :    0 / 500 NOT found
# trap: a replication slot keeps WAL for a replica that is gone
docker stop pglab8-replica        # the replica dies (or its network link does) …
#   ⇒ pglab8-replica
docker exec -i pglab8-primary psql -U postgres -d ctshop <<'SQL'
SET search_path = shop;
SELECT slot_name, active, wal_status,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS wal_kept_for_slot
FROM pg_replication_slots;
SELECT pg_size_pretty(sum(size)) AS pg_wal_size, count(*) AS wal_files FROM pg_ls_waldir();
--   ⇒  slot_name | active | wal_status | wal_kept_for_slot
--   ⇒ -----------+--------+------------+-------------------
--   ⇒  replica1  | f      | reserved   | 0 bytes
--   ⇒ (1 row)
--   ⇒  pg_wal_size | wal_files
--   ⇒ -------------+-----------
--   ⇒  160 MB      |        10
--   ⇒ (1 row)
SQL
for night in 1 2 3; do   # three nights of the 02:00 job (it rewrites the 500.000 imported orders) — replica still down
  docker exec pglab8-primary psql -U postgres -d ctshop -qc "UPDATE shop.orders SET note = 'archived, night $night' WHERE created_at < '2025-01-01'"
  docker exec pglab8-primary psql -U postgres -qc "CHECKPOINT"
  docker exec pglab8-primary psql -U postgres -Atc "SELECT 'night $night: the slot keeps ' ||
      pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) || ' · pg_wal = ' ||
      pg_size_pretty((SELECT sum(size) FROM pg_ls_waldir())) FROM pg_replication_slots"
done
#   ⇒ night 1: the slot keeps 125 MB · pg_wal = 288 MB
#   ⇒ night 2: the slot keeps 308 MB · pg_wal = 336 MB
#   ⇒ night 3: the slot keeps 494 MB · pg_wal = 512 MB
docker exec -i pglab8-primary psql -U postgres -d ctshop <<'SQL'
SET search_path = shop;
SHOW max_slot_wal_keep_size;   -- -1 = no limit: one dead replica may fill the disk of the primary
ALTER SYSTEM SET max_slot_wal_keep_size = '1GB';
SELECT pg_reload_conf();
--   ⇒  max_slot_wal_keep_size
--   ⇒ ------------------------
--   ⇒  -1
--   ⇒ (1 row)
--   ⇒ ALTER SYSTEM
--   ⇒  pg_reload_conf
--   ⇒ … (3 more lines)
SQL
docker exec -i pglab8-primary psql -U postgres -d ctshop <<'SQL'
SET search_path = shop;
SHOW max_slot_wal_keep_size;   -- a NEW session sees the reloaded value
-- the alert every replica needs (run it every minute from your monitoring)
SELECT slot_name, active, wal_status,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS kept,
       pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn) > 256 * 1024 * 1024 AS alert,
       pg_size_pretty(safe_wal_size) AS until_slot_is_lost
FROM pg_replication_slots;
--   ⇒  max_slot_wal_keep_size
--   ⇒ ------------------------
--   ⇒  1GB
--   ⇒ (1 row)
--   ⇒  slot_name | active | wal_status |  kept  | alert | until_slot_is_lost
--   ⇒ -----------+--------+------------+--------+-------+--------------------
--   ⇒  replica1  | f      | reserved   | 494 MB | t     | 536 MB
--   ⇒ (1 row)
SQL
docker start pglab8-replica && sleep 5     # the replica comes back and catches up by itself
docker exec pglab8-primary psql -U postgres -c "SELECT slot_name, active, wal_status,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS kept FROM pg_replication_slots" \\
  -c "CHECKPOINT" -c "SELECT pg_size_pretty(sum(size)) AS pg_wal_size, count(*) AS wal_files FROM pg_ls_waldir()"
#   ⇒ pglab8-replica
#   ⇒  slot_name | active | wal_status |  kept
#   ⇒ -----------+--------+------------+---------
#   ⇒  replica1  | t      | reserved   | 0 bytes
#   ⇒ (1 row)
#   ⇒ CHECKPOINT
#   ⇒ … (4 more lines)

# ───────────────────────────────────────────────────────────────────────────
# N2 — failover by hand (what Patroni automates)
# ───────────────────────────────────────────────────────────────────────────
docker stop pglab8-primary         # 14:00 — the primary is gone
docker exec pglab8-replica psql -U postgres -d ctshop -c "SELECT pg_promote()" -c "SELECT pg_is_in_recovery() AS still_replica" \\
  -c "INSERT INTO shop.orders (customer_id, note) VALUES (9, 'after the failover') RETURNING id" \\
  -c "SELECT pg_walfile_name(pg_current_wal_lsn()) AS wal_file   -- 00000002… = timeline 2"
docker logs pglab8-replica 2>&1 | grep -E 'promote|selected new timeline|ready to accept' | tail -n 3
#   ⇒ pglab8-primary
#   ⇒  pg_promote
#   ⇒ ------------
#   ⇒  t
#   ⇒ (1 row)
#   ⇒  still_replica
#   ⇒ … (15 more lines)
docker exec pglab8-replica pg_isready -h pglab8-primary   # the app's connection string still points HERE
#   ⇒ pglab8-primary:5432 - no response

# ───────────────────────────────────────────────────────────────────────────
# CLEAN UP
# ───────────────────────────────────────────────────────────────────────────
bash lab8-docker.sh down
#   ⇒ ✓ removed pglab8-primary, pglab8-replica, their volumes and pglab8-net`;
/* SOL:END */

/* ── Số lấy từ output thật (đổi mỗi lần chạy) — KHÔNG gõ tay ── */
const lay = (k, re, i = 1) => { const m = O[k].match(re); if (!m) throw new Error(`lab-8: không thấy ${re} trong O.${k}`); return m[i]; };
const tatCa = (k, re) => [...O[k].matchAll(new RegExp(re, 'g'))];
const vn = (x, le = 0) => { const [a, b] = Number(x).toFixed(le).split('.'); return a.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (b ? ',' + b : ''); };
const byte = (s) => { const [, n, u] = s.match(/([\d.]+) (bytes|kB|MB|GB)/); return Number(n) * { bytes: 1, kB: 1024, MB: 1048576, GB: 1073741824 }[u]; };
const giay = (t) => { const [h, m, s] = t.split(':'); return Number(h) * 3600 + Number(m) * 60 + Number(s); };
const N = {
  timeout: vn(Number(lay('R1I', /Time: ([\d.]+) ms/)) / 1000, 1),
  dumpKb: vn(Number(lay('B1A', /(\d+) backups\/ctshop\.dump/)) / 1024),
  globalsB: vn(lay('B1A', /(\d+) backups\/globals\.sql/)),
  restoreErr: lay('B1D', /errors ignored on restore: (\d+)/),
  facts: lay('B1G', /identical: (\d+) facts/),
  diffLines: (O.B1E.match(/^[<>] /gm) || []).length,
  deleted: lay('B2A', /DELETE (\d+)/),
  reviewsNow: lay('B2B', /reviews_now\s*\n-+\n\s*(\d+)/),
  reviewsBack: lay('B2I', /reviews_now \| new_ones_kept\s*\n[-+]+\n\s*(\d+)/),
  naiveB: vn(lay('B3A', /(\d+) backups\/daily\/\S+\n/)),
  goodK: lay('B3C', /\.sql\.gz\s+(\S+)\s+·/),
  baseKb: vn(lay('N1A', /(\d+)\/\d+ kB \(100%\), 1\/1/)),
  tps: vn(lay('N1H', /tps = ([\d.]+)/)),
  txN1H: vn(lay('N1H', /actually processed: (\d+)/)),
  maxBehindH: (() => { const a = tatCa('N1H', /behind ([\d.]+ (?:bytes|kB|MB))/).map((m) => m[1]); return a.sort((x, y) => byte(y) - byte(x))[0]; })(),
  maxLagH: vn(Math.max(...tatCa('N1H', /replay_lag (\d\d:\d\d:[\d.]+)/).map((m) => giay(m[1]))) * 1000, 1),
  maxBehindI: (() => { const a = tatCa('N1I', /behind ([\d.]+ (?:bytes|kB|MB))/).map((m) => m[1]); return a.sort((x, y) => byte(y) - byte(x))[0]; })(),
  maxLagI: vn(Math.max(...tatCa('N1I', /replay_lag (\d\d:\d\d:[\d.]+)/).map((m) => giay(m[1]))) * 1000, 0),
  importS: vn(Number(lay('N1I', /Time: ([\d.]+) ms/)) / 1000, 1),
  idleS: vn(giay(lay('N1J', /\n\s*(\d\d:\d\d:[\d.]+)\s*\|/)), 0),
  rywIdle: lay('N2A', /right after COMMIT\s*:\s*(\d+) \//),
  rywLoad: tatCa('N2A', /right after COMMIT\s*:\s*(\d+) \//)[1][1],
  rywN: lay('N2A', /right after COMMIT\s*:\s*\d+ \/ (\d+)/),
  rywWait: vn(tatCa('N2A', /wait avg ([\d.]+) ms/)[1][1], 1),
  rywMax: vn(tatCa('N2A', /max ([\d.]+) ms/)[1][1], 0),
  prismaMiss: lay('N2B', /then findUnique\(\)\s*:\s*(\d+) \//),
  prismaN: lay('N2B', /then findUnique\(\)\s*:\s*\d+ \/ (\d+)/),
  slot3: lay('N2E', /night 3: the slot keeps ([\d.]+ \w+)/),
  wal0: lay('N2D', /pg_wal_size \| wal_files\s*\n[-+]+\n\s*(\S+ \w+)/),
  wal3: lay('N2E', /night 3:[^\n]*pg_wal = ([\d.]+ \w+)/),
  walAfter: lay('N2H', /pg_wal_size \| wal_files\s*\n[-+]+\n\s*(\S+ \w+)/),
};

/* Prisma 5.22 + @prisma/extension-read-replicas 0.3.0 chạy thật (scratchpad lab8/node, src/khung/pg/that/pg-lab-8.out.txt N2B). */
const PRISMA_CODE = `// npm i @prisma/extension-read-replicas@0.3   (0.4+ needs Prisma 6)
import { PrismaClient } from '@prisma/client';
import { readReplicas } from '@prisma/extension-read-replicas';

const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL })   // the primary  :5481
  .$extends(readReplicas({ url: process.env.REPLICA_URL }));                   // the replica  :5482

await prisma.orders.findMany({ take: 20 });             // a model READ        → a replica
await prisma.orders.create({ data: { customer_id: 7 } }); // a write             → the primary
await prisma.$primary().orders.findUnique({ where: { id } }); // "I just wrote it" → the primary
await prisma.$transaction([...]);                         // transactions        → the primary
await prisma.$queryRaw\`SELECT …\`;                        // raw SQL             → the primary (in 0.3)`;
const ENV_CODE = `# .env of the app
DATABASE_URL="postgresql://ctshop_app:…@db-primary:5432/ctshop?schema=shop"
REPLICA_URL="postgresql://ctshop_app:…@db-replica:5432/ctshop?schema=shop"
# what accounting puts in DBeaver / Metabase / Excel (Power Query): the REPLICA, its own login
postgresql://ketoan:…@db-replica:5432/ctshop?options=-c%20statement_timeout%3D60s`;

const FILES = (vi) => [
  [`${F}/lab8-start.sql`, '🧩', 'lab8-start.sql', vi ? 'CT Shop sạch, cỡ chuẩn (lược đồ + dữ liệu chuẩn, 2.000 đơn) + danh sách việc R1, B1–B3, N1–N2 — nạp vào máy chính' : 'A clean CT Shop at its standard size (standard schema + data, 2.000 orders) + the R1, B1–B3, N1–N2 to-do list — load it into the primary'],
  [`${F}/lab8-docker.sh`, '🐳', 'lab8-docker.sh', vi ? 'Dựng hai máy chủ PostgreSQL 17 trên laptop: up · replica (dựng lại máy thứ hai thành bản sao streaming) · status · down. macOS / Linux / Windows WSL' : 'Two PostgreSQL 17 servers on your laptop: up · replica (rebuild the second one as a streaming replica) · status · down. macOS / Linux / Windows WSL'],
  [`${F}/lab8-check.sql`, '🧾', 'lab8-check.sql', vi ? 'Dấu vân tay của CSDL: số dòng + md5 mọi dòng từng bảng, sequence, quyền, role — chạy ở hai máy rồi diff' : 'A database fingerprint: row count + md5 of every row per table, sequences, privileges, roles — run it on two servers, then diff'],
  [`${F}/lab8-backup.sh`, '✅', 'lab8-backup.sh', vi ? 'Script sao lưu không biết nói dối: pipefail, gzip -t, dòng "dump complete", tên tạm, xoay vòng chỉ sau khi thành công' : 'A backup script that cannot lie: pipefail, gzip -t, the "dump complete" line, a temporary name, rotation only after success'],
  [`${F}/lab8-backup-naive.sh`, '⚠️', 'lab8-backup-naive.sh', vi ? 'Script ngây thơ (kiểu gặp trên rất nhiều máy chủ thật) — chạy để xem nó báo thành công trong khi xoá sạch bản tốt' : 'The naive script (the kind found on many real servers) — run it to watch it report success while it deletes your good backups'],
  [`${F}/lab8-orders.pgbench`, '🛒', 'lab8-orders.pgbench', vi ? 'Kịch bản pgbench: mỗi giao dịch là một khách đặt một đơn (orders + order_item) — tải ghi để đo độ trễ' : 'A pgbench script: each transaction is one customer placing one order (orders + order_item) — write load for the lag measurements'],
  [`${F}/lab8-ryw.mjs`, '🔁', 'lab8-ryw.mjs', vi ? 'Node: ghi ở máy chính rồi đọc ở bản sao ngay — đếm số đơn "chưa thấy", và hai cách sửa' : 'Node: write on the primary, read on the replica straight away — count the orders "not there yet", and two fixes'],
  [`${F}/lab8-solution.sh`, '🔑', 'lab8-solution.sh', vi ? 'Mọi lệnh của lab theo thứ tự, mỗi lệnh kèm output thật — chạy được từ đầu tới cuối; mở sau khi tự làm' : 'Every command of the lab in order, each with its real output — runnable top to bottom; open it after your own attempt'],
].map(([h, i, t, s]) => card(h, i, t, s, vi ? 'TẢI VỀ →' : 'DOWNLOAD →')).join('\n');

const lenh = (k) => code(LG[k] === 'sql' && AI[k] !== 'pglab8-primary · postgres' ? `-- psql on ${AI[k]}\n${Q[k]}` : Q[k], LG[k]);
const qo = (...keys) => keys.map((x) => lenh(x) + out(O[x])).join('\n');
const ans = (lang, k, keys, sau = '') => details(lang === 'en' ? `Answer — ${k}` : `Đáp án — ${k}`, qo(...keys) + (sau ? `<p>${sau}</p>` : ''));
const bay = (tieuDe, chu, keys) => `<div class="pitfall"><p><strong>${tieuDe}</strong> ${chu}</p></div>
${qo(...keys)}`;

const RUBRIC = (vi) => `<table>
<tr><th>${vi ? 'Phần' : 'Part'}</th><th>${vi ? 'Điểm' : 'Points'}</th><th>${vi ? 'Chấm khi' : 'Awarded when'}</th></tr>
<tr><td>R1</td><td>2</td><td>${vi ? 'report_ro (NOLOGIN) + ketoan (LOGIN, thành viên); ma trận quyền 8 bảng × SELECT = t, còn lại f; ghi thử bị từ chối bằng GRANT chứ không chỉ bằng read-only; bảng tạo sau (cả bảng do ctshop_app tạo) đọc được nhờ ALTER DEFAULT PRIVILEGES' : 'report_ro (NOLOGIN) + ketoan (LOGIN, member); the privilege matrix 8 tables × SELECT = t, everything else f; a write refused by GRANT, not only by read-only; tables created later (also by ctshop_app) readable through ALTER DEFAULT PRIVILEGES'}</td></tr>
<tr><td>B1</td><td>2</td><td>${vi ? 'dump -Fc + globals; khôi phục ở máy thứ hai; diff dấu vân tay bắt được lần khôi phục thiếu quyền; lần đúng (globals trước) diff RỖNG' : 'dump -Fc + globals; restore on the second server; the fingerprint diff catches the restore without privileges; the right one (globals first) gives an EMPTY diff'}</td></tr>
<tr><td>B2</td><td>2</td><td>${vi ? 'lấy lại đúng ' + '78' + ' đánh giá đã xoá qua bảng tạm (pg_restore -f -), OVERRIDING SYSTEM VALUE, 2 đánh giá mới vẫn còn; giải thích vì sao --data-only thẳng vào bảng thật hỏng' : 'exactly the 78 deleted reviews back through a staging table (pg_restore -f -), OVERRIDING SYSTEM VALUE, the 2 new reviews kept; why --data-only straight into the live table fails'}</td></tr>
<tr><td>B3</td><td>1</td><td>${vi ? 'chỉ ra script ngây thơ báo ✅ và để lại tệp 20 byte, xoá bản tốt; lab8-backup.sh thoát 1 khi máy chủ tắt / sai tên DB, không đụng bản cũ' : 'the naive script shown printing ✅, leaving 20-byte files and deleting the good ones; lab8-backup.sh exits 1 with the server down / a wrong DB name and leaves the old backups alone'}</td></tr>
<tr><td>N1</td><td>2</td><td>${vi ? 'bản sao streaming (pg_stat_replication streaming, slot active); ghi/đọc/từ chối ghi; ketoan đọc trên bản sao; độ trễ nêu bằng BYTE và GIÂY dưới tải; giải thích chênh sequence +32 và "giây từ commit cuối" khi rảnh' : 'a streaming replica (pg_stat_replication streaming, slot active); write/read/refused write; ketoan reads on the replica; lag stated in BYTES and SECONDS under load; the +32 sequence difference and "seconds since last commit" when idle explained'}</td></tr>
<tr><td>N2</td><td>1</td><td>${vi ? 'đo được read-your-writes và hai cách sửa; slot giữ WAL khi bản sao chết + max_slot_wal_keep_size + cảnh báo; failover pg_promote và nêu được vì sao cần công cụ' : 'read-your-writes measured with two fixes; a dead replica’s slot keeping WAL + max_slot_wal_keep_size + an alert; a pg_promote failover and why tools exist'}</td></tr>
</table>`;

const EN = `
<div class="ml-en">
<span class="eyebrow">Lab 8 · CT Shop · after Chapter 15</span>
<h2>A backup that restores, an account that only reads, a second server that follows</h2>
<p class="lead">Seven labs built CT Shop: the tables, the data, the reports, the indexes, a safe checkout, a search box. Next month it goes to production — and then the questions change. If the disk dies tonight, what do we lose? Can accounting run its reports without being able to break anything? If the server goes down, is there another one? This lab answers the three with two PostgreSQL servers on your laptop, real failures, and numbers you can check.</p>

<h3>1 · The brief</h3>
<p>The ticket from the CT Shop team, addressed to you, the person in charge of the data:</p>
<ul>
<li><strong>Accounting</strong> needs its own login: read every table, change nothing, and a runaway report must not hurt the shop. Tables added next month must be readable too.</li>
<li><strong>Backups</strong>: a nightly backup — and the <em>proof</em> that it restores, on another machine, with nothing missing. Not “the file is there”.</li>
<li>An <strong>incident drill</strong>: a clean-up script deletes the reviews of a whole category at 10:05. Bring back exactly those rows; the reviews written since must survive.</li>
<li>The <strong>backup script</strong> must never report success when it failed.</li>
<li>A <strong>replica</strong>: a second server that follows the primary, for the reports — and how far behind it is, in bytes and in seconds.</li>
<li>Know the <strong>traps</strong> of a replica before the developers find them in production: a page that cannot find the order it just saved, a disk filled by a replica that died, a failover by hand.</li>
</ul>
<p>Tools: Chapter 15 — <code>pg_dump</code>, <code>pg_restore</code>, <code>pg_dumpall --globals-only</code> and their traps (15.1), WAL and LSNs (15.2), <code>pg_basebackup -R</code>, <code>pg_stat_replication</code>, replication slots, lag and <code>pg_promote</code> (15.3) — plus <code>pgbench</code> and the monitoring views of Chapter 14. New pieces are explained where they appear: group roles, <code>ALTER ROLE … SET</code>, <code>has_table_privilege</code>, <code>ALTER DEFAULT PRIVILEGES</code>, <code>\\drg</code> <code>\\drds</code> <code>\\ddp</code>, <code>pg_restore -f -</code>, <code>OVERRIDING SYSTEM VALUE</code>, <code>--checkpoint=fast</code>, <code>max_slot_wal_keep_size</code> and <code>safe_wal_size</code>, <code>pg_last_wal_replay_lsn()</code>, the Prisma read-replicas extension.</p>
<p>Chapter 15 showed each tool once, on its own. Here they run in the order a real team needs them, on CT Shop, and every claim is <em>checked</em> by a query or a <code>diff</code> — that is the habit this lab is about.</p>

<h3>2 · Requirements and pass criteria</h3>
<ol>
<li><strong>R1</strong> — a group role <code>report_ro</code> and a person <code>ketoan</code>: read the 8 tables, nothing else; per-role defaults; a table created later — by postgres <em>or by the app’s role</em> — readable too.</li>
<li><strong>B1</strong> — <code>pg_dump -Fc</code> + <code>pg_dumpall --globals-only</code>; restore on the second server; prove it with <code>lab8-check.sql</code> + <code>diff</code>.</li>
<li><strong>B2</strong> — the incident: bring back exactly the deleted rows from the dump, without losing the new ones.</li>
<li><strong>B3</strong> — the nightly script: watch the naive one lie; use one that cannot.</li>
<li><strong>N1</strong> — a streaming replica; write here, read there; accounting on the replica; lag under load and during a 500.000-row import.</li>
<li><strong>N2</strong> — read-your-writes, a dead replica’s slot, a manual failover.</li>
</ol>
<div class="callout ok"><p><strong>You pass when:</strong> the privilege matrix shows <code>ketoan</code> with SELECT on <strong>8/8</strong> tables and INSERT/UPDATE/DELETE/TRUNCATE on <strong>0/8</strong> · a write by <code>ketoan</code> is refused even after <code>SET default_transaction_read_only = off</code> · <code>diff</code> of the two fingerprints prints <strong>nothing</strong> after the restore (${N.facts} facts) · the review count goes ${N.reviewsNow} → <strong>${N.reviewsBack}</strong> with the 2 new reviews kept · <code>lab8-backup.sh</code> exits <strong>1</strong> with the server stopped and the 3 good backups are still there · <code>pg_stat_replication</code> shows <code>streaming</code> and the replica’s fingerprint equals the primary’s except the sequence line · you can state the lag under load in bytes and milliseconds, and say why “seconds since the last replayed commit” said ${N.idleS} s while the replica was fully caught up.</p></div>
<p><strong>Times, LSNs and byte counts on your machine will differ</strong>. Judge by what does not change: row counts, the errors, the empty diff, exit codes, which server answers.</p>
<h4>Rubric (10 points)</h4>
${RUBRIC(false)}

<h3>3 · Downloads and setup</h3>
${FILES(false)}
<p>Put the files in an empty folder and open a terminal there (Windows: a WSL or Git Bash terminal; Docker Desktop running). <code>lab8-docker.sh up</code> creates a private Docker network and two PostgreSQL 17 servers: <code>pglab8-primary</code> on <code>localhost:5481</code> and <code>pglab8-replica</code> on <code>localhost:5482</code>. For now the second one is just an empty server — in B1 it plays “another machine” for the restore test; in N1 it is wiped and rebuilt as a replica.</p>
${qo('S0A', 'S0B')}
<p class="meo">💡 The script waits with <code>pg_isready -h 127.0.0.1</code>, not the socket: on its first start the image runs a temporary, socket-only server to create the database, then restarts — a script that connects too early hits that restart. Both containers run with <code>TZ=Asia/Ho_Chi_Minh</code>, so times already print in Vietnamese time.</p>
<p>The SQL steps below are typed in psql. Open it on the primary with <code>docker exec -it pglab8-primary psql -U postgres -d ctshop</code> and run <code>SET search_path = shop;</code> once. A step that runs somewhere else says so on its first line (<code>-- psql on pglab8-replica · ketoan</code>); shell steps run in your terminal, in the lab folder.</p>

<h3>4 · Step by step</h3>

<h4>R1 — an account for accounting that can only read</h4>
<p class="meo">💡 Two kinds of roles. A <strong>group role</strong> (NOLOGIN) holds privileges and nobody logs in as it; a <strong>person</strong> (LOGIN) is a member and inherits them. When a second accountant joins, you create one LOGIN role <code>IN ROLE report_ro</code> — no GRANT to repeat, nothing to forget.</p>
${qo('R1A', 'R1B')}
<p><strong>New: <code>ALTER ROLE … SET</code></strong> stores a setting that every session of that role starts with. psql shows memberships with <code>\\drg</code> and those settings with <code>\\drds</code>:</p>
${qo('R1C')}
<p>Never check privileges by trying a few queries. <strong>New: <code>has_table_privilege(role, table, privilege)</code></strong> answers for every table at once — this matrix is the pass criterion of R1:</p>
${qo('R1D')}
<p>Now log in <em>as</em> <code>ketoan</code> — with a password, over TCP, like the accounting tool will:</p>
${qo('R1E', 'R1F', 'R1G')}
${bay('Trap — default_transaction_read_only is not a wall.', 'The first refusal came from the read-only <em>default</em>. Any user may switch it off in their own session. What stops the write then is the missing GRANT — and since PostgreSQL 15 nobody may CREATE in schema <code>public</code> unless granted:', ['R1H'])}
<p>So: privileges are the wall, the read-only default is a seat belt against accidents. The same is true of the timeout:</p>
${qo('R1I', 'R1J')}
<p>The runaway report was cancelled after ${N.timeout} s — but <code>statement_timeout</code> is also only a default: <code>ketoan</code> can set it to 0. On the primary a heavy report still competes with checkout for CPU and disk. The real protection is to run reports somewhere else — the replica of N1.</p>
${bay('Trap — GRANT … ON ALL TABLES is a one-off.', 'It granted the 8 tables that existed at that moment. Next week a developer adds <code>coupon</code>:', ['R1K', 'R1L'])}
<p><strong>New: <code>ALTER DEFAULT PRIVILEGES</code></strong> adds privileges to tables created <em>from now on</em> (<code>\\ddp</code> lists them). The table that already exists still needs its own GRANT:</p>
${qo('R1M', 'R1N')}
${bay('Trap — default privileges belong to the role that creates the table.', 'The default above says “tables created <strong>by postgres</strong>”. In production the app’s migrations create the tables, as the app’s own role. One more table, created by <code>ctshop_app</code>:', ['R1O', 'R1P'])}
<p>Declare a default for that role too (<code>FOR ROLE ctshop_app</code>) — you will see two rows in <code>\\ddp</code>, one per creator:</p>
${qo('R1Q', 'R1R', 'R1S')}

<h4>B1 — back up, then prove it restores somewhere else</h4>
<p class="meo">💡 Two files make a backup of a database: the dump (data, schema, GRANTs) and the <strong>globals</strong> — roles and their passwords, which belong to the whole server and are never in a pg_dump (lesson 15.1). The custom format <code>-Fc</code> is compressed and lets <code>pg_restore</code> pick pieces.</p>
${qo('B1A', 'B1B')}
<p>Note what <code>globals.sql</code> holds: every role with its SCRAM password <em>hash</em>. It is as sensitive as a password file — <code>chmod 600</code>, never in git. The dump’s table of contents, counted by kind:</p>
${qo('B1C')}
<p>8 tables and 8 TABLE DATA entries, 23 constraints, 7 sequence values, 9 ACL entries (the GRANTs on the schema and the 8 tables) and the 2 default privileges of R1. Now the restore test, on the second server — first the way that looks fine:</p>
${qo('B1D')}
<p>${N.restoreErr} errors, exit code 1, and a database that <em>looks</em> complete. Would you have noticed? Do not compare by eye — compare everything, mechanically. <code>lab8-check.sql</code> prints one line per fact: each table’s row count and the md5 of all its rows in primary-key order, each sequence, each table’s ACL, each role. Run it on both servers and let <code>diff</code> judge:</p>
${qo('B1E')}
<p>${N.diffLines} different lines, and none of them about rows: every table has the same count and the same md5. What is missing are the privileges and the roles — on this server accounting could not read anything. The right order is globals <strong>first</strong>, then the dump, with <code>--exit-on-error</code> so a problem stops the restore instead of hiding in a warning:</p>
${qo('B1F', 'B1G')}
<p>The one error (<code>role "postgres" already exists</code>) is expected and harmless: the globals file always creates the superuser. An empty <code>diff</code> over ${N.facts} facts is the proof the ticket asked for. Put this test on a schedule — a backup that has never been restored is only a file.</p>

<h4>B2 — an incident: bring back exactly the rows that were lost</h4>
<p>10:05, a clean-up script meant for discontinued notebooks runs with the wrong filter. 10:20, two customers write new reviews. The last backup is the dump of B1.</p>
${qo('B2A', 'B2B')}
${bay('Trap — restoring the table’s data into the live table.', 'The obvious repair is <code>pg_restore --data-only -t review</code>. The dump’s data is one <code>COPY</code> of all 678 rows; the first row that still exists breaks it, and a failed COPY inserts nothing:', ['B2C'])}
<p>And restoring the whole table from the dump would throw away the 2 reviews of 10:20. The repair has to <em>pick</em> rows. <strong>New: <code>pg_restore -f -</code></strong> writes the SQL of the selected objects to standard output instead of into a database — here the <code>COPY … FROM stdin</code> block of the reviews. Load it into a staging table with the same columns:</p>
${qo('B2D', 'B2E', 'B2F', 'B2G')}
<p>678 rows in the backup, ${N.deleted} of them missing now — all in category 9. Copy those back:</p>
${qo('B2H')}
<p><strong>New: <code>OVERRIDING SYSTEM VALUE</code>.</strong> <code>id</code> is <code>GENERATED ALWAYS AS IDENTITY</code>, so PostgreSQL refuses an explicit id — unless you say you mean it. Keep the original ids: links, notifications or other tables may point to them.</p>
${qo('B2I')}
<p>${N.reviewsNow} → ${N.reviewsBack}: the ${N.deleted} lost reviews are back with their ids and dates, and the 2 new ones are still there. In real life also write down the time window and what was done — and look for the script, not only its damage.</p>

<h4>B3 — the backup script: one that lies, one that cannot</h4>
<p>This is the script found on a great many real servers — it was, for a while, the script of a real project this course knows well:</p>
${code(`DIR=./backups/daily
KEEP=3
mkdir -p $DIR
docker exec pglab8-primary pg_dump -U postgres -d ctshop | gzip > $DIR/ctshop-$(date +%Y%m%d-%H%M%S).sql.gz
ls -1t $DIR/ctshop-*.sql.gz | tail -n +$((KEEP + 1)) | xargs rm -f      # keep the 3 newest
echo "✅ backup OK: $(ls -1t $DIR | head -1)"`, 'bash')}
<p>Three nights with the server up:</p>
${qo('B3A')}
<p>Now three nights with the database server down:</p>
${qo('B3B')}
${bay('Trap — success, three times, and nothing left.', 'Each night <code>pg_dump</code> failed, but a pipeline returns the exit code of its LAST command — gzip, which happily compressed nothing into a 20-byte file. Cron saw 0, the log says ✅, and the rotation, doing its job, deleted the three good backups. After three bad nights the newest real backup is gone; nobody notices until the day it is needed. (Lesson 15.1 showed the 20-byte file; the rotation is what turns it into a disaster.)', [])}
<p><code>lab8-backup.sh</code> changes five things: <code>set -euo pipefail</code> (a failing <code>pg_dump</code> fails the line), <code>gzip -t</code> (the file is a complete gzip stream), the <em>last lines</em> of the dump must contain <code>PostgreSQL database dump complete</code> (pg_dump writes it only when it finished), a temporary <code>.part</code> name until all checks pass, and rotation <strong>last</strong> — only after a new good backup exists.</p>
${code(`set -euo pipefail
…
docker exec "$CONTAINER" pg_dump -U postgres -d "$DB" | gzip > "$TMP" || fail "pg_dump | gzip returned an error"
gzip -t "$TMP"                                                          || fail "the gzip file is corrupt"
gzip -dc "$TMP" | tail -n 10 | grep -q 'PostgreSQL database dump complete' || fail "the dump is incomplete"
mv "$TMP" "$OUT"                                                        # only a checked file gets its real name
ls -1t "$DIR"/ctshop-*.sql.gz | tail -n +$((KEEP + 1)) | xargs rm -f --   # rotation LAST`, 'bash')}
${qo('B3C', 'B3D', 'B3E', 'B3F')}
<p>Server down: exit 1, an explicit message, the 3 good backups untouched, no half-written file. A typo in the database name: the same. A copy cut short: <code>gzip -t</code> refuses it. In production add three things the lab cannot show: a copy <strong>off</strong> the machine (another disk, object storage), an alert when the script exits non-zero (cron mails, a health-check ping), and — Chapter 15.2 — WAL archiving, because a nightly dump still loses up to 24 hours.</p>

<h4>N1 — a streaming replica for the reports</h4>
<p class="meo">💡 <code>lab8-docker.sh replica</code> does what lesson 15.3 did by hand: a role with REPLICATION, a <code>pg_hba.conf</code> line for it (<code>samenet</code> = the Docker network), then <code>pg_basebackup</code> into the replica’s empty volume. <code>-R</code> writes <code>standby.signal</code> + the connection to the primary, <code>-X stream</code> copies the WAL written during the copy, <code>-C -S replica1</code> creates the slot. <strong>New: <code>--checkpoint=fast</code></strong>: without it pg_basebackup waits for the next scheduled checkpoint — up to <code>checkpoint_timeout</code> (5 minutes) on a quiet server.</p>
${qo('N1A', 'N1B')}
<p>${N.baseKb} kB copied in a few seconds. Is it really following? Ask the primary:</p>
${qo('N1C')}
<p><code>state = streaming</code>, the four LSNs equal, the slot active. Write on one, read on the other:</p>
${qo('N1D', 'N1E')}
<p>Accounting now connects to the <strong>replica</strong>. Nothing to create there: a physical replica is a byte copy of the whole server, roles and GRANTs included — and nothing it does can slow down checkout:</p>
${qo('N1F')}
<p>And the fingerprint of the replica against the primary:</p>
${qo('N1G')}
<p>Every table, ACL and role is identical; one line differs — and it is not a bug. PostgreSQL logs sequence values to WAL <strong>32 at a time</strong> (it would be too slow to log every <code>nextval</code>), so a replica that replays the WAL sees the sequence 32 ahead. After a failover, the new primary continues from 2033: ids 2002–2032 are never used. Gaps in identity columns are normal — never build logic (“invoice numbers without holes”) on them.</p>
<h4>N1 — how far behind is it?</h4>
<p>Two numbers on the primary’s <code>pg_stat_replication</code>: <strong>bytes</strong> not yet replayed, <code>pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)</code>, and <strong>time</strong>, <code>replay_lag</code> (how long ago the replica confirmed a commit it has now replayed). Eight customers ordering non-stop with <code>lab8-orders.pgbench</code>, sampled every 2 seconds:</p>
${qo('N1H')}
<p>${N.txN1H} orders in 20 s (${N.tps} per second): the replica never fell more than ${N.maxBehindH} behind, and at most ${N.maxLagH} ms. Now a burst — importing 500.000 old orders from the previous system in one statement:</p>
${qo('N1I')}
<p>The import took ${N.importS} s; the replica was at most ${N.maxBehindI} and ${N.maxLagI} ms behind, then back to 0. On one laptop the network is free and the replica idle: lag is milliseconds. On real servers it grows with the network, the replica’s disk, and long queries on the replica (they can pause replay — lesson 15.3). That is why you <em>measure</em> it, and alert on it.</p>
${bay('Trap — the “lag” that is not a lag.', 'A popular check is <code>now() - pg_last_xact_replay_timestamp()</code> on the replica: “seconds since the last replayed commit”. Nobody writes for 20 seconds:', ['N1J'])}
<p>${N.idleS} seconds of “lag” on a replica that is fully caught up — the primary simply had nothing to send. An alert on that value wakes someone at 3 a.m. for nothing. Alert on bytes (primary side), or check <code>pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn()</code> first; <code>replay_lag</code> becomes NULL when there is nothing to replay.</p>

<h4>N2 — what a replica does not give you</h4>
<p class="meo">💡 A checkout writes the order on the primary, then the “thank you” page reads it — from the replica, because the developers routed all reads there. <code>lab8-ryw.mjs</code> (Node + <code>pg</code>) measures it ${N.rywN} times, idle, then with pgbench in the background.</p>
${qo('N2A')}
${bay('Trap — read-your-writes.', `${N.rywIdle} of ${N.rywN} orders were not on the replica a moment after their COMMIT returned, idle; ${N.rywLoad} under load. Asynchronous replication means exactly that: the primary does not wait. The two fixes in the script: <strong>wait</strong> until the replica has replayed past the LSN taken after the commit (<code>pg_last_wal_replay_lsn() &gt;= $1</code>) — ${N.rywWait} ms on average under load, up to ${N.rywMax} ms — or, simpler and what most apps do, send the reads that follow a write to the <strong>primary</strong>.`, [])}
<p>In a Prisma app the official extension routes model reads to replicas and everything else to the primary:</p>
${code(PRISMA_CODE, 'ts')}
${out(O.N2B)}
<p>Run for real (Prisma 5.22, extension 0.3.0): ${N.prismaMiss} of ${N.prismaN} orders created by <code>create()</code> were not found by the <code>findUnique()</code> right after it — the same race, now inside an ORM. <code>$primary()</code>: 0. Note that in this version <code>$queryRaw</code> goes to the primary. And the connection strings — the app gets two, accounting gets its own login on the replica:</p>
${code(ENV_CODE, 'bash')}
${bay('Trap — a slot keeps WAL for a replica that is gone.', 'The slot of N1 promises the primary will keep every WAL file the replica has not received. Stop the replica, and let the 02:00 job run for three nights:', ['N2C', 'N2D', 'N2E'])}
<p>${N.slot3} held for a replica that is not there, and <code>pg_wal</code> went ${N.wal0} → ${N.wal3} — even <code>CHECKPOINT</code> cannot remove what the slot pins. Without a limit it grows until the primary’s disk is full, and then the <em>primary</em> stops. <strong>New: <code>max_slot_wal_keep_size</code></strong> caps it (the slot is marked <code>lost</code> instead — lesson 15.3 showed that), and <code>safe_wal_size</code> says how much room is left:</p>
${qo('N2F', 'N2G', 'N2H')}
<p>The replica came back and caught up by itself (slot active, 0 bytes kept). <code>pg_wal</code> does not shrink at once (${N.walAfter}): old segments are recycled for future WAL and trimmed over the next checkpoints, bounded by <code>max_wal_size</code>.</p>

<h4>N2 — failover by hand, and why tools exist</h4>
${qo('N2I', 'N2J')}
<p><code>pg_promote()</code> turned the replica into a primary on a new timeline in a second; it accepts writes. But look at what was <em>not</em> done: the app still points at <code>pglab8-primary</code> (connection refused), nobody checked how much the replica was behind when the primary died (async ⇒ the last transactions may be lost), and if the old primary comes back it believes it is still the primary — split brain, lesson 15.3. Doing those three right every time, at 3 a.m., is the job of a tool: <strong>Patroni</strong> (leader election through etcd/Consul, fencing, rewinding the old primary) plus a stable address (HAProxy, PgBouncer, a virtual IP or DNS), or a managed service that does it for you.</p>
${qo('N2K')}

<h3>5 · Self-check</h3>
<ol>
<li>After <code>SET default_transaction_read_only = off</code>, why can <code>ketoan</code> still not insert an order — and why is that the right design?</li>
<li>The restore of B1 printed ${N.restoreErr} errors, yet every table had the right number of rows and the same md5. What was missing, and which command order fixes it?</li>
<li>A dashboard shows replica lag = ${N.idleS} s at 03:00 while <code>pg_stat_replication</code> shows 0 bytes behind. Is the replica late?</li>
</ol>
${details('Answers', `<ol><li>The read-only setting is a per-session default any user may change; the wall is the missing INSERT privilege (only SELECT was granted to report_ro). Security must not depend on a setting the user controls.</li><li>The roles (report_ro, ketoan, ctshop_app) and therefore every GRANT: roles live in the globals, not in a pg_dump. Run globals.sql first, then pg_restore — and compare with lab8-check.sql + diff, not by eye.</li><li>No. now() − pg_last_xact_replay_timestamp() is the time since the last replayed COMMIT; when the primary is idle it grows while the replica is fully caught up. Use bytes behind / replay_lag, or check receive LSN = replay LSN first.</li></ol>`)}

<h3>6 · Full solution</h3>
${details('Show the whole lab8-solution.sh', code(SOL, 'bash'))}

<h3>7 · Traps</h3>
<div class="pitfall"><p><strong>Read-only by setting only</strong> — <code>default_transaction_read_only</code> and <code>statement_timeout</code> are defaults the user may change. GRANT only what is needed.</p></div>
<div class="pitfall"><p><strong><code>GRANT … ON ALL TABLES</code> once</strong> — new tables are not covered. <code>ALTER DEFAULT PRIVILEGES</code>, for every role that creates tables (<code>FOR ROLE ctshop_app</code>).</p></div>
<div class="pitfall"><p><strong>A dump without its globals</strong> — the data restores, the roles and GRANTs do not. Back up <code>pg_dumpall --globals-only</code> too, restore it first, protect it like passwords.</p></div>
<div class="pitfall"><p><strong>Checking a restore by eye</strong> — ${N.restoreErr} errors hid behind correct row counts. Fingerprint both sides and <code>diff</code>.</p></div>
<div class="pitfall"><p><strong><code>pg_restore --data-only -t</code> into a live table</strong> — one existing row fails the whole COPY. Restore into a staging table, insert the missing rows, <code>OVERRIDING SYSTEM VALUE</code> for identity ids.</p></div>
<div class="pitfall"><p><strong><code>pg_dump | gzip</code> without pipefail, rotation first</strong> — ✅ and 20-byte files while the good backups are deleted. Check, rename, rotate — in that order.</p></div>
<div class="pitfall"><p><strong>pg_basebackup “hangs”</strong> — it is waiting for a checkpoint. <code>--checkpoint=fast</code>.</p></div>
<div class="pitfall"><p><strong>Comparing sequences on a replica</strong> — 32 ahead by design; gaps after a failover are normal.</p></div>
<div class="pitfall"><p><strong>Lag = now() − last replay timestamp</strong> — grows when the primary is idle. Use bytes / <code>replay_lag</code>.</p></div>
<div class="pitfall"><p><strong>Reading your own write from a replica</strong> — not there yet in ${N.rywIdle}/${N.rywN} cases here. Read from the primary after a write (<code>$primary()</code>), or wait for the LSN.</p></div>
<div class="pitfall"><p><strong>A slot with no limit</strong> — a dead replica fills the primary’s disk. <code>max_slot_wal_keep_size</code> + an alert on kept bytes; drop slots of replicas that are gone.</p></div>
<div class="pitfall"><p><strong>Failover by hand in production</strong> — the app’s address, lost transactions, split brain. Patroni (or a managed service) + a stable address.</p></div>

<h3>8 · Extra challenge — and next</h3>
<ul>
<li><strong>Challenge 1</strong> — make the replica synchronous for one minute (<code>synchronous_standby_names</code>, lesson 15.3), run <code>lab8-ryw.mjs</code> again with <code>synchronous_commit = remote_apply</code> set in the app’s session: how many misses now, and what does each order cost in latency?</li>
<li><strong>Challenge 2</strong> — extend <code>lab8-backup.sh</code> with a weekly <em>restore test</em>: restore the newest backup into a throw-away container, run <code>lab8-check.sql</code> on it and on the primary, and exit 1 if the table lines differ.</li>
<li><strong>Challenge 3</strong> — rebuild the old primary as a replica of the new one after N2 (hint: <code>pg_rewind</code> needs <code>wal_log_hints</code> or data checksums — or simply a new <code>pg_basebackup</code>).</li>
</ul>
<p>Chapter 16 brings everything into the app: Prisma migrations against a real schema, connection pools, and the production checklist — backups, roles and replicas from this lab are three of its lines. Lab 9 is the capstone: a Node + Prisma app on CT Shop.</p>
</div>
`;

const VI = `
<div class="ml-vi">
<span class="eyebrow">Lab 8 · CT Shop · sau Chương 15</span>
<h2>Bản sao lưu khôi phục được, tài khoản chỉ đọc, máy thứ hai chạy theo</h2>
<p class="lead">Bảy lab đã dựng nên CT Shop: bảng, dữ liệu, báo cáo, chỉ mục, thanh toán an toàn, ô tìm kiếm. Tháng sau nó lên production — và câu hỏi đổi khác. Đêm nay ổ đĩa chết thì mất gì? Kế toán chạy báo cáo mà không thể làm hỏng gì được không? Máy chủ sập thì có máy khác không? Lab này trả lời cả ba bằng hai máy chủ PostgreSQL trên laptop của bạn, sự cố thật, và những con số kiểm được.</p>

<h3>1 · Đề bài</h3>
<p>Phiếu việc của nhóm CT Shop, gửi bạn — người phụ trách dữ liệu:</p>
<ul>
<li><strong>Kế toán</strong> cần tài khoản riêng: đọc được mọi bảng, không sửa được gì, và một báo cáo chạy quá tay không được làm khổ cửa hàng. Bảng thêm vào tháng sau cũng phải đọc được.</li>
<li><strong>Sao lưu</strong>: một bản sao lưu mỗi đêm — và <em>bằng chứng</em> rằng nó khôi phục được, trên máy khác, không thiếu thứ gì. Không phải “tệp vẫn nằm đó”.</li>
<li><strong>Diễn tập sự cố</strong>: 10:05 một script dọn dẹp xoá đánh giá của cả một danh mục. Lấy lại đúng những dòng đó; đánh giá viết sau đó phải còn nguyên.</li>
<li><strong>Script sao lưu</strong> không bao giờ được báo thành công khi nó thất bại.</li>
<li>Một <strong>bản sao (replica)</strong>: máy thứ hai chạy theo máy chính, để chạy báo cáo — và nó chậm bao nhiêu, tính bằng byte và bằng giây.</li>
<li>Biết các <strong>bẫy</strong> của bản sao trước khi lập trình viên gặp chúng trên production: trang không tìm thấy đơn vừa lưu, ổ đĩa đầy vì một bản sao đã chết, chuyển đổi dự phòng (failover) bằng tay.</li>
</ul>
<p>Công cụ: Chương 15 — <code>pg_dump</code>, <code>pg_restore</code>, <code>pg_dumpall --globals-only</code> và các bẫy của chúng (15.1), WAL và LSN (15.2), <code>pg_basebackup -R</code>, <code>pg_stat_replication</code>, replication slot, độ trễ và <code>pg_promote</code> (15.3) — cộng <code>pgbench</code> và các view giám sát của Chương 14. Mảnh mới được giảng ngay chỗ dùng: role nhóm, <code>ALTER ROLE … SET</code>, <code>has_table_privilege</code>, <code>ALTER DEFAULT PRIVILEGES</code>, <code>\\drg</code> <code>\\drds</code> <code>\\ddp</code>, <code>pg_restore -f -</code>, <code>OVERRIDING SYSTEM VALUE</code>, <code>--checkpoint=fast</code>, <code>max_slot_wal_keep_size</code> và <code>safe_wal_size</code>, <code>pg_last_wal_replay_lsn()</code>, extension read-replicas của Prisma.</p>
<p>Chương 15 cho mỗi công cụ chạy một lần, riêng lẻ. Ở đây chúng chạy đúng thứ tự một nhóm thật cần, trên CT Shop, và mọi khẳng định đều được <em>kiểm</em> bằng một truy vấn hoặc một lệnh <code>diff</code> — thói quen đó mới là điều lab này muốn dạy.</p>

<h3>2 · Yêu cầu và tiêu chí đạt</h3>
<ol>
<li><strong>R1</strong> — role nhóm <code>report_ro</code> và người dùng <code>ketoan</code>: đọc 8 bảng, ngoài ra không gì cả; mặc định theo role; bảng tạo sau — bởi postgres <em>hoặc bởi role của app</em> — cũng đọc được.</li>
<li><strong>B1</strong> — <code>pg_dump -Fc</code> + <code>pg_dumpall --globals-only</code>; khôi phục ở máy thứ hai; chứng minh bằng <code>lab8-check.sql</code> + <code>diff</code>.</li>
<li><strong>B2</strong> — sự cố: lấy lại đúng các dòng đã xoá từ bản dump, không làm mất dòng mới.</li>
<li><strong>B3</strong> — script mỗi đêm: xem script ngây thơ nói dối; dùng script không thể nói dối.</li>
<li><strong>N1</strong> — bản sao streaming; ghi ở đây, đọc ở kia; kế toán trên bản sao; độ trễ dưới tải và trong lúc nhập 500.000 dòng.</li>
<li><strong>N2</strong> — đọc lại cái vừa ghi, slot của bản sao đã chết, failover bằng tay.</li>
</ol>
<div class="callout ok"><p><strong>Đạt khi:</strong> ma trận quyền cho thấy <code>ketoan</code> có SELECT trên <strong>8/8</strong> bảng và INSERT/UPDATE/DELETE/TRUNCATE trên <strong>0/8</strong> · <code>ketoan</code> ghi vẫn bị từ chối kể cả sau <code>SET default_transaction_read_only = off</code> · <code>diff</code> hai dấu vân tay <strong>không in gì</strong> sau khi khôi phục (${N.facts} dòng) · số đánh giá ${N.reviewsNow} → <strong>${N.reviewsBack}</strong> và 2 đánh giá mới vẫn còn · <code>lab8-backup.sh</code> thoát <strong>1</strong> khi máy chủ tắt và 3 bản tốt vẫn còn · <code>pg_stat_replication</code> báo <code>streaming</code> và dấu vân tay của bản sao bằng của máy chính trừ dòng sequence · bạn nói được độ trễ dưới tải bằng byte và mili-giây, và giải thích vì sao “số giây từ commit cuối” báo ${N.idleS} s trong khi bản sao đã theo kịp hoàn toàn.</p></div>
<p><strong>Thời gian, LSN và số byte trên máy bạn sẽ khác</strong>. Chấm theo những gì không đổi: số dòng, các lỗi, diff rỗng, mã thoát, máy nào trả lời.</p>
<h4>Thang điểm (10 điểm)</h4>
${RUBRIC(true)}

<h3>3 · Tệp tải về và chuẩn bị</h3>
${FILES(true)}
<p>Đặt các tệp vào một thư mục trống và mở terminal ở đó (Windows: terminal WSL hoặc Git Bash; Docker Desktop đang chạy). <code>lab8-docker.sh up</code> tạo một mạng Docker riêng và hai máy chủ PostgreSQL 17: <code>pglab8-primary</code> ở <code>localhost:5481</code> và <code>pglab8-replica</code> ở <code>localhost:5482</code>. Lúc này máy thứ hai chỉ là một máy chủ trống — ở B1 nó đóng vai “một máy khác” để thử khôi phục; ở N1 nó bị xoá sạch và dựng lại thành bản sao.</p>
${qo('S0A', 'S0B')}
<p class="meo">💡 Script chờ bằng <code>pg_isready -h 127.0.0.1</code>, không qua socket: lần khởi động đầu, ảnh Docker chạy một máy chủ tạm chỉ nghe socket để tạo CSDL rồi khởi động lại — script nối vào quá sớm sẽ vấp đúng lúc khởi động lại đó. Hai container chạy với <code>TZ=Asia/Ho_Chi_Minh</code> nên giờ in ra đã là giờ Việt Nam.</p>
<p>Các bước SQL bên dưới gõ trong psql. Mở psql ở máy chính bằng <code>docker exec -it pglab8-primary psql -U postgres -d ctshop</code> rồi chạy <code>SET search_path = shop;</code> một lần. Bước nào chạy ở chỗ khác thì dòng đầu ghi rõ (<code>-- psql on pglab8-replica · ketoan</code>); bước lệnh shell chạy trong terminal, ở thư mục lab.</p>

<h3>4 · Từng bước</h3>

<h4>R1 — tài khoản kế toán chỉ đọc được</h4>
<p class="meo">💡 Hai loại role. <strong>Role nhóm</strong> (NOLOGIN) giữ quyền, không ai đăng nhập bằng nó; <strong>người dùng</strong> (LOGIN) là thành viên và thừa hưởng quyền đó. Khi có kế toán thứ hai, bạn chỉ tạo một role LOGIN <code>IN ROLE report_ro</code> — không phải lặp lại GRANT nào, không sót gì.</p>
${qo('R1A', 'R1B')}
<p><strong>Mới: <code>ALTER ROLE … SET</code></strong> lưu một tham số mà mọi phiên của role đó bắt đầu với nó. psql xem thành viên bằng <code>\\drg</code> và các tham số đó bằng <code>\\drds</code>:</p>
${qo('R1C')}
<p>Đừng bao giờ kiểm quyền bằng cách thử vài truy vấn. <strong>Mới: <code>has_table_privilege(role, bảng, quyền)</code></strong> trả lời cho mọi bảng một lượt — ma trận này chính là tiêu chí đạt của R1:</p>
${qo('R1D')}
<p>Giờ đăng nhập <em>bằng</em> <code>ketoan</code> — có mật khẩu, qua TCP, đúng như công cụ của kế toán sẽ làm:</p>
${qo('R1E', 'R1F', 'R1G')}
${bay('Bẫy — default_transaction_read_only không phải bức tường.', 'Lần từ chối đầu đến từ <em>mặc định</em> chỉ-đọc. Người dùng nào cũng tắt được nó trong phiên của mình. Khi đó thứ chặn lệnh ghi là việc KHÔNG có GRANT — và từ PostgreSQL 15 không ai được CREATE trong schema <code>public</code> nếu chưa được cấp:', ['R1H'])}
<p>Vậy: quyền mới là bức tường, mặc định chỉ-đọc là dây an toàn chống lỡ tay. Thời gian chờ cũng y như vậy:</p>
${qo('R1I', 'R1J')}
<p>Báo cáo chạy quá tay bị huỷ sau ${N.timeout} s — nhưng <code>statement_timeout</code> cũng chỉ là mặc định: <code>ketoan</code> đặt về 0 được. Trên máy chính, một báo cáo nặng vẫn tranh CPU và ổ đĩa với bước thanh toán. Cách bảo vệ thật là chạy báo cáo ở chỗ khác — bản sao của N1.</p>
${bay('Bẫy — GRANT … ON ALL TABLES chỉ làm một lần.', 'Nó cấp quyền cho 8 bảng có mặt LÚC ĐÓ. Tuần sau một lập trình viên thêm bảng <code>coupon</code>:', ['R1K', 'R1L'])}
<p><strong>Mới: <code>ALTER DEFAULT PRIVILEGES</code></strong> thêm quyền cho các bảng tạo <em>từ giờ trở đi</em> (<code>\\ddp</code> liệt kê chúng). Bảng đã có thì vẫn cần GRANT riêng:</p>
${qo('R1M', 'R1N')}
${bay('Bẫy — quyền mặc định thuộc về role TẠO bảng.', 'Mặc định ở trên nói “bảng do <strong>postgres</strong> tạo”. Trên production, migration của app tạo bảng, bằng role riêng của app. Thêm một bảng nữa, do <code>ctshop_app</code> tạo:', ['R1O', 'R1P'])}
<p>Khai mặc định cho cả role đó (<code>FOR ROLE ctshop_app</code>) — <code>\\ddp</code> hiện hai dòng, mỗi người tạo một dòng:</p>
${qo('R1Q', 'R1R', 'R1S')}

<h4>B1 — sao lưu, rồi chứng minh nó khôi phục được ở nơi khác</h4>
<p class="meo">💡 Sao lưu một CSDL gồm hai tệp: bản dump (dữ liệu, lược đồ, GRANT) và <strong>globals</strong> — các role và mật khẩu của chúng, thứ thuộc về cả máy chủ và không bao giờ nằm trong pg_dump (bài 15.1). Định dạng custom <code>-Fc</code> được nén và cho <code>pg_restore</code> nhặt từng phần.</p>
${qo('B1A', 'B1B')}
<p>Để ý <code>globals.sql</code> chứa gì: mọi role kèm <em>mã băm</em> mật khẩu SCRAM. Nó nhạy cảm như một tệp mật khẩu — <code>chmod 600</code>, không bao giờ đưa vào git. Mục lục của bản dump, đếm theo loại:</p>
${qo('B1C')}
<p>8 bảng và 8 mục TABLE DATA, 23 ràng buộc, 7 giá trị sequence, 9 mục ACL (GRANT trên schema và 8 bảng) và 2 quyền mặc định của R1. Giờ thử khôi phục ở máy thứ hai — trước hết theo cách trông có vẻ ổn:</p>
${qo('B1D')}
<p>${N.restoreErr} lỗi, mã thoát 1, và một CSDL <em>trông</em> đầy đủ. Bạn có nhận ra không? Đừng so bằng mắt — so mọi thứ, một cách máy móc. <code>lab8-check.sql</code> in mỗi sự thật một dòng: số dòng của từng bảng và md5 của mọi dòng theo thứ tự khoá chính, từng sequence, ACL của từng bảng, từng role. Chạy ở cả hai máy rồi để <code>diff</code> phán:</p>
${qo('B1E')}
<p>${N.diffLines} dòng khác nhau, và không dòng nào nói về dữ liệu: mọi bảng cùng số dòng, cùng md5. Thứ thiếu là quyền và role — trên máy này kế toán không đọc được gì. Thứ tự đúng là globals <strong>trước</strong>, rồi mới tới bản dump, với <code>--exit-on-error</code> để có vấn đề thì dừng hẳn thay vì giấu trong một dòng cảnh báo:</p>
${qo('B1F', 'B1G')}
<p>Lỗi duy nhất (<code>role "postgres" already exists</code>) là bình thường và vô hại: tệp globals luôn tạo superuser. Một <code>diff</code> rỗng trên ${N.facts} dòng chính là bằng chứng mà phiếu việc đòi. Hãy cho phép thử này chạy định kỳ — bản sao lưu chưa từng khôi phục chỉ là một tệp.</p>

<h4>B2 — sự cố: lấy lại đúng những dòng đã mất</h4>
<p>10:05, một script dọn dẹp dành cho các cuốn sổ ngừng bán chạy với điều kiện lọc sai. 10:20, hai khách viết đánh giá mới. Bản sao lưu gần nhất là bản dump của B1.</p>
${qo('B2A', 'B2B')}
${bay('Bẫy — khôi phục dữ liệu bảng thẳng vào bảng đang chạy.', 'Cách sửa hiển nhiên là <code>pg_restore --data-only -t review</code>. Dữ liệu trong bản dump là MỘT lệnh <code>COPY</code> cho cả 678 dòng; dòng đầu tiên còn tồn tại làm nó hỏng, và COPY hỏng thì không chèn dòng nào:', ['B2C'])}
<p>Còn khôi phục cả bảng từ bản dump thì sẽ vứt mất 2 đánh giá lúc 10:20. Phải <em>chọn</em> dòng. <strong>Mới: <code>pg_restore -f -</code></strong> ghi SQL của các đối tượng được chọn ra đầu ra chuẩn thay vì vào một CSDL — ở đây là khối <code>COPY … FROM stdin</code> của bảng đánh giá. Nạp nó vào một bảng tạm có cùng cột:</p>
${qo('B2D', 'B2E', 'B2F', 'B2G')}
<p>678 dòng trong bản sao lưu, ${N.deleted} dòng đang thiếu — đều ở danh mục 9. Chép những dòng đó về:</p>
${qo('B2H')}
<p><strong>Mới: <code>OVERRIDING SYSTEM VALUE</code>.</strong> <code>id</code> là <code>GENERATED ALWAYS AS IDENTITY</code>, nên PostgreSQL từ chối id ghi tay — trừ khi bạn nói rõ là cố ý. Giữ id gốc: đường link, thông báo hay bảng khác có thể đang trỏ tới chúng.</p>
${qo('B2I')}
<p>${N.reviewsNow} → ${N.reviewsBack}: ${N.deleted} đánh giá bị mất đã về, đúng id và ngày tháng, và 2 đánh giá mới vẫn còn. Ngoài đời, hãy ghi lại cửa sổ thời gian và việc đã làm — và đi tìm cái script, không chỉ sửa hậu quả của nó.</p>

<h4>B3 — script sao lưu: một cái nói dối, một cái không thể</h4>
<p>Đây là script gặp trên rất nhiều máy chủ thật — từng có thời, nó là script của một dự án thật mà khoá học này biết rất rõ:</p>
${code(`DIR=./backups/daily
KEEP=3
mkdir -p $DIR
docker exec pglab8-primary pg_dump -U postgres -d ctshop | gzip > $DIR/ctshop-$(date +%Y%m%d-%H%M%S).sql.gz
ls -1t $DIR/ctshop-*.sql.gz | tail -n +$((KEEP + 1)) | xargs rm -f      # giữ 3 bản mới nhất
echo "✅ backup OK: $(ls -1t $DIR | head -1)"`, 'bash')}
<p>Ba đêm máy chủ chạy bình thường:</p>
${qo('B3A')}
<p>Giờ là ba đêm máy chủ CSDL bị tắt:</p>
${qo('B3B')}
${bay('Bẫy — thành công, ba lần, và không còn gì.', 'Đêm nào <code>pg_dump</code> cũng hỏng, nhưng một đường ống trả về mã thoát của lệnh CUỐI — gzip, vui vẻ nén “không gì cả” thành tệp 20 byte. Cron thấy 0, log ghi ✅, và phần xoay vòng, làm đúng việc của nó, đã xoá ba bản tốt. Sau ba đêm hỏng, bản sao lưu thật mới nhất đã biến mất; không ai biết cho tới ngày cần tới nó. (Bài 15.1 đã cho thấy tệp 20 byte; chính phần xoay vòng biến nó thành thảm hoạ.)', [])}
<p><code>lab8-backup.sh</code> đổi năm điều: <code>set -euo pipefail</code> (<code>pg_dump</code> hỏng thì cả dòng hỏng), <code>gzip -t</code> (tệp là một dòng gzip trọn vẹn), các <em>dòng cuối</em> của bản dump phải chứa <code>PostgreSQL database dump complete</code> (pg_dump chỉ ghi dòng này khi chạy xong), tên tạm <code>.part</code> cho tới khi qua hết phép kiểm, và xoay vòng <strong>sau cùng</strong> — chỉ khi đã có một bản mới tốt.</p>
${code(`set -euo pipefail
…
docker exec "$CONTAINER" pg_dump -U postgres -d "$DB" | gzip > "$TMP" || fail "pg_dump | gzip returned an error"
gzip -t "$TMP"                                                          || fail "the gzip file is corrupt"
gzip -dc "$TMP" | tail -n 10 | grep -q 'PostgreSQL database dump complete' || fail "the dump is incomplete"
mv "$TMP" "$OUT"                                                        # chỉ tệp đã kiểm mới được mang tên thật
ls -1t "$DIR"/ctshop-*.sql.gz | tail -n +$((KEEP + 1)) | xargs rm -f --   # xoay vòng SAU CÙNG`, 'bash')}
${qo('B3C', 'B3D', 'B3E', 'B3F')}
<p>Máy chủ tắt: thoát 1, thông báo rõ ràng, 3 bản tốt không bị đụng, không có tệp ghi dở. Gõ sai tên CSDL: y như vậy. Một bản chép bị cắt giữa chừng: <code>gzip -t</code> từ chối. Trên production thêm ba thứ lab không cho thấy được: một bản chép <strong>ra khỏi</strong> máy (ổ khác, object storage), cảnh báo khi script thoát khác 0 (cron gửi thư, một lệnh ping health-check), và — bài 15.2 — lưu trữ WAL, vì dump mỗi đêm vẫn có thể mất tới 24 giờ.</p>

<h4>N1 — bản sao streaming cho báo cáo</h4>
<p class="meo">💡 <code>lab8-docker.sh replica</code> làm đúng những gì bài 15.3 làm bằng tay: một role có REPLICATION, một dòng <code>pg_hba.conf</code> cho nó (<code>samenet</code> = mạng Docker), rồi <code>pg_basebackup</code> vào volume trống của bản sao. <code>-R</code> ghi <code>standby.signal</code> + thông tin nối về máy chính, <code>-X stream</code> chép cả WAL ghi ra trong lúc chép, <code>-C -S replica1</code> tạo slot. <strong>Mới: <code>--checkpoint=fast</code></strong>: thiếu nó, pg_basebackup chờ checkpoint theo lịch kế tiếp — tới <code>checkpoint_timeout</code> (5 phút) trên một máy chủ rảnh.</p>
${qo('N1A', 'N1B')}
<p>${N.baseKb} kB được chép trong vài giây. Nó có thật sự chạy theo không? Hỏi máy chính:</p>
${qo('N1C')}
<p><code>state = streaming</code>, bốn LSN bằng nhau, slot đang active. Ghi ở máy này, đọc ở máy kia:</p>
${qo('N1D', 'N1E')}
<p>Giờ kế toán nối vào <strong>bản sao</strong>. Không phải tạo gì ở đó: bản sao vật lý là bản chép từng byte của cả máy chủ, có cả role và GRANT — và không việc gì nó làm có thể làm chậm bước thanh toán:</p>
${qo('N1F')}
<p>Và dấu vân tay của bản sao so với máy chính:</p>
${qo('N1G')}
<p>Mọi bảng, ACL và role đều giống hệt; một dòng khác — và đó không phải lỗi. PostgreSQL ghi giá trị sequence vào WAL <strong>32 giá trị một lần</strong> (ghi từng lần <code>nextval</code> thì quá chậm), nên bản sao replay WAL sẽ thấy sequence đi trước 32. Sau failover, máy chính mới chạy tiếp từ 2033: id 2002–2032 không bao giờ được dùng. Khoảng trống ở cột identity là bình thường — đừng bao giờ xây logic (“số hoá đơn không được hở”) trên nó.</p>
<h4>N1 — nó chậm bao nhiêu?</h4>
<p>Hai con số trong <code>pg_stat_replication</code> của máy chính: <strong>số byte</strong> chưa replay, <code>pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)</code>, và <strong>thời gian</strong>, <code>replay_lag</code> (bao lâu từ lúc commit tới lúc bản sao báo đã replay xong). Tám khách đặt hàng liên tục bằng <code>lab8-orders.pgbench</code>, lấy mẫu mỗi 2 giây:</p>
${qo('N1H')}
<p>${N.txN1H} đơn trong 20 s (${N.tps} đơn mỗi giây): bản sao chưa lúc nào chậm quá ${N.maxBehindH}, và nhiều nhất ${N.maxLagH} ms. Giờ là một đợt dồn — nhập 500.000 đơn cũ từ hệ thống trước bằng một câu lệnh:</p>
${qo('N1I')}
<p>Lệnh nhập mất ${N.importS} s; bản sao chậm nhiều nhất ${N.maxBehindI} và ${N.maxLagI} ms, rồi về 0. Trên một laptop, mạng không tốn gì và bản sao rảnh: độ trễ chỉ vài mili-giây. Trên máy chủ thật nó tăng theo mạng, theo ổ đĩa của bản sao, và theo truy vấn dài trên bản sao (chúng có thể làm replay tạm dừng — bài 15.3). Vì thế phải <em>đo</em> nó, và đặt cảnh báo cho nó.</p>
${bay('Bẫy — “độ trễ” không phải độ trễ.', 'Một phép kiểm rất phổ biến là <code>now() - pg_last_xact_replay_timestamp()</code> trên bản sao: “số giây từ commit được replay gần nhất”. 20 giây không ai ghi gì:', ['N1J'])}
<p>${N.idleS} giây “trễ” trên một bản sao đã theo kịp hoàn toàn — chỉ là máy chính không có gì để gửi. Cảnh báo theo giá trị đó sẽ đánh thức ai đó lúc 3 giờ sáng vì không có gì cả. Hãy cảnh báo theo byte (phía máy chính), hoặc kiểm <code>pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn()</code> trước; <code>replay_lag</code> thành NULL khi không có gì để replay.</p>

<h4>N2 — những gì bản sao KHÔNG cho bạn</h4>
<p class="meo">💡 Bước thanh toán ghi đơn ở máy chính, rồi trang “cảm ơn” đọc lại nó — từ bản sao, vì lập trình viên dồn mọi lệnh đọc sang đó. <code>lab8-ryw.mjs</code> (Node + <code>pg</code>) đo việc này ${N.rywN} lần, lúc rảnh, rồi khi có pgbench chạy nền.</p>
${qo('N2A')}
${bay('Bẫy — đọc lại cái mình vừa ghi (read-your-writes).', `${N.rywIdle} trên ${N.rywN} đơn chưa có ở bản sao một khoảnh khắc sau khi COMMIT trả về, lúc rảnh; ${N.rywLoad} khi có tải. Nhân bản bất đồng bộ nghĩa đúng là vậy: máy chính không chờ. Hai cách sửa trong script: <strong>chờ</strong> tới khi bản sao replay qua LSN lấy sau commit (<code>pg_last_wal_replay_lsn() &gt;= $1</code>) — trung bình ${N.rywWait} ms khi có tải, tối đa ${N.rywMax} ms — hoặc, đơn giản hơn và là cách đa số app làm, gửi các lệnh đọc ngay sau một lệnh ghi về <strong>máy chính</strong>.`, [])}
<p>Trong app Prisma, extension chính thức chuyển lệnh đọc của model sang bản sao và mọi thứ khác về máy chính:</p>
${code(PRISMA_CODE, 'ts')}
${out(O.N2B)}
<p>Chạy thật (Prisma 5.22, extension 0.3.0): ${N.prismaMiss} trên ${N.prismaN} đơn tạo bằng <code>create()</code> không được <code>findUnique()</code> ngay sau đó tìm thấy — cùng một cuộc đua, giờ nằm bên trong ORM. <code>$primary()</code>: 0. Để ý ở bản này <code>$queryRaw</code> đi về máy chính. Và các chuỗi kết nối — app có hai chuỗi, kế toán có tài khoản riêng trên bản sao:</p>
${code(ENV_CODE, 'bash')}
${bay('Bẫy — slot giữ WAL cho một bản sao đã không còn.', 'Slot của N1 hứa rằng máy chính sẽ giữ mọi tệp WAL mà bản sao chưa nhận. Dừng bản sao, và để job 02:00 chạy ba đêm:', ['N2C', 'N2D', 'N2E'])}
<p>${N.slot3} bị giữ cho một bản sao không có mặt, và <code>pg_wal</code> đi từ ${N.wal0} → ${N.wal3} — ngay cả <code>CHECKPOINT</code> cũng không xoá được thứ slot đang ghim. Không có giới hạn, nó lớn dần tới khi ổ đĩa máy chính đầy, và khi đó <em>máy chính</em> dừng. <strong>Mới: <code>max_slot_wal_keep_size</code></strong> đặt trần cho nó (khi đó slot bị đánh dấu <code>lost</code> — bài 15.3 đã cho thấy), và <code>safe_wal_size</code> cho biết còn bao nhiêu chỗ:</p>
${qo('N2F', 'N2G', 'N2H')}
<p>Bản sao quay lại và tự theo kịp (slot active, giữ 0 byte). <code>pg_wal</code> không co lại ngay (${N.walAfter}): các đoạn cũ được tái dùng cho WAL tương lai và được cắt dần ở các checkpoint sau, trong giới hạn <code>max_wal_size</code>.</p>

<h4>N2 — failover bằng tay, và vì sao cần công cụ</h4>
${qo('N2I', 'N2J')}
<p><code>pg_promote()</code> biến bản sao thành máy chính trên một timeline mới trong một giây; nó nhận lệnh ghi. Nhưng nhìn những gì CHƯA làm: app vẫn trỏ vào <code>pglab8-primary</code> (kết nối bị từ chối), không ai kiểm bản sao đã chậm bao nhiêu lúc máy chính chết (bất đồng bộ ⇒ vài giao dịch cuối có thể mất), và nếu máy chính cũ bật lại nó vẫn tin mình là máy chính — split brain, bài 15.3. Làm đúng ba việc đó mọi lần, lúc 3 giờ sáng, là việc của công cụ: <strong>Patroni</strong> (bầu leader qua etcd/Consul, cô lập máy cũ, tua lại máy cũ) cộng một địa chỉ ổn định (HAProxy, PgBouncer, IP ảo hoặc DNS), hoặc một dịch vụ quản lý sẵn làm thay bạn.</p>
${qo('N2K')}

<h3>5 · Tự kiểm</h3>
<ol>
<li>Sau <code>SET default_transaction_read_only = off</code>, vì sao <code>ketoan</code> vẫn không chèn được đơn — và vì sao thiết kế đó là đúng?</li>
<li>Lần khôi phục ở B1 in ${N.restoreErr} lỗi, vậy mà mọi bảng đúng số dòng và cùng md5. Thiếu cái gì, và thứ tự lệnh nào sửa được?</li>
<li>Bảng theo dõi báo bản sao trễ ${N.idleS} s lúc 03:00 trong khi <code>pg_stat_replication</code> báo chậm 0 byte. Bản sao có trễ không?</li>
</ol>
${details('Đáp án', `<ol><li>Tham số chỉ-đọc là mặc định theo phiên mà người dùng nào cũng đổi được; bức tường là việc KHÔNG có quyền INSERT (report_ro chỉ được cấp SELECT). An toàn không được phụ thuộc vào một tham số do chính người dùng điều khiển.</li><li>Các role (report_ro, ketoan, ctshop_app) và vì thế mọi GRANT: role nằm trong globals, không nằm trong pg_dump. Chạy globals.sql trước rồi mới pg_restore — và so bằng lab8-check.sql + diff, không bằng mắt.</li><li>Không. now() − pg_last_xact_replay_timestamp() là thời gian từ COMMIT được replay gần nhất; khi máy chính rảnh nó cứ tăng dù bản sao đã theo kịp. Dùng số byte chậm / replay_lag, hoặc kiểm LSN nhận = LSN replay trước.</li></ol>`)}

<h3>6 · Đáp án đầy đủ</h3>
${details('Xem toàn bộ lab8-solution.sh', code(SOL, 'bash'))}

<h3>7 · Bẫy</h3>
<div class="pitfall"><p><strong>Chỉ-đọc bằng tham số</strong> — <code>default_transaction_read_only</code> và <code>statement_timeout</code> là mặc định người dùng đổi được. Chỉ GRANT đúng thứ cần.</p></div>
<div class="pitfall"><p><strong><code>GRANT … ON ALL TABLES</code> một lần</strong> — bảng mới không được tính. <code>ALTER DEFAULT PRIVILEGES</code>, cho mọi role có tạo bảng (<code>FOR ROLE ctshop_app</code>).</p></div>
<div class="pitfall"><p><strong>Bản dump không kèm globals</strong> — dữ liệu về, role và GRANT thì không. Sao lưu cả <code>pg_dumpall --globals-only</code>, khôi phục nó trước, giữ nó như giữ mật khẩu.</p></div>
<div class="pitfall"><p><strong>Kiểm khôi phục bằng mắt</strong> — ${N.restoreErr} lỗi nấp sau số dòng đúng. Lấy dấu vân tay hai phía rồi <code>diff</code>.</p></div>
<div class="pitfall"><p><strong><code>pg_restore --data-only -t</code> vào bảng đang chạy</strong> — một dòng đã có là hỏng cả lệnh COPY. Khôi phục vào bảng tạm, chèn dòng thiếu, <code>OVERRIDING SYSTEM VALUE</code> cho id identity.</p></div>
<div class="pitfall"><p><strong><code>pg_dump | gzip</code> không pipefail, xoay vòng trước</strong> — ✅ và tệp 20 byte trong khi bản tốt bị xoá. Kiểm, đổi tên, xoay vòng — đúng thứ tự đó.</p></div>
<div class="pitfall"><p><strong>pg_basebackup “treo”</strong> — nó đang chờ checkpoint. <code>--checkpoint=fast</code>.</p></div>
<div class="pitfall"><p><strong>So sequence trên bản sao</strong> — đi trước 32 là do thiết kế; khoảng trống sau failover là bình thường.</p></div>
<div class="pitfall"><p><strong>Độ trễ = now() − mốc replay cuối</strong> — tăng khi máy chính rảnh. Dùng byte / <code>replay_lag</code>.</p></div>
<div class="pitfall"><p><strong>Đọc lại cái vừa ghi từ bản sao</strong> — chưa có trong ${N.rywIdle}/${N.rywN} lần ở đây. Đọc từ máy chính sau khi ghi (<code>$primary()</code>), hoặc chờ LSN.</p></div>
<div class="pitfall"><p><strong>Slot không giới hạn</strong> — một bản sao chết làm đầy ổ máy chính. <code>max_slot_wal_keep_size</code> + cảnh báo theo số byte bị giữ; xoá slot của bản sao không còn.</p></div>
<div class="pitfall"><p><strong>Failover bằng tay trên production</strong> — địa chỉ của app, giao dịch bị mất, split brain. Patroni (hoặc dịch vụ quản lý) + một địa chỉ ổn định.</p></div>

<h3>8 · Thử thách thêm — và bài tiếp theo</h3>
<ul>
<li><strong>Thử thách 1</strong> — cho bản sao chạy đồng bộ trong một phút (<code>synchronous_standby_names</code>, bài 15.3), chạy lại <code>lab8-ryw.mjs</code> với <code>synchronous_commit = remote_apply</code> đặt trong phiên của app: còn bao nhiêu lần không thấy, và mỗi đơn tốn thêm bao nhiêu độ trễ?</li>
<li><strong>Thử thách 2</strong> — mở rộng <code>lab8-backup.sh</code> với phép <em>thử khôi phục</em> hằng tuần: khôi phục bản mới nhất vào một container dùng-xong-vứt, chạy <code>lab8-check.sql</code> ở đó và ở máy chính, thoát 1 nếu các dòng bảng khác nhau.</li>
<li><strong>Thử thách 3</strong> — dựng lại máy chính cũ thành bản sao của máy chính mới sau N2 (gợi ý: <code>pg_rewind</code> cần <code>wal_log_hints</code> hoặc data checksums — hoặc đơn giản là một lần <code>pg_basebackup</code> mới).</li>
</ul>
<p>Chương 16 đưa mọi thứ vào app: migration Prisma trên một lược đồ thật, pool kết nối, và checklist production — sao lưu, role và bản sao của lab này là ba dòng trong đó. Lab 9 là bài tổng kết: một app Node + Prisma trên CT Shop.</p>
</div>
`;

export default {
  title: 'Lab 8 — CT Shop: sao lưu khôi phục được, tài khoản chỉ đọc, bản sao streaming|||Lab 8 — CT Shop: backups that restore, a read-only account, a streaming replica',
  slug: 'postgresql-lab-8-sao-luu-nhan-ban-ct-shop',
  type: 'LESSON',
  description: 'Lab 8 sau Chương 15: role nhóm report_ro + tài khoản kế toán ketoan chỉ đọc (ma trận has_table_privilege, mặc định không phải bức tường, ALTER DEFAULT PRIVILEGES cả FOR ROLE của app), pg_dump -Fc + globals khôi phục ở máy thứ hai và đối soát bằng dấu vân tay md5 + diff, sự cố xoá nhầm 78 đánh giá lấy lại đúng dòng (pg_restore -f -, OVERRIDING SYSTEM VALUE), script sao lưu ngây thơ báo ✅ với tệp 20 byte vs script pipefail/gzip -t/dump complete, bản sao streaming 2 container (pg_basebackup -R -C --checkpoint=fast), độ trễ byte/ms dưới pgbench và khi nhập 500.000 dòng, bẫy giây-từ-commit-cuối, read-your-writes đo bằng Node + Prisma read replicas, slot giữ WAL khi bản sao chết + max_slot_wal_keep_size, failover pg_promote. Output thật PostgreSQL 17.11.',
  content: `${G}${EN}${VI}`,
};
