/**
 * Lab 9 — CT Shop capstone: an API for the mobile app — Node 22 + Prisma 5.22 + Express 5 ↔ PostgreSQL 17 (sau Chương 16). Agent lab9, 26/10/2026.
 * Chèn vào Chương 16 bằng lab/index.mjs (LAB_SAU[16]) — sau bài 16.4, trước quiz. Đề bài đã đặt sẵn ở bài 16.4 + deck pg-16-4 slide 15–18
 * (8 model, 11 CHECK, 3 tiến trình × pool 5 = 15 < 97, khách 42: 1841/1256/1238, doanh thu 01–04/2026: 75 · 64 · 92 · 69 đơn) — lab khớp đúng đề đó.
 * Kiến thức: cả khoá (Ch3 ràng buộc · Ch9–10 chỉ mục/EXPLAIN · Ch11 giao dịch/khoá/deadlock · Ch12 trigger · Ch14 pool/timeout/pg_stat_statements
 * · Ch15 sao lưu · Ch16 Prisma migrate/expand-contract/CONCURRENTLY/checklist). Mới, giảng ngắn trong lab: baseline (migrate diff --from-empty +
 * migrate resolve --applied), directUrl, ALTER DEFAULT PRIVILEGES, Prisma cursor, P2024/P2028/P2034/P2022, autocannon, node:test.
 * Mọi output = chạy THẬT: container nháp postgres:17 (17.11) cổng 5444 như máy người học, DB ctlab9 (lab9-start.sql) + ctlab9_test (dựng từ migration),
 * Node 22.23.3, npm ci từ package-lock.json của app9/. O / F SINH TỰ ĐỘNG từ output thật + mã app9/ (scratchpad lab9/mk9.mjs) — không gõ tay.
 * Mã app: lab/app9/{starter,solution}/ (zip tất định bằng app9/dong-goi.py ⇒ R2 PG/labs/v1/lab9-*.zip).
 * LUẬT escaping như các tệp chương: không backtick trần, ${ trong mã → \${, < > trong mã → esc().
 */
import G from '../giang/pg-lab-9.mjs';

const F_URL = 'https://media.cuongthai.com/files/academy/PG/labs/v1';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const code = (s, lang = 'sql') => `<pre><code class="language-${lang}">${esc(s).split('\n').map((l) => l.replace(lang === 'sql' ? /(--.*)$/ : lang === 'bash' ? /(\s#\s.*)$/ : /(\/\/.*)$/, '<span class="tok-comment">$1</span>')).join('\n')}</code></pre>`;
const out = (s) => `<div class="out">${esc(s)}</div>`;
const card = (href, ico, title, sub, cta) => `<a class="link-card" href="${href}" target="_blank" rel="noopener">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>
  <span class="lc-cta">${cta}</span>
</a>`;
const details = (sum, body) => `<details><summary>${sum}</summary>\n${body}\n</details>`;

