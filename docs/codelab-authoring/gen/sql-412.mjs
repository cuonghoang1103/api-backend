// Generator for SQL module 412 (schema-design-and-data-definition) — 10 fresh exercises.
// Ramp: 1-2 EASY, 3-8 MEDIUM, 9-10 HARD. Postgres dialect (prod runs Postgres).
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'sql';
const moduleSlug = 'schema-design-and-data-definition';

const exercises = [
  {
    title: 'Create a Products Catalog Table with the Right Types',
    difficulty: 'EASY',
    estimatedMinutes: 15,
    points: 10,
    concepts: ['CREATE TABLE', 'column data types', 'PRIMARY KEY', 'NOT NULL', 'DEFAULT'],
    prerequisites: ['basic SQL syntax', 'relational tables'],
    tags: ['ddl', 'create-table', 'data-types', 'schema', 'postgres'],
    problemHtml: `<p>Every schema starts with choosing the right storage for each fact. Text in a numeric column, money in a floating-point column, or a missing primary key are mistakes that are painful to undo once real data has arrived, so the shape of the table matters from day one.</p>
<p>Create a single table named <code>products</code> that a small store will use for its catalog. It must satisfy every requirement:</p>
<ul>
<li>A <code>product_id</code> integer that is the <strong>primary key</strong>.</li>
<li>A <code>sku</code> text column that is <strong>required</strong> (never null).</li>
<li>A <code>name</code> text column that is required.</li>
<li>A <code>price</code> column able to store exact currency amounts with two decimal places — use <code>NUMERIC(10,2)</code>, never a floating type, and make it required.</li>
<li>An <code>in_stock</code> boolean that <strong>defaults to true</strong>.</li>
<li>A <code>created_at</code> timestamp with time zone that <strong>defaults to the current time</strong>.</li>
</ul>
<p>The scaffold in <code>solution.sql</code> gives you the <code>CREATE TABLE</code> skeleton. Choose types deliberately: <code>NUMERIC</code> for money, <code>TIMESTAMPTZ</code> for the timestamp, <code>BOOLEAN</code> for the flag.</p>`,
    inputSpec: 'No existing tables. You are writing the DDL that creates the table from scratch.',
    outputSpec: 'A products table exists with columns product_id (PK), sku NOT NULL, name NOT NULL, price NUMERIC(10,2) NOT NULL, in_stock BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT now().',
    constraints: 'Use NUMERIC for price (not FLOAT/REAL). Use TIMESTAMPTZ for created_at. Do not add columns beyond those listed.',
    examplesJson: [
      {
        input: "INSERT INTO products (product_id, sku, name, price) VALUES (1, 'KB-01', 'Keyboard', 49.90);",
        output: 'Row stored with in_stock = true and created_at set to the insert time automatically.',
        explanation: 'in_stock and created_at were omitted, so their DEFAULT values fill in. price keeps exactly 49.90 because NUMERIC(10,2) is exact.',
      },
      {
        input: 'INSERT INTO products (product_id, sku, price) VALUES (2, \'MS-02\', 19.00);',
        output: 'ERROR: null value in column "name" violates not-null constraint',
        explanation: 'name is NOT NULL and was not supplied, so the row is rejected — exactly the protection you want against incomplete catalog entries.',
      },
    ],
    hintsJson: [
      'Money needs exact arithmetic. Which numeric type stores 49.90 without binary rounding error?',
      'A column that must always have a value uses NOT NULL; a column that fills itself in when omitted uses DEFAULT.',
      'now() returns the current timestamp; TRUE is the boolean literal for the default flag.',
      'CREATE TABLE products (product_id INT PRIMARY KEY, sku TEXT NOT NULL, name TEXT NOT NULL, price NUMERIC(10,2) NOT NULL, in_stock BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());',
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Create the products catalog table.
-- product_id  primary key
-- sku, name   required text
-- price       exact currency, required
-- in_stock    boolean, defaults to true
-- created_at  timestamptz, defaults to now()

CREATE TABLE products (
    -- fill in the columns
);` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `CREATE TABLE products (
    product_id INT PRIMARY KEY,
    sku        TEXT NOT NULL,
    name       TEXT NOT NULL,
    price      NUMERIC(10,2) NOT NULL,
    in_stock   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);` }],
    solutionExplanationHtml: `<p>Each type is chosen for the fact it stores. <code>NUMERIC(10,2)</code> holds money as an exact decimal — up to 10 total digits, 2 after the point — so 49.90 stays 49.90. A <code>FLOAT</code> or <code>REAL</code> would store it in binary and reintroduce rounding drift the moment you sum a column of prices, which is why currency never goes in a floating type.</p>
<p><code>TIMESTAMPTZ</code> stores the instant in UTC and converts on display, unlike a naive <code>TIMESTAMP</code> that silently loses the offset. The two <code>DEFAULT</code> clauses mean a normal insert only needs the business fields; <code>in_stock</code> and <code>created_at</code> populate themselves. The trap most learners hit is dropping <code>NOT NULL</code> on the defaulted columns — a <code>DEFAULT</code> only applies when the column is omitted, so without <code>NOT NULL</code> a caller can still insert an explicit <code>NULL</code> and defeat it. Pairing <code>NOT NULL DEFAULT</code> guarantees the column is always populated.</p>`,
    _setup: `DROP TABLE IF EXISTS products CASCADE;`,
    _check: `\\d products
INSERT INTO products (product_id, sku, name, price) VALUES (1,'KB-01','Keyboard',49.90);
SELECT product_id, price, in_stock, (created_at IS NOT NULL) AS ts_set FROM products;`,
    _extra: `INSERT INTO products (product_id, sku, price) VALUES (2,'MS-02',19.00);  -- expect NOT NULL error on name`,
  },

  {
    title: 'Enforce Unique Emails and Sensible Defaults on a Users Table',
    difficulty: 'EASY',
    estimatedMinutes: 20,
    points: 10,
    concepts: ['UNIQUE constraint', 'NOT NULL', 'DEFAULT', 'named constraints', 'domain integrity'],
    prerequisites: ['CREATE TABLE', 'primary keys'],
    tags: ['ddl', 'unique', 'constraints', 'schema', 'postgres'],
    problemHtml: `<p>A users table is where integrity rules earn their keep. Two accounts must never share an email, a role should have a safe default, and required fields must never be blank — enforcing these in the schema means the database rejects bad data no matter which service inserts it, instead of trusting every caller to remember the rules.</p>
<p>Create a <code>users</code> table meeting every requirement:</p>
<ul>
<li><code>user_id</code> integer primary key.</li>
<li><code>email</code> text that is required and <strong>unique</strong> across all rows.</li>
<li><code>full_name</code> text that is required.</li>
<li><code>role</code> text that is required and <strong>defaults to</strong> <code>'member'</code>.</li>
<li><code>is_active</code> boolean that is required and defaults to <code>true</code>.</li>
</ul>
<p>Name the unique constraint <code>uq_users_email</code> so error messages and future migrations can reference it by a stable name rather than an auto-generated one. The scaffold shows where the constraint clause goes.</p>`,
    inputSpec: 'No existing tables. Write DDL to create the users table with the listed constraints.',
    outputSpec: 'A users table where inserting a duplicate email is rejected by constraint uq_users_email, a null full_name is rejected, and omitting role/is_active fills in \'member\' and true.',
    constraints: 'The unique constraint must be explicitly named uq_users_email. Do not use a trigger to enforce uniqueness.',
    examplesJson: [
      {
        input: "INSERT INTO users (user_id, email, full_name) VALUES (1, 'a@x.io', 'Ann');",
        output: "Row stored with role = 'member' and is_active = true.",
        explanation: 'The omitted role and is_active columns take their DEFAULT values.',
      },
      {
        input: "Insert (2, 'a@x.io', 'Al') after the row above",
        output: 'ERROR: duplicate key value violates unique constraint "uq_users_email"',
        explanation: "The second row reuses email 'a@x.io', which uq_users_email forbids — the named constraint appears in the error, making the failure self-explaining.",
      },
    ],
    hintsJson: [
      'Uniqueness across rows is a constraint, not a column type. Which keyword enforces "no two rows share this value"?',
      'You can attach UNIQUE inline on the column, but to name it you declare a table-level CONSTRAINT clause.',
      'CONSTRAINT uq_users_email UNIQUE (email) placed after the column list gives the constraint a stable name.',
      "Combine NOT NULL DEFAULT 'member' on role and NOT NULL DEFAULT TRUE on is_active so omitted values are filled and never null.",
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Create the users table.
-- email must be required AND unique (name the constraint uq_users_email)
-- role defaults to 'member', is_active defaults to true

CREATE TABLE users (
    user_id   INT PRIMARY KEY,
    email     TEXT NOT NULL,
    full_name TEXT NOT NULL,
    -- role, is_active with defaults
    -- , CONSTRAINT uq_users_email UNIQUE (...)
);` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `CREATE TABLE users (
    user_id   INT PRIMARY KEY,
    email     TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role      TEXT NOT NULL DEFAULT 'member',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_users_email UNIQUE (email)
);` }],
    solutionExplanationHtml: `<p>The <code>UNIQUE</code> constraint is declared at the table level as a named <code>CONSTRAINT</code>, which does two useful things: it enforces that no two rows share an email, and it gives the rule a stable name (<code>uq_users_email</code>) that shows up in error messages and can be referenced by later <code>ALTER TABLE ... DROP CONSTRAINT</code> migrations. An inline <code>email TEXT UNIQUE</code> works too but leaves Postgres to auto-name it <code>users_email_key</code>, which is fragile to depend on.</p>
<p>The defaults make the common insert path short: supply an id, email, and name, and the row is complete. The trap is assuming <code>DEFAULT</code> alone guarantees a value — it does not stop an explicit <code>NULL</code>. Pairing <code>NOT NULL</code> with each <code>DEFAULT</code> closes that gap. Note also that <code>UNIQUE</code> in Postgres permits multiple <code>NULL</code>s (each null is distinct), so if email were nullable, uniqueness would not prevent many null-email rows — another reason email is <code>NOT NULL</code> here.</p>`,
    _setup: `DROP TABLE IF EXISTS users CASCADE;`,
    _check: `INSERT INTO users (user_id, email, full_name) VALUES (1,'a@x.io','Ann');
SELECT user_id, role, is_active FROM users;`,
    _extra: `INSERT INTO users (user_id, email, full_name) VALUES (2,'a@x.io','Al');  -- expect uq_users_email violation
INSERT INTO users (user_id, email, full_name) VALUES (3, NULL, 'No');       -- expect NOT NULL violation`,
  },

  {
    title: 'Link Orders to Customers with a Foreign Key',
    difficulty: 'MEDIUM',
    estimatedMinutes: 25,
    points: 15,
    concepts: ['FOREIGN KEY', 'referential integrity', 'one-to-many relationships', 'REFERENCES', 'NOT NULL FK'],
    prerequisites: ['CREATE TABLE', 'primary keys', 'NOT NULL'],
    tags: ['ddl', 'foreign-key', 'relationships', 'integrity', 'postgres'],
    problemHtml: `<p>A relationship is only trustworthy if the database enforces it. If <code>orders.customer_id</code> can point at a customer that does not exist, reports break and joins silently drop rows. A <strong>foreign key</strong> makes the reference a hard rule: you cannot insert an order for a missing customer, and you cannot delete a customer who still has orders unless you say what should happen to them.</p>
<p>Create two tables that model a one-to-many relationship (one customer has many orders):</p>
<ul>
<li><code>customers</code>: <code>customer_id</code> integer primary key, <code>name</code> required text.</li>
<li><code>orders</code>: <code>order_id</code> integer primary key, <code>customer_id</code> integer that is <strong>required</strong> and is a foreign key <strong>referencing</strong> <code>customers(customer_id)</code>, <code>total</code> required <code>NUMERIC(10,2)</code>, and <code>placed_on</code> a date that defaults to the current date.</li>
</ul>
<p>Do not specify an <code>ON DELETE</code> action — leave it at the default (<code>NO ACTION</code>), so deleting a customer with orders is blocked. The scaffold marks where the foreign key clause goes.</p>`,
    inputSpec: 'No existing tables. Write DDL for both customers and orders with the foreign-key relationship.',
    outputSpec: 'orders.customer_id is a NOT NULL foreign key to customers. Inserting an order whose customer_id has no matching customer is rejected; deleting a customer that still has orders is rejected.',
    constraints: 'orders.customer_id must be NOT NULL and a real FOREIGN KEY (not just an integer). Do not add an ON DELETE CASCADE.',
    examplesJson: [
      {
        input: "INSERT customers (1,'Ann'); INSERT orders (10, 1, 99.00);",
        output: 'Both rows stored; placed_on defaults to today.',
        explanation: 'The order references customer 1, which exists, so the foreign key is satisfied.',
      },
      {
        input: 'INSERT orders (11, 999, 5.00) with no customer 999',
        output: 'ERROR: insert or update on table "orders" violates foreign key constraint',
        explanation: 'customer_id 999 has no matching row in customers, so the foreign key rejects the order.',
      },
      {
        input: 'DELETE FROM customers WHERE customer_id = 1 while order 10 still references it',
        output: 'ERROR: update or delete on table "customers" violates foreign key constraint on table "orders"',
        explanation: 'With the default NO ACTION, a customer that still has orders cannot be deleted — the reference must be resolved first.',
      },
    ],
    hintsJson: [
      'The order table needs to promise that its customer_id always names a real customer. What clause makes that promise?',
      'REFERENCES customers(customer_id) on the column turns it into a foreign key.',
      'Add NOT NULL so an order can never be orphaned with a null customer.',
      'orders: customer_id INT NOT NULL REFERENCES customers(customer_id). Leave off ON DELETE so the default blocks deleting a referenced customer.',
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- One customer has many orders.
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name        TEXT NOT NULL
);

CREATE TABLE orders (
    order_id    INT PRIMARY KEY,
    -- customer_id: required foreign key to customers
    total       NUMERIC(10,2) NOT NULL,
    placed_on   DATE NOT NULL DEFAULT CURRENT_DATE
);` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name        TEXT NOT NULL
);

CREATE TABLE orders (
    order_id    INT PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(customer_id),
    total       NUMERIC(10,2) NOT NULL,
    placed_on   DATE NOT NULL DEFAULT CURRENT_DATE
);` }],
    solutionExplanationHtml: `<p>The single clause <code>customer_id INT NOT NULL REFERENCES customers(customer_id)</code> creates the foreign key. It enforces the relationship in both directions: an <code>INSERT</code> into <code>orders</code> must name a customer that already exists, and a <code>DELETE</code> or key change on <code>customers</code> is blocked while any order still points at that customer (the default <code>ON DELETE NO ACTION</code>). Adding <code>NOT NULL</code> is a deliberate design choice here — it says every order must belong to a customer, ruling out orphan orders with a null owner.</p>
<p>Ordering matters: <code>customers</code> must be created before <code>orders</code>, because the foreign key references it. The trap most learners hit is declaring the column as a plain <code>INT</code> and assuming the relationship is "obvious" from the name — without <code>REFERENCES</code>, the database enforces nothing and bad <code>customer_id</code> values slip in. A second subtlety: the foreign key requires the referenced column to be a primary key or have a unique constraint, which <code>customer_id</code> satisfies as the PK of <code>customers</code>. To allow deleting a customer and cascading their orders, you would add <code>ON DELETE CASCADE</code> — but that is a separate design decision covered later.</p>`,
    _setup: `DROP TABLE IF EXISTS orders, customers CASCADE;`,
    _check: `INSERT INTO customers VALUES (1,'Ann');
INSERT INTO orders (order_id, customer_id, total) VALUES (10, 1, 99.00);
SELECT order_id, customer_id, total, (placed_on = CURRENT_DATE) AS today FROM orders;`,
    _extra: `INSERT INTO orders (order_id, customer_id, total) VALUES (11, 999, 5.00);  -- expect FK violation
DELETE FROM customers WHERE customer_id = 1;                                -- expect FK violation`,
  },

  {
    title: 'Guard a Products Table with CHECK Constraints',
    difficulty: 'MEDIUM',
    estimatedMinutes: 25,
    points: 15,
    concepts: ['CHECK constraint', 'domain rules', 'enumerated values', 'range validation', 'declarative integrity'],
    prerequisites: ['CREATE TABLE', 'NOT NULL', 'data types'],
    tags: ['ddl', 'check', 'constraints', 'validation', 'postgres'],
    problemHtml: `<p>Application code that validates "price must be positive" is only as reliable as the last developer who remembered to call it. A <strong>CHECK constraint</strong> moves that rule into the table itself, so every insert and update — from any service, script, or manual session — is validated by the database. Invalid rows are rejected at the source.</p>
<p>Create a <code>products</code> table whose columns carry their business rules:</p>
<ul>
<li><code>product_id</code> integer primary key, <code>name</code> required text.</li>
<li><code>price</code> <code>NUMERIC(10,2)</code>, required, that must be <strong>strictly greater than 0</strong>.</li>
<li><code>discount_pct</code> integer, required, defaulting to 0, that must be <strong>between 0 and 90 inclusive</strong>.</li>
<li><code>status</code> text, required, that must be one of <code>'draft'</code>, <code>'active'</code>, or <code>'archived'</code>.</li>
</ul>
<p>Name the status constraint <code>chk_products_status</code>. The scaffold shows the column list with the CHECK clauses left for you to complete.</p>`,
    inputSpec: 'No existing tables. Write DDL creating products with the three CHECK constraints.',
    outputSpec: "A products table that rejects price <= 0, discount_pct outside 0..90, and any status other than draft/active/archived, while accepting valid combinations.",
    constraints: "Use CHECK constraints, not a trigger or application code. The status constraint must be named chk_products_status. Use an inclusive range for discount_pct.",
    examplesJson: [
      {
        input: "INSERT products (1,'Mug', 12.50, 10, 'active')",
        output: 'Row stored.',
        explanation: 'price > 0, discount 10 is within 0..90, and status is one of the allowed values.',
      },
      {
        input: "INSERT products (2,'Bad', 0.00, 0, 'active')",
        output: 'ERROR: new row for relation "products" violates check constraint on price',
        explanation: 'price must be strictly greater than 0, and 0.00 fails the CHECK.',
      },
      {
        input: "INSERT products (3,'Odd', 5.00, 0, 'pending')",
        output: 'ERROR: new row for relation "products" violates check constraint "chk_products_status"',
        explanation: "'pending' is not in the allowed set, so the named status CHECK rejects it.",
      },
    ],
    hintsJson: [
      'A rule like "price must be positive" is a condition every row must satisfy. Which constraint evaluates a boolean condition per row?',
      "CHECK (price > 0) attached to the column enforces positivity. For a fixed set of values, CHECK (status IN ('draft','active','archived')).",
      'For an inclusive range use CHECK (discount_pct BETWEEN 0 AND 90).',
      "Give the status rule a name: CONSTRAINT chk_products_status CHECK (status IN ('draft','active','archived')).",
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `CREATE TABLE products (
    product_id   INT PRIMARY KEY,
    name         TEXT NOT NULL,
    price        NUMERIC(10,2) NOT NULL,          -- must be > 0
    discount_pct INT NOT NULL DEFAULT 0,          -- must be 0..90
    status       TEXT NOT NULL                     -- draft | active | archived
    -- add CHECK constraints here (name the status one chk_products_status)
);` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `CREATE TABLE products (
    product_id   INT PRIMARY KEY,
    name         TEXT NOT NULL,
    price        NUMERIC(10,2) NOT NULL CHECK (price > 0),
    discount_pct INT NOT NULL DEFAULT 0 CHECK (discount_pct BETWEEN 0 AND 90),
    status       TEXT NOT NULL,
    CONSTRAINT chk_products_status CHECK (status IN ('draft', 'active', 'archived'))
);` }],
    solutionExplanationHtml: `<p>Each <code>CHECK</code> is a boolean condition the database evaluates on every insert and update; if it returns false the row is rejected. <code>price &gt; 0</code> makes zero and negative prices impossible, <code>discount_pct BETWEEN 0 AND 90</code> pins the discount to an inclusive range, and <code>status IN (...)</code> turns a free-text column into a small enumeration without needing a separate lookup table.</p>
<p>Naming the status constraint (<code>chk_products_status</code>) means the error message names the exact rule that failed, which is far more debuggable than an auto-generated <code>products_status_check</code>. The subtle point learners miss: a <code>CHECK</code> treats <code>NULL</code> as "unknown", so the condition passes when the column is null. That is why every guarded column is also <code>NOT NULL</code> — otherwise a null price would slip past <code>CHECK (price &gt; 0)</code>. For a fixed set of allowed strings, an <code>IN</code> check is the lightest option; when the set is large or changes often, a foreign key to a reference table scales better, but for three stable statuses the inline check is exactly right.</p>`,
    _setup: `DROP TABLE IF EXISTS products CASCADE;`,
    _check: `INSERT INTO products VALUES (1,'Mug',12.50,10,'active');
SELECT * FROM products;`,
    _extra: `INSERT INTO products VALUES (2,'Bad',0.00,0,'active');     -- expect price CHECK violation
INSERT INTO products VALUES (3,'Odd',5.00,0,'pending');    -- expect chk_products_status violation
INSERT INTO products VALUES (4,'Big',5.00,95,'active');    -- expect discount_pct CHECK violation`,
  },

  {
    title: 'Evolve a Live Employees Table with ALTER TABLE',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 15,
    concepts: ['ALTER TABLE', 'ADD COLUMN', 'adding constraints', 'RENAME COLUMN', 'schema evolution'],
    prerequisites: ['CREATE TABLE', 'CHECK', 'UNIQUE', 'DEFAULT'],
    tags: ['ddl', 'alter-table', 'migration', 'schema-evolution', 'postgres'],
    problemHtml: `<p>Schemas are never finished — new fields, tighter rules, and clearer names arrive as the product grows. <code>ALTER TABLE</code> is how you change a table that already holds data, without dropping and recreating it. Getting these statements right is the core of every real database migration.</p>
<p>An <code>employees</code> table already exists with only <code>employee_id</code> (primary key) and <code>name</code>. Evolve it to satisfy all of the following, in order:</p>
<ul>
<li>Add an <code>email</code> text column, and give it a <strong>unique</strong> constraint named <code>uq_employees_email</code>.</li>
<li>Add a <code>salary</code> column of type <code>NUMERIC(10,2)</code> that is required, defaults to <code>0</code>, and has a <code>CHECK</code> that it is <strong>at least 0</strong>.</li>
<li>Add a <code>hired_on</code> date column that is required and defaults to the current date.</li>
<li><strong>Rename</strong> the <code>name</code> column to <code>full_name</code>.</li>
</ul>
<p>The existing row(s) must survive the migration. The scaffold provides the <code>ALTER TABLE</code> statements as comments to complete.</p>`,
    inputSpec: 'An employees table exists with columns employee_id INT PK and name TEXT NOT NULL, containing one row (1, \'Ann\'). Write ALTER statements to evolve it.',
    outputSpec: 'After the migration: employees has columns employee_id, full_name (renamed from name), email (UNIQUE via uq_employees_email), salary NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK >= 0, hired_on DATE NOT NULL DEFAULT current date. The pre-existing row is intact.',
    constraints: 'Use ALTER TABLE only — do not DROP and recreate the table. The unique constraint must be named uq_employees_email. Adding a NOT NULL column to a table with existing rows requires a DEFAULT.',
    examplesJson: [
      {
        input: 'Existing row (1, \'Ann\') before migration',
        output: 'After migration the row is (employee_id=1, full_name=\'Ann\', email=NULL, salary=0.00, hired_on=today).',
        explanation: 'The renamed column keeps its data; salary and hired_on fill from their defaults on the existing row; email is nullable so it becomes NULL.',
      },
      {
        input: "Two employees given the same email after migration",
        output: 'ERROR: duplicate key value violates unique constraint "uq_employees_email"',
        explanation: 'The added unique constraint applies to all rows going forward.',
      },
    ],
    hintsJson: [
      'Each change is its own ALTER TABLE ... statement. Start by adding the new columns.',
      'Adding a NOT NULL column to a table that already has rows fails unless you also give a DEFAULT to backfill them.',
      'Add a named unique constraint with ALTER TABLE employees ADD CONSTRAINT uq_employees_email UNIQUE (email).',
      'Rename with ALTER TABLE employees RENAME COLUMN name TO full_name. A CHECK can be added inline in ADD COLUMN salary NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (salary >= 0).',
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- employees already exists: (employee_id INT PK, name TEXT NOT NULL)
-- Evolve it with ALTER TABLE (do not drop it).

-- 1) add email + named unique constraint
-- ALTER TABLE employees ADD COLUMN ...
-- ALTER TABLE employees ADD CONSTRAINT ...

-- 2) add salary NUMERIC(10,2) NOT NULL DEFAULT 0, CHECK >= 0

