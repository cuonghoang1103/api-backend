/**
 * pg-lab-8 — PostgreSQL · Lab 8 · CT Shop "backups that restore, a read-only account, a streaming replica" (slide EN, kiểu FU, agent lab8 26/10/2026).
 * Nguồn: content/courses/postgresql/lab/lab-8.mjs + lab/sql/lab8-*. Output = chạy thật PostgreSQL 17.11 trên 2 container tạm
 * pglab8-primary + pglab8-replica (dựng bằng chính lab8-docker.sh) — Q/LG/AI/O bên dưới SINH TỰ ĐỘNG (scratchpad lab8/run8.mjs → gen8.mjs).
 * Lệnh shell trên slide có thể rút gọn (ghi "(shortened)" ở tiêu đề khung); output không bao giờ bịa. Hình nào là sơ đồ ghi "schematic";
 * mọi CON SỐ trên hình lấy từ O (output thật).
 * Tập 1 (video pg-lab-8) = slide 1–21 (R1, B1–B3) · tập 2 (pg-lab-8-2) = slide 22–36 (N1, N2, tự kiểm).
 */
import { lamDeck, sql, psql, tbl, two, box, steps, kw, vsd, flow, esc } from './_pg-chung.mjs';
import { PG, CAM, NAU, XANH, DO, TIM } from './pg-lab-hinh.mjs';

export const deck = { key: 'pg-lab-8', code: 'PG Lab 8', title: 'Lab 8 — CT Shop: backups that restore, a read-only account, a streaming replica', sub: 'roles · pg_dump + globals · fingerprint diff · restoring rows · a backup script that cannot lie · pg_basebackup · lag · read-your-writes · slots · failover' };

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

