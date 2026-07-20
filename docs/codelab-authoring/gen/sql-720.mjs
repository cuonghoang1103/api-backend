// SQL module 720 (indexing-strategies-and-advanced-schema-design) — 10 exercises. PostgreSQL.
// Every plan summary below came from running the exercise against a real postgres:16
// server with the 60,000-row events table the setup builds. Plans are read through a
// helper that reports the node type, the index actually chosen and its Index Cond,
// because those are stable across runs — buffer counts are not.
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'sql';
const moduleSlug = 'indexing-strategies-and-advanced-schema-design';

const SETUP = `DROP TABLE IF EXISTS events CASCADE;
CREATE TABLE events (
  id         INT  PRIMARY KEY,
  user_id    INT  NOT NULL,
  kind       TEXT NOT NULL,
  email      TEXT NOT NULL,
  payload    JSONB NOT NULL,
  created_at DATE NOT NULL
);
INSERT INTO events
SELECT g,
       g % 5000,
       (ARRAY['click','view','buy','error'])[1 + g % 4],
       'User' || (g % 5000) || '@Example.IO',
       jsonb_build_object('score', g % 100, 'tags', to_jsonb(ARRAY[(ARRAY['a','b','c'])[1 + g % 3]])),
       DATE '2026-01-01' + (g % 200)
FROM generate_series(1, 60000) g;
ANALYZE events;

-- Reports which plan the planner chose: node type, the index it used, and the
-- condition pushed into that index. These are stable run to run; buffer counts
-- and timings are not, so they are what the exercises assert on.
CREATE OR REPLACE FUNCTION plan_uses(q TEXT) RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE j JSONB; node TEXT; idx TEXT; cond TEXT;
BEGIN
  EXECUTE 'EXPLAIN (FORMAT JSON, COSTS OFF) ' || q INTO j;
  node := j->0->'Plan'->>'Node Type';
  SELECT string_agg(DISTINCT v #>> '{}', ',') INTO idx  FROM jsonb_path_query(j, '$.**."Index Name"') AS t(v);
  SELECT string_agg(DISTINCT v #>> '{}', ',') INTO cond FROM jsonb_path_query(j, '$.**."Index Cond"') AS t(v);
  RETURN node || COALESCE(' via ' || idx, '') || COALESCE(' cond ' || cond, '');
END; $$;

-- Parallel workers change the shape of a plan; switch them off so the exercises
-- are about indexes rather than about how many cores the machine has.
SET max_parallel_workers_per_gather = 0;`;

const DROP_IDX = `DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT indexname FROM pg_indexes
           WHERE tablename = 'events' AND indexname <> 'events_pkey' LOOP
    EXECUTE format('DROP INDEX IF EXISTS %I', r.indexname);
  END LOOP;
END; $$;`;

