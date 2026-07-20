// SQL module 723 (database-security-users-and-access-control) — 10 exercises. PostgreSQL.
// Every GRANT, REVOKE, policy and privilege check below was executed against a real
// postgres:16 server; the SQLSTATEs and true/false matrices are its actual output.
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'sql';
const moduleSlug = 'database-security-users-and-access-control';

const SETUP = `DROP TABLE IF EXISTS notes, accounts, staff CASCADE;
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
INSERT INTO notes   VALUES (1,1,'tenant one alpha'),(2,1,'tenant one beta'),(3,2,'tenant two gamma');`;

const ex = [
  {
    title: 'Create a Login Role and Grant It the Minimum',
    difficulty: 'EASY', estimatedMinutes: 20, points: 10,
    concepts: ['CREATE ROLE', 'USAGE on schema', 'GRANT SELECT', 'insufficient_privilege 42501', 'has_table_privilege'],
    prerequisites: ['SELECT', 'basic DDL'],
    tags: ['security', 'roles', 'grant', 'postgres', 'least-privilege'],
    problemHtml: `<p>Most applications connect as the database owner, which means any injection hole or leaked credential can read every table, drop every table, and alter the schema. PostgreSQL can prevent that on its own: give each consumer a role with exactly the privileges it needs, and the database refuses everything else regardless of what SQL arrives.</p>
<p>Two grants are needed before a role can read anything, and forgetting the first is the classic beginner confusion: <code>USAGE</code> on the <strong>schema</strong> makes the objects inside it visible at all, and <code>SELECT</code> on the <strong>table</strong> allows reading it.</p>
<ul>
<li>Create a login role <code>report_reader</code>.</li>
<li>Grant it <code>USAGE</code> on schema <code>public</code> and <code>SELECT</code> on <code>accounts</code>.</li>
<li>Switch to it with <code>SET ROLE</code> and read the accounts, printing the row count.</li>
<li>Still as that role, attempt an <code>INSERT</code> into <code>accounts</code> and a <code>SELECT</code> from <code>staff</code>. Catch both and print the <code>SQLSTATE</code>.</li>
<li><code>RESET ROLE</code> and print a privilege matrix from <code>has_table_privilege</code>: the role's <code>SELECT</code> and <code>INSERT</code> on <code>accounts</code>, and its <code>SELECT</code> on <code>staff</code>.</li>
</ul>
<p>Use <code>SET ROLE</code> rather than a second connection — it changes the current user for exactly this purpose.</p>`,
    inputSpec: 'The accounts table (2 rows), the staff table (3 rows), and no custom roles yet.',
    outputSpec:
      'The role reads 2 accounts; both the insert and the staff read fail with SQLSTATE 42501; and the matrix reads true for SELECT on accounts, false for INSERT on accounts, false for SELECT on staff.',
    constraints: 'Grant only what the task lists. Do not make the role a superuser and do not grant ALL PRIVILEGES.',
    examplesJson: [
      { input: 'SET ROLE report_reader; SELECT count(*) FROM accounts', output: '2', explanation: 'USAGE on the schema plus SELECT on the table is the minimum that makes a read possible.' },
      { input: 'INSERT INTO accounts VALUES (3, ...) as that role', output: 'SQLSTATE 42501', explanation: 'insufficient_privilege — the database refuses regardless of what the application intended.' },
      { input: "has_table_privilege('report_reader','staff','SELECT')", output: 'false', explanation: 'A grant on one table says nothing about any other table.' },
    ],
    hintsJson: [
      'A role needs USAGE on the schema before any grant inside it has an effect.',
      'SET ROLE changes the current user within the session; RESET ROLE goes back.',
      'Wrap the failing statements in a DO block with an EXCEPTION handler to capture SQLSTATE.',
      'has_table_privilege(role, table, privilege) answers the question without trying it.',
    ],
    solution: `DROP ROLE IF EXISTS report_reader;
CREATE ROLE report_reader LOGIN;

GRANT USAGE ON SCHEMA public TO report_reader;
GRANT SELECT ON accounts TO report_reader;

SET ROLE report_reader;
SELECT count(*) AS accounts_visible FROM accounts;

DO $$
BEGIN
  INSERT INTO accounts VALUES (3, 'Cy', 10);
  RAISE NOTICE 'insert unexpectedly allowed';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'insert denied SQLSTATE %', SQLSTATE;
END;
$$;

DO $$
DECLARE n INT;
BEGIN
  SELECT count(*) INTO n FROM staff;
  RAISE NOTICE 'staff unexpectedly readable';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'staff denied SQLSTATE %', SQLSTATE;
END;
$$;

RESET ROLE;
SELECT has_table_privilege('report_reader','accounts','SELECT') AS acc_select,
       has_table_privilege('report_reader','accounts','INSERT') AS acc_insert,
       has_table_privilege('report_reader','staff','SELECT')    AS staff_select;`,
    solutionExplanationHtml: `<p>Privileges in PostgreSQL are additive and start at nothing: a fresh role can do essentially none of what you care about until something is granted. That is the right default, and it makes the two-step nature of the grant worth internalising. <code>USAGE</code> on a schema is permission to <em>look inside the container</em>; <code>SELECT</code> on a table is permission to read that table. Granting only the second produces the maddening "permission denied for schema public" that sends people reaching for superuser.</p>
<p><code>SET ROLE</code> is the right way to test this. It switches the current user inside the session, so the checks run exactly as that role would experience them, and <code>RESET ROLE</code> returns you to the owner without reconnecting. Testing privileges as the owner proves nothing, because the owner bypasses most of them.</p>
<p>SQLSTATE <code>42501</code> — <code>insufficient_privilege</code> — is the code to recognise. It arrives from the driver rather than from any application logic, which means it holds even when the application has been fully compromised: a role without <code>INSERT</code> cannot insert no matter what SQL reaches the server. That is the property that distinguishes database-level authorisation from every check written in application code.</p>
<p>The matrix at the end shows the last idea worth keeping: privileges are per object, not per role in the abstract. <code>report_reader</code> can read <code>accounts</code> and knows nothing of <code>staff</code>, and a table created tomorrow will be equally invisible until it is granted — a fact that becomes exercise 4's trap. Note also that a role is only usable for connecting when it has <code>LOGIN</code>; roles without it are groups, which is exactly what the next exercise is about.</p>`,
    check: `DROP ROLE IF EXISTS report_reader;
CREATE ROLE report_reader LOGIN;
GRANT USAGE ON SCHEMA public TO report_reader;
GRANT SELECT ON accounts TO report_reader;
SET ROLE report_reader;
SELECT count(*) AS accounts_visible FROM accounts;
DO $$ BEGIN INSERT INTO accounts VALUES (3,'Cy',10); RAISE NOTICE 'insert unexpectedly allowed'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'insert denied SQLSTATE %', SQLSTATE; END; $$;
DO $$ DECLARE n INT; BEGIN SELECT count(*) INTO n FROM staff; RAISE NOTICE 'staff unexpectedly readable'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'staff denied SQLSTATE %', SQLSTATE; END; $$;
RESET ROLE;
SELECT has_table_privilege('report_reader','accounts','SELECT') AS acc_select, has_table_privilege('report_reader','accounts','INSERT') AS acc_insert, has_table_privilege('report_reader','staff','SELECT') AS staff_select;`,
  },
  {
    title: 'Manage Access with Group Roles Instead of Per-User Grants',
    difficulty: 'EASY', estimatedMinutes: 25, points: 10,
    concepts: ['NOLOGIN group roles', 'GRANT role TO role', 'privilege inheritance', 'REVOKE membership', 'pg_has_role'],
    prerequisites: ['CREATE ROLE', 'GRANT'],
    tags: ['security', 'roles', 'groups', 'postgres', 'administration'],
    problemHtml: `<p>Granting table by table to person by person does not survive a team. The fix is the same as in every access-control system: grant to a <strong>group</strong>, then put people in the group. In PostgreSQL there is no separate "group" object — a group is simply a role without <code>LOGIN</code>, and membership is <code>GRANT groupname TO username</code>.</p>
<ul>
<li>Create a group role <code>analysts</code> with <code>NOLOGIN</code>, and two login roles <code>alice</code> and <code>dave</code>.</li>
<li>Grant <code>USAGE</code> on the schema and <code>SELECT</code> on <code>accounts</code> and <code>notes</code> to the <strong>group only</strong>.</li>
<li>Add <code>alice</code> to the group. Leave <code>dave</code> out.</li>
<li>As <code>alice</code>, count the notes. As <code>dave</code>, attempt the same and report the <code>SQLSTATE</code>.</li>
<li>Print <code>pg_has_role</code> for both users against <code>analysts</code>.</li>
<li>Revoke the membership from <code>alice</code>, then show her access is gone — report the <code>SQLSTATE</code> — without any table grant having changed.</li>
</ul>`,
    inputSpec: 'The notes table (3 rows) and the accounts table (2 rows), with the role from exercise 1 already present.',
    outputSpec:
      'Alice reads 3 notes while she is a member; dave is refused with 42501; pg_has_role reports true for alice and false for dave; and after the membership is revoked alice is refused with 42501 too.',
    constraints: 'Table privileges must be granted to the group, never to the individual users. Removing access must be done by revoking membership, not by revoking table privileges.',
    examplesJson: [
      { input: 'GRANT analysts TO alice; SET ROLE alice; SELECT count(*) FROM notes', output: '3', explanation: 'Alice inherits every privilege the group holds, without a single grant naming her.' },
      { input: 'SET ROLE dave; SELECT count(*) FROM notes', output: 'SQLSTATE 42501', explanation: 'Dave exists but belongs to no group, so he has no privileges at all.' },
      { input: 'REVOKE analysts FROM alice; then the same read', output: 'SQLSTATE 42501', explanation: 'One revoke removes every privilege the group carried — the whole point of the indirection.' },
    ],
    hintsJson: [
      'A group role is just CREATE ROLE ... NOLOGIN — there is no separate GROUP object.',
      'GRANT groupname TO username adds a member; REVOKE ... FROM removes one.',
      'Members inherit automatically unless the role was created with NOINHERIT.',
      'pg_has_role(user, group, \'member\') answers membership questions without trying a query.',
    ],
    solution: `DROP ROLE IF EXISTS alice, dave, analysts;
CREATE ROLE analysts NOLOGIN;
CREATE ROLE alice LOGIN;
CREATE ROLE dave LOGIN;

-- Privileges live on the GROUP, never on the people.
GRANT USAGE ON SCHEMA public TO analysts;
GRANT SELECT ON accounts, notes TO analysts;

GRANT analysts TO alice;

SET ROLE alice;
SELECT count(*) AS notes_for_alice FROM notes;
RESET ROLE;

SET ROLE dave;
DO $$
DECLARE n INT;
BEGIN
  SELECT count(*) INTO n FROM notes;
  RAISE NOTICE 'dave unexpectedly allowed';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'dave denied SQLSTATE %', SQLSTATE;
END;
$$;
RESET ROLE;

SELECT pg_has_role('alice','analysts','member') AS alice_member,
       pg_has_role('dave','analysts','member')  AS dave_member;

REVOKE analysts FROM alice;
SET ROLE alice;
DO $$
DECLARE n INT;
BEGIN
  SELECT count(*) INTO n FROM notes;
  RAISE NOTICE 'alice still allowed';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'alice after revoke SQLSTATE %', SQLSTATE;
END;
$$;
RESET ROLE;`,
    solutionExplanationHtml: `<p>PostgreSQL deliberately has one object type — the role — playing both parts. A role with <code>LOGIN</code> is what we call a user; a role without it is what we call a group; and <code>GRANT groupname TO username</code> makes one a member of the other. Recognising that they are the same thing removes most of the confusion around the syntax.</p>
<p>The operational payoff appears in the last step. Removing Alice's access took one <code>REVOKE</code> of a membership, and no table grant was touched. In the per-user alternative, offboarding means finding every grant ever made to that person across every table, view, sequence and function — a task nobody completes correctly, which is how ex-employees keep read access to a reporting table for years. Adding a table works the same way in reverse: grant it once to <code>analysts</code> and every current and future member has it.</p>
<p>Inheritance is automatic because roles are created with <code>INHERIT</code> by default: a member simply has the group's privileges. The alternative, <code>NOINHERIT</code>, requires an explicit <code>SET ROLE</code> before the privileges apply, which is occasionally useful for administrative roles where you want elevation to be a deliberate act rather than an ambient state.</p>
<p>Two practical notes. <code>pg_has_role</code> answers membership questions directly, and it understands indirect membership through nested groups — groups can contain groups, which is how larger organisations model "engineering ⊂ staff". And note what a group cannot do: it holds privileges, not identity, so audit logs record the login role that acted, which is exactly what you want when tracing who read a table.</p>`,
    diagramMermaid: `flowchart TD
  A[analysts group role NOLOGIN] -->|holds| B[USAGE on schema]
  A -->|holds| C[SELECT on accounts and notes]
  D[alice LOGIN] -->|member of| A
  E[dave LOGIN] -.->|not a member| A
  F[revoke membership] --> G[alice loses everything at once]`,
    check: `DROP ROLE IF EXISTS alice, dave, analysts;
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
RESET ROLE;`,
  },
  {
    title: 'Hide a Sensitive Column with a Column-Level Grant',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 15,
    concepts: ['GRANT SELECT (columns)', 'has_column_privilege', 'SELECT * fails under column grants', 'views as the alternative', 'partial table access'],
    prerequisites: ['GRANT', 'roles'],
    tags: ['security', 'columns', 'grant', 'postgres', 'pii'],
    problemHtml: `<p>Access is not always all-or-nothing at the table level. A support tool may legitimately need names and emails from <code>staff</code> while having no business seeing salaries. PostgreSQL supports <strong>column-level privileges</strong> for exactly this: <code>GRANT SELECT (id, name, email) ON staff</code> permits those columns and refuses the rest.</p>
<ul>
<li>Create a login role <code>support</code> with <code>USAGE</code> on the schema and <code>SELECT (id, name, email)</code> on <code>staff</code>.</li>
<li>As that role, read <code>id, name, email</code> ordered by <code>id</code> and print the rows.</li>
<li>Attempt <code>SELECT salary</code> and print the <code>SQLSTATE</code>.</li>
<li>Attempt <code>SELECT *</code> and print the <code>SQLSTATE</code> — think about why it fails even though three of the four columns are allowed.</li>
<li><code>RESET ROLE</code> and print the checks: <code>has_table_privilege</code> for <code>SELECT</code> on <code>staff</code>, and <code>has_column_privilege</code> for <code>name</code> and for <code>salary</code>.</li>
</ul>`,
    inputSpec: 'The staff table with Ann 9000, Bob 7000 and Cy 6500.',
    outputSpec:
      'Three rows of id, name and email; the salary read and the SELECT * both fail with 42501; and the checks report false for the table-level privilege, true for the name column and false for the salary column.',
    constraints: 'Use a column list on the GRANT. Do not create a view for this exercise — the point is the column privilege itself.',
    examplesJson: [
      { input: 'SELECT id, name, email FROM staff as the support role', output: '1 Ann ann@x.io / 2 Bob bob@x.io / 3 Cy cy@x.io', explanation: 'Exactly the granted columns are readable.' },
      { input: 'SELECT salary FROM staff', output: 'SQLSTATE 42501', explanation: 'The ungranted column is refused even though the table is otherwise readable.' },
      { input: "has_table_privilege('support','staff','SELECT')", output: 'false', explanation: 'Column grants do not add up to a table grant — which is why SELECT * fails: it asks for every column, including salary.' },
    ],
    hintsJson: [
      'The column list goes in parentheses after the privilege: GRANT SELECT (a, b) ON t TO r.',
      'SELECT * expands to every column, so it needs privileges on every column.',
      'has_column_privilege answers per column; has_table_privilege stays false.',
      'Applications that use SELECT * will break under column grants — that is a feature, not a bug.',
    ],
    solution: `DROP ROLE IF EXISTS support;
CREATE ROLE support LOGIN;
GRANT USAGE ON SCHEMA public TO support;
GRANT SELECT (id, name, email) ON staff TO support;

SET ROLE support;
SELECT id, name, email FROM staff ORDER BY id;

DO $$
DECLARE v NUMERIC;
BEGIN
  SELECT salary INTO v FROM staff WHERE id = 1;
  RAISE NOTICE 'salary unexpectedly readable';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'salary denied SQLSTATE %', SQLSTATE;
END;
$$;

DO $$
DECLARE r RECORD;
BEGIN
  SELECT * INTO r FROM staff WHERE id = 1;
  RAISE NOTICE 'select star unexpectedly allowed';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'select star denied SQLSTATE %', SQLSTATE;
END;
$$;
RESET ROLE;

SELECT has_table_privilege('support','staff','SELECT')            AS table_select,
       has_column_privilege('support','staff','name','SELECT')    AS col_name,
       has_column_privilege('support','staff','salary','SELECT')  AS col_salary;`,
    solutionExplanationHtml: `<p>Column privileges let the boundary follow the sensitivity of the data rather than the shape of the table, which matters because tables accumulate columns nobody planned for. The <code>staff</code> table is legitimately needed by half the organisation; the salary column is needed by almost none of it.</p>
<p>The <code>SELECT *</code> failure is the detail that catches people out, and the reason is simple once stated: <code>*</code> expands to every column, so the statement asks for <code>salary</code> too and is refused. This has a real consequence for adoption — any code doing <code>SELECT *</code> breaks the day column grants are introduced. That is arguably a benefit, since <code>SELECT *</code> is how sensitive columns leak into logs and API responses in the first place, but it means the change is not transparent and must be coordinated.</p>
<p>Note that <code>has_table_privilege</code> stays <strong>false</strong> while individual columns are readable. The two are genuinely different grants, and an audit script that only inspects table-level privileges will report this role as having no access at all — a blind spot worth knowing about when reviewing who can see what.</p>
<p>Column grants also have limits. They cover <code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code> and <code>REFERENCES</code>, but they cannot express row-dependent rules ("only your own team's salaries") — that is row-level security, in exercise 6. And they do not stop inference: a role that can read a salary-derived column, or run an aggregate over it, may learn what the column says without reading it. When the requirement is truly "this role must never learn these values", a view that omits the column, or keeping the data in a separate table, is easier to reason about than a lattice of column grants.</p>`,
    check: `DROP ROLE IF EXISTS support;
CREATE ROLE support LOGIN;
GRANT USAGE ON SCHEMA public TO support;
GRANT SELECT (id, name, email) ON staff TO support;
SET ROLE support;
SELECT id, name, email FROM staff ORDER BY id;
DO $$ DECLARE v NUMERIC; BEGIN SELECT salary INTO v FROM staff WHERE id = 1; RAISE NOTICE 'salary unexpectedly readable'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'salary denied SQLSTATE %', SQLSTATE; END; $$;
DO $$ DECLARE r RECORD; BEGIN SELECT * INTO r FROM staff WHERE id = 1; RAISE NOTICE 'select star unexpectedly allowed'; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'select star denied SQLSTATE %', SQLSTATE; END; $$;
RESET ROLE;
SELECT has_table_privilege('support','staff','SELECT') AS table_select, has_column_privilege('support','staff','name','SELECT') AS col_name, has_column_privilege('support','staff','salary','SELECT') AS col_salary;`,
  },
  {
    title: 'Cover Future Tables with ALTER DEFAULT PRIVILEGES',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 15,
    concepts: ['GRANT ON ALL TABLES applies only to existing ones', 'ALTER DEFAULT PRIVILEGES', 'grantor scoping', 'migrations breaking access', 'sequences too'],
    prerequisites: ['GRANT', 'roles'],
    tags: ['security', 'grant', 'migrations', 'postgres', 'operations'],
    problemHtml: `<p>This is the single most common way a deploy breaks in production: <code>GRANT SELECT ON ALL TABLES IN SCHEMA public</code> reads like a standing rule, but it is a one-off. It grants on the tables that exist <em>at that moment</em>. The next migration creates a table, the application role has no privileges on it, and the endpoint that touches it starts returning permission errors — while everything worked perfectly in the developer's database, where the grant was run afterwards.</p>
<ul>
<li>Create a role <code>app_ro</code> with <code>USAGE</code> on the schema and <code>SELECT ON ALL TABLES IN SCHEMA public</code>.</li>
<li>As that role, count the rows in <code>notes</code> to prove the grant worked.</li>
<li>As the owner, create a new table <code>invoices(id INT PRIMARY KEY, amount NUMERIC)</code> with one row — the "next migration".</li>
<li>As <code>app_ro</code>, try to read it and print the <code>SQLSTATE</code>.</li>
<li>Fix it properly with <code>ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO app_ro</code>, then create a second table <code>receipts</code> and show the role can read it immediately.</li>
<li>Print whether the role can now read <code>invoices</code> — and note that default privileges are <strong>not</strong> retroactive, so the old table still needs its own grant.</li>
</ul>`,
    inputSpec: 'The three seeded tables, plus two tables created during the exercise to represent later migrations.',
    outputSpec:
      'The role reads 3 notes; the first new table is refused with 42501; after setting default privileges the second new table is readable immediately; and the first one is still refused until it is granted explicitly.',
    constraints: 'Do not fix the problem by re-running GRANT ON ALL TABLES. The point is the default-privileges mechanism and its non-retroactive nature.',
    examplesJson: [
      { input: 'SELECT count(*) FROM invoices as app_ro, right after the table is created', output: 'SQLSTATE 42501', explanation: 'GRANT ON ALL TABLES covered only the tables that existed when it ran.' },
      { input: 'ALTER DEFAULT PRIVILEGES ... GRANT SELECT ON TABLES TO app_ro; then a new table', output: 'readable immediately', explanation: 'Default privileges apply automatically to objects created afterwards by that grantor.' },
      { input: 'the still-ungranted invoices table afterwards', output: 'SQLSTATE 42501', explanation: 'Default privileges are not retroactive — existing objects keep whatever they already had.' },
    ],
    hintsJson: [
      'ALTER DEFAULT PRIVILEGES describes what happens to objects created in the future.',
      'The defaults are scoped to the role that creates the objects — usually the migration user.',
      'Sequences and functions have their own ON SEQUENCES and ON FUNCTIONS clauses.',
      'Existing tables still need a one-time GRANT; the two mechanisms complement each other.',
    ],
    solution: `DROP TABLE IF EXISTS invoices, receipts CASCADE;
DROP ROLE IF EXISTS app_ro;
CREATE ROLE app_ro LOGIN;
GRANT USAGE ON SCHEMA public TO app_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_ro;

SET ROLE app_ro;
SELECT count(*) AS notes_readable FROM notes;
RESET ROLE;

-- The next migration adds a table.
CREATE TABLE invoices (id INT PRIMARY KEY, amount NUMERIC(10,2));
INSERT INTO invoices VALUES (1, 99.00);

SET ROLE app_ro;
DO $$
DECLARE n INT;
BEGIN
  SELECT count(*) INTO n FROM invoices;
  RAISE NOTICE 'invoices unexpectedly readable';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'invoices denied SQLSTATE %', SQLSTATE;
END;
$$;
RESET ROLE;

-- The durable fix: describe what should happen to FUTURE tables.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO app_ro;

CREATE TABLE receipts (id INT PRIMARY KEY, amount NUMERIC(10,2));
INSERT INTO receipts VALUES (1, 12.00);

SET ROLE app_ro;
SELECT count(*) AS receipts_readable FROM receipts;

DO $$
DECLARE n INT;
BEGIN
  SELECT count(*) INTO n FROM invoices;
  RAISE NOTICE 'invoices now readable';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'invoices still denied SQLSTATE %', SQLSTATE;
END;
$$;
RESET ROLE;`,
    solutionExplanationHtml: `<p>The mental model to correct is the word "ALL". <code>GRANT … ON ALL TABLES IN SCHEMA public</code> is expanded by the server at the moment it runs into one grant per existing table; it leaves no standing rule behind. Every table created later starts with no privileges for anyone but its owner.</p>
<p><code>ALTER DEFAULT PRIVILEGES</code> is the standing rule. It records what should be granted on objects created <em>in future</em>, and the crucial scoping detail is that it applies to objects created by a particular <strong>grantor</strong> — by default, the role running the command. If migrations run as <code>deploy_user</code> but the defaults were set while connected as <code>postgres</code>, nothing will match and the problem persists; <code>ALTER DEFAULT PRIVILEGES FOR ROLE deploy_user …</code> is the fix. This is why the setting so often appears not to work.</p>
<p>The non-retroactive behaviour at the end is deliberate and worth demonstrating rather than reading about: <code>invoices</code> stays unreadable because it already existed when the default was declared. In practice the correct sequence for a new database is both — one <code>GRANT … ON ALL TABLES</code> for what exists, and one <code>ALTER DEFAULT PRIVILEGES</code> for what comes next.</p>
<p>Two more traps in the same family. Sequences need their own clause (<code>ON SEQUENCES</code>), and a role with <code>INSERT</code> on a table but no <code>USAGE</code> on its identity sequence fails with a permission error naming the sequence, which is confusing until you have seen it once. And functions default to <code>EXECUTE</code> for <code>PUBLIC</code>, which the next exercise deals with — the default privileges here restrict what you grant, not what PostgreSQL already grants to everyone.</p>`,
    diagramMermaid: `flowchart TD
  A[GRANT ON ALL TABLES] --> B[expands to the tables that exist now]
  B --> C[new migration creates a table]
  C --> D[role has no privilege 42501]
  E[ALTER DEFAULT PRIVILEGES] --> F[standing rule for future objects]
  F --> G[next table is readable immediately]
  E -.->|not retroactive| C`,
    check: `DROP TABLE IF EXISTS invoices, receipts CASCADE;
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
RESET ROLE;`,
  },
  {
    title: 'Take Back What PUBLIC Was Given by Default',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['the PUBLIC pseudo-role', 'default EXECUTE on functions', 'REVOKE ... FROM PUBLIC', 'implicit grants', 'secure-by-default setup'],
    prerequisites: ['GRANT and REVOKE', 'functions'],
    tags: ['security', 'public', 'revoke', 'postgres', 'hardening'],
    problemHtml: `<p>Not every privilege in your database was granted by you. <code>PUBLIC</code> is a pseudo-role meaning "every role that exists or ever will", and PostgreSQL grants it a few things by default — most notably <code>EXECUTE</code> on every newly created function. A role you carefully limited to reading two tables can therefore call a function that reads everything.</p>
<ul>
<li>Create a function <code>total_payroll() RETURNS NUMERIC</code> that sums <code>staff.salary</code>, declared <code>SECURITY DEFINER</code> with a pinned <code>search_path</code> — so it runs with its owner's privileges.</li>
<li>Create a login role <code>viewer</code> with <code>USAGE</code> on the schema and <code>SELECT</code> on <code>notes</code> only — nothing on <code>staff</code>.</li>
<li>As <code>viewer</code>, confirm <code>staff</code> is unreadable (report the <code>SQLSTATE</code>), then call <code>total_payroll()</code> and print the result. Notice what just happened.</li>
<li>As the owner, <code>REVOKE EXECUTE ON FUNCTION total_payroll() FROM PUBLIC</code>.</li>
<li>As <code>viewer</code>, call it again and report the <code>SQLSTATE</code>.</li>
<li>Print <code>has_function_privilege</code> for <code>viewer</code> before and after — that is, capture it into the output after the revoke.</li>
</ul>
<p>Nobody granted <code>viewer</code> anything on this function. Work out why the first call succeeds anyway.</p>`,
    inputSpec: 'The staff table with salaries 9000, 7000 and 6500 — total 22500.',
    outputSpec:
      'The direct read of staff is refused with 42501, yet the function returns 22500 because PUBLIC holds EXECUTE by default; after the revoke the call fails with 42501 and has_function_privilege reports false.',
    constraints: 'Do not grant anything to viewer beyond the schema and notes. The fix must be a REVOKE from PUBLIC, not a change to the function body.',
    examplesJson: [
      { input: 'SELECT total_payroll() as viewer, before the revoke', output: '22500.00', explanation: 'The function is SECURITY DEFINER so its body reads staff as the owner, and EXECUTE was granted to PUBLIC automatically when it was created — nobody had to grant viewer anything.' },
      { input: 'SELECT count(*) FROM staff as viewer', output: 'SQLSTATE 42501', explanation: 'The table itself was never granted — the function was the way around it.' },
      { input: 'after REVOKE EXECUTE ... FROM PUBLIC', output: 'SQLSTATE 42501 and has_function_privilege false', explanation: 'Removing the implicit grant closes the path.' },
    ],
    hintsJson: [
      'PUBLIC is not a role you created — it is every role, present and future.',
      'New functions get EXECUTE for PUBLIC unless you revoke it.',
      'REVOKE ... FROM PUBLIC then GRANT to the roles that should have it.',
      'The same pattern applies to CREATE on the public schema in older PostgreSQL versions.',
    ],
    solution: `CREATE OR REPLACE FUNCTION total_payroll() RETURNS NUMERIC
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$ SELECT COALESCE(SUM(salary), 0) FROM staff; $$;

DROP ROLE IF EXISTS viewer;
CREATE ROLE viewer LOGIN;
GRANT USAGE ON SCHEMA public TO viewer;
GRANT SELECT ON notes TO viewer;

SET ROLE viewer;
DO $$
DECLARE n INT;
BEGIN
  SELECT count(*) INTO n FROM staff;
  RAISE NOTICE 'staff unexpectedly readable';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'staff denied SQLSTATE %', SQLSTATE;
END;
$$;
SELECT total_payroll() AS payroll_via_function;
RESET ROLE;

REVOKE EXECUTE ON FUNCTION total_payroll() FROM PUBLIC;

SET ROLE viewer;
DO $$
DECLARE v NUMERIC;
BEGIN
  v := total_payroll();
  RAISE NOTICE 'function still callable, returned %', v;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'function denied SQLSTATE %', SQLSTATE;
END;
$$;
RESET ROLE;

SELECT has_function_privilege('viewer','total_payroll()','EXECUTE') AS viewer_can_execute;`,
    solutionExplanationHtml: `<p>The first call is the lesson: a role with no privileges on <code>staff</code>, and no grant naming it on the function either, obtained the payroll total. Two defaults combined to allow it. The function is <code>SECURITY DEFINER</code>, so its body runs with the <em>owner's</em> privileges and can read <code>staff</code>; and PostgreSQL grants <code>EXECUTE</code> on every newly created function to <code>PUBLIC</code>, so every role — including ones created next year — could call it. Neither default is wrong on its own; together they turn a carefully limited role into one that can read the payroll.</p>
<p>Note what happens without the first default: a plain <code>SECURITY INVOKER</code> function (the standard kind) executes as the caller, so the same call fails with <code>permission denied for table staff</code> even though <code>PUBLIC</code> may call it. That is worth trying, because it pins down which default actually creates the exposure — the open <code>EXECUTE</code> is only dangerous on functions that carry privileges of their own.</p>
<p><code>PUBLIC</code> deserves to be understood as "every role that exists or ever will", including ones created next year. Auditing grants role by role misses it entirely, which is what makes it a durable blind spot. The hardening move is uniform: revoke from <code>PUBLIC</code> first, then grant deliberately to the roles that should have the privilege.</p>
<p>The same default applies elsewhere. Before PostgreSQL 15, <code>PUBLIC</code> had <code>CREATE</code> on the <code>public</code> schema, so any role could create tables and functions there — the basis of the <code>search_path</code> attacks in the next exercise. Newer versions changed that default, but databases upgraded from older ones keep the old grant, so it is worth checking rather than assuming.</p>
<p>For a real hardening pass, the sequence is: revoke <code>CREATE</code> on <code>public</code> from <code>PUBLIC</code>, revoke <code>EXECUTE</code> from <code>PUBLIC</code> on functions that touch sensitive data, and add <code>ALTER DEFAULT PRIVILEGES … REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC</code> so future functions start closed rather than open.</p>`,
    check: `CREATE OR REPLACE FUNCTION total_payroll() RETURNS NUMERIC LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$ SELECT COALESCE(SUM(salary), 0) FROM staff; $$;
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
SELECT has_function_privilege('viewer','total_payroll()','EXECUTE') AS viewer_can_execute;`,
  },
  {
    title: 'Isolate Tenants with Row-Level Security',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['ENABLE ROW LEVEL SECURITY', 'USING versus WITH CHECK', 'current_setting as context', 'fail-closed defaults', 'owner bypass'],
    prerequisites: ['roles and grants', 'policies'],
    tags: ['security', 'rls', 'multi-tenancy', 'postgres', 'policies'],
    problemHtml: `<p>Table and column grants say <em>which tables</em> a role may touch. <strong>Row-level security</strong> says which <em>rows</em>. A policy is a predicate the database adds to every statement against the table, so it holds for the application, for a raw <code>psql</code> session, and for any query path you forgot about.</p>
<ul>
<li>Create a role <code>tenant_app</code> with <code>USAGE</code> on the schema and <code>SELECT, INSERT</code> on <code>notes</code>.</li>
<li>Enable RLS on <code>notes</code> and create a policy comparing <code>tenant_id</code> to the session setting <code>app.tenant</code>, wrapping it as <code>NULLIF(current_setting('app.tenant', true), '')::int</code>. Give it both <code>USING</code> (for reads) and <code>WITH CHECK</code> (for writes).</li>
<li>As <code>tenant_app</code> with the context set to 1, print the note bodies. Repeat with 2.</li>
<li>Show it binds raw SQL too: still as tenant 1, run a plain <code>SELECT count(*) FROM notes</code>.</li>
<li>Show it is fail-closed: with no context set, print the count.</li>
<li>Show <code>WITH CHECK</code>: as tenant 1, attempt to insert a note with <code>tenant_id = 2</code> and print the <code>SQLSTATE</code>.</li>
</ul>`,
    inputSpec: 'The notes table: ids 1 and 2 belong to tenant 1, id 3 belongs to tenant 2.',
    outputSpec:
      'Tenant 1 sees two notes and tenant 2 sees one; a raw count inside tenant 1 also returns 2; with no context set the count is 0; and inserting another tenant’s row is refused with SQLSTATE 42501.',
    constraints: 'Isolation must come from the policy — no WHERE clause on tenant_id anywhere in the queries. Test as a non-owner role, since the owner bypasses policies.',
    examplesJson: [
      { input: "set_config('app.tenant','1',false); SELECT body FROM notes", output: 'tenant one alpha / tenant one beta', explanation: 'The policy filters the rows; the query itself never mentions the tenant.' },
      { input: 'SELECT count(*) FROM notes with no app.tenant set', output: '0', explanation: 'NULLIF turns the unset value into NULL, the comparison is NULL, and no row qualifies — fail closed.' },
      { input: 'INSERT INTO notes VALUES (9, 2, ...) as tenant 1', output: 'SQLSTATE 42501', explanation: 'WITH CHECK applies the same predicate to written rows, so a tenant cannot plant a row it could not read.' },
    ],
    hintsJson: [
      'ALTER TABLE ... ENABLE ROW LEVEL SECURITY, then CREATE POLICY.',
      'USING governs which existing rows are visible; WITH CHECK governs which new rows may be written.',
      'Wrap current_setting in NULLIF: once a session has used the setting, unset reads back as an empty string rather than NULL.',
      'Policies do not apply to the table owner — connect as another role to see them work.',
    ],
    solution: `DROP ROLE IF EXISTS tenant_app;
CREATE ROLE tenant_app LOGIN;
GRANT USAGE ON SCHEMA public TO tenant_app;
GRANT SELECT, INSERT ON notes TO tenant_app;

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON notes;
CREATE POLICY tenant_isolation ON notes
  USING      (tenant_id = NULLIF(current_setting('app.tenant', true), '')::int)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant', true), '')::int);

SET ROLE tenant_app;

SELECT set_config('app.tenant', '1', false);
SELECT body AS tenant1_notes FROM notes ORDER BY id;
SELECT count(*) AS tenant1_raw_count FROM notes;

SELECT set_config('app.tenant', '2', false);
SELECT body AS tenant2_notes FROM notes ORDER BY id;

SELECT set_config('app.tenant', '', false);
SELECT count(*) AS no_context_count FROM notes;

SELECT set_config('app.tenant', '1', false);
DO $$
BEGIN
  INSERT INTO notes VALUES (9, 2, 'planted by tenant one');
  RAISE NOTICE 'cross-tenant insert unexpectedly allowed';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'cross-tenant insert denied SQLSTATE %', SQLSTATE;
END;
$$;

RESET ROLE;
SELECT count(*) AS owner_sees FROM notes;`,
    solutionExplanationHtml: `<p>A policy is a predicate the planner attaches to every statement touching the table for any role that is not the owner. That is why the plain <code>count(*)</code> is filtered exactly like the explicit read: there is no application layer involved, so there is no application layer to bypass. This is the difference between "our code always filters by tenant" and "the tenant boundary is enforced".</p>
<p><code>USING</code> and <code>WITH CHECK</code> are separate for a good reason. <code>USING</code> decides which existing rows are <em>visible</em> to reads, updates and deletes; <code>WITH CHECK</code> decides which rows may be <em>written</em>. A policy with only <code>USING</code> hides other tenants' rows but lets a tenant insert a row labelled with someone else's id — a row it then cannot see, which is both a data-integrity problem and a way to write into another tenant's view of the world. The refusal here, SQLSTATE <code>42501</code>, is the check doing its job.</p>
<p>The unset-context case is the one people get wrong. Writing the predicate as <code>current_setting('app.tenant', true)::int</code> looks equivalent, but once a session has set and cleared that parameter it reads back as an <strong>empty string</strong>, and the cast raises <code>invalid input syntax for type integer</code> instead of returning no rows. <code>NULLIF(…, '')</code> maps both the never-set and the cleared case to NULL, the comparison evaluates to NULL, and nothing matches — the query returns an empty result rather than an error, and no data leaks. Fail-closed is the correct default: a forgotten context shows an empty screen and gets fixed, whereas a policy that fell back to "show everything" would leak on exactly the code path that forgot.</p>
<p>Two caveats. Policies are skipped for the table owner and for superusers, so testing as <code>postgres</code> shows no isolation at all and looks like RLS is broken; <code>FORCE ROW LEVEL SECURITY</code> makes them apply to the owner too. And in a pooled application the context must be set per transaction — <code>set_config(…, true)</code> for transaction scope — or one request's tenant can be inherited by whoever borrows the connection next.</p>`,
    diagramMermaid: `flowchart TD
  A[query from tenant_app] --> B[policy predicate added by Postgres]
  B --> C{USING for reads}
  C --> D[only rows of the current tenant]
  A --> E{WITH CHECK for writes}
  E --> F[rows labelled with another tenant refused 42501]
  G[no app.tenant set] --> H[NULLIF gives NULL so nothing matches]`,
    check: `DROP ROLE IF EXISTS tenant_app;
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
SELECT count(*) AS owner_sees FROM notes;`,
  },
  {
    title: 'Grant Controlled Escalation with a SECURITY DEFINER Function',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['SECURITY DEFINER', 'runs with the owner privileges', 'pinning search_path', 'narrow interface over broad data', 'the search_path attack'],
    prerequisites: ['functions', 'grants', 'roles'],
    tags: ['security', 'functions', 'privileges', 'postgres', 'escalation'],
    problemHtml: `<p>Sometimes a role must obtain <em>one specific answer</em> derived from data it may not read. Granting the table is too much; a <code>SECURITY DEFINER</code> function is the narrow alternative: it executes with the privileges of its <strong>owner</strong> rather than the caller, so it can read what the caller cannot and return only the aggregate you decided to expose.</p>
<p>That power comes with a well-known trap. The function body resolves object names using the caller's <code>search_path</code> unless you pin it — so a caller who can create objects can put their own <code>staff</code> table earlier on the path and have your privileged function read theirs instead.</p>
<ul>
<li>Create <code>headcount() RETURNS INT</code> as <code>SECURITY DEFINER</code>, counting rows in <code>staff</code>, with <code>SET search_path = public, pg_temp</code> attached to the function.</li>
<li><code>REVOKE EXECUTE … FROM PUBLIC</code> and grant it only to a new role <code>kiosk</code> (which has <code>USAGE</code> on the schema and nothing else).</li>
<li>As <code>kiosk</code>: show <code>staff</code> is unreadable (report the <code>SQLSTATE</code>), then call <code>headcount()</code> and print the number.</li>
<li>Demonstrate why the pin matters: as <code>kiosk</code>, create a temporary table named <code>staff</code> with five rows, then call <code>headcount()</code> again. It must still report the real count.</li>
<li>Print <code>prosecdef</code> and the function's <code>proconfig</code> from <code>pg_proc</code> to show both settings are in place.</li>
</ul>`,
    inputSpec: 'The staff table with three rows, and a kiosk role with no privileges on it.',
    outputSpec:
      'The direct read fails with 42501; headcount returns 3; after the caller creates a five-row temporary table also called staff the function still returns 3; and pg_proc reports prosecdef true with a search_path setting.',
    constraints: 'The function must be SECURITY DEFINER with a pinned search_path. Do not grant kiosk any privilege on staff.',
    examplesJson: [
      { input: 'SELECT headcount() as kiosk', output: '3', explanation: 'The function runs as its owner, so it can read a table the caller cannot.' },
      { input: 'CREATE TEMP TABLE staff(...) with 5 rows, then SELECT headcount()', output: '3', explanation: 'The pinned search_path puts pg_temp last, so the caller’s decoy is never resolved.' },
      { input: 'SELECT prosecdef, proconfig FROM pg_proc WHERE proname = \'headcount\'', output: 't and {search_path=public, pg_temp}', explanation: 'Both halves of the pattern are visible in the catalogue — the escalation and the guard.' },
    ],
    hintsJson: [
      'SECURITY DEFINER goes in the function definition, alongside LANGUAGE and volatility.',
      'Attach SET search_path = public, pg_temp to the function so the body does not trust the caller.',
      'Listing pg_temp explicitly, and last, keeps temporary objects from shadowing real ones.',
      'Always revoke EXECUTE from PUBLIC on a SECURITY DEFINER function before granting it deliberately.',
    ],
    solution: `CREATE OR REPLACE FUNCTION headcount() RETURNS INT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$ SELECT count(*)::int FROM staff; $$;

REVOKE EXECUTE ON FUNCTION headcount() FROM PUBLIC;

DROP ROLE IF EXISTS kiosk;
CREATE ROLE kiosk LOGIN;
GRANT USAGE ON SCHEMA public TO kiosk;
GRANT EXECUTE ON FUNCTION headcount() TO kiosk;

SET ROLE kiosk;
DO $$
DECLARE n INT;
BEGIN
  SELECT count(*) INTO n FROM staff;
  RAISE NOTICE 'staff unexpectedly readable';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'staff denied SQLSTATE %', SQLSTATE;
END;
$$;

SELECT headcount() AS real_headcount;

-- The attack: shadow the table the privileged function reads.
CREATE TEMP TABLE staff (id INT, name TEXT, email TEXT, salary NUMERIC);
INSERT INTO staff SELECT g, 'fake', 'f@x.io', 0 FROM generate_series(1,5) g;
SELECT headcount() AS headcount_after_decoy;
DROP TABLE staff;
RESET ROLE;

SELECT prosecdef AS security_definer, proconfig AS settings
FROM pg_proc WHERE proname = 'headcount';`,
    solutionExplanationHtml: `<p><code>SECURITY DEFINER</code> inverts the usual rule: the body runs with the <em>owner's</em> privileges, not the caller's. That makes it the standard way to expose a narrow, audited operation over data the caller must not read directly — "how many staff are there" without "read the staff table". The interface is the security boundary, so it should return the least information that answers the question.</p>
<p>The <code>search_path</code> pin is not optional decoration; without it this pattern is a privilege-escalation vector. Unqualified names inside the body are resolved using the caller's <code>search_path</code>, and a caller who can create objects — in a temporary schema, or in any schema where <code>PUBLIC</code> retains <code>CREATE</code> — can place a decoy named <code>staff</code> ahead of the real one. The privileged function then happily reads the attacker's table, and worse variants substitute functions or operators to run arbitrary code as the owner. Attaching <code>SET search_path = public, pg_temp</code> to the function fixes the resolution at definition time; listing <code>pg_temp</code> explicitly and <strong>last</strong> is the documented practice, since otherwise it is searched first.</p>
<p>The demonstration is worth running rather than trusting: the caller creates a five-row <code>staff</code> and the function still answers 3. Remove the <code>SET</code> clause and the same script returns 5 — the decoy wins.</p>
<p>Two further habits complete the pattern. Revoke <code>EXECUTE</code> from <code>PUBLIC</code> before granting it, because a <code>SECURITY DEFINER</code> function open to everyone is a hole with a friendly interface. And keep such functions short and free of dynamic SQL: every additional statement runs with elevated privileges, so the smaller the body, the smaller the thing you have to reason about.</p>`,
    diagramMermaid: `flowchart TD
  A[kiosk calls headcount] --> B[function runs as its owner]
  B --> C[reads staff which the caller cannot]
  C --> D[returns only the count]
  E[caller creates a decoy temp table named staff] --> F{search_path pinned}
  F -->|yes| C
  F -->|no| G[owner privileges read the attacker table]`,
    check: `CREATE OR REPLACE FUNCTION headcount() RETURNS INT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$ SELECT count(*)::int FROM staff; $$;
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
SELECT prosecdef AS security_definer, proconfig AS settings FROM pg_proc WHERE proname = 'headcount';`,
  },
  {
    title: 'Audit Who Can Do What',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['information_schema.role_table_grants', 'has_table_privilege at scale', 'finding PUBLIC grants', 'superuser and bypassrls flags', 'access review'],
    prerequisites: ['grants', 'roles'],
    tags: ['security', 'audit', 'catalog', 'postgres', 'review'],
    problemHtml: `<p>A permission model you cannot inspect is a permission model you do not have. Access reviews — quarterly, after an incident, or before an audit — need answers to concrete questions: who can write to this table, which grants went to <code>PUBLIC</code>, which roles are superusers. PostgreSQL answers all of them from its catalogues.</p>
<ul>
<li>Grant <code>SELECT</code> on <code>accounts</code> to <code>PUBLIC</code> deliberately, so the audit has something to find.</li>
<li>List every non-system grantee holding a privilege on <code>accounts</code> from <code>information_schema.role_table_grants</code>: grantee and privilege, ordered, excluding the owner <code>postgres</code>.</li>
<li>Print the roles that can <strong>write</strong> (<code>INSERT</code> or <code>UPDATE</code> or <code>DELETE</code>) to <code>notes</code>, using <code>has_table_privilege</code> over <code>pg_roles</code>, excluding system roles (<code>rolname NOT LIKE 'pg\\_%'</code>) and the owner.</li>
<li>Print any grant whose grantee is <code>PUBLIC</code>, as <code>table:privilege</code>. Scope it to <code>table_schema = 'public'</code> — without that filter the result is buried under the hundreds of catalogue and <code>information_schema</code> views that PostgreSQL itself grants to <code>PUBLIC</code>.</li>
<li>Print the roles carrying <code>rolsuper</code> or <code>rolbypassrls</code> — the two flags that make every policy in the previous exercises irrelevant.</li>
<li>Finally revoke the <code>PUBLIC</code> grant and show the count of PUBLIC grants is back to zero.</li>
</ul>`,
    inputSpec: 'The roles created by the earlier exercises, plus one deliberate grant of SELECT on accounts to PUBLIC.',
    outputSpec:
      'The grant list shows PUBLIC and the earlier roles on accounts; the writer list for notes contains tenant_app; the PUBLIC scan finds accounts:SELECT; the superuser scan lists postgres; and after the revoke no PUBLIC grants remain.',
    constraints: 'Answer from the catalogues, not from memory of what the previous exercises granted. Exclude system roles so the output is about your own model.',
    examplesJson: [
      { input: 'the role_table_grants query for accounts', output: 'PUBLIC:SELECT, analysts:SELECT, report_reader:SELECT', explanation: 'Every grantee is listed, including the pseudo-role PUBLIC that no role-by-role review would surface.' },
      { input: 'the writer scan over notes', output: 'tenant_app', explanation: 'has_table_privilege with a comma-separated privilege list answers "can write" in one pass over pg_roles.' },
      { input: 'the superuser and bypassrls scan', output: 'postgres', explanation: 'A role with either flag ignores row-level security entirely, so the list must be short and known.' },
    ],
    hintsJson: [
      'information_schema.role_table_grants has grantee, table_name and privilege_type.',
      'has_table_privilege accepts a comma list: \'INSERT, UPDATE, DELETE\' means any of them.',
      'System roles are named pg_something — filter them out with NOT LIKE.',
      'Scope catalogue queries to table_schema = \'public\', or PostgreSQL’s own PUBLIC grants drown your findings.',
      'rolsuper and rolbypassrls live in pg_roles and both defeat row-level security.',
    ],
    solution: `GRANT SELECT ON accounts TO PUBLIC;

SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'accounts' AND grantee <> 'postgres'
ORDER BY grantee, privilege_type;

SELECT r.rolname AS can_write_notes
FROM pg_roles r
WHERE r.rolname NOT LIKE 'pg\\_%'
  AND r.rolname <> 'postgres'
  AND has_table_privilege(r.rolname, 'notes', 'INSERT, UPDATE, DELETE')
ORDER BY r.rolname;

SELECT table_name || ':' || privilege_type AS public_grant
FROM information_schema.role_table_grants
WHERE grantee = 'PUBLIC' AND table_schema = 'public'
ORDER BY 1;

SELECT rolname AS privileged_role, rolsuper, rolbypassrls
FROM pg_roles
WHERE (rolsuper OR rolbypassrls) AND rolname NOT LIKE 'pg\\_%'
ORDER BY rolname;

REVOKE SELECT ON accounts FROM PUBLIC;
SELECT count(*) AS public_grants_left
FROM information_schema.role_table_grants
WHERE grantee = 'PUBLIC' AND table_schema = 'public';`,
    solutionExplanationHtml: `<p>The two tools answer different shapes of question. <code>information_schema.role_table_grants</code> enumerates the grants that were <em>made</em> — useful for "who was given what, and by whom". <code>has_table_privilege</code> evaluates the <em>effective</em> privilege, following group membership and defaults, which is what you actually want when asking "can this role write to that table". A review based only on the grant list misses privileges inherited through a group; one based only on the effective check misses the fact that a grant to <code>PUBLIC</code> is why everyone has it.</p>
<p><code>PUBLIC</code> is the reason the third query exists as a separate check. It is not a role in <code>pg_roles</code>, so iterating over roles never surfaces it, and a privilege granted to it applies to every role that exists or will exist. Scanning explicitly for <code>grantee = 'PUBLIC'</code> is the only way it appears in a review.</p>
<p>The superuser scan is the sharpest check of the set, because <code>rolsuper</code> and <code>rolbypassrls</code> make everything else on this page moot: such a role ignores row-level security, ignores table grants, and can read and change anything. The list should be short, expected, and used by humans rather than by applications — an application connecting as a superuser has silently opted out of every control you built.</p>
<p>The schema filter on the <code>PUBLIC</code> scan is not cosmetic. PostgreSQL grants <code>SELECT</code> on the whole of <code>information_schema</code> and much of <code>pg_catalog</code> to <code>PUBLIC</code> by design, so an unscoped query returns several hundred rows and the one grant you actually made is lost among them. An audit query that produces noise is an audit query nobody runs.</p>
<p>Two extensions worth making in a real environment. Include <code>information_schema.column_privileges</code>, since exercise 3 showed column grants do not appear at table level and are otherwise invisible. And treat the output as a baseline to diff: a scheduled query whose result is compared against the expected set turns an access review from an annual exercise into an alert that fires the day something is granted unexpectedly.</p>`,
    check: `GRANT SELECT ON accounts TO PUBLIC;
SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_name = 'accounts' AND grantee <> 'postgres' ORDER BY grantee, privilege_type;
SELECT r.rolname AS can_write_notes FROM pg_roles r WHERE r.rolname NOT LIKE 'pg\\_%' AND r.rolname <> 'postgres' AND has_table_privilege(r.rolname, 'notes', 'INSERT, UPDATE, DELETE') ORDER BY r.rolname;
SELECT table_name || ':' || privilege_type AS public_grant FROM information_schema.role_table_grants WHERE grantee = 'PUBLIC' AND table_schema = 'public' ORDER BY 1;
SELECT rolname AS privileged_role, rolsuper, rolbypassrls FROM pg_roles WHERE (rolsuper OR rolbypassrls) AND rolname NOT LIKE 'pg\\_%' ORDER BY rolname;
REVOKE SELECT ON accounts FROM PUBLIC;
SELECT count(*) AS public_grants_left FROM information_schema.role_table_grants WHERE grantee = 'PUBLIC' AND table_schema = 'public';`,
  },
  {
    title: 'Build a Least-Privilege Role Set for an Application',
    difficulty: 'HARD', estimatedMinutes: 50, points: 25,
    concepts: ['separating runtime from migration credentials', 'reader writer migrator', 'privilege matrix as a test', 'DDL privileges', 'blast radius'],
    prerequisites: ['grants', 'group roles', 'default privileges'],
    tags: ['security', 'least-privilege', 'architecture', 'postgres', 'operations'],
    problemHtml: `<p>"The application connects as the owner" is the default in most projects and the reason an injection hole becomes a schema-destroying incident. A serious deployment separates credentials by what they must be able to do, and proves the separation with a matrix rather than a promise.</p>
<p>Build three group roles and one login role for each:</p>
<ul>
<li><code>app_reader</code> — <code>SELECT</code> on all tables. Used by reporting.</li>
<li><code>app_writer</code> — everything the reader has plus <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>. Used by the running application. Grant <code>app_reader</code> to it so the privileges compose.</li>
<li><code>app_migrator</code> — the writer's privileges plus <code>CREATE</code> on the schema. Used only by the deploy job.</li>
<li>Create login roles <code>svc_report</code>, <code>svc_api</code> and <code>svc_deploy</code>, one in each group.</li>
</ul>
<p>Then produce the proof: for each of the three login roles print one row with four booleans — can select <code>accounts</code>, can insert <code>accounts</code>, can delete <code>accounts</code>, and can create in schema <code>public</code>. Finally, as <code>svc_api</code>, attempt <code>CREATE TABLE</code> and print the <code>SQLSTATE</code>.</p>`,
    inputSpec: 'The seeded tables, with RLS still enabled on notes from exercise 6 (which does not affect the accounts table used for the matrix).',
    outputSpec:
      'svc_report is true, false, false, false; svc_api is true, true, true, false; svc_deploy is true, true, true, true; and the CREATE TABLE attempt by svc_api fails with 42501.',
    constraints: 'Compose the roles by granting one group to another rather than repeating the table grants. Every privilege must be verified with has_table_privilege or has_schema_privilege, not assumed.',
    examplesJson: [
      { input: "has_table_privilege('svc_report','accounts','INSERT')", output: 'false', explanation: 'The reporting credential cannot change data even if the reporting code is compromised.' },
      { input: "has_schema_privilege('svc_api','public','CREATE')", output: 'false', explanation: 'The running application cannot create or drop tables — that authority belongs to the deploy job alone.' },
      { input: 'CREATE TABLE as svc_api', output: 'SQLSTATE 42501', explanation: 'The matrix is not theoretical; the database enforces it.' },
    ],
    hintsJson: [
      'GRANT app_reader TO app_writer makes the writer inherit every reader privilege.',
      'CREATE on a schema is a schema privilege, checked with has_schema_privilege.',
      'Build the matrix with a VALUES list of role names and one row per role.',
      'Verify by attempting a forbidden operation, not only by reading the catalogue.',
    ],
    solution: `DROP ROLE IF EXISTS svc_report, svc_api, svc_deploy, app_reader, app_writer, app_migrator;

CREATE ROLE app_reader   NOLOGIN;
CREATE ROLE app_writer   NOLOGIN;
CREATE ROLE app_migrator NOLOGIN;

GRANT USAGE ON SCHEMA public TO app_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_reader;

-- Compose rather than repeat: the writer is a reader that can also change data.
GRANT app_reader TO app_writer;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_writer;

-- The migrator is a writer that may also change the schema.
GRANT app_writer TO app_migrator;
GRANT CREATE ON SCHEMA public TO app_migrator;

CREATE ROLE svc_report LOGIN;
CREATE ROLE svc_api    LOGIN;
CREATE ROLE svc_deploy LOGIN;
GRANT app_reader   TO svc_report;
GRANT app_writer   TO svc_api;
GRANT app_migrator TO svc_deploy;

SELECT r AS role_name,
       has_table_privilege(r,'accounts','SELECT') AS can_select,
       has_table_privilege(r,'accounts','INSERT') AS can_insert,
       has_table_privilege(r,'accounts','DELETE') AS can_delete,
       has_schema_privilege(r,'public','CREATE')  AS can_create
FROM (VALUES ('svc_report'),('svc_api'),('svc_deploy')) AS t(r)
ORDER BY r;

SET ROLE svc_api;
DO $$
BEGIN
  EXECUTE 'CREATE TABLE should_not_exist (id INT)';
  RAISE NOTICE 'svc_api unexpectedly created a table';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'svc_api CREATE TABLE denied SQLSTATE %', SQLSTATE;
END;
$$;
RESET ROLE;`,
    solutionExplanationHtml: `<p>The design principle is blast radius. Each credential can do what its job requires and nothing more, so a compromise is bounded by which credential leaked. A leaked reporting password reads data — bad, but recoverable. A leaked application password can also change data. Only the deploy credential can alter the schema, and it lives in the deployment pipeline rather than in the serving process, so an injection hole in a web request cannot reach it at all.</p>
<p>Composing the groups with <code>GRANT app_reader TO app_writer</code> is what keeps this maintainable. Adding a table means granting it to <code>app_reader</code> once; the writer and the migrator inherit through the chain. Repeating the grants per role instead produces three lists that drift apart, and the drift is invisible until something fails in production — or, worse, until something succeeds that should not have.</p>
<p>The matrix is the deliverable, not the grants. Written as a query over a <code>VALUES</code> list it becomes a test you can run in CI after every migration: three rows of booleans that must match exactly. That converts "we designed least privilege" into "least privilege is currently true", which are very different claims six months apart. Pair it with the attempted <code>CREATE TABLE</code> — a catalogue check confirms what PostgreSQL believes, and the failed statement confirms what it actually does.</p>
<p>Two things to add for a real deployment. Default privileges (exercise 4) must be attached for the migrating role, or every new table is invisible to the application until someone notices. And the migrator should not own the tables it creates in a paranoid setup — table owners can always bypass RLS and drop their own tables, so a separate owner role that nobody logs in as keeps even the deploy credential from being all-powerful.</p>`,
    diagramMermaid: `flowchart TD
  A[app_reader SELECT] --> B[app_writer inherits reader]
  B --> C[app_migrator inherits writer]
  C --> D[plus CREATE on schema]
  E[svc_report] --> A
  F[svc_api] --> B
  G[svc_deploy] --> C
  F -.->|CREATE TABLE refused 42501| D`,
    check: `DROP ROLE IF EXISTS svc_report, svc_api, svc_deploy, app_reader, app_writer, app_migrator;
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
RESET ROLE;`,
  },
  {
    title: 'Capstone: Harden a Multi-Tenant Table and Try to Break In',
    difficulty: 'HARD', estimatedMinutes: 60, points: 30,
    concepts: ['layered defences', 'RLS with FORCE', 'least privilege plus policies', 'SECURITY DEFINER accessor', 'proving a boundary by attacking it'],
    prerequisites: ['rls', 'roles', 'security definer', 'audit queries'],
    tags: ['security', 'capstone', 'rls', 'postgres', 'multi-tenancy'],
    problemHtml: `<p>Combine the module into one hardened table, then attack it. A defence you have not tried to bypass is a hypothesis, not a control.</p>
<ul>
<li>Give <code>notes</code> a policy as in exercise 6 and add <code>FORCE ROW LEVEL SECURITY</code> so even the table owner is subject to it.</li>
<li>Create <code>tenant_svc</code> with <code>USAGE</code> and <code>SELECT, INSERT</code> on <code>notes</code> — no <code>DELETE</code>, no <code>UPDATE</code>.</li>
<li>Add a <code>SECURITY DEFINER</code> function <code>note_count_for(p_tenant INT)</code> with a pinned <code>search_path</code> that returns the count for any tenant, and grant it only to a separate <code>auditor</code> role. This is the deliberate, narrow exception to the isolation.</li>
</ul>
<p>Then run the attacks and report each result on its own line:</p>
<ul>
<li><code>t1</code> and <code>t2</code> — notes visible to <code>tenant_svc</code> with the context set to each tenant.</li>
<li><code>raw</code> — a plain <code>count(*)</code> inside tenant 1, proving SQL does not escape the policy.</li>
<li><code>cross</code> — tenant 1 asking for tenant 2's row explicitly by id.</li>
<li><code>plant</code> — tenant 1 inserting a row labelled tenant 2 (expect the <code>SQLSTATE</code>).</li>
<li><code>delete</code> — tenant 1 attempting a delete (expect the <code>SQLSTATE</code>).</li>
<li><code>owner</code> — the table owner counting rows with no context set, under <code>FORCE</code>. Transfer the table to a non-superuser role first and test as that role: <code>FORCE</code> binds the <em>owner</em>, but a superuser bypasses row-level security no matter what.</li>
<li><code>superuser</code> — the same count as <code>postgres</code>, showing the bypass that exercise 8's <code>rolsuper</code> scan exists to find.</li>
<li><code>auditor</code> — the auditor calling the accessor for tenant 2.</li>
</ul>`,
    inputSpec: 'The notes table with two tenant-1 rows and one tenant-2 row, hardened during the exercise.',
    outputSpec:
      'Tenant 1 sees 2 and tenant 2 sees 1; the raw count is also 2; the cross-tenant lookup returns 0 rows; the plant and the delete are both refused with 42501; the non-superuser owner sees 0 under FORCE with no context while the superuser still sees all 3; and the auditor obtains 1 through the accessor function.',
    constraints: 'No query may filter on tenant_id. The only way to see another tenant’s data must be the granted accessor function.',
    examplesJson: [
      { input: 'tenant 1 selecting note id 3, which belongs to tenant 2', output: 'cross 0', explanation: 'The row exists and the id matches, but the policy makes it invisible — the strongest evidence the boundary is not client-side.' },
      { input: 'the non-superuser table owner counting rows with no context, under FORCE', output: 'owner 0', explanation: 'FORCE removes the owner’s automatic bypass, so even the table’s owner is inside the boundary.' },
      { input: 'the same count as the superuser postgres', output: 'superuser 3', explanation: 'FORCE does not touch superusers or roles with BYPASSRLS — they see everything, which is why that list must be short and known.' },
      { input: 'auditor calling note_count_for(2)', output: 'auditor 1', explanation: 'The one sanctioned path across tenants is a narrow function, granted deliberately and auditable.' },
    ],
    hintsJson: [
      'ALTER TABLE ... FORCE ROW LEVEL SECURITY makes policies apply to the owner too.',
      'Write each attack as a statement whose result you print, not as a comment about what would happen.',
      'A refused write reports 42501 — capture it in a DO block.',
      'The accessor function needs SECURITY DEFINER, a pinned search_path, and EXECUTE revoked from PUBLIC.',
    ],
    solution: `ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON notes;
CREATE POLICY tenant_isolation ON notes
  USING      (tenant_id = NULLIF(current_setting('app.tenant', true), '')::int)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant', true), '')::int);

DROP ROLE IF EXISTS tenant_svc, auditor;
CREATE ROLE tenant_svc LOGIN;
GRANT USAGE ON SCHEMA public TO tenant_svc;
GRANT SELECT, INSERT ON notes TO tenant_svc;

CREATE OR REPLACE FUNCTION note_count_for(p_tenant INT) RETURNS INT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp
AS $$ SELECT count(*)::int FROM notes WHERE tenant_id = p_tenant; $$;
REVOKE EXECUTE ON FUNCTION note_count_for(INT) FROM PUBLIC;

CREATE ROLE auditor LOGIN;
GRANT USAGE ON SCHEMA public TO auditor;
GRANT EXECUTE ON FUNCTION note_count_for(INT) TO auditor;

SET ROLE tenant_svc;
SELECT set_config('app.tenant','1',false);
SELECT count(*) AS t1 FROM notes;
SELECT count(*) AS raw FROM notes;
SELECT count(*) AS cross_tenant FROM notes WHERE id = 3;

DO $$
BEGIN
  INSERT INTO notes VALUES (9, 2, 'planted');
  RAISE NOTICE 'plant unexpectedly allowed';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'plant denied SQLSTATE %', SQLSTATE;
END;
$$;

DO $$
BEGIN
  DELETE FROM notes WHERE id = 1;
  RAISE NOTICE 'delete unexpectedly allowed';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'delete denied SQLSTATE %', SQLSTATE;
END;
$$;

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
ALTER TABLE notes NO FORCE ROW LEVEL SECURITY;`,
    solutionExplanationHtml: `<p>Read the output as a set of attacks rather than a feature list, because that is what makes it evidence. <code>raw</code> asks whether dropping to plain SQL escapes the policy. <code>cross</code> asks whether naming another tenant's row by its primary key reaches it — the row exists, the id is correct, and it is still invisible, which is the single strongest demonstration that the boundary is enforced by the database rather than by a <code>WHERE</code> clause someone might forget. <code>plant</code> tests the write side, where a <code>USING</code>-only policy would have let a tenant insert a row labelled for someone else. <code>delete</code> tests the grant layer rather than the policy layer: the role simply has no <code>DELETE</code> privilege, so the refusal happens before any policy is consulted.</p>
<p>Each attack maps to a different mechanism, and that is the point of layering. Grants decide <em>which operations</em> a role may attempt; policies decide <em>which rows</em> those operations see; the accessor function is the deliberate hole you cut yourself, narrow and granted to exactly one role. If any single layer is removed the others still hold: without the policy the grants still forbid deletes, and without the grants the policy still hides other tenants' rows.</p>
<p><code>FORCE ROW LEVEL SECURITY</code> is the detail that turns a demo into a control, and its exact reach is worth measuring rather than assuming. Policies normally do not apply to the table owner, so a migration script or an application connecting as the owner silently sees everything — and testing as the owner makes RLS look broken. With <code>FORCE</code>, the owner is inside the boundary: the non-superuser owner counting rows with no context set returns 0, exactly like anyone else. But the superuser still returns 3. <code>FORCE</code> binds the owner, not superusers and not roles carrying <code>BYPASSRLS</code>, and no policy can constrain them — which is precisely why the <code>rolsuper</code> scan in exercise 8 belongs in the same review, and why an application must never connect as one. Note the deliberate reset at the end: leaving <code>FORCE</code> on would make later maintenance on this table surprising, which is itself a lesson about hardening that outlives the person who applied it.</p>
<p>What remains outside this picture is worth naming. The tenant id is trusted from the session setting, so authentication must establish it — treating it as user input defeats everything above. In a pooled application the setting must be transaction-scoped, or one request's tenant leaks into the next. And a superuser or a role with <code>rolbypassrls</code> ignores all of it, which is why the audit query of exercise 8 belongs in the same review as the policy itself.</p>`,
    diagramMermaid: `flowchart TD
  A[tenant_svc request] --> B[grants decide the operation]
  B -->|no DELETE| C[delete refused 42501]
  B -->|SELECT INSERT allowed| D[policy decides the rows]
  D --> E[other tenants invisible even by id]
  D --> F[WITH CHECK refuses planting a foreign row]
  G[auditor] --> H[SECURITY DEFINER accessor the one sanctioned path]
  I[owner under FORCE] --> D`,
    check: `ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE notes NO FORCE ROW LEVEL SECURITY;`,
  },
];

