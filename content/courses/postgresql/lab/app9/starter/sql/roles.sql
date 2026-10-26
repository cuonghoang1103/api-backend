-- ═══════════════════════════════════════════════════════════════════════════
-- Lab 9 · C1 — two accounts: the OWNER (migrations) and the APP (rows only)
-- Lab 9 · C1 — hai tài khoản: CHỦ SỞ HỮU (chạy migration) và ỨNG DỤNG (chỉ đụng vào dòng)
-- Run ONCE as the superuser:  docker exec -i pgdemo psql -U postgres -d ctlab9 < sql/roles.sql
-- The passwords are lab passwords — on a real server they come from a secret store, never from git.
-- ═══════════════════════════════════════════════════════════════════════════
\set ON_ERROR_STOP on
\pset pager off

-- 1 · the owner: owns schema shop and every table in it; `prisma migrate deploy` logs in as this role
CREATE ROLE ctshop_owner LOGIN PASSWORD 'owner-lab9';
ALTER SCHEMA shop OWNER TO ctshop_owner;
DO $$
DECLARE t record;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'shop' LOOP
    EXECUTE format('ALTER TABLE shop.%I OWNER TO ctshop_owner', t.tablename);   -- identity sequences follow their table
  END LOOP;
END $$;

-- 2 · the app: can log in, read and write rows — and nothing else (no CREATE, no ALTER, no DROP, no TRUNCATE)
CREATE ROLE ctshop_app LOGIN PASSWORD 'app-lab9';
-- TODO C1a · only ctshop_owner and ctshop_app may CONNECT to ctlab9 (take it away from PUBLIC first)
-- TODO C1b · ctshop_app: USAGE on schema shop; SELECT, INSERT, UPDATE, DELETE on all its tables; USAGE, SELECT on its sequences

-- 3 · TODO C1c · tables and sequences that FUTURE migrations create (as ctshop_owner) must get the same grants automatically
--     (hint: ALTER DEFAULT PRIVILEGES FOR ROLE … IN SCHEMA …)

-- 4 · TODO C1d · timeouts ON THE ROLE (lesson 16.3): for ctshop_app a statement_timeout, an idle_in_transaction_session_timeout
--     and a lock_timeout; for ctshop_owner a lock_timeout (fail fast) but NO statement_timeout (an index build may take minutes).
--     Write down WHY you picked each value.

-- Check
SELECT r.rolname AS role, r.rolcanlogin AS login, r.rolsuper AS super, s.setconfig AS settings
FROM pg_roles r LEFT JOIN pg_db_role_setting s ON s.setrole = r.oid AND s.setdatabase = 0
WHERE r.rolname LIKE 'ctshop%' ORDER BY 1;
SELECT tablename, tableowner FROM pg_tables WHERE schemaname = 'shop' ORDER BY 1;