-- 3) add hired_on DATE NOT NULL DEFAULT current date

-- 4) rename name -> full_name` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `ALTER TABLE employees ADD COLUMN email TEXT;
ALTER TABLE employees ADD CONSTRAINT uq_employees_email UNIQUE (email);

ALTER TABLE employees ADD COLUMN salary NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (salary >= 0);

ALTER TABLE employees ADD COLUMN hired_on DATE NOT NULL DEFAULT CURRENT_DATE;

ALTER TABLE employees RENAME COLUMN name TO full_name;` }],
    solutionExplanationHtml: `<p>Each concern is a separate <code>ALTER TABLE</code> so the migration reads as a sequence of intentional changes. The order is not arbitrary: the <code>email</code> column must exist before you attach <code>uq_employees_email</code> to it.</p>
<p>The most important detail is adding a <code>NOT NULL</code> column to a table that already contains rows. Postgres must give those existing rows a value for the new column, so <code>ADD COLUMN salary NUMERIC(10,2) NOT NULL DEFAULT 0</code> succeeds by backfilling every current row with <code>0</code>; the same logic backfills <code>hired_on</code> with today's date. Omitting the <code>DEFAULT</code> would raise <em>column "salary" contains null values</em> and abort. <code>email</code>, by contrast, is left nullable on purpose, so it does not need a default and simply becomes <code>NULL</code> for the existing row.</p>
<p><code>RENAME COLUMN</code> preserves the data — it only changes the name, so <code>'Ann'</code> stays under <code>full_name</code>. A subtle trap: because a unique constraint in Postgres allows multiple nulls, adding <code>uq_employees_email</code> does not fail even though the pre-existing row now has a null email. Uniqueness only bites once two rows share the same non-null email.</p>`,
    _setup: `DROP TABLE IF EXISTS employees CASCADE;