/* Output THẬT — sinh từ scratchpad lab9/out/*.txt (mk9.mjs). */
/* O:BEGIN */
const O = {
  C1_ROLES: `Pager usage is off.
CREATE ROLE
ALTER SCHEMA
DO
CREATE ROLE
REVOKE
GRANT
GRANT
GRANT
GRANT
ALTER DEFAULT PRIVILEGES
ALTER DEFAULT PRIVILEGES
ALTER ROLE
ALTER ROLE
ALTER ROLE
ALTER ROLE
ALTER ROLE
     role     | login | super |                                    settings
--------------+-------+-------+--------------------------------------------------------------------------------
 ctshop_app   | t     | f     | {statement_timeout=5s,idle_in_transaction_session_timeout=10s,lock_timeout=3s}
 ctshop_owner | t     | f     | {lock_timeout=5s,statement_timeout=0}
(2 rows)

   tablename    |  tableowner
----------------+--------------
 category       | ctshop_owner
 customer       | ctshop_owner
 order_item     | ctshop_owner
 orders         | ctshop_owner
 payment        | ctshop_owner
 product        | ctshop_owner
 review         | ctshop_owner
 stock_movement | ctshop_owner
(8 rows)`,
  C1_DP: `                                      Access privileges
 Schema |  Name  | Type  |         Access privileges          | Column privileges | Policies
--------+--------+-------+------------------------------------+-------------------+----------
 shop   | orders | table | ctshop_owner=arwdDxtm/ctshop_owner+|                   |
        |        |       | ctshop_app=arwd/ctshop_owner       |                   |
(1 row)`,
  C1_42501: `$ curl -s localhost:3021/health   # this run: PORT=3021 npm run dev
{"status":"ok","db":"ok","db_user":"ctshop_app","pg":"17.11 (Debian 17.11-1.pgdg13+2)","statement_timeout":"0","pool":{"connection_limit":"5","pool_timeout":"10"}}
$ curl -s localhost:3021/products
{"error":"INTERNAL","message":"internal error"}
— terminal of npm run dev —
ctshop-api on http://localhost:3021 · pool { connection_limit: '5', pool_timeout: '10' }
prisma:error
Invalid \`prisma.product.findMany()\` invocation:

Error occurred during query execution:
ConnectorError(ConnectorError { user_facing_error: None, kind: QueryError(PostgresError { code: "42501", message: "permission denied for schema shop", severity: "ERROR", detail: None, column: None, hint: None }), transient: false })
PrismaClientUnknownRequestError:`,
  C2_PULL: `Prisma schema loaded from prisma/schema.prisma
Environment variables loaded from .env
Datasource "db": PostgreSQL database "ctlab9", schema "shop" at "localhost:5444"

- Introspecting based on datasource defined in prisma/schema.prisma
✔ Introspected 8 models and wrote them into prisma/schema.prisma in 842ms

*** WARNING ***

These constraints are not supported by Prisma Client, because Prisma currently does not fully support check constraints. Read more: https://pris.ly/d/check-constraints
  - Model: "customer", constraint: "customer_email_check"
  - Model: "order_item", constraint: "order_item_qty_check"
  - Model: "order_item", constraint: "order_item_unit_price_check"
  - Model: "orders", constraint: "orders_status_check"
  - Model: "payment", constraint: "payment_amount_check"
  - Model: "payment", constraint: "payment_method_check"
  - Model: "product", constraint: "product_price_check"
  - Model: "product", constraint: "product_stock_check"
  - Model: "review", constraint: "review_rating_check"
  - Model: "stock_movement", constraint: "stock_movement_change_check"
  - Model: "stock_movement", constraint: "stock_movement_reason_check"

Run prisma generate to generate Prisma Client.`,
  C2_STATUS0: `Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "ctlab9", schema "shop" at "localhost:5444"

No migration found in prisma/migrations
The current database is not managed by Prisma Migrate.

Read more about how to baseline an existing production database:
https://pris.ly/d/migrate-baseline`,
  C2_GEN: `-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" INTEGER,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT NOT NULL DEFAULT 'Hà Nội',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
…`,
  C2_GEN_TEST: ` check_constraints
-------------------
                 0
(1 row)

INSERT 0 1
INSERT 0 1
INSERT 0 1`,
  C2_RESOLVE: `Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "ctlab9", schema "shop" at "localhost:5444"

Migration 0_init marked as applied.`,
  C2_STATUS1: `Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "ctlab9", schema "shop" at "localhost:5444"

1 migration found in prisma/migrations

Database schema is up to date!`,
  C2_DIFF: `-- This is an empty migration.`,
  C2_REPLAY: `Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "ctlab9_replay", schema "shop" at "localhost:5444"

1 migration found in prisma/migrations

Applying migration \`0_init\`

The following migration(s) have been applied:

migrations/
  └─ 0_init/
    └─ migration.sql

All migrations have been successfully applied.`,
  C2_REPLAY_CHECK: ` check_constraints
-------------------
                11
(1 row)

             tbl              | attidentity
------------------------------+-------------
 shop.category                | a
 shop.customer                | a
 shop.orders                  | a
 shop.payment                 | a
 shop.product                 | a
 shop.review                  | a
 shop.stock_movement          | a
(16 rows — the 9 lines of the _pkey indexes and _prisma_migrations omitted)

INSERT 0 1
ERROR:  new row for relation "product" violates check constraint "product_stock_check"
DETAIL:  Failing row contains (1, T1, t, 1, 1000.00, -5, {}, t, 2026-10-25 22:00:43.675327+00).`,
  C2_REVOKE: `Pager usage is off.
 app_can_delete_history
------------------------
 t
(1 row)

REVOKE
 app_can_delete_history
------------------------
 f
(1 row)`,
  C3_500: `$ curl -s localhost:3021/products
{"error":"INTERNAL","message":"internal error"}
ctshop-api on http://localhost:3021 · pool { connection_limit: '5', pool_timeout: '10' }
TypeError: Do not know how to serialize a BigInt`,
  C3_CURL: `$ curl -s 'localhost:3009/health'
{"status":"ok","db":"ok","db_user":"ctshop_app","pg":"17.11 (Debian 17.11-1.pgdg13+2)","statement_timeout":"5s","pool":{"connection_limit":"5","pool_timeout":"10"}}
$ curl -s 'localhost:3009/products?limit=3'
{"items":[{"id":"48","sku":"CT1206","name":"Bộ đề luyện thi PE/FE (bản in)","price":"49000","stock":249,"category":{"name":"Giáo trình IT"}},{"id":"47","sku":"CT1205","name":"Cấu trúc dữ liệu & giải thuật","price":"125000","stock":87,"category":{"name":"Giáo trình IT"}},{"id":"46","sku":"CT1204","name":"Sổ tay SQL bỏ túi","price":"59000","stock":224,"category":{"name":"Giáo trình IT"}}],"next":"46"}
$ curl -s 'localhost:3009/products?limit=3&before=46'
{"items":[{"id":"45","sku":"CT1203","name":"Sách Clean Code (bản tiếng Việt)","price":"179000","stock":162,"category":{"name":"Giáo trình IT"}},{"id":"44","sku":"CT1202","name":"Giáo trình Lập trình Java căn bản","price":"95000","stock":249,"category":{"name":"Giáo trình IT"}},{"id":"43","sku":"CT1201","name":"Giáo trình Cơ sở dữ liệu (bản in)","price":"89000","stock":137,"category":{"name":"Giáo trình IT"}}],"next":"43"}
$ curl -s 'localhost:3009/products?q=casio&limit=2'
{"items":[{"id":"35","sku":"CT1005","name":"Máy tính Casio MX-12B (văn phòng)","price":"195000","stock":110,"category":{"name":"Máy tính cầm tay"}},{"id":"34","sku":"CT1004","name":"Máy tính Casio FX-880BTG","price":"790000","stock":79,"category":{"name":"Máy tính cầm tay"}}],"next":"34"}
$ curl -s 'localhost:3009/products/abc'
{"error":"BAD_INPUT","message":"id must be a whole number"}`,
  C3_KEYSET: `page 1 (offset 0)        : 6, 4
… a new product arrives  : 7
page 2 (offset 2)        : 4, 3   ← 4 again
page 2 (keyset id < 4)  : 3, 2`,
  C3_LOG: `prisma:query 15ms SELECT "shop"."orders"."id", "shop"."orders"."status", "shop"."orders"."created_at", "shop"."orders"."note", "shop"."orders"."customer_id" FROM "shop"."orders" WHERE ("shop"."orders"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3 [1841,1,0]
prisma:query 16ms SELECT "shop"."customer"."id", "shop"."customer"."full_name" FROM "shop"."customer" WHERE "shop"."customer"."id" IN ($1) OFFSET $2 [42,0]
prisma:query 5ms SELECT "shop"."order_item"."order_id", "shop"."order_item"."product_id", "shop"."order_item"."qty", "shop"."order_item"."unit_price" FROM "shop"."order_item" WHERE "shop"."order_item"."order_id" IN ($1) ORDER BY "shop"."order_item"."product_id" ASC OFFSET $2 [1841,0]
prisma:query 6ms SELECT "shop"."product"."id", "shop"."product"."sku", "shop"."product"."name" FROM "shop"."product" WHERE "shop"."product"."id" IN ($1,$2) OFFSET $3 [2,34,0]
prisma:query 8ms SELECT "shop"."payment"."id", "shop"."payment"."amount", "shop"."payment"."method", "shop"."payment"."paid_at", "shop"."payment"."order_id" FROM "shop"."payment" WHERE "shop"."payment"."order_id" IN ($1) OFFSET $2 [1841,0]`,
  C3_N1: `✗ loop: findMany + findMany/order + findUnique/line  68 SQL   838 ms  → 20 orders, first total 2604000
✓ nested select (orders → order_item → product)   3 SQL   111 ms  → 20 orders, first total 2604000
✓ one $queryRaw with json_agg                  1 SQL    22 ms  → 20 orders, first total 2604000.00`,
  C3_TIEN: `Number : 59000 * 1.08          = 63720.00000000001 | === 63720 ? false
Decimal: 59000.times("1.08")   = 63720 | equals 63720 ? true
Number : 0.1 + 0.2             = 0.30000000000000004
JSON of a Decimal              = {"price":"59000"}
     float8_sum      | numeric_sum |    float8_vat     | numeric_vat
---------------------+-------------+-------------------+-------------
 0.30000000000000004 |         0.3 | 63720.00000000001 |    63720.00
(1 row)`,
  C4_DEV: `Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "ctlab9", schema "shop" at "localhost:5444"

Error: P3014

Prisma Migrate could not create the shadow database. Please make sure the database user has permission to create databases. Read more about the shadow database (and workarounds) at https://pris.ly/d/migrate-shadow

Original error:
ERROR: permission denied to create database
   0: schema_core::state::DevDiagnostic
             at schema-engine/core/src/state.rs:276`,
  C4_DIFF: `-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "delivery_note" TEXT;`,
  C4_DEPLOY: `Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "ctlab9", schema "shop" at "localhost:5444"

2 migrations found in prisma/migrations

Applying migration \`20261026090000_expand_delivery_note\`

The following migration(s) have been applied:

migrations/
  └─ 20261026090000_expand_delivery_note/
    └─ migration.sql

All migrations have been successfully applied.`,
  C4_V1: `$ curl -s localhost:3009/orders/2016   # v1, still running
{"id":"2016","status":"shipped","created_at":"2023-01-01T01:56:03.840Z","note":"Để ở phòng bảo vệ","customer":{"id":"23","full_name":"Bùi Gia Dũng"},"order_item":[{"qty":1,"unit_price":"5000","product":{"id":"1","sku":"CT0501","name":"Bút bi Thiên Long TL-027 (xanh)"}}],"payment":{"amount":"5000","method":"cod","paid_at":"2023-01-01T03:56:03.840Z"},"total":"5000"}
$ curl -s -X POST localhost:3009/orders -H "content-type: application/json" -d '{"customer_id": 42, "items": [{"product_id": 4, "qty": 1}], "note": "Giao giờ hành chính"}'   # v1 writes "note"
{"id":"302001","status":"pending","created_at":"2026-10-25T22:09:52.155Z","items":1,"total":"28000"}
   id   |        note         |    delivery_note
--------+---------------------+---------------------
   2016 | Để ở phòng bảo vệ   | Để ở phòng bảo vệ
 302001 | Giao giờ hành chính | Giao giờ hành chính
(2 rows)

 note  | delivery_note
-------+---------------
 37501 |         37501
(1 row)`,
  C4_V2: `$ curl -s -X POST localhost:3010/orders -H "content-type: application/json" -d '{"customer_id": 42, "items": [{"product_id": 4, "qty": 1}], "delivery_note": "Gọi trước khi giao"}'   # v2 writes "delivery_note"
{"id":"302002","status":"pending","created_at":"2026-10-25T22:10:15.927Z","items":1,"total":"28000"}
$ curl -s localhost:3009/orders/302002   # v1 reads it through "note"
{"id":"302002","status":"pending","created_at":"2026-10-25T22:10:15.927Z","note":"Gọi trước khi giao","customer":{"id":"42","full_name":"Lê Văn Chi"},"order_item":[{"qty":1,"unit_price":"28000","product":{"id":"4","sku":"CT0504","name":"Bút gel Uni-ball Signo 0.5mm"}}],"payment":null,"total":"28000"}
$ curl -s localhost:3010/orders/302001   # v2 reads what v1 wrote
{"id":"302001","status":"pending","created_at":"2026-10-25T22:09:52.155Z","delivery_note":"Giao giờ hành chính","customer":{"id":"42","full_name":"Lê Văn Chi"},"order_item":[{"qty":1,"unit_price":"28000","product":{"id":"4","sku":"CT0504","name":"Bút gel Uni-ball Signo 0.5mm"}}],"payment":null,"total":"28000"}`,
  C4_CDIFF: `-- AlterTable
ALTER TABLE "orders" DROP COLUMN "note";`,
  C4_CDEPLOY: `Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "ctlab9", schema "shop" at "localhost:5444"

3 migrations found in prisma/migrations

Applying migration \`20261026093000_contract_drop_note\`

The following migration(s) have been applied:

migrations/
  └─ 20261026093000_contract_drop_note/
    └─ migration.sql

All migrations have been successfully applied.`,
  C4_P2022: `$ curl -s localhost:3009/orders/1841   # a v1 instance that was NOT stopped first
{"error":"INTERNAL","message":"internal error"}
— terminal of the v1 process —
PrismaClientKnownRequestError:
Invalid \`prisma.orders.findUnique()\` invocation:

The column \`orders.note\` does not exist in the current database.
  code: 'P2022',
  meta: { modelName: 'orders', column: 'orders.note' }`,
  C5_CURL: `$ curl -s -X POST localhost:3009/orders -H 'content-type: application/json' -d '{"customer_id": 42, "items": [{"product_id": 30, "qty": 1}, {"product_id": 4, "qty": 2}, {"product_id": 4, "qty": 1}], "delivery_note": "Giao giờ hành chính"}'
{"id":"302003","status":"pending","created_at":"2026-10-25T22:29:10.630Z","items":2,"total":"674000"}
$ curl -s -X POST localhost:3009/orders -H 'content-type: application/json' -d '{"customer_id": 42, "items": [{"product_id": 4, "qty": 1}, {"product_id": 30, "qty": 500}]}'
{"error":"BAD_CART","message":"every line needs a product_id and a qty between 1 and 100"}  ← HTTP 400
$ curl -s -X POST localhost:3009/orders/302003/pay -H 'content-type: application/json' -d '{"method": "card"}'
{"id":"277377","order_id":"302003","amount":"674000","method":"card","paid_at":"2026-10-25T22:29:11.053Z","gateway_ref":"GW-302003-card"}  ← HTTP 201 in 0.358756s
$ curl -s -X POST localhost:3009/orders/302003/pay -H 'content-type: application/json' -d '{"method": "card"}'   # again
{"error":"NOT_PENDING","message":"order 302003 is paid"}  ← HTTP 409
$ curl -s 'localhost:3009/orders/302003'
{"id":"302003","status":"paid","created_at":"2026-10-25T22:29:10.630Z","delivery_note":"Giao giờ hành chính","customer":{"id":"42","full_name":"Lê Văn Chi"},"order_item":[{"qty":3,"unit_price":"28000","product":{"id":"4","sku":"CT0504","name":"Bút gel Uni-ball Signo 0.5mm"}},{"qty":1,"unit_price":"590000","product":{"id":"30","sku":"CT0906","name":"Sổ tay Moleskine Classic A5"}}],"payment":{"amount":"674000","method":"card","paid_at":"2026-10-25T22:29:11.053Z"},"total":"674000"}
$ curl -s -X POST localhost:3009/orders -H 'content-type: application/json' -d '{"customer_id": 42, "items": [{"product_id": 4, "qty": 1}, {"product_id": 34, "qty": 90}]}'
{"error":"OUT_OF_STOCK","message":"Máy tính Casio FX-880BTG: 79 left, 90 wanted","product_id":34}  ← HTTP 409`,
  C5_DBTEST: `Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "ctlab9_test", schema "shop" at "localhost:5444"

3 migrations found in prisma/migrations

Applying migration \`0_init\`
Applying migration \`20261026090000_expand_delivery_note\`
Applying migration \`20261026093000_contract_drop_note\`

The following migration(s) have been applied:

migrations/
  └─ 0_init/
    └─ migration.sql
  └─ 20261026090000_expand_delivery_note/
    └─ migration.sql
  └─ 20261026093000_contract_drop_note/
    └─ migration.sql

All migrations have been successfully applied.
✓ ctlab9_test: migrations applied, fixture = 2 categories · 6 products · 20 customers`,
  C5_RACE: `── 1 · read-modify-write, stock = 1, two buyers
[ '✓ order 1', '✓ order 2' ]
   stock now 0 · orders for it: 2 ⇒ two units sold, one taken from stock
── 2 · atomic UPDATE … WHERE stock >= qty, stock = 1, two buyers
[ '✓ order 4', '✗ OUT_OF_STOCK Bút gel còn 1 cây: 0 left, 1 wanted' ]
   stock now 0
── 3a · carts in opposite order, NOT sorted, no retry
[
  '✓ order 6',
  '✗ PrismaClientUnknownRequestError (no code) · 40P01 deadlock detected'
]
── 3b · the same carts, NOT sorted, with retry
checkout: collision (40P01) — retry 1/2
[ '✓ order 9', '✓ order 8' ]
── 3c · the same carts, sorted by product_id (the default)
[ '✓ order 11', '✓ order 10' ] 842 ms — the second simply waited`,
  C5_ERR: `class: PrismaClientUnknownRequestError · code: undefined · meta: undefined · has 40P01: true
Transaction failed due to a write conflict or a deadlock. Please retry your transaction
fulfilled
rejected class: PrismaClientKnownRequestError · code: P2034 · Transaction failed due to a write conflict or a deadlock. Please retry your transaction`,
  C6_MAX: ` max_connections
-----------------
 100
(1 row)

 superuser_reserved_connections
--------------------------------
 3
(1 row)

 client_connections
--------------------
                  1
(1 row)`,
  C6_HOLD: `pg_stat_activity (ctshop-load) mid-run: idle in transaction=5
HOLD (gateway inside the transaction) · connection_limit=5 pool_timeout=2s · 50 clients · 400 payments
  status codes: 201×280 503×120
  latency p50 2160 ms · p99 2292 ms · max 2307 ms · 22.23 req/s · 18.0 s
  paid in the database: 280 / 400`,
  C6_HOLD20: `pg_stat_activity (ctshop-load) mid-run: idle in transaction=20
HOLD (gateway inside the transaction) · connection_limit=20 pool_timeout=2s · 50 clients · 400 payments
  status codes: 201×400
  latency p50 707 ms · p99 1003 ms · max 1003 ms · 57.15 req/s · 7.0 s
  paid in the database: 400 / 400`,
  C6_SHORT: `pg_stat_activity (ctshop-load) mid-run: idle=1 · idle in transaction=4
SHORT (gateway outside) · connection_limit=5 pool_timeout=2s · 50 clients · 400 payments
  status codes: 201×400
  latency p50 327 ms · p99 406 ms · max 413 ms · 133.34 req/s · 3.0 s
  paid in the database: 400 / 400`,
  C7_REPORT: `{"from":"2025-09-30T17:00:00.000Z","to":"2026-09-30T17:00:00.000Z","months":[
  {"thang":"2025-10","so_don":78,"doanh_thu":"40043000.00","luy_ke":"40043000.00","tang_pct":null},
  {"thang":"2025-11","so_don":87,"doanh_thu":"50818000.00","luy_ke":"90861000.00","tang_pct":"26.9"},
  {"thang":"2025-12","so_don":78,"doanh_thu":"40243000.00","luy_ke":"131104000.00","tang_pct":"-20.8"},
  {"thang":"2026-01","so_don":75,"doanh_thu":"48698000.00","luy_ke":"179802000.00","tang_pct":"21.0"},
  {"thang":"2026-02","so_don":64,"doanh_thu":"31046000.00","luy_ke":"210848000.00","tang_pct":"-36.2"},
  {"thang":"2026-03","so_don":92,"doanh_thu":"63914000.00","luy_ke":"274762000.00","tang_pct":"105.9"},
  {"thang":"2026-04","so_don":69,"doanh_thu":"37252000.00","luy_ke":"312014000.00","tang_pct":"-41.7"},
  {"thang":"2026-05","so_don":73,"doanh_thu":"49290000.00","luy_ke":"361304000.00","tang_pct":"32.3"},
  {"thang":"2026-06","so_don":81,"doanh_thu":"40587000.00","luy_ke":"401891000.00","tang_pct":"-17.7"},
  {"thang":"2026-07","so_don":99,"doanh_thu":"60560000.00","luy_ke":"462451000.00","tang_pct":"49.2"},
  {"thang":"2026-08","so_don":80,"doanh_thu":"37315000.00","luy_ke":"499766000.00","tang_pct":"-38.4"},
  {"thang":"2026-09","so_don":80,"doanh_thu":"42485000.00","luy_ke":"542251000.00","tang_pct":"13.9"}
]}`,
  C7_LOG: `prisma:query 19ms
      WITH m AS (
        SELECT date_trunc('month', paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh') AS thang,
               count(*) AS so_don, sum(amount) AS doanh_thu
        FROM payment
        WHERE paid_at >= $1 AND paid_at < $2
        GROUP BY 1
      )
      SELECT to_char(thang, 'YYYY-MM') AS thang, so_don::int AS so_don, doanh_thu::text AS doanh_thu,
             (sum(doanh_thu) OVER (ORDER BY thang))::text AS luy_ke,
             round(100 * (doanh_thu / lag(doanh_thu) OVER (ORDER BY thang) - 1), 1)::text AS tang_pct
      FROM m
      ORDER BY thang ["2025-09-30 17:00:00 UTC","2026-09-30 17:00:00 UTC"]`,
  C7_CURSOR: `prisma:query 12ms SELECT "orders"."id", "orders"."status", "orders"."created_at" FROM "orders" WHERE ("orders"."customer_id" = $1 AND (("orders"."created_at" = (SELECT "orders"."created_at" FROM "orders" WHERE ("orders"."id") = ($2)) AND "orders"."id" <= (SELECT "orders"."id" FROM "orders" WHERE ("orders"."id") = ($3))) OR ("orders"."created_at" < (SELECT "orders"."created_at" FROM "orders" WHERE ("orders"."id") = ($4))))) ORDER BY "orders"."created_at" DESC, "orders"."id" DESC LIMIT $5 OFFSET $6 [42,1238,1238,1238,4,1]`,
  C7_EXPLAIN_TRUOC: `                                                                               QUERY PLAN
------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 Sort (actual time=52.250..52.252 rows=12 loops=1)
   Sort Key: (to_char((date_trunc('month'::text, (payment.paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'::text))), 'YYYY-MM'::text))
   Sort Method: quicksort  Memory: 25kB
   Buffers: shared hit=2318
   ->  WindowAgg (actual time=52.097..52.221 rows=12 loops=1)
         Buffers: shared hit=2315
         ->  GroupAggregate (actual time=51.991..52.113 rows=12 loops=1)
               Group Key: (date_trunc('month'::text, (payment.paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'::text)))
               Buffers: shared hit=2315
               ->  Sort (actual time=51.962..52.011 rows=956 loops=1)
                     Sort Key: (date_trunc('month'::text, (payment.paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'::text)))
                     Sort Method: quicksort  Memory: 54kB
                     Buffers: shared hit=2315
                     ->  Seq Scan on payment (actual time=0.019..51.841 rows=956 loops=1)
                           Filter: ((paid_at >= '2025-10-01 00:00:00+07'::timestamp with time zone) AND (paid_at < '2026-10-01 00:00:00+07'::timestamp with time zone))
                           Rows Removed by Filter: 276420
                           Buffers: shared hit=2312
 Planning:
   Buffers: shared hit=126
 Planning Time: 0.444 ms
 Execution Time: 52.329 ms
(21 rows)

                                  QUERY PLAN
------------------------------------------------------------------------------
 Limit (actual time=20.777..20.779 rows=11 loops=1)
   Buffers: shared hit=2860
   ->  Sort (actual time=20.772..20.773 rows=11 loops=1)
         Sort Key: created_at DESC, id DESC
         Sort Method: top-N heapsort  Memory: 26kB
         Buffers: shared hit=2860
         ->  Seq Scan on orders (actual time=0.026..20.365 rows=1157 loops=1)
               Filter: (customer_id = 42)
               Rows Removed by Filter: 300845
               Buffers: shared hit=2854
 Planning:
   Buffers: shared hit=48
 Planning Time: 0.173 ms
 Execution Time: 20.797 ms
(14 rows)`,
  C7_EXPLAIN_SAU: `                                                                                    QUERY PLAN
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 Sort (actual time=0.794..0.796 rows=12 loops=1)
   Sort Key: (to_char((date_trunc('month'::text, (payment.paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'::text))), 'YYYY-MM'::text))
   Sort Method: quicksort  Memory: 25kB
   Buffers: shared hit=25
   ->  WindowAgg (actual time=0.640..0.774 rows=12 loops=1)
         Buffers: shared hit=22
         ->  GroupAggregate (actual time=0.557..0.675 rows=12 loops=1)
               Group Key: (date_trunc('month'::text, (payment.paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'::text)))
               Buffers: shared hit=22
               ->  Sort (actual time=0.533..0.579 rows=956 loops=1)
                     Sort Key: (date_trunc('month'::text, (payment.paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'::text)))
                     Sort Method: quicksort  Memory: 54kB
                     Buffers: shared hit=22
                     ->  Bitmap Heap Scan on payment (actual time=0.069..0.406 rows=956 loops=1)
                           Recheck Cond: ((paid_at >= '2025-10-01 00:00:00+07'::timestamp with time zone) AND (paid_at < '2026-10-01 00:00:00+07'::timestamp with time zone))
                           Heap Blocks: exact=14
                           Buffers: shared hit=19
                           ->  Bitmap Index Scan on payment_paid_at_idx (actual time=0.035..0.035 rows=956 loops=1)
                                 Index Cond: ((paid_at >= '2025-10-01 00:00:00+07'::timestamp with time zone) AND (paid_at < '2026-10-01 00:00:00+07'::timestamp with time zone))
                                 Buffers: shared hit=5
 Planning:
   Buffers: shared hit=163 read=1
 Planning Time: 0.506 ms
 Execution Time: 0.865 ms
(24 rows)

                                                    QUERY PLAN
------------------------------------------------------------------------------------------------------------------
 Limit (actual time=0.038..0.057 rows=11 loops=1)
   Buffers: shared hit=15
   ->  Index Scan using orders_customer_id_created_at_id_idx on orders (actual time=0.037..0.055 rows=11 loops=1)
         Index Cond: (customer_id = 42)
         Buffers: shared hit=15
 Planning:
   Buffers: shared hit=61 read=1
 Planning Time: 0.139 ms
 Execution Time: 0.063 ms
(9 rows)`,
  C7_DIFF: `-- CreateIndex
CREATE INDEX "orders_customer_id_created_at_id_idx" ON "orders"("customer_id", "created_at" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "payment_paid_at_idx" ON "payment"("paid_at");`,
  C7_LOCK: `-- psql, as ctshop_owner:  BEGIN; CREATE INDEX orders_demo_idx ON shop.orders (customer_id);  … not committed yet
$ curl -s -X POST localhost:3009/orders -H 'content-type: application/json' -d '{"customer_id": 42, "items": [{"product_id": 4, "qty": 1}]}'
-- one second later, pg_locks (superuser):
 pid |   usename    |       mode       | granted |  waits  |                    query
-----+--------------+------------------+---------+---------+----------------------------------------------
 395 | ctshop_owner | ShareLock        | t       | Timeout | SELECT pg_sleep(6)
 397 | ctshop_app   | RowExclusiveLock | f       | Lock    | INSERT INTO "shop"."orders" ("customer_id","
(2 rows)
-- the curl answers:
{"error":"LOCK_TIMEOUT","message":"the table is locked (a migration?) — try again"}
HTTP 503 after 3.102954s`,
  C7_DEPLOY: `Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "ctlab9", schema "shop" at "localhost:5444"

5 migrations found in prisma/migrations

Applying migration \`20261026100000_orders_customer_created_idx\`
Applying migration \`20261026100100_payment_paid_at_idx\`

The following migration(s) have been applied:

migrations/
  └─ 20261026100000_orders_customer_created_idx/
    └─ migration.sql
  └─ 20261026100100_payment_paid_at_idx/
    └─ migration.sql

All migrations have been successfully applied.`,
  C7_DIFF_SAU: `-- This is an empty migration.`,
  C7_N1_SAU: `✗ loop: findMany + findMany/order + findUnique/line  66 SQL   690 ms  → 20 orders, first total 28000
✓ nested select (orders → order_item → product)   3 SQL    39 ms  → 20 orders, first total 28000
✓ one $queryRaw with json_agg                  1 SQL     7 ms  → 20 orders, first total 28000.00`,
  C7_MYORDERS: `{"items":[{"id":"302002","status":"pending","created_at":"2026-10-25T22:10:15.927Z","payment":null,"lines":1,"total":"28000"},{"id":"302001","status":"pending","created_at":"2026-10-25T22:09:52.155Z","payment":null,"lines":1,"total":"28000"},{"id":"1841","status":"shipped","created_at":"2026-05-16T00:13:00.000Z","payment":{"method":"card"},"lines":2,"total":"2604000"}],"next":"1841"}`,
  C8_TEST: `> ctshop-api@1.0.0 test
> node --env-file=.env scripts/dung-db-kiem-thu.js && node --env-file=.env --test --test-concurrency=1 --test-reporter=spec test/*.test.js
Applying migration \`0_init\`
Applying migration \`20261026090000_expand_delivery_note\`
Applying migration \`20261026093000_contract_drop_note\`
Applying migration \`20261026100000_orders_customer_created_idx\`
Applying migration \`20261026100100_payment_paid_at_idx\`
The following migration(s) have been applied:
migrations/
  └─ 0_init/
    └─ migration.sql
  └─ 20261026090000_expand_delivery_note/
    └─ migration.sql
  └─ 20261026093000_contract_drop_note/
    └─ migration.sql
  └─ 20261026100000_orders_customer_created_idx/
    └─ migration.sql
  └─ 20261026100100_payment_paid_at_idx/
    └─ migration.sql

All migrations have been successfully applied.
✓ ctlab9_test: migrations applied, fixture = 2 categories · 6 products · 20 customers
✔ GET /health — up, as ctshop_app, with the role timeout (89.751875ms)
✔ GET /products — keyset pages: newest first, no overlap, ids are strings (90.273709ms)
✔ POST /orders — order + lines + stock in one go, price taken at the moment of buying (176.141209ms)
✔ POST /orders — out of stock ⇒ 409 and NOTHING is written (69.21075ms)
✔ two buyers, one last unit ⇒ exactly one order (74.404917ms)
✔ POST /orders/:id/pay — pays once, refuses the second time (447.101666ms)
✔ GET /reports/revenue — months in Vietnamese time, running total, growth (87.426375ms)
✔ the app role cannot change the schema (28.889ms)
ℹ tests 8
ℹ suites 0
ℹ pass 8
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1364.023584`,
  C9_KT: `Pager usage is off.
                  muc                   |                   gia_tri                    | dat
----------------------------------------+----------------------------------------------+-----
 1 kết nối đang dùng / max              | 2 / 100                                      | ✓
 2 giao dịch già nhất                   | không có                                     | ✓
 3 idle_in_transaction_session_timeout  | 0                                            | ✗
 4 statement_timeout (máy chủ / role)   | 0 / statement_timeout=5s,statement_timeout=0 | ✓
 5 pg_stat_statements đã nạp            | (trống)                                      | ✗
 6 log_min_duration_statement (ms)      | -1                                           | ✗
 7 log_lock_waits                       | off                                          | ✗
 8 khoá ngoại không có chỉ mục          | 6                                            | ✗
 9 bảng có > 20% dòng chết              | 0                                            | ✓
 10 replication slot bỏ rơi             | 0                                            | ✓
 11 age(datfrozenxid) lớn nhất          | 2285                                         | ✓
 12 chỉ mục INVALID (CONCURRENTLY hỏng) | 0                                            | ✓
(12 rows)`,
  C9_KT_APP: `Pager usage is off.
                  muc                   |                     gia_tri                     | dat
----------------------------------------+-------------------------------------------------+-----
 1 kết nối đang dùng / max              | 2 / 100                                         | ✓
 2 giao dịch già nhất                   | không có                                        | ✓
 3 idle_in_transaction_session_timeout  | 10000                                           | ✓
 4 statement_timeout (máy chủ / role)   | 5000 / statement_timeout=5s,statement_timeout=0 | ✓
 5 pg_stat_statements đã nạp            | (trống)                                         | ✗
 6 log_min_duration_statement (ms)      | -1                                              | ✗
 7 log_lock_waits                       | off                                             | ✗
 8 khoá ngoại không có chỉ mục          | 6                                               | ✗
 9 bảng có > 20% dòng chết              | 0                                               | ✓
 10 replication slot bỏ rơi             | 0                                               | ✓
 11 age(datfrozenxid) lớn nhất          | 2285                                            | ✓
 12 chỉ mục INVALID (CONCURRENTLY hỏng) | 0                                               | ✓
(12 rows)`,
  C9_SUA: `ALTER SYSTEM
ALTER SYSTEM
ALTER SYSTEM
            name            | setting | pending_restart
----------------------------+---------+-----------------
 log_lock_waits             | off     | f
 log_min_duration_statement | -1      | f
 shared_preload_libraries   |         | f
(3 rows)

$ docker restart pgdemo
pgdemo
$ docker exec pgdemo psql -U postgres -d ctlab9 -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements"
CREATE EXTENSION`,
  C9_KT_SAU: `Pager usage is off.
                  muc                   |                   gia_tri                    | dat
----------------------------------------+----------------------------------------------+-----
 1 kết nối đang dùng / max              | 1 / 100                                      | ✓
 2 giao dịch già nhất                   | không có                                     | ✓
 3 idle_in_transaction_session_timeout  | 0                                            | ✗
 4 statement_timeout (máy chủ / role)   | 0 / statement_timeout=5s,statement_timeout=0 | ✓
 5 pg_stat_statements đã nạp            | pg_stat_statements                           | ✓
 6 log_min_duration_statement (ms)      | 250                                          | ✓
 7 log_lock_waits                       | on                                           | ✓
 8 khoá ngoại không có chỉ mục          | 6                                            | ✗
 9 bảng có > 20% dòng chết              | 0                                            | ✓
 10 replication slot bỏ rơi             | 0                                            | ✓
 11 age(datfrozenxid) lớn nhất          | 2286                                         | ✓
 12 chỉ mục INVALID (CONCURRENTLY hỏng) | 0                                            | ✓
(12 rows)`,
  C9_TOP: `Pager usage is off.
 calls | total_ms | mean_ms | rows |                                 query
-------+----------+---------+------+------------------------------------------------------------------------
    25 |   5066.4 |  202.66 |  360 | WITH m AS ( SELECT date_trunc($3, paid_at AT TIME ZONE $4) AS thang, c
    20 |    222.2 |   11.11 |  184 | SELECT "shop"."payment"."id", "shop"."payment"."method", "shop"."payme
    20 |    203.4 |   10.17 |  517 | SELECT "shop"."order_item"."order_id", "shop"."order_item"."product_id
    20 |    149.5 |    7.48 |  220 | SELECT "shop"."orders"."id", "shop"."orders"."status", "shop"."orders"
    20 |     31.0 |    1.55 |  260 | SELECT "shop"."product"."id", "shop"."product"."sku", "shop"."product"
    20 |      2.1 |    0.11 |   20 | SELECT "shop"."orders"."id", "shop"."orders"."status", "shop"."orders"
(6 rows)`,
  C9_RESTORE: `$ docker exec pgdemo pg_dump -U postgres -Fc -d ctlab9 -f /tmp/ctlab9.dump
$ docker exec pgdemo ls -l /tmp/ctlab9.dump
-rw-r--r-- 1 root root 8714443 Oct 25 22:20 /tmp/ctlab9.dump
$ docker exec pgdemo createdb -U postgres -O ctshop_owner ctlab9_restore
$ docker exec pgdemo pg_restore -U postgres -d ctlab9_restore /tmp/ctlab9.dump`,
  C9_DEM: `Pager usage is off.
       table        |     rows
--------------------+--------------
 category           |           12
 customer           |          300
 product            |           48
 orders             |       302002
 order_item         |       605002
 payment            |       277376
 stock_movement     |          429
 review             |          678
 _prisma_migrations |            5
 sum(stock)         |         7437
 sum(amount)        | 125303936000
(11 rows)`,
  C9_STATUS: `Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "ctlab9_restore", schema "shop" at "localhost:5444"

5 migrations found in prisma/migrations

Database schema is up to date!`,
  C9_ACL: `    datname     |                                datacl
----------------+-----------------------------------------------------------------------
 ctlab9         | {postgres=CTc/postgres,ctshop_owner=c/postgres,ctshop_app=c/postgres}
 ctlab9_restore |
 ctlab9_test    | {ctshop_owner=CTc/ctshop_owner,ctshop_app=c/ctshop_owner}
(3 rows)`,
  C9_APP: `$ curl -s localhost:3011/orders/1841
{"id":"1841","status":"shipped","created_at":"2026-05-16T00:13:00.000Z","delivery_note":null,"customer":{"id":"42","full_name":"Lê Văn Chi"},"order_item":[{"qty":3,"unit_price":"78000","product":{"id":"2","sku":"CT0502","name":"Bút bi Thiên Long TL-079 (hộp 20 cây)"}},{"qty":3,"unit_price":"790000","product":{"id":"34","sku":"CT1004","name":"Máy tính Casio FX-880BTG"}}],"payment":{"amount":"2604000","method":"card","paid_at":"2026-05-16T02:13:00.000Z"},"total":"2604000"}`,
};
/* O:END */

