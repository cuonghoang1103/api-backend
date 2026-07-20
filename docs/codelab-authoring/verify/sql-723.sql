\set ON_ERROR_STOP on
\pset pager off
DROP TABLE IF EXISTS notes, accounts, staff CASCADE;
CREATE TABLE staff (
  id     INT PRIMARY KEY,
  name   TEXT NOT NULL,
  email  TEXT NOT NULL,
  salary NUMERIC(10,2) NOT NULL
);
CREATE TABLE accounts (
  id      INT PRIMARY KEY,
  owner   TEXT NOT NULL,
  balance NUMERIC(12,2) NOT NULL
);
CREATE TABLE notes (
  id        INT PRIMARY KEY,
  tenant_id INT NOT NULL,
  body      TEXT NOT NULL
);
INSERT INTO staff   VALUES (1,'Ann','ann@x.io',9000),(2,'Bob','bob@x.io',7000),(3,'Cy','cy@x.io',6500);
INSERT INTO accounts VALUES (1,'Ann',800.00),(2,'Bob',150.00);
INSERT INTO notes   VALUES (1,1,'tenant one alpha'),(2,1,'tenant one beta'),(3,2,'tenant two gamma');

\echo '===== EX 1: Create a Login Role and Grant It the Minimum ====='
DROP ROLE IF EXISTS report_reader;
CREATE ROLE report_reader LOGIN;
GRANT USAGE ON SCHEMA public TO report_reader;
GRANT SELECT ON accounts TO report_reader;
SET ROLE report_reader;
SELECT count(*) AS accounts_visible FROM accounts;
DO $$ BEGIN INSERT INTO accounts VALUES (3,'Cy',10); RAISE NOTICE 'insert unexpectedly allowed'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'insert denied SQLSTATE %', SQLSTATE; END; $$;
DO $$ DECLARE n INT; BEGIN SELECT count(*) INTO n FROM staff; RAISE NOTICE 'staff unexpectedly readable'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'staff denied SQLSTATE %', SQLSTATE; END; $$;
RESET ROLE;
SELECT has_table_privilege('report_reader','accounts','SELECT') AS acc_select, has_table_privilege('report_reader','accounts','INSERT') AS acc_insert, has_table_privilege('report_reader','staff','SELECT') AS staff_select;

\echo '===== EX 2: Manage Access with Group Roles Instead of Per-User Grants ====='
DROP ROLE IF EXISTS alice, dave, analysts;
CREATE ROLE analysts NOLOGIN;
CREATE ROLE alice LOGIN;
CREATE ROLE dave LOGIN;
GRANT USAGE ON SCHEMA public TO analysts;
GRANT SELECT ON accounts, notes TO analysts;
GRANT analysts TO alice;
SET ROLE alice;
SELECT count(*) AS notes_for_alice FROM notes;
RESET ROLE;
SET ROLE dave;
DO $$ DECLARE n INT; BEGIN SELECT count(*) INTO n FROM notes; RAISE NOTICE 'dave unexpectedly allowed'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'dave denied SQLSTATE %', SQLSTATE; END; $$;
RESET ROLE;
SELECT pg_has_role('alice','analysts','member') AS alice_member, pg_has_role('dave','analysts','member') AS dave_member;
REVOKE analysts FROM alice;
SET ROLE alice;
DO $$ DECLARE n INT; BEGIN SELECT count(*) INTO n FROM notes; RAISE NOTICE 'alice still allowed'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'alice after revoke SQLSTATE %', SQLSTATE; END; $$;
RESET ROLE;

\echo '===== EX 3: Hide a Sensitive Column with a Column-Level Grant ====='
DROP ROLE IF EXISTS support;
CREATE ROLE support LOGIN;
GRANT USAGE ON SCHEMA public TO support;
GRANT SELECT (id, name, email) ON staff TO support;
SET ROLE support;
SELECT id, name, email FROM staff ORDER BY id;
DO $$ DECLARE v NUMERIC; BEGIN SELECT salary INTO v FROM staff WHERE id = 1; RAISE NOTICE 'salary unexpectedly readable'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'salary denied SQLSTATE %', SQLSTATE; END; $$;
DO $$ DECLARE r RECORD; BEGIN SELECT * INTO r FROM staff WHERE id = 1; RAISE NOTICE 'select star unexpectedly allowed'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'select star denied SQLSTATE %', SQLSTATE; END; $$;
RESET ROLE;
SELECT has_table_privilege('support','staff','SELECT') AS table_select, has_column_privilege('support','staff','name','SELECT') AS col_name, has_column_privilege('support','staff','salary','SELECT') AS col_salary;