CREATE TABLE employees (employee_id INT PRIMARY KEY, name TEXT NOT NULL);
INSERT INTO employees VALUES (1,'Ann');`,
    _check: `\\d employees
SELECT employee_id, full_name, email, salary, (hired_on = CURRENT_DATE) AS hired_today FROM employees;`,
    _extra: `INSERT INTO employees (employee_id, full_name, email) VALUES (2,'Al','al@x.io');
INSERT INTO employees (employee_id, full_name, email) VALUES (3,'Ed','al@x.io');  -- expect uq_employees_email violation`,
  },

  {
    title: 'Model Many-to-Many Course Enrollments with a Junction Table',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 15,
    concepts: ['junction table', 'composite primary key', 'many-to-many', 'multiple foreign keys', 'natural key'],
    prerequisites: ['FOREIGN KEY', 'PRIMARY KEY', 'CREATE TABLE'],
    tags: ['ddl', 'many-to-many', 'junction-table', 'composite-key', 'postgres'],
    problemHtml: `<p>A student takes many courses and a course has many students. Relational tables cannot store a list in a column, so a many-to-many relationship is modeled with a third table — a <strong>junction</strong> (or bridge) table — whose rows each represent one pairing. Getting its key right is what prevents a student being enrolled in the same course twice.</p>
