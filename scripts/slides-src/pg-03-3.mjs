/**
 * pg-03-3 — PostgreSQL · Chapter 3 · Lesson 3.3 "Column constraints: NOT NULL, DEFAULT, UNIQUE, CHECK & generated columns" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s03-bang-rang-buoc.mjs › postgresql-3-3-rang-buoc-cot. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-03-3.out.txt + pg-03-ctshop.out.txt). Bổ sung: cổng soát vé đời thường, NULL ≠ chuỗi rỗng, UNIQUE cho phép nhiều NULL,
 * `= NULL` vs `IS NULL`, \d product, CT Shop thật, CHECK "đúng một nguồn" của cuongthai.com, bài tập review.
 */
import { lamDeck, sql, psql, run, tbl, two, three, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';
import { gates } from './pg-03-hinh.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
export const deck = { key: 'pg-03-3', code: 'PG 3.3', title: 'Column constraints', sub: 'NOT NULL, DEFAULT, UNIQUE, CHECK & generated columns' };

const T = (cap, cols, rows, o = {}) => tbl(cols, rows, { cap, ...o });

const PRODUCT_DDL = `CREATE TABLE product (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku          text NOT NULL UNIQUE,
  name         text NOT NULL,
  price        numeric(12,2) NOT NULL CHECK (price >= 0),
  discount_pct int NOT NULL DEFAULT 0 CHECK (discount_pct BETWEEN 0 AND 100),
  final_price  numeric(12,2) GENERATED ALWAYS AS (round(price * (100 - discount_pct) / 100, 2)) STORED,
  created_at   timestamptz NOT NULL DEFAULT now()
);`;

export const slides = lamDeck({ chuong: 'Chapter 3 — Tables, constraints & schema design', bai: '3.3' }, [
  { cover: true, t: 'Column constraints', sub: 'NOT NULL · DEFAULT · UNIQUE · CHECK ·<br>generated columns — rules that make bad data impossible.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>Each constraint as a <b>gate</b> that a bad row cannot pass — with the <b>real error</b> it throws</li>
<li><code class="i">NOT NULL</code> and <code class="i">DEFAULT</code>: required fields and pre-filled fields</li>
<li><code class="i">UNIQUE</code> (single and composite, named) and <code class="i">CHECK</code> (ranges and lists)</li>
<li><b>Generated columns</b> — values the database computes and keeps correct</li>
<li>Traps: <code class="i">NULL</code> vs empty string, UNIQUE and many NULLs, <code class="i">= NULL</code>; where a rule should live</li>
</ul>
${box('Where we are', 'Keys (3.1) and foreign keys (3.2) cover <b>identity</b> and <b>relations</b>. Now the rest of what makes a single row <b>valid</b>.', 'lam')}` },

  { t: 'Everyday example first: the ticket gates', giua: true, body: `
${gates([{ t: 'NOT NULL', s: 'must have a value', mau: '#336791' }, { t: 'UNIQUE', s: 'no duplicates', mau: '#2f7d4f' }, { t: 'CHECK', s: 'must follow a rule', mau: '#c0392b' }, { t: 'FOREIGN KEY', s: 'must point at a parent', mau: '#e08a1e' }])}
<p style="font-size:24px;margin:0">At a metro station you cannot walk in without a ticket, with a copied ticket, or with an expired one. A table works the same way: <b>each constraint is a gate</b> on the way in. The row is stopped <b>at the door</b> — it never gets into the table. <b>DEFAULT</b> and <b>generated columns</b> are different: they are the staff who <b>fill in</b> what you left blank.</p>` },

  { t: 'NOT NULL and DEFAULT: required and pre-filled', giua: true, body: `
${two(box('NOT NULL — “required field”', 'The column must have a value on every row. Cheapest constraint, catches a whole family of bugs, and <b>hard to add later</b> once NULLs exist.', 'lam'),
box('DEFAULT — “pre-filled field”', 'If the INSERT does not mention the column, PostgreSQL writes the default (<code class="i">0</code>, <code class="i">now()</code>, <code class="i">\'pending\'</code>). It is <b>not</b> a check — you can still override it.', 'xanh'))}
${zm(two(T('INSERT … (sku, name, price) — no discount given', ['sku', 'name', 'price', 'discount_pct'], [['A2', 'Mouse', '49.99', '<b>0</b>']], { o: [[0, 3]] }),
box('Together', '“every product has a price” (<code class="i">NOT NULL</code>) and “a new product starts at 0 % off” (<code class="i">DEFAULT 0</code>) become <b>facts of the database</b>, not hopes of the app.', ''), 'r46'), 1.15)}` },

  { t: 'One table, every constraint', giua: true, body: `
${zm(sql(PRODUCT_DDL, { sm: true, hl: [3, 4, 5, 6, 7] }), 1.18)}
<ul style="font-size:22px;margin:0">
<li><code class="i">sku</code>: <b>NOT NULL + UNIQUE</b> · <code class="i">price</code>: <b>NOT NULL + CHECK</b> · <code class="i">discount_pct</code>: <b>NOT NULL + DEFAULT + CHECK</b></li>
<li><code class="i">final_price</code>: a <b>generated column</b> (computed) · <code class="i">created_at</code>: <b>DEFAULT now()</b></li>
</ul>` },

  { t: 'Insert two products — what the database fills in', giua: true, body: `
${zm(run(`INSERT INTO product (sku, name, price, discount_pct) VALUES ('A1','Keyboard',100,10);
INSERT INTO product (sku, name, price)               VALUES ('A2','Mouse',49.99);
SELECT sku, name, price, discount_pct, final_price FROM product ORDER BY id;`, ` sku |   name   | price  | discount_pct | final_price
-----+----------+--------+--------------+-------------
 A1  | Keyboard | 100.00 |           10 |       90.00
 A2  | Mouse    |  49.99 |            0 |       49.99
(2 rows)`, { hlOut: [4, 5] }), 1.18)}
${two(box('A2 never mentioned discount_pct', '<code class="i">DEFAULT 0</code> filled it in.', 'xanh'), box('final_price was never inserted', 'It is <b>generated</b>: 100 × (100 − 10) / 100 = 90.00.', 'lam'))}` },

  { t: 'UNIQUE — and the NULL surprise', body: `
${zm(run(`INSERT INTO product (sku, name, price) VALUES ('A1','Dup SKU',10);`, `ERROR:  duplicate key value violates unique constraint "product_sku_key"
DETAIL:  Key (sku)=(A1) already exists.`, { hlOut: [1, 2] }), 1.12)}
${zm(run(`CREATE TABLE usr (id int PRIMARY KEY, phone text UNIQUE);
INSERT INTO usr VALUES (1, NULL), (2, NULL), (3, '090');   -- accepted!`, `INSERT 0 3`, {}), 1.0)}
${two(box('UNIQUE ≠ “at most one NULL”', 'In PostgreSQL <b>NULL means “unknown”</b>, and two unknowns are not equal — so a UNIQUE column accepts <b>many NULLs</b> (SQL Server allows only one).', 'info'),
box('Want “one per user, or none”?', 'Use <code class="i">UNIQUE</code> on the column (many NULLs fine) — or a partial unique index when you need stricter rules (Chapter 9).', ''))}` },

  { t: 'NOT NULL — and what it does not catch', giua: true, body: `
${zm(run(`INSERT INTO product (sku, name) VALUES ('A5','No price');
INSERT INTO product (sku, name, price) VALUES ('A9', '', 10);   -- empty name
SELECT sku, name = '' AS empty_name FROM product WHERE sku = 'A9';`, `ERROR:  null value in column "price" of relation "product" violates not-null constraint
DETAIL:  Failing row contains (6, A5, No price, null, 0, null, 2026-10-25 18:42:53.997392+07).
INSERT 0 1
 sku | empty_name
-----+------------
 A9  | t
(1 row)`, { hlOut: [1, 2, 6] }), 1.0)}
<ul style="font-size:22px;margin:0">
<li><b>DETAIL: Failing row contains (…)</b> shows the whole rejected row — handy for debugging</li>
<li><code class="i">NOT NULL</code> stops <b>NULL</b>, not <b>empty text</b>: <code class="i">''</code> is a real value. Add <code class="i">CHECK (name &lt;&gt; '')</code> if blank must be forbidden</li>
</ul>` },

  { t: 'CHECK — the rule must be true', giua: true, body: `
${zm(run(`INSERT INTO product (sku, name, price) VALUES ('A3','Bad price',-5);
INSERT INTO product (sku, name, price, discount_pct) VALUES ('A4','x',10,150);`, `ERROR:  new row for relation "product" violates check constraint "product_price_check"
DETAIL:  Failing row contains (4, A3, Bad price, -5.00, 0, -5.00, 2026-10-25 18:42:53.996956+07).
ERROR:  new row for relation "product" violates check constraint "product_discount_pct_check"
DETAIL:  Failing row contains (5, A4, x, 10.00, 150, -5.00, 2026-10-25 18:42:53.997117+07).`, { hlOut: [1, 3] }), 1.0)}
${two(`<ul style="font-size:21px"><li><code class="i">CHECK (price &gt;= 0)</code> — a range</li><li><code class="i">CHECK (discount_pct BETWEEN 0 AND 100)</code></li><li><code class="i">CHECK (status IN ('pending','paid','shipped','cancelled'))</code> — a list</li></ul>`,
box('Remember', 'A CHECK passes when the rule is <b>true</b> <i>or unknown (NULL)</i>. So pair it with <code class="i">NOT NULL</code> when NULL must be forbidden too. The default name is <code class="i">table_column_check</code>.', 'info'))}` },

  { t: 'Generated columns — computed, never out of date', giua: true, body: `
${zm(run(`INSERT INTO product (sku, name, price, final_price) VALUES ('A6','x',10,5);
UPDATE product SET discount_pct = 50 WHERE sku = 'A1';
SELECT sku, price, discount_pct, final_price FROM product WHERE sku = 'A1';`, `ERROR:  cannot insert a non-DEFAULT value into column "final_price"
DETAIL:  Column "final_price" is a generated column.
UPDATE 1
 sku | price  | discount_pct | final_price
-----+--------+--------------+-------------
 A1  | 100.00 |           50 |       50.00
(1 row)`, { hlOut: [1, 2, 7] }), 1.0)}
${two(box('You cannot write to it', 'Insert a value and PostgreSQL refuses. That refusal <b>is the feature</b>.', 'info'),
box('It follows its inputs', 'Change <code class="i">discount_pct</code> to 50 ⇒ <code class="i">final_price</code> becomes 50.00 by itself. A hand-set column would drift the day someone forgets to recompute it.', 'xanh'))}` },

  { t: 'Composite UNIQUE — and name your constraint', giua: true, body: `
${zm(run(`CREATE TABLE enrollment (
  student_id  int NOT NULL,
  course_id   int NOT NULL,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_enrollment UNIQUE (student_id, course_id)
);
INSERT INTO enrollment (student_id, course_id) VALUES (1,10),(1,20),(2,10);
INSERT INTO enrollment (student_id, course_id) VALUES (1,10);`, `INSERT 0 3
ERROR:  duplicate key value violates unique constraint "uq_enrollment"
DETAIL:  Key (student_id, course_id)=(1, 10) already exists.`, { hlOut: [2, 3] }), 1.08)}
<ul style="font-size:22px;margin:0">
<li>Student 1 may join courses 10 and 20; course 10 may hold students 1 and 2; <b>the same pair only once</b></li>
<li><code class="i">CONSTRAINT uq_enrollment</code> gives the rule a <b>name</b>: a readable error, and a handle for <code class="i">ALTER TABLE … DROP CONSTRAINT</code></li>
</ul>` },

  { t: 'The named-constraint trap (a real bug on this site)', body: `
${vsd(`${zm(sql(`// Prisma schema
@@unique([subjectId, recipientId], name: "uk_note_subject_share")

// upsert — default-style key (WRONG)
where: { subjectId_recipientId: { subjectId, recipientId } }`, { sm: true, lang: 'typescript' }), 0.88)}<p style="font-size:19px;margin:6px 0 0">The default compound key <code class="i">a_b</code> <b>no longer exists</b> once you give the constraint a name.</p>`,
`${zm(sql(`// Prisma schema
@@unique([subjectId, recipientId], name: "uk_note_subject_share")

// upsert — use the constraint's name (RIGHT)
where: { uk_note_subject_share: { subjectId, recipientId } }`, { sm: true, lang: 'typescript' }), 0.88)}<p style="font-size:19px;margin:6px 0 0">This exact line lives in <b>notesShare.service.ts</b>. Named constraints are good — just use the same name everywhere.</p>`, '✗ Default key name', '✓ The name you gave')}
<p style="font-size:22px;margin:0">In SQL the name matters too: it appears in every error and in <code class="i">ON CONFLICT ON CONSTRAINT uk_note_subject_share</code> (Chapter 4).</p>` },

  { t: 'Where should a rule live?', giua: true, body: `
${cards([
  ['In the database', 'Applies to <span class="lam">every</span> writer: your API, a migration, a colleague in psql, a job written next year. The <span class="lam">only</span> layer with that guarantee.'],
  ['In the application', 'Friendly messages and rules that need context the database lacks. Needed — but it only guards the paths that go <span class="lam">through your code</span>.'],
  ['Both — on purpose', 'Check in the app <span class="lam">for the user</span>, constrain in the database <span class="lam">for the data</span>. The duplication is deliberate, not sloppy.'],
], 3)}
${box('Cheapest first', '<code class="i">NOT NULL</code> costs nothing, catches a whole class of bugs, and is much <b>harder to add later</b> once the table has NULLs (you must clean the data first).', 'xanh')}` },

  { t: 'The trap: “nullable for flexibility”', body: `
${zm(run(`SELECT count(*) AS eq_null FROM usr WHERE phone = NULL;
SELECT count(*) AS is_null FROM usr WHERE phone IS NULL;`, ` eq_null
---------
       0
(1 row)

 is_null
---------
       2
(1 row)`, { hlOut: [3, 9] }), 1.1)}
<ul style="font-size:22px;margin:0">
<li><code class="i">phone = NULL</code> is <b>never true</b> (NULL = “unknown” ≠ anything, even NULL). Use <code class="i">IS NULL</code></li>
<li>Every nullable column <b>doubles</b> the states your code handles — display, comparison, concatenation, forever</li>
<li>The “flexibility” is an illusion: a column that should never be empty ends up with NULLs from half-finished imports, and you cannot add NOT NULL until you clean them</li>
<li><b>Default to NOT NULL; justify every exception.</b></li>
</ul>` },

  { t: 'What the table looks like: \\d product', giua: true, body: `
${zm(psql(`    Column    |       Type       | Nullable |      Default
--------------+------------------+----------+---------------------------------
 sku          | text             | not null |
 price        | numeric(12,2)    | not null |
 discount_pct | integer          | not null | 0
 final_price  | numeric(12,2)    |          | generated always as (round(…)) stored
 created_at   | timestamptz      | not null | now()
Indexes:
    "product_pkey" PRIMARY KEY, btree (id)
    "product_sku_key" UNIQUE CONSTRAINT, btree (sku)
Check constraints:
    "product_discount_pct_check" CHECK (discount_pct >= 0 AND discount_pct <= 100)
    "product_price_check" CHECK (price >= 0::numeric)`, { sm: true, title: '\\d product (excerpt) — real, PostgreSQL 17' }), 1.12)}
<p style="font-size:21px;margin:0">Everything you declared is visible: <b>not null</b>, <b>defaults</b>, the generated expression, the <b>UNIQUE</b> (its own index, <code class="i">product_sku_key</code>) and the <b>CHECK</b>s with their auto-names. Read the <b>constraint name</b> in an error — it points straight here.</p>` },

  { t: 'Coming from SQL Server? What changes', body: `
${zm(`<table class="t">
<tr><th style="width:300px">SQL Server</th><th>PostgreSQL</th></tr>
<tr><td>UNIQUE allows <b>one</b> NULL</td><td>UNIQUE allows <b>many</b> NULLs</td></tr>
<tr><td><code class="i">DEFAULT</code> is a named constraint object (<code class="i">DF__t__c__…</code>)</td><td><code class="i">DEFAULT</code> is just a column property (<code class="i">\\d</code> → Default)</td></tr>
<tr><td>Computed column <code class="i">AS (…) PERSISTED</code></td><td><code class="i">GENERATED ALWAYS AS (…) STORED</code> (PostgreSQL 17: stored only)</td></tr>
<tr><td><code class="i">CHECK</code> — same; <code class="i">bit</code> for booleans</td><td><code class="i">CHECK</code> — same; real <code class="i">boolean</code> type</td></tr>
<tr><td>Auto names <code class="i">UQ__t__3213E83F…</code>, <code class="i">CK__t__c__…</code></td><td><code class="i">t_c_key</code>, <code class="i">t_c_check</code> — readable</td></tr>
<tr><td>Empty string and NULL are different (same in PG); Oracle treats them alike</td><td><code class="i">''</code> ≠ NULL</td></tr>
</table>`, 1.1)}` },

  { t: 'A real schema: constraints in CT Shop', giua: true, body: `
${zm(psql(`customer:  "customer_email_key" UNIQUE CONSTRAINT, btree (email)
           "customer_email_check" CHECK (email = lower(email) AND email ~~ '%_@_%.__%')
product:   "product_price_check" CHECK (price > 0::numeric)
           "product_stock_check" CHECK (stock >= 0)
orders:    "orders_status_check" CHECK (status = ANY (ARRAY['pending','paid','shipped','cancelled']))
review:    "review_rating_check" CHECK (rating >= 1 AND rating <= 5)
           UNIQUE (product_id, customer_id)       -- one review per customer per product`, { sm: true, title: '\\d shop.* (excerpts) — real, PostgreSQL 17' }), 1.12)}
${cards([['customer.email', 'lower-case, looks like an e-mail, <span class="lam">unique</span>'], ['product', 'price &gt; 0, stock &gt;= 0, sku unique'], ['review', 'rating 1–5, <span class="lam">one review</span> per (product, customer)']], 3)}
<p class="nho">Lab 1 asks you to recreate all of this from the ERD.</p>` },

  { t: 'In production: a CHECK on cuongthai.com', body: `
${zm(sql(`CREATE TABLE video_yeu_thich (
  …
  lesson_id        int REFERENCES lessons(id)         ON DELETE CASCADE,
  video_tu_them_id int REFERENCES video_nguoi_dung(id) ON DELETE CASCADE,

  -- must point at EXACTLY ONE source
  CONSTRAINT video_yeu_thich_mot_nguon CHECK (
      (lesson_id IS NOT NULL AND video_tu_them_id IS NULL)
   OR (lesson_id IS NULL     AND video_tu_them_id IS NOT NULL)
  )
);`, { sm: true }), 1.12)}
${two(box('A rule across two columns', 'A favourite is either a lesson <b>or</b> a user-added video — never both, never neither. No single-column constraint can say that; a table-level <code class="i">CHECK</code> can.', 'info'),
box('Without it', 'The migration comment (Vietnamese in the repo) says it plainly: an empty row would be accepted and sit in the list as a <b>“ghost row”</b>.', 'do2'))}` },

  { t: 'Exercise: the review table', giua: true, body: `
<p style="font-size:23px;margin:0">Create <b>review</b> for CT Shop: generated id; <b>product_id</b>, <b>customer_id</b> (required); <b>rating</b> required and only 1–5; optional <b>body</b>; <b>created_at</b> filled automatically; and <b>one review per customer per product</b>. Then try to break every rule.</p>
${zm(sql(`CREATE TABLE review (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id  int NOT NULL,
  customer_id int NOT NULL,
  rating      smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, customer_id)
);`, { sm: true }), 1.2)}
<p class="nho">Pause and write it first. Hint: which rule needs UNIQUE on <i>two</i> columns?</p>` },

  { t: 'Exercise: breaking it', giua: true, body: `
${zm(run(`INSERT INTO review (product_id, customer_id, rating) VALUES (1, 1, 5), (1, 2, 4);   -- ok
INSERT INTO review (product_id, customer_id, rating) VALUES (1, 1, 3);   -- same pair
INSERT INTO review (product_id, customer_id, rating) VALUES (2, 1, 6);   -- rating 6
INSERT INTO review (product_id, customer_id) VALUES (2, 1);              -- no rating`, `INSERT 0 2
ERROR:  duplicate key value violates unique constraint "review_product_id_customer_id_key"
DETAIL:  Key (product_id, customer_id)=(1, 1) already exists.
ERROR:  new row for relation "review" violates check constraint "review_rating_check"
DETAIL:  Failing row contains (4, 2, 1, 6, null, 2026-10-25 18:42:54.016832+07).
ERROR:  null value in column "rating" of relation "review" violates not-null constraint
DETAIL:  Failing row contains (5, 2, 1, null, null, 2026-10-25 18:42:54.017031+07).`, { hlOut: [2, 4, 6] }), 0.98)}
<p style="font-size:21px;margin:0">Three bad rows, three different gates: <b>UNIQUE</b> (pair), <b>CHECK</b> (rating), <b>NOT NULL</b> (rating). Note the ids 4 and 5 in the rejected rows — failed inserts <b>burn identity numbers</b> (lesson 3.1).</p>` },

  { t: 'Self-check', giua: true, body: `
<ol style="font-size:26px">
<li>Which constraint stops <b>NULL</b>, which stops a <b>duplicate</b>, which stops a <b>bad range</b>? What does <b>DEFAULT</b> do instead of stopping?</li>
<li>A <code class="i">UNIQUE</code> column contains two rows with <code class="i">NULL</code>. Is that allowed? How do you find those rows?</li>
<li>Why can you not <code class="i">INSERT</code> a value into a <b>generated</b> column — and why is that good?</li>
</ol>
${box('Answers', '<b>1.</b> NOT NULL · UNIQUE · CHECK; DEFAULT <i>fills</i> a missing value. <b>2.</b> Yes (NULLs are not equal); find them with <code class="i">IS NULL</code>, not <code class="i">= NULL</code>. <b>3.</b> The database owns the formula; it can never drift from its inputs.', 'xanh')}` },

  { t: 'Summary & what is next', to: true, body: `
<ul>
<li><b>NOT NULL</b> (required) · <b>DEFAULT</b> (pre-filled) · <b>UNIQUE</b> (no duplicates) · <b>CHECK</b> (a rule) — each a gate with a real error</li>
<li><b>Generated columns</b> are computed by the database and cannot be written</li>
<li>Traps: <code class="i">''</code> is not NULL; UNIQUE allows many NULLs; use <code class="i">IS NULL</code></li>
<li><b>Name</b> important constraints and use the same name in your ORM</li>
<li>Put rules in the database <b>and</b> the app — default to NOT NULL</li>
</ul>
${box('Next: 3.4 — Evolving a schema', 'Real schemas change. <code class="i">ALTER TABLE</code> on a table that already has rows, and <b>normalization</b>: why each fact should live in exactly one place.', 'lam')}` },
]);