\echo '===== EX 4: Cover Future Tables with ALTER DEFAULT PRIVILEGES ====='
DROP TABLE IF EXISTS invoices, receipts CASCADE;
DROP ROLE IF EXISTS app_ro;
CREATE ROLE app_ro LOGIN;
GRANT USAGE ON SCHEMA public TO app_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_ro;
SET ROLE app_ro;
SELECT count(*) AS notes_readable FROM notes;
RESET ROLE;
CREATE TABLE invoices (id INT PRIMARY KEY, amount NUMERIC(10,2));
INSERT INTO invoices VALUES (1, 99.00);
SET ROLE app_ro;
DO $$ DECLARE n INT; BEGIN SELECT count(*) INTO n FROM invoices; RAISE NOTICE 'invoices unexpectedly readable'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'invoices denied SQLSTATE %', SQLSTATE; END; $$;
RESET ROLE;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO app_ro;
CREATE TABLE receipts (id INT PRIMARY KEY, amount NUMERIC(10,2));
INSERT INTO receipts VALUES (1, 12.00);
SET ROLE app_ro;
SELECT count(*) AS receipts_readable FROM receipts;
DO $$ DECLARE n INT; BEGIN SELECT count(*) INTO n FROM invoices; RAISE NOTICE 'invoices now readable'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'invoices still denied SQLSTATE %', SQLSTATE; END; $$;
RESET ROLE;

\echo '===== EX 5: Take Back What PUBLIC Was Given by Default ====='
CREATE OR REPLACE FUNCTION total_payroll() RETURNS NUMERIC LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$ SELECT COALESCE(SUM(salary), 0) FROM staff; $$;
DROP ROLE IF EXISTS viewer;
CREATE ROLE viewer LOGIN;
GRANT USAGE ON SCHEMA public TO viewer;
GRANT SELECT ON notes TO viewer;
SET ROLE viewer;
DO $$ DECLARE n INT; BEGIN SELECT count(*) INTO n FROM staff; RAISE NOTICE 'staff unexpectedly readable'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'staff denied SQLSTATE %', SQLSTATE; END; $$;
SELECT total_payroll() AS payroll_via_function;
RESET ROLE;
REVOKE EXECUTE ON FUNCTION total_payroll() FROM PUBLIC;
SET ROLE viewer;
DO $$ DECLARE v NUMERIC; BEGIN v := total_payroll(); RAISE NOTICE 'function still callable, returned %', v; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'function denied SQLSTATE %', SQLSTATE; END; $$;
RESET ROLE;
SELECT has_function_privilege('viewer','total_payroll()','EXECUTE') AS viewer_can_execute;

\echo '===== EX 6: Isolate Tenants with Row-Level Security ====='
DROP ROLE IF EXISTS tenant_app;
CREATE ROLE tenant_app LOGIN;
GRANT USAGE ON SCHEMA public TO tenant_app;
GRANT SELECT, INSERT ON notes TO tenant_app;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON notes;
CREATE POLICY tenant_isolation ON notes USING (tenant_id = NULLIF(current_setting('app.tenant', true), '')::int) WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant', true), '')::int);
SET ROLE tenant_app;
SELECT set_config('app.tenant', '1', false);
SELECT body AS tenant1_notes FROM notes ORDER BY id;
SELECT count(*) AS tenant1_raw_count FROM notes;
SELECT set_config('app.tenant', '2', false);
SELECT body AS tenant2_notes FROM notes ORDER BY id;
SELECT set_config('app.tenant', '', false);
SELECT count(*) AS no_context_count FROM notes;
SELECT set_config('app.tenant', '1', false);
DO $$ BEGIN INSERT INTO notes VALUES (9, 2, 'planted by tenant one'); RAISE NOTICE 'cross-tenant insert unexpectedly allowed'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'cross-tenant insert denied SQLSTATE %', SQLSTATE; END; $$;
RESET ROLE;
SELECT count(*) AS owner_sees FROM notes;

\echo '===== EX 7: Grant Controlled Escalation with a SECURITY DEFINER Function ====='
CREATE OR REPLACE FUNCTION headcount() RETURNS INT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$ SELECT count(*)::int FROM staff; $$;
REVOKE EXECUTE ON FUNCTION headcount() FROM PUBLIC;
DROP ROLE IF EXISTS kiosk;
CREATE ROLE kiosk LOGIN;
GRANT USAGE ON SCHEMA public TO kiosk;
GRANT EXECUTE ON FUNCTION headcount() TO kiosk;
SET ROLE kiosk;
DO $$ DECLARE n INT; BEGIN SELECT count(*) INTO n FROM staff; RAISE NOTICE 'staff unexpectedly readable'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'staff denied SQLSTATE %', SQLSTATE; END; $$;
SELECT headcount() AS real_headcount;
CREATE TEMP TABLE staff (id INT, name TEXT, email TEXT, salary NUMERIC);
INSERT INTO staff SELECT g, 'fake', 'f@x.io', 0 FROM generate_series(1,5) g;
SELECT headcount() AS headcount_after_decoy;
DROP TABLE staff;
RESET ROLE;
SELECT prosecdef AS security_definer, proconfig AS settings FROM pg_proc WHERE proname = 'headcount';