<p>Create three tables:</p>
<ul>
<li><code>students</code>: <code>student_id</code> integer primary key, <code>name</code> required.</li>
<li><code>courses</code>: <code>course_id</code> integer primary key, <code>title</code> required.</li>
<li><code>enrollments</code>: a junction table with <code>student_id</code> and <code>course_id</code>, each a foreign key to its parent table, plus <code>enrolled_on</code> defaulting to the current date. The <strong>primary key must be the pair</strong> <code>(student_id, course_id)</code> so the same student cannot enroll in the same course twice.</li>
</ul>
<p>The composite primary key is the whole point: it is both the identity of a row and the uniqueness rule. The scaffold shows where to declare it.</p>`,
    inputSpec: 'No existing tables. Write DDL for students, courses, and the enrollments junction table.',
    outputSpec: 'enrollments has a composite PRIMARY KEY (student_id, course_id) and two foreign keys. Enrolling the same student in the same course twice is rejected; enrolling in a non-existent course is rejected.',
    constraints: 'The primary key of enrollments must be the composite (student_id, course_id). Both columns must be foreign keys. Do not add a surrogate id column.',
    examplesJson: [
      {
        input: 'Enroll student 1 in course 100, then in course 200',
        output: 'Both rows stored — a student may take many courses.',
        explanation: 'Different (student_id, course_id) pairs are distinct composite keys.',
      },
      {
        input: 'Enroll student 1 in course 100 a second time',
        output: 'ERROR: duplicate key value violates unique constraint (the composite primary key)',
        explanation: 'The pair (1, 100) already exists, and the composite primary key forbids duplicates.',
      },
      {
        input: 'Enroll student 1 in course 999 (no such course)',
        output: 'ERROR: violates foreign key constraint',
        explanation: 'course_id 999 has no matching course, so the foreign key rejects the enrollment.',
      },
    ],
    hintsJson: [
      'You cannot store a list of courses inside a student row. Introduce a table whose rows are (student, course) pairs.',
      'Each of the two columns should be a foreign key to its parent table.',
      'To forbid duplicate pairings, make the pair itself the identity: PRIMARY KEY (student_id, course_id).',
      'enrollments (student_id INT REFERENCES students, course_id INT REFERENCES courses, enrolled_on DATE DEFAULT CURRENT_DATE, PRIMARY KEY (student_id, course_id)).',
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name       TEXT NOT NULL
);
CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    title     TEXT NOT NULL
);
CREATE TABLE enrollments (
    -- student_id, course_id: foreign keys
    -- enrolled_on: defaults to today
    -- PRIMARY KEY over the pair
);` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name       TEXT NOT NULL
);
CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    title     TEXT NOT NULL
);
CREATE TABLE enrollments (
    student_id  INT NOT NULL REFERENCES students(student_id),
    course_id   INT NOT NULL REFERENCES courses(course_id),
    enrolled_on DATE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (student_id, course_id)
);` }],
    solutionExplanationHtml: `<p>The junction table <code>enrollments</code> turns a many-to-many relationship into two one-to-many relationships it can actually store: one enrollment row links exactly one student to exactly one course. Each column is a foreign key, so an enrollment can only name a student and a course that really exist.</p>
