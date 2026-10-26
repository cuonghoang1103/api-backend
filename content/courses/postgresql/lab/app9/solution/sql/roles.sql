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
REVOKE ALL ON DATABASE ctlab9 FROM PUBLIC;                 -- nobody connects by default …
GRANT CONNECT ON DATABASE ctlab9 TO ctshop_owner, ctshop_app;   -- … except these two
GRANT USAGE ON SCHEMA shop TO ctshop_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA shop TO ctshop_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA shop TO ctshop_app;

-- 3 · tables that FUTURE migrations create (as ctshop_owner) get the same grants automatically
ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_owner IN SCHEMA shop
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ctshop_app;
ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_owner IN SCHEMA shop
  GRANT USAGE, SELECT ON SEQUENCES TO ctshop_app;

-- 4 · timeouts ON THE ROLE: every connection of the app gets them, whatever the code forgets (lesson 16.3)
ALTER ROLE ctshop_app SET statement_timeout = '5s';                     -- a runaway query is cancelled
ALTER ROLE ctshop_app SET idle_in_transaction_session_timeout = '10s';  -- a forgotten transaction is closed (case 1 of 16.4)
ALTER ROLE ctshop_app SET lock_timeout = '3s';                          -- never queue forever behind a lock
ALTER ROLE ctshop_owner SET lock_timeout = '5s';                        -- a migration that cannot get its lock fails fast …
ALTER ROLE ctshop_owner SET statement_timeout = 0;                      -- … but an index build may take minutes

-- Check
SELECT r.rolname AS role, r.rolcanlogin AS login, r.rolsuper AS super, s.setconfig AS settings
FROM pg_roles r LEFT JOIN pg_db_role_setting s ON s.setrole = r.oid AND s.setdatabase = 0
WHERE r.rolname LIKE 'ctshop%' ORDER BY 1;
SELECT tablename, tableowner FROM pg_tables WHERE schemaname = 'shop' ORDER BY 1;
