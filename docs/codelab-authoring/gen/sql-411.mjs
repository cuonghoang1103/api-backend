// Generator for SQL module 411 (data-modification-and-transactions).
// Module already has 8 exercises (2 EASY + 6 MEDIUM); this adds the 2 HARD slots
// so the ramp is complete (2E / 6M / 2H = 10). The seeder appends + dedups by title.
//
// Each exercise carries an extra `_setup` (schema + seed, NOT shipped) so the
// companion verify emitter can run the EXACT solution string against real Postgres.
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'sql';
const moduleSlug = 'data-modification-and-transactions';

const exercises = [
  {
    title: 'Post a Balanced Double-Entry Journal Transaction',
    difficulty: 'HARD',
    estimatedMinutes: 45,
    points: 25,
    concepts: ['multi-statement transactions', 'data-modifying CTE', 'RETURNING', 'CHECK constraints', 'atomicity'],
    prerequisites: ['INSERT', 'UPDATE', 'BEGIN and COMMIT', 'subqueries'],
    tags: ['transactions', 'cte', 'accounting', 'integrity', 'postgres'],
    problemHtml: `<p>A double-entry accounting ledger records every business event as at least two lines: one or more <em>debits</em> and one or more <em>credits</em> whose amounts sum to the same total. If any part of that write fails, none of it may remain — a half-posted entry corrupts the books. That "all or nothing" guarantee is exactly what a database transaction gives you.</p>
<p>Your finance service must post a single event — <strong>paying 500.00 of office rent from Cash</strong> — as one atomic unit. Write a transaction that satisfies every requirement below:</p>
<ul>
<li>Insert one row into <code>journal_entries</code> with memo <code>'Pay July office rent'</code> and <code>entry_date</code> of <code>2026-07-01</code>.</li>
<li>Insert exactly two rows into <code>journal_lines</code> for that new entry: a <strong>debit</strong> of 500.00 to <code>Rent Expense</code> (account 2) and a <strong>credit</strong> of 500.00 to <code>Cash</code> (account 1). You must reuse the generated <code>entry_id</code> — do not hard-code it.</li>
<li>Decrease <code>Cash</code>'s balance by 500.00 and increase <code>Rent Expense</code>'s balance by 500.00 in <code>accounts</code>.</li>
<li>Wrap all of it in a single transaction so that if any statement fails, the whole posting is discarded.</li>
</ul>
<p>The <code>accounts.balance</code> column has a <code>CHECK (balance &gt;= 0)</code> constraint. The scaffold in <code>solution.sql</code> gives you the transaction skeleton and a comment marking where each statement goes.</p>`,
    inputSpec: 'Three tables already exist and are seeded: accounts(account_id, name, balance) with Cash=800.00, Rent Expense=0.00, Office Supplies=0.00; and the empty journal_entries and journal_lines tables. The query operates on this existing data.',
    outputSpec: 'After COMMIT: journal_entries holds 1 row; journal_lines holds 2 rows (debit 500 to account 2, credit 500 to account 1) referencing that entry; accounts.balance is Cash=300.00 and Rent Expense=500.00.',
    constraints: 'Use a single transaction (BEGIN ... COMMIT). Do not hard-code the entry_id — obtain it from the INSERT via RETURNING or a data-modifying CTE. Do not disable or drop the CHECK constraint.',
    examplesJson: [
      {
        input: 'accounts before:\n| account_id | name         | balance |\n| 1          | Cash         | 800.00  |\n| 2          | Rent Expense | 0.00    |',
        output: 'accounts after COMMIT:\n| account_id | name         | balance |\n| 1          | Cash         | 300.00  |\n| 2          | Rent Expense | 500.00  |\njournal_lines: (entry 1, acct 2, debit 500.00, credit 0.00) and (entry 1, acct 1, debit 0.00, credit 500.00)',
        explanation: 'Cash is credited (money leaves it) so its balance drops by 500; Rent Expense is debited so its balance rises by 500. Total debits (500) equal total credits (500), so the entry is balanced.',
      },
      {
        input: 'Same schema but Cash starts at 300.00 and the entry tries to pay 500.00',
        output: 'ERROR: new row for relation "accounts" violates check constraint. The whole transaction rolls back: no entry, no lines, balances unchanged.',
        explanation: 'The UPDATE would drive Cash to -200.00, violating CHECK (balance >= 0). Because every write is in one transaction, the failure discards the journal_entries and journal_lines inserts too — you never get a half-posted entry.',
      },
    ],
    hintsJson: [
      'Everything must succeed or fail together. What single construct groups several statements into one atomic unit?',
      'You need the entry_id that the first INSERT generated, before you can insert the lines. INSERT ... RETURNING hands it back.',
      'A data-modifying CTE lets you INSERT into journal_entries and immediately SELECT its RETURNING value to feed the INSERT into journal_lines, all in one statement.',
      'Structure: BEGIN; then WITH new_entry AS (INSERT ... RETURNING entry_id) INSERT INTO journal_lines SELECT ne.entry_id, ... FROM new_entry ne CROSS JOIN (VALUES ...); then two UPDATE statements; then COMMIT.',
    ],
    starterCodeJson: [
      {
        name: 'solution.sql',
        language: 'sql',
        code: `-- Post the rent payment as ONE atomic transaction.
-- Tables: accounts(account_id, name, balance CHECK >= 0),
--         journal_entries(entry_id SERIAL, memo, entry_date),
--         journal_lines(line_id SERIAL, entry_id, account_id, debit, credit)

BEGIN;

-- 1) Insert the journal entry and capture its generated entry_id,
--    then insert the two balanced lines for it.
-- WITH new_entry AS (
--     INSERT INTO journal_entries (memo, entry_date) VALUES (..., ...) RETURNING entry_id
-- )
-- INSERT INTO journal_lines (entry_id, account_id, debit, credit)
-- SELECT ...

-- 2) Move the money: Cash down 500, Rent Expense up 500.
-- UPDATE accounts SET ... WHERE account_id = 1;
-- UPDATE accounts SET ... WHERE account_id = 2;

COMMIT;`,
      },
    ],
    solutionCodeJson: [
      {
        name: 'solution.sql',
        language: 'sql',
        code: `BEGIN;

-- Insert the entry, then use its RETURNING id to post both lines in one statement.
WITH new_entry AS (
    INSERT INTO journal_entries (memo, entry_date)
    VALUES ('Pay July office rent', DATE '2026-07-01')
    RETURNING entry_id
)
INSERT INTO journal_lines (entry_id, account_id, debit, credit)
SELECT ne.entry_id, v.account_id, v.debit, v.credit
FROM   new_entry ne
CROSS JOIN (VALUES
    (2, 500.00, 0.00),   -- debit Rent Expense
    (1, 0.00, 500.00)    -- credit Cash
) AS v(account_id, debit, credit);

-- Move the money to match the lines.
UPDATE accounts SET balance = balance - 500.00 WHERE account_id = 1;  -- Cash
UPDATE accounts SET balance = balance + 500.00 WHERE account_id = 2;  -- Rent Expense

COMMIT;`,
      },
    ],
    solutionExplanationHtml: `<p>The key decision is treating the four writes — one entry, two lines, two balance changes — as a single unit with <code>BEGIN ... COMMIT</code>. If any statement raises an error, the whole transaction rolls back and the ledger never sees a partial posting.</p>
<p>The trap most learners hit is the <strong>entry_id</strong>. The lines reference the entry that was just created, but its id is generated by the <code>SERIAL</code> sequence during the INSERT, so you cannot know it in advance and must not hard-code <code>1</code>. A <strong>data-modifying CTE</strong> solves this cleanly: <code>WITH new_entry AS (INSERT ... RETURNING entry_id)</code> captures the generated id, and the following <code>INSERT ... SELECT</code> reads it back from the CTE. The <code>CROSS JOIN (VALUES ...)</code> pairs that one id with both line rows in a single statement.</p>
<p>Why this is safe under the CHECK constraint: if Cash had less than 500, the first <code>UPDATE</code> would push its balance below zero, <code>CHECK (balance &gt;= 0)</code> would raise an error, and because we are inside a transaction the already-executed entry and line inserts are discarded along with it. Without the transaction you would be left with a dangling entry and unbalanced books — the classic corruption this pattern prevents.</p>`,
    diagramMermaid: `flowchart TD
  A[BEGIN] --> B[INSERT journal_entries RETURNING entry_id]
  B --> C[INSERT two journal_lines using that id]
  C --> D[UPDATE Cash minus 500]
  D --> E[UPDATE Rent Expense plus 500]
  E --> F{Any statement failed}
  F -- no --> G[COMMIT keeps all writes]
  F -- yes --> H[ROLLBACK discards everything]`,
    _setup: `DROP TABLE IF EXISTS journal_lines, journal_entries, accounts CASCADE;
CREATE TABLE accounts (
  account_id INT PRIMARY KEY,
  name       TEXT NOT NULL,
  balance    NUMERIC(12,2) NOT NULL CHECK (balance >= 0)
);
CREATE TABLE journal_entries (
  entry_id   SERIAL PRIMARY KEY,
  memo       TEXT NOT NULL,
  entry_date DATE NOT NULL
);
CREATE TABLE journal_lines (
  line_id    SERIAL PRIMARY KEY,
  entry_id   INT NOT NULL REFERENCES journal_entries(entry_id),
  account_id INT NOT NULL REFERENCES accounts(account_id),
  debit      NUMERIC(12,2) NOT NULL DEFAULT 0,
  credit     NUMERIC(12,2) NOT NULL DEFAULT 0
);
INSERT INTO accounts VALUES (1,'Cash',800.00),(2,'Rent Expense',0.00),(3,'Office Supplies',0.00);`,
    _check: `SELECT account_id, name, balance FROM accounts WHERE account_id IN (1,2) ORDER BY account_id;
SELECT entry_id, account_id, debit, credit FROM journal_lines ORDER BY line_id;
SELECT count(*) AS entry_count FROM journal_entries;`,
  },

  {
    title: 'Guarantee No Overselling with a Data-Modifying CTE',
    difficulty: 'HARD',
    estimatedMinutes: 50,
    points: 30,
    concepts: ['data-modifying CTE', 'conditional UPDATE guard', 'transactions', 'RETURNING', 'race-safe writes'],
    prerequisites: ['UPDATE with WHERE', 'INSERT ... SELECT', 'CHECK constraints', 'transactions'],
    tags: ['transactions', 'cte', 'inventory', 'concurrency', 'postgres'],
    problemHtml: `<p>The single most common bug in inventory and ticketing systems is <strong>overselling</strong>: two requests read "8 in stock", both subtract, and the counter goes negative. The fix is to make the check and the decrement one indivisible operation — decrement stock <em>only if</em> enough is available, in the same statement that reads it — and then only record the reservation when that decrement actually happened.</p>
<p>Write a transaction that reserves <strong>5 units of product 100 for order 900</strong> and satisfies every requirement:</p>
<ul>
<li>Decrease <code>products.available</code> for product 100 by 5, but only if <code>available</code> is at least 5.</li>
<li>Insert a row into <code>reservations</code> (product_id, order_id, qty) <strong>only if</strong> the stock was actually decremented. If there was not enough stock, no reservation row may be created.</li>
<li>Do the whole thing in one transaction, using a single data-modifying statement so the guard and the reservation cannot drift apart.</li>
</ul>
<p>The scaffold shows the <code>WITH ... AS (UPDATE ...)</code> shape. <code>products.available</code> has a <code>CHECK (available &gt;= 0)</code> as a second line of defense, but your <code>WHERE</code> guard is what makes the operation correct without ever raising an error on the normal path.</p>`,
    inputSpec: 'Two tables exist: products(product_id, name, available CHECK >= 0) seeded with product 100 "Mechanical Keyboard" available=8 and product 200 "USB-C Cable" available=2; and an empty reservations(reservation_id SERIAL, product_id, order_id, qty, created_at) table.',
    outputSpec: 'After COMMIT: product 100 available=3; reservations has exactly one row (product_id=100, order_id=900, qty=5). For an insufficient-stock request the counter is unchanged and no reservation row is inserted.',
    constraints: 'Use ONE data-modifying CTE (the UPDATE in a WITH clause feeding an INSERT ... SELECT). The INSERT must be driven by the UPDATE\'s RETURNING output, not by a separate re-read of the table. Do not use a stored procedure or trigger.',
    examplesJson: [
      {
        input: 'Reserve 5 of product 100 (available = 8)',
        output: 'products: product 100 available = 3\nreservations: one row (product_id=100, order_id=900, qty=5)',
        explanation: 'available (8) >= 5, so the UPDATE matches, decrements to 3, and RETURNING emits the product_id. The INSERT ... SELECT then reads that row and creates exactly one reservation.',
      },
      {
        input: 'Reserve 5 of product 200 (available = 2)',
        output: 'products: product 200 available = 2 (unchanged)\nreservations: no new row',
        explanation: 'available (2) >= 5 is false, so the UPDATE matches zero rows and RETURNING emits nothing. The INSERT ... SELECT FROM the CTE therefore inserts zero rows — the guard and the reservation stay perfectly consistent.',
      },
    ],
    hintsJson: [
      'The mistake is reading availability in one statement and subtracting in another. Make the read and the write the same statement.',
      'An UPDATE ... WHERE available >= 5 decrements only when the guard passes. Add RETURNING so it reports what it changed.',
      'Put that UPDATE inside a WITH clause: WITH reserved AS (UPDATE products SET available = available - 5 WHERE product_id = 100 AND available >= 5 RETURNING product_id).',
      'Then INSERT INTO reservations (product_id, order_id, qty) SELECT product_id, 900, 5 FROM reserved; — when the guard fails, reserved is empty and zero rows are inserted.',
    ],
    starterCodeJson: [
      {
        name: 'solution.sql',
        language: 'sql',
        code: `-- Reserve 5 units of product 100 for order 900 without overselling.
-- Tables: products(product_id, name, available CHECK >= 0),
--         reservations(reservation_id SERIAL, product_id, order_id, qty, created_at)

BEGIN;

-- Decrement stock ONLY if enough is available, and let that same statement
-- drive the reservation insert via RETURNING.
-- WITH reserved AS (
--     UPDATE products SET available = ... WHERE ... AND available >= ... RETURNING product_id
-- )
-- INSERT INTO reservations (product_id, order_id, qty)
-- SELECT ...

COMMIT;`,
      },
    ],
    solutionCodeJson: [
      {
        name: 'solution.sql',
        language: 'sql',
        code: `BEGIN;

WITH reserved AS (
    UPDATE products
    SET    available = available - 5
    WHERE  product_id = 100
      AND  available >= 5          -- the guard: no decrement unless stock is sufficient
    RETURNING product_id
)
INSERT INTO reservations (product_id, order_id, qty)
SELECT product_id, 900, 5
FROM   reserved;                   -- zero rows here if the guard failed

COMMIT;`,
      },
    ],
    solutionExplanationHtml: `<p>The whole correctness of this pattern rests on one idea: the availability <em>check</em> and the <em>decrement</em> are the same <code>UPDATE</code>. Because <code>WHERE product_id = 100 AND available &gt;= 5</code> is evaluated atomically against the row, there is no window in which another transaction can slip in between "read 8" and "write 3" — the row is locked for the duration of the update. This is what prevents overselling.</p>
<p>The second idea ties the reservation to the decrement. <code>RETURNING product_id</code> emits a row <strong>only if</strong> the UPDATE matched, and the <code>INSERT ... SELECT ... FROM reserved</code> reads from that result. So the reservation row exists if and only if stock was actually taken. Contrast the naive version — an <code>UPDATE</code> then a separate <code>INSERT</code> — where a failed or zero-row update still lets the unconditional insert run, producing a reservation for stock you never secured.</p>
<p>The trap to avoid is re-reading the table for the INSERT (<code>SELECT ... FROM products WHERE ...</code>). That reintroduces the gap between check and act. Always feed the INSERT from the UPDATE's own <code>RETURNING</code>. The <code>CHECK (available &gt;= 0)</code> is a backstop that would abort the transaction if a bug ever bypassed the guard, but on the correct path it never fires. Complexity is a single indexed row update plus one insert — O(1) work per reservation.</p>`,
    _setup: `DROP TABLE IF EXISTS reservations, products CASCADE;
CREATE TABLE products (
  product_id INT PRIMARY KEY,
  name       TEXT NOT NULL,
  available  INT NOT NULL CHECK (available >= 0)
);
CREATE TABLE reservations (
  reservation_id SERIAL PRIMARY KEY,
  product_id     INT NOT NULL REFERENCES products(product_id),
  order_id       INT NOT NULL,
  qty            INT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO products VALUES (100,'Mechanical Keyboard',8),(200,'USB-C Cable',2);`,
    _check: `SELECT product_id, available FROM products ORDER BY product_id;
SELECT product_id, order_id, qty FROM reservations ORDER BY reservation_id;`,
    _extra: `-- insufficient-stock path: must change nothing
WITH reserved AS (
    UPDATE products SET available = available - 5
    WHERE product_id = 200 AND available >= 5
    RETURNING product_id
)
INSERT INTO reservations (product_id, order_id, qty)
SELECT product_id, 901, 5 FROM reserved;
SELECT product_id, available FROM products WHERE product_id = 200;
SELECT count(*) AS reservation_rows FROM reservations;`,
  },
];