<p>The composite <code>PRIMARY KEY (student_id, course_id)</code> does double duty. As the primary key it identifies a row, and as a key it enforces uniqueness of the pair — so student 1 can appear in many rows (many courses) and course 100 can appear in many rows (many students), but the <em>combination</em> (1, 100) can appear only once. That is precisely the rule "no duplicate enrollments" expressed declaratively. The common mistake is to add a surrogate <code>enrollment_id</code> primary key and stop there: that makes each row unique by id but happily allows (1, 100) to be inserted a hundred times. If you do want a surrogate key for convenience, you must still add <code>UNIQUE (student_id, course_id)</code> to keep the real rule. Extra columns describing the pairing — like <code>enrolled_on</code> or a grade — live naturally on this table, which is another reason the bridge table is the right home for the relationship.</p>`,
    diagramMermaid: `erDiagram
  students ||--o{ enrollments : has
  courses ||--o{ enrollments : has
  students { int student_id PK }
  courses { int course_id PK }
  enrollments { int student_id PK }`,
    _setup: `DROP TABLE IF EXISTS enrollments, courses, students CASCADE;`,
    _check: `INSERT INTO students VALUES (1,'Ann');
INSERT INTO courses VALUES (100,'DB'),(200,'OS');
INSERT INTO enrollments (student_id, course_id) VALUES (1,100),(1,200);
SELECT * FROM enrollments ORDER BY course_id;`,
    _extra: `INSERT INTO enrollments (student_id, course_id) VALUES (1,100);   -- expect composite PK violation
INSERT INTO enrollments (student_id, course_id) VALUES (1,999);   -- expect FK violation`,
  },

  {
    title: 'Combine a Surrogate Identity Key with a Natural Unique Key',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 20,
    concepts: ['GENERATED ALWAYS AS IDENTITY', 'surrogate key', 'natural key', 'UNIQUE', 'key design'],
    prerequisites: ['PRIMARY KEY', 'UNIQUE', 'CREATE TABLE'],
    tags: ['ddl', 'identity', 'keys', 'surrogate-key', 'postgres'],
    problemHtml: `<p>Two kinds of key often coexist. A <strong>surrogate key</strong> is a meaningless auto-generated number that never changes and makes a stable target for foreign keys. A <strong>natural key</strong> is a real-world identifier — a SKU, a warehouse code — that is unique but might be reassigned or reformatted. Good schemas use the surrogate for identity and a <code>UNIQUE</code> natural key for lookups, getting the benefits of both.</p>
<p>Create a <code>warehouses</code> table:</p>
<ul>
<li><code>id</code> as an <strong>identity</strong> column using <code>GENERATED ALWAYS AS IDENTITY</code>, and make it the primary key. The database, not the caller, assigns it.</li>
<li><code>code</code> required text with a <strong>unique</strong> constraint — the natural key humans use (e.g. <code>'WH-A'</code>).</li>
<li><code>city</code> required text.</li>
</ul>
<p>Then insert two warehouses (<code>'WH-A'</code>/Hanoi and <code>'WH-B'</code>/Danang) <strong>without supplying id values</strong>, letting the identity column generate them. The scaffold marks both the DDL and the inserts.</p>`,
    inputSpec: 'No existing tables. Create the table, then insert two rows without id values.',
    outputSpec: "warehouses.id auto-generates 1 and 2 for the two inserts. code is unique (a duplicate 'WH-A' is rejected). Attempting to insert an explicit id fails because the column is GENERATED ALWAYS.",
    constraints: 'Use GENERATED ALWAYS AS IDENTITY (not SERIAL, not a manual sequence). The natural key code must have a UNIQUE constraint. Do not supply id values in the inserts.',
    examplesJson: [
      {
        input: "INSERT INTO warehouses (code, city) VALUES ('WH-A','Hanoi'),('WH-B','Danang');",
        output: 'Rows stored with id = 1 and id = 2, assigned by the database.',
        explanation: 'GENERATED ALWAYS AS IDENTITY produces the next value automatically for each inserted row.',
      },
      {
        input: "INSERT INTO warehouses (code, city) VALUES ('WH-A','Other');",
        output: 'ERROR: duplicate key value violates unique constraint on code',
        explanation: "'WH-A' already exists and code is UNIQUE, so the natural key rejects the duplicate.",
      },
      {
        input: "INSERT INTO warehouses (id, code, city) VALUES (99,'WH-C','Hue');",
        output: 'ERROR: cannot insert a non-DEFAULT value into column "id"',
        explanation: 'GENERATED ALWAYS forbids caller-supplied ids, guaranteeing the surrogate stays under the database\'s control.',
      },
    ],
    hintsJson: [
      'The database should own the id. Which modern identity clause makes it generate values and reject caller-supplied ones?',
      'id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY declares a database-owned surrogate key.',
      'The human-facing code is a separate natural key: give it UNIQUE so lookups by code are guaranteed to hit at most one row.',
      "Insert without id: INSERT INTO warehouses (code, city) VALUES ('WH-A','Hanoi'); the id fills itself.",
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Surrogate id (database-generated) + natural unique code.
CREATE TABLE warehouses (
    -- id: GENERATED ALWAYS AS IDENTITY, primary key
    -- code: required, unique
    -- city: required
);

-- Insert two rows WITHOUT supplying id.
-- INSERT INTO warehouses (code, city) VALUES ...` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `CREATE TABLE warehouses (
    id   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    city TEXT NOT NULL
);

INSERT INTO warehouses (code, city) VALUES ('WH-A', 'Hanoi'), ('WH-B', 'Danang');` }],
    solutionExplanationHtml: `<p>This table uses two keys on purpose. <code>id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY</code> is the surrogate: the database assigns 1, 2, 3, … from an internal sequence, and because it is <code>GENERATED ALWAYS</code> a caller cannot override it (an explicit id raises an error unless you use <code>OVERRIDING SYSTEM VALUE</code>). That makes <code>id</code> a stable, opaque target for foreign keys from other tables. <code>code TEXT NOT NULL UNIQUE</code> is the natural key — the identifier humans actually type — and <code>UNIQUE</code> guarantees a lookup by code returns at most one warehouse.</p>
<p><code>GENERATED ALWAYS AS IDENTITY</code> is the SQL-standard, modern replacement for <code>SERIAL</code>. The practical differences matter: <code>SERIAL</code> creates a loosely-owned sequence, lets callers insert arbitrary ids (which then collide with future generated values and cause duplicate-key errors), and does not reset cleanly. The trap here is designing with <em>only</em> a natural key as the primary key: real-world codes get reformatted or reassigned, and when a primary key value changes, every foreign key referencing it must change too — a painful cascade the surrogate avoids entirely. Using the surrogate for identity and the natural key for uniqueness is the pattern that keeps both stable references and human-friendly lookups.</p>`,
    _setup: `DROP TABLE IF EXISTS warehouses CASCADE;`,
    _check: `SELECT id, code, city FROM warehouses ORDER BY id;`,
    _extra: `INSERT INTO warehouses (code, city) VALUES ('WH-A','Other');       -- expect UNIQUE violation on code
INSERT INTO warehouses (id, code, city) VALUES (99,'WH-C','Hue');  -- expect GENERATED ALWAYS error`,
  },

  {
    title: 'Control Deletes with ON DELETE CASCADE and SET NULL',
    difficulty: 'MEDIUM',
    estimatedMinutes: 35,
    points: 20,
    concepts: ['ON DELETE CASCADE', 'ON DELETE SET NULL', 'referential actions', 'foreign key behavior', 'schema semantics'],
    prerequisites: ['FOREIGN KEY', 'nullable columns', 'CREATE TABLE'],
    tags: ['ddl', 'foreign-key', 'on-delete', 'cascade', 'postgres'],
    problemHtml: `<p>When a parent row is deleted, what happens to the children that reference it is a design decision — and you encode it directly in the foreign key. Get it wrong and you either leave orphaned rows, block deletes forever, or wipe out data you meant to keep. The two workhorse behaviors are <code>CASCADE</code> (delete the children too) and <code>SET NULL</code> (keep the children but forget the link).</p>
<p>Model a publishing domain with three tables and the correct delete behavior on each relationship:</p>
<ul>
<li><code>authors</code>: <code>author_id</code> primary key, <code>name</code> required.</li>
<li><code>books</code>: <code>book_id</code> primary key, <code>title</code> required, and a <strong>nullable</strong> <code>author_id</code> foreign key to <code>authors</code> with <code>ON DELETE SET NULL</code> — deleting an author should keep their books but mark them author-less.</li>
<li><code>reviews</code>: <code>review_id</code> primary key, a required <code>book_id</code> foreign key to <code>books</code> with <code>ON DELETE CASCADE</code> — deleting a book should delete its reviews, and a <code>rating</code> integer with a <code>CHECK</code> between 1 and 5.</li>
</ul>
<p>The scaffold marks where the two <code>ON DELETE</code> clauses go. Choose the referential action that matches each sentence above.</p>`,
    inputSpec: 'No existing tables. Create authors, books, reviews with the specified ON DELETE actions.',
    outputSpec: 'Deleting an author sets author_id to NULL on their books (books survive). Deleting a book deletes all of its reviews. A review rating outside 1..5 is rejected.',
    constraints: 'books.author_id must be nullable and ON DELETE SET NULL. reviews.book_id must be NOT NULL and ON DELETE CASCADE. rating must be CHECK (rating BETWEEN 1 AND 5).',
    examplesJson: [
      {
        input: 'Author 1 wrote book 10; delete author 1',
        output: "book 10 survives with author_id = NULL.",
        explanation: 'ON DELETE SET NULL keeps the child row but clears the reference, so the book is retained without a (now non-existent) author.',
      },
      {
        input: 'Book 10 has reviews 100 and 101; delete book 10',
        output: 'reviews 100 and 101 are deleted automatically.',
        explanation: 'ON DELETE CASCADE removes children when the parent goes, which is correct: a review of a deleted book is meaningless.',
      },
      {
        input: 'Insert a review with rating = 9',
        output: 'ERROR: violates check constraint on rating',
        explanation: 'rating is constrained to 1..5, so 9 is rejected.',
      },
    ],
    hintsJson: [
      'The two relationships want opposite behavior on parent delete. Read each sentence and map it to CASCADE or SET NULL.',
      '"Keep the books but forget the author" = ON DELETE SET NULL, which requires the child column to be nullable.',
      '"Delete the reviews with the book" = ON DELETE CASCADE, on a NOT NULL foreign key.',
      'books: author_id INT REFERENCES authors(author_id) ON DELETE SET NULL. reviews: book_id INT NOT NULL REFERENCES books(book_id) ON DELETE CASCADE.',
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `CREATE TABLE authors (
    author_id INT PRIMARY KEY,
    name      TEXT NOT NULL
);
CREATE TABLE books (
    book_id   INT PRIMARY KEY,
    title     TEXT NOT NULL,
    author_id INT REFERENCES authors(author_id)   -- add ON DELETE action: keep books, null the link
);
CREATE TABLE reviews (
    review_id INT PRIMARY KEY,
    book_id   INT NOT NULL REFERENCES books(book_id),  -- add ON DELETE action: remove with the book
    rating    INT NOT NULL                              -- CHECK 1..5
);` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `CREATE TABLE authors (
    author_id INT PRIMARY KEY,
    name      TEXT NOT NULL
);
CREATE TABLE books (
    book_id   INT PRIMARY KEY,
    title     TEXT NOT NULL,
    author_id INT REFERENCES authors(author_id) ON DELETE SET NULL
);
CREATE TABLE reviews (
    review_id INT PRIMARY KEY,
    book_id   INT NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    rating    INT NOT NULL CHECK (rating BETWEEN 1 AND 5)
);` }],
    solutionExplanationHtml: `<p>The referential action lives in the foreign key and fires automatically when the referenced parent row is deleted. <code>books.author_id ... ON DELETE SET NULL</code> means deleting an author keeps every one of their books and simply nulls the link — which is why <code>author_id</code> must be nullable; <code>SET NULL</code> on a <code>NOT NULL</code> column would raise an error at delete time. <code>reviews.book_id ... ON DELETE CASCADE</code> means deleting a book takes its reviews with it, appropriate because a review with no book is meaningless.</p>
<p>Choosing between them is a data-retention decision, not a syntax detail. <code>CASCADE</code> is right when the child cannot exist without the parent (reviews, order line items). <code>SET NULL</code> is right when the child is independently valuable and only loosely related (a book outlives its author record). The two other options complete the toolkit: the default <code>NO ACTION</code>/<code>RESTRICT</code> blocks the delete entirely (safest, forces you to deal with children explicitly), and <code>SET DEFAULT</code> points the child at a fallback row. The trap learners hit is reaching for <code>CASCADE</code> everywhere because it "just works" — until a single <code>DELETE</code> on a parent silently erases thousands of children across a deep chain. Cascades should be deliberate and shallow.</p>`,
    diagramMermaid: `flowchart TD
  A[DELETE author] -->|ON DELETE SET NULL| B[books kept, author_id becomes null]
  C[DELETE book] -->|ON DELETE CASCADE| D[reviews of that book deleted]`,
    _setup: `DROP TABLE IF EXISTS reviews, books, authors CASCADE;`,
    _check: `INSERT INTO authors VALUES (1,'Ann');
INSERT INTO books VALUES (10,'DB Design',1);
INSERT INTO reviews VALUES (100,10,5),(101,10,4);
DELETE FROM authors WHERE author_id = 1;
SELECT book_id, author_id FROM books;                 -- author_id should be NULL
DELETE FROM books WHERE book_id = 10;
SELECT count(*) AS reviews_left FROM reviews;         -- should be 0`,
    _extra: `INSERT INTO books VALUES (11,'Orphan test',NULL);
INSERT INTO reviews VALUES (200,11,9);                 -- expect rating CHECK violation`,
  },

  {
    title: 'Normalize a Denormalized Orders Sheet to Third Normal Form',
    difficulty: 'HARD',
    estimatedMinutes: 60,
    points: 25,
    concepts: ['normalization', 'third normal form', 'functional dependencies', 'redundancy elimination', 'data migration'],
    prerequisites: ['FOREIGN KEY', 'INSERT ... SELECT DISTINCT', 'schema design', 'primary keys'],
    tags: ['ddl', 'normalization', '3nf', 'migration', 'postgres'],
    problemHtml: `<p>A single wide "spreadsheet" table repeats the same customer and product facts on every order line. That redundancy causes update anomalies — change a customer's email and you must update it in dozens of rows, and any row you miss now disagrees with the others. <strong>Normalization to third normal form</strong> removes the redundancy by giving every fact one home.</p>
<p>You are given a denormalized table <code>orders_flat(line_id, order_ref, customer_name, customer_email, product_name, unit_price, qty)</code> already seeded with rows. Design and build a normalized schema, then migrate the data into it:</p>
<ul>
<li>Create <code>customers(customer_id GENERATED ALWAYS AS IDENTITY PK, name, email UNIQUE)</code>.</li>
<li>Create <code>products(product_id GENERATED ALWAYS AS IDENTITY PK, name UNIQUE, unit_price)</code>.</li>
<li>Create <code>orders(order_id GENERATED ALWAYS AS IDENTITY PK, order_ref UNIQUE, customer_id FK)</code> — one row per distinct order.</li>
<li>Create <code>order_items(order_id FK, product_id FK, qty, PRIMARY KEY(order_id, product_id))</code>.</li>
<li>Populate all four tables from <code>orders_flat</code> using <code>INSERT ... SELECT DISTINCT</code>, joining on the natural keys (email, product name, order_ref) so no fact is duplicated.</li>
</ul>
<p>The migration must lose no information: you should be able to reconstruct every original line by joining the new tables. The scaffold provides the DDL headers and the outline of the four migration inserts.</p>`,
    inputSpec: 'orders_flat is seeded with 4 lines across 3 orders (ORD-1 has two lines), 2 customers, and 3 products (some customers/products repeat across rows). Build the normalized schema and migrate the data.',
    outputSpec: 'customers has 2 rows, products has 3 rows, orders has 3 rows, order_items has 4 rows. A join across the four tables reproduces the original (order_ref, customer_email, product_name, qty) lines exactly.',
    constraints: 'Populate with INSERT ... SELECT DISTINCT joined on natural keys — do not hard-code generated ids. Use the identity columns for surrogate keys. order_items primary key is the composite (order_id, product_id).',
    examplesJson: [
      {
        input: "Customer ann@x.io appears on two different orders (ORD-1 and ORD-2) across three lines",
        output: "customers holds exactly one row for 'ann@x.io'.",
        explanation: 'SELECT DISTINCT on (name, email) collapses the repeated customer facts into a single normalized row, even though that customer spans multiple orders and lines.',
      },
      {
        input: 'A reconstruction join of the four tables',
        output: 'Reproduces all 4 original lines with matching order_ref, customer_email, product_name, and qty.',
        explanation: 'No information was lost — the redundancy was removed but every fact is still derivable.',
      },
    ],
    hintsJson: [
      'Find the independent entities hiding in the wide table: a customer, a product, an order, and the line that ties an order to a product.',
      'Insert the "dimension" tables first (customers, products) with SELECT DISTINCT on their natural keys, so each real-world thing appears once.',
      'For orders, SELECT DISTINCT order_ref and look up the customer_id by joining orders_flat to the freshly-populated customers on email.',
      'For order_items, join orders_flat to orders (on order_ref) and products (on name) to translate natural keys into the surrogate ids, then insert (order_id, product_id, qty).',
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Given: orders_flat(line_id, order_ref, customer_name, customer_email, product_name, unit_price, qty)
-- Build a 3NF schema and migrate the data with INSERT ... SELECT DISTINCT.

CREATE TABLE customers (
    -- customer_id identity PK, name, email UNIQUE
);
CREATE TABLE products (
    -- product_id identity PK, name UNIQUE, unit_price
);
CREATE TABLE orders (
    -- order_id identity PK, order_ref UNIQUE, customer_id FK
);
CREATE TABLE order_items (
    -- order_id FK, product_id FK, qty, PRIMARY KEY(order_id, product_id)
);

-- 1) customers  <- DISTINCT (customer_name, customer_email)
-- 2) products   <- DISTINCT (product_name, unit_price)
-- 3) orders     <- DISTINCT order_ref, join to customers on email
-- 4) order_items<- join orders_flat to orders (order_ref) and products (name)` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `CREATE TABLE customers (
    customer_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE
);
CREATE TABLE products (
    product_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name       TEXT NOT NULL UNIQUE,
    unit_price NUMERIC(10,2) NOT NULL
);
CREATE TABLE orders (
    order_id    INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_ref   TEXT NOT NULL UNIQUE,
    customer_id INT NOT NULL REFERENCES customers(customer_id)
);
CREATE TABLE order_items (
    order_id   INT NOT NULL REFERENCES orders(order_id),
    product_id INT NOT NULL REFERENCES products(product_id),
    qty        INT NOT NULL CHECK (qty > 0),
    PRIMARY KEY (order_id, product_id)
);

