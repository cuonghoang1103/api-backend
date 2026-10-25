#!/usr/bin/env bash
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
\drg ketoan
\drds ketoan
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
\timing on
SELECT count(*) FROM order_item a, order_item b, category c;   -- 300 million rows: a runaway report
--   ⇒ Timing is on.
--   ⇒ ERROR:  canceling statement due to statement timeout
--   ⇒ Time: 5003.741 ms (00:05.004)
\timing off
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
\ddp
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
\ddp
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
grep -E '^(CREATE|ALTER) ROLE|^GRANT' backups/globals.sql | sed -E "s/'SCRAM-SHA-256[^']*'/'SCRAM-SHA-256\$4096:…'/"
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
head -n 3 check-primary.txt; grep -E '^(seq|acl)\|(orders|review)' check-primary.txt
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
sed 's/^COPY shop\.review /COPY shop.review_restore /' review-data.sql \
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
#   ⇒ \unrestrict 5p9PEs3qtdgFVqsapoi9K9soLOsMCTCrS8EbudjLkoPg2heOYWeyrVZqJRZFgpg
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
\x on
SELECT pid, usename, application_name, client_addr, state, sync_state,
       sent_lsn, write_lsn, flush_lsn, replay_lsn, write_lag, flush_lag, replay_lag
FROM pg_stat_replication;
\x off
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
docker exec pglab8-primary psql -U postgres -d ctshop -c "\\timing on" -c "INSERT INTO shop.orders (customer_id, status, created_at, note)
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
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS kept FROM pg_replication_slots" \
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
docker exec pglab8-replica psql -U postgres -d ctshop -c "SELECT pg_promote()" -c "SELECT pg_is_in_recovery() AS still_replica" \
  -c "INSERT INTO shop.orders (customer_id, note) VALUES (9, 'after the failover') RETURNING id" \
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
#   ⇒ ✓ removed pglab8-primary, pglab8-replica, their volumes and pglab8-net
