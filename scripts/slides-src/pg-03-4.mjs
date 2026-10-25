/**
 * pg-03-4 — PostgreSQL · Chapter 3 · Lesson 3.4 "Evolving a schema: ALTER TABLE & normalization" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s03-bang-rang-buoc.mjs › postgresql-3-4-alter-chuan-hoa. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-03-4.out.txt + pg-03-4b.out.txt + pg-03-4c.out.txt). Bổ sung: sửa nhà đang có người ở, công thức 3 bước NOT NULL,
 * NOT VALID/VALIDATE, lock_timeout thật, migration thật của cuongthai.com, 1NF/2NF/3NF, INSERT…SELECT chuyển dữ liệu, khi nào phi chuẩn hoá.
 */
import { lamDeck, sql, psql, run, tbl, two, three, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { arrow } from './pg-03-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-03-4', code: 'PG 3.4', title: 'Evolving a schema', sub: 'ALTER TABLE & normalization' };
const T = (cap, cols, rows, o = {}) => tbl(cols, rows, { cap, ...o });

/* Nhà đang sửa trong khi người ở. */
const house = () => `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial">
  <g data-k="h-live"><rect x="30" y="50" width="420" height="170" rx="12" fill="#eef4fa" stroke="#336791" stroke-width="3"/><text x="240" y="90" text-anchor="middle" font-size="26" font-weight="800" fill="#336791">🏠 a running database</text>
  <text x="240" y="130" text-anchor="middle" font-size="22" fill="#333">users read &amp; write all day</text><text x="240" y="162" text-anchor="middle" font-size="22" fill="#333">rows are already inside</text><text x="240" y="196" text-anchor="middle" font-size="22" fill="#b85a2b" font-weight="700">you cannot “close the shop”</text></g>
  <path d="M470,135 L600,135" stroke="#e08a1e" stroke-width="5"/><path d="M596,118 L626,135 L596,152 z" fill="#e08a1e"/>
  <text x="535" y="118" text-anchor="middle" font-size="20" font-weight="800" fill="#b85a2b">ALTER TABLE</text>
  <g data-k="h-new"><rect x="650" y="50" width="420" height="170" rx="12" fill="#f1f9f4" stroke="#2f7d4f" stroke-width="3"/><text x="860" y="90" text-anchor="middle" font-size="26" font-weight="800" fill="#1f6b40">🔧 renovate while people live</text>
  <text x="860" y="130" text-anchor="middle" font-size="22" fill="#333">add a room (column)</text><text x="860" y="162" text-anchor="middle" font-size="22" fill="#333">add a lock (constraint)</text><text x="860" y="196" text-anchor="middle" font-size="22" fill="#333">without losing furniture (data)</text></g>
</svg>`;

