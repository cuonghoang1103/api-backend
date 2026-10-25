-- ═══════════════════════════════════════════════════════════════════════════
-- CT Shop · Lab 1 — STARTER: build the schema from the ERD
-- Lab 1 — FILE KHỞI ĐẦU: tự viết lược đồ từ ERD
-- cuongthai.com/courses/postgresql · PostgreSQL 17
--
-- 0) Once:   docker exec -it pgdemo psql -U postgres -c "CREATE DATABASE ctshop;"
-- 1) Fill in every TODO below (8 CREATE TABLE statements).
--    Điền mọi chỗ TODO bên dưới (8 câu CREATE TABLE).
-- 2) Run:    docker exec -i pgdemo psql -U postgres -d ctshop < lab1-start.sql
-- 3) Test:   docker exec -i pgdemo psql -U postgres -d ctshop < lab1-check.sql
--    and compare with the expected output in the lesson (so với output mẫu trong bài).
--
-- Rules of the game / Luật chơi:
--   • Column names and types are given — your job is the KEYS and CONSTRAINTS.
--     Tên cột và kiểu đã cho sẵn — việc của bạn là KHOÁ và RÀNG BUỘC.
--   • Let PostgreSQL name the constraints (default names), except the two on customer.email.
--   • Every id: GENERATED ALWAYS AS IDENTITY.
-- ═══════════════════════════════════════════════════════════════════════════
DROP SCHEMA IF EXISTS shop CASCADE;
CREATE SCHEMA shop;
SET search_path = shop;

-- ── 1 · customer ───────────────────────────────────────────────────────────
-- id bigint · email text · full_name text · phone text · city text · created_at timestamptz
-- R1  email is required, unique, always lower-case and looks like a@b.cc
--     → name the two constraints customer_email_key (UNIQUE) and customer_email_check (CHECK)
-- R2  full_name required · phone optional · city required, default 'Hà Nội' · created_at required, default now()
-- TODO: CREATE TABLE customer ( … );


-- ── 2 · category ───────────────────────────────────────────────────────────
-- id int · name text · parent_id int
-- R3  name required and unique
-- R4  a category may have a parent category (root = no parent);
--     a category that still has children must NOT be deletable
-- TODO: CREATE TABLE category ( … );


-- ── 3 · product ────────────────────────────────────────────────────────────
-- id bigint · sku text · name text · category_id int · price numeric(12,2) · stock int
-- attrs jsonb · is_active boolean · created_at timestamptz
-- R5  sku required and unique · name required · belongs to exactly one category
-- R6  price > 0 · stock ≥ 0, default 0 · attrs default '{}' · is_active default true · created_at default now()
-- TODO: CREATE TABLE product ( … );


-- ── 4 · orders ─────────────────────────────────────────────────────────────
-- id bigint · customer_id bigint · status text · created_at timestamptz · note text
-- R7  every order belongs to one existing customer; a customer who has orders cannot be deleted
-- R8  status ∈ {pending, paid, shipped, cancelled}, default 'pending' · note optional
-- TODO: CREATE TABLE orders ( … );


-- ── 5 · order_item ─────────────────────────────────────────────────────────
-- order_id bigint · product_id bigint · qty int · unit_price numeric(12,2)
-- R9  one product appears at most ONCE in an order (no id column — think about the key!)
-- R10 qty > 0 · unit_price > 0 (the price at the moment of purchase)
-- R11 deleting an order deletes its lines · a product that was sold cannot be deleted
-- TODO: CREATE TABLE order_item ( … );


-- ── 6 · payment ────────────────────────────────────────────────────────────
-- id bigint · order_id bigint · amount numeric(12,2) · method text · paid_at timestamptz
-- R12 an order has AT MOST ONE payment · amount > 0
-- R13 method ∈ {cod, card, momo, bank} · paid_at default now()
-- TODO: CREATE TABLE payment ( … );


-- ── 7 · stock_movement ─────────────────────────────────────────────────────
-- id bigint · product_id bigint · change int · reason text · order_id bigint · created_at timestamptz
-- R14 change ≠ 0 · reason ∈ {import, sale, return, adjust}
-- R15 order_id is optional (only sales/returns belong to an order)
-- TODO: CREATE TABLE stock_movement ( … );


-- ── 8 · review ─────────────────────────────────────────────────────────────
-- id bigint · product_id bigint · customer_id bigint · rating smallint · body text · created_at timestamptz
-- R16 rating 1–5 · a customer reviews a product at most once · body optional
-- TODO: CREATE TABLE review ( … );


\dt shop.*