/* Mã nguồn app — sinh từ lab/app9/{solution,starter} (mk9.mjs). */
/* F:BEGIN */
const F = {
  ROLES: `-- 1 · the owner: owns schema shop and every table in it; \`prisma migrate deploy\` logs in as this role
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
ALTER ROLE ctshop_owner SET statement_timeout = 0;                      -- … but an index build may take minutes`,
  ENV: `# Copy to .env and adjust host/port/passwords.  macOS/Linux: cp .env.example .env   ·  Windows (PowerShell): Copy-Item .env.example .env
# Chép thành .env rồi sửa host/cổng/mật khẩu cho khớp máy bạn. KHÔNG commit .env.

# The APP connects as ctshop_app (rows only). Pool: 5 connections per process, wait at most 10 s for one.
# Ứng dụng kết nối bằng ctshop_app (chỉ đụng vào dòng). Pool: 5 kết nối mỗi tiến trình, chờ tối đa 10 giây.
DATABASE_URL="postgresql://ctshop_app:app-lab9@localhost:5444/ctlab9?schema=shop&connection_limit=5&pool_timeout=10&application_name=ctshop-api"

# The Prisma CLI (db pull, migrate deploy/status/resolve, migrate diff) uses directUrl ⇒ the OWNER role.
# Prisma CLI (db pull, migrate …) dùng directUrl ⇒ role CHỦ SỞ HỮU.
DIRECT_URL="postgresql://ctshop_owner:owner-lab9@localhost:5444/ctlab9?schema=shop&application_name=prisma-migrate"

# Only for scripts/dung-db-kiem-thu.js (npm run db:test): the superuser on the maintenance database "postgres" — it drops and
# rebuilds ctlab9_test FROM THE MIGRATIONS for the tests, the race and the load test. Never point TEST_DATABASE_URL at ctlab9.
# Chỉ dùng cho npm run db:test: superuser trên database "postgres" — xoá rồi dựng lại ctlab9_test TỪ MIGRATION cho test/thử tải.
ADMIN_URL="postgresql://postgres:123456@localhost:5444/postgres"
TEST_DATABASE_URL="postgresql://ctshop_app:app-lab9@localhost:5444/ctlab9_test?schema=shop&connection_limit=5&pool_timeout=10&application_name=ctshop-test"

PORT=3009
LOG_SQL=0
GATEWAY_MS=300
PRISMA_HIDE_UPDATE_MESSAGE=1`,
  INIT_TAY: `-- ── Added by hand (Lab 9 · C2): what \`migrate diff\` cannot see ─────────────────────────────
-- Prisma does not model CHECK constraints (db pull warned about all 11), and it writes SERIAL
-- where CT Shop uses GENERATED ALWAYS AS IDENTITY (edited above). Without these lines, a database
-- rebuilt from the migrations (CI, a new developer, a disaster) would accept stock = -5.
ALTER TABLE "customer" ADD CONSTRAINT "customer_email_check" CHECK (email = lower(email) AND email LIKE '%_@_%.__%');
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_qty_check" CHECK (qty > 0);
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_unit_price_check" CHECK (unit_price > 0);
ALTER TABLE "orders" ADD CONSTRAINT "orders_status_check" CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled'));
ALTER TABLE "payment" ADD CONSTRAINT "payment_amount_check" CHECK (amount > 0);
ALTER TABLE "payment" ADD CONSTRAINT "payment_method_check" CHECK (method IN ('cod', 'card', 'momo', 'bank'));
ALTER TABLE "product" ADD CONSTRAINT "product_price_check" CHECK (price > 0);
ALTER TABLE "product" ADD CONSTRAINT "product_stock_check" CHECK (stock >= 0);
ALTER TABLE "review" ADD CONSTRAINT "review_rating_check" CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_change_check" CHECK (change <> 0);
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_reason_check" CHECK (reason IN ('import', 'sale', 'return', 'adjust'));`,
  SAU_BASELINE: `-- Lab 9 · C2 — run ONCE, right after the first \`prisma migrate resolve\` / \`migrate deploy\` created shop._prisma_migrations.
-- The default privileges of roles.sql (step 3) also handed the APP role the migration history: it could rewrite it.
\\pset pager off
SELECT has_table_privilege('ctshop_app', 'shop._prisma_migrations', 'DELETE') AS app_can_delete_history;
REVOKE ALL ON shop._prisma_migrations FROM ctshop_app;
SELECT has_table_privilege('ctshop_app', 'shop._prisma_migrations', 'DELETE') AS app_can_delete_history;`,
  APP_JSON: `  // BigInt (every id here is bigint) cannot go through JSON.stringify ⇒ send it as a string.
  // Prisma.Decimal (price, amount) already turns itself into a string ("15000") — never into a float.
  app.set('json replacer', (_k, v) => (typeof v === 'bigint' ? v.toString() : v));`,
  PRODUCTS: `  // GET /products?q=bút&limit=12&before=40
  //   keyset: "the 12 newest products with id < 40" — the client sends back the last id it saw (\`next\`).
  //   NOT offset (?page=2 ⇒ skip 12): a product added between two page loads shifts every offset page by one.
  r.get('/products', async (req, res) => {
    const limit = soNguyen(req.query.limit, 'limit', { max: 50 }) ?? 12;
    const before = soNguyen(req.query.before, 'before');
    const q = String(req.query.q ?? '').trim();
    const rows = await prisma.product.findMany({
      where: {
        is_active: true,
        ...(q && { name: { contains: q, mode: 'insensitive' } }),   // ⇒ ILIKE '%q%' (Lab 7 has the accent-free, typo-tolerant search)
        ...(before && { id: { lt: before } }),
      },
      orderBy: { id: 'desc' },
      take: limit + 1,                                            // one extra row = "is there a next page?"
      select: COT,
    });
    const items = rows.slice(0, limit);
    res.json({ items, next: rows.length > limit ? items.at(-1).id : null });
  });`,
  ORDER_DETAIL: `  // GET /orders/1841 — one order with its lines, products and payment.
  // \`select\` with nested relations: Prisma sends ONE query per relation level (not one per row) ⇒ no N+1 (C3).
  r.get('/orders/:id', async (req, res) => {
    const id = soNguyen(req.params.id, 'id');
    const o = await prisma.orders.findUnique({
      where: { id },
      select: {
        id: true, status: true, created_at: true, delivery_note: true,
        customer: { select: { id: true, full_name: true } },
        order_item: { select: { qty: true, unit_price: true, product: { select: { id: true, sku: true, name: true } } }, orderBy: { product_id: 'asc' } },
        payment: { select: { amount: true, method: true, paid_at: true } },
      },
    });
    if (!o) throw new LoiApi(404, 'NOT_FOUND', \`no order \${id}\`);
    res.json({ ...o, total: tongTien(o.order_item) });
  });`,
  MY_ORDERS: `  // GET /customers/42/orders?limit=10&before=1256 — the "My orders" screen, newest first, keyset by (created_at, id).
  r.get('/customers/:id/orders', async (req, res) => {
    const id = soNguyen(req.params.id, 'id');
    const limit = soNguyen(req.query.limit, 'limit', { max: 50 }) ?? 10;
    const before = soNguyen(req.query.before, 'before');
    const rows = await prisma.orders.findMany({
      where: { customer_id: id },
      orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
      ...(before && { cursor: { id: before }, skip: 1 }),   // Prisma's cursor = "start right after this order"
      take: limit + 1,
      select: {
        id: true, status: true, created_at: true,
        order_item: { select: { qty: true, unit_price: true } },
        payment: { select: { method: true } },
      },
    });
    const items = rows.slice(0, limit).map(({ order_item, ...o }) => ({ ...o, lines: order_item.length, total: tongTien(order_item) }));
    res.json({ items, next: rows.length > limit ? items.at(-1).id : null });
  });`,
  N1_LOOP: `// ✗ 1 · the loop: one query for the list, then one per order for its lines, then one per line for the product name
await do_('✗ loop: findMany + findMany/order + findUnique/line', async () => {
  const don = await prisma.orders.findMany({ where: { customer_id: 42 }, orderBy: { created_at: 'desc' }, take: 20 });
  for (const o of don) {
    o.lines = await prisma.order_item.findMany({ where: { order_id: o.id } });
    for (const l of o.lines) l.product = await prisma.product.findUnique({ where: { id: l.product_id }, select: { name: true } });
    o.total = tongTien(o.lines);
  }
  return don;
});`,
  EXPAND: `-- Lab 9 · C4 — EXPAND: add the new column next to the old one. App v1 (reads/writes "note") keeps working.
-- Generated line (prisma migrate diff), then completed by hand: the sync trigger and the back-fill.
SET LOCAL lock_timeout = '3s';   -- ADD COLUMN needs a brief ACCESS EXCLUSIVE lock: fail fast instead of queueing everyone behind us

-- AlterTable
ALTER TABLE "orders" ADD COLUMN "delivery_note" TEXT;

-- While v1 and v2 run side by side, every write to one column is copied to the other.
CREATE FUNCTION orders_sync_note() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.delivery_note := coalesce(NEW.delivery_note, NEW.note);
    NEW.note          := coalesce(NEW.note, NEW.delivery_note);
  ELSIF NEW.note IS DISTINCT FROM OLD.note AND NEW.delivery_note IS NOT DISTINCT FROM OLD.delivery_note THEN
    NEW.delivery_note := NEW.note;            -- written by v1
  ELSIF NEW.delivery_note IS DISTINCT FROM OLD.delivery_note AND NEW.note IS NOT DISTINCT FROM OLD.note THEN
    NEW.note := NEW.delivery_note;            -- written by v2
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER orders_sync_note BEFORE INSERT OR UPDATE OF note, delivery_note ON "orders"
  FOR EACH ROW EXECUTE FUNCTION orders_sync_note();

-- Back-fill the rows that already exist (37.500 notes here; with millions, do it in batches outside the migration).
UPDATE "orders" SET "delivery_note" = "note" WHERE "note" IS NOT NULL AND "delivery_note" IS NULL;`,
  CONTRACT: `-- Lab 9 · C4 — CONTRACT: only after EVERY v1 instance is gone (check: nothing reads "note" any more).
SET LOCAL lock_timeout = '3s';

DROP TRIGGER orders_sync_note ON "orders";
DROP FUNCTION orders_sync_note();

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "note";`,
  GOM_GIO: `// The cart: one line per product, quantities added up, ALWAYS sorted by product_id —
// two carts then lock their products in the same order and can never wait for each other in a circle (deadlock, 11.3).
export function gomGio(items, { sapXep = true } = {}) {
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) throw new LoiApi(400, 'BAD_CART', 'items must be a list of 1–50 lines');
  const gio = new Map();
  for (const it of items) {
    const pid = Number(it?.product_id), qty = Number(it?.qty);
    if (!Number.isSafeInteger(pid) || pid < 1 || !Number.isSafeInteger(qty) || qty < 1 || qty > 100) {
      throw new LoiApi(400, 'BAD_CART', 'every line needs a product_id and a qty between 1 and 100');
    }
    gio.set(pid, (gio.get(pid) ?? 0) + qty);
  }
  const dong = [...gio].map(([product_id, qty]) => ({ product_id, qty }));
  return sapXep ? dong.sort((a, b) => a.product_id - b.product_id) : dong;
}`,
  RETRY: `// Retry the WHOLE transaction when PostgreSQL says "two transactions collided, run me again" — measured on Prisma 5.22:
//   · Serializable conflict (40001)            ⇒ PrismaClientKnownRequestError   code P2034
//   · deadlock (40P01) in a READ COMMITTED tx  ⇒ PrismaClientUnknownRequestError, NO code — only the text 'code: "40P01"'
//   · a raw query ($queryRaw / $executeRaw)    ⇒ P2010 with meta.code = the SQLSTATE
// A retry that only looks for P2034 never retries a deadlock (C5, trap).
export const laVaCham = (e) =>
  (e instanceof Prisma.PrismaClientKnownRequestError &&
    (e.code === 'P2034' || (e.code === 'P2010' && ['40001', '40P01'].includes(e.meta?.code)))) ||
  (e instanceof Prisma.PrismaClientUnknownRequestError && /code: "(40001|40P01)"/.test(e.message));

export async function voiThuLai(fn, { lan = 3 } = {}) {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (e) {
      if (!laVaCham(e) || i >= lan) throw e;
      console.warn(\`checkout: collision (\${e.code ?? '40P01'}) — retry \${i}/\${lan - 1}\`);
      await ngu(15 * i + Math.floor(Math.random() * 15));   // a little jitter so the two do not collide again
    }
  }
}`,
  CHECKOUT: `export async function datHang(prisma, { customer_id, items, delivery_note = null }, { treMs = 0, sapXep = true, thuLai = 3 } = {}) {
  const gio = gomGio(items, { sapXep });
  const kh = Number(customer_id);
  if (!Number.isSafeInteger(kh) || kh < 1) throw new LoiApi(400, 'BAD_INPUT', 'customer_id must be a whole number');
  const ghiChu = typeof delivery_note === 'string' && delivery_note.trim() ? delivery_note.trim().slice(0, 300) : null;

  return voiThuLai(() => prisma.$transaction(async (tx) => {
    const don = await tx.orders.create({ data: { customer_id: kh, delivery_note: ghiChu }, select: { id: true, created_at: true } });

    for (const d of gio) {
      // ONE atomic statement per line: "take qty if there are at least qty left" — no read-modify-write (16.4, case 2).
      // ⇒ UPDATE product SET stock = stock - $1 WHERE id = $2 AND is_active AND stock >= $3   (the row stays locked until COMMIT)
      const { count } = await tx.product.updateMany({
        where: { id: d.product_id, is_active: true, stock: { gte: d.qty } },
        data: { stock: { decrement: d.qty } },
      });
      if (count === 0) {
        const p = await tx.product.findUnique({ where: { id: d.product_id }, select: { name: true, stock: true, is_active: true } });
        if (!p) throw new LoiApi(400, 'BAD_CART', \`product \${d.product_id} does not exist\`);
        throw new LoiApi(409, 'OUT_OF_STOCK', \`\${p.name}: \${p.is_active ? \`\${p.stock} left, \${d.qty} wanted\` : 'not for sale'}\`, { product_id: d.product_id });
      }
      if (treMs) await ngu(treMs);   // demo only (scripts/hai-nguoi-mua.js): widen the window between two lines
    }

    // Price AT THE MOMENT of buying, read from the rows we have just locked (nobody can change them before COMMIT).
    const gia = await tx.product.findMany({ where: { id: { in: gio.map((d) => d.product_id) } }, select: { id: true, price: true } });
    const giaCua = new Map(gia.map((p) => [Number(p.id), p.price]));
    const dong = gio.map((d) => ({ order_id: don.id, product_id: d.product_id, qty: d.qty, unit_price: giaCua.get(d.product_id) }));
    await tx.order_item.createMany({ data: dong });

    return { id: don.id, status: 'pending', created_at: don.created_at, items: dong.length, total: tongTien(dong) };
  }, { maxWait: 5000, timeout: 10000 }), { lan: thuLai });
}`,
  RMW: `// ✗ The read-modify-write version — kept ONLY for scripts/hai-nguoi-mua.js to show the oversell. Do not use.
export async function datHangDocSuaGhi(prisma, { customer_id, items }) {
  const gio = gomGio(items);
  return prisma.$transaction(async (tx) => {
    const don = await tx.orders.create({ data: { customer_id: Number(customer_id) }, select: { id: true } });
    for (const d of gio) {
      const p = await tx.product.findUnique({ where: { id: d.product_id }, select: { stock: true, price: true } });   // read …
      if (p.stock < d.qty) throw new LoiApi(409, 'OUT_OF_STOCK', \`\${p.stock} left\`);
      await new Promise((r) => setTimeout(r, 50));                                                                   // (the app does something)
      await tx.product.update({ where: { id: d.product_id }, data: { stock: p.stock - d.qty } });                  // … write back
      await tx.order_item.create({ data: { order_id: don.id, product_id: d.product_id, qty: d.qty, unit_price: p.price } });
    }
    return { id: don.id };
  });
}`,
  PAY: `  // POST /orders/2001/pay  { "method": "card" }
  r.post('/orders/:id/pay', async (req, res) => {
    const id = soNguyen(req.params.id, 'id');
    const method = String(req.body?.method ?? '');
    if (!PTTT.includes(method)) throw new LoiApi(400, 'BAD_INPUT', \`method must be one of \${PTTT.join(', ')}\`);

    // 1 · read the order and its total: a short query, no transaction
    const o = await prisma.orders.findUnique({ where: { id }, select: { status: true, order_item: { select: { qty: true, unit_price: true } } } });
    if (!o) throw new LoiApi(404, 'NOT_FOUND', \`no order \${id}\`);
    if (o.status !== 'pending') throw new LoiApi(409, 'NOT_PENDING', \`order \${id} is \${o.status}\`);
    const amount = tongTien(o.order_item);

    // 2 · the payment gateway, OUTSIDE any transaction: its 300 ms of waiting hold no database connection (C6)
    const gd = await thuTien({ order_id: id, amount, method });

    // 3 · record it in one SHORT transaction. "WHERE status = 'pending'" + UNIQUE(order_id) stop a double payment.
    const tt = await prisma.$transaction(async (tx) => {
      const { count } = await tx.orders.updateMany({ where: { id, status: 'pending' }, data: { status: 'paid' } });
      if (count === 0) throw new LoiApi(409, 'NOT_PENDING', \`order \${id} was paid in the meantime\`);
      return tx.payment.create({ data: { order_id: id, amount, method }, select: { id: true, order_id: true, amount: true, method: true, paid_at: true } });
    });
    res.status(201).json({ ...tt, gateway_ref: gd.ref });
  });`,
  PAY_HOLD: `// ✗ The version that holds a connection while it waits for the gateway — ONLY for the C6 load test (DEMO_HOLD=1). Do not use.
export function routerPayGiuKetNoi(prisma) {
  const r = Router();
  r.post('/orders/:id/pay', async (req, res) => {
    const id = soNguyen(req.params.id, 'id');
    const method = String(req.body?.method ?? 'card');
    const tt = await prisma.$transaction(async (tx) => {
      const [o] = await tx.$queryRaw\`SELECT status FROM orders WHERE id = \${id} FOR UPDATE\`;
      if (!o || o.status !== 'pending') throw new LoiApi(409, 'NOT_PENDING', \`order \${id} is not pending\`);
      const dong = await tx.order_item.findMany({ where: { order_id: id }, select: { qty: true, unit_price: true } });
      const amount = tongTien(dong);
      await thuTien({ order_id: id, amount, method });            // ← 300 ms with a connection AND a row lock held
      await tx.orders.update({ where: { id }, data: { status: 'paid' } });
      return tx.payment.create({ data: { order_id: id, amount, method }, select: { id: true, amount: true } });
    }, { timeout: 15000 });
    res.status(201).json(tt);
  });
  return r;
}`,
  LOI: `export function xuLyLoi(err, req, res, _next) {
  if (err instanceof LoiApi) return res.status(err.status).json({ error: err.code, message: err.message, ...err.extra });
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // the pool is exhausted: P2024 = a query waited longer than pool_timeout · P2028 = $transaction waited longer than maxWait
    if (err.code === 'P2024') return res.status(503).json({ error: 'POOL_TIMEOUT', message: 'no free database connection — try again' });
    if (err.code === 'P2028') return res.status(503).json({ error: 'TX_START_TIMEOUT', message: 'could not start a transaction in time — try again' });
    if (err.code === 'P2034') return res.status(409).json({ error: 'CONFLICT', message: 'the order collided with another one — try again' });
    if (err.code === 'P2002') return res.status(409).json({ error: 'DUPLICATE', message: \`already exists (\${err.meta?.target})\` });
    if (err.code === 'P2003') return res.status(400).json({ error: 'BAD_REFERENCE', message: \`unknown \${err.meta?.field_name}\` });
    if (err.code === 'P2025') return res.status(404).json({ error: 'NOT_FOUND', message: 'not found' });
  }
  // Errors Prisma 5.22 does not name (no .code): the SQLSTATE is only inside the message text.
  const sqlstate = err instanceof Prisma.PrismaClientUnknownRequestError ? /code: "(\\w{5})"/.exec(err.message)?.[1] : undefined;
  if (sqlstate === '40P01') return res.status(409).json({ error: 'CONFLICT', message: 'deadlock — try again' });
  if (sqlstate === '55P03') return res.status(503).json({ error: 'LOCK_TIMEOUT', message: 'the table is locked (a migration?) — try again' });
  if (sqlstate === '57014') return res.status(503).json({ error: 'STATEMENT_TIMEOUT', message: 'the query took too long' });
  console.error(err);
  res.status(500).json({ error: 'INTERNAL', message: 'internal error' });
}`,
  REPORT: `  r.get('/reports/revenue', async (req, res) => {
    const to = String(req.query.to ?? thangNay());
    const tu = dauThang(String(req.query.from ?? to), req.query.from ? 0 : -11);   // default: the last 12 months
    const den = dauThang(to, 1);                                                    // [from, to + 1 month)
    if (den <= tu) throw new LoiApi(400, 'BAD_INPUT', 'from must not be after to');
    const rows = await prisma.$queryRaw\`
      WITH m AS (
        SELECT date_trunc('month', paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh') AS thang,
               count(*) AS so_don, sum(amount) AS doanh_thu
        FROM payment
        WHERE paid_at >= \${tu} AND paid_at < \${den}
        GROUP BY 1
      )
      SELECT to_char(thang, 'YYYY-MM') AS thang, so_don::int AS so_don, doanh_thu::text AS doanh_thu,
             (sum(doanh_thu) OVER (ORDER BY thang))::text AS luy_ke,
             round(100 * (doanh_thu / lag(doanh_thu) OVER (ORDER BY thang) - 1), 1)::text AS tang_pct
      FROM m
      ORDER BY thang\`;
    res.json({ from: tu, to: den, months: rows });
  });`,
  IDX1: `-- Lab 9 · C7 — "My orders": filter by customer AND already sorted the way the screen reads it (no Sort, LIMIT stops early).
-- CONCURRENTLY: the table keeps taking orders while the index is built. It cannot run inside a transaction block,
-- so this file holds ONE statement and nothing else (a second statement ⇒ Prisma runs the file as one block ⇒ 25001, lesson 16.1).
CREATE INDEX CONCURRENTLY "orders_customer_id_created_at_id_idx" ON "orders"("customer_id", "created_at" DESC, "id" DESC);`,
  IDX2: `-- Lab 9 · C7 — the revenue report reads one date range of payments: an index on paid_at, built without blocking writes.
CREATE INDEX CONCURRENTLY "payment_paid_at_idx" ON "payment"("paid_at");`,
  SCHEMA_IDX: `model orders {
  id             BigInt           @id @default(autoincrement())
  customer_id    BigInt
  status         String           @default("pending")
  created_at     DateTime         @default(now()) @db.Timestamptz(6)
  delivery_note  String?
  order_item     order_item[]
  customer       customer         @relation(fields: [customer_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
  payment        payment?
  stock_movement stock_movement[]

  @@index([customer_id, created_at(sort: Desc), id(sort: Desc)])
}

/// This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
model payment {
  id       BigInt   @id @default(autoincrement())
  order_id BigInt   @unique
  amount   Decimal  @db.Decimal(12, 2)
  method   String
  paid_at  DateTime @default(now()) @db.Timestamptz(6)
  orders   orders   @relation(fields: [order_id], references: [id], onDelete: NoAction, onUpdate: NoAction)

  @@index([paid_at])
}`,
  TEST_RACE: `test('two buyers, one last unit ⇒ exactly one order', async () => {
  const p = await sp('T003');
  const ban = () => api('POST', '/orders', { customer_id: 3, items: [{ product_id: Number(p.id), qty: 1 }] });
  const kq = (await Promise.all([ban(), ban()])).map((r) => r.status).sort();
  assert.deepEqual(kq, [201, 409]);
  assert.equal((await sp('T003')).stock, 0);
});`,
  DB_TEST: `// 1 · a fresh, empty database owned by ctshop_owner; only the two roles may connect
await chay(process.env.ADMIN_URL, [\`DROP DATABASE IF EXISTS \${ten} WITH (FORCE)\`, \`CREATE DATABASE \${ten} OWNER ctshop_owner\`]);
await chay(voiDb(process.env.ADMIN_URL, ten), [
  \`REVOKE ALL ON DATABASE \${ten} FROM PUBLIC\`,
  \`GRANT CONNECT ON DATABASE \${ten} TO ctshop_owner, ctshop_app\`,
  'CREATE SCHEMA shop AUTHORIZATION ctshop_owner',
  'GRANT USAGE ON SCHEMA shop TO ctshop_app',
  'ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_owner IN SCHEMA shop GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ctshop_app',
  'ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_owner IN SCHEMA shop GRANT USAGE, SELECT ON SEQUENCES TO ctshop_app',
]);

// 2 · the schema = the migrations, applied by the owner (exactly what a deploy does)
execFileSync('npx', ['prisma', 'migrate', 'deploy'], {
  stdio: 'inherit', shell: process.platform === 'win32',
  env: { ...process.env, DIRECT_URL: voiDb(process.env.DIRECT_URL, ten), PRISMA_HIDE_UPDATE_MESSAGE: '1' },
});

// the app role must not be able to rewrite the migration history (same line as sql/sau-baseline.sql)
await chay(voiDb(process.env.ADMIN_URL, ten), ['REVOKE ALL ON shop._prisma_migrations FROM ctshop_app']);`,
  DEM_DONG: `-- Lab 9 · C9 — row counts of every table + two checksums + the migration history.
-- Run on the original AND on the restored copy: the two outputs must be IDENTICAL (diff prints nothing).
\\pset pager off
SELECT "table", "rows" FROM (VALUES
  (1, 'category',           (SELECT count(*) FROM shop.category)),
  (2, 'customer',           (SELECT count(*) FROM shop.customer)),
  (3, 'product',            (SELECT count(*) FROM shop.product)),
  (4, 'orders',             (SELECT count(*) FROM shop.orders)),
  (5, 'order_item',         (SELECT count(*) FROM shop.order_item)),
  (6, 'payment',            (SELECT count(*) FROM shop.payment)),
  (7, 'stock_movement',     (SELECT count(*) FROM shop.stock_movement)),
  (8, 'review',             (SELECT count(*) FROM shop.review)),
  (9, '_prisma_migrations', (SELECT count(*) FROM shop._prisma_migrations)),
  (10, 'sum(stock)',        (SELECT sum(stock) FROM shop.product)),
  (11, 'sum(amount)',       (SELECT sum(amount)::bigint FROM shop.payment))
) AS t(n, "table", "rows") ORDER BY n;`,
  TAI: `let i = 0;
const kq = await autocannon({
  url: \`http://localhost:\${port}\`, connections: Number(a.c), amount: ids.length, timeout: 30,
  requests: [{ method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"method":"card"}',
               setupRequest: (req) => ({ ...req, path: \`/orders/\${ids[i++]}/pay\` }) }],
});`,
  STARTER_CHECKOUT: `  // TODO C5a · ONE interactive transaction (prisma.$transaction(async (tx) => …), wrapped in voiThuLai):
  //   1 create the order (status pending)
  //   2 for every line, in gio order: take the stock with ONE atomic statement — no read-then-write.
  //       0 rows changed ⇒ throw LoiApi 409 OUT_OF_STOCK (or 400 if the product does not exist)
  //       if (treMs) await ngu(treMs) after each line (the race script uses it)
  //   3 the lines, with the price AT THE MOMENT of buying (read it from the rows you just locked)
  //   4 return { id, status: 'pending', created_at, items: <number of lines>, total: tongTien(lines) `,
};
/* F:END */