/* Tách bảng: orders_bad → customer + orders. */
const split = () => `<svg viewBox="0 0 1110 120" width="1110" height="120" font-family="Arial">
  <rect x="20" y="30" width="330" height="60" rx="10" fill="#fdf0ee" stroke="#c0392b" stroke-width="3"/><text x="185" y="68" text-anchor="middle" font-size="24" font-weight="800" fill="#c0392b">orders_bad (everything)</text>
  ${arrow(360, 60, 450, 30, '#e08a1e')}${arrow(360, 60, 450, 90, '#e08a1e')}
  <rect x="460" y="5" width="300" height="50" rx="10" fill="#eef4fa" stroke="#336791" stroke-width="3"/><text x="610" y="38" text-anchor="middle" font-size="22" font-weight="800" fill="#336791">customer  (who)</text>
  <rect x="460" y="65" width="300" height="50" rx="10" fill="#fff7ef" stroke="#e08a1e" stroke-width="3"/><text x="610" y="98" text-anchor="middle" font-size="22" font-weight="800" fill="#b85a2b">orders  (what was bought)</text>
  <path d="M760,90 L850,90 L850,30 L760,30" fill="none" stroke="#404040" stroke-width="3"/><text x="880" y="68" font-size="21" font-weight="800" fill="#2f7d4f">customer_id → FK</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 3 — Tables, constraints & schema design', bai: '3.4' }, [
  { cover: true, t: 'Evolving a schema:<br>ALTER TABLE & normalization', sub: 'Change a live table safely —<br>and design it so it needs fewer changes.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li><code class="i">ALTER TABLE</code> on a table that <b>already has rows</b>: add, tighten, rename, drop</li>
<li>The <b>3-step recipe</b> for a new <code class="i">NOT NULL</code> column and <code class="i">NOT VALID</code> + <code class="i">VALIDATE</code></li>
<li>Which ALTERs <b>lock</b> the table — and <code class="i">lock_timeout</code> as a safety net</li>
<li><b>Normalization</b>: one fact, one place — 1NF, 2NF, 3NF in plain words</li>
<li>Migrating bad data into good tables, and when <i>not</i> to normalize</li>
</ul>
${box('Where we are', 'Chapter 3 so far: keys (3.1), foreign keys (3.2), column constraints (3.3). Real schemas <b>change</b> — this lesson is how, and how to need fewer changes. Lab 1 follows.', 'lam')}` },

  { t: 'Everyday example first: renovating an occupied house', body: `
${house()}
<p style="font-size:24px;margin:0">A database is not a blueprint — it is a house with people <b>already living in it</b>. New features need a new room, a new rule, a moved wall. <code class="i">ALTER TABLE</code> is how you renovate <b>without evicting anyone and without losing the furniture</b>; the skill is knowing which jobs are quick and which block the whole street.</p>` },

  { t: 'The ALTER TABLE toolbox', body: `
${zm(`<table class="t">
<tr><th style="width:330px">Job</th><th>Statement</th></tr>
<tr><td>Add a column</td><td><code class="i">ALTER TABLE t ADD COLUMN c type [constraints]</code></td></tr>
<tr><td>Require a value / drop the requirement</td><td><code class="i">ALTER COLUMN c SET NOT NULL</code> / <code class="i">DROP NOT NULL</code></td></tr>
<tr><td>Set / remove a default</td><td><code class="i">ALTER COLUMN c SET DEFAULT x</code> / <code class="i">DROP DEFAULT</code></td></tr>
<tr><td>Add a rule (CHECK, UNIQUE, FK)</td><td><code class="i">ADD CONSTRAINT name …</code></td></tr>
<tr><td>Remove a rule</td><td><code class="i">DROP CONSTRAINT name</code></td></tr>
<tr><td>Rename</td><td><code class="i">RENAME COLUMN a TO b</code> · <code class="i">RENAME TO new_table</code></td></tr>
<tr><td>Change a type / remove a column</td><td><code class="i">ALTER COLUMN c TYPE …</code> · <code class="i">DROP COLUMN c</code></td></tr>
</table>`, 1.18)}` },

  { t: 'Adding columns to a table that has rows', body: `
${zm(run(`CREATE TABLE contact (id int PRIMARY KEY, name text);
INSERT INTO contact VALUES (1,'Cuong'),(2,'Lan');

ALTER TABLE contact ADD COLUMN email text;                            -- nullable: free
ALTER TABLE contact ADD COLUMN status text NOT NULL DEFAULT 'active'; -- default fills old rows`, `ALTER TABLE
ALTER TABLE`, { hlOut: [1, 2] }), 1.18)}
${two(box('Nullable column', 'Existing rows simply get <code class="i">NULL</code>. Changes only the table’s <b>catalog</b> — instant, whatever the table size.', 'xanh'),
box('NOT NULL + DEFAULT', 'The default <b>fills</b> every existing row, so the NOT NULL rule is satisfied at once. A constant default is also instant (PostgreSQL 11+).', 'lam'))}` },

  { t: 'NOT NULL with no default: the 3-step recipe', body: `
${zm(run(`ALTER TABLE contact ADD COLUMN phone text NOT NULL;     -- no default`, `ERROR:  column "phone" of relation "contact" contains null values`, { hlOut: [1] }), 1.2)}
<p style="font-size:23px;margin:0">The 2 existing rows would have <code class="i">phone = NULL</code>, which the new rule forbids. The recipe used in real migrations:</p>
${steps(['<b>Add</b> the column as <b>nullable</b>: <code class="i">ADD COLUMN phone text</code>', '<b>Backfill</b> the existing rows: <code class="i">UPDATE contact SET phone = \'unknown\'</code>', '<b>Tighten</b>: <code class="i">ALTER COLUMN phone SET NOT NULL</code>'])}
${zm(run(`INSERT INTO contact (id, name) VALUES (3, 'Binh');   -- afterwards`, `ERROR:  null value in column "phone" of relation "contact" violates not-null constraint
DETAIL:  Failing row contains (3, Binh, null).`, { hlOut: [1, 2] }), 1.05)}` },

  { t: 'Tighten later: SET NOT NULL and ADD CONSTRAINT', body: `
${zm(run(`ALTER TABLE contact ALTER COLUMN name SET NOT NULL;
ALTER TABLE contact ADD CONSTRAINT contact_status_chk CHECK (status IN ('active','archived'));
SELECT * FROM contact ORDER BY id;`, ` id | name  | email | status
----+-------+-------+--------
  1 | Cuong |       | active
  2 | Lan   |       | active
(2 rows)`, { hlOut: [3, 4] }), 1.15)}
${zm(psql(`Check constraints:
    "contact_status_chk" CHECK (status = ANY (ARRAY['active'::text, 'archived'::text]))`, { sm: true, title: '\\d contact (excerpt) — real' }), 1.15)}
<ul style="font-size:22px;margin:0"><li>Both rows got <code class="i">status = 'active'</code> from the default; <code class="i">email</code> is NULL; <code class="i">name</code> is now required</li><li>PostgreSQL <b>scans every row</b> to be sure the new rule holds — fine here, long on a big table</li></ul>` },

  { t: 'Big tables: NOT VALID, then VALIDATE', body: `
${zm(run(`CREATE TABLE big (id int PRIMARY KEY, status text);
INSERT INTO big VALUES (1,'active'), (2,'weird');

ALTER TABLE big ADD CONSTRAINT big_status_chk CHECK (status IN ('active','archived'));
ALTER TABLE big ADD CONSTRAINT big_status_chk CHECK (status IN ('active','archived')) NOT VALID;
INSERT INTO big VALUES (3,'weird2');
ALTER TABLE big VALIDATE CONSTRAINT big_status_chk;
UPDATE big SET status = 'archived' WHERE id = 2;
ALTER TABLE big VALIDATE CONSTRAINT big_status_chk;`, `ERROR:  check constraint "big_status_chk" of relation "big" is violated by some row
ALTER TABLE
ERROR:  new row for relation "big" violates check constraint "big_status_chk"
DETAIL:  Failing row contains (3, weird2).
ERROR:  check constraint "big_status_chk" of relation "big" is violated by some row
UPDATE 1
ALTER TABLE`, { hlOut: [2, 3, 4, 6, 7] }), 0.9)}
<ul style="font-size:21px;margin:0">
<li><code class="i">NOT VALID</code> = enforce on <b>new</b> writes now, skip the old rows (fast). The new row 3 is already rejected</li>
<li><code class="i">VALIDATE</code> later checks old rows with a <b>lighter lock</b>; it fails until the bad row is fixed, then succeeds</li>
</ul>` },

  { t: 'Rename, drop — and which ALTERs lock the table', body: `
${zm(sql(`ALTER TABLE contact RENAME COLUMN email TO mail;   -- instant
ALTER TABLE contact DROP COLUMN mail;                -- instant (space reclaimed later)`, { sm: true }), 1.15)}
${cards([
  ['Instant (catalog only)', 'Add a <b>nullable</b> column · add a column with a <b>constant</b> default (PG 11+) · drop a column · rename. Milliseconds on any size.'],
  ['Rewrites the WHOLE table', 'Change a column’s <b>type</b> · add a column with a non-constant default. On 10 M rows: an exclusive lock for <b>minutes</b> — an incident.'],
  ['Scans, no rewrite', 'Add <b>NOT NULL</b> or a <b>CHECK</b>: faster, still an exclusive lock. Use <b>NOT VALID</b> first, VALIDATE later.'],
], 3).replace(/<b>/g, '<span class="lam">').replace(/<\/b>/g, '</span>')}
<p style="font-size:21px;margin:0">And a queue effect: an ALTER <b>waiting</b> for its lock blocks every query that arrives after it — so even a quick ALTER can stall the site.</p>` },

  { t: 'lock_timeout: fail early instead of blocking everyone', body: `
${zm(sql(`-- session A (a long transaction holding the table)
BEGIN; LOCK TABLE contact IN ACCESS EXCLUSIVE MODE; SELECT pg_sleep(6);`, { sm: true }), 1.1)}
${zm(run(`-- session B (your migration)
SET lock_timeout = '1s';
ALTER TABLE contact ADD COLUMN z int;`, `SET
ERROR:  canceling statement due to lock timeout`, { hlOut: [2] }), 1.15)}
${two(box('What happened', 'B waited <b>1 second</b>, then gave up with a clear error — instead of queueing forever and freezing every other query behind it.', 'xanh'),
box('The rule', 'Before any production ALTER: check the <b>row count</b>, know whether it <b>rewrites</b>, and <code class="i">SET lock_timeout</code> so a blocked migration fails <b>early</b>. A one-thousand-row dev table hides all of this.', 'do2'))}` },

  { t: 'A migration is a pile of ALTER statements', body: `
${zm(sql(`-- prisma/migrations/20261022150000_course_lo_trinh_ky/migration.sql
-- (comment translated) two NULLable columns ⇒ no long lock, old data untouched.
ALTER TABLE "courses" ADD COLUMN "lo_trinh_ky" INTEGER;
ALTER TABLE "courses" ADD COLUMN "lo_trinh_thu_tu" INTEGER;

CREATE INDEX "idx_courses_lo_trinh_ky" ON "courses"("lo_trinh_ky");`, { sm: true }), 1.2)}
${two(box('You rarely type ALTER by hand', 'An ORM such as <b>Prisma</b> diffs your model against the database and <b>writes the SQL migration</b> for you. The files are applied in order and recorded, so every environment ends in the same shape.', 'info'),
box('But you must read it', 'A migration <i>is</i> ALTER TABLE. If you know which statements lock or rewrite, a migration error stops being mysterious — and you can spot a dangerous one <b>before</b> deploy.', 'xanh'))}
<p class="nho">This real migration followed the lesson’s rule: nullable columns only, so it was instant on production.</p>` },

  { t: 'Normalization: one fact, one place', body: `
${zm(run(`CREATE TABLE orders_bad (
  order_id      int PRIMARY KEY,
  customer_name text,
  customer_city text,
  product       text,
  amount        numeric(12,2)
);
INSERT INTO orders_bad VALUES
 (1,'Cuong','Hanoi','Keyboard',100),
 (2,'Cuong','Hanoi','Mouse',50),
 (3,'Lan','Danang','Monitor',300);`, `CREATE TABLE
INSERT 0 3`, { hlOut: [] }), 0.92)}
${zm(T('orders_bad — the customer’s city is typed on every order', ['order_id', 'customer_name', 'customer_city', 'product', 'amount'], [['1', 'Cuong', 'Hanoi', 'Keyboard', '100.00'], ['2', 'Cuong', 'Hanoi', 'Mouse', '50.00'], ['3', 'Lan', 'Danang', 'Monitor', '300.00']], { hl: [0, 1] }), 1.0)}` },

  { t: 'The update anomaly (real)', body: `
${zm(run(`UPDATE orders_bad SET customer_city='Saigon' WHERE order_id=1;   -- forgot order 2!
SELECT * FROM orders_bad WHERE customer_name='Cuong' ORDER BY order_id;`, `UPDATE 1
 order_id | customer_name | customer_city | product  | amount
----------+---------------+---------------+----------+--------
        1 | Cuong         | Saigon        | Keyboard | 100.00
        2 | Cuong         | Hanoi         | Mouse    |  50.00
(2 rows)`, { hlOut: [4, 5] }), 1.15)}
${two(box('Cuong lives in two cities', 'The same fact is stored twice, one copy was updated. Nothing says <b>which is right</b> — the data now contradicts itself.', 'do2'),
box('Three anomalies, one cause', '<b>Update</b> (this one) · <b>insert</b> (cannot record a customer who has no order yet) · <b>delete</b> (deleting the last order erases the customer). Cause: a fact stored in more than one place.', 'lam'))}` },

  { t: 'The fix: give each fact one home', body: `
${split()}
${zm(sql(`CREATE TABLE customer (
  id   int PRIMARY KEY,
  name text NOT NULL,
  city text
);
CREATE TABLE orders (
  id          int PRIMARY KEY,
  customer_id int NOT NULL REFERENCES customer(id),
  product     text NOT NULL,
  amount      numeric(12,2) NOT NULL CHECK (amount >= 0)
);`, { sm: true }), 1.12)}
<p style="font-size:21px;margin:0">Facts about the <b>customer</b> go to <code class="i">customer</code>; an order only <b>points</b> at it with a foreign key (lesson 3.2). All the constraints of this chapter are back in use.</p>` },

  { t: 'Update once — every order follows', body: `
${zm(run(`INSERT INTO customer VALUES (1,'Cuong','Hanoi'),(2,'Lan','Danang');
INSERT INTO orders VALUES (1,1,'Keyboard',100),(2,1,'Mouse',50),(3,2,'Monitor',300);

UPDATE customer SET city='Saigon' WHERE id=1;    -- one row, done
SELECT o.id, c.name, c.city, o.product, o.amount
FROM orders o JOIN customer c ON c.id = o.customer_id
ORDER BY o.id;`, ` id | name  |  city  | product  | amount
----+-------+--------+----------+--------
  1 | Cuong | Saigon | Keyboard | 100.00
  2 | Cuong | Saigon | Mouse    |  50.00
  3 | Lan   | Danang | Monitor  | 300.00
(3 rows)`, { hlOut: [3, 4] }), 1.05)}
<p style="font-size:22px;margin:0">One <code class="i">UPDATE 1</code>, and both of Cuong’s orders show Saigon. A <b>JOIN</b> (Chapter 5) puts the picture back together when you read. This is the whole payoff: <b>store each fact once, reference it everywhere</b>.</p>` },

  { t: 'Normal forms in plain words (1NF → 3NF)', body: `
${zm(three(
  `<div class="card"><div class="h">1NF — one value per cell</div><p>No lists in a column. <code class="i">tags = 'sql,db'</code> breaks it → use a <b>link table</b> (lesson 3.1).</p></div>`,
  `<div class="card"><div class="h">2NF — depend on the WHOLE key</div><p>In a table keyed by (student, course), the <b>course title</b> depends only on <i>course</i> → move it to <code class="i">course</code>.</p></div>`,
  `<div class="card"><div class="h">3NF — depend on nothing but the key</div><p>A <b>city</b> that depends on the customer, not the order, is a hop away from the key → own table.</p></div>`), 1.1)}
${zm(run(`SELECT id, title FROM post_bad WHERE tags LIKE '%sql%';   -- tags are 'sql,db' / 'nosql,db' / 'food'`, ` id |    title
----+--------------
  1 | Intro to SQL
  2 | Mongo tips
(2 rows)`, { hlOut: [5] }), 1.05)}
<p class="nho">The “1NF trap” in action: searching “sql” also finds the <b>nosql</b> post. Mnemonic: “the key, the whole key, and nothing but the key.” Full theory: DBI202 → cuongthai.com/courses/introduction-to-databases.</p>` },

  { t: '2NF in action: a fact copied across rows', body: `
${zm(run(`-- enroll_bad: PRIMARY KEY (student_id, course_id), but course_title depends on course_id alone
UPDATE enroll_bad SET course_title = 'PostgreSQL 17' WHERE student_id = 1 AND course_id = 10;
SELECT course_id, course_title FROM enroll_bad ORDER BY course_id, student_id;`, `UPDATE 1
 course_id | course_title
-----------+---------------
        10 | PostgreSQL 17
        10 | PostgreSQL
        20 | Docker
(3 rows)`, { hlOut: [4, 5] }), 0.95)}
${zm(two(T('enroll_bad (before)', ['student', 'course', 'course_title', 'grade'], [['1', '10', 'PostgreSQL', '9'], ['2', '10', 'PostgreSQL', '8'], ['1', '20', 'Docker', '7']], { hl: [0, 1] }),
`<div>${T('course', ['id', 'title'], [['10', 'PostgreSQL'], ['20', 'Docker']])}<div style="height:8px"></div>${T('enroll', ['student', 'course', 'grade'], [['1', '10', '9'], ['2', '10', '8'], ['1', '20', '7']])}</div>`), 0.82)}` },

  { t: 'Migrating bad data into good tables', body: `
${zm(run(`CREATE TABLE customer2 (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text NOT NULL UNIQUE, city text);
INSERT INTO customer2 (name, city)
SELECT DISTINCT ON (customer_name) customer_name, customer_city
FROM orders_bad ORDER BY customer_name, order_id DESC;
SELECT * FROM customer2 ORDER BY id;`, `INSERT 0 2
 id | name  |  city
----+-------+--------
  1 | Cuong | Hanoi
  2 | Lan   | Danang
(2 rows)`, { hlOut: [1, 3, 4] }), 1.05)}
${two(box('INSERT … SELECT DISTINCT ON', 'Builds the new <code class="i">customer</code> table from the old one: one row per name. Then orders get <code class="i">customer_id</code> by joining on the name.', 'info'),
box('But which city is right?', 'Cuong had “Saigon” and “Hanoi”. The query picked the <b>latest order’s</b> value (Hanoi) — a <b>business decision</b>, not a SQL one. Dirty data forces a choice; decide it on purpose.', 'do2'))}` },

  { t: 'When NOT to normalize', body: `
${two(box('Denormalize only with a reason you measured', 'Read-heavy reports, a counter you would otherwise <code class="i">COUNT(*)</code> millions of rows for, a <b>snapshot</b> that must not change (an order line keeps the price <i>at purchase</i> — CT Shop’s <code class="i">unit_price</code>). Copying data is a <b>trade</b>: faster reads, you now maintain the copies.', 'lam'),
box('This site is normalized', 'A course title lives once on the course row; lessons point at it with <code class="i">course_id</code>. A user’s name lives once on the user row; notes, messages and comments store only the user id — that is why renaming yourself updates everywhere at once.', 'xanh'))}
${box('Rule of thumb', 'Copying the same value into many rows is a smell. <b>When in doubt, normalize</b>; denormalize later, with a measurement, and keep the original as the source of truth.', '')}
<p class="nho">Theory (functional dependencies, BCNF): DBI202 → cuongthai.com/courses/introduction-to-databases.</p>` },

  { t: 'Coming from SQL Server? ALTER differences', body: `
${zm(`<table class="t">
<tr><th style="width:330px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td><code class="i">ALTER TABLE t ADD c int</code> (no <code class="i">COLUMN</code> keyword)</td><td><code class="i">ADD COLUMN c int</code></td></tr>
<tr><td><code class="i">ALTER COLUMN c int NOT NULL</code> — retype <i>and</i> null in one clause</td><td>Separate: <code class="i">ALTER COLUMN c TYPE …</code>, <code class="i">SET NOT NULL</code>, <code class="i">SET DEFAULT</code></td></tr>
<tr><td><code class="i">sp_rename 't.a', 'b', 'COLUMN'</code></td><td><code class="i">RENAME COLUMN a TO b</code></td></tr>
<tr><td><code class="i">WITH NOCHECK</code> on ADD CONSTRAINT</td><td><code class="i">NOT VALID</code> (then <code class="i">VALIDATE CONSTRAINT</code>)</td></tr>
<tr><td>DDL in a transaction: partial support</td><td><b>Transactional DDL</b>: <code class="i">BEGIN; ALTER …; ROLLBACK;</code> undoes it</td></tr>
<tr><td><code class="i">SET LOCK_TIMEOUT 1000</code> (ms)</td><td><code class="i">SET lock_timeout = '1s'</code></td></tr>
</table>`, 1.15)}` },

  { t: 'Exercise: add a column safely', giua: true, body: `
<p style="font-size:23px;margin:0">The <b>contact</b> table already has two rows. Add a <b>required</b> <code class="i">phone</code> column (no sensible default) <b>without</b> a single error, then prove that new rows without a phone are rejected.</p>
${zm(sql(`-- 1) add nullable   2) backfill   3) tighten
ALTER TABLE contact ADD COLUMN phone text;
UPDATE contact SET phone = 'unknown';
ALTER TABLE contact ALTER COLUMN phone SET NOT NULL;