const P = (t, o = {}) => psql(t, { title: 'psql (17.11) — ctshop', ...o });
const T = (t, o = {}) => psql(t, { title: 'terminal — lab folder', ...o });
const col = (...xs) => `<div style="display:flex;flex-direction:column;gap:12px;min-width:0">${xs.join('')}</div>`;
const p = (t, fs = 21) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;
const bo = (s) => s.split('\n').map((l) => l.replace(/\s+--.*$/, '').replace(/\s+# .*$/, '')).join('\n');
const dong = (t, to) => t.split('\n').map((l, i) => (to.some((x) => l.includes(x)) ? i + 1 : 0)).filter(Boolean);
const S = (k, to = [], o = {}) => { const t = o.giu ? Q[k] : bo(Q[k]); return sql(t, { sm: true, hl: dong(t, to), lang: LG[k] === 'sql' ? 'pgsql' : 'bash', ...o }); };
const nho = (h, fs = 13) => h.replace(/<pre>/g, `<pre style="font-size:${fs}px;line-height:1.34">`);
const ma = (h, fs = 13.5) => h.replace(/<pre class="vs sm">/g, `<pre class="vs sm" style="font-size:${fs}px;line-height:1.38">`);
const PO = (k, to = [], o = {}) => { const t = o.bo ? O[k].split('\n').filter((l) => !o.bo.some((x) => l.includes(x))).join('\n') : O[k]; return (LG[k] === 'sql' ? P : T)(t, { sm: true, hl: dong(t, to), ...(AI[k] && AI[k] !== 'pglab8-primary · postgres' && LG[k] === 'sql' ? { title: `psql (17.11) — ${AI[k]}` } : {}), ...o }); };
const lay = (k, re, i = 1) => { const m = O[k].match(re); if (!m) throw new Error(`pg-lab-8: không thấy ${re} trong O.${k}`); return m[i]; };
const tatCa = (k, re) => [...O[k].matchAll(new RegExp(re, 'g'))];
const vn = (x, le = 0) => { const [a, b] = Number(x).toFixed(le).split('.'); return a.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (b ? ',' + b : ''); };
const byte = (s) => { const [, n, u] = s.match(/([\d.]+) (bytes|kB|MB|GB)/); return Number(n) * { bytes: 1, kB: 1024, MB: 1048576, GB: 1073741824 }[u]; };
const giay = (t) => { const [h, m, s] = t.split(':'); return Number(h) * 3600 + Number(m) * 60 + Number(s); };
const c = (t) => `<code class="i">${esc(t)}</code>`;
const boc = (l, w) => { const r = []; let x = l; while (x.length > w) { let i = x.lastIndexOf(' ', w); if (i < w * 0.5) i = w; r.push(x.slice(0, i)); x = '    ' + x.slice(i).trimStart(); } r.push(x); return r; };
const wrap = (t, w = 70) => t.split('\n').flatMap((l) => boc(l, w)).join('\n');

/* ── số thật ── */
const N = {
  timeout: vn(Number(lay('R1I', /Time: ([\d.]+) ms/)) / 1000, 1),
  dumpKb: vn(Number(lay('B1A', /(\d+) backups\/ctshop\.dump/)) / 1024),
  restoreErr: lay('B1D', /errors ignored on restore: (\d+)/),
  facts: lay('B1G', /identical: (\d+) facts/),
  diffLines: (O.B1E.match(/^[<>] /gm) || []).length,
  deleted: lay('B2A', /DELETE (\d+)/),
  reviewsNow: lay('B2B', /reviews_now\s*\n-+\n\s*(\d+)/),
  reviewsBack: lay('B2I', /reviews_now \| new_ones_kept\s*\n[-+]+\n\s*(\d+)/),
  baseKb: vn(lay('N1A', /(\d+)\/\d+ kB \(100%\), 1\/1/)),
  tps: vn(lay('N1H', /tps = ([\d.]+)/)),
  txN1H: vn(lay('N1H', /actually processed: (\d+)/)),
  idleS: vn(giay(lay('N1J', /\n\s*(\d\d:\d\d:[\d.]+)\s*\|/)), 0),
  importS: vn(Number(lay('N1I', /Time: ([\d.]+) ms/)) / 1000, 1),
  rywN: lay('N2A', /right after COMMIT\s*:\s*\d+ \/ (\d+)/),
  rywIdle: lay('N2A', /right after COMMIT\s*:\s*(\d+) \//),
  rywLoad: tatCa('N2A', /right after COMMIT\s*:\s*(\d+) \//)[1][1],
  rywWait: vn(tatCa('N2A', /wait avg ([\d.]+) ms/)[1][1], 1),
  rywMax: vn(tatCa('N2A', /max ([\d.]+) ms/)[1][1], 0),
  prismaMiss: lay('N2B', /then findUnique\(\)\s*:\s*(\d+) \//),
  prismaN: lay('N2B', /then findUnique\(\)\s*:\s*\d+ \/ (\d+)/),
};
const MAU_H = tatCa('N1H', /(\d\d:\d\d:\d\d) \| behind ([\d.]+ (?:bytes|kB|MB)) \| replay_lag (\d\d:\d\d:[\d.]+)/).map((m) => ({ t: m[1], b: byte(m[2]), s: m[2], ms: giay(m[3]) * 1000 }));
const MAU_I = tatCa('N1I', /(\d\d:\d\d:\d\d) \| behind ([\d.]+ (?:bytes|kB|MB)) \| replay_lag (\d\d:\d\d:[\d.]+)/).map((m) => ({ t: m[1], b: byte(m[2]), s: m[2], ms: giay(m[3]) * 1000 }));
const DEM = tatCa('N2E', /night (\d): the slot keeps ([\d.]+ \w+) · pg_wal = ([\d.]+ \w+)/).map((m) => ({ n: m[1], kept: m[2], wal: m[3] }));
const WAL0 = lay('N2D', /pg_wal_size \| wal_files\s*\n[-+]+\n\s*(\S+ \w+)/);
const WAL_SAU = lay('N2H', /pg_wal_size \| wal_files\s*\n[-+]+\n\s*(\S+ \w+)/);
const maxH = MAU_H.reduce((a, x) => (x.b > a.b ? x : a), MAU_H[0]);
const maxLagH = vn(Math.max(...MAU_H.map((x) => x.ms)), 1);
const maxLagI = vn(Math.max(...MAU_I.map((x) => x.ms)), 0);
const naiveSizes = tatCa('B3A', /\s+(\d+) backups\/daily\/ctshop-\S+\.sql\.gz/).map((m) => Number(m[1]));
const goodK = lay('B3C', /\.sql\.gz\s+(\S+)\s+·/);

/* ── HÌNH ── */
const mk = (id, mau) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${mau}"/></marker>`;
/** Hai máy chủ trên laptop (sơ đồ). */
const haiMay = () => {
  const W = 1110, H = 236;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs>${mk('l8a', NAU)}</defs>`;
  s += `<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="16" fill="#f8fafc" stroke="#9aa8b8" stroke-width="2"/>`;
  s += `<text x="20" y="30" font-size="18" font-weight="800" fill="#555">💻 your laptop — Docker</text>`;
  s += `<rect x="250" y="16" width="${W - 270}" height="${H - 32}" rx="14" fill="none" stroke="${PG}" stroke-width="2" stroke-dasharray="8 6"/><text x="270" y="40" font-size="16" fill="${PG}" font-family="Menlo,monospace">network pglab8-net</text>`;
  const may = (x, ten, cong, dong1, dong2, mau, k) => `<g data-k="${k}"><rect x="${x}" y="54" width="340" height="160" rx="14" fill="#fff" stroke="${mau}" stroke-width="3"/>` +
    `<text x="${x + 20}" y="90" font-size="23" font-weight="800" fill="${mau}" font-family="Menlo,monospace">${ten}</text>` +
    `<text x="${x + 20}" y="120" font-size="18" fill="#555" font-family="Menlo,monospace">${cong}</text>` +
    `<text x="${x + 20}" y="156" font-size="18" fill="#333">${dong1}</text><text x="${x + 20}" y="184" font-size="18" fill="#333">${dong2}</text></g>`;
  s += may(280, 'pglab8-primary', 'localhost:5481', 'PostgreSQL 17 · database ctshop', 'the shop (lab8-start.sql)', PG, 'm-pri');
  s += may(740, 'pglab8-replica', 'localhost:5482', 'B1: a blank “other machine”', 'N1: rebuilt as a streaming replica', CAM, 'm-rep');
  s += `<line x1="624" y1="134" x2="734" y2="134" stroke="${NAU}" stroke-width="3" stroke-dasharray="7 5" marker-end="url(#l8a)"/><text x="679" y="122" text-anchor="middle" font-size="15" fill="${NAU}">WAL (N1)</text>`;
  s += `<g data-k="m-ban"><rect x="22" y="70" width="210" height="130" rx="12" fill="#0f1720"/><text x="38" y="104" font-size="17" fill="#7ee787" font-family="Menlo,monospace">$ bash lab8-</text><text x="38" y="128" font-size="17" fill="#7ee787" font-family="Menlo,monospace">  docker.sh up</text><text x="38" y="164" font-size="15" fill="#c9d1d9">pg_dump · psql ·</text><text x="38" y="186" font-size="15" fill="#c9d1d9">pgbench · node</text></g>`;
  return s + '</svg>';
};
/** role nhóm và người dùng (sơ đồ). */
const roleSoDo = () => {
  const W = 1110, H = 190;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs>${mk('l8r', NAU)}</defs>`;
  const hop = (x, y, w, h, t1, t2, mau, k, dash = '') => `<g data-k="${k}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${mau}12" stroke="${mau}" stroke-width="3" ${dash ? 'stroke-dasharray="8 6"' : ''}/><text x="${x + w / 2}" y="${y + 34}" text-anchor="middle" font-size="22" font-weight="800" fill="${mau}" font-family="Menlo,monospace">${t1}</text><text x="${x + w / 2}" y="${y + 62}" text-anchor="middle" font-size="17" fill="#555">${t2}</text></g>`;
  s += hop(0, 8, 230, 80, 'ketoan', 'LOGIN · a person', PG, 'r-ketoan');
  s += hop(0, 102, 230, 80, 'ketoan2', 'next year — 1 line', PG, 'r-k2', 1);
  s += `<line x1="236" y1="48" x2="372" y2="88" stroke="${NAU}" stroke-width="3" marker-end="url(#l8r)"/><line x1="236" y1="142" x2="372" y2="104" stroke="${NAU}" stroke-width="3" stroke-dasharray="7 5" marker-end="url(#l8r)"/>`;
  s += `<text x="300" y="40" text-anchor="middle" font-size="16" fill="${NAU}">IN ROLE</text>`;
  s += hop(378, 55, 250, 80, 'report_ro', 'NOLOGIN · a group', CAM, 'r-group');
  s += `<line x1="634" y1="95" x2="716" y2="95" stroke="${NAU}" stroke-width="3" marker-end="url(#l8r)"/><text x="675" y="82" text-anchor="middle" font-size="15" fill="${NAU}">USAGE +</text><text x="675" y="122" text-anchor="middle" font-size="15" fill="${NAU}">SELECT</text>`;
  const bang = ['category', 'product', 'customer', 'orders', 'order_item', 'payment', 'stock_movement', 'review'];
  bang.forEach((b, i) => { const x = 724 + (i % 2) * 194, y = 6 + Math.floor(i / 2) * 46; s += `<g data-k="r-t${i}"><rect x="${x}" y="${y}" width="186" height="38" rx="8" fill="#f1f9f4" stroke="${XANH}" stroke-width="2"/><text x="${x + 93}" y="${y + 25}" text-anchor="middle" font-size="16" fill="${XANH}" font-family="Menlo,monospace">${b}</text></g>`; });
  return s + '</svg>';
};
/** Dấu vân tay hai máy (dòng thật từ O.B1E / O.B1G). */
const vanTay = () => {
  const W = 1110, H = 196;
  const tbl1 = O.B1G.split('\n').filter((l) => l.startsWith('table|')).slice(0, 2).map((l) => l.replace(/\|([0-9a-f]{8})[0-9a-f]{24}$/, '|$1…'));
  const aclP = (O.B1E.match(/^< (acl\|orders\|.*)$/m) || [])[1], aclS = (O.B1E.match(/^> (acl\|orders\|.*)$/m) || [])[1];
  const roleP = (O.B1E.match(/^< (role\|ketoan\|[^|]*)/m) || [])[1];
  const hang = [[tbl1[0], tbl1[0], true], [tbl1[1], tbl1[1], true], [aclP, aclS, false], [roleP, '(missing)', false]];
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Menlo,monospace">`;
  s += `<text x="0" y="18" font-size="16" font-weight="700" fill="${PG}" font-family="Arial">check-primary.txt</text><text x="590" y="18" font-size="16" font-weight="700" fill="${CAM}" font-family="Arial">check-spare.txt (restored WITHOUT globals)</text>`;
  hang.forEach(([a, b, ok], i) => {
    const y = 30 + i * 41, mau = ok ? XANH : DO, cut = (t) => (t.length > 44 ? t.slice(0, 43) + '…' : t);
    s += `<g data-k="v-${i}"><rect x="0" y="${y}" width="510" height="34" rx="6" fill="${ok ? '#f1f9f4' : '#fdf0ee'}" stroke="${mau}" stroke-width="1.5"/><text x="10" y="${y + 23}" font-size="15" fill="#333">${esc(cut(a))}</text>`;
    s += `<text x="550" y="${y + 25}" text-anchor="middle" font-size="24" font-weight="900" fill="${mau}" font-family="Arial">${ok ? '=' : '≠'}</text>`;
    s += `<rect x="590" y="${y}" width="520" height="34" rx="6" fill="${ok ? '#f1f9f4' : '#fdf0ee'}" stroke="${mau}" stroke-width="1.5"/><text x="600" y="${y + 23}" font-size="15" fill="#333">${esc(cut(b))}</text></g>`;
  });
  return s + '</svg>';
};
/** Dòng thời gian sự cố B2. */
const dongB2 = () => {
  const W = 1110, H = 130;
  const moc = [[60, '02:00', 'pg_dump', 'review = 678', PG], [380, '10:05', 'DELETE … category 9', `− ${N.deleted} reviews`, DO], [690, '10:20', '2 new reviews', `${N.reviewsNow} rows now`, CAM], [1000, '11:00', 'repair', `${N.reviewsBack} = 678 + 2`, XANH]];
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><line x1="20" y1="50" x2="${W - 20}" y2="50" stroke="#9aa8b8" stroke-width="4"/>`;
  moc.forEach(([x, gio, t1, t2, mau], i) => {
    s += `<g data-k="t-${i}"><circle cx="${x}" cy="50" r="13" fill="${mau}"/><text x="${x}" y="26" text-anchor="middle" font-size="19" font-weight="800" fill="${mau}">${gio}</text>`;
    s += `<text x="${x}" y="90" text-anchor="middle" font-size="18" fill="#333" font-family="Menlo,monospace">${esc(t1)}</text><text x="${x}" y="116" text-anchor="middle" font-size="18" font-weight="700" fill="${mau}">${esc(t2)}</text></g>`;
  });
  return s + '</svg>';
};
/** Ba đêm: script ngây thơ vs script đúng (kích thước tệp thật). */
const baDem = () => {
  const W = 1110, H = 232, kb = (n) => (n >= 1024 ? `${vn(n / 1024)} KB` : `${n} B`);
  const ngay = [['3 good nights', naiveSizes, XANH], ['night 1 · server down', [naiveSizes[1], naiveSizes[2], 20], DO], ['night 2', [naiveSizes[2], 20, 20], DO], ['night 3', [20, 20, 20], DO]];
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  s += `<text x="0" y="18" font-size="16" font-weight="800" fill="${DO}">lab8-backup-naive.sh — what is left in backups/daily (KEEP = 3) · real sizes</text>`;
  ngay.forEach(([ten, sz, mau], i) => {
    const x = i * 278;
    s += `<g data-k="d-${i}"><text x="${x}" y="46" font-size="17" font-weight="700" fill="${i ? DO : XANH}">${ten}</text>`;
    sz.forEach((b, j) => { const h = b > 1000 ? 96 : 4; s += `<rect x="${x + j * 70}" y="${190 - h}" width="56" height="${h}" rx="4" fill="${b > 1000 ? XANH : DO}"/><text x="${x + j * 70 + 28}" y="${182 - h}" text-anchor="middle" font-size="13" fill="#333">${kb(b)}</text>`; });
    s += `<text x="${x}" y="220" font-size="16" fill="#555">${i ? '“✅ backup OK” · exit 0' : 'exit 0'}</text></g>`;
  });
  return s + '</svg>';
};
/** Biểu đồ độ trễ dưới tải (mẫu thật N1H). */
const bieuDoTre = () => {
  const W = 1110, H = 200, n = MAU_H.length, bw = 86, gap = (W - 60 - n * bw) / (n - 1), max = Math.max(...MAU_H.map((x) => x.b));
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><line x1="40" y1="160" x2="${W}" y2="160" stroke="#9aa8b8" stroke-width="2"/>`;
  s += `<text x="0" y="16" font-size="15" font-weight="800" fill="${PG}">bytes not yet replayed, every 2 s, 8 clients ordering · replay_lag in ms above each bar (real samples)</text>`;
  MAU_H.forEach((x, i) => {
    const X = 50 + i * (bw + gap), h = Math.max(3, (x.b / max) * 110);
    s += `<g data-k="b-${i}"><rect x="${X}" y="${160 - h}" width="${bw}" height="${h}" rx="5" fill="${x === maxH ? CAM : PG}"/><text x="${X + bw / 2}" y="${152 - h}" text-anchor="middle" font-size="14" fill="#333">${esc(x.s)}</text>`;
    s += `<text x="${X + bw / 2}" y="${132 - h}" text-anchor="middle" font-size="14" font-weight="700" fill="${XANH}">${vn(x.ms, 1)} ms</text><text x="${X + bw / 2}" y="182" text-anchor="middle" font-size="14" fill="#666" font-family="Menlo,monospace">${x.t}</text></g>`;
  });
  return s + '</svg>';
};
/** Slot giữ WAL qua 3 đêm (số thật N2D/N2E). */
const bieuDoSlot = () => {
  const W = 1110, H = 220, mb = (t) => byte(t) / 1048576;
  const cot = [{ n: 'replica stopped', kept: '0 bytes', wal: WAL0 }, ...DEM.map((d) => ({ n: `night ${d.n}`, kept: d.kept, wal: d.wal }))];
  const max = Math.max(...cot.map((x) => Math.max(mb(x.kept), mb(x.wal))));
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><line x1="0" y1="170" x2="${W}" y2="170" stroke="#9aa8b8" stroke-width="2"/>`;
  s += `<rect x="0" y="2" width="16" height="16" fill="${DO}"/><text x="22" y="16" font-size="15" fill="#333">kept for the slot</text><rect x="170" y="2" width="16" height="16" fill="#9aa8b8"/><text x="192" y="16" font-size="15" fill="#333">pg_wal on disk (real numbers)</text>`;
  cot.forEach((x, i) => {
    const X = 30 + i * 270, hk = Math.max(3, (mb(x.kept) / max) * 140), hw = (mb(x.wal) / max) * 140;
    s += `<g data-k="s-${i}"><rect x="${X}" y="${170 - hk}" width="90" height="${hk}" rx="5" fill="${DO}"/><text x="${X + 45}" y="${162 - hk}" text-anchor="middle" font-size="15" font-weight="700" fill="${DO}">${x.kept}</text>`;
    s += `<rect x="${X + 100}" y="${170 - hw}" width="90" height="${hw}" rx="5" fill="#9aa8b8"/><text x="${X + 145}" y="${162 - hw}" text-anchor="middle" font-size="15" font-weight="700" fill="#555">${x.wal}</text>`;
    s += `<text x="${X + 95}" y="196" text-anchor="middle" font-size="17" font-weight="700" fill="#333">${x.n}</text></g>`;
  });
  return s + '</svg>';
};
/** Đọc lại cái vừa ghi (sơ đồ + số thật N2A). */
const rywSoDo = () => {
  const W = 1110, H = 190;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs>${mk('l8w', NAU)}${mk('l8x', DO)}${mk('l8g', PG)}</defs>`;
  s += `<g data-k="w-app"><rect x="0" y="60" width="200" height="74" rx="12" fill="#fff7ef" stroke="${CAM}" stroke-width="3"/><text x="100" y="92" text-anchor="middle" font-size="20" font-weight="800" fill="${CAM}">checkout</text><text x="100" y="118" text-anchor="middle" font-size="16" fill="#555">then “thank you” page</text></g>`;
  s += `<g data-k="w-pri"><rect x="430" y="6" width="250" height="64" rx="12" fill="#eef4fa" stroke="${PG}" stroke-width="3"/><text x="555" y="46" text-anchor="middle" font-size="20" font-weight="800" fill="${PG}" font-family="Menlo,monospace">primary</text></g>`;
  s += `<g data-k="w-rep"><rect x="430" y="120" width="250" height="64" rx="12" fill="#fff7ef" stroke="${CAM}" stroke-width="3"/><text x="555" y="160" text-anchor="middle" font-size="20" font-weight="800" fill="${CAM}" font-family="Menlo,monospace">replica</text></g>`;
  s += `<line x1="206" y1="80" x2="424" y2="40" stroke="${PG}" stroke-width="3" marker-end="url(#l8g)"/><text x="300" y="44" text-anchor="middle" font-size="16" fill="${PG}">① INSERT … COMMIT ✓</text>`;
  s += `<line x1="206" y1="116" x2="424" y2="152" stroke="${DO}" stroke-width="3" marker-end="url(#l8x)"/><text x="300" y="166" text-anchor="middle" font-size="16" fill="${DO}">② SELECT id = … ⇒ 0 rows?</text>`;
  s += `<line x1="555" y1="74" x2="555" y2="114" stroke="${NAU}" stroke-width="3" stroke-dasharray="6 5" marker-end="url(#l8w)"/><text x="566" y="100" font-size="15" fill="${NAU}">WAL, a few ms later</text>`;
  s += `<g data-k="w-so"><rect x="730" y="20" width="380" height="150" rx="14" fill="#fdf0ee" stroke="${DO}" stroke-width="3"/><text x="920" y="58" text-anchor="middle" font-size="19" font-weight="800" fill="${DO}">not found on the replica</text>`;
  s += `<text x="920" y="100" text-anchor="middle" font-size="26" font-weight="900" fill="${DO}" font-family="Menlo,monospace">${N.rywIdle} / ${N.rywN} idle</text><text x="920" y="142" text-anchor="middle" font-size="26" font-weight="900" fill="${DO}" font-family="Menlo,monospace">${N.rywLoad} / ${N.rywN} load</text></g>`;
  return s + '</svg>';
};

export const slides = lamDeck({ chuong: 'Lab 8 · CT Shop', bai: '' }, [
  /* 1 */ { cover: true, t: 'Lab 8 — CT Shop:<br>backups that restore,<br>a second server that follows', sub: 'a read-only account · pg_dump + globals · fingerprint diff ·<br>a backup script that cannot lie · streaming replica · lag · failover' },

  /* 2 */ { t: 'Your assignment: CT Shop goes to production', body: two(
    box('The ticket', `<ul style="margin:0">
<li><b>Accounting</b>: its own login, read everything, change nothing</li>
<li><b>Backups</b> + the <b>proof</b> they restore elsewhere</li>
<li>An <b>incident drill</b>: bring back deleted rows</li>
<li>A <b>backup script</b> that never lies</li>
<li>A <b>replica</b> for reports — and its <b>lag</b></li>
<li>The <b>traps</b> of a replica, before production finds them</li></ul>`, 'lam'),
    col(`<div class="tcap">Done means</div>`, steps([
      'ketoan: SELECT <b>8/8</b> tables, writes <b>0/8</b>',
      '<b>diff</b> of two fingerprints prints <b>nothing</b>',
      `reviews ${N.reviewsNow} → <b>${N.reviewsBack}</b>, the 2 new ones kept`,
      'server down ⇒ backup script <b>exit 1</b>, old backups kept',
      'lag stated in <b>bytes</b> and <b>ms</b> — and when it lies',
    ]))), giua: true, to: true },

  /* 3 */ { t: 'Two servers on your laptop', body: `${haiMay()}
${two(nho(T(`$ bash lab8-docker.sh up
${O.S0A.replace(/ \(Debian.*$/m, ' …')}`, { sm: true, hl: [2, 3], title: 'terminal — real output (version line cut)' }), 12.5),
    nho(T(`$ docker cp lab8-start.sql pglab8-primary:/tmp/
$ docker exec -it pglab8-primary psql -U postgres -d ctshop \\
      -f /tmp/lab8-start.sql | tail -n 5
${O.S0B.replace(/\n\(1 row\)$/, '')}`, { sm: true, hl: [6], title: 'terminal — real output' }), 10.5), 'r37')}
${p('Windows: run it in <b>WSL</b> or <b>Git Bash</b>. Both containers use <b>TZ=Asia/Ho_Chi_Minh</b> — times print in Vietnamese time.', 19)}`, giua: true },

  /* 4 */ { t: 'The plan: roles, backups, a replica', body: `<div class="tcap">Video 1 — roles and backups</div>
${flow([{ t: 'R1 · Read-only', s: 'report_ro + ketoan', mau: PG }, { t: 'B1 · Restore test', s: 'dump + globals + diff', mau: CAM }, { t: 'B2 · Incident', s: '78 rows back', mau: DO }, { t: 'B3 · The script', s: 'pipefail · gzip -t', mau: NAU }], { h: 150, fs: 22 })}
<div class="tcap">Video 2 — the replica</div>
${flow([{ t: 'N1 · Streaming', s: 'pg_basebackup -R', mau: PG }, { t: 'N1 · Lag', s: 'bytes · ms · load', mau: CAM }, { t: 'N2 · Traps', s: 'read-your-writes · slot', mau: DO }, { t: 'N2 · Failover', s: 'pg_promote · Patroni', mau: XANH }], { h: 150, fs: 22 })}
${two(box('Tools', 'Chapter 15 — pg_dump/pg_restore, WAL and LSN, pg_basebackup, slots, lag — plus pgbench and monitoring from Chapter 14.', 'lam'),
    box('The habit', 'Every claim is <b>checked</b>: a query, an exit code or a <b>diff</b> — never “it looks fine”.', 'xanh'))}`, giua: true, to: true },

  /* 5 */ { t: 'R1 · A group role and a person', body: `${roleSoDo()}
${two(ma(S('R1A', ['NOLOGIN', 'ON ALL TABLES']), 15), ma(sql(`CREATE ROLE ketoan LOGIN PASSWORD 'ketoan-lab8'
  IN ROLE report_ro;
ALTER ROLE ketoan SET default_transaction_read_only = on;
ALTER ROLE ketoan SET statement_timeout = '5s';
ALTER ROLE ketoan SET search_path = shop;`, { sm: true, hl: [2, 3] }), 15))}
${p(`A <b>group</b> (NOLOGIN) holds the privileges; a <b>person</b> (LOGIN) inherits them. A second accountant = one ${c('CREATE ROLE … IN ROLE report_ro')}, no GRANT to repeat.`, 20)}`, giua: true },

  /* 6 */ { t: 'R1 · Check privileges — do not guess', body: two(col(ma(sql(`SELECT c.relname AS "table",
  has_table_privilege('ketoan', c.oid, 'SELECT') AS sel,
  has_table_privilege('ketoan', c.oid, 'INSERT') AS ins,
  …  UPDATE · DELETE · TRUNCATE
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'shop' AND c.relkind = 'r' ORDER BY 1;`, { sm: true, hl: [2, 3] }), 14), nho(PO('R1D', ['category']), 14)),
    col(nho(PO('R1C', ['report_ro', 'read_only', 'timeout'], { title: 'psql — \\drg ketoan · \\drds ketoan — real output' }), 13), box('The pass criterion of R1', '<b>8</b> rows · <b>sel = t</b> · every other column <b>f</b>. One query, every table — not three manual tries.', 'xanh'))), giua: true },

  /* 7 */ { t: 'R1 · ketoan tries to write', body: `${two(col(nho(PO('R1E', ['ketoan']), 13), nho(PO('R1F', ['946164000']), 13)),
    col(nho(PO('R1G', ['ERROR']), 13), nho(PO('R1H', ['permission denied']), 12.5)))}
${vsd(p('1st refusal: <b>default_transaction_read_only</b> — a <b>default</b>: <code class="i">SET … = off</code> and it is gone.', 19), p('2nd refusal: <b>no GRANT</b> — the wall. PG 15+: nobody creates in <code class="i">public</code> unless granted.', 19), '✗ a seat belt', '✓ the wall')}`, giua: true },

  /* 8 */ { t: 'R1 · The runaway report', body: two(col(sql(`-- as ketoan: 5.000 × 5.000 × 12 = 300 million rows
\\timing on
SELECT count(*) FROM order_item a, order_item b, category c;`, { sm: true, hl: [3] }), nho(PO('R1I', ['canceling', 'Time']), 14),
    sql(`SET statement_timeout = 0;
SHOW statement_timeout;`, { sm: true, hl: [1] }), nho(PO('R1J', [' 0']), 14)),
    col(box('Cancelled after ' + N.timeout + ' s', 'The per-role timeout stopped it — on the shop’s own server.', 'xanh'),
      box('…but it is a default too', 'ketoan can set it to 0. A heavy report on the primary still competes with checkout for CPU and disk.', 'do2'),
      box('The real protection', 'Run reports <b>somewhere else</b>: the replica of N1. Nothing done there can slow the shop.', 'lam')), 'r64'), giua: true, to: true },

  /* 9 */ { t: 'R1 · Trap: GRANT … ON ALL TABLES is a one-off', body: two(col(sql(`-- next week a developer adds a table
CREATE TABLE shop.coupon (
  code    text PRIMARY KEY,
  percent int NOT NULL CHECK (percent BETWEEN 1 AND 50));
INSERT INTO shop.coupon
  VALUES ('BACKTOSCHOOL', 10), ('TET2027', 15);`, { sm: true, hl: [2] }), nho(PO('R1L', ['permission denied']), 14),
    box('Next week, a new table', 'GRANT … ON ALL TABLES granted the <b>8</b> tables that existed <b>then</b>. Nothing more.', 'do2')),
    col(sql(`ALTER DEFAULT PRIVILEGES IN SCHEMA shop
  GRANT SELECT ON TABLES TO report_ro;  -- from now on
GRANT SELECT ON shop.coupon TO report_ro; -- existing
CREATE TABLE shop.gift_card (code text PRIMARY KEY,
  balance numeric(12,2) NOT NULL);
\\ddp`, { sm: true, hl: [1, 2] }), nho(PO('R1M', ['report_ro=r'], { bo: ['ALTER DEFAULT PRIVILEGES', 'GRANT', 'CREATE TABLE'] }), 13), nho(PO('R1N', [' 2', ' 0']), 12.5))), giua: true },

  /* 10 */ { t: 'R1 · Trap: defaults belong to the role that creates', body: `${two(col(sql(`CREATE ROLE ctshop_app LOGIN PASSWORD 'app-lab8';
GRANT USAGE, CREATE ON SCHEMA shop TO ctshop_app;
SET ROLE ctshop_app;          -- what a migration does
CREATE TABLE shop.flash_sale (
  product_id bigint PRIMARY KEY,
  price      numeric(12,2) NOT NULL,
  ends_at    timestamptz NOT NULL);
RESET ROLE;`, { sm: true, hl: [3, 4] }), nho(PO('R1P', ['permission denied']), 14)),
    col(sql(`ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_app
  IN SCHEMA shop GRANT SELECT ON TABLES TO report_ro;
GRANT SELECT ON shop.flash_sale TO report_ro;
\\ddp`, { sm: true, hl: [1] }), nho(PO('R1Q', ['ctshop_app', 'postgres  '], { bo: ['ALTER DEFAULT', 'GRANT'] }), 13), nho(PO('R1R', [' 0']), 13)))}
${box('In production the APP creates the tables', 'Prisma migrations run as the app’s role (<code class="i">ctshop_app</code>). One <b>ALTER DEFAULT PRIVILEGES FOR ROLE</b> per role that creates tables — <code class="i">\\ddp</code> shows one row per creator.', 'lam')}`, giua: true },

  /* 11 */ { t: 'B1 · Two files make a backup', body: two(col(sql(`mkdir -p backups
docker exec pglab8-primary pg_dump -U postgres \\
  -d ctshop -Fc > backups/ctshop.dump
docker exec pglab8-primary pg_dumpall -U postgres \\
  --globals-only > backups/globals.sql
chmod 600 backups/globals.sql   # password hashes inside
wc -c backups/*`, { sm: true, lang: 'bash', hl: [3, 5] }), nho(PO('B1A', ['ctshop.dump', 'globals']), 14),
    box('Why two', 'Roles live in the <b>whole server</b>, not in one database ⇒ never in a pg_dump (lesson 15.1).', 'lam')),
    col(nho(T(O.B1B.split('\n').filter((l) => /ketoan|report_ro|ctshop_app/.test(l)).join('\n'), { sm: true, hl: [2, 4], title: 'grep … globals.sql — real output, lines selected' }).replace(/NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB /g, '… ').replace(/ NOREPLICATION NOBYPASSRLS/g, ' …').replace(/\$4096:…/g, '…'), 11),
      box('globals.sql = a password file', 'Every role with its <b>SCRAM hash</b>. <code class="i">chmod 600</code>, never in git, stored like secrets.', 'do2')), ), giua: true },

  /* 12 */ { t: 'B1 · A restore on another machine that “works”', body: two(col(sql(`$ docker exec -i pglab8-replica \\
    pg_restore -l \\
    < backups/ctshop.dump \\
  | grep … | awk … \\
  | sort | uniq -c`, { sm: true, lang: 'bash' }), nho(T(O.B1C, { sm: true, hl: [1, 2, 4], title: 'table of contents — real output' }), 13.5),
    p('8 tables + their data, 23 constraints, 7 sequence values, <b>9 ACL</b> (the GRANTs), 2 default privileges.', 19)),
    col(sql(`$ docker exec -i pglab8-replica pg_restore -U postgres -d ctshop \\
      < backups/ctshop.dump; echo "exit code: $?"`, { sm: true, lang: 'bash' }), nho(T(O.B1D.split('\n').filter((l) => l.trim()).filter((l, i, a) => i < 4 || i >= a.length - 4).join('\n'), { sm: true, hl: [1, 7, 8], title: `real output (${N.restoreErr} errors, middle lines cut)` }), 10.5),
      box('Would you have noticed?', `${N.restoreErr} errors, exit 1 — and a database that <b>looks</b> complete.`, 'do2')), 'r37'), giua: true },

  /* 13 */ { t: 'B1 · A fingerprint, and let diff judge', body: `${vanTay()}
${two(nho(T(O.B1E.split('\n').filter((l) => /^(\s*\d+$|\d|< acl\|orders|> acl\|orders|< role|> role|---|diff exit)/.test(l)).map((l) => l.replace(/ statement_timeout.*$/, ' …')).join('\n'), { sm: true, title: 'wc -l · diff … — real output, lines selected', hl: [3, 4, 5, 7, 9] }), 12.5),
    col(box('lab8-check.sql — one line per fact', '<b>table</b>: rows + md5 of every row in key order · <b>seq</b>: last value · <b>acl</b>: GRANTs · <b>role</b>: login + settings', 'lam'),
      p(`${N.diffLines} lines differ — <b>none about data</b>. The privileges and roles are missing: accounting could read nothing here.`, 19)), 'r64')}`, giua: true },

  /* 14 */ { t: 'B1 · Globals first, then the dump ⇒ an empty diff', body: two(col(sql(`docker exec pglab8-replica \\
  psql -U postgres -d postgres \\
  -c 'DROP DATABASE ctshop' -c 'CREATE DATABASE ctshop'
# 1) the globals FIRST
docker exec -i pglab8-replica \\
  psql -U postgres -d postgres -q < backups/globals.sql
# 2) then the dump, stopping at the first error
docker exec -i pglab8-replica pg_restore -U postgres \\
  -d ctshop --exit-on-error < backups/ctshop.dump
echo "exit code: $?"`, { sm: true, lang: 'bash', hl: [6, 9] }), nho(PO('B1F', ['already exists', 'exit code: 0']), 14),
    p('<code class="i">role "postgres" already exists</code>: expected, harmless — the globals file always creates the superuser.', 18)),
    col(nho(PO('B1G', ['identical']), 12.5), box(`✓ ${N.facts} facts, identical`, 'Rows, md5, sequences, GRANTs, roles. <b>This</b> is the proof the ticket asked for.', 'xanh'),
      box('Schedule it', 'A backup that has never been restored is only a file. Run this test every week.', 'lam')), ), giua: true },

  /* 15 */ { t: 'B2 · An incident: 10:05, the wrong filter', body: `${dongB2()}
${two(col(sql(`-- 10:05 — the "discontinued notebooks" clean-up,
--         wrong filter: the whole category 9
DELETE FROM review WHERE product_id IN
  (SELECT id FROM product WHERE category_id = 9);`, { sm: true, hl: [3, 4] }), nho(PO('B2A', ['DELETE']), 14)), col(sql(`-- 10:20 — two customers write reviews (keep them!)
INSERT INTO review (product_id, customer_id, rating, body)
SELECT 1, c.id, 5, 'Mới: viết rất êm' FROM customer c
WHERE NOT EXISTS (SELECT 1 FROM review r
  WHERE r.product_id = 1 AND r.customer_id = c.id)
ORDER BY c.id LIMIT 2
RETURNING id, product_id, customer_id, created_at;`, { sm: true, hl: [2] }), nho(PO('B2B', ['679', '680', `${N.reviewsNow}`], { bo: ['created_at', '----'] }), 12)), )}
${p('Restoring the whole table from 02:00 would <b>throw away</b> the 2 reviews of 10:20. The repair must <b>pick rows</b>.', 20)}`, giua: true },

  /* 16 */ { t: 'B2 · Trap: --data-only straight into the live table', body: two(col(sql(`$ docker exec -i pglab8-primary \\
    pg_restore -U postgres -d ctshop \\
    --data-only -t review < backups/ctshop.dump
$ echo "exit code: $?"`, { sm: true, lang: 'bash', hl: [3] }), nho(T(wrap(O.B2C, 62), { sm: true, hl: [1, 2, 3, 4], title: 'real output (wrapped)' }), 13)),
    col(box('One COPY for 678 rows', 'The dump’s data is <b>one</b> <code class="i">COPY review FROM stdin</code>. The first row that still exists (id 1) breaks it — and a failed COPY inserts <b>nothing</b>.', 'do2'),
      box('And the opposite mistake', 'TRUNCATE + restore the whole table ⇒ the 2 reviews of 10:20 are gone.', 'do2'),
      box('So', 'Take the rows <b>out</b> of the dump into a staging table, then insert only the missing ones.', 'xanh')), ), giua: true, to: true },

  /* 17 */ { t: 'B2 · Out of the dump, into a staging table', body: two(col(sql(`$ docker exec -i pglab8-primary \\
    pg_restore --data-only -t review -f - \\
    < backups/ctshop.dump > review-data.sql
$ grep '^COPY' review-data.sql`, { sm: true, lang: 'bash', hl: [2] }), nho(T(wrap(O.B2D.split('\n').slice(1).join('\n'), 60), { sm: true, title: 'real output (wrapped)' }), 13),
      sql(`CREATE TABLE shop.review_restore (LIKE shop.review);`, { sm: true }),
      ma(sql(`$ sed 's/^COPY shop\\.review /COPY shop.review_restore /' \\
    review-data.sql \\
  | docker exec -i pglab8-primary \\
      psql -U postgres -d ctshop`, { sm: true, lang: 'bash', hl: [1] }), 14), nho(T(O.B2F, { sm: true, title: 'real output' }), 13)),
    col(p(`${kw('pg_restore -f -', 'write the SQL to stdout')} instead of into a database`, 20), sql(`SELECT count(*) AS in_backup,
  count(*) FILTER (WHERE NOT EXISTS (SELECT 1
    FROM review x WHERE x.id = r.id)) AS missing_now,
  count(*) FILTER (WHERE NOT EXISTS (…)
    AND r.product_id IN (SELECT id FROM product
      WHERE category_id = 9)) AS missing_in_cat9
FROM review_restore r;`, { sm: true, hl: [2, 3] }), nho(PO('B2G', ['678']), 14),
      box('Read the numbers', `678 in the backup · <b>${N.deleted}</b> missing now · all ${N.deleted} in category 9.`, 'lam'))), giua: true },

  /* 18 */ { t: 'B2 · Put back exactly the ' + N.deleted + ' rows', body: two(col(sql(`INSERT INTO review
SELECT r.* FROM review_restore r
WHERE NOT EXISTS (SELECT 1 FROM review x WHERE x.id = r.id)
  AND r.product_id IN (SELECT id FROM product
                       WHERE category_id = 9);`, { sm: true, hl: [1] }), nho(T(wrap(O.B2H, 62), { sm: true, hl: [1], title: 'psql (17.11) — ctshop · real output (wrapped)' }), 13),
    box('GENERATED ALWAYS AS IDENTITY', 'refuses an explicit id — unless you say you mean it.', 'do2')),
    col(sql(`INSERT INTO review OVERRIDING SYSTEM VALUE
SELECT r.* FROM review_restore r
WHERE NOT EXISTS (…) AND r.product_id IN (… category 9);
SELECT count(*) AS reviews_now,
  count(*) FILTER (WHERE body = 'Mới: viết rất êm')
    AS new_ones_kept
FROM review;
DROP TABLE review_restore;`, { sm: true, hl: [1] }), nho(PO('B2I', [`${N.reviewsBack}`, 'INSERT 0']), 13),
      box(`${N.reviewsNow} → ${N.reviewsBack}`, `The ${N.deleted} reviews are back with their <b>original ids and dates</b>; the 2 new ones are still there.`, 'xanh'))), giua: true },

  /* 19 */ { t: 'B3 · The naive script and three bad nights', body: `${two(sql(`DIR=./backups/daily; KEEP=3
docker exec pglab8-primary \\
    pg_dump -U postgres -d ctshop \\
  | gzip > $DIR/ctshop-$(date +%Y%m%d-%H%M%S).sql.gz
ls -1t $DIR/*.sql.gz | tail -n +$((KEEP + 1)) \\
  | xargs rm -f
echo "✅ backup OK: …"`, { sm: true, lang: 'bash', hl: [3, 4, 5, 6] }),
    nho(T(O.B3B.split('\n').filter((l) => !/^pglab8|total/.test(l)).map((l) => l.replace(/container [0-9a-f]{64}/, 'container 3914…')).slice(0, 4).concat(['…'], O.B3B.split('\n').filter((l) => / 20 backups|^\s+0$/.test(l))).join('\n'), { sm: true, hl: [2, 3], title: 'docker stop pglab8-primary; 3 nights — real output (lines selected)' }), 11.5), )}
${baDem()}`, giua: true },

  /* 20 */ { t: 'B3 · A backup script that cannot lie', body: two(ma(sql(`set -euo pipefail          # a failing pg_dump fails the line
…
docker exec "$CONTAINER" pg_dump -U postgres -d "$DB" \\
  | gzip > "$TMP"  || fail "pg_dump | gzip returned an error"
gzip -t "$TMP"    || fail "the gzip file is corrupt"
gzip -dc "$TMP" | tail -n 10 \\
  | grep -q 'PostgreSQL database dump complete' \\
                  || fail "the dump is incomplete"
mv "$TMP" "$OUT"  # only a checked file gets its real name
ls -1t "$DIR"/ctshop-*.sql.gz | tail -n +$((KEEP + 1)) \\
  | xargs rm -f -- # rotation LAST`, { sm: true, lang: 'bash', hl: [1, 5, 7, 9, 11] }), 15),
    col(steps(['<b>pipefail</b> — the exit code of EVERY part counts', '<b>gzip -t</b> — a complete gzip stream', '<b>"dump complete"</b> — pg_dump finished', '<b>.part</b> name until every check passed', '<b>rotate last</b> — only after a new good backup']),
      box('Plus, in production', 'a copy <b>off</b> the machine · an alert on exit ≠ 0 · WAL archiving (15.2)', 'lam')), 'r64'), giua: true, to: true },

  /* 21 */ { t: 'B3 · Run it: good nights, a dead server, a typo, a cut file', body: two(col(nho(T(O.B3C.split('\n').filter((l) => /✅|exit/.test(l)).join('\n'), { sm: true, title: '3 × bash lab8-backup.sh — real output', hl: [1, 2, 3] }), 12),
    nho(T(O.B3D.replace(/container [0-9a-f]{64}/, 'container 3914…').split('\n').filter((l) => !/^pglab8/.test(l)).join('\n'), { sm: true, title: 'docker stop pglab8-primary; bash lab8-backup.sh — real output', hl: [2, 4] }), 12)),
    col(nho(T(O.B3E.split('\n').filter((l) => !/^pglab8/.test(l)).join('\n').replace(/connection to server on socket "[^"]+" failed: /, ''), { sm: true, title: 'DB=ctshopp bash lab8-backup.sh — real output (shortened)', hl: [2, 4] }), 12),
      nho(T(O.B3F.split('\n').slice(-3).join('\n'), { sm: true, title: 'gzip -t of a copy cut at 20 kB — real output', hl: [3] }), 12),
      box('Every failure', '<b>exit 1</b> · a clear message · the 3 good backups untouched · no half-written file.', 'xanh')), 'r64'), giua: true },

  /* 22 */ { t: 'N1 · Building the replica', body: `${two(sql(`docker run --rm --network pglab8-net \\
  -v pglab8-replica-data:/var/lib/postgresql/data \\
  -e PGPASSWORD=… postgres:17 \\
  pg_basebackup -h pglab8-primary -U replicator \\
    -D /var/lib/postgresql/data \\
    -R -X stream -C -S replica1 \\
    --checkpoint=fast -P`, { sm: true, lang: 'bash', hl: [6, 7] }), nho(T(O.N1A, { sm: true, hl: [3, 4, 6], title: 'bash lab8-docker.sh replica — real output' }), 14))}
<div style="display:grid;grid-template-columns:auto 1fr auto 1fr;gap:6px 14px;font-size:19px">
<b>-R</b><span>write <code class="i">standby.signal</code> + how to reach the primary</span>
<b>-X stream</b><span>also copy the WAL written <b>during</b> the copy</span>
<b>-C -S replica1</b><span>create + use a replication slot</span>
<b>--checkpoint=fast</b><span>do not wait for the next checkpoint (≤ 5 min)</span></div>
${nho(T(O.N1B.replace(/2026-10-26 /g, ''), { sm: true, hl: [1, 4], title: 'docker logs pglab8-replica — real output (date cut)' }), 13)}
${p('Before that, on the primary: a <b>REPLICATION</b> role + the line <code class="i">host replication replicator samenet scram-sha-256</code> in <code class="i">pg_hba.conf</code>.', 18)}`, giua: true },

  /* 23 */ { t: 'N1 · Is it really streaming?', body: two(col(sql(`SELECT pid, usename, application_name, client_addr,
       state, sync_state,
       sent_lsn, write_lsn, flush_lsn, replay_lsn,
       write_lag, flush_lag, replay_lag
FROM pg_stat_replication;          -- on the PRIMARY`, { sm: true, hl: [2] }), nho(P(O.N1C.split('Expanded display is off.\n')[1], { sm: true, hl: [3], title: 'pg_replication_slots — real output' }), 13.5),
      p('<b>state = streaming</b>, sent = write = flush = replay, lags under a millisecond, the slot <b>active</b>.', 20)),
    nho(P(O.N1C.split('Expanded display is off.')[0].replace('Expanded display is on.\n', ''), { sm: true, hl: dong(O.N1C.split('Expanded display is off.')[0].replace('Expanded display is on.\n', ''), ['streaming', 'replay_lsn', 'replay_lag']), title: 'pg_stat_replication (\\x) — real output' }), 13.5), 'r64'), giua: true },

  /* 24 */ { t: 'N1 · Write here, read there — and accounting moves', body: two(col(ma(S('N1D'), 13.5), nho(PO('N1D', ['2001']), 13), nho(PO('N1E', ['2001', 'read-only']), 12.5)),
    col(nho(PO('N1F', ['ketoan', '946164000']), 13),
      box('Nothing to create on the replica', 'A physical replica is a <b>byte copy</b> of the whole server: roles, passwords, GRANTs included.', 'xanh'),
      box('Accounting’s connection string', '<code class="i">postgresql://ketoan:…@db-replica:5432/ctshop</code> — nothing it runs can slow down checkout.', 'lam')), 'r64'), giua: true },

  /* 25 */ { t: 'N1 · Replica vs primary: one line differs', body: two(col(sql(`$ docker exec -i pglab8-primary psql … \\
    -At -f - < lab8-check.sql > check-primary.txt
$ docker exec -i pglab8-replica psql … \\
    -At -f - < lab8-check.sql > check-replica.txt
$ diff check-primary.txt check-replica.txt`, { sm: true, lang: 'bash', hl: [5] }), nho(T(O.N1G, { sm: true, hl: [2, 4], title: 'real output' }), 16)),
    col(box('Not a bug: sequences are logged 32 ahead', 'Logging every <code class="i">nextval</code> to WAL would be too slow, so PostgreSQL logs <b>32 values at a time</b>. The replica replays that record and shows 2033.', 'lam'),
      box('After a failover', 'the new primary continues at <b>2033</b>: ids 2002–2032 are never used. Gaps in identity columns are normal — never promise “numbers without holes”.', 'do2')), 'r64'), giua: true, to: true },

  /* 26 */ { t: 'N1 · Lag while 8 customers order non-stop', body: `${bieuDoTre()}
${two(sql(`SELECT pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)),
       replay_lag
FROM pg_stat_replication;   -- on the primary, every 2 s`, { sm: true, hl: [1, 2] }),
    col(p(`<b>${N.txN1H}</b> orders in 20 s (${N.tps}/s) — never more than <b>${maxH.s}</b> and <b>${maxLagH} ms</b> behind.`, 21),
      p(`${kw('bytes behind', 'pg_wal_lsn_diff')} ${kw('time', 'replay_lag')}`, 19)), 'r64')}`, giua: true },

  /* 27 */ { t: 'N1 · A burst: 500.000 old orders in one statement', body: two(col(sql(`INSERT INTO shop.orders (customer_id, status, created_at, note)
SELECT 1 + g % 290, 'shipped',
       timestamptz '2024-01-01 08:00+07' + g * interval '1 minute',
       'import from the old shop'
FROM generate_series(1, 500000) g;   -- sampled every 1 s meanwhile`, { sm: true, hl: [5] }),
    nho(T(O.N1I.split('\n').filter((l, i, a) => i < 5 || i >= a.length - 3).join('\n'), { sm: true, hl: dong(O.N1I.split('\n').filter((l, i, a) => i < 5 || i >= a.length - 3).join('\n'), ['INSERT 0', 'Time']), title: 'real output (lines selected)' }), 12.5)),
    col(box(`${N.importS} s for the import`, `the replica: at most <b>${MAU_I.reduce((m, x) => (x.b > m.b ? x : m), MAU_I[0]).s}</b> and <b>${maxLagI} ms</b> behind, then back to 0 bytes.`, 'xanh'),
      box('One laptop is the best case', 'free network, an idle replica. Real servers add network, the replica’s disk, and long queries on the replica that pause replay (15.3).', 'do2'),
      box('So', '<b>measure</b> it, and alert on it.', 'lam')), 'r64'), giua: true, to: true },

  /* 28 */ { t: 'N1 · Trap: the “lag” that is not a lag', body: two(col(sql(`-- on the REPLICA, after 20 s with no writes
SELECT now() - pg_last_xact_replay_timestamp()
         AS since_last_replayed_commit,
       pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn()
         AS caught_up;`, { sm: true, hl: [2, 4] }), nho(T(O.N1J, { sm: true, hl: [3, 8], title: 'replica, then primary — real output' }), 13.5)),
    col(box(`${N.idleS} s of “lag”…`, '…on a replica that is fully caught up: the primary simply had nothing to send. An alert on it wakes someone at 3 a.m. for nothing.', 'do2'),
      box('Alert on', '<b>bytes behind</b> on the primary · or check <code class="i">receive LSN = replay LSN</code> first · <code class="i">replay_lag</code> is NULL when there is nothing to replay', 'xanh')), 'r64'), giua: true, to: true },

  /* 29 */ { t: 'N2 · Trap: read your own write from the replica', body: `${rywSoDo()}
${nho(T(O.N2A.replace(/orders NOT found/g, 'NOT found'), { sm: true, hl: [1, 4], title: 'node lab8-ryw.mjs 500 — idle, then with pgbench in the background — real output' }), 12.5)}
${two(box('Fix 1 — wait for the LSN', `after COMMIT read ${c('pg_current_wal_lsn()')} on the primary; on the replica wait until ${c('pg_last_wal_replay_lsn() >= lsn')} — avg <b>${N.rywWait} ms</b>, max ${N.rywMax} ms under load.`, 'lam'),
    box('Fix 2 — what most apps do', 'reads that follow a write (the “thank you” page, “my orders”) go to the <b>primary</b>.', 'xanh'))}`, giua: true },

  /* 30 */ { t: 'N2 · In a Prisma app: read replicas', body: `${ma(sql(`import { readReplicas } from '@prisma/extension-read-replicas';
const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL })
  .$extends(readReplicas({ url: process.env.REPLICA_URL }));

await prisma.orders.findMany();               // model read  → replica
await prisma.orders.create({ data });         // write       → primary
await prisma.$primary().orders.findUnique(…); // just wrote  → primary
await prisma.$transaction([…]);               // tx          → primary
await prisma.$queryRaw\`…\`;                   // raw (0.3)   → primary`, { sm: true, lang: 'typescript', hl: [5, 7] }), 14)}
${two(nho(T(O.N2B, { sm: true, hl: [4, 5], title: 'Prisma 5.22 + extension 0.3.0 — real output' }), 12.5),
      col(box(`${N.prismaMiss} / ${N.prismaN}`, 'orders created with <code class="i">create()</code> not found by the <code class="i">findUnique()</code> right after — the same race inside the ORM. <code class="i">$primary()</code>: 0.', 'do2'),
      p('0.4+ of the extension needs Prisma 6.', 17)))}`, giua: true },

  /* 31 */ { t: 'N2 · Trap: a slot keeps WAL for a replica that is gone', body: `${bieuDoSlot()}
${two(sql(`docker stop pglab8-replica
for night in 1 2 3; do       # the 02:00 job rewrites 500.000 rows
  … UPDATE shop.orders SET note = 'archived, night $night' …
  … CHECKPOINT
  … the slot keeps / pg_wal size
done`, { sm: true, lang: 'bash', hl: [4] }),
    col(nho(T(O.N2E, { sm: true, title: 'real output' }), 12.5), p('Even <b>CHECKPOINT</b> cannot remove what the slot pins. With no limit, the <b>primary’s</b> disk fills up.', 19)), 'r64')}`, giua: true },

  /* 32 */ { t: 'N2 · Cap it, alert on it — and catch up', body: two(col(ma(S('N2F', ['max_slot_wal_keep_size']), 13), nho(PO('N2F', ['-1']), 12), sql(`SHOW max_slot_wal_keep_size;   -- a NEW session
SELECT slot_name, active, wal_status,
  pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(),
                 restart_lsn)) AS kept,
  pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)
    > 256 * 1024 * 1024 AS alert,
  pg_size_pretty(safe_wal_size) AS until_slot_is_lost
FROM pg_replication_slots;   -- every minute`, { sm: true, hl: [5, 6, 7] })),
    col(nho(PO('N2G', ['1GB', 'replica1']), 10.5), nho(T(O.N2H.split('\n').filter((l) => !/^pglab8/.test(l)).join('\n'), { sm: true, title: 'docker start pglab8-replica; … — real output', hl: [3, 9] }), 11.5),
      p(`Back and caught up by itself. pg_wal stays <b>${WAL_SAU}</b>: segments are recycled, trimmed over later checkpoints (≤ max_wal_size).`, 17)), ), giua: true },

  /* 33 */ { t: 'N2 · Failover by hand — and why tools exist', body: two(col(sql(`$ docker stop pglab8-primary          # 14:00
$ docker exec pglab8-replica psql -U postgres -d ctshop \\
    -c "SELECT pg_promote()" -c "INSERT … RETURNING id" …`, { sm: true, lang: 'bash' }),
    nho(T(O.N2I.split('\n').filter((l) => !/^pglab8|^\(1 row\)|^$/.test(l)).join('\n').replace(/2026-10-26 /g, ''), { sm: true, title: 'real output (blank lines cut)', hl: [] }), 11), nho(T(O.N2J, { sm: true, title: 'docker exec pglab8-replica pg_isready -h pglab8-primary', hl: [1] }), 13)),
    col(box('What pg_promote did NOT do', '① the app still points at the old address · ② nobody checked what was lost (async!) · ③ the old primary may come back as a primary — <b>split brain</b> (15.3)', 'do2'),
      box('What tools do', '<b>Patroni</b>: leader election (etcd/Consul), fencing, rewinding the old primary + a stable address (HAProxy, PgBouncer, a virtual IP / DNS) — or a managed service.', 'xanh')), 'r64'), giua: true },

  /* 34 */ { t: 'The production checklist this lab gives you', body: two(`<ul style="font-size:22px">
<li>Accounting: <b>its own login</b>, on the <b>replica</b>, GRANT only SELECT</li>
<li><b>ALTER DEFAULT PRIVILEGES</b> for every role that creates tables</li>
<li>Back up <b>dump + globals</b>; globals like a password file</li>
<li>A <b>weekly restore test</b> + fingerprint diff</li>
<li>A backup script that <b>exits 1</b>; an alert on it; a copy <b>off</b> the machine</li></ul>`,
    `<ul style="font-size:22px">
<li>Lag alerts on <b>bytes</b>, not on “seconds since last commit”</li>
<li>Reads after a write go to the <b>primary</b></li>
<li>Every slot: <b>max_slot_wal_keep_size</b> + an alert; drop dead slots</li>
<li>Failover: <b>Patroni</b> or a managed service, never by hand at 3 a.m.</li>
<li>WAL archiving for PITR (15.2) — a nightly dump loses up to 24 h</li></ul>`), giua: true, to: true },

  /* 35 */ { t: 'Self-check', body: two(`<ol style="font-size:21px;margin:0;padding-left:26px;display:flex;flex-direction:column;gap:12px">
<li>After <code class="i">SET default_transaction_read_only = off</code>, why can ketoan still not insert an order?</li>
<li>The B1 restore printed ${N.restoreErr} errors yet every table had the right rows and md5. What was missing, and which order fixes it?</li>
<li>A dashboard shows replica lag = ${N.idleS} s at 03:00, pg_stat_replication shows 0 bytes behind. Is the replica late?</li></ol>`,
    box('Answers', `1 · The setting is a default any user may change; the wall is the missing INSERT privilege.<br>2 · Roles and so every GRANT — they live in the globals. globals.sql first, then pg_restore, then diff.<br>3 · No: it is the time since the last replayed COMMIT; the primary was idle. Use bytes / replay_lag.`, 'xanh'), 'r64'), giua: true, to: true },

  /* 36 */ { t: 'Summary — and next', body: two(`<ul style="font-size:22px">
<li><b>Roles</b>: a group + people; privileges are the wall</li>
<li><b>Backups</b>: dump + globals, proven by a <b>diff</b></li>
<li><b>Incidents</b>: rows out of the dump into staging, OVERRIDING SYSTEM VALUE</li>
<li><b>Scripts</b>: pipefail, gzip -t, “dump complete”, rotate last</li>
<li><b>Replica</b>: pg_basebackup -R, lag in bytes + ms</li>
<li><b>Traps</b>: read-your-writes, dead slots, manual failover</li></ul>`,
    col(box('Next: Chapter 16', 'Prisma migrations on a real schema, connection pools, the production checklist — this lab is three of its lines.', 'lam'),
      box('Then Lab 9 — the capstone', 'A Node + Prisma app on CT Shop.', ''),
      box('Clean up', '<code class="i">bash lab8-docker.sh down</code> removes both containers, their volumes and the network.', 'xanh')), 'r64'), giua: true, to: true },
]);