-- 1) one row per distinct customer
INSERT INTO customers (name, email)
SELECT DISTINCT customer_name, customer_email
FROM   orders_flat;

-- 2) one row per distinct product
INSERT INTO products (name, unit_price)
SELECT DISTINCT product_name, unit_price
FROM   orders_flat;

-- 3) one row per distinct order, resolving the customer via email
INSERT INTO orders (order_ref, customer_id)
SELECT DISTINCT f.order_ref, c.customer_id
FROM   orders_flat f
JOIN   customers c ON c.email = f.customer_email;

-- 4) the lines, translating natural keys into surrogate ids
INSERT INTO order_items (order_id, product_id, qty)
SELECT o.order_id, p.product_id, f.qty
FROM   orders_flat f
JOIN   orders   o ON o.order_ref = f.order_ref
JOIN   products p ON p.name      = f.product_name;` }],
    solutionExplanationHtml: `<p>The redesign gives every fact exactly one home. A customer's email is stored once in <code>customers</code>, a product's price once in <code>products</code>, and the wide table's repetition disappears. Third normal form is reached because every non-key column depends on the whole key of its table and nothing else: <code>unit_price</code> depends only on the product, <code>email</code> only on the customer, and <code>qty</code> on the (order, product) pair — no column depends on another non-key column.</p>