/* Lệnh (viết tay — chỉ là lệnh; mọi kết quả của chúng ở O). */
const SETUP = `# 1 · the database (once) — "pgdemo" = your PostgreSQL 17 container of lesson 0.3, port 5444, password 123456
docker exec -it pgdemo createdb -U postgres ctlab9
docker cp lab9-start.sql pgdemo:/tmp/
docker exec -it pgdemo psql -U postgres -d ctlab9 -f /tmp/lab9-start.sql
# 2 · the app — unzip lab9-starter.zip, then inside ctshop-api-lab9-starter/
npm ci                          # the exact versions of package-lock.json: prisma 5.22.0, express 5.1.0, autocannon 8.0.0
cp .env.example .env            # Windows PowerShell: Copy-Item .env.example .env`;
const ENVVAR = `# a one-off environment variable, three shells
LOG_SQL=1 npm run dev                  # macOS / Linux / Git Bash
$env:LOG_SQL="1"; npm run dev          # Windows PowerShell
set LOG_SQL=1&& npm run dev            # Windows cmd`;
const C1_RUN = `docker cp sql/roles.sql pgdemo:/tmp/
docker exec -it pgdemo psql -U postgres -d ctlab9 -f /tmp/roles.sql`;
const C2_RUN = `npx prisma db pull                 # as ctshop_owner (DIRECT_URL) — writes the 8 models into prisma/schema.prisma
npx prisma generate
npx prisma migrate status          # "The current database is not managed by Prisma Migrate."
mkdir -p prisma/migrations/0_init  # Windows PowerShell: mkdir prisma/migrations/0_init
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql`;
const C2_RESOLVE = `npx prisma migrate resolve --applied 0_init
npx prisma migrate status
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script`;
const C2_REPLAY_CMD = `docker exec pgdemo psql -U postgres -c "CREATE DATABASE ctlab9_replay OWNER ctshop_owner"
DIRECT_URL="postgresql://ctshop_owner:owner-lab9@localhost:5444/ctlab9_replay?schema=shop" npx prisma migrate deploy
# PowerShell: $env:DIRECT_URL="postgresql://…/ctlab9_replay?schema=shop"; npx prisma migrate deploy   (then Remove-Item Env:DIRECT_URL)`;
const C4_RUN = `# terminal 1 — app v1 keeps running (reads and writes "note"), port 3009
npm run dev
# terminal 2 — change schema.prisma (add delivery_note String?), then:
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script
# ⇒ put the line into prisma/migrations/20261026090000_expand_delivery_note/migration.sql, complete it by hand, then
npx prisma migrate deploy`;
const C6_RUN = `npm run db:test                                   # rebuild ctlab9_test from your migrations (the load test writes into it)
npm run load -- --limit 5 --timeout 2 --hold      # the WRONG payment: gateway call inside the transaction
npm run db:test
npm run load -- --limit 20 --timeout 2 --hold     # same, bigger pool
npm run db:test
npm run load -- --limit 5 --timeout 2             # the real fix: gateway outside, a short transaction`;
const C7_EXPLAIN = `-- psql (superuser) — the report, with the two instants Prisma's log shows for $1 and $2
SET search_path = shop;  SET TimeZone = 'Asia/Ho_Chi_Minh';
SET max_parallel_workers_per_gather = 0;   -- plans without Gather (like Chapter 10): easier to read, same pages
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF)
WITH m AS (SELECT date_trunc('month', paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh') AS thang, count(*) AS so_don, sum(amount) AS doanh_thu
           FROM payment
           WHERE paid_at >= '2025-09-30 17:00:00 UTC' AND paid_at < '2026-09-30 17:00:00 UTC'
           GROUP BY 1)
SELECT … FROM m ORDER BY thang;            -- (the full text is in the log above)
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF)
SELECT id, status, created_at FROM orders WHERE customer_id = 42 ORDER BY created_at DESC, id DESC LIMIT 11 OFFSET 0;`;
const C9_SUA = `-- items 5–7 are SERVER settings: no app, no role can change them — the superuser does, once
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';   -- needs a RESTART
ALTER SYSTEM SET log_min_duration_statement = '250ms';               -- a reload is enough
ALTER SYSTEM SET log_lock_waits = on;                                -- a reload is enough
SELECT name, setting, pending_restart FROM pg_settings
WHERE name IN ('shared_preload_libraries', 'log_min_duration_statement', 'log_lock_waits') ORDER BY name;`;
const C9_TOP = `SELECT calls, round(total_exec_time::numeric, 1) AS total_ms, round(mean_exec_time::numeric, 2) AS mean_ms,
       rows, left(regexp_replace(query, '\\s+', ' ', 'g'), 70) AS query
FROM pg_stat_statements
WHERE userid = 'ctshop_app'::regrole
ORDER BY total_exec_time DESC LIMIT 6;`;
const C9_KT_RUN = `docker cp sql/kiem-tra.sql pgdemo:/tmp/
docker exec -it pgdemo psql -U postgres -d ctlab9 -f /tmp/kiem-tra.sql                                     # as the superuser
docker exec -it -e PGPASSWORD=app-lab9 pgdemo psql -h localhost -U ctshop_app -d ctlab9 -f /tmp/kiem-tra.sql   # as the app`;
const C9_DIFF = `docker cp sql/dem-dong.sql pgdemo:/tmp/
docker exec pgdemo psql -U postgres -d ctlab9 -f /tmp/dem-dong.sql > before.txt
docker exec pgdemo psql -U postgres -d ctlab9_restore -f /tmp/dem-dong.sql > after.txt
diff before.txt after.txt   # Windows PowerShell: Compare-Object (Get-Content before.txt) (Get-Content after.txt)
# nothing printed = identical`;

const FILES = (vi) => [
  [`${F_URL}/lab9-start.sql`, '🧩', 'lab9-start.sql', vi ? 'CT Shop chuẩn (lược đồ + dữ liệu như Lab 1–8) + lịch sử 2023–2024 từ hệ thống cũ: 302.000 đơn, 605.000 dòng đơn, 277.376 thanh toán (tất định, ~15 giây, ~120 MB) + danh sách việc C1–C9' : 'The standard CT Shop (schema + data as in Labs 1–8) + 2023–2024 history from the old system: 302.000 orders, 605.000 order lines, 277.376 payments (deterministic, ~15 s, ~120 MB) + the C1–C9 to-do list'],
  [`${F_URL}/lab9-starter.zip`, '📦', 'lab9-starter.zip', vi ? 'App khởi đầu: Express 5 + Prisma 5.22 chạy được ngay, các chỗ TODO đánh số C1–C9, script đo (N+1, hai người mua, thử tải), 8 test tích hợp là "người chấm", README lệnh cho macOS / Linux / Windows' : 'The starter app: Express 5 + Prisma 5.22, runs as is, TODOs numbered C1–C9, measuring scripts (N+1, two buyers, load test), 8 integration tests as the grader, a README with macOS / Linux / Windows commands'],
  [`${F_URL}/lab9-solution.zip`, '🔑', 'lab9-solution.zip', vi ? 'Đáp án đầy đủ: roles.sql, 5 migration (baseline 0_init sửa tay, expand, contract, 2 chỉ mục CONCURRENTLY), checkout + thử lại, thanh toán, báo cáo — mở sau khi tự làm' : 'The full solution: roles.sql, 5 migrations (hand-completed 0_init baseline, expand, contract, 2 CONCURRENTLY indexes), checkout + retry, payment, report — open after your own attempt'],
].map(([h, i, t, s]) => card(h, i, t, s, vi ? 'TẢI VỀ →' : 'DOWNLOAD →')).join('\n');

const ans = (lang, k, html) => details(lang === 'en' ? `Answer — ${k}` : `Đáp án — ${k}`, html);
const bay = (tieuDe, chu, html = '') => `<div class="pitfall"><p><strong>${tieuDe}</strong> ${chu}</p></div>\n${html}`;

const RUBRIC = (vi) => `<table>
<tr><th>${vi ? 'Phần' : 'Part'}</th><th>${vi ? 'Điểm' : 'Points'}</th><th>${vi ? 'Chấm khi' : 'Awarded when'}</th></tr>
<tr><td>C1</td><td>1</td><td>${vi ? 'ctshop_owner sở hữu schema và 8 bảng; ctshop_app chỉ <code>arwd</code>; default privileges; timeout trên role (5 s · 10 s · 3 s cho app, lock_timeout 5 s cho owner) — giải thích được từng con số' : 'ctshop_owner owns the schema and the 8 tables; ctshop_app has only <code>arwd</code>; default privileges; timeouts on the roles (5 s · 10 s · 3 s for the app, lock_timeout 5 s for the owner) — each value explained'}</td></tr>
<tr><td>C2</td><td>1,5</td><td>${vi ? 'db pull 8 model; 0_init dựng lại ĐÚNG lược đồ (11 CHECK + IDENTITY, kiểm bằng một DB trống); <code>resolve --applied</code> đúng chỗ và nói được vì sao hợp lệ; status "up to date", diff rỗng; app không còn quyền trên <code>_prisma_migrations</code>' : 'db pull 8 models; 0_init rebuilds the REAL schema (11 CHECKs + IDENTITY, proven on an empty database); <code>resolve --applied</code> used where it is legitimate, and why; status "up to date", empty diff; the app has no rights on <code>_prisma_migrations</code>'}</td></tr>
<tr><td>C3</td><td>1</td><td>${vi ? 'BigInt ra chuỗi, Decimal không thành float; keyset không lặp dòng (chứng minh); N+1 đo được: 68 → 3 → 1 câu SQL' : 'BigInt as a string, Decimal never a float; keyset shows no duplicate (proven); N+1 measured: 68 → 3 → 1 SQL statements'}</td></tr>
<tr><td>C4</td><td>1</td><td>${vi ? 'expand (cột + trigger đồng bộ + back-fill 37.500 dòng) → v1 và v2 cùng chạy, đọc được thứ của nhau → contract SAU khi tắt v1; chỉ ra P2022 nếu làm sai thứ tự' : 'expand (column + sync trigger + 37.500-row back-fill) → v1 and v2 side by side, each reads what the other wrote → contract AFTER v1 is gone; P2022 shown for the wrong order'}</td></tr>
<tr><td>C5</td><td>1,5</td><td>${vi ? 'một giao dịch, trừ kho bằng một câu nguyên tử; hai người mua món cuối ⇒ đúng một 201; đọc-sửa-ghi bán lố (chứng minh); giỏ sắp theo id; thử lại bắt được cả 40P01 mà Prisma không gắn mã' : 'one transaction, stock taken by one atomic statement; two buyers for the last unit ⇒ exactly one 201; the read-modify-write oversell shown; carts sorted by id; the retry catches 40P01 that Prisma does not label'}</td></tr>
<tr><td>C6</td><td>1</td><td>${vi ? 'phép tính 3 × 5 = 15 &lt; 97; tái hiện P2024/P2028 dưới tải; sửa bằng cách đưa cổng thanh toán ra ngoài giao dịch (0 lỗi với pool 5), giải thích vì sao tăng pool không phải cách sửa' : 'the arithmetic 3 × 5 = 15 &lt; 97; P2024/P2028 reproduced under load; fixed by moving the gateway out of the transaction (0 errors on a pool of 5); why a bigger pool is not the fix'}</td></tr>
<tr><td>C7</td><td>1,5</td><td>${vi ? 'báo cáo bằng <code>$queryRaw</code> + hàm cửa sổ, tham số an toàn; log → EXPLAIN → 2 migration CONCURRENTLY (mỗi tệp một câu) → EXPLAIN: ~2.300 → 25 trang và ~2.900 → 15 trang; @@index trong schema để diff rỗng; lock_timeout ⇒ 503' : 'the report with <code>$queryRaw</code> + window functions, safe parameters; log → EXPLAIN → 2 CONCURRENTLY migrations (one statement per file) → EXPLAIN: ~2.300 → 25 pages and ~2.900 → 15 pages; @@index in the schema so the diff stays empty; lock_timeout ⇒ 503'}</td></tr>
<tr><td>C8</td><td>0,5</td><td>${vi ? '<code>npm test</code> 8/8 trên DB dựng từ migration' : '<code>npm test</code> 8/8 on a database built from the migrations'}</td></tr>
<tr><td>C9</td><td>1</td><td>${vi ? 'kiem-tra.sql đọc từng dòng (vì sao ✗, sửa được ở đâu: máy chủ / role / dữ liệu); diễn tập khôi phục: số dòng khớp, migrate status trên bản khôi phục, chỉ ra quyền CONNECT bị mất' : 'kiem-tra.sql read line by line (why ✗, fixed where: server / role / data); restore drill: counts match, migrate status on the copy, the lost CONNECT privilege spotted'}</td></tr>
</table>`;