// ---- emit ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VERIFY = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify');
fs.mkdirSync(OUT, { recursive: true });

const setupFile = { name: 'setup.sql', language: 'sql', code: `-- Run this once as a superuser to create the data these exercises work with.\n${SETUP}` };
const clean = ex.map((e) => ({
  title: e.title, difficulty: e.difficulty, estimatedMinutes: e.estimatedMinutes, points: e.points,
  concepts: e.concepts, prerequisites: e.prerequisites, tags: e.tags,
  problemHtml: e.problemHtml, inputSpec: e.inputSpec, outputSpec: e.outputSpec, constraints: e.constraints,
  examplesJson: e.examplesJson, hintsJson: e.hintsJson,
  starterCodeJson: [
    setupFile,
    { name: 'solution.sql', language: 'sql', code: `-- Create the roles, grants or policies described above, then verify them.\n-- Use SET ROLE <role>; to test as that role and RESET ROLE; to return.` },
  ],
  solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: e.solution }],
  solutionExplanationHtml: e.solutionExplanationHtml,
  ...(e.diagramMermaid ? { diagramMermaid: e.diagramMermaid } : {}),
}));
fs.writeFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), JSON.stringify({ trackSlug, moduleSlug, exercises: clean }, null, 2));

let sql = `\\set ON_ERROR_STOP on\n\\pset pager off\n${SETUP}\n`;
ex.forEach((e, i) => { sql += `\n\\echo '===== EX ${i + 1}: ${e.title.replace(/'/g, '')} ====='\n${e.check}\n`; });
fs.writeFileSync(path.join(VERIFY, 'sql-723.sql'), sql);