<p>The migration order is forced by the foreign keys: dimension tables (<code>customers</code>, <code>products</code>) first, then <code>orders</code> which references customers, then <code>order_items</code> which references both. The essential technique is <code>SELECT DISTINCT</code> on natural keys to collapse duplicates, then <strong>joining back on those natural keys</strong> to discover the surrogate ids the identity columns generated. You never hard-code an id — you look it up. The trap is trying to carry the generated ids forward manually; instead, the join on <code>email</code>, <code>order_ref</code>, and product <code>name</code> does the translation from the old world to the new. Because those joins are exact, the original lines are fully reconstructable — the redundancy is gone but no information is lost, which is the definition of a lossless-join decomposition.</p>`,
    _setup: `DROP TABLE IF EXISTS order_items, orders, products, customers, orders_flat CASCADE;
CREATE TABLE orders_flat (
  line_id INT PRIMARY KEY, order_ref TEXT, customer_name TEXT, customer_email TEXT,
  product_name TEXT, unit_price NUMERIC(10,2), qty INT
);
INSERT INTO orders_flat VALUES
 (1,'ORD-1','Ann','ann@x.io','Keyboard',49.90,1),
 (2,'ORD-1','Ann','ann@x.io','Mouse',19.00,2),
 (3,'ORD-2','Ann','ann@x.io','Monitor',150.00,1),
 (4,'ORD-3','Bob','bob@x.io','Keyboard',49.90,3);`,
    _check: `SELECT count(*) AS customers FROM customers;   -- expect 2
SELECT count(*) AS products FROM products;     -- expect 3
SELECT count(*) AS orders FROM orders;         -- expect 3
SELECT count(*) AS items FROM order_items;     -- expect 4
-- reconstruction: must reproduce all 4 original lines
SELECT o.order_ref, c.email, p.name AS product, oi.qty
FROM order_items oi
JOIN orders o ON o.order_id = oi.order_id
JOIN customers c ON c.customer_id = o.customer_id
JOIN products p ON p.product_id = oi.product_id
ORDER BY o.order_ref, p.name;`,
  },

  {
    title: 'Design the Complete Schema for a Lending Library',
    difficulty: 'HARD',
    estimatedMinutes: 75,
    points: 30,
    concepts: ['end-to-end schema design', 'primary and foreign keys', 'CHECK constraints', 'UNIQUE constraints', 'referential actions'],
    prerequisites: ['CREATE TABLE', 'FOREIGN KEY', 'CHECK', 'composite keys', 'identity columns'],
    tags: ['ddl', 'schema-design', 'capstone', 'integrity', 'postgres'],
    problemHtml: `<p>Everything in this module comes together when you design a whole schema from a description. A lending library lends physical <em>copies</em> of <em>books</em> to <em>members</em>, and each loan has a due date and an optional return date. The schema must make illegal states impossible: no loan of a copy that does not exist, no return dated before the loan, no negative or duplicate identifiers.</p>
<p>Design and create four tables so that all the rules below are enforced by the database:</p>
<ul>
<li><code>members</code>: identity <code>member_id</code> PK; required <code>full_name</code>; required <code>email</code> that is <strong>unique</strong>; <code>joined_on</code> date defaulting to today.</li>
<li><code>books</code>: identity <code>book_id</code> PK; required <code>title</code>; required <code>isbn</code> that is <strong>unique</strong>.</li>
<li><code>copies</code>: identity <code>copy_id</code> PK; required <code>book_id</code> FK to <code>books</code> with <code>ON DELETE CASCADE</code>; a <code>condition</code> that must be one of <code>'new'</code>, <code>'good'</code>, <code>'worn'</code>.</li>
<li><code>loans</code>: identity <code>loan_id</code> PK; required <code>copy_id</code> FK to <code>copies</code>; required <code>member_id</code> FK to <code>members</code> with <code>ON DELETE RESTRICT</code>; required <code>loaned_on</code> date; required <code>due_on</code> date; nullable <code>returned_on</code> date. Enforce with CHECKs that <code>due_on &gt;= loaned_on</code> and that <code>returned_on</code>, when present, is <code>&gt;= loaned_on</code>.</li>
</ul>
<p>After the DDL, insert a valid member, book, copy, and loan to prove the happy path works. The scaffold gives the four <code>CREATE TABLE</code> headers.</p>`,
    inputSpec: 'No existing tables. Produce the full DDL for members, books, copies, loans plus a set of valid sample inserts.',
    outputSpec: 'All four tables build. A valid loan inserts successfully. Violations are rejected: a loan for a non-existent copy (FK), a due_on before loaned_on (CHECK), a returned_on before loaned_on (CHECK), a copy condition not in the allowed set (CHECK), a duplicate member email or book isbn (UNIQUE), and deleting a member who has loans (RESTRICT).',
    constraints: 'Use GENERATED ALWAYS AS IDENTITY for every surrogate key. copies.book_id is ON DELETE CASCADE; loans.member_id is ON DELETE RESTRICT. Date ordering rules must be CHECK constraints. Do not enforce any rule in application code.',
    examplesJson: [
      {
        input: 'Insert member Ann, book with isbn 111, copy in \'good\' condition, and a loan due after the loan date',
        output: 'All four rows inserted successfully.',
        explanation: 'Every value satisfies its constraints, so the happy path is accepted.',
      },
      {
        input: 'Insert a loan with due_on earlier than loaned_on',
        output: 'ERROR: violates check constraint (due_on >= loaned_on)',
        explanation: 'The date-ordering CHECK makes an impossible loan window unrepresentable.',
      },
      {
        input: 'Delete a member who currently has a loan',
        output: 'ERROR: violates foreign key constraint (ON DELETE RESTRICT)',
        explanation: 'RESTRICT blocks deleting a member with outstanding loans, protecting the loan history.',
      },
    ],
    hintsJson: [
      'Map each noun to a table and each rule to a constraint before writing SQL: unique things → UNIQUE, "must be one of" → CHECK IN, "A before B" → CHECK on the two dates.',
      'Copies belong to a book and should die with it → ON DELETE CASCADE; a member with loans must not vanish → ON DELETE RESTRICT.',
      'A returned_on that may be absent is a nullable column; its CHECK must tolerate NULL: CHECK (returned_on IS NULL OR returned_on >= loaned_on).',
      'Build parents before children: members and books, then copies (needs books), then loans (needs copies and members).',
    ],
    starterCodeJson: [{ name: 'solution.sql', language: 'sql', code: `-- Lending library schema. Make illegal states impossible.