const EN = `
<div class="ml-en">
<span class="eyebrow">Lab 9 · CT Shop · capstone · after Chapter 16</span>
<h2>An API for the mobile app — the whole course in one Node service</h2>
<p class="lead">Eight labs built CT Shop inside PostgreSQL: the schema (Labs 1–2), queries and reports (3–4), indexes (5), a correct checkout (6), search (7), backups and replicas (8). Now a real application has to live on top of it — and an application brings everything the course warned about: an ORM that sends SQL you did not write, a connection pool that runs out, migrations that lock tables, two buyers pressing "Pay" at the same second, and a deploy where the old version is still running. This lab is the brief of lesson 16.4, done for real.</p>

<h3>1 · The brief</h3>
<p>The ticket from the CT Shop team:</p>
<ul>
<li>The <strong>mobile app</strong> needs an API: product list with search, "My orders", order detail, checkout, payment, and a revenue screen for the owner. Node.js 22 + Prisma, because the web team already knows them.</li>
<li>The database <strong>already exists</strong> and is in production — 302.000 orders, two years of history imported from the old system. Prisma must adopt it, not recreate it.</li>
<li>Security: the app must not be able to <strong>change the schema</strong>; migrations run with a separate account, in the deploy.</li>
<li>The mobile team renames a field: <code>note</code> becomes <code>delivery_note</code>. <strong>No downtime</strong> — during a deploy the old and the new version run side by side.</li>
<li>Black Friday: <strong>two buyers, one last unit</strong> — exactly one order, never stock below zero, never a stuck checkout.</li>
<li>Payments go through a gateway that answers in ~300 ms. Under load the API must not fall over.</li>
<li>Before go-live: the <strong>checklist script</strong> of 16.3 and a <strong>restore drill</strong>.</li>
</ul>
<p>The first look of 16.4 already ran on a copy of CT Shop: <code>db pull</code> found 8 models and warned about the CHECK constraints; customer 42's three newest orders are 1841 (shipped), 1256 (shipped), 1238 (paid); and the paid orders of January–April 2026 are 75, 64, 92, 69. This lab starts from the same database and lands on the same numbers.</p>
<p>Tools: the whole course — constraints (Ch 3), indexes and EXPLAIN (Ch 9–10), transactions, locks and deadlocks (Ch 11), triggers (Ch 12), pools, timeouts and <code>pg_stat_statements</code> (Ch 14), backups (Ch 15), Prisma migrations, expand/contract, <code>CONCURRENTLY</code> and the checklist (Ch 16). New, explained where they appear: a <strong>baseline</strong> migration, Prisma's <code>directUrl</code>, <code>ALTER DEFAULT PRIVILEGES</code>, Prisma's cursor pagination, the error codes P2022 / P2024 / P2028 / P2034, a load test with autocannon and the Node test runner.</p>

<h3>2 · Requirements and pass criteria</h3>
<ol>
<li><strong>C1</strong> — two accounts: <code>ctshop_owner</code> (owns the schema, runs migrations) and <code>ctshop_app</code> (rows only), default privileges for future tables, timeouts on the roles.</li>
<li><strong>C2</strong> — Prisma adopts CT Shop: <code>db pull</code>, a baseline migration <code>0_init</code> that rebuilds the <em>real</em> schema, <code>migrate resolve --applied</code>, status and diff clean.</li>
<li><strong>C3</strong> — the read endpoints: BigInt and Decimal in JSON, keyset pagination, the N+1 trap measured.</li>
<li><strong>C4</strong> — rename <code>orders.note</code> → <code>delivery_note</code> with expand / contract while app v1 keeps running.</li>
<li><strong>C5</strong> — checkout: order + lines + stock in ONE transaction, no read-modify-write, two buyers, deadlock, retry.</li>
<li><strong>C6</strong> — payment and the pool: the arithmetic, P2024 under load, the real fix.</li>
<li><strong>C7</strong> — the revenue report with window functions; Prisma's log → EXPLAIN → index migrations with <code>CONCURRENTLY</code> → EXPLAIN again.</li>
<li><strong>C8</strong> — integration tests on a database rebuilt from your migrations.</li>
<li><strong>C9</strong> — operations: the checklist script read line by line, and a restore drill.</li>
</ol>
<div class="callout ok"><p><strong>You pass when:</strong> <code>npm test</code> prints <strong>8 pass, 0 fail</strong> · <code>migrate diff</code> prints <code>-- This is an empty migration.</code> · a database rebuilt from your migrations has <strong>11</strong> CHECK constraints and refuses <code>stock = -5</code> · two buyers of the last unit give exactly one <strong>201</strong> and one <strong>409</strong> · 400 payments under load on a pool of 5 give <strong>400 × 201</strong> · the report reads <strong>25</strong> pages instead of 2.318, "My orders" <strong>15</strong> instead of 2.860 · the restored copy matches row for row (302.002 orders on our run) and <code>migrate status</code> says "up to date" on it.</p></div>
<p><strong>Times on your machine will differ</strong> (ours: a laptop, Docker Desktop). Judge by what does not change: counts, status codes, plan nodes, pages in <code>Buffers</code>, the number of SQL statements, the ratio before/after.</p>
<h4>Rubric (10 points)</h4>
${RUBRIC(false)}

<h3>3 · Downloads and setup</h3>
${FILES(false)}
<p>You need <strong>Node.js 22</strong> (<code>node -v</code>) and the PostgreSQL 17 container of lesson 0.3 published on port <strong>5444</strong> (password 123456). It is called <code>pgdemo</code> below; if yours is <code>pg17</code>, use that name (or run <code>docker rename pg17 pgdemo</code> once). Every command works the same on macOS, Linux and Windows (PowerShell or Git Bash) unless a line says otherwise.</p>
${code(SETUP, 'bash')}
<p>The start file prints its check line and the indexes you start with — only the keys and UNIQUE constraints, <em>no index on any foreign key</em>, on purpose:</p>
${out('categories | products | customers | orders | order_lines | payments | notes\n        12 |       48 |       300 | 302000 |      605000 |   277376 | 37500')}
<p>The <code>.env</code> holds three connection strings — this split is the first design decision of the lab:</p>
${code(F.ENV, 'bash')}
<p>Prisma reads <code>DATABASE_URL</code> in the running app and <strong><code>directUrl</code></strong> in every CLI command (<code>db pull</code>, <code>migrate …</code>) — meant for bypassing a pooler such as PgBouncer, and exactly what we need to give the CLI a different <em>account</em>. One-off environment variables in three shells (used a few times below):</p>
${code(ENVVAR, 'bash')}

<h3>4 · Step by step</h3>

<h4>C1 — two accounts: the owner and the app</h4>
<p>Case 3 of 16.4 and the checklist of 16.3 asked for it: the account the app logs in with must not be able to <code>DROP TABLE</code>. A migration needs <code>CREATE</code> and <code>ALTER</code>; a request needs <code>SELECT</code>/<code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code>. So: two roles.</p>
<p class="meo">💡 The owner of a table can do anything to it — make <code>ctshop_owner</code> the owner of schema <code>shop</code> and of its 8 tables (identity sequences follow their table). The app gets USAGE on the schema and four privileges on the tables. <strong>New: <code>ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_owner IN SCHEMA shop GRANT …</code></strong> — grants applied automatically to every table the owner creates <em>later</em>, i.e. by future migrations. And the timeouts of 16.3 go on the role, so no code path can forget them.</p>
<p>Before you write it, run the starter as it is — with the role lines missing, the app logs in but cannot even <em>see</em> the schema. Note that <code>/health</code> says ok: <code>SELECT current_user</code> touches no table. A health check that does not touch your data proves less than it seems.</p>
${out(O.C1_42501)}
${ans('en', 'C1', code(F.ROLES) + code(C1_RUN, 'bash') + out(O.C1_ROLES) + out(O.C1_DP) + '<p><code>arwdDxtm</code> = everything (the owner); <code>arwd</code> = append (INSERT), read (SELECT), write (UPDATE), delete. Why these timeouts: <strong>5 s</strong> statement_timeout — no screen of a mobile app may wait longer, a runaway query is cancelled instead of eating a connection; <strong>10 s</strong> idle_in_transaction — the case 1 of 16.4 cannot last an afternoon; <strong>3 s</strong> lock_timeout — a request stuck behind a migration fails fast with a clear error (you will see it in C7) instead of queueing. The owner gets lock_timeout 5 s too, but <strong>no</strong> statement_timeout: building an index on a big table may legitimately take minutes.</p>')}

<h4>C2 — Prisma adopts CT Shop: db pull and a baseline</h4>
<p>CT Shop was created by SQL files, not by Prisma. Prisma Migrate must learn that it exists, without trying to create it again.</p>
${code(C2_RUN, 'bash')}
${out(O.C2_PULL)}
${out(O.C2_STATUS0)}
<p class="meo">💡 <strong>Baseline</strong>: a first migration that describes what already exists. <code>migrate diff --from-empty --to-schema-datamodel</code> writes the SQL that would build <code>schema.prisma</code> from nothing. Read it before you trust it — this is its beginning:</p>
${out(O.C2_GEN)}
${bay('Trap — the baseline Prisma writes is NOT your schema.', 'Two silent differences. <code>SERIAL</code> where CT Shop has <code>GENERATED ALWAYS AS IDENTITY</code>, and <strong>zero</strong> CHECK constraints — db pull warned about 11, and the generated file simply leaves them out. On production this file will never run, so who cares? Every database built <em>from the migrations</em>: a CI test database, a new developer, a disaster rebuild. Applied to an empty database, the generated file accepts a negative stock and an explicit id:', out(O.C2_GEN_TEST))}
${ans('en', 'C2 (the baseline)', '<p>Edit the generated file: the seven <code>SERIAL</code>/<code>BIGSERIAL</code> become <code>INTEGER</code>/<code>BIGINT GENERATED ALWAYS AS IDENTITY</code> (sed or by hand), and append the 11 CHECKs, copied from <code>pg_dump --schema-only</code> of ctlab9:</p>' + code(F.INIT_TAY) + '<p>Proof — the migrations replayed on an empty database owned by ctshop_owner:</p>' + code(C2_REPLAY_CMD, 'bash') + out(O.C2_REPLAY) + out(O.C2_REPLAY_CHECK) + '<p>11 CHECKs, identity <code>a</code> (= ALWAYS) on all seven tables, and <code>stock = -5</code> refused. Prisma\'s own diff between ctlab9 and the replay is empty — it cannot see the CHECKs either way, which is precisely why you check with SQL. Drop <code>ctlab9_replay</code> afterwards.</p>')}
<p>Now tell Prisma that ctlab9 already <em>has</em> 0_init:</p>
${code(C2_RESOLVE, 'bash')}
${out(O.C2_RESOLVE + '\n\n' + O.C2_STATUS1 + '\n\n' + O.C2_DIFF)}
<div class="callout warn"><p><strong>Why <code>resolve --applied</code> is right here — and wrong almost everywhere else.</strong> It writes a row into <code>_prisma_migrations</code> saying "this migration ran", without running it. For a baseline that statement is <em>true</em>: every table of 0_init exists, you have just compared them. The CLAUDE.md-style rule of 16.1 — never auto-resolve a <em>failed</em> migration — is about the opposite situation: a migration that half-ran, where "applied" is a lie that hides a broken schema. Same command; one is recording a fact, the other is erasing evidence.</p></div>
${bay('Trap — the default privileges were too generous.', '<code>migrate resolve</code> created <code>shop._prisma_migrations</code> as ctshop_owner, so step 3 of roles.sql handed the app SELECT, INSERT, UPDATE, DELETE on the migration history. An app that can delete rows from it can make the next deploy skip a migration. Take it back (and the test database script does the same):', code(F.SAU_BASELINE) + out(O.C2_REVOKE))}

<h4>C3 — the read endpoints: JSON, pagination, N+1</h4>
<p>Start the starter (<code>npm run dev</code>) and ask for the catalogue:</p>
${out(O.C3_500)}
<p>Every id in CT Shop is <code>bigint</code>, Prisma returns it as a JavaScript <code>BigInt</code> — and <code>JSON.stringify</code> refuses BigInt. Converting to <code>Number</code> would "work" until an id passes 2<sup>53</sup>; the API sends ids as <strong>strings</strong>. Money is <code>numeric(12,2)</code>, Prisma returns <code>Prisma.Decimal</code>, whose JSON is already a string:</p>
${ans('en', 'C3a', code(F.APP_JSON, 'js') + out(O.C3_TIEN) + '<p>That is the float trap in one line: VAT 8 % on the 59.000 đ notebook is 63720.00000000001 as a JavaScript number, exactly 63720 as a Decimal, and PostgreSQL agrees (<code>float8</code> vs <code>numeric</code>). Rule: money is <code>numeric</code> in the database, <code>Decimal</code> in the app (<code>src/tien.js</code> sums lines with <code>.plus/.times</code>), a string on the wire. Never <code>Float</code> in schema.prisma.</p>')}
<p>Pagination. The starter pages with <code>skip</code> (= <code>OFFSET</code>). Newest first, one product added between two page loads — on the test database (C8 builds it; run <code>npm run db:test</code> now):</p>
${out(O.C3_KEYSET)}
${ans('en', 'C3b — keyset', code(F.PRODUCTS, 'js') + out(O.C3_CURL) + '<p>The client sends back the last id it saw (<code>next</code>); the query is <code>WHERE id &lt; $1 ORDER BY id DESC LIMIT 13</code> — one extra row tells whether a next page exists. It never repeats or skips a row, and its cost does not grow with the page number (Lab 5 measured OFFSET on a million rows).</p>')}
<p>Order detail — the starter's <code>GET /orders/:id</code> uses nested <code>select</code>. Turn on the SQL log (<code>LOG_SQL=1</code>) and look at what Prisma really sends:</p>
${out(O.C3_LOG)}
<p>Five statements: one per <em>relation level</em>, each with <code>IN (…)</code> — not one per row. The <code>X-SQL-Count: 5</code> response header of the starter counts them. Now the "My orders" screen written the way many people first write it — a loop:</p>
${code(F.N1_LOOP, 'js')}
${bay('Trap — N+1.', 'One query for the list, then one per order, then one per line: 20 orders became 68 round trips. Each is fast; together they are 838 ms, and they grow with the page size. <code>npm run n1</code> measures three versions:', out(O.C3_N1))}
<p>Nested <code>select</code>: 3 statements. One <code>$queryRaw</code> with <code>json_agg</code> (PostgreSQL builds the JSON, Ch 13): 1 statement. The nested select is usually the right default — typed, readable, and constant in the number of statements; raw SQL when one screen is hot. (These times include a Seq Scan on 302.000 orders: there is no index on <code>customer_id</code> yet — C7.)</p>

<h4>C4 — rename a column without downtime: expand / contract</h4>
<p>The mobile team wants <code>delivery_note</code> instead of <code>note</code>. Lesson 16.1 showed that a rename generated by Prisma is a DROP + ADD (data lost) and that <code>RENAME COLUMN</code> keeps the data. But a rename is still <em>instant breakage</em> in a rolling deploy: for a minute, v1 instances are still running and selecting <code>note</code>. Expand / contract: add the new column, let both versions work, remove the old one only when v1 is gone.</p>
<p>First the tool problem — <code>migrate dev</code> needs a <strong>shadow database</strong>, and our owner role, rightly, cannot create databases:</p>
${out(O.C4_DEV)}
<p>Generate the SQL with <code>migrate diff</code> (no shadow database), save it as a migration, complete it, apply it with <code>migrate deploy</code> — the same workflow as this site's own repository (16.1):</p>
${code(C4_RUN, 'bash')}
${out(O.C4_DIFF)}
${ans('en', 'C4 — expand', code(F.EXPAND) + out(O.C4_DEPLOY) + '<p>The trigger copies every write of one column into the other — in both directions — so it does not matter which version wrote. <code>SET LOCAL lock_timeout</code>: <code>ADD COLUMN</code> without a default is instant, but it needs an ACCESS EXCLUSIVE lock for that instant; behind a long transaction it would wait and block everyone queued behind it (the queue of 16.1). The back-fill of 37.500 rows is fine inside the migration; with millions, run it in batches outside.</p>')}
<p>v1 is still running — it never restarted:</p>
${out(O.C4_V1)}
<p>Now v2 (the code with <code>delivery_note</code>, a second process on port 3010) next to it:</p>
${out(O.C4_V2)}
<p>Both versions read what the other wrote. Deploy v2 everywhere, stop v1, then contract:</p>
${ans('en', 'C4 — contract', out(O.C4_CDIFF) + code(F.CONTRACT) + out(O.C4_CDEPLOY))}
${bay('Trap — contracting while v1 still runs.', 'Run the contract migration while one v1 instance is still alive (forgotten worker, the second container of a rolling deploy) and its generated client still selects <code>note</code>:', out(O.C4_P2022))}
<p>P2022 = "the column does not exist in the current database". That is why contract is a <em>separate</em> deploy, after you have checked that nothing reads the old column — not the second half of the same migration.</p>

<h4>C5 — checkout: one transaction, two buyers</h4>
<p class="meo">💡 Lab 6 did checkout inside PostgreSQL (<code>place_order</code>). Here the app does it with an interactive transaction — <code>prisma.$transaction(async (tx) =&gt; …)</code>: BEGIN, your statements, COMMIT (or ROLLBACK if the function throws). The rule of 16.4 case 2: never read the stock in JavaScript and write back <code>stock - qty</code>. One atomic statement: "take qty if at least qty is left" — in Prisma, <code>updateMany</code> with <code>where: { stock: { gte: qty } }</code> and <code>data: { stock: { decrement: qty } }</code>; it returns how many rows changed.</p>
${code(F.STARTER_CHECKOUT, 'js')}
${ans('en', 'C5a — the transaction', code(F.GOM_GIO, 'js') + code(F.CHECKOUT, 'js') + out(O.C5_CURL) + '<p>The same product twice in the cart became one line of 3; the price is read from rows <em>we</em> have locked; the out-of-stock order left nothing behind — product 4 still has 195 (the first line was rolled back with the rest).</p>')}
<p>Now the race, on the test database (<code>npm run db:test</code>, then <code>npm run race</code>): a gel pen with one unit left, two buyers in the same millisecond — first with the read-modify-write version, then with the atomic one:</p>
${out(O.C5_RACE)}
${bay('Trap — read-modify-write sells what you do not have.', 'Case 1: both buyers read stock = 1, both checked "1 ≥ 1", the second UPDATE waited for the first one\'s row lock and then wrote its own stale result, 0. Two orders, one unit gone from stock, no error anywhere — the lost update of 11.4, in an ORM. Case 2: the second <code>UPDATE … WHERE stock &gt;= 1</code> waited for the lock, re-checked its WHERE on the <em>new</em> row (PostgreSQL does that in READ COMMITTED), matched 0 rows ⇒ 409.')}
<p>Case 3 is the deadlock of 11.3: cart A takes pen 1 then pen 2, cart B pen 2 then pen 1, with 200 ms between the lines. PostgreSQL kills one of them after <code>deadlock_timeout</code> (1 s). Two fixes, and you want both: sort the cart (3c — the second buyer just waits ~0,8 s, no deadlock can form) and retry the whole transaction when PostgreSQL reports a collision (3b).</p>
${bay('Trap — the retry that never retries.', 'Every guide says "retry on P2034". Measured on Prisma 5.22, a deadlock inside an interactive transaction does <em>not</em> come as P2034 — it comes as <code>PrismaClientUnknownRequestError</code> with no <code>.code</code> at all; the SQLSTATE 40P01 is only inside the message text. P2034 is what a Serializable conflict gives:', out(O.C5_ERR))}
${ans('en', 'C5c — retry', code(F.RETRY, 'js') + '<p>Retry the <strong>whole</strong> transaction (a new BEGIN), a bounded number of times, with jitter — not the failed statement, since PostgreSQL has already rolled everything back.</p>')}

<h4>C6 — payment and the connection pool</h4>
<p>The arithmetic first (16.4 case 3, lesson 14.1). <code>max_connections</code> minus the superuser reserve is what apps may use:</p>
${out(O.C6_MAX)}
<p>CT Shop runs <strong>3 API processes × <code>connection_limit=5</code> = 15</strong> connections, far below 97 — leaving room for migrations, psql, monitoring, and a fourth process on a busy day. Prisma's default would be 2 × CPU cores + 1 <em>per process</em>: 25 on a 12-core machine, 75 for three processes — the shape of "too many clients already".</p>
<p>Now the payment endpoint. The obvious version opens a transaction, locks the order, calls the payment gateway (300 ms), writes the payment, commits:</p>
${code(F.PAY_HOLD, 'js')}
<p>Measure it: 400 payments, 50 clients at a time, pool of 5, <code>pool_timeout=2</code> — on the test database:</p>
${code(C6_RUN, 'bash')}
${out(O.C6_HOLD)}
${bay('Trap — a connection held while you wait for someone else.', 'All 5 connections sat <code>idle in transaction</code> — the state of 16.4 case 1 — each holding a row lock while the gateway thought. 5 connections × (1 / 0,3 s) ≈ 16 payments per second at best; clients further back in the queue waited more than 2 s and got <strong>P2024</strong> ("Timed out fetching a new connection from the connection pool") or <strong>P2028</strong> (the transaction itself could not start within <code>maxWait</code>, 2 s by default). 120 of 400 failed, and the 280 that passed took 2,2 s each.')}
<p>"Make the pool bigger" works — on this test:</p>
${out(O.C6_HOLD20)}
<p>…with 20 connections <code>idle in transaction</code> per process, i.e. 60 of the 97 for three processes, each holding locks on orders — and the next traffic peak needs 40. The real fix is to not hold a connection while waiting:</p>
${ans('en', 'C6 — the payment', code(F.PAY, 'js') + out(O.C6_SHORT) + code(F.LOI, 'js') + '<p>Same pool of 5: 400 of 400, p50 = 327 ms (the gateway\'s 300 ms + ~27 ms of database), 6× the throughput. "Short transaction" also means the double-payment guard moved into the database: <code>WHERE status = \'pending\'</code> on the UPDATE and UNIQUE(order_id) on payment. And P2024/P2028 now answer 503 with a clear message instead of a 500 — a client can retry a 503.</p>')}

<h4>C7 — the revenue report, then make the two slow screens fast</h4>
<p class="meo">💡 Prisma has no <code>date_trunc</code> and no window functions ⇒ real SQL through <code>$queryRaw</code>. It is a <em>tagged template</em>: every <code>\${…}</code> becomes a parameter ($1, $2) sent separately, never pasted into the SQL text — no SQL injection. (<code>$queryRawUnsafe</code> with string concatenation is the version that is unsafe.) Months are Vietnamese months: pass instants (<code>2026-01-01T00:00:00+07:00</code>) and group by <code>paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'</code>.</p>
${ans('en', 'C7a — the report', code(F.REPORT, 'js') + out(O.C7_REPORT) + '<p>January–April 2026: 75 · 64 · 92 · 69 orders — the numbers of the 16.4 brief. <code>luy_ke</code> = <code>sum() OVER (ORDER BY thang)</code>, a running total; <code>tang_pct</code> = growth against <code>lag()</code>, the previous month (Ch 8).</p>')}
<p>Now the method of 16.4, in order: <em>which</em> query (Prisma's log), then <em>why</em> (EXPLAIN). The log of one report call:</p>
${out(O.C7_LOG)}
${code(C7_EXPLAIN)}
${out(O.C7_EXPLAIN_TRUOC)}
<p>Both screens read the whole table: 2.312 pages of payment to keep 956 rows, 2.854 pages of orders to keep 1.157 rows and sort them for 11. The indexes belong in <code>schema.prisma</code> (so the diff stays empty) and in migrations:</p>
${code(F.SCHEMA_IDX, 'ts')}
${out(O.C7_DIFF)}
<p class="meo">💡 Prisma writes <code>CREATE INDEX</code> — which takes a SHARE lock: reads go on, <strong>every INSERT/UPDATE/DELETE waits</strong> until the build ends. See it before you deploy it: in psql as the owner, <code>BEGIN; CREATE INDEX …</code> without committing, then place an order:</p>
${out(O.C7_LOCK)}
<p>The order waited on a <code>RowExclusiveLock</code> it could not get, and after the role's 3 s lock_timeout it was refused — with a clear 503 (55P03 is another error Prisma does not name; <code>src/loi.js</code> reads it from the message). Without lock_timeout it would have waited for the whole build, and so would every order behind it.</p>
${ans('en', 'C7b — two CONCURRENTLY migrations', code(F.IDX1) + code(F.IDX2) + out(O.C7_DEPLOY) + out(O.C7_DIFF_SAU) + out(O.C7_EXPLAIN_SAU) + '<p>Report: 2.318 → <strong>25</strong> pages, 52,3 → 0,87 ms. "My orders": 2.860 → <strong>15</strong> pages, 20,8 → 0,063 ms — and no Sort node: the index stores customer 42\'s orders already in <code>created_at DESC, id DESC</code> order, the LIMIT stops after 11 entries. One statement per migration file: two statements would make Prisma run the file as one transaction block, and CONCURRENTLY refuses that (25001, lesson 16.1).</p>')}
<p>"My orders" uses Prisma's cursor (<code>cursor: { id }, skip: 1</code>). What it sends for page 2 — read it, it is instructive:</p>
${ans('en', 'C7c — My orders', code(F.MY_ORDERS, 'js') + out(O.C7_MYORDERS) + out(O.C7_CURSOR) + '<p>Prisma turns the cursor into a row comparison through three subqueries on the cursor row, then <code>OFFSET 1</code> to skip it. Correct, and fast with the composite index; written by hand it would be <code>WHERE (created_at, id) &lt; ($2, $3)</code>. The two pending orders at the top are the ones you placed in C4.</p>')}
<p>And N+1 again, with the index:</p>
${out(O.C7_N1_SAU)}

<h4>C8 — integration tests on a database built from the migrations</h4>
<p class="meo">💡 <code>npm test</code> first runs <code>scripts/dung-db-kiem-thu.js</code>: drop <code>ctlab9_test</code>, create it empty, grant the two roles, apply <strong>your migrations</strong> with <code>migrate deploy</code>, write a small fixture as the app role — then the Node 22 test runner (<code>node --test</code>, nothing to install) runs <code>test/api.test.js</code> against the real Express app and the real PostgreSQL. This is where the faithful 0_init of C2 pays off: with the generated baseline, the "two buyers" test would still pass, but a test of the CHECKs would not — and nobody would know.</p>
${code(F.DB_TEST, 'js')}
${code(F.TEST_RACE, 'js')}
${out(O.C8_TEST)}

<h4>C9 — operations: the checklist, then a restore drill</h4>
<p>The 12-line script of 16.3 (<code>sql/kiem-tra.sql</code>), run twice — as the superuser and as the app:</p>
${code(C9_KT_RUN, 'bash')}
${out(O.C9_KT)}
${out(O.C9_KT_APP)}
<p>Read it line by line, and ask for each ✗ <em>who</em> can fix it. <strong>3</strong> and <strong>4</strong> read the settings of the current session: ✗ for postgres in psql (no limit — your own session), ✓ for ctshop_app (the role settings of C1). <strong>5–7</strong> are server settings — no role, no migration can change them; the superuser does, once:</p>
${code(C9_SUA)}
${out(O.C9_SUA)}
<p>Note the table: <code>ALTER SYSTEM</code> only writes <code>postgresql.auto.conf</code> — nothing changed until the restart. After it:</p>
${out(O.C9_KT_SAU)}
<p><strong>8</strong> = 6 foreign keys without an index (<code>order_item.product_id</code>, <code>product.category_id</code>, <code>category.parent_id</code>, <code>stock_movement.product_id</code>, <code>stock_movement.order_id</code>, <code>review.customer_id</code>). C7 indexed the one a screen needs; the others only slow down deleting a product or a category — a decision to write down, not an automatic ✗. And now <code>pg_stat_statements</code> answers "what did the API spend its time on?" after a few hundred requests:</p>
${code(C9_TOP)}
${out(O.C9_TOP)}
<p>The report is on top — 5 of its 25 calls asked for 2023–2024, where 99 % of the payments match and the planner rightly reads the whole table (see the extra challenge). That is the slow burn the live view never shows. Finally the restore drill of Ch 15 — a backup you have never restored is a hope, not a backup:</p>
${out(O.C9_RESTORE)}
${code(C9_DIFF, 'bash')}
${out(O.C9_DEM)}
${out(O.C9_STATUS)}
${out(O.C9_APP)}
${bay('Trap — what the dump did not bring back.', 'Row counts, sums, the migration history, the app: identical. But look at the database itself:', out(O.C9_ACL) + '<p><code>datacl</code> is empty on the copy = the default, PUBLIC may CONNECT. The REVOKE/GRANT CONNECT of C1 live on the <em>database</em> object, which <code>pg_dump</code> without <code>--create</code> does not dump (and roles are not in any per-database dump at all — <code>pg_dumpall --roles-only</code>, lesson 15.1). Write it into the runbook: after a restore, run the database-level part of roles.sql again.</p>')}

<h3>5 · Self-check — your end state must match</h3>
<ol>
<li><code>npm test</code>: 8 pass · <code>migrate status</code>: 5 migrations, up to date · <code>migrate diff</code>: empty.</li>
<li><code>has_table_privilege('ctshop_app', 'shop._prisma_migrations', 'DELETE')</code> = f · role settings 5s / 10s / 3s.</li>
<li><code>\\d shop.orders</code>: <code>delivery_note</code>, no <code>note</code>, no trigger; indexes <code>orders_customer_id_created_at_id_idx</code> and <code>payment_paid_at_idx</code> valid.</li>
</ol>
<ol>
<li>Why is <code>migrate resolve --applied 0_init</code> correct on ctlab9, and what would the same command mean after a migration failed halfway?</li>
<li>The read-modify-write checkout and the atomic one both ran in a transaction. Why did only one of them oversell?</li>
<li>A bigger pool removed the P2024 errors of the HOLD test. Why is it still the wrong fix?</li>
</ol>
${details('Answers', '<ol><li>A baseline records a fact: every object of 0_init already exists in ctlab9 (you compared them, and replayed 0_init on an empty database). After a half-applied migration, "applied" would be false — it hides a schema that matches neither the old nor the new state; 16.1 resolves only after checking which statements ran, and with the user\'s decision.</li><li>A transaction does not make "read, compute in JavaScript, write back" atomic: under READ COMMITTED both transactions read 1, and the second one waited for the row lock and then wrote its own stale 0. The atomic <code>UPDATE … SET stock = stock - 1 WHERE stock &gt;= 1</code> re-evaluates its condition on the newest row after the wait — 0 rows ⇒ 409.</li><li>The cause was a connection held during a 300 ms external call. 20 connections per process just hold 4× more of them idle in transaction with row locks — 60 of 97 for three processes — and the next peak needs more. Moving the gateway out of the transaction served the same 400 payments with 5 connections, 6× faster.</li></ol>')}

<h3>6 · Full solution</h3>
<p>Everything is in <code>lab9-solution.zip</code> (its README lists where each answer lives and the exact commands to bring a fresh ctlab9 to the end state). The heart of it:</p>
${details('src/checkout.js — gomGio + laVaCham/voiThuLai + datHang', code(F.GOM_GIO + '\n\n' + F.RETRY + '\n' + F.CHECKOUT, 'js'))}
${details('src/routes/orders.js — the payment · src/loi.js — errors ⇒ HTTP', code(F.PAY, 'js') + code(F.LOI, 'js'))}
${details('The 5 migrations', code(F.INIT_TAY) + code(F.EXPAND) + code(F.CONTRACT) + code(F.IDX1) + code(F.IDX2))}

<h3>7 · Traps</h3>
<div class="pitfall"><p><strong>A health check that touches no table</strong> — "ok" while every real query fails. Check what the app actually needs.</p></div>
<div class="pitfall"><p><strong>The generated baseline</strong> — no CHECKs, SERIAL instead of IDENTITY. Complete it, and prove it on an empty database.</p></div>
<div class="pitfall"><p><strong><code>resolve --applied</code> as a reflex</strong> — right for a baseline, wrong for a migration that failed (16.1).</p></div>
<div class="pitfall"><p><strong>Default privileges reach <code>_prisma_migrations</code></strong> — revoke it from the app.</p></div>
<div class="pitfall"><p><strong>BigInt → <code>Number</code>, money → float</strong> — ids as strings, money as Decimal.</p></div>
<div class="pitfall"><p><strong>OFFSET pagination on a list that changes</strong> — duplicates and gaps. Keyset.</p></div>
<div class="pitfall"><p><strong>N+1</strong> — a query in a loop. Count the statements (<code>LOG_SQL=1</code>, <code>X-SQL-Count</code>); nested select or one SQL.</p></div>
<div class="pitfall"><p><strong>A rename in one migration, or a contract while v1 runs</strong> — P2022 in production. Expand, deploy, stop v1, contract.</p></div>
<div class="pitfall"><p><strong>Read-modify-write inside a transaction</strong> — still oversells. One atomic UPDATE with the condition in WHERE.</p></div>
<div class="pitfall"><p><strong>Carts locked in arrival order</strong> — deadlocks. Sort by id, and retry on 40001/40P01 — including the 40P01 Prisma does not label.</p></div>
<div class="pitfall"><p><strong>An external call inside a transaction</strong> — idle in transaction, row locks, P2024/P2028 under load. Call outside, write in a short transaction.</p></div>
<div class="pitfall"><p><strong>Plain <code>CREATE INDEX</code> on a live table</strong> — writes wait. CONCURRENTLY, alone in its migration file; lock_timeout on the roles.</p></div>
<div class="pitfall"><p><strong>Load tests on the database you measure</strong> — run them on a copy built from the migrations (here ctlab9_test).</p></div>
<div class="pitfall"><p><strong>A restore that "worked"</strong> — compare counts, run migrate status, start the app on it, check the database-level grants.</p></div>

<h3>8 · Extra challenges — and you have finished the course</h3>
<ul>
<li><strong>Challenge 1 · the 2-year report.</strong> <code>?from=2023-01&amp;to=2024-12</code> matches 275.713 of 277.376 payments: the planner reads all 2.312 pages (133 ms, the top of pg_stat_statements). No index helps when you want 99 % of a table. Build a monthly summary (a materialized view refreshed nightly, Lab 6, or a summary table kept by a trigger) and make the report read it for closed months.</li>
<li><strong>Challenge 2 · CHECKs in tests.</strong> Add a test that a negative price or an unknown payment method is refused <em>by the database</em> (Prisma cannot see those rules), and run it once against a test database built from the <em>generated</em> 0_init to watch it fail.</li>
<li><strong>Challenge 3 · a fourth process.</strong> Add a worker process that sends order e-mails with its own PrismaClient. Redo the C6 arithmetic, give it its own <code>application_name</code>, and show it in <code>pg_stat_activity</code> grouped by application.</li>
<li><strong>Challenge 4 · read your writes.</strong> With the replica of Lab 8: route "My orders" to the replica, and prove that right after a checkout the new order is missing there — then fix it the way 16.4 case 4 says.</li>
</ul>
<p><strong>That was the last lab.</strong> You started with <code>CREATE TABLE customer</code> in Lab 1 and end with a tested API that adopts a production database, survives a rolling deploy, sells the last unit exactly once and can be restored. What next:</p>
${card('/exam?course=postgresql', '📝', 'Exam room — PostgreSQL: PE1 · PE2 · FE1 · FE2', 'Practical exams (SQL tasks on CT Shop, timed) and final multiple-choice exams over all chapters — with worked solutions', 'OPEN →')}
<ul>
<li><strong>Chapter 17</strong> puts PostgreSQL next to SQL Server, MySQL and MongoDB — the same CT Shop queries on three SQL servers and as documents. Useful at work and in interviews: "why PostgreSQL here?"</li>
<li>Keep the app: port it to TypeScript (Prisma's types are already generated), put it in Docker next to PostgreSQL (course Docker), deploy it to a VPS with the checklist (course Deploy VPS).</li>
</ul>
</div>
`;