\echo '===== EX 8: Audit Who Can Do What ====='
GRANT SELECT ON accounts TO PUBLIC;
SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_name = 'accounts' AND grantee <> 'postgres' ORDER BY grantee, privilege_type;
SELECT r.rolname AS can_write_notes FROM pg_roles r WHERE r.rolname NOT LIKE 'pg\_%' AND r.rolname <> 'postgres' AND has_table_privilege(r.rolname, 'notes', 'INSERT, UPDATE, DELETE') ORDER BY r.rolname;
SELECT table_name || ':' || privilege_type AS public_grant FROM information_schema.role_table_grants WHERE grantee = 'PUBLIC' AND table_schema = 'public' ORDER BY 1;
SELECT rolname AS privileged_role, rolsuper, rolbypassrls FROM pg_roles WHERE (rolsuper OR rolbypassrls) AND rolname NOT LIKE 'pg\_%' ORDER BY rolname;
REVOKE SELECT ON accounts FROM PUBLIC;
SELECT count(*) AS public_grants_left FROM information_schema.role_table_grants WHERE grantee = 'PUBLIC' AND table_schema = 'public';

\echo '===== EX 9: Build a Least-Privilege Role Set for an Application ====='
DROP ROLE IF EXISTS svc_report, svc_api, svc_deploy, app_reader, app_writer, app_migrator;
CREATE ROLE app_reader NOLOGIN;
CREATE ROLE app_writer NOLOGIN;
CREATE ROLE app_migrator NOLOGIN;
GRANT USAGE ON SCHEMA public TO app_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_reader;
GRANT app_reader TO app_writer;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_writer;
GRANT app_writer TO app_migrator;
GRANT CREATE ON SCHEMA public TO app_migrator;
CREATE ROLE svc_report LOGIN;
CREATE ROLE svc_api LOGIN;
CREATE ROLE svc_deploy LOGIN;
GRANT app_reader TO svc_report;
GRANT app_writer TO svc_api;
GRANT app_migrator TO svc_deploy;
SELECT r AS role_name, has_table_privilege(r,'accounts','SELECT') AS can_select, has_table_privilege(r,'accounts','INSERT') AS can_insert, has_table_privilege(r,'accounts','DELETE') AS can_delete, has_schema_privilege(r,'public','CREATE') AS can_create FROM (VALUES ('svc_report'),('svc_api'),('svc_deploy')) AS t(r) ORDER BY r;
SET ROLE svc_api;
DO $$ BEGIN EXECUTE 'CREATE TABLE should_not_exist (id INT)'; RAISE NOTICE 'svc_api unexpectedly created a table'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'svc_api CREATE TABLE denied SQLSTATE %', SQLSTATE; END; $$;
RESET ROLE;

\echo '===== EX 10: Capstone: Harden a Multi-Tenant Table and Try to Break In ====='
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON notes;
CREATE POLICY tenant_isolation ON notes USING (tenant_id = NULLIF(current_setting('app.tenant', true), '')::int) WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant', true), '')::int);
DROP ROLE IF EXISTS tenant_svc, auditor;
CREATE ROLE tenant_svc LOGIN;
GRANT USAGE ON SCHEMA public TO tenant_svc;
GRANT SELECT, INSERT ON notes TO tenant_svc;
CREATE OR REPLACE FUNCTION note_count_for(p_tenant INT) RETURNS INT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$ SELECT count(*)::int FROM notes WHERE tenant_id = p_tenant; $$;
REVOKE EXECUTE ON FUNCTION note_count_for(INT) FROM PUBLIC;
CREATE ROLE auditor LOGIN;
GRANT USAGE ON SCHEMA public TO auditor;
GRANT EXECUTE ON FUNCTION note_count_for(INT) TO auditor;
SET ROLE tenant_svc;
SELECT set_config('app.tenant','1',false);
SELECT count(*) AS t1 FROM notes;
SELECT count(*) AS raw FROM notes;
SELECT count(*) AS cross_tenant FROM notes WHERE id = 3;
DO $$ BEGIN INSERT INTO notes VALUES (9, 2, 'planted'); RAISE NOTICE 'plant unexpectedly allowed'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'plant denied SQLSTATE %', SQLSTATE; END; $$;
DO $$ BEGIN DELETE FROM notes WHERE id = 1; RAISE NOTICE 'delete unexpectedly allowed'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'delete denied SQLSTATE %', SQLSTATE; END; $$;
SELECT set_config('app.tenant','2',false);
SELECT count(*) AS t2 FROM notes;
RESET ROLE;
-- FORCE binds the table OWNER — so hand the table to a non-superuser to see it.
DROP ROLE IF EXISTS notes_owner;
CREATE ROLE notes_owner NOLOGIN;
GRANT USAGE ON SCHEMA public TO notes_owner;
ALTER TABLE notes OWNER TO notes_owner;

SET ROLE notes_owner;
SELECT set_config('app.tenant','',false);
SELECT count(*) AS owner_under_force FROM notes;
RESET ROLE;

-- A superuser bypasses row-level security regardless of FORCE.
SELECT count(*) AS superuser_sees FROM notes;
SET ROLE auditor;
SELECT note_count_for(2) AS auditor_view;
RESET ROLE;
ALTER TABLE notes OWNER TO postgres;
ALTER TABLE notes OWNER TO postgres;
ALTER TABLE notes NO FORCE ROW LEVEL SECURITY;