const parsed = JSON.parse(fs.readFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), 'utf8'));
const diffs = ['EASY', 'EASY', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'HARD', 'HARD'];
if (parsed.exercises.length !== 10) throw new Error('need 10');
const titles = new Set();
parsed.exercises.forEach((e, i) => {
  if (e.difficulty !== diffs[i]) throw new Error(`slot ${i + 1} ${e.difficulty}`);
  if (titles.has(e.title)) throw new Error(`duplicate title ${e.title}`);
  titles.add(e.title);
  if (e.problemHtml.length < 900) throw new Error(`problemHtml<900 ${e.title} (${e.problemHtml.length})`);
  if (e.solutionExplanationHtml.length < 500) throw new Error(`expl<500 ${e.title}`);
  if (e.hintsJson.length < 4) throw new Error(`<4 hints ${e.title}`);
  if (e.examplesJson.length < 2) throw new Error(`<2 ex ${e.title}`);
  const sl = e.solutionCodeJson.map((f) => f.code).join('').length;
  if (sl < 205) throw new Error(`sol<205 ${e.title} (${sl})`);
  if (/TODO|\.\.\./.test(e.solutionCodeJson.map((f) => f.code).join(''))) throw new Error(`incomplete solution ${e.title}`);
});
console.log(`OK ${parsed.exercises.length} -> ${trackSlug}__${moduleSlug}.json`);