const VI = `
<div class="ml-vi">
<span class="eyebrow">Lab 9 · CT Shop · capstone · sau Chương 16</span>
<h2>API cho app di động — cả khoá học trong một dịch vụ Node</h2>
<p class="lead">Tám lab trước dựng CT Shop bên trong PostgreSQL: lược đồ (Lab 1–2), truy vấn và báo cáo (3–4), chỉ mục (5), thanh toán đúng (6), tìm kiếm (7), sao lưu và bản sao (8). Giờ một ứng dụng thật phải sống trên nó — và ứng dụng mang theo đúng những thứ khoá học đã cảnh báo: một ORM gửi SQL bạn không tự viết, một pool kết nối có ngày cạn, migration khoá bảng, hai người bấm "Thanh toán" cùng một giây, và một lần deploy mà bản cũ vẫn đang chạy. Lab này là đề bài của bài 16.4, làm thật.</p>

<h3>1 · Đề bài</h3>
<p>Phiếu việc của nhóm CT Shop:</p>
<ul>
<li><strong>App di động</strong> cần một API: danh sách sản phẩm có tìm kiếm, "Đơn của tôi", chi tiết đơn, đặt hàng, thanh toán, và màn doanh thu cho chủ shop. Node.js 22 + Prisma, vì nhóm web đã quen.</li>
<li>Database <strong>đã có sẵn</strong> và đang chạy production — 302.000 đơn, hai năm lịch sử chuyển từ hệ thống cũ. Prisma phải <em>nhận</em> nó, không được tạo lại.</li>
<li>Bảo mật: app <strong>không được đổi lược đồ</strong>; migration chạy bằng một tài khoản riêng, trong lúc deploy.</li>
<li>Nhóm mobile đổi tên một trường: <code>note</code> thành <code>delivery_note</code>. <strong>Không được dừng dịch vụ</strong> — trong lúc deploy, bản cũ và bản mới chạy song song.</li>
<li>Black Friday: <strong>hai người mua, một món cuối</strong> — đúng một đơn, kho không bao giờ âm, thanh toán không bao giờ treo.</li>
<li>Thanh toán đi qua một cổng trả lời sau ~300 ms. Khi tải cao, API không được sập.</li>
<li>Trước khi lên: <strong>script checklist</strong> của 16.3 và một lần <strong>diễn tập khôi phục</strong>.</li>
</ul>
<p>Lần xem trước ở 16.4 đã chạy trên một bản sao CT Shop: <code>db pull</code> ra 8 model và cảnh báo về ràng buộc CHECK; ba đơn mới nhất của khách 42 là 1841 (shipped), 1256 (shipped), 1238 (paid); số đơn đã thanh toán tháng 1–4/2026 là 75, 64, 92, 69. Lab này bắt đầu từ đúng database đó và về đúng các con số đó.</p>
<p>Công cụ: cả khoá — ràng buộc (Ch 3), chỉ mục và EXPLAIN (Ch 9–10), giao dịch, khoá, deadlock (Ch 11), trigger (Ch 12), pool, timeout, <code>pg_stat_statements</code> (Ch 14), sao lưu (Ch 15), migration Prisma, expand/contract, <code>CONCURRENTLY</code> và checklist (Ch 16). Mới, giảng ngắn ngay chỗ dùng: migration <strong>baseline</strong>, <code>directUrl</code> của Prisma, <code>ALTER DEFAULT PRIVILEGES</code>, phân trang cursor của Prisma, các mã lỗi P2022 / P2024 / P2028 / P2034, thử tải bằng autocannon và bộ chạy test của Node.</p>

<h3>2 · Yêu cầu và tiêu chí đạt</h3>
<ol>
<li><strong>C1</strong> — hai tài khoản: <code>ctshop_owner</code> (sở hữu lược đồ, chạy migration) và <code>ctshop_app</code> (chỉ đụng vào dòng), default privileges cho bảng tương lai, timeout trên role.</li>
<li><strong>C2</strong> — Prisma nhận CT Shop: <code>db pull</code>, migration baseline <code>0_init</code> dựng lại được lược đồ <em>thật</em>, <code>migrate resolve --applied</code>, status và diff sạch.</li>
<li><strong>C3</strong> — các endpoint đọc: BigInt và Decimal trong JSON, phân trang keyset, đo bẫy N+1.</li>
<li><strong>C4</strong> — đổi tên <code>orders.note</code> → <code>delivery_note</code> bằng expand / contract trong khi app v1 vẫn chạy.</li>
<li><strong>C5</strong> — đặt hàng: đơn + dòng đơn + kho trong MỘT giao dịch, không đọc-sửa-ghi, hai người mua, deadlock, thử lại.</li>
<li><strong>C6</strong> — thanh toán và pool: phép tính, P2024 khi tải cao, cách sửa thật.</li>
<li><strong>C7</strong> — báo cáo doanh thu bằng hàm cửa sổ; log của Prisma → EXPLAIN → migration chỉ mục <code>CONCURRENTLY</code> → EXPLAIN lại.</li>
<li><strong>C8</strong> — test tích hợp trên một database dựng lại từ chính migration của bạn.</li>
<li><strong>C9</strong> — vận hành: đọc từng dòng script checklist, và diễn tập khôi phục.</li>
</ol>
<div class="callout ok"><p><strong>Bạn đạt khi:</strong> <code>npm test</code> in <strong>8 pass, 0 fail</strong> · <code>migrate diff</code> in <code>-- This is an empty migration.</code> · một database dựng lại từ migration có <strong>11</strong> ràng buộc CHECK và từ chối <code>stock = -5</code> · hai người mua món cuối cho đúng một <strong>201</strong> và một <strong>409</strong> · 400 lần thanh toán khi tải cao trên pool 5 cho <strong>400 × 201</strong> · báo cáo đọc <strong>25</strong> trang thay vì 2.318, "Đơn của tôi" <strong>15</strong> thay vì 2.860 · bản khôi phục khớp từng dòng (302.002 đơn ở lượt chạy của chúng tôi) và <code>migrate status</code> trên nó báo "up to date".</p></div>
<p><strong>Thời gian trên máy bạn sẽ khác</strong> (của chúng tôi: laptop, Docker Desktop). Hãy so cái không đổi: số dòng, mã trạng thái, nút kế hoạch, số trang trong <code>Buffers</code>, số câu SQL, tỉ lệ trước/sau.</p>
<h4>Thang điểm (10 điểm)</h4>
${RUBRIC(true)}

<h3>3 · Tệp tải về và chuẩn bị</h3>
${FILES(true)}
<p>Bạn cần <strong>Node.js 22</strong> (<code>node -v</code>) và container PostgreSQL 17 ở bài 0.3, mở cổng <strong>5444</strong> (mật khẩu 123456). Bên dưới gọi nó là <code>pgdemo</code>; nếu container của bạn tên <code>pg17</code> thì thay tên đó vào (hoặc chạy một lần <code>docker rename pg17 pgdemo</code>). Mọi lệnh chạy giống nhau trên macOS, Linux và Windows (PowerShell hoặc Git Bash), trừ dòng nào ghi khác.</p>
${code(SETUP, 'bash')}
<p>Tệp khởi đầu in dòng kiểm và các chỉ mục bạn có lúc đầu — chỉ có khoá chính và UNIQUE, <em>không khoá ngoại nào có chỉ mục</em>, cố ý:</p>
${out('categories | products | customers | orders | order_lines | payments | notes\n        12 |       48 |       300 | 302000 |      605000 |   277376 | 37500')}
<p>Tệp <code>.env</code> giữ ba chuỗi kết nối — cách chia này là quyết định thiết kế đầu tiên của lab:</p>
${code(F.ENV, 'bash')}
<p>Prisma đọc <code>DATABASE_URL</code> khi app chạy, và đọc <strong><code>directUrl</code></strong> trong mọi lệnh CLI (<code>db pull</code>, <code>migrate …</code>) — vốn để đi vòng qua một pooler như PgBouncer, và đúng là thứ ta cần để CLI dùng một <em>tài khoản</em> khác. Biến môi trường dùng một lần trong ba loại shell (dùng vài lần bên dưới):</p>
${code(ENVVAR, 'bash')}

<h3>4 · Từng bước</h3>

<h4>C1 — hai tài khoản: chủ sở hữu và ứng dụng</h4>
<p>Ca 3 của 16.4 và checklist 16.3 đã đòi: tài khoản app đăng nhập không được phép <code>DROP TABLE</code>. Migration cần <code>CREATE</code>, <code>ALTER</code>; một request chỉ cần <code>SELECT</code>/<code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code>. Vậy: hai role.</p>
<p class="meo">💡 Chủ sở hữu một bảng làm gì với nó cũng được — cho <code>ctshop_owner</code> sở hữu schema <code>shop</code> và 8 bảng (sequence identity đi theo bảng của nó). App được USAGE trên schema và bốn quyền trên bảng. <strong>Mới: <code>ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_owner IN SCHEMA shop GRANT …</code></strong> — quyền tự áp cho mọi bảng mà owner tạo <em>về sau</em>, tức là do các migration tương lai. Và timeout của 16.3 đặt trên role, để không nhánh mã nào quên được.</p>
<p>Trước khi viết, chạy starter như đang có — thiếu các dòng quyền, app đăng nhập được nhưng còn không <em>thấy</em> schema. Để ý <code>/health</code> vẫn báo ok: <code>SELECT current_user</code> không đụng bảng nào. Một healthcheck không đụng tới dữ liệu chứng minh được ít hơn bạn tưởng.</p>
${out(O.C1_42501)}
${ans('vi', 'C1', code(F.ROLES) + code(C1_RUN, 'bash') + out(O.C1_ROLES) + out(O.C1_DP) + '<p><code>arwdDxtm</code> = mọi quyền (chủ sở hữu); <code>arwd</code> = append (INSERT), read (SELECT), write (UPDATE), delete. Vì sao các timeout này: <strong>5 s</strong> statement_timeout — không màn hình nào của app di động được chờ lâu hơn, câu chạy mất kiểm soát bị huỷ thay vì ngốn một kết nối; <strong>10 s</strong> idle_in_transaction — ca 1 của 16.4 không thể kéo dài cả buổi chiều; <strong>3 s</strong> lock_timeout — request kẹt sau một migration hỏng nhanh với lỗi rõ ràng (bạn sẽ thấy ở C7) thay vì xếp hàng. Owner cũng có lock_timeout 5 s, nhưng <strong>không</strong> có statement_timeout: dựng chỉ mục trên bảng lớn có thể mất vài phút là chuyện bình thường.</p>')}

<h4>C2 — Prisma nhận CT Shop: db pull và baseline</h4>
<p>CT Shop được tạo bằng các tệp SQL, không phải bằng Prisma. Prisma Migrate phải biết là nó đã tồn tại, mà không thử tạo lại nó.</p>
${code(C2_RUN, 'bash')}
${out(O.C2_PULL)}
${out(O.C2_STATUS0)}
<p class="meo">💡 <strong>Baseline</strong>: migration đầu tiên mô tả cái đã có. <code>migrate diff --from-empty --to-schema-datamodel</code> viết ra SQL dựng <code>schema.prisma</code> từ con số không. Đọc nó trước khi tin — đây là phần đầu:</p>
${out(O.C2_GEN)}
${bay('Bẫy — baseline Prisma viết ra KHÔNG phải lược đồ của bạn.', 'Hai khác biệt im lặng. <code>SERIAL</code> ở chỗ CT Shop dùng <code>GENERATED ALWAYS AS IDENTITY</code>, và <strong>không</strong> ràng buộc CHECK nào — db pull cảnh báo 11 cái, tệp sinh ra cứ thế bỏ qua. Trên production tệp này không bao giờ chạy, vậy thì sao? Mọi database dựng <em>từ migration</em>: database test của CI, một bạn dev mới, một lần dựng lại sau sự cố. Áp lên một database trống, tệp sinh ra nhận cả tồn kho âm lẫn id tự ghi:', out(O.C2_GEN_TEST))}
${ans('vi', 'C2 (baseline)', '<p>Sửa tệp sinh ra: bảy chỗ <code>SERIAL</code>/<code>BIGSERIAL</code> thành <code>INTEGER</code>/<code>BIGINT GENERATED ALWAYS AS IDENTITY</code> (sed hoặc sửa tay), và nối thêm 11 CHECK, chép từ <code>pg_dump --schema-only</code> của ctlab9:</p>' + code(F.INIT_TAY) + '<p>Chứng minh — phát lại migration lên một database trống do ctshop_owner sở hữu:</p>' + code(C2_REPLAY_CMD, 'bash') + out(O.C2_REPLAY) + out(O.C2_REPLAY_CHECK) + '<p>11 CHECK, identity <code>a</code> (= ALWAYS) trên cả bảy bảng, và <code>stock = -5</code> bị từ chối. Bản so của chính Prisma giữa ctlab9 và bản phát lại là rỗng — đằng nào nó cũng không thấy CHECK, chính vì thế mới phải kiểm bằng SQL. Xong thì xoá <code>ctlab9_replay</code>.</p>')}
<p>Giờ báo cho Prisma rằng ctlab9 <em>đã có</em> 0_init:</p>
${code(C2_RESOLVE, 'bash')}
${out(O.C2_RESOLVE + '\n\n' + O.C2_STATUS1 + '\n\n' + O.C2_DIFF)}
<div class="callout warn"><p><strong>Vì sao <code>resolve --applied</code> đúng ở đây — và sai ở gần như mọi chỗ khác.</strong> Nó ghi một dòng vào <code>_prisma_migrations</code> nói "migration này đã chạy", mà không chạy nó. Với baseline, câu đó là <em>sự thật</em>: mọi bảng của 0_init đều có, bạn vừa so xong. Luật ở 16.1 — không bao giờ tự resolve một migration <em>hỏng</em> — nói về tình huống ngược lại: migration chạy dở, nơi "applied" là lời nói dối che một lược đồ hỏng. Cùng một lệnh; một bên ghi nhận sự thật, một bên xoá bằng chứng.</p></div>
${bay('Bẫy — default privileges hào phóng quá tay.', '<code>migrate resolve</code> tạo <code>shop._prisma_migrations</code> bằng ctshop_owner, nên bước 3 của roles.sql trao luôn cho app quyền SELECT, INSERT, UPDATE, DELETE trên lịch sử migration. App xoá được dòng ở đó là app làm được lần deploy sau bỏ qua một migration. Lấy lại (và script dựng DB test cũng làm thế):', code(F.SAU_BASELINE) + out(O.C2_REVOKE))}

<h4>C3 — các endpoint đọc: JSON, phân trang, N+1</h4>
<p>Chạy starter (<code>npm run dev</code>) rồi hỏi danh mục hàng:</p>
${out(O.C3_500)}
<p>Mọi id trong CT Shop là <code>bigint</code>, Prisma trả về <code>BigInt</code> của JavaScript — và <code>JSON.stringify</code> từ chối BigInt. Đổi sang <code>Number</code> thì "chạy được" cho tới khi id vượt 2<sup>53</sup>; API gửi id dạng <strong>chuỗi</strong>. Tiền là <code>numeric(12,2)</code>, Prisma trả <code>Prisma.Decimal</code>, mà JSON của nó vốn đã là chuỗi:</p>
${ans('vi', 'C3a', code(F.APP_JSON, 'js') + out(O.C3_TIEN) + '<p>Bẫy số thực trong một dòng: VAT 8 % của cuốn sổ 59.000 đ là 63720.00000000001 nếu là number của JavaScript, đúng 63720 nếu là Decimal, và PostgreSQL cũng vậy (<code>float8</code> so với <code>numeric</code>). Luật: tiền là <code>numeric</code> trong database, <code>Decimal</code> trong app (<code>src/tien.js</code> cộng dòng bằng <code>.plus/.times</code>), chuỗi khi đi qua mạng. Không bao giờ <code>Float</code> trong schema.prisma.</p>')}
<p>Phân trang. Starter phân trang bằng <code>skip</code> (= <code>OFFSET</code>). Mới nhất trước, thêm một sản phẩm giữa hai lần tải trang — trên database test (C8 dựng nó; chạy <code>npm run db:test</code> ngay bây giờ):</p>
${out(O.C3_KEYSET)}
${ans('vi', 'C3b — keyset', code(F.PRODUCTS, 'js') + out(O.C3_CURL) + '<p>Client gửi lại id cuối nó đã thấy (<code>next</code>); câu truy vấn là <code>WHERE id &lt; $1 ORDER BY id DESC LIMIT 13</code> — một dòng dư cho biết còn trang sau không. Nó không bao giờ lặp hay bỏ sót dòng, và chi phí không tăng theo số trang (Lab 5 đã đo OFFSET trên một triệu dòng).</p>')}
<p>Chi tiết đơn — <code>GET /orders/:id</code> của starter dùng <code>select</code> lồng nhau. Bật log SQL (<code>LOG_SQL=1</code>) rồi xem Prisma thật sự gửi gì:</p>
${out(O.C3_LOG)}
<p>Năm câu: mỗi <em>tầng quan hệ</em> một câu, câu nào cũng <code>IN (…)</code> — không phải mỗi dòng một câu. Header <code>X-SQL-Count: 5</code> của starter đếm chúng. Giờ là màn "Đơn của tôi" viết theo cách nhiều người viết lần đầu — một vòng lặp:</p>
${code(F.N1_LOOP, 'js')}
${bay('Bẫy — N+1.', 'Một câu lấy danh sách, rồi mỗi đơn một câu, rồi mỗi dòng một câu: 20 đơn thành 68 lượt đi về. Câu nào cũng nhanh; cộng lại 838 ms, và tăng theo cỡ trang. <code>npm run n1</code> đo ba cách viết:', out(O.C3_N1))}
<p><code>select</code> lồng: 3 câu. Một <code>$queryRaw</code> với <code>json_agg</code> (PostgreSQL tự dựng JSON, Ch 13): 1 câu. select lồng thường là mặc định đúng — có kiểu, dễ đọc, số câu không đổi; SQL thô khi một màn hình thật sự nóng. (Thời gian ở đây gồm cả một Seq Scan trên 302.000 đơn: <code>customer_id</code> chưa có chỉ mục — C7.)</p>

<h4>C4 — đổi tên cột không dừng dịch vụ: expand / contract</h4>
<p>Nhóm mobile muốn <code>delivery_note</code> thay cho <code>note</code>. Bài 16.1 cho thấy đổi tên do Prisma sinh là DROP + ADD (mất dữ liệu) và <code>RENAME COLUMN</code> giữ được dữ liệu. Nhưng đổi tên vẫn là <em>hỏng ngay lập tức</em> khi deploy cuốn chiếu: trong một phút, các instance v1 vẫn chạy và vẫn SELECT <code>note</code>. Expand / contract: thêm cột mới, cho hai bản cùng chạy được, chỉ bỏ cột cũ khi v1 đã tắt hết.</p>
<p>Trước hết là chuyện công cụ — <code>migrate dev</code> cần một <strong>shadow database</strong>, mà role owner của ta, đúng ra, không được tạo database:</p>
${out(O.C4_DEV)}
<p>Sinh SQL bằng <code>migrate diff</code> (không cần shadow database), lưu thành một migration, viết nốt, áp bằng <code>migrate deploy</code> — đúng quy trình của chính repo trang này (16.1):</p>
${code(C4_RUN, 'bash')}
${out(O.C4_DIFF)}
${ans('vi', 'C4 — expand', code(F.EXPAND) + out(O.C4_DEPLOY) + '<p>Trigger chép mọi lần ghi vào cột này sang cột kia — cả hai chiều — nên bản nào ghi cũng được. <code>SET LOCAL lock_timeout</code>: <code>ADD COLUMN</code> không default thì tức thì, nhưng vẫn cần khoá ACCESS EXCLUSIVE trong chính khoảnh khắc đó; đứng sau một giao dịch dài, nó sẽ chờ và chặn mọi người xếp hàng sau nó (hàng đợi ở 16.1). Back-fill 37.500 dòng trong migration là ổn; hàng triệu dòng thì chạy theo lô, ngoài migration.</p>')}
<p>v1 vẫn đang chạy — nó chưa hề khởi động lại:</p>
${out(O.C4_V1)}
<p>Giờ v2 (mã dùng <code>delivery_note</code>, tiến trình thứ hai ở cổng 3010) chạy bên cạnh:</p>
${out(O.C4_V2)}
<p>Hai bản đọc được thứ bản kia ghi. Deploy v2 khắp nơi, tắt v1, rồi mới contract:</p>
${ans('vi', 'C4 — contract', out(O.C4_CDIFF) + code(F.CONTRACT) + out(O.C4_CDEPLOY))}
${bay('Bẫy — contract khi v1 vẫn còn chạy.', 'Chạy migration contract trong lúc vẫn còn một instance v1 (worker bị quên, container thứ hai của lần deploy cuốn chiếu) mà Prisma Client của nó vẫn SELECT <code>note</code>:', out(O.C4_P2022))}
<p>P2022 = "cột không tồn tại trong database hiện tại". Vì thế contract là một lần deploy <em>riêng</em>, sau khi đã kiểm không còn gì đọc cột cũ — không phải nửa sau của cùng một migration.</p>

<h4>C5 — đặt hàng: một giao dịch, hai người mua</h4>
<p class="meo">💡 Lab 6 làm thanh toán bên trong PostgreSQL (<code>place_order</code>). Ở đây app tự làm bằng giao dịch tương tác — <code>prisma.$transaction(async (tx) =&gt; …)</code>: BEGIN, các câu của bạn, COMMIT (hoặc ROLLBACK nếu hàm ném lỗi). Luật của 16.4 ca 2: không bao giờ đọc tồn kho vào JavaScript rồi ghi lại <code>stock - qty</code>. Một câu nguyên tử: "lấy qty nếu còn ít nhất qty" — trong Prisma là <code>updateMany</code> với <code>where: { stock: { gte: qty } }</code> và <code>data: { stock: { decrement: qty } }</code>; nó trả về số dòng đã đổi.</p>
${code(F.STARTER_CHECKOUT, 'js')}
${ans('vi', 'C5a — giao dịch', code(F.GOM_GIO, 'js') + code(F.CHECKOUT, 'js') + out(O.C5_CURL) + '<p>Cùng một sản phẩm hai lần trong giỏ thành một dòng số lượng 3; giá đọc từ chính các dòng <em>ta</em> đang khoá; đơn hết hàng không để lại gì — sản phẩm 4 vẫn còn 195 (dòng đầu đã bị ROLLBACK cùng mọi thứ khác).</p>')}
<p>Giờ cuộc đua, trên database test (<code>npm run db:test</code>, rồi <code>npm run race</code>): cây bút gel còn đúng một cây, hai người mua cùng một mili giây — đầu tiên bằng bản đọc-sửa-ghi, sau đó bằng bản nguyên tử:</p>
${out(O.C5_RACE)}
${bay('Bẫy — đọc-sửa-ghi bán cả thứ bạn không có.', 'Trường hợp 1: cả hai đọc stock = 1, cả hai kiểm "1 ≥ 1", câu UPDATE thứ hai chờ khoá dòng của câu thứ nhất rồi ghi kết quả cũ của chính nó, 0. Hai đơn, kho chỉ mất một cây, không lỗi ở đâu cả — lost update của 11.4, trong một ORM. Trường hợp 2: câu <code>UPDATE … WHERE stock &gt;= 1</code> thứ hai chờ khoá, kiểm lại WHERE trên dòng <em>mới</em> (PostgreSQL làm thế ở READ COMMITTED), khớp 0 dòng ⇒ 409.')}
<p>Trường hợp 3 là deadlock của 11.3: giỏ A lấy bút 1 rồi bút 2, giỏ B bút 2 rồi bút 1, cách nhau 200 ms giữa hai dòng. PostgreSQL giết một bên sau <code>deadlock_timeout</code> (1 giây). Hai cách sửa, và nên có cả hai: sắp xếp giỏ (3c — người thứ hai chỉ chờ ~0,8 giây, không thể thành vòng) và thử lại cả giao dịch khi PostgreSQL báo va chạm (3b).</p>
${bay('Bẫy — vòng thử lại không bao giờ thử lại.', 'Hướng dẫn nào cũng bảo "thử lại khi P2034". Đo thật trên Prisma 5.22, deadlock trong giao dịch tương tác <em>không</em> đến dưới dạng P2034 — nó là <code>PrismaClientUnknownRequestError</code>, không có <code>.code</code>; SQLSTATE 40P01 chỉ nằm trong chữ của thông báo. P2034 là thứ xung đột Serializable trả về:', out(O.C5_ERR))}
${ans('vi', 'C5c — thử lại', code(F.RETRY, 'js') + '<p>Thử lại <strong>cả</strong> giao dịch (BEGIN mới), số lần có giới hạn, có độ trễ ngẫu nhiên — không phải thử lại câu hỏng, vì PostgreSQL đã ROLLBACK hết rồi.</p>')}

<h4>C6 — thanh toán và pool kết nối</h4>
<p>Phép tính trước (16.4 ca 3, bài 14.1). <code>max_connections</code> trừ phần giữ cho superuser là phần app được dùng:</p>
${out(O.C6_MAX)}
<p>CT Shop chạy <strong>3 tiến trình API × <code>connection_limit=5</code> = 15</strong> kết nối, rất xa 97 — chừa chỗ cho migration, psql, giám sát, và một tiến trình thứ tư vào ngày đông. Mặc định của Prisma là 2 × số nhân CPU + 1 <em>cho mỗi tiến trình</em>: 25 trên máy 12 nhân, 75 cho ba tiến trình — chính là hình dạng của "too many clients already".</p>
<p>Giờ endpoint thanh toán. Bản hiển nhiên mở giao dịch, khoá đơn, gọi cổng thanh toán (300 ms), ghi thanh toán, commit:</p>
${code(F.PAY_HOLD, 'js')}
<p>Đo nó: 400 lần thanh toán, 50 client cùng lúc, pool 5, <code>pool_timeout=2</code> — trên database test:</p>
${code(C6_RUN, 'bash')}
${out(O.C6_HOLD)}
${bay('Bẫy — giữ kết nối trong lúc chờ người khác.', 'Cả 5 kết nối ngồi <code>idle in transaction</code> — đúng trạng thái của 16.4 ca 1 — mỗi cái giữ một khoá dòng trong lúc cổng thanh toán suy nghĩ. 5 kết nối × (1 / 0,3 s) ≈ cùng lắm 16 lượt mỗi giây; các client xếp sau chờ quá 2 giây và nhận <strong>P2024</strong> ("Timed out fetching a new connection from the connection pool") hoặc <strong>P2028</strong> (chính giao dịch không bắt đầu kịp trong <code>maxWait</code>, mặc định 2 giây). Hỏng 120 trên 400, và 280 lượt qua được mất 2,2 giây mỗi lượt.')}
<p>"Tăng pool lên" thì được — trên bài test này:</p>
${out(O.C6_HOLD20)}
<p>…với 20 kết nối <code>idle in transaction</code> mỗi tiến trình, tức 60 trên 97 cho ba tiến trình, cái nào cũng giữ khoá trên orders — và đỉnh tải sau cần 40. Cách sửa thật là đừng giữ kết nối trong lúc chờ:</p>
${ans('vi', 'C6 — thanh toán', code(F.PAY, 'js') + out(O.C6_SHORT) + code(F.LOI, 'js') + '<p>Cùng pool 5: 400 trên 400, p50 = 327 ms (300 ms của cổng + ~27 ms database), thông lượng gấp 6. "Giao dịch ngắn" cũng có nghĩa là chốt chặn trả tiền hai lần chuyển vào database: <code>WHERE status = \'pending\'</code> trên câu UPDATE và UNIQUE(order_id) trên payment. Và P2024/P2028 giờ trả 503 với thông báo rõ thay vì 500 — client được phép thử lại một 503.</p>')}

<h4>C7 — báo cáo doanh thu, rồi làm nhanh hai màn hình chậm</h4>
<p class="meo">💡 Prisma không có <code>date_trunc</code>, không có hàm cửa sổ ⇒ SQL thật qua <code>$queryRaw</code>. Đó là một <em>tagged template</em>: mỗi <code>\${…}</code> thành một tham số ($1, $2) gửi riêng, không bao giờ dán vào chữ SQL — không SQL injection. (<code>$queryRawUnsafe</code> với nối chuỗi mới là bản không an toàn.) Tháng là tháng Việt Nam: truyền mốc thời điểm (<code>2026-01-01T00:00:00+07:00</code>) và nhóm theo <code>paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'</code>.</p>
${ans('vi', 'C7a — báo cáo', code(F.REPORT, 'js') + out(O.C7_REPORT) + '<p>Tháng 1–4/2026: 75 · 64 · 92 · 69 đơn — đúng các con số trong đề 16.4. <code>luy_ke</code> = <code>sum() OVER (ORDER BY thang)</code>, tổng cộng dồn; <code>tang_pct</code> = tăng trưởng so với <code>lag()</code>, tháng trước (Ch 8).</p>')}
<p>Giờ là phương pháp của 16.4, đúng thứ tự: câu <em>nào</em> (log của Prisma), rồi <em>vì sao</em> (EXPLAIN). Log của một lần gọi báo cáo:</p>
${out(O.C7_LOG)}
${code(C7_EXPLAIN)}
${out(O.C7_EXPLAIN_TRUOC)}
<p>Cả hai màn đều đọc nguyên bảng: 2.312 trang payment để giữ 956 dòng, 2.854 trang orders để giữ 1.157 dòng rồi sắp lấy 11. Chỉ mục phải nằm trong <code>schema.prisma</code> (để diff rỗng) và trong migration:</p>
${code(F.SCHEMA_IDX, 'ts')}
${out(O.C7_DIFF)}
<p class="meo">💡 Prisma viết <code>CREATE INDEX</code> — lấy khoá SHARE: đọc vẫn chạy, <strong>mọi INSERT/UPDATE/DELETE phải chờ</strong> tới khi dựng xong. Xem tận mắt trước khi deploy: trong psql bằng owner, <code>BEGIN; CREATE INDEX …</code> mà không commit, rồi đặt một đơn:</p>
${out(O.C7_LOCK)}
<p>Đơn hàng chờ một <code>RowExclusiveLock</code> không lấy được, và sau lock_timeout 3 giây của role thì bị từ chối — với một 503 rõ ràng (55P03 là thêm một lỗi Prisma không đặt tên; <code>src/loi.js</code> đọc nó từ thông báo). Không có lock_timeout thì nó chờ hết thời gian dựng chỉ mục, và mọi đơn xếp sau nó cũng thế.</p>
${ans('vi', 'C7b — hai migration CONCURRENTLY', code(F.IDX1) + code(F.IDX2) + out(O.C7_DEPLOY) + out(O.C7_DIFF_SAU) + out(O.C7_EXPLAIN_SAU) + '<p>Báo cáo: 2.318 → <strong>25</strong> trang, 52,3 → 0,87 ms. "Đơn của tôi": 2.860 → <strong>15</strong> trang, 20,8 → 0,063 ms — và không còn nút Sort: chỉ mục cất sẵn đơn của khách 42 theo thứ tự <code>created_at DESC, id DESC</code>, LIMIT dừng sau 11 mục. Mỗi tệp migration một câu: hai câu thì Prisma chạy cả tệp như một khối giao dịch, và CONCURRENTLY từ chối (25001, bài 16.1).</p>')}
<p>"Đơn của tôi" dùng cursor của Prisma (<code>cursor: { id }, skip: 1</code>). Thứ nó gửi cho trang 2 — đáng đọc kỹ:</p>
${ans('vi', 'C7c — Đơn của tôi', code(F.MY_ORDERS, 'js') + out(O.C7_MYORDERS) + out(O.C7_CURSOR) + '<p>Prisma biến cursor thành một phép so dòng qua ba truy vấn con trên dòng cursor, rồi <code>OFFSET 1</code> để bỏ chính nó. Đúng, và nhanh nhờ chỉ mục ghép; viết tay sẽ là <code>WHERE (created_at, id) &lt; ($2, $3)</code>. Hai đơn pending trên cùng là hai đơn bạn đặt ở C4.</p>')}
<p>Và N+1 lần nữa, khi đã có chỉ mục:</p>
${out(O.C7_N1_SAU)}

<h4>C8 — test tích hợp trên database dựng từ migration</h4>
<p class="meo">💡 <code>npm test</code> chạy <code>scripts/dung-db-kiem-thu.js</code> trước: xoá <code>ctlab9_test</code>, tạo trống, cấp quyền cho hai role, áp <strong>migration của bạn</strong> bằng <code>migrate deploy</code>, ghi một bộ dữ liệu nhỏ bằng role app — rồi bộ chạy test của Node 22 (<code>node --test</code>, không cần cài gì) chạy <code>test/api.test.js</code> trên app Express thật và PostgreSQL thật. Đây là chỗ 0_init trung thực ở C2 trả công: với baseline sinh tự động, test "hai người mua" vẫn qua, nhưng một test về CHECK thì không — và chẳng ai biết.</p>
${code(F.DB_TEST, 'js')}
${code(F.TEST_RACE, 'js')}
${out(O.C8_TEST)}

<h4>C9 — vận hành: checklist, rồi diễn tập khôi phục</h4>
<p>Script 12 dòng của 16.3 (<code>sql/kiem-tra.sql</code>), chạy hai lần — bằng superuser và bằng app:</p>
${code(C9_KT_RUN, 'bash')}
${out(O.C9_KT)}
${out(O.C9_KT_APP)}
<p>Đọc từng dòng, và với mỗi ✗ hỏi <em>ai</em> sửa được. <strong>3</strong> và <strong>4</strong> đọc thiết lập của phiên hiện tại: ✗ với postgres trong psql (không giới hạn — phiên của chính bạn), ✓ với ctshop_app (thiết lập role ở C1). <strong>5–7</strong> là thiết lập máy chủ — không role, không migration nào đổi được; superuser làm, một lần:</p>
${code(C9_SUA)}
${out(O.C9_SUA)}
<p>Để ý bảng: <code>ALTER SYSTEM</code> chỉ ghi vào <code>postgresql.auto.conf</code> — chưa gì thay đổi cho tới khi khởi động lại. Sau đó:</p>
${out(O.C9_KT_SAU)}
<p><strong>8</strong> = 6 khoá ngoại không có chỉ mục (<code>order_item.product_id</code>, <code>product.category_id</code>, <code>category.parent_id</code>, <code>stock_movement.product_id</code>, <code>stock_movement.order_id</code>, <code>review.customer_id</code>). C7 đã đánh chỉ mục cho cái mà một màn hình cần; mấy cái kia chỉ làm chậm việc xoá sản phẩm hay danh mục — một quyết định cần ghi lại, không phải một dấu ✗ tự động. Và giờ <code>pg_stat_statements</code> trả lời "API tiêu thời gian vào đâu?" sau vài trăm request:</p>
${code(C9_TOP)}
${out(O.C9_TOP)}
<p>Báo cáo đứng đầu — 5 trong 25 lần gọi hỏi 2023–2024, khi 99 % thanh toán khớp và planner đọc cả bảng là đúng (xem thử thách thêm). Đó là kiểu cháy âm ỉ mà khung nhìn trực tiếp không bao giờ cho thấy. Cuối cùng là diễn tập khôi phục của Ch 15 — một bản sao lưu chưa từng khôi phục là một niềm hy vọng, không phải bản sao lưu:</p>
${out(O.C9_RESTORE)}
${code(C9_DIFF, 'bash')}
${out(O.C9_DEM)}
${out(O.C9_STATUS)}
${out(O.C9_APP)}
${bay('Bẫy — thứ bản dump không mang về.', 'Số dòng, tổng, lịch sử migration, app: y hệt. Nhưng nhìn chính database:', out(O.C9_ACL) + '<p><code>datacl</code> trống trên bản sao = mặc định, PUBLIC được CONNECT. REVOKE/GRANT CONNECT của C1 nằm trên đối tượng <em>database</em>, thứ mà <code>pg_dump</code> không có <code>--create</code> không dump (còn role thì không nằm trong bất kỳ bản dump một-database nào — <code>pg_dumpall --roles-only</code>, bài 15.1). Ghi vào sổ tay vận hành: khôi phục xong, chạy lại phần cấp database của roles.sql.</p>')}

<h3>5 · Tự kiểm — trạng thái cuối phải khớp</h3>
<ol>
<li><code>npm test</code>: 8 pass · <code>migrate status</code>: 5 migration, up to date · <code>migrate diff</code>: rỗng.</li>
<li><code>has_table_privilege('ctshop_app', 'shop._prisma_migrations', 'DELETE')</code> = f · thiết lập role 5s / 10s / 3s.</li>
<li><code>\\d shop.orders</code>: có <code>delivery_note</code>, không còn <code>note</code>, không trigger; hai chỉ mục <code>orders_customer_id_created_at_id_idx</code> và <code>payment_paid_at_idx</code> hợp lệ.</li>
</ol>
<ol>
<li>Vì sao <code>migrate resolve --applied 0_init</code> đúng trên ctlab9, và cùng lệnh đó có nghĩa gì sau một migration hỏng giữa chừng?</li>
<li>Bản đặt hàng đọc-sửa-ghi và bản nguyên tử đều chạy trong giao dịch. Vì sao chỉ một bản bán lố?</li>
<li>Tăng pool làm hết lỗi P2024 ở bài thử HOLD. Vì sao đó vẫn là cách sửa sai?</li>
</ol>
${details('Đáp án', '<ol><li>Baseline ghi nhận một sự thật: mọi đối tượng của 0_init đã có trong ctlab9 (bạn đã so, và đã phát lại 0_init lên một database trống). Sau một migration chạy dở, "applied" là sai — nó che một lược đồ không khớp cả trạng thái cũ lẫn mới; 16.1 chỉ resolve sau khi kiểm câu nào đã chạy, và theo quyết định của người chịu trách nhiệm.</li><li>Giao dịch không làm cho "đọc, tính trong JavaScript, ghi lại" thành nguyên tử: ở READ COMMITTED cả hai giao dịch đều đọc 1, giao dịch thứ hai chờ khoá dòng rồi ghi số 0 cũ của nó. Câu nguyên tử <code>UPDATE … SET stock = stock - 1 WHERE stock &gt;= 1</code> đánh giá lại điều kiện trên dòng mới nhất sau khi chờ — 0 dòng ⇒ 409.</li><li>Nguyên nhân là một kết nối bị giữ trong lúc gọi ra ngoài 300 ms. 20 kết nối mỗi tiến trình chỉ là giữ gấp 4 số kết nối idle in transaction kèm khoá dòng — 60 trên 97 cho ba tiến trình — và đỉnh tải sau cần nhiều hơn. Đưa cổng thanh toán ra ngoài giao dịch phục vụ cùng 400 lượt bằng 5 kết nối, nhanh gấp 6.</li></ol>')}

<h3>6 · Đáp án đầy đủ</h3>
<p>Mọi thứ nằm trong <code>lab9-solution.zip</code> (README của nó ghi đáp án từng phần nằm ở tệp nào và đúng các lệnh đưa một ctlab9 mới về trạng thái cuối). Phần lõi:</p>
${details('src/checkout.js — gomGio + laVaCham/voiThuLai + datHang', code(F.GOM_GIO + '\n\n' + F.RETRY + '\n' + F.CHECKOUT, 'js'))}
${details('src/routes/orders.js — thanh toán · src/loi.js — lỗi ⇒ HTTP', code(F.PAY, 'js') + code(F.LOI, 'js'))}
${details('5 migration', code(F.INIT_TAY) + code(F.EXPAND) + code(F.CONTRACT) + code(F.IDX1) + code(F.IDX2))}

<h3>7 · Bẫy</h3>
<div class="pitfall"><p><strong>Healthcheck không đụng bảng nào</strong> — báo "ok" trong khi mọi truy vấn thật đều hỏng. Kiểm đúng thứ app cần.</p></div>
<div class="pitfall"><p><strong>Baseline sinh tự động</strong> — không CHECK, SERIAL thay cho IDENTITY. Viết nốt nó, và chứng minh trên một database trống.</p></div>
<div class="pitfall"><p><strong><code>resolve --applied</code> theo phản xạ</strong> — đúng với baseline, sai với một migration hỏng (16.1).</p></div>
<div class="pitfall"><p><strong>Default privileges lan tới <code>_prisma_migrations</code></strong> — thu lại quyền của app.</p></div>
<div class="pitfall"><p><strong>BigInt → <code>Number</code>, tiền → số thực</strong> — id là chuỗi, tiền là Decimal.</p></div>
<div class="pitfall"><p><strong>Phân trang OFFSET trên danh sách đang thay đổi</strong> — lặp và sót dòng. Keyset.</p></div>
<div class="pitfall"><p><strong>N+1</strong> — truy vấn trong vòng lặp. Đếm số câu (<code>LOG_SQL=1</code>, <code>X-SQL-Count</code>); select lồng hoặc một câu SQL.</p></div>
<div class="pitfall"><p><strong>Đổi tên trong một migration, hoặc contract khi v1 còn chạy</strong> — P2022 trên production. Expand, deploy, tắt v1, contract.</p></div>
<div class="pitfall"><p><strong>Đọc-sửa-ghi trong giao dịch</strong> — vẫn bán lố. Một câu UPDATE nguyên tử với điều kiện trong WHERE.</p></div>
<div class="pitfall"><p><strong>Khoá giỏ hàng theo thứ tự khách bỏ vào</strong> — deadlock. Sắp theo id, và thử lại khi 40001/40P01 — kể cả 40P01 mà Prisma không gắn mã.</p></div>
<div class="pitfall"><p><strong>Gọi ra ngoài trong giao dịch</strong> — idle in transaction, khoá dòng, P2024/P2028 khi tải cao. Gọi bên ngoài, ghi trong giao dịch ngắn.</p></div>
<div class="pitfall"><p><strong><code>CREATE INDEX</code> thường trên bảng đang chạy</strong> — ghi phải chờ. CONCURRENTLY, đứng một mình trong tệp migration; lock_timeout trên role.</p></div>
<div class="pitfall"><p><strong>Thử tải trên chính database đang đo</strong> — chạy trên một bản dựng từ migration (ở đây ctlab9_test).</p></div>
<div class="pitfall"><p><strong>Một lần khôi phục "thành công"</strong> — so số dòng, chạy migrate status, khởi động app trên nó, kiểm quyền cấp database.</p></div>

<h3>8 · Thử thách thêm — và bạn đã học xong khoá</h3>
<ul>
<li><strong>Thử thách 1 · báo cáo 2 năm.</strong> <code>?from=2023-01&amp;to=2024-12</code> khớp 275.713 trên 277.376 thanh toán: planner đọc đủ 2.312 trang (133 ms, đứng đầu pg_stat_statements). Không chỉ mục nào giúp khi bạn cần 99 % một bảng. Dựng bảng tổng hợp theo tháng (materialized view làm mới mỗi đêm như Lab 6, hoặc bảng tổng do trigger giữ) và cho báo cáo đọc nó với các tháng đã chốt.</li>
<li><strong>Thử thách 2 · CHECK trong test.</strong> Thêm một test rằng giá âm hay phương thức thanh toán lạ bị <em>database</em> từ chối (Prisma không thấy các luật đó), và chạy nó một lần trên database test dựng từ 0_init <em>sinh tự động</em> để xem nó hỏng.</li>
<li><strong>Thử thách 3 · tiến trình thứ tư.</strong> Thêm một worker gửi email đơn hàng với PrismaClient riêng. Làm lại phép tính của C6, cho nó <code>application_name</code> riêng, và chỉ ra nó trong <code>pg_stat_activity</code> nhóm theo ứng dụng.</li>
<li><strong>Thử thách 4 · đọc thấy thứ mình vừa ghi.</strong> Với bản sao của Lab 8: chuyển "Đơn của tôi" sang replica, chứng minh ngay sau khi đặt hàng đơn mới chưa có ở đó — rồi sửa đúng như 16.4 ca 4.</li>
</ul>
<p><strong>Đó là lab cuối cùng.</strong> Bạn bắt đầu bằng <code>CREATE TABLE customer</code> ở Lab 1 và kết thúc với một API có test, nhận được một database production, sống sót qua deploy cuốn chiếu, bán món cuối đúng một lần và khôi phục được. Đi tiếp:</p>
${card('/exam?course=postgresql', '📝', 'Phòng thi — PostgreSQL: PE1 · PE2 · FE1 · FE2', 'Thi thực hành (việc SQL trên CT Shop, có giờ) và thi trắc nghiệm cuối khoá phủ mọi chương — có lời giải', 'MỞ →')}
<ul>
<li><strong>Chương 17</strong> đặt PostgreSQL cạnh SQL Server, MySQL và MongoDB — cùng các truy vấn CT Shop trên ba hệ SQL và dưới dạng document. Có ích khi đi làm và khi phỏng vấn: "vì sao chọn PostgreSQL ở đây?"</li>
<li>Giữ lại app: chuyển sang TypeScript (kiểu của Prisma đã sinh sẵn), đóng vào Docker cạnh PostgreSQL (khoá Docker), deploy lên VPS theo checklist (khoá Deploy VPS).</li>
</ul>
</div>
`;