CREATE TABLE members (
    -- member_id identity PK, full_name, email UNIQUE, joined_on default today
);
CREATE TABLE books (
    -- book_id identity PK, title, isbn UNIQUE
);
CREATE TABLE copies (
    -- copy_id identity PK, book_id FK ON DELETE CASCADE, condition IN (new,good,worn)
);
CREATE TABLE loans (
    -- loan_id identity PK, copy_id FK, member_id FK ON DELETE RESTRICT,
    -- loaned_on, due_on, returned_on nullable
    -- CHECK due_on >= loaned_on ; CHECK returned_on IS NULL OR returned_on >= loaned_on
);

-- sample valid inserts (member, book, copy, loan)` }],
    solutionCodeJson: [{ name: 'solution.sql', language: 'sql', code: `CREATE TABLE members (
    member_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name TEXT NOT NULL,
    email     TEXT NOT NULL UNIQUE,
    joined_on DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE books (
    book_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title   TEXT NOT NULL,
    isbn    TEXT NOT NULL UNIQUE
);

CREATE TABLE copies (
    copy_id   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    book_id   INT NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    condition TEXT NOT NULL CHECK (condition IN ('new', 'good', 'worn'))
);

CREATE TABLE loans (
    loan_id     INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    copy_id     INT NOT NULL REFERENCES copies(copy_id),
    member_id   INT NOT NULL REFERENCES members(member_id) ON DELETE RESTRICT,
    loaned_on   DATE NOT NULL,
    due_on      DATE NOT NULL,
    returned_on DATE,
    CONSTRAINT chk_loan_due     CHECK (due_on >= loaned_on),
    CONSTRAINT chk_loan_return  CHECK (returned_on IS NULL OR returned_on >= loaned_on)
);

INSERT INTO members (full_name, email) VALUES ('Ann', 'ann@lib.io');
INSERT INTO books (title, isbn) VALUES ('SQL Design', '111');
INSERT INTO copies (book_id, condition) VALUES (1, 'good');
INSERT INTO loans (copy_id, member_id, loaned_on, due_on)
VALUES (1, 1, DATE '2026-07-01', DATE '2026-07-15');` }],
    solutionExplanationHtml: `<p>The design translates each sentence of the description into a declarative rule. Every table owns a database-generated surrogate key via <code>GENERATED ALWAYS AS IDENTITY</code>, giving stable foreign-key targets. Uniqueness of real-world identifiers — a member's email, a book's isbn — is enforced with <code>UNIQUE</code>. The enumerated <code>condition</code> becomes <code>CHECK (condition IN ('new','good','worn'))</code>, and the two date-ordering rules become CHECK constraints that make an impossible loan window (returned or due before it was loaned) literally unrepresentable.</p>
<p>The two referential actions encode different intents. <code>copies.book_id ... ON DELETE CASCADE</code> says a copy has no meaning without its book, so removing a title removes its physical copies. <code>loans.member_id ... ON DELETE RESTRICT</code> says loan history must be protected: you cannot delete a member who still has loans, forcing the data to be resolved first. The nullable <code>returned_on</code> models "not yet returned", and its CHECK is written <code>returned_on IS NULL OR returned_on &gt;= loaned_on</code> — the crucial detail, because a plain <code>returned_on &gt;= loaned_on</code> would still pass on NULL (unknown), but writing the null case explicitly documents the intent and stays correct if the column later becomes required. Table creation order follows the dependencies: parents (<code>members</code>, <code>books</code>) before <code>copies</code>, and <code>loans</code> last since it references two parents. The result is a schema where the database itself refuses to hold a contradictory state, which is the entire goal of data-definition work.</p>`,
    diagramMermaid: `erDiagram
  members ||--o{ loans : borrows
  books ||--o{ copies : has
  copies ||--o{ loans : lent_as
  members { int member_id PK }
  books { int book_id PK }
  copies { int copy_id PK }
  loans { int loan_id PK }`,
    _setup: `DROP TABLE IF EXISTS loans, copies, books, members CASCADE;`,
    _check: `\\i /dev/stdin
SELECT count(*) AS members FROM members;
SELECT count(*) AS loans FROM loans;`,
    _extra: `INSERT INTO loans (copy_id, member_id, loaned_on, due_on) VALUES (1,1,DATE '2026-07-01',DATE '2026-06-01');  -- expect chk_loan_due violation
INSERT INTO loans (copy_id, member_id, loaned_on, due_on, returned_on) VALUES (1,1,DATE '2026-07-01',DATE '2026-07-15',DATE '2026-06-15');  -- expect chk_loan_return violation
INSERT INTO copies (book_id, condition) VALUES (1,'damaged');  -- expect condition CHECK violation
INSERT INTO members (full_name, email) VALUES ('Al','ann@lib.io');  -- expect UNIQUE email violation
INSERT INTO loans (copy_id, member_id, loaned_on, due_on) VALUES (999,1,DATE '2026-07-01',DATE '2026-07-15');  -- expect FK violation
DELETE FROM members WHERE member_id = 1;  -- expect RESTRICT violation`,
  },
];

// ---- emit ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VERIFY = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VERIFY, { recursive: true });
const clean = exercises.map(({ _setup, _check, _extra, ...ex }) => ex);
const payload = { trackSlug, moduleSlug, exercises: clean };
const outFile = path.join(OUT, `${trackSlug}__${moduleSlug}.json`);
fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));

let sql = `\\set ON_ERROR_STOP off\n\\pset pager off\n`;
exercises.forEach((ex, i) => {
  const sol = ex.solutionCodeJson.map((f) => f.code).join('\n');
  sql += `\n\\echo '==================== EX ${i + 1}: ${ex.title.replace(/'/g, '')} ===================='\n`;
  sql += (ex._setup || '') + '\n';
  // Ex 10's _check does \i /dev/stdin trick won't work; instead inline solution before checks handled below.
  sql += `\\echo '--- solution ---'\n` + sol + '\n';
  sql += `\\echo '--- checks ---'\n` + (ex._check || '').replace(/^\\i \/dev\/stdin\n/, '') + '\n';
  if (ex._extra) sql += `\\echo '--- extra (expect violations) ---'\n` + ex._extra + '\n';
});
const verifyFile = path.join(VERIFY, `sql-412.sql`);
fs.writeFileSync(verifyFile, sql);

const parsed = JSON.parse(fs.readFileSync(outFile, 'utf8'));
if (parsed.exercises.length !== 10) throw new Error(`expected 10 exercises, got ${parsed.exercises.length}`);
const diffs = ['EASY', 'EASY', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'HARD', 'HARD'];
parsed.exercises.forEach((ex, i) => {
  if (ex.difficulty !== diffs[i]) throw new Error(`slot ${i + 1} difficulty ${ex.difficulty} != ${diffs[i]}`);
  if (ex.problemHtml.length < 900) throw new Error(`problemHtml < 900 for ${ex.title} (${ex.problemHtml.length})`);
  if (ex.solutionExplanationHtml.length < 500) throw new Error(`explanation < 500 for ${ex.title}`);
  if (!Array.isArray(ex.hintsJson) || ex.hintsJson.length < 4) throw new Error(`<4 hints for ${ex.title}`);
});
console.log(`OK ${outFile} ${parsed.exercises.length} exercises`);
console.log(`verify -> ${verifyFile}`);