INSERT INTO contact (id, name) VALUES (3, 'Binh');   -- must fail`, { sm: true }), 1.22)}
${zm(psql(`ERROR:  null value in column "phone" of relation "contact" violates not-null constraint
DETAIL:  Failing row contains (3, Binh, null).`, { sm: true, title: 'real output — PostgreSQL 17' }), 1.1)}
<p class="nho">Pause and write it first; the three steps are the recipe from earlier.</p>` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:27px">
<li>Why does <code class="i">ADD COLUMN x text NOT NULL</code> fail on a table with rows — and what are the <b>three steps</b> that work?</li>
<li>What do <code class="i">NOT VALID</code> and <code class="i">VALIDATE CONSTRAINT</code> buy you on a huge table? Why set <code class="i">lock_timeout</code>?</li>
<li>A city is stored on every order. Name the anomaly and the fix.</li>
</ol>
${box('Answers', '<b>1.</b> Existing rows would be NULL; add nullable → backfill → <code class="i">SET NOT NULL</code>. <b>2.</b> New writes are checked at once, old rows later under a lighter lock; lock_timeout makes a blocked migration fail early instead of freezing the site. <b>3.</b> Update anomaly; move the city to a <code class="i">customer</code> table and reference it by a foreign key.', 'xanh')}` },

  { t: 'Summary — and Lab 1 is next', to: true, body: `
<ul>
<li><code class="i">ALTER TABLE</code> evolves a live table: add (nullable or with default = instant), tighten later, rename, drop</li>
<li>New <b>NOT NULL</b> column: add nullable → backfill → <code class="i">SET NOT NULL</code>; big tables: <code class="i">NOT VALID</code> then <code class="i">VALIDATE</code></li>
<li>Know what <b>locks / rewrites</b>; use <code class="i">lock_timeout</code>; a migration is just ALTERs</li>
<li><b>Normalize</b>: one fact in one place (1NF · 2NF · 3NF); denormalize only with a measured reason</li>
</ul>
${box('Next: Lab 1 — build CT Shop', 'You now have every tool of Chapter 3: <b>keys, foreign keys, constraints, ALTER and normalization</b>. In Lab 1 you turn the CT Shop ERD into a real schema — then Chapter 4 fills it with data.', 'lam')}` },
]);