const ex = [
  {
    title: 'Turn a Sequential Scan into an Index Scan',
    difficulty: 'EASY', estimatedMinutes: 20, points: 10,
    concepts: ['Seq Scan versus Index Scan', 'CREATE INDEX', 'EXPLAIN as the source of truth', 'ANALYZE and statistics', 'selectivity'],
    prerequisites: ['SELECT with WHERE', 'reading a query plan'],
    tags: ['index', 'explain', 'performance', 'postgres', 'btree'],
    problemHtml: `<p>Without a usable index, PostgreSQL has one option for <code>WHERE user_id = 42</code>: read every row and test each one — a <strong>sequential scan</strong>. On 60,000 rows that is fast enough to feel fine in a shell, which is exactly why you must never judge a query by how it feels and always judge it by its plan.</p>
<p>The <code>events</code> table holds 60,000 rows and, at the start of this task, only the primary key index.</p>
<ul>
<li>Print <code>before ...</code> — the plan for <code>SELECT * FROM events WHERE user_id = 42</code>, using the <code>plan_uses</code> helper the setup provides.</li>
<li>Create a B-tree index on <code>user_id</code> named <code>ix_events_user</code>, then run <code>ANALYZE events</code> so the planner has fresh statistics.</li>
<li>Print <code>after ...</code> — the same plan again.</li>
<li>Print <code>matched N</code>, the number of rows the query actually returns, and <code>total N</code>, the row count of the table. The ratio between them is the <strong>selectivity</strong> that makes the index worth using.</li>
<li>Then show the other side: print <code>broad ...</code> — the plan for <code>WHERE kind = 'buy'</code>, which matches a quarter of the table. The planner ignores the index it does not have for that column, but note the node type it chooses.</li>
</ul>`,
    inputSpec: 'The events table: 60,000 rows, user_id cycling 0–4999 (so 12 rows per user), kind cycling click/view/buy/error (15,000 each). Only the primary key index exists at the start.',
    outputSpec:
      'Before the index the plan is a Seq Scan; afterwards it is a Bitmap Heap Scan via ix_events_user with the condition on user_id; the query matches 12 of 60,000 rows; and the unindexed broad filter stays a Seq Scan.',
    constraints: 'Judge the outcome from the plan, not from timing. Do not force the planner with enable_seqscan; the point is which plan it chooses on its own.',
    examplesJson: [
      { input: "plan_uses('SELECT * FROM events WHERE user_id = 42')  -- no index yet", output: 'Seq Scan', explanation: 'Every row is read and tested; there is no index the planner could use.' },
      { input: 'after CREATE INDEX ix_events_user ON events(user_id)', output: "Bitmap Heap Scan via ix_events_user cond (user_id = 42)", explanation: 'The index locates the 12 matching rows instead of the executor filtering 60,000.' },
      { input: "plan_uses('SELECT * FROM events WHERE kind = ''buy''')", output: 'Seq Scan', explanation: 'A filter matching a quarter of the table is not selective enough to be worth an index lookup even if one existed.' },
    ],
    hintsJson: [
      'The setup defines plan_uses(query_text) — pass the query as a string.',
      'CREATE INDEX name ON table(column) builds a B-tree, the default type.',
      'Run ANALYZE after building an index so the planner has current statistics.',
      'Compare matched rows against the table size — that ratio drives the planner’s choice.',
    ],
    solution: `${DROP_IDX}
ANALYZE events;

SELECT plan_uses('SELECT * FROM events WHERE user_id = 42') AS before;

CREATE INDEX ix_events_user ON events(user_id);
ANALYZE events;

SELECT plan_uses('SELECT * FROM events WHERE user_id = 42') AS after;

SELECT count(*) AS matched FROM events WHERE user_id = 42;
SELECT count(*) AS total FROM events;

SELECT plan_uses('SELECT * FROM events WHERE kind = ''buy''') AS broad;`,
    solutionExplanationHtml: `<p>An index is a separate, ordered structure that lets the server jump to the rows it wants instead of walking the table. The plan is the only honest evidence that it is being used: a query can be quick on a small table and still be doing exactly the wrong thing, and the day the table grows the plan is what predicted it.</p>
<p>The choice is driven by <strong>selectivity</strong>, the fraction of rows a condition keeps. Twelve rows out of sixty thousand is 0.02 percent, so the index wins easily. A quarter of the table is a different question: fetching 15,000 scattered rows through an index means 15,000 random reads into the heap, while a sequential scan reads the whole table in physical order — often the cheaper plan. That is why the broad filter stays a <code>Seq Scan</code>, and why "add an index" is not an answer to every slow query.</p>
<p>Notice the node type after the index is created: <strong>Bitmap Heap Scan</strong>, not a plain Index Scan. When a query matches more than a handful of scattered rows, PostgreSQL first collects their locations from the index into a bitmap, sorts them, and then reads the heap in physical order — turning random I/O into something closer to sequential. A plain <code>Index Scan</code> appears when very few rows match or when the requested order matches the index. Both mean "the index was used"; the difference is how the heap is visited.</p>
<p><code>ANALYZE</code> matters more than it looks. The planner chooses from estimated row counts, and those come from statistics that a fresh index does not update by itself. A table whose statistics are stale — after a bulk load, say — can have perfect indexes and still be planned as if it were empty, which is one of the most common causes of a query that "suddenly" got slow.</p>`,
    diagramMermaid: `flowchart TD
  A[WHERE user_id = 42] --> B{usable index}
  B -->|no| C[Seq Scan reads all 60000 rows]
  B -->|yes| D{how many rows match}
  D -->|very few| E[Index Scan]
  D -->|a scattered handful| F[Bitmap Heap Scan]
  D -->|a large fraction| C`,
    check: `${DROP_IDX}
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE user_id = 42') AS before;
CREATE INDEX ix_events_user ON events(user_id);
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE user_id = 42') AS after;
SELECT count(*) AS matched FROM events WHERE user_id = 42;
SELECT count(*) AS total FROM events;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''buy''') AS broad;`,
  },
  {
    title: 'Enforce Uniqueness and Get an Index for Free',
    difficulty: 'EASY', estimatedMinutes: 25, points: 10,
    concepts: ['UNIQUE constraint versus unique index', 'indexes backing constraints', 'unique_violation 23505', 'partial unique index', 'NULLs are distinct'],
    prerequisites: ['CREATE INDEX', 'constraints'],
    tags: ['index', 'unique', 'constraints', 'postgres', 'integrity'],
    problemHtml: `<p>A <code>UNIQUE</code> constraint is enforced <em>by</em> an index — PostgreSQL builds one automatically — so uniqueness and lookup speed arrive together. The reverse is not symmetric: a plain <code>CREATE UNIQUE INDEX</code> enforces the same rule but is not listed as a constraint, which matters for tooling and for foreign keys that need one to reference.</p>
<ul>
<li>Create <code>accounts(id INT PRIMARY KEY, email TEXT)</code>, add a <code>UNIQUE</code> constraint on <code>email</code> named <code>uq_accounts_email</code>, and fill it with 5,000 rows — a table small enough to read quickly is planned with a sequential scan no matter how good the index is, so the demonstration needs real size.</li>
<li>Attempt an insert with an email that already exists. Catch it and print the <code>SQLSTATE</code>.</li>
<li>Print <code>backing ...</code> — the index name PostgreSQL created for that constraint, from <code>pg_indexes</code>.</li>
<li>Print <code>lookup ...</code> — the plan for <code>SELECT * FROM accounts WHERE email = 'a@x.io'</code>, showing the constraint's index serves reads too.</li>
<li>Show that NULLs are not duplicates: insert two rows with <code>NULL</code> email and print the resulting row count.</li>
<li>Finally add a <strong>partial</strong> unique index enforcing "only one active row per user" on <code>events</code>-style data: <code>CREATE UNIQUE INDEX ... ON accounts(id) WHERE email IS NOT NULL</code>, and print <code>partial ...</code>, its name from <code>pg_indexes</code>.</li>
</ul>`,
    inputSpec: 'A fresh accounts table created by the exercise and filled with 5,000 rows; the events table is untouched here.',
    outputSpec:
      'The duplicate insert fails with 23505; the constraint is backed by an index named uq_accounts_email; the email lookup is an Index Scan through that index; two NULL emails coexist so the table holds 5,002 rows; and the partial unique index is created alongside.',
    constraints: 'Do not create a separate index on email — the constraint already provides one. Detect the duplicate by catching the error, not by checking first.',
    examplesJson: [
      { input: "inserting an email that already exists", output: 'SQLSTATE 23505', explanation: 'unique_violation, raised by the index that enforces the constraint.' },
      { input: 'the pg_indexes entry for the constraint', output: 'uq_accounts_email', explanation: 'The constraint and its backing index share a name; dropping the index means dropping the constraint.' },
      { input: 'two rows with NULL email', output: 'row count 5002', explanation: 'In SQL two NULLs are not equal, so a UNIQUE column accepts any number of them.' },
    ],
    hintsJson: [
      'ADD CONSTRAINT ... UNIQUE (col) creates the index for you — do not add your own.',
      'pg_indexes lists indexname and indexdef per table.',
      'NULL is not equal to NULL, so unique columns allow repeated NULLs unless declared NOT NULL.',
      'A partial unique index (WHERE ...) enforces uniqueness over a subset only.',
    ],
    solution: `DROP TABLE IF EXISTS accounts CASCADE;
CREATE TABLE accounts (id INT PRIMARY KEY, email TEXT);
ALTER TABLE accounts ADD CONSTRAINT uq_accounts_email UNIQUE (email);

INSERT INTO accounts SELECT g, 'user' || g || '@x.io' FROM generate_series(1, 5000) g;
ANALYZE accounts;

DO $$
BEGIN
  INSERT INTO accounts VALUES (99999, 'user1@x.io');
  RAISE NOTICE 'duplicate unexpectedly accepted';
EXCEPTION WHEN unique_violation THEN
  RAISE NOTICE 'duplicate rejected SQLSTATE %', SQLSTATE;
END;
$$;

SELECT indexname AS backing FROM pg_indexes
WHERE tablename = 'accounts' AND indexname = 'uq_accounts_email';

ANALYZE accounts;
SELECT plan_uses('SELECT * FROM accounts WHERE email = ''user1@x.io''') AS lookup;

INSERT INTO accounts VALUES (100001, NULL), (100002, NULL);
SELECT count(*) AS rows_with_two_nulls FROM accounts;

CREATE UNIQUE INDEX uq_accounts_active ON accounts(id) WHERE email IS NOT NULL;
SELECT indexname AS partial FROM pg_indexes
WHERE tablename = 'accounts' AND indexname = 'uq_accounts_active';`,
    solutionExplanationHtml: `<p>Uniqueness in PostgreSQL is not a separate mechanism from indexing — it <em>is</em> an index, checked on every insert and update. That has a pleasant consequence: adding the constraint you needed for correctness also gives you the index you would have wanted for lookups, so creating your own index on the same column is pure waste that slows down writes for no benefit.</p>
<p>The distinction between a <code>UNIQUE</code> constraint and a bare <code>CREATE UNIQUE INDEX</code> is narrow but real. Both reject duplicates identically. Only the constraint appears in <code>information_schema.table_constraints</code>, can be referenced by a foreign key, and can be dropped by name with <code>ALTER TABLE … DROP CONSTRAINT</code>. Prefer the constraint when the rule is part of the data model; use a bare unique index when you need something a constraint cannot express — most often a <strong>partial</strong> one.</p>
<p>The NULL behaviour surprises people every time. SQL defines <code>NULL = NULL</code> as unknown rather than true, so a unique column accepts unlimited NULLs — which is why "one row per user" implemented as a nullable unique column silently allows thousands of unmatched rows. If NULLs must collide, PostgreSQL 15 added <code>UNIQUE NULLS NOT DISTINCT</code>; before that, the workaround is a partial index or a <code>NOT NULL</code> column.</p>
<p>Partial unique indexes are the tool for rules that apply to a subset: one <em>active</em> subscription per customer, one <em>primary</em> address per account, one undeleted row per key in a soft-delete schema. They are also smaller and cheaper to maintain than a full index, since only the matching rows are stored — the theme exercise 5 develops.</p>`,
    check: `DROP TABLE IF EXISTS accounts CASCADE;
CREATE TABLE accounts (id INT PRIMARY KEY, email TEXT);
ALTER TABLE accounts ADD CONSTRAINT uq_accounts_email UNIQUE (email);
INSERT INTO accounts SELECT g, 'user' || g || '@x.io' FROM generate_series(1, 5000) g;
ANALYZE accounts;
DO $$ BEGIN INSERT INTO accounts VALUES (99999, 'user1@x.io'); RAISE NOTICE 'duplicate unexpectedly accepted'; EXCEPTION WHEN unique_violation THEN RAISE NOTICE 'duplicate rejected SQLSTATE %', SQLSTATE; END; $$;
SELECT indexname AS backing FROM pg_indexes WHERE tablename = 'accounts' AND indexname = 'uq_accounts_email';
ANALYZE accounts;
SELECT plan_uses('SELECT * FROM accounts WHERE email = ''user1@x.io''') AS lookup;
INSERT INTO accounts VALUES (100001, NULL), (100002, NULL);
SELECT count(*) AS rows_with_two_nulls FROM accounts;
CREATE UNIQUE INDEX uq_accounts_active ON accounts(id) WHERE email IS NOT NULL;
SELECT indexname AS partial FROM pg_indexes WHERE tablename = 'accounts' AND indexname = 'uq_accounts_active';`,
  },
  {
    title: 'Order the Columns of a Composite Index Deliberately',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['composite index', 'leading column', 'Index Cond versus full index scan', 'the leftmost-prefix rule is not absolute in PostgreSQL', 'ordering by equality then range'],
    prerequisites: ['CREATE INDEX', 'reading plans'],
    tags: ['index', 'composite', 'postgres', 'performance', 'planning'],
    problemHtml: `<p>A composite index stores rows sorted by its first column, then by its second within each value of the first — like a phone book sorted by surname then forename. That ordering is why column order matters, and it is also why the folklore rule you may have learned elsewhere is <strong>not</strong> accurate for PostgreSQL.</p>
<p>With only <code>ix_events_kind_user ON events(kind, user_id)</code> in place, compare three queries with <code>plan_uses</code>:</p>
<ul>
<li><code>both ...</code> — <code>WHERE kind = 'buy' AND user_id = 7</code>.</li>
<li><code>leading ...</code> — <code>WHERE kind = 'buy'</code> alone.</li>
<li><code>trailing ...</code> — <code>WHERE user_id = 7</code> alone. Read the reported <code>cond</code> carefully and compare it with the first case.</li>
</ul>
<p>Then build the index the other way round as <code>ix_events_user_kind ON events(user_id, kind)</code>, drop the first, and print <code>trailing2 ...</code> for the same <code>WHERE user_id = 7</code>. Finally print <code>rows_kind N</code> and <code>rows_user N</code> — how many rows each filter matches — which is the number that should decide the order.</p>`,
    inputSpec: 'The events table: kind takes 4 values (15,000 rows each) and user_id takes 5,000 values (12 rows each).',
    outputSpec:
      'With the index on (kind, user_id) the two-column query pushes both conditions into the index; the leading-column query pushes one; and the trailing-column query still uses the index but with only user_id in its condition. With the index on (user_id, kind) the same trailing query becomes a targeted lookup. The filters match 15,000 and 12 rows respectively.',
    constraints: 'Only one composite index may exist at a time — drop the others first. Do not add single-column indexes.',
    examplesJson: [
      { input: "plan_uses('SELECT * FROM events WHERE kind = ''buy'' AND user_id = 7')", output: "Bitmap Heap Scan via ix_events_kind_user cond ((kind = 'buy'::text) AND (user_id = 7))", explanation: 'Both columns are pushed into the index, so it seeks directly to the matching entries.' },
      { input: "plan_uses('SELECT * FROM events WHERE user_id = 7')  -- index is (kind, user_id)", output: 'Index Scan via ix_events_kind_user cond (user_id = 7)', explanation: 'PostgreSQL still uses the index — but with no leading-column bound it must walk the whole index and filter, which is far more work than a seek.' },
      { input: 'the same query with the index rebuilt as (user_id, kind)', output: 'Bitmap Heap Scan via ix_events_user_kind cond (user_id = 7)', explanation: 'Now user_id is the leading column, so the same predicate becomes a targeted range of index entries.' },
    ],
    hintsJson: [
      'Drop every index but the primary key before each measurement so the planner has one choice.',
      'Read the cond the helper reports: it shows which predicates reached the index.',
      'A predicate on a non-leading column can still be used, but only by scanning the whole index.',
      'Put the column used for equality in the most queries first, and prefer the more selective one.',
    ],
    solution: `${DROP_IDX}
CREATE INDEX ix_events_kind_user ON events(kind, user_id);
ANALYZE events;

SELECT plan_uses('SELECT * FROM events WHERE kind = ''buy'' AND user_id = 7') AS both;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''buy''')                 AS leading;
SELECT plan_uses('SELECT * FROM events WHERE user_id = 7')                    AS trailing;

DROP INDEX ix_events_kind_user;
CREATE INDEX ix_events_user_kind ON events(user_id, kind);
ANALYZE events;

SELECT plan_uses('SELECT * FROM events WHERE user_id = 7') AS trailing2;

SELECT count(*) AS rows_kind FROM events WHERE kind = 'buy';
SELECT count(*) AS rows_user FROM events WHERE user_id = 7;`,
    solutionExplanationHtml: `<p>The rule usually taught — "an index on (a, b) cannot serve a query on b alone" — is true of MySQL and <strong>false</strong> of PostgreSQL, and the plans here prove it: the trailing-column query does use the index. What changes is <em>how</em>. With a bound on the leading column the scan seeks to a narrow range of index entries; without one it must read the entire index and discard the entries that do not match. The index is still touched, so a naive check for "did it use my index?" reports success while the query does far more work than it should.</p>
<p>That is why the reported <code>cond</code> is the interesting part rather than the index name. In the two-column case both predicates appear, meaning both narrowed the search. In the trailing-only case the condition is applied while scanning, and the plan is an <code>Index Scan</code> over the whole index rather than a targeted <code>Bitmap</code> lookup.</p>
<p>Rebuilding the index as <code>(user_id, kind)</code> turns the same query into a seek. Which order is right depends on the workload, and the row counts at the end give the rule of thumb: <code>user_id = 7</code> matches 12 rows while <code>kind = 'buy'</code> matches 15,000, so leading with <code>user_id</code> narrows the search a thousand times faster. Two practical guidelines follow. Put columns used with <strong>equality</strong> before columns used with a <strong>range</strong>, because everything after the first range predicate can only be filtered, not sought. And when several queries share a prefix, one well-ordered composite index often replaces three single-column ones.</p>
<p>Finally, note what a composite index also gives you for free: it can serve queries on its leading prefix. <code>(user_id, kind)</code> answers <code>WHERE user_id = 7</code> efficiently, so a separate index on <code>user_id</code> alone would be redundant — a duplication exercise 8 shows how to detect.</p>`,
    diagramMermaid: `flowchart TD
  A[index on kind then user_id] --> B[entries sorted by kind first]
  B --> C[WHERE kind and user_id seek a narrow range]
  B --> D[WHERE kind alone seeks a wider range]
  B --> E[WHERE user_id alone must scan every entry]
  F[index on user_id then kind] --> G[WHERE user_id alone now seeks directly]`,
    check: `${DROP_IDX}
CREATE INDEX ix_events_kind_user ON events(kind, user_id);
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''buy'' AND user_id = 7') AS both;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''buy''') AS leading;
SELECT plan_uses('SELECT * FROM events WHERE user_id = 7') AS trailing;
DROP INDEX ix_events_kind_user;
CREATE INDEX ix_events_user_kind ON events(user_id, kind);
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE user_id = 7') AS trailing2;
SELECT count(*) AS rows_kind FROM events WHERE kind = 'buy';
SELECT count(*) AS rows_user FROM events WHERE user_id = 7;`,
  },
  {
    title: 'Answer a Query From the Index Alone with INCLUDE',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['Index Only Scan', 'covering index with INCLUDE', 'the visibility map', 'why VACUUM matters for index-only scans', 'payload columns versus key columns'],
    prerequisites: ['composite indexes', 'reading plans'],
    tags: ['index', 'covering', 'index-only-scan', 'postgres', 'performance'],
    problemHtml: `<p>An ordinary index lookup happens in two steps: find the row locations in the index, then visit the table to fetch the columns. If every column the query needs is already in the index, the second step can be skipped entirely — an <strong>Index Only Scan</strong>. <code>INCLUDE</code> adds columns to an index as payload: stored and returnable, but not part of the sort key, so they do not bloat the searchable structure.</p>
<ul>
<li>With only <code>ix_events_user ON events(user_id)</code>, print <code>needs_heap ...</code> for <code>SELECT user_id, kind FROM events WHERE user_id = 42</code>.</li>
<li>Replace it with <code>ix_events_user_inc ON events(user_id) INCLUDE (kind)</code> and print <code>covering ...</code> for the same query.</li>
<li>Print <code>extra_column ...</code> — the plan for <code>SELECT user_id, kind, created_at FROM events WHERE user_id = 42</code>, which asks for one column the index does not carry.</li>
<li>Run <code>VACUUM events</code>, then print <code>after_vacuum ...</code> for the covered query — index-only scans depend on the visibility map that <code>VACUUM</code> maintains.</li>
<li>Print the two index sizes with <code>pg_size_pretty(pg_relation_size(...))</code> as <code>plain_size</code> and <code>incl_size</code> after rebuilding both, so the cost of the payload is visible.</li>
</ul>`,
    inputSpec: 'The events table with 60,000 rows; user_id = 42 matches 12 of them.',
    outputSpec:
      'The plain index needs the heap; with INCLUDE the plan is STILL a Bitmap Heap Scan until VACUUM runs, and only then becomes an Index Only Scan; asking for a column the index lacks always visits the heap; and the covering index is more than three times the size of the plain one.',
    constraints: 'Use INCLUDE rather than adding the column to the key. Keep exactly the indexes each step describes.',
    examplesJson: [
      { input: "plan_uses('SELECT user_id, kind FROM events WHERE user_id = 42') with index on (user_id)", output: 'Bitmap Heap Scan via ix_events_user cond (user_id = 42)', explanation: 'kind is not in the index, so the table must be visited to fetch it.' },
      { input: 'the same query with INCLUDE (kind), before VACUUM', output: 'Bitmap Heap Scan via ix_events_user_inc cond (user_id = 42)', explanation: 'The index covers the query, but the pages are not yet marked all-visible, so the planner does not expect an index-only scan to pay off.' },
      { input: 'the same query after VACUUM events', output: 'Index Only Scan via ix_events_user_inc cond (user_id = 42)', explanation: 'VACUUM builds the visibility map; only then can the heap be skipped.' },
      { input: 'adding created_at to the select list', output: 'Bitmap Heap Scan via ix_events_user_inc cond (user_id = 42)', explanation: 'One missing column is enough to send the query back to the table — covering is all-or-nothing per query.' },
      { input: 'comparing the two index sizes', output: '520 kB plain versus 1728 kB with the payload', explanation: 'The included column is stored in every leaf entry, so covering is bought with space.' },
    ],
    hintsJson: [
      'INCLUDE columns are stored in the index leaf pages but cannot be searched or ordered by.',
      'An Index Only Scan still checks the visibility map, so it needs a reasonably recent VACUUM.',
      'Adding a column to the key changes the sort order; adding it via INCLUDE does not.',
      'Compare pg_relation_size before and after to see what the payload costs.',
    ],
    solution: `${DROP_IDX}
CREATE INDEX ix_events_user ON events(user_id);
ANALYZE events;
SELECT plan_uses('SELECT user_id, kind FROM events WHERE user_id = 42') AS needs_heap;
SELECT pg_size_pretty(pg_relation_size('ix_events_user')) AS plain_size;

DROP INDEX ix_events_user;
CREATE INDEX ix_events_user_inc ON events(user_id) INCLUDE (kind);
ANALYZE events;
SELECT plan_uses('SELECT user_id, kind FROM events WHERE user_id = 42') AS covering;
SELECT plan_uses('SELECT user_id, kind, created_at FROM events WHERE user_id = 42') AS extra_column;

VACUUM events;
SELECT plan_uses('SELECT user_id, kind FROM events WHERE user_id = 42') AS after_vacuum;
SELECT pg_size_pretty(pg_relation_size('ix_events_user_inc')) AS incl_size;`,
    solutionExplanationHtml: `<p>The heap visit is usually the expensive half of an index lookup: index entries for one user are adjacent, but the rows they point at are scattered across the table, so each one is a random read. An <strong>Index Only Scan</strong> removes that half entirely, which is why covering the hot queries of a read-heavy endpoint is one of the highest-leverage indexing changes available.</p>
<p><code>INCLUDE</code> exists because there are two ways to put a column in an index and only one of them is usually right. Adding it to the key makes it searchable and sortable but changes the index's ordering and enlarges every internal page. Adding it with <code>INCLUDE</code> stores it only in the leaf pages as payload — it cannot be used in a condition or an <code>ORDER BY</code>, but it can be returned, which is exactly what "covering" requires. For a unique index the distinction is stronger still: extra key columns would weaken the uniqueness rule, while <code>INCLUDE</code> columns leave it intact.</p>
<p>Covering is all-or-nothing per query, as the third plan shows. Adding <code>created_at</code> to the select list sends the query straight back to the heap, because a single missing column defeats the optimisation. That makes covering indexes a targeted tool for specific, frequent queries rather than a general strategy — and it argues against <code>SELECT *</code>, which can never be covered.</p>
<p>The dependency on <code>VACUUM</code> is not a footnote here — it is visible in the plans. Immediately after the covering index is built the query is <em>still</em> a Bitmap Heap Scan, because the table's pages are not yet marked all-visible and an index-only scan would have to check every row's visibility in the heap anyway. Running <code>VACUUM</code> builds the visibility map, and only then does the plan become an Index Only Scan. A covering index is therefore a necessary but not sufficient condition; the table also has to be vacuumed.</p>
<p>The dependency on <code>VACUUM</code> is the part that bites in production. PostgreSQL stores row visibility in the rows themselves, not in indexes, so an index-only scan must consult the <strong>visibility map</strong> to confirm a page contains only rows visible to everyone. Pages not marked all-visible force a heap fetch anyway. On a heavily updated table with autovacuum falling behind, an index-only scan quietly degrades into an ordinary one — the plan still says "Index Only Scan" while the <code>Heap Fetches</code> counter in <code>EXPLAIN ANALYZE</code> climbs, which is the number to check when a covered query stops being fast.</p>`,
    check: `${DROP_IDX}
CREATE INDEX ix_events_user ON events(user_id);
ANALYZE events;
SELECT plan_uses('SELECT user_id, kind FROM events WHERE user_id = 42') AS needs_heap;
SELECT pg_size_pretty(pg_relation_size('ix_events_user')) AS plain_size;
DROP INDEX ix_events_user;
CREATE INDEX ix_events_user_inc ON events(user_id) INCLUDE (kind);
ANALYZE events;
SELECT plan_uses('SELECT user_id, kind FROM events WHERE user_id = 42') AS covering;
SELECT plan_uses('SELECT user_id, kind, created_at FROM events WHERE user_id = 42') AS extra_column;
VACUUM events;
SELECT plan_uses('SELECT user_id, kind FROM events WHERE user_id = 42') AS after_vacuum;
SELECT pg_size_pretty(pg_relation_size('ix_events_user_inc')) AS incl_size;`,
  },
  {
    title: 'Index Only the Rows You Query with a Partial Index',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['partial index', 'predicate matching', 'index size and write cost', 'skewed data', 'planner proving implication'],
    prerequisites: ['CREATE INDEX', 'reading plans'],
    tags: ['index', 'partial', 'postgres', 'performance', 'storage'],
    problemHtml: `<p>Most tables are queried unevenly: an errors dashboard reads the 25 percent of rows where <code>kind = 'error'</code> and never touches the rest, yet a full index on <code>created_at</code> stores all 60,000. A <strong>partial index</strong> carries a <code>WHERE</code> clause and indexes only the matching rows — smaller to store, faster to scan, and cheaper on every write that does not match.</p>
<ul>
<li>Build a full index <code>ix_events_created ON events(created_at)</code> and print its size as <code>full_size</code>.</li>
<li>Build a partial index <code>ix_events_err ON events(created_at) WHERE kind = 'error'</code> and print <code>partial_size</code>.</li>
<li>Drop the full index. Print <code>matching ...</code> — the plan for <code>WHERE kind = 'error' AND created_at &gt; DATE '2026-06-01'</code>.</li>
<li>Print <code>non_matching ...</code> — the plan for the same date filter with <code>kind = 'buy'</code>, which the partial index cannot serve.</li>
<li>Print <code>implied ...</code> — the plan for <code>WHERE kind = 'error' AND created_at &gt; DATE '2026-06-15'</code>, a range strictly inside the first one, to see whether the planner still recognises the index applies.</li>
<li>Print <code>rows_error N</code> and <code>rows_total N</code> for context.</li>
</ul>`,
    inputSpec: 'The events table: kind cycles over four values so error matches 15,000 of the 60,000 rows; created_at spans 200 days from 2026-01-01.',
    outputSpec:
      'The partial index is roughly a quarter the size of the full one; queries whose predicate matches the index condition use it; the query on a different kind falls back to a sequential scan; and a narrower date range still qualifies because the planner can prove it implies the index predicate.',
    constraints: 'The partial index must carry the WHERE clause. Do not create a composite index on (kind, created_at) — this exercise is about the partial form.',
    examplesJson: [
      { input: "plan_uses for kind = 'error' AND created_at > '2026-06-01'", output: 'Bitmap Heap Scan via ix_events_err cond (created_at > ...)', explanation: 'The query predicate matches the index predicate, so only the indexed subset is searched.' },
      { input: "the same date filter with kind = 'buy'", output: 'Seq Scan', explanation: 'The partial index contains no rows for that kind, so it cannot answer the query at all.' },
      { input: 'comparing pg_relation_size of the two indexes', output: 'the partial index is about a quarter the size', explanation: 'It stores 15,000 entries instead of 60,000 — and it is only touched by writes to error rows.' },
    ],
    hintsJson: [
      'The predicate goes at the end: CREATE INDEX ... ON t(col) WHERE condition.',
      'The planner uses a partial index only when it can prove the query implies the index predicate.',
      'A query on a different value of the predicate column cannot use the index at all.',
      'Partial indexes cut write amplification too — rows outside the predicate never touch them.',
    ],
    solution: `${DROP_IDX}
CREATE INDEX ix_events_created ON events(created_at);
ANALYZE events;
SELECT pg_size_pretty(pg_relation_size('ix_events_created')) AS full_size;

CREATE INDEX ix_events_err ON events(created_at) WHERE kind = 'error';
ANALYZE events;
SELECT pg_size_pretty(pg_relation_size('ix_events_err')) AS partial_size;

DROP INDEX ix_events_created;
ANALYZE events;

SELECT plan_uses('SELECT * FROM events WHERE kind = ''error'' AND created_at > DATE ''2026-06-01''') AS matching;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''buy''   AND created_at > DATE ''2026-06-01''') AS non_matching;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''error'' AND created_at > DATE ''2026-06-15''') AS implied;

SELECT count(*) AS rows_error FROM events WHERE kind = 'error';
SELECT count(*) AS rows_total FROM events;`,
    solutionExplanationHtml: `<p>A partial index is the answer to skew, and skew is the normal state of real data. Unprocessed jobs are a tiny fraction of a jobs table; undeleted rows are most of a soft-delete table but the deleted ones are dead weight; errors are a slice of an events table. Indexing only the slice you query gives a structure that is smaller to store, cheaper to keep in cache, and — the part people forget — <strong>cheaper to write</strong>, because an insert whose row falls outside the predicate does not touch the index at all.</p>
<p>The planner's rule for using one is stricter than it looks: it must be able to <em>prove</em> that the query's conditions imply the index predicate. An exact match of the predicate obviously qualifies. So does a narrower range, which is why the third query still uses the index — <code>created_at &gt; '2026-06-15'</code> implies <code>created_at &gt; '2026-06-01'</code> is irrelevant here, but <code>kind = 'error'</code> matches the predicate exactly and that is what matters. What does not qualify is a query whose <code>kind</code> is different or unknown at planning time: a parameter such as <code>kind = $1</code> cannot be proven to equal <code>'error'</code>, so a partial index on a value that arrives as a bind parameter will simply never be used. That is the trap worth remembering when a partial index "works in psql but not from the application".</p>
<p>The size comparison makes the trade concrete, and it compounds in production: a smaller index is more likely to stay in shared buffers, so the queries that use it get faster for a second reason beyond having fewer entries to scan.</p>
<p>The general principle is that an index should describe the queries you actually run. A full index on a column where 95 percent of rows share one value is mostly a list of rows nobody looks up; a partial index over the interesting 5 percent is a different structure with the same purpose and a fraction of the cost.</p>`,
    check: `${DROP_IDX}
CREATE INDEX ix_events_created ON events(created_at);
ANALYZE events;
SELECT pg_size_pretty(pg_relation_size('ix_events_created')) AS full_size;
CREATE INDEX ix_events_err ON events(created_at) WHERE kind = 'error';
ANALYZE events;
SELECT pg_size_pretty(pg_relation_size('ix_events_err')) AS partial_size;
DROP INDEX ix_events_created;
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''error'' AND created_at > DATE ''2026-06-01''') AS matching;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''buy'' AND created_at > DATE ''2026-06-01''') AS non_matching;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''error'' AND created_at > DATE ''2026-06-15''') AS implied;
SELECT count(*) AS rows_error FROM events WHERE kind = 'error';
SELECT count(*) AS rows_total FROM events;`,
  },
  {
    title: 'Index a Computed Value with an Expression Index',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['expression index', 'the query must match the expression', 'case-insensitive lookup', 'IMMUTABLE requirement', 'functional uniqueness'],
    prerequisites: ['CREATE INDEX', 'functions in WHERE'],
    tags: ['index', 'expression', 'postgres', 'case-insensitive', 'performance'],
    problemHtml: `<p>Wrapping a column in a function defeats an ordinary index: <code>WHERE lower(email) = 'a@x.io'</code> cannot use an index on <code>email</code>, because the index stores the original values and the server would have to transform every one of them to compare. An <strong>expression index</strong> stores the computed value instead, and the planner uses it when the query contains the same expression.</p>
<ul>
<li>Build a plain index on <code>email</code> and print <code>plain_on_column ...</code> — the plan for <code>WHERE lower(email) = 'user42@example.io'</code>.</li>
<li>Print <code>exact_match ...</code> — the plan for <code>WHERE email = 'User42@Example.IO'</code>, which the plain index can serve.</li>
<li>Drop it, create <code>ix_events_lower_email ON events(lower(email))</code>, and print <code>expr_index ...</code> for the lower-case query.</li>
<li>Print <code>mismatch ...</code> — the plan for <code>WHERE upper(email) = 'USER42@EXAMPLE.IO'</code>, an expression the index does not store.</li>
<li>Print <code>found N</code> — the row count returned by the lower-case lookup — to confirm the index is answering the right question.</li>
</ul>`,
    inputSpec: "The events table where email is built as 'User<n>@Example.IO' with mixed case, so a case-insensitive lookup is required to find a user by address.",
    outputSpec:
      'The plain index on email cannot serve the lower() query so the plan is a sequential scan, while it does serve an exact-case comparison; the expression index serves the lower() query; a different expression falls back to a sequential scan; and the lookup finds 12 rows.',
    constraints: 'Do not add a generated column for this exercise. The query text must contain the same expression the index was built on.',
    examplesJson: [
      { input: "plan_uses for lower(email) = '...' with a plain index on email", output: 'Seq Scan', explanation: 'The index stores original values, so a transformed comparison cannot use it.' },
      { input: 'the same query after CREATE INDEX ON events(lower(email))', output: 'Bitmap Heap Scan via ix_events_lower_email', explanation: 'The index stores the computed value and the query asks for exactly that expression.' },
      { input: "plan_uses for upper(email) = '...'", output: 'Seq Scan', explanation: 'An expression index matches one expression only — upper() is a different one.' },
    ],
    hintsJson: [
      'The expression goes in parentheses: CREATE INDEX ... ON t (lower(col)).',
      'The planner matches expressions syntactically — the query must use the same one.',
      'Only IMMUTABLE functions may be indexed, since the stored value must never change on its own.',
      'A unique expression index enforces case-insensitive uniqueness, which a plain unique column cannot.',
    ],
    solution: `${DROP_IDX}
CREATE INDEX ix_events_email ON events(email);
ANALYZE events;

SELECT plan_uses('SELECT * FROM events WHERE lower(email) = ''user42@example.io''') AS plain_on_column;
SELECT plan_uses('SELECT * FROM events WHERE email = ''User42@Example.IO''')        AS exact_match;

DROP INDEX ix_events_email;
CREATE INDEX ix_events_lower_email ON events(lower(email));
ANALYZE events;

SELECT plan_uses('SELECT * FROM events WHERE lower(email) = ''user42@example.io''') AS expr_index;
SELECT plan_uses('SELECT * FROM events WHERE upper(email) = ''USER42@EXAMPLE.IO''') AS mismatch;

SELECT count(*) AS found FROM events WHERE lower(email) = 'user42@example.io';`,
    solutionExplanationHtml: `<p>An index stores whatever you tell it to store. A plain index on <code>email</code> holds the original mixed-case strings, so a query asking about <code>lower(email)</code> is asking about values that are not in it — the server would have to compute the function for all 60,000 rows, which is precisely the sequential scan it falls back to. Building the index on the expression stores the lower-cased strings, and now the query's request and the index's contents are the same thing.</p>
<p>The matching is essentially syntactic, which is the practical detail to remember: <code>upper(email)</code> gets no help from an index on <code>lower(email)</code>, and neither does <code>email ILIKE '…'</code> or a comparison against a differently-typed value. When an expression index "isn't being used", the first thing to check is whether the query really contains the identical expression.</p>
<p>Only <code>IMMUTABLE</code> functions may be indexed, and the reason is direct: the stored value must remain correct forever. Indexing <code>now() - created_at</code> is impossible because every row's value changes continuously; indexing <code>to_char(created_at, 'YYYY-MM')</code> fails because the result depends on session settings unless the function is pinned. This is also why marking a function <code>IMMUTABLE</code> when it is not — reading a table, say — produces silently wrong answers from the index rather than an error.</p>
<p>The most valuable use of the form is uniqueness rather than speed. <code>CREATE UNIQUE INDEX ON users (lower(email))</code> enforces "no two accounts with the same address regardless of case", a rule a plain unique constraint cannot express and one that most applications discover they needed only after two such accounts exist. Modern PostgreSQL offers an alternative worth knowing: a <code>GENERATED ALWAYS AS (lower(email)) STORED</code> column with an ordinary index, which is easier for the planner to match and lets you query the column directly.</p>`,
    check: `${DROP_IDX}
CREATE INDEX ix_events_email ON events(email);
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE lower(email) = ''user42@example.io''') AS plain_on_column;
SELECT plan_uses('SELECT * FROM events WHERE email = ''User42@Example.IO''') AS exact_match;
DROP INDEX ix_events_email;
CREATE INDEX ix_events_lower_email ON events(lower(email));
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE lower(email) = ''user42@example.io''') AS expr_index;
SELECT plan_uses('SELECT * FROM events WHERE upper(email) = ''USER42@EXAMPLE.IO''') AS mismatch;
SELECT count(*) AS found FROM events WHERE lower(email) = 'user42@example.io';`,
  },
  {
    title: 'Search Inside JSONB with a GIN Index',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['GIN versus B-tree', 'containment operator', 'jsonb_path_ops', 'index size trade-off', 'operator classes decide what is indexable'],
    prerequisites: ['jsonb basics', 'CREATE INDEX'],
    tags: ['index', 'gin', 'jsonb', 'postgres', 'search'],
    problemHtml: `<p>A B-tree indexes a value as a whole, which is useless for "does this document contain this key and value". Semi-structured data needs a different structure: <strong>GIN</strong> (Generalised Inverted Index) stores an entry per <em>element</em> inside the value — each key, each array member — so containment queries can find the documents that hold them.</p>
<ul>
<li>Try the wrong tool first: build a B-tree on <code>payload</code> and print <code>btree ...</code> — the plan for <code>WHERE payload @&gt; '{"score": 5}'</code>.</li>
<li>Drop it, create <code>ix_events_payload ON events USING GIN (payload)</code>, and print <code>gin ...</code> for the same query.</li>
<li>Print <code>array_containment ...</code> — the plan for <code>WHERE payload @&gt; '{"tags": ["b"]}'</code>, showing the same index serves array membership.</li>
<li>Print <code>key_exists ...</code> — the plan for <code>WHERE payload ? 'score'</code>. Every document in this table has that key; predict the plan before you read it.</li>
<li>Print <code>equality ...</code> — the plan for <code>WHERE payload-&gt;&gt;'score' = '5'</code>, an expression GIN does not cover, and think about which index would.</li>
<li>Print <code>gin_size</code> and <code>rows_found N</code> for the containment query.</li>
</ul>`,
    inputSpec: "The events table where payload is {\"score\": n % 100, \"tags\": [one of a/b/c]} — so score 5 matches 600 rows and tag b matches 20,000.",
    outputSpec:
      'The B-tree cannot serve containment so the plan is a sequential scan; the GIN index serves containment and array membership; the key-existence test stays a sequential scan because every document has that key; the ->> equality comparison is not covered either; and the containment query finds 600 rows.',
    constraints: 'Use the containment operator @> rather than extracting and comparing. Do not create an expression index in this exercise.',
    examplesJson: [
      { input: `plan_uses for payload @> '{"score": 5}' with a B-tree on payload`, output: 'Seq Scan', explanation: 'A B-tree can compare whole jsonb values for ordering, but containment is not an ordering question.' },
      { input: 'the same query with a GIN index', output: 'Bitmap Heap Scan via ix_events_payload', explanation: 'GIN stores an entry per key and value inside the document, which is what containment searches.' },
      { input: `plan_uses for payload ? 'score'`, output: 'Seq Scan', explanation: 'GIN can answer key-existence, but every one of the 60,000 documents has that key — a predicate matching everything is never worth an index lookup.' },
      { input: `plan_uses for payload->>'score' = '5'`, output: 'Seq Scan', explanation: 'Extracting a field is an expression, not containment — that needs an expression index on payload->>\'score\'.' },
    ],
    hintsJson: [
      'USING GIN selects the index type; the default is USING BTREE.',
      '@> asks "does the left document contain the right one"; ? asks "does this key exist".',
      'jsonb_path_ops builds a smaller GIN index that supports @> but not ? — a size-versus-flexibility trade.',
      'Field extraction with ->> needs its own expression index; GIN does not cover it.',
    ],
    solution: `${DROP_IDX}
CREATE INDEX ix_events_payload_btree ON events(payload);
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE payload @> ''{"score": 5}''') AS btree;

DROP INDEX ix_events_payload_btree;
CREATE INDEX ix_events_payload ON events USING GIN (payload);
ANALYZE events;

SELECT plan_uses('SELECT * FROM events WHERE payload @> ''{"score": 5}''')      AS gin;
SELECT plan_uses('SELECT * FROM events WHERE payload @> ''{"tags": ["b"]}''')   AS array_containment;
SELECT plan_uses('SELECT * FROM events WHERE payload ? ''score''')              AS key_exists;
SELECT plan_uses('SELECT * FROM events WHERE payload->>''score'' = ''5''')      AS equality;

SELECT pg_size_pretty(pg_relation_size('ix_events_payload')) AS gin_size;
SELECT count(*) AS rows_found FROM events WHERE payload @> '{"score": 5}';`,
    solutionExplanationHtml: `<p>Index types are not interchangeable, and the reason is that each supports a specific set of <em>operators</em>. A B-tree supports ordering comparisons, so it can answer <code>=</code>, <code>&lt;</code> and <code>BETWEEN</code>. Containment (<code>@&gt;</code>) asks a question that has nothing to do with ordering, so no B-tree can help however large it grows — the first plan is a sequential scan not because the index is missing but because it is the wrong shape.</p>
<p>GIN inverts the document: for each key and each value inside the jsonb, it records which rows contain it. That is the same structure a search engine uses for words in documents, and it is why the one index answers containment, array membership and key existence alike. The cost is on the write side — inserting a document means updating one index entry per element, which is why GIN indexes are slower to maintain and why PostgreSQL buffers those updates in a pending list (<code>fastupdate</code>) that is flushed in batches.</p>
<p>The <code>-&gt;&gt;</code> query is the useful counter-example. Extracting a field and comparing it as text is an expression, so it needs an <strong>expression index</strong> — <code>CREATE INDEX ON events ((payload-&gt;&gt;'score'))</code> — which is a B-tree over the extracted value and also supports ranges and sorting, neither of which GIN offers. The two coexist: GIN for "which documents mention this", B-tree over an extracted field for "which documents have this value, in order".</p>
<p>The key-existence plan is a reminder that index support and index <em>use</em> are different questions. GIN can answer <code>?</code>, but every document here contains <code>score</code>, so the predicate selects 100 percent of the table and a sequential scan is simply cheaper — the same selectivity argument as exercise 1, arriving from a different direction. Change the key to one only a few documents carry and the same query becomes an index lookup.</p>
<p>One tuning knob is worth knowing. The default operator class indexes every key and every value; <code>USING GIN (payload jsonb_path_ops)</code> indexes hashes of whole paths instead, producing a noticeably smaller and faster index that supports <code>@&gt;</code> but <strong>not</strong> <code>?</code> or key-existence queries. If your workload is purely containment — which is common — that is usually the better default, and the size difference is the kind of thing worth measuring on your own data rather than assuming.</p>`,
    diagramMermaid: `flowchart TD
  A[jsonb document] --> B[GIN stores one entry per key and value]
  B --> C[containment finds documents holding the element]
  B --> D[key existence and array membership too]
  E[B-tree stores the whole value] --> F[good for equality and ordering]
  F --> G[useless for containment]
  H[expression index on payload field] --> I[equality and ranges on one extracted field]`,
    check: `${DROP_IDX}
CREATE INDEX ix_events_payload_btree ON events(payload);
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE payload @> ''{"score": 5}''') AS btree;
DROP INDEX ix_events_payload_btree;
CREATE INDEX ix_events_payload ON events USING GIN (payload);
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE payload @> ''{"score": 5}''') AS gin;
SELECT plan_uses('SELECT * FROM events WHERE payload @> ''{"tags": ["b"]}''') AS array_containment;
SELECT plan_uses('SELECT * FROM events WHERE payload ? ''score''') AS key_exists;
SELECT plan_uses('SELECT * FROM events WHERE payload->>''score'' = ''5''') AS equality;
SELECT pg_size_pretty(pg_relation_size('ix_events_payload')) AS gin_size;
SELECT count(*) AS rows_found FROM events WHERE payload @> '{"score": 5}';`,
  },
  {
    title: 'Find the Indexes That Only Cost You',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['pg_stat_user_indexes', 'idx_scan counters', 'redundant prefix indexes', 'write amplification', 'dropping safely'],
    prerequisites: ['composite indexes', 'catalog queries'],
    tags: ['index', 'maintenance', 'monitoring', 'postgres', 'cleanup'],
    problemHtml: `<p>Every index is a tax on writes: each insert updates all of them, each update touches those covering changed columns, and each one occupies cache that could hold something useful. Indexes are added eagerly during incidents and almost never removed, so mature databases carry a collection nobody has read from in years.</p>
<ul>
<li>Create three indexes on <code>events</code>: <code>ix_a ON events(user_id)</code>, <code>ix_b ON events(user_id, kind)</code> — whose leading column duplicates the first — and <code>ix_c ON events(email)</code>.</li>
<li>Reset the statistics with <code>SELECT pg_stat_reset()</code>, then run two queries: one filtering on <code>user_id</code> and one on <code>user_id</code> and <code>kind</code>. Do not query <code>email</code> at all. Then call <code>pg_stat_force_next_flush()</code> — counters are accumulated per backend and flushed asynchronously, so reading them immediately reports zeros and would make every index look unused.</li>
<li>Print <code>usage ...</code> — index name and <code>idx_scan</code> for the three indexes from <code>pg_stat_user_indexes</code>, ordered by name.</li>
<li>Print <code>never_used ...</code> — the names of indexes on <code>events</code> with <code>idx_scan = 0</code>, excluding the primary key.</li>
<li>Print <code>redundant ...</code> — the name of the index whose column list is a strict prefix of another's, found from <code>pg_index</code> rather than by eye.</li>
<li>Drop the unused and the redundant index, then print <code>remaining ...</code>, the index names left.</li>
</ul>`,
    inputSpec: 'The events table with three deliberately overlapping indexes and freshly reset statistics.',
    outputSpec:
      'Only ix_b records scans — the planner served both queries from it — so both ix_a and ix_c report zero; the never-used list names ix_a and ix_c; the redundancy check names ix_a as a prefix of ix_b; and after dropping both only ix_b and the primary key remain.',
    constraints: 'Decide from the catalogues, not from memory of what you created. Do not drop an index that has been scanned.',
    examplesJson: [
      { input: 'pg_stat_user_indexes after two queries on user_id', output: 'ix_a=0, ix_b=2, ix_c=0', explanation: 'The planner served both queries from the wider composite index, so the narrow prefix index recorded no scans at all — and the email index was never relevant.' },
      { input: 'comparing the column lists of ix_a and ix_b', output: 'redundant ix_a', explanation: 'An index on (user_id) is a strict prefix of one on (user_id, kind), so the wider index already serves those queries.' },
      { input: 'after dropping both', output: 'remaining events_pkey, ix_b', explanation: 'One composite index covers the workload that three indexes were covering badly.' },
    ],
    hintsJson: [
      'pg_stat_user_indexes has indexrelname and idx_scan per index.',
      'pg_stat_reset() clears the counters so the measurement window starts now, and pg_stat_force_next_flush() makes the latest ones visible immediately.',
      'pg_index.indkey holds the column numbers — a prefix comparison finds redundant indexes.',
      'A zero counter on a young database may just mean the reporting job has not run yet — check the window, not only the number.',
    ],
    solution: `${DROP_IDX}
CREATE INDEX ix_a ON events(user_id);
CREATE INDEX ix_b ON events(user_id, kind);
CREATE INDEX ix_c ON events(email);
ANALYZE events;

SELECT pg_stat_reset();

SELECT count(*) FROM events WHERE user_id = 42;
SELECT count(*) FROM events WHERE user_id = 42 AND kind = 'buy';

-- Counters live in per-backend memory until they are flushed; without this the
-- report below reads all zeros and every index looks unused.
SELECT pg_stat_force_next_flush();

SELECT indexrelname || '=' || idx_scan AS usage
FROM pg_stat_user_indexes
WHERE relname = 'events' AND indexrelname IN ('ix_a','ix_b','ix_c')
ORDER BY indexrelname;

SELECT string_agg(indexrelname, ',' ORDER BY indexrelname) AS never_used
FROM pg_stat_user_indexes
WHERE relname = 'events' AND idx_scan = 0 AND indexrelname <> 'events_pkey';

SELECT a.indexrelid::regclass::text AS redundant
FROM pg_index a
JOIN pg_index b
  ON a.indrelid = b.indrelid
 AND a.indexrelid <> b.indexrelid
 AND array_to_string(b.indkey, ' ') LIKE array_to_string(a.indkey, ' ') || ' %'
WHERE a.indrelid = 'events'::regclass;

DROP INDEX ix_c;
DROP INDEX ix_a;
SELECT string_agg(indexname, ',' ORDER BY indexname) AS remaining
FROM pg_indexes WHERE tablename = 'events';`,
    solutionExplanationHtml: `<p>The counters tell the story before any analysis: <code>ix_b</code> took both scans and <code>ix_a</code> took none. That is the usual real-world signature of a redundant index — the planner simply prefers the wider one that can answer more, and the narrow prefix sits there collecting write cost. The two symptoms, unused and redundant, are the same index seen from two angles.</p>
<p>Two different kinds of waste show up here and they need different evidence. An <strong>unused</strong> index is found from statistics: <code>pg_stat_user_indexes.idx_scan</code> counts how many times the planner chose it, and a counter that stays at zero across a representative period is the only honest basis for dropping it. A <strong>redundant</strong> index is found structurally: an index on <code>(user_id)</code> is a strict prefix of one on <code>(user_id, kind)</code>, and since a composite index can serve queries on its leading prefix, the narrower one adds nothing but write cost. The catalogue query finds that by comparing <code>indkey</code> rather than trusting anyone's memory of what exists.</p>
<p>The cost being avoided is easy to underestimate. Every insert into this table updates every index; an update touches the indexes covering the changed columns, and in the worst case forces a new index entry per index. Five indexes on a hot table can make writes several times more expensive than the table itself requires, and the effect is invisible in query plans — it shows up as write latency and as autovacuum working harder.</p>
<p>Two cautions before dropping anything. Statistics are cumulative since the last reset or crash, so a zero on a database restarted last night means nothing; check <code>stats_reset</code> in <code>pg_stat_database</code> and measure over a period that includes month-end reports and batch jobs, not just a Tuesday afternoon. And a unique index may exist to enforce a constraint rather than to be scanned — dropping it because <code>idx_scan</code> is zero removes a data-integrity rule, which is why the exercise excludes the primary key explicitly.</p>
<p>The safe procedure in production is to make the drop reversible: record the exact <code>CREATE INDEX</code> statement first, drop with <code>DROP INDEX CONCURRENTLY</code> so the table is not locked, and be ready to rebuild — also concurrently — if latency moves. Rebuilding a mistakenly dropped index is a slow inconvenience; keeping fifteen unused ones is a permanent tax.</p>`,
    check: `${DROP_IDX}
CREATE INDEX ix_a ON events(user_id);
CREATE INDEX ix_b ON events(user_id, kind);
CREATE INDEX ix_c ON events(email);
ANALYZE events;
SELECT pg_stat_reset();
SELECT count(*) FROM events WHERE user_id = 42;
SELECT count(*) FROM events WHERE user_id = 42 AND kind = 'buy';
SELECT pg_stat_force_next_flush();
SELECT indexrelname || '=' || idx_scan AS usage FROM pg_stat_user_indexes WHERE relname = 'events' AND indexrelname IN ('ix_a','ix_b','ix_c') ORDER BY indexrelname;
SELECT string_agg(indexrelname, ',' ORDER BY indexrelname) AS never_used FROM pg_stat_user_indexes WHERE relname = 'events' AND idx_scan = 0 AND indexrelname <> 'events_pkey';
SELECT a.indexrelid::regclass::text AS redundant FROM pg_index a JOIN pg_index b ON a.indrelid = b.indrelid AND a.indexrelid <> b.indexrelid AND array_to_string(b.indkey, ' ') LIKE array_to_string(a.indkey, ' ') || ' %' WHERE a.indrelid = 'events'::regclass;
DROP INDEX ix_c;
DROP INDEX ix_a;
SELECT string_agg(indexname, ',' ORDER BY indexname) AS remaining FROM pg_indexes WHERE tablename = 'events';`,
  },
  {
    title: 'Split a Large Table by Range and Watch Pruning Work',
    difficulty: 'HARD', estimatedMinutes: 50, points: 25,
    concepts: ['declarative partitioning', 'partition pruning', 'per-partition indexes', 'cheap bulk deletion by DETACH', 'the partition key must be in the query'],
    prerequisites: ['schema design', 'indexes', 'reading plans'],
    tags: ['partitioning', 'schema-design', 'postgres', 'scale', 'maintenance'],
    problemHtml: `<p>Beyond a certain size, indexing alone stops being enough: maintenance windows grow, autovacuum falls behind, and deleting a year of history rewrites the table. <strong>Declarative partitioning</strong> splits one logical table into physical children by a key, so the planner can skip whole partitions and operations can drop a partition instead of deleting millions of rows.</p>
<ul>
<li>Create <code>logs(id INT, at DATE, msg TEXT) PARTITION BY RANGE (at)</code> with three monthly partitions for January, February and March 2026.</li>
<li>Insert 300 rows spread across the three months and print <code>counts ...</code> — the row count per partition, from the children directly, as <code>name=n</code> joined by a comma.</li>
<li>Print <code>pruned ...</code> — the number of partitions appearing in the plan for a query restricted to February, using the helper <code>partitions_in_plan</code> defined in your solution.</li>
<li>Print <code>no_key ...</code> — the same count for a query filtering only on <code>msg</code>, which cannot be pruned.</li>
<li>Create an index on the parent (<code>CREATE INDEX ON logs(at)</code>) and print <code>child_indexes N</code> — how many indexes now exist across the children, showing the index is cascaded.</li>
<li>Detach and drop the January partition, then print <code>after_drop ...</code> — the remaining row count and the partition list.</li>
</ul>`,
    inputSpec: 'A new partitioned logs table created by the exercise, with 100 rows in each of three monthly partitions.',
    outputSpec:
      'Each partition holds 100 rows; a February-only query touches one partition while a query without the key touches all three; the parent index creates one index per child; and dropping January leaves 200 rows in two partitions.',
    constraints: 'Use declarative partitioning, not inheritance with triggers. Remove January with DETACH plus DROP, not DELETE.',
    examplesJson: [
      { input: "a query with at >= '2026-02-01' AND at < '2026-03-01'", output: 'pruned 1', explanation: 'The planner proves only the February partition can contain matching rows and ignores the others.' },
      { input: "a query filtering on msg only", output: 'no_key 3', explanation: 'Without the partition key the planner cannot exclude anything, so every partition is scanned.' },
      { input: 'DETACH then DROP the January partition', output: 'after_drop 200 rows in 2 partitions', explanation: 'Removing a month is a metadata operation plus a file delete — not a 100-row DELETE that leaves dead tuples behind.' },
    ],
    hintsJson: [
      'PARTITION BY RANGE (col) on the parent; each child declares FOR VALUES FROM (a) TO (b) — the upper bound is exclusive.',
      'Count partitions in a plan by counting distinct Relation Name entries that are not the parent.',
      'An index created on the parent is created on every existing and future partition.',
      'DETACH PARTITION makes the child an ordinary table you can then drop or archive.',
    ],
    solution: `DROP TABLE IF EXISTS logs CASCADE;
CREATE TABLE logs (id INT, at DATE NOT NULL, msg TEXT) PARTITION BY RANGE (at);
CREATE TABLE logs_2026_01 PARTITION OF logs FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE logs_2026_02 PARTITION OF logs FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE logs_2026_03 PARTITION OF logs FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');

INSERT INTO logs
SELECT g, DATE '2026-01-01' + ((g % 3) * 31) + (g % 20), 'msg' || g
FROM generate_series(1, 300) g;
ANALYZE logs;

SELECT string_agg(c.relname || '=' || cnt, ', ' ORDER BY c.relname) AS counts
FROM pg_class c
JOIN LATERAL (SELECT count(*) AS cnt FROM logs l
              WHERE tableoid = c.oid) s ON TRUE
WHERE c.relname LIKE 'logs\\_2026%';

CREATE OR REPLACE FUNCTION partitions_in_plan(q TEXT) RETURNS INT LANGUAGE plpgsql AS $$
DECLARE j JSONB; n INT;
BEGIN
  EXECUTE 'EXPLAIN (FORMAT JSON, COSTS OFF) ' || q INTO j;
  SELECT count(DISTINCT v #>> '{}') INTO n
  FROM jsonb_path_query(j, '$.**."Relation Name"') AS t(v)
  WHERE v #>> '{}' LIKE 'logs\\_2026%';
  RETURN n;
END; $$;

SELECT partitions_in_plan('SELECT * FROM logs WHERE at >= DATE ''2026-02-01'' AND at < DATE ''2026-03-01''') AS pruned;
SELECT partitions_in_plan('SELECT * FROM logs WHERE msg = ''msg7''') AS no_key;

CREATE INDEX ix_logs_at ON logs(at);
SELECT count(*) AS child_indexes FROM pg_indexes WHERE tablename LIKE 'logs\\_2026%';

ALTER TABLE logs DETACH PARTITION logs_2026_01;
DROP TABLE logs_2026_01;
SELECT count(*) AS after_drop_rows FROM logs;
SELECT string_agg(c.relname, ',' ORDER BY c.relname) AS after_drop_partitions
FROM pg_class c WHERE c.relname LIKE 'logs\\_2026%' AND c.relkind = 'r';`,
    solutionExplanationHtml: `<p>Partitioning is a schema-design decision rather than an indexing one, and it solves problems indexes cannot. <strong>Pruning</strong> is the query-time benefit: when the partition key appears in the <code>WHERE</code> clause the planner proves which children can possibly contain matching rows and ignores the rest, so a query over one month of a five-year table reads one sixtieth of the data before any index is consulted. The contrast in this exercise is the whole lesson — with the key, one partition; without it, all three. A workload whose queries do not filter on the partition key gains nothing and pays extra planning cost, which is why the key must be chosen from the queries, not from what feels natural.</p>
<p>The operational benefit is often the bigger one. Removing January is <code>DETACH</code> plus <code>DROP</code>: a catalogue change and a file deletion, effectively instant, leaving no dead tuples for autovacuum to clean. The equivalent <code>DELETE</code> on a monolithic table writes every removed row, bloats the table, and can take longer than the retention period it implements. The same applies to bulk loading, where a new month can be built as a standalone table and attached when ready.</p>
<p>Indexes cascade: creating one on the parent creates a matching index on every current and future partition — three here. That is convenient and also a reminder that each partition is a real table with its own indexes, its own statistics and its own vacuum cycle, which is precisely what keeps maintenance windows bounded.</p>
<p>Two constraints worth knowing before adopting it. A unique constraint on a partitioned table must include the partition key, since PostgreSQL cannot enforce uniqueness across children — a genuine schema-design limit that often forces the key into the primary key. And partitioning has a cost of its own: hundreds of partitions slow planning, so the practical guidance is few enough to plan quickly, large enough to be worth splitting. Rules of thumb aside, the honest test is whether your queries carry the key and whether your retention policy is expressed in partitions.</p>`,
    diagramMermaid: `flowchart TD
  A[logs parent PARTITION BY RANGE at] --> B[logs_2026_01]
  A --> C[logs_2026_02]
  A --> D[logs_2026_03]
  E[query with the partition key] --> C
  F[query without the key] --> B
  F --> C
  F --> D
  G[DETACH plus DROP] --> B`,
    check: `DROP TABLE IF EXISTS logs CASCADE;
CREATE TABLE logs (id INT, at DATE NOT NULL, msg TEXT) PARTITION BY RANGE (at);
CREATE TABLE logs_2026_01 PARTITION OF logs FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE logs_2026_02 PARTITION OF logs FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE logs_2026_03 PARTITION OF logs FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
INSERT INTO logs SELECT g, DATE '2026-01-01' + ((g % 3) * 31) + (g % 20), 'msg' || g FROM generate_series(1, 300) g;
ANALYZE logs;
SELECT string_agg(c.relname || '=' || cnt, ', ' ORDER BY c.relname) AS counts FROM pg_class c JOIN LATERAL (SELECT count(*) AS cnt FROM logs l WHERE tableoid = c.oid) s ON TRUE WHERE c.relname LIKE 'logs\\_2026%';
CREATE OR REPLACE FUNCTION partitions_in_plan(q TEXT) RETURNS INT LANGUAGE plpgsql AS $$
DECLARE j JSONB; n INT;
BEGIN
  EXECUTE 'EXPLAIN (FORMAT JSON, COSTS OFF) ' || q INTO j;
  SELECT count(DISTINCT v #>> '{}') INTO n FROM jsonb_path_query(j, '$.**."Relation Name"') AS t(v) WHERE v #>> '{}' LIKE 'logs\\_2026%';
  RETURN n;
END; $$;
SELECT partitions_in_plan('SELECT * FROM logs WHERE at >= DATE ''2026-02-01'' AND at < DATE ''2026-03-01''') AS pruned;
SELECT partitions_in_plan('SELECT * FROM logs WHERE msg = ''msg7''') AS no_key;
CREATE INDEX ix_logs_at ON logs(at);
SELECT count(*) AS child_indexes FROM pg_indexes WHERE tablename LIKE 'logs\\_2026%';
ALTER TABLE logs DETACH PARTITION logs_2026_01;
DROP TABLE logs_2026_01;
SELECT count(*) AS after_drop_rows FROM logs;
SELECT string_agg(c.relname, ',' ORDER BY c.relname) AS after_drop_partitions FROM pg_class c WHERE c.relname LIKE 'logs\\_2026%' AND c.relkind = 'r';`,
  },
  {
    title: 'Capstone: Design the Index Set for a Whole Workload',
    difficulty: 'HARD', estimatedMinutes: 60, points: 30,
    concepts: ['designing from queries not tables', 'one composite serving several queries', 'covering the hot query', 'partial index for a skewed one', 'verifying every query and rejecting redundancy'],
    prerequisites: ['composite indexes', 'covering indexes', 'partial indexes', 'expression indexes'],
    tags: ['index', 'capstone', 'design', 'postgres', 'performance'],
    problemHtml: `<p>Indexes are designed from the <em>workload</em>, not from the table. Given four queries an application actually runs, choose the smallest set of indexes that serves all of them, then prove each query uses the index you intended and that nothing redundant survives.</p>
<p>The workload against <code>events</code>:</p>
<ul>
<li><strong>Q1</strong> — a user's activity: <code>WHERE user_id = 42 ORDER BY created_at DESC LIMIT 20</code>.</li>
<li><strong>Q2</strong> — a user's activity of one kind: <code>WHERE user_id = 42 AND kind = 'buy'</code>.</li>
<li><strong>Q3</strong> — the error dashboard: <code>WHERE kind = 'error' AND created_at &gt;= DATE '2026-06-01'</code>.</li>
<li><strong>Q4</strong> — case-insensitive lookup by address: <code>WHERE lower(email) = 'user42@example.io'</code>.</li>
</ul>
<p>Build exactly three indexes — a composite serving Q1 and Q2, a partial one for Q3, and an expression one for Q4 — then print, one per line: <code>q1 ...</code>, <code>q2 ...</code>, <code>q3 ...</code> and <code>q4 ...</code> from <code>plan_uses</code>; <code>index_count N</code>, the number of indexes on <code>events</code> excluding the primary key; and <code>redundant N</code>, the number of prefix-redundant pairs among them, which must be zero.</p>`,
    inputSpec: 'The events table with 60,000 rows and no indexes beyond the primary key at the start of the task.',
    outputSpec:
      'Q1 and Q2 both use the composite index on (user_id, created_at DESC) and (user_id, kind) respectively — with one composite chosen to serve both — Q3 uses the partial index, Q4 uses the expression index, exactly three indexes exist, and no index is a prefix of another.',
    constraints: 'Exactly three indexes beyond the primary key. Every query must use an index, and no index may be a strict prefix of another.',
    examplesJson: [
      { input: 'plan_uses for Q1', output: 'Limit via ix_events_user_created cond (user_id = 42)', explanation: 'A composite on (user_id, created_at DESC) satisfies both the filter and the ordering, so the LIMIT stops after 20 index entries with no sort.' },
      { input: 'plan_uses for Q3', output: 'Bitmap Heap Scan via ix_events_err_created cond (created_at >= ...)', explanation: 'The partial index holds only error rows, so the dashboard reads a quarter-sized structure.' },
      { input: 'the redundancy check', output: 'redundant 0', explanation: 'No index is a strict prefix of another — three indexes, three distinct purposes.' },
    ],
    hintsJson: [
      'Design from the queries: list what each one filters on, orders by and returns.',
      'An index whose columns match a filter and an ORDER BY can remove the sort entirely, which is what makes a LIMIT cheap.',
      'A partial index is the right answer when one query targets a skewed subset.',
      'Check redundancy from pg_index, and check that each query really used what you intended with plan_uses.',
    ],
    solution: `${DROP_IDX}

-- Q1 filters by user and orders by time: one composite serves both, and the
-- DESC in the index means the LIMIT reads 20 entries with no sort node.
CREATE INDEX ix_events_user_created ON events(user_id, created_at DESC);

-- Q2 also leads with user_id, but adding kind to the index above would not help
-- the ordering; a second composite is the honest answer for an equality pair.
CREATE INDEX ix_events_user_kind ON events(user_id, kind);

-- Q3 reads only error rows: index the subset, not the table.
CREATE INDEX ix_events_err_created ON events(created_at) WHERE kind = 'error';

-- Q4 asks about a computed value.
CREATE INDEX ix_events_lower_email ON events(lower(email));

DROP INDEX ix_events_user_kind;   -- keep the set minimal: see the explanation

ANALYZE events;

SELECT plan_uses('SELECT * FROM events WHERE user_id = 42 ORDER BY created_at DESC LIMIT 20') AS q1;
SELECT plan_uses('SELECT * FROM events WHERE user_id = 42 AND kind = ''buy''')                AS q2;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''error'' AND created_at >= DATE ''2026-06-01''') AS q3;
SELECT plan_uses('SELECT * FROM events WHERE lower(email) = ''user42@example.io''')           AS q4;

SELECT count(*) AS index_count FROM pg_indexes
WHERE tablename = 'events' AND indexname <> 'events_pkey';

SELECT count(*) AS redundant
FROM pg_index a
JOIN pg_index b
  ON a.indrelid = b.indrelid
 AND a.indexrelid <> b.indexrelid
 AND array_to_string(b.indkey, ' ') LIKE array_to_string(a.indkey, ' ') || ' %'
WHERE a.indrelid = 'events'::regclass;`,
    solutionExplanationHtml: `<p>The design starts from the queries and asks, for each, what would have to be stored in order for the answer to be a lookup rather than a search. Q1 filters on <code>user_id</code> and orders by <code>created_at</code>, so an index on <code>(user_id, created_at DESC)</code> gives both: entries for one user are contiguous and already in the requested order, so the <code>LIMIT 20</code> stops after twenty of them and no sort node appears at all. That combination — filter plus order in one index — is the single most valuable indexing pattern for paginated screens.</p>
<p>Q2 leads with the same column, and this is where the set is kept minimal deliberately. A second composite on <code>(user_id, kind)</code> would serve it slightly better, but the existing <code>(user_id, created_at DESC)</code> already narrows to twelve rows for a user, after which filtering on <code>kind</code> is trivial. Adding an index to save a filter over twelve rows would be paying write cost on every insert to speed up something already fast — which is why the solution creates it, then drops it, and the redundancy count ends at zero. The judgement is the lesson: the smallest set that makes every query <em>fast enough</em> beats the largest set that makes every query optimal.</p>
<p>Q3 is skewed, so it gets a partial index over the quarter of rows that are errors — smaller, cache-friendlier, and untouched by writes of other kinds. Q4 asks about a computed value, so it gets an expression index; nothing else can serve it. Three indexes, three distinct reasons, and each verified rather than assumed.</p>
<p>The verification is as much a part of the deliverable as the indexes. <code>plan_uses</code> confirms each query reached the index intended for it — the common failure is an index that looks right and is quietly ignored because a predicate is wrapped in a function or the parameter type differs. The redundancy query confirms no index is a strict prefix of another. In a real project both belong in a test that runs after every migration, because indexes accumulate: the set is correct today, and the way it stops being correct is one emergency index at a time.</p>`,
    diagramMermaid: `flowchart TD
  A[Q1 user plus order by time] --> B[composite user_id and created_at DESC]
  C[Q2 user plus kind] --> B
  D[Q3 errors in a date range] --> E[partial index on created_at where kind is error]
  F[Q4 lower email] --> G[expression index on lower email]
  B --> H[verify with plan_uses]
  E --> H
  G --> H
  H --> I[check no index is a prefix of another]`,
    check: `${DROP_IDX}
CREATE INDEX ix_events_user_created ON events(user_id, created_at DESC);
CREATE INDEX ix_events_user_kind ON events(user_id, kind);
CREATE INDEX ix_events_err_created ON events(created_at) WHERE kind = 'error';
CREATE INDEX ix_events_lower_email ON events(lower(email));
DROP INDEX ix_events_user_kind;
ANALYZE events;
SELECT plan_uses('SELECT * FROM events WHERE user_id = 42 ORDER BY created_at DESC LIMIT 20') AS q1;
SELECT plan_uses('SELECT * FROM events WHERE user_id = 42 AND kind = ''buy''') AS q2;
SELECT plan_uses('SELECT * FROM events WHERE kind = ''error'' AND created_at >= DATE ''2026-06-01''') AS q3;
SELECT plan_uses('SELECT * FROM events WHERE lower(email) = ''user42@example.io''') AS q4;
SELECT count(*) AS index_count FROM pg_indexes WHERE tablename = 'events' AND indexname <> 'events_pkey';
SELECT count(*) AS redundant FROM pg_index a JOIN pg_index b ON a.indrelid = b.indrelid AND a.indexrelid <> b.indexrelid AND array_to_string(b.indkey, ' ') LIKE array_to_string(a.indkey, ' ') || ' %' WHERE a.indrelid = 'events'::regclass;`,
  },
];

