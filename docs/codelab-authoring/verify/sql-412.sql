\set ON_ERROR_STOP off
\pset pager off

\echo '==================== EX 1: Create a Products Catalog Table with the Right Types ===================='
DROP TABLE IF EXISTS products CASCADE;
\echo '--- solution ---'
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    sku        TEXT NOT NULL,
    name       TEXT NOT NULL,
    price      NUMERIC(10,2) NOT NULL,
    in_stock   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
\echo '--- checks ---'
\d products
INSERT INTO products (product_id, sku, name, price) VALUES (1,'KB-01','Keyboard',49.90);
SELECT product_id, price, in_stock, (created_at IS NOT NULL) AS ts_set FROM products;
\echo '--- extra (expect violations) ---'
INSERT INTO products (product_id, sku, price) VALUES (2,'MS-02',19.00);  -- expect NOT NULL error on name

\echo '==================== EX 2: Enforce Unique Emails and Sensible Defaults on a Users Table ===================='
DROP TABLE IF EXISTS users CASCADE;
\echo '--- solution ---'
CREATE TABLE users (
    user_id   INT PRIMARY KEY,
    email     TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role      TEXT NOT NULL DEFAULT 'member',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_users_email UNIQUE (email)
);
\echo '--- checks ---'
INSERT INTO users (user_id, email, full_name) VALUES (1,'a@x.io','Ann');
SELECT user_id, role, is_active FROM users;
\echo '--- extra (expect violations) ---'
INSERT INTO users (user_id, email, full_name) VALUES (2,'a@x.io','Al');  -- expect uq_users_email violation
INSERT INTO users (user_id, email, full_name) VALUES (3, NULL, 'No');       -- expect NOT NULL violation

\echo '==================== EX 3: Link Orders to Customers with a Foreign Key ===================='
DROP TABLE IF EXISTS orders, customers CASCADE;
\echo '--- solution ---'
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name        TEXT NOT NULL
);

CREATE TABLE orders (
    order_id    INT PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(customer_id),
    total       NUMERIC(10,2) NOT NULL,
    placed_on   DATE NOT NULL DEFAULT CURRENT_DATE
);
\echo '--- checks ---'
INSERT INTO customers VALUES (1,'Ann');
INSERT INTO orders (order_id, customer_id, total) VALUES (10, 1, 99.00);
SELECT order_id, customer_id, total, (placed_on = CURRENT_DATE) AS today FROM orders;
\echo '--- extra (expect violations) ---'
INSERT INTO orders (order_id, customer_id, total) VALUES (11, 999, 5.00);  -- expect FK violation
DELETE FROM customers WHERE customer_id = 1;                                -- expect FK violation

\echo '==================== EX 4: Guard a Products Table with CHECK Constraints ===================='
DROP TABLE IF EXISTS products CASCADE;
\echo '--- solution ---'
CREATE TABLE products (
    product_id   INT PRIMARY KEY,
    name         TEXT NOT NULL,
    price        NUMERIC(10,2) NOT NULL CHECK (price > 0),
    discount_pct INT NOT NULL DEFAULT 0 CHECK (discount_pct BETWEEN 0 AND 90),
    status       TEXT NOT NULL,
    CONSTRAINT chk_products_status CHECK (status IN ('draft', 'active', 'archived'))
);
\echo '--- checks ---'
INSERT INTO products VALUES (1,'Mug',12.50,10,'active');
SELECT * FROM products;
\echo '--- extra (expect violations) ---'
INSERT INTO products VALUES (2,'Bad',0.00,0,'active');     -- expect price CHECK violation
INSERT INTO products VALUES (3,'Odd',5.00,0,'pending');    -- expect chk_products_status violation
INSERT INTO products VALUES (4,'Big',5.00,95,'active');    -- expect discount_pct CHECK violation

\echo '==================== EX 5: Evolve a Live Employees Table with ALTER TABLE ===================='
DROP TABLE IF EXISTS employees CASCADE;
CREATE TABLE employees (employee_id INT PRIMARY KEY, name TEXT NOT NULL);
INSERT INTO employees VALUES (1,'Ann');
\echo '--- solution ---'
ALTER TABLE employees ADD COLUMN email TEXT;
ALTER TABLE employees ADD CONSTRAINT uq_employees_email UNIQUE (email);

ALTER TABLE employees ADD COLUMN salary NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (salary >= 0);

ALTER TABLE employees ADD COLUMN hired_on DATE NOT NULL DEFAULT CURRENT_DATE;

ALTER TABLE employees RENAME COLUMN name TO full_name;
\echo '--- checks ---'
\d employees
SELECT employee_id, full_name, email, salary, (hired_on = CURRENT_DATE) AS hired_today FROM employees;
\echo '--- extra (expect violations) ---'
INSERT INTO employees (employee_id, full_name, email) VALUES (2,'Al','al@x.io');
INSERT INTO employees (employee_id, full_name, email) VALUES (3,'Ed','al@x.io');  -- expect uq_employees_email violation