export { O, F };   // deck pg-lab-9 + video pg-lab-9* đọc lại đúng các output này

export default {
  title: 'Lab 9 — CT Shop capstone: an API for the mobile app (Node + Prisma)|||Lab 9 — CT Shop capstone: API cho app di động (Node + Prisma)',
  slug: 'postgresql-lab-9-capstone-node-prisma-ct-shop',
  type: 'LESSON',
  description: 'Lab cuối khoá sau Chương 16: app Node 22 + Prisma 5.22 + Express 5 trên CT Shop 302.000 đơn — role owner/app + timeout, db pull + baseline 0_init sửa tay (11 CHECK, IDENTITY) + resolve --applied, BigInt/Decimal, keyset, N+1 (68 → 3 → 1 câu), expand/contract đổi tên cột khi v1 vẫn chạy (P2022), đặt hàng một giao dịch + hai người mua + deadlock + thử lại (40P01 Prisma không gắn mã), pool 3 × 5 < 97 và P2024 khi giữ kết nối, báo cáo $queryRaw + hàm cửa sổ, EXPLAIN → chỉ mục CONCURRENTLY (2.318 → 25 trang), test tích hợp trên DB dựng từ migration, checklist + diễn tập khôi phục. Output thật PostgreSQL 17.11.',
  content: `${G}${EN}${VI}`,
};