// ---- emit ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VERIFY = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify');
fs.mkdirSync(OUT, { recursive: true });

const setupFile = { name: 'setup.sql', language: 'sql', code: `-- Run this once: it builds the 60,000-row table these exercises measure,\n-- and the plan_uses helper they read plans with.\n${SETUP}` };
const clean = ex.map((e) => ({
  title: e.title, difficulty: e.difficulty, estimatedMinutes: e.estimatedMinutes, points: e.points,
  concepts: e.concepts, prerequisites: e.prerequisites, tags: e.tags,
  problemHtml: e.problemHtml, inputSpec: e.inputSpec, outputSpec: e.outputSpec, constraints: e.constraints,
  examplesJson: e.examplesJson, hintsJson: e.hintsJson,
  starterCodeJson: [
    setupFile,
    { name: 'solution.sql', language: 'sql', code: `-- Build the indexes described above, then read the plans with:\n--   SELECT plan_uses('<your query here>');` },
  ],
  solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: e.solution }],
  solutionExplanationHtml: e.solutionExplanationHtml,
  ...(e.diagramMermaid ? { diagramMermaid: e.diagramMermaid } : {}),
}));
fs.writeFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), JSON.stringify({ trackSlug, moduleSlug, exercises: clean }, null, 2));

let sql = `\\set ON_ERROR_STOP on\n\\pset pager off\n${SETUP}\n`;
ex.forEach((e, i) => { sql += `\n\\echo '===== EX ${i + 1}: ${e.title.replace(/'/g, '')} ====='\n${e.check}\n`; });
fs.writeFileSync(path.join(VERIFY, 'sql-720.sql'), sql);

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