\echo '==================== EX 6: Model Many-to-Many Course Enrollments with a Junction Table ===================='
DROP TABLE IF EXISTS enrollments, courses, students CASCADE;
\echo '--- solution ---'
CREATE TABLE students (
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
);
\echo '--- checks ---'
INSERT INTO students VALUES (1,'Ann');
INSERT INTO courses VALUES (100,'DB'),(200,'OS');
INSERT INTO enrollments (student_id, course_id) VALUES (1,100),(1,200);
SELECT * FROM enrollments ORDER BY course_id;
\echo '--- extra (expect violations) ---'
INSERT INTO enrollments (student_id, course_id) VALUES (1,100);   -- expect composite PK violation
INSERT INTO enrollments (student_id, course_id) VALUES (1,999);   -- expect FK violation

\echo '==================== EX 7: Combine a Surrogate Identity Key with a Natural Unique Key ===================='
DROP TABLE IF EXISTS warehouses CASCADE;
\echo '--- solution ---'
CREATE TABLE warehouses (
    id   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    city TEXT NOT NULL
);

INSERT INTO warehouses (code, city) VALUES ('WH-A', 'Hanoi'), ('WH-B', 'Danang');
\echo '--- checks ---'
SELECT id, code, city FROM warehouses ORDER BY id;
\echo '--- extra (expect violations) ---'
INSERT INTO warehouses (code, city) VALUES ('WH-A','Other');       -- expect UNIQUE violation on code
INSERT INTO warehouses (id, code, city) VALUES (99,'WH-C','Hue');  -- expect GENERATED ALWAYS error

\echo '==================== EX 8: Control Deletes with ON DELETE CASCADE and SET NULL ===================='
DROP TABLE IF EXISTS reviews, books, authors CASCADE;
\echo '--- solution ---'
CREATE TABLE authors (
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
);
\echo '--- checks ---'
INSERT INTO authors VALUES (1,'Ann');
INSERT INTO books VALUES (10,'DB Design',1);
INSERT INTO reviews VALUES (100,10,5),(101,10,4);
DELETE FROM authors WHERE author_id = 1;
SELECT book_id, author_id FROM books;                 -- author_id should be NULL
DELETE FROM books WHERE book_id = 10;
SELECT count(*) AS reviews_left FROM reviews;         -- should be 0
\echo '--- extra (expect violations) ---'
INSERT INTO books VALUES (11,'Orphan test',NULL);
INSERT INTO reviews VALUES (200,11,9);                 -- expect rating CHECK violation

\echo '==================== EX 9: Normalize a Denormalized Orders Sheet to Third Normal Form ===================='
DROP TABLE IF EXISTS order_items, orders, products, customers, orders_flat CASCADE;
CREATE TABLE orders_flat (
  line_id INT PRIMARY KEY, order_ref TEXT, customer_name TEXT, customer_email TEXT,
  product_name TEXT, unit_price NUMERIC(10,2), qty INT
);
INSERT INTO orders_flat VALUES
 (1,'ORD-1','Ann','ann@x.io','Keyboard',49.90,1),
 (2,'ORD-1','Ann','ann@x.io','Mouse',19.00,2),
 (3,'ORD-2','Ann','ann@x.io','Monitor',150.00,1),
 (4,'ORD-3','Bob','bob@x.io','Keyboard',49.90,3);
\echo '--- solution ---'
CREATE TABLE customers (
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
JOIN   products p ON p.name      = f.product_name;
\echo '--- checks ---'
SELECT count(*) AS customers FROM customers;   -- expect 2
SELECT count(*) AS products FROM products;     -- expect 3
SELECT count(*) AS orders FROM orders;         -- expect 3
SELECT count(*) AS items FROM order_items;     -- expect 4
-- reconstruction: must reproduce all 4 original lines
SELECT o.order_ref, c.email, p.name AS product, oi.qty
FROM order_items oi
JOIN orders o ON o.order_id = oi.order_id
JOIN customers c ON c.customer_id = o.customer_id
JOIN products p ON p.product_id = oi.product_id
ORDER BY o.order_ref, p.name;

\echo '==================== EX 10: Design the Complete Schema for a Lending Library ===================='
DROP TABLE IF EXISTS loans, copies, books, members CASCADE;
\echo '--- solution ---'
CREATE TABLE members (
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
VALUES (1, 1, DATE '2026-07-01', DATE '2026-07-15');
\echo '--- checks ---'
SELECT count(*) AS members FROM members;
SELECT count(*) AS loans FROM loans;
\echo '--- extra (expect violations) ---'
INSERT INTO loans (copy_id, member_id, loaned_on, due_on) VALUES (1,1,DATE '2026-07-01',DATE '2026-06-01');  -- expect chk_loan_due violation
INSERT INTO loans (copy_id, member_id, loaned_on, due_on, returned_on) VALUES (1,1,DATE '2026-07-01',DATE '2026-07-15',DATE '2026-06-15');  -- expect chk_loan_return violation
INSERT INTO copies (book_id, condition) VALUES (1,'damaged');  -- expect condition CHECK violation
INSERT INTO members (full_name, email) VALUES ('Al','ann@lib.io');  -- expect UNIQUE email violation
INSERT INTO loans (copy_id, member_id, loaned_on, due_on) VALUES (999,1,DATE '2026-07-01',DATE '2026-07-15');  -- expect FK violation
DELETE FROM members WHERE member_id = 1;  -- expect RESTRICT violation