// ---- emit deliverable payload (strip _setup/_check/_extra) + verify.sql ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VERIFY = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VERIFY, { recursive: true });

const clean = exercises.map(({ _setup, _check, _extra, ...ex }) => ex);
const payload = { trackSlug, moduleSlug, exercises: clean };
const outFile = path.join(OUT, `${trackSlug}__${moduleSlug}.json`);
fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));

// verify.sql: for each exercise, reset schema, run the EXACT shipped solution, print checks.
let sql = `\\set ON_ERROR_STOP off\n\\pset pager off\n`;
exercises.forEach((ex, i) => {
  const sol = ex.solutionCodeJson.map((f) => f.code).join('\n');
  sql += `\n\\echo '==================== EX ${i + 1}: ${ex.title} ===================='\n`;
  sql += ex._setup + '\n';
  sql += `\\echo '--- run solution ---'\n` + sol + '\n';
  sql += `\\echo '--- checks ---'\n` + (ex._check || '') + '\n';
  if (ex._extra) sql += `\\echo '--- extra scenario ---'\n` + ex._extra + '\n';
});
const verifyFile = path.join(VERIFY, `sql-411.sql`);
fs.writeFileSync(verifyFile, sql);

// sanity: the payload must parse and meet the spec thresholds
const parsed = JSON.parse(fs.readFileSync(outFile, 'utf8'));
for (const ex of parsed.exercises) {
  if (ex.problemHtml.length < 900) throw new Error(`problemHtml < 900 for ${ex.title} (${ex.problemHtml.length})`);
  if (ex.solutionExplanationHtml.length < 500) throw new Error(`solutionExplanationHtml < 500 for ${ex.title}`);
}
console.log(`OK ${outFile} ${parsed.exercises.length} exercises`);
console.log(`verify -> ${verifyFile}`);
